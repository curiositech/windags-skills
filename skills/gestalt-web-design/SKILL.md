---
license: Apache-2.0
name: gestalt-web-design
description: Applies Gestalt psychology principles to web layout, spacing, grouping, and visual hierarchy. Proximity, similarity, closure, continuity, figure-ground, common fate, Pragnanz — translated into CSS, component structure, and information architecture. Activate on 'gestalt', 'visual grouping', 'proximity spacing', 'visual hierarchy', 'perceptual organization', 'layout psychology', 'whitespace strategy'. NOT for color theory (use color-theory-palette-harmony-expert), not for accessibility auditing (use design-accessibility-auditor).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - gestalt
    - visual-hierarchy
    - layout
    - spacing
    - perception
    - ux-psychology
    - grouping
  pairs-with:
    - skill: ux-friction-analyzer
      reason: Gestalt violations are a primary source of UX friction
    - skill: human-centered-design-fundamentals
      reason: Gestalt is the perceptual backbone of human-centered design
    - skill: web-design-expert
      reason: Gestalt principles inform every layout and spacing decision
category: Design & Creative
tags:
  - gestalt
  - web-design
  - perception
  - visual-principles
  - ux
---

# Gestalt Web Design

Applies Gestalt psychology principles to create interfaces that feel "obvious" to users by aligning with hardwired patterns of human visual processing.

## Decision Points

### When Proximity and Similarity Conflict
```
IF elements are functionally related BUT visually different:
  └── Apply proximity first (group with spacing)
  └── Then break similarity deliberately (e.g., accent color on primary CTA)
  └── Use 3:1 spacing ratio minimum between groups

IF elements look similar BUT serve different functions:
  └── Increase visual difference (color, size, or shape)
  └── Maintain proximity grouping for actual relationships
  └── Test: can user distinguish purpose at 3-second glance?

IF user needs to scan many similar items:
  └── Perfect similarity for easy scanning
  └── Break similarity only for critical state changes (error, selected)
  └── Use consistent spacing grid throughout
```

### Spacing Hierarchy Conflicts
```
IF content requires more than 4 spacing levels:
  └── Audit for over-segmentation
  └── Combine related groups using similarity instead
  └── Reserve spacing jumps for major semantic boundaries

IF equal spacing is creating false groups:
  └── Implement 2:1 minimum ratio between spacing levels
  └── Map spacing to information architecture
  └── Test grouping perception with 5-second exposure
```

### Figure-Ground Ambiguity
```
IF multiple elements compete for attention:
  └── Apply elevation hierarchy (ground/surface/raised/overlay)
  └── Dim background elements using opacity/desaturation
  └── Ensure only ONE primary figure per screen area

IF modal/overlay feels weak:
  └── Darken backdrop to 50-70% opacity
  └── Add substantial shadow to modal container
  └── Remove competing elements from z-index stack
```

## Failure Modes

### Schema Bloat
**Symptoms:** Users report "too busy" or "overwhelming" despite minimal content
**Diagnosis:** Too many visual groups breaking proximity law
**Fix:** Consolidate related items using tighter spacing, remove unnecessary dividers, establish 3-tier spacing system maximum

### Invisible Boundaries  
**Symptoms:** Users click wrong targets, miss related controls, confused navigation flow
**Diagnosis:** Insufficient proximity differentiation between groups
**Fix:** Increase inter-group spacing to 2.5x+ intra-group spacing, audit click heatmaps for misdirected interactions

### False Similarity
**Symptoms:** Users expect identical behavior from visually similar elements that function differently  
**Diagnosis:** Inconsistent visual treatment for different interaction types
**Fix:** Create distinct visual categories for each interaction pattern, audit all buttons/links for consistent styling within function type

### Ground Competition
**Symptoms:** Users cannot locate primary content or miss critical CTAs
**Diagnosis:** Multiple elements competing for figure status, weak figure-ground separation
**Fix:** Establish clear elevation hierarchy, ensure single primary action per view, increase contrast between content and navigation areas

### Dead-End Flows
**Symptoms:** Users abandon tasks before completion, report "getting lost"
**Diagnosis:** Continuity violations breaking expected visual flow
**Fix:** Create alignment grids, add visual connectors (arrows, lines, number sequences), test completion rates before/after continuity improvements

## Worked Examples

### Settings Page Redesign Walkthrough

**Initial State:** Equal 16px spacing throughout, bordered cards everywhere, inconsistent button styles
**User Feedback:** "Can't tell what goes together"

**Step 1 - Proximity Audit:**
- Measure all gaps: 16px everywhere (proximity failure)
- Decision: Implement 8px/24px/48px hierarchy
- Related fields get 8px gaps, section breaks get 48px

**Step 2 - Similarity Audit:** 
- Found 3 different button styles for same "edit" function
- Decision: Standardize all secondary actions to ghost buttons
- Keep only primary CTA as filled button per section

**Step 3 - Closure Application:**
- Remove all card borders, use spacing + background color for grouping
- Test: Can users still identify sections? Yes, cleaner appearance

**Step 4 - Figure-Ground Enhancement:**
- Danger zone gets red-tinted background (5% opacity)
- Primary actions get higher elevation shadow
- Form inputs get subtle inset appearance

**Result:** Task completion up 23%, "ease of use" rating improved from 3.2 to 4.6

**Expert vs Novice:** 
- Novice would focus on visual "polish" (gradients, shadows for decoration)
- Expert recognizes proximity spacing as the primary tool for reducing cognitive load

## Quality Gates

- [ ] Spacing uses exactly 3 levels maximum: intra-group (8px), inter-group (24px), section breaks (48px+)
- [ ] Spacing ratio between adjacent levels is minimum 2:1, preferably 3:1
- [ ] All elements serving same function share identical visual treatment (color, size, spacing, typography)
- [ ] No visual borders where proximity spacing can handle grouping
- [ ] Primary content area passes squint test: distinguishable from navigation at 50% blur
- [ ] Interactive elements have distinct figure-ground relationship from static content
- [ ] Hover states on grouped elements coordinate together (common fate test)
- [ ] Grid layouts maintain regular dimensions (no arbitrary sizing)
- [ ] Visual flow guides toward primary CTA without dead ends
- [ ] Zero arbitrary spacing values (all measurements from defined scale)

## NOT-FOR Boundaries

**Do NOT use for:**
- Color palette harmony → use **color-theory-palette-harmony-expert**
- Typography pairing and font selection → use **typography-expert**  
- Accessibility compliance (contrast, screen readers) → use **design-accessibility-auditor**
- Animation timing and easing → use **web-design-expert**
- Brand identity visual language → use **brand-design-expert**

**Delegate when:**
- User reports accessibility barriers → **design-accessibility-auditor**
- Content requires complex data visualization → **data-visualization-expert**
- Mobile-specific touch interaction patterns → **mobile-ux-expert**
- Performance optimization of visual assets → **web-performance-optimizer**