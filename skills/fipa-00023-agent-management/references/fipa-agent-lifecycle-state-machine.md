# The Agent Lifecycle State Machine: Formal States, Transition Ownership, and What It Means for Orchestration

## Why Agents Need a Formal Lifecycle

An agent is not just a running process. It is a process with a history, a current mode of operation, and a future trajectory — and other agents need to reason about all three. Without a formal lifecycle model, you get a system where:

- Agents receive messages they cannot currently process (they're suspended) and silently drop them
- Orchestrators retry failed skill invocations indefinitely because they don't know the skill is in a non-recoverable state
- Agents get stuck in transitional states because there's no authority to resolve the stuck condition
- Message delivery behavior is unpredictable because senders don't know whether to buffer, retry, or fail fast

FIPA's Agent Management Specification (Section 5.1) defines a formal lifecycle for every agent on a platform. This is not a suggestion — it is the normative model that all compliant agents must implement. The lifecycle is:

> "AP Bounded — An agent is physically managed within an AP and the life cycle of a static agent is therefore always bounded to a specific AP. Application Independent — The life cycle model is independent from any application system and it defines only the states and the transitions of the agent service in its life cycle. Instance-Oriented — The agent described in the life cycle model is assumed to be an instance (that is, an agent which has unique name and is executed independently). Unique — Each agent has only one AP life cycle state at any time and within only one AP." (Section 5.1)

## The Six States

### Active
The normal operating state. The agent is running, processing messages, accepting invocations. The MTS delivers messages to the agent as normal.

### Initiated
The agent has been created but not yet invoked — it exists as an object but is not yet running. The MTS buffers messages (or forwards them based on configured forwarding) until the agent becomes active.

### Waiting
The agent has voluntarily suspended itself pending some external condition — for example, waiting for a response from another agent before it can proceed. Only the agent itself can initiate the Wait transition. Only the AMS can issue Wake Up (transition back to Active). Messages are buffered during waiting.

### Suspended
The agent has been paused, either by its own request or by the AMS. Unlike Waiting (which implies waiting for a specific condition), Suspended is an administrative pause — maintenance, resource management, or platform control. Resume can only be initiated by the AMS. Messages are buffered or forwarded.

### Transit
Only for mobile agents: the agent is in the process of migrating from one platform to another. The Move transition can only be initiated by the agent itself; the Execute transition (arriving at the destination) can only be initiated by the AMS. Messages are buffered until the agent arrives and becomes Active, or if the migration fails, until the agent returns to Active on the original platform.

### Unknown
The agent's state cannot be determined. The MTS either buffers messages or rejects them depending on platform policy. This is the "we don't know what happened" state, and it is important that it exists explicitly — unknown state is different from known states, and the system must handle it distinctly.

## The Transition Ownership Rules: This Is The Crucial Part

FIPA is meticulous about *who* can initiate each state transition. This is not incidental — it encodes a governance model for the agent system.

| Transition | Who Can Initiate | Notes |
|---|---|---|
| Create | AMS (on behalf of AP) | Agent comes into existence |
| Invoke | AMS (on behalf of AP) | Agent begins execution |
| Destroy | AMS only | Forceful, cannot be ignored |
| Quit | Agent or AMS | Graceful; agent CAN ignore an AMS quit request |
| Suspend | Agent OR AMS | Either party can pause |
| Resume | AMS only | Only AMS can un-pause |
| Wait | Agent only | Only agent can enter wait state |
| Wake Up | AMS only | Only AMS can exit wait state |
| Move | Agent only | Agent initiates migration |
| Execute | AMS only | AMS confirms arrival/activation |

The asymmetry is profound. Agents can put themselves into passive states (Wait, Suspend, Move) but cannot unilaterally bring themselves out. The AMS must issue the wake-up/resume/execute transition. This means:

**An agent cannot get stuck in a passive state and escape without AMS involvement.** If an agent is waiting and the condition it was waiting for never arrives, the AMS can detect this and either wake it up or destroy it. There is always an authority that can intervene.

**The Destroy transition is absolute**: "The forceful termination of an agent. This can only be initiated by the AMS and cannot be ignored by the agent." (Section 5.1). Every agent must implement the `quit` function as a mandatory function (Section 4.2.3). The AMS has a nuclear option that every agent must honor. This prevents rogue agents from making themselves unkillable.

**Graceful Quit can be ignored by the agent**: "The graceful termination of an agent. This can be ignored by the agent." (Section 5.1). This is realistic engineering: you request graceful shutdown first, and if the agent is mid-transaction and needs to complete it, it can finish. If it doesn't complete in a reasonable time, the AMS escalates to Destroy.

## Message Delivery Semantics per State

The lifecycle is connected to message delivery behavior in a specified way (Section 5.1):

- **Active**: Messages delivered normally. No surprises.
- **Initiated/Waiting/Suspended**: MTS either buffers messages (holding them until the agent returns to Active) or forwards them to a configured forwarding address. The choice is implementation-defined, but the behavior must be one of these two — messages must not be silently dropped.
- **Transit**: Buffer until Active (either at destination or back at origin if migration failed) or forward. Mobile-only.
- **Unknown**: Buffer or reject depending on MTS policy and message transport requirements.

The key insight: **the lifecycle state is the input to message delivery policy**. The MTS consults the lifecycle state before deciding what to do with a message. This means that every message routing decision implicitly queries the lifecycle state of the destination agent. The AMS's lifecycle tracking is therefore not administrative bookkeeping — it is load-bearing infrastructure for correct message delivery.

## Application to WinDAGs

### Every Skill Needs a Lifecycle

Every skill in WinDAGs should have an explicit lifecycle state maintained by the Orchestration Registry (the AMS analog). The minimal state set from FIPA is exactly right:

- **Active**: Accepting task invocations, processing normally
- **Initiated**: Skill process started but not yet ready to accept invocations (initialization in progress)
- **Waiting**: Skill has accepted a task and is blocked waiting for a dependency (e.g., waiting for a sub-skill to return results)
- **Suspended**: Skill is administratively paused (deployment in progress, maintenance window, resource constraint)
- **Unknown**: Skill health cannot be determined (process may have crashed, network may be partitioned)

### Transition Ownership in WinDAGs

Apply the FIPA ownership model:

- **Orchestrator (AMS analog)** can: Create skill instances, Destroy skill instances (forcefully), Resume suspended skills, Wake up waiting skills
- **Skill (agent analog)** can: Enter Wait state (when blocked on dependencies), Enter Suspend state (when it detects a condition requiring administrative intervention), initiate graceful Quit
- **Both**: Graceful shutdown (Quit)

This asymmetry is important in WinDAGs because it prevents "zombie skills" — skills that have entered a passive state and can't be recovered because no authority has the power to wake them. The orchestrator always has the ability to intervene.

### The Mandatory `quit` Equivalent

Every skill in WinDAGs must implement a graceful shutdown handler. The orchestrator must be able to request this, and if the skill doesn't respond within a timeout, the orchestrator must be able to force-terminate it. This is not optional robustness — it is the governance contract that makes the system manageable.

### Lifecycle State as Routing Input

When an orchestrator needs to route a task to a skill, it must consult the skill's lifecycle state before routing:

- **Active**: Route immediately
- **Initiated**: Queue the invocation — the skill will be ready soon
- **Waiting**: Depends on the task — if the skill is waiting for a dependency related to this task, queueing may be appropriate; if the skill is on a completely different task, route to a different instance
- **Suspended**: Do not route. If no other instance is available, either queue and wait for resume, or escalate to the orchestrator for a decision
- **Unknown**: Attempt route with circuit-breaker logic; if delivery fails, assume unavailable and re-route

This is the FIPA MTS delivery semantic translated to WinDAGs routing logic.

### Detecting and Recovering from Unknown State

The Unknown state deserves special attention because it is the most dangerous. An agent in Unknown state may be:
- Crashed (messages will fail)
- Partitioned (messages may succeed or fail unpredictably)
- Running but unregistered (messages may succeed but the registry is stale)

WinDAGs should treat Unknown state as requiring active recovery:
1. Attempt a health-check ping
2. If ping fails, attempt to force a new skill instance (Create transition)
3. If ping succeeds but state is inconsistent, attempt AMS-initiated Resume or state reconciliation
4. Log Unknown state entries as incidents requiring investigation

The existence of the Unknown state in the FIPA model is an acknowledgment that distributed systems always have periods of uncertainty, and that this uncertainty must be modeled explicitly, not hidden.

## The Agent Registration Protocol: A Concrete Example

Section 5.2 and Annex A together describe the complete registration dance. When an agent is created and wants to join the platform, it sends a `request` to the AMS with a `register` action containing an `ams-agent-description` including its name and desired initial state (typically `active`).

The AMS responds with:
1. First, an `agree` message — "I will process this"
2. Then, an `inform` message with `done` — "I have processed this successfully"

Or, if something went wrong, a `refuse` or `failure` with a specific exception predicate explaining why.

This two-phase response (agree then inform) is important: it separates the acknowledgment of receiving the request from the confirmation of its execution. A WinDAGs skill registration protocol should follow the same pattern to correctly handle the case where the registry accepts the request but then fails during processing.

## Caveats and Boundary Conditions

**Static systems**: If your WinDAGs deployment has a fixed set of skills that never move, never migrate, and never need to be administratively suspended, a full lifecycle state machine is overkill. A simple binary (alive/dead) may suffice. The full lifecycle pays off when skills are dynamic, deployed continuously, or managed across multiple platforms.

**State machine explosion**: FIPA's six states are chosen carefully to be minimal. Adding more states (e.g., "degraded," "overloaded," "read-only") creates richer semantics but also more complex transition logic. Resist the temptation to extend the state machine unless there is a clear operational use case.

**Who enforces the state machine**: The FIPA model assumes the AMS is a trusted, reliable authority. In WinDAGs, if the Orchestration Registry (AMS analog) itself fails, the lifecycle state machine breaks down — skills can't be created, destroyed, or recovered. The registry must be highly available and its lifecycle authority must be designed for resilience.

## Summary

The FIPA lifecycle state machine gives every agent in the system a formal, queryable, manageable state. The transition ownership rules create a governance model where agents can self-manage their passive states but the AMS always retains the authority to override. The connection between lifecycle state and message delivery semantics means that state management is not separate from communication — it is integral to it. For WinDAGs, this means: every skill must have an explicit lifecycle, the orchestrator must track it, routing decisions must consult it, and the orchestrator must always retain the ability to force-terminate any skill.