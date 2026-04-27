# Examples Index

End-to-end walkthroughs of `/next-move` runs. Each example shows the **full** pipeline output — context gathered, every agent's response, the synthesized plan, and what happens at presentation. Examples are expensive to load; only pull one when you want to see the shape of a real prediction.

| File | Scenario | Topology | Key teaching |
|---|---|---|---|
| `01-feature-delivery-happy-path.md` | Ship a small feature on a clean repo | `dag` (native) | Standard happy path — DAG planning equals DAG runtime |
| `02-debugging-blackboard-shape.md` | Investigate flaky state across workers | `blackboard` planning, `dag` projection runtime | Runtime honesty in practice |
| `03-iterative-drafting-workflow.md` | Refine a launch memo until reviewer approves | `workflow` (native) | When team-loop projects to workflow cleanly |
| `04-halt-gate-tripped.md` | Multi-thread project, pipeline refuses | n/a (halt) | What a real refusal looks like |
| `05-topology-mismatch-conversation.md` | User asks for swarm; server can't run swarms | `swarm` planning, plan-only | The "I want it actually as swarm" conversation |

## How Examples Are Structured

Every example has the same sections:

1. **The user invocation** — verbatim what the user typed
2. **Gathered context** — the `ContextSnapshot` (truncated to relevant fields)
3. **Sensemaker output** — JSON
4. **Halt gate decision** — pass or trip, why
5. **Decomposer output** — JSON
6. **Skill Selector + PreMortem** — parallel outputs
7. **Synthesizer / final PredictedDAG** — JSON
8. **Presentation to user** — what they see
9. **Outcome** — accept / modify / reject + feedback notes
10. **Triple** — what got stored

This is heavy. Don't load examples to look up rules — load `references/` for that. Load examples when you want to see what "good" looks like end-to-end.

## When NOT to Look at Examples

- Looking for activation triggers → `SKILL.md`
- Looking for halt conditions → `references/halt-gate-discipline.md`
- Looking for output shape → `schemas/`
- Looking for an empty starting structure → `templates/`

Examples are for shape recognition, not rule lookup.
