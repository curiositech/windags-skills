# Implementation Patterns

Translate the design contract into code without losing desktop behavior.

## Tauri

- Use `tauri-plugin-window-state` for persisted bounds where possible.
- Keep explicit window modes in your app state if your shell reimplements snapping/tiling inside a single window.
- Measure the real work area from the shell container instead of hard-coding “window minus N pixels.”
- If restore happens after creation, create windows hidden first to avoid visible flashing.

Good fit:

- persistent app window state
- multi-window restore
- small native bundle

Watch out for:

- browser-style assumptions leaking into desktop layout logic
- custom title bars that ignore native affordances

## Electron

- Prefer `BrowserWindow` bounds persistence with normal/snap/maximize restore bookkeeping.
- Use `getNormalBounds()` to preserve floating bounds separately from maximized/fullscreen state.
- Use `ready-to-show` or hidden creation when restored windows would otherwise flash into incorrect geometry.
- Let the OS own caption behavior whenever possible.
- Treat docked panes inside the app shell separately from OS-level windows.
- Remember that modal and child-window behavior differs by platform: macOS preserves parent-relative motion; Windows and Linux do not.
- On Wayland, assume that programmatic move/resize/focus can be restricted.

## WinUI

- Use `NavigationView` for adaptive primary navigation.
- Use `TwoPaneView` when two related panes need automatic rearrangement/hide behavior.
- Use `SplitView` when one pane should collapse or overlay while the content region remains continuously visible.
- Use TitleBar control/AppWindowTitleBar instead of ad hoc fake caption regions.

## SwiftUI / AppKit

- Use split-view primitives for primary-workspace composition.
- Use inspectors and panels intentionally; keep them supplemental.
- Prefer system window appearance and divider behavior over custom mimicry.

## GNOME / GTK / Libadwaita

- Treat sidebars as navigation and utility panes as supplemental controls or details.
- Keep utility panes out of the header-bar strip and let them overlay or flap when width is constrained.
- Leave blank header-bar drag space and keep the control count low.
- If pane visibility toggles, consider standard shortcuts like `F9` for a utility pane.

## Code-Level Heuristics Worth Encoding

- `mode` enum instead of `isMaximized` boolean
- `restoreBounds` for any reversible mode
- `role` on each surface config: navigation, canvas, inspector, artifact, console, utility
- `snapSafeMinWidth` on primary and auxiliary windows
- `collapsePriority` on panes
- explicit workspace presets keyed by breakpoint or available work area
