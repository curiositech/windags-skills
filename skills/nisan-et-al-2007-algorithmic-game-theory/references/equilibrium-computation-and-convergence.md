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