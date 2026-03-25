---
license: Apache-2.0
name: database-connection-pool-manager
description: "PgBouncer, connection optimization, and pooling strategies for database performance. Activate on: connection pool, PgBouncer, database connections, pool size, connection limit, Prisma pool, Drizzle pool. NOT for: query optimization (use data-warehouse-optimizer), database schema design (use dimensional-modeler)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*,psql:*)
category: Backend & Infrastructure
tags:
  - database
  - connection-pool
  - pgbouncer
  - performance
  - postgres
pairs-with:
  - skill: multi-tenant-architecture-expert
    reason: Multi-tenant apps require careful pool segmentation
  - skill: observability-apm-expert
    reason: Connection pool metrics are critical for performance monitoring
  - skill: data-warehouse-optimizer
    reason: Warehouse query patterns affect pool sizing
---

# Database Connection Pool Manager

Optimize database connection pools for throughput, latency, and resource efficiency using PgBouncer, application-level poolers, and cloud-managed pools.

## Activation Triggers

**Activate on:** "connection pool", "PgBouncer", "database connections", "pool size", "connection limit", "too many connections", "connection timeout", "Prisma pool", "Supabase pooler"

**NOT for:** SQL query optimization → `data-warehouse-optimizer` | Schema design → `dimensional-modeler` | ORM selection → `api-architect`

## Quick Start

1. **Audit current connections** — `SELECT count(*) FROM pg_stat_activity` to understand baseline
2. **Choose pooling mode** — transaction pooling (default), session pooling (for prepared statements)
3. **Size the pool** — start with `connections = (cores * 2) + spindle_count` per PostgreSQL docs
4. **Deploy pooler** — PgBouncer sidecar or Supabase/Neon built-in pooler
5. **Monitor** — track active/idle/waiting connections, query queue time

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **External Poolers** | PgBouncer 1.23+, Odyssey, PgCat |
| **Cloud Poolers** | Supabase Supavisor, Neon pooler, RDS Proxy |
| **App-Level** | Prisma connection pool, Drizzle pool, node-postgres Pool |
| **Monitoring** | pg_stat_activity, PgBouncer SHOW commands, Prometheus |
| **Databases** | PostgreSQL 16+, MySQL 8.4+, CockroachDB |

## Architecture Patterns

### PgBouncer Transaction Pooling

```
App Instances (100 connections)
    ↓
PgBouncer (pool_mode = transaction)
    max_client_conn = 200
    default_pool_size = 20
    reserve_pool_size = 5
    ↓
PostgreSQL (max_connections = 30)
```

Key: 200 app connections share 20 actual database connections. Each connection is released back to the pool at transaction end.

### Pool Sizing Formula

```
Optimal pool size = ((core_count * 2) + effective_spindle_count)

Example (8-core server, SSD):
  pool_size = (8 * 2) + 1 = 17

For serverless (many short-lived functions):
  pgbouncer.default_pool_size = 20
  pgbouncer.min_pool_size = 5
  app.max_pool_size = 5  (per function instance)
  total_functions * 5 <= pgbouncer.max_client_conn
```

### Prisma with PgBouncer

```typescript
// schema.prisma — pgbouncer mode disables prepared statements
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // pooler:6543/db?pgbouncer=true
  directUrl = env("DIRECT_DATABASE_URL") // direct:5432/db (for migrations)
}

// Connection limit per Prisma instance
generator client {
  provider = "prisma-client-js"
}

// At runtime
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
  // connection_limit set via URL param: ?connection_limit=5
});
```

## Anti-Patterns

1. **One connection per request** — never open/close connections per HTTP request; use a pool
2. **Oversized pools** — more connections != more throughput; past the optimal size, context switching kills performance
3. **Session pooling by default** — use transaction pooling unless you need prepared statements or session variables
4. **No connection timeout** — always set `idle_timeout` and `server_idle_timeout` to reclaim stale connections
5. **Ignoring pool exhaustion** — monitor `cl_waiting` in PgBouncer; if clients wait, pool is undersized or queries are too slow

## Quality Checklist

- [ ] Pool size calculated based on CPU cores, not arbitrary numbers
- [ ] PgBouncer or equivalent deployed for serverless/high-connection workloads
- [ ] Transaction pooling mode used (session pooling only when required)
- [ ] `idle_timeout` set to reclaim unused connections (default: 300s)
- [ ] Application `connection_limit` per instance is <= pool_size / instance_count
- [ ] Migrations run on direct connection, not through pooler
- [ ] Connection pool metrics exported (active, idle, waiting, total)
- [ ] Alert configured for pool exhaustion (waiting > 0 for > 10s)
- [ ] Prepared statements disabled when using transaction pooling
- [ ] Load tested: pool handles 2x expected concurrent connections
