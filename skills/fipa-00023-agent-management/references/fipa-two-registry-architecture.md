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