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