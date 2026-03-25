---
license: Apache-2.0
name: design-system-bootstrap
description: Guides the practical path from 'we have no design system' or 'we have a mess' to a real, functional design system. Component inventory, design token extraction, headless UI adoption (Radix, React Aria, Headless UI), migration order of operations, and the assessment-to-rollout pipeline. Activate on 'design system from scratch', 'bootstrap design system', 'no design system', 'design system migration', 'headless UI adoption', 'component audit', 'design token extraction', 'design system strategy'. NOT for building specific components once a system exists (use design-system-creator), not for generating token files/configs (use design-system-generator).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - design-system
    - migration
    - headless-ui
    - radix
    - react-aria
    - design-tokens
    - component-audit
    - architecture
  pairs-with:
    - skill: design-system-creator
      reason: Creator builds the components after Bootstrap establishes the strategy
    - skill: design-system-generator
      reason: Generator outputs token files and configs that Bootstrap defines
    - skill: design-accessibility-auditor
      reason: Accessibility audit is step 1 of any design system bootstrap
category: Design & Creative
tags:
  - design-system
  - bootstrap
  - tokens
  - components
  - foundation
---

# Design System Bootstrap

The practical guide to going from "we have nothing" (or "we have a mess") to a functional design system. This is not about building a component library from scratch in isolation — it is about assessing what exists, extracting what works, choosing the right foundations, and migrating incrementally without breaking production.

## When to Use

**Use for:**
- Greenfield projects that need a design system from day one
- Existing apps with inconsistent styling and no shared components
- Migration from one component library to another (e.g., MUI to Radix)
- Extracting a design system from a mature but unsystematic codebase
- Deciding between headless UI libraries (Radix, React Aria, Headless UI, Ark UI)
- Establishing design tokens for the first time
- Planning the rollout order so the team sees value fast

**Do NOT use for:**
- Building specific components within an established system → use **design-system-creator**
- Generating token config files, Tailwind themes, or Figma exports → use **design-system-generator**
- Accessibility-specific audits → use **design-accessibility-auditor**
- Full brand/visual design direction → use **web-design-expert**

---

## Phase 0: Assessment (Day 1-3)

Before building anything, understand what you have.

### Component Inventory

Run a systematic audit of every UI component in the codebase.

**Automated Discovery:**
```bash
# Find all component files
find src -name "*.tsx" -o -name "*.jsx" | \
  xargs grep -l "export.*function\|export.*const.*=" | \
  sort

# Find all CSS/styling approaches in use
find src -name "*.css" -o -name "*.scss" -o -name "*.module.css" | wc -l
grep -r "styled(" src --include="*.tsx" -l | wc -l     # styled-components
grep -r "className=" src --include="*.tsx" -l | wc -l   # CSS classes
grep -r "sx={{" src --include="*.tsx" -l | wc -l         # MUI sx prop
grep -r "css=" src --include="*.tsx" -l | wc -l          # Emotion css prop
```

**Manual Inventory Spreadsheet:**

| Component | Variants Found | Files | Styling Method | Accessible? | Notes |
|-----------|---------------|-------|---------------|-------------|-------|
| Button | 7 different styles | 12 files | Mixed CSS + inline | Partial | 3 lack focus states |
| Modal | 3 implementations | 5 files | styled-components | No | No trap focus, no ESC close |
| Input | 4 styles | 8 files | CSS modules | Partial | Inconsistent validation |
| Dropdown | 2 custom, 1 library | 4 files | Mixed | No | No keyboard nav |

### Token Extraction

Extract the implicit design decisions already embedded in the codebase.

**Color Extraction:**
```bash
# Find all hex colors in use
grep -roh '#[0-9a-fA-F]\{3,8\}' src --include="*.tsx" --include="*.css" | \
  sort | uniq -c | sort -rn | head -30

# Find all rgb/rgba/hsl values
grep -roP 'rgba?\([^)]+\)|hsla?\([^)]+\)' src --include="*.tsx" --include="*.css" | \
  sort | uniq -c | sort -rn | head -20
```

**Spacing Extraction:**
```bash
# Find padding/margin values
grep -roP '(padding|margin|gap):\s*[^;]+' src --include="*.css" | \
  sort | uniq -c | sort -rn | head -20

# Tailwind spacing classes in use
grep -roP '(p|m|gap|space)-[a-z0-9\[\]]+' src --include="*.tsx" | \
  sort | uniq -c | sort -rn | head -30
```

**Typography Extraction:**
```bash
# Font sizes
grep -roP 'font-size:\s*[^;]+' src --include="*.css" | \
  sort | uniq -c | sort -rn

# Font families
grep -roP "font-family:\s*[^;]+" src --include="*.css" | \
  sort | uniq -c | sort -rn
```

### Scoring the Mess

Rate your current state (1-5) on each dimension:

| Dimension | 1 (Crisis) | 3 (Manageable) | 5 (Solid) |
|-----------|-----------|----------------|-----------|
| Consistency | Every component styled differently | Some shared patterns | Unified visual language |
| Accessibility | No ARIA, no keyboard nav | Partial, inconsistent | Full WCAG AA compliance |
| Token usage | Hardcoded values everywhere | Some CSS variables | Full token system |
| Component reuse | Copy-paste culture | Some shared components | Single-source library |
| Documentation | None | README per component | Full Storybook |

**Score 5-10:** You are in emergency mode. Start with tokens + one component.
**Score 11-18:** You have something to work with. Systematic migration possible.
**Score 19-25:** You need polish, not a rewrite.

---

## Phase 1: Foundations (Week 1-2)

### Design Tokens First

Tokens are the foundation everything else builds on. Define them before touching components.

**Minimum Viable Token Set:**

```css
:root {
  /* Colors — semantic, not descriptive */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-text-inverse: #ffffff;

  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;

  --color-border-default: #e5e7eb;
  --color-border-strong: #d1d5db;

  --color-accent-primary: #6366f1;
  --color-accent-primary-hover: #4f46e5;

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Spacing — constraint scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);

  /* Transitions */
  --transition-fast: 0.1s ease;
  --transition-default: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

**Tailwind Config Equivalent:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
```

---

## Phase 2: Headless UI Selection (Week 2)

This is the highest-leverage decision. Choose wrong, and you rewrite everything later.

### Comparison Matrix (2025-2026)

| Criteria | Radix UI | React Aria | Headless UI | Ark UI | Base UI (MUI) |
|----------|----------|------------|-------------|--------|---------------|
| Component count | 28 | 43 | 10 | 30+ | 20+ |
| API style | Compound components | Hooks + Components | Compound components | Compound components | Hooks |
| Accessibility | Very good | Best-in-class | Good | Very good | Good |
| Styling freedom | Full (unstyled) | Full (unstyled) | Full (unstyled) | Full (unstyled) | Full (unstyled) |
| React Server Comp. | Partial | Yes | Partial | Yes | Partial |
| Animation support | data-state attrs | Built-in transitions | Transition component | data-state attrs | Minimal |
| Bundle size (Dialog) | ~8KB | ~12KB | ~5KB | ~10KB | ~7KB |
| Ecosystem | shadcn/ui, Radix Themes | Adobe Spectrum | Tailwind ecosystem | Panda CSS | Joy UI |
| Documentation | Excellent | Very good | Good | Good | Good |
| Framework support | React only | React only | React + Vue | React + Vue + Solid | React only |

### Decision Framework

```
Do you need Vue/Solid support?
├── Yes → Ark UI or Headless UI
└── No → Continue
    │
    Do you need maximum accessibility (gov, enterprise, WCAG AAA)?
    ├── Yes → React Aria
    │         (strictest ARIA implementation, Adobe-backed)
    └── No → Continue
        │
        Do you want the largest pre-built ecosystem (shadcn/ui)?
        ├── Yes → Radix UI
        │         (shadcn/ui is built on Radix, largest component community)
        └── No → Continue
            │
            Do you need the fewest dependencies possible?
            ├── Yes → Headless UI (smallest, Tailwind team)
            └── No → Radix UI (safe default, best DX)
```

### The shadcn/ui Question

shadcn/ui is not a library — it is a collection of copy-paste components built on Radix + Tailwind. It deserves special consideration:

**Pros:**
- You own the code (no version lock)
- Beautiful defaults out of the box
- Massive community (components, themes, blocks)
- CLI: `npx shadcn-ui@latest add button dialog dropdown-menu`

**Cons:**
- Tied to Radix (if you outgrow it, you rewrite)
- Tailwind-only (if you use CSS Modules or styled-components, you cannot use it)
- Updates are manual (copy-paste means no `npm update`)

**Verdict:** If you are starting from zero with React + Tailwind, shadcn/ui is the fastest path to a functional design system. You can customize everything later because you own the source.

```bash
# Bootstrap shadcn/ui into an existing project
npx shadcn-ui@latest init

# Add components as needed
npx shadcn-ui@latest add button input card dialog dropdown-menu \
  tabs tooltip popover command separator badge
```

---

## Phase 3: Component Priority Order (Week 2-4)

Do NOT build all components at once. Follow this priority order based on usage frequency and impact.

### Tier 1: Ship This Week (Highest Impact)

| Component | Why First | Headless Primitive |
|-----------|----------|-------------------|
| Button | Used everywhere, most inconsistency | None needed (semantic HTML) |
| Input + Label | Every form, biggest a11y gap | React Aria: useTextField |
| Dialog/Modal | High visibility, hardest to get right | Radix: Dialog, React Aria: useDialog |
| Dropdown Menu | Navigation, actions, context menus | Radix: DropdownMenu |

### Tier 2: Ship Next Week

| Component | Why | Headless Primitive |
|-----------|-----|-------------------|
| Select | Form-critical, notoriously hard | Radix: Select, React Aria: useSelect |
| Tabs | Layout organization | Radix: Tabs |
| Toast/Notification | Feedback system, often inconsistent | Radix: Toast |
| Card | Content container, used everywhere | None needed (styled div) |

### Tier 3: Ship in 2 Weeks

| Component | Why | Headless Primitive |
|-----------|-----|-------------------|
| Tooltip | Contextual help | Radix: Tooltip |
| Popover | Rich contextual content | Radix: Popover |
| Toggle/Switch | Settings, preferences | Radix: Switch |
| Checkbox + Radio | Form elements | Radix: Checkbox, RadioGroup |
| Accordion | Content disclosure | Radix: Accordion |

### Tier 4: Ship When Needed

Badge, Avatar, Separator, Slider, Progress, Skeleton, Command Palette, Date Picker, Combobox.

---

## Phase 4: Migration Strategy (Week 3+)

### The Strangler Fig Pattern

Do not rewrite. Wrap, replace, deprecate.

```
Step 1: Create new <Button> component in design system
Step 2: Import it alongside old buttons
Step 3: Replace old buttons one page at a time
Step 4: When all old buttons replaced, delete old code
Step 5: Repeat for next component
```

**Implementation:**
```tsx
// 1. New component in your design system
// packages/ui/src/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent-primary text-white hover:bg-accent-hover',
        secondary: 'border border-border-default bg-transparent hover:bg-bg-secondary',
        ghost: 'hover:bg-bg-secondary',
        destructive: 'bg-error text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
);
```

```tsx
// 2. Migration wrapper for gradual adoption
// src/components/LegacyButtonAdapter.tsx
import { Button } from '@your-org/ui';

// Map old prop API to new
export function LegacyButtonAdapter({ type, ...props }) {
  const variantMap = {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'destructive',
    link: 'ghost',
  };
  return <Button variant={variantMap[type] || 'primary'} {...props} />;
}
```

### ESLint Rule for Deprecation

```js
// .eslintrc.js — warn on old component imports
module.exports = {
  rules: {
    'no-restricted-imports': ['warn', {
      paths: [
        {
          name: './components/OldButton',
          message: 'Use <Button> from @your-org/ui instead.',
        },
        {
          name: './components/OldModal',
          message: 'Use <Dialog> from @your-org/ui instead.',
        },
      ],
    }],
  },
};
```

### Migration Tracking

Track progress per component per page:

```
Component: Button
Total instances: 47
Migrated: 32/47 (68%)
├── /dashboard     ████████████████████░░░░  85% (17/20)
├── /settings      ████████████████████████  100% (8/8)
├── /onboarding    ██████░░░░░░░░░░░░░░░░░░  25% (3/12)
└── /billing       █████████████░░░░░░░░░░░  57% (4/7)
```

---

## Phase 5: Documentation & Adoption (Ongoing)

### Storybook Setup (Minimum Viable)

```bash
npx storybook@latest init
```

Every component needs at minimum:
1. **Default story** — Component in its default state
2. **Variants story** — All variants side by side
3. **Interactive story** — With controls/args for live editing
4. **Accessibility** — Storybook a11y addon results passing

### Adoption Metrics

Track these to know if the design system is working:

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Component coverage | 80%+ of UI uses DS components | grep for DS imports vs raw HTML |
| Token compliance | 90%+ of colors/spacing from tokens | grep for hardcoded values |
| Accessibility score | 0 axe violations per page | Storybook a11y addon, Lighthouse |
| Developer satisfaction | 4+/5 in quarterly survey | Internal survey |
| Time to build new page | 50% reduction | Track sprint velocity |

---

## Common Pitfalls

### Pitfall: Building for Figma First
Designers want pixel-perfect Figma components before code exists. This creates a waterfall where code never matches design and both drift. **Build code and Figma in parallel.** Code is the source of truth. Figma is a communication tool.

### Pitfall: Over-Abstracting Day One
Creating a `<Box>` component that wraps every possible CSS property. Creating a `<Text>` component with 47 props. **Start concrete, abstract when patterns emerge.** You cannot predict your abstractions before building three real pages.

### Pitfall: No Migration Path
Building a beautiful new design system that sits in a `/packages/ui` folder unused because there is no plan for migrating existing code. **Plan migration before building components.** The best design system is the one that gets adopted.

### Pitfall: Choosing by Hype
Picking a headless UI library because it was trending on Twitter. **Choose by your team's constraints**: framework, accessibility requirements, bundle budget, component coverage needs.

### Pitfall: Skipping the Audit
Jumping straight to building components without understanding what already exists. You will build things that already exist in three variants, miss patterns that work, and create migration confusion. **Phase 0 is not optional.**

---

## Anti-Patterns

### Anti-Pattern: The God Theme Object
A single 2000-line theme file with every possible value. Instead, use layered tokens: primitive (raw values) → semantic (purpose-named) → component (component-specific overrides).

### Anti-Pattern: Wrapping a Full Library
Taking MUI/Chakra/Ant Design and wrapping every component with your own props "in case we switch later." You will not switch. Use the library directly or build your own. The wrapper adds bugs and zero value.

### Anti-Pattern: Design System as a Separate Team
A "design system team" that builds components in isolation while product teams wait. Design system work should be embedded in product work. Build the component when a product team needs it, not before.

### Anti-Pattern: Enforcing Before Earning
Mandating design system usage before the system is good enough to want. If developers prefer writing raw CSS over using your components, the components need to be better, not the developers.

---

## Quality Checklist

- [ ] Component inventory completed with variant count per component
- [ ] Design tokens extracted from existing codebase (colors, spacing, typography)
- [ ] Headless UI library selected with documented rationale
- [ ] Tier 1 components (Button, Input, Dialog, Dropdown) built and documented
- [ ] Migration strategy defined (strangler fig, not big-bang rewrite)
- [ ] ESLint rules warn on deprecated component imports
- [ ] Storybook running with at least default + variants stories per component
- [ ] Dark mode support via semantic token layer
- [ ] Zero axe-core violations in Storybook accessibility addon
- [ ] At least one full page migrated end-to-end as proof of concept
- [ ] Migration tracking visible to the team (dashboard or spreadsheet)

---

## Sources

Design research based on:
- [Figma Blog: Design Systems 102 — How to Build Your Design System](https://www.figma.com/blog/design-systems-102-how-to-build-your-design-system/)
- [Storyblocks: Building a Design System — A Case Study](https://www.storyblocks.design/blogposts/building-a-design-system)
- [Argos CI: Migrating from Radix to React Aria](https://argos-ci.com/blog/react-aria-migration)
- [LogRocket: Headless UI Alternatives — Radix, React Aria, Ark UI, Base UI](https://blog.logrocket.com/headless-ui-alternatives/)
- [Subframe: Headless UI vs Radix — Which One is Better in 2025?](https://www.subframe.com/tips/headless-ui-vs-radix-6cb34)
- [Toptal: Building and Scaling a Design System — Case Study](https://www.toptal.com/designers/design-systems/design-system-case-study)
- [Fundament Design: Implementing Design Systems — Three Case Studies](https://www.fundament.design/p/implementing-design-systems-three)
- [Fellipe Utaka: Radix UI vs React Aria Components](https://www.fellipeutaka.com/blog/radix-ui-vs-react-aria-components)
