# windags-decomposer — Skill Index

Stage 2 of the WinDAGs meta-DAG. Breaks the Sensemaker's inferred problem into 3-7 subtasks with dependencies and wave assignments.

## Folder Map

| Folder | Contents |
|---|---|
| `SKILL.md` | Activation, decomposition rules, wave assignment, output contract |
| `diagrams/` | Visual flowchart of the decomposition logic |

## Pipeline Position

```
windags-sensemaker → windags-decomposer → [windags-skill-selector ‖ windags-premortem] → windags-synthesizer
                    ↑ this skill
```

## Output Contract

This stage emits a `DecomposerOutput`. Canonical schema:

- `skills/next-move/schemas/decomposer-output.schema.json`

Constraints:
- 1 ≤ subtasks ≤ 12 (3-7 sweet spot)
- Every `depends_on` ID must exist in the same output
- The dependency graph is acyclic
- Wave numbers respect dependencies

## Key References (in /next-move)

- `skills/next-move/references/modify-vs-restart.md` — when subtask-graph changes mean re-decompose vs. mutate
- `skills/next-move/agents/decomposer.md` — Claude Code subagent that wraps this skill

## Anti-Patterns

- Skill IDs in subtask descriptions (that's the Skill Selector's job).
- Implicit dependencies via prose ("after the API is built…") — make them edges.
- Too many subtasks. >7 is usually over-decomposed.
- Single-subtask "graphs" — if the work is one node, the user didn't need /next-move.
- Verification subtasks for trivial work.
