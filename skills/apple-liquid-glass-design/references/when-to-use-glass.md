# When To Use Liquid Glass (and When Not To)

## The two-layer model

Apple's interfaces since iOS/macOS 26 are two layers:

- **Content layer**: what the app is about. Photos, maps, documents, lists, cards,
  full-bleed brand color, 3D. Brand expression lives here (WWDC26 *Communicate your brand
  identity on iOS*: move color "into the content area of your app").
- **Control layer**: tab bars, toolbars, sidebars, sheets, popovers, menus, floating
  buttons. This layer is Liquid Glass. It floats, it is sparse, it is mostly monochrome.

HIG Materials: "Don't use Liquid Glass in the content layer." Content uses the standard
materials (ultra-thin, thin, regular, thick) or solid fills. The only sanctioned exception
is transient: sliders and toggles in content turn to glass while being manipulated.

### Classification cues (what an expert looks at)

| Cue | Layer |
|---|---|
| Scrolls with the content | Content |
| Stays put while content scrolls beneath | Control |
| Represents data (a card, a row, a tile, a pin on a map) | Content |
| Represents an action or navigation (back, share, filter, tabs, search) | Control |
| Would be repeated N times for N items | Content (glass per item is a smell) |
| Exists once per screen or once per app | Control candidate |

Near miss: a floating "Add" button over a list is control layer (glass). The list rows are
content (no glass). A map pin is content even though it floats over the map; a map's
zoom/locate cluster is control.

## Use system components first

System bars, sheets, popovers, menus and button styles adopt glass automatically and get
accessibility fallbacks, adaptivity, morphing, and scroll edge behaviour for free.
*Adopting Liquid Glass*: "Reduce your use of custom backgrounds in controls and navigation
elements." Old customisations (solid toolbar fills, extra borders, darkening layers behind
sheets, visual effect views inside popovers) now actively fight the material and the
scroll edge effect. Delete them first, rebuild, then judge.

## Regular vs clear

| | Regular | Clear |
|---|---|---|
| Adaptivity | Full: flips light/dark (small elements), tint and dynamic range shift for legibility | None; permanently more transparent |
| Legibility | "provides legibility regardless of context" | Needs a dimming layer |
| Where | Anywhere, any size, any content on top; required for text-heavy components (alerts, sidebars, popovers) | Only over media (photos, video) |
| Use share | Most of your glass | Rare |

Clear is allowed only when **all three** hold (WWDC25 *Meet Liquid Glass*):

1. The element sits over media-rich content.
2. The content layer is not harmed by a dimming layer.
3. The content on top of the glass is bold and bright.

Dimming (HIG Materials): if the content underneath is bright, add a **dark dimming layer of
about 35% opacity**. If it is already dark, or you use AVKit playback controls (they bring
their own dimming), skip it. "They should never be mixed": do not put regular and clear
glass in the same group.

Also note `Glass.identity` (SwiftUI): renders as if no glass were applied. Use it to switch
glass off conditionally without changing view structure (for example, a toggle that
removes chrome for screenshots).

## Tint

- Tinting generates a range of tones mapped to the brightness beneath, like coloured glass;
  it stays legible and keeps all glass behaviours.
- "Tinting should only be used to bring emphasis to primary elements and actions."
  "When every element is tinted, nothing stands out."
- Primary action: tint the **background** (`.glassProminent`, `UIButton.Configuration
  .prominentGlass()`, `UIBarButtonItem.style = .prominent`, `NSToolbarItem.style =
  .prominent`), not the symbol. One per toolbar, trailing side (HIG Toolbars).
- Status colour (a red recording dot, an orange flag) may colour a symbol when it carries
  meaning.
- Colourful app? Prefer monochrome bars, or an accent with clear hue separation from the
  content (HIG Color, Tab bars, Toolbars).

## Grouping on bars

- Group by function and frequency; related actions share a background.
- Do not group a text button with symbols ("Select" next to a share icon reads as one button).
  Text buttons get their own container.
- Use fixed spacers to split groups; flexible spacers to push groups apart.
- Aim for at most three groups (HIG Toolbars).
- Hide toolbar *items*, not the views inside them, or you get empty glass capsules.
- Every icon gets an accessibility label.

## Focus and depth

- A sheet that interrupts the flow: glass plus a dimming layer to centre attention.
- A parallel task: glass alone provides separation; no dimming.
- As a sheet is dragged up, glass recedes: more opaque, larger. Half sheets are inset so
  content peeks through; full height turns more opaque.
- Action sheets and menus spring from the control that invoked them (set the source item).

## Scroll edge effects

- They replace hard dividers with a blur/fade where content scrolls under floating UI.
- Not decorative: "They don't block or darken like overlays." Only where floating UI
  overlaps scrolling content.
- One per view; in split views each pane may have its own, matched in height. Never stack.
- Styles: **automatic** (preferred), **soft** (subtle, good under glass buttons), **hard**
  (more opaque; for text outside glass controls, controls without backgrounds, pinned table
  headers; common on macOS). Prefer automatic; test soft thoroughly (HIG Scroll views,
  updated June 2026).
- Custom bars register with `UIScrollEdgeElementContainerInteraction` (UIKit); SwiftUI
  `scrollEdgeEffectStyle(_:for:)` / `scrollEdgeEffectHidden(_:for:)`.

## Tab bars and sidebars

- Tab bar floats over content; can minimise on scroll; can carry an accessory (now-playing).
- Do not place screen-specific actions (checkout) in the tab bar or its accessory.
- Search is a dedicated tab, trailing, on iOS. Use the semantic search role.
- 27 releases: `Tab(role: .prominent)` places a distinguished tab (for example a cart)
  at the bottom trailing edge.
- Sidebars are inset glass; content flows behind them. Use the background extension effect
  for hero imagery so it fills under the sidebar while staying centred; keep text and
  controls above it.

## Legibility rules

1. Measure (see `legibility-contrast.md`). 4.5:1 for text up to 17 pt, 3:1 for large text
   and glyphs, against the worst-case rendered backdrop.
2. Let the system's monochrome adaptive labels do their job; do not force a fixed grey.
3. If a resting state (top of a scroll view) has colourful content under the bar, that is
   your responsibility, not the material's (HIG Color).
4. Over busy media: regular variant, or clear plus dimming plus bold bright glyphs.
5. Never fix legibility by stacking a second glass or a heavy blur. Fix it with dimming,
   weight, the scroll edge effect, or by moving the control.
