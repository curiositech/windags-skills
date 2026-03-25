---
license: Apache-2.0
name: cache-strategy-invalidation-expert
description: "Redis caching patterns, cache-aside, write-through, TTL strategies, and invalidation. Activate on: caching, Redis, cache invalidation, cache-aside, write-through, TTL, CDN cache, stale-while-revalidate. NOT for: CDN/reverse proxy setup (use api-gateway-reverse-proxy-expert), database query optimization (use data-warehouse-optimizer)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,redis-cli:*)
category: Backend & Infrastructure
tags:
  - caching
  - redis
  - invalidation
  - performance
  - ttl
pairs-with:
  - skill: api-rate-limiting-throttling-expert
    reason: Redis powers both caching and rate limiting
  - skill: websocket-realtime-expert
    reason: Cache invalidation can trigger real-time updates
  - skill: multi-tenant-architecture-expert
    reason: Cache keys must be tenant-scoped in multi-tenant systems
---

# Cache Strategy & Invalidation Expert

Design and implement caching architectures using Redis, application-level caching, and CDN layers with reliable invalidation strategies.

## Activation Triggers

**Activate on:** "caching", "Redis cache", "cache invalidation", "cache-aside", "write-through", "TTL", "stale-while-revalidate", "cache stampede", "cache warming"

**NOT for:** CDN/proxy configuration → `api-gateway-reverse-proxy-expert` | Database query tuning → `data-warehouse-optimizer` | Connection pooling → `database-connection-pool-manager`

## Quick Start

1. **Identify cache candidates** — read-heavy, expensive to compute, tolerant of staleness
2. **Choose pattern** — cache-aside (most common), write-through (consistency), write-behind (performance)
3. **Set TTL strategy** — short TTL for volatile data (60s), long TTL + event invalidation for stable data
4. **Prevent stampede** — use probabilistic early refresh or mutex lock on cache miss
5. **Monitor hit rate** — target >90% hit rate; below 70% means your cache strategy is wrong

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **In-Memory** | Redis 7.4+, Valkey, DragonflyDB, KeyDB |
| **Application** | Node LRU cache, Cacheable, unstorage |
| **HTTP/CDN** | Cache-Control, stale-while-revalidate, Surrogate-Key |
| **Multi-Layer** | L1 (in-process) → L2 (Redis) → L3 (CDN) |
| **Invalidation** | Event-driven purge, TTL, tag-based (Surrogate-Key) |

## Architecture Patterns

### Cache-Aside with Stampede Prevention

```typescript
import { Redis } from 'ioredis';

const redis = new Redis();
const LOCK_TTL = 5; // seconds

async function cacheAside<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Acquire lock to prevent stampede
  const lockKey = `lock:${key}`;
  const acquired = await redis.set(lockKey, '1', 'EX', LOCK_TTL, 'NX');

  if (!acquired) {
    // Another process is fetching — wait and retry
    await new Promise(r => setTimeout(r, 100));
    return cacheAside(key, ttl, fetcher);
  }

  try {
    const data = await fetcher();
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    return data;
  } finally {
    await redis.del(lockKey);
  }
}
```

### Multi-Layer Cache Architecture

```
Request → L1: In-Process (LRU, 100ms TTL, ~1000 items)
              │ miss
              ↓
          L2: Redis (5-60min TTL, shared across instances)
              │ miss
              ↓
          L3: CDN (Cache-Control headers, edge-cached)
              │ miss
              ↓
          Origin (database/API)

Invalidation flows BACKWARD:
  Database change → Purge L2 (Redis DEL) → L1 expires via short TTL
                 → Purge L3 (Surrogate-Key purge / CDN API)
```

### Event-Driven Invalidation

```typescript
// On data change, publish invalidation event
async function updateUser(userId: string, data: UserUpdate) {
  await db.users.update(userId, data);

  // Invalidate all cache layers
  await redis.del(`user:${userId}`);
  await redis.del(`user:${userId}:profile`);

  // Publish for other instances' L1 caches
  await redis.publish('cache:invalidate', JSON.stringify({
    pattern: `user:${userId}:*`,
    timestamp: Date.now(),
  }));

  // CDN purge by surrogate key
  await cdn.purgeTag(`user-${userId}`);
}
```

## Anti-Patterns

1. **Cache everything** — caching write-heavy, rarely-read data wastes memory and creates invalidation headaches
2. **No TTL** — every cache entry must expire; relying solely on explicit invalidation will eventually leave stale data
3. **Cache-then-forget** — monitor hit rate, eviction rate, and memory usage; an unmonitored cache silently degrades
4. **Serializing full objects** — cache only what you need; storing entire ORM models bloats memory and couples cache to schema
5. **Invalidation by pattern scan** — `KEYS user:*` blocks Redis; use sets to track related keys or hash structures

## Quality Checklist

- [ ] Cache-aside pattern with stampede prevention (mutex or probabilistic refresh)
- [ ] TTL set on every key (no eternal cache entries)
- [ ] Hit rate monitored and >90% for primary caches
- [ ] Invalidation strategy defined: TTL-based, event-driven, or hybrid
- [ ] Cache keys include all relevant context (tenant, locale, version)
- [ ] Redis memory policy set (allkeys-lru for cache workloads)
- [ ] No `KEYS *` or `SCAN` in hot paths (use sets for key tracking)
- [ ] Multi-layer cache with clear TTL hierarchy (L1 < L2 < L3)
- [ ] Graceful degradation: app works (slower) if cache is down
- [ ] Cache warming strategy for cold starts after deployments
