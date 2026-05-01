---
name: typescript-narrowing-expert
description: 'Use when designing discriminated unions, debugging control-flow analysis, choosing satisfies vs as, building branded types, writing user-defined type guards, or composing conditional types and template literal types. Triggers: "Type X is not assignable to type Y" after a type guard, exhaustiveness checks via never, satisfies vs explicit annotation, infer in conditional types, mapped types with key remapping, distributive conditional types, type-narrowing inside callbacks losing the narrowed type. NOT for runtime validation only (zod/yup), tsc compiler internals, or design-time-only types not used at runtime.'
category: Frontend & UI
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - typescript
  - type-system
  - generics
  - narrowing
  - discriminated-unions
  - branded-types
---

# TypeScript Narrowing Expert

The interesting part of TypeScript isn't generics — it's narrowing. Control-flow analysis turns wide types into specific ones inside conditional branches. Most "TypeScript is fighting me" stories come from narrowing not propagating where the engineer expected.

## Decision diagram

```mermaid
flowchart TD
  A[Type error after a check] --> B{Is the check on a discriminant property?}
  B -->|No, structural check| F1[FIX: add a literal discriminant `kind: 'a' | 'b'`]
  B -->|Yes| C{Narrowing lost inside a callback?}
  C -->|Yes| F2[FIX: hoist the narrowed value into a const before the callback]
  C -->|No| D{Is `as` being used?}
  D -->|Yes, to silence error| F3[FIX: replace with type guard or `satisfies`]
  D -->|No, satisfies| E{Need exhaustiveness?}
  E -->|Yes| F4[FIX: switch + `_exhaustive: never` default]
  E -->|No| G{ID confused with other ID type?}
  G -->|Yes| F5[FIX: branded type via intersection w/ unique symbol]
  G -->|No| H[Done]
```

## When to use

- Modeling state machines or sum types in TS.
- A type guard works at the call site but the narrowed type is lost inside a callback.
- Choosing between `as`, `satisfies`, and an explicit annotation.
- Branded types for ID disambiguation (UserID vs OrderID).
- Conditional types that need to extract a piece of a generic.

## Core capabilities

### Discriminated unions — the workhorse

```ts
type Result<T> =
  | { kind: 'ok'; value: T }
  | { kind: 'err'; error: Error };

function unwrap<T>(r: Result<T>): T {
  if (r.kind === 'err') throw r.error;
  return r.value;            // narrowed to { kind: 'ok'; value: T }
}
```

The discriminant (`kind`) must be a literal in every variant. String, number, or boolean literals all work; symbol literals don't narrow.

Exhaustiveness checks:

```ts
function describe(r: Result<string>): string {
  switch (r.kind) {
    case 'ok': return `ok: ${r.value}`;
    case 'err': return `err: ${r.error.message}`;
    default: {
      const _exhaustive: never = r;   // compile error if a case is missing
      return _exhaustive;
    }
  }
}
```

### `satisfies` vs annotation vs `as`

Three different operators, often confused:

```ts
type Color = { hex: string; name: string };

// Annotation: forces the value to type Color, widens it.
const a: Color = { hex: '#fff', name: 'white' };
a.hex;        // typed as string

// satisfies: validates the value matches Color, keeps the narrow inferred type.
const b = { hex: '#fff', name: 'white' } as const satisfies Color;
b.hex;        // typed as '#fff' (literal)

// as: a coercion. Bypasses checks; lies to the compiler.
const c = { hex: '#fff' } as Color;   // works, but missing `name`
c.name;       // typed as string, but undefined at runtime
```

Default to `satisfies` when you want validation without losing inference. `as` is a last resort.

### User-defined type guards

```ts
function isError(x: unknown): x is Error {
  return x instanceof Error;
}

try { /* ... */ } catch (e) {
  if (isError(e)) console.error(e.message);   // narrowed to Error
}
```

For shape checks:

```ts
function hasMessage(x: unknown): x is { message: string } {
  return typeof x === 'object' && x !== null && 'message' in x && typeof (x as { message: unknown }).message === 'string';
}
```

### Branded types for ID safety

```ts
type Brand<T, B> = T & { readonly __brand: B };
type UserID = Brand<string, 'UserID'>;
type OrderID = Brand<string, 'OrderID'>;

function UserID(s: string): UserID { return s as UserID; }
function OrderID(s: string): OrderID { return s as OrderID; }

declare function getUser(id: UserID): Promise<User>;

const u = UserID('abc');
const o = OrderID('xyz');
getUser(u);   // ok
getUser(o);   // type error — OrderID is not UserID
```

The `as` is contained in the factory; outside it, the brand is enforced.

### Narrowing inside callbacks

```ts
function process(value: string | null) {
  if (value === null) return;
  // `value` is `string` here.

  someAsync().then(() => {
    // `value` is `string | null` again — narrowing doesn't survive across closure boundaries.
  });
}
```

Two fixes:

```ts
// 1. Re-narrow inside.
someAsync().then(() => {
  if (value === null) return;
  // narrowed
});

// 2. Capture into a const, which IS narrowed.
const v = value;   // typed `string`
someAsync().then(() => {
  v.length;        // ok
});
```

### `in` operator narrowing

```ts
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function speak(animal: Cat | Dog) {
  if ('meow' in animal) animal.meow();   // narrowed to Cat
  else animal.bark();                    // narrowed to Dog
}
```

### Conditional types with `infer`

```ts
type AwaitedReturn<F> = F extends (...args: any[]) => Promise<infer R> ? R : never;
type Element<A> = A extends Array<infer E> ? E : never;

type X = AwaitedReturn<() => Promise<{ id: string }>>;   // { id: string }
type Y = Element<number[]>;                              // number
```

`infer` introduces a type variable that captures the matched portion. Useful for unwrapping promises, arrays, function returns.

### Distributive conditional types

```ts
type ToArray<T> = T extends any ? T[] : never;
type X = ToArray<string | number>;   // string[] | number[]
```

The conditional distributes over union members. Wrap to disable:

```ts
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Y = ToArrayNonDist<string | number>;   // (string | number)[]
```

### Mapped types with key remapping

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type X = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }
```

Template literal types (`Capitalize`, `Uppercase`, `${...}`) compose with mapped types for ergonomic API generation.

## Anti-patterns

### Using `as` to silence errors

**Symptom:** Code compiles; production throws "Cannot read property of undefined".
**Diagnosis:** `as` told the compiler to trust you about a shape that wasn't real.
**Fix:** Add a runtime check (zod, manual) that produces a typed value, or fix the shape so `as` isn't needed.

### Discriminant that isn't a literal

**Symptom:** `switch (kind)` cases don't narrow.
**Diagnosis:** `kind: string` instead of `kind: 'ok' | 'err'`.
**Fix:** Use literal types for discriminants. Mark with `as const` if pulled from data.

### Type guard that returns `boolean` instead of `x is Foo`

**Symptom:** Function returns true; caller doesn't see narrowing.
**Diagnosis:** Return type is `boolean`, not a type predicate.
**Fix:** Declare the return as `function isFoo(x: unknown): x is Foo`.

### Branded type without a factory

**Symptom:** Engineers cast strings to `UserID` everywhere; brand provides no safety.
**Diagnosis:** No central place that knows the rules for valid IDs.
**Fix:** A factory that validates (regex, length) and casts. Outside the factory, brand is enforced.

### Closure-captured variable losing narrowing

**Symptom:** Code inside `.then` says `value` could be null, but you checked above.
**Diagnosis:** Narrowing applies to the variable at one point in time; closures see the union again.
**Fix:** Capture into a `const` after narrowing, or re-narrow inside the closure.

### Infinite recursion in conditional types

**Symptom:** `Type instantiation is excessively deep and possibly infinite`.
**Diagnosis:** Recursion depth >100 in a conditional type.
**Fix:** Add a depth counter, or refactor to iterate via mapped types instead of recursive conditionals.

## Worked example: the `OrderID` mixed up with `UserID`

**Scenario.** Production bug: a refund function received an `OrderID` parameter but was being called with a `UserID`. The bug existed for 6 weeks before a customer complained. Both are strings; TypeScript said it was fine.

**Novice would:** Add a JSDoc `@param orderId — must be an order ID, not a user ID` and write a runtime check that throws on the wrong shape. Misses two things: docs don't fail builds, and the runtime check fires after the wrong query already ran.

**Expert catches:**
1. **Brand the IDs at the type system.** `type OrderID = string & { readonly __brand: 'OrderID' }`. Now `processRefund(orderId: OrderID)` rejects raw strings AND `UserID`s at compile time.
2. **Factory that validates.** `OrderID(s: string): OrderID` checks the format (`/^o_[a-z0-9]{12}$/`) and casts inside. Outside the factory, no `as OrderID` is allowed (lint rule).
3. **Audit existing call sites.** `tsc --noEmit` after the brand is applied surfaces every place that's passing a raw string. Fix them by reading from typed sources (DB types, API response types) or by routing through the factory.
4. **Test the brand can't be bypassed.** A `expectTypeOf<UserID>().not.toMatchTypeOf<OrderID>()` test (via `expect-type` or similar) locks the invariant.

**Timeline.** Novice's runtime guard catches future cases at request-time, not commit-time; the same shape of bug recurs across other ID pairs (CustomerID vs MerchantID, etc). Expert's branded-type fix once applied is propagated to all 14 ID types in the domain via codemod; the entire class of bug disappears, and TypeScript catches violations in IDE before commit.

## Quality gates

- [ ] **Test:** every discriminated union has an exhaustiveness test that fails to compile if a new variant is added without handling (`const _: never = x` in the default branch).
- [ ] **Test:** branded types have negative type-tests (`expectTypeOf` or `tsd`) asserting two different brands are not assignable.
- [ ] Discriminated unions used for sum types; discriminants are literal types (`'a' | 'b'`), not booleans or enums.
- [ ] `satisfies` preferred over annotation for inferring narrow types. ESLint rule or grep for `: SomeWideType =` flags candidates.
- [ ] `as` audited: every instance has a `// reason:` comment in the same line. CI grep fails on bare `as` without comment.
- [ ] Branded types have validating factories; `as Brand` outside the factory file is lint-banned.
- [ ] User-defined type guards return `x is Foo`, not `boolean`. Verified by grep for `function is.*\(.*\): boolean`.
- [ ] No `any` in domain code; only in `vendor/` or framework-boundary files. CI: `tsc --noImplicitAny` clean.
- [ ] Conditional types stay ≤ 50 lines; complex ones broken into named type aliases. ESLint rule on type-alias body length.
- [ ] `tsc --noEmit` runs in CI on every PR; build fails on type errors.

## NOT for

- **Runtime validation** — pair with zod/valibot for data coming from outside.
- **TypeScript compiler internals** — different domain.
- **Design-time-only types** that never affect runtime — use sparingly; they're write-once-read-confused.
- **JavaScript projects** — narrowing requires the type system.
