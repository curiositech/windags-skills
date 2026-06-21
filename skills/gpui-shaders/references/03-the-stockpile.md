# The Stockpile — Copy-Pasteable WGSL Shader-Toy Examples for the Harbor Console

> **Scope.** This is the showpiece. A gallery of *complete*, on-brand WGSL fragment shaders for **T3 surfaces** (Vello/wgpu on Metal) in pd-console — the moment you've earned a fragment shader per `05-bespoke-graphics-vello-wgpu.md` (per-pixel dither at full res + 60fps, a real water sim, a CRT post pass). Every example below is the *escape-hatch ceiling*: a `wgpu::RenderPipeline` on the same `Surface` Vello renders into, or a Vello post-pass. None of this belongs in the gpui element tree, and none of it is a substitute for a T1 `with_animation` glow.
>
> **Brand law.** Harbor / maritime / **mustard + navy**, pixelated retro-futurism. Every color below traces a `palette.rs` role — `MUSTARD 0xffdb33`, `NAVY 0x141b2e`, `BG 0xf5f5f0`, `SEA 0x1c3a5e`, `FOAM 0xcfe3f0`. **Never** cinnabar `#CC3D2E`, brass, or patina (`scripts/check-brand-colors.mjs` fails CI on them). When the operator flips theme (`Ctrl-A g`), you re-push a uniform buffer, not a new pipeline.
>
> **House WGSL conventions used throughout** (so you can paste any one shader and it compiles against the same scaffold):
> - Full-screen triangle vertex shader (§0), one shared `Uniforms` block, fragment entry `fs_main`.
> - `iResolution` = pixels, `iTime` = seconds, `iMouse` = pixels (`vec4f`, `.zw` = click), `iTheme` = `0` light / `1` dark.
> - Shadertoy idioms ported to WGSL: `vec2f`/`f32` not `vec2`/`float`, `fn` not bare decls, `let`/`var`, `mix`/`fract`/`floor` are built-ins, **no implicit int↔float** (write `f32(i)`), array indexing wants `u32`.

---

## §0 — The shared scaffold (paste this ONCE, above any example)

Every example is a `fs_main` that assumes these are in scope. This is the whole boilerplate; the gallery never repeats it.

```wgsl
// ── Shared uniforms: one buffer, re-pushed each frame from Rust. ──────────────
struct Uniforms {
    i_resolution : vec2f,   // framebuffer size in physical px
    i_time       : f32,     // seconds since surface created
    i_theme      : f32,     // 0.0 = light, 1.0 = dark (Ctrl-A g flips this)
    i_mouse      : vec4f,    // xy = cursor px, zw = last click px
};
@group(0) @binding(0) var<uniform> U : Uniforms;

// ── Brand palette as f32 vec3 roles. These are the ONLY literals allowed. ─────
const MUSTARD : vec3f = vec3f(1.000, 0.859, 0.200);  // 0xffdb33 — accent / sun / flags
const NAVY    : vec3f = vec3f(0.078, 0.106, 0.180);  // 0x141b2e — chrome / night sky
const SEA     : vec3f = vec3f(0.110, 0.227, 0.369);  // 0x1c3a5e — deep water
const FOAM    : vec3f = vec3f(0.812, 0.890, 0.941);  // 0xcfe3f0 — crests / haze
const BG      : vec3f = vec3f(0.961, 0.961, 0.941);  // 0xf5f5f0 — paper light bg
const HULL    : vec3f = vec3f(0.090, 0.122, 0.200);  // boats read as dark navy silhouettes
const RUST    : vec3f = vec3f(0.776, 0.498, 0.220);  // weathered deck accent (NOT cinnabar)

// ── Full-screen triangle: 3 verts, no vertex buffer. Standard wgpu idiom. ─────
struct VOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f };
@vertex
fn vs_main(@builtin(vertex_index) vi : u32) -> VOut {
    // (0,0)(2,0)(0,2) clip-space tri covers the screen; uv in 0..1.
    let p = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
    var o : VOut;
    o.pos = vec4f(p * 2.0 - 1.0, 0.0, 1.0);
    o.uv  = vec2f(p.x, 1.0 - p.y);   // flip so +y is up, harbor-style
    return o;
}

// ── House helpers every example below leans on. ──────────────────────────────
fn hash21(p : vec2f) -> f32 {                 // ported Shadertoy hash
    return fract(sin(dot(p, vec2f(12.9898, 78.233))) * 43758.5453);
}
fn vnoise(p : vec2f) -> f32 {                 // value noise, bilerp of hashed corners
    let i = floor(p); let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);          // smoothstep weights
    return mix(mix(hash21(i + vec2f(0,0)), hash21(i + vec2f(1,0)), u.x),
               mix(hash21(i + vec2f(0,1)), hash21(i + vec2f(1,1)), u.x), u.y);
}
fn fbm(p0 : vec2f) -> f32 {                   // 5-octave fractal noise
    var p = p0; var a = 0.5; var s = 0.0;
    for (var k = 0; k < 5; k = k + 1) { s = s + a * vnoise(p); p = p * 2.02; a = a * 0.5; }
    return s;
}
// 4×4 ordered Bayer threshold in 0..1 — the spine of the retro look.
fn bayer4(p : vec2f) -> f32 {
    let x = u32(p.x) & 3u; let y = u32(p.y) & 3u;
    var m = array<f32,16>(0.0,8.0,2.0,10.0, 12.0,4.0,14.0,6.0,
                          3.0,11.0,1.0,9.0, 15.0,7.0,13.0,5.0);
    return m[y * 4u + x] / 16.0;
}
// Snap a continuous tone to a dithered 2-color choice — the workhorse.
fn dither_pick(value : f32, frag : vec2f, lo : vec3f, hi : vec3f) -> vec3f {
    return select(lo, hi, value > bayer4(frag));
}
// Quantize a color to N levels per channel with Bayer error-diffusion.
fn dither_quant(c : vec3f, frag : vec2f, levels : f32) -> vec3f {
    let d = (bayer4(frag) - 0.5) / levels;
    return floor((c + d) * (levels - 1.0) + 0.5) / (levels - 1.0);
}
// Pixelate uv to a chunky grid; `px` = logical pixels per chunk.
fn pixelate(frag : vec2f, px : f32) -> vec2f { return floor(frag / px) * px; }
```

---

## (a) `pixelated_ocean.wgsl` — Gerstner + sine-stack sea, chunked and dithered

**What it's for:** the ambient backdrop of any "at sea" surface — the dispatch queue while it's empty, a sortie that's mid-voyage. A real wave height field, pixel-snapped to 5px chunks, then Bayer-dithered between `SEA` and `FOAM`.

```wgsl
// A summed Gerstner stack sampled as a height field in screen space.
// Each wave: direction d, wavelength L, steepness q, speed. We only need the
// scalar height + a finite-difference normal for the glint, so this is the
// cheap "fake 3D from 2D" form — no vertex displacement, all in the fragment.
fn gerstner_h(p : vec2f, t : f32) -> f32 {
    var h = 0.0;
    // dir, wavelength, amplitude, speed — four crossing trains = no obvious tiling
    var dirs = array<vec2f,4>(vec2f(1.0,0.18), vec2f(0.7,-0.5),
                              vec2f(-0.3,0.9), vec2f(0.9,0.6));
    var len  = array<f32,4>(0.9, 0.5, 1.7, 0.33);
    var amp  = array<f32,4>(0.34, 0.18, 0.10, 0.06);
    var spd  = array<f32,4>(0.6, 1.1, 0.35, 1.7);
    for (var i = 0u; i < 4u; i = i + 1u) {
        let d = normalize(dirs[i]);
        let k = 6.2831853 / len[i];                 // angular wavenumber
        let phase = dot(d, p) * k + t * spd[i];
        h = h + amp[i] * sin(phase);
        h = h + amp[i] * 0.25 * sin(phase * 2.13 + 1.3);  // sharpening harmonic
    }
    return h;
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let CHUNK = 5.0;                                  // retro pixel size
    let frag  = pixelate(in.pos.xy, CHUNK);           // snap to the chunky grid
    let aspect = U.i_resolution.x / U.i_resolution.y;
    var uv = (frag / U.i_resolution) * vec2f(aspect, 1.0);

    // Perspective squash: waves near the horizon (top) compress.
    let horizon = 0.34;
    let depth = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
    let sample = vec2f(uv.x * mix(4.0, 14.0, depth), uv.y * mix(2.0, 9.0, depth));

    let t = U.i_time;
    let h  = gerstner_h(sample, t);
    // Finite-difference normal.z proxy for a Lambert-ish shade.
    let e  = vec2f(0.04, 0.0);
    let nx = gerstner_h(sample + e.xy, t) - gerstner_h(sample - e.xy, t);
    let ny = gerstner_h(sample + e.yx, t) - gerstner_h(sample - e.yx, t);
    let slope = clamp(0.5 - (nx + ny) * 1.4, 0.0, 1.0);

    // Tone: deep sea up to bright foam on the crests + slope shading.
    let crest = smoothstep(0.18, 0.42, h);
    var tone  = slope * 0.55 + crest * 0.7 + depth * 0.15;
    if (U.i_theme > 0.5) { tone = tone * 0.8; }       // night harbor: darker sea

    // Dither between SEA and FOAM, then a hard foam line on the steepest crests.
    var col = dither_pick(tone, frag, SEA, FOAM);
    let foam_line = step(0.86, crest + hash21(frag + t) * 0.08);
    col = mix(col, FOAM, foam_line);
    // A few mustard sun-sparks riding the brightest crests.
    let spark = step(0.93, crest) * step(0.5, hash21(frag * 0.5 + floor(t * 6.0)));
    col = mix(col, MUSTARD, spark * 0.6);
    return vec4f(col, 1.0);
}
```

**Decision Point — chunk size is your budget AND your nostalgia knob.** `CHUNK = 5.0` reads unmistakably "pixel ocean" and the fragment runs at framebuffer/25 effective cost. Drop to `2.0` only for a hero surface; the dither stops reading as dither below ~3px.
**Anti-Pattern — Gerstner in the *vertex* shader here.** Symptom: you reach for vertex displacement on a quad. Detection: a tessellated mesh in a 2D full-screen pass. Fix: this is a *height field sampled in the fragment* — there is no mesh, don't invent one.

---

## (b) `little_boat.wgsl` — a single ship bobbing on the dithered water

**What it's for:** an in-flight marker that *is* the agent — a tiny navy-silhouette ketch rising and falling on the same wave field as (a), so the boat and the sea agree. Layer this over (a) (same `CHUNK`, sample `gerstner_h` for the bob).

```wgsl
// SDF for a stylized hull + a single mast + a mustard sail.
// Everything in a local "boat space" centered on the waterline contact point.
fn sd_box(p : vec2f, b : vec2f) -> f32 {
    let d = abs(p) - b; return length(max(d, vec2f(0.0))) + min(max(d.x, d.y), 0.0);
}
fn sd_tri(p : vec2f, a : vec2f, b : vec2f, c : vec2f) -> f32 {
    // standard inigo-quilez 2D triangle SDF (sign via winding)
    let e0 = b - a; let e1 = c - b; let e2 = a - c;
    let v0 = p - a;  let v1 = p - b;  let v2 = p - c;
    let pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    let pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    let pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    let s = sign(e0.x * e2.y - e0.y * e2.x);
    let d = min(min(vec2f(dot(pq0,pq0), s*(v0.x*e0.y - v0.y*e0.x)),
                    vec2f(dot(pq1,pq1), s*(v1.x*e1.y - v1.y*e1.x))),
                    vec2f(dot(pq2,pq2), s*(v2.x*e2.y - v2.y*e2.x)));
    return -sqrt(d.x) * sign(d.y);
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let CHUNK = 5.0;
    let frag = pixelate(in.pos.xy, CHUNK);
    let res  = U.i_resolution;
    let t    = U.i_time;

    // Background sea tone (shared with (a) — abbreviated to a single fbm swell).
    var uv = frag / res;
    let swell = fbm(vec2f(uv.x * 8.0, uv.y * 4.0 - t * 0.4));
    var col = dither_pick(swell * 0.6 + 0.2, frag, SEA, FOAM);

    // Boat anchor: a point that bobs + pitches with the local swell.
    let anchor_x = 0.5 + 0.06 * sin(t * 0.5);          // gentle drift
    let waterline = 0.6;
    let bob   = 0.025 * sin(t * 1.6) + 0.012 * fbm(vec2f(t, 0.0));
    let pitch = 0.18 * sin(t * 1.3);                   // radians of roll
    // Transform fragment into boat-local space (rotate by pitch, recenter).
    var bp = (uv - vec2f(anchor_x, waterline - bob)) * vec2f(res.x/res.y, 1.0) * 6.0;
    let cs = cos(pitch); let sn = sin(pitch);
    bp = vec2f(cs * bp.x - sn * bp.y, sn * bp.x + cs * bp.y);

    // Hull: a flattened box with a chopped bow (intersection with a tri).
    let hull = max(sd_box(bp - vec2f(0.0, 0.0), vec2f(0.55, 0.14)),
                  -sd_tri(bp, vec2f(0.55,-0.2), vec2f(1.1,0.2), vec2f(0.55,0.2)));
    // Mast (thin tall box) + mustard mainsail (triangle).
    let mast = sd_box(bp - vec2f(0.0, 0.5), vec2f(0.03, 0.5));
    let sail = sd_tri(bp, vec2f(0.04,0.05), vec2f(0.04,0.95), vec2f(0.5,0.1));
    let flag = sd_box(bp - vec2f(0.0 + 0.14*sin(t*8.0), 1.0), vec2f(0.14, 0.05));

    // Composite back-to-front with hard SDF edges (no AA = crisp pixel look).
    col = select(col, MUSTARD, sail < 0.0);
    col = select(col, NAVY,    mast < 0.0);
    col = select(col, HULL,    hull < 0.0);
    col = select(col, MUSTARD, flag < 0.0);

    // Reflection smear: faint vertical mustard/navy streak below the hull.
    if (uv.y > waterline) {
        let r = exp(-(uv.y - waterline) * 9.0);
        let refl = dither_pick(r, frag, col, mix(col, NAVY, 0.4));
        col = mix(col, refl, r * 0.5);
    }
    return vec4f(col, 1.0);
}
```

**Decision Point — one boat in the fragment vs. an instanced fleet.** A *single* hero boat is fine as SDFs in the fragment (above). For a *fleet* of N boats, do NOT loop N SDFs per pixel — instance quads in Vello and run this shader per-instance, or pack boat transforms into a storage buffer. The crossover is ~3 boats.
**Anti-Pattern — anti-aliased boat edges.** Symptom: `smoothstep` softening every hull edge. Detection: the boat looks like a vector logo, not a sprite. Fix: hard `select` on `sdf < 0.0`. The pixel grid (CHUNK) *is* the anti-aliasing — let the chunk own the jaggies.

---

## (c) `living_harbor.wgsl` — the full scene: sky gradient + sun glint + water + moored boats

**What it's for:** the showpiece backdrop. The v12 "living harbor." A dithered dawn sky, a low mustard sun throwing a glint road across the water, two or three moored silhouettes. This is the one that makes someone go "whoa."

```wgsl
// Composite scene. Bands top→bottom: sky gradient, sun + glint road, sea,
// moored boats sitting on the sea line. All dithered into the brand 4.
fn sun_glint(uv : vec2f, sun : vec2f, t : f32) -> f32 {
    // A shimmering "road" of light from the sun down the water toward the viewer.
    let dx = abs(uv.x - sun.x);
    let road = exp(-dx * dx * 22.0);                       // horizontal falloff
    let ripple = 0.5 + 0.5 * sin(uv.y * 60.0 - t * 3.0 + fbm(uv * 8.0) * 6.0);
    return road * ripple * smoothstep(sun.y, 1.0, uv.y);   // only below the sun
}
fn moored_boat(uv : vec2f, cx : f32, sea_y : f32, t : f32, scale : f32) -> f32 {
    let bob = 0.004 * sin(t * 1.2 + cx * 9.0);
    var p = (uv - vec2f(cx, sea_y - bob)) / scale;
    p.x = p.x * (U.i_resolution.x / U.i_resolution.y);
    let hull = sd_box(p, vec2f(0.5, 0.12)) ;               // reuse (b)'s sd_box
    let mast = sd_box(p - vec2f(0.0, 0.45), vec2f(0.025, 0.45));
    return min(hull, mast);
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let CHUNK = 4.0;
    let frag = pixelate(in.pos.xy, CHUNK);
    let res  = U.i_resolution;
    let uv   = frag / res;
    let t    = U.i_time;
    let night = U.i_theme > 0.5;

    let sea_y = 0.62;
    let sun   = vec2f(0.5 + 0.12 * sin(t * 0.05), 0.30);   // low harbor sun, drifting

    var col : vec3f;
    if (uv.y < sea_y) {
        // ── SKY: vertical gradient, dithered navy→foam (or navy→mustard at dawn).
        let g = uv.y / sea_y;                              // 0 top .. 1 at sea line
        let top = select(FOAM, NAVY, night);
        let dawn = mix(top, MUSTARD, smoothstep(0.55, 1.0, g) * 0.7);
        let sky_tone = g;
        col = dither_quant(dawn, frag, 4.0);
        // Sun disk + halo.
        let d = length((uv - sun) * vec2f(res.x/res.y, 1.0));
        col = mix(col, MUSTARD, smoothstep(0.075, 0.055, d));          // disk
        col = mix(col, MUSTARD, smoothstep(0.20, 0.0, d) * 0.25);      // halo
        // Stars at night, dithered sparse.
        if (night) {
            let s = step(0.985, hash21(frag)) * step(0.5, hash21(frag + 7.0));
            col = mix(col, FOAM, s);
        }
    } else {
        // ── SEA: swell + the sun-glint road, dithered SEA→FOAM, mustard sparks.
        let swell = fbm(vec2f(uv.x * 7.0, (uv.y - sea_y) * 16.0 - t * 0.5));
        var tone  = 0.25 + swell * 0.5;
        col = dither_pick(tone, frag, select(SEA, NAVY, night), FOAM);
        let glint = sun_glint(uv, sun, t);
        col = mix(col, MUSTARD, smoothstep(0.35, 0.9, glint));
    }

    // ── BOATS: three moored silhouettes on the sea line (back-to-front).
    let b0 = moored_boat(uv, 0.22, sea_y, t, 0.06);
    let b1 = moored_boat(uv, 0.74, sea_y, t, 0.085);
    let b2 = moored_boat(uv, 0.50, sea_y, t, 0.05);
    col = select(col, HULL, min(min(b0, b1), b2) < 0.0);
    return vec4f(col, 1.0);
}
```

**Decision Point — companion vs embedded (ADR-0086).** The living harbor is *ambient and persistent* → it wants to be the **embedded** Vello surface (path 2), sharing the wgpu device, not a companion window. Own that cost honestly; it doesn't "just drop in."
**Quality Gate:** theme flip re-pushes `i_theme`; sea, sky, and stars all re-skin on the next frame with zero pipeline rebuild.

---

## (d) `flag_shimmer.wgsl` — ICS signal-flag with a wind ripple + dither

**What it's for:** the maritime-flags identity chip in the fleet directory (each agent flies an ICS letter). The flag *flutters* — a sine-warped UV + a hoist-side anchor so it ripples away from the pole. Shown here as ICS **"A" (Alpha)** = white hoist / navy fly swallowtail; swap the `flag_pattern` for any letter.

```wgsl
// ICS flag = a procedural pattern function in flag-UV space (0..1). Here: Alpha,
// a vertical white|navy split with a swallowtail notch on the fly edge.
fn flag_alpha(fuv : vec2f) -> vec3f {
    var c = select(FOAM, NAVY, fuv.x > 0.5);             // white hoist | navy fly
    // Swallowtail: carve a triangular notch out of the fly edge.
    let notch = abs(fuv.y - 0.5) * 2.0 + (1.0 - fuv.x) * 1.4;
    if (fuv.x > 0.7 && notch < 0.55) { c = vec3f(-1.0); } // sentinel = transparent
    return c;
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let CHUNK = 3.0;
    let frag = pixelate(in.pos.xy, CHUNK);
    let res  = U.i_resolution;
    var uv   = frag / res;
    let t    = U.i_time;

    // Map screen to flag-UV with margins; the flag occupies the central 80%.
    var fuv = (uv - 0.1) / 0.8;

    // Wind ripple: displacement grows toward the fly edge (free end flaps more).
    let flap = fuv.x;                                      // 0 at hoist, 1 at fly
    let wave = sin(fuv.x * 9.0 - t * 5.0) * 0.045
             + sin(fuv.x * 17.0 - t * 8.0) * 0.02;
    fuv.y = fuv.y + wave * flap;
    // A subtle horizontal stretch as the cloth bunches.
    fuv.x = fuv.x + 0.01 * cos(fuv.y * 12.0 + t * 4.0) * flap;

    if (fuv.x < 0.0 || fuv.x > 1.0 || fuv.y < 0.0 || fuv.y > 1.0) {
        return vec4f(0.0, 0.0, 0.0, 0.0);                 // outside the cloth
    }
    var col = flag_alpha(fuv);
    if (col.x < 0.0) { return vec4f(0.0); }               // swallowtail cutout

    // Cloth shading: the ripple's slope casts a soft light/dark band → "shimmer".
    let shade = 0.5 + 0.5 * cos(fuv.x * 9.0 - t * 5.0);
    col = dither_quant(col * mix(0.78, 1.12, shade), frag, 4.0);
    // A travelling mustard highlight glints along the crest of each fold.
    let glint = smoothstep(0.92, 1.0, shade) * flap;
    col = mix(col, MUSTARD, glint * 0.5);
    return vec4f(col, 1.0);
}
```

**Anti-Pattern — uniform flap across the whole flag.** Symptom: the entire cloth shears in lockstep. Detection: ripple amplitude has no `flap`/`fuv.x` weight. Fix: scale displacement by distance from the hoist — the pole end is pinned, the fly end whips.

---

## (e) `aurora_starfield.wgsl` — night backdrop, ribbon aurora over a dithered star field

**What it's for:** the idle/empty-state backdrop for the console at night, or the splash behind the briefing. Layered curtains of fbm-warped light over twinkling Bayer stars — mustard-and-foam aurora so it stays on-brand instead of the usual green.

```wgsl
// Aurora = stacked vertical "curtains": a horizontal band whose y-center is
// warped by fbm and which scrolls; intensity falls off above/below the band.
fn aurora_band(uv : vec2f, t : f32, y0 : f32, hue : vec3f, speed : f32) -> vec3f {
    let warp = fbm(vec2f(uv.x * 3.0 + t * speed, t * 0.2)) * 0.25;
    let center = y0 + warp;
    let d = abs(uv.y - center);
    // Vertical streaks: many thin curtains modulated along x.
    let streak = 0.5 + 0.5 * sin(uv.x * 40.0 + fbm(vec2f(uv.x * 6.0, t * 0.3)) * 10.0);
    let band = exp(-d * d * 90.0) * streak;
    // Aurora brightens toward its top edge (the classic green-curtain look).
    let topfade = smoothstep(center + 0.18, center, uv.y);
    return hue * band * topfade;
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let CHUNK = 3.0;
    let frag  = pixelate(in.pos.xy, CHUNK);
    let res   = U.i_resolution;
    let uv    = frag / res;
    let t     = U.i_time;

    // Night sky base: navy gradient, darker at the zenith.
    var col = mix(NAVY * 0.6, NAVY * 1.15, uv.y);

    // Star field: sparse Bayer-gated twinkles, each on its own phase.
    let star = step(0.992, hash21(frag));
    let tw   = 0.5 + 0.5 * sin(t * 2.0 + hash21(frag) * 6.2831);
    col = col + FOAM * star * tw;
    // A few brighter mustard "navigation stars".
    let nav = step(0.9985, hash21(frag + 3.0));
    col = col + MUSTARD * nav * (0.6 + 0.4 * tw);

    // Two aurora curtains: mustard low, foam-tinted high.
    col = col + aurora_band(uv, t, 0.55, MUSTARD * 0.8, 0.35);
    col = col + aurora_band(uv, t, 0.40, mix(FOAM, MUSTARD, 0.3) * 0.7, -0.22);

    // Dither-quantize so the gradients band into clean retro steps.
    col = dither_quant(col, frag, 6.0);
    return vec4f(col, 1.0);
}
```

**Decision Point — additive curtains, then quantize LAST.** Build the aurora in continuous tone (additive `exp` bands), then `dither_quant` the *composite*. Quantizing per-band first produces muddy overlap. Order matters.

---

## (f) `crt_post.wgsl` — CRT scanlines + chromatic aberration + barrel, as a POST pass

**What it's for:** the final pass over the *whole* harbor (it samples the previously-rendered scene texture). Gives the console its cassette-futurism CRT skin: per-channel chromatic split, scanlines, barrel curvature, vignette, phosphor flicker. This is the only example that takes an input texture.

```wgsl
// POST pass: binds the offscreen scene render as a texture + sampler.
@group(0) @binding(1) var src_tex  : texture_2d<f32>;
@group(0) @binding(2) var src_samp : sampler;

fn barrel(uv : vec2f, k : f32) -> vec2f {
    let c = uv * 2.0 - 1.0;                 // -1..1
    let r2 = dot(c, c);
    return (c * (1.0 + k * r2)) * 0.5 + 0.5;
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let res = U.i_resolution;
    var uv  = barrel(in.uv, 0.12);          // gentle screen bulge

    // Off-screen after curvature = black border (real CRT bezel).
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        return vec4f(NAVY * 0.15, 1.0);
    }

    // Chromatic aberration: sample R/G/B at increasing radial offsets.
    let dir = (uv - 0.5);
    let ca  = 0.0018 + length(dir) * 0.004;  // grows toward edges
    let r = textureSample(src_tex, src_samp, uv + dir * ca).r;
    let g = textureSample(src_tex, src_samp, uv).g;
    let b = textureSample(src_tex, src_samp, uv - dir * ca).b;
    var col = vec3f(r, g, b);

    // Scanlines: darken every other physical row; aperture-grille tint per column.
    let px = uv * res;
    let scan = 0.85 + 0.15 * sin(px.y * 3.14159);
    let grille = 0.92 + 0.08 * sin(px.x * 2.094);   // RGB stripe shimmer
    col = col * scan * grille;

    // Phosphor flicker + faint rolling bright bar (the "sync" wobble).
    let flicker = 0.97 + 0.03 * sin(U.i_time * 60.0);
    let roll = 1.0 + 0.04 * smoothstep(0.0, 0.05,
                  fract(uv.y - U.i_time * 0.15)) * smoothstep(0.1, 0.05,
                  fract(uv.y - U.i_time * 0.15));
    col = col * flicker * roll;

    // Vignette + a whisper of mustard bloom in the corners.
    let vig = smoothstep(1.25, 0.4, length(dir) * 2.0);
    col = mix(col, col + MUSTARD * 0.05, length(dir));
    col = col * vig;
    return vec4f(col, 1.0);
}
```

**Decision Point — barrel BEFORE you sample, CA AT sample, scanlines AFTER.** The order is load-bearing: distort UVs, fetch the three channels, *then* multiply the line/grille mask onto the fetched color. Scanline-then-distort smears the lines into the curve.
**Anti-Pattern — full-strength CRT on text panes.** Symptom: chromatic aberration on code makes glyphs unreadable (violates the no-tiny-fonts spirit). Detection: `ca > 0.002` over a text surface. Fix: gate CA to ≤`0.001` over text, or exempt text panes from this pass entirely. The CRT skin is for *chrome and viz*, not the editor.

---

## (g) `chrome_gradient.wgsl` — dithered animated gradient for chrome borders / title bars

**What it's for:** the 1–3px animated border around a focused pane, the title-bar wash, the seam between panes. A slow navy→mustard sweep, Bayer-dithered so it reads as deliberate retro banding rather than a smooth (off-brand) gradient.

```wgsl
@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let frag = in.pos.xy;                    // NO pixelate — borders stay crisp
    let res  = U.i_resolution;
    let uv   = frag / res;
    let t    = U.i_time;

    // Diagonal sweep position with a gentle fbm wobble so it "breathes".
    let diag = (uv.x + uv.y) * 0.5;
    let phase = fract(diag - t * 0.08 + fbm(uv * 3.0 + t * 0.1) * 0.06);

    // Two-stop ramp navy→mustard→navy (a travelling highlight band).
    let band = smoothstep(0.0, 0.5, phase) * smoothstep(1.0, 0.5, phase);
    var col = mix(NAVY, MUSTARD, band);

    // Ordered-dither the ramp into ~5 visible steps — the signature retro edge.
    col = dither_quant(col, frag, 5.0);

    // Edge mask: only paint the outer `bw` px ring (this is a BORDER shader).
    let bw = 3.0;
    let d = min(min(frag.x, res.x - frag.x), min(frag.y, res.y - frag.y));
    let alpha = step(d, bw);
    // Focused pane glows brighter (drive `i_mouse.z` = focused flag from Rust).
    let focus = select(0.6, 1.0, U.i_mouse.z > 0.5);
    return vec4f(col, alpha * focus);
}
```

**Decision Point — premultiply or the border halos.** This pass outputs `alpha`; composite it over the pane with premultiplied-alpha blending in the wgpu `ColorTargetState`, or the mustard fringe bleeds onto the pane interior. The `dither_quant` step count (5) is the only thing standing between "tasteful retro band" and "smooth Web-2.0 gradient" — keep it ≤6.

---

## (h) `sonar_sweep.wgsl` — radar/sonar ping with a rotating sweep + decaying blips

**What it's for:** the fleet "scanning" state — a sortie searching, a discovery pass running. A classic rotating sonar arm over concentric range rings, with contacts that flare mustard as the beam passes and fade until the next revolution.

```wgsl
const TAU : f32 = 6.2831853;

// A contact at polar (range 0..1, angle rad). Returns brightness given the
// current sweep angle: bright when freshly passed, decays around the circle.
fn contact(p : vec2f, range : f32, ang : f32, sweep : f32, size : f32) -> f32 {
    let cp = vec2f(cos(ang), sin(ang)) * range;          // contact position
    let d  = length(p - cp);
    let blip = smoothstep(size, 0.0, d);
    // Phase since the beam last swept this bearing (0 = just hit, → fades).
    var since = sweep - ang;
    since = since - floor(since / TAU) * TAU;            // wrap to 0..TAU
    let fade = exp(-since * 1.6);
    return blip * fade;
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4f {
    let res = U.i_resolution;
    let uv  = (in.pos.xy - res * 0.5) / min(res.x, res.y);  // centered, aspect-safe
    let r   = length(uv) * 2.0;                             // 0 center .. ~1 edge
    let a   = atan2(uv.y, uv.x);
    let t   = U.i_time;

    var col = NAVY * mix(0.5, 0.9, 1.0 - r);               // dark domed scope

    if (r <= 1.0) {
        // Range rings (concentric), Bayer-dithered so they read pixelated.
        let ring = abs(fract(r * 4.0) - 0.5);
        col = mix(col, SEA, smoothstep(0.04, 0.0, ring) * 0.6);
        // Cross-hairs.
        let cross = min(abs(uv.x), abs(uv.y));
        col = mix(col, SEA, smoothstep(0.004, 0.0, cross) * 0.5);

        // The sweep arm: a bright wedge trailing into a decaying afterglow.
        let sweep = fract(t * 0.18) * TAU;                 // one revolution / ~5.5s
        var rel = sweep - a;
        rel = rel - floor(rel / TAU) * TAU;                // 0..TAU behind the arm
        let arm   = smoothstep(0.04, 0.0, rel) ;           // leading edge
        let trail = exp(-rel * 2.2);                       // phosphor afterglow
        col = mix(col, MUSTARD, (arm + trail * 0.5) * smoothstep(1.0, 0.95, r));

        // A few contacts that flare as the beam passes (drive from a storage buf).
        col = col + MUSTARD * contact(uv, 0.45, 1.1, sweep, 0.04);
        col = col + MUSTARD * contact(uv, 0.72, 3.7, sweep, 0.05);
        col = col + FOAM    * contact(uv, 0.30, 5.2, sweep, 0.035);

        // Dither the whole scope to lock the retro look.
        col = dither_quant(col, in.pos.xy, 5.0);
    }
    // Scope bezel.
    col = mix(col, NAVY * 0.3, smoothstep(0.98, 1.02, r));
    return vec4f(col, 1.0);
}
```

**Decision Point — contacts in the shader vs from a storage buffer.** Three hard-coded contacts (above) is fine for a demo state. Real fleet blips → pack `(range, angle, size)` into a `storage` array and loop; the per-pixel cost is N contacts × one `length`, cheap to ~64.
**Anti-Pattern — `atan2` discontinuity flicker at the sweep seam.** Symptom: the arm strobes as it crosses the −π/π bearing. Detection: `rel` not wrapped into `0..TAU`. Fix: the `rel - floor(rel/TAU)*TAU` wrap above — always normalize the angular delta before the falloff.

---

## Quality Gates (every shader in the stockpile)

- [ ] **Palette-only literals.** Every `vec3f` color is a named brand const (`MUSTARD`/`NAVY`/`SEA`/`FOAM`/`BG`/`HULL`/`RUST`). No cinnabar `#CC3D2E`, brass, or patina — `scripts/check-brand-colors.mjs` would fail.
- [ ] **Theme-reactive.** Reads `U.i_theme`; `Ctrl-A g` re-pushes the uniform and the surface re-skins next frame with **zero** pipeline rebuild.
- [ ] **Off-switch.** Under `PD_CONSOLE_FX=off` the Rust side stops advancing `i_time` (freeze mid-phase) — every shader must look "lit," not broken, at a static `i_time`. No effect *requires* motion to be legible.
- [ ] **Pixelation is intentional.** Any chunky look comes from `pixelate(... , CHUNK≥3.0)` or `dither_quant`, never from accidental low-res sampling. Borders/post passes that must stay crisp (`g`, `f`) deliberately skip `pixelate`.
- [ ] **No int↔float coercion.** Every loop counter cast with `f32(i)`; every array index a `u32`. WGSL is stricter than GLSL — this is the #1 port failure.
- [ ] **Phases are incoherent.** Stars, sparks, sparkles, contacts each carry a per-element `hash21` phase offset — no lockstep strobe (mirrors the T2 rule in `05-bespoke-graphics`).
- [ ] **T3 justified, path declared.** Each shader states companion (path 3) vs embedded (path 2). Ambient/persistent (living harbor, chrome border, aurora) → embedded; modal/focused (sonar ping, a single flag chip) → companion is acceptable.
- [ ] **CI gate respected.** All of this lives behind `#[cfg(feature = "gpui")]` / the Vello surface crate; the Linux `rust-console` build never compiles wgpu (ADR-0086).
- [ ] **Built and run, not just read.** Visually audit the rendered frame: dither reads as dither (not mush), no banding seams at tile edges, the CRT pass keeps text legible (CA ≤ 0.001 over glyphs).

---

## Sources

- [WebGPU Shading Language (W3C TR/WGSL)](https://www.w3.org/TR/WGSL/) — `fn`/`vec2f`/`f32` syntax, strict typing, resource binding.
- [Interactive WebGL Backgrounds: A Quick Guide to Bayer Dithering — Codrops](https://tympanus.net/codrops/2025/07/30/interactive-webgl-backgrounds-a-quick-guide-to-bayer-dithering/) — ordered-dither idioms ported to the `bayer4`/`dither_quant` helpers.
- [WGSL Noise Algorithms (munrocket gist)](https://gist.github.com/munrocket/236ed5ba7e409b8bdf1ff6eca5dcdc39) — WGSL `hash`/`fbm` porting reference.
- [Ordered Dithering (Bayer) — Shadertoy 7sfXDn](https://www.shadertoy.com/view/7sfXDn) and [Ordered dithering — Wikipedia](https://en.wikipedia.org/wiki/Ordered_dithering) — the 4×4 threshold matrix.
- [3D Ocean Shader Using Gerstner Waves — gameidea](https://gameidea.org/2023/12/01/3d-ocean-shader-using-gerstner-waves/) and [Creating a Stylized 3D Water Shader — gameidea](https://gameidea.org/2026/02/01/creating-a-stylized-3d-water-shader/) — Gerstner summation + stylized water grounding.
- [CRT shader with chromatic aberration, glow, scanlines, dot matrix (luiscarlospando)](https://github.com/luiscarlospando/crt-shader-with-chromatic-aberration-glow-scanlines-dot-matrix) and [Retro CRT Shader Breakdown — Cyan](https://cyangamedev.wordpress.com/2020/09/10/retro-crt-shader-breakdown/) — barrel/CA/scanline composition order for the `crt_post` pass.
- [GM Shaders Mini: CRT — Xor](https://mini.gmshaders.com/p/gm-shaders-mini-crt) — aperture-grille + phosphor flicker technique.
- Repo grounding: `core/pd-timeline-proto/src/scene.rs` (live Vello+wgpu+Metal proof, palette discipline), `references/05-bespoke-graphics-vello-wgpu.md` (T1/T2/T3 tiering, `PD_CONSOLE_FX` off-switch, ADR-0086 companion-vs-embedded), `core/pd-console/src/palette.rs` (brand roles + banned colors).
