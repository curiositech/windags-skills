---
license: Apache-2.0
name: state-machine-designer
description: "Design and implement finite state machines and statecharts for complex UI flows using XState v5 and Zustand. Activate on: multi-step forms, complex UI state, wizard flows, auth flows, statechart, XState. NOT for: simple boolean toggles (use React useState), server state (use data-fetching-strategist)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - state-machines
  - xstate
  - zustand
  - statecharts
pairs-with:
  - skill: form-validation-architect
    reason: Multi-step form flows need both state machines and validation logic
  - skill: error-boundary-strategist
    reason: Error states in machines map to recovery UI via error boundaries
---

# State Machine Designer

Model complex UI flows as finite state machines and statecharts using XState v5, eliminating impossible states and race conditions.

## Activation Triggers

**Activate on**: multi-step wizards, authentication flows, payment checkout, complex form state, drag-and-drop orchestration, media player controls, `XState`, `statechart`, `createMachine`.

**NOT for**: simple boolean toggles (use `useState`). Server/async data caching -- use data-fetching-strategist. Global app state without transitions -- use Zustand directly.

## Quick Start

1. **Map states** -- list every discrete state the UI can be in (idle, loading, error, success, etc.).
2. **Define events** -- list every user action or system event that triggers transitions.
3. **Draw the statechart** -- use Stately.ai visual editor or ASCII diagram to verify no impossible transitions.
4. **Implement with XState v5** -- `setup()` + `createMachine()` with `@xstate/react` `useMachine` hook.
5. **Test transitions** -- use `createActor` in unit tests to verify every path.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| State Machines | XState v5, `setup()` API | Flat machines for simple flows |
| Statecharts | XState hierarchical/parallel states | Nested states, history states |
| UI Binding | `@xstate/react` `useMachine`, `useSelector` | React integration, selective re-renders |
| Lightweight State | Zustand with state enum pattern | When XState overhead is too much |
| Visualization | Stately.ai editor, `@stately-ai/inspect` | Visual debugging of live machines |
| Testing | `createActor`, `getSnapshot` | Deterministic transition testing |

## Architecture Patterns

### Pattern 1: XState v5 Machine with `setup()`

```typescript
import { setup, assign } from 'xstate';

const checkoutMachine = setup({
  types: {
    context: {} as {
      items: CartItem[];
      address: Address | null;
      paymentMethod: PaymentMethod | null;
      error: string | null;
    },
    events: {} as
      | { type: 'SET_ADDRESS'; address: Address }
      | { type: 'SET_PAYMENT'; method: PaymentMethod }
      | { type: 'SUBMIT' }
      | { type: 'BACK' }
      | { type: 'RETRY' },
  },
  guards: {
    hasAddress: ({ context }) => context.address !== null,
    hasPayment: ({ context }) => context.paymentMethod !== null,
  },
}).createMachine({
  id: 'checkout',
  initial: 'cart',
  context: { items: [], address: null, paymentMethod: null, error: null },
  states: {
    cart:     { on: { SUBMIT: { target: 'address', guard: 'hasItems' } } },
    address:  { on: { SET_ADDRESS: { actions: assign({ address: (_, e) => e.address }), target: 'payment' }, BACK: 'cart' } },
    payment:  { on: { SET_PAYMENT: { actions: assign({ paymentMethod: (_, e) => e.method }), target: 'review' }, BACK: 'address' } },
    review:   { on: { SUBMIT: 'processing', BACK: 'payment' } },
    processing: {
      invoke: { src: 'processPayment', onDone: 'success', onError: { target: 'error', actions: assign({ error: (_, e) => e.data.message }) } },
    },
    success:  { type: 'final' },
    error:    { on: { RETRY: 'processing', BACK: 'review' } },
  },
});
```

### Pattern 2: Zustand State Enum (Lightweight Alternative)

When XState is overkill but `useState` booleans create impossible states:

```typescript
import { create } from 'zustand';

type AuthState = 'idle' | 'authenticating' | 'authenticated' | 'error' | 'mfa_required';

interface AuthStore {
  state: AuthState;
  user: User | null;
  error: string | null;
  login: (creds: Credentials) => Promise<void>;
  submitMfa: (code: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  state: 'idle',
  user: null,
  error: null,
  login: async (creds) => {
    if (get().state !== 'idle' && get().state !== 'error') return; // guard
    set({ state: 'authenticating', error: null });
    try {
      const res = await api.login(creds);
      if (res.mfaRequired) set({ state: 'mfa_required' });
      else set({ state: 'authenticated', user: res.user });
    } catch (e) {
      set({ state: 'error', error: e.message });
    }
  },
  logout: () => set({ state: 'idle', user: null }),
}));
```

### Pattern 3: Statechart Visualization

```
  ┌────────────────────────────────────────────────┐
  │                  checkout                       │
  │                                                 │
  │  [cart] ──SUBMIT──> [address] ──SET_ADDR──>    │
  │    ^                  │                         │
  │    └───BACK───────────┘                         │
  │                                                 │
  │  [payment] ──SET_PAY──> [review] ──SUBMIT──>   │
  │    ^                      │                     │
  │    └───BACK───────────────┘                     │
  │                                                 │
  │  [processing] ──onDone──> [success]  (final)   │
  │       │                                         │
  │       └──onError──> [error] ──RETRY──>         │
  │                       │      (back to processing)│
  │                       └──BACK──> [review]       │
  └────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **Boolean soup** -- `isLoading && !isError && isSubmitted` creates impossible state combinations. Use a single state enum or machine instead.
2. **Skipping the statechart diagram** -- jumping to code without visualizing transitions guarantees missing edge cases. Draw first, code second.
3. **Putting side effects in guards** -- guards must be pure predicates. Use `actions` or `invoke` for side effects.
4. **Over-engineering simple toggles** -- a modal open/close does not need XState. Use `useState<boolean>` for trivially simple state.
5. **Forgetting to handle the error-to-retry path** -- users get stuck in error states with no way back. Always define recovery transitions.

## Quality Checklist

- [ ] Every UI state is an explicit named state (no derived boolean combinations)
- [ ] Statechart visualized (Stately.ai or ASCII diagram) before implementation
- [ ] No impossible state transitions (e.g., cannot go from `success` to `cart`)
- [ ] Guards are pure functions with no side effects
- [ ] Every error state has a recovery transition (`RETRY` or `BACK`)
- [ ] Machine tested with `createActor` covering happy path + error path + edge cases
- [ ] Context types fully specified with TypeScript
- [ ] React binding uses `useSelector` for selective re-renders (not full context subscription)
- [ ] Parallel states used where independent concerns overlap (e.g., form validity + network status)
