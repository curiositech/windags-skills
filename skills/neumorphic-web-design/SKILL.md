---
license: Apache-2.0
name: neumorphic-web-design
description: Soft UI / neumorphism design — tactile interfaces using paired light and dark box-shadows on matching-background elements. Covers the shadow math, color generation, accessibility fixes for low contrast, inset/extruded states, dark mode adaptation, and when neumorphism works vs when it fails. Activate on 'neumorphism', 'soft UI', 'soft shadows', 'neumorph', 'tactile UI', 'extruded buttons', 'inset cards', 'skeumorphic shadows'. NOT for hard shadows / brutalism (use neobrutalist-web-designer), not for glassmorphism / frosted glass (use vaporwave-glassomorphic-ui-designer).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - neumorphism
    - soft-ui
    - shadows
    - tactile
    - accessibility
    - css
    - design-trend
  pairs-with:
    - skill: color-contrast-auditor
      reason: Neumorphism's low contrast is its biggest accessibility risk
    - skill: dark-mode-design-expert
      reason: Neumorphic shadows require complete recalculation for dark backgrounds
    - skill: native-app-designer
      reason: Neumorphism mimics physical surfaces — natural fit for native app feel
category: Design & Creative
tags:
  - neumorphism
  - web-design
  - soft-ui
  - shadows
  - aesthetic
---

# Neumorphic Web Design

Creates soft, tactile web interfaces using the neumorphism aesthetic — elements that appear to extrude from or sink into the background surface, like buttons molded from clay. The effect relies on paired directional shadows (one light, one dark) on elements whose background color matches the parent surface.

Neumorphism is the **opposite** of neobrutalism. Where neobrutalism is hard, opaque, and high-contrast, neumorphism is soft, subtle, and monochromatic. It is beautiful when done right and an accessibility disaster when done wrong. This skill covers both.

## When to Use

**Use for:**
- Music players, media controls, and audio interfaces
- Dashboard widgets and data displays (non-critical)
- Settings panels with toggles and sliders
- Personal portfolios seeking a premium, tactile feel
- Fitness/wellness apps where softness aligns with brand
- Smart home control panels
- Any UI where the interaction model is "physical" (dials, knobs, switches)

**Do NOT use for:**
- Hard shadows / brutalist aesthetic → use **neobrutalist-web-designer**
- Glassmorphism / frosted glass / blur → use **vaporwave-glassomorphic-ui-designer**
- Primary CTAs and conversion-critical buttons (too subtle)
- Data-dense enterprise dashboards (legibility issues at scale)
- Text-heavy content sites (blogs, documentation)
- E-commerce checkout flows (critical-path accessibility)

---

## The Shadow Model

### How Neumorphism Works

Every neumorphic element uses **two box-shadows**: a light highlight (simulating light source) and a dark shadow (simulating depth). The light source is conventionally **top-left**.

```
Light source: ↖ top-left

     LIGHT shadow               DARK shadow
     (negative offset,          (positive offset,
      white/lighter)             darker shade)
         ↗                           ↘
    ┌──────────┐
    │          │
    │  ELEMENT │
    │          │
    └──────────┘
```

**The Critical Rule:** The element's background color MUST closely match (or exactly match) the parent container's background. Neumorphism breaks visually when element and background colors diverge.

### The Shadow Formula

```css
/* Base neumorphic surface */
:root {
  --nm-bg: #e0e5ec;              /* The shared background color */
  --nm-light: #ffffff;           /* Highlight shadow color */
  --nm-dark: #a3b1c6;           /* Depth shadow color */
  --nm-distance: 8px;           /* Shadow offset distance */
  --nm-blur: 16px;              /* Shadow blur radius (2x distance) */
  --nm-spread: 0px;             /* Shadow spread (usually 0) */
  --nm-intensity: 1;            /* 0-1 opacity multiplier */
}
```

**Generating shadow colors from any background:**

| Step | Formula | Example (bg: #e0e5ec) |
|------|---------|----------------------|
| Light shadow | Lighten background by 15-25% | #ffffff (clamped) |
| Dark shadow | Darken background by 15-25% | #a3b1c6 |
| Blur radius | 2x the offset distance | 16px for 8px offset |

**SCSS/JS Color Generation:**
```scss
// SCSS function to generate neumorphic shadow colors
@function nm-light($bg, $amount: 20%) {
  @return lighten($bg, $amount);
}

@function nm-dark($bg, $amount: 20%) {
  @return darken($bg, $amount);
}

// Usage
$nm-bg: #e0e5ec;
$nm-shadow-light: nm-light($nm-bg);  // #ffffff (clamped)
$nm-shadow-dark: nm-dark($nm-bg);    // #a3b1c6
```

```js
// JavaScript color generation
function neumorphicShadows(hexBg, amount = 40) {
  const r = parseInt(hexBg.slice(1, 3), 16);
  const g = parseInt(hexBg.slice(3, 5), 16);
  const b = parseInt(hexBg.slice(5, 7), 16);

  const light = `rgb(${Math.min(r + amount, 255)}, ${Math.min(g + amount, 255)}, ${Math.min(b + amount, 255)})`;
  const dark = `rgb(${Math.max(r - amount, 0)}, ${Math.max(g - amount, 0)}, ${Math.max(b - amount, 0)})`;

  return { light, dark };
}
```

---

## Core Component Recipes

### Raised Element (Extruded)

The default neumorphic state — element appears to push out from the surface.

```css
.nm-raised {
  background: var(--nm-bg);
  border-radius: 12px;
  box-shadow:
    calc(var(--nm-distance) * -1) calc(var(--nm-distance) * -1) var(--nm-blur) var(--nm-light),
    var(--nm-distance) var(--nm-distance) var(--nm-blur) var(--nm-dark);
}

/* Concrete values */
.nm-raised-concrete {
  background: #e0e5ec;
  border-radius: 12px;
  box-shadow:
    -8px -8px 16px #ffffff,
     8px  8px 16px #a3b1c6;
}
```

### Inset Element (Pressed)

Element appears sunk into the surface — used for active states, input fields, wells.

```css
.nm-inset {
  background: var(--nm-bg);
  border-radius: 12px;
  box-shadow:
    inset calc(var(--nm-distance) * -1) calc(var(--nm-distance) * -1) var(--nm-blur) var(--nm-light),
    inset var(--nm-distance) var(--nm-distance) var(--nm-blur) var(--nm-dark);
}

/* Concrete values */
.nm-inset-concrete {
  background: #e0e5ec;
  border-radius: 12px;
  box-shadow:
    inset -8px -8px 16px #ffffff,
    inset  8px  8px 16px #a3b1c6;
}
```

### Interactive Button (Raised → Pressed)

```css
.nm-button {
  background: var(--nm-bg);
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;

  /* Raised state */
  box-shadow:
    -6px -6px 12px var(--nm-light),
     6px  6px 12px var(--nm-dark);
}

.nm-button:hover {
  box-shadow:
    -8px -8px 16px var(--nm-light),
     8px  8px 16px var(--nm-dark);
}

.nm-button:active {
  /* Transition to inset on press */
  box-shadow:
    inset -4px -4px 8px var(--nm-light),
    inset  4px  4px 8px var(--nm-dark);
  transform: scale(0.98);
}

.nm-button:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 3px;
}
```

### Toggle Switch

```css
.nm-toggle {
  width: 56px;
  height: 28px;
  border-radius: 14px;
  background: var(--nm-bg);
  position: relative;
  cursor: pointer;

  /* Inset track */
  box-shadow:
    inset -3px -3px 6px var(--nm-light),
    inset  3px  3px 6px var(--nm-dark);
}

.nm-toggle__knob {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--nm-bg);
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* Raised knob */
  box-shadow:
    -2px -2px 4px var(--nm-light),
     2px  2px 4px var(--nm-dark);
}

.nm-toggle[aria-checked="true"] .nm-toggle__knob {
  transform: translateX(28px);
}

/* Active state tint for accessibility */
.nm-toggle[aria-checked="true"] {
  background: color-mix(in srgb, var(--nm-bg) 85%, var(--accent-primary));
}
```

### Card

```css
.nm-card {
  background: var(--nm-bg);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow:
    -8px -8px 20px var(--nm-light),
     8px  8px 20px var(--nm-dark);
}

.nm-card__header {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);  /* MUST meet 4.5:1 contrast */
}

.nm-card__divider {
  height: 1px;
  background: var(--nm-dark);
  opacity: 0.3;
  margin: 1rem 0;
}
```

### Input Field

```css
.nm-input {
  background: var(--nm-bg);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  width: 100%;

  /* Inset well for inputs */
  box-shadow:
    inset -3px -3px 6px var(--nm-light),
    inset  3px  3px 6px var(--nm-dark);
}

.nm-input:focus {
  outline: none;
  box-shadow:
    inset -3px -3px 6px var(--nm-light),
    inset  3px  3px 6px var(--nm-dark),
    0 0 0 2px var(--accent-primary);  /* Visible focus ring */
}

.nm-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}
```

### Circular Control (Dial/Knob)

```css
.nm-dial {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--nm-bg);
  display: grid;
  place-items: center;
  box-shadow:
    -6px -6px 14px var(--nm-light),
     6px  6px 14px var(--nm-dark);
}

.nm-dial__indicator {
  width: 4px;
  height: 20px;
  background: var(--accent-primary);
  border-radius: 2px;
  transform-origin: center 20px;
}
```

---

## Accessibility Fixes — The Critical Section

Neumorphism's original sin was low contrast. Here is how to fix it without losing the aesthetic.

### Problem 1: Text Contrast

**Failure:** Light gray text on a light gray background — common in early neumorphism.

**Fix:** Use high-contrast text colors. The soft shadows provide the aesthetic; the text provides the information.

```css
:root {
  /* Neumorphic bg is light gray — text must be near-black */
  --text-primary: #2d3748;     /* 7.2:1 contrast on #e0e5ec */
  --text-secondary: #4a5568;   /* 5.1:1 contrast on #e0e5ec */
  --text-muted: #718096;       /* 3.8:1 — large text only (18px+) */
}
```

### Problem 2: Element Boundary Perception

**Failure:** Users (especially with low vision) cannot distinguish neumorphic elements from the background.

**Fix — Subtle Border Enhancement:**
```css
.nm-raised-accessible {
  background: var(--nm-bg);
  border-radius: 12px;
  /* Standard neumorphic shadows */
  box-shadow:
    -8px -8px 16px var(--nm-light),
     8px  8px 16px var(--nm-dark);
  /* ADD: subtle border for perceivability */
  border: 1px solid rgba(0, 0, 0, 0.06);
}
```

### Problem 3: Interactive State Clarity

**Failure:** Buttons look identical to decorative elements. No clear affordance.

**Fix — Multi-Signal Interaction:**
```css
.nm-button-accessible {
  /* Standard neumorphic raised style */
  box-shadow:
    -6px -6px 12px var(--nm-light),
     6px  6px 12px var(--nm-dark);

  /* ADD: text color contrast for affordance */
  color: var(--accent-primary);
  font-weight: 600;

  /* ADD: subtle border on interactive elements */
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.nm-button-accessible:hover {
  /* Intensify shadows AND add color hint */
  box-shadow:
    -8px -8px 16px var(--nm-light),
     8px  8px 16px var(--nm-dark);
  background: color-mix(in srgb, var(--nm-bg) 95%, var(--accent-primary));
}
```

### Problem 4: Focus Visibility

**Failure:** Default focus outlines clash with or disappear against soft shadows.

**Fix:**
```css
.nm-interactive:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 3px;
  /* Keep neumorphic shadows — focus ring sits outside */
}
```

### WCAG Compliance Checklist for Neumorphism

| Criterion | Requirement | Fix |
|-----------|-------------|-----|
| 1.4.3 Contrast (Min) | 4.5:1 text contrast | Dark text on light surface |
| 1.4.11 Non-Text Contrast | 3:1 for UI components | Add subtle borders to interactive elements |
| 2.4.7 Focus Visible | Visible focus indicator | 2px solid accent outline |
| 1.4.1 Use of Color | Not color-only distinction | Combine shadow + border + text weight |

---

## Dark Mode Neumorphism

Dark mode requires completely recalculated shadows — you cannot simply invert.

```css
/* Dark mode palette */
:root[data-theme="dark"] {
  --nm-bg: #2d3748;
  --nm-light: #3a4a5e;        /* Lighter shade of bg */
  --nm-dark: #1a202c;         /* Darker shade of bg */
  --text-primary: #e2e8f0;    /* High contrast light text */
  --text-secondary: #a0aec0;
  --accent-primary: #63b3ed;
}

/* Dark shadows are more subtle — reduce distance */
:root[data-theme="dark"] {
  --nm-distance: 6px;
  --nm-blur: 12px;
}
```

**Dark Mode Differences:**

| Property | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Background | `#e0e5ec` | `#2d3748` |
| Light shadow | White / near-white | Slightly lighter bg shade |
| Dark shadow | Medium-dark gray | Near-black |
| Shadow distance | 8px | 6px (subtler) |
| Shadow contrast | High | Lower (dark surfaces absorb) |
| Text color | Near-black | Near-white |

---

## Neumorphism 2.0 — The Modern Evolution

Pure neumorphism (2020-era) had problems. Neumorphism 2.0 (2024-2026) retains the soft aesthetic while fixing usability:

1. **Hybrid approach** — Combine neumorphic surfaces with flat, high-contrast CTAs
2. **Selective application** — Use neumorphism for ambient/decorative elements, flat design for critical actions
3. **Increased contrast** — Darker shadows, more visible borders
4. **Color accents** — Subtle tints on interactive states (not purely monochromatic)
5. **Micro-interactions** — Shadow depth responds to interaction, reinforcing affordance

```css
/* Neumorphism 2.0: soft card + flat CTA */
.nm2-card {
  background: var(--nm-bg);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow:
    -6px -6px 14px var(--nm-light),
     6px  6px 14px var(--nm-dark);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* CTA inside a neumorphic card is FLAT, not neumorphic */
.nm2-card .cta-button {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);  /* Standard shadow, NOT neumorphic */
  cursor: pointer;
}
```

---

## When Neumorphism Fails — Decision Framework

| Scenario | Verdict | Reason |
|----------|---------|--------|
| Music player controls | Works well | Tactile, few elements, playful |
| Smart home dashboard | Works well | Physical metaphor matches |
| Settings page with toggles | Works well | Toggle/switch is natural fit |
| E-commerce product cards | Risky | CTA buttons need clear affordance |
| Data-dense tables | Fails | Too many elements, contrast needed |
| Form-heavy checkout | Fails | Input fields need clear boundaries |
| Text-heavy blog | Fails | Shadows distract from reading |
| Accessibility-critical (gov) | Fails | Cannot reliably meet WCAG AA |

---

## CSS Custom Properties Template

```css
:root {
  /* Surface */
  --nm-bg: #e0e5ec;

  /* Shadows */
  --nm-light: #ffffff;
  --nm-dark: #a3b1c6;
  --nm-distance: 8px;
  --nm-blur: 16px;

  /* Derived shadows (use in box-shadow shorthand) */
  --nm-shadow-raised:
    calc(var(--nm-distance) * -1) calc(var(--nm-distance) * -1) var(--nm-blur) var(--nm-light),
    var(--nm-distance) var(--nm-distance) var(--nm-blur) var(--nm-dark);
  --nm-shadow-inset:
    inset calc(var(--nm-distance) * -1) calc(var(--nm-distance) * -1) var(--nm-blur) var(--nm-light),
    inset var(--nm-distance) var(--nm-distance) var(--nm-blur) var(--nm-dark);

  /* Text (high contrast) */
  --nm-text-primary: #2d3748;
  --nm-text-secondary: #4a5568;

  /* Accent */
  --nm-accent: #6366f1;

  /* Border (accessibility enhancement) */
  --nm-border: rgba(0, 0, 0, 0.06);

  /* Transitions */
  --nm-transition: box-shadow 0.15s ease, transform 0.15s ease;

  /* Border radius scale */
  --nm-radius-sm: 8px;
  --nm-radius-md: 12px;
  --nm-radius-lg: 16px;
  --nm-radius-full: 9999px;
}
```

---

## Anti-Patterns

### Anti-Pattern: Background Color Mismatch
Element background differs from parent surface. The shadows create a visible rectangle instead of an extruded form. **Every neumorphic element must match its parent's background color.**

### Anti-Pattern: Neumorphic CTAs on Critical Paths
"Sign Up" or "Buy Now" buttons styled as subtle neumorphic raised surfaces. Users do not perceive them as clickable. **Use flat, high-contrast buttons for primary actions.**

### Anti-Pattern: Stacking Neumorphic Surfaces
A neumorphic card inside a neumorphic panel inside a neumorphic section. The compounding shadows create visual mud. **One level of neumorphic depth per view. Use inset for sub-elements.**

### Anti-Pattern: Pure Monochrome Everything
Gray text on gray background with gray shadows. Looks elegant in Dribbble shots, fails in practice. **At minimum: near-black text, an accent color for interactive states, and subtle borders on interactive elements.**

### Anti-Pattern: Sharp Corners
Neumorphism with `border-radius: 0` looks wrong because real physical objects have softened edges. **Minimum border-radius: 8px. Circular for knobs and toggles.**

### Anti-Pattern: Missing Prefers-Reduced-Motion
Shadow transitions cause issues for motion-sensitive users.
```css
@media (prefers-reduced-motion: reduce) {
  .nm-button {
    transition: none;
  }
}
```

---

## Tools

- [neumorphism.io](https://neumorphism.io/) — Visual generator for neumorphic CSS shadows
- [Hype4 Neumorphism Generator](https://hype4.academy/tools/neumorphism-generator) — Alternative generator with more options
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — Verify text contrast on neumorphic surfaces
- Figma plugins: "Neumorphic" by Yash Kumar — generates neumorphic styles in Figma

---

## Quality Checklist

- [ ] Element background matches parent surface background
- [ ] Both light AND dark shadows present with correct directionality
- [ ] Text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Interactive elements have subtle border for boundary perception
- [ ] Focus-visible outlines present on all interactive elements
- [ ] Primary CTAs use flat design, not neumorphism
- [ ] Dark mode shadows fully recalculated (not inverted)
- [ ] No more than one level of neumorphic depth per view
- [ ] Border-radius >= 8px on all neumorphic surfaces
- [ ] prefers-reduced-motion respected

---

## Sources

Design research based on:
- [CSS-Tricks: Neumorphism and CSS](https://css-tricks.com/neumorphism-and-css/)
- [neumorphism.io — CSS shadow generator](https://neumorphism.io/)
- [Refine: Neumorphism with CSS](https://refine.dev/blog/neumorphic-css/)
- [Big Human: What Is Neumorphism? A Complete 2026 Guide](https://www.bighuman.com/blog/neumorphism)
- [DesignRush: Neumorphism in Web Design — Strategic Guide 2026](https://www.designrush.com/best-designs/websites/trends/neumorphism-website)
- [Webbb.ai: Neumorphism in 2026: Is It Here to Stay?](https://www.webbb.ai/blog/neumorphism-in-2026-is-it-here-to-stay)
- [CC Creative: Neumorphism vs Glassmorphism vs Neubrutalism](https://www.cccreative.design/blogs/differences-in-ui-design-trends-neumorphism-glassmorphism-and-neubrutalism)
