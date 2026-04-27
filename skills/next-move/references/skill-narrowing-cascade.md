# Skill Narrowing Cascade

The 503-skill catalog is too large to send to the Skill Selector verbatim. The narrowing cascade trims it to a candidate shortlist before the LLM ever sees it. Understanding this cascade lets you debug bad skill matches.

## The Pipeline

```
Subtask description (from Decomposer)
        │
        ▼
┌───────────────────────┐
│ 1. BM25 (lexical)     │  ← Stemmed Porter + bigrams over name+description+tags+category
└───────────────────────┘
        │ ~50 candidates
        ▼
┌───────────────────────┐
│ 2. Tool2Vec (semantic)│  ← Skills embedded by usage queries; cosine vs subtask embedding
└───────────────────────┘
        │ ~50 ranked
        ▼
┌───────────────────────┐
│ 3. RRF fusion         │  ← Reciprocal Rank Fusion combines BM25 + Tool2Vec rankings
└───────────────────────┘
        │ unified ranking
        ▼
┌───────────────────────┐
│ 4. Cross-encoder      │  ← ms-marco-MiniLM rerank on top-20
└───────────────────────┘
        │ top-20 reranked
        ▼
┌───────────────────────┐
│ 5. Attribution k-NN   │  ← Score adjustment based on prior task observations
└───────────────────────┘
        │ ~10-15 final candidates
        ▼
   Skill Selector LLM picks primary + runner-up
```

Every stage is implemented in `packages/core/src/retrieval/skill-search-service.ts`. There is **one** index, not seven.

## Stage-by-Stage Notes

### Stage 1: BM25

- Okapi BM25 (k1=1.2, b=0.75) over the canonical document for each skill: `id description category tags`.
- Porter stemming applied to query and doc tokens — "auth" matches "authentication", "authorize", "authorized."
- Bigram indexing — "react server" matches the bigram even when "react" and "server" are far apart in the doc.
- **No keyword lists, no stopword lists, no substring matching.** IDF handles term importance; common words self-weight to near-zero.

### Stage 2: Tool2Vec

- Each skill has a synthetic "queries that would be answered by this skill" set (Haiku-generated at index build).
- Those queries are embedded with `Xenova/all-MiniLM-L6-v2` and averaged → one vector per skill.
- Subtask query embeds the same way; cosine similarity ranks.
- Falls back gracefully when Transformers.js can't load (missing native dep, no GPU). Pipeline still works on BM25 alone.

### Stage 3: RRF Fusion

- Reciprocal Rank Fusion: `score = 1 / (k + rank_bm25) + 1 / (k + rank_t2v)` with `k = 60`.
- RRF is robust to score-scale mismatch — we don't need to calibrate BM25 scores against cosine scores.
- When Tool2Vec is unavailable, we skip fusion and use BM25 ranks directly.

### Stage 4: Cross-encoder

- ms-marco-MiniLM-L-6-v2 reranks the top-20.
- Cross-encoder sees `query` and `doc` together (vs. bi-encoder which sees them separately) — much sharper relevance judgment, but expensive.
- Top-20 → top-20 with new ranks. Stages 1–3 keep skills 21+ in their relative order at the bottom.

### Stage 5: Attribution k-NN

- The attribution DB stores observations from past predictions: which skills were used, what the task context was, and how each of the 5 attribution signals scored.
- For the current task, we compute a task embedding, find the k-nearest historical task embeddings, and read their stored signal scores per skill.
- This adjusts the score: a skill that's lexically similar but historically performs poorly on tasks like this gets demoted; one that's a slight lexical mismatch but consistently strong gets promoted.
- Requires `taskEmbedding` to be passed in `SearchOptions`. The Decomposer stage does this; ad-hoc callers may not.

## When Stages Get Skipped

| Stage | Skipped when | What happens |
|---|---|---|
| Tool2Vec | Embeddings cache empty or Transformers.js unavailable | RRF reduces to BM25-only ranking |
| Cross-encoder | Native ONNX runtime missing, model download fails | Top-20 keeps RRF order |
| Attribution k-NN | DB empty, fewer than 2 neighbors found, or no `taskEmbedding` | No score adjustment |

A graceful degradation chain. BM25 alone produces usable results; every other stage is additive precision.

## Debugging Bad Skill Matches

When the Skill Selector picks something obviously wrong, walk back up the cascade.

| Symptom | Likely stage | Check |
|---|---|---|
| Right *category* but wrong *skill* | Cross-encoder didn't fire | Look for "ce:" in the `breakdown` field of the result. If absent, cross-encoder was unavailable. |
| Hyper-literal match (skill named almost identically to query terms but unrelated semantically) | Tool2Vec didn't fire | Look for "rrf(bm25:N,t2v:M)" in breakdown. If you only see "bm25:N", Tool2Vec was off. |
| Match was right historically but wrong now | Attribution k-NN drift | Check if many recent triples have negative feedback for that skill on similar tasks. |
| Stale skill keeps getting picked | Index out of date | Re-run `initialize()` after skill content changes. Each skill's content hash should match the SKILL.md hash. |
| No reasonable match at all | Genuine catalog gap | Surface this. The user may need a new skill, not a better match. |

## The `breakdown` Field

Every `SkillSearchResult` carries a `breakdown` string for forensics:

- `bm25:12.34` — BM25 only (Tool2Vec unavailable).
- `rrf(bm25:3,t2v:7)` — RRF over both, ranks shown.
- `ce:0.8721` — Cross-encoder reranked, score shown.
- `rrf(...),knn:0.62(5n)` — Attribution k-NN adjusted, 5 neighbors used.

When a user reports a bad match, ask for the `breakdown` value. It tells you which stages contributed.

## Catalog Gaps vs. Retrieval Misses

These are different problems:

- **Retrieval miss**: the right skill exists but didn't surface. Fixable by tuning the cascade or adding a synonym to the skill description.
- **Catalog gap**: no existing skill fits. Adding more retrieval magic won't help; the user needs a skill author.

Distinguish by reading the top-20 candidates. If something reasonable is in the top-20 but Stage 4/5 didn't promote it, it's a retrieval miss. If nothing in the top-20 is even adjacent, it's a gap. Record gaps in the triple under a `gap_signal` field; the gap detector aggregates them.

## Quality Gate

When the Skill Selector LLM proposes a primary skill:
- [ ] Did the candidate appear in the top-10 of the cascade?
- [ ] If the user later swaps it, record that as a `modification` in the triple — that's the strongest training signal.
- [ ] If the breakdown shows only `bm25:` (no t2v, no ce, no knn), warn that the cascade ran in degraded mode.
