---
license: Apache-2.0
name: blue-green-deployment-orchestrator
description: "Blue-green and canary deployment orchestrator with traffic shifting and automated rollback. Activate on: blue-green deployment, canary release, rolling deployment, traffic shifting, rollback automation, progressive delivery, Argo Rollouts, Flagger. NOT for: K8s manifest generation (use kubernetes-manifest-generator), CI/CD pipeline setup (use github-actions-pipeline-builder), monitoring (use monitoring-stack-deployer)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - deployment
  - canary
  - progressive-delivery
  - devops
pairs-with:
  - skill: devops-automator
    reason: Deployment orchestration is a key piece of the broader DevOps automation
  - skill: monitoring-stack-deployer
    reason: Canary analysis requires metrics to make promotion/rollback decisions
---

# Blue-Green Deployment Orchestrator

Expert in progressive delivery strategies — blue-green, canary, and rolling deployments with automated traffic shifting and rollback.

## Activation Triggers

**Activate on:** "blue-green deployment", "canary release", "rolling deployment", "traffic shifting", "rollback automation", "progressive delivery", "Argo Rollouts", "Flagger", "deployment strategy"

**NOT for:** K8s manifests → `kubernetes-manifest-generator` | CI/CD pipelines → `github-actions-pipeline-builder` | Monitoring → `monitoring-stack-deployer`

## Quick Start

1. **Choose strategy** — blue-green for instant cutover, canary for gradual rollout, rolling for simple updates
2. **Deploy progressive delivery controller** — Argo Rollouts or Flagger
3. **Define analysis metrics** — error rate, latency p99, custom business metrics
4. **Configure traffic shifting** — weighted routing via Istio, Linkerd, or Gateway API
5. **Set automated rollback** — if analysis fails, automatically revert to stable version

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Controllers** | Argo Rollouts 1.7, Flagger 1.38, Spinnaker |
| **Traffic Splitting** | Istio VirtualService, Linkerd TrafficSplit, Gateway API HTTPRoute |
| **Analysis** | Prometheus queries, Datadog metrics, CloudWatch, custom webhooks |
| **Strategies** | Blue-green, canary (linear/exponential), A/B testing, rolling |
| **Platforms** | Kubernetes, AWS ECS (CodeDeploy), Cloudflare Workers (gradual) |

## Architecture Patterns

### Argo Rollouts Canary Strategy

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: api-server
spec:
  replicas: 5
  strategy:
    canary:
      canaryService: api-canary-svc
      stableService: api-stable-svc
      trafficRouting:
        istio:
          virtualService:
            name: api-vsvc
      steps:
        - setWeight: 5        # 5% traffic to canary
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: error-rate-check
        - setWeight: 25       # 25% if analysis passes
        - pause: { duration: 10m }
        - analysis:
            templates:
              - templateName: latency-check
        - setWeight: 50       # 50%
        - pause: { duration: 10m }
        - setWeight: 100      # Full promotion
      rollbackWindow:
        revisions: 2
```

### Blue-Green with Instant Cutover

```
                    ┌──────────────┐
                    │   Router     │
                    │  (Ingress/   │
                    │   Gateway)   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
     ┌────────────────┐      ┌────────────────┐
     │  BLUE (active)  │      │  GREEN (preview)│
     │  v1.2.0         │      │  v1.3.0         │
     │  3 replicas     │      │  3 replicas     │
     └────────────────┘      └────────────────┘

Workflow:
  1. Deploy v1.3.0 to GREEN (preview, no traffic)
  2. Run smoke tests against GREEN preview URL
  3. Switch router: 100% traffic BLUE → GREEN
  4. Monitor for 15 minutes
  5. If healthy: scale down BLUE (now standby)
  6. If unhealthy: instant rollback — switch back to BLUE
```

### Canary Analysis Template

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: error-rate-check
spec:
  metrics:
    - name: error-rate
      interval: 1m
      count: 5
      successCondition: result[0] < 0.01  # < 1% error rate
      failureLimit: 2
      provider:
        prometheus:
          address: http://prometheus:9090
          query: |
            sum(rate(http_requests_total{status=~"5..",
              app="{{args.service}}",
              rollout_hash="{{args.canary-hash}}"}[2m]))
            /
            sum(rate(http_requests_total{
              app="{{args.service}}",
              rollout_hash="{{args.canary-hash}}"}[2m]))
```

## Anti-Patterns

1. **Canary without analysis** — shifting traffic to canary but not measuring success. Always define automated analysis with clear success/failure criteria.
2. **No rollback automation** — manual rollback during incidents adds delay. Configure automatic rollback when analysis metrics fail.
3. **Testing only happy paths in canary** — synthetic smoke tests pass but real user traffic reveals issues. Include error rate and latency metrics from real traffic.
4. **Blue-green without enough capacity** — running both blue and green requires 2x resources. Budget for double capacity during deployment windows.
5. **Skipping progressive steps** — going from 5% to 100% in one jump. Use gradual steps (5% → 25% → 50% → 100%) with analysis at each stage.

## Quality Checklist

```
[ ] Deployment strategy documented (blue-green, canary, or rolling)
[ ] Progressive delivery controller deployed (Argo Rollouts or Flagger)
[ ] Traffic splitting configured via service mesh or Gateway API
[ ] Canary analysis templates defined with Prometheus queries
[ ] Automated rollback triggers on error rate or latency degradation
[ ] Preview/canary service accessible for pre-promotion testing
[ ] Rollback tested independently (not just on failure)
[ ] Deployment takes less than 15 minutes end-to-end
[ ] Resource budget accounts for blue-green double capacity
[ ] Deployment status visible in Grafana or ArgoCD dashboard
[ ] Notification sent on promotion and rollback events
[ ] Runbook documents manual override procedures
```
