---
license: Apache-2.0
name: accessibility-automation-expert
description: 'Implement WCAG 2.2 AA/AAA compliance with automated testing, keyboard navigation, screen reader support, and focus management. Activate on: accessibility audit, WCAG compliance, keyboard navigation, screen reader, aria attributes, axe-core, focus trap. NOT for: design-level accessibility review (use design-accessibility-auditor), color contrast only (use css-in-js-architect).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Code Quality & Testing
tags:
  - accessibility
  - wcag
  - aria
  - keyboard-navigation
  - screen-readers
pairs-with:
  - skill: design-accessibility-auditor
    reason: Design audit identifies issues; this skill implements the fixes and automation
  - skill: error-boundary-strategist
    reason: Error states must be announced to screen readers via live regions
---

# Accessibility Automation Expert

Implement and enforce WCAG 2.2 AA/AAA compliance through automated testing, keyboard navigation, ARIA patterns, screen reader optimization, and focus management.

## Activation Triggers

**Activate on**: accessibility audit failures, WCAG compliance requirements, keyboard navigation broken, screen reader not announcing content, `axe-core` violations, focus trap for modals/dialogs, `aria-*` attribute questions, skip navigation links.

**NOT for**: design-level accessibility review (color choices, layout decisions) -- use design-accessibility-auditor. Pure color contrast checking -- use css-in-js-architect with OKLCH.

## Quick Start

1. **Run axe-core** -- `npx @axe-core/cli http://localhost:3000` or integrate `@axe-core/react` in dev mode for console warnings.
2. **Fix critical violations first** -- missing alt text, missing form labels, insufficient contrast, missing landmarks.
3. **Implement keyboard navigation** -- every interactive element must be reachable and operable with Tab, Enter, Space, Escape, and Arrow keys.
4. **Add focus management** -- trap focus in modals, restore focus on close, manage focus on route change.
5. **Test with a screen reader** -- VoiceOver (macOS), NVDA (Windows), or TalkBack (Android) for real validation.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Automated Testing | axe-core, Lighthouse, `jest-axe`, Playwright axe | CI/CD accessibility gates |
| Keyboard Navigation | `tabindex`, `onKeyDown`, roving tabindex | Arrow key navigation, focus groups |
| Screen Readers | ARIA roles, live regions, `aria-label` | Announcements, state changes, descriptions |
| Focus Management | `focus-visible`, focus trap, `inert` attribute | Modal focus lock, skip links, route change focus |
| Semantic HTML | `<main>`, `<nav>`, `<article>`, `<aside>` | Landmarks, heading hierarchy, lists |
| Forms | `<label>`, `aria-describedby`, `aria-invalid` | Error announcement, required fields, fieldsets |

## Architecture Patterns

### Pattern 1: Automated axe-core in CI

```typescript
// e2e/accessibility.spec.ts (Playwright + axe-core)
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/products', '/checkout', '/account'];

for (const path of pages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])  // WCAG 2.2 AA
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
```

```typescript
// Dev mode: axe-core in React (shows violations in console)
// app/layout.tsx
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

### Pattern 2: Focus Management for Modals

```typescript
import { useEffect, useRef, useCallback } from 'react';

function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save current focus to restore later
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first focusable element
    const container = containerRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    // Trap focus within container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Use inert on background content
    const mainContent = document.querySelector('main');
    mainContent?.setAttribute('inert', '');

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      mainContent?.removeAttribute('inert');
      previousFocusRef.current?.focus(); // restore focus
    };
  }, [isOpen]);

  return containerRef;
}
```

### Pattern 3: ARIA Live Regions for Dynamic Content

```typescript
// Announce form errors, loading states, and updates to screen readers
function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const el = document.getElementById(`aria-live-${priority}`);
    if (el) {
      el.textContent = '';  // Clear first to trigger re-announcement
      requestAnimationFrame(() => { el.textContent = message; });
    }
  }, []);

  return announce;
}

// Mount once in layout:
function AriaLiveRegions() {
  return (
    <>
      <div id="aria-live-polite" aria-live="polite" aria-atomic="true" className="sr-only" />
      <div id="aria-live-assertive" aria-live="assertive" aria-atomic="true" className="sr-only" />
    </>
  );
}
```

```
  ┌─ Accessibility Testing Pyramid ────────────────────┐
  │                                                     │
  │          ▲  Manual Screen Reader Testing            │
  │         ╱ ╲  (VoiceOver, NVDA — quarterly)         │
  │        ╱───╲                                        │
  │       ╱     ╲  Playwright + axe-core E2E           │
  │      ╱  E2E  ╲  (every page, CI gate)              │
  │     ╱─────────╲                                     │
  │    ╱           ╲  jest-axe Component Tests          │
  │   ╱  Component  ╲  (per interactive component)     │
  │  ╱───────────────╲                                  │
  │ ╱                 ╲  ESLint jsx-a11y                │
  │╱    Static Lint    ╲  (on every commit)             │
  │╲___________________╱                                │
  └─────────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **`div` with `onClick` instead of `button`** -- divs have no keyboard interaction, no role, and no focus. Use semantic `<button>` or `<a>` elements. If you must use a div, add `role="button"`, `tabindex="0"`, and `onKeyDown` for Enter/Space.
2. **`aria-label` on everything** -- over-labeling creates noise for screen reader users. Prefer visible text labels; use `aria-label` only when visible text is impossible.
3. **Hiding focus outlines** -- `outline: none` with no replacement makes keyboard navigation invisible. Use `:focus-visible` for keyboard-only focus indicators that do not appear on mouse click.
4. **Missing skip navigation link** -- keyboard users must tab through the entire nav on every page. Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>` as the first focusable element.
5. **Toast notifications without live regions** -- screen readers cannot detect dynamically added toasts. Use `aria-live="polite"` regions to announce them.

## Quality Checklist

- [ ] axe-core CI gate passes with zero violations on all pages
- [ ] `eslint-plugin-jsx-a11y` enabled with no warnings
- [ ] All images have descriptive `alt` text (or `alt=""` for decorative images)
- [ ] All form inputs have associated `<label>` elements (not just placeholder text)
- [ ] Heading hierarchy is sequential (`h1` > `h2` > `h3`, no skipping)
- [ ] Page landmarks present: `<main>`, `<nav>`, `<header>`, `<footer>`
- [ ] Skip navigation link is the first focusable element
- [ ] Focus visible on all interactive elements (`:focus-visible` styles defined)
- [ ] Modals trap focus and restore focus on close
- [ ] Dynamic content changes announced via `aria-live` regions
- [ ] Color contrast ratios meet WCAG AA (4.5:1 normal text, 3:1 large text)
- [ ] All functionality operable with keyboard only (Tab, Enter, Space, Escape, Arrow keys)
