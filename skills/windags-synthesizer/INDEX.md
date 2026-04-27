# windags-synthesizer — Skill Index

Stage 4 (final) of the WinDAGs meta-DAG. Assembles the final `PredictedDAG` from upstream outputs.

## Folder Map

| Folder | Contents |
|---|---|
| `SKILL.md` | Activation, when-to-use, output contract, topology rules, anti-patterns |
| `schemas/` | JSON Schemas (delegates to `next-move/schemas/predicted-dag.schema.json`) |
| `templates/` | Skeletal output |

## Pipeline Position

```
windags-sensemaker → windags-decomposer → [windags-skill-selector ‖ windags-premortem] → windags-synthesizer
                                                                                          ↑ this skill
```

## Key References (in /next-move)

- `skills/next-move/references/topology-selection.md` — picking the planning topology
- `skills/next-move/references/runtime-honesty.md` — naming runtime divergence
- `skills/next-move/schemas/predicted-dag.schema.json` — the canonical PredictedDAG schema
- `skills/next-move/agents/synthesizer.md` — the subagent definition that wraps this skill
