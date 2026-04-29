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