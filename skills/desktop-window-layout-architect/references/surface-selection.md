# Surface Selection

Choose the surface type before arguing about placement.

## Surface Taxonomy

### Primary Window

Use when the surface contains the app’s main navigation and main content.

Typical composition:

- leading navigation/sidebar
- center canvas/detail/content
- trailing inspector or auxiliary detail

Use this when users need to understand multiple related regions together.

### Auxiliary Window

Use when the surface represents a distinct task area with its own lifecycle.

Good examples:

- compare window
- detached preview
- dedicated batch-operation workspace
- secondary document or analysis surface

Bad examples:

- “details” window for the current selection
- “artifact” window that always belongs to the same review task

### Panel / Inspector

Use when the surface is supplemental and tracks the current selection or active window.

Good examples:

- style inspector
- metadata inspector
- color/font panel

Rules:

- keep it lightweight
- do not treat it like a peer document
- do not make minimize behavior central

### Modal / Sheet / Popover

Use when the task is short, blocking, and not worth persistent spatial state.

Good examples:

- rename
- destructive confirmation
- one-shot export parameters

## Routing Rules

### Use a pane instead of a window when

- the information is relevant only inside the current task,
- the user benefits from simultaneous visibility,
- the content updates with the current selection,
- or the user will bounce between the regions frequently.

### Use an auxiliary window instead of a pane when

- the work deserves its own task lifecycle,
- the user may place it on another display,
- or keeping it open independent of the parent task is beneficial.

### Use a panel instead of a pane when

- the controls are supplemental and lightweight,
- the user may want to float them near the active work,
- and the content follows the active selection rather than maintaining independent navigation.

### Do not solve a surface-selection problem with percentages

If the wrong surface exists, no split ratio will save it.

## Common Misclassifications

- **Artifact pane misclassified as auxiliary window**: If the artifact is only meaningful while reviewing the current graph, keep it in the primary window.
- **Inspector misclassified as document window**: If it mirrors current selection, it is an inspector.
- **Settings popover misclassified as persistent panel**: If it is short-lived and task-local, make it modal or sheet-like.
- **Navigation misclassified as tabs in cramped chrome**: If there are many top-level categories or hierarchical items, use a sidebar or adaptive navigation pane.

## Trigger Examples

Load `examples/surface-selection-scenarios.md` for concrete prompts and expected surface choices.
