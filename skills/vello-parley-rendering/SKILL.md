---
license: Apache-2.0
name: vello-parley-rendering
description: |
  Render GPU-accelerated 2D vector graphics (bezier paths, fills, strokes,
  gradients) and high-quality shaped text in Rust with the Linebender stack:
  Vello (compute-based vector renderer on wgpu) + Parley (text shaping/layout)
  + kurbo (geometry) + peniko (brushes/color). Covers winit+wgpu surface setup,
  building a Scene every frame, feeding Parley glyph runs into Vello, the
  retained-vs-immediate question, vsync/frame pacing, and the version-pinning
  minefield between vello/wgpu/parley. Activate on: "Vello", "Parley",
  "Linebender", "GPU vector rendering in Rust", "render text with wgpu",
  "kurbo bezier", "peniko brush", "draw_glyphs", "Scene::fill", "custom 2D GPU
  canvas". NOT for: 3D rendering (use wgpu directly or bevy), Metal shader
  authoring (use metal-text-pipeline / metal-shader-expert), web canvas
  (use Canvas2D/WebGL), or native OS widgets (use gpui/egui/iced).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Frontend & UI
  tags:
    - vello
    - parley
    - wgpu
    - rust
    - gpu
    - vector-graphics
    - text-rendering
    - linebender
    - kurbo
    - peniko
  pairs-with:
    - skill: metal-text-pipeline
      reason: The bare-metal counterpart — what Vello hides, and when pure Metal is worth it.
    - skill: metal-shader-expert
      reason: For when you drop below Vello into MSL compute/fragment shaders.
    - skill: rust-app-distribution
      reason: Shipping the signed/notarized desktop binary that hosts the renderer.
  provenance:
    kind: first-party
    owners: [port-daddy]
  authorship:
    maintainers: [port-daddy]
---

# Vello + Parley GPU Vector Rendering (Rust)

Vello is a **compute-shader 2D vector renderer**: you hand it a `Scene` (a list
of filled/stroked paths, images, glyph runs) and it rasterizes the whole thing
on the GPU in a few compute passes. Parley is the **text** half: it shapes and
lays out Unicode runs (via HarfRust + Swash/Skrifa) and yields positioned
glyphs you stream straight into the same Vello `Scene`. Together they give you a
**pixel-perfect, fully custom 2D canvas** with no widget model in the way —
which is the entire reason you'd reach for them over gpui/egui.

This skill is the worked, version-pinned, gotcha-annotated path from "blank
window" to "anti-aliased beziers + crisp shaped text at 120fps." The worked
example is real: `core/pd-timeline-proto/` in this repo renders a scrubable
timeline (tracks, event markers, causal bezier threads, a playhead) this way.

## When To Use

- You need a **bespoke 2D visualization** (timeline, node graph, waveform, map,
  diagram) where every pixel is yours and a retained widget tree gets in the way.
- You want **resolution-independent vector** output (smooth zoom, crisp on HiDPI)
  without managing your own tessellation/rasterization.
- You need **high-quality text** (real shaping, ligatures, variable fonts, RTL)
  rather than a bitmap-font hack.
- You're already on `wgpu` and want a 2D layer that composes with your 3D, or you
  want one renderer that runs on Metal/Vulkan/DX12/GL from one codebase.

## NOT For

- 3D scenes, meshes, lighting → use `wgpu` directly, or `bevy`.
- Authoring the shaders themselves → `metal-shader-expert` (MSL) or wgpu WGSL.
- The "should I even leave gpui?" decision and pure-Metal costs →
  `metal-text-pipeline`.
- Native OS controls, accessibility trees, text input widgets → `gpui`, `egui`,
  `iced`. Vello draws; it does not give you a button or a focus ring.
- Web targets → Canvas2D / WebGL / WebGPU bindings, not native Vello (Vello does
  have a web path, but if web is your primary target start there).

## Decision Points

### 1. Pick the stack layer you actually need
```
What are you drawing?
├─ Arbitrary 2D vector + text, custom layout
│   └─ Vello (Scene) + Parley (text) + kurbo (geom) + peniko (brush)   ← this skill
├─ 2D but you want widgets/layout/events handed to you
│   └─ Xilem (Linebender's UI framework, built on Vello+Parley) or egui/iced
├─ Just static SVG → raster once
│   └─ resvg / usvg (CPU) is simpler; skip the GPU entirely
└─ 3D / GPGPU
    └─ wgpu directly; Vello is the wrong tool
```

### 2. Windowing + GPU surface
```
Need a window?
├─ Cross-platform desktop  → winit 0.30 (ApplicationHandler model)
│   └─ GPU via wgpu; Vello ships `vello::util::RenderContext` to manage
│      Instance/Adapter/Device/Surface for you — USE IT, don't hand-roll wgpu init
├─ Embedding in an existing wgpu app
│   └─ Construct `Renderer` against your existing Device; render to your texture
└─ Headless render-to-PNG (tests, thumbnails, CI)
    └─ Vello can render to a wgpu texture you read back; no surface needed
```

### 3. Retained vs immediate (Vello's real model)
Vello is **immediate from your side, retained on the GPU side**. You rebuild a
`Scene` each frame with `scene.reset()` then re-`fill`/`stroke`/`draw_glyphs`.
This sounds wasteful; it isn't — scene encoding is CPU-cheap (microseconds for
thousands of primitives) and the GPU does the heavy raster.
```
Rebuilding the scene every frame is the NORMAL pattern.
├─ Static content, rare changes → still rebuild; it's fine. Don't over-engineer caching.
├─ Huge scenes (100k+ paths) → consider sub-scenes / append() of cached fragments
└─ NEVER try to "diff" or mutate a Scene in place — that's not the API.
```

### 4. Anti-aliasing config
```
RendererOptions.antialiasing_support + RenderParams.antialiasing_method must AGREE.
├─ Cheapest, great for UI/vector   → AaSupport::area_only() + AaConfig::Area
├─ MSAA8/MSAA16 → heavier, only if Area shows artifacts on thin strokes
└─ Mismatch (support says Area, params ask Msaa16) → panic at render time.
```

### 5. Frame pacing
```
PresentMode?
├─ AutoVsync (default, recommended) → tear-free, caps to display (60/120 ProMotion)
├─ AutoNoVsync → uncapped; use ONLY to benchmark raw GPU headroom, not to ship
└─ On ProMotion you get 120fps free IF you request a redraw every frame.
    winit only redraws on request — call window.request_redraw() to keep animating.
```

## Failure Modes

### 1. Version skew between vello / wgpu / parley (the #1 time sink)
- **Symptoms**: `expected wgpu::Device, found wgpu::Device` (two wgpu majors in
  the tree); `RenderSurface` field/method not found; trait bound errors on
  `Brush`.
- **Root cause**: `vello` re-exports a specific `wgpu` major. If your `Cargo.toml`
  pulls a different `wgpu`, you have two incompatible `wgpu` crates.
- **Fix**: Let `vello` own the wgpu version. Either depend on `vello` only and use
  `vello::wgpu::…`, or pin your direct `wgpu` to **exactly** the major vello uses
  (vello 0.3 → wgpu 22; check `cargo tree -i wgpu`). Same discipline for parley:
  vello 0.3 pairs with parley 0.2 / peniko 0.2 / kurbo 0.11.
- **Detect**: `cargo tree -d` (the `-d` finds duplicate crates). Two `wgpu`
  entries = you will fail to compile or get cryptic type errors.

### 2. Glyph normalized-coords type mismatch
- **Symptoms**: `expected &[F2Dot14], found &[i16]` when calling
  `.normalized_coords(...)` on `draw_glyphs`.
- **Root cause**: Parley yields variation coords as `&[i16]`; Vello/Skrifa wants
  `&[NormalizedCoord]` (a `#[repr(transparent)]` wrapper over the same i16 bits,
  F2Dot14).
- **Fix**: reinterpret the slice — they are layout-identical:
  `let coords: &[skrifa::raw::types::F2Dot14] = unsafe { std::slice::from_raw_parts(raw.as_ptr().cast(), raw.len()) };`
  (Both are 2-byte; this is the idiom the parley examples use.)

### 3. API churn across minor versions
- **Symptoms**: `Layout::align` "takes 2 arguments but 3 supplied";
  `with_alpha_factor` deprecated; `RenderContext::create_surface` signature drift.
- **Root cause**: Pre-1.0 Linebender crates move fast.
- **Fix**: pin exact minors and read THAT version's `examples/` (clone the tagged
  repo or open docs.rs at the pinned version). Don't trust a blog post for a
  different minor. `peniko::Color::with_alpha_factor` → `multiply_alpha`;
  `Layout::align(width, alignment)` dropped its trailing bool.

### 4. Borrow-checker fights in the winit ApplicationHandler
- **Symptoms**: "cannot borrow `*self` as immutable because it is also borrowed
  as mutable" inside `window_event`.
- **Root cause**: holding `let state = self.state.as_mut()` across calls to other
  `&self`/`&mut self` helpers and disjoint fields.
- **Fix**: pull the `Arc<Window>` + dims out up front into locals, drop the
  `state` binding, then take short, scoped borrows. Access **disjoint struct
  fields directly** (e.g. `&self.context`, `self.renderers[i]`, `&self.scene`) so
  the borrow checker can split the `&mut self` — don't funnel them through one
  intermediate `&mut state`.

### 5. Black / empty window
- **Symptoms**: window opens, renders nothing.
- **Checklist**: (a) did you `request_redraw()` after resume/resize? winit won't
  redraw on its own. (b) `RenderParams.width/height` must match the surface
  config, not the logical size. (c) surface format from
  `surface.config.format` must be what the `Renderer` was created with. (d) you
  called `surface_texture.present()`. (e) `scene.reset()` then actually pushed
  primitives.

### 6. HiDPI text/geometry at half/double size
- **Root cause**: mixing logical and physical pixels. winit gives physical
  surface sizes; your layout is usually in logical points.
- **Fix**: pass `window.scale_factor()` into Parley's layout (`ranged_builder`
  takes a `scale`) AND into your geometry transform, consistently. Decide one
  coordinate space and convert at the boundary.

## Worked Example

A minimal-but-complete loop (the shape `core/pd-timeline-proto` uses). Pinned to
vello 0.3 / wgpu 22 / parley 0.2 / peniko 0.2 / kurbo 0.11 / winit 0.30.

```rust
// Cargo.toml: vello="0.3"  wgpu="22"  winit="0.30"  parley="0.2"
//             peniko="0.2"  kurbo="0.11"  pollster="0.4"

use vello::util::{RenderContext, RenderSurface};
use vello::{AaConfig, AaSupport, Renderer, RendererOptions, RenderParams, Scene};
use vello::peniko::{Color, Fill};
use vello::wgpu;                  // <- use vello's re-exported wgpu, never a second one
use kurbo::{Affine, Circle, Point, Stroke, Line};

// 1. Surface (winit Window -> wgpu Surface), let Vello's RenderContext drive wgpu init.
let mut cx = RenderContext::new();
let surface: RenderSurface =
    pollster::block_on(cx.create_surface(window.clone(), w, h, wgpu::PresentMode::AutoVsync))?;

// 2. One Renderer per device. AA support must match the AA you ask for at render time.
let mut renderer = Renderer::new(
    &cx.devices[surface.dev_id].device,
    RendererOptions {
        surface_format: Some(surface.format),
        use_cpu: false,
        antialiasing_support: AaSupport::area_only(),   // pairs with AaConfig::Area below
        num_init_threads: None,
    },
)?;

// 3. Per frame: rebuild the scene from scratch.
let mut scene = Scene::new();
scene.reset();
scene.stroke(&Stroke::new(1.0), Affine::IDENTITY, Color::rgb8(0x2a,0x32,0x3c), None,
             &Line::new(Point::new(0.0, 100.0), Point::new(800.0, 100.0)));
scene.fill(Fill::NonZero, Affine::IDENTITY, Color::rgb8(0x4f,0xd1,0x6b), None,
           &Circle::new(Point::new(120.0, 100.0), 5.0));
// (text via Parley -> scene.draw_glyphs(...); see references/parley-glyph-runs.md)

// 4. Render to the surface.
let tex = surface.surface.get_current_texture()?;
let dev = &cx.devices[surface.dev_id];
renderer.render_to_surface(&dev.device, &dev.queue, &scene, &tex, &RenderParams {
    base_color: Color::rgb8(0x0d,0x11,0x17),
    width: w, height: h,
    antialiasing_method: AaConfig::Area,                // must agree with AaSupport above
})?;
tex.present();
window.request_redraw();   // keep animating; winit won't redraw on its own
```

**Text (the Parley half), the part everyone gets stuck on:** build a `Layout`,
`break_all_lines`, `align`, then for each `PositionedLayoutItem::GlyphRun`, call
`scene.draw_glyphs(font).brush(..).transform(..).font_size(..).normalized_coords(coords).draw(Fill::NonZero, glyphs)`
where `glyphs` is an iterator of `vello::Glyph { id, x, y }` you accumulate by
advancing `x += g.advance`. See `references/parley-glyph-runs.md` for the exact,
compile-checked function.

## Anti-Patterns

### Anti-Pattern 1: Pulling your own `wgpu` next to Vello's
```toml
# ❌ two wgpu majors in the tree -> type mismatches everywhere
vello = "0.3"
wgpu  = "0.20"   # vello 0.3 wants wgpu 22
```
```toml
# ✅ either use vello::wgpu, or pin the SAME major vello uses
vello = "0.3"
wgpu  = "22"     # matches; verify with `cargo tree -d`
```

### Anti-Pattern 2: Caching/diffing the Scene to "save work"
Rebuilding the scene each frame is the intended model and costs microseconds.
Building a retained scene-graph diff layer on top is wasted complexity and fights
the API. Only reach for `Scene::append` of cached sub-scenes when you have
genuinely huge (100k+ primitive) static regions, measured.

### Anti-Pattern 3: Bitmap fonts / texture-atlas-by-hand for text
Vello + Parley already do GPU glyph rendering with real shaping. Hand-rolling a
bitmap atlas throws away ligatures, hinting, variable fonts, RTL/complex scripts,
and HiDPI crispness. If you think you need a manual atlas, you're below the right
layer — see `metal-text-pipeline` for when that's actually justified.

### Anti-Pattern 4: Ignoring `request_redraw` and wondering why it's static
winit is event-driven. No redraw request → no frame. Animations, scrubbing, and
auto-play all require you to request the next redraw (from `resumed`, after input,
and at the end of a frame while animating).

### Anti-Pattern 5: Trusting a tutorial for a different crate version
These crates are pre-1.0 and rename things between minors. A snippet for vello
0.2 will not compile against 0.3. Always read the `examples/` in the *tagged*
release matching your pin.

## References

- `references/version-matrix.md` — known-good vello/wgpu/parley/peniko/kurbo/winit
  version combinations and how to verify with `cargo tree -d`.
- `references/parley-glyph-runs.md` — the exact, compile-checked
  `render_glyph_run` function that feeds Parley output into a Vello `Scene`,
  including the `i16 -> F2Dot14` coords reinterpret.

## Provenance

Worked example and gotchas verified against `core/pd-timeline-proto/` in this
repo (a winit+wgpu+Vello+Parley "Voyage Timeline" window), built and run on
Apple M4 Max (Metal backend) at sub-millisecond per-frame GPU cost.

<!-- BEGIN BUNDLE INDEX (auto: index_references.py) -->

## Skill Bundle Index

*Every file in this skill, and when to open it. Auto-generated; run `scripts/index_references.py --fix`.*

**`references/`**
- [`references/parley-glyph-runs.md`](references/parley-glyph-runs.md) — Feeding Parley glyph runs into a Vello Scene — The single function everyone gets stuck writing.
- [`references/version-matrix.md`](references/version-matrix.md) — Vello / wgpu / Parley version matrix — Pre-1.0 Linebender crates move in lockstep clusters.

<!-- END BUNDLE INDEX -->
