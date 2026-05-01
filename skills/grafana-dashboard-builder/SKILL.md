---
name: grafana-dashboard-builder
description: 'Use when building Grafana dashboards backed by Prometheus, Loki, or Tempo, designing PromQL/LogQL queries, wiring template variables, setting alert rules, building SLO dashboards, or maintaining dashboards as code. Triggers: rate() vs increase() confusion, irate vs rate, label_replace, recording rules, alerting rule expressions, multi-dimensional template variables, ad-hoc filters, dashboard JSON model, provisioning via Terraform/grafonnet, p99 / histogram_quantile usage. NOT for Datadog/New Relic dashboards (vendor-specific), Grafana plugin development, or Loki ingestion pipeline tuning.'
category: DevOps & Infrastructure
tags:
  - grafana
  - prometheus
  - promql
  - dashboards
  - slo
  - observability
---

# Grafana Dashboard Builder

A good dashboard answers one question per panel and one big question per dashboard. PromQL is more expressive than most engineers use; the recurring traps are `rate()` vs `increase()`, label cardinality, and histogram quantile math.

**Jump to your fire:**
- Negative rates / weird step changes → [`rate` vs `increase` vs `irate`](#rate-vs-increase-vs-irate)
- Histogram quantile panel returns NaN → [Histograms and `le`](#histograms-and-le)
- Pager fires from a single noisy blip → [Alert rules](#alert-rules)
- Dashboard has 30 panels nobody reads → [Dashboard structure](#dashboard-structure)
- Same expensive query on many panels → [Recording rules](#recording-rules)
- Multi-value variable returns 5000 series → [Template variables](#template-variables)
- Need to ship a dashboard via PR review → [Dashboards as code](#dashboards-as-code)

## When to use

- New service needs a default dashboard.
- A dashboard exists but is unreadable — too many panels, too many series.
- SLO dashboards (latency p99, error budget burn).
- Alert expressions that fire correctly without paging on transient blips.
- Dashboards-as-code: provisioning via Terraform or grafonnet.

## Core capabilities

### PromQL essentials

```promql
# Per-second request rate over 5min window.
rate(http_requests_total[5m])

# Total requests over 5min.
increase(http_requests_total[5m])

# By status code.
sum by (status) (rate(http_requests_total[5m]))

# Error rate (ratio).
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))

# Latency p99 from a histogram metric.
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

### `rate` vs `increase` vs `irate`

| Function | Returns | Use for |
|----------|---------|---------|
| `rate(m[5m])` | Avg per-second rate over window | Most graphs and alerts. Smooth. |
| `irate(m[5m])` | Instantaneous rate from last 2 samples | Sparkline-style live views. Spiky. |
| `increase(m[5m])` | Total delta over window | "How many requests in 5min." Same as `rate * window_seconds`. |

For alerts, prefer `rate` over `irate` — irate over a noisy counter triggers on every blip.

### Histograms and `le`

Histogram metrics emit `_bucket{le="..."}`, `_sum`, `_count`. To compute quantiles:

```promql
histogram_quantile(0.99,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
)
```

Aggregate by `le` AND any dimensions you want to keep in the result. Forgetting `le` returns NaN.

For p99 of *all* requests across routes:

```promql
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
```

### `label_replace` and renaming

```promql
# Add a `service` label derived from `job`.
label_replace(up, "service", "$1", "job", "(.+)")

# Drop high-cardinality labels for graphing.
sum without (instance, pod) (rate(http_requests_total[5m]))
```

`without` is the cleaner inverse of `by` — sums everything except the listed labels.

### Recording rules

For expensive queries used on many dashboards, pre-compute:

```yaml
# /etc/prometheus/rules/recording.yml
groups:
- name: orders-api
  interval: 30s
  rules:
  - record: job:http_requests:rate5m
    expr: sum by (job, status) (rate(http_requests_total[5m]))
  - record: job:http_request_duration:p99
    expr: histogram_quantile(0.99, sum by (job, le) (rate(http_request_duration_seconds_bucket[5m])))
```

Now dashboards query `job:http_request_duration:p99` instead of recomputing. Cuts dashboard load time and Prometheus CPU.

### Alert rules

```yaml
groups:
- name: orders-api-alerts
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{job="orders-api",status=~"5.."}[5m]))
      /
      sum(rate(http_requests_total{job="orders-api"}[5m]))
      > 0.05
    for: 10m
    labels: { severity: page, team: orders }
    annotations:
      summary: "Error rate >5% on orders-api"
      runbook: "https://runbooks/orders-api/high-error-rate"
```

`for: 10m` is the dwell time — alert only fires after the condition is true for 10 contiguous minutes. Without it, every transient blip pages.

### LogQL (Loki)

```logql
# Last 5 minutes of error logs.
{service="orders-api"} |= "level=error"

# Parse and filter on a JSON field.
{service="orders-api"} | json | status >= 500

# Rate of errors.
sum by (service) (rate({service="orders-api"} |= "level=error" [5m]))

# Latency from a structured field.
{service="orders-api"} | json | unwrap duration_ms | quantile_over_time(0.99, [5m])
```

LogQL extends PromQL with `|=` (contains), `!=`, `|~` (regex), `!~`, `| json`, `| logfmt`, `| unwrap`.

### Template variables

```
Variable: service
Type: query
Query: label_values(up, job)

Variable: instance
Type: query
Query: label_values(up{job="$service"}, instance)
```

`$service` lets the user pick. Multi-value dropdowns + `Include All` cover the common cases.

For ad-hoc filters, use Grafana's "Ad hoc filters" variable type — adds a label filter applied to every panel.

### Dashboard structure

A SLO dashboard typically has:

1. **Top row**: SLO compliance (28d burn, error budget remaining), p99 latency, request rate. Big numbers.
2. **Saturation row**: CPU, memory, queue depth, connection pool usage.
3. **Latency row**: p50/p95/p99, broken down by endpoint or status.
4. **Errors row**: error rate by status, error rate by endpoint, top error messages from logs.
5. **Dependencies row**: downstream service latencies, DB query rate/latency.

Avoid: pie charts (always wrong), gauges with no comparison, tables of 50+ rows. One question per panel.

### Dashboards as code

Terraform:

```hcl
resource "grafana_dashboard" "orders_api" {
  config_json = file("${path.module}/dashboards/orders-api.json")
  folder      = grafana_folder.api.id
  overwrite   = true
}
```

Or grafonnet (Jsonnet) for templated dashboards across services. The point is: dashboards are reviewable, diff-able, and recoverable.

### Annotations

Mark deploys, incidents, and feature flags on graphs:

```promql
# Annotation query — events from a Prometheus metric.
deployment_event{service="orders-api"}
```

Or use Grafana's annotation API to push events from CI.

## Anti-patterns

### `rate()` over a non-counter

**Symptom:** Negative rates, weird step changes.
**Diagnosis:** `rate()` only makes sense on monotonically-increasing counters. Applying to a gauge gives garbage.
**Fix:** `delta()` for gauges, `rate()` for counters. Use the right one.

### `irate` in alerts

**Symptom:** Pager fires from a single noisy blip every few hours.
**Diagnosis:** `irate` reflects the last two samples; one bad sample triggers.
**Fix:** `rate(...)[Nm]` smoothed over minutes; combine with `for: Xm`.

### Histogram quantile without `by (le)`

**Symptom:** Panel shows NaN.
**Diagnosis:** `histogram_quantile` needs the `le` label preserved through aggregation.
**Fix:** `sum by (le, …) (rate(..._bucket[5m]))`.

### Grafana variable that bloats panels

**Symptom:** "Include All" on a 5000-instance variable returns 5000 series.
**Diagnosis:** Multi-value variables with too-broad allowance.
**Fix:** Limit values, scope by another variable, or use `regex` to whittle. Aggregate before display.

### Alert `for:` too short

**Symptom:** Pager fatigue from intermittent network hiccups.
**Diagnosis:** `for: 1m` fires on any blip.
**Fix:** `for: 5m` or `for: 10m` for SLO-tier alerts. Use `for: 0` only for hard-failure metrics ("service down").

### Dashboard with 30 panels

**Symptom:** Slow load, no one reads past the top row.
**Diagnosis:** "Add panel" reflex.
**Fix:** Divide into multiple focused dashboards: SLO, saturation, dependencies, debugging. Cross-link.

## Quality gates

- [ ] Every alert has a `for:` dwell time and a runbook URL.
- [ ] PromQL queries reviewed for `rate` vs `increase` vs `irate` correctness.
- [ ] Histogram quantiles always aggregate by `le`.
- [ ] Recording rules used for queries that appear on >2 panels.
- [ ] Template variables scoped (not multi-select-everything by default).
- [ ] Dashboards stored as JSON in version control; provisioned, not edited live.
- [ ] SLO dashboard has burn-rate and error-budget panels.
- [ ] Annotations for deploys + incidents enabled.
- [ ] Top row of every dashboard answers "is the system healthy" at a glance.

## NOT for

- **Datadog / New Relic / Honeycomb dashboards** — vendor-specific. No dedicated skill yet.
- **Grafana plugin development** — separate domain. No dedicated skill.
- **Loki ingestion pipeline tuning** — different concern. → `structured-logging-design` for the producer-side schema.
- **Distributed tracing dashboards** (Tempo) — overlapping but distinct. → `opentelemetry-instrumentation` for span/trace generation.
- **Designing the metrics being measured** — this skill assumes metrics exist. → `opentelemetry-instrumentation` for instrumentation patterns.
