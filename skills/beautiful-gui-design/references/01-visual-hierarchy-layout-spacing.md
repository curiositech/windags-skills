# Visual Hierarchy, Layout & Spacing

**Visual hierarchy is the art of making some elements more prominent than others through spatial relationships, sizing, color, and alignment.** Layout grids and spacing systems create the invisible structure that guides the eye from entry point through reading order to exit. Proper hierarchy reduces cognitive load, accelerates task completion, and makes complex interfaces feel organized rather than overwhelming. This document covers Gestalt principles, the 8pt/4pt spacing system, layout archetypes, focal point design, and density trade-offs across web, desktop (Electron/Tauri), and native platforms.

## Decision Points

### Hierarchy-First Design: Entry Point vs. Reading Order

Before sketching wireframes, decide: **What is the one action/data the user must see first?** This becomes your focal point (highest contrast, largest size, or isolation). Everything else arranges in secondary tiers.

```
Hierarchy Tier Priority Logic
├─ Focal Point (Primary Action/Data)
│  ├─ 1x heading size (e.g., 32px for h1)
│  ├─ Highest contrast ratio (WCAG AAA preferred)
│  ├─ Isolated with whitespace on 3+ sides
│  └─ Strategic position (top-left for Western eye flow, center for hero)
│
├─ Secondary (Supporting Info / Secondary Actions)
│  ├─ 0.75x focal size
│  ├─ WCAG AA contrast (4.5:1 text, 3:1 UI elements)
│  └─ Adjacent to focal, clear grouping
│
└─ Tertiary (Metadata, Help Text, Disabled States)
   ├─ 0.6x focal size
   ├─ Reduced saturation or opacity (0.65-0.75 alpha)
   └─ Visually separate grouping
```

### Spacing System Selection: 8pt vs. 4pt Base

**8pt grid** is the industry standard for most UI work (Material Design 3, Apple HIG modern era, Tailwind, shadcn/ui, Radix). Use 8px increments for padding, margins, gaps, and border-radius. **4pt grid** for micro-interactions: badge size tweaks, icon padding, or fine-tuning line heights.

```
Spacing Decision Tree
├─ Desktop web (dashboard, app, SaaS)
│  └─ 8pt base → 8, 16, 24, 32, 40, 48, 56, 64, 72px
│
├─ Mobile-first or compact web
│  └─ 8pt base → same scale (responsive breakpoints reduce padding)
│
├─ Native iOS/macOS (Apple HIG)
│  ├─ iOS: 8pt base (with optical adjustment guidance)
│  └─ macOS: 8pt base + 4pt refinement for pro tools
│
├─ Android Material 3
│  └─ 4pt base grid (4, 8, 12, 16, 20, 24, 28, 32, 36, 40...)
│     BUT express in 8pt increments for web parity
│
└─ Electron / Tauri Desktop
   └─ 8pt base (web-style, easy port from web codebase)
```

**Never mix bases in a single project.** If Android requires 4pt strict compliance, declare "Android runs 4pt native; web uses 8pt" and map conversions explicitly.

### Layout Archetypes: When to Use Each Pattern

Choose your dominant layout based on user task and information structure:

| **Archetype** | **Use Case** | **Grid/Cols** | **Optimal Width** | **Key Spacing** |
|---|---|---|---|---|
| **Single Column** | Marketing, docs, prose | 1 (prose) | 600-700px (measure/CJK-aware) | Large margins 40-80px |
| **12-Column Grid** | Dashboards, content layouts | 12 (4-col sections) | Full-bleed or 1200-1400px | 16-24px gutter, 24-40px margins |
| **List-Detail** | Email, file browser, settings | 2 (sidebar + main) | 250-300px list + remainder | 16px gap, list 8-16px padding |
| **Dashboard** | Analytics, monitoring | 12 or 4-column | Full responsive | 16-24px gutter, card spacing 16-32px |
| **Feed** | Social, activity streams | 1-2 columns, infinite scroll | 400-600px card width | 16px gap, 24px top margin (next item) |
| **Settings/Forms** | Preferences, onboarding | 2 (label + control) or stacked | 600-900px max-width | 16px between fields, 24-32px between groups |
| **Wizard/Stepper** | Multi-step flow | Full-width step content | Full width | 8px step indicator, 32px between steps |

### Alignment & Optical Adjustment: The Gestalt Influence

Alignment is **perceived** as much as actual. A left-aligned column of text with numbers appears off-center due to number width variance. Use optical adjustment (small margin tweaks, typically 2-4px) to correct this.

**Gestalt Principles for Hierarchy**:
- **Proximity** → Items close together = related. Use consistent spacing between groups (16px intra-group, 24-32px inter-group).
- **Similarity** → Same color/shape/size = same importance. Break similarity to highlight exceptions.
- **Continuity** → Eyes follow lines and edges. Align baseline text, use aligned grids.
- **Closure** → Users perceive incomplete shapes as complete. Borders or dividers create implicit grouping.
- **Contrast** → Difference in size, color, or weight signals hierarchy. At least 1.5-2x size ratio for distinct tiers.

## Spacing Scale (8pt Base)

**Apply consistently within a project; document exceptions.**

```
Scale Tier      Pixels    Use Case
────────────────────────────────────────────────────────────
xxs             4px       Icon padding, tight badge spacing
xs              8px       Button padding (vert), input borders
sm              12px      Stacked button label padding
md              16px      Standard padding, list item spacing, gutter
lg              24px      Section spacing, card margin
xl              32px      Major section spacing, modal padding
xxl             40px      Page margins, hero spacing
3xl             48px      Large section breaks
4xl             64px      Page-level margins, full-width layouts
5xl             80px      Hero sections, marketing pages
```

### Responsive Scaling by Breakpoint

Desktop padding ≠ mobile padding. Scale margins down, keep intrinsic element padding (button, input) constant.

```css
/* 8pt base system example */
.card {
  padding: 24px;        /* md: 16px + lg: 8px */
  margin: 32px;         /* xl tier */
}

/* Mobile adjustment */
@media (max-width: 768px) {
  .card {
    padding: 16px;      /* drop to md */
    margin: 16px;       /* drop to md */
  }
}
```

## Layout Grids Across Platforms

### Web: 12-Column Grid (1200-1440px Container)

**Standard approach** for responsive dashboards and content sites.

```
Container width: 1200px (breakpoint: 1440px on large monitors)
Columns: 12
Gutter: 16px (8px left + 8px right per column)
Margin (left/right): 24px (tablet), 40px (desktop), 16px (mobile)

Example 12-col breakdown:
Full-width:        12 cols
Half-width:         6 cols (sidebar layout)
Third-width:        4 cols (card grid)
Quarter-width:      3 cols (dense grid)
Sixth-width:        2 cols (form labels)
```

**Responsive breakpoints (Tailwind convention)**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Adjust column count by breakpoint:
```
Mobile (< 640px):   1-2 columns
Tablet (640-1024):  2-4 columns
Desktop (>1024):    4-12 columns (context-dependent)
```

### Native iOS/macOS: Safe Areas & Margins

**iOS Safe Area** (notches, Dynamic Island):
```
Top:    44px (landscape) / 48px (portrait)
Bottom: 34px (with home indicator) / 0px (devices without)
Side:   16px on each side

Content padding: 16px from safe area edge
Typography hierarchy:
- Large Title: 34px
- Title 1: 28px
- Title 2: 22px
- Title 3: 20px
- Body: 17px
- Callout: 16px
- Subheadline: 15px
- Footnote: 13px
- Caption 1: 12px
```

**macOS Inset Area** (menu bar, dock):
```
Top margin:    8-16px from window top
Side margins:  16-20px from window edge
Content area:  Respects system text size (11-16pt base)

Window padding: 20px for standard app windows
               8px for utility/inspector panels
```

### Android Material Design 3: 4pt Grid

Material Design 3 uses a strict 4pt base, but express as 8pt increments in cross-platform design tokens:

```
Semantic spacing (Material 3):
- Extra small: 4px (use sparingly; prefer 8px for web parity)
- Small: 8px
- Medium: 16px
- Large: 24px
- Extra large: 32px

Safe margin: 16px minimum from device edge
```

### Electron / Tauri Desktop: OS Conventions + Web Flexibility

Hybrid: respect OS title bar, use web grid internally.

```
Window chrome:
- macOS: 16px margin from window edge, 60px title bar
- Windows: 0px margin (maximized), 32px title bar
- Linux: varies by WM

Content area: 8pt grid, 24-40px margins
```

## Z-Axis Hierarchy: Elevation & Depth

**Elevation creates visual hierarchy through shadow, layering, and z-index.**

Material Design 3 elevation tokens (translate to px values for box-shadow):

```
Level 0:  No elevation (background, base surface)
          box-shadow: none

Level 1:  Subtle lift (inputs, cards at rest)
          box-shadow: 0 2px 4px rgba(0,0,0,0.1)

Level 2:  Moderate (inputs on hover, cards in flow)
          box-shadow: 0 4px 8px rgba(0,0,0,0.12)

Level 3:  Prominent (modals, dropdowns, toasts)
          box-shadow: 0 8px 16px rgba(0,0,0,0.15)

Level 4:  Maximum (popovers, drag overlay)
          box-shadow: 0 16px 32px rgba(0,0,0,0.2)

Z-index scale (Radix/shadcn conventions):
10:  dropdowns, tooltips
20:  modals, dialogs
30:  sticky headers
40:  floating buttons (FAB)
50:  notifications, snackbars
```

**Depth and contrast work together:**
- Dark surface: darker shadow, stronger contrast.
- Light surface: lighter shadow, use color shift instead of pure black.

## Density vs. Whitespace: The Trade-Off

**High Density** (compact): more info per screen, less scrolling, steeper learning curve.
**High Whitespace** (loose): fewer choices, clearer hierarchy, slower-paced but less cognitive load.

### Decision: When to Use Each

```
Use HIGH DENSITY if:
├─ Power users (internal tools, Pro dashboards)
├─ Information-dense tasks (financial analysis, data entry)
├─ Limited vertical real estate (mobile, embedded)
└─ Users want full dataset visible at once

Use HIGH WHITESPACE if:
├─ Consumer-facing products (consumer SaaS, e-commerce)
├─ First-time users (onboarding, marketing)
├─ Accessibility priority (low-vision, dyslexia support)
└─ Complex decision-making (medical, legal)
```

### Spacing Tuning by Density

| **Tier** | **List Item Height** | **Card Padding** | **Button Padding (h × w)** | **Gap** | **Use Case** |
|---|---|---|---|---|---|
| Loose | 56-64px | 24px | 12 × 24px | 24px | Consumer, first-run |
| Standard | 40-48px | 16px | 8 × 16px | 16px | Balanced UIs, most apps |
| Compact | 32-40px | 12px | 6 × 12px | 12px | Power users, dashboards |
| Ultra-dense | 24-32px | 8px | 4 × 8px | 8px | Spreadsheets, DevTools |

**Never go below 32px list item height on touch (iOS/Android).** Finger size = ~48-54px; 32px is minimum for accidental-tap forgiveness.

## Anti-Patterns & Failure Modes

### Anti-Pattern: Inconsistent Spacing Units
**Symptom**: Paddings are 10px, 14px, 19px, 23px — no clear system.
**Detection Rule**: Audit a 5-screen sample; count unique spacing values. >8 unique values = crisis.
**Fix**: Adopt 8pt base immediately. Audit and consolidate all existing spacing to nearest valid value. Document the scale in design tokens (CSS custom properties, Figma library).

```css
/* Right */
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
```

### Anti-Pattern: Hierarchy Without Contrast
**Symptom**: "Primary" and "secondary" buttons look almost identical; user has to read labels.
**Detection Rule**: Squint at the screen; if you still can't distinguish focal point, hierarchy failed.
**Fix**: Use 2x size difference minimum, or 1.5x + color/weight shift. Avoid same-size, same-weight elements styled only by color.

```jsx
/* Bad: Only color difference */
<button style={{padding: '8px 16px', fontSize: '14px', color: 'blue'}}>Primary</button>
<button style={{padding: '8px 16px', fontSize: '14px', color: 'gray'}}>Secondary</button>

/* Good: Size + color + weight */
<button style={{padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', color: 'blue'}}>Primary</button>
<button style={{padding: '8px 16px', fontSize: '14px', fontWeight: 'normal', color: 'gray'}}>Secondary</button>
```

### Anti-Pattern: Misaligned Grids Across Breakpoints
**Symptom**: On desktop, 12-col grid aligns nicely. On mobile, grid collapses to 1 col but content padding shifts, throwing off margins.
**Detection Rule**: Use browser DevTools grid overlay; look for margin gaps that appear/disappear at breakpoints.
**Fix**: Set explicit max-width on container and consistent margin logic:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;  /* desktop */
}
@media (max-width: 768px) {
  .container {
    padding: 0 16px;  /* tablet/mobile */
  }
}
```

### Anti-Pattern: Optical Misalignment (Icons vs. Text)
**Symptom**: Icon + text in a button look off-center even though CSS says `display: flex; align-items: center`.
**Detection Rule**: Place a ruler on screen; measure actual pixel distance from icon to text baseline.
**Fix**: Add 2-4px optical adjustment via negative margin or transform:

```jsx
/* CSS-in-JS example */
const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    margin-top: 2px;  /* optical adjustment for text baseline */
  }
`;
```

### Anti-Pattern: Ignoring Safe Areas (Native)
**Symptom**: iOS modal buttons are obscured by home indicator or notch.
**Detection Rule**: Run on actual iPhone 14 Pro; check if any interactive element is within 34px of bottom or 44px of top.
**Fix**: Use `env(safe-area-inset-*)` CSS variables or SwiftUI `.safeAreaInset()`:

```css
/* CSS */
.modal {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

### Anti-Pattern: Arbitrary Z-Index Stack
**Symptom**: Sometimes dropdown appears behind modal; sometimes on top. Z-index values are 999, 9999, 99999.
**Detection Rule**: Grep for `z-index` in codebase; if >3 semantic values, refactor.
**Fix**: Define and centralize z-index layers:

```css
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 30;
  --z-modal: 100;
  --z-toast: 200;
}
```

### Anti-Pattern: Fixed Widths Ignoring Viewport
**Symptom**: Layout is hard-coded to 1200px; on mobile (375px), content is invisible or scrolls sideways.
**Detection Rule**: Open DevTools mobile view; if horizontal scroll appears, fixed width is culprit.
**Fix**: Use `max-width` with responsive padding:

```css
.main {
  max-width: 1200px;
  width: 100%;
  padding: 0 24px;
  margin: 0 auto;
}
```

### Anti-Pattern: Whitespace That Confuses Grouping
**Symptom**: Three related fields have 24px gaps between them, and 24px gap to unrelated field below. User doesn't know what's grouped.
**Detection Rule**: Show to another person; if they group items wrong, spacing hierarchy failed.
**Fix**: Use larger inter-group gaps (32px) and smaller intra-group gaps (16px):

```css
.form-group {
  margin-bottom: 16px;  /* intra-group */
}
.form-group + .form-group {
  margin-top: 32px;     /* inter-group */
}
```

## Worked Example: Dashboard Redesign

**Before**: Marketing dashboard with unclear hierarchy.
```
[Logo]
================== DASHBOARD ==================

User: Alice | Views: 1,234 | Clicks: 567 | CTR: 45.9%

Q1 Performance
Revenue: $45,670   Conversion: 8.3%   AOV: $234   Traffic: 12,340

Q2 Forecast
Est. Revenue: $52,000   Est. Conversion: 9.1%

Action Items:
- Optimize landing page
- A/B test CTA
- Improve email follow-up
```

**Issues**:
1. No visual hierarchy — all text is same size (14px).
2. Inconsistent spacing (sometimes 8px, sometimes unclear).
3. No color or weight differentiation.
4. Numbers and labels crammed together.

**After**: Redesigned with hierarchy, spacing system, and Material 3 elevation.

```
[Brand Logo]

KPI Summary (Elevated cards, 24px spacing)
┌─────────────────┬─────────────────┬─────────────────┐
│ VIEWS          │ CLICKS          │ CTR             │
│ 1,234          │ 567             │ 45.9%           │
│ ↑ 12% vs Q1    │ ↑ 8% vs Q1      │ ↑ 2.1% vs Q1    │
└─────────────────┴─────────────────┴─────────────────┘

Quarterly Performance (Focal section, md: 16px padding)
═════════════════════════════════════════════════════

Q1 Results (bold, 20px heading)
Revenue $45,670 · Conversion 8.3% · AOV $234

Q2 Forecast (secondary heading, 16px)
Est. Revenue $52,000 · Est. Conversion 9.1%

Recommendations (Tertiary, 14px, reduced opacity)
• Optimize landing page for mobile conversion
• A/B test CTA messaging and color
• Improve email follow-up sequence
```

**Design decisions**:
- **Focal point**: KPI cards (highest elevation, largest font, strong color).
- **Spacing**: 24px between sections (lg), 16px within cards (md), 8px between label and value (xs).
- **Grid**: 12-col, 3-col cards on desktop (4 cols each), stacked on mobile.
- **Typography**: H1 (32px) for title, H2 (24px) for sections, body (16px) for content, caption (12px) for meta.
- **Elevation**: Cards at Level 2 (subtle shadow), section headers at Level 0 (none), search bar at Level 1.

## Layout Archetype Deep Dive: List-Detail

**Use case**: Email inbox, file manager, Jira board, Figma pages panel.

```
Desktop Layout (1200px)
┌──────────────┬────────────────────────────────┐
│ List (300px) │ Detail (remainder)             │
│              │                                │
│ - Item 1     │ Full item content, actions     │
│ - Item 2     │ (edit button, metadata, etc.)  │
│ - Item 3     │                                │
│              │                                │
└──────────────┴────────────────────────────────┘

Mobile Layout
┌──────────────────────┐
│ List (full width)    │
│                      │
│ - Item 1    [detail] │  ← tap to expand or navigate
│ - Item 2    [detail] │
│ - Item 3    [detail] │
└──────────────────────┘
(Detail shows as modal or next page)

Spacing Rules:
├─ List container: 16px padding
├─ List item height: 48-56px (dense) / 56-64px (loose)
├─ List item padding: 12px vert, 16px horiz
├─ Gap between list and detail: 16px (tablet) / 0px (mobile)
├─ Detail panel padding: 24px
└─ Selection indicator: 4px left border (accent color)
```

## Quality Gates Checklist

- [ ] **Spacing system documented**: All spacing values map to 8pt base; deviations justified and flagged.
- [ ] **Hierarchy contrast verified**: Focal, secondary, and tertiary elements are visually distinct (size, color, weight, position).
- [ ] **Grid alignment tested**: Place a screenshot grid overlay; no content falls between grid lines.
- [ ] **Safe areas respected**: iOS/macOS content inset from safe area; Android 16px margin from edge.
- [ ] **Responsive scaling validated**: Breakpoints tested (640px, 768px, 1024px, 1440px) on real devices; no horizontal scroll, no text overflow.
- [ ] **Elevation coherent**: Shadow values map to z-index tiers; modals always above dropdowns.
- [ ] **Typography hierarchy applied**: At least 3 distinct font sizes with clear usage rules.
- [ ] **Color contrast checked**: All text ≥4.5:1 (WCAG AA); UI elements ≥3:1.
- [ ] **Density appropriate**: List items ≥32px (touch), ≥24px (desktop); whitespace consistent with audience.
- [ ] **Optical adjustments applied**: Icons aligned to text baseline; numbers right-aligned; borders crisp (1px minimum).
- [ ] **Design tokens in code**: CSS custom properties or design system tokens used; no magic numbers in components.
- [ ] **Cross-platform consistency**: Same spacing/hierarchy logic across web, desktop (Electron/Tauri), and native versions.
