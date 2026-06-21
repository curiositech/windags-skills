# Cost ledger: Rung 1 (Vello/Parley) vs Rung 3 (pure objc2-metal)

Side-by-side of what you actually write, maintain, and measure. Numbers/effort
are from building `core/pd-timeline-proto` (Rung 1) and estimating the Rung-3
equivalent.

## What you write

| Concern                         | Rung 1 (Vello + Parley)            | Rung 3 (objc2-metal)                                  |
|---------------------------------|------------------------------------|-------------------------------------------------------|
| Window + surface                | winit + `RenderContext` (a few lines) | NSView/CAMetalLayer wiring, raw-window-handle plumbing |
| GPU init                        | `RenderContext::create_surface`    | device, queue, pixel format, drawable count, by hand  |
| Vector fill/stroke/AA           | `scene.fill / scene.stroke`        | hand-written AA bezier rasterizer in MSL (research-grade) |
| Text shaping                    | Parley (HarfRust) built-in         | integrate HarfRust/CoreText yourself                  |
| Glyph rasterization             | Vello GPU glyphs                   | CPU raster + atlas + packer + cache + (M)SDF shader   |
| Per-frame buffers / sync        | handled by wgpu                    | triple-buffer + dispatch_semaphore + completion handler|
| Frame pacing (ProMotion)        | `PresentMode::AutoVsync` + redraw  | CADisplayLink + preferredFrameRateRange + displaySync |
| Obj-C memory management         | none                               | objc2 `Retained<T>`, autorelease pools                |

## What you maintain

- **Rung 1**: pin the vello/wgpu/parley cluster; track pre-1.0 API churn (a few
  renames per minor — see `vello-parley-rendering`). Bounded, shared with a large
  community.
- **Rung 3**: every box above is yours forever, plus Apple-platform churn
  (deprecations in QuartzCore/AppKit, new GPU families, ProMotion edge cases) and
  the objc2 boundary. You are the only maintainer.

## What you measure (this repo, Apple M4 Max, Metal)

| Metric                          | Rung 1 measured                    | Rung 3 expected                                       |
|---------------------------------|------------------------------------|-------------------------------------------------------|
| GPU build + submit / frame      | **0.5–2.1 ms** (typ. ~0.6 ms)      | similar order — the GPU work is the same tiny 2D load |
| Frame rate (vsync)              | display-capped (60/120)            | same                                                  |
| Frame rate (uncapped benchmark) | **750–900 FPS**                    | comparable; not the differentiator                    |
| Time-to-first-frame (dev effort)| days                               | weeks                                                 |

## The honest read

For a **2D operator UI** (timelines, graphs, dashboards, text-heavy panes), the
GPU is never the bottleneck at any rung — a full frame is sub-millisecond. Rung 1
already clears 120fps ProMotion with ~99% of the budget idle. The *only* reasons
to pay for Rung 3 are **specific Metal features wgpu/Vello don't expose** (tile
shaders/imageblocks, raster order groups, MTLHeap aliasing, sharing a queue with
existing Obj-C Metal code) or **sub-100µs budgets** where even wgpu's thin layer
is measurable — neither of which a 2D cockpit surface hits.

**Recommendation**: default to Rung 1. Treat Rung 3 as a targeted escalation for
a named feature, backed by a Rung-1 measurement showing the miss. "It'll be
faster" is not, by itself, a reason.
