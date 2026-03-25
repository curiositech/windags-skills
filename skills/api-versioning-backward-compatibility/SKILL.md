---
license: Apache-2.0
name: api-versioning-backward-compatibility
description: "API migration strategies, deprecation workflows, and header/URL/content versioning. Activate on: API versioning, backward compatibility, deprecation, breaking change, API migration, v1 v2, sunset header. NOT for: schema evolution in data (use schema-evolution-manager), gateway routing (use api-gateway-reverse-proxy-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Backend & Infrastructure
tags:
  - api-versioning
  - backward-compatibility
  - deprecation
  - migration
  - semver
pairs-with:
  - skill: api-gateway-reverse-proxy-expert
    reason: Gateway handles version-based routing
  - skill: schema-evolution-manager
    reason: Data schema evolution parallels API versioning
  - skill: graphql-server-architect
    reason: GraphQL has its own deprecation model via @deprecated
---

# API Versioning & Backward Compatibility

Design API versioning strategies that evolve gracefully without breaking existing consumers.

## Activation Triggers

**Activate on:** "API versioning", "backward compatibility", "deprecation", "breaking change", "API migration", "v1 v2", "sunset header", "API evolution", "non-breaking change"

**NOT for:** Data schema evolution → `schema-evolution-manager` | Gateway version routing → `api-gateway-reverse-proxy-expert` | GraphQL deprecation → `graphql-server-architect`

## Quick Start

1. **Classify the change** — additive (safe), modification (maybe breaking), removal (breaking)
2. **Choose strategy** — URL path (`/v2/`), header (`API-Version`), or content negotiation
3. **Implement Sunset headers** — RFC 8594 tells consumers when old versions die
4. **Run versions in parallel** — minimum 6-month overlap for major versions
5. **Monitor adoption** — track per-version traffic to know when to retire

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **URL Versioning** | `/api/v1/`, `/api/v2/` path-based routing |
| **Header Versioning** | `API-Version: 2024-01-15`, `Accept-Version` |
| **Content Negotiation** | `Accept: application/vnd.myapi.v2+json` |
| **Deprecation** | Sunset header (RFC 8594), Deprecation header |
| **Tooling** | OpenAPI 3.1 overlays, Optic, Bump.sh |

## Architecture Patterns

### Versioning Strategy Decision Tree

```
Is it additive only? (new fields, new endpoints)
  ├─ YES → No version bump needed (backward compatible)
  └─ NO → Is it a field rename/type change?
       ├─ YES → Can you keep both old + new fields?
       │    ├─ YES → Add new, deprecate old (minor version)
       │    └─ NO → Major version bump (v1 → v2)
       └─ NO → Is it a removal?
            └─ YES → Major version bump with sunset period
```

### Parallel Version Deployment

```typescript
// Express router with version-based routing
import { Router } from 'express';

const v1Router = Router();
const v2Router = Router();

// v1: returns { name: string }
v1Router.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ name: user.fullName }); // legacy shape
});

// v2: returns { firstName, lastName, displayName }
v2Router.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.fullName,
  });
});

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Sunset header middleware for v1
v1Router.use((req, res, next) => {
  res.set('Sunset', 'Sat, 01 Nov 2026 00:00:00 GMT');
  res.set('Deprecation', 'true');
  res.set('Link', '</api/v2>; rel="successor-version"');
  next();
});
```

### Date-Based Versioning (Stripe Model)

```
API-Version: 2026-03-15

Changes are tied to dates, not integers:
  2026-01-01 → baseline
  2026-03-15 → renamed `name` → `display_name`
  2026-06-01 → removed `legacy_field`

Server pins unversioned requests to the account's default version.
Each version is a transform layer over the canonical internal model.
```

## Anti-Patterns

1. **Versioning too eagerly** — most changes are additive and do not require a version bump; add fields freely
2. **No sunset timeline** — deprecating without a concrete shutdown date means versions live forever
3. **Copying entire controllers** — use a transform/adapter layer, not duplicated business logic per version
4. **Ignoring unknown fields** — APIs should be tolerant readers; ignore unknown fields on input (Postel's Law)
5. **Breaking changes in minor versions** — if consumers relied on it, removing it is breaking regardless of your intent

## Quality Checklist

- [ ] Additive changes (new fields, new endpoints) ship without version bump
- [ ] Breaking changes require major version with 6+ month sunset period
- [ ] Sunset header (RFC 8594) set on deprecated versions
- [ ] Link header points consumers to successor version
- [ ] Per-version traffic monitored to track migration progress
- [ ] OpenAPI spec published per version with diff tooling (Optic/Bump.sh)
- [ ] Consumer notification plan: changelog, email, dashboard warning
- [ ] Version routing handled at gateway level, not in application code
- [ ] Integration tests validate backward compatibility (contract tests)
