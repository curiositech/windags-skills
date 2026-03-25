# Grain of Reasoning: How Context Determines the Right Level of Temporal Abstraction

## The Problem of Multiple Temporal Scales

Any sufficiently complex domain involves events at multiple temporal scales simultaneously. A distributed software system has events at the nanosecond scale (CPU operations), microsecond scale (network packets), millisecond scale (database queries), second scale (HTTP requests), minute scale (user sessions), hour scale (deployment windows), and day scale (releases). A historian studying the same system's evolution thinks in quarters and years.

These different actors — the performance engineer, the reliability engineer, the database administrator, the product manager, the historian — all need to reason temporally about the same system, but at radically different grains. A system that forces everyone to work at a single grain either buries high-level users in irrelevant detail or deprives low-level users of necessary precision.

Allen addresses this directly in Section 6: "A historian, for instance, may be happy to consider days as points, whereas the computer engineer, when reasoning about a logic circuit, would consider a day to be an eternity. Thus the interval size, where it is appropriate to simplify reasoning by assuming point-like times, varies with the reasoning task."

## Grain is Relative, Not Absolute

The crucial insight is that **grain is a property of the reasoning task, not of the events themselves**. An event does not have an intrinsic temporal scale. What determines scale is the ratio between the event's duration and the duration of the intervals being reasoned about.

Allen handles this through the interval algebra itself: the 13 relations are scale-free. Whether interval A `during` interval B refers to a millisecond within a second or a day within a year is irrelevant to the relation itself and the propagation rules. The algebra operates the same way at any scale.

But the *practical* handling of scale is through the reference interval hierarchy. By choosing reference intervals that correspond to temporal units appropriate for a reasoning task (HOUR, DAY, YEAR for planning; NANOSECOND, MICROSECOND for performance analysis), the system naturally groups facts at the appropriate grain. Cross-grain queries require traversing the hierarchy — and some precision may be lost in the traversal, which is exactly what should happen when going between levels.

## Treating Small Intervals as Points

Allen introduces an elegant approximation: intervals much shorter than the grain of interest can be treated as points. "An informal notion of time points as very small intervals, however, can be useful." The formalization is simple: declare a minimum granularity ε for a given reasoning context. Any interval shorter than ε is treated as a point — it can only be `before`, `meets`, or `after` other intervals, never `overlapping`, `during`, or `containing` them.

This is a controlled loss of precision. The system "forgets" the internal structure of very short intervals, treating them as structureless instants. The advantage is computational: with fewer possible relations (3 instead of 13), the transitivity table is simpler and propagation is faster. The disadvantage is that if the approximation is wrong — if two "point-like" events actually do overlap in ways that matter — the reasoning will be incorrect.

The grain ε must be set explicitly, and it must be appropriate for the task. There is no universal ε. This is a design decision that must be made by the system designer or (for adaptive systems) by the agent assessing the reasoning task at hand.

## Hierarchical Grain Through Reference Intervals

The reference interval hierarchy provides a natural mechanism for multi-grain reasoning. Consider a hierarchy:

```
YEAR
  └── QUARTER (reference interval within YEAR)
        └── MONTH (reference interval within QUARTER)
              └── DAY (reference interval within MONTH)
                    └── HOUR (reference interval within DAY)
                          └── MINUTE (reference interval within HOUR)
```

Facts at each grain are stored with their appropriate reference intervals. A deployment happens within a specific MONTH. An HTTP request happens within a specific MINUTE. These facts coexist in the same system but are organized into appropriate clusters.

Reasoning at the MONTH grain: query relationships between deployments. The system computes via the hierarchy, ignoring HTTP request intervals entirely.

Reasoning at the MINUTE grain: query relationships between HTTP requests. The system works within HOUR clusters, ignoring MONTH-level facts.

Cross-grain reasoning: when a deployment (MONTH-level fact) caused an HTTP error pattern (MINUTE-level fact), the system must traverse from one grain to another. This traversal is explicit, via the reference hierarchy path search, and the result may be imprecise (multiple possible relations at the coarser grain). This imprecision is correct — you genuinely lose information when abstracting from minutes to months.

## Implications for Agent Task Decomposition

When a WinDAGs orchestration system decomposes a complex task into subtasks, it is implicitly creating a temporal hierarchy: the overall task's interval contains all subtask intervals. The reference interval hierarchy should mirror this:

**Workflow level**: The temporal context of the entire job. Agents reason about task ordering at this level.

**Phase level**: Major phases of the workflow (data collection, analysis, synthesis, output). Agents plan phase sequencing here.

**Task level**: Individual agent tasks within phases. Agents coordinate task-level parallelism and dependencies here.

**Step level**: Individual tool calls or operations within a task. Agents manage low-level execution ordering here.

Each level is a reference interval for the level below. Facts about task ordering (Task A before Task B) live at the task level. Facts about step ordering (API call X before database query Y) live at the step level. The system tracks these facts at their appropriate grain without conflating them.

When an event at the step level has implications for the phase level (a tool call failure affects phase completion), this is a cross-grain interaction — the equivalent of Allen's cross-cluster interaction. The system handles it by traversing the reference hierarchy and asserting the consequence at the appropriate higher level.

## Grain and the Problem of "Simultaneously"

A particularly important case for multi-agent systems is the concept of simultaneity. In a single-threaded system, events are totally ordered and there is no ambiguity. In a multi-agent system, events on different agents happen concurrently, and their relative ordering may be undefined.

At fine grain, two events that appear to overlap may actually be sequential when examined more closely. At coarse grain, two events that are clearly sequential may appear simultaneous (both happening "this week"). The same pair of events may have different temporal relationships at different grains.

Allen's algebra handles this naturally: at one reference interval level, two events may have relation `{<, m, o, d, s, f, =}` (many possibilities, including overlap). At a coarser level, they may resolve to simply `d` (both are during the same larger interval). At a finer level, they may resolve to `<` (one clearly precedes the other).

The **appropriate grain for a given question determines the appropriate answer**. An agent asking "did Task A happen before Task B?" at the task-scheduler level should get an answer at that grain. An agent asking "did step X within Task A happen before step Y within Task B?" is asking at a finer grain and should get a more precise answer — or an acknowledgment that the answer is not resolvable at that grain.

## Grain-Appropriate Precision in Agent Responses

A practical implication: agents should label their temporal claims with their grain of reasoning. "Task A completed before Task B" at the workflow level may coexist with "Step A.7 overlaps step B.3" at the step level — both are true, at their respective grains, and neither contradicts the other.

Without grain labeling, these claims appear contradictory. With grain labeling, they are consistent and both informative. Allen's reference interval hierarchy provides the natural mechanism for this labeling: a fact's grain is determined by its reference interval's position in the hierarchy.

For agent systems: when an agent asserts a temporal fact, it should declare the reference interval (or at least the grain level) at which the fact is asserted. Orchestration systems can then route queries to the appropriate grain, combine facts at compatible grains, and explicitly handle cross-grain inferences with appropriate precision loss.

## When Grain Mismatch Causes Failures

The most common temporal reasoning failure in complex systems is **grain mismatch**: reasoning about a relationship that exists at one grain using evidence gathered at a different grain. Examples:

**Performance debugging**: An engineer sees that service A was "slow yesterday" (day grain) and service B "had high latency this morning" (hour grain). Are these related? At day grain, they both happened "yesterday" — they appear simultaneous. At hour grain, they might be clearly separated. Concluding that they're related based on day-grain reasoning while the actual relationship only makes sense at hour grain is a grain mismatch error.

**Incident analysis**: A post-mortem concludes that "the deployment caused the outage" because both happened "in Q3." At quarterly grain, they're simultaneous. At hourly grain, the deployment started 47 hours after the outage began — the causal relationship is reversed. The quarterly grain reasoning was wrong.

**Planning**: An orchestration system plans tasks at the day level. Two tasks are planned for "the same day" (day grain: they're concurrent). At the hour level, one must complete before the other can start. The day-level planning missed a critical sequencing constraint.

Allen's framework prevents these errors by enforcing that temporal relationships be stored and reasoned about at the appropriate grain. Cross-grain inferences are explicit (via the hierarchy traversal) and marked as potentially imprecise. The system cannot silently conflate a day-grain fact with an hour-grain query.

## The Deepest Lesson

Grain of reasoning is not just a performance optimization — it is an epistemological reality. The same events, viewed at different temporal scales, exhibit different relationships. A framework that pretends there is a single "correct" temporal scale at which all facts should be represented is epistemologically naive. Allen's algebra, with its reference interval hierarchy, is one of the few formalisms that takes temporal scale seriously as a first-class concern rather than an afterthought.

For agent systems reasoning across temporal scales — which all sufficiently complex agent systems must do — this is not optional sophistication. It is fundamental correctness.