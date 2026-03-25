---
license: Apache-2.0
name: environment-config-manager
description: "Environment configuration manager for 12-factor config, feature flags, and multi-environment management. Activate on: environment variables, ConfigMap, feature flags, 12-factor config, dotenv management, config per environment, runtime config. NOT for: secret storage (use secret-management-expert), IaC provisioning (use terraform-module-builder), CI/CD variables (use github-actions-pipeline-builder)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - configuration
  - twelve-factor
  - feature-flags
  - devops
pairs-with:
  - skill: devops-automator
    reason: Config management is a core piece of deployment automation
  - skill: secret-management-expert
    reason: Secrets are a special class of configuration requiring separate handling
---

# Environment Config Manager

Expert in 12-factor configuration management, feature flags, and environment-specific config across dev, staging, and production.

## Activation Triggers

**Activate on:** "environment variables", "ConfigMap", "feature flags", "12-factor config", "dotenv setup", "config per environment", "runtime configuration", "config validation", "environment parity"

**NOT for:** Secret storage → `secret-management-expert` | IaC provisioning → `terraform-module-builder` | CI/CD variables → `github-actions-pipeline-builder`

## Quick Start

1. **Separate config from code** — no hardcoded URLs, ports, or feature toggles in source
2. **Define config schema** — typed validation with defaults (zod, envalid, convict)
3. **Layer environments** — base config overridden by environment-specific values
4. **Implement feature flags** — runtime toggleable features without deployment
5. **Validate on startup** — fail fast if required config is missing or invalid

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Validation** | zod, envalid, @t3-oss/env-nextjs, convict, joi |
| **Feature Flags** | LaunchDarkly, Unleash, Flagsmith, Statsig, simple JSON flags |
| **K8s Config** | ConfigMap, ExternalSecret, Kustomize overlays |
| **Local Dev** | dotenv, direnv, 1Password CLI (`op run`), docker-compose env |
| **Runtime Config** | etcd, Consul KV, AWS AppConfig, Firebase Remote Config |

## Architecture Patterns

### Typed Config Validation (TypeScript)

```typescript
// config/env.ts — fail fast on invalid config
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  FEATURE_NEW_CHECKOUT: z.coerce.boolean().default(false),
  API_RATE_LIMIT: z.coerce.number().default(100),
});

export type Env = z.infer<typeof envSchema>;

// Parse and validate — throws on startup if invalid
export const env = envSchema.parse(process.env);
```

### Environment Layering

```
.env                    # Base defaults (committed, no secrets)
.env.development        # Dev overrides (committed)
.env.staging            # Staging overrides (committed, no secrets)
.env.production         # Production overrides (committed, no secrets)
.env.local              # Local overrides (gitignored, may have secrets)

Loading order (later overrides earlier):
  .env → .env.{NODE_ENV} → .env.local

Secrets come from secret store, NOT .env files:
  DATABASE_URL → AWS Secrets Manager / Vault
  API_KEY → External Secrets Operator
```

### Feature Flag Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Client     │    │  Flag Store   │    │   Admin UI   │
│  SDK/hook    │───▶│  (Unleash/   │◀───│  Toggle flags │
│              │    │   LaunchDarkly)│    │  per env     │
└──────────────┘    └──────────────┘    └──────────────┘

Evaluation: user context + flag rules → boolean/variant
  - Percentage rollout: 10% of users see new feature
  - User targeting: beta users see new feature
  - Environment: enabled in staging, disabled in production
  - Kill switch: instantly disable without deployment
```

## Anti-Patterns

1. **Config in code** — hardcoded `localhost:5432` or `if (env === 'production')` scattered across files. Centralize all config in one validated module.
2. **Secrets in .env files committed to Git** — even example files leak secret formats. Use `.env.example` with placeholder descriptions, not values.
3. **No config validation** — trusting `process.env.PORT` is a valid number. Validate and coerce all config at startup with a schema library.
4. **Feature flags as permanent config** — flags accumulate and become tech debt. Set expiration dates and clean up old flags quarterly.
5. **Environment-specific code paths** — `if (process.env.NODE_ENV === 'production')` for business logic. Use feature flags instead; environment should only affect infrastructure config.

## Quality Checklist

```
[ ] All config loaded from environment variables (12-factor compliant)
[ ] Config schema validated on application startup (fail fast)
[ ] .env.example documents all required variables with descriptions
[ ] No secrets in committed .env files
[ ] .env.local in .gitignore
[ ] Feature flags have owner, description, and expiration date
[ ] Dev/staging/production parity maintained (same config keys)
[ ] Config changes do not require code deployment
[ ] Default values sensible for development (zero-config local setup)
[ ] ConfigMaps and Secrets separated in Kubernetes
[ ] Feature flag cleanup tracked in backlog
[ ] Runtime config changes logged and auditable
```
