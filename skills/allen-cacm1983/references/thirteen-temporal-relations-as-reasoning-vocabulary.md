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