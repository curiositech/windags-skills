# windags-sensemaker — Skill Index

Stage 1 of the WinDAGs meta-DAG. Classifies a problem, scores validity, and decides whether to halt.

## Folder Map

| Folder | Contents |
|---|---|
| `SKILL.md` | Activation, classification rules, halt-gate triggers, output contract |
| `diagrams/` | Visual flowchart of the classification logic |

## Pipeline Position

```
windags-sensemaker → windags-decomposer → [windags-skill-selector ‖ windags-premortem] → windags-synthesizer
↑ this skill (entry point)
```

## Output Contract

This stage emits a `SensemakerOutput`. The canonical schema is in:

- `skills/next-move/schemas/sensemaker-output.schema.json`

Halt gate triggers (any one halts):
1. `confidence < 0.6`
2. `problem_classification === 'wicked'`
3. `halt_reason` is non-null
4. The repo signals show ≥2 unrelated workstreams

## Key References (in /next-move)

- `skills/next-move/references/halt-gate-discipline.md` — when to refuse vs. proceed (the hard judgment calls)
- `skills/next-move/agents/sensemaker.md` — Claude Code subagent definition that wraps this skill
- `skills/next-move/templates/halt-gate-response.template.md` — output template for halt responses

## Anti-Patterns

- Soft-halting by predicting a small/safe move. Halt is first-class output.
- Generic halt reasons. Name the specific contradiction.
- Confidence > 0.8 on multi-thread projects. The signals don't support it.
- Forcing `well-structured` on problems with contested goals. Those are `wicked`.
