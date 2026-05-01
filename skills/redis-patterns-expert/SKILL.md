---
name: redis-patterns-expert
description: 'Use when designing caching strategies (cache-aside, write-through, write-behind), implementing distributed locks, building rate limiters, leaderboards, real-time streams (XADD/consumer groups), pub/sub, or tuning eviction policies. Triggers: thundering-herd on cache miss, dogpile on key expiry, Redlock vs SET-NX-PX choice, sliding-window rate limiter, hot-key on a single cluster slot, big-key blowup, MULTI/EXEC across slots, KEYS in production. NOT for Redis Cluster operations/admin (different domain), embedded KV (SQLite, leveldb), in-process LRU caches, or Memcached.'
category: Backend & Infrastructure
tags:
  - redis
  - caching
  - rate-limiting
  - distributed-locks
  - streams
  - sorted-sets
---

# Redis Patterns Expert

Redis is a data-structure server. The interesting part isn't the commands — it's the patterns. Most of the trouble comes from treating Redis as a database when you should treat it as a coordination primitive, or vice versa.

## When to use

- Adding a cache layer in front of a slow data source.
- Need a distributed lock (single-leader election, mutual exclusion).
- Rate limiting an API by user/IP/key.
- Real-time leaderboards or sorted feeds.
- Event streams (XADD/XREAD with consumer groups) for multi-consumer durable queues.
- Pub/sub for notifications (best-effort, single delivery attempt).

## Core capabilities

### Caching strategies

**Cache-aside** (most common):

```ts
async function getUser(id: string) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  const fresh = await db.users.findById(id);
  // SET with EX in one command — never SET then EXPIRE.
  await redis.set(`user:${id}`, JSON.stringify(fresh), 'EX', 300 + Math.floor(Math.random() * 60));
  return fresh;
}
```

The `+ random()` jitter prevents the dogpile when many keys expire together. Without it, every cache key set during a deploy expires within the same minute 5 minutes later → thundering herd.

**Stale-while-revalidate** with a soft + hard TTL:

```ts
const SOFT = 300, HARD = 600;
const entry = await redis.get(key);
if (entry) {
  const { value, mtime } = JSON.parse(entry);
  if (Date.now() - mtime < SOFT * 1000) return value;
  // Stale but valid — refresh in background, return cached.
  void refresh(key);
  return value;
}
// No entry — block on origin.
```

**Single-flight** — collapse concurrent regeneration to one origin call:

```ts
async function getUserSingleflight(id: string) {
  const cacheKey = `user:${id}`;
  const lockKey  = `user:${id}:lock`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const lockAcquired = await redis.set(lockKey, '1', 'NX', 'EX', 5);
  if (!lockAcquired) {
    // Someone else is fetching. Sleep + retry the cache.
    await sleep(50);
    return getUserSingleflight(id);
  }
  try {
    const fresh = await db.users.findById(id);
    await redis.set(cacheKey, JSON.stringify(fresh), 'EX', 300);
    return fresh;
  } finally {
    await redis.del(lockKey);
  }
}
```

### Distributed locks

Single-instance Redis lock with safe release:

```lua
-- release.lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
else
  return 0
end
```

```ts
const token = crypto.randomUUID();
const acquired = await redis.set(lockKey, token, 'NX', 'PX', leaseMs);
if (!acquired) throw new Error('lock not acquired');
try {
  // ... critical section, must complete before leaseMs ...
} finally {
  await redis.eval(releaseScript, 1, lockKey, token);
}
```

The token prevents you from releasing someone else's lock if your work overran the lease. Don't use `GET + DEL` separately — that's a TOCTOU race.

Redlock (multi-instance) is contentious; for most applications a single Redis primary with a finite lease is fine. If you need stronger guarantees, use a real consensus system (etcd, Consul).

### Rate limiting — sliding window with Lua

```lua
-- sliding-window.lua
-- KEYS[1] = bucket key  ARGV[1] = window seconds  ARGV[2] = limit  ARGV[3] = now-ms
local now = tonumber(ARGV[3])
local window = tonumber(ARGV[1]) * 1000
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, now - window)
local count = redis.call('ZCARD', KEYS[1])
if count >= tonumber(ARGV[2]) then
  return 0
end
redis.call('ZADD', KEYS[1], now, now)
redis.call('PEXPIRE', KEYS[1], window)
return 1
```

Token bucket is cheaper if you can tolerate burstiness; sliding window is fairer.

### Sorted sets — leaderboards and time-series

```ts
// Top scorers
await redis.zincrby('game:scores', points, userId);
await redis.zrevrange('game:scores', 0, 9, 'WITHSCORES');

// Time-series with score = epoch
await redis.zadd('user:42:events', Date.now(), JSON.stringify(event));
await redis.zrangebyscore('user:42:events', Date.now() - 3600_000, '+inf');

// Cap to last 1000 events
await redis.zremrangebyrank('user:42:events', 0, -1001);
```

### Streams + consumer groups

Durable queue with multiple consumers and at-least-once delivery:

```ts
// Producer
await redis.xadd('jobs', '*', 'type', 'send_email', 'to', user.email);

// One-time setup
await redis.xgroup('CREATE', 'jobs', 'workers', '$', 'MKSTREAM');

// Consumer
const messages = await redis.xreadgroup(
  'GROUP', 'workers', `worker-${pid}`,
  'COUNT', 10, 'BLOCK', 5000,
  'STREAMS', 'jobs', '>',
);
for (const [stream, entries] of messages ?? []) {
  for (const [id, fields] of entries) {
    try {
      await handle(fields);
      await redis.xack('jobs', 'workers', id);
    } catch {
      // No XACK → message stays in the PEL (pending entries list).
    }
  }
}

// Reclaim work from a crashed peer
const pending = await redis.xpending('jobs', 'workers', 'IDLE', 60000, '-', '+', 100);
for (const { id } of pending) {
  await redis.xclaim('jobs', 'workers', `worker-${pid}`, 60000, id);
}

// Cap stream growth
await redis.xadd('jobs', 'MAXLEN', '~', 100000, '*', ...fields);
```

The `~` makes MAXLEN approximate (cheaper). PEL is your story for poison messages — set a max-deliveries threshold and dead-letter beyond it.

### Pub/sub

```ts
const sub = redis.duplicate(); // SUBSCRIBE blocks the connection
await sub.subscribe('user-events');
sub.on('message', (channel, payload) => handle(JSON.parse(payload)));

await redis.publish('user-events', JSON.stringify({ userId, kind: 'login' }));
```

At-most-once delivery; subscribers offline at publish time miss the message. For durable jobs, use Streams.

### Lua scripts

`EVAL` ships the script every time; `EVALSHA` after `SCRIPT LOAD` is faster. Atomic — the whole script runs without other clients interleaving. KEYS are passed for cluster routing; non-key arguments go in ARGV. Cluster requires all KEYS to live on the same slot — use hash tags `{user:42}` for related keys.

### Eviction policies

```
maxmemory                100mb
maxmemory-policy         allkeys-lru
```

| Policy | When to use |
|--------|-------------|
| `noeviction` | Redis as durable store (you should be using a real DB). |
| `allkeys-lru` | Pure cache. |
| `allkeys-lfu` | Cache where some keys are hot for a long time. |
| `volatile-lru` | Mixed: some keys must persist (no TTL), evict only TTL'd ones. |
| `volatile-ttl` | Evict shortest-TTL first; useful for staged data. |

## Anti-patterns

### KEYS in production

**Symptom:** Latency spikes correlate with admin commands.
**Diagnosis:** `KEYS *` blocks the server while it scans every key.
**Fix:** `SCAN` cursor-based iteration. For Cluster, scan each shard.

### `DEL` on a 10M-item structure

**Symptom:** Single command takes seconds; replicas lag; clients time out.
**Diagnosis:** `DEL` is synchronous in the main thread.
**Fix:** `UNLINK` (non-blocking, async free). For sorted sets, batch via `ZSCAN` + `ZREM` chunks.

### `SET` then `EXPIRE`

**Symptom:** Occasional keys with no TTL.
**Diagnosis:** Crash between SET and EXPIRE leaves the key forever.
**Fix:** `SET key val EX seconds` in one command.

### Big-key OOM

**Symptom:** Single hash >1M fields; replication breaks; OOM on restart.
**Diagnosis:** Unbounded growth — usually session data or user-item maps.
**Fix:** Shard by user prefix (`session:abc:user:42`), or move to a sorted-set + TTL pattern.

### Pub/sub for durable jobs

**Symptom:** Workers restart, miss the work, customer support tickets.
**Diagnosis:** Pub/sub is at-most-once. Subscribers offline at publish lose the message.
**Fix:** Use Streams + consumer groups. Always.

### Hot-key on a single cluster slot

**Symptom:** One node CPU at 100%, others idle.
**Diagnosis:** Cache key collision → all reads on one slot.
**Fix:** Add a per-key salt or shard the key (`user:42:cache:0`, `…:1`) and randomize reads.

## Quality gates

- [ ] No `KEYS` in production code (verify by linter or grep).
- [ ] Every cache key has TTL with jitter (5-15% randomization).
- [ ] Distributed locks use ownership tokens; release is via Lua script.
- [ ] Stream consumers handle XPENDING reclaim from crashed peers.
- [ ] Streams capped with `MAXLEN ~ N`.
- [ ] `maxmemory` and `maxmemory-policy` set explicitly per-environment.
- [ ] Big collections sharded by some key prefix; no unbounded growth.
- [ ] Pub/sub used only for ephemeral notifications, never durable jobs.
- [ ] `UNLINK` over `DEL` for any structure with thousands of items.

## NOT for

- **Redis Cluster admin/operations** — failover, slot migration, persistence tuning is a separate skill (no dedicated skill yet).
- **Webhook receiver dedup keyed in Redis** — Redis is fragile for idempotency. → `webhook-receiver-design` (use a DB unique constraint instead).
- **Embedded KV stores** (SQLite, leveldb, RocksDB) — different consistency model.
- **In-process LRU** (`lru-cache` npm) — single-node, no shared state.
- **Memcached** — fewer data structures, simpler semantics.
- **DragonflyDB / KeyDB** — Redis-compatible but with different operational characteristics.
