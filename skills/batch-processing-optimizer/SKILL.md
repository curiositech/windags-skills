---
license: Apache-2.0
name: batch-processing-optimizer
description: 'Spark, pandas, polars, DuckDB optimization for batch data processing. Activate on: batch processing, Spark optimization, polars, DuckDB, pandas performance, data frame, shuffle, partition, memory optimization. NOT for: streaming pipelines (use streaming-pipeline-architect), warehouse queries (use data-warehouse-optimizer).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,spark-submit:*)
category: Backend & Infrastructure
tags:
  - batch-processing
  - spark
  - polars
  - duckdb
  - performance
pairs-with:
  - skill: data-warehouse-optimizer
    reason: Batch outputs often load into warehouses
  - skill: airflow-dag-orchestrator
    reason: Airflow schedules batch processing jobs
  - skill: lakehouse-architect
    reason: Batch jobs read/write lakehouse tables
---

# Batch Processing Optimizer

Optimize batch data processing workloads using Spark, Polars, DuckDB, and pandas with focus on memory efficiency, parallelism, and cost reduction.

## Activation Triggers

**Activate on:** "batch processing", "Spark optimization", "Polars", "DuckDB", "pandas performance", "data frame", "shuffle optimization", "partition skew", "memory optimization", "out of memory"

**NOT for:** Real-time streaming → `streaming-pipeline-architect` | Warehouse SQL tuning → `data-warehouse-optimizer` | Pipeline orchestration → `airflow-dag-orchestrator`

## Quick Start

1. **Choose the right tool** — DuckDB for single-node analytics, Polars for DataFrames, Spark for distributed
2. **Profile first** — identify bottlenecks (shuffle, skew, memory) before optimizing
3. **Reduce data early** — filter and select columns as early as possible in the pipeline
4. **Avoid shuffles** — broadcast small tables, pre-partition data, use map-side joins
5. **Right-size resources** — match executor memory/cores to actual data size

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Distributed** | Apache Spark 3.5+, Dask, Ray |
| **Single-Node** | DuckDB 1.1+, Polars 1.x, pandas 2.2+ |
| **File Formats** | Parquet, Arrow IPC, Delta Lake, Iceberg |
| **Optimization** | AQE (Spark), lazy evaluation (Polars), columnar scans |
| **Cloud** | Databricks, EMR, Dataproc, serverless Spark |

## Architecture Patterns

### Tool Selection Decision Tree

```
Data Size?
  ├─ < 10 GB     → DuckDB (SQL) or Polars (DataFrame)
  │                 Single machine, zero setup, fastest iteration
  │
  ├─ 10-100 GB   → Polars (lazy) or DuckDB (out-of-core)
  │                 Still single machine with spill-to-disk
  │
  └─ > 100 GB    → Spark (distributed)
                    Multi-node cluster, shuffle-based joins

Complexity?
  ├─ SQL-centric  → DuckDB (fastest SQL engine for analytics)
  ├─ DataFrame    → Polars (10x faster than pandas, lazy evaluation)
  └─ Complex ML   → Spark + MLlib or Spark + Ray
```

### Spark Optimization Patterns

```python
from pyspark.sql import SparkSession
import pyspark.sql.functions as F

spark = SparkSession.builder \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .config("spark.sql.adaptive.skewJoin.enabled", "true") \
    .getOrCreate()

# GOOD: broadcast small dimension table (< 100MB)
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_dim_df), "key")

# GOOD: predicate pushdown — filter before join
orders = spark.read.parquet("s3://data/orders/") \
    .filter(F.col("order_date") >= "2026-01-01") \
    .select("order_id", "customer_id", "amount")  # column pruning

# BAD: collect() on large dataset — causes OOM on driver
# all_data = large_df.collect()  # NEVER do this

# GOOD: write partitioned output
result.repartition(200) \
    .write.mode("overwrite") \
    .partitionBy("order_date") \
    .parquet("s3://output/results/")
```

### Polars Lazy Evaluation

```python
import polars as pl

# Lazy mode: builds query plan, optimizes, then executes
result = (
    pl.scan_parquet("data/orders/*.parquet")  # lazy scan
    .filter(pl.col("order_date") >= "2026-01-01")
    .join(
        pl.scan_parquet("data/customers/*.parquet"),
        on="customer_id",
        how="inner"
    )
    .group_by("region")
    .agg([
        pl.col("amount").sum().alias("total_revenue"),
        pl.col("order_id").n_unique().alias("order_count"),
    ])
    .sort("total_revenue", descending=True)
    .collect()  # executes optimized plan
)

# Polars optimizes: predicate pushdown, projection pushdown,
# join reordering — all automatically via lazy evaluation
```

## Anti-Patterns

1. **pandas for >5GB** — pandas loads everything into memory; use Polars (lazy) or DuckDB for medium data, Spark for large
2. **Collect to driver** — `df.collect()` or `df.toPandas()` on large Spark DataFrames causes OOM; aggregate first
3. **Ignoring partition skew** — one partition with 10x more data than others bottlenecks the entire job; use AQE or salting
4. **Reading all columns** — always select only needed columns; Parquet columnar format skips unused columns entirely
5. **Tiny output files** — too many small output files (< 128MB) slow downstream reads; coalesce before writing

## Quality Checklist

- [ ] Tool matches data size (DuckDB/Polars < 100GB, Spark > 100GB)
- [ ] Columns pruned early (select only what is needed)
- [ ] Filters pushed down to scan level (predicate pushdown)
- [ ] Small tables broadcast in joins (< 100MB)
- [ ] Spark AQE enabled (adaptive query execution)
- [ ] No `collect()` on large datasets (aggregate before collecting)
- [ ] Output files sized 128MB-1GB (coalesce/repartition before write)
- [ ] Partition skew monitored and mitigated (salting or AQE)
- [ ] Job profiled: Spark UI stages, Polars `.explain()`, DuckDB `EXPLAIN ANALYZE`
- [ ] Memory sized appropriately: executor memory >= 2x largest partition
