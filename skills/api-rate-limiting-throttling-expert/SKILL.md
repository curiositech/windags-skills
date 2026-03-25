---
license: Apache-2.0
name: api-rate-limiting-throttling-expert
description: "Token bucket, sliding window, and Redis-based rate limiting for API protection. Activate on: rate limiting, throttling, token bucket, sliding window, API abuse, DDoS protection, quota management. NOT for: API gateway setup (use api-gateway-reverse-proxy-expert), caching (use cache-strategy-invalidation-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,redis-cli:*)
category: Backend & Infrastructure
tags:
  - rate-limiting
  - throttling
  - redis
  - api-protection
  - token-bucket
pairs-with:
  - skill: api-gateway-reverse-proxy-expert
    reason: Rate limiting is typically enforced at the gateway
  - skill: cache-strategy-invalidation-expert
    reason: Redis powers both caching and rate limit counters
  - skill: multi-tenant-architecture-expert
    reason: Per-tenant rate limits are essential for multi-tenant APIs
---

# API Rate Limiting & Throttling Expert

Implement fair, efficient rate limiting using token bucket, sliding window, and fixed window algorithms with Redis-backed distributed counters.

## Activation Triggers

**Activate on:** "rate limiting", "throttling", "token bucket", "sliding window", "API abuse", "DDoS protection", "quota management", "429 Too Many Requests", "request limits"

**NOT for:** API gateway configuration → `api-gateway-reverse-proxy-expert` | Caching strategies → `cache-strategy-invalidation-expert` | WAF/firewall rules → relevant security skill

## Quick Start

1. **Define limits** — requests/minute per API key, IP, or user tier
2. **Choose algorithm** — sliding window log (precise), token bucket (bursty), fixed window (simple)
3. **Use Redis** — atomic operations with `MULTI/EXEC` or Lua scripts for distributed rate limiting
4. **Return proper headers** — `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
5. **Differentiate tiers** — free/pro/enterprise get different limits

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Algorithms** | Token bucket, sliding window log, sliding window counter, fixed window |
| **Storage** | Redis 7.4+, Valkey, DragonflyDB, in-memory (single node) |
| **Libraries** | rate-limiter-flexible, @upstash/ratelimit, express-rate-limit |
| **Gateway Plugins** | Kong rate-limiting, Nginx limit_req, Traefik ratelimit |
| **Standards** | RFC 6585 (429), RateLimit headers (draft-ietf-httpapi-ratelimit) |

## Architecture Patterns

### Sliding Window Counter (Redis Lua)

```lua
-- Redis Lua script: sliding window rate limiter
-- KEYS[1] = rate limit key
-- ARGV[1] = window size (seconds)
-- ARGV[2] = max requests
-- ARGV[3] = current timestamp

local key = KEYS[1]
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- Remove expired entries
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

-- Count current window
local count = redis.call('ZCARD', key)

if count < limit then
  redis.call('ZADD', key, now, now .. '-' .. math.random(1000000))
  redis.call('EXPIRE', key, window)
  return {1, limit - count - 1}  -- allowed, remaining
else
  return {0, 0}  -- denied, 0 remaining
end
```

### Multi-Tier Rate Limiting

```
Request → IP Rate Limit (100/min)
              │ pass
              ↓
         Auth Check → API Key Rate Limit (tier-based)
              │           Free:  60/min
              │           Pro:   600/min
              │           Enterprise: 6000/min
              ↓ pass
         Endpoint Rate Limit (per-route)
              │   POST /upload: 10/min
              │   GET /search:  120/min
              ↓ pass
         Process Request
```

### Response Headers (IETF Draft Standard)

```typescript
// Middleware: attach rate limit headers
function rateLimitHeaders(limit: number, remaining: number, resetAt: number) {
  return {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': Math.max(0, remaining).toString(),
    'RateLimit-Reset': Math.ceil((resetAt - Date.now()) / 1000).toString(),
  };
}

// On 429 response:
res.status(429).set({
  ...rateLimitHeaders(limit, 0, resetAt),
  'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
}).json({ error: 'Too Many Requests', retryAfter: resetAt });
```

## Anti-Patterns

1. **In-memory counters in distributed systems** — rate limits must be shared across instances; use Redis or equivalent
2. **Missing Retry-After header** — 429 responses without `Retry-After` force clients to guess, leading to thundering herd
3. **IP-only rate limiting** — IP limits miss authenticated abuse and punish shared IPs (NAT, VPN); combine with API key limits
4. **Hard cutoff without burst** — token bucket allows small bursts while maintaining average rate; pure fixed window is too rigid
5. **No rate limit on internal APIs** — a misbehaving internal service can cascade-fail your database; always limit

## Quality Checklist

- [ ] Rate limits use distributed storage (Redis/Valkey), not in-memory
- [ ] `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers on every response
- [ ] `Retry-After` header on 429 responses
- [ ] Different limits per authentication tier (free/pro/enterprise)
- [ ] Per-endpoint limits for expensive operations (uploads, search)
- [ ] Lua script or atomic pipeline for counter increment (no race conditions)
- [ ] Rate limit keys include both identity (API key) and scope (endpoint)
- [ ] Monitoring dashboard shows rate limit hits, denials, and top consumers
- [ ] Graceful degradation: queue or slow down rather than hard-reject where possible
