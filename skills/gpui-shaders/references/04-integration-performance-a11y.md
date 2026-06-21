# Integration, Performance & Accessibility — Earning a Shader in a gpui App

> **Scope.** A shader is the most expensive pixel in your app. This doc is the discipline around the WGSL/wgpu surfaces that [`05-bespoke-graphics-vello-wgpu.md`](05-bespoke-graphics-vello-wgpu.md) taught you to *build*: when a fragment shader **earns its place** over a `div` or a Vello path; the **frame budget** that keeps it from melting the laptop; **pausing** offscreen/unfocused/idle surfaces; honoring **reduced-motion** by freezing time to a static frame; **packaging + hot-reloading** WGSL so you iterate in seconds not minutes; **sampling theme tokens** so the shader respects light/dark and the brand palette; and the precision/overdraw/iGPU **pitfalls** that look fine on an M4 Max and die on a base M1 Air. Target is a native Rust gpui app on Metal via wgpu (the pd-console / `pd-timeline-proto` stack), **not** the web — there is no CSS `@media`, no compositor thread, no `<canvas>` that auto-throttles offscreen. You wire all of that by hand.
>
> The three-tier model from doc 05 holds throughout: **T1** element tree (`div`+`shadow`+`opacity`), **T2** gpui low-level paint (`canvas`/`paint_quad`/`PathBuilder`), **T3** Vello/wgpu surface with a real WGSL shader. This doc is mostly about T3 — and about the constant temptation to use T3 where T1/T2 already wins.

---

## 0. The one question that gates everything: does this shader EARN its place?

A WGSL fragment shader on a wgpu surface is a **second GPU stack inside your window** (doc 05 §6: *"a second GPU stack in the window is the most expensive dependency in the console"*). It costs you: a `wgpu::RenderPipeline`, a shader-module compile (MSL transpile on Metal), a uniform buffer you update every frame, a redraw loop you must throttle yourself, a reduced-motion off-switch, a theme-token bridge, and a CI gate so the Linux build never compiles it. That is a *lot* of surface area to sweep a translucent band across a panel.

So before any `device.create_shader_module`, walk the ladder:

| If the effect is… | The right tier is… | Because |
|---|---|---|
| A glow, a breathing dot, a hover lift, a fade | **T1** `with_animation` + `BoxShadow`/`opacity` | doc 05 §1; the beacon is opacity, not a shader |
| Chunky ordered dither, scanlines, ≤40 sparkles, a shimmer band, a sparkline | **T2** `canvas` + `paint_quad`/`PathBuilder` | bounded quad count, redrawn at interaction rate |
| Smooth AA bezier fills, a scrubbed playhead, hand-built vector art at 60fps | **T3 Vello** (paths, no custom shader) | `pd-timeline-proto/scene.rs` already proves this |
| **Per-pixel** continuous field: water/ocean, fbm noise clouds, full-res dither, an SDF iris/ripple, a plasma, a CRT warp | **T3 + a WGSL fragment shader** | the math is *per-pixel and continuous*; quads lose |

**The shader tier is justified by exactly one thing: a per-pixel field that changes every frame.** Ocean displacement, fbm fog, a radial SDF ripple expanding from a click, a Bayer dither at native resolution and 60fps — these are O(pixels) of independent math per frame. A CPU/quad implementation is `width×height` quads (doc 05's "Per-pixel dither at screen resolution" anti-pattern). A fragment shader makes it *free per pixel*. That, and only that, is the trade you're buying.

### Decision Point — shader vs. Vello path vs. gpui quad

- **Is the output a handful of shapes/curves?** → Vello path (`scene.fill`/`scene.stroke`, like every marker in `scene.rs`). A shader to draw 5 circles is malpractice.
- **Is it axis-aligned texture redrawn on interaction?** → T2 `canvas`. doc 05 §3–4.
- **Is it a continuous per-pixel field (noise/water/SDF/dither-at-res)?** → WGSL fragment shader. This doc.
- **Could a `BoxShadow` glow read the same to a user 60cm away?** → T1. Ship the glow. The user cannot tell your fbm aurora from a soft radial gradient at a glance, and one costs 200 ALU ops/pixel.

### Anti-Pattern — Shadering a button

- **Symptom:** A hover state, a focus ring, a card surface, or a "pressed" cue implemented as a wgpu surface with a fragment shader.
- **Detection:** A `RenderPipeline` whose fragment output is expressible as `div().bg(role).shadow(glow()).rounded(px(8.))`. Or: the shader samples `u_time` but the visual delta between frames is a slow opacity ramp.
- **Fix:** Return to T1. A button is `div` + hover color + `motion::glow`. Reserve the shader for surfaces where the *texture itself is the content* and it's *per-pixel continuous*. (doc 05 Quality Gate: "Lowest tier that works.")

### Anti-Pattern — A shader where Vello already renders

- **Symptom:** A custom WGSL pipeline to draw the playhead, the causal threads, or the track markers that `pd-timeline-proto/scene.rs` already draws with `scene.stroke`/`scene.fill`.
- **Detection:** Geometry that is paths and fills, not a per-pixel field, routed through a hand-written shader instead of the Vello `Scene`.
- **Fix:** Vello *is* the compute renderer (`main.rs:6` — *"Vello is the hand-written compute vector renderer we'd otherwise have to build from scratch in MSL"*). Add your geometry to the `Scene`. Drop to a raw WGSL pass **only** for a per-pixel field Vello can't express (a noise fog *behind* the scene, a post-process dither *over* it).

---

## 1. Frame budget — 16.67 ms, and you spend it or the fans spin

At 60 Hz you have **16.67 ms per frame** for everything: scene build, uniform upload, GPU submit, present. Web canvas libraries "automatically drop to ~1fps when scrolled out of viewport" ([shaders.com performance guide](https://shaders.com/docs/guide/performance)); **gpui gives you none of that — you own the redraw clock.** The `pd-timeline-proto` loop already measures this honestly (`main.rs:295`): `gpu_build+submit` ms + rolling FPS, logged while interacting. Copy that instrumentation into every shader surface — *a shader you haven't timed is a shader you don't understand.*

### The redraw clock is a state, not a default

The single biggest native-vs-web difference: **a wgpu surface only redraws when you call `window.request_redraw()`** (winit) or `cx.notify()` (gpui). `pd-timeline-proto` is exemplary here — it sets `ControlFlow::Wait` (`main.rs:336`) and only requests a redraw on input or while `self.playing` (`main.rs:314`). When idle and not playing, **it renders zero frames.** That is the target for every shader surface: *idle must be 0 frames, not 60.*

```rust
// The clock has three regimes. Make them explicit on the view.
enum FxClock {
    Frozen,            // reduced-motion OR PD_CONSOLE_FX=off: render ONE frame, then stop
    Idle,              // visible but no animation due: 0 frames/s
    Animating { since: Instant }, // drive u_time; request_redraw each frame
}
```

A continuous shader (ocean, fbm) lives in `Animating` *only while its meaning is live* — a sortie mid-flight, a scrub in progress. The moment the sortie lands or the scrub ends, transition to `Idle`/`Frozen` and **stop requesting redraws**. doc 05 §5 and the `rust-gpui-motion` frame-budget reference (`04-frame-budget-and-reduced-motion.md`) both make this law: *"never leave one running for a surface that's off-screen or idle."*

### Frame-budget tiers for a fragment shader

| ALU ops/pixel (rough) | What fits | M4 Max @ 1440p | Base M1 / iGPU @ 1440p |
|---|---|---|---|
| ~10–30 | gradient, single SDF, Bayer dither | trivial (<0.3 ms) | fine |
| ~50–150 | 1–2 octave noise, simple water normal | easy (~1 ms) | watch it (~4–6 ms) |
| ~200–500 | 4–6 octave fbm, raymarched ripples, multi-tap blur | ~2–4 ms | **danger — can blow budget** |
| 1000+ | full ocean (Gerstner stack + lighting), heavy raymarch | profile it | **do not ship to iGPU at full res** |

**The budget is not "does it hit 60 on my M4 Max."** It's "does it hit 60 on the weakest machine an operator runs pd-console on, at their native resolution, *while the rest of the app is also rendering*." See §7.

### Anti-Pattern — Continuous redraw on an idle surface

- **Symptom:** Fans audibly spin on a static pd-console screen; `powermetrics` shows sustained GPU load with no user input; battery drains sitting at a prompt.
- **Detection:** `request_redraw()`/`cx.notify()` called unconditionally every frame (e.g. at the bottom of `RedrawRequested` with no `if self.playing` guard, unlike `main.rs:314`). Or a `.repeat()` animation feeding a shader uniform that never unmounts.
- **Fix:** Gate the redraw on a live-animation predicate. When nothing is animating, render the last frame once and return to `ControlFlow::Wait`. Resolution: idle GPU at ~0%.

---

## 2. Pausing offscreen, occluded, and unfocused surfaces

A shader you can't see should cost nothing. Three visibility signals, none automatic in gpui:

1. **Window unfocused / occluded.** winit emits `WindowEvent::Focused(false)` and `WindowEvent::Occluded(true)`. On either, drop animating shaders to **frozen** (stop the clock). A "living harbor" background does not need to breathe while the operator is in another app. Resume on `Focused(true)`/`Occluded(false)` with a fresh `since: Instant` (don't replay elapsed wall-clock — that causes a visible jump; re-anchor `u_time` to "now").
2. **Pane scrolled out / collapsed.** In gpui's pane tree, a shader surface inside a collapsed or off-viewport pane should not animate. The pane owns a `visible: bool`; the shader reads it. (T2 `canvas` closures already don't paint when their bounds are empty — but a T3 surface with its own redraw loop must be told.)
3. **Reduced motion / FX off.** §3 — a global freeze that supersedes all of the above.

```rust
fn should_animate(&self) -> bool {
    self.fx_enabled            // PD_CONSOLE_FX != "off"
        && !self.reduced_motion
        && self.window_focused
        && !self.window_occluded
        && self.pane_visible
        && self.has_live_meaning   // sortie mid-flight, scrub in progress, etc.
}
```

`request_redraw` is called **iff `should_animate()`**. When it flips false, render one final frame at the current `u_time` and stop. This is the native re-derivation of the web behavior the search surfaced: *"effects that aren't visible consume almost nothing"* ([shaders.com](https://shaders.com/docs/guide/performance)) — except you wire each clause yourself.

### Decision Point — freeze vs. unmount

- **Freeze** (keep the pipeline + last frame, stop the clock) when the surface will likely re-animate soon (unfocus, brief occlusion, a paused sortie). Cheap to resume; the last frame stays on screen so there's no flash.
- **Unmount** (drop the surface, free GPU resources) when the surface is gone for the session (pane closed, viz dismissed). A held `wgpu::Surface` + pipeline + uniform buffer is real VRAM; don't hoard a dozen frozen ocean surfaces.

### Anti-Pattern — Lockstep wake-up

- **Symptom:** All shader surfaces re-anchor `u_time` to the same `Instant` on focus regain and visibly snap into phase together.
- **Detection:** A shared clock origin across surfaces (one `app.start_time`) rather than per-surface `since`.
- **Fix:** Per-surface `u_time` origin + a per-surface phase seed (mirrors doc 05 §4 "Lockstep twinkle" / `dot-pulse-{id}`). The field should breathe incoherently, not strobe in unison.

---

## 3. Reduced-motion — freeze time, don't delete the surface

There is **no `prefers-reduced-motion` media query in gpui.** You wire it from the OS + a config flag, and the contract (doc 05 §5, ported from the web `DitherPipeline`'s `enabled=false`) is: **reduced motion means a *static frame*, not a *blank surface*.** Reducing motion drops the *journey*, keeps the *destination* (the `rust-gpui-motion` core rule: *"less travel, not deleted feedback"*).

**Resolving the signal (precedence, first wins):**
1. `PD_CONSOLE_FX=off` env (mirrors `init_theme_from_env`/`PD_CONSOLE_THEME`, `app.rs:130`) — hard kill switch for snapshots, tests, CI, low-power.
2. macOS system "Reduce Motion." Read it via `defaults read com.apple.universalaccess reduceMotion` at startup, or the AppKit `NSWorkspace.accessibilityDisplayShouldReduceMotion` notification for live changes. Cache it; re-read on the change notification.
3. Default: motion on.

**What "freeze time" means in WGSL.** Your shader is parameterized by a `u_time` uniform. Reduced motion does not branch inside the shader — it **stops advancing `u_time`** on the CPU and renders one frame at a *chosen representative phase* (not `t=0`, which is often a degenerate/empty state — pick a phase where the field looks "lit and settled," e.g. `t = 7.0` for an ocean so there's visible swell).

```rust
// Per frame, on the CPU:
let u_time = if self.reduced_motion || !self.fx_enabled {
    FX_STATIC_PHASE          // a hand-picked "looks alive, isn't moving" constant
} else {
    self.clock_started.elapsed().as_secs_f32()
};
queue.write_buffer(&self.uniforms, OFFSET_TIME, bytemuck::bytes_of(&u_time));
// And: request_redraw() ONLY in the else branch.
```

The surface still renders — the operator sees the ocean, the dither, the harbor — it just doesn't *move*. A dithered/noise *texture* is static-friendly by nature (doc 05 §5: "Dither: still paints — keep it"). A *sweep/displacement* freezes mid-phase.

### Decision Point — which static phase?

- **Periodic fields (water, plasma, shimmer):** pick a phase that shows the field's character (mid-swell, mid-sweep), not a zero crossing.
- **One-shot reveals (an SDF ripple from a click):** reduced motion → render the *final* state (ripple fully dissipated, i.e. the resting surface), or skip the effect entirely. Never leave a half-expanded ripple frozen on screen — that reads as a bug.
- **Ambient noise (fog/grain):** any phase; it's stationary-looking. Keep it.

### Anti-Pattern — Reduced motion blanks the surface

- **Symptom:** With Reduce Motion on, the ocean/harbor/dither surface disappears entirely, leaving a flat `base_color` rectangle, and the operator loses the visual that told them *which* pane is the active sortie.
- **Detection:** The reduced-motion branch skips `render_to_surface` or sets the surface invisible, rather than rendering one frozen frame.
- **Fix:** Always render. Freeze `u_time`, keep the pixels. Orientation/meaning preserved, motion removed. (`rust-gpui-motion` failure mode: "Reduced-motion deletes orientation.")

---

## 4. Packaging & hot-reloading WGSL

Shader iteration is the inner loop; if a one-character WGSL tweak needs a full `cargo build`, you will not iterate, and the shader will be mediocre. Two concerns: **how the WGSL ships in the binary**, and **how you reload it in seconds during development.**

### Packaging for release: embed, don't read from disk

In a shipped binary, the `.wgsl` must be **compiled into the executable** — never a runtime file read (the file won't exist on the user's machine, and a missing-shader path is a crash). The idiom:

```rust
// Release path: WGSL is baked into the binary at compile time.
const OCEAN_WGSL: &str = include_str!("shaders/ocean.wgsl");

let module = device.create_shader_module(wgpu::ShaderModuleDescriptor {
    label: Some("ocean"),
    source: wgpu::ShaderSource::Wgsl(OCEAN_WGSL.into()),
});
```

`include_str!` makes the shader part of the binary and part of the build's correctness — naga (wgpu's shader compiler) validates the WGSL **at module-create time**, so a syntax error surfaces as a clear runtime panic on first paint, not silent garbage. (For *compile-time* validation, the `naga_oil` crate or a `build.rs` naga pass can fail the build on bad WGSL — worth it for a shader-heavy app.) Keep all of this behind `#[cfg(feature = "gpui")]` so the Linux `rust-console` CI never compiles wgpu deps (doc 05 §5 / ADR-0086).

### Hot-reload for development: watch the file, recompile the module

Gate a dev-only path behind a feature/env flag that **reads the WGSL from disk and watches it** (`notify` crate). On change, rebuild *only* the shader module + pipeline (cheap — milliseconds), keep the surface/device/buffers:

```rust
#[cfg(feature = "shader-hot-reload")]
fn maybe_reload(&mut self, device: &wgpu::Device) {
    if let Some(src) = self.watcher.take_changed() {              // notify event drained
        match naga::front::wgsl::parse_str(&src) {               // validate BEFORE swapping
            Ok(_) => {
                let module = device.create_shader_module(/* src */);
                self.pipeline = build_pipeline(device, &module); // swap, keep buffers
                log::info!("[fx] reloaded ocean.wgsl");
            }
            Err(e) => log::warn!("[fx] ocean.wgsl parse error, keeping old: {e}"), // don't crash dev loop
        }
    }
}
```

**Validate before swapping.** A WGSL parse error during hot-reload must *keep the last good pipeline* and log — never crash the dev session. This is the single thing that makes hot-reload actually usable: you save a broken file mid-edit constantly. naga's `parse_str` gives you the validation without touching the GPU.

### Decision Point — `include_str!` vs `naga_oil` vs raw `wgpu::ShaderSource`

- **`include_str!` + `ShaderSource::Wgsl`** — default. One shader, no composition. What 95% of surfaces need.
- **`naga_oil`** — when you want `#import`/`#define` composition across shaders (shared noise/SDF library, palette injection, conditional features). Worth it once you have ≥3 shaders sharing a `noise.wgsl`. It also lets you do compile-time defines for theme tokens (§5).
- **`build.rs` naga validation pass** — add when a broken shader shipping green-in-CI would be embarrassing; fails the build on invalid WGSL before it's embedded.

### Anti-Pattern — Runtime file read in the shipped binary

- **Symptom:** Release build reads `shaders/ocean.wgsl` from a path relative to cwd; works on the dev machine, crashes/blank-surfaces on every other machine.
- **Detection:** `std::fs::read_to_string` / `File::open` of a `.wgsl` not gated behind a dev `#[cfg(feature = "shader-hot-reload")]`.
- **Fix:** `include_str!` for release; file-watch only behind the dev feature. The release binary must be self-contained.

---

## 5. Sampling theme tokens — shaders must respect light/dark + the brand palette

A hardcoded color in a shader is the same defect as a hardcoded color in a `paint_quad` (doc 05 §3: *"`lo`/`hi` must come from `palette.rs` roles … `scripts/check-brand-colors.mjs` fails CI on cinnabar/brass/patina"*). A shader that ignores the theme will glow cinnabar in a brass-themed dark mode and pass right through the JS brand-color guard because **`check-brand-colors.mjs` greps source files for hex literals — it cannot see a color you computed in WGSL.** So the discipline is: *the shader receives colors as uniforms sourced from `palette.rs`; it never literals a color.*

### The bridge: palette role → uniform → WGSL

```rust
// palette.rs is the single source of truth (doc 05). Convert a role to a
// linear-RGB vec4 for the uniform. sRGB→linear matters: Metal surfaces are
// usually *-srgb formats, so the shader works in LINEAR space and the swapchain
// encodes back to sRGB. Push linear values or your brand colors shift.
#[repr(C)]
#[derive(Copy, Clone, bytemuck::Pod, bytemuck::Zeroable)]
struct FxUniforms {
    u_time: f32,
    _pad0: f32,
    resolution: [f32; 2],
    bg:     [f32; 4],   // palette role: bg
    accent: [f32; 4],   // palette role: accent (mustard 0xffdb33)
    gated:  [f32; 4],   // palette role: gated  (do NOT hardcode cinnabar)
}

fn role_to_linear(rgb: u32) -> [f32; 4] {
    let s = |c: u8| { let x = c as f32 / 255.0;
        if x <= 0.04045 { x / 12.92 } else { ((x + 0.055)/1.055).powf(2.4) } };
    [s((rgb>>16) as u8), s((rgb>>8) as u8), s(rgb as u8), 1.0]
}
```

```wgsl
struct Fx {
  u_time: f32,
  _pad0: f32,
  resolution: vec2<f32>,
  bg: vec4<f32>,
  accent: vec4<f32>,
  gated: vec4<f32>,
};
@group(0) @binding(0) var<uniform> fx: Fx;

@fragment
fn fs_main(@builtin(position) frag: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = frag.xy / fx.resolution;
  let field = fbm(uv * 4.0 + vec2(fx.u_time * 0.05, 0.0)); // 0..1
  // Mix BRAND roles, never literals:
  return mix(fx.bg, fx.accent, field);
}
```

### Theme flip must re-skin the shader

When the operator flips theme (`Ctrl-A g`, `app.rs`), `palette.rs` returns the new roles, you re-write the uniform buffer, and `cx.notify()` re-renders — the shader re-skins on the next frame with zero shader recompile (colors are data, not code). This is *why* colors are uniforms and not WGSL constants: theme is a buffer write, not a pipeline rebuild.

### Decision Point — uniform vs. `naga_oil` define for colors

- **Uniform (default).** Colors change at runtime (theme flip, hover-driven tint). Always use a uniform. A buffer write is ~free; a pipeline rebuild is not.
- **`naga_oil` compile-time `#define`** only for colors that are *truly static* for the build (a fixed grid line that never themes) — rare, and usually still better as a uniform for consistency.

### Anti-Pattern — Hardcoded color in WGSL

- **Symptom:** `return vec4(0.8, 0.24, 0.18, 1.0);` (cinnabar) in a shader; it survives `check-brand-colors.mjs` because the guard greps for `#hex`/`rgb()` in CSS/TS, not float literals in `.wgsl`.
- **Detection:** Any `vec3`/`vec4` color literal in WGSL that isn't `0.0`/`1.0`/a uniform. Add a `.wgsl`-aware grep to the brand check (the guard's blind spot, exactly the `rgba(204,61,46)` class of miss the operator caught in PR #291).
- **Fix:** Every shader color arrives as a `palette.rs`-sourced uniform in **linear** space. The shader mixes roles; it never names a color.

### Anti-Pattern — sRGB/linear color-space mismatch

- **Symptom:** Brand mustard looks washed-out / too bright; light and dark themes don't match their `div` counterparts; the shader's bg doesn't match the surrounding gpui pane's bg.
- **Detection:** Raw `u8/255.0` color pushed to the uniform while the surface format is `Bgra8UnormSrgb`. The shader operates in sRGB but the swapchain also encodes sRGB → double-encoded.
- **Fix:** Convert roles to **linear** before uploading (the `role_to_linear` above); let the sRGB swapchain format do the final encode. Or pick a non-srgb format and encode yourself — but match the surrounding gpui pane, which is sRGB. Verify by eyedropping the shader bg vs. an adjacent `div().bg(bg_role)` — they must match.

---

## 6. WGSL technique stockpile (ported from shadertoy practice)

Per-pixel fields, GLSL→WGSL. The shadertoy idioms ([iquilezles 2D SDF](https://iquilezles.org/articles/distfunctions2d/), [demofox](https://blog.demofox.org/category/shadertoy/)) port cleanly; the gotchas are WGSL-specific (`fract` not `frac`, `mix` not `lerp`, explicit `f32`, `let`/`var`).

**Hash + value noise + fbm** (the backbone of water/fog/clouds):
```wgsl
fn hash2(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
fn vnoise(p: vec2<f32>) -> f32 {
  let i = floor(p); let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);              // smoothstep weights
  return mix(mix(hash2(i + vec2(0.,0.)), hash2(i + vec2(1.,0.)), u.x),
             mix(hash2(i + vec2(0.,1.)), hash2(i + vec2(1.,1.)), u.x), u.y);
}
fn fbm(p0: vec2<f32>) -> f32 {            // 4 octaves; each octave DOUBLES cost
  var p = p0; var a = 0.5; var sum = 0.0;
  for (var o = 0; o < 4; o = o + 1) { sum = sum + a * vnoise(p); p = p * 2.0; a = a * 0.5; }
  return sum;                              // ~0..1
}
```

**SDF + the antialiasing idiom** (crisp shapes, resolution-independent — the `fwidth`/`smoothstep` edge from iquilezles):
```wgsl
fn sd_circle(p: vec2<f32>, r: f32) -> f32 { return length(p) - r; }
fn sd_box(p: vec2<f32>, b: vec2<f32>) -> f32 {
  let d = abs(p) - b; return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}
// AA edge: cover ~1px in screen space. fwidth needs derivatives → fragment stage only.
fn aa_fill(d: f32) -> f32 { let w = fwidth(d); return 1.0 - smoothstep(-w, w, d); }
```

**Ordered (Bayer) dither at native res** — the T3 version of doc 05 §3, "~6 lines, free per-pixel":
```wgsl
fn bayer4(c: vec2<u32>) -> f32 {
  let m = array<f32,16>(0.,8.,2.,10., 12.,4.,14.,6., 3.,11.,1.,9., 15.,7.,13.,5.);
  return m[(c.x & 3u) + (c.y & 3u) * 4u] / 16.0;
}
// value 0..1 → two brand roles, dithered:
fn dither(value: f32, frag: vec2<f32>, lo: vec4<f32>, hi: vec4<f32>) -> vec4<f32> {
  return select(lo, hi, value > bayer4(vec2<u32>(frag)));
}
```

**Pixelation / chunky retro** (cassette-futurism, quantize UV to a virtual grid):
```wgsl
fn pixelate(uv: vec2<f32>, cells: f32) -> vec2<f32> { return floor(uv * cells) / cells; }
```

**Water/ocean — the budget warning.** A convincing ocean = a stack of Gerstner waves *or* domain-warped fbm + a cheap normal + a Fresnel-ish rim. **Build the cheap version first** (2-octave fbm displacement of a horizon gradient + a single specular band) and only add octaves/waves until it reads as water. Every Gerstner wave and every fbm octave is linear cost per pixel; a 6-wave + 5-octave ocean is a 1000+-ALU shader that dies on an iGPU (§7). The shadertoy "Seascape"-class shaders are gorgeous and **not shippable at full res on a base M1** without resolution scaling.

### Decision Point — octave/wave count = your iGPU budget knob

Like doc 05's "cell size = your budget knob," here **octave count is the knob.** Start at 2, add until it looks right, then *stop* — and test the final count on the weakest target at native res. Each octave roughly doubles the noise cost.

---

## 7. Pitfalls — overdraw, precision, iGPU/mobile

### Overdraw

- **Symptom:** Frame time scales with how many shader surfaces *overlap*, not with their content.
- **Detection:** Stacked transparent shader panes (an ocean *under* a dither *under* a shimmer), each a full-screen fragment pass; total pixels shaded ≫ screen pixels.
- **Fix:** Composite into **one** fragment shader where possible (do the dither/shimmer *inside* the ocean shader, not as separate passes). If they must be separate, scissor each surface to its actual bounds so off-pane pixels aren't shaded. The cheapest shaded pixel is the one you don't shade.

### Precision — `f32` everywhere, but watch large `u_time`

- **Symptom:** After the app runs a while, a noise/water field develops visible "stepping" or banding, or the animation gets visibly chunky.
- **Detection:** `u_time` fed raw into `sin(u_time * bigConstant)` — after minutes, `u_time` is large and `f32` precision in the fractional part degrades; `hash(sin(...))` amplifies it into banding.
- **Fix:** Wrap `u_time` into a period on the CPU before upload (`u_time % 1000.0`, or modulo the actual loop period), so the shader never sees huge magnitudes. For phase, prefer `fract`-based cycling over unbounded accumulation. Metal's `half` (16-bit) is *faster* on iGPUs but has far less range — use `f32` for positions/time, reserve `half`/`f16` for bounded 0..1 color/weight math only, and only after profiling shows you need it. (WWDC25 reiterates 16-bit half for iGPU perf — [Apple WWDC25 WebGPU](https://developer.apple.com/videos/play/wwdc2025/236/) — but it's a sharp tool.)

### iGPU / low-power Macs (and the "M4 Max lies to you" trap)

- **Symptom:** Buttery on the dev M4 Max (`pd-timeline-proto` logs `Metal, Apple M4 Max`), unusable (15 fps, hot, loud) on a base M1/M2 Air or an Intel-iGPU Mac.
- **Detection:** Never profiled on anything but the top-end dev machine. The proto even *prints* its adapter (`main.rs:156`) — read it, and don't trust an M4 Max number as representative.
- **Fix:** (a) Render the shader to an **offscreen texture at reduced resolution** (½ or ⅓ res) and upsample — noise/water/fog tolerate this beautifully and it's a 4–9× shading win. (b) Adapt octave/wave count by `adapter.device_type`/known name (fewer octaves on `IntegratedGpu`). (c) Cap the FX surface's effective FPS to 30 on battery/iGPU — the search note holds: *"GPU utilization doesn't scale linearly with FPS below 30,"* but 30 vs 60 still halves the shading work and is invisible for an ambient background. (d) Always have the `PD_CONSOLE_FX=off` path (§3) so a struggling machine has an escape.

### Anti-Pattern — derivatives outside the fragment stage

- **Symptom:** `fwidth`/`dpdx`/`dpdy` used in a compute or vertex context; shader fails to compile or returns garbage.
- **Detection:** `fwidth(` anywhere but a `@fragment` entry point's call graph.
- **Fix:** Derivatives are fragment-stage only (they're computed across a 2×2 quad of fragments). Keep `aa_fill`/edge AA in the fragment shader. For SDF AA without derivatives (compute), pass a screen-space pixel size as a uniform instead.

---

## 8. Quality Gates

- [ ] **Shader earns its tier.** The surface is a *continuous per-pixel field* (water/noise/SDF/full-res dither), not shapes (→ Vello) or texture-at-interaction-rate (→ T2 `canvas`) or a glow (→ T1). doc 05's "lowest tier that works."
- [ ] **Idle is 0 frames.** `request_redraw`/`cx.notify` is gated on `should_animate()`; unfocused/occluded/off-pane/idle surfaces render one frame then stop (`ControlFlow::Wait` like `main.rs:336`). Verified with `powermetrics`: GPU ~0% at a static prompt.
- [ ] **Frame budget measured, not assumed.** `gpu_build+submit` ms + FPS logged (copy `main.rs:295`); the surface holds 60 fps **on the weakest target machine at native res while the rest of the app renders**, not just on the M4 Max.
- [ ] **Reduced-motion freezes time, keeps pixels.** `PD_CONSOLE_FX=off` + macOS Reduce Motion both resolve to a *static representative frame* (hand-picked phase), never a blank surface. Orientation preserved.
- [ ] **Colors are palette-role uniforms, in linear space.** Zero color literals in WGSL; theme flip (`Ctrl-A g`) re-skins via a buffer write + `cx.notify()` with no recompile; shader bg eyedrop-matches an adjacent `div().bg(role)`. The `.wgsl` is covered by an extended brand-color grep (closes `check-brand-colors.mjs`'s float-literal blind spot).
- [ ] **Release embeds WGSL (`include_str!`); hot-reload is dev-only and validates-before-swap.** No runtime `.wgsl` file read in the shipped binary; hot-reload keeps the last good pipeline on a parse error and logs.
- [ ] **Overdraw bounded.** Effects composited into one fragment pass where possible; separate surfaces scissored to bounds; no stack of full-screen transparent shader passes.
- [ ] **Precision safe.** `u_time` wrapped to a period before upload; `f32` for time/position, `half`/`f16` only for bounded color/weight math after profiling; no banding after a long run.
- [ ] **iGPU path exists.** Offscreen reduced-res + upsample and/or octave reduction by `device_type`; effective FPS capped on battery/iGPU; `PD_CONSOLE_FX=off` escape verified.
- [ ] **CI gate respected.** All wgpu/WGSL behind `#[cfg(feature = "gpui")]`; the Linux `rust-console` build never compiles the shader stack (doc 05 §5 / ADR-0086).
- [ ] **Built and run, not read.** Watched a focus-out → 0 GPU, a theme flip → re-skin, Reduce Motion → frozen-but-present, and a base-spec/iGPU run (or reduced-res fallback) — not just a clean compile.

---

## References

**Repo (grounded):**
- `core/pd-timeline-proto/src/main.rs` — the wgpu/Vello/winit loop: `ControlFlow::Wait` + redraw-on-input/play (`:336`,`:314`), frame-time/FPS instrumentation (`:295`), adapter print proving `Metal, Apple M4 Max` (`:148`,`:156`), `render_to_surface` + `present` + `device.poll` (`:278`–`:292`).
- `core/pd-timeline-proto/src/scene.rs` — Vello path/fill/stroke rendering (markers, threads, playhead) — the "shapes → Vello, not a shader" baseline; per-track palette constants (`:20`–`:36`) that a shipped surface would instead source from `palette.rs`.
- `references/05-bespoke-graphics-vello-wgpu.md` — the three tiers, the T3 fragment-shader dither note (§6), the brand-color + off-switch + CI gates this doc extends.
- `core/pd-console/src/palette.rs`, `app.rs:130` (`PD_CONSOLE_THEME`/`init_theme_from_env`) — the theme-token source + env-flag pattern mirrored by `PD_CONSOLE_FX`.
- `docs/adr/0086-operator-console-rendering-stack.md` — gpui-shell + Vello-surface decision; the Linux CI deps gate.

**External (current practice):**
- [Apple WWDC25 — WebGPU compute & perf](https://developer.apple.com/videos/play/wwdc2025/236/) — 16-bit half-precision for iGPU power/perf.
- [Inigo Quilez — 2D SDF formulas](https://iquilezles.org/articles/distfunctions2d/) — canonical SDFs + the `fwidth`/`smoothstep` AA idiom.
- [Inigo Quilez — distance functions / smin](https://iquilezles.org/articles/distfunctions/) — smooth-min and field operators.
- [Demofox — shadertoy techniques](https://blog.demofox.org/category/shadertoy/) — noise/dither/blue-noise practice.
- [shaders.com — performance guide](https://shaders.com/docs/guide/performance) — offscreen throttling, 16.67 ms budget, sub-30 fps overhead floor.
- [Learn Wgpu — the pipeline](https://sotrh.github.io/learn-wgpu/beginner/tutorial3-pipeline/) — `RenderPipeline`/`ShaderModule`/WGSL entry points on wgpu.
- [WebGPU/WGSL spec](https://www.w3.org/TR/WGSL/) and [Toji — dynamic shader construction](https://toji.dev/webgpu-best-practices/dynamic-shader-construction.html) — WGSL semantics + `naga_oil`-style composition.

**Sources:** [Apple WWDC25 WebGPU](https://developer.apple.com/videos/play/wwdc2025/236/) · [iquilezles 2D SDF](https://iquilezles.org/articles/distfunctions2d/) · [iquilezles distfunctions](https://iquilezles.org/articles/distfunctions/) · [demofox shadertoy](https://blog.demofox.org/category/shadertoy/) · [shaders.com performance](https://shaders.com/docs/guide/performance) · [Learn Wgpu pipeline](https://sotrh.github.io/learn-wgpu/beginner/tutorial3-pipeline/) · [WGSL spec](https://www.w3.org/TR/WGSL/) · [Toji WebGPU best practices](https://toji.dev/webgpu-best-practices/dynamic-shader-construction.html)
