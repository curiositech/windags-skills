# Vello / wgpu / Parley version matrix

Pre-1.0 Linebender crates move in lockstep clusters. Pick a cluster; do not mix.

## Known-good clusters

| vello | wgpu | parley | peniko | kurbo | winit | notes |
|-------|------|--------|--------|-------|-------|-------|
| 0.3   | 22   | 0.2    | 0.2    | 0.11  | 0.30  | Verified in `core/pd-timeline-proto` on macOS/Metal, M4 Max. |
| 0.2   | 0.20 | 0.1    | 0.1    | 0.11  | 0.29/0.30 | Older; `Layout::align` had a trailing bool; different `RenderContext` API. |

The rule: **let `vello` own the `wgpu` version.** Use `vello::wgpu::…` rather than
adding a second `wgpu` dependency. If you must depend on `wgpu` directly (e.g. to
share a Device with a 3D layer), pin it to the *exact* major vello re-exports.

## How to verify you don't have a split

```bash
# Any duplicate crate (two majors in the graph) prints here.
cargo tree -d

# Specifically: who pulls wgpu, and how many versions?
cargo tree -i wgpu        # inverse tree: every path that reaches wgpu
```

If `cargo tree -d` lists `wgpu` (or `parley`, `peniko`, `kurbo`) more than once,
you have a split and will hit `expected wgpu::Device, found wgpu::Device`-style
errors. Collapse to one version.

## Companion crate compatibility within a cluster

- `peniko` provides `Color`, `Brush`, `Fill`, `Gradient`. vello re-exports it as
  `vello::peniko`. Match its version to vello's.
- `kurbo` provides geometry (`Affine`, `Point`, `BezPath`, `Circle`, `Rect`,
  `Stroke`, `Line`, `Vec2`). Stable-ish at 0.11 across recent vello.
- `skrifa` (font types incl. `F2Dot14`/`NormalizedCoord`) is re-exported as
  `vello::skrifa`. Use that path so the types match what `draw_glyphs` expects.

## API drift cheat-sheet (0.2 -> 0.3)

- `peniko::Color::with_alpha_factor(f)` → `multiply_alpha(f)`.
- `parley::Layout::align(width, alignment, bool)` → `align(width, alignment)`.
- `RenderContext::create_surface(window, w, h, present_mode)` is async — wrap in
  `pollster::block_on(...)`.
- `RendererOptions { antialiasing_support, .. }` must agree with
  `RenderParams { antialiasing_method, .. }` or you panic at render time.
