---
license: Apache-2.0
name: sagas-garcia-molina-salem-1987
description: Long-lived transaction pattern using compensation-based rollback for distributed system consistency
category: Research & Academic
tags:
  - sagas
  - transactions
  - distributed-systems
  - compensation
  - databases
---

# SKILL.md — Sagas: Long-Running Workflows and Reliable Agent Orchestration

```markdown
---
license: BSL-1.1
name: sagas-agent-orchestration
version: 1.0.0
source: "Sagas" — Hector García-Molina & Kenneth Salem (1987)
description: >
  The theoretical foundation for designing multi-step agent workflows that
  either complete reliably or fail cleanly. Provides vocabulary, failure
  taxonomy, recovery strategies, and implementation patterns for any system
  orchestrating long-running, multi-step processes.
activation_triggers:
  - designing multi-step agent workflows or pipelines
  - asking how to handle failures in long-running agent tasks
  - building compensation, rollback, or undo logic for agent actions
  - decomposing complex tasks into orchestratable sub-tasks
  - designing state management between workflow steps
  - building orchestration layers on top of stateless infrastructure (LLMs, APIs)
  - diagnosing deadlocks, resource starvation, or reliability failures in workflows
  - WinDAGs, saga executors, or durable execution systems
---
```

---

## When to Use This Skill

Load this skill when the problem involves **a multi-step process where partial execution is dangerous** — where a failure mid-way leaves the world in a worse state than either full completion or never starting.

Specifically:

- **Workflow design**: You're breaking a complex task into steps and need to know where the seams should be, what passes between steps, and what happens if step 4 of 7 fails.
- **Failure handling**: You need a principled framework for deciding whether to retry, compensate, or abort — not just "catch the exception."
- **State design**: You're choosing what intermediate state to persist, where, and in what form.
- **Orchestration architecture**: You're building or evaluating a system that coordinates multi-step agent work on top of infrastructure that doesn't natively support it.
- **Reliability analysis**: A workflow is failing in ways that are hard to reason about and you need a taxonomy to diagnose why.

**The core signal**: Any time someone says "what happens if it fails halfway through?" — this skill is relevant.

---

## Core Mental Models

### 1. Every Long-Running Process Is Either a Saga or a Liability

A monolithic long-running operation holds resources — locks, context, connections, attention — for its entire duration. The cost compounds: **deadlock frequency grows with the fourth power of transaction size**. The solution is not optimization; it is decomposition. A saga is a sequence of smaller, individually-completing transactions. Each sub-transaction releases resources when it finishes. The aggregate operation becomes a *sequence of safe steps* rather than one dangerous span.

**Agent translation**: A monolithic agent task that chains API calls, writes, and LLM completions in one uninterrupted flow is a long-lived transaction. It holds tokens, context windows, rate-limit budgets, and downstream locks. Decompose it — or accept the liability.

---

### 2. Compensation Is Not Rollback — It Is a Forward Action That Semantically Cancels

When a saga step completes, its effects become visible to the rest of the world. Other processes may read that state, act on it, branch because of it. A true rollback — pretending the step never happened — is impossible. Instead, a **compensating transaction** is a *new action* that moves the world to a semantically equivalent state to what would have existed if the original step had never run.

This distinction matters enormously:
- Rollback is a database primitive that erases history.
- Compensation is a domain operation that acknowledges history and corrects it.

**Agent translation**: If an agent sends a Slack message as step 2 of 7, and step 5 fails, you cannot unsend the message. Your compensation must be a *new* message: "Disregard my earlier message — the operation was cancelled." Compensation design requires domain knowledge about what "undoing" means in context.

---

### 3. Recovery Has Two Directions — Choose Explicitly

When a saga fails mid-execution, there are exactly two recovery philosophies:

| | **Backward Recovery** | **Forward Recovery** |
|---|---|---|
| **Mechanism** | Compensate completed steps, return to pre-saga state | Checkpoint progress, retry from last known-good state |
| **When appropriate** | Compensation is possible; failure state is acceptable | Operation *must* eventually succeed; compensation is impossible or too costly |
| **Risk** | Compensation logic is complex and can itself fail | Partial states persist longer; idempotency is required |

**Agent translation**: Some workflows should be aggressively driven to completion (forward); others should unwind cleanly on failure (backward). **This choice must be made at design time, not at failure time.** Conflating them — retrying a little, then giving up without compensating — produces the worst outcome.

---

### 4. The Database (State Store) Must Know About In-Transit Data

The paper identifies a subtle design principle: when a saga moves data between steps, that data is "in transit" — it has left one state but not yet arrived at another. If this in-transit data exists only in application memory, a crash loses it. The recommendation is to **externalize in-transit state into the persistent store itself**, so that any recovery process can find it, reason about it, and act on it.

**Agent translation**: Workflow state that lives only in an LLM's context window, or in a local variable between agent calls, is in-transit data that will vanish on failure. Durable orchestration requires writing intermediate state to persistent storage at every step boundary — not just the final result.

---

### 5. You Can Build Saga Infrastructure on Top of Anything

The paper demonstrates — via the "saga daemon" pattern — that saga semantics can be layered on top of systems that have no native understanding of long-running transactions. The ingredients are minimal:
1. **A persistent coordinator** (the daemon) that survives crashes
2. **A durable log** of completed steps and their compensation instructions
3. **Subroutine wrappers** that make each step and its compensation a callable unit
4. **A recovery procedure** that reads the log and drives execution to a terminal state

**Agent translation**: WinDAGs, LangGraph, and similar orchestration layers *are* saga daemons. You don't need the LLM to understand workflow recovery — you need the *orchestration layer* to maintain the log and drive recovery. This is why orchestration is not optional for reliable agent systems.

---

## Decision Frameworks

### IF a workflow step has side effects in the external world → THEN design compensation before building the step

Never implement a step that emails, writes, posts, bills, or modifies external state without simultaneously designing its compensating action. The question: *"What would we do to semantically undo this if required?"* If there is no answer, that step may need to be redesigned, delayed, or gated.

---

### IF a workflow can tolerate eventual failure → THEN use backward recovery with defined compensation chains

Map out: step 1 → step 2 → ... → step N, and for each step i, define C(i). If step k fails, execute C(k-1), C(k-2), ... C(1) in order. This must be designed as a complete sequence, not improvised at failure time.

---

### IF a workflow must eventually succeed (idempotent, retriable) → THEN use forward recovery with checkpoints

Design each step to be idempotent (safe to re-execute). Checkpoint state after each step. On failure, resume from the last checkpoint. Ensure your orchestration layer — not application code — owns the retry logic.

---

### IF a task feels "too complex to decompose" → THEN apply the three decomposition strategies in order:

1. **Follow the real-world action sequence**: What sequence of actions does a human expert perform? Each action is a candidate step.
2. **Follow data partitions**: Can the work be divided by data entity (user, order, account)? Each partition is a parallel sub-saga.
3. **Minimize inter-step data transfer**: If steps share too much local state to be truly independent, the decomposition is wrong. Redesign until each step's inputs and outputs are minimal.

---

### IF intermediate state will be visible to other processes → THEN design for semantic consistency, not isolation

You cannot hide partial saga state. Instead, ensure each intermediate state is *semantically consistent* — it should represent a valid real-world state, even if it's a temporary one. "Funds reserved" is a valid state. "Funds partially transferred" is not. Design your states explicitly.

---

### IF your infrastructure crashes mid-saga → THEN recovery depends on durable logs, not application restarts

The saga daemon must read the persistent log to determine: which steps completed, which compensations are pending, and what terminal state to drive toward. If this log doesn't exist, recovery is guesswork. Log every step completion and every compensation execution.

---

## Reference Files

Load these on demand when the current task requires deeper guidance:

| File | Load When... |
|---|---|
| `references/saga-pattern-for-agent-workflows.md` | You need the full theoretical foundation — what a saga IS, the formal definitions, and why the pattern exists at all |
| `references/compensation-design-for-agent-skills.md` | You're designing or evaluating compensating actions for specific agent skills; need the design criteria for valid compensation |
| `references/forward-vs-backward-recovery-in-agent-workflows.md` | You're deciding whether a workflow should retry-to-completion or unwind-and-compensate on failure |
| `references/decomposing-complex-tasks-into-sagas.md` | You're breaking a complex task into steps and need the decomposition heuristics and design principles |
| `references/the-saga-daemon-orchestration-without-native-support.md` | You're building or evaluating an orchestration layer; need implementation patterns for the persistent coordinator |
| `references/failure-taxonomy-and-recovery-design.md` | You're diagnosing a workflow failure; need the taxonomy of failure types and their prescribed responses |
| `references/designing-state-for-saga-compatibility.md` | You're designing what state to persist between steps; need the "funds in transit" principle and related patterns |
| `references/the-cost-of-monolithic-operations.md` | You need to make the case for decomposition; need the cost analysis of long-lived monolithic operations |

---

## Anti-Patterns

These are the mistakes the paper implicitly or explicitly warns against:

**1. Designing for the happy path, ignoring compensation**
Building workflow steps without their compensating actions is the most common failure. Systems that handle success beautifully and failure catastrophically have this flaw. Compensation must be designed *before* the step goes to production.

**2. Treating compensation as rollback**
Attempting to pretend intermediate state never existed — rather than writing a new corrective action — produces systems that corrupt state because they ignore what the external world may have already done with the intermediate state.

**3. Choosing forward or backward recovery at failure time**
The recovery strategy is a design decision, not a runtime decision. A system that "tries retrying, then gives up without compensating" has made both choices poorly. Recovery mode must be specified at workflow design time.

**4. Storing in-transit state only in memory**
Workflow state that survives only in application memory, a local variable, or an LLM context window will be lost on any crash. Durable sagas require persistent state at every step boundary.

**5. Decomposing steps that are too tightly coupled**
If step 3 cannot be executed without the full internal state of step 2, the decomposition is wrong. True saga steps are loosely coupled — each receives minimal, well-defined inputs and produces minimal, well-defined outputs.

**6. Building monolithic orchestration on stateless infrastructure**
Running a 20-step agent workflow as a single LLM prompt chain with no checkpointing is the cognitive equivalent of a long-lived database transaction. Every step failure requires starting over. This does not scale.

**7. Ignoring failure taxonomy**
Treating all failures the same — retrying network timeouts with the same logic as business rule violations — produces systems that do the wrong thing confidently. Different failure types require different responses.

---

## Shibboleths

How to tell if someone has genuinely internalized the Sagas paper vs. read a summary:

**They say "compensating transaction" and mean something specific.**
A surface reader treats compensation as synonymous with rollback or undo. Someone who has internalized the paper knows compensation is a *new forward action* — it cannot pretend the past didn't happen, because others may have observed it.

**They immediately ask "what's the compensation?" when evaluating a new workflow step.**
Compensation design is not an afterthought; it's part of the definition of a step. Someone who's internalized this won't approve a step design that doesn't include its corresponding compensating action.

**They distinguish between forward and backward recovery without prompting.**
When a workflow fails, the uninitiated ask "how do we retry?" Someone who's internalized the paper asks "is this a forward-recovery situation or a backward-recovery situation?" — and knows this is a design question, not a runtime question.

**They know that the fourth-power relationship matters.**
The paper's key quantitative claim — that deadlock frequency grows with the fourth power of transaction size — is not decorative. Someone who has internalized it knows that *small, frequent transactions beating one large one is not a style preference; it is a reliability property.*

**They design state stores before they design workflow steps.**
The "funds in transit" insight — that intermediate state must live in the database, not in application memory — changes how you think about system design. Someone who's absorbed this designs the state schema *before* they design the orchestration logic.

**They see WinDAGs / LangGraph / Temporal as saga daemons.**
The specific connection between the paper's "saga daemon" pattern and modern orchestration frameworks is the key cross-domain insight. Someone who's internalized the paper recognizes that these systems are solving the exact problem García-Molina and Salem solved in 1987 — and can reason about what guarantees those systems should and shouldn't provide.

**They push back on "can't we just make it one big transaction?"**
The uninitiated see decomposition as complexity. Someone who's internalized the paper knows that the monolithic transaction IS the complexity — it just hides it until it explodes. They can articulate the cost of not decomposing.