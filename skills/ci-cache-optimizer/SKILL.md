---
license: Apache-2.0
name: ci-cache-optimizer
description: "CI/CD caching optimizer for dependency caching, Docker layer caching, and build speed improvements. Activate on: CI cache, build speed, dependency caching, Docker layer cache, turbo remote cache, GitHub Actions cache, pnpm store cache. NOT for: CI/CD pipeline creation (use github-actions-pipeline-builder), deployment strategy (use blue-green-deployment-orchestrator), Docker image building (use docker-multi-stage-optimizer)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - ci-cd
  - caching
  - performance
  - build-speed
pairs-with:
  - skill: github-actions-pipeline-builder
    reason: Pipeline builder creates workflows; this skill optimizes their speed
  - skill: docker-multi-stage-optimizer
    reason: Docker layer caching is a key CI performance lever
---

# CI Cache Optimizer

Expert in reducing CI/CD build times through dependency caching, Docker layer caching, and build pipeline optimization.

## Activation Triggers

**Activate on:** "CI cache", "build speed", "dependency caching", "Docker layer cache", "turbo remote cache", "GitHub Actions cache", "pnpm store cache", "slow builds", "CI optimization"

**NOT for:** Pipeline creation → `github-actions-pipeline-builder` | Deployment strategy → `blue-green-deployment-orchestrator` | Docker builds → `docker-multi-stage-optimizer`

## Quick Start

1. **Profile the build** — measure time per step to find the bottleneck (usually dependency install or Docker builds)
2. **Cache dependencies** — restore package manager cache (pnpm store, pip cache, Go module cache)
3. **Cache Docker layers** — use BuildKit cache or GitHub Actions Docker cache
4. **Cache build outputs** — Turborepo remote cache, Next.js build cache, compiled artifacts
5. **Parallelize** — split test suites, build independent packages concurrently

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Dependency Cache** | pnpm store, npm cache, pip cache, Go module cache, Cargo registry |
| **Docker Cache** | BuildKit inline cache, GitHub Actions gha cache, registry cache |
| **Build Cache** | Turborepo remote cache, Nx Cloud, Gradle build cache, ccache |
| **CI Platforms** | GitHub Actions, GitLab CI, CircleCI, Buildkite |
| **Analysis** | GitHub Actions timing, CI Insights, custom duration metrics |

## Architecture Patterns

### GitHub Actions Dependency Cache (pnpm)

```yaml
# .github/workflows/ci.yml
- uses: pnpm/action-setup@v4
  with:
    version: 9

- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm'           # Built-in pnpm cache support

# Turbo remote cache for monorepo build outputs
- name: Build
  run: pnpm turbo build --cache-dir=.turbo
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

### Docker Layer Cache Strategies

```yaml
# Strategy 1: GitHub Actions cache backend (fastest for GHA)
- uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max

# Strategy 2: Registry cache (works across CI providers)
- uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: registry.io/myapp:latest
    cache-from: type=registry,ref=registry.io/myapp:cache
    cache-to: type=registry,ref=registry.io/myapp:cache,mode=max
```

### Cache Hierarchy (What to Cache, in Priority Order)

```
Priority 1 — Dependency install (biggest time save):
  ├─ pnpm store: ~/.local/share/pnpm/store
  ├─ pip cache: ~/.cache/pip
  ├─ Go modules: ~/go/pkg/mod
  └─ Cargo registry: ~/.cargo/registry

Priority 2 — Build outputs (incremental builds):
  ├─ Turbo remote cache: .turbo/
  ├─ Next.js: .next/cache
  ├─ TypeScript: tsconfig.tsbuildinfo
  └─ Webpack: node_modules/.cache

Priority 3 — Docker layers (image builds):
  ├─ BuildKit cache mounts
  ├─ Docker layer cache (gha or registry)
  └─ Multi-stage build ordering

Priority 4 — Test artifacts (expensive to regenerate):
  ├─ Playwright browsers: ~/.cache/ms-playwright
  ├─ Cypress: ~/.cache/Cypress
  └─ Snapshot baselines
```

## Anti-Patterns

1. **Caching node_modules directly** — fragile and large. Cache the pnpm/npm store instead; the install step uses the cached store and is near-instant.
2. **No cache key versioning** — stale caches cause mysterious failures. Include lockfile hash in the cache key: `key: deps-${{ hashFiles('pnpm-lock.yaml') }}`.
3. **Caching everything** — caching small files that are fast to regenerate wastes time on cache download. Only cache what saves more time than the restore cost.
4. **Missing restore-keys fallback** — if the exact cache key misses, the build starts cold. Use `restore-keys` with prefix matching for partial cache hits.
5. **Not profiling first** — adding caching without knowing the bottleneck. Measure step durations first; the slowest step gets caching priority.

## Quality Checklist

```
[ ] CI build time profiled and bottleneck identified
[ ] Dependency cache uses lockfile hash as cache key
[ ] Fallback restore-keys configured for partial hits
[ ] Docker builds use BuildKit with cache-from/cache-to
[ ] Turbo/Nx remote cache enabled for monorepo builds
[ ] Test browser binaries cached (Playwright, Cypress)
[ ] Cache size monitored (GitHub Actions: 10GB limit)
[ ] Stale caches cleaned via retention or key rotation
[ ] Parallel jobs configured for independent packages
[ ] Build time target set (e.g., < 5 minutes for PR checks)
[ ] Cache hit rate tracked (> 80% target)
[ ] Before/after metrics documented for optimization efforts
```
