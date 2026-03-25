# Representation Determines Tractability: How Problem Encoding Changes Computational Complexity

## The Fundamental Insight

The same coordination problem can have radically different computational properties depending on representation. This isn't a minor technical detail—it's the central lesson of algorithmic game theory. The authors make this explicit throughout: normal form games yield exponential strategy spaces and PPAD-complete equilibrium computation, extensive form games with perfect information yield linear-time backward induction, sequence form shrinks exponential strategy sets to linear encodings enabling polynomial equilibrium computation for special cases.

The opening establishes the stakes: distributed constraint satisfaction has three solution approaches—domain pruning (weak but polynomial), heuristic search (practical but complex), hyper-resolution (complete but exponential). "The situation in which we find ourselves is that we have one algorithm that is too weak and another that is impractical." The resolution: choose algorithm matching problem structure.

## Normal Form: Exponential Strategies, Nonlinear Constraints

Definition 3.2.1: normal-form game specifies N (players), A = A₁ × ⋯ × Aₙ (action profiles), u_i: A → ℝ (utility functions). A pure strategy for player i is an action a_i ∈ A_i. A mixed strategy s_i ∈ S_i = Π(A_i) is a probability distribution over actions.

The explosion: if game has depth d and branching factor b, extensive form has O(b^d) nodes, but each player's normal-form strategy must specify action at every information set. For imperfect information, this yields O(b^d) pure strategies—exponential in tree depth.

The computational consequence: Nash equilibrium in normal form requires solving nonlinear complementarity problem (Section 4.2). The LCP formulation (Equations 4.14–4.19) includes:

```
r_j^i · s_j^i = 0  ∀j ∈ A_i, ∀i ∈ N  (complementarity condition)
```

This is nonlinear: if action j is played (s_j^i > 0), payoff must equal value (r_j^i = 0). If suboptimal (r_j^i > 0), not played (s_j^i = 0). The product makes this a fixed-point problem, not optimization.

Result: "The problem of finding a sample Nash equilibrium of a general-sum finite game with two or more players is PPAD-complete" (Theorem 4.2.1). This is exponential worst-case, no polynomial algorithm known or expected.

The exception: two-player zero-sum games reduce to linear programming (Section 4.1). One player's loss is other's gain, so problem becomes: minimize opponent's payoff. LP has polynomial solution. This is the representation mattering: zero-sum structure enables convex formulation, general-sum does not.

## Extensive Form with Perfect Information: Linear Backward Induction

When every history is observable (perfect information), the game tree can be solved recursively. Algorithm BACKWARDINDUCTION (Figure 5.6):

```
def backward_induction(node):
    if node is leaf:
        return payoff(node)
    else:
        values = [backward_induction(child) for child in children(node)]
        player = whose_turn(node)
        return max(values) if player else ...
```

Runtime: O(|game tree|), linear in tree size. This yields subgame-perfect equilibrium (Definition 5.1.5)—Nash equilibrium in every subgame. No noncredible threats: strategies remain best responses even in counterfactual branches.

The profound contrast: normal form of same game has exponential strategies, PPAD-complete equilibrium computation. Extensive form has linear strategies (one path through tree), linear equilibrium computation. The representation change transforms exponential to linear.

The mechanism: perfect information means each decision node is a singleton information set. Agent knows exactly where they are in tree. This eliminates the combinatorial explosion of "what should I do at unreachable nodes?"—those nodes become part of the backward induction recursion, not separate strategic choices.

For agent systems: when tasks execute sequentially with full observability (each agent sees all prior actions), use extensive-form representation and backward induction. Decompose into subtasks (subgames), solve bottom-up. Each subtask's solution optimal given higher-level strategies. Modular, compositional reasoning—each component verified independently.

## Sequence Form: Linear Encoding for Imperfect Information

The induced normal form explosion: if game tree has |T| nodes and branching b, normal form has O(b^{|T|}) strategies per player. Imperfect information exacerbates this: strategy must specify action at every information set, including those reached only via counterfactual histories.

The sequence form (Definition 5.2.5) achieves linear representation: size O(|T|), not O(b^{|T|}). The key insight: represent strategies as sequences of actions from root to leaves, not as functions from information sets to actions.

Most (σ₁, σ₂) sequence pairs don't reach leaves—payoff is zero. Use sparse encoding: store only nonzero payoffs. The example (Figure 5.10): game tree with player 1 choosing L/R, player 2 (unobserved) choosing A/B, player 1 (in info set) choosing ℓ/r. Sequences: Σ₁ = {∅, L, R, Lℓ, Lr}, Σ₂ = {∅, A, B}. Payoff table (Figure 5.13): most entries zero, sparse encoding stores only 5 nonzero payoffs vs. 8 in dense normal form.

Realization plan constraints (5.1–5.3):
- r₁(∅) = 1 (must start)
- For each information set I: Σ_{σ'₁ ∈ Ext₁(I)} r₁(σ'₁) = r₁(seq₁(I)) (flow conservation)

Probabilities must sum correctly as you traverse tree, ensuring valid behavioral strategy can be recovered. This is network flow: probability flows from root to leaves, conservation holds at each node.

Nash computation in sequence form (Equations 5.15–5.24): LCP where variables are sequence probabilities, not strategy probabilities. For two-player zero-sum games, reduces to LP—polynomial time. For general-sum, remains LCP but representation is exponentially smaller than normal form.

The computational win: sequence form has |T| sequences, normal form has O(b^{|T|}) strategies. For trees with depth d=10, branching b=3: normal form has 3^{10} ≈ 59,000 strategies, sequence form has ~30 sequences. The representation change is a 2000× compression.

For distributed systems: use sequence form for imperfect-information coordination. Shrinks exponential blow-up from strategy enumeration. Enables distributed algorithms: bottom-up aggregation (upward pass) computes local values, top-down allocation (downward pass) distributes decisions. Communication linear in tree size.

## Perfect Recall vs. Imperfect Recall: When Behavioral ≠ Mixed

Kuhn's theorem (5.2.4): in perfect recall games, mixed strategies and behavioral strategies are equivalent. Perfect recall means agent remembers own past actions and observations. This allows conversion between "randomize once over full strategies" (mixed) and "randomize independently at each information set" (behavioral).

Imperfect recall breaks this equivalence. The example (Figure 5.12): Player 1 has two decision nodes in same information set—doesn't know own past move. Under mixed strategies, R is strictly dominant. Under behavioral strategies (randomize independently at each info set visit), player 1 gets higher payoff by playing (98/198, 100/198).

The implication: computing equilibria in imperfect-recall games requires distinguishing mixed vs. behavioral. They're incomparable—neither dominates the other. This makes equilibrium computation more subtle.

Why this matters: imperfect recall naturally occurs in distributed systems where agents have memory limits or communication delays. An agent might forget past decisions or receive delayed information making current state ambiguous relative to past actions. The equilibrium concept must handle this—sequential equilibrium with consistent beliefs (Definition 5.2.10).

For agent systems: avoid imperfect recall if possible—design systems with sufficient logging/memory that agents track own history. If unavoidable (memory constraints), use behavioral strategies and solve via sequence form with appropriate consistency constraints.

## Correlated Equilibrium: Linear Constraints, Polynomial Solution

Nash equilibrium requires solving nonlinear complementarity (agents' mixed strategies multiply). Correlated equilibrium is linear program (Section 4.6):

Distribution π over action profiles such that no agent wants to deviate given private signal. Constraints (Equations 4.52–4.54):

```
Σ_{a_{-i}} π(a_i, a_{-i}) [u_i(a_i, a_{-i}) - u_i(a'_i, a_{-i})] ≥ 0  ∀i, ∀a_i, ∀a'_i
```

This is linear in π: each constraint is weighted sum. LP solver finds feasible π in polynomial time. Can add objective (maximize social welfare) and optimize.

The computational advantage: "A correlated equilibrium involves a single randomization over action profiles, while in a Nash equilibrium agents randomize separately. Thus, the (nonlinear) version of constraint would be... nonlinear because of the product."

Centralized randomization (linear) vs. decentralized mixed strategies (nonlinear product). The mechanism (correlation device) coordinates without agents communicating directly.

The welfare improvement: Battle of the Sexes pure equilibria yield (2,1) or (1,2), mixed yields (2/3, 2/3). Correlated: flip fair coin, both go to movie indicated. Expected payoff: (1.5, 1.5)—Pareto improvement over mixed, fair unlike pure.

Theorem 4.6.1: "All properties [of correlated equilibrium] are in P." Finding equilibrium, checking uniqueness, maximizing welfare, checking Pareto optimality—all polynomial. For Nash: checking uniqueness is NP-hard.

For agent systems: if central coordinator available (orchestrator recommending skill sequences), always compute correlated equilibrium first. Polynomial time, often higher welfare, agents incentivized to follow if everyone does. Shared randomness (timestamps, lottery outcomes, block hashes) enables coordination without negotiation.

## Congestion Games: Implicit Representation Enables Myopic Convergence

Congestion games (Section 6.4) have implicit exponential normal-form representation but admit compact encoding via facility costs. Definition 6.4.1: N players, M facilities, each player has strategy set of facility subsets, costs depend only on congestion (number using each facility).

Three properties enable efficient solution:

1. **Pure equilibria always exist** (Theorem 6.4.2)—unusual for general games.

2. **Myopic best response converges** (Theorem 6.4.3): greedy algorithm (each agent switches to current best response) guaranteed to find equilibrium.

3. **Potential function** (Theorem 6.4.6): Φ(s) = Σ_r ∫₀^{n(r,s)} c_r(x)dx. This increases at each myopic step, guarantees convergence.

The representation insight: don't enumerate exponential strategy space. Instead, represent game by facility cost functions {c_r} and player strategy sets. Compute equilibrium via myopic iteration. Potential function guarantees termination without exploring full strategy space.

For agent systems: when tasks have congestion structure (shared resources, additive costs), use compact congestion-game representation. Simple greedy algorithms work—each agent optimizes locally, system converges without central coordination. No sophisticated equilibrium computation needed.

## Stochastic Games: Markov Structure Enables Value Iteration

Stochastic games (Section 6.2) add state transitions to repeated games. Definition 6.2.1: state space S, after joint action a in state s, transition to s' with probability Pr(s'|s,a), receive rewards r_i(s,a).

This generalizes both repeated games (single state) and MDPs (single agent). Markov perfect equilibrium (Theorem 6.2.5): strategies depend only on current state, not history. Existence guaranteed (extends Nash).

The computational approach: value iteration (similar to MDPs). For state s, compute value V_i(s) = expected discounted sum of future rewards in equilibrium. Bellman equation:

```
V_i(s) = max_{a_i} min_{a_{-i}} [r_i(s,a) + γ Σ_{s'} Pr(s'|s,a) V_i(s')]
```

(for zero-sum; general-sum uses equilibrium operator instead of minmax)

This is fixed-point iteration: update values until convergence. Converges for discounted games (γ < 1). Runtime polynomial in |S| for fixed action spaces, but computing equilibrium operator at each state is hard (PPAD-complete for general-sum).

The representation choice: Markov strategies (depend only on current state) vs. history-dependent strategies (condition on entire path). Markov representation is exponentially more compact: O(|S| × |A|) parameters vs. O(|A|^{|S|·T}) for T-step history-dependent.

For agent systems: when tasks have state-dependent coordination (environment changes based on actions), use stochastic game representation. Markov strategies suffice for many applications—agents don't need full history, just current state. Value iteration computes equilibrium values. For zero-sum or near-zero-sum, use Minimax-Q learning (Section 7.4.2) to learn values without computing analytically.

## The Representation Hierarchy

Organizing by increasing expressiveness:

1. **Normal form**: Most general, exponential size, PPAD-complete equilibrium
2. **Extensive form (perfect info)**: Linear size, linear backward induction
3. **Sequence form (imperfect info, perfect recall)**: Linear size, polynomial for 2-player zero-sum
4. **Congestion games**: Compact implicit representation, myopic convergence
5. **Stochastic games**: State-dependent, Markov strategies, value iteration
6. **Correlated equilibrium**: Centralized randomization, linear constraints, polynomial

Each representation captures different structure. Choosing correct representation determines tractability.

The meta-lesson: **Don't solve the general problem—solve the structured special case your domain exhibits.** If coordination is sequential with observable history, use extensive form. If coordination has congestion structure, use potential games. If coordination has state-dependent dynamics, use stochastic games. If central coordination possible, use correlated equilibrium.

## Transfer Principles for Representation Design

**Match representation to information structure**: Perfect information → extensive form + backward induction. Imperfect information with perfect recall → sequence form. Imperfect recall → explicit belief modeling (sequential equilibrium).

**Exploit sparsity**: Sequence form stores only nonzero payoffs (most unreached). Congestion games store facility costs, not full strategy space. Graphical games (Chapter 3.4.5) store only local payoffs for agent neighborhoods.

**Use Markov when history doesn't matter**: State-dependent coordination often has Markov property—current state sufficient for optimal decision. Markov representation exponentially smaller than history-dependent. Check if state captures sufficient statistics.

**Prefer centralized randomization**: Correlated equilibrium (linear, polynomial) beats Nash (nonlinear, PPAD). If central coordinator available, always start with correlated. Decentralize only if necessary.

**Identify potential functions**: If problem has potential function (congestion games, network design), myopic algorithms work. Potential guarantees convergence without equilibrium computation. Look for potential structure in domain.

**Decompose via backward induction when possible**: Perfect-information structure enables hierarchical decomposition. Solve subgames recursively, compose solutions. Linear time, modular reasoning.

**Approximate when exact is intractable**: ε-Nash (finite candidates), support enumeration (small-support heuristic), learning (empirical convergence) all sacrifice exactness for tractability. Bounded rationality often acceptable in practice.

The synthesis: **representation design is the first and most important algorithmic choice.** Before choosing algorithm, choose representation exposing domain structure. The right representation makes hard problems easy, wrong representation makes easy problems hard. For WinDAGs with 180+ skills: don't use normal-form representation (exponential). Use hierarchical extensive-form (task DAG structure), sequence-form for uncertainty (imperfect information about skill outputs), potential games for resource contention (congestion on shared infrastructure), correlated equilibrium for central orchestration (coordinator exists).

The profound lesson: **complexity is not intrinsic to problems—it's a property of problem-representation pairs.** The same coordination problem is polynomial in one encoding, exponential in another. Intelligent system design requires choosing representations that expose structure enabling efficient algorithms. This is the algorithmic game theory contribution: not just proving hardness results, but showing when structure makes coordination tractable.