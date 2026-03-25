## BOOK IDENTITY

**Title**: BDI Agents: From Theory to Practice

**Author**: Anand S. Rao and Michael P. Georgeff

**Core Question**: How can we bridge the gap between formal theories of rational agency and practical implementations of intelligent systems that must make resource-bounded decisions in dynamic, uncertain environments?

**Irreplaceable Contribution**: This paper uniquely integrates three traditionally separate domains—formal logic theory, decision theory, and practical system implementation—showing how the philosophical concept of Belief-Desire-Intention (BDI) can be transformed from abstract modal logic into working systems managing real-world complexity. Unlike purely theoretical treatments or purely engineering approaches, it demonstrates the complete pipeline from formal semantics through architectural design to operational air traffic control systems, while honestly addressing the simplifications necessary at each step. The transformation of decision trees into possible-worlds semantics and then into executable architectures provides a blueprint for principled approximation that no other work accomplishes.

## KEY IDEAS

1. **The Necessity of Three Attitudes Under Resource Bounds**: In environments where computation takes comparable time to environmental change (Characteristic 6), rational agents require three distinct representational components. Beliefs capture environmental state (informative component), desires represent objectives with priorities (motivational component), but crucially, intentions capture committed courses of action (deliberative component). Decision theory alone fails because it requires re-computation at every state change—computationally prohibitive. Traditional programs fail because they execute blindly regardless of environmental shifts. Intentions provide the middle path: committed plans that can be reconsidered only when "potentially significant changes" occur, balancing reactivity against deliberation cost.

2. **Transforming Quantitative Models into Symbolic Architectures**: The authors demonstrate a formal transformation from classical decision trees (with probabilities and utilities) into possible-worlds models with accessibility relations. Each chance node becomes a possible world; probabilities become belief-accessibility relations; payoffs become desire-accessibility relations; and chosen paths become intention-accessibility relations. This isn't merely metaphorical—it's a constructive algorithm that preserves decision-theoretic semantics while enabling symbolic reasoning. The breakthrough is showing these aren't competing paradigms but different views of the same computational problem, with the symbolic view enabling reasoning about commitment and reconsideration that decision theory cannot express.

3. **The Commitment Paradox and Its Resolution**: The central tension in bounded rationality: reconsidering decisions at every moment wastes computation on potentially unchanged conclusions, but never reconsidering leads to executing obsolete plans in changed circumstances. The solution requires separating "triggering events" from continuous monitoring—only "potentially significant changes" (determinable instantaneously at the granularity of primitive actions) trigger reconsideration. Different commitment strategies (blind, single-minded, open-minded) represent different termination conditions: what evidence causes plan abandonment. This isn't a heuristic but a formal parameter in the agent architecture, with semantic constraints on accessibility relation evolution.

4. **Practical Rationality Through Expressive Sacrifice**: The abstract interpreter with logically closed belief/desire/intention sets and provability procedures is theoretically sound but computationally intractable. The practical system (PRS/dMARS) makes specific sacrifices: beliefs become ground literals about current state only (no disjunctions, implications, or temporal beliefs); desires become triggering events with priorities rather than full propositional specifications; and intentions become stack-based plan executions rather than complete future path representations. These aren't ad-hoc engineering choices but principled restrictions that preserve the semantic relationships (realism, consistency, commitment) while achieving real-time performance. The key insight: you don't need full logical closure to maintain the critical relationships between attitudes.

5. **Plans as Compiled Beliefs About Means-End Relations**: Plans represent a special form of belief—not about current world state but about "the means of achieving certain future world states and the options available to the agent." Each plan has invocation conditions (triggering events), preconditions (required context), and body (primitive actions or subgoals). This representation achieves modularity: plans can be added incrementally without modifying others because invocation is pattern-directed rather than explicitly called. Plans encode the belief-desire-intention interactions that would be computed at runtime in the abstract interpreter: the precondition checks beliefs, the invocation condition responds to desires (goals), and committing to a plan creates intentions. The plan library is thus a compiled form of practical reasoning knowledge that enables fast option generation—the critical real-time bottleneck.

## REFERENCE DOCUMENTS

### FILE: resource-bounded-rationality-three-attitudes.md

```markdown
# Why Resource-Bounded Rationality Requires Three Mental Attitudes, Not Two

## The Classical Dilemma That Necessitates Intentions

In building intelligent agent systems that must operate in real-time within dynamic environments, we face a fundamental architectural choice that classical decision theory and traditional programming both fail to resolve satisfactorily. This document establishes why systems operating under specific environmental characteristics require three distinct representational components—beliefs, desires, and intentions—rather than the two that might seem sufficient.

## The Environmental Characteristics That Create the Problem

Rao and Georgeff identify six critical characteristics of real-world control domains (illustrated through air traffic management, but applicable to any high-level management and control task in complex dynamic environments):

**Characteristic 1: Environmental Nondeterminism** - "At any instant of time, there are potentially many different ways in which the environment can evolve." The wind field can change unpredictably; operational conditions shift; aircraft enter or leave the airspace.

**Characteristic 2: Action Nondeterminism** - "At any instant of time, there are potentially many different actions or procedures the system can execute." The system can request speed changes, path modifications, holds, altitude adjustments.

**Characteristic 3: Multiple Objectives** - "At any instant of time, there are potentially many different objectives that the system is asked to accomplish"—landing multiple aircraft at specific times while maximizing throughput, objectives that "may be mutually incompatible."

**Characteristic 4: Context-Dependent Actions** - "The actions or procedures that (best) achieve the various objectives are dependent on the state of the environment (context) and are independent of the internal state of the system." What works depends on wind, traffic, weather—not on the computational system's internal state.

**Characteristic 5: Local Sensing** - "The environment can only be sensed locally (i.e., one sensing action is not sufficient for fully determining the state of the entire environment)." You receive spot wind data from some aircraft at some times at some locations, never a complete picture.

**Characteristic 6: Comparable Timescales** - "The rate at which computations and actions can be carried out is within reasonable bounds to the rate at which the environment evolves." This is the killer characteristic. Changes occur during calculation and during execution.

## Why Beliefs Are Necessary: The Informative Component

Given Characteristic 4 (context-dependence) combined with Characteristics 1 and 5 (environmental uncertainty and local sensing), the authors argue that "it is essential that the system have information on the state of the environment." But because this cannot be determined in a single sensing action, "it is necessary that there be some component of the system that can represent this information and is updated appropriately after each sensing action. We call such a component the system's beliefs."

This is uncontroversial. The key insight is distinguishing beliefs from knowledge: "We distinguish beliefs from the notion of knowledge, as defined for example in the literature on distributed computing, as the system beliefs are only required to provide information on the likely state of the environment; e.g., certain assumptions may be implicit in the implementation but sometimes violated in practice, such as assumptions about accuracy of sensors, or rate of change of certain environmental conditions."

For agent systems: The belief component cannot be eliminated because actions are context-dependent and context is partially observable. This applies whether beliefs are implemented as variables, databases, logical expressions, or probabilistic models. The critical property is that beliefs represent the informative component of system state—they capture what the system thinks is true about its environment.

## Why Desires Are Necessary: The Motivational Component

Given Characteristics 3 and 4 (multiple objectives and context-dependence), "it is necessary that the system also have information about the objectives to be accomplished or, more generally, what priorities or payoffs are associated with the various current objectives."

The authors note that "it is possible to think of these objectives, or their priorities, as being generated instantaneously or functionally, and thus not requiring any state representation (unlike the system beliefs, which cannot be represented functionally). We call this component the system's desires, which can be thought of as representing the motivational state of the system."

Critically: "We distinguish desires from goals as they are defined, for example, in the AI literature in that they may be many at any instant of time and may be mutually incompatible." Desires are not constrained to be consistent or achievable—they represent the full set of motivational pressures on the agent.

For agent systems: The desire component represents what the system wants to achieve, potentially including incompatible objectives with different priorities. This could be implemented functionally (computed from current state) or as explicit state, but the distinction from beliefs is essential: beliefs are about what is true, desires are about what would be valuable.

## The Central Dilemma: Why Two Attitudes Are Insufficient

Given beliefs and desires, classical decision theory provides a clear answer: at each decision point, calculate the expected utility of each possible action sequence and choose the best. But Characteristic 6 destroys this solution:

"Given Characteristic (6), neither approach is satisfactory. Re-application of the selection function increases substantially the risk that significant changes will occur during this calculation and also consumes time that may be better spent in action towards achieving the given objectives. On the other hand, execution of any course of action to completion increases the risk that a significant change will occur during this execution, the system thus failing to achieve the intended objective or realizing the expected utility."

This is the commitment paradox: "We seem caught on the horns of a dilemma: reconsidering the choice of action at each step is potentially too expensive and the chosen action possibly invalid, whereas unconditional commitment to the chosen course of action can result in the system failing to achieve its objectives."

Classical decision theory says: recalculate at every state change. Any change to beliefs or desires potentially changes the optimal action sequence. Traditional programs say: execute the chosen procedure to completion. Neither is satisfactory when computation and environmental change occur on comparable timescales.

## The Solution: Intentions as Committed Plans with Conditional Reconsideration

The resolution requires a third component: "For this to work, it is necessary to include a component of system state to represent the currently chosen course of action; that is, the output of the most recent call to the selection function. We call this additional state component the system's intentions. In essence, the intentions of the system capture the deliberative component of the system."

But intentions aren't merely cached decisions. They represent commitments that persist across belief and desire changes: "However, assuming that potentially significant changes can be determined instantaneously, it is possible to limit the frequency of reconsideration and thus achieve an appropriate balance between too much reconsideration and not enough."

The critical innovation is that reconsideration is triggered by events, not performed continuously: only "potentially significant changes" cause plan reconsideration. This assumes these changes "can be determined instantaneously, at the level of granularity defined by the primitive actions and events of the domain."

## Intentions in the Tree Model: A Third Accessibility Relation

Formally, the authors model agent behavior as "a branching tree structure where each branch represents an alternative execution path." Within this model:

- **Choice (decision) nodes** represent "the options available to the system itself"
- **Chance nodes** represent "the uncertainty of the environment"
- **Terminal nodes** are labeled with objectives and payoffs

When transformed to possible-worlds semantics:
- **Belief-accessible worlds** represent different possible environmental states (probabilities across chance nodes)
- **Desire-accessible worlds** represent paths with non-zero payoffs (objectives to achieve)
- **Intention-accessible worlds** represent the selected course(s) of action (output of deliberation function)

"For each desire-accessible world, there exists a corresponding intention-accessible world which contains only the best course(s) of action as determined by the appropriate deliberation function."

## Implementation Implications: The Three Data Structures

In the abstract architecture, these three attitudes manifest as "three dynamic data structures representing the agent's beliefs, desires, and intentions, together with an input queue of events."

The interpreter loop reflects the necessity of all three:

```
options := option-generator(event-queue);  // Uses beliefs + desires
selected-options := deliberate(options);    // Selects among options
update-intentions(selected-options);        // Commits to choices
execute();                                  // Acts on intentions
get-new-external-events();                  // Updates beliefs
drop-successful-attitudes();                // Removes achieved intentions
drop-impossible-attitudes();                // Removes unrealizable intentions
```

The option generator must consult beliefs (to determine applicable actions in current context) and desires (to determine relevant objectives). The deliberator selects among options based on expected utility. But crucially, the result updates intentions, which persist until explicitly dropped or reconsidered.

## The Semantic Difference: Intentions Are Not Merely Strong Desires

A critical distinction: intentions are not simply high-priority desires. They have different semantic properties:

1. **Persistence**: Intentions persist across changes to beliefs and desires (subject to commitment strategy)
2. **Functional role**: Intentions guide means-end reasoning and constrain further deliberation
3. **Temporal structure**: Intentions involve plans—structured sequences of actions—not just goal states
4. **Commitment properties**: Different commitment strategies (blind, single-minded, open-minded) define different reconsideration conditions

As the authors note in describing commitment: "A commitment usually has two parts to it: one is the condition that the agent is committed to maintain, called the commitment condition, and the second is the condition under which the agent gives up the commitment, called the termination condition."

## For Agent System Design: When Three Attitudes Are Required

This analysis establishes when agent architectures require three distinct representational components:

**Require all three when:**
- The environment changes on timescales comparable to deliberation time
- Actions are context-dependent (require beliefs about environment state)
- Multiple possibly-conflicting objectives exist (require desires as motivational state)
- Continuous re-planning is computationally prohibitive
- Complete commitment to initial plans is unsafe given environmental dynamics

**Can simplify when:**
- Deliberation is essentially instantaneous relative to environmental change (use pure decision theory)
- Environmental changes are negligible during execution (use traditional programs)
- Perfect information is available (may not need separate belief representation)
- Only one objective exists at any time (may not need separate desire representation)

## The Boundary Condition: Instantaneous Detection of Significant Change

The entire architecture rests on the assumption that "potentially significant changes can be determined instantaneously." If detecting whether reconsideration is warranted takes significant computation, the architecture breaks down—we've merely pushed the problem into the event detection system.

This is why the authors specify "at the level of granularity defined by the primitive actions and events of the domain." The primitive actions must be chosen such that detecting completion, failure, or invalidation is effectively instantaneous (or at least much faster than deliberation).

For agent orchestration systems: This suggests that skill invocation granularity should be chosen such that determining skill completion/failure is cheap compared to selecting which skill to invoke. If every status check requires expensive reasoning, the architecture's performance advantage disappears.

## Cross-Domain Application to WinDAGs

In a DAG-based orchestration system:

**Beliefs** = Current state of the workflow, intermediate results, resource availability, estimated time-to-completion for active nodes

**Desires** = Multiple potentially-conflicting optimization objectives (minimize latency, minimize cost, maximize quality, meet deadline)

**Intentions** = The specific skills currently executing and their planned continuations (committed execution paths through the DAG)

The critical question: When should the orchestrator reconsider the execution plan? Only when "potentially significant changes" occur:
- A skill fails unexpectedly
- Execution time exceeds threshold (suggesting wrong estimate)
- New high-priority request arrives
- Resource availability changes substantially

Not when: minor fluctuations in execution time, small quality variations within acceptable bounds, cosmetic changes to inputs.

The three-attitude architecture prevents both thrashing (reconsidering after every minor event) and brittleness (never reconsidering even when assumptions are violated).

```

### FILE: decision-trees-to-symbolic-reasoning.md

```markdown
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

```

### FILE: commitment-strategies-and-reconsideration.md

```markdown
# Commitment Strategies: The Dynamic Logic of When to Reconsider Plans

## The Temporal Dimension of Rational Agency

While static constraints on beliefs, desires, and intentions define what combinations of mental attitudes are coherent at a single moment, the dynamic constraints define how these attitudes evolve over time—particularly, when an agent should maintain versus abandon its commitments. Rao and Georgeff's treatment of commitment strategies provides a formal framework for one of the most practically important aspects of resource-bounded rationality: the balance between reactivity and persistence.

## The Commitment Structure: Condition and Termination

The authors define commitment with precision: "A commitment usually has two parts to it: one is the condition that the agent is committed to maintain, called the commitment condition, and the second is the condition under which the agent gives up the commitment, called the termination condition."

This two-part structure immediately reveals why intentions differ from desires:

**Desires** have no inherent persistence—they can appear and disappear freely based on changing circumstances and priorities. There is no cost to abandoning a desire when it becomes unachievable or less important.

**Intentions** embody commitment—they persist even when circumstances change, subject only to their termination condition. The "cost" of abandoning intentions is deliberation time plus the risk of thrashing between plans.

Critically: "As the agent has no direct control over its beliefs and desires, there is no way that it can adopt or effectively realize a commitment strategy over these attitudes. However, an agent can choose what to do with its intentions. Thus, we restrict the commitment condition to intentions."

## Two Dimensions of Commitment: Object and Strength

The commitment condition can be specified along two dimensions:

**What the agent commits to (the object)**: "An agent can commit to an intention based on the object of the intention being fulfilled in one future path or all future paths."

- **Commits to one possible future**: The intention is maintained if there exists at least one future execution path where the intended state is achieved. Even if some futures lead to failure, commitment persists as long as success remains possible.

- **Commits to all possible futures**: The intention is maintained only if all belief-accessible future paths lead to the intended state. If any possible future leads to failure, commitment is abandoned.

The choice between these dramatically affects agent behavior in uncertain environments:

**Example from air traffic control**: An aircraft agent intends to land at a specific time (ETA = 19:00).

*Commitment to one possible future*: As long as there exists some wind field configuration, some trajectory, some sequence of actions that could achieve 19:00 landing, the agent maintains this intention. It continues trying even when success is uncertain.

*Commitment to all possible futures*: Only if the agent believes that all possible wind fields, all possible trajectories lead to 19:00 landing does it maintain this intention. The moment uncertainty about success arises, commitment is dropped.

The first strategy is persistent but risks wasting effort on unachievable intentions. The second is cautious but risks premature abandonment of achievable intentions.

## Three Termination Conditions: Blindness, Single-Mindedness, and Open-Mindedness

The second dimension concerns what changes trigger abandonment:

**Blind Commitment**: "A blindly-committed agent which denies any changes to its beliefs or desires that would conflict with its commitments."

Formally: The agent maintains its intentions regardless of changes to beliefs or desires. Once committed, the agent filters out information that would suggest the plan is failing or that better opportunities exist.

This may seem irrational, but has a critical property: complete stability. The agent never reconsiders, never re-deliberates, expending all computational resources on execution rather than deliberation.

**Single-Minded Commitment**: "A single-minded agent which entertains changes to beliefs and will drop its commitments accordingly."

Formally: The agent maintains intentions as long as they remain consistent with current beliefs. If the agent comes to believe its intended plan is impossible or its intended goal already achieved, it drops the commitment. However, changes to desires alone (e.g., a new goal becoming more important) do not trigger reconsideration.

This embodies: "I will stick with my plan as long as I believe it can still work, but I won't pursue impossible plans or redundant goals."

**Open-Minded Commitment**: "An open-minded agent which allows changes in both its beliefs and desires that will force its commitments to be dropped."

Formally: The agent reconsiders intentions when either beliefs or desires change in relevant ways. Not only "this plan is now impossible" but also "this goal is no longer important" or "a better opportunity has arisen" triggers reconsideration.

This is maximally responsive but also maximally expensive: any significant change to beliefs or desires potentially triggers re-deliberation.

## Formal Axiomatization: Expressing Commitment in Logic

These commitment strategies can be expressed as axioms in the BDI logic. The authors provide modal logic formulations for each:

**For single-minded commitment to one possible future**:

The axiom captures: "If the agent intends φ, then either φ becomes true in the next time step, or the agent believes φ is still possible and continues to intend φ."

This encodes two termination conditions:
1. Success: φ is achieved (the intention is fulfilled)
2. Impossibility: The agent believes φ is no longer achievable

**For open-minded commitment**:

The axiom adds: "...or the agent no longer desires φ."

This adds a third termination condition:
3. Change of motivation: The agent no longer wants to achieve φ (due to changing priorities, new information about consequences, etc.)

The semantic constraints on accessibility relations evolve differently under each strategy:

**Blind commitment**: Intention-accessible worlds never change (except through execution making progress toward goals)

**Single-minded**: Intention-accessible worlds are updated when they no longer intersect with belief-accessible worlds

**Open-minded**: Intention-accessible worlds are updated when they no longer intersect with both belief-accessible and desire-accessible worlds

## The Air Traffic Control Example: Contrasting Behaviors

The authors illustrate with the OASIS sequencer agent:

"The primary objective of the sequencer agent is to land all aircraft safely and in an optimal sequence... On determining a particular schedule, the scheduling agent then single-mindedly commits to the intention; in other words, the scheduling agent will stay committed until (a) it believes that all aircraft have landed in the given sequence; or (b) it does not believe that there is a possibility that the next aircraft will meet its assigned ETA."

Note the crucial observation: "Note that this is not the classical decision-theoretic viewpoint—any change in wind field, for example, should, in that view, cause a recalculation of the entire sequence, even if all aircraft could still meet their assigned ETAs."

The single-minded strategy says: Don't reconsider unless you believe the current plan is failing. A change in wind field that doesn't violate plan feasibility doesn't trigger re-sequencing, even though a different wind field might make a different sequence more optimal.

This trades optimality for stability and computational efficiency. The system computes a good schedule, commits to it, and only reconsiders when commitment becomes untenable.

**Contrast with blind commitment**: A blindly committed sequencer would continue executing its schedule even when aircraft are missing their ETAs, potentially creating safety hazards.

**Contrast with open-minded commitment**: An open-minded sequencer would reconsider whenever wind changes, runway assignments change, new aircraft enter the queue, or optimization criteria shift—potentially spending more time re-scheduling than executing schedules.

**Contrast with classical decision theory**: A classical decision-theoretic agent would recalculate expected utility at every time step, continuously adjusting the schedule to accommodate new information—computationally intractable for real-time control.

## Implementation in the Abstract Interpreter

The abstract interpreter includes specific procedures for commitment maintenance:

```
drop-successful-attitudes();
drop-impossible-attitudes();
```

These implement aspects of the termination condition. But the more subtle aspect appears in:

```
post-intention-status();
```

The authors explain: "The purpose of this procedure is to delay posting events on the event queue regarding any changes to the intention structure until the end of the interpreter loop. By posting appropriate events to the event queue the procedure can determine, among other things, which changes to the intention structure will be noticed by the option generator. In this way, one can model various notions of commitment that result in different behaviours of the agent."

This is subtle but profound: commitment strategy is implemented not by changing the deliberation process itself but by controlling which events trigger option generation. An event indicating "intention φ failed" might be posted immediately (single-minded) or suppressed (blind), or "new desire ψ conflicts with intention φ" might trigger re-deliberation (open-minded) or be ignored (single-minded).

The event queue becomes a filtering mechanism that implements commitment strategy through selective attention.

## The Empirical Question: Which Strategy for Which Domain?

The authors explicitly reject the idea that one commitment strategy is universally correct: "As before, rather than claiming that one particular commitment strategy is the right strategy, we allow the user to tailor them according to the application."

This raises an empirical question: What domain characteristics favor which commitment strategies?

**Blind commitment favors**:
- Environments where deliberation is extremely expensive
- Domains where mid-execution information is unreliable or noisy
- Situations where thrashing between plans is catastrophic
- Cases where plans have strong mutual exclusion (starting a new plan requires undoing significant work from the old plan)

**Single-minded commitment favors**:
- Environments where plan feasibility can change rapidly
- Domains where continuing impossible plans has high cost
- Situations where beliefs about feasibility are reasonably accurate
- Cases where plan abandonment is cheap (little sunk cost)

**Open-minded commitment favors**:
- Environments where opportunities arise unpredictably
- Domains where relative value of objectives changes significantly
- Situations where deliberation is cheap relative to execution
- Cases where better alternatives often appear during execution

The key empirical result cited: "This results in savings in computational effort and hence better overall performance" (Kinny and Georgeff 1991).

Their experiments showed that in dynamic environments, intermediate commitment strategies (particularly single-minded commitment) outperformed both complete rigidity and continuous re-planning.

## Extending Beyond the Three Basic Strategies

While the authors focus on three canonical strategies, the framework admits many variations:

**Conditional commitment**: Different commitment strategies for different types of intentions. High-priority safety-critical intentions might be single-minded while opportunistic optimization intentions are open-minded.

**Probabilistic reconsideration**: Rather than deterministic rules, reconsideration occurs probabilistically based on magnitude of belief/desire changes.

**Resource-indexed commitment**: Commitment strength varies with available deliberation resources. When computation is cheap, be more open-minded; when resources are scarce, be more single-minded.

**Social commitment**: In multi-agent settings, commitments to other agents might have different persistence properties than internal commitments (see their reference to "planned team activity" in Kinny et al. 1994).

## The Meta-Level Architecture: Deliberation About Deliberation

The post-intention-status procedure reveals a meta-level architecture: the agent has first-order intentions (about domain actions) and meta-level control over which intention changes trigger deliberation.

This creates a two-level system:
- **Object level**: Execute current intentions, monitor world state
- **Meta level**: Decide when object-level intentions should be reconsidered

The meta-level implements the commitment strategy. This separation is crucial for efficiency: the object level can execute quickly because it doesn't constantly re-deliberate, while the meta-level can be relatively simple because it only decides yes/no on reconsideration rather than computing new plans.

An important observation: Meta-level reasoning must itself be fast. If deciding "should I reconsider?" takes as long as reconsidering, the architecture provides no advantage. This is why the framework assumes "potentially significant changes can be determined instantaneously."

## For WinDAGs: Designing Reconsideration Policies

In a DAG-based orchestration system, commitment strategies translate to policies about when to recompute execution plans:

**Event-driven reconsideration triggers**:
- **Blind**: Never recompute (execute the initial DAG plan to completion regardless of feedback)
- **Single-minded**: Recompute when current plan becomes infeasible (skill failures, violated preconditions, resource exhaustion)
- **Open-minded**: Recompute when objectives change (new requirements, priority shifts, better alternatives discovered)

**Implementation via event filtering**:
```
if skill_failed(S):
    if commitment_strategy in ["single-minded", "open-minded"]:
        post_event("reconsider_execution_plan")

if new_objective(O):
    if commitment_strategy == "open-minded":
        post_event("reconsider_execution_plan")

if skill_completed(S):
    if all_objectives_satisfied():
        post_event("reconsider_execution_plan")  # Success termination
```

**Practical considerations**:

1. **Granularity of reconsideration**: Reconsider the entire DAG execution or just the remaining portion? Fine-grained reconsideration is more adaptive but more expensive.

2. **Sunk cost handling**: When reconsidering, should already-completed work constrain new plans (avoid redundant computation) or be ignored (seek true optimum)?

3. **Partial execution consistency**: If reconsidering mid-execution, ensure new plan is consistent with already-executed actions (can't undo completed skills).

4. **Multi-objective tradeoffs**: Different objectives might favor different commitment strategies. Latency-critical objectives favor single-minded (don't waste time re-planning), quality-critical objectives favor open-minded (reconsider when better approaches discovered).

## The Boundary Condition: When Commitment Strategy Doesn't Matter

Commitment strategy becomes irrelevant in limiting cases:

**1. Instantaneous deliberation**: If planning time approaches zero, always reconsider (pure decision-theoretic agent)

**2. Static environments**: If nothing changes during execution, commitment strategy is moot (initial plan remains optimal)

**3. No better alternatives**: If there's only one feasible plan, reconsideration never yields different results

**4. Perfect prediction**: If beliefs are always correct, plans never become infeasible unexpectedly

Real domains rarely satisfy these conditions, which is why commitment strategy matters empirically.

```

### FILE: plans-as-knowledge-compilation.md

```markdown
# Plans as Compiled Practical Reasoning: From Logic to Libraries

## The Computational Complexity Problem for Real-Time Agents

The BDI logic presented by Rao and Georgeff provides a formal specification of rational agency, but it has a critical flaw for practical implementation: "The architecture is based on a (logically) closed set of beliefs, desires, and intentions and the provability procedures required are not computable. Moreover, we have given no indication of how the option generator and deliberation procedures can be made sufficiently fast to satisfy the real-time demands placed upon the system."

This is not a minor technical issue but a fundamental obstacle. If an agent must reason from first principles at every decision point—constructing plans by theorem proving, verifying preconditions by logical inference, checking consistency of intentions—it will be far too slow for real-time control. The environment will change during deliberation, invalidating the assumptions on which the agent is reasoning.

The solution the authors propose is profound: represent the structure of practical reasoning not as axioms to be reasoned over but as compiled knowledge in the form of plans. Plans are not ad-hoc data structures but "a special form of beliefs" about means-end relationships, pre-compiled for efficient execution.

## Plans as Representing Beliefs About Means-End Relations

The key insight: "We represent the information about the means of achieving certain future world states and the options available to the agent as plans, which can be viewed as a special form of beliefs."

This needs unpacking. In the full BDI logic, an agent would reason:

1. I believe the world is in state S
2. I desire to achieve state G
3. I believe that action sequence [a₁, a₂, ..., aₙ] achieves G when executed in state S
4. Therefore, I should intend [a₁, a₂, ..., aₙ]

Steps 3-4 require search through a vast space of possible action sequences, checking preconditions and effects for each. This is the classical planning problem, computationally expensive even for small domains.

The plan library approach compiles step 3 in advance: "Intuitively, plans are abstract specifications of both the means for achieving certain desires and the options available to the agent."

Rather than deriving at runtime that "action sequence [a₁, a₂, ..., aₙ] achieves G in context S," the agent has pre-encoded this knowledge as a plan:

```
Plan: AchieveG
Invocation condition: desire(G)
Precondition: state_matches(S)
Body: [a₁, a₂, ..., aₙ]
```

The belief "this action sequence achieves this goal in this context" is compiled into the plan structure itself. At runtime, the agent need only pattern-match current desires and beliefs against plan invocation conditions and preconditions, vastly faster than first-principles planning.

## The Three-Part Structure of Plans

Plans in PRS/dMARS have three components:

**1. Invocation Condition**: "The conditions under which a plan can be chosen as an option are specified by an invocation condition... the invocation condition specifies the 'triggering' event that is necessary for invocation of the plan."

This determines when the plan is relevant. Invocation conditions respond to events:
- New goals adopted (e.g., achieve(land(QF001, 19:00)))
- Environmental changes (e.g., wind_change(sector_3, 45_knots))
- Plan failures (e.g., plan_failed(land_normal))

The invocation condition makes the plan library reactive: plans activate in response to situations rather than being explicitly called.

**2. Precondition**: "The precondition specifies the situation that must hold for the plan to be executable."

This determines when the plan is applicable. While the invocation condition checks "is this plan relevant to current events?", the precondition checks "is this plan feasible in the current state?"

For example:
- Invocation: achieve(land(Aircraft, ETA))
- Precondition: aircraft_altitude(Aircraft, Alt), Alt > 5000, runway_clear()

The plan is invoked by the landing goal but only applicable when the aircraft is above 5000 feet and the runway is clear.

**3. Body**: "Each plan has a body describing the primitive actions or subgoals that have to be achieved for plan execution to be successful."

The body specifies what to do. It can contain:
- Primitive actions (directly executable operations like speed_change(Aircraft, 250))
- Subgoals (objectives to be achieved by invoking other plans like achieve(intercept(waypoint_3)))
- Conditionals (branching based on beliefs)
- Loops (iteration until conditions are met)

The body represents the compiled knowledge about how to achieve the invocation condition given the precondition.

## How Plans Encode Beliefs, Desires, and Intentions

Plans aren't merely convenient data structures—they encode the relationships among beliefs, desires, and intentions:

**Plans encode beliefs about means**: The body of a plan represents the agent's belief that "this action sequence is a means to achieve this goal in this context." The precondition represents beliefs about when this means is feasible.

**Plans respond to desires**: The invocation condition often triggers on goal adoption. When a desire becomes active (the agent adopts a goal), plans that achieve that goal become candidate options.

**Plans generate intentions**: When a plan is selected and executed, its body becomes the current intention—the committed action sequence the agent is pursuing.

As the authors note: "The intention that the system forms by adopting certain plans of action is represented implicitly using a conventional run-time stack of hierarchically related plans (similar to how a Prolog interpreter handles clauses)."

This is computationally elegant: intentions don't need explicit representation as logical formulas. The call stack IS the intention structure—it implicitly represents the commitment to completing the current plan and its parent plans.

## Multiple Plans Per Goal: Pre-Compiled Deliberation

A critical feature: multiple plans can have the same invocation condition. When a goal is adopted, all plans that achieve that goal become options.

For example, for the goal achieve(land(Aircraft, ETA)), there might be multiple plans:
- land_fast: High speed, steep descent (saves time, wastes fuel)
- land_efficient: Optimal speed, gradual descent (saves fuel, takes time)
- land_emergency: Maximum speed, immediate descent (emergency situations)

Each has different preconditions (land_emergency requires emergency_declared), different bodies (different action sequences), and different characteristics (speed vs. fuel efficiency).

The deliberation function selects among these options based on current priorities and constraints: "The deliberator selects a subset of options to be adopted and adds these to the intention structure."

Crucially, this deliberation is not reasoning from first principles. The plans encode pre-compiled strategies. The deliberator merely chooses among them based on current utility function or heuristics. This is far cheaper than generating plans from scratch.

## The Option Generator: Fast Pattern Matching

The option-generation phase of the interpreter:

```
options := option-generator(event-queue);
```

This consults the event queue and returns plans whose invocation conditions match current events. The implementation is essentially pattern matching: match event patterns against plan invocation conditions.

For efficiency, plans can be indexed by their invocation conditions, making lookup fast. When event wind_change(sector_3, 45_knots) occurs, only plans with invocation conditions mentioning wind changes in sector 3 need to be considered.

The precondition check then filters: of the plans whose invocation conditions matched, which have preconditions satisfied by current beliefs?

This two-stage process (invocation matching, precondition filtering) quickly reduces the space of potential plans to a small set of applicable options, without expensive search or logical inference.

## The Hierarchical Intention Structure: Plans Call Plans

Plans can contain subgoals that invoke other plans: "The body describing the primitive actions or subgoals that have to be achieved for plan execution to be successful."

This creates a hierarchical intention structure. Consider a high-level plan:

```
Plan: SequenceAircraft
Invocation: achieve(optimal_sequence(Aircraft_List))
Body:
  achieve(calculate_arrival_times(Aircraft_List))
  achieve(optimize_sequence(ETAs))
  for each Aircraft in Sequence:
    achieve(assign_ETA(Aircraft, ETA))
```

Each achieve() in the body triggers option generation for a new subgoal, potentially invoking further plans. The runtime stack captures this hierarchy:

```
[SequenceAircraft
  [CalculateArrivalTimes
    [EstimateWindField
      [RequestWindData(QF001)]  <- Currently executing
    ]
  ]
]
```

The stack represents nested intentions: to sequence aircraft, I intend to calculate arrival times, which requires estimating wind field, which requires requesting wind data. When RequestWindData completes, execution pops back to EstimateWindField, then to CalculateArrivalTimes, etc.

This implicit representation of intentions through stack structure is vastly more efficient than explicitly maintaining logical formulas describing all current commitments.

## Modularity and Incremental Development

A key practical benefit highlighted by the authors: "The ability to construct plans that can react to specific situations, can be invoked based on their purpose, and are sensitive to the context of their invocation facilitates modular and incremental development."

Because plans are invoked by pattern matching on events and goals rather than explicit calls, they are loosely coupled:

**Adding a new plan doesn't require modifying existing plans**: If you add a new plan for achieve(land(Aircraft, ETA)) with better fuel efficiency, existing plans that post this as a subgoal automatically have the new option available. You don't need to find and modify every place that might want to land an aircraft.

**Plans can be made increasingly specific**: "It allows users to concentrate on writing plans for a subset of essential situations and construct plans for more specific situations as they debug the system."

You might start with a general landing plan:
```
Plan: LandGeneric
Invocation: achieve(land(Aircraft, ETA))
Precondition: aircraft_operational(Aircraft)
Body: [descend, approach, touchdown]
```

Then add more specific plans as edge cases are discovered:
```
Plan: LandEmergency
Invocation: achieve(land(Aircraft, ETA))
Precondition: emergency_declared(Aircraft)
Body: [alert_ground, clear_runway, fast_descend, emergency_approach, touchdown]
```

The more specific plan (with more restrictive preconditions) will be preferred when applicable, while the general plan handles normal cases. This enables graceful refinement of behavior without wholesale system rewrites.

## Plans vs. First-Principles Planning: The Tradeoff

The plan library approach trades generality for speed:

**What is lost:**
- **Optimality**: Pre-compiled plans may not be optimal for the current situation. A planner reasoning from first principles could potentially find better solutions.
- **Novel situations**: If a situation arises that doesn't match any plan's preconditions, the system is stuck. A first-principles planner could synthesize a novel solution.
- **Correctness guarantees**: Plans are hand-crafted and may contain bugs. An automated planner with verified semantics would have stronger correctness properties.

**What is gained:**
- **Speed**: Pattern matching and plan execution are orders of magnitude faster than search and inference.
- **Predictability**: Execution time is bounded by plan structure rather than search space size.
- **Human understandability**: Plans are written in a language domain experts can understand and debug.
- **Graceful degradation**: If deliberation time is limited, the system can still act using whatever plans match, rather than failing to find any solution.

The key insight: "When FORTRAN rules that modelled pilot reasoning were replaced with plans, the turnaround time for changes to tactics in an air-combat simulation system improved from two months to less than a day."

Plans operate at the right level of abstraction for domain experts to encode their knowledge directly, without requiring expertise in automated planning or logical reasoning systems.

## The Representational Choice: Ground Literals Only

The practical BDI system makes a critical representational restriction: "We explicitly represent only beliefs about the current state of the world and consider only ground sets of literals with no disjunctions or implications. Intuitively, these represent beliefs that are currently held, but which can be expected to change over time."

This means:
- Beliefs are facts: aircraft_altitude(QF001, 8000), runway_clear(runway_3)
- NOT logical formulas: ∀x. aircraft(x) ⇒ has_altitude(x)
- NOT disjunctions: runway_clear(runway_2) ∨ runway_clear(runway_3)
- NOT implications: if wind_speed > 40 then use_long_runway

This restriction has profound implications:

**Belief update becomes simple**: New sensor data adds or removes ground literals. No need for truth maintenance or non-monotonic reasoning.

**Precondition checking becomes simple**: Check if required literals are present in the belief set. No need for theorem proving.

**Consistency checking becomes simple**: Check for contradictory literals. No need to detect logical inconsistencies in complex formulas.

The cost: Cannot represent disjunctive or uncertain beliefs ("either runway 2 or runway 3 is clear but I don't know which"). Cannot represent conditional knowledge ("if wind from north, use runway 36"). These must be encoded procedurally in plan bodies rather than declaratively in beliefs.

## Plans as Compiled Conditional Knowledge

The restriction to ground literal beliefs pushes conditional knowledge into plans. Instead of:

```
Belief: if wind_direction == north then optimal_runway == runway_36
```

This becomes:

```
Plan: SelectRunway
Invocation: achieve(optimal_runway(R))
Body:
  wind_direction(Dir)
  if Dir == north:
    R := runway_36
  else if Dir == south:
    R := runway_18
  else:
    ...
```

The conditional knowledge about wind direction and runway selection is compiled into the plan's body rather than represented declaratively. This makes it executable but not inspectable or reasoned about.

This is a conscious tradeoff: executability over reflectivity. The system can execute conditional reasoning quickly but cannot explain or reason about its conditional knowledge as a first-class object.

## For WinDAGs: Skills as Compiled Plans

In a DAG-based orchestration system, skills map directly to the plan concept:

**Skill definition = Plan structure**:
- **Invocation condition**: What triggers this skill (which node in DAG, what event)
- **Precondition**: When this skill is applicable (input requirements, resource availability)
- **Body**: What this skill does (the actual computation)

**Skill library = Plan library**: The set of available skills is the compiled knowledge about how to achieve various objectives. When the orchestrator reaches a node requiring capability C, it pattern-matches against skills that provide C.

**Multiple skills per capability = Multiple plans per goal**: Different skills might provide the same capability with different tradeoffs:
- debug_fast: Quick surface-level check (fast, shallow)
- debug_deep: Comprehensive analysis (slow, thorough)
- debug_ai: Use LLM to generate hypotheses (resource-intensive, creative)

The orchestrator's deliberation selects among applicable skills based on current constraints and priorities.

**Skill composition = Hierarchical plans**: Complex skills can invoke other skills as subskills, creating a hierarchy identical to the plan/subgoal hierarchy. The execution stack represents nested skill invocations.

**Key advantage**: Like the BDI plan approach, skill libraries enable domain experts to encode strategies without reasoning expertise. A debugging expert can write skills encoding their debugging strategies without understanding formal planning or logical inference.

## The Meta-Knowledge Problem: Plans Don't Explain Themselves

A limitation: Plans encode knowledge but don't make it inspectable. If a plan fails, the system knows "this approach didn't work" but not WHY this approach was chosen or WHAT assumptions it relied on.

For example, if land_efficient fails, we know:
- This particular landing plan failed
- We should try a different plan or reconsider the landing goal

But we don't automatically know:
- Why we thought land_efficient would work (what beliefs justified this choice)
- What assumption was violated (which precondition check was inaccurate)
- How to prevent this failure in future (what general lesson to learn)

This knowledge is implicit in the plan structure but not explicitly represented. Adding meta-level annotations (rationale, assumptions, failure explanations) could address this, at the cost of additional complexity.

For debugging agent systems, this suggests: plan/skill libraries should include not just code but documentation of assumptions, expected contexts, and failure modes. The practical advantage of plans (human-understandable strategies) should extend to human-understandable failure analysis.

## When Plan Libraries Break Down

The plan library approach has limits:

**1. Truly novel situations**: If the environment presents a situation no plan anticipated, the system is stuck. First-principles reasoning would be needed to synthesize a new plan.

**2. Plan library explosion**: If the domain has enormous variation, the plan library becomes unwieldy. Every significant situation variation needs its own plan variant.

**3. Plan maintenance**: As the environment evolves, plans become obsolete. Keeping the library updated requires ongoing human effort.

**4. Conflicting abstractions**: Different plans may make incompatible assumptions about how the world works, leading to subtle interactions when plans call each other.

The framework works best when:
- The domain is well-understood and situations are anticipated
- Variation is manageable (not combinatorially explosive)
- The environment evolves slowly relative to development cycles
- Plans operate at similar levels of abstraction

These conditions often hold for operational systems (air traffic control, telecommunications management) but less so for open-ended domains (general household robotics, open-world game AI).

```

### FILE: theory-practice-gap-practical-approximation.md

```markdown
# Bridging Theory and Practice: The Art of Principled Approximation

## The Gap Between Ideal Rationality and Implementable Systems

One of the most significant contributions of Rao and Georgeff's work is its explicit treatment of the gap between theoretically ideal agent architectures and practically implementable systems. Rather than viewing this as a failure of theory or a compromise of practice, they present it as a design space to be navigated with clear understanding of what is sacrificed and what is gained at each step.

The abstract interpreter they describe is described honestly: "This abstract architecture is an idealization that faithfully captures the theory, including the various components of practical reasoning... However, it is not a practical system for rational reasoning."

## Three Levels of Abstraction: Decision Theory, Logic, Implementation

The paper presents agent architecture at three levels, each a principled approximation of the previous:

**Level 1: Decision-Theoretic Model**
- Beliefs as probability distributions over possible worlds
- Desires as utility functions over outcomes  
- Intentions as selected action sequences maximizing expected utility
- Reconsideration at every state change

**Level 2: Symbolic Logic Model**
- Beliefs as accessibility relations over possible worlds (dichotomized probabilities)
- Desires as accessibility relations over goal states (dichotomized utilities)
- Intentions as accessibility relations over committed paths
- Reconsideration governed by commitment strategies

**Level 3: Implemented System (PRS/dMARS)**
- Beliefs as ground literals about current state
- Desires as events triggering plan selection
- Intentions as runtime stack of active plans
- Reconsideration via event filtering

Each level simplifies the previous while attempting to preserve essential properties. Understanding what is preserved and what is lost at each transition is crucial for building effective systems.

## From Continuous to Dichotomous: What Survives Abstraction?

The transition from Level 1 to Level 2 involves "abstracting the model given above to reduce probabilities and payoffs to dichotomous (0-1) values." This seems like a massive loss of information: belief degrees become binary, preference strengths disappear.

Yet the authors argue this abstraction preserves the critical structure: "This transformation provides an alternative basis for cases in which we have insufficient information on probabilities and payoffs and, perhaps more importantly, for handling the dynamic aspects of the problem domain."

What is preserved:

**1. Possibility spaces**: The set of possible futures remains represented, even without probabilities. Belief-accessible worlds capture which futures are considered possible, even if we can't quantify their likelihoods.

**2. Preference orderings**: The set of desired outcomes remains represented, even without numerical utilities. Desire-accessible worlds capture which outcomes are considered valuable, even if we can't quantify degrees of desirability.

**3. Commitment structure**: The distinction between contemplated options and committed plans remains clear. Intention-accessible worlds represent not just "what might be good" but "what I'm committed to doing."

**4. Relationships between attitudes**: The constraints relating beliefs, desires, and intentions (realism, consistency, etc.) are preserved as relationships between accessibility relations.

What is lost:

**1. Optimal decision-making**: Without precise probabilities and utilities, we can't compute expected utility or guarantee optimal choices.

**2. Fine-grained tradeoffs**: Can't distinguish "slightly preferred" from "strongly preferred" or "somewhat likely" from "very likely."

**3. Probabilistic reasoning**: Can't compute conditional probabilities, update beliefs via Bayes' rule, or reason about likelihood of outcomes.

**4. Quantitative guarantees**: Can't make statements like "this plan succeeds with 95% probability" or "this outcome has utility at least 0.8."

The key insight: "This provides an alternative basis for cases in which we have insufficient information on probabilities and payoffs." When you don't have the numbers for expected utility calculation, symbolic BDI logic provides a framework for structured decision-making that preserves qualitative relationships.

## From Modal Logic to Ground Literals: The Second Approximation

The transition from Level 2 to Level 3 involves even more dramatic simplifications:

**Belief representation**: From modal logic formulas expressing beliefs about possible worlds to simple ground literals about current state. "We explicitly represent only beliefs about the current state of the world and consider only ground sets of literals with no disjunctions or implications."

This eliminates:
- Temporal beliefs (what was true, what will be true)
- Conditional beliefs (if A then B)
- Disjunctive beliefs (either A or B)
- Quantified beliefs (all aircraft, some runways)
- Higher-order beliefs (beliefs about beliefs)

**Desire representation**: From modal formulas about desired future states to event patterns triggering plan selection. Desires become implicit in plan invocation conditions rather than explicit propositions.

**Intention representation**: From modal formulas about committed future paths to runtime stack of executing plans. Intentions become implicit in execution state rather than explicit propositions.

The justification: "We therefore make a number of important choices of representation which, while constraining expressive power, provide a more practical system for rational reasoning."

## What Remains Tractable at Level 3?

Despite these restrictions, the implemented system preserves key capabilities:

**1. Reactive response to environment**: Plans can be invoked by environmental events, enabling fast reactive behavior without complex inference.

**2. Goal-directed behavior**: Plans are organized around achieving goals (plan invocation conditions), maintaining purposeful action.

**3. Context-sensitive action selection**: Plan preconditions ensure actions are only taken when appropriate, using current belief state.

**4. Hierarchical task decomposition**: Plans can invoke subgoals, maintaining structured problem-solving without explicit hierarchical planning.

**5. Commitment with reconsideration**: The execution stack provides persistence (commitment to current plan) while event filtering enables reconsideration when appropriate.

**6. Multiple simultaneous objectives**: Multiple intention stacks can coexist, allowing concurrent pursuit of different goals.

The authors emphasize: "The system presented is a simplified version of the Procedural Reasoning System (PRS), one of the first implemented agent-oriented systems based on the BDI architecture."

Crucially: "This experience leads us to the firm conviction that the agent-oriented approach is particularly useful for building complex distributed systems involving resource-bounded decision-making."

## The Essential Characteristics That Survived Approximation

Looking across all three levels, certain architectural principles persist:

**Separation of information, motivation, and deliberation**: Even in the implemented system, beliefs (current state literals), desires (goal events), and intentions (executing plans) remain distinct components with different update dynamics.

**Bounded deliberation**: At all levels, the architecture limits deliberation time. Level 1 via computation constraints, Level 2 via commitment strategies, Level 3 via plan library precompilation.

**Event-driven control**: All levels respond to events triggering reconsideration. Level 1's "significant changes," Level 2's commitment termination conditions, Level 3's event queue filtering.

**Hierarchical structure**: All levels support abstraction hierarchies. Level 1's action trees, Level 2's temporal structure, Level 3's plan/subgoal hierarchy.

As the authors note: "The primary purpose of this paper is to provide a unifying framework for a particular type of agent, BDI agent, by bringing together various elements of our previous work in theory, systems, and applications."

## The Verification Challenge: Testing Approximations

A critical question: How do we know the implemented system (Level 3) actually exhibits the behaviors specified at Level 2 or optimizes the objectives defined at Level 1?

The authors address this: "Elsewhere we have described how to verify certain behaviours of agents based on their static constraints and their commitment strategies using a model-checking approach."

The verification strategy:
1. Specify desired behavior in Level 2 logic (modal formulas expressing commitment strategies, goal achievement properties, etc.)
2. Model Level 3 implementation as a transition system (states, actions, events)
3. Use model checking to verify that the transition system satisfies the logical specifications

This provides formal connection between levels: an implemented system can be proven to exhibit the properties specified by the logic, even though the implementation doesn't directly execute the logic.

However, the authors acknowledge limits: "The purpose of the above formalization is to build formally verifiable and practical systems. If for a given application domain, we know how the environment changes and the behaviours expected of the system, we can use such a formalization to specify, design, and verify agents that, when placed in such an environment, will exhibit all and only the desired behaviours."

The qualification "if we know how the environment changes" is crucial. Formal verification requires a model of the environment. For truly open-ended domains, complete environmental models are unavailable, limiting the applicability of formal verification.

## Empirical Validation: The OASIS Example

The paper grounds the architecture in a real application: "An air-traffic management system, OASIS... currently being tested at Sydney airport."

This provides empirical evidence that the approximations work in practice: "The system is currently undergoing parallel evaluation trials at Sydney airport, receiving live data from the radar."

Key practical results:

**Scale**: "At any particular time, the system will comprise up to seventy or eighty agents running concurrently, sequencing and giving control directives to flow controllers on a real-time basis."

**Real-time performance**: The system operates on live radar data, meeting the timing requirements for actual air traffic control. This demonstrates that the Level 3 approximations are sufficiently efficient.

**Domain expert acceptance**: The description emphasizes end-user involvement: "The high-level representational and programming language has meant that end-users can encode their knowledge directly in terms of basic mental attitudes without needing to master the programming constructs of a low-level language."

This suggests the abstractions are not only computationally tractable but also intellectually tractable for domain experts who aren't AI specialists.

**Development efficiency**: Comparing to previous systems: "When FORTRAN rules that modelled pilot reasoning were replaced with plans, the turnaround time for changes to tactics in an air-combat simulation system improved from two months to less than a day."

This dramatic improvement suggests the right level of abstraction was found: high enough for human comprehension and rapid modification, low enough for efficient execution.

## The Design Pattern: Principled Approximation

Extracting a general methodology from Rao and Georgeff's approach:

**Step 1: Start with ideal formalization**
Define the problem at the highest level of abstraction that captures its essential structure. For rational agency, this is decision theory with full probabilistic beliefs and utilities.

**Step 2: Identify computational bottlenecks**
Determine which aspects of the ideal formalization are computationally intractable. For decision theory: computing expected utility at every state, maintaining full probability distributions.

**Step 3: Introduce principled approximations**
Replace intractable components with tractable alternatives that preserve essential structure. For BDI: dichotomize probabilities/utilities while preserving possibility spaces and preference orderings.

**Step 4: Formalize the approximation**
Don't just make ad-hoc simplifications—formalize the simplified model and characterize what properties are preserved. For BDI: modal logic axiomatization expressing relationships among belief/desire/intention.

**Step 5: Implement with further approximations**
Translate the formalized approximation into executable code, making additional simplifications necessary for efficiency. For PRS: ground literals, plan libraries, stack-based intentions.

**Step 6: Verify preservation of properties**
Use formal methods (model checking) or empirical validation (real applications) to confirm that the implementation exhibits the behaviors specified by the formalization.

## For WinDAGs: Applying Principled Approximation

A DAG-based orchestration system faces similar tradeoffs:

**Ideal**: Optimal scheduling considering all possible execution paths, skill failure probabilities, resource allocation, objective priorities, etc. Recompute optimal schedule at every state change.

**First approximation**: Model as BDI agent where:
- Beliefs = Current execution state, resource availability, estimated skill performance
- Desires = Multiple optimization objectives (latency, cost, quality)
- Intentions = Committed execution plan (selected path through DAG)
- Commitment strategy determines when to recompute

**Implementation approximation**:
- Beliefs = Simple state variables (which skills completed, current resource levels)
- Desires = Priority-weighted objective function
- Intentions = Scheduled skill invocations
- Reconsideration triggers = Skill failures, resource exhaustion, deadline pressure

**What to preserve across approximations**:
- Separation of "what is true" (system state), "what we want" (objectives), "what we're doing" (active skills)
- Event-driven reconsideration (not continuous rescheduling)
- Hierarchical structure (skills invoking subskills)
- Modularity (adding skills doesn't require modifying others)

**What can be simplified**:
- Fine-grained probability models → binary feasibility checks
- Complex utility functions → weighted objectives
- Full lookahead planning → greedy + reconsideration
- Logical inference → pattern matching

## The Boundary: When Approximation Breaks Down

The authors are clear that their approach has limits. The methodology works when:

**1. Domain structure is capturable**: "If for a given application domain, we know how the environment changes and the behaviours expected of the system..."

If the domain is too chaotic or novel for human experts to encode strategies, plan libraries won't capture it.

**2. Reconsideration is detectable**: "Assuming that potentially significant changes can be determined instantaneously..."

If detecting whether to reconsider is as hard as reconsidering, the architecture provides no advantage.

**3. Hierarchical decomposition exists**: The plan/subgoal structure assumes tasks decompose hierarchically. For highly interdependent tasks, this structure may not exist.

**4. Real-time requirements are feasible**: The system must be fast enough for real-time response. For extremely time-critical domains (microsecond decisions), even plan library lookup might be too slow.

When these conditions don't hold, different approaches may be needed: machine learning for unstructured domains, reactive systems for ultra-fast response, monolithic optimization for highly coupled problems.

## The Meta-Lesson: Theory and Practice Must Co-Evolve

Perhaps the deepest lesson is methodological: "The primary aim of this paper is to integrate (a) the theoretical foundations of BDI agents from both a quantitative decision-theoretic perspective and a symbolic reasoning perspective; (b) the implementations of BDI agents from an ideal theoretical perspective and a more practical perspective; and (c) the building of large-scale applications based on BDI agents."

Theory without implementation remains speculation about what might work. Implementation without theory becomes ad-hoc engineering that can't be understood, verified, or generalized. Applications without both theory and systematic implementation become one-off successes that can't be replicated.

The paper's contribution is showing how all three co-evolve:
- Theory identifies essential structure and properties
- Implementation discovers tractable approximations
- Applications validate that approximations preserve essential properties
- Experience with applications suggests refinements to theory

This iterative cycle—formalize, implement, apply, refine—is the methodology that bridges theory and practice.

```

### FILE: failure-modes-complex-agent-systems.md

```markdown
# Failure Modes in Complex Agent Systems: What Can Go Wrong with BDI Architectures

## The Dangers of Incomplete Specification

While Rao and Georgeff present the BDI architecture as a solution to building practical intelligent systems, careful reading reveals implicit warnings about failure modes—ways these systems can go wrong even when formally well-specified. Understanding these failure modes is crucial for building robust agent systems.

## Failure Mode 1: Commitment Without Reconsideration (The Blind Agent Problem)

The authors describe blind commitment: "A blindly-committed agent which denies any changes to its beliefs or desires that would conflict with its commitments."

While presented as one option in a design space, the dangers are clear. A blindly committed air traffic agent would continue executing a landing sequence even as wind conditions make it impossible, aircraft fall behind schedule, and collisions become likely. The agent literally cannot see evidence that its plan is failing because it filters such evidence to maintain commitment.

This manifests in agent systems as:

**Stuck execution**: The agent continues executing a plan long after it has become impossible or counterproductive, because no reconsideration mechanism exists to recognize failure.

**Information filtering**: The agent's commitment strategy prevents it from processing information that would reveal plan inadequacy. The event queue or belief update mechanism filters out contradictory evidence.

**Cascading failures**: When one agent is blindly committed and other agents depend on it, failures propagate. The dependent agents make decisions assuming the committed agent's plan will succeed, multiplying the impact when it inevitably fails.

The boundary condition: Blind commitment is appropriate only when (a) the environment is highly stable, (b) deliberation is extraordinarily expensive, and (c) plan execution is much faster than environmental change. Violating these conditions invites catastrophe.

**For WinDAGs**: A DAG orchestrator that never reconsiders its execution plan—regardless of skill failures, resource exhaustion, or deadline pressure—will complete obsolete computations while ignoring the need to adapt. The result: wasted resources on irrelevant work while actual objectives go unmet.

## Failure Mode 2: Continuous Reconsideration (The Hamlet Agent Problem)

The opposite failure: open-minded commitment without sufficient persistence. The agent reconsiders every time beliefs or desires change, even minutely.

The authors warn of this implicitly: "Re-application of the selection function increases substantially the risk that significant changes will occur during this calculation and also consumes time that may be better spent in action towards achieving the given objectives."

An air traffic agent that reconsiders its landing sequence after every minor wind fluctuation spends all its time re-planning and never executing. The environment continues changing during each reconsideration, leading to perpetual deliberation without action.

This manifests as:

**Thrashing**: The agent oscillates between plans, never completing any because it continuously finds "better" alternatives during execution.

**Computational exhaustion**: All resources are consumed by deliberation, leaving none for execution. The agent becomes purely contemplative, never acting.

**Missed deadlines**: By the time the agent finishes reconsidering, the opportunity for action has passed. The optimal plan for time T is computed at time T+Δ, when it's no longer relevant.

**Plan fragmentation**: Partial execution of Plan A, then switching to Plan B, then Plan C, never completing any. Resources are wasted on setup/teardown costs of abandoned plans.

The authors' solution—commitment strategies that reconsider only on "potentially significant changes"—is designed precisely to avoid this failure mode. But determining what qualifies as "significant" is non-trivial and domain-dependent.

**For WinDAGs**: An orchestrator that recomputes the execution plan after every minor event (skill completes slightly faster than expected, resource utilization ticks up 1%) will spend more time rescheduling than executing. The overhead of plan recomputation becomes the bottleneck.

## Failure Mode 3: Mismatched Abstraction Levels (The Granularity Problem)

The authors assume: "Assuming that potentially significant changes can be determined instantaneously, at the level of granularity defined by the primitive actions and events of the domain."

This assumption can be violated in two ways:

**Primitive actions too coarse**: If primitive actions take significant time during which the environment changes substantially, the agent cannot react fast enough. Example: if "land aircraft" is a primitive action taking 5 minutes, and critical wind changes occur during those 5 minutes, the agent cannot adapt mid-action.

**Primitive actions too fine**: If primitive actions are tiny steps (e.g., "adjust throttle 1%"), the agent drowns in detail. Detecting "significant changes" at this granularity becomes expensive, violating the "determined instantaneously" assumption.

This manifests as:

**Temporal misalignment**: The agent's decision cycle doesn't match the environment's change rate. Either the agent acts too slowly (making decisions obsolete) or too quickly (wasting effort on insignificant changes).

**Abstraction leaks**: Higher-level plans make assumptions about lower-level behavior that don't hold in practice. A plan assumes "land aircraft" is atomic, but it's actually decomposed into steps that can fail independently.

**State explosion**: If primitives are too fine-grained, the state space becomes enormous. Belief representation, plan preconditions, and option generation become intractable.

The authors' hierarchical plan structure (plans invoking subgoals) is designed to manage this: different levels of the hierarchy operate at different granularities. But choosing these levels correctly is critical.

**For WinDAGs**: Skills must be granular enough for meaningful feedback (detecting completion/failure) but coarse enough for efficient scheduling. A skill that takes milliseconds is too fine (scheduling overhead dominates). A skill that takes hours is too coarse (can't react to problems mid-execution).

## Failure Mode 4: Plan Library Incompleteness (The Brittleness Problem)

The transition from theorem proving to plan library trades generality for speed: "Plans are abstract specifications of both the means for achieving certain desires and the options available to the agent."

The critical assumption: the plan library contains plans adequate for all situations that will arise. When this fails:

**Novel situations**: An environmental configuration arises that no plan anticipated. The agent has goals but no means to achieve them. Option generation returns empty set, deliberation has nothing to select among. The agent is stuck.

**Missing specializations**: General plans exist but specific variants needed for current conditions don't. Example: plans for landing in normal conditions but not for landing with engine failure. The agent applies the wrong plan, leading to failure.

**Obsolete plans**: The environment has evolved (runway layout changed, new regulations) but the plan library hasn't been updated. Plans have preconditions or effects that no longer match reality.

This manifests as:

**Execution failures**: Plans chosen by deliberation fail during execution because their preconditions were wrong or their effects don't occur as expected.

**Suboptimal behavior**: Plans that worked in the old environment are retained even when better strategies now exist, because nobody has encoded the better strategies in the library.

**Maintenance burden**: As the environment evolves, the plan library requires continuous updates. Without systematic maintenance, the system degrades over time.

The authors acknowledge this limitation implicitly by restricting their claims: "If for a given application domain, we know how the environment changes and the behaviours expected of the system, we can use such a formalization to specify, design, and verify agents..."

The qualifier "if we know" is crucial. For truly open-ended domains, we don't know all possible situations, and plan libraries become inadequate.

**For WinDAGs**: The skill library must cover all capabilities needed for likely problems. Missing skills create "capability gaps"—situations where the system has objectives but no means to achieve them. Unlike a general planner that might synthesize novel solutions, a skill-library-based system simply fails.

## Failure Mode 5: Inconsistent Beliefs (The Synchronization Problem)

The authors specify belief consistency: beliefs must be closed under implication and consistent (no belief in both φ and ¬φ). But in a distributed system with multiple agents:

**Distributed beliefs**: Different agents have different, possibly conflicting beliefs about shared environment. Aircraft Agent A believes runway 3 is clear; Ground Agent B believes runway 3 is occupied. Both agents' individual beliefs are consistent, but the system's collective beliefs are not.

**Belief update delays**: Agent updates beliefs based on sensor data, but propagation to other agents takes time. During this lag, agents operate on stale information.

**Contradictory sensors**: Multiple sensors provide conflicting information. Which to believe? The agent's belief update mechanism must resolve conflicts, but the authors' simple ground literal representation doesn't provide a natural way to represent uncertainty or conflict.

This manifests as:

**Coordination failures**: Agents make conflicting commitments based on inconsistent beliefs. Two aircraft agents both intend to land on the same runway at the same time because they have inconsistent beliefs about runway assignment.

**Race conditions**: Agent A observes event E and updates beliefs at time T. Agent B observes E and updates beliefs at time T+Δ. During the interval [T, T+Δ], agents have inconsistent beliefs, potentially making incompatible decisions.

**Sensor fusion problems**: How to integrate information from multiple sources with varying reliability? The ground literal representation doesn't naturally express "sensor A says X, sensor B says ¬X, A is usually reliable."

The authors note that beliefs are distinguished from knowledge: "We distinguish beliefs from the notion of knowledge... as the system beliefs are only required to provide information on the likely state of the environment."

But "likely" presupposes some representation of uncertainty, which ground literals don't provide. In practice, implementations must handle belief conflicts through precedence rules, confidence values, or source tracking—extensions beyond the base formalism.

**For WinDAGs**: Multiple agents (or multiple components of a distributed orchestrator) may have inconsistent views of system state: which skills have completed, which resources are available, which objectives remain. Without explicit synchronization, these inconsistencies cause coordination failures.

## Failure Mode 6: Desire Conflicts (The Inconsistent Objectives Problem)

The authors explicitly allow inconsistent desires: "We distinguish desires from goals... in that they may be many at any instant of time and may be mutually incompatible."

This is realistic—agents often face conflicting objectives—but creates a challenge: how to deliberate when desires conflict?

**Unresolvable tradeoffs**: Desire A (minimize latency) conflicts with Desire B (minimize cost). No plan satisfies both. How does deliberation select among options when all violate some desires?

**Priority shifts**: Desire priorities change over time. A plan was selected to optimize for Desire A (then high priority), but mid-execution Desire B becomes more important. The executing plan is now pursuing the wrong objective.

**Hidden conflicts**: Desires appear independent but have subtle interactions. Achieving Desire A makes Desire B harder to achieve, but this isn't apparent until late in execution.

This manifests as:

**Deliberation paralysis**: The deliberation function cannot determine which option is "best" because different options satisfy different incompatible desires. Without a clear priority ordering or utility function, selection becomes arbitrary.

**Intention instability**: If desire priorities shift frequently, an open-minded agent will continuously abandon plans to pursue newly-prioritized desires, leading to thrashing (Failure Mode 2).

**Implicit prioritization**: The system resolves conflicts through arbitrary mechanisms (first-come-first-served, alphabetical order, implementation artifacts), leading to unexpected behaviors that don't reflect intended priorities.

The authors' framework allows for priorities on desires (from the decision-theoretic roots with utility functions), but the practical implementation "reduces probabilities and payoffs to dichotomous (0-1) values." This eliminates fine-grained preference representation, pushing conflict resolution into the deliberation function implementation.

**For WinDAGs**: Optimization objectives often conflict (minimize latency vs. cost vs. resource usage). The orchestrator must have clear policies for resolving tradeoffs. Without explicit priority weighting or utility functions, the system's behavior under conflict becomes unpredictable.

## Failure Mode 7: Plan Interaction (The Unanticipated Side Effects Problem)

Plans are developed independently for different goals, but when executing concurrently or sequentially, they can interact in problematic ways:

**Resource contention**: Plan A assumes exclusive access to resource R. Plan B also uses R. When both execute concurrently, they interfere, causing both to fail.

**Destructive interaction**: Plan A achieves goal G1 by establishing precondition P. Plan B achieves goal G2 by negating P. When A and B execute concurrently, they undo each other's progress.

**Assumption violation**: Plan A assumes property X holds throughout execution. Plan B, executing concurrently, invalidates X. Plan A fails because its assumptions were violated by another plan.

The authors' hierarchical intention structure (execution stack) handles sequential plan interaction: when Plan A invokes subgoal G, Plan B (achieving G) executes in the context of A, and A resumes when B completes. But concurrent intentions (multiple stacks) can still interact problematically.

This manifests as:

**Deadlock**: Plan A holds resource R1, waiting for R2. Plan B holds R2, waiting for R1. Neither can proceed.

**Livelock**: Plans continuously undo each other's progress. A establishes condition C, B negates C, A re-establishes C, etc., making no net progress.

**Performance degradation**: Plans compete for resources, causing mutual slowdown even if not total deadlock.

The plan library approach doesn't naturally express constraints like "plans A and B must not execute concurrently" or "plan A requires plan B's effects to persist." Such coordination requires additional mechanisms: explicit locks, plan synchronization primitives, or higher-level coordination agents.

**For WinDAGs**: Skills executing concurrently may conflict: both writing to the same output, both consuming limited resources, one invalidating assumptions made by another. The DAG structure captures some dependencies (sequential edges), but concurrent branches can still have hidden interactions.

## Failure Mode 8: Incomplete State Representation (The Hidden State Problem)

The restriction to "ground sets of literals with no disjunctions or implications" representing "only beliefs about the current state of the world" is computationally attractive but semantically limiting:

**What cannot be represented:**
- Uncertain beliefs: "probably X, possibly Y"
- Historical beliefs: "X was true at T-1"
- Conditional beliefs: "if event E occurs, X will be true"
- Quantified beliefs: "all aircraft in sector 3"

**Consequences:**

**Missing context**: Plans make decisions based solely on current ground literals, without access to history or trends. Cannot recognize "this is the third time Plan A failed" or "wind is consistently increasing."

**Lost information**: Sensors provide richer information than boolean ground literals capture. Wind sensor reports 45.3 knots ± 2.1 knots, but belief system stores only wind_speed_high(sector_3). The precision and uncertainty are lost.

**Implicit assumptions**: Facts that plans assume but don't explicitly check become hidden dependencies. A landing plan implicitly assumes runway surface is dry, but if this isn't represented as a belief literal, no precondition check verifies it.

This manifests as:

**Brittle plans**: Plans work in the common case but fail in edge cases because relevant state isn't represented. The failure mode isn't detected because the precondition checks don't test the implicit assumption.

**Information loss**: Richer environmental data is coarsened to boolean literals, losing nuance that might matter for decision-making.

**Inability to reason temporally**: Cannot express "if X remains true for Δ time, then do Y" because historical information isn't retained.

The authors justify this restriction as practical: "This simplifying assumptions and sacrificing some of the expressive power of the theoretical framework" enable real-time performance. But the cost is reduced robustness.

**For WinDAGs**: Execution state represented only as "skill S completed/failed, output O available" loses potentially valuable information: how long S took, what quality O achieved, what intermediate states occurred. This limits adaptability—the system can't learn from execution patterns or detect degrading performance trends.

## System-Level Insight: Failures Emerge from Approximations

A pattern emerges: many failure modes arise precisely at the boundaries where practical approximations are made:

- Commitment strategies (approximating continuous re-optimization) create blindness or thrashing
- Plan libraries (approximating first-principles planning) create brittleness
- Ground literals (approximating full belief representation) lose context
- Dichotomous attitudes (approximating probabilistic beliefs/utilities) lose nuance

These aren't bugs—they're fundamental tradeoffs. The approximations are necessary for tractability, but each approximation point is a potential failure mode.

The design challenge: make approximations that preserve robustness for the expected operating conditions while degrading gracefully when those conditions are violated.

## For Agent System Design: Defensive Architecture

Drawing on these failure modes, robust agent systems should:

**1. Make commitment strategies explicit and tunable**: Not hardcoded blind/single-minded/open-minded, but parameterizable with clear triggering conditions that can be monitored and adjusted.

**2. Provide plan library completeness metrics**: Track coverage—which situations have plans, which don't. Monitor plan failure rates to detect obsolescence or inadequacy.

**3. Represent uncertainty and confidence**: Even if computation uses binary decisions, maintain metadata about confidence, source reliability, uncertainty bounds for debugging and adaptation.

**4. Explicit plan interaction constraints**: If plans can conflict, make constraints explicit (mutexes, happens-before, resource bounds) rather than discovering conflicts at runtime.

**5. Hierarchical monitoring**: Different granularities of monitoring for different purposes. Fine-grained for debugging, coarse-grained for reconsideration decisions.

**6. Graceful degradation**: When approximations break (novel situation, plan library gap, belief inconsistency), fail safely rather than catastrophically. Have fallback behaviors.

**7. Observability**: Instrument the system to reveal internal state—current beliefs, active intentions, recent deliberation decisions—for human oversight and debugging.

The BDI architecture is sound, but deployment requires careful attention to these failure modes and how they manifest in specific domains.

```

### FILE: option-generation-problem-filtering.md

```markdown
# The Option Generation Problem: From Search to Pattern Matching

## The Bottleneck in Practical Reasoning

One of the most computationally critical components in the BDI architecture is option generation: determining which actions are applicable and relevant in the current situation. The authors identify this as the primary bottleneck for real-time performance:

"We have given no indication of how the option generator and deliberation procedures can be made sufficiently fast to satisfy the real-time demands placed upon the system."

The challenge: In any reasonably complex domain, there are combinatorially many possible action sequences. The classical planning approach—search through this space to find sequences achieving desired goals—is computationally prohibitive when "the rate at which computations and actions can be carried out is within reasonable bounds to the rate at which the environment evolves."

The option generator must answer: "Given current beliefs and desires, which plans are relevant and applicable?" This must be fast enough that the answer remains valid—the environment hasn't changed significantly during the computation itself.

## Two-Stage Filtering: Invocation and Preconditions

The solution presented is a two-stage filtering process:

**Stage 1: Invocation Condition Matching**
"The conditions under which a plan can be chosen as an option are specified by an invocation condition... the invocation condition specifies the 'triggering' event that is necessary for invocation of the plan."

This narrows the search space dramatically. Rather than considering all plans in the library, only plans whose invocation conditions match current events are considered.

Example: Event queue contains:
```
[wind_change(sector_3, 45_knots),
 achieve(land(QF001, 19:00)),
 aircraft_entered(QF123, sector_7)]
```

Invocation condition matching returns only plans invoked by these specific events:
- Plans invoked by wind_change events
- Plans invoked by landing goals
- Plans invoked by aircraft entry events

All other plans (hundreds or thousands) are ignored. This is pattern matching, not search—computationally efficient.

**Stage 2: Precondition Checking**
"The precondition specifies the situation that must hold for the plan to be executable."

Of the plans whose invocation conditions matched, check which have preconditions satisfied by current beliefs. Example:

Plan: Land_High_Wind
- Invocation: achieve(land(Aircraft, ETA))
- Precondition: wind_speed(Aircraft_Sector, Speed), Speed > 40
- Body: [extend_approach, reduce_speed, land]

Plan: Land_Normal
- Invocation: achieve(land(Aircraft, ETA))
- Precondition: wind_speed(Aircraft_Sector, Speed), Speed ≤ 40
- Body: [standard_approach, maintain_speed, land]

Both plans are invoked by the landing goal, but only one has preconditions satisfied. Precondition checking eliminates inapplicable options.

## Why This Is Fast: The Indexing Structure

The two-stage process works efficiently because:

**1. Event-based indexing**: Plans can be indexed by their invocation condition patterns. When event E occurs, lookup plans[E] returns all relevant plans directly. No iteration through the entire plan library.

**2. Precondition simplicity**: Preconditions are simple conjunctions of ground literals. Checking if current beliefs satisfy a precondition is pattern matching against the belief database, not theorem proving.

**3. Small working set**: At any moment, only a small subset of plans have invocation conditions matching current events. Of these, only a subset have preconditions satisfied. The deliberation function chooses among perhaps 2-5 options, not thousands.

Compare to classical planning:
- **Classical**: Search space is all possible action sequences. Branching factor = number of applicable actions at each step. Search depth = plan horizon. Total states = branching_factor^depth.
- **Plan library**: Match events to plans. Filter by preconditions. Select among options. Complexity = O(plans_matching_event) << O(branching_factor^depth).

The authors note: "This and a wide class of other real-time application domains exhibit a number of important characteristics," specifically that "the rate at which computations and actions can be carried out is within reasonable bounds to the rate at which the environment evolves."

Fast option generation is what makes this possible. If option generation took minutes, the environment would change during the computation, invalidating the generated options.

## The Role of Events: Controlling Attention

The event queue is central to efficient option generation: "Three dynamic data structures representing the agent's beliefs, desires, and intentions, together with an input queue of events."

Events control the agent's attention:

**External events**: Environmental changes detected by sensors (wind_change, aircraft_entered, runway_closed)

**Internal events**: Goal adoption and plan status changes (achieve(G), plan_succeeded(P), plan_failed(P))

The event queue determines which plans are considered: only those whose invocation conditions match queued events. This implements a form of focus of attention—the agent doesn't reconsider everything at every moment, only things relevant to current events.

The authors emphasize: "By posting appropriate events to the event queue the procedure can determine, among other things, which changes to the intention structure will be noticed by the option generator."

This is a control mechanism: post-intention-status can choose which changes trigger option generation. If intention stack completes successfully, post event plan_succeeded(P). If an intention becomes impossible, post event plan_failed(P). These events trigger option generation for response plans (e.g., plans invoked by plan failures to handle errors).

Critically, not all changes trigger events. A minor update to beliefs might not post any event, so option generation isn't invoked. This prevents the continuous reconsideration problem (Failure Mode 2).

## Deliberation After Option Generation: The Selection Function

Once option generation has filtered to a small set of applicable plans, deliberation selects among them:

```
options := option-generator(event-queue);
selected-options := deliberate(options);
update-intentions(selected-options);
```

The deliberate function is the agent's decision-making. The authors don't specify its implementation, noting only: "An agent can now make use of the chosen deliberation function to decide the best course(s) of action."

Possible deliberation strategies:

**1. Priority-based**: Each plan has a priority. Select highest priority applicable plan. Simple and fast, but requires careful priority assignment.

**2. Utility-based**: Each plan (or plan+context) has an expected utility. Select plan with highest expected utility. More flexible but requires utility estimation.

**3. Heuristic-based**: Use domain-specific heuristics to rank options. "Prefer fuel-efficient landing unless time-critical, then prefer fast landing."

**4. Meta-level reasoning**: Estimate value of deliberation itself. If expected benefit of further deliberation < cost of delay, act on current best option.

Crucially, deliberation operates on a small pre-filtered set. Even if deliberation is expensive (e.g., Monte Carlo simulation to estimate utilities), it's tractable because option generation reduced the space to 2-5 options, not thousands.

## The Meta-Level Architecture: When to Generate Options

The abstract interpreter shows option generation occurring once per cycle:

```
repeat
  options := option-generator(event-queue);
  selected-options := deliberate(options);
  update-intentions(selected-options);
  execute();
  get-new-external-events();
  drop-successful-attitudes();
  drop-impossible-attitudes();
end repeat
```

But when should this cycle run? If too frequent, the system wastes time on unnecessary option generation. If too infrequent, the system is unresponsive to environmental changes.

The event queue provides the answer: the cycle runs when events occur. If event queue is empty (nothing has changed since last cycle), the agent continues executing current intentions without generating new options. This is the commitment aspect—the agent doesn't reconsider unless something significant happens.

The post-intention-status procedure controls what counts as "something significant":

```
post-intention-status()
  //