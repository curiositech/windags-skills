---
license: Apache-2.0
name: cloudflare-worker-dev
description: Cloudflare Workers, KV, Durable Objects, and edge computing development. Use for serverless APIs, caching, rate limiting, real-time features. Activate on "Workers", "KV", "Durable Objects", "wrangler", "edge function", "Cloudflare". NOT for Cloudflare Pages configuration (use deployment docs), DNS management, or general CDN settings.
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
category: DevOps & Infrastructure
tags:
  - cloudflare
  - workers
  - edge-computing
  - serverless
  - kv
  - caching
  - rate-limiting
---

# Cloudflare Workers Development

Build high-performance edge APIs with Workers, KV for caching, and Durable Objects for real-time coordination.

## DECISION POINTS

### Service Selection Decision Tree

```
Need real-time state consistency?
├── YES → Use Durable Objects
│   ├── Chat/collaboration → WebSocket pattern
│   ├── Counters/queues → Atomic operations
│   └── Session management → Per-user Objects
└── NO → Continue to storage decision
    ├── Need fast reads, eventual consistency OK?
    │   ├── YES → Use KV
    │   │   ├── Cache TTL < 1 hour → expirationTtl: 3600
    │   │   ├── Config/sessions → expirationTtl: 86400
    │   │   └── Long-term cache → expirationTtl: 604800
    │   └── NO → Use external DB (D1/Postgres)
    └── File storage needed?
        └── YES → Use R2 (images, documents)
```

### Geohash Precision vs Accuracy

```
Geographic scope?
├── City-level (10km radius) → 4-character geohash
├── Metro area (50km radius) → 3-character geohash  
├── Regional (100km radius) → 2-character geohash
└── Country-level → Use country code instead

Cache hit rate priority?
├── HIGH → Use 2-3 character geohash (broader cache sharing)
└── PRECISION → Use 4-5 character geohash (location accuracy)
```

### Rate Limiting Strategy

```
Rate limit scope?
├── Per IP → Use CF-Connecting-IP header
├── Per user → Use auth token/user ID
├── Per API key → Use Authorization header
└── Global → Use fixed key

Time window?
├── Burst protection (< 1 min) → Use in-memory counter
├── Short term (1-60 min) → Use KV with TTL
└── Long term (> 1 hour) → Use external storage
```

## FAILURE MODES

### CPU Timeout Spiral
**Symptoms:** Worker returns 1102 error code, logs show "CPU time limit exceeded"
**Detection Rule:** If logs contain "exceeded CPU time" or status 1102 responses
**Root Cause:** Synchronous operations blocking event loop (JSON parsing large payloads, complex loops)
**Fix:** 
1. Profile with `console.time()` to find bottlenecks
2. Stream large JSON parsing: `response.json()` → `ReadableStream`
3. Break loops with `await scheduler.wait(0)` every 1000 iterations
4. Cache expensive calculations in KV

### KV Inconsistency Race
**Symptoms:** Stale data returned immediately after writes, cache "flapping" between values
**Detection Rule:** If read-after-write returns old value or cache hit rate drops unexpectedly
**Root Cause:** Reading KV immediately after write hits different edge nodes
**Fix:**
1. Never read KV immediately after write for validation
2. Return the value you just wrote: `await kv.put(key, data); return data;`
3. For consistency needs, use Durable Objects instead
4. Add `X-Cache-Status` header to debug cache behavior

### Rate Limit Race Condition
**Symptoms:** Users get inconsistent rate limit responses, some bypass limits under load
**Detection Rule:** If rate limit counters drift from expected values or users report sporadic 429s
**Root Cause:** Multiple concurrent requests increment counter simultaneously
**Fix:**
1. Use atomic increment pattern with KV metadata versioning
2. Implement jitter: random 10-50ms delay before rate limit check
3. Add circuit breaker: if KV fails, allow request but log for monitoring
4. Use Durable Objects for strict rate limiting on critical endpoints

### CORS Preflight Failure
**Symptoms:** Browser requests work in dev but fail in production, OPTIONS returns 404
**Detection Rule:** If seeing "CORS policy" errors in browser console or 404s on OPTIONS requests
**Root Cause:** Missing OPTIONS handler in route logic
**Fix:**
1. Add explicit OPTIONS handler before all other routes
2. Return 204 status with proper CORS headers
3. Include all HTTP methods your API supports in Allow-Methods header
4. Test with browser DevTools Network tab to verify preflight

### Background Task Abandonment
**Symptoms:** Cache updates don't happen, cleanup tasks never run, inconsistent state
**Detection Rule:** If cache miss rates increase or background metrics stop updating
**Root Cause:** Using `await` instead of `ctx.waitUntil()` for background work
**Fix:**
1. Wrap all background tasks in `ctx.waitUntil()`
2. Add logging inside background tasks to verify execution
3. Set reasonable timeouts for background work (< 30s)
4. Use scheduled triggers for critical maintenance tasks

## WORKED EXAMPLES

### Building a Location-Based Meeting Cache

**Scenario:** API needs to cache meeting data by geographic region with sub-second response times.

**Step 1: Service Selection Decision**
- Need real-time consistency? NO (eventual consistency acceptable for meeting data)
- Need fast reads? YES → Choose KV
- Geographic scope? Metro area (50km) → Use 3-character geohash

**Step 2: Implementation**
```typescript
async function getMeetings(lat: number, lng: number, env: Env, ctx: ExecutionContext) {
  // 3-char geohash for ~150km cells (metro coverage)
  const geohash = Geohash.encode(lat, lng, 3);
  const cacheKey = `meetings:${geohash}`;
  
  // Check cache first
  const cached = await env.MEETING_CACHE.get(cacheKey, 'json');
  if (cached) {
    return { data: cached, source: 'cache', geohash };
  }
  
  // Cache miss - fetch fresh data
  const meetings = await fetchFromAPI(lat, lng);
  
  // Background cache update (non-blocking)
  ctx.waitUntil(
    env.MEETING_CACHE.put(cacheKey, JSON.stringify(meetings), {
      expirationTtl: 3600, // 1 hour TTL for meeting data
      metadata: { cachedAt: Date.now(), coords: `${lat},${lng}` }
    })
  );
  
  return { data: meetings, source: 'api', geohash };
}
```

**Expert vs Novice Decision Points:**
- **Novice:** Uses exact coordinates as cache key → Low hit rate
- **Expert:** Uses geohash for geographic bucketing → High hit rate across nearby requests
- **Novice:** Awaits cache write → Slower response times  
- **Expert:** Background cache write with waitUntil → Fast responses

**Step 3: Rate Limiting Integration**
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // Check rate limit first (fail fast)
    const rateCheck = await checkRateLimit(ip, env, { maxRequests: 100, windowSeconds: 3600 });
    if (!rateCheck.allowed) {
      return new Response('Rate limited', { status: 429 });
    }
    
    // Process request
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') || '0');
    const lng = parseFloat(url.searchParams.get('lng') || '0');
    
    const result = await getMeetings(lat, lng, env, ctx);
    
    return new Response(JSON.stringify(result.data), {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': result.source,
        'X-Geohash': result.geohash,
        'X-RateLimit-Remaining': rateCheck.remaining.toString()
      }
    });
  }
};
```

## QUALITY GATES

**Deployment Readiness Checklist:**

- [ ] TTL Strategy Defined: All KV operations have appropriate expirationTtl values (3600s for dynamic, 86400s for config)
- [ ] Origin Validation: Worker validates all external API responses and handles timeout/error cases with proper fallbacks
- [ ] Secret Rotation Ready: All secrets use `wrangler secret put`, no hardcoded values in wrangler.toml or code
- [ ] Latency Targets Met: P95 response time < 200ms for cached responses, < 2s for cache misses (verified via `wrangler tail`)
- [ ] CORS Complete: OPTIONS preflight handler returns 204 with all required headers, tested in browser DevTools
- [ ] Rate Limits Configured: IP-based rate limiting active with appropriate limits per endpoint and proper 429 responses
- [ ] Error Handling: All external fetch calls wrapped in try/catch with timeout, proper HTTP status codes returned
- [ ] Background Tasks: All cache updates and cleanup use `ctx.waitUntil()`, no blocking operations in response path
- [ ] Monitoring Ready: Log structured data for cache hit rates, error counts, and performance metrics
- [ ] Environment Parity: Staging environment mirrors production KV namespaces and secret configurations

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**

- **Cloudflare Pages deployment** → Use `static-site-deployment` skill instead
- **DNS record management** → Use `cloudflare-dns-management` skill instead  
- **CDN/proxy-only configuration** → Use `cloudflare-cdn-config` skill instead
- **Workers AI/Vectorize** → Use `ai-integration` skill instead
- **Large file processing (>100MB)** → Use `batch-processing` skill with external storage
- **Long-running tasks (>30s CPU)** → Use `background-job-processing` skill instead
- **Complex SQL operations** → Use `database-optimization` skill with dedicated DB
- **Email sending** → Use `email-service-integration` skill instead

**Delegate when:**
- Static site needs deployment → Pages handles build/deploy pipeline better
- Complex database queries needed → D1 has SQL limitations, use external Postgres/MySQL
- Heavy computation required → Workers have CPU limits, use dedicated compute instances
- File uploads > 100MB → Use R2 direct upload patterns, not through Worker