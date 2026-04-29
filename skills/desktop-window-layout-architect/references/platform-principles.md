# Platform Principles

This file distills the most relevant desktop-window guidance from Apple HIG, Windows Fluent/WinUI, GNOME HIG, Tauri, and Electron.

## 1. Related work should stay inside one primary window by default

- Apple’s split-view guidance explicitly treats sidebar + content + inspector as a normal primary-window shape.
- Apple’s window guidance distinguishes **primary windows** from **auxiliary windows**. Auxiliary windows are for a specific task area, not for every supportive region.
- Apple’s panel guidance treats inspectors as supplemental surfaces, not peer document windows.
- Windows pushes adaptive pane/navigation patterns like `NavigationView` and `TwoPaneView` instead of ad hoc floating support windows.
- GNOME distinguishes **sidebars** from **utility panes** and expects both to remain subordinate to a single window-level task.

**Implication**: If the user needs graph + details + artifact together, start with one primary window and panes. Reach for extra windows later.

## 2. Geometry is a contract, not an accident

- Apple recommends reasonable pane minimums and maximums so split-view dividers stay usable.
- Windows snap-layout guidance says desktop apps should support a **minimum width of at most 500 epx**, and preferably **330 epx or less**, for broad snap compatibility.
- Windows navigation/layout guidance emphasizes adaptive transitions instead of one static layout.
- GNOME utility-pane guidance explicitly recommends overlapping or toggled pane behavior when width is insufficient to show both regions side by side.

**Implication**: Define per-surface default size, minimum content size, snap-safe width, and collapse priority up front.

## 3. Placement should be remembered after first launch

- Apple explicitly notes that system-managed windows can remember size and placement.
- Tauri’s official `window-state` plugin saves positions and sizes and restores them on reopen.
- Electron exposes `getNormalBounds()` specifically so apps can distinguish normal floating bounds from maximized or snapped states.

**Implication**:

- First open may center.
- Reopen should restore last normal bounds.
- Viewport/display changes should clamp restored windows back on-screen.

## 4. Title bars are system affordances, not decoration

- Windows title bars primarily identify, drag, minimize, maximize, and close the window.
- Windows guidance expects empty title-bar space to remain draggable and the title to truncate before caption buttons disappear.
- Apple emphasizes system-defined window appearances so active/inactive/key windows remain legible.
- GNOME header bars recommend a small number of controls, contextual updates, and preserved blank drag space.

**Implication**:

- Do not overcrowd title bars.
- Keep drag regions obvious.
- Caption controls must remain visible.
- Custom chrome must still behave like a system surface.

## 5. Chrome is expensive; field is precious

- Apple warns against placing critical actions or information in bottom bars because users often obscure the bottom edge of a window.
- Apple split-view guidance prefers thin dividers and pane hiding over bulky separators.
- Windows content guidance uses small, consistent spacing primitives: 8, 12, and 16 epx relationships.
- GNOME advises that header bars should not become control graveyards; complex grouped controls belong elsewhere.

**Implication**:

- Prefer one meaningful window title.
- Remove redundant internal headings where the chrome already labels the surface.
- Use toolbars and pane-local controls before adding more permanent frame chrome.

## 6. Narrow widths require mode changes, not overlap

- Apple split views and Windows `TwoPaneView` both treat narrow widths as a trigger to rearrange or hide panes.
- Windows `NavigationView` adapts from expanded left navigation to compact/minimal modes as width decreases.
- GNOME sidebars and utility panes both document explicit adaptive transitions instead of squeezing every pane forever.

**Implication**:

- Wide desktop: persistent support panes are fine.
- Medium: one support pane should collapse or overlay.
- Narrow desktop: switch to tabs, toggles, or single-pane priority.

## Sources

- Apple HIG: Windows — https://developer.apple.com/design/human-interface-guidelines/windows
- Apple HIG: Split views — https://developer.apple.com/design/human-interface-guidelines/split-views
- Apple HIG: Sidebars — https://developer.apple.com/design/human-interface-guidelines/sidebars
- Apple HIG: Panels — https://developer.apple.com/design/human-interface-guidelines/panels
- Apple HIG: Designing for macOS — https://developer.apple.com/design/human-interface-guidelines/designing-for-macos
- Apple HIG: Layout — https://developer.apple.com/design/human-interface-guidelines/layout
- Windows: Title bar design — https://learn.microsoft.com/en-us/windows/apps/design/basics/titlebar-design
- Windows: NavigationView — https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview
- Windows: SplitView — https://learn.microsoft.com/en-us/windows/apps/design/controls/split-view
- Windows: TwoPaneView — https://learn.microsoft.com/en-us/windows/apps/design/controls/two-pane-view
- Windows: Content layout and spacing — https://learn.microsoft.com/en-us/windows/apps/design/basics/content-basics
- Windows: Support snap layouts — https://learn.microsoft.com/en-us/windows/apps/desktop/modernize/ui/apply-snap-layout-menu
- GNOME HIG: Header bars — https://developer.gnome.org/hig/patterns/containers/header-bars.html
- GNOME HIG: Sidebars — https://developer.gnome.org/hig/patterns/nav/sidebars.html
- GNOME HIG: Utility panes — https://developer.gnome.org/hig/patterns/containers/utility-panes.html
- GNOME HIG: Standard keyboard shortcuts — https://developer.gnome.org/hig/reference/keyboard.html
- Electron: BrowserWindow — https://www.electronjs.org/docs/api/browser-window
- Tauri: Window State plugin — https://v2.tauri.app/plugin/window-state/
