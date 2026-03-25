# The Thirteen Relations: Representing Uncertainty Without Collapsing It

## The Problem with Forcing Certainty

A common failure in knowledge systems is *premature commitment*: when the system does not know the exact relationship between two things, it is forced to guess, because the representation only allows certain relationships. The uncertainty is hidden, the guess is stored as fact, and downstream reasoning proceeds as if it were known. When the guess turns out to be wrong, retracting it is expensive or impossible.

Allen's interval algebra solves this problem elegantly. The 13 temporal relations are *mutually exclusive and jointly exhaustive*: for any two intervals, exactly one of the 13 holds. This means uncertainty about the relationship can be represented honestly as a *subset* of {<, >, =, m, mi, o, oi, d, di, s, si, f, fi}. A fully uncertain relationship is represented as the full set of 13. A fully certain relationship is a singleton set. Partial knowledge is a set of intermediate size.

Crucially: **the system never has to guess**. It maintains the full set of possibilities until evidence eliminates some of them. This is the correct approach to reasoning under uncertainty in any domain.

## The Algebra of Possibilities

Let us walk through what the different set sizes mean in practice.

**Full set (13 possibilities)**: "I know these two intervals exist, but I know nothing about how they are ordered." This is the state of a newly-added interval with no temporal context. It is not ignorance — it is honest uncertainty, represented precisely.

**Large set (8–12 possibilities)**: "I know something weak about the ordering." For example, {<, m, o, s, d} means "I can't come before J," which eliminates the inversions and equivalence. This arises when you know one interval doesn't contain another but can't say more.

**Medium set (2–7 possibilities)**: "I know something specific but not everything." For example, {o, m} means "I overlaps or meets J" — the intervals definitely intersect, but I don't know whether I starts before J's start or exactly at it.

**Singleton (1 possibility)**: "I know exactly how these intervals are related." For example, {<} means "I is definitely before J."

**Empty set (0 possibilities)**: "Inconsistency detected." The accumulated constraints are mutually contradictory. This is a signal that something is wrong with the input facts.

This spectrum from full uncertainty to full certainty, passing through precise partial knowledge, is exactly what a real-world knowledge system needs. Most temporal relationships in natural language, planning, and history are not known with point precision. They are known with interval precision: "during," "before," "after," "while" — all of which correspond to Allen's relations.

## Disjunction Without Explosion

What makes Allen's uncertainty representation computationally tractable is the *form* of disjunction it allows. You can express:

- "A is before or meets B" (a disjunction about the relationship between A and B)
- "A is during, starts, or finishes B" (another disjunction about A and B)

But you *cannot* express:

- "(A meets B) OR (C before D)" (a disjunction across different interval pairs)
- "Either A overlaps B, or C and D are concurrent" (cross-entity disjunction)

This restriction is the key to tractability. Because each arc is labeled with a *set of possible relationships for that specific pair*, and because the transitivity table is defined over these sets, the constraint propagation algorithm can work locally without considering combinations of facts from different arcs.

Full propositional logic over temporal relations would allow cross-arc disjunctions, but constraint propagation would no longer work — you would need SAT solving, which is NP-hard. Allen's system accepts this limitation explicitly: "This balance between expressive power and computational efficiency is achieved by the restricted form of disjunctions allowed in the system" (p. 841).

For agent systems, this is a critical design lesson: **define your uncertainty representation so that the allowed forms of disjunction match the computational machinery you have available**. If you need only local disjunctions (uncertainty about a specific relationship), constraint propagation works. If you need global disjunctions (uncertainty spanning multiple relationships), you need SAT or probabilistic reasoning, with the associated cost.

## The Disjoint Knowledge Problem

Allen introduces this case to show something date-based systems cannot express: "The fact that two events, A and B, did not happen at the same time cannot be represented using fuzzy dates for A and B. Either we must decide that A was before B, or B was before A, or we must assign date ranges that allow A and B to overlap" (p. 833).

In interval algebra, "A and B did not happen at the same time" is represented as the arc label {<, >, m, mi} — the four relations that do not involve overlap or containment. This is a *positive* representation of disjointness. The system knows that A and B are disjoint without knowing which is first.

This capability matters for any system that must represent *negative knowledge* — facts of the form "X and Y are not in the same state," "A and B do not overlap," "I and J cannot be concurrent." Negative knowledge is pervasive in planning (resource conflicts, mutual exclusion), in scheduling (tasks that cannot run simultaneously), and in natural language (temporal connectives like "while he was away, we...").

Date-based and point-based systems force you to resolve disjointness into a specific ordering. Interval algebra with set-labeled arcs does not. This is a real capability advantage for systems that must reason about partially-ordered events.

## The Consistent Labeling Problem and Its Practical Resolution

Allen's three-node consistency guarantee comes with a caveat: networks that are locally consistent (every triple is consistent) may be globally inconsistent. He provides a concrete four-node example (Figure 5) where the arc labels {f, fi} for A-to-C are locally consistent with their neighbors, but no global consistent labeling exists.

The practical resolution is:
1. Run the cheap constraint propagation for routine inference
2. When global consistency is critical (e.g., before committing to a plan), run backtracking search over the arc labelings for the relevant subnetwork
3. The search is exponential in the worst case but typically fast for the small, structured subnetworks that arise in practice

For agent systems, this suggests a *tiered consistency checking* strategy:
- **Level 1**: Constraint propagation (polynomial, incomplete). Run always, on every fact addition.
- **Level 2**: Local consistency checking for critical subnetworks (potentially expensive). Run before committing to irreversible actions.
- **Level 3**: Full global consistency (exponential). Run only in offline analysis or when errors are detected.

This tiered approach matches how human experts reason: most inferences are made quickly and approximately; careful checking is done only for high-stakes decisions.

## Application: Representing Agent Beliefs with Honest Uncertainty

In a multi-agent system, agents often have incomplete or conflicting information about the same facts. The naive approach is to pick one agent's information and ignore the others, or to average beliefs, or to require consensus before acting.

Allen's approach suggests a better model: maintain a *set-labeled belief network* where each arc represents the set of relationships that are *consistent with all available evidence*. When agents report conflicting facts, the intersection of their reported constraint sets is the honest representation of what is jointly consistent. An empty intersection signals a contradiction that must be resolved before proceeding.

This is directly applicable to:
- **Task dependency graphs**: "Is task A before task B?" — maintain a set of possible orderings, narrow it as dependencies are discovered
- **Resource allocation**: "Which agent is assigned to which task?" — maintain sets of possible assignments, constrain from available evidence
- **State tracking**: "What state is the system in?" — maintain the set of consistent states, eliminate states as observations arrive

The key principle: **never force a commitment to a specific relationship when honest uncertainty is possible**. Premature commitment is a failure mode, not a solution.