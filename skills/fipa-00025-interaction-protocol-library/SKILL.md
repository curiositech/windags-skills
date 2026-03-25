---
license: Apache-2.0
name: fipa-00025-interaction-protocol-library
description: FIPA standard library of agent interaction protocols for structured multi-agent communication
category: Research & Academic
tags:
  - fipa
  - agents
  - protocols
  - interaction
  - standards
---

# SKILL.md — FIPA Interaction Protocol Library

license: Apache-2.0
```yaml
name: fipa-interaction-protocols
version: 1.0.0
description: >
  Multi-agent coordination design using the FIPA Interaction Protocol Library.
  Covers protocol specification, role abstraction, conversation management,
  composability, and the limits of protocol-based interoperability.
activation_triggers:
  - Designing communication patterns between agents or services
  - Building or debugging multi-agent orchestration systems
  - Questions about agent coordination, message routing, or conversation state
  - Task decomposition across multiple specialized agents
  - Failure modes in distributed agent workflows
  - "How should Agent A and Agent B coordinate on X?"
  - Designing reusable workflow templates or skill compositions
  - Interoperability gaps between systems that "follow the same protocol"
```

---

## When to Use This Skill

Load this skill when the problem involves **agents coordinating through messages** — whether those agents are LLMs, microservices, robotic systems, or human-in-the-loop actors. The FIPA framework is relevant whenever:

- You need to **design or critique a conversation pattern** between two or more agents
- You're experiencing **brittle coordination** where small deviations cause system failure
- You're **reusing or templating** a workflow across multiple contexts and noticing friction
- You're debugging **state confusion** when agents participate in multiple concurrent conversations
- Someone claims their system is "interoperable" because both sides "follow the same protocol" and you're skeptical
- You're deciding whether to **encode coordination logic into agents** vs. into **explicit protocol structure**

This skill is less relevant for single-agent tasks, pure retrieval problems, or cases where coordination happens entirely within a single process.

---

## Core Mental Models

### 1. Interaction Protocols Are First-Class Design Artifacts
The recurring message sequences between agents — request/refuse/propose/accept — are not implementation accidents. They are stable, nameable, verifiable structures: **coordination patterns** that can be specified separately from the agents that execute them. Treating protocols as first-class artifacts (with names, parameters, documented roles, and explicit branching logic) is the difference between a maintainable agent system and one that silently encodes coordination assumptions inside individual agent implementations.

**Practical implication**: If you can't point to a document or diagram that specifies the conversation pattern independently of any agent's code, you don't have a protocol — you have implicit coupling waiting to break.

### 2. Pre-Specification vs. Emergent Coordination — Pick Deliberately
There are two philosophies: (a) give agents rich mental models so coordination *emerges* from their reasoning, or (b) pre-specify interaction protocols so even simple agents can participate correctly by pattern-following. The FIPA approach is (b). It scales better, supports interoperability across heterogeneous implementations, and places design burden on the protocol rather than on agent intelligence.

**The trade-off is real**: pre-specified protocols are less adaptive but far more inspectable, composable, and debuggable. Emergent coordination is more flexible but harder to reason about at scale. Neither is universally correct — but the choice must be made consciously.

### 3. Protocols Define the Happy Path — Robustness Is a Different Layer
FIPA explicitly acknowledges that individual interaction protocols "do not address a number of common real-world issues: exception handling, messages arriving out of sequence, dropped messages, timeouts, cancellation, duplicate messages." This is not a flaw — it is an honest boundary. Protocol compliance tells you an agent can participate in the nominal flow. It says nothing about what happens when things go wrong.

**The interoperability gap**: two agents can be fully protocol-compliant and still fail to coordinate robustly, because robustness requires additional agreements (timeouts, cancellation semantics, error recovery) that live above the protocol layer.

### 4. Coordinate Through Roles, Not Identities
Agents should be specified in protocols by the *role* they play (Initiator, Responder, Broker, Auctioneer) — not by concrete identity. This enables: one agent to play multiple roles simultaneously, different implementations to satisfy the same role, roles to change hands mid-workflow, and protocols to be reused across entirely different agent populations. Identity-based coordination creates tight coupling; role-based coordination creates extensibility.

### 5. Parameterized Protocols: Families, Not Fixed Scripts
A "ContractNet protocol" is not a single protocol — it is a *family* of protocols, all sharing the same structural skeleton but bound to different roles, deadlines, communicative act types, and domain content at instantiation time. This parameterization-then-binding approach is the key to reusability without rigidity: design the pattern once, instantiate it many times. The same structure governs appointment scheduling, goods negotiation, task allocation, and resource bidding.

---

## Decision Frameworks

### Designing a New Agent Interaction
```
Are the agents heterogeneous (different implementations, owners, or capabilities)?
  YES → Pre-specify the protocol explicitly. Don't rely on emergent coordination.
  NO  → Pre-specify anyway for debuggability, but emergent coordination may suffice.

Is this pattern likely to recur across different contexts?
  YES → Parameterize it. Extract roles, deadlines, and domain content as parameters.
  NO  → A fixed protocol is acceptable; avoid over-engineering.

Does the workflow involve parallel independent sub-tasks?
  YES → Use interleaved protocol composition (each sub-task gets its own conversation thread).
  NO  → Consider nested composition for sequential-conditional sub-tasks.
```

### Diagnosing Coordination Failures
```
Are agents compliant with the protocol but still failing to coordinate?
  → You're in the interoperability gap. Look for: timeout disagreements, 
    cancellation semantics, duplicate message handling, out-of-sequence recovery.

Is the failure non-deterministic / timing-dependent?
  → Check conversation state management. Are conversation IDs being tracked?
    Are concurrent conversations being disambiguated correctly?

Is the failure specific to one agent pair but not others?
  → Check role abstraction. Is the protocol encoding identity assumptions?
    Can any compliant agent satisfy the role, or are there hidden dependencies?

Did the system work in testing but break in production?
  → Likely a happy-path protocol encountering real-world exception conditions
    that the protocol does not specify. Add a robustness layer.
```

### Choosing Composition Strategy
```
Sub-tasks are sequential with conditional branching?
  → Nested protocol composition. Sub-protocol is embedded within parent conversation.

Sub-tasks are parallel and independent?
  → Interleaved protocol composition. Separate conversation threads, tracked by ID.

Same pattern needed across multiple domains?
  → Parameterized protocol. Bind roles and domain content at instantiation time.

Pattern involves both sequential and parallel elements?
  → Combine nested (for sequential) and interleaved (for parallel) composition.
    Use AUML branching notation to distinguish AND/OR/XOR branch semantics explicitly.
```

### Evaluating Protocol Wisdom vs. Compliance
```
Agent follows all protocol rules but produces bad outcomes?
  → Compliance without wisdom. Ask: does the agent understand the purpose
    of each communicative act, or just its syntactic requirements?

Agent deviates from protocol and produces good outcomes?
  → May be wisdom, may be fragility. Document the deviation as a protocol
    extension rather than leaving it as undocumented behavior.

Protocol is technically satisfied but coordination breaks downstream?
  → Check whether you've conflated protocol compliance with full interoperability.
    Protocols are necessary but not sufficient conditions for robust coordination.
```

---

## Reference Table

| File | Description | Load When |
|------|-------------|-----------|
| `references/interaction-protocols-as-coordination-primitives.md` | The foundational argument for treating conversation patterns as explicit, named, reusable design artifacts rather than emergent code behavior | Designing a new agent interaction; explaining *why* protocols matter to skeptics; arguing for protocol-first architecture |
| `references/role-abstraction-in-multi-agent-coordination.md` | Why roles (not agent identities) are the right abstraction for coordination; how role-based design enables composability and extensibility | Routing decisions; designing for agent substitutability; debugging identity-based coupling problems |
| `references/protocol-limits-and-the-interoperability-gap.md` | FIPA's honest enumeration of what protocols do NOT cover; the "interoperability gap" between compliance and robust coordination | Diagnosing failures in "compliant" systems; designing robustness layers; evaluating interoperability claims |
| `references/parameterized-protocols-and-reusable-coordination-patterns.md` | How to design protocol families via parameterization; binding roles, deadlines, and content at instantiation time | Building reusable workflow templates; skill composition in orchestration; avoiding one-off protocol proliferation |
| `references/auml-visual-formalism-for-agent-interaction.md` | The AUML notation for specifying agent interactions; AND/OR/XOR branching; sequence diagrams extended for multi-agent concurrency | Specifying or documenting a protocol formally; disambiguating branching logic; communicating protocol structure to other designers |
| `references/the-agent-vs-object-distinction-and-why-it-matters.md` | Why active, goal-directed agents require different design principles than passive objects; what makes an agent *an agent* | Architectural decisions about agent autonomy; deciding what should be an agent vs. a service; understanding FIPA's design assumptions |
| `references/conversation-management-concurrency-and-state.md` | How agents track state across multiple simultaneous conversations; conversation IDs; concurrent dialogue management | Debugging state confusion in concurrent workflows; designing conversation tracking; multi-threaded agent coordination |
| `references/protocol-compliance-versus-protocol-wisdom.md` | The gap between following protocol rules and coordinating well; when rule-following is insufficient; developing judgment about protocol purpose | Agents that are technically compliant but poorly coordinating; designing agents that exercise discretion; expert vs. novice agent behavior |
| `references/modular-protocol-composition-system-architecture.md` | The three composition mechanisms (nested, interleaved, parameterized); building complex systems from simple protocol parts | Complex multi-stage workflows; task decomposition strategy; scaling agent systems without rewriting protocols |

---

## Anti-Patterns

**The Implicit Protocol**
Coordination logic lives entirely inside individual agent implementations, with no external specification. Works until any agent changes. Impossible to audit, reuse, or compose.

**Identity-Based Routing**
Protocol says "Agent A sends to Agent B" rather than "Initiator sends to Responder." Breaks the moment Agent B is replaced, scaled, or repurposed. Creates hidden dependencies that appear only at failure time.

**Compliance = Interoperability Conflation**
Assuming that because both agents "implement FIPA" (or "implement the API spec"), they will coordinate robustly. This ignores the entire robustness layer: timeouts, cancellation semantics, exception handling, out-of-sequence recovery. Protocol compliance is a floor, not a ceiling.

**One-Off Protocol Proliferation**
Writing a new bespoke conversation pattern for every new workflow instead of parameterizing a reusable structure. Leads to an unmaintainable zoo of similar-but-subtly-different protocols with no shared vocabulary.

**Encoding Robustness in Agents Instead of Protocols**
When exceptions occur, each agent handles them privately with its own heuristics. Instead, exception handling and recovery should be explicit protocol-level agreements so all participants share the same expectations.

**Undifferentiated Branching**
Using "branch" without specifying AND (all paths execute), OR (one path is chosen), or XOR (exactly one path, mutually exclusive). This ambiguity causes silent divergence in how different agents interpret the same protocol.

**Protocol Wisdom Without Protocol Literacy**
Exercising discretion in protocol execution without deeply understanding what each communicative act is designed to accomplish. Produces locally "smart" behavior that breaks the coordination assumptions of other participants.

---

## Shibboleths

**Signs someone has genuinely internalized FIPA thinking:**

- They distinguish between *protocol compliance* and *robust interoperability* without prompting, and can name specific failure modes that compliance doesn't prevent (timeouts, out-of-sequence messages, cancellation races).

- When designing agent communication, they reach for **roles** as the primitive — not agent names, not service endpoints. They ask "what role does this agent play in this conversation?" before asking "which agent handles this?"

- They treat the **conversation ID** as a first-class architectural concern, not an implementation detail — because they understand that concurrent conversations require explicit disambiguation.

- They use the AND/OR/XOR branching vocabulary when describing conditional workflow logic, because they've internalized that these are structurally different and conflating them causes real failures.

- They design protocols as **parameterized families** first, then ask "what do I bind at instantiation time?" — rather than writing specific protocols and extracting patterns later.

- When someone says "our agents are interoperable because they use the same protocol," they immediately ask: "what are your timeout agreements? what happens when a message arrives out of sequence? what's the cancellation semantics?"

**Signs someone has only read the summary:**

- They use "protocol" and "API spec" interchangeably, without distinguishing conversational dynamics from interface contracts.
- They design coordination by specifying which specific agents talk to each other, rather than which roles participate.
- They treat exception handling as an agent-level concern with no protocol-level component.
- They describe "the ContractNet protocol" as a single fixed thing rather than a family of parameterized patterns.
- They frame the FIPA framework as "old" or "academic" without recognizing that every modern orchestration system rediscovers its core insights ad hoc.