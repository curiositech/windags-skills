# Failure Modes

Each entry: symptom, why it happens, detection rule (what the auditor or a reviewer checks),
fix. Rule IDs match `scripts/audit_glass_spec.py`.

## LG001 Glass in the content layer
- **Symptom:** every card, row, or tile is glass; the screen looks like a sheet of ice.
- **Why:** treating glass as a style. Apple: "Don't use Liquid Glass in the content layer."
- **Detect:** `layer: "content"` with a glass material (except transient slider/toggle).
- **Fix:** standard material (`.thinMaterial`, `UIBlurEffect`) or solid fill; keep glass for
  floating chrome.

## LG002 Glass on glass
- **Symptom:** muddy double blur, doubled rims, confusing depth.
- **Why:** placing a glass button on a glass panel. On the web, the inner `backdrop-filter`
  only samples the outer element (Backdrop Root), so it also renders wrong.
- **Detect:** glass element whose `parent` chain includes glass.
- **Fix:** inner elements use fills, transparency, vibrancy; or merge both into one
  container so they are siblings, not parent/child.

## LG003 Clear without the three conditions
- **Symptom:** labels disappear over photos.
- **Detect:** `material: "clear"` with `over` not media, or bright media with
  `dimming < 0.3`, or `content_on_top` not bold-bright.
- **Fix:** regular variant, or add ~35% dark dimming and bold bright glyphs.

## LG004 Mixed regular and clear in one group
- **Detect:** one `group` containing both variants.
- **Fix:** pick one per group.

## LG005 Tint everywhere
- **Symptom:** nothing stands out; colourful noise.
- **Detect:** more than one tinted element per group, or more than two per screen; tint on a
  non-primary role.
- **Fix:** one primary per group, tint the background; colour into the content layer.

## LG006 Over-blur mud
- **Symptom:** the backdrop is unrecognisable grey soup; it reads as the 2013-2024 material.
- **Detect:** web `blur_px > 12` at 1x; native: thick material stacked behind glass.
- **Fix:** lighter blur plus edge refraction; let content through; rely on luminosity
  adjustment, not blur, for legibility.

## LG007 Illegible text
- **Detect:** `text.contrast_p5` below 4.5 (text) / 3.0 (large or glyph), or text below
  14 px on glass.
- **Fix:** see `legibility-contrast.md`.

## LG008 Non-concentric corners
- **Symptom:** pinched or flared corners in nested shapes.
- **Detect:** `abs(corner_radius - (parent_corner_radius - inset)) > 2` for shape
  `concentric` or nested `rounded`.
- **Fix:** `ConcentricRectangle`, `.containerConcentric(minimum:)`, or computed tokens.

## LG009 Neighbours in separate containers
- **Symptom:** morphs pop instead of flowing; inconsistent refraction between adjacent
  pills; extra render passes.
- **Detect:** glass elements with the same `group` but different `container`.
- **Fix:** one `GlassEffectContainer` / `UIGlassContainerEffect` /
  `NSGlassEffectContainerView`.

## LG010 Custom bar backgrounds left in place
- **Symptom:** solid or tinted toolbars on 26+; scroll edge effect fighting a custom fill.
- **Detect:** `custom_background: true` on a system bar.
- **Fix:** remove; let content colour the glass; scroll edge effect for separation.

## LG011 Decorative scroll edge effect
- **Detect:** scroll edge effect where no floating UI overlaps, or more than one per view.
- **Fix:** remove; one per view; match heights across split panes.

## LG012 Web backdrop-filter over an animated canvas
- **Symptom:** fixed chrome jitters, shimmers, or lags the scene; frame drops at 120/144 Hz.
- **Why:** per-element compositor readback and blur every frame, not synchronised with the
  canvas's own presentation.
- **Detect:** `route: "css"` (or library) with `backdrop_animated: true`; error when the
  count of glass regions exceeds 6, warning otherwise.
- **Fix:** GPU post-process route.

## LG013 Library context exhaustion
- **Detect:** `route: "library"` with glass element count + app contexts ≥ 12.
- **Fix:** fewer glass elements, or GPU route.

## LG014 Accessibility ignored
- **Detect:** custom/web glass with any of `handles_reduce_transparency`,
  `handles_increase_contrast`, `handles_reduce_motion` false; web without an in-app
  transparency toggle (Safari cannot report Reduce Transparency).
- **Fix:** `accessibility-fallbacks.md`.

## LG015 Glass on repeated items
- **Detect:** `repeated: true` with a glass material (one glass per list item, map pin,
  grid tile).
- **Fix:** content-layer styling; glass belongs to singletons.

## LG016 Text and symbols mixed in one bar group
- **Detect:** group with both `label_kind: "text"` and `"symbol"` items.
- **Fix:** separate text buttons into their own container.

## LG017 Too many toolbar groups
- **Detect:** more than three groups in one bar.
- **Fix:** consolidate; overflow menu.

## Smells a reviewer catches by eye

- Glass fading in with opacity only (should materialise via lensing).
- Highlights that slide with scroll instead of with interaction/light.
- Hard-coded control heights after adopting 26 metrics.
- `UIDesignRequiresCompatibility` left on as a long-term plan (ignored for 27 SDK builds).
- Beta API spellings from WWDC25 sample code (`.containerRelative()`,
  `.rect(corner: .containerConcentric)`).
