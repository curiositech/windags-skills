/**
 * Local cascade for WinDAGs skill retrieval.
 *
 *   Stage 1 — Lexical: wink-bm25 over name + description + tags + category
 *   Stage 2 — Semantic: cosine similarity vs bundled all-MiniLM-L6-v2 vectors
 *   Stage 3 — Fusion:   reciprocal-rank fusion of the two ranked lists
 *
 * Stage 4 (cross-encoder rerank) and Stage 5 (attribution k-NN) are roadmap;
 * see /tools page Preview section. Don't claim them here.
 *
 * All local. The MiniLM model (~25MB quantized ONNX) is downloaded once on
 * first call to embedQuery() and cached by Transformers.js. The skill corpus
 * is pre-embedded and bundled in data/embeddings.bin (~800KB).
 */

import * as fs from "node:fs";
import * as path from "node:path";

let _embedderPromise = null;

async function getEmbedder(cacheDir) {
  if (!_embedderPromise) {
    _embedderPromise = (async () => {
      const { pipeline, env } = await import("@xenova/transformers");
      env.allowLocalModels = false;
      if (cacheDir) env.cacheDir = cacheDir;
      return pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { quantized: true });
    })();
  }
  return _embedderPromise;
}

export async function embedQuery(text, cacheDir) {
  const embed = await getEmbedder(cacheDir);
  const out = await embed(text, { pooling: "mean", normalize: true });
  return out.data; // Float32Array, length = dim
}

export function loadCorpus(dataDir) {
  const metaPath = path.join(dataDir, "embeddings.meta.json");
  const binPath = path.join(dataDir, "embeddings.bin");
  if (!fs.existsSync(metaPath) || !fs.existsSync(binPath)) {
    return null;
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const buf = fs.readFileSync(binPath);
  const vectors = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  if (vectors.length !== meta.count * meta.dim) {
    throw new Error(`embeddings.bin size mismatch: ${vectors.length} vs ${meta.count}*${meta.dim}`);
  }
  return { meta, vectors };
}

/**
 * Cosine similarity vs every row in the corpus, returning the top-K.
 * The corpus vectors are already L2-normalized by the build script and the
 * query is normalized by the embedder, so cosine = dot product.
 */
export function topKSemantic(queryVec, corpus, k) {
  const { meta, vectors } = corpus;
  const dim = meta.dim;
  const n = meta.count;
  const scores = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let dot = 0;
    const off = i * dim;
    for (let d = 0; d < dim; d++) {
      dot += queryVec[d] * vectors[off + d];
    }
    scores[i] = dot;
  }
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => scores[b] - scores[a]);
  return idx.slice(0, k).map((i) => ({ id: meta.ids[i], score: scores[i] }));
}

/**
 * Reciprocal Rank Fusion. K=60 is the canonical default from Cormack et al.
 * Each ranked list contributes 1/(K+rank) to a skill's fused score.
 *
 * Returns { id, fusedScore, breakdown } sorted descending.
 */
export function rrfFuse(rankedLists, { K = 60, limit = 10 } = {}) {
  const totals = new Map(); // id -> { score, breakdown: { name -> rank } }
  for (const { name, items } of rankedLists) {
    items.forEach((item, rank) => {
      const id = item.id;
      const contribution = 1 / (K + rank + 1);
      let entry = totals.get(id);
      if (!entry) {
        entry = { score: 0, breakdown: {} };
        totals.set(id, entry);
      }
      entry.score += contribution;
      entry.breakdown[name] = { rank: rank + 1, contribution: +contribution.toFixed(5) };
    });
  }
  const all = Array.from(totals, ([id, e]) => ({
    id,
    fusedScore: +e.score.toFixed(5),
    breakdown: e.breakdown,
  }));
  all.sort((a, b) => b.fusedScore - a.fusedScore);
  return all.slice(0, limit);
}
