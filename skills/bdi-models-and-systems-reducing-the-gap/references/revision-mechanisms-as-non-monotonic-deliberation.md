# Revision Mechanisms as Non-Monotonic Deliberation: How Rational Inconsistency Drives Choice

## The Problem: Deliberation Is Conflict Resolution

A deep challenge in building practical rational agents is that deliberation fundamentally involves reasoning with inconsistency. Before committing to intentions, an agent has conflicting desires—states of affairs that cannot all be achieved simultaneously. Classic logical frameworks make contradictory theories useless (explosion: from ⊥ prove anything). Yet deliberation *requires* entertaining contradictory possibilities before choosing among them.

Móra et al. solve this by building their BDI model on Extended Logic Programming with paraconsistent semantics (WFSX). The crucial move: "When we introduce negative information, we may have to deal with contradictory programs. The ELP framework, besides providing the computational proof procedure for theories expressed in its language, also provides a mechanism to determine how to minimally change a logic program in order to remove contradictions" (p. 12).

This isn't just fault tolerance—it's the *computational realization of deliberation itself*. The agent:
1. Represents conflicting desires as a (potentially contradictory) logic program
2. Detects contradictions through the paraconsistent semantics
3. Uses revision to systematically explore minimal consistent subsets
4. Selects preferred revisions based on desire attributes

Deliberation becomes a *revision search process*: Find minimal changes to the program that restore consistency, prefer changes that preserve more important information.

## Paraconsistent Semantics: Giving Meaning to Contradiction

The Well-Founded Semantics eXtended for explicit negation (WFSX) is paraconsistent: It assigns meaning to contradictory programs without making everything provable. Key insight: Distinguish *local* contradiction (a specific literal is both provable and refutable) from *global* inconsistency (the entire theory is useless).

WFSX_P (the paraconsistent version) allows queries to have truth values even when the program contains contradictions. A literal L can be:
- **True**: L is provable (L ∈ I for interpretation I)
- **False**: not L is provable (not L ∈ I)
- **Contradictory**: Both L and ¬L are provable (L ∈ I and ¬L ∈ I)
- **Undefined**: Neither L nor ¬L is provable

This granularity matters for agents: If desires A and B conflict (both provably should hold, but they're mutually exclusive given action models), the contradiction is isolated to those literals. Other reasoning remains valid—the agent doesn't "lose its mind" due to conflicting desires.

The authors use this to detect when intention selection is impossible: "P' ∪ Δ ⊨ ⊥" in Definition 4 (p. 18) means the abduced actions Δ, combined with beliefs and existing intentions, entail a contradiction. This triggers revision.

## Revision as Minimal Theory Change

The ELP revision mechanism is formally defined: Given a contradictory program P and a set Rev of revisable literals, compute alternative programs P' that differ minimally from P in the truth values of literals in Rev, such that P' is consistent (p. 14).

**Revisable literals** are those the agent is willing to change to restore consistency. In the BDI model:
- During intention selection: "unsel(D)" literals (whether to unselect desire D) and abducible predicates "happens/act" (which actions to abduce)
- During belief updates: "rev_int" literal (whether to trigger intention reconsideration)

**Minimality** is defined set-theoretically: A revision is minimal if no proper subset of its changes would also restore consistency. This implements the principle of *minimal mutilation*: Change as little as possible.

The revision mechanism produces *all* minimal revisions. When multiple exist, the agent must choose. This is where preference enters.

## Preference Graphs: Encoding Deliberation Strategy

The authors extend basic revision with *preference ordering* over revisions using a labeled DAG (Definition 9, p. 20-21). The graph structure encodes "try these revisions before those."

For intention selection from desires, the graph is:
- **Bottom level**: Rev(bottom) = {happens(E, Ti, Tf), act(E, A)} — abduce actions, don't unselect desires
- **Level i**: Rev(i) = {unsel(Di)} ∪ Rev(bottom) where Di has importance rank i — unselect desires of rank i
- **Edges**: i → bottom for all i; if Des(rank_j) is less important than Des(rank_i), then level_i → level_j

Graph semantics: Try revisions at descendant nodes before ancestors. At bottom, try to satisfy all eligible desires by finding actions. If impossible, move to level 1: drop the least important desire. If still impossible, level 2: drop next-least important, etc.

Within a level, if multiple minimal revisions exist (e.g., two equally unimportant desires, can drop either), all are generated. The agent can then apply secondary criteria (e.g., "prefer more desires satisfied" from Definition 7).

This graph structure is **deliberation logic encoded as revision preferences**. Instead of a procedural algorithm ("sort desires by importance, greedily select until conflict"), the same strategy emerges from the graph's declarative structure.

## Defeasible and Abductive Reasoning Through Revision

The paper identifies two forms of non-monotonic reasoning implemented via revision:

**Defeasible Reasoning**: Rules are default—normally hold but can be overridden. "A defeasible rule is a rule of the form Normally if A then B. ELP allows us to express defeasible reasoning... To remove contradiction, we revise the truth value of revisable literals in the body of the defeasible rules" (p. 14).

In the BDI model, desires are defeasible: "holds_at(des(D, Ag, P, A), T) ← Body" normally generates an intention, but if it conflicts with higher-priority desires, the desire is defeated (unsel(D) becomes true, blocking the rule).

**Abductive Reasoning**: Explain observations by hypothesizing causes. "An observation O has an abductive explanation Δ iff P' ∪ Δ ⊨ O and P ⊨ Δ" (p. 14). The agent makes observations (goals to achieve), hypothesizes actions (abducibles) that would cause those goals, checks consistency.

When selecting candidate desires (Definition 10, p. 21), the agent performs abduction: Explain each desired property by finding a happens/act sequence that would cause it. If no consistent explanation exists for all desires, revise by dropping some.

This unifies defeasible and abductive reasoning under a single mechanism: revision with preference graphs. The same computational machinery handles both "what should I believe/intend by default?" (defeasible) and "what actions would explain/achieve this?" (abductive).

## The Revision-Based Deliberation Algorithm

Synthesizing the definitions, here's the deliberation algorithm:

```
Algorithm: Select Intentions from Desires
Input: D (desires), B (beliefs), I (current intentions), TAx (time axioms)
Output: I_P (primary intentions), Δ (abduced action sketch)

1. Compute eligible desires D':
   D' = {des ∈ D | preconditions satisfied, not already believed achieved}

2. Construct abductive framework:
   P' = ⟨B ∪ TAx ∪ I, Abd={happens, act}, IC(I) ∪ IC(D')⟩
   where IC(D') = {holds_at(bel(Ag, P), T) ← not unsel(D) | des(D, _, P, _) ∈ D'}

3. Construct preference graph:
   - Rev(bottom) = {happens, act}
   - For each importance level i: Rev(i) = {unsel(D) | importance(D) = i} ∪ Rev(bottom)
   - Edge structure: prefer bottom, then lower importance

4. Perform revision:
   Minimal_Revisions = revise(P', Revisables={happens, act, unsel(D)}, PrefGraph)

5. Select preferred revision:
   Best_Revision = select_by_secondary_criteria(Minimal_Revisions)
   // E.g., prefer more desires satisfied among equal importance

6. Extract intentions:
   D'_C = {des(D, Ag, P, A) ∈ D' | unsel(D) = false in Best_Revision}
   I_P = {int_that(D, Ag, P, A) | des(D, Ag, P, A) ∈ D'_C}
   Δ = {happens/act literals in Best_Revision}

7. Return (I_P, Δ)
```

The expensive step is revision (step 4)—searching for consistent assignments to revisable literals. But the preference graph prunes search: Explore preferred levels first, backtrack to less preferred only if necessary.

## Example: Robot Deliberation Through Revision

Return to warehouse robot (Example 16, p. 25). After sensing low battery:

**Eligible desires**: 
- D' = {des(d1, rbt, stored(a), [0.5]), des(d2, rbt, bat_charged, [0.9])}

**Preference graph**:
- Rev(bottom) = {happens, act}
- Rev(level_low) = {unsel(d1)} ∪ Rev(bottom) (d1 has importance 0.5)
- Rev(level_high) = {unsel(d2)} ∪ Rev(bottom) (d2 has importance 0.9)
- Edges: level_low → bottom, level_high → bottom (prefer bottom)

**Revision search**:

1. Try bottom level: Abduce actions satisfying both desires
   - Need: happens(e1, ...), act(e1, charge) for bat_charged
   - Need: happens(e2, ...), act(e2, store(a)) for stored(a)
   - But: charge requires at_base, store requires at_storage (mutually exclusive given single-location robot)
   - **Contradiction detected** (cannot satisfy IC(D') for both)

2. Move to next level: level_low (drop d1)
   - Set unsel(d1) = true (defeats storage desire)
   - Now IC(D') requires only bat_charged
   - Abduce: happens(e1, t1, t2), act(e1, charge)
   - Check: Consistent with beliefs (robot can reach charger)
   - **Success**: Revision found

3. No need to explore level_high (already have revision at preferred level)

**Output**:
- D'_C = {des(d2, rbt, bat_charged, [0.9])} (d1 dropped)
- I_P = {int_that(i2, rbt, bat_charged, [0.9])}
- Δ = {happens(e1, t1, t2), act(e1, charge)}

The robot commits to charging, drops storage intention. This emerges from revision mechanics—no explicit procedural code saying "if conflict, prefer higher importance."

## Hybrid Revision: Mixing Defeasible and Abductive

A subtle point: Revision simultaneously handles multiple reasoning modes. In the desire selection:

- **Abduction**: Finding happens/act literals that explain desired properties
- **Defeasibility**: Defeating desires (unsel literals) that cause conflicts

These interact: Dropping a desire (defeasible) changes which properties need explaining (abductive). If Des1 and Des2 conflict, you can either:
- Drop Des1 (set unsel(d1) = true), then abduce actions for Des2
- Drop Des2 (set unsel(d2) = true), then abduce actions for Des1

Both are valid revisions. Preference determines which to prefer (importance of Des1 vs Des2).

The revision mechanism doesn't distinguish these reasoning modes—it just searches for consistent assignments to revisable literals. The problem formulation (which literals are revisable, what constraints they participate in) determines the reasoning flavor.

This unification is powerful: You can mix multiple reasoning forms (defeasible rules, abductive hypotheses, belief revision, temporal reasoning) in a single framework, with consistent semantics.

## Implementation Considerations for Agent Systems

For WinDAG orchestration, revision-based deliberation suggests specific architectural patterns:

**1. Maintain a Contradiction-Tolerant Knowledge Base**: Don't reject inconsistent information at input—accept it and use contradiction detection as a signal. When skill outputs conflict (skill A says "vulnerability found," skill B says "no vulnerability"), don't crash or arbitrarily pick one. Record both, detect contradiction, trigger reconciliation.

**2. Define Revisable vs. Non-Revisable**: Clearly distinguish beliefs/intentions that are negotiable from those that are fixed. In a WinDAG system:
- **Revisable**: Skill selection (which skills to invoke), goal prioritization (which objectives to pursue), hypothesized facts (abduced intermediate results)
- **Non-Revisable**: User constraints (security policy), physical laws (system architecture facts), verified results (test outcomes)

This prevents revision from "explaining away" hard constraints to avoid contradictions.

**3. Implement Preference as Constraint Priorities**: Many constraint-solving systems support soft constraints with priorities (e.g., Answer Set Programming with weak constraints, SMT solvers with MaxSMT). These can implement preference graphs: Hard constraints are non-negotiable (integrity constraints), soft constraints are defeatable (desire rules), priorities define preference.

**4. Cache Revisions**: Revision search can be expensive. If the same or similar conflicts recur, cache the computed revisions. When Desires A, B conflict, remember "drop B, abduce action C" as a solution. If A, B recur later, reuse the solution (if beliefs haven't invalidated it).

**5. Incremental Revision**: When beliefs change slightly, avoid full revision. Compute a *delta*: Which parts of the previous revision are still valid? Only revise invalidated parts. This requires maintaining a dependency structure (which revised literals depend on which beliefs).

**6. Bounded Revision**: For time-critical decisions, set a budget (max search nodes, time limit). If revision doesn't complete, fall back to heuristic policies (e.g., "drop all low-priority goals, keep high-priority"). This trades optimality for responsiveness.

## When Revision-Based Deliberation Applies

This approach excels when:
- **Conflicts are expected and frequent**: Domains where contradictory requirements are normal (multi-stakeholder systems, over-subscribed resources)
- **Preferences are complex**: Simple priority rankings aren't enough; trade-offs depend on context
- **Explanations matter**: Need to justify why goals were dropped (audit trail for revision decisions)
- **Logical structure is rich**: Constraints involve implications, negations, quantifiers (not just flat scoring)

It's less suitable for:
- **Purely numerical optimization**: If deliberation is just "maximize utility function," use optimization solvers, not logic programming
- **Real-time reactive control**: Revision search latency is too high for tight control loops
- **Domains with weak structure**: If there are no clear constraints/rules, just preferences, ranking/scoring is simpler

The sweet spot: Complex, over-constrained problems where finding *any* feasible solution is non-trivial, and multiple feasible solutions exist with different trade-offs. This describes many orchestration/planning problems in agent systems.

## The Deeper Lesson: Contradiction as Computational Resource

The profound insight: Contradiction is not a failure mode—it's a *computational resource*. Classical logic treats contradiction as error (everything becomes provable). But in deliberation, contradiction signals "these options are incompatible; choice is required."

Paraconsistent semantics + revision mechanisms turn contradiction into a driver for search: Detect conflicts, systematically explore resolutions, prefer minimal mutilations. This is more principled than ad-hoc conflict resolution (e.g., "last update wins," "majority vote," "user resolves").

For WinDAG systems: Embrace contradiction at the design level. When skills produce conflicting outputs, when goals are over-constrained, when beliefs are inconsistent—don't treat these as crashes. Treat them as signals that deliberation is needed. Implement revision mechanisms to systematically explore and resolve conflicts based on declared preferences.

This requires a mindset shift: Instead of "my system must never be inconsistent" → "my system uses inconsistency as information." The architecture must *expect* contradiction and have well-defined responses (revision procedures) rather than *fear* contradiction and add defensive checks that prevent reasoning when conflicts arise.

Móra et al. demonstrate that this shift is feasible: BDI agents built on paraconsistent logic with revision mechanisms are both formally well-defined and practically implementable. The gap between theory and implementation narrows when the theory is designed from the start to be computational, with inconsistency as a feature rather than a bug.