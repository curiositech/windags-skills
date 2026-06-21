# Rung-3 skeleton: what you own with pure objc2-metal

This is the pipeline you'd hand-write if you dropped below wgpu/Vello. It's here
to make the *cost* concrete, and as a real starting point if a constraint forces
Rung 3. The MSL shaders themselves are out of scope — see `metal-shader-expert`.

Crates (the `objc2` framework family, not raw message sends):

```toml
objc2 = "0.5"
objc2-metal = "0.2"
objc2-quartz-core = "0.2"   # CAMetalLayer
objc2-foundation = "0.2"
objc2-app-kit = "0.2"       # NSView host (or use raw-window-handle from winit)
```

## 1. Layer + device + queue

```rust
use objc2_metal::{MTLCreateSystemDefaultDevice, MTLDevice, MTLCommandQueue};
use objc2_quartz_core::CAMetalLayer;

let device = unsafe { MTLCreateSystemDefaultDevice() }.expect("no Metal device");
let queue = device.newCommandQueue().expect("no queue");

let layer = unsafe { CAMetalLayer::new() };
unsafe {
    layer.setDevice(Some(&device));
    layer.setPixelFormat(objc2_metal::MTLPixelFormat::BGRA8Unorm);
    layer.setMaximumDrawableCount(3);          // triple buffer
    layer.setDisplaySyncEnabled(true);         // vsync; pace via CADisplayLink
}
// Attach `layer` to your NSView (view.setLayer / setWantsLayer:true), or get it
// from winit's raw-window-handle and create the layer on that surface.
```

## 2. Per-frame: drawable + render pass

```rust
use objc2::rc::autoreleasepool;

autoreleasepool(|_| {
    let drawable = unsafe { layer.nextDrawable() }.expect("no drawable");
    let pass = /* MTLRenderPassDescriptor with colorAttachments[0].texture =
                  drawable.texture(), loadAction = Clear, clearColor = bg */;
    let cmd = queue.commandBuffer().unwrap();
    let enc = cmd.renderCommandEncoderWithDescriptor(&pass).unwrap();

    // enc.setRenderPipelineState(&your_pipeline);
    // enc.setVertexBuffer(... triple-buffered ...);
    // enc.setFragmentTexture(Some(&glyph_atlas), 0);
    // enc.drawPrimitives(Triangle, 0, vertex_count);

    enc.endEncoding();
    cmd.presentDrawable(&drawable);
    // completion handler signals the in-flight semaphore (see §4)
    cmd.commit();
});
```

## 3. Glyph atlas (the bulk of the work)

You own the entire text path that Parley+Vello gave you for free:

1. **Shape** the string with a real shaper (HarfRust, or CoreText via
   `objc2`). Output: glyph ids + advances + cluster map. Do NOT write your own.
2. **Rasterize** each unique `(glyph_id, px_size, subpixel_x)` once, CPU-side
   (Swash, or CoreText `CTFontDrawGlyphs` into a CGBitmapContext). Pack into an
   atlas `MTLTexture` with a shelf/skyline packer. Cache the UV rect.
3. **Emit** one textured quad per glyph at the pen position; advance the pen by
   the shaped advance.
4. **Fragment shader** samples the atlas. For multi-size crispness without
   re-rasterizing, build an **SDF/MSDF** atlas (one raster per glyph, sampled at
   any size) — fancier shader, smaller/stabler atlas.

## 4. Triple-buffer + semaphore (CPU-GPU sync)

```rust
// Canonical Metal pattern: at most 3 frames in flight.
let in_flight = /* dispatch_semaphore with value 3 */;
// each frame:
//   in_flight.wait();                              // block if 3 already queued
//   ... encode using buffer[frame % 3] ...
//   cmd.addCompletedHandler(move |_| in_flight.signal());
//   cmd.commit();
```
This is what lets you mutate per-frame buffers without stalling or racing. It is
pure Rung-3 overhead — wgpu/Vello do it internally.

## 5. ProMotion 120Hz

- Drive frames from a `CADisplayLink` (via `objc2-quartz-core`) rather than a
  busy loop; set its `preferredFrameRateRange` to allow 120.
- `CAMetalLayer.displaySyncEnabled = true` for tear-free present.
- Ensure `maximumDrawableCount >= 3` so you can keep the pipe full at 120Hz.

## The point of this file

Count the boxes above: layer plumbing, queue, render-pass encoding, a shaping
integration, a glyph atlas + packer + cache, an SDF shader, triple-buffering, a
semaphore, autorelease pools, objc2 retain semantics, ProMotion pacing. Every one
is yours to write, test, and maintain at Rung 3. At Rung 1 (Vello+Parley) the
entire list collapses to "build a Scene." That asymmetry IS the decision.
