#!/usr/bin/env node

/**
 * WinDAGs MCP Server (standalone)
 *
 * Self-contained MCP server for the windags-skills plugin. Light deps only —
 * no @workgroup-ai/core dependency, no native modules, no ML model downloads.
 *
 * Retrieval strategy:
 *   - When online: forward graft/reference to api.windags.ai (server-side
 *     cascade: BM25 + attribution + future Tool2Vec/cross-encoder).
 *   - When offline or the server is reachable but empty: fall back to local
 *     wink-bm25 over the bundled SKILL.md frontmatter.
 *
 * Tools:
 *   - windags_skill_search    — top-K candidates (cheap, descriptions only)
 *   - windags_skill_graft     — full skill bodies + reference manifests
 *   - windags_skill_reference — load one reference file on demand
 *   - windags_history         — recent /next-move predictions
 *
 * Telemetry: opt-in via WINDAGS_TELEMETRY env var ("off" disables, "anonymous"
 * is the default, "full" sends raw task text). Never blocks tool calls.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const bm25 = require("wink-bm25-text-search");
const nlp = require("wink-nlp-utils");
const yaml = require("js-yaml");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Skill Loader (inlined from @workgroup-ai/core)
// ---------------------------------------------------------------------------

function loadSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  const skills = [];
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(skillsDir, entry.name, "SKILL.md");
    if (!fs.existsSync(skillMd)) continue;
    try {
      const content = fs.readFileSync(skillMd, "utf-8");
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) continue;
      const fm = yaml.load(match[1]);
      skills.push({
        id: entry.name,
        name: fm.name || entry.name,
        description: fm.description || "",
        category: fm.category || "Uncategorized",
        tags: fm.tags || [],
      });
    } catch { /* skip malformed */ }
  }
  return skills;
}

// ---------------------------------------------------------------------------
// BM25 Search
// ---------------------------------------------------------------------------

let cachedSkills = [];
let skillMap = new Map();
let searchEngine = null;

function findSkillsDir() {
  // Skills are siblings to mcp-server/ in the plugin repo
  const candidates = [
    path.resolve(__dirname, "..", "skills"),
    path.resolve(process.cwd(), "skills"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function ensureSearchReady() {
  if (searchEngine) return;
  cachedSkills = loadSkills(findSkillsDir());
  skillMap = new Map(cachedSkills.map((s) => [s.id, s]));

  searchEngine = bm25();
  searchEngine.defineConfig({
    fldWeights: { name: 4, description: 2, tags: 3, category: 1, id_words: 2 },
    bm25Params: { k1: 1.5, b: 0.75, k: 1 },
  });
  searchEngine.definePrepTasks([
    nlp.string.lowerCase,
    nlp.string.removeExtraSpaces,
    nlp.string.tokenize0,
    nlp.tokens.removeWords,
    nlp.tokens.stem,
    nlp.tokens.propagateNegations,
  ]);

  for (const skill of cachedSkills) {
    searchEngine.addDoc({
      name: skill.name || "",
      description: (skill.description || "").slice(0, 500),
      tags: (skill.tags || []).join(" "),
      category: skill.category || "",
      id_words: skill.id.replace(/-/g, " "),
    }, skill.id);
  }
  searchEngine.consolidate();
}

function searchSkills(query, limit) {
  ensureSearchReady();
  if (!query || !query.trim()) {
    return cachedSkills.slice(0, limit).map((s) => ({ ...s, score: 0 }));
  }
  const results = searchEngine.search(query, limit);
  return results.map(([id, score]) => {
    const s = skillMap.get(id);
    return {
      id,
      name: s?.name ?? id,
      description: s?.description ?? "",
      category: s?.category ?? "Uncategorized",
      tags: s?.tags ?? [],
      score: Math.round(score * 1000) / 1000,
    };
  });
}

// ---------------------------------------------------------------------------
// Server-side cascade forwarder (api.windags.ai)
// ---------------------------------------------------------------------------

const API_ENDPOINT = process.env.WINDAGS_API_ENDPOINT ?? "https://api.windags.ai";
const API_TIMEOUT_MS = 4000;
const TELEMETRY_MODE = (process.env.WINDAGS_TELEMETRY ?? "anonymous").toLowerCase();

async function tryRemoteGraft(task, count) {
  if (TELEMETRY_MODE === "off") return null;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), API_TIMEOUT_MS);
    const res = await fetch(`${API_ENDPOINT}/v1/graft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, count }),
      signal: ctl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !Array.isArray(data.primary)) return null;
    if (data.primary.length === 0) return null; // empty manifest → fall back to local
    return data;
  } catch {
    return null; // network error, timeout, abort — silent fallback
  }
}

function localGraft(task, count) {
  // BM25 fallback — no body, no reference manifest, just descriptions.
  // Honest about its limits via the reasoning field.
  const results = searchSkills(task, count * 3);
  const primaryCount = Math.min(count, results.length);
  const primary = results.slice(0, primaryCount).map(r => ({
    id: r.id,
    name: r.name,
    body: `# ${r.name}\n\n${r.description}\n\n_(local BM25 fallback — full body unavailable. Run online for the full graft.)_`,
    category: r.category,
    score: r.score,
    referenceSummaries: {},
    availableFiles: [],
  }));
  const secondary = results.slice(primaryCount, primaryCount + count * 2).map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    tags: r.tags,
  }));
  return {
    task,
    primary,
    secondary,
    reasoning: "Local BM25 fallback (offline or server empty). Selected " +
      primary.map(p => p.id).join(", "),
  };
}

// ---------------------------------------------------------------------------
// Triple Store (inlined — just reads JSON files from .windags/triples/)
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

const server = new McpServer({ name: "windags", version: "0.1.0" });

server.tool(
  "windags_skill_search",
  "Search the WinDAGs skill catalog using BM25 ranked retrieval with Porter stemming. Zero API keys needed.",
  {
    query: z.string().describe("Natural language search query"),
    limit: z.number().optional().default(10).describe("Max results (default: 10)"),
  },
  async ({ query, limit }) => {
    try {
      const results = searchSkills(query, limit ?? 10);
      return {
        content: [{ type: "text", text: JSON.stringify({ query, total_matches: results.length, skills: results }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  }
);

server.tool(
  "windags_skill_graft",
  "Get expert domain knowledge for a task. Returns full SKILL.md bodies + " +
    "reference manifests for primary skills, plus descriptions of related " +
    "secondary skills. When online, uses the server-side cascade at " +
    "api.windags.ai. Falls back to local BM25 (description-only) when offline.",
  {
    task: z.string().describe("Description of the task you need expertise for"),
    count: z.number().optional().default(2).describe("Number of primary skills to graft (default: 2)"),
  },
  async ({ task, count }) => {
    try {
      const n = Math.max(1, Math.min(count ?? 2, 8));
      const remote = await tryRemoteGraft(task, n);
      const result = remote ?? localGraft(task, n);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ success: false, error: err.message }, null, 2) }],
        isError: true,
      };
    }
  }
);

server.tool(
  "windags_skill_reference",
  "Load the full content of a reference file from a skill. Use when a grafted " +
    "skill's referenceSummaries indicate deeper material you need. Reads from " +
    "the locally bundled skill directory (path-traversal safe).",
  {
    skill_id: z.string().describe("The skill ID (e.g., 'caching-strategies')"),
    file_path: z.string().describe("Path within the skill directory (e.g., 'references/redis-patterns.md')"),
  },
  async ({ skill_id, file_path }) => {
    try {
      const skillsDir = findSkillsDir();
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
        const available = [];
        for (const sub of ["references", "diagrams", "examples", "scripts", "templates"]) {
          const dir = path.join(skillDir, sub);
          if (!fs.existsSync(dir)) continue;
          for (const f of fs.readdirSync(dir)) {
            if (!f.startsWith(".") && f !== "INDEX.md") available.push(`${sub}/${f}`);
          }
        }
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
  }
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
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("WinDAGs MCP server failed:", err);
  process.exit(1);
});
