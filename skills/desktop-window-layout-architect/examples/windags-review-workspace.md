# Example: WinDAGs Review Workspace Audit

## Prompt

> The graph, inspector, and task-list windows keep overlapping. The shell feels like draggable web cards instead of a desktop product. Fix the layout model.

## Good Output Shape

### Surface Map

- `flow`: primary workspace window, role `canvas`
- `nodeDetails`: supportive inspector, role `inspector`
- `taskList`: supportive artifact viewer, role `artifact`

### Geometry Contract

- `flow` owns the field and gets first claim on width and height
- `nodeDetails` has a narrow but snap-safe min width
- `taskList` does not permanently consume height in medium/narrow modes
- wide preset may show all three simultaneously only if summed minimums fit

### Placement Contract

- first launch centers `flow`
- reopen restores last normal bounds
- `nodeDetails` opens docked/trailing in review mode, not as a peer document
- `taskList` opens as a lower companion only in wide mode; otherwise it becomes a toggleable tab or drawer

### Findings

- fixed percentage review layout plus large mins creates overlap
- static cascading is not enough for reopen placement
- snap/maximize need explicit restore bounds
- shell chrome is too tall relative to content density

### Highest-Leverage Code Moves

1. Measure the real work area from the desktop container.
2. Replace boolean maximize state with explicit modes plus `restoreBounds`.
3. Make review presets min-size aware instead of percentage-first.
4. Remove always-visible per-window snap buttons and trim child-window chrome.

## Why this is a good example

- It starts with **roles**, not coordinates.
- It treats overlap as a geometry-contract bug, not a styling bug.
- It preserves field for the graph instead of splitting everything equally.
