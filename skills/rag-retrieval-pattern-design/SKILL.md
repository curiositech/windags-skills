---
name: rag-retrieval-pattern-design
description: 'Use when designing or fixing the retrieval side of a RAG system, choosing chunking strategy (fixed-size / recursive / semantic), implementing hybrid search (BM25 + dense) with RRF fusion, adding a cross-encoder reranker, evaluating with RAGAS, or running an index-freshness pipeline. Triggers: "RAG keeps citing the wrong doc", chunk size 512 tokens with overlap, RRF reciprocal rank fusion, dense+sparse hybrid, cross-encoder rerank top-5, RAGAS faithfulness / context precision, voyage-3-large vs text-embedding-3-large, daily / hourly reindex cadence. NOT for fine-tuning vs RAG decision (separate skill), agentic tool-use designs, vector DB operational tuning, or general LLM prompt engineering.'
category: AI & Machine Learning
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - rag
  - retrieval
  - llm
  - vector-search
  - bm25
  - reranking
  - embeddings
---

# RAG Retrieval Pattern Design

When RAG fails, **retrieval is the bug ~73% of the time** — and ~80% of *those* trace to the ingestion / chunking layer. ([premai.io — *Building Production RAG (2026)*][premai-rag]) The LLM is faithfully reporting what you handed it; the problem is what you handed it. So the order of work is fixed: **chunking → embeddings → hybrid search → rerank → eval → freshness**. Get those right and you're at 90% of the achievable quality. Spend the same week on prompt engineering and you'll move 5%.

The compressed 2026 stack:

```
chunking            recursive 512-token chunks, 10-20% overlap
embeddings          voyage-3-large (or text-embedding-3-large; pick by MTEB on YOUR domain)
retrieval           hybrid: BM25 + dense, fused via RRF (k=60), top-20
rerank              cross-encoder, return top-5
eval                RAGAS — faithfulness ≥ 0.85, context precision ≥ 0.75
freshness           daily reindex; hourly for real-time domains
```

**Jump to your fire:**
- "RAG returns the wrong doc" → [Retrieval failure mode triage](#retrieval-failure-mode-triage)
- Choosing chunk size → [Chunking](#chunking)
- BM25 vs dense vs hybrid → [Hybrid retrieval with RRF](#hybrid-retrieval-with-rrf)
- Adding a reranker → [Cross-encoder reranking](#cross-encoder-reranking)
- "Faithfulness is 0.95 but answers are still wrong" → [Freshness + monitoring](#freshness-and-monitoring)
- Running offline evals → [RAGAS evaluation](#ragas-evaluation)
- Latency budget for real-time → [Latency budget](#latency-budget)

## When to use

- Building RAG for the first time and need a defensible default architecture.
- Existing RAG cites the wrong documents; need to triage where the failure is.
- Choosing an embedding model and not sure what beats `text-embedding-3-large` in 2026.
- Adding a reranker to an existing system.
- Setting up evaluation so changes can be measured.
- Designing an index-freshness pipeline (daily / hourly).

## Core capabilities

### Retrieval failure mode triage

The standard decomposition before debugging anything else:

| Symptom | Likely layer | First-line check |
|---|---|---|
| Wrong document retrieved | Chunking or embeddings | Inspect chunks for the question; are they retrievable in isolation? |
| Right document, wrong chunk | Chunking | Chunks too small / split mid-sentence; or too large / topic-mixed |
| Right chunk, ignored by LLM | Reranker / context order | Rerank top-5; put highest-relevance chunk first |
| Faithfulness high, answer still wrong | Freshness | Index is stale; re-run the ingestion pipeline |
| BM25 finds it, dense doesn't (or vice versa) | Single-retriever bias | Hybrid + RRF |
| Empty result set | Filter / index missing | Check zero-result rate metric (>5% is a problem) |

Citing premai.io's framing: *"When faithfulness score is high but answers are still wrong, the LLM is accurately reporting what's in the context, but the context itself is wrong or outdated."* ([premai-rag])

### Chunking

The strategies, in increasing order of cost and (sometimes) quality:

| Strategy | How | Pros | Cons |
|---|---|---|---|
| Fixed-size | Split every N tokens | Cheap, deterministic | Splits mid-sentence, mid-section |
| Recursive | Split by paragraph → sentence → token, prefer the largest natural boundary that fits | Good baseline; preserves structure | Slightly more code |
| Semantic | Split where embedding similarity drops below threshold | Topic-aware boundaries | 200–300 extra embedding calls per 10k-word doc ([premai-rag]) |
| Document-structure-aware | Use Markdown headings, code blocks, list boundaries | Best for technical docs | Hand-tuned per format |

Recommended baseline per the 2026 guides ([premai-rag]):

> *"Recursive chunking at 512 tokens performed at 69% accuracy, 15 percentage points above semantic chunking… Fixed-size: 512 tokens with 10-20% overlap."*

```python
# LangChain-style recursive splitter
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,         # tokens, approximate via len/4 for English
    chunk_overlap=64,       # ~12% overlap; preserves cross-boundary context
    separators=["\n\n", "\n", ". ", " ", ""],
)
chunks = splitter.split_text(doc)
```

Counter-intuitively, semantic chunking is **not always better** — it costs more and on common benchmarks underperforms recursive. Try recursive first, prove a benefit before paying for semantic.

For a doc with structured sections (Markdown, HTML, source code): split on heading boundaries first, then within each section use recursive. The structure encodes intent; ignoring it splits across topics.

### Embeddings

The 2026 leaderboard shifts; the choice criteria don't:

- **MTEB score on your domain**, not the global leaderboard.
- **Dimensions**: 1024 is a good sweet spot for storage + speed; 3072 buys ~1–3% on big domains.
- **Multilingual**: if your corpus is, the model must be (`bge-multilingual-gemma2`, `multilingual-e5-large`, `voyage-multilingual-2`).
- **Cost**: at scale, 0.5–10× differences add up.

Specific 2026 contenders and what the practitioner field is reporting ([premai-rag]):

| Model | Dim | Strengths | Cost (per 1M tokens, indicative) |
|---|---|---|---|
| `voyage-3-large` | 1024 | MTEB leader for many domains; cited "9.74% over OpenAI" | ~$0.06 |
| `text-embedding-3-large` (OpenAI) | 3072 (or 1024) | Solid baseline; widely supported | ~$0.13 |
| `bge-large-en-v1.5` (BAAI) | 1024 | Open-weight; can self-host | self-hosted |
| `nomic-embed-text-v1.5` | 768 | Open-weight, smaller | self-hosted |

**Run a domain eval** before committing — leaderboards shift, your corpus is not the average corpus.

### Hybrid retrieval with RRF

Dense embeddings are strong on semantic similarity; BM25 is strong on rare keywords (proper nouns, codes, acronyms). Hybrid search runs both and fuses the rankings.

**Reciprocal Rank Fusion (RRF)** is the standard fuser: ([premai-rag])

```
RRF_score(d) = sum over retrievers of [ 1 / (k + rank_i(d)) ]
where k = 60 (the conventional constant)
```

For weighted hybrid (dense vs sparse not equal in your domain):

```python
def rrf_fuse(dense_results, sparse_results, k=60, dense_weight=0.6, sparse_weight=0.4):
    scores = {}
    for rank, doc_id in enumerate(dense_results, start=1):
        scores[doc_id] = scores.get(doc_id, 0) + dense_weight * (1 / (k + rank))
    for rank, doc_id in enumerate(sparse_results, start=1):
        scores[doc_id] = scores.get(doc_id, 0) + sparse_weight * (1 / (k + rank))
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
```

The `0.6 dense / 0.4 sparse` baseline is a common starting point; tune on your eval set. Domains heavy in proper nouns / IDs / code (legal, finance, dev docs) often go the other way (`0.4 / 0.6`).

Top-K to retrieve before rerank: **20** is the documented sweet spot per the 2026 guides ([premai-rag]) — large enough that the relevant doc is in the candidate set, small enough that rerank latency stays under control.

### Cross-encoder reranking

Bi-encoder retrieval (the embedding model) computes query and doc embeddings independently and compares with cosine; fast but ~accuracy ceiling. **Cross-encoder reranking** runs a model that sees query + candidate together with full attention, scoring each. Slower but much more accurate.

The standard pipeline per premai.io's writeup ([premai-rag]):

```
hybrid retrieve (top-20)  →  cross-encoder rerank  →  top-5 to LLM
                            +30–100ms latency    +10–30% precision
```

```python
# Cross-encoder rerank — Cohere Rerank or BGE Reranker, etc.
from sentence_transformers import CrossEncoder
reranker = CrossEncoder('BAAI/bge-reranker-v2-m3')

candidate_docs = hybrid_retrieve(query, top_k=20)
scores = reranker.predict([(query, doc.text) for doc in candidate_docs])
ranked = sorted(zip(candidate_docs, scores), key=lambda x: x[1], reverse=True)
top_5 = [doc for doc, _ in ranked[:5]]
```

Hosted alternatives: Cohere Rerank, Voyage Rerank, Jina Rerank — managed APIs with similar quality, easier to ship.

**Reranking is the highest-ROI single change** in most under-performing RAG systems. ([premai-rag])

### Context order matters

Once you have your top-5, the order matters. LLMs exhibit "lost in the middle" — content at the beginning and end of the context window is recalled better than content in the middle.

```
LLM context order (top → bottom):
  - SYSTEM PROMPT
  - USER QUERY
  - TOP-RANKED CHUNK
  - 2nd, 3rd
  - 5th-ranked chunk     ← weakest position; place least-critical here
  - 4th-ranked
  - QUERY (repeated, optional)
```

Empirically: highest-relevance chunk first AND last (sandwich) often outperforms strict descending order.

### RAGAS evaluation

You can't improve what you can't measure. RAGAS gives you four interpretable metrics: ([premai-rag])

| Metric | What it asks | Threshold (warn / critical) |
|---|---|---|
| **Faithfulness** | Does the answer stick to retrieved context? | ≥ 0.85 / < 0.70 |
| **Answer Relevancy** | Does the answer address the question? | ≥ 0.85 |
| **Context Precision** | Are top contexts actually relevant? | ≥ 0.75 |
| **Context Recall** | Does the retrieved context contain the ground truth? | ≥ 0.85 |

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall

result = evaluate(
    dataset=eval_dataset,   # questions + ground-truth answers + retrieved contexts
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)
```

Build a small but representative eval set (50–200 questions) by hand once. Re-run on every change. Without an eval set, every "this is better" claim is vibes.

### Latency budget

Real-time RAG (chat, search) needs to feel fast. Indicative 2026 budgets ([premai-rag]):

```
Target end-to-end: < 2s
  Query embedding:      20–50 ms
  Hybrid retrieval:     5–30 ms
  Reranking (top-20):   30–100 ms
  LLM generation:       500 ms – 3 s+
```

If you're outside this, the bottleneck is almost always LLM generation. Stream the response. Cache hot queries (`semantic-cache` over the question embedding).

### Freshness and monitoring

Stale indexes are the silent killer. Monitor:

- **Document age** at retrieval time. Alert when median age > N hours for real-time domains.
- **Zero-result rate**: > 5% warn; > 15% critical ([premai-rag]). Often means the index is missing a recent corpus shift.
- **Query → top-1 doc cosine** distribution. A leftward shift means matches are getting weaker.
- **RAGAS** scores on a periodic sampled eval (e.g. nightly run).

Reindex cadence:

| Domain | Cadence |
|---|---|
| Product catalog, regulatory | Daily |
| Customer support, news, real-time | Hourly |
| Internal docs (engineering, HR) | Weekly is often fine |
| Static reference (textbooks, archived) | Re-index on schema change only |

Use change-data-capture (`outbox-pattern-implementation`) on the source systems to feed an incremental re-index pipeline.

### What to log per query

```
- query, query_embedding_id
- retrieval candidates (id, score, retriever, rank)
- rerank scores
- final top-5 with chunks
- LLM input length, output, latency
- RAGAS scores (when ground truth is available, e.g. canary set)
- user feedback (thumbs up/down) if available
```

Structured logging — see `structured-logging-design`. OTel spans for each stage — `opentelemetry-instrumentation`.

## Anti-patterns

### Tuning the prompt before fixing retrieval

**Symptom:** Engineers spend a month on prompt engineering. RAGAS score barely moves.
**Diagnosis:** Faithfulness is high, but the wrong context is being retrieved. The LLM is doing its job; the retriever isn't.
**Fix:** Triage retrieval first. ~80% of failures are at chunking + retrieval. ([premai-rag])

### Cosine-only (dense-only) search

**Symptom:** Queries with proper nouns / IDs / acronyms ("CVE-2024-1234", "section 230") miss exact matches that BM25 finds trivially.
**Diagnosis:** No keyword retrieval; embedding cosine doesn't reliably match rare tokens.
**Fix:** Hybrid retrieval with RRF. Dense + BM25, fused.

### No reranker

**Symptom:** Top-1 is often relevant but top-5 is mostly noise; LLM gets confused by low-quality context.
**Diagnosis:** Bi-encoder retrieval ceiling.
**Fix:** Cross-encoder rerank top-20 → top-5. The single highest-ROI change for most RAG systems. ([premai-rag])

### 8000-token chunks "to give the LLM more context"

**Symptom:** Faithfulness drops; LLM cherry-picks irrelevant lines.
**Diagnosis:** Huge chunks dilute the relevant signal; the LLM has too many candidates inside one chunk.
**Fix:** 512 tokens with 10–20% overlap. Retrieval matches a focused chunk; LLM gets clarity.

### 50-token chunks "for precision"

**Symptom:** Retrieved chunk is missing the surrounding context the LLM needs.
**Diagnosis:** Sub-paragraph chunks lose pronoun resolution and structural context.
**Fix:** ~512 tokens. If sentences need pinning, a separate pass extracts them; chunks stay big enough to be self-contained.

### No eval set

**Symptom:** "I think the new embedding model is better." How do you know?
**Diagnosis:** No measurable comparison.
**Fix:** 50–200 hand-curated questions with ground-truth answers; run RAGAS on every change.

### Index never refreshed

**Symptom:** Faithfulness stays 0.9 but customer complaints climb. "Why does it think our policy is the 2023 version?"
**Diagnosis:** No reindex pipeline; corpus drift.
**Fix:** Daily / hourly reindex per domain; CDC feed for incremental updates. Monitor document-age metric.

### Weighting hybrid 50/50 without trying anything else

**Symptom:** Hybrid is in place but no improvement over dense-only.
**Diagnosis:** Default weights aren't right for your domain.
**Fix:** Start `0.6 dense / 0.4 sparse`; tune on eval set. Code/legal/finance often invert.

### Tuning chunk size on a tiny eval set

**Symptom:** "512 worked best in my 5 questions." Production performance disagrees.
**Diagnosis:** Eval set too small to be statistically meaningful.
**Fix:** Eval set ≥ 100 representative queries. Use bootstrapping or confidence intervals on RAGAS scores.

## Quality gates

- [ ] **Test:** RAGAS eval on a 100+ question set runs in CI; PR fails if faithfulness drops > 0.05 or context precision drops > 0.05.
- [ ] **Test:** zero-result rate measured per shard; alert if > 5%.
- [ ] **Test:** index-freshness test — random sampled docs against current source; alert if median age > SLA.
- [ ] Chunking: recursive, 512 tokens, 10–20% overlap, with structure-aware splits where the format permits (Markdown headings, code blocks).
- [ ] Hybrid retrieval (BM25 + dense) with RRF fusion (k=60); weights tuned on eval.
- [ ] Cross-encoder reranker in the pipeline; top-20 → top-5.
- [ ] Embedding model chosen by MTEB-on-your-domain eval, not blog post hype.
- [ ] RAGAS scores tracked over time; faithfulness ≥ 0.85, context precision ≥ 0.75 as gating thresholds.
- [ ] Reindex cadence documented per domain (daily / hourly / weekly); CDC where the source supports it.
- [ ] Per-query structured log with: query, candidates+scores per retriever, rerank scores, final top-5, generation latency. See `structured-logging-design`.
- [ ] OTel spans across the four stages (embed → retrieve → rerank → generate). See `opentelemetry-instrumentation`.
- [ ] LLM context order: highest-relevance first; consider sandwich (best at top + bottom).
- [ ] Cost monitoring: cost per query (embeddings + LLM) trended; alert on 2× baseline.

## NOT for

- **Fine-tuning vs RAG decision** — different problem; RAG wins in most production scenarios for fresh / large corpora. No dedicated skill yet.
- **Agentic / tool-use designs** — adjacent; RAG is the retrieval primitive an agent uses, not the agent loop.
- **Vector DB operational tuning** (HNSW M / ef_construction, IVFFlat lists) — adjacent; this skill assumes a working index.
- **General LLM prompt engineering** — separate concern; the prompt structure here is fixed (context + question), the point is the *content* of the context.
- **Embedding model training / fine-tuning** — separate skill (CLIP-aware embeddings, contrastive learning).
- **Multimodal RAG** (images, audio) — overlapping but distinct.
- **Chunking source-specific quirks** (PDF tables, OCR'd scans) — separate ingestion skill.

## Sources

- premai.io — *Building Production RAG: Architecture, Chunking, Evaluation & Monitoring (2026 Guide)* (chunk-size + overlap defaults, RRF k=60, weight 0.6/0.4, 73%/80% failure attribution, RAGAS thresholds, latency budget). [blog.premai.io/building-production-rag-architecture-chunking-evaluation-monitoring-2026-guide/][premai-rag]
- Lushbinary — *RAG Production Guide 2026: Retrieval-Augmented Generation*. [lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/][lushbinary-rag]
- DEV — *RAG Is Not Dead: Advanced Retrieval Patterns That Actually Work in 2026*. [dev.to/young_gao/rag-is-not-dead-advanced-retrieval-patterns-that-actually-work-in-2026][devto-advanced-rag]
- Medium — *Chunking, Hybrid Search, and Reranking: What Actually Improves RAG*. [medium.com/.../chunking-hybrid-search-and-reranking-what-actually-improves-rag][medium-improves-rag]
- RAGAS docs — metrics definitions and thresholds. [docs.ragas.io][ragas-docs]
- MTEB leaderboard. [huggingface.co/spaces/mteb/leaderboard][mteb-leaderboard]

[premai-rag]: https://blog.premai.io/building-production-rag-architecture-chunking-evaluation-monitoring-2026-guide/
[lushbinary-rag]: https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
[devto-advanced-rag]: https://dev.to/young_gao/rag-is-not-dead-advanced-retrieval-patterns-that-actually-work-in-2026-2gbo
[medium-improves-rag]: https://medium.com/@garima_yadav/chunking-hybrid-search-and-reranking-what-actually-improves-rag-de3d453c9059
[ragas-docs]: https://docs.ragas.io
[mteb-leaderboard]: https://huggingface.co/spaces/mteb/leaderboard
