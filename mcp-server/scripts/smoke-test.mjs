#!/usr/bin/env node
/**
 * Smoke test for the local cascade. Imports the cascade pieces directly so
 * we can exercise them without going through MCP stdio.
 */
import { embedQuery, loadCorpus, topKSemantic, rrfFuse } from "../cascade.js";
import { createRequire } from "module";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const bm25 = require("wink-bm25-text-search");
const nlp = require("wink-nlp-utils");
const yaml = require("js-yaml");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.resolve(ROOT, "..", "skills");

const skills = [];
for (const e of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const md = path.join(SKILLS_DIR, e.name, "SKILL.md");
  if (!fs.existsSync(md)) continue;
  const txt = fs.readFileSync(md, "utf-8");
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  let fm; try { fm = yaml.load(m[1]); } catch { continue; }
  if (!fm) continue;
  skills.push({
    id: e.name, name: fm.name || e.name,
    description: fm.description || "",
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    category: fm.category || "",
  });
}

const engine = bm25();
engine.defineConfig({
  fldWeights: { name: 4, description: 2, tags: 3, category: 1, id_words: 2 },
  bm25Params: { k1: 1.5, b: 0.75, k: 1 },
});
engine.definePrepTasks([
  nlp.string.lowerCase, nlp.string.removeExtraSpaces, nlp.string.tokenize0,
  nlp.tokens.removeWords, nlp.tokens.stem, nlp.tokens.propagateNegations,
]);
for (const s of skills) {
  engine.addDoc({
    name: s.name, description: s.description.slice(0, 500),
    tags: s.tags.join(" "), category: s.category,
    id_words: s.id.replace(/-/g, " "),
  }, s.id);
}
engine.consolidate();

const corpus = loadCorpus(path.join(ROOT, "data"));
if (!corpus) {
  console.error("No corpus — run build-embeddings.mjs first.");
  process.exit(1);
}

const QUERIES = [
  "stripe webhook idempotency",
  "agentic planning with multiple skills",
  "how should an agent write a unit test",
];

for (const q of QUERIES) {
  console.log(`\nQUERY: ${q}`);
  const lex = engine.search(q, 30).map(([id, score]) => ({ id, score }));
  const qVec = await embedQuery(q);
  const sem = topKSemantic(qVec, corpus, 30);
  const fused = rrfFuse(
    [{ name: "lexical", items: lex }, { name: "semantic", items: sem }],
    { K: 60, limit: 5 },
  );
  console.log("  lexical top-3:", lex.slice(0, 3).map((r) => r.id));
  console.log("  semantic top-3:", sem.slice(0, 3).map((r) => r.id));
  console.log("  fused top-5:");
  for (const r of fused) {
    console.log(`    ${r.fusedScore.toFixed(4)}  ${r.id}`);
  }
}
