# Web CSS Route: backdrop-filter (+ SVG Displacement)

## Baseline recipe (all evergreen browsers)

```css
.glass {
  --r: 9999px;                                   /* capsule; or a concentric token */
  border-radius: var(--r);
  background: rgb(255 255 255 / 0.08);           /* light lift; dark mode below */
  -webkit-backdrop-filter: blur(8px) saturate(1.5);
  backdrop-filter: blur(8px) saturate(1.5);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.35),       /* specular rim, light from above-left */
    inset 0 -1px 0 rgb(255 255 255 / 0.08),      /* faint bounce */
    0 4px 18px rgb(0 0 0 / 0.16);                /* separation shadow */
  color: var(--glass-label, #111);
}
@media (prefers-color-scheme: dark) {
  .glass { background: rgb(30 30 32 / 0.28); --glass-label: #f5f5f7; }
}
```

Support (MDN BCD): `backdrop-filter` Chrome 76, Firefox 103, Safari 18 unprefixed
(`-webkit-` from Safari 9). Keep the prefixed declaration for older Safari.

## Chromium-only refraction enhancement

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="lens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <!-- a displacement map image: neutral grey (128,128) in the centre, encoded edge normals
         at the rim, generated per element size (canvas.toDataURL) -->
    <feImage href="data:image/png;base64,..." result="map" preserveAspectRatio="none"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="24"
                       xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
```

```css
@supports (backdrop-filter: url(#lens)) {        /* passes in Chromium; Safari/Firefox ignore url() backdrops */
  .glass.lens { backdrop-filter: url(#lens) blur(6px) saturate(1.5); }
}
```

Facts and traps:

- Only Chromium applies SVG filter references inside `backdrop-filter`. Safari and Firefox
  fall back to whatever else is in the declaration, so always keep a working blur-only
  declaration. Test the `@supports` check in each engine; do not assume it guards correctly.
- The displacement map must match the element's pixel size (regenerate on resize). A map
  with displacement only in a rim band keeps the centre undistorted, which is the Apple look.
- `feDisplacementMap` runs on the CPU in some paths and is expensive at large sizes.
  Limit it to small chrome (pills, buttons), never full-width panels.

## Backdrop Root: why glass "doesn't work"

`backdrop-filter` only sees content up to the nearest **Backdrop Root**. Created by: the
root element, `filter` ≠ none, `opacity` < 1, `mask`/`mask-image`/`mask-border`/`clip-path`,
`backdrop-filter` ≠ none, `mix-blend-mode` ≠ normal, and `will-change` naming any of those.

Consequences:

- A glass element inside a parent with `opacity: 0.99` (common in fade-in animations) blurs
  nothing behind the parent. Animate the child, or animate `opacity` on a sibling.
- **Glass on glass is structurally broken on the web**: the inner element's backdrop root is
  the outer glass, so it samples only the outer's content box, not the page. One more reason
  to obey the design rule.
- `will-change: filter` on a container (added for "performance") silently disables backdrop
  blur for all descendants.

## Performance and jitter traps

- Each `backdrop-filter` region forces the compositor to read back and filter the pixels
  beneath it on every frame those pixels change. Cost scales with **count × area ×
  backdrop change rate**.
- Over a static or rarely-changing DOM, a handful of regions is cheap.
- Over an animated `<canvas>` (WebGL/WebGPU/video), every region re-blurs every frame. At
  120-144 Hz the budget is 6.9-8.3 ms; dozens of regions blow it. Observed failure on Mac
  Chrome: fixed chrome visibly jittered/shimmered relative to a 144 Hz WebGPU map while the
  map itself stayed smooth, because the canvas and the composited blur layers were no
  longer presented in lockstep. Do not try to tune your way out with fewer pixels of blur;
  move glass into the render pipeline (`web-gpu-postprocess.md`).
- Large blur radii cost more (kernel size). Above ~12 px you also get the wrong look.
- Scrolling content under many glass elements on low-end Android: same multiplier.
- Detect: DevTools Performance with "Screenshots" and the GPU track; Rendering panel →
  "Frame Rendering Stats" and "Layer borders"; count elements with a computed
  `backdrop-filter`:

```js
[...document.querySelectorAll('*')].filter(e => getComputedStyle(e).backdropFilter !== 'none').length
```

## Progressive enhancement order

1. Solid surface (works everywhere, also the Reduce Transparency fallback).
2. `@supports (backdrop-filter: blur(1px))` → translucent blur glass.
3. Chromium → optional `url(#lens)` displacement on small elements.
4. Accessibility media queries and an in-app "solid chrome" toggle override all of the above
   (`accessibility-fallbacks.md`).
