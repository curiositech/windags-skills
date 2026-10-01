# Shape and Concentricity

Source: WWDC25 356 *Get to know the new design system*; `ConcentricRectangle`,
`UICornerConfiguration` docs.

## Three shape types

| Type | Definition | Where |
|---|---|---|
| Fixed | Constant radius | Small elements far from any container corner |
| Capsule | Radius = half the height | Buttons, sliders, switches, bars, grouped table corners; default glass shape on iOS |
| Concentric | Radius = parent radius - padding (shared centre) | Anything nested near a container corner: cards in sheets, buttons in bars, panels in windows |

"Keep an eye out for corners that feel too pinched — or flared." Pinched: inner radius too
large for its inset (corner bulges toward the parent). Flared: inner radius too small (the
gap widens at the corner).

## The arithmetic

```
r_inner = max(r_outer - inset, r_min)
```

Use `r_min` (Apple's `concentric(minimum:)`) so a deep inset never collapses to a square
corner on a square-cornered device. Tolerance in review: within 2 px.

Example: sheet radius 34, content inset 16 → card radius 18. Card inset 12 → button
radius 6 or capsule if the button is short enough that capsule radius < 6 + slack.

## Platform specifics

- iOS/iPadOS: capsules for touch layouts.
- macOS: mini, small, medium controls are rounded rectangles (density); large and the new
  extra-large are capsules. Windows scale their corner radius to wrap glass toolbars and
  sidebars.
- Do not hard-code control heights; sizes changed in 26 and adapt per platform. AppKit
  offers `prefersCompactControlSizeMetrics` for dense layouts that need the old metrics.

## APIs (verified against developer.apple.com docs JSON, 2026-10-01)

SwiftUI:

```swift
// Concentric to the nearest container shape (sheet, window, or containerShape you set)
CustomCard()
    .background(.tint, in: ConcentricRectangle())

// Concentric with a floor so it never goes square
CustomCard()
    .background(.regularMaterial, in: .rect(corners: .concentric(minimum: 8), isUniform: true))

// Declare a container shape for custom containers
VStack { ... }
    .containerShape(.rect(cornerRadius: 28))

// Glass in a non-capsule shape
Label("Desert", systemImage: "sun.max.fill")
    .padding()
    .glassEffect(in: .rect(cornerRadius: 16))

// Explicit button shape
Button("Done") { }.buttonBorderShape(.capsule)
```

`ConcentricRectangle` corner styles come from `Edge.Corner.Style`: `.concentric`,
`.concentric(minimum:)`, `.fixed(_:)`; uniform variants exist for top/bottom/leading/trailing
pairs (for example a format sheet with fixed top corners and concentric bottom corners).

UIKit:

```swift
effectView.cornerConfiguration = .corners(radius: .containerConcentric(minimum: 8))
effectView.cornerConfiguration = .capsule()           // capsule(maximumRadius:) also exists
effectView.cornerConfiguration = .uniformCorners(radius: .fixed(12))
```

AppKit: `NSGlassEffectView.cornerRadius` (single value). Compute it concentrically yourself
from the window/container radius and inset. WWDC26 *Modernize your AppKit app* asks
explicitly to "make view and button corners concentric".

Web: CSS has no concentric primitive. Compute radii in tokens (`templates/glass-tokens.css`)
or in JS from the container's computed `border-radius` minus padding. For capsules use
`border-radius: 9999px` (and in a GPU SDF, `r = min(w, h) / 2`).

## Renamed betas to watch for

WWDC25 session code used `.rect(corner: .containerConcentric)` and
`cornerConfiguration = .containerRelative()`. The shipped names are above. If you see the
beta spellings in old code or tutorials, translate them.
