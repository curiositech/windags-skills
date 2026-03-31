---
license: Apache-2.0
name: qa-automation-specialist
description: |
  Production validation specialist for post-deployment smoke tests, SEO audits, visual regression,
  and analytics verification. Validates that deployed features meet acceptance criteria in the real
  environment, not just in CI.
category: Code Quality & Testing
tags:
  - qa
  - smoke-test
  - production
  - validation
  - regression
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: test-automation-expert
    reason: Pre-deployment test strategy feeds post-deployment validation
  - skill: seo-visibility-expert
    reason: SEO element validation requires SEO domain knowledge
  - skill: playwright-e2e-tester
    reason: Playwright is the primary engine for visual regression and smoke tests
  - skill: site-reliability-engineer
    reason: Production monitoring complements production validation
---

# QA Automation Specialist

Production validation specialist. Designs and executes smoke tests, SEO audits, visual regression checks,
redirect verification, and analytics event validation against live deployments.

## Activation Triggers

**Use this skill when:**
- A deployment just landed and you need to verify it works in production
- You need to validate redirect chains, broken links, or asset loading
- SEO elements need auditing (meta tags, structured data, sitemap, robots.txt)
- Visual regression testing is required (screenshot comparison between deploys)
- Analytics events (PostHog, GA4, Segment) need verification after changes
- Acceptance criteria need validation against a running environment
- You are building a smoke test suite for a deployment pipeline

**Do NOT use this skill for:**
- Writing unit or integration tests (use test-automation-expert)
- Performance/load testing (use site-reliability-engineer)
- Security scanning (use security-auditor)
- Building the feature itself (use the appropriate feature skill)

## Core Capabilities

### 1. Production Smoke Tests

Design smoke tests that validate critical user journeys after deployment:

```typescript
// smoke-test.spec.ts — Playwright-based production smoke suite
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.SMOKE_URL || 'https://yoursite.com';

test.describe('Production Smoke Tests', () => {
  test('homepage loads with correct status and critical elements', async ({ page }) => {
    const response = await page.goto(BASE_URL);
    expect(response?.status()).toBe(200);

    // Core content renders
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // No console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('critical API endpoints respond', async ({ request }) => {
    const endpoints = ['/api/health', '/api/status'];
    for (const endpoint of endpoints) {
      const resp = await request.get(`${BASE_URL}${endpoint}`);
      expect(resp.ok(), `${endpoint} returned ${resp.status()}`).toBeTruthy();
    }
  });

  test('authentication flow works end-to-end', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Use a dedicated smoke-test account, never production credentials
    await page.getByLabel('Email').fill(process.env.SMOKE_USER!);
    await page.getByLabel('Password').fill(process.env.SMOKE_PASS!);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

**Smoke test design principles:**
- Test user journeys, not implementation details
- Keep the suite under 2 minutes total runtime
- Use dedicated smoke-test accounts with minimal permissions
- Every smoke test must have a clear pass/fail signal — no ambiguity
- Run on every deployment, gate rollback on failure

### 2. Redirect Chain & Link Validation

```bash
#!/bin/bash
# validate-redirects.sh — Check redirect chains and broken links
set -euo pipefail

SITE_URL="${1:?Usage: validate-redirects.sh <base-url>}"
ERRORS=0

# Check redirect chains (max 2 hops allowed)
check_redirect() {
  local url="$1"
  local expected_final="$2"
  local hops
  hops=$(curl -sL -o /dev/null -w '%{num_redirects}' "$url")
  local final
  final=$(curl -sL -o /dev/null -w '%{url_effective}' "$url")

  if [ "$hops" -gt 2 ]; then
    echo "WARN: $url has $hops redirects (max 2)"
    ((ERRORS++))
  fi
  if [ "$final" != "$expected_final" ]; then
    echo "FAIL: $url -> $final (expected $expected_final)"
    ((ERRORS++))
  fi
}

# Check for broken internal links
check_links() {
  local url="$1"
  # Extract href values, filter to same-origin, check each
  curl -s "$url" | grep -oP 'href="\K[^"]+' | grep "^/" | sort -u | while read -r path; do
    local status
    status=$(curl -s -o /dev/null -w '%{http_code}' "${SITE_URL}${path}")
    if [ "$status" -ge 400 ]; then
      echo "BROKEN: ${path} -> HTTP ${status}"
      ((ERRORS++))
    fi
  done
}

# Check asset loading (CSS, JS, images)
check_assets() {
  local url="$1"
  curl -s "$url" | grep -oP '(src|href)="\K[^"]+' | grep -E '\.(css|js|png|jpg|svg|woff2?)' | while read -r asset; do
    local full_url
    [[ "$asset" == http* ]] && full_url="$asset" || full_url="${SITE_URL}${asset}"
    local status
    status=$(curl -s -o /dev/null -w '%{http_code}' "$full_url")
    if [ "$status" -ge 400 ]; then
      echo "MISSING ASSET: ${asset} -> HTTP ${status}"
      ((ERRORS++))
    fi
  done
}

echo "=== Redirect Validation ==="
check_redirect "${SITE_URL}/old-path" "${SITE_URL}/new-path"

echo "=== Link Validation ==="
check_links "${SITE_URL}"

echo "=== Asset Validation ==="
check_assets "${SITE_URL}"

exit $ERRORS
```

### 3. SEO Element Validation

```typescript
// seo-audit.spec.ts
import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.SMOKE_URL || 'https://yoursite.com';

async function auditSEO(page: Page, url: string) {
  await page.goto(url);

  // Title tag
  const title = await page.title();
  expect(title.length, 'Title should be 30-60 chars').toBeGreaterThanOrEqual(30);
  expect(title.length, 'Title should be 30-60 chars').toBeLessThanOrEqual(60);

  // Meta description
  const metaDesc = await page.getAttribute('meta[name="description"]', 'content');
  expect(metaDesc, 'Meta description must exist').toBeTruthy();
  expect(metaDesc!.length, 'Meta desc should be 120-160 chars').toBeGreaterThanOrEqual(120);
  expect(metaDesc!.length, 'Meta desc should be 120-160 chars').toBeLessThanOrEqual(160);

  // Open Graph
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  const ogDesc = await page.getAttribute('meta[property="og:description"]', 'content');
  const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
  expect(ogTitle, 'og:title must exist').toBeTruthy();
  expect(ogDesc, 'og:description must exist').toBeTruthy();
  expect(ogImage, 'og:image must exist').toBeTruthy();

  // Canonical URL
  const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
  expect(canonical, 'Canonical URL must exist').toBeTruthy();
  expect(canonical, 'Canonical must be absolute').toMatch(/^https?:\/\//);

  // Heading hierarchy
  const h1Count = await page.locator('h1').count();
  expect(h1Count, 'Exactly one H1 per page').toBe(1);

  // Image alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt, 'All images must have alt text').toBe(0);

  return { title, metaDesc, ogTitle, canonical };
}

test.describe('SEO Audit', () => {
  test('homepage SEO elements', async ({ page }) => {
    await auditSEO(page, BASE_URL);
  });

  test('sitemap.xml is valid', async ({ request }) => {
    const resp = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(resp.ok()).toBeTruthy();
    const body = await resp.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('<loc>');
    // Every loc should be reachable
    const locs = body.match(/<loc>([^<]+)<\/loc>/g) || [];
    expect(locs.length, 'Sitemap should have entries').toBeGreaterThan(0);
  });

  test('robots.txt is valid', async ({ request }) => {
    const resp = await request.get(`${BASE_URL}/robots.txt`);
    expect(resp.ok()).toBeTruthy();
    const body = await resp.text();
    expect(body).toContain('User-agent:');
    expect(body).toContain('Sitemap:');
    // Should not disallow critical paths
    expect(body).not.toMatch(/Disallow: \/$/m);
  });

  test('structured data is valid JSON-LD', async ({ page }) => {
    await page.goto(BASE_URL);
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length, 'At least one JSON-LD block').toBeGreaterThan(0);
    for (const block of jsonLd) {
      const parsed = JSON.parse(block);
      expect(parsed['@context']).toContain('schema.org');
      expect(parsed['@type']).toBeTruthy();
    }
  });
});
```

### 4. Visual Regression Testing

```typescript
// visual-regression.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.SMOKE_URL || 'https://yoursite.com';

// Pages to capture for visual regression
const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'pricing', path: '/pricing' },
  { name: 'blog-index', path: '/blog' },
  { name: 'docs', path: '/docs' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

for (const pageConfig of PAGES) {
  for (const viewport of VIEWPORTS) {
    test(`visual: ${pageConfig.name} @ ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${BASE_URL}${pageConfig.path}`);
      await page.waitForLoadState('networkidle');

      // Hide dynamic content that changes between runs
      await page.evaluate(() => {
        document.querySelectorAll('[data-testid="timestamp"], .live-counter')
          .forEach(el => (el as HTMLElement).style.visibility = 'hidden');
      });

      await expect(page).toHaveScreenshot(
        `${pageConfig.name}-${viewport.name}.png`,
        { maxDiffPixelRatio: 0.01, fullPage: true }
      );
    });
  }
}
```

**Visual regression workflow:**
1. First run generates baseline screenshots (commit to repo or artifact store)
2. Subsequent runs compare against baselines
3. Threshold: 1% pixel difference tolerance for anti-aliasing/rendering variance
4. Mask dynamic content (timestamps, counters, avatars) before capture
5. Review failures manually -- not all pixel changes are bugs

### 5. Analytics Event Validation

```typescript
// analytics-validation.spec.ts
import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.SMOKE_URL || 'https://yoursite.com';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
}

async function captureAnalyticsEvents(page: Page): Promise<AnalyticsEvent[]> {
  const events: AnalyticsEvent[] = [];

  // Intercept PostHog capture calls
  await page.route('**/e/?ip=1', async (route) => {
    const postData = route.request().postDataJSON();
    if (postData?.batch) {
      for (const item of postData.batch) {
        events.push({ event: item.event, properties: item.properties });
      }
    }
    await route.fulfill({ status: 200, body: '1' });
  });

  return events;
}

test.describe('Analytics Event Validation', () => {
  test('page view fires on navigation', async ({ page }) => {
    const events = await captureAnalyticsEvents(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000); // Allow batch to flush

    const pageViews = events.filter(e => e.event === '$pageview');
    expect(pageViews.length).toBeGreaterThanOrEqual(1);
    expect(pageViews[0].properties).toHaveProperty('$current_url');
  });

  test('CTA click fires custom event', async ({ page }) => {
    const events = await captureAnalyticsEvents(page);
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: /get started/i }).click();
    await page.waitForTimeout(2000);

    const ctaEvents = events.filter(e => e.event === 'cta_clicked');
    expect(ctaEvents.length).toBeGreaterThanOrEqual(1);
    expect(ctaEvents[0].properties).toHaveProperty('cta_location');
  });

  test('no duplicate event IDs in a single session', async ({ page }) => {
    const events = await captureAnalyticsEvents(page);
    await page.goto(BASE_URL);
    await page.goto(`${BASE_URL}/pricing`);
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForTimeout(2000);

    const ids = events.map(e => e.properties?.['$insert_id']).filter(Boolean);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size, 'No duplicate event IDs').toBe(ids.length);
  });
});
```

## Decision Points

### When to run smoke tests vs. full regression

| Signal | Action |
|--------|--------|
| Hotfix deploy (1-2 files changed) | Smoke tests only (critical paths) |
| Feature deploy (new page/route) | Smoke + SEO audit for new routes |
| CSS/design system change | Smoke + full visual regression |
| Analytics config change | Smoke + analytics event validation |
| Infrastructure change (CDN, DNS) | Smoke + redirect chain + asset loading |
| Full release | Everything |

### When to block deployment vs. alert

- **Block**: Broken critical paths (login, checkout, core API), missing assets, 5xx errors
- **Alert**: SEO regressions, minor visual diffs, missing analytics events, slow load times
- **Log only**: Cosmetic differences under threshold, deprecation warnings

## Anti-Patterns

### 1. Testing against mocked production
**Symptom**: Smoke tests hit a staging environment and call it "production validation"
**Why wrong**: Staging hides DNS issues, CDN caching, environment variable differences, and database state
**Fix**: Run smoke tests against the actual production URL, with a dedicated smoke-test account

### 2. Flaky selectors in smoke tests
**Symptom**: Tests break on every deploy because they target CSS classes or DOM structure
**Fix**: Use accessible selectors (`getByRole`, `getByLabel`, `data-testid`) that survive refactors

### 3. Screenshot comparison without masking
**Symptom**: Visual regression tests fail on every run due to timestamps, avatars, or ad content
**Fix**: Mask dynamic regions before screenshot capture. Use `data-testid` to identify volatile elements.

### 4. Validating analytics by checking the dashboard
**Symptom**: "I'll check PostHog tomorrow to see if events came through"
**Fix**: Intercept network requests in tests and validate event shape and presence in real time

### 5. One enormous smoke test file
**Symptom**: A single 500-line test file that tests everything and takes 10 minutes
**Fix**: Separate by concern (smoke, SEO, visual, analytics). Run them in parallel. Gate on smoke, alert on the rest.

### 6. Hardcoded URLs and credentials
**Symptom**: `const url = 'https://mysite.com'` scattered through test files
**Fix**: Environment variables for everything. Never commit credentials. Use a `.env.smoke` file.

### 7. Ignoring HTTP cache headers
**Symptom**: Tests pass but users see stale content because cache headers are wrong
**Fix**: Validate `Cache-Control`, `ETag`, and `Last-Modified` headers on critical assets

## Quality Checklist

- [ ] Smoke test suite covers all critical user journeys (login, core feature, payment if applicable)
- [ ] Smoke suite completes in under 2 minutes
- [ ] Redirect chain validation covers all known legacy URLs
- [ ] No broken internal links on key pages
- [ ] All critical assets load (CSS, JS, fonts, images)
- [ ] SEO elements present and within length guidelines on all indexed pages
- [ ] Structured data (JSON-LD) is valid and contains required fields
- [ ] sitemap.xml is reachable and contains current URLs
- [ ] robots.txt does not block critical paths
- [ ] Visual regression baselines are up to date
- [ ] Analytics events fire correctly for tracked interactions
- [ ] No duplicate analytics event IDs within a session
- [ ] Smoke test accounts use minimal permissions (not admin)
- [ ] All test configuration is via environment variables (no hardcoded secrets)
- [ ] Tests run in CI on every deploy and gate rollback on critical failures
