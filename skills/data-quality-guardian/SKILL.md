---
license: Apache-2.0
name: data-quality-guardian
description: "Great Expectations, dbt tests, anomaly detection, and data contracts for data quality. Activate on: data quality, data validation, Great Expectations, data contract, anomaly detection, SLA, freshness check, schema validation. NOT for: dbt model structure (use dbt-analytics-engineer), schema evolution (use schema-evolution-manager)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,dbt:*)
category: Data & Analytics
tags:
  - data-quality
  - testing
  - great-expectations
  - data-contracts
  - anomaly-detection
pairs-with:
  - skill: dbt-analytics-engineer
    reason: dbt tests are a primary data quality enforcement tool
  - skill: data-lineage-tracker
    reason: Quality issues traced via lineage to root cause
  - skill: airflow-dag-orchestrator
    reason: Quality checks run as orchestrated pipeline steps
---

# Data Quality Guardian

Implement comprehensive data quality frameworks with automated validation, anomaly detection, data contracts, and SLA monitoring.

## Activation Triggers

**Activate on:** "data quality", "data validation", "Great Expectations", "data contract", "anomaly detection", "SLA", "freshness check", "schema validation", "data observability", "Soda", "elementary"

**NOT for:** dbt project layout → `dbt-analytics-engineer` | Schema evolution strategy → `schema-evolution-manager` | Data migration validation → `data-migration-specialist`

## Quick Start

1. **Define data contracts** — agree on schema, freshness, volume, and value ranges with upstream producers
2. **Implement tests** — dbt tests for SQL models, Great Expectations for raw/external data
3. **Monitor freshness** — alert when source tables are stale beyond SLA
4. **Detect anomalies** — statistical checks for volume, distribution, and null rate changes
5. **Build quality dashboard** — centralized view of all quality metrics across pipelines

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Testing** | dbt tests, Great Expectations 1.x, Soda Core 3.x |
| **Observability** | elementary (dbt), Monte Carlo, Anomalo |
| **Contracts** | Soda data contracts, dbt model contracts, Protobuf schemas |
| **Anomaly Detection** | elementary anomaly monitors, custom z-score, Prophet |
| **Alerting** | Slack/PagerDuty integration, SLA miss alerts |

## Architecture Patterns

### Multi-Layer Quality Checks

```
Raw Data (Landing)
    ↓
Layer 1: Schema Validation
    - Column types match contract
    - No unexpected NULLs in required fields
    - Row count within expected range
    ↓
Layer 2: Business Rule Validation
    - Referential integrity (FK relationships hold)
    - accepted_values constraints
    - Custom SQL assertions (e.g., revenue >= 0)
    ↓
Layer 3: Statistical Anomaly Detection
    - Row count deviation from 7-day rolling average
    - Null rate spike detection
    - Distribution shift (KL divergence)
    ↓
Layer 4: Freshness & SLA Monitoring
    - Source loaded within 2 hours
    - Downstream models built within 4 hours
    - Dashboard data <6 hours old
```

### Data Contract YAML

```yaml
# contracts/payments-contract.yml
contract:
  name: stripe_payments
  owner: payments-team
  version: "2.0"
  sla:
    freshness: 2h          # must be updated within 2 hours
    volume_min: 1000        # at least 1000 rows per day
    volume_max: 500000      # no more than 500k (anomaly if exceeded)
  schema:
    - name: payment_id
      type: string
      required: true
      unique: true
    - name: amount_cents
      type: integer
      required: true
      checks:
        - type: range
          min: 0
          max: 10000000     # $100k max
    - name: status
      type: string
      required: true
      checks:
        - type: accepted_values
          values: [succeeded, failed, pending, refunded]
    - name: created_at
      type: timestamp
      required: true
      checks:
        - type: not_in_future
```

### Anomaly Detection with elementary

```yaml
# dbt model with elementary anomaly monitors
version: 2
models:
  - name: fct_orders
    tests:
      - elementary.volume_anomalies:
          timestamp_column: created_at
          where: "created_at > dateadd(day, -30, current_date())"
          sensitivity: 3    # z-score threshold
      - elementary.column_anomalies:
          column_name: total_amount
          where: "created_at > dateadd(day, -30, current_date())"
      - elementary.freshness_anomalies:
          timestamp_column: _loaded_at
          sensitivity: 2
```

## Anti-Patterns

1. **Testing only in production** — run quality checks in CI on sample data before merging; do not discover issues in production
2. **Alert fatigue** — too many low-severity alerts get ignored; tier alerts: P1 (data loss), P2 (quality regression), P3 (informational)
3. **No contract with upstream** — without an agreed contract, schema changes break pipelines silently
4. **Static thresholds only** — hardcoded "row count > 1000" breaks during holidays; use statistical anomaly detection
5. **Quality checks at the end** — validate at each layer (landing, staging, marts); catching errors early is cheaper

## Quality Checklist

- [ ] Data contracts defined for all critical sources (schema, freshness, volume)
- [ ] dbt tests on every model: `unique`, `not_null`, `accepted_values`, `relationships`
- [ ] Freshness monitoring with SLA thresholds and alerting
- [ ] Anomaly detection on row counts, null rates, and value distributions
- [ ] Quality dashboard shows current status across all pipelines
- [ ] Alert severity tiered (P1/P2/P3) to prevent fatigue
- [ ] Quality checks run in CI (pre-merge) and production (post-load)
- [ ] Root cause analysis supported via data lineage integration
- [ ] Monthly data quality review with trending metrics
- [ ] Upstream teams notified within 15 minutes of contract violations
