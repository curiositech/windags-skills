# WGSL Shader Fundamentals for UI Surfaces

> The Shadertoy mental model, ported to a **WGSL fragment shader feeding a gpui pane** (Metal via wgpu). Everything here is the per-pixel toolkit the stockpile (`03-the-stockpile.md`) draws from; `01-shader-surfaces-in-gpui.md` is how you get these pixels onto the screen. Target is gpui 0.2.x on Metal — no WebGL, no `iChannel` textures unless you bind them yourself.

## The mental model

A fragment shader runs **once per pixel, in parallel, knowing nothing about its neighbors**. You get the pixel's coordinate, a few uniforms (time, resolution, mouse, theme color), and you return a color. There is no loop over pixels, no state between frames except what you push in via uniforms. Design every effect as a *pure function* `color = f(uv, time, uniforms)`.

The fullscreen-triangle vertex stage (see `01`) hands the fragment stage a clip position; you reconstruct UV from `@builtin(position)` and the resolution uniform.

```wgsl
struct U { time: f32, _pad: f32, res: vec2<f32>, mouse: vec2<f32>, accent: vec4<f32> };
@group(0) @binding(0) var<uniform> u: U;

@fragment
fn fs(@builtin(position) frag: vec4<f32>) -> @location(0) vec4<f32> {
  // pixel → UV in [0,1], y-down to y-up, aspect-corrected around center
  var uv = frag.xy / u.res;            // [0,1]
  uv.y = 1.0 - uv.y;                    // flip to math convention
  let p = (uv - 0.5) * vec2(u.res.x / u.res.y, 1.0);  // centered, aspect-correct
  // ... compute color from p, u.time, u.accent ...
  return vec4(col, 1.0);
}
```

**Decision point — UV space.** Use `[0,1]` UV for backgrounds/gradients/dither (they tile and map to the pane). Use centered aspect-correct `p` for anything with circular/SDF geometry (a sun, a sonar ping) so circles stay round when the pane is resized.

## Signed distance fields (SDF) — geometry without meshes

An SDF returns the signed distance from a point to a shape's edge (negative inside). Combine the distance with `smoothstep` for anti-aliased fills and strokes — **this is how you draw crisp shapes in a fragment shader**.

```wgsl
fn sd_circle(p: vec2<f32>, r: f32) -> f32 { return length(p) - r; }
fn sd_box(p: vec2<f32>, b: vec2<f32>) -> f32 {
  let d = abs(p) - b; return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}
fn sd_segment(p: vec2<f32>, a: vec2<f32>, b: vec2<f32>) -> f32 {
  let pa = p - a; let ba = b - a;
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
// AA fill: 1 inside, 0 outside, ~1px feather. `fwidth` gives the pixel size of d.
fn fill(d: f32) -> f32 { return 1.0 - smoothstep(0.0, fwidth(d), d); }
fn stroke(d: f32, w: f32) -> f32 { return 1.0 - smoothstep(0.0, fwidth(d), abs(d) - w); }
```

`fwidth(d)` (= `abs(dpdx(d)) + abs(dpdy(d))`) is the screen-space derivative — using it for the smoothstep edge gives **resolution-independent ~1px anti-aliasing** for free. Never hardcode the feather width; on HiDPI it'll look wrong.

**Boolean ops:** union `min(a,b)`, intersection `max(a,b)`, subtraction `max(a,-b)`; smooth-union for blobby joins:
```wgsl
fn smin(a: f32, b: f32, k: f32) -> f32 { let h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0); return mix(b, a, h) - k*h*(1.0-h); }
```

## Noise — the texture of everything organic

Water, clouds, grain, flicker. Build up from a cheap hash:

```wgsl
fn hash21(p: vec2<f32>) -> f32 {           // [0,1] pseudo-random from a 2D point
  var h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}
fn vnoise(p: vec2<f32>) -> f32 {           // value noise: smooth interpolated hash
  let i = floor(p); let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);         // smoothstep weights
  return mix(mix(hash21(i+vec2(0,0)), hash21(i+vec2(1,0)), u.x),
             mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), u.x), u.y);
}
fn fbm(p0: vec2<f32>) -> f32 {             // fractal: octaves of noise at rising freq
  var p = p0; var a = 0.5; var sum = 0.0;
  for (var i = 0; i < 5; i++) { sum += a * vnoise(p); p = p * 2.02; a *= 0.5; }
  return sum;
}
```

**Domain warping** — feed noise into itself for the swirling, liquid look (the secret behind good water/aurora):
```wgsl
let q = vec2(fbm(p + u.time*0.05), fbm(p + vec2(5.2, 1.3)));
let warped = fbm(p + 4.0 * q);
```

> `sin`-based hashes are cheap but can band on some GPUs; for production water prefer an integer-hash (PCG) variant. For UI ambiance, `hash21` is fine.

## Color — palettes, not raw RGB

Use Inigo Quilez's cosine palette: one function, infinite coherent gradients. Keeps a shader on-brand and avoids rainbow-vomit.

```wgsl
fn palette(t: f32, a: vec3<f32>, b: vec3<f32>, c: vec3<f32>, d: vec3<f32>) -> vec3<f32> {
  return a + b * cos(6.28318 * (c * t + d));
}
// Harbor mustard→navy ramp: warm sun on dark water
// palette(t, vec3(0.15,0.15,0.22), vec3(0.5,0.45,0.3), vec3(1.0,1.0,0.6), vec3(0.0,0.1,0.2))
```
Always derive the accent from `u.accent` (the theme token pushed from gpui) so light/dark and the brand palette flow into the shader — never hardcode `#FFDB33` in WGSL.

## Dithering & pixelation — the house style

Retro-futuristic is not a filter you add at the end; it's two cheap operators you apply throughout.

**Pixelation** — snap UV to a coarse grid before sampling, so noise/SDFs render chunky:
```wgsl
let px = 4.0;                              // device px per "fat pixel"
let guv = floor(frag.xy / px) * px / u.res;
```

**Ordered (Bayer) dithering** — quantize a continuous value to few levels using a 4×4 threshold matrix; gives the dissolve/gradient-without-banding look that defines the chrome and water.

```wgsl
fn bayer4(p: vec2<f32>) -> f32 {
  let x = i32(p.x) & 3; let y = i32(p.y) & 3;
  // 4x4 Bayer matrix / 16, returns a threshold in [0,1)
  let m = array<f32,16>(0.0,8.0,2.0,10.0, 12.0,4.0,14.0,6.0, 3.0,11.0,1.0,9.0, 15.0,7.0,13.0,5.0);
  return m[y*4 + x] / 16.0;
}
// dither a grayscale value v to N levels:
fn dither(v: f32, frag: vec2<f32>, levels: f32) -> f32 {
  let t = bayer4(frag);
  return floor(v * levels + t) / levels;
}
```
Dither the *luminance* or the palette `t`, not each RGB channel independently (that rainbows). Two-tone dither (`levels = 2.0`) on the accent vs. background is the signature chrome-border / signal-flag texture.

## Cost — what's cheap, what bites

| Cheap (per-pixel, fine at 60fps) | Expensive (budget it) |
|---|---|
| `sin/cos`, `mix`, `smoothstep`, a few SDFs | `fbm` with 6+ octaves at full res |
| one `hash21`/`vnoise` | nested domain-warp (`fbm` of `fbm` of `fbm`) |
| Bayer dither, pixelation | per-pixel loops (raymarch) on a large pane |
| `fwidth` AA | branchy `if` chains (GPUs run both sides) |

Mitigations: **pixelate first** (fewer effective fragments), cap fbm octaves, precompute constants, and render ambient surfaces at reduced resolution then upscale (the dither hides it). Profile with a frame counter uniform; if a pane drops frames, it's almost always fbm octaves or full-res raymarch.

## Quality Gates

- [ ] UV is aspect-corrected for SDF geometry (circles stay round on resize).
- [ ] All anti-aliasing uses `fwidth`, never a hardcoded feather → HiDPI-correct.
- [ ] Color comes from `palette()` + `u.accent` (theme token), no hardcoded brand hex.
- [ ] Dither/pixelation applied to luminance/palette-t, not per-RGB-channel.
- [ ] fbm octave count is the first thing tuned for the frame budget.
- [ ] No reliance on `iChannel`/texture inputs that aren't explicitly bound.
- [ ] `time` is the only animation input — freezable for reduced-motion (see `04`).
