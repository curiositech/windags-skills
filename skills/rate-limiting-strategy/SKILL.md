---
name: rate-limiting-strategy
description: 'Use when designing rate limiting for an API, choosing between token bucket / sliding window / leaky bucket / fixed window, implementing it in Redis, deciding edge (Cloudflare/Upstash) vs origin enforcement, sizing per-user vs per-IP vs per-endpoint quotas, returning the right 429 response with Retry-After, or fixing the boundary-burst bug in fixed-window limiters. Triggers: 429 too many requests, INCR + EXPIRE, ZADD + ZREMRANGEBYSCORE + ZCARD, X-RateLimit-Remaining header, Cloudflare WAF rate limiting rules, Upstash @upstash/ratelimit, leaky bucket shaping vs policing, distributed rate limiter consistency. NOT for DDoS mitigation specifically (different scale), CAPTCHA / bot management, full WAF design, or per-user quota billing.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - rate-limiting
  - redis
  - api-design
  - cloudflare
  - throttling
  - infrastructure
---

# Rate Limiting Strategy

Three decisions before any code: **which algorithm**, **where in the stack**, **what key**. Get those right and the implementation is 30 lines of Lua. Get any of them wrong and you'll either let an attacker through or wreck legitimate clients on traffic spikes.

The widely-recommended starting position, repeated across Redis's own tutorial, API7's algorithm guide, and Cloudflare's deployment data, is **sliding window counter** as a general-purpose default — it has the accuracy of a sliding window log without the O(n) memory ([Redis — *Build 5 Rate Limiters*][redis-ratelimit], [API7 — *Rate Limiting Guide*][api7-ratelimit]). Cloudflare's published numbers: only **0.003% misclassification across 400M requests** with sliding window counter ([API7][api7-ratelimit]).

```
algorithm   →  sliding window counter (general); token bucket (allow bursts); leaky bucket (smooth output)
where       →  edge (Cloudflare WAF / Upstash) for unauth; origin (Redis) for per-user
key         →  authenticated user ID > IP+UA > IP > global
```

**Jump to your fire:**
- "Which algorithm?" → [Pick the algorithm](#pick-the-algorithm)
- Where to enforce it → [Edge vs origin](#edge-vs-origin)
- What to key on → [Choosing the key](#choosing-the-key)
- Implementing in Redis → [Redis recipes](#redis-recipes)
- Returning the right HTTP response → [The 429 response](#the-429-response)
- Distributed limiter consistency → [Distributed gotchas](#distributed-gotchas)
- Boundary-burst bug → [Fixed window's boundary trap](#fixed-windows-boundary-trap)

## When to use

- New API needs limits before launch.
- Existing service hit by a scraper or buggy client.
- Auth endpoints (`/login`, `/register`, `/forgot-password`) need brute-force protection.
- Per-user fairness on a shared resource (LLM API, transcoding, search).
- Migrating from a single-process limiter to a distributed one.

## Core capabilities

### Pick the algorithm

| Algorithm | Memory | Accuracy | Bursts | Best for |
|---|---|---|---|---|
| **Fixed window counter** | O(1) per key | Approximate; **2× at boundaries** | Yes (the bug) | Simple internal limits where 2× isn't catastrophic |
| **Sliding window log** | O(n) per key (one entry per request) | Exact | No | High-value APIs where the cost is acceptable |
| **Sliding window counter** | O(1) per key (two windows) | Near-exact | Smoothed | **General-purpose default** ([api7-ratelimit]) |
| **Token bucket** | O(1) per key | Exact | Controlled bursts up to capacity | Bursty workloads (CI runs, batch imports) |
| **Leaky bucket — policing** | O(1) per key | Exact | None | Strict steady-rate enforcement |
| **Leaky bucket — shaping** | O(1) per key | Exact, but adds latency | None | Outbound to a downstream with strict pacing |

The Redis tutorial's compressed comparison: ([redis-ratelimit])

> "Start with Sliding Window Counter — it balances accuracy, simplicity, and memory efficiency for most production APIs."

### Fixed window's boundary trap

The simplest algorithm has a real bug worth understanding before you ship it:

```
limit = 10 requests per 10 seconds, fixed windows aligned to wall clock.
Window A: [00:00:00 – 00:00:09]
Window B: [00:00:10 – 00:00:19]

Client sends 10 requests at 00:00:09.5  →  all in window A, all allowed.
Client sends 10 requests at 00:00:10.5  →  all in window B, all allowed.

Net: 20 requests in 1 second within a "10 per 10 seconds" limit.
```

That's the **boundary burst**. Sliding-window counter fixes it by interpolating across windows. Sliding-window log fixes it exactly at O(n) memory cost.

### Edge vs origin

| Where | Pros | Cons | Use for |
|---|---|---|---|
| **CDN / WAF edge** (Cloudflare Rate Limiting, AWS WAF, Fastly) | Cheapest — drops before origin pays. Globally distributed. | Coarse keys (IP, header, JWT subject). | Unauthenticated traffic, abuse, DDoS-adjacent. |
| **API gateway** (Kong, Envoy, Traefik) | Per-route, easy to standardize. | Single point if it's a single instance. | Per-tier quotas, internal mesh. |
| **Application + Redis** | Full context (user_id, plan, endpoint cost). | Each request hits origin. | Per-user quota, plan-based limits, billing. |
| **In-process** (`@nestjs/throttler` without Redis) | Zero infrastructure. | Per-instance only — N pods = N× the limit. | Single-replica internal tools. Rarely correct in prod. |

The right architecture is usually **edge + origin in series**: edge drops obvious abuse cheaply; origin enforces per-user quotas with full context. Don't try to do per-user quota at the edge with imperfect identification, and don't try to do DDoS at the origin.

Cloudflare offers WAF Rate Limiting rules that key on common headers and Bot Score; Upstash offers `@upstash/ratelimit` for Workers/edge runtimes — both are sliding-window-counter-based. ([Upstash docs][upstash-ratelimit])

### Choosing the key

The key determines who shares the limit. Bad keys are how you DOS your own users.

| Tier | Key | Notes |
|---|---|---|
| 1 | Authenticated user ID | Best for product limits. Requires auth to be settled before the limiter. |
| 2 | API key / token hash | For B2B; pair with plan tier. |
| 3 | IP + user-agent + path | For unauthenticated; UA reduces NAT collisions. |
| 4 | IP only | Coarsest; corporate NATs and CGNAT collide hundreds of users. |
| 5 | Global (per-endpoint) | Use only as a backstop ("never more than 5k/sec to /search"). |

For login: rate-limit by **(IP, username)** AND **(IP)** AND **(username)** simultaneously. An attacker brute-forcing one user's password rotates IPs; an attacker spraying weak passwords across many users uses one IP; both must be blocked. Limit each tuple separately.

### Redis recipes

The single common requirement: **atomic** read-modify-write. That means a Lua script via `EVAL` (or `EVALSHA` cached). Without atomicity you have race-induced over-allows under contention.

#### Sliding window log (exact, O(n))

The Redis tutorial's pattern: ([redis-ratelimit])

```lua
-- KEYS[1] = bucket key, ARGV = now (ms), windowMs, limit, member
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]

redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - windowMs)
local count = redis.call('ZCARD', KEYS[1])
if count < limit then
  redis.call('ZADD', KEYS[1], now, member)
  redis.call('PEXPIRE', KEYS[1], windowMs + 1000)
  return {1, limit - count - 1}   -- allowed, remaining
end
return {0, 0}                     -- denied
```

`member` should be `now .. ':' .. randomBytes` so duplicates don't collide. Keep `limit ≤ ~10k`; sorted set memory grows linearly with traffic.

#### Sliding window counter (general default)

Approximate sliding window using two adjacent fixed windows and weighted interpolation:

```lua
-- ARGV: now_ms, windowMs, limit
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

local currentWindow = math.floor(now / windowMs)
local currentKey = KEYS[1] .. ':' .. currentWindow
local prevKey    = KEYS[1] .. ':' .. (currentWindow - 1)

local current = tonumber(redis.call('GET', currentKey) or '0')
local previous = tonumber(redis.call('GET', prevKey) or '0')

local elapsedInCurrent = (now % windowMs) / windowMs
local weighted = previous * (1 - elapsedInCurrent) + current

if weighted + 1 <= limit then
  redis.call('INCR', currentKey)
  redis.call('PEXPIRE', currentKey, windowMs * 2)
  return {1, math.floor(limit - weighted - 1)}
end
return {0, 0}
```

O(1) memory per principal. Cloudflare's deployment shows ~0.003% error on 400M requests. ([api7-ratelimit])

#### Token bucket (allow bursts to capacity)

```lua
-- ARGV: now_ms, capacity, refill_per_sec, cost
local key = KEYS[1]
local now = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local refill = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])

local s = redis.call('HMGET', key, 'tokens', 'ts')
local tokens = tonumber(s[1]) or capacity
local lastTs = tonumber(s[2]) or now

local elapsedSec = (now - lastTs) / 1000
tokens = math.min(capacity, tokens + elapsedSec * refill)

if tokens >= cost then
  tokens = tokens - cost
  redis.call('HMSET', key, 'tokens', tokens, 'ts', now)
  redis.call('EXPIRE', key, math.ceil(capacity / refill) + 60)
  return {1, math.floor(tokens)}
end
redis.call('HMSET', key, 'tokens', tokens, 'ts', now)
return {0, 0}
```

`cost` per request lets you charge expensive endpoints more (a vector embedding might cost 10 tokens, a metadata read 1).

#### Fixed window (when you must keep it simple)

```lua
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1]))
end
return count
```

Cheap, simple, has the boundary-burst bug. Acceptable for "no more than N writes per minute to a low-stakes internal endpoint" but not for anything customer-facing.

### The 429 response

The full surface, per the modern conventions ([MDN — *429 Too Many Requests*][mdn-429]):

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 30
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1714592400

{
  "error": "rate_limit_exceeded",
  "message": "100 requests per minute exceeded.",
  "retry_after": 30
}
```

- **`Retry-After`**: integer seconds (or HTTP date). Required for the client to back off correctly.
- **`RateLimit-*`** headers (IETF draft): `Limit`, `Remaining`, `Reset` (epoch seconds). Some implementations still use the legacy `X-RateLimit-*`; emit both during transition.
- Body should be machine-parseable; clients automate around it.
- Don't return 429 from auth endpoints with helpful detail — `"4 attempts left"` becomes a brute-force aid. Keep the message generic.

### Distributed gotchas

- **One Redis, multiple app pods**: fine, atomic via Lua. This is the common case.
- **Redis Cluster**: keys for one principal MUST hash to the same slot. Use `{user:42}` as part of the key so the surrounding key components don't break atomicity.
- **Multi-region with separate Redises**: the limiter is per-region. A client switching regions doubles their limit. Either accept it (most APIs) or use a global counter (separate concern, much higher latency).
- **Failure mode**: if Redis is down, what happens? Open question. Common answers:
  - **Fail-open** (allow everything) — preserves availability but lets abuse through.
  - **Fail-closed** (deny everything) — preserves protection but tanks availability.
  - **Local fallback** (per-pod in-memory limiter at higher allowance) — degraded but still some protection.
- Document the choice. Don't let it be an accident.

### Production wiring

```ts
// Hono / Express middleware sketch.
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL!);
const slidingWindowLua = await redis.script('LOAD', SCRIPT);

export const rateLimit = (opts: { windowMs: number; limit: number; keyFn: (c) => string }) =>
  async (c, next) => {
    const key = `rl:${opts.keyFn(c)}`;
    const member = `${Date.now()}:${crypto.randomBytes(4).toString('hex')}`;
    const [allowed, remaining] = await redis.evalsha(
      slidingWindowLua, 1, key, Date.now(), opts.windowMs, opts.limit, member
    ) as [number, number];

    c.header('RateLimit-Limit', String(opts.limit));
    c.header('RateLimit-Remaining', String(remaining));
    c.header('RateLimit-Reset', String(Math.ceil((Date.now() + opts.windowMs) / 1000)));

    if (!allowed) {
      c.header('Retry-After', String(Math.ceil(opts.windowMs / 1000)));
      return c.json({ error: 'rate_limit_exceeded' }, 429);
    }
    return next();
  };
```

OTel span attributes per request: `ratelimit.key`, `ratelimit.allowed`, `ratelimit.remaining` (see `opentelemetry-instrumentation`).

## Anti-patterns

### Per-pod in-memory limiter

**Symptom:** Limit is "100/min" but production allows 100×N (N pods) per minute. Scaling out silently raises the effective limit.
**Diagnosis:** No shared state.
**Fix:** Redis (or equivalent) backing.

### Fixed window for customer-facing API

**Symptom:** Reports of "I'm getting 200 requests through in two seconds" despite the 100/min limit.
**Diagnosis:** Boundary burst.
**Fix:** Sliding window counter (or sliding window log if exactness required).

### Keying on IP only behind a proxy

**Symptom:** All requests appear to come from the load balancer's internal IP; one user's spam blocks everyone.
**Diagnosis:** App reads `req.connection.remoteAddress`, not `X-Forwarded-For`.
**Fix:** Read the trusted forwarded IP. Validate the proxy chain. Better yet, key on the authenticated user where possible.

### No `Retry-After` header

**Symptom:** Clients hammer the API in tight loops after 429s; outages look worse than they are.
**Diagnosis:** No explicit backoff signal.
**Fix:** Always emit `Retry-After`. Document the header. Pair with `RateLimit-*`.

### Same limit on auth and read endpoints

**Symptom:** Brute-force succeeds because a 1000/min limit on `/login` is way too generous, OR legitimate clients get blocked because a 5/min limit also applies to `/health`.
**Diagnosis:** One global limit policy.
**Fix:** Differentiate by endpoint cost / risk: auth ~5–10/min per IP+username; reads ~1000/min per user; expensive (LLM, search) by token-bucket cost.

### Race conditions without Lua

**Symptom:** Counter occasionally allows a few above the limit under concurrency.
**Diagnosis:** Sequence of `GET`/`SET` that isn't atomic.
**Fix:** All limiter logic in a single `EVAL` (Lua). Use `EVALSHA` after the script is loaded.

### Cluster keys not co-located

**Symptom:** `MOVED` errors, slot mismatch, or atomicity broken.
**Diagnosis:** Lua script touches multiple keys that hash to different slots.
**Fix:** Use `{tag}` syntax: `rl:{user:42}:current` and `rl:{user:42}:prev` hash to the same slot.

### Failing open without telemetry

**Symptom:** Abuse goes through during a Redis blip; nobody notices.
**Diagnosis:** Limiter caught the error, allowed the request, didn't log/alert.
**Fix:** Emit a metric on every fail-open; alert if rate > N per minute.

### Returning detailed quotas in error messages

**Symptom:** A scraper learns the exact limit and stays just under it.
**Diagnosis:** `"You have 4/5 attempts remaining"` is reconnaissance.
**Fix:** Generic 429 message. Quota status only on authenticated, scoped endpoints.

## Quality gates

- [ ] **Test:** load test asserts the limit is enforced in aggregate (Nx pods, K concurrent clients) — not just per-pod.
- [ ] **Test:** boundary test for sliding-window correctness — assert no 2× burst at window flips.
- [ ] **Test:** Redis-down failure mode is exercised (chaos toggle); behavior matches the documented decision (fail-open / fail-closed / local-fallback).
- [ ] Algorithm choice is documented and matched to use case (sliding window counter is the default).
- [ ] All limiter logic runs in a single `EVAL`/`EVALSHA` Lua script — no race in the read-modify-write.
- [ ] Cluster-safe keys (`{tag}` hash co-location) if using Redis Cluster.
- [ ] Per-endpoint and per-key-tier limits configured (auth vs read vs expensive); not a single global limit.
- [ ] `Retry-After` AND `RateLimit-Limit/Remaining/Reset` headers on every 429.
- [ ] Login rate-limited by (IP, username), (IP), and (username) tuples simultaneously.
- [ ] Edge-layer rate limiting in place for unauthenticated traffic (Cloudflare WAF, Upstash, AWS WAF).
- [ ] Limiter metrics exported: requests, allowed, denied, fail-open count. Alert on denied-rate spikes (`grafana-dashboard-builder`).
- [ ] OTel span attributes recorded per request (`ratelimit.key`, `ratelimit.allowed`, `ratelimit.remaining`) — see `opentelemetry-instrumentation`.

## NOT for

- **DDoS mitigation** at scale — different problem; needs anycast, scrubbing, BGP. → CDN + WAF.
- **CAPTCHA / bot management** — behavioral signals, not rate-based.
- **Full WAF design** — much bigger surface (rules, signatures, anomalies). No dedicated skill yet.
- **Per-user billing / quota for a metered product** — rate limiting is the enforcement layer; billing is a different system.
- **Network-layer SYN-flood / packet rate limiting** — kernel-level, different toolset.
- **Rate-limiting jobs in a queue** (concurrency caps on workers) — different shape. → `background-job-queue-design`.

## Sources

- Redis — *Build 5 Rate Limiters with Redis: Algorithm Comparison Guide* (Lua scripts for all four algorithms with pros/cons). [redis.io/tutorials/howtos/ratelimiting/][redis-ratelimit]
- API7 — *From Token Bucket to Sliding Window: Pick the Perfect Rate Limiting Algorithm* (Cloudflare 0.003% misclassification stat across 400M requests). [api7.ai/blog/rate-limiting-guide-algorithms-best-practices][api7-ratelimit]
- Upstash docs — `@upstash/ratelimit` (sliding-window counter for edge runtimes). [upstash.com/docs/oss/sdks/ts/ratelimit/overview][upstash-ratelimit]
- MDN — *429 Too Many Requests*. [developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429][mdn-429]
- IETF draft — *RateLimit Header Fields for HTTP* (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`). [datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/][ietf-ratelimit-headers]
- ByteByteGo — *Design A Rate Limiter* (the canonical interview-style breakdown). [bytebytego.com/courses/system-design-interview/design-a-rate-limiter][bytebytego-ratelimit]

[redis-ratelimit]: https://redis.io/tutorials/howtos/ratelimiting/
[api7-ratelimit]: https://api7.ai/blog/rate-limiting-guide-algorithms-best-practices
[upstash-ratelimit]: https://upstash.com/docs/oss/sdks/ts/ratelimit/overview
[mdn-429]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429
[ietf-ratelimit-headers]: https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/
[bytebytego-ratelimit]: https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter
