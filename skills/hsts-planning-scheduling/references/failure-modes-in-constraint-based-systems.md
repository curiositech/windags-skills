# Failure Modes in Constraint-Based Planning Systems: What Goes Wrong and Why

## Prologue: HSTS as a Warning System

Muscettola designed HSTS partly as an answer to failures in classical approaches. Understanding what those failures are — and the structural reasons they occur — is essential for building agent systems that avoid them. The paper does not catalog failures explicitly, but the design decisions of HSTS are each a response to a specific failure mode in earlier systems. Reading these design decisions in reverse reveals a comprehensive taxonomy of ways that planning and scheduling systems break down.

## Failure Mode 1: Premature Commitment

**What it is**: Making exact decisions (fixing variable values) before sufficient information is available to make them well.

**How it manifests**: A scheduler fixes the start time of activity A at time 14 before knowing the duration of activity B, which precedes A. When B turns out to take until time 16, A cannot start at 14, and the fixed decision must be undone. If many subsequent decisions depended on A starting at 14, undoing it requires cascading revision.

**Why it's insidious**: Premature commitment is often invisible at the time it's made. The decision looks fine given current knowledge; it only becomes problematic when future information arrives. Systems that commit early appear to be making progress but are actually accumulating technical debt in the form of fragile decisions that will require future revision.

**HSTS's response**: The constraint-posting approach delays value commitment in favor of ordering constraints. The time point network tracks ranges rather than exact values. Flexibility is preserved until domain structure (compatibility constraints) or problem requirements force commitment. "HSTS puts special emphasis on leaving as much temporal flexibility as possible during the planning/scheduling process." (p. Abstract)

**For agent systems**: Don't pin down agent invocation parameters, timing, or routing before the information needed to choose them well is available. An orchestration architecture that routes tasks to agents based on preliminary task classification may commit to a suboptimal route before the task's actual requirements are understood. Prefer routing decisions that remain revisable until the task is actually executed.

## Failure Mode 2: The Nominal Plan Brittleness Trap

**What it is**: Producing plans that specify exactly one course of action, leaving no explicit representation of feasible alternatives.

**How it manifests**: The nominal plan is a point in plan space. During execution, any deviation from that point — however small — produces a situation the plan doesn't describe. The executor doesn't know whether the deviation is acceptable or catastrophic, and has no information about how to recover. Every minor unexpected event triggers a full replanning cycle.

**Why it's insidious**: Nominal plans appear thorough. "We've planned for everything!" But planning for everything means planning for *one specific thing*, not for the space of things that might happen. The nominal plan's apparent completeness is actually a representation of brittleness.

**HSTS's response**: Schedules as behavioral envelopes. "Within the HSTS framework... schedules implicitly identify a set of legal system behaviors. This is an important distinction with respect to classical approaches which, instead, specify all aspects of a single, nominal system behavior." (p. 2)

**For agent systems**: Design agent workflows with explicit slack — temporal ranges rather than exact timings, alternative routing paths rather than single paths, parameter ranges rather than exact values. An orchestration system that produces a workflow specification as tight as a deterministic program is fragile. One that produces a specification as loose as is consistent with all requirements is robust.

## Failure Mode 3: Representation-Induced Blindness

**What it is**: Using a representation that cannot express the constraints relevant to the domain, causing the system to violate constraints it cannot see.

**How it manifests in classical scheduling**: Resource availability is tracked as a binary (available/unavailable). No information is maintained about *what state the resource is in*. A drill machine is either idle or running — but which drill bit is mounted? Classical scheduling cannot represent this, and therefore cannot detect or prevent the conflict caused by scheduling two operations requiring different drill bits back-to-back without allocating setup time.

**How it manifests in classical planning**: Actions are instantaneous transitions between states. Duration, resource consumption, and parallel process coordination cannot be represented. Planning a maintenance operation without representing how long it takes or what it blocks is planning that will fail in execution.

**HSTS's response**: State variables with rich value vocabularies, duration constraints, and compatibility specifications. "No information is kept about a resource state beyond its availability. Additional state information (e.g., which bit is mounted in a drill at a given time) is crucial to maintain causal justifications and to dynamically expand support activities during problem solving." (p. 2)

**For agent systems**: If your orchestration framework cannot represent the actual constraints of your domain — e.g., that agent A requires the output of agent B in a specific format, or that agents X and Y cannot run simultaneously due to a shared memory constraint — it will silently produce plans that violate those constraints. The solution is not to add more runtime checks but to enrich the plan representation so constraints are visible *during planning*.

## Failure Mode 4: The Sub-Problem Independence Illusion

**What it is**: Treating sub-problems as independent when they are actually coupled, solving them independently, and discovering only at integration time that the independent solutions are jointly infeasible.

**How it manifests**: Plan the production schedule for product A independently; plan the production schedule for product B independently; discover when integrating that both schedules require the same machine at the same time.

**Why it's insidious**: Sub-problem decomposition is correct and necessary for managing complexity. The failure is not in decomposing but in failing to model the *interactions* between sub-problems.

**HSTS's response**: Compatibility specifications explicitly model inter-component interactions. When instrument WFPC's detector state and telescope pointing state interact, that interaction is captured in compatibility constraints on both state variables. The sub-problem decomposition (separate state variables per subsystem) coexists with explicit coupling (cross-variable compatibility constraints).

"By making evident the decomposition in modules and the structural similarities among different sub-models, HSTS made possible the reuse of heuristics." (p. 20)

**For agent systems**: When decomposing a complex task into subtasks for different agents, don't just define what each agent does in isolation — define the *interface constraints* between agents: what information must flow between them, in what format, with what timing guarantees. These interface constraints are the agent-system analog of HSTS's cross-variable compatibility specifications. Without them, independently developed agents will produce subtask solutions that cannot be integrated.

## Failure Mode 5: Local Conflict Blindness

**What it is**: Using conflict resolution heuristics that consider only immediate conflicts without accounting for how resolving one conflict creates or worsens others.

**How it manifests**: MIN CONF (min-conflict iterative repair) selects a conflicting variable and moves it to minimize its immediate conflicts. This may resolve the immediate conflict while creating new ones elsewhere, leading to oscillation or stagnation. The experimental results are clear: MIN CONF solved only 24-25 of 60 problems, compared to 60/60 for CPS.

"The local nature of the conflict measure used in MIN CONF is unable to detect such interactions." (p. 27, on two-bottleneck problems)

**Why it's insidious**: Local conflict resolution produces the illusion of progress — conflicts are being resolved! — while the global problem gets no better or worse. Systems that repair only visible conflicts may spend all their time rearranging deck chairs.

**HSTS's response**: CPS's stochastic simulation computes a *global* estimate of conflict likelihood across all resources and times, identifying the single location of *highest expected conflict*. Interventions are made at this global bottleneck, not at the nearest local irritant.

**For agent systems**: When debugging a multi-agent workflow that is producing errors or poor results, resist the temptation to fix the most visible problem first. The visible failure is often a downstream symptom of an upstream structural issue. First estimate the global conflict landscape (which agents or resources are most frequently involved in failures?), then intervene at the primary source.

## Failure Mode 6: Inconsistency Without Recovery Protocol

**What it is**: A constraint propagation system that detects inconsistency but has no policy for how to respond, or that automatically attempts recovery in a way that is wrong for the current context.

**How it manifests**: Over-subscribed resource detected. System automatically deletes the last inserted token (chronological backtracking). But the correct response might be to delete an earlier token, or to reject a goal entirely, or to acquire additional resources.

"If a state variable is over-subscribed, we might either delete tokens that have not yet been inserted (goal rejection) or cancel the insertion of some tokens (resource deallocation). A planner/scheduler implemented in HSTS can operate on inconsistent token networks." (p. 14-15)

**HSTS's response**: HSTS's propagation procedures detect inconsistency but do *not* automatically recover. "The problem solver must take full responsibility of the recovery process, since different responses might be needed in different situations." (p. 15)

This is a deliberate design choice. Domain-specific knowledge is needed to make the right recovery decision. A generic recovery procedure will often make the wrong choice.

**For agent systems**: When an agent invocation fails or produces invalid output, the orchestration system should not automatically retry or substitute a default — it should surface the failure with enough context for an intelligent recovery decision. Who failed? What were the inputs? What constraints were violated? What recovery options exist (retry, substitute, escalate, reject the task, acquire additional resources)? The answers are domain-specific; the recovery protocol should reflect this.

## Failure Mode 7: Abstraction Level Mismatch

**What it is**: Making decisions at the wrong level of abstraction — either at too high a level (missing critical constraints) or too low a level (drowning in irrelevant detail).

**How it manifests at too high a level**: The abstract planner sequences observations without accounting for realistic reconfiguration times, then the detail planner discovers that the abstract sequence is infeasible.

**How it manifests at too low a level**: The detail planner reasons about individual drill-bit changes before the abstract plan has determined which operations will be needed, wasting effort on details that may be irrelevant.

**HSTS's response**: Two-level architecture with bidirectional information flow. Abstract decisions constrain detail decisions. Detail constraints propagate back as additional abstract constraints. "Additional temporal constraints on abstract observations to more precisely account for the reconfiguration delays" are communicated up. (p. 19)

**For agent systems**: A common orchestration failure is routing a task directly to a highly specialized agent (operating at too low an abstraction level) before understanding the task's high-level requirements. The specialized agent's narrow scope causes it to produce a partial solution that doesn't fit the broader context. The fix: insert an abstract-level reasoning step that characterizes the task's high-level structure before committing to specific agents.

## Failure Mode 8: Statistical Sampling Bias

**What it is**: Estimating search space properties from a biased sample, leading to systematically wrong predictions about where conflicts will occur.

**How it manifests in CPS**: Using UNIF (uniform) value selection in stochastic simulation samples from a narrower region of the solution space than ASAP (earliest-time biased) selection. The resulting contention estimates are less predictive, causing CPS to focus on the wrong bottlenecks.

"The choice of different value selection rules impacts the region of the search space from which sample elements are more likely to be generated. In our case it can be demonstrated that the sample base obtained with a UNIF rule is, in fact, narrower than the one obtained with an ASAP rule." (p. 27)

**For agent systems**: Any system that estimates properties of a complex workflow by sampling possible execution scenarios is vulnerable to sampling bias. If the sampling procedure systematically favors certain execution paths (e.g., always choosing the fastest-completing agent variant), the estimated bottlenecks will reflect only those paths, missing conflicts that arise on other paths. Sampling strategies should be chosen to cover the full distribution of likely execution scenarios, not just the fastest or most obvious ones.

## The Meta-Lesson: Representation Determines What Failures Are Possible

Reading these failure modes together reveals a meta-principle: **the failure modes available to a planning system are determined by its representation.** Systems that cannot represent resource state beyond availability cannot fail through drill-bit conflicts — but they also cannot succeed on problems where such conflicts matter. Systems that represent only nominal plans cannot fail through envelope-boundary confusion — but they are always brittle to deviation.

HSTS's design choices are simultaneously choices about which failure modes to trade away and which to accept. The system accepts the failure of potentially missing a globally optimal schedule in favor of avoiding the failures of premature commitment, nominal plan brittleness, and representation-induced blindness.

For agent system design, this is the deepest lesson: **choose your representation based on which failure modes matter most for your domain.** A representation that makes the important failures impossible is more valuable than one that makes all failures theoretically analyzable.