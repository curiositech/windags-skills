# Sources

Read and verified 2026-10-01 unless noted. Developer documentation was read through the
docs JSON endpoint `https://developer.apple.com/tutorials/data/documentation/<path>.json`
(HIG: `.../tutorials/data/design/human-interface-guidelines/<page>.json`), which returns the
same content as the rendered pages.

## WWDC sessions

- WWDC25 356 *Get to know the new design system* — https://developer.apple.com/videos/play/wwdc2025/356/
- WWDC25 219 *Meet Liquid Glass* — https://developer.apple.com/videos/play/wwdc2025/219/
- WWDC25 323 *Build a SwiftUI app with the new design* — https://developer.apple.com/videos/play/wwdc2025/323/
- WWDC25 284 *Build a UIKit app with the new design* — https://developer.apple.com/videos/play/wwdc2025/284/
- WWDC25 310 *Build an AppKit app with the new design* — https://developer.apple.com/videos/play/wwdc2025/310/
- WWDC26 269 *What's new in SwiftUI* — https://developer.apple.com/videos/play/wwdc2026/269/
- WWDC26 251 *Communicate your brand identity on iOS* — https://developer.apple.com/videos/play/wwdc2026/251/

## Human Interface Guidelines

- Materials (change log: June 9, 2025; Sept 9, 2025) — https://developer.apple.com/design/human-interface-guidelines/materials
- Color, "Liquid Glass color" (Dec 16, 2025) — https://developer.apple.com/design/human-interface-guidelines/color
- Tab bars (June 8, 2026) — https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Toolbars (Dec 16, 2025) — https://developer.apple.com/design/human-interface-guidelines/toolbars
- Scroll views, scroll edge effects (June 8, 2026) — https://developer.apple.com/design/human-interface-guidelines/scroll-views
- Layout (Sept 9, 2026) — https://developer.apple.com/design/human-interface-guidelines/layout
- Sheets — https://developer.apple.com/design/human-interface-guidelines/sheets
- Motion — https://developer.apple.com/design/human-interface-guidelines/motion
- Accessibility — https://developer.apple.com/design/human-interface-guidelines/accessibility

## Developer documentation

- Adopting Liquid Glass — https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- Applying Liquid Glass to custom views — https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views
- Landmarks: Building an app with Liquid Glass — https://developer.apple.com/documentation/swiftui/landmarks-building-an-app-with-liquid-glass
- SwiftUI: `Glass`, `glassEffect(_:in:)`, `GlassEffectContainer`, `GlassEffectTransition`,
  `glassEffectID(_:in:)`, `glassEffectUnion(id:namespace:)`, `GlassButtonStyle`,
  `GlassProminentButtonStyle`, `backgroundExtensionEffect()`, `ScrollEdgeEffectStyle`,
  `scrollEdgeEffectStyle(_:for:)`, `scrollEdgeEffectHidden(_:for:)`,
  `tabBarMinimizeBehavior(_:)`, `tabViewBottomAccessory`, `ToolbarSpacer`,
  `sharedBackgroundVisibility(_:)`, `ConcentricRectangle`, `Edge.Corner.Style`,
  `containerShape(_:)`, `TabRole.prominent`, `ToolbarOverflowMenu`,
  `ToolbarItemPlacement.topBarPinnedTrailing`, `visibilityPriority(_:)` —
  https://developer.apple.com/documentation/swiftui
- UIKit: `UIGlassEffect`, `UIGlassEffect.Style`, `UIGlassContainerEffect`,
  `UICornerConfiguration`, `UICornerRadius`, `UIScrollEdgeEffect`,
  `UIScrollEdgeElementContainerInteraction`, `UIBackgroundExtensionView`, `UITabAccessory`,
  `UIBarButtonItem.Style.prominent`, `hidesSharedBackground`,
  `UIButton.Configuration.glass()` and siblings — https://developer.apple.com/documentation/uikit
- AppKit: `NSGlassEffectView`, `NSGlassEffectView.Style`, `NSGlassEffectContainerView`,
  `NSBackgroundExtensionView`, `NSButton.BezelStyle.glass`, `borderShape`,
  `tintProminence`, `NSControl.ControlSize.extraLarge`, `prefersCompactControlSizeMetrics`,
  `NSView.LayoutRegion`, `NSSplitViewItem.automaticallyAdjustsSafeAreaInsets`,
  `NSItemBadge` — https://developer.apple.com/documentation/appkit
- `UIDesignRequiresCompatibility` — https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility

## Web

- ybouane/liquidglass README — https://github.com/ybouane/liquidglass
- Demo — https://liquid-glass.ybouane.com/
- MDN `backdrop-filter` (Backdrop Root) — https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- MDN `prefers-reduced-transparency` — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency
- MDN browser-compat-data (support versions) — https://github.com/mdn/browser-compat-data
- Ekino, "Liquid Glass in CSS and SVG" (Chromium-only `backdrop-filter: url()`) — https://medium.com/ekino-france/liquid-glass-in-css-and-svg-839985fcb88d

## Secondary (user-facing setting)

- Tom's Guide on the iOS 26.1 Clear/Tinted setting — https://www.tomsguide.com/phones/iphones/ios-26-1-lets-you-adjust-liquid-glass-transparency-on-your-iphone-heres-how-to-do-it
- Macworld on iOS 26.1 beta 4 — https://www.macworld.com/article/2947565/ios-26-1-beta-4-does-the-unthinkable-you-can-control-how-glassy-liquid-glass-should-be.html

## Incident

- tough.trade clay-map spike (2026-09/10): many `backdrop-filter` HUD elements over a
  144 Hz WebGPU map made fixed chrome jitter on Mac Chrome. See `examples/web-map-hud-jitter.md`.
