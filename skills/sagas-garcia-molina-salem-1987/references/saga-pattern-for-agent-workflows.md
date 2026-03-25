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