---
name: feature-flag-rollout-strategist
description: 'Use when introducing a feature flag system, choosing between release flags / experiment flags / operational flags / kill switches / permission flags, designing percentage rollouts, building kill-switch + circuit-breaker patterns, structuring evaluation contexts (user IDs, plan tier, region), or building flag-cleanup discipline. Triggers: LaunchDarkly / GrowthBook / Unleash / Flagsmith / OpenFeature, percentage ramp, sticky bucketing, kill switch wired to alerting, "we still have flags from 2 years ago", flag debt, OpenFeature provider, evaluation context, default value on provider failure. NOT for A/B test statistical analysis (separate skill), traffic-split routing at the edge, build-time bundler defines, or environment-based config.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - feature-flags
  - feature-management
  - launchdarkly
  - openfeature
  - rollouts
  - kill-switch
---

# Feature Flag Rollout Strategist

Three choices that decide whether a feature-flag system helps you or owns you: **the right flag type**, **a hard cleanup discipline**, and **fail-safe default values when the flag service is down**. Get those three and the rest is configuration.

The 2026 industry default is **OpenFeature** as the vendor-neutral SDK API (CNCF, vendor-implementations from LaunchDarkly, GrowthBook, Flagsmith, Flipt, Unleash all publish OpenFeature providers) — code against the spec, swap providers if you change vendors. ([OpenFeature spec][openfeature-spec])

LaunchDarkly's distinction is the cleanest: **release flag = short-lived, kill-switch = also short-lived but during release, circuit breaker = long-lived, alert-driven**. ([LaunchDarkly — *Operational Flag Best Practices*][ld-operational])

**Jump to your fire:**
- "What kind of flag is this?" → [Flag types](#flag-types)
- Designing a percentage rollout → [Ramp pattern](#ramp-pattern)
- Building a kill switch wired to alerts → [Kill switches and circuit breakers](#kill-switches-and-circuit-breakers)
- "We have 200 stale flags" → [Cleanup discipline](#cleanup-discipline)
- Flag service goes down — what does the app do? → [Default values and provider failure](#default-values-and-provider-failure)
- Targeting users by plan / region / cohort → [Evaluation context](#evaluation-context)
- Choosing a vendor → [Vendor selection](#vendor-selection)

## When to use

- Adding feature flags to a service for the first time.
- Existing flag usage has produced flag debt; team wants a cleanup pattern.
- Rolling out a risky migration (DB, auth) where percentage ramp + instant rollback is required.
- Wiring kill switches into the alerting system.
- Choosing between OpenFeature + a backend, or going direct with one vendor.

## Core capabilities

### Flag types

Different flag types have different lifetimes, owners, and risk profiles. Mixing them is how the catalog rots. Unleash's classification (echoed by the OpenFeature ecosystem) is widely useful: ([Unleash docs][unleash-types])

| Type | Purpose | Expected lifetime | Owner | Cleanup trigger |
|---|---|---|---|---|
| **Release** | Hide an in-progress feature; ramp once it's ready | ~30–60 days | Feature team | Feature is at 100%, stable |
| **Experiment** | A/B test, multivariate | One experiment cycle | Product / data | Experiment concludes |
| **Operational** | Long-lived control of a behavior (rate limit, cache TTL) | Permanent | SRE / platform | Replaced or no longer applicable |
| **Kill switch** | Short-lived, deploy-tied; flip off if something breaks | One release cycle | Feature team | Same as the release flag |
| **Circuit breaker** | Long-lived, alert-driven; auto-opens to degrade gracefully | Permanent | SRE | Feature retired or replaced |
| **Permission** | Entitle access by plan, role, region | Until product change | Product / billing | Plan / region changes |

LaunchDarkly's working terminology: *"A kill switch typically refers to a short-term flag used during a release to turn a feature off if something goes wrong. A circuit breaker is considered a permanent flag and is activated based on an event."* ([ld-operational])

**Practical rule**: name the type into the flag, e.g. `release-checkout-v2-temp`, `ops-search-cache-perm`, `kill-payments-v3-temp`. LaunchDarkly's recommended naming bakes type + creation date into the flag key for exactly this reason. ([ld-operational])

### Ramp pattern

The default safe ramp:

```
1%  →  5%  →  25%  →  50%  →  100%
              ↑ pause for at least one full traffic cycle (≥ 1 hour for hot APIs)
```

At each step, watch:
- Error rate on the gated path (and adjacent paths — feature flags have side effects).
- Latency p99 on the gated path.
- Business metric the feature exists to move (signup conversion, checkout completion).

If any gets worse, **roll back to the previous step or off entirely**. Don't push through.

```ts
// OpenFeature client (vendor-neutral) sketch.
import { OpenFeature } from '@openfeature/server-sdk';
import { LaunchDarklyProvider } from '@openfeature/launchdarkly-server-provider';

await OpenFeature.setProviderAndWait(new LaunchDarklyProvider(process.env.LD_SDK_KEY!));
const client = OpenFeature.getClient();

// Sticky bucketing: same user always gets the same answer for a given ramp.
const enabled = await client.getBooleanValue(
  'release-checkout-v2-temp',
  /* default */ false,
  { targetingKey: user.id, plan: user.plan, region: user.region }
);
```

The `targetingKey` is the bucket-stable hash input. **Always pass a stable user/account ID, not a session/request ID**, or users will see the feature flicker.

### Kill switches and circuit breakers

Kill switches save outages. Two patterns:

**Manual kill switch** (the human flips):

```ts
const allowPayments = await client.getBooleanValue('kill-payments-v3-temp', true, ctx);
if (!allowPayments) {
  return c.json({ error: 'payments-temporarily-unavailable' }, 503);
}
```

Default `true` — if the flag service is unreachable, the feature stays available. Flip to `false` in the LaunchDarkly UI to disable.

**Automatic circuit breaker** (alerts flip):

LaunchDarkly's recommended pattern: *"a monitoring tool generates an alert when orders fail to complete. The alert toggles a flag that sets the site to 'read-only.'"* ([ld-operational])

```
PagerDuty / Grafana alert  →  webhook  →  Flag API: set "ops-checkout-readonly-perm" = true  →  app degrades
```

The flag remains `false` by default; an alert flipping it to `true` puts the system into a degraded mode while humans investigate. Pair with `grafana-dashboard-builder` for the alert side.

### Cleanup discipline

Stale flags are the cost. Without enforcement, every flag system eventually has hundreds of flags nobody knows what to do with.

The recommended pattern from LaunchDarkly and Unleash, paraphrased: ([ld-operational], [Unleash][unleash-types])

1. **Every flag has a maintainer** assigned at creation time. Documented in flag metadata.
2. **Every release/experiment flag has a TTL** at creation. Default 30 days, max 90.
3. **Cleanup is scheduled**: monthly or quarterly review; flags past their TTL are owners' responsibility to remove or extend (with justification).
4. **Auto-cleanup tools** are run quarterly: dead-flag finders (`flagshark`, `unrevoked`, `grit.io` flag transformations) identify flags whose code has been at 100% for ≥ 30 days.
5. **Code-side cleanup**: when removing a flag, both the flag definition AND the conditional code must be removed. Half-removals leave dead branches.

```bash
# Example: grep for flags whose code is conditional and grep their last-modified date.
git log --since='90 days ago' --format='%H' -- src/ | xargs git diff --name-only | sort -u
# Flags whose code is at 100% (always-on or always-off branch dead) → remove.
```

The 30-day sunset policy is widely cited as the practical baseline. ([FlagShark — *Best Feature Flag Cleanup Tools*][flagshark-cleanup])

### Default values and provider failure

The single most-overlooked pattern. The flag SDK MUST handle:
- Provider unreachable (network down).
- Provider slow (timeout).
- Provider returns invalid value (vendor outage).

```ts
// Always pass a default. Never throw on provider failure — degrade.
const safeMode = await client.getBooleanValue(
  'ops-feature-x-perm',
  true,    // Default: feature is ON. Choose so that provider-down ≠ outage.
  ctx
);
```

The choice between `true` and `false` as default is the most important design decision per flag:

| Default | Use when |
|---|---|
| `true` (feature on) | The feature is the safe path; turning it off only when explicitly needed |
| `false` (feature off) | The feature is the risky path; only enable when explicitly approved |

Kill switches default `true` (feature available). Release flags default `false` (feature hidden). Don't get this backwards.

### Evaluation context

The dimensions you target on. Common shapes:

```ts
const ctx = {
  targetingKey: user.id,           // bucket-stable hash input — REQUIRED
  email: user.email,               // for individual targeting in the UI
  plan: user.plan,                 // 'free' | 'pro' | 'enterprise'
  region: user.region,             // 'us-east-1' | 'eu-west-1'
  signupCohort: user.signupMonth,  // for cohort-based ramps
  internal: user.email.endsWith('@yourorg.com'),  // dogfooding before public ramp
};
```

Pre-launch the feature to internal users (`internal: true` rule) to dogfood, then ramp to a 1% public segment, then up. Same flag, different rules.

### Vendor selection

| Need | Reach for |
|---|---|
| Best-in-class managed, large team | LaunchDarkly |
| OSS self-hosted, GrowthBook is the leader | GrowthBook |
| OSS lightweight, Unleash | Unleash |
| Cheap managed, simple | Flagsmith / Flipt / PostHog |
| Edge/Workers-friendly | Cloudflare Worker bindings, ConfigCat, Statsig |
| Multi-vendor / future-proof | OpenFeature SDK + any provider |

Code against the **OpenFeature** API regardless of provider. The cost of switching vendors is then the provider config, not the call sites. ([openfeature-spec])

```ts
// Same call site works with LaunchDarkly, GrowthBook, Flagsmith, Flipt, in-memory test provider, etc.
const enabled = await client.getBooleanValue('release-checkout-v2-temp', false, ctx);
```

### Test harness

```ts
// In tests, use the in-memory provider; assert on flag state.
import { InMemoryProvider } from '@openfeature/in-memory-provider';
await OpenFeature.setProviderAndWait(new InMemoryProvider({
  'release-checkout-v2-temp': { variants: { on: true, off: false }, defaultVariant: 'on', disabled: false },
}));
```

Two test paths per flag (on, off). When the flag is removed, the second path is removed too.

### Targeting expressions: keep them simple

```
plan IN ['pro','enterprise']
  AND region IN ['us-east-1']
  AND createdAt < '2026-01-01'
```

Beyond ~3 conditions, targeting becomes a black box that nobody understands six months later. If a rule is complex, encode the cohort in the evaluation context (`signupCohort`, `treatmentGroup`) rather than computing it in the flag service.

## Anti-patterns

### Permanent flag with no maintainer

**Symptom:** A flag from 2023 still in code; nobody knows what it does. Removing it scares everyone.
**Diagnosis:** No owner attached at creation; no review cadence.
**Fix:** Maintainer field required at creation; quarterly cleanup review with the owner; if no owner, default-off and remove.

### Default value that turns into the outage

**Symptom:** Flag service has a 30-second blip; the entire feature goes dark for 30s because the default was `false`.
**Diagnosis:** Default was set as if the flag were a release flag, but the feature was already at 100%.
**Fix:** When ramping past 100%, flip the default to `true` so a provider blip doesn't cause an outage. Better: remove the flag.

### Session-ID bucketing

**Symptom:** Users see the feature one request, miss it the next. Bug reports about flicker.
**Diagnosis:** `targetingKey` was `session.id` instead of `user.id`.
**Fix:** Always bucket on a stable identity. For unauthenticated traffic, bucket on a stable cookie that survives reload, not the request.

### Big-bang flip from 0% to 100%

**Symptom:** A bug at scale that wasn't visible at 1% takes down production.
**Diagnosis:** Skipped the ramp.
**Fix:** Use the standard ramp (1% → 5% → 25% → 50% → 100%) with at least one traffic cycle between steps.

### Code at 100% but flag still in place "just in case"

**Symptom:** The dead branch (`if (!flag) { /* old code */ }`) rots. Six months later it's incompatible with the codebase but nobody noticed.
**Diagnosis:** Flag never cleaned up after ramp completion.
**Fix:** Cleanup is a release task: when a flag hits 100% stable for 30 days, delete the flag AND the dead branch in the same PR.

### Targeting rule as business logic

**Symptom:** "Users on the pro plan in EU after May 1 with X feature get Y treatment" — encoded in flag rules across 12 flags.
**Diagnosis:** Flag service is being used as a rules engine.
**Fix:** Compute the cohort in code; pass `cohort: 'eu-pro-may'` in evaluation context; flag rule reads only that key. One source of truth.

### Flag service treated as cache

**Symptom:** Feature behavior depends on flag value being read on every request; flag service latency dominates p99.
**Diagnosis:** No SDK-side caching, no streaming updates.
**Fix:** All major SDKs cache and stream updates; if you've configured around the cache, undo it.

### No `kill-` prefix on kill switches

**Symptom:** During incident: "wait, which flag is the kill switch?"
**Diagnosis:** Naming doesn't distinguish.
**Fix:** Adopt LaunchDarkly's naming convention: `release-`, `kill-`, `ops-`, `experiment-`, `permission-` prefix. Type encoded in the name.

## Quality gates

- [ ] **Test:** every flag has both `on` and `off` test paths in the suite, using `InMemoryProvider` or equivalent.
- [ ] **Test:** load test with the flag service unreachable (fail-closed scenario); assert app behavior matches the documented default.
- [ ] **Test:** percentage rollout assigns the same user to the same bucket on subsequent calls (sticky bucketing). Asserted via direct SDK call.
- [ ] OpenFeature SDK in use; provider can be swapped without changing call sites.
- [ ] Every flag has: a type prefix in the name (`release-`, `kill-`, `ops-`, `experiment-`, `permission-`); a maintainer; a creation date; a target removal date (release/experiment) or "permanent" annotation.
- [ ] Every flag has a documented default value AND a documented behavior when the provider is unreachable.
- [ ] Cleanup cadence: monthly or quarterly review of flags past their TTL.
- [ ] Auto-cleanup tooling identifies dead branches (flag at 100% for ≥ 30 days). Open PR queue from this is non-empty roughly monthly.
- [ ] Kill switches and circuit breakers are documented in the runbook (`structured-logging-design`, `grafana-dashboard-builder`); alerting is wired into circuit-breaker flags via webhook.
- [ ] Targeting rules per flag ≤ 3 conditions; complex cohorts encoded in evaluation context, not in the flag service.
- [ ] Bucket-stable identifier is `user.id` (or stable cookie for unauthenticated), not session/request ID.
- [ ] OTel spans tag `feature_flag.<key>=<value>` for every evaluated flag (see `opentelemetry-instrumentation`).

## NOT for

- **A/B test statistical analysis** — different problem (significance, p-values, sample sizes). Pair with a stats skill.
- **Edge / traffic-split routing** (Cloudflare splitTesting, Vercel rewrites) — different layer; use feature flags only for the application-side branch.
- **Build-time bundler defines** (`process.env.FEATURE_X`) — different lifecycle (rebuild required to flip).
- **Environment-based config** (DB URLs, secrets) — different concern; don't use a flag service.
- **DB schema migrations gated by flags** — overlaps; the flag gates code behavior. Schema lifecycle is → `zero-downtime-database-migration`.
- **Authorization decisions in production** — flags can entitle access (permission flags) but security policy is a separate boundary; don't put critical authz in feature flags only.

## Sources

- LaunchDarkly — *Operational Feature Flags Best Practices* (release vs kill-switch vs circuit breaker; naming; alert-driven flips). [launchdarkly.com/blog/operational-flags-best-practices/][ld-operational]
- LaunchDarkly — *Feature Flags 101: Use Cases, Benefits, and Best Practices*. [launchdarkly.com/blog/what-are-feature-flags/][ld-101]
- OpenFeature — *Specification* (vendor-neutral SDK; provider/client/evaluation context). [openfeature.dev/specification/][openfeature-spec]
- Unleash docs — flag types (release, experiment, operational, kill-switch, permission) with recommended lifetimes. [docs.getunleash.io/reference/feature-toggle-types][unleash-types]
- FlagShark — *Best Feature Flag Cleanup Tools in 2026* (30-day sunset policy, cleanup tooling). [flagshark.com/blog/best-feature-flag-cleanup-tools-2026/][flagshark-cleanup]
- FlagShark — *Open Source Feature Flag Tools Compared: Unleash vs GrowthBook vs Flipt vs Flagsmith*. [flagshark.com/blog/open-source-feature-flag-tools-compared-2026/][flagshark-oss]

[ld-operational]: https://launchdarkly.com/blog/operational-flags-best-practices/
[ld-101]: https://launchdarkly.com/blog/what-are-feature-flags/
[openfeature-spec]: https://openfeature.dev/specification/
[unleash-types]: https://docs.getunleash.io/reference/feature-toggle-types
[flagshark-cleanup]: https://flagshark.com/blog/best-feature-flag-cleanup-tools-2026/
[flagshark-oss]: https://flagshark.com/blog/open-source-feature-flag-tools-compared-2026/
