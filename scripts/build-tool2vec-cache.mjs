#!/usr/bin/env node
/**
 * Build Tool2Vec cache for the WinDAGs skill catalog.
 *
 * For each skill in skills/<id>/SKILL.md:
 *   1. Ask Anthropic Haiku for 15 diverse task descriptions that would require this skill
 *   2. Embed each task via Gemini text-embedding-005 (768-dim)
 *   3. Average the 15 vectors → one skill vector
 *   4. Write all vectors to mcp-server/data/tool2vec-cache.json
 *
 * Designed to be cheap ($0.25-0.50 total), reproducible (cached by content hash),
 * and zero-binary (Gemini REST embeddings, no local model).
 *
 * Run from the windags-skills repo root:
 *
 *   node scripts/build-tool2vec-cache.mjs                  # incremental
 *   node scripts/build-tool2vec-cache.mjs --force          # rebuild all
 *   node scripts/build-tool2vec-cache.mjs --limit 10       # just first 10 skills
 *
 * Required env (loaded automatically from .env, .env.local, ~/.env):
 *   ANTHROPIC_API_KEY  — for synthetic task generation
 *   GOOGLE_API_KEY     — for Gemini embeddings
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

// ── env loader ────────────────────────────────────────────────────────────

function loadEnv() {
  const candidates = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.join(REPO_ROOT, ".env.local"),
    path.join(REPO_ROOT, ".env"),
    path.join(process.env.HOME ?? "", ".env"),
    // fall back to the workgroup-ai sibling repo if present
    path.resolve(REPO_ROOT, "..", "workgroup-ai", ".env.local"),
  ];
  for (const p of candidates) {
    if (!p || !fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, "utf-8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2];
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

function loud(line) {
  process.stderr.write(`\x1b[1;33m${line}\x1b[0m\n`);
}

function fatal(line) {
  process.stderr.write(`\x1b[1;31m${line}\x1b[0m\n`);
  process.exit(1);
}

// Three providers, all interchangeable. Picked by what's in env, in this order:
//   anthropic (Haiku)  → best task diversity, cheapest per token, requires credit
//   openai (gpt-4o-mini + text-embedding-3-small) → fastest, single-vendor convenience
//   google (Gemini Flash + gemini-embedding-001) → free tier covers a full Tool2Vec build
//
// The script auto-falls-back on credit/auth/quota errors. The choice does not affect
// runtime behavior — once the cache is built, all stages are pure JS over local vectors.
const HAS_ANTHROPIC = !!process.env.ANTHROPIC_API_KEY;
const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
const HAS_GOOGLE = !!process.env.GOOGLE_API_KEY;

if (!HAS_ANTHROPIC && !HAS_OPENAI && !HAS_GOOGLE) {
  fatal(
    "No API keys found. Need at least one of ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_API_KEY.\n" +
    "Add to one of:\n" +
    "  • windags-skills/.env.local        (this repo)\n" +
    "  • ~/coding/workgroup-ai/.env.local (sibling)\n" +
    "  • ~/.env\n" +
    "Get keys:\n" +
    "  • https://console.anthropic.com/settings/keys\n" +
    "  • https://platform.openai.com/api-keys\n" +
    "  • https://aistudio.google.com/apikey  (free tier covers a full build)"
  );
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

// Pick generator + embedder independently. Generator preference: anthropic > openai > google.
// Embedder preference: openai (text-embedding-3-small, 1536d) > google (gemini-embedding-001, 768d).
let GENERATOR = HAS_ANTHROPIC ? "anthropic" : HAS_OPENAI ? "openai" : "google";
let EMBEDDER = HAS_OPENAI ? "openai" : "google";
loud(`Generator: ${GENERATOR}    Embedder: ${EMBEDDER}`);

// ── args ──────────────────────────────────────────────────────────────────

const FORCE = process.argv.includes("--force");
const LIMIT = parseInt(
  process.argv.find((a) => a.startsWith("--limit"))?.split("=")[1] ??
    (process.argv.includes("--limit") ? process.argv[process.argv.indexOf("--limit") + 1] : ""),
  10
) || null;
const CONCURRENCY = parseInt(
  process.argv.find((a) => a.startsWith("--concurrency"))?.split("=")[1] ??
    (process.argv.includes("--concurrency") ? process.argv[process.argv.indexOf("--concurrency") + 1] : ""),
  10
) || 8;

// ── catalog load ──────────────────────────────────────────────────────────

function loadSkills(skillsDir) {
  const skills = [];
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(skillsDir, entry.name, "SKILL.md");
    if (!fs.existsSync(skillMd)) continue;
    const raw = fs.readFileSync(skillMd, "utf-8");
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const fm = parseFrontmatter(fmMatch[1]);
    const hash = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
    skills.push({
      id: entry.name,
      name: fm.name || entry.name,
      description: fm.description || "",
      category: fm.category || "Uncategorized",
      tags: fm.tags || [],
      contentHash: hash,
    });
  }
  return skills;
}

function parseFrontmatter(yaml) {
  const out = {};
  for (const line of yaml.split("\n")) {
    const m = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!m) continue;
    let [, k, v] = m;
    v = v.trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    }
    out[k] = v;
  }
  return out;
}

// ── synthetic task generation (Anthropic preferred, Gemini fallback) ──────

function buildPrompt(skill) {
  return [
    `You are generating training data for a tool retrieval system.`,
    `The "tool" below is a skill — a unit of expertise applied to coding tasks.`,
    ``,
    `Skill: ${skill.name}`,
    `Description: ${skill.description}`,
    `Category: ${skill.category}`,
    skill.tags?.length ? `Tags: ${skill.tags.join(", ")}` : "",
    ``,
    `Output exactly 15 diverse task descriptions that a developer would write,`,
    `that would benefit from this specific skill. Each task description should:`,
    `- Sound like real natural-language requests ("design a X", "fix Y in Z", "set up A so B")`,
    `- Cover different surface vocabularies (synonyms, paraphrases, framings)`,
    `- Stay grounded — don't invent libraries that don't exist`,
    `- One per line, no numbering, no commentary, no markdown`,
  ].filter(Boolean).join("\n");
}

function parseTaskList(text) {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\s\-•*\d.)]+/, "").trim())
    .filter((l) => l.length > 8)
    .slice(0, 15);
}

async function generateViaAnthropic(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Anthropic ${res.status}: ${body}`);
    err.body = body;
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

async function generateViaOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`OpenAI ${res.status}: ${body}`);
    err.body = body;
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function generateViaGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function isQuotaOrAuthError(body) {
  if (!body) return false;
  return /credit balance is too low|insufficient_quota|quota exceeded|rate limit|invalid_api_key|unauthorized/i.test(body);
}

async function generateTasks(skill) {
  const prompt = buildPrompt(skill);
  // Try preferred generator, fall back through the chain on credit/quota errors.
  const order = [];
  if (GENERATOR === "anthropic") order.push("anthropic", "openai", "google");
  else if (GENERATOR === "openai") order.push("openai", "anthropic", "google");
  else order.push("google", "openai", "anthropic");

  for (const provider of order) {
    if (provider === "anthropic" && !HAS_ANTHROPIC) continue;
    if (provider === "openai" && !HAS_OPENAI) continue;
    if (provider === "google" && !HAS_GOOGLE) continue;
    try {
      let text = "";
      if (provider === "anthropic") text = await generateViaAnthropic(prompt);
      else if (provider === "openai") text = await generateViaOpenAI(prompt);
      else text = await generateViaGemini(prompt);
      const tasks = parseTaskList(text);
      if (provider !== GENERATOR) {
        loud(`\n⚠ ${GENERATOR} unavailable — falling through to ${provider} for the remainder.`);
        if (GENERATOR === "anthropic") {
          loud(`  Top up: https://console.anthropic.com/settings/billing — then rerun with --force to refresh.`);
        }
        GENERATOR = provider;
      }
      return tasks;
    } catch (err) {
      if (!isQuotaOrAuthError(err.body)) throw err;
      // else: try the next provider
    }
  }
  throw new Error("All generation providers exhausted (auth/quota errors on each).");
}

// ── Gemini: embed batch ───────────────────────────────────────────────────

async function embedViaOpenAI(texts) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
      dimensions: 768, // pin to 768 for parity with Gemini fallback + smaller cache
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`OpenAI embed ${res.status}: ${body}`);
    err.body = body;
    throw err;
  }
  const data = await res.json();
  return (data.data ?? []).map((e) => e.embedding);
}

async function embedViaGemini(texts) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${GOOGLE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: texts.map((t) => ({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: t }] },
          taskType: "RETRIEVAL_DOCUMENT",
          outputDimensionality: 768,
        })),
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Gemini embed ${res.status}: ${body}`);
    err.body = body;
    throw err;
  }
  const data = await res.json();
  return (data.embeddings ?? []).map((e) => e.values);
}

async function embedBatch(texts) {
  const order = EMBEDDER === "openai" ? ["openai", "google"] : ["google", "openai"];
  for (const provider of order) {
    if (provider === "openai" && !HAS_OPENAI) continue;
    if (provider === "google" && !HAS_GOOGLE) continue;
    try {
      const vectors = provider === "openai" ? await embedViaOpenAI(texts) : await embedViaGemini(texts);
      if (provider !== EMBEDDER) {
        loud(`\n⚠ ${EMBEDDER} embedder unavailable — switching to ${provider} for the rest of this run.`);
        EMBEDDER = provider;
      }
      return vectors;
    } catch (err) {
      if (!isQuotaOrAuthError(err.body)) throw err;
    }
  }
  throw new Error("All embedding providers exhausted (auth/quota errors on each).");
}

function average(vectors) {
  if (vectors.length === 0) return null;
  const dim = vectors[0].length;
  const out = new Array(dim).fill(0);
  for (const v of vectors) for (let i = 0; i < dim; i++) out[i] += v[i];
  for (let i = 0; i < dim; i++) out[i] /= vectors.length;
  // L2-normalize for cosine == dot product at runtime
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += out[i] * out[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < dim; i++) out[i] /= norm;
  return out;
}

// ── main ──────────────────────────────────────────────────────────────────

async function main() {
  const skillsDir = path.join(REPO_ROOT, "skills");
  const cacheDir = path.join(REPO_ROOT, "mcp-server", "data");
  const cachePath = path.join(cacheDir, "tool2vec-cache.json");

  if (!fs.existsSync(skillsDir)) fatal(`skills/ not found at ${skillsDir}`);
  fs.mkdirSync(cacheDir, { recursive: true });

  let cache = { version: 1, dim: 768, skills: {} };
  if (fs.existsSync(cachePath) && !FORCE) {
    cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }

  // Flush on SIGINT/SIGTERM so a kill mid-build doesn't lose all progress.
  function flushAndExit(code) {
    try { fs.writeFileSync(cachePath, JSON.stringify(cache)); } catch {}
    process.exit(code);
  }
  process.on("SIGINT", () => flushAndExit(130));
  process.on("SIGTERM", () => flushAndExit(143));
  process.on("SIGHUP", () => flushAndExit(129));

  let skills = loadSkills(skillsDir);
  if (LIMIT) skills = skills.slice(0, LIMIT);

  loud(`Found ${skills.length} skills. Cache has ${Object.keys(cache.skills).length} entries.`);

  let built = 0;
  let skipped = 0;
  let failed = 0;
  let inflight = 0;
  let processed = 0;
  const start = Date.now();
  const queue = [...skills];

  // Persist on a debounced timer instead of after every skill — concurrent writes are wasteful.
  let dirty = false;
  const flushTimer = setInterval(() => {
    if (dirty) {
      fs.writeFileSync(cachePath, JSON.stringify(cache));
      dirty = false;
    }
  }, 2000);

  async function worker() {
    while (queue.length > 0) {
      const skill = queue.shift();
      if (!skill) return;
      const cached = cache.skills[skill.id];
      if (cached && cached.contentHash === skill.contentHash && !FORCE) {
        skipped++;
        processed++;
        continue;
      }
      inflight++;
      try {
        const tasks = await generateTasks(skill);
        if (tasks.length < 3) throw new Error(`only got ${tasks.length} tasks`);
        const vectors = await embedBatch(tasks);
        if (vectors.length === 0) throw new Error("no embeddings");
        const avg = average(vectors);
        cache.skills[skill.id] = { contentHash: skill.contentHash, tasks, vector: avg };
        built++;
        dirty = true;
      } catch (err) {
        failed++;
        process.stderr.write(`  [FAIL] ${skill.id}: ${err.message}\n`);
      }
      inflight--;
      processed++;
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      process.stderr.write(`  [${processed}/${skills.length}] built=${built} skipped=${skipped} failed=${failed} inflight=${inflight} ${elapsed}s\n`);
    }
  }

  loud(`Running ${CONCURRENCY} workers in parallel.`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  clearInterval(flushTimer);
  // Final flush
  fs.writeFileSync(cachePath, JSON.stringify(cache));

  const took = ((Date.now() - start) / 1000).toFixed(1);
  loud(`\nDone. built=${built} skipped=${skipped} failed=${failed} in ${took}s`);
  if (fs.existsSync(cachePath)) {
    loud(`Cache: ${cachePath} (${(fs.statSync(cachePath).size / 1024).toFixed(1)} KB)`);
  } else {
    loud(`Cache: not written (no skills built)`);
  }
}

main().catch((err) => fatal(err.stack || err.message));
