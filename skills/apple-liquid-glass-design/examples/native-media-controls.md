# Worked Example: Floating Controls Over Full-Screen Video (SwiftUI + UIKit)

Task: a video detail screen. Full-bleed video; floating close button top-leading; a
transport cluster (back 15 s, play/pause, forward 15 s) bottom-centre that expands to show
a speed control; a "Save" primary action.

## Decisions

| Element | Layer | Variant | Why |
|---|---|---|---|
| Video | content | none | It is the content |
| Close button | control | clear | Over media; dimming acceptable; white bold glyph |
| Transport cluster | control | clear | Same three conditions hold |
| Speed control (appears on expand) | control | clear, same container | Must morph out of the play button |
| Save | control | regular + tint (`.glassProminent`) | Primary action; text label; never mix with clear in one group, so it sits in its own group |
| Title/metadata sheet | control | system sheet | Let the system draw its glass |

Clear needs dimming over bright video: a 35% black gradient behind the bottom cluster and
behind the close button. If you use AVKit's standard playback controls instead, they bring
their own dimming and you skip this entirely (HIG Materials).

## SwiftUI

```swift
struct VideoChrome: View {
    @Namespace private var ns
    @State private var showSpeed = false
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ZStack(alignment: .bottom) {
            LinearGradient(colors: [.clear, .black.opacity(reduceTransparency ? 0.6 : 0.35)],
                           startPoint: .center, endPoint: .bottom)
                .ignoresSafeArea()
                .allowsHitTesting(false)

            GlassEffectContainer(spacing: 24) {
                HStack(spacing: 16) {
                    control("gobackward.15") { }
                    control(isPlaying ? "pause.fill" : "play.fill") { togglePlay() }
                        .glassEffectID("play", in: ns)
                    control("goforward.15") { }
                    if showSpeed {
                        control("gauge.with.dots.needle.67percent") { cycleSpeed() }
                            .glassEffectID("speed", in: ns)
                    }
                }
            }
            .padding(.bottom, 32)
        }
        .onLongPressGesture {
            if reduceMotion { showSpeed.toggle() }
            else { withAnimation(.bouncy) { showSpeed.toggle() } }
        }
    }

    private func control(_ symbol: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol)
                .font(.title2.weight(.semibold))          // bold, bright content for clear glass
                .foregroundStyle(.white)
                .frame(width: 56, height: 56)
        }
        .glassEffect(reduceTransparency ? .regular.interactive() : .clear.interactive(), in: .circle)
        .accessibilityLabel(Text(symbol))                 // use real labels in production
    }
}
```

Notes:
- All transport buttons are in **one** container, so play can morph into play+speed.
- Under Reduce Transparency, the clear variant is swapped for regular and the dimming
  deepens; the system then makes regular frostier on its own.
- Save lives elsewhere: `Button("Save") { }.buttonStyle(.glassProminent)` in the toolbar.

## UIKit equivalent (transport cluster)

```swift
let container = UIVisualEffectView(effect: {
    let c = UIGlassContainerEffect(); c.spacing = 24; return c
}())
for symbol in ["gobackward.15", "play.fill", "goforward.15"] {
    var config = UIButton.Configuration.clearGlass()
    config.image = UIImage(systemName: symbol,
                           withConfiguration: UIImage.SymbolConfiguration(textStyle: .title2, scale: .large))
    config.baseForegroundColor = .white
    let button = UIButton(configuration: config)
    stack.addArrangedSubview(button)
}
container.contentView.addSubview(stack)
```

## Verification

1. Screenshots over the brightest frame (snow, sky) and darkest frame, light and dark mode.
2. `glass_contrast_check.py frame.png --regions regions.json` with each glyph as
   `kind: glyph` (3:1) and the Save label as text (4.5:1).
3. Toggle Reduce Transparency, Increase Contrast, Reduce Motion; re-screenshot; the long-press
   expansion must still be discoverable without the morph.
