#!/usr/bin/env node

/**
 * WinDAGs MCP Server (standalone)
 *
 * Self-contained MCP server for the windags-skills plugin.
 * No @workgroup-ai/core dependency — inlines skill loading + triple store.
 *
 * Tools (zero API keys):
 *   - windags_skill_search: BM25 ranked skill catalog search
 *   - windags_history: View recent /next-move predictions
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
