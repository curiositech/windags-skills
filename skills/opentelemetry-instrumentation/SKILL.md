---
name: opentelemetry-instrumentation
description: 'Use when adding distributed tracing, debugging missing spans, fixing W3C traceparent propagation, configuring OTLP exporters (gRPC vs HTTP), choosing sampling strategies, setting resource attributes, or wiring auto-instrumentation libraries. Triggers: spans missing in Datadog/Honeycomb/Jaeger, "service.name = unknown_service", trace assembly broken across services, async work losing context, OTLP collector unreachable, sampling rate decisions, ESM vs CJS auto-instrumentation loader bugs. NOT for vendor-specific SDKs (Datadog APM, New Relic), structured-logging-only setups, or pre-OTel tracers (Jaeger client, Zipkin Brave).'
category: DevOps & Infrastructure
tags:
  - opentelemetry
  - observability
  - tracing
  - metrics
  - otel
  - instrumentation
---

# OpenTelemetry Instrumentation

OpenTelemetry is the vendor-neutral standard for traces, metrics, and logs. The SDK is split between *what gets recorded* (Tracer/Meter/Logger), *how it's sampled*, *how it's exported*, and *what context propagates*. Most pain comes from misaligning those four.

## When to use

- New service that needs distributed tracing.
- Existing service emits spans, but trace assembly breaks across the network boundary.
- Vendor backend shows "unknown_service" or trace IDs that don't link.
- You're paying too much for traces and need head/tail sampling.
- Async work (worker_threads, queues) drops the parent context.
- ESM-on-Node startup runs auto-instrumentation too late, missing http/express patches.

## Core capabilities

### Node SDK setup (auto-instrumentation)

```ts
// instrumentation.ts — must be loaded BEFORE any instrumented module.
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'orders-api',
    [ATTR_SERVICE_VERSION]: process.env.GIT_SHA ?? 'dev',
    'deployment.environment': process.env.NODE_ENV ?? 'dev',
  }),
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 60_000,
  }),
  instrumentations: [getNodeAutoInstrumentations({
    // Disable auto-instrumentation for things you'll wrap manually.
    '@opentelemetry/instrumentation-fs': { enabled: false },
  })],
});
sdk.start();
```

Loading order:

```bash
# CJS — preload via -r
node -r ./instrumentation.js src/index.js

# ESM — use --import (Node 20.6+) or the dedicated register file
node --import @opentelemetry/auto-instrumentations-node/register src/index.mjs
```

Auto-instrumentation patches modules at `require`/`import` time. If your app imports `http` before the SDK starts, it's too late — those requests get no spans.

### Span lifecycle, manually

```ts
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('orders');

async function processOrder(order: Order) {
  return tracer.startActiveSpan('order.process', async (span) => {
    try {
      span.setAttribute('order.id', order.id);
      span.setAttribute('order.total_cents', order.totalCents);

      const result = await charge(order);
      span.setAttribute('order.charge_id', result.chargeId);

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

`startActiveSpan` sets the span as the current context for the duration of the callback. Anything started inside (DB calls, HTTP requests via instrumentation) becomes a child.

### Resource attributes — the ones that matter

Vendors use these for service grouping, environment filtering, deploy markers:

```
service.name              orders-api          # required
service.version           1.4.7-abc123        # for deploy markers
service.namespace         payments            # multi-tenant grouping
deployment.environment    production          # filter by env
host.name                 ${HOSTNAME}         # k8s pod name in DD/HC
process.runtime.name      nodejs              # auto-set
telemetry.sdk.language    nodejs              # auto-set
```

Skipping `service.name` is the #1 newbie mistake. Backend UIs collapse all your services into "unknown_service".

### Sampling

Three layers, head sampling first:

```ts
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

const sdk = new NodeSDK({
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(0.1), // sample 10% of root spans
    // Children inherit the parent's decision (default).
  }),
});
```

- **Head sampling** — decision made when the trace starts; cheap; can't see outcomes.
- **Tail sampling** — decision made by the OTel Collector after seeing the full trace; expensive (Collector buffers); can keep all errors.

Most teams: head-sample heavily (1-10%) but force keep error traces by passing a sampling-decision attribute up.

### Exporters

| Exporter | Protocol | Use when |
|----------|----------|----------|
| `OTLPTraceExporter` from `exporter-trace-otlp-grpc` | gRPC | Highest throughput; data-center-to-data-center. |
| `OTLPTraceExporter` from `exporter-trace-otlp-http` | HTTP/protobuf | Default; works through proxies/firewalls. |
| `OTLPTraceExporter` from `exporter-trace-otlp-json` | HTTP/JSON | Debugging; never use in prod (10x bigger payloads). |
| `ConsoleSpanExporter` | stdout | Local debugging. |

Wrap with `BatchSpanProcessor` (default in NodeSDK) so spans are batched and sent on a schedule. `SimpleSpanProcessor` sends synchronously — only for tests.

Set queue limits or risk a memory leak if the collector is down:

```ts
new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,
  maxExportBatchSize: 512,
  scheduledDelayMillis: 5000,
});
```

### Propagating context across async boundaries

Most cases auto-propagate via `context.with()`. Two cases that don't:

```ts
// 1. worker_threads — context doesn't cross.
const ctx = context.active();
worker.postMessage({ traceparent: serializeContext(ctx), payload });
// In the worker: context.with(deserializeContext(msg.traceparent), () => …)

// 2. Detached promises (fire-and-forget).
const detached = context.bind(context.active(), async () => {
  await sendNotification();   // gets the right parent span
});
detached();                   // not awaited
```

### Browser/client traces

```ts
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

const provider = new WebTracerProvider();
provider.register({ contextManager: new ZoneContextManager() });

registerInstrumentations({
  instrumentations: [new FetchInstrumentation({
    propagateTraceHeaderCorsUrls: [/^https:\/\/api\.your-domain\.com/],
  })],
});
```

The CORS allowlist matters: `traceparent` is a custom header; without it, your backend allowlists, the browser blocks the request preflight.

### Metrics — pick the right instrument

```ts
import { metrics } from '@opentelemetry/api';
const meter = metrics.getMeter('orders');

const ordersTotal = meter.createCounter('orders.total');
const orderValue  = meter.createHistogram('order.value_cents', { unit: 'cent' });
const queueDepth  = meter.createObservableGauge('queue.depth');

ordersTotal.add(1, { region: 'us-west' });
orderValue.record(order.totalCents, { region: 'us-west' });
queueDepth.addCallback((obs) => obs.observe(getQueueDepth()));
```

Histograms beat averages — averages hide tail latency. Counters are monotonic; never use them for "current value" (use a Gauge).

## Anti-patterns

### Span context dropping in worker_threads

**Symptom:** Worker spans appear as new traces with no parent.
**Diagnosis:** OTel context is per-async-context; worker_threads is a fresh context.
**Fix:** Serialize the W3C traceparent across the message channel and re-establish on the other side using the W3C Trace Context propagator.

### Auto-instrumentation imported AFTER target modules

**Symptom:** http/express requests have no spans even though the SDK is loaded.
**Diagnosis:** Auto-instrumentation patches modules at require time. If the app imported `express` before SDK init, it's already monkey-patched-or-not for the rest of the process.
**Fix:** Use `--require` (CJS) or `--import` (ESM) to load instrumentation BEFORE the entry. Never `import './instrumentation.ts'` from `index.ts`.

### Missing `service.name`

**Symptom:** All traces show `unknown_service:node` in the vendor UI.
**Diagnosis:** Resource attributes weren't set; default fallback kicked in.
**Fix:** Always set `service.name` in `resourceFromAttributes`. Verify with the Console exporter locally before deploying.

### Sampling drift between services

**Symptom:** Traces are missing middle hops; you see only the entry and the database.
**Diagnosis:** Service A samples at 10% with no parent context; Service B receives the trace with `sampled=0` but its own sampler ignores parent and samples at 100%.
**Fix:** Use `ParentBasedSampler` on every service so they honor upstream decisions.

### Logging span IDs without joining via OTLP logs

**Symptom:** Logs say "trace_id=xxx" but the vendor UI doesn't link logs to traces.
**Diagnosis:** Most vendors auto-link only when logs come through the OTLP log pipeline (or via an SDK-native logger).
**Fix:** Switch to `@opentelemetry/api-logs` or use a logger integration that injects trace context AND ships via OTLP.

### Memory leak when collector unreachable

**Symptom:** Heap grows steadily; eventually OOM.
**Diagnosis:** BatchSpanProcessor buffer has no cap, or the cap is too high, and the collector has been down for hours.
**Fix:** Set `maxQueueSize`. Drop on overflow is the right behavior — better than crashing your service.

## Quality gates

- [ ] Every service sets `service.name`, `service.version`, `deployment.environment`.
- [ ] SDK init runs before any instrumented module imports (verified by a missing-span test).
- [ ] `ParentBasedSampler` configured on every service.
- [ ] Sampling rate documented in the runbook with per-environment values.
- [ ] OTLP endpoint health-checked at boot; clear error on failure.
- [ ] `BatchSpanProcessor.maxQueueSize` set to a finite value.
- [ ] Error paths call `span.recordException` and set `SpanStatusCode.ERROR`.
- [ ] Histograms used for latency/value; counters never used for current-state metrics.
- [ ] Browser fetch instrumentation has a `propagateTraceHeaderCorsUrls` allowlist.
- [ ] Trace context propagated across async boundaries (worker_threads, message queues).

## NOT for

- **Datadog APM, New Relic, AppDynamics agents** — vendor-native; different setup.
- **Structured-logging-only** observability — different layer. → `structured-logging-design` for the schema/redaction side; `grafana-dashboard-builder` for the visualization side.
- **Pre-OTel tracers** (Jaeger client, Zipkin Brave) — migration target should be OTel.
- **eBPF-based service maps** — different layer entirely.
