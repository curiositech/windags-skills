# Mechanism Design in Constrained Reality: When Designers Cannot Control Strategy Spaces

## The Foundational Reframe

Traditional mechanism design assumes omnipotence: the designer can implement any allocation rule and payment function, completely reshape agent strategy spaces. This is the VCG world—where dominant-strategy truthfulness and efficiency are achievable through carefully constructed payments.

Reality imposes constraints: "Often one starts with given strategy spaces for each of the agents, with limited or no ability to change those... such constraints can be thought of as the norm rather than the exception." The examples crystallize this:

- "A city official who wishes to improve the traffic flow in the city cannot redesign cars or build new roads"
- "A UN mediator who wishes to incent two countries fighting over a scarce resource to cease hostilities cannot change their military capabilities"  
- "A computer network operator who wishes to route traffic a certain way cannot change the network topology or the underlying routing algorithm"

The profound insight: constraints aren't obstacles to mechanism design—they're the normal condition. The question becomes: **how do you achieve coordination when you can only add mechanisms on top of existing strategy spaces, not replace them?**

The section explicitly references Chapter 2's social laws: "Imposing social laws—that is, restricting the options available to social agents—can be beneficial to all agents. Social laws played an important coordinating role (as in 'drive on the right side of the road') and, furthermore, in some cases prevented the narrow self interests of the agents from hurting them (e.g., allowing cooperation in the Prisoners' Dilemma game)."

The relaxation: "Here we relax this assumption, and we do so in three ways." Three mechanisms for constrained design: (1) contracts, (2) bribes/positive incentives, (3) mediators.

## Contracts: Making Agreements Binding Through Verifiability

The contract mechanism assumes "players still have the freedom to choose whether or not to honor the agreement; the challenge is to design a mechanism such that, in equilibrium, they will do so."

The eBay marketplace problem illustrates: post-auction, seller must decide whether to send goods, buyer must decide whether to pay. Without contracts, neither cooperates in equilibrium—fraud is empirically observed. With contract: both parties sign pre-auction agreement specifying "Deliver goods or pay fine F; pay or pay fine F."

The critical feature: the contract changes who deviates is observable. Deviation triggers penalty. This transforms the game—payoffs now include potential fines. If fines are large enough, breach becomes unprofitable in equilibrium.

The efficiency result: "However, one can often achieve the same effects with much less effort on the part of the center... The only phase in which the center's protocol requires it to get involved under some conditions is the enforcement stage. However, here too one can minimize the effort required in actuality. This is done by devising contracts that, in equilibrium, at this stage too the center sits idle."

The profound claim: "If the game play is verifiable (if the center can discover after the fact whether players obeyed the contract), then anything achievable by a fully engaged center is also achievable by a center that in equilibrium always sits idle."

Verifiability is the key: if deviation is observable, the threat of enforcement suffices. The institution doesn't need to actively monitor—the possibility of detection changes equilibrium behavior. This is governance-by-threat-not-action.

For intelligent systems: make agent actions publicly verifiable (via blockchain, audit logs, attestation services). Then contracts become self-enforcing: agents know deviation will be observed, no expensive real-time enforcement needed, equilibrium achieves desired coordination.

The contract mechanism works because it changes information structure: previously hidden deviations become observable, changing the game fundamentally. This is analogous to imperfect-information games becoming perfect-information—the equilibrium set shrinks dramatically.

## Bribes: Zero-Cost Incentive Realignment

The second mechanism offers payments to induce desired behavior: "In this case we say that the desired behavior has a 0-implementation. More generally, an outcome has a k-implementation if it can be implemented in dominant strategies using such payments with a cost in equilibrium of at most k."

Theorem 10.7.1: "An outcome is 0-implementable iff it is a Nash equilibrium."

The congestion service provider example demonstrates the power:

Initial game M:
```
           f      s
        f  3,3   6,4
        s  4,6   2,2
```

Problem: both agents prefer exclusive use, coordination fails. Designer's bribe structure:
- Pay agent 1 ten dollars if both use f
- Pay agent 2 ten dollars if both use s

Transformed game M':
```
           f      s
        f  13,3   6,4
        s  4,6    2,12
```

Result: strategy f is now dominant for agent 1, strategy s is dominant for agent 2. Equilibrium (f,s) is enforced. Expected payment = $0 since (f,s) is always played.

The mechanism revelation: "Hence, the mechanism will have to pay nothing. It has just implemented, in dominant strategies, a desired behavior (which had previously been obtained in one of the game's Nash equilibria) at zero cost, relying only on its creditability."

This is the essence: incentive design is often about belief management, not wealth transfer. The credible promise of payment changes equilibrium without actual payment in equilibrium. The center's creditability—its commitment to pay if triggered—is the coordination device.

For multi-agent systems: when agents have misaligned incentives, offer credible rewards for coordination. The reward structure transforms payoffs so selfish optimization yields socially beneficial outcomes. Critical requirement: the mechanism must be credible (can and will pay if triggered).

The limitation: bribes only work if the desired outcome is already a Nash equilibrium of some transformed game. If no payment structure makes desired outcome equilibrium, bribes fail. This is why mechanism design must check implementability conditions—not all outcomes are achievable through payments alone.

## Mediators: Delegation as Commitment Technology

The third mechanism adds a new player: "Adding mediators make them [strong equilibria] less rare. For example, adding a mediator to any balanced symmetric game yields a strong equilibrium with optimal surplus."

The Prisoner's Dilemma with mediator demonstrates:

Original game:
```
      C    D
   C  4,4  0,6
   D  6,0  1,1
```

Nash equilibrium: (D,D), payoffs 1,1. Not a strong equilibrium—both would prefer to coordinate on (C,C) if they could commit.

Mediator's offer: "If you both accept, I play C on your behalf. If only one accepts, I play D on behalf of that agent."

The mediator creates a new strategic option: delegate decision-making. If both agents accept mediation, the mediator plays C for both, achieving (4,4). Neither agent individually wants to deviate (would get 1 or 0). No coalition can deviate and both improve (either agent leaving gets 1 at best).

(Mediator, Mediator) = (4,4) is now a strong equilibrium: no subset of agents can deviate and all be better off. The mediator's commitment technology allows agents to escape their temptation to defect.

Why this works: the mediator's declaration "If both use me, I'll play C" creates a new strategic object—a public commitment. Agents condition their choices on this commitment. The mediator becomes an equilibrium selection device, a focal point for coordination.

The mediator doesn't just add information—it transforms the game structure. Without mediator: agents play 2×2 normal form game. With mediator: agents play 3-option game (Mediator vs. play-yourself-C vs. play-yourself-D). The equilibrium set of the extended game includes outcomes unreachable in the original.

For distributed systems: when direct control is impossible, establish trusted intermediaries (consensus mechanisms, arbitrators, registry services). Agents delegate coordination decisions to mediator. Critical requirements: (1) mediator is trusted (won't defect), (2) mediator's strategy is publicly observable (commitment is credible), (3) agents can verify mediator followed its commitment.

The limitation on mediator power: for k-strong mediated equilibrium in symmetric games with n agents, "only achievable if k! divides n." For n=120 (Israeli parliament), 120=5!, so any anonymous game has a 5-strong equilibrium. This is purely combinatorial: group size matters fundamentally. Structural constraints determine what mediators can achieve.

## The Efficiency Paradox of Centralized Enforcement

The contracts section reveals a non-obvious result: "It can be shown that if the game play is verifiable (if the center can discover after the fact whether players obeyed the contract), then anything achievable by a fully engaged center is also achievable by a center that in equilibrium always sits idle."

This seems paradoxical: how can a idle center be as powerful as an active one? The resolution: the center's power comes from credible commitment to enforcement, not actual enforcement. If deviation is observable and the center credibly commits to punish, agents choose not to deviate in equilibrium.

This is institutional design through threatened enforcement rather than realized enforcement. The judicial system works this way: most disputes don't go to trial because parties settle knowing what trial outcome would be. The court sits idle most of the time but shapes behavior through credible threat.

For intelligent systems: build audit mechanisms that make deviations observable (logging, attestation, cryptographic proofs). Establish credible enforcement (automated penalties, reputation systems). Most of the time, the enforcement machinery sits idle—its existence suffices. This is cheaper than continuous monitoring and active enforcement.

The failure mode: if the center's commitment becomes non-credible (can't or won't enforce), the equilibrium collapses. Reputation is the center's most valuable asset—violating commitments once destroys credibility, future contracts fail.

## Task Scheduling: Verification as Truthfulness Foundation

The compensation-penalty mechanism (Section 10.6.1) shows how verification enables truthfulness without full control:

Allocation function:
$$x(\hat{t}) = \arg\min_x \max_{i \in N} \sum_{j \in T} x(i,j)\hat{t}_{i,j}$$

Payment function:
$$℘_i(\hat{t}) = h_i(\hat{t}_{-i}) - \sum_{j \in T} x(i,j)\tilde{t}_{i,j} + \max\left(\sum_{j \in T} x(i,j)\tilde{t}_{i,j}, \max_{i' \neq i} \sum_{j \in T} x(i',j)\hat{t}_{i',j}\right)$$

The critical requirement: "Important that the mechanism can verify the amount of time an agent took." Without verification, agents could under-report actual time, reducing penalty without consequences.

The payment structure decomposes:
1. First term h_i(·) is irrelevant (doesn't depend on i's report)
2. Second term (−∑ actual costs) compensates agent, making them indifferent to assignment
3. Third term (penalty = makespan) creates right incentives:
   - Reporting ˆtᵢ,ⱼ > tᵢ,ⱼ only increases penalty (worse allocation for others)
   - Reporting ˆtᵢ,ⱼ < tᵢ,ⱼ doesn't reduce penalty (depends on actual time)
   - Therefore truthfulness is dominant

The mechanism achieves optimal makespan (minimize completion time of last task) while maintaining truthfulness. But requires individual rationality to be relaxed (payment can be negative) unless h_i set appropriately.

For agent systems: when orchestrating tasks with unobservable costs, require verification of actual completion times (logging, timestamping). Design payments that depend on verified facts, not agent reports. This breaks the link between misreporting and benefit—lying becomes unprofitable.

The fundamental lesson: **verification transforms information structure, enabling mechanisms that would fail under asymmetric information.** The cost of verification determines the boundary of implementable mechanisms.

## Bandwidth Allocation: Price of Anarchy as Design Metric

The proportional allocation mechanism (Section 10.6.2) demonstrates tolerance for strategic behavior when perfect truthfulness is unachievable:

- Agents submit single scalar wᵢ ∈ ℝ⁺ (interpreted as willingness to pay)
- Mechanism sets uniform price: μ = (∑ᵢ wᵢ) / C
- Agent i receives allocation: dᵢ = wᵢ / μ

Two equilibrium concepts yield different outcomes:

1. **Price-taking competitive equilibrium** (Theorem 10.6.3): agents treat μ as fixed. Result: efficient allocation (maximizes social welfare).

2. **Strategic Nash equilibrium** (Theorem 10.6.4): agents account for ability to affect μ through own declarations. Result: Price of Anarchy = 4/3. "In the worst case, the Nash equilibrium achieves 25% less efficiency than the competitive equilibrium."

The framing: "While it is always disappointing not to achieve full efficiency, this result should be understood as good news." Even with strategic behavior, loss is bounded at 25%. The mechanism is robust to misreporting.

The design principle: when mechanisms cannot achieve dominant-strategy truthfulness (too complex, too expensive to verify, computationally intractable), analyze worst-case welfare loss. If Price of Anarchy < 1.5×, accept the mechanism. Bounded inefficiency is better than perfect inefficiency.

For distributed systems: when full truthfulness unachievable, design mechanisms with acceptable PoA bounds. Proportional allocation requires minimal information (one scalar per agent), achieves near-optimal outcomes even when agents strategize. Trade theoretical perfection for practical robustness.

The mechanism's elegance: it doesn't require agents to reveal full valuation functions (only single scalar), doesn't require verification (allocation depends only on declarations), converges quickly (agents can compute best response easily). Simplicity enables deployment where VCG-style mechanisms would fail.

## Multicast Cost Sharing: The Efficiency-Budget-Balance Tradeoff

The fundamental impossibility (Theorem 10.4.11): cannot simultaneously achieve:
- Dominant-strategy incentive compatibility
- Budget balance (costs exactly covered)
- Efficiency

Must relax one of three. Two options:

**Option A: Shapley Value (Truthful + Budget-Balanced, sacrifices efficiency)**

Algorithm (Figure 10.6):
1. Start with all agents in S
2. Compute routing tree T(S)
3. Each agent i pays equal share of costs for links in T({i})
4. Drop agents where v̂ᵢ < pᵢ
5. Repeat until convergence

Why truthful: payments are "cross-monotonic"—"an agent's payment can only increase when another agent is dropped, and hence that an agent's incentives are not affected by the order in which agents are dropped by the algorithm."

Cross-monotonicity enables greedy algorithm (polynomial time) without worrying about reinstatement. Agents can't benefit by triggering others to drop—this would only increase their own payment.

But it sacrifices efficiency: some agents who value service ≥ marginal cost are rejected because they can't afford the average-cost payment. This is the classic inefficiency of average-cost pricing.

Communication complexity: "Any (deterministic or randomized) distributed algorithm that computes the same allocation and payments as the Shapley value algorithm must send Ω(|N*|) bits over linearly many links in the worst case" (Theorem 10.6.5). Centralized computation required.

**Option B: VCG (Truthful + Efficient, sacrifices budget balance)**

VCG straightforward in centralized case, but remarkably: "A distributed algorithm can compute the same allocation and payments as VCG by sending exactly two values across each link" (Theorem 10.6.6).

Algorithm structure (Figure 10.7):

**Upward pass (bottom-up)**: Each node i computes mᵢ = marginal value of connecting subtree rooted at i.
- mᵢ ← v̂ᵢ − c(lᵢ) + ∑(child j) max(mⱼ, 0)
- This is "most agents in subtree would pay to join"

**Downward pass (top-down)**: Each node i computes sⱼ for each child j.
- sⱼ = actual surplus generated by connecting child j
- If sⱼ ≥ 0: agent j receives service, pays max(v̂ⱼ − sⱼ, 0)

The payment structure ensures truthfulness via VCG mechanism: each agent pays externality they impose on others. Result: efficient allocation, but typically runs surplus (collects more than costs). Requires external budget to absorb surplus.

The non-obvious insight: VCG, despite computing "efficient" allocation requiring global information, can be implemented distributively with minimal communication (2 messages per link). Shapley value, a simpler-seeming mechanism, cannot.

The choice: Shapley for settings requiring budget balance and willing to sacrifice efficiency. VCG for settings requiring efficiency and able to handle surplus/deficit. No third option exists simultaneously achieving all three.

For agent systems: recognize when trade-offs are unavoidable. Design mechanisms that optimize the property most critical to domain. If efficiency paramount (minimize completion time), use VCG-style payments. If budget balance paramount (no subsidy), use Shapley-style average-cost pricing.

## Stable Matching: Asymmetric Trust as Solution

Two-sided matching without money transfers (Section 10.6.4): students and advisors, preferences are strict orderings, no monetary transfers allowed. Stable matching exists (Gale-Shapley 1962, Theorem 10.6.11) via deferred acceptance algorithm.

But mechanism design impossibility (Theorem 10.6.16): "No mechanism implements stable matching in dominant strategies."

Proof by example (2 students, 2 advisors):
- s₁: a₁ ≻ a₂; s₂: a₂ ≻ a₁  
- a₁: s₂ ≻ s₁; a₂: s₁ ≻ s₂

Two stable matchings exist: µ (s₁-a₁, s₂-a₂) and µ′ (s₁-a₂, s₂-a₁). If mechanism picks µ, advisor a₂ can lie ("s₁ unacceptable") → only µ′ is stable → a₂ prefers this. If mechanism picks µ′, student s₂ can misreport and benefit. Therefore no dominant-strategy mechanism exists.

The solution under partial honesty (Theorem 10.6.18): "Under the direct mechanism associated with the student-application version of the deferred acceptance algorithm, it is a dominant strategy for each student to declare his true preferences."

Condition: advisors must be compelled to behave honestly (institutional authority). With one side honest, other side has dominant strategy to be honest.

The asymmetric trust insight: some coordination problems require one party to commit to truthfulness for mechanism to work for the other. Not all agent hierarchies can be fully strategic. Some roles (coordinators, registry services) may need to be trusted/honest.

For distributed systems: when two-way negotiation fails (no mechanism truthful for both sides), designate one role as trusted:
- Marketplace coordinator
- Task queue (system-managed, no incentive to lie)
- Central broker

Then deferred-acceptance-style matching ensures: skills have dominant strategy to report true capabilities, tasks allocated stably.

The lattice property (Theorem 10.6.14): "If µ and µ′ are stable matchings, ∀s ∈S, µ(s) ⪰_s µ′(s) if and only if ∀a ∈A, µ′(a) ⪰_a µ(a)." Any matching improving for all students worsens for all advisors. Fundamental asymmetry: student-optimal is advisor-worst.

Corollary 10.6.15: "The student-optimal stable matching matches each advisor with her least preferred achievable student, and the advisor-optimal stable matching matches each student with her least preferred achievable advisor."

This creates coordination challenge: which equilibrium to select? Student-application yields student-optimal, advisor-application yields advisor-optimal. The mechanism designer's choice of procedure implicitly selects equilibrium, favoring one side.

## Transfer Principles for Constrained Intelligence

**Make mechanisms self-enforcing through observability**: If agent actions are verifiable (blockchain, logs, attestation), contracts become self-enforcing. No expensive enforcement needed—threat suffices.

**Use credible commitments, not actual payments**: Bribes can be zero-cost in equilibrium if designed correctly. Credible promise of reward changes behavior without actual transfer. Center's creditability is the coordination device.

**Delegate coordination to trusted intermediaries**: When direct control impossible, establish mediators (consensus mechanisms, arbitrators). Agents delegate decisions, mediator's commitment becomes focal point.

**Accept bounded inefficiency for robustness**: When perfect truthfulness unachievable, design for acceptable Price of Anarchy. Proportional allocation achieves 75% efficiency even with strategic agents—good enough for many domains.

**Recognize unavoidable trade-offs**: Efficiency + budget balance + truthfulness simultaneously impossible in many settings. Choose which property to relax based on domain constraints.

**Asymmetric trust enables coordination**: When symmetric incentive compatibility fails, designate some roles as trusted. One-sided dominant-strategy implementation is achievable even when two-sided isn't.

**Hierarchical information aggregation minimizes communication**: VCG multicast achieves distributed computation with 2 messages per link. Bottom-up aggregation, top-down allocation. Linear communication despite global coordination.

The profound synthesis: **constrained mechanism design is the normal case, not the exceptional one.** Intelligent systems cannot assume omnipotent designers—they must coordinate despite inability to control strategy spaces. The three mechanisms (contracts, bribes, mediators) aren't workarounds—they're the fundamental tools for coordination in real systems where authority is limited and agents are autonomous.