---
license: Apache-2.0
name: streaming-pipeline-architect
description: 'Kafka Streams, Flink, Spark Streaming, and CDC for real-time data pipelines. Activate on: streaming, Kafka Streams, Flink, Spark Streaming, CDC, Debezium, real-time pipeline, event stream processing. NOT for: message broker setup (use event-driven-architecture-expert), batch processing (use batch-processing-optimizer).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*,python:*)
category: Backend & Infrastructure
tags:
  - streaming
  - kafka-streams
  - flink
  - cdc
  - real-time
pairs-with:
  - skill: event-driven-architecture-expert
    reason: Streaming consumes from event-driven sources
  - skill: schema-evolution-manager
    reason: Stream schemas must evolve without breaking consumers
  - skill: lakehouse-architect
    reason: Streaming data lands in lakehouse tables
---

# Streaming Pipeline Architect

Design and build real-time data pipelines using Kafka Streams, Apache Flink, Spark Structured Streaming, and Change Data Capture.

## Activation Triggers

**Activate on:** "streaming pipeline", "Kafka Streams", "Flink", "Spark Streaming", "CDC", "Debezium", "real-time pipeline", "event stream processing", "stream-table join", "windowed aggregation"

**NOT for:** Message broker configuration → `event-driven-architecture-expert` | Batch ETL optimization → `batch-processing-optimizer` | Data warehouse loading → `data-warehouse-optimizer`

## Quick Start

1. **Identify streaming use case** — real-time dashboards, CDC replication, fraud detection, event enrichment
2. **Choose engine** — Kafka Streams (simple, JVM), Flink (complex, stateful), Spark (unified batch+stream)
3. **Design CDC pipeline** — Debezium captures DB changes → Kafka → stream processor → target
4. **Handle late data** — configure watermarks and allowed lateness for windowed operations
5. **Plan checkpointing** — enable exactly-once with Flink checkpoints or Kafka transactions

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Stream Processing** | Apache Flink 1.20+, Kafka Streams 3.8+, Spark Structured Streaming |
| **CDC** | Debezium 2.7+, Fivetran, Airbyte, Maxwell |
| **Managed** | Confluent Cloud, AWS Kinesis, GCP Dataflow |
| **Connectors** | Kafka Connect, Flink CDC connectors, Spark connectors |
| **State** | RocksDB (Flink/Kafka Streams), Delta Lake checkpoints |

## Architecture Patterns

### CDC Pipeline (Database → Kafka → Target)

```
PostgreSQL              Debezium               Kafka              Stream Processor
┌──────────┐     ┌─────────────────┐     ┌──────────┐     ┌─────────────────┐
│  WAL     │────→│  Debezium       │────→│  Topics  │────→│  Flink / KS     │
│ (logical │     │  (Kafka Connect)│     │  per     │     │  - Enrich       │
│  repl.)  │     │                 │     │  table   │     │  - Aggregate    │
└──────────┘     └─────────────────┘     └──────────┘     │  - Transform    │
                                                           └────────┬────────┘
                                                                    │
                                           ┌────────────────────────┤
                                           ↓                        ↓
                                    Elasticsearch           Snowflake / Delta
                                    (search index)          (analytics)
```

### Windowed Aggregation (Flink SQL)

```sql
-- Flink SQL: 5-minute tumbling window revenue aggregation
CREATE TABLE orders (
  order_id STRING,
  amount DECIMAL(10,2),
  store_id STRING,
  event_time TIMESTAMP(3),
  WATERMARK FOR event_time AS event_time - INTERVAL '10' SECOND
) WITH (
  'connector' = 'kafka',
  'topic' = 'orders',
  'format' = 'json'
);

SELECT
  store_id,
  TUMBLE_START(event_time, INTERVAL '5' MINUTE) AS window_start,
  COUNT(*) AS order_count,
  SUM(amount) AS total_revenue
FROM orders
GROUP BY
  store_id,
  TUMBLE(event_time, INTERVAL '5' MINUTE);
```

### Kafka Streams Topology

```
Source Topic: raw-events
      ↓
  Filter (discard invalid)
      ↓
  Map (normalize schema)
      ↓
  Branch ──→ [high-priority] → enrich → Priority Topic
      │
      └──→ [standard] → aggregate(5min window) → Metrics Topic

KafkaStreams topology = builder.build();
topology.describe();  // prints processing graph
```

## Anti-Patterns

1. **Ignoring late data** — without watermarks, windowed aggregations either miss late events or never close windows
2. **State without checkpointing** — stateful processing without checkpoints loses all state on failure; enable checkpointing every 1-5 min
3. **CDC without schema registry** — schema changes in the source DB break consumers; use schema registry with compatibility checks
4. **Micro-batch pretending to be streaming** — Spark micro-batch at 10-second intervals is not real-time; use Flink or Kafka Streams for sub-second latency
5. **No backpressure handling** — when consumers lag, data piles up; configure buffering limits and spill-to-disk strategies

## Quality Checklist

- [ ] Watermarks configured for event-time processing (handle late data)
- [ ] Checkpointing enabled (Flink: every 60s, Kafka Streams: via changelog topics)
- [ ] Schema registry enforces backward compatibility for stream schemas
- [ ] Dead letter topic configured for malformed/unprocessable events
- [ ] Consumer lag monitored with alerting thresholds
- [ ] Exactly-once semantics configured where required (Kafka transactions + Flink checkpoints)
- [ ] Backpressure strategy defined (buffering, spill-to-disk, or drop with DLQ)
- [ ] Reprocessing plan: can replay from earliest offset to rebuild state
- [ ] Resource sizing: parallelism matches partition count
- [ ] Integration tested with embedded Kafka/Flink in test framework
