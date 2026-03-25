---
license: Apache-2.0
name: database-migration-manager
description: 'Safe database migration manager for zero-downtime DDL changes and rollback plans. Activate on: database migration, schema change, DDL, rollback plan, zero-downtime migration, Prisma migrate, Drizzle kit, Flyway, column rename, table alter. NOT for: query optimization (use database-optimizer), ORM modeling (use data-pipeline-engineer), backup/restore (use devops-automator).'
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Backend & Infrastructure
tags:
  - database
  - migrations
  - schema
  - devops
pairs-with:
  - skill: drizzle-migrations
    reason: Drizzle-specific migration patterns this skill generalizes
  - skill: data-pipeline-engineer
    reason: Schema design that migrations implement
---

# Database Migration Manager

Expert in safe, reversible database schema migrations with zero-downtime deployment strategies.

## Activation Triggers

**Activate on:** "database migration", "schema change", "alter table", "add column", "drop column", "zero-downtime DDL", "rollback plan", "Prisma migrate", "Drizzle kit", "Flyway", "migration strategy"

**NOT for:** Query optimization → `database-optimizer` | ORM data modeling → `data-pipeline-engineer` | Backup/restore → `devops-automator`

## Quick Start

1. **Assess the change** — additive (safe), modification (needs strategy), or destructive (needs expand-contract)
2. **Write the migration** — forward migration with explicit rollback SQL
3. **Test on staging** — run against a copy of production data volume
4. **Plan zero-downtime** — use expand-contract for breaking changes
5. **Execute with monitoring** — deploy migration, watch error rates, rollback if needed

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **ORM Migrations** | Prisma Migrate, Drizzle Kit, TypeORM, Sequelize |
| **SQL Migrations** | Flyway, Liquibase, golang-migrate, dbmate, Atlas |
| **Zero-Downtime** | Expand-contract, shadow columns, online DDL (pt-online-schema-change) |
| **Databases** | PostgreSQL 17, MySQL 8.4, SQLite, CockroachDB, PlanetScale |
| **Safety** | Rollback scripts, dry-run validation, lock timeout guards |

## Architecture Patterns

### Expand-Contract Pattern (Zero-Downtime Column Rename)

```
Phase 1 — EXPAND (deploy migration, app reads both):
  ├─ Add new column `full_name`
  ├─ Backfill: UPDATE users SET full_name = name
  ├─ Add trigger: sync writes to both columns
  └─ Deploy app reading `full_name`, falling back to `name`

Phase 2 — MIGRATE (app writes to new only):
  ├─ Deploy app writing only to `full_name`
  └─ Verify no reads/writes to old column (query logs)

Phase 3 — CONTRACT (remove old):
  ├─ Drop trigger
  ├─ Drop old column `name`
  └─ Clean migration: one final migration file
```

### Safe Migration Template (PostgreSQL)

```sql
-- migrations/20260320_001_add_email_verified.sql
-- FORWARD
BEGIN;
SET lock_timeout = '5s';  -- Fail fast if table locked

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified boolean
  DEFAULT false NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_users_email_verified ON users(email_verified)
  WHERE email_verified = true;

COMMIT;

-- ROLLBACK (in companion file or comment block)
-- BEGIN;
-- DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_verified;
-- ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
-- COMMIT;
```

### Migration Safety Ladder

```
Risk Level 1 (Safe):    ADD COLUMN (nullable), CREATE INDEX CONCURRENTLY
Risk Level 2 (Caution): ADD COLUMN (with default), ADD NOT NULL constraint
Risk Level 3 (Danger):  ALTER COLUMN TYPE, RENAME COLUMN
Risk Level 4 (Critical): DROP COLUMN, DROP TABLE
                          ↓
                 Requires expand-contract pattern
```

## Anti-Patterns

1. **Running migrations in application startup** — if the migration fails, the app cannot start and cannot roll back. Run migrations as a separate CI/CD step with its own rollback.
2. **No lock_timeout** — `ALTER TABLE` acquires an ACCESS EXCLUSIVE lock. Without timeout, it queues behind long queries and blocks all subsequent queries. Always set `lock_timeout`.
3. **Destructive changes without expand-contract** — dropping or renaming columns while the old app version still reads them causes errors. Always use the expand-contract pattern for breaking changes.
4. **Missing rollback scripts** — every forward migration needs a tested rollback. If you cannot roll back, the migration is not safe for production.
5. **Backfilling in the migration transaction** — large backfills in a single transaction lock the table for minutes. Backfill in batches outside the DDL transaction.

## Quality Checklist

```
[ ] Migration has explicit rollback SQL
[ ] lock_timeout set for all DDL statements
[ ] CREATE INDEX uses CONCURRENTLY
[ ] Breaking changes use expand-contract pattern
[ ] Backfills run in batches (1000-10000 rows per batch)
[ ] Migration tested against production-volume staging data
[ ] No data loss — dropped columns backed up or archived
[ ] Migration is idempotent (IF NOT EXISTS / IF EXISTS guards)
[ ] Application code deployed before destructive phase
[ ] Monitoring dashboards checked during and after migration
[ ] Migration numbered/timestamped for ordering
[ ] Rollback tested independently on staging
```
