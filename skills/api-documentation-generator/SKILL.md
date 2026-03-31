---
license: Apache-2.0
name: api-documentation-generator
description: |
  Generates OpenAPI 3.0/3.1 specs, TypeScript client types, and curl examples from existing route handler code. Supports Express, Next.js API routes, Fastify, and Hono. Produces complete documentation including auth requirements, rate limits, error codes, and request/response examples. Activate on: 'generate API docs', 'OpenAPI from code', 'document endpoints', 'API reference', 'swagger generation', 'endpoint documentation'. NOT for: API design from scratch (use api-architect), deployment (use devops-automator), testing (use test-automation-expert).
category: Backend & Infrastructure
tags:
  - api
  - documentation
  - openapi
  - swagger
  - typescript
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: api-architect
    reason: Architect designs the API, this skill documents what was built
  - skill: openapi-spec-writer
    reason: Spec writer creates from scratch, this skill extracts from existing code
  - skill: typescript-advanced-patterns
    reason: Generating accurate TypeScript types from route handlers
---

# API Documentation Generator

Extracts API documentation from existing route handler code. Reads your source, infers schemas, and produces OpenAPI specs, TypeScript types, and runnable curl examples -- not from design intent but from actual implementation.

## Activation Triggers

**Activate on:** "generate API docs", "OpenAPI from code", "document endpoints", "API reference", "swagger generation", "endpoint documentation", "create API types", "curl examples for API"

**NOT for:** API design from scratch --> `api-architect` | OpenAPI authoring without source code --> `openapi-spec-writer` | API testing --> `test-automation-expert`

## Core Capabilities

- Extract route definitions from Express, Next.js App Router, Next.js Pages API routes, Fastify, and Hono handlers
- Infer request/response schemas from TypeScript types, Zod schemas, or runtime validation
- Generate OpenAPI 3.0/3.1 specifications with accurate path parameters, query strings, and request bodies
- Produce TypeScript type definitions matching the actual API contract
- Create curl examples for every endpoint with realistic sample data
- Document authentication requirements by tracing middleware chains
- Identify rate limiting configuration and document per-endpoint limits
- Catalog error responses by analyzing throw/return patterns in handlers
- Detect undocumented endpoints (routes that exist but have no JSDoc or schema)

## Framework Detection

Before generating anything, identify the framework. The extraction strategy differs significantly.

### Express / Express-like

```
Signals: app.get(), router.post(), express.Router()
Route source: app._router.stack or explicit router files
Middleware chain: app.use() order matters for auth detection
```

Look for route registration patterns:
- `router.get('/users/:id', authenticate, getUser)` -- middleware before handler means auth required
- `app.use('/api/v1', rateLimiter({ max: 100 }), apiRouter)` -- rate limiter applied to subtree

### Next.js App Router

```
Signals: route.ts files exporting GET, POST, PUT, DELETE, PATCH
Route source: File-system convention in app/api/
Middleware chain: middleware.ts at directory boundaries
```

Path parameters come from folder names: `app/api/users/[id]/route.ts` --> `/api/users/{id}`

### Next.js Pages API Routes

```
Signals: pages/api/**/*.ts with default export handler
Route source: File-system convention
Method routing: req.method switch inside handler
```

### Fastify

```
Signals: fastify.get(), fastify.route(), schema property on route options
Route source: Plugin registration with fastify.register()
Schema: Fastify routes often have JSON Schema already -- extract and convert
```

Fastify is the easiest framework to document because routes frequently declare their own schemas. Prioritize extracting existing `schema.body`, `schema.response`, and `schema.querystring` before inferring.

### Hono

```
Signals: app.get(), app.post(), Hono(), zValidator()
Route source: Method chaining on Hono instance
Validation: zod-based via zValidator middleware
```

Hono with `zValidator` gives you Zod schemas directly. Convert Zod --> JSON Schema --> OpenAPI schema.

## Extraction Process

### Step 1: Discover Routes

Scan the project for route registration. Do not rely on a single entry point -- frameworks often split routes across files.

```bash
# Express: find router files
grep -rl "express.Router\|app.get\|app.post\|router\." src/ --include="*.ts" --include="*.js"

# Next.js App Router: find route handlers
find src/app/api -name "route.ts" -o -name "route.js"

# Next.js Pages: find API routes
find src/pages/api -name "*.ts" -o -name "*.js"

# Fastify: find route registrations
grep -rl "fastify\.\(get\|post\|put\|delete\|route\)" src/ --include="*.ts"

# Hono: find route definitions
grep -rl "app\.\(get\|post\|put\|delete\|patch\)" src/ --include="*.ts"
```

### Step 2: Extract Schemas

For each route, identify the request and response shapes.

**Priority order for schema sources:**
1. Explicit Zod/Joi/Yup validation schemas (highest confidence)
2. TypeScript type annotations on request/response
3. JSON Schema declarations (Fastify)
4. JSDoc @param / @returns annotations
5. Runtime inference from response construction (lowest confidence -- flag as approximate)

When using runtime inference (option 5), always mark the schema with `x-inferred: true` in the OpenAPI output so consumers know it may be incomplete.

### Step 3: Trace Authentication

Walk the middleware chain for each route to determine auth requirements:

- **No auth middleware**: Mark as `security: []` (public)
- **Bearer token middleware**: Mark as `security: [{ bearerAuth: [] }]`
- **API key middleware**: Mark as `security: [{ apiKeyAuth: [] }]`
- **Session/cookie auth**: Mark as `security: [{ cookieAuth: [] }]`
- **Multiple auth options**: List all as alternatives in the security array

### Step 4: Catalog Errors

Read each handler and list every error response:

- `res.status(400).json(...)` or `throw new BadRequestError(...)` --> 400 response schema
- `res.status(401)` --> 401 (include if auth middleware present even without explicit throw)
- `res.status(404)` --> 404
- `res.status(409)` --> 409 (conflict, common in create operations)
- `res.status(422)` --> 422 (validation failure)
- `res.status(429)` --> 429 (rate limited, include if rate limiter middleware detected)
- `res.status(500)` --> 500 (always include as possibility)

### Step 5: Generate Outputs

Produce three artifacts:

1. **OpenAPI spec** (YAML, not JSON -- more readable, easier to diff)
2. **TypeScript types** (standalone `.d.ts` file with all request/response types)
3. **curl examples** (one per endpoint, with headers and sample payloads)

## Decision Points

### When the codebase has NO validation schemas

If handlers accept raw `req.body` without Zod/Joi validation, you must infer types from usage. Look for:
- Property access patterns: `req.body.name`, `req.body.email` --> `{ name: string, email: string }`
- Destructuring: `const { name, email } = req.body` --> same inference
- Database insert calls: `db.users.create({ name: body.name })` --> cross-reference DB schema if available

Flag the entire spec with a warning: `x-schemas-inferred: true` at the info level.

### When routes use dynamic path segments

- Express: `:id` --> OpenAPI `{id}`
- Next.js: `[id]` --> OpenAPI `{id}`
- Next.js catch-all: `[...slug]` --> OpenAPI `{slug}` with note about array behavior
- Fastify: `:id` --> OpenAPI `{id}`
- Hono: `:id` --> OpenAPI `{id}`

### When response shape varies by status code

Document each status code with its own schema. Do not merge 200 and 201 into one schema if they differ. Common pattern:

```yaml
responses:
  '200':
    description: User found
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
  '404':
    description: User not found
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
```

### When rate limits differ per endpoint

Document rate limits using OpenAPI extensions:

```yaml
x-rate-limit:
  requests: 100
  window: 60s
  scope: per-api-key
```

If the rate limiter is global (applied once at the app level), document it at the top-level `info` section. If per-route, document on each operation.

## TypeScript Type Generation

Generate types that match the OpenAPI spec exactly. Use branded types for IDs when the codebase uses them.

```typescript
// Generated from OpenAPI spec -- do not edit manually

export interface CreateUserRequest {
  name: string;
  email: string;
  role?: 'admin' | 'member' | 'viewer';
}

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string; // ISO 8601
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      issue: string;
    }>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    hasMore: boolean;
  };
}
```

## Curl Example Generation

Generate one curl per endpoint. Use realistic but obviously fake data.

```bash
# GET /api/users/:id -- Fetch a single user
curl -X GET https://api.example.com/api/users/usr_abc123 \
  -H "Authorization: Bearer sk_test_..." \
  -H "Accept: application/json"

# POST /api/users -- Create a new user
curl -X POST https://api.example.com/api/users \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "member"
  }'

# GET /api/users -- List users with pagination
curl -X GET "https://api.example.com/api/users?page=1&perPage=20&role=admin" \
  -H "Authorization: Bearer sk_test_..." \
  -H "Accept: application/json"
```

Rules for curl examples:
- Always include the full URL (use `https://api.example.com` as base)
- Include all required headers
- Use `-d` with formatted JSON for request bodies
- Quote URLs that contain query parameters
- Show the HTTP method explicitly even for GET
- Use `sk_test_...` for auth tokens (obviously fake)
- Use realistic field values, not "string" or "test"

## Anti-Patterns

### 1. Documenting Aspirational APIs

**Symptom**: Spec describes endpoints that do not exist in code yet
**Fix**: Only document what the code actually implements. If a planned endpoint is in comments or a spec file but not in handlers, exclude it.

### 2. Ignoring Middleware Side Effects

**Symptom**: Docs say endpoint is public when it actually requires auth through a parent middleware
**Fix**: Trace the full middleware chain from app root to handler. A `router.use(auth)` above the route definition means all routes below require auth.

### 3. Assuming Request Body Shape

**Symptom**: Documenting `req.body` as `any` or `object` because there is no validation
**Fix**: Infer from usage (property access, destructuring, database calls). Mark as `x-inferred: true`. Recommend adding Zod validation.

### 4. Flat Error Documentation

**Symptom**: Every endpoint lists the same generic "400 Bad Request" without details
**Fix**: Read each handler's error paths. Document the specific error codes and messages returned. Different validation failures should show different example responses.

### 5. Stale Generated Docs

**Symptom**: Spec was generated once and never updated as code changed
**Fix**: Generate into a well-known path (`docs/openapi.yaml`). Add a CI check that regenerates and diffs against committed spec. If they diverge, fail the build.

### 6. Missing Pagination Documentation

**Symptom**: List endpoints documented without query parameter schemas for pagination
**Fix**: If the handler supports `page`, `limit`, `cursor`, `offset`, or similar parameters, document them with defaults and max values.

### 7. Undocumented File Uploads

**Symptom**: Multipart/form-data endpoints documented as JSON
**Fix**: Detect `multer`, `formidable`, `busboy`, or framework-native file handling. Use `multipart/form-data` content type with proper binary schema.

## Quality Checklist

```
[ ] Every route handler in the codebase has a corresponding OpenAPI operation
[ ] Path parameters match between code and spec (no :id vs {userId} mismatches)
[ ] Request body schemas cover all required and optional fields
[ ] Response schemas match actual JSON structure (verified by reading handler return)
[ ] Authentication requirements match middleware chain analysis
[ ] Rate limit information documented where rate limiting middleware exists
[ ] Error responses cataloged from actual throw/return statements in handlers
[ ] Curl examples execute successfully against a running instance
[ ] TypeScript types compile without errors
[ ] No x-inferred schemas left undocumented (each flagged one has a TODO for proper validation)
[ ] Pagination parameters documented with defaults and maximums
[ ] File upload endpoints use multipart/form-data content type
[ ] OpenAPI spec validates with spectral or swagger-cli lint
[ ] Generated spec committed to a known path for CI diffing
```

## Output Artifacts

1. **`docs/openapi.yaml`** -- Complete OpenAPI 3.0/3.1 specification
2. **`docs/api-types.d.ts`** -- TypeScript type definitions for all request/response shapes
3. **`docs/api-examples.sh`** -- Runnable curl examples for every endpoint
4. **`docs/api-coverage.md`** -- Report listing documented vs undocumented routes

## Validation

```bash
# Lint the generated OpenAPI spec
npx @stoplight/spectral-cli lint docs/openapi.yaml

# Validate spec structure
npx swagger-cli validate docs/openapi.yaml

# Generate TypeScript client to verify types compile
npx openapi-typescript docs/openapi.yaml -o /tmp/api-check.d.ts
tsc --noEmit /tmp/api-check.d.ts

# Diff against last committed spec (CI check)
diff <(cat docs/openapi.yaml) <(npx tsx scripts/generate-api-docs.ts --stdout) && echo "Spec is current" || echo "Spec is stale"
```

---

**Covers**: OpenAPI generation | TypeScript type extraction | Curl example creation | Auth documentation | Rate limit documentation | Error code cataloging

**Use with**: api-architect (design first, document after) | openapi-spec-writer (manual authoring) | test-automation-expert (contract testing against generated spec)
