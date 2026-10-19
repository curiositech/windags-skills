# SwiftUI Recipes

All symbols verified against developer.apple.com documentation JSON on 2026-10-01.
Availability is iOS/iPadOS/macOS/tvOS/watchOS 26.0 unless marked. Sources: WWDC25 323
*Build a SwiftUI app with the new design*, *Applying Liquid Glass to custom views*,
*Landmarks: Building an app with Liquid Glass*, WWDC26 269 *What's new in SwiftUI*.

## 0. Before writing any glass

1. Build with the current Xcode; look at what standard components already do.
2. Remove `.toolbarBackground(...)` fills, custom bar backgrounds, `presentationBackground`
   used only to fake frosted material, and darkening layers behind sheets.
3. Only then add custom glass.

`UIDesignRequiresCompatibility` (Info.plist) temporarily keeps the old look on 26; it is
ignored when building for 27 SDKs. Do not plan around it.

## 1. Structure

```swift
NavigationSplitView {
    Sidebar()                          // floating glass sidebar, no custom background
} detail: {
    Detail()
}
.inspector(isPresented: $showInspector) { Inspector() }
.searchable(text: $query)              // on the split view = whole-hierarchy search
```

Hero art under the sidebar:

```swift
Image(landmark.backgroundImageName)
    .resizable()
    .aspectRatio(contentMode: .fill)
    .backgroundExtensionEffect()       // mirrored + blurred copies fill the safe-area edges
```

Use it on one background view, not many (docs: "Apply this modifier with discretion").
It clips the view. Keep text and controls above it.

## 2. Tabs

```swift
TabView {
    Tab("Home", systemImage: "house") { Home() }
    Tab("Library", systemImage: "books.vertical") { Library() }
    Tab(role: .search) { NavigationStack { SearchView() } }
}
.searchable(text: $query)
.tabBarMinimizeBehavior(.onScrollDown)
.tabViewBottomAccessory { NowPlaying() }             // iOS 26
// .tabViewBottomAccessory(isEnabled: isPlaying) { NowPlaying() }   // iOS 26.1+

struct NowPlaying: View {
    @Environment(\.tabViewBottomAccessoryPlacement) var placement
    var body: some View {
        if placement == .inline { CompactPlayer() } else { FullPlayer() }
    }
}
```

27 releases: `Tab(role: .prominent) { Cart() }` gives a distinguished bottom-trailing tab.

## 3. Toolbars

```swift
.toolbar {
    ToolbarItem { ShareLink(item: url) }
    ToolbarSpacer(.fixed)                         // new group
    ToolbarItem { FavoriteButton() }
    ToolbarItem { CollectionsButton() }
    ToolbarSpacer(.fixed)
    ToolbarItem { InspectorToggle() }
}

// Bottom bar with search pushed to the trailing group
.toolbar {
    ToolbarItem(placement: .bottomBar) { FilterPicker() }
    ToolbarSpacer(.flexible, placement: .bottomBar)
    DefaultToolbarItem(kind: .search, placement: .bottomBar)
    ToolbarSpacer(.fixed, placement: .bottomBar)
    ToolbarItem(placement: .bottomBar) { NewMessageButton() }
}

// An avatar that should not sit on the shared glass
ToolbarItem { ProfileButton() }.sharedBackgroundVisibility(.hidden)

// Badges
Button("Notifications", systemImage: "bell") { }.badge(count)
```

27 releases (verify in your SDK): `.visibilityPriority(.high)` on a toolbar item group,
`ToolbarOverflowMenu { ... }`, `ToolbarItem(placement: .topBarPinnedTrailing)`, and a
`toolbarMinimizeBehavior(.onScrollDown, for: .navigationBar)` modifier shown in WWDC26 269
(its documentation page was not resolvable on 2026-10-01; confirm the signature in Xcode).

Primary action: one, trailing, `.buttonStyle(.glassProminent)` or a confirm role, so it tints.

## 4. Sheets and presentations

```swift
@Namespace private var ns

.toolbar {
    ToolbarItem(placement: .bottomBar) {
        Button { show = true } label: { Image(systemName: "map") }
            .matchedTransitionSource(id: "map", in: ns)
    }
}
.sheet(isPresented: $show) {
    MapSheet()
        .presentationDetents([.height(180), .medium, .large])
        .navigationTransition(.zoom(sourceID: "map", in: ns))
}
```

Let the system draw the sheet's glass. Add `presentationBackground` only for a real need.

## 5. Scroll edge effects

```swift
ScrollView { Rows() }
    .scrollEdgeEffectStyle(.hard, for: .top)     // .automatic (default), .soft, .hard
ScrollView { Rows() }
    .scrollEdgeEffectHidden(true, for: .bottom)  // when nothing floats there
```

## 6. Buttons and controls

```swift
Button("Get Started") { }.buttonStyle(.glassProminent)   // tinted with accent
Button("Learn More") { }.buttonStyle(.glass)
Button("Shuffle") { }.buttonStyle(GlassButtonStyle(.clear))  // init(_ glass:) is 26.1+

Picker("Mode", selection: $mode) { ... }.controlSize(.large)
Inspector().controlSize(.small)                   // density on macOS
Button("Done") { }.buttonBorderShape(.capsule)
```

## 7. Custom glass

```swift
Label("Desert", systemImage: "sun.max.fill")
    .padding()
    .glassEffect()                                    // .regular, capsule
    // .glassEffect(in: .rect(cornerRadius: 16))
    // .glassEffect(.regular.tint(.green))            // emphasis only
    // .glassEffect(.regular.interactive())           // custom controls
    // .glassEffect(.clear)                           // over media, with dimming:

Label("Flag", systemImage: "flag.fill")
    .padding()
    .glassEffect(.clear)
    .background(.black.opacity(0.3))                  // Apple's own docs example for clear
```

`glassEffect(_:in:)` signature: `glassEffect(_ glass: Glass = .regular, in shape: some Shape
= DefaultGlassEffectShape())`. `Glass` members: `.regular`, `.clear`, `.identity`,
`tint(_:)`, `interactive(_:)`.

Apply `glassEffect` after other appearance modifiers; it captures the wrapped content.

## 8. Containers, unions, morphs

```swift
@Namespace private var ns
@State private var expanded = false

GlassEffectContainer(spacing: 40) {
    HStack(spacing: 40) {
        Image(systemName: "scribble.variable")
            .frame(width: 80, height: 80)
            .glassEffect()
            .glassEffectID("pencil", in: ns)
        if expanded {
            Image(systemName: "eraser.fill")
                .frame(width: 80, height: 80)
                .glassEffect()
                .glassEffectID("eraser", in: ns)
                .glassEffectTransition(.matchedGeometry)   // or .materialize when far apart
        }
    }
}
Button("Toggle") { withAnimation { expanded.toggle() } }.buttonStyle(.glass)

// Several views as one shape at rest (same shape + same variant + same id)
ForEach(items.indices, id: \.self) { i in
    Icon(items[i]).glassEffect().glassEffectUnion(id: i < 2 ? "a" : "b", namespace: ns)
}
```

One container for all nearby custom glass. Separate containers cannot morph into each other
and each costs its own sampling pass.

## 9. Concentric shapes

```swift
CustomControl().background(.tint, in: ConcentricRectangle())
Card().background(.regularMaterial, in: .rect(corners: .concentric(minimum: 8), isUniform: true))
Container().containerShape(.rect(cornerRadius: 28))
```

## 10. Accessibility hooks

```swift
@Environment(\.accessibilityReduceTransparency) var reduceTransparency
@Environment(\.colorSchemeContrast) var contrast
@Environment(\.accessibilityReduceMotion) var reduceMotion
@Environment(\.appearsActive) var appearsActive   // dim custom chrome in inactive windows
```

System glass handles itself; use these for your own overlays, dimming layers and animations.
