# Commitment Strategies: The Dynamic Logic of When to Reconsider Plans

## The Temporal Dimension of Rational Agency

While static constraints on beliefs, desires, and intentions define what combinations of mental attitudes are coherent at a single moment, the dynamic constraints define how these attitudes evolve over time—particularly, when an agent should maintain versus abandon its commitments. Rao and Georgeff's treatment of commitment strategies provides a formal framework for one of the most practically important aspects of resource-bounded rationality: the balance between reactivity and persistence.

## The Commitment Structure: Condition and Termination

The authors define commitment with precision: "A commitment usually has two parts to it: one is the condition that the agent is committed to maintain, called the commitment condition, and the second is the condition under which the agent gives up the commitment, called the termination condition."

This two-part structure immediately reveals why intentions differ from desires:

**Desires** have no inherent persistence—they can appear and disappear freely based on changing circumstances and priorities. There is no cost to abandoning a desire when it becomes unachievable or less important.

**Intentions** embody commitment—they persist even when circumstances change, subject only to their termination condition. The "cost" of abandoning intentions is deliberation time plus the risk of thrashing between plans.

Critically: "As the agent has no direct control over its beliefs and desires, there is no way that it can adopt or effectively realize a commitment strategy over these attitudes. However, an agent can choose what to do with its intentions. Thus, we restrict the commitment condition to intentions."

## Two Dimensions of Commitment: Object and Strength

The commitment condition can be specified along two dimensions:

**What the agent commits to (the object)**: "An agent can commit to an intention based on the object of the intention being fulfilled in one future path or all future paths."

- **Commits to one possible future**: The intention is maintained if there exists at least one future execution path where the intended state is achieved. Even if some futures lead to failure, commitment persists as long as success remains possible.

- **Commits to all possible futures**: The intention is maintained only if all belief-accessible future paths lead to the intended state. If any possible future leads to failure, commitment is abandoned.

The choice between these dramatically affects agent behavior in uncertain environments:

**Example from air traffic control**: An aircraft agent intends to land at a specific time (ETA = 19:00).

*Commitment to one possible future*: As long as there exists some wind field configuration, some trajectory, some sequence of actions that could achieve 19:00 landing, the agent maintains this intention. It continues trying even when success is uncertain.

*Commitment to all possible futures*: Only if the agent believes that all possible wind fields, all possible trajectories lead to 19:00 landing does it maintain this intention. The moment uncertainty about success arises, commitment is dropped.

The first strategy is persistent but risks wasting effort on unachievable intentions. The second is cautious but risks premature abandonment of achievable intentions.

## Three Termination Conditions: Blindness, Single-Mindedness, and Open-Mindedness

The second dimension concerns what changes trigger abandonment:

**Blind Commitment**: "A blindly-committed agent which denies any changes to its beliefs or desires that would conflict with its commitments."

Formally: The agent maintains its intentions regardless of changes to beliefs or desires. Once committed, the agent filters out information that would suggest the plan is failing or that better opportunities exist.

This may seem irrational, but has a critical property: complete stability. The agent never reconsiders, never re-deliberates, expending all computational resources on execution rather than deliberation.

**Single-Minded Commitment**: "A single-minded agent which entertains changes to beliefs and will drop its commitments accordingly."

Formally: The agent maintains intentions as long as they remain consistent with current beliefs. If the agent comes to believe its intended plan is impossible or its intended goal already achieved, it drops the commitment. However, changes to desires alone (e.g., a new goal becoming more important) do not trigger reconsideration.

This embodies: "I will stick with my plan as long as I believe it can still work, but I won't pursue impossible plans or redundant goals."

**Open-Minded Commitment**: "An open-minded agent which allows changes in both its beliefs and desires that will force its commitments to be dropped."

Formally: The agent reconsiders intentions when either beliefs or desires change in relevant ways. Not only "this plan is now impossible" but also "this goal is no longer important" or "a better opportunity has arisen" triggers reconsideration.

This is maximally responsive but also maximally expensive: any significant change to beliefs or desires potentially triggers re-deliberation.

## Formal Axiomatization: Expressing Commitment in Logic

These commitment strategies can be expressed as axioms in the BDI logic. The authors provide modal logic formulations for each:

**For single-minded commitment to one possible future**:

The axiom captures: "If the agent intends φ, then either φ becomes true in the next time step, or the agent believes φ is still possible and continues to intend φ."

This encodes two termination conditions:
1. Success: φ is achieved (the intention is fulfilled)
2. Impossibility: The agent believes φ is no longer achievable

**For open-minded commitment**:

The axiom adds: "...or the agent no longer desires φ."

This adds a third termination condition:
3. Change of motivation: The agent no longer wants to achieve φ (due to changing priorities, new information about consequences, etc.)

The semantic constraints on accessibility relations evolve differently under each strategy:

**Blind commitment**: Intention-accessible worlds never change (except through execution making progress toward goals)

**Single-minded**: Intention-accessible worlds are updated when they no longer intersect with belief-accessible worlds

**Open-minded**: Intention-accessible worlds are updated when they no longer intersect with both belief-accessible and desire-accessible worlds

## The Air Traffic Control Example: Contrasting Behaviors

The authors illustrate with the OASIS sequencer agent:

"The primary objective of the sequencer agent is to land all aircraft safely and in an optimal sequence... On determining a particular schedule, the scheduling agent then single-mindedly commits to the intention; in other words, the scheduling agent will stay committed until (a) it believes that all aircraft have landed in the given sequence; or (b) it does not believe that there is a possibility that the next aircraft will meet its assigned ETA."

Note the crucial observation: "Note that this is not the classical decision-theoretic viewpoint—any change in wind field, for example, should, in that view, cause a recalculation of the entire sequence, even if all aircraft could still meet their assigned ETAs."

The single-minded strategy says: Don't reconsider unless you believe the current plan is failing. A change in wind field that doesn't violate plan feasibility doesn't trigger re-sequencing, even though a different wind field might make a different sequence more optimal.

This trades optimality for stability and computational efficiency. The system computes a good schedule, commits to it, and only reconsiders when commitment becomes untenable.

**Contrast with blind commitment**: A blindly committed sequencer would continue executing its schedule even when aircraft are missing their ETAs, potentially creating safety hazards.

**Contrast with open-minded commitment**: An open-minded sequencer would reconsider whenever wind changes, runway assignments change, new aircraft enter the queue, or optimization criteria shift—potentially spending more time re-scheduling than executing schedules.

**Contrast with classical decision theory**: A classical decision-theoretic agent would recalculate expected utility at every time step, continuously adjusting the schedule to accommodate new information—computationally intractable for real-time control.

## Implementation in the Abstract Interpreter

The abstract interpreter includes specific procedures for commitment maintenance:

```
drop-successful-attitudes();
drop-impossible-attitudes();
```

These implement aspects of the termination condition. But the more subtle aspect appears in:

```
post-intention-status();
```

The authors explain: "The purpose of this procedure is to delay posting events on the event queue regarding any changes to the intention structure until the end of the interpreter loop. By posting appropriate events to the event queue the procedure can determine, among other things, which changes to the intention structure will be noticed by the option generator. In this way, one can model various notions of commitment that result in different behaviours of the agent."

This is subtle but profound: commitment strategy is implemented not by changing the deliberation process itself but by controlling which events trigger option generation. An event indicating "intention φ failed" might be posted immediately (single-minded) or suppressed (blind), or "new desire ψ conflicts with intention φ" might trigger re-deliberation (open-minded) or be ignored (single-minded).

The event queue becomes a filtering mechanism that implements commitment strategy through selective attention.

## The Empirical Question: Which Strategy for Which Domain?

The authors explicitly reject the idea that one commitment strategy is universally correct: "As before, rather than claiming that one particular commitment strategy is the right strategy, we allow the user to tailor them according to the application."

This raises an empirical question: What domain characteristics favor which commitment strategies?

**Blind commitment favors**:
- Environments where deliberation is extremely expensive
- Domains where mid-execution information is unreliable or noisy
- Situations where thrashing between plans is catastrophic
- Cases where plans have strong mutual exclusion (starting a new plan requires undoing significant work from the old plan)

**Single-minded commitment favors**:
- Environments where plan feasibility can change rapidly
- Domains where continuing impossible plans has high cost
- Situations where beliefs about feasibility are reasonably accurate
- Cases where plan abandonment is cheap (little sunk cost)

**Open-minded commitment favors**:
- Environments where opportunities arise unpredictably
- Domains where relative value of objectives changes significantly
- Situations where deliberation is cheap relative to execution
- Cases where better alternatives often appear during execution

The key empirical result cited: "This results in savings in computational effort and hence better overall performance" (Kinny and Georgeff 1991).

Their experiments showed that in dynamic environments, intermediate commitment strategies (particularly single-minded commitment) outperformed both complete rigidity and continuous re-planning.

## Extending Beyond the Three Basic Strategies

While the authors focus on three canonical strategies, the framework admits many variations:

**Conditional commitment**: Different commitment strategies for different types of intentions. High-priority safety-critical intentions might be single-minded while opportunistic optimization intentions are open-minded.

**Probabilistic reconsideration**: Rather than deterministic rules, reconsideration occurs probabilistically based on magnitude of belief/desire changes.

**Resource-indexed commitment**: Commitment strength varies with available deliberation resources. When computation is cheap, be more open-minded; when resources are scarce, be more single-minded.

**Social commitment**: In multi-agent settings, commitments to other agents might have different persistence properties than internal commitments (see their reference to "planned team activity" in Kinny et al. 1994).

## The Meta-Level Architecture: Deliberation About Deliberation

The post-intention-status procedure reveals a meta-level architecture: the agent has first-order intentions (about domain actions) and meta-level control over which intention changes trigger deliberation.

This creates a two-level system:
- **Object level**: Execute current intentions, monitor world state
- **Meta level**: Decide when object-level intentions should be reconsidered

The meta-level implements the commitment strategy. This separation is crucial for efficiency: the object level can execute quickly because it doesn't constantly re-deliberate, while the meta-level can be relatively simple because it only decides yes/no on reconsideration rather than computing new plans.

An important observation: Meta-level reasoning must itself be fast. If deciding "should I reconsider?" takes as long as reconsidering, the architecture provides no advantage. This is why the framework assumes "potentially significant changes can be determined instantaneously."

## For WinDAGs: Designing Reconsideration Policies

In a DAG-based orchestration system, commitment strategies translate to policies about when to recompute execution plans:

**Event-driven reconsideration triggers**:
- **Blind**: Never recompute (execute the initial DAG plan to completion regardless of feedback)
- **Single-minded**: Recompute when current plan becomes infeasible (skill failures, violated preconditions, resource exhaustion)
- **Open-minded**: Recompute when objectives change (new requirements, priority shifts, better alternatives discovered)

**Implementation via event filtering**:
```
if skill_failed(S):
    if commitment_strategy in ["single-minded", "open-minded"]:
        post_event("reconsider_execution_plan")

if new_objective(O):
    if commitment_strategy == "open-minded":
        post_event("reconsider_execution_plan")

if skill_completed(S):
    if all_objectives_satisfied():
        post_event("reconsider_execution_plan")  # Success termination
```

**Practical considerations**:

1. **Granularity of reconsideration**: Reconsider the entire DAG execution or just the remaining portion? Fine-grained reconsideration is more adaptive but more expensive.

2. **Sunk cost handling**: When reconsidering, should already-completed work constrain new plans (avoid redundant computation) or be ignored (seek true optimum)?

3. **Partial execution consistency**: If reconsidering mid-execution, ensure new plan is consistent with already-executed actions (can't undo completed skills).

4. **Multi-objective tradeoffs**: Different objectives might favor different commitment strategies. Latency-critical objectives favor single-minded (don't waste time re-planning), quality-critical objectives favor open-minded (reconsider when better approaches discovered).

## The Boundary Condition: When Commitment Strategy Doesn't Matter

Commitment strategy becomes irrelevant in limiting cases:

**1. Instantaneous deliberation**: If planning time approaches zero, always reconsider (pure decision-theoretic agent)

**2. Static environments**: If nothing changes during execution, commitment strategy is moot (initial plan remains optimal)

**3. No better alternatives**: If there's only one feasible plan, reconsideration never yields different results

**4. Perfect prediction**: If beliefs are always correct, plans never become infeasible unexpectedly

Real domains rarely satisfy these conditions, which is why commitment strategy matters empirically.