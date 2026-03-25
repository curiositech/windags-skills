---
license: Apache-2.0
name: lakehouse-architect
description: "Delta Lake, Apache Iceberg, Hudi for ACID transactions on object storage. Activate on: lakehouse, Delta Lake, Iceberg, Hudi, table format, ACID on S3, time travel, data lake, open table format. NOT for: warehouse query tuning (use data-warehouse-optimizer), streaming ingestion (use streaming-pipeline-architect)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,spark-submit:*)
category: Data & Analytics
tags:
  - lakehouse
  - delta-lake
  - iceberg
  - data-lake
  - object-storage
pairs-with:
  - skill: data-warehouse-optimizer
    reason: Lakehouses complement or replace traditional warehouses
  - skill: streaming-pipeline-architect
    reason: Streaming data lands in lakehouse tables
  - skill: data-cost-optimizer
    reason: Lakehouse architecture dramatically reduces storage costs
---

# Lakehouse Architect

Design data lakehouse architectures using Delta Lake, Apache Iceberg, or Apache Hudi for ACID transactions, time travel, and schema evolution on object storage.

## Activation Triggers

**Activate on:** "lakehouse", "Delta Lake", "Apache Iceberg", "Hudi", "table format", "ACID on S3", "time travel", "data lake", "open table format", "Databricks", "catalog"

**NOT for:** Warehouse query tuning → `data-warehouse-optimizer` | Streaming pipeline design → `streaming-pipeline-architect` | Data quality rules → `data-quality-guardian`

## Quick Start

1. **Choose table format** — Iceberg (vendor-neutral, widest engine support), Delta Lake (Databricks ecosystem), Hudi (Uber/AWS)
2. **Set up catalog** — Unity Catalog, AWS Glue, Nessie, or Hive Metastore for table discovery
3. **Design medallion layers** — Bronze (raw), Silver (cleaned), Gold (business-ready)
4. **Enable compaction** — schedule file compaction to avoid small file problem
5. **Configure retention** — time travel retention + vacuum/expire snapshots for cost control

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Table Formats** | Apache Iceberg 1.7+, Delta Lake 3.x, Apache Hudi 1.x |
| **Compute** | Spark 3.5+, Trino, DuckDB, Snowflake (Iceberg), Flink |
| **Catalogs** | Unity Catalog, AWS Glue, Nessie, REST Catalog, Polaris |
| **Storage** | S3, GCS, ADLS, MinIO |
| **Managed** | Databricks Lakehouse, AWS Lake Formation, Snowflake Iceberg |

## Architecture Patterns

### Medallion Architecture

```
Bronze (Raw)                Silver (Cleaned)           Gold (Business)
─────────────               ────────────────           ───────────────
Raw JSON/CSV/Parquet  →     Typed, deduplicated   →    Aggregated, modeled
Append-only           →     Merge/upsert          →    Materialized views
Schema-on-read        →     Schema enforced        →    Star schema
Full history          →     Latest + SCD Type 2    →    Pre-aggregated metrics

Storage: S3/GCS               All layers use Iceberg/Delta
Format:  Parquet               ACID transactions at each layer
```

### Apache Iceberg Table Management

```sql
-- Create Iceberg table with partitioning
CREATE TABLE catalog.silver.orders (
  order_id    STRING,
  customer_id STRING,
  amount      DECIMAL(10,2),
  status      STRING,
  order_date  DATE,
  _loaded_at  TIMESTAMP
)
USING iceberg
PARTITIONED BY (days(order_date))
TBLPROPERTIES (
  'write.metadata.delete-after-commit.enabled' = 'true',
  'write.metadata.previous-versions-max' = '100'
);

-- Upsert (merge) new data
MERGE INTO catalog.silver.orders t
USING staging.new_orders s
ON t.order_id = s.order_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

-- Time travel: query as of yesterday
SELECT * FROM catalog.silver.orders
  FOR SYSTEM_TIME AS OF TIMESTAMP '2026-03-19 00:00:00';

-- Maintenance: compact small files
CALL catalog.system.rewrite_data_files('silver.orders');
CALL catalog.system.expire_snapshots('silver.orders', TIMESTAMP '2026-03-01');
```

### Table Format Comparison

```
Feature              Iceberg         Delta Lake      Hudi
──────────           ───────         ──────────      ────
ACID transactions    Yes             Yes             Yes
Time travel          Yes             Yes             Yes
Schema evolution     Full            Full            Full
Partition evolution  Yes (hidden)    No (requires    Limited
                                     rewrite)
Engine support       Widest          Spark/Databricks Spark/Flink
Catalog              REST/Nessie     Unity/Hive      Hive
Community            Apache          Linux Foundation Apache
Best for             Multi-engine    Databricks users CDC workloads
```

## Anti-Patterns

1. **Small files** — ingesting many tiny files (< 128MB) destroys read performance; run compaction on schedule
2. **No vacuum/expiration** — time travel metadata accumulates forever; set retention policy and schedule cleanup
3. **Partitioning by high cardinality** — partitioning by user_id creates millions of partitions; use date or low-cardinality columns
4. **Ignoring catalog** — without a catalog, tables are just files on S3 that nobody can discover; always register in a catalog
5. **Mixing table formats** — pick one format per lakehouse; mixing Iceberg and Delta creates tooling and governance complexity

## Quality Checklist

- [ ] Table format chosen consistently (Iceberg recommended for multi-engine)
- [ ] Catalog registered for all tables (discovery and governance)
- [ ] Medallion architecture: Bronze → Silver → Gold layers
- [ ] Partition strategy uses low-cardinality columns (date, region)
- [ ] File compaction scheduled (daily or hourly for high-volume tables)
- [ ] Snapshot expiration configured (retain 7-30 days of time travel)
- [ ] Schema evolution tested (add columns, change types where safe)
- [ ] ACID merge/upsert used instead of overwrite for Silver layer
- [ ] Storage costs monitored per layer with lifecycle policies
- [ ] Query engines tested against lakehouse tables (Spark, Trino, DuckDB)
