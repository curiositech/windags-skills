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