#!/usr/bin/env node
/**
 * Build a packed embeddings corpus for the WinDAGs MCP server.
 *
 * Embeds authored task sentences, or the skill's name, description, tags,
 * and category when no authored examples are present. Writes:
 *   - data/embeddings.bin       — Float32Array packed (n_skills * dim)
 *   - data/embeddings.meta.json — { model, dim, ids: [...] } parallel to .bin
 *
 * Run at release time, or refresh an existing row in place:
 *   node mcp-server/scripts/build-embeddings.mjs
 *   node mcp-server/scripts/build-embeddings.mjs --skill skill-architect
 *
 * Runtime cost: ~30s on M-series, ~120s on x86. ~840KB output.
 */

import { createHash, randomUUID } from "node:crypto";
import * as fs from "node:fs";
import { homedir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { embedQuery, loadCorpus } from "../cascade.js";
import { parseSkillDocument } from "../skill-document.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const OUT_DIR = path.resolve(__dirname, "..", "data");
const MODEL = "Xenova/all-MiniLM-L6-v2";
const DIM = 384;
const QUERY_FILE = path.join("references", "tool2vec-queries.json");
const DEFAULT_MODEL_CACHE = path.join(homedir(), ".cache", "transformers-js");

function loadAuthoredQueries(skillDir) {
  const file = path.join(skillDir, QUERY_FILE);
  try {
    const queries = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (!Array.isArray(queries) || queries.length === 0) {
      throw new Error("expected a nonempty JSON array of positive task sentences");
    }
    const seen = new Set();
    for (const [index, query] of queries.entries()) {
      if (typeof query !== "string" || !query || query !== query.trim() || /[\r\n]/.test(query)) {
        throw new Error(`sentence ${index + 1} must be a nonempty single-line string without surrounding whitespace`);
      }
      const key = query.replace(/\s+/g, " ").toLowerCase();
      if (seen.has(key)) throw new Error(`duplicate sentence at position ${index + 1}`);
      seen.add(key);
    }
    return queries;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`${file}: ${error.message}`, { cause: error });
  }
}

function loadSkills(selectedId) {
  const out = [];
  for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || (selectedId && entry.name !== selectedId)) continue;
    const skillDir = path.join(SKILLS_DIR, entry.name);
    const md = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(md)) continue;
    const text = fs.readFileSync(md, "utf-8");
    const parsed = parseSkillDocument(text);
    if (!parsed) continue;
    const fm = parsed.frontmatter;
    out.push({
      id: entry.name,
      name: fm.name || entry.name,
      description: fm.description || "",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      category: fm.category || "",
      queries: loadAuthoredQueries(skillDir),
    });
  }
  return out;
}

function corpusText(s) {
  const parts = [s.name, s.description];
  if (s.tags.length) parts.push(s.tags.join(" "));
  if (s.category) parts.push(s.category);
  return parts.filter(Boolean).join(". ");
}

async function embedSkill(skill, cacheDir) {
  const inputs = skill.queries ?? [corpusText(skill)];
  const mean = new Float64Array(DIM);
  for (const input of inputs) {
    const vector = await embedQuery(input, cacheDir);
    if (vector.length !== DIM || !vector.every(Number.isFinite)) {
      throw new Error(`Invalid embedding for ${skill.id}: expected ${DIM} finite coordinates`);
    }
    if (!skill.queries) return vector;
    for (let i = 0; i < DIM; i++) mean[i] += vector[i] / inputs.length;
  }
  const norm = Math.sqrt(mean.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(norm) || norm === 0) throw new Error(`Invalid embedding mean for ${skill.id}`);
  return Float32Array.from(mean, (value) => value / norm);
}

function recordAuthoredInputs(authoredInputs, { id, queries }) {
  if (queries) {
    authoredInputs[id] = {
      count: queries.length,
      sha256: createHash("sha256").update(JSON.stringify(queries)).digest("hex"),
    };
  } else {
    delete authoredInputs[id];
  }
}

function replaceFile(file, contents) {
  const pending = `${file}.${randomUUID()}.pending`;
  try {
    fs.writeFileSync(pending, contents, { flag: "wx" });
    fs.renameSync(pending, file);
  } finally {
    fs.rmSync(pending, { force: true });
  }
}

function writeCorpus(vectors, meta) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const binPath = path.join(OUT_DIR, "embeddings.bin");
  const metaPath = path.join(OUT_DIR, "embeddings.meta.json");
  const bytes = Buffer.from(vectors.buffer, vectors.byteOffset, vectors.byteLength);
  replaceFile(binPath, bytes);
  replaceFile(metaPath, JSON.stringify(meta, null, 2));
  console.error(`Wrote ${binPath} (${(bytes.length / 1024).toFixed(1)} KB)`);
  console.error(`Wrote ${metaPath}`);
}

async function refreshSkill(skill, cacheDir) {
  const vector = await embedSkill(skill, cacheDir);
  const corpus = loadCorpus(OUT_DIR);
  if (!corpus || corpus.meta.model !== MODEL || corpus.meta.dim !== DIM ||
      !Array.isArray(corpus.meta.ids) || corpus.meta.ids.length !== corpus.meta.count ||
      new Set(corpus.meta.ids).size !== corpus.meta.ids.length) {
    throw new Error("The existing packed corpus is missing or incompatible. Run a full build.");
  }
  const { meta, vectors } = corpus;
  const row = meta.ids.indexOf(skill.id);
  const authoredInputs = { ...meta.authoredInputs };
  recordAuthoredInputs(authoredInputs, skill);
  if (row < 0) {
    const appended = new Float32Array(vectors.length + DIM);
    appended.set(vectors);
    appended.set(vector, vectors.length);
    writeCorpus(appended, { ...meta, count: meta.count + 1, ids: [...meta.ids, skill.id], authoredInputs });
    console.error(`Added packed row for ${skill.id}.`);
    return;
  }
  const start = row * DIM;
  if (vector.every((value, index) => value === vectors[start + index]) &&
      JSON.stringify(authoredInputs) === JSON.stringify(meta.authoredInputs ?? {})) {
    console.error(`${skill.id} packed row is already current.`);
    return;
  }
  vectors.set(vector, start);
  writeCorpus(vectors, { ...meta, authoredInputs });
  console.error(`Refreshed ${skill.id} from ${skill.queries ? `${skill.queries.length} authored sentences` : "skill metadata"}.`);
}

async function buildCorpus(skills, cacheDir) {
  const vectors = new Float32Array(skills.length * DIM);
  const ids = [];
  const authoredInputs = {};
  for (const [index, skill] of skills.entries()) {
    vectors.set(await embedSkill(skill, cacheDir), index * DIM);
    ids.push(skill.id);
    recordAuthoredInputs(authoredInputs, skill);
    const done = index + 1;
    if (done % 50 === 0 || done === skills.length) {
      process.stderr.write(`  ${done}/${skills.length}\r`);
    }
  }
  process.stderr.write("\n");

  writeCorpus(vectors, {
    model: MODEL,
    dim: DIM,
    count: skills.length,
    ids,
    builtAt: new Date().toISOString(),
    authoredInputs,
  });
}

async function main() {
  const { values } = parseArgs({ options: {
    skill: { type: "string" },
    "model-cache": { type: "string", default: DEFAULT_MODEL_CACHE },
    help: { type: "boolean" },
  } });
  if (values.help) {
    console.log("Usage: node mcp-server/scripts/build-embeddings.mjs [--skill <id>] [--model-cache <dir>]");
    return;
  }
  if (values.skill === "") throw new Error("--skill requires a nonempty skill ID");
  const skills = loadSkills(values.skill).sort((a, b) => a.id.localeCompare(b.id));
  if (skills.length === 0) throw new Error(values.skill ? `Skill not found: ${values.skill}` : "No skills found");
  const cacheDir = path.resolve(values["model-cache"]);
  console.error(`Loading model ${MODEL} for ${skills.length} skill(s)…`);
  if (values.skill) await refreshSkill(skills[0], cacheDir);
  else await buildCorpus(skills, cacheDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
