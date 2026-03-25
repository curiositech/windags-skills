---
license: Apache-2.0
name: dbt-analytics-engineer
description: "dbt Core/Cloud data transformations, testing, documentation, and CI/CD. Activate on: dbt, data transformation, analytics engineering, ref, source, staging model, mart, dbt test. NOT for: orchestration/scheduling (use airflow-dag-orchestrator), data warehouse tuning (use data-warehouse-optimizer)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,dbt:*,python:*)
category: Data & Analytics
tags:
  - dbt
  - analytics-engineering
  - data-transformation
  - sql
  - data-modeling
pairs-with:
  - skill: data-warehouse-optimizer
    reason: dbt models run on warehouses that need optimization
  - skill: data-quality-guardian
    reason: dbt tests are a core data quality enforcement mechanism
  - skill: dimensional-modeler
    reason: dbt marts implement dimensional models
---

# dbt Analytics Engineer

Build, test, and document data transformations using dbt Core/Cloud with modern analytics engineering practices.

## Decision Points

### Materialization Selection Strategy
```
Model Size & Query Pattern → Materialization Choice

├── < 1M rows, rarely queried
│   └── VIEW (ephemeral if only intermediate)
├── 1M-10M rows, daily queries
│   └── TABLE (full refresh nightly)
├── > 10M rows, frequent queries
│   ├── Append-only data → INCREMENTAL (append strategy)
│   ├── Updates/deletes → INCREMENTAL (merge strategy)
│   └── Complex joins/aggregations → TABLE with incremental source prep
└── Dev/staging environment
    └── Always VIEW (cost optimization)
```

### Model Layer Assignment
```
Data Characteristics → Layer Placement

├── Raw source mapping (1:1)
│   └── staging/ (stg_ prefix, light cleaning only)
├── Business logic, joins, calculations
│   └── intermediate/ (int_ prefix, reusable components)
├── Final consumption ready
│   ├── Analytics/BI → marts/ (fct_, dim_ prefixes)
│   └── ML features → features/ (fea_ prefix)
└── One-off analysis
    └── analysis/ (not materialized)
```

### Testing Strategy Selection
```
Model Criticality & Data Patterns → Test Coverage

├── Core business metrics (revenue, customers)
│   └── COMPREHENSIVE: unique, not_null, relationships, custom business rules
├── Supporting dimensions
│   └── STANDARD: unique, not_null, accepted_values
├── Intermediate models
│   └── MINIMAL: not_null on join keys, row count > 0
└── Development models
    └── BASIC: not_null on primary key only
```

## Failure Modes

### 1. Circular Reference Death Spiral
**Detection Rule:** `dbt compile` fails with "Cycle detected" error
**Symptoms:** Model A refs Model B, which refs Model C, which refs Model A
**Fix:** Break cycle by moving shared logic to new intermediate model that both reference

### 2. Incremental Model State Corruption  
**Detection Rule:** `dbt run` succeeds but row counts decrease unexpectedly on incremental models
**Symptoms:** Late-arriving data missed, duplicates created, or filter logic excludes existing records
**Fix:** `dbt run --full-refresh` to rebuild, then fix filter conditions and unique_key configuration

### 3. Test Suite Performance Collapse
**Detection Rule:** `dbt test` takes >30min or times out on warehouse
**Symptoms:** Tests query entire fact tables without limits, complex join tests on unindexed columns
**Fix:** Add `limit: 100000` to expensive tests, use `dbt test --select config.severity:error` for CI

### 4. Documentation Debt Explosion
**Detection Rule:** >50% of models/columns lack descriptions in `dbt docs generate` output
**Symptoms:** New team members can't understand model purpose, business users avoid self-service
**Fix:** Require `description` in CI checks, template model YAML generation, quarterly doc reviews

### 5. Macro Spaghetti Anti-Pattern
**Detection Rule:** Macros calling other macros >3 levels deep, single macro >100 lines
**Symptoms:** Impossible to debug Jinja errors, changes break unexpected downstream models
**Fix:** Flatten macro hierarchies, split complex macros, add macro unit tests with dbt-unit-testing

## Worked Examples

### Complete Source-to-Mart Workflow

**Scenario:** E-commerce orders data from Shopify API to revenue analytics

**Step 1: Source Configuration**
```yaml
# models/staging/shopify/_sources.yml
sources:
  - name: shopify_raw
    freshness:
      warn_after: {count: 6, period: hour}
    tables:
      - name: orders
        description: "Raw orders from Shopify API"
```

**Step 2: Staging Model (Decision: VIEW for <1M rows)**
```sql
-- models/staging/shopify/stg_shopify__orders.sql
SELECT
  order_id::varchar as order_id,
  customer_id::varchar as customer_id,
  order_date::date as order_date,
  total_amount::decimal(10,2) as total_amount,
  status::varchar as status,
  _loaded_at::timestamp as _loaded_at
FROM {{ source('shopify_raw', 'orders') }}
WHERE status != 'cancelled'  -- Business rule: exclude cancelled
```

**Step 3: Mart Model (Decision: INCREMENTAL for >10M rows, daily queries)**
```sql
-- models/marts/finance/fct_revenue.sql
{{
  config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge'  -- Handle late updates
  )
}}

SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  status,
  _loaded_at
FROM {{ ref('stg_shopify__orders') }}

{% if is_incremental() %}
  -- Only process recent data
  WHERE _loaded_at > (SELECT max(_loaded_at) FROM {{ this }})
{% endif %}
```

**Trade-off Analysis Made:**
- **Staging as VIEW:** Cost-efficient, <1M rows, simple transformation
- **Mart as INCREMENTAL:** 50M+ order rows, saves $200/day vs full refresh
- **Merge strategy:** Handles order status updates (shipped→delivered)

**What novice misses:** Using append strategy for updatable data, forgetting late-arriving data filters

## Quality Gates

- [ ] All models follow naming convention: `stg_`, `int_`, `fct_`, `dim_` prefixes
- [ ] Every model has primary key with `unique` and `not_null` tests
- [ ] Incremental models have `unique_key` and appropriate strategy (merge/append)
- [ ] All `{{ ref() }}` and `{{ source() }}` calls resolve without hardcoded table names
- [ ] Models >10M rows use incremental materialization with proper filter logic
- [ ] Every model and column has description in YAML schema file
- [ ] `dbt test` passes with zero failures on all error-level tests
- [ ] `dbt docs generate` produces complete lineage graph with no broken references
- [ ] CI runs `dbt build --select state:modified+` and completes in <15 minutes
- [ ] Source freshness checks configured with appropriate warn/error thresholds

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Orchestration/Scheduling:** DAG dependencies, cron jobs → Use `airflow-dag-orchestrator` instead  
- **Data Ingestion:** API extraction, CDC, streaming → Use `streaming-pipeline-architect` instead
- **Warehouse Optimization:** Query performance, indexing, partitioning → Use `data-warehouse-optimizer` instead
- **Data Catalog Management:** Business glossary, data governance → Use `data-governance-steward` instead
- **Real-time Analytics:** Sub-second latency, event streaming → Use `realtime-analytics-architect` instead

**Delegation Rules:**
- For warehouse-specific performance issues → `data-warehouse-optimizer`
- For data quality monitoring/alerting beyond dbt tests → `data-quality-guardian`
- For complex dimensional modeling decisions → `dimensional-modeler`