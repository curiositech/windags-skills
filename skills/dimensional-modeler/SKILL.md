---
license: Apache-2.0
name: dimensional-modeler
description: "Star schema, snowflake schema, SCD types, and Kimball methodology for analytical data modeling. Activate on: dimensional model, star schema, snowflake schema, SCD, fact table, dimension table, Kimball, grain, surrogate key. NOT for: dbt implementation (use dbt-analytics-engineer), warehouse tuning (use data-warehouse-optimizer)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*)
category: Data & Analytics
tags:
  - dimensional-modeling
  - star-schema
  - kimball
  - fact-table
  - scd
pairs-with:
  - skill: dbt-analytics-engineer
    reason: dbt implements dimensional models as SQL transformations
  - skill: data-warehouse-optimizer
    reason: Physical model design affects warehouse query performance
  - skill: data-quality-guardian
    reason: Dimensional models need referential integrity tests
---

# Dimensional Modeler

Design analytical data models using Kimball methodology with star schemas, slowly changing dimensions, and proper grain definition.

## Activation Triggers

**Activate on:** "dimensional model", "star schema", "snowflake schema", "SCD", "fact table", "dimension table", "Kimball", "grain", "surrogate key", "conformed dimension", "bridge table"

**NOT for:** dbt SQL implementation → `dbt-analytics-engineer` | Warehouse performance tuning → `data-warehouse-optimizer` | OLTP schema design → relevant backend skill

## Quick Start

1. **Identify the business process** — what is being measured? (orders, sessions, payments)
2. **Declare the grain** — one row equals what? (one order line item, one daily snapshot, one event)
3. **Choose dimensions** — who, what, where, when, how (customer, product, store, date, channel)
4. **Define facts** — measurable quantities at the grain (amount, quantity, duration, count)
5. **Handle change** — SCD Type 1 (overwrite), Type 2 (versioned rows), Type 3 (previous column)

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Methodology** | Kimball, Inmon (Data Vault for staging) |
| **Schema Types** | Star schema, snowflake schema, galaxy schema |
| **SCD** | Type 0 (fixed), Type 1 (overwrite), Type 2 (versioned), Type 3 (column) |
| **Fact Types** | Transaction, periodic snapshot, accumulating snapshot, factless |
| **Implementation** | dbt, SQL DDL, modeling tools (dbtERD, dbdiagram.io) |

## Architecture Patterns

### Star Schema Design

```
                    ┌──────────────┐
                    │ dim_date     │
                    │──────────────│
                    │ date_key (PK)│
                    │ full_date    │
                    │ year, quarter│
                    │ month, week  │
                    │ is_holiday   │
                    └──────┬───────┘
                           │
┌──────────────┐    ┌──────┴───────┐    ┌──────────────┐
│ dim_customer │    │ fct_orders   │    │ dim_product  │
│──────────────│    │──────────────│    │──────────────│
│ customer_key │←───│ customer_key │───→│ product_key  │
│ customer_id  │    │ product_key  │    │ product_id   │
│ name         │    │ date_key     │    │ name         │
│ segment      │    │ store_key    │    │ category     │
│ region       │    │──────────────│    │ brand        │
└──────────────┘    │ quantity     │    └──────────────┘
                    │ unit_price   │
                    │ discount_amt │    ┌──────────────┐
                    │ total_amount │    │ dim_store    │
                    └──────┬───────┘    │──────────────│
                           │            │ store_key    │
                           └───────────→│ store_name   │
                                        │ city, state  │
                                        └──────────────┘

Grain: one row per order line item
Facts: quantity, unit_price, discount_amt, total_amount
```

### SCD Type 2 Implementation

```sql
-- dim_customer with SCD Type 2 (track history)
CREATE TABLE dim_customer (
  customer_key    BIGINT PRIMARY KEY,  -- surrogate key (auto-increment)
  customer_id     VARCHAR(50),          -- natural/business key
  name            VARCHAR(200),
  email           VARCHAR(200),
  segment         VARCHAR(50),
  region          VARCHAR(50),
  -- SCD Type 2 metadata
  effective_from  TIMESTAMP NOT NULL,
  effective_to    TIMESTAMP DEFAULT '9999-12-31',
  is_current      BOOLEAN DEFAULT TRUE
);

-- Merge pattern: close old record, insert new
-- When customer changes segment:
UPDATE dim_customer
SET effective_to = CURRENT_TIMESTAMP, is_current = FALSE
WHERE customer_id = 'CUST-123' AND is_current = TRUE;

INSERT INTO dim_customer (customer_id, name, email, segment, region,
                          effective_from, is_current)
VALUES ('CUST-123', 'Jane Doe', 'jane@co.com', 'Enterprise', 'West',
        CURRENT_TIMESTAMP, TRUE);

-- Query: joins always use surrogate key + is_current for latest
-- Historical analysis: join on surrogate key with date range overlap
```

### Fact Table Types

```
Transaction Fact           Periodic Snapshot         Accumulating Snapshot
─────────────────          ─────────────────         ─────────────────────
One row per event          One row per period        One row per lifecycle
Example: fct_orders        Example: fct_daily_       Example: fct_order_
                           inventory                  fulfillment

Grain: order line item     Grain: product x day      Grain: one order
Measures: amount, qty      Measures: qty_on_hand,    Measures: order_date,
                           qty_sold, qty_ordered      ship_date, deliver_date

Grows: continuously        Grows: daily/weekly       Updates: as lifecycle
                                                      stages complete
```

## Anti-Patterns

1. **No declared grain** — without explicit grain, fact tables become ambiguous; always document "one row = one ___"
2. **Natural keys as FKs** — use surrogate integer keys for joins (faster) and to support SCD Type 2 versioning
3. **Nulls in fact measures** — null quantities and amounts break aggregations; use 0 or create factless fact tables
4. **Snowflaking excessively** — normalizing dimensions into sub-dimensions slows queries; star schema (denormalized dims) is preferred for analytics
5. **Mixing grains in one fact** — daily summaries and individual transactions in the same table create confusion; separate fact tables per grain

## Quality Checklist

- [ ] Grain explicitly declared and documented for every fact table
- [ ] Surrogate keys used for all dimension PKs (not natural keys)
- [ ] Conformed dimensions shared across fact tables (dim_date, dim_customer)
- [ ] SCD type chosen per dimension attribute (Type 1 for non-critical, Type 2 for auditable)
- [ ] Fact measures are additive (summable across all dimensions) where possible
- [ ] Date dimension covers full range with fiscal calendar attributes
- [ ] No nulls in fact measures (use 0 or factless fact)
- [ ] Foreign key relationships tested (referential integrity)
- [ ] Model documented in ERD diagram (dbdiagram.io or dbtERD)
- [ ] Naming conventions consistent: `fct_` for facts, `dim_` for dimensions
