#!/usr/bin/env node
/**
 * Telemetry smoke test.
 *
 * Verifies:
 *   1. WINDAGS_TELEMETRY=off  → recordEvent makes zero fetch calls.
 *   2. WINDAGS_TELEMETRY=anonymous → fires one POST with hashed machine_hash,
 *      no task_text, then is sampled out for 24h.
 *   3. WINDAGS_TELEMETRY=full → fires every call, includes task_text.
 *
 * No network: we monkey-patch globalThis.fetch and assert on the captured
 * request body. Each scenario runs in a fresh child process so the module-load
 * env var capture is isolated and the sampling state file is reset.
 */

import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TELEMETRY_PATH = path.resolve(__dirname, "..", "telemetry.js");
const STATE_PATH = path.join(os.homedir(), ".windags", "telemetry-state.json");

function runChild(mode, script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--input-type=module", "-e", script], {
      env: {
        ...process.env,
        WINDAGS_TELEMETRY: mode,
        WINDAGS_TELEMETRY_ENDPOINT: "http://127.0.0.1:1/telemetry-smoke-test",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "", err = "";
    child.stdout.on("data", (b) => out += b.toString("utf-8"));
    child.stderr.on("data", (b) => err += b.toString("utf-8"));
    child.on("exit", (code) => {
      if (code !== 0) return reject(new Error(`child exit ${code}: ${err}`));
      resolve(out.trim());
    });
  });
}

let savedState = null;
if (fs.existsSync(STATE_PATH)) {
  savedState = fs.readFileSync(STATE_PATH, "utf-8");
}

const harness = (extra) => `
import { recordEvent, _telemetryConfig } from ${JSON.stringify(TELEMETRY_PATH)};
let captured = null;
let calls = 0;
globalThis.fetch = async (url, init) => {
  calls++;
  captured = { url, body: init?.body };
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
const cfg = _telemetryConfig();
${extra}
await new Promise((r) => setTimeout(r, 50));
console.log(JSON.stringify({ calls, captured, cfg: { mode: cfg.mode, enabled: cfg.enabled, sendRawText: cfg.sendRawText, machineHash: cfg.machineHash } }));
`;

let failed = 0;
function check(name, cond, detail) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name} :: ${detail ?? ""}`);
  }
}

// ── 1. off ────────────────────────────────────────────────────────────────
console.log("\n[1/3] WINDAGS_TELEMETRY=off → expect zero fetch calls");
{
  fs.rmSync(STATE_PATH, { force: true });
  const out = await runChild("off", harness(`recordEvent({ toolName: "windags_skill_search", taskText: "secret query text" });`));
  const r = JSON.parse(out);
  check("zero calls", r.calls === 0, `got ${r.calls}`);
  check("disabled flag", r.cfg.enabled === false);
  check("no state file written", !fs.existsSync(STATE_PATH));
}

// ── 2. anonymous ──────────────────────────────────────────────────────────
console.log("\n[2/3] WINDAGS_TELEMETRY=anonymous → expect 1 call, no task_text");
{
  fs.rmSync(STATE_PATH, { force: true });
  const out = await runChild("anonymous", harness(`recordEvent({ toolName: "windags_skill_search", taskText: "secret query text" });`));
  const r = JSON.parse(out);
  check("one call fired", r.calls === 1, `got ${r.calls}`);
  if (r.captured) {
    const body = JSON.parse(r.captured.body);
    check("event_type=tool_call", body.event_type === "tool_call");
    check("hashed machine_hash 16 hex", /^[0-9a-f]{16}$/.test(body.machine_hash));
    check("no task_text field", body.task_text === undefined,
      `got task_text=${JSON.stringify(body.task_text)}`);
    check("plugin_version present", typeof body.plugin_version === "string");
    check("ts is unix seconds", typeof body.ts === "number" && body.ts > 1700000000);
  }
  check("state file written", fs.existsSync(STATE_PATH));
}

// ── 2b. anonymous: second call within 24h is sampled out ─────────────────
console.log("\n[2b] WINDAGS_TELEMETRY=anonymous → second call within 24h is dropped");
{
  const out = await runChild("anonymous", harness(`recordEvent({ toolName: "windags_skill_graft" });`));
  const r = JSON.parse(out);
  check("zero calls (sampled out)", r.calls === 0, `got ${r.calls}`);
}

// ── 3. full ───────────────────────────────────────────────────────────────
console.log("\n[3/3] WINDAGS_TELEMETRY=full → expect every call, includes task_text");
{
  fs.rmSync(STATE_PATH, { force: true });
  const out = await runChild("full", harness(`
    recordEvent({ toolName: "windags_skill_search", taskText: "first query" });
    await new Promise((r) => setTimeout(r, 20));
    recordEvent({ toolName: "windags_skill_graft", taskText: "second query" });
  `));
  const r = JSON.parse(out);
  check("two calls fired", r.calls === 2, `got ${r.calls}`);
  if (r.captured) {
    const body = JSON.parse(r.captured.body);
    check("task_text is included", body.task_text === "second query",
      `got ${JSON.stringify(body.task_text)}`);
  }
}

// Restore sampling state we trampled.
fs.rmSync(STATE_PATH, { force: true });
if (savedState !== null) {
  fs.writeFileSync(STATE_PATH, savedState, "utf-8");
}

if (failed > 0) {
  console.log(`\n${failed} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll telemetry checks passed.");
