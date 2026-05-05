---
name: postgres-row-level-security
description: Designing Postgres Row-Level Security (RLS) policies for multi-tenant authorization, especially in Supabase / PostgREST stacks — `CREATE POLICY` syntax, USING vs WITH CHECK, PERMISSIVE/RESTRICTIVE merge semantics, the `(SELECT auth.uid())` performance pattern that turns 171ms scans into <1ms, indexes still required, role-based bypass via BYPASSRLS, security-definer escape hatches. Grounded in postgresql.org, Supabase docs, and Gary Austin's RLS-Performance benchmarks.
category: Backend & Databases
tags: [postgres, rls, row-level-security, supabase, postgrest, multi-tenant, authorization]
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(psql:*, grep:*, rg:*)
---

# Postgres Row-Level Security

> **TL;DR**: `ENABLE ROW LEVEL SECURITY` is default-deny. `CREATE POLICY` adds USING (read filter) and/or WITH CHECK (write filter). Multiple PERMISSIVE policies OR together; multiple RESTRICTIVE policies AND. The single biggest performance fix: wrap `auth.uid()` in `(SELECT auth.uid())` to cache the result once per statement (94-99% latency reduction). RLS adds a WHERE clause but does not add indexes — your `user_id` column still needs one.

---

## Jump to your fire

| Symptom | Section |
|---|---|
| "Need 'user can only see their own rows'" | [Canonical patterns](#3-canonical-supabase-patterns) |
| "RLS query went from 1ms to 1700ms" | [Performance](#5-performance-the-subselect-trick) |
| "Two policies — what's the merge?" | [PERMISSIVE vs RESTRICTIVE](#2-permissive-vs-restrictive-merge-semantics) |
| "Service role / admin needs to bypass" | [Bypass paths](#6-bypass-paths-bypassrls-and-security-definer) |
| "Views aren't enforcing RLS" | [Views gotcha](#anti-patterns) |
| "When is USING vs WITH CHECK used?" | [USING vs WITH CHECK](#1-create-policy-syntax) |

---

## Decision diagram

```mermaid
flowchart TD
  A[Multi-tenant table needs authorization] --> B[ALTER TABLE t ENABLE ROW LEVEL SECURITY]
  B --> C{Owner should also be subject to RLS?<br/>e.g. service_role wired through PostgREST}
  C -->|Yes| D[ALTER TABLE t FORCE ROW LEVEL SECURITY]
  C -->|No| E[Skip FORCE - owner bypasses]
  D --> F[Decide policy types per command]
  E --> F
  F --> G{SELECT visibility?}
  G -->|"User sees own rows"| H[CREATE POLICY ... FOR SELECT TO authenticated<br/>USING (auth.uid)= user_id)]
  F --> I{INSERT validation?}
  I -->|"User can only create own row"| J[CREATE POLICY ... FOR INSERT TO authenticated<br/>WITH CHECK (auth.uid)= user_id)]
  F --> K{UPDATE - both filter AND validate?}
  K -->|Yes| L[USING + WITH CHECK both<br/>typically same predicate]
  H --> M[Performance audit]
  J --> M
  L --> M
  M --> N{Hot read path?}
  N -->|Yes| O[Wrap auth.uid in SELECT subquery<br/>+ index user_id<br/>+ specify TO &lt;role&gt;]
  N -->|No| P[Done]
  O --> P
```

---

## 1. `CREATE POLICY` syntax

From [postgresql.org/docs/current/sql-createpolicy.html](https://www.postgresql.org/docs/current/sql-createpolicy.html):

```sql
CREATE POLICY name ON table_name
    [ AS { PERMISSIVE | RESTRICTIVE } ]
    [ FOR { ALL | SELECT | INSERT | UPDATE | DELETE } ]
    [ TO { role_name | PUBLIC | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] ]
    [ USING ( using_expression ) ]
    [ WITH CHECK ( check_expression ) ]
```

### USING vs WITH CHECK

| Command | USING (filter visible/affected rows) | WITH CHECK (validate new row values) |
|---|---|---|
| `SELECT` | required | not allowed |
| `INSERT` | not allowed | required |
| `UPDATE` | yes (which existing rows updatable) | yes (resulting row valid) |
| `DELETE` | required | not allowed |
| `ALL` | yes | yes (defaults to USING if omitted) |

**The mental model**: USING is "can the user see / affect this row?" WITH CHECK is "is the user allowed to write *this exact value*?"

For UPDATE, both apply: USING gates which rows the user can attempt to update; WITH CHECK gates whether the resulting row is allowed (so a user can't UPDATE their row to assign it to someone else).

If you omit WITH CHECK on an UPDATE/ALL policy, **it defaults to the USING expression** — usually what you want.

### Default-deny

```sql
ALTER TABLE t ENABLE ROW LEVEL SECURITY;
```

Once enabled, *no rows are visible* to any non-bypass role until policies are added. This is the correct safe default — fail closed, not open.

```sql
ALTER TABLE t FORCE ROW LEVEL SECURITY;  -- owner is also subject to policies
```

Without `FORCE`, the table owner bypasses RLS. With `FORCE`, even the owner must satisfy policies. Use `FORCE` when the connection role (e.g., the Postgres user PostgREST connects as) might own tables — otherwise you have a bypass-by-accident.

---

## 2. PERMISSIVE vs RESTRICTIVE merge semantics

For a given command, the effective predicate is:

```
( PERMISSIVE_1 OR PERMISSIVE_2 OR ... )
AND
( RESTRICTIVE_1 AND RESTRICTIVE_2 AND ... )
```

- Multiple **PERMISSIVE** policies → combined with **OR** (any can grant access).
- Multiple **RESTRICTIVE** policies → combined with **AND** (all must pass).
- Default policy type is `PERMISSIVE`.
- A table with RLS on but only RESTRICTIVE policies still denies everything (no permissive predicate to be true).

**Worked example**: layer a network restriction *on top of* normal access:

```sql
-- Permissive: standard access
CREATE POLICY "users see own rows" ON profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Restrictive: but admins must come from the office network
CREATE POLICY "admin local only" ON profiles
  AS RESTRICTIVE FOR SELECT TO admin
  USING (pg_catalog.inet_client_addr() <<= inet '10.0.0.0/8');
```

A regular user sees their own row (permissive matches). An admin sees rows only when also on `10.0.0.0/8` (permissive AND restrictive). A user not on the office network as admin sees nothing.

**Do not** rely on RESTRICTIVE alone — without at least one matching permissive, all rows are filtered.

---

## 3. Canonical Supabase patterns

Supabase wraps PostgREST + RLS with helper functions that read JWT claims. From [supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security):

| Function | Returns |
|---|---|
| `auth.uid()` | UUID of authenticated user; **`NULL` if unauthenticated** |
| `auth.jwt()` | Full JWT as JSON; access claims via `->`/`->>` |
| `auth.role()` | Role string (`anon`, `authenticated`, etc.) |

The **NULL gotcha**: `USING (auth.uid() = user_id)` silently fails for anon callers (NULL = anything → NULL → row not visible — actually correct, but the failure mode is silent). Recommended:

```sql
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
```

### Pattern: User can only see their own rows

```sql
CREATE POLICY "Own rows visible" ON todos
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);
```

### Pattern: User can only INSERT rows for themselves

```sql
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);
```

### Pattern: User can UPDATE their own rows AND can't reassign them

```sql
CREATE POLICY "Update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING      ((SELECT auth.uid()) = user_id)   -- which rows can I touch
  WITH CHECK ((SELECT auth.uid()) = user_id);  -- new value must still be mine
```

### Pattern: Team membership via JWT app_metadata

```sql
CREATE POLICY "User is in team" ON team_documents
  TO authenticated
  USING (team_id IN (SELECT auth.jwt() -> 'app_metadata' -> 'teams'));
```

> Supabase explicitly warns: prefer `raw_app_meta_data` over `raw_user_meta_data` in policies — users can self-edit `user_metadata`.

### Pattern: Require MFA (AAL2) for sensitive write

```sql
CREATE POLICY "Require AAL2" ON profiles
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt()->>'aal') = 'aal2');
```

---

## 4. PostgREST role wiring

Behind Supabase / any PostgREST stack:

- **authenticator** (LOGIN, NOINHERIT) — connects to Postgres, then `SET LOCAL ROLE` per request based on the JWT
- **anon** (NOLOGIN) — used when no JWT or no `role` claim
- **authenticated** — used when JWT validates
- **service_role** — has `BYPASSRLS`; **must never reach the browser**

```sql
GRANT authenticated TO authenticator;
GRANT anon TO authenticator;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.todos TO authenticated;
GRANT SELECT ON public.todos TO anon;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
```

JWT claims are accessible via:

```sql
current_setting('request.jwt.claims', true)::json->>'email'
```

Supabase's `auth.uid()` / `auth.jwt()` are wrappers around exactly this `current_setting('request.jwt.claims', ...)` mechanism.

---

## 5. Performance: the subselect trick

This is the single highest-leverage RLS performance pattern. From [Gary Austin's RLS-Performance benchmark repo](https://github.com/GaryAustin1/RLS-Performance):

| Technique | Before → After | Improvement |
|---|---|---|
| Add btree index on `user_id` | 171ms → <0.1ms | 99.94% |
| Wrap `auth.uid()` in `(SELECT …)` | 179ms → 9ms | 94.97% |
| Wrap security-definer function `(SELECT is_admin())` | 11_000ms → 7ms | 99.94% |
| Add explicit `.eq('user_id', …)` filter on client | 171ms → 9ms | 94.74% |
| Rewrite join → `IN (SELECT …)` | 9_000ms → 20ms | 99.78% |
| Add `TO authenticated` (skip anon eval) | 170ms → <0.1ms | 99.78% |

### Why the subselect works

`USING (auth.uid() = user_id)` calls `auth.uid()` *per row*. On a 1M-row scan, that's 1M function calls.

`USING ((SELECT auth.uid()) = user_id)` causes Postgres to build an `initPlan` — a one-time computation that runs *once per statement*, then is reused across all row evaluations. The result: 1 call instead of 1M.

This is only safe when the function result is row-independent. `auth.uid()`, `auth.jwt()`, `current_setting()` qualify. If your predicate uses a function whose result depends on the row, you can't wrap it.

### Indexes still matter

```sql
CREATE INDEX idx_todos_user_id ON todos (user_id);
```

RLS adds an implicit `WHERE user_id = auth.uid()` clause but **does not create indexes**. The policy column (typically `user_id`) must be indexed or every read becomes a sequential scan with a per-row filter.

### Always specify `TO <role>`

```sql
-- Bad: policy evaluated for ALL roles including anon
CREATE POLICY ... ON todos USING (...);

-- Good: skip evaluation for non-matching roles
CREATE POLICY ... ON todos TO authenticated USING (...);
```

When `TO` is omitted, the policy is evaluated against `PUBLIC` — every role, including ones that should never reach the table. Specifying `TO authenticated` lets Postgres skip the policy entirely for `anon`.

### Push the predicate from the client too

Even though RLS enforces it, the optimizer builds better plans when the predicate is also in the query:

```js
// Worse: relies on RLS alone
supabase.from('todos').select('*')

// Better: explicit predicate gives the optimizer hints
supabase.from('todos').select('*').eq('user_id', user.id)
```

The explicit `.eq()` lets Postgres use the index directly; without it, the planner may decide the RLS predicate alone isn't index-worthy.

---

## 6. Bypass paths: BYPASSRLS and SECURITY DEFINER

Two ways to legitimately skip RLS:

### `BYPASSRLS` role attribute

```sql
ALTER ROLE service_role WITH BYPASSRLS;
```

The role permanently ignores all RLS policies on all tables. Use for:
- Backup tools
- Migration scripts
- Service workers that need cross-tenant access

**Never expose a BYPASSRLS connection to user-facing code.** Supabase's `service_role` key (in `.env`) gives this access — leaking it is a full data breach.

### `SECURITY DEFINER` functions

```sql
CREATE FUNCTION get_team_total(team_id uuid) RETURNS int
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT count(*) FROM team_members WHERE team_id = $1
$$;
```

The function runs with the privileges of the function *owner*, not the caller. If the owner is `postgres` (RLS bypass), the function bypasses RLS for the duration of its execution.

This is the canonical escape hatch for narrow whitelisted operations — but it's also the most common place RLS gets accidentally bypassed. Rules:

- Only create `SECURITY DEFINER` functions you've reviewed line-by-line
- Always `SET search_path = ''` inside to prevent search-path injection
- Don't expose them in API schemas (Supabase: keep them out of the `public` schema)

---

## Anti-patterns

| Anti-pattern | Why it bites | Fix |
|---|---|---|
| RLS policy uses `auth.uid()` (no subselect) | Per-row function call → 100-1000× slowdown | `(SELECT auth.uid())` for caching |
| `user_id` column not indexed | Sequential scan + per-row filter | `CREATE INDEX ON tbl (user_id)` |
| Policy without `TO <role>` clause | Evaluates for every role including `anon` | Always specify `TO authenticated` (or whichever) |
| Views silently bypass RLS | Pre-PG15: views run with creator's privileges | PG15+: `WITH (security_invoker = true)`. Older: revoke direct grants and rely on the view's RLS |
| `service_role` key leaks to browser | Full database compromise | Service role only on server-side; browser uses anon + RLS |
| `SECURITY DEFINER` exposed in PostgREST API schema | API call bypasses RLS | Keep these in a private schema; not in `public` |
| Restrictive-only policies (no permissive) | All rows denied | Add at least one permissive policy or rely on grant-based access |
| `USING (true)` policy | RLS enabled but no actual filtering | Either remove the policy or add real predicate |
| UPDATE without WITH CHECK | User can update their row to belong to someone else | Always pair USING + WITH CHECK on UPDATE |
| Trusting `raw_user_meta_data` in policies | Users can self-edit it | Use `raw_app_meta_data` instead |
| FK / unique constraint as covert channel | These bypass RLS by design | Audit FK reveals (the existence of a referenced row leaks); design schema accordingly |

---

## Novice / Expert / Timeline

| | Novice | Expert |
|---|---|---|
| **First policy** | `USING (auth.uid() = user_id)` no `TO`, no subselect | `TO authenticated USING ((SELECT auth.uid()) = user_id)` + index |
| **UPDATE policy** | USING only | USING + WITH CHECK to prevent reassignment |
| **Performance debugging** | "RLS is slow, disable it" | EXPLAIN ANALYZE; subselect wrap; index audit |
| **Service role** | Used in client code | Server-only; client never sees it |
| **Views** | Surprised they bypass | Knows pre-PG15 quirk; uses `security_invoker = true` |
| **Multiple policies** | Confused by interaction | Knows OR-permissive AND-restrictive merge |

**Timeline**: pre-PG15 — view RLS bypass was the constant gotcha. PG15+ (2022) — `security_invoker = true` makes views respect RLS. PG16+ — `lateral` joins inside policies got better-optimized. Supabase's `(SELECT auth.uid())` pattern (~2023) is the single biggest performance discovery — pre-2023 docs may not show it.

---

## Quality gates

An RLS configuration ships when:

- [ ] **Test:** `ALTER TABLE … ENABLE ROW LEVEL SECURITY` is set; verified by `\d+ <table>` showing "Row security enabled".
- [ ] **Test:** All policies specify `TO <role>` (no `PUBLIC` defaults). CI grep for `CREATE POLICY` without `TO`.
- [ ] **Test:** All policies that use `auth.uid()` / `auth.jwt()` wrap them in `(SELECT …)`. CI grep / lint.
- [ ] **Test:** `user_id` (or equivalent tenant column) has a btree index. `pg_indexes` query in CI.
- [ ] **Test:** RLS performance benchmark — query that should be <10ms via index actually is. Regression test with EXPLAIN ANALYZE.
- [ ] **Test:** UPDATE policies that should prevent reassignment have both USING and WITH CHECK. Code review checklist.
- [ ] **Test:** No `SECURITY DEFINER` function in the API-exposed schema (Supabase: not in `public`). CI grep.
- [ ] **Test:** Multi-tenant isolation tested end-to-end — user A cannot see user B's rows even via crafted queries.
- [ ] **Test:** `service_role` key is not present in any client-side bundle. Bundle scan in CI.
- [ ] **Manual:** Views in the data layer use `WITH (security_invoker = true)` (PG15+) or are explicitly designed for RLS bypass.

---

## NOT for this skill

- General authorization design (use `authorization-design`)
- OAuth / OIDC token issuance (use `oauth2-and-oidc-from-scratch`)
- Postgres performance beyond RLS (use `postgres-explain-analyzer`)
- Application-level authorization (Casbin, Oso, etc.) — different layer
- Schema design and normalization (use `database-design-patterns`)
- Postgres connection pooling (use `postgres-connection-pooling`)
- Specific Supabase features (Realtime, Storage RLS) — different concerns

---

## Sources

- PostgreSQL: [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) — ENABLE / FORCE / BYPASSRLS, default-deny semantics
- PostgreSQL: [`CREATE POLICY` reference](https://www.postgresql.org/docs/current/sql-createpolicy.html) — full syntax, USING/WITH CHECK applicability
- Supabase: [Row Level Security guide](https://supabase.com/docs/guides/database/postgres/row-level-security) — `auth.uid()`, `auth.jwt()`, canonical patterns, performance section
- Gary Austin: [RLS-Performance benchmarks](https://github.com/GaryAustin1/RLS-Performance) — the empirical numbers behind the subselect pattern
- PostgREST: [Authentication / role impersonation](https://docs.postgrest.org/en/v12/references/auth.html)
- Supabase: [RLS Performance & Best Practices](https://github.com/orgs/supabase/discussions/14576) — community-curated patterns
