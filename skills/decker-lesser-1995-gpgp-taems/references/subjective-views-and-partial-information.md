# Coordination Under Subjective, Partial Information

## The Fundamental Challenge

One of GPGP's most important contributions is its explicit treatment of the fact that "each agent has only a partial, subjective view of the complete task structure" (p. 74). This is not a limitation to be worked around but a fundamental characteristic of distributed problem-solving that must be designed for. The framework uses formal notation to distinguish between objective reality and subjective belief: "Formally we write BA^t(x) to mean agent A subjectively believes x at time t" (p. 74).

This distinction matters because agents must make coordination decisions based on incomplete and possibly incorrect information. The question is not "how do we give agents complete information" (which may be impossible or prohibitively expensive) but rather "how do agents coordinate effectively despite incomplete information?"

## Types of Information Incompleteness

The paper identifies several ways agent views can be partial or subjective:

**Private Tasks**: Some tasks are known only to a single agent initially. "The set P of privately believed tasks or methods at an agent A (tasks believed at arrival time by A only) is then {x | task(x) ∧ ∀a ∈ A \ A, ¬BA(Ba(t))(x))}" (p. 76). These private tasks may have relationships to tasks known by other agents, creating hidden dependencies.

**Unknown Relationships**: Even when tasks are mutually known, their interrelationships may not be. The coordination relationship detection mechanism "returns the set of private coordination relationships PCR = {r | T₁ ∈ P ∧ T₂ ∉ P ∧ [r(T₁,T₂) ∨ r(T₂, T₁)]}" (p. 76). Agent A might know about its task T₁ and know that some agent has task T₂, but not know that these tasks are related.

**Incomplete Task Structures**: Figure 1 shows "Agent A and B's subjective views (bottom) of a typical objective task group (top)" (p. 75). The objective structure shows tasks, subtasks, and interrelationships that individual agents don't fully see. Each agent has a locally consistent but globally incomplete picture.

**Uncertain Outcomes**: Even if structure is known, agents may be "uncertain about the outcomes of its actions" (p. 74). A task might take longer than expected, produce lower quality than anticipated, or fail entirely.

**Dynamic Changes**: "The task structure may be changing dynamically" (p. 74). An agent's view might have been accurate when formed but become outdated as new tasks arrive or circumstances change.

## The Subjective Belief Architecture

The paper formalizes agent beliefs about the current episode, including "the agent's beliefs about task groups, subtasks, executable methods, and interrelationships (e.g., B(T₁ ∈ E), B(Tₙ, M₁, Tₐ), B(enables(M₁, M₂)))" (p. 74). This explicit representation of what each agent believes has several important implications:

**Agents Can Believe False Things**: Because beliefs are subjective, "agents may unwittingly transmit information that is inconsistent with an objective view (this can cause, among other things, the phenomena of distraction)" (p. 74). Agent A might commit to completing a task by time t based on its subjective belief, while the objective reality makes this impossible. Agent B, acting on A's commitment, may be distracted into suboptimal decisions.

**Consistency is Local, Not Global**: Each agent maintains beliefs that are internally consistent from its perspective. But global consistency is not guaranteed and may not even be achievable given communication delays and dynamic changes.

**Communication Updates Beliefs**: When Agent A receives a message from Agent B, it updates its beliefs about what B believes and potentially about the objective world. The non-local view mechanism specifically targets this: making private information known when it affects other agents' tasks.

## The Non-Local View Mechanism in Detail

Mechanism 1 addresses the problem of private information affecting shared tasks. It has three policy options:

**'None' Policy**: Communicate no private information. This minimizes communication overhead but leaves agents maximally ignorant of cross-agent dependencies. Each agent works with its local view only.

**'All' Policy**: Communicate all private tasks and their relationships. This provides global knowledge but at maximum communication cost: "O(P)" where P is the set of private tasks (p. 80). In large problems with many private tasks, this quickly becomes prohibitive.

**'Some' Policy**: "The process of detecting coordination relationships between private and shared parts of a task structure is in general very domain specific, so we model this process by a new information gathering action, detect-coordination-relationships" (p. 76). This action identifies which private tasks have relationships to non-private tasks and communicates only those: "if r(T₁, T₂) ∈ PCR and T₁ ∈ P then r and T₁ will be communicated by agent A to the set of agents {a | BA(Ba(T₂))}" (p. 77).

The 'some' policy requires domain-specific code but provides a middle ground: "O(dP) communication" where d is a density measure of coordination relationships (p. 80). If most private tasks are independent, d is small and communication remains manageable.

## Figure 2's Lesson About Information Flow

Figure 2 in the paper (p. 78) shows "Agents A and B's local views after receiving non-local viewpoint communications via mechanism 1." The shaded objects show what each agent learned from the other. Several patterns are evident:

**Partial Revelation**: Agent A doesn't learn about *all* of B's tasks, only those related to A's tasks through some coordination relationship. Similarly for B learning about A's tasks.

**Relationship Context**: When a task is communicated, enough context is provided for the receiving agent to understand how it relates to their own tasks. This includes parent tasks and relevant interrelationships.

**Asymmetric Knowledge**: After the exchange, each agent knows different things. A knows about some of B's tasks that affect A's tasks; B knows about some of A's tasks that affect B's tasks. Neither has complete knowledge, but each has the knowledge they need for coordination.

## Coordination Despite Incompleteness

The key insight is that **complete information is unnecessary for effective coordination**. What matters is that each agent has enough information to:

1. Identify tasks where its actions affect other agents
2. Make appropriate commitments about those tasks
3. Receive commitments from other agents about tasks that affect it
4. Detect when commitments are violated or need renegotiation

The paper demonstrates this through the commitment mechanism: "When a commitment is sent to another agent, it also implies that the task result will be communicated to the other agent (by the deadline, if it is a deadline commitment)" (p. 75). The commitment itself carries only summary information—a quality level and deadline—not the complete plan for achieving it. The receiving agent doesn't need to know how the committing agent will accomplish the task, only that it will be done.

## The Problem of Distraction

The paper acknowledges a critical failure mode: "Because agents can believe and communicate only subjective information, they may unwittingly transmit information that is inconsistent with an objective view (this can cause, among other things, the phenomena of distraction)" (p. 74).

Distraction occurs when Agent A makes decisions based on Agent B's commitments, but B cannot actually fulfill those commitments due to factors outside B's subjective view. For example:

- B commits to completing task T by time t
- A schedules its own tasks assuming T will be done by t
- In objective reality, T takes longer than B expected
- A's schedule becomes suboptimal because it waited for T

This is an inherent risk of coordination under uncertainty. The paper's approach mitigates it through several mechanisms:

**Negotiable Commitments**: By marking commitments with negotiability indices and allowing renegotiation, the system can adapt when initial commitments prove unrealistic.

**Result Communication**: Mechanism 2 ensures that agents communicate not just intent but actual results, allowing others to detect when commitments aren't being met.

**Multiple Schedules**: The local scheduler can produce multiple schedules, some that assume commitments will be met and some that don't, providing fallback options.

## Implications for Agent System Design

For orchestration systems like WinDAGs, this analysis suggests several design imperatives:

**Represent Uncertainty Explicitly**: Don't pretend agents have complete information. The system should explicitly track what each agent knows, what it believes, and the uncertainty in those beliefs.

**Design for Partial Views**: Coordination protocols should work correctly even when agents have incomplete information. Don't require global knowledge as a precondition for correct operation.

**Detect Hidden Dependencies**: Provide tools for agents to discover when their private activities affect others. This might be domain-specific (like GPGP's detect-coordination-relationships) or based on general patterns (like monitoring resource contention).

**Make Commitments Revocable**: Since commitments are based on subjective beliefs that may prove incorrect, the system must support renegotiation. Provide clear protocols for updating commitments and notifying affected agents.

**Bound Information Gathering**: Don't try to give every agent complete information. Instead, give agents enough information to coordinate on the tasks that matter, and provide mechanisms to request additional information when needed.

**Monitor for Distraction**: Instrument the system to detect when agents are being distracted by false commitments. This might involve tracking commitment violations, schedule thrashing, or gaps between expected and actual task completion times.

## The Information Gathering Action Model

The paper models information acquisition explicitly as actions with costs: "The agents can do three types of actions: they can execute methods from the task structure, send direct messages to one another, and do 'information gathering'" (p. 74). This is crucial because it makes the cost of acquiring information explicit and comparable to the cost of computation.

The coordination substrate decides when to gather information: "Information gathering is done at the start of problem solving, when communications are expected from other agents, and when the agent is otherwise idle" (p. 76). This creates a resource allocation problem: should the agent spend time executing methods, gathering information, or communicating?

The paper's approach is conservative: gather information at the start, when messages are expected, and when idle. This ensures necessary information is available without excessive overhead. More sophisticated approaches might gather information speculatively when the value of information is high.

## Boundary Conditions

Coordination under partial information works well when:

1. **The partitions are reasonable**: If most coordination relationships cross agent boundaries, partial views provide little benefit. The approach works best when most of an agent's tasks are independent of other agents' tasks.

2. **Communication is reliable**: The framework assumes messages eventually arrive. In unreliable networks, agents need additional mechanisms to detect lost communications and recover.

3. **Changes are not too rapid**: If the objective task structure changes faster than agents can communicate and update their beliefs, subjective views become dangerously stale.

4. **Agents are not adversarial**: The current mechanisms "assume that agents do not intentionally lie and that agents believe what they are told" (p. 74). Adversarial agents require verification and trust mechanisms.

## The Deeper Principle

The fundamental insight is that **uncertainty is not an implementation detail but a first-class design consideration**. Rather than trying to eliminate uncertainty (by providing complete information) or ignoring it (by assuming perfect knowledge), GPGP explicitly models what agents know and don't know, designs coordination mechanisms that function despite uncertainty, and provides explicit mechanisms for updating beliefs when necessary.

This principle extends beyond multi-agent systems to any distributed system. Services in a microarchitecture don't have complete knowledge of system state. Components in a data pipeline don't know what will happen downstream. The GPGP approach—modeling subjective views, coordinating through commitments, supporting renegotiation, and making information gathering explicit—provides a general pattern for building systems that are robust to uncertainty.