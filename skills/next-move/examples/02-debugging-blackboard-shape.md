# Example 02 — Debugging Investigation, Blackboard Shape

**Scenario**: State mutates unpredictably across worker processes; user wants to figure out why.
**Topology**: `blackboard` planning, `dag` projection runtime.
**Outcome**: User accepts the projection after seeing the runtime honesty note.

This is the canonical case where planning and runtime topologies diverge. The investigation pattern is genuinely blackboard-shaped (agents read shared evidence, write findings, re-trigger when new evidence arrives). The server can't run blackboards natively. We must say so.

## 1. User Invocation

```
$ wg next-move "figure out why state mutates unpredictably across workers"
```

## 2. Gathered Context (relevant fields)

```json
{
  "git_branch": "main",
  "git_status": "",
  "recent_commits": [
    "Bump worker pool size to 8",
    "Fix race condition in job queue (attempt 2)",
    "Add logging to worker init"
  ],
  "modified_files": [],
  "test_status": { "passing": 1421, "failing": 3, "skipped": 12, "last_run": "2026-04-19T06:45:00.000Z" },
  "conversation_summary": "State is leaking between workers. Tests pass in isolation but fail when run with --concurrent. Tried a mutex; didn't help. The race seems to be in the shared cache invalidation path but I'm not sure.",
  "active_tasks": ["Reproduce the race deterministically", "Identify the leak source"],
  "ci_status": { "provider": "github-actions", "status": "failure", "conclusion": "test", "url": "https://..." }
}
```

Signals: clean working tree (so the user is investigating, not implementing), CI failing, three failing tests under concurrency, mutex didn't help, suspicion in cache invalidation. Not clean enough for a one-shot fix; this is a hunt.

## 3. Sensemaker Output

```json
{
  "inferred_problem": "Investigate concurrent state corruption in worker pool, focusing on shared cache invalidation as a probable culprit, then propose a fix backed by reproduction.",
  "problem_classification": "ill-structured",
  "confidence": 0.78,
  "halt_reason": null,
  "evidence": [
    "User explicitly says 'not sure' about location",
    "Mutex attempt failed — common easy fixes are exhausted",
    "CI failing under concurrency confirms intermittent issue",
    "Cache invalidation suspected but not confirmed"
  ]
}
```

`ill-structured` because the location of the bug isn't known yet — investigation is required before action.

## 4. Halt Gate Decision

**Pass.** Confidence 0.78 (above 0.6), classification `ill-structured` (not `wicked`), user has clearly defined the suspicious area. Halt-gate doesn't trip on `ill-structured` alone — see `references/halt-gate-discipline.md`.

## 5. Decomposer Output

```json
{
  "subtasks": [
    {
      "id": "reproduce",
      "description": "Build a deterministic reproducer for the race; write a test that fails reliably under concurrency",
      "depends_on": [],
      "wave": 0
    },
    {
      "id": "instrument-cache",
      "description": "Add structured logging to the cache invalidation path; capture access patterns under concurrent load",
      "depends_on": [],
      "wave": 0
    },
    {
      "id": "audit-shared-state",
      "description": "Catalog every place workers read or write shared state; flag any non-atomic patterns",
      "depends_on": [],
      "wave": 0
    },
    {
      "id": "synthesize-hypothesis",
      "description": "From reproducer behavior + cache logs + audit, identify the most likely root cause",
      "depends_on": ["reproduce", "instrument-cache", "audit-shared-state"],
      "wave": 1
    },
    {
      "id": "propose-fix",
      "description": "Design a fix that addresses the root cause without breaking other concurrent paths",
      "depends_on": ["synthesize-hypothesis"],
      "wave": 2
    }
  ]
}
```

Three parallel investigations feeding a synthesis, feeding a fix proposal.

## 6. Skill Selector + PreMortem

### Skill Selector

```json
{
  "selections": [
    { "subtask_id": "reproduce",            "primary_skill": "fullstack-debugger",       "model_tier": "sonnet", "estimated_minutes": 25, "estimated_cost_usd": 0.20 },
    { "subtask_id": "instrument-cache",     "primary_skill": "logging-observability",   "model_tier": "haiku",  "estimated_minutes": 12, "estimated_cost_usd": 0.05 },
    { "subtask_id": "audit-shared-state",   "primary_skill": "code-architecture",        "model_tier": "sonnet", "estimated_minutes": 30, "estimated_cost_usd": 0.24 },
    { "subtask_id": "synthesize-hypothesis","primary_skill": "causal-reasoning-klein",   "model_tier": "sonnet", "estimated_minutes": 18, "estimated_cost_usd": 0.14 },
    { "subtask_id": "propose-fix",          "primary_skill": "refactoring-surgeon",      "model_tier": "sonnet", "estimated_minutes": 20, "estimated_cost_usd": 0.16 }
  ]
}
```

### PreMortem

```json
{
  "recommendation": "ACCEPT_WITH_MONITORING",
  "risks": [
    {
      "description": "Reproducer may not capture the actual production race; investigation could chase a phantom",
      "severity": "high",
      "affected_nodes": ["reproduce", "synthesize-hypothesis"],
      "mitigation": "If reproducer behaves differently from production, escalate to production-trace investigation before synthesis"
    },
    {
      "description": "Three parallel investigators may produce inconsistent conclusions",
      "severity": "medium",
      "affected_nodes": ["synthesize-hypothesis"],
      "mitigation": "Synthesizer should explicitly reconcile findings; surface contradictions rather than smoothing them"
    },
    {
      "description": "Proposed fix may introduce new race in a different code path",
      "severity": "medium",
      "affected_nodes": ["propose-fix"],
      "mitigation": "Re-run reproducer plus broader concurrency suite after fix"
    }
  ]
}
```

## 7. Synthesized PredictedDAG

The Synthesizer recognizes the **shape** of this work: agents independently gather evidence, deposit findings into a shared understanding, and re-trigger if new evidence comes in. That's a blackboard. But the server can't run it as a blackboard. So we record both topologies honestly:

```json
{
  "title": "Investigate concurrent state corruption in worker pool",
  "problem_classification": "ill-structured",
  "confidence": 0.78,
  "topology": "blackboard",
  "topologyReason": "Investigation pattern fits blackboard: agents independently gather evidence (reproducer, cache logs, state audit) and deposit findings; synthesis re-evaluates the board. Server does not run blackboards natively today. Will execute as DAG projection: parallel investigation → synthesis → fix proposal. The DAG projection loses dynamic re-triggering — if synthesis surfaces new questions, user must re-run /next-move rather than the agents auto-re-investigating.",
  "topologyDetail": {
    "type": "blackboard",
    "config": {
      "boardKeys": ["reproducer-result", "cache-access-log", "state-audit-findings", "hypothesis", "fix-proposal"],
      "agents": [
        { "id": "reproducer",  "skill_id": "fullstack-debugger",     "reads": [],                                                              "writes": ["reproducer-result"],         "priority": 10 },
        { "id": "instrumenter","skill_id": "logging-observability",  "reads": [],                                                              "writes": ["cache-access-log"],          "priority": 10 },
        { "id": "auditor",     "skill_id": "code-architecture",       "reads": [],                                                              "writes": ["state-audit-findings"],      "priority": 10 },
        { "id": "synthesizer", "skill_id": "causal-reasoning-klein", "reads": ["reproducer-result", "cache-access-log", "state-audit-findings"], "writes": ["hypothesis"],                "priority": 5  },
        { "id": "fixer",       "skill_id": "refactoring-surgeon",    "reads": ["hypothesis"],                                                  "writes": ["fix-proposal"],              "priority": 1  }
      ],
      "completionCondition": "fix-proposal is non-empty and synthesizer has not flagged contradictions",
      "initialState": { "reproducer-result": "<empty>", "cache-access-log": "<empty>", "state-audit-findings": "<empty>", "hypothesis": "<empty>", "fix-proposal": "<empty>" }
    }
  },
  "waves": [
    /* DAG projection of the blackboard, identical to the decomposition above */
  ],
  "estimated_total_minutes": 105,
  "estimated_total_cost_usd": 0.79,
  "premortem": { /* as above */ }
}
```

## 8. Presentation

User sees:

```
Investigate concurrent state corruption in worker pool      confidence: 78%
classification: ill-structured

Planning topology:  blackboard
Runtime topology:   dag (projection — dynamic re-triggering not supported)

Wave 0 ─┬─ reproduce              fullstack-debugger          sonnet  25min  $0.20
        ├─ instrument-cache       logging-observability       haiku   12min  $0.05
        └─ audit-shared-state     code-architecture           sonnet  30min  $0.24

Wave 1 ── synthesize-hypothesis  causal-reasoning-klein      sonnet  18min  $0.14

Wave 2 ── propose-fix             refactoring-surgeon         sonnet  20min  $0.16

Estimated total: 105 min · $0.79
PreMortem: ACCEPT_WITH_MONITORING — 1 high-severity risk (reproducer fidelity)

Note: This is a blackboard-shaped investigation. The server will execute it as a sequential DAG.
If synthesis surfaces new questions, you'll need to re-run /next-move rather than the agents
auto-re-investigating in place.
```

Then: `[ Accept DAG projection ] [ Plan only (don't execute) ] [ Modify ] [ Change topology ] [ Reject ]`

## 9. Outcome

User accepts the DAG projection. Says: "I get it, that's fine — the projection still gives me what I need."

## 10. Triple Saved

```json
{
  "id": "9b3d-...",
  "context": { /* full context */ },
  "predicted_dag": { /* the plan with both topologies */ },
  "feedback": {
    "accepted": true,
    "modifications": [],
    "rating": 4,
    "notes": "DAG projection was the right call. Native blackboard would have been nice but the projection captured the work."
  },
  "timestamp": "2026-04-19T08:14:00.000Z",
  "session_id": "session-..."
}
```

The triple records `topology: "blackboard"` even though the runtime was a DAG projection. The next time `/next-move` sees a similar shape, it can recognize the pattern faster.

## What This Example Teaches

1. **`ill-structured` is not a halt trigger by itself.** The user has scope, suspicion, and a question. That's enough.
2. **Blackboard recognition.** Three parallel evidence-gatherers feeding a synthesizer feeding an action — that's a board. Even if we can't run it as one.
3. **Honest projection.** `topologyReason` names the divergence and the cost (loss of dynamic re-triggering).
4. **Forbidden phrase avoided.** No "executing the blackboard" — the runtime headline says "Executing DAG projection of blackboard plan."
5. **PreMortem flagged the high-severity risk.** Reproducer fidelity is the load-bearing assumption; if it's wrong, the rest is wasted. PreMortem must catch this kind of fragility.
6. **5-node plan stays bounded by waves.** Without the wave projection, the parallelism wouldn't be obvious. With it, three investigators run truly in parallel.

Read `04-halt-gate-tripped.md` next for the case where the pipeline correctly refuses to predict.
