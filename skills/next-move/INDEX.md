# /next-move Skill Index

`/next-move` predicts the highest-impact next action by running a 5-agent meta-DAG (sensemaker → decomposer → skill-selector + premortem → synthesizer). It then hands an approved plan to the real WinDAGs runtime.

This skill is structured for **on-demand loading**. The `SKILL.md` body stays lean. Depth lives under the folders below — load only the file you need at the moment you need it.

## Folder Map

| Folder | What lives here | Load when |
|---|---|---|
| `prompts/` | Per-agent system prompts (sensemaker, decomposer, skill-selector, premortem, execution-node) | Right before you invoke that agent |
| `references/` | Operational rules, judgment-call guidance, internals | When a specific stage needs depth |
| `examples/` | Worked walkthroughs of full predictions | When you want to see the shape of a real prediction |
| `schemas/` | JSON Schemas for every output contract | When you need to validate or generate canonical output |
| `templates/` | Skeletal outputs to fill in | When you want a starting structure |
| `scripts/` | Diagnostic utilities (replay, validate, attribution dump) | When inspecting stored data on disk |
| `agents/` | Claude Code subagent definitions for each meta-DAG stage | When invoking a single stage directly via the `Task` tool |
| `diagrams/` | Visual flow diagrams | When the textual description isn't enough |

## Quick Reference

| Task | Load |
|---|---|
| Decide whether to halt instead of predict | `references/halt-gate-discipline.md` |
| Pick a topology without lying about runtime | `references/runtime-honesty.md` + `references/topology-selection.md` |
| Understand how skill candidates are narrowed | `references/skill-narrowing-cascade.md` |
| Use prior triples to inform this prediction | `references/triple-feedback-loop.md` |
| Mutate an existing prediction vs. re-run | `references/modify-vs-restart.md` |
| Diagnose a bad prediction | `references/failure-modes.md` |
| Build executable nodes from the predicted DAG | `references/skillful-node-execution.md` |
| Open the live WinDAGs surface | `references/live-execution-visualization.md` |
| Validate a `PredictedDAG` JSON | `schemas/predicted-dag.schema.json` |
| Save a triple to the store | `schemas/triple.schema.json` |
| Capture user feedback | `schemas/human-feedback.schema.json` |
| Start from a blank prediction | `templates/predicted-dag.template.json` |
| Refuse to predict cleanly | `templates/halt-gate-response.template.md` |
| Replay a stored prediction | `scripts/replay-triple.sh` |
| Validate a prediction file | `scripts/validate-prediction.sh` |
| Inspect attribution DB for a skill | `scripts/dump-attribution.ts` |

## Loading Discipline

1. Don't bulk-load. The whole skill tree is bigger than your context budget when fully expanded.
2. Use `windags_skill_reference("next-move", "<path>")` from any agent that needs depth.
3. Prefer `references/` over re-deriving rules from the SKILL body.
4. Examples are *expensive* to load — only when the user asks for a walkthrough or you genuinely need to see the shape.
