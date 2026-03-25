# Failure Taxonomy for Multi-Step Agent Workflows

## Introduction

The Sagas paper is careful to distinguish between different types of failures and to prescribe different responses to each. This taxonomy is essential for building agent orchestration systems that respond appropriately to failures rather than treating all failures identically.

Treating a bug the same as a crash, or a deadlock the same as a user cancellation, leads to recovery policies that are either too aggressive (aborting sagas that could be saved) or too passive (hanging in unresolvable states). The paper's taxonomy provides the conceptual vocabulary for designing graduated, appropriate responses.

---

## Failure Type 1: System Crashes

**Description**: The execution environment (server, process, network) fails. All in-memory state is lost. The system must be restarted.

**Characteristics**:
- The saga is interrupted mid-execution
- Any step currently in progress is incomplete and must be treated as failed
- Completed steps are durable (their effects are in stable storage)
- The saga state table and log are intact

**Recovery Action**:
> "After a crash, the TEC is first invoked to clean up pending transactions. Once all transactions are either aborted or committed, the SEC evaluates the status of each saga. If a saga has corresponding begin-saga and end-saga entries in the log, then the saga completed and no further action is necessary. If there is a missing end-saga entry, then the saga is aborted. By scanning the log the SEC discovers the identity of the last successfully executed and uncompensated transaction. Compensating transactions are run for this transaction and all preceding ones." (p. 254)

**Policy**: Drive backward recovery from the crash point. Compensate all completed steps. The saga is restarted fresh if the application requires completion.

**For agent systems**: System crashes are handled by the orchestration daemon on restart. The daemon reads the saga state table, identifies incomplete workflows, and drives compensation. This is why the saga state table must be stored in infrastructure that survives the crash (durable database, not the orchestration process's memory).

---

## Failure Type 2: Deadlock / Resource Conflict

**Description**: A step fails because it cannot acquire the resources it needs — another process holds them, and circular waiting creates deadlock.

**Characteristics**:
- The step fails, but the saga itself is not fatally compromised
- The step can be retried when the conflict resolves
- No saga-level state has been corrupted

**Recovery Action**: Retry the failed step after a backoff period. If retry fails repeatedly, escalate to abort-saga.

> "The frequency of deadlock is very sensitive to the 'size' of transactions... the deadlock frequency grows with the fourth power of the transaction size." (p. 249)

The paper's deeper point: the primary remedy for deadlock is not clever retry logic — it is *not having large transactions in the first place*. Saga decomposition inherently reduces deadlock frequency by breaking large operations into smaller steps.

**For agent systems**: Resource conflicts in agent systems manifest as API rate limiting, concurrent access to shared context, contention for external service connections. The saga pattern reduces contention by releasing resources after each step. Retry with exponential backoff handles transient contention at the step level.

---

## Failure Type 3: User/System-Initiated Abort

**Description**: A user, calling system, or higher-level policy explicitly cancels the saga before it completes.

**Characteristics**:
- The abort is intentional, not a failure
- The system knows which steps have completed
- Compensation is required for all completed steps

**Recovery Action**: Execute backward recovery immediately. Compensate all committed steps in reverse order.

> "When the SEC receives an abort-saga command it initiates backward recovery." (p. 253)

**For agent systems**: This failure type corresponds to user cancellation of a running workflow, timeout policies ("if this doesn't complete in 10 minutes, cancel it"), or circuit-breaker patterns that cancel workflows when downstream systems become unhealthy. The orchestration layer must support explicit cancellation signals that trigger backward recovery.

---

## Failure Type 4: Application Logic Error (Non-Compensable)

**Description**: A step fails because of a bug in the step's code, or because a precondition that was assumed to be true is false. The step cannot be simply retried — it would fail again for the same reason.

This is the failure mode the paper treats most carefully:

> "But what happens if a compensating transaction cannot be successfully completed due to errors (e.g., it tries to read a file that does not exist, or there is a bug in the code)? The transaction could be aborted, but if it were run again it would probably encounter the same error. In this case, the system is stuck: it cannot abort the transaction nor can it complete it." (p. 254)

**Characteristics**:
- Retry will not help — the error is deterministic
- The saga cannot drive forward
- The compensation itself may fail if it depends on state assumptions that are also wrong
- Manual intervention is likely required

**Recovery Options**:

**Option A: Recovery Blocks (Automated Alternatives)**
> "A recovery block is an alternate or secondary block of code that is provided in case a failure is detected in the primary block. If a failure is detected the system is reset to its pre-primary state and the secondary block is executed. The secondary block is designed to achieve the same end as the primary using a different algorithm or technique, hopefully avoiding the primary's failure." (p. 255)

For agent systems, this means having pre-designed fallback skills or alternative execution paths for steps that may fail in known ways. When the primary skill fails with a recognized error pattern, the orchestrator automatically switches to the alternative.

**Option B: Manual Intervention**
> "The erroneous transaction is first aborted. Then it is given to an application programmer who, given a description of the error, can correct it. The SEC (or the application) then reruns the transaction and continues processing the saga." (p. 255)

The paper notes that manual intervention during a saga is less costly than it might seem:
> "Fortunately, while the transaction is being manually repaired the saga does not hold any database resources (i.e., locks). Hence, the fact that an already long saga will take even longer will not significantly affect performance of other transactions." (p. 255)

For agent systems: when a step fails in a way that cannot be automatically resolved, the workflow should pause (not abort), escalate to a human queue with full context, and await correction. The workflow holds no exclusive resources while paused. When the human fixes the issue (corrects the skill, provides the missing data, resolves the ambiguity), the orchestrator resumes execution.

This is genuinely better than the alternative:
> "The remaining alternative is to run the saga as a long transaction. When this LLT encounters an error it will be aborted in its entirety, potentially wasting much more effort. Furthermore, the bug will still have to be corrected manually and the LLT resubmitted." (p. 255)

---

## Failure Type 5: Cascading Rollback in Parallel Execution

This failure mode is specific to parallel sagas (workflows where multiple branches execute concurrently):

> "At this point the system fails. The top process will have to be restarted before T1. Therefore, the save-point made by the second process is not useful. It depends on the execution of T1 which is being compensated for. This problem is known as cascading roll backs." (p. 256)

**Characteristics**:
- Branch B's progress depends on the output of Branch A
- Branch A must be rolled back due to failure
- Branch B's save-points, which assumed A's output was stable, are now invalid
- Simply restoring Branch B to its last save-point may leave it in an inconsistent state

**Recovery Action**: The orchestrator must analyze the dependency graph between parallel branches. A "consistent set" of save-points is one where no branch's save-point depends on state produced by a step that must be compensated. The orchestrator rolls back to this consistent set, then re-executes from there.

> "The SEC chooses the latest save-point within each process of the saga such that no earlier transaction has been compensated for." (p. 256)

**For agent systems with parallel skill invocations**: This means the orchestration layer must maintain an explicit dependency graph for parallel workflow branches. When rolling back any step, the orchestrator must check which other branches' progress depends on that step's output, and roll back those branches to a point before they consumed that output.

---

## The Failure Response Matrix

| Failure Type | Retry? | Compensate? | Continue Forward? | Escalate to Human? |
|---|---|---|---|---|
| System crash | After recovery | Steps since save-point | From save-point | Only if repeated |
| Deadlock/conflict | Yes, with backoff | No | Yes | If retries exhausted |
| User/system abort | No | All completed steps | No | Optional notification |
| Application logic error | No (until fixed) | May be needed | After fix | Yes — pause and queue |
| Cascading rollback | From consistent set | To consistent set | From consistent set | If no consistent set |

---

## Design Implication: Classify Failures Before Designing Recovery

For every step in a multi-step agent workflow, identify:

1. **Which failure modes can this step encounter?** Crashes, rate limits, logic errors, dependency failures, timeout?

2. **For each failure mode, what is the appropriate response?** Retry, alternative skill, backward recovery, pause for human, or abort?

3. **Is there a recovery block (alternative skill) available for the most likely failure modes?**

4. **If this step fails after n retries, is backward recovery still possible?** (Has the saga state remained intact? Are the compensation parameters still valid? Will the compensation skills still work?)

5. **What is the maximum hold time before manual escalation?** The workflow should never hang indefinitely in an unresolvable state.

Answering these questions at design time prevents the worst failure mode of all: a workflow that is neither completing nor being recovered, consuming resources and holding partial state indefinitely while no one knows what to do with it.