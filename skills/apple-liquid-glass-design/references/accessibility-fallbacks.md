# Accessibility Fallbacks

System Liquid Glass adapts automatically (WWDC25 219):

| Setting | System glass becomes |
|---|---|
| Reduce Transparency | "frostier", obscures more of the content behind |
| Increase Contrast | "predominantly black or white", with a contrasting border |
| Reduce Motion | reduced intensity of some effects, no elastic properties |

Additionally, since iOS 26.1 people can choose a preferred look for Liquid Glass in Settings
(clear or tinted), and the 27 releases add a Liquid Glass slider that adjusts glass tint
(WWDC26 *What's new in SwiftUI*). System and `glassEffect` glass follow these automatically.
Anything you render yourself (Metal, web) does not.

## Native: custom content on or near glass

```swift
@Environment(\.accessibilityReduceTransparency) private var reduceTransparency
@Environment(\.colorSchemeContrast) private var contrast        // .increased when on
@Environment(\.accessibilityReduceMotion) private var reduceMotion

var dimming: Double { reduceTransparency ? 0.6 : 0.35 }
```

UIKit: `UIAccessibility.isReduceTransparencyEnabled`,
`UIAccessibility.isReduceMotionEnabled`, `UIAccessibility.isDarkerSystemColorsEnabled`
(Increase Contrast), with the matching `...StatusDidChangeNotification`s; or
`traitCollection.accessibilityContrast == .high`.

AppKit: `NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency`,
`...ShouldIncreaseContrast`, `...ShouldReduceMotion`, and
`NSWorkspace.accessibilityDisplayOptionsDidChangeNotification`.

Rules for your own pixels over glass:

- Custom colours need light, dark, and increased-contrast variants (HIG Color).
- Do not suppress system fallbacks by drawing an opaque custom background that ignores them.
- Under Reduce Transparency, clear-variant overlays should get a stronger dimming layer or
  switch to regular.

## Web: you implement all of it

```css
/* default glass */
.glass { --glass-blur: 8px; --glass-fill: rgb(255 255 255 / 0.10); --glass-border: transparent; }

@media (prefers-reduced-transparency: reduce) {   /* Chromium 118+; NOT Safari; Firefox behind a pref */
  .glass { --glass-blur: 24px; --glass-fill: rgb(245 245 247 / 0.92); }
}
@media (prefers-contrast: more) {                  /* Chrome 96, Firefox 101, Safari 14.1 */
  .glass { --glass-fill: rgb(255 255 255 / 0.97); --glass-border: #000; color: #000; }
}
@media (prefers-contrast: more) and (prefers-color-scheme: dark) {
  .glass { --glass-fill: rgb(0 0 0 / 0.97); --glass-border: #fff; color: #fff; }
}
@media (prefers-reduced-motion: reduce) {
  .glass { transition: none; }
}
/* in-app override, because Safari (the browser most Apple users run) cannot report
   Reduce Transparency to the page */
:root[data-glass="solid"] .glass { --glass-blur: 0px; --glass-fill: var(--surface-solid); }
```

Browser support (MDN browser-compat-data, read 2026-10-01): `prefers-reduced-transparency`
Chrome 118, Firefox 113 behind `layout.css.prefers-reduced-transparency.enabled`, Safari not
supported. `prefers-contrast` Chrome 96 / Firefox 101 / Safari 14.1. `prefers-reduced-motion`
Chrome 74 / Firefox 63 / Safari 10.1.

Consequence: on Safari you cannot detect Reduce Transparency. Ship a visible
"Solid chrome" / "Reduce transparency" toggle, persist it, and default it on when
`prefers-contrast: more` matches.

GPU route: pass uniforms `uReduceTransparency`, `uIncreaseContrast`, `uReduceMotion` from the
same media queries/toggle. Under reduce transparency: raise blur to the top mip, set
backdrop mix to >= 0.85 toward a solid surface colour, kill refraction and chroma. Under
increase contrast: solid black/white panel plus a 1-2 px contrasting border, labels pure
white/black. Under reduce motion: no animated specular, no spring.

## Verification

Screenshot every glass surface with each setting on, light and dark. On macOS:
System Settings → Accessibility → Display. iOS Simulator: Settings app, or Xcode's
Environment Overrides panel. Chrome DevTools → Rendering → "Emulate CSS media feature"
covers `prefers-reduced-transparency`, `prefers-contrast`, `prefers-reduced-motion`.
Then run `scripts/glass_contrast_check.py` on each.
