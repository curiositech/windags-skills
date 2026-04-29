# Workspace Presets

Define named presets instead of one hard-coded arrangement.

## Preset Strategy

At minimum, support:

- `wide`
- `medium`
- `narrow-desktop`

Optionally add:

- `compare`
- `inspection-heavy`
- `presentation`

## Pattern 1: Graph Review Workspace

Roles:

- `navigation`: optional
- `canvas`: graph
- `inspector`: node details
- `artifact`: task list or exported preview

### Wide

- graph dominates center-left
- inspector persists on trailing side
- artifact lives as a lower trailing pane or lower subpane only if it does not starve the graph

### Medium

- graph stays dominant
- either inspector or artifact persists, not both
- the secondary support surface becomes toggleable

### Narrow desktop

- graph is full field
- inspector and artifact become tabs or toggleable drawers

## Pattern 2: List / Detail / Inspector

### Wide

- sidebar or list on leading edge
- detail in center
- inspector trailing

### Medium

- sidebar becomes compact or overlay
- detail + inspector remain if mins fit

### Narrow desktop

- one pane visible at a time
- preserve direct route back to prior pane

## Pattern 3: Primary Window + Detached Auxiliary Surface

Use this when:

- the auxiliary surface has its own task lifecycle,
- users may want it on another display,
- or it must remain open across different parent selections.

Rules:

- remember independent bounds
- reopen near prior location
- do not force the auxiliary surface back into the primary split view unless the user requests it

## Pattern 4: Floating Inspector Panel

Use only when the inspector truly benefits from floating.

Rules:

- lightweight title
- no document semantics
- no important workflow dependency on the panel always being visible
- command to show/hide from menu or toolbar
