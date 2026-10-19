# Platform Timeline (what shipped when)

Dates from Apple developer docs availability metadata and session pages, read 2026-10-01.

| Release | Liquid Glass changes relevant to builders |
|---|---|
| WWDC25 (June 9, 2025); iOS/iPadOS/macOS/tvOS/watchOS 26.0 | Liquid Glass introduced. `glassEffect(_:in:)`, `Glass` (`.regular`, `.clear`, `.identity`, `tint`, `interactive`), `GlassEffectContainer`, `glassEffectID`, `glassEffectUnion`, `GlassEffectTransition`, `.glass` / `.glassProminent`; `UIGlassEffect` (`.regular`/`.clear`), `UIGlassContainerEffect`, `UIButton.Configuration.glass()/prominentGlass()/clearGlass()/prominentClearGlass()`, `UICornerConfiguration`; `NSGlassEffectView` (`style`, `cornerRadius`, `tintColor`), `NSGlassEffectContainerView`; scroll edge effects; `backgroundExtensionEffect` / `UIBackgroundExtensionView` / `NSBackgroundExtensionView`; tab bar minimise and bottom accessory; `ToolbarSpacer`, `sharedBackgroundVisibility`; `ConcentricRectangle`; `UIDesignRequiresCompatibility` opt-out |
| Sept 2025 HIG update | Materials guidance updated: regular vs clear usage, 35% dimming layer guidance |
| iOS 26.1 (autumn 2025) | User setting Settings → Display & Brightness → Liquid Glass: Clear or Tinted (Tinted "increases opacity and adds more contrast"). `GlassButtonStyle.init(_ glass:)` and `tabViewBottomAccessory(isEnabled:content:)` appear at 26.1 |
| Dec 16, 2025 HIG update | Liquid Glass color, tab bars, toolbars guidance updated |
| macOS 26.1 | `ToolbarContent.visibilityPriority(_:)` available on macOS |
| WWDC26 (June 8, 2026); 27 releases | Refreshed Liquid Glass look with improved readability, applied without code changes; a user Liquid Glass slider adjusts tint; Liquid Glass is mandatory (compatibility key ignored for 27 SDK builds); `Tab(role: .prominent)`, `ToolbarOverflowMenu`, `.topBarPinnedTrailing`, `visibilityPriority`, `toolbarMinimizeBehavior(_:for:)` (session 269); `NSGlassEffectView.effectIsInteractive` (macOS 27); inactive iPad windows dim like Mac (`appearsActive`); scroll edge effect guidance updated |

## Renamed between WWDC25 betas and release

| Beta (session code) | Shipped |
|---|---|
| `.background(.tint, in: .rect(corner: .containerConcentric))` | `ConcentricRectangle()` / `.rect(corners: .concentric(minimum:), isUniform:)` |
| `effectView.cornerConfiguration = .containerRelative()` | `.corners(radius: .containerConcentric(minimum:))` |
| `.fixed(8)` corner config | `.uniformCorners(radius: .fixed(8))` / `.corners(radius: .fixed(8))` |

## Version gating

```swift
if #available(iOS 26, macOS 26, *) {
    content.glassEffect()
} else {
    content.background(.ultraThinMaterial, in: Capsule())
}
```

For apps supporting iOS 18 and earlier, keep the fallback visually quiet (thin material,
capsule) rather than imitating glass with custom blur; users on old OSes expect old chrome.
