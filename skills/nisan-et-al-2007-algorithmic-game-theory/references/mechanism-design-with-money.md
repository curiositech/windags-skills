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