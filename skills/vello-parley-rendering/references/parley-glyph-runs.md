# Feeding Parley glyph runs into a Vello Scene

The single function everyone gets stuck writing. Verified against parley 0.2 /
vello 0.3. This is the exact shape used in `core/pd-timeline-proto/src/scene.rs`.

## Lay out a line

```rust
use parley::{Alignment, FontContext, LayoutContext, Layout, StyleProperty,
             PositionedLayoutItem, GlyphRun};
use vello::peniko::{Brush, Color, Fill};
use kurbo::Affine;
use vello::Scene;

// Keep these alive across frames; do NOT rebuild per frame.
struct TextEngine {
    font_cx: FontContext,
    layout_cx: LayoutContext<Brush>,
}

fn draw_text(
    te: &mut TextEngine,
    scene: &mut Scene,
    text: &str,
    x: f64, y: f64,
    size: f32,
    color: Color,
    scale: f32,          // window.scale_factor() as f32 — HiDPI correctness
) {
    let mut builder = te.layout_cx.ranged_builder(&mut te.font_cx, text, scale);
    builder.push_default(StyleProperty::FontSize(size));
    builder.push_default(StyleProperty::Brush(Brush::Solid(color)));
    let mut layout: Layout<Brush> = builder.build(text);
    layout.break_all_lines(None);
    layout.align(None, Alignment::Start);          // 0.3 signature: no trailing bool

    let transform = Affine::translate((x, y));
    for line in layout.lines() {
        for item in line.items() {
            if let PositionedLayoutItem::GlyphRun(run) = item {
                render_glyph_run(scene, &run, transform);
            }
        }
    }
}
```

## Render one glyph run into the scene

```rust
fn render_glyph_run(scene: &mut Scene, glyph_run: &GlyphRun<Brush>, transform: Affine) {
    let mut x = glyph_run.offset();
    let y = glyph_run.baseline();
    let run = glyph_run.run();
    let font = run.font();
    let font_size = run.font_size();
    let synthesis = run.synthesis();
    let glyph_xform = synthesis
        .skew()
        .map(|angle| Affine::skew(angle.to_radians().tan() as f64, 0.0));

    // CRITICAL: parley gives &[i16]; vello/skrifa wants &[F2Dot14].
    // They are the same 2-byte bits (F2Dot14 is repr(transparent) over i16).
    let raw = run.normalized_coords();
    let coords: &[vello::skrifa::raw::types::F2Dot14] =
        unsafe { std::slice::from_raw_parts(raw.as_ptr().cast(), raw.len()) };

    let brush = glyph_run.style().brush.clone();

    scene
        .draw_glyphs(font)
        .brush(&brush)
        .transform(transform)
        .glyph_transform(glyph_xform)
        .font_size(font_size)
        .normalized_coords(coords)
        .draw(
            Fill::NonZero,
            glyph_run.glyphs().map(|g| {
                let gx = x + g.x;
                let gy = y - g.y;        // note the SIGN: parley y is up, vello y is down
                x += g.advance;
                vello::Glyph { id: g.id as u32, x: gx, y: gy }
            }),
        );
}
```

## Gotchas

- **Coords reinterpret**: skipping the `i16 -> F2Dot14` cast gives
  `expected &[F2Dot14], found &[i16]`. The `unsafe` slice cast is the idiomatic
  fix (parley's own examples do this).
- **Y sign**: parley glyph `y` is positive-up relative to baseline; Vello's glyph
  `y` is positive-down. Subtract (`y - g.y`), don't add.
- **Advance accumulation**: you must thread `x += g.advance` through the
  iterator; the glyph stream is positioned by you, not by vello.
- **Keep `FontContext`/`LayoutContext` alive**: rebuilding them every frame
  re-scans system fonts and tanks your frame time. Store them in your app state.
- **Tofu boxes** for some chars (e.g. the `←`/`→` arrow glyphs) mean the default
  font lacks them — pick a font with the glyphs or use ASCII labels.
