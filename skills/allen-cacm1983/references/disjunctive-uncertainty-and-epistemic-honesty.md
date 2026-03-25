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