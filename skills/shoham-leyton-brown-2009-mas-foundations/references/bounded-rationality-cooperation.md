# Bounded Rationality and the Emergence of Cooperation

## The Paradox of Perfect Rationality

The repeated Prisoner's Dilemma under perfect rationality yields a stark result: backward induction from the final round shows defection is always optimal. By induction, both players defect in every round. The equilibrium is Pareto-dominated by mutual cooperation, yet unachievable through rational play.

The section on automata with bounded size (6.1.3) reveals the profound reversal: "Placing severe restrictions on the number of states not only induces an equilibrium in which cooperation always occurs, but also causes the always-defect equilibrium to disappear. This equilibrium in a finitely repeated Prisoner's Dilemma game depends on the assumption that each player can use backward induction...In order to perform backward induction in a k-period repeated game, each player needs to keep track of at least k distinct states."

The critical observation: the equilibrium changes discontinuously. When automata are restricted to fewer than k states:
- Constant defection becomes impossible to sustain (requires k states to implement backward induction)
- Tit-for-Tat (requiring only 2 states) becomes equilibrium-sustaining
- **Lower computational power → higher cooperation**

This is the opposite of what occurs with perfectly rational agents, where defection is always possible. The Folk Theorems for automata (Theorems 6.1.8-6.1.9) formalize this: "Thus, if even one of the players' automata has a size that is less than exponential in the length of the game, an equilibrium with some degree of cooperation exists."

The lesson: computational limitations aren't defects—they're constraints that enable coordination impossible under perfect rationality. The inability to compute perfect best responses forces agents into simpler strategies, and simple strategies (like tit-for-tat) happen to support cooperation.

## Lexicographic Disutility: Complexity Costs as Commitment

The second mechanism for bounded rationality is even more subtle: "Agents have lexicographic disutility for complexity...their utility functions Ui(·) in the induced normal-form game are replaced by preference orderings ⪰i such that (M1, M2) ≻i (M ′1, M ′2) whenever either Ui(M1, M2) > Ui(M ′1, M ′2) or Ui(M1, M2) = Ui(M ′1, M ′2) and s(Mi) < s(M ′i)."

The key example: trigger strategies that punish defection have an unreachable "defect" state that exists only as a threat. When complexity is costly:
- Agents use simpler automata: just the "cooperate" state
- Both agents coordinate on the efficient outcome
- **Costly complexity becomes a commitment device**

The unreachable state—maintained solely to make threats credible—becomes wasteful when complexity has cost. Agents prefer simpler strategies with the same equilibrium payoff. This eliminates non-credible threats: if the threat state is never reached, why pay to maintain it?

The profound implication: adding a cost to complexity doesn't just make computation harder—it changes what equilibria are achievable. Complex threat strategies disappear from the equilibrium set because their complexity cost exceeds their benefit. This is analogous to mechanism design where verification costs determine implementability.

For agent systems: encode computational limits as utility costs. Charge agents (in utility or resource units) for storing state or lookahead depth. This prevents equilibria requiring agents to maintain complex threat strategies they'd never execute. Encourages simpler, more robust strategies.

The implementation: in a hierarchical agent system, each skill has a "complexity budget" (memory, CPU cycles, communication bandwidth). Strategies exceeding budget are excluded from consideration. This automatically eliminates overly complex coordination protocols, forcing agents toward simpler focal points.

## Learning Without Computing: Empirical Frequency as Mixed Strategy

The fictitious play example (Table 7.1, Matching Pennies) shows agents converging to equilibrium through repeated play without ever computing the equilibrium:

```
Round | 1's action | 2's action | 1's beliefs | 2's beliefs
  0   |     -      |     -      | (1.5, 2)    | (2, 1.5)
  1   |     T      |     T      | (1.5, 3)    | (2, 2.5)
  2   |     T      |     H      | (2.5, 3)    | (2, 3.5)
  3   |     T      |     H      | (3.5, 3)    | (2, 4.5)
  4   |     H      |     H      | (4.5, 3)    | (3, 4.5)
  5   |     H      |     H      | (5.5, 3)    | (4, 4.5)
  6   |     H      |     H      | (6.5, 3)    | (5, 4.5)
  7   |     H      |     T      | (6.5, 4)    | (6, 4.5)
```

Each player oscillates, updating beliefs based on empirical frequency. The empirical distribution converges to (0.5, 0.5)—the mixed-strategy Nash equilibrium—even though actual play never settles. The agents best-respond to beliefs, beliefs update from observations, and the system converges to equilibrium distribution.

The non-obvious property: convergence in distribution doesn't require convergence in actions. The frequency with which actions are played approaches equilibrium, but individual actions remain stochastic. This is the empirical frequency interpretation of mixed strategies: in repeated play, the proportion of time an action is played converges to its equilibrium probability.

For distributed systems: agents don't need to compute equilibrium analytically. Through repeated interaction with bounded rationality (learning from experience), they converge to equilibrium distributions. This enables coordination without central computation—the system finds equilibrium through decentralized experimentation.

The implementation: in WinDAGs, skills executing repeatedly can learn which subtasks to invoke through empirical success rates. No skill needs global knowledge of payoff structure. Each skill observes outcomes, updates beliefs about which dependencies work, adjusts invocation frequencies. System converges to equilibrium task allocation without central orchestrator computing optimal allocation.

## Minimax-Q: Learning in Stochastic Games

Section 7.4.2 extends learning to stochastic games (states evolve based on joint actions). Minimax-Q converges to Nash equilibrium in zero-sum stochastic games through Q-learning with minimax operator:

Q_{i,t+1}(s,a_i,a_{-i}) ← (1-α_t)Q_{i,t}(s,a_i,a_{-i}) + α_t[r_i(s,a) + γV_{i,t}(s')]

where V_i(s) = max_{a_i} min_{a_{-i}} Q_i(s,a_i,a_{-i})

"Theorem 7.4.3: Under the same conditions that assure convergence of Q-learning to the optimal policy in MDPs, in zero-sum games Minimax-Q converges to the value of the game in self play."

The profound result: agents can learn equilibrium through repeated interaction without ever computing it analytically. The algorithm doesn't require knowledge of opponent's payoffs, only observations of rewards and state transitions. Convergence is guaranteed under standard conditions (all state-action pairs visited infinitely often, learning rate schedules appropriately).

The limitation explicitly stated: "Expanding reinforcement learning algorithms to the general-sum case is quite problematic...no generalization of Q-learning has been put forward that has [desired convergence] property." Most real coordination is general-sum (no single objective), and current theory is incomplete.

For agent systems: when state-dependent coordination is required (stochastic games), use Q-learning with minimax operators if problems are zero-sum or close to zero-sum. Accept that general-sum convergence is an open problem—may need to use approximations or domain-specific heuristics.

## Congestion Games and Potential Functions

Section 6.4 (Congestion games) reveals another bounded-rationality success story: myopic best response is guaranteed to converge, despite agents having no global view.

Three non-obvious properties:

1. **Pure equilibria always exist** (Theorem 6.4.2): "Every congestion game has a pure-strategy Nash equilibrium"—unusual, most games don't guarantee this.

2. **Myopic best response converges** (Theorem 6.4.3): "The MYOPICBESTRESPONSE procedure is guaranteed to find a pure-strategy Nash equilibrium of a congestion game." This works regardless of cost functions, initial state, or agent order.

3. **Equivalence to potential games** (Theorem 6.4.6): Congestion games are exactly the potential games where potential function exists: Φ(s) = sum over resources of ∫₀^{n(r,s)} c_r(x)dx.

The potential function guarantees: any algorithm improving Φ must terminate. Myopic best response increases Φ at each step (agent switches to action reducing their cost, which increases potential). Since Φ is bounded and increases at each step, convergence is guaranteed in finite time.

The implementation: MYOPICBESTRESPONSE simply iterates: pick agent, agent switches to best response given others' current actions, repeat. No coordination, no global computation, no message passing beyond observing current state. Yet convergence guaranteed.

For orchestration: if task allocation has congestion structure (resources shared, costs additive), simple greedy algorithms work. Agents independently optimize their choices, system converges to equilibrium without central coordination. No sophisticated equilibrium computation needed.

The example (Pigou's road network, Section 6.4.5): single unit of traffic routing between source and target, two paths (cost 1 constant vs. cost x linear). Nash equilibrium: everyone chooses linear path (since marginal cost at equilibrium is 1). Social cost = 1.0. Optimal solution: half on each path, social cost = 0.75. Price of anarchy = 4/3.

The bounded inefficiency: even with selfish routing, cost is at most 33% above optimal. "Theorem 6.4.12: The price of anarchy of a selfish routing problem whose cost functions are taken from the set C is never more than α(C)." For linear functions: α=4/3 (tight bound). For degree-d polynomials: grows with d but remains bounded.

The design principle: when coordination mechanisms can't guarantee efficiency, bound the inefficiency. Congestion games with linear costs guarantee PoA ≤ 4/3. This is "good news"—strategic behavior doesn't cause catastrophic failure, just bounded suboptimality.

## Computational Hardness Changes with Constraints

Theorems 6.1.11-6.1.13 reveal the counterintuitive result: bounding automaton size actually increases computational complexity.

"Theorem 6.1.13: Given a machine game GM = ({1, 2}, M, G) of the limit average infinitely repeated Prisoner's Dilemma game G, an automaton M2, and an integer k, the problem of computing a best-response automaton M1 for player 1, such that s(M1) ≤ k, is NP-complete."

Without size bound: computing best response is polynomial (value iteration converges). With size bound: computing best response becomes NP-complete. The constraint makes computation harder, not easier.

Why? Unrestricted agents can use exponential-size automata implementing arbitrary finite-horizon strategies, including backward induction. Value iteration finds optimal response efficiently. Bounded agents must search over finite-but-large space of k-state automata, checking which implement strategies that are equilibria given constraint.

For intelligent systems: restricting agent capabilities (memory, lookahead depth) changes what equilibria are achievable—this is the cooperation emergence phenomenon—but may inadvertently increase computational cost of finding equilibria. This is a design trade-off: simpler agents enable cooperation but make optimization harder.

The resolution: don't try to compute optimal bounded-rational strategy analytically. Instead, use learning (empirical frequency, Q-learning) to find equilibria through repeated interaction. The computational burden shifts from analysis to experimentation.

## Transfer Principles for Bounded-Rational Coordination

**Computational limits enable cooperation**: When agents cannot compute backward induction (bounded state space), defection equilibria may disappear. Cooperation becomes the only sustainable strategy. Design systems with intentionally limited lookahead to enable coordination.

**Complexity costs as commitment devices**: Charge agents for maintaining complex strategies (memory, computation, communication). This eliminates non-credible threats—if threat state is never reached, why pay to maintain it? Simpler strategies naturally emerge.

**Learning converges without computing**: Fictitious play, Q-learning, and other adaptive algorithms converge to equilibrium distributions through repeated interaction. Agents don't need to know global payoff structure—local observations suffice. Design systems that learn through experience rather than central analysis.

**Myopic optimization works in congestion settings**: If tasks have additive costs and shared resources, simple greedy algorithms (each agent optimizes locally) converge to equilibrium. No sophisticated coordination needed. Potential functions guarantee convergence.

**Price of anarchy bounds acceptable inefficiency**: When perfect coordination is impossible, bound the inefficiency. Congestion games with linear costs: PoA ≤ 4/3. This is tolerable for many applications. Design for bounded suboptimality, not unachievable optimality.

**Constraints change complexity class**: Bounding agent capabilities may increase equilibrium computation complexity (polynomial → NP-complete). But don't compute—learn instead. Shift from analysis to experimentation, from optimization to adaptation.

The synthesis: **bounded rationality isn't a defect—it's a design parameter.** By intentionally limiting agent computational power, memory, or communication, you change the equilibrium set. Sometimes this enables cooperation impossible under perfect rationality. Sometimes this makes equilibrium computation harder. The key is recognizing these trade-offs and choosing constraints that yield desired system behavior.

For WinDAGs with 180+ skills: don't require each skill to compute optimal global strategy. Give skills limited memory and lookahead. Have them learn through repeated task execution. Use potential functions to guarantee convergence in congestion settings. Accept bounded suboptimality (PoA ≤ 1.5) rather than pursuing uncomputable perfection. The result: distributed coordination that works in practice, even if theoretically suboptimal.