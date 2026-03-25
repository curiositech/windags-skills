---
license: Apache-2.0
name: data-cost-optimizer
description: "Warehouse cost reduction, auto-scaling, query optimization, and lifecycle policies for data infrastructure. Activate on: data cost, warehouse credits, cost reduction, auto-scaling, lifecycle policy, cold storage, cost monitoring, resource optimization. NOT for: query performance tuning (use data-warehouse-optimizer), batch job optimization (use batch-processing-optimizer)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,snowsql:*,bq:*,aws:*)
category: Data & Analytics
tags:
  - cost-optimization
  - warehouse-cost
  - auto-scaling
  - lifecycle-policy
  - finops
pairs-with:
  - skill: data-warehouse-optimizer
    reason: Query optimization directly reduces compute costs
  - skill: lakehouse-architect
    reason: Lakehouse storage is dramatically cheaper than warehouse storage
  - skill: airflow-dag-orchestrator
    reason: Scheduling optimization reduces compute costs
---

# Data Cost Optimizer

Reduce data infrastructure costs through warehouse right-sizing, storage lifecycle policies, query optimization, and FinOps practices.

## Activation Triggers

**Activate on:** "data cost", "warehouse credits", "cost reduction", "auto-scaling", "lifecycle policy", "cold storage", "cost monitoring", "Snowflake credits", "BigQuery slots", "FinOps"

**NOT for:** Query performance tuning → `data-warehouse-optimizer` | Batch job resource sizing → `batch-processing-optimizer` | Infrastructure provisioning → relevant DevOps skill

## Quick Start

1. **Audit current spend** — break down costs by warehouse/project, compute vs storage, team/department
2. **Identify waste** — idle warehouses, full table scans, duplicate data, over-provisioned resources
3. **Implement auto-scaling** — auto-suspend idle warehouses, auto-scale for concurrency peaks
4. **Apply lifecycle policies** — move old data to cheaper storage tiers automatically
5. **Set budgets and alerts** — per-team cost budgets with alerts at 80% and 100%

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Snowflake** | Resource monitors, auto-suspend, warehouse sizing, credit tracking |
| **BigQuery** | Slot reservations, flat-rate vs on-demand, BI Engine, editions |
| **Storage** | S3 lifecycle (Standard → IA → Glacier), GCS Nearline/Coldline |
| **Monitoring** | Snowflake Account Usage, BigQuery INFORMATION_SCHEMA, Cost Explorer |
| **FinOps** | Kubecost, Datadog Cloud Cost, custom dashboards |

## Architecture Patterns

### Snowflake Cost Control Framework

```sql
-- 1. Resource monitor: alert at 80%, suspend at 100%
CREATE RESOURCE MONITOR monthly_budget
  WITH CREDIT_QUOTA = 5000
  FREQUENCY = MONTHLY
  START_TIMESTAMP = IMMEDIATELY
  TRIGGERS
    ON 80 PERCENT DO NOTIFY
    ON 100 PERCENT DO SUSPEND;

ALTER WAREHOUSE analytics_wh SET RESOURCE_MONITOR = monthly_budget;

-- 2. Auto-suspend idle warehouses
ALTER WAREHOUSE analytics_wh SET
  AUTO_SUSPEND = 60          -- suspend after 60s idle
  AUTO_RESUME = TRUE
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 3      -- auto-scale up to 3 clusters
  SCALING_POLICY = 'ECONOMY'; -- prefer queue over new cluster

-- 3. Find expensive queries
SELECT
  query_id,
  user_name,
  warehouse_name,
  total_elapsed_time / 1000 AS seconds,
  bytes_scanned / (1024*1024*1024) AS gb_scanned,
  credits_used_cloud_services
FROM snowflake.account_usage.query_history
WHERE start_time > DATEADD(day, -7, CURRENT_TIMESTAMP)
ORDER BY credits_used_cloud_services DESC
LIMIT 20;
```

### Storage Lifecycle Optimization

```
Data Age        Storage Tier           Cost (S3)        Access
──────────      ────────────           ─────────        ──────
0-30 days       Standard               $0.023/GB        Frequent
30-90 days      Infrequent Access      $0.0125/GB       Occasional
90-365 days     Glacier Instant        $0.004/GB        Rare
1-3 years       Glacier Flexible       $0.0036/GB       Archive
3+ years        Glacier Deep Archive   $0.00099/GB      Compliance only

Savings: moving 10TB from Standard to lifecycle-managed
  Before: $230/mo
  After:  ~$50/mo (78% reduction)
```

### Cost Attribution Dashboard

```
┌─────────────────────────────────────────────────┐
│  Monthly Data Infrastructure Cost: $12,450      │
│                                                 │
│  By Team:                                       │
│    Analytics    ████████████████  $5,200 (42%)   │
│    Data Eng     ██████████       $3,100 (25%)   │
│    ML Platform  ████████        $2,500 (20%)    │
│    Ad-hoc       ████            $1,650 (13%)    │
│                                                 │
│  By Category:                                   │
│    Compute      █████████████   $7,500 (60%)    │
│    Storage      ██████          $3,200 (26%)    │
│    Egress       ███             $1,750 (14%)    │
│                                                 │
│  Top Optimization Opportunities:                │
│    1. Idle warehouse X-Large: $800/mo savings   │
│    2. Full-scan query by user@co: $400/mo       │
│    3. Duplicate staging tables: $300/mo storage  │
└─────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **No cost attribution** — without per-team/project cost tracking, nobody owns the bill and waste accumulates
2. **Over-provisioned warehouses** — X-Large warehouse for queries that finish in 2s on Small wastes 8x credits
3. **Storing everything in hot tier** — data older than 90 days rarely needs hot storage; lifecycle policies save 70-90%
4. **Ignoring failed/retried queries** — failed queries still consume credits; fix root cause instead of retrying
5. **Flat-rate without analysis** — BigQuery flat-rate or Snowflake capacity pricing saves money only at scale; analyze before committing

## Quality Checklist

- [ ] Cost breakdown by team/project/warehouse tracked monthly
- [ ] Resource monitors with alerts at 80% and hard stops at 100%
- [ ] All warehouses auto-suspend when idle (60-300s)
- [ ] Storage lifecycle policies applied to all buckets/stages
- [ ] Top 20 expensive queries reviewed and optimized monthly
- [ ] Idle/unused warehouses and tables identified and eliminated
- [ ] Per-team budgets set with automated alerting
- [ ] Compute vs storage cost ratio analyzed quarterly
- [ ] Reserved/committed pricing evaluated for stable workloads
- [ ] Cost optimization results tracked: target 10-20% reduction per quarter
