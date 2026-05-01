---
name: zero-downtime-database-migration
description: 'Use when changing schema on a live production database without dropping traffic, doing expand/contract migrations, backfilling new columns on million-plus-row tables, dual-writing across schemas, renaming a hot column, splitting a table, or adding a foreign key to a big table. Triggers: ALTER TABLE locks the world, "must be removed in a separate deploy", expand-contract-cleanup phases, NOT NULL on populated column, foreign-key add on big table, dropping a column still read by old replicas, lock_timeout choice, gh-ost vs pt-online-schema-change. NOT for greenfield schema design, ORM-managed migration mechanics (Prisma/Drizzle), D1/Supabase CLI quirks, or NoSQL document migrations.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - database
  - migration
  - postgres
  - mysql
  - zero-downtime
  - expand-contract
---

# Zero-Downtime Database Migration

A schema change on a live production database is three changes happening at once: a deploy, a backfill, and a contract update between code and storage. The job is to never have a moment where the database and the running code disagree on what's required. The shape that always works — and Stripe explicitly names this pattern — is the **4-step dual-writes** sequence: dual write → change reads → reverse writes → remove old. ([Stripe Engineering — *Online migrations at scale*][stripe-online-migrations]) The sibling community framing is **expand → migrate → contract**. ([Pete Hodgson — *Expand/Contract*][hodgson-expand-contract]) Three deploys minimum. There is no shortcut that's safe under traffic.

**Jump to your fire:**
- ALTER TABLE locks reads and writes for minutes → [Lock levels and the lock queue](#lock-levels-and-the-lock-queue)
- Need to add a NOT NULL column → [Add column safely (pg11+)](#add-column-safely-pg11)
- Need to add an index without an outage → [CREATE INDEX CONCURRENTLY](#create-index-concurrently)
- Foreign-key add timing out → [FK add in two steps (NOT VALID then VALIDATE)](#fk-add-in-two-steps)
- Need to rename a hot column → [Rename via expand/contract](#rename-via-expand-contract)
- Backfill is dragging replication lag up → [Backfill in batches](#backfill-in-batches)
- App version N can't read what version N+1 writes → [Dual-writes pattern](#dual-writes-pattern)
- Postgres vs MySQL tooling choice → [MySQL: gh-ost vs pt-online-schema-change](#mysql-gh-ost-vs-pt-online-schema-change)

## When to use

- Live database with traffic; downtime windows are not an option (or are limited to seconds, not minutes).
- Renaming, splitting, or merging columns/tables that are read by hot paths.
- Adding a NOT NULL column to a table with existing rows.
- Changing a column type (`int` → `bigint` when you're approaching 2.1B rows).
- Adding a foreign key to a populated big table.
- Migrating data between two schemas during a service split.

## Core capabilities

### Lock levels and the lock queue

Most `ALTER TABLE` statements take an **`ACCESS EXCLUSIVE`** lock — the strongest Postgres has, conflicting with every other lock type including the `ACCESS SHARE` that plain `SELECT` takes. ([Postgres — *Explicit Locking*][pg-explicit-locking]) The non-obvious failure mode is the *lock queue*: if your DDL waits behind a long-running transaction, every subsequent `SELECT` and `UPDATE` queues behind your DDL — the table is effectively dark for reads and writes until your statement either acquires the lock or fails. ([Xata — *Schema changes and the Postgres lock queue*][xata-lock-queue])

The standard mitigation pair, recommended by both pganalyze-style operational guides and Xata's writeup:

```sql
SET lock_timeout = '2s';
SET statement_timeout = '60s';

BEGIN;
ALTER TABLE orders ADD COLUMN refund_reason TEXT;
COMMIT;
```

A short `lock_timeout` (commonly < 2s) bounds the damage if a long-running transaction is in front of you, then your migration runner retries with backoff. Never run migrations without `lock_timeout`. ([Xata][xata-lock-queue], [PostgresAI — *Zero-downtime Postgres schema migrations need this*][postgres-ai-lock-timeout])

A few `ALTER TABLE` forms take *weaker* locks — know them and prefer them where possible:

| Operation | Lock | Source |
|---|---|---|
| `ADD COLUMN` (no volatile DEFAULT, no rewrite) | Brief `ACCESS EXCLUSIVE` (metadata only) | [pg docs][pg-altertable] |
| `ADD CONSTRAINT … NOT VALID` | Brief `ACCESS EXCLUSIVE` (metadata only) | [pg docs][pg-altertable] |
| `VALIDATE CONSTRAINT` | `SHARE UPDATE EXCLUSIVE` (concurrent reads + writes OK) | [pg docs][pg-altertable] |
| `ADD FOREIGN KEY` (forces validation) | `SHARE ROW EXCLUSIVE` (weaker than `ACCESS EXCLUSIVE`) | [pg docs][pg-altertable] |
| `CREATE INDEX CONCURRENTLY` | No write lock; longer | [pg docs][pg-create-index] |
| `SET DATA TYPE` (binary-coercible, e.g. `text` ↔ `varchar`) | No table rewrite | [pg docs][pg-altertable] |

### Add column safely (pg11+)

In Postgres 11 and later, `ADD COLUMN` with a *non-volatile* `DEFAULT` no longer rewrites the table — the default is stored in metadata and returned when old rows are read. The Postgres docs spell this out explicitly: *"the default value is evaluated at the time of the statement and the result stored in the table's metadata… In neither case is a rewrite of the table required."* ([pg docs][pg-altertable])

```sql
-- pg11+: O(1), metadata-only.
ALTER TABLE orders
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
```

But this becomes a full rewrite if the default is **volatile** (`now()`, `clock_timestamp()`, `random()`), or if you ADD a stored generated column, an identity column, or a column with a constrained-domain type. ([pg docs][pg-altertable]) For those, do expand/backfill/contract.

There's also a subtle optimisation for `SET NOT NULL`: if a valid `CHECK (col IS NOT NULL)` constraint already exists, `ALTER COLUMN ... SET NOT NULL` skips the table scan. ([pg docs][pg-altertable]) Useful when you can't tolerate the scan but want the schema constraint.

### CREATE INDEX CONCURRENTLY

`CREATE INDEX` without `CONCURRENTLY` takes an `ACCESS EXCLUSIVE` lock — every read and write blocks until it finishes. On a 50M-row table that is an outage. `CONCURRENTLY` does the build without blocking writes; the cost is a longer build and an additional follow-up if the build aborts (the index is left `INVALID` and you must `DROP INDEX CONCURRENTLY` and retry). ([pg docs — *CREATE INDEX*][pg-create-index])

```sql
CREATE INDEX CONCURRENTLY idx_orders_status_created
  ON orders (status, created_at DESC);

-- If a prior attempt aborted:
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_status_created;
```

`CONCURRENTLY` cannot run inside a transaction block, which means most migration tools need a special path for it. Verify yours does.

### FK add in two steps

Adding a foreign key with the default behavior takes a brief `SHARE ROW EXCLUSIVE` lock but has to scan the table to validate every row — on big tables that scan is the outage. The two-step pattern:

```sql
-- Step 1: declare. Brief lock. No scan.
ALTER TABLE orders
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  NOT VALID;

-- Step 2: validate. Only SHARE UPDATE EXCLUSIVE — concurrent reads + writes still work.
ALTER TABLE orders VALIDATE CONSTRAINT fk_user;
```

Postgres's docs are explicit on the lock weaker than ACCESS EXCLUSIVE here: *"validation acquires only a SHARE UPDATE EXCLUSIVE lock on the table being altered."* ([pg docs][pg-altertable])

### Rename via expand/contract

```sql
-- DON'T: a single rename creates a window where some pods read the old name and fail.
ALTER TABLE users RENAME COLUMN nickname TO display_name;
```

Three deploys instead:

```sql
-- Deploy 1 (EXPAND): add the new column, app dual-writes, app reads OLD.
ALTER TABLE users ADD COLUMN display_name TEXT;
-- App code now writes BOTH nickname AND display_name on every update.

-- Backfill historical rows (batched, see below).
-- Deploy 2 (READ SWAP): app reads display_name, falls back to nickname if NULL.
-- Deploy 3 (CONTRACT): drop old column. Now safe — no pod reads it.
ALTER TABLE users DROP COLUMN nickname;
```

Stripe explicitly notes their version of this requires both code paths active and uses GitHub's Scientist library to compare results in production, alerting if the two paths diverge: *"Scientist is a Ruby library that allows you to run experiments and compare the results of two different code paths, alerting you if two expressions ever yield different results in production."* ([Stripe][stripe-online-migrations])

### Backfill in batches

```sql
-- WRONG: single statement; locks rows, blows up replication lag, can run for hours.
UPDATE big_table SET new_col = compute(old_col);

-- RIGHT: batched, advisory-locked, with sleep, traceable.
DO $$
DECLARE
  batch_size INT := 5000;
  rows_updated INT := 1;
BEGIN
  WHILE rows_updated > 0 LOOP
    UPDATE big_table SET new_col = compute(old_col)
    WHERE id IN (
      SELECT id FROM big_table
      WHERE new_col IS NULL
      LIMIT batch_size
      FOR UPDATE SKIP LOCKED  -- prevents two backfills from contending
    );
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    PERFORM pg_sleep(0.1);    -- give autovacuum + replication room
    COMMIT;
  END LOOP;
END $$;
```

Batches of 1k–10k. `FOR UPDATE SKIP LOCKED` lets two parallel backfills (or backfill + live writes) co-exist without deadlocks. The `pg_sleep` is non-negotiable on a high-write table — without it, replication lag climbs until your read replicas fall behind the SLO.

Stripe's account explicitly says they used MapReduce on Hadoop snapshots rather than querying production for the heaviest backfills: *"we use MapReduce to quickly process our data in an offline, distributed fashion."* ([Stripe][stripe-online-migrations]) For the petabyte-scale case, offline-then-replay-the-delta is the same idea at a different physical layer.

### Dual-writes pattern

Stripe's named 4-step pattern, paraphrased from their post: ([Stripe][stripe-online-migrations])

1. **Dual writing**: app writes to BOTH old and new schema on every mutation. Reads still go to OLD.
2. **Backfill**: copy historical rows into NEW. Verify (counts + sample diffs).
3. **Change all read paths**: app reads from NEW (still dual-writing). This is the moment Scientist-style verification matters most.
4. **Reverse the writes**: app writes only to NEW; remove dual-write. Then drop OLD.

```ts
// Phase 1 — dual write.
async function updateUser(id: string, displayName: string) {
  await db.transaction(async (tx) => {
    await tx.update('users', { id }, {
      nickname: displayName,        // OLD
      display_name: displayName,    // NEW
    });
  });
}

// Phase 3 — read swap, with fallback.
async function getUser(id: string) {
  const u = await db.select('users', { id });
  return { ...u, display_name: u.display_name ?? u.nickname };
}
```

Gate the dual-write itself behind a feature flag (see `feature-flag-rollout-strategist`). When something goes wrong mid-migration, you toggle dual-write off without redeploying.

### MySQL: gh-ost vs pt-online-schema-change

Postgres mostly handles the cases above natively. MySQL needs an external tool because `ALTER TABLE` has historically meant copy-the-whole-table-with-a-write-lock. The two production-grade options have different tradeoffs:

| Concern | `gh-ost` | `pt-online-schema-change` |
|---|---|---|
| Data capture | Reads MySQL **binary log** (no triggers) ([Mydbops][mydbops-ghost]) | Installs **triggers** on the source table |
| Foreign keys | Not supported ([Severalnines][severalnines-ghost-pt]) | Limited support, but better than gh-ost |
| Triggers on source table | Not supported | Not supported (cannot install another trigger over them) |
| Pause / resume mid-migration | Yes — has binlog coordinates ([Severalnines][severalnines-ghost-pt]) | Limited |
| Replica lag awareness | First-class (built-in throttling) | Manual / external |
| Binlog format requirement | **ROW-based replication only** ([Severalnines][severalnines-ghost-pt]) | Any |
| Maturity | GitHub-built, widely deployed | Older, more battle-tested across MySQL versions |

Default to **gh-ost** if your tables don't have foreign keys and your binlogs are ROW-based. Default to **pt-online-schema-change** when you must support FKs or older MySQL. Both implement the same conceptual flow: shadow table → copy + capture changes → cutover.

### Verification before you contract

Before the irreversible step (drop the old column / table / index):

- Row counts match between OLD and NEW within an acceptable window.
- Sampled diff query: `SELECT old_col, new_col FROM t TABLESAMPLE BERNOULLI(0.1) WHERE old_col IS DISTINCT FROM new_col LIMIT 100` returns nothing.
- Application error rate on the new path is flat.
- Replica lag normal during the entire backfill.
- Optional but powerful: a *Scientist*-style shadow comparison wired into production reads for a soak period. ([Stripe][stripe-online-migrations])

If any of these fails, rollback is simply "stop reading from new, keep dual-writing." No data loss. No downtime.

## Anti-patterns

### Single-deploy rename

**Symptom:** Errors during deploy: "column foo does not exist" or "column bar does not exist", flapping during the rolling deploy.
**Diagnosis:** Old pods and new pods disagree on the column name.
**Fix:** Expand → backfill → contract. Three deploys. There is no shortcut.

### Plain `CREATE INDEX` in production

**Symptom:** Database freezes for minutes; everything backs up; pager fires.
**Diagnosis:** `CREATE INDEX` (without `CONCURRENTLY`) takes `ACCESS EXCLUSIVE` and the lock queue piles up behind it. ([Xata][xata-lock-queue])
**Fix:** Always `CONCURRENTLY` on hot tables. CI lint that fails on `CREATE INDEX` without it.

### No `lock_timeout` on the migration session

**Symptom:** A long autovacuum or long-running report transaction blocks your DDL; your DDL blocks every read for ten minutes.
**Diagnosis:** Default `lock_timeout` is 0 (wait forever). The lock queue does the rest. ([Xata][xata-lock-queue])
**Fix:** `SET lock_timeout = '2s';` (or less) at the top of every migration. Tool retries with backoff.

### Single-statement backfill

**Symptom:** Migration runs for an hour, locks rows, replicas lag 30 minutes behind.
**Diagnosis:** `UPDATE big_table SET ...` without batching.
**Fix:** Batches of 1k–10k with sleeps. Run in a separate session, not in the migration tool itself. Use `FOR UPDATE SKIP LOCKED`.

### NOT NULL added before backfill completes

**Symptom:** New inserts start failing because the new column isn't supplied; CI passes because seed data has the value.
**Diagnosis:** Constraint enforced before app code is updated.
**Fix:** Add the column with a `DEFAULT` first. After app code consistently writes the column, drop the default in a later deploy if you want strict semantics.

### FK add without `NOT VALID`

**Symptom:** `ALTER TABLE … ADD FOREIGN KEY` runs for 20 minutes blocking writes on a 100M-row table.
**Diagnosis:** Default validation requires a full table scan with the table locked.
**Fix:** Two-step: `ADD CONSTRAINT … NOT VALID` then `VALIDATE CONSTRAINT` separately. ([pg docs][pg-altertable])

### Reverse-incompatible API + DB change in the same deploy

**Symptom:** Mid-rollout, half the pods 500 because old API consumers see new schema responses.
**Diagnosis:** Two breaking changes in one release.
**Fix:** Sequence them: API contract first (additive), DB next, drop old API later. Deploy ordering matters; document it.

## Quality gates

- [ ] **Test:** rehearse the migration on a snapshot of production. Time the longest step. If it holds `ACCESS EXCLUSIVE` > 5 seconds, redesign.
- [ ] **Test:** dry-run the rolling deploy in staging with two app versions running concurrently; assert no 500s.
- [ ] Every migration session sets `lock_timeout` (commonly < 2s) and the runner retries with exponential backoff.
- [ ] Every `CREATE INDEX` on a > 100k-row table uses `CONCURRENTLY`. CI lint enforces.
- [ ] Backfill is batched (≤ 10k rows per batch) with sleeps and `FOR UPDATE SKIP LOCKED`.
- [ ] Renames, type changes, FK adds, and NOT NULLs added on populated columns all split across ≥ 3 deploys.
- [ ] Dual-write code is gated by a feature flag (see `feature-flag-rollout-strategist`) — toggle off without redeploy.
- [ ] Verification queries (counts, sample diffs) run before the contract step. Documented in the migration's runbook.
- [ ] Replica lag monitored during backfill (see `grafana-dashboard-builder`); pause if SLO breached.
- [ ] Postgres only: `ADD FOREIGN KEY` always uses `NOT VALID` then `VALIDATE CONSTRAINT`.
- [ ] MySQL only: tool selected (gh-ost vs pt-online-schema-change) based on FK + binlog-format reality, not habit.
- [ ] Rollback plan documented before deploy: how to revert each phase without data loss.
- [ ] Optional: Scientist-style shadow comparison wired into production reads for the soak window. ([Stripe][stripe-online-migrations])

## NOT for

- **Greenfield schema design** — different concern, no migration constraint. No dedicated skill yet.
- **ORM-managed migration generator quirks** (Prisma migrate, Drizzle kit) — generator-specific. → `d1-and-supabase-migrations` for D1 + Supabase CLI specifically.
- **EXPLAIN ANALYZE / planner debugging** of the queries the migration touches — different skill. → `postgres-explain-analyzer`.
- **Document/NoSQL migrations** — different consistency model.
- **Pure data backfills** (no schema change) — the batching pattern transfers but the surrounding sequencing doesn't.

## Sources

- Stripe Engineering — *Online migrations at scale* (4-step dual writes; Scientist; MapReduce backfills). [stripe.com/blog/online-migrations][stripe-online-migrations]
- PostgreSQL — *ALTER TABLE* (lock levels, NOT VALID, ADD COLUMN DEFAULT in pg11+, FK weaker lock, SET NOT NULL with CHECK shortcut). [postgresql.org/docs/current/sql-altertable.html][pg-altertable]
- PostgreSQL — *Explicit Locking* (table-level lock matrix). [postgresql.org/docs/current/explicit-locking.html][pg-explicit-locking]
- PostgreSQL — *CREATE INDEX* (CONCURRENTLY semantics, INVALID index recovery). [postgresql.org/docs/current/sql-createindex.html][pg-create-index]
- Xata — *Schema changes and the Postgres lock queue* (lock_timeout < 2s, queue cascade behavior). [xata.io/blog/migrations-and-exclusive-locks][xata-lock-queue]
- PostgresAI — *Zero-downtime Postgres schema migrations need this: lock_timeout and retries*. [postgres.ai/blog/20210923-zero-downtime-postgres-schema-migrations-lock-timeout-and-retries][postgres-ai-lock-timeout]
- Pete Hodgson — *Expand/Contract: making a breaking change without a big bang*. [blog.thepete.net/blog/2023/12/05/expand/contract-making-a-breaking-change-without-a-big-bang/][hodgson-expand-contract]
- Severalnines — *Online Schema Change for MySQL & MariaDB — gh-ost vs pt-online-schema-change*. [severalnines.com/.../online-schema-change-mysql-mariadb-comparing-github-s-gh-ost-vs-pt-online-schema-change][severalnines-ghost-pt]
- Mydbops — *gh-ost: Triggerless Online Schema Change for MySQL*. [mydbops.com/blog/gh-ost-for-mysql-schema-change][mydbops-ghost]

[stripe-online-migrations]: https://stripe.com/blog/online-migrations
[pg-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html
[pg-explicit-locking]: https://www.postgresql.org/docs/current/explicit-locking.html
[pg-create-index]: https://www.postgresql.org/docs/current/sql-createindex.html
[xata-lock-queue]: https://xata.io/blog/migrations-and-exclusive-locks
[postgres-ai-lock-timeout]: https://postgres.ai/blog/20210923-zero-downtime-postgres-schema-migrations-lock-timeout-and-retries
[hodgson-expand-contract]: https://blog.thepete.net/blog/2023/12/05/expand/contract-making-a-breaking-change-without-a-big-bang/
[severalnines-ghost-pt]: https://severalnines.com/blog/online-schema-change-mysql-mariadb-comparing-github-s-gh-ost-vs-pt-online-schema-change/
[mydbops-ghost]: https://www.mydbops.com/blog/gh-ost-for-mysql-schema-change
