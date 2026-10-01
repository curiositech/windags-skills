# Web Library Route: ybouane/liquidglass

Sources: https://github.com/ybouane/liquidglass (README, read 2026-10-01), demo
https://liquid-glass.ybouane.com/. MIT licence. npm `@ybouane/liquidglass`.

## How it works

1. **Capture.** Non-glass children of a root are rasterised to a hidden canvas with
   `html-to-image` (clone subtree, inline computed styles, render through SVG
   `foreignObject`). Static content is cached; `<video>` and children marked
   `data-dynamic` are re-captured every frame. Images, canvases and videos are drawn
   directly with Canvas 2D (faster than the HTML path).
2. **Shade.** Each glass element gets an injected child `<canvas>` with its own WebGL
   context; a fragment shader applies refraction, chromatic aberration, Fresnel,
   multi-light specular, an inner-stroke rim, and a drop shadow.
3. **Composite.** Rendered glass is composited back before the next glass element is
   processed, so stacked glass works (which you should still not design; see rule 2).

## Usage

```js
import { LiquidGlass } from '@ybouane/liquidglass';
await document.fonts.ready;                     // fonts must be loaded before init
const glass = await LiquidGlass.init({
  root: document.querySelector('#stage'),
  glassElements: document.querySelectorAll('.glass'),
  defaults: { cornerRadius: 24, refraction: 0.8, blurAmount: 0.15 },
});
// glass.fps, glass.markChanged(el), glass.destroy()
```

Per element: `data-config='{"cornerRadius":999,"zRadius":30,"chromAberration":0.03}'`.

## Options (README defaults)

| Option | Default | Liquid Glass mapping |
|---|---|---|
| `blurAmount` | 0.00 | Regular ≈ 0.1-0.25; clear ≈ 0-0.05 |
| `refraction` | 0.69 | Lensing strength; keep centre clean by pairing with a modest `zRadius` |
| `chromAberration` | 0.05 | 0.02-0.05; higher reads as a cheap filter |
| `edgeHighlight` | 0.05 | Rim lighting |
| `specular` | 0.00 | 0.1-0.3 for the specular highlight |
| `fresnel` | 1.00 | Grazing-angle reflection |
| `distortion` | 0.00 | Micro-noise; leave at 0 for Apple's look |
| `cornerRadius` | 65 | CSS px; use capsule (half height) or concentric values |
| `zRadius` | 40 | Bevel depth/curvature |
| `opacity` | 1.00 | |
| `saturation`, `brightness` | 0.00 | Luminosity adjustment |
| `tintStrength` | 0.00 | Library tint is a cool blue; for brand tint prefer CSS over the glass |
| `shadowOpacity`, `shadowSpread`, `shadowOffsetY` | 0.30, 10, 1 | |
| `floating`, `button` | false | Drag-to-move; press feedback |
| `bevelMode` | 0 | 0 pill, 1 plano-convex |

## Trade-offs

- **Second WebGL context per glass element.** Browsers cap live contexts (~16 per page);
  add your app's own contexts. Past the cap the oldest context is lost.
- **DOM rasterisation is expensive.** `html-to-image` on resize re-captures everything;
  `data-dynamic` re-captures every frame. Keep wrappers small.
- **Per-frame canvas copies.** Over your own animated canvas the library copies that canvas
  every frame and shades it a frame later in a different context: the same desync class as
  CSS `backdrop-filter`, plus extra copies. Use the GPU route instead.
- **Structural constraints.** Glass elements must be direct children of the root; the root
  itself is never captured; one root cannot refract another; a canvas is injected as the
  first child; `destroy()` does not restore `position: static`.
- **CORS.** Cross-origin images need `crossorigin="anonymous"`; webfonts need CORS headers.
- **Init latency.** `init()` is async (100-500 ms on slow connections): render a CSS
  fallback first and swap.
- **Accessibility.** The library does not read `prefers-reduced-transparency` or
  `prefers-contrast`. Wrap init: if either matches (or your in-app toggle is set), do not
  init; use the solid CSS fallback.

## When it is the right call

A marketing or showcase page with 1-4 glass panels over mostly static imagery or a single
video, where cross-browser refraction is the point and you do not own a render pipeline.
