# Failure Modes in Planning and Scheduling Systems: What HSTS Warns Against

## Preamble: The Lessons Encoded in a Working System

HSTS was built in response to observed failures in existing approaches to complex planning and scheduling problems. The design choices in HSTS — what to unify, what to make flexible, what to keep modular — are motivated by an understanding of where classical systems break down. Reading these failure modes carefully yields a set of warnings that apply well beyond scheduling systems.

## Failure Mode 1: Premature Separation of Concerns

**The pattern**: Separate planning (what to do) from scheduling (when to do it) into distinct sequential phases with a one-way handoff.

**How it fails**: During scheduling, you discover that the plan you were given cannot be scheduled given actual resource constraints — but the planning phase is over, and the plan library was built without scheduling information. During planning, you choose between alternative courses of action without knowing which alternatives will create unresolvable resource conflicts at schedule time.

The canonical examples from HSTS: setup activities (drilling machine bit changes) that only become necessary based on how activities are sequenced cannot be pre-planned because they depend on scheduling decisions. Conversely, choosing between two process plans that differ only in their resource usage patterns cannot be done rationally without scheduling information.

**The systemic consequence**: "The number of possible alternatives might make the management of a complete plan library impractical." A complete plan library must anticipate all possible scheduling contexts; this is computationally infeasible for complex domains.

**Warning for agent systems**: Any agent orchestration system that rigidly separates "task decomposition" (planning) from "agent assignment" (scheduling) will encounter this failure mode. The decomposition phase will produce subtask structures that cannot be efficiently assigned, and the assignment phase will discover that it needs subtasks that weren't planned. The two phases must be able to communicate bidirectionally and iteratively.

## Failure Mode 2: Losing Causal Justification During Scheduling

**The pattern**: Track only resource availability over time, discarding information about *why* a resource is in a particular state.

**How it fails**: Classical scheduling systems keep "no information about a resource state beyond its availability." This means you know that the drilling machine is busy from t=10 to t=15, but not that it's busy because Job 7's operation 3 is running. You know that a telescope instrument is in an intermediate configuration state, but not which observation request made it enter that state or what transition sequence it must follow.

**The systemic consequence**: When you need to add a setup activity, repair a conflict, or explain a scheduling decision, there is no causal map to consult. Repair is limited to brute-force trial-and-error because you cannot reason about what can be removed or moved without affecting other things. Explanation is impossible because the reasons for decisions are not recorded.

**Warning for agent systems**: Agent orchestration systems that record only *what* agents are doing and *when*, without recording *why* (which goal they are serving, which other agents depend on their output), cannot support principled failure recovery. When an agent fails, the system cannot determine what other tasks are affected. When a human needs to understand and validate a plan, the system cannot explain its decisions. Causal justification must be a first-class data structure, not an afterthought.

## Failure Mode 3: Over-Commitment to Specific Times and Values

**The pattern**: Commit to exact start times, end times, and resource assignments as early as possible.

**How it fails**: Every early commitment eliminates options. When a conflict is detected later, recovery requires either accepting a locally suboptimal fix or backtracking past many committed decisions. "When reasoning about sets of possible assignments of start and end times for the remaining unscheduled activities, the flexible time approach shows potential advantages over the value commitment approach."

The mathematical argument is clear: fixing a variable to a specific value loses one dimension from the search space. Posting a constraint (ordering, minimum gap) restricts the range of values without necessarily losing a dimension. Over the course of a complex scheduling problem, the accumulated effect of premature commitments can make the remaining search space too small to contain a feasible solution, even when a feasible solution exists in the unconditionally flexible space.

**Warning for agent systems**: Agent orchestration systems that greedily assign tasks to specific agents at specific times without regard for future flexibility will find themselves in situations where the "obvious" assignment for later tasks is unavailable because it was foreclosed by an unnecessary earlier commitment. The scheduler should distinguish between commitments that are genuinely necessary (a deadline is a commitment; a specific agent assignment usually is not) and those that are merely convenient for immediate decision-making.

## Failure Mode 4: Local Conflict Measures Miss Global Interactions

**The pattern**: Identify and resolve conflicts by looking at each resource or task in isolation, without modeling how conflicts at different resources interact.

**How it fails**: In problems with multiple interacting bottlenecks, resolving a conflict at one resource by resequencing activities can create or worsen conflicts at another resource. A conflict measure that only looks at local resource overload cannot detect these interactions and cannot predict that a locally-attractive resolution will globally create more problems than it solves.

The experimental evidence from HSTS is stark: "Both configurations of MIN CONF performed significantly worse than both CPS and MICRO OPP. The performance of MIN CONF across problem subsets is worst on the problems with two a priori bottlenecks... These results suggest that the local nature of the conflict measure used in MIN CONF is unable to detect such interactions."

Pure repair approaches — start with any complete assignment and locally fix conflicts — are particularly vulnerable to this failure when initialization quality is poor. The local repair process optimizes locally and cannot see global structure.

**Warning for agent systems**: Orchestration systems that detect and resolve resource contention one resource at a time (e.g., API rate limit exceeded → slow down API calls; memory limit exceeded → reduce memory usage) without modeling the interactions between resource constraints can enter destructive cycles. Reducing API call rate to resolve a rate limit conflict might cause timeouts that require more retry calls. Reducing memory usage to resolve a memory conflict might cause more disk I/O that exhausts I/O bandwidth. Global resource analysis — even approximate, as in CPS — is necessary for multi-resource constrained systems.

## Failure Mode 5: Heuristics That Cannot Compose

**The pattern**: Design domain-specific heuristics as monolithic procedures that reason about the whole problem simultaneously.

**How it fails**: As the domain grows — more components, more state variables, more constraint types — monolithic heuristics must be rewritten from scratch or extended in ways that create complex interactions. The computational effort to solve the larger problem grows more than additively, often super-linearly or combinatorially, because the heuristic cannot exploit the locality structure of the domain.

HSTS demonstrates the contrast: heuristics designed to exploit the *modularity* of the domain model (each heuristic governs specific system components and their interactions with known neighbors) compose cleanly when new components are added. The SMALL-to-MEDIUM-to-LARGE progression in HST shows this empirically: average CPU time per compatibility remains "relatively stable" across model sizes, and total CPU time grows approximately as the sum of component sub-problem efforts.

**Warning for agent systems**: Skill implementation heuristics in agent systems should be scoped to the specific state variables and capabilities of the skill, not to the full system state. A skill for "booking travel" should not need to know about the state of "managing email" to function correctly. The dependency structure between skills should be explicit and minimal — skills should be designed to operate independently with well-defined interfaces, not to be globally aware.

## Failure Mode 6: Ignoring the Execution Context of Schedules

**The pattern**: Build a fully specified nominal plan/schedule and hand it to an executor with no flexibility information.

**How it fails**: Execution in complex physical systems always deviates from plan. Targets become occluded earlier than expected; reconfigurations take longer; instruments enter unexpected fault states. A nominal plan cannot distinguish between deviations that are harmlessly within its implicit slack and deviations that genuinely require replanning. The executor either follows the nominal plan blindly (ignoring real problems) or treats every deviation as a crisis requiring emergency replanning.

"Since the schedule does not explicitly represent feasible alternatives, it is difficult to have a clear picture of the impact of the unavoidable deviations from the desired course of action."

**Warning for agent systems**: An agent orchestration system that hands a sequence of tasks to an executor without communicating the temporal flexibility of each task will force the executor into a binary choice: follow the sequence exactly (rigid) or report any deviation as a failure (brittle). Executors need to know not just what to do but how much temporal slack they have, which deadlines are hard and which are soft, and which ordering constraints are necessary versus merely conventional.

## Failure Mode 7: Ignoring the Quality of the Initialization in Repair-Based Systems

**The pattern**: Assume that a repair-based scheduler can recover from any initialization if given enough repair cycles.

**How it fails**: The experimental comparison between MIN CONF and Spike is illuminating. Both use min-conflict iterative repair. Spike performs well because "initialization and repair efforts are balanced... when Spike succeeds, most of the time it does not repair." MIN CONF performs poorly because initialization is uninformed and the repair process has to do all the work — "the dependency of the convergence of the repair process from the choice of a 'good' initial solution is still an open problem."

In practice, repair-based methods require a good starting point. When the initial assignment is far from feasible — many conflicts, many violated constraints — the repair process faces a landscape where any local improvement destroys another constraint, and convergence is slow or impossible.

**Warning for agent systems**: Agent orchestration systems that use iterative repair to fix scheduling problems (reassigning tasks when conflicts are detected) must ensure that the initial assignment is reasonably good. Starting from a random or arbitrary assignment and expecting repair to find a solution is unreliable for hard problems. The initial assignment should itself be the result of a reasoned process — even a simple greedy heuristic produces better initializations than random assignment.

## Failure Mode 8: Confusing Model Complexity with Problem Complexity

**The pattern**: Represent the domain with a highly complex model (many variables, many types, many constraints) when a simpler model would suffice.

**How it fails**: HSTS explicitly addresses this through hierarchical abstraction. The abstract level for HST scheduling uses a handful of state variables; the detail level uses dozens. Problems that can be solved at the abstract level (overall observation sequencing) should not be dragged into the detail level (instrument reconfiguration specifics) unnecessarily.

The balance between model detail and computational tractability is domain-specific and must be deliberately engineered. "The strict separation between planning and scheduling does not match the operating conditions of a wide variety of complex systems. Even in cases where separation is viable it might be overly restrictive." But neither is maximal integration always right — staging problem solving through levels of abstraction can dramatically reduce computational cost.

**Warning for agent systems**: Agent systems should resist the temptation to make every decision at the most detailed level available. When routing a user query, the orchestrator doesn't need to know the exact memory layout of the skills it might call — only their abstract capabilities. When decomposing a research task, the orchestrator doesn't need to specify the exact format of intermediate outputs — only their type and dependency structure. Premature detail introduces unnecessary constraints and slows the problem-solving process.

## Summary of Failure Modes as Design Principles

| Failure Mode | Design Principle |
|---|---|
| Premature separation of concerns | Integrate planning and scheduling decisions bidirectionally |
| Losing causal justification | Maintain explicit causal justification structures for all decisions |
| Over-commitment to specific values | Represent decisions as constraints, not assignments, until specificity is genuinely needed |
| Local conflict measures miss global interactions | Use global statistical analysis (sampling) to characterize conflict probability across the full search space |
| Non-composable heuristics | Design heuristics scoped to system components with explicit interfaces |
| Ignoring execution flexibility | Communicate temporal flexibility information to executors alongside nominal plans |
| Poor initialization in repair systems | Ensure reasonable initialization before beginning iterative repair |
| Confusing model and problem complexity | Match model detail to the level of abstraction appropriate for each decision |

These are not abstract principles — they are failure modes observed in deployed systems working on real problems (Hubble Space Telescope operations, transportation planning). Each represents a design choice that seemed reasonable at the time but caused systematic failures in complex domains. A system designer who internalizes these lessons can avoid reinventing these failure modes.