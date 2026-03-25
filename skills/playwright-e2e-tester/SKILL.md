---
license: Apache-2.0
name: playwright-e2e-tester
version: 1.0.0
category: Code Quality & Testing
tags:
  - e2e
  - playwright
  - testing
  - automation
  - ci-cd
  - cross-browser
---

# Playwright E2E Tester

## Overview

Expert in end-to-end testing with Playwright, the modern cross-browser testing framework. Specializes in test generation, page object patterns, visual regression testing, and CI/CD integration. Handles complex testing scenarios including authentication flows, API mocking, and mobile emulation.

## When to Use

- Setting up Playwright in a new or existing project
- Writing E2E tests for critical user flows
- Debugging flaky tests or test failures
- Implementing visual regression testing
- Configuring Playwright for CI/CD pipelines
- Migrating from Cypress, Selenium, or Puppeteer

## Decision Points

### Locator Strategy Selection
```
Is element semantic (button, heading, form control)?
├─ YES → Use role-based locators (getByRole, getByLabel)
│   └─ Expected to change frequently?
│       ├─ NO → Stop here (most stable)
│       └─ YES → Add getByTestId as backup
└─ NO → Is element purely presentational?
    ├─ YES → Use getByTestId (add data-testid attribute)
    │   └─ Can't modify markup?
    │       └─ Use CSS selector (last resort, document fragility)
    └─ NO → Use getByText for content-based selection
```

### Wait Strategy Decision
```
Action type:
├─ Navigation (page.goto, click link) → Use waitForURL()
├─ Element appears/disappears → Use waitForSelector() or visibility assertions
├─ API response affects UI → Use waitForResponse() then element assertion
├─ Animation/transition → Use waitForFunction() with custom condition
└─ Network request completion → Use page.route() with route.fulfill()
```

### Test Organization
```
Test complexity:
├─ Single page interaction → Inline test with direct selectors
├─ Multi-step flow → Use Page Object Model pattern
├─ Cross-page workflow → Use fixtures for shared state
└─ Multi-app integration → Use projects with different configs
```

## Failure Modes

### Stale Element Reference
**Symptoms**: `Error: Element is not attached to the DOM`
**Detection Rule**: If you see detachment errors during dynamic content updates
**Fix**: Replace element variables with fresh locator calls:
```typescript
// BAD: Storing element reference
const button = page.locator('button');
await button.click(); // May fail if DOM updated

// GOOD: Fresh locator each time
await page.locator('button').click();
```

### Timeout Hell
**Symptoms**: Tests fail with "Timeout exceeded" in CI but pass locally
**Detection Rule**: If tests have inconsistent CI failures with 30s+ timeouts
**Fix**: Implement explicit waits with proper conditions:
```typescript
// BAD: Blind timeout increase
await page.waitForTimeout(5000);

// GOOD: Wait for specific condition
await page.waitForSelector('[data-testid="loading"]', { state: 'hidden' });
await expect(page.locator('[data-testid="results"]')).toBeVisible();
```

### Race Condition Rapids
**Symptoms**: Intermittent failures where elements "aren't ready yet"
**Detection Rule**: If test flakiness correlates with slow network/CPU
**Fix**: Chain waits to ensure proper sequencing:
```typescript
// BAD: Assuming immediate availability
await page.click('#submit');
await page.fill('#new-field', 'value'); // May fail

// GOOD: Wait for UI state transition
await page.click('#submit');
await page.waitForSelector('#new-field:not([disabled])');
await page.fill('#new-field', 'value');
```

### Selector Fragility Syndrome
**Symptoms**: Tests break when CSS classes or DOM structure changes
**Detection Rule**: If tests fail after frontend refactoring without feature changes
**Fix**: Migrate to semantic locators:
```typescript
// BAD: Structural dependency
await page.click('.header > .nav > .item:nth-child(3)');

// GOOD: Semantic meaning
await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
```

### Screenshot Drift Disease
**Symptoms**: Visual regression tests fail due to minor rendering differences
**Detection Rule**: If screenshot tests fail in CI with <5% pixel differences
**Fix**: Configure appropriate tolerances and masks:
```typescript
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixelRatio: 0.01,
  mask: [page.locator('[data-testid="dynamic-timestamp"]')],
  animations: 'disabled'
});
```

## Worked Examples

### Authentication Flow Test Implementation

**Scenario**: Test user login with error handling and success validation

**Expert Approach**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should handle complete login flow', async ({ page }) => {
    // Decision: Use Page Object for multi-step flow
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    
    // Decision: Test error state first (negative case)
    await loginPage.signIn('invalid@email.com', 'wrongpass');
    
    // Wait strategy: Error message should appear
    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
    
    // Decision: Clear state before positive test
    await loginPage.clearForm();
    
    // Decision: Use valid test data
    await loginPage.signIn('user@example.com', 'validpass');
    
    // Wait strategy: Navigation indicates success
    await page.waitForURL('/dashboard');
    
    // Verification: Check authenticated state
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Welcome back, John')).toBeVisible();
  });
});

class LoginPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/login');
    // Wait for form to be interactive
    await this.page.waitForSelector('form[data-testid="login-form"]');
  }
  
  async signIn(email: string, password: string) {
    // Decision: Use semantic locators
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
  
  async clearForm() {
    await this.page.getByLabel('Email').clear();
    await this.page.getByLabel('Password').clear();
  }
}
```

**Novice would miss**: Error state testing, proper wait strategies, form state management
**Expert catches**: Complete flow coverage, semantic locators, defensive waits

## Quality Gates

Test implementation checklist:
- [ ] All user interactions use semantic locators (getByRole, getByLabel, getByText)
- [ ] No hard waits (page.waitForTimeout) - only conditional waits
- [ ] Error states and edge cases are tested, not just happy path
- [ ] Tests pass consistently in CI (5+ consecutive runs without flakes)
- [ ] Each test is independent and can run in any order
- [ ] Page Object Model used for multi-step flows (3+ interactions)
- [ ] Visual regression tests have appropriate tolerance thresholds (<2% pixel diff)
- [ ] API mocking implemented for external dependencies
- [ ] Authentication state properly managed via fixtures
- [ ] Test coverage includes critical user journeys (login, checkout, etc.)

## NOT-FOR Boundaries

**Don't use this skill for**:
- Unit testing individual functions → Use `vitest-testing-patterns` instead
- API contract testing → Use `api-architect` for endpoint validation
- Performance testing → Use dedicated load testing tools like k6
- Security penetration testing → Use specialized security testing tools
- Cross-browser compatibility issues → Use browser-specific debugging tools

**Delegate to other skills**:
- For CI/CD pipeline setup → Use `github-actions-pipeline-builder`
- For accessibility auditing → Use `accessibility-auditor`
- For component testing → Use `vitest-testing-patterns`