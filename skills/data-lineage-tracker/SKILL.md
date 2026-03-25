---
license: Apache-2.0
name: data-lineage-tracker
description: "OpenLineage, DataHub, Marquez for data lineage tracking and impact analysis. Activate on: data lineage, OpenLineage, DataHub, Marquez, impact analysis, data catalog, column lineage, data discovery. NOT for: data quality validation (use data-quality-guardian), dbt documentation (use dbt-analytics-engineer)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,docker:*)
category: Data & Analytics
tags:
  - data-lineage
  - openlineage
  - datahub
  - data-catalog
  - impact-analysis
pairs-with:
  - skill: data-quality-guardian
    reason: Lineage traces quality issues to root cause
  - skill: dbt-analytics-engineer
    reason: dbt generates lineage metadata automatically
  - skill: airflow-dag-orchestrator
    reason: Airflow emits OpenLineage events per task
---

# Data Lineage Tracker

Implement end-to-end data lineage tracking using OpenLineage, DataHub, and Marquez for impact analysis, debugging, and compliance.

## Activation Triggers

**Activate on:** "data lineage", "OpenLineage", "DataHub", "Marquez", "impact analysis", "data catalog", "column lineage", "data discovery", "data provenance", "downstream impact"

**NOT for:** Data quality checks → `data-quality-guardian` | dbt model documentation → `dbt-analytics-engineer` | Schema evolution → `schema-evolution-manager`

## Quick Start

1. **Choose platform** — DataHub (full catalog + lineage), Marquez (lineage-focused), Amundsen, OpenMetadata
2. **Instrument pipelines** — integrate OpenLineage with Airflow, Spark, and dbt for automatic lineage
3. **Capture column-level lineage** — trace which source columns feed which target columns
4. **Build impact analysis** — before changing a table, see all downstream consumers
5. **Integrate with incidents** — link data quality alerts to lineage for root cause analysis

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Lineage Standard** | OpenLineage 1.x (open standard, LFAI) |
| **Catalogs** | DataHub 0.14+, OpenMetadata 1.5+, Amundsen |
| **Lineage Backend** | Marquez (OpenLineage reference), DataHub lineage |
| **Integrations** | Airflow OpenLineage, Spark OpenLineage, dbt, Great Expectations |
| **Visualization** | DataHub lineage graph, Marquez UI, dbt docs |

## Architecture Patterns

### OpenLineage Event Flow

```
Airflow Task              Spark Job                 dbt Model
     │                         │                         │
     ├─ START event ──→        ├─ START event ──→        ├─ START event ──→
     │                         │                         │
     ├─ RUNNING event ─→       ├─ RUNNING event ─→       │
     │                         │                         │
     ├─ COMPLETE event ─→      ├─ COMPLETE event ─→      ├─ COMPLETE event ─→
     │  (with I/O datasets)    │  (with I/O datasets)    │  (with I/O datasets)
     ↓                         ↓                         ↓
              ┌────────────────────────────────────┐
              │     OpenLineage Backend            │
              │  (Marquez / DataHub / custom)      │
              │                                    │
              │  Stores: job runs, datasets,       │
              │  input/output relationships,       │
              │  column-level lineage              │
              └────────────────────────────────────┘
```

### Impact Analysis Query

```python
# DataHub GraphQL: find all downstream dependencies of a dataset
query = """
{
  dataset(urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,prod.fct_orders,PROD)") {
    downstream: relationships(
      input: { types: ["DownstreamOf"], direction: INCOMING, count: 50 }
    ) {
      relationships {
        entity {
          urn
          ... on Dataset {
            name
            platform { name }
            properties { description }
          }
        }
      }
    }
  }
}
"""

# Result: all dashboards, models, and exports that depend on fct_orders
# Use this BEFORE making schema changes
```

### Column-Level Lineage

```
Source Tables                  Transformation              Target Table
─────────────                 ──────────────              ────────────
raw_payments.amount    ──→    SUM(amount)           ──→  fct_revenue.total_revenue
raw_payments.currency  ──→    exchange_rate_convert  ──→  fct_revenue.total_revenue_usd
raw_orders.order_id    ──→    JOIN key              ──→  fct_revenue.order_id
raw_customers.name     ──→    COALESCE(name, email) ──→  fct_revenue.customer_name

Column-level lineage answers:
  "Where does fct_revenue.total_revenue_usd come from?"
  → raw_payments.amount + raw_payments.currency via exchange_rate_convert
```

## Anti-Patterns

1. **Manual lineage documentation** — manually maintained lineage diagrams go stale immediately; automate via OpenLineage
2. **Table-level only** — table lineage is not enough; column-level lineage is required for meaningful impact analysis
3. **No integration with incidents** — lineage is most valuable during incidents; link quality alerts to lineage graph
4. **Lineage without ownership** — every dataset in the catalog must have an owner team for accountability
5. **Collecting without using** — lineage data is useless if nobody queries it; embed impact analysis in CI and change management

## Quality Checklist

- [ ] OpenLineage integrated with Airflow, Spark, and dbt
- [ ] Column-level lineage captured (not just table-level)
- [ ] All datasets have assigned owners in the catalog
- [ ] Impact analysis run before schema changes (CI check)
- [ ] Lineage graph accessible via UI (DataHub, Marquez)
- [ ] Data quality alerts link to lineage for root cause tracing
- [ ] Cross-platform lineage works (e.g., Kafka → Spark → Snowflake)
- [ ] Lineage metadata refreshed on every pipeline run (not periodic batch)
- [ ] Search and discovery enabled: analysts can find datasets by keyword
- [ ] Retention policy on lineage events (keep 90 days of run history)
