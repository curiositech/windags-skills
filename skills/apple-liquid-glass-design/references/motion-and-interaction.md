# Motion and Interaction

## Behaviours to reproduce

| Behaviour | Apple description | Implementation hint |
|---|---|---|
| Materialize | Glass appears by "gradually modulating the light bending and lensing", not fading | Animate refraction strength and blur from 0, content opacity slightly later. SwiftUI `GlassEffectTransition.materialize`; UIKit animate `effectView.effect = UIGlassEffect()` (and `= nil` to dematerialize) inside `UIView.animate` |
| Morph | Moving between states, glass "dynamically morphs between the controls in each context", keeping a single floating plane | SwiftUI: same `GlassEffectContainer`, `glassEffectID(_:in:)` with a `@Namespace`, change hierarchy inside `withAnimation`; transition `.matchedGeometry` (default within container spacing) |
| Merge at rest | Nearby shapes blend like droplets | Container `spacing` larger than the layout spacing makes shapes merge at rest; `glassEffectUnion(id:namespace:)` forces a union |
| Interactive press | "flexing and energizing with light"; glow starts under the finger and spreads to nearby glass | `.interactive()` / `UIGlassEffect.isInteractive` / `NSGlassEffectView.effectIsInteractive` / `.buttonStyle(.glass)` |
| Gel flexibility | Elastic, moves with the gesture | System only; on web, a spring (stiffness ~300-400, damping ~25-30) on scale 1.0 → 1.04 and back |
| Pointer vs touch | Trackpad interaction is more subdued than touch (HIG Motion) | Lower the press scale and glow for mouse input on web (`pointerType`) |
| Origin | Menus, action sheets and sheets spring from their source control | Set `sourceItem` / `matchedTransitionSource` + `.navigationTransition(.zoom(...))`; `preferredTransition = .zoom { _ in barButtonItem }` |

## Container spacing, precisely

From *Applying Liquid Glass to custom views*: "The larger the spacing value on the
container, the sooner the Liquid Glass effects behind views blend together." If the
container spacing exceeds the stack's spacing, the shapes blend **at rest**. Morphing
between two shapes happens when the nearest edge distance is within the container spacing;
farther apart, use `.materialize`. `glassEffectID` and `glassEffectTransition` only affect
hierarchy transitions and animations.

Apply `glassEffect` **after** modifiers that change the view's appearance; it captures the
content it wraps.

## Reduce Motion

System glass "decreases the intensity of some effects and disables any elastic properties".
Custom glass must:

- Replace morphs with crossfades or instant swaps (`@Environment(\.accessibilityReduceMotion)`;
  `UIAccessibility.isReduceMotionEnabled`; CSS `@media (prefers-reduced-motion: reduce)`).
- Drop spring overshoot and device-motion-driven highlights.
- Keep state changes visible (opacity or colour), so feedback is not lost.

## Motion smells

- Glass that fades in with opacity only (looks like the old material).
- Morphs between elements in different containers (they cannot morph; they pop).
- Every element bouncing on every tap (interactive belongs on controls, not labels).
- Highlights that move with scroll position (they should follow light and interaction, not
  content).
