#!/usr/bin/env node
// run-pipeline-e2e.mjs — Real-API end-to-end test for windags_run_pipeline.
//
// Loads /Users/erichowens/coding/workgroup-ai/.env.local for keys, then
// invokes runPipeline() with a sample task against this repo. Prints a
// stage-by-stage summary plus the validated PredictedDAG (or halt response).
//
// Usage:
//   node scripts/run-pipeline-e2e.mjs                  # auto-detect provider
//   WINDAGS_PROVIDER=openai node scripts/run-pipeline-e2e.mjs
//   WINDAGS_PROVIDER=google node scripts/run-pipeline-e2e.mjs
//
// Costs real money. ~$0.02–$0.15 per invocation.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

// Load .env.local from workgroup-ai (has all the keys).
const envFile = "/Users/erichowens/coding/workgroup-ai/.env.local";
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, k, v] = m;
    if (!process.env[k]) {
      process.env[k] = v.replace(/^["']|["']$/g, "");
    }
  }
}

const { runPipeline } = await import("../run-pipeline.js");
const { selectProvider, describeProvider } = await import("../llm-client.js");

const providerId = (() => {
  try { return selectProvider(); } catch (e) { console.error(e.message); process.exit(2); }
})();
console.log(`provider: ${providerId} (${describeProvider(providerId)})`);
console.log(`project_root: ${repoRoot}`);

// Lightweight cascade stub — the real cascade has heavy deps. For the e2e
// we just want any plausible candidate list to flow into the skill-selector.
const cascadeSearch = async (query, limit = 5) => {
  return {
    results: [
      { id: "next-move", score: 0.9, description: "DAG prediction pipeline" },
      { id: "skill-architect", score: 0.85, description: "Designs SKILL.md files" },
      { id: "ai-engineer", score: 0.8, description: "Build LLM-powered systems" },
      { id: "api-architect", score: 0.75, description: "Design REST/GraphQL APIs" },
      { id: "code-review", score: 0.7, description: "Review code for issues" },
    ].slice(0, limit),
  };
};

const startMs = Date.now();
let result;
try {
  result = await runPipeline({
    task: "Add OpenAI and Google providers to the windags_run_pipeline MCP tool",
    projectRoot: repoRoot,
    fresh: true, // ignore conversation history for reproducibility
    cascadeSearch,
  });
} catch (err) {
  console.error("\nFAILED:", err.message);
  process.exit(1);
}

const elapsedSec = ((Date.now() - startMs) / 1000).toFixed(2);
console.log(`\n=== completed in ${elapsedSec}s ===\n`);

if (result.halted) {
  console.log("HALT RESPONSE");
  console.log("halt_reason:", result.halt_reason);
  console.log("evidence_needed:", result.evidence_needed);
  console.log("\nsensemaker:", JSON.stringify(result.sensemaker, null, 2));
} else {
  console.log("PREDICTED DAG");
  const dag = result.predicted_dag;
  console.log(`title: ${dag.title}`);
  console.log(`classification: ${dag.problem_classification}`);
  console.log(`confidence: ${dag.confidence}`);
  console.log(`waves: ${dag.waves.length}`);
  dag.waves.forEach((w, i) => {
    console.log(`  wave ${i}:`);
    for (const n of w.nodes) {
      console.log(`    - ${n.id} [${n.skill_id ?? "no-skill"}] (${n.model_tier ?? "balanced"})`);
    }
  });
  console.log(`premortem: ${dag.premortem.recommendation} (${(dag.premortem.risks ?? []).length} risks)`);
}

console.log("\nusage_log:");
let totalIn = 0, totalOut = 0;
for (const u of result.usage_log) {
  const inT = u.input_tokens ?? 0;
  const outT = u.output_tokens ?? 0;
  totalIn += inT;
  totalOut += outT;
  console.log(`  ${u.stage.padEnd(16)} ${u.provider.padEnd(10)} ${u.model.padEnd(35)} in=${inT} out=${outT} ${u.elapsed_ms}ms`);
}
console.log(`  TOTAL: in=${totalIn} out=${totalOut}`);
