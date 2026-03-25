---
license: Apache-2.0
name: data-warehouse-optimizer
description: "Snowflake, BigQuery, clustering, partitioning, and materialized views for warehouse performance. Activate on: Snowflake, BigQuery, Redshift, query optimization, clustering, partitioning, materialized view, warehouse cost, query profile. NOT for: dbt model structure (use dbt-analytics-engineer), data modeling (use dimensional-modeler)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,snowsql:*,bq:*)
category: Data & Analytics
tags:
  - snowflake
  - bigquery
  - query-optimization
  - partitioning
  - warehouse
pairs-with:
  - skill: dbt-analytics-engineer
    reason: dbt models benefit from warehouse-level optimization
  - skill: data-cost-optimizer
    reason: Warehouse optimization directly reduces costs
  - skill: dimensional-modeler
    reason: Physical model design affects query performance
---

# Data Warehouse Optimizer

Optimize query performance and resource utilization in Snowflake, BigQuery, and Redshift through clustering, partitioning, materialized views, and query profiling.

## Activation Triggers

**Activate on:** "Snowflake optimization", "BigQuery performance", "Redshift tuning", "query optimization", "clustering key", "partitioning", "materialized view", "warehouse sizing", "query profile", "slow query"

**NOT for:** dbt project structure → `dbt-analytics-engineer` | Dimensional modeling → `dimensional-modeler` | Cost optimization beyond warehouse → `data-cost-optimizer`

## Quick Start

1. **Profile slow queries** — use QUERY_PROFILE (Snowflake), INFORMATION_SCHEMA.JOBS (BigQuery), STL tables (Redshift)
2. **Partition large tables** — by date column (most common), reducing scan size by 10-100x
3. **Add clustering** — co-locate frequently filtered/joined columns within partitions
4. **Materialize expensive aggregations** — materialized views for dashboards, pre-aggregated metrics
5. **Right-size warehouses** — auto-suspend idle, auto-scale for concurrency, match size to workload

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Snowflake** | Micro-partitions, clustering keys, search optimization, warehouses |
| **BigQuery** | Partitioning, clustering, BI Engine, materialized views |
| **Redshift** | Sort keys, dist keys, VACUUM, WLM, Redshift Serverless |
| **General** | Query plans, statistics, result caching, spill-to-disk analysis |
| **Monitoring** | Snowflake Account Usage, BigQuery INFORMATION_SCHEMA, CloudWatch |

## Architecture Patterns

### Snowflake Clustering and Search Optimization

```sql
-- Cluster a large fact table by commonly filtered columns
ALTER TABLE fct_events
  CLUSTER BY (event_date, customer_id);

-- Verify clustering depth (lower = better, target < 2.0)
SELECT SYSTEM$CLUSTERING_INFORMATION('fct_events', '(event_date, customer_id)');

-- Search optimization for point lookups on high-cardinality columns
ALTER TABLE fct_events ADD SEARCH OPTIMIZATION
  ON EQUALITY(order_id), EQUALITY(email);

-- Result: range scans use clustering, point lookups use search optimization
```

### BigQuery Partitioning + Clustering

```sql
-- Partition by date, cluster by high-cardinality filter columns
CREATE TABLE `project.dataset.fct_events`
PARTITION BY DATE(event_timestamp)
CLUSTER BY customer_id, event_type
AS
SELECT * FROM `project.dataset.raw_events`;

-- Query benefits: partition pruning + cluster pruning
-- Only scans partitions matching WHERE clause
SELECT customer_id, COUNT(*)
FROM `project.dataset.fct_events`
WHERE event_timestamp BETWEEN '2026-01-01' AND '2026-01-31'
  AND event_type = 'purchase'
GROUP BY customer_id;

-- Check bytes scanned reduction
-- Target: 90%+ reduction vs unpartitioned table
```

### Warehouse Sizing Strategy (Snowflake)

```
Workload Type          Recommended Size     Auto-Suspend    Concurrency
─────────────          ────────────────     ────────────    ───────────
Dashboard queries      X-Small/Small        60s             Auto-scale (max 3)
Analyst ad-hoc         Medium               300s            1 cluster
dbt daily build        Large                Immediate       1 cluster
Data science / ML      X-Large+             Immediate       1 cluster

Key: separate workloads into different warehouses
     to prevent resource contention and enable per-workload billing
```

## Anti-Patterns

1. **Scanning full tables** — always partition by date; a full scan of a 1TB table costs 10-50x more than a pruned scan
2. **Too many clustering keys** — 2-4 keys maximum; more keys reduce clustering effectiveness
3. **Oversized warehouses** — bigger does not always mean faster; profile first, right-size second
4. **Ignoring spill-to-disk** — queries spilling to remote storage are 10-100x slower; increase warehouse size or optimize query
5. **Materializing volatile data** — materialized views on rapidly changing tables cause constant refresh overhead

## Quality Checklist

- [ ] Large tables (>1B rows) partitioned by date column
- [ ] Clustering keys set on top 2-3 filter/join columns
- [ ] Query profile reviewed for top 10 slowest queries monthly
- [ ] Spill-to-disk queries identified and optimized (increase size or rewrite)
- [ ] Materialized views created for expensive dashboard aggregations
- [ ] Warehouses auto-suspended when idle (60-300s)
- [ ] Workloads separated into dedicated warehouses
- [ ] Result cache hit rate >50% for repeated analytical queries
- [ ] Bytes scanned tracked and reduced quarter-over-quarter
- [ ] Unused tables/views identified and dropped quarterly
