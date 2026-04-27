# Runtime Honesty

There are two topologies in every prediction. They are not the same thing and conflating them is the single most common way `/next-move` lies to the user.

- **Planning topology**: the *shape* of the problem. What pattern of agent collaboration would actually solve this well?
- **Runtime topology**: what the WinDAGs server can *actually execute today*.

When these match, no honesty problem exists. When they don't, you must say so before the user accepts.

## Current Runtime Capabilities

As of this skill version, the WinDAGs server natively executes:

| Topology | Native runtime support? | Notes |
|---|---|---|
| `dag` | ✅ Yes | Wave-based, fully wired |
| `workflow` | ✅ Yes | Conditional routing with cycles, reviewer verdicts, back-edges |
| `team-loop` | ❌ No (falls back to DAG) | Inner DAG repeats not implemented in `/api/execute` |
| `swarm` | ❌ No (falls back to DAG) | Pub/sub event bus exists in core but not wired to server |
| `blackboard` | ❌ No (falls back to DAG) | No shared-state primitive in the server |
| `team-builder` | ❌ No (meta-topology) | Plan-only; produces a target topology that itself may or may not run |
| `recurring` | ❌ No (falls back to DAG) | Loop construct not in server |

The `dag` and `workflow` rows are the only "yes." Everything else is plan-only or DAG-projection.

## The Three Honest Outcomes

When planning topology and runtime topology diverge, exactly one of these is the right move. Pick consciously.

### 1. Plan-only mode

Tell the user: "This is a swarm-shaped investigation. I can show you the plan but the server won't run it as a swarm today. Do you want the plan?"

Use this when:
- The user is exploring or thinking out loud.
- The plan-shape itself is the deliverable.
- Forcing it into a DAG would lose the essence of the pattern.

### 2. Honest DAG projection

Tell the user: "The investigation is blackboard-shaped, but I'll execute it as a sequential DAG: gather state → analyze → synthesize. We'll lose the dynamic re-triggering, but the concrete steps still work."

Use this when:
- The user wants execution today.
- The pattern can be flattened with acceptable loss.
- You can name what's lost (dynamic re-triggering, parallel exploration, etc.).

### 3. Workflow projection

Tell the user: "This wants to be a team-loop, but I can model it as a workflow with a reviewer node and an exit condition. The loop will run until the reviewer approves."

Use this when:
- The pattern has a natural reviewer/exit condition.
- The WorkflowPrediction shape (reviewer verdicts, back-edges) captures the essential semantics.
- Native workflow execution is preferable to DAG-flattening.

## Forbidden Phrases

Do not say:

- "Now executing the swarm."
- "Starting the team-loop iteration."
- "The blackboard is initialized."
- "Recurring node will check every 5 minutes."

unless the runtime path you generated is genuinely a swarm/team-loop/blackboard/recurring implementation. If you generated a DAG fallback, say "Starting the DAG projection of the team-loop plan" — the projection language matters.

## How to Word Runtime Honesty

In the approval UI / textual summary, always include:

```
Planning topology:  blackboard
Runtime topology:   dag (projection — dynamic re-triggering not supported)
```

If the user accepts and execution begins, the running headline is:

```
Executing DAG projection of blackboard plan…
```

Not:

```
Executing blackboard…
```

## When the User Says "I don't care, just run it"

Default to honest DAG/workflow projection. Note in the plan summary that the pattern was projected. Save the original planning topology in the triple so future predictions can spot when the same shape comes up and ask whether to upgrade the runtime.

## When the User Says "I want it to actually run as a swarm"

This is a feature request, not a `/next-move`. Two valid responses:
1. "The server doesn't run swarms natively today. Want me to plan the work to wire native swarm dispatch in `/api/execute`?" — converts the request into a meta-task.
2. "I can plan as a swarm but execute as a DAG projection. Acceptable?" — back to honest projection.

Do not stall by promising swarm execution.

## Telling the Future Without Lying

The `topologyReason` field exists for this. Use it to record *why* you picked the planning topology even when it diverges from the runtime topology:

```json
{
  "topology": "blackboard",
  "topologyReason": "Investigation requires re-checking shared state as new evidence arrives. Server does not run blackboards natively; will execute as DAG projection.",
  "topologyDetail": { "type": "blackboard", "config": { ... } }
}
```

The execution layer reads `topology` to dispatch (and falls back to DAG when needed). The `topologyReason` is for humans reading triples later — and for the next iteration of `/next-move` learning from triples.

## Interaction with the Halt Gate

A topology mismatch is **not** a halt trigger. The pipeline runs to completion; honesty is enforced at the *presentation* stage. Halt only when the input is ambiguous (see `halt-gate-discipline.md`), not when the output is hard to execute.

## Quality Gate

Before presenting:
- [ ] `topology` and `topologyReason` are both populated.
- [ ] If they diverge from the natively-supported set (`dag`, `workflow`), the textual summary names the divergence.
- [ ] No forbidden phrase is used in the presentation.
- [ ] The triple records the planning topology even when running a projection.
