# windags-skill-selector — Skill Index

Stage 3a of the WinDAGs meta-DAG. Picks primary + runner-up skills given a pre-narrowed candidate list.

## Folder Map

| Folder | Contents |
|---|---|
| `SKILL.md` | Activation, when-to-use, output contract, anti-patterns |
| `schemas/` | JSON Schemas for the output contract |
| `templates/` | Skeletal output to fill in |

## Pipeline Position

```
windags-sensemaker → windags-decomposer → [windags-skill-selector ‖ windags-premortem] → windags-synthesizer
                                          ↑ this skill
```

## Key References (in /next-move)

- `skills/next-move/references/skill-narrowing-cascade.md` — how candidates were pre-narrowed
- `skills/next-move/references/triple-feedback-loop.md` — how your selections become attribution signal
- `skills/next-move/agents/skill-selector.md` — the subagent definition that wraps this skill
