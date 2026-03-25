---
license: Apache-2.0
name: web-layout-spacing
description: Proper layout and spacing in modern web design — 8px grid systems, modular scales, vertical rhythm, CSS Grid/Flexbox patterns, fluid spacing with clamp(), container queries, and whitespace as design element. Activate on 'spacing', 'layout spacing', 'grid system', 'whitespace', '8px grid', 'vertical rhythm', 'spacing scale', 'gap', 'padding ratio', 'layout primitives', 'responsive spacing', 'clamp spacing', 'container queries layout'. NOT for animation/motion (use motion-design-web), not for color/typography alone (use typography-expert), not for design system creation (use design-system-bootstrap).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - layout
    - spacing
    - grid
    - whitespace
    - flexbox
    - css-grid
    - responsive
    - design-system
    - vertical-rhythm
  pairs-with:
    - skill: gestalt-web-design
      reason: Proximity and grouping principles drive spacing decisions
    - skill: design-system-bootstrap
      reason: Spacing tokens are the foundation of any design system
    - skill: hero-section-design
      reason: Hero sections need precise spacing to feel balanced
    - skill: typography-expert
      reason: Vertical rhythm ties text sizing and spacing together
    - skill: mobile-ux-optimizer
      reason: Responsive spacing is critical for mobile UX
    - skill: motion-design-web
      reason: Spacing affects animation distances and timing
category: Frontend & UI
tags:
  - layout
  - spacing
  - whitespace
  - css
  - design-systems
---

# Web Layout & Spacing

The definitive reference for layout and spacing in modern web design. Not "use flexbox" — the actual systems, principles, and math behind why good layouts feel right and bad ones feel off.

Spacing is the invisible skeleton of every interface. Color gets the glory, typography gets the respect, but spacing is what makes both of them work. A page with perfect type and color but broken spacing looks amateur. A page with mediocre type but perfect spacing looks professional. That is the power of getting this right.

## When to Use

**Use for:**
- Building any web layout from scratch
- Establishing spacing tokens for a design system
- Debugging layouts that "look wrong" but you cannot articulate why
- Converting Figma designs to CSS with accurate spacing
- Making responsive layouts that feel right on every screen size
- Setting up vertical rhythm for long-form content
- Auditing existing sites for spacing inconsistencies
- Card layouts, form layouts, dashboard grids, content pages

**Do NOT use for:**
- Animation and motion design (distances yes, timing/easing no) --> use **motion-design-web**
- Typography decisions (font choice, pairing) --> use **typography-expert**
- Full design system architecture --> use **design-system-bootstrap**
- Color and contrast decisions --> use the appropriate color/accessibility skill
- Page-level information architecture --> use **web-design-expert**

---

## The 8px Grid System

The 8px grid is the industry standard for spacing. Apple, Google, and most major design systems use it. The reasons are mathematical: 8 divides cleanly into common screen resolutions (320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920), it scales cleanly at 0.75x (6px), 1.5x (12px), and 2x (16px) for device pixel ratios, and it produces spacing values large enough to be visually distinct but small enough to be granular.

### The Base Scale

```
Step   Value   Tailwind v4    Use Case
─────────────────────────────────────────────────────────
0      0px     0              Reset/collapse
0.5    2px     0.5            Hairline borders, fine adjustments
1      4px     1              Icon padding, tight inline spacing
2      8px     2              Compact element gaps, small padding
3      12px    3              Form field inner padding, list gaps
4      16px    4              Standard component padding, paragraph spacing
5      20px    5              Card inner padding (compact)
6      24px    6              Section sub-gaps, card padding (standard)
8      32px    8              Between related sections, form groups
10     40px    10             Between distinct sections
12     48px    12             Major section spacing
16     64px    16             Page section dividers
20     80px    20             Hero-to-content transition
24     96px    24             Maximum page section spacing
```

### CSS Custom Properties — The Foundation

Every project should define its spacing scale once. Everything else references it.

```css
:root {
  /* Base unit: 8px (0.5rem at default 16px root) */
  --space-unit: 0.5rem;

  /* The scale */
  --space-0: 0;
  --space-0-5: calc(0.25 * var(--space-unit));   /*  2px */
  --space-1: calc(0.5 * var(--space-unit));       /*  4px */
  --space-2: var(--space-unit);                   /*  8px */
  --space-3: calc(1.5 * var(--space-unit));       /* 12px */
  --space-4: calc(2 * var(--space-unit));         /* 16px */
  --space-5: calc(2.5 * var(--space-unit));       /* 20px */
  --space-6: calc(3 * var(--space-unit));         /* 24px */
  --space-8: calc(4 * var(--space-unit));         /* 32px */
  --space-10: calc(5 * var(--space-unit));        /* 40px */
  --space-12: calc(6 * var(--space-unit));        /* 48px */
  --space-16: calc(8 * var(--space-unit));        /* 64px */
  --space-20: calc(10 * var(--space-unit));       /* 80px */
  --space-24: calc(12 * var(--space-unit));       /* 96px */
}
```

### The 4px Half-Step

Use the 4px sub-grid for fine adjustments only — icon-to-label gaps, input padding, borders. If you find yourself using 4px steps everywhere, your elements are too dense.

### When NOT to Use 8px Grid

- **Typography line heights**: Line heights follow their own rhythm (see Vertical Rhythm below)
- **Icon sizes**: Icons follow 16/20/24/32 scales, which happen to be 8px-aligned but are driven by optical sizing
- **Border radius**: Radius is aesthetic, not spatial — 4px, 6px, 8px, 12px are all fine
- **Shadows/blur**: Shadow values are perceptual, not grid-based

---

## The Modular Scale

A modular scale generates spacing (and type) values using a base and a ratio: `value = base * ratio^n`. This produces values that feel harmonically related rather than arbitrarily picked.

### Common Ratios and When to Use Each

```
Ratio    Name             Feel               Best For
──────────────────────────────────────────────────────────
1.125    Major Second     Very tight, dense   Data-heavy dashboards, admin UIs
1.200    Minor Third      Comfortable         General purpose, content sites
1.250    Major Third      Balanced            Blogs, marketing, SaaS
1.333    Perfect Fourth   Generous            Editorial, luxury brands
1.414    Augmented Fourth Dramatic            Portfolio, creative agencies
1.500    Perfect Fifth    Very spacious       Minimal sites, Apple-style
1.618    Golden Ratio     Maximum drama       Art, fashion, single-product
```

### The Generator — CSS Custom Properties

```css
:root {
  --scale-ratio: 1.25;       /* Major Third — change this one value */
  --scale-base: 1rem;        /* 16px */

  /* Negative steps (smaller than base) */
  --scale-n2: calc(var(--scale-base) / var(--scale-ratio) / var(--scale-ratio));
  --scale-n1: calc(var(--scale-base) / var(--scale-ratio));

  /* Base */
  --scale-0: var(--scale-base);

  /* Positive steps (larger than base) */
  --scale-1: calc(var(--scale-base) * var(--scale-ratio));                                    /* 20px */
  --scale-2: calc(var(--scale-base) * var(--scale-ratio) * var(--scale-ratio));                /* 25px */
  --scale-3: calc(var(--scale-base) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio));  /* 31.25px */
  --scale-4: calc(var(--scale-base) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio));  /* ~39px */
  --scale-5: calc(var(--scale-base) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio));  /* ~49px */
}
```

### Major Third (1.25) — Computed Values

This is the most versatile ratio. Here is what the scale produces:

```
Step    Exact        Rounded    Tailwind Nearest    Use Case
────────────────────────────────────────────────────────────────
-3      8.19px       8px        2                   Micro gaps
-2      10.24px      10px       2.5                 Small icon gaps
-1      12.80px      13px       3                   Tight padding
 0      16.00px      16px       4                   Base unit / body text
 1      20.00px      20px       5                   H4 / card padding
 2      25.00px      25px       6                   H3 / section sub-gap
 3      31.25px      31px       8                   H2 / between groups
 4      39.06px      39px       10                  H1 / section gap
 5      48.83px      49px       12                  Page section break
 6      61.04px      61px       16                  Hero spacing
 7      76.29px      76px       20                  Maximum spacing
```

### Grid vs. Modular Scale — When to Use Which

**Use the 8px grid** when:
- Building a design system used by many designers/developers
- Consistency across a large product is paramount
- Working with a team that needs simple, predictable values
- Building data-dense applications (dashboards, admin panels)

**Use a modular scale** when:
- Building a marketing site or editorial product
- You want a distinctive visual rhythm
- Typography is a primary design element
- Working solo or with a small team that groks the math

**In practice, use both**: The 8px grid for layout structure, the modular scale for typography and content spacing. Snap modular scale outputs to the nearest 4px value for the best of both worlds.

---

## Vertical Rhythm

Vertical rhythm means all vertical spacing in your layout aligns to a baseline grid. Text, images, padding, margins — everything snaps to multiples of a single line-height unit. This creates the invisible order that makes professional layouts feel "right."

### Setting Up Vertical Rhythm

```css
:root {
  --baseline: 1.5rem;  /* 24px — your line height becomes your grid */
  font-size: 16px;
  line-height: 1.5;    /* = 24px = var(--baseline) */
}

/* Everything is a multiple of the baseline */
h1 {
  font-size: 2.5rem;
  line-height: calc(3 * var(--baseline));    /* 72px — 3 lines */
  margin-top: calc(2 * var(--baseline));     /* 48px */
  margin-bottom: var(--baseline);            /* 24px */
}

h2 {
  font-size: 2rem;
  line-height: calc(2 * var(--baseline));    /* 48px — 2 lines */
  margin-top: calc(2 * var(--baseline));     /* 48px */
  margin-bottom: calc(0.5 * var(--baseline));/* 12px */
}

h3 {
  font-size: 1.5rem;
  line-height: calc(1.5 * var(--baseline));  /* 36px — 1.5 lines */
  margin-top: calc(1.5 * var(--baseline));   /* 36px */
  margin-bottom: calc(0.5 * var(--baseline));/* 12px */
}

p {
  margin-top: 0;
  margin-bottom: var(--baseline);            /* 24px — one line */
}

/* Images snap to the grid too */
img {
  height: auto;
  margin-bottom: var(--baseline);
}
```

### The lh and rlh Units (Modern CSS)

The `lh` unit equals the computed line-height of the current element. The `rlh` unit equals the computed line-height of the root element (`<html>`). These are purpose-built for vertical rhythm and have 94%+ browser support (shipped in all browsers by end of 2023).

```css
html {
  font-size: 16px;
  line-height: 1.5;   /* 1rlh = 24px */
}

/* Spacing that inherently follows vertical rhythm */
article p {
  margin-bottom: 1lh;              /* One line of spacing */
}

article h2 {
  margin-top: 2rlh;                /* Two root-level lines above */
  margin-bottom: 0.5rlh;           /* Half a root-level line below */
}

article blockquote {
  padding: 1lh 1.5rem;             /* Vertical padding = one line */
  margin: 1.5lh 0;                 /* Vertical margin = 1.5 lines */
}

/* Progressive enhancement for older browsers */
article p {
  margin-bottom: 1.5rem;           /* Fallback */
  margin-bottom: 1lh;              /* Modern browsers */
}
```

**When to use `lh` vs `rlh`:**
- `lh` — Component-level spacing that scales with local font size (cards, form fields, article body)
- `rlh` — Site-wide structural spacing that stays consistent regardless of local font size (page sections, nav, sidebar)

### Debugging Vertical Rhythm

Add a visual baseline grid overlay to check alignment:

```css
/* Development only — toggle with a class */
.show-baseline {
  background-image: linear-gradient(
    to bottom,
    transparent calc(1rlh - 1px),
    rgba(0, 150, 255, 0.15) calc(1rlh - 1px),
    rgba(0, 150, 255, 0.15) 1rlh
  );
  background-size: 100% 1rlh;
}
```

---

## Layout Primitives — The "Every Layout" System

Heydon Pickering and Andy Bell identified that all web layouts are compositions of a small number of primitives. Each is intrinsically responsive — no media queries needed. Together they replace thousands of lines of bespoke layout CSS.

### 1. The Stack

Injects consistent vertical space between sibling elements. The single most important layout primitive.

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack > * {
  margin-block: 0;
}

.stack > * + * {
  margin-block-start: var(--space, 1.5rem);
}
```

**Modern version with gap (preferred in 2025+):**
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space, 1.5rem);
}
```

**Use for:** Article body content, form fields, sidebar nav items, any vertical list of things.

### 2. The Cluster

Wrapping horizontal groups with consistent gaps. Items flow left-to-right and wrap naturally.

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
  justify-content: flex-start;
  align-items: center;
}
```

**Use for:** Tag lists, button groups, icon rows, breadcrumbs, pill filters, social links.

### 3. The Center

Horizontally centers a max-width container with consistent gutters.

```css
.center {
  box-sizing: content-box;
  max-inline-size: var(--measure, 60ch);
  margin-inline: auto;
  padding-inline: var(--gutter, 1rem);
}
```

**Use for:** Page content containers, article bodies, any centered column of content.

### 4. The Sidebar

A two-panel layout where one panel has a fixed (or content-driven) width and the other fills remaining space. Stacks vertically when the container is too narrow.

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
}

.with-sidebar > :first-child {
  flex-basis: var(--sidebar-width, 20rem);
  flex-grow: 1;
}

.with-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: var(--content-min, 50%);
}
```

**Use for:** Sidebar + main content, settings panels, doc sites, filter + results layouts.

### 5. The Switcher

Shows children side-by-side when space permits, stacks them when it does not. No media queries — the layout decides based on available width.

```css
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
}

.switcher > * {
  flex-grow: 1;
  flex-basis: calc((var(--threshold, 30rem) - 100%) * 999);
}
```

When the container is wider than `--threshold`, children sit side by side (flex-basis becomes a large negative number, so flex-grow takes over). When narrower, flex-basis becomes a large positive number, forcing wrap.

**Use for:** Feature comparison grids, pricing cards, any N-up layout that should stack on mobile.

### 6. The Cover

A full-height layout (usually viewport height) with a centered principal element and optional header/footer.

```css
.cover {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
  padding: var(--space, 1rem);
}

.cover > * {
  margin-block: var(--space, 1rem);
}

.cover > :first-child:not(.centered) {
  margin-block-start: 0;
}

.cover > :last-child:not(.centered) {
  margin-block-end: 0;
}

.cover > .centered {
  margin-block: auto;
}
```

**Use for:** Hero sections, login pages, error pages, loading screens, splash screens.

### 7. The Frame

Crops content to an aspect ratio. Essential for images and video.

```css
.frame {
  aspect-ratio: var(--ratio, 16 / 9);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame > img,
.frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

**Use for:** Image thumbnails, video containers, avatar circles (1/1 ratio), card hero images.

### 8. The Grid

An auto-filling responsive grid. No media queries — items fill available space and wrap to new rows.

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(var(--min-column-size, 15rem), 100%), 1fr)
  );
  gap: var(--space, 1rem);
}
```

**Use for:** Card grids, product listings, image galleries, feature grids.

### 9. The Reel

A horizontal scrolling strip (carousel without JavaScript).

```css
.reel {
  display: flex;
  gap: var(--space, 1rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-color: var(--color-accent) var(--color-bg);
}

.reel > * {
  flex: 0 0 var(--item-width, 20rem);
  scroll-snap-align: start;
}
```

**Use for:** Image carousels, horizontally scrolling card rows, timeline views.

### Composing Primitives

The power is in composition. A real page is primitives nested inside each other:

```html
<!-- Center constrains width, Stack spaces children, Grid fills cards -->
<div class="center">
  <div class="stack" style="--space: 3rem;">
    <header class="cluster">
      <h1>Dashboard</h1>
      <div class="cluster" style="--space: 0.5rem;">
        <button>Export</button>
        <button>Settings</button>
      </div>
    </header>
    <div class="auto-grid" style="--min-column-size: 20rem;">
      <article class="stack" style="--space: 0.75rem;">...</article>
      <article class="stack" style="--space: 0.75rem;">...</article>
      <article class="stack" style="--space: 0.75rem;">...</article>
    </div>
    <div class="with-sidebar">
      <nav class="stack" style="--space: 0.5rem;">...</nav>
      <main class="stack">...</main>
    </div>
  </div>
</div>
```

---

## CSS Grid vs. Flexbox — The 2026 Decision

The old debate is settled. Use both, for different things.

### Use CSS Grid For:

- **Page-level layout** — header, sidebar, main, footer
- **Two-dimensional arrangements** — rows AND columns matter
- **Alignment across siblings** — card grids where headings align across cards (use subgrid)
- **Known structure** — you know the blueprint: "3 columns, sidebar on left"
- **Overlap** — elements that need to overlap via grid placement
- **Dense packing** — `grid-auto-flow: dense` for masonry-like fills

```css
/* Page layout — always Grid */
.page {
  display: grid;
  grid-template-columns: var(--sidebar-width, 280px) 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  min-height: 100dvh;
}
```

### Use Flexbox For:

- **One-dimensional flow** — a row of buttons, a column of nav items
- **Content-driven sizing** — items sized by their content, not the grid
- **Wrapping groups** — clusters, tag lists, breadcrumbs
- **Single-axis alignment** — centering one thing in a container
- **Unknown item count** — "however many items there are, space them evenly"

```css
/* Navigation — always Flexbox */
.nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-links {
  display: flex;
  gap: var(--space-6);
  margin-inline-start: auto;   /* Push to the right */
}
```

### Use Subgrid For:

Subgrid (97%+ browser support, Chrome 117+, Firefox 71+, Safari 16+) lets nested elements align to their parent grid's tracks. This solves the "card content alignment" problem that plagued CSS for years.

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;  /* Card spans 3 parent rows: image, content, actions */
}

/* Now every card's image, content, and action bar align across the row */
```

### The Decision Tree

```
Need to place items in ROWS and COLUMNS?
├── YES → CSS Grid
│         ├── Children need to align with grandparent grid? → Subgrid
│         └── Layout known ahead of time? → Named grid areas
└── NO → One dimension only
          ├── Items should wrap? → Flexbox + flex-wrap
          ├── Items should scroll? → Flexbox + overflow-x (Reel)
          └── Items in a line? → Flexbox
```

---

## Fluid Spacing with clamp()

Hard breakpoints create jarring spacing jumps. Fluid spacing scales smoothly between a minimum and maximum value based on viewport (or container) width.

### The Formula

```
clamp(min, preferred, max)

Where preferred = slope * 100vw + intercept

slope     = (maxSize - minSize) / (maxViewport - minViewport)
intercept = minSize - slope * minViewport
```

### Practical Fluid Spacing Scale

This scale goes from 320px viewport (mobile) to 1440px viewport (desktop):

```css
:root {
  /* Fluid spacing — scales smoothly from mobile to desktop */
  --fluid-space-xs:  clamp(0.25rem,  0.18rem + 0.36vw,  0.5rem);    /*  4px →  8px */
  --fluid-space-s:   clamp(0.5rem,   0.36rem + 0.71vw,  1rem);      /*  8px → 16px */
  --fluid-space-m:   clamp(1rem,     0.71rem + 1.43vw,  2rem);      /* 16px → 32px */
  --fluid-space-l:   clamp(1.5rem,   1.07rem + 2.14vw,  3rem);      /* 24px → 48px */
  --fluid-space-xl:  clamp(2rem,     1.43rem + 2.86vw,  4rem);      /* 32px → 64px */
  --fluid-space-2xl: clamp(3rem,     2.14rem + 4.29vw,  6rem);      /* 48px → 96px */
  --fluid-space-3xl: clamp(4rem,     2.86rem + 5.71vw,  8rem);      /* 64px → 128px */
}
```

### How to Derive These Values

Step-by-step for `--fluid-space-m` (16px at 320px → 32px at 1440px):

```
minSize     = 1rem      (16px)
maxSize     = 2rem      (32px)
minViewport = 20rem     (320px)
maxViewport = 90rem     (1440px)

slope     = (2 - 1) / (90 - 20) = 1/70 ≈ 0.01429
intercept = 1 - 0.01429 * 20 = 1 - 0.2857 = 0.7143rem

preferred = 0.7143rem + 1.429vw
→ round: 0.71rem + 1.43vw

Result: clamp(1rem, 0.71rem + 1.43vw, 2rem)
```

### One-Up Fluid Pairs (Utopia-Style)

For dramatic spacing jumps (e.g., mobile section gap = 24px, desktop = 64px), skip scale steps:

```css
:root {
  /* "s-l" pair: small on mobile, large on desktop */
  --fluid-space-s-l: clamp(0.5rem, -0.07rem + 2.86vw, 3rem);    /*  8px → 48px */

  /* "m-xl" pair: medium on mobile, extra-large on desktop */
  --fluid-space-m-xl: clamp(1rem, 0.14rem + 4.29vw, 4rem);      /* 16px → 64px */
}
```

These are ideal for section spacing where mobile needs tighter gaps but desktop can breathe.

### Container Query Units for Component Spacing

When a component needs to adapt its spacing to its container (not the viewport), use container query units. Full browser support as of 2025.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  /* Spacing scales with the card's container, not the viewport */
  padding: clamp(0.75rem, 3cqi, 2rem);
  gap: clamp(0.5rem, 2cqi, 1.5rem);
}

/* When the container is wide enough, switch layout */
@container card (min-inline-size: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: var(--space-6);
  }
}
```

**Container query unit reference:**
- `cqw` — 1% of the query container's width
- `cqh` — 1% of the query container's height
- `cqi` — 1% of the query container's inline size (preferred for international support)
- `cqb` — 1% of the query container's block size
- `cqmin` — smaller of `cqi` or `cqb`
- `cqmax` — larger of `cqi` or `cqb`

---

## Whitespace as a Design Element

Whitespace is not empty space — it is active design material. The amount of whitespace directly communicates hierarchy, grouping, and importance. Increasing whitespace by 50% can boost comprehension by 20%.

### Micro vs. Macro Whitespace

**Micro whitespace** — the space within and between small elements:
- Letter spacing (tracking)
- Line height (leading)
- Padding inside buttons, inputs, chips
- Gap between icon and label
- Space between list items

**Macro whitespace** — the space between large sections:
- Section padding (top/bottom)
- Margins between content blocks
- Sidebar gutters
- Header/footer breathing room
- The gap between hero and first content section

### The Content Density Spectrum

```
DENSE ◄──────────────────────────────────► SPACIOUS

Bloomberg    Gmail    GitHub    Notion    Stripe    Linear    Apple
Terminal                                                     .com

Data-heavy   Productivity   Balanced   Marketing   Luxury
Dashboards   Tools                     Sites       Brands
```

Where you sit on this spectrum should be a deliberate choice, not an accident:

- **Dense (4px base)** — Dashboards, trading platforms, IDE-like interfaces. Every pixel matters. Users are experts who want maximum information density.
- **Comfortable (8px base)** — SaaS products, productivity tools. Balance between information and breathing room.
- **Spacious (12-16px base)** — Marketing sites, portfolios, editorial. Whitespace IS the design. Each element has room to breathe and be appreciated.

### How Apple Uses Whitespace

Apple uses whitespace aggressively. Typical patterns:
- Hero sections with 120-200px top/bottom padding
- Product images floating in vast empty space (60-70% of the viewport is white)
- Text blocks constrained to 580-650px wide, centered in full-width sections
- Section-to-section gaps of 100-160px
- Minimal navigation (small logo, few links, lots of space between them)

### How Stripe Uses Whitespace

Stripe balances information density with elegance:
- Content max-width of ~1080px, centered with generous side padding
- Section padding of 80-120px top/bottom
- Card components with 32-48px internal padding
- Code blocks with 24px padding, 16px gap between code and description
- Feature grids with 32-48px gap between items

### How Linear Uses Whitespace

Linear epitomizes the modern SaaS aesthetic:
- Full-bleed sections with 80-100px padding
- Feature descriptions with 48-64px between heading and body
- Screenshots/demos floating in dark backgrounds with 40-60px padding
- Compact navigation with precisely 24px between items
- Modular sections that each feel like a complete "slide"

---

## Component-Level Spacing

### The Padding Ratio for Interactive Elements

Buttons, inputs, pills, and chips follow a consistent ratio: **vertical padding is roughly 60-66% of horizontal padding**. This is close to the golden ratio (0.618) and accounts for how the human eye perceives horizontal vs. vertical space differently.

```css
/* Button padding ratios */
.btn-sm {
  padding: 6px 12px;       /* 0.50 ratio — compact */
  /* Or: padding: 0.375rem 0.75rem; */
}

.btn-md {
  padding: 10px 16px;      /* 0.625 ratio — standard, near golden */
  /* Or: padding: 0.625rem 1rem; */
}

.btn-lg {
  padding: 14px 24px;      /* 0.583 ratio — generous */
  /* Or: padding: 0.875rem 1.5rem; */
}

.btn-xl {
  padding: 18px 32px;      /* 0.5625 ratio — hero CTA */
  /* Or: padding: 1.125rem 2rem; */
}

/* Input fields follow the same principle */
.input {
  padding: 10px 14px;      /* Slightly more horizontal than buttons */
}

/* Pills / chips — tighter ratio because they are small */
.pill {
  padding: 4px 10px;       /* 0.4 ratio */
}
```

### Gap as First-Class Spacing

In modern CSS, `gap` has replaced margin for spacing between siblings inside flex and grid containers. Always prefer `gap` over margins for sibling spacing.

```css
/* OLD — margin-based (fragile, causes collapse issues) */
.old-list > * + * {
  margin-top: 1rem;
}

/* NEW — gap-based (clean, no collapse, works in flex and grid) */
.new-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

**Why gap wins:**
- No margin collapse issues
- Works identically in Flexbox and Grid
- Single property controls both row-gap and column-gap
- Does not add space before the first or after the last item
- Easier to override with a single custom property

### Card Spacing System

Cards are the most common component in web design. Their spacing needs a system:

```css
.card {
  --card-padding: var(--space-6);          /* 24px default */
  --card-gap: var(--space-4);              /* 16px between elements */
  --card-section-gap: var(--space-6);      /* 24px between sections */

  padding: var(--card-padding);
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);                     /* 12px icon-to-title */
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);                     /* 8px between paragraphs */
}

.card-footer {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--card-gap);
  border-top: 1px solid var(--color-border);
  margin-top: auto;                        /* Push to bottom */
}
```

### The Internal-Less-Than-External Rule

A foundational spacing rule from Gestalt psychology: **space inside a component should be less than or equal to space outside it**. This creates clear visual boundaries without needing borders or backgrounds.

```
BAD (internal > external):
┌──────────────┐     ┌──────────────┐
│              │     │              │
│   Content    │ 8px │   Content    │   ← Cards feel merged
│              │     │              │
│   48px pad   │     │   48px pad   │
└──────────────┘     └──────────────┘

GOOD (internal <= external):
┌──────────────┐          ┌──────────────┐
│              │          │              │
│   Content    │  32px    │   Content    │   ← Cards feel distinct
│              │          │              │
│   24px pad   │          │   24px pad   │
└──────────────┘          └──────────────┘
```

When the external gap is generous relative to internal padding, each card reads as its own entity. When internal padding exceeds external gap, cards blur together into an amorphous mass.

---

## Page-Level Composition

### Max-Width Containers

Why is 1200px the most common max-width? It is not magic — it is the comfortable reading width at standard text sizes on the most common desktop resolution (1440px or 1920px). At 1200px max-width on a 1440px screen, you get 120px of side breathing room. On 1920px, you get 360px — generous but not wasteful.

```css
/* Standard content container */
.container {
  width: 100%;
  max-width: 75rem;          /* 1200px */
  margin-inline: auto;
  padding-inline: var(--gutter, 1.5rem);
}

/* Narrow for long-form reading (optimal: 45-75 characters per line) */
.container-prose {
  max-width: 42rem;          /* ~672px ≈ 65ch at 16px body text */
}

/* Wide for dashboards and data-heavy pages */
.container-wide {
  max-width: 90rem;          /* 1440px */
}

/* Full-bleed for hero sections and backgrounds */
.container-full {
  max-width: none;
  padding-inline: 0;
}
```

### Common Max-Width Values and Their Use Cases

```
Width        rem      Use Case                         Example Sites
──────────────────────────────────────────────────────────────────────
640px        40rem    Narrow prose, centered forms      Medium articles
768px        48rem    Blog content, documentation       MDN, Notion pages
960px        60rem    Balanced content + whitespace      GitHub READMEs
1080px       67.5rem  Marketing content sections         Stripe, Linear
1200px       75rem    Standard page container            Most SaaS products
1440px       90rem    Wide dashboards, admin panels      Vercel Dashboard
100%         100%     Full-bleed backgrounds/heroes      Apple product pages
```

### Gutter Calculations

Gutters are the space between the edge of the viewport and your content container. They should be fluid:

```css
:root {
  --gutter: clamp(1rem, 3vw, 3rem);    /* 16px → 48px */
}

.container {
  max-width: 75rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
}
```

### Full-Bleed Inside Constrained Content

A common pattern: the main content is constrained to 1200px, but some sections (hero, testimonial bands, CTA strips) stretch full-width with colored backgrounds.

```css
/* Method 1: Negative margin + viewport width */
.full-bleed {
  width: 100vw;
  margin-inline-start: calc(50% - 50vw);
  padding-inline: var(--gutter);
}

/* Method 2: Grid-based (cleaner, no overflow issues) */
.page-grid {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gutter), 1fr)
    [content-start] min(75rem, 100% - var(--gutter) * 2)
    [content-end] minmax(var(--gutter), 1fr)
    [full-end];
}

.page-grid > * {
  grid-column: content;
}

.page-grid > .full-bleed {
  grid-column: full;
}
```

Method 2 is superior — no horizontal scrollbar issues, no overflow: hidden hacks, and the grid handles gutters automatically.

### Sidebar + Content Ratios

Common sidebar-to-content proportions:

```
Ratio        Sidebar      Content       Feel
────────────────────────────────────────────────
1:3          240px        960px         Minimal sidebar (nav only)
1:2.5        280px        920px         Standard (most common)
1:2          320px        880px         Heavy sidebar (filters, tools)
1:1.5        360px        840px         Dual-pane (email, chat)

/* Implementation */
.layout {
  display: grid;
  grid-template-columns: minmax(240px, 280px) 1fr;
  gap: var(--space-6);
}

/* Collapse sidebar on mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
```

---

## Responsive Spacing Strategy

### Viewport Units — Which to Use

```
Unit    Meaning                    Use When
────────────────────────────────────────────────────────────
vh      1% of viewport height      Legacy fallback only
vw      1% of viewport width       Fluid calculations
dvh     1% of dynamic viewport     Mobile-safe full-height (changes with browser chrome)
svh     1% of small viewport       Conservative: assumes browser chrome IS showing
lvh     1% of large viewport       Generous: assumes browser chrome is NOT showing
```

**For mobile-safe full-height layouts, always use `dvh`:**

```css
.hero {
  min-height: 100vh;            /* Fallback */
  min-height: 100dvh;           /* Modern: accounts for mobile browser chrome */
}
```

### When to Use Breakpoints vs. Fluid Scaling

**Use fluid scaling (clamp) for:**
- Font sizes
- Padding and margins that should grow/shrink smoothly
- Container gutters
- Section spacing

**Use breakpoints for:**
- Layout structure changes (1 column → 2 columns)
- Showing/hiding elements (mobile menu vs. desktop nav)
- Component variants (stacked card → horizontal card)

**Use container queries for:**
- Component-level layout changes regardless of viewport
- Reusable components that live in different contexts (sidebar vs. main content)

### Breakpoint-Specific Spacing Overrides

When fluid spacing is not enough:

```css
:root {
  --section-padding: var(--fluid-space-l);      /* Fluid default */
}

/* On very small screens, tighten aggressively */
@media (max-width: 480px) {
  :root {
    --section-padding: var(--space-6);           /* Fixed 24px */
  }
}

/* On large screens, let it breathe */
@media (min-width: 1440px) {
  :root {
    --section-padding: var(--space-24);          /* Fixed 96px */
  }
}
```

---

## Real-World Spacing Scales Compared

### Tailwind CSS v4 (2025+)

Dynamic scale based on `--spacing: 0.25rem` (4px):

```
Class     Value        Pixels
──────────────────────────────
p-0       0            0px
p-0.5     0.125rem     2px
p-1       0.25rem      4px
p-2       0.5rem       8px
p-3       0.75rem      12px
p-4       1rem         16px
p-5       1.25rem      20px
p-6       1.5rem       24px
p-8       2rem         32px
p-10      2.5rem       40px
p-12      3rem         48px
p-16      4rem         64px
p-20      5rem         80px
p-24      6rem         96px
```

Every multiple of the base is available (`p-7` = 1.75rem = 28px), not just the listed ones.

### Material Design 3

Based on 4dp increments:

```
Token                 Value
─────────────────────────────
spacing.none          0dp
spacing.extraSmall    4dp
spacing.small         8dp
spacing.medium        12dp
spacing.large         16dp
spacing.extraLarge    24dp
spacing.2xl           32dp
spacing.3xl           48dp
spacing.4xl           64dp
```

### Carbon Design System (IBM)

Linear 8px scale:

```
Token           Value       Use
─────────────────────────────────────────
$spacing-01     2px         Fine adjustments
$spacing-02     4px         Compact padding
$spacing-03     8px         Small gaps
$spacing-04     12px        Form spacing
$spacing-05     16px        Standard spacing
$spacing-06     24px        Component groups
$spacing-07     32px        Section gaps
$spacing-08     40px        Large sections
$spacing-09     48px        Page sections
$spacing-10     64px        Major divisions
$spacing-11     80px        Page-level
$spacing-12     96px        Maximum
$spacing-13     160px       Hero spacing
```

### Atlassian Design System

Semantic naming with 8px base:

```
Token               Value     Description
──────────────────────────────────────────────────
space.0             0px       Zero
space.025           2px       Hairline
space.050           4px       Tightest
space.075           6px       Tighter
space.100           8px       Tight
space.150           12px      Compact
space.200           16px      Normal (default)
space.250           20px      Comfortable
space.300           24px      Spacious
space.400           32px      Very spacious
space.500           40px      Extra spacious
space.600           48px      Section-level
space.800           64px      Page-level
space.1000          80px      Maximum
```

---

## Common Spacing Mistakes

### Mistake 1: Inconsistent Values

```css
/* BAD — 8 different "small" gaps. Which is the right one? */
.header     { gap: 10px; }
.nav        { gap: 12px; }
.sidebar    { gap: 11px; }
.card       { gap: 14px; }
.form       { gap: 13px; }
.footer     { gap: 9px; }
.modal      { gap: 15px; }
.dropdown   { gap: 8px; }

/* GOOD — one token, one value, used everywhere */
.header,
.nav,
.sidebar,
.card,
.form,
.footer,
.modal,
.dropdown {
  gap: var(--space-3);    /* 12px — the one true "small gap" */
}
```

**Fix:** Audit your CSS for unique spacing values. A well-designed system uses 8-12 distinct values. If you have 30+, you have a problem.

### Mistake 2: Margin Collapse Surprises

Margin collapse happens when vertical margins of adjacent block elements combine into one margin (the larger wins). This only affects **block layout** — it does NOT happen in Flexbox or Grid.

```css
/* GOTCHA: These margins collapse — you get 32px, not 56px */
.heading  { margin-bottom: 24px; }
.paragraph { margin-top: 32px; }
/* Actual gap: 32px (the larger margin wins) */

/* GOTCHA: Parent-child collapse */
.parent { margin-top: 0; }
.child  { margin-top: 24px; }
/* The child's margin "escapes" and pushes the PARENT down by 24px */

/* FIX 1: Use gap (no collapse in flex/grid) */
.container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* FIX 2: Use padding on the parent to block parent-child collapse */
.parent { padding-top: 1px; }   /* Even 1px blocks collapse */

/* FIX 3: Use overflow to create a block formatting context */
.parent { overflow: hidden; }

/* FIX 4: Use margin in only one direction (Heydon Pickering's "lobotomized owl") */
* + * { margin-top: 1.5rem; }    /* Only top margins, no collapse risk */
```

### Mistake 3: Desktop-First Spacing That Breaks on Mobile

```css
/* BAD — 96px section padding looks great on desktop, absurd on 375px mobile */
section {
  padding: 96px 48px;
}

/* GOOD — fluid spacing that adapts */
section {
  padding: clamp(2rem, 4vw + 1rem, 6rem) var(--gutter);
}
```

### Mistake 4: Over-Spacing That Wastes Real Estate

Not everything needs 80px of breathing room. Over-spacing pushes content below the fold, increases scroll depth, and can make pages feel empty rather than elegant.

```css
/* BAD — every element drowning in whitespace */
h2 { margin-top: 80px; margin-bottom: 40px; }
p  { margin-bottom: 32px; }
ul { margin-bottom: 48px; }
/* User scrolls forever to reach the CTA */

/* GOOD — proportional to content importance */
h2 { margin-top: 48px; margin-bottom: 16px; }
p  { margin-bottom: 16px; }
ul { margin-bottom: 24px; }
```

### Mistake 5: Using Padding When You Mean Margin (or Vice Versa)

```
PADDING = space INSIDE the element boundary (between border and content)
MARGIN  = space OUTSIDE the element boundary (between element and neighbors)

Use PADDING for:
- Internal breathing room (card content inset)
- Click/tap target expansion
- Background color coverage area

Use MARGIN for:
- Separation between distinct elements
- Push away from siblings
- Page-level section spacing (or use gap)

Use GAP for:
- Space between children of a flex/grid container
- ALWAYS prefer gap over margin for sibling spacing
```

### Mistake 6: Ignoring the 4px Sub-Grid for Small Elements

```css
/* BAD — 8px gap between icon and label feels too wide */
.icon-label { gap: 8px; }

/* GOOD — drop to the 4px sub-grid for tight pairings */
.icon-label { gap: 4px; }

/* Also good for: */
.badge      { padding: 2px 6px; }    /* 2px top/bottom, 6px sides */
.avatar-sm  { width: 24px; height: 24px; }
.divider    { margin-block: 4px; }
```

---

## Debugging "Why Does This Look Wrong?"

### The Squint Test

Literally squint at your screen (or step back 5 feet). When you cannot read the text, your brain sees only shapes and spacing. Ask:
- Do elements group naturally? (Related items should cluster)
- Are there clear visual sections? (Macro whitespace should separate groups)
- Does anything float awkwardly? (Orphaned elements not clearly belonging to a group)
- Is the page balanced? (No side feels heavier than the other)

### The Color Block Test

Temporarily add colored backgrounds to all your containers:

```css
/* Debug mode — add to dev stylesheet */
.debug * {
  outline: 1px solid rgba(255, 0, 0, 0.2);
}

.debug *:hover {
  outline: 2px solid red;
  background: rgba(255, 0, 0, 0.05);
}
```

This reveals:
- Unexpected container sizes
- Hidden overflow
- Margin collapse in action
- Elements that are not where you think they are

### Browser DevTools Spacing Overlay

All modern browsers show margin/padding visually when you inspect an element:
- **Margin** — shown in orange/amber
- **Padding** — shown in green
- **Content** — shown in blue
- **Border** — shown in yellow/gold

In Chrome DevTools, hover over any element to see its box model visualization overlaid on the page. In Firefox, the Layout tab shows grid and flex overlays with detailed gap visualization.

### The Spacing Audit

Open DevTools, go to Console, and run:

```javascript
// Find all unique spacing values in use
const allStyles = [...document.querySelectorAll('*')].map(el => {
  const s = getComputedStyle(el);
  return {
    el: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
    mt: s.marginTop, mb: s.marginBottom,
    pt: s.paddingTop, pb: s.paddingBottom,
    gap: s.gap
  };
}).filter(s => s.mt !== '0px' || s.mb !== '0px' || s.pt !== '0px' || s.pb !== '0px');

// Count unique values
const values = new Set();
allStyles.forEach(s => {
  [s.mt, s.mb, s.pt, s.pb, s.gap].forEach(v => {
    if (v && v !== '0px' && v !== 'normal') values.add(v);
  });
});

console.log(`Unique spacing values: ${values.size}`);
console.log([...values].sort((a, b) => parseFloat(a) - parseFloat(b)));
```

**Target:** 8-15 unique values for a well-designed system. If you see 30+, your spacing is ad-hoc and needs a system.

### Common Visual Problems and Their Fixes

```
SYMPTOM                              LIKELY CAUSE                    FIX
─────────────────────────────────────────────────────────────────────────────
Elements look "merged together"      Internal >= external spacing    Increase gap, decrease padding
One section feels "detached"         Too much margin above/below     Reduce to match siblings
Cards don't align across rows        No shared grid tracks           Use CSS Grid + subgrid
Text feels cramped                   Line-height < 1.4              Set line-height: 1.5-1.6
Text feels too airy                  Line-height > 1.8              Bring down to 1.5-1.6
Page feels "empty"                   Over-spacing (macro)            Tighten section padding
Page feels "cluttered"               Under-spacing, no hierarchy     Add macro whitespace between groups
Button text feels off-center         Unequal optical padding         Add 1-2px more to top (caps sit high)
Sidebar and main don't feel related  Gutter too wide                 Reduce to 24-32px
Hero → content transition is jarring Abrupt spacing change           Use fluid spacing for section padding
```

---

## Anti-Patterns

1. **"Magic number" spacing** — Pixel values scattered through CSS with no tokens or scale. Every spacing value should reference a token or scale step.

2. **Spacing with invisible elements** — Using empty divs or `<br>` tags for spacing instead of proper margin/padding/gap. Never use markup for presentation.

3. **Percentage padding for vertical space** — `padding: 10%` computes based on the element's WIDTH, not height. This almost never does what you expect for vertical spacing.

4. **Fixed spacing at every breakpoint** — Writing `padding: 16px` then `@media (min-width: 768px) { padding: 24px }` then `@media (min-width: 1024px) { padding: 32px }` when `clamp(1rem, 2vw + 0.5rem, 2rem)` handles all three.

5. **Mixing margin directions** — Some elements push with margin-bottom, others with margin-top, some with both. Pick ONE direction (margin-bottom is conventional) and stick with it, or use gap exclusively.

6. **Ignoring the content measure** — Lines of text wider than 75 characters are hard to read. Always constrain prose containers to 45-75ch (roughly 38-65rem at 16px body text).

7. **Copying spacing from Figma 1:1 without fluid adaptation** — Figma designs are fixed-width. Translating them to CSS without adding fluid scaling produces layouts that only look right at one viewport width.

8. **Using margin on flex/grid children for sibling spacing** — Use `gap` on the parent instead. Margin on children creates maintenance headaches and edge cases (first/last child exceptions).

9. **Spacing tokens that are too granular** — 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 pixel tokens. Nobody can distinguish 7px from 8px. Remove values that are not optically distinct (minimum 4px step between tokens).

10. **No spacing documentation** — If your design system does not have a published spacing scale with names, values, and usage guidelines, every developer will invent their own spacing, and they will all be different.

---

## Quality Checklist

Before shipping any layout:

- [ ] **Spacing scale defined** — All spacing values reference tokens from a defined scale (8-15 unique values max)
- [ ] **8px grid alignment** — All major spacing values are multiples of 8px (4px for fine adjustments)
- [ ] **Vertical rhythm** — Line heights and vertical margins align to a baseline grid
- [ ] **Internal < external** — Component padding is less than or equal to the gap between components
- [ ] **Fluid spacing** — Section padding and major gaps use `clamp()` for smooth scaling
- [ ] **Container max-width** — Prose content constrained to 45-75ch, page content to 1200px (or justified wider)
- [ ] **Mobile tested** — Spacing is not absurdly tight or absurdly generous on 375px viewport
- [ ] **Desktop tested** — Layout does not feel empty or over-spaced on 1440px+ viewport
- [ ] **Squint test passed** — Visual hierarchy is clear when you squint at the page
- [ ] **Margin direction consistent** — Margins go in one direction, or you use gap exclusively
- [ ] **No magic numbers** — No raw pixel values in CSS; everything uses tokens or calc with tokens
- [ ] **Gutter symmetry** — Left and right page gutters are equal and fluid
- [ ] **Interactive target sizes** — Buttons and links have at least 44x44px tap target (including padding)
- [ ] **Subgrid for card alignment** — Card grids use subgrid so headings, content, and CTAs align across rows
- [ ] **DevTools audit** — Spacing overlay shows no unexpected gaps, overlaps, or collapse artifacts
