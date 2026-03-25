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