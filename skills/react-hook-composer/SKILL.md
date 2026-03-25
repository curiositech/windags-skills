---
license: Apache-2.0
name: react-hook-composer
description: "Design composable custom React hooks with proper dependency management, testing with renderHook, and reusable patterns. Activate on: custom hook design, useEffect cleanup, hook composition, renderHook testing, hook dependency arrays. NOT for: state management libraries (use state-machine-designer), data fetching hooks (use data-fetching-strategist)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - react-hooks
  - custom-hooks
  - composable-patterns
  - testing
  - renderHook
pairs-with:
  - skill: vitest-testing-patterns
    reason: Hook testing with renderHook and act() requires testing expertise
  - skill: react-performance-optimizer
    reason: Hook dependency arrays and memoization directly affect performance
---

# React Hook Composer

Design composable, testable custom React hooks with proper effect cleanup, dependency management, and type safety for reusable behavior encapsulation.

## Activation Triggers

**Activate on**: custom hook design, `useEffect` with cleanup, hook composition (hooks calling hooks), `renderHook` testing, dependency array bugs (stale closures, infinite loops), extracting component logic into reusable hooks.

**NOT for**: state management library selection (XState, Zustand) -- use state-machine-designer. Data fetching/caching hooks (React Query, SWR) -- use data-fetching-strategist.

## Quick Start

1. **Extract when repeated** -- if two components share the same `useState` + `useEffect` pattern, extract to a custom hook.
2. **Name with `use` prefix** -- `useDebounce`, `useMediaQuery`, `useLocalStorage`. This enables the Rules of Hooks linter.
3. **Return a consistent interface** -- return `[value, setter]` tuples for simple state, objects for complex state.
4. **Clean up effects** -- every `useEffect` that subscribes, observes, or creates timers must return a cleanup function.
5. **Test with `renderHook`** -- use `@testing-library/react` `renderHook` + `act` for isolated hook testing.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Hook Design | React 19, custom hooks | Single-responsibility, composable |
| Effect Management | `useEffect`, `useLayoutEffect` | Cleanup, abort controllers, event listeners |
| Dependency Safety | ESLint `react-hooks/exhaustive-deps` | Stable refs, updater functions, ref callbacks |
| Testing | `renderHook`, `act`, `waitFor` | Isolated hook testing without components |
| Type Safety | TypeScript generics, discriminated unions | Strongly-typed return values and params |
| Composition | Hooks calling hooks | Building complex behavior from simple hooks |

## Architecture Patterns

### Pattern 1: Composable Hook with Proper Cleanup

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);  // cleanup on value/delay change
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}
```

### Pattern 2: Composing Hooks from Other Hooks

```typescript
// hooks/useSearch.ts -- composed from useDebounce + useFetch
import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { useQuery } from '@tanstack/react-query';

export function useSearch<T>(endpoint: string, options?: { debounceMs?: number }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, options?.debounceMs ?? 300);

  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint, debouncedQuery],
    queryFn: () => fetch(`${endpoint}?q=${debouncedQuery}`).then(r => r.json()),
    enabled: debouncedQuery.length >= 2,
  });

  const results = useMemo(() => (data as T[]) ?? [], [data]);

  return {
    query,
    setQuery,
    results,
    isLoading: isLoading && debouncedQuery.length >= 2,
    error,
    isDebouncing: query !== debouncedQuery,
  };
}
```

```
  ┌─ Hook Composition ──────────────────────────────────┐
  │                                                      │
  │  useSearch (high-level, app-specific)                │
  │  ├── useDebounce (primitive, reusable)               │
  │  ├── useQuery (from TanStack Query)                  │
  │  └── useMemo (React built-in)                        │
  │                                                      │
  │  useAuth (high-level, app-specific)                  │
  │  ├── useLocalStorage (primitive, reusable)            │
  │  ├── useCallback (React built-in)                    │
  │  └── useEffect (React built-in)                      │
  │                                                      │
  │  Rule: primitives are generic, composites are        │
  │        app-specific. Test both independently.         │
  └──────────────────────────────────────────────────────┘
```

### Pattern 3: Testing Custom Hooks

```typescript
// hooks/__tests__/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } }
    );

    rerender({ value: 'world', delay: 500 });
    expect(result.current).toBe('hello');  // not yet updated

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe('world');  // now updated
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a');  // still original

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('abc');  // final value after full delay
  });
});
```

## Anti-Patterns

1. **Missing effect cleanup** -- `useEffect` that adds event listeners, starts intervals, or creates subscriptions without returning a cleanup function causes memory leaks and stale callbacks.
2. **Object/array literals in dependency arrays** -- `useEffect(() => {}, [{ key: 'value' }])` fires on every render because a new object is created each time. Memoize with `useMemo` or depend on primitive values.
3. **Stale closure from missing dependencies** -- omitting a variable from the dependency array captures an old value. Trust `react-hooks/exhaustive-deps`; if it warns, fix it.
4. **`useEffect` for derived state** -- `useEffect(() => setFullName(first + last), [first, last])` causes an extra render. Compute derived values directly: `const fullName = first + last`.
5. **Hooks with too many responsibilities** -- a hook managing form state, validation, submission, and error display should be split into `useFormState`, `useFormValidation`, `useFormSubmit`.

## Quality Checklist

- [ ] Every `useEffect` with subscriptions/timers returns a cleanup function
- [ ] `react-hooks/exhaustive-deps` ESLint rule enabled with zero warnings
- [ ] Custom hooks tested with `renderHook` and `act` (not mounted in dummy components)
- [ ] Hook return types explicitly typed (no inferred `any`)
- [ ] Hooks follow single-responsibility principle (one concern per hook)
- [ ] Primitive hooks are generic and reusable; composite hooks are app-specific
- [ ] No `useEffect` for derived state (computed directly in render)
- [ ] Stable function references via `useCallback` when passed to memoized children
- [ ] `AbortController` used in effects that make fetch requests (prevents race conditions)
- [ ] `useState` initializer uses lazy function for expensive computations (`useState(() => compute())`)
