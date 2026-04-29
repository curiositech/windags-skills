# Geometry and Placement

Window systems feel wrong when they lack explicit rules for size, placement, and state transitions.

## Geometry Contract

For every persistent surface, define:

- **default width / height**
- **minimum content width / height**
- **snap-safe width**
- **collapse priority**
- **mode transitions** such as wide, medium, narrow

## Placement Contract

For every persistent surface, define:

- **first-open placement**
- **restore behavior**
- **parent-relative behavior**
- **clamp behavior after resize/display change**
- **z-order expectations**

## Practical Rules

### First launch

- Primary window: center or otherwise place predictably.
- Auxiliary window: place near the invoking parent without obscuring the origin.
- Panel: float near the active content but not on top of the most important controls.

### Reopen

- Restore the last **normal** bounds, not the last snapped or maximized rectangle.
- Keep a `restoreBounds` structure separate from mode flags.

### Snap and maximize

- Treat `maximized`, `snapped-left`, `snapped-right`, and `tiled` as explicit modes.
- Restoring from those modes should return to prior floating bounds.
- Do not permanently overwrite the normal bounds when snapping.

### Clamp and recovery

- Clamp move and resize against the actual work area, not a guessed rectangle.
- Keep enough of the title bar visible to recover the window.
- When the app shell or display changes, re-clamp restored windows so they remain reachable.

## Snap Safety

Windows guidance is blunt here:

- support a minimum width of **500 epx or less** for common snap layouts
- target **330 epx or less** where practical for broader compatibility

If your primary window or critical auxiliary surface cannot survive that width, it needs:

- a different narrow preset,
- collapsible support panes,
- or a single-pane priority mode.

## Percentage Layout Warning

Avoid this sequence:

1. split width/height by percentages
2. apply pane minimums
3. hope they fit

That is how overlapping panes happen.

Do this instead:

1. sum the required minimums
2. compare them to available work area
3. if they fit, distribute remaining space by role priority
4. if they do not fit, switch preset

## Tauri Implementation Note

The official Tauri `window-state` plugin is the simplest path for restoring bounds, but it restores state after window creation. To avoid visible flashing, create the window hidden and reveal it after restore.

Source:

- https://v2.tauri.app/plugin/window-state/
