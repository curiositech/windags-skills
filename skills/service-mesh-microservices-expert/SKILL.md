---
license: Apache-2.0
name: service-mesh-microservices-expert
description: "Istio, Envoy, circuit breakers, and service discovery for microservices. Activate on: service mesh, Istio, Envoy, sidecar, circuit breaker, service discovery, mTLS, traffic management. NOT for: API gateway edge routing (use api-gateway-reverse-proxy-expert), application-level observability (use observability-apm-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,kubectl:*,istioctl:*)
category: Backend & Infrastructure
tags:
  - service-mesh
  - istio
  - envoy
  - microservices
  - circuit-breaker
pairs-with:
  - skill: api-gateway-reverse-proxy-expert
    reason: Gateway handles north-south; mesh handles east-west traffic
  - skill: observability-apm-expert
    reason: Mesh provides automatic telemetry for distributed tracing
  - skill: distributed-transaction-manager
    reason: Circuit breakers and retries affect transaction reliability
---

# Service Mesh & Microservices Expert

Design and operate service meshes for secure, observable, and resilient microservice communication using Istio, Envoy, and Linkerd.

## Activation Triggers

**Activate on:** "service mesh", "Istio", "Envoy", "sidecar proxy", "circuit breaker", "service discovery", "mTLS", "traffic management", "canary deployment", "Linkerd"

**NOT for:** Edge/API gateway → `api-gateway-reverse-proxy-expert` | Application instrumentation → `observability-apm-expert` | Container orchestration basics → relevant DevOps skill

## Quick Start

1. **Evaluate need** — service meshes add complexity; justified at 10+ services with cross-cutting concerns
2. **Choose mesh** — Istio (full-featured), Linkerd (lightweight), Cilium (eBPF, no sidecar)
3. **Enable mTLS** — zero-trust between all services, mesh handles certificate rotation
4. **Configure traffic policies** — retries, timeouts, circuit breakers per service pair
5. **Deploy with canary** — use mesh traffic splitting for safe rollouts (90/10, 80/20, etc.)

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Meshes** | Istio 1.24+, Linkerd 2.16+, Cilium Service Mesh |
| **Data Plane** | Envoy Proxy, Linkerd2-proxy, eBPF (Cilium) |
| **Security** | mTLS, SPIFFE/SPIRE, AuthorizationPolicy |
| **Traffic** | VirtualService, DestinationRule, traffic splitting |
| **Observability** | Kiali, automatic Prometheus metrics, distributed tracing |

## Architecture Patterns

### Sidecar Proxy Architecture (Istio)

```
┌────────────────── Pod ──────────────────┐
│  ┌──────────┐     ┌──────────────────┐  │
│  │  App     │────→│  Envoy Sidecar   │──┼──→ Other services
│  │ Container│←────│  (injected auto) │←─┼──  (via their sidecars)
│  └──────────┘     └──────────────────┘  │
└─────────────────────────────────────────┘

Envoy intercepts all inbound/outbound traffic:
- mTLS encryption/decryption
- Retry, timeout, circuit breaking
- Metrics collection (RED)
- Access logging
- Traffic routing rules
```

### Circuit Breaker + Retry Configuration

```yaml
# Istio DestinationRule: circuit breaker for payment-service
apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: payment-service
spec:
  host: payment-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: DEFAULT
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutive5xxErrors: 5        # trip after 5 errors
      interval: 10s                   # check every 10s
      baseEjectionTime: 30s           # eject for 30s minimum
      maxEjectionPercent: 50          # never eject >50% of hosts
---
# Istio VirtualService: retry policy
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: payment-service
spec:
  hosts: [payment-service]
  http:
    - route:
        - destination:
            host: payment-service
      retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure
      timeout: 10s
```

### Canary Deployment with Traffic Splitting

```yaml
# Route 90% to v1, 10% to v2 (canary)
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: order-service
spec:
  hosts: [order-service]
  http:
    - route:
        - destination:
            host: order-service
            subset: v1
          weight: 90
        - destination:
            host: order-service
            subset: v2
          weight: 10

# Progressive: 90/10 → 70/30 → 50/50 → 0/100
# Roll back instantly by setting v1 weight to 100
```

## Anti-Patterns

1. **Mesh for 3 services** — service mesh overhead is not justified for small deployments; use direct HTTP with retry libraries
2. **Ignoring resource overhead** — each Envoy sidecar uses 50-100MB RAM and adds ~1ms latency; budget for it
3. **Application-level retries + mesh retries** — double retries cause amplification; choose one layer for retry logic
4. **Permissive mTLS forever** — start with PERMISSIVE for migration, but move to STRICT mode to enforce zero-trust
5. **No traffic policies** — deploying a mesh without configuring timeouts, retries, and circuit breakers wastes the mesh

## Quality Checklist

- [ ] mTLS mode set to STRICT (not PERMISSIVE) in production
- [ ] Circuit breakers configured per upstream service
- [ ] Retry budgets set to prevent amplification (retries < 20% of total traffic)
- [ ] Timeouts explicit on every VirtualService (no infinite waits)
- [ ] Canary deployment tested with traffic splitting
- [ ] Kiali or equivalent mesh topology dashboard available
- [ ] Sidecar resource limits set (CPU/memory requests and limits)
- [ ] AuthorizationPolicy restricts which services can call which
- [ ] Mesh telemetry feeding into observability stack (Prometheus, Jaeger)
- [ ] Sidecar injection verified (no pods running without proxy)
