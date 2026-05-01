#!/usr/bin/env node

/**
 * WinDAGs MCP Server (standalone)
 *
 * Self-contained MCP server for the windags-skills plugin. Light deps —
 * no @workgroup-ai/core dependency.
 *
 * Retrieval (all local, no API keys):
 *   Stage 1 — Lexical:     wink-bm25 over SKILL.md frontmatter
 *   Stage 2 — Semantic:    cosine vs bundled all-MiniLM-L6-v2 vectors (~800KB).
 *                          Query embedded on-demand (Transformers.js, ~25MB
 *                          quantized, downloaded once, cached forever).
 *   Stage 3 — Fusion:      reciprocal rank fusion (K=60).
 *   Stage 4 — Cross-encoder: Xenova/ms-marco-MiniLM-L-6-v2 reranks the RRF
 *                            top-30 by joint (query, candidate) scoring
 *                            (~25MB quantized, lazy-loaded, falls back to
 *                            RRF order if the model can't load).
 *   Stage 5 — Attribution: per-user k-NN over ~/.windags/triples/. Boosts
 *                          skills that appeared in past /next-move predictions
 *                          for semantically similar prompts. Fails safe to
 *                          identity when no triples exist.
 *
 * Tools:
 *   - windags_skill_search    — top-K candidates (RRF + rerank cascade, descriptions only)
 *   - windags_skill_graft     — full SKILL.md bodies for primary + adjacency
 *   - windags_skill_reference — load one reference file on demand
 *   - windags_history         — recent /next-move predictions
 *
 * Telemetry: WINDAGS_TELEMETRY env var ("off" disables, "anonymous" default,
 * "full" sends raw task text). Fire-and-forget POST to api.windags.ai/v1/events
 * with a hashed machine ID, sampled to once per 24h. See telemetry.js.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import * as os from "os";
import { embedQuery, loadCorpus, topKSemantic, rrfFuse, crossEncoderRerank, attributionBoost } from "./cascade.js";
import { loadUserSkills, readUserSkillFile, listUserSkillAssets } from "./user-skills.js";
import { recordEvent } from "./telemetry.js";
import { buildModelTierMap, suggestTierForCategory } from "./provider-models.js";
import { validatePredictedDAG } from "./validate-prediction.js";
import { estimateDAGCostFromSpec } from "./cost-estimator.js";

const require = createRequire(import.meta.url);
const bm25 = require("wink-bm25-text-search");
const nlp = require("wink-nlp-utils");
const yaml = require("js-yaml");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TELEMETRY_MODE = (process.env.WINDAGS_TELEMETRY ?? "anonymous").toLowerCase();
const TRANSFORMERS_CACHE = process.env.WINDAGS_MODEL_CACHE
  ?? path.join(process.env.HOME ?? ".", ".cache", "transformers-js");

// Stage 5 reads /next-move triples from this directory. Per-user, never
// uploaded. Override with WINDAGS_TRIPLES_DIR for tests / non-default homes.
const TRIPLES_DIR = process.env.WINDAGS_TRIPLES_DIR
  ?? path.join(os.homedir(), ".windags", "triples");

// User skills: opt-out via WINDAGS_USER_SKILLS=off. Default on. Loaded lazily
// on first cascade call so the model is only fetched when the user actually
// uses the search tool.
const USER_SKILLS_ENABLED = (process.env.WINDAGS_USER_SKILLS ?? "on").toLowerCase() !== "off";

// ---------------------------------------------------------------------------
// Skill loader (reads SKILL.md frontmatter + body from the bundled skills/)
// ---------------------------------------------------------------------------

function findSkillsDir() {
  const candidates = [
    path.resolve(__dirname, "..", "skills"),
    path.resolve(process.cwd(), "skills"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const skillsDir = findSkillsDir();
let cachedSkills = [];
let skillMap = new Map();

function readSkillFile(id) {
  const md = path.join(skillsDir, id, "SKILL.md");
  if (!fs.existsSync(md)) return null;
  const raw = fs.readFileSync(md, "utf-8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  let fm;
  try { fm = yaml.load(m[1]) ?? {}; } catch { return null; }
  return { id, frontmatter: fm, body: m[2] ?? "", raw };
}

function loadSkillIndex() {
  if (!fs.existsSync(skillsDir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = readSkillFile(entry.name);
    if (!file) continue;
    const fm = file.frontmatter;
    out.push({
      id: file.id,
      name: fm.name || file.id,
      description: fm.description || "",
      category: fm.category || "Uncategorized",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
    });
  }
  return out;
}

function listSkillAssets(skillId) {
  const dir = path.join(skillsDir, skillId);
  if (!fs.existsSync(dir)) return { references: [], scripts: [], templates: [], examples: [] };
  const out = { references: [], scripts: [], templates: [], examples: [] };
  for (const sub of Object.keys(out)) {
    const subDir = path.join(dir, sub);
    if (!fs.existsSync(subDir)) continue;
    for (const f of fs.readdirSync(subDir)) {
      if (f.startsWith(".") || f === "INDEX.md") continue;
      try {
        const stat = fs.statSync(path.join(subDir, f));
        out[sub].push({ path: `${sub}/${f}`, bytes: stat.size });
      } catch { /* skip */ }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Catalog (BM25 + corpus, bundled + user skills, lazy-loaded)
// ---------------------------------------------------------------------------
//
// We build the BM25 index and the merged semantic corpus on first cascade
// call, not at startup, because user-skill loading needs the embedder, which
// downloads ~25MB on first use. Building lazily keeps `windags-mcp --help`
// (and the MCP handshake) instant.

let userSkillSourcePaths = new Map(); // id ("user:slug") -> absolute SKILL.md path
let _catalogPromise = null;

function buildBm25(skills) {
  const engine = bm25();
  engine.defineConfig({
    fldWeights: { name: 4, description: 2, tags: 3, category: 1, id_words: 2 },
    bm25Params: { k1: 1.5, b: 0.75, k: 1 },
  });
  engine.definePrepTasks([
    nlp.string.lowerCase,
    nlp.string.removeExtraSpaces,
    nlp.string.tokenize0,
    nlp.tokens.removeWords,
    nlp.tokens.stem,
    nlp.tokens.propagateNegations,
  ]);
  for (const s of skills) {
    engine.addDoc({
      name: s.name,
      description: (s.description || "").slice(0, 500),
      tags: (s.tags || []).join(" "),
      category: s.category,
      id_words: s.id.replace(/^user:/, "").replace(/-/g, " "),
    }, s.id);
  }
  engine.consolidate();
  return engine;
}

function mergeCorpora(bundled, user) {
  if (!bundled && !user?.vectors) return null;
  if (bundled && !user?.vectors) return bundled;
  if (!bundled && user?.vectors) {
    return {
      meta: { model: "Xenova/all-MiniLM-L6-v2", dim: user.dim, count: user.count, ids: [...user.ids] },
      vectors: user.vectors,
    };
  }
  // Both present — concat the vectors and id list.
  if (bundled.meta.dim !== user.dim) {
    throw new Error(`corpus dim mismatch: bundled=${bundled.meta.dim} user=${user.dim}`);
  }
  const vecs = new Float32Array(bundled.vectors.length + user.vectors.length);
  vecs.set(bundled.vectors, 0);
  vecs.set(user.vectors, bundled.vectors.length);
  return {
    meta: {
      model: bundled.meta.model,
      dim: bundled.meta.dim,
      count: bundled.meta.count + user.count,
      ids: [...bundled.meta.ids, ...user.ids],
    },
    vectors: vecs,
  };
}

async function ensureCatalogReady() {
  if (_catalogPromise) return _catalogPromise;
  _catalogPromise = (async () => {
    const bundledIndex = loadSkillIndex();
    const bundledCorpus = loadCorpus(path.join(__dirname, "data"));

    let userResult = null;
    if (USER_SKILLS_ENABLED) {
      try {
        userResult = await loadUserSkills({
          embedFn: (text) => embedQuery(text, TRANSFORMERS_CACHE),
          bundledSkillsDir: skillsDir,
        });
      } catch (err) {
        console.error(`[windags-mcp] user-skills load failed (continuing with bundled only): ${err.message}`);
      }
    }

    const allSkills = [...bundledIndex, ...(userResult?.skills ?? [])];
    cachedSkills = allSkills;
    skillMap = new Map(allSkills.map((s) => [s.id, s]));
    userSkillSourcePaths = userResult?.sourcePaths ?? new Map();

    const bm25Engine = buildBm25(allSkills);
    const mergedCorpus = mergeCorpora(bundledCorpus, userResult);

    return {
      bm25Engine,
      corpus: mergedCorpus,
      userCount: userResult?.count ?? 0,
      bundledCount: bundledIndex.length,
    };
  })();
  return _catalogPromise;
}

function bm25Search(engine, query, limit) {
  if (!query?.trim()) {
    return cachedSkills.slice(0, limit).map((s) => ({ id: s.id, score: 0 }));
  }
  const results = engine.search(query, limit);
  return results.map(([id, score]) => ({ id, score: +score.toFixed(4) }));
}

// ---------------------------------------------------------------------------
// Stages 2 + 3 + 4 — Semantic + RRF + Cross-encoder rerank
// ---------------------------------------------------------------------------

/**
 * Run the cascade. Returns { results, stage } where `stage` describes which
 * stages actually contributed (used in tool responses for transparency).
 *
 * Callers can opt out of rerank by passing `rerank: false` — useful when
 * RRF order is good enough and the rerank's first-call latency would be
 * a regression.
 */
async function cascadeSearch(query, limit, { rerank = true } = {}) {
  const { bm25Engine, corpus } = await ensureCatalogReady();
  const RECALL = Math.max(30, limit * 4);

  const lexical = bm25Search(bm25Engine, query, RECALL);

  if (!corpus) {
    // No bundled embeddings → degrade gracefully to BM25-only.
    const results = lexical.slice(0, limit).map((r, rank) => ({
      ...r,
      fusedScore: 1 / (60 + rank + 1),
      breakdown: { lexical: { rank: rank + 1 } },
    }));
    return { results, stage: "lexical-only" };
  }

  let semantic = [];
  let semanticOk = false;
  let qVec = null;
  try {
    qVec = await embedQuery(query, TRANSFORMERS_CACHE);
    semantic = topKSemantic(qVec, corpus, RECALL);
    semanticOk = true;
  } catch {
    // Model load failed (offline + no cache, or disk full). Fall back to BM25.
    semantic = [];
  }

  // Fuse first, with the recall pool widened so the cross-encoder has at
  // least 30 candidates to choose from regardless of the user's limit.
  const RERANK_POOL = Math.max(30, limit * 4);
  const fused = rrfFuse(
    [
      { name: "lexical", items: lexical },
      { name: "semantic", items: semantic },
    ],
    { K: 60, limit: RERANK_POOL },
  );

  const baseStage = semanticOk ? "lexical+semantic+rrf" : "lexical+rrf (semantic unavailable)";

  // Working set: post-RRF candidates. Stage 4 (cross-encoder) reorders them;
  // Stage 5 (attribution) boosts skills that appeared in past /next-move
  // triples for semantically similar prompts.
  let working = fused;
  let stage = baseStage;

  if (rerank && working.length > 0) {
    try {
      const candidateTexts = working.map((r) => {
        const meta = skillMap.get(r.id);
        const name = meta?.name ?? r.id;
        const desc = (meta?.description ?? "").slice(0, 500);
        return desc ? `${name}. ${desc}` : name;
      });
      working = await crossEncoderRerank(query, working, candidateTexts, RERANK_POOL, TRANSFORMERS_CACHE);
      stage = `${stage}+cross-encoder`;
    } catch {
      // Rerank model unavailable → silently keep RRF order.
      stage = `${stage}+rerank-skipped`;
    }
  }

  // Stage 5 — Attribution k-NN over local /next-move triple history.
  // No-op for first-time users; failure-safe if anything goes wrong.
  if (qVec && working.length > 0) {
    try {
      const boosted = await attributionBoost(qVec, working, TRIPLES_DIR, {
        cacheDir: TRANSFORMERS_CACHE,
      });
      if (boosted && boosted.length) {
        working = boosted;
        stage = `${stage}+attribution`;
      }
    } catch {
      // Attribution is opportunistic; never block the cascade on it.
    }
  }

  return { results: working.slice(0, limit), stage };
}

function decorate(results) {
  return results.map((r) => {
    const meta = skillMap.get(r.id);
    const out = {
      id: r.id,
      name: meta?.name ?? r.id,
      description: meta?.description ?? "",
      category: meta?.category ?? "Uncategorized",
      tags: meta?.tags ?? [],
      score: r.fusedScore,
      breakdown: r.breakdown,
    };
    if (typeof r.crossScore === "number") out.crossScore = r.crossScore;
    if (r.attribution) out.attribution = r.attribution;
    return out;
  });
}

// ---------------------------------------------------------------------------
// Graft — load real SKILL.md bodies for the top primaries
// ---------------------------------------------------------------------------

async function localGraft(task, count) {
  const { results: recall, stage: cascadeStage } = await cascadeSearch(task, count + 6);
  const primaryIds = recall.slice(0, count).map((r) => r.id);
  const adjacencyIds = recall.slice(count, count + 4).map((r) => r.id);

  const primary = primaryIds.map((id) => {
    const meta = skillMap.get(id);
    const isUser = id.startsWith("user:");
    const file = isUser
      ? readUserSkillFile(userSkillSourcePaths.get(id))
      : readSkillFile(id);
    if (!file) {
      return {
        id,
        name: meta?.name ?? id,
        body: `# ${meta?.name ?? id}\n\n_(Skill body unavailable on this install.)_`,
        category: meta?.category,
        source: isUser ? "user" : "bundled",
        assets: { references: [], scripts: [], templates: [], examples: [] },
      };
    }
    return {
      id,
      name: file.frontmatter.name || id,
      body: file.body.trimStart(),
      frontmatter: file.frontmatter,
      category: file.frontmatter.category,
      source: isUser ? "user" : "bundled",
      assets: isUser
        ? listUserSkillAssets(userSkillSourcePaths.get(id))
        : listSkillAssets(id),
    };
  });

  const adjacencies = adjacencyIds.map((id) => {
    const meta = skillMap.get(id);
    return {
      id,
      name: meta?.name ?? id,
      description: meta?.description ?? "",
      category: meta?.category,
    };
  });

  return {
    task,
    primary,
    adjacencies,
    cascade: { stage: cascadeStage, recall: recall.length, primary: primary.length },
    reasoning:
      `Local cascade (${cascadeStage}). Primaries: ${primaryIds.join(", ")}. ` +
      `Adjacencies surface neighboring skills for awareness without burning context on full bodies.`,
  };
}

// ---------------------------------------------------------------------------
// Triple Store (recent /next-move predictions)
// ---------------------------------------------------------------------------

function listTriples(projectPath, limit) {
  const triplesDir = path.join(projectPath, ".windags", "triples");
  if (!fs.existsSync(triplesDir)) return [];
  const files = fs.readdirSync(triplesDir).filter((f) => f.endsWith(".json"));
  const triples = [];
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(triplesDir, file), "utf-8"));
      if (data.predicted_dag) triples.push(data);
    } catch { /* skip corrupt */ }
  }
  triples.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return triples.slice(0, limit);
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({ name: "windags", version: "0.5.0" });

// Hard limits on batch payloads. Mirrors the monorepo MCP.
const MAX_BATCH_QUERIES = 20;
const MAX_GRAFT_PRIMARY = 3;

// Lazy tier map (built once on first node_requirements / estimate_cost call)
let _cachedTierMap = null;
function getTierMap() {
  if (!_cachedTierMap) _cachedTierMap = buildModelTierMap();
  return _cachedTierMap;
}

server.tool(
  "windags_skill_search",
  "Search the WinDAGs skill catalog with the local cascade: BM25 lexical + " +
    "all-MiniLM-L6-v2 semantic + reciprocal rank fusion + ms-marco-MiniLM-L-6-v2 " +
    "cross-encoder rerank + per-user attribution k-NN over local /next-move " +
    "history (when available). Returns ranked candidates with descriptions only " +
    "(no full bodies). Pair with windags_skill_graft to load the winners. " +
    "Zero API keys, all local.",
  {
    query: z.string().describe("Natural language search query"),
    limit: z.number().optional().default(10).describe("Max results (default: 10)"),
  },
  async ({ query, limit }) => {
    recordEvent({ toolName: "windags_skill_search", taskText: query });
    try {
      const { results, stage } = await cascadeSearch(query, limit ?? 10);
      const skills = decorate(results);
      return {
        content: [{ type: "text", text: JSON.stringify({
          query,
          stage,
          total_matches: skills.length,
          skills,
        }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

server.tool(
  "windags_skill_graft",
  "Get expert domain knowledge for a task. Runs the local cascade " +
    "(lexical + semantic + RRF + cross-encoder rerank, plus per-user " +
    "attribution k-NN over local /next-move history when available), " +
    "returns full SKILL.md bodies for the top N primary skills, plus " +
    "name/description/category for adjacent skills the agent should be " +
    "aware of, plus a per-skill asset manifest (references, scripts, " +
    "templates, examples) the agent can call windags_skill_reference on. " +
    "Local-only. Zero API keys. Two MiniLM models (~25MB each, bi-encoder + " +
    "cross-encoder) are downloaded once on first call.",
  {
    task: z.string().describe("Description of the task you need expertise for"),
    count: z.number().optional().default(4).describe("Number of primary skills to graft (default: 4)"),
  },
  async ({ task, count }) => {
    recordEvent({ toolName: "windags_skill_graft", taskText: task });
    try {
      const n = Math.max(1, Math.min(count ?? 4, 8));
      const result = await localGraft(task, n);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

server.tool(
  "windags_skill_reference",
  "Load the full content of a reference file from a skill. Use when a grafted " +
    "skill's asset manifest indicates deeper material is worth pulling into " +
    "context. Path-traversal safe.",
  {
    skill_id: z.string().describe("The skill ID (e.g., 'caching-strategies')"),
    file_path: z.string().describe("Path within the skill directory (e.g., 'references/redis-patterns.md')"),
  },
  async ({ skill_id, file_path }) => {
    recordEvent({ toolName: "windags_skill_reference", taskText: `${skill_id}:${file_path}` });
    try {
      // Resolve the skill directory: bundled lives under skillsDir/<id>,
      // user-defined lives at the parent of the SKILL.md path we cached.
      let skillDir;
      if (skill_id.startsWith("user:")) {
        // Force a catalog load so userSkillSourcePaths is populated.
        await ensureCatalogReady();
        const sourcePath = userSkillSourcePaths.get(skill_id);
        if (!sourcePath) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: `User skill '${skill_id}' not found` }) }],
            isError: true,
          };
        }
        skillDir = path.dirname(sourcePath);
      } else {
        skillDir = path.join(skillsDir, skill_id);
      }
      if (!fs.existsSync(skillDir)) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: `Skill '${skill_id}' not found` }) }],
          isError: true,
        };
      }
      const normalized = file_path.replace(/\.\./g, "").replace(/^\//, "");
      const fullPath = path.join(skillDir, normalized);
      if (!fullPath.startsWith(skillDir + path.sep) && fullPath !== skillDir) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "Invalid path" }) }],
          isError: true,
        };
      }
      if (!fs.existsSync(fullPath)) {
        const assets = skill_id.startsWith("user:")
          ? listUserSkillAssets(userSkillSourcePaths.get(skill_id))
          : listSkillAssets(skill_id);
        const available = [...assets.references, ...assets.scripts, ...assets.templates, ...assets.examples]
          .map((a) => a.path);
        return {
          content: [{ type: "text", text: JSON.stringify({
            error: `File '${file_path}' not found in skill '${skill_id}'`,
            available_files: available,
          }, null, 2) }],
          isError: true,
        };
      }
      const content = fs.readFileSync(fullPath, "utf-8");
      return { content: [{ type: "text", text: content }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

server.tool(
  "windags_history",
  "View recent /next-move predictions and feedback for a project.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    limit: z.number().optional().default(10).describe("Max entries (default: 10)"),
  },
  async ({ project_path, limit }) => {
    recordEvent({ toolName: "windags_history" });
    try {
      const triples = listTriples(path.resolve(project_path), limit ?? 10);
      const history = triples.map((t) => ({
        id: t.id,
        timestamp: t.timestamp,
        title: t.predicted_dag?.title,
        confidence: t.predicted_dag?.confidence,
        classification: t.predicted_dag?.problem_classification,
        waves: t.predicted_dag?.waves?.length,
        accepted: t.feedback?.accepted ?? null,
      }));
      return {
        content: [{ type: "text", text: JSON.stringify({ project: project_path, total: triples.length, history }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 5: windags_skill_search_batch
// ---------------------------------------------------------------------------

server.tool(
  "windags_skill_search_batch",
  "Run multiple skill searches in one call. Returns results for each query in the same order. " +
    "Use when planning a multi-node DAG so you don't pay N round-trips for N nodes. Same local " +
    "cascade as windags_skill_search. Hard cap of " + MAX_BATCH_QUERIES + " queries per call.",
  {
    queries: z
      .array(
        z.object({
          query: z.string().describe("Natural language search query"),
          limit: z.number().optional().default(10).describe("Max results for this query (default: 10)"),
        }),
      )
      .min(1)
      .describe("Array of {query, limit?} — one entry per node you're planning"),
  },
  async ({ queries }) => {
    try {
      if (queries.length > MAX_BATCH_QUERIES) {
        return {
          content: [{ type: "text", text: JSON.stringify({ success: false, error: `Too many queries: ${queries.length}. Max is ${MAX_BATCH_QUERIES}.` }) }],
          isError: true,
        };
      }
      recordEvent({ toolName: "windags_skill_search_batch", taskText: queries.map((q) => q.query).join(" || ") });
      const results = await Promise.all(
        queries.map(async ({ query, limit }) => {
          const { results: raw, stage } = await cascadeSearch(query, limit ?? 10);
          return { query, stage, total_matches: raw.length, skills: decorate(raw) };
        }),
      );
      return {
        content: [{ type: "text", text: JSON.stringify({ batch_size: queries.length, results }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 6: windags_skill_graft_batch
// ---------------------------------------------------------------------------

server.tool(
  "windags_skill_graft_batch",
  "Run multiple skill grafts in one call. Returns full skill bodies + adjacencies for each task. " +
    "Use when materializing a multi-node DAG so you have expertise for every node up-front. " +
    "Per-task primary count is capped at " + MAX_GRAFT_PRIMARY + " — call windags_skill_reference for full reference " +
    "contents when needed. Hard cap of " + MAX_BATCH_QUERIES + " tasks per call.",
  {
    tasks: z
      .array(
        z.object({
          task: z.string().describe("Description of the task you need expertise for"),
          count: z.number().optional().default(2).describe("Primary skills to graft (capped at " + MAX_GRAFT_PRIMARY + ")"),
        }),
      )
      .min(1)
      .describe("Array of {task, count?} — one entry per node you're materializing"),
  },
  async ({ tasks }) => {
    try {
      if (tasks.length > MAX_BATCH_QUERIES) {
        return {
          content: [{ type: "text", text: JSON.stringify({ success: false, error: `Too many tasks: ${tasks.length}. Max is ${MAX_BATCH_QUERIES}.` }) }],
          isError: true,
        };
      }
      recordEvent({ toolName: "windags_skill_graft_batch", taskText: tasks.map((t) => t.task).join(" || ") });
      const results = await Promise.all(
        tasks.map(async ({ task, count }) => {
          const n = Math.min(count ?? 2, MAX_GRAFT_PRIMARY);
          return localGraft(task, n);
        }),
      );
      return {
        content: [{ type: "text", text: JSON.stringify({ batch_size: tasks.length, results }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 7: windags_node_requirements
// ---------------------------------------------------------------------------

server.tool(
  "windags_node_requirements",
  "Get the per-node requirements a DAG planner needs in order to emit a fully-spec'd node: " +
    "allowed-tools (from frontmatter), pairs-with relationships, suggested model_tier, and " +
    "provider-mapped model IDs. Returned model_options use REAL provider-native IDs " +
    "(e.g. 'gpt-5.4-nano', 'llama-3.1-8b-instant'), not the abstract Anthropic-only labels " +
    "'haiku'/'sonnet'/'opus'. Pass skill_ids[] for batch lookup.",
  {
    skill_ids: z
      .array(z.string())
      .min(1)
      .max(50)
      .describe("One or more skill IDs to look up"),
  },
  async ({ skill_ids }) => {
    try {
      // Make sure the catalog is loaded so skillMap is populated
      await ensureCatalogReady();
      const tierMap = getTierMap();

      const requirements = skill_ids.map((id) => {
        const meta = skillMap.get(id);
        if (!meta) {
          // Try reading the SKILL.md directly for bundled skills (skillMap may
          // only have the indexed fields, not the full frontmatter)
          const file = id.startsWith("user:")
            ? readUserSkillFile(userSkillSourcePaths.get(id))
            : readSkillFile(id);
          if (!file) return { skill_id: id, error: `Skill '${id}' not found` };
          const fm = file.frontmatter || {};
          const allowedTools = Array.isArray(fm["allowed-tools"])
            ? fm["allowed-tools"]
            : (fm["allowed-tools"] || "").split(",").map((s) => s.trim()).filter(Boolean);
          const pairsWith = Array.isArray(fm["pairs-with"]) ? fm["pairs-with"] : [];
          const category = fm.category || (fm.metadata && fm.metadata.category) || "Uncategorized";
          const tier = suggestTierForCategory(category);
          return {
            skill_id: id,
            name: fm.name || id,
            category,
            allowed_tools: allowedTools,
            pairs_with: pairsWith,
            recommended_model_tier: tier,
            model_options: tierMap[tier] || [],
          };
        }
        const tier = suggestTierForCategory(meta.category || "");
        return {
          skill_id: meta.id,
          name: meta.name || meta.id,
          category: meta.category || "Uncategorized",
          allowed_tools: Array.isArray(meta.tools) ? meta.tools : [],
          pairs_with: Array.isArray(meta.pairsWith) ? meta.pairsWith : [],
          recommended_model_tier: tier,
          model_options: tierMap[tier] || [],
        };
      });

      recordEvent({ toolName: "windags_node_requirements", taskText: skill_ids.join(",") });

      return {
        content: [{ type: "text", text: JSON.stringify({
          requirements,
          tier_legend: {
            fast: "Cheapest + fastest. Use for classification, formatting, mechanical transforms.",
            balanced: "Default. Use for most coding, planning, and reasoning tasks.",
            powerful: "Reserve for deep architecture, hard reasoning, or final-output synthesis.",
          },
          all_tier_options: tierMap,
        }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 8: windags_validate_dag
// ---------------------------------------------------------------------------

server.tool(
  "windags_validate_dag",
  "Validate a DAG JSON object against the PredictedDAG schema (waves, nodes, dependencies, " +
    "topology, premortem, confidence). Returns {valid: boolean, errors: string[]}. Use during " +
    "multi-step planning to catch malformed DAGs before committing them.",
  {
    dag: z.unknown().describe("The DAG object to validate (any JSON-shaped value)"),
  },
  async ({ dag }) => {
    try {
      const result = validatePredictedDAG(dag);
      recordEvent({ toolName: "windags_validate_dag" });
      if (result.success) {
        return {
          content: [{ type: "text", text: JSON.stringify({
            valid: true,
            errors: [],
            title: result.data.title,
            topology: result.data.topology ?? "dag",
            wave_count: result.data.waves.length,
            node_count: result.data.waves.reduce((s, w) => s + w.nodes.length, 0),
            confidence: result.data.confidence,
          }, null, 2) }],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify({ valid: false, errors: result.errors }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 9: windags_estimate_cost
// ---------------------------------------------------------------------------

server.tool(
  "windags_estimate_cost",
  "Estimate execution cost for a planned DAG. Input: nodes[] with skillIds + dependencies + " +
    "description, plus a defaultModel tier. Returns total USD, total tokens, and per-node " +
    "breakdown. Char-based estimator (no tokenizer) — treat as planning-time order of " +
    "magnitude, not a billing prediction. Pricing calibrated to Anthropic Claude tiers " +
    "(haiku/sonnet/opus); other providers will produce reasonable but imperfect estimates.",
  {
    nodes: z
      .array(
        z.object({
          id: z.string().describe("Node ID (must be unique within the DAG)"),
          skillIds: z.array(z.string()).describe("Skill IDs whose bodies will be injected"),
          description: z.string().describe("Natural-language description of what this node does"),
          dependencies: z.array(z.string()).describe("IDs of upstream nodes"),
          model: z.enum(["haiku", "sonnet", "opus"]).optional().describe("Override the default tier"),
          referenceFileCount: z.number().optional().describe("Reference files this node will load (default: 0)"),
        }),
      )
      .min(1),
    defaultModel: z.enum(["haiku", "sonnet", "opus"]).default("sonnet"),
  },
  async ({ nodes, defaultModel }) => {
    try {
      recordEvent({ toolName: "windags_estimate_cost", taskText: `${nodes.length} nodes` });
      const result = estimateDAGCostFromSpec({
        nodes,
        defaultModel,
        skillsDir,
      });
      return {
        content: [{ type: "text", text: JSON.stringify({
          total_cost_usd: Math.round(result.totalCostUsd * 10000) / 10000,
          total_tokens: result.totalTokens,
          node_count: nodes.length,
          default_model: defaultModel,
          per_node: result.perNode,
        }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  },
);

async function main() {
  // Surface a one-line status to stderr so logs in MCP clients are interpretable.
  // Catalog (BM25 + corpus + user skills) loads lazily on first tool call.
  const bundledCount = (() => {
    try { return fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).length; }
    catch { return "?"; }
  })();
  console.error(
    `[windags-mcp] ${bundledCount} bundled skills, user-skills=${USER_SKILLS_ENABLED ? "on" : "off"}, telemetry=${TELEMETRY_MODE}`,
  );
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("WinDAGs MCP server failed:", err);
  process.exit(1);
});
