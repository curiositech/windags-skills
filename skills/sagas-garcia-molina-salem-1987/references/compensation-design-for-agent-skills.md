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