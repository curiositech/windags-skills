# Shader Surfaces in gpui — Getting a Custom GPU Fragment-Shader Pass Into a Native Rust Window

> **Scope.** The sibling doc `05-bespoke-graphics-vello-wgpu.md` maps the three tiers of bespoke drawing (T1 element tree → T2 gpui `paint`/`canvas` → T3 Vello/wgpu surface) and treats Vello as the **vector** route. This doc goes one floor lower on the T3 path: how to run **your own WGSL fragment shader** — an ocean, a dither field, a noise-warped nebula, a CRT pass — and get its pixels onto a native gpui window (Zed-family, Metal-on-macOS via wgpu). It covers the **render-to-texture-then-sample-back** pattern, the two ADR-0086 integration paths (in-window embed vs companion window), and the uniform plumbing that carries gpui state (`time`, `resolution`, `mouse`, theme color) into the shader.
>
> **Target is gpui 0.2.2 on Metal, not the web.** No `<canvas>`, no WebGL context, no shader-on-a-div, no `requestAnimationFrame`. Everything is Rust + wgpu + WGSL. Shadertoy is a *source of techniques*, never a runtime — every `iTime`/`iResolution`/`iMouse` becomes a uniform you push from a gpui view.

---

## 0. The core problem: gpui owns the window, your shader owns some pixels

gpui's renderer composites a **scene of quads, paths, shadows, and glyphs** to a Metal drawable. It does **not** expose "here is a fragment shader, run it for this rect." There is no `div().shader(...)`. So a custom fragment pass cannot be *injected into* gpui's pipeline. You have exactly two ways to get its pixels onto the user's screen, and ADR-0086 (`docs/adr/0086-operator-console-rendering-stack.md`) names both:

| Path | What it is | When |
|---|---|---|
| **Companion window (ADR-0086 path 3)** | Your shader runs in its **own** `winit`+`wgpu` window/process; gpui `exec`s it. Two windows, two GPU stacks, zero mixing. | **Ship-now.** Focused/modal experiences (a full-window ocean, the timeline scrubber). Lowest risk. |
| **In-window embed (ADR-0086 path 2)** | Your shader renders **to an offscreen texture**; you read that texture back into gpui as an **image**, painted into a normal pane. One window. | **The target.** Ambient, persistent surfaces living *in the pane tree* (a shimmer behind a sortie pane, the biofield). Real systems work. |

**Decision Point — companion vs embed.** Ask one question: *does the effect need to sit inside the gpui layout, next to text panes, reflowing with splits?* If no (it's a focused modal), **companion window** — it's the timeline proto (`core/pd-timeline-proto`) verbatim, already proven `backend: Metal, Apple M4 Max`. If yes, **embed via render-to-texture** — and budget the offscreen-render + texture-upload cost honestly. Never reach for the embed to draw something a T2 `canvas` (dither quads) or a Vello vector pass already does; a raw WGSL pass is justified by *true per-pixel work*: noise, SDF fields, raymarching, water, full-res dither at 60fps.

> **Sidenote — "shared device" is the hard mode of embed.** The *ideal* embed shares one `wgpu::Device` between gpui's renderer and your pass, rendering directly into gpui's framebuffer. gpui 0.2.2 does **not** publicly expose its device/queue or a custom-GPU-element hook, so the practical embed today is **render-to-texture → sample back as a gpui image** (§4). It costs one GPU→CPU→GPU round-trip (or a GPU-side blit if you can get gpui to sample your texture), but it works against the *public* API and keeps your shader stack fully isolated. Treat true device-sharing as forward work, exactly as the ADR does.

---

## 1. The companion-window path (ship-now) — a full wgpu+WGSL window

This is the timeline proto's skeleton with Vello swapped out for your own `RenderPipeline`. The proto (`core/pd-timeline-proto/src/main.rs`) already proves every non-shader part: `winit` event loop, `wgpu` surface creation, Metal backend selection, scrub/redraw timing. Reuse it. The only delta is that instead of `Renderer::render_to_surface(&scene, ...)` you record your **own** render pass that draws a fullscreen triangle through your fragment shader.

### 1.1 Window + surface (lifted from the proto, shader-ified)

```rust
// Cargo.toml (companion crate — kept OUT of the core/ workspace so Linux
// rust-console CI never compiles wgpu, exactly like pd-timeline-proto):
//   wgpu = "*"  winit = "*"  pollster = "*"  bytemuck = { version="*", features=["derive"] }

use std::sync::Arc;
use wgpu::util::DeviceExt;
use winit::{application::ApplicationHandler, event::*, event_loop::*, window::*};

struct Gpu {
    surface: wgpu::Surface<'static>,
    device: wgpu::Device,
    queue: wgpu::Queue,
    config: wgpu::SurfaceConfiguration,
    pipeline: wgpu::RenderPipeline,
    uniforms_buf: wgpu::Buffer,
    bind_group: wgpu::BindGroup,
}

async fn init_gpu(window: Arc<Window>) -> Gpu {
    let instance = wgpu::Instance::default();
    let surface = instance.create_surface(window.clone()).unwrap();
    let adapter = instance
        .request_adapter(&wgpu::RequestAdapterOptions {
            power_preference: wgpu::PowerPreference::HighPerformance,
            compatible_surface: Some(&surface),
            force_fallback_adapter: false,
        })
        .await
        .unwrap();

    // PROVE the backend, like the proto does — should log `Metal` on macOS.
    eprintln!("[shader-surface] backend = {:?}  adapter = {}",
              adapter.get_info().backend, adapter.get_info().name);

    let (device, queue) = adapter
        .request_device(&wgpu::DeviceDescriptor::default(), None)
        .await
        .unwrap();

    let size = window.inner_size();
    let caps = surface.get_capabilities(&adapter);
    let format = caps.formats.iter().copied()
        .find(|f| f.is_srgb()).unwrap_or(caps.formats[0]);
    let config = wgpu::SurfaceConfiguration {
        usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
        format,
        width: size.width.max(1),
        height: size.height.max(1),
        present_mode: wgpu::PresentMode::AutoVsync,   // proto uses AutoVsync too
        alpha_mode: caps.alpha_modes[0],
        view_formats: vec![],
        desired_maximum_frame_latency: 2,
    };
    surface.configure(&device, &config);

    let (pipeline, uniforms_buf, bind_group) = build_shader_pipeline(&device, format);
    Gpu { surface, device, queue, config, pipeline, uniforms_buf, bind_group }
}
```

### 1.2 The fragment-shader pipeline (the part the proto doesn't have)

The trick for "a shader fills the whole window" is a **vertexless fullscreen triangle**: the vertex shader emits 3 clip-space verts from `@builtin(vertex_index)`, no vertex buffer bound. This is the standard modern idiom (and what Learn Wgpu teaches — see Sources).

```rust
fn build_shader_pipeline(
    device: &wgpu::Device,
    format: wgpu::TextureFormat,
) -> (wgpu::RenderPipeline, wgpu::Buffer, wgpu::BindGroup) {
    let shader = device.create_shader_module(wgpu::include_wgsl!("surface.wgsl"));

    // Uniform buffer: time, resolution, mouse, theme color (see §5 for the struct).
    let uniforms_buf = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("surface-uniforms"),
        contents: bytemuck::bytes_of(&Uniforms::default()),
        usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
    });

    let bgl = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("surface-bgl"),
        entries: &[wgpu::BindGroupLayoutEntry {
            binding: 0,
            visibility: wgpu::ShaderStages::FRAGMENT,
            ty: wgpu::BindingType::Buffer {
                ty: wgpu::BufferBindingType::Uniform,
                has_dynamic_offset: false,
                min_binding_size: None,
            },
            count: None,
        }],
    });
    let bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
        label: Some("surface-bg"),
        layout: &bgl,
        entries: &[wgpu::BindGroupEntry {
            binding: 0,
            resource: uniforms_buf.as_entire_binding(),
        }],
    });

    let layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
        label: Some("surface-pl"),
        bind_group_layouts: &[&bgl],
        push_constant_ranges: &[],
    });

    let pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
        label: Some("surface-pipeline"),
        layout: Some(&layout),
        vertex: wgpu::VertexState {
            module: &shader,
            entry_point: Some("vs_fullscreen"),
            buffers: &[],                       // NO vertex buffer — procedural triangle
            compilation_options: Default::default(),
        },
        fragment: Some(wgpu::FragmentState {
            module: &shader,
            entry_point: Some("fs_main"),
            targets: &[Some(wgpu::ColorTargetState {
                format,
                blend: Some(wgpu::BlendState::ALPHA_BLENDING), // REPLACE if opaque
                write_mask: wgpu::ColorWrites::ALL,
            })],
            compilation_options: Default::default(),
        }),
        primitive: wgpu::PrimitiveState {
            topology: wgpu::PrimitiveTopology::TriangleList,
            ..Default::default()
        },
        depth_stencil: None,
        multisample: wgpu::MultisampleState::default(),
        multiview: None,
        cache: None,
    });
    (pipeline, uniforms_buf, bind_group)
}
```

### 1.3 The per-frame render (record a pass, draw 3 vertices)

```rust
fn render(gpu: &Gpu, uniforms: &Uniforms) {
    // 1. Push fresh uniforms (time/mouse/theme) — see §5.
    gpu.queue.write_buffer(&gpu.uniforms_buf, 0, bytemuck::bytes_of(uniforms));

    let frame = gpu.surface.get_current_texture().unwrap();
    let view = frame.texture.create_view(&Default::default());
    let mut enc = gpu.device.create_command_encoder(&Default::default());
    {
        let mut pass = enc.begin_render_pass(&wgpu::RenderPassDescriptor {
            label: Some("surface-pass"),
            color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                view: &view,
                resolve_target: None,
                ops: wgpu::Operations {
                    load: wgpu::LoadOp::Clear(wgpu::Color::BLACK),
                    store: wgpu::StoreOp::Store,
                },
                depth_slice: None,
            })],
            depth_stencil_attachment: None,
            timestamp_writes: None,
            occlusion_query_set: None,
        });
        pass.set_pipeline(&gpu.pipeline);
        pass.set_bind_group(0, &gpu.bind_group, &[]);
        pass.draw(0..3, 0..1);            // the fullscreen triangle — no vertices bound
    }
    gpu.queue.submit([enc.finish()]);
    frame.present();
}
```

The `winit` `ApplicationHandler` wiring (resumed/window_event/RedrawRequested, resize → `surface.configure`, a clock advancing `uniforms.time`, `window.request_redraw()` to keep animating) is **identical to `pd-timeline-proto/src/main.rs:113-321`** — clone that file and replace the `build_scene` + `render_to_surface` block with §1.3. That is the whole companion-window shader surface.

**Anti-Pattern — Spinning a companion window inside the core/ workspace.**
- **Symptom:** wgpu/winit deps creep into `core/Cargo.toml`; Linux `rust-console` CI suddenly compiles a Metal GPU stack.
- **Detection:** `cargo tree -p pd-console | grep -E 'wgpu|winit'` returns hits.
- **Fix:** Keep the shader window in its **own crate, excluded from the workspace**, exactly like `pd-timeline-proto`. The gpui console `exec`s the installed binary (ADR-0086 path 3). Heavy GPU deps never gate the cross-platform build.

---

## 2. The fullscreen-triangle WGSL skeleton

This is the boilerplate every shader surface starts from. The vertex stage is fixed; you only ever edit `fs_main`.

```wgsl
// surface.wgsl
struct Uniforms {
    resolution : vec2<f32>,   // pixels (physical)
    time       : f32,         // seconds since surface start  (== Shadertoy iTime)
    _pad0      : f32,
    mouse      : vec4<f32>,   // xy = cursor px, zw = last click px (== iMouse)
    accent     : vec4<f32>,   // theme accent, linear-RGBA, pushed from gpui palette
    bg         : vec4<f32>,   // theme background, linear-RGBA
};
@group(0) @binding(0) var<uniform> U : Uniforms;

struct VsOut {
    @builtin(position) pos : vec4<f32>,
    @location(0)       uv  : vec2<f32>,   // 0..1, origin top-left
};

// Vertexless fullscreen triangle: 3 verts cover the screen, no buffer bound.
@vertex
fn vs_fullscreen(@builtin(vertex_index) vi : u32) -> VsOut {
    // (0,0) (2,0) (0,2) in UV → clip space covers [-1,1]^2 with one tri.
    let uv = vec2<f32>(f32((vi << 1u) & 2u), f32(vi & 2u));
    var out : VsOut;
    out.pos = vec4<f32>(uv * 2.0 - 1.0, 0.0, 1.0);
    out.uv  = vec2<f32>(uv.x, 1.0 - uv.y);   // flip so uv.y=0 is top
    return out;
}

@fragment
fn fs_main(in : VsOut) -> @location(0) vec4<f32> {
    // Shadertoy's fragCoord/iResolution → in.uv; iTime → U.time.
    let p = (in.uv * U.resolution * 2.0 - U.resolution) / U.resolution.y; // aspect-correct, centered
    // ... your effect ...
    return vec4<f32>(U.bg.rgb, 1.0);
}
```

**WGSL-vs-GLSL gotchas when porting Shadertoy** (these bite every port):
- `vec3(0.0)` → `vec3<f32>(0.0)`; `mat2(...)` → `mat2x2<f32>(...)`. WGSL has no implicit scalar→vector splat in constructors beyond the single-arg form.
- `fract` not `fract`? — it's `fract` in both. But `mix`/`clamp`/`smoothstep`/`fwidth` all exist in WGSL with the same names.
- `mod(x,y)` in GLSL → `x - y*floor(x/y)` in WGSL (WGSL's `%` is a *remainder*, sign-of-dividend, not GLSL `mod`). This silently breaks tiling/repeat patterns.
- No `texture2D`; sampling is `textureSample(tex, samp, uv)` with explicit `@group/@binding` for the texture + sampler.
- Integer ops need explicit `u32`/`i32` types; `1u`, `2u` suffixes. `&`, `<<` work on `u32`.
- Arrays for things like a Bayer matrix: `const BAYER = array<f32,16>(...)`; index with a `u32`.

---

## 3. Shader cookbook — the techniques worth stockpiling (WGSL, on-brand)

All of these run in `fs_main`. They're the per-pixel effects that justify a raw shader over T2 quads or a Vello vector pass.

### 3.1 Ordered (Bayer) dithering — free per-pixel, full res

The T2 version (`05-…md` §3) paints one quad per dither cell — capped at ~4px cells for budget. In a shader it's ~6 lines and **free at screen resolution**, which is the whole reason ADR-0086 lets dither climb to T3 when the quad count loses.

```wgsl
const BAYER : array<f32,16> = array<f32,16>(
     0.0, 8.0, 2.0,10.0,  12.0, 4.0,14.0, 6.0,
     3.0,11.0, 1.0, 9.0,  15.0, 7.0,13.0, 5.0,
);
fn bayer(coord : vec2<f32>) -> f32 {
    let x = u32(coord.x) & 3u;
    let y = u32(coord.y) & 3u;
    return BAYER[y * 4u + x] / 16.0;
}
// In fs_main: quantize a 0..1 field between two PALETTE roles.
let v = /* your value field, 0..1 */;
let px = in.uv * U.resolution;
let col = select(U.bg.rgb, U.accent.rgb, v > bayer(px / 2.0)); // /2.0 = chunky 2px cells
return vec4<f32>(col, 1.0);
```

### 3.2 Value/gradient noise (the Shadertoy workhorse)

Hash-based value noise, no texture lookup. Use it for the water height field, grain, nebula, anything organic.

```wgsl
fn hash2(p : vec2<f32>) -> f32 {
    // Cheap, deterministic. Good enough for visuals, not for crypto.
    let h = dot(p, vec2<f32>(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
}
fn vnoise(p : vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);            // smoothstep fade
    return mix(mix(hash2(i + vec2(0.0,0.0)), hash2(i + vec2(1.0,0.0)), u.x),
               mix(hash2(i + vec2(0.0,1.0)), hash2(i + vec2(1.0,1.0)), u.x), u.y);
}
fn fbm(p : vec2<f32>) -> f32 {       // fractal brownian motion: 4 octaves
    var v = 0.0; var a = 0.5; var q = p;
    for (var i = 0; i < 4; i = i + 1) { v = v + a * vnoise(q); q = q * 2.02; a = a * 0.5; }
    return v;
}
```

### 3.3 2D SDFs + crisp antialiasing (`fwidth` + `smoothstep`)

Ported from Inigo Quilez's canonical 2D distance functions (Sources). The antialiasing idiom — `smoothstep` across one pixel of `fwidth` — is what makes SDF edges razor-clean at any zoom, the thing T2 quads can't do.

```wgsl
fn sd_circle(p : vec2<f32>, r : f32) -> f32 { return length(p) - r; }
fn sd_box(p : vec2<f32>, b : vec2<f32>) -> f32 {
    let d = abs(p) - b;
    return length(max(d, vec2<f32>(0.0))) + min(max(d.x, d.y), 0.0);
}
fn sd_segment(p : vec2<f32>, a : vec2<f32>, b : vec2<f32>) -> f32 {
    let pa = p - a; let ba = b - a;
    let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}
// Fill an SDF shape with one-pixel antialiasing (resolution-independent):
fn fill(d : f32, color : vec3<f32>, bg : vec3<f32>) -> vec3<f32> {
    let aa = fwidth(d);                       // pixel footprint of the field
    return mix(color, bg, smoothstep(-aa, aa, d));
}
```

`smin` (smooth-union of two SDFs, the "blobby merge"): `fn smin(a:f32,b:f32,k:f32)->f32 { let h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0); return mix(b,a,h) - k*h*(1.0-h); }`.

### 3.4 Pixelation / chunky retro quantization

Cassette-futurism wants *chunky*. Snap UVs to a coarse grid **before** sampling the field — every effect above instantly becomes "lo-fi" with no other change.

```wgsl
let cells = 160.0;                                  // horizontal "resolution"
let aspect = U.resolution.x / U.resolution.y;
let grid = vec2<f32>(cells, cells / aspect);
let p_px = (floor(in.uv * grid) + 0.5) / grid;      // pixelated uv
// feed p_px (not in.uv) into noise/SDF/water below
```

### 3.5 Pixelated ocean / water (the "harbor" surface)

A stacked-sine + fbm height field, banded into chunky pixels and dithered between two palette roles — a deliberate cassette-futurism sea, not a photoreal one. This is the kind of surface ADR-0086's "living harbor" wants behind the fleet.

```wgsl
fn water(uv : vec2<f32>, t : f32) -> f32 {
    // Layered traveling waves → a 0..1 height field.
    var h = 0.0;
    h = h + sin(uv.x * 6.0  + t * 1.3) * 0.30;
    h = h + sin(uv.x * 11.0 - t * 0.8 + uv.y * 3.0) * 0.18;
    h = h + fbm(uv * 4.0 + vec2<f32>(t * 0.15, 0.0)) * 0.5;     // choppy detail
    return h * 0.5 + 0.5;                                       // → 0..1
}
@fragment
fn fs_main(in : VsOut) -> @location(0) vec4<f32> {
    // 1. pixelate (3.4)
    let cells = 200.0; let aspect = U.resolution.x / U.resolution.y;
    let grid  = vec2<f32>(cells, cells / aspect);
    let uv    = (floor(in.uv * grid) + 0.5) / grid;
    // 2. height field + a horizon waterline
    let surface_y = 0.55 + water(uv, U.time) * 0.08;
    let below = step(surface_y, uv.y);                          // 1 below waterline
    // 3. depth shade, then Bayer-dither between bg and accent (3.1)
    let depth = clamp((uv.y - surface_y) * 3.0, 0.0, 1.0);
    let lit   = mix(U.accent.rgb, U.bg.rgb, depth);
    let px    = in.uv * U.resolution;
    let sea   = select(U.bg.rgb, lit, depth > bayer(px / 2.0));
    let sky   = U.bg.rgb;
    return vec4<f32>(mix(sky, sea, below), 1.0);
}
```

Want a boat? Stamp an `sd_box` hull bobbing on the height field: sample `water(boat_x, t)` for its `y`, draw the hull SDF with `fill()` (3.3), pixelated by the same grid. A *fleet* of boats = a small `array<vec2<f32>,N>` of positions pushed as a uniform/storage buffer, one `sd_box` per boat min-unioned with `smin`.

**Anti-Pattern — porting a 60-tap Shadertoy ocean wholesale.**
- **Symptom:** A famous raymarched-ocean shader pasted in; the companion window runs at 12fps, fans roar.
- **Detection:** loop counts > ~8 octaves, nested raymarch loops, `for (i<99)`, per-pixel reflection raymarching.
- **Fix:** This is a *cassette* sea, not Tahiti. Cap fbm at 4 octaves, pixelate hard (3.4) so you're shading ~200×120 logical cells not 2M pixels, and dither for texture instead of computing real lighting. The retro look is *cheaper*, not just stylistically truer.

---

## 4. The in-window embed — render-to-texture, sample back as a gpui image

When the effect must live **inside the gpui pane tree** (ADR-0086 path 2), you can't hand gpui a shader. The portable, public-API approach is: render your shader pass to an **offscreen texture you own**, copy it to CPU, and feed those bytes to gpui as an **image** that you paint into a pane each frame.

### 4.1 Offscreen target instead of a surface

Everything in §1 is identical except the color attachment is a texture **you** allocate (`RENDER_ATTACHMENT | COPY_SRC`) instead of the swapchain frame:

```rust
let tex = device.create_texture(&wgpu::TextureDescriptor {
    label: Some("offscreen"),
    size: wgpu::Extent3d { width: w, height: h, depth_or_array_layers: 1 },
    mip_level_count: 1, sample_count: 1,
    dimension: wgpu::TextureDimension::D2,
    format: wgpu::TextureFormat::Rgba8UnormSrgb,
    usage: wgpu::TextureUsages::RENDER_ATTACHMENT | wgpu::TextureUsages::COPY_SRC,
    view_formats: &[],
});
// ... render pass exactly as §1.3 but color_attachments view = tex.create_view(..) ...
```

### 4.2 Read the texture back to CPU bytes

```rust
// bytes_per_row MUST be aligned to 256 (wgpu::COPY_BYTES_PER_ROW_ALIGNMENT).
let bpr = (4 * w + 255) / 256 * 256;
let readback = device.create_buffer(&wgpu::BufferDescriptor {
    label: Some("readback"), size: (bpr * h) as u64,
    usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
    mapped_at_creation: false,
});
let mut enc = device.create_command_encoder(&Default::default());
// (record the render pass into `enc` first), then:
enc.copy_texture_to_buffer(
    tex.as_image_copy(),
    wgpu::TexelCopyBufferInfo {
        buffer: &readback,
        layout: wgpu::TexelCopyBufferLayout { offset: 0, bytes_per_row: Some(bpr), rows_per_image: Some(h) },
    },
    wgpu::Extent3d { width: w, height: h, depth_or_array_layers: 1 },
);
queue.submit([enc.finish()]);
// map + poll, then strip the row-padding into a tight RGBA8 Vec<u8>.
```

### 4.3 Hand the bytes to gpui as an image, paint into a pane

gpui can paint an in-memory image: build a `gpui::RenderImage` from the RGBA bytes and paint it inside a `canvas` paint closure (or via an `img()` element fed from a cached source). Each frame: render → readback → update the image → `cx.notify()`.

```rust
// Inside the gpui view's canvas paint closure (T2 host, T3 content):
// `frame_rgba` is the tight Vec<u8> from 4.2 for this frame.
let image = gpui::RenderImage::new(/* frames from frame_rgba, size (w,h) */);
window.paint_image(bounds, gpui::Corners::default(), image, 0, false);
```

**Decision Point — is the round-trip acceptable?** GPU→CPU→GPU each frame is the cost. It's fine for a **small, slow** ambient surface (a 256×160 shimmer behind one pane at 30fps). It is **not** fine for a full-pane 60fps ocean — that wants the companion window (§1) or true device-sharing (forward work). Measure: if readback + upload pushes frame time over budget, you picked the wrong path; demote to companion.

**Anti-Pattern — embedding a 60fps full-window shader via readback.**
- **Symptom:** Frame time dominated by `map_async`/`device.poll(Wait)` stalls; the whole gpui window janks because you're blocking on GPU readback on the UI thread.
- **Detection:** `device.poll(Maintain::Wait)` on the render path of a gpui view; frame time scales with offscreen texture area.
- **Fix:** Either (a) make the surface small + slow (it's *ambient*, not the focus), (b) move to a companion window, or (c) do the readback async/double-buffered so a stale frame paints while the next renders. Never `Wait`-poll on gpui's thread.

---

## 5. Uniform plumbing — getting gpui state into the shader

The shader is a pure function of its uniforms. The whole "make it feel alive and reactive" job is **pushing the right uniforms each frame** from gpui view state. This is where Shadertoy's `iTime`/`iResolution`/`iMouse` get their real-world wiring.

```rust
#[repr(C)]
#[derive(Copy, Clone, bytemuck::Pod, bytemuck::Zeroable, Default)]
struct Uniforms {
    resolution: [f32; 2],   // physical px of the surface/texture
    time: f32,              // seconds since start
    _pad0: f32,
    mouse: [f32; 4],        // [cursor_x, cursor_y, click_x, click_y]
    accent: [f32; 4],       // theme accent, LINEAR rgba
    bg: [f32; 4],           // theme background, LINEAR rgba
}
```

**std140/WGSL alignment is the #1 footgun.** A `vec2` is 8-byte aligned but a following scalar can't straddle a 16-byte boundary — hence `_pad0` after `time`, and `vec4`s (not `vec3`) for colors. Rule of thumb: **pad every group to 16 bytes; never put a bare `vec3` in a uniform.** If colors render garbled or shift when you add a field, it's alignment, not your shader.

| Uniform | Source in gpui | How to push |
|---|---|---|
| `time` | An `Instant` on the view (or the companion's `last_frame` clock, proto `main.rs:87`) | `start.elapsed().as_secs_f32()` each redraw |
| `resolution` | Surface config (companion) or the pane `bounds` × HiDPI scale (embed) | physical px; multiply logical bounds by `window.scale_factor()` |
| `mouse` | gpui `MouseMoveEvent`/`MouseDownEvent` on the hosting element, or winit `CursorMoved` (proto `main.rs:228`) | store last cursor + last click in view state; map into surface-local px |
| `accent` / `bg` | `palette.rs` roles (`accent: 0xffdb33`, `bg: 0xf5f5f0`) | convert `Hsla`/`rgb` → **linear** `[f32;4]`; re-push on theme flip (`Ctrl-A g`) |

**Theme color conversion — don't ship sRGB into a linear shader.** gpui palette roles are sRGB hex. If you push the raw `[r/255, g/255, b/255, a]`, the shader (sampling/mixing in linear space, writing to an sRGB target) will look washed out. Convert: `c_lin = ((c_srgb + 0.055)/1.055)^2.4` for `c > 0.04045`, else `c_srgb/12.92`. Do it once per palette change, not per pixel.

**Anti-Pattern — hardcoded colors in the WGSL.**
- **Symptom:** A gorgeous shader with `vec3(1.0, 0.86, 0.2)` (mustard) baked in; theme flip does nothing to it; `check-brand-colors.mjs` can't even see it.
- **Detection:** literal `vec3<f32>(...)` color constants in the shader instead of `U.accent`/`U.bg`.
- **Fix:** Every color a uniform from `palette.rs`. The shader is a renderer, not a palette. Theme flip re-pushes uniforms and the surface re-skins on the next frame — same contract as every T2 effect.

**Anti-Pattern — driving `time` from frame count.**
- **Symptom:** Animation speed changes with framerate; the ocean churns faster on an idle machine, crawls under load.
- **Detection:** `uniforms.time += 1.0` per frame instead of wall-clock seconds.
- **Fix:** `time = start.elapsed().as_secs_f32()` (or accumulate real `dt`, like the proto's `playhead += dt * 0.15`, `main.rs:243`). Wall-clock, always — Shadertoy's `iTime` is seconds, and so is yours.

---

## 6. The off-switch — reduced-motion, snapshots, CI

Carry the `DitherPipeline enabled=false` contract (the web sibling's "legal no-op") into every shader surface, exactly as `05-…md` §5 requires:

- **Companion window:** honor a `PD_CONSOLE_FX=off` env flag — render **one** frame at `time=0` and stop calling `request_redraw()`. The surface looks "lit" but frozen.
- **Embed:** when FX off, do **one** readback at `time=0` and cache that image; stop the per-frame round-trip entirely.
- **CI gate:** the shader crate stays **out of `core/`** and behind the macOS-only path (mirror `pd-timeline-proto`'s workspace exclusion). The Linux `rust-console` job must never compile wgpu/winit. This is an ADR-0086 §Consequences hard requirement, not a nicety.
- **Static fallback exists, always:** a shader surface with no `time=0` still-frame is a defect. Reduced-motion users get a frozen sea, not a blank pane.

---

## 7. Quality Gates

- [ ] **Right path declared.** Surface states **companion (path 3)** or **embed (path 2)**; embed owns the readback round-trip cost honestly — no "just drops into gpui."
- [ ] **Shader stack is isolated.** wgpu/winit/WGSL deps live in a crate **excluded from `core/`**; `cargo tree -p pd-console` shows no wgpu; Linux `rust-console` never compiles it.
- [ ] **Backend proven.** Companion logs `backend = Metal` at startup (like `pd-timeline-proto/src/main.rs:148`); embed verifies the offscreen format is sRGB-correct.
- [ ] **Justified tier.** The effect needs *true per-pixel work* (noise / SDF / water / full-res dither / raymarch) — not something T2 `canvas` quads or a Vello vector pass already does (`05-…md` §6 anti-pattern).
- [ ] **Colors are uniforms from `palette.rs`.** Zero literal color constants in WGSL; `accent`/`bg` pushed as **linear** RGBA; theme flip (`Ctrl-A g`) re-pushes and re-skins next frame. (`check-brand-colors.mjs` green.)
- [ ] **`time` is wall-clock seconds.** Not frame count; animation speed is framerate-independent.
- [ ] **Uniform struct is 16-byte aligned.** Explicit pad fields; no bare `vec3` in a uniform; colors are `vec4`. Verified by no color-shift when fields are added.
- [ ] **Off-switch exists.** `PD_CONSOLE_FX=off` renders one `time=0` frame and stops redrawing; embed caches one still. Reduced-motion gets a frozen surface, never a blank one.
- [ ] **Embed never `Wait`-polls on the UI thread.** Readback is small/slow, async, or double-buffered; gpui frame time does not scale with full-window shader area.
- [ ] **Built and run, not read.** Companion window opened; embed image actually painted into a pane and visually audited (Read the captured frame), not assumed to render.

---

## Sources

- [Learn Wgpu — The Pipeline](https://sotrh.github.io/learn-wgpu/beginner/tutorial3-pipeline/) — `create_shader_module`, `RenderPipelineDescriptor`, `VertexState`/`FragmentState`, vertexless fullscreen draw.
- [wgpu docs.rs](https://docs.rs/wgpu/latest/wgpu/) — current API surface (`SurfaceConfiguration`, `RenderPassColorAttachment`, `copy_texture_to_buffer`, alignment constants).
- [Inigo Quilez — 2D distance functions](https://iquilezles.org/articles/distfunctions2d/) — canonical `sd_circle`/`sd_box`/`sd_segment`, rounding/annular ops.
- [Inigo Quilez — Raymarching distance fields](https://iquilezles.org/articles/raymarchingdf/) — SDF/raymarch fundamentals when an effect goes 3D.
- [GM Shaders (Xor) — Signed Distance Fields](https://mini.gmshaders.com/p/sdf) — compact SDF + AA idioms (`fwidth`/`smoothstep`) that port cleanly to WGSL.
- **Repo grounding:** `core/pd-timeline-proto/src/main.rs` (winit+wgpu Metal loop, scrub/redraw timing), `core/pd-timeline-proto/src/scene.rs` (the Vello vector route this doc's shader route parallels), `docs/adr/0086-operator-console-rendering-stack.md` (companion vs embed paths), `core/pd-console/src/palette.rs` (theme roles for the uniforms), and the sibling `references/05-bespoke-graphics-vello-wgpu.md` (T1/T2/T3 tiering this extends).
```

That is the complete doc, ready to save verbatim as `references/01-shader-surfaces-in-gpui.md`. It is grounded in: the sibling Vello/wgpu reference and SKILL.md (T1/T2/T3 tiering, the off-switch contract, palette discipline), the live `pd-timeline-proto` source (the exact winit+wgpu Metal loop and scrub/redraw timing I lifted the companion-window skeleton from), ADR-0086 (companion vs embed paths, the CI-isolation requirement), and current wgpu/WGSL/SDF practice from the web sources. House style is honored throughout: Decision Points, Anti-Patterns as Symptom/Detection/Fix, and a Quality Gates checklist.
