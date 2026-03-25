# The Realizability Problem: Why Embedded Agents Can't Hold All Possibilities In Their Heads

## The Bayesian Paradise

Classical Bayesian reasoning offers a beautiful picture of rational belief:
1. Start with a **prior probability distribution** over all possible worlds
2. As you observe evidence, **eliminate** worlds inconsistent with that evidence
3. Your beliefs converge toward truth as you accumulate evidence

This framework provides strong theoretical guarantees. If the true world is in your hypothesis space (the "realizability" assumption), Bayesian updating provably converges to accurate beliefs. Even without realizability, you achieve "bounded loss" compared to any hypothesis in your space—you can't do much worse than the best available model.

**The catch**: This entire framework assumes the agent is **larger than the environment** it's learning about.

## Why Embedded Agents Break Realizability

An embedded agent is **smaller than its environment**. This creates an impossible requirement: to satisfy realizability, the agent must store in its head:
- A complete model of the environment
- Which includes a complete model of the agent itself
- Which includes a complete model of the agent's world-model
- Which includes... (infinite regress)

The paper states it crisply: "An agent can't fit inside its own head."

This isn't just computationally intractable—it's **logically impossible**. A complete self-model would need to be as complex as the thing being modeled, creating an infinite tower of meta-models.

### The Consequence: No True Hypothesis

For Bayesian agents, learning means ruling out possibilities until only truth remains. But if no hypothesis in your space is actually true, what does "learning" even mean?

Without realizability:
- Your posterior can **oscillate forever** rather than converging
- Your probability estimates may be **uncalibrated** (95% confidence doesn't mean 95% accuracy)
- Your estimates of **means, variances, causal structure** can be arbitrarily wrong
- You might **never** get the right answer, no matter how much evidence you see

## The AIXI Illustration

AIXI is often cited as the "ideal" intelligent agent—a mathematical formalization of perfect rationality. It uses the Solomonoff prior: a probability distribution over all computable environments.

AIXI achieves bounded loss on **predictive accuracy** even without realizability—it won't do much worse than any computable predictor. But:

1. **AIXI itself is uncomputable**: It evaluates an infinite sum over all possible programs. AIXI is made of "more powerful stuff" than the environments it reasons about.

2. **Action optimality requires realizability**: Existing proofs that AIXI makes good decisions (not just predictions) assume the environment is sampled from the Solomonoff distribution—i.e., realizability.

3. **AIXI is strictly dualistic**: It assumes clean I/O channels, with the environment as a function of action-sequences. This sidesteps all the embedded agency problems.

The paper's point isn't "AIXI doesn't work because the world is uncomputable." It's: **AIXI can only be defined by constructing an agent much bigger than the environment.** This works for dualistic settings but breaks down for embedded ones.

## What "Learning" Means Without Realizability

If you can't hold the true world in your hypothesis space, what should you do instead?

### Logical Uncertainty

One answer: You might know the true physics and initial conditions—a complete mathematical description of the universe—but be uncertain about **what that description implies**.

This is **logical uncertainty**: uncertainty not about which world you're in, but about the consequences of mathematical facts you already "know."

For example, you might "know" that your source code plus inputs determines your action, but not yet have **computed** what action that is. You might know the axioms of mathematics but not whether the Riemann hypothesis is true.

Bayesian probability theory doesn't handle this well. Probability is for empirical uncertainty (which possible world?). Logic is for deriving consequences (what follows from axioms?). The two don't combine cleanly.

As the paper notes: "For real-world agents, the process of growth [of the logical tree] is never complete; you never know all the consequences of each belief."

### Bounded Rationality

Without realizability, agents must use **approximate** world-models that are:
- Computationally tractable (can be evaluated in reasonable time)
- Good enough for the task at hand (capture relevant structure)
- Incomplete and wrong in known ways (understood approximation)

But this raises a new problem: How do you reason about the relationship between your approximate model and the territory, when the territory is too large to fit in your head?

## Implications for Agent Systems

### For Model Construction
Modern ML systems are trained on data distributions. The realizability problem suggests:

**Warning**: Even if your model performs well on training and test sets, it might fail catastrophically in deployment because:
1. The true data-generating process isn't in your model class
2. Distribution shift pushes you into regions where your model is systematically wrong
3. Your model captured correlations that break under optimization pressure

**Design principle**: Don't rely on "the model will learn it" if "it" requires the model to capture the full complexity of the environment. Be explicit about what you're approximating and why the approximation is good enough.

### For Hierarchical Decomposition
When WinDAGs decomposes a complex task, each sub-agent works with a partial world-model. The realizability problem says: **These partial models can't capture everything, so they'll be wrong in systematic ways.**

**Orchestration principle**: 
- Sub-agents should know the boundaries of their models (where approximations break)
- Higher-level agents should anticipate sub-agent model failures
- Don't assume composition of locally-good decisions yields globally-good outcomes

### For Self-Modeling
When an agent reasons about its own future actions, it faces realizability problems in concentrated form:
- The agent's self-model must be simpler than the agent itself (to fit inside)
- Therefore the self-model is necessarily incomplete
- Therefore the agent will sometimes be surprised by its own behavior

**For self-improvement capabilities**: An agent that modifies itself based on an incomplete self-model risks:
- Not anticipating side-effects of self-modifications
- Creating instabilities in the self-modeling loop (modified agent has different behavior than predicted)
- Destroying properties that weren't captured in the self-model

### For Value Learning
If an agent is learning "what humans want" from observations, realizability failures mean:
- The true function "what humans want" might not be in the hypothesis space
- The learned approximation might be systematically wrong in ways that only appear under strong optimization
- No amount of training data guarantees convergence to the right values

This connects directly to Goodhart's law (covered in another reference doc): optimizing a learned proxy for human values will exploit the gap between proxy and reality.

## The Theory Person's Defense

The paper anticipates an objection: "Obviously we can't run AIXI or do perfect Bayesian inference. But these are useful idealizations—we learn from them even though they're intractable."

The response: **Realizability isn't just an intractability issue. It's a conceptual mismatch.**

For dualistic settings, AIXI tells us something true about the structure of intelligence: maintain beliefs over hypotheses, update on evidence, choose actions that maximize expected utility given beliefs. These insights transfer to practical systems.

But for embedded settings, the **type of problem is different**:
- You can't have a hypothesis space containing the true environment
- You can't update by elimination (nothing to eliminate toward)
- You can't separate "beliefs about world" from "world containing your beliefs"

This isn't solved by "approximate AIXI with limited compute." It requires **different conceptual foundations**.

## Connection to Other Problems

Realizability connects to:
- **Self-reference**: Including yourself in your world-model creates size problems
- **Logical uncertainty**: The way out might be knowing a mathematical description but not its consequences
- **Goodhart's law**: When your best available model is wrong, optimizing it amplifies the error
- **Subsystem alignment**: Sub-optimizers face their own realizability problems and might learn wrong objectives

## What's Not Yet Known

The paper identifies the problem but doesn't solve it. Open questions:
1. What replaces Bayesian updating when the true hypothesis isn't in your space?
2. How do you maintain good probabilistic reasoning without realizability guarantees?
3. What does "learning" mean when convergence to truth is impossible?
4. How do you design systems that gracefully handle their own incompleteness?

## Practical Takeaway for WinDAGs

**Core principle**: Don't design orchestration strategies that assume sub-agents have complete world-models, even implicitly.

Concretely:
- **Skill decomposition**: Don't assume that if each skill works in its domain, composition will work globally—the skill's domain model is incomplete
- **Error handling**: Expect systematic, not just random, errors from skills—they're using approximate models
- **Oversight**: Higher-level agents need strategies for detecting when lower-level model assumptions break
- **Self-modeling**: If an agent plans its own future actions, it's working with an incomplete self-model—plan for surprises

The embedded agency perspective says: **Incompleteness is fundamental, not a bug to be fixed.** Design accordingly.