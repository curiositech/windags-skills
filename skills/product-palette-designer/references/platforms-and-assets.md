# Platform exports, assets, and contrast evidence

Checked against the linked primary sources on **2026-10-25**.
Load this reference when turning an approved product palette into platform tokens,
brand assets, or contrast evidence. Recheck version-sensitive APIs before export.
The examples demonstrate wiring; replace their colors with the approved palette.

## Preserve intent across color spaces

Keep the editable master in OKLCH and record lightness, chroma, hue, alpha,
semantic role, appearance, and intended foreground/background pair for each token.
OKLCH is useful for deliberate ramps; equal lightness steps do not guarantee equal
WCAG contrast or a usable ramp at every hue. Reduce chroma when the target gamut
cannot reproduce a color, then inspect the result rather than silently clipping.
See [CSS Color 4: OKLCH and conversion](https://www.w3.org/TR/css-color-4/#ok-lab).

| Destination | Deliver | Verify |
|---|---|---|
| Modern web | OKLCH CSS; explicit fallback where the actual browser support target needs it | Browser-computed styles, gamut, and compositing |
| Apple | Named asset-catalog colors with declared sRGB or Display P3 components | Appearance, accessibility contrast, and color-managed rendering |
| Android Compose | `Color` values and complete light/dark `ColorScheme` mappings | Actual Material component roles and dynamic-color policy |
| React Native | Supported concrete color values, plus platform adaptation if wanted | Both native renderers and appearance changes |
| Raster/print | Profile-tagged exports made for the destination | Converted output, transparency, crop, and physical proof where needed |

CSS `oklch(...)` is not a native Swift, Kotlin, or React Native color literal.
Convert through a color-managed implementation and label the resulting color
space. Display P3 triples and sRGB triples are not interchangeable. Keep approved
sRGB equivalents alongside any P3 enhancement; do not relabel P3 numbers as sRGB.
Use [Apple's color guidance](https://developer.apple.com/design/human-interface-guidelines/color)
and [CSS conversion/gamut rules](https://www.w3.org/TR/css-color-4/#color-conversion-code).

## Tailwind CSS v4: values and aliases have different jobs

Use top-level `@theme` for tokens that should create Tailwind utilities.
Ordinary `:root` properties alone do not create utilities. Use `@theme inline`
when a Tailwind theme token aliases another custom property: generated utilities
then use that property's value directly, avoiding resolution at an unexpected
ancestor scope. Keep appearance overrides in selectors, outside `@theme`.
See [theme variables](https://tailwindcss.com/docs/theme#referencing-other-variables).

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

/* A fixed primitive can create bg-brand-ink, text-brand-ink, etc. */
@theme {
  --color-brand-ink: oklch(0.24 0.03 250);
}

:root {
  color-scheme: light;
  --background: oklch(0.99 0.005 95);
  --foreground: oklch(0.23 0.02 250);
  --primary: oklch(0.45 0.12 250);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.39 0.11 250);
  --ring: oklch(0.45 0.12 250);
}
.dark {
  color-scheme: dark;
  --background: oklch(0.18 0.02 250);
  --foreground: oklch(0.96 0.01 95);
  --primary: oklch(0.78 0.10 250);
  --primary-foreground: oklch(0.18 0.02 250);
  --primary-hover: oklch(0.84 0.08 250);
  --ring: oklch(0.78 0.10 250);
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-ring: var(--ring);
}
```

This is a wiring example, not a complete shadcn theme or a verified palette.
Every custom property it reads is defined above. A button could use:

```html
<button class="bg-primary text-primary-foreground hover:bg-primary-hover
               focus-visible:outline-2 focus-visible:outline-offset-2
               focus-visible:outline-ring">Continue</button>
```

The custom variant makes `dark:*` follow `.dark`; changing semantic variables
already updates `bg-background` and similar utilities without a `dark:` duplicate.
A class-based implementation must synchronize system preference and user choice
before first paint. Tailwind's default dark variant instead follows the media
query. See [dark-mode selectors](https://tailwindcss.com/docs/dark-mode).

## shadcn/ui: export the actual component contract

Inspect the installed/generated components and their CSS before producing tokens.
The [current theming contract](https://ui.shadcn.com/docs/theming) uses these
families; deliver values for every used role in both light and dark appearances.
This table is an inventory, not permission to leave unresolved aliases.

| Core token names | Palette responsibility |
|---|---|
| `background`, `foreground` | Page canvas and default content |
| `card`, `card-foreground` | Card surfaces and their content |
| `popover`, `popover-foreground` | Floating surfaces and their content |
| `primary`, `primary-foreground` | Main action surface and its content |
| `secondary`, `secondary-foreground` | Supporting action surface and content |
| `muted`, `muted-foreground` | Quiet surface and lower-emphasis content |
| `accent`, `accent-foreground` | Interactive highlight surface and content |
| `destructive` | Destructive/error emphasis; inspect the component's text treatment |
| `border`, `input`, `ring` | Dividers, form control treatment, and focus |
| `chart-1` through `chart-5` | Default chart series slots |
| `sidebar`, `sidebar-foreground` | Sidebar canvas and default content |
| `sidebar-primary`, `sidebar-primary-foreground` | Sidebar emphasis and content |
| `sidebar-accent`, `sidebar-accent-foreground` | Sidebar interaction highlight and content |
| `sidebar-border`, `sidebar-ring` | Sidebar separators and focus |

Current documentation does not guarantee `destructive-foreground`. Some generated
or older component sets consume it; define it when the actual code does. Never
remove a consumed role merely to match a newer documentation example. Map every
consumed semantic property to its corresponding Tailwind `--color-*` alias.
`radius` and derived radius tokens are separate geometry, not palette colors.

Add these **project extensions** when required; shadcn does not wire them all for you:

- Success, warning, and info: foreground/emphasis plus a subtle surface and its
  readable foreground; add a border/icon role if the design uses one.
- Interaction: hover, pressed, selected, visited link, disabled, invalid, and
  loading colors where a shared semantic role does not cover the actual state.
- Chart additions: more series, sequential/diverging scales, grid, axes, labels,
  and selection; a five-color categorical set does not solve every chart.

Give extensions explicit names and component mappings. For example, the CSS above
adds `primary-hover`; the component must actually use `hover:bg-primary-hover`.
Do not assume a token alone changes behavior, or create unused state tokens.
Do not derive disabled text by a global opacity rule without checking its final
appearance. Disabled controls have WCAG contrast exceptions, but still need to be
recognizable. Test every enabled state and actual foreground/surface combination.

## Apple: named adaptive colors, not copied CSS strings

Create semantic Color Sets in `Assets.xcassets`, with Any and Dark appearances;
add High Contrast variants when the design needs stronger separation. Use an
explicit Light slot only when the deployment/design needs it; Any is the fallback.
Name roles such as `Canvas`, `ContentPrimary`, and `ActionPrimary`, so callers keep
semantic meaning. Xcode supports high-contrast color variants; see
[app color scheme](https://developer.apple.com/documentation/xcode/specifying-your-apps-color-scheme)
and [appearance assets](https://help.apple.com/xcode/mac/current/en.lproj/dev7a4aebe73.html).

For a minimal demonstration, define a `Canvas` Color Set in **sRGB** with:

| Slot | Demonstration value |
|---|---|
| Any, normal contrast | `#FAFAFA` |
| Dark, normal contrast | `#1B1B1B` |
| Any, high contrast | `#FFFFFF` |
| Dark, high contrast | `#000000` |

Then load the same named asset through the relevant framework:

```swift
import SwiftUI
let canvas = Color("Canvas", bundle: .main)

#if canImport(UIKit)
import UIKit
let uiCanvas = UIColor(named: "Canvas", in: .main, compatibleWith: nil)
#endif

#if canImport(AppKit)
import AppKit
let nsCanvas = NSColor(named: NSColor.Name("Canvas"), bundle: .main)
#endif
```

Use the asset's actual bundle for packages/frameworks. UIKit/AppKit lookups are
optional: validate asset membership and handle a missing resource deliberately.
Keep adaptive colors adaptive; resolving/caching raw RGB or `CGColor` too early
can freeze an appearance. Verify light/dark and increased contrast at runtime.
API sources: [SwiftUI](https://developer.apple.com/documentation/swiftui/color/init(_:bundle:)),
[UIKit](https://developer.apple.com/documentation/uikit/uicolor/init(named:in:compatiblewith:)),
and [AppKit](https://developer.apple.com/documentation/appkit/nscolor/init(named:bundle:)).

Export sRGB components for normal cross-platform delivery. If wide color is part
of the approved direction, add separately converted Display P3 assets with their
profile/color-space metadata. Inspect the P3 version on suitable hardware and
its sRGB conversion for hue shifts, flattened gradients, and merged status colors.
Apple recommends color profiles and supports gamut-specific asset variations in
[its color guidance](https://developer.apple.com/design/human-interface-guidelines/color).

## Android Compose Material 3: choose the color authority

Decide explicitly whether the app follows user-personalized dynamic color or the
bespoke brand scheme. Android 12+ dynamic color can supply the scheme instead of
your authored one; a template's enabled setting can explain a disappearing brand.
With dynamic color enabled, still supply complete branded light/dark fallbacks.
With bespoke branding selected, route to the authored schemes intentionally.
See [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3).

Map the approved palette to Material roles rather than calling every accent
`primary`: primary/secondary/tertiary and their `on*`/container pairs, error pairs,
surface and on-surface roles, surface-container levels, outline roles, inverse
roles, scrim, and relevant fixed-color roles. Verify the API version's complete
`ColorScheme`; omitted defaults can reintroduce unrelated colors. Keep custom
success/warning/info roles in an explicit theme extension if the product needs them.

Concrete sRGB export syntax uses Android/Compose **AARRGGBB** ordering:

```kotlin
import androidx.compose.ui.graphics.Color
val exportedInk = Color(0xFF1B1B1B)
```

Use `lightColorScheme` / `darkColorScheme` to build full schemes, pass the selected
one to `MaterialTheme(colorScheme = ...)`, and let components consume their roles.
Inspect tonal elevation and state layers on real components: a supplied token may
be composited or used to tint another surface. Check branded and dynamic modes,
light/dark, Android versions, and system bars in rendered output.

## React Native: export supported values deliberately

Export named semantic light/dark objects using supported hex/RGB representations;
do not paste CSS custom properties or assume OKLCH support from a web renderer.
React Native color integers use **RRGGBBAA**, unlike Android's AARRGGBB.
See [the color reference](https://reactnative.dev/docs/colors).

```ts
export const palette = {
  light: { canvas: "#FAFAFA", content: "#1B1B1B" },
  dark: { canvas: "#1B1B1B", content: "#FAFAFA" },
} as const;
```

Select with the app's appearance mechanism. For iOS-specific adaptation,
`DynamicColorIOS` accepts light/dark and optional highContrastLight/highContrastDark
values; keep it on the iOS path. `PlatformColor` is useful when system semantic
colors are the intended authority. Neither replaces a deliberately authored brand
export. Verify native views, not just a web preview. Sources:
[DynamicColorIOS](https://reactnative.dev/docs/dynamiccolorios),
[PlatformColor](https://reactnative.dev/docs/platformcolor).

## Asset use matrix: approve each adaptation

| Use | Required palette decision and export | Validation |
|---|---|---|
| Primary logo | Full-color vector master; approved light/dark substrates | Small/large placement, edges, clear space |
| Monochrome logo | True single-color artwork, not automatic grayscale | One-ink production and tiny detail |
| Reversed logo | Explicit light mark for a specified dark field | Counters, optical weight, no accidental transparency |
| Favicon | Simplified small-size mark; SVG/ICO/PNG as target needs | Actual tab rendering at 16/32 px and dark browser chrome |
| App icon | Platform-specific layers, masks, variants, and source assets | Launcher/Dock/home-screen rendering at actual sizes |
| Social / Open Graph | Intentional image composition with safe crop area | Real previews, image URL, crop, small text, sRGB output |
| Email | Conservative sRGB artwork and a deliberate background pairing | Light/dark clients, images blocked, transparency |
| Print | Vector source plus printer-agreed profile/CMYK or spot-color spec | Soft proof and physical proof on the actual stock |

App icons are not simply resized logos. Consult current target tooling:
[Apple Icon Composer](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer)
and [Android adaptive icons](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive)
(including foreground/background and monochrome themed-icon handling).
For social images, **1200×630** landscape and **1200×1200** square are useful
briefing examples, not universal requirements. The [Open Graph protocol](https://ogp.me/)
defines image metadata and optional width/height, not one mandatory canvas size.
Check each chosen network's current limits and preview behavior before delivery.

Never infer print colors from hex alone: record the output profile, paper, and
proofing agreement. For all raster exports, retain metadata and verify the actual
encoded color space. Inspect P3-to-sRGB conversion in a color-managed viewer;
changing a profile tag is not conversion. Recheck contrast in the converted output.

## Accessibility: measure pairs after rendering decisions

For WCAG 2.2 AA, evaluate the following as separate tests:

| Content | Threshold / scope | Primary source |
|---|---|---|
| Normal text, including placeholder/help text | At least 4.5:1 against its background | [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) |
| Large text | At least 3:1; at least 18 pt regular or 14 pt bold (24 / about 18.67 CSS px) | [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) |
| Required control/state cues and meaningful graphics | At least 3:1 against adjacent colors, subject to criterion exceptions | [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |

Use the final composited foreground and background, including opacity, overlays,
gradients, images, state layers, and surface tint. Resolve them in their actual
compositing color space, then convert the resulting colors to sRGB and linearize
the sRGB channels for WCAG relative luminance; never use OKLCH L as luminance.
With normalized opaque sRGB channels, linearize each channel `c` as
`c / 12.92` when `c <= 0.04045`, otherwise `((c + 0.055) / 1.055) ** 2.4`.
Then `Y = 0.2126R + 0.7152G + 0.0722B`, and contrast is
`(max(Y1, Y2) + 0.05) / (min(Y1, Y2) + 0.05)`.
See [WCAG's definitions](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance).
Do not round a failing ratio up to a pass. Record worst-case pairings, not just
one convenient pixel in a gradient. Use specified/computed colors for formal
checks; anti-aliased edge pixels are not the nominal text color being tested.

Separate focus requirements: **2.4.7 Focus Visible (AA)** requires visible keyboard
focus; **1.4.11 (AA)** covers required focus-state contrast against adjacent colors.
**2.4.11 Focus Not Obscured (Minimum) (AA)** concerns a focused component being
entirely hidden by author content. **2.4.13 Focus Appearance (AAA)** adds an area
at least equivalent to a 2 CSS px perimeter and 3:1 change between the same pixels
in focused/unfocused states, with its specified exceptions. Do not report that
AAA area rule as the WCAG 2.2 AA requirement. Sources:
[focus visibility](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html),
[obscuration](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum),
[focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).

Use text, icons, patterns, or position in addition to hue for statuses and charts;
see [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
CVD simulations and grayscale previews expose potential ambiguity; neither is
certification or a substitute for contrast checks and actual user evaluation.
APCA can be recorded as an experimental supplementary assessment, with algorithm
version and assumptions. It does not replace WCAG 2 contrast for conformance;
the [WCAG 3 draft](https://www.w3.org/TR/wcag3/) has not settled its contrast algorithm.

Keep evidence for each requested platform: token/version inventory, representative
light/dark renders, increased-contrast results where supported, actual interaction
states, and a pairwise contrast report with context and pass/fail. Check original
and sRGB-converted screenshots; confirm profiles before comparing pixels. A swatch
sheet alone cannot prove contrast on translucent controls or exported artwork.
