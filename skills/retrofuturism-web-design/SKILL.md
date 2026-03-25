---
license: Apache-2.0
name: retrofuturism-web-design
description: Web design inspired by retrofuturism — the future as imagined by the past. Covers Atomic Age/Googie, Raygun Gothic, Cassette Futurism (Alien terminals), Y2K chrome/iridescent, Solarpunk eco-optimism, and Fallout/BioShock Art Deco. Each sub-genre with palettes, fonts, CSS, and layout patterns. Activate on 'retrofuturism', 'retro-futuristic', 'cassette futurism', 'Y2K aesthetic', 'Googie', 'Raygun Gothic', 'solarpunk', 'Pip-Boy', 'FUI', 'fantasy UI', 'sci-fi terminal', 'atompunk', 'space age', 'retro sci-fi'. NOT for vaporwave/glassmorphism (use vaporwave-glassomorphic-ui-designer), Windows retro (use windows-95-web-designer), general retro web (use web-design-expert).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - retrofuturism
    - cassette-futurism
    - Y2K
    - googie
    - raygun-gothic
    - solarpunk
    - atompunk
    - FUI
    - retro-sci-fi
    - web-design
  pairs-with:
    - skill: web-design-expert
      reason: Broader design strategy to anchor a retrofuturist aesthetic within
    - skill: windows-95-web-designer
      reason: Shared retro computing vocabulary, can blend cassette futurism with Win95
    - skill: typography-expert
      reason: Each sub-genre demands very specific typeface choices
    - skill: vibe-matcher
      reason: Route ambiguous "retro" requests to the correct sub-genre
category: Design & Creative
tags:
  - retrofuturism
  - web-design
  - retro
  - futuristic
  - aesthetic
---

# Retrofuturism Web Design

Creates web experiences channeling **the future as imagined by the past** — nostalgia for futures that never were. Translates six distinct retrofuturist sub-genres into production CSS, layouts, and interaction patterns.

## Decision Points

### 1. Sub-Genre Selection by Era Cues
```
Brief mentions → Route to
├─ "1950s space age" → Atomic Age/Googie
├─ "Art Deco rockets" → Raygun Gothic  
├─ "terminal screens" → Cassette Futurism
├─ "chrome bubble" → Y2K Futurism
├─ "green tech optimism" → Solarpunk
└─ "Pip-Boy/Fallout" → Fallout Deco
```

### 2. Layout Strategy by Sub-Genre
```
If Cassette Futurism:
├─ Mobile: Stack terminals vertically, 16px spacing
├─ Tablet: 2-column grid, left=nav, right=content
└─ Desktop: 3-column grid with sidebar terminals

If Y2K/Atomic Age:
├─ Mobile: Bubble cards, centered stack
├─ Tablet: Masonry grid with asymmetric shapes
└─ Desktop: Flexbox with boomerang/bubble overlays

If Raygun Gothic/Solarpunk:
├─ Mobile: Full-width panels, vertical rhythm
├─ Tablet/Desktop: CSS Grid, 12-column with golden ratio
└─ Emphasis on vertical lines and organic curves
```

### 3. Breakpoint Rules by Visual Density
```
If scan lines/CRT effects:
├─ Mobile: Disable scan lines (performance)
├─ Tablet: Light scan lines (2px spacing)
└─ Desktop: Full CRT effect (1px spacing)

If chrome/metallic gradients:
├─ Mobile: Flat colors only
├─ Tablet: Simple 2-stop gradients
└─ Desktop: Complex multi-stop chrome effects
```

### 4. Animation Intensity Ladder
```
User Experience Level:
├─ First visit: Full boot sequence (3s max)
├─ Return visit: Skip to steady state
├─ `prefers-reduced-motion`: Static only
└─ Mobile/slow connection: Reduce all animations 50%
```

## Failure Modes

### Saturation Overload
**Symptom:** Every element glows, blinks, or shimmers simultaneously
**Detection:** More than 3 animated elements visible at once
**Fix:** Tone down intensity 20%, limit animations to hero + 1 accent element

### Serif-Sans Clash
**Symptom:** Art Deco serif (Raygun Gothic) mixed with tech mono (Cassette)
**Detection:** Two different sub-genre fonts in same viewport
**Fix:** Pick ONE sub-genre or create explicit transition boundaries

### Chrome Excess
**Symptom:** Gradients everywhere cause visual fatigue and performance lag
**Detection:** >5 complex gradients on single page, FPS drops below 30
**Fix:** Limit chrome to accent elements only, use flat colors for backgrounds

### Accessibility Abandonment
**Symptom:** Amber CRT text at 12px, no focus indicators
**Detection:** Body text contrast <4.5:1, scan lines interfere with reading
**Fix:** Increase font size, make overlays subtle, add high-contrast mode toggle

### Era Confusion
**Symptom:** Mixing Y2K bubbles with Fallout steel panels randomly
**Detection:** Visual elements from 3+ different decades in same section
**Fix:** Define transition zones or stick to single sub-genre per page

## Worked Examples

### Example 1: Cassette Futurism Dashboard
**Brief:** "Make our DevOps dashboard look like the Alien computer terminals"

**Decision Process:**
1. Era cue "Alien terminals" → Cassette Futurism
2. Dashboard = data-heavy → Grid layout essential
3. Mobile users need scan lines disabled → Performance rules
4. Amber on black → Contrast check required

**Layout Strategy:**
- Mobile: Single column stack, 16px gaps
- Desktop: 3-column grid (sidebar, main, alerts)
- Terminal cards: 20px padding, CRT border radius
- Scan lines: CSS pseudo-element, `pointer-events: none`

**Trade-offs Made:**
- Sacrificed authentic 80s boxy proportions for mobile usability
- Used amber (#FFB000) instead of pure green for better contrast
- Limited boot animation to page load only, not every card update

**Quality Gates Hit:**
- ✅ WCAG AA contrast (amber on dark gray = 7.2:1)
- ✅ Focus indicators: 2px amber outline
- ✅ Responsive grid maintains terminal aesthetic
- ✅ Performance: <100ms frame times with scan lines

### Example 2: Y2K E-commerce Landing
**Brief:** "Early 2000s iMac aesthetic for our bubble tea brand"

**Decision Process:**
1. "iMac aesthetic" → Y2K Futurism
2. E-commerce = conversion focus → Bubble buttons essential
3. Brand colors clash with pure chrome → Adaptation needed
4. Accessibility vs. glossy chrome → Compromise required

**Implementation:**
- Hero: Iridescent gradient background, toned to 60% opacity
- Product cards: Chrome effect on borders only, white backgrounds
- CTAs: Bubble buttons with brand pink, maintained chrome highlight
- Typography: Quicksand for readability over pure Y2K Impact

**Novice vs Expert Catches:**
- **Novice missed:** Chrome gradients everywhere slow mobile performance
- **Expert caught:** Limited chrome to accents, flat colors for backgrounds
- **Novice missed:** Pure iridescent text unreadable
- **Expert caught:** Used iridescent as background, dark text overlay

## Quality Gates

- [ ] Single sub-genre chosen with clear era rationale documented
- [ ] Color palette tested for WCAG AA contrast (4.5:1 minimum on body text)
- [ ] Typography matches period (no Comic Sans on Raygun Gothic)
- [ ] Layout patterns reflect era constraints (boxy for CRT, organic for Solarpunk)
- [ ] Interactive elements have clear focus states with period-appropriate styling
- [ ] Animations respect `prefers-reduced-motion` media query
- [ ] Mobile performance acceptable (<100ms frame times with effects enabled)
- [ ] CSS custom properties defined for complete color system
- [ ] Decorative overlays (scan lines) use `pointer-events: none`
- [ ] Load performance under 3s on 3G (gradient-heavy styles optimized)

## Not For

**Route to other skills:**
- Vaporwave/glassmorphism with blur effects → **vaporwave-glassomorphic-ui-designer**
- Windows 95/3.1 retro computing → **windows-95-web-designer**
- Modern clean sci-fi (no nostalgia) → **dark-mode-design-expert**
- Trust-critical interfaces (banking, healthcare) → **web-design-expert**
- General 80s/90s nostalgia without sci-fi → **retro-web-designer**

**Context boundaries:**
- Entertainment, portfolios, creative tools: ✅ Use this skill
- Government, finance, medical: ❌ Too playful, undermines trust
- E-commerce: ✅ Only if brand personality matches chosen era
- SaaS dashboards: ✅ Cassette Futurism works, others too distracting