/**
 * Export the Skill Graft v2 run (2 conditions × 4 judges × 1 pair) into the
 * single JSON the marketing site ships at /data/skill-graft-bench.json.
 *
 * Reads from <run-dir>:
 *   <prompt-id>/_meta.json
 *   <prompt-id>/{vanilla_v2,skill_graft_v2}.json
 *   verdicts__<judge-tag>__vanilla_v2_vs_skill_graft_v2.json   (one per judge)
 *   summary__<judge-tag>__vanilla_v2_vs_skill_graft_v2.json
 *
 * Writes apps/marketing/public/data/skill-graft-bench.json
 *
 * Usage:
 *   pnpm tsx scripts/bench/export-sg-v2.ts <run-dir>
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const RUN_DIR = process.argv[2];
if (!RUN_DIR || !fs.existsSync(RUN_DIR)) {
  process.stderr.write("Usage: pnpm tsx scripts/bench/export-sg-v2.ts <run-dir>\n");
  process.exit(1);
}

const PAIR = "vanilla_v2_vs_skill_graft_v2";

const JUDGE_LABELS: Record<string, string> = {
  "opus-4-5": "Opus 4.5",
  "opus-4-7": "Opus 4.7",
  "gpt-5-2025-08-07": "gpt-5-2025-08-07",
  "gpt-5.5-2026-04-23": "gpt-5.5-2026-04-23",
};

const JUDGE_ORDER = ["opus-4-5", "opus-4-7", "gpt-5-2025-08-07", "gpt-5.5-2026-04-23"];

type VerdictBlock = {
  winner: string;
  margin: number;
  reasoning: string;
  criteria: Record<string, string>;
};

function blockFromVerdict(v: any): VerdictBlock | null {
  if (!v) return null;
  return {
    winner: v.resolvedWinner,
    margin: v.margin ?? 0,
    reasoning: v.verdict?.reasoning ?? "",
    criteria: v.resolvedCriteria ?? {},
  };
}

function loadVerdicts(filename: string): Map<string, any> {
  const p = path.join(RUN_DIR, filename);
  const map = new Map<string, any>();
  if (!fs.existsSync(p)) return map;
  const list: any[] = JSON.parse(fs.readFileSync(p, "utf-8"));
  for (const v of list) map.set(v.promptId, v);
  return map;
}

function discoverJudges(): string[] {
  const seen = new Set<string>();
  for (const fn of fs.readdirSync(RUN_DIR)) {
    const m = fn.match(/^verdicts__(.+?)__vanilla_v2_vs_skill_graft_v2\.json$/);
    if (m) seen.add(m[1]);
  }
  return [...seen].sort((a, b) => {
    const ai = JUDGE_ORDER.indexOf(a), bi = JUDGE_ORDER.indexOf(b);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return a.localeCompare(b);
  });
}

function readCondition(promptDir: string, condition: string) {
  const p = path.join(promptDir, `${condition}.json`);
  if (!fs.existsSync(p)) return null;
  const data = JSON.parse(fs.readFileSync(p, "utf-8"));
  return {
    response: data.response ?? "",
    in: data.inputTokens ?? 0,
    out: data.outputTokens ?? 0,
    ms: data.latencyMs ?? 0,
    turns: data.turns,
    toolCalls: data.toolCalls,
    graftedSkillIds: data.graftedSkillIds,
    secondarySkillIds: data.secondarySkillIds,
    cascadeBreakdown: data.cascadeBreakdown,
    systemPromptBytes: data.systemPromptBytes,
  };
}

function loadSkillBundle(skillId: string): { body: string; references: Array<{ path: string; bytes: number; title: string }> } | null {
  const skillsDir = path.join(REPO_ROOT, "skills", skillId);
  const skillPath = path.join(skillsDir, "SKILL.md");
  if (!fs.existsSync(skillPath)) return null;
  const body = fs.readFileSync(skillPath, "utf-8");
  const references: Array<{ path: string; bytes: number; title: string }> = [];
  const refDir = path.join(skillsDir, "references");
  if (fs.existsSync(refDir)) {
    for (const entry of fs.readdirSync(refDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      const fp = path.join(refDir, entry.name);
      const bytes = fs.statSync(fp).size;
      let title = "";
      try {
        const head = fs.readFileSync(fp, "utf-8").split("\n").find((l) => l.startsWith("# "));
        if (head) title = head.replace(/^#\s+/, "").trim();
      } catch {}
      references.push({ path: `references/${entry.name}`, bytes, title });
    }
  }
  return { body, references };
}

function main() {
  const judgeTags = discoverJudges();
  process.stderr.write(`Discovered judges: ${judgeTags.join(", ")}\n`);

  // verdicts[judgeTag] = Map<promptId, raw verdict>
  const verdicts: Record<string, Map<string, any>> = {};
  for (const tag of judgeTags) {
    verdicts[tag] = loadVerdicts(`verdicts__${tag}__${PAIR}.json`);
  }

  const summaries: Record<string, any> = {};
  for (const tag of judgeTags) {
    const sp = path.join(RUN_DIR, `summary__${tag}__${PAIR}.json`);
    summaries[tag] = fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, "utf-8")) : null;
  }

  const promptDirs = fs.readdirSync(RUN_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name).sort();

  // Build a unique skill pool — each grafted/secondary skill stored once, referenced by ID per prompt
  const skillPool: Record<string, { id: string; name: string; description: string; body?: string; references?: Array<{ path: string; bytes: number; title: string }> }> = {};

  const prompts: any[] = [];
  for (const promptId of promptDirs) {
    const promptDir = path.join(RUN_DIR, promptId);
    const metaPath = path.join(promptDir, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    const vanilla = readCondition(promptDir, "vanilla_v2");
    const graft = readCondition(promptDir, "skill_graft_v2");
    if (!vanilla || !graft || !vanilla.response || !graft.response) continue;

    const verdictsPerJudge: Record<string, VerdictBlock | null> = {};
    for (const tag of judgeTags) {
      verdictsPerJudge[tag] = blockFromVerdict(verdicts[tag].get(promptId));
    }

    // Hydrate skill pool with bodies for primary skills, descriptions for secondary
    const cascadeById = new Map<string, { id: string; score: number }>();
    for (const c of (graft.cascadeBreakdown ?? [])) cascadeById.set(c.id, c);
    const primaryIds = graft.graftedSkillIds ?? [];
    const secondaryIds = graft.secondarySkillIds ?? [];
    const allSkillIds = [...primaryIds, ...secondaryIds];
    for (const sid of allSkillIds) {
      if (skillPool[sid]) continue;
      // We need name/description — load from skills index if not already
      const skillDir = path.join(REPO_ROOT, "skills", sid);
      let name = sid, desc = "";
      const skillPath = path.join(skillDir, "SKILL.md");
      if (fs.existsSync(skillPath)) {
        const raw = fs.readFileSync(skillPath, "utf-8");
        const fm = raw.match(/^---\n([\s\S]*?)\n---/);
        if (fm) {
          const nm = fm[1].match(/^name:\s*(.+)$/m); if (nm) name = nm[1].trim().replace(/^["']|["']$/g, "");
          const dm = fm[1].match(/^description:\s*(.+)$/m); if (dm) desc = dm[1].trim().replace(/^["']|["']$/g, "");
        }
      }
      skillPool[sid] = { id: sid, name, description: desc };
    }
    // For PRIMARY skills only, attach the SKILL.md body + reference tree
    for (const sid of primaryIds) {
      if (skillPool[sid].body !== undefined) continue;
      const bundle = loadSkillBundle(sid);
      if (bundle) {
        skillPool[sid].body = bundle.body;
        skillPool[sid].references = bundle.references;
      }
    }

    prompts.push({
      id: promptId,
      category: meta.category,
      prompt: meta.prompt,
      referenceSkill: meta.referenceSkill,
      acceptableSkills: meta.acceptableSkills ?? [],
      cascade: meta.cascade ?? [],
      cascadeHit: meta.cascadeHit ?? false,
      graftedSkillIds: graft.graftedSkillIds ?? [],
      secondarySkillIds: graft.secondarySkillIds ?? [],
      responses: {
        vanilla: vanilla.response,
        skill_graft: graft.response,
      },
      meta: {
        vanilla: { in: vanilla.in, out: vanilla.out, ms: vanilla.ms },
        skill_graft: {
          in: graft.in,
          out: graft.out,
          ms: graft.ms,
          turns: graft.turns,
          toolCalls: graft.toolCalls,
          systemPromptBytes: graft.systemPromptBytes,
        },
      },
      verdicts: verdictsPerJudge,
    });
  }

  const out = {
    runId: path.basename(RUN_DIR),
    generatedAt: new Date().toISOString(),
    sonnetModel: "claude-sonnet-4-6",
    judges: judgeTags.map((tag) => ({ tag, label: JUDGE_LABELS[tag] ?? tag })),
    promptCount: prompts.length,
    summaries,
    skillPool,
    prompts,
  };

  const outPath = path.join(REPO_ROOT, "apps", "marketing", "public", "data", "skill-graft-bench.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out));
  const bytes = fs.statSync(outPath).size;
  process.stderr.write(`Wrote ${prompts.length} prompts × 2 conditions × ${judgeTags.length} judges, ${(bytes / 1024).toFixed(0)} KB → ${outPath}\n`);
}

main();
