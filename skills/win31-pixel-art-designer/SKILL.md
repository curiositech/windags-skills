---
license: Apache-2.0
name: win31-pixel-art-designer
description: Expert in Windows 3.1 era pixel art and graphics. Creates icons, banners, splash screens, and UI assets with authentic 16/256-color palettes, dithering patterns, and Program Manager styling. Activate on 'win31 icons', 'pixel art 90s', 'retro icons', '16-color', 'dithering', 'program manager icons', 'VGA palette'. NOT for modern flat icons, vaporwave art, or high-res illustrations.
allowed-tools: Read,Write,Edit,Bash(convert:*,magick:*),mcp__ideogram__generate_image,mcp__stability-ai__*
category: Design & Creative
tags:
  - pixel-art
  - icons
  - retro
  - windows
  - 90s
  - dithering
pairs-with:
  - skill: windows-3-1-web-designer
    reason: Visual + CSS Win31 experience
  - skill: win31-audio-design
    reason: Complete retro multimedia
  - skill: pixel-art-infographic-creator
    reason: Diagrams and educational graphics
---

# Win31 Pixel Art Designer

Expert in creating authentic Windows 3.1 era pixel art with proper color constraints and dithering techniques.

## Decision Points

### Color Strategy Decision Tree

**Is the artwork >32x32 and NOT an icon?**
├─ YES → Use 256-color palette
│   ├─ Splash screen/About dialog → Navy gradients + 216-color cube
│   └─ Banner/header → System gray base + logo accent area
└─ NO → Use 16-color VGA palette
    ├─ Icon (32x32 or 16x16) → Standard 16-color set
    ├─ Cursor → Black/white only
    └─ UI element → Match Windows chrome colors

### Dithering vs. Flat Color Decision

**Does the design need gradients or intermediate tones?**
├─ YES → Apply dithering
│   ├─ Smooth gradient needed → Floyd-Steinberg ordered dither
│   ├─ Shadow/highlight → 50% checkerboard pattern
│   └─ Texture effect → Diagonal or horizontal line patterns
└─ NO → Use flat colors
    ├─ Simple icon shapes → Pure VGA colors
    ├─ Text areas → Solid system gray (#C0C0C0)
    └─ High contrast elements → Black/white/primary colors

### Generation Method Decision

**Starting from scratch or converting existing art?**
├─ FROM SCRATCH → AI generation first
│   ├─ Simple icon → Direct Ideogram with VGA palette prompt
│   ├─ Complex scene → Stability AI then post-process
│   └─ Logo/text heavy → Manual pixel art preferred
└─ CONVERTING EXISTING → Post-processing pipeline
    ├─ High-res source → Scale down first, then reduce colors
    ├─ Modern gradient → Replace with dithering patterns
    └─ Anti-aliased edges → Posterize then sharpen

### Quality Check Decision

**Does it pass the authenticity test?**
├─ Colors wrong → More than 16 colors used for icons?
│   ├─ YES → Run ImageMagick color reduction
│   └─ NO → Check if using exact VGA hex values
├─ Edges wrong → Smooth/blurred edges visible?
│   ├─ YES → Apply nearest-neighbor scaling and sharpen
│   └─ NO → Check for proper 1px black outlines
└─ Style wrong → Looks modern or vaporwave?
    ├─ YES → Restart with stricter period-accurate prompts
    └─ NO → Final validation against reference icons

## Failure Modes

### "Gradient Soup" Anti-Pattern
**Symptom:** Smooth color transitions, multiple similar shades, CSS-style gradients
**Detection Rule:** If you see >4 similar color values or smooth transitions, you've hit this
**Fix:** Replace gradients with 2-color dithering patterns. Use checkerboard for 50% blend, sparse dots for 25%, dense for 75%

### "Anti-Alias Blur" Anti-Pattern  
**Symptom:** Soft edges on diagonal lines, blended pixels at shape boundaries
**Detection Rule:** If diagonal edges look smooth instead of stair-stepped, you've hit this
**Fix:** Apply `convert -filter point` scaling and `-colors 16 -dither FloydSteinberg` to restore hard pixel edges

### "Palette Drift" Anti-Pattern
**Symptom:** Colors that are "close" to VGA but not exact (e.g., #7F7F7F instead of #808080)
**Detection Rule:** If color picker shows hex values not in the standard VGA set, you've hit this  
**Fix:** Create VGA palette reference image and use `convert input.png -remap vga-palette.png output.png`

### "Scale Confusion" Anti-Pattern
**Symptom:** 64x64+ artwork passed off as Win31-era, or tiny details that disappear at native size
**Detection Rule:** If design elements don't work at 32x32 viewing size, you've hit this
**Fix:** Design at target size first. For icons, work at 32x32 or 16x16, never scale down from larger

### "Shadow Overboard" Anti-Pattern
**Symptom:** Complex drop shadows, multiple shadow layers, blurred shadow effects
**Detection Rule:** If shadows use more than 2 colors or have any blur, you've hit this
**Fix:** Use single-pixel offset shadows in #808080 (dark gray) only. Max 1-2px offset

## Worked Examples

### Example 1: Converting Modern App Icon to Win31 Style

**Input:** Modern calendar app icon (128x128, full color, drop shadows)
**Goal:** Authentic Win31 calendar icon (32x32, 16-color)

**Step 1 - Color Analysis**
```
Original colors: 47 unique colors including gradients
VGA mapping needed: Calendar → Red/White, Frame → Gray tones
Decision: Use #FF0000 (Red), #FFFFFF (White), #C0C0C0 (Light Gray), #808080 (Dark Gray), #000000 (Black)
```

**Step 2 - Shape Simplification** 
```
128x128 details: Month grid visible, subtle date numbers, rounded corners
32x32 constraints: Grid becomes 3x3 suggestion, single large "15" date, sharp corners
Expert insight: Novice keeps too much detail; expert focuses on recognizable calendar shape
```

**Step 3 - Dithering Application**
```
Original shadow: Soft 8px blur with alpha transparency  
Win31 shadow: 1px offset in #808080, checkerboard dither for depth
Expert decision: Use diagonal dither pattern to suggest paper texture
```

**Step 4 - Final Construction**
```
Background: #C0C0C0 (system gray)
Calendar frame: Black outline + white highlight top-left
Date area: White with red "15" 
Shadow: #808080 offset 1px right, 1px down
Result: Instantly recognizable as Win31-era while maintaining calendar concept
```

### Example 2: Creating Splash Screen from Brand Guidelines

**Input:** Company rebrand package (modern logo, Pantone colors, sans-serif fonts)
**Goal:** Win31 program splash screen (400x300, 256-color)

**Step 1 - Palette Strategy Decision**
```
Brand colors: Pantone 286 (bright blue), Pantone 377 (bright green)  
VGA mapping: #0000FF (closest to 286), #00FF00 (closest to 377)
Decision: Use 16-color base + dithered logo area for brand recognition
```

**Step 2 - Layout Composition**
```
Modern layout: Centered logo, lots of whitespace, minimal text
Win31 adaptation: Beveled frame border, navy title bar, structured text blocks
Expert insight: Win31 users expect information density, not minimalism
```

**Step 3 - Typography Handling**
```
Brand font: Custom sans-serif, thin weights
Win31 constraints: System fonts only, bold weights for readability
Solution: Use bold system font, add company name in structured box layout
```

**Step 4 - Logo Conversion Process**
```
Original: Vector logo with gradients and 24-bit colors
Conversion: Rasterize to 64x64, reduce to 256-color, apply Floyd-Steinberg dither
Expert insight: Logo fidelity in center, strict 16-color for chrome/borders
Final: Recognizable brand mark that feels authentically 1993
```

## Quality Gates

- [ ] Icon uses exactly 16 VGA colors (no additional shades)
- [ ] All diagonal lines show visible stair-step pixels (no anti-aliasing)
- [ ] 1px black outline present on all icon boundaries  
- [ ] Light source consistently from top-left (white/light gray highlights)
- [ ] Shadow/depth uses only #808080 dark gray, max 2px offset
- [ ] Text uses system fonts (no custom typography)
- [ ] Dithering patterns use only adjacent VGA colors (no intermediate blends)
- [ ] 32x32 icons remain readable when viewed at actual size
- [ ] Color palette matches extracted VGA reference exactly
- [ ] No blur effects, glow effects, or modern CSS-style shadows present

## Not-For Boundaries

**Do NOT use this skill for:**
- Modern flat icons → Use **web-design-expert** instead
- CSS/web implementation → Use **windows-3-1-web-designer** instead  
- Vaporwave or synthwave aesthetics → Use **vaporwave-glassomorphic-ui-designer** instead
- High-resolution artwork (>128px) → Use **native-app-designer** instead
- Photorealistic graphics → Use **photoshop-expert** instead
- Vector graphics that need to stay vector → Use **illustrator-expert** instead

**Delegate when:**
- Client needs scalable icons → **svg-icon-designer**
- Animation required → **css-animation-expert** 
- Modern accessibility compliance needed → **web-design-expert**