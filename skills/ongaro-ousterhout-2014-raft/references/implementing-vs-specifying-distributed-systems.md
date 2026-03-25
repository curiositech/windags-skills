# Implementing vs. Specifying Distributed Systems: The Completeness Gap

## The Central Problem

The Raft paper identifies a critical gap in distributed systems literature: specifications often describe elegant theoretical cores while leaving critical implementation details unspecified. The paper states: "Lamport's descriptions are mostly about single-decree Paxos; he sketched possible approaches to multi-Paxos, but many details are missing. There have been several attempts to flesh out and optimize Paxos, such as [26], [39], and [13], but these differ from each other and from Lamport's sketches" (p. 2-3).

The consequence: "Practical systems bear little resemblance to Paxos. Each implementation begins with Paxos, discovers the difficulties in implementing it, and then develops a significantly different architecture" (p. 3).

**The lesson**: Elegant specifications that omit implementation details create a *proliferation of incompatible implementations*, each filling the gaps differently.

## What Makes Paxos "Incomplete"

The paper pinpoints exactly what's missing from Paxos:

### 1. The Single-Decree Assumption
"Paxos first defines a protocol capable of reaching agreement on a single decision, such as a single replicated log entry... Paxos then combines multiple instances of this protocol to facilitate a series of decisions such as a log" (p. 2).

**The problem**: The single-decree protocol is specified precisely, but "the composition rules for multi-Paxos add significant additional complexity and subtlety" (p. 2) that aren't fully specified.

**Why this matters**: Real systems need to handle sequences of decisions, not single decisions. If the specification only covers the single case, implementers must invent the sequencing logic themselves.

### 2. Missing Optimizations
The paper notes: "There is little benefit to choosing a collection of log entries independently and then melding them into a sequential log; this just adds complexity. It is simpler and more efficient to design a system around a log, where new entries are appended sequentially in a constrained order" (p. 3).

**The problem**: Paxos describes a symmetric protocol where any node can propose any value at any position. But this generality is unnecessary—real systems need sequential logs.

**The gap**: The specification doesn't guide implementers toward the simpler sequential approach because it's framed around the more general (but less practical) independent-position approach.

### 3. Leadership as Optimization vs. Core Design
"Paxos uses a symmetric peer-to-peer approach at its core (though it eventually suggests a weak form of leadership as a performance optimization)" (p. 3).

**The problem**: Leadership is presented as optional, but "few practical systems use" the peer-to-peer approach (p. 3). Every implementation adds leadership but does so differently.

**The gap**: If leadership is necessary in practice, the specification should make it central and specify it precisely.

## Raft's Approach: Specify the Complete System

Raft inverts the priority: instead of specifying the minimal theoretical core, it specifies the complete practical system.

### Complete Coverage
The paper includes:
- Core consensus (Section 5)
- Leader election details (Section 5.2)
- Log replication mechanics (Section 5.3)
- Safety constraints (Section 5.4)
- Timing requirements (Section 5.6)
- Membership changes (Section 6)
- Log compaction (Section 7)
- Client interaction (Section 8)

Notice what's included that many papers would omit: timing requirements, client interaction, operational concerns like log compaction.

### The Justification
"It was important not just for the algorithm to work, but for it to be obvious why it works" (p. 1).

**Translation**: If implementers don't understand *why* the design choices were made, they'll make different choices when extending the system, potentially violating safety properties.

## The Implementation Divergence Problem

The paper documents specific ways Paxos implementations diverge:

### Example 1: Chubby
"The Chubby implementers... comment: 'There are significant gaps between the description of the Paxos algorithm and the needs of a real-world system... the final system will be based on an unproven protocol'" (p. 3).

**The pattern**: Start with Paxos → encounter practical needs → invent solutions → result is "unproven" because it's no longer Paxos.

### Example 2: ZooKeeper
"ZooKeeper's algorithm has been published in more detail, but it is quite different from Paxos" (p. 15).

**The pattern**: The published system bears little resemblance to the specification it was supposedly based on.

### Example 3: Viewstamped Replication
The paper notes VR is "similar in many ways" but has "additional mechanism" for handling leadership transitions (p. 15).

**The pattern**: Multiple systems solving the same problem arrive at different solutions because the underlying specification leaves room for interpretation.

## Application to Agent Systems

### The Specification Gap in AI Orchestration

When designing WinDAGs or similar agent orchestration systems, there's a temptation to specify only the "interesting" parts:
- How tasks are decomposed
- How skills are selected
- How dependencies are resolved

**What often gets omitted**:
- How do agents report partial progress?
- What happens when a skill times out mid-execution?
- How do you add new skills without downtime?
- How do you handle skills with conflicting resource requirements?
- What's the failure model for network partitions?
- How do you test the orchestration logic?

### The Consequence of Incomplete Specification

If the orchestration framework only specifies the "happy path," every team using it will invent their own approaches to:
- Error handling
- Retry logic
- State persistence
- Monitoring and debugging
- Configuration management

This creates fragmentation: debugging becomes difficult because different deployments behave differently, and shared tooling is impossible because everyone has different extension mechanisms.

### Raft's Lesson: Specify the Operational Concerns

The paper includes Section 5.6 "Timing and availability" which specifies: "broadcastTime ≪ electionTimeout ≪ MTBF" (p. 10).

This is an *operational requirement*, not a theoretical property. But it's specified precisely because implementers need to know it.

**Application**: For agent orchestration, specify:
- Expected latency ranges for skill execution
- Timeout values and their rationale
- Resource limits (memory, CPU, network bandwidth)
- Concurrent execution constraints
- Monitoring and observability requirements

### Raft's Lesson: Specify the Extension Points

Section 6 (membership changes) and Section 7 (log compaction) could have been left as "implementation details." But they're fully specified because these are operations every real deployment needs.

**Application**: For agent orchestration, specify:
- How to add new skills to the registry
- How to upgrade skill versions without downtime
- How to deprecate old skills
- How to handle backward compatibility

## The Completeness Checklist

From Raft's approach, here's what a complete specification should include:

### 1. Core Algorithm
- The main coordination protocol
- State maintained by each participant
- Message formats and semantics
- **Raft example**: Figure 2 (p. 4) specifies all state variables and RPC formats

### 2. Normal Operation
- Common-case behavior in detail
- Performance characteristics
- Expected latency and throughput
- **Raft example**: "In the common case, a command can complete as soon as a majority of the cluster has responded to a single round of remote procedure calls" (p. 2)

### 3. Failure Handling
- All anticipated failure modes
- Detection mechanisms
- Recovery procedures
- **Raft example**: Sections 5.2 (leader election) and 5.5 (follower crashes) specify exactly how failures are detected and recovered

### 4. Edge Cases
- Corner cases in protocol logic
- Boundary conditions
- Rare scenarios
- **Raft example**: Figure 8 (p. 8) shows subtle commit scenarios; Section 5.4.2 explains why old entries can't be committed by counting replicas

### 5. Safety Properties
- Invariants that must always hold
- Proofs or justifications
- Conditions under which they might be violated
- **Raft example**: Figure 3 (p. 4) lists all safety properties; Section 5.4.3 provides proof sketch

### 6. Operational Requirements
- Timing assumptions
- Resource requirements
- Configuration parameters
- **Raft example**: Section 5.6 specifies timing inequality; Section 7 discusses storage management

### 7. Extension Mechanisms
- How to extend functionality
- What's safe to modify
- What's not safe to modify
- **Raft example**: Section 6 specifies membership changes; Section 7 specifies log compaction

### 8. Implementation Guidance
- Recommended approaches
- Performance optimizations
- Common pitfalls
- **Raft example**: "If desired, the protocol can be optimized to reduce the number of rejected AppendEntries RPCs... In practice, we doubt this optimization is necessary" (p. 7-8)

## The Tradeoff: Completeness vs. Brevity

The paper acknowledges there's a cost to completeness—Raft is longer and more detailed than Paxos. But the user study suggests this is the right tradeoff: "An overwhelming majority of participants reported Raft would be easier to implement and explain (33 of 41 for each question)" (p. 14).

**Why completeness helps understandability**:
1. **No hidden assumptions**: Implementers don't need to guess what was left implicit
2. **Consistent terminology**: The full specification uses the same terms throughout
3. **Reference implementation basis**: A complete spec can be directly translated to code
4. **Testable**: You can verify an implementation matches the spec

**When brevity hurts**:
- Implementers fill gaps differently → divergent implementations
- Edge cases discovered during implementation aren't documented → repeated debugging
- Optimizations aren't shared → everyone rediscovers same solutions

## The Formal Specification Role

The paper describes developing "a formal specification... using the TLA+ specification language. It is about 400 lines long and serves as the subject of the proof. It is also useful on its own for anyone implementing Raft" (p. 14).

**The dual purpose**:
1. **Verification**: Prove safety properties
2. **Implementation guide**: Precise reference for implementers

**Why formal specs help**:
- Ambiguity in English is made explicit
- Edge cases must be handled (can't wave hands)
- State space is completely enumerated
- Implementers can mechanically check their code matches spec

**Application to agent systems**: For complex orchestration logic, consider formal specifications (TLA+, Alloy, Quint) not just for proofs but as implementation references. The process of formalizing forces clarity about edge cases.

## The "Obvious Why It Works" Criterion

The paper states: "It was important not just for the algorithm to work, but for it to be obvious why it works" (p. 1).

**What this means**:
- The specification should include the *reasoning* behind design choices
- Properties should have intuitive explanations, not just formal proofs
- The "why" enables implementers to make correct extensions

**Example from Raft**: The paper doesn't just state "leaders never overwrite entries" (Leader Append-Only Property)—it explains *why*: "This means that log entries only flow in one direction, from leaders to followers, and leaders never overwrite existing entries in their logs" (p. 8). The unidirectional flow is the intuition that makes the property obvious.

**Application**: When specifying agent orchestration:
- Don't just state rules ("tasks must declare dependencies")
- Explain rationale ("dependencies ensure deterministic execution order")
- The rationale helps implementers maintain invariants when extending

## Case Study: Membership Changes

Section 6 (p. 10-11) is instructive because membership changes could be left as an "exercise for the implementer." Most papers would.

**But Raft specifies**:
- Why direct configuration changes are unsafe (Figure 10)
- The joint consensus approach
- Timeline of configuration changes (Figure 11)
- How new servers catch up
- How removed servers are handled

**The result**: Implementers can add membership changes without inventing their own (possibly unsafe) approaches.

**The pattern**: If every deployment will need feature X, specify X completely. Don't leave it as an exercise.

**Application to agent systems**: Features every deployment needs should be specified:
- Adding new skill types
- Upgrading orchestration logic
- Migrating between orchestrator versions
- Changing resource limits
- Modifying retry policies

## The Measurement: Implementation Similarity

One way to measure specification completeness: do independent implementations look similar?

The paper notes: "There are also about 25 independent third-party open source implementations of Raft in various stages of development" (p. 13).

**The test**: If you look at multiple Raft implementations, they follow the same structure—leader election, log replication, safety checks. This suggests the specification provided enough guidance.

**Contrast with Paxos**: The paper documents that Paxos implementations "bear little resemblance" to each other (p. 3).

**Application**: If multiple teams building on your agent orchestration framework create very different extensions for the same functionality (e.g., error handling), your specification is incomplete.

## Design Principles from Raft

### Principle 1: Specify the System You Want Built
Don't specify an abstract theoretical minimum and assume implementers will figure out the rest. Specify the actual system you want people to build.

### Principle 2: Make Practical Concerns First-Class
Timing, resource limits, operational procedures aren't "implementation details"—they're part of the specification.

### Principle 3: Document the Reasoning
The "why" behind design choices is as important as the "what." It enables correct extensions.

### Principle 4: Specify Extension Points Explicitly
If you anticipate extensions, specify safe ways to do them. Don't leave implementers guessing.

### Principle 5: Include Common Failure Modes
If a failure mode occurs in practice (even if rarely), specify how to handle it. Don't assume implementers will discover and solve it correctly independently.

## The Profound Insight

The paper's deepest lesson about specification: **Incompleteness creates divergence, divergence creates incompatibility, and incompatibility prevents ecosystem growth**.

Paxos is elegant and correct, but its incompleteness meant:
- Every implementation is different
- Can't compare performance (apples to oranges)
- Can't share tooling
- Can't learn from others' implementations
- Hard to validate correctness (no reference)

Raft's completeness enabled:
- 25+ compatible implementations
- Shared test suites
- Performance comparisons
- Reusable libraries
- Commercial adoption

**For agent orchestration systems**: Complete specification enables an ecosystem. Incomplete specification creates fragmentation.

The cost of completeness (longer specification documents) is vastly outweighed by the benefit (compatible implementations that can be compared, composed, and improved together).