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