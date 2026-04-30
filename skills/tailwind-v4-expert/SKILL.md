---
name: Tailwind v4 Expert
description: 'Use when migrating Tailwind v3 to v4, configuring CSS-first @theme tokens, debugging Oxide engine errors, dealing with the absence of tailwind.config.js, container queries (@container) usage, layer cascade problems, or "dynamic class names not generating". Triggers: switching from `@tailwind base` to `@import "tailwindcss"`, RSC/Next.js streaming + CSS ordering, dark-mode strategy choices, custom variants via @variant, content-scanning glob tuning. NOT for Tailwind v3 (different config model), CSS-in-JS frameworks, vanilla CSS architecture (BEM/SMACSS), or react-native styling.'
category: Frontend & UI
tags:
  - tailwind
  - css
  - design-tokens
  - oxide
  - container-queries
  - frontend
---

# Tailwind v4 Expert

Tailwind v4 is a different tool than v3. The PostCSS-based JIT engine is gone, replaced by Oxide (Rust). The JS config file is gone, replaced by CSS-first `@theme` blocks. Plugins from v3 mostly need rewriting. If you're migrating, expect to rebuild — not patch — your config layer.

## When to use

- Migrating a v3 project (look for `@tailwind base; @tailwind components; @tailwind utilities;`).
- Need design tokens (colors, fonts, breakpoints) consumed by both Tailwind and raw CSS.
- Container queries — designing components that adapt to their container, not the viewport.
- Custom variants beyond what v4 ships (`@variant focus-within-sibling`, etc.).
- Dynamic class names disappearing from the build (Oxide can't see what isn't statically present).
- RSC + streaming + Tailwind ordering bugs.

## Core capabilities

### The v4 import model

```css
/* app/globals.css */
@import "tailwindcss";

/* Optional: scan files outside the default content roots. */
@source "../../packages/ui/src/**/*.{ts,tsx}";
@source "../../node_modules/@my-org/icons/dist/**/*.js";
```

There is no `tailwind.config.js`. There is no `content` array. `@source` adds globs to the default scan root (the file's dir + project conventions). Oxide statically scans these for class strings.

### `@theme` — design tokens are CSS now

```css
@theme {
  --color-brand-50:  oklch(97% 0.02 250);
  --color-brand-500: oklch(60% 0.18 250);
  --color-brand-900: oklch(20% 0.10 250);

  --font-display: "Söhne", "Inter", sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --breakpoint-3xl: 120rem;

  --spacing-128: 32rem;
}
```

These tokens generate utilities (`text-brand-500`, `font-display`, `3xl:`, `w-128`) AND are accessible as `var(--color-brand-500)` in raw CSS. One source of truth.

Namespaces that auto-generate utilities:

| Token prefix | Generates |
|--------------|-----------|
| `--color-*` | `text-*`, `bg-*`, `border-*`, `outline-*`, etc. |
| `--font-*` | `font-*` |
| `--text-*` | `text-*` (font-size; pair with `--text-*--line-height`) |
| `--spacing-*` | `m-*`, `p-*`, `w-*`, `h-*`, `gap-*`, etc. |
| `--breakpoint-*` | `sm:`, `md:`, `lg:`… variants |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |

### `@layer` cascade

```css
@layer base {
  body { @apply font-sans text-zinc-900; }
}

@layer components {
  .btn { @apply rounded-lg px-4 py-2 font-semibold; }
}

/* Custom layer between components and utilities */
@layer my-overrides {
  .prose img { border-radius: var(--radius-lg); }
}
```

Layers cascade: base → components → utilities → arbitrary user layers. Tailwind defines its own at `@layer base, components, utilities;` automatically; you rarely need to redeclare them.

### Custom variants

```css
@variant pointer (@media (pointer: fine));
@variant hocus (&:hover, &:focus-visible);
@variant aria-current (&[aria-current="page"]);
```

Then: `<a class="text-zinc-500 hocus:text-brand-500 aria-current:text-brand-700">`.

### Container queries

```html
<aside class="@container">
  <article class="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3">
```

Named containers if the same element has nested ones:

```html
<main class="@container/main">
  <aside class="@container/sidebar">
    <div class="@md/sidebar:hidden @lg/main:block">
```

Container query breakpoints come from `--container-*` tokens (separate namespace from `--breakpoint-*`).

### Dark mode

Three strategies; pick one:

```css
/* 1. System preference only — easiest, no JS. */
@variant dark (@media (prefers-color-scheme: dark));

/* 2. Class-based — supports manual toggle. */
@variant dark (&:where(.dark, .dark *));

/* 3. data-attribute — same idea, semantic. */
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

Then theme-shift colors via `light-dark()` or via separate token blocks:

```css
@theme {
  --color-bg: oklch(99% 0 0);
}

@layer base {
  :where(.dark) {
    --color-bg: oklch(15% 0 0);
  }
}
```

### Next.js App Router specifics

- Put `@import "tailwindcss"` and `@theme` in `app/globals.css`.
- Import that file once in `app/layout.tsx`.
- For RSC streaming, ensure the CSS link is in `<head>` (Next does this automatically when imported from layout).
- Server Components can use Tailwind classes directly; no client boundary needed.
- If you ship a workspace `@my-org/ui` package, add `@source "../../packages/ui/**/*.{ts,tsx}"` to your globals so Oxide scans it.

## Anti-patterns

### Dynamic class names that Oxide can't see

**Symptom:** `text-${color}-500` works in dev, missing in production.
**Diagnosis:** Oxide is a static scanner — it sees string literals, not template strings.
**Fix:** Map the dynamic value to a literal class:
```ts
const variants = { primary: 'bg-brand-500', danger: 'bg-red-500' } as const;
<button class={variants[kind]} />
```
Or use CSS variables for the dynamic part: `style={{ '--accent': color }} class="bg-[--accent]"`.

### Migrating but keeping `tailwind.config.js`

**Symptom:** v4 builds, but custom theme tokens don't appear; warnings about unknown directives.
**Diagnosis:** v4 ignores tailwind.config.js. The presence of one suggests an incomplete migration.
**Fix:** Move `theme.extend` values into `@theme`, plugins into `@variant`/CSS, content into `@source`. Delete the file. Run `npx @tailwindcss/upgrade@latest` for an automated first pass.

### `@apply` for everything

**Symptom:** CSS bundle bigger than v3, "components" file is 2000 lines of `@apply`.
**Diagnosis:** Each `@apply` inlines utilities; deeply-applied components don't dedupe well.
**Fix:** Apply once at the component boundary; compose via class strings (`clsx`/`cva`) for variants.

### Forgetting `@source` for files outside the project root

**Symptom:** UI library shipped from a sibling workspace — its classes don't appear in production CSS.
**Diagnosis:** Default scan covers the project's own files. Workspace deps need explicit `@source`.
**Fix:** `@source "../../packages/ui/src/**/*.{ts,tsx}"` (relative to the CSS file, not the project root).

### PurgeCSS-style mental model

**Symptom:** Engineers add classes to a "safelist" that doesn't exist.
**Diagnosis:** v4 doesn't purge — it generates. There's no allowlist; if the class isn't in a scanned file, it doesn't exist.
**Fix:** Use a stub component or comment that contains the literal classes:
```ts
// Tailwind safelist (do not delete): bg-red-500 bg-green-500 bg-blue-500
const STATUS_COLORS = { error: 'bg-red-500', ok: 'bg-green-500', info: 'bg-blue-500' };
```

### v3 plugins copy-pasted into v4

**Symptom:** `Plugin "tailwindcss/typography" failed to load.`
**Diagnosis:** v4's plugin API is incompatible with most v3 plugins.
**Fix:** Use the v4-native plugin (`@tailwindcss/typography` v0.6+ for v4), or rewrite the plugin's effects with `@variant` / `@layer components` / custom utilities.

## Quality gates

- [ ] No template-literal class strings without an explicit safelist or CSS-variable fallback.
- [ ] `tailwind.config.js` deleted (or absent from a fresh project).
- [ ] Every workspace dep with Tailwind classes has an `@source` glob.
- [ ] Dark-mode strategy documented in one place; not scattered across components.
- [ ] CSS bundle <50KB gzipped for a typical app; <30KB for a marketing page.
- [ ] Container queries used wherever a component is reused at different widths (cards, sidebars).
- [ ] Theme tokens accessible from raw CSS (`var(--color-brand-500)`) and from utilities.

## NOT for

- **Tailwind v3** — different config model, different engine.
- **CSS-in-JS** (Emotion, styled-components) — pair with css-in-js-architect skill.
- **Vanilla CSS architecture** (BEM, SMACSS, ITCSS) — different paradigm.
- **React Native** — Tailwind variants for RN exist but have different constraints.
- **CSS modules / vanilla-extract** — competing solutions.
