---
license: Apache-2.0
name: kubernetes-manifest-generator
description: "Kubernetes manifest and Helm chart generator for production workloads. Activate on: K8s config, Deployment YAML, HPA autoscaling, PodDisruptionBudget, Ingress rules, NetworkPolicy, Helm chart, Kustomize. NOT for: Docker image building (use docker-multi-stage-optimizer), IaC provisioning of clusters (use terraform-module-builder), CI/CD pipeline config (use github-actions-pipeline-builder)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - kubernetes
  - helm
  - infrastructure
  - orchestration
pairs-with:
  - skill: devops-automator
    reason: Broader infrastructure automation that K8s manifests plug into
  - skill: docker-multi-stage-optimizer
    reason: Produces the images these manifests deploy
---

# Kubernetes Manifest Generator

Expert in generating production-grade Kubernetes manifests, Helm charts, and Kustomize overlays with security and reliability built in.

## Activation Triggers

**Activate on:** "Kubernetes manifest", "K8s YAML", "Helm chart", "HPA", "PodDisruptionBudget", "Ingress", "NetworkPolicy", "Kustomize", "deployment config", "service mesh", "resource limits"

**NOT for:** Docker image building → `docker-multi-stage-optimizer` | Cluster provisioning → `terraform-module-builder` | CI/CD → `github-actions-pipeline-builder`

## Quick Start

1. **Define the workload** — Deployment, StatefulSet, or Job based on use case
2. **Set resource requests/limits** — always specify both CPU and memory
3. **Add reliability primitives** — HPA, PDB, health probes, topology spread
4. **Secure the workload** — NetworkPolicy, SecurityContext, RBAC
5. **Package for environments** — Helm chart or Kustomize overlays for dev/staging/prod

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Workloads** | Deployment, StatefulSet, DaemonSet, Job, CronJob |
| **Autoscaling** | HPA (CPU/memory/custom), VPA, KEDA event-driven |
| **Networking** | Ingress (nginx/traefik), Gateway API, NetworkPolicy, Service Mesh |
| **Reliability** | PDB, TopologySpreadConstraints, PriorityClasses, Pod Anti-Affinity |
| **Packaging** | Helm 3, Kustomize, Timoni (CUE-based) |

## Architecture Patterns

### Production Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .name }}
  labels:
    app.kubernetes.io/name: {{ .name }}
    app.kubernetes.io/version: {{ .version }}
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0        # Zero-downtime deploys
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ .name }}
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: {{ .name }}
          image: {{ .image }}
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet: { path: /healthz, port: 8080 }
            initialDelaySeconds: 10
          readinessProbe:
            httpGet: { path: /readyz, port: 8080 }
            initialDelaySeconds: 5
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
```

### HPA + PDB Pairing

```
HPA ensures enough pods exist for load:
  minReplicas: 3  →  maxReplicas: 20
  ├─ CPU target: 70%
  └─ Custom metric: requests_per_second target 1000

PDB ensures enough pods survive disruptions:
  minAvailable: 2  (or maxUnavailable: 1)
  └─ Guarantees service during node drains, upgrades
```

### Gateway API (replaces Ingress, K8s 1.31+)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-routes
spec:
  parentRefs:
    - name: main-gateway
  rules:
    - matches:
        - path: { type: PathPrefix, value: /api/v1 }
      backendRefs:
        - name: api-service
          port: 8080
          weight: 90
        - name: api-service-canary
          port: 8080
          weight: 10          # 10% canary traffic
```

## Anti-Patterns

1. **No resource limits** — pods consume unbounded resources and starve neighbors. Always set both requests and limits.
2. **Missing health probes** — K8s cannot detect unhealthy pods. Define both liveness (restart stuck pods) and readiness (stop routing to unready pods).
3. **PDB without HPA** — PDB alone does not scale. Pair with HPA so disruptions do not reduce capacity below minimum.
4. **Privileged containers** — `privileged: true` grants host-level access. Use `securityContext.runAsNonRoot: true` and drop all capabilities.
5. **Hardcoded image tags** — `:latest` in production is non-reproducible. Use digest or semver tags.

## Quality Checklist

```
[ ] All containers have resource requests AND limits
[ ] Liveness and readiness probes defined
[ ] SecurityContext sets runAsNonRoot: true
[ ] NetworkPolicy restricts ingress/egress
[ ] PodDisruptionBudget defined for stateless workloads
[ ] HPA configured with appropriate min/max replicas
[ ] TopologySpreadConstraints for multi-zone resilience
[ ] Image tags pinned (no :latest in prod)
[ ] Labels follow app.kubernetes.io conventions
[ ] Secrets mounted as volumes, not environment variables
[ ] Helm chart passes `helm lint` and `helm template` validation
[ ] Kustomize overlays tested for dev, staging, and prod
```
