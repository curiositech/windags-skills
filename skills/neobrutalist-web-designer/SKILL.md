---
license: Apache-2.0
name: neobrutalist-web-designer
description: Modern web applications with authentic neobrutalist aesthetic. Bold typography, hard shadows (no blur), thick black borders, high-contrast primary colors, raw visual tension. Extrapolates neobrutalism to SaaS dashboards, e-commerce, landing pages, startup MVPs. Activate on 'neobrutalism', 'neubrutalism', 'brutalist', 'bold borders', 'hard shadows', 'raw aesthetic', 'anti-minimalism', 'gumroad style', 'figma style'. NOT for glassmorphism (use vaporwave-glassomorphic-ui-designer), Windows retro (use windows-3-1-web-designer or windows-95-web-designer), soft shadows, gradients, neumorphism.
allowed-tools: Read,Write,Edit,Glob,Grep
category: Design & Creative
tags:
  - neobrutalism
  - web-design
  - bold
  - raw
  - aesthetic
---

# Neobrutalist Web Designer

Creates modern 2026 web applications with authentic neobrutalist aesthetic. Not recreating brutalist architecture—**extrapolating neobrutalism to modern digital contexts**: SaaS products, e-commerce, indie creator platforms, and startup MVPs that need to stand out.

## Decision Points

### Color + Border + Shadow Selection by Component

```
Button States:
├── Primary CTA → Yellow bg + 3px black border + 4px hard shadow
├── Secondary → White bg + 3px black border + 4px hard shadow  
├── Danger → Red bg + 3px black border + 4px hard shadow
└── Ghost → Transparent bg + 3px black border + no shadow

Card Hierarchy:
├── Hero card → Bold accent color bg + 4px border + 8px shadow
├── Content card → White bg + 3px border + 6px shadow
├── Data card → Cream bg + 3px border + 4px shadow
└── Inline card → White bg + 2px border + 3px shadow

Input Focus States:
├── Default → White bg + 3px black border + no shadow
├── Focus → White bg + 3px black border + 4px shadow
├── Error → White bg + 3px red border + 4px red shadow
└── Success → White bg + 3px green border + 4px green shadow

Layout Container Choices:
├── Page hero → Full-width solid color + no border
├── Content section → Max-width + 4px bottom border
├── Sidebar → Solid bg + 4px right border
└── Modal → White bg + 4px border + 12px shadow
```

### Typography Pairing Decision Tree

```
Text Purpose:
├── Hero headline → Archivo Black + 4-8rem + uppercase + -2% letter-spacing
├── Section header → Archivo Black + 2-3rem + uppercase
├── Body text → Space Grotesk + 1.125rem + normal case
├── Button text → Archivo Black + 1rem + uppercase
├── Form labels → Space Grotesk + 0.875rem + bold + uppercase
└── Code/data → JetBrains Mono + 0.875rem + normal case

Context Modifiers:
├── SaaS dashboard → More readable fonts, less extreme sizing
├── Landing page → Maximum impact fonts, oversized headlines
├── E-commerce → Product names bold, prices in display font
└── Blog/content → Prioritize readability with geometric sans
```

### Responsive Shadow/Border Scaling

```
Screen Size:
├── Mobile (<640px) → 2px borders + 3px shadows
├── Tablet (640-1024px) → 3px borders + 4px shadows
├── Desktop (1024-1440px) → 4px borders + 6px shadows
└── Large (>1440px) → 4px borders + 8px shadows

Element Importance:
├── Hero elements → +2px to standard shadow
├── Interactive elements → Standard shadow + hover growth
├── Background cards → -1px from standard shadow
└── Decorative elements → Half standard shadow
```

## Failure Modes

### **Shadow Softness Syndrome**
**Symptom**: Using `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` with blur
**Detection rule**: If you see ANY blur value > 0 in shadows
**Diagnosis**: Applying generic web design instead of neobrutalism
**Fix**: Replace with `box-shadow: 4px 4px 0 #000000` (offset, no blur)

### **Gradient Creep**  
**Symptom**: Adding `linear-gradient()` or `radial-gradient()` backgrounds
**Detection rule**: If you see ANY gradient in CSS
**Diagnosis**: Trying to "soften" the aesthetic with blending
**Fix**: Pick ONE solid color per element. Embrace the flatness completely.

### **Border Timidity**
**Symptom**: Using `border: 1px solid #ddd` or similar thin borders  
**Detection rule**: If border width < 2px or color is not high-contrast
**Diagnosis**: Fear of visual weight, defaulting to subtle design
**Fix**: Use `border: 3px solid #000000` minimum. Bold borders define neobrutalism.

### **Shadow Overload Chaos**
**Symptom**: Every element has different shadow directions/sizes randomly
**Detection rule**: If >3 different shadow patterns exist on same screen
**Diagnosis**: Inconsistent design system application
**Fix**: Standardize to 2-3 shadow sizes maximum. Same direction (4px 4px) everywhere.

### **Contrast Cowardice**
**Symptom**: Using muted pastels (#F0F0F0, #E8E8E8) instead of bold colors
**Detection rule**: If background colors have <7:1 contrast ratio with text
**Diagnosis**: Avoiding visual tension that defines the aesthetic  
**Fix**: Use true primaries (#FF5252, #FFEB3B) with black/white text for maximum contrast.

## Worked Examples

### Example 1: E-commerce Product Card Transformation

**Before (Generic Card)**:
```css
.product-card {
  background: #fff;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
}
```

**Decision Process**:
1. **Border choice**: Generic → Neobrutalist requires 3px+ black border
2. **Shadow choice**: Soft blur → Must be hard shadow with offset  
3. **Background**: White OK, but needs high contrast with border
4. **Border-radius**: 12px too soft → Reduce to 4px or remove entirely

**After (Neobrutalist Card)**:
```css
.neo-product-card {
  background: #FFFFFF;
  border: 3px solid #000000;
  border-radius: 4px; /* Minimal softening */
  box-shadow: 6px 6px 0 #000000; /* Hard shadow */
  padding: 1rem;
  transition: all 0.1s ease;
}

.neo-product-card:hover {
  box-shadow: 8px 8px 0 #000000;
  transform: translate(-2px, -2px); /* Physical movement */
}
```

**What novice misses**: The hover state needs physical feedback (transform) + shadow growth, not just color changes.

### Example 2: SaaS Dashboard "Too Many Shadows" Fix

**Problem**: Designer used 6 different shadow patterns across dashboard components.

**Failure symptoms detected**:
- Cards: `box-shadow: 2px 4px 0 #000`  
- Buttons: `box-shadow: 4px 4px 0 #000`
- Modals: `box-shadow: 8px 12px 0 #000`
- Tooltips: `box-shadow: 3px 3px 0 #000`
- Alerts: `box-shadow: 6px 6px 0 #000`
- Navigation: `box-shadow: 1px 2px 0 #000`

**Decision process**:
1. **Audit existing shadows** → Found 6 different patterns
2. **Categorize by importance** → Hero (8px), Standard (6px), Subtle (3px)
3. **Apply consistently** → Same elements use same shadows
4. **Verify hierarchy** → Most important elements have largest shadows

**Solution**:
```css
/* Standardized shadow system */
:root {
  --shadow-hero: 8px 8px 0 #000000;    /* Modals, hero cards */
  --shadow-standard: 6px 6px 0 #000000; /* Regular cards, buttons */
  --shadow-subtle: 3px 3px 0 #000000;   /* Small elements, tooltips */
}
```

**Result**: Visual hierarchy became clear, design felt cohesive instead of chaotic.

### Example 3: Form Validation with Neobrutalist States

**Challenge**: Show error/success states without soft styling.

**Novice approach**: Red text color change only
**Expert approach**: Color + border + shadow coordination

```css
/* Base input */
.neo-input {
  background: #FFFFFF;
  border: 3px solid #000000;
  padding: 0.75rem 1rem;
  box-shadow: none;
}

/* Focus state */
.neo-input:focus {
  box-shadow: 4px 4px 0 #000000;
  outline: none;
}

/* Error state - coordinated red theme */
.neo-input--error {
  border-color: #FF5252;
  box-shadow: 4px 4px 0 #FF5252;
}

/* Success state - coordinated green theme */
.neo-input--success {
  border-color: #4CAF50;
  box-shadow: 4px 4px 0 #4CAF50;
}
```

**What expert catches**: Error states need FULL visual coordination (border + shadow color match), not just text color changes.

## Quality Gates

- [ ] All shadows use 0 blur value (hard shadows only)
- [ ] Contrast ratio ≥7:1 between text and background colors
- [ ] Shadow count ≤3 different sizes across entire interface
- [ ] All borders are ≥2px width with high-contrast colors
- [ ] Primary elements use bold accent colors (#FF5252, #FFEB3B, #2196F3)
- [ ] No gradients or transparency effects used anywhere
- [ ] Interactive elements have physical hover feedback (transform + shadow change)
- [ ] Typography uses display fonts for headers, geometric sans for body
- [ ] Border-radius ≤4px (or 0px for sharp corners)
- [ ] Color palette limited to ≤5 colors total (including black/white)

## Not-For Boundaries

**Do NOT use neobrutalist-web-designer for:**

- **Glassmorphism/blur effects** → Use `vaporwave-glassomorphic-ui-designer` instead
- **Windows 3.1/95 retro styling** → Use `windows-3-1-web-designer` or `windows-95-web-designer`
- **Soft shadows and neumorphism** → Use `native-app-designer` instead  
- **Corporate subtle/minimal design** → Use `web-design-expert` instead
- **Gradient-heavy aesthetics** → No specific alternative, avoid gradients entirely
- **Medical/legal interfaces requiring calm** → Use `accessibility-first-designer` instead
- **Data visualization requiring subtlety** → Use `data-visualization-expert` instead

**Delegate to other skills when user asks for:**
- "Soft professional look" → `web-design-expert`
- "Accessible government site" → `accessibility-first-designer`  
- "Glassmorphism effects" → `vaporwave-glassomorphic-ui-designer`
- "Windows retro aesthetic" → `windows-95-web-designer`
- "Subtle data dashboard" → `data-visualization-expert`