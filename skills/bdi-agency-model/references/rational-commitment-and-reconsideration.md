# Rational Commitment: When to Stick with Plans and When to Reconsider

## The Central Computational Trade-off

The most empirically grounded contribution in the BDI paper is Kinny and Georgeff's experiment demonstrating that neither "always replan" (classical decision theory) nor "never replan" (conventional software) yields effective behavior in dynamic environments. This finding has profound implications for any agent system that must balance deliberation with action.

## The Experimental Evidence

Georgeff describes a simulated robot experiment where agents collect points in a grid environment. The points change value and location while the agent operates—a simple model of environmental dynamism. Three strategies were tested:

**Cautious Strategy (Classical Decision Theory)**
- Replans at every environmental change
- Theoretically optimal: always has the best plan for current state
- **Result**: Efficiency collapses as change rate increases
- **Failure mode**: Spends more time planning than acting; constantly abandons partially executed plans

**Bold Strategy (Rational Commitment)**
- Commits to plans and reconsiders only at "crucial moments"
- Not theoretically optimal: often executing plans that are suboptimal for current state
- **Result**: Maintains high efficiency across wider range of change rates
- **Success factor**: Appropriately balances planning cost against plan value

**Implicit Task-Oriented Strategy**
- Commits to plans forever, never reconsiders
- Works in static environments
- **Result** (not shown but implied): Higher efficiency than cautious when change is slow, catastrophic failure when change is fast

## The Graph's Profound Lesson

The graph shows efficiency (y-axis) versus environmental change rate (x-axis). The crucial insight is that **the bold strategy dominates across most of the change spectrum**. There's a crossover point at very low change rates where replanning might yield marginal gains, but for any realistic dynamic environment, strategic commitment wins.

This is a computational proof that:

1. **Optimality is the wrong objective**: A strategy that guarantees optimal plans at every moment (cautious) performs worse than a strategy that accepts suboptimal plans if they're "good enough" (bold).

2. **Commitment is not a bias or heuristic**: It's a rational response to computational constraints. The cost of replanning must be factored into the value calculation.

3. **The right question is not "should I replan?" but "when should I replan?"**: The challenge moves from whether to commit to how to define "crucial moments."

## What Makes a Moment Crucial?

The paper doesn't fully specify what triggers reconsideration in the bold strategy, but we can infer principles from the experimental success and broader BDI literature:

### Failure Conditions
The most obvious crucial moment: **the current plan cannot continue**.

- **Execution failure**: An action cannot be performed (preconditions violated, action fails)
- **Goal unachievability**: Evidence that the goal cannot be reached via current plan
- **Constraint violation**: Plan execution would violate a hard constraint

These are "forced" reconsiderations—the system has no choice but to replan or abandon the goal.

### Opportunity Conditions
More subtle crucial moments: **significantly better alternatives become available**.

- **Goal achievement**: Goal satisfied by external events (plan becomes unnecessary)
- **Goal obsolescence**: Goal no longer relevant (plan loses purpose)
- **Windfall opportunities**: Much cheaper path to goal appears (plan becomes inefficient)

The challenge: "significantly better" requires comparing the value of continuing versus replanning. This is cheaper than full replanning but not free.

### Resource Conditions
Strategic crucial moments: **plan execution cost changes dramatically**.

- **Resource exhaustion**: Continuing would consume critical resources
- **Time pressure shifts**: Deadline approaches, requiring faster/slower strategies
- **Cost inflation**: Environmental changes make current plan much more expensive

### Information Conditions
Epistemic crucial moments: **key beliefs change**.

- **Assumption violation**: Belief on which plan was based becomes false
- **Uncertainty resolution**: New information eliminates a major uncertainty
- **World model update**: Understanding of domain changes (not just state facts)

## The Commitment-Reconsideration Policy Space

Different BDI implementations make different choices about what constitutes "crucial." This creates a policy space:

### Blind Commitment
- Reconsider only on execution failure
- **Advantages**: Minimal replanning overhead, maximum stability
- **Disadvantages**: Misses opportunities, wastes resources on obsolete goals
- **Best for**: Environments where goals rarely become irrelevant and execution is usually possible

### Goal-Driven Commitment
- Reconsider on failure OR goal state changes (achieved, unachievable, obsolete)
- **Advantages**: Avoids wasted effort on unnecessary or impossible goals
- **Disadvantages**: Requires monitoring goal conditions continuously
- **Best for**: Environments where goal relevance changes frequently

### Resource-Rational Commitment
- Reconsider when expected value of replanning exceeds expected cost
- **Advantages**: Theoretically optimal trade-off given computational costs
- **Disadvantages**: Requires estimating replanning costs and plan values (hard!)
- **Best for**: Environments where these estimates can be made reasonably well

### Belief-Triggered Commitment  
- Reconsider when key beliefs change beyond threshold
- **Advantages**: Focuses reconsideration on belief changes that matter
- **Disadvantages**: Requires identifying "key" beliefs for each plan
- **Best for**: Environments where plan validity depends on specific beliefs

## Bratman's Claim: Commitment as Filter

Pollack's response clarifies Bratman's specific contribution to understanding commitment: **intentions filter subsequent option consideration**.

She writes: "Bratman argued that rational agents will tend to focus their practical reasoning on the intentions they have already adopted, and will tend to bypass full consideration of options that conflict with those intentions."

This isn't just about when to reconsider existing plans. It's about **what options to consider when forming new plans** in the presence of existing commitments.

### The Filtering Mechanism

When an agent with existing intentions encounters a new goal or opportunity:

1. **Filter options that conflict with existing intentions**: Don't consider actions that would prevent completing committed plans

2. **Prioritize options that support existing intentions**: Favor actions that advance multiple goals simultaneously  

3. **Avoid reasoning about filtered options**: Don't just deprioritize conflicting options—skip detailed reasoning about them entirely

This filtering is the key to avoiding combinatorial explosion: the option space grows exponentially without it, but intentions constrain the space to tractable size.

### Example: The Multi-Task Agent

Consider a WinDAG agent system with three active tasks:

- Task A: Committed intention to generate API documentation
- Task B: Committed intention to review security audit
- Task C: New request to refactor authentication module

**Without intention filtering**, considering how to approach Task C requires reasoning about:
- All possible refactoring approaches
- All possible orderings with respect to A and B  
- All possible resource allocations across three tasks
- All possible replanning options for A and B to accommodate C

**With intention filtering**, Task C is considered in context of committed intentions:
- Refactoring approaches that would break API documentation are filtered out
- Orderings that violate security review deadlines are filtered out
- Resource allocations that would force abandoning A or B are filtered out

The agent still considers multiple options for Task C, but within a constrained space shaped by existing commitments. This is the computational power of intentions.

## Implementation Patterns for Agent Systems

### Pattern 1: Explicit Intention Markers

Make intentions explicit in agent state:

```
AgentState {
  beliefs: BeliefStore
  goals: GoalSet
  intentions: IntentionStack {
    intention: Plan
    commitment_policy: ReconsiderationPolicy
    trigger_conditions: Set<Condition>
  }[]
  plan_library: PlanStore
}
```

Each intention has explicit:
- The committed plan
- Policy for when to reconsider
- Specific conditions that trigger reconsideration

### Pattern 2: Intention-Aware Option Generation

When generating options for new goals:

```
function generate_options(new_goal, agent_state):
  candidate_plans = retrieve_plans(new_goal, agent_state.plan_library)
  
  # Filter based on current intentions
  compatible_plans = []
  for plan in candidate_plans:
    if not conflicts_with_intentions(plan, agent_state.intentions):
      compatible_plans.append(plan)
  
  return compatible_plans
```

This filtering happens BEFORE detailed reasoning about plan quality, costs, or likelihood of success. It's an early filter to avoid wasting computation on non-viable options.

### Pattern 3: Tiered Reconsideration

Different intentions may have different commitment strengths:

```
enum CommitmentLevel {
  WEAK,      // Reconsider on minor belief changes
  MODERATE,  // Reconsider on goal state changes
  STRONG,    // Reconsider only on execution failure
  ABSOLUTE   // Never reconsider (must complete or fail)
}
```

High-level strategic goals might have STRONG commitment (changing overall direction is expensive). Low-level tactical actions might have WEAK commitment (easy to switch between similar approaches).

### Pattern 4: Trigger-Based Reconsideration

Instead of continuously monitoring whether to reconsider, register explicit triggers:

```
function commit_to_intention(plan, goal):
  intention = create_intention(plan, goal)
  
  # Register specific reconsideration triggers
  register_trigger(intention, "execution_failure")
  register_trigger(intention, "goal_achieved") 
  
  for belief in plan.key_assumptions:
    register_trigger(intention, f"belief_changed:{belief}")
  
  agent_state.intentions.push(intention)
```

Reconsideration happens only when registered triggers fire, avoiding continuous monitoring overhead.

## The Meta-Commitment Problem

A subtle issue: commitment policies themselves require commitment. If the agent continuously reconsiders its commitment policy, it hasn't solved the problem.

Georgeff's argument implies commitment policies should be architectural—part of the agent's basic design, not something reconsidered during execution. Different agents may have different policies based on their domain, but individual agents should commit to their policy.

However, learning systems might adjust commitment policies over time based on performance. This is meta-level learning: learning about when to reconsider, not just what to do.

## Application to Multi-Agent Coordination

The commitment-reconsideration trade-off becomes more complex in multi-agent systems:

### Coordination Requires Commitment Stability

Tambe's response notes that joint intentions require stability: "In multi-agent systems, intentions can be communicated to others, who can then plan around them. This only works if intentions have some stability (are not instantly abandoned)."

If Agent A commits to Task X and communicates this to Agent B, who then plans Task Y assuming X will be done, Agent A's premature abandonment of X can cascade failures to B.

**Implication**: Multi-agent commitments should have stronger stability than single-agent commitments. The reconsideration policy must account for dependencies others have created.

### Social Commitment vs. Internal Commitment

- **Internal commitment**: Private intention, affects only own planning
- **Social commitment**: Communicated intention, others depend on it

Social commitments need explicit protocols:
- Announcing commitments
- Requesting release from commitments  
- Negotiating commitment changes
- Compensating for broken commitments

### Coordination Through Commitment

One coordination mechanism: agents announce intentions, reducing need for explicit coordination messages. Others filter their options based on announced intentions.

This only works if:
1. Commitments are reasonably stable (announced intentions aren't immediately abandoned)
2. Commitment changes are communicated (agents notify when intentions change)
3. Commitment semantics are shared (agents interpret intentions similarly)

## Failure Modes and Warning Signs

### Thrashing
**Symptom**: Agent constantly replans, never completes significant work
**Diagnosis**: Reconsideration policy too permissive (too many crucial moments)
**Fix**: Strengthen commitment—raise thresholds for reconsideration

### Brittle Execution
**Symptom**: Agent continues executing plan even when clearly failing or wasteful
**Diagnosis**: Reconsideration policy too restrictive (too few crucial moments)
**Fix**: Weaken commitment—add reconsideration triggers for goal state changes

### Coordination Failures  
**Symptom**: Multi-agent plans fall apart due to unexpected commitment changes
**Diagnosis**: Insufficient distinction between social and internal commitments
**Fix**: Implement explicit social commitment protocols with stability guarantees

### Resource Depletion
**Symptom**: Agent commits resources to obsolete goals
**Diagnosis**: No resource-based reconsideration triggers
**Fix**: Add triggers for resource threshold violations

## Boundary Conditions

### When Strong Commitment Fails

Strong commitment (rarely reconsider) fails when:

1. **Highly dynamic environments**: Change rate exceeds plan completion rate
2. **High uncertainty**: Initial beliefs frequently wrong
3. **Opportunity-rich domains**: Frequent windfalls make current plans obsolete
4. **Adversarial settings**: Others actively work to invalidate your plans

In these domains, commitment must be weaker or more sophisticated (e.g., contingency plans, partial commitments).

### When Weak Commitment Fails

Weak commitment (frequently reconsider) fails when:

1. **High replanning cost**: Generating new plans is expensive
2. **Coordination requirements**: Others depend on your committed actions
3. **Startup costs**: Plans have significant sunk costs (abandoning wastes resources)
4. **Option proliferation**: Too many alternatives lead to analysis paralysis

In these domains, commitment must be stronger to avoid thrashing and coordination failures.

## The Unsolved Problem: Defining Crucial Moments

Despite the empirical proof that strategic commitment works, the BDI literature doesn't provide a complete theory of when reconsideration should occur. This is acknowledged in Pollack's response and implicit in Georgeff's use of scare quotes around "crucial moments."

**For WinDAG systems**, this means:

1. **Domain-specific policies**: Different skills and task types need different commitment policies
2. **Explicit policy specification**: Commitment policies should be part of agent/skill configuration, not hidden in code
3. **Policy learning**: Systems should track when commitments help vs. hurt, learning to adjust policies
4. **Policy explanation**: When agents reconsider (or don't), they should explain why in terms of commitment policy

The framework provides the architecture (intentions exist, they filter options, they're reconsidered strategically) but not a complete algorithm. That's where domain expertise and empirical tuning enter.

## Conclusion: The Resource-Rationality Perspective

The commitment-reconsideration trade-off exemplifies **resource-rational** agent design: optimizing performance while accounting for the computational cost of optimization itself.

Classical decision theory assumes unlimited computation—always find the optimal action. But in resource-bounded agents, the cost of finding optimal actions can exceed the value gained from finding them. Strategic commitment is the solution: accept potentially suboptimal plans if the expected cost of replanning exceeds the expected gain from better plans.

This perspective transforms the question from "what should I do?" to "how much should I think about what to do?" The answer depends on:
- How fast the environment changes
- How expensive planning is  
- How much plans typically improve with more deliberation
- How long plans take to execute

These are empirical questions about domain characteristics, not questions answerable by logic alone. The BDI architecture provides the structure to implement answers; domain expertise and experimentation provide the specific answers.