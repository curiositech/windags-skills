# Dualistic vs. Embedded Agency: Why Standard Models of Intelligence Break Down

## The Core Distinction

**Dualistic Agency**: Agent and environment are separate, cleanly divided by I/O channels. The agent is:
- **Outside** the environment (views it from external perspective)
- **Larger** than the environment (can hold complete models)
- **Different stuff** from the environment (made of "more powerful" computational substrate)
- **Given** a clear action/observation interface

**Embedded Agency**: Agent exists within the environment it's optimizing. The agent is:
- **Inside** the environment (part of the causal structure it's reasoning about)
- **Smaller** than the environment (can't hold complete models)
- **Same stuff** as the environment (made of atoms/bits/physics just like everything else)
- **Lacking** clean I/O boundaries (no crisp separation between "agent" and "world")

The paper introduces these through two characters:
- **Alexei** (dualistic): Playing a video game, cleanly separated from it
- **Emmy** (embedded): Playing real life, existing within it

## Why Dualism Is Everywhere

Standard frameworks assume dualism because it makes the math tractable:

### AIXI (Hutter 2005)
The paper uses AIXI as the central example:

```
ak := argmax over ak of sum over (ok,rk) ... max over am of sum over (om,rm) of [rk + ... + rm] 
                    * sum over q of 2^(-l(q)) where U(q,a1..am)=o1r1..omrm
```

This assumes:
1. **Agent and environment are separate**: They interact only through specified channels (actions a, observations o, rewards r)
2. **Environment is a function**: Given action sequence, environment deterministically produces observation-reward sequence
3. **Agent is bigger**: AIXI is uncomputable; it searches over all computable environments. Agent is "made of more powerful stuff."

The paper: "AIXI exists outside of [its] environment, with only set interactions between agent-stuff and environment-stuff. [It requires] the agent to be larger than the environment, and [doesn't] tend to model self-referential reasoning, because the agent is made of different stuff than what the agent reasons about."

### Game Theory
Similarly assumes dualism:
- Agents are modeled separately from the game
- Each agent has a utility function and strategy space
- The game structure is external to the agents

Even though game theory must handle multiple agents (can't make one agent larger than everything), it handles this by:
- Treating agents as special (separate from non-agent environment)
- Using equilibrium concepts (Nash, etc.) to resolve circularity
- Stopping short of letting agents fully model each other

### Bayesian Decision Theory
Standard formulation:
1. Prior distribution over possible worlds
2. Update on observations
3. Choose action maximizing expected utility

This assumes:
- **Realizability**: True world is in your hypothesis space (requires agent ≥ world)
- **Logical omniscience**: You know all logical consequences of your beliefs instantly
- **Clean counterfactuals**: You can evaluate "what if I do A?" for all actions A

All three assumptions fail for embedded agents.

### Reinforcement Learning
Standard RL:
- Agent receives observations and rewards from environment
- Agent outputs actions to environment
- Environment is a Markov Decision Process (MDP)

This is explicitly dualistic:
- Agent-environment boundary is definitional
- State transitions are functions of actions
- Agent optimizes from outside the MDP

## Where Dualism Comes From

The paper suggests dualism isn't a mistake—it's a **useful approximation** that works for many purposes:

**For humans reasoning about problems**: We are, in fact, sort of separate from most problems we think about. When I plan a route to work, treating myself as "outside" the road network is approximately correct.

**For simple AI systems**: A chess program really is separate from the chess game. The board position is genuinely a function of moves. The program can exhaustively search possibilities.

**For mathematical tractability**: Dualistic frameworks allow clean theorems, convergence guarantees, optimality results.

**But the approximation breaks down when**:
- The agent is powerful enough to affect the substrate it runs on
- The environment is complex enough to contain copies/models of the agent
- The agent must reason about itself as a physical system
- Self-improvement or self-modification is possible

## The Four Embedded Problems

The paper organizes embedded agency problems around four complications from dualism breaking down:

### 1. No Clean I/O → Decision Theory Problems
Without clean input/output channels:
- You can't treat environment as a function of actions
- Counterfactuals become problematic (what does "choosing differently" mean?)
- Your decision is part of the causal structure, not external to it

**Key problems**: Counterfactuals, Newcomb-like situations, knowing your own action

### 2. Agent Smaller Than Environment → World-Model Problems  
When you can't hold the true world in your head:
- Bayesian realizability fails
- You can't represent all possibilities
- Logical uncertainty (uncertain about consequences of what you "know")
- Self-models must be simpler than self (infinite regress otherwise)

**Key problems**: Realizability, logical uncertainty, ontological crises, self-reference

### 3. Capable of Self-Improvement → Delegation Problems
When you can build smarter successors:
- Successor might not share your goals (value loading problem)
- You can't verify successor's reasoning (Vingean reflection)
- Successor might resist modification (corrigibility)
- Any proxy you optimize breaks (Goodhart's law)

**Key problems**: Vingean reflection, value learning, corrigibility, stable value pointers

### 4. Made of Parts → Subsystem Alignment Problems
When you must decompose computation:
- Subsystems might optimize different things than overall system wants
- Search over rich spaces creates inner optimizers
- Subgoals can become divorced from original goals
- Pointers to values can be gamed

**Key problems**: Inner optimizers, subgoal alignment, robustness to relative scale

## Why These Problems Are Entangled

The paper emphasizes: "You shouldn't think of these four complications as a partition. They are very entangled with each other."

**Examples of entanglement**:

**Realizability ↔ Self-Reference**: You can't hold the true world-model because doing so requires modeling yourself completely, which requires your self-model to be as large as you.

**Decision Theory ↔ World-Models**: Counterfactual reasoning requires world-models. If you can't model the world correctly (realizability problem), your counterfactuals will be wrong.

**Delegation ↔ Subsystems**: Building a successor is a special case of subsystem alignment. Your future self is a subsystem with its own goals.

**All Four ↔ Logical Uncertainty**: 
- Decision theory: Counterfactuals about your actions involve logical uncertainty
- World-models: Realizing you can't hold all models means accepting logical uncertainty about consequences
- Delegation: Trusting smarter successors without predicting them is logical uncertainty about their reasoning
- Subsystems: Not knowing what subsystems will do is logical uncertainty about subcomputations

The common thread: **When you can't be logically omniscient, all the standard frameworks break.**

## What AIXI Gets Right (And Wrong)

The paper uses AIXI as both:
- A foil (showing limitations of dualistic frameworks)
- Inspiration (demonstrating what understanding looks like)

**What AIXI gets right**:
- Formalizes intelligence precisely (even if uncomputable)
- Handles uncertainty via Bayesian reasoning
- Achieves optimality results (under its assumptions)
- Provides conceptual clarity about agency structure

The paper: "When the authors look at AIXI, we feel like we really understand how Alexei works. This is the kind of understanding that we want to also have for Emmy."

**What AIXI gets wrong for embedded agents**:
- Assumes clean I/O (Emmy doesn't have this)
- Requires agent > environment (Emmy is smaller)
- No self-reference (Emmy must reason about herself)
- Assumes realizability (Emmy can't hold all possibilities)

**The deeper problem**: AIXI's assumptions aren't just computationally intractable—they're **conceptually mismatched** to embedded settings.

The paper: "The qualitative way AIXI wins games is by assuming we can do true Bayesian updating over a hypothesis space, assuming the world is in our hypothesis space, and so on... But embedded agents don't just need approximate solutions to that problem; they need to solve several problems that are different in kind from that problem."

## The "View From Outside" Illusion

When we design systems or solve decision problems, we naturally take an outside view:
- "Let's try different agents and see which works"
- "Given this environment function, what's the optimal policy?"
- "Here's the world-model; now compute best action"

But this outside view **isn't available to the agent itself**:
- The agent can't swap itself out and try alternatives
- The agent doesn't have a "function" to optimize (it's inside the causal structure)
- The agent can't step outside to evaluate its world-model against reality

The paper: "From inside, the agent doesn't have this luxury. The agent is a physical system whose decision-making process is part of the environment's causal structure. There's no 'functional relationship with environment' that the agent can observe and reason about."

**This is why counterfactuals are hard**: From outside, we can easily imagine different agents in the same environment. From inside, the agent is part of the environment—there's only one timeline.

**This is why realizability is hard**: From outside, we can compare the agent's model to the true environment. From inside, the agent only has its models—no god's-eye view of truth.

**This is why self-improvement is hard**: From outside, we can evaluate whether a successor is aligned. From inside, you must trust a successor you can't fully understand.

## Implications for Agent System Design

### Don't Paper Over Embedded Problems

**Anti-pattern**: "We'll handle this by approximation/engineering/pragmatism."

Example: "Real agents won't perfectly predict themselves, so the self-reference problem isn't real."

The paper's response: These aren't just engineering challenges to be approximated away. They're **conceptual confusions** about what agency is. If your conceptual framework assumes dualism, your approximations will inherit the mismatch.

### Recognize When You're Assuming Dualism

Many design patterns implicitly assume dualism:

**In planning**: "Simulate outcomes of possible actions"
- Assumes actions are external interventions in a model
- Doesn't account for: action-selection is part of the world being modeled

**In learning**: "Update beliefs based on observations"  
- Assumes clean observation channel
- Doesn't account for: observation process is part of what you're learning about

**In goal specification**: "Maximize this objective function"
- Assumes function captures what you want
- Doesn't account for: function is a proxy that breaks under optimization (Goodhart)

**In modularity**: "Decompose into independent submodules"
- Assumes modules can be reasoned about separately
- Doesn't account for: modules might become optimizers pursuing their own goals

### Use Dualistic Frameworks Carefully

The paper isn't saying "never use dualistic models." It's saying: **Know when the approximation breaks.**

Dualistic models are fine when:
- Agent is actually much smaller than environment (human planning a route)
- Self-reference isn't critical (chess program doesn't need to model itself)
- Optimization pressure is weak (Goodhart's law hasn't kicked in yet)
- Subsystems are simple/verified (no risk of inner optimizers)

Dualistic models break when:
- Agent becomes powerful enough to affect own substrate
- Agent must reason about copies of itself
- Strong optimization on proxies (Goodhart territory)
- Rich search spaces (inner optimizer risk)

### Design for Embeddedness

What does this mean concretely?

**For world-models**:
- Expect models to be incomplete/wrong (realizability failure)
- Handle logical uncertainty about model consequences
- Allow ontology updates (models might use wrong concepts)
- Include self-models that are simpler than self

**For decision-making**:
- Don't require perfect counterfactuals (you can't step outside)
- Handle knowing-your-own-action scenarios
- Plan under logical uncertainty
- Accept that "choosing" is more complicated than argmax

**For goal preservation**:
- Don't assume goals stay stable under learning
- Expect proxies to break (Goodhart)
- Monitor for goal drift in subsystems
- Build in corrigibility (allow goal correction)

**For modularity**:
- Assume subsystems might misalign
- Limit optimization strength of subsystems
- Monitor for emergent inner optimizers
- Design for robustness to relative scale

## The Embedded Worldview

The paper is advocating for a shift in how we think about intelligence:

**Old view (dualistic)**: Intelligence is optimization from outside. Agent has goals, models, and decision procedure. Agent is separate from world.

**New view (embedded)**: Intelligence is a physical process occurring within the world. "Agent" is an abstraction over certain causal patterns. Agency is a matter of degree, not kind.

**Consequences**:

1. **No clean boundaries**: Where does agent end and environment begin? Depends on your abstraction level.

2. **No perfect models**: Agent is always working with incomplete/approximate representations of a world that includes itself.

3. **No guaranteed goal-preservation**: Goals emerge from physical processes that can change.

4. **No atomic "choosing"**: Decision-making is a physical process, not a metaphysically special act.

This is conceptually harder—which is why we gravitate toward dualistic frameworks. But for building truly capable embedded agents (which includes any sufficiently advanced AI), we need to confront these complications.

## Practical Takeaway for WinDAGs

**Core principle**: Most orchestration patterns implicitly assume dualism. Be aware when embedded complications matter.

**Critical transitions** (when to stop trusting dualistic approximations):

1. **Self-modification**: When agents can modify themselves, dualistic models break (no clean agent/environment boundary)

2. **Meta-reasoning**: When agents reason about their own reasoning, self-reference problems appear

3. **Strong optimization**: When optimization pressure is high, Goodhart's law makes proxies unreliable

4. **Rich decomposition**: When task decomposition involves complex subsystems, inner optimizer risk emerges

**For each skill/capability**: Ask:
- Does this assume clean I/O? (Will break if agent must model self-in-environment)
- Does this assume realizability? (Will break if world is too large/complex)  
- Does this assume goal stability? (Will break under self-modification or learning)
- Does this assume subsystem alignment? (Will break if subsystems can optimize)

**The embedded agency perspective**: Don't try to build embedded agents using dualistic frameworks and hope approximation suffices. Build with embeddedness in mind from the start.