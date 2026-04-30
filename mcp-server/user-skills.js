/**
 * User-defined skills for the WinDAGs MCP cascade.
 *
 * Scans conventional directories on the user's machine, parses any SKILL.md
 * files found there, embeds them with the same MiniLM bi-encoder used for the
 * bundled corpus, and caches the embeddings to ~/.windags/user-skills/cache.json
 * keyed by file content hash so subsequent loads only re-embed changed files.
 *
 * The loader is corpus-agnostic — it returns the same shape that loadCorpus()
 * does (meta + Float32Array vectors), so the cascade can union it with the
 * bundled corpus and run a single semantic search across both.
 *
 * Skill IDs are prefixed with "user:" to avoid collisions with bundled skills.
 *
 * Lookup order (later dirs override earlier on slug collision, with a warning):
 *   1. $WINDAGS_USER_SKILLS_DIR  (colon-separated list of directories)
 *   2. ~/.claude/skills/
 *   3. ./skills/                 (skipped if it IS the bundled skillsDir)
 *   4. ./.windags/skills/
 *
 * Failure modes that must NOT crash the cascade:
 *   - Cache file corrupt → wipe + rebuild
 *   - Single SKILL.md unparseable → log to stderr, skip that one
 *   - Embedder model unavailable → skip user skills entirely (cascade still works)
 *   - Cache dir not writable → load to memory anyway, just don't persist
 */

import { createRequire } from "node:module";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as crypto from "node:crypto";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const CACHE_VERSION = 1;
const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const EMBEDDING_DIM = 384;

/**
 * Resolve the directories we should scan for user-defined skills. Order
 * matters — later entries override earlier on slug collision.
 *
 * @param {object} opts
 * @param {string} [opts.bundledSkillsDir] absolute path to the bundled
 *   catalog so we can skip ./skills if it IS the bundled one (prevents the
 *   server from double-loading its own corpus when run from inside the repo).
 * @returns {string[]} absolute, deduped, existing directories.
 */
export function resolveUserSkillDirs({ bundledSkillsDir } = {}) {
  const out = [];
  const envOverride = process.env.WINDAGS_USER_SKILLS_DIR;
  if (envOverride) {
    for (const raw of envOverride.split(path.delimiter)) {
      const trimmed = raw.trim();
      if (trimmed) out.push(path.resolve(trimmed));
    }
  }
  const home = os.homedir();
  if (home) out.push(path.join(home, ".claude", "skills"));
  out.push(path.resolve(process.cwd(), "skills"));
  out.push(path.resolve(process.cwd(), ".windags", "skills"));

  const seen = new Set();
  const filtered = [];
  for (const dir of out) {
    const resolved = path.resolve(dir);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    if (bundledSkillsDir && path.resolve(bundledSkillsDir) === resolved) continue;
    if (!fs.existsSync(resolved)) continue;
    let stat;
    try { stat = fs.statSync(resolved); } catch { continue; }
    if (!stat.isDirectory()) continue;
    filtered.push(resolved);
  }
  return filtered;
}

/**
 * Read SKILL.md from a directory, returning frontmatter + body, or null if the
 * file is missing/unparseable. We're permissive on bad YAML: log a single
 * warning and skip the skill so one broken file can't poison the whole load.
 */
function readSkillMd(dir) {
  const md = path.join(dir, "SKILL.md");
  if (!fs.existsSync(md)) return null;
  let raw;
  try { raw = fs.readFileSync(md, "utf-8"); } catch { return null; }
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  let fm;
  try { fm = yaml.load(m[1]) ?? {}; } catch (err) {
    console.error(`[windags-mcp] user skill ${md}: bad YAML — ${err.message}`);
    return null;
  }
  let stat;
  try { stat = fs.statSync(md); } catch { return null; }
  return { sourcePath: md, frontmatter: fm, body: m[2] ?? "", raw, stat };
}

/**
 * Walk a directory looking for skill folders. A "skill folder" is any
 * direct subdirectory containing a SKILL.md.
 */
function findSkillFolders(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;
    const md = path.join(dir, entry.name, "SKILL.md");
    if (fs.existsSync(md)) out.push({ slug: entry.name, dir: path.join(dir, entry.name) });
  }
  return out;
}

function hashContent(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function defaultCacheDir() {
  return path.join(os.homedir(), ".windags", "user-skills");
}

function readCache(cacheFile) {
  if (!fs.existsSync(cacheFile)) return null;
  let txt;
  try { txt = fs.readFileSync(cacheFile, "utf-8"); } catch { return null; }
  let parsed;
  try { parsed = JSON.parse(txt); } catch {
    console.error(`[windags-mcp] user-skills cache corrupt — rebuilding`);
    return null;
  }
  if (parsed?.version !== CACHE_VERSION) return null;
  if (parsed?.model !== MODEL_ID) return null;
  if (parsed?.dim !== EMBEDDING_DIM) return null;
  if (!parsed?.entries || typeof parsed.entries !== "object") return null;
  return parsed;
}

function writeCache(cacheFile, cache) {
  try {
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    const tmp = `${cacheFile}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
    try { fs.renameSync(tmp, cacheFile); }
    catch {
      try { fs.unlinkSync(tmp); } catch { /* ignore */ }
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    }
  } catch (err) {
    console.error(`[windags-mcp] could not persist user-skills cache: ${err.message}`);
  }
}

function base64ToFloat32(b64) {
  const buf = Buffer.from(b64, "base64");
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return new Float32Array(ab);
}

function float32ToBase64(arr) {
  const f32 = arr instanceof Float32Array ? arr : new Float32Array(arr);
  return Buffer.from(f32.buffer, f32.byteOffset, f32.byteLength).toString("base64");
}

/**
 * Load + embed user-defined skills.
 *
 * @param {object} opts
 * @param {(text: string) => Promise<Float32Array>} opts.embedFn — query embedder
 *   (we reuse the cascade's embedQuery so the model is loaded exactly once per
 *   process). We pass through any errors so the caller can decide whether to
 *   degrade to lexical-only for user skills.
 * @param {string} [opts.cacheDir] — override cache directory (default ~/.windags/user-skills/)
 * @param {string} [opts.bundledSkillsDir] — skip ./skills when it equals this
 * @param {string[]} [opts.dirs] — explicit list of dirs to scan (overrides env+default)
 * @returns {Promise<{ skills, vectors, dim, ids, sourcePaths, count, dirsScanned, cacheFile }>}
 *   `skills` matches the bundled-skill metadata shape (id/name/description/category/tags),
 *   `vectors` is a Float32Array of length count*dim (or null if no skills),
 *   `ids` is parallel to vectors. `sourcePaths` is a Map<id, absPath>.
 */
export async function loadUserSkills(opts) {
  if (!opts?.embedFn) throw new Error("loadUserSkills: embedFn is required");
  const dirs = opts.dirs ?? resolveUserSkillDirs({ bundledSkillsDir: opts.bundledSkillsDir });
  const cacheDir = opts.cacheDir ?? defaultCacheDir();
  const cacheFile = path.join(cacheDir, "cache.json");
  const existing = readCache(cacheFile) ?? {
    version: CACHE_VERSION,
    model: MODEL_ID,
    dim: EMBEDDING_DIM,
    entries: {},
  };

  // Walk dirs in order — later wins on slug collision. Track which slug came
  // from which dir so we can emit a useful warning.
  const candidates = new Map(); // slug -> { dir, slug, source }
  for (const dir of dirs) {
    for (const folder of findSkillFolders(dir)) {
      if (candidates.has(folder.slug)) {
        console.error(
          `[windags-mcp] user skill "${folder.slug}" overrides ` +
          `${candidates.get(folder.slug).dir} → ${folder.dir}`,
        );
      }
      candidates.set(folder.slug, folder);
    }
  }

  if (candidates.size === 0) {
    return {
      skills: [], vectors: null, dim: EMBEDDING_DIM, ids: [],
      sourcePaths: new Map(), count: 0, dirsScanned: dirs, cacheFile,
    };
  }

  const skills = [];
  const ids = [];
  const sourcePaths = new Map();
  const vecMap = new Map(); // id -> Float32Array
  const nextEntries = {};
  let embeddedThisRun = 0;
  let cacheHits = 0;

  for (const { slug, dir } of candidates.values()) {
    const file = readSkillMd(dir);
    if (!file) continue;
    const fm = file.frontmatter;
    const id = `user:${slug}`;
    const meta = {
      id,
      name: fm.name || slug,
      description: fm.description || "",
      category: fm.category || "User",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
    };

    const corpusText = `${meta.name}. ${meta.description}. ${meta.tags.join(" ")}. ${meta.category}`.trim();
    const contentHash = hashContent(corpusText);

    const cached = existing.entries[id];
    let vec;
    if (
      cached &&
      cached.contentHash === contentHash &&
      cached.source === file.sourcePath &&
      typeof cached.embedding === "string"
    ) {
      try {
        const candidate = base64ToFloat32(cached.embedding);
        if (candidate.length === EMBEDDING_DIM) {
          vec = candidate;
          cacheHits += 1;
        }
      } catch { /* fall through to re-embed */ }
    }

    if (!vec) {
      try {
        const fresh = await opts.embedFn(corpusText);
        if (!fresh || fresh.length !== EMBEDDING_DIM) {
          throw new Error(`embedFn returned wrong dim ${fresh?.length}`);
        }
        // Detach from any underlying ArrayBuffer the embedder is reusing.
        vec = new Float32Array(fresh);
        embeddedThisRun += 1;
      } catch (err) {
        console.error(`[windags-mcp] could not embed user skill ${id}: ${err.message}`);
        continue;
      }
    }

    skills.push(meta);
    ids.push(id);
    vecMap.set(id, vec);
    sourcePaths.set(id, file.sourcePath);
    nextEntries[id] = {
      source: file.sourcePath,
      size: file.stat.size,
      mtimeMs: file.stat.mtimeMs,
      contentHash,
      name: meta.name,
      description: meta.description,
      category: meta.category,
      tags: meta.tags,
      embedding: float32ToBase64(vec),
    };
  }

  if (embeddedThisRun > 0 || Object.keys(existing.entries).length !== Object.keys(nextEntries).length) {
    writeCache(cacheFile, {
      version: CACHE_VERSION,
      model: MODEL_ID,
      dim: EMBEDDING_DIM,
      entries: nextEntries,
      writtenAt: new Date().toISOString(),
    });
  }

  let vectors = null;
  if (ids.length > 0) {
    vectors = new Float32Array(ids.length * EMBEDDING_DIM);
    for (let i = 0; i < ids.length; i++) {
      vectors.set(vecMap.get(ids[i]), i * EMBEDDING_DIM);
    }
  }

  if (skills.length > 0) {
    console.error(
      `[windags-mcp] loaded ${skills.length} user skills ` +
      `(${cacheHits} cached, ${embeddedThisRun} freshly embedded) from ${dirs.length} dir(s)`,
    );
  }

  return {
    skills,
    vectors,
    dim: EMBEDDING_DIM,
    ids,
    sourcePaths,
    count: skills.length,
    dirsScanned: dirs,
    cacheFile,
  };
}

/**
 * Read a single user skill file. Used by the graft tool to fetch the body
 * of a user skill chosen as a primary, since user skills aren't in the
 * bundled skillsDir.
 */
export function readUserSkillFile(sourcePath) {
  if (!sourcePath) return null;
  if (!fs.existsSync(sourcePath)) return null;
  let raw;
  try { raw = fs.readFileSync(sourcePath, "utf-8"); } catch { return null; }
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  let fm;
  try { fm = yaml.load(m[1]) ?? {}; } catch { return null; }
  return { frontmatter: fm, body: m[2] ?? "", raw };
}

/**
 * Enumerate references/scripts/templates/examples for a user skill, the
 * same shape listSkillAssets returns for bundled skills. User skills don't
 * have to follow the convention; we just list whatever's there.
 */
export function listUserSkillAssets(sourcePath) {
  const empty = { references: [], scripts: [], templates: [], examples: [] };
  if (!sourcePath) return empty;
  const skillDir = path.dirname(sourcePath);
  if (!fs.existsSync(skillDir)) return empty;
  const out = { references: [], scripts: [], templates: [], examples: [] };
  for (const sub of Object.keys(out)) {
    const subDir = path.join(skillDir, sub);
    if (!fs.existsSync(subDir)) continue;
    let entries;
    try { entries = fs.readdirSync(subDir); } catch { continue; }
    for (const f of entries) {
      if (f.startsWith(".") || f === "INDEX.md") continue;
      try {
        const stat = fs.statSync(path.join(subDir, f));
        if (stat.isFile()) out[sub].push({ path: `${sub}/${f}`, bytes: stat.size });
      } catch { /* skip */ }
    }
  }
  return out;
}
