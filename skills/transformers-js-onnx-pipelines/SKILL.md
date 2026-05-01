---
name: transformers-js-onnx-pipelines
description: 'Use when integrating Hugging Face Transformers.js (Xenova/transformers) for in-browser or in-Node inference, debugging quantized model loading, building bi-encoder / cross-encoder / classification pipelines, configuring model cache directories, or bypassing high-level pipelines to read raw logits. Triggers: "model failed to load", cross-encoder scores all 1.0 (softmax-over-1 trap), env.allowLocalModels confusion, cacheDir overrides, ONNX runtime mismatch, ESM vs CJS pipeline imports, browser vs node feature gaps. NOT for full transformers Python (different SDK), TensorFlow.js, ONNX Runtime Web directly without Transformers.js, or model training.'
category: AI & Machine Learning
tags:
  - transformers-js
  - onnx
  - embeddings
  - cross-encoder
  - inference
  - huggingface
---

# Transformers.js ONNX Pipelines

Transformers.js runs Hugging Face models on ONNX Runtime in-browser or in-Node. The high-level `pipeline()` is convenient until it isn't — most non-trivial models need direct tokenizer + model use because the pipeline's task wrapping makes assumptions that don't hold (e.g., the cross-encoder softmax-over-1 trap).

## When to use

- Local embeddings without an API (cosine search, RAG, dedup).
- Cross-encoder reranking for retrieval cascades.
- Browser-side inference (PII redaction, classification) without a server roundtrip.
- Replacing OpenAI embedding calls with a quantized local model to control cost.
- Integrating with a Cloudflare Worker via Workers AI (different surface, but ONNX know-how transfers).

## Core capabilities

### Bi-encoder (sentence embeddings)

```ts
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.cacheDir = process.env.MODEL_CACHE
  ?? path.join(os.homedir(), '.cache', 'transformers-js');

const embed = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });

const out = await embed('the quick brown fox', { pooling: 'mean', normalize: true });
const vec: Float32Array = out.data;       // length 384, L2-normalized
```

`pooling: 'mean'` averages token embeddings; `'cls'` uses [CLS]. `normalize: true` makes cosine == dot product:

```ts
function cosine(a: Float32Array, b: Float32Array) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}
```

### Cross-encoder reranking — bypass the pipeline

The MS MARCO MiniLM rerankers publish a single regression head (num_labels=1). Transformers.js's `text-classification` pipeline applies softmax to the logits. Softmax over a single value collapses to 1.0 — every score becomes 1.0.

Skip the pipeline. Tokenize and forward manually:

```ts
import { AutoTokenizer, AutoModelForSequenceClassification } from '@xenova/transformers';

const modelId = 'Xenova/ms-marco-MiniLM-L-6-v2';
const [tokenizer, model] = await Promise.all([
  AutoTokenizer.from_pretrained(modelId),
  AutoModelForSequenceClassification.from_pretrained(modelId, { quantized: true }),
]);

async function rerank(query: string, candidates: string[]) {
  const queries = new Array(candidates.length).fill(query);
  const inputs = tokenizer(queries, {
    text_pair: candidates,
    padding: true, truncation: true, max_length: 512,
  });
  const outputs = await model(inputs);
  const logits = outputs.logits;
  const dims = logits.dims;          // [batch, num_labels]
  const numLabels = dims[1] ?? 1;
  const data = logits.data;

  return candidates.map((text, i) => {
    const score = numLabels === 1
      ? data[i]
      : data[i * numLabels + 1];     // 2-class: positive logit
    return { text, score };
  }).sort((a, b) => b.score - a.score);
}
```

The raw logit isn't bounded — calibration is the user's problem. For relative ranking it's fine.

### Lazy loading + cache strategy

Models are 25-100MB quantized; download is the slow part. Cache aggressively:

```ts
let _embedderPromise: Promise<any> | null = null;
function getEmbedder() {
  if (!_embedderPromise) {
    _embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
  }
  return _embedderPromise;
}
```

Idempotent across concurrent calls — first call awaits the download, subsequent calls hit the in-memory model.

### Cache directory matters in CI

```ts
env.cacheDir = process.env.MODEL_CACHE
  ?? path.join(os.homedir(), '.cache', 'transformers-js');
```

In GitHub Actions, point this at a workspace-local path so `actions/cache` can persist it:

```yaml
env:
  MODEL_CACHE: ${{ github.workspace }}/.cache/transformers-js
- uses: actions/cache@v4
  with:
    path: ${{ env.MODEL_CACHE }}
    key: ${{ runner.os }}-tfjs-allmini-v1
```

Without this, every CI run re-downloads.

### Building a corpus offline

For a static catalog (skill descriptions, doc chunks), embed once at build time and ship the vectors:

```ts
const embed = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
const items = loadCorpus();
const dim = 384;
const buf = new Float32Array(items.length * dim);

for (let i = 0; i < items.length; i++) {
  const out = await embed(items[i].text, { pooling: 'mean', normalize: true });
  buf.set(out.data, i * dim);
}

fs.writeFileSync('data/embeddings.bin', Buffer.from(buf.buffer));
fs.writeFileSync('data/embeddings.meta.json', JSON.stringify({
  model: 'Xenova/all-MiniLM-L6-v2',
  dim, count: items.length,
  ids: items.map((x) => x.id),
}, null, 2));
```

Load at runtime with no parsing cost:

```ts
const meta = JSON.parse(fs.readFileSync('data/embeddings.meta.json', 'utf-8'));
const buf = fs.readFileSync('data/embeddings.bin');
const vectors = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
```

Storing 384-dim Float32Array is 1.5KB per item — fine for tens of thousands.

### Browser-side inference

```ts
import { pipeline, env } from '@xenova/transformers';
env.allowRemoteModels = true;
env.remoteHost = 'https://your-cdn.example.com';   // optional

const classifier = await pipeline(
  'text-classification',
  'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  { device: 'webgpu' },                            // if available
);
```

Be honest about the download cost — show a progress bar.

## Anti-patterns

### Cross-encoder via `text-classification` pipeline

**Symptom:** Every candidate scores 1.0; ranking is degenerate.
**Diagnosis:** Pipeline softmaxes a single-logit head; softmax-over-1 = 1.
**Fix:** Use `AutoTokenizer` + `AutoModelForSequenceClassification` directly. Read `outputs.logits.data` as raw scores.

### `env.allowLocalModels = true` in CI

**Symptom:** Model downloads succeed locally, fail in CI: "model not found".
**Diagnosis:** With `allowLocalModels = true` the SDK looks for files on disk first; in CI, no disk model = fail.
**Fix:** `env.allowLocalModels = false` (default). Combine with a CI cache for the download.

### Importing the pipeline at module load

**Symptom:** Server startup blocks for 5s on first deploy.
**Diagnosis:** Top-level `await pipeline(...)` runs at import time.
**Fix:** Lazy-load inside a function. Cache the Promise so concurrent first calls share one load.

### Forgetting `normalize: true` for cosine

**Symptom:** Scores look right but order is subtly off.
**Diagnosis:** Vectors aren't unit-normalized; raw dot products bias toward longer strings.
**Fix:** Always `{ pooling: 'mean', normalize: true }`. Pre-normalize stored vectors.

### Float32Array reuse across calls

**Symptom:** Stored vectors mysteriously change; cache looks corrupted.
**Diagnosis:** Some pipeline implementations return a view into a reused tensor buffer; the next call overwrites.
**Fix:** Copy on capture: `new Float32Array(out.data)`.

### Reranker on too-long documents

**Symptom:** `RangeError: Tokenized inputs exceeded 512 tokens`.
**Diagnosis:** Cross-encoders truncate at 512 tokens jointly across (query, candidate). Long candidates lose context.
**Fix:** Truncate candidate text to ~400 tokens. Description + name only; skip body.

## Quality gates

- [ ] First-load Promise cached so concurrent calls don't double-download.
- [ ] `env.cacheDir` set to a CI-cacheable path.
- [ ] Cosine similarity uses normalized vectors.
- [ ] Cross-encoder scores read from `outputs.logits.data` directly, not via pipeline.
- [ ] Embeddings persisted as `Float32Array` for compactness.
- [ ] Model versions pinned in code; never "latest".
- [ ] Quantized variants (`quantized: true`) unless full precision is critical.
- [ ] Smoke test runs the model on 3 known queries on every CI build.

## NOT for

- **Python `transformers`** — different SDK; don't transfer assumptions.
- **TensorFlow.js** — different runtime, different model formats.
- **ONNX Runtime Web directly** without Transformers.js — lower-level; use only if you need custom ops.
- **Workers AI / Vertex AI** — managed inference; use the platform SDK.
- **Model training** — Transformers.js is inference-only.
