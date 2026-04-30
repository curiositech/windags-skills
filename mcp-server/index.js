#!/usr/bin/env node

/**
 * WinDAGs MCP Server (standalone)
 *
 * Self-contained MCP server for the windags-skills plugin. Light deps —
 * no @workgroup-ai/core dependency.
 *
 * Retrieval (all local, no API keys):
 *   Stage 1 — Lexical:  wink-bm25 over SKILL.md frontmatter
 *   Stage 2 — Semantic: cosine vs bundled all-MiniLM-L6-v2 vectors (~800KB)
 *                       Query is embedded on-demand (Transformers.js, ~25MB
 *                       quantized model, downloaded once on first call,
 *                       cached forever in ~/.cache/transformers-js/)
 *   Stage 3 — Fusion:   reciprocal rank fusion (K=60)
 *
 * Stage 4 (cross-encoder rerank) and Stage 5 (attribution k-NN) live on
 * the /tools page Preview section. Not implemented here yet.
 *
 * Tools:
 *   - windags_skill_search    — top-K candidates (RRF cascade, descriptions only)
 *   - windags_skill_graft     — full SKILL.md bodies for primary + adjacency
 *   - windags_skill_reference — load one reference file on demand
 *   - windags_history         — recent /next-move predictions
 *
 * Telemetry: WINDAGS_TELEMETRY env var ("off" disables, "anonymous" default,
 * "full" sends raw task text). Currently a no-op pending the api.windags.ai
 * /events endpoint — flag is wired so users can opt out preemptively.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { embedQuery, loadCorpus, topKSemantic, rrfFuse } from "./cascade.js";

const require = createRequire(import.meta.url);
const bm25 = require("wink-bm25-text-search");
const nlp = require("wink-nlp-utils");
const yaml = require("js-yaml");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TELEMETRY_MODE = (process.env.WINDAGS_TELEMETRY ?? "anonymous").toLowerCase();
const TRANSFORMERS_CACHE = process.env.WINDAGS_MODEL_CACHE
  ?? path.join(process.env.HOME ?? ".", ".cache", "transformers-js");

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
// Stage 1 — Lexical (BM25)
// ---------------------------------------------------------------------------

let bm25Engine = null;

function ensureBm25Ready() {
  if (bm25Engine) return;
  if (cachedSkills.length === 0) {
    cachedSkills = loadSkillIndex();
    skillMap = new Map(cachedSkills.map((s) => [s.id, s]));
  }
  bm25Engine = bm25();
  bm25Engine.defineConfig({
    fldWeights: { name: 4, description: 2, tags: 3, category: 1, id_words: 2 },
    bm25Params: { k1: 1.5, b: 0.75, k: 1 },
  });
  bm25Engine.definePrepTasks([
    nlp.string.lowerCase,
    nlp.string.removeExtraSpaces,
    nlp.string.tokenize0,
    nlp.tokens.removeWords,
    nlp.tokens.stem,
    nlp.tokens.propagateNegations,
  ]);
  for (const s of cachedSkills) {
    bm25Engine.addDoc({
      name: s.name,
      description: (s.description || "").slice(0, 500),
      tags: (s.tags || []).join(" "),
      category: s.category,
      id_words: s.id.replace(/-/g, " "),
    }, s.id);
  }
  bm25Engine.consolidate();
}

function bm25Search(query, limit) {
  ensureBm25Ready();
  if (!query?.trim()) {
    return cachedSkills.slice(0, limit).map((s) => ({ id: s.id, score: 0 }));
  }
  const results = bm25Engine.search(query, limit);
  return results.map(([id, score]) => ({ id, score: +score.toFixed(4) }));
}

// ---------------------------------------------------------------------------
// Stage 2 + 3 — Semantic + RRF
// ---------------------------------------------------------------------------

const corpus = loadCorpus(path.join(__dirname, "data"));

async function cascadeSearch(query, limit) {
  ensureBm25Ready();
  const RECALL = Math.max(30, limit * 4);

  const lexical = bm25Search(query, RECALL);

  if (!corpus) {
    // No bundled embeddings → degrade gracefully to BM25-only.
    return lexical.slice(0, limit).map((r, rank) => ({
      ...r,
      fusedScore: 1 / (60 + rank + 1),
      breakdown: { lexical: { rank: rank + 1 } },
    }));
  }

  let semantic = [];
  try {
    const qVec = await embedQuery(query, TRANSFORMERS_CACHE);
    semantic = topKSemantic(qVec, corpus, RECALL);
  } catch (err) {
    // Model load failed (offline + no cache, or disk full). Fall back to BM25.
    semantic = [];
  }

  const fused = rrfFuse(
    [
      { name: "lexical", items: lexical },
      { name: "semantic", items: semantic },
    ],
    { K: 60, limit },
  );

  return fused;
}

function decorate(results) {
  return results.map((r) => {
    const meta = skillMap.get(r.id);
    return {
      id: r.id,
      name: meta?.name ?? r.id,
      description: meta?.description ?? "",
      category: meta?.category ?? "Uncategorized",
      tags: meta?.tags ?? [],
      score: r.fusedScore,
      breakdown: r.breakdown,
    };
  });
}

// ---------------------------------------------------------------------------
// Graft — load real SKILL.md bodies for the top primaries
// ---------------------------------------------------------------------------

async function localGraft(task, count) {
  const recall = await cascadeSearch(task, count + 6);
  const primaryIds = recall.slice(0, count).map((r) => r.id);
  const adjacencyIds = recall.slice(count, count + 4).map((r) => r.id);

  const primary = primaryIds.map((id) => {
    const file = readSkillFile(id);
    const meta = skillMap.get(id);
    if (!file) {
      return {
        id,
        name: meta?.name ?? id,
        body: `# ${meta?.name ?? id}\n\n_(Skill body unavailable on this install.)_`,
        category: meta?.category,
        assets: { references: [], scripts: [], templates: [], examples: [] },
      };
    }
    return {
      id,
      name: file.frontmatter.name || id,
      body: file.body.trimStart(),
      frontmatter: file.frontmatter,
      category: file.frontmatter.category,
      assets: listSkillAssets(id),
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

  const stage = corpus ? "lexical+semantic+rrf" : "lexical-only (no embeddings.bin found)";

  return {
    task,
    primary,
    adjacencies,
    cascade: { stage, recall: recall.length, primary: primary.length },
    reasoning:
      `Local cascade (${stage}). Primaries: ${primaryIds.join(", ")}. ` +
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

const server = new McpServer({ name: "windags", version: "0.2.0" });

server.tool(
  "windags_skill_search",
  "Search the WinDAGs skill catalog with the local cascade: BM25 lexical + " +
    "all-MiniLM-L6-v2 semantic similarity, fused via reciprocal rank fusion. " +
    "Returns ranked candidates with descriptions only (no full bodies). Pair " +
    "with windags_skill_graft to load the winners. Zero API keys.",
  {
    query: z.string().describe("Natural language search query"),
    limit: z.number().optional().default(10).describe("Max results (default: 10)"),
  },
  async ({ query, limit }) => {
    try {
      const fused = await cascadeSearch(query, limit ?? 10);
      const skills = decorate(fused);
      return {
        content: [{ type: "text", text: JSON.stringify({
          query,
          stage: corpus ? "lexical+semantic+rrf" : "lexical-only",
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
    "(lexical + semantic + RRF), returns full SKILL.md bodies for the top N " +
    "primary skills, plus name/description/category for adjacent skills the " +
    "agent should be aware of, plus a per-skill asset manifest (references, " +
    "scripts, templates, examples) the agent can call windags_skill_reference " +
    "on. Local-only. Zero API keys. The MiniLM model is downloaded once on " +
    "first call (~25MB).",
  {
    task: z.string().describe("Description of the task you need expertise for"),
    count: z.number().optional().default(4).describe("Number of primary skills to graft (default: 4)"),
  },
  async ({ task, count }) => {
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
    try {
      const skillDir = path.join(skillsDir, skill_id);
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
        const assets = listSkillAssets(skill_id);
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

async function main() {
  // Surface a one-line status to stderr so logs in MCP clients are interpretable.
  console.error(
    `[windags-mcp] ${cachedSkills.length || "?"} skills, corpus=${corpus ? `${corpus.meta.count}@${corpus.meta.dim}d` : "none"}, telemetry=${TELEMETRY_MODE}`,
  );
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("WinDAGs MCP server failed:", err);
  process.exit(1);
});
