---
license: Apache-2.0
name: postgresql-optimization
version: 1.0.0
category: Backend & Infrastructure
tags:
  - postgresql
  - optimization
  - query-performance
  - indexing
  - tuning
---

# PostgreSQL Optimization

## Overview

Expert in PostgreSQL performance tuning, query optimization, and database administration. Specializes in EXPLAIN analysis, indexing strategies, connection pooling, partitioning, and production-grade PostgreSQL operations.

## Decision Points

### Index Type Selection Decision Tree

```
Query Pattern Analysis:
├── Equality lookups (=, IN)?
│   ├── High cardinality column → B-tree index
│   └── Low cardinality (<100 unique) → Consider partial indexes or skip
├── Range queries (>, <, BETWEEN)?
│   ├── Date/time columns → B-tree index (created_at DESC for recent data)
│   ├── Large table (>1M rows) + sparse data → BRIN index
│   └── Regular ranges → B-tree index
├── Full-text search or JSONB containment?
│   ├── JSONB @>, ?, ?& operators → GIN index with jsonb_path_ops
│   ├── Full-text search (tsvector) → GIN index
│   └── JSONB keys/values extraction → GIN index
├── Array operations (ANY, ALL)?
│   └── GIN index on array column
└── Exact hash lookups only?
    ├── Large table + no range queries → HASH index
    └── Default → B-tree index (more flexible)
```

### Query Optimization Strategy

| EXPLAIN Output Indicator | Decision Path | Action |
|--------------------------|---------------|---------|
| "Seq Scan" on large table (>10k rows) | Missing index | Create B-tree index on WHERE clause columns |
| "Nested Loop" with high cost | Inefficient join | Add index on join keys, consider hash/merge join |
| "Sort" with "external merge" | Insufficient memory | Increase work_mem or add index to avoid sort |
| High "Rows Removed by Filter" | Late filtering | Move WHERE conditions earlier, use partial index |
| "Bitmap Heap Scan" with low selectivity | Index not selective enough | Create multi-column index or partial index |

### Connection Pool Sizing

```
Application Analysis:
├── Request pattern: Burst traffic?
│   ├── Yes → pool_mode = transaction, max_client_conn = 5x default_pool_size
│   └── No → pool_mode = session, max_client_conn = 2x default_pool_size
├── Query duration: Long-running queries (>30s)?
│   ├── Yes → pool_mode = session, higher reserve_pool_size
│   └── No → pool_mode = transaction for better throughput
└── Database connections available:
    ├── max_connections > 200 → default_pool_size = max_connections / 4
    └── max_connections ≤ 200 → default_pool_size = 20-25
```

## Failure Modes

### Index Bloat Death Spiral
- **Symptoms**: Queries slowing down over time despite unchanged code, pg_stat_user_tables shows high n_dead_tup
- **Diagnosis**: `SELECT pg_size_pretty(pg_relation_size('table_name'))` shows growing size but `SELECT count(*)` stable
- **Fix**: Regular VACUUM or tune autovacuum (reduce autovacuum_vacuum_scale_factor to 0.1)

### Connection Pool Exhaustion
- **Symptoms**: "remaining connection slots are reserved" errors, app timeouts
- **Diagnosis**: `SELECT count(*) FROM pg_stat_activity WHERE state = 'active'` near max_connections
- **Fix**: Implement PgBouncer with transaction pooling, reduce connection timeouts in app

### Query Plan Regression
- **Symptoms**: Previously fast queries become slow after data growth or schema changes
- **Diagnosis**: EXPLAIN shows different plan, pg_stat_statements shows exec_time spike
- **Fix**: Run ANALYZE table_name, consider query hints or restructure query

### Deadlock Cascade
- **Symptoms**: Multiple transactions failing with deadlock errors, application retries creating more deadlocks
- **Diagnosis**: Check pg_logs for deadlock details, identify conflicting lock patterns
- **Fix**: Establish consistent lock ordering, reduce transaction scope, add explicit locking

### Memory Configuration Mismatch
- **Symptoms**: OOM kills or "could not allocate memory" errors despite available RAM
- **Diagnosis**: shared_buffers + work_mem * max_connections exceeds available memory
- **Fix**: Reduce work_mem or max_connections, or increase shared_buffers to reduce double-buffering

## Worked Examples

### Optimizing a Slow Analytics Query

**Scenario**: Dashboard query taking 45 seconds to load monthly sales data

```sql
-- Initial slow query
SELECT 
  u.name, 
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as revenue
FROM users u
JOIN orders o ON o.user_id = u.id 
WHERE o.created_at >= '2024-01-01' 
  AND o.created_at < '2024-02-01'
GROUP BY u.id, u.name
ORDER BY revenue DESC;
```

**Step 1: Analyze current plan**
```sql
EXPLAIN (ANALYZE, BUFFERS) [query above];
-- Result: Seq Scan on orders (cost=0.00..450000 rows=2000000)
-- Shows: scanning 2M rows to find 50k matching rows
```

**Expert catches**: Date range filter eliminating 95% of rows suggests need for date index
**Novice misses**: Might try to optimize the JOIN first instead of the WHERE filter

**Step 2: Create targeted index**
```sql
-- Index for date filtering and JOIN
CREATE INDEX CONCURRENTLY idx_orders_created_user 
ON orders (created_at, user_id) 
INCLUDE (total_amount);
```

**Step 3: Re-analyze**
```sql
EXPLAIN (ANALYZE, BUFFERS) [query];
-- New result: Index Scan using idx_orders_created_user (cost=0.43..15000 rows=50000)
-- Query time: 45s → 1.2s
```

**Expert catches**: INCLUDE clause enables index-only scan, eliminating table lookup
**Novice misses**: Would create separate indexes instead of one covering index

## Quality Gates

- [ ] All tables >10k rows have appropriate indexes for common WHERE clauses
- [ ] No sequential scans on tables >100k rows in production query plans
- [ ] Average query execution time <500ms for 95th percentile
- [ ] Database cache hit ratio >95% (check pg_stat_database.blks_hit/(blks_read+blks_hit))
- [ ] Index size <3x table size for any single table
- [ ] Connection pool utilization <80% during peak load
- [ ] No queries using >25% of work_mem causing disk sorts
- [ ] Autovacuum completing within maintenance windows
- [ ] No tables with >20% dead tuple ratio
- [ ] All foreign keys have corresponding indexes for JOIN performance

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Database schema design** → Use `database-modeler` for ERD design and normalization decisions
- **Application-level caching** → Use `redis-caching-expert` for cache layer architecture
- **Data pipeline optimization** → Use `data-pipeline-engineer` for ETL performance
- **Backup and disaster recovery** → Use `site-reliability-engineer` for backup strategies
- **Cross-database migrations** → Use `database-migration-expert` for schema migrations
- **Real-time streaming** → Use `event-streaming-architect` for Kafka/streaming solutions

**Delegate when:**
- Query optimization requires application logic changes → Application architect
- Performance issues stem from network latency → Infrastructure team
- Database choice evaluation needed → Data architect
- Compliance or security requirements → Database security specialist