---
license: Apache-2.0
name: llm-response-caching-layer
description: 'Implement semantic and exact-match caching for LLM responses to reduce cost 40-60% and latency. Activate on: LLM caching, semantic cache, reduce API costs, cache AI responses. NOT for: general web caching (caching-strategies), CDN config (cloudflare-worker-dev).'
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: Backend & Infrastructure
tags:
  - caching
  - llm
  - cost-reduction
  - semantic-cache
  - redis
pairs-with:
  - skill: caching-strategies
    reason: General cache architecture patterns inform LLM-specific cache tiers
  - skill: llm-cost-optimizer
    reason: Caching is a primary lever for LLM cost reduction
  - skill: ai-engineer
    reason: Cache layer integrates into LLM application pipelines
---

# LLM Response Caching Layer

Implement semantic and exact-match caching for LLM API responses to reduce costs 40-60% and cut P50 latency from seconds to milliseconds.

## Activation Triggers

**Activate on**: "cache LLM responses", "semantic cache", "reduce OpenAI costs", "LLM API caching", "cache embeddings", "deduplicate LLM calls", "response memoization for AI"

**NOT for**: General HTTP/CDN caching (caching-strategies), browser cache headers (caching-strategies), or database query caching (ORM-specific)

## Quick Start

1. **Classify request types** — Deterministic (structured extraction, classification) vs. creative (open-ended generation). Deterministic requests are highly cacheable.
2. **Choose cache strategy** — Exact-match (hash of prompt + params) for deterministic requests, semantic similarity for natural language queries.
3. **Set up cache store** — Redis for exact-match (fast, TTL-native), vector DB for semantic cache (similarity search).
4. **Integrate as middleware** — Wrap your LLM client with a cache-check layer that intercepts before API calls.
5. **Monitor hit rates** — Target 30-50% hit rate for mixed workloads, 70%+ for classification/extraction.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Exact-Match Cache** | Redis, DynamoDB, Memcached | Hash(prompt + model + temperature + params) as key |
| **Semantic Cache** | GPTCache, Qdrant, Pinecone, pgvector | Embed query, find similar cached responses |
| **Similarity Threshold** | Cosine similarity >= 0.95 typical | Tune per use case; lower = more hits, more risk |
| **Cache Invalidation** | TTL-based, version-tagged, manual purge | LLM responses rarely need real-time freshness |
| **Observability** | Cache hit/miss rates, cost savings, latency delta | Essential for ROI justification |

## Architecture Patterns

### Pattern 1: Two-Tier LLM Cache

```
LLM Request
    │
    ▼
[Exact Match Cache (Redis)] ──hit──→ Return cached response (< 5ms)
    │ miss
    ▼
[Semantic Cache (Vector DB)] ──hit (similarity > 0.95)──→ Return cached response (< 50ms)
    │ miss
    ▼
[LLM API Call] ──→ response ──→ Store in both caches ──→ Return response
```

```python
# Two-tier caching middleware
import hashlib, json, numpy as np

class LLMCacheMiddleware:
    def __init__(self, redis_client, vector_db, embedder, threshold=0.95):
        self.redis = redis_client
        self.vdb = vector_db
        self.embedder = embedder
        self.threshold = threshold

    def cache_key(self, prompt: str, model: str, **params) -> str:
        blob = json.dumps({"prompt": prompt, "model": model, **params}, sort_keys=True)
        return f"llm:{hashlib.sha256(blob.encode()).hexdigest()}"

    async def query(self, prompt: str, model: str, **params) -> str:
        # Tier 1: Exact match
        key = self.cache_key(prompt, model, **params)
        cached = await self.redis.get(key)
        if cached:
            return json.loads(cached)["response"]  # < 5ms

        # Tier 2: Semantic match
        query_emb = self.embedder.embed(prompt)
        results = self.vdb.search(query_emb, top_k=1)
        if results and results[0].score >= self.threshold:
            return results[0].payload["response"]  # < 50ms

        # Cache miss: call LLM
        response = await llm_call(prompt, model, **params)

        # Store in both tiers
        await self.redis.setex(key, 86400, json.dumps({"response": response}))
        self.vdb.upsert(query_emb, {"prompt": prompt, "response": response})
        return response
```

### Pattern 2: Cache-Aware Request Classification

```
Incoming Request
    │
    ▼
[Classify Cacheability]
    ├── temperature == 0 AND structured output → HIGHLY CACHEABLE (TTL: 7 days)
    ├── temperature == 0 AND free-form         → CACHEABLE (TTL: 24 hours)
    ├── temperature > 0 AND repeated pattern   → SEMANTIC CACHE ONLY (TTL: 1 hour)
    └── temperature > 0 AND unique/creative    → DO NOT CACHE
```

### Pattern 3: Versioned Cache with Model Upgrades

```
Cache Key = hash(prompt + model_version + system_prompt_version + params)

Model upgrade (gpt-4o-2026-01 → gpt-4o-2026-03):
  → All cache keys change automatically (model_version in hash)
  → Old cache entries expire via TTL
  → No manual invalidation needed
```

## Anti-Patterns

1. **Caching creative/high-temperature responses** — Temperature > 0.7 means the user expects variety. Caching returns identical responses and feels broken.
2. **Global similarity threshold** — A 0.95 threshold works for factual Q&A but is too loose for code generation and too tight for casual chat. Tune per endpoint.
3. **No cache versioning on model upgrades** — Switching from GPT-4o to Claude returns stale GPT-4o responses. Include model version in cache keys.
4. **Infinite TTL** — Even deterministic responses can become stale when underlying data changes. Set TTL based on data freshness requirements (hours to days, not forever).
5. **Caching without cost tracking** — You cannot prove ROI without measuring: cache hit rate, tokens saved, dollars saved, latency improvement.

## Quality Checklist

- [ ] Request types classified by cacheability (deterministic vs. creative)
- [ ] Exact-match cache uses hash of full request (prompt + model + params)
- [ ] Semantic cache threshold tuned per use case (tested on sample queries)
- [ ] Cache key includes model version for automatic invalidation on upgrades
- [ ] TTL set based on data freshness requirements (not infinite)
- [ ] High-temperature (> 0.7) requests excluded from caching
- [ ] Cache hit/miss rates monitored with alerting on rate drops
- [ ] Cost savings calculated and reported: tokens saved, dollars saved per day
- [ ] Cache store sized for expected working set (Redis memory, vector DB storage)
- [ ] Graceful degradation: cache failure falls through to LLM API (never blocks)
