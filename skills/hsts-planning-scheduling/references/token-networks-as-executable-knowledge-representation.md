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