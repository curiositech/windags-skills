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


// ---------------------------------------------------------------------------
// Stage 5 — Attribution k-NN over local /next-move triple history
// ---------------------------------------------------------------------------

/** Encode a Float32Array as base64 for compact JSON storage. */
function floatArrayToBase64(arr) {
  const f32 = arr instanceof Float32Array ? arr : new Float32Array(arr);
  const bytes = Buffer.from(f32.buffer, f32.byteOffset, f32.byteLength);
  return bytes.toString("base64");
}

function base64ToFloatArray(b64) {
  const buf = Buffer.from(b64, "base64");
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return new Float32Array(ab);
}

function _attribCosine(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}

function writeTripleAtomic(filePath, json) {
  try {
    const tmp = `${filePath}.tmp-${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
    fs.writeFileSync(tmp, JSON.stringify(json, null, 2));
    try {
      fs.renameSync(tmp, filePath);
    } catch {
      try { fs.unlinkSync(tmp); } catch { /* ignore */ }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    }
    return true;
  } catch {
    return false;
  }
}

function extractSkillIds(triple) {
  const ids = [];
  const waves = triple?.predicted_dag?.waves;
  if (!Array.isArray(waves)) return ids;
  for (const wave of waves) {
    const nodes = wave?.nodes;
    if (!Array.isArray(nodes)) continue;
    for (const node of nodes) {
      const id = node?.skill_id ?? node?.skillId;
      if (typeof id === "string" && id.length > 0) ids.push(id);
    }
  }
  return ids;
}

/**
 * Stage 5 — Attribution k-NN.
 *
 * For each triple in `historyDir`:
 *   - Embed its `prompt` (cached in-file under `_query_embedding`).
 *   - Compute cosine similarity to the current `queryVec`.
 *   - Take the top-k most similar triples.
 *
 * Weight feedback:
 *   - feedback.accepted === true  → +1.0
 *   - feedback.accepted === false → -0.5
 *   - feedback missing/null       → +0.5  (mild prior)
 *
 * Apply log-scaled boost: boost = log(1 + count) / 10.
 *
 * Fail-safe: empty/missing historyDir → return candidates unchanged.
 */
export async function attributionBoost(queryVec, candidates, historyDir, opts = {}) {
  const { k = 5, cacheDir = undefined, minSimilarity = 0.3 } = opts;

  if (!candidates?.length) return candidates ?? [];
  if (!queryVec || queryVec.length === 0) return candidates;
  if (!historyDir || !fs.existsSync(historyDir)) return candidates;

  let entries;
  try {
    entries = fs.readdirSync(historyDir).filter((f) => f.endsWith(".json"));
  } catch {
    return candidates;
  }
  if (entries.length === 0) return candidates;

  const triples = [];
  for (const file of entries) {
    const filePath = path.join(historyDir, file);
    let triple;
    try {
      triple = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      continue;
    }
    const prompt = triple?.prompt;
    if (typeof prompt !== "string" || prompt.length === 0) continue;

    let vec = null;
    if (typeof triple._query_embedding === "string") {
      try { vec = base64ToFloatArray(triple._query_embedding); } catch { vec = null; }
    }
    if (!vec) {
      try {
        vec = await embedQuery(prompt, cacheDir);
        triple._query_embedding = floatArrayToBase64(vec);
        writeTripleAtomic(filePath, triple);
      } catch {
        continue;
      }
    }
    if (!vec || vec.length !== queryVec.length) continue;

    triples.push({
      file,
      tripleId: triple.id ?? file.replace(/\.json$/, ""),
      vec,
      skills: extractSkillIds(triple),
      feedback: triple.feedback ?? null,
    });
  }
  if (triples.length === 0) return candidates;

  const scored = triples.map((t) => ({ ...t, similarity: _attribCosine(queryVec, t.vec) }));
  scored.sort((a, b) => b.similarity - a.similarity);
  const neighbors = scored
    .slice(0, Math.min(k, scored.length))
    .filter((n) => n.similarity >= minSimilarity);
  if (neighbors.length === 0) return candidates;

  const skillCounts = new Map();
  for (const n of neighbors) {
    let w;
    if (n.feedback?.accepted === true) w = 1.0;
    else if (n.feedback?.accepted === false) w = -0.5;
    else w = 0.5;
    for (const skillId of n.skills) {
      let entry = skillCounts.get(skillId);
      if (!entry) {
        entry = { count: 0, neighbors: [] };
        skillCounts.set(skillId, entry);
      }
      entry.count += w;
      entry.neighbors.push({
        tripleId: n.tripleId,
        similarity: +n.similarity.toFixed(4),
        weight: w,
      });
    }
  }

  const boosted = candidates.map((c) => {
    const entry = skillCounts.get(c.id);
    if (!entry || entry.count <= 0) return { ...c };
    const boost = Math.log(1 + entry.count) / 10;
    return {
      ...c,
      fusedScore: +(c.fusedScore + boost).toFixed(5),
      attribution: {
        count: +entry.count.toFixed(2),
        boost: +boost.toFixed(5),
        neighbors: entry.neighbors,
      },
    };
  });
  boosted.sort((a, b) => b.fusedScore - a.fusedScore);
  return boosted;
}
