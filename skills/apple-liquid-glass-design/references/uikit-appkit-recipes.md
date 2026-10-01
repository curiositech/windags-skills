# UIKit and AppKit Recipes

Verified against developer.apple.com documentation JSON on 2026-10-01. Sources: WWDC25 284
*Build a UIKit app with the new design*, WWDC25 310 *Build an AppKit app with the new design*.

## UIKit (iOS/iPadOS/Mac Catalyst/tvOS 26)

### Custom glass

```swift
let effectView = UIVisualEffectView()
view.addSubview(effectView)

let glass = UIGlassEffect()            // UIGlassEffect(style: .clear) over media only
glass.isInteractive = true             // custom controls
glass.tintColor = .systemBlue          // primary action only
UIView.animate { effectView.effect = glass }      // materialize
// UIView.animate { effectView.effect = nil }     // dematerialize

effectView.cornerConfiguration = .capsule()
// effectView.cornerConfiguration = .corners(radius: .containerConcentric(minimum: 8))

let label = UILabel()
label.text = "Now Playing"
label.textColor = .secondaryLabel      // becomes vibrant automatically inside contentView
effectView.contentView.addSubview(label)
```

Put content in `contentView`, never as a sibling over the effect view.

### Grouping and morphing

```swift
let container = UIGlassContainerEffect()
container.spacing = 20                 // distance at which elements begin to merge
let containerView = UIVisualEffectView(effect: container)
// Nest UIVisualEffectViews configured with UIGlassEffect inside containerView.contentView.
```

### Bars

```swift
tabBarController.tabBarMinimizeBehavior = .onScrollDown
tabBarController.bottomAccessory = UITabAccessory(contentView: nowPlayingView)

navigationItem.rightBarButtonItems = [doneButton, flagButton, folderButton, infoButton,
                                      .fixedSpace(0), shareButton]   // fixedSpace splits groups
flagButton.tintColor = .systemOrange
doneButton.style = .prominent          // tinted primary action
avatarItem.hidesSharedBackground = true
navigationItem.subtitle = "49 Unread"
```

Image items group automatically; text items, Done/Close and prominent items get their own
backgrounds.

### Search

```swift
toolbarItems = [navigationItem.searchBarPlacementBarButtonItem, .flexibleSpace(), addButton]
navigationItem.searchBarPlacementAllowsExternalIntegration = true
navigationItem.preferredSearchBarPlacement = .integratedCentered   // iPad
searchTab.automaticallyActivatesSearch = true
```

### Presentations

```swift
vc.preferredTransition = .zoom { _ in folderBarButtonItem }
vc.popoverPresentationController?.sourceItem = barButtonItem
alert.popoverPresentationController?.sourceItem = barButtonItem   // action sheets originate here
```

### Buttons and sliders

```swift
button.configuration = .glass()
primary.configuration = .prominentGlass()
overVideo.configuration = .clearGlass()            // also .prominentClearGlass()

slider.trackConfiguration = .init(allowsTickValuesOnly: true, neutralValue: 0.2, numberOfTicks: 5)
slider.sliderStyle = .thumbless
```

### Scroll edge effects and background extension

```swift
scrollView.topEdgeEffect.style = .hard            // UIScrollEdgeEffect: style, isHidden
scrollView.bottomEdgeEffect.isHidden = true

let interaction = UIScrollEdgeElementContainerInteraction()   // custom floating bars
interaction.scrollView = contentScrollView
interaction.edge = .bottom
buttonsContainer.addInteraction(interaction)

let ext = UIBackgroundExtensionView()
ext.contentView = posterImageView
ext.automaticallyPlacesContentView = false
```

## AppKit (macOS 26)

### Custom glass

```swift
let glass = NSGlassEffectView()
glass.contentView = contentStack       // embed, do not overlay
glass.cornerRadius = 12                // compute concentrically from the container
glass.tintColor = .systemBlue          // emphasis only
glass.style = .regular                 // NSGlassEffectView.Style: .regular / .clear
// glass.effectIsInteractive = true    // macOS 27.0+

let group = NSGlassEffectContainerView()
group.contentView = stackOfGlassViews
group.spacing = 16                     // merge proximity; one sampling pass for the group
```

### Toolbars

```swift
item.isBordered = false                // remove the glass backing for this item
item.style = .prominent                // tint with accent (one primary)
item.backgroundTintColor = .systemGreen
item.badge = .count(4)                 // NSItemBadge: .count, .text("New"), .indicator
```

### Controls

```swift
button.bezelStyle = .glass
button.bezelColor = .systemBlue
button.borderShape = .capsule          // or .roundedRectangle
button.tintProminence = .secondary     // .automatic, .none, .secondary, .primary
button.controlSize = .extraLarge       // new size for emphasis
view.prefersCompactControlSizeMetrics = true   // keep pre-26 density where needed

slider.tintProminence = .secondary
slider.neutralValue = 1.0
```

### Layout under floating glass

```swift
let safe = layoutGuide(for: .safeArea(cornerAdaptation: .horizontal))  // NSView.LayoutRegion
splitViewItem.automaticallyAdjustsSafeAreaInsets = true                // content under sidebar

let ext = NSBackgroundExtensionView()
ext.contentView = heroImageView        // mirrors + blurs to fill under titlebar/sidebar
```

Remove custom `NSVisualEffectView`s inside popovers and custom toolbar backgrounds; they
conflict with system glass. Audit hard-coded control heights.

### Accessibility

`NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency`,
`.accessibilityDisplayShouldIncreaseContrast`, `.accessibilityDisplayShouldReduceMotion`;
observe `NSWorkspace.accessibilityDisplayOptionsDidChangeNotification` on
`NSWorkspace.shared.notificationCenter`.
