---
name: playwright-e2e-design
description: 'Use when designing or fixing a Playwright end-to-end test suite, debugging flaky tests, choosing locator strategies (getByRole vs CSS vs test-id), structuring fixtures and auth-state reuse, configuring parallelism and sharding, mocking third-party APIs via route(), or wiring trace-on-first-retry into CI. Triggers: "tests are flaky", page.waitForTimeout, page.locator with brittle CSS, login runs in every test, third-party API takes test offline, "should I use sleep here", parallel mode, sharding across CI machines, soft vs hard assertions, trace.zip not available on CI failure. NOT for unit testing (Vitest/Jest), Cypress migration playbooks, mobile native testing (Detox/XCUITest), or visual regression testing as a primary concern.'
category: Code Quality & Testing
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - playwright
  - e2e
  - testing
  - automation
  - flaky-tests
  - browser-testing
---

# Playwright E2E Design

Most "Playwright is flaky" stories come from three things: brittle selectors, manual sleeps instead of web-first assertions, and tests that share state. The official Playwright best-practices doc, browserstack/testdino field guides, and the auto-waiting docs all converge on the same playbook. ([Playwright — *Best Practices*][playwright-best-practices], [Playwright — *Auto-waiting*][playwright-auto-waiting])

The compressed rule:

```
getByRole / getByTestId  +  web-first expect()  +  one fresh storageState per test  =  not flaky
```

**Jump to your fire:**
- Tests pass locally, flake on CI → [Locator strategy](#locator-strategy) + [Web-first assertions](#web-first-assertions)
- Login runs in every test → [Auth state reuse](#auth-state-reuse)
- Third-party API takes the suite offline → [Mock at the network layer](#mock-at-the-network-layer)
- `waitForTimeout(2000)` in 40 places → [Replace sleeps with auto-waiting](#replace-sleeps-with-auto-waiting)
- "Why is the trace empty on the failure?" → [Trace-on-first-retry](#trace-on-first-retry)
- Suite takes 45 minutes → [Parallelism + sharding](#parallelism-and-sharding)
- Two tests interfere with each other → [Test isolation](#test-isolation)

## When to use

- New service or app that needs an E2E suite from scratch.
- Existing Playwright suite with > 5% flake rate.
- Suite blowing past CI time budget (>10 min for a few hundred tests is a smell).
- Tests breaking on every CSS refactor.
- Login flow runs in every test.

## Core capabilities

### Locator strategy

The Playwright docs are explicit: **prefer user-facing attributes to XPath or CSS selectors.** ([playwright-best-practices])

| Tier | Locator | Use for |
|---|---|---|
| 1 | `page.getByRole('button', { name: 'Submit' })` | Default. Survives CSS refactors, encodes accessibility intent. |
| 2 | `page.getByLabel('Email')` / `page.getByPlaceholder` | Form fields. |
| 3 | `page.getByText('Welcome back')` | Static copy that's part of the test. |
| 4 | `page.getByTestId('user-menu')` (with `data-testid`) | Where role/label/text aren't unique enough. |
| 5 | CSS / XPath | Last resort. Comment why a higher tier didn't fit. |

```ts
// ✓ Resilient
await page.getByRole('button', { name: 'Save' }).click();
await page.getByLabel('Display name').fill('Alice');

// ✗ Fragile — designer changes a class name and everything breaks
await page.locator('button.btn.btn-primary.save-action').click();
```

The Playwright doc's exact framing: *"Designer changes to CSS classes break brittle selectors. User-facing attributes remain stable across refactoring."* ([playwright-best-practices])

### Web-first assertions

`expect()` on a Playwright locator **auto-retries until the condition is met or the timeout expires.** This is the single most important flake-elimination tool. ([Playwright — *Assertions*][playwright-assertions])

```ts
// ✗ Read-once snapshot. Race condition guaranteed.
expect(await page.getByText('Welcome').isVisible()).toBe(true);

// ✓ Retries until visible or timeout. No race.
await expect(page.getByText('Welcome')).toBeVisible();

// ✓ Same for text content, URL, count, value, …
await expect(page.getByRole('row')).toHaveCount(10);
await expect(page).toHaveURL(/\/dashboard$/);
await expect(page.getByLabel('Email')).toHaveValue('alice@example.com');
```

**Anything that synchronously reads from the DOM (`isVisible()`, `textContent()`, `count()`) is a snapshot.** It does not retry. The `await expect(locator).toX()` form is the retrying form.

### Replace sleeps with auto-waiting

Playwright's actionability checks (visible, stable, enabled, receives events) run automatically before every action. ([Playwright — *Actionability*][playwright-auto-waiting]) `page.waitForTimeout(N)` is almost always wrong:

```ts
// ✗ Hopes the API resolved within 2s. Sometimes it didn't.
await page.click('text=Save');
await page.waitForTimeout(2000);
expect(await page.locator('.toast').textContent()).toBe('Saved');

// ✓ No timer. Wait for the thing that actually marks success.
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByRole('status')).toHaveText('Saved');
```

If you genuinely need to wait for a network call, use `page.waitForResponse(/api\/save/)` — but usually a UI assertion is what you want.

### Auth state reuse

Logging in inside every test is slow and flaky. Playwright's pattern: a one-time setup project that logs in and saves `storageState` to disk, then every test starts from that state. ([playwright-best-practices])

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /global.setup\.ts/ },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: { storageState: 'playwright/.auth/user.json' },
    },
  ],
});
```

```ts
// global.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';
const authFile = path.join(__dirname, 'playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/dashboard/);
  await page.context().storageState({ path: authFile });
});
```

For multi-role suites, run a setup per role and use `test.use({ storageState: ... })` per file.

### Test isolation

Each test must be independent. Playwright's docs are blunt: *"Each test should be completely isolated from another test and should run independently with its own local storage, session storage, data, cookies etc."* ([playwright-best-practices])

In practice that means:

- A fresh browser context per test (Playwright does this by default).
- Test data isolated per test — typically by creating uniquely-named fixtures, or by tearing down via API after the test.
- No relying on test execution order. Tests in `test.describe.parallel` run in parallel; tests anywhere can run on different workers.

```ts
test.beforeEach(async ({ request }) => {
  // Clean slate via API, not via UI.
  await request.delete(`/api/test-utilities/clean`);
});
```

### Mock at the network layer

The docs say: *"Don't try to test links to external sites or third party servers that you do not control."* ([playwright-best-practices])

```ts
test('checkout shows total from quote API', async ({ page }) => {
  // Pin the third-party response.
  await page.route('**/api/quote*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ subtotal: 9999, tax: 870, total: 10869 }),
    })
  );

  await page.goto('/checkout');
  await expect(page.getByTestId('total')).toHaveText('$108.69');
});
```

For Stripe/Auth0/etc.: don't drive their UIs in your E2E suite. Mock the redirect-back step or use their test-mode endpoints.

### Trace-on-first-retry

Traces give you a timeline + DOM snapshots + network log of a failure — gold for debugging CI flake. The docs recommend running them only on retry to keep happy-path runs cheap: ([playwright-best-practices])

```ts
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
```

In CI, upload `test-results/` as an artifact so traces are downloadable. Open with `npx playwright show-trace trace.zip`.

### Parallelism and sharding

```ts
// File-level parallelism (within a file).
test.describe.configure({ mode: 'parallel' });
```

```yaml
# .github/workflows/e2e.yml — shard across N CI machines.
strategy:
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]
steps:
  - run: npx playwright test --shard=${{ matrix.shard }}
```

Sharding distributes tests across runners ([playwright-best-practices]). Pair with `github-actions-matrix-patterns` for the CI side. Keep individual tests under ~30s; long tests bottleneck a shard.

### Page-object pattern (lightweight)

Heavy POM hierarchies become their own maintenance burden. The lightweight version: helpers that wrap multi-step user journeys. Don't wrap every locator.

```ts
// pages/checkout.ts
export class CheckoutPage {
  constructor(private page: Page) {}
  async fillShippingAddress(addr: Address) {
    await this.page.getByLabel('Street').fill(addr.street);
    await this.page.getByLabel('City').fill(addr.city);
    await this.page.getByLabel('Zip').fill(addr.zip);
  }
  async submitOrder() {
    await this.page.getByRole('button', { name: 'Place order' }).click();
    await expect(this.page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  }
}
```

A helper layer is fine when it represents a real user workflow. A "ButtonPage" wrapping a single button is bureaucracy.

### Soft assertions

Use to collect multiple failures before failing the test:

```ts
await expect.soft(page.getByTestId('total')).toHaveText('$108.69');
await expect.soft(page.getByTestId('shipping')).toHaveText('$0.00');
await page.getByRole('button', { name: 'Place order' }).click();
// Test fails at the end if any soft assertion failed,
// but you see all the violations in one run.
```

Useful for end-of-test verification rows. Don't use them where a failure should stop further interaction.

### Visual regression (when relevant)

```ts
await expect(page).toHaveScreenshot('dashboard.png', { maxDiffPixelRatio: 0.01 });
```

Snapshots live in `__screenshots__/` per platform. Maintenance cost is real — typically reserve for high-value canvases (login page, checkout). Better to spend the budget on functional E2Es first.

## Anti-patterns

### Brittle CSS selectors

**Symptom:** A designer changes a class, 20 tests break.
**Diagnosis:** Tests use `.btn.btn-primary.save-action`-style selectors.
**Fix:** `getByRole`, `getByLabel`, `getByTestId` (with intentional `data-testid`). CSS only as last resort, with a comment.

### `waitForTimeout` everywhere

**Symptom:** Suite is slow AND flaky.
**Diagnosis:** Sleeps mask race conditions sometimes; let them through other times.
**Fix:** `await expect(locator).toX()` web-first assertions. Replace each `waitForTimeout` with the actual condition you were waiting for.

### Login per test

**Symptom:** Suite is dominated by login latency; auth provider rate-limits in CI.
**Diagnosis:** Every test runs the full login flow.
**Fix:** Setup project + `storageState` reuse. ([playwright-best-practices])

### Reading state with synchronous methods then asserting

**Symptom:** Test passes 9 of 10 runs.
**Diagnosis:** `expect(await locator.textContent()).toBe('X')` reads once, doesn't retry.
**Fix:** `await expect(locator).toHaveText('X')`. Same for visibility, count, value, attribute.

### Tests share data via DB

**Symptom:** Test A passes alone, fails when B runs first.
**Diagnosis:** Both write to the same row; no isolation.
**Fix:** Per-test unique data (suffix with `test.info().testId`). Reset via API in `beforeEach`.

### Hitting third-party services live

**Symptom:** Stripe / Auth0 outage takes the suite red. Quota errors on busy CI days.
**Diagnosis:** E2E driving real third parties.
**Fix:** `page.route()` mocks. Test-mode endpoints where mocks aren't realistic. ([playwright-best-practices])

### Single-process serial run

**Symptom:** Suite takes 45 minutes; engineers stop running it pre-PR.
**Diagnosis:** No parallelism, no sharding.
**Fix:** Enable parallel mode within files; shard across CI workers; cap individual test latency.

### Trace artifacts not retained

**Symptom:** A flake on CI; no trace, no screenshot, no video.
**Diagnosis:** `trace: 'off'` or no artifact upload.
**Fix:** `trace: 'on-first-retry'`, upload `test-results/` as a CI artifact. ([playwright-best-practices])

## Quality gates

- [ ] **Test:** suite runs in parallel by default; `mode: 'parallel'` in `test.describe.configure` or globally.
- [ ] **Test:** flake rate measured per nightly run; alert if > 1% over a week.
- [ ] **Test:** `npx playwright test --grep @smoke` runs in < 2 min for the smoke subset.
- [ ] No `page.waitForTimeout` calls in production tests. CI grep fails on hits.
- [ ] No `await locator.isVisible()` / `textContent()` followed by a sync `expect`. Lint or grep enforces.
- [ ] All locators are `getByRole` / `getByLabel` / `getByTestId` first; CSS as last resort with a comment.
- [ ] Auth-state reuse via `storageState`; login flow itself tested once in a `setup` project.
- [ ] Third-party calls mocked via `page.route()` or test-mode endpoints. CI denies network egress to unrelated hosts.
- [ ] `trace: 'on-first-retry'` configured; CI uploads `test-results/` as an artifact on failure.
- [ ] `retries: 2` on CI, `retries: 0` locally (so flake is visible to authors).
- [ ] Each test creates its own data with unique IDs; `beforeEach` cleans state via API.
- [ ] Suite shards across CI workers (`--shard=N/M`); see `github-actions-matrix-patterns` for the matrix.
- [ ] Individual test p95 < 30s. Long tests broken up.

## NOT for

- **Unit / component testing** — Vitest, Jest, Vitest Browser Mode, RTL. No dedicated skill yet.
- **Cypress migration** specifically — overlapping but distinct. No dedicated skill yet.
- **Mobile native E2E** (Detox, XCUITest, Espresso) — different runtime.
- **Visual regression as the primary concern** — Chromatic, Percy, Argos are dedicated tools.
- **Load testing** — k6, Gatling, Artillery. Different goal.
- **Security testing** — ZAP, Burp. Different threat model.
- **CI matrix design** for the suite — → `github-actions-matrix-patterns`.

## Sources

- Playwright — *Best Practices* (locator priority, isolation, soft assertions, trace-on-first-retry, third-party mocking). [playwright.dev/docs/best-practices][playwright-best-practices]
- Playwright — *Auto-waiting* (actionability checks; why `waitForTimeout` is unnecessary). [playwright.dev/docs/actionability][playwright-auto-waiting]
- Playwright — *Assertions* (web-first vs snapshot semantics). [playwright.dev/docs/test-assertions][playwright-assertions]
- Playwright — *Writing tests* (basic structure). [playwright.dev/docs/writing-tests][playwright-writing-tests]
- BrowserStack — *15 Best Practices for Playwright testing in 2026*. [browserstack.com/guide/playwright-best-practices][browserstack-playwright]
- TestDino — *Playwright Flaky Tests: How to Detect & Fix Them*. [testdino.com/blog/playwright-flaky-tests/][testdino-flaky]

[playwright-best-practices]: https://playwright.dev/docs/best-practices
[playwright-auto-waiting]: https://playwright.dev/docs/actionability
[playwright-assertions]: https://playwright.dev/docs/test-assertions
[playwright-writing-tests]: https://playwright.dev/docs/writing-tests
[browserstack-playwright]: https://www.browserstack.com/guide/playwright-best-practices
[testdino-flaky]: https://testdino.com/blog/playwright-flaky-tests/
