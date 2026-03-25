## BOOK IDENTITY
**Title**: HSTS: Integrating Planning and Scheduling
**Author**: Nicola Muscettola
**Core Question**: How can a unified representational framework dissolve the artificial boundary between planning (what to do) and scheduling (when and with what resources to do it), enabling intelligent systems to solve complex real-world coordination problems that neither approach alone can handle?
**Irreplaceable Contribution**: Muscettola's HSTS is one of the earliest rigorous demonstrations that treating a domain as a *dynamical system described by state variables evolving over continuous time* allows planning and scheduling to emerge as two faces of the same problem-solving act. The paper's deepest insight — that schedules should be *envelopes of legal behavior* rather than *nominal trajectories* — anticipates decades of subsequent work on flexible execution and robust planning. The Conflict Partition Scheduling methodology, which uses stochastic simulation to estimate search-space properties *before committing*, is a landmark in statistics-guided combinatorial search that remains underappreciated outside the AI planning community.

---

## KEY IDEAS

1. **The Planning/Scheduling Unification**: The traditional separation of planning (what) from scheduling (when/how) is an artifact of representation, not a property of the world. When a domain is modeled as a vector of state variables evolving over continuous time, planning decisions (causal justifications, goal decomposition) and scheduling decisions (resource allocation, time assignment) become simultaneous, mutually informing acts. The HSTS framework shows concretely how to build systems that do both at once.

2. **Schedules as Behavioral Envelopes, Not Nominal Trajectories**: A schedule that specifies exactly one course of action is brittle — any deviation from the nominal plan requires replanning from scratch. HSTS instead advocates constructing *sets* of legal behaviors: temporal flexibility is preserved as long as possible, and the executor is free to choose any path within the envelope at runtime. This reframes the goal of scheduling from "find the optimal plan" to "find the most permissive constraint network consistent with all goals."

3. **Commitment Level as a First-Class Decision**: At every step of problem solving, an agent can choose how much to commit. Instead of binding a start time to a specific value, it can post a precedence constraint. Instead of fixing which target to slew from, it can leave the argument unbound. HSTS formalizes this as a spectrum from value-commitment (exact times) to constraint-posting (ordering relations), and shows experimentally that lower commitment levels during search produce better solutions with less computation.

4. **Bottleneck-Centered Probabilistic Focus**: The Conflict Partition Scheduling method demonstrates that stochastic simulation over the current constraint network — without resolving any disjunctions — yields reliable statistical estimates of where conflicts are *most likely* to occur. Agents should focus their decision-making effort on the bottleneck: the resource-time pair with highest estimated contention. This is a general principle: measure before committing.

5. **Modularity and Additive Scalability**: Complex domains decompose into modules (subsystems, state variables). If heuristics are developed for each module with awareness of local interactions, the combined system's computational cost is approximately the *sum* of its parts — not exponentially worse. This is not automatic; it requires the framework to make module boundaries and interaction structure explicit.

---

## REFERENCE DOCUMENTS

### FILE: planning-scheduling-unification.md
```markdown
# The Planning/Scheduling Unification: How Intelligent Systems Should Model Their World

## The Artificial Boundary and Why It Must Fall

Classical AI draws a sharp line between planning and scheduling. Planning asks: *what sequence of actions achieves this goal?* It operates over abstract world states, concatenating operators that transition between them. Scheduling asks: *when does each action execute, and which resources does it consume?* It operates over resource timelines, assigning time slots to known activities.

This separation feels clean in textbooks. It fails in the real world.

Muscettola's diagnosis is precise: "This strict separation between planning and scheduling does not match the operating conditions of a wide variety of complex systems. Even in cases where separation is viable it might be overly restrictive." (p. 1)

The failure mode has two directions. First, scheduling decisions sometimes *require* planning: when two operations need the same drilling machine, someone must plan the setup activity (changing the drill bit) that no high-level plan anticipated. The schedule cannot be executed without this missing piece. Second, planning decisions sometimes *require* scheduling information: if you're choosing between two process plans for manufacturing a widget, the right choice depends on current resource loads — information that only exists during scheduling. Choosing without it yields suboptimal plans.

The root cause: **planning and scheduling are not sequential phases; they are entangled dimensions of a single problem.**

## The Unifying Representational Principle: Dynamical Systems

HSTS's answer is to model any domain as a *dynamical system* — a formal structure that gives the relationship between actions (inputs) and observed behaviors over time, accounting for internal state (memory of past history).

The key insight: "In domains like space mission scheduling and transportation planning we can accurately describe the system's instantaneous situation with the value of a handful of its properties." (p. 5)

This leads to the fundamental structuring principle: **describe both input and state as finite-dimensional vectors of values evolving over continuous time.**

Each component of the state vector is a *state variable* — a property of the system that can assume exactly one value at any point in time. The Hubble Space Telescope's pointing device is one state variable; it can be UNLOCKED, LOCKING, LOCKED, or SLEWING. The tape recorder is another. Electric power budget is another. Each value can persist for an interval; transitions between values are themselves values (SLEWING is not an instantaneous event but a time-consuming process with its own constraints).

This representational choice accomplishes something profound:

**It subsumes classical scheduling.** A classical scheduling resource (in use / idle) is just a state variable with binary range. HSTS generalizes this to arbitrary value ranges, capturing not just *availability* but *what state the resource is in* — which drill bit is mounted, how much tape storage remains, whether an instrument is warming up or cooling down.

**It subsumes classical planning.** Classical planning's strict alternation between action and persistence (change, then stable state, then change) becomes a special case. In the state-variable view, any sequence of values can follow any other sequence. Persistent states can follow each other directly (when transitions are instantaneous). Changes can be contiguous (when a process has multiple phases). Parallel processes on different state variables proceed independently, synchronized only by explicit constraints.

**It enables integration.** Because the same representational primitives describe resources (scheduling concern) and causal states (planning concern), a single problem-solving framework can address both simultaneously.

## What This Means for Agent System Design

For a multi-agent orchestration system, this unification principle translates directly:

**Don't separate "task planning" agents from "resource allocation" agents.** In any sufficiently complex domain, these concerns are entangled. An agent that plans what tools to call without considering tool availability and load will produce plans that fail during execution. An agent that schedules tool calls without understanding causal dependencies will produce schedules that violate semantic correctness.

Instead, model the agent system's operational domain as a set of state variables:
- Each agent capability is a state variable (e.g., state(CodeReviewAgent): IDLE, REVIEWING(?file), AWAITING_CONTEXT, BLOCKED)
- Each shared resource is a state variable (e.g., state(DatabaseConnection): FREE, IN_USE(?agent))
- Each workflow stage is a state variable (e.g., state(TaskDecomposition): UNSTARTED, IN_PROGRESS, COMPLETE(?subtask_list))

The planning question ("what subtasks are needed?") and the scheduling question ("when does each agent execute?") can then be answered simultaneously within a unified constraint framework.

## The Hubble Example as a Template

The Hubble Space Telescope scheduling problem is a masterclass in real-world complexity. Tens of thousands of observation requests exceed the mission's lifetime. Satisfying any observation requires: target visibility (a function of orbital geometry), telescope pointing (a continuous slewing and locking process), instrument reconfiguration (complex multi-component state machines), data storage management (finite tape capacity), power constraints (not all instruments can be simultaneously active), and communication windows (two satellite links with different rates).

No classical planner handles this. No classical scheduler handles this. The state-variable model handles it by making all of these concerns first-class properties of the system's state — each with its own timeline, its own value vocabulary, its own compatibility constraints specifying what other states must hold simultaneously.

The lesson: **identify the real state variables of your domain, specify their value transitions completely, specify their mutual dependencies (compatibilities) explicitly, and the planning/scheduling integration follows from the representation.**

## Compatibility Specifications as Causal Justifications

The mechanism that makes the unification work is the *compatibility specification*: for each value a state variable can hold, a specification of what other state variable values must co-occur, precede, or follow. 

The telescope being LOCKED on target 3C267 requires: that 3C267 is VISIBLE (contained-by relation — must hold throughout the locking); that a LOCKING operation on the same target preceded it (after([0,0]) — immediately before); and that either a SLEWING or UNLOCKED state follows (before([0,0])).

This is simultaneously:
- A planning precondition/postcondition specification (what must be true for this state to hold)
- A scheduling constraint (timing relationships between resource usages)
- A causal justification (why this state is valid in this plan)

For agent system design, this suggests: **every agent capability should carry an explicit compatibility specification** — what preconditions must hold in the system state for this capability to be invoked, what postconditions it establishes, and what timing relationships it requires with other capabilities. This is the agent-theoretic equivalent of HSTS's compatibility language.

## Boundary Conditions

This unification approach assumes:
1. The domain can be accurately described by a *finite* set of state variables. If the relevant state space is effectively infinite or continuous in ways that resist discretization, HSTS-style modeling becomes awkward.
2. Compatibility constraints can be specified *in advance* — the domain structure is known. In fully open-ended environments where new types of interactions are discovered dynamically, the static compatibility model breaks down.
3. The number of possible value types per state variable is manageable. Combinatorial explosion in type spaces can make constraint propagation intractable.

For agent orchestration systems, the practical limit is: this approach works best for *structured, recurring domains* where the workflow patterns are known, even if specific instances vary widely.
```

---

### FILE: schedules-as-behavioral-envelopes.md
```markdown
# Schedules as Behavioral Envelopes: Why Flexible Commitment Beats Exact Specification

## The Nominal Trajectory Trap

Classical scheduling produces a *nominal plan*: a complete specification of exactly what happens when. Activity A starts at time 14, uses resource R2, ends at time 19. Activity B starts at time 20, uses resource R1, ends at time 27. Every time slot filled, every resource allocated, every decision made.

This feels like thoroughness. It is actually fragility.

The problem: "During execution, a nominal behavior is interpreted as an ideal trajectory to be followed as closely as possible. However, since the schedule does not explicitly represent feasible alternatives, it is difficult to have a clear picture of the impact of the unavoidable deviations from the desired course of action." (p. 2)

Real execution is never nominal. An observation runs long. A resource becomes temporarily unavailable. A higher-priority task preempts. When any of these occur in a nominal-plan system, the schedule is *wrong* — it no longer describes what will happen — and the system must either replan from scratch (expensive) or stumble forward with a broken plan (dangerous).

## The Envelope Alternative

HSTS advocates a different fundamental concept: **"schedules as envelopes of behavior within which the executor is free to react to unexpected events and still maintain acceptable system performance."** (p. 2)

An envelope is not a single trajectory but a *set of legal trajectories*. Instead of specifying that Activity A starts at time 14, the schedule specifies that Activity A starts between time 10 and 20, and that it starts no less than 5 units after Activity C completes. Any concrete execution that satisfies all such constraints is a legal behavior. The executor chooses which legal behavior to follow at runtime, based on what actually happens.

This is a profound philosophical shift: **the goal of scheduling is not to predict the future but to constrain it — to identify the set of possible futures that are all acceptable.**

## The Mechanism: Temporal Flexibility as a Formal Object

HSTS makes temporal flexibility a first-class citizen of its representation. The Temporal Data Base maintains a *time point network* — a constraint graph where each node is a time point (start or end of some activity) and each arc is a metric interval constraint. Rather than fixing each time point to a specific value, HSTS tracks the *range* of possible values for each time point, consistent with all posted constraints.

This range is the formal representation of flexibility. A time point with range [10, 20] can legally occur at any time in that interval. A time point with range [14, 14] is fully committed. The goal of scheduling is to add constraints until the network is *satisfiable* (there exists at least one consistent assignment) and *safe* (no consistent assignment violates any capacity constraint) — not necessarily until every time point is pinned to a single value.

"Maintaining a time point network encompassing the entire token network... encourages a problem solving style that keeps substantial amounts of temporal flexibility at any stage." (p. 13-14)

The key operations:
- **Value commitment**: pin a time point to a specific value. Reduces search space by one dimension per pinned variable. High precision, low flexibility.
- **Constraint posting**: add a precedence or metric constraint between two time points. Reduces the *feasible range* of both, but does not necessarily eliminate all flexibility. Lower precision, higher flexibility preserved.

HSTS demonstrates both mathematically and experimentally that constraint posting preserves more solution space than value commitment for the same amount of search effort. The concrete argument: two activities competing for a single resource, each with n possible start times. Fix one start time: the other has at most n-1 non-conflicting assignments. Post a precedence constraint instead: the total number of consistent start time assignments is O(n²/2) — dramatically more. "Posting a constraint only restricts the range of the problem variables without necessarily decreasing dimensionality. This has the potential of leaving a greater number of variable assignment possibilities." (p. 21)

## Practical Implications: The Commitment Spectrum

This analysis reveals that commitment is not binary (fixed vs. unfixed) but a *spectrum*:

1. **Unbound** — no constraints on a variable. Maximum flexibility, zero information.
2. **Type-constrained** — the variable is known to belong to some set of possible values. For time, this is a wide interval. For resource assignment, this is a subset of possible resources.
3. **Relationally constrained** — the variable is constrained relative to other variables (A before B, A within [d,D] of C). The exact value is unknown but its relationship to other decisions is fixed.
4. **Exactly committed** — the variable is pinned to a single value.

An intelligent agent should move along this spectrum *as slowly as the problem requires*. Premature commitment (jumping to step 4 before sufficient information exists) is one of the most common failure modes in complex scheduling. It creates artificial conflicts — situations that appear to require backtracking but would not arise if commitment had been deferred.

The HST scheduler exploits this at every level: observations are assigned to *windows* before being assigned to *times*; instruments are sequenced before their detailed reconfiguration is planned; abstract decisions (which observations to attempt) are made before detail decisions (exact reconfiguration sequences) are forced.

## Token Types as Commitment Levels

HSTS operationalizes the commitment spectrum through three token types:

**CONSTRAINT-TOKEN**: represents an indefinite sequence of values from some type set. Maximum flexibility — literally says "something from this set will happen here, I don't know what yet." The starting state of any timeline.

**SEQUENCE-TOKEN**: represents a sequence of values from a constrained type set. Intermediate commitment — the *set* of values is constrained, but their exact ordering and timing within the sequence is free.

**VALUE-TOKEN**: represents a single specific value occurrence. Full commitment at the value level (though the timing may still be flexible — a value token can have unresolved start/end times).

Token insertion — placing a value token into a constraint token's time slot — corresponds to the planning decision of *what* happens in that interval, while leaving *when exactly* it happens still flexible. This decomposition of commitment into independent dimensions (what / when / how long) is a key source of HSTS's efficiency.

## Implications for Agent Orchestration

For a multi-agent orchestration system, behavioral envelopes translate to **execution contracts with built-in slack**:

**Don't over-specify agent invocations.** Instead of "Call the CodeReview agent at step 3, allocate it 30 seconds, expect output format X," specify "Call the CodeReview agent after the StaticAnalysis agent completes and before the SecurityAudit agent starts; allocate it between 20 and 60 seconds depending on file size; accept output format X or Y."

**Represent workflow state as ranges, not points.** A task manager that tracks "step 3 is complete" is less robust than one that tracks "step 3 is complete, and the estimated remaining time for steps 4-7 is between 45 and 90 minutes." The range representation supports better resource allocation and conflict prediction.

**Separate the commitment to invoking an agent from the commitment to how it invokes.** An orchestration system can decide *that* a code review will happen (insert the token) long before it decides *exactly when* and *with what parameters* (pin the time points and argument values). Keeping these decisions separate allows later information to inform earlier commitments without requiring rollback.

**Preserve flexibility in multi-step pipelines.** When designing a sequence of agent invocations, resist the temptation to specify inter-step timing constraints more tightly than the actual domain requires. Each unnecessary tight constraint is a potential source of cascading failure.

## Behavioral Envelope and Robustness

The envelope view has a direct robustness dividend. If execution deviates from the nominal within the envelope, no replanning is needed — the deviation is legal. Only when execution threatens to exit the envelope must the system respond. This creates a natural tiered response:

- **Within envelope**: continue, no action needed
- **Near envelope boundary**: monitor more closely, prepare contingencies
- **Outside envelope**: trigger replanning or fallback procedures

Classical nominal plans have no such tiering. Any deviation is equally "wrong." The envelope provides a formal basis for graceful degradation.

## Boundary Conditions

The behavioral envelope approach has limits:

**Tight deadlines reduce flexibility to zero.** If an activity has a non-negotiable due date and its duration is fully determined, the start time is completely fixed. The envelope collapses to a point. The approach still works but provides no advantage over value commitment in these cases.

**Verifying envelope membership requires constraint satisfaction.** Checking whether a proposed execution is within the envelope means checking whether it satisfies all posted constraints — which can be computationally expensive for large networks. The benefit must outweigh this verification cost.

**Executors must be capable of leveraging flexibility.** An envelope schedule is only useful if the execution system can actually choose among the legal behaviors at runtime. A rigid executor that follows a fixed script will not benefit from temporal flexibility in the plan.

For agent orchestration, the practical implication: design agent interfaces to accept flexible invocation specifications (time windows, parameter ranges) rather than only exact specifications. The planning layer can then exploit flexibility; the execution layer can exploit it too.
```

---

### FILE: state-variable-modeling-for-agents.md
```markdown
# State Variable Modeling: How to Decompose Complex Domains for Intelligent Problem Solving

## Why Decomposition Matters

The fundamental challenge in any complex problem is combinatorial explosion. The Hubble Space Telescope scheduling problem involves tens of thousands of observation requests, six scientific instruments with complex interdependencies, orbital geometry constraints, power budgets, data storage limits, and communication windows. Attempting to reason about this as a monolithic optimization problem is computationally hopeless.

HSTS's solution is not a smarter search algorithm. It is a *better representation* that makes the domain's structure visible, thereby making principled decomposition possible.

"A major obstacle to more integrated and flexible planning and scheduling is the lack of a unified framework. This should support the representation of all aspects of the problem in a way that makes the inherent structure of the domain evident. When dealing with large problems and complex domains, a framework with strong structuring devices facilitates the decomposition of system models and the consequent management of the combinatorics of search." (p. 1-2)

The structuring device is the *state variable*: a property of the system that assumes exactly one value at any point in time, and whose value transitions are explicitly modeled.

## The Anatomy of a State Variable

A well-specified state variable has four components:

**1. Value Vocabulary**: The complete set of possible values the variable can assume. For HSTS's `state(POINTING-DEVICE)`, this is: `UNLOCKED(?T)`, `LOCKING(?T)`, `LOCKED(?T)`, `SLEWING(?T1, ?T2)`. Each value is a predicate with arguments drawn from known domains. The argument domains can be symbolic (target names), component references (instrument identifiers), or numeric (tape capacity in bytes).

The value vocabulary is not arbitrary. It must capture every *meaningfully distinct state* of that system component — states that differ in what causal relationships they participate in, what constraints they impose on other state variables, what transitions they permit. Getting the value vocabulary right is a modeling art; the criterion is that two world situations should share a value if and only if they are interchangeable from the perspective of the rest of the system.

**2. Duration Constraints**: Each value has an intrinsic duration range `[d, D]`. Slewing duration depends on the angle between targets (computable from arguments). Locking has a minimum duration determined by servo dynamics. Being UNLOCKED can persist indefinitely (`[0, ∞]`). Duration constraints encode what the physics or engineering of the system enforces independently of planning decisions.

**3. Compatibility Specifications**: For each value, a specification of what other state variable values must co-occur in temporal relationship to it. This is where the planning knowledge lives. LOCKED(`?T`) requires: VISIBLE(`?T`) to hold throughout (contained-by); a LOCKING(`?T`) operation to have immediately preceded it (after([0,0])); and either a SLEWING or UNLOCKED state to immediately follow (before([0,0])). 

Compatibilities are AND/OR graphs — some conditions are mandatory, others represent alternatives. This allows representing genuine choices (you can go to UNLOCKED or SLEWING after LOCKED) and genuine requirements (you cannot be LOCKED without visibility).

**4. Argument Domains and Binding**: Values can have unbound arguments, representing families of possible values. `SLEWING(?T1, ?T2)` represents the entire family of possible slew operations. As problem solving proceeds and decisions are made, arguments become bound to specific values, tightening duration constraints and enabling more specific compatibility checking.

## Designing State Variables for an Agent System

The state variable framework translates directly to modeling agent system behavior. Consider designing a WinDAG system's state variable decomposition:

**Identify system components**: Each agent type (CodeReviewAgent, SecurityAuditAgent, DatabaseQueryAgent), each shared resource (GPU compute, database connections, external API rate limits), each workflow artifact (task_specification, intermediate_result, final_output) is a candidate system component.

**For each component, define its state variable(s)**:

```
state(CodeReviewAgent) = 
  IDLE                           -- duration: [0, ∞], can persist
  REVIEWING(?file, ?depth)       -- duration: [d(?file.size, ?depth), D(?file.size)]
  AWAITING_CONTEXT(?query)       -- duration: [1, 30], waiting for clarification
  RATE_LIMITED                   -- duration: [60, 300], enforced by external API
  FAILED(?reason)                -- duration: [0, ∞], terminal until recovery
```

**For each value, specify compatibilities**:

```
REVIEWING(?file, ?depth) requires:
  - state(TaskQueue) contains AUTHORIZED(?file) [contained-by]
  - state(GPUResource) has ALLOCATED(?agent) [contained-by] if ?depth = DEEP
  - state(CodeReviewAgent) was IDLE [immediately before]
  - state(CodeReviewAgent) transitions to IDLE or AWAITING_CONTEXT [immediately after]
```

**Key design decisions**:

*Granularity*: State variables should be fine enough that each captures a meaningfully distinct causal role, but not so fine that the state space explodes. `state(WFPC)` (Wide Field/Planetary Camera overall) was found to need subdivision into multiple component state variables because the components had independent failure modes and reconfigurations. Conversely, the two TDRSS communication satellites were represented similarly because their operational differences were minor.

*Argument richness*: Include in value arguments exactly the information needed to determine duration constraints and compatibility conditions. Arguments that are irrelevant to these determinations add complexity without benefit.

*Completeness of value vocabulary*: Missing values create holes in the compatibility graph. If a state variable can be in a state that has no value in the vocabulary, the system cannot reason about that state, and compatibility checking will fail or produce incorrect results.

## Multi-Level Abstraction: Hierarchical State Variables

HSTS supports system models at *multiple levels of abstraction*, with *refinement descriptors* mapping abstract values to networks of detailed values. The HST system uses two levels:

**Abstract level**: One state variable for telescope availability, one per target for visibility. Captures global scheduling concerns (which observations to attempt, in what order) without modeling subsystem internals. Sufficient for generating initial observation sequences.

**Detail level**: One state variable per telescope subsystem (pointing device, each scientific instrument's multiple components, tape recorder, communication system). Captures the full operational complexity needed to generate executable command sequences.

The key property: abstract decisions constrain detail decisions, and detail computation feeds back constraints to the abstract level. When a detail-level reconfiguration turns out to take longer than abstractly estimated, that information propagates up to constrain abstract timing. This bidirectional information flow between abstraction levels is what makes the multi-level approach more than just hierarchical planning.

"At both levels of abstraction the planner/scheduler uses the same decision making cycle." (p. 18)

This is crucial: the same problem-solving framework operates at every abstraction level. There's no separate "planner" at the abstract level and "scheduler" at the detail level — just the same token insertion and compatibility satisfaction mechanism applied to state variables of different granularity.

## Aggregate State Variables: Modeling Shared Pool Resources

For resources that support multiple simultaneous users, HSTS introduces the *aggregate state variable*. Rather than representing a pool of 10 CPU units as 10 separate binary state variables (clumsy), an aggregate state variable represents the pool's collective state as a single entity with values like `{(IN_USE, 7), (IDLE, 3)}`.

Aggregate compatibilities specify capacity increments/decrements: an activity requesting 3 units of compute adds `INC(+3)` to the IN_USE counter and `INC(-3)` to the IDLE counter. Consistency checking verifies that no aggregate value contains a negative counter.

This matters for agent systems because most agent resources are aggregate:
- Parallelism capacity (how many agents can run simultaneously)
- Memory / context window budget (shared across all active agents)
- Rate limits on external APIs (shared across all agent invocations)
- Database connection pools (shared across all data-accessing agents)

Modeling these as aggregate state variables allows the orchestration system to reason about collective resource usage, predict capacity conflicts, and make scheduling decisions that prevent oversubscription — without needing to track each individual resource unit separately.

## Modularity and Additive Scalability: The Empirical Result

The most striking experimental finding in HSTS concerns how computational effort scales with model complexity. The system was tested on three models of increasing complexity: SMALL (pointing + WFPC), MEDIUM (adds FOS instrument), LARGE (adds data communication).

"The results in table 1 indicate that the computational effort is indeed additive." (p. 20)

CPU time per compatibility implementation remains approximately constant across all three models. Total CPU time grows roughly proportionally to model size. This is non-trivial — most combinatorial systems exhibit super-linear (often exponential) growth with problem size. The additive scaling occurs because:

1. **Local interaction structure**: Each subsystem's state variables interact primarily with their immediate neighbors. The pointing system interacts with target visibility and with instrument states; instrument states interact with each other and with power; power interacts with all instruments. But the pointing system does not interact directly with tape recorder state. Heuristics that exploit this local structure scale additively.

2. **Reusable heuristic structure**: Adding FOS (a second scientific instrument) required only minor extensions of WFPC heuristics. The structural similarity between instruments meant that heuristics developed for one transferred to the other. "HSTS made possible the reuse of heuristics and their extension from one model to another." (p. 20)

3. **Framework-enforced modularity**: The state variable decomposition makes module boundaries explicit. Problem-solving for one subsystem's state variables cannot inadvertently tangle with another's unless the compatibility graph explicitly connects them.

For agent system design, this suggests a design principle: **when adding a new agent capability, identify which existing state variables it interacts with, and specify those interactions explicitly in compatibility constraints. If those interactions are analogous to existing interactions, the existing heuristics for managing them should transfer with minor modification.**

## What This Approach Reveals About Expert Knowledge

The state variable decomposition is not mechanically derivable from the domain description. It requires *expert knowledge about what distinctions matter*. The choice to model `state(WFPC)` as multiple component variables rather than a single overall variable reflects expert knowledge that the components can be in different states simultaneously and that these states interact with the rest of the system differently. The choice to include numeric arguments (bytes of tape storage, degrees of telescope slew) reflects expert knowledge that these quantities are causally relevant to durations and feasibility.

This is the deeper lesson: **intelligent systems solve hard problems not primarily through clever algorithms but through knowledge-enriched representations.** The HSTS representation makes the domain's causal structure visible to the problem solver. Once visible, even relatively simple heuristics (greedy sequencing at the abstract level, local synchronization rules at the detail level) produce high-quality solutions.

The implication for agent system design: invest heavily in the quality of the domain model (state variables, value vocabularies, compatibility specifications). A well-modeled domain with simple problem-solving heuristics will outperform a poorly-modeled domain with sophisticated search.
```

---

### FILE: bottleneck-centered-probabilistic-search.md
```markdown
# Bottleneck-Centered Probabilistic Search: How to Focus Attention in Complex Constraint Systems

## The Fundamental Decision Problem in Scheduling

Any scheduling system faces the same meta-level question at each step: *where should I focus my attention?* A job-shop problem with 10 jobs and 5 resources has thousands of variables. Most of them, at any given moment, are not causing trouble. A few are — or will be, if ignored. The quality of the scheduler's attention allocation determines whether it finds solutions quickly or wanders through dead ends.

Classical approaches answered this question with fixed rules: always process activities in order of earliest due date, or most-constrained-first, or shortest processing time. These rules have theoretical justifications but limited adaptability to the specific structure of a given problem instance.

HSTS's Conflict Partition Scheduling (CPS) takes a different approach: **use stochastic simulation to *measure* where the problem is hard, then focus attention there.** Not heuristic rules derived from general principles, but statistics derived from the specific instance being solved right now.

## The Statistical Insight: Simulate to Estimate

The core idea of CPS's Capacity Analysis is both elegant and practical.

Resolving disjunctive capacity constraints is hard — that's the source of scheduling's computational complexity. But *generating* a complete time assignment that satisfies all *non-disjunctive* constraints (temporal precedences, duration bounds) is easy: just dispatch activities forward in time using any consistent assignment rule.

"While it is difficult to complete an intermediate problem solving state into a consistent schedule due to unresolved disjunctive capacity constraints, it is easy to generate total time assignments that satisfy the temporal constraints already in the network." (p. 22)

CPS exploits this asymmetry. It generates N such total time assignments (N=20 proved effective in experiments) by running a stochastic simulation that respects all posted temporal constraints but ignores unresolved capacity constraints. Each simulation produces one specific scenario of when each activity occurs. From N scenarios, two statistics are computed:

**Token demand** A(τ, t): For a given activity token τ and time t, what fraction of the N scenarios place τ's occurrence overlapping time t? High token demand at time t means the current constraints strongly push τ toward executing at time t. Token demand profiles reveal when activities are "naturally clustered" by the existing constraints.

**Resource contention** X(ρ, t): For a given resource ρ and time t, what fraction of the N scenarios produce a capacity violation at time t on resource ρ? High resource contention identifies where capacity conflicts are *most likely* to materialize into actual infeasibility.

These statistics are computable in O(N × |tokens|) time — polynomial and fast. They provide a *probabilistic X-ray* of the scheduling problem's current state, revealing which regions are dangerous without requiring the full combinatorial commitment of actually resolving the conflicts.

## The Bottleneck: Where to Strike First

The bottleneck is formally the resource-time pair (ρ_b, t_b) maximizing resource contention X(ρ, t) across all resources and times. This is the point of maximum estimated danger — where, according to the simulation evidence, a capacity conflict is most likely to emerge.

The conflict set is all tokens that: (a) request resource ρ_b, (b) have time windows overlapping t_b, and (c) are not already sequentially ordered relative to each other. These are the tokens "in competition" for the bottleneck resource at the bottleneck time.

"Relying on the search space metrics, the scheduler focuses by first identifying the portion of the token network with the highest likelihood of capacity conflicts (Bottleneck Detection), and then by determining a set of potentially conflicting tokens within this subnetwork (Conflict Identification)." (p. 23)

## Conflict Partition: Minimum Commitment, Maximum Impact

Once the conflict set is identified, CPS makes its move. But notice what it does *not* do: it does not fully sequence all activities in the conflict set. It does not pick an activity and assign it a specific start time. Both of these approaches would over-commit, reducing future flexibility unnecessarily.

Instead, CPS *partitions* the conflict set into two subsets: T_before and T_after. It constrains every token in T_before to complete before every token in T_after begins. This is a single precedence partition — minimum commitment sufficient to significantly reduce the contention probability at the bottleneck.

The partition is chosen based on the token demand profiles: activities whose demand profiles cluster around earlier times go into T_before; those clustering later go into T_after. The intuition: we're following the grain of what the existing constraints already suggest, adding just enough structure to separate the competing groups.

After partitioning, constraint propagation updates all time point ranges in the network. The next Capacity Analysis step then produces new statistics reflecting the modified constraint structure. Often the bottleneck has moved — a different resource or time interval now shows the highest contention. The process iterates.

This cycle — Analyze, Find Bottleneck, Identify Conflict, Partition, Propagate — continues until resource contention drops to zero everywhere (solution found) or an inconsistency is detected (backtrack and restart with different random simulation outcomes).

## Why This Beats Value Commitment

The experimental comparison is stark. CPS (20, ASAP configuration) solved all 60 benchmark problems. MICRO OPP INTEL BKTRK (the best-performing competitor) also solved all 60, but took 64% more CPU time on average. MIN CONF (min-conflict iterative repair) solved only 24-25 of 60 problems.

The theoretical explanation connects directly to the behavioral envelope principle. Each conflict partition adds one constraint (a precedence relation) that removes some combinations from the feasible set, but leaves the remaining search space as large as possible. Each value commitment removes all combinations involving that variable having a different value — far more destructive to the remaining search space. The simulation-guided partitioning also means each constraint added is chosen based on evidence about where it will do the most good, rather than blindly.

The comparison with MIN CONF reveals something deeper: **good initialization matters more than good repair.** MIN CONF's repair process was sophisticated, but starting from a poor initial assignment meant the repair process spent most of its effort fighting against a bad start. CPS never commits to full assignments during search — it works entirely in the space of partial constraint networks, where the optimization landscape is smoother. "The dependency of the convergence of the repair process from the choice of a 'good' initial solution is still an open problem." (p. 27)

## Stochastic Simulation as a General Search Space Analysis Tool

The stochastic simulation method generalizes beyond scheduling. It is an instance of a broader technique: **use easy-to-generate samples from a relaxed version of a hard problem to estimate properties of the hard problem's solution space.**

The relaxation here: ignore disjunctive capacity constraints, satisfy only temporal constraints. The property estimated: probability of capacity conflict at each resource-time pair.

This technique is applicable whenever:
1. The hard problem has a relaxed version that's easy to sample from (here: temporal-constraint-satisfaction)
2. The property of interest (here: capacity conflict likelihood) can be evaluated on each sample
3. The property is statistically stable across samples (here: contention converges quickly)

For agent orchestration systems, analogous techniques could estimate:
- Probability that a given agent will be a bottleneck for downstream agents (useful for preemptive load balancing)
- Expected time to completion of a complex multi-agent workflow, given current constraint states
- Risk that a given task sequence will exceed a context window or rate limit

The mechanism is always the same: generate N feasible (but not necessarily optimal) completions of the current partial plan. Measure the property of interest on each. Use the aggregate statistics to guide the next planning decision.

## The Sampling Strategy Matters

The experimental results reveal a subtle but important point: the choice of stochastic simulation strategy (variable selection order, value selection distribution) significantly affects CPS performance. CPS (20, ASAP) — using a forward-dispatching variable selection with earliest-time-biased value selection — outperformed CPS (20, UNIF) — using uniform value selection — on several problem classes.

Why? The ASAP strategy samples from a region of the solution space that is richer and more representative of the true constraint structure. The UNIF strategy samples from a narrower region, producing statistics that are less predictive. "The choice of different value selection rules impacts the region of the search space from which sample elements are more likely to be generated." (p. 27)

This is a general principle for simulation-based analysis: **bias your samples toward the region of the search space most likely to contain solutions.** Random sampling over the full feasible space wastes samples on irrelevant regions. Domain-informed sampling (earliest time, most-constrained-first, etc.) focuses samples where the problem's structure matters most.

## Application to Agent System Debugging and Optimization

For an AI agent orchestration system, the CPS approach suggests a concrete methodology for workflow optimization:

**Step 1: Model the workflow as a constraint network.** Each agent invocation is a token with duration bounds and temporal constraints relative to other invocations. Each shared resource (compute, memory, API rate limits) is a resource with capacity bounds.

**Step 2: Run stochastic simulations of workflow completion.** For N trials, sample a complete schedule that respects all temporal constraints (but may violate capacity constraints). Record when each agent runs, what resources it uses.

**Step 3: Compute contention statistics.** Identify the resource-time pairs with highest simulated conflict rates.

**Step 4: Restructure the workflow at the bottleneck.** Add a precedence constraint that sequences the conflicting agents, partitioned by their natural demand clustering.

**Step 5: Propagate and repeat.** Update time bounds throughout the constraint network. Repeat until all contention is resolved.

This methodology is particularly valuable for **workflow design** (before deployment) and **runtime adaptation** (when resource loads shift). The 20-sample simulation is fast enough for real-time use in many agent orchestration contexts.

## Boundary Conditions

CPS's probabilistic approach has specific failure modes:

**When N is too small**, the contention estimates are unreliable. The method assumes statistical regularity — that 20 samples give a good approximation of the true distribution. Problems with highly constrained, narrow solution spaces may require more samples.

**When the sampling strategy is badly misaligned with the solution space**, the estimates are systematically biased. ASAP sampling works well for problems where early completion is naturally favored; for problems with strong late-start preferences, a different sampling strategy would be needed.

**When problems have multiple simultaneous bottlenecks of similar severity**, partitioning one bottleneck may simply transfer the contention to another. CPS's sequential, single-bottleneck focus may be less effective on highly coupled problems. The experimental results confirm this: CPS performed relatively better on problems with single bottlenecks than on two-bottleneck problems (though it still outperformed all competitors).

**For fully deterministic, tightly-constrained problems**, the simulation overhead may not be justified. If the solution space is effectively a single point, stochastic analysis adds cost without benefit. CPS shines on problems with substantial flexibility that needs to be managed — exactly the problems that behavioral envelopes are designed for.
```

---

### FILE: compatibility-constraints-as-causal-knowledge.md
```markdown
# Compatibility Constraints as Causal Knowledge: How Expert Domain Knowledge Enters the System

## The Knowledge Gap in Classical Approaches

One of the deepest problems in artificial intelligence planning has always been the *knowledge acquisition bottleneck*: how does the system know what it knows? Classical planning systems (STRIPS-style) represent operator preconditions and postconditions as lists of logical predicates. Classical scheduling systems represent resource constraints as capacity bounds. Both approaches have a critical limitation: **they lack a rich language for expressing the causal relationships that domain experts actually reason with.**

Domain experts don't think in terms of "this predicate must be true before this action." They think in terms of *patterns of system behavior*: "while the telescope is locked on a target, that target must remain visible throughout; and when we exit the locked state, we either slew to a new target or enter an unlocked holding state." These are *temporal patterns of co-occurrence and succession*, and they are the primary currency of expert knowledge about dynamic systems.

HSTS's compatibility specification language is designed to capture exactly this kind of knowledge.

## The Structure of a Compatibility

A compatibility has the form:

`[temporal-relation <comp-class, state-variable, value-type>]`

This encodes: "while this value is occurring on its state variable, a behavior segment of type `value-type` on state variable `state-variable` must exist, standing in relation `temporal-relation` to the current value."

The temporal relations available include:
- `before([d,D])` / `after([d,D])`: the constraining segment precedes / follows by a duration in `[d,D]`
- `contained-by([d1,D1],[d2,D2])`: the constrained value is nested within the constraining segment, with specified distances from start and end
- `contains([d1,D1],[d2,D2])`: the inverse
- `meets`: zero-gap succession (immediately before / after)
- `equals`: coincident

These correspond to Allen's interval algebra with metric refinements — a rich temporal language that can express essentially any qualitative or quantitative temporal relationship between events.

The `comp-class` distinguishes value compatibilities (the constraining segment is a single value occurrence) from sequence compatibilities (the constraining segment is a contiguous sequence of values from a specified set). Sequence compatibilities are crucial for expressing constraints about *processes* — extended behaviors that may transition through multiple intermediate states.

## The LOCKED Telescope as a Worked Example

The full compatibility specification for `LOCKED(?T)` is:

1. `[contained-by([0,+∞],[0,+∞]) <v, visibility(?T), {VISIBLE}>]` — throughout the entire locked state, target ?T must be visible. This is a safety/physical constraint: you cannot maintain lock on an occluded target.

2. `[after([0,0]) <v, state(POINTING-DEVICE), {LOCKING(?T)}>]` — immediately before the locked state, there must have been a LOCKING operation on the same target. This is a causal constraint: you cannot be locked without having locked.

3. `[before([0,0]) <v, state(POINTING-DEVICE), {SLEWING(?T,?T'), UNLOCKED(?T)}>]` — immediately after the locked state, either a slew begins or the telescope enters an unlocked holding state. This is a transition constraint: locking cannot simply end without explanation.

Each of these captures a different type of expert knowledge:
- (1) is a *resource requirement constraint*: target visibility is a resource that must be "held" throughout the activity
- (2) is a *precondition*: the causal predecessor state that justifies this state
- (3) is a *successor constraint*: legal post-conditions

Together, they constitute a complete causal justification for the LOCKED state. Any occurrence of LOCKED in a valid plan must have all three compatibilities satisfied.

## AND/OR Structure: Representing Alternative Causal Justifications

Compatibility specifications are AND/OR graphs, not just AND lists. This matters because real systems often have multiple valid causal paths to the same state.

For example, the pointing device can reach UNLOCKED via either a completed SLEWING operation or a LOCKING attempt that was aborted. These are two different causal histories, each valid. The OR node in the compatibility graph captures exactly this: compatibility (2) above is part of an OR group with the abort condition.

For agent system design, this AND/OR structure models the fact that the same system state can be reached through multiple valid agent action sequences. A task might be "ready for review" because (a) an automated test suite passed, OR (b) a human developer explicitly marked it ready. Both are valid causal justifications; the compatibility specification captures both.

## Implementing Compatibilities: The Subgoal Sprouting Mechanism

When the planner/scheduler decides to satisfy a compatibility, it performs *compatibility implementation*: finding a behavior segment on the relevant state variable's timeline that matches the type and temporal relation requirements.

If such a segment already exists and is compatible, no new tokens need to be created. The system simply notes the compatibility as satisfied and marks the causal justification tree accordingly.

If no suitable segment exists, a new token is created and inserted into the timeline — this is *subgoal sprouting*, the planning equivalent of identifying a precondition that must be established. The new token itself may have unsatisfied compatibilities, creating a chain of subgoals that must be resolved.

"The process of token creation and insertion corresponds to subgoal sprouting in classical planning." (p. 18)

This mechanism elegantly unifies:
- **Forward planning**: starting from an initial state, creating tokens for planned actions and their effects
- **Backward planning**: starting from a goal state, identifying its compatibility requirements and creating the supporting states
- **Reactive expansion**: during execution of a partial plan, discovering that an intermediate state requires support activities not previously anticipated (e.g., the setup activity for changing a drill bit)

All three modes of planning emergence naturally from compatibility implementation. The planner/scheduler doesn't need separate algorithms for each; the same token insertion and compatibility checking mechanism handles them all.

## Causal Justification Trees: Tracking What Has Been Explained

Each value token maintains a *causal justification tree* — an instance of its value type's compatibility specification, marked to show which compatibilities have been satisfied and which remain open. The root of the tree represents the token's overall justification status; it is marked "achieved" when all mandatory compatibilities are satisfied.

This tracking serves several purposes:

**Goal management**: The planner knows which tokens are still "open" (have unsatisfied compatibilities) and must continue working on them. When a token's justification tree root is marked achieved, it can be removed from the open-goal list.

**Conflict localization**: If the system enters an inconsistent state, the justification tree of each token records exactly which compatibilities are or aren't satisfied, enabling targeted diagnosis of what went wrong.

**Incremental planning**: As new information arrives (e.g., a slew turns out to take longer than estimated), the affected justification trees can be partially re-opened and re-satisfied without rebuilding from scratch.

For agent orchestration, this corresponds to maintaining an explicit *execution dependency graph* that tracks not just which tasks are complete, but *why* each task's outputs are valid — what preconditions were satisfied, what resources were allocated, what agent capabilities were exercised. When something fails, this graph localizes the failure and identifies what must be re-done.

## Type Propagation: Maintaining Consistency Without Full Commitment

HSTS's type propagation mechanism maintains consistency of the timeline without requiring every decision to be made. When a sequence token is inserted covering a portion of a timeline, type propagation narrows the type of every token within that sequence to the intersection of its current type and the sequence token's type. If any intersection is empty, the system is inconsistent.

This is *soft constraint propagation*: it doesn't determine exact values, but it prunes the space of possible values for each token. The effect is that later decisions automatically satisfy the constraints established by earlier decisions — the framework enforces consistency incrementally.

"A limited constraint propagation among token types keeps track of the possible time line refinements in view of the currently inserted value and sequence tokens." (p. 14)

For agent systems, the analog is *information type propagation*: when an agent is invoked with a specific input type, the types of its outputs are narrowed accordingly. When an output feeds into another agent's input, that agent's behavior space is narrowed. This kind of type-level consistency maintenance can be implemented in a workflow DAG to catch type mismatches before execution, and to reason about what information types will be available at each point in the workflow.

## When Compatibility Specifications Are Incomplete

A crucial caveat: compatibility specifications are only as good as the domain model they encode. HSTS-DDL requires the modeler to enumerate *all* possible values for each state variable and *all* compatibility conditions for each value. An incomplete model will silently miss constraints, producing plans that are valid according to the model but invalid in reality.

The HST domain is relatively well-suited to complete specification: physical constraints are deterministic and well-understood. The slewing dynamics are computable from telescope parameters; visibility windows are predictable from orbital mechanics; power constraints are fixed by instrument specifications.

For agent systems operating in open-ended domains (web search, code generation, natural language understanding), complete compatibility specification may be impossible. The approach then degrades to *partial* compatibility specification: known constraints are captured, unknown constraints are left open. The resulting plans are guaranteed consistent with the known constraints but may violate unknown ones. This is still better than having no formal constraint representation — it catches the classes of errors that are known, while flagging that others may exist.

The deeper lesson: **invest effort in making implicit knowledge explicit in compatibility specifications.** Every expert intuition about "you can't do X without first doing Y" or "whenever Z is happening, W must also be happening" is a compatibility waiting to be formalized. The cost is upfront modeling effort; the benefit is systematic prevention of an entire class of planning errors.

## Sequence Compatibilities: Reasoning About Processes

Standard compatibilities constrain single-value occurrences in relation to other single-value occurrences. Sequence compatibilities extend this to *processes* — extended behaviors that may transition through multiple values.

The WFPC example: while the Wide Field detector is in an intermediate reconfiguration state `s(3n)`, the instrument platform `state(WFPC)` must remain "between" states `s(3n)` and `s(4n)` — it can be in any of several intermediate values and may transition among them, but cannot exit the specified range. This is a constraint on a *process* (the platform's evolution during the detector's reconfiguration) rather than on a single state occurrence.

Sequence compatibilities enable HSTS to reason about parallel processes that evolve asynchronously, constrained only by their mutual temporal relationships. This is essential for the HST domain, where multiple subsystems are simultaneously reconfiguring and their states must be coordinated without requiring each subsystem to wait for the others.

For agent systems, sequence compatibilities model *concurrent agent workflows*: while Agent A is executing (potentially transitioning through multiple internal states), Agent B must remain within a specified range of states. This is the formal basis for expressing concurrent execution constraints that go beyond simple "A before B" or "A parallel with B" orderings.
```

---

### FILE: hierarchical-abstraction-in-problem-solving.md
```markdown
# Hierarchical Abstraction in Problem Solving: How to Manage Complexity Through Staged Commitment

## The Core Problem: Complexity and Irrelevant Detail

Complex real-world problems are not monolithically complex. They have *structure*: some aspects of the problem constrain many other aspects (high-level structure), while others affect only local details (low-level details). Attempting to reason about high-level and low-level concerns simultaneously is both wasteful and error-prone — it forces the system to consider detail-level trade-offs before the high-level structure is determined, often generating irrelevant work that must be discarded.

Muscettola's diagnosis: "For HST, the problem size and the variety of constraint interactions suggest that complexity should be managed by staging problem solving. This consists of first making decisions concentrating only on some important aspects of the problem, and then further refining the intermediate solution to include the full range of domain constraints." (p. 17)

The solution: hierarchical abstraction. Build a multi-level model where each level captures the constraints relevant to decisions at that scale, ignoring detail below its resolution. Make decisions at each level sequentially, with higher-level decisions constraining lower-level options.

## HSTS's Two-Level Architecture for HST

The HST system uses precisely two abstraction levels, each serving a distinct problem-solving purpose:

**Abstract level**: Concerned with *which observations to attempt* and *in what approximate order*. State variables: target visibility (one per target), telescope availability. The representation knows nothing about instrument internals, reconfiguration sequences, or power management. The questions it answers: Is target T visible during window W? Can the telescope service observation O before observation P? How many observations can be feasibly scheduled in today's time horizon?

At this level, decisions are fast and cheap. The state space is small (a handful of state variables), the constraints are simple (visibility, ordering, approximate reconfiguration time estimates), and the optimization criterion is clear (maximize the number of accepted observations, or maximize science time).

**Detail level**: Concerned with *exactly how* to execute each observation, coordinating the telescope subsystems into valid command sequences. State variables: one per telescope subsystem (pointing device, WFPC detector, WFPC camera, FOS detectors, tape recorder, communication links). The representation captures full operational complexity — instrument startup sequences, power management, data readout scheduling, communication window utilization.

At this level, decisions are expensive (large state space, many interacting constraints, complex temporal reasoning) but necessary for producing executable plans. Decisions are made only for observations already selected and sequenced at the abstract level.

## Bidirectional Information Flow

The critical distinction between HSTS's hierarchical approach and classical hierarchical planning (like ABSTRIPS) is *bidirectional information flow between levels*.

**Top-down**: The abstract level sequences observations and communicates them to the detail level for expansion. "Preferences on how the goals should be achieved (e.g., 'achieve all goals as soon as possible') are also communicated." (p. 18)

**Bottom-up**: "The detail level communicates back to the abstract level information resulting from detail problem solving; these include additional temporal constraints on abstract observations to more precisely account for the reconfiguration delays." (p. 18-19)

This bottom-up feedback is essential. If the detail level discovers that the reconfiguration between observation O1 and observation O2 takes longer than the abstract-level estimate assumed, that information propagates up to tighten the temporal constraint between O1 and O2 at the abstract level. This may cause the abstract level to revise its sequencing — perhaps swapping the order of two observations to reduce reconfiguration time.

Without bottom-up feedback, the abstract level makes decisions based on simplified models that may be consistently optimistic. Plans that look good abstractly may fail at the detail level. With feedback, the two levels negotiate: the abstract level proposes, the detail level refines and corrects, and the abstract level adapts.

## The Decision-Making Cycle is Level-Independent

A subtle but important structural point: both levels use *exactly the same decision-making cycle*:

1. Goal Selection: select some goal tokens
2. Goal Insertion: insert each selected token into the corresponding state variable time line
3. Compatibility Selection: select an open compatibility for an inserted token
4. Compatibility Implementation: implement the selected compatibility
5. Repeat until no open compatibilities remain

This uniformity is not accidental. It reflects the claim that planning and scheduling are not fundamentally different activities — they are the same activity (consistent behavior construction) applied at different levels of resolution. The same token insertion mechanism, the same compatibility specification language, the same temporal constraint propagation — all work identically at both levels.

For agent system design, this suggests a powerful principle: **design your orchestration framework so that the same coordination mechanisms work at every granularity of the workflow.** A micro-level agent (reviewing a single function) and a macro-level agent (overseeing an entire codebase review) should be coordinated using the same planning primitives. The difference is the level of detail in their state variable models, not the nature of the coordination language.

## Incremental Decomposition: Solving Sub-Problems First, Then Assembling

"In developing the planner/scheduler for the HST domain we followed an incremental approach. We decomposed the problem into smaller sub-problems, we solved each sub-problem separately, and then assembled the sub-solutions." (p. 19)

The three models (SMALL, MEDIUM, LARGE) represent exactly this decomposition strategy:

- SMALL solves the pointing/WFPC sub-problem
- MEDIUM extends SMALL by adding FOS (second instrument) interactions
- LARGE extends MEDIUM by adding data communication interactions

At each step, the existing solution (heuristics, state variable models, constraint specifications) transfers to the new, larger model with *minor modifications*, not wholesale redesign. The WFPC heuristic "prefer not to have WF and PC simultaneously active" is extended to "prefer not to have any two detectors of the same instrument simultaneously active" — a straightforward generalization that covers FOS detectors as well.

The practical implication: **decompose your agent system design into subsystems that can be built and tested independently, then incrementally integrated.** The key success condition: the interactions between subsystems must be explicitly modeled (as compatibility constraints) so that integration requires only specifying those inter-subsystem compatibilities, not redesigning the subsystems themselves.

## When to Use Abstraction and When Not To

Hierarchical abstraction is powerful but not universally appropriate. Several conditions favor it:

**When high-level decisions significantly prune low-level search**: If knowing "we'll attempt observations O1, O2, O3 in that order" eliminates 95% of the detail-level search space, the abstract level has high leverage. The abstract-level investment pays off by avoiding most of the detail-level computation.

**When levels are relatively loosely coupled**: If every high-level decision requires full detail-level verification to evaluate, the abstraction provides no speedup. The benefit comes from levels that are *mostly* independent, with limited interaction.

**When the same structural patterns recur across instances**: If the interactions between WFPC and telescope pointing always follow the same pattern regardless of which specific observations are scheduled, the abstract-level model of those interactions is stable and reusable.

Conditions that undermine hierarchical abstraction:

**When detail-level failures frequently invalidate high-level decisions**: If the abstract level regularly proposes observation sequences that the detail level cannot execute, the bidirectional feedback loop becomes dominated by corrections, and the two-phase approach loses its efficiency advantage.

**When the abstraction is too coarse**: If the abstract level's simplified models are wildly inaccurate (e.g., reconfiguration time estimates are off by a factor of 3), the solutions it generates will require so many corrections that a single-level approach might be faster.

**When the problem has no natural level decomposition**: Some problems are inherently "flat" — there is no meaningful distinction between high-level structure and low-level detail. Forcing an artificial hierarchy on such problems adds complexity without benefit.

## Abstraction in Agent Orchestration: The Task Decomposition Problem

For multi-agent orchestration systems, the hierarchical abstraction principle directly addresses task decomposition:

**Macro-level**: Which agents should be involved? In what approximate order? What are the major information dependencies between them? What are the primary constraints (deadline, resource limits, quality requirements)?

**Meso-level**: How should each agent's invocation be structured? What inputs are required? What are the expected output types? How do agents' outputs flow into each other's inputs?

**Micro-level**: What are the exact prompts, parameters, and configurations for each agent invocation? What are the timeout policies? What are the fallback behaviors if an agent fails?

Each level should be solved in sequence, with lower levels refining higher-level decisions but not overturning them wholesale (or if they must be overturned, doing so efficiently via the feedback mechanism).

The HSTS lesson for agent system design: **build your workflow orchestration system to support multiple levels of description for the same workflow, with explicit mechanisms for propagating information between levels in both directions.** An orchestration agent that can reason about macro-level workflow structure independently of micro-level agent configurations will be far more robust than one that must reason about everything simultaneously.

## Staged Commitment: The Temporal Dimension of Hierarchical Abstraction

Hierarchical abstraction is not just about levels of detail — it is also about *stages of commitment in time*. At the beginning of problem solving, only high-level commitments are made. As problem solving proceeds, lower-level details are committed. This staged commitment strategy prevents irreversible early decisions from unnecessarily constraining later options.

In HSTS, abstract-level tokens (observation sequences) are created before detail-level tokens (reconfiguration sequences). Abstract-level timing constraints are posted before detail-level timing constraints. Each abstract decision creates a *context* that guides detail-level decisions, but does not fully determine them — the detail level retains flexibility to choose among valid implementations of each abstract decision.

This is the operational synthesis of the behavioral envelope principle applied to hierarchical planning: at every level, keep as much flexibility as possible for as long as possible, committing only when the domain structure (through compatibility constraints) or problem requirements (through goal tokens) force commitment.

The result is a system that is simultaneously:
- **Efficient**: It doesn't solve detail problems that the abstract level will later discard
- **Flexible**: It preserves implementation options at the detail level until detail-level information justifies committing
- **Correct**: Every commitment is justified by the domain model, not by arbitrary early decisions
- **Robust**: When unexpected constraints arise at the detail level, the flexible commitment structure allows local repair without global replanning

This four-way virtue — efficiency, flexibility, correctness, robustness — is the deepest practical promise of HSTS's integrated planning and scheduling framework.
```

---

### FILE: failure-modes-in-constraint-based-systems.md
```markdown
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
```

---

### FILE: resource-modeling-spectrum.md
```markdown
# The Resource Modeling Spectrum: From Binary Availability to Complex State Representation

## Why Resource Modeling Is Not Just About Counting

Classical scheduling textbooks define a resource as something that can be in one of two states: available (idle) or in use (occupied). A machine has capacity 1; once one job occupies it, others must wait. This model is sufficient for simple manufacturing scenarios with interchangeable machine states.

It is catastrophically insufficient for the real world.

The Hubble Space Telescope's tape recorder is a resource. But its relevant state is not just "available" or "in use." It also tracks how many bytes are stored, what instrument most recently wrote to it, whether it is currently reading out data, and whether a dump-to-Earth communication is in progress. These state details matter causally: a new read-out can only proceed if the remaining tape capacity exceeds the data to be written; a dump-to-Earth renews capacity but requires a communication window; reading out and dumping simultaneously is forbidden.

Classical scheduling cannot represent any of this. It can tell you "tape recorder is busy" but not *why* it's busy, not *how much* capacity remains, and not *when* it will be free (because that depends on how much data needs to be dumped, which depends on how much was written, which depends on the sequence of observations).

HSTS's state variable approach dissolves this limitation by giving resources the same rich representational treatment as any other system component.

## The Resource Type Taxonomy

HSTS distinguishes resources along three dimensions, yielding a comprehensive taxonomy:

**Single vs. Multiple Capacity**: A single-capacity resource can serve one unit of work at a time. A multiple-capacity resource has a budget of capacity (bytes, watts, connection slots) that can be partially consumed.

**Single vs. Multiple User**: A single-user resource can be occupied by only one activity at a time. A multiple-user resource supports simultaneous use by multiple activities (subject to aggregate capacity constraints).

**Renewable vs. Non-Renewable**: A renewable resource's capacity is restored after use (power from solar cells recharges; tape clears after communication). A non-renewable resource's capacity permanently decreases after use (propellant, food).

The combinations yield distinct modeling requirements:

| Type | Example | Representation |
|------|---------|----------------|
| Single capacity, single user, renewable | Drill machine | Atomic state variable with binary value range |
| Multiple capacity, single user, renewable | Tape recorder | Atomic state variable with numeric capacity argument |
| Multiple capacity, single user, non-renewable | Fuel tank | Atomic state variable, no renewal value |
| Multiple capacity, multiple user, renewable | Airport refueling pool | Aggregate state variable |
| Multiple capacity, multiple user, non-renewable | Food supply | Aggregate state variable, capacity only decreases |

## Atomic State Variables for Single-User Resources

The atomic state variable represents a resource that can be used by at most one activity at a time. Its value at any moment completely describes the resource's relevant state.

The tape recorder example is instructive precisely because it shows how much information can be packed into atomic state variable values:

- `STORED(?C)`: tape recorder idle, storing ?C bytes
- `READ-OUT(?I, ?D, ?C)`: instrument ?I is writing ?D bytes to a tape already holding ?C bytes
- `DUMP-TO-EARTH(?C)`: communicating ?C bytes to Earth, resetting tape to empty

Each value is a complete description of the tape recorder's current operational situation. Duration constraints are bound to the arguments: READ-OUT duration depends on `?D` (data volume) and communication rate; DUMP-TO-EARTH duration depends on `?C` and the available communication link's bandwidth.

Feasibility checking is structural: an insertion of READ-OUT(`?I`, `?D`, `?C`) is infeasible if `?D + ?C > MAX-C` for any assignment of the unbound arguments. This check is automatic from the type system — no special-purpose capacity constraint is needed. The value type's argument domain encodes the capacity constraint.

This is a general principle: **make capacity constraints implicit in value type definitions rather than explicit as separate capacity rules.** When a resource's relevant state is fully captured in its value vocabulary and argument domains, feasibility checking reduces to type consistency checking — a uniform, compositional operation.

## Aggregate State Variables for Multiple-User Resources

The aggregate state variable handles pools of individually indistinguishable resources supporting simultaneous use.

The construction: an aggregate state variable's value is a list of (atomic-value, counter) pairs, summarizing how many atomic resources in the pool are currently in each possible atomic state. For a pool of 10 CPU units, the aggregate value `{(IN_USE, 7), (IDLE, 3)}` means 7 are running jobs and 3 are idle.

Aggregate compatibilities specify capacity increments and decrements:

```
[contains([0,0],[0,0]) <σ, Capacity(POOL), {(OPER, INC(+cj)), (IDLE, INC(-cj))}>]
```

This says: while activity OPj is in progress, the aggregate state variable must simultaneously contain a sequence starting and ending with OPj, in which the OPER count increases by cj and the IDLE count decreases by cj. The aggregate capacity tracking is automatic from the type propagation mechanism.

Consistency checking: compute the aggregate value at each timeline point by summing all active capacity increments/decrements from all overlapping activities. The network is inconsistent when any counter becomes negative (more capacity consumed than available).

The elegant feature: inconsistency from capacity over-subscription can sometimes be resolved *without backtracking*, by inserting additional capacity-generating tokens. In the airport refueling example, if too many planes need refueling simultaneously, the solution might be to bring in additional refueling equipment — a forward planning move rather than a backward repair move. "In case the system model allows the generation of capacity (i.e., contains aggregate compatibilities with INC(-x) entries), inconsistencies can be resolved without backtracking by posting additional compatibilities that provide the missing capacity." (p. 16)

## The Transportation Planning Domain as an Aggregate Resource Case Study

The "bare base" transportation planning domain is a rich illustration of aggregate resource reasoning. The goal: transform a bare runway into a functioning airport. Resources include:

- Refueling capacity (aggregate: number of planes that can be refueled simultaneously)
- Unloading capacity (aggregate: rate at which incoming cargo can be processed)
- Sleeping space (aggregate: number of personnel that can be quartered)
- Airport throughput (aggregate: total arrival/departure rate)

Each resource is represented as an aggregate state variable with capacity that increases as equipment and personnel arrive. The remarkable feature: **resource creation and resource consumption interact**. Bringing in refueling units increases refueling capacity, which allows more planes to arrive, which increases throughput, which allows faster delivery of more refueling units. This is a positive feedback loop — a cascade of capacity amplification.

Classical scheduling cannot represent this. Resources have fixed capacities; they do not generate additional capacity. HSTS's aggregate state variables, with their capacity-generating compatibilities (INC(-x) entries), naturally model this feedback:

```
[contains([0,0],[0,0]) 
  <σ, Capacity(REFUELING), {(AVAILABLE, INC(-1)): on arrival of refueling unit}>]
```

Each arriving refueling unit generates one unit of refueling capacity. The planner can reason about the *sequence* of resource arrivals, optimizing for rapid capacity amplification.

"The arrival of these additional units must be carefully coordinated to avoid chaotic situations and negative consequences on the overall outcome of the mission." (p. 4)

This coordination is exactly what the aggregate state variable representation — with its capacity tracking and compatibility constraints — enables.

## Synchronization and Temporal Flexibility in Resource Allocation

A critical feature of HSTS's resource representation: resource allocations inherit the temporal flexibility of the tokens that request them.

"As with atomic state variables, each transition between time line tokens belongs to the HSTS-TDB time point network. Therefore, the synchronization of the requests for capacity allows a certain degree of flexibility regarding the actual start and end of the use of a resource." (p. 17)

What this means concretely: when activity A requests resource R from time [10, 20] to time [15, 30] (a flexible interval), the resource allocation is also flexible. The resource is not reserved at a specific time; it is reserved *within the window*. Other activities' resource requests can coexist in the same window as long as the aggregate constraints are not violated for any possible assignment of times.

This is more than an optimization nicety. It is what makes the behavioral envelope approach practical for resource-constrained problems. Without flexible resource allocations, any temporal flexibility in the activity network would be immediately consumed by the need to assign fixed time slots to resources. The flexible representation preserves temporal freedom throughout the constraint-posting process.

The tradeoff: "Testing that the requested amount does not exceed available capacity still requires a total ordering of start and end times on the time line." (p. 17)

When you actually need to *verify* that a resource is not over-subscribed at a specific time, you must resolve the temporal flexibility into a specific ordering. This is why CPS's stochastic simulation is necessary — it generates many possible total orderings and checks capacity for each, estimating the *probability* of over-subscription without requiring commitment to a specific ordering.

## Implications for Agent System Resource Modeling

For a WinDAG orchestration system, the resource modeling spectrum has direct implications:

**Model agent capabilities as state variables, not just availability flags.** An agent is not just "available" or "busy." It may be WARMING_UP (loading a model), PROCESSING(?task), RATE_LIMITED, AWAITING_CLARIFICATION, or DEGRADED (running on reduced capacity). Each state has different duration characteristics, different compatibility constraints, and different implications for downstream tasks. Tracking only availability discards information that is often crucial for scheduling.

**Use aggregate state variables for shared computational resources.** GPU memory, API rate limits, database connection pools, and parallel processing capacity are all aggregate resources. Model them with capacity tracking that supports both consumption (each agent invocation) and renewal (API rate limit windows reset, GPU memory is freed after processing).

**Exploit capacity-generation for dynamic scaling.** If your agent system can spawn new agent instances on demand (e.g., cloud compute), model this as capacity generation — a compatibility that increases the aggregate capacity of the relevant agent pool. The orchestration system can then reason about *when* to scale up (before a predicted bottleneck) rather than *after* capacity is exhausted.

**Synchronize resource allocations with workflow flexibility.** When an agent's invocation time is flexible (it can start anytime in a 10-minute window), its resource reservation should be equally flexible. Don't convert temporal flexibility into rigid reservations any earlier than necessary.

## Boundary Conditions: When Simple Resource Models Suffice

The rich resource modeling of HSTS is justified when:

1. **Resource state beyond availability is causally relevant**: The drill-bit example, tape recorder capacity, instrument reconfiguration state. If the only thing that matters about a resource is whether it's busy or free, classical binary availability suffices.

2. **Resource capacity is dynamic (consumable, renewable, or generatable)**: Fixed-capacity, always-renewable resources can be modeled simply. Dynamic capacity requires the richer model.

3. **Multiple activities compete for the same resource in overlapping time windows**: If activities are always strictly sequential on each resource, availability tracking suffices.

For agent systems with simple, fixed-capacity, non-stateful resources (e.g., a web search API with only a rate limit), classical capacity tracking is adequate. The HSTS-level richness is warranted when the resource has meaningful internal state that affects what can be done with it and when.
```

---

### FILE: token-networks-as-executable-knowledge-representation.md
```markdown
# Token Networks as Executable Knowledge Representation: The Architecture of Partial Commitment

## The Problem with Binary Commitment

Most knowledge representation systems offer binary commitment: either you know something (it's in the database) or you don't (it's not). This binary model is inadequate for *constructive problem solving* — the process of building a solution incrementally, where the system knows *some* things definitively, *more* things approximately, and has *not yet decided* about the rest.

Classical planning systems handle this with an "open world" assumption (everything not asserted is unknown) or "closed world" assumption (everything not asserted is false). Neither captures the middle ground where the system knows that *something* will happen in a given time interval (a resource will be used), but doesn't yet know *exactly what* (which activity, at what time, with what parameters).

HSTS's Temporal Data Base addresses this with a three-level token vocabulary that directly represents the spectrum of commitment.

## The Three-Level Token Vocabulary

**CONSTRAINT-TOKEN** — "Something from this set will happen here, but I don't know what yet."

A constraint token `<CONSTRAINT-TOKEN, st-var, type, st, et>` says: during the interval [st, et] on state variable st-var, some sequence of values belonging to the set type will occur. The sequence length is unspecified (possibly empty). The exact values are unknown. The timing boundaries may themselves be flexible.

This is the starting state of every timeline: a single constraint token of unrestricted type covering the entire scheduling horizon. It encodes pure potentiality — the system knows only that the state variable will have *some* value at every time point.

**SEQUENCE-TOKEN** — "A process from this family will happen here, but the exact sequence is undetermined."

A sequence token `<SEQUENCE-TOKEN, st-var, type, st, et>` says: during [st, et], st-var will go through a contiguous sequence of values from type. The ordering of values within the sequence is unspecified; transitions among them are permitted. The overall start and end times may be flexible.

Sequence tokens are used to implement sequence compatibilities — constraints that require a process (extended, multi-phase behavior) to occur in temporal relation to some other value. They capture an intermediate level of commitment: we know a process of a certain character will happen in this interval, but not its exact trajectory.

**VALUE-TOKEN** — "This specific value will hold for this interval."

A value token `<VALUE-TOKEN, st-var, type, st, et>` says: during [st, et], st-var holds a value belonging to type. If type contains a single ground predicate (fully specified value with all arguments bound), this is a definite fact. If type contains a set of possible values (some arguments unbound), this is a partially specified fact that will be refined as argument bindings are determined.

Note: even value tokens can have unbound arguments and flexible time boundaries. A value token does not imply full commitment; it implies commitment to *a value* (as opposed to a sequence or unconstrained behavior).

## Token Insertion: The Fundamental Planning Decision

"Token insertion generalizes reservation of capacity to an activity, the main decision making primitive in classical scheduling." (p. 9)

Inserting a value token into a constraint token's interval is the primary act of planning commitment. It says: "in this region of the timeline, instead of an unconstrained sequence of values, there will specifically be this value for this interval."

The effect: the constraint token is split into three parts — a new constraint token before the insertion, the value token itself, and a new constraint token after. Each flanking constraint token inherits the type of the original (any value from the original set is still possible in those intervals), but the inserted value token pins down the middle section.

This compositional structure is elegant: each insertion refines the timeline locally without disturbing the rest. The timeline always covers the full scheduling horizon (no gaps), always maintains type consistency (each token's type is a valid subset of its state variable's value vocabulary), and always tracks temporal flexibility (through the time point network).

Multiple insertions can overlap in time (within the constraint tokens), provided type consistency is maintained. A sequence token inserted in an interval containing multiple constraint tokens encompasses all of them, narrowing their types to the intersection with the sequence type.

## The Token Network: A Living Partial Plan

The complete set of tokens and their temporal/type constraints is the *token network* — a living representation of the current state of partial plan construction. It is:

**Complete**: it covers the full scheduling horizon for every state variable (through constraint tokens where decisions haven't been made)

**Consistent (or explicitly inconsistent)**: the time point network is always maintained, enabling immediate detection of temporal inconsistencies; type propagation detects type inconsistencies

**Flexible**: temporal flexibility is preserved as wide ranges on time points; type flexibility is preserved as multi-value type sets on tokens

**Progressive**: each planning decision (token insertion, compatibility implementation, argument binding) refines the network toward a fully executable plan without requiring all decisions to be made simultaneously

"A planner/scheduler implemented in HSTS can operate on inconsistent token networks, adding and retracting tokens and constraints with no need to insure consistency at each intermediate step." (p. 15)

This last property is subtle but important. HSTS explicitly supports operating in the space of *inconsistent* partial plans. This is not a bug; it's a feature. Many search methods (including iterative repair approaches) generate complete but inconsistent assignments and repair them incrementally. The token network framework supports this by allowing the inconsistency to be represented precisely (which constraint is violated?) and addressed surgically (remove the conflicting token, adjust the conflicting constraint).

## Causal Justification Trees: From Tokens to Plans

Each value token automatically acquires an instance of its value's compatibility specification — the *causal justification tree*. This tree tracks which compatibilities are still "open" (require supporting tokens that haven't been provided) and which are "achieved" (have been satisfied by existing tokens in the network).

The tree's root is marked "achieved" when all mandatory compatibilities are satisfied. At this point, the token has a complete causal justification — every state it depends on is accounted for, every resource it requires is allocated, every precondition is established.

The planning cycle is simply: find any token whose causal justification tree has open leaves; satisfy one of those leaves (by implementing the compatibility — finding or creating a supporting token); repeat until all justification trees are fully achieved.

This replaces the classical planner's separate goal list, precondition checking, and operator application with a single uniform mechanism: tree traversal and token insertion. The unification is not just conceptual elegance; it enables the framework to simultaneously represent:

- **Goals**: tokens that need to be achieved (inserted into timelines, compatibilities satisfied)
- **Plans**: tokens that have been inserted and justified
- **Constraints**: temporal relations in the time point network
- **Resource allocations**: tokens in resource state variable timelines
- **Causal dependencies**: compatibility links between tokens

All in one data structure.

## Contexts and Alternative Plan States

HSTS supports access to multiple alternative database states through a *context mechanism*. A planner/scheduler can create a context, explore a branch of the search space (making token insertions and constraint postings), and then restore to the previous context to explore an alternative branch.

This is the database analog of a search tree: each node in the tree corresponds to a database context, and branching corresponds to exploring different token insertion decisions. The context mechanism allows:

- **Speculative planning**: try a planning decision, evaluate its consequences, decide whether to commit or backtrack
- **Parallel hypothesis exploration**: maintain multiple alternative plan states simultaneously, comparing their properties before committing to one
- **Focused lookahead**: apply constraint propagation to a restricted subgraph (e.g., a single state variable's timeline) to evaluate consistency without committing to the full global propagation

"To provide a more localized structural analysis of the token network, it is possible to apply temporal propagation to portions of the time point network." (p. 13)

## The Time Point Network as a Global Consistency Enforcer

The time point network maintains all temporal constraints across the entire token network. Each token start and end is a node; each temporal relation between tokens is an arc with metric interval bounds.

Two constraint propagation procedures are available:

**Single-source propagation**: Given a reference point, compute the feasible range of every other time point. Fast; used after each planning decision to update time bounds. Detects inconsistency (any time point's range becomes empty) and updates all ranges to reflect the new constraint.

**All-pairs propagation**: Compute feasible ranges of distances between all pairs of time points. Slower; used for global consistency checking and network minimization (finding tokens whose duration is effectively [0,0] and can be deleted). Also identifies inconsistent distance constraint cycles.

Both procedures are *incremental*: if no constraints are deleted, only the effects of new constraints need to be propagated, not the entire network. This incremental property is essential for practical performance — after each small planning decision, only local time bounds need updating.

The combination of token network and time point network gives HSTS a property rare in planning systems: **the cost of checking a planning decision's feasibility is bounded by the local connectivity of that decision in the constraint graph.** A decision that only affects a few state variables' timelines requires propagation only through those timelines. Decisions about independent subsystems truly are independent.

## Application to Agent System Architecture

The token network architecture maps directly to agent workflow representation:

**Each agent invocation is a value token** with:
- State variable: the capability being exercised (e.g., state(CodeReviewCapability))
- Type: the specific operation being performed (e.g., REVIEWING(?file, ?criteria))
- Time bounds: flexible interval within which the invocation should start and end
- Causal justification tree: the compatibilities it satisfies (what inputs it needs, what outputs it produces)

**Each workflow dependency is a temporal constraint** in the time point network:
- "Agent B's input becomes available only after Agent A completes" → before([0,0]) constraint between A's end time and B's start time
- "Agent B must receive A's output within 5 minutes" → before([0,300]) constraint

**Each shared resource is a resource state variable** with capacity constraints enforced through aggregate state variable consistency checking.

**Constraint tokens represent unspecified workflow segments**: "at some point during this phase, a validation step will occur" — without specifying exactly when or by which agent. This is the natural representation for workflow stages whose details depend on dynamic context.

The resulting architecture supports exactly what a sophisticated agent orchestration system needs:
- **Gradual commitment**: specify high-level workflow structure first, fill in details as agents execute and provide information
- **Flexible timing**: represent timing constraints as ranges, not exact times, supporting parallel execution and temporal slack
- **Causal tracking**: maintain explicit records of why each agent is being invoked and what it's expected to produce
- **Inconsistency detection**: immediately flag when a workflow becomes infeasible given current constraints, localizing the source of infeasibility

This is a more powerful architecture than a simple DAG of agent invocations. The DAG represents a nominal plan; the token network represents a behavioral envelope.

## The Art of Constraint Propagation Scope

A subtle but important design choice: HSTS's propagation procedures deliberately limit their scope. They detect inconsistencies and compute feasible ranges, but do not automatically attempt recovery. The planner/scheduler must decide what to do when inconsistency is detected.

"No attempt is made to automatically recover to a consistent state. The problem solver must take full responsibility of the recovery process." (p. 15)

This design respects domain-specific recovery knowledge. The right response to "tape recorder over-subscribed" is not the same as the right response to "pointing device can't reach this target during this visibility window." One might require rescheduling an observation; the other might require rejecting an observation entirely or extending the planning horizon.

For agent systems, this principle translates: **don't build automatic failure recovery into the orchestration infrastructure.** When a constraint violation is detected (agent A's output is unavailable when Agent B needs it), surface the violation clearly and let the domain-specific recovery logic (whether rule-based or another agent) decide the appropriate response. The infrastructure's job is to detect and localize failures precisely; the domain logic's job is to resolve them appropriately.
```

---

### FILE: incremental-heuristics-and-the-scalability-condition.md
```markdown
# Incremental Heuristics and the Scalability Condition: Building Systems That Grow Without Exploding

## The Scalability Problem

Complex real-world systems are large. The Hubble Space Telescope involves dozens of subsystems, hundreds of possible configurations, thousands of temporal constraints, and tens of thousands of scheduling requests per year. Any problem-solving framework must address a fundamental question: as the domain model grows larger and more complex, what happens to computational effort?

For classical combinatorial approaches, the answer is typically: computational effort grows exponentially with problem size. This is not just a performance concern; it is a feasibility concern. A system that takes 10 seconds to plan for 5 components and 10,000 seconds to plan for 10 components is not a system that can be deployed in practice.

Muscettola makes scalability a first-class design criterion: "a modular and scalable framework should display the following two features: (1) the search procedure for the entire problem should be assembled by combining heuristics independently developed for each sub-problem, with little or no modification of the heuristics; (2) the computational effort needed to solve the complete problem should not increase with respect to the sum of the efforts needed to solve each component sub-problem." (p. 19-20)

Feature (2) — additive scalability — is a remarkably strong requirement. Most systems are satisfied with polynomial growth. Muscettola demands *