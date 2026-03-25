# Reference Intervals as Hierarchical Locality Control: How to Bound Inference Without Losing It

## The Space Problem

Allen's constraint propagation algorithm is elegant and polynomial in time, but it has a space cost: O(N²) for N temporal intervals, because you must store a relationship for every pair of nodes in the network. For a dialogue system, a planning system, or a medical record system with thousands of events, this is prohibitive.

The naive solution is to give up completeness: only store relationships between intervals that are "close" in some sense and accept that distant relationships will be unknown. But this loses inference power in an uncontrolled way. You don't know what you don't know.

Allen's solution is the **reference interval mechanism** — a principled way to partition the network into locally-complete clusters, connected through shared reference nodes, that (a) dramatically reduces space requirements, (b) makes retrieval efficient through a graph search, (c) preserves *most* inference power, and (d) makes the tradeoff *explicit and controllable*.

## What a Reference Interval Is

A reference interval is simply any interval in the system that is designated as the "home cluster" for a set of other intervals. Every interval can be declared to belong to one or more reference intervals. Within a cluster (set of intervals sharing a reference interval), the constraint network is fully computed — every pair of intervals in the cluster has an arc label, and those labels are kept updated by propagation.

Between clusters, relationships are *not* pre-computed. To find the relationship between an interval in cluster A and an interval in cluster B, you query upward through the reference hierarchy until you find a path, then compute the constraint along that path using the transitivity table.

The formal definition of "comparable" — which determines whether two nodes exchange propagated constraints — is:

> Two nodes K and J are *comparable* if:
> 1. They share a reference interval, OR
> 2. K is a reference interval for J, OR
> 3. J is a reference interval for K

This simple definition creates a clean boundary: facts propagate freely *within* a cluster and *between* a node and its reference, but do not propagate *across* clusters.

## The Reference Hierarchy: A Tree of Knowledge Clusters

Reference intervals can themselves have reference intervals, producing a hierarchy. In the typical case this hierarchy is tree-like: a root reference interval covers the entire domain, subdivided into major reference intervals, each subdivided further.

Allen gives three domain-specific examples of how to organize this hierarchy:

### Example 1: Historical Biography

For a knowledge base about a person's life, the natural reference intervals mirror life stages: PRESCHOOL (before school), PREGRAD (school years), POSTGRAD (after graduation). PREGRAD is subdivided into PRIM (primary school), SECOND (secondary school), UNIV (university). Each specific event (learning chess during primary school, winning the lottery during university) is stored with respect to the smallest reference interval that contains it.

To find the relationship between CHESS (primary school) and WIN (university), the algorithm:
1. Searches up from CHESS to PRIM, then to PREGRAD (because PRIM is "during" PREGRAD)
2. Finds the path: CHESS →(d)→ PRIM →(<)→ UNIV →(di)→ WIN
3. Computes the transitivity constraints along the path: CHESS before UNIV, UNIV contains WIN, therefore CHESS before WIN

No pre-computed arc between CHESS and WIN is needed. The answer is computed on demand from the hierarchical structure.

### Example 2: Process Decomposition

For a robot planning system, processes naturally decompose into subprocesses. Process P consists of steps P1, P2, P3 in sequence. Process Q consists of subprocesses Q1 and Q2 in arbitrary order, with Q2 further decomposed into simultaneous Q21 and Q22. The reference hierarchy mirrors this process hierarchy: Q is the reference for Q1 and Q2; Q2 is the reference for Q21 and Q22; P is the reference for P1, P2, P3.

When subprocess interactions are discovered (e.g., Q1 must occur before Q21), the system propagates this through the shared reference interval Q, inferring new constraints between Q1, Q2, and ultimately between the top-level processes Q and P.

This is exactly how a task decomposition system should work: each task is a reference interval for its subtasks, and inter-subtask constraints propagate upward to constrain the parent tasks.

### Example 3: The Moving Present

For a real-time system (dialogue, process monitoring), the present moment is constantly advancing. Representing NOW as a single node that must be updated every moment would require massive re-propagation. Instead, Allen creates a hierarchy of NOW intervals:

- NOW (the exact present moment, changes most frequently)
- THIS_MORNING (changes when the morning ends)
- TODAY (changes at midnight)
- THIS_YEAR (changes at year's end)

When NOW advances slightly, only relationships within THIS_MORNING need to be re-propagated. The larger reference intervals "protect" the rest of the database from minor temporal updates. When THIS_MORNING ends, a slightly larger re-propagation is needed, but TODAY still protects the historical facts. The amount of work per update is bounded by the granularity of the update.

Allen's key assumption: "When updating the NOW interval, unless otherwise stated, its relationship to its reference interval(s) remains constant" (p. 841). This is a *persistence assumption* — facts default to continuing until explicitly terminated. The reference hierarchy makes this assumption computationally cheap.

## The Architectural Principle: Hierarchical Locality

The reference interval mechanism embodies a general architectural principle that applies far beyond temporal reasoning:

**Hierarchical locality**: structure your knowledge store so that tightly-related information is fully connected within a cluster, loosely-related information is connected only through shared ancestors in a hierarchy, and the hierarchy is designed to match the natural decomposition structure of the domain.

This principle has several consequences:

**1. Inference scope is predictable.** When you add a new fact within a cluster, you know exactly how far the propagation will travel: to the boundaries of the cluster, and then upward to the reference interval. You can compute, in advance, the maximum number of arcs that will be updated. For a system with strict latency requirements, this predictability is essential.

**2. The hierarchy encodes domain knowledge.** The choice of reference intervals is not arbitrary — it reflects the natural structure of the domain. Life stages, process decompositions, calendar hierarchies, organizational hierarchies — these are the structures that appear in reference interval choices. A well-chosen hierarchy makes common queries cheap and uncommon queries possible but expensive.

**3. Cross-cluster interactions are handled explicitly.** When you discover a relationship between intervals in different clusters (e.g., Q2 overlaps P1 in the process example), you can add P to Q2's reference interval list, making Q2 a member of both clusters. This expands the propagation scope for that specific fact. Allen notes: "Manipulating the reference hierarchies as in this example can be effective if used sparingly. With overuse, such tricks tend to 'flatten out' the reference hierarchy" (p. 840). The warning is important: the hierarchy's efficiency comes from its structure. Overriding it degrades performance toward the fully-connected case.

**4. Retrieval is a graph search with a bounded path.** To find the relationship between any two intervals, search upward from each through the reference hierarchy until a common ancestor (or direct connection) is found. The path length is bounded by the depth of the hierarchy. In a well-balanced tree with depth d, any two intervals can be connected in at most 2d steps.

## Application to Agent Orchestration

In a multi-agent orchestration system, the reference interval pattern suggests a specific architecture for knowledge management:

**Organize agent knowledge into named scopes.** Each agent maintains a local knowledge base (its "cluster"). When agents need to share information, they do so through shared reference scopes (project-level, organization-level, etc.). Facts propagate within a scope automatically; cross-scope facts require explicit "bridge" assertions.

**Match the scope hierarchy to the task hierarchy.** If the task hierarchy has subtasks grouped under tasks, the knowledge scope hierarchy should mirror this. Knowledge about subtask execution propagates up to constrain the parent task's state. This is directly analogous to Allen's process hierarchy example.

**Bound the cost of state updates.** When a subtask completes, only the scopes that contain that subtask need to be updated. The parent task's scope is updated through the reference relationship. Sibling subtasks in different clusters are not disturbed unless there is an explicit cross-cluster dependency.

**Use the hierarchy to scope queries.** "What is true during this task?" queries only the task's cluster and its ancestors. It does not search the entire knowledge base. This is the temporal locality principle applied to orchestration.

## Failure Mode: The Flat Knowledge Base

The most common failure in agent systems that accumulate knowledge is the *flat knowledge base*: a single, global store where all facts coexist without structure. Every new fact propagates to every other fact. Every query searches the entire base. Contradictions accumulate undetected because there is no scope boundary to isolate them.

Allen's reference interval mechanism is the cure. Its key insight is that *most knowledge is local*: facts about what happened during a sub-task are mostly irrelevant to reasoning about other sub-tasks, unless there is an explicit cross-task dependency. The reference hierarchy makes this locality explicit and enforces it computationally.

Build your knowledge stores hierarchically. Make local inference cheap by fully connecting local clusters. Make global inference possible but explicitly bounded by the path through the hierarchy. When cross-scope dependencies are discovered, add them explicitly rather than silently flattening the hierarchy.