/**
 * Pair-flexible judge — judges arbitrary condition pairs in clean runs.
 *
 * Reads `<run-dir>/<prompt-id>/{condA,condB}.json` and writes verdicts under
 * `<run-dir>/verdicts__<judge-tag>__<condA>_vs_<condB>.json`.
 *
 * Usage:
 *   pnpm tsx scripts/bench/judge-pairs.ts <run-dir> --pair vanilla,skill_graft --provider anthropic --model claude-opus-4-7 --tag opus-4-7
 *   pnpm tsx scripts/bench/judge-pairs.ts <run-dir> --pair vanilla,next_move  --provider openai    --model gpt-5.5-2026-04-23 --tag gpt-5.5
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

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

const argv = process.argv.slice(2);
const RUN_DIR = argv.find((a) => !a.startsWith("--")) ?? "";
function arg(name: string): string | null { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; }
const PAIR = arg("--pair");
const PROVIDER = (arg("--provider") ?? "anthropic") as "anthropic" | "openai";
const MODEL = arg("--model") ?? (PROVIDER === "anthropic" ? "claude-opus-4-7" : "gpt-5.5-2026-04-23");
const TAG = arg("--tag") ?? MODEL;
const CONCURRENCY = parseInt(arg("--concurrency") ?? "4", 10);
const LIMIT = arg("--limit") ? parseInt(arg("--limit")!, 10) : null;

if (!RUN_DIR || !fs.existsSync(RUN_DIR) || !PAIR) {
  process.stderr.write(`Usage: pnpm tsx scripts/bench/judge-pairs.ts <run-dir> --pair condA,condB --provider anthropic|openai --model <id> --tag <slug>\n`);
  process.exit(1);
}
const [CONDA, CONDB] = PAIR.split(",").map((s) => s.trim());
if (!CONDA || !CONDB) { process.stderr.write(`--pair must be "condA,condB"\n`); process.exit(1); }

const RUBRIC = `You are an impartial senior-engineering judge comparing two AI-generated responses to the same engineering question.

Score each response on five criteria. For each criterion pick "1", "2", or "tie":
- addresses_actual_problem: does the response answer the actual question, or sidestep it?
- correctness: are the technical claims, code, and APIs correct?
- respects_conventions: does it follow community/library conventions and idioms?
- avoids_hallucinations: does it stay grounded vs invent details?
- actionable: can the engineer act on this directly?

Respond with JSON only:
{
  "winner": "1" | "2" | "tie",
  "reasoning": "one or two sentences",
  "per_criterion": { "addresses_actual_problem": "1"|"2"|"tie", "correctness": "...", "respects_conventions": "...", "avoids_hallucinations": "...", "actionable": "..." }
}`;

// ── client ───────────────────────────────────────────────────────────────

const anthropic = PROVIDER === "anthropic" ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const supportsTemperature = !/claude-opus-4-[7-9]|claude-opus-[5-9]|claude-sonnet-4-[6-9]|claude-sonnet-[5-9]/.test(MODEL);

async function judgeAnthropic(userMsg: string): Promise<{ verdict: any; inputTokens: number; outputTokens: number }> {
  const body: any = { model: MODEL, max_tokens: 1024, system: RUBRIC, messages: [{ role: "user", content: userMsg }] };
  if (supportsTemperature) body.temperature = 0;
  const res = await anthropic!.messages.create(body);
  const text = res.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  return { verdict: extractJson(text), inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens };
}

async function judgeOpenAI(userMsg: string): Promise<{ verdict: any; inputTokens: number; outputTokens: number }> {
  const body: any = {
    model: MODEL,
    messages: [{ role: "system", content: RUBRIC }, { role: "user", content: userMsg }],
    response_format: { type: "json_object" },
  };
  if (!/^gpt-5(\.|$|-)/.test(MODEL) && !/^o\d/.test(MODEL)) body.temperature = 0;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return { verdict: extractJson(text), inputTokens: data.usage?.prompt_tokens ?? 0, outputTokens: data.usage?.completion_tokens ?? 0 };
}

function extractJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error(`no JSON in: ${text.slice(0, 200)}`);
  return JSON.parse(raw.slice(start, end + 1));
}

// ── orchestration ────────────────────────────────────────────────────────

type PairResult = {
  promptId: string;
  category: string;
  pair: string;
  firstWasFirst: boolean;
  verdict: any;
  resolvedWinner: string;
  resolvedCriteria: Record<string, string>;
  margin: number;
};

function resolve(verdict: any, firstWasFirst: boolean): { winner: string; crit: Record<string, string>; margin: number } {
  // Map "1"/"2" back to condA/condB based on shuffle order
  const map = (v: string) => {
    if (v === "tie") return "tie";
    const isFirst = v === "1";
    const isCondA = firstWasFirst ? isFirst : !isFirst;
    return isCondA ? CONDA : CONDB;
  };
  const winner = map(verdict.winner ?? "tie");
  const crit: Record<string, string> = {};
  let aPoints = 0, bPoints = 0;
  for (const [k, v] of Object.entries(verdict.per_criterion ?? {})) {
    const m = map(v as string);
    crit[k] = m;
    if (m === CONDA) aPoints++;
    else if (m === CONDB) bPoints++;
  }
  const margin = Math.abs(aPoints - bPoints);
  return { winner, crit, margin };
}

async function judgePair(promptId: string, category: string, prompt: string, respA: string, respB: string): Promise<PairResult> {
  const firstWasFirst = (Math.random() < 0.5);
  const r1 = firstWasFirst ? respA : respB;
  const r2 = firstWasFirst ? respB : respA;
  const userMsg = `# Prompt\n${prompt}\n\n---\n\n# Response 1\n${r1}\n\n---\n\n# Response 2\n${r2}`;
  const { verdict } = PROVIDER === "anthropic" ? await judgeAnthropic(userMsg) : await judgeOpenAI(userMsg);
  const { winner, crit, margin } = resolve(verdict, firstWasFirst);
  return { promptId, category, pair: `${CONDA}_vs_${CONDB}`, firstWasFirst, verdict, resolvedWinner: winner, resolvedCriteria: crit, margin };
}

async function main() {
  const verdictsPath = path.join(RUN_DIR, `verdicts__${TAG}__${CONDA}_vs_${CONDB}.json`);
  const summaryPath = path.join(RUN_DIR, `summary__${TAG}__${CONDA}_vs_${CONDB}.json`);

  const promptDirs = fs.readdirSync(RUN_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name).sort();
  const all = LIMIT ? promptDirs.slice(0, LIMIT) : promptDirs;

  process.stderr.write(`Judge: ${MODEL} (${PROVIDER})  Pair: ${CONDA} vs ${CONDB}  Tag: ${TAG}\n`);
  process.stderr.write(`Run dir: ${RUN_DIR}\n`);
  process.stderr.write(`Output: ${path.basename(verdictsPath)}\n`);
  process.stderr.write(`Prompts: ${all.length}  Concurrency: ${CONCURRENCY}\n\n`);

  const results: PairResult[] = [];
  let cursor = 0;
  let lastWrite = Date.now();

  async function worker() {
    while (cursor < all.length) {
      const idx = cursor++;
      const promptId = all[idx];
      const dir = path.join(RUN_DIR, promptId);
      const meta = path.join(dir, "_meta.json");
      const aPath = path.join(dir, `${CONDA}.json`);
      const bPath = path.join(dir, `${CONDB}.json`);
      if (!fs.existsSync(meta) || !fs.existsSync(aPath) || !fs.existsSync(bPath)) {
        process.stderr.write(`  [skip ${promptId}] missing files\n`);
        continue;
      }
      const m = JSON.parse(fs.readFileSync(meta, "utf-8"));
      const a = JSON.parse(fs.readFileSync(aPath, "utf-8"));
      const b = JSON.parse(fs.readFileSync(bPath, "utf-8"));
      if (!a.response || !b.response) {
        process.stderr.write(`  [skip ${promptId}] empty response (a=${!!a.response}, b=${!!b.response})\n`);
        continue;
      }
      const t0 = Date.now();
      try {
        const r = await judgePair(promptId, m.category, m.prompt, a.response, b.response);
        results.push(r);
        process.stderr.write(`  [${results.length}/${all.length}] ${promptId} → ${r.resolvedWinner} (${r.margin}/5)  ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
        if (Date.now() - lastWrite > 3000) {
          fs.writeFileSync(verdictsPath, JSON.stringify(results, null, 2));
          lastWrite = Date.now();
        }
      } catch (err: any) {
        process.stderr.write(`  [FAIL] ${promptId}: ${err.message}\n`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  fs.writeFileSync(verdictsPath, JSON.stringify(results, null, 2));

  // Summary
  const tally: Record<string, number> = { [CONDA]: 0, [CONDB]: 0, tie: 0 };
  const critTally: Record<string, Record<string, number>> = {};
  for (const r of results) {
    tally[r.resolvedWinner] = (tally[r.resolvedWinner] ?? 0) + 1;
    for (const [k, v] of Object.entries(r.resolvedCriteria)) {
      critTally[k] = critTally[k] ?? {};
      critTally[k][v] = (critTally[k][v] ?? 0) + 1;
    }
  }
  fs.writeFileSync(summaryPath, JSON.stringify({
    judgeModel: MODEL, judgeTag: TAG, provider: PROVIDER, pair: `${CONDA}_vs_${CONDB}`,
    runDir: RUN_DIR, n: results.length, tally, perCriterion: critTally,
  }, null, 2));

  const a = tally[CONDA] ?? 0, b = tally[CONDB] ?? 0, t = tally.tie ?? 0;
  process.stderr.write(`\n${CONDA}: ${a}  ${CONDB}: ${b}  ties: ${t}\n`);
  process.stderr.write(`Wrote ${verdictsPath}\n`);
}

main().catch((err) => { process.stderr.write(`FATAL: ${err.stack ?? err.message}\n`); process.exit(1); });
