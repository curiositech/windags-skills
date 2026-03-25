# Public Announcement as a Coordination Primitive: Collapsing Uncertainty Across Agent Networks

## The Problem: Agents in Different Epistemic Worlds

In a multi-agent system, agents begin each task in different epistemic states. Agent A has seen certain inputs; Agent B has processed certain messages; Agent C has made certain observations. Even if all agents are "synchronized" in the sense that they share a common task specification, they may have wildly different models of the current world state, each other's beliefs, and the reliability of shared information.

This epistemic divergence is not a bug to be patched — it is the fundamental condition of distributed intelligence. The question is: what coordination primitives can *reduce* this divergence in a principled, verifiable way?

The Big Brother Logic paper, drawing on Plaza's 1989 work on public communication logics, offers a formal answer: **the public announcement**.

## What a Public Announcement Does (Formally)

In the framework, at any point during the communication phase, a user (or agent) can announce a true formula φ. The effect is precisely defined:

> The current model M is replaced by the updated model M^φ, which is the subgraph of M made up of the worlds u such that M, u |= φ.

In plain terms: the space of possible worlds that any agent considers possible is immediately restricted to only those worlds in which φ is true. Every agent simultaneously eliminates all worlds inconsistent with φ from its model. The accessibility relations are updated accordingly.

This has several remarkable properties:

**Property 1: It is simultaneous.** All agents update at once. There is no window during which some agents have processed the announcement and others have not. (This is an idealization, but a useful one.)

**Property 2: It is witnessed.** Because the announcement is public, every agent knows that every other agent has heard it. And every agent knows that every agent knows this. A public announcement therefore does not just transfer information — it generates *common knowledge* of φ.

**Property 3: It is truth-preserving.** The framework requires that announced formulas be true in the actual world. You cannot publicly announce a falsehood and have it update the model correctly. (This connects to the distinction between announcement and deception.)

**Property 4: It is restrictive, not additive.** Announcements do not add new worlds to the model; they remove inconsistent ones. The effect is always to shrink the epistemic uncertainty, never to expand it.

## The Cascade Effect: Higher-Order Knowledge from First-Order Announcement

Here is the non-obvious power of public announcements: they produce higher-order knowledge as a side effect.

Suppose agent A announces "The intruder is in sector 3." After this announcement:
- Every agent knows "The intruder is in sector 3" ✓
- Every agent knows that every agent knows this ✓
- Every agent knows that every agent knows that every agent knows this ✓ (to all depths)

A single public announcement of a first-order fact generates *common knowledge* of that fact. This is far more than a private message, which only updates the recipient's first-order knowledge.

Why does this matter? Because many coordination failures stem from second- and third-order uncertainty. Agent A acts on the assumption that Agent B knows X. But Agent B doesn't know that Agent A knows that B knows X — so B doesn't know that A is relying on B's knowledge of X. So B doesn't flag when its knowledge of X is uncertain. The result: A acts on a false assumption.

Common knowledge eliminates this cascade of uncertainty. Once a fact is commonly known, every agent can rely on every other agent knowing it, and knowing that they know, recursively — without any further communication.

## Public Announcement vs. Private Message: The Architectural Fork

The paper's treatment of announcements implicitly defines two distinct architectural patterns:

**Pattern A: Private Message**
- Agent A sends message φ to Agent B
- Agent B updates its model to incorporate φ
- Agent A does not necessarily know that B received the message
- Agent B does not know that A knows that B received it
- Result: Information transfer, but not common knowledge

**Pattern B: Public Announcement**
- Agent A broadcasts φ to all agents in J, publicly
- All agents in J simultaneously update their models
- All agents know that all agents have updated
- Result: Common knowledge of φ among J

For most everyday coordination, Pattern A suffices. But for *critical coordination* — where agents need to act in lockstep, where timing matters, where each agent's action depends on its beliefs about other agents' beliefs — Pattern B is necessary.

The practical challenge: true public announcements require a broadcast medium that all agents observe simultaneously and can verify that all other agents observed. In distributed systems, this is surprisingly hard to implement. It requires either:
- A shared log that all agents read synchronously
- A reliable broadcast protocol with acknowledgment verification
- A trusted central announcer whose messages are treated as public

## The Communication Phase Distinction

The paper divides interaction into two phases:
1. **Initialization phase**: Ontic actions — physical reconfiguration (moving cameras, adding hats, repositioning the ball). These change the actual world.
2. **Communication phase**: Epistemic actions — public announcements. These change what agents *know* about the world, without changing the world itself.

This distinction is architecturally important. In the initialization phase, changing the world changes what is *observable*, which changes what is *knowable*. In the communication phase, the world is fixed but knowledge evolves through communication.

For WinDAGs systems, this maps to:
- **Ontic phase**: Setting up tasks, deploying agents, ingesting data, running computations that produce new facts
- **Epistemic phase**: Sharing results, confirming task completion, broadcasting state updates, coordinating handoffs

Mixing these phases carelessly produces epistemic confusion. If an agent announces "Task X is complete" while another agent is still completing it (because they're in overlapping ontic and communication phases), the announcement creates false common knowledge — a kind of epistemic corruption.

**Design rule**: Separate the ontic and communication phases. Complete all world-changing actions before making public announcements about world state. This ensures announcements are true and their effects are correct.

## Belief Revision: The Extension for Uncertain Announcements

The paper notes a limitation: the announcement framework assumes announced formulas are *true*. But in real systems, agents may need to communicate uncertain information, or information that contradicts prior beliefs. For this, the paper points toward *belief revision* rather than public announcement — a framework where updates can incorporate uncertain or potentially false information, with appropriate discounting.

The Bayesian analogue: a public announcement of φ is like a perfect, unquestionable observation. Belief revision is like a noisy observation that updates probabilities but doesn't eliminate worlds with certainty. For agent systems dealing with unreliable information sources, sensor noise, or adversarial inputs, the belief revision framework is more appropriate than pure public announcement.

## Practical Application: Designing Announcement Protocols for Agent Systems

Given these principles, here are design prescriptions for agent systems that need to coordinate around shared epistemic state:

**Prescription 1: Identify which coordination points require common knowledge.**
Not all coordination requires common knowledge. Two agents passing a result from one to the other only need first-order knowledge. But a team of agents beginning a synchronized operation, where each agent's correctness depends on all others proceeding correctly, needs common knowledge of the starting conditions.

**Prescription 2: Design a broadcast channel for public announcements.**
Build a mechanism that reliably delivers messages to all relevant agents simultaneously, with acknowledgment that all parties have received and processed the message. This could be a shared state store, an event bus with guaranteed delivery semantics, or a consensus protocol.

**Prescription 3: Distinguish announcement from notification.**
A notification ("task X is done") is a private message — it updates the recipient but doesn't generate common knowledge. An announcement ("I am publicly confirming that task X is done, and I know all agents have received this") does generate common knowledge. Be explicit about which pattern you are using and when.

**Prescription 4: Validate truth before announcing.**
Announced formulas must be true in the actual world for the epistemic update to be correct. Build verification gates before broadcast announcements. An agent that announces "the data is validated" when validation is pending creates false common knowledge — and every subsequent agent's reasoning, built on that false base, is corrupted.

**Prescription 5: Handle belief revision for uncertain announcements.**
When announcing uncertain information, use a belief revision protocol that tracks confidence levels rather than treating uncertain information as certain. Build agents that can reason under uncertainty rather than requiring all announcements to be certain.

## Conclusion

The public announcement is not just a communication act — it is an epistemic operation with precise, computable effects on the knowledge state of every agent in a system. Treating it as a first-class coordination primitive, with clear semantics and implementation requirements, allows multi-agent systems to reason correctly about collective knowledge, coordinate reliably under uncertainty, and detect when the epistemic preconditions for a coordinated action have or have not been met. This is one of the most powerful tools the Big Brother Logic framework offers for agent system design.