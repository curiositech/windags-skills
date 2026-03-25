---
license: Apache-2.0
name: openapi-spec-writer
version: 1.0.0
category: Backend & Infrastructure
tags:
  - openapi
  - swagger
  - api-specification
  - documentation
  - rest
---

# OpenAPI Spec Writer

Expert in writing OpenAPI 3.0/3.1 specifications. Produces specs that serve as enforceable contracts, not just documentation. Operates API-first: the spec is written and validated before any implementation code.

## Decision Points

Navigate these decision trees for every new spec:

### OpenAPI Version Selection
```
Is this a greenfield API?
├─ YES → Use OpenAPI 3.1 (JSON Schema 2020-12, better examples)
└─ NO → Are you using existing tooling?
   ├─ Codegen (Swagger, OpenAPI Generator) → Use 3.0.3 (better tool support)
   └─ Documentation only → Use 3.1 (richer schema features)
```

### Authentication Strategy
```
Who consumes this API?
├─ Public developers → API key in header (simple, cacheable)
├─ Browser apps → OAuth2 authorization_code + PKCE
├─ Mobile apps → OAuth2 authorization_code + PKCE  
├─ Service-to-service → OAuth2 client_credentials
└─ Internal only → Bearer token or mTLS
```

### Field Nullability Pattern
```
Can this field be missing vs explicitly null?
├─ Both missing and null allowed → Don't list in `required`, type: [string, "null"]
├─ Missing OK, null forbidden → Don't list in `required`, type: string
├─ Required but nullable → List in `required`, type: [string, "null"]  
└─ Required and non-null → List in `required`, type: string
```

### Schema Composition Strategy
```
Do schemas share 80%+ fields?
├─ YES → Use inheritance
│   ├─ Discriminated unions → `allOf` + `discriminator`
│   └─ Simple extension → `allOf` with base schema
└─ NO → Are there 2-3 common fields?
    ├─ YES → Extract common fields to separate schema, compose with `allOf`
    └─ NO → Keep schemas separate, inline if single-use
```

### Pagination Choice
```
What's the max expected dataset size?
├─ < 100 items → No pagination (return array directly)
├─ 100-10K items → Offset/limit (page + size params)
└─ > 10K items → Cursor-based (stable under concurrent writes)
```

## Failure Modes

### Circular Reference Hell
**Symptom**: Swagger UI shows infinite loading, codegen crashes with stack overflow
**Detection**: If `spectral lint` reports "Circular reference" or tools hang on schema processing
**Fix**: Break cycles at collection boundaries. Parent-child relationships should reference child by ID only in parent, full object only in child → parent direction

### Schema Bloat Explosion  
**Symptom**: 50+ schemas in components, most used exactly once, spec file exceeds 2000 lines for basic CRUD
**Detection**: If >70% of schemas in `components/schemas` have only 1 `$ref` usage
**Fix**: Inline single-use schemas. Extract to components only when 2+ operations share the exact same structure

### Ambiguous Union Types
**Symptom**: `oneOf` without discriminator generates useless union types in codegen, runtime type checking fails
**Detection**: If you have `oneOf`/`anyOf` without `discriminator` property
**Fix**: Always add discriminator with explicit mapping. Discriminator field must be `required` in all variants:
```yaml
discriminator:
  propertyName: type
  mapping:
    email: '#/components/schemas/EmailNotification'
    sms: '#/components/schemas/SmsNotification'
```

### Missing Error Documentation
**Symptom**: Client developers guess error format, inconsistent error handling across teams
**Detection**: If operations only document 200/201 responses, no 4xx/5xx schemas
**Fix**: Document standard error responses (400, 401, 403, 404, 422, 500) with consistent schema including `code`, `message`, and `details` fields

### Inconsistent Naming Chaos
**Symptom**: `/users/{userId}` vs `/posts/{post_id}`, codegen produces mixed camelCase/snake_case
**Detection**: If path parameters, query parameters, or schema properties use multiple casing conventions
**Fix**: Pick one convention (camelCase for JSON APIs), enforce with Spectral rules, document in spec description

## Worked Examples

### Building User Management API from Scratch

**Context**: Need CRUD API for user accounts in SaaS application

**Step 1: Apply Decision Trees**
- Version: OpenAPI 3.0.3 (using existing codegen pipeline)  
- Auth: OAuth2 + PKCE (browser-based app)
- Pagination: Cursor-based (user base will scale beyond 10K)
- Naming: camelCase throughout (JavaScript client primary consumer)

**Step 2: Define Core Resource Schema**
```yaml
components:
  schemas:
    User:
      type: object
      required: [id, email, createdAt]
      properties:
        id: {type: string, format: uuid, readOnly: true}
        email: {type: string, format: email}
        displayName: {type: string, maxLength: 100}
        role: {type: string, enum: [member, admin], default: member}
        createdAt: {type: string, format: date-time, readOnly: true}
```
**Decision**: Extract to components because GET, POST, and PATCH all return this exact structure

**Step 3: Handle Create Request**
```yaml
paths:
  /v1/users:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [email]
              properties:
                email: {type: string, format: email}
                displayName: {type: string, maxLength: 100}
                role: {type: string, enum: [member, admin]}
```
**Decision**: Inline create schema (single use) vs User schema (multi-use)

**Expert vs Novice**: Novice would extract CreateUserRequest to components. Expert inlines because it's used only once, avoiding schema bloat.

## Quality Gates

Spec is production-ready when all conditions pass:

- [ ] Every endpoint documents both success AND error responses (400, 401, 403, 404, 422, 500 minimum)
- [ ] All shared types extracted to `components/schemas`, all single-use schemas inlined
- [ ] Every `oneOf`/`anyOf` has explicit `discriminator` with property mapping
- [ ] No circular `$ref` chains (passes `spectral lint` without errors)
- [ ] Consistent naming convention across paths, parameters, and schema properties
- [ ] Every schema includes realistic `example` with actual data values
- [ ] All operations have unique `operationId` suitable for code generation
- [ ] Security scheme defined and applied consistently across operations  
- [ ] Required vs optional fields explicitly documented for all input schemas
- [ ] Pagination strategy consistent across all collection endpoints

## NOT-FOR Boundaries

**Don't use this skill for:**
- GraphQL schema design → Use `graphql-schema-architect` instead
- Message queue/event schemas → Use `event-schema-design` instead  
- Database schema design → Use `database-architect` instead
- API implementation → Use `rest-api-implementation` instead

**Delegate when:**
- Client needs specific SDK → Use `api-client-generator` after spec completion
- API security hardening → Use `api-security-specialist` for implementation details
- Performance optimization → Use `api-performance-optimizer` for implementation tuning
- API gateway configuration → Use `api-gateway-configurator` for deployment