# Forward vs. Backward Recovery: Two Philosophies for Agent Workflow Failure

## Introduction

When an agent workflow fails mid-execution, the system faces a fundamental choice: should it undo what has been done (backward recovery) or push forward to complete what was started (forward recovery)? This is not merely a technical question — it reflects a deep assumption about the nature of the work and the cost of incompleteness.

The Sagas paper (García-Molina & Salem, 1987) formalizes both strategies and identifies the conditions under which each is appropriate. Understanding this framework is essential for designing resilient agent orchestration systems.

---

## Backward Recovery: Compensate to a Clean State

Backward recovery means that when a saga fails at step j, the system executes compensating transactions Cj, Cj-1, ... C1 to semantically undo all completed steps. The execution sequence becomes:

> "T1, T2, ... Tj, Cj, ... C2, C1 for some 0 < j < n will be executed." (p. 250)

After backward recovery completes, the world is in a state where (semantically) nothing happened. The saga is fully cancelled.

### When Backward Recovery Is Appropriate

**User-initiated cancellation**: When a user or calling system explicitly decides the saga should not complete. The flight reservation is cancelled; the purchase order is withdrawn.

**Unrecoverable error in a forward step**: When a step fails in a way that cannot be retried — when the data it needs doesn't exist, when prerequisites have changed, when the external service is permanently unavailable.

**Business logic violation discovered mid-saga**: When a later step discovers that the preconditions for completing the saga are no longer met (e.g., a credit check fails, a resource that was available is now gone).

**Timeout with unacceptable partial state**: When time constraints mean the saga cannot complete before its results become irrelevant, and partial completion creates more problems than clean cancellation.

### Requirements for Backward Recovery

For backward recovery to be implementable, each completed step must have a defined compensating action. The paper is clear that this is a design requirement, not a runtime capability:

> "To amend partial executions, each saga transaction Ti should be provided with a compensating transaction Ci." (p. 250)

If compensating transactions have not been defined at design time, backward recovery is not available at runtime. This is a hard constraint.

---

## Forward Recovery: Drive to Completion

Forward recovery means that when a saga fails at step j, the system restores to the last checkpoint and continues forward toward completion, retrying failed steps until the saga finishes.

> "For forward recovery, the SEC requires a reliable copy of the code for all missing transactions plus a save-point." (p. 254)

The execution may look like: T1, T2, T3, [crash], T3 (retry), T4, T5 — where the saga resumes from the last valid checkpoint and drives through to completion.

### When Forward Recovery Is Appropriate

**Operations that must eventually complete**: Some workflows are not optional. Monthly interest calculation must be applied to all accounts. Payroll must run for all employees. The question is not whether to complete — it is how to get there despite failures.

> "Such pure forward recovery methods would be useful for simple LLTs that always succeed. The LLT that computes interest payments for bank accounts may be an example of such a LLT. The interest computation on an individual account may fail (through an abort-transaction command), but the rest of the computations would proceed unaffected." (p. 254)

**When compensation is impossible or very difficult**: If the side effects of completed steps genuinely cannot be undone, backward recovery is not available. Forward recovery becomes the only option.

> "Also recall that pure forward recovery does not require compensating transactions (see Section 5). So if compensating transactions are hard to write, then one has the choice of tailoring the application so that LLTs do not have user initiated aborts. Without these aborts, pure forward recovery is feasible and compensation is never needed." (p. 257)

**When steps are idempotent**: When each step can be safely retried without side effects — when "run it again" produces the same result as "run it once" — forward recovery is clean and safe.

**When the saga's value is in completion, not cancellation**: When a partial result has zero value (there is no "partially processed payroll"), the only acceptable outcome is completion.

### Requirements for Forward Recovery

**Save-points**: The system must checkpoint progress at defined intervals so that after a failure, the saga can restart from the last known-good state rather than from the beginning.

> "The save points could then be useful in reducing the amount of work after a saga failure or a system crash: instead of compensating for all of the outstanding transactions, the system could compensate for transactions executed since the last save point, and then restart the saga." (p. 252)

**Eventual success assumption**: Pure forward recovery requires that each sub-transaction will eventually succeed if retried enough times. If a step can permanently fail, forward recovery must have an escape hatch (escalation to human intervention, alternative execution paths, or fallback to backward recovery for that segment).

**Reliable code storage**: The code for remaining steps must survive failures. If the agent system loses its task definition mid-execution, forward recovery is impossible.

---

## Mixed Recovery: The Practical Solution

The paper recognizes that real systems often need both strategies available:

> "To illustrate the operation of the SEC in this case, consider a saga that executes transactions T1, T2, a save-point command, and transaction T3. Then during the execution of transaction T4 the system crashes. Upon recovery, the system must first perform a backward recovery to the save-point (aborting T4 and running C3). After ensuring that the code for running T3, T4, ... is available, the SEC records in the log its decision to restart and restarts the saga. We call this backward/forward recovery." (p. 254)

Mixed recovery combines both strategies:
- **Backward** to the last save-point (partial undo of work since the checkpoint)
- **Forward** from that checkpoint to completion (drive through remaining steps)

This is the most practical strategy for complex agent workflows: never compensate for more work than necessary, and always try to complete rather than abandon.

---

## Designing the Recovery Policy for Agent Workflows

For each multi-step agent workflow, the following decisions must be made at design time:

### Decision 1: Forward or Backward as Default?

**Choose forward when**:
- The workflow must complete (batch operations, scheduled jobs, compliance-required processes)
- Steps are idempotent or easily made so
- The value is in the final result, not partial completion

**Choose backward when**:
- The workflow can legitimately be cancelled
- Partial completion creates inconsistency that is worse than no action
- Each step has a meaningful compensating action

### Decision 2: Where are Save-Points?

Save-points should be taken:
- After any step that is expensive to re-execute
- After any step whose effect enables subsequent steps (dependencies)
- Before any step with significant side effects
- After any external API call that confirms a reservation, payment, or allocation

The paper suggests that in the simplest pure-forward case, save-points can be taken automatically after every sub-transaction:

> "We can simplify this further if we simply view a saga as a file containing a sequence of calls to individual transaction programs. The state of a running saga is simply the number of the transaction that is executing. This means that the system can take save-points after each transaction with very little cost." (p. 254)

### Decision 3: What Triggers Recovery?

Identify the failure modes:
- **System crash**: Automatic detection on restart. The orchestration daemon scans active sagas and drives recovery.
- **Step timeout**: The step did not complete within the expected window. Apply retry policy.
- **Step failure with known error**: The step failed for a diagnosable reason. Apply alternative (recovery block) or escalate.
- **User/caller cancellation**: Explicit request to abort. Drive backward recovery.

Each failure mode may warrant a different recovery strategy. A step timeout might trigger retry (forward); a business logic error might trigger backward; a system crash might trigger mixed backward/forward from the last save-point.

### Decision 4: What Is the Termination Guarantee?

Every recovery path must terminate in one of:
1. **Complete forward success**: All steps executed.
2. **Complete backward compensation**: All completed steps compensated.
3. **Human escalation**: The system cannot automatically resolve the failure; a human must intervene.

The saga guarantee is not that workflows never fail — it is that they never end in an unresolved partial state. Design the recovery policy to ensure that every failure eventually reaches one of these three terminal states.

---

## The Parallel Saga Complication

The paper identifies a special failure mode in parallel (concurrent-branch) sagas: **cascading rollbacks**.

> "This problem is known as cascading roll backs. It has been analyzed in a scenario where processes communicate via messages or shared data objects. There it is possible to analyze save-point dependencies to arrive at a consistent set of save-points (if it exists). The consistent set can then be used to restart the processes." (p. 256)

When saga branches run in parallel and one branch depends on the output of another, their save-points are not independent. A failure in branch A may invalidate save-points in branch B that assumed A's output was stable.

For agent orchestration systems that run parallel skill invocations within a workflow:
- Track inter-branch dependencies explicitly
- Do not use save-points in dependent branches that assume stability of upstream steps
- The orchestrator must understand the dependency graph to identify a consistent recovery point
- When in doubt, roll the entire parallel group back to the last point before the fork