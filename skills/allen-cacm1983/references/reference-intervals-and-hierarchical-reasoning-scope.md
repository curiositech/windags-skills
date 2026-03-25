# Reference Intervals: Controlling the Scope of Reasoning Through Hierarchical Context

## The Scalability Problem

Constraint propagation is powerful, but naive: it propagates consequences everywhere. In a system with N temporal intervals, every new fact potentially affects every other pair of intervals. For large knowledge bases — a full history of a system's operation, the temporal structure of a complex process — this O(N²) worst case becomes prohibitive.

More fundamentally, full propagation is *cognitively wrong*. When reasoning about what happened today, an agent should not need to revisit constraints about what happened last year. The irrelevance of temporally distant facts is not just a performance concern — it reflects genuine structure in how temporal knowledge is organized. Allen's concept of **reference intervals** captures this structure formally.

## What a Reference Interval Is

A reference interval is simply an interval that other intervals are declared to belong to. When interval I1 has reference interval R, it means: "I1 is within the temporal scope of R." The system maintains full pairwise constraint information between all intervals within the same reference interval (same "cluster"), but does *not* automatically propagate constraints across clusters.

Formally, the comparability predicate governs this:

```
Comparable(K, J) is true iff:
  1. K and J share at least one reference interval, OR
  2. K is a reference interval of J, OR
  3. J is a reference interval of K
```

When adding a new fact, constraint propagation only fires along edges where both endpoints are comparable. This restricts the propagation to the relevant local cluster, with inter-cluster inference deferred until explicitly requested.

Allen writes: "If one is concerned with what is true 'today,' one need consider only those intervals that are during 'today,' or above 'today' in the during hierarchy. If a fact is indexed by an interval wholly contained by an interval representing 'yesterday,' then it cannot affect what is true now."

## The Hierarchy Structure

Reference intervals can themselves have reference intervals, creating a tree-like hierarchy. This mirrors the natural temporal structure of most domains:

**Historical/biographical structure**: A life has phases (preschool, school, career, retirement). School has sub-phases (primary, secondary, university). Each sub-phase contains specific events. Events within primary school are fully related to each other; their relationship to events in university is computed on-demand by traversing the hierarchy.

**Process/action structure**: A complex process P has subprocesses P1, P2, P3. Each subprocess may have further decomposition. The hierarchy mirrors the process decomposition hierarchy. Allen notes: "Such a decomposition is not described in absolute temporal terms (i.e., using dates), but by the subprocess's relation to its containing process. Thus a natural reference hierarchy can be constructed mirroring the process hierarchy."

**Present-moment structure**: NOW is not a single interval but a nested set of intervals: this-moment, this-hour, today, this-week, this-year. Each nests within the next. When NOW advances by a minute, only the innermost intervals need updating. When a day boundary is crossed, the next level up is affected. The reference hierarchy "protects" outer levels from inner-level turbulence.

## On-Demand Retrieval Through the Hierarchy

When an agent needs the relationship between two intervals that are in different clusters (and thus not directly connected in the network), the system finds a path through the reference hierarchy and applies transitivity along the path:

```
Find-Paths(I, J):
  Search for paths of the form:
  I → [up through reference intervals] → shared ancestor → [down through reference intervals] → J
  
Constrain-along-path(path):
  Apply transitivity table sequentially along the path edges
```

For a well-structured tree hierarchy, this path is unique (or nearly so), and the computation is efficient. The cost is bounded by the depth of the hierarchy times the width of the transitivity table, rather than the square of the total number of intervals.

The key tradeoff Allen identifies: **a more tree-like reference hierarchy means more efficient retrieval but potentially less precise results**. When paths must wind through multiple reference intervals, each step may introduce additional uncertainty (the transitivity table often returns larger sets than the input). A flatter, more fully-connected network gives exact results faster per query, at the cost of more expensive updates.

## When the Hierarchy Breaks: Cross-Cluster Interactions

The reference hierarchy model assumes that interesting temporal interactions happen *within* clusters, not between them. But complex systems violate this assumption when subprocess interactions span process boundaries.

Allen's worked example (Section 5.2): Process Q has subprocess Q2, and Process P has subprocess P1. If we learn that Q2 overlaps P1, this has implications for the relationship between Q and P as a whole. But if Q and P are in separate clusters, this inference won't fire automatically.

The solution Allen proposes: **dynamically expand a node's reference interval list** when cross-cluster facts are asserted. Adding P to Q2's reference interval list temporarily bridges the clusters, allowing the inference to propagate. But Allen cautions: "Manipulating the reference hierarchies as in this example can be effective if used sparingly. With overuse, such tricks tend to 'flatten out' the reference hierarchy as more intervals become explicitly related."

This is a precise statement of a general system design principle: **hierarchical decomposition works until you have too many cross-cutting dependencies**. When cross-cutting interactions are rare, the hierarchy is efficient and precise. When they are common, the hierarchy collapses into a flat network, and you've paid the overhead of maintaining the hierarchy for nothing.

For agent systems, this suggests: **design task decompositions so that most inter-agent communication is hierarchical (parent to child, child to parent), not lateral (sibling to sibling across different subtrees)**. Lateral dependencies are the temporal equivalent of cross-cluster facts — they undermine the efficiency of the hierarchy.

## The Present Moment as a Special Case

Allen's treatment of NOW is particularly elegant. The present moment is modeled as a variable bound to the innermost interval in a NOW hierarchy. When time advances slightly, a new interval is created within the same reference interval and declared to be "after" the previous NOW. The reference interval absorbs this change; nothing outside the reference interval is disturbed.

When a reference boundary is crossed (e.g., midnight — NOW is no longer "during today"), the reference interval itself is updated, but its parent reference intervals (this-week, this-year) are unaffected. The hierarchy ensures that a minor perturbation of NOW has local effect; only a major boundary crossing has wider effect.

Allen notes: "While many intervals will be generated by this succession of intervals for NOW, many of them can be garbage collected when the reference intervals are updated. In particular, any interval that is not used to index any events or facts may be removed from the database."

This is a model for how agent systems should handle streaming temporal data — not by maintaining a continuously updated timestamp, but by maintaining a **nested set of temporal contexts**, where the innermost context updates frequently and cheaply, and outer contexts update rarely and more expensively.

## Application to Agent Task Orchestration

A WinDAGs orchestration system involves tasks at multiple levels: the overall workflow, major phases, individual agent steps, individual tool calls. This is precisely a process hierarchy, and Allen's reference interval framework maps directly onto it.

**Each task level is a reference interval for the level below it.** The workflow is the outermost reference interval. Major phases are reference intervals for individual agent steps. Individual steps are reference intervals for tool calls.

**Temporal facts are stored at the appropriate level.** "Task A completes before Task B starts" is a fact at the phase level. "Tool call X overlaps tool call Y" is a fact at the step level. The hierarchy ensures that reasoning about phase ordering doesn't get tangled with reasoning about tool-call ordering.

**Cross-level interactions are the exception.** Sometimes a tool call result has implications for the ordering of a different phase — this is the cross-cluster interaction. The system should handle this by explicitly promoting the relevant constraint to the appropriate level in the hierarchy, rather than letting it propagate implicitly.

**Querying temporal context.** When an agent needs to know whether it is operating "during" the right phase, or whether its output might still be relevant to a downstream task, it queries the reference hierarchy. The answer is computed on-demand by traversing the hierarchy, not by maintaining all pairwise constraints globally.

## Grain of Reasoning

One of Allen's key design requirements (Section 2) is that "the representation should allow one to vary the grain of reasoning." A historian might treat days as instants; a chip designer treats nanoseconds as extended intervals. The reference hierarchy is the mechanism for implementing variable grain.

Allen writes: "The interval size, where it is appropriate to simplify reasoning by assuming point-like times, varies with the reasoning task." This is implemented implicitly: by making the reference interval for a given cluster correspond to a time unit (HOUR, DAY, YEAR), all intervals within that cluster are automatically interpreted at that grain.

For agent systems: different agents may need to reason at different temporal grains. A monitoring agent cares about millisecond-level event ordering; a planning agent cares about task-level ordering spanning hours. The reference hierarchy can serve both simultaneously, with each agent querying at its appropriate level of the hierarchy.