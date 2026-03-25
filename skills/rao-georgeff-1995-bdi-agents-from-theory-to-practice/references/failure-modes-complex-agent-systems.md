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