# Role Abstraction: Why Agents Should Coordinate Through Roles, Not Identities

## The Fundamental Problem with Identity-Based Coordination

Imagine an orchestration system where Agent A calls Agent B by name. Agent A's task planning encodes: "send this subtask to agent-worker-7." This works — until agent-worker-7 is unavailable, or until you need to scale up and have three agents that can do what agent-worker-7 does, or until agent-worker-7 is replaced with a better implementation.

The FIPA specification articulates a clean solution to this problem that has deep implications for agent system design: **coordinate through roles, not through agent identities**.

> "An AgentRole can be seen as a set of agents satisfying a distinguished interface, service description or behaviour. Therefore the implementation of an agent can satisfy different roles." (Section 3.2.2)

An AgentRole is not a specific agent. It is a *behavioral contract* — a specification of what any agent satisfying that role must be capable of doing. When you design a protocol, you design it between roles (`Initiator` and `Participant`, `Buyer` and `Seller`, `Broker` and `Retailer`) not between specific agent instances. The binding of roles to specific agents happens at runtime.

## Multiple Classification and Dynamic Classification

The FIPA specification introduces two powerful concepts that extend this further:

> "UML distinguishes between: multiple classifications where a retailer agent can act as well as a buyer as well as a seller agent, for example, and dynamic classification where an agent can change its classification during its existence." (Section 3.2.2)

**Multiple classification** means a single agent can satisfy multiple roles simultaneously or in different contexts. A RetailerAgent might play the role of `Seller` when dealing with end customers and the role of `Buyer` when procuring from wholesalers. The protocol specifies behavior by role; the agent knows which role it is playing in each specific conversation.

**Dynamic classification** means an agent can *change* which roles it satisfies over time. An agent that starts as a `Worker` might later qualify as a `Supervisor` after acquiring new capabilities, or might temporarily take on a `Monitor` role during a system incident.

Together, these concepts describe a far more flexible architecture than the common alternative, where each agent is a fixed type with a fixed set of capabilities. They suggest that agent capability should be understood as a potentially shifting set of role-satisfactions, not a static property.

## The AUML Notation for Agent Roles

The FIPA specification provides precise notation for expressing roles in protocol diagrams:

- **`role`** — denotes any agent satisfying this role (abstract, any instance will do)
- **`instance / role-1 ... role-n`** — a specific agent instance satisfying named roles
- **`instance / role-1 ... role-n : class`** — a specific instance, with roles and class membership

The example given (Section 3.2.2.4) is instructive:
- `Seller` — any agent playing the seller role
- `Seller-1` — a specific agent named Seller-1
- `Seller-1/Seller, Buyer` — Seller-1, who plays both Seller and Buyer roles
- `Seller-1/Seller, Buyer : CommercialAgent` — same, with explicit class membership

This notation makes visible something that is typically left implicit: the distinction between *who is involved* (instance) and *what they are doing in this interaction* (role). In a protocol diagram, most participants should be specified by role only — the protocol doesn't care which specific agent fills the role, as long as some agent does.

## The Directory Facilitator as a Role Design Example

The specification uses the FIPA Agent Management System as an illustrative case:

> "Another example can be found in [FIPA00023] which defines the functionality of the Directory Facilitator (DF) and the Agent Management System (AMS). These functionalities can be implemented by different agents, but the functionality of the DF and AMS can also be integrated into one agent." (Section 3.2.2)

The Directory Facilitator is a role — a behavioral specification of a service that answers "which agents can do X?" — not a specific agent. Any agent that satisfies the DF interface can play that role. This means:
- In a small system, a single agent might play both DF and AMS roles.
- In a large system, multiple agents might share DF responsibilities (load balancing).
- In a test environment, a mock agent might play the DF role.
- The protocol for querying a DF is the same regardless of which concrete agent plays the role.

This is role-based design in practice: the protocol is designed against the role interface, not against any specific implementation.

## Implications for WinDAG Skill Architecture

### Skills as Roles, Not Agents

In a WinDAG system, the 180+ skills can be understood as **role specifications**. Each skill defines:
- What inputs it accepts (the role's interface)
- What outputs it produces (the role's contract)
- What communicative acts it participates in (the role's protocol compliance)

Any agent that can satisfy the interface of a skill is, by definition, capable of playing that skill's role. The orchestrator should route tasks to skill-roles, not to specific agent instances. Multiple agents might satisfy the same skill role; the selection between them is a runtime concern (load, cost, latency, specialization), not a design concern.

### Conversation IDs and Role Tracking

When an agent plays multiple roles in concurrent conversations, the system must track which role the agent is playing in each conversation. The FIPA specification notes:

> "Note that, by their nature, agents can engage in multiple dialogues, perhaps with different agents, simultaneously. The term conversation is used to denote any particular instance of such a dialogue." (Section 2.1)

This means the `conversation-id` (or its WinDAG equivalent) is not just an administrative tag — it is the scope within which role assignments are meaningful. An agent receiving a message labeled with conversation-id X knows it is playing role R in that conversation, even if it is simultaneously playing role S in conversation Y.

### Dynamic Role Assignment as Adaptive Routing

Dynamic classification — the ability for agents to change their roles over time — suggests that WinDAG routing should be adaptive. An agent that has just completed a complex code generation task has contextual state that makes it particularly good at code review for the same codebase, temporarily qualifying it for a `CodeReviewer` role it might not have satisfied an hour earlier. Role satisfaction should be evaluated dynamically, not assigned statically at agent creation.

### Protocol Compliance as Role Qualification

The FIPA specification makes clear that claiming a role is not enough — an agent must *behave consistently with the role's protocol*:

> "A FIPA ACL-compliant agent need not implement any of the standard IPs, nor is it restricted from using other IP names. However, if one of the standard IP names is used, the agent must behave consistently with the IP specification given here." (Section 2.2)

This is a strong design principle for WinDAG: **skill registration should include protocol compliance verification**. An agent that claims to support skill X must be able to respond correctly to all valid messages in skill X's interaction protocol, not just produce outputs when invoked. This includes handling refusals, failures, partial results, and timeout scenarios correctly.

## Designing Protocols for Roles That Don't Exist Yet

Perhaps the deepest implication of role-based design: you can design coordination protocols for roles that have no current implementation, as long as you can specify the role's behavioral contract. This means:

1. Design the protocol for `DeadlineAwareScheduler` before you have any agent that satisfies that role.
2. When an agent is later built that satisfies the behavioral contract, it can be dropped into any protocol that uses the `DeadlineAwareScheduler` role.
3. The rest of the system requires no modification.

This is exactly how good API design works in software — and it's how scalable multi-agent systems should be designed. The protocol is the API. The role is the interface. The specific agent is the implementation. These three layers should be cleanly separated in system design.