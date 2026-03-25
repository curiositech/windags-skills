---
license: Apache-2.0
name: multi-tenant-architecture-expert
description: "Tenant isolation, row-level security, shared/siloed schema patterns for SaaS platforms. Activate on: multi-tenant, tenant isolation, RLS, shared database, SaaS architecture, tenant context, data isolation. NOT for: connection pooling (use database-connection-pool-manager), API gateway routing (use api-gateway-reverse-proxy-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,psql:*)
category: Backend & Infrastructure
tags:
  - multi-tenant
  - saas
  - rls
  - tenant-isolation
  - postgres
pairs-with:
  - skill: database-connection-pool-manager
    reason: Pool segmentation per tenant or shared pool tuning
  - skill: api-rate-limiting-throttling-expert
    reason: Per-tenant rate limits prevent noisy neighbors
  - skill: cache-strategy-invalidation-expert
    reason: Cache keys must be tenant-scoped
---

# Multi-Tenant Architecture Expert

Design and implement multi-tenant SaaS systems with proper data isolation, tenant context propagation, and noisy neighbor prevention.

## Activation Triggers

**Activate on:** "multi-tenant", "tenant isolation", "RLS", "shared database", "SaaS architecture", "tenant context", "data isolation", "noisy neighbor", "tenant onboarding"

**NOT for:** Connection pool sizing → `database-connection-pool-manager` | API gateway tenant routing → `api-gateway-reverse-proxy-expert` | Authorization framework → relevant auth skill

## Quick Start

1. **Choose isolation model** — shared DB with RLS (cost-efficient), schema-per-tenant (moderate), DB-per-tenant (maximum isolation)
2. **Propagate tenant context** — extract from JWT/header, set in middleware, available throughout request lifecycle
3. **Enforce at database level** — Row-Level Security policies in PostgreSQL, not just application-level WHERE clauses
4. **Scope everything** — caches, queues, file storage, logs must all include tenant ID
5. **Prevent noisy neighbors** — per-tenant rate limits, connection limits, and resource quotas

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Database RLS** | PostgreSQL RLS, Supabase RLS, Neon branch-per-tenant |
| **Schema Isolation** | PostgreSQL schemas, schema_search_path |
| **Tenant Context** | AsyncLocalStorage (Node), cls-hooked, middleware injection |
| **ORMs** | Prisma multi-schema, Drizzle with RLS, TypeORM tenant scope |
| **Infrastructure** | Kubernetes namespaces, AWS Organizations, tenant-aware CDN |

## Architecture Patterns

### Shared Database with PostgreSQL RLS

```sql
-- Enable RLS on all tenant tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: tenants see only their own data
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Set tenant context per request (from middleware)
SET LOCAL app.current_tenant = 'tenant-uuid-here';

-- All queries now automatically filtered
SELECT * FROM orders;  -- only returns current tenant's orders
```

### Tenant Context Middleware (Node.js)

```typescript
import { AsyncLocalStorage } from 'node:async_hooks';

interface TenantContext { tenantId: string; plan: 'free' | 'pro' | 'enterprise'; }
const tenantStore = new AsyncLocalStorage<TenantContext>();

// Middleware: extract tenant from JWT and propagate
function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.auth?.tenantId; // from JWT
  if (!tenantId) return res.status(403).json({ error: 'Tenant required' });

  const ctx: TenantContext = { tenantId, plan: req.auth.plan };
  tenantStore.run(ctx, () => {
    // Set PostgreSQL session variable for RLS
    req.db.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    next();
  });
}

// Anywhere in the stack:
export function getCurrentTenant(): TenantContext {
  const ctx = tenantStore.getStore();
  if (!ctx) throw new Error('No tenant context — called outside request?');
  return ctx;
}
```

### Isolation Model Decision Matrix

```
                    Shared DB + RLS    Schema/Tenant    DB/Tenant
Cost per tenant     Lowest             Medium           Highest
Data isolation      Row-level          Schema-level     Full
Compliance          Moderate           Good             Best
Migration effort    Single migration   Per-schema       Per-database
Max tenants         10,000+            1,000            100
Cross-tenant query  Easy               Possible         Hard
Noisy neighbor      Risk (mitigate)    Moderate         None
```

## Anti-Patterns

1. **Application-only isolation** — relying on WHERE clauses without RLS means a single bug leaks data across tenants
2. **Tenant ID in URLs** — `/api/tenant-123/orders` lets users guess other tenant IDs; use JWT claims instead
3. **Global caches** — cache keys MUST include tenant ID; `cache:orders:123` is wrong, `cache:tenant-abc:orders:123` is right
4. **Shared connection limits** — one tenant running heavy queries starves others; enforce per-tenant connection/query limits
5. **Tenant-unaware logging** — every log line must include tenant ID for debugging and audit compliance

## Quality Checklist

- [ ] RLS enabled on ALL tenant-scoped tables (not just application-level filtering)
- [ ] Tenant context propagated via AsyncLocalStorage (not global state)
- [ ] Cache keys prefixed with tenant ID
- [ ] Per-tenant rate limits configured
- [ ] Tenant ID included in all structured log entries
- [ ] Cross-tenant data access impossible even with direct SQL
- [ ] Tenant onboarding automated (schema creation, seed data, billing)
- [ ] Data export/deletion per tenant for GDPR compliance
- [ ] Noisy neighbor monitoring: per-tenant query time and resource usage
- [ ] Integration tests verify RLS prevents cross-tenant access
