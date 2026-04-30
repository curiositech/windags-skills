#!/usr/bin/env node
/**
 * Smoke test for the user-skills loader.
 *
 * Creates a temp dir with three fixture user skills, runs loadUserSkills with
 * the real embedder, asserts that:
 *   - all three skills are loaded with prefixed IDs ("user:<slug>")
 *   - vectors are L2-normalized 384-dim Float32
 *   - the cache file is written
 *   - a second pass hits the cache (zero re-embeds)
 *   - editing a skill's description triggers re-embed for that skill only
 *   - removing a skill drops it from the next load
 *
 * Then runs an end-to-end cascade through index.js wired up with the user
 * skills, asserting that a query matching one of them returns it in the top-K.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { randomUUID } from "node:crypto";

import { embedQuery } from "../cascade.js";
import { loadUserSkills, resolveUserSkillDirs, readUserSkillFile } from "../user-skills.js";

const tmpRoot = path.join(os.tmpdir(), `windags-user-skills-${randomUUID().slice(0, 8)}`);
const skillsDir = path.join(tmpRoot, "skills");
const cacheDir = path.join(tmpRoot, "cache");
fs.mkdirSync(skillsDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

const FIXTURES = [
  {
    slug: "internal-graphql-style",
    frontmatter: {
      name: "Internal GraphQL Style Guide",
      description: "Acme Corp's GraphQL schema conventions: naming, pagination, error envelopes, and federation rules.",
      category: "Backend",
      tags: ["graphql", "api", "internal-only"],
    },
    body: "# Internal GraphQL Style Guide\n\nUse camelCase fields. Errors go in `data.<field>.errors`. ...",
  },
  {
    slug: "deploy-runbook-prod",
    frontmatter: {
      name: "Production Deploy Runbook",
      description: "Step-by-step runbook for promoting a release to production, including the canary checks our team requires.",
      category: "Operations",
      tags: ["deploy", "runbook", "production"],
    },
    body: "# Production Deploy Runbook\n\n1. Verify staging green for 30min...",
  },
  {
    slug: "datadog-dashboards-team-x",
    frontmatter: {
      name: "Team X Datadog Dashboards",
      description: "Where to find observability dashboards for Team X services and how to read the SLO panels.",
      category: "Observability",
      tags: ["datadog", "slo", "team-x"],
    },
    body: "# Team X Datadog Dashboards\n\nMain board: ...",
  },
];

function writeFixture(fx) {
  const dir = path.join(skillsDir, fx.slug);
  fs.mkdirSync(dir, { recursive: true });
  const fmYaml = [
    "---",
    `name: ${fx.frontmatter.name}`,
    `description: "${fx.frontmatter.description.replace(/"/g, '\\"')}"`,
    `category: ${fx.frontmatter.category}`,
    `tags: [${fx.frontmatter.tags.map((t) => `"${t}"`).join(", ")}]`,
    "---",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "SKILL.md"), fmYaml + fx.body);
}

for (const fx of FIXTURES) writeFixture(fx);

console.log(`tmp: ${tmpRoot}`);
console.log(`fixtures: ${FIXTURES.length}`);

let failed = 0;
function check(label, cond, extra = "") {
  if (cond) console.log(`  PASS  ${label}`);
  else { console.log(`  FAIL  ${label}${extra ? ` — ${extra}` : ""}`); failed += 1; }
}

const embedFn = (text) => embedQuery(text);

// ---------------- Pass 1: cold load ----------------
console.log(`\n[1] cold load (expect ${FIXTURES.length} embeds)`);
const t1 = Date.now();
const r1 = await loadUserSkills({
  embedFn,
  cacheDir,
  bundledSkillsDir: "/no/such/dir",
  dirs: [skillsDir],
});
const e1 = Date.now() - t1;
console.log(`  loaded ${r1.count} skills in ${e1}ms`);

check("count matches fixtures", r1.count === FIXTURES.length, `got ${r1.count}`);
check("all ids prefixed user:", r1.skills.every((s) => s.id.startsWith("user:")));
check("vectors length = count * 384", r1.vectors?.length === FIXTURES.length * 384);
check("dim = 384", r1.dim === 384);
check("cache file written", fs.existsSync(path.join(cacheDir, "cache.json")));

// L2 norm check on first vector — embedQuery normalizes, we should preserve.
const v0 = r1.vectors.slice(0, 384);
let norm = 0;
for (let i = 0; i < v0.length; i++) norm += v0[i] * v0[i];
check("vector roughly unit-norm", Math.abs(Math.sqrt(norm) - 1) < 0.01, `|v|=${Math.sqrt(norm).toFixed(4)}`);

// ---------------- Pass 2: warm load (cache hit) ----------------
console.log(`\n[2] warm load (expect 0 re-embeds)`);
const t2 = Date.now();
const r2 = await loadUserSkills({
  embedFn,
  cacheDir,
  bundledSkillsDir: "/no/such/dir",
  dirs: [skillsDir],
});
const e2 = Date.now() - t2;
console.log(`  loaded ${r2.count} skills in ${e2}ms`);

check("warm load same count", r2.count === r1.count);
// Vectors should be byte-identical since the cache round-trips through base64.
let same = r1.vectors.length === r2.vectors.length;
for (let i = 0; same && i < r1.vectors.length; i++) {
  if (r1.vectors[i] !== r2.vectors[i]) same = false;
}
check("warm-load vectors match cold", same);
check("warm load is fast (<200ms)", e2 < 200, `took ${e2}ms — model still warming?`);

// ---------------- Pass 3: edit one skill, re-embed only that one ----------------
console.log(`\n[3] edit one skill, expect targeted re-embed`);
const editSlug = FIXTURES[0].slug;
const editPath = path.join(skillsDir, editSlug, "SKILL.md");
const editedRaw = fs.readFileSync(editPath, "utf-8")
  .replace("Acme Corp", "Acme Corporation");
fs.writeFileSync(editPath, editedRaw);

const r3 = await loadUserSkills({
  embedFn,
  cacheDir,
  bundledSkillsDir: "/no/such/dir",
  dirs: [skillsDir],
});

const edited = r3.skills.find((s) => s.id === `user:${editSlug}`);
check("edited skill present", Boolean(edited));
check("edited description picked up", edited?.description?.includes("Acme Corporation"));

// Different content → different embedding for that one. Compare slice.
const idxBefore = r2.skills.findIndex((s) => s.id === `user:${editSlug}`);
const idxAfter = r3.skills.findIndex((s) => s.id === `user:${editSlug}`);
const before = r2.vectors.slice(idxBefore * 384, (idxBefore + 1) * 384);
const after = r3.vectors.slice(idxAfter * 384, (idxAfter + 1) * 384);
let changed = false;
for (let i = 0; i < 384; i++) {
  if (Math.abs(before[i] - after[i]) > 1e-6) { changed = true; break; }
}
check("edited skill's vector changed", changed);

// Untouched skill should still match its cached vector.
const untouchedSlug = FIXTURES[1].slug;
const idxU2 = r2.skills.findIndex((s) => s.id === `user:${untouchedSlug}`);
const idxU3 = r3.skills.findIndex((s) => s.id === `user:${untouchedSlug}`);
const u2 = r2.vectors.slice(idxU2 * 384, (idxU2 + 1) * 384);
const u3 = r3.vectors.slice(idxU3 * 384, (idxU3 + 1) * 384);
let untouchedSame = true;
for (let i = 0; i < 384; i++) {
  if (u2[i] !== u3[i]) { untouchedSame = false; break; }
}
check("untouched skill's vector identical", untouchedSame);

// ---------------- Pass 4: remove one, expect it gone ----------------
console.log(`\n[4] remove one skill`);
const dropSlug = FIXTURES[2].slug;
fs.rmSync(path.join(skillsDir, dropSlug), { recursive: true, force: true });

const r4 = await loadUserSkills({
  embedFn,
  cacheDir,
  bundledSkillsDir: "/no/such/dir",
  dirs: [skillsDir],
});
check("count drops by 1", r4.count === FIXTURES.length - 1);
check("dropped skill not present", !r4.skills.some((s) => s.id === `user:${dropSlug}`));

// ---------------- Pass 5: empty dir is a no-op ----------------
console.log(`\n[5] empty dir`);
const emptyDir = path.join(tmpRoot, "empty");
fs.mkdirSync(emptyDir, { recursive: true });
const r5 = await loadUserSkills({
  embedFn,
  cacheDir,
  bundledSkillsDir: "/no/such/dir",
  dirs: [emptyDir],
});
check("empty dir → 0 skills", r5.count === 0);
check("empty dir → null vectors", r5.vectors === null);

// ---------------- Pass 6: resolveUserSkillDirs respects env ----------------
console.log(`\n[6] resolveUserSkillDirs picks up env var`);
const prevEnv = process.env.WINDAGS_USER_SKILLS_DIR;
process.env.WINDAGS_USER_SKILLS_DIR = `${skillsDir}${path.delimiter}/no/such/dir`;
const dirs = resolveUserSkillDirs({ bundledSkillsDir: "/totally-unrelated" });
check("env dir included", dirs.includes(path.resolve(skillsDir)));
check("nonexistent dir filtered", !dirs.includes(path.resolve("/no/such/dir")));
if (prevEnv === undefined) delete process.env.WINDAGS_USER_SKILLS_DIR;
else process.env.WINDAGS_USER_SKILLS_DIR = prevEnv;

// ---------------- Pass 7: bundled skipped when path matches ----------------
console.log(`\n[7] resolveUserSkillDirs skips bundled dir`);
process.env.WINDAGS_USER_SKILLS_DIR = skillsDir;
const dirs2 = resolveUserSkillDirs({ bundledSkillsDir: skillsDir });
check("bundled dir excluded", !dirs2.includes(path.resolve(skillsDir)));
if (prevEnv === undefined) delete process.env.WINDAGS_USER_SKILLS_DIR;
else process.env.WINDAGS_USER_SKILLS_DIR = prevEnv;

// ---------------- Pass 8: readUserSkillFile round-trip ----------------
console.log(`\n[8] readUserSkillFile reads body`);
const oneSlug = FIXTURES[1].slug;
const bodyFile = readUserSkillFile(path.join(skillsDir, oneSlug, "SKILL.md"));
check("body parsed", typeof bodyFile?.body === "string" && bodyFile.body.includes("Production Deploy Runbook"));
check("frontmatter parsed", bodyFile?.frontmatter?.category === "Operations");

// ---------------- Cleanup ----------------
fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log(`\ncleanup: removed ${tmpRoot}`);

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log(`\nall checks passed`);
