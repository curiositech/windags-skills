# Modify vs. Restart

When the user wants to change something about the prediction, two paths exist: **mutate the existing prediction** or **re-run the pipeline**. The wrong choice wastes tokens or produces incoherent plans. This file is the decision rule.

## The Default

**Mutate.** The Sensemaker, Decomposer, PreMortem, and Synthesizer all ran on the current context. Throwing that away because the user wants to swap a skill is wasteful and often produces a worse plan.

Re-run only when the change invalidates upstream stages.

## What Mutates Cleanly

These changes are local to a single stage and don't propagate:

| Change | Why mutation works |
|---|---|
| Swap a primary skill for another in the same shortlist | Skill Selector output changes; everything else holds |
| Change a node's `model_tier` (haiku → sonnet) | Cost recompute; topology unchanged |
| Edit a node's `role_description` | Cosmetic; no upstream dependency |
| Add a runner-up skill | Append-only |
| Adjust `commitment_level` per node | Reflects user judgment, not decomposition |
| Reorder nodes within a wave | Same wave = parallel by definition |
| Update `estimated_minutes` / `estimated_cost_usd` | Recompute totals |
| Drop a `TENTATIVE` node | Other nodes don't depend on tentatives by contract |

For these, mutate the `PredictedDAG` in place, re-validate against `schemas/predicted-dag.schema.json`, and re-present.

## What Forces a Restart

These changes invalidate upstream stages. Re-run the pipeline.

| Change | What it invalidates |
|---|---|
| User reframes the problem ("actually I want to refactor instead of patch") | Sensemaker — re-run from scratch |
| User splits one node into two with different roles | Decomposer — the subtask graph changed |
| User merges two nodes into one | Decomposer — same |
| User moves a node from Wave 2 to Wave 0 | Decomposer — dependency assumptions changed |
| User changes the planning topology | Synthesizer — the topology-specific config (TopologyDetail) needs regeneration |
| User adds a node with a new role | Skill Selector — needs new candidate shortlist |
| User changes a `COMMITTED` node that downstream nodes depend on | Decomposer — cascading commitment changes |

For these, do not mutate. Re-gather context, re-run from the affected stage forward.

## The Partial Restart

Sometimes only part of the pipeline needs to re-run. Use this when only one stage is invalidated:

| Invalidating stage | Re-run from |
|---|---|
| Sensemaker | Top — full pipeline |
| Decomposer | Decomposer → Skill Selector + PreMortem → Synthesizer |
| Skill Selector (one node) | Just that node's selection + Synthesizer |
| PreMortem | PreMortem → Synthesizer |
| Synthesizer | Just Synthesizer |

The pipeline is structured so each stage's output is the next's input. Save intermediate outputs in the triple under `pipeline_stages` (or in-memory during the modify flow) so partial restarts are cheap.

## The User's Words → Decision Mapping

The user's natural-language modify request maps to mutate/restart as follows:

| User says | Action |
|---|---|
| "Use `playwright-e2e-tester` instead of `vitest-testing-patterns` for the test node" | Mutate (skill swap) |
| "Make the test node sonnet, not haiku" | Mutate (model tier) |
| "I don't need the docs node" | Mutate (drop, if TENTATIVE) or restart Decomposer (if COMMITTED with downstream deps) |
| "Actually I want to start over from the design doc" | Restart (Sensemaker — different problem framing) |
| "Split the build node into design + implement" | Restart Decomposer |
| "Move 'review' before 'implement'" | Restart Decomposer (ordering reflects dependency) |
| "Change topology to workflow" | Restart Synthesizer (topology-specific config regeneration) |
| "Use cheaper models throughout" | Mutate (bulk `model_tier` swap) |
| "Add a deployment node at the end" | Restart Decomposer |

When ambiguous, ask: "Do you want me to keep the rest of the plan and just change X, or rethink the whole thing?"

## Recording Modifications in the Triple

Both mutation and restart produce modifications worth recording. The shape:

```
{
  type: 'skill_swap' | 'topology_change' | 'node_add' | 'node_drop' | 'restart',
  before: <relevant subtree>,
  after: <relevant subtree>,
  reason: <user-supplied or inferred>,
  timestamp: ISO 8601
}
```

These go into `HumanFeedback.structuredModifications`. The triple feedback loop reads them — see `triple-feedback-loop.md`.

For restarts, record the *reason* the user gave. "Reframed problem" is a different signal from "Pipeline produced wrong skills."

## Convergence Limits

When the user keeps modifying, eventually you converge or you don't. Set a soft limit:

- **3 modifications**: still in normal flow.
- **4–5 modifications**: surface that the prediction may not match the task. Offer a fresh `/next-move --fresh` run.
- **6+ modifications**: stop mutating. The prediction's shape is wrong; restart is overdue.

Don't wait for the user to ask. After 5 cycles, suggest restart explicitly.

## Anti-Patterns

- **Mutating across invalidated stages.** Swapping a skill on a node that downstream nodes depend on without re-running PreMortem may produce risk analysis pointing at the wrong skill.
- **Restarting from a single skill swap.** Wasteful. The cascade already gave us the shortlist; we just need the next-best candidate.
- **Dropping `COMMITTED` nodes via mutation.** A `COMMITTED` node, by definition, was identified as load-bearing. Dropping it implies a Decomposer-level change.
- **Mutating the topology field without regenerating `topologyDetail`.** The detail config is topology-specific (workflow has nodes/edges, blackboard has board keys). Topology change forces detail regeneration.

## Quality Gate

After a modify operation:
- [ ] If mutate: re-validated against `predicted-dag.schema.json`.
- [ ] If restart: prior triple is still saved (with modifications recorded), new triple has new ID.
- [ ] `structuredModifications` reflects the actual change, not prose alone.
- [ ] If 5+ modifications, the user was told to consider `--fresh`.
