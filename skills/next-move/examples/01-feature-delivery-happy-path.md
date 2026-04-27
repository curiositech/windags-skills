# Example 01 — Feature Delivery, Happy Path

**Scenario**: Ship the auth-middleware refactor that's been in progress on a feature branch.
**Topology**: `dag` planning, `dag` runtime — no projection, no honesty footnote.
**Outcome**: User accepts, plan executes through `/api/execute` with live visualization.

This is the textbook case. Understand this before reading the harder examples.

## 1. User Invocation

```
$ wg next-move
```

No `--fresh`, no focus hint. The skill uses both conversation context and project signals.

## 2. Gathered Context (relevant fields)

```json
{
  "git_branch": "feature/auth-refactor",
  "git_status": " M packages/api/src/middleware/auth.ts\n M packages/api/test/middleware/auth.test.ts",
  "recent_commits": [
    "Extract token validation into separate function",
    "Add types for auth middleware config",
    "Refactor session handling to use new types"
  ],
  "modified_files": [
    "packages/api/src/middleware/auth.ts",
    "packages/api/test/middleware/auth.test.ts"
  ],
  "test_status": { "passing": 42, "failing": 1, "skipped": 0, "last_run": "2026-04-19T07:00:00.000Z" },
  "conversation_summary": "Refactoring auth middleware to use the new types module. Tests are mostly green; one test still failing because it asserts the old shape.",
  "active_tasks": ["Fix the auth.test.ts assertion to match new type shape", "Add docs for the new auth flow"],
  "triple_count": 14
}
```

Clean signals: one branch, one workstream, one failing test, two active tasks. Sensemaker should be confident.

## 3. Sensemaker Output

```json
{
  "inferred_problem": "Finish the auth-middleware refactor by fixing the failing test and adding documentation for the new auth flow.",
  "problem_classification": "well-structured",
  "confidence": 0.91,
  "halt_reason": null,
  "evidence": [
    "Single feature branch with focused commits",
    "Modified files all in same module",
    "Active tasks explicitly enumerate the remaining work",
    "Failing test count is 1 (low entropy)"
  ]
}
```

## 4. Halt Gate Decision

**Pass.** Confidence 0.91 (above 0.6 floor), classification `well-structured`, no halt reason, single workstream. Proceed.

## 5. Decomposer Output

```json
{
  "subtasks": [
    {
      "id": "fix-failing-test",
      "description": "Update auth.test.ts assertion to match new auth middleware shape",
      "depends_on": [],
      "wave": 0
    },
    {
      "id": "document-new-flow",
      "description": "Write documentation for the refactored auth middleware: types, configuration, error cases",
      "depends_on": [],
      "wave": 0
    },
    {
      "id": "verify-suite",
      "description": "Run full test suite and confirm all tests pass",
      "depends_on": ["fix-failing-test"],
      "wave": 1
    }
  ]
}
```

Two parallel leaves and one synthesizer. Wave 0 fans out, Wave 1 converges.

## 6. Skill Selector + PreMortem (parallel)

### Skill Selector

```json
{
  "selections": [
    {
      "subtask_id": "fix-failing-test",
      "primary_skill": "vitest-testing-patterns",
      "runner_up": "playwright-e2e-tester",
      "model_tier": "haiku",
      "estimated_minutes": 8,
      "estimated_cost_usd": 0.02,
      "reasoning": "Single test fix in existing Vitest suite; haiku sufficient."
    },
    {
      "subtask_id": "document-new-flow",
      "primary_skill": "technical-writer",
      "runner_up": "api-documentation-generator",
      "model_tier": "sonnet",
      "estimated_minutes": 15,
      "estimated_cost_usd": 0.12,
      "reasoning": "Documentation needs accuracy and clear examples; sonnet for tone."
    },
    {
      "subtask_id": "verify-suite",
      "primary_skill": "build-verification-expert",
      "runner_up": null,
      "model_tier": "haiku",
      "estimated_minutes": 3,
      "estimated_cost_usd": 0.01,
      "reasoning": "Run tests, parse output, report. Mechanical."
    }
  ]
}
```

### PreMortem

```json
{
  "recommendation": "PROCEED",
  "risks": [
    {
      "description": "Test fix may reveal that the new type shape itself has a bug, not just the test assertion",
      "severity": "low",
      "affected_nodes": ["fix-failing-test"],
      "mitigation": "If test still fails after assertion update, escalate to debugging instead of forcing the assertion."
    },
    {
      "description": "Documentation may drift from implementation if written before final API stabilizes",
      "severity": "low",
      "affected_nodes": ["document-new-flow"],
      "mitigation": "Have the doc node read the final implementation, not the in-progress diff."
    }
  ]
}
```

Low risks, PROCEED. Standard.

## 7. Synthesized PredictedDAG

```json
{
  "title": "Finish auth middleware refactor",
  "problem_classification": "well-structured",
  "confidence": 0.91,
  "topology": "dag",
  "topologyReason": "Two independent leaf tasks with a verification synthesizer; classic wave structure.",
  "waves": [
    {
      "wave_number": 0,
      "parallelizable": true,
      "nodes": [
        {
          "id": "fix-failing-test",
          "skill_id": "vitest-testing-patterns",
          "role_description": "Update auth.test.ts to assert new type shape; verify the test then passes",
          "why": "One failing test, identified target, mechanical fix",
          "input_contract": "auth.test.ts current state, new auth middleware type definition",
          "output_contract": "Updated auth.test.ts file; passing test confirmed",
          "commitment_level": "COMMITTED",
          "model_tier": "haiku",
          "estimated_minutes": 8,
          "estimated_cost_usd": 0.02,
          "cascade_depth": 1
        },
        {
          "id": "document-new-flow",
          "skill_id": "technical-writer",
          "role_description": "Write reference docs for the refactored auth middleware",
          "why": "Refactor is incomplete without docs reflecting new shape",
          "input_contract": "Final auth.ts implementation, types module",
          "output_contract": "Markdown doc covering: types, config options, error cases, migration notes",
          "commitment_level": "COMMITTED",
          "model_tier": "sonnet",
          "estimated_minutes": 15,
          "estimated_cost_usd": 0.12,
          "cascade_depth": 0
        }
      ]
    },
    {
      "wave_number": 1,
      "parallelizable": false,
      "nodes": [
        {
          "id": "verify-suite",
          "skill_id": "build-verification-expert",
          "role_description": "Run pnpm test; confirm all tests pass",
          "why": "Refactor is only done when the suite is green",
          "input_contract": "Updated test file from wave 0",
          "output_contract": "Test results: passing/failing counts; if any failures, list them",
          "commitment_level": "COMMITTED",
          "model_tier": "haiku",
          "estimated_minutes": 3,
          "estimated_cost_usd": 0.01,
          "cascade_depth": 0
        }
      ]
    }
  ],
  "estimated_total_minutes": 26,
  "estimated_total_cost_usd": 0.15,
  "premortem": { /* as above */ }
}
```

## 8. Presentation

User sees (textual summary, plus live WinDAGs UI in browser):

```
Finish auth middleware refactor                              confidence: 91%
classification: well-structured                              topology: dag (native)

Wave 0 ─┬─ fix-failing-test       vitest-testing-patterns    haiku   8min  $0.02
        └─ document-new-flow      technical-writer            sonnet 15min  $0.12

Wave 1 ── verify-suite            build-verification-expert  haiku   3min  $0.01

Estimated total: 26 min · $0.15
PreMortem: PROCEED — 2 low-severity risks documented
```

Then: `[ Accept ] [ Modify ] [ Change topology ] [ Reject ]`

## 9. Outcome

User accepts. Cost gate confirms. Execution starts via `/api/execute`. Live UI shows wave 0 nodes running in parallel; wave 1 starts when both wave 0 nodes complete.

## 10. Triple Saved

```json
{
  "id": "8a7c-...",
  "context": { /* full context snapshot */ },
  "predicted_dag": { /* the plan above */ },
  "feedback": {
    "accepted": true,
    "modifications": [],
    "rating": 5,
    "notes": "Plan was exactly what I needed."
  },
  "timestamp": "2026-04-19T07:32:00.000Z",
  "session_id": "session-..."
}
```

Triple saved to `.windags/triples/8a7c-....json`. Future similar tasks (auth refactors, type-shape test fixes) will benefit from the attribution k-NN reading this success.

## What This Example Teaches

1. **Clean signals → confident sensemaker → no halt.** The pipeline runs end-to-end without ambiguity.
2. **Topology matches runtime.** No `topologyReason` honesty footnote needed.
3. **Wave structure emerges from real dependencies.** Two leaves and a verifier — not artificial parallelism.
4. **Mixed model tiers per node.** Haiku for mechanical, sonnet for prose. Saves money without dropping quality.
5. **PreMortem stays low-risk because the plan IS low-risk.** Don't force PreMortem to invent risks for clean plans.
6. **Triple records 5/5 acceptance.** This becomes positive attribution signal for future similar tasks.

This is the boring case. Read `02-debugging-blackboard-shape.md` next for the interesting one.
