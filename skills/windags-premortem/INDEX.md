# windags-premortem — Skill Index

Stage 3b of the WinDAGs meta-DAG. Identifies failure modes, severity, affected nodes, and concrete mitigations. Runs in parallel with the Skill Selector.

## Folder Map

| Folder | Contents |
|---|---|
| `SKILL.md` | Activation, severity calibration, recommendation rules, anti-patterns |
| `diagrams/` | Visual flowchart |

## Pipeline Position

```
windags-sensemaker → windags-decomposer → [windags-skill-selector ‖ windags-premortem] → windags-synthesizer
                                                                  ↑ this skill (parallel with Selector)
```

## Output Contract

This stage emits a `PreMortemOutput`. Canonical schema:

- `skills/next-move/schemas/premortem-output.schema.json`

Recommendation calibration:

| Recommendation | Use when |
|---|---|
| `PROCEED` | No high-severity risks; mitigations easy or already in place |
| `ACCEPT_WITH_MONITORING` | High-severity risks but mitigations concrete and user is informed |
| `ESCALATE_TO_HUMAN` | Risk no automated mitigation can address |

## Key References (in /next-move)

- `skills/next-move/references/failure-modes.md` — catalog of common failure modes for /next-move predictions
- `skills/next-move/agents/premortem.md` — Claude Code subagent that wraps this skill

## Anti-Patterns

- Generic risks ("the agent might fail"). Every plan has that risk; not actionable.
- Empty mitigations ("monitor closely"). Name *what* to check.
- Severity inflation. Don't call everything `high` to seem thorough.
- PreMortem theater. Risks must reference specific subtask IDs and specific failure surfaces.
- Mitigations that contradict the plan. Mitigations refine; they don't undo.
