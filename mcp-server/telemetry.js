/**
 * WinDAGs MCP — anonymous telemetry.
 *
 * Privacy contract (also documented at windags.ai/install):
 *   WINDAGS_TELEMETRY=off        → zero network calls, ever.
 *   WINDAGS_TELEMETRY=anonymous  → (default) hashed machine ID + tool name +
 *                                  plugin/node/platform metadata. No raw text.
 *   WINDAGS_TELEMETRY=full       → opt-in; the above plus the raw task text.
 *
 * Sampling: at most once per 24h per machine in 'anonymous' mode (the default)
 * so a single user's chatty session doesn't hammer the endpoint. 'full' mode
 * sends every call (the user has explicitly opted in to richer data).
 *
 * Networking: fire-and-forget. setImmediate + void fetch + 1.5s AbortSignal.
 * Endpoint failure is silent. Telemetry never blocks the tool call.
 */

import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

const ENDPOINT = process.env.WINDAGS_TELEMETRY_ENDPOINT
  ?? "https://api.windags.ai/v1/events";

const MODE = (process.env.WINDAGS_TELEMETRY ?? "anonymous").toLowerCase();
const ENABLED = MODE === "anonymous" || MODE === "full";
const SEND_RAW_TEXT = MODE === "full";

const STATE_DIR = path.join(os.homedir(), ".windags");
const STATE_PATH = path.join(STATE_DIR, "telemetry-state.json");
const SAMPLE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
const TIMEOUT_MS = 1500;

// ── Static fields computed once ────────────────────────────────────────────

const MACHINE_HASH = (() => {
  try {
    const hostname = os.hostname() ?? "";
    const username = os.userInfo().username ?? "";
    return crypto
      .createHash("sha256")
      .update(`${hostname} ${username}`)
      .digest("hex")
      .slice(0, 16);
  } catch {
    return "0000000000000000";
  }
})();

const PLUGIN_VERSION = (() => {
  try {
    const pkgPath = path.join(path.dirname(new URL(import.meta.url).pathname), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return typeof pkg.version === "string" ? pkg.version : "unknown";
  } catch {
    return "unknown";
  }
})();

const NODE_MAJOR = (() => {
  const m = /^v?(\d+)/.exec(process.version ?? "");
  return m ? parseInt(m[1], 10) : null;
})();

const PLATFORM = process.platform; // 'darwin' | 'linux' | 'win32' | ...

// ── Sampling state ─────────────────────────────────────────────────────────

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  } catch {
    return { lastSentAt: 0 };
  }
}

function writeState(state) {
  try {
    if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state), "utf-8");
  } catch {
    // Best-effort; if we can't persist, we just send next call.
  }
}

function shouldSample(now) {
  // 'full' mode: always send (user opted in).
  if (SEND_RAW_TEXT) return true;
  const state = readState();
  return (now - (state.lastSentAt ?? 0)) >= SAMPLE_WINDOW_MS;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Fire a telemetry event. Never throws. Never blocks. Never delays the caller.
 * @param {{ toolName: string, taskText?: string }} args
 */
export function recordEvent({ toolName, taskText } = {}) {
  if (!ENABLED) return;
  if (typeof fetch !== "function") return; // Node < 18 (engines pin >=18 anyway)

  const nowMs = Date.now();
  if (!shouldSample(nowMs)) return;

  const body = {
    event_type: "tool_call",
    machine_hash: MACHINE_HASH,
    ts: Math.floor(nowMs / 1000),
    tool_name: typeof toolName === "string" ? toolName : null,
    plugin_version: PLUGIN_VERSION,
    node_major: NODE_MAJOR,
    platform: PLATFORM,
  };
  if (SEND_RAW_TEXT && typeof taskText === "string" && taskText.length > 0) {
    body.task_text = taskText.slice(0, 4096);
  }

  // Mark sampled BEFORE the fetch so a cluster of in-flight calls can't all
  // fire (they'd each see lastSentAt as stale). The cost: if the request
  // fails we still skip for 24h. Fine for telemetry.
  writeState({ lastSentAt: nowMs });

  // Fire-and-forget. Detach from the calling tick so we never delay the tool
  // response, even if DNS lookup is slow.
  setImmediate(() => {
    let timer;
    let controller;
    try {
      controller = new AbortController();
      timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    } catch {
      return; // No AbortController? Just drop the event.
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      keepalive: true,
    })
      .catch(() => { /* silent */ })
      .finally(() => { clearTimeout(timer); });
  });
}

/** Test-only / debug accessor. Read by smoke tests; not part of the public API. */
export function _telemetryConfig() {
  return {
    mode: MODE,
    enabled: ENABLED,
    sendRawText: SEND_RAW_TEXT,
    endpoint: ENDPOINT,
    machineHash: MACHINE_HASH,
    pluginVersion: PLUGIN_VERSION,
    nodeMajor: NODE_MAJOR,
    platform: PLATFORM,
    statePath: STATE_PATH,
    sampleWindowMs: SAMPLE_WINDOW_MS,
  };
}
