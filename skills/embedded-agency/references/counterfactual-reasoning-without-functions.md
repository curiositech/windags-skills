# Counterfactual Reasoning Without Clean Separation: Why Embedded Agents Can't Just "Try Different Actions"

## The Core Problem

Standard decision theory assumes you can evaluate `argmax_a E[U | a]`—find the action that maximizes expected utility. This formulation presupposes that:
1. The environment is a **function** of your action
2. You can evaluate this function for **different possible actions**
3. There's a clean boundary between "you choosing" and "environment responding"

For embedded agents, all three assumptions fail. The agent exists **within** the causal structure it's trying to optimize. Its decision-making is not an external input to an environment-function; it's a physical process that is part of the environment's causal fabric.

## The Five-and-Ten Problem

Consider an agent that can take either $5 or $10. Obviously it should take $10. But if the agent reasons about itself as part of the environment (which it must, being embedded), it might come to **know its own action** before choosing. 

The paper presents a proof-based agent that searches for proofs of statements like "if I take the $5, I get X utility; if I take the $10, I get Y utility." By Löb's theorem, this agent can prove that taking $10 gives $0 and taking $5 gives $5—because the proof itself makes the agent take $5, which makes the proof true (false antecedents imply anything).

**The agent takes $5 because it proves that taking $10 would be bad—and this proof is valid precisely because the agent takes $5.**

This isn't just a logical curiosity. It reveals that when agents reason about themselves as embedded systems, **spurious counterfactuals** can arise: the agent marks an action as bad, doesn't take it, and this non-taking validates the "bad" assessment.

## Why Adding Uncertainty Doesn't Solve It

Intuition: "Real agents won't know their actions with certainty—they'll be uncertain about hardware, cosmic rays, etc. This uncertainty will make counterfactuals well-defined."

This fails for two reasons:

1. **The spurious proof often goes through anyway**: If you're 95% confident you're in a five-and-ten problem, the spurious reasoning can happen within that 95%.

2. **Hardware uncertainty gives perverse counterfactuals**: If the only way you'd take the right path is via a cosmic ray scrambling your circuits, then "taking the right path" becomes associated with "being insane in many other ways." You'll avoid it for that reason. As the paper notes: "If this reasoning in itself is why you always go left, you've gone wrong."

The cosmic ray example reveals something deeper: we want counterfactuals to track what happens when you **deliberately** take an action, not what happens in the weird edge cases where your circuits malfunction. But embedded agents don't have a principled way to distinguish these.

## The View From Outside vs. Inside

When we (as external observers) set up a decision problem, we naturally think: "Let's try different agents and see which one takes the right action." We can do this because we're viewing the problem **dualistically**—agent and environment are separate, and we can substitute different agents into the environment-function.

From inside, the agent doesn't have this luxury. The agent is a physical system whose decision-making process is part of the environment's causal structure. There's no "functional relationship with environment" that the agent can observe and reason about. That's the point: **counterfactuals are called that because they're counter to fact—but embedded agents can't easily reason about counter-to-fact scenarios involving their own decision procedure.**

## Implications for Agent Systems

### For Task Decomposition
When an agent decomposes "choose best action" into sub-questions like "what happens if I do X?", it's invoking counterfactual reasoning. If the agent is modeling itself (as it must for long-term planning), these counterfactuals become logically fraught. 

**Design principle**: Decomposition strategies must avoid creating sub-tasks that require the agent to predict its own final output before computing that output. This suggests:
- Prefer hierarchical decomposition where lower levels have limited models of upper levels
- Design abstraction boundaries that prevent full self-modeling within optimization loops
- Consider "updateless" approaches where the agent commits to a policy before observing details

### For Multi-Agent Coordination
When multiple AI agents reason about each other, each is an embedded agent from the other's perspective. Standard game theory assumes agents can model "what happens if I do X" while other agents model "what happens if they do Y"—but if agents are good enough at modeling each other, this creates fixed-point problems.

Nash equilibria "solve" this by having each agent play a mixed strategy—introducing randomness to break the paradoxes. But this is a *stipulation*, not a *derivation* from first principles.

**For coordination protocols**: Don't assume agents can cleanly separate "my decision process" from "their decision process" when designing coordination mechanisms. Agents that can predict each other create circular dependencies that standard game theory sweeps under the rug with equilibrium concepts.

### For Architecture Design
Modern AI systems often include:
- A model of the world
- A model of the system's own capabilities
- Planning algorithms that search over actions

The embedded agency perspective warns: if your world-model includes yourself, and your planning algorithm can reason about your own future planning, you've created a self-referential loop. This isn't necessarily bad, but standard optimization frameworks (which assume you're optimizing a function) won't give reliable guidance.

**Architecture principle**: Be extremely careful about which parts of the system can model which other parts. Self-reference isn't avoidable, but uncontrolled self-reference in optimization loops creates counterfactual instabilities.

## The Deeper Issue: What Is "Choosing"?

The paper asks: "In Emmy's case, how do we formalize the idea of 'choosing' at all?"

For dualistic agents, "choosing" means: evaluate outcomes for each possible action, then execute the best. For embedded agents, "executing action A" isn't separate from "the world containing a system that executes A." There's only one timeline, and in that timeline the agent does one thing.

This connects to the problem of optimization without functions. Optimization requires:
1. A space of possibilities
2. An objective function over that space
3. A search/selection procedure

For embedded agents:
1. The "space of possibilities" can't be crisply separated from actual world-states
2. The "objective function" can't be evaluated independently of what the agent does (because the agent is in the world)
3. The "selection procedure" is a physical process that creates the very outcome being evaluated

**Current models of rationality assume you can separate these.** Embedded agency reveals this separation is a convenient fiction that breaks down under scrutiny.

## Connection to Other Problems

This connects directly to:
- **Logical uncertainty**: If you could compute all logical consequences instantly, you'd know your own action (since your action is a logical consequence of your source code and inputs)
- **Realizability**: Dualistic frameworks can assume the true environment is in your hypothesis space; embedded agents can't, because they're smaller than what they're modeling
- **Subsystem alignment**: Sub-optimizers might reason about the outer optimizer's counterfactuals in ways that create adversarial incentives

## What We Don't Yet Know

The paper doesn't solve counterfactual reasoning for embedded agents. It shows:
- Why standard approaches (functions, probabilities, logic) all fail
- Why "add uncertainty" doesn't fix the problem
- Why the problem is fundamental, not just an implementation detail

Open questions for agent system design:
- Can we define "deliberate action" vs "accidental action" without dualistic assumptions?
- What does "exploring alternative actions" mean when you're embedded?
- How do we get good enough counterfactuals for planning without perfect counterfactuals?

## Practical Takeaway

For WinDAGs orchestration: **Don't assume agents can cleanly evaluate "what if I did X instead of Y?" when X and Y involve the agent's own future reasoning.** This affects:
- Planning skills that involve searching over agent strategies
- Self-modification or self-improvement capabilities
- Any "reflection" tasks where agents reason about their own decision-making

The embedded agency perspective suggests that getting this right requires not just better algorithms, but different **conceptual foundations** for what "choosing" means.