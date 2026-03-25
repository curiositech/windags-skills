---
license: Apache-2.0
name: railway-render-deployment
description: "Indie-friendly cloud deployment on Railway, Render, and Fly.io with autoscaling and cost optimization. Activate on: Railway deployment, Render deploy, Fly.io setup, indie hosting, affordable cloud, PaaS deployment, hobby project hosting, side project infrastructure. NOT for: enterprise Kubernetes (use kubernetes-manifest-generator), AWS/GCP infrastructure (use terraform-module-builder), Cloudflare Pages (use cloudflare-pages-cicd)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - railway
  - render
  - flyio
  - deployment
pairs-with:
  - skill: vercel-deployment
    reason: Vercel for frontend; Railway/Render/Fly for backend services
  - skill: docker-multi-stage-optimizer
    reason: Optimized Docker images reduce costs on metered platforms
---

# Railway / Render / Fly.io Deployment

Expert in deploying to indie-friendly PaaS platforms with optimal cost, autoscaling, and developer experience.

## Activation Triggers

**Activate on:** "Railway deploy", "Render setup", "Fly.io", "indie hosting", "affordable cloud", "PaaS deployment", "side project hosting", "hobby project", "scale to zero"

**NOT for:** Enterprise K8s → `kubernetes-manifest-generator` | AWS/GCP IaC → `terraform-module-builder` | Cloudflare Pages → `cloudflare-pages-cicd`

## Quick Start

1. **Choose platform** — Railway for simplicity, Fly.io for edge compute, Render for free tier services
2. **Connect repo** — Git push deploys with automatic build detection
3. **Add services** — database, Redis, cron jobs from platform marketplace
4. **Configure scaling** — scale-to-zero for cost, autoscale for traffic
5. **Set custom domain** — CNAME to platform, automatic TLS

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Railway** | Nixpacks builds, volumes, cron, TCP/HTTP services, templates |
| **Render** | Native runtimes, Blueprints (IaC), disk storage, free tier |
| **Fly.io** | fly.toml, Machines API, volumes, edge regions, Litefs (SQLite) |
| **Databases** | Railway Postgres/MySQL/Redis, Render managed Postgres, Fly Postgres |
| **Cost** | Scale-to-zero, usage-based billing, spend alerts |

## Architecture Patterns

### Platform Decision Matrix

```
┌──────────────┬────────────┬────────────┬────────────┐
│ Criteria     │ Railway    │ Render     │ Fly.io     │
├──────────────┼────────────┼────────────┼────────────┤
│ Ease of use  │ Best       │ Great      │ Good       │
│ Free tier    │ $5 trial   │ Yes (750h) │ Yes (3 VMs)│
│ Scale-to-0   │ Yes        │ No (paid)  │ Yes        │
│ Edge regions │ No         │ No         │ Yes (35+)  │
│ Databases    │ Built-in   │ Managed PG │ Fly PG     │
│ Docker       │ Nixpacks   │ Dockerfile │ Dockerfile │
│ SQLite       │ Volumes    │ Disk       │ LiteFS     │
│ Best for     │ Full-stack │ Static+API │ Edge apps  │
└──────────────┴────────────┴────────────┴────────────┘
```

### Fly.io Multi-Region with LiteFS

```toml
# fly.toml
app = "my-app"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  auto_stop_machines = "stop"    # Scale to zero
  auto_start_machines = true
  min_machines_running = 0

[mounts]
  source = "data"
  destination = "/data"

[[vm]]
  size = "shared-cpu-1x"
  memory = "256mb"
```

### Railway Service Composition

```
┌─────────────────────────────────────────┐
│            Railway Project               │
├─────────────┬────────────┬──────────────┤
│  Web API    │  Worker    │  Cron        │
│  (Node.js)  │  (Python)  │  (Go binary) │
│  Port 3000  │  No port   │  Schedule    │
├─────────────┴────────────┴──────────────┤
│  PostgreSQL  │  Redis    │  S3 (R2)     │
│  (Plugin)    │  (Plugin) │  (External)  │
└─────────────────────────────────────────┘

All services share internal networking.
Environment variables auto-injected for database URLs.
Deploy via `railway up` or Git push.
```

## Anti-Patterns

1. **Running databases on Fly.io without backups** — Fly Postgres is unmanaged. Set up `pg_dump` cron or use managed databases (Supabase, Neon) instead.
2. **Not enabling scale-to-zero** — paying for idle compute. Configure `auto_stop_machines` on Fly.io or Railway's scale-to-zero for low-traffic services.
3. **Storing state in ephemeral containers** — containers restart and lose local data. Use volumes (persistent disk) or external storage (S3/R2, managed DB).
4. **Ignoring egress costs** — data transfer out can be expensive. Fly.io includes 100GB; Railway meters it. Cache aggressively and compress responses.
5. **Over-provisioning for hobby projects** — starting with 2GB RAM instances for a blog. Start with the smallest tier and scale up based on actual metrics.

## Quality Checklist

```
[ ] Git-push deploy configured and tested
[ ] Health check endpoint defined
[ ] Scale-to-zero enabled for non-critical services
[ ] Database has automated backups (managed or cron pg_dump)
[ ] Custom domain with automatic TLS
[ ] Environment variables set (not hardcoded)
[ ] Spend alerts configured at budget threshold
[ ] Dockerfile optimized (multi-stage, minimal final image)
[ ] Persistent storage on volumes, not ephemeral filesystem
[ ] Preview environments for PRs (Railway/Render)
[ ] Monitoring via platform dashboard or external (Sentry, Axiom)
[ ] Migration strategy documented for platform lock-in escape
```
