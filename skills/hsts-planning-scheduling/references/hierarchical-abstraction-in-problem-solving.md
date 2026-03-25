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