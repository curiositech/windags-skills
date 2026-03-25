# Kripke Models as a Framework for Agent Uncertainty and Information State

## Introduction: What Is a Kripke Model, and Why Do Agents Need One?

A Kripke model is, at its core, a formal way of representing uncertainty. It consists of:
- A set of **worlds** (possible states the world could be in)
- **Accessibility relations** for each agent (which worlds does agent A consider possible, given what A has observed?)
- A **valuation function** (which propositions are true in which worlds)

The Big Brother Logic paper uses Kripke models as the semantic foundation for reasoning about what surveillance camera agents know. The "worlds" in this model are all possible angle assignments for all cameras — every combination of orientations that the cameras could be in. The actual configuration is one of these worlds, but each agent, based only on what its own camera can see, may be unable to distinguish the actual world from many other possible worlds.

This is not just a mathematical formalism. It is a precise representation of the epistemic situation of every agent in every uncertain environment.

## The Vision Sets: Computing What Each Agent Considers Possible

The paper introduces the concept of **vision sets**: for a given camera a, the set of all possible sets of cameras (and objects) that a could see, across all possible world states (angle assignments). This is the agent's *epistemic footprint* — the range of observational outcomes that a could experience.

Why does this matter? Because an agent's knowledge is determined not by what it sees, but by what it *cannot rule out*. If camera a1 can see camera a2 from its current position, it knows a2's orientation (because a2's orientation is visible in a1's image). But if a1 cannot see a2, then from a1's perspective, a2 could be pointing in any direction — all those directions are equally possible worlds.

The model checking algorithm works by:
1. Computing vision sets for each camera given its current position and angle
2. Constructing the induced Kripke model (which worlds remain accessible to which agents)
3. Evaluating the epistemic formula by traversing the model

This is a principled, computable approach to agent uncertainty that goes well beyond "the agent doesn't have the data yet."

## From Perceptual Access to Knowledge: The Semantic Bridge

The key semantic principle in the paper is: **agent a knows φ in world w if and only if φ is true in every world that a considers possible from w.**

This means:
- `Ka(φ)` is not merely "agent a has received information asserting φ"
- It is "there is no world consistent with a's observations in which φ is false"

This is a much stronger condition. An agent can receive a message saying φ is true but not *know* it (if the agent cannot verify the source, or if there are worlds consistent with its observations in which the message is false). Conversely, an agent may know something without having been explicitly told — by ruling out all worlds in which it is false through its own observations.

For WinDAGs agents: an agent that has received a confirmation message does not necessarily *know* the confirmed fact. It depends on whether the agent's model of the world has been updated to exclude all worlds in which the fact is false. This is the difference between **receiving information** and **achieving knowledge**.

## Higher-Order Knowledge: What Agents Know About Agent Knowledge

The most powerful aspect of the Kripke framework is its natural support for **higher-order epistemic reasoning** — what agents know about what other agents know.

The formula `Ka(Kb(φ))` means: agent a knows that agent b knows φ. In Kripke terms: in every world accessible to a, agent b knows φ — meaning in every world accessible to a, every world accessible to b satisfies φ.

The formula `CJ(φ)` (common knowledge) is even stronger: every agent in J knows φ, and every agent knows every agent knows φ, recursively to all finite depths. Common knowledge is the fixed point of mutual knowledge — it is what holds when a public, unambiguous announcement has been made in front of all agents simultaneously.

Common knowledge is surprisingly rare in practice. It requires not just that everyone knows φ, but that everyone knows everyone knows φ, and so on. A message that is sent but might not have been received does not generate common knowledge. A message received but whose receipt is uncertain to the sender does not generate common knowledge. Only public, witnessed announcements — events that all agents observe and know that all other agents observe — generate common knowledge.

## Implications for Agent System Architecture

**Implication 1: Model what agents know, not just what they have.**
Agent state in an orchestration system should include not just the data the agent holds, but a representation of what the agent *knows* — which is determined by the space of worlds it cannot rule out. Two agents with the same data may have different knowledge states if they have different models of reliability, sources, or context.

**Implication 2: Design for knowledge, not just information flow.**
Many agent coordination failures happen because designers confuse information transfer with knowledge transfer. Message X was sent, therefore agent B knows X. But this conflates the map with the territory. Knowledge is a property of the agent's internal epistemic state, not of the message queue.

**Implication 3: Higher-order knowledge gaps cause coordination failures.**
If agent A needs to act in a way that depends on B acting correctly, A may need to know that B knows the relevant facts — not just that B has received them. Systems that only track first-order information ("did B get the message?") will miss these second-order coordination gaps ("does B know I know it got the message, so B knows I'll be relying on it?").

**Implication 4: Common knowledge is the gold standard for reliable coordination.**
For critical coordination — especially where timing and mutual reliance are involved — aim for common knowledge. This means: public, verifiable announcements; acknowledgment protocols where all parties observe each other's acknowledgment; shared logs that all agents can inspect and know that all other agents can inspect.

## The Combinatorial Challenge

The Kripke model over all possible camera angles is, in general, extremely large. For n cameras each with continuous rotation, the model is infinite. The paper addresses this by working with finite, discrete angle assignments and by computing vision sets efficiently — essentially compressing the model by grouping worlds that are epistemically equivalent.

For agent system design, this points to an important trade-off: **full epistemic tracking is expensive.** A system that maintains an exact Kripke model for every agent may be computationally intractable. Practical approximations include:
- **Assume reliable communication**: treat message receipt as knowledge (risky but cheap)
- **Maintain explicit uncertainty flags**: track when an agent is uncertain rather than modeling the full uncertainty space
- **Use probabilistic belief models**: replace sharp Kripke worlds with probability distributions over states
- **Bound the depth of higher-order reasoning**: only track K(φ) and K(K(φ)), not higher

The Big Brother Logic framework shows what the ideal looks like. Agent system engineers must decide how close to that ideal to get, given computational constraints.

## Conclusion

The Kripke model is not just a logical formalism — it is a design philosophy. It insists that uncertainty is structured, that knowledge is a function of what can be ruled out, and that higher-order reasoning about what other agents know is essential for correct coordination. For WinDAGs agents, internalizing this framework means asking, for every coordination design: "What is the Kripke model here? What do agents know, and what do they know about each other's knowledge? And how does the protocol produce the epistemic state required for correct collective behavior?"