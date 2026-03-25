---
license: Apache-2.0
name: error-boundary-strategist
description: "Design resilient React error handling with Error Boundaries, Sentry integration, recovery UI, retry patterns, and graceful degradation. Activate on: error boundary, crash recovery, Sentry, error fallback UI, retry logic, unhandled exceptions. NOT for: form validation errors (use form-validation-architect), API error codes (use api-architect)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - error-handling
  - error-boundaries
  - sentry
  - resilience
  - recovery-ui
pairs-with:
  - skill: error-handling-patterns
    reason: Backend error patterns feed into frontend error boundary strategy
  - skill: data-fetching-strategist
    reason: Query error/retry logic integrates with error boundary fallbacks
---

# Error Boundary Strategist

Design layered React error handling with Error Boundaries, error reporting, recovery UI, retry patterns, and graceful degradation so apps never show a white screen.

## Decision Points

### Error Severity Matrix & Routing Logic

```
ERROR TYPE                  SEVERITY      ACTION
─────────────────────────  ────────────  ─────────────────────────
Component render error     Critical      Route-level boundary → full page fallback
Widget/feature crash      Recoverable   Feature-level boundary → inline retry
Network timeout           Recoverable   Query error callback → toast + retry
Chunk load failure        Critical      App-level boundary → full reload
Type error in handler     Recoverable   Try/catch → log + continue
Memory leak crash         Critical      Global error → browser reload
```

**Decision Tree:**

```
Is error from React render tree?
├── YES: Error boundary will catch it
│   └── Is error in isolated widget?
│       ├── YES: Use feature-level boundary → show inline fallback
│       └── NO: Use route-level boundary → show page fallback
└── NO: Manual handling required
    └── Is error in async operation?
        ├── YES: Use query.onError or try/catch → show toast
        └── NO: Use window.onerror → report to Sentry
```

### Boundary Placement Strategy

```
If component tree depth > 3 levels:
  → Add feature-level boundaries around each major widget

If route has > 5 async data sources:
  → Add route-level boundary + individual query error handling

If app has > 10 routes:
  → Add app-level boundary as ultimate fallback

Always:
  → Add global-error.tsx in Next.js apps
```

## Failure Modes

### Infinite Reset Loop
**Detection:** `componentDidCatch` fires repeatedly on same component within 30 seconds
**Symptom:** User clicks "Try Again" → immediate re-crash → fallback shows again
**Root Cause:** `onReset` doesn't clear corrupted state that caused original error
**Fix:** Clear query cache, local state, and props that triggered error in `onReset` handler

### White Screen of Death
**Detection:** No error boundary catches error → blank page with no UI
**Symptom:** App shows empty white screen, no fallback UI visible
**Root Cause:** Error boundary placed too low in tree or missing app-level catch-all
**Fix:** Add error boundary wrapping entire app as ultimate safety net

### Error Boundary Blindness
**Detection:** Async errors logged to console but not caught by boundaries
**Symptom:** Promise rejections, event handler crashes slip through boundaries
**Root Cause:** Error boundaries only catch render-phase errors, not async
**Fix:** Use try/catch in handlers + query.onError for async operations

### Context Poisoning
**Detection:** Error boundary catches error but corrupted context still exists
**Symptom:** Reset works initially but subsequent actions crash due to bad context
**Root Cause:** Context provider above boundary has corrupted state
**Fix:** Reset context state in boundary's `onReset` or move boundary above context

### Fallback Cascade Failure
**Detection:** Error fallback UI itself throws error → nested error boundaries trigger
**Symptom:** Fallback component crashes → shows another fallback → potential infinite loop
**Root Cause:** Complex fallback components with their own dependencies/logic
**Fix:** Keep fallback UI extremely simple → static JSX with minimal dependencies

## Worked Examples

### Example: E-commerce Dashboard with Widget Isolation

**Scenario:** Dashboard with revenue chart, recent orders, and user stats. Chart widget crashes due to malformed API data.

**Expert Approach:**
1. **Assess impact:** Chart crash should not kill orders widget or navigation
2. **Choose boundary level:** Feature-level around chart widget (not route-level)
3. **Design fallback:** Show "Chart temporarily unavailable" with retry button
4. **Reset strategy:** Clear chart query cache, don't reset entire dashboard state

```typescript
// Expert places boundary precisely around volatile widget
<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <div className="chart-error">
      <p>Revenue chart temporarily unavailable</p>
      <button onClick={resetErrorBoundary}>Reload Chart</button>
    </div>
  )}
  onReset={() => {
    // Only clear chart-related state
    queryClient.removeQueries({ queryKey: ['revenue-chart'] });
  }}
  isolate  // This error won't bubble up to route level
>
  <RevenueChart />
</ErrorBoundary>

// Orders widget remains functional
<RecentOrders />  // No error boundary needed if stable
```

**Novice Mistake:** Places one boundary around entire dashboard → chart error kills everything
**Expert Insight:** Isolate volatile components; stable components don't need boundaries

**Testing the Setup:**
```typescript
// In development, inject errors to verify boundaries work
{process.env.NODE_ENV === 'development' && (
  <ErrorTrigger componentName="RevenueChart" />
)}
```

### Example: Next.js App Router Error Hierarchy

**Setup Navigation:**
- `/dashboard` route with error.tsx
- `/dashboard/analytics` with its own error.tsx  
- Global error.tsx as final fallback

**Error Routing Logic:**
```
Analytics widget crashes
  ↓
dashboard/analytics/error.tsx catches it
  ↓ (if error.tsx itself crashes)
dashboard/error.tsx catches it
  ↓ (if that crashes too)
global-error.tsx replaces entire page
```

**Implementation:**
```typescript
// app/dashboard/analytics/error.tsx
'use client';
export default function AnalyticsError({ error, reset }) {
  return (
    <div role="alert">
      <h2>Analytics Error</h2>
      <p>Unable to load analytics data</p>
      <button onClick={reset}>Retry</button>
      <Link href="/dashboard">Back to Dashboard</Link>
    </div>
  );
}

// Sentry reporting in each error boundary
useEffect(() => {
  Sentry.withScope((scope) => {
    scope.setTag('boundary.level', 'analytics');
    scope.setContext('route', { path: '/dashboard/analytics' });
    Sentry.captureException(error);
  });
}, [error]);
```

## Quality Gates

- [ ] App-level error boundary catches all unhandled React errors
- [ ] Route-level boundaries isolate pages from each other  
- [ ] Feature-level boundaries isolate widgets within pages
- [ ] Every error fallback has working retry/reset functionality
- [ ] `onReset` handlers clear corrupted state that caused original error
- [ ] Async errors handled with try/catch + query error callbacks (not boundaries)
- [ ] Error reporting (Sentry/etc) captures all boundary errors with component stack
- [ ] Fallback UI uses semantic HTML (`role="alert"`) for accessibility
- [ ] No error shows raw stack traces or technical messages to end users
- [ ] `window.onerror` and `unhandledrejection` handlers catch non-React errors
- [ ] Next.js apps have `global-error.tsx` as ultimate safety net
- [ ] Error boundaries tested by injecting crashes in development mode

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **Form validation errors** → Use form-validation-architect for field-level validation and user-correctable errors
- **HTTP status codes (400, 404, 500)** → Use api-architect for structured API error handling
- **Authentication failures** → Use auth patterns for login/permission errors  
- **Business logic validation** → Use domain-specific validation patterns
- **Loading states** → Use Suspense boundaries for async loading UI
- **Network offline detection** → Use connectivity-aware patterns

**Delegation Rules:**
- For field validation: "Email is invalid" → form-validation-architect
- For API errors: "Resource not found" → api-architect  
- For auth: "Session expired" → auth error handling
- For loading: "Fetching data..." → Suspense + loading UI patterns