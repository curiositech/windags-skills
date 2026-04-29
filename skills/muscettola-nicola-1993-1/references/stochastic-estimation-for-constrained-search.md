# Stochastic Estimation for Constrained Search: Using Randomness to Navigate Combinatorics

## Why Randomness in a Deterministic Problem?

Scheduling problems are, in a mathematical sense, deterministic: there is a definite answer to whether a given assignment of start times and resource allocations satisfies all constraints. The problem of *finding* that answer, however, is combinatorially hard — NP-hard in general for job shop scheduling, and PSPACE-hard or worse for integrated planning and scheduling.

Faced with this complexity, the classical response is to design clever deterministic heuristics that guide search: most-constrained-first variable ordering, least-conflicting-value selection, intelligent backtracking. These work well when the heuristic's assumptions match the problem structure.

HSTS's Conflict Partition Scheduling (CPS) takes a different approach: **use randomized sampling to characterize the statistical structure of the search space**, and use those statistics to guide deterministic constraint-posting decisions. Randomness is not a substitute for analysis — it is a tool for analysis.

## The Fundamental Observation

The key insight is an asymmetry: it is hard to determine whether a partially-specified constraint network has a consistent completion, but easy to generate complete time assignments that satisfy the temporal constraints (though they may violate capacity constraints). 

Forward dispatching — assigning start times to tokens in order, choosing any time within the current feasible window — always produces a complete, temporally consistent assignment. This assignment may have capacity violations (two activities on the same resource simultaneously), but it satisfies all the ordering and duration constraints already posted in the network.

This asymmetry creates an opportunity: if complete time assignments are easy to generate, and each generated assignment reveals which resources are conflicted, then a *sample* of assignments reveals the *statistical distribution* of conflicts across the scheduling horizon.

"While it is difficult to complete an intermediate problem solving state into a consistent schedule due to unresolved disjunctive capacity constraints, it is easy to generate total time assignments that satisfy the temporal constraints already in the network."

## Two Statistical Measures: Demand and Contention

From a sample of N complete time assignments, CPS computes two statistics:

**Token demand** `Δ(τ, t_i)`: For token τ and time t_i, the fraction of samples in which τ's execution interval overlaps t_i. 

Token demand measures *temporal concentration* — how strongly the existing constraints bias a token toward executing at a particular time. High demand at a specific time means the token has limited temporal flexibility and tends to cluster there. Low demand spread broadly means the token could execute almost anywhere in its window.

**Resource contention** `χ(ρ, t_i)`: For resource ρ and time t_i, the fraction of samples in which ρ is requested by more than one token simultaneously.

Resource contention measures *conflict probability* — given the current constraints, how likely is it that a specific resource will be over-subscribed at a specific time? High contention doesn't mean there *is* a conflict in the current (partially specified) network — it means that among all consistent completions of the current network, a large fraction have a conflict there.

These two measures capture fundamentally different aspects of the scheduling state:
- Demand describes what the scheduler has already decided (which times are feasible for each token)
- Contention describes what remains to be decided (where conflicts are most likely to occur)

Together, they provide a *global* view of where the scheduling problem is hardest, available at any intermediate stage of the scheduling process.

## The Stochastic Simulation Process

Generating each sample in the ensemble of N complete time assignments follows a simple procedure:

1. Select a variable (a token start or end time) according to a variable selection strategy.
2. Select a value within the variable's current feasible range according to a stochastic value selection rule.
3. Assign the value and propagate the new constraint through the time point network, updating other variables' feasible ranges.
4. Repeat until all variables are assigned.

Record the interval of occurrence for each token, and whether any resource is over-subscribed at any time.

This is essentially a randomized forward scheduler — it creates a schedule by greedily assigning times in some order, using a randomized selection rule. The randomization means that different runs of the simulation produce different samples, covering different parts of the feasible space.

Two parameters control the character of the sample:
- **Variable selection strategy**: which time point to assign next. CPS uses forward temporal dispatching — assign times in chronological order. Other strategies (random selection, most-constrained-first) are possible and may be better for specific problem structures.
- **Value selection rule**: which time within the feasible window to assign. CPS experiments with ASAP (earliest available, linearly biased) and UNIF (uniform random within window). ASAP consistently outperforms UNIF.

The ASAP advantage is informative: "the sample base obtained with a UNIF rule is, in fact, narrower than the one obtained with an ASAP rule." A sample generated with ASAP tends to pack activities as early as possible, which reveals the conflicts that arise when activities compete for resources early in the horizon. A uniform sample is less biased and may miss these conflicts by distributing activities more evenly — giving a falsely optimistic picture of conflict probability. The sampling strategy shapes what the sample reveals, and this has first-order effects on algorithmic performance.

## Statistical Measures vs. Analytical Computation

Why use stochastic sampling rather than exact computation of contention? Because exact computation of contention requires knowing, for every pair of tokens, whether they can both be scheduled simultaneously on the same resource — which is exactly the disjunctive constraint satisfaction problem that makes scheduling hard.

Stochastic sampling approximates these exact measures with error that decreases as `1/√N`. For N=20 (the sample size used in the CPS experiments), the approximation is rough — but "still extremely effective in reducing overall problem solving cost." The key is that the sampling doesn't need to be exact; it needs to be accurate enough to identify the *most likely* bottleneck reliably. If the true bottleneck has 80% contention and the second-worst has 30%, a sample of N=20 will reliably distinguish between them even with substantial sampling noise.

Micro-opportunistic search, which also uses contention-like metrics, avoids sampling by computing contention analytically under a relaxed problem (dropping some precedence constraints to make the computation tractable). This gives exact values under the relaxed problem, but "dropping constraints during capacity analysis allows fast computability of the metrics, but these computational savings might be offset by a decrease in the predictive power of the metrics. This decrease may cause an increase in the number of scheduling cycles needed to reach a solution."

CPS trades analytical exactness for the ability to use the full constraint network during estimation — including all the precedence constraints that MICRO OPP drops. The result is that CPS's estimates are noisier (due to sampling) but more accurate (because they don't ignore constraints). In practice, CPS converges in fewer cycles and with less total CPU time.

## Using Statistics to Make Decisions: The Bottleneck-Conflict-Partition Pipeline

The statistical measures feed directly into decisions:

**Bottleneck detection** finds the `(ρ_b, t_b)` pair with maximum contention. This is where the probability of conflict is highest — where the scheduling problem is currently hardest.

**Conflict identification** finds the set of tokens that: (a) request resource ρ_b, (b) have time bounds overlapping t_b, and (c) are not already forced into sequential order. Among multiple possible conflict sets, CPS prefers tokens whose demand profiles cluster around t_b — tokens that are *likely* to be executing at t_b, not just tokens that *could* be executing there.

**Conflict partition** divides the conflict set into two groups: tokens that tend to execute before t_b (based on clustering of their demand profiles) and tokens that tend to execute after t_b. A constraint is posted requiring every token in the "before" group to complete before every token in the "after" group begins.

The partition is guided by the statistical picture of where tokens naturally cluster. This is qualitatively different from arbitrary ordering heuristics (earliest due date, most slack first) — it orders tokens based on where they would *naturally* fall given the existing constraints, and uses that natural ordering to separate them before conflicts arise.

## The Role of Randomized Restarts

When CPS posts constraints that create an inconsistency (the time point network becomes infeasible), it resets the entire constraint network to its initial state and begins again. Each restart generates a new sample with fresh randomization, potentially exploring a different region of the sample space.

This is the CPS equivalent of random restarts in satisfiability solving. The intuition is the same: if a deterministic search gets "stuck" because of a bad early decision, randomized restarts allow it to approach the problem from a fresh angle. CPS allows up to 10 restarts before declaring failure.

The randomized nature of CPS means that each restart is not merely repeating the previous computation — the stochastic simulation generates a different sample distribution, which may identify a different bottleneck or produce a different partition of the conflict set. This diversity of approaches is what allows CPS to succeed after a failed first attempt.

## The Sample Size Question

N=20 is a small sample. In a problem with 10 jobs × 5 operations × 5 resources, there are many possible schedules, and 20 samples covers only a tiny fraction of the feasible space. Why does it work?

The answer is that the statistics don't need to be globally accurate — they need to be accurate enough to distinguish the *most severe* bottleneck from its neighbors. If the bottleneck has substantially higher contention than everything else (as is common in problems designed with explicit bottlenecks), even a small sample will reliably identify it. The quality of the statistical analysis becomes important primarily in problems where multiple resources have similar contention levels — exactly the hard multi-bottleneck problems where other methods also struggle.

"The evaluation of the effect of different sampling strategies on the performance of the scheduler is an important open problem." This remains true — the choice of N, variable selection strategy, and value selection rule interacts in complex ways with problem structure, and there is no universal optimal configuration.

## Implications for Agent System Design

**For resource contention analysis**: Any agent orchestration system managing multiple shared resources (rate limits, tool slots, memory budgets, specialized agent availability) can use sampling-based contention estimation to proactively identify where conflicts are most likely to occur. Rather than waiting for conflicts to happen and then resolving them reactively, the orchestrator can run periodic stochastic simulations of future task execution and identify bottlenecks before they become acute.

**For scheduling heuristics**: The CPS approach suggests a general pattern for constrained search: (1) generate random feasible completions of the current partial schedule, (2) identify where the most conflicts occur across the sample, (3) post constraints that resolve the worst bottleneck. This pattern is more robust than greedy commitment heuristics because it incorporates a statistical view of the whole remaining search space rather than focusing on the immediately next decision.

**For sampling-based estimation in general**: The key insight — that it is often easier to *sample* feasible completions than to *analyze* the feasibility structure analytically — applies broadly. Agent systems that face complex constraint satisfaction problems (e.g., resource allocation, workflow scheduling, agent assignment) can often get useful statistical information about the problem's difficulty and structure by generating random completions and observing their properties. This is cheaper than exact analysis and often accurate enough for good decision-making.

**For sample diversity**: The ASAP vs. UNIF comparison warns that the value selection rule in the stochastic simulation must be chosen carefully. A biased rule may produce a sample that systematically misses certain types of conflicts. An orchestration system that uses sampling-based contention estimation should experiment with different sampling strategies and validate that the chosen strategy covers the kinds of conflicts that actually occur in its domain.

**For restart strategies**: The CPS restart mechanism suggests a general principle for agent orchestration: when a scheduling attempt fails, don't simply try a different greedy order — try a genuinely different approach, where "different" means using different random seeds or different sampling strategies to explore a different part of the solution space. Pure deterministic retry has no chance of success; randomized retry has a positive probability of success on each attempt.

**For the exploitation of structure**: CPS's success with N=20 samples demonstrates that problem structure — explicit bottlenecks, clustered demand profiles — can be exploited by statistical methods even with small samples. Agent orchestration systems should be designed to reveal and exploit structural regularities in task patterns (e.g., certain types of tasks always contend for the same resource) rather than treating each scheduling problem as fresh.

## Boundary Conditions

Stochastic estimation requires that the existing constraints be sufficient to meaningfully constrain the sample space. If the network is completely unconstrained (every token can start anywhere in the full horizon), the sample will be essentially uniform and will provide no useful guidance about where conflicts are likely. The method works best when the network already has substantial constraint structure from problem requirements and previously posted decisions.

The quality of the bottleneck detection degrades gracefully as problems become harder (more interacting bottlenecks, more similar contention levels across resources). For very hard problems, N=20 may be insufficient to reliably distinguish bottlenecks. The appropriate sample size is problem-dependent, and there is no clean way to determine it in advance.

The stochastic simulation assumes that forward dispatching can always produce a complete, temporally consistent assignment. This requires that the time point network is consistent (no contradictory temporal constraints). If the network is already temporally inconsistent, the simulation may fail to generate valid samples. In HSTS, temporal consistency is maintained by propagation; in agent systems, the analogous requirement is that the task dependency graph not contain cycles or contradictory timing requirements.

Finally, the partition-based conflict resolution assumes that the conflict set can be meaningfully divided into two groups with a natural ordering. For conflict sets where all tokens have similar demand profiles — no natural clustering around a time point — the partition heuristic degenerates. Alternative conflict resolution strategies (e.g., posting a complete ordering, or posting a single pairwise constraint) may be more appropriate for such cases.