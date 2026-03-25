---
license: Apache-2.0
name: observability-apm-expert
description: 'OpenTelemetry, distributed tracing, Grafana, and Datadog for full-stack observability. Activate on: observability, tracing, OpenTelemetry, Grafana, Datadog, metrics, logging, APM, SLO, alerting. NOT for: application error handling (use relevant language skill), security monitoring (use relevant security skill).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*)
category: DevOps & Infrastructure
tags:
  - observability
  - opentelemetry
  - tracing
  - grafana
  - metrics
pairs-with:
  - skill: service-mesh-microservices-expert
    reason: Service meshes provide automatic telemetry collection
  - skill: event-driven-architecture-expert
    reason: Tracing across async event flows
  - skill: distributed-transaction-manager
    reason: Saga observability across distributed transactions
---

# Observability & APM Expert

Implement comprehensive observability with distributed tracing, metrics, structured logging, and SLO-based alerting using OpenTelemetry and modern backends.

## Decision Points

### 1. Sampling Strategy Selection
```
Error Rate Analysis:
├── Error rate < 0.1%
│   ├── Low cardinality service (< 10k spans/min) → 100% sampling
│   └── High cardinality service (> 10k spans/min) → Tail-based sampling
│       ├── Keep all error traces (100%)
│       ├── Keep slow traces > P95 latency (100%)
│       └── Sample successful traces (1-10%)
└── Error rate > 0.1%
    ├── Critical service → Keep all errors + 50% successful
    └── Non-critical service → Keep all errors + 10% successful
```

### 2. Backend Selection Strategy
```
If self-hosted tolerance = high AND cost sensitivity = high:
├── Use Grafana stack (Tempo + Mimir + Loki)
└── Export via OTLP to unified collector

If operational overhead tolerance = low OR compliance = strict:
├── Cloud vendors (Datadog, New Relic, Honeycomb)
└── Direct SDK exports + OTLP fallback

If hybrid requirements:
├── Critical services → SaaS backend
└── Development/staging → Self-hosted stack
```

### 3. Alert Configuration Logic
```
For each SLO:
├── Define error budget (e.g., 99.9% = 43.2min downtime/month)
├── Calculate burn rates:
│   ├── Fast burn (14.4x) over 1h → Critical alert (2min delay)
│   ├── Medium burn (6x) over 6h → Warning alert (15min delay)
│   └── Slow burn (3x) over 24h → Info alert (1h delay)
└── Link each alert to specific runbook action
```

## Failure Modes

### Schema Bloat
**Symptom:** Metrics cardinality > 10M series, query timeouts, high storage costs
**Detection:** `prometheus_tsdb_head_cardinality` growing exponentially
**Fix:** Add label cardinality limits, aggregate high-cardinality labels, use recording rules

### Trace Orphaning
**Symptom:** Spans appearing disconnected, missing parent-child relationships
**Detection:** Spans with same `trace_id` but no parent reference in service map
**Fix:** Verify context propagation headers (traceparent/tracestate), check async context handling

### Alert Fatigue Storm
**Symptom:** > 10 alerts per incident, team ignoring notifications
**Detection:** Alert:incident ratio > 5:1, MTTA (time to acknowledge) > 30min
**Fix:** Implement alert dependencies, use SLO burn rate instead of threshold alerts

### Sampling Blind Spots
**Symptom:** Critical errors not captured in traces, debugging impossible
**Detection:** Error logs present but corresponding traces missing
**Fix:** Switch to tail-based sampling, increase error trace retention to 100%

### Context Propagation Gaps
**Symptom:** Traces terminate at service boundaries, no cross-service correlation
**Detection:** Spans from downstream services have different `trace_id`
**Fix:** Verify HTTP headers propagation, add OTel middleware to all services

## Worked Examples

### Production Incident Investigation
**Scenario:** Customer reports 5-second checkout timeouts starting 2 hours ago

**Step 1 - Triage with SLO dashboard:**
```
P99 latency jumped from 200ms → 5000ms at 14:30 UTC
Error rate spiked from 0.1% → 2.3%
SLO burn rate: 46x (critical threshold)
```

**Step 2 - Trace analysis:**
```sql
-- Find slow traces in time window
{service_name="checkout-service"} |= "POST /checkout" 
| json | duration > 2s | trace_id
```
**Expert insight:** Filter by duration first, then sample traces - don't analyze all traces

**Step 3 - Root cause drill-down:**
```
Selected trace_id: abc123
├── checkout-service: 50ms (normal)
├── payment-service: 4.8s (🚨 anomaly)
│   ├── validate_card: 45ms
│   ├── fraud_check: 12ms  
│   └── database_query: 4.7s (🚨 root cause)
└── inventory-service: 100ms
```

**Step 4 - Correlate with infrastructure:**
```
Database span attributes show:
- db.statement: "SELECT * FROM transactions WHERE user_id = ?"
- db.connection.pool.idle: 0
- db.connection.pool.max: 10
```
**Expert insight:** Connection pool exhaustion - scale pool or optimize queries

**Resolution:** Increased connection pool from 10 → 50, added query timeout

### Custom Instrumentation Setup
**Scenario:** Add business metrics for order processing pipeline

```typescript
// 1. Initialize custom meter
import { metrics } from '@opentelemetry/api';
const meter = metrics.getMeter('order-service', '1.0.0');

// 2. Define business metrics
const ordersTotal = meter.createCounter('orders_total', {
  description: 'Total orders processed',
  unit: '1'
});

const orderValue = meter.createHistogram('order_value_dollars', {
  description: 'Order value distribution',
  unit: 'USD'
});

// 3. Instrument business logic
async function processOrder(order: Order) {
  const span = trace.getActiveSpan();
  span?.setAttributes({
    'order.id': order.id,
    'order.user_id': order.userId,
    'order.value': order.totalValue
  });

  try {
    // Business logic here
    await validateOrder(order);
    await chargePayment(order);
    
    // Record success metrics
    ordersTotal.add(1, { 
      status: 'success',
      payment_method: order.paymentMethod 
    });
    orderValue.record(order.totalValue);
    
  } catch (error) {
    span?.recordException(error);
    span?.setStatus({ code: SpanStatusCode.ERROR });
    ordersTotal.add(1, { status: 'error' });
    throw error;
  }
}
```

## Quality Gates

- [ ] All HTTP requests include `traceparent` header propagation
- [ ] Every log statement contains `trace_id` and `span_id` fields
- [ ] RED metrics (Rate/Errors/Duration) available for each service endpoint  
- [ ] P99 latency SLO defined with < 2% error budget burn rate alerting
- [ ] Tail-based sampling retains 100% of error traces and slow traces
- [ ] Database queries instrumented with connection pool and query performance spans
- [ ] Custom business metrics tagged with bounded cardinality labels (< 1000 values)
- [ ] Alert runbooks linked and tested for each SLO violation scenario
- [ ] Trace sampling decision logged and queryable for debugging
- [ ] Cross-service dependency map auto-generated from span relationships

## NOT-FOR Boundaries

**Application Error Handling** → Use relevant language skill (node-js-expert, python-expert, etc.) for try/catch, error boundaries, graceful degradation

**Security Event Monitoring** → Use security-expert skill for SIEM, threat detection, compliance logging

**Log Storage Infrastructure** → Use kubernetes-expert or cloud-expert for ELK stack deployment, log retention policies

**Performance Testing** → Use load-testing-expert for generating telemetry during performance validation

**Cost Optimization** → Use finops-expert for observability spend analysis and retention tuning