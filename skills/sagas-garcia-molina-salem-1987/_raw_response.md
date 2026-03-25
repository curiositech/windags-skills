## BOOK IDENTITY
**Title**: SAGAS
**Author**: Hector García-Molina, Kenneth Salem
**Core Question**: How can a long-running, complex operation maintain meaningful guarantees of completion or clean reversal — without forcing the entire system to wait, locked, until every step finishes?
**Irreplaceable Contribution**: The Sagas paper is the foundational formal treatment of the insight that atomicity and isolation are separable concerns — and that for long-lived, multi-step processes, you can trade isolation for liveness while preserving semantic correctness through *compensating actions*. This paper gives AI agent orchestration systems the theoretical vocabulary they've been using intuitively: every multi-step agent workflow IS a saga, whether or not it knows it. The paper teaches not just the pattern, but the failure taxonomy, the recovery modes, the design principles for decomposition, and the implementation strategies for building saga support on top of systems that don't natively understand it.

---

## KEY IDEAS (3-5 sentences each)

1. **Long-running operations must be decomposed or they poison the system.** When a process holds locks on resources for hours or days, every other process that needs those resources suffers. The deadlock frequency grows with the *fourth power* of transaction size. The solution is not to optimize the long operation — it is to *restructure* it so resources are released as soon as each sub-step completes. This insight applies directly to agent workflows: a monolithic agent task that holds context, tokens, API connections, and downstream dependencies in one long chain is the cognitive equivalent of a long-lived transaction.

2. **Compensation is the mechanism that makes decomposition safe.** Once you break a large operation into steps, you accept that partial execution can become visible to others. The price of this is that every step must have a *compensating transaction* — a semantic undo that brings the world back to a meaningful state if something goes wrong later. Compensation is not rollback: it cannot pretend the intermediate state never existed, because others may have already acted on it. It is a new, forward-moving action that semantically cancels the prior one.

3. **Recovery has two directions: backward and forward.** Backward recovery compensates completed steps and walks back to a clean state. Forward recovery checkpoints progress and drives toward completion even after failure. The choice between them depends on whether compensation is possible and whether the operation *must* eventually succeed. Agent systems need explicit policies for both: some tasks should be retried and driven to completion; others should be gracefully unwound.

4. **Database and workflow design must anticipate saga decomposition.** A saga doesn't emerge naturally from any LLT — it requires intentional design of where the break points are, what data passes between steps, and whether temporary intermediate state can be made visible. The authors recommend storing "in-transit" data in the database itself, designing loosely-coupled components, and thinking about the full transaction set when designing individual operations. Agent system architects must similarly design workflows so that steps are semantically independent enough to be compensable.

5. **Saga execution can be layered on top of systems that don't natively support it.** Using a "saga daemon," subroutine wrappers, and persistent state tables, the saga pattern can be implemented without modifying the underlying transaction system. This is a profound engineering lesson: you don't need perfect infrastructure to build reliable long-running processes — you need a persistent coordinator, a durable log, and compensating logic. This is precisely how orchestration layers like WinDAGs work on top of stateless LLMs.

---

## REFERENCE DOCUMENTS

### FILE: saga-pattern-for-agent-workflows.md
```markdown
# The Saga Pattern: The Theoretical Foundation of Multi-Step Agent Orchestration

## What This Document Teaches

Every multi-step agent workflow is a saga. This is not a metaphor — it is a precise technical correspondence. Understanding the Sagas paper (García-Molina & Salem, 1987) gives agent system designers the clearest possible vocabulary for what they are actually building, what can go wrong, and how to design for recovery. This document translates the core saga framework into agent orchestration terms.

---

## The Problem: Long-Lived Operations Poison Shared Systems

The Sagas paper opens with a diagnosis of why long-running processes are pathological:

> "A long lived transaction, or LLT, has a long duration compared to the majority of other transactions either because it accesses many database objects, it has lengthy computations, it pauses for inputs from the users, or a combination of these factors." (p. 249)

The pathology is not just slowness. It is that long transactions hold *locks* on resources, and those locks block everything else:

> "As a consequence, other transactions wishing to access the LLT's objects suffer a long locking delay. If LLTs are long because they access many database objects then other transactions are likely to suffer from an increased blocking rate as well... Furthermore, the transaction abort rate can also be increased by LLTs. The frequency of deadlock is very sensitive to the 'size' of transactions... the deadlock frequency grows with the fourth power of the transaction size." (p. 249)

**The translation to agent systems is direct.** When an agent workflow holds exclusive access to a planning context, an external API connection, a user session, a code repository, or a reasoning chain — and holds it for the duration of a complex multi-step task — every other workflow that needs those resources is blocked. The "fourth power" scaling means that as tasks grow in complexity, blocking and failure compound catastrophically. You cannot solve this by making individual agents faster. You must restructure the work.

---

## The Core Insight: Atomicity and Isolation Are Separable

The conventional transaction model bundles together four properties (ACID): Atomicity, Consistency, Isolation, Durability. The key insight of the Sagas paper is that for long-running processes, **isolation is the problematic property** — and it can be traded away while preserving a meaningful form of atomicity.

> "In general there is no solution that eliminates the problems of LLTs. Even if we use a mechanism different from locking to ensure atomicity of the LLTs, the long delays and/or the high abort rate will remain. No matter how the mechanism operates, a transaction that needs to access the objects that were accessed by a LLT cannot commit until the LLT commits." (p. 250)

> "However, for specific applications it may be possible to alleviate the problems by relaxing the requirement that an LLT be executed as an atomic action. In other words, without sacrificing the consistency of the database, it may be possible for certain LLTs to release their resources before they complete, thus permitting other waiting transactions to proceed." (p. 250)

This is the fundamental trade: give up isolation (others can see your intermediate states), keep a form of atomicity (the whole thing either completes or is semantically undone). 

**In agent system terms:** A complex agent task does not need to complete entirely before any other agent can act on its partial results. Email drafts can be reviewed mid-generation. Code modules can be tested as they are written. Research findings can be used before the full report is complete. The requirement is not that no one sees partial work — the requirement is that if the task fails, the partial work is appropriately cleaned up.

---

## The Formal Definition: What Makes a Workflow a Saga

> "Let us use the term saga to refer to a LLT that can be broken up into a collection of sub-transactions that can be interleaved in any way with other transactions. Each sub-transaction in this case is a real transaction in the sense that it preserves database consistency. However, unlike other transactions, the transactions in a saga are related to each other and should be executed as a (non-atomic) unit: any partial executions of the saga are undesirable, and if they occur, must be compensated for." (p. 250)

Three conditions define a saga:
1. **Decomposability**: The LLT can be broken into a sequence of sub-transactions.
2. **Individual consistency**: Each sub-transaction is itself valid and leaves the world in a consistent state.
3. **Coordinated completeness**: The sub-transactions are semantically coupled — partial execution is undesirable and must be compensated if it occurs.

**The guaranteed execution contract is:**
> "Either the sequence T1, T2, ... Tn (which is the preferable one) or the sequence T1, T2, ... Tj, Cj, ... C2, C1 for some 0 < j < n will be executed." (p. 250)

This is the heart of it. Every saga execution ends in one of two ways: complete forward progress through all steps, or complete backward compensation through all completed steps. Nothing is left half-done. The system does not guarantee *how long* this takes, or that it won't fail repeatedly — but it guarantees eventual semantic resolution.

**For agent systems**, this means: when you design a multi-step task, you must simultaneously design its compensation sequence. Every skill invocation that produces side effects (sends an email, commits code, charges a payment, modifies a document) must have a corresponding compensating action (recalls the email, reverts the commit, issues a refund, restores the document). If you cannot define the compensation, you cannot safely decompose the task.

---

## Why Compensation Is Not Rollback

This is a critical distinction that the paper makes explicitly:

> "The compensating transaction undoes, from a semantic point of view, any of the actions performed by Ti, but does not necessarily return the database to the state that existed when the execution of Ti began. In our airline example, if Ti reserves a seat on a flight, then Ci can cancel the reservation (say by subtracting one from the number of reservations and performing some other checks). But Ci cannot simply store in the database the number of seats that existed when Ti ran because other transactions could have run between the time Ti reserved the seat and Ci canceled the reservation." (p. 250)

**Rollback** pretends something never happened by restoring a snapshot. It is only possible when you have perfect isolation — when no one else has seen or acted on your intermediate state.

**Compensation** acknowledges that others may have seen and acted on your intermediate state. It does not restore a snapshot. It performs a new, forward-moving action that semantically cancels the prior one, while respecting everything that has happened since.

Examples from the real world of agent operations:
- If an agent has already sent a notification, compensation is not "unsend" — it is "send a correction."
- If an agent has already committed code to a branch, compensation is not "time-travel the repo" — it is "create a revert commit."
- If an agent has already posted results to a dashboard, compensation is not "delete from memory" — it is "post an updated result with a correction note."

This is why compensation requires *domain knowledge*. It cannot be automated mechanically. It must be designed by someone who understands the semantics of each step. This is what the paper means by: "Gray notes that transactions often have corresponding compensating transactions within the application transaction set." (p. 257)

---

## The Execution Guarantee and Its Limits

The saga guarantee is powerful but bounded. Specifically:

> "Note that other transactions might see the effects of a partial saga execution. When a compensating transaction Ci is run, no effort is made to notify or abort transactions that might have seen the results of Ti before they were compensated for by Ci." (p. 250)

This is not a bug — it is an explicit design choice. The saga model accepts that the world is not frozen during long operations. Other agents, users, and systems may observe and act on your intermediate results. Compensation does not retroactively undo their reactions; it only undoes your original action. 

**Implication for agent design**: Agent workflows that depend on other agents NOT having observed intermediate state are not safe to run as sagas. If it matters that no one sees the draft before it's final, you need a different isolation mechanism. The saga pattern is for workflows where semantic eventual correctness is sufficient — where "we fixed it" is an acceptable outcome.

---

## Summary: The Agent Saga Checklist

Before designing a multi-step agent workflow, verify:

| Property | Question to Ask |
|----------|-----------------|
| **Decomposability** | Can this task be broken into steps where each step independently makes sense? |
| **Individual Consistency** | Does each step leave the world in a valid (if incomplete) state? |
| **Compensability** | For each step, is there a defined action that semantically undoes it? |
| **Tolerance for Visibility** | Is it acceptable for other agents/users to see intermediate results? |
| **Completion Policy** | Should failure drive backward (compensate) or forward (retry to completion)? |

If all five properties are satisfied, your workflow is a saga and the full machinery of saga orchestration applies. If any property fails, you need either stronger isolation (return to monolithic execution) or redesign of the workflow to achieve the property.
```

---

### FILE: compensation-design-for-agent-skills.md
```markdown
# Designing Compensating Actions for Agent Skills

## The Core Problem

Every agent skill that produces a side effect in the world — sends a message, writes to storage, invokes an external API, modifies a resource — creates a moment of irreversibility. Once the action is taken, the world has changed. If the larger workflow fails after this point, what happens?

Without designed compensation, the answer is: the world is left in a partial state. Some steps completed; others did not. The result is inconsistency that must be manually repaired, often much later, often by someone who doesn't understand what happened or why.

The Sagas paper (García-Molina & Salem, 1987) provides the theoretical framework for solving this problem systematically. This document translates that framework into practical guidance for designing compensating actions for agent skills.

---

## What Compensation Actually Means

The paper is precise about what a compensating transaction does and does not do:

> "The compensating transaction undoes, from a semantic point of view, any of the actions performed by Ti, but does not necessarily return the database to the state that existed when the execution of Ti began." (p. 250)

This is the central insight: **compensation is semantic, not mechanical**. It cannot restore a snapshot because the world has moved on. Other agents, users, and systems may have observed and acted on the intermediate state. Compensation must account for the world as it now is, not as it was before the original action.

The paper gives a concrete example: if a transaction reserves a seat on a flight, its compensation cannot "store back the original seat count" because other reservations may have been made in the interim. The compensation must *cancel the specific reservation* — a new forward action, not a state restore.

---

## The Three Categories of Agent Actions

From the perspective of compensability, agent skill invocations fall into three broad categories:

### Category 1: Naturally Reversible Actions

These are actions with clean, well-defined compensations that are straightforward to implement:

- **Create** → **Delete**: Creating a file, record, or resource can be compensated by deleting it.
- **Reserve** → **Cancel**: Reserving a seat, slot, or resource can be compensated by canceling the reservation.
- **Debit** → **Credit**: Deducting funds or quota can be compensated by adding them back.
- **Assign** → **Unassign**: Assigning a task, label, or ownership can be compensated by removing it.

The paper notes: "This is especially true when the transaction models a real world action that can be undone, like reserving a rental car or issuing a shipping order. In such cases, writing either a compensating or a normal transaction is very similar: the programmer must write code that performs the action and preserves the database consistency constraints." (p. 257)

For these action types, compensation should be designed alongside the action itself, as a required paired capability.

### Category 2: Partially Reversible Actions

These are actions whose direct effects can be reversed, but which have secondary effects that persist:

- **Send an email** → **Send a correction email**: The original email cannot be unsent, but a follow-up can semantically cancel it.
- **Post to a system** → **Post a correction**: The original post exists, but a compensating post establishes the corrected state.
- **Commit code** → **Create a revert commit**: The history of the original commit persists, but the working state is restored.
- **Print a document** → **Send a notice of cancellation**: The physical document exists, but a notice establishes that it should be disregarded.

The paper explicitly acknowledges this category: "It may even be possible to compensate for actions that are harder to undo, like sending a letter or printing a check. For example, to compensate for the letter, send a second letter explaining the problem. To compensate for the check, send a stop-payment message to the bank." (p. 257)

These compensations are imperfect — they acknowledge that the world has changed — but they are sufficient for maintaining semantic correctness. The person who received the first letter knows it is cancelled. The check cannot be cashed. The code is effectively reverted.

For agent system design, this means that "we cannot perfectly undo this action" is not sufficient reason to avoid the saga pattern. Imperfect compensation that restores semantic correctness is the goal, not perfect state restoration.

### Category 3: Truly Irreversible Actions

Some actions genuinely cannot be compensated:

> "For instance, if a transaction fires a missile, it may not be possible to undo this action." (p. 257)

For agent systems, examples include:
- Sending a message to a third party that cannot be recalled and whose reception cannot be confirmed
- Irrevocably destroying data that has no backup
- Triggering physical-world events (printing, shipping, manufacturing) that have already been executed

For these actions, the design choice is:
1. **Avoid placing them in the middle of a saga**: Put truly irreversible actions at the end, after all prerequisites are validated.
2. **Accept the risk explicitly**: Document that compensation is impossible and require human confirmation before execution.
3. **Use forward-only recovery**: Design the workflow so that once an irreversible action is taken, failure drives forward toward completion rather than backward toward undo.

---

## The Compensation Design Protocol

For each skill that produces side effects, the following information should be defined:

### 1. Action Signature
What does this skill do? What resources does it create, modify, or affect? What external systems does it touch?

### 2. Compensation Signature
What is the corresponding compensating action? This must be:
- **Semantically meaningful**: It must undo the *effect* of the original action, not just the state.
- **Idempotent where possible**: Running the compensation multiple times should not cause additional damage.
- **Parameterized**: It must accept the parameters needed to identify what to undo (e.g., reservation ID, transaction ID, file path).

### 3. Compensation Parameters
What information does the compensation need? This information must be:
- Captured at the time the original action completes (in the saga log)
- Durable: stored in persistent state, not just in memory
- Sufficient: the compensation must be executable from these parameters alone, without requiring the original agent's context

The paper notes: "It is possible to have each transaction store in the database the parameters that its compensating transaction may need in the future. In this case, the parameters do not have to be passed by the system, they can be read by the compensating transaction when it starts." (p. 252)

### 4. Compensation Preconditions
What conditions must be true for compensation to succeed? What happens if those conditions are not met? (This is the "bugs in compensating transactions" problem addressed in Section 6 of the paper.)

### 5. Compensation Category
Is this action in Category 1 (clean reversal), Category 2 (semantic undo with residue), or Category 3 (irreversible)?

---

## When Compensation Itself Fails

The paper dedicates a section to this often-overlooked problem:

> "But what happens if a compensating transaction cannot be successfully completed due to errors (e.g., it tries to read a file that does not exist, or there is a bug in the code)? The transaction could be aborted, but if it were run again it would probably encounter the same error. In this case, the system is stuck: it cannot abort the transaction nor can it complete it." (p. 254)

This is a genuine failure mode. Compensation can fail because:
- The compensating action has a bug
- The resource it needs to act on no longer exists
- External system state has changed in unexpected ways
- The compensation parameters were incorrectly stored

The paper offers two solutions:

**Recovery blocks (automated alternatives):**
> "A recovery block is an alternate or secondary block of code that is provided in case a failure is detected in the primary block. If a failure is detected the system is reset to its pre-primary state and the secondary block is executed. The secondary block is designed to achieve the same end as the primary using a different algorithm or technique, hopefully avoiding the primary's failure." (p. 255)

**Manual intervention:**
> "The erroneous transaction is first aborted. Then it is given to an application programmer who, given a description of the error, can correct it. The SEC (or the application) then reruns the transaction and continues processing the saga." (p. 255)

Importantly, the paper notes that manual intervention during a saga is far less costly than it sounds:

> "Fortunately, while the transaction is being manually repaired the saga does not hold any database resources (i.e., locks). Hence, the fact that an already long saga will take even longer will not significantly affect performance of other transactions." (p. 255)

**For agent systems**: Design each compensating skill with at least one fallback. If the primary compensation fails, have a simpler, more conservative compensation (e.g., "mark as needs manual review" if "auto-cancel" fails). Ensure that the orchestration layer captures compensation failures and escalates to a human queue rather than silently abandoning the saga.

---

## Compensation Design Anti-Patterns

### Anti-Pattern 1: Assuming State Is Unchanged
Designing compensation as if no one has acted on the intermediate state since the original action. This violates the fundamental insight of the paper: others may have observed and acted on your intermediate state. Compensation must be designed for the world as it is, not as it was.

### Anti-Pattern 2: Stateless Compensation
Designing compensation actions that cannot be parameterized — that require re-running the original agent's reasoning to figure out what to undo. Compensation must be driven by durable parameters captured at commit time, not by reconstructing context.

### Anti-Pattern 3: Compensation Chains Without Terminal Cases
Designing compensation that itself requires compensation if it fails, leading to infinite regression. Each compensation should either succeed or escalate to manual intervention — not spawn another saga.

### Anti-Pattern 4: Late Compensation Design
Designing compensation as an afterthought after the forward path is complete. Compensation requirements often reveal design flaws in the forward path — steps that cannot be cleanly compensated may need to be restructured. Design both paths together.

### Anti-Pattern 5: Compensation Avoidance Through Monolithic Tasks
Avoiding compensation design by refusing to decompose long tasks. This trades compensation complexity for the resource-blocking, deadlock-prone pathology of long-lived monolithic transactions. The paper is clear: this trade is almost always wrong.
```

---

### FILE: forward-vs-backward-recovery-in-agent-workflows.md
```markdown
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
```

---

### FILE: decomposing-complex-tasks-into-sagas.md
```markdown
# Decomposing Complex Tasks into Sagas: Design Principles for Agent Workflows

## Introduction

The hardest part of the saga pattern is not implementing the recovery machinery — it is *decomposing* a complex task into steps that are genuinely suitable for saga execution. Not every long-running task can be made into a saga without intentional design. The Sagas paper dedicates its final substantive section to this design problem, and the guidance it provides is directly applicable to agent workflow decomposition.

This document distills those design principles and extends them to the context of multi-agent orchestration systems.

---

## The Core Question: What Makes a Valid Decomposition?

For a long-running task to be decomposable into a saga, each step must satisfy two properties:

1. **Individual consistency**: After the step completes, the world is in a valid state — even if it is an incomplete state. Other agents or users who observe the world after this step see something coherent, not corrupted.

2. **Semantic independence**: The step does not require observing the same "frozen" state as other steps. It can operate on the world as it exists when it runs, not as it existed when the overall task started.

The paper illustrates the contrast with office procedures:

> "In an office information system, it is also common to have LLTs with independent steps that can be interleaved with those of other transactions. For example, receiving a purchase order involves entering the information into the database, updating the inventory, notifying accounting, printing a shipping order, and so on. Such office LLTs mimic real procedures and hence can cope with interleaved transactions. In reality, one does not physically lock the warehouse until a purchase order is fully processed. Thus there is no need for the computerized procedures to lock out the inventory database until they complete." (p. 250-251)

The principle: real-world procedures naturally decompose into saga steps because the real world doesn't have global locks. Software systems that model real-world procedures should reflect this natural decomposition.

---

## Strategy 1: Follow the Real-World Action Sequence

The first and most powerful decomposition strategy is to identify the real-world actions that the task models and treat each action as a saga step:

> "To identify potential sub-transactions within a LLT, one must search for natural divisions of the work being performed. In many cases, the LLT models a series of real world actions, and each of these actions is a candidate for a saga transaction. For example, when a university student graduates, several actions must be performed before his or her diploma can be issued: the library must check that no books are out, the controller must check that all housing bills and tuition bills are checked, the student's new address must be recorded, and so on. Clearly, each of these real world actions can be modeled by a transaction." (p. 257)

**The agent system application**: Before designing an agent workflow as a monolithic task, map it to the sequence of real-world actions it performs. Each action in the sequence that has natural independence from the others is a candidate saga step.

For example, a "complete code review and merge" workflow might decompose as:
1. Fetch the pull request and diff
2. Run automated tests
3. Perform semantic code review
4. Generate review comments
5. Request changes or approve
6. If approved, merge the pull request
7. Post merge notification

Each of these is a real-world action. Each can complete independently. Each has a natural compensating action (e.g., if step 6 fails, step 5's approval can be revoked; if step 7 fails, the notification can be resent or corrected).

---

## Strategy 2: Follow the Data Partition

When the task does not map clearly to a sequence of distinct real-world actions, look for natural partitions in the *data* the task processes:

> "In other cases, it is the database itself that is naturally partitioned into relatively independent components, and the actions on each component can be grouped into a saga transaction. For example, consider the source code for a large operating system. Usually the operating system and its programs can be divided into components like the scheduler, the memory manager, the interrupt handlers, etc. A LLT to add a tracing facility to the operating system can be broken up so that each transaction adds the tracing code to one of the components. Similarly, if the data on employees can be split by plant location, then a LLT to give a cost-of-living raise to all employees can be broken up by plant location." (p. 257)

**The agent system application**: When a task must process a large dataset or apply a transformation to many items, partition by the natural structure of the data. Process each partition as a separate saga step.

Examples:
- A "refactor codebase for new API version" task partitions by module or file
- A "update all customer records with new compliance fields" task partitions by customer segment or region
- A "generate personalized reports for all users" task partitions by user

Each partition is processed independently, with its own commit and compensation. If processing fails for one partition, only that partition needs to be compensated or retried.

---

## Strategy 3: Minimize Inter-Step Data Transfer Through Local Variables

This is perhaps the subtlest design principle in the paper, and it is directly relevant to agent system design:

> "Another technique that could be useful for converting LLTs into sagas involves storing the temporary data of an LLT in the database itself. To illustrate, consider a LLT L with three sub-transactions T1, T2, and T3. In T1, L performs some actions and then withdraws a certain amount of money from an account stored in the database. This amount is stored in a temporary, local variable until during T3 the funds are placed in some other account(s). After T1 completes, the database is left in an inconsistent state because some money is 'missing,' i.e., it cannot be found in the database. Therefore, L cannot be run as a saga." (p. 257-258)

The problem: T1 leaves the database in an inconsistent state (money is missing) by storing intermediate data in local variables rather than in shared state. Any external observer between T1 and T3 would see a corrupted world. This makes interleaving unsafe.

The solution:

> "If instead of storing the missing money in local storage L stores it in the database, then the database would be consistent, and other transactions could be interleaved. To achieve this we must incorporate into the database schema the 'temporary' storage (e.g., we add a relation for funds in transit or for pending insurance claims)." (p. 258)

**The agent system application**: This is the principle of making intermediate state *explicit and durable* rather than implicit and ephemeral.

In agent workflows, "local variables" correspond to in-memory state that exists only within a running agent execution: partial results, intermediate reasoning, cached API responses, accumulated context. When these are stored only in agent memory, they create the same problem as the missing money: the world appears inconsistent to any observer between steps, and if the agent crashes, the intermediate state is lost.

The design principle: **externalize intermediate state**. Any data that passes from one workflow step to another should be written to durable, shared storage as part of the step that produces it, not held in the agent's working memory until it is "ready." This makes the intermediate state:
- Visible to other agents that may need it
- Recoverable if the producing agent crashes
- Auditable for debugging and monitoring
- Compensable (the "funds in transit" record can be deleted if the saga is abandoned)

Examples:
- A research workflow that collects sources should write each source to a durable bibliography store as it is found, not accumulate them in a list variable
- A multi-step document generation workflow should write each section to a document store as it is completed, not hold them all in memory until the document is "done"
- A data transformation workflow should write transformed records to a staging table as they are processed, not buffer them in memory

The paper adds:

> "We believe that what we have stated in terms of money and LLT L holds in general. The database and the LLTs should be designed so that data passed from one sub-transaction to the next via local storage is minimized." (p. 258)

---

## Strategy 4: Design the Database (State Schema) for Saga Decomposition

The paper makes a structural point that is often missed:

> "As has become clear from our discussion, the structure of the database plays an important role in the design of sagas. Thus, it is best not to study each LLT in isolation, but to design the entire database with LLTs and sagas in mind. That is, if the database can be laid out into a set of loosely-coupled components (with few and simple inter-component consistency constraints), then it is likely that the LLT will naturally break up into sub-transactions that can be interleaved." (p. 257)

This is a systems-level insight: **the ability to decompose workflows is determined by how state is organized, not just how code is written**. If your state schema (database, knowledge base, document store, agent context) is tightly coupled — with many cross-cutting consistency constraints — then breaking up any workflow will violate those constraints.

**For agent system design**: This means that the schema of shared state (the context store, the knowledge base, the workflow state table, the agent communication bus) should be designed from the beginning with saga decomposition in mind. Ask:

- Which pieces of state are accessed by multiple steps of a workflow?
- Which consistency constraints span multiple pieces of state?
- Can those constraints be relaxed between steps (with compensation available if needed)?
- Are there "funds in transit"-style staging concepts that would allow intermediate state to be represented without creating apparent inconsistency?

Designing for saga decomposability is not a workflow concern — it is an architecture concern. It must be addressed at the level of system design, not workflow implementation.

---

## The Decomposition Anti-Pattern: Forcing Independence That Doesn't Exist

The paper does not claim that every LLT can be made into a saga. Some operations genuinely require global consistency across all steps:

An audit transaction that must see all the money is an example where forcing saga decomposition would produce wrong results — the audit would sometimes run between T1 and T3 and miss the in-transit funds. The paper's solution is not to pretend independence exists; it is to *restructure the state* (make funds in transit explicit) so that the audit can find them.

The meta-principle: **if your decomposition creates windows of apparent inconsistency that would produce wrong results for concurrent observers, you have two choices — redesign the state representation to make the inconsistency visible and meaningful, or abandon decomposition for this particular task.**

The second choice (monolithic execution) is sometimes correct. The paper is not arguing that every task must be a saga. It is arguing that many tasks that are currently run as monolithic operations *could* be sagas with thoughtful design, and the performance benefits of decomposition make that design effort worthwhile.

---

## Checklist for Saga-Ready Task Decomposition

Before committing to a decomposed workflow design, verify:

| Criterion | Check |
|-----------|-------|
| **Natural step boundaries** | Are step boundaries aligned with natural real-world action or data partition boundaries? |
| **Individual step consistency** | After each step, is the shared state in a valid (if incomplete) state? |
| **Externalizing intermediate state** | Is all inter-step data written to durable shared storage, not held in agent memory? |
| **Compensation for each step** | Has a compensating action been defined for each step with side effects? |
| **Observer safety** | If another agent or user observes the world between steps, will they see a coherent state? |
| **Loose coupling** | Are the state components touched by each step relatively independent of those touched by other steps? |
| **Schema support** | Does the state schema have "in-transit" representations for any intermediate states? |
```

---

### FILE: the-saga-daemon-orchestration-without-native-support.md
```markdown
# The Saga Daemon: Building Reliable Orchestration on Top of Unreliable Infrastructure

## Introduction

One of the most practically important contributions of the Sagas paper is its demonstration that robust saga execution can be built on top of systems that do not natively support it. This is not a compromise position — it is an architectural pattern for building coordination infrastructure at a higher layer than the base system.

This pattern is directly relevant to AI agent orchestration: language models are stateless, external APIs are unreliable, and no single underlying system understands the full semantics of a multi-step agent workflow. Yet we need reliable, recoverable, compensable orchestration. The saga daemon pattern shows how to achieve it.

---

## The Setup: What Happens Without Native Support

The paper assumes a scenario where you want saga guarantees but the underlying database management system (DBMS) does not directly support sagas. The same scenario applies to agent systems:

- The LLM has no memory of previous steps
- The tool-calling infrastructure does not understand workflow semantics
- The external APIs do not know they are part of a larger transaction
- No single component has a global view of the workflow's state or progress

The paper's solution:

> "There are basically two things to do to run sagas without modifying the DBMS internals at all. First, the saga commands embedded in the application code become subroutine calls (as opposed to system calls)... Each subroutine stores within the database all the information that the SEC would have stored in the log." (p. 255)

The two components of this solution are:
1. **Subroutine wrappers** that translate saga commands into persistent state updates
2. **A saga daemon** (SD) that manages recovery across failures

Together, these create a coordination layer that wraps existing infrastructure without modifying it.

---

## Component 1: The Subroutine Wrappers (Skill Instrumentation)

Each saga command (begin-saga, begin-transaction, end-transaction, abort-saga, save-point) is implemented as a subroutine call that:
- Records the saga state to a persistent store *within* the current step's transaction
- Ensures that saga state is durable before any step commits

The paper specifies the critical invariant:

> "The commands to store saga information (except save-point) in the database must always be performed within a transaction, else the information may be lost in a crash. Thus, the saga subroutines must keep track of whether the saga is currently executing a transaction or not." (p. 255)

**Translation to agent systems**: Every agent skill that participates in a workflow must, as part of its execution, record:
- That it has started (pre-commit)
- The parameters of its compensating action (post-commit, within the same atomic write)
- A save-point identifier if applicable

This cannot be done in a fire-and-forget manner. The recording must be part of the same atomic operation as the skill's side-effectful action. If the skill writes to a database, the compensation record must be written in the same database transaction. If the skill calls an external API, the compensation record must be written to a durable store *before* the API call, or the two must be made as close to atomic as the infrastructure allows.

The key warning from the paper:

> "Note that the subroutine approach only works if the application code never makes system calls on its own. For instance, if a transaction is terminated by an end-transaction system call (and not a subroutine call), then the compensating information will not be recorded and the transaction flag will not be reset." (p. 255)

**For agent systems**: Skills that bypass the orchestration layer's instrumentation — that call external APIs directly without recording to the saga log — break the saga guarantee. Every side-effectful skill invocation must go through the instrumented wrapper.

---

## Component 2: The Saga Daemon (Persistent Orchestrator)

The saga daemon is the heart of the pattern:

> "A special process must exist to implement the rest of the SEC functions. This process, the saga daemon (SD) would always be active. It would be restarted after a crash by the operating system. After a crash it would scan the saga tables to discover the status of pending sagas. This scan would be performed by submitting a database transaction. The TEC will only execute this transaction after transaction recovery is complete, hence the SD will read consistent data. Once the SD knows the status of the pending sagas, it issues the necessary compensating or normal transactions, just as the SEC would have after recovery." (p. 255-256)

The saga daemon has three responsibilities:

### Responsibility 1: Crash Recovery

On restart after any failure, the daemon:
1. Reads the saga state table to find all active (incomplete) sagas
2. Determines the recovery action for each: forward recovery (drive to completion) or backward recovery (compensate completed steps)
3. Executes the recovery actions

This is only possible because all saga state is stored durably in the state table, not in the daemon's memory. The daemon can reconstruct the full picture of what has happened from persistent state alone.

### Responsibility 2: Handling Transaction-Level Failures

When an individual step fails (not a system crash, but a step-level error):

> "After the TEC aborts a transaction (e.g., because of a deadlock or a user initiated abort), it may simply kill the process that initiated the transaction. In a conventional system this may be fine, but with sagas this leaves the saga unfinished. If the TEC cannot signal the SD when this occurs, then the SD will have to periodically scan the saga table searching for such a situation." (p. 256)

The daemon's role here is to detect incomplete sagas — sagas where a step has failed or been killed — and drive the appropriate recovery action. This requires either:
- A signal from the step-execution layer to the daemon when steps fail
- Or periodic scanning of the saga state table for sagas that are overdue or stalled

### Responsibility 3: Accepting Abort Requests

> "A running saga can also directly request services from the SD. For instance, to perform an abort-saga, the abort-saga subroutine sends the request to the SD and then (if necessary) executes an abort-transaction." (p. 256)

The daemon is the single point of coordination for saga-level decisions. Individual steps can request abort, but the daemon orchestrates the resulting compensation sequence.

---

## The Saga State Table: The Source of Truth

The entire pattern depends on a persistent, durable table (or set of tables) that records:

| Field | Purpose |
|-------|---------|
| Saga ID | Unique identifier for the workflow instance |
| Status | Active / Completing / Compensating / Complete / Failed |
| Steps Completed | List of completed steps with commit timestamps |
| Compensation Stack | For each completed step, the compensation action and its parameters |
| Current Step | The step currently executing (if any) |
| Save-Points | Checkpoints taken during execution |
| Last Heartbeat | Timestamp of last known activity (for stall detection) |

The paper specifies that compensation parameters must be stored here:

> "Each end-transaction call includes the identification of the compensating transaction that must be executed in case the currently ending transaction must be rolled back. The identification includes the name and entry point of the compensating program, plus any parameters that the compensating transaction may need." (p. 252)

This table is the single source of truth for the entire orchestration system. Any component — the daemon, a monitoring tool, a human operator — can determine the exact state of any workflow instance by reading this table.

---

## Implementing the Pattern in Agent Systems

The saga daemon pattern translates directly to agent orchestration:

### The Orchestration Layer as Saga Daemon

The orchestration layer (WinDAGs or equivalent) is the saga daemon. It is always running, it survives individual skill failures, and it drives recovery. Its responsibilities are:

1. **Before executing a skill**: Write the step's intent to the saga state table
2. **After skill execution succeeds**: Write the compensation record and mark the step complete
3. **After skill execution fails**: Determine recovery action (retry, alternative, abort) and drive accordingly
4. **On startup after crash**: Scan the state table and resume all in-progress sagas

### Skills as Instrumented Sub-Transactions

Each skill invocation is wrapped so that:
1. The call is recorded before execution (pre-commit)
2. Compensation parameters are captured from the result
3. The compensation record is written atomically with the step's side effects

Skills that cannot be instrumented in this way (because they have no defined compensation, or because their execution bypasses the instrumentation layer) should not be used in sagas.

### The Persistent State Table as the Workflow Journal

The workflow state store should contain, for each active workflow:
- The full compensation stack (in order, with parameters)
- Save-point identifiers and the state captured at each
- The recovery policy (forward/backward/mixed)
- Escalation contacts if automated recovery fails

---

## Why This Matters: Reliability Without Coupling

The saga daemon pattern achieves something remarkable: **reliable, recoverable coordination without requiring any single component to understand the full semantics of the workflow**.

The daemon doesn't need to understand what the skills do. The skills don't need to know about each other. The underlying infrastructure doesn't need to support sagas natively. Each component only needs to:
- The daemon: know how to read the state table and invoke compensations
- The skills: record their compensation parameters when they commit
- The state table: be durable and consistent

This is a profound decoupling. It means that as new skills are added to the system, they participate in saga guarantees automatically, as long as they:
1. Are registered with the orchestration layer
2. Define their compensation action
3. Execute through the instrumented wrapper

No modification to the orchestration layer is needed. No modification to other skills is needed. The saga guarantee scales with the skill set automatically.

This is why the paper concludes:

> "We believe that a saga processing mechanism can be implemented with relatively little effort, either as part of the DBMS or as an added-on facility." (p. 258)

The complexity is not in the mechanism — it is in the design of compensating transactions and the decomposition of LLTs. The mechanism itself is simple, robust, and composable.
```

---

### FILE: failure-taxonomy-and-recovery-design.md
```markdown
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
```

---

### FILE: designing-state-for-saga-compatibility.md
```markdown
# Designing State for Saga Compatibility: The "Funds in Transit" Principle

## Introduction

The Sagas paper contains a design principle that is easy to overlook because it appears late in the paper and is illustrated with a financial example. But it is one of the most important and transferable ideas in the entire document. The principle: **intermediate state that passes between workflow steps must be explicitly represented in shared, durable storage — not held in private memory**.

This is the "funds in transit" principle, and it directly governs how agent systems should manage context, partial results, and inter-step data.

---

## The Problem: Invisible Intermediate State

The paper illustrates the problem with a financial transfer:

> "Consider a LLT L with three sub-transactions T1, T2, and T3. In T1, L performs some actions and then withdraws a certain amount of money from an account stored in the database. This amount is stored in a temporary, local variable until during T3 the funds are placed in some other account(s). After T1 completes, the database is left in an inconsistent state because some money is 'missing,' i.e., it cannot be found in the database. Therefore, L cannot be run as a saga. If it were, a transaction that needed to see all the money (say an audit transaction) could run sometime between T1 and T3 and would not find all the funds." (p. 257-258)

The workflow is:
- T1: Withdraw $1000 from Account A → store in local variable X
- T2: Some intermediate computation
- T3: Deposit X into Account B

The problem: Between T1 and T3, the $1000 exists only in the local variable X. The database shows Account A with $1000 less but Account B unchanged. An audit run at this moment would incorrectly conclude $1000 has vanished. The workflow cannot be safely interleaved because its intermediate state is *invisible* to other observers.

**This is not a financial peculiarity.** It is a universal pattern in complex workflows. Anytime a workflow step produces output that is held privately until a later step uses it, the shared world appears inconsistent during the interval.

---

## The Solution: Explicit "In-Transit" State

> "If instead of storing the missing money in local storage L stores it in the database, then the database would be consistent, and other transactions could be interleaved. To achieve this we must incorporate into the database schema the 'temporary' storage (e.g., we add a relation for funds in transit or for pending insurance claims)." (p. 258)

The restructured workflow:
- T1: Withdraw $1000 from Account A → write $1000 to "Funds In Transit" table with transfer ID
- T2: Some intermediate computation
- T3: Read $1000 from "Funds In Transit" table → deposit into Account B → delete transit record

Now, between T1 and T3, an audit can see the $1000 in the "Funds In Transit" table. The total money in the system is unchanged. The world is consistent. The workflow can be safely interleaved.

The paper adds a key design note:

> "Also, transactions that need to see all the money must be aware of this new storage. Hence it is best if this storage is defined when the database is first designed and not added as an afterthought." (p. 258)

The "in-transit" representation must be a first-class concept in the data model, not a hack. Other workflows that might observe the intermediate state must know to look for it.

---

## Applications to Agent System Design

### Application 1: Research and Synthesis Workflows

Consider an agent workflow that:
1. Searches for sources on a topic
2. Reads and summarizes each source
3. Synthesizes summaries into a final report

In the naive implementation, summaries are accumulated in the agent's working memory between steps. If the agent crashes between step 2 and step 3, all summaries are lost. Other agents that might contribute to the report cannot see partial summaries. The workflow cannot be safely decomposed.

**The saga-compatible redesign**:
- Step 1: Search for sources → write source list to bibliography table
- Step 2 (iterated): For each source, summarize it → write summary to summaries table
- Step 3: Read all summaries from summaries table → write final report to output table

Each step reads from and writes to durable shared storage. Other agents can see the growing bibliography and summaries table. If the workflow crashes after step 2, it can resume from the last written summary. The "summaries in progress" table is the "funds in transit" equivalent.

### Application 2: Code Generation and Integration Workflows

Consider an agent workflow that:
1. Generates a module implementation
2. Generates tests for the module
3. Runs the tests and fixes failures
4. Commits the module

In the naive implementation, the generated code and tests are held in agent memory between steps. If the agent crashes after generating tests but before running them, all work is lost.

**The saga-compatible redesign**:
- Step 1: Generate implementation → write to a staging file in the repository
- Step 2: Generate tests → write to a staging test file
- Step 3: Run tests against staging files → write results to a test-results table
- Step 4: If tests pass, move staging files to production paths and commit

The staging files are the "funds in transit" equivalent. Another agent could review the generated implementation before tests are run. If the workflow crashes, it can resume from the last written staging file.

### Application 3: Multi-Step Data Analysis

Consider an agent workflow that:
1. Fetches raw data from multiple sources
2. Cleans and normalizes the data
3. Runs statistical analysis
4. Generates a report

**The naive pattern**: All data passes through agent memory. Each step reads from the previous step's output variable.

**The saga-compatible redesign**: Each step writes its output to a named, durable dataset in the data store. The pipeline is:
- raw_data_[job_id] → cleaned_data_[job_id] → analysis_results_[job_id] → report_[job_id]

Any step can be retried independently. Multiple agents can work on different stages in parallel. An observer can see the state of processing at any stage. Compensation is straightforward: delete the dataset produced by the step being compensated.

---

## The Schema Design Implication

The paper's guidance that in-transit storage should be designed upfront, not added as an afterthought, has a direct implication for agent system architecture:

**The state schema of a multi-agent system must include explicit representations for intermediate workflow states.**

This means:
- Not just "final results" tables, but "in-progress" or "staged" variants
- Explicit status fields that distinguish "available for use" from "being processed" from "pending validation"
- First-class representations for common intermediate states: "draft," "pending review," "staged," "in transit," "queued for processing"

Systems that only represent final states cannot be safely decomposed into sagas. Every step that produces an intermediate result leaves the system in an "inconsistent" state — one where the old state is gone but the new state isn't fully established.

---

## The Resource-Release Dividend

The paper notes an additional benefit of externalizing intermediate state that goes beyond saga compatibility:

> "Notice that in this case L would release the locks on the temporary storage after T1, only to immediately request them again in T3. This may add some overhead to L, but in return for this transactions that are waiting to see the funds will be able to proceed sooner, after T1. This is analogous to having a person with a huge photocopying job periodically step aside and let shorter jobs through. For this the coveted resources, i.e., the copying machine or the funds, must be temporarily released." (p. 258)

This is the politeness principle of saga design: *release resources as soon as you're done with them, even if you'll need them again later*. The cost is a brief re-acquisition overhead. The benefit is that other processes can use the resource during the interval.

For agent systems, this translates to:
- Release exclusive access to shared context after each step, even if the next step will need it
- Write intermediate results to shared storage where other agents can read them, even if you'll be the one reading them again
- Don't hold API connections, locks, or execution slots between steps that don't need them

The aggregate system performance improvement from this discipline — multiplied across many concurrent workflows — far outweighs the small overhead of re-acquisition.

---

## Summary: The Principle Stated Directly

> "We believe that what we have stated in terms of money and LLT L holds in general. The database and the LLTs should be designed so that data passed from one sub-transaction to the next via local storage is minimized." (p. 258)

Restated for agent systems:

**Intermediate results that pass between workflow steps should be written to durable shared storage, not held in agent memory.** This makes intermediate state visible, recoverable, and compensable. It is the prerequisite for safe workflow decomposition.

This is not primarily a reliability concern — it is a *design correctness* concern. Workflows that hold intermediate state in memory are not just fragile; they are incorrect in the sense that they create windows where shared state appears inconsistent. No amount of retry logic or crash recovery can fix a workflow whose intermediate states are fundamentally invisible.

The fix is always the same: name the intermediate state, give it a home in the shared state model, make it visible and durable, and design the transitions between states explicitly.
```

---

### FILE: the-cost-of-monolithic-operations.md
```markdown
# The Hidden Cost of Monolithic Agent Tasks

## Introduction

The Sagas paper begins not with a solution but with a careful accounting of the damage that long-running monolithic operations inflict on shared systems. Understanding this damage is prerequisite to understanding why decomposition is not merely convenient but necessary. The paper's analysis of the "fourth power" scaling of deadlock frequency is one of the most important quantitative results in distributed systems — and it applies directly to agent orchestration.

This document develops the full cost model of monolithic operations and translates it into agent system terms.

---

## The Pathology: What Long Operations Actually Cost

The paper identifies five distinct costs imposed by long-running operations:

### Cost 1: Blocking Delay

> "Other transactions wishing to access the LLT's objects suffer a long locking delay." (p. 249)

Every resource that a monolithic operation holds is unavailable to all other operations until the long operation completes. In a shared system with many concurrent workflows, this creates a cascading delay: any workflow that needs any resource held by the long operation must wait.

**In agent systems**: When a monolithic agent task holds exclusive access to a shared context store, a code repository, a planning state, a user session, or an external API connection — every other workflow needing those resources is blocked. The delay is not just the agent's execution time; it is the queue time of every blocked workflow.

### Cost 2: Increased Conflict Rate

> "If LLTs are long because they access many database objects then other transactions are likely to suffer from an increased blocking rate as well, i.e., they are more likely to conflict with an LLT than with a shorter transaction." (p. 249)

A long operation that touches many resources has a large "conflict footprint." Even if each individual resource is relatively uncontended, the probability that *some* other workflow needs *some* resource held by the long operation grows with the number of resources held.

**In agent systems**: A monolithic task that accesses many skills, APIs, knowledge stores, and external services has a large conflict footprint. The probability that a concurrent workflow needs one of those resources is high. The resulting blocking affects the entire system, not just the specific resources touched.

### Cost 3: Deadlock Frequency Scaling

This is the most dramatic result:

> "The frequency of deadlock is very sensitive to the 'size' of transactions, that is, to how many objects transactions access. In the analysis of [Gray81b] the deadlock frequency grows with the fourth power of the transaction size." (p. 249)

If a transaction doubles in size (doubles the number of resources it accesses), deadlock frequency increases by a factor of sixteen. If it triples in size, deadlock frequency increases by a factor of eighty-one.

This is not a linear cost — it is catastrophically superlinear. Small increases in task scope produce enormous increases in deadlock risk.

**In agent systems**: As tasks grow in scope (more skill invocations, more external API calls, more shared context access), deadlock and conflict probability explode. The system that works fine with 10-step workflows may become unusable as tasks grow to 50 or 100 steps — not because any single step is more complex, but because the cumulative conflict footprint has grown to the point where interference is near-certain.

### Cost 4: Increased Crash Failure Probability

> "From the point of view of system crashes, LLTs have a higher probability of encountering a failure (because of their duration), and are thus more likely to encounter yet more delays and more likely to be aborted themselves." (p. 249)

A longer-running operation is more exposed to failure simply because it runs for longer. A workflow that takes 10 seconds has a very low probability of encountering a system crash. A workflow that takes 10 hours has a much higher probability of encountering a crash, network failure, API timeout, or resource exhaustion — and when it does, it must be entirely restarted.

**In agent systems**: Long-running monolithic tasks that make many sequential API calls, process large amounts of data, or pause for human input accumulate failure probability throughout their execution. Each new step is a new opportunity for failure. And when a monolithic task fails, all work is lost.

### Cost 5: Wasted Work on Restart

When a monolithic long-running operation fails and must be restarted, all the work done before the failure is wasted:

> "The remaining alternative is to run the saga as a long transaction. When this LLT encounters an error it will be aborted in its entirety, potentially wasting much more effort." (p. 255)

The wasted work scales with how far into the operation the failure occurred. A task that fails at 90% completion wastes 90% of the work — and must redo that 90% on restart.

---

## The Systemic Failure Mode: Convoy Effects

The paper does not name this explicitly, but the failure mode it describes is what computer scientists call a **convoy effect**: a single slow operation causes a queue of faster operations to back up behind it, degrading system throughput far beyond the direct cost of the slow operation itself.

In a system with many concurrent workflows:
1. Workflow A starts a long monolithic task and acquires many resources
2. Workflows B, C, D, E all need some of those resources and are blocked
3. Workflow A is slow, so B, C, D, E queue up behind A
4. New incoming workflows F, G, H find all resources occupied and are also blocked
5. The system appears to slow down globally, even though only Workflow A is the source of contention
6. When Workflow A finally completes, B, C, D, E simultaneously attempt to acquire resources → deadlock spike

The convoy effect is invisible in single-operation benchmarks and only appears under concurrent load. This is why many agent systems perform well in testing (with one workflow at a time) and degrade dramatically in production (with many concurrent workflows).

The remedy, as the paper argues throughout, is not to optimize the slow operation but to decompose it so that resources are released incrementally.

---

## The False Economy of Atomicity

The paper's most important insight about monolithic operations is that their atomicity is often unnecessary:

> "However, for specific applications it may be possible to alleviate the problems by relaxing the requirement that an LLT be executed as an atomic action. In other words, without sacrificing the consistency of the database, it may be possible for certain LLTs to release their resources before they complete, thus permitting other waiting transactions to proceed." (p. 250)

Monolithic atomicity is maintained because it is *convenient*, not because it is *required*. The office purchase order does not require the physical warehouse to be locked until the order is fully processed. The real world handles purchase orders with intermediate states (ordered, picked, packed, shipped) that are observable by other processes. The atomicity requirement in the software system is artificially strict.

**For agent system designers**: Before designing any multi-step task as a monolithic operation, ask: *does this task actually require that no one observes intermediate states?* In most cases, the answer is no. The atomicity requirement is inherited from the assumption that "transactions should be atomic," without questioning whether that assumption applies to this specific operation.

When the answer is genuinely yes — when intermediate states are meaningfully inconsistent and must not be observed — then monolithic execution is correct. But this should be a deliberate design choice, not a default.

---

## The Quantitative Case for Decomposition

To make the case concrete: consider a system with a baseline deadlock rate when all operations are small. According to the Gray analysis cited in the paper, deadlock frequency grows with the fourth power of transaction size.

If average operation size doubles (perhaps because an "enhance with context" step is added to all workflows):
- Deadlock frequency increases by 2^4 = 16×

If average operation size triples:
- Deadlock frequency increases by 3^4 = 81×

If a few very large monolithic operations dominate the system's resource access:
- They contribute disproportionately to system-wide deadlock frequency
- Their failure probability is high (long duration)
- Their restart cost is high (all work lost)
- Their blocking cost is high (many resources held for long periods)

The cost of designing for saga decomposition — writing compensating actions, externalizing intermediate state, designing recovery policies — is a one-time design cost. The cost of monolithic operations is ongoing and compounds with system load.

---

## Summary: The Agent System Corollary

The paper's conclusion about database systems translates directly:

When an agent workflow grows in scope, the costs it imposes on the shared system do not grow linearly — they grow superlinearly, with deadlock risk growing as the fourth power of scope. The correct response is not to optimize the workflow but to decompose it, releasing resources incrementally and structuring recovery as a first-class concern.

Every monolithic agent task that can be safely decomposed into a saga *should* be decomposed. The design cost is fixed. The operational benefit compounds with system load. At scale, the difference between a system built on saga-decomposed workflows and one built on monolithic tasks is not marginal — it is the difference between a system that degrades gracefully and one that collapses under load.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: This book provides the formal justification and design criteria for decomposing complex agent tasks. The key insight is that decomposition requires *compensability* — each step must have a defined undo. Task decomposition agents should check whether proposed step boundaries satisfy individual consistency, whether intermediate state is externalized, and whether compensation is designable before committing to a decomposition.

- **Workflow Orchestration / Execution Planning**: The saga pattern is the theoretical foundation of every execution planner that manages multi-step tasks. Orchestrators should maintain a compensation stack (not just a task queue), support save-points for expensive intermediate states, and distinguish between step-level failures (retry) and saga-level failures (compensate or escalate).

- **Error Handling / Failure Recovery**: The paper's failure taxonomy (crash, deadlock, logic error, user abort, cascading rollback) provides the vocabulary for designing graduated recovery policies. Recovery skills should classify failures before choosing a response, and should support both backward (compensate) and forward (retry to completion) recovery paths with explicit policies for each failure type.

- **Architecture Design**: The "funds in transit" principle should be embedded in every architectural review of agent system state schemas. Intermediate workflow states must be explicitly represented as first-class concepts in the data model, not held in agent memory. Architectural review skills should check whether all inter-step data is externalized and durable.

- **State Management / Context Design**: The saga state table design directly informs how agent context should be stored. Each active workflow needs a durable record of: completed steps, compensation stack with parameters, current save-point, recovery policy, and escalation path. Context management should treat these as required fields, not optional metadata.

- **Debugging / Incident Response**: The saga execution model provides a structured audit trail for debugging workflow failures. Every step has a log entry; every compensation has a log entry; the saga state table shows exactly where a workflow stands. Debugging skills applied to failed workflows should read the saga state table as the primary diagnostic source.

- **Concurrency / Resource Management**: The paper's analysis of how deadlock frequency scales with the fourth power of transaction size is a direct input to concurrency management. Skills that manage concurrent workflow execution should prefer many small, resource-releasing steps over few large, resource-holding operations.

- **Skill Registration / Capability Design**: Every skill that produces side effects should, at registration time, declare its compensation action and the parameters required to execute it. This is not optional metadata — it is a prerequisite for any workflow that uses the skill to provide saga guarantees.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: WinDAGs is a saga executor. Every workflow it runs is either a saga (with defined compensations and recovery policies) or a degenerate monolithic operation. The paper provides the full theoretical framework for what WinDAGs is doing and what it should guarantee.

- **Task Decomposition**: The three decomposition strategies from the paper (follow real-world action sequence, follow data partition, minimize local variable transfer) are directly applicable design heuristics for breaking complex agent requests into orchestratable sub-tasks.

- **Failure Prevention**: The paper identifies the primary failure prevention mechanism: *not having large monolithic operations in the first place*. Proactive decomposition, with compensation design and state externalization, prevents the failure modes that recovery must handle.

- **Expert Decision-Making**: The paper models the expertise required for saga design: understanding which operations are naturally atomic vs. decomposable, which intermediate states are semantically consistent, and which side effects are compensable. This expertise cannot be mechanized — it requires domain knowledge about what operations mean in context.