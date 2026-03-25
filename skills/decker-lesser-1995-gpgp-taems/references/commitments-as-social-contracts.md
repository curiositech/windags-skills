# Commitments as Social Contracts in Multi-Agent Coordination

## The Nature of Commitments in GPGP

GPGP introduces a sophisticated notion of commitments as the primary currency of coordination. Unlike simple message passing or shared memory, commitments are **social contracts between agents with specific semantics and lifecycle properties**. As the paper states: "The GPGP family of coordination mechanisms also makes a stronger assumption about the agent architecture. It assumes the presence of a local scheduling mechanism...that can decide what method execution actions should take place and when" (p. 74). Commitments are the interface between this local decision-making and inter-agent coordination.

The paper defines commitments formally and distinguishes two fundamental types: "C(Do(T, q)) is a commitment to 'do' (achieve quality for) T and is satisfied at the time t when Q(T, t) ≥ q; the second type C(DL(T, q, tdl)) is a 'deadline' commitment to do T by time tdl and is satisfied at the time t when [Q(T, t) ≥ q] ∧ [t ≤ tdl]" (p. 75).

This distinction between "Do" commitments (promising to achieve a quality level eventually) and "Deadline" commitments (promising to achieve it by a specific time) is fundamental. Different coordination situations require different commitment types.

## Commitments Are Directed and Social

A crucial aspect of GPGP's commitment model is that "Commitments are social—directed to particular agents in the sense of the work of Castelfranchi and Shoham" (p. 75). This has several important implications:

**Accountability**: When Agent A makes a commitment to Agent B, B can hold A accountable for fulfilling it. The commitment is not a general broadcast of intent but a specific obligation to a specific agent.

**Asymmetric Information**: A commitment from A to B tells B something about A's plans, but doesn't necessarily inform other agents. "A local commitment C by agent A becomes a non-local commitment when received by another agent B" (p. 75). Agent C might be unaware of A's commitment to B, and that's acceptable.

**Targeted Communication**: Because commitments are directed, they minimize unnecessary communication. Only agents that need to know about a commitment receive it. This contrasts with blackboard or publish-subscribe approaches where information is broadcast to all potentially interested parties.

**Social Pressure**: The social nature of commitments creates implicit pressure to fulfill them. While the current GPGP mechanisms assume cooperation, the framework could be extended to include reputation systems or penalties for broken commitments.

## Commitment Lifecycle: Creation, Communication, Revision

Commitments have a well-defined lifecycle that the paper makes explicit:

**Creation**: Commitments are created by coordination mechanisms in response to detected coordination relationships. For example, Mechanism 3 (Simple Redundancy) "looks for situations where the current schedule S at time t will produce quality for a predecessor in HPCR, and commits to its execution by a certain deadline both locally and socially" (p. 77).

**Local Recording**: When a commitment is created, it's added to the agent's local commitment set C. This affects future invocations of the local scheduler: "The second input is a set of commitments C. These commitments are produced by the GPGP coordination mechanisms, and act as extra constraints on the schedules that are produced by the local scheduler" (p. 75).

**Communication**: The commitment is sent to relevant agents: "When a commitment is sent to another agent, it also implies that the task result will be communicated to the other agent (by the deadline, if it is a deadline commitment)" (p. 75). This communication is an action with costs (included in the overhead analysis).

**Reception**: When received, the commitment becomes a non-local commitment at the receiving agent: "The third input to the local scheduler is the set of non-local commitments NLC made by other agents. This information can be used by the local scheduler to coordinate actions between agents" (p. 75).

**Satisfaction or Violation**: Eventually, the agent either satisfies the commitment or fails to. The local scheduler provides the function Violated(S) that "returns the set of commitments that are believed to be violated by the schedule" (p. 75).

**Renegotiation**: If a commitment is violated, alternatives may be proposed: "For violated deadline commitments C(DL(T, q, tdl)) ∈ Violated(S) the function Alt(C, S) returns an alternative commitment C(DL(T, q, t'dl)) where t'dl = min t such that Q(T, t) ≥ q if such a t exists, or NIL otherwise" (p. 75-76).

## Negotiability as a Commitment Property

One of GPGP's most sophisticated features is the negotiability index attached to commitments: "Every commitment has a negotiability index (high, medium, or low) that indicates (heuristically) the difficulty in rescheduling if the commitment is broken" (p. 76).

This index encodes meta-information about the commitment's flexibility:

**High Negotiability**: The commitment is relatively flexible. Breaking it would be inconvenient but not catastrophic. Example: "Initially, all Do commitments initiated by the redundant coordination mechanism are marked highly negotiable" (p. 78). This makes sense because if one agent doesn't handle a redundant method, another agent can likely pick it up.

**Medium Negotiability**: Breaking this commitment would create significant difficulties. Example: "When a redundant commitment is discovered, the negotiability of the remaining commitment is lowered to medium to indicate the commitment is somewhat more important" (p. 78). After redundancy is resolved, the remaining agent is the only one positioned to do the work, making the commitment more critical.

**Low Negotiability**: Breaking this commitment would likely cause cascading failures. Example: "The new completed commitment is entered locally (with low negotiability)" for hard coordination relationships (p. 78). If enables(M₁, M₂) and the commitment to M₁ is broken, M₂ cannot proceed at all.

The negotiability index is used when choosing between conflicting schedules: "If both schedules have the same utility, the one that is more negotiable is chosen" (p. 76). This implements a sensible heuristic: if you must break commitments, break flexible ones before inflexible ones.

## How Commitment Conflicts Are Resolved

A sophisticated aspect of the system is how it handles situations where local optimization conflicts with keeping commitments. The coordination substrate identifies two key schedules:

- **Su**: The schedule with highest utility according to the local scheduler
- **Sc**: The best schedule that violates no commitments

If these are the same, no conflict exists. But when they differ, the system faces a choice between local utility and social obligation. The resolution is subtle:

"We examine the sum of the changes in utility for each commitment. Each commitment, when created, is assigned the estimated utility Uest for the task group of which it is a part. This utility may be updated over time (when other agents depend on the commitment, for example). We then choose the schedule with the largest positive change in utility" (p. 76).

This allows the system to break commitments when doing so increases overall utility, but it accounts for the fact that commitments may be more important than they appear locally. If other agents are depending on a commitment, its utility may exceed the local utility gain from breaking it.

## The Communication of Commitment Changes

When commitments are violated and alternatives proposed, this must be communicated: "If the commitment was made to other agents, the other agents are also informed of the change in the commitment" (p. 76). This creates the potential for cascading changes: Agent A breaks a commitment to Agent B, forcing B to revise its schedule, potentially causing B to break a commitment to Agent C, and so on.

The paper acknowledges this risk but argues it rarely causes problems in practice: "While this could potentially cause cascading changes in the schedules of multiple agents, it generally does not for three reasons: first...less important commitments are broken first; secondly, the resiliency of the local schedulers to solve problems in multiple ways tends to damp out these fluctuations; and third, agents are time cognizant resource-bounded reasoners that interleave execution and scheduling (i.e., the agents cannot spend all day arguing over scheduling details and still meet their deadlines)" (p. 76).

This is a crucial observation: **the system's time-bounded nature provides a natural damping mechanism**. Agents can't endlessly renegotiate because they have deadlines to meet. This forces them to accept "good enough" coordination rather than optimal coordination.

## Examples of Commitment Creation

The paper shows how different coordination mechanisms create different types of commitments:

**Redundancy (Mechanism 3)**: "Both agents commit to Do their methods for T" (Figure 3). These are Do commitments (no deadline) with high negotiability. When redundancy is detected, one commitment is retracted: "Agent B has retracted its commitment to Do B₁" (Figure 3).

**Hard Relationships (Mechanism 4)**: "The hard coordination mechanism...looks for situations where the current schedule S at time t will produce quality for a predecessor in HPCR, and commits to its execution by a certain deadline" (p. 77). These are DL commitments with low negotiability because the dependent task cannot proceed without them.

**Soft Relationships (Mechanism 5)**: "Soft coordination relationships are handled analogously to hard coordination relationships except that they start out with high negotiability" (p. 78). These are DL commitments, but breaking them doesn't prevent dependent tasks from executing, only makes them slower or lower quality.

## Application to Modern Agent Systems

For orchestration systems like WinDAGs, this commitment model suggests several design patterns:

**Explicit Commitment Types**: Define clear commitment types with formal semantics. At minimum: "best effort" (Do), "by deadline" (DL), and "continuous" (for ongoing services). Each type should have clear satisfaction criteria.

**Commitment Metadata**: Attach rich metadata to commitments including negotiability, estimated utility, creation context, and dependencies. This allows the system to make intelligent decisions about which commitments to prioritize.

**Directed Communication**: Don't broadcast all commitments to all agents. Send commitments only to agents that need to coordinate with the committing agent. This reduces communication overhead and information overload.

**Renegotiation Protocol**: Provide first-class support for commitment revision. Agents should be able to propose alternatives when they can't meet commitments, and receiving agents should be able to accept or reject those alternatives.

**Utility Propagation**: When Agent A depends on Agent B's commitment, propagate utility information back to B. B should know that its commitment has higher utility than just its local view suggests.

**Commitment Tracking**: Maintain explicit data structures tracking: active commitments (C), non-local commitments (NLC), violated commitments, and commitment history. Make these queryable by coordination mechanisms and the local scheduler.

**Time-Bounded Renegotiation**: Put hard limits on how long agents can spend renegotiating commitments. The system needs to balance getting better coordination against actually getting work done.

## Commitments vs. Other Coordination Mechanisms

The commitment-based approach differs from several alternatives:

**vs. Centralized Coordination**: Commitments are peer-to-peer contracts, not orders from a central authority. This provides resilience to coordinator failure and scales better to large systems.

**vs. Shared Memory/Blackboard**: Commitments are directed, not broadcast. They create explicit relationships between specific agents rather than opportunistic coordination through shared state.

**vs. Contracts/Auctions**: GPGP commitments are simpler than full contract protocols. They assume cooperation rather than negotiation over price. This reduces complexity at the cost of assuming aligned incentives.

**vs. Publish-Subscribe**: Commitments are bidirectional—both parties know about the relationship. Publish-subscribe is often unidirectional—publishers don't know who subscribes.

## Boundary Conditions

The commitment-based approach works well when:

1. **Agents are cooperative**: "The current set of GPGP coordination mechanisms are for cooperative teams of agents—they assume that agents do not intentionally lie" (p. 74). Adversarial agents require verification, penalties, or incentive mechanisms.

2. **Commitments are mostly kept**: If most commitments are violated, the overhead of renegotiation dominates. The approach assumes violations are exceptions, not the norm.

3. **Local scheduling is competent**: Commitments only work if agents can actually assess whether they can fulfill them. Incompetent schedulers will make commitments they can't keep.

4. **Communication is reliable**: If commitment messages are lost, agents may act on inconsistent assumptions. The system needs reliable delivery or message acknowledgment.

5. **Cascades are rare**: The damping mechanisms that prevent cascading renegotiation rely on scheduler resilience and time pressure. If schedules are very brittle or deadlines are very loose, cascades might be problematic.

## The Deeper Principle

The fundamental insight is that **coordination in distributed systems should be based on explicit, semantic contracts between agents rather than implicit coordination through shared state or central control**. Commitments make the social obligations of coordination explicit and machine-interpretable. They create a middle ground between complete agent autonomy (where agents ignore each other's needs) and centralized control (where a global scheduler dictates all behavior).

This principle extends beyond multi-agent AI to distributed systems generally. Service-level agreements (SLAs) in microservices are commitments. API contracts are commitments. Promise-based programming models are commitments. The GPGP framework provides a formal foundation for reasoning about these constructs: their types, their lifecycle, their negotiability, and how to resolve conflicts between them.