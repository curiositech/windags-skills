/**
 * Local cascade for WinDAGs skill retrieval.
 *
 *   Stage 1 — Lexical:        wink-bm25 over name + description + tags + category
 *   Stage 2 — Semantic:       cosine similarity vs bundled all-MiniLM-L6-v2 vectors
 *   Stage 3 — Fusion:         reciprocal-rank fusion of the two ranked lists
 *   Stage 4 — Cross-encoder:  ms-marco-MiniLM-L-6-v2 reranks the RRF top-N
 *
 * Stage 5 (attribution k-NN) is roadmap; see /tools page Preview section.
 *
 * All local. The bi-encoder MiniLM (~25MB quantized) is downloaded once on
 * first call to embedQuery(). The cross-encoder MiniLM (~25MB quantized) is
 * downloaded once on first call to crossEncoderRerank(). Both cache forever
 * in ~/.cache/transformers-js/. Skill corpus is pre-embedded in
 * data/embeddings.bin (~800KB).
 */

import * as fs from "node:fs";
import * as path from "node:path";

let _embedderPromise = null;
let _rerankerPromise = null;

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

/**
 * Lazy-load the cross-encoder. We deliberately bypass the high-level
 * `text-classification` pipeline here: ms-marco rerankers are regression
 * heads (single logit per pair), and the pipeline's softmax-over-1 collapses
 * every score to 1.0. We tokenize sentence pairs ourselves and read the
 * raw logit out of the SequenceClassifierOutput.
 */
async function getReranker(cacheDir) {
  if (!_rerankerPromise) {
    _rerankerPromise = (async () => {
      const { AutoTokenizer, AutoModelForSequenceClassification, env } =
        await import("@xenova/transformers");
      env.allowLocalModels = false;
      if (cacheDir) env.cacheDir = cacheDir;
      const modelId = "Xenova/ms-marco-MiniLM-L-6-v2";
      const [tokenizer, model] = await Promise.all([
        AutoTokenizer.from_pretrained(modelId),
        AutoModelForSequenceClassification.from_pretrained(modelId, { quantized: true }),
      ]);
      return { tokenizer, model };
    })();
  }
  return _rerankerPromise;
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

/**
 * Stage 4 — Cross-encoder rerank.
 *
 * Takes the RRF top-N candidates (output shape from rrfFuse) plus a parallel
 * array of candidate texts, scores each (query, candidate) pair with
 * Xenova/ms-marco-MiniLM-L-6-v2, and reorders by relevance. Each row gets
 * a new `crossScore` field. Top-K returned.
 *
 * Cross-encoders read the pair jointly (unlike bi-encoders which embed each
 * side independently), so they catch query-document interactions that cosine
 * misses — at the cost of running the model once per candidate. We cap the
 * input window with truncation; on M-class hardware this is ~50ms per pair.
 *
 * If the model fails to load (offline, disk full, model not published) the
 * caller should fall back to RRF order. We surface that by throwing — the
 * caller in index.js catches and degrades gracefully.
 */
export async function crossEncoderRerank(query, candidates, candidateTexts, topK, cacheDir) {
  if (!candidates?.length) return [];
  if (candidates.length !== candidateTexts.length) {
    throw new Error(`crossEncoderRerank: ${candidates.length} candidates but ${candidateTexts.length} texts`);
  }
  const { tokenizer, model } = await getReranker(cacheDir);

  const queries = new Array(candidateTexts.length).fill(query);
  const inputs = tokenizer(queries, {
    text_pair: candidateTexts,
    padding: true,
    truncation: true,
    max_length: 512,
  });
  const outputs = await model(inputs);
  // logits shape: [batch, num_labels]. ms-marco rerankers have num_labels=1
  // (single regression score). Some checkpoints publish num_labels=2; if so
  // we use the positive-class logit (index 1). Fall back to index 0 otherwise.
  const logits = outputs.logits;
  const batch = logits.dims[0];
  const numLabels = logits.dims[1] ?? 1;
  const data = logits.data;
  const scores = new Array(batch);
  for (let i = 0; i < batch; i++) {
    if (numLabels === 1) {
      scores[i] = data[i];
    } else {
      // Two-class: positive logit is the relevance score.
      scores[i] = data[i * numLabels + 1];
    }
  }

  const reranked = candidates.map((c, i) => ({
    ...c,
    crossScore: +scores[i].toFixed(5),
  }));
  reranked.sort((a, b) => b.crossScore - a.crossScore);
  return reranked.slice(0, topK);
}
