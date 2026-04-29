# Chrome Density and Commanding

The desktop shell should orient the user, not compete with the work.

## Title Bar Rules

### Windows

- Standard title bar height is **32px**.
- Empty title-bar space should remain draggable.
- The title can truncate; caption buttons should remain fully visible.
- Custom title bars may host extra controls, but the drag region and caption-button allocation still matter.

### Apple-style desktop guidance

- Use system-defined window appearances so active/inactive/key state remains legible.
- Keep critical content and actions out of bottom bars.
- Use short titles for panels such as “Inspector,” “Fonts,” or “Colors.”

## Command Placement Rules

- Put commands near the surface they affect.
- Use toolbar/title integration before creating extra persistent rows of controls.
- Use one top-level title per split-view workspace; do not title every pane redundantly.
- If a segmented control is switching major views, prefer a tab view in the main area rather than a cramped segmented control pretending to be navigation.

## Density Rules

Windows content-basics guidance gives practical spacing primitives:

- **8 epx** between tightly related controls
- **12 epx** between content areas or label/control relationships
- **16 epx** from surface edge to text/gutters

Use those as lower-level shell spacing clues. If your chrome system is dramatically larger than the content rhythm, the app will feel toy-like or wasteful.

## Bottom Bar Rule

On macOS-style desktop apps, avoid putting mission-critical actions or status in a bottom bar. Users frequently reposition windows so the bottom edge is obscured.

If the information is richer than a tiny status strip:

- use an inspector,
- use a trailing pane,
- or promote the content into the main workspace.

## Over-Chromed Shell Symptoms

- a large outer title bar plus large child title bars plus a taskbar plus repeated internal headings
- per-window snap buttons always visible in every title bar
- action bars consuming more height than the content they govern
- pane labels duplicated both in chrome and inside the pane body

## Preferred Fix Order

1. remove redundant headings
2. trim title-bar/control heights
3. move commands to pane-local toolbars or menus
4. collapse secondary panes before shrinking the primary field
