---
name: outbox-pattern-implementation
description: 'Use when you need to publish a message to Kafka / RabbitMQ / SNS atomically with a database commit, when fixing the dual-write hazard between DB and broker, deciding between polling-publisher and CDC (Debezium) relay, designing the outbox schema, handling at-least-once / idempotency on the consumer, or pruning a high-volume outbox table. Triggers: dual write, "we updated the DB but the event never published", outbox/inbox pattern, Debezium connector, EventRouter SMT, aggregate_type / aggregate_id, at-least-once with idempotent consumer, outbox table partitioning. NOT for receiver-side webhook handling, sagas/Temporal as orchestration, log-based event sourcing as the source of truth, or Kafka producer tuning generally.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - outbox
  - cdc
  - debezium
  - kafka
  - postgres
  - distributed-systems
---

# Outbox Pattern Implementation

The outbox pattern is the answer to one specific failure mode: **a service updates its database AND publishes a message, and only one of them succeeds.** Without the pattern, the database and the broker silently disagree forever; with it, the message publish becomes part of the same transaction as the row write, and a separate relay propagates it.

The two components are unchanging:

```
1. Outbox table.   Application writes business rows AND a row to outbox in ONE transaction.
2. Relay.          Separate process reads outbox, publishes to broker, marks row as published (or deletes it).
```

The relay can be **polling** (read the table, publish, delete; simple, works anywhere, adds 100ms+ latency) or **CDC** (Debezium tails the WAL/binlog, publishes near-instantly; more infrastructure, sub-second). ([Conduktor — *Transactional Outbox*][conduktor-outbox], [Debezium blog — *Reliable Microservices Data Exchange*][debezium-outbox])

The delivery guarantee is **at-least-once**, always — the relay can publish then crash before deleting; on restart it'll publish again. Consumers MUST be idempotent. ([conduktor-outbox])

**Jump to your fire:**
- "We lost an event between DB and Kafka" → [The dual-write hazard](#the-dual-write-hazard)
- Outbox table schema → [Canonical outbox schema](#canonical-outbox-schema)
- Polling relay vs CDC → [Choosing the relay](#choosing-the-relay)
- Outbox table getting huge → [Pruning strategy](#pruning-strategy)
- Consumer needs to dedupe → [Consumer idempotency](#consumer-idempotency)
- "Should we just use Kafka transactions?" → [When NOT to use the outbox](#when-not-to-use-the-outbox-pattern)
- Multi-service inbox-on-the-other-side → [Inbox pattern](#inbox-pattern)

## When to use

- A service writes to its own DB and must reliably publish a corresponding event.
- You've seen the "DB committed but the event never went out" bug at least once.
- Migrating off a dual-write pattern (`db.commit(); broker.publish();`) that you've discovered isn't atomic.
- Building any event-driven microservice that owns its data.
- The application can't tolerate the message being lost OR published twice unless the consumer dedupes.

## Core capabilities

### The dual-write hazard

```ts
// THE BUG.
async function placeOrder(order) {
  await db.insert('orders', order);          // commit 1: DB
  await kafka.publish('orders.placed', order);  // commit 2: broker
  // What if the process dies between these two? Or the broker is down?
  // The DB has the order, but no event was emitted. Downstream services have no idea.
}
```

There is no two-phase commit between Postgres and Kafka that's actually used in production. The fix isn't a smarter `try/catch`; it's removing the second commit:

```ts
// THE FIX.
async function placeOrder(order) {
  await db.transaction(async (tx) => {
    await tx.insert('orders', order);
    await tx.insert('outbox', {                 // SAME transaction.
      aggregate_type: 'order',
      aggregate_id: order.id,
      event_type: 'orders.placed',
      payload: JSON.stringify(order),
    });
  });
  // Both rows commit together, or neither does. The relay handles the rest.
}
```

The application is now done. A separate process reads `outbox` and publishes to Kafka. If the process is down, events queue in the table; when it recovers, it catches up.

### Canonical outbox schema

Debezium and the surrounding ecosystem have converged on this shape: ([conduktor-outbox], [Debezium — *EventRouter SMT*][debezium-eventrouter])

```sql
CREATE TABLE outbox (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type  VARCHAR(255) NOT NULL,   -- → routes to Kafka topic (e.g. "order")
  aggregate_id    VARCHAR(255) NOT NULL,   -- → Kafka message key (e.g. "ord_42")
  event_type      VARCHAR(255) NOT NULL,   -- e.g. "orders.placed", "orders.canceled"
  payload         JSONB        NOT NULL,   -- event body
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  -- For polling relay only:
  published_at    TIMESTAMPTZ,             -- NULL = unpublished
  -- Optional headers:
  trace_id        VARCHAR(64)              -- for distributed tracing correlation
);

-- Polling relay needs an index on the unpublished tail.
CREATE INDEX idx_outbox_unpublished
  ON outbox (created_at) WHERE published_at IS NULL;
```

Debezium's `EventRouter` SMT reads the row and produces a Kafka message where:
- The topic is derived from `aggregate_type` (`order` → topic `outbox.event.order`).
- The Kafka message key is `aggregate_id` (so all events for one aggregate hit the same partition, preserving order).
- The Kafka message value is `payload`.
- Headers can carry `event_type`, `trace_id`, etc. ([debezium-eventrouter])

### Choosing the relay

**Polling-publisher:**

```sql
-- Relay's main loop, atomic with FOR UPDATE SKIP LOCKED so multiple relay instances coexist.
WITH next AS (
  SELECT id, aggregate_type, aggregate_id, event_type, payload
  FROM outbox
  WHERE published_at IS NULL
  ORDER BY created_at
  LIMIT 100
  FOR UPDATE SKIP LOCKED
)
UPDATE outbox SET published_at = NOW()
WHERE id IN (SELECT id FROM next)
RETURNING *;
-- Then publish each row to Kafka. If publish fails, the txn rolls back; row reappears unpublished.
```

```
Pros: simple, works on any DB, no extra infrastructure, easy to reason about.
Cons: polling adds 100ms–seconds of latency; ordering across aggregates depends on poll ordering.
Use when: you don't have a Debezium-shaped infra footprint, latency tolerance is generous.
```

**CDC (Debezium) relay:**

```yaml
# Debezium PostgreSQL connector + Outbox SMT
{
  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
  "database.hostname": "postgres",
  "database.dbname": "orders",
  "table.include.list": "public.outbox",
  "transforms": "outbox",
  "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
  "transforms.outbox.route.topic.replacement": "outbox.event.${routedByValue}",
  "transforms.outbox.table.expand.json.payload": "true"
}
```

```
Pros: sub-second latency, zero polling overhead, ordering preserved by WAL/binlog order.
Cons: you now run Debezium + Kafka Connect; logical replication slot to manage; one bad consumer
      can stall the slot and grow Postgres WAL.
Use when: you already have Kafka Connect, latency matters, throughput is high.
```

### Pruning strategy

The outbox table grows. Don't let it become a multi-billion-row monster:

```sql
-- Approach 1: drop after publish (simplest, polling relay only).
DELETE FROM outbox WHERE id = $1;   -- after successful publish

-- Approach 2: keep for a few hours then drop, supports replay / debugging.
DELETE FROM outbox
WHERE published_at IS NOT NULL AND published_at < NOW() - INTERVAL '24 hours';

-- Approach 3 (recommended for high-volume): time-partitioning.
CREATE TABLE outbox (
  ... ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE outbox_2026_05 PARTITION OF outbox
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

-- Drop a whole month in O(1).
DROP TABLE outbox_2026_01;
```

Conduktor's recommendation for high volume: *"Drop entire partitions: instant, no row-by-row delete."* ([conduktor-outbox]) Combine with `pg_partman` for automatic monthly partition creation/drop.

For Debezium, the row can be deleted immediately after the WAL captures it — Debezium has already consumed the event. Some teams keep a short retention window (1–24h) for debugging.

### Consumer idempotency

At-least-once delivery means the consumer **will** see the same event twice some day:

```ts
// Idempotency at the consumer side.
async function handleOrderPlaced(event) {
  const inserted = await db.queryOne(
    `INSERT INTO processed_events (event_id, source) VALUES ($1, 'orders.outbox')
     ON CONFLICT DO NOTHING RETURNING event_id`,
    [event.id]
  );
  if (!inserted) return { skipped: 'duplicate' };

  // First time. Do the work in the same transaction.
  await db.update('inventory', { product_id: event.product_id }, {
    reserved: db.raw('reserved + ?', [event.quantity])
  });
  // Both rows commit together; if the side-effect fails, the dedup row rolls back, retry safe.
}
```

This is the same pattern as `webhook-receiver-design`, `background-job-queue-design`, and the dual-writes pattern in `zero-downtime-database-migration`. **The DB unique constraint IS your idempotency primitive.** Don't use Redis for this.

### Inbox pattern

The receiver-side mirror. Same shape, opposite direction:

```sql
CREATE TABLE inbox (
  message_id   VARCHAR(255) PRIMARY KEY,   -- broker's message ID, dedup key
  source       VARCHAR(255) NOT NULL,
  payload      JSONB NOT NULL,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

```ts
async function consume(msg) {
  await db.transaction(async (tx) => {
    const inserted = await tx.queryOne(
      `INSERT INTO inbox (message_id, source, payload) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING RETURNING message_id`,
      [msg.id, msg.source, msg.payload]
    );
    if (!inserted) return;   // already processed
    await applySideEffects(tx, msg);
    await tx.update('inbox', { message_id: msg.id }, { processed_at: new Date() });
  });
}
```

Outbox + inbox together is the canonical pattern for reliable cross-service messaging without distributed transactions.

### When NOT to use the outbox pattern

- **Kafka EOS within Kafka.** If your write IS to Kafka and your downstream IS Kafka (no DB in the middle), Kafka transactions / idempotent producer give you exactly-once *within Kafka*. Outbox solves DB-to-Kafka, not Kafka-to-Kafka.
- **Read-only services.** If you don't write, you don't dual-write.
- **Sagas / orchestrated workflows.** Use Temporal or a saga framework — different abstraction (workflow steps with retries are first-class). See `background-job-queue-design`.
- **Event sourcing.** Your event log IS the source of truth; there's no separate "DB row" to keep in sync.
- **Simple "fire and forget" events** with low business cost if lost. Outbox is overhead; pick it for important state changes.

### Multi-aggregate transactions

```ts
// Multiple aggregates in one transaction → multiple outbox rows.
await db.transaction(async (tx) => {
  await tx.insert('orders', order);
  await tx.update('inventory', { product_id }, { reserved: db.raw('reserved + ?', [qty]) });
  await tx.insert('outbox', { aggregate_type: 'order', aggregate_id: order.id, event_type: 'orders.placed', payload: JSON.stringify(order) });
  await tx.insert('outbox', { aggregate_type: 'inventory', aggregate_id: product_id, event_type: 'inventory.reserved', payload: JSON.stringify({ product_id, qty }) });
});
// Both events publish to their own topics with their own keys. Order preserved per aggregate.
```

### Tracing across the boundary

Pass `trace_id` in the outbox row so consumers can join their span back to the producer:

```ts
await tx.insert('outbox', {
  ..., trace_id: currentSpan().spanContext().traceId
});
```

Consumer extracts and creates a follower span. See `opentelemetry-instrumentation`.

## Anti-patterns

### Publishing first, writing second

**Symptom:** Sometimes events fire for orders that don't exist.
**Diagnosis:** `kafka.publish(...)` succeeded, then `db.insert(...)` failed and the transaction rolled back.
**Fix:** Outbox pattern. Never publish before the DB commit succeeds.

### `db.commit(); broker.publish();`

**Symptom:** Eventually the broker is unreachable for a few seconds, the DB row exists but the event was never published. Downstream is permanently inconsistent.
**Diagnosis:** Two non-transactional steps; no recovery if the second fails.
**Fix:** Outbox + relay. The publish-failure becomes a retry, not a missing event.

### Polling without `SKIP LOCKED`

**Symptom:** Two relay instances try to claim the same rows; deadlocks under load.
**Diagnosis:** `FOR UPDATE` blocks; without `SKIP LOCKED` they queue.
**Fix:** `FOR UPDATE SKIP LOCKED` so each instance grabs a different chunk.

### Outbox table without index on unpublished

**Symptom:** Polling relay does a sequential scan over millions of historical rows on every poll.
**Diagnosis:** Index on `(created_at)` exists, but doesn't filter by `published_at IS NULL`.
**Fix:** Partial index: `CREATE INDEX ... WHERE published_at IS NULL`. The unpublished set stays small.

### Consumer that isn't idempotent

**Symptom:** Duplicate side effects (charged twice, two emails) when the relay or broker retries.
**Diagnosis:** Consumer trusts that each delivery is unique. At-least-once means it isn't.
**Fix:** `processed_events` table with unique constraint on `(event_id, source)`; insert-then-handle pattern.

### Letting the outbox grow forever

**Symptom:** Postgres tablespace blows up; backups take 4 hours.
**Diagnosis:** No prune.
**Fix:** Time-partition + drop old partitions; or DELETE old rows on a schedule. ([conduktor-outbox])

### CDC slot starved by a stuck consumer

**Symptom:** Postgres WAL grows unbounded; replica lag climbs; eventually disk full.
**Diagnosis:** Debezium's logical replication slot has fallen behind because the consumer is stuck or down. WAL can't be pruned past the slot's position.
**Fix:** Monitor `pg_replication_slots.confirmed_flush_lsn`; alert on slot lag. If a consumer is dead, drop the slot and re-bootstrap.

### Outbox row written outside the transaction

**Symptom:** Looks fine in code review; rare but real cases where the DB row exists and outbox doesn't (or vice versa).
**Diagnosis:** Outbox insert is outside `db.transaction(...)` — separate connection, separate commit.
**Fix:** Pass the transaction object to all writes. CI grep for `outbox` writes outside `db.transaction`.

## Quality gates

- [ ] **Test:** chaos test — kill the relay mid-publish; assert events eventually propagate, no duplicates.
- [ ] **Test:** kill the producer service mid-transaction; assert no partial state (DB row without outbox row, or vice versa).
- [ ] **Test:** consumer is idempotent — replay 100 events twice, assert side effects unchanged (DB-level dedup table verified).
- [ ] Outbox table schema matches the canonical shape (`id`, `aggregate_type`, `aggregate_id`, `event_type`, `payload`, `created_at`).
- [ ] Outbox INSERTs are always inside the same transaction as the business write. CI grep / static analysis enforces.
- [ ] Polling relay (if used) uses `FOR UPDATE SKIP LOCKED` and a partial index on unpublished rows.
- [ ] CDC relay (if used) monitors `pg_replication_slots` lag; alerts on slot stall.
- [ ] Outbox table has a prune strategy: time-partitioning + scheduled `DROP TABLE`, or scheduled DELETE of published rows older than N hours.
- [ ] Consumer dedup table has unique constraint on `(event_id, source)`; idempotency proven by replay test.
- [ ] OTel tracing: `trace_id` passed in outbox row; consumer joins follower span (see `opentelemetry-instrumentation`).
- [ ] Lag metric exported: `outbox_unpublished_count`, `outbox_oldest_unpublished_age_seconds`. Alert at thresholds (`grafana-dashboard-builder`).
- [ ] Documented per-aggregate-type topic mapping; new event types have a documented producer + consumer + lifecycle.

## NOT for

- **Receiver-side webhook handling** — adjacent shape, but signed third-party deliveries are different. → `webhook-receiver-design`.
- **Sagas / Temporal workflows** — outbox is durable single-event publish; sagas are durable multi-step orchestration. → `background-job-queue-design` for queue/workflow choice.
- **Event sourcing** — log is the truth; there's no separate state to sync.
- **Kafka producer tuning generally** (acks=all, idempotent producer, EOS) — adjacent topic, different scope.
- **Inbox pattern** is covered briefly here but warrants a dedicated treatment for high-volume consumers.
- **DB migrations / schema evolution of the outbox table itself** — → `zero-downtime-database-migration`.

## Sources

- Debezium — *Reliable Microservices Data Exchange With the Outbox Pattern* (canonical writeup; `aggregate_type` / `aggregate_id` / `payload` schema). [debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/][debezium-outbox]
- Debezium — *Outbox Event Router (SMT)* (EventRouter routing by `aggregate_type` to topic, key from `aggregate_id`). [debezium.io/documentation/reference/transformations/outbox-event-router.html][debezium-eventrouter]
- Conduktor — *Transactional Outbox: Database-Kafka Consistency* (polling vs CDC comparison; partition-based pruning; at-least-once explanation). [conduktor.io/blog/transactional-outbox-pattern-database-kafka][conduktor-outbox]
- Streamkap — *The Outbox Pattern Explained* (sub-second CDC latency, ordering guarantees from WAL). [streamkap.com/resources-and-guides/outbox-pattern-explained][streamkap-outbox]
- Microservices.io — *Pattern: Transactional outbox*. [microservices.io/patterns/data/transactional-outbox.html][microservicesio-outbox]
- SeatGeek Engineering — *The Transactional Outbox Pattern: Transforming Real-Time Data Distribution at SeatGeek*. [chairnerd.seatgeek.com/transactional-outbox-pattern/][seatgeek-outbox]

[debezium-outbox]: https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/
[debezium-eventrouter]: https://debezium.io/documentation/reference/transformations/outbox-event-router.html
[conduktor-outbox]: https://www.conduktor.io/blog/transactional-outbox-pattern-database-kafka
[streamkap-outbox]: https://streamkap.com/resources-and-guides/outbox-pattern-explained
[microservicesio-outbox]: https://microservices.io/patterns/data/transactional-outbox.html
[seatgeek-outbox]: https://chairnerd.seatgeek.com/transactional-outbox-pattern/
