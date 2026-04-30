#!/usr/bin/env node
/**
 * MCP handshake test.
 *
 * Spawns the MCP server, performs the JSON-RPC initialize + tools/list
 * dance over stdio, and asserts that all four tools are advertised:
 *   - windags_skill_search
 *   - windags_skill_graft
 *   - windags_skill_reference
 *   - windags_history
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
];

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

  const missing = REQUIRED_TOOLS.filter((t) => !advertised.includes(t));
  if (missing.length > 0) {
    console.error(`FAIL — missing tools: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log(`PASS — all ${REQUIRED_TOOLS.length} tools advertised`);
} catch (err) {
  console.error(`FAIL — handshake error: ${err.message}`);
  console.error(`stderr:\n${stderr}`);
  process.exit(1);
} finally {
  clearTimeout(deadline);
  proc.stdin.end();
  proc.kill();
}
