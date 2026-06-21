# Typography Systems

## Core Principle

A modular type scale anchors all typographic decisions. **Never use `px`; always use `rem`** (root-relative units). This scales proportionally with system-wide text-size settings, respects user preferences (OS Dynamic Type), and enables semantic consistency. Base size: **1rem = 16px**.

**Hard rule**: Readable body prose is never smaller than **0.875rem (14px)**. Never use `text-xs` on connected prose. Labels can drop to **0.75rem (12px) only if uppercase, bold, and letter-spaced** (eyebrow labels).

---

## Decision Points

### 1. Which Type Scale Ratio?

| Ratio | Context | Example Systems |
|-------|---------|-----------------|
| **1.2** (minor third) | Tight, compact UI | Tailwind default; dense dashboards |
| **1.25** (major third) | Balanced, readable | Three Dogs design system; Material 3 (headings) |
| **1.333** (perfect fourth) | Generous, spacious prose | Apple HIG; long-form content |

**Choice rule**: Start with **1.25** for most interfaces. Use **1.2** if cramped (compact tables, sidebars). Use **1.333** for reading-heavy sites (docs, articles, blogs).

### 2. Scale Definition (1.25 Ratio Example)

```
text-xs:    0.64rem  (10.24px) - NEVER body text
text-sm:    0.8rem   (12.8px)  - Captions, fine print only
text-base:  1rem     (16px)    - Body baseline
text-lg:    1.25rem  (20px)    - Subheadings
text-xl:    1.563rem (25px)    - Card/section titles
text-2xl:   1.953rem (31.25px) - Page headings
text-3xl:   2.441rem (39px)    - Major headings
text-4xl:   3.052rem (49px)    - Hero/display text
```

**CSS variable template**:
```css
:root {
  --text-base: 1rem;
  --text-xs: calc(var(--text-base) / 1.5625);     /* ÷1.25² */
  --text-sm: calc(var(--text-base) / 1.25);
  --text-lg: calc(var(--text-base) * 1.25);
  --text-xl: calc(var(--text-base) * 1.5625);     /* ×1.25² */
  /* ... continue pattern */
}
```

---

## Size & Measure

### Line Height by Role

| Element | Height | Notes |
|---------|--------|-------|
| **Headings** | 1.1–1.2 | Tight; prevents awkward breaks |
| **Body prose** | 1.5–1.6 | Scannable, ~60 chars per line |
| **Long-form** | 1.75–2.0 | Generous for 70–80 char lines |
| **Code/tables** | 1.2–1.4 | Compact; values must align vertically |

**Formula**: Line height is **line-length dependent**. Long lines need tighter leading; short lines tolerate slack.

### Measure (Line Length)

**Optimal range: 45–75 characters per line** (using CSS `ch` unit for exact control).

```css
/* Body paragraph – constrain width */
.prose {
  max-width: 65ch;              /* ~85–90 words per line at base size */
  line-height: 1.6;
  font-size: 1rem;
}

/* Short labels/UI */
.label {
  max-width: 30ch;
  line-height: 1.2;
  font-size: 0.875rem;
}
```

---

## Font Pairing

**Rule: Never exceed 2 typefaces per product** (1 primary, 1 accent).

### Proven Pairings

| Primary | Accent | Pairing Type | Use Case |
|---------|--------|--------------|----------|
| Inter | Outfit | Sans/Sans geometric | UI + headings (modern) |
| System (-apple-system, Segoe UI) | Bricolage Grotesque | System/Geo | Accessible defaults |
| Charter | Fira Sans | Serif/Sans | Editorial/blog |
| IBM Plex Mono | IBM Plex Sans | Mono/Sans | Technical products |

**Font-stack template** (system-first for performance):
```css
--font-primary: 'Inter', system-ui, -apple-system, sans-serif;
--font-heading: 'Outfit', var(--font-primary);
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

---

## Variable Fonts & Weight Axes

Modern type systems use variable fonts for efficient, granular weight control. Instead of loading 400, 500, 700, load one `.ttf` and interpolate:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.ttf') format('truetype');
  font-weight: 100 900;   /* Full range */
  font-variation-settings: 'wght' 400;
}

body { font-weight: 400; }
strong { font-weight: 600; }
h1 { font-weight: 700; }
```

**Weight conventions**:
- 300–400: Body text, low emphasis
- 500–600: Buttons, medium emphasis
- 700+: Headings, strong emphasis

Variable fonts reduce HTTP requests and enable smooth animations (`font-weight` transitions).

---

## Web Font Loading & Performance

### FOUT vs FOIT Tradeoff

| Strategy | Behavior | Pro | Con |
|----------|----------|-----|-----|
| **FOUT** | Show fallback, swap when ready | No blank text | Flash of style change |
| **FOIT** | Invisible text until font loads | Consistent style | 3–4s blank screen (bad) |

**Best practice**: Use `font-display: swap`.

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;          /* FOUT — show fallback immediately */
}
```

**Subsetting** (reduce font file size):
```bash
# Include only Latin + common symbols
@font-face {
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC;
}
```

---

## Responsive Typography & Dynamic Type

### Fluid Type with `clamp()`

Scale font size fluidly between viewports without media queries:

```css
h1 {
  /* min: 2rem (32px), preferred: 5vw, max: 4rem (64px) */
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
}

body {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  line-height: 1.6;
}
```

**Why**: Avoids jarring jumps on resize; maintains readability across all devices.

### Respecting OS Text-Size Settings

**Critical for accessibility**: Use `rem` (or `em` for nested scaling), never `px`. iOS/macOS users who enlarge system text expect your UI to scale too.

```css
/* BAD: ignores OS setting */
body { font-size: 16px; }

/* GOOD: scales with OS */
body { font-size: 1rem; }

/* BETTER: scales with component context */
.button { font-size: 0.95em; }  /* relative to parent */
```

Test in Chrome DevTools → Settings → Rendering → Emulate CSS media feature (prefers-text-size).

---

## Advanced Typographic Features

### Numerals: Tabular vs Proportional

```css
/* Proportional (default): 1234 has variable widths */
.price { font-variant-numeric: proportional-nums; }

/* Tabular (aligned columns, financial data) */
.invoice { font-variant-numeric: tabular-nums; }

/* Old Style (for body, especially serif) */
.article { font-variant-numeric: oldstyle-nums; }
```

### Letter Spacing (Tracking)

```css
/* Headings: tighten slightly for impact */
h1 { letter-spacing: -0.02em; }

/* Labels: loosen for sophistication + scannability */
.label { letter-spacing: 0.08em; }

/* All-caps text: must loosen for readability */
.badge { text-transform: uppercase; letter-spacing: 0.12em; }
```

### Optical Sizing

Automatic weight/spacing adjustments at different sizes (requires variable font with `opsz` axis):

```css
h1 {
  font-optical-sizing: auto;   /* Browser adjusts spacing for large sizes */
  font-size: 3rem;
}

caption {
  font-optical-sizing: auto;
  font-size: 0.75rem;          /* Tightens for readability at small size */
}
```

---

## Vertical Rhythm

Align all elements to an invisible baseline grid for visual cohesion. Set base unit (typically 4px or 8px):

```css
:root {
  --baseline: 0.25rem; /* 4px */
  --line-height-base: 1.5;
  --line-height-px: calc(1rem * var(--line-height-base)); /* 24px at 16px base */
}

body {
  line-height: var(--line-height-base);
  margin-top: var(--line-height-px);     /* Multiples of baseline */
  margin-bottom: var(--line-height-px);
}

h1 {
  margin-top: calc(var(--line-height-px) * 2);
  margin-bottom: var(--line-height-px);
}
```

All margins/padding in multiples of the baseline unit (e.g., 4px, 8px, 12px, 16px, 24px).

---

## Anti-Patterns / Failure Modes

### 1. Mixing Pixel & Rem Units

**Symptom**: Some text scales with OS settings, other text freezes at fixed size. Inconsistent magnification on accessibility zoom.

**Detection rule**: Search codebase for `font-size: \d+px` (outside icon fonts, canvas, SVG).

**Fix**: Convert all typography to `rem`. Document exceptions (image text, SVG) in comments.

```css
/* BAD */
body { font-size: 16px; }
h1 { font-size: 32px; }

/* GOOD */
body { font-size: 1rem; }
h1 { font-size: 2rem; }
```

---

### 2. Body Text Below 14px

**Symptom**: Users increase browser zoom to 150%+. High cognitive load; poor accessibility audit score.

**Detection rule**: Audit all prose blocks (`<p>`, article content, table data). Flag `font-size < 0.875rem`.

**Fix**: Enforce minimum 0.875rem (14px) for all readable text. If cramped, reduce line-length instead.

```css
p, li, td { font-size: 1rem; min-font-size: 0.875rem; }
```

---

### 3. Inconsistent Line Heights Across Roles

**Symptom**: Headings crowd together; body text looks orphaned. Visual incoherence.

**Detection rule**: Measure actual line-height used in headings vs body. Should differ by ±0.2–0.3.

**Fix**: Define explicit line-height variables per role; apply consistently.

```css
:root {
  --lh-heading: 1.1;
  --lh-body: 1.6;
  --lh-label: 1.2;
}

h1, h2 { line-height: var(--lh-heading); }
p { line-height: var(--lh-body); }
.label { line-height: var(--lh-label); }
```

---

### 4. No Font Subsetting or Variable Fonts

**Symptom**: 200kb+ font files block first paint. Slow mobile experience.

**Detection rule**: DevTools → Network. Font files > 50kb for a single weight/style.

**Fix**: 
- Use variable fonts (single file, all weights).
- Subset to Latin only if supporting English only.
- Use `font-display: swap` to avoid FOIT.

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
  font-display: swap;
  size-adjust: 102%;  /* Adjust baseline if fallback differs */
}
```

---

### 5. Excessive Typeface Families

**Symptom**: 4+ font families loaded. Design looks scattered; file size bloat.

**Detection rule**: Count unique `font-family` declarations. Should be ≤2.

**Fix**: Consolidate to primary + accent. Use weights and styles of the same family for variety.

```css
/* BAD */
h1 { font-family: 'Playfair Display'; }
h2 { font-family: 'Montserrat'; }
body { font-family: 'Lato'; }

/* GOOD */
:root {
  --font-display: 'Outfit', sans-serif;    /* headings */
  --font-body: 'Inter', sans-serif;        /* body text */
}

h1, h2 { font-family: var(--font-display); }
body { font-family: var(--font-body); }
```

---

### 6. Not Respecting `prefers-color-scheme` or Text-Size Preferences

**Symptom**: In dark mode, white text on light gray background (low contrast). OS text-size changes don't apply.

**Detection rule**: Test in Safari/iOS Settings → Accessibility → Larger Accessibility Sizes. Zoom to 200%. Text should enlarge proportionally.

**Fix**: 
- Use `rem` for all font sizes (not `px`).
- Test with browser zoom + OS accessibility settings.
- Validate contrast (WCAG AA: 4.5:1 for body, 3:1 for large text).

```css
/* Use rem */
body { font-size: 1rem; }

/* Fallback for light backgrounds */
@media (prefers-color-scheme: dark) {
  body { color: #f5f5f5; }
  a { color: #64b5f6; }
}
```

---

### 7. Improper Tracking/Letter-Spacing on All-Caps Text

**Symptom**: All-caps labels feel cramped; hard to read. Violates typographic convention.

**Detection rule**: Find `text-transform: uppercase` without `letter-spacing > 0.05em`.

**Fix**: All-caps text must have explicit letter-spacing (0.08–0.12em minimum).

```css
/* BAD */
.badge { text-transform: uppercase; }

/* GOOD */
.badge {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}
```

---

### 8. Line Length Without Constraint

**Symptom**: On desktop, body text spans full width (100+ characters). Eye fatigue; hard to find next line.

**Detection rule**: Measure character count per line. Should be 45–75 ch.

**Fix**: Always set `max-width` on prose containers.

```css
.prose {
  max-width: 70ch;
  margin-left: auto;
  margin-right: auto;
}
```

---

## Worked Example: Before & After

### Before (Broken)

```css
body {
  font-family: Arial, sans-serif;
  font-size: 12px;              /* WRONG: too small, px unit */
  line-height: 1;               /* WRONG: too tight */
  color: #999;                  /* Low contrast */
}

h1 {
  font-family: 'Playfair Display', serif;  /* New typeface! */
  font-size: 48px;              /* WRONG: px unit, no scaling */
  line-height: 1.2;
  margin: 20px 0;               /* WRONG: not a multiple of baseline */
}

.button {
  font-size: 10px;              /* WRONG: illegible */
  text-transform: uppercase;
  /* Missing letter-spacing */
}
```

**Issues**:
- 12px body text fails accessibility (< 0.875rem).
- Mixing typefaces (Arial + Playfair) looks incoherent.
- `px` units ignore OS text-size and zoom.
- All-caps button has no tracking.
- Line-height is universally too tight.

### After (Fixed)

```css
:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', var(--font-body);
  --text-base: 1rem;
  --lh-tight: 1.1;
  --lh-normal: 1.6;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);  /* 1rem = 16px, scales with OS */
  line-height: var(--lh-normal);
  color: #2b2d42;               /* High contrast: ~13:1 on white */
  max-width: 70ch;              /* Constrain line length */
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);  /* Fluid scaling */
  line-height: var(--lh-tight);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.button {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}
```

**Results**:
- Body text is 16px (accessible minimum).
- Single typeface pair (Inter + Outfit) → cohesive design.
- All units in `rem` → respects OS settings & zoom.
- All-caps text has proper tracking.
- Line-height and spacing are intentional.

---

## Quality Gates Checklist

- [ ] All font sizes in `rem`, not `px` (except icon fonts, canvas).
- [ ] No body text < 0.875rem (14px).
- [ ] Eyebrow labels ≤ 12px **only if** uppercase + bold + tracked.
- [ ] Type scale ratio consistent (1.2, 1.25, or 1.333); all sizes derived from base.
- [ ] Headings use 1.1–1.2 line-height; body uses 1.5–1.6.
- [ ] Max line-length on prose: 45–75ch (constrain with `max-width`).
- [ ] No more than 2 typeface families.
- [ ] Font files use `font-display: swap` and subsetting.
- [ ] Variable fonts loaded instead of multiple weight files.
- [ ] All-caps text has `letter-spacing ≥ 0.08em`.
- [ ] Contrast ratio ≥ 4.5:1 body, ≥ 3:1 large text (WCAG AA).
- [ ] Tested with OS text-size zoom (Safari 200%, iOS Accessibility).
- [ ] Vertical rhythm: all margins/padding in multiples of baseline unit (4px or 8px).
- [ ] `clamp()` used for responsive font-size (avoid media query jump).
- [ ] No orphan or widow text (lines break semantically in headings).

---

## References

- **Material Design 3 Type Scale**: `https://m3.material.io/styles/typography/overview`
- **Apple Human Interface Guidelines (Dynamic Type)**: `https://developer.apple.com/design/human-interface-guidelines/typography`
- **Tailwind CSS Type Scale**: `https://tailwindcss.com/docs/font-size`
- **Typescale (generator)**: `https://typescale.com`
- **WCAG 2.1 Text Contrast**: `https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum`
