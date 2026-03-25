---
license: Apache-2.0
name: logging-observability
description: 'Structured logging, distributed tracing, and metrics for production applications. [What: OpenTelemetry setup, log level strategy, correlation IDs, SLI/SLO alerting thresholds, Grafana dashboard design, PagerDuty integration] [When: setting up production logging, adding observability to a service, debugging distributed systems, designing alerting, implementing traces/metrics/logs] [Keywords: logging, observability, OpenTelemetry, OTel, structured logs, distributed tracing, correlation ID, metrics, Grafana, Prometheus, PagerDuty, Winston, Pino, structlog, log levels, SLI, SLO, alerting] NOT for application performance profiling (use a profiler), load testing, or database query optimization.'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,pip:*,docker:*)
argument-hint: '[service description] [stack: node|python|go|java] [current problem: no-logging|no-tracing|alert-fatigue|pii-leak]'
metadata:
  category: Code Quality & Testing
  pairs-with:
    - skill: api-architect
      reason: API request tracing and correlation IDs
    - skill: devops-automator
      reason: Deploying collectors and dashboards
    - skill: background-job-orchestrator
      reason: Distributed job observability
  tags:
    - observability
    - logging
    - tracing
    - metrics
    - opentelemetry
    - monitoring
category: DevOps & Infrastructure
tags:
  - logging
  - observability
  - monitoring
  - tracing
  - debugging
---

# Logging & Observability

Structured logging, distributed tracing, and metrics for production systems. Covers the full observability stack from log formatting to alert routing.

## Decision Points

**1. Log Level Assignment by Event Type**
```
Event occurs → 
  ├── System failure?
      ├── YES → Service cannot continue? 
          ├── YES → FATAL (page immediately)
          └── NO → ERROR (operation failed, will retry)
      └── NO → Unexpected condition?
          ├── YES → WARN (circuit breaker, deprecation)
          └── NO → Business event?
              ├── YES → INFO (user action, payment processed)
              └── NO → Debug helper?
                  ├── YES → DEBUG (DB queries, cache hits)
                  └── NO → TRACE (spans, fine-grained flow)
```

**2. Observability Stack Choice by Scale**
```
Request volume →
  ├── < 1000/min → Structured logs + simple metrics
  ├── < 10k/min → Add distributed tracing (10% sampling)
  ├── < 100k/min → Full OTel + head-based sampling
  └── > 100k/min → Tail-based sampling + cardinality limits
```

**3. Alert Threshold Setting**
```
SLI established →
  ├── User-facing service?
      ├── YES → Start with 99% SLO (44min/month error budget)
      └── NO → Start with 95% SLO (36hr/month error budget)
  └── Historical data available?
      ├── YES → Set threshold at 95th percentile of normal operation
      └── NO → Set conservative threshold, tune weekly for 1 month
```

**4. Trace Sampling Decision**
```
Performance impact →
  ├── Latency sensitive service?
      ├── YES → 1-5% sampling rate
      └── NO → 10-20% sampling rate
  └── Error debugging needed?
      ├── YES → Always sample errors (status=error)
      └── NO → Uniform probability sampling
```

**5. PII Handling Strategy**
```
Field contains sensitive data →
  ├── Required for debugging?
      ├── YES → Hash or tokenize (preserve cardinality)
      └── NO → Complete redaction
  └── Regulatory compliance?
      ├── GDPR/CCPA → Allowlist approach only
      └── PCI → Redact payment fields specifically
```

## Failure Modes

**1. Alert Fatigue**
- **Symptom**: Teams ignore pages; alerts stay open for hours
- **Diagnosis**: Alert-to-incident ratio > 3:1, or SLI threshold too sensitive
- **Fix**: Raise threshold by 10% increments until alerts correlate with real user impact

**2. PII Leakage**
- **Symptom**: Compliance audit flags personal data in logs
- **Diagnosis**: Search logs for patterns like `"password":`, `"ssn":`, credit card regex
- **Fix**: Implement allowlist-only logging; redact at logger config level, not call sites

**3. Trace Orphaning**
- **Symptom**: Spans appear disconnected; can't follow requests end-to-end
- **Diagnosis**: Missing `traceparent` header propagation on outbound HTTP calls
- **Fix**: Auto-instrument HTTP clients or manually inject context headers

**4. Log-and-Throw Duplication**
- **Symptom**: Same error appears 2-5 times with identical trace IDs
- **Diagnosis**: Error logged at every stack frame, not just handling boundary
- **Fix**: Log only where you decide what to do with the error (usually HTTP boundary)

**5. Cardinality Explosion**
- **Symptom**: Metrics storage costs spike; query performance degrades
- **Diagnosis**: Label values exceed 1000 unique values per metric
- **Fix**: Replace high-cardinality labels (user_id) with bucketed versions (user_tier)

## Worked Examples

### End-to-End: Distributed Payment Failure Trace

**Scenario**: Payment service returning 500s sporadically. Need to trace through API Gateway → Payment Service → Bank API.

**Step 1: Trace ID Recovery**
```bash
# Customer reports failed payment at 14:35 UTC
# Find trace ID from customer-facing logs
grep -A5 -B5 "payment_failed" /var/log/api-gateway.log | grep "14:3[0-9]"
# Extract: trace_id: "abc123def456"
```

**Step 2: Cross-Service Trace Following**
```bash
# Follow trace through each service
kubectl logs payment-service | grep "abc123def456"
# Shows: bank_api_call_failed, status_code: 502, bank_error: "insufficient_funds"

# Verify bank API logs (if accessible)
curl -H "X-Trace-ID: abc123def456" https://bank-api/logs
```

**Decision Point**: Sampling trade-off encountered
- Expert notices: Only 10% of traces sampled, but this error trace was captured
- Novice misses: Would increase sampling to 100%, causing performance impact
- **Expert decision**: Enable error-based sampling (always trace when status=error)

**Step 3: Root Cause Analysis**
```typescript
// Found in payment service code
logger.error({ 
  trace_id,
  bank_response_code: 502, 
  bank_error: "insufficient_funds",
  our_retry_count: 3 
}, "payment_processing_failed");
```

**Resolution**: Bank API returns 502 for business logic errors (insufficient funds). Change error handling to return 400 instead of retrying on 502.

### Setting Up Structured Logging

**Node.js Payment Service Implementation**:
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: ['req.headers.authorization', 'body.cardNumber', '*.ssn'],
    censor: '[REDACTED]'
  }
});

// Correlation middleware
export function correlationMiddleware(req, res, next) {
  const traceId = req.headers['x-trace-id'] ?? randomUUID();
  res.setHeader('x-trace-id', traceId);
  
  // AsyncLocalStorage context
  requestContext.run({ traceId }, () => {
    logger.info({ 
      traceId, 
      method: req.method, 
      path: req.path,
      userAgent: req.headers['user-agent']
    }, 'request_received');
    next();
  });
}
```

## Failure Modes

**Alert Noise Syndrome**
- **Detection**: If alert-to-incident ratio exceeds 3:1, threshold too low
- **Cause**: SLI thresholds set at 90th percentile instead of 95th percentile
- **Fix**: Raise threshold by 10% increments until alerts predict real user impact

**Schema Drift**
- **Detection**: Dashboard queries break after service deployments
- **Cause**: Log field names change without coordinated dashboard updates  
- **Fix**: Treat log schema as API contract; version field names explicitly

**Sampling Blind Spots**
- **Detection**: Cannot find traces for reported user issues
- **Cause**: Uniform sampling misses rare but critical error paths
- **Fix**: Implement intelligent sampling (always sample errors, high-value users)

## Quality Gates

- [ ] All log outputs are valid JSON (no string interpolation)
- [ ] PII redaction configured at logger initialization level
- [ ] Correlation ID propagated on every outbound HTTP call
- [ ] OpenTelemetry SDK initialized before application imports
- [ ] Error rate SLI defined with 99% availability target
- [ ] Alert runbook linked from every paging notification
- [ ] Trace sampling rate documented and tunable via config
- [ ] Log retention policy set based on compliance requirements
- [ ] Dashboard covers four golden signals (latency, traffic, errors, saturation)
- [ ] Cardinality limits enforced (<1000 unique values per metric label)

## NOT-FOR Boundaries

**This skill handles**: Production observability, structured logging, distributed tracing, alerting strategy

**Delegate elsewhere**:
- **Application performance profiling** → Use `performance-optimization` skill instead
- **Load testing and capacity planning** → Use `infrastructure-scaling` skill
- **Database query optimization** → Use `database-architect` skill  
- **Security event monitoring** → Use `security-architect` skill
- **Cost optimization for observability tools** → Use `cost-optimization` skill