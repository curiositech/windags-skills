---
license: Apache-2.0
name: responsive-layout-master
description: "Build responsive layouts with CSS Grid, container queries, fluid typography, clamp(), and mobile-first design. Activate on: responsive design, CSS Grid layout, fluid spacing, container queries, mobile-first, breakpoints. NOT for: styling/theming (use css-in-js-architect), animation layout changes (use animation-system-architect)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - responsive-design
  - css-grid
  - container-queries
  - fluid-typography
  - mobile-first
pairs-with:
  - skill: web-design-expert
    reason: Layout execution follows design intent for responsive breakpoints
  - skill: css-in-js-architect
    reason: Responsive layout coordinates with token-based spacing and theming
---

# Responsive Layout Master

Build fluid, responsive layouts using CSS Grid, container queries, `clamp()`, and mobile-first design that adapt from 320px phones to 4K displays without breakpoint jank.

## Activation Triggers

**Activate on**: responsive layout implementation, CSS Grid complex layouts, `clamp()` fluid sizing, container queries for component responsiveness, mobile-first breakpoint strategy, "layout breaks at X width", sidebar/content/aside patterns.

**NOT for**: theming/tokens/colors -- use css-in-js-architect. Animating layout changes -- use animation-system-architect. Component library grid systems -- use design-system-creator.

## Quick Start

1. **Start mobile-first** -- write base styles for 320px, then add complexity with `min-width` media queries.
2. **Use CSS Grid for page layout** -- `grid-template-areas` for the main shell (header, sidebar, content, footer).
3. **Use `clamp()` for fluid sizing** -- `clamp(1rem, 0.5rem + 1.5vw, 2rem)` smoothly scales between min and max.
4. **Apply container queries** -- components that live in variable-width containers (sidebars, modals) should use `@container` instead of `@media`.
5. **Test at all widths** -- drag the browser from 320px to 2560px; there should be no "broken" widths.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Page Layout | CSS Grid, `grid-template-areas` | Named areas, auto-fill, minmax() |
| Component Layout | Flexbox, CSS Grid | Intrinsic sizing, gap, align/justify |
| Fluid Sizing | `clamp()`, `min()`, `max()`, viewport units | Smooth scaling without breakpoints |
| Container Queries | `@container`, `container-type` | Component-intrinsic responsiveness |
| Fluid Typography | `clamp()` on `font-size`, `line-height` | Readable text at every viewport width |
| Breakpoint Strategy | Mobile-first `min-width`, Tailwind `sm:md:lg:` | Additive complexity approach |

## Architecture Patterns

### Pattern 1: CSS Grid Page Shell

```css
.app-shell {
  display: grid;
  min-height: 100dvh;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
}

@media (min-width: 768px) {
  .app-shell {
    grid-template-areas:
      "header  header"
      "sidebar main"
      "footer  footer";
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr auto;
  }
}

@media (min-width: 1280px) {
  .app-shell {
    grid-template-areas:
      "header  header  header"
      "sidebar main   aside"
      "footer  footer  footer";
    grid-template-columns: 280px 1fr 320px;
  }
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

```
  320px (mobile)        768px (tablet)        1280px+ (desktop)
  ┌──────────────┐     ┌───────────────────┐  ┌──────────────────────┐
  │   header     │     │     header        │  │       header         │
  ├──────────────┤     ├──────┬────────────┤  ├──────┬────────┬──────┤
  │              │     │ side │            │  │ side │        │ aside│
  │    main      │     │ bar  │   main     │  │ bar  │  main  │      │
  │              │     │      │            │  │      │        │      │
  ├──────────────┤     ├──────┴────────────┤  ├──────┴────────┴──────┤
  │   footer     │     │     footer        │  │       footer         │
  └──────────────┘     └───────────────────┘  └──────────────────────┘
```

### Pattern 2: Fluid Typography System

```css
:root {
  /* Fluid type scale: min @ 320px → max @ 1280px */
  --text-sm:   clamp(0.8rem,   0.74rem + 0.3vw,   0.875rem);
  --text-base: clamp(1rem,     0.9rem  + 0.5vw,   1.125rem);
  --text-lg:   clamp(1.125rem, 0.95rem + 0.85vw,  1.5rem);
  --text-xl:   clamp(1.25rem,  0.9rem  + 1.7vw,   2rem);
  --text-2xl:  clamp(1.5rem,   0.8rem  + 3.3vw,   3rem);
  --text-3xl:  clamp(2rem,     0.7rem  + 5vw,     4rem);

  /* Fluid spacing */
  --space-sm:  clamp(0.5rem,  0.3rem + 1vw,  1rem);
  --space-md:  clamp(1rem,    0.5rem + 2vw,  2rem);
  --space-lg:  clamp(1.5rem,  0.5rem + 4vw,  4rem);
  --space-xl:  clamp(2rem,    0.5rem + 6vw,  6rem);
}

body { font-size: var(--text-base); }
h1   { font-size: var(--text-3xl); }
h2   { font-size: var(--text-2xl); }
h3   { font-size: var(--text-xl); }
```

### Pattern 3: Auto-Fill Grid for Card Layouts

```css
/* Cards auto-fill available space: minimum 280px, expand to fill */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: var(--space-md);
}
```

This single rule handles 1-column (mobile), 2-column (tablet), 3-column (desktop), and 4-column (wide) without any media queries.

## Anti-Patterns

1. **Max-width media queries (desktop-first)** -- `@media (max-width: 768px)` leads to overriding desktop styles for mobile. Use `min-width` (mobile-first) so complexity is added, not subtracted.
2. **Fixed pixel breakpoints without fluid behavior** -- layout jumps from 1-column to 3-column with no transition. Use `clamp()` and `auto-fill`/`auto-fit` for smooth adaptation.
3. **`100vw` causing horizontal scroll** -- `100vw` includes the scrollbar width. Use `100%` or `100dvw` for the content area width.
4. **Viewport media queries for components in variable containers** -- a card in a sidebar is 300px wide even on a 1920px screen. Use `@container` queries for component-level responsiveness.
5. **Hardcoded heights** -- `height: 600px` on a container overflows on small screens. Use `min-height` or let content determine height.

## Quality Checklist

- [ ] Layout works from 320px to 2560px with no horizontal scroll
- [ ] Mobile-first approach (base styles = mobile, `min-width` media queries add complexity)
- [ ] Fluid typography uses `clamp()` for smooth scaling (no text size jumps)
- [ ] Fluid spacing uses `clamp()` for padding/margins/gaps
- [ ] `grid-template-areas` used for main page shell (readable and maintainable)
- [ ] Card/grid layouts use `auto-fill`/`minmax()` (no hardcoded column counts)
- [ ] Components in variable-width containers use `@container` queries
- [ ] No `100vw` that could cause horizontal scrollbar overflow
- [ ] `min-height: 100dvh` used instead of `100vh` (mobile browser chrome safe)
- [ ] Touch targets are 44x44px minimum on mobile (WCAG 2.2 Target Size)
- [ ] Layout tested at 320, 375, 768, 1024, 1280, 1920px widths
