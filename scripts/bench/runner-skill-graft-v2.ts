/**
 * Skill Graft v2 — does what /next-move + skillful-node-prompt actually demand.
 *
 * Where v1 grafted top-2 skill bodies as system prompt prose, v2 builds a real
 * Branch 1 (Identity) + Branch 4 (Protocol) prompt:
 *
 *   IDENTITY
 *     - PRIMARY skill: full SKILL.md body
 *     - SECONDARY skills (top 4-5 from cascade): name + description (catalog)
 *     - REFERENCES available: list of files with paths and descriptions
 *
 *   PROTOCOL
 *     - Task-handling loop (restate → assess → execute → validate → report)
 *     - Escalation contract (refuse out-of-scope tasks)
 *     - Confidence self-assessment block
 *
 * One Sonnet 4.6 call per prompt. max_tokens 32768 (no truncation).
 * Conditions written: vanilla_v2.json, skill_graft_v2.json
 *
 * Usage:
 *   pnpm tsx scripts/bench/runner-skill-graft-v2.ts --run sg-v2
 *   pnpm tsx scripts/bench/runner-skill-graft-v2.ts --run sg-v2 --limit 5    # smoke
 *   pnpm tsx scripts/bench/runner-skill-graft-v2.ts --run sg-v2 --conds skill_graft_v2
 */

import Anthropic from "@anthropic-ai/sdk";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SkillSearchService,
  type IndexableSkill,
} from "../../packages/core/src/retrieval/skill-search-service.ts";
import { loadSkillsFromDirectory } from "../../packages/core/src/data/skills/index.ts";
import { DATASET, type BenchPrompt } from "./dataset.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

function loadDotenv() {
  for (const p of [".env.local", ".env"].map((f) => path.join(REPO_ROOT, f))) {
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2];
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
}
loadDotenv();

if (!process.env.ANTHROPIC_API_KEY) { process.stderr.write("ANTHROPIC_API_KEY missing.\n"); process.exit(1); }
if (!process.env.OPENAI_API_KEY) { process.stderr.write("OPENAI_API_KEY missing.\n"); process.exit(1); }

// ── Tool2Vec cache (must be present; same as runner-clean) ───────────────

const TOOL2VEC_CACHE = path.join(os.homedir(), ".windags", "tool2vec-embeddings.json");
function countSkillsOnDisk(): number {
  return fs.readdirSync(path.join(REPO_ROOT, "skills"), { withFileTypes: true }).filter((e) => e.isDirectory()).length;
}
function ensureTool2VecCache() {
  if (!fs.existsSync(TOOL2VEC_CACHE)) {
    process.stderr.write(`Tool2Vec cache missing — building...\n`);
    const r = spawnSync("pnpm", ["tsx", path.join(__dirname, "build-tool2vec-cache.ts"), "--concurrency", "10"], { stdio: "inherit", cwd: REPO_ROOT });
    if (r.status !== 0) { process.stderr.write(`FATAL: cache build failed\n`); process.exit(1); }
    return;
  }
  const cached = JSON.parse(fs.readFileSync(TOOL2VEC_CACHE, "utf-8"));
  const cachedCount = Object.keys(cached.embeddings ?? {}).length;
  const catalog = countSkillsOnDisk();
  if (cachedCount < Math.floor(catalog * 0.8)) {
    process.stderr.write(`Tool2Vec cache stale (${cachedCount}/${catalog}) — rebuilding...\n`);
    const r = spawnSync("pnpm", ["tsx", path.join(__dirname, "build-tool2vec-cache.ts"), "--concurrency", "10"], { stdio: "inherit", cwd: REPO_ROOT });
    if (r.status !== 0) { process.stderr.write(`FATAL: cache build failed\n`); process.exit(1); }
  }
}
ensureTool2VecCache();

// ── args ─────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const LIMIT = (() => { const i = argv.indexOf("--limit"); return i >= 0 ? parseInt(argv[i + 1], 10) : null; })();
const CONCURRENCY = (() => { const i = argv.indexOf("--concurrency"); return i >= 0 ? parseInt(argv[i + 1], 10) : 4; })();
const CONDS = (() => {
  const i = argv.indexOf("--conds");
  if (i < 0) return new Set(["vanilla_v2", "skill_graft_v2"]);
  return new Set(argv[i + 1].split(","));
})();
const RUN_NAME = (() => { const i = argv.indexOf("--run"); return i >= 0 ? argv[i + 1] : null; })();
const PRIMARY_COUNT = parseInt(process.env.SG_PRIMARY_COUNT ?? "4", 10); // full bodies
const SECONDARY_COUNT = parseInt(process.env.SG_SECONDARY_COUNT ?? "4", 10); // catalog entries

const SONNET_MODEL = process.env.BENCH_SONNET_MODEL ?? "claude-sonnet-4-6";
const MAX_TOKENS = parseInt(process.env.BENCH_MAX_TOKENS ?? "32768", 10);
const MAX_TURNS = parseInt(process.env.SG_MAX_TURNS ?? "8", 10);
const SUPPORTS_TEMPERATURE = !/claude-sonnet-4-[6-9]|claude-sonnet-[5-9]|claude-opus-4-[7-9]|claude-opus-[5-9]/.test(SONNET_MODEL);

// ── skill index ──────────────────────────────────────────────────────────

const SKILLS_DIR = path.join(REPO_ROOT, "skills");
process.stderr.write(`Loading skills from ${SKILLS_DIR}\n`);
const skills = loadSkillsFromDirectory(SKILLS_DIR);
process.stderr.write(`Loaded ${skills.length} skills\n`);
const indexable: IndexableSkill[] = skills.map((s) => ({
  id: s.id, name: s.name, description: s.description, tags: s.tags, category: s.category,
  skillPath: path.join(SKILLS_DIR, s.id),
}));
const search = new SkillSearchService();
search.initialize(indexable);
process.stderr.write(`Cascade indexed: ${search.skillCount} skills (primary=${PRIMARY_COUNT}, secondary=${SECONDARY_COUNT})\n`);

// ── prompt construction (skillful-node-prompt Branch 1 + Branch 4) ───────

const PROTOCOL_BLOCK = `# Protocol

## Task-Handling Loop
1. **Restate** the engineer's question in your own words to confirm understanding.
2. **Assess fit** — do the grafted expert skills actually cover what they're asking? If not, escalate (see below).
3. **Execute** — produce the technical answer using the grafted expertise as authoritative context.
4. **Validate** — sanity-check claims, code samples, and API references against the skills' content.
5. **Report** — deliver the answer with code, tradeoffs, and concrete next steps the engineer can act on.

## Escalation Contract
If the question is meaningfully out of scope for the grafted skills (e.g., the cascade missed the right specialist, or the user is asking something fundamentally different from what the skills cover), say so explicitly. Don't fake expertise. A clear "this isn't quite the right skill set for X — here's what I can answer, and here's what's missing" is more useful than a confident wrong answer.

## Tools You Have

You can call these tools mid-response:

- **\`read_skill_reference(skill_id, reference_path)\`** — Load any reference file listed under one of the grafted skills (e.g. \`references/oauth-flow-types.md\`). The reference list per skill is shown alongside its body in the Identity section. Use this when a reference's title sounds directly relevant to the engineer's question — references contain worked examples, schemas, and deeper expertise that the SKILL.md body summarizes.
- **\`windags_skill_search(query, limit)\`** — Search the full 547-skill catalog if the grafted skills don't cover the user's actual question. Use this only when escalating, and mention what was missing.

Don't load references reflexively — load them when the SKILL.md mentions a reference that's directly relevant. Multi-turn is fine; just don't burn turns aimlessly.

## Confidence Block
At the end of your response, include a short confidence self-assessment:

> **Confidence:** [high | medium | low]
> **Why:** [one sentence — what made you confident, or what's uncertain]
`;

function listReferences(skillId: string): Array<{ path: string; bytes: number; desc: string }> {
  const out: Array<{ path: string; bytes: number; desc: string }> = [];
  const refDir = path.join(SKILLS_DIR, skillId, "references");
  if (!fs.existsSync(refDir)) return out;
  for (const entry of fs.readdirSync(refDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const fp = path.join(refDir, entry.name);
    const stat = fs.statSync(fp);
    let desc = "";
    try {
      const head = fs.readFileSync(fp, "utf-8").split("\n").find((l) => l.startsWith("# "));
      if (head) desc = head.replace(/^#\s+/, "").trim();
    } catch {}
    out.push({ path: `references/${entry.name}`, bytes: stat.size, desc });
  }
  return out;
}

function buildSystemPrompt(graftBundle: { primary: Array<{ id: string; name: string; body: string }>, secondary: Array<{ id: string; name: string; description: string }> }): string {
  const sections: string[] = [];

  sections.push(`You are a senior engineer answering a technical question. The WinDAGs cascade has grafted ${graftBundle.primary.length} expert skill${graftBundle.primary.length === 1 ? "" : "s"} into your context plus ${graftBundle.secondary.length} adjacent skills for awareness. Use these as authoritative expertise — they were selected by a hybrid retrieval cascade (BM25 → Tool2Vec → RRF → cross-encoder → attribution k-NN) over 547 skills.`);

  sections.push(`# Identity — Grafted Expertise`);

  // Primary skills: full bodies
  for (const s of graftBundle.primary) {
    const refs = listReferences(s.id);
    let refList = "";
    if (refs.length > 0) {
      refList = `\n\n_Reference files available for this skill (load on-demand if needed):_\n` +
        refs.map((r) => `- \`${r.path}\` (${(r.bytes / 1024).toFixed(1)}KB)${r.desc ? ` — ${r.desc}` : ""}`).join("\n");
    }
    sections.push(`## Skill: ${s.id} — ${s.name}\n\n${s.body}${refList}`);
  }

  // Secondary skills: catalog entries only
  if (graftBundle.secondary.length > 0) {
    const catalog = graftBundle.secondary
      .map((s) => `- **${s.id}** — ${s.name}: ${s.description}`)
      .join("\n");
    sections.push(`## Adjacent Skills (catalog awareness)\n\nThese skills are nearby in cascade space. Mention them by name if you're escalating or if the user's task touches them, but you don't have their full bodies — only descriptions.\n\n${catalog}`);
  }

  sections.push(PROTOCOL_BLOCK);

  return sections.join("\n\n---\n\n");
}

// ── tools (for skill_graft_v2 arm) ───────────────────────────────────────

const TOOLS = [
  {
    name: "read_skill_reference",
    description: "Load a reference file from a grafted skill's references/ directory (e.g. 'references/oauth-flow-types.md'). ONLY use paths shown in the 'Reference files available' list of the skill's Identity section — don't guess filenames. If the path doesn't exist, the tool returns the actual file list for that skill so you can pick a real one.",
    input_schema: { type: "object" as const, properties: { skill_id: { type: "string" }, reference_path: { type: "string" } }, required: ["skill_id", "reference_path"] },
  },
  {
    name: "windags_skill_search",
    description: "Search the full 547-skill catalog by free-text query when grafted skills don't cover the actual question. Returns top matches with id, name, description, score.",
    input_schema: { type: "object" as const, properties: { query: { type: "string" }, limit: { type: "number", default: 8 } }, required: ["query"] },
  },
];

async function executeTool(name: string, input: any, taskEmbedding: number[] | undefined): Promise<string> {
  try {
    if (name === "read_skill_reference") {
      const skillId = String(input.skill_id ?? "");
      const sub = String(input.reference_path ?? "");
      const rel = sub.startsWith("references/") ? sub : `references/${sub}`;
      const fullPath = path.join(SKILLS_DIR, skillId, rel);
      const skillsAbs = path.resolve(SKILLS_DIR);
      if (!path.resolve(fullPath).startsWith(skillsAbs)) return "ERROR: path escapes skills directory";
      if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, "utf-8");
      // Helpful 404: list what actually exists for this skill
      const refDir = path.join(SKILLS_DIR, skillId, "references");
      if (!fs.existsSync(refDir)) {
        return `ERROR: skill '${skillId}' has no references/ directory. Skip the reference-loading step for this skill; its SKILL.md body is all there is.`;
      }
      const available = fs.readdirSync(refDir).filter((f) => f.endsWith(".md")).map((f) => `references/${f}`);
      return `ERROR: '${rel}' not found in ${skillId}. Available references:\n${available.length ? available.map((p) => `- ${p}`).join("\n") : "(none)"}`;
    }
    if (name === "windags_skill_search") {
      const results = await search.search(String(input.query ?? ""), { topK: input.limit ?? 8, taskEmbedding });
      return JSON.stringify(results.map((r) => ({ id: r.id, name: r.name, description: r.description, score: r.score })), null, 2);
    }
    return `ERROR: unknown tool ${name}`;
  } catch (err: any) {
    return `ERROR: ${err.message}`;
  }
}

// ── client + embeddings ──────────────────────────────────────────────────

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const queryEmbeddings = new Map<string, number[]>();

async function embedQueries(prompts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: "text-embedding-3-small", input: prompts }),
  });
  if (!res.ok) throw new Error(`OpenAI embed ${res.status}`);
  const data = await res.json();
  return (data.data ?? []).map((e: any) => {
    const v = e.embedding as number[];
    let n = 0; for (const x of v) n += x * x; n = Math.sqrt(n) || 1;
    return v.map((x) => x / n);
  });
}

async function precomputeQueryEmbeddings(dataset: BenchPrompt[]) {
  const BATCH = 64;
  for (let i = 0; i < dataset.length; i += BATCH) {
    const slice = dataset.slice(i, i + BATCH);
    const vecs = await embedQueries(slice.map((p) => p.prompt));
    slice.forEach((p, j) => queryEmbeddings.set(p.id, vecs[j]));
  }
}

// ── condition runners ────────────────────────────────────────────────────

type Result = {
  condition: string;
  prompt: string;
  systemPromptBytes?: number;
  graftedSkillIds?: string[];
  secondarySkillIds?: string[];
  cascadeBreakdown?: Array<{ id: string; score: number }>;
  response: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  turns?: number;
  toolCalls?: Array<{ tool: string; input: any; bytesReturned: number }>;
  error?: string;
};

async function callSonnet(systemPrompt: string | null, userPrompt: string): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const body: any = { model: SONNET_MODEL, max_tokens: MAX_TOKENS, system: systemPrompt ?? undefined, messages: [{ role: "user", content: userPrompt }] };
  if (SUPPORTS_TEMPERATURE) body.temperature = 0;
  // Streaming required when max_tokens is high (Anthropic limit ~10min on non-streaming requests).
  const stream = client.messages.stream(body);
  const final = await stream.finalMessage();
  const text = final.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  return { text, inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens };
}

async function runVanillaV2(prompt: BenchPrompt): Promise<Result> {
  const start = Date.now();
  try {
    const r = await callSonnet(null, prompt.prompt);
    return { condition: "vanilla_v2", prompt: prompt.prompt, response: r.text, inputTokens: r.inputTokens, outputTokens: r.outputTokens, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { condition: "vanilla_v2", prompt: prompt.prompt, response: "", inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - start, error: err.message };
  }
}

async function runSkillGraftV2(prompt: BenchPrompt): Promise<Result> {
  const start = Date.now();
  const taskEmbedding = queryEmbeddings.get(prompt.id);
  const total = PRIMARY_COUNT + SECONDARY_COUNT;
  let results;
  try {
    results = await search.search(prompt.prompt, { topK: total, taskEmbedding });
  } catch (err: any) {
    return { condition: "skill_graft_v2", prompt: prompt.prompt, response: "", inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - start, error: err.message };
  }

  const primary = results.slice(0, PRIMARY_COUNT).map((r) => {
    const bp = path.join(SKILLS_DIR, r.id, "SKILL.md");
    return { id: r.id, name: r.name, body: fs.existsSync(bp) ? fs.readFileSync(bp, "utf-8") : "" };
  }).filter((x) => x.body);
  const secondary = results.slice(PRIMARY_COUNT, total).map((r) => ({ id: r.id, name: r.name, description: r.description }));
  const systemPrompt = buildSystemPrompt({ primary, secondary });

  const toolCalls: NonNullable<Result["toolCalls"]> = [];
  let totalIn = 0, totalOut = 0;
  const messages: any[] = [{ role: "user", content: prompt.prompt }];
  let finalText = "";

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    let res;
    try {
      const body: any = {
        model: SONNET_MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        tools: TOOLS as any,
        messages,
      };
      if (SUPPORTS_TEMPERATURE) body.temperature = 0;
      const stream = client.messages.stream(body);
      res = await stream.finalMessage();
    } catch (err: any) {
      return {
        condition: "skill_graft_v2", prompt: prompt.prompt,
        systemPromptBytes: systemPrompt.length,
        graftedSkillIds: primary.map((x) => x.id),
        secondarySkillIds: secondary.map((x) => x.id),
        cascadeBreakdown: results.slice(0, total).map((x) => ({ id: x.id, score: x.score })),
        response: finalText, inputTokens: totalIn, outputTokens: totalOut,
        latencyMs: Date.now() - start, turns: turn, toolCalls, error: err.message,
      };
    }
    totalIn += res.usage.input_tokens;
    totalOut += res.usage.output_tokens;

    if (res.stop_reason !== "tool_use") {
      finalText = res.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
      return {
        condition: "skill_graft_v2", prompt: prompt.prompt,
        systemPromptBytes: systemPrompt.length,
        graftedSkillIds: primary.map((x) => x.id),
        secondarySkillIds: secondary.map((x) => x.id),
        cascadeBreakdown: results.slice(0, total).map((x) => ({ id: x.id, score: x.score })),
        response: finalText, inputTokens: totalIn, outputTokens: totalOut,
        latencyMs: Date.now() - start, turns: turn + 1, toolCalls,
      };
    }

    const toolResults: any[] = [];
    for (const block of res.content) {
      if (block.type === "tool_use") {
        const result = await executeTool(block.name, block.input, taskEmbedding);
        toolCalls.push({ tool: block.name, input: block.input, bytesReturned: result.length });
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
      }
    }
    messages.push({ role: "assistant", content: res.content });
    messages.push({ role: "user", content: toolResults });
  }

  // Hit max turns
  const last = messages.findLast((m: any) => m.role === "assistant");
  finalText = last ? (last.content as any[]).filter((b: any) => b.type === "text").map((b: any) => b.text).join("") : "";
  return {
    condition: "skill_graft_v2", prompt: prompt.prompt,
    systemPromptBytes: systemPrompt.length,
    graftedSkillIds: primary.map((x) => x.id),
    secondarySkillIds: secondary.map((x) => x.id),
    cascadeBreakdown: results.slice(0, total).map((x) => ({ id: x.id, score: x.score })),
    response: finalText, inputTokens: totalIn, outputTokens: totalOut,
    latencyMs: Date.now() - start, turns: MAX_TURNS, toolCalls,
    error: `Hit max turns (${MAX_TURNS})`,
  };
}

const RUNNERS: Record<string, (p: BenchPrompt) => Promise<Result>> = {
  vanilla_v2: runVanillaV2,
  skill_graft_v2: runSkillGraftV2,
};

// ── orchestration ────────────────────────────────────────────────────────

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const RUN_DIR = path.join(REPO_ROOT, "bench", "runs", RUN_NAME ?? `sg-v2-${stamp}`);
fs.mkdirSync(RUN_DIR, { recursive: true });

async function runOne(prompt: BenchPrompt): Promise<void> {
  const promptDir = path.join(RUN_DIR, prompt.id);
  fs.mkdirSync(promptDir, { recursive: true });

  const metaPath = path.join(promptDir, "_meta.json");
  if (!fs.existsSync(metaPath)) {
    const taskEmbedding = queryEmbeddings.get(prompt.id);
    const cascade = await search.search(prompt.prompt, { topK: PRIMARY_COUNT + SECONDARY_COUNT, taskEmbedding });
    const cascadeIds = cascade.map((c) => c.id);
    const accept = new Set([prompt.referenceSkill, ...(prompt.acceptableSkills ?? [])]);
    const cascadeHit = cascadeIds.some((id) => accept.has(id));
    fs.writeFileSync(metaPath, JSON.stringify({
      promptId: prompt.id,
      category: prompt.category,
      prompt: prompt.prompt,
      referenceSkill: prompt.referenceSkill,
      acceptableSkills: prompt.acceptableSkills ?? [],
      cascade: cascade.map((c) => ({ id: c.id, score: c.score })),
      cascadeHit,
    }, null, 2));
  }

  for (const cond of CONDS) {
    const outPath = path.join(promptDir, `${cond}.json`);
    if (fs.existsSync(outPath)) {
      const existing = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      if (existing.response && !existing.error) {
        process.stderr.write(`[${prompt.id}/${cond}] skip (already done)\n`);
        continue;
      }
    }
    const t0 = Date.now();
    const r = await RUNNERS[cond](prompt);
    fs.writeFileSync(outPath, JSON.stringify(r, null, 2));
    const status = r.error ? `ERR ${r.error.slice(0, 60)}` : `${r.outputTokens}out`;
    const sysBytes = r.systemPromptBytes ? ` sys=${(r.systemPromptBytes / 1024).toFixed(0)}KB` : "";
    const turns = r.turns ? ` ${r.turns}t/${r.toolCalls?.length ?? 0}tools` : "";
    process.stderr.write(`[${prompt.id}/${cond}] ${prompt.category} → ${status}${sysBytes}${turns} (${((Date.now() - t0) / 1000).toFixed(1)}s)\n`);
  }
}

async function main() {
  const dataset = LIMIT ? DATASET.slice(0, LIMIT) : DATASET;
  process.stderr.write(`Run dir: ${RUN_DIR}\n`);
  process.stderr.write(`Conditions: ${[...CONDS].join(", ")}  Sonnet: ${SONNET_MODEL}  max_tokens: ${MAX_TOKENS}\n`);
  process.stderr.write(`Embedding ${dataset.length} queries...\n`);
  await precomputeQueryEmbeddings(dataset);
  process.stderr.write(`Running with concurrency=${CONCURRENCY}\n`);

  let cursor = 0;
  async function worker() {
    while (cursor < dataset.length) {
      const idx = cursor++;
      try { await runOne(dataset[idx]); }
      catch (err: any) { process.stderr.write(`worker error on ${dataset[idx].id}: ${err.message}\n`); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  process.stderr.write(`\nSkill Graft v2 run complete: ${RUN_DIR}\n`);
}

main().catch((err) => { process.stderr.write(`FATAL: ${err.stack ?? err.message}\n`); process.exit(1); });
