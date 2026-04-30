---
name: D1 and Supabase Migrations Done Right
description: 'Use when applying Cloudflare D1 migrations, fighting Supabase migration history vs SQL execution, choosing direct psql over CLI, designing idempotent migrations, debugging schema drift between local and remote, or recovering after a half-applied migration. Triggers: supabase migration repair instructions appearing, table missing after "applied" status, "Tenant or user not found" when running psql, --remote vs --local D1 confusion, NOT NULL on a populated column, foreign key constraint failures, drift between staging and prod schemas. NOT for Mongo/document migrations, ORM-managed migrations specifically (Prisma/Drizzle have their own conventions), or pure data backfills.'
category: Backend & Infrastructure
tags:
  - database
  - migrations
  - sqlite
  - postgres
  - supabase
  - d1
  - schema
---

# D1 and Supabase Migrations Done Right

Migrations are state changes the database remembers. The most expensive bug in this domain is "the history says applied but the SQL never ran" — Supabase's `migration repair` makes this trivially possible. This skill catalogs the traps and the safe patterns.

## When to use

- Adding a column, table, or index to D1 or Supabase.
- A migration appears to have run but the schema doesn't reflect it.
- Wrangler suggests `migration repair`; pause before running it.
- Direct psql connection needed because the CLI can't authenticate.
- Schema drift between two environments.
- A migration on a populated table needs a backfill or default.

## Core capabilities

### The repair-vs-execute trap (Supabase)

Read this twice:

> `supabase migration repair --status applied 042` ONLY updates `supabase_migrations.schema_migrations`. It does NOT execute the SQL.

If the database doesn't have the table or column the migration creates, `repair --status applied` will leave you with the history claiming "applied" and the schema saying nothing. Subsequent `supabase db push` will skip the migration because the history says it ran.

**Always run the SQL first. Then repair.**

### Direct psql for Supabase

Build the connection URL yourself when the CLI fails:

```bash
PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
  "postgresql://postgres@db.${PROJECT_REF}.supabase.co:5432/postgres" \
  -f supabase/migrations/042_add_audit_log.sql
```

- `PROJECT_REF` is the substring before `.supabase.co` in `NEXT_PUBLIC_SUPABASE_URL`.
- Port `5432` is the direct connection. Port `6543` is the pgbouncer pooler.
- Pooler URLs return `Tenant or user not found` for migration scripts because pgbouncer's transaction-pooling mode doesn't support all features migrations need (advisory locks, prepared statements).

After the SQL has actually run, mark the history:

```bash
supabase migration repair --status applied 042
```

Verify with a real query, not history:

```bash
psql ... -c "SELECT count(*) FROM information_schema.columns WHERE table_name = 'audit_log';"
```

### D1 migrations

D1 has a single migration command and no separate "repair":

```bash
wrangler d1 migrations create windags-telemetry add_cascade_scores
# Edit the generated SQL file under migrations/

wrangler d1 migrations list windags-telemetry --remote
wrangler d1 migrations apply windags-telemetry --remote
```

The `d1_migrations` table is updated only on successful apply. There's no "mark applied without running" footgun in D1.

`--local` and `--remote` are different databases. Local uses `.wrangler/state/v3/d1/`. A common bug: applying locally, declaring victory, then prod has the old schema.

### One-off SQL on D1

```bash
wrangler d1 execute windags-telemetry --remote --command="SELECT count(*) FROM tool_call_events;"
wrangler d1 execute windags-telemetry --remote --file=hotfixes/backfill_top_score.sql
```

For exploratory queries, use `--json` for parseable output.

### Idempotent migrations

Both Postgres and SQLite (D1) accept `IF NOT EXISTS` on most things:

```sql
-- Both DBs
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_log(ts);

-- Postgres-only
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS actor_id TEXT;

-- SQLite (D1) — no IF NOT EXISTS on ADD COLUMN. Check first:
SELECT count(*) AS has_col
FROM pragma_table_info('audit_log')
WHERE name = 'actor_id';
-- Then conditionally apply via app code, or use a defensive approach:
-- ALTER TABLE audit_log RENAME COLUMN ... can also fail if you re-run.
```

A simple alternative for SQLite: write each ALTER as a separate migration file, never edit a migration after it's been applied anywhere.

### Foreign keys

SQLite (D1) needs `PRAGMA foreign_keys = ON` per connection. D1's runtime enables it for you on every query, but `wrangler d1 execute` may not — verify:

```bash
wrangler d1 execute mydb --remote --command="PRAGMA foreign_keys;"  # expect 1
```

Postgres always enforces foreign keys. The bug is usually the other way: a deferred constraint isn't being deferred, blocking a delete.

### Adding a NOT NULL column to a populated table

Three steps, three migrations:

```sql
-- 1. Add the column nullable.
ALTER TABLE orders ADD COLUMN region TEXT;

-- 2. Backfill (separate migration, possibly batched).
UPDATE orders SET region = 'us-west' WHERE region IS NULL;

-- 3. Make it NOT NULL.
ALTER TABLE orders ALTER COLUMN region SET NOT NULL;  -- Postgres
-- SQLite: requires table rebuild. Acceptable for small tables; use `ALTER TABLE ... RENAME` + new table for big ones.
```

Single-migration NOT NULL with default is fine for small tables (`ALTER TABLE … ADD COLUMN region TEXT NOT NULL DEFAULT 'us-west'`). On large tables this rewrites the heap on Postgres pre-11; check size first.

### Drift detection

Postgres:

```bash
pg_dump --schema-only --no-owner --no-privileges \
  "postgresql://postgres@db.staging.supabase.co:5432/postgres" \
  > /tmp/staging.sql
pg_dump --schema-only --no-owner --no-privileges \
  "postgresql://postgres@db.prod.supabase.co:5432/postgres" \
  > /tmp/prod.sql
diff -u /tmp/staging.sql /tmp/prod.sql
```

D1: there's no built-in dump. Query `sqlite_master`:

```bash
wrangler d1 execute mydb --remote --command="SELECT sql FROM sqlite_master ORDER BY type, name;" --json > /tmp/remote.json
wrangler d1 execute mydb --local --command="SELECT sql FROM sqlite_master ORDER BY type, name;" --json > /tmp/local.json
diff /tmp/local.json /tmp/remote.json
```

### Verification pattern

After every migration, run a query that asserts presence:

```ts
const { results } = await env.DB.prepare(
  "SELECT count(*) AS n FROM pragma_table_info('audit_log') WHERE name = 'actor_id'"
).first();
if (results.n === 0) throw new Error('migration did not apply');
```

Don't trust history rows. Trust the schema.

## Anti-patterns

### Running `supabase migration repair --status applied`

**Symptom:** Wrangler/Supabase CLI suggests `repair`; you run it; the table is still missing.
**Diagnosis:** Repair updates history, not schema. SQL was never executed.
**Fix:** Run the SQL via psql or the Supabase SQL editor first. Verify the schema. Then repair if needed.

### Pooler URL for migrations

**Symptom:** `psql -f migration.sql` returns `Tenant or user not found` or hangs.
**Diagnosis:** You're using port 6543 (pgbouncer transaction pool), which doesn't support migration features.
**Fix:** Direct connection on port 5432: `db.<ref>.supabase.co:5432`.

### Local-only D1 apply, ship to prod

**Symptom:** Code deploys, throws "no such column" on first request.
**Diagnosis:** Migrations applied with default `--local` flag; remote DB unchanged.
**Fix:** Always `--remote` for production migrations. Add a CI check that the remote schema matches the local one before deploy.

### NOT NULL without default on a populated table

**Symptom:** Migration fails: "column contains null values".
**Diagnosis:** Adding NOT NULL without first backfilling existing rows.
**Fix:** Three-step: nullable → backfill → NOT NULL. Or single ADD COLUMN with NOT NULL DEFAULT.

### Hardcoding migration IDs in app code

**Symptom:** App refuses to start because "expected migration 042 applied".
**Diagnosis:** Coupling app version to a specific migration number; works for a sprint, breaks on the first squash/cherry-pick.
**Fix:** Feature checks against the schema (`information_schema.columns` / `pragma_table_info`), not migration history.

### Long migrations on a hot table

**Symptom:** Production locks up for minutes during a deploy.
**Diagnosis:** Single transaction rewriting a 100M-row heap (full-table ALTER, big index build without CONCURRENTLY).
**Fix:** Postgres: `CREATE INDEX CONCURRENTLY`, batched UPDATE in chunks of 10k with sleep, online DDL via pg_repack. SQLite: shadow table + atomic rename.

## Quality gates

- [ ] Every Supabase migration verified by SELECT against the new shape, not history.
- [ ] Every D1 migration applied with `--remote` to production.
- [ ] CI check: local schema (`pg_dump --schema-only` or `sqlite_master`) matches expected baseline.
- [ ] `repair --status applied` never run unless the SQL has been executed and verified.
- [ ] Migrations are forward-only, or have a tested down-script.
- [ ] No NOT NULL without default on tables with existing rows.
- [ ] Long migrations on hot tables batched (chunks of 10k or fewer).
- [ ] Migration files immutable once applied anywhere; new changes get new files.

## NOT for

- **Mongo/document migrations** — different paradigm; pair with a document-DB skill.
- **Prisma / Drizzle migration tooling** — they each have specific conventions; use the matching skill.
- **Pure data backfills** — schema is locked; you're moving data. Different operational concerns.
- **MySQL/Aurora migrations** — different DDL behavior, different lock semantics.
- **Multi-region replication / failover** — operational, not schema.
