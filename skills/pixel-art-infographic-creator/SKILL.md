---
license: Apache-2.0
name: pixel-art-infographic-creator
description: "Generate pixel art diagrams and infographics for recovery education articles in retro 16-bit game aesthetic"
allowed-tools: Read,Write,Edit,Bash(python:*,npm:*),WebFetch
category: Design & Creative
tags:
  - pixel-art
  - infographics
  - education
  - retro-gaming
---

# Pixel Art Infographic Creator

**Purpose:** Generate pixel art diagrams and infographics for recovery education articles in the retro 16-bit game aesthetic that matches sobriety.tools' brand identity.

## DECISION POINTS

**Topic Complexity Assessment:**
```
IF neuroscience diagram with >5 brain regions:
  → Use simplified 3-region grouping with color coding
  → Limit to 4 colors max from leather-ember palette
ELSE IF social interaction scene:
  → Use 2-3 pixel figures maximum
  → Focus on facial expressions (4x4 pixel faces)
  → Use speech bubbles for emotional states

IF data visualization needed:
  → Bar charts: 8px bars, 16px spacing
  → Timelines: horizontal, 32px height
  → Graphs: 64x64px maximum canvas
ELSE IF process flow:
  → Use 16x16px icons connected by 2px lines
  → Maximum 6 steps per flow
  → Arrow heads: 3-pixel triangles
```

**Canvas Size Selection:**
```
IF mobile-first article:
  → 320px width maximum
  → Portrait orientation preferred
ELSE IF desktop article:
  → 640px width maximum
  → Landscape orientation acceptable

IF detail-heavy diagram:
  → Break into 2-3 smaller panels
  → Use consistent 8px grid alignment
ELSE IF simple concept:
  → Single 256x256px canvas
  → Center composition with 32px margins
```

**Color Allocation Strategy:**
```
IF showing progression/timeline:
  → Start: leather_dark (#2d2319)
  → Progress: ember (#d97706) 
  → Success: active (#4a9d9e)
ELSE IF showing problems/solutions:
  → Problems: damage (#f87171)
  → Solutions: healing (#f4a261)
  → Background: parchment (#fef3c7)
ELSE IF neutral educational:
  → Primary: active (#4a9d9e)
  → Accent: ember (#d97706)
  → Outline: primary_outline (#1a1410)
```

## FAILURE MODES

**Text Blob Syndrome**
- *Detection:* Text requires >8pt font or looks cramped in pixel style
- *Diagnosis:* Too much text for pixel art medium
- *Fix:* Replace with icons/symbols, use callout boxes, or split into multiple panels

**Contrast Death Spiral**
- *Detection:* Text unreadable against background, colors blend together
- *Diagnosis:* Insufficient contrast ratio or missing outlines
- *Fix:* Add 2px black outline to all text, increase color value differences by 40%+

**Grid Chaos**
- *Detection:* Elements don't align, looks messy despite pixel art style
- *Diagnosis:* Not following 8px grid system
- *Fix:* Snap all elements to 8px increments, use rulers/guides in drawing tool

**Complexity Creep**
- *Detection:* Diagram requires zoom to read details, >6 distinct elements
- *Diagnosis:* Trying to show too much in single infographic
- *Fix:* Split into series of 2-3 simpler diagrams, focus on one concept per panel

**Anti-Aliasing Contamination**
- *Detection:* Soft edges, blurry appearance, doesn't look retro
- *Diagnosis:* Drawing tool using smoothing/anti-aliasing
- *Fix:* Disable all smoothing, use pencil tool only, work at 100% zoom minimum

## WORKED EXAMPLES

**Example 1: Addiction Brain Diagram**
```
Decision Process:
- Topic: Neuroscience (high complexity) → Simplify to 3 regions
- Canvas: Educational article → 320px width, portrait
- Colors: Showing damage/healing → Use damage/healing/active palette

Execution:
1. Draw 64x80px brain outline in primary_outline (#1a1410)
2. Fill regions: 
   - Prefrontal cortex (top): healing (#f4a261) - recovery area
   - Reward system (middle): damage (#f87171) - affected area  
   - Brain stem (bottom): active (#4a9d9e) - stable area
3. Add 2px outline around each region
4. Label with 8px pixel font: "PFC", "Reward", "Stem"
5. Add simple arrows showing connections (2px lines)

Novice miss: Would try to show 8+ brain regions with medical labels
Expert catch: Three clear regions with functional descriptions
```

**Example 2: Social Anxiety Recovery Timeline**
```
Decision Process:
- Topic: Timeline with progression → Use progression color scheme
- Format: Desktop article → 640px width landscape
- Data: 6-month timeline → Break into 3 phases

Execution:
1. Create horizontal timeline: 480x128px canvas
2. Three phases (160px each):
   - Month 1-2: leather_dark (#2d2319) background, anxious pixel figure
   - Month 3-4: ember (#d97706) background, practicing figure  
   - Month 5-6: active (#4a9d9e) background, confident figure
3. Pixel figures: 16x24px with 4x4px faces showing emotions
4. Connect with 2px arrow line showing progression
5. Add text boxes below: "Isolation" → "Practice" → "Connection"

Trade-off note: Sacrificed monthly detail for clear 3-phase story
```

**Example 3: Coping Skills Comparison Chart**
```
Decision Process:
- Topic: Data comparison → Bar chart format
- Complexity: 4 skills to compare → Within limits
- Audience: Mobile-first → 320px width

Execution:
1. Grid setup: 256x192px canvas, 8px grid
2. Four 32px-wide bars representing skill effectiveness:
   - Deep breathing: 48px height (active #4a9d9e)
   - Exercise: 64px height (active #4a9d9e)
   - Social support: 72px height (healing #f4a261)
   - Meditation: 56px height (active #4a9d9e)
3. 2px spacing between bars
4. Y-axis labels: pixel numbers 0-10
5. Icons above bars: lungs, weights, people, lotus (8x8px)

Expert insight: Used icons instead of text labels for mobile readability
```

## QUALITY GATES

- [ ] All text uses pixel font (Press Start 2P or equivalent)
- [ ] Every colored element has 1-2px black outline (#1a1410)
- [ ] No anti-aliasing or soft edges anywhere
- [ ] All elements snap to 8px grid alignment
- [ ] Color palette limited to 5 colors maximum from approved set
- [ ] Text readable at actual display size (no zoom required)
- [ ] Canvas width ≤320px (mobile) or ≤640px (desktop)
- [ ] Single concept focus (no more than 6 distinct elements)
- [ ] Consistent pixel size (no mixing 1px and 4px elements randomly)
- [ ] Background contrast ratio >4.5:1 with text/outlines

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**
- Photorealistic medical diagrams → Use `scientific-illustration` instead
- Complex data visualizations with >10 data points → Use `data-visualization-creator` instead  
- Animation or interactive elements → Use `interactive-media-creator` instead
- Fine typography or layout design → Use `publication-designer` instead
- Detailed anatomical accuracy → Use `medical-illustration` instead

**Delegate to other skills when:**
- Client wants smooth gradients or 3D effects
- Infographic needs real-time data integration
- Multiple languages/internationalization required
- Print resolution (300+ DPI) needed
- Accessibility compliance beyond basic contrast