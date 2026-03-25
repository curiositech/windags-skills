## BOOK IDENTITY
**Title**: "Maintaining Knowledge about Temporal Intervals"
**Author**: James F. Allen, University of Rochester (1983)
**Core Question**: How can an intelligent system represent and reason about time when temporal knowledge is inherently relative, uncertain, and multi-grained — without paying an unbounded computational cost?
**Irreplaceable Contribution**: Allen's paper is the foundational source of what became "Allen's Interval Algebra" — the definitive taxonomy of 13 mutually exclusive temporal relationships between intervals. No other work provides this precise, computationally tractable formalization of interval-based time that simultaneously handles imprecision, uncertainty, disjunction, and hierarchical granularity. The constraint-propagation approach with reference intervals is an original solution to the tension between expressive power and computational feasibility that every temporal reasoning system must navigate. This paper is the primary source — everything else cites it.

---

## KEY IDEAS

1. **Intervals, not points, are the right primitive for reasoning about events.** Points create semantic paradoxes (when a light switches, it is simultaneously on and off at the boundary). Every apparently instantaneous event can be decomposed further upon magnification. Taking intervals as primitive avoids these paradoxes and matches how agents actually experience and describe time — in durations, not instants.

2. **Thirteen relations completely tile the space of possible interval relationships.** Before, meets, overlaps, starts, during, finishes, equals — plus their inverses — are mutually exclusive and exhaustive. Any pair of intervals falls into exactly one of these relations (or a disjunction of them under uncertainty). This gives agents a closed vocabulary for expressing all temporal knowledge, turning open-ended temporal reasoning into a constraint-satisfaction problem.

3. **Constraint propagation + transitivity tables enable automatic inference.** When a new temporal fact is added, consequences propagate through a network via a precomputed transitivity table. This is local, incremental, and bounded: for N intervals, the system does at most O(N²) work total across all additions. Agents don't need to re-reason from scratch when new temporal facts arrive.

4. **Reference intervals control the granularity of reasoning and limit propagation costs.** By organizing intervals into clusters anchored to "landmark" reference intervals, a system can reason locally within a context (today's events) without churning through globally unrelated facts (last year's events). The hierarchy mirrors natural domain structure — process hierarchies, life stages, calendar units — and makes temporal reasoning scale.

5. **Temporal knowledge is often relational, not absolute, and systems must embrace this.** Many facts cannot be assigned dates — they can only be described relative to other events ("A happened while B was occurring"). Systems that force absolute dating lose information. Systems that track only before/after chains can't represent disjunctive knowledge ("A happened either before or after B"). Allen's algebra handles both, making it strictly more expressive than its predecessors while remaining implementable.

---

## REFERENCE DOCUMENTS

### FILE: thirteen-temporal-relations-as-reasoning-vocabulary.md
```markdown
# The Thirteen Temporal Relations: A Complete Vocabulary for Interval-Based Reasoning

## The Core Insight

One of the most powerful ideas in Allen's 1983 paper is deceptively simple: between any two time intervals, exactly thirteen relationships are possible, and these thirteen are mutually exclusive and exhaustive. This is not merely a taxonomic curiosity — it is the foundation of a closed reasoning system. When an agent knows the vocabulary is complete, it can reason by elimination, by constraint intersection, and by propagation. The combinatorial explosion of temporal uncertainty is bounded from the start.

The thirteen relations are:

| Relation | Symbol | Inverse | Picture |
|----------|--------|---------|---------|
| X before Y | `<` | `>` | `XXX   YYY` |
| X meets Y | `m` | `mi` | `XXXYYY` |
| X overlaps Y | `o` | `oi` | `XXX` / `  YYY` |
| X starts Y | `s` | `si` | `XXX` / `YYYYY` (same start) |
| X during Y | `d` | `di` | `  XXX  ` / `YYYYYYY` |
| X finishes Y | `f` | `fi` | `  XXX` / `YYYYY` (same end) |
| X equals Y | `=` | `=` | `XXXXX` / `YYYYY` |

The six non-symmetric relations each have an inverse (for a total of 12 directed relations), plus equality, giving 13. Allen notes that collapsing `d`, `s`, `f` into a single `dur` relation (and their inverses into `con`) is sometimes convenient for coarser reasoning, but the full 13-way distinction is necessary for precise inference.

## Why This Matters for Agent Systems

An agent working with temporal knowledge faces a pervasive problem: incomplete information. It rarely knows *exactly* when things happened. It knows things like "the configuration change happened while the service was degraded" or "the error appeared after the deployment but before the rollback." These are interval relations, not point timestamps.

If an agent stores temporal knowledge only as timestamps or as simple before/after chains, it loses critical information. Allen's algebra preserves the full structure of what is actually known. Specifically:

**Before/after chains cannot represent disjunctive knowledge.** If an agent knows that event A happened either before event B or after event B (but not during), a simple chain forces a false choice. Allen's representation encodes this as the arc label `{<, >}` — a legitimate, unresolved disjunction that is carried forward without premature commitment.

**Date-based systems cannot represent purely relational facts.** "The error first appeared while the user was authenticated" tells us nothing about absolute time, but it constrains the temporal relationship between two intervals precisely. Allen's system captures this directly; date systems cannot.

**Point-based systems create semantic paradoxes at boundaries.** If a light switches from off to on, what is its state at the exact boundary point? If intervals are closed, the boundary belongs to both; if open, it belongs to neither. Allen argues this is not a fixable convention problem — it reveals that point-based ontologies do not match the intuitive structure of events. Intervals taken as primitive avoid the paradox entirely: the "meets" relation (`m`) captures exactly the idea that one interval ends where another begins, without requiring a shared boundary point.

## The Completeness Guarantee and Its Implications

The 13-relation algebra is provably complete in the sense that every possible relationship between two intervals is expressible as a subset of these 13. This has profound implications for agent design:

1. **An agent can always represent its temporal uncertainty precisely.** If it knows only that A and B are disjoint (don't overlap), it can record `{<, m, mi, >}` — the four relations consistent with disjointness. This is exact, not approximate.

2. **Constraint propagation terminates.** Because there are only 13 possible relations between any pair, and constraint propagation only ever *restricts* the label set (never expands it), the algorithm must terminate. Each arc can be updated at most 13 times before it stabilizes. For N nodes, the bound on total work is `13 × N(N-1)/2` modifications — polynomial, not exponential.

3. **Inconsistency is detectable (with caveats).** When constraint propagation reduces an arc label to the empty set, a contradiction has been found. The system guarantees consistency for all three-node subnetworks. Full global consistency checking is NP-hard in general, but Allen notes this has not been a practical problem in applications.

## The Transitivity Table as a Knowledge Compilation

The centerpiece of Allen's inference mechanism is the 13×13 transitivity table (Figure 4 in the paper). Given that A relates to B by relation r1, and B relates to C by relation r2, the table returns the set of possible relations between A and C. For example:

- If A `during` B, and B `before` C, then A `before` C (certain)
- If A `overlaps` B, and B `overlaps` C, then A could be `before`, `overlaps`, or `meets` C (uncertain — three possibilities)

This table is computed once and stored. It converts temporal reasoning into a lookup operation followed by set intersection. The intelligence of the system is *compiled into the table* — an agent using this system inherits the full power of interval algebra without needing to re-derive transitivity rules from first principles.

This is a model for how agent systems should handle formal reasoning domains: don't reason from axioms at runtime if you can precompute the consequence table and do lookup + intersection instead.

## Boundary Conditions and Limitations

**The 13-relation system assumes linear time.** It does not handle branching time (futures with alternatives), circular time, or partial orders with concurrent independent threads that never come into temporal relationship. For multi-agent systems where different agents operate on completely separate timelines, additional structure is needed.

**The algebra guarantees only pairwise and triplet consistency, not global consistency.** Allen demonstrates (via Henry Kautz's counterexample, Figure 5) that a network can appear locally consistent at every three-node subgraph yet have no globally consistent labeling. This means an agent using this system can hold a set of temporal beliefs that are subtly contradictory without the system detecting it. For high-stakes temporal reasoning (legal reasoning, safety-critical planning), this is a caveat worth taking seriously. Backtracking search can verify global consistency for small subnetworks.

**The algebra treats all intervals as having positive duration.** "Instantaneous" events must be modeled as very small intervals, not true points. Allen argues this is actually more faithful to reality (any event can be decomposed upon magnification), but it means the system is not directly compatible with point-based temporal logics without translation.

## Application to Agent Orchestration

In a multi-agent system, temporal knowledge accumulates from multiple sources: tool calls that return timestamps, agent reports of task completion, inferred orderings from causal dependencies, user statements about timing. These facts arrive incrementally and from heterogeneous sources.

Allen's algebra provides the right substrate for a **temporal working memory** shared across agents:

- Each agent asserts temporal facts in the common vocabulary (`task_A overlaps task_B`, `deployment meets outage`)
- The constraint propagation engine maintains consistency automatically
- Any agent can query the temporal relationship between any two intervals by reading the network
- Uncertainty is preserved: if the system doesn't know whether A precedes B or B precedes A, it says so, rather than guessing

This is strictly superior to timestamp-based logging for *reasoning* purposes (though timestamps are still valuable and can be integrated as date line information, as Allen describes in Section 7.2).
```

---

### FILE: constraint-propagation-as-incremental-inference.md
```markdown
# Constraint Propagation as the Engine of Incremental Temporal Inference

## The Problem of Incremental Knowledge

Intelligent agents accumulate knowledge incrementally. They do not receive a complete problem statement at the start and then reason to a conclusion. Instead, they learn facts one at a time — from sensors, from tool calls, from other agents, from user inputs — and must maintain a consistent, up-to-date world model as each new fact arrives.

This creates a fundamental tension: reasoning from scratch each time a new fact arrives is computationally prohibitive; but storing only raw facts without doing any inference leaves derivable knowledge implicit and therefore unavailable when needed quickly.

Allen's temporal reasoning system resolves this tension elegantly. Its constraint propagation algorithm does *just enough* reasoning when a fact is added — propagating consequences until no new constraints can be derived — and then stops. The result is a network that is always in a "closed" state with respect to pairwise and triplet consistency. An agent can query any pair of intervals and get an immediate answer without additional search.

## The Algorithm

Allen's algorithm for adding a new temporal relation R(i, j) (stating that interval i relates to interval j by the relation set R) works as follows:

1. Record R(i, j) in the network (intersecting with any existing label on that arc).
2. For each interval k that is "comparable" to j: compute the constraint between k and j via the path k→i→j. If this new constraint is *more restrictive* than what was previously known, update the arc k→j and add it to a queue for further processing.
3. For each interval k that is "comparable" to i: compute the constraint between i and k via the path i→j→k. Similarly update and enqueue if more restrictive.
4. Process the queue until empty.

The key properties:

**Monotonicity**: Labels only ever get *restricted* (subsets are taken, never unions). Once a relation is eliminated as impossible, it stays eliminated. This is why the algorithm terminates.

**Completeness for paths**: The algorithm propagates consequences along all paths, not just direct edges. When A→B and B→C are both constrained, the constraint on A→C is automatically derived.

**Bounded work**: Because each arc label can only shrink (from a maximum of 13 relations toward 1), each arc can be updated at most 13 times. With N nodes, there are at most N(N-1)/2 arcs, giving a total upper bound of approximately 13N²/2 updates — quadratic in the number of intervals. Allen notes that in practice, if the number of constraints added is approximately equal to the number of intervals, the *amortized* cost per addition is O(N).

## The Comparability Predicate

A crucial element that Allen introduces but might be overlooked is the **comparability predicate**: `Comparable(k, j)` controls which pairs of nodes the algorithm considers when propagating. In the basic algorithm (Section 4), this is always true — every node is compared to every other, giving full transitive closure.

The power comes in Section 5, where comparability is restricted by reference intervals. Two nodes are comparable only if they share a reference interval (or one is a reference interval of the other). This limits propagation to *relevant* sub-networks, preventing the O(N²) cost from becoming a problem in large systems.

This design pattern — a global algorithm parameterized by a locality predicate — is a general and powerful technique for agent systems. The agent can dial up or down the scope of inference based on what reference context is active.

## What "Automatic" Inference Means Here

Allen writes that the inference technique "is an attempt to characterize the inferences about time that appear to be made automatically or effortlessly during a dialogue, story comprehension, or simple problem-solving." This is a precise claim about cognitive plausibility: the algorithm models the background temporal reasoning that happens without conscious effort.

For agent systems, this suggests a design principle: **separate the "automatic" inference layer from the "deliberate" reasoning layer**. The constraint network handles the automatic layer — maintaining consistency, propagating obvious consequences, tracking what's possible vs. impossible. Deliberate reasoning agents can then query this substrate without worrying about whether their temporal premises are consistent.

This parallels the distinction between working memory and explicit reasoning in cognitive architectures. The temporal network is working memory; agents are the deliberate reasoners who read from and write to it.

## Handling Uncertainty Through Disjunction

A central strength of Allen's approach is that uncertainty is represented explicitly and propagated correctly. When an agent doesn't know whether A precedes B or B precedes A, it records `{<, >}` on the A→B arc. When a new constraint arrives that is consistent with both possibilities, the disjunction is maintained. When a new constraint rules out one possibility, the label shrinks.

The propagation of disjunctions through the transitivity table is computed by taking the *union* of the consequences of each individual relation:

```
Constraints(R1, R2) = ∪ { T(r1, r2) : r1 ∈ R1, r2 ∈ R2 }
```

Then the result is *intersected* with the existing arc label. The union expands (covers all possibilities consistent with both disjunctions); the intersection with prior knowledge restricts. This is Bayesian reasoning in combinatorial form: expand over possibilities, then restrict by evidence.

This is more conservative than forcing a definite answer, and more informative than saying "unknown." An agent with a disjunctive label `{overlaps, meets}` knows something important: A and B are close in time, with A coming first, but the exact degree of overlap is unresolved. This is genuinely different from having no information.

## Detecting Inconsistency

When constraint propagation reduces an arc label to the empty set ∅, a contradiction has been introduced. The system has been told that A and B stand in some relation, but after propagation, no relation is consistent with all the prior facts. This is the temporal equivalent of a logical contradiction.

Allen notes that the system only guarantees consistency for three-node subnetworks (path-consistency), not global consistency. A subtle inconsistency requiring consideration of four or more nodes simultaneously can slip through. He also notes this has not been a practical problem in his applications.

For agent systems, the practical implication is: **use Allen's system for efficient approximate consistency checking, but for high-stakes temporal claims, run an explicit backtracking verification on the relevant subnetwork**. The constraint network tells you quickly if something is *obviously* wrong; the backtracker catches the subtle cases.

## Application: Event Log Analysis

Consider an agent system debugging a distributed system failure. The system has access to logs from multiple services, each with their own timestamps (which may be imprecise or from unsynchronized clocks). The agent needs to determine the causal chain.

Using Allen's framework:

1. **Parse logs into intervals**: Each event has a start and end (or at least a duration estimate). Uncertainty in log timestamps becomes uncertainty in interval boundaries, represented as disjunctive arc labels.

2. **Assert temporal facts**: "Service A's error interval overlaps or meets Service B's degradation interval" — recorded as arc label `{o, m}`.

3. **Propagate**: When a new log entry says "Service C restarted during Service B's degradation," the system automatically derives constraints between Service A's error and Service C's restart.

4. **Query**: "Is it possible that Service C's restart *caused* Service A's error?" This is answered by checking whether Service C's restart interval could precede Service A's error interval — a simple arc lookup.

This turns a search problem (manually tracing through logs to find causal chains) into a query problem (looking up a precomputed constraint).
```

---

### FILE: reference-intervals-and-hierarchical-reasoning-scope.md
```markdown
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
```

---

### FILE: intervals-over-points-the-right-primitive.md
```markdown
# Why Intervals Are the Right Primitive: Resisting the Temptation of Point-Based Time

## The Seductive Simplicity of Points

Points have obvious appeal for computational systems. A timestamp is a number. Comparing two timestamps is arithmetic. Ordering events by timestamp is sorting. The entire infrastructure of databases, logs, and monitoring systems is built on point-based time: everything happens "at" a moment, recorded as a datetime value.

Allen's 1983 paper mounts a sustained argument that this intuition, while computationally convenient, is philosophically wrong and practically limiting. Understanding *why* points fail and why intervals are the right primitive has deep implications for how agent systems should model temporal knowledge.

## The Decomposability Argument

Allen's first argument is about the structure of events. He writes: "Although some events appear to be instantaneous (e.g., one might argue that the event 'finding the letter' is instantaneous), it also appears that such events could be decomposed if we examine them more closely."

The "finding the letter" example is analyzed: it decomposes into "looking at spot X where the letter was" and "realizing that it was the letter you were looking at." The realization itself decomposes into inferences. At each level of magnification, what appeared instantaneous reveals internal structure.

Allen concludes: "There seems to be a strong intuition that, given an event, we can always 'turn up the magnification' and look at its structure. This has certainly been the experience so far in physics. Since the only times we consider will be times of events, it appears that we can always decompose times into subparts. Thus the formal notion of a time point, which would not be decomposable, is not useful."

For agent systems, this is a critical observation. When agents reason about events, they are always reasoning about processes that took time. A function call "completes at time T" is a useful approximation, but it actually completed over an interval — it started, executed, and finished. The interval captures the causal structure (you can ask what happened during the execution) in a way that the timestamp cannot.

## The Boundary Paradox

Allen's second argument is a semantic paradox about boundaries between adjacent intervals. Consider a light that switches from off to on:

- There must be an interval during which the light was off.
- There must be an interval during which the light was on.
- What is the status of the light at the exact boundary point between these intervals?

If intervals are closed (including their endpoints), then the boundary belongs to both intervals — the light is simultaneously on and off. Contradiction.

If intervals are open (excluding their endpoints), then the boundary belongs to neither interval — the light is neither on nor off. Contradiction.

The "fix" of using half-open intervals (closed at one end, open at the other) is arbitrary — why left-closed rather than right-closed? — and more importantly, still requires reasoning about zero-width points that exist only at boundaries.

Allen's solution: abandon points as a primitive. Use the `meets` relation to capture the idea that one interval ends exactly where another begins, without requiring any shared boundary point. The `meets` relation is primitive; boundaries are not.

This is philosophically cleaner and computationally workable. The apparent disadvantage — you can't ask "what was the state at exactly midnight?" — is actually an advantage in disguise: that question is often ill-posed in the real world. Asking "what was the state during the interval containing midnight?" is always well-posed.

## The Expressive Limitations of Date-Based Systems

Allen catalogs the failures of date-based approaches. The fundamental issue: dates require that every event be pinned to a precise (or range-bounded) position on a common timeline. This fails for:

**Purely relational knowledge.** "The error appeared while the user was authenticated" tells us a `during` relationship without any absolute timing information. A date-based system must either ignore this fact or force an assignment of timestamps that may be entirely fabricated.

**Disjunctive knowledge.** "A and B did not happen at the same time" rules out the `overlaps`, `during`, `starts`, `finishes`, and `equals` relations — but does not determine *which* of the remaining relations holds. Allen notes: "this fact cannot be represented using fuzzy dates for A and B. Either we must decide that A was before B, or B was before A, or we must assign date ranges that allow A and B to overlap." None of these options is faithful to the actual knowledge state.

**Relative durations without absolute anchoring.** "Task B took twice as long as Task A" is a duration relationship with no date information. Date systems require both facts to be dated before they can compare durations.

Allen's interval algebra handles all three cases. Relational knowledge is stored as arc labels. Disjunctive knowledge is stored as disjunctive arc labels (e.g., `{<, >}` for "before or after"). Relative durations are handled by the orthogonal duration network described in Section 7.1.

## The Before/After Chain Failure

Simple before/after chaining (storing a list of ordering relationships) is more expressive than dates for relational facts, but it has its own failures:

**Search cost scales with chain length.** To determine whether A is before B when there are N events between them in the chain, you must traverse N links. Allen writes: "As the amount of temporal information grows, however, it suffers from either difficult search problems (searching long chains) or space problems (if all possible relationships are precomputed)."

**Cannot represent disjunctive interval relationships.** "A happened either before B or during B" cannot be expressed as a before/after chain unless you introduce disjunctive chains — at which point you've essentially reinvented Allen's algebra.

**Cannot represent the full richness of interval overlap.** A chain says "A before B" or "B before A." It cannot say "A overlaps B by about half" or "A finishes before B finishes but starts after B starts" (the `during` relation). The thirteen-relation vocabulary is strictly richer than a two-relation vocabulary.

## Points as an Approximation

Allen is careful not to dismiss point-based intuitions entirely. He writes: "An informal notion of time points as very small intervals, however, can be useful." When events are much shorter than the grain of interest, treating them as points is a useful approximation — but it's an approximation, and the system should know it is one.

More importantly, Allen introduces the key insight about grain-relative point-hood: "A historian, for instance, may be happy to consider days as points, whereas the computer engineer, when reasoning about a logic circuit, would consider a day to be an eternity. Thus the interval size, where it is appropriate to simplify reasoning by assuming point-like times, varies with the reasoning task."

This means that the question "is this event a point or an interval?" has no context-independent answer. It depends on the grain of reasoning. The interval algebra handles this gracefully by not building any notion of absolute duration into the relation vocabulary. A `during` relation is a `during` relation whether the containing interval is a microsecond or a millennium.

## Application to Agent System Design

**Event logging should record intervals, not just timestamps.** When an agent reports that it completed a task, the report should include both start and end times (or at least a duration estimate). When only one endpoint is known, the representation should acknowledge this uncertainty rather than inventing a value.

**Causal reasoning requires interval thinking.** "A caused B" in a distributed system means that some output of A's execution interval influenced some input of B's execution interval. This is an interval relationship — specifically, A must have at least partially preceded B (A `before`, `meets`, or `overlaps` B). Point-based causality reasoning ("A's timestamp precedes B's timestamp") conflates simultaneous events with causal ones and misses overlapping causation entirely.

**Detecting simultaneity requires interval overlap analysis.** If two agents are both "active" at the same time (their execution intervals overlap), they may interfere. Detecting this requires the `overlaps`, `starts`, `during`, `finishes`, or `equals` relations — none of which are distinguishable in a point-based model where both agents have a "last active timestamp."

**State transitions should be modeled as interval sequences connected by `meets`.** When a system transitions from state S1 to state S2, this is precisely the `meets` relation: the S1 interval meets the S2 interval. The sequence of states is a sequence of intervals connected by `meets` — Allen's direct representation. Point-based models force the choice of which state "owns" the boundary moment, which is the paradox Allen identifies.

## The Deeper Point

The choice between points and intervals as primitives is not merely a technical one. It reflects a prior commitment about what kind of entities exist in the world of temporal reasoning. Allen's choice — intervals as primitive — aligns with how agents, planners, and language users actually think about time. We think in durations, in overlaps, in "during" and "before" and "while." The algebra that captures these intuitions directly is not just convenient — it is, in Allen's view, the right ontology for temporal reasoning.

Agent systems that inherit this ontology will find themselves naturally expressing temporal knowledge in terms that match how the knowledge was acquired (from observations of events with duration) rather than in terms that fit the convenience of computer clocks (single-point timestamps).
```

---

### FILE: expressive-power-vs-computational-feasibility.md
```markdown
# The Expressive Power / Computational Feasibility Trade-off: Allen's Resolution

## The Central Design Tension

Every formal reasoning system faces a fundamental trade-off: the more expressive the language, the harder the reasoning. Full first-order logic can express almost anything, but theorem proving is undecidable. Propositional logic is decidable, but exponential. Specific constraint languages are polynomial, but they can only express restricted types of relationships.

Allen opens Section 6 with a direct statement of this tension and his resolution: "The temporal representation described is notable in that it is both expressive and computationally feasible. In particular, it does not insist that all events occur in a known fixed order, as in the state space approach, and it allows disjunctive knowledge, such as that event A occurred either before or after event B, not expressible in date-based systems or simple systems based on before/after chaining. It is not as expressive as a full temporal logic (such as that of McDermott), but these systems do not currently have viable implementations."

This is a precise, honest positioning: Allen's algebra sits in a *specific* spot on the expressiveness/tractability frontier — more expressive than simple approaches, less expressive than full temporal logic, but uniquely tractable while being more expressive than its nearest neighbors.

## What Expressiveness Was Gained

Compared to prior approaches, Allen's system gains:

**Genuine disjunctive knowledge**: A system can represent "A happened before or after B" without forcing a choice. Prior before/after chain systems required committing to one relationship or the other. This matters enormously when information is incomplete — which it always is in practice.

**Full interval relationship vocabulary**: The 13-relation algebra captures all structural relationships between intervals: whether they overlap, which starts first, which ends first, whether one contains the other. Simple before/after chains only distinguish precedence. Date systems only compare endpoint positions. Allen's algebra captures the full geometry of two intervals on a timeline.

**Relative temporal knowledge**: Facts like "A happened while B was occurring" are representable directly. Date systems require absolute dates for both A and B. Allen's system requires only the relationship.

**Persistence reasoning**: Via the "persistent interval" extension (Section 7.3), the system can represent facts that are assumed to continue until contradicted — the classic default reasoning pattern. The temporal representation handles the "when does this cease to be true?" question naturally.

**Duration reasoning**: The orthogonal duration network (Section 7.1) adds relative duration constraints: "A took longer than B," "C took at most twice as long as D." These are inexpressible in purely relational temporal systems.

## What Expressiveness Was Sacrificed

Allen is explicit about the limitation: "This balance between expressive power and computational efficiency is achieved by the restricted form of disjunctions allowed in the system. One can only assert disjunctive information about the relationship of two intervals. In other words, we can assert that A is before or meets B, but not that (A meets B) or (C before D)."

This is a crucial restriction. The system allows *intra-pair* disjunction (uncertainty about which of the 13 relations holds between a specific A and B) but not *cross-pair* disjunction (uncertainty that couples the relationship between A-B to the relationship between C-D).

Real-world example of what this cannot represent: "Either John arrived before the meeting started and Mary arrived during the meeting, OR John arrived during the meeting and Mary arrived before it started." This couples two pairs of relationships in a way that requires tracking their correlation — which Allen's system cannot do. Each pair's relationship is maintained independently.

This restriction is what makes constraint propagation tractable. If cross-pair disjunctions were allowed, the system would need to track exponentially many combinations of relationship assignments — which is essentially what makes full temporal logic intractable.

## The Feasibility Guarantee

The computational guarantees Allen provides are specific:

**Polynomial update cost**: Adding a new fact takes O(N) amortized time, where N is the number of intervals. Total cost for all additions to a network of N nodes is O(N²). This is because each of the N(N-1)/2 arcs can be updated at most 13 times.

**Constant query time** (once propagated): Querying the relationship between two intervals is a single arc lookup — O(1). All the work happens at assertion time, not query time. This is the "pay now, spend nothing later" design.

**Bounded consistency checking**: Local consistency (any three nodes) is guaranteed by the propagation algorithm. Global consistency is NP-hard in general, but Allen argues this is rarely a practical problem and can be checked with backtracking search on specific subnetworks.

**Reference intervals provide a knob**: By restricting comparability through reference intervals, the effective N for propagation is reduced to the cluster size, not the total network size. This makes the system scale to large temporal knowledge bases without paying O(N²) globally.

## Comparison to Competitor Approaches

Allen's analysis of prior approaches is worth synthesizing:

| Approach | Disjunction | Relative Knowledge | Expressive Power | Computational Cost |
|----------|-------------|-------------------|------------------|-------------------|
| State space (STRIPS) | No | No (implicit sequencing only) | Very low | Low |
| Date-based | No (forced commitment) | No (needs absolute dates) | Low | Very low |
| Before/after chains | No | Partial (ordering only) | Low-medium | Medium (search cost) |
| Situation calculus | No | No | Medium (formal) | High (no viable implementation) |
| McDermott temporal logic | Yes (full) | Yes | High | Very high (no viable implementation) |
| **Allen's algebra** | **Yes (intra-pair)** | **Yes** | **Medium-high** | **Polynomial** |

The unique position: Allen's algebra is the *only approach in the table that is both more expressive than before/after chains and computationally feasible.* This is why it became the standard reference for temporal reasoning in AI.

## The Lesson for Agent System Design

This analysis teaches a general principle for designing reasoning components in agent systems: **identify the expressive requirements of your domain, then find the most restricted formal language that meets those requirements**.

The temptation is to use the most powerful available language "just in case." This leads to systems that are undecidable, intractable, or have no implementations. Allen's approach is the opposite: start with the weaker systems, identify precisely what they cannot express that the domain requires, and choose the minimal extension that covers those gaps.

For temporal reasoning, the gaps in prior systems were:
1. Cannot express disjunctive temporal relationships (uncertain ordering)
2. Cannot express relative knowledge (no absolute dates)

Allen's algebra closes exactly those gaps, and no more. The specific restriction to intra-pair disjunctions is not a limitation discovered by accident — it is the *designed boundary* that keeps the system tractable while meeting the expressiveness requirements.

Agent systems should apply this same discipline: for each reasoning module, identify the minimum expressiveness requirements and choose the most tractable formalism that meets them. Do not default to "use a general-purpose reasoner" when a specialized, tractable one exists.

## When to Push Beyond Allen's Algebra

The restricted disjunction is a genuine limitation in domains where facts are coupled. Examples:

**Multi-hypothesis tracking**: If an agent is tracking two competing hypotheses about what happened, the temporal structure of events may differ *across* hypotheses. "If Hypothesis 1 is correct, A happened before B; if Hypothesis 2 is correct, C happened before D" — this is cross-pair disjunction. Allen's algebra cannot represent this correlation.

**Conditional temporal planning**: Planning systems that branch on conditions may need to represent plans where temporal ordering depends on which branch is taken. Again, this requires correlating relationships across pairs.

**Constraint-based scheduling with mutual exclusion**: "Task A and Task B cannot overlap, and Task B and Task C cannot overlap" involves three intervals with two constraints. Allen's algorithm handles this, but complex mutual exclusion constraints with more than three intervals involved can require global consistency checking.

For these cases, Allen himself points to Freuder's backtracking techniques as an extension, and notes that "the computational complexity of the algorithm is exponential" for full global consistency. The engineer's choice is: handle these cases explicitly with targeted search, or use a more expressive (but less efficient) framework. Allen's contribution is to make clear exactly where the polynomial-exponential boundary lies.
```

---

### FILE: persistence-and-the-frame-problem.md
```markdown
# Persistence, Default Reasoning, and the Frame Problem in Temporal Systems

## The Frame Problem

One of the oldest and most vexing problems in AI planning is the frame problem: how does a reasoning system know what *didn't* change when an action occurred? If a robot moves a box, its position changes. But did its color change? Did the lights in the room change? Did the temperature change? In principle, everything that is not explicitly stated to have changed might have changed. But reasoning about every possible fact at every time step is computationally impossible.

The naive solution — assert every unchanged fact at every time step — is obviously unworkable. The standard AI solution — assume everything remains the same unless explicitly changed (the "frame assumption") — is an approximation that fails in adversarial or complex environments.

Allen's temporal algebra provides a distinct, cleaner approach to this problem, one grounded in the structure of time rather than in explicit frame axioms.

## Persistence via Interval Extent

Allen writes (Section 7.3): "The temporal representation is already based on the observation that most time intervals do not have precisely defined limits. If we allow the user to specify that some intervals should be assumed to extend as far as possible given the constraints, then we can use such intervals to index facts that are assumed to persist until discovered otherwise."

The key insight: a fact doesn't need to be *re-asserted* at each moment if it is indexed by an interval that is *assumed to extend* as far as constraints allow. The persistence is built into the interval extent, not into repeated assertions.

Concretely: when I park my car this morning, I record the fact "car is in parking lot" indexed by interval `Tp`. I also record that `Tp` is met by `Tarrive` (the time I arrived). `Tp` is declared a **persistent interval** — it is assumed to extend as far forward as no contradictory evidence exists.

Later, when I want to know if my car is still there (during interval `Tnow`), I query: is it possible that `Tnow` is during `Tp`? The system can answer this from the network:

- `Tp` met-by `Tarrive`
- `Tarrive` before `Tnow`

From transitivity, `Tp` could be `{before, overlaps, during-inverse, meets-inverse}` with respect to `Tnow`. Among these, `during-inverse` (Tnow is during Tp) is possible. So the test succeeds by assumption.

If I later learn that the car was missing during interval `Tmiss`, I add the constraint that `Tp` ends before `Tmiss`. If `Tnow` is after `Tmiss`, then `Tnow` cannot be during `Tp`, and the test fails. No explicit "delete the fact" operation was needed — the temporal constraint propagation handles it.

## Why This Solves the Frame Problem Partially

Allen's approach solves the frame problem for a specific class of facts: those that persist over time intervals without requiring re-assertion. This is not a complete solution (it handles persistence but not complex interactions between simultaneous changes), but it is a clean solution for the common case.

The classical frame problem requires asserting what *didn't* change. Allen's approach inverts this: you assert what *is true during an interval*, and the system assumes it continues until evidence constrains the interval to end. The burden shifts from "prove it still holds" to "provide evidence that it stopped holding."

Allen puts this precisely: "Testing P later during an interval t will succeed (by assumption) if it is possible that t is during Tp." This is default reasoning implemented via temporal interval uncertainty rather than via explicit default rules.

## Propagation of Assumptions

Allen introduces an elegant extension for handling derived facts under persistence:

"If we let a fact P be indexed by interval Tp, then for any time, P implies Q. If we test P at time t and find it true by assumption, we can index Q by Tp rather than by t. Then if we ever discover further constraints on Tp that eliminate the possibility that t is during Tp, both P and Q will cease to be true by assumption during t."

This is assumption propagation through temporal co-indexing. When a fact P holds during Tp and implies Q, index Q under the same interval Tp, not under the query time t. Then:

- If we later discover Tp ends before t, we automatically retract both P and Q at time t.
- We don't need a truth maintenance system that tracks which derived facts depend on which assumptions — the temporal indexing encodes this dependency directly.

Allen notes this requires further investigation but "appears that it may allow a large class of assumption-based belief revision to be performed easily."

## The Connection to Truth Maintenance

Allen explicitly connects his approach to Doyle's Truth Maintenance System (TMS), citing it as the general framework for handling assumption-based reasoning. What Allen adds is a specific, efficient mechanism for one class of assumptions: temporal persistence.

In a full TMS, every derived fact records the set of assumptions it depends on. When an assumption is retracted, the TMS propagates retraction through all dependent facts. This is powerful but expensive for large fact bases.

Allen's temporal co-indexing is a restricted TMS where the dependency structure is encoded implicitly in the temporal interval. Facts indexed by the same interval share the assumption that the interval extends to cover any query time. When the interval is constrained to end earlier (i.e., the assumption is retracted), all facts indexed by it are simultaneously invalidated.

This is O(1) retraction (update the interval's constraints) rather than O(dependents) retraction (explicitly follow all dependency links). The cost is that you can only use this trick for temporally indexed facts — facts whose persistence assumption is specifically about *continuing to hold over a time interval*.

## Application to Agent Systems: Maintaining State Across Time

Agent systems must maintain state across multiple steps, tool calls, and interactions. The naive approach is to pass all relevant state explicitly between steps (stateless, message-passing design). The more powerful but harder approach is to maintain a persistent world model that agents can query.

Allen's persistence mechanism provides a principled way to build this world model:

**Facts about the environment** are indexed by persistent intervals. "The database is in state X" is indexed by an interval that starts when the state was observed and extends until evidence arrives that the state changed. The system assumes the state persists; agents query it by asking "is it possible that NOW is during the state-X interval?"

**Derived facts inherit the temporal scope of their premises.** When an agent concludes "since the database is in state X, the query will return result Y," this conclusion should be indexed by the same interval as the state-X fact. If state-X is later found to have ended before the query, the conclusion is automatically invalidated.

**Temporal constraints resolve ambiguity.** Multiple facts may have uncertain extents. When a new observation narrows the extent of one fact's interval, the propagation mechanism updates all related interval relationships, potentially resolving which of several possible world states is consistent.

**Garbage collection of expired assumptions.** Intervals that have been fully constrained to lie in the past (relative to NOW) and that are not referenced by any active inference can be retired from the working memory. The system remains current without explicit deletion of outdated beliefs.

## The Minimum Duration Assumption

Allen's persistence model is really an application of Occam's razor to temporal reasoning: don't assume intervals end any sooner than evidence demands. This is the temporal analogue of the principle "don't introduce entities beyond necessity."

But this raises a question: when *should* an interval be assumed to end? Allen's answer is implicit: when contradictory evidence arrives (a fact that requires the interval to have ended), or when the containing reference interval ends (the fact is no longer within scope).

For agent systems, this suggests that persistent facts should be scoped to explicit **contexts**: a conversation, a session, a task, a process. When the context ends, all facts scoped to it expire. This mirrors Allen's reference interval hierarchy — the reference interval for a session contains all facts about that session; when the session ends (the reference interval gets its end boundary fixed), the facts within it become historical rather than current.

## Boundary Conditions: When Persistence Reasoning Fails

Allen's persistence mechanism assumes that the world changes in ways that are **eventually reported**. If a fact ceases to hold but no evidence of this ever reaches the system, the persistent interval will be incorrectly assumed to still contain NOW. This is not a bug in Allen's system — it's a feature of the closed-world vs. open-world distinction. Allen's system is an open-world system: absence of evidence of change is interpreted as evidence of absence of change (the persistence assumption). This is appropriate for many real-world reasoning scenarios but fails when:

- Events that terminate facts happen outside the system's observation horizon
- Observations arrive with significant delay
- The system is reasoning about a domain with high rates of change

For high-change domains, the reference interval hierarchy provides mitigation: by anchoring NOW in a small reference interval that updates frequently, the window of assumption is limited. If NOW is bounded to "this minute," then persistence assumptions are only trusted for one minute without refresh.

For agent systems in volatile environments, this suggests **frequent explicit re-querying** of key facts rather than relying on persistence indefinitely. The temporal interval model makes this natural: each query becomes a new interval, and the system tracks how the queried facts' intervals relate to the query intervals, detecting when assumptions may have expired.
```

---

### FILE: grain-of-reasoning-and-context-sensitivity.md
```markdown
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
```

---

### FILE: temporal-knowledge-in-planning-and-process-modeling.md
```markdown
# Temporal Knowledge in Planning and Process Modeling: From Interval Algebra to Agent Coordination

## Planning Requires Temporal Reasoning

Allen opens his paper by noting that planning is one of the core AI applications requiring sophisticated temporal representation: "In planning the activities of a robot, for instance, one must model the effects of the robot's actions on the world to ensure that a plan will be effective."

This is understated. Planning *is* temporal reasoning. A plan is precisely a specification of which actions should happen, in which order, with which overlaps and dependencies. A plan that says "do A, then do B, then do C" is asserting temporal relationships: A `before` B `before` C, or more precisely A `meets` B `meets` C if they are intended to be consecutive without gaps.

But real plans are richer than simple sequences. They involve:
- **Parallel actions**: A and B happen simultaneously (A `overlaps` B or A and B both `during` a containing interval)
- **Conditional ordering**: A must complete before B can start (A `before` B or A `meets` B)
- **Duration constraints**: B must not start more than 5 minutes after A ends (A `meets` B or A relation B is restricted by duration)
- **Overlapping effects**: A's effect persists into B's execution (A's effect interval `overlaps` or `contains` B)

Allen's algebra provides the right vocabulary for expressing all of these. Plans become temporal constraint networks, and planning becomes constraint satisfaction.

## The Process Hierarchy

Section 5.2 of Allen's paper contains an extended example of process-based temporal reasoning that is directly applicable to agent orchestration. Allen considers:

> "A process P consisting of a sequence of steps P1, P2, and P3 and another process Q consisting of subprocesses Q1 and Q2 occurring in any order, but not at the same time. Furthermore, let Q2 be decomposed into two subprocesses Q21 and Q22, each occurring simultaneously."

This is precisely the structure of a complex agent task:
- Workflow W has phases Phase1, Phase2, Phase3 (sequential)
- Phase2 has subtasks Task_A and Task_B (unordered but non-overlapping)
- Task_B has steps Step1 and Step2 (simultaneous, or at least allowed to be)

The temporal constraints within this hierarchy are expressed as arc labels in the reference interval network:

```
Phase1 --(m or <)-- Phase2 --(m or <)-- Phase3   [within W]
Task_A --(< or >)-- Task_B                          [within Phase2]
Step1  --(= or o or oi)-- Step2                     [within Task_B]
```

These constraints can be maintained by the constraint propagation algorithm. When an agent reports that Task_A has completed, the system can infer new constraints about when Task_B can start, and propagate these into constraints about Phase2's duration, and from there into Phase3's earliest start.

## NOAH and Process Interaction

Allen references the NOAH planning system (Sacerdoti 1977) as an example of process-based reasoning that "can be done independently" — that is, subprocess decompositions that don't interact with each other. The reference interval hierarchy works perfectly for this case.

"More interesting cases arise when there may be interactions among subprocesses. For instance, we might want to add that Q1 must occur before Q21." This is a cross-cluster constraint: Q1 is within Q (a reference interval), Q21 is within Q2 (a different reference interval within Q). They don't share a reference interval, so the propagation algorithm doesn't automatically handle their relationship.

Allen's solution: when asserting a cross-cluster constraint, temporarily bridge the clusters by adding the other cluster's reference interval to the constrained node's reference list. This allows the constraint to propagate properly.

For agent orchestration: this is precisely the situation where one agent's output creates a dependency on another agent's input, even though they are nominally in different subtasks. The orchestration system must explicitly recognize this cross-cluster dependency and create the bridge.

## What the Temporal Model Enables in Planning

**Detecting conflicts before execution**: If two actions both require exclusive access to a resource, and their temporal intervals overlap, the system can detect this as an inconsistency before the actions are executed. The constraint propagation will find that the intervals must be disjoint but the plan requires them to overlap — an empty arc label signals the conflict.

**Finding parallelism opportunities**: If the temporal constraints between two actions include the possibility of overlap (`{o, oi, d, di, s, si, f, fi, =}` in the arc label), the planner knows these actions could potentially be executed in parallel. The constraint network makes this opportunity explicit without requiring the planner to search for it.

**Propagating schedule changes**: When an action takes longer than expected (its interval's end is pushed later), the constraint propagation automatically updates all downstream intervals that depend on it. The planner doesn't need to re-examine the entire plan — the propagation does it.

**Managing resource availability windows**: When a resource is available only during certain intervals (database maintenance window, rate-limited API), these can be represented as reference intervals with specific temporal relationships to the task intervals. Actions requiring the resource must have their intervals fall `during` the availability interval; the constraint network enforces this.

## Duration Reasoning for Planning

Allen's duration reasoning extension (Section 7.1) is particularly relevant to planning. Duration constraints express:
- "Task B cannot take more than twice as long as Task A"
- "The total elapsed time for Phase 2 must be less than 4 hours"
- "Steps 1 and 2 together must take at most 30 minutes"

These are expressed as multiplicative constraints in a second constraint network orthogonal to the relational network. The two networks interact: if A `during` B, then the duration of A must be less than the duration of B (otherwise A couldn't fit within B). This coupling allows the two networks to constrain each other iteratively until both are consistent.

For agent orchestration, duration reasoning enables:
- **SLA enforcement**: Ensure that task durations don't violate service level agreements
- **Resource budgeting**: Allocate time budgets to subtasks and detect when the total exceeds the available window
- **Scheduling with deadlines**: Find consistent orderings that complete all tasks before their deadlines

## Integrating Temporal Reasoning into Agent Coordination

A WinDAGs system coordinating multiple agents on a complex task can use Allen's framework as the temporal substrate for coordination:

**Shared temporal world model**: All agents read from and write to a common temporal constraint network. When Agent A reports that its task completed, it asserts interval constraints into the network. Agent B, waiting for A's output, queries the network to determine when it can start.

**Dependency encoding**: Task dependencies ("Task B cannot start until Task A completes") are encoded as arc labels (`A meets B` or `A before B`). The network propagates these constraints automatically — no explicit dependency tracking code is needed.

**Uncertainty management**: When an agent doesn't know exactly how long its task will take, it asserts a disjunctive duration constraint ("this task will take between 1 and 4 hours"). The network maintains this uncertainty and propagates it to dependent tasks. The planner sees the uncertainty in the schedule explicitly rather than having it hidden.

**Dynamic replanning**: When the actual execution deviates from the plan (a task takes longer than expected, an external dependency fails), new constraints are asserted into the network. Propagation automatically updates all affected intervals. The orchestrator can query the updated network to see which downstream tasks are now in jeopardy.

**Historical analysis**: The same network that maintained the plan can be queried after execution to understand what actually happened: which tasks ran in parallel, which sequential dependencies were honored, where bottlenecks occurred. The temporal structure of the execution is preserved in the network's interval relationships.

## The Situational Calculus Comparison

Allen explicitly contrasts his approach with the situational calculus (McCarthy and Hayes), the classical formalism for planning. The situational calculus represents time as a series of instantaneous situations, with actions as functions from one situation to the next. Its limitations, as Allen identifies them:

1. "This theory is viable only in domains where only one event can occur at a time." — No parallelism.
2. "There is no concept of an event taking time; the transformation between the situations cannot be reasoned about or decomposed." — Actions are instantaneous.
3. "The situation calculus has the reverse notion of persistence: a fact that is true at one instance needs to be explicitly reproven to be true at succeeding instants." — No frame assumption; everything must be re-asserted.

For agent orchestration, these are fatal limitations. Multiple agents run in parallel (limitation 1). Tasks take real, variable amounts of time (limitation 2). The state of the world between agent actions doesn't need to be explicitly reasserted (limitation 3).

Allen's interval algebra addresses all three:
1. Multiple overlapping intervals are natively supported.
2. Actions are intervals with duration; duration is reasoned about explicitly.
3. Persistence intervals handle the frame problem efficiently.

This is why Allen's framework, not the situational calculus, is the right foundation for temporal reasoning in multi-agent orchestration systems.

## The Limit: What Allen's Framework Cannot Plan

Allen's framework is a **consistency-maintenance system**, not a planner. It checks whether a set of temporal constraints is consistent; it does not generate plans that satisfy constraints. To use it for planning, you need a planner that generates candidate orderings and uses the constraint network to check consistency and detect conflicts.

The framework also doesn't reason about *goals* — it doesn't know that you *want* Task A to complete before Task B, only that you've *asserted* this constraint. Goal-directed planning (finding a sequence that achieves a desired state) requires additional machinery (search, heuristics, goal representation) beyond what the temporal algebra provides.

But as a substrate for planning, it is remarkably powerful. It tells planners exactly what the temporal consequences of their choices are, immediately and automatically, at low computational cost. A planner that operates over Allen's temporal network gets automatic constraint propagation, inconsistency detection, and uncertainty management "for free" — which is a substantial reduction in the planning system's complexity.
```

---

### FILE: disjunctive-uncertainty-and-epistemic-honesty.md
```markdown
# Disjunctive Uncertainty: Why Agents Must Maintain Honest Epistemic States

## The Temptation of False Certainty

Intelligent systems under pressure to act tend toward false certainty. When a planning agent needs to know whether Task A precedes Task B, the easiest answer is a definite one — "yes" or "no" — even when the honest answer is "maybe: it could be either." False certainty simplifies downstream computation but introduces errors that are hard to trace back to their source.

Allen's temporal algebra is built on a commitment to epistemic honesty. When the system doesn't know which of several temporal relations holds between two intervals, it says so — precisely, by maintaining the full set of possible relations as a disjunction. This is not a compromise or an approximation; it is the correct answer given incomplete information.

## What Disjunctive Labels Mean

In Allen's network, each arc between two interval nodes is labeled with a *subset* of the 13 possible relations. The label represents the set of relations that are consistent with all currently known facts. A label of `{<, m}` means: "Given everything we know, this pair of intervals is either in the 'before' or the 'meets' relationship — both are possible; neither is ruled out."

This is fundamentally different from:
- **Unknown**: "We have no information about this relationship." (Label would be the full set of 13.)
- **Conflicted**: "Our information is contradictory." (Label would be the empty set.)
- **Determined**: "We know exactly which relation holds." (Label is a singleton.)

The disjunctive label is a *partial knowledge state* — genuinely informative (it rules out 11 of 13 relations) but honest about what remains unresolved.

## How Disjunctions Propagate

The transitivity table handles disjunctions by taking the *union* of consequences. If A `{<, m}` B (before or meets), and B `before` C, then:

- If A `<` B and B `<` C, then A `<` C
- If A `m` B and B `<` C, then A `<` C (by the transitivity table: `T(m, <) = (<)`)

In both cases, A `<` C — so the conclusion is certain even though the premise was uncertain. The uncertainty about whether A precedes B or meets B is irrelevant when B is clearly before C; either way, A is before C.

But consider: A `{<, m}` B and B `{o, s, d}` C (B overlaps, starts, or is during C):

- `T(<, o) = {<, o, m}`, `T(<, s) = {<, o, m}`, `T(<, d) = {<, o, m}` → A `{<, o, m}` C
- `T(m, o) = {o}`, `T(m, s) = {m}`, `T(m, d) = {<, o, m}` → additional possibilities

The full union gives A `{<, o, m}` C — three possible relations, more uncertainty than either premise alone. This is correct: the uncertainty in the A-B and B-C relationships compounds into uncertainty in A-C.

## When Uncertainty Resolves

The power of Allen's approach is that uncertainty resolves automatically when new facts are asserted. If we later learn that A `meets` B (not `before`), the label is intersected with `{m}`, yielding `{m}` — and the propagation updates all downstream labels accordingly.

This means agents can start with highly uncertain states ("A and B are disjoint: `{<, m, mi, >}`"), gather more information incrementally, and watch the uncertainty resolve progressively — without ever having to choose a definite answer prematurely or restructure their belief representation when the answer becomes clearer.

Contrast this with systems that force early commitment: if a system assigns A `before` B based on insufficient evidence, and later discovers A `meets` B, it must retract the earlier assertion and potentially re-derive many downstream conclusions. Allen's system avoids this by keeping the full set of consistent possibilities until evidence makes commitment unavoidable.

## The Restriction to Intra-Pair Disjunctions

Allen is explicit about a key limitation: "One can only assert disjunctive information about the relationship of two intervals. In other words, we can assert that A is before or meets B, but not that (A meets B) or (C before D)."

This restriction — intra-pair disjunction only, no cross-pair disjunctions — is what keeps the system tractable. Cross-pair disjunctions require tracking correlations between multiple pairs simultaneously, which leads to exponential complexity.

The practical implication: if your uncertainty involves correlations between relationships ("if A meets B, then C must be before D; if A is before B, then C could be during D"), Allen's system cannot directly represent this. Each arc's label is maintained independently.

In practice, this limitation is rarely a problem. Most temporal uncertainty is genuinely about individual pairs — "I don't know whether this event preceded that one" — not about correlated pairs. When cross-pair correlations do matter, they can sometimes be handled by introducing intermediate intervals that make the correlation explicit in the network structure.

## The Information Value of Partial Knowledge

A disjunctive label with 4 elements (4 possible relations out of 13) is not "almost unknown." It is highly informative. Each eliminated relation was eliminated for a reason — because some constraint rules it out. A label of `{<, m, mi, >}` means the two intervals are definitely *disjoint* (none of the 5 overlap relations are possible). This is a strong and useful fact even though the exact relationship is uncertain.

Allen's system makes this information structure explicit. An agent querying the system gets back a set of possible relations, and can reason with this set. "The intervals are disjoint" is a valid conclusion to draw from `{<, m, mi, >}` even though the exact relation is unresolved. "The intervals might overlap" is a valid caution to draw from `{<, m, o}`.

This is the right model for agent systems operating under uncertainty: carry the full epistemic state, not a point estimate. Use the full set when the exact value matters; summarize it when a coarser fact suffices.

## Application: Multi-Source Evidence Integration

Agent systems commonly receive temporal information from multiple sources with different reliabilities. A monitoring agent might report "Task A completed before Task B" (strong evidence). A log analysis agent might report "based on log timestamps, Task A started during Task B" (weaker evidence, timestamps may be imprecise). The planner claims "Task A was scheduled before Task B" (prior assumption).

How should these be integrated?

In Allen's framework:
1. Start with all 13 relations as possible (complete uncertainty).
2. Apply the planner's prior: restrict to `{<, m, o, s, d}` (A starts before or at the same time as B).
3. Apply the monitoring agent's report: intersect with `{<, m, mi, >}` (disjoint). Result: `{<, m}`.
4. Apply the log analysis agent's report (interpreted as a soft constraint): the `during` report suggests `{d}`, but since it's uncertain, perhaps intersect with `{<, m, o, s, d}` — still restricts to `{<, m}`.
5. Final state: `{<, m}` — Task A either preceded Task B or ended exactly when Task B started.

The integration is automatic, incremental, and always produces the *most informative* state consistent with all the evidence. No source gets ignored; more certain sources restrict the set more aggressively.

## Epistemic Honesty as a System Property

Allen's commitment to maintaining disjunctive uncertainty is, at its core, a commitment to epistemic honesty: the system's representation of its knowledge state should accurately reflect what it knows and doesn't know. False certainty is a kind of dishonesty — it makes the system appear more informed than it is, which can lead downstream reasoners to trust conclusions that aren't warranted.

For agent orchestration systems, this matters at every level:
- An agent that reports "Task A completed at time T" when it only knows "Task A completed sometime between T and T+Δ" is being epistemically dishonest. Downstream agents will reason with false precision.
- An orchestrator that plans based on assumed orderings rather than known orderings may create schedules that fail when the assumed orderings turn out to be wrong.
- A monitoring system that reports "all clear" because no contradictions were detected in a system with incomplete constraint coverage is providing false assurance.

Allen's framework enforces epistemic honesty structurally: the representation cannot encode more certainty than the evidence warrants. The disjunctive label is always at least as uncertain as the evidence, never less. Certainty only increases (the label only shrinks) when positive evidence arrives. This is not merely a design preference — it is a correctness requirement for reasoning systems operating under incomplete information.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: Allen's reference interval hierarchy directly models task hierarchies. Decomposition agents should structure subtask temporal relationships as a reference interval tree, storing inter-subtask ordering constraints at the appropriate level rather than globally. Cross-subtask dependencies (the "cross-cluster interaction" problem) should be flagged explicitly and handled by elevating constraints to the shared parent level, not by ignoring them.

- **Agent Orchestration / Workflow Planning**: The interval algebra provides a formal substrate for workflow scheduling. Dependency constraints ("Task B after Task A") are `before` or `meets` relations. Parallel tasks are intervals with overlapping-compatible labels. Duration budgets are handled by the duration reasoning network. The orchestrator can detect scheduling conflicts (empty arc labels) before execution, not during.

- **Debugging and Root Cause Analysis**: When debugging distributed system failures, events must be temporally ordered with uncertain timestamps. Allen's framework allows an agent to maintain a constraint network of all events, propagate ordering constraints from whatever timestamps are available, and query "is it possible that Event X preceded Event Y?" without forcing false certainty about imprecise log timestamps. The 13-relation vocabulary captures whether events overlapped (and thus might have interfered) more precisely than simple timestamp comparison.

- **State Management / Working Memory**: Allen's persistent interval mechanism provides a principled approach to maintaining state between agent steps. Facts are indexed by persistent intervals rather than re-asserted at each step. The frame problem (what changed vs. what stayed the same) is handled by constraining interval endpoints when changes are observed, rather than by explicit retraction.

- **Knowledge Representation / Memory Systems**: Agent memory systems that store facts should include temporal metadata not just as timestamps but as interval relationships. "Fact F was true from T1 to T2" is richer than "Fact F was recorded at T." Querying "is Fact F currently true?" becomes asking whether NOW is during the F-truth interval — a query the constraint network can answer.

- **Multi-Agent Coordination**: When agents coordinate on shared tasks, they need a common temporal model. Allen's constraint network, used as a shared working memory, allows agents to assert temporal facts independently and have the propagation handle consistency. An agent that knows "my task started after the API call completed" doesn't need to coordinate explicitly with the API-calling agent — it just asserts its constraint and lets the network propagate.

- **Security Auditing / Event Sequence Analysis**: Security events form temporal sequences. Allen's algebra can determine whether an observed event sequence is consistent with a known attack pattern (modeled as a set of temporal constraints between attack events). Partial evidence (some events observed, some not) is handled by disjunctive labels. The system can answer "is it possible that this is an attack, given what we've observed?" rather than requiring complete certainty.

- **Planning / Goal Decomposition**: Plans are sequences of actions with temporal structure. Representing plans as Allen-interval networks makes conflict detection automatic (propagation will find empty labels), parallelism detection easy (arc labels that include overlap relations), and schedule updating cheap (add the new constraint, propagate, read the new schedule).

- **Natural Language Processing Agents**: Agents that parse temporal language ("while", "before", "after", "during", "until") can map directly to Allen's 13 relations. The tense system of natural language maps onto this vocabulary with high fidelity, as Allen notes his system is used "in a variety of applications" including "representing actions, events, and interactions that arise in natural language dialogues."

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: Allen's reference interval hierarchy is a direct model for orchestration hierarchies. Workflows contain phases contain tasks contain steps — each level is a reference interval for the level below. Temporal constraints at each level are maintained within that level's cluster; cross-level dependencies require explicit bridging, matching exactly how workflow engines should handle cross-task dependencies.

- **Task Decomposition**: The process decomposition example (Section 5.2, NOAH reference) shows that temporal structure mirrors task structure. When decomposing tasks, the temporal constraints between subtasks should be expressed at the subtask level and escalated to the task level only when cross-subtask interactions are detected. This prevents premature global constraint propagation that would be expensive and often irrelevant.

- **Failure Prevention**: The empty-label inconsistency detection is a failure prevention mechanism: when constraint propagation produces an empty arc label, a scheduling conflict has been detected before execution. Systems should treat this as a critical alert. Additionally, the warning about local-vs-global consistency (three-node vs. full consistency) teaches that constraint propagation gives quick feedback, but subtle inconsistencies may require targeted backtracking search — don't assume local consistency means global consistency.

- **Expert Decision-Making**: Allen's treatment of disjunctive uncertainty models how human experts reason about time: maintaining multiple possible orderings, committing to a definite one only when evidence forces it, and updating the set of possibilities as new evidence arrives. This is the right model for agent decision-making under temporal uncertainty — not "guess and commit" but "maintain the full epistemic state and commit only when necessary."