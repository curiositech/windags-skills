# Impossibility Results and What They Teach About Coordination

## Arrow's Impossibility: No Perfect Voting System

Definition 9.4.3: A social welfare function (SWF) aggregates individual preference orderings into social ordering. Arrow's theorem (9.4.4) proves no SWF simultaneously satisfies:
1. **Pareto efficiency (PE)**: If all prefer X to Y, society ranks X > Y
2. **Independence of irrelevant alternatives (IIA)**: Ranking of X vs Y depends only on agents' pairwise preferences between X and Y
3. **Nondictatorship**: No single agent determines social ranking

With ≥3 outcomes, these three are incompatible.

The proof strategy (four steps):

1. **Extreme voter identification**: If all agents rank outcome b at top or bottom, society must too (by PE + IIA).

2. **Pivotal agent exists**: There exists an agent who can move any outcome from bottom to top by changing only their vote. Call this agent pivotal for outcome b.

3. **Pivotal agent controls pairs not involving b**: The pivotal agent for b becomes a dictator over pairs {a,c} where neither is b. Changing their ranking of a vs c changes society's ranking (by IIA and manipulation of b's position).

4. **Extension to all outcomes**: Using a third outcome, show the pivotal agent is the same for all outcomes. Therefore this agent is a dictator over all pairwise comparisons.

The profound consequence: "Every system has a flaw (violates PE, IIA, or nondictatorship)." Plurality voting violates PE (Condorcet winners may lose). Borda count violates IIA (ranking depends on irrelevant alternatives). Pairwise elimination violates IIA drastically (agenda effects). Dictatorship violates nondictatorship trivially.

For mechanism design: when aggregating preferences, you must choose which property to violate. There's no universal solution. The choice depends on domain constraints and values.

The practical implication: approval voting (Section 9.5) escapes by allowing agents to approve multiple outcomes rather than rank them. This weakens the preference structure enough to avoid impossibility. Similarly, cardinal utilities (rather than ordinal rankings) enable interpersonal comparison, sidestepping IIA issues.

## Gibbard-Satterthwaite: Truthfulness Requires Dictatorship or Restrictions

The voting impossibility extends to mechanism design. Theorem 10.2.6 (Gibbard-Satterthwaite): For social choice functions (selecting single outcome):

If:
- Agents have unrestricted preferences (any ranking possible)
- Mechanism is onto (every outcome achievable for some preference profile)
- Mechanism is truthful (reporting true preferences is dominant strategy)

Then:
- Mechanism is dictatorial (one agent determines outcome)

This connects Arrow and mechanism design: strategic truthfulness under unrestricted preferences requires either dictatorship or restricting the outcome range.

The escape routes:

1. **Restrict preference domain**: Quasilinear utilities (Section 10.3) enable VCG mechanisms. Single-peaked preferences enable median-voter mechanisms.

2. **Weaken incentive concept**: Accept Bayes-Nash incentive compatibility (Section 10.4) instead of dominant-strategy. AGV mechanism (Section 10.4.7) achieves efficiency + budget balance + ex ante individual rationality under Bayes-Nash.

3. **Accept dictatorship in small spaces**: If outcome set is binary, the dictator mechanism is trivial but sometimes acceptable.

For agent systems: don't require truthful mechanisms when agents have unrestricted preferences and arbitrary outcomes possible. Instead: (a) restrict to structured preferences (quasilinear, single-peaked), (b) accept Bayes-Nash rather than dominant-strategy, (c) limit outcome space to make dictatorship acceptable.

## Myerson-Satterthwaite: Efficiency vs. Budget Balance

Theorem 10.4.12 (Myerson-Satterthwaite): In bilateral trade (buyer and seller, private valuations), no mechanism simultaneously achieves:
- Bayes-Nash incentive compatibility
- Efficiency (trade occurs whenever buyer value > seller cost)
- Budget balance (payments sum to zero)
- Ex interim individual rationality (each agent expects non-negative utility)

This is the third impossibility triangle (after Arrow and Gibbard-Satterthwaite): you cannot have all four properties, even in simplest trading environment.

The proof intuition: efficiency requires trade at true values (allocate efficiently). Budget balance requires payments cancel. Individual rationality requires agents expect gain from participation. Incentive compatibility requires truthful reporting profitable. These four constraints overdetermine the mechanism—no solution exists satisfying all.

The escape (AGV mechanism, Section 10.4.7): Relax individual rationality from ex interim to ex ante. Agents must commit to participation before knowing their types. Then mechanism achieves:
- Dominant-strategy incentive compatibility (stronger than Bayes-Nash)
- Efficiency
- Budget balance
- Ex ante individual rationality

The key trade-off: timing of participation decision. Ex interim (after learning type): cannot achieve all four. Ex ante (before learning type): can achieve modified version.

For agent systems: when designing task allocation with unknown costs, accept that achieving efficiency + budget balance + truthfulness + individual rationality simultaneously is impossible. Choose which to relax:

- VCG (Section 10.4): Efficiency + truthfulness + individual rationality, violates budget balance (runs surplus)
- AGV (Section 10.4.7): Efficiency + truthfulness + budget balance, weakens individual rationality to ex ante
- Posted-price mechanisms: Efficiency + budget balance + individual rationality, violates truthfulness

The domain determines which trade-off is acceptable. If external budget available, use VCG. If agents can commit ex ante, use AGV. If truthfulness less critical than other properties, use posted-price.

## Roberts' Theorem: Affine Maximizers Only

The most restrictive impossibility: Theorem 10.5.5 (Roberts): With ≥3 agents, unrestricted quasilinear preferences, if a social choice function is implementable in dominant strategies, it must be an affine maximizer.

Definition: Affine maximizer has form:

$$
f^*(v) ∈ \arg\max_{x ∈ X} \sum_{i=1}^n a_i · v_i(x) + b(x)
$$

for some weights a_i ≥ 0 and function b: X → ℝ.

This says: the only truthful mechanisms (with ≥3 agents and unrestricted preferences) are weighted utilitarian maximizers plus outcome-specific constants. VCG is the special case a_i = 1 for all i, b(x) = 0.

The profound constraint: even in quasilinear setting (escaping Gibbard-Satterthwaite), dominant-strategy implementation restricts to tiny class of mechanisms. You cannot implement non-utilitarian social choice functions (e.g., maximin, leximin, fair division) truthfully.

The escape routes:

1. **Weaken to Bayes-Nash**: Many more mechanisms implementable (but require distributional assumptions).

2. **Accept restricted domains**: Single-parameter mechanisms (Chapter 11) enable richer solution concepts while maintaining truthfulness.

3. **Use computational hardness**: Feasibly truthful mechanisms (Section 10.5.2) leverage bounded rationality to prevent manipulation without satisfying Roberts' conditions.

For agent systems: when requiring dominant-strategy truthfulness with ≥3 agents and unrestricted preferences, use affine maximizers (weighted VCG). If non-utilitarian objectives required (e.g., fairness, min-max, robustness), either weaken to Bayes-Nash or restrict preference domain.

## The VCG Impossibility Triad

Theorem 10.4.11 synthesizes multiple results: VCG mechanisms achieve:
- Dominant-strategy truthfulness
- Efficiency (maximize social welfare)
- Individual rationality

But violate:
- Budget balance (payments typically don't sum to costs)

And suffer computational issues:
- Section 10.4.5: VCG requires solving NP-hard optimization problems in many domains
- Theorem 4.2.3: Even checking if a strategy profile is Nash equilibrium can be NP-hard

The frugality problem: VCG can overpay dramatically. Example (Section 10.4.2, shortest-path network): path cost 5, VCG payments sum to 9. With k agents on path, payments = k(1+ε) times cost.

This is not a bug—it's fundamental. The payments must make agents indifferent between lying and truthtelling. This requires compensating for potential losses from truthful reporting. In competitive environments, this compensation grows with number of agents.

For agent systems: VCG is powerful (truthful + efficient) but expensive (budget imbalance) and computationally hard (NP-hard allocation in many domains). Use when:
- External budget available to cover deficit
- Problem size small enough for exact optimization
- Efficiency dominates other concerns

Otherwise, use approximations (Groves-based mechanisms, computational hardness, Bayes-Nash mechanisms).

## The Multicast Cost-Sharing Trilemma

Section 10.6.3 proves explicitly: no mechanism simultaneously achieves:
- Dominant-strategy truthfulness
- Efficiency (all agents who value service ≥ marginal cost receive it)
- Budget balance (costs exactly covered)

Must choose two:

**Option A: Shapley Value (Truthful + Budget-Balanced)**
- Agents dropped if they can't afford average-cost payment
- Inefficient: some agents value service ≥ marginal cost but pay > marginal cost
- Requires centralized computation (Ω(|N|) communication, Theorem 10.6.5)

**Option B: VCG (Truthful + Efficient)**
- All agents who value ≥ marginal cost receive service
- Budget imbalanced: typically runs surplus
- Admits distributed computation (2 messages per link, Theorem 10.6.6)

**Option C: Neither (Efficient + Budget-Balanced)**
- Requires non-truthful mechanism (agents may misreport)
- Can use approximate mechanisms or domain restrictions

The choice depends on domain constraints:
- Network services (scarce capital, must cover costs): use Shapley
- Public goods (efficiency paramount, budget available): use VCG
- Competitive markets (no central authority): use neither, accept inefficiency

For agent systems: when orchestrating tasks with shared costs (infrastructure, data pipelines, compute resources), recognize this trilemma. Choose two properties based on domain:
- If cost recovery critical: Shapley (budget balance + truthfulness)
- If efficiency critical: VCG (efficiency + truthfulness)
- If neither critical: simple Posted-price or congestion-based mechanisms

## The Revelation Principle's Hidden Costs

Section 10.2.2 proves the revelation principle: any equilibrium of an indirect mechanism can be implemented via direct mechanism where truthtelling is optimal. This seems to simplify mechanism design—just consider direct mechanisms.

But three hidden costs:

**Cost 1: Computational burden shifts to mechanism**: "The general effect of constructing a revelation mechanism is to push an additional computational burden onto the mechanism...There are many settings in which agents' equilibrium strategies are computationally difficult to determine."

Computing equilibrium strategies (to embed in direct mechanism) may be PPAD-complete. The mechanism must solve this problem to simulate agents' best responses.

**Cost 2: Multiple equilibria may arise**: "Even if the original indirect mechanism had a unique equilibrium, there is no guarantee that the new revelation mechanism will not have additional equilibria."

Direct mechanism may have spurious equilibria where agents coordinate on suboptimal truthful reports. The original indirect mechanism's strategic structure may have selected uniquely.

**Cost 3: Privacy loss**: Indirect mechanisms (e.g., ascending auctions) reveal only outcome. Direct mechanisms require full type revelation (valuations, costs, preferences). This may not be acceptable (competitive sensitivity, strategic information).

For agent systems: don't automatically apply revelation principle. Sometimes indirect mechanisms preferable:
- Ascending auctions computationally simpler (agents don't compute full valuations)
- Iterative protocols preserve privacy (partial information revealed)
- Strategic complexity may select better equilibria

Use revelation principle for theoretical analysis (characterizing implementable outcomes) but implement indirect mechanisms when computational or privacy costs dominate.

## The Strong Equilibrium Gap in Matching

Section 10.6.4 (stable matching) reveals: no mechanism implements stable matching in dominant strategies with both sides strategic (Theorem 10.6.16).

Proof: two students, two advisors. Two stable matchings exist: µ (student-optimal), µ' (advisor-optimal). If mechanism selects µ, advisors can profitably lie to force µ'. If mechanism selects µ', students can lie to force µ. No selection rule makes truthfulness dominant for both sides.

The escape: asymmetric honesty (Theorem 10.6.18). "Under the direct mechanism associated with the student-application version of the deferred acceptance algorithm, it is a dominant strategy for each student to declare his true preferences" when advisors are compelled honest.

This creates coordination through asymmetric trust: one side (advisors) must be institutionally forced truthful for mechanism to work for other side (students). Not all coordination problems admit symmetric solutions.

For agent systems: when two-sided coordination fails (no mechanism truthful for both sides), designate one role as trusted:
- Marketplace coordinator (mediates between providers and consumers)
- Task queue (system-managed, no strategic incentive)
- Registry service (neutral database of capabilities)

Then use one-sided dominant-strategy mechanisms. The trusted side enables coordination impossible with fully strategic agents.

## Synthesis: The Impossibility Landscape

Five fundamental impossibilities:

1. **Arrow**: No perfect voting system (PE + IIA + nondictatorship impossible)
2. **Gibbard-Satterthwaite**: Truthful voting requires dictatorship or restrictions
3. **Myerson-Satterthwaite**: Efficiency + budget balance + truthfulness + IR impossible
4. **Roberts**: Only affine maximizers implementable in dominant strategies (≥3 agents, unrestricted preferences)
5. **Stable matching**: No bilateral dominant-strategy mechanism exists

Each impossibility defines trade-offs:
- Arrow → choose which property to violate (PE vs. IIA vs. nondictatorship)
- Gibbard-Satterthwaite → restrict preferences or weaken truthfulness
- Myerson-Satterthwaite → relax efficiency, budget balance, or IR
- Roberts → use Bayes-Nash or restrict domains
- Stable matching → use asymmetric trust or accept non-dominant-strategy

The meta-lesson: **every coordination mechanism has fundamental limits.** Perfect solutions don't exist—only informed choices among imperfect alternatives. Intelligent system design requires understanding which properties matter for the domain and which can be sacrificed.

For WinDAGs orchestration: when allocating 180+ skills across tasks:
- Accept that perfect truthfulness + efficiency + budget balance is impossible
- Choose based on domain: if efficiency paramount, use VCG (accept deficit); if budget critical, use Shapley (accept inefficiency)
- Use asymmetric trust: designate orchestrator as trusted coordinator, skills are strategic
- Restrict preferences: quasilinear utilities for task completion times enable VCG-style mechanisms
- Exploit structure: if tasks have congestion structure, use potential games (myopic convergence, no sophisticated mechanism needed)

The profound synthesis: **impossibility results aren't obstacles—they're design guides.** They tell you which combinations of properties are achievable and which trade-offs are fundamental. Rather than pursuing impossible ideals, design mechanisms optimizing achievable combinations of properties relevant to your domain.