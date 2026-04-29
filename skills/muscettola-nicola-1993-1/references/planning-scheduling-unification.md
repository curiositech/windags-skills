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