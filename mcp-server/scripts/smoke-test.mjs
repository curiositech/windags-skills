#!/usr/bin/env node
/**
 * Smoke test for the local cascade. Imports the cascade pieces directly so
 * we can exercise them without going through MCP stdio.
 *
 * Prints, for each query, the lexical/semantic top-3, then the RRF top-5
 * side-by-side with the cross-encoder rerank top-5, so a human can eyeball
 * whether Stage 4 is helping.
 */
import { embedQuery, loadCorpus, topKSemantic, rrfFuse, crossEncoderRerank } from "../cascade.js";
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

// Build a quick id → metadata lookup so we can construct candidate texts
// for the cross-encoder.
const skillById = new Map(skills.map((s) => [s.id, s]));

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
  // RRF over a wider pool so the cross-encoder has room to rerank.
  const fusedPool = rrfFuse(
    [{ name: "lexical", items: lex }, { name: "semantic", items: sem }],
    { K: 60, limit: 30 },
  );
  const fusedTop5 = fusedPool.slice(0, 5);

  // Stage 4 — cross-encoder rerank over the fused pool.
  let rerankedTop5 = [];
  let rerankNote = "";
  try {
    const candidateTexts = fusedPool.map((r) => {
      const meta = skillById.get(r.id);
      const name = meta?.name ?? r.id;
      const desc = (meta?.description ?? "").slice(0, 500);
      return desc ? `${name}. ${desc}` : name;
    });
    rerankedTop5 = await crossEncoderRerank(q, fusedPool, candidateTexts, 5);
  } catch (err) {
    rerankNote = `(rerank skipped: ${err.message})`;
  }

  console.log("  lexical top-3:", lex.slice(0, 3).map((r) => r.id));
  console.log("  semantic top-3:", sem.slice(0, 3).map((r) => r.id));
  console.log(`\n  ${"RRF top-5".padEnd(50)} | RERANK top-5 ${rerankNote}`);
  console.log(`  ${"-".repeat(50)} | ${"-".repeat(50)}`);
  for (let i = 0; i < 5; i++) {
    const left = fusedTop5[i]
      ? `${fusedTop5[i].fusedScore.toFixed(4)}  ${fusedTop5[i].id}`
      : "";
    const right = rerankedTop5[i]
      ? `${rerankedTop5[i].crossScore.toFixed(4).padStart(8)}  ${rerankedTop5[i].id}`
      : "";
    console.log(`  ${left.padEnd(50)} | ${right}`);
  }
}


// ---------------------------------------------------------------------------
// Stage 5 — Attribution k-NN smoke test
// ---------------------------------------------------------------------------
//
// Generates 3 fake triples in a temp dir, runs the cascade with attribution
// boost, prints before/after top-5. We use a query semantically close to one
// of the fake triples (in which `vitest-testing-patterns` was accepted) and
// expect it to climb the ranking.

import { attributionBoost } from "../cascade.js";
import * as os from "node:os";
import { randomUUID } from "node:crypto";

const tmpDir = path.join(os.tmpdir(), `windags-stage5-smoke-${randomUUID().slice(0, 8)}`);
fs.mkdirSync(tmpDir, { recursive: true });

const FIXTURES = [
  {
    id: "fixture-001",
    timestamp: "2026-04-25T10:00:00Z",
    prompt: "set up vitest unit tests for our typescript api endpoints",
    predicted_dag: {
      title: "Add vitest coverage for API",
      waves: [
        { wave_number: 0, parallelizable: false, nodes: [
          { id: "n1", skill_id: "vitest-testing-patterns" },
          { id: "n2", skill_id: "test-automation-expert" },
        ]},
      ],
    },
    feedback: { accepted: true, rating: 5, modifications: [], notes: "Worked great" },
  },
  {
    id: "fixture-002",
    timestamp: "2026-04-26T11:00:00Z",
    prompt: "design a brutalist hero section with chunky type and big shadows",
    predicted_dag: {
      title: "Brutalist hero",
      waves: [
        { wave_number: 0, parallelizable: false, nodes: [
          { id: "n1", skill_id: "neobrutalist-web-designer" },
          { id: "n2", skill_id: "typography-expert" },
        ]},
      ],
    },
    feedback: { accepted: true, rating: 4 },
  },
  {
    id: "fixture-003",
    timestamp: "2026-04-27T12:00:00Z",
    prompt: "write a bunch of integration tests for the new graphql resolvers",
    predicted_dag: {
      title: "GraphQL test suite",
      waves: [
        { wave_number: 0, parallelizable: false, nodes: [
          { id: "n1", skill_id: "vitest-testing-patterns" },
          { id: "n2", skill_id: "qa-automation-specialist" },
        ]},
      ],
    },
    feedback: { accepted: true, rating: 5, notes: "Caught bugs early" },
  },
];

for (const fx of FIXTURES) {
  fs.writeFileSync(path.join(tmpDir, `${fx.id}.json`), JSON.stringify(fx, null, 2));
}

console.log(`\n=== Stage 5 — Attribution k-NN ===`);
console.log(`tmpDir: ${tmpDir}`);
console.log(`fixtures: ${FIXTURES.length} triples\n`);

const Q = "add unit tests for our backend module";
console.log(`QUERY: ${Q}`);

const lex5 = engine.search(Q, 30).map(([id, score]) => ({ id, score }));
const qVec5 = await embedQuery(Q);
const sem5 = topKSemantic(qVec5, corpus, 30);
const fused5 = rrfFuse(
  [{ name: "lexical", items: lex5 }, { name: "semantic", items: sem5 }],
  { K: 60, limit: 10 },
);

console.log("\n  BEFORE attribution (RRF top-5):");
for (const r of fused5.slice(0, 5)) {
  console.log(`    ${r.fusedScore.toFixed(4)}  ${r.id}`);
}

const boosted = await attributionBoost(qVec5, fused5, tmpDir, { k: 5 });

console.log("\n  AFTER attribution (top-5):");
for (const r of boosted.slice(0, 5)) {
  const tag = r.attribution
    ? ` [+${r.attribution.boost.toFixed(4)} count=${r.attribution.count} n=${r.attribution.neighbors.length}]`
    : "";
  console.log(`    ${r.fusedScore.toFixed(4)}  ${r.id}${tag}`);
}

const beforeRank = fused5.findIndex((r) => r.id === "vitest-testing-patterns");
const afterRank = boosted.findIndex((r) => r.id === "vitest-testing-patterns");
console.log(`\n  vitest-testing-patterns rank: before=${beforeRank} → after=${afterRank}`);
if (afterRank >= 0 && (beforeRank < 0 || afterRank < beforeRank || afterRank === beforeRank)) {
  console.log(`  ${afterRank < beforeRank ? "PASS" : "(no movement, but attribution applied)"}` );
} else {
  console.log(`  FAIL — expected vitest-testing-patterns to climb (or stay) given accepted neighbors`);
}

// Verify embedding cache was written back into the fixture files.
const cached = FIXTURES.filter((fx) => {
  const updated = JSON.parse(fs.readFileSync(path.join(tmpDir, `${fx.id}.json`), "utf-8"));
  return typeof updated._query_embedding === "string" && updated._query_embedding.length > 0;
}).length;
console.log(`  embedding cache: ${cached}/${FIXTURES.length} triples now have _query_embedding`);

// Second pass — should be cache-only (no re-embedding).
const t2 = Date.now();
await attributionBoost(qVec5, fused5, tmpDir, { k: 5 });
console.log(`  second-pass latency (cache-hit): ${Date.now() - t2}ms`);

// Cleanup
for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f));
fs.rmdirSync(tmpDir);
console.log(`  cleaned up ${tmpDir}`);
