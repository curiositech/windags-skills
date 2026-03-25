---
license: Apache-2.0
name: css-in-js-architect
description: "Architect scalable styling systems with Tailwind v4, CSS Modules, design tokens, dynamic theming, and container queries. Activate on: design tokens, theming system, Tailwind config, CSS architecture, container queries, dark mode. NOT for: component library creation (use design-system-creator), animation systems (use animation-system-architect)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - tailwind
  - css-modules
  - design-tokens
  - theming
  - container-queries
pairs-with:
  - skill: design-system-creator
    reason: Design systems consume the token and theming architecture this skill creates
  - skill: responsive-layout-master
    reason: Layout and styling architecture must be coordinated
---

# CSS-in-JS Architect

Build scalable, maintainable styling architectures with Tailwind v4, CSS Modules, design tokens, and modern CSS features like container queries and dynamic theming.

## Decision Points

### Architecture Choice Matrix

**IF** you need global utility classes + rapid prototyping:
- **THEN** use Tailwind v4 with `@theme` directive
- **CRITERIA**: High component reuse, atomic styling preferred, team familiar with utilities

**IF** you need component-scoped styles + CSS expertise:
- **THEN** use CSS Modules with design token imports
- **CRITERIA**: Complex component styling, name collision concerns, traditional CSS workflow

**IF** you have mixed requirements:
- **THEN** use Tailwind for layout/spacing + CSS Modules for complex components
- **CRITERIA**: Best of both worlds, different teams have different preferences

### Token Implementation Decision Tree

```
Is this a multi-brand/white-label app?
├── YES → CSS custom properties with theme switching
│   ├── Static themes known at build? → @theme overrides
│   └── Dynamic themes from API? → Runtime CSS property updates
└── NO → Single theme
    ├── Need dark mode? → CSS custom properties with prefers-color-scheme
    └── Single theme only → Hardcoded values in @theme acceptable
```

### Container vs Viewport Query Decision

**IF** component layout depends on its container size:
- **THEN** use `@container` queries with `container-type: inline-size`
- **EXAMPLE**: Card layouts, sidebar components, dashboard widgets

**IF** layout depends on device/viewport characteristics:
- **THEN** use viewport media queries
- **EXAMPLE**: App shell, navigation patterns, typography scaling

## Failure Modes

### 1. Dark Mode Flash (FOUC)
**Symptoms**: White flash before dark theme loads, theme "jumps" on page load
**Detection Rule**: If you see a brief light background before dark mode applies, you have FOUC
**Diagnosis**: Theme detection/application happens after initial render
**Fix**: 
```html
<script>
  // Inline script in <head> - runs before render
  const theme = localStorage.getItem('theme') || 'system';
  if (theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
</script>
```

### 2. Token Cascade Conflict
**Symptoms**: Some components don't respect theme changes, inconsistent colors across components
**Detection Rule**: If `getComputedStyle` shows different token values in different components, you have cascade issues
**Diagnosis**: CSS specificity or custom property inheritance broken
**Fix**: Ensure tokens defined at `:root` level, avoid overriding custom properties in component scopes

### 3. SSR Hydration Mismatch
**Symptoms**: Console warnings about hydration mismatches, flickering on client-side hydration
**Detection Rule**: If React dev tools shows hydration warnings with theme-dependent content, you have mismatches
**Diagnosis**: Server renders default theme, client renders user's saved theme
**Fix**: Use `suppressHydrationWarning` on theme-dependent elements or defer theme application until after hydration

### 4. Container Query Cascade Hell
**Symptoms**: Container queries not triggering, unexpected breakpoint behavior
**Detection Rule**: If container queries work in isolation but fail when nested, you have cascade issues
**Diagnosis**: Missing `container-type` or conflicting container contexts
**Fix**: Explicitly set `container-type: inline-size` on every container query parent

### 5. Bundle Size Bloat
**Symptoms**: Large CSS bundles, unused Tailwind utilities in production
**Detection Rule**: If bundle analysis shows >100KB CSS or unused class warnings, you have bloat
**Diagnosis**: Missing or incorrect PurgeCSS/content configuration
**Fix**: Configure Tailwind v4 content detection properly, use CSS Modules for one-off styles

## Worked Examples

### Complete Theme Architecture Setup

**Scenario**: E-commerce app needs light/dark modes with brand customization

**Step 1: Define token structure**
```css
/* tokens.css */
:root {
  /* Brand tokens - consistent across themes */
  --brand-primary: oklch(0.55 0.18 250);
  --brand-secondary: oklch(0.45 0.12 180);
  
  /* Semantic tokens - theme-dependent */
  --surface-primary: oklch(0.99 0 0);
  --surface-raised: oklch(0.96 0 0);
  --text-primary: oklch(0.15 0 0);
  --text-secondary: oklch(0.40 0 0);
  --border-subtle: oklch(0.88 0 0);
}

[data-theme='dark'] {
  --surface-primary: oklch(0.13 0.01 260);
  --surface-raised: oklch(0.18 0.01 260);
  --text-primary: oklch(0.93 0 0);
  --text-secondary: oklch(0.70 0 0);
  --border-subtle: oklch(0.25 0.01 260);
}
```

**Decision Point Hit**: Need both utilities and component styles
**Expert Catches**: Using OKLCH for perceptual uniformity, semantic naming separates brand from surface colors
**Novice Misses**: Would use RGB/hex values, mix semantic and brand tokens

**Step 2: Configure Tailwind v4**
```css
/* app.css */
@import 'tailwindcss';

@theme {
  --color-surface-primary: var(--surface-primary);
  --color-surface-raised: var(--surface-raised);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-brand-primary: var(--brand-primary);
}
```

**Decision Point Hit**: Utility classes for layout, CSS Modules for complex styling
**Expert Catches**: Referencing CSS custom properties in @theme, maintaining single source of truth
**Novice Misses**: Would duplicate token values in @theme instead of referencing

**Step 3: Component implementation**
```tsx
// ProductCard.tsx
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  return (
    <article className={styles.container}>
      <div className="bg-surface-raised p-4 rounded-lg border border-border-subtle">
        <img className={styles.image} src={product.image} />
        <div className="space-y-2">
          <h3 className="text-text-primary font-semibold">{product.name}</h3>
          <p className="text-text-secondary">{product.description}</p>
          <button className="bg-brand-primary text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
```

**Result**: Theme switching works instantly, no runtime CSS generation, fully responsive with container queries

## Quality Gates

- [ ] All colors defined using OKLCH color space for perceptual uniformity
- [ ] Theme switching completes in <16ms (one frame) with no FOUC
- [ ] CSS bundle size under 50KB after compression for typical app
- [ ] All interactive elements have 3:1 contrast ratio minimum in all themes
- [ ] No hardcoded color/spacing values outside token definitions
- [ ] Container queries used for component-intrinsic responsive behavior
- [ ] Zero hydration mismatches in SSR environments
- [ ] Token naming follows semantic/brand separation (not color names)
- [ ] Dark mode respects `prefers-color-scheme` when no explicit preference set
- [ ] All spacing uses consistent scale (no arbitrary px values in components)

## Not-For Boundaries

**Do NOT use this skill for:**
- **Component library architecture** → Use `design-system-creator` instead (handles API design, versioning, documentation)
- **Animation systems** → Use `animation-system-architect` instead (motion design, performance optimization)
- **Layout grid systems** → Use `responsive-layout-master` instead (complex grid arrangements, breakpoint strategy)
- **Performance optimization** → Delegate CSS bundle analysis and optimization to performance specialists
- **Complex CSS animations** → This skill handles static styling architecture, not motion design

**Delegate to other skills when:**
- Building reusable component APIs → `design-system-creator`
- Implementing complex animations → `animation-system-architect`
- Designing responsive layouts → `responsive-layout-master`
- Optimizing runtime performance → Performance optimization specialists