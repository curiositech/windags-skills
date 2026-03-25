---
license: Apache-2.0
name: monitoring-stack-deployer
description: "Production monitoring stack deployer with Prometheus, Grafana, and SLO-based alerting. Activate on: monitoring setup, Prometheus configuration, Grafana dashboards, alerting rules, SLO definition, metrics pipeline, observability stack. NOT for: application logging (use log-aggregation-architect), distributed tracing (use logging-observability), incident response (use site-reliability-engineer)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - monitoring
  - prometheus
  - grafana
  - observability
pairs-with:
  - skill: site-reliability-engineer
    reason: SRE practices depend on monitoring stack for SLOs and incident detection
  - skill: log-aggregation-architect
    reason: Logging and metrics pipelines often share infrastructure
---

# Monitoring Stack Deployer

Expert in deploying and configuring production monitoring with Prometheus, Grafana, and SLO-driven alerting.

## Activation Triggers

**Activate on:** "monitoring setup", "Prometheus config", "Grafana dashboard", "alerting rules", "SLO dashboard", "metrics pipeline", "observability stack", "kube-prometheus-stack", "ServiceMonitor"

**NOT for:** Application logging → `log-aggregation-architect` | Distributed tracing → `logging-observability` | Incident response → `site-reliability-engineer`

## Quick Start

1. **Deploy kube-prometheus-stack** — Prometheus, Grafana, Alertmanager, node-exporter in one Helm chart
2. **Define SLOs** — availability and latency targets per service
3. **Create ServiceMonitors** — auto-discover application metrics endpoints
4. **Build dashboards** — USE method (utilization, saturation, errors) for infrastructure; RED method (rate, errors, duration) for services
5. **Configure alerting** — SLO burn-rate alerts, not threshold alerts

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Metrics** | Prometheus 3.x, Mimir, Thanos, VictoriaMetrics |
| **Visualization** | Grafana 11, Perses (open-source Grafana alternative) |
| **Alerting** | Alertmanager, PagerDuty, OpsGenie, Slack integration |
| **SLOs** | Sloth, Pyrra, Google SRE workbook burn-rate model |
| **K8s Native** | kube-prometheus-stack, ServiceMonitor, PodMonitor, PrometheusRule |

## Architecture Patterns

### SLO-Based Burn-Rate Alerting

```
Traditional (BAD):  "Alert if error rate > 1% for 5 minutes"
  Problem: Too many false positives, alert fatigue

SLO-Based (GOOD):  "Alert if burning SLO budget too fast"
  SLO: 99.9% availability over 30 days → 43.2 min error budget

  Multi-window burn rate:
  ┌─────────────────────────────────────────────┐
  │ Severity │ Burn Rate │ Long Window │ Short  │
  │ Critical │ 14.4x     │ 1 hour      │ 5 min  │
  │ Warning  │ 6x        │ 6 hours     │ 30 min │
  │ Ticket   │ 1x        │ 3 days      │ 6 hrs  │
  └─────────────────────────────────────────────┘
```

### Prometheus Recording Rules for SLOs

```yaml
# PrometheusRule for SLO burn rate
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: api-slo-rules
spec:
  groups:
    - name: api-slo-burn-rate
      rules:
        - record: slo:api_availability:burn_rate_1h
          expr: |
            1 - (
              sum(rate(http_requests_total{code!~"5.."}[1h]))
              /
              sum(rate(http_requests_total[1h]))
            )
            / (1 - 0.999)
        - alert: APIAvailabilityBurnRateCritical
          expr: slo:api_availability:burn_rate_1h > 14.4
            and slo:api_availability:burn_rate_5m > 14.4
          for: 2m
          labels:
            severity: critical
          annotations:
            summary: "API burning error budget 14.4x faster than allowed"
```

### RED Method Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ Service: api-gateway                     SLO: 99.9%     │
├──────────────┬──────────────┬───────────────────────────┤
│    RATE      │   ERRORS     │        DURATION           │
│  req/sec     │  error %     │   p50 / p95 / p99         │
│  ▁▂▃▅▇█▇▅▃  │  ▁▁▁▂▁▁▁▁▁  │  p50: 12ms               │
│  peak: 1.2k  │  curr: 0.02% │  p95: 89ms  p99: 240ms  │
├──────────────┴──────────────┴───────────────────────────┤
│ Error Budget: 38.2 min remaining (88% of 43.2 min)      │
│ ████████████████████████████████░░░░                     │
└─────────────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **Threshold-based alerting** — static thresholds like "alert if CPU > 80%" cause alert fatigue. Use SLO burn rates that correlate with user impact.
2. **No recording rules** — computing complex queries at alert evaluation time is slow and expensive. Pre-compute with recording rules.
3. **Dashboard sprawl** — hundreds of dashboards nobody checks. Build one service dashboard template, parameterize with variables.
4. **Missing service discovery** — manually listing scrape targets. Use ServiceMonitor/PodMonitor to auto-discover Kubernetes workloads.
5. **Alerting without runbooks** — alerts fire but responders do not know what to do. Every alert must link to a runbook with diagnosis steps.

## Quality Checklist

```
[ ] kube-prometheus-stack or equivalent deployed and healthy
[ ] ServiceMonitors auto-discover all application metrics endpoints
[ ] SLOs defined for every user-facing service
[ ] Burn-rate alerts configured (critical, warning, ticket)
[ ] Recording rules pre-compute expensive queries
[ ] Grafana dashboards use RED method for services, USE for infrastructure
[ ] Alertmanager routes to correct channels (PagerDuty/Slack/OpsGenie)
[ ] Alert grouping and inhibition rules prevent notification storms
[ ] Every alert has a linked runbook
[ ] Metrics retention configured (15d local, long-term in Mimir/Thanos)
[ ] Dashboard provisioned as code (JSON/YAML in Git)
[ ] Error budget dashboard visible to engineering and product
```
