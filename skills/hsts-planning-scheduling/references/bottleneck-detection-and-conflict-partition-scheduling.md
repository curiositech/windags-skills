# Bottleneck Detection and Conflict Partition Scheduling: Statistical Guidance for Constrained Search

## The Fundamental Search Problem

Scheduling hard constraint problems involves a fundamental dilemma: you must make decisions — constraining which activities precede others on shared resources — but every decision you make restricts the future, and premature or misguided decisions can create contradictions that require expensive backtracking. The space of possible orderings grows exponentially with the number of activities and resources.

Two classical approaches to this problem have well-known failure modes:

**Value commitment approaches** (including micro-opportunistic search and most classical schedulers): Assign specific start times or ordering decisions one at a time, using heuristics to choose. When a contradiction arises, backtrack and try another assignment. These methods work well when heuristics are reliable, but suffer when early decisions have non-local consequences — when a "reasonable" early assignment creates a contradiction that only becomes visible many steps later.

**Repair approaches** (min-conflict iterative repair): Start with a complete assignment of times, identify conflicts, and locally repair them by changing the assignment of conflicting activities. These methods avoid the need for backtracking but are sensitive to initialization quality and can cycle in problems with multiple interacting bottlenecks.

Both approaches share a limitation: they reason about *specific assignments* rather than about the *structure of the remaining search space*. They cannot easily answer the question: "Where in this problem are the real conflicts most likely to arise?"

## The CPS Insight: Statistical Search Space Analysis

Conflict Partition Scheduling (CPS) is based on a different premise. Instead of committing to specific time assignments and then resolving conflicts, it *analyzes the probability distribution of conflicts* over the remaining flexible schedule, and uses that analysis to make targeted decisions that reduce the highest-probability conflicts.

The key observation is this: while it is computationally hard to determine whether a partially-specified constraint network has a consistent completion, it is *easy* to generate specific complete time assignments that satisfy the existing temporal constraints. You can do this by forward dispatching — picking start times for each activity in order, choosing a time within the current feasible window according to some rule. Each such sample is a point in the solution space (though it may violate capacity constraints).

If you generate `N` such samples, you can compute:

**Token demand** `Δ(τ, t_i)`: For token τ and time t_i, what fraction of samples have τ's execution interval overlapping t_i? This measures how concentrated the activity is around a particular time — high demand means the activity tends to cluster at that time across the distribution of possible schedules.

**Resource contention** `χ(ρ, t_i)`: For resource ρ and time t_i, what fraction of samples have more than one token requiring ρ at t_i? This measures the probability of a conflict — not whether there *is* a conflict in any particular schedule, but how likely one is across the distribution of schedulable completions.

These statistics characterize the remaining search space *without committing to any particular completion*. They are possible only because the schedule is represented as a flexible constraint network rather than a set of fixed assignments.

## The CPS Algorithm

The algorithm proceeds in cycles:

**1. Capacity Analysis**: Generate N random complete time assignments from the current constraint network. Compute token demand and resource contention statistics. (N=20 was used in the experiments — a surprisingly small sample that still yields useful guidance.)

**2. Termination Test**: If resource contention is zero everywhere, the constraint network already guarantees no conflicts. Every consistent time assignment is a valid schedule. Exit.

**3. Bottleneck Detection**: Identify the resource-time pair `(ρ_b, t_b)` with maximum contention. This is the place in the schedule where conflicts are most likely.

**4. Conflict Identification**: Find all tokens that request resource ρ_b and whose time bounds overlap t_b, and that are not already forced into a sequential order by existing constraints. This is the *conflict set* — the tokens that are competing for the bottleneck resource.

**5. Conflict Partition**: Sort the conflict set by clustering token demand profiles. Tokens whose demand is concentrated earlier get placed in the "before" subset; tokens concentrated later get placed in the "after" subset. Post precedence constraints: every token in "before" must complete before every token in "after" begins.

**6. Constraint Propagation**: Propagate the new constraints through the time point network, updating feasible time windows for all affected tokens.

**7. Consistency Test**: If propagation reveals an inconsistency (some token's window is now empty), signal failure. In the basic CPS implementation, the network is reset and a new random run begins. CPS allows up to 10 such restarts.

**8. Repeat from 1**.

## Why Partitioning Rather Than Ordering

The choice to *partition* the conflict set into two groups — rather than imposing a complete ordering — is deliberate and important.

A complete ordering of all tokens in the conflict set would resolve all potential conflicts at that resource in one step. But it would also introduce a large number of constraints simultaneously, many of which may be unnecessary or even harmful. Unnecessary constraints reduce flexibility for the rest of the schedule; harmful constraints might force other resources into conflict.

A single pairwise constraint (the micro-opportunistic extreme) is conservative but requires many cycles to resolve a serious bottleneck, and each cycle is expensive (running N stochastic simulations).

The partition approach is a middle path: it resolves the bottleneck substantially (typically reducing contention from maximum to two peaks, as shown in the figures) while imposing only the necessary ordering relationships. The figures in the paper illustrate this vividly: after a single CPS cycle on a 10-job, 5-resource problem, the bottleneck resource's contention profile drops from a single maximum spike to two smaller peaks, and the time bounds of the tokens visibly separate into two clusters.

## The Role of Stochastic Sampling

The stochastic nature of the simulation is both a feature and a safeguard. Different runs of the simulation with the same constraint network will produce different samples (because value selection is randomized), which means different runs will yield different statistical pictures of the search space. When CPS fails and restarts, it is not simply repeating the same failed computation — it is exploring a different region of the sample space, which may yield a different and successful ordering.

This is the CPS equivalent of random restarts in SAT solving: randomization allows the algorithm to escape from locally misleading regions of the search space.

The value selection rule matters significantly. In the experiments, the ASAP (earliest-first) rule outperformed the uniform rule: "(20, ASAP) and MICRO OPP INTEL BKTRK are the only two techniques that consistently solved all of the problems." The explanation is that the ASAP rule produces a richer sample base — it samples more of the temporal variation possible in the remaining space — while the uniform rule produces a narrower, more clustered sample. This suggests that the quality of the statistical analysis depends heavily on how the sample is generated, which remains "an important open problem."

## Experimental Validation

CPS was evaluated against micro-opportunistic search (with chronological and intelligent backtracking) and min-conflict iterative repair on a standard 10-job, 5-resource scheduling benchmark.

Key results:
- CPS (20, ASAP) solved all 60 benchmark problems, matching only MICRO OPP INTEL BKTRK in coverage.
- CPS was approximately **64% faster** than MICRO OPP INTEL BKTRK on average.
- CPS consistently outperformed min-conflict repair, which struggled particularly on problems with two a priori bottlenecks — a failure attributed to "the local nature of the conflict measure used in MIN CONF" which "is unable to detect such interactions."

The MIN CONF result is particularly instructive. Min-conflict repair works well when the initialization is good (the Spike system achieves good performance precisely by balancing initialization and repair effort equally and using the same informed heuristics for both). When initialization is uninformed, the repair process has too much work to do, and when there are multiple interacting bottlenecks, the local conflict measure — which doesn't account for the correlation structure of conflicts — fails to guide the repair toward global solutions.

## Implications for Agent System Design

**For task scheduling in orchestration systems**: When multiple agent tasks compete for shared resources (rate limits, tool slots, memory, specialized agents), CPS-style reasoning applies directly. Rather than greedily assigning tasks to specific time slots in a forward pass, an orchestrator could:
1. Represent all pending tasks as tokens with temporal bounds.
2. Sample random valid schedules and compute contention statistics.
3. Identify the highest-contention resource-time pair.
4. Impose ordering constraints on the conflict set.
5. Repeat until conflict-free.

This approach avoids the failure mode of greedy schedulers that make early decisions that look locally optimal but create cascading conflicts downstream.

**For debugging and bottleneck identification**: The contention profiling step — identifying which resource at which time is most likely to be conflicted — is a powerful diagnostic tool independent of the full CPS algorithm. An agent system that monitors resource usage and computes contention profiles over recent and projected load can proactively identify where capacity expansions or workflow changes will have the most impact.

**For multi-agent coordination**: When multiple agents must access a shared service (an API, a database, a specialized tool), CPS suggests that the coordination protocol should focus first on the highest-contention resources rather than trying to coordinate all access uniformly. The "bottleneck first" heuristic concentrates coordination effort where it matters most.

**For restart strategies**: The CPS experience with stochastic restarts suggests that agent orchestration systems facing combinatorially hard scheduling problems should implement randomized restart mechanisms rather than pure deterministic backtracking. A failed scheduling attempt carries information about *why* it failed; a randomized restart uses different sampling to explore a different region of the solution space.

**For heuristic design**: The comparison between CPS and MICRO OPP reveals that the quality of statistical analysis matters more than the sophistication of the backtracking mechanism. MICRO OPP INTEL BKTRK (with sophisticated backtracking) solved all problems but was 64% slower than CPS (which uses simple random restarts). Investing in better search space analysis pays more than investing in better failure recovery.

## Boundary Conditions

CPS performs its statistical analysis relative to the temporal bounds of tokens in the current network. If the scheduling horizon is very long relative to token durations, the relevant contention is diluted across the horizon and harder to detect statistically. Problems with many short tasks spread over a long horizon may require larger sample sizes N.

The algorithm as described is strictly monotonic — it only adds constraints, never removes them. When it fails, it resets entirely. This means it cannot do "smart" backtracking — it cannot identify and retract the specific constraint that caused an inconsistency. More sophisticated variants would combine CPS with dependency-directed backtracking.

The stochastic simulation assumes that temporal constraints can be satisfied by forward dispatching — that there exists a consistent complete assignment that can be found by a greedy procedure. Problems where constraint networks are so tight that no forward dispatching succeeds would require a different simulation method.

Finally, CPS does not directly handle optimization criteria (minimize makespan, maximize throughput) — it focuses on feasibility. Extending CPS with objective function guidance is noted as future work in the paper.