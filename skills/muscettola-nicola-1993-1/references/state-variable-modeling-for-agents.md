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