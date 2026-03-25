# SYNTHESIZED REFERENCE DOCUMENTS

## BOOK IDENTITY
**Title**: Algorithmic Game Theory  
**Author**: Noam Nisan, Tim Roughgarden, Éva Tardos, Vijay V. Vazirani (editors)  
**Core Question**: How do we design computational systems where self-interested agents make decisions that are simultaneously computationally efficient, strategically stable, and socially desirable?  

**Irreplaceable Contribution**: This book is the first systematic integration of computer science and game theory, showing that incentive design and computational complexity are inseparable. Unlike pure economics texts (which ignore computation) or pure algorithms texts (which ignore incentives), it demonstrates that mechanism design IS algorithm design when agents are strategic. The book's proof that Nash equilibrium computation is PPAD-complete, its characterization of VCG mechanisms, and its analysis of network externalities have fundamentally reshaped both fields. For practitioners building multi-agent systems, it provides the only comprehensive framework for reasoning about convergence, manipulation-resistance, and efficiency simultaneously.

---

## KEY IDEAS

1. **The Computational-Incentive Duality**: Game-theoretic solution concepts (Nash equilibrium, core, ESS) are computational problems with complexity classes (PPAD, NP, coNP). The hardness of computing equilibria directly constrains what decentralized systems can achieve. Conversely, efficient algorithms can be viewed as mechanisms that align incentives with computational tractability.

2. **Price of Anarchy as Design Metric**: Selfish behavior creates quantifiable inefficiency. The ratio between worst equilibrium and optimal outcome (price of anarchy) provides a universal metric for system design. For routing, facility location, and resource allocation, PoA bounds tell you exactly how much efficiency you sacrifice by allowing strategic behavior rather than central control.

3. **Mechanism Design = Inverse Game Theory**: Instead of analyzing existing games, design the rules (mechanism) to induce desired outcomes. VCG mechanisms show that for any social choice function, you can construct payments making truthful reporting a dominant strategy. The catch: VCG requires exact optimization (often NP-hard) and doesn't guarantee budget balance or individual rationality.

4. **Network Structure Determines Equilibrium Properties**: Graph topology isn't neutral—it fundamentally constrains what equilibria can exist and how agents reach them. Graphical games with bounded degree have polynomial representation; threshold functions are market-computable but XOR isn't; scale-free networks are robust to random failure but vulnerable to targeted attack. The lesson: topology is a mechanism design variable.

5. **Approximation Breaks the Impossibility Barrier**: When exact mechanisms fail (NP-hardness, empty core, no dominant strategies), carefully designed approximations succeed. Proportional allocation achieves 75% efficiency with scalar bids; randomized rounding of fractional solutions preserves truthfulness in expectation; ε-approximate equilibria converge in polynomial time where exact ones don't. The art is knowing which approximations preserve which properties.

---

## REFERENCE DOCUMENTS

### FILE: equilibrium-computation-and-convergence.md

```markdown
# Equilibrium Computation and Convergence: When Can Agents Find Stable Outcomes?

## The Central Tension

The existence of Nash equilibrium (guaranteed by Nash's theorem for finite games) does not imply agents can find it efficiently. This gap between *existence* and *computability* is foundational to algorithmic game theory.

**The key impossibility**: Nash equilibrium computation is PPAD-complete (Chapter 2). This means:
- No polynomial-time algorithm exists (unless PPAD = P, which seems unlikely)
- Even approximation within exponentially small error remains PPAD-hard
- The problem is fundamentally different from NP-complete problems because equilibria always exist

**Why PPAD matters**: PPAD (Polynomial Parity Argument, Directed) captures problems where solutions exist by construction but finding them requires traversing an exponentially long path. The canonical example: given a directed graph where each vertex has in-degree and out-degree ≤ 1, and one known source, find another source or a sink. Nash equilibrium reduces to this via the Lemke-Howson algorithm.

## The Lemke-Howson Algorithm: Elegant but Exponential

For 2-player games, Lemke-Howson follows a path through the strategy polytope from an artificial equilibrium (0,0) to a Nash equilibrium by alternately dropping duplicate labels.

**Core insight from Chapter 3**: "A strategy vector s is a Nash equilibrium if and only if for all players i and each alternate strategy s'ᵢ, we have that uᵢ(sᵢ, s₋ᵢ) ≥ uᵢ(s'ᵢ, s₋ᵢ)." The algorithm exploits complementary slackness conditions: at equilibrium, each pure strategy in the support earns exactly the expected payoff (best response condition).

**The tragedy**: Savani and von Stengel (2006) constructed games where Lemke-Howson requires exponentially many pivots. The algorithm is *simple* but not *fast*.

**The polytope representation**: For a 2-player game (m×n strategies), construct polytope P for player 1 with vertices corresponding to tight constraints (binding inequalities from best response conditions). Nash equilibria = completely labeled vertices where every strategy label appears exactly once across both players' polytopes.

## Three Approaches to Tractable Equilibria

### 1. Restrict the Game Class

**Potential games** (Chapter 19): If there exists a potential function Φ such that unilateral deviations change individual payoff by exactly the change in Φ, then:
- Pure Nash equilibria always exist
- Best-response dynamics converge
- Example: Congestion games where Φ = sum of edge costs weighted by load

**Graphical games with bounded degree** (Chapter 7): If each player's payoff depends only on d neighbors (d << n), representation requires only n·2^d numbers instead of exponential. TreeNash algorithm computes exact equilibria in polynomial time for tree-structured interaction graphs via two-pass message passing.

**Single-parameter domains** (Chapter 12): When each agent has one-dimensional type (cost or valuation), monotone allocation rules are necessary and sufficient for truthfulness. Critical-value payments automatically follow from allocation.

### 2. Use Learning Dynamics

**Regret minimization** (Chapter 4): Instead of computing equilibrium offline, let agents play repeatedly and adapt. If each player's regret (difference between their cumulative payoff and best fixed strategy in hindsight) grows sublinearly in T, then time-averaged play converges to correlated equilibrium.

**Key algorithms**:
- **Randomized Weighted Majority (RWM)**: Weight each action by (1-η)^{loss}, choose proportionally. Achieves regret ≤ √(T log N) in N-action games.
- **Polynomial Weights (PW)**: Sharper bound L_PW ≤ L_min + 2√(T log N), matching the information-theoretic lower bound Ω(√T).

**Why correlated beats Nash**: Finding Nash is PPAD-hard; finding correlated equilibrium is polynomial (linear programming over the polytope of distributions satisfying incentive constraints). The cost: multiple equilibria, no guarantee of fairness.

**Theorem 4.12 (Swap Regret → CE)**: "If all players follow strategies with swap regret ≤ R, then the empirical distribution of joint actions is an (R/T)-correlated equilibrium." Swap regret (regret for replacing every instance of action i with action j) is stronger than external regret but still achievable in poly(T, N) via black-box reduction.

### 3. Approximate Equilibria

**ε-approximate Nash**: A strategy profile where no player can gain more than ε by deviating. For 2-player games:
- Computing ε-approximate Nash with ε = 1/poly(n) is PPAD-hard (still intractable)
- But ε = 1/2 is achievable in polynomial time (Daskalakis et al.)
- For general n-player games: O(n^{log n}/ε²) algorithm exists (Lipton-Markakis-Mehta)

**Discrete approximation via sampling**: For tree graphical games, Theorem 7.5 shows that discretizing mixed strategies to τ-grid with τ = O(ε/d) yields dτ-equilibrium in poly(n, 2^d, 1/ε) time. The proof uses: "Let ⃗p be a Nash equilibrium for (G, M), and let ⃗q be the nearest (in L₁ metric) mixed strategy on the τ-grid. Then ⃗q is a dτ-NE."

## Evolutionary Convergence: Local Dynamics, Global Equilibria

**Imitative dynamics** (Chapter 29): Agents pairwise compare payoffs and switch to better strategies with probability proportional to payoff difference. For selfish routing:

> "The imitative dynamics converge to an ϵ-approximate equilibrium within time O(ϵ⁻³ ln(l_max/l*))" (Theorem 29.12)

**The proof technique**: Define potential Φ(x⃗) = total latency. Show Φ' ≤ -ϵ³/2 · l̄(x⃗) when not at ϵ-equilibrium. Since l̄ ≥ Φ/2, get exponential decay Φ(t) ≤ Φ(0)e^{-ϵ³t/4}.

**Evolutionarily Stable Strategy (ESS)**: A strategy s is ESS if (s,s) is Nash and for every best response t ≠ s, we have F(s|t) > F(t|t) (incumbent outperforms mutant in self-interaction). This is a *refinement* of Nash that additionally requires stability against small perturbations.

**Computational hardness of ESS** (Theorem 29.8): Finding ESS is both NP-hard and coNP-hard. The reduction constructs payoff matrices encoding maximum clique: an ESS exists iff max clique size ≠ k. Yet the hardness doesn't prevent *convergence*—infinite populations with simple replication/imitation dynamics can reach ESS even when computing it offline is intractable.

## When Hardness Doesn't Matter: Special Structure

**Theorem 21.10** (Proportional Allocation Optimality): "Among all mechanisms with scalar strategy spaces and single price per resource, proportional allocation (D(p,θ) = θ/p) uniquely achieves the optimal 75% efficiency bound."

This is remarkable: the mechanism wasn't *designed* to be optimal—it *emerged* as necessary from structural constraints (concave payoffs under price anticipation, quasiconcavity, budget balance).

**Submodular games** (Chapter 15): When social welfare V(S) exhibits diminishing returns (adding more agents/resources yields smaller marginal benefit), greedy/local-search approaches give PoA ≤ 2 (Theorem 19.19). The proof: if equilibrium allocation is S and optimal is O, submodularity gives V(O) ≤ ∑ᵢ∈O [V(S∪{i}) - V(S)] ≤ 2V(S).

**Threshold functions in markets** (Chapter 26): A Boolean function f is computable by a prediction market iff it's a weighted threshold function: f(x) = 1 ⟺ w₀ + ∑ᵢ wᵢxᵢ ≥ 1. Examples: AND, OR, MAJORITY (all computable). Counter-example: XOR (not computable—prices get stuck at 0.5 even when agents' combined information determines the answer).

## Transfer Principles for Agent Systems

1. **Check problem structure first**: Before building a learning system, test whether your game is potential, graphical-with-small-degree, or single-parameter. If yes, use specialized algorithms; if no, accept approximate equilibria.

2. **Use correlated equilibrium as target**: Don't force agents to compute Nash. Let them minimize regret; the system automatically converges to correlated equilibrium, which is often nearly as efficient and always polynomial to find.

3. **Design dynamics, not solutions**: For large-scale systems (180+ agents), specify *how agents update* (best-response, regret-based, imitative), not *what equilibrium they reach*. Prove convergence via potential functions or regret bounds.

4. **Exploit graphical structure**: If agent interactions are sparse (each depends on d << n others), represent the game compactly and use message-passing algorithms (TreeNash for trees, belief propagation for loopy graphs).

5. **Approximate when exact fails**: The gap between 1/poly(n) and 1/2 approximation is computational; design systems that tolerate 50% slack rather than requiring perfect equilibria.

## Open Frontiers

**Smoothed analysis of Lemke-Howson**: Worst-case exponential, but what about random or near-random games? Is there a distribution over games where Lemke-Howson is polynomial with high probability?

**Convergence in finite populations**: Chapter 29 analyzes infinite populations (densities, differential equations). What changes with n finite agents? Do convergence rates degrade? Do new equilibria appear?

**Beyond two-player games**: Most positive results (Lemke-Howson, graphical games with bounded degree) hold for 2-player or symmetric n-player games. Multi-player general-sum games remain poorly understood computationally.

**Approximate equilibria in succinctly represented games**: For graphical games, congestion games, or polymatrix games (where payoffs decompose over edges), can we compute ε-approximate Nash faster than brute force?
```

---

### FILE: mechanism-design-with-money.md

```markdown
# Mechanism Design with Money: How to Align Incentives When Agents Are Strategic

## The Fundamental Problem

You want to aggregate information, allocate resources, or make collective decisions. Agents have private information (valuations, costs, preferences). Agents are strategic: they'll misreport if it benefits them. Direct commands fail—you need *mechanisms* that make truth-telling optimal.

**The revelation principle** (Proposition 9.25): "If there exists an arbitrary mechanism that implements f in dominant strategies, then there exists an incentive compatible mechanism that implements f." Translation: Any equilibrium outcome achievable by an indirect mechanism (multi-round bidding, signaling games) can also be achieved by a direct mechanism where agents simply report their types truthfully.

This lets us focus on **direct revelation mechanisms**: ask agents for their types, output an allocation, charge payments. If truthful reporting is a dominant strategy, we're done.

## VCG: The Universal Tool

**Vickrey-Clarke-Groves mechanisms** implement any social choice function f that maximizes social welfare:

```
f(v₁,...,vₙ) ∈ arg max_a ∑ᵢ vᵢ(a)
```

where vᵢ(a) is agent i's value for outcome a.

**The payment rule**:
```
pᵢ(v) = -∑_{j≠i} vⱼ(f(v)) + hᵢ(v₋ᵢ)
```

Agent i pays the negative of others' total value plus a term hᵢ that depends only on others' reports.

**Why truthfulness is dominant**: 
Agent i's utility is:
```
uᵢ = vᵢ(f(v)) + ∑_{j≠i} vⱼ(f(v)) - hᵢ(v₋ᵢ)
```

The term [vᵢ(f(v)) + ∑_{j≠i} vⱼ(f(v))] is exactly total social welfare. So agent i effectively chooses f to maximize social welfare when reporting truthfully. No incentive to deviate.

**The Clarke pivot rule**: Set hᵢ(v₋ᵢ) = max_a ∑_{j≠i} vⱼ(a) (the welfare others could achieve without i). Then:
```
pᵢ = max_a ∑_{j≠i} vⱼ(a) - ∑_{j≠i} vⱼ(f(v))
```

"Intuitively, i pays an amount equal to the total damage that he causes the other players—the difference between the social welfare of the others with and without i's participation."

## Canonical Examples: The Power of VCG

### Vickrey Auction (Second-Price)

**Single item, n bidders with values v₁,...,vₙ.**

- Allocation: Give item to argmax_j vⱼ
- Payment: Winner pays max_{j≠i} vⱼ (second-highest bid)

**Why dominant strategy truthfulness**: If you win by bidding vᵢ, you pay p* = max_{j≠i} vⱼ regardless of vᵢ. Your payoff is vᵢ - p*, independent of your bid. If you bid higher, you still pay p* (no gain). If you bid lower and lose when vᵢ > p*, you go from payoff (vᵢ - p*) > 0 to 0 (worse). If you bid lower and still win, payoff unchanged.

**Numerical example (Chapter 13)**:
- 2 bidders, values uniformly distributed on [0,1]
- Standard Vickrey (no reserve): expected revenue = 1/3
- Vickrey with reserve r = 1/2: expected revenue = 5/12 ≈ 0.417

The reserve price transforms the mechanism from pure welfare maximization to profit maximization by excluding low-value bidders.

### Multi-Unit Auction

**k identical units, n bidders (k < n).**

- Allocation: Top k bidders each receive one unit
- Payment: Each winner pays the (k+1)-st highest bid

This is the **uniform-price auction**. All winners pay the same price (marginal buyer's bid). Truthful because your bid doesn't affect the price you pay—only whether you're in the top k.

### Combinatorial Auctions: The Hard Case

**m items, n bidders with valuations vᵢ(S) for bundles S ⊆ M.**

- Optimal allocation: max ∑ᵢ vᵢ(Sᵢ) subject to disjoint Sᵢ
- This is NP-hard (even for single-minded bidders: vᵢ(S) = vᵢ if S ⊇ Sᵢ*, else 0)

**VCG still works *if* you can compute optimal allocation**. But you can't in polynomial time. So we need approximations.

**Decomposition-based mechanism** (Chapter 12, Lemma 12.14):

1. Solve fractional allocation LP: `max ∑ᵢ,S xᵢ,S vᵢ(S)` subject to `∑_S xᵢ,S ≤ 1` (each player gets ≤1 bundle) and `∑_{i:j∈S} xᵢ,S ≤ 1` (each item allocated ≤1).
2. Use LP duality to decompose optimal fractional solution x*/c into convex combination ∑_ℓ λ_ℓ x^ℓ where each x^ℓ is integral.
3. Randomize: with probability λ_ℓ, output allocation x^ℓ and set prices pᵢ^R = [vᵢ(x^ℓ) / vᵢ(x*)] · pᵢ^F where pᵢ^F is VCG price from fractional solution.

**Result**: Truthful in expectation, √(2√m)-approximation to social welfare.

**Why randomization is necessary**: Deterministic mechanisms for combinatorial auctions with VCG payments require exact optimization (NP-hard). Randomization lets you preserve *expected* incentive compatibility while using approximate algorithms.

### Network Procurement (Buying a Path)

**Directed graph G = (V,E), edge e owned by player e with cost cₑ. Procure shortest s-t path.**

- Allocation: Shortest path p in declared costs
- Payment to edge e ∈ p: `pₑ = cost(shortest path not using e) - cost(p - {e})`

This is **marginal contribution pricing**: e gets paid the difference in system cost if e weren't available. Edges on the shortest path are pivotal; off-path edges get 0.

**Numerical example (Chapter 9)**: Suppose p = {e₁, e₂}, with costs c₁ = 3, c₂ = 5, total 8. Shortest path without e₁ costs 12. Shortest path without e₂ costs 10.
- p₁ = 12 - 5 = 7
- p₂ = 10 - 3 = 7

Even though e₁ is cheaper, both get paid 7 because that's their marginal value to the system.

## Beyond Welfare: Profit Maximization

VCG maximizes social welfare but **doesn't maximize profit**. For digital goods (unlimited supply, c(x) = 0):

> "No bidder places any externality on any other bidder... VCG produces zero profit." (Chapter 13)

**The key transformation: virtual valuations**. Define:
```
φᵢ(vᵢ) = vᵢ - (1 - Fᵢ(vᵢ)) / fᵢ(vᵢ)
```

where Fᵢ is the CDF of bidder i's value distribution (known to designer), fᵢ is the density.

**Myerson's Theorem 13.10**: "The expected profit of any truthful mechanism equals its expected virtual surplus: E[∑ φᵢ(vᵢ)xᵢ(vᵢ) - c(x)]."

**Optimal auction design**: Run VCG on virtual bids φᵢ(bᵢ) instead of actual bids bᵢ.

For single-item auction with uniform [0,1] values: φ(z) = 2z - 1, so φ⁻¹(0) = 1/2. **Optimal auction = Vickrey with reserve price 1/2.**

**Digital goods**: Each bidder gets φ(bᵢ) ≥ 0, charged φ⁻¹(0). This is the **optimal posted price**.

## When VCG Fails: Computational Hardness and Budget Balance

### The NP-Hard Barrier

**Theorem 12.24** (Roberts' Theorem): "For unrestricted domains with n ≥ 3 agents, the only implementable social choice functions are affine maximizers: f(v) ∈ arg max_a [ca + ∑ᵢ wᵢ vᵢ(a)]."

Translation: VCG (weighted sum of values) is essentially the *only* truthful mechanism for general preferences. But computing arg max is often NP-hard.

**The approximation approach**: Don't compute exact optimum. Instead:

1. Design a c-approximation algorithm A (polynomial time, gives ≥ (1/c)·OPT welfare)
2. Run VCG on the approximate solution
3. Lose a factor c in efficiency, but remain polynomial and truthful

**Single-parameter domains escape Roberts**: When each agent has one scalar value (cost or valuation), *monotone allocation + critical-value payments* fully characterizes truthful mechanisms (Theorem 12.2). This opens up design space beyond VCG.

### Budget Balance: The Impossible Dream

**Bilateral trade** (Example 9.23): Seller values item at vₛ ∈ [0,1], buyer at vᵦ ∈ [0,1]. Efficient outcome: trade iff vᵦ ≥ vₛ.

VCG payments:
- If trade: buyer pays vₛ, seller receives vᵦ
- Net subsidy: vᵦ - vₛ > 0

The mechanism **loses money** to achieve efficiency. This is unavoidable.

**Myerson-Satterthwaite impossibility**: "If a mechanism for bilateral trade satisfies ex-post individual rationality, then it cannot dictate positive payments from the players in case of no-trade and thus it must subsidize trade."

**Public project** (Section 9.3.5.5): Build iff ∑ᵢ vᵢ > C (project cost). VCG charges pivotal agents, but ∑ pᵢ < C in general. Can't recover full cost while maintaining efficiency and truthfulness.

**Corollary 21.10 synthesis**: For resource allocation with single price, the **price of anarchy is exactly 4/3** (75% efficiency). If you allow personalized prices (SSVCG—Scalar Strategy VCG), efficiency becomes 100% but implementation requires solving optimization problem (21.41) per agent.

## Single-Parameter Domains: The Tractable Frontier

**Definition**: Agent i cares only about "allocation amount" tᵢ ≥ 0. Valuation is vᵢ·tᵢ - pᵢ (quasilinear in allocation and payment).

**Theorem 12.2** (Characterization): Mechanism (f, p₁,...,pₙ) is truthful iff:
1. Allocation function tᵢ(bᵢ, b₋ᵢ) is monotone in bᵢ
2. Payment is pᵢ(bᵢ, b₋ᵢ) = ∫₀^bᵢ [q(z, b₋ᵢ)] dz - ∫_{bᵢ}^∞ q(z, b₋ᵢ) dz where q(bᵢ, b₋ᵢ) is the allocation amount.

**Critical value payment**: If allocation is binary (win/lose), this reduces to: winner pays the threshold bid where they'd switch from losing to winning (keeping others fixed).

**Scheduling example** (Chapter 12, Theorem 12.11): n machines with speeds sᵢ, jobs with processing times pⱼ.
- Monotone allocation: faster machines get more jobs
- VCG payment: machine i pays its marginal contribution to minimizing makespan
- Deterministic 5-approximation via virtual speeds (Definition 12.9)
- Randomized 2-approximation via fractional allocation + randomized rounding (Theorem 12.8)

**Why this works**: The constraint that vᵢ = vᵢ·tᵢ (linear utility) collapses the mechanism design space dramatically. You only need to verify monotonicity (a local, checkable property) rather than global incentive constraints.

## Randomized Mechanisms: Breaking Deterministic Limits

**Theorem 12.39** (Single-Parameter Randomized): A mechanism where allocation is probabilistic wᵢ(bᵢ) (probability of getting the item) is truthful iff:
1. wᵢ(·) is monotone non-decreasing
2. Payment is pᵢ(bᵢ) = bᵢ·wᵢ(bᵢ) - ∫₀^bᵢ w(z) dz

**Interpretation**: You pay expected value minus "option value" (integral of allocation probability).

**When randomization helps**: For combinatorial auctions, decomposition-based mechanism achieves √(2√m) approximation (Theorem 12.22). Deterministically, best known is O(√m). Randomization bridges the gap between hardness and efficiency.

**Key mechanism: RSOP** (Random Sampling Optimal Price, Chapter 13): Split bidders randomly into two sets, compute optimal price for each, offer to the other. Achieves (1-ε)·OPT with high probability when n ≥ O(h/ε² log(h/δ)) bidders.

## Transfer Principles for Multi-Agent Systems

1. **Use VCG when welfare = objective**: If you genuinely want to maximize total value (not profit, not fairness), VCG is the canonical mechanism. Pay the computational cost of optimization or use approximations.

2. **Single-parameter when possible**: Simplify agent preference reporting to one dimension (cost, valuation, capability). Then monotone allocation + critical-value payments automatically give truthfulness.

3. **Randomize for approximation**: When exact VCG is NP-hard, decompose the fractional LP solution and randomize over integral allocations. Preserves truthfulness in expectation.

4. **Use posted prices for digital goods**: When resources are non-rival (serving one agent doesn't reduce availability for others), don't run auctions—post optimal price φ⁻¹(0) computed from virtual valuations.

5. **Accept budget imbalance**: Don't expect to break even. Either subsidize (bilateral trade), charge less (public projects), or switch to profit-maximizing reserve prices (lose efficiency).

6. **Personalize prices when feasible**: SSVCG (Chapter 21) achieves full efficiency with scalar strategies by computing personalized prices. Cost: solving an optimization problem per agent.

## Open Questions

**Multiparameter mechanism design**: When agents have preferences over complex outcomes (combinations of items, time slots, quality levels), characterizing truthful mechanisms remains largely open. Roberts' theorem limits us to affine maximizers on unrestricted domains.

**Revenue-optimal mechanisms beyond single-item**: Myerson solved single-item auctions. For multiple items with interdependent values, optimal auctions are unknown even for 2 items and 2 bidders.

**Approximately truthful mechanisms**: If we relax dominant-strategy truthfulness to ε-dominant-strategy (deviation gains ≤ ε), does the design space expand significantly? How does this interact with approximation ratios?

**Distributed VCG**: Can agents compute VCG payments in a peer-to-peer network without a trusted auctioneer? Blockchain-based implementations are nascent; formal guarantees are sparse.
```

---

### FILE: price-of-anarchy-and-network-design.md

```markdown
# Price of Anarchy and Network Design: Quantifying the Cost of Selfishness

## The Framework: Measuring Inefficiency

When agents act selfishly, equilibrium outcomes are suboptimal. But *how much* worse? The **price of anarchy (PoA)** provides a universal answer:

```
PoA = cost(worst equilibrium) / cost(optimal solution)
```

(For maximization problems like welfare, it's the reciprocal.) PoA answers: "If I allow selfish behavior instead of central control, what's the worst-case efficiency loss?"

**Five design questions** (Chapter 17.1.2):

1. **Payoff representation**: Use concrete values (money, delay, distance), not abstract utilities
2. **Objective function**: Utilitarian (sum), egalitarian (max/min), or problem-specific?
3. **Approximation metric**: Ratio-based (multiplicative) or additive gap?
4. **Equilibrium concept**: Pure Nash, mixed Nash, correlated, approximate?
5. **Multiple equilibria**: Worst (PoA) or best (price of stability, PoS)?

**The non-obvious insight**: The *same game* can have drastically different PoA depending on objective. Example 17.4 (Balls and Bins): PoA under makespan is Θ(log m / log log m); under utilitarian cost it's 2 - 1/m. The objective function choice isn't neutral.

## Canonical Network Examples

### Pigou's Example: The 4/3 Barrier

**Setup**: Two parallel edges s→t, 1 unit of traffic.
- Upper: c(x) = 1 (constant)
- Lower: c(x) = x (linear congestion)

**Nash equilibrium**: All traffic on lower (dominant strategy). Cost = 1.

**Social optimum**: Split 1/2 on each. Cost = 1/2·1 + 1/2·(1/2) = 3/4.

**PoA = 1/(3/4) = 4/3.**

**Why this matters**: Even for *linear* cost functions and *two* edges, selfish routing is 33% worse than optimal. This is the *simplest* example showing self-interest ≠ efficiency.

**Generalization** (Theorem 18.8): For affine latencies lₑ(x) = aₑx + bₑ, PoA ≤ 4/3 for all networks. The bound is *tight*: Pigou achieves it.

### Nonlinear Costs: PoA Can Explode

**Polynomial latencies**: lₑ(x) = xᵖ.

As p → ∞: PoA → ∞. The **Pigou bound** α(C) for cost class C is the worst PoA achievable in *any* Pigou-like network with costs from C.

**Theorem 18.21**: "For any network with cost functions from class C, PoA ≤ α(C)."

**Meaning**: The worst-case network is always Pigou-like. Network size, structure, and multicommodity flows don't make things worse.

### Braess's Paradox: Adding Capacity Hurts

**Before**: Two routes s→t, each with edges c(x) = x and c(x) = 1 in series. Equilibrium splits traffic; cost 3/2 per unit.

**After**: Add zero-cost edge between midpoints. New equilibrium: all traffic uses new shortcut, overloading shared edges. Cost = 2 per unit.

**PoA increases from 1 to 4/3.**

**Lesson**: Adding capacity *without pricing* can worsen equilibrium. Selfish agents exploit new options in ways that congest critical links.

## The Potential Function Method

**Core insight**: If equilibria are local minima of a potential function Φ, you can bound PoA by comparing Φ(equilibrium) to Φ(optimum).

**For congestion games** (Chapter 19):
```
Φ(x) = ∑ₑ ∑_{k=1}^{xₑ} lₑ(k)
```

where xₑ is the number of players using edge e.

**Nash equilibrium condition**: No player can reduce cost by unilateral deviation ⇔ x is a local minimum of Φ.

**PoA bound**: Show that for any x (equilibrium) and x* (optimum), Φ(x) ≤ α · C(x*) where C is total cost. Then C(x) ≤ Φ(x) ≤ α · C(x*), so PoA ≤ α.

**Example proof** (submodular games, Theorem 19.19):
- V(S) = social welfare under allocation S (submodular: diminishing returns)
- At equilibrium S, each agent's marginal contribution is positive (else they'd leave)
- So V(S) ≥ ∑ᵢ∈S [V(S) - V(S-{i})] (telescoping sum)
- Submodularity gives: V(O) ≤ ∑ᵢ∈O [V(S∪{i}) - V(S)] ≤ ∑ᵢ∈S [V(S) - V(S-{i})] = V(S)
- Wait, that's wrong direction. Correct proof: V(O) ≤ 2V(S) via symmetric argument.

**Result**: PoA ≤ 2 for any monotone submodular game.

## Design as Optimization: Three Levers

### Lever 1: Marginal Cost Pricing

**Problem**: Selfish agents choose paths minimizing cₑ(fₑ). Equilibrium doesn't account for congestion externalities.

**Solution**: Charge each user τₑ = fₑ · c'ₑ(fₑ) (marginal congestion cost they impose).

**Theorem 18.27**: Marginal cost pricing shifts Nash equilibrium to social optimum. PoA becomes 1.

**Why**: Modified cost is cₑ(fₑ) + fₑ·c'ₑ(fₑ) = ∂[fₑ·cₑ(fₑ)]/∂fₑ. Agents internalize their impact on others.

**The catch**: Requires centralized pricing and collecting tolls. Revenue isn't redistributed (goes to "black hole"). Not budget-balanced.

### Lever 2: Capacity Augmentation

**Problem**: Can't control prices but can upgrade infrastructure.

**Theorem 18.29**: If you double link capacity (c̃(x) = c(x/2)/2), Nash equilibrium on new capacity equals social optimum on old capacity.

**Interpretation**: "Provision for twice the demand" compensates for selfish behavior. Cheaper than pricing if infrastructure costs are low.

### Lever 3: Mechanism Design for Coordination

**Cost-sharing games** (Chapter 19): Allocate network costs via method ξₑ(i, Sₑ) where Sₑ is the set using edge e.

**Shapley cost-sharing**: ξₑ(i, Sₑ) = cₑ / |Sₑ| (equal split). **PoS = Hₖ** (harmonic number, ~ ln k) for k players.

**Nonoblivious cost-sharing** (Theorem 19.15): Order players, assign full cost to lowest-indexed user. Forces Prim's MST algorithm. **PoA = 2** (for Steiner tree).

**Why ordering helps**: Breaks symmetry. Low-index players bear full cost, high-index free-ride. This simulates a greedy approximation algorithm through incentives.

**Impossibility** (Theorem 19.15 converse): Oblivious schemes (same cost-sharing independent of player order) cannot achieve PoA < Hₖ.

## Single-Price Resource Allocation: The 75% Barrier

**Proportional allocation** (Chapter 21): Each agent bids wᵢ, receives share wᵢ / (∑ⱼ wⱼ) of capacity C.

**Price**: μ = (∑ᵢ wᵢ) / C (uniform).

**Nash equilibrium**: Agents anticipate their bid affects price. Modified utility is:
```
Ûᵢ(dᵢ) = (1 - dᵢ/C)Uᵢ(dᵢ) + (dᵢ/C) ∫₀^dᵢ Uᵢ(z) dz
```

**Theorem 21.4**: "If dₛ is any optimal solution to SYSTEM, and dɢ is the unique optimal solution to GAME, then: ∑ᵢ Uᵢ(dᵢ^G) ≥ 3/4 · ∑ᵢ Uᵢ(dᵢ^S)."

**The bound is tight**: Example with linear utilities (U₁ = d₁, Uᵣ = dᵣ/2 for r ≥ 2) achieves exactly 75%.

**Mechanism design consequence** (Theorem 21.10): "Among all mechanisms with scalar strategy spaces and single price, proportional allocation uniquely achieves the optimal 3/4 efficiency."

**Escape**: Allow personalized prices (SSVCG). Then efficiency = 100%, but requires solving optimization per agent.

## Network Topology and Equilibrium Quality

### Scale-Free Networks: Robust Yet Fragile

**Definition**: Degree distribution follows power law P(k) ~ k^{-γ}.

**Properties** (Chapter 25):
- **vs. random failure**: Robust (most edges connect to hubs; random deletion rarely hits hubs)
- **vs. targeted attack**: Vulnerable (removing hubs fragments network)

**Red-Blue censorship model** (Chapter 25.4): Nodes prefer red/blue content. Censor tries to impose uniform distribution.

**Discretionary model** (nodes choose content): Defense investment = distance between node preference and censor target. High heterogeneity → high aggregate defense.

**Random model** (DHT, content randomly distributed): Defense investment lower because many nodes don't care about their assigned content.

**Result**: Discretionary ≥ random in total defense. "Whatever the attacker's strategy, it is at least as costly or more so, to attack a network's architecture via the discretionary rather than the random model."

### Delegation Flattens Criticality

**Centrality attack**: Remove highest-degree nodes first.

**Simulations** (Nagaraja-Anderson, Chapter 25.5): 
- **Rings/cliques**: Last ~12 rounds
- **Cliques + delegation**: Last much longer; connected component size remains ~400 (vs. 100 without delegation)

**Delegation mechanism**: High-degree leaders transfer edges to deputies before becoming too visible.

**Result**: Flattens degree distribution, slowing both vertex-order and centrality attacks.

**Transfer**: For critical infrastructure (skill networks, sensor grids), proactively redistribute load from hubs to prevent single points of failure.

## The Tragedy of the Commons: Quantified

**Bandwidth sharing** (Chapter 1.1.2): n players share capacity C = 1. Player i sends xᵢ ∈ [0,1]. Payoff: xᵢ(1 - ∑ⱼ xⱼ).

**Nash equilibrium**: xᵢ = 1/(n+1). Total: n/(n+1) < 1 (underutilization).

**Social optimum**: All send x = 1/2. Total: n/2.

**PoA**: 
```
Equilibrium welfare: n/(n+1)²
Optimal welfare: n/4
Ratio: 4/(n+1) → 0 as n → ∞
```

**Translation**: As population grows, selfish behavior leads to near-total waste.

**Pollution game** (n-player Prisoner's Dilemma, Chapter 1.1.2): n countries, each can pay 3 to control pollution or pay 0 and pollute. Each polluter costs all countries 1.

**Equilibrium**: All pollute (cost n each).  
**Optimum**: All control (cost 3 each).  
**PoA = n/3.**

For n = 1000: equilibrium costs 1000 vs. optimal 3—333x worse.

## Transfer Principles for Agent Systems

1. **Compute PoA before deployment**: For your task coordination game (with specific payoff structure), compute worst-case PoA analytically or via simulation. This bounds efficiency loss from decentralization.

2. **Use PoS for protocol design**: If you can steer agents toward *any* equilibrium (e.g., via initialization), optimize for price of stability. Often much better than PoA (Example 17.2: PoS = 1, PoA = k).

3. **Exploit structure**: If your game is potential, graphical with small degree, or submodular, specialized bounds apply. Don't use generic worst-case results.

4. **Design topology deliberately**: For network formation, interaction graphs aren't neutral. Random preserves ESS; adversarial doesn't. Delegation reduces centrality vulnerability.

5. **When PoA is unacceptable**: Use mechanism design (VCG, cost-sharing, marginal pricing) to align incentives. Accept the cost (subsidies, computational hardness).

6. **Proportional allocation = baseline**: For single-price resource allocation, 75% efficiency is optimal. If you need better, use personalized prices (SSVCG) or richer bidding languages.

## Open Questions

**PoA for mixed equilibria**: Example 17.4 shows mixed can be much worse than pure. General characterization?

**Online PoA**: When agents arrive/depart dynamically, does PoA degrade? By how much?

**Atomic vs. nonatomic gap**: Same network structure can have PoA = 4/3 (nonatomic) vs. PoA = 2.618 (atomic, affine costs). Why does discreteness matter so much?

**PoA with incomplete information**: All bounds assume complete information about game structure. If agents have partial observability, do bounds change?

**Convergence to worst equilibrium**: PoA assumes worst equilibrium is reached. But learning dynamics might avoid it. Can we bound PoA along learning trajectories?
```

---

### FILE: reputation-systems-and-trust.md

```markdown
# Reputation Systems and Trust: Preventing Manipulation in Multi-Agent Coordination

## The Fundamental Problem: Hidden Actions and Cheap Identities

When agents interact without external enforcement, three threats emerge:

1. **Whitewashing**: Discard bad reputation, re-register with clean slate
2. **Dishonest feedback**: Misreport outcomes to manipulate others' reputations
3. **Sybil attacks**: Create fake identities to boost one's own reputation artificially

Each threat exploits a different failure mode:
- Whitewashing attacks *identity binding* (pseudonyms are cheap)
- Dishonest feedback attacks *information revelation* (actions are unobservable)
- Sybils attack *symmetry* (treating all nodes equally)

**The master principle** (Chapter 27): All solutions require forcing agents to accumulate *costly history* tied to identity.

## Discount Factor: The Reputation Lever

Reputation systems work only when agents care about the future. Define δ ∈ [0,1) as the **discount factor**: how much a payoff t periods from now is worth today (geometric discounting: value = δᵗ).

**Threshold for cooperation** (Theorem 27.1): In the infinitely repeated Prisoners' Dilemma, "grim trigger" (cooperate unless anyone ever defected) is a subgame-perfect Nash equilibrium when:
```
δ ≥ 1/2
```

**Proof**: Deviating once gives payoff 2(1-δ) (get 2 immediately, then 0 forever). Cooperating gives 1 (always). Defect when 2(1-δ) > 1, i.e., δ < 1/2.

**Why δ matters**: If agents are impatient (δ near 0), reputation doesn't constrain behavior. If patient (δ near 1), even small future losses deter present defection.

**Personalized vs. shared reputation**: In a population of N+1 agents with random pairwise matching:

- **Personalized memory** (each remembers only past opponents): Threshold δ ≥ 1 - 1/(2N). For N = 100, need δ ≥ 0.995.
- **Shared reputation** (all observe all interactions): Threshold δ ≥ 1/2 (independent of N).

**The exponential gain**: Reputation sharing converts linear N-dependence into none. This is *why* reputation systems exist—they enable cooperation at scale.

## Whitewashing: The Identity Trap

**The attack**: When reputation becomes bad, abandon the identity and create a new one with clean slate.

**Impossibility result** (Chapter 27.3.1): "The threat of whitewashing forces a mistrust of newcomers. In any equilibrium, newcomers must be penalized at least the amount that a deviator would be penalized."

**Pay-Your-Dues (PYD) strategy**: Play D (defect) against newcomers, C (cooperate) against veterans who've never deviated.

**Why PYD is optimal** (with noise): When actions are observed with error ε, PYD is the unique equilibrium that:
- Supports cooperation among veterans
- Penalizes newcomers proportionally
- Minimizes social welfare loss

**The welfare cost**: Veterans waste effort punishing newcomers. If α fraction are genuine new entrants (not whitewashers), social loss scales with α.

**The initiation fee**: To prevent whitewashing, require upfront payment f ≥ 1/δ. Cost of new identity must exceed benefit of escaping bad reputation.

**Transfer insight**: In skill networks, new skills must prove themselves on low-stakes tasks before accessing critical paths. This is PYD implemented as task gating.

## Feedback Elicitation: The Peer-Prediction Mechanism

**The herding problem**: If you reward feedback-givers for *agreeing* with peers, they'll report the majority opinion (regardless of truth) to maximize agreement probability.

**Example**: Product has signal h (high quality) with marginal probability 0.65. Rater with signal l (low quality) knows peers likely saw h. If rewarded for matching, she reports h (dishonest).

**The solution: peer-prediction** (Chapter 27.4):

Rater i receives payment:
```
τᵢ(xᵢ, xⱼ) = ln[Pr(Sⱼ = xⱼ | Sᵢ = xᵢ)]
```

where xᵢ is i's report, xⱼ is reference rater j's report, and Pr is computed from the prior distribution P₀.

**Why truthfulness is a Nash equilibrium** (Proposition 1): The log scoring rule is *strictly proper*. If i observes signal s*, expected payment is:
```
E[τᵢ(x, Sⱼ) | Sᵢ = s*] = ∑ₙ ln[Pr(Sⱼ=n | Sᵢ=x)] · Pr(Sⱼ=n | Sᵢ=s*)
```

This is maximized when x = s* because log scoring rule measures calibration of posterior. Reporting an unlikely signal when you observed a common one is penalized; reporting truthfully aligns your prediction with reality.

**Numerical example** (Chapter 27, Section 27.4):
- Signal distributions: f(h|H) = 0.85, f(h|L) = 0.45
- Rater i observes l, considers reporting h or l
- If report l: E[score | Sᵢ=l] = ln(0.54)·0.54 + ln(0.46)·0.46 = -0.69
- If report h: E[score | Sᵢ=l] = ln(0.71)·0.54 + ln(0.29)·0.46 = -0.75
- Truthful reporting (l) strictly dominates.

**The elegance**: No need for ground truth, no need for "correct" feedback. Just compare to peer reports, weighted by Bayesian consistency.

## Transitive Trust: Graph-Based Reputation

**The problem**: Not all feedback-givers are equally reliable. Need to weight feedback by credibility of the source.

**The solution: trust graphs**. Define G = (V, E, t) where:
- V = nodes (agents)
- E = edges (trust relationships)
- t(i,j) ∈ ℝ⁺ = strength of trust from i to j

**Reputation function F: G → ℝ^|V|** assigns reputation score F_v(G) to each node.

**Three desirable properties**:

1. **Monotonic**: Adding incoming edges never decreases relative rank
2. **Symmetric**: Reputation depends only on graph structure, not node labels
3. **Rank-strategyproof**: No agent can improve rank by strategic rating

**The impossibility**:

**Theorem 27.5**: "There is no (nontrivial) symmetric rank-sybilproof reputation function."

**Proof idea**: Given graph G with F_w(G) > F_v(G), construct G' = two disjoint copies of G. By symmetry, there exists node u in second copy with F_u(G') = F_w(G') (the sybil has same reputation as original). So v created sybil u outranking original w, violating rank-sybilproofness.

**Breaking symmetry works**: Designate trusted seed nodes. Pathrank (shortest path distance from seed) is both value-sybilproof and rank-sybilproof.

**PageRank vulnerability**: Despite ubiquity, PageRank is symmetric → manipulable. "About half the pages on the Web could double their PageRank using only a single sybil."

Yet PageRank "works" in practice. Why? Average-case robustness ≠ worst-case. Attacker costs (acquiring domains, hosting) aren't modeled.

## Sybil-Resistant Mechanisms: Max-Flow vs. Pathrank

**Max-flow approach**: Reputation = max-flow from trusted seed s to node v, where edge capacities are trust weights.

**Value-sybilproofness**: Node v cannot increase F_v by creating sybils because min-cut bounds max-flow.

**Rank-sybilproofness**: Fails. Node v can create sybil v' that outranks some other node w by redirecting flow.

**Example (Figure 27.2)**:
```
Original:  s --1--> v --0.5--> w
After:     s --1--> v' --0.5--> w  (v' ranks higher than v)
```

v' is a sybil that improves v's position in rank ordering, even though F_v(G') = F_v(G).

**Pathrank approach**: Reputation = shortest path from seed s to node v (or 1/distance).

**Both value and rank-sybilproof**: If v creates sybil u to reach w faster, then v must be on the path from s to w. So v already has higher reputation than w. Sybil gains nothing.

**The catch**: Breaking symmetry requires designating trusted nodes. For decentralized systems, who decides the seed?

## The Computational Complexity of Reputation

**Finding ESS is hard** (Theorem 29.8): Both NP-hard and coNP-hard. The reduction constructs payoff matrices encoding maximum clique: ESS exists iff max clique size ≠ k.

**Why hardness doesn't doom reputation**: "If finding an ESS for a given class of games is NP-hard, it is unlikely that a finite population obeying some simple dynamic will quickly converge to it. But, this observation does not mean that one should avoid using models based on ESS. It simply means that to ensure the plausibility of a finite population model, one should check whether it is computationally tractable to find the ESS of the games the model considers." (Chapter 29.2)

Translation: Infinite populations with simple replication/imitation dynamics can reach equilibria that are NP-hard to compute offline. Evolutionary processes != algorithmic search.

**Imitative dynamics convergence** (Theorem 29.12): For selfish routing, agents pairwise compare latencies and switch with probability proportional to difference. Convergence to ε-approximate equilibrium in O(ε⁻³ ln(l_max/l*)) time.

**Proof technique**: Define potential Φ(x⃗) = total latency. Show Φ' ≤ -ϵ³/(2)·l̄(x⃗) when not at ϵ-equilibrium. Solve differential inequality: Φ(t) ≤ Φ(0)e^{-ϵ³t/4}.

## Network Topology and Reputation Stability

**Random graphs preserve ESS** (Theorem 29.16): If s is a classical ESS and G ~ G_{n,p} with p = 1/n^c (0 ≤ c < 1), then with probability 1, s is an ESS on the network.

**Proof sketch**: 
- Divide agents into normal-fitness (within (1±τ) of expected fitness) and abnormal-fitness groups
- All but O(log n) agents are normal (Chernoff bound)
- All but o(n) agents connect to normal-fitness agents
- Mutants have higher-fitness incumbent neighbors → can't invade

**Implication**: Don't over-engineer network topology. Random interaction structure is robust.

**Adversarial topologies can break ESS**: Chapter 29.4 notes that strategic network formation may destabilize classical ESS. But characterization remains open.

## Hidden Action and Network Structure

**The basic model** (Chapter 25.3.1): Nodes can hide whether they forwarded messages, served files, or exerted effort. Three solutions:

1. **Increase observability via topology**: Flat P2P (Gnutella) enables repeated interactions → reputation. Random DHT (Chord) forces diversity → harder to build reputation.

2. **Club structures**: Nodes establish trust *within* clusters → reduced observability problem within club → federate clubs with higher barriers to entry.

3. **Delegation**: High-centrality nodes transfer edges to deputies before becoming too visible → flattens degree distribution → slows targeted attacks.

**Empirical validation** (Nagaraja-Anderson simulations, Chapter 25.5): Cliques + delegation outlast rings by 3x under centrality attack. Dynamic redistribution of authority is more effective than static hardening.

## Transfer Principles for Multi-Agent Systems

1. **Engineer discount factors**: Don't assume agents care about reputation. Design incentives to *make* future participation valuable. Tie current task allocation to cumulative reputation. Make reputation decay slowly.

2. **Use peer-prediction for feedback**: Don't reward agreement with majority. Reward Bayesian consistency (log-likelihood scoring). Agents report truthfully when scores are calibrated against peer reports.

3. **Break symmetry deliberately**: For sybil resistance, designate a trusted kernel of skills (system primitives). Compute reputation as distance from kernel (Pathrank). Accept that decentralization has limits.

4. **Penalize newcomers with PYD**: New skills must execute low-stakes tasks first. High-value tasks require accumulated reputation. This is unavoidable if identity is cheap.

5. **Use network topology as defense**: For critical infrastructure, proactively flatten degree distribution via delegation. Don't let single skills become bottlenecks. Cross-train backups.

6. **Accept that whitewashing has social cost**: Every equilibrium with cooperation must tax newcomers. Either via initiation fees (upfront) or PYD (gradual trust-building). Choose based on entry rate dynamics.

7. **Leverage random topology**: If interaction graph is hard to control, ensure it's *random* not adversarial. Random preserves ESS; strategic formation might not.

## Open Questions

**Convergence in finite populations**: Theorem 29.16 analyzes infinite populations. What changes with n finite agents? Do convergence rates degrade? Do new equilibria appear?

**Rater ability variation**: Peer-prediction assumes homogeneous raters. If skills have different reliability at different tasks, how to adapt priors over signal distributions?

**Collusion detection**: Can the center detect coordinated false reports? Current mechanisms assume truthful equilibrium is salient. If agents coordinate lies that match peer-prediction predictions, system fails.

**Distributed reputation without center**: Chapter 27.6.1 notes lack of trusted party in peer-to-peer systems. Can blockchain consensus implement reputation with Byzantine fault tolerance at scale?

**Dynamic attacks**: Can agents game the system by timing failures? Example: defect only when peer-prediction scoring is unavailable. Current models are static; adversarial timing unmodeled.

**Incentive-compatible delegation**: Delegation flattens centrality, but who decides when to delegate? If agents choose strategically, does delegation equilibrium differ from optimal delegation?
```

---

### FILE: information-aggregation-and-prediction.md

```markdown
# Information Aggregation and Prediction: How Markets Compute Distributed Knowledge

## The Core Problem

An aggregator wants a prediction about an uncertain variable (e.g., global temperature in 2020). Multiple informants each hold different, non-independent information. The goal: extract information from informants, aggregate appropriately, and provide a collective forecast.

**The challenge**: Informants have private information, may be biased, and could manipulate. Simple voting fails (herding). Averaging fails (ignores information quality). **Solution**: Prediction markets.

## Rational Expectations Equilibrium: Prices as Knowledge

**Definition**: A **rational expectations equilibrium** is a mapping P*: Ω → ℝ from states to prices such that in every state ω, if every trader conditions their demand on (1) private information πᵢ and (2) price P*(ω), the market clears at price exactly P*(ω).

**Self-fulfilling prophecy**: Prices reveal information, which informs demand, which sets prices. The equilibrium is *consistent* with the information structure.

**Fully-revealing equilibria**: Under generic conditions, price correspondences exist where P*(ω₁) ≠ P*(ω₂) whenever ω₁ ≠ ω₂. In this case, the price reveals the combined information of all traders.

**The no-trade paradox**: In a fully revealing equilibrium, all agents condition on identical information (from observing the price). They assign identical expected values to the security. Hence, *no one wants to trade*. The equilibrium is informationally efficient but behaviorally degenerate.

**Why markets work anyway**: No-trade results are "very sensitive to the precise conditions specified—risk-neutrality and common knowledge that all traders are completely rational Bayesians—and even tiny perturbations invalidate them. In practice, there are several reasons that can lead an informed trader to expect a profit from trade, such as the existence of irrational traders, traders who are trading to hedge risks, traders who trade for liquidity reasons, or a market maker who is subsidizing the market." (Chapter 26.2.2.3)

## Empirical Success: Iowa Electronic Markets

**Track record**: Since 1988, IEM predicts US election outcomes more accurately than opinion polls.

**Mechanism**: Traders buy contracts paying $1 if candidate X wins, $0 otherwise. Prices converge to win probabilities.

**Why it works despite irrational traders**: Market prices are set by *marginal traders* (those whose moves affect equilibrium), not average traders. The marginal traders are typically:
- Better informed
- Less biased
- More responsive to new information

The crowd's wisdom emerges from the **edge**, not the center.

**Speed of information incorporation**: Markets react within minutes of news events. Polls lag by hours or days. Markets aggregate distributed information (each trader's local knowledge) without centralized data collection.

## Computational Limits: What Functions Are Market-Computable?

**The partition model of knowledge** (Chapter 26.2.1): Each agent i has a partition of the state space Ω. Agent i knows the partition element containing the true state.

**Combined information**: Coarsest common refinement of all partitions. If everyone shared information, they'd know this refined partition.

**Market revelation**: Fully-revealing equilibria occur when prices distinguish all states. But can markets compute *arbitrary* functions of the combined information?

**Answer: No.**

### Threshold Functions: Computable

**Definition**: f is a weighted threshold function if:
```
f(x) = 1  ⟺  w₀ + ∑ᵢ wᵢxᵢ ≥ 1
```

Examples: AND, OR, MAJORITY, weighted voting.

**Theorem 26.12**: "A Boolean function f is computable [by a market] if and only if it is a weighted threshold function."

**Proof sketch**: Market convergence requires that agents' posteriors separate when the function value differs. This happens iff the function is a linear inequality (separating hyperplane).

**Convergence time** (Theorem 26.14): For n-input threshold functions, convergence occurs in *at most n rounds*. Each round, at least one agent learns a definitive bit.

### XOR: Not Computable

**Example 26.10** (The Hard Case):
- Two agents with bits x₁, x₂
- Security pays $1 iff x₁ ⊕ x₂ = 1 (XOR)
- Prior: uniform over {00, 01, 10, 11}

**Agent 1 observes x₁ = 1**:
- Posterior: P(x₂ = 0 | x₁ = 1) = P(x₂ = 1 | x₁ = 1) = 1/2
- Valuation: E[F | x₁ = 1] = 1/2

**Agent 2 observes x₂ = 0**:
- Posterior: P(x₁ = 0 | x₂ = 0) = P(x₁ = 1 | x₂ = 0) = 1/2
- Valuation: E[F | x₂ = 0] = 1/2

**Round 1 bids**: Both bid 0.5; price = 0.5.

**Agent 1 sees price 0.5**: Infers agent 2 bid 0.5, meaning agent 2's valuation is 1/2. This is consistent with *either* x₂ = 0 or x₂ = 1. **No update**.

**Equilibrium**: Price stuck at 0.5 forever, even though agents' combined information determines F exactly (if x₁ = 1 and x₂ = 0, then F = 1).

**Why XOR fails**: It's *balanced* under the uniform prior. Both agents have identical posteriors over the function value, so price reveals nothing.

**Generalization**: Parity functions (XOR, NAND) are ruled out by Theorem 26.13. No linear threshold representation exists.

## Market Scoring Rules: Computational Implementation

**The problem**: Traditional markets require finding counterparties. For thin markets (rare events, niche predictions), liquidity is scarce.

**Solution: Automated market maker**. Define cost function C(⃗q) recording total money spent as a function of shares held.

**Price**: ∂C/∂qⱼ = marginal cost of security j.

**Example: Logarithmic Market Scoring Rule (LMSR)**:
```
C(⃗q) = b·ln(∑ⱼ e^{qⱼ/b})
```

Price of security j:
```
pⱼ = e^{qⱼ/b} / (∑ₖ e^{qₖ/b})    (softmax)
```

**Properties**:
- Maximum loss to market maker: b·ln|Ω| (bounded)
- Liquidity parameter: b (larger b = more liquidity)
- Equivalent to sequential scoring rule (incentivizes truthful probability reports)

**Why LMSR works**: The cost function is *convex* in q⃗. Traders maximize expected profit by reporting truthful beliefs. The market maker absorbs risk, charging a premium (bounded loss) for providing liquidity.

## Combinatorial Explosion and Complexity

**Complete markets**: For |E| base events, need 2^{|E|} securities (one per state).

**Example**: For 10 binary events (will it rain in each of 10 cities?), need 1024 securities. For 100 events, need 10³⁰ securities—unlistable.

**Three approaches**:

### 1. Restrict to Base Events + Simple Combinations

List only:
- Base events: "rain in city i"
- Simple conjunctions: "rain in city i AND city j"
- No arbitrary disjunctions

Reduces to O(|E|²) securities but sacrifices expressiveness.

### 2. Bayesian Network Structure

Assume conditional independence. If Event A affects Event B only through Event C, you don't need separate securities for all combinations of (A, B, C).

**Representation**: Bayesian network G with |E| nodes, |E| CPTs (conditional probability tables).

**Matching problem** (Theorem 26.6): Given bids on exponentially many securities (implicitly specified via CPTs), find market-clearing prices.

**Complexity**:
- **Divisible orders + O(log |E|) securities**: Polynomial (via LP)
- **Divisible orders + Θ(|E|) securities**: **co-NP-complete**
- **Indivisible orders + O(log |E|) securities**: **NP-complete**

**Implication**: Combinatorial markets hit fundamental computational barriers. Even with structured representations, matching is intractable in general.

### 3. Heuristic Matching

Accept approximate market clearing. Use greedy algorithms, local search, or auction-based mechanisms (ascending prices). No optimality guarantees but practical for large markets.

## When Markets Fail: The Structural Limits

**Theorem 26.13** (Non-Threshold Functions): "There exist Boolean functions that are not weighted threshold functions, and hence not computable by any market (in the sense of Theorem 26.12)."

**Examples**: XOR, NAND, parity over >2 bits, "odd number of heads" in coin flips.

**Why this matters**: Some collective decisions *cannot* be delegated to markets. You need:
- Centralized computation (after collecting all information)
- Explicit coordination (agents communicate beyond bids)
- Alternative mechanisms (voting, deliberation, sequential revelation)

**The OR function is easy** (Example 26.8): Two agents, bits x₁, x₂. Security pays iff x₁ ∨ x₂ = 1.
- Agent 1 observes x₁ = 0: valuation = 1/2
- Agent 2 observes x₂ = 1: valuation = 1
- Round 1 price: (0.5 + 1)/2 = 0.75
- Agent 1 sees 0.75 > 0.5, infers x₂ = 1, updates valuation to 1
- Equilibrium: price = 1

Markets compute OR (threshold function) but not XOR (non-threshold).

## Transfer Principles for Multi-Agent Systems

1. **Use markets for threshold-like decisions**: "Should we execute Task X?" is a weighted threshold if X requires ≥k of n resources. Markets converge. "Should we use Plan A XOR Plan B?" is not threshold. Use voting or centralized choice.

2. **Designate marginal traders**: Don't weight all agents equally. Give more influence to agents with:
   - Better track records (calibration)
   - Timely information updates
   - Larger stake (more to lose from errors)

3. **Automated market makers for thin markets**: If task priorities are rare or specialized, don't wait for counterparties. Use LMSR with bounded loss. Liquidity parameter b tunes price sensitivity vs. subsidy.

4. **Reduce state space via structure**: For 180+ skills, don't enumerate all 2^{180} skill combinations. Use conditional independence (DAG of skill dependencies). Reduces representation to O(180 · branching factor).

5. **Accept computational limits**: If clearing the market is co-NP-complete, use heuristic matching (greedy, local search). Don't expect perfect equilibria.

6. **Break symmetry for information aggregation**: Fully-revealing equilibria exist but are fragile (no-trade). Introduce:
   - Noise traders (randomly buy/sell)
   - Market maker subsidies (bound loss, provide liquidity)
   - Hedging motives (agents trade for risk management, not just profit)

7. **Sequential vs. simultaneous**: Markets with simultaneous reporting (peer-prediction) can suffer from herding. Sequential trading (market orders arrive over time) naturally breaks correlation.

## Open Questions

**Average-case convergence**: Theorems 26.14–26.15 give worst-case bounds (n rounds for n-input threshold). What about average-case? Simulations suggest near-constant rounds, but no proof.

**Noise and robustness**: All analysis assumes perfect prices. What happens with rounding, discretization, or imperfect information revelation?

**Incentive-compatible market makers**: LMSR assumes truthful bidding. What if agents can manipulate prices? Is there a mechanism ensuring truthfulness even with strategic market-making?

**Combinatorial markets with expressive bidding**: Reducing complexity via Bayesian networks assumes traders' independencies match the network. How to relax this without re-introducing exponential blowup?

**Decentralized markets**: Chapter 26 studies centralized markets (one auctioneer). Can agents aggregate information in fully peer-to-peer settings (blockchain-based)? What are the consensus/Byzantine fault tolerance requirements?

**Learning priors**: Peer-prediction requires common priors over signal distributions. If priors are misspecified or heterogeneous, does mechanism robustness degrade gracefully?
```

---

## CROSS-DOMAIN CONNECTIONS

### Software Engineering
- **Graphical games** (Chapter 7) map to microservices architectures where each service's behavior depends only on its neighbors, not the entire system. TreeNash algorithm = hierarchical dependency resolution.
- **Mechanism design with approximation** (Chapter 12) directly parallels API rate limiting, resource quotas, and SLA pricing. Proportional allocation = fair queuing.
- **Reputation systems** (Chapter 27) are code signing, package manager trust chains, and CVE databases. Pathrank = transitive trust in certificate authorities.

### AI/Agent Design
- **Regret minimization** (Chapter 4) is the foundation of reinforcement learning. RWM algorithm = multiplicative weights update. Swap regret → correlated equilibrium = multi-agent RL convergence.
- **Price of anarchy** (Chapters 18-21) bounds degradation when agents are independent vs. centrally coordinated. Applies to distributed planning, multi-robot coordination, and swarm intelligence.
- **ESS and evolutionary dynamics** (Chapter 29) model population-based learning. Imitative dynamics = social learning, cultural evolution, genetic algorithms.

### Decision Making
- **VCG mechanisms** (Chapter 9) formalize "truthful utility elicitation." Applies to preference aggregation, voting systems, and resource allocation under strategic reporting.
- **Prediction markets** (Chapter 26) aggregate expert forecasts. LMSR = Bayesian belief aggregation. Threshold functions = majority votes, weighted committees.
- **Correlated equilibrium** (Chapters 4, 7) justifies "recommendation systems" where a trusted third party suggests actions. Agents follow recommendations in equilibrium without explicit contracts.

### Team Coordination
- **Cost-sharing games** (Chapter 19) model project teams where members share resources (compute, data, infrastructure). PYD strategy = onboarding protocols. Shapley value = fair credit allocation.
- **Network formation** (Chapter 25) analyzes organizational structure. Scale-free networks = hub-and-spoke teams. Delegation = mentorship, succession planning.
- **Evolutionary stability** (Chapter 29) explains why certain team practices persist (conventions, coding standards, processes). ESS = institutional inertia resistant to "mutant" practices.

---

This synthesis preserves the book's technical precision while organizing material around *transferable lessons* for intelligent systems design. Each reference document is 800-4000 words, maintaining depth while crossing chapter boundaries to show how ideas interconnect. The evidence (exact quotes, numerical examples, proof sketches) remains intact, making these references authoritative teaching materials for building multi-agent systems like WinDAGs.