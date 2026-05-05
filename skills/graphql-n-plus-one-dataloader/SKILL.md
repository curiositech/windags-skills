---
name: graphql-n-plus-one-dataloader
description: Diagnose and eliminate the GraphQL N+1 resolver explosion using Facebook DataLoader's per-request batching, plus the second-order defenses (persisted queries, depth limits, cost analysis). Use when a GraphQL query that returns N items in a list triggers N+1 database round trips, when designing nested resolvers that load associations, when a list query times out under load, or when you need to budget query cost before resolvers run. NOT for REST-style endpoint design (use api-versioning-strategy), generic database query optimization (use database-query-optimizer), or schema design (use graphql-server-architect).
allowed-tools: Read,Write,Edit,Grep,Glob,Bash(node:*,npm:*,npx:*)
category: Backend & Databases
tags:
  - graphql
  - dataloader
  - n-plus-one
  - performance
  - batching
  - persisted-queries
  - cost-analysis
metadata:
  category: Backend & Databases
  pairs-with:
    - skill: graphql-server-architect
      reason: Schema design decisions create or eliminate N+1 patterns at design time
    - skill: postgres-connection-pooling
      reason: DataLoader collapses 1+N → 2 round trips; pooling collapses connection setup cost
---

# GraphQL N+1 / DataLoader Pattern

The signature performance pathology of GraphQL: a query returning N items in a list, each resolving a nested association field, fires **1 query for the list + N queries for the children = N+1 round trips**. Facebook's `dataloader` library is the canonical fix — it coalesces all `.load(key)` calls within a single tick of the event loop into a single `batchLoadFn(keys)` call, collapsing **1+N → at most 2** round trips per request, regardless of nesting depth.

## When to use this skill

```mermaid
flowchart TD
  A[Query returns list with nested field] --> B{Nested field hits a datastore?}
  B -->|No| Z[No N+1 risk]
  B -->|Yes| C{Resolver loads parent-by-parent?}
  C -->|Yes| D[N+1 problem confirmed]
  C -->|No - already batched| E[Already fixed]
  D --> F{Same key across resolvers?}
  F -->|Yes| G[Wrap with DataLoader<br/>per-request instance]
  F -->|No - unique key per call| H[Refactor to batchable<br/>SELECT ... WHERE id IN (...)]
  G --> I{Total cost still high?}
  I -->|Yes| J[Add cost analysis<br/>+ depth limit + APQ]
  I -->|No| K[Ship + monitor]
  H --> G
```

## The N+1 Math

Given:

```graphql
query {
  authors {              # 1 query: SELECT * FROM authors
    name
    address {            # N queries: SELECT * FROM addresses WHERE author_id = ?
      country
    }
  }
}
```

Without DataLoader: **1 + N round trips** (50 authors → 51 queries).
With DataLoader: **2 round trips, always** (1 for authors, 1 batched `WHERE id IN (...)` for addresses).

Shopify's exact framing: *"if there were fifty authors, then it would make fifty-one round trips for all the data. It should be able to fetch all the addresses together in a single round trip, so only two round trips to datastores in total, regardless of the number of authors."* ([Shopify Engineering, 2018](https://shopify.engineering/solving-the-n-1-problem-for-graphql-through-batching))

Why GraphQL makes it worse than REST: *"In REST, costs are predictable because there's one trip per endpoint requested. In GraphQL, there's only one endpoint, and it's not indicative of the potential size of incoming requests."*

## DataLoader API — the load-bearing rules

### Constructor

```js
new DataLoader(batchLoadFn [, options])
```

> "A batch loading function accepts an Array of keys, and returns a Promise which resolves to an Array of values or Error instances." ([graphql/dataloader README](https://github.com/graphql/dataloader))

### The contract that breaks everything if violated

> "The Array of values must be the same length as the Array of keys. Each index in the Array of values must correspond to the same index in the Array of keys."

If your backend returns rows in a different order than the keys came in (`SELECT * FROM users WHERE id IN (1, 2, 3)` does NOT guarantee row order), **you must reorder before resolving the Promise**. DataLoader matches by index, not by id.

```js
// BUG: rows might come back as [id=2, id=3, id=1]
const userLoader = new DataLoader(async (ids) => {
  return db.users.where({ id: ids });
});

// CORRECT: reorder by key
const userLoader = new DataLoader(async (ids) => {
  const rows = await db.users.where({ id: ids });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id) ?? new Error(`User ${id} not found`));
});
```

### Batching — the one tick rule

> "DataLoader will coalesce all individual loads which occur within a single frame of execution (a single tick of the event loop) and then call your batch function with all requested keys."

Every `.load()` in the same microtask flushes together. This works recursively — every wave of resolvers gets its own batch.

### Per-request, never global

> "DataLoader caching does not replace Redis, Memcache, or any other shared application-level cache. DataLoader is first and foremost a data loading mechanism, and its cache only serves the purpose of not repeatedly loading the same data in the context of a single request."
> "Avoid multiple requests from different users using the DataLoader instance, which could result in cached data incorrectly appearing in each request."

The cache is request-scoped memoization, not an application cache. Construct in your context factory:

```js
const server = new ApolloServer({
  schema,
  context: () => ({
    loaders: {
      user: new DataLoader(batchUsers),
      address: new DataLoader(batchAddresses),
    },
  }),
});

// In resolver:
Author: {
  address: (author, _, { loaders }) => loaders.address.load(author.id),
}
```

## Failure Modes (Anti-Patterns)

### Singleton DataLoader (cross-request cache poisoning)

- **Detection**: `const userLoader = new DataLoader(...)` declared at module scope, imported into resolvers.
- **Symptom**: User A logs in, fetches their profile. User B fetches the *same* user ID and gets the cached row from A's request — including any per-user data joined in. Cross-tenant data leak.
- **Novice**: "It's a cache, caches should be shared!"
- **Expert**: "DataLoader's cache is a request-scoped memoization. The shared cache is Redis. Construct one DataLoader per request in your context factory."
- **Timeline**: This anti-pattern detonated repeatedly in 2017–2018 as DataLoader adoption surged; the README explicitly added the per-request warning.
- **Fix**: Move loader construction into `context: () => ({ loaders: { ... } })`.

### Wrong-order batch returns

- **Detection**: `batchLoadFn` returns `db.users.where({ id: keys })` directly.
- **Symptom**: User 1 sees User 2's name. Tests pass when keys arrive sorted; production breaks when they don't. Issue is intermittent and tracks to which keys hash to which DB pages.
- **Novice**: Assumes `WHERE id IN (1,2,3)` returns rows in `(1,2,3)` order. SQL has no such guarantee.
- **Expert**: Always reorder by key. Always test with keys in shuffled order.
- **Timeline**: Pre-2020 most tutorials skipped this. Now `dataloader` README leads with it.
- **Fix**: Build `Map(rows.map((r) => [r.id, r]))` and `keys.map((k) => byId.get(k))`.

### Treating DataLoader as an application cache

- **Detection**: `userLoader.prime(id, user)` called with results from Redis; expectation that it persists across requests.
- **Symptom**: Stale data appears within a request because DataLoader's per-request cache shadows fresh Redis reads.
- **Novice**: "It has a cache, why not use it?"
- **Expert**: *"DataLoader is great for its intended use case, but it's less helpful when loading data from REST APIs. This is because its primary feature is batching, not caching."* ([Apollo docs](https://www.apollographql.com/docs/apollo-server/data/fetching-rest))
- **Fix**: Use Redis/Memcache for cross-request caching. DataLoader for batching only.

### Depth-limit-only defense

- **Detection**: `validationRules: [depthLimit(7)]`, no cost analysis.
- **Symptom**: Attacker sends `users(first: 10000) { posts(first: 10000) { ... } }` — depth 2, but cartesian explosion at the database. Server times out / OOMs.
- **Novice**: "Depth limit blocks deep queries, problem solved."
- **Expert**: Depth limit can't distinguish `users(first: 1)` from `users(first: 10000)` — both are depth 1. Cost analysis with multipliers handles list-arg explosion.
- **Timeline**: 2018-era tutorials stopped at depth limits. By 2021, GraphQL Armor / `graphql-cost-analysis` became standard.
- **Fix**: Layer depth limit (catches recursion bombs) + cost analysis with multipliers (catches breadth bombs).

### Forgetting the introspection escape hatch

- **Detection**: Production rejects all queries above depth 7, including GraphQL Playground / IDE introspection.
- **Symptom**: Tooling breaks; engineers can't explore the schema. Tickets pile up.
- **Fix**: `depthLimit(7, { ignore: ['__schema', '__type'] })` — introspection queries are deeper than your data queries.

## Worked Example — From 51 queries to 2

### Schema

```graphql
type Author { id: ID!  name: String!  address: Address }
type Address { id: ID!  country: String!  city: String! }
type Query { authors: [Author!]! }
```

### Naive resolvers (51 queries for 50 authors)

```js
const resolvers = {
  Query: {
    authors: () => db.authors.all(),                              // 1 query
  },
  Author: {
    address: (author) => db.addresses.findByAuthorId(author.id),  // N queries
  },
};
```

### Batched resolvers (2 queries for 50 authors)

```js
// batch function — same length, same order
async function batchAddressesByAuthorId(authorIds) {
  const rows = await db.addresses.where({ author_id: authorIds });
  const byAuthor = new Map(rows.map((r) => [r.author_id, r]));
  return authorIds.map((id) => byAuthor.get(id) ?? null);
}

// per-request context
const server = new ApolloServer({
  schema,
  context: () => ({
    loaders: { addressByAuthor: new DataLoader(batchAddressesByAuthorId) },
  }),
});

const resolvers = {
  Query: { authors: () => db.authors.all() },                     // 1 query
  Author: {
    address: (author, _, { loaders }) =>
      loaders.addressByAuthor.load(author.id),                    // batched: 1 query total
  },
};
```

**Result**: 50 author rows → still 2 round trips. 5,000 author rows → still 2 round trips. The collapse is constant in N.

### Validation

```js
// Trace queries fired during a single GraphQL request
db.on('query', (q) => process.stdout.write(`SQL: ${q}\n`));

await graphql({
  schema, source: `query { authors { name address { country } } }`,
});
// Expect: exactly 2 lines printed.
```

## Second-order defenses

DataLoader fixes round-trip count. These fix payload size, abuse, and CDN cacheability:

### Automatic Persisted Queries (APQ)

> "As query strings become larger, increased latency and network usage can noticeably degrade client performance. A persisted query is a query string that's cached on the server side, along with its unique identifier (always its SHA-256 hash). Clients can send this identifier instead of the corresponding query string, thus reducing request sizes dramatically." ([Apollo APQ docs](https://www.apollographql.com/docs/apollo-server/performance/apq))

Three-step protocol:

1. Client sends hash only: `extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4..."}}`.
2. If unknown, server returns `PERSISTED_QUERY_NOT_FOUND`. Client retries with both query string AND hash. Server stores mapping.
3. Subsequent requests: hash alone resolves to the cached query string.

CDN bonus: hashed queries can be GET requests; mutations stay POST. Configure with `createPersistedQueryLink({ sha256, useGETForHashedQueries: true })`.

### Depth limiting (cheap, parse-time defense)

```js
import depthLimit from 'graphql-depth-limit';
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],   // reject queries with depth > 7
});
```

Validation runs **before execution** — abusive queries die at parse-time, not after the database is hammered.

> Note: the original `stems/graphql-depth-limit` repo is gone (404). The npm package still installs but is unmaintained. Modern replacements: [`@graphile/depth-limit`](https://github.com/graphile/depth-limit) (adds `maxListDepth`, `maxSelfReferentialDepth`), `@envelop/depth-limit`, [GraphQL Armor `MaxDepth`](https://escape.tech/graphql-armor/docs/plugins/max-depth/).

### Cost analysis (the breadth defense)

```graphql
type Query {
  posts(first: Int): [Post]
    @cost(multipliers: ["first"], useMultipliers: true, complexity: 2)
}
```

> "If the parameter is an array, its multiplier value will be the length of the array." ([graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis))

`posts(first: 100)` → cost = `100 × 2 = 200`. `maximumCost: 1000` rejects anything past 5 such fields.

Why cost > depth: depth-1 is not safety. `users(first: 10000)` is depth 1.

## Quality Gates

- [ ] Every resolver that hits a datastore uses a DataLoader instance OR documents why not (e.g., field is the root, no nesting beneath it)
- [ ] DataLoader instances are constructed in the request context factory, never at module scope
- [ ] Every `batchLoadFn` returns an array `keys.length` long, in `keys` order, with `null` or `Error` for missing keys
- [ ] Test asserts `db` query log emits exactly 2 lines for a list-of-N query (not 1+N)
- [ ] Validation rules include both depth limit AND cost analysis (depth alone is insufficient)
- [ ] APQ enabled if clients are external/mobile and bandwidth matters
- [ ] Introspection queries (`__schema`, `__type`) are exempted from depth limits
- [ ] Production query log monitored for queries that took >2 round trips per list field — flags missing DataLoader

## NOT-FOR Boundaries

This skill should NOT be used for:

- **REST endpoint design** → use `api-versioning-strategy`
- **Generic database query optimization** (indexes, query plans) → use a `database-query-optimizer` or `postgres-performance` skill
- **GraphQL schema design** (types, federation, unions) → use `graphql-server-architect`
- **Subscription performance** (over WebSocket/SSE) → use `server-sent-events-vs-websockets`
- **Application-level caching** (Redis, Memcache) → use a dedicated caching skill — DataLoader is **batching**, not caching

## Sources

1. [graphql/dataloader](https://github.com/graphql/dataloader) — Facebook's canonical README, API reference, batching contract
2. [Shopify Engineering: Solving the N+1 problem for GraphQL through batching](https://shopify.engineering/solving-the-n-1-problem-for-graphql-through-batching) — Thacker-Smith et al., 2018; the canonical postmortem
3. [Apollo: Automatic Persisted Queries](https://www.apollographql.com/docs/apollo-server/performance/apq) — APQ protocol, hash format, GET cacheability
4. [Apollo: Fetching from REST APIs](https://www.apollographql.com/docs/apollo-server/data/fetching-rest) — RESTDataSource pattern; covers N+1 + DataLoader integration boundary
5. [pa-bru/graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis) — `@cost` directive, multipliers, max cost enforcement
6. [graphile/depth-limit](https://github.com/graphile/depth-limit) — modern depth limiter (the original `stems/graphql-depth-limit` is gone)
7. [GraphQL Armor: MaxDepth](https://escape.tech/graphql-armor/docs/plugins/max-depth/) — alternative defense plugin with `maxListDepth`
8. [Shopify Engineering: Faster, breadth-first GraphQL execution](https://shopify.engineering/faster-breadth-first-graphql-execution) — 2026 follow-up; DataLoader's GC cost and the breadth-first response (4s P50 win)
