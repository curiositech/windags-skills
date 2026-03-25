# Transforming Decision Theory into Symbolic Agent Architectures

## The Bridge Between Quantitative and Qualitative Rationality

One of the most significant contributions in Rao and Georgeff's work is demonstrating that quantitative decision theory and symbolic BDI architectures are not competing paradigms but different representational perspectives on the same underlying model of rational agency. This document details the formal transformation that bridges these perspectives and explains why such a bridge is essential for practical agent systems.

## The Classical Decision Tree Model

Decision theory models rational choice using decision trees with three components:

1. **Decision nodes** - points where the agent chooses among alternative actions
2. **Chance nodes** - points where the environment evolves according to probability distributions
3. **Terminal nodes** - endpoints labeled with payoffs or utilities

Additionally, two functions are defined:
- A **probability function** mapping chance nodes to probabilities (including conditional probabilities)
- A **payoff function** mapping terminal nodes to real numbers representing utilities

A **deliberation function** (such as maximize expected utility or maximin) then determines the optimal action sequence to follow from any given decision node.

This model is mathematically precise and, when probabilities and utilities are known, provides an optimal solution. But as the authors note, it has critical limitations for practical systems:

1. **Requires complete probability information** - often unavailable or expensive to obtain
2. **Requires complete utility information** - difficult to specify precisely for complex objectives
3. **Provides no account of commitment** - implicitly requires re-evaluation at every state change
4. **Offers no vocabulary for reconsideration** - cannot express policies about when to re-deliberate

## The Transformation Algorithm: From Trees to Possible Worlds

Rao and Georgeff present "an algorithm for this transformation" that converts a classical decision tree into an equivalent possible-worlds model. The process begins with a "full decision tree, in which every possible path is represented (including those with zero payoffs)."

**Step 1: Eliminate Chance Nodes**

"We start from the root node and traverse each arc. For each unique state labeled on an arc emanating from a chance node, we create a new decision tree that is identical to the original tree except that (a) the chance node is removed and (b) the arc incident on the chance node is connected to the successor of the chance node."

This is performed recursively: "This process is carried out recursively until there are no chance nodes left."

**Result**: "This yields a set of decision trees, each consisting of only decision nodes and terminal nodes, and each corresponding to a different possible state of the environment."

Crucially: "From a traditional possible-worlds perspective, each of these decision trees represents a different possible world with different probability of occurrence."

**Step 2: Separate Probabilities from Payoffs**

"The resulting possible-worlds model contains two types of information, represented by the probabilities across worlds and the payoffs assigned to paths. We now split these out into two accessibility relations, the probabilities being represented in the belief-accessibility relation and the payoffs in the desire-accessibility relation."

The structure is preserved: "The sets of tree structures defined by these relations are identical, although without loss of generality we could delete from the desire-accessible worlds all paths with zero payoffs."

**Step 3: Apply Deliberation Function to Extract Intentions**

"Given a decision tree and the above transformation, an agent can now make use of the chosen deliberation function to decide the best course(s) of action. We can formally represent these selected path(s) in the decision tree using a third accessibility relation on possible worlds, corresponding to the intentions of the agent."

The construction: "For each desire-accessible world, there exists a corresponding intention-accessible world which contains only the best course(s) of action as determined by the appropriate deliberation function."

## The Resulting Model: Time Trees with Three Accessibility Relations

The transformed model consists of:

**Possible worlds as time trees**: "Our possible-worlds model consists of a set of possible worlds where each possible world is a tree structure."

**Situations within worlds**: "A particular index within a possible world is called a situation."

**Three accessibility relations**: "With each situation we associate a set of belief-accessible worlds, desire-accessible worlds, and intention-accessible worlds; intuitively, those worlds that the agent believes to be possible, desires to bring about, and intends to bring about, respectively."

This model preserves the semantic content of the decision tree while enabling symbolic reasoning. Each accessibility relation captures different information:

- **Belief-accessibility** encodes environmental uncertainty (what was represented by probabilities)
- **Desire-accessibility** encodes motivational priorities (what was represented by payoffs)
- **Intention-accessibility** encodes deliberative commitments (what was computed by the deliberation function)

## The Key Innovation: Dichotomization While Preserving Structure

The authors then make a critical move: "We begin by abstracting the model given above to reduce probabilities and payoffs to dichotomous (0-1) values. That is, we consider propositions to be either believed or not believed, desired or not desired, and intended or not intended, rather than ascribing continuous measures to them."

This abstraction has profound implications:

**Loss**: Fine-grained probability and utility information
**Gain**: Tractable symbolic reasoning about commitment and reconsideration

The justification: "Within such a framework, we first look at the static properties we would want of BDI systems and next their dynamic properties." The dynamic properties—particularly commitment strategies—cannot be expressed in classical decision theory but are essential for resource-bounded agents.

As the authors note: "This transformation provides an alternative basis for cases in which we have insufficient information on probabilities and payoffs and, perhaps more importantly, for handling the dynamic aspects of the problem domain."

## Static Relationships: Constraints Among Accessibility Relations

With three accessibility relations over tree-structured possible worlds, numerous constraints can be imposed. The authors identify "twelve different BDI systems" based on set-theoretic and structural relationships.

**Set-theoretic relationships**: Given two relations, four relationships are possible:
- One is a subset of the other
- The reverse
- Their intersection is empty
- Their intersection is non-empty

**Structural relationships**: As each world is a time tree:
- One could be a sub-tree of another
- The reverse
- Trees could be identical
- Trees could be incomparable

The authors distinguish several philosophically significant combinations:

**Realism** (Cohen and Levesque): "If an agent believes a proposition, it will desire it." This corresponds to desire-accessible worlds being a subset of belief-accessible worlds.

**Strong Realism**: "If an agent desires to achieve a proposition, it will believe the proposition to be an option." Desire-accessible worlds are subtrees of belief-accessible worlds.

**Weak Realism**: "If an agent desires to achieve a proposition, it will not believe the negation of the proposition to be inevitable." The intersection of belief- and desire-accessible worlds is non-empty.

The critical design choice: "The choice of BDI system depends also on which other properties are desired of the agent."

## Essential Properties: Asymmetry and Non-Closure

Two properties emerge as particularly important:

**Asymmetry between beliefs and other attitudes** (Bratman): "Rational agents maintain consistency between their beliefs, desires, and intentions, but not completeness."

This means: An agent should never simultaneously believe both φ and ¬φ (consistency), but need not believe either φ or ¬φ for every proposition (no completeness requirement). However, desires and intentions need not be complete—an agent might desire neither φ nor ¬φ, remaining uncommitted.

**Consequential closure principles** (Cohen and Levesque): "The beliefs, desires, and intentions of an agent must not be closed under the implications of the other attitudes."

This prevents computational explosion: if an agent believes φ and φ implies ψ, the agent need not explicitly believe ψ unless it has specifically considered this inference. Similarly, desiring φ doesn't automatically imply desiring all consequences of φ.

"All the above properties are satisfied by a BDI system in which the pair-wise intersections of the belief-, desire-, and intention-accessible worlds are non-null."

This constraint—that belief, desire, and intention worlds must have non-empty overlaps—ensures:
- Internal consistency (no contradictory commitments)
- Grounding in possibility (can't intend what you believe impossible)
- Non-closure (overlapping but not identical structures allows partial specification)

## From Quantitative to Qualitative: What Is Lost and Gained

**What is lost in dichotomization:**

1. **Precise probability information**: Can only represent believed vs. not-believed, not degrees of belief
2. **Precise utility information**: Can only represent desired vs. not-desired, not preference strengths
3. **Optimal solutions**: Cannot compute expected utility maximization without the underlying numbers

**What is gained:**

1. **Computational tractability**: Symbolic reasoning over tree structures is more efficient than continuous optimization
2. **Expressiveness for commitment**: Can formally represent and reason about when to maintain vs. abandon commitments
3. **Partial specification**: Can specify system behavior without complete probabilistic and utilitarian information
4. **Modularity**: Can reason about beliefs, desires, and intentions independently while maintaining consistency constraints

The key insight: "This provides an alternative basis for cases in which we have insufficient information on probabilities and payoffs and, perhaps more importantly, for handling the dynamic aspects of the problem domain."

## Application to Air Traffic Management: A Concrete Example

The authors illustrate with their OASIS system:

**Belief-accessible worlds**: "For each value of the wind velocity at a particular waypoint we would have a corresponding belief-accessible world." Each world represents a different possible wind field configuration.

**Desire-accessible worlds**: "The paths desired by the aircraft agent are those paths where the calculated ETA of the end node is equal to the desired ETA. The desire-accessible worlds can be obtained from the belief-accessible worlds by pruning those paths that do not satisfy the above condition."

**Intention-accessible worlds**: "The intention-accessible worlds can be obtained from the desire-accessible paths by retaining only those that are the 'best' with respect to fuel consumption, aircraft performance, and so on."

The transformation preserves the decision-theoretic structure while enabling efficient symbolic reasoning about plan execution and reconsideration.

## Implications for Agent System Architecture

This transformation reveals several architectural principles:

**1. Separate representation of uncertainty and motivation**

Don't conflate "what might be true" (beliefs) with "what we want to achieve" (desires). Even if desire-accessible worlds are computed from belief-accessible worlds and objective functions, maintaining the conceptual separation enables clearer reasoning about conflicts and tradeoffs.

**2. Explicit representation of commitments**

Intentions aren't merely cached optimization results—they're first-class entities with their own maintenance logic. The intention-accessibility relation represents "selected courses of action" that persist beyond the conditions that generated them.

**3. Qualitative approximation of quantitative reasoning**

When full probabilistic or utilitarian information is unavailable or too expensive to compute, dichotomous representations (believed/not-believed, desired/not-desired) can still capture essential decision structure.

**4. Structural constraints enforce coherence**

Rather than arbitrary boolean flags, beliefs, desires, and intentions are constrained by accessibility relations over shared tree structures. This ensures they remain grounded in a common model of possible evolution.

## For WinDAGs: Translating Tree Structures to DAG Execution

In a DAG-based orchestration system, the tree structure translates naturally:

**Each possible world is a possible execution trace through the DAG**: Different worlds represent different choices at decision points (which skill to invoke, which branch to take) and different environmental evolutions (skill execution times, result quality, resource availability).

**Belief-accessible worlds**: The set of execution traces consistent with current observations. If Skill A has completed and returned result X, eliminate worlds where Skill A is still running or returned different results.

**Desire-accessible worlds**: Execution traces that satisfy objectives. If the goal is "minimize latency while maintaining quality > 0.8," desire-accessible worlds are those where total execution time is minimized subject to quality constraints.

**Intention-accessible worlds**: The specific execution trace currently committed to. This includes both completed actions (skills already executed) and planned future actions (skills scheduled but not yet invoked).

The accessibility relations evolve:
- New observations constrain belief-accessible worlds
- New objectives or priority changes modify desire-accessible worlds
- Deliberation results update intention-accessible worlds

The question "should we reconsider?" becomes: "do current belief-accessible worlds still overlap with intention-accessible worlds?" If the committed plan is no longer believed possible, reconsideration is necessary.

## The Boundary: When This Transformation Fails

This approach has limits:

**1. When probability information is essential**

If decisions critically depend on fine-grained probability estimates (e.g., betting scenarios, risk-sensitive planning), dichotomization loses too much information.

**2. When deliberation is cheap relative to action**

If computing optimal actions is instantaneous, maintaining separate intention structures adds overhead without benefit.

**3. When the world is fully observable**

If complete world state is known with certainty, belief-accessible worlds collapse to a single world, simplifying the model.

**4. When utility functions are complex**

If payoffs depend on path properties not captured by terminal states (e.g., path length, intermediate states), simple desire-accessibility may be insufficient.

The transformation is most valuable when: (a) complete probabilistic/utilitarian information is unavailable, (b) deliberation is expensive relative to environmental change, and (c) commitment strategies significantly affect performance.