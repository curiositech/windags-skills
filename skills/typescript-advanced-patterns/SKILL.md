---
license: Apache-2.0
name: typescript-advanced-patterns
description: 'Advanced TypeScript type system patterns for production codebases. [What: branded types for nominal typing, discriminated unions, template literal types, conditional types, the infer keyword, satisfies operator, const assertions, Zod schema inference, type-safe event emitters, exhaustive switch checking] [When: designing domain models, building type-safe APIs, creating reusable generic utilities, eliminating runtime bugs with compile-time guarantees, refactoring any-typed codebases] [Keywords: branded types, discriminated union, template literal types, conditional types, infer, satisfies, const assertion, Zod inference, exhaustive, mapped types, utility types, nominal typing, type narrowing, generic constraints] NOT for basic TypeScript syntax or React component typing (use a React-specific skill).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,tsc:*)
argument-hint: '[problem type: nominal-typing|discriminated-union|type-safe-events|zod-inference|conditional-types]'
metadata:
  category: Code Quality & Testing
  pairs-with:
    - skill: api-architect
      reason: Type-safe API contracts with Zod
    - skill: vitest-testing-patterns
      reason: Type-level testing with expect-type
    - skill: react-performance-optimizer
      reason: Type-safe React patterns
  tags:
    - typescript
    - type-system
    - branded-types
    - generics
    - zod
category: Code Quality & Testing
tags:
  - typescript
  - advanced-patterns
  - generics
  - type-system
  - best-practices
---

# TypeScript Advanced Patterns

Advanced type system patterns that eliminate runtime bugs by encoding constraints at compile time.

## DECISION POINTS

### Problem → Pattern Selection Tree

```
1. Are you mixing values of the same primitive type?
   ├─ YES: ID confusion (UserId vs OrderId) → Use Branded Types
   ├─ YES: Money confusion (USD vs EUR, dollars vs cents) → Use Branded Types with validation
   └─ NO: Continue to #2

2. Do you have a value that can be one of N different shapes?
   ├─ YES: API responses (success/error/loading) → Use Discriminated Unions
   ├─ YES: State machine states → Use Discriminated Unions with exhaustive checking
   └─ NO: Continue to #3

3. Are you parsing external data (APIs, user input)?
   ├─ YES: Unknown JSON shape → Use Zod schema + z.infer<typeof Schema>
   ├─ YES: Form validation → Use Zod with branded types for validated inputs
   └─ NO: Continue to #4

4. Do you need types that compute based on other types?
   ├─ YES: Extract function parameters → Use conditional types with infer
   ├─ YES: Transform object shapes → Use mapped types with template literals
   └─ NO: Continue to #5

5. Are you validating without losing specific type info?
   ├─ YES: Config objects with optional fields → Use satisfies operator
   ├─ YES: Const arrays that need narrow types → Use const assertions
   └─ NO: Review if advanced patterns are needed
```

### Implementation Strategy Decision

```
IF (primitive mixing bugs possible)
  → Start with branded types for domain IDs
  → Add Zod constructors for validation

IF (multiple related states)
  → Define discriminated union with 'kind'/'type'/'status' field
  → Add exhaustive switch with assertNever default

IF (external data + type safety needed)
  → Define Zod schema first
  → Export type as z.infer<typeof Schema>
  → Never manually write types for external data

IF (generic utilities needed)
  → Use conditional types with infer for extraction
  → Add constraints to prevent misuse
  → Test with expect-type for complex utilities
```

## FAILURE MODES

### 1. Over-Branding Primitives
**Symptom**: Every string and number in codebase is branded
**Detection**: If you see `Brand<string, 'FirstName'>` and `Brand<string, 'LastName'>` that are never mixed up
**Root Cause**: Treating branding as general "make types stricter" instead of "prevent specific mixing bugs"
**Fix**: Only brand when there's actual confusion risk (IDs, money, different units)

### 2. Schema Bloat Anti-Pattern
**Symptom**: Zod schemas with 50+ fields, nested 5+ levels deep
**Detection**: Schema definitions longer than the components that use them
**Root Cause**: Trying to validate entire API response instead of just the fields you use
**Fix**: Parse only what you need - `z.object({ id: z.string(), status: z.enum(['active', 'inactive']) })` instead of full user object

### 3. Type Assertion Abuse
**Symptom**: Multiple `as Type` casts or `as any` to make TypeScript "stop complaining"
**Detection**: More than 2 type assertions in a single function
**Root Cause**: Fighting the type system instead of designing types that match data flow
**Fix**: Use type guards, Zod parsing, or unknown with proper narrowing

### 4. Discriminant Field Inconsistency
**Symptom**: Union types work in some places but not others, "Property does not exist" errors
**Detection**: TypeScript can't narrow the union in switch statements
**Root Cause**: Discriminant field missing or inconsistent across union members
**Fix**: Every union member must have same discriminant field with literal type

### 5. Incorrect Union Discriminants
**Symptom**: TypeScript allows invalid state combinations like `{ status: 'success', error: string }`
**Detection**: Properties from wrong union branch are accessible
**Root Cause**: Discriminant field values overlap or missing literal types
**Fix**: Use non-overlapping literal types in discriminant field, validate each branch is exclusive

## WORKED EXAMPLES

### Example 1: Refactoring any-typed API Response to Discriminated Union

**Starting Point**: Legacy API client with any types
```typescript
// Before: any everywhere, runtime errors common
async function fetchUser(id: string): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // any
}

// Usage leads to runtime errors
const userData = await fetchUser('123');
console.log(userData.user.profile.name); // Works sometimes, crashes others
```

**Step 1: Analyze actual API responses** (what novice skips)
```typescript
// Expert examines actual responses first:
// Success: { status: 'success', user: { id: string, name: string } }
// Not found: { status: 'error', code: 404, message: 'User not found' }
// Server error: { status: 'error', code: 500, message: 'Internal error' }
```

**Step 2: Define discriminated union** (novice would create separate types)
```typescript
type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; code: number; message: string };

type User = {
  id: string;
  name: string;
  email: string;
};
```

**Step 3: Create Zod schema** (expert validates at runtime boundary)
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.discriminatedUnion('status', [
    z.object({
      status: z.literal('success'),
      data: dataSchema,
    }),
    z.object({
      status: z.literal('error'),
      code: z.number(),
      message: z.string(),
    }),
  ]);

type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema>>;
```

**Step 4: Type-safe client** (novice forgets error handling)
```typescript
async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  const rawData: unknown = await response.json();
  
  // Parse with Zod - throws on invalid shape
  return ApiResponseSchema(UserSchema).parse(rawData);
}

// Usage forces error handling
const userResult = await fetchUser('123');
switch (userResult.status) {
  case 'success':
    console.log(userResult.data.name); // TypeScript knows data exists
    break;
  case 'error':
    console.error(`Error ${userResult.code}: ${userResult.message}`);
    break;
}
```

**Trade-offs expert considers** (novice misses):
- Runtime cost: Zod validation adds ~5ms per parse
- Bundle size: Zod adds ~14KB gzipped
- Developer experience: Immediate errors vs silent runtime failures
- Maintenance: Schema evolution vs type drift

## QUALITY GATES

- [ ] All primitive domain values that could be mixed are branded (UserId ≠ OrderId)
- [ ] No bare `any` types - use `unknown` at boundaries with proper narrowing
- [ ] External data parsed through Zod schemas, never assumed to match types
- [ ] Union types use discriminated unions with exhaustive switch checking
- [ ] Type assertions (`as Type`) used only for proven safe narrows, never `as any`
- [ ] Conditional types include TSDoc comment explaining their purpose
- [ ] Complex utility types have expect-type tests verifying behavior
- [ ] satisfies operator used for config objects instead of widening type annotations
- [ ] Generic constraints are as specific as needed (`T extends object` not `T extends any`)
- [ ] All branded type constructors include validation logic

## NOT-FOR Boundaries

**Don't use for:**
- Basic type annotations (`string`, `number[]`, `{ name: string }`)
- React component prop typing → Use `react-component-patterns` skill instead
- Node.js API client typing → Use `api-architect` skill for OpenAPI generation
- Database query typing → Use ORM-specific skills (Prisma, Drizzle)
- GraphQL schema typing → Use `graphql-typescript` skill for codegen

**Delegate to other skills when:**
- Building REST APIs → Use `api-architect` for contract-first design
- Testing type-level behavior → Use `vitest-testing-patterns` for expect-type tests
- Performance optimization → Use `react-performance-optimizer` for memo patterns
- Error boundary patterns → Use `error-handling-strategies` for Result types