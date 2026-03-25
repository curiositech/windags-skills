## BOOK IDENTITY

**Title**: FIPA Agent Management Specification (XC00023H)
**Author**: Foundation for Intelligent Physical Agents (FIPA)
**Core Question**: How should autonomous agents be named, discovered, registered, lifecycled, and managed within and across platforms so that interoperability is possible without central omniscience?
**Irreplaceable Contribution**: This is the canonical formal specification for multi-agent system infrastructure. Unlike academic papers or textbooks about agents, this document defines the actual normative contracts — the precise ontology, message formats, exception taxonomies, and lifecycle states — that a production multi-agent system must implement. It is irreplaceable because it encodes decades of committee consensus about what minimal, interoperable agent infrastructure must look like. No other document gives you this specific combination: formal ontology + lifecycle state machine + exception taxonomy + directory federation + transport abstraction, all in one coherent normative model.

---

## KEY IDEAS (3-5 sentences each)

1. **Separation of Identity from Location**: An Agent Identifier (AID) is not an address — it is a stable symbolic name that can be *resolved* to transport addresses through a chain of resolvers. This separation means an agent can move, gain new capabilities, or be contacted through multiple protocols without its identity changing. For WinDAGs, this principle implies that skill routing should never hard-code endpoints; it should always resolve capabilities through a registry that tracks current state.

2. **Two-Registry Architecture (White Pages + Yellow Pages)**: The AMS provides white pages (who exists, what is their state) while the DF provides yellow pages (who offers what service). These are deliberately separate concerns: existence/lifecycle authority is distinct from capability advertisement. Agent systems collapse when these are conflated — you end up with either stale capability listings or inability to manage agent state independently of service availability.

3. **Agent Lifecycle as a Formal State Machine**: FIPA defines exactly six named states (Initiated, Active, Waiting, Suspended, Transit, Unknown) with explicit transition ownership (some transitions can only be initiated by the AMS, some only by the agent itself). This prevents a whole class of coordination failures where agents attempt operations on peers whose state they have not verified. The lifecycle is not an implementation detail — it is the contract between agents.

4. **Exception as First-Class Ontology**: Failures are not just error codes — they are structured predicates with semantic meaning (unsupported, unrecognised, unexpected, missing, unauthorised, already-registered, not-registered, internal-error). This means a receiving agent can *reason* about why something failed, not just retry blindly. WinDAGs should model failure returns with the same richness.

5. **Federation as Scalable Discovery**: Directory Facilitators can register with each other, creating federated search graphs. Search propagates depth-first with configurable max-depth and max-results constraints. This is the model for how a large skill ecosystem should be discoverable — not a flat global registry, but a federated graph of registries with bounded search.

---

## REFERENCE DOCUMENTS

### FILE: fipa-identity-vs-location-separation.md
```markdown
# Identity Is Not Location: The AID Principle and What It Means for Agent Routing

## The Core Problem This Solves

In naive agent systems, an agent is identified by where it lives: a URL, an IP address, a queue name. This conflates two fundamentally different things — *who* an agent is and *how* you reach it right now. When the agent moves, scales, changes protocols, or its host fails, every other agent that held a reference to it breaks. The entire system becomes brittle in proportion to how many agents know each other's addresses.

FIPA's solution, formalized in Section 3 of the Agent Management Specification, is the **Agent Identifier (AID)**: an extensible collection of parameter-value pairs where the `:name` field is a globally unique, *immutable* symbolic identifier, and the `:addresses` field is a *mutable* sequence of transport addresses that can change over time.

> "The name of an agent is immutable and cannot be changed during the lifetime of the agent; the other parameters in the AID of an agent can be changed." (Section 3, footnote 1)

This single design decision has enormous downstream consequences for how an agent system handles routing, failure, migration, and capability evolution.

## The Structure of an AID

An AID contains three key fields:

- **`:name`** — A globally unique symbolic name, typically constructed as `agent-name@home-agent-platform`. This is the permanent identity. It never changes.
- **`:addresses`** — A sequence of transport addresses (URLs per RFC2396) where the agent can currently be reached. The order implies preference. This is ephemeral and updatable.
- **`:resolvers`** — A sequence of AIDs of name resolution services (typically AMS instances) that can translate the name into current addresses when the addresses field is absent or stale.

The extensible nature of AID design also allows attaching social names, roles, and other contextual identity attributes as optional parameters, enabling the same underlying agent to present different faces in different contexts without losing its core identity anchor.

## Name Resolution as a Protocol, Not a Lookup

When AgentA wants to contact AgentB but only has AgentB's name (not current addresses), the resolution process works as follows (Section 3.2):

1. AgentA examines AgentB's AID `:resolvers` field to find a name resolution service (typically an AMS).
2. AgentA sends a `search` request to that AMS, asking for AgentB's current description.
3. If the AMS has AgentB registered, it returns an `ams-agent-description` containing AgentB's current transport addresses.
4. AgentA extracts the `:addresses` parameter and can now contact AgentB directly.
5. If the first resolver fails, AgentA can try the next in the sequence.

This is an *active* resolution protocol, not a passive lookup. It means the system can handle agents that move across platforms (the Transit lifecycle state), agents with multiple transport protocols, and agents whose addresses change over time — all without requiring senders to update their stored references.

## Why the Immutability of `:name` Matters

The immutability constraint is not bureaucratic formalism — it is what makes the entire identity/location separation work. If names could change, then:
- References cached by other agents would silently become wrong
- Audit logs would become uninterpretable
- Security policies keyed to agent names would become gameable (an agent could rename itself to impersonate another)
- The AMS's white pages directory would have no stable primary key

By making the name immutable and the addresses mutable, FIPA creates a stable identity anchor around which everything else can change. An agent can gain new capabilities, move to a new platform, add new transport protocols, and acquire new roles — but it remains the same agent, traceable through its history.

## The Home Agent Platform (HAP) Concept

The simplest AID naming convention constructs the name as `agent-name@hap` where HAP is the Agent Platform on which the agent was *created*. This is analogous to a birthplace: it tells you where the agent originated, not where it currently lives.

> "The HAP of an agent is the AP on which the agent was created." (Section 3, footnote 2)

This is significant because it means an agent that has migrated to a completely different platform still carries its origin in its name. You can always trace an agent back to its point of creation. For distributed systems this is invaluable for debugging, auditing, and accountability.

## Application to WinDAGs Skill Routing

### Problem: Hard-coded Skill Endpoints Break

The most common failure mode in skill-based orchestration systems is routing that is too tightly coupled to the *current location* of a skill rather than its *stable identity*. When a skill is refactored, moved to a different service, replicated for load balancing, or versioned, all routing rules that referenced the old endpoint break simultaneously.

### Solution: Skill Identifiers Separate from Skill Endpoints

Apply the AID principle: every skill in WinDAGs should have a stable symbolic identifier (e.g., `skill:code-review@platform-v1`) that never changes, and a separately maintained routing table that maps that identifier to current invocation endpoints. The routing table is the `:addresses` equivalent — mutable, platform-managed, updated when skills move or scale.

### Resolver Chains for Skill Discovery

For skills that need to be discovered dynamically rather than looked up by known identifier, implement resolver chains analogous to the `:resolvers` AID field. A task agent should be able to say "I need a skill of type `security-audit` that speaks `OWASP-ontology`" and have a resolution protocol that traverses registered skill directories to find current endpoints — rather than encoding that endpoint in the task definition.

### Versioning Without Breaking References

When a skill is upgraded to a new version, the old version's symbolic identifier remains valid and points to the old implementation. The new version gets a new identifier. Agents that have cached the old identifier continue working. Agents that want the new version discover it through the directory. This is graceful versioning: no forced upgrades, no silent behavioral changes, clear provenance.

### Immutable Task IDs, Mutable Task State

Apply the same principle to tasks: a task spawned by an orchestrator gets an immutable task ID at creation. Its state (pending, running, waiting, failed, completed) is mutable and tracked by the orchestration system. Any agent in the system can query the task state using the task ID without needing to know where the task is currently executing.

## Boundary Conditions and Caveats

**When this principle adds unnecessary overhead**: In a closed, non-migratory system where agents never move and endpoints never change, the indirection layer of name resolution adds latency for no benefit. If your system is a small set of fixed services that you control completely, hard-coded endpoints may be simpler and faster.

**When resolver chains can become a single point of failure**: If all resolution goes through a single AMS and that AMS fails, no new connections can be established. FIPA's response is to allow multiple resolvers in the sequence, and to allow the AMS to be replicated. WinDAGs should similarly ensure that the skill registry is highly available and that agents cache resolved addresses with appropriate TTLs so they can operate even when the registry is temporarily unreachable.

**The stale address problem**: A cached `:addresses` value may become stale if the agent has moved since the last resolution. Systems must either accept occasional failed deliveries (and then re-resolve) or implement push notification from the AMS when agent addresses change. FIPA's MTS handles this by buffering messages to agents in Transit state — a pattern WinDAGs can replicate by queueing invocations to skills that are being redeployed.

## Summary Principle

> Identify by name. Route by address. Resolve name to address on demand. Never conflate the two.

This principle, if consistently applied throughout WinDAGs, eliminates an entire class of fragility: the system becomes robust to skill migration, versioning, replication, and platform evolution because no agent ever holds a hard reference to a location — only a stable reference to an identity.
```

### FILE: fipa-two-registry-architecture.md
```markdown
# Two Registries, Two Concerns: The AMS/DF Split and Why It Matters for Orchestration

## The Fundamental Insight

Most systems, when they think about "service discovery," collapse two distinct concerns into one: *who exists and is alive* versus *what services are currently being offered*. FIPA's Agent Management Specification makes a principled separation between these, embodied in two distinct mandatory infrastructure components:

- **The Agent Management System (AMS)**: "white pages" — knows *who* is registered, what lifecycle state they are in, and whether they are authorized to communicate. One per platform. Authoritative.
- **The Directory Facilitator (DF)**: "yellow pages" — knows *what services* agents have advertised. Potentially many per platform, federatable. Non-authoritative (the DF cannot verify the services it lists are actually working).

> "The AMS is responsible for managing the operation of an AP, such as the creation of agents, the deletion of agents, deciding whether an agent can dynamically register with the AP and overseeing the migration of agents to and from the AP." (Section 4.2.1)

> "A DF is a mandatory component of an AP that provides a yellow pages directory service to agents. It is the trusted, benign custodian of the agent directory. It is trusted in the sense that it must strive to maintain an accurate, complete and timely list of agents. It is benign in the sense that it must provide the most current information about agents in its directory on a non-discriminatory basis to all authorised agents." (Section 4.1.1)

## Why One Registry Is Not Enough

Consider what happens when you conflate existence and capability in a single registry:

**Scenario A — Dead agent, live capability listing**: An agent crashes but its capability advertisement remains in the registry. Other agents query the registry, get the address, attempt to invoke the capability, and fail. If the registry is the only source of truth about both existence AND capability, there is no clean way to distinguish "this service doesn't exist" from "this service exists but its agent is dead."

**Scenario B — Live agent, stale capability listing**: An agent upgrades and now offers a different version of a service. But its DF registration hasn't been updated yet. Other agents query for the old capability type, don't find it (because the DF only shows the new type), and conclude no such service exists — even though the agent is alive and perfectly capable.

**Scenario C — Capability advertisement without authorization**: In a single-registry system, if you can register a capability, you implicitly assert you have the right to operate. But the authorization question (is this agent allowed to be on this platform at all?) and the advertisement question (what does this agent offer?) are separate. An agent should be able to be authorized to operate (AMS-registered) without having advertised any services yet (not DF-registered). And conversely, an agent can be found in the DF as having offered a service historically even after it has deregistered from the AMS.

The AMS/DF split makes all these scenarios tractable.

## The AMS: Authority, Lifecycle, and Access Control

The AMS is a *mandatory singleton per platform* with genuine authority:

> "The AMS represents the managing authority of an AP and if the AP spans multiple machines, then the AMS represents the authority across all machines. An AMS can request that an agent performs a specific management function, such as quit (that is, terminate all execution on its AP) and has the authority to forcibly enforce the function if such a request is ignored." (Section 4.2.1)

The AMS's responsibilities:
- Maintains the authoritative list of agents currently resident on the platform (white pages)
- Validates globally unique agent names within its platform
- Tracks lifecycle state for each agent (initiated, active, waiting, suspended, transit, unknown)
- Controls access to the Message Transport Service — only AMS-registered agents can send/receive messages
- Can force-terminate agents that don't respond to graceful quit requests
- Is the custodian of the AP Description (platform capabilities metadata)

The AMS is the *authorization boundary*. An agent must register with the AMS to get a valid AID and to gain access to the platform's communication infrastructure. This is not optional. This is the gatekeeper.

The AMS maintains `ams-agent-description` objects with three fields: the agent's AID (`:name`), ownership (`:ownership`), and lifecycle state (`:state`). The lifecycle state field is the AMS's primary contribution — it tells you whether the agent is currently active, suspended, waiting, or in transit.

## The DF: Discovery, Advertisement, and Federation

The DF has a different character from the AMS. Where the AMS is authoritative and mandatory (one per platform, enforces access), the DF is:

- **Non-authoritative**: "The DF cannot guarantee the validity or accuracy of the information that has been registered with it." (Section 4.1.1). The DF stores what agents *tell it* — it cannot verify that an advertised service actually works.
- **Multiple instances allowed**: "An AP may support any number of DFs and DFs may register with each other to form federations." (Section 4.1.1)
- **Benign non-discriminator**: Must provide results to all authorized agents without favoritism.

The DF stores `df-agent-description` objects that include: the agent's AID, the set of services it offers (each described by `service-description`), interaction protocols supported, ontologies known, and content languages supported.

Crucially: "There is no intended future commitment or obligation on the part of the registering agent implied in the act of registering. For example, an agent can refuse a request for a service which is advertised through a DF." (Section 4.1.1)

This last point is subtle and important: the DF is a *hint*, not a contract. Finding an agent in the DF only tells you that agent *claimed* to offer a service. Whether it will actually accept your request when you send it is a separate question, governed by the agent's own internal logic.

## The Separation Enables Independent Evolution

Because the AMS and DF track different things:

1. **An agent can be alive (AMS-registered) but offering no services** — useful during initialization, testing, or maintenance modes
2. **An agent can advertise services (DF-registered) for the duration it is active, then deregister from the DF when going into maintenance mode** — without losing its AMS registration or lifecycle state
3. **Multiple DFs can specialize** — one DF for public services, one for internal platform services, one for experimental capabilities — all coexisting on the same platform
4. **DF federations can span platforms** — enabling cross-platform discovery without AMS federation (which would imply cross-platform authority, a much stronger and more problematic claim)

## Application to WinDAGs Architecture

### Two Distinct Registries for WinDAGs

WinDAGs should maintain the equivalent of both registries:

**The Orchestration Registry (AMS analog)**:
- Tracks every skill and agent in the system: its unique ID, current lifecycle state, owning orchestrator, and authorization level
- Is the gatekeeper for message routing — only registered entities can receive routed tasks
- Has the authority to force-terminate runaway agents or skills
- Maintains the "platform description" — what capabilities does this WinDAGs deployment support?

**The Skill Capability Directory (DF analog)**:
- Stores capability advertisements: what each skill can do, what ontologies/schemas it understands, what input/output types it accepts, what protocols it supports
- Is searched by orchestrators looking for skills to assign to task steps
- Is explicitly *non-authoritative* — finding a skill in the directory only means it *claims* to support a capability; the skill itself may refuse a specific invocation
- Can be federated: a WinDAGs deployment might have a local skill directory and federate with remote directories to discover cross-platform capabilities

### Practical Consequences

**Skill onboarding**: When a new skill is added to WinDAGs, it must first register with the Orchestration Registry (get an ID, declare ownership, enter the lifecycle) before it can register with the Skill Directory (advertise capabilities). The two steps are sequential and have different authorization requirements.

**Skill maintenance**: A skill can be taken offline for maintenance by deregistering from the Skill Directory (so no new tasks are routed to it) while remaining registered with the Orchestration Registry (so its lifecycle state is tracked and any in-flight tasks it has accepted can complete).

**Capability search**: When an orchestrator needs to decompose a task and find a skill for a step, it searches the Skill Directory with a capability template. The template matching (described further in `fipa-capability-search-and-matching.md`) allows partial specification — you can search for "any skill that understands `code-review-ontology` and supports `OWASP-v4` properties" without knowing the skill's name.

**Cross-cutting concern**: Authorization decisions (is this orchestrator allowed to invoke this skill?) are handled by the Orchestration Registry. Capability matching decisions (does this skill support this type of task?) are handled by the Skill Directory. Never mix these concerns in a single lookup.

### The Non-Authoritative DF is a Feature, Not a Bug

New engineers often react to the DF's non-authoritativeness as a flaw: "Why have a directory that might be wrong?" The answer is that accuracy-on-registration and accuracy-at-invocation-time are genuinely different properties with different costs to maintain.

A fully authoritative directory would require:
- Real-time health checks of every registered capability
- Automatic deregistration of failed agents
- Immediate propagation of capability changes

This creates tight coupling between the directory and every agent's health, creates scalability problems (health-checking 180+ skills continuously), and creates false negatives (a skill that is temporarily slow gets deregistered and missed by orchestrators that need it).

The FIPA model embraces eventual consistency: the directory reflects what agents *intended* to offer. Whether they can deliver right now is discovered at invocation time, with the invoking agent handling failures gracefully. This scales to thousands of agents in ways that a health-checked directory cannot.

## Caveats and Boundary Conditions

**When you need strong consistency**: For safety-critical workflows where routing to a dead skill must never happen, the non-authoritative DF model is insufficient. You may need health-check wrappers around the DF that validate liveness before returning search results. FIPA doesn't preclude this — it just doesn't mandate it, because it would be too expensive in the general case.

**When one registry is enough**: In a small, static WinDAGs deployment with fewer than ~20 skills all running on a single platform, the operational overhead of two separate registries may not be worth it. A unified registry with clearly separated schema fields (lifecycle state vs. capability advertisement) may be a pragmatic simplification.

**The staleness window**: Because agents self-report their capabilities to the DF, there is always a window between when an agent gains or loses a capability and when the DF reflects that change. Orchestrators must design for this by treating DF results as hints and handling invocation failures gracefully, including re-querying the DF if a recommended skill fails.

## Summary

The two-registry architecture is one of FIPA's deepest contributions to multi-agent systems design. Its core insight: existence/authorization and capability/advertisement are different concerns that evolve on different timescales, with different authorities, and with different consistency requirements. Conflating them produces systems that are simultaneously over-coupled and under-informative. Separating them produces systems where agents can be managed, discovered, and invoked through clean, independent interfaces.

For WinDAGs: maintain an Orchestration Registry with lifecycle authority and an Skill Capability Directory with capability advertisement. Keep them separate. Route through the directory. Authorize through the registry. Handle DF non-authoritativeness gracefully at invocation time.
```

### FILE: fipa-agent-lifecycle-state-machine.md
```markdown
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
```

### FILE: fipa-exception-taxonomy-as-reasoning-tool.md
```markdown
# Exceptions as Ontology: Why Failure Taxonomies Enable Agent Reasoning

## The Problem with Opaque Failures

In most distributed systems, when something goes wrong, you get back an error code and a string message. The error code tells you very little: HTTP 400 (bad request) conflates dozens of different failure modes. The string message is human-readable but not machine-processable. An agent receiving a 400 error cannot distinguish between "you sent the wrong ontology," "you're not authorized," "that function doesn't exist," or "you sent too many arguments" — all of which require completely different remediation strategies.

FIPA's Agent Management Specification takes a radically different approach: failures are structured predicates in a formal ontology, not error codes. An exception is not an interruption to the normal flow — it is a typed, semantic assertion about *why* something failed, expressed in the same content language (FIPA-SL0) as normal messages.

> "Under some circumstances, an exception can be generated, for example, when an AID that has been already registered is re-registered. These exceptions are represented as predicates that become true." (Section 6.3)

## The Four Exception Classes

FIPA defines four top-level exception classes that structure the space of possible failures (Section 6.3.2):

### 1. `unsupported`
The communicative act and its content have been understood by the receiving agent, but it does not support that action. This is a capability gap — the receiver understood what was asked but cannot do it.

**Example**: Sending a `modify` request to an AMS that is configured as read-only. The AMS understood the request perfectly; it just doesn't support modification.

**Remediation**: Find a different agent that does support the function. Do not retry with the same agent.

### 2. `unrecognised`
The content has not been understood by the receiving agent. This is a parsing/interpretation failure — the receiver could not make sense of what was sent.

**Example**: Sending a message in an ontology the receiver hasn't loaded, or using a content language it doesn't speak.

**Remediation**: Check message format, ontology, and language compatibility. Re-send with a compatible representation.

### 3. `unexpected`
The content has been understood, but it includes something that was not expected in this context. This is a contextual error — the individual parts are recognized, but their combination or timing is wrong.

**Example**: Sending a parameter that is valid in isolation but not valid for this particular function call context (like sending `unexpected-argument` — a function argument that is present but not required).

**Remediation**: Re-examine the message construction logic. The sender made a logical error in assembling the message.

### 4. `missing`
The content has been understood, but something that was expected is absent. The inverse of `unexpected`.

**Example**: Sending a `register` request without including a mandatory AID parameter.

**Remediation**: Add the missing element and retry.

## Three Communicative Act Types for Exceptions

The exception classes are delivered through three different communicative acts, each with its own semantic implications (Section 6.3.1):

### `not-understood`
Used when the receiving agent cannot parse or interpret the incoming communicative act itself. The entire message is opaque to the receiver. This is the most fundamental failure — below the level of semantics.

The `not-understood` predicates (Section 6.3.3):
- `unsupported-act` (String): The receiver doesn't support this type of communicative act at all
- `unexpected-act` (String): The receiver supports the act type but it's out of context here
- `unsupported-value` (String): The receiver doesn't support the value of a specific message parameter
- `unrecognised-value` (String): The receiver can't parse the value of a specific message parameter

### `refuse`
Used when the request was understood but will not be processed — either because the receiver doesn't support it, doesn't have permission to allow it, or the message is logically ill-formed.

The `refuse` predicates (Section 6.3.4):
- `unauthorised`: You don't have permission
- `unsupported-function` (String): The function name is not supported
- `missing-argument` (String): A required function argument is absent
- `unexpected-argument` (String): An argument was provided that is not required
- `unexpected-argument-count`: Wrong number of arguments
- `missing-parameter` (String, String): A mandatory parameter within an argument is missing (object name + parameter name)
- `unexpected-parameter` (String, String): An unexpected parameter was present (function name + parameter name)
- `unrecognised-parameter-value` (String, String): The parameter value could not be recognised (object name + parameter name)

### `failure`
Used when the request was accepted (an `agree` was previously sent) but execution failed. This is a *runtime* failure, not a message-level failure. The request was valid; something went wrong during processing.

The `failure` predicates (Section 6.3.5):
- `already-registered`: Tried to register something that's already registered
- `not-registered`: Tried to operate on something that isn't registered
- `internal-error` (String): Something went wrong inside the receiver that isn't the sender's fault

## The Two-Phase Commit Pattern Hidden in the Exception Model

Notice the distinction between `refuse` and `failure`. The FIPA-Request protocol (referenced in Section 6.3) works as follows:

1. Sender sends `request`
2. Receiver sends `agree` (I will try to do this) OR `refuse` (I won't even try, here's why)
3. If `agree` was sent, receiver later sends `inform done` (success) OR `failure` (I tried and failed, here's why)

This is a *two-phase commit pattern* for agent interactions. The `refuse` happens before any state change is attempted. The `failure` happens after a state change was attempted and failed. This distinction matters enormously:

- `refuse` means: "Don't expect any side effects. The state hasn't changed. Retry with a corrected message or find a different agent."
- `failure` means: "A state change was attempted. The system may be in a partially-changed state. Before retrying, you should query the current state of the affected objects."

The Annex A dialogue examples make this explicit: the AMS sends `agree` then `inform done` on success (examples 2 and 4). If something went wrong after agreement, a `failure` would be sent instead of `inform done`.

## Exception Selection Logic: A Decision Tree

Section 6.3.1 specifies the exact rules for which communicative act to use:

1. If the communicative act itself is not understood → `not-understood`
2. If the requested action is not supported → `refuse`
3. If the action is supported but the sender is not authorized → `refuse`
4. If the action is supported and sender is authorized but the message is syntactically/semantically malformed → `refuse`
5. In all other cases → `agree`, then later either `inform done` or `failure`

This is a clean decision tree that separates four different things: comprehension failure, capability gap, authorization failure, message quality failure, and execution failure. Each requires a different response from the sender.

## Application to WinDAGs Error Handling

### Current Problem: Undifferentiated Failure

Most orchestration systems treat all skill invocation failures the same: log the error, possibly retry, possibly route to a fallback. This is inadequate because the correct response depends entirely on *why* it failed:

- If a skill returned `unsupported-function`, retrying is pointless — the skill genuinely cannot do this. Route to a different skill.
- If a skill returned `missing-parameter`, the orchestrator's message construction is wrong. Fix the orchestrator before retrying.
- If a skill returned `unauthorised`, there is an access control issue that needs human investigation.
- If a skill returned `failure: internal-error`, the skill may have left state half-changed. Query state before retrying.
- If a skill returned `failure: already-registered`, the operation was already done — treat as success.

### Implementing a FIPA-Inspired Exception Taxonomy in WinDAGs

Define a structured exception type for all skill invocation responses with the following hierarchy:

```
SkillException
├── NotUnderstood (message was opaque)
│   ├── UnsupportedAct (wrong message type entirely)
│   ├── UnrecognisedOntology (skill doesn't speak this schema)
│   └── UnrecognisedValue (specific field value not parseable)
├── Refused (request rejected before execution)
│   ├── Unauthorized (access control failure)
│   ├── UnsupportedFunction (skill doesn't have this capability)
│   ├── MissingArgument (required input not provided)
│   ├── UnexpectedArgument (provided input not expected)
│   └── MalformedParameter (argument structure is wrong)
└── Failed (execution attempted, something went wrong)
    ├── AlreadyDone (idempotent — treat as success)
    ├── NotFound (target of operation doesn't exist)
    └── InternalError (skill's fault, may have partial side effects)
```

### Retry Logic Per Exception Class

```
NotUnderstood:
  → Do NOT retry with same message
  → Check ontology/schema compatibility
  → If UnsupportedAct: wrong skill type entirely, find different skill
  → If UnrecognisedOntology: translate to supported ontology if possible

Refused:
  → Do NOT retry with same message (Unauthorized, UnsupportedFunction)
  → OR fix message and retry (MissingArgument, MalformedParameter)
  → Unauthorized: escalate to human or policy system
  → UnsupportedFunction: search DF for different skill with this capability

Failed:
  → QUERY STATE FIRST before retrying
  → AlreadyDone: treat as success, continue workflow
  → NotFound: check if pre-condition was satisfied
  → InternalError: check skill health, attempt once more, then escalate
```

### The Agree/Inform Split in WinDAGs

WinDAGs skill invocations should distinguish between:
- **Acknowledgment** ("I received your task and will process it"): fast, low-latency
- **Completion** ("I have finished processing your task"): asynchronous, may take time

This maps directly to FIPA's `agree` / `inform done` separation. The orchestrator should handle these as two distinct events. If it receives `agree` but never receives `inform done` within a timeout, that is different from never receiving `agree` at all:
- No `agree` → skill may not have received the message, retry delivery
- `agree` but no `inform done` → skill received the task but got stuck, investigate lifecycle state, potentially force-terminate and retry with new instance

## The Example from Annex A: Unauthorized Modification

Example 6 in Annex A shows a clean demonstration of the exception system: `dummy` tries to modify `scheduler-agent`'s DF registration, but `dummy` doesn't own `scheduler-agent`. The DF returns:

```
(refuse
  :content
    ((action ... (modify ...))
     (unauthorised)))
```

The `refuse` is paired with the original action in the content, so the receiver knows exactly which action was refused. The `unauthorised` predicate has no arguments because the reason is self-explanatory — this agent simply doesn't have permission.

Compare this to Example 7, where `dummy` sends a `propose` performative to do a `deregister`. The DF doesn't understand `propose`:

```
(not-understood
  :content
    (propose ...
     (unsupported-act propose)))
```

The `not-understood` wraps the entire original message and names the specific unsupported act. The receiver can see exactly what went wrong at the protocol level.

Both examples show that the exception carries enough information for the receiving agent to *programmatically diagnose and route* the failure — not just log it for human review.

## Caveats

**Exception richness has a cost**: Implementing the full FIPA exception taxonomy requires every skill to correctly categorize its failures. If skills return generic `internal-error` for everything, the taxonomy provides no benefit. The taxonomy's value is proportional to implementation discipline.

**Not all failures are agent-addressable**: Some failures (network partitions, hardware failures, resource exhaustion) don't fit cleanly into the FIPA exception model. The `internal-error` catch-all exists for these, but they often require infrastructure-level response rather than agent-level reasoning.

**The two-phase pattern adds latency**: Requiring `agree` before beginning work means an extra round-trip compared to fire-and-forget. For short, synchronous tasks, this overhead may not be worth it. For long-running, stateful tasks, the agree/failure distinction is essential.

## Summary

FIPA's exception taxonomy transforms failures from opaque events into structured, reasoning-amenable information. By categorizing failures along two axes — *when* the failure occurred (before or after agreement) and *why* it occurred (comprehension, capability, authorization, message quality, execution) — the taxonomy enables agents to make intelligent decisions about how to respond. WinDAGs should adopt this structure: define a rich exception type hierarchy, implement specific retry/escalation logic for each exception class, use the agree/completion split for long-running tasks, and treat `failure` (post-agree) as potentially involving partial state changes that must be queried before retrying.
```

### FILE: fipa-capability-search-and-matching.md
```markdown
# Capability Search and Partial Matching: How Agents Find What They Need

## The Discovery Problem

In a multi-agent system with many specialized capabilities, the hardest problem is often not "can this agent do this task?" but "which agent among the hundreds available is best suited to this task?" Naive approaches enumerate all agents and test each one. That doesn't scale. Keyword search misses semantic equivalences. Exact matching fails when capabilities evolve.

FIPA's DF search mechanism, specified in Sections 4.1 and 6.2.4, defines a principled approach to capability discovery based on *partial template matching*: you describe what you need in as much or as little detail as you have, and the directory returns all agents whose advertised capabilities are a superset of what you specified.

## The Matching Semantics: Partial Templates

The core matching rule (Section 6.2.4.1):

> "A registered object matches an object template if: 1. The class name of the object (that is, the object type) is the same as the class name of the object description template, and, 2. Each parameter of the object template is matched by a parameter of the object description."

The critical phrase is "each parameter of the *template* is matched by a parameter of the *object*" — not the other way around. The template specifies *constraints*, not a complete description. A registered agent description with *more* parameters than the template still matches. Only agents with *fewer* specified parameters than the template (i.e., missing something you required) fail to match.

This is subset matching: the template defines a minimum requirement set. Any agent whose description is a superset of the template matches.

For sets specifically: "a set matches a set template if each element of the set template is matched by an element of the set." This means if you ask for agents that support ontology {`code-review`}, you'll get agents that support {`code-review`}, agents that support {`code-review`, `security-audit`}, and agents that support {`code-review`, `refactoring`, `documentation`} — all of them, because all of them include `code-review`.

For sequences: a sequence template is matched if the template's elements appear in order within the full sequence (it need not be a complete match — it's a subsequence match with gaps allowed).

## Why Partial Matching Is the Right Default

Partial matching is the right default for capability discovery because of an asymmetry in knowledge: the *searcher* knows what they need, but the *provider* may offer far more than just what is needed. If the searcher had to specify the provider's full description to match, capability search would require complete foreknowledge of providers — defeating its purpose.

Consider: you need an agent that can perform security auditing on Python code. You don't know whether the security auditing agent also does JavaScript, also supports SAST, also speaks multiple ontologies. You only know what *you* need. Partial matching lets you express just that: "give me agents with `security-audit` in their service type and `Python` in their properties." You get back all agents that satisfy those constraints, regardless of their other capabilities.

## The Example from Section 6.2.4.2

FIPA provides a detailed matching example that is worth studying carefully. A fully-specified `df-agent-description` for `CameraProxy1@foo.com` includes:
- Name, addresses
- Two services: `description-delivery-1` (type `description-delivery`, ontology `Traffic-Surveillance-Domain`, properties: `camera-id=camera1`, `baud-rate=1MHz`) and `agent-feedback-information-1`
- Protocols: `FIPA-Request`, `FIPA-Query`
- Ontologies: `Traffic-Surveillance-Domain`, `FIPA-Agent-Management`
- Languages: `FIPA-SL`

The search template omits most of this. It specifies only:
- One service (partial): type `description-delivery`, ontology `Traffic-Surveillance-Domain`, property `camera-id=camera1`, language `FIPA-SL` or `FIPA-SL1`
- No name, no protocol constraints, no agent-level ontology constraints

> "Notice that several parameters of the df-agent-description were omitted in the df-agent-description template. Furthermore, not all elements of set-valued parameters of the df-agent-description were specified and, when the elements of a set were themselves descriptions, the corresponding object description templates are also partial descriptions." (Section 6.2.4.2)

The match succeeds because:
- The registered agent has a service of type `description-delivery` ✓
- That service includes ontology `Traffic-Surveillance-Domain` in its ontology set ✓
- That service includes property `camera-id=camera1` in its property set ✓
- That service includes `FIPA-SL` in its language set (template requested `FIPA-SL` or `FIPA-SL1`, set matching finds `FIPA-SL`) ✓

The registered agent has more properties than the template requires (also has `baud-rate=1MHz`, also has a second service, etc.) — but those *additional* attributes don't cause a mismatch. They're simply ignored by the template.

## Federated Search: Scaling Discovery Across Platforms

Section 4.1.3 specifies how search can extend beyond a single DF:

> "The DF encompasses a search mechanism that searches first locally and then extends the search to other DFs, if allowed. The default search mechanism is assumed to be a depth-first search across DFs."

DFs federate by registering with each other with the service type `fipa-df`. When a search arrives at a DF, it:
1. Searches its local registry
2. If federated DFs are known and the search constraints allow, propagates the search to them

Search propagation is controlled by constraints (Section 6.1.4):
- **`max-depth`**: Maximum number of federation hops. Prevents infinite loops and runaway searches.
- **`max-results`**: Maximum number of matching descriptions to return. Allows early termination once enough candidates are found.

Depth-first traversal with `max-depth` control is the FIPA default, but the federation topology can encode any search strategy. A star topology (one central DF that knows all local DFs) gives breadth-first-like behavior if the central DF propagates in parallel.

## Application to WinDAGs Skill Discovery

### The Skill Template Query

When a WinDAGs orchestrator needs to decompose a task and find appropriate skills for each step, it should express what each step *requires* as a partial template and send that to the Skill Directory. The template specifies:

- **Service type**: What category of skill is needed (e.g., `code-analysis`, `security-audit`, `test-generation`)
- **Ontologies/schemas supported**: What data representation the skill must understand (e.g., `Python-AST-v3`, `OWASP-CWE-2023`)
- **Properties**: Specific capability attributes (e.g., `language=Python`, `framework=Django`, `severity-levels=critical,high`)
- **Interaction protocols**: How the skill communicates (e.g., `streaming-results`, `batch-processing`)
- **Languages**: What content languages the skill speaks

The search returns all skills whose capabilities are a superset of the template. The orchestrator then selects among candidates based on secondary criteria (performance history, load, trust level, specialization depth).

### Avoiding Over-Specification

A common mistake in skill routing is over-specifying the template to the point where no agents match. If an orchestrator asks for a skill that is type `security-audit`, speaks `OWASP-CWE-2023` *and* `NIST-SP-800-53` *and* `ISO-27001`, and has properties `language=Python`, `framework=Django`, `severity-levels=critical,high,medium,low`, and supports `streaming-results` — there may be no skill that matches all of these simultaneously.

The partial matching model encourages specifying the *minimum necessary constraints*. Ask for what you truly require; let the directory handle what's available. If you get back multiple matches, your selection logic can prefer more specialized matches. If you get back zero matches, you know the constraint set is too tight and can relax it systematically.

### Hierarchical Capability Decomposition

Federated DFs in FIPA suggest a hierarchical skill discovery model for large WinDAGs deployments:

- **Local skill registries**: Each team or domain maintains a registry of their skills
- **Domain DF**: Aggregates registries within a domain (e.g., "code quality skills," "security skills," "data processing skills")
- **Platform DF**: Aggregates domain DFs

When an orchestrator needs a skill, it queries the local registry first (fastest, most specific). If not found, it propagates to the domain DF. If still not found, it propagates to the platform DF. The `max-depth` constraint controls how far the search propagates, and `max-results` ensures the query terminates once enough candidates are found.

This mirrors the FIPA depth-first federated search exactly. The depth control is important in WinDAGs because propagating a complex search query across all skill registries on every task step would create a performance problem.

### Dynamic Capability Registration

Skills in WinDAGs should be able to dynamically update their DF registration as their capabilities evolve. When a code review skill adds support for a new framework, it sends a `modify` to the Skill Directory with the updated service description. The directory accepts the modification, and from that point forward, searches for that framework's capabilities will find this skill.

This dynamic registration capability is what makes the DF model superior to static routing tables: the registry reflects current reality, not a snapshot from deployment time.

### The Non-Guarantee of DF Results

A crucial point from Section 4.1.1 must be preserved in WinDAGs:

> "The DF cannot guarantee the validity or accuracy of the information that has been registered with it."

Skills self-report their capabilities. The directory cannot verify them. Therefore:
- Orchestrators must treat DF results as *candidate* matches, not *verified* matches
- The actual invocation attempt is the verification
- Failed invocations should be fed back to the routing layer: if a skill returned `unsupported-function` (I don't actually support this), the skill's DF registration may be stale and should be refreshed or the skill deregistered

### Implementing the Matching Semantics

The FIPA matching algorithm is worth implementing directly in the WinDAGs skill directory, because it provides exactly the semantics needed: subsumption-based capability matching with partial templates. The recursive sequence matching and the subset-based set matching are both implementable as straightforward algorithms.

For performance, the skill directory should index by service type first (the most discriminating filter in most searches), then filter by ontologies, then by properties. This matches the natural query pattern: you almost always know what *type* of service you need, and then want to refine by specific capabilities.

## Search Constraints as Efficiency Tools

The `search-constraints` object (Section 6.1.4) with `max-depth` and `max-results` is worth implementing in WinDAGs skill search for efficiency:

- **`max-results`**: If you need just one skill for a task step, setting `max-results=1` allows the directory to stop searching after the first match. No need to enumerate all possibilities.
- **`max-depth`**: If you know the capability is available locally, setting `max-depth=0` prevents unnecessary federated search.

For orchestrators doing fast path routing (finding the obvious skill for a simple task), `max-results=1, max-depth=0` gives a fast local lookup. For orchestrators doing comprehensive capability surveys (are there any skills that could handle this unusual task?), `max-depth=unlimited, max-results=100` gives breadth at the cost of latency.

## Caveats

**Semantic equivalence is not handled**: The FIPA matching semantics are purely syntactic — string equality for names and values. There's no inference that `security-audit` and `vulnerability-scanning` are related. A more sophisticated WinDAGs implementation might add ontology-based subsumption reasoning on top of the FIPA model.

**Performance with many registered agents**: Partial matching against hundreds of registered service descriptions can be slow if done naively. Inverted indexes, pre-computed capability clusters, and embedding-based semantic search are all reasonable extensions to the FIPA model for large-scale deployments.

**Circular federation**: Federated DF searches can loop if DFs are mutually registered. The `max-depth` constraint prevents infinite loops but may still visit the same DF multiple times in a tangled federation graph. Implementations should track visited DFs and skip already-visited ones.

## Summary

FIPA's capability search mechanism uses partial template matching (subset semantics for sets, subsequence semantics for sequences) to find agents whose capabilities are a superset of what you need. Federated search extends this across multiple directories with depth and result count controls. For WinDAGs, this translates to: define skill capabilities as structured service descriptions, query with partial templates expressing minimum requirements, use federation for large-scale skill ecosystems, and always treat results as candidates requiring verification at invocation time.
```

### FILE: fipa-registry-patterns-and-authorization.md
```markdown
# Registry Patterns and Authorization: Ownership, Access Control, and the Trust Architecture of Agent Systems

## The Core Authorization Problem

When many agents share an infrastructure, two classes of conflict arise. The first is *accidental*: AgentA tries to modify AgentB's registration not maliciously, but because it made a logic error. The second is *intentional*: a malicious or malfunctioning agent tries to impersonate, disrupt, or hijack another agent's identity or capabilities.

FIPA's Agent Management Specification addresses both through a principled authorization model woven throughout the registry architecture. This model isn't a separate security layer bolted on — it is intrinsic to how the AMS, DF, and AID are designed.

## Ownership as a First-Class Concept

The `ams-agent-description` object includes an `:ownership` field (Section 6.1.5). Every agent registered with the AMS has an owner — "for example, based on organisational affiliation or human user ownership" (Section 2). This ownership field is the anchor for authorization decisions: operations on an agent's registration are permitted to the owner and to the AMS; they are refused to others.

The `service-description` object similarly includes an `:ownership` field (Section 6.1.3). Individual services can have different owners than the agent that offers them — enabling scenarios where an agent offers a portfolio of services on behalf of different principals, each service owned by a different organizational entity.

This ownership model has significant implications:
- An agent cannot be deleted by another agent of equal standing — only the AMS or the owner can initiate deletion
- An agent cannot have its registration modified by an unrelated third party — the DF will `refuse` with `unauthorised`
- The AMS maintains the authoritative ownership record, which the DF respects when processing modification requests

The Annex A dialogue (Example 6) demonstrates this in action: when `dummy` tries to modify `scheduler-agent`'s DF description, the DF responds with `(refuse ... (unauthorised))`. `dummy` has no ownership claim over `scheduler-agent`, so the modification is refused regardless of whether the modification itself would be valid.

## The AID Name as an Authorization Anchor

Beyond ownership, the AID name itself serves as an authorization mechanism. Section 4.2.1 specifies:

> "The AMS will check the validity of the passed agent description and, in particular, the local uniqueness of the agent name in the AID."

When an agent registers, the AMS verifies that no other agent already holds that name within the platform. This prevents name-squatting attacks where a malicious agent claims the identity of a well-known service agent.

Furthermore, Section 3 specifies that the `:name` parameter of an AID "can only be changed by the agent to whom the AID belongs." Other parameters are mutable by authorized parties, but the name is the agent's exclusive property. This makes the name a cryptographic-like anchor: once assigned, only the owner can change it (and the AMS validates that this is true).

## AMS as the Single Authority for Lifecycle

The authorization model creates a clear chain of authority for lifecycle management:

1. **The AMS is the sole authority for forceful termination** (Destroy transition). No other agent can kill another agent. This prevents denial-of-service attacks where one agent kills others.

2. **The AMS is the sole authority for platform access**. Only agents registered with the AMS can use the MTS. An agent that loses its AMS registration loses its ability to communicate entirely.

3. **The AMS controls registration validity**. When an agent attempts to register with the AMS, the AMS verifies the agent's description. Only if the AMS accepts the registration does the agent gain a valid AID and access to the platform.

4. **The AMS can forcibly terminate agents that ignore graceful quit requests**. Section 4.2.1: "An AMS can request that an agent performs a specific management function, such as quit (that is, terminate all execution on its AP) and has the authority to forcibly enforce the function if such a request is ignored."

This creates a tiered authority structure:
- AMS has absolute authority over the platform
- Agents have authority over their own registrations
- Third parties have read authority (search) but not write authority (modify/delete)

## The DF Authorization Model

The DF has a somewhat weaker authorization model than the AMS:

> "The DF may restrict access to information in its directory and will verify all access permissions for agents which attempt to inform it of agent state changes." (Section 4.1.1)

The DF *may* restrict access, but this is optional. By default, search queries are answered for all authorized agents without discrimination. The DF is "benign in the sense that it must provide the most current information about agents in its directory on a non-discriminatory basis to all authorised agents." (Section 4.1.1)

This non-discriminatory read access is important for system dynamics: any agent can discover any other agent's advertised capabilities. This enables emergent collaboration (AgentA discovers AgentB exists and can do X, forms a collaboration), but it also means capability advertisement is essentially public within the platform. Sensitive capabilities that should not be discoverable by all agents should either not be registered in the DF or should be registered in a restricted-access DF.

The critical authorization gate on the DF is *modification*: only the agent that registered a description (or an authorized party, like the AMS) can modify or delete it. Registration is self-service; modification and deletion are ownership-protected.

## Dynamic Registration and Trust

Section 5.2 introduces the concept of dynamic registration:

> "The agent explicitly registered with the AP, assuming that the AP both supports dynamic registration and is willing to register the new agent. Dynamic registration is where an agent which has a HAP wishes to register on another AP as a local agent."

Dynamic registration is explicitly conditional: "assuming that the AP both supports dynamic registration and is **willing** to register the new agent." The AMS has discretion to accept or reject dynamic registrations. This discretion is where trust decisions are made: should we allow this external agent, from this other platform, to participate in our platform?

The AP description (Section 6.1.6) includes a `:dynamic` flag indicating whether the platform supports dynamic registration at all. This is a platform-level policy decision, not an agent-level decision. Some platforms may be closed (`:dynamic false`) and only allow pre-configured agents.

## Application to WinDAGs Trust Architecture

### Skill Registration Authorization

In WinDAGs, the Orchestration Registry (AMS analog) should enforce:

1. **Unique skill identifiers**: No two skills can claim the same identifier. The registry validates this on registration.

2. **Ownership tracking**: Every skill is owned by a team, service account, or organizational unit. Only the owner (and the registry itself) can modify or delete a skill's registration.

3. **Forced deregistration authority**: The orchestration system must retain the ability to force-deregister any skill, regardless of the skill's cooperation. This is the Destroy equivalent — essential for removing compromised, malfunctioning, or deprecated skills.

4. **Dynamic registration policy**: The registry should have a configurable policy on whether external skills (from other WinDAGs deployments or third-party providers) can dynamically register. Production deployments may want `:dynamic false` (only pre-approved skills) while development environments want `:dynamic true` (rapid iteration).

### Preventing Capability Spoofing

One of the authorization concerns FIPA's model addresses is *capability spoofing*: an agent claiming to offer a capability it doesn't have (or more dangerously, claiming to be a well-known agent it isn't). In WinDAGs, this could manifest as a malicious skill registering as `code-review` and receiving sensitive code that it then exfiltrates.

Mitigations from the FIPA model:
- The Orchestration Registry validates skill identifiers for uniqueness at registration time
- Skill identity is anchored to the registering account (ownership) — you can't register as a skill you don't own
- The AMS's mandatory registration means every skill must be known to the registry before it can receive messages

Additional mitigations beyond FIPA:
- Cryptographic signing of skill registrations (the registry issues a capability certificate)
- Regular re-attestation (skills must periodically prove they still are what they claimed to be)
- Behavioral monitoring (skills whose behavior deviates significantly from their registered description get flagged)

### The Non-Discriminatory Search Principle and Its Implications

FIPA's principle that DF search results are non-discriminatory (all authorized agents get the same results) has an important implication for WinDAGs: skill discovery is effectively public within the system. Any orchestrator can discover any skill.

This is usually desirable — it's what enables dynamic capability composition. But for sensitive skills (e.g., skills with access to production databases, skills performing financial operations), you may want restricted visibility: only certain orchestrators should even know these skills exist.

The FIPA model addresses this by allowing multiple DFs with different access policies. WinDAGs could implement this as tiered skill directories:
- **Public directory**: All skills visible to all orchestrators
- **Restricted directory**: Sensitive skills visible only to orchestrators with appropriate clearance
- **Private directory**: Skills visible only to the owning team

The federated search mechanism allows an orchestrator to query both public and restricted directories in sequence, with the restricted directory performing authorization before returning results.

### Exception-Based Authorization Feedback

From Section 6.3.4, when an unauthorized operation is attempted, the response is:
```
(refuse ... (unauthorised))
```

This is clean and non-leaking: the `unauthorised` predicate doesn't tell the requester *why* they're unauthorized or what they would need to be authorized. It simply refuses. This prevents information leakage through authorization errors.

WinDAGs should follow the same principle: when an orchestrator attempts an operation on a skill it doesn't have permission to operate on, the response should be a clean `Refused: Unauthorized` — not "you need to be in group X" or "this skill is owned by team Y" (which would leak organizational structure).

## The Idempotency Problem: `already-registered`

Section 6.3.5 includes `already-registered` as a `failure` predicate (not a `refuse`). This is worth examining: why is duplicate registration a *failure* rather than a *refuse*?

Because the registration process involves the AMS saying `agree` (I'll try to register you) and then potentially discovering that the name is already taken. The AMS agreed to try, tried, and found a conflict. This is a runtime failure, not a message-level rejection. The distinction matters: the AMS already sent `agree`, meaning it thought the registration was valid at the point of agreement. The conflict was discovered during execution.

For WinDAGs, the `already-registered` pattern is extremely useful for idempotent skill registration: if a skill attempts to re-register on restart, the registry returns `failure: already-registered`. The skill can then either:
1. Treat this as success and proceed (the registration from last time is still valid)
2. Query its current registration state and update if needed (compare with the `modify` function)
3. Deregister and re-register fresh

The important thing is that the skill can distinguish "I'm already registered" from "my registration failed for some other reason." That distinction drives different recovery behaviors.

## Caveats

**Authorization without cryptography is weak**: FIPA's authorization model relies on the AMS trusting agents' claimed identities. In an open network where agents can be arbitrary software from untrusted sources, this is insufficient without cryptographic identity verification. FIPA explicitly notes that security details are outside its scope and recommends consulting companion security specifications.

**The single AMS is a trust concentration point**: Everything goes through one AMS per platform. If the AMS is compromised or makes incorrect authorization decisions, the entire platform is vulnerable. This is a known trade-off in centralized authority models.

**Ownership without accountability**: The `:ownership` field stores an owner identity, but FIPA doesn't specify how ownership is verified. Any agent can claim any ownership string. Real authorization systems need verifiable ownership claims (cryptographic keys, tokens, certificates).

## Summary

FIPA's authorization model weaves ownership into the registry objects themselves, gives the AMS absolute authority over lifecycle and platform access, and makes modification/deletion ownership-protected while keeping discovery broadly accessible. For WinDAGs: track ownership of every skill, require AMS-equivalent (Orchestration Registry) validation on all registrations, implement tiered directories for sensitive skills, use the exception taxonomy to provide clean authorization feedback without information leakage, and retain forceful-termination authority at the orchestration layer regardless of skill cooperation.
```

### FILE: fipa-platform-abstraction-and-interoperability.md
```markdown
# Platform Abstraction and Interoperability: How FIPA Decouples Interface from Implementation

## The Foundational Design Choice

The most important architectural decision in the FIPA Agent Management Specification is stated quietly in the scope section:

> "This document is primarily concerned with defining open standard interfaces for accessing agent management services. The internal design and implementation of intelligent agents and agent management infrastructure is not mandated by FIPA and is outside the scope of this specification." (Section 1)

This is a profound commitment to *interface* over *implementation*. FIPA specifies what agents must be able to *say to each other* and what services the infrastructure must *expose*, but makes no requirements on how any of it is built internally. Two agent platforms can interoperate perfectly if they both speak FIPA — one could be written in Java using CORBA/IIOP, another in Python using HTTP REST — as long as both correctly implement the specified interfaces.

This design philosophy runs throughout the specification and has deep implications for how intelligent agent systems should be architected.

## What Is Standardized vs. What Is Not

**Standardized (normative in FIPA)**:
- The Agent Identifier structure and its parameters
- The AMS interface: register, deregister, modify, search, get-description, quit
- The DF interface: register, deregister, modify, search
- The lifecycle state names and transition semantics
- The exception taxonomy and the predicates in each exception class
- The message format (FIPA-SL0 content language)
- The request/agree/inform/refuse/failure protocol pattern
- The search matching semantics (subset matching for sets, subsequence for sequences)

**Not standardized (implementation choice)**:
- How the AMS actually stores agent descriptions internally
- How the DF indexes registrations for efficient search
- What algorithms the MTS uses for message routing and delivery
- How agents are physically created, scheduled, or executed
- Whether agents are threads, processes, microservices, or something else
- How authentication and security are implemented
- The internal communication protocol between agents on the same platform
- How the AP spans multiple machines (if it does)

The specification is explicit: "FIPA is concerned only with how communication is carried out between agents who are native to the AP and agents outside the AP or agents who dynamically register with an AP. Agents are free to exchange messages directly by any means that they can support." (Section 2)

## The Agent Platform as Logical, Not Physical

One of the subtler points in the specification:

> "The entities contained in the reference model are logical capability sets (that is, services) and do not imply any physical configuration." (Section 2)

And more explicitly:

> "It should be noted that the concept of an AP does not mean that all agents resident on an AP have to be co-located on the same host computer. FIPA envisages a variety of different APs from single processes containing lightweight agent threads, to fully distributed APs built around proprietary or open middleware standards." (Section 2)

The Agent Platform is a *logical boundary*, not a physical one. An AP could be:
- A single process on a single machine (smallest possible AP)
- Multiple processes on one machine
- Processes distributed across a datacenter
- A cloud-native cluster spanning regions

What makes something an AP is not its physical topology but its logical function: it provides AMS, DF, and MTS capabilities to the agents within it, and it presents a unified interface to the outside world.

This logical/physical separation is crucial for scalability: as the system grows, you can add machines, replicate services, and redistribute load *without changing the interface* that other agents use to interact with the platform.

## Transport Abstraction: Addresses Are URLs

Section 3.1 specifies:

> "The EBNF syntax of a transport address is the same as for a URL given in [RFC2396]."

By using URLs as the universal syntax for transport addresses, FIPA achieves transport independence. An agent can have multiple transport addresses using different protocols:
- `iiop://foo.com/acc` (CORBA IIOP)
- `http://foo.com/agents/agentA` (HTTP)
- `fipa://foo.com/acc` (FIPA-native transport)

The agent can list all of them in its AID `:addresses` field with a preference ordering. Senders try addresses in order until one works. This means the same logical agent can be reached via multiple transport protocols simultaneously, enabling gradual protocol migration and redundancy.

For modern WinDAGs systems, this maps directly to supporting multiple invocation channels per skill: HTTP REST, gRPC, async message queue, direct function call — all potentially valid transport addresses for the same logical skill.

## The AP Description as a Capability Declaration

Section 6.1.6 defines the `ap-description` object:
- **`:name`**: Platform name
- **`:dynamic`**: Does this platform support dynamic agent registration?
- **`:mobility`**: Does this platform support agent migration?
- **`:transport-profile`**: What MTS capabilities does this platform have?

This is the platform's self-description — what it can and cannot do. Agents can query this via `get-description` to understand what features are available before attempting to use them.

The `:dynamic` and `:mobility` flags are particularly interesting: they are boolean capability gates that enable platform-level feature policies. A platform operator can set `:dynamic false` to lock down the platform to pre-registered agents only. They can set `:mobility false` to prevent agent migration (which might be a security policy: agents must not leave this platform).

This is the beginning of a platform capabilities ontology: not just "what services exist" but "what behaviors are permitted."

## Inter-Platform Communication: The MTS Boundary

FIPA defines where its standardization responsibility begins and ends with respect to message transport:

> "A Message Transport Service (MTS) is the default communication method between agents on different APs." (Section 2)

The MTS is how APs talk to each other. The specification ([FIPA00067], referenced throughout) standardizes the envelope format and delivery semantics for inter-AP messages. But within an AP, agents can "use any proprietary method of inter-communication." (Section 2)

This creates a natural boundary:
- **Inside an AP**: Implementation freedom. Use whatever is fastest and most convenient.
- **At AP boundaries**: Use the standardized MTS protocol. This is what enables interoperability.

For WinDAGs, this suggests an analogous boundary:
- **Within a WinDAGs deployment**: Use whatever communication pattern is most efficient (function calls, shared memory, direct API calls)
- **Between WinDAGs deployments** (or between WinDAGs and external agent systems): Use a standardized message envelope that follows FIPA-like conventions (structured sender/receiver AIDs, standard content language, standard request/response protocol)

## Software as Non-Agent Resources

Section 2 introduces a subtle but important concept:

> "Software describes all non-agent, executable collections of instructions accessible through an agent. Agents may access software, for example, to add new services, acquire new communications protocols, acquire new security protocols/algorithms, acquire new negotiation protocols, access tools which support migration, etc." (Section 2)

The distinction between *agents* and *software* is functional: agents have identities, lifecycles, the ability to communicate, and the ability to reason. Software is everything else — callable code, libraries, tools, APIs. Agents use software as resources; software does not have agency.

This distinction is important because it prevents over-agentification: not everything needs to be an agent. A cryptographic library doesn't need a lifecycle state. A database doesn't need to register with the DF. A routing function doesn't need an AID. These are software — tools that agents use to accomplish their goals.

The FIPA reference specification ([FIPA00079]) on Agent Software Integration addresses how agents discover and acquire software capabilities — a separate problem from how agents discover each other.

## Application to WinDAGs Architecture

### Clean Interface Boundaries

WinDAGs should adopt FIPA's core architectural principle: standardize interfaces, not implementations. The specification for what a skill must expose (registration interface, invocation protocol, exception format, lifecycle state) should be a stable contract that any skill can implement however it chooses internally.

This means:
- A skill written in Python with PostgreSQL storage and a skill written in Rust with in-memory storage should be indistinguishable at the interface level
- A skill running as a single process and a skill running as a Kubernetes deployment should present the same management interface
- A skill invoked via HTTP and a skill invoked via gRPC should produce responses in the same content structure

The interface contract is what WinDAGs enforces. The implementation is the skill developer's concern.

### Platform Capabilities Metadata

Implement an AP-description analog in WinDAGs: a platform capabilities document that declares:
- What skill capabilities are available on this deployment
- Whether external skill registration is permitted
- What communication protocols are supported
- What security requirements apply
- What resource limits are in effect

This platform-level capability declaration enables orchestrators to reason about what they can request before making requests — avoiding the `unsupported-function` failures that arise when an orchestrator asks for a capability the platform genuinely doesn't have.

### Logical vs. Physical Skill Boundaries

Skills in WinDAGs should be thought of as *logical* capabilities, not physical processes. A single skill identifier might be backed by:
- A pool of replicated processes
- A serverless function
- A microservice
- A direct API call to an external service

The physical implementation doesn't matter to the orchestrator. What matters is the logical capability: the skill's name, its service description, its invocation interface, and its response semantics. Physical topology is an implementation detail that should not leak through the skill interface.

This is especially important for scaling: when a skill is replicated for load balancing, the skill directory should still show one logical skill entry, with the routing to specific physical instances handled transparently by the MTS analog.

### Transport Address Multiplicity

Following the multi-address AID model, WinDAGs skills should support multiple invocation addresses with preference ordering:
1. Direct in-process function call (if same process)
2. Local IPC (if same machine)
3. gRPC (if network, preferred for binary efficiency)
4. HTTP REST (if network, fallback for compatibility)
5. Async message queue (if network, for long-running tasks)

The orchestrator tries addresses in preference order. This provides automatic fallback: if the preferred invocation method fails, the orchestrator can try the next address. This is more robust than hard-coding a single invocation method.

## The Logical Completeness of the Reference Model

One of FIPA's strengths is that its reference model is logically complete: every agent interaction — creation, discovery, communication, lifecycle management, retirement — has a specified home in the model. There are no "and then some magic happens" gaps.

For WinDAGs, this is an important design goal: define a complete model where every possible event in a skill's lifecycle — creation, registration, discovery, invocation, failure, recovery, deprecation, retirement — has a specified protocol. If any event lacks a protocol, that is a gap that will manifest as ambiguity and ad-hoc behavior in production.

## Caveats

**Interface standardization has governance costs**: Stable interfaces require coordination. When the interface needs to change (new exception type needed, new lifecycle state needed, new DF function needed), all implementations must be updated. This creates inertia. FIPA's own changelog (Annex D) shows that even small changes (fixing an incorrect AMS/DF reference) require formal versioning.

**Implementation freedom can create hidden incompatibilities**: Two platforms can both claim FIPA compliance while behaving very differently in edge cases not covered by the specification. The spec is clear that it doesn't mandate internal implementation, but some internal choices (like how the AMS handles concurrent registrations) affect observable behavior.

**The Software/Agent distinction gets blurry in practice**: Modern LLM-based agents blur the line between software (a callable function) and agent (an autonomous reasoning entity). FIPA's clean distinction becomes hard to maintain when a "skill" has enough reasoning capability to be arguably an agent, but is being called as if it were software.

## Summary

FIPA's architecture achieves interoperability through interface standardization without implementation constraint: specify what must be exposed, not how it must be built. The Agent Platform is a logical boundary that can span any physical topology. Transport addresses are URLs, enabling protocol multiplicity. The `ap-description` object makes platform capabilities machine-queryable. Software resources are distinct from agents and don't require full agent infrastructure. For WinDAGs: standardize the skill interface contract rigorously, implement the platform capabilities declaration, treat skills as logical entities independent of their physical backing, support multiple invocation addresses per skill, and ensure every lifecycle event has a specified protocol.
```

### FILE: fipa-message-performatives-and-interaction-patterns.md
```markdown
# Message Performatives and Interaction Patterns: The Grammar of Agent Communication

## Communication Is Not Just Data Transfer

When two programs exchange data, the exchange is symmetrical: bytes go from A to B, meaning is inferred from the content. When two agents communicate, the exchange is *performative*: the message is not just information but an *act*. Sending a `request` is asking someone to do something. Sending a `refuse` is declining to do something. Sending an `agree` is making a commitment.

FIPA's communication model, visible throughout the Agent Management Specification and its referenced interaction protocols, is built on speech act theory: every message is a performative that carries both semantic content and a *communicative act* type that specifies what the sender is *doing* with the message.

The communicative act types visible in the FIPA Agent Management Specification:
- **`request`**: "I want you to do this action"
- **`agree`**: "I commit to attempting this action"
- **`refuse`**: "I will not attempt this action, here is why"
- **`inform`**: "I am telling you this fact is true"
- **`failure`**: "I attempted the action but it failed, here is why"
- **`not-understood`**: "I cannot interpret what you sent"

Each of these is a different kind of *act*, not just a different kind of data. The distinction matters because agents need to reason not just about what is communicated but about *what kind of thing is being communicated*.

## The FIPA-Request Interaction Protocol

The specification repeatedly references the FIPA-Request interaction protocol ([FIPA00026]). The agent management examples in Annex A all follow this protocol. It is worth examining its structure carefully because it is the most important pattern in multi-agent coordination.

The FIPA-Request protocol specifies a temporal sequence:

```
Initiator            Participant
    |----request------->|
    |<---agree OR-------|
    |    refuse         |
    |                   |
(if agree:)            |
    |<---inform done----|
    |    OR failure     |
```

Every message carries the full context in its `:content` field. The `agree` echoes the original action. The `inform done` or `failure` wraps the original action. This makes every message self-describing: you don't need out-of-band context to understand a `failure` message because the `failure` contains the action that failed.

This protocol pattern has critical properties:
1. **Two-phase commitment**: The agent explicitly commits before executing (agree), so the requester knows whether to expect completion
2. **Explicit rejection before any side effects**: `refuse` happens before the action is attempted, ensuring clean state
3. **Failure notification includes context**: `failure` wraps the original action, enabling the requester to diagnose without stored state
4. **Protocol label on every message**: The `:protocol FIPA-Request` label lets both parties identify which protocol is in play, enabling proper state machine tracking

## Message Anatomy: The Envelope and the Content

Every FIPA message has an outer envelope (header) and inner content. The Annex A examples make this structure explicit:

```
(request                           ← Communicative act type
  :sender (agent-identifier ...)   ← Who sent this
  :receiver (set (...))            ← Who should receive this
  :language FIPA-SL0               ← What language the content is in
  :protocol FIPA-Request           ← What interaction protocol this is part of
  :ontology FIPA-Agent-Management  ← What ontology the content uses
  :content                         ← The actual semantic content
    (action                        ← What action is being requested
      (agent-identifier ...)       ← Who should perform the action
      (register ...)))             ← The specific action and its arguments
```

The separation of envelope from content is important:
- The envelope is about *communication logistics*: who, to whom, in what language, with what protocol
- The content is about *semantics*: what is actually being requested/reported/refused

This enables processing at different layers: an MTS can route based on the envelope without understanding the content. An AMS can parse the content type (register, deregister, modify) without caring about the specific arguments. A service handler can process the specific arguments without re-parsing the envelope.

## Ontology and Language as Shared Context Declarations

Every FIPA message declares both its content language (`:language FIPA-SL0`) and its ontology (`:ontology FIPA-Agent-Management`). These are not metadata — they are prerequisites for correct interpretation.

The content language specifies the syntax: how to parse the content field. FIPA-SL0 is a subset of the Semantic Language, with specific rules for constants, sets, sequences, and functional terms.

The ontology specifies the semantics: what the terms in the content mean. "register" means something different in the `FIPA-Agent-Management` ontology than it might mean in a `meeting-scheduler` ontology. The `:ontology` declaration tells the receiver which vocabulary to use for interpretation.

By making both explicit in every message, FIPA ensures that receivers always have the context they need to correctly interpret content — and that the `not-understood` exception with `unrecognised-value` or `unsupported-value` can be meaningfully specific about what part of the shared context is missing.

## The Self-Describing Message Pattern

One of the distinctive features of the FIPA message format is that messages are *self-describing*: the `agree`, `inform done`, and `failure` messages each contain (or reference) the original action that was agreed to, completed, or failed. This is visible in every Annex A example.

In Example 1, the AMS sends `agree` containing:
```
(action ... (register (ams-agent-description ... :state active)))
```
This is the original action echoed back. Why? Because in a distributed system with concurrent interactions, the requester may have multiple outstanding requests simultaneously. By echoing the original action, the response is unambiguously connected to the request — even without shared state or explicit correlation IDs.

The `inform done` then uses the `done` predicate wrapping the same action:
```
(done (action ... (register (ams-agent-description ...))))
```

This is a completed-action declaration: "the action (described here) is done." The receiver doesn't need to look up what action was being referred to — it's right there in the message.

For WinDAGs, this self-describing pattern is valuable for long-running orchestrations where the orchestrator needs to match completion notifications to pending task steps. Rather than relying on correlation IDs stored externally, the completion message carries enough context to be matched by content alone.

## The `propose` Failure: Wrong Performative

Example 7 in Annex A shows a subtle but important failure mode: `dummy` sends a `propose` performative to do a `deregister`. The DF returns `not-understood` with `unsupported-act propose`.

```
(not-understood
  :content
    (propose ...)
    (unsupported-act propose))
```

The DF can handle `request` performatives. It cannot handle `propose` — which in the FIPA protocol library means "I propose we do this" (a negotiation-oriented act), not "I request you do this" (a directive act). The action (deregister) is completely valid. The problem is the outer communicative act type is wrong.

This example teaches: the communicative act type is not a wrapper — it is load-bearing. Sending the right content with the wrong act type is a communication failure. The receiver's interpretation of the content depends on the act type: a `propose` to deregister is semantically different from a `request` to deregister.

For WinDAGs, this means: skill invocations must use the correct communicative act type for the intended interaction semantics. Sending a "task completion notification" as a request (which demands a response) versus an inform (which is a one-way notification) has very different implications for downstream protocol behavior.

## Interaction Protocol Multiplicity

While FIPA-Request is the primary protocol used in the Agent Management Specification, FIPA defines a library of interaction protocols ([FIPA00025]) for different coordination patterns. The DF description includes the `:protocol` field listing which protocols a registered agent supports. This implies that agents can choose the appropriate interaction pattern based on the task:

- **FIPA-Request**: "Do this for me, tell me when done"
- **FIPA-Query**: "Answer this question"
- **FIPA-Contract-Net**: "Who wants to bid on this task?"
- **FIPA-Subscribe**: "Notify me when this condition changes"
- **FIPA-Propose**: "I suggest we do this, do you agree?"

The fact that supported protocols are part of the DF registration means agents can discover not just *what* another agent can do, but *how* it prefers to be coordinated with.

## Application to WinDAGs Communication Design

### Performative Types for Skill Invocation

WinDAGs skill invocations should use distinct performative types:

- **`task-request`**: "Execute this task and report completion" (maps to FIPA-Request)
- **`capability-query`**: "Can you handle this type of task?" (maps to FIPA-Query)
- **`status-inform`**: "Here is the current status of this task" (one-way notification)
- **`result-inform`**: "Here is the result of the completed task" (final delivery)
- **`error-failure`**: "Task attempted but failed, here is why" (structured failure)
- **`cancellation-request`**: "Cancel the in-progress task" (lifecycle management)

Each of these requires different handling. Conflating them into a generic "message" creates ambiguity about what the receiver should do.

### Self-Describing Completions

Follow the FIPA pattern: task completion messages should include enough context to be matched to the original task request without external lookup. At minimum, include: task ID, original task description, completion status, result or error. This is more verbose than a bare "task X completed," but it eliminates the "I can't find the original request for this completion notification" problem.

### Protocol Labeling

Every message in WinDAGs should carry a `:protocol` label identifying which interaction protocol it belongs to. This enables the receiver to track the correct state machine for the conversation. Without protocol labels, a `failure` message is ambiguous: which of several in-flight interactions did this failure belong to?

### Language and Ontology Negotiation

When skills are registered in the DF (Skill Directory analog), they should declare what content languages and ontologies they understand. When an orchestrator needs to invoke a skill, it should select a shared language and ontology and declare it in the invocation message. If the skill returns `not-understood: unsupported-value` on the `:language` or `:ontology` field, the orchestrator should attempt translation to a supported representation.

This language/ontology negotiation is what makes skills truly interoperable across different orchestrators that may use different internal representations.

## The Not-Understood Pattern as a Self-Healing Mechanism

The `not-understood` exception is particularly valuable as a self-healing mechanism. When an agent receives a message it cannot interpret, it echoes the uninterpretable message back in the `not-understood` response:

```
(not-understood
  :content
    (propose ...)    ← The original message, verbatim
    (unsupported-act propose))  ← What was wrong
```

This echo serves multiple purposes:
1. The sender can see exactly what the receiver received (verifying transmission fidelity)
2. The sender knows the specific reason for the not-understood (unsupported-act vs. unrecognised-value)
3. The sender can correct and retry with the appropriate act type or content format

For WinDAGs, implementing this echo pattern in error responses helps with debugging: when an orchestrator receives a `not-understood` from a skill, it should be able to see exactly what it sent and exactly what part was problematic. This transforms debugging from "why did that fail?" to "oh, I sent the wrong message type" — a much more tractable question.

## Caveats

**Verbosity vs. efficiency**: The FIPA message format is verbose — full message echo in every response, full AID descriptions in every sender/receiver field. For high-throughput systems, this verbosity becomes a bottleneck. Performance-critical WinDAGs deployments may need a binary encoding of the same logical structure. The important thing is to preserve the semantic structure, not the FIPA-SL0 syntax specifically.

**Stateless message interpretation**: The self-describing message pattern works because each message is (mostly) interpretable standalone. But some interaction patterns inherently require state: you can't properly interpret an `agree` without knowing what was `request`ed. Implementations must maintain conversation state keyed by interaction ID.

**Protocol explosion**: FIPA's protocol library defines many interaction patterns. Using all of them creates a large vocabulary that all parties must implement. In practice, most WinDAGs interactions need only two or three protocols: synchronous request/response, asynchronous task submission, and status query. Start with the minimum set.

## Summary

FIPA's communication model is built on speech act theory: messages are performative acts, not just data transfers. The FIPA-Request interaction protocol provides a two-phase commitment pattern (agree then complete/fail) that separates rejection from failure. Messages are self-describing, carrying their own context for interpretation and matching. Ontology and language declarations in every message ensure shared interpretive context. The `not-understood` exception with echoed content enables self-healing communication. For WinDAGs: define distinct performative types for different interaction purposes, use the agree/complete split for long-running tasks, make completion messages self-describing, and implement `not-understood` with content echo as the error response for uninterpretable messages.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: The FIPA reference model provides a formal template for how to decompose "what does an agent need to operate?" into minimal orthogonal components (AMS for lifecycle/auth, DF for discovery, MTS for transport). Any complex task decomposition should ask: which concerns are genuinely independent and should be handled by separate components? The AMS/DF split is a worked example of this principle.

- **Agent Routing / Skill Selection**: The DF partial-template matching semantics (Section 6.2.4) directly improve skill routing: instead of exact-match routing ("find skill named X"), implement subsumption-based routing ("find any skill whose capabilities are a superset of what I need"). The recursive matching algorithm for sets and sequences is implementable and gives much more flexible routing behavior.

- **Error Handling / Debugging**: The four-class exception taxonomy (unsupported, unrecognised, unexpected, missing) plus the three communicative act types (not-understood, refuse, failure)