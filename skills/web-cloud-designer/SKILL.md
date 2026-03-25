---
license: Apache-2.0
name: web-cloud-designer
description: Creates realistic cloud effects for web using SVG filters (feTurbulence, feDisplacementMap), CSS animations, and layering techniques. Use for atmospheric backgrounds, weather effects, skyboxes, parallax scenes, and decorative cloud elements. Activate on "cloud effect", "SVG clouds", "realistic clouds", "atmospheric background", "sky animation", "feTurbulence", "weather effects", "parallax clouds". NOT for 3D rendering (use WebGL/Three.js skills), photo manipulation (use image editing tools), weather data APIs (use data integration skills), or simple CSS gradients without volumetric effects.
allowed-tools: Read,Write,Edit,WebFetch,Bash
category: Design & Creative
tags:
  - svg
  - css
  - animation
  - atmospheric
  - visual-effects
  - web
pairs-with:
  - skill: web-design-expert
    reason: Integrate clouds into overall web design
  - skill: physics-rendering-expert
    reason: Realistic lighting and shadow calculations
  - skill: color-theory-palette-harmony-expert
    reason: Sky gradients and atmospheric color
---

# Web Cloud Designer

Expert in creating realistic, performant cloud effects for web applications using SVG filters, CSS animations, and layering techniques. Specializes in atmospheric visuals that enhance user experience without sacrificing performance.

## DECISION POINTS

### Use Case → Cloud Type → Parameters

```
User Requirements
├─ Simple background decoration
│  └─ Cumulus clouds
│     ├─ baseFrequency: 0.008
│     ├─ numOctaves: 3-4
│     └─ scale: 40-60
│
├─ Weather/dramatic effect
│  └─ Storm clouds
│     ├─ baseFrequency: 0.006
│     ├─ numOctaves: 4-5
│     └─ scale: 120-170
│
├─ Hero section atmosphere
│  └─ Layered parallax
│     ├─ 3 layers minimum
│     ├─ Back: opacity 0.3, speed 120s
│     ├─ Mid: opacity 0.6, speed 80s
│     └─ Front: opacity 0.9, speed 50s
│
└─ Performance constraints
   ├─ Mobile → CSS box-shadow clouds
   ├─ Desktop normal → SVG filters, numOctaves ≤ 4
   └─ Hero only → SVG filters, numOctaves ≤ 5
```

### Animation Strategy Decision Tree

```
Performance Budget
├─ 60fps required (mobile/battery)
│  ├─ Static clouds → No animation
│  └─ Movement needed → CSS transform only
│
├─ 45-60fps acceptable
│  ├─ Simple drift → translateX animation
│  └─ Morphing shapes → border-radius keyframes
│
└─ 30fps acceptable (hero sections)
   └─ Dynamic effects → Animate filter properties sparingly
```

### Filter Parameter Ranges by Cloud Type

| Cloud Type | baseFrequency | numOctaves | scale | blur stdDev | Use When |
|------------|---------------|------------|-------|-------------|----------|
| Cumulus | 0.008-0.012 | 3-4 | 40-80 | 3-5 | Happy, puffy background |
| Cirrus | 0.015-0.025 | 2-3 | 20-40 | 1-3 | Wispy, high altitude |
| Stratus | 0.005-0.010 | 3-4 | 30-60 | 4-8 | Flat, overcast layer |
| Storm | 0.004-0.008 | 4-5 | 100-170 | 2-4 | Dramatic, billowing |

## FAILURE MODES

### Jagged Edge Syndrome
**Symptoms:** Clouds look pixelated, harsh edges, unnatural appearance
**Diagnosis:** Missing or insufficient Gaussian blur before displacement
**Fix:** Add `<feGaussianBlur stdDeviation="3-5"/>` before `<feDisplacementMap/>`
**Detection Rule:** If cloud edges look crisp/digital rather than soft/organic

### Performance Death Spiral
**Symptoms:** Animation stutters, browser freezes, fans spin up
**Diagnosis:** Too many octaves (>5) or animating filter properties
**Fix:** Reduce numOctaves to ≤4, use CSS transforms instead of filter animation
**Detection Rule:** If FPS drops below 30 or CPU usage >70% on cloud page

### Cloud Clipping Disaster
**Symptoms:** Clouds cut off at edges, partial shapes, sudden appearances
**Diagnosis:** Filter region too small for displacement effects
**Fix:** Set filter `x="-50%" y="-50%" width="200%" height="200%"`
**Detection Rule:** If any cloud shapes appear incomplete or cropped

### Static Variation Failure
**Symptoms:** All clouds look identical, repetitive patterns
**Diagnosis:** Using same seed value for all cloud instances
**Fix:** Generate unique seed for each cloud: `seed={Math.floor(Math.random() * 1000)}`
**Detection Rule:** If you can't distinguish between individual clouds

### Mobile Performance Crash
**Symptoms:** Mobile devices lag severely, battery drain, overheating
**Diagnosis:** Using desktop-grade effects on mobile without degradation
**Fix:** Use CSS box-shadow technique or reduce to 2 simple SVG layers on mobile
**Detection Rule:** If mobile devices show <20fps or significant battery impact

## WORKED EXAMPLES

### Example: Hero Section Dramatic Sky

**Scenario:** Client wants "epic fantasy sky" for game website header

**Step 1: Requirements Analysis**
- Target: Desktop primarily (gaming audience)
- Performance: 45fps acceptable for hero section
- Style: Dramatic storm clouds with depth

**Step 2: Architecture Decision**
Choose layered approach with storm cloud filters:
```html
<!-- 3 layers for depth -->
<div class="sky-layers">
  <div class="layer-back"></div>   <!-- Distant mountains of clouds -->
  <div class="layer-mid"></div>    <!-- Main cloud formations -->
  <div class="layer-front"></div>  <!-- Close detail wisps -->
</div>
```

**Step 3: Filter Configuration**
```xml
<filter id="stormBack" x="-50%" y="-50%" width="200%" height="200%">
  <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="42"/>
  <feGaussianBlur stdDeviation="6" result="blur"/>
  <feDisplacementMap in="SourceGraphic" in2="blur" scale="100"/>
</filter>
```

**Step 4: Novice vs Expert Catches**
- **Novice misses:** Using same seed (42) for all layers → identical shapes
- **Expert catches:** Each layer needs unique seed (42, 137, 891) for variety
- **Novice misses:** No blur before displacement → jagged edges
- **Expert catches:** Blur before displacement is mandatory for smooth clouds

**Step 5: Animation Implementation**
```css
.layer-back { 
  filter: url(#stormBack);
  opacity: 0.4;
  animation: drift 100s linear infinite;
}
.layer-mid { 
  filter: url(#stormMid);
  opacity: 0.7;
  animation: drift 65s linear infinite;
}
.layer-front { 
  filter: url(#stormFront);
  opacity: 0.9;
  animation: drift 40s linear infinite;
}
```

**Step 6: Expert Optimization**
Add performance safeguards:
```css
@media (prefers-reduced-motion: reduce) {
  .layer-back, .layer-mid, .layer-front { animation: none; }
}
@media (max-width: 768px) {
  .layer-front { display: none; } /* Reduce to 2 layers on mobile */
}
```

## QUALITY GATES

- [ ] Frame rate: Maintains 30+ FPS on target devices during cloud animations
- [ ] File size: Total CSS + SVG under 15KB compressed for basic implementation
- [ ] Visual contrast: Background clouds have 3:1 contrast ratio with foreground text
- [ ] Cross-browser: Renders correctly in Chrome, Firefox, Safari, Edge (last 2 versions)
- [ ] Mobile responsive: Degrades gracefully on mobile (reduced layers or alternative technique)
- [ ] Accessibility: Respects prefers-reduced-motion and high-contrast preferences
- [ ] Memory usage: No memory leaks during extended animation (use dev tools to verify)
- [ ] Filter bounds: No cloud elements clipped or cut off at viewport edges
- [ ] Animation timing: Cloud movement speed feels natural (60-120s for full screen traverse)
- [ ] Color harmony: Cloud colors complement overall site palette and lighting conditions

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**

- **3D volumetric rendering** → Use `webgl-three-js-expert` for true 3D clouds with depth fog
- **Photo-realistic cloud textures** → Use image editing tools or procedural texture generators
- **Weather data visualization** → Use `data-visualization-expert` for actual meteorological data
- **Video backgrounds with clouds** → Use video editing or WebGL particle systems
- **Print design cloud effects** → Use vector illustration tools like Illustrator
- **Real-time weather integration** → Use `api-integration-expert` for weather service APIs
- **Game engine cloud systems** → Use Unity/Unreal Engine cloud solutions
- **Scientific cloud simulation** → Use computational fluid dynamics tools

**Delegate to other skills when:**
- Client wants clouds that respond to real weather data → `api-integration-expert`
- Need clouds with complex 3D lighting → `webgl-graphics-expert`
- Clouds must interact with other 3D elements → `three-js-animation-expert`
- Designing for print materials → `print-design-expert`