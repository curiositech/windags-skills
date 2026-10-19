# Material Anatomy: What Liquid Glass Actually Does

Apple describes Liquid Glass as "a new digital meta-material that dynamically bends and
shapes light". Apple publishes behaviours, not constants. The left column below is Apple's
(WWDC25 219 *Meet Liquid Glass*, HIG Materials). The right column is this skill's **house
approximation** for custom/web rendering, tuned by eye against iOS 26 screenshots; treat the
numbers as starting points, not specifications.

## Layers of the material

| Layer | Apple behaviour | House approximation (web/custom, 1x CSS px) |
|---|---|---|
| Lensing / refraction | Bends and concentrates light, strongest near the silhouette; centre reads almost clear | Displacement only inside an edge band (bevel) of 8-16 px; peak UV offset 6-14 px at the rim, ~0 at the bevel's inner edge |
| Blur | Regular blurs and adjusts luminosity behind; clear barely blurs | Regular: gaussian sigma 4-8 px (CSS `blur(6px)` to `blur(10px)`); clear: 0-2 px. Above ~12 px you are drawing the pre-2025 material |
| Luminosity / saturation | Dynamic range and tint amount shift to keep content legible | Regular: saturate 1.2-1.6, brightness pulled toward mid (light: +4 to +8%, dark: -6 to -12%) |
| Chromatic dispersion | Visible faint colour fringing at the rim in Apple's own renders | Per-channel offset 2-6% of the refraction vector; zero in the interior |
| Specular highlight | Light sources produce highlights that follow geometry; move with interaction and sometimes device motion | Thin rim highlight biased to one light direction (upper left is conventional); 0.15-0.35 alpha; plus a fainter opposite-edge bounce |
| Fresnel rim | Edges read brighter at grazing angles | `pow(1 - n.z, 3)` term, 0.1-0.25 strength |
| Shadow | Opacity rises over text, falls over solid light backgrounds | 0.10-0.25 alpha soft shadow, radius 12-24 px, y offset 1-4 px; raise when backdrop variance is high |
| Tint | Colour maps to a range of tones by backdrop brightness; stays the intended hue | Mix tint at 0.2-0.5 alpha in a luminance-preserving way (multiply by backdrop luminance, then screen) rather than a flat overlay |
| Inner content | Labels and symbols are vibrant and adaptive (monochrome light/dark) | Pick label colour per frame/region from backdrop luminance (black or white), never fixed grey |

## Adaptivity

- **Small elements** (nav bars, tab bars, buttons) continuously adapt and **flip light/dark**
  depending on what is behind.
- **Large elements** (menus, sidebars) adapt but **do not flip**; they get more opaque to
  carry richer content. Ambient colour from nearby content can spill onto them.
- **Over text**, shadows become more prominent for separation.
- The adaptation is a feedback loop on the backdrop. A custom implementation needs a
  backdrop luminance estimate (average of the blurred backdrop under the element; a 1x1
  mip level works) driving label colour, shadow alpha, and tint mapping. Add hysteresis
  (for example flip at 0.55 going up, 0.45 going down, over ~150 ms) or labels will flicker
  as content scrolls.

## Size scaling

"When glass flexes and morphs to larger sizes ... its material characteristics change to
simulate a thicker, more substantial material. It casts deeper, richer shadows, has more
pronounced lensing and refraction effects, and a softer scattering of light."

House rule: scale bevel width, refraction peak and shadow radius by
`clamp(sqrt(min(w, h) / 44), 0.75, 2.0)` where 44 pt is a standard control height.

## Thickness under focus

Sheets dragged to full height become more opaque. A custom panel that takes focus should
lerp blur up and backdrop visibility down, not just grow.

## What it is not

- Not frosted glass. Old materials "scattered light"; Liquid Glass "bends, shapes, and
  concentrates" it. A uniform heavy blur with a white 20% fill is the wrong material.
- Not a border. Increased Contrast adds a contrasting border; the default look has a
  highlight rim from lighting, not a stroked outline.
- Not coloured by default. "Liquid Glass has no inherent color" (HIG Color).
