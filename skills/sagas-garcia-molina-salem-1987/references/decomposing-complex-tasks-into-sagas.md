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