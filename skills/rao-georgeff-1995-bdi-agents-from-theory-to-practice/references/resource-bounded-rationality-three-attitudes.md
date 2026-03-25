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