---
license: Apache-2.0
name: metal-text-pipeline
description: |
  Decide HOW LOW to go for a bare-metal 2D/text rendering pipeline on Apple GPUs,
  and pay the right costs. Covers the layered choice — pure objc2-metal +
  hand-written MSL (own command queue, glyph atlas, frame pacing) vs wgpu (Metal
  under the hood, cross-platform) vs Vello-on-wgpu (compute vector renderer you
  don't have to write) — plus CAMetalLayer/CADisplayLink frame pacing, ProMotion
  120Hz, the glyph-atlas / signed-distance-field text problem, CPU-GPU sync, and
  honest cost accounting of "pure Metal" vs standing on Linebender. Activate on:
  "objc2-metal", "objc2", "CAMetalLayer", "CADisplayLink", "Metal command queue",
  "glyph atlas", "SDF text", "ProMotion frame pacing", "bare-metal Rust
  rendering on macOS", "pure Metal vs wgpu", "MTLDrawable". NOT for: writing the
  MSL shaders themselves (use metal-shader-expert), the Vello/Parley high-level
  API (use vello-parley-rendering), 3D engines (use wgpu/bevy), or iOS UIKit
  drawing.
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Frontend & UI
  tags:
    - metal
    - objc2
    - objc2-metal
    - rust
    - gpu
    - text-rendering
    - glyph-atlas
    - frame-pacing
    - promotion
    - apple
  pairs-with:
    - skill: vello-parley-rendering
      reason: The high-level path this skill decides whether to drop below.
    - skill: metal-shader-expert
      reason: When you do go bare-metal, this is who writes the MSL.
    - skill: rust-app-distribution
      reason: Signing/notarizing the resulting macOS binary.
  provenance:
    kind: first-party
    owners: [port-daddy]
  authorship:
    maintainers: [port-daddy]
---

# The Metal Text / Render Pipeline (how low to go on Apple GPUs)

There are three rungs on the ladder for a custom 2D + text surface on macOS, and
the expensive mistake is picking the wrong rung. This skill is the decision and
the cost accounting — **not** the MSL itself (`metal-shader-expert`) and **not**
the Vello API (`vello-parley-rendering`).

```
Rung 3 (lowest):  objc2 + objc2-metal, hand-written MSL.
                  You own: CAMetalLayer, command queue, render passes, a glyph
                  atlas (rasterize glyphs -> texture -> quads), AA, frame pacing.
Rung 2 (middle):  wgpu. Metal under the hood on macOS; portable. You still write
                  pipelines/shaders, but no Obj-C, no CAMetalLayer plumbing.
Rung 1 (highest): Vello on wgpu. The compute vector renderer + Parley text are
                  written FOR you. You build a Scene; the GPU does the rest.
```

The honest headline, measured on this repo's `core/pd-timeline-proto` (Apple
M4 Max, Metal): a full timeline frame — beziers, dozens of markers, shaped text —
costs **~0.5–2 ms of GPU build+submit**, vsync-bound otherwise. That performance
came from **Rung 1**. You do not need Rung 3 to hit 120fps ProMotion for a 2D
operator UI. Rung 3 is justified only by specific constraints below.

## When To Use (this decision skill)

- You're choosing between pure `objc2-metal` and a higher-level renderer for a
  Rust macOS app and want the costs spelled out before you commit.
- You already went bare-metal and need the frame-pacing / glyph-atlas / CPU-GPU
  sync patterns done right.
- Someone proposed "let's write it in pure Metal for performance" and you need to
  pressure-test that against the measured ceiling.

## NOT For

- Writing the actual MSL vertex/fragment/compute shaders → `metal-shader-expert`.
- The Vello + Parley high-level API and its gotchas → `vello-parley-rendering`.
- 3D engines / scene graphs → `wgpu` directly, `bevy`.
- iOS UIKit/CoreGraphics 2D drawing, or SwiftUI Canvas → those are different
  stacks (`swiftui-data-flow-expert`, etc.).

## Decision Points

### 1. Which rung?
```
Do you need a CUSTOM 2D vector + text surface on macOS in Rust?
├─ Yes, and you want it shipped this quarter
│   └─ Rung 1: Vello + Parley on wgpu.  (default — proven 120fps for 2D UI)
├─ Yes, AND you have a HARD reason to control the metal directly:
│   ├─ Need a specific Metal feature wgpu doesn't expose
│   │   (e.g. tile shaders / imageblocks, MTLHeap aliasing tricks,
│   │    raster order groups, custom MSL compute you must hand-tune)
│   ├─ Must share one MTLCommandQueue with existing Obj-C/Swift Metal code
│   ├─ Sub-100µs frame budgets where even wgpu's abstraction is measurable
│   └─ then → Rung 3: objc2 + objc2-metal, and bring metal-shader-expert
└─ You also want portability (Vulkan/DX12/GL) or 3D
    └─ Rung 2: wgpu directly.
```
Default to Rung 1. Drop a rung only when you can NAME the constraint that forces
it. "It'll be faster" is not a constraint until you've measured Rung 1 missing
the budget — and for 2D UI it won't.

### 2. Frame pacing on ProMotion (all rungs)
```
Target 120Hz on ProMotion displays?
├─ Rung 3 (CAMetalLayer): drive with CADisplayLink; set
│   layer.maximumDrawableCount = 3 (triple buffer); set
│   CAMetalLayer.displaySyncEnabled = true; request the 120Hz cadence via
│   the display link's preferredFrameRateRange.
├─ Rung 1/2 (wgpu): PresentMode::AutoVsync caps to the display automatically;
│   you only need to request a redraw every frame to actually hit 120.
└─ Common trap: animation looks "60fps" because you only redraw on input.
    The renderer isn't the limit — your event loop is. Request redraw each frame.
```

### 3. Text: glyph atlas vs Parley
```
How are you drawing text?
├─ Rung 1: Parley shapes+lays out; Vello rasterizes glyphs on GPU. Done.
├─ Rung 3: you own the whole thing:
│   1. Shape with a HarfBuzz/HarfRust/CoreText pass (don't reinvent shaping).
│   2. Rasterize each needed glyph once into a texture ATLAS (CPU raster via
│      Swash/CoreText, upload to MTLTexture). Cache by (glyph_id, size, subpixel).
│   3. Emit a textured quad per glyph; sample the atlas in the fragment shader.
│   4. For crisp scaling, consider SDF/MSDF atlases (one raster, many sizes) —
│      trades a fancier shader for not re-rasterizing per size.
└─ NEVER: a fixed bitmap font. It throws away shaping, hinting, variable fonts,
    RTL/complex scripts, and HiDPI crispness.
```

### 4. CPU-GPU synchronization (Rung 3)
```
Avoiding stalls and races on a hand-rolled queue?
├─ Triple-buffer your per-frame uniform/vertex buffers (3 in flight).
├─ Gate frame N+3 on a dispatch_semaphore signaled in the command buffer's
│   completion handler (the canonical Metal pattern).
├─ Never write a buffer the GPU might still be reading. The semaphore is what
│   makes that safe without a full stall.
└─ Rung 1/2 (wgpu) handles this for you; this whole box is a cost of Rung 3.
```

## Failure Modes

### 1. "Let's go pure Metal for speed" with no measurement
- **Symptom**: weeks spent on CAMetalLayer/atlas plumbing to render a 2D UI that
  Vello did in an afternoon at 0.6ms/frame.
- **Root cause**: assuming the abstraction is the bottleneck without profiling.
- **Fix**: build the Rung-1 version FIRST, measure with the GPU frame capture
  (Xcode Metal debugger) or a simple submit-time log. Only drop rungs against a
  named, measured miss.

### 2. Reinventing the vector rasterizer
- **Symptom**: hand-writing anti-aliased bezier fill/stroke in MSL.
- **Root cause**: not realizing that's *exactly* what Vello's compute pipeline is
  (coarse rasterization + fine per-tile AA). It's a research-grade renderer.
- **Fix**: unless your constraint is "I can't link Vello," don't. This is the
  single biggest cost of Rung 3 and the main reason this prototype chose Rung 1.

### 3. ProMotion locked to 60
- **Symptom**: 120Hz display, app renders 60.
- **Root cause**: not requesting the high frame-rate range (Rung 3:
  `preferredFrameRateRange`; all rungs: `Info.plist`
  `CADisableMinimumFrameDurationOnPhone` / display-link cadence) OR only
  redrawing on input.
- **Fix**: request the next frame unconditionally while animating; set the
  display link / present mode to the display cadence.

### 4. Glyph atlas thrash
- **Symptom**: frame time spikes whenever new text appears.
- **Root cause**: rasterizing+uploading glyphs mid-frame, or an atlas too small so
  it evicts and re-rasters.
- **Fix**: size the atlas generously, cache by (glyph, size, subpixel offset),
  rasterize off the hot path, and consider an SDF atlas so one raster serves many
  sizes.

### 5. objc2 memory-management surprises
- **Symptom**: crashes / leaks at the Rust↔Obj-C boundary.
- **Root cause**: mishandling retain/release, autorelease pools, or `&` vs
  `Retained<…>` in `objc2`.
- **Fix**: use `objc2`'s typed `Retained<T>` and the framework crates
  (`objc2-metal`, `objc2-quartz-core`, `objc2-foundation`) rather than raw
  message sends; wrap frame work in an `autoreleasepool`. This boilerplate is a
  Rung-3-only tax.

## Worked Example: the rung decision for this repo

**Context**: a Track-B "Voyage Timeline" operator surface — horizontal tracks,
timestamped markers, smooth causal bezier threads, shaped text labels, a
scrubable playhead, target 120fps ProMotion.

**Considered Rung 3** (pure objc2-metal): would have meant owning a CAMetalLayer,
a command queue, a glyph atlas + shaping pass, an anti-aliased bezier
rasterizer in MSL, and triple-buffered CPU-GPU sync. Weeks of work, most of it
re-implementing Vello.

**Chose Rung 1** (winit + wgpu + Vello + Parley): days, not weeks. wgpu lowers to
**Metal** on macOS (confirmed at runtime: `backend: Metal, Apple M4 Max`), so we
keep "bespoke GPU vector rendering" — the beziers and text are genuinely GPU
vector, fully under our control via the `Scene` API — without writing the
rasterizer.

**Measured result**: ~0.5–2 ms GPU build+submit per frame; vsync-bound otherwise;
uncapped benchmark logged 750–900 FPS. Conclusion: for a 2D operator UI, Rung 1
clears 120fps ProMotion with ~99% of the frame budget to spare. **Bare-metal
(Rung 3) is not worth it here**; reserve it for a future surface that needs a
specific Metal feature wgpu/Vello don't expose.

See `references/objc2-metal-skeleton.md` for the Rung-3 skeleton (what you'd own
if you did drop down) and `references/cost-ledger.md` for the side-by-side cost
accounting.

## Anti-Patterns

### Anti-Pattern 1: Equating "lower level" with "faster" for 2D UI
The GPU work for a 2D vector+text frame is tiny at every rung. The win from Rung 3
is *control of specific Metal features*, not raw 2D throughput. If you can't name
the feature, you're paying for nothing.

### Anti-Pattern 2: Hand-rolling shaping
CoreText / HarfRust exist. Writing your own shaper (kerning, ligatures, cluster
mapping, bidi) is a multi-year project you will get wrong. Even at Rung 3, shape
with a real shaper and only own the atlas+raster.

### Anti-Pattern 3: Single-buffering a hand-rolled Metal frame
One per-frame buffer the GPU is still reading = tearing/races or a full stall.
Triple-buffer + a completion-handler semaphore. (Free at Rung 1/2.)

### Anti-Pattern 4: Skipping the Rung-1 measurement
"We'll go straight to Metal" with no baseline means you can never prove the lower
rung was warranted. Always have the Rung-1 number in hand.

## References

- `references/objc2-metal-skeleton.md` — the minimal Rung-3 pipeline you'd own:
  CAMetalLayer + command queue + glyph-atlas sketch + the triple-buffer
  semaphore, in `objc2`/`objc2-metal` terms.
- `references/cost-ledger.md` — side-by-side cost accounting (Rung 1 vs Rung 3):
  what you write, what you maintain, what you measure.

## Provenance

Decision and measurements are from `core/pd-timeline-proto/` in this repo (Rung 1:
winit+wgpu+Vello+Parley), run on Apple M4 Max with the Metal backend.

<!-- BEGIN BUNDLE INDEX (auto: index_references.py) -->

## Skill Bundle Index

*Every file in this skill, and when to open it. Auto-generated; run `scripts/index_references.py --fix`.*

**`references/`**
- [`references/cost-ledger.md`](references/cost-ledger.md) — Cost ledger: Rung 1 (Vello/Parley) vs Rung 3 (pure objc2-metal) — Side-by-side of what you actually write, maintain, and measure.
- [`references/objc2-metal-skeleton.md`](references/objc2-metal-skeleton.md) — Rung-3 skeleton: what you own with pure objc2-metal — This is the pipeline you'd hand-write if you dropped below wgpu/Vello.

<!-- END BUNDLE INDEX -->
