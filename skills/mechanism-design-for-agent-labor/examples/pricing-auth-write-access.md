# Pricing `auth.ts` Write Access

Scenario: an agent requests 30-minute write access to `src/auth/middleware.ts`. The agent has 14 completions and 2 salvage events, a 14% salvage rate.

```text
Scope: write to critical file (auth) -> base = 10 units
Duration: 30 min -> multiplier = 1.5
History: 14 completions, 14% salvage rate
  5-20 completions, >= 2 salvages -> multiplier = 1.2

Bond = 10 * 1.5 * 1.2 = 18 units

Settlement scenarios:
  Success (tests pass, review approved): 18 units returned
  Crash at 60% completion: 10.8 units returned, 7.2 held for salvage
  Sabotage detected: 18 units liquidated to reconstruction fund
```

Trade-off analysis:

- New agent with no history: `10 * 1.5 * 2.0 = 30` units
- Veteran agent with 50+ clean completions: `10 * 1.5 * 0.5 = 7.5` units

Use this example when you need to explain why scope, duration, and history all belong in the pricing function.
