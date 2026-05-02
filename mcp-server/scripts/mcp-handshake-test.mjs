#!/usr/bin/env node
/**
 * MCP handshake test.
 *
 * Spawns the MCP server, performs the JSON-RPC initialize + tools/list +
 * prompts/list dance over stdio, and asserts that all nine tools and the
 * `next_move` prompt are advertised:
 *
 *   Tools:
 *     - windags_skill_search          (single-query cascade)
 *     - windags_skill_graft            (single-task graft)
 *     - windags_skill_reference        (load one reference file)
 *     - windags_history                (recent /next-move predictions)
 *     - windags_skill_search_batch     (N queries in one round-trip)
 *     - windags_skill_graft_batch      (N grafts in one round-trip)
 *     - windags_node_requirements      (allowed-tools + provider-mapped model IDs)
 *     - windags_validate_dag           (PredictedDAG schema check)
 *     - windags_estimate_cost          (per-node + total cost estimate)
 *
 *   Prompts:
 *     - next_move                      (5-stage /next-move pipeline runner)
 *
 * Hard-fails after 60s so a stuck process can never block CI. We deliberately
 * keep this lighter than the cascade smoke test — it just proves the server
 * starts cleanly and speaks MCP. The cascade is exercised end-to-end by
 * smoke-test.mjs.
 */

import { spawn } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER = path.resolve(__dirname, "..", "index.js");

const REQUIRED_TOOLS = [
  "windags_skill_search",
  "windags_skill_graft",
  "windags_skill_reference",
  "windags_history",
  "windags_skill_search_batch",
  "windags_skill_graft_batch",
  "windags_node_requirements",
  "windags_validate_dag",
  "windags_estimate_cost",
];

const REQUIRED_PROMPTS = ["next_move"];

const DEADLINE_MS = 60_000;

const proc = spawn(process.execPath, [SERVER], {
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, WINDAGS_TELEMETRY: "off", WINDAGS_USER_SKILLS: "off" },
});

let stderr = "";
proc.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
  process.stderr.write(chunk);
});

const deadline = setTimeout(() => {
  console.error(`\nFAIL — server did not respond within ${DEADLINE_MS}ms`);
  proc.kill("SIGKILL");
  process.exit(1);
}, DEADLINE_MS);

let buffer = "";
const pending = new Map(); // id -> { resolve, reject }

proc.stdout.on("data", (chunk) => {
  buffer += chunk.toString("utf-8");
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id !== undefined && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.code}: ${msg.error.message}`));
      else resolve(msg.result);
    }
  }
});

function send(id, method, params) {
  const payload = JSON.stringify({ jsonrpc: "2.0", id, method, params });
  proc.stdin.write(payload + "\n");
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

try {
  await send(1, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    clientInfo: { name: "mcp-handshake-test", version: "1.0.0" },
  });
  // Some servers want the notification before responding to further requests.
  proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const result = await send(2, "tools/list", {});
  const advertised = (result.tools ?? []).map((t) => t.name);
  console.log(`tools/list returned: ${advertised.join(", ")}`);

  const missingTools = REQUIRED_TOOLS.filter((t) => !advertised.includes(t));
  if (missingTools.length > 0) {
    console.error(`FAIL — missing tools: ${missingTools.join(", ")}`);
    process.exit(1);
  }
  console.log(`PASS — all ${REQUIRED_TOOLS.length} tools advertised`);

  const promptsResult = await send(3, "prompts/list", {});
  const advertisedPrompts = (promptsResult.prompts ?? []).map((p) => p.name);
  console.log(`prompts/list returned: ${advertisedPrompts.join(", ") || "(none)"}`);

  const missingPrompts = REQUIRED_PROMPTS.filter((p) => !advertisedPrompts.includes(p));
  if (missingPrompts.length > 0) {
    console.error(`FAIL — missing prompts: ${missingPrompts.join(", ")}`);
    process.exit(1);
  }
  console.log(`PASS — all ${REQUIRED_PROMPTS.length} prompt(s) advertised`);

  // Sanity-check that prompts/get actually returns a populated message.
  const getResult = await send(4, "prompts/get", {
    name: "next_move",
    arguments: { task: "handshake-test", fresh: "false" },
  });
  const text = getResult?.messages?.[0]?.content?.text ?? "";
  if (!text.includes("handshake-test") || !text.includes("Sensemaker")) {
    console.error("FAIL — next_move prompt body did not interpolate task or include pipeline stages");
    console.error(`got ${text.length} chars; first 200: ${text.slice(0, 200)}`);
    process.exit(1);
  }
  console.log(`PASS — next_move prompt returns ${text.length} chars with task interpolated`);
} catch (err) {
  console.error(`FAIL — handshake error: ${err.message}`);
  console.error(`stderr:\n${stderr}`);
  process.exit(1);
} finally {
  clearTimeout(deadline);
  proc.stdin.end();
  proc.kill();
}
