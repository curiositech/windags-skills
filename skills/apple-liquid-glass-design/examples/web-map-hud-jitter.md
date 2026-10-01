# Worked Example: Map HUD Jitter From backdrop-filter Over a 144 Hz WebGPU Canvas

Context: tough.trade `spikes/clay-map` (2026-09/10). A WebGPU clay-styled 3D map of a
Portland district fills the screen. A HUD sits on top: place pill (name, time, weather),
compass, look switcher (clay / brass / model / night), tune button, time scrubber, plus
per-person photo badges and name labels on the map. All chrome was DOM with
`backdrop-filter` glass. Reference capture: `spikes/clay-map/docs/clay-birdseye.png`.

## Symptom

On a 144 Hz MacBook in Chrome, the map panned smoothly but the **fixed** chrome visibly
jittered and shimmered relative to the viewport while the map moved. Static screenshots
looked fine. Dozens of elements carried `backdrop-filter` (every badge and label, not just
the bars).

## Diagnosis (how an expert reasons)

1. **Who owns the backdrop pixels?** The app's own WebGPU canvas, redrawn every frame.
   → Every `backdrop-filter` region must re-read and re-blur every frame.
2. **Budget.** 144 Hz = 6.9 ms per frame. Dozens of readback+blur regions on top of the map's
   own GPU work cannot fit; the compositor drops or delays its layers while the canvas keeps
   presenting. Chrome and scene are no longer composed in lockstep, so the chrome appears to
   move against a moving world.
3. **Is it a tuning problem?** Smaller blur radii and `will-change` hacks change the cost, not
   the structure (and `will-change: filter` on a container would create a Backdrop Root and
   break the blur). The structural fix is to stop asking the DOM compositor to sample a
   canvas.
4. **Design audit while we are here.** Run `scripts/audit_glass_spec.py` on the HUD's spec
   (`templates/glass-spec.sample.json` is an illustrative reconstruction of this HUD from the
   screenshot, not an audit of the code). It flags:
   - LG001/LG015: photo badges and name labels are **content** (one per person) yet glass.
   - LG002: the selected look-switcher segment and the "now" button are glass on glass.
   - LG012: CSS glass over an animated 144 Hz canvas.
   - LG014: no Reduce Transparency / Increase Contrast handling, no in-app toggle.
5. **Legibility.** `scripts/glass_contrast_check.py` on the reference capture with
   `templates/contrast-regions.sample.json` (`--text-present 40`, because the capture
   includes the text):

   | Region | Label colour | p5 | Need | Result |
   |---|---|---:|---:|---|
   | pill "1:00 PM" | #5b6f76 | 1.82 | 4.5 | FAIL |
   | switcher "brass" | #5b6f76 | 1.91 | 4.5 | FAIL |
   | "TIME" label | #5b6f76 | 1.75 | 4.5 | FAIL |
   | pill "Mount Tabor" (large) | #1c3238 | 2.73 | 3.0 | FAIL* |
   | attribution | best: black | 2.50 | 4.5 | FAIL |

   *The title's p5 is depressed by anti-aliased glyph edges that `--text-present` cannot
   exclude; its median is 7.2. Re-capture with the text hidden before acting on it. The
   secondary grey labels fail on medians too (about 2.6): mid-grey secondary text on
   light glass over saturated greens is the classic legibility failure.

## Fix

1. **Move glass into the render pipeline** (`references/web-gpu-postprocess.md`): one dual-
   Kawase blur chain per frame, a full-screen composite pass reading a uniform array of
   panel rects. DOM chrome keeps text and hit targets with transparent backgrounds. Rects
   update on `ResizeObserver`, not per frame. Result: chrome is drawn in the same frame as
   the map, so it cannot drift; panel count is nearly free.
2. **Demote content out of glass.** Photo badges get a hairline ring and a solid/blurred-
   photo fill drawn by the map renderer itself; name labels become small solid capsules
   (content layer), at least 14 px.
3. **No glass on glass.** Selected segment = a solid fill inside the switcher's glass; the
   "now" button = a fill (or the one tinted primary action) inside the time bar, radius
   concentric: 28 - 10 = 18.
4. **One container.** Look switcher and tune button share one glass group (or are clearly
   separate groups with a fixed gap), not two accidental containers.
5. **Labels.** Secondary labels go to a darker secondary (`#3a3a3c` light / `#d1d1d6` dark)
   and flip with backdrop luminance (async readback, hysteresis). Re-measure; gate p5 >= 4.5.
6. **Accessibility.** `uReduceTransparency` / `uIncreaseContrast` uniforms driven by media
   queries plus a persisted "solid chrome" toggle (Safari cannot report Reduce Transparency).

## Lesson

"Glass looks wrong" over a canvas is usually an ownership problem, not a styling one. If
your renderer owns the pixels behind the glass, your renderer should draw the glass.
