# Desktop Window Layout Architect

Design desktop app workspaces that feel native instead of improvised.

This skill exists for the class of problems where:

- panes overlap after resize,
- auxiliary windows feel like stray documents,
- chrome steals too much field,
- title bars and snap behavior feel fake,
- or the app has no explicit geometry and placement contract.

## Includes

- `SKILL.md` — operating procedure, anti-patterns, and output contract
- `references/` — platform guidance and implementation notes
- `scripts/` — preflight inspection and static layout audit
- `affordance-scorecard.json` — scoring rubric used by the static audit
- `templates/` — reusable audit and registry formats
- `examples/` — concrete scenarios for surface-selection and review workspaces
- `agents/` — optional clean-room worker for isolated critique
- `diagrams/` — Mermaid companions for decision flow and geometry policy

## Typical Use

1. Run `scripts/preflight.sh` on the target repo.
2. Run `scripts/audit_window_layout.py` for a static read of current layout heuristics.
3. If useful, emit an HTML report and open it in a browser for review:

```bash
python3 skills/desktop-window-layout-architect/scripts/audit_window_layout.py apps/tauri-desktop \
  --format html \
  --output /tmp/window-layout-audit.html
open /tmp/window-layout-audit.html
```

4. Use the skill to produce:
   - a surface map,
   - a geometry contract,
   - a placement contract,
   - chrome/commanding changes,
   - and workspace presets.

## Research Basis

This skill is grounded in primary platform guidance rather than generic web-layout taste:

- Apple Human Interface Guidelines for windows, split views, sidebars, panels, and layout
- Microsoft Windows app guidance for title bars, snap layouts, NavigationView, SplitView, and TwoPaneView
- GNOME HIG guidance for header bars, sidebars, utility panes, and adaptive pane behavior
- Tauri `window-state` plugin documentation
- Electron `BrowserWindow` documentation, especially `getNormalBounds`, modal behavior, and platform notes

## Validation

```bash
python3 skills/skill-architect/scripts/validate_skill.py skills/desktop-window-layout-architect
python3 skills/skill-architect/scripts/check_self_contained.py skills/desktop-window-layout-architect
```
