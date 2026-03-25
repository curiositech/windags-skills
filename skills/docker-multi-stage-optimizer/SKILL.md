---
license: Apache-2.0
name: docker-multi-stage-optimizer
description: "Multi-stage Docker build optimizer for minimal, secure production images. Activate on: Dockerfile optimization, multi-stage build, distroless image, container size reduction, Docker security scanning, BuildKit features. NOT for: container orchestration (use kubernetes-manifest-generator), CI/CD pipelines (use github-actions-pipeline-builder), runtime container config (use environment-config-manager)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - docker
  - containers
  - security
  - optimization
pairs-with:
  - skill: docker-containerization
    reason: General container patterns that this skill optimizes
  - skill: ci-cache-optimizer
    reason: Docker layer caching is a key CI speed lever
---

# Docker Multi-Stage Optimizer

Expert in crafting minimal, secure Docker images using multi-stage builds, distroless bases, and BuildKit optimizations.

## Activation Triggers

**Activate on:** "Dockerfile optimization", "multi-stage build", "distroless image", "container size", "Docker security scan", "BuildKit", "image layers", "slim image", "Docker best practices"

**NOT for:** Container orchestration → `kubernetes-manifest-generator` | CI/CD pipelines → `github-actions-pipeline-builder` | Runtime config → `environment-config-manager`

## Quick Start

1. **Audit the existing Dockerfile** — identify redundant layers, large base images, leaked secrets
2. **Design multi-stage pipeline** — separate build, test, and runtime stages
3. **Select minimal base** — distroless, alpine, or scratch depending on runtime needs
4. **Enable BuildKit** — use cache mounts, secret mounts, and parallel builds
5. **Scan and validate** — run Trivy/Grype, verify no dev dependencies in final image

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Multi-Stage Builds** | Builder pattern, named stages, COPY --from, cross-compilation |
| **Base Images** | gcr.io/distroless, alpine 3.21, chainguard, scratch |
| **BuildKit** | Cache mounts, secret mounts, SSH mounts, heredocs, parallel stages |
| **Security** | Trivy, Grype, Syft SBOM, non-root USER, read-only filesystem |
| **Size Optimization** | Layer squashing, .dockerignore, multi-arch builds, UPX compression |

## Architecture Patterns

### Multi-Stage Build Pipeline

```dockerfile
# Stage 1: Dependencies (cached aggressively)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Stage 2: Build
FROM deps AS build
COPY . .
RUN pnpm build

# Stage 3: Production (minimal)
FROM gcr.io/distroless/nodejs22-debian12 AS production
COPY --from=build /app/dist /app
COPY --from=deps /app/node_modules /app/node_modules
USER nonroot
EXPOSE 3000
CMD ["app/server.js"]
```

### BuildKit Cache Mount Pattern

```dockerfile
# Python: cache pip downloads across builds
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Go: cache module downloads and build cache
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o /app ./cmd/server
```

### Security-First Layer Ordering

```
Least-changing layers first (maximize cache):
  1. Base image selection
  2. System packages (apt-get)
  3. Dependency lockfiles (package-lock, go.sum)
  4. Dependency install
  5. Source code COPY
  6. Build command
  7. Runtime stage (minimal)
```

## Anti-Patterns

1. **Single-stage production images** — shipping compilers, dev tools, and test fixtures in production. Always use multi-stage to separate build from runtime.
2. **Using `latest` tag for base images** — non-reproducible builds. Pin to digest or specific version (`node:22.14-alpine3.21`).
3. **Running as root** — containers default to root. Always add `USER nonroot` or `USER 1000:1000` in the final stage.
4. **COPY . . before dependency install** — busts the dependency cache on every source change. Copy lockfiles first, install, then copy source.
5. **Secrets in build args** — `ARG`/`ENV` values persist in image layers. Use `--mount=type=secret` with BuildKit instead.

## Quality Checklist

```
[ ] Final image uses distroless, alpine, or scratch base
[ ] No compiler, build tools, or dev dependencies in final stage
[ ] Image runs as non-root user
[ ] No secrets in build args or environment variables
[ ] .dockerignore excludes .git, node_modules, .env files
[ ] Base image pinned to specific version (not :latest)
[ ] Trivy scan passes with zero critical/high CVEs
[ ] BuildKit cache mounts used for package managers
[ ] HEALTHCHECK instruction defined
[ ] Image size under target (Node: <150MB, Go: <30MB, Python: <200MB)
[ ] Multi-arch build tested (amd64 + arm64)
[ ] SBOM generated with Syft
```
