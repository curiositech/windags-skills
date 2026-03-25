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