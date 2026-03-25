# Schedules as Behavior Envelopes: Temporal Flexibility as a First-Class Asset

## The Classical Assumption and Its Cost

In classical scheduling and planning, the output of the system is a *nominal behavior*: a specific, fully determined sequence of actions with exact start times, end times, and resource assignments. Every degree of freedom has been resolved. During execution, "a nominal behavior is interpreted as an ideal trajectory to be followed as closely as possible."

This sounds rigorous. In practice it is brittle. Because the schedule does not explicitly represent feasible alternatives, "it is difficult to have a clear picture of the impact of the unavoidable deviations from the desired course of action." Any deviation — a task that runs slightly long, a resource that becomes temporarily unavailable, an observation window that shifts — requires either ignoring the problem (hoping the deviation is small enough to absorb) or replanning from scratch (expensive and possibly infeasible in real time).

The HSTS approach advocates a fundamentally different contract: "HSTS advocates schedules as envelopes of behavior within which the executor is free to react to unexpected events and still maintain acceptable system performance."

This is not a minor reframing. It changes the entire computational strategy.

## What a Behavior Envelope Is

Instead of assigning exact times to every activity, HSTS represents schedules as **networks of temporal constraints**. Each token (unit of scheduled activity) has a start time and end time, but these are **time points** — nodes in a constraint graph — not fixed values. The arcs between time points carry interval distance constraints: "the end of token A must precede the start of token B by between 5 and 20 time units." The entire schedule is the constraint network; any complete assignment of times that satisfies all constraints is a valid execution.

The set of valid executions is the **behavior envelope** — the region of execution space that the schedule authorizes. Within this envelope, an executor has genuine freedom. It can choose to start an observation earlier or later within its window, can adapt to a slightly longer reconfiguration without violating anything, and can route around minor anomalies without requiring a call back to the planner.

The constraint network thus serves two roles simultaneously:
1. **At construction time**: A flexible structure that allows the scheduler to explore more of the solution space before committing.
2. **At execution time**: An authorization structure that tells the executor what freedoms it has, without specifying every decision.

## The Computational Argument for Flexibility

The argument for flexibility is not just operational — it is *mathematical*. Consider two activities that both require a single-capacity resource, each with duration 1 time unit, and each able to start at any of `n` possible times.

Without considering resource capacity, there are `n²` possible start time combinations.

In the **value commitment approach**: Fix one activity to a specific start time. There are now `n - 1` remaining valid start times for the other. The scheduler has collapsed the space from `n²` to `n - 1`.

In the **constraint posting approach**: Add a precedence constraint between the two activities (one must finish before the other starts). The total number of valid time pairs is now `n(n-1)/2` — order `n²` in magnitude, not `n`. The constraint eliminates the same resource conflict, but *preserves dimensionality*.

"Every time the value of a problem variable is fixed the search space loses one dimension. Alternatively, posting a constraint only restricts the range of the problem variables without necessarily decreasing dimensionality. This has the potential of leaving a greater number of variable assignment possibilities, and suggests a lower risk of the scheduler 'getting lost' in blind alleys."

This matters enormously in combinatorial search. When you commit prematurely to specific times, you lose the ability to recognize later that those specific times were incompatible with constraints you hadn't yet encountered. When you post constraints instead, you preserve the ability to find any consistent assignment within the remaining feasible space.

## The Time Point Network

Temporal flexibility in HSTS is maintained through the **time point network**: a graph where each node is a token start or end time, and each arc carries a metric interval distance constraint. The network supports two essential operations:

**Single-source propagation**: Given a specific time point, what is the range of feasible values for every other time point reachable from it? This answers: "If this activity starts now, what are the feasible windows for everything else?"

**All-pairs propagation**: What is the range of feasible temporal *distances* between every pair of time points? This answers: "How much temporal slack is available in the network as a whole? Are there implicit constraints that make the network already infeasible?"

Both procedures are **incremental** — new constraints are integrated without full recomputation. This is essential for real-time use: every time the scheduler makes a new commitment, propagation updates the feasibility picture efficiently rather than starting over.

Critically, HSTS allows the planner/scheduler to operate on *inconsistent* networks: "A planner/scheduler implemented in HSTS can operate on inconsistent token networks, adding and retracting tokens and constraints with no need to insure consistency at each intermediate step. Planning/scheduling algorithms can reach a final consistent plan/schedule with trajectories that lay partially or entirely in the space of inconsistent database instantiations."

This is a crucial design choice. Many constraint systems require the solver to maintain consistency at every step, which forces premature backtracking. HSTS instead treats inconsistency as diagnostic information — the propagation engine detects and localizes it, and the *problem solver* decides how to respond, because "different responses might be needed in different situations." If a state variable is over-subscribed, the solver might delete uninserted goal tokens (goal rejection), cancel previously inserted tokens (resource deallocation), or seek additional capacity elsewhere.

## Type Flexibility: The Parallel Dimension

Temporal flexibility has a parallel in **type flexibility**. Each token in the HSTS temporal database carries a `type` — not a specific ground predicate, but a *set* of possible values. A token might represent "a slewing operation to target 3C267 from some unspecified source target" — the source is not yet determined, and the type carries all possible sources.

As constraints accumulate, type propagation narrows the set of possible values for each token. If two overlapping sequence tokens each restrict a state variable to a subset of values, the intersection of those subsets is the effective type for the overlap region. If the intersection is empty, the network is type-inconsistent — a different kind of infeasibility that the propagation engine can detect and localize.

Both temporal and type propagation work together to maintain an accurate picture of remaining flexibility without forcing premature commitment on either dimension.

## Exploiting Flexibility During Construction: Statistical Estimation

The real payoff of maintaining temporal flexibility appears when the scheduler needs to make decisions about where conflicts are likely to arise. Because the schedule is a constraint network rather than a set of fixed assignments, the scheduler can **sample** valid completions of the network and use the sample statistics to characterize the remaining search space.

The Conflict Partition Scheduling (CPS) algorithm (described in detail in a separate document) does exactly this: it generates `N` random complete time assignments that satisfy the existing temporal constraints, observes which resources are conflicted in each sample, and uses these statistics to identify the *probability* that a given resource at a given time will experience a conflict. This is **token demand** and **resource contention** — statistical measures that guide bottleneck detection.

This statistical guidance is only possible because the network retains flexibility. If every variable were committed to a specific value, there would be nothing to sample — only one possible completion. Flexibility is what makes the sample space meaningful.

## Behavior Envelopes During Execution

The execution-time implications are equally important. A flexible schedule tells the executor: "These precedence constraints must be respected. These temporal bounds must be satisfied. Within those bounds, you have freedom."

This is qualitatively different from a fixed schedule during disrupted execution. When an activity takes slightly longer than expected:
- **Fixed schedule**: Every subsequent activity is now late. The executor must either violate the schedule or rush.
- **Behavior envelope**: The executor checks whether the extended duration is still within the token's temporal bounds and whether the precedence constraints to subsequent activities are still satisfiable. If yes, it simply proceeds. The envelope absorbed the disruption.

This is why HSTS's approach is particularly valuable for space mission scheduling: "the Earth periodically occludes virtually any target and communication satellite" — the system operates in a world of continuous small disruptions, and an executor that can self-adapt within a pre-computed envelope is far more robust than one that requires a call to a replanner for every deviation.

## Implications for Agent System Design

**For orchestration**: An agent orchestrator should distinguish between *commitments* (constraints that are genuinely necessary — deadlines, precedences between dependent tasks) and *assignments* (specific values that are one valid choice among many). Over-committing to specific assignments early is the primary cause of unnecessary replanning when execution deviates from expectation.

**For task decomposition**: When decomposing a complex goal into subtasks, the decomposition should preserve temporal flexibility by expressing inter-subtask constraints as intervals, not fixed delays. "Subtask B must start between 5 and 20 minutes after subtask A completes" is strictly more valuable than "Subtask B must start at t+10."

**For execution monitoring**: An executor agent should evaluate deviations against the *constraint envelope*, not against the nominal plan. If a subtask completes 2 minutes late but the downstream subtask had 10 minutes of slack, there is no scheduling problem. Systems that alarm on any deviation from the nominal plan waste recovery resources on non-problems.

**For multi-agent coordination**: When multiple agents share resources, the coordination protocol should post mutual precedence constraints (which agent proceeds first for a given resource access) rather than assigning specific time slots. This preserves flexibility for both agents and reduces the need for renegotiation when one agent's timeline shifts.

**For failure recovery**: When a subtask fails, the recovery planner needs to know which other subtasks were temporally dependent on it. The time point network (or its equivalent) provides this map directly — the failed token's time points are connected to downstream tokens by constraint arcs that now need to be re-evaluated. Without such a network, the recovery planner must reason from scratch about dependencies.

## Boundary Conditions

Behavior envelopes require that the feasible execution region be *convex* in a useful sense — that the temporal constraint network has a meaningful interior. When constraints are so tight that the feasible region is effectively a point (or empty), flexibility provides no benefit and the system reduces to classical scheduling.

Additionally, the executor that operates within the envelope must be capable of making local decisions — choosing specific times within the allowed windows without consulting the planner. This requires that the executor has access to the constraint network and can evaluate consistency of proposed time assignments. A pure action-executor with no constraint-awareness cannot exploit behavior envelopes.

Finally, building good behavior envelopes requires knowing the structure of the temporal constraints in advance. Highly dynamic domains where constraints appear unpredictably during execution may not support meaningful pre-computed envelopes.