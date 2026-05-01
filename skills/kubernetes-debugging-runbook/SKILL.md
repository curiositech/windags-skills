---
name: kubernetes-debugging-runbook
description: 'Use when triaging CrashLoopBackOff, OOMKilled, ImagePullBackOff, Pending pods, networking failures, ingress 502/504, PVC stuck, HPA not scaling, init-container loops, sidecar startup ordering, or "kubectl describe says nothing useful". Triggers: pod restart counts climbing, "no nodes available to schedule", "back-off restarting failed container", DNS resolution failures inside the cluster, NetworkPolicy denials, livenessProbe killing healthy pods. NOT for cluster setup (kubeadm, kops), cloud-provider-specific managed K8s admin (EKS/GKE/AKS), helm chart authoring, or service mesh internals.'
category: DevOps & Infrastructure
tags:
  - kubernetes
  - debugging
  - runbook
  - operations
  - networking
  - observability
---

# Kubernetes Debugging Runbook

`kubectl describe` is the single most useful command in Kubernetes. The events at the bottom answer 80% of "why isn't this working" questions if you read them. This runbook is the playbook for the other 20%.

## When to use

- Pod stuck in `Pending`, `CrashLoopBackOff`, `ImagePullBackOff`, `Init:Error`.
- Pod restarts climb but logs show clean shutdown.
- Service routes to no endpoints despite the deployment being ready.
- HPA shows targets but never scales.
- Inter-pod traffic blocked despite no NetworkPolicy you wrote.
- Disk pressure or eviction storms on a node.

## Core capabilities

### The triage sequence

```bash
kubectl get pods -n NAMESPACE                              # status overview
kubectl describe pod POD -n NAMESPACE                      # events at the bottom
kubectl logs POD -n NAMESPACE --previous                   # logs from the crashed instance
kubectl logs POD -n NAMESPACE -c CONTAINER                 # specific container in a multi-container pod
kubectl get events -n NAMESPACE --sort-by='.lastTimestamp' # cluster-wide context
```

`--previous` is critical for CrashLoopBackOff — the current logs are from the not-yet-crashed instance.

### Decoding pod status

| Status | Likely cause |
|--------|-------------|
| `Pending` + no events | Scheduler hasn't tried yet; usually transient. |
| `Pending` + "no nodes available" | Resource requests too high, taint mismatch, PV affinity. |
| `ContainerCreating` (long) | ImagePull, volume attach, or sidecar init delay. |
| `ImagePullBackOff` | Image name typo, registry auth, image deleted. |
| `CrashLoopBackOff` | App exits non-zero on startup. Check `--previous` logs. |
| `Init:Error` | Init container failed. `kubectl logs POD -c INIT_NAME`. |
| `OOMKilled` (in describe) | Memory limit exceeded. |
| `Error` exit code 137 | SIGKILL — usually OOM or liveness probe failure. |
| `Completed` | Job ran. For Deployment, this means the container exited 0 immediately — usually a misconfigured `command`. |

### CrashLoopBackOff playbook

```bash
# 1. Last logs before the crash
kubectl logs POD --previous

# 2. Exit code
kubectl describe pod POD | grep -A3 "Last State"

# 3. Resource limits — was it OOMKilled?
kubectl describe pod POD | grep -A2 "Limits"

# 4. Liveness probe killed it?
kubectl describe pod POD | grep -A5 "Liveness"

# 5. Configmap/secret references resolved?
kubectl describe pod POD | grep -A1 "Mounts"
```

Common roots:
- App reads an env var the container doesn't have → exit 1 in 0.1s.
- Liveness probe hits an endpoint that takes longer than `timeoutSeconds` to respond.
- Memory request set; limit not — OOMKilled when traffic arrives.
- Init container ran a migration that's already applied; exits non-zero.

### OOMKilled

```bash
kubectl describe pod POD | grep -E "OOMKilled|Last State|Limits"
```

Set both `requests` and `limits`:

```yaml
resources:
  requests: { memory: 256Mi, cpu: 100m }
  limits:   { memory: 512Mi, cpu: 500m }
```

Limit too low → OOMKilled under load. No limit → noisy neighbor evicts other pods. Use `kubectl top pod` to see actual usage and size accordingly.

### ImagePullBackOff

```bash
kubectl describe pod POD | grep -A3 "Events:"
# "Failed to pull image": typo, deleted tag, or auth.
# "no such host": private registry not reachable from nodes.
```

Verify the image exists from the cluster:

```bash
kubectl run -i --rm test --image=YOUR_IMAGE --restart=Never --command -- sh -c "echo OK"
```

For private registries, `imagePullSecrets` must reference a Docker-config secret in the pod's namespace:

```bash
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=... \
  --docker-password=... \
  -n YOUR_NAMESPACE
```

### Pending: no nodes match

```bash
kubectl describe pod POD | grep -A5 "Events"
# "0/N nodes are available: N Insufficient cpu, N Insufficient memory."
# "0/N nodes are available: N node(s) had untolerated taint."
# "0/N nodes are available: N node(s) didn't find available persistent volumes to bind."
```

For taint mismatches, add a toleration:

```yaml
tolerations:
- key: "dedicated"
  operator: "Equal"
  value: "gpu"
  effect: "NoSchedule"
```

For PV binding, check the PVC's storage class and the PV's `claimRef`:

```bash
kubectl get pvc -n NS
kubectl describe pvc PVC -n NS
kubectl get pv | grep PVC_NAME
```

### Service has no endpoints

```bash
kubectl get endpoints SVC -n NS                            # empty?
kubectl describe svc SVC -n NS | grep "Selector"           # selector
kubectl get pods -n NS --selector=KEY=VALUE -l            # what does the selector match?
```

Endpoints empty = the selector matches no pods, OR matched pods aren't ready. Pods need both `Running` AND passing readinessProbe.

### Networking inside the cluster

```bash
# Run a transient debug pod with curl + dig.
kubectl run -i --rm dbg --image=nicolaka/netshoot --restart=Never -- sh

# From dbg:
nslookup my-svc.my-ns.svc.cluster.local
curl -v http://my-svc.my-ns.svc.cluster.local:8080/health
```

If DNS fails, check CoreDNS pods (`kubectl get pods -n kube-system | grep coredns`).

If DNS works but curl times out, suspect a NetworkPolicy:

```bash
kubectl get netpol -n NS
kubectl describe netpol POLICY -n NS
```

NetworkPolicies are deny-by-default once any policy targets a pod. A `default-deny` ingress policy blocks all traffic until you explicitly allow it.

### HPA not scaling

```bash
kubectl describe hpa HPA -n NS | grep -A5 "Conditions"
# "FailedGetResourceMetric" → metrics-server not running or pod has no requests.
```

HPA needs `resources.requests` on the pod containers to compute utilization. Without `requests.cpu`, the CPU-percentage HPA is undefined.

```bash
kubectl get apiservices | grep metrics
kubectl top pods -n NS                                     # quick "is metrics-server alive" check
```

### Disk pressure / evictions

```bash
kubectl describe node NODE | grep -A5 "Conditions"
kubectl get events --field-selector reason=Evicted -A
```

Common roots: unbounded log files (set up logrotate or use a log driver), emptyDir volumes filling local disk, container image cache full.

## Anti-patterns

### Reading current logs on a CrashLoopBackOff

**Symptom:** `kubectl logs POD` shows nothing useful; pod is restarting.
**Diagnosis:** Reading the in-flight container's logs, which haven't started writing yet.
**Fix:** `kubectl logs POD --previous` to read the last instance's logs.

### Liveness probe set to the same endpoint as readiness

**Symptom:** Healthy pods get killed mid-flight.
**Diagnosis:** Liveness asserts the app is wedged; readiness asserts it can serve traffic. Conflating them causes a slow GC pause to trigger a kill.
**Fix:** Liveness should check process aliveness only (a TCP socket open, /healthz that returns 200 from a goroutine independent of the request path). Readiness checks dependencies.

### Memory `limit` without `requests`

**Symptom:** Pod scheduled on a fully-utilized node and OOMKilled at random.
**Diagnosis:** Without requests, scheduler treats the pod as 0-memory; node accepts it past capacity.
**Fix:** Always set `requests` ≤ typical usage and `limits` 1.5-2x requests.

### `kubectl exec` to "fix" a misbehaving pod

**Symptom:** Engineer manually `kubectl exec`s in and edits config.
**Diagnosis:** Pod is ephemeral; restart wipes the change. Worse, the pod is now an undocumented snowflake.
**Fix:** Reproduce in a debug pod (`kubectl run --rm`), commit the fix to the manifest.

### NetworkPolicy default-deny without per-namespace audit

**Symptom:** Adding a deny policy in one namespace breaks unrelated services.
**Diagnosis:** Cluster-wide controllers (Prometheus, cert-manager) traffic blocked.
**Fix:** Always pair a default-deny with explicit allows for monitoring, ingress controllers, and any cross-namespace traffic the policy needs to permit.

### `imagePullSecrets` in the wrong namespace

**Symptom:** ImagePullBackOff after migrating a Deployment to a new namespace.
**Diagnosis:** Secret existed in `default` only; deployment's namespace doesn't have it.
**Fix:** Recreate the secret in the new namespace, or use `serviceAccount.imagePullSecrets` referenced everywhere.

## Quality gates

- [ ] Every container has both `requests` and `limits` for memory and CPU.
- [ ] Liveness probes check process aliveness only; readiness checks dependencies.
- [ ] Production deploys disable `latest` tag; pin to immutable tags or digests.
- [ ] NetworkPolicies tested in staging with explicit allow rules for monitoring.
- [ ] Critical pod restart events alert (Prometheus rule on `kube_pod_container_status_restarts_total`).
- [ ] OOMKilled events alert separately from generic restart spikes.
- [ ] HPA targets configured only on metrics with `requests` defined.
- [ ] Pod logs go to a centralized destination, not just node disk.
- [ ] Runbook links from each alert pointing to the relevant kubectl invocation.

## NOT for

- **Cluster setup** (kubeadm, kops, k3s installation) — different domain.
- **Cloud-provider-specific** managed K8s admin (EKS node groups, GKE Autopilot quirks, AKS networking).
- **Helm chart authoring** — separate skill.
- **Service mesh internals** (Istio, Linkerd) — different debugging surface.
- **Operator pattern development** — controller-runtime is its own deep area. No dedicated skill yet.
- **Image build & cache strategy** — once it's `ImagePullBackOff` from a missing layer, → `dockerfile-build-cache-mastery`.
- **Span-level latency triage / missing trace correlation** — → `opentelemetry-instrumentation`.
- **Cluster-wide SLO dashboards** — → `grafana-dashboard-builder`.
- **Log volume blowing up from chatty pods** — → `structured-logging-design`.
