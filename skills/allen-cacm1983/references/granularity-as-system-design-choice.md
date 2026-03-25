# Granularity as a System Design Choice: How Resolution Affects What Can Be Known and Computed

## The Granularity Observation

Among Allen's several insights, one of the most practical and broadly applicable is his observation about temporal grain: "a historian may be happy to consider days as points, whereas the computer engineer reasoning about a logic circuit would consider a day to be an eternity. Thus the interval size, where it is appropriate to simplify reasoning by assuming point-like times, varies with the reasoning task" (p. 841).

This seems obvious when stated plainly, but its implications are non-trivial and frequently violated in practice. The granularity at which you represent time (or any domain quantity) is not a fact about the world — it is a *design choice* about what level of detail is meaningful for your purposes. Making the wrong choice creates systems that are either too precise (storing detail they don't have and can't use) or too coarse (losing information that matters for the task).

## The Mathematician's View: Points as Very Small Intervals

Allen's theoretical treatment of this is elegant. He does not simply say "some applications use coarser or finer time scales." He says: **time points do not exist as mathematical objects; they are a convenient fiction that should be understood as "intervals smaller than the minimum meaningful duration for this task."**

The minimum meaningful duration — call it ε — is task-dependent. For a historian, ε might be a day. For a chemist, ε might be a millisecond. For a hardware engineer, ε might be a nanosecond. Below ε, two events are treated as simultaneous — their exact ordering doesn't matter for the reasoning task at hand.

This has a nice formal consequence: if you fix ε, then any two "points" (very small intervals) are either equal (both within ε of each other) or strictly ordered (separated by more than ε). The messy intermediate case — they are strictly distinct but we can't determine their order — doesn't arise for events smaller than ε. This is why point-based reasoning is sometimes appropriate: when you have chosen a coarse enough ε that sub-ε ordering doesn't matter.

The lesson: **points are not a different kind of object from intervals. They are a special case of intervals used when the reasoning grain is coarser than the actual duration of the events**. Represent them as intervals and let the grain be a parameter, not a fixed assumption.

## Grain Hierarchy and Reference Intervals

Allen's reference interval mechanism provides a concrete way to implement multi-grain representation. The hierarchy of reference intervals can be structured to reflect different temporal granularities:

- The day-level reference interval YESTERDAY contains hour-level reference intervals MORNING, AFTERNOON, EVENING
- Each hour-level reference interval contains minute-level intervals
- Each minute-level interval contains second-level intervals

Facts can be asserted at any level of granularity. "I was at home yesterday" is asserted at the YESTERDAY level. "The meeting was in the morning" is asserted at the MORNING level. "The alarm went off at 9:15" is asserted at a minute-level interval.

Queries can also be made at any level. "Was I at home during the morning?" — the system searches the reference hierarchy: was MORNING during YESTERDAY? Yes. Was I at home during YESTERDAY? Yes. Therefore I was at home during MORNING (by the "during" inheritance principle).

This multi-grain query and assertion is not possible with a flat timestamp database. Everything must be asserted at the same precision, and queries at coarser granularities require aggregation operations that are more expensive than the hierarchical lookup.

## Implicit Grain Choices and Their Failure Modes

Most systems make implicit grain choices that they never examine. Common failure modes:

**Too fine a grain**: A system stores every event with millisecond timestamps. Queries asking "what happened this morning?" must aggregate over thousands of timestamped records. Memory and compute are consumed by precision that wasn't needed. Worse: if the clock was slightly wrong at some events, comparisons between events produce spurious orderings (A appears to be 50ms before B, but both happened "at the same time" at the level of granularity that matters).

**Too coarse a grain**: A system stores events with day-granularity timestamps. Queries asking "did A happen before B on the same day?" cannot be answered — the ordering within a day has been discarded. Plans that require intra-day ordering (deploy after the database migration completes, both on Tuesday) cannot be verified.

**Mixed grains without translation**: A system has some events at millisecond precision and others at day precision. Comparing them produces nonsensical results: a millisecond-stamped event from Tuesday at 00:00:001 appears to be before a day-stamped event on Tuesday, even though the latter might mean "any time on Tuesday."

**Grain mismatch between producer and consumer**: The system that generates timestamps uses one clock; the system that queries uses another. Small synchronization errors produce spurious before/after relationships at fine granularity.

Allen's framework sidesteps all of these by making grain *explicit* in the representation. The reference interval hierarchy encodes the grain structure. You can assert at any grain and query at any grain, and the hierarchy mediates between them correctly.

## Application to Agent Systems: Choosing the Right Resolution

For intelligent agent systems, grain choices arise in every domain that involves time, quantities, or ordered entities.

**Temporal grain for task scheduling**: What is the minimum meaningful time unit for your task system? If tasks are typically measured in hours, minute-level timestamps add noise. If tasks can have sub-second dependencies, hour-level timestamps are insufficient. Design your temporal representation around the granularity that matches your task structure.

**Code change granularity**: When tracking code modifications, what is the unit — a character, a line, a function, a file, a module, a commit? Different tasks need different granularities: a merge tool needs line-level granularity; an architecture review needs module-level granularity; a deployment system needs commit-level granularity. Allen's hierarchy suggests: store changes at the finest needed granularity, and build reference intervals that aggregate to coarser granularities for coarser queries.

**Agent capability granularity**: When planning which agent should handle which subtask, what is the unit of capability? Individual functions? Groups of related functions? Entire domains? The grain should match the precision at which task-capability matching is meaningful.

**Confidence granularity**: When an agent reports a confidence level, at what precision is that confidence meaningful? "87.3% confident" is false precision if the underlying data only supports "fairly confident" distinctions. Using a coarser representation (very high / high / medium / low / very low) is more honest and computationally cheaper.

The design principle: **choose the coarsest representation that does not lose information necessary for the task, and use hierarchical structure to support multiple granularities simultaneously**. Don't pay for precision you don't have and don't need.

## Context-Dependent Simplification

Allen's grain principle suggests a general optimization: **within any reasoning context, determine the minimum ε for that context, and treat all intervals smaller than ε as simultaneous**. This simplification is correct for the context and can dramatically reduce the number of ordering relationships that need to be tracked.

For example, in a planning context where tasks take at least 10 minutes, sub-minute event ordering is irrelevant. All events within the same minute can be treated as simultaneous (equal intervals in Allen's algebra). This reduces the number of "before" relationships to track and simplifies the constraint network.

This context-dependent simplification is not permanent — if a finer-grain context is entered (a debugging session that examines sub-minute behavior), the simplification is temporarily suspended and finer-grain intervals are introduced. The reference interval hierarchy enables this: the coarser reference intervals remain, and finer sub-intervals are added within them for the duration of the fine-grain analysis.

## Duration Reasoning as a Separate Dimension

Allen's extension to duration reasoning is a distinct but related example of grain thinking. Duration relationships ("A lasted longer than B," "C took about 3 times as long as D") are a different dimension of temporal knowledge from ordering relationships. They can be represented and propagated orthogonally.

The duration propagation algorithm is structurally identical to the ordering propagation algorithm, but uses multiplicative ranges instead of the 13-element relation set. The two systems interact: if I is during J (ordering), then dur(I) < dur(J) (duration). A constraint tightened in one network can propagate to tighten constraints in the other.

For agent systems, this orthogonality is useful. A task scheduling system might know ordering constraints (A before B) without knowing duration constraints (how long A or B takes). Duration constraints may be learned separately (from historical execution data, from user estimates, from resource models). Maintaining them in a separate but interacting constraint network keeps them conceptually distinct while allowing their mutual implications to propagate.

The general lesson: **when multiple dimensions of a domain can be represented relationally, maintain separate constraint networks for each dimension, with defined interaction rules between them**. Don't conflate ordering and duration into a single representation; they are different kinds of knowledge that happen to interact.