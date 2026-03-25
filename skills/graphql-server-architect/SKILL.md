---
license: Apache-2.0
name: graphql-server-architect
description: "DataLoader, subscriptions, federation, and schema stitching for GraphQL APIs. Activate on: GraphQL, DataLoader, subscription, federation, schema stitching, resolver, SDL, Apollo, Yoga. NOT for: REST API design (use api-architect), frontend GraphQL clients (use relevant frontend skill)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Backend & Infrastructure
tags:
  - graphql
  - federation
  - dataloader
  - subscriptions
  - schema
pairs-with:
  - skill: cache-strategy-invalidation-expert
    reason: Query-level and resolver-level caching for GraphQL
  - skill: observability-apm-expert
    reason: Per-resolver tracing and query complexity monitoring
  - skill: api-rate-limiting-throttling-expert
    reason: Query cost analysis prevents expensive queries
---

# GraphQL Server Architect

Design production-grade GraphQL APIs with efficient data loading, real-time subscriptions, and federated schema architecture.

## Activation Triggers

**Activate on:** "GraphQL", "DataLoader", "subscription", "federation", "schema stitching", "resolver", "SDL", "Apollo Server", "GraphQL Yoga", "Pothos", "query complexity"

**NOT for:** REST API design → `api-architect` | Frontend GraphQL client → relevant frontend skill | Database queries → `data-warehouse-optimizer`

## Quick Start

1. **Choose framework** — GraphQL Yoga 5.x (lightweight), Apollo Server 4.x (ecosystem), Mercurius (Fastify)
2. **Schema-first or code-first** — SDL for team collaboration, Pothos/Nexus for type-safe code-first
3. **Implement DataLoader** — batch and cache per-request to solve N+1 queries
4. **Set query complexity limits** — prevent clients from requesting arbitrarily deep/wide queries
5. **Add persisted queries** — lock down production to known queries, improve CDN caching

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Servers** | GraphQL Yoga 5.x, Apollo Server 4.x, Mercurius 14+ |
| **Schema** | Pothos (code-first), SDL (schema-first), GraphQL Codegen |
| **Federation** | Apollo Federation 2.8+, GraphQL Mesh, Schema Stitching |
| **Performance** | DataLoader, @defer/@stream, persisted queries, query complexity |
| **Real-Time** | GraphQL Subscriptions (WebSocket), graphql-ws, SSE transport |

## Architecture Patterns

### DataLoader Pattern (N+1 Prevention)

```typescript
import DataLoader from 'dataloader';

// Create per-request DataLoader
function createLoaders() {
  return {
    userById: new DataLoader<string, User>(async (ids) => {
      // Single batch query instead of N queries
      const users = await db.query('SELECT * FROM users WHERE id = ANY($1)', [ids]);
      const map = new Map(users.map(u => [u.id, u]));
      return ids.map(id => map.get(id) ?? new Error(`User ${id} not found`));
    }),
  };
}

// Resolver uses loader — automatically batched
const resolvers = {
  Post: {
    author: (post, _, { loaders }) => loaders.userById.load(post.authorId),
  },
};
```

### Apollo Federation 2 (Supergraph)

```
Clients
   ↓
Apollo Router (supergraph)
   ├─→ Users Subgraph     (owns User type)
   ├─→ Orders Subgraph    (extends User with orders)
   └─→ Products Subgraph  (owns Product type)

Each subgraph is an independent GraphQL service.
Router composes query plans across subgraphs.
```

```graphql
# Users subgraph
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}

# Orders subgraph — extends User from Users subgraph
type User @key(fields: "id") {
  id: ID!
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: OrderStatus!
}
```

### Query Complexity Limiting

```typescript
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const complexityLimit = createComplexityLimitRule(1000, {
  scalarCost: 1,
  objectCost: 10,
  listFactor: 20,
  onCost: (cost) => {
    if (cost > 800) logger.warn(`High complexity query: ${cost}`);
  },
});

const server = createYoga({
  schema,
  validationRules: [complexityLimit],
});
```

## Anti-Patterns

1. **No DataLoader** — resolvers that query the DB individually create N+1 problems; always batch with DataLoader
2. **Unbounded queries** — without depth/complexity limits, a single query can join your entire graph and crash the server
3. **Exposing internal IDs** — use opaque Relay-style global IDs, not raw database primary keys
4. **Fat resolvers** — resolvers should delegate to service/repository layers, not contain business logic
5. **Subscription over-fetching** — do not broadcast full objects; send minimal change payloads and let clients re-query

## Quality Checklist

- [ ] DataLoader used for all relationship resolvers (no N+1)
- [ ] Query depth limit set (max 10-15 levels)
- [ ] Query complexity limit enforced (reject expensive queries)
- [ ] Persisted queries enabled in production (no arbitrary queries from clients)
- [ ] Schema published to registry with breaking change detection
- [ ] Resolver-level tracing enabled (Apollo Studio, OpenTelemetry)
- [ ] Error masking: internal errors never leak to clients in production
- [ ] Pagination uses Relay cursor-based spec (not offset)
- [ ] Input validation on all mutation arguments
- [ ] Subscription authentication verified on connection init
