---
license: Apache-2.0
name: airflow-dag-orchestrator
description: 'Apache Airflow DAGs, operators, SLA monitoring, and workflow orchestration. Activate on: Airflow, DAG, operator, sensor, scheduler, task dependency, SLA, backfill, XCom. NOT for: dbt transformations (use dbt-analytics-engineer), streaming pipelines (use streaming-pipeline-architect).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,airflow:*)
category: Agent & Orchestration
tags:
  - airflow
  - orchestration
  - dag
  - scheduling
  - workflow
pairs-with:
  - skill: dbt-analytics-engineer
    reason: Airflow commonly orchestrates dbt runs
  - skill: data-quality-guardian
    reason: Quality checks run as Airflow tasks
  - skill: streaming-pipeline-architect
    reason: Batch orchestration complements streaming pipelines
---

# Airflow DAG Orchestrator

Design and operate Apache Airflow DAGs for reliable data pipeline orchestration with proper dependency management, SLAs, and monitoring.

## Activation Triggers

**Activate on:** "Airflow", "DAG", "operator", "sensor", "scheduler", "task dependency", "SLA", "backfill", "XCom", "TaskFlow API", "MWAA", "Cloud Composer"

**NOT for:** dbt model execution → `dbt-analytics-engineer` (though Airflow can trigger dbt) | Stream processing → `streaming-pipeline-architect` | Workflow engine (Temporal) → `distributed-transaction-manager`

## Quick Start

1. **Define DAG** — use TaskFlow API (`@dag`, `@task` decorators) for Python-native DAGs
2. **Set schedule** — cron or timetable, with `catchup=False` unless backfill is intentional
3. **Configure retries** — `retries=2`, `retry_delay=timedelta(minutes=5)` on every task
4. **Add SLAs** — `sla=timedelta(hours=2)` on critical path tasks
5. **Test locally** — `airflow dags test my_dag 2026-01-01` before deploying

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Airflow** | Apache Airflow 2.10+, MWAA, Cloud Composer 3 |
| **Operators** | BashOperator, PythonOperator, KubernetesPodOperator |
| **Providers** | apache-airflow-providers-{snowflake, google, aws, dbt-cloud} |
| **Executors** | CeleryExecutor, KubernetesExecutor, LocalExecutor |
| **Monitoring** | SLA misses, task duration, Airflow metrics → Prometheus |

## Architecture Patterns

### TaskFlow API DAG

```python
from airflow.decorators import dag, task
from datetime import datetime, timedelta

@dag(
    schedule="0 6 * * *",          # daily at 6am UTC
    start_date=datetime(2026, 1, 1),
    catchup=False,
    default_args={
        "retries": 2,
        "retry_delay": timedelta(minutes=5),
        "sla": timedelta(hours=2),
    },
    tags=["finance", "daily"],
)
def daily_revenue_pipeline():

    @task()
    def extract_payments() -> dict:
        """Extract from Stripe API"""
        data = stripe_client.list_payments(date=today())
        return {"count": len(data), "path": "s3://raw/payments/"}

    @task()
    def extract_orders() -> dict:
        """Extract from Shopify API"""
        data = shopify_client.list_orders(date=today())
        return {"count": len(data), "path": "s3://raw/orders/"}

    @task()
    def transform(payments: dict, orders: dict) -> str:
        """Join and transform in DuckDB"""
        result_path = run_duckdb_transform(payments["path"], orders["path"])
        return result_path

    @task()
    def load(path: str):
        """Load to Snowflake"""
        snowflake_copy_into("fct_revenue", path)

    # Define dependencies via function calls
    payments = extract_payments()
    orders = extract_orders()
    transformed = transform(payments, orders)
    load(transformed)

daily_revenue_pipeline()
```

### Dynamic Task Mapping (Fan-Out/Fan-In)

```python
@task()
def get_partitions() -> list[str]:
    return ["2026-01-01", "2026-01-02", "2026-01-03"]

@task()
def process_partition(partition_date: str) -> dict:
    """Runs in parallel for each partition"""
    return {"date": partition_date, "rows": process(partition_date)}

@task()
def aggregate(results: list[dict]):
    """Fan-in: receives all partition results"""
    total = sum(r["rows"] for r in results)
    log.info(f"Processed {total} total rows")

# Dynamically maps process_partition across all partitions
partitions = get_partitions()
results = process_partition.expand(partition_date=partitions)
aggregate(results)
```

### dbt + Airflow Integration

```python
from airflow.operators.bash import BashOperator
from cosmos import DbtDag, ProjectConfig, ProfileConfig

# Option 1: cosmos (recommended)
dbt_dag = DbtDag(
    project_config=ProjectConfig("/opt/airflow/dbt/"),
    profile_config=ProfileConfig(
        profile_name="default",
        target_name="prod",
    ),
    schedule="@daily",
    dag_id="dbt_daily",
)

# Option 2: BashOperator (simple)
dbt_run = BashOperator(
    task_id="dbt_run",
    bash_command="cd /opt/airflow/dbt && dbt build --select tag:daily",
)
```

## Anti-Patterns

1. **Fat tasks** — tasks should be atomic units; do not put extract+transform+load in one task
2. **XCom for large data** — XCom is for metadata (paths, counts); pass data via S3/GCS, not XCom pickles
3. **catchup=True by accident** — unless you want backfill, set `catchup=False`; otherwise Airflow runs every missed interval
4. **No retries** — transient failures are common; always set `retries >= 1` with a delay
5. **Top-level code in DAG files** — DAG files are parsed every 30s; heavy imports or API calls at module level slow the scheduler

## Quality Checklist

- [ ] TaskFlow API used for Python-native DAGs (not legacy operator chaining)
- [ ] `catchup=False` unless backfill is intentional
- [ ] Retries configured on all tasks (minimum 1 retry)
- [ ] SLA set on critical path tasks
- [ ] XCom passes references (S3 paths), not data payloads
- [ ] Dynamic task mapping used for fan-out parallelism
- [ ] DAG tested locally with `airflow dags test` before deployment
- [ ] Task idempotency: re-running a task produces the same result
- [ ] Alerting configured for task failures and SLA misses
- [ ] DAG tags applied for filtering in Airflow UI
