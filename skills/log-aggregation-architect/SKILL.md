---
license: Apache-2.0
name: log-aggregation-architect
description: "Centralized log pipeline architect with structured logging, Fluentd/Vector, and retention policies. Activate on: log aggregation, structured logging, Fluentd, Vector, Loki, ELK stack, log pipeline, log retention, centralized logging. NOT for: metrics and dashboards (use monitoring-stack-deployer), distributed tracing (use logging-observability), alerting rules (use site-reliability-engineer)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - logging
  - observability
  - fluentd
  - vector
pairs-with:
  - skill: logging-observability
    reason: Broader observability patterns that log aggregation implements
  - skill: monitoring-stack-deployer
    reason: Metrics and logs often share infrastructure and correlation
---

# Log Aggregation Architect

Expert in designing centralized log pipelines with structured logging, efficient collection, and cost-effective retention.

## Activation Triggers

**Activate on:** "log aggregation", "structured logging", "Fluentd config", "Vector pipeline", "Loki setup", "ELK stack", "log pipeline", "log retention policy", "centralized logging", "log shipping"

**NOT for:** Metrics/dashboards → `monitoring-stack-deployer` | Distributed tracing → `logging-observability` | Alerting → `site-reliability-engineer`

## Quick Start

1. **Standardize log format** — JSON structured logs with consistent fields across all services
2. **Deploy collection agents** — Vector or Fluentd as DaemonSet on every node
3. **Choose storage backend** — Grafana Loki (cost-effective), Elasticsearch (full-text search), or ClickHouse (analytics)
4. **Define retention tiers** — hot (7d searchable), warm (30d compressed), cold (1y archived)
5. **Build correlation** — trace ID propagation so logs link to traces and metrics

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Collection** | Vector 0.43, Fluentd 1.17, Fluent Bit 3.2, OTEL Collector |
| **Storage** | Grafana Loki 3.x, Elasticsearch 8.x, ClickHouse, S3 archive |
| **Structured Logging** | JSON, logfmt, OpenTelemetry Logs, pino, winston, slog (Go) |
| **Pipeline** | Transform, filter, route, sample, deduplicate, redact PII |
| **Visualization** | Grafana (Loki), Kibana (Elastic), Grafana Explore |

## Architecture Patterns

### Vector Pipeline (Recommended 2026)

```toml
# vector.toml — collect, transform, route
[sources.kubernetes]
type = "kubernetes_logs"
auto_partial_merge = true

[transforms.structured]
type = "remap"
inputs = ["kubernetes"]
source = '''
  # Parse JSON logs, fallback to raw message
  . = parse_json(.message) ?? {"message": .message}
  .timestamp = now()
  .service = .kubernetes.pod_labels."app.kubernetes.io/name" ?? "unknown"
  .environment = .kubernetes.pod_namespace
  # Redact PII
  .message = redact(.message, filters: ["pattern"],
    patterns: [r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'])
'''

[transforms.sampler]
type = "sample"
inputs = ["structured"]
rate = 10  # Keep 1 in 10 debug logs
exclude."level" = ["error", "warn", "info"]  # Always keep non-debug

[sinks.loki]
type = "loki"
inputs = ["sampler"]
endpoint = "http://loki-gateway:3100"
labels.service = "{{ service }}"
labels.level = "{{ level }}"
encoding.codec = "json"
```

### Structured Log Schema (Cross-Language Standard)

```json
{
  "timestamp": "2026-03-20T14:30:00.000Z",
  "level": "info",
  "message": "Order processed successfully",
  "service": "order-api",
  "trace_id": "abc123def456",
  "span_id": "789ghi",
  "user_id": "usr_masked",
  "order_id": "ord_12345",
  "duration_ms": 142,
  "http": {
    "method": "POST",
    "path": "/api/v1/orders",
    "status": 201
  }
}
```

### Retention Tier Strategy

```
HOT (0-7 days):
  ├─ Full-text searchable in Loki/Elasticsearch
  ├─ Instant query response (<1s)
  └─ Cost: $$$ (SSD, indexed)

WARM (7-30 days):
  ├─ Compressed, queryable with delay
  ├─ Query response 5-30s
  └─ Cost: $$ (HDD, partial index)

COLD (30-365 days):
  ├─ S3/GCS archive, queryable via Athena/BigQuery
  ├─ Query response: minutes
  └─ Cost: $ (object storage, no index)

DELETED (365+ days):
  └─ Lifecycle policy auto-deletes (compliance permitting)
```

## Anti-Patterns

1. **Unstructured string logs** — `console.log("User " + id + " did thing")` is unsearchable. Use structured JSON with consistent field names.
2. **Logging sensitive data** — PII, tokens, passwords in logs. Redact at the pipeline level (Vector remap, Fluentd filter) before storage.
3. **No log levels** — everything at INFO. Use DEBUG for development, INFO for business events, WARN for recoverable issues, ERROR for failures requiring attention.
4. **Unbounded retention** — keeping all logs forever. Define retention tiers with automatic lifecycle policies. Most logs lose value after 30 days.
5. **Missing trace correlation** — logs without trace IDs cannot be correlated with distributed traces. Propagate OpenTelemetry trace context into every log line.

## Quality Checklist

```
[ ] All services emit JSON structured logs
[ ] Consistent field schema across services (timestamp, level, service, trace_id)
[ ] Log collection agents deployed as DaemonSet (Vector or Fluent Bit)
[ ] PII redaction applied in pipeline before storage
[ ] Debug logs sampled (not all collected in production)
[ ] Retention tiers defined: hot, warm, cold with lifecycle policies
[ ] Trace IDs propagated into log context
[ ] Log-based alerts configured for error rate spikes
[ ] Grafana Explore or Kibana connected for log search
[ ] Storage costs monitored and budget-capped
[ ] Log pipeline has backpressure handling (no data loss under load)
[ ] Compliance requirements met (GDPR right-to-erasure for logs with PII)
```
