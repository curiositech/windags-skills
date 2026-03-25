# Intention as Commitment: How Deliberate Limitation Enables Action in Resource-Bound Agents

## The Fundamental Problem: Infinite Reasoning in Finite Time

The Rational Agency project at Stanford in the mid-1980s confronted a problem that every AI agent system eventually faces: **deliberation takes time, and during that time, the world changes**. As Jenkins and Jarvis describe the problem: "Real agents cannot do arbitrarily large computations in limited time. This fact impacts the task of explaining the behaviour of, and indeed designing, agents that are situated in the world and must operate effectively in real time. Consequent on this is that both deliberation and means-end analysis take time. During this time, the situation may change."

This isn't just a performance optimization problem—it's fundamental to understanding intelligence itself. An agent that perfectly deliberates about every possible action will never act. An agent that perfectly plans every step will miss its window. The question becomes: **How do intelligent systems know when to stop thinking and start doing?**

## Bratman's Philosophical Foundation: Intention as a Distinct Mental State

Michael Bratman's theory of practical reasoning provides the answer, and it's philosophically radical: **intentions are not just strong desires or firm beliefs—they are a completely separate category of mental state** whose primary function is to *limit* future reasoning.

As the paper explains: "Bratman's work relies on previous work on practical reasoning and ultimately on folk psychology: the concept that our mental models of the world are, in essence, theories. First discarding and then radically extending the Desire-Belief theory, Bratman shows the importance of intention as a distinct mental attitude, different in character from both desire and belief. His thesis is that intentions are vital for understanding how limited agents, such as human beings, plan ahead and coordinate their actions."

The key insight: **"intentions are commitments to act towards the fulfilment of selected desires"** and **"the commitment implicit in an agent's intention to act limits the amount of practical reasoning that agent has to perform."**

## What This Means for Agent System Design

### 1. Intentions Create Computational Boundaries

When an agent forms an intention, it's not just deciding what to do—it's deciding what *not to reconsider*. If a multi-agent orchestration system forms the intention "retrieve user data from database," it shouldn't continuously re-evaluate whether database access is still the right approach. The intention creates a boundary: within this intention's scope, certain questions are settled.

For WinDAGs-like systems, this suggests:
- **Intention scopes should be explicit**: Each intention should clearly define what remains open for deliberation and what is now fixed
- **Intention revision should be costly**: Breaking an intention should require clear evidence, not just marginal doubt
- **Sub-intentions inherit commitment**: When an intention spawns sub-tasks, those inherit the commitment context

### 2. Intentions Must Be Consistent With Beliefs and Other Intentions

Bratman's model requires that intentions are constrained: "These intentions must be consistent both with the agent's beliefs and with its other intentions. (That is to say, to intend to bring something about, an agent must believe that it is possible to do so, and that doing so will not make other current intentions impossible.)"

This creates a **consistency maintenance problem** for agent systems. Before accepting a new intention, the system must verify:
- **Belief consistency**: Do we believe this intention is achievable given current world state?
- **Intention consistency**: Does this intention conflict with existing commitments?
- **Resource consistency**: Do we have capacity to pursue this alongside other intentions?

This is more sophisticated than simple constraint checking—it's about maintaining a *coherent commitment structure*. An agent orchestration system might have the intention "analyze user behavior patterns" and separately "ensure GDPR compliance." These aren't logically contradictory, but they create tension that must be managed in how they're pursued.

### 3. Partial Plans as Flexible Commitments

The BDI architecture acknowledges that real-world acting requires **partially specified plans** that are "filled out at the time of their eventual execution (when conditions may have changed)."

This is crucial for agent systems operating in uncertain environments. An intention like "generate comprehensive test suite" might initially be partially specified:
- Commitment: We will generate tests
- Open: Exactly which testing framework, what coverage threshold, whether to use property-based testing

As execution proceeds and conditions become clearer, the plan gets filled in. But the *commitment to generate tests* remains stable, providing continuity even as tactics shift.

## The Deliberation-Means-End Balance

Jenkins and Jarvis highlight that the BDI framework emerged from recognizing two separate problems:
1. "The need to recognise that agents have bounded resources"
2. "The problem of balancing the amount of time an agent spends deliberating (deciding what to do), versus doing means-end analysis (planning how to do it)"

For orchestration systems, this creates a three-way balance:
- **Deliberation time**: Choosing which goal to pursue
- **Planning time**: Figuring out how to pursue it
- **Execution time**: Actually doing it

Intentions function as *temporal commitments* that shift resources from deliberation toward planning and execution. Once you've formed the intention, you stop deliberating about whether to do it and start planning how.

## Failure Modes When Intention-as-Commitment Is Violated

### Over-deliberation (Hamlet Syndrome)
Systems that don't form firm intentions will continuously reconsider goals in light of new information, never achieving stability. Every new signal triggers re-evaluation. The system becomes paralyzed by its own sophistication.

**Example**: An agent system monitoring API performance receives slightly elevated latency metrics. Without firm intentions, it might continuously oscillate between "investigate now," "wait for more data," "check if other services affected," never settling long enough to complete any investigation.

### Under-commitment (Butterfly Syndrome)
Systems that form weak intentions will abandon them too readily. Every minor obstacle triggers goal revision. The system lacks persistence.

**Example**: A code review agent encounters a complex file, deems it "difficult," and immediately revises its intention from "review thoroughly" to "flag for human review." The system never develops capability because it never commits to difficult tasks.

### Inconsistent Commitments (Contradiction Syndrome)
Systems that don't maintain intention consistency will pursue contradictory goals simultaneously, wasting resources and creating confusion.

**Example**: An agent system simultaneously holds intentions to "minimize API calls for efficiency" and "maximize data freshness through polling," creating oscillating behavior and poor performance.

## Implications for Hierarchical Agent Systems

In systems where multiple agents coordinate (like WinDAGs), intention-as-commitment has profound implications:

### Higher-Level Intentions Constrain Lower-Level Deliberation
If a coordinating agent forms the intention "deliver security audit by end of day," subordinate agents inherit a time constraint that limits their deliberation. A code analysis agent can't spend three hours optimizing its scanning approach—the parent intention has bounded its reasoning time.

### Intention Transparency Enables Coordination
If agents can observe each other's intentions (not just their beliefs or desires), they can avoid conflicts and find synergies. Agent A's intention to "refactor authentication module" directly impacts Agent B's intention to "add new authentication method"—awareness enables sequencing.

### Intention Handoffs Require Commitment Transfer
When one agent delegates to another, it's not just passing a task—it's transferring a commitment. The receiving agent must be willing to adopt the intention, including its constraints and consistency requirements.

## Boundary Conditions: When Intention-as-Commitment Fails

### Rapidly Changing Environments
In environments where the world state changes faster than intentions can be executed, rigid commitment becomes dangerous. A trading algorithm with firm intentions would be disastrous. Here, intentions must be more provisional, with explicit revision conditions.

### Novel Situations Without Precedent
When an agent encounters something truly unexpected, existing intentions may become incoherent. The system needs meta-level reasoning about when to break commitments—essentially, intentions about intention revision.

### Conflicting Authority Structures
In multi-agent systems with multiple authorities, intention conflicts become political, not just logical. If Agent A receives contradictory intentions from two different coordinators, consistency maintenance isn't a technical problem—it's a governance problem.

## Practical Design Principles

1. **Make intentions explicit data structures**: Don't let intentions be implicit in code flow. Represent them explicitly so they can be examined, revised, and reasoned about.

2. **Implement intention consistency checking**: Before accepting new intentions, verify consistency with beliefs and existing intentions. Make this check visible—log conflicts and resolutions.

3. **Define intention revision policies**: Under what conditions can an intention be broken? High-priority interrupt? Evidence of impossibility? Time limit exceeded? Make these policies explicit.

4. **Scope intentions temporally and spatially**: Every intention should have bounds: "for the next N operations" or "within this module" or "until condition X." Unbounded intentions lead to unbounded commitment.

5. **Distinguish intention strength**: Not all commitments are equal. Some intentions are firm ("write audit log before proceeding"), others provisional ("try using cache first"). Model this explicitly.

6. **Create intention hierarchies**: Parent intentions constrain child intentions. The intention "implement feature securely" creates a context for sub-intentions about specific security measures. The hierarchy carries commitment context downward.

## The Deeper Lesson: Intelligence Requires Selective Ignorance

The most profound implication of intention-as-commitment is that **intelligent behavior requires deliberately limiting your own intelligence**. Perfectly rational agents that consider all possibilities in all contexts cannot act effectively in real time. 

Intentions are mechanisms of deliberate, structured ignorance: "I have decided this, therefore I will not reconsider it unless specific conditions are met." This isn't a bug—it's the foundation of practical intelligence.

For AI agent systems, this means:
- Don't build systems that reconsider everything constantly
- Don't treat commitment as inflexibility—treat it as cognitive efficiency
- Don't view intention revision as learning—view it as expensive and requiring justification
- Don't pursue perfect rationality—pursue bounded rationality with clear commitment structures

The gap between knowing and doing isn't just about execution capability—it's about the *willingness to stop deliberating and commit to action*, even knowing your deliberation was incomplete. That's what intentions provide, and without them, agent systems will drown in their own sophistication.