# References Index

Load only the file that answers the question in front of you. Each reference is self-contained and assumes you already know the rest of the skill.

| File | Topic | Lines | When to load |
|---|---|---:|---|
| `halt-gate-discipline.md` | When ambiguity demands refusing to predict | ~180 | Sensemaker confidence is borderline, classification is `wicked`, or signals point in multiple directions |
| `runtime-honesty.md` | Planning topology vs. runtime topology rules | ~140 | About to claim a non-DAG plan will execute natively today |
| `topology-selection.md` | Picking the right topology shape | ~140 | Before synthesizing the predicted DAG |
| `skill-narrowing-cascade.md` | How candidates flow through `SkillSearchService` | ~160 | Need to debug skill matches or tune retrieval |
| `triple-feedback-loop.md` | Using `.windags/triples/` to improve predictions | ~150 | Want past acceptance/rejection to inform this prediction |
| `modify-vs-restart.md` | When to mutate the prediction vs. re-run the pipeline | ~120 | User asked to change a node, swap a skill, or shift waves |
| `skillful-node-execution.md` | Turning predicted nodes into real subagents | ~170 | User accepted; you're about to execute |
| `live-execution-visualization.md` | Opening the live WinDAGs surface | ~130 | Execution is imminent and a TTY/desktop is available |
| `failure-modes.md` | Diagnosing predictions that came out wrong | ~140 | Triple feedback was negative or user rejected without modification |

## Cross-Reference Map

- **Halt gate trips** → `halt-gate-discipline.md` → `templates/halt-gate-response.template.md`
- **User accepts a `swarm` plan** → `runtime-honesty.md` (must be honest) → `examples/02-blackboard-debugging.md`
- **Skill match looks wrong** → `skill-narrowing-cascade.md` → check `prompts/skill-selector.md`
- **User rejects the plan** → `failure-modes.md` → `triple-feedback-loop.md` (record the rejection)
- **User edits a node** → `modify-vs-restart.md` → re-run skill-selector if skill swapped
- **Execution starts** → `skillful-node-execution.md` → `live-execution-visualization.md` → `prompts/execution-node.md`

## What's NOT in references/

- Per-agent prompts → `prompts/`
- Output contracts in machine-readable form → `schemas/`
- Empty starting structures → `templates/`
- Worked end-to-end walkthroughs → `examples/`
- Visual flowcharts → `diagrams/`

If you need the *what* of an output, look in `schemas/` or `templates/`. References are for the *why* and the *when*.
