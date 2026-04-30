#!/usr/bin/env node
/**
 * Build a packed embeddings corpus for the WinDAGs MCP server.
 *
 * Reads every ../skills/<id>/SKILL.md, embeds (name + description + tags +
 * category) with Xenova/all-MiniLM-L6-v2, and writes:
 *   - data/embeddings.bin       — Float32Array packed (n_skills * dim)
 *   - data/embeddings.meta.json — { model, dim, ids: [...] } parallel to .bin
 *
 * Run once at release time:
 *   node mcp-server/scripts/build-embeddings.mjs
 *
 * Runtime cost: ~30s on M-series, ~120s on x86. ~840KB output.
 */

import { pipeline, env } from "@xenova/transformers";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

env.allowLocalModels = false;
env.cacheDir = path.resolve(process.env.HOME ?? ".", ".cache", "transformers-js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const OUT_DIR = path.resolve(__dirname, "..", "data");
const MODEL = "Xenova/all-MiniLM-L6-v2";
const DIM = 384;

function loadSkills() {
  const out = [];
  for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const md = path.join(SKILLS_DIR, entry.name, "SKILL.md");
    if (!fs.existsSync(md)) continue;
    const text = fs.readFileSync(md, "utf-8");
    const m = text.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    let fm;
    try { fm = yaml.load(m[1]); } catch { continue; }
    if (!fm) continue;
    out.push({
      id: entry.name,
      name: fm.name || entry.name,
      description: fm.description || "",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      category: fm.category || "",
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

async function main() {
  console.error(`Loading model ${MODEL}…`);
  const embed = await pipeline("feature-extraction", MODEL, { quantized: true });

  const skills = loadSkills().sort((a, b) => a.id.localeCompare(b.id));
  console.error(`Embedding ${skills.length} skills…`);

  const buf = new Float32Array(skills.length * DIM);
  const ids = new Array(skills.length);

  let done = 0;
  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    const out = await embed(corpusText(s), { pooling: "mean", normalize: true });
    const v = out.data;
    if (v.length !== DIM) throw new Error(`Unexpected dim ${v.length} for ${s.id}`);
    buf.set(v, i * DIM);
    ids[i] = s.id;
    done++;
    if (done % 50 === 0 || done === skills.length) {
      process.stderr.write(`  ${done}/${skills.length}\r`);
    }
  }
  process.stderr.write("\n");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const binPath = path.join(OUT_DIR, "embeddings.bin");
  const metaPath = path.join(OUT_DIR, "embeddings.meta.json");
  fs.writeFileSync(binPath, Buffer.from(buf.buffer));
  fs.writeFileSync(metaPath, JSON.stringify({
    model: MODEL,
    dim: DIM,
    count: skills.length,
    ids,
    builtAt: new Date().toISOString(),
  }, null, 2));

  const sizeKB = (fs.statSync(binPath).size / 1024).toFixed(1);
  console.error(`Wrote ${binPath} (${sizeKB} KB)`);
  console.error(`Wrote ${metaPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
