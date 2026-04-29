## BOOK IDENTITY

**Title**: The Belief-Desire-Intention Model of Agency

**Author**: Michael Georgeff, Barney Pell, Martha Pollack, Milind Tambe, Michael Wooldridge

**Core Question**: How should intelligent systems represent and manage their mental states to act effectively in dynamic, uncertain environments where complete replanning at every change is computationally infeasible?

**Irreplaceable Contribution**: This paper provides the definitive architectural argument for why beliefs, desires, and intentions must exist as separate computational components—not as philosophical niceties, but as necessary structural elements for any system operating under resource constraints in changing environments. It empirically demonstrates the failure of both classical decision theory (replan everything always) and conventional software (commit to plans forever), proving that intelligent systems require a third way: rational commitment with selective reconsideration.

## KEY IDEAS

1. **The Architectural Necessity Argument**: Beliefs, desires, intentions, and plans are not optional philosophical constructs but computationally necessary components for any system that is (a) resource-bounded, (b) operating in dynamic environments, (c) has only local/partial information, and (d) must act in real-time. Each component solves a specific computational problem created by these constraints.

2. **The Commitment-Reconsideration Trade-off**: The empirical "bold vs. cautious" experiment reveals a fundamental computational principle: systems that always replan (classical decision theory) waste resources thrashing, while systems that never replan (conventional software) miss opportunities and fail to recover. Optimal behavior requires commitment to intentions with strategic reconsideration at "crucial moments"—but defining these moments remains the central challenge.

3. **The Gap Between Task-Orientation and Goal-Orientation**: Conventional software executes tasks without remembering why, making automatic recovery and opportunistic replanning impossible. Goal-explicit representations enable systems to know where they are (beliefs), where they want to be (desires), and what they're currently doing about it (intentions)—the minimal information set for adaptive behavior.

4. **Bratman's Claim as Computational Filter**: Intentions don't just represent commitments—they actively constrain the option space that subsequent reasoning considers. This filtering is not a bias or heuristic but a rational strategy for resource-bounded agents: by focusing reasoning on options compatible with existing intentions, agents avoid the combinatorial explosion of reconsidering everything at every step.

5. **The Soar-BDI Mapping Reveals Universal Patterns**: Despite arising from different intellectual traditions (philosophy/logic vs. cognitive psychology), BDI and Soar architectures converge on isomorphic structures: operators map to intentions, states to beliefs, subgoals to desires. This convergence suggests these aren't arbitrary design choices but discovered necessities—multiple paths finding the same computational truths.

## REFERENCE DOCUMENTS

### FILE: why-beliefs-desires-intentions-exist.md

```markdown
# Why Beliefs, Desires, and Intentions Must Exist as Separate Components

## The Architectural Necessity Argument

Most treatments of the BDI model begin with philosophy—Bratman's theory of practical reasoning, folk psychology, or logical semantics. This is backwards. The profound insight in Georgeff's panel response is that beliefs, desires, intentions, and plans are not philosophical preferences but computational necessities. Any system meeting specific operational constraints must implement these components, regardless of whether it calls them by these names or acknowledges their existence.

## The Four Constraints That Force BDI Architecture

Georgeff identifies four constraints that together necessitate the BDI architecture:

1. **Dynamic environments**: The world changes while the system operates
2. **Local/partial information**: The system cannot perceive everything
3. **Resource bounds**: Computation and memory are finite
4. **Real-time requirements**: Decisions must be made within time constraints

Each constraint individually forces specific architectural features. Together, they necessitate the full BDI structure.

### Why Beliefs Must Exist

**The computational problem**: In a dynamic environment with partial observability, the system faces two information loss mechanisms:
- Events outside the perceptual sphere occur but aren't directly sensed
- Past events that were perceived are no longer in the present sensory stream

**The necessity**: Without some memory of past perceptions and inferences about unobserved states, the system must either (a) limit action to purely reactive responses to current stimuli, or (b) repeatedly re-sense or re-compute the same information.

Georgeff: "Beliefs are essential because the world is dynamic (past events need therefore to be remembered), and the system only has a local view of the world (events outside its sphere of perception need to be remembered). Moreover, as the system is resource bounded, it is desirable to cache important information rather than recompute it from base perceptual data."

**For agent systems**: This means every agent, regardless of architecture, must maintain some form of state that represents:
- Previously perceived facts that remain relevant
- Inferences about parts of the world not directly observable
- Cached computations that would be expensive to regenerate

The computational representation doesn't matter—relational database, key-value store, neural network activations, or logical predicates. What matters is that this component exists as a distinct, queryable, updatable structure. Systems that claim to be "purely reactive" either (a) are actually maintaining hidden state in the environment itself, (b) have extremely limited capabilities, or (c) are operating in environments so information-rich that the perceptual stream contains all necessary state.

### Why Desires/Goals Must Exist

**The computational problem**: How does a system recover from failures or exploit unexpected opportunities?

Conventional software is **task-oriented**: it executes procedures without representing why those procedures are being executed. When a called function fails, control returns to the caller, but the system has no automatic mechanism to:
- Understand what the failed task was trying to achieve
- Generate alternative approaches to achieve the same end
- Recognize when an alternative opportunity makes the original task unnecessary

**The necessity**: Georgeff provides the concrete example: "the reason we can recover from a missed train or unexpected flat tyre is that we know where we are (through our Beliefs) and we remember to where we want to get (through our Goals)."

**For agent systems**: Goal-explicit representation enables:

1. **Automatic failure recovery**: When a plan step fails, the system can search for alternative means to the same end without programmer-specified exception handlers for every possible failure mode.

2. **Opportunistic replanning**: If an unexpected event achieves a goal "for free" (the train we're rushing to catch gets delayed, giving us extra time), the system can recognize this and stop executing now-unnecessary actions.

3. **Intention drop**: When a goal becomes unachievable or irrelevant, the system can abandon all plans and subplans directed toward that goal, even if they're deeply nested in the execution stack.

The key insight: in dynamic environments, the reasons for actions change faster than the actions themselves complete. Goal-explicit representation lets the system reason about this semantic layer separately from the procedural layer.

### Why Intentions Must Exist (The Commitment Problem)

**The computational problem**: Given beliefs about the world and goals to achieve, when should the system:
- Generate a new plan?
- Continue executing the current plan?
- Modify the current plan?

**The false dichotomy**: Classical decision theory says "always replan for optimality." Conventional software says "never replan—commit to the plan forever." Both are computationally disastrous.

**The empirical proof**: Georgeff cites Kinny and Georgeff's experiment with simulated robots collecting points in a dynamic grid environment. The graph shows efficiency (y-axis) versus rate of environmental change (x-axis):

- **Cautious agent** (replans at every change, classical decision theory): Wastes computational resources constantly replanning. Efficiency tanks as change rate increases because it spends more time planning than acting.

- **Bold agent** (commits to plans, reconsiders only at crucial moments): Maintains higher efficiency across a wider range of change rates because it invests appropriate computational resources in planning versus execution.

- **Task-oriented agent** (commits forever, never shown but implied): Works when environments are static but fails catastrophically when change rate increases—cannot recover from failures or adapt to opportunities.

**The necessity**: "Neither classical decision theory nor conventional task-oriented approaches are appropriate—the system needs to commit to the plans and subgoals it adopts but must also be capable of reconsidering these at appropriate (crucial) moments."

Intentions are **committed plans**—plans the system has decided to execute and will continue executing unless specific reconsideration conditions are met. They represent a third computational state, distinct from:
- Beliefs (what is true)
- Desires (what outcomes are wanted)
- Plans (what procedures are known)

**For agent systems**: Intentions solve the commitment-reconsideration trade-off by:

1. **Filtering subsequent deliberation**: Once committed to an intention, the agent constrains which options it will consider next, avoiding the combinatorial explosion of reconsidering everything.

2. **Providing stability**: The agent can make multi-step plans that depend on earlier steps actually being completed, rather than being reconsidered at every moment.

3. **Enabling coordination**: In multi-agent systems, intentions can be communicated to others, who can then plan around them. This only works if intentions have some stability (are not instantly abandoned).

4. **Focusing computation**: Resource-bounded agents must allocate limited reasoning capacity. Intentions focus reasoning on refining and executing committed plans rather than endlessly exploring alternatives.

Computationally, intentions might be "executing threads" or "active procedures" or "focus-of-attention markers"—but they must exist as a distinct category that can be **interrupted upon specific conditions** while providing **commitment between interruptions**.

### Why Plans Must Exist Separately

**The computational problem**: If the system can generate plans from first principles (beliefs + goals → planning procedure → new plan), why cache plans at all?

**The necessity**: "For the same reasons the system needs to store its current Intentions (that is, because it is resource bound), it should also cache generic, parameterized Plans for use in future situations (rather than try to recreate every new plan from first principles)."

**For agent systems**: Cached plans (what BDI systems call "plan libraries") are:

1. **Compiled expertise**: Plans that worked in similar past situations, avoiding regenerating the same solution.
2. **Parameterized procedures**: Abstract plans instantiated with specific bindings for new situations.
3. **Efficiently indexed**: Organized by preconditions and goals for rapid retrieval.

This is why PRS-like systems have large plan libraries: they're not just representing "knowledge" but providing computational efficiency through caching.

## The Unified Argument

The four constraints (dynamic, partial, bounded, real-time) together create a system that must:

- **Remember** (beliefs) because it cannot constantly re-perceive or re-compute
- **Know why** (desires) because the world changes faster than plans complete
- **Commit strategically** (intentions) because optimal replanning is intractable but no replanning is brittle
- **Reuse solutions** (plans) because generating from scratch is too expensive

These aren't four independent features but a tightly integrated architecture where each component enables the others:

- Beliefs ground desires (goals must be about something in the world)
- Desires motivate intentions (commitments serve purposes)
- Intentions constrain belief updates (relevant belief changes are those that affect committed plans)
- Plans connect desires to intentions (achieving goals requires procedures)

## Implications for Agent System Design

### 1. Architectural Validation Test

Any proposed agent architecture can be evaluated by asking: where are beliefs, desires, intentions, and plans represented? If the answer is "they don't exist separately" or "they're mixed together," the architecture likely has fundamental limitations in dynamic, uncertain environments.

### 2. The "Stateless Agent" Myth

Some modern agent frameworks claim to be "stateless" or "purely reactive." Under Georgeff's analysis, these systems either:
- Are severely limited in capability (cannot plan beyond one step)
- Are hiding state in external storage (database, context, environment)
- Are not actually operating under the four constraints (operating in such information-rich environments that the current sensory/input stream contains all necessary state)

### 3. LLM-Based Agents and BDI

Modern LLM-based agents often lack explicit BDI structure:
- Beliefs are implicit in conversation history
- Desires are in prompts but not separately tracked
- Intentions don't exist—each call to the LLM potentially reconsiders everything
- Plans are generated but not cached in a reusable library

This explains common failure modes:
- **Context window limitations** force forgetting beliefs
- **Lack of goal persistence** means agents don't recover from failures or recognize when goals are achieved
- **No commitment** means thrashing between alternatives
- **Regenerating plans from scratch** wastes tokens and time

Adding explicit BDI structure to LLM-based agents means:
- Maintaining a separate, queryable belief store (not just conversation history)
- Tracking goals explicitly so they survive context window limitations
- Marking some plans as "committed intentions" that aren't reconsidered without explicit triggers
- Building a library of successful plans (with natural language descriptions) for reuse

### 4. Debugging Principles

When an agent system fails, BDI structure provides diagnostic categories:

- **Belief failures**: Wrong model of world state
- **Desire failures**: Wrong or conflicting goals
- **Intention failures**: Committed to wrong plan or failed to reconsider when should have
- **Plan failures**: Procedure doesn't achieve desired effect or has wrong preconditions

Without explicit separation, all failures look like "the system did the wrong thing."

### 5. The Crucial Moment Problem

Georgeff's argument proves intentions must exist but doesn't solve the central remaining problem: **when should intentions be reconsidered?**

The paper mentions "crucial moments" but doesn't define them precisely. This remains the key research question: what computational triggers should cause an agent to:
- Pause execution of current intentions
- Assess whether they remain valid
- Potentially replan

This is where different BDI implementations diverge and where domain expertise matters most.

## Boundary Conditions

### When BDI Structure Isn't Necessary

The architectural necessity argument depends on all four constraints holding:

1. **Static environments**: If nothing changes, task-oriented software works fine. No need for goal-explicit representation or strategic commitment.

2. **Perfect information**: If everything is observable, beliefs reduce to current sensory state. No need for inference or memory beyond immediate perception.

3. **Unlimited resources**: If computation is free, classical decision theory's "always replan" works. No need for strategic commitment.

4. **No time pressure**: If decisions can wait indefinitely, search through all possibilities becomes feasible. No need for commitment-based filtering.

Many traditional software applications operate under relaxed versions of these constraints, which is why conventional programming paradigms work for them.

### When BDI Structure Isn't Sufficient

BDI architecture is necessary but not sufficient for:

- **Learning**: BDI says nothing about how plans get into the plan library or how they improve
- **Social reasoning**: Basic BDI is single-agent; extensions needed for coordination, communication, negotiation
- **Continuous control**: BDI naturally handles discrete action selection; continuous control requires additional machinery
- **Probabilistic reasoning**: Basic BDI is symbolic; handling uncertainty requires extensions (probabilistic beliefs, utility-based desires)

## Conclusion

The profound contribution of Georgeff's argument is shifting BDI from philosophical preference to engineering necessity. Just as databases need transactions because of concurrency constraints, or distributed systems need consensus protocols because of network partitions, agents need beliefs-desires-intentions-plans because of dynamic-partial-bounded-realtime constraints.

This isn't about whether to use BDI. It's about recognizing that any system operating under these constraints is implementing BDI components whether it calls them that or not. The question is whether to make this structure explicit and well-engineered, or leave it implicit and tangled.

For WinDAG agent orchestration: every skill invocation, every task decomposition, every coordination decision happens under these four constraints. The system must maintain beliefs about task state, desires about outcomes, intentions about which DAG paths to execute, and plans about how skills compose. Making this structure explicit—rather than implicit in code or prompts—is the path to reliable, debuggable, adaptive agent systems.
```

### FILE: rational-commitment-and-reconsideration.md

```markdown
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
```

### FILE: task-vs-goal-orientation.md

```markdown
# Task-Orientation vs. Goal-Orientation: The Fundamental Divide in System Design

## The Core Distinction

Georgeff's panel response contains a deceptively simple observation with profound implications: "Conventional computer software is 'task oriented' rather than 'goal oriented'; that is, each task (or subroutine) is executed without any memory of why it is being executed."

This is not a minor implementation detail. It's a fundamental architectural choice that determines whether a system can exhibit three critical capabilities:
1. Automatic failure recovery
2. Opportunistic replanning  
3. Intention abandonment when goals become irrelevant

The distinction maps directly to whether systems can adapt to change without programmer-anticipated exception handlers for every possible contingency.

## Task-Oriented Systems: The Conventional Programming Model

### How Task-Oriented Systems Work

In conventional programming, execution follows a call stack:

```
main()
  calls solve_business_problem()
    calls fetch_data_from_database()
      calls open_connection()
      calls execute_query()
      calls close_connection()
    calls process_data()
    calls generate_report()
```

Each function knows:
- **What to do**: Its procedure (sequence of operations)
- **How to do it**: Its implementation details
- **What to return**: Its outputs

Each function does NOT know:
- **Why it was called**: The goal it serves
- **What happens if it fails**: Recovery strategies beyond its scope
- **Whether its purpose still matters**: If the goal became irrelevant

### The Recovery Problem

When `execute_query()` fails, control returns to `fetch_data_from_database()`. That function can:

1. **Catch the exception explicitly**: If programmer anticipated this failure mode
2. **Propagate the exception up**: Let caller handle it
3. **Retry**: If programmer wrote retry logic
4. **Use fallback**: If programmer wrote alternative approach

What it CANNOT do: automatically reason "I was trying to get customer data to generate a sales report. What other ways could I get customer data? Or could I generate a useful report without complete customer data?"

**The limitation**: Recovery strategies must be explicitly coded by programmers who anticipate failures. Unanticipated failures propagate up as unhandled exceptions until they crash the program or reach a generic error handler.

### The Opportunity Problem

Suppose while `fetch_data_from_database()` is running, a cached version of the needed data becomes available in memory. The task-oriented system:

1. Continues fetching from database (because that's the task being executed)
2. Ignores the cached data (no mechanism to notice it became available)
3. Wastes time and resources (no ability to recognize task became unnecessary)

**The limitation**: The system cannot recognize when its current task has been obviated by external events. It executes the task because it was called, not because the purpose still exists.

### The Irrelevance Problem  

Suppose the user cancels the report request while `process_data()` is running. The task-oriented system:

1. Completes data processing (task was started, so it finishes)
2. Proceeds to `generate_report()` (next task in sequence)
3. Returns a report nobody wants (no knowledge that purpose vanished)

**The limitation**: There's no mechanism to recognize that the entire call chain has lost its purpose. Each task completes because it was invoked, not because its outcome still matters.

## Goal-Oriented Systems: The BDI Model

### How Goal-Oriented Systems Work

In a goal-oriented architecture, execution maintains explicit goals alongside procedures:

```
Goals: [GenerateSalesReport]
Beliefs: [customer_data_needed, data_source=database]
Intentions: [
  FetchCustomerData(from=database)
    OpenConnection()
    ExecuteQuery(SELECT * FROM customers)
    ...
]
```

Each active procedure (intention) has an associated **goal context**—the explicit representation of what it's trying to achieve and why.

The system continuously maintains:
- **Goal stack**: Current goals and their relationships
- **Goal-plan bindings**: Which intentions serve which goals
- **Goal states**: Whether goals are achieved, unachievable, or still pending

### Solving the Recovery Problem

When `ExecuteQuery()` fails, the system doesn't just propagate an exception. It reasons:

1. **Identify affected goal**: "This task was serving goal FetchCustomerData"
2. **Goal still valid?**: Check if customer data is still needed
3. **Alternative means?**: Query plan library for other ways to fetch customer data
4. **Select alternative**: Choose plan based on current beliefs and constraints
5. **Execute alternative**: Switch to new plan without programmer-coded exception handler

**Example recovery chain**:
- Database query fails
- System recognizes goal: get customer data
- Checks plan library: could also call external API, read from cache, or use yesterday's data
- Evaluates options based on current situation (network available? cache fresh? report deadline?)
- Selects and executes alternative

This is **automatic failure recovery**: the system generates recovery strategies by reasoning about goals and available means, not by executing programmer-anticipated exception handlers.

### Solving the Opportunity Problem

While executing `FetchCustomerData(from=database)`, the system receives a belief update: `customer_data_cached=true`.

The system reasons:

1. **Check goal state**: Is FetchCustomerData still unachieved?
2. **Cache satisfies goal?**: Does cached data meet requirements?
3. **If yes**: Mark goal achieved, drop associated intentions
4. **Proceed**: Move to next goal with updated beliefs

**The advantage**: The system recognizes the goal is achieved regardless of how it was achieved. It doesn't matter that the current plan wasn't completed—what matters is the goal state.

### Solving the Irrelevance Problem

User cancels report request. System:

1. **Remove goal**: GenerateSalesReport dropped from goal stack
2. **Cascade**: Identify all subgoals serving GenerateSalesReport (FetchCustomerData, ProcessData, etc.)
3. **Drop intentions**: Abandon all plan steps serving now-irrelevant goals
4. **Release resources**: Close database connection, deallocate memory, etc.

**The advantage**: Goal dependencies enable automatic cleanup. When a high-level goal is dropped, all supporting goals and plans are recognized as obsolete and terminated.

## The Architectural Difference

The fundamental distinction:

**Task-oriented**: Call stack represents "what we're doing"
**Goal-oriented**: Goal stack represents "why we're doing it" + Intention stack represents "how we're doing it"

The goal-oriented system maintains an additional semantic layer—the purpose layer—that enables reasoning task-oriented systems cannot perform.

## Georgeff's Example: The Flat Tire

"The reason we can recover from a missed train or unexpected flat tyre is that we know where we are (through our Beliefs) and we remember to where we want to get (through our Goals)."

### Task-Oriented Approach

Plan: [Drive to station, Park, Buy ticket, Board train]
Flat tire happens during "Drive to station"
System: ???

Without explicit goals, the system doesn't know:
- Why it was driving to the station (catch train)
- Where it's ultimately trying to get (meeting downtown)
- What's essential vs. incidental (being at the meeting vs. taking the specific train)

Recovery requires programmer to anticipate "flat tire" failure mode and code explicit handler: "If flat tire, call taxi to station."

But what if no taxis are available? What if a colleague offers to drive you directly to the meeting? What if the meeting moves online? Every contingency requires explicit coding.

### Goal-Oriented Approach  

Goals: [AttendMeeting(location=downtown, time=9am)]
Beliefs: [current_location=home, current_time=8am, car_has_flat_tire]
Plans: [Drive to station] ← current execution

System recognizes:
1. Current plan (drive to station) has failed (can't drive with flat tire)
2. Goal (attend meeting downtown at 9am) still valid and achievable
3. Alternative plans exist (taxi to meeting, taxi to station, ask colleague for ride, video conference)
4. Select alternative based on current beliefs (time remaining, taxi availability, colleague locations, meeting flexibility)

**The key**: The system doesn't need programmer-anticipated exception handlers. It generates recovery strategies by:
- Remembering the ultimate goal (attend meeting)
- Accessing beliefs about current state (flat tire, time, locations)
- Querying plan library for alternative means to goal
- Evaluating alternatives given current constraints

## Implications for Agent System Design

### 1. Every Skill Invocation Should Have Goal Context

In WinDAG orchestration, when a skill is invoked, the system should record:

```
SkillExecution {
  skill: "extract_data_from_pdf"
  parameters: {...}
  goal: "analyze_contract_terms"       // Why this skill?
  parent_goal: "due_diligence_report"  // Higher-level purpose?
  success_conditions: [...]             // How to know goal achieved?
  failure_handling: [...]               // Goal still achievable if this fails?
}
```

This enables:
- Automatic retry with alternative skills if this one fails
- Recognition when goal is achieved by other means (stop executing this skill)
- Cascade cleanup when higher-level goal is dropped

### 2. Task Decomposition Must Preserve Goal Relationships

When decomposing complex tasks:

```
DecomposeTask(task, goal) -> subtasks:
  # Don't just break into steps
  for subtask in subtasks:
    subtask.goal = derive_subgoal(subtask, goal)  // Explicit purpose
    subtask.parent = goal                         // Goal hierarchy
    subtask.alternatives = find_alternative_means(subtask.goal)  // Recovery options
```

This creates a **goal-plan tree** where:
- Leaf nodes are executable actions
- Internal nodes are goals
- Edges represent means-end relationships

The tree enables reasoning: "If this path fails, what other paths serve the same higher-level goal?"

### 3. Failure Recovery Becomes Goal-Directed Search

Instead of predefined exception handlers:

```
function handle_skill_failure(failed_skill):
  affected_goal = failed_skill.goal
  
  if not still_relevant(affected_goal):
    # Goal became irrelevant, just drop it
    cleanup(failed_skill)
    return
  
  if goal_achieved_by_other_means(affected_goal):
    # Goal already achieved, mark success
    mark_achieved(affected_goal)
    return
  
  # Goal still relevant and unachieved, find alternative
  alternative_plans = plan_library.query(goal=affected_goal)
  for plan in alternative_plans:
    if feasible(plan, current_beliefs):
      execute(plan)
      return
  
  # No alternatives, propagate failure to parent goal
  handle_goal_unachievable(affected_goal)
```

This is a **general** recovery mechanism, not failure-specific handling.

### 4. Opportunistic Replanning Becomes Goal Monitoring

Instead of blindly executing plans:

```
function monitor_goals():
  for goal in active_goals:
    if goal_achieved(goal, current_beliefs):
      # Goal satisfied, drop associated plans
      cancel_plans(goal)
      mark_achieved(goal)
    
    elif goal_unachievable(goal, current_beliefs):
      # Goal impossible, propagate failure
      handle_goal_unachievable(goal)
    
    elif goal_irrelevant(goal, current_beliefs):
      # Goal no longer matters, clean up
      drop_goal(goal)
```

This runs continuously (or on belief updates), enabling the system to:
- Stop work when goals are achieved by external events
- Abandon goals that became impossible
- Clean up goals that became irrelevant

### 5. Multi-Agent Coordination Becomes Goal Negotiation

Agents can coordinate by reasoning about goals:

Agent A: "I'm trying to achieve goal X"
Agent B: "I can help with that by achieving subgoal Y"
or
Agent B: "That conflicts with my goal Z"

This is more flexible than task-level coordination ("I'm executing procedure P") because:
- Goals admit multiple implementations (find compatible plans)
- Goal conflicts are easier to detect than plan conflicts
- Goal negotiation creates stable commitments (agents commit to goals, flexibly adapt plans)

## The Gap Between Theory and Practice

### Why Don't All Systems Use Goal-Oriented Architectures?

Several reasons:

1. **Implementation complexity**: Goal reasoning requires additional machinery (goal representation, goal-plan indexing, goal state monitoring)

2. **Performance overhead**: Maintaining and querying goal context adds computational cost

3. **Static environments**: In unchanging worlds, task-oriented works fine (no failures to recover from, no opportunities to exploit)

4. **Programmer control**: Some domains require precise control over execution flow (real-time systems, safety-critical applications)

5. **Lack of awareness**: Many developers unaware of the distinction or its implications

### When Task-Orientation Is Sufficient

Goal-orientation is overkill when:

1. **Failures are rare**: Environment is stable, failures are exceptional
2. **Failures are anticipated**: All failure modes known, explicit handlers sufficient  
3. **Opportunities don't arise**: No unexpected shortcuts or alternative means appear
4. **Goals don't change**: What you set out to do remains relevant until done
5. **Performance is critical**: Cannot afford goal reasoning overhead

This describes many traditional software applications: operating in controlled environments, processing predictable inputs, executing well-defined procedures.

### When Goal-Orientation Is Necessary

Goal-orientation becomes necessary when:

1. **High failure rates**: Dynamic environments where plans frequently fail
2. **Unanticipated failures**: Cannot predict all failure modes in advance
3. **Opportunistic domains**: Better alternatives often appear during execution
4. **Shifting priorities**: Goals become relevant or irrelevant based on external events
5. **Resource constraints**: Cannot afford to continue executing obsolete plans

This describes most agent applications: operating in open worlds, interacting with humans and other agents, pursuing multiple simultaneous goals.

## Pollack's Additional Insight: Plans as Derived Intentions

Pollack's response adds nuance: goal-orientation doesn't mean plans are irrelevant. Rather, plans are "derived intentions"—commitments formed to achieve goals, but understood in the context of those goals.

"IRMA agents still need to perform means-end reasoning (in a focused way), and Soar, with its chunking strategies, can make the means-end reasoning process more efficient. Again, IRMA agents still need to weigh alternatives (in a focused way), and to do this they may use the techniques studied in the literature on economic agents."

The point: goals don't replace plans, they contextualize them. The system still executes procedural plans, but it:

1. **Remembers why**: Each plan step is linked to goals it serves
2. **Monitors validity**: Checks whether plans still serve their goals
3. **Generates alternatives**: Can find new plans for same goals when current plans fail

This is the synthesis: goal-oriented systems execute task-like procedures (for efficiency) but maintain goal context (for adaptability).

## Practical Implementation Pattern

Here's a concrete pattern for adding goal-orientation to existing task-based systems:

### Step 1: Annotate Tasks with Goals

```python
@task(goal="extract_structured_data")
def parse_pdf(file_path):
    # Existing implementation
    ...

@task(goal="extract_structured_data")  # Same goal!
def parse_html(url):
    # Alternative implementation
    ...
```

### Step 2: Track Goal-Task Bindings

```python
class GoalTracker:
    def __init__(self):
        self.active_goals = {}  # goal_id -> Goal
        self.goal_task_map = {}  # goal_id -> current_task
        self.task_goal_map = {}  # task_id -> goal_id
    
    def start_task_for_goal(self, task, goal):
        self.active_goals[goal.id] = goal
        self.goal_task_map[goal.id] = task
        self.task_goal_map[task.id] = goal.id
```

### Step 3: Check Goal State on Task Completion/Failure

```python
def handle_task_result(task_id, result):
    goal_id = task_goal_map[task_id]
    goal = active_goals[goal_id]
    
    if result.success:
        goal.mark_achieved()
        cleanup_completed_goal(goal)
    else:
        # Task failed, but maybe goal still achievable?
        alternative_tasks = find_tasks_for_goal(goal)
        if alternative_tasks:
            execute_task(alternative_tasks[0], goal)
        else:
            goal.mark_unachievable()
            propagate_failure(goal)
```

### Step 4: Monitor for Opportunistic Goal Achievement

```python
def on_belief_update(new_belief):
    for goal in active_goals:
        if goal_satisfied_by_belief(goal, new_belief):
            # Goal achieved without completing current task!
            current_task = goal_task_map[goal.id]
            cancel_task(current_task)
            goal.mark_achieved()
```

This pattern adds goal-orientation gradually, without rewriting existing code. Tasks remain as procedural implementations, but they're contextualized by goals.

## Conclusion: Goals as Semantic Glue

Task-orientation and goal-orientation aren't opposite poles but layers of abstraction:

- **Execution layer** (task-oriented): Efficient procedural code that does the work
- **Semantic layer** (goal-oriented): Purpose representation that enables adaptation

The breakthrough of BDI architecture is recognizing that both layers are necessary:

- **Without tasks/plans**: System must reason from first principles every time (intractable)
- **Without goals**: System cannot adapt when plans fail or situations change (brittle)

The combination gives you:
- Efficient execution through procedural plans
- Adaptive behavior through goal reasoning
- Automatic recovery through means-end reasoning
- Opportunistic replanning through goal monitoring

For WinDAG orchestration: every skill invocation, every DAG node execution, every task decomposition should maintain explicit goal context. This transforms the system from a task executor that breaks on unexpected inputs into an adaptive agent that can recover from failures, exploit opportunities, and clean up obsolete work automatically.

The goal layer is the difference between a system that can only do what you programmed it to do, and a system that can figure out how to achieve what you want even when what you programmed doesn't work.
```

### FILE: soar-bdi-convergent-evolution.md

```markdown
# Soar and BDI: Convergent Evolution in Agent Architecture

## The Remarkable Parallel

Tambe's panel response reveals something profound: two research traditions—BDI (rooted in philosophy and logic) and Soar (rooted in cognitive psychology and empirical AI)—independently converged on nearly identical architectural structures. This convergence is not coincidental. It suggests these structures represent discovered necessities, not invented preferences.

Tambe writes: "Indeed, the Soar model seems fully compatible with the BDI architectures mentioned above...While this abstract description ignores significant aspects of the Soar architecture, such as (i) its meta-level reasoning layer, and (ii) its highly optimized rule-based implementation layer, it will be sufficient for the sake of defining an abstract mapping between BDI architectures and Soar."

## The Mapping

Tambe proposes a direct correspondence between Soar and BDI components:

| BDI Component | Soar Component |
|---------------|----------------|
| **Intentions** | Selected operators |
| **Beliefs** | Current state |
| **Desires/Goals** | Goals (including subgoaled operators) |
| **Commitment strategies** | Operator termination conditions |

This isn't a loose analogy. It's a precise mapping at the level of computational function.

### Intentions ↔ Selected Operators

In Soar, operators are procedural knowledge elements—chunks of problem-solving behavior. An operator becomes an **intention** when it's selected for execution.

**The parallel**: Both represent committed courses of action. In BDI, forming an intention means committing to a plan. In Soar, selecting an operator means committing to a problem-solving method.

**The shared principle**: The system must commit to actions, not just consider them as possibilities. This commitment:
- Focuses subsequent reasoning (other operators/plans consistent with this choice)
- Provides stability (operator/plan continues unless termination conditions met)
- Enables multi-step procedures (later steps can depend on earlier committed steps)

**Difference in emphasis**: BDI literature focuses on when to reconsider intentions (commitment strategies). Soar literature focuses on how to select operators (preference semantics). But both address the same computational problem: choosing actions and maintaining commitments to them.

### Beliefs ↔ Current State  

In Soar, the state represents the agent's current problem-solving context—its model of the situation it's addressing.

**The parallel**: Both represent the agent's knowledge about the world and its own processing.

**The shared principle**: In dynamic, partially observable environments, the system must maintain memory of:
- Past perceptions (not currently in sensory stream)
- Inferred facts (not directly observable)
- Computed results (cached to avoid recomputation)

**Difference in emphasis**: BDI literature often discusses belief revision, belief update operators, and belief logics. Soar literature focuses on how beliefs are encoded in working memory elements and how they're pattern-matched against operator preconditions. But both address state maintenance in dynamic environments.

### Desires ↔ Goals

In Soar, goals arise when the system needs to do something but doesn't immediately know how—when operator selection reaches an impasse, a subgoal is created.

**The parallel**: Both represent desired states or outcomes the system is trying to achieve.

**The shared principle**: Goal-explicit representation enables:
- Knowing when to stop (goal achieved)  
- Knowing when to abandon effort (goal unachievable or irrelevant)
- Generating alternatives (different means to same goal)

**Key difference**: BDI systems typically start with explicit goals (desires) and generate plans to achieve them. Soar systems often generate goals dynamically through impasses—goals are discovered during problem-solving, not specified in advance.

This is a significant architectural difference, but it doesn't violate the mapping. Soar's goal generation is a specific mechanism for desire formation. BDI systems could incorporate similar mechanisms.

### Commitment Strategies ↔ Termination Conditions

In Soar, operators have termination conditions—specifications of when a selected operator should stop executing.

**The parallel**: Both determine when to reconsider committed actions.

**The shared principle**: Commitment isn't blind—there are conditions under which commitments should be reconsidered. These include:
- Goal achievement (purpose fulfilled)
- Execution failure (action cannot continue)
- Goal obsolescence (purpose no longer relevant)

**Difference in emphasis**: BDI literature explicitly discusses commitment strategies as policies (blind commitment, goal-driven commitment, resource-rational commitment). Soar literature treats termination conditions as operator-specific knowledge. But functionally, they serve the same purpose: defining when reconsidering commitments is warranted.

## What the Convergence Reveals

### 1. These Aren't Arbitrary Design Choices

The independent convergence of two traditions on the same four-component structure suggests these components are **necessary consequences** of the operational constraints (dynamic, partial, bounded, real-time) discussed by Georgeff.

**If you need to:**
- Operate in dynamic environments → need beliefs (state memory)
- Achieve goals in changing contexts → need desires (purpose representation)
- Act efficiently in real-time → need intentions (commitment mechanism)
- Learn from experience → need plans/operators (reusable procedures)

**Then you'll build:** Something functionally equivalent to BDI/Soar, regardless of what you call it.

This is similar to convergent evolution in biology: multiple species independently evolving similar solutions (eyes, wings, camouflage) to similar environmental pressures. The environmental pressures for agents are computational constraints; the evolved solutions are BDI/Soar architectures.

### 2. Different Intellectual Paths to Same Truth

**BDI path**: Philosophy (Bratman's practical reasoning) → Logic (BDI logics) → Architecture (PRS/dMARS) → Applications

**Soar path**: Cognitive psychology (human problem-solving) → Symbolic AI (production systems) → Architecture (Soar) → Applications

These paths share minimal intellectual overlap—different conferences, different publications, different vocabulary. Yet they arrive at the same architectural structure.

**The implication**: This structure represents something **objectively true** about agent architectures, not a convention or fashion within one research community.

### 3. Opportunities for Cross-Fertilization

Tambe notes: "there is an unfortunate lack of awareness exhibited in both communities about each others' research. The danger here is that both could end up reinventing each others' work in different disguises."

**BDI → Soar transfers**:
- BDI formal semantics could provide logical foundations for Soar
- BDI commitment strategies could inform operator termination policies
- BDI multi-agent coordination theories could enhance Soar team modeling

**Soar → BDI transfers**:  
- Soar's chunking (learning) could provide BDI systems with plan library generation
- Soar's impasse-driven subgoaling could provide BDI systems with dynamic goal generation
- Soar's truth maintenance could improve BDI belief revision

Tambe's STEAM system (teamwork in Soar) demonstrates this cross-fertilization: using joint intentions theory (from BDI research) to build teamwork capabilities in Soar agents.

## Divergent Emphases: Where the Traditions Differ

While the core architectures map cleanly, the traditions emphasize different aspects:

### BDI Emphasis: Logical Foundations

BDI research invests heavily in formal logic:
- Modal logics of belief, desire, and intention
- Temporal logics for reasoning about actions
- Soundness and completeness proofs

**Strength**: Provides clear semantics for agent mental states. Enables formal verification of agent properties.

**Limitation**: Logic often outpaces implementation. Many BDI logics describe ideal agents that are computationally intractable to implement.

### Soar Emphasis: Cognitive Fidelity

Soar research aims to model human cognition:
- Inspired by human problem-solving protocols
- Validated against psychological experiments
- Explains phenomena like skill acquisition, memory effects, learning curves

**Strength**: Provides psychological plausibility. Helps understand human-agent interaction.

**Limitation**: Cognitive fidelity sometimes conflicts with engineering efficiency. Some human limitations (e.g., working memory bounds) may not be desirable in artificial agents.

### BDI Emphasis: Commitment and Reconsideration

BDI research focuses deeply on when to maintain vs. reconsider intentions:
- Commitment strategies as explicit policies
- Balancing stability against reactivity
- Resource-rational commitment

**Strength**: Provides principled approach to the replanning question.

**Limitation**: Often treats operator/plan selection as secondary. Less developed theory of how to choose initial plans.

### Soar Emphasis: Operator Selection

Soar research focuses deeply on how to select operators:
- Preference semantics for comparing operators  
- Chunking to learn from impasse resolution
- Search control through preference knowledge

**Strength**: Provides powerful mechanisms for choice among alternatives.

**Limitation**: Less explicit treatment of when to reconsider already-selected operators. Termination conditions often implicit in operator design.

## Synthesis: The Best of Both

What would a system combining BDI and Soar strengths look like?

### From BDI: Explicit Commitment Management

- Intentions as first-class entities with clear lifecycle
- Commitment strategies as configurable policies
- Explicit reasoning about intention revision

### From Soar: Learning Mechanisms

- Chunking to automatically generate plans/operators from experience
- Truth maintenance to keep beliefs consistent as state changes
- Meta-level reasoning to reflect on own problem-solving

### From BDI: Multi-Agent Coordination

- Joint intentions and shared plans
- Communication strategies for collaborative goal achievement
- Social commitment protocols

### From Soar: Integrated Cognitive Architecture

- Unified mechanisms for different reasoning types (procedural, episodic, semantic)
- Psychologically inspired learning curves and memory effects
- Attentional focusing and automatization

### Combined: Adaptive Agent with Logical Foundation

An agent that:
1. Maintains beliefs, desires, intentions explicitly (BDI structure)
2. Learns plans/operators from experience (Soar chunking)
3. Commits strategically with explicit policies (BDI commitment)
4. Selects actions via preference semantics (Soar selection)
5. Coordinates with others via joint intentions (BDI multi-agent)
6. Maintains state consistency automatically (Soar truth maintenance)

This isn't hypothetical—Tambe's STEAM system demonstrates elements of this synthesis.

## Implications for Modern Agent Systems

### 1. Validate Architectures Against Both Traditions

When designing agent systems, ask:

**BDI questions:**
- Are beliefs, desires, and intentions explicit and separable?
- Is there a clear commitment strategy for intentions?
- Can the system reason about why it's doing what it's doing?

**Soar questions:**
- How does the system learn new operators/plans?
- How does it select among multiple applicable operators?
- How does it maintain consistency as state changes?

If either set of questions lacks good answers, the architecture likely has blind spots.

### 2. Don't Reinvent: Map to Known Architectures

Many "novel" agent architectures are rediscovering BDI or Soar principles under different names:

- "Reactive planners" ↔ PRS with aggressive reconsideration
- "Hierarchical task networks" ↔ Soar with operator subgoaling
- "Goal-conditioned policies" ↔ BDI plans indexed by goals
- "Executable knowledge graphs" ↔ Soar state + operators

Before implementing a "new" architecture, map it to BDI/Soar. If the mapping is clean, you're rediscovering existing work—read that literature first. If the mapping reveals gaps, those gaps might be true innovations worth pursuing.

### 3. Learn from the Convergence

The BDI-Soar convergence didn't happen in a vacuum. Both built on earlier work:
- Production systems (Newell & Simon)
- Means-end analysis (GPS)
- Problem space search (problem-solving as search)

These are even deeper architectural necessities. Any agent system will implicitly implement:
- Some form of state representation (beliefs)
- Some form of goal-directed behavior (desires)
- Some form of committed execution (intentions)
- Some form of reusable procedures (plans/operators)

The question isn't whether to implement these—you will, whether you realize it or not. The question is whether to make them explicit, clean, and well-engineered, or leave them implicit, tangled, and hard to debug.

### 4. Bridge the Communities

Tambe: "This panel discussion was an excellent step to attempt to bridge this gap in general."

For WinDAG and similar systems:

**Read both literatures**: BDI papers and Soar papers address the same problems with different vocabularies. Both have insights the other lacks.

**Use both tools**: PRS-like systems provide excellent plan execution and commitment management. Soar-like systems provide powerful learning and operator selection. Hybrid systems might use both.

**Speak both languages**: When explaining agent architectures to different audiences (philosophers, psychologists, engineers), being fluent in both BDI and Soar vocabularies helps communicate with each group.

## The Soar-BDI Divide and LLM Agents

Modern LLM-based agents are rediscovering issues that BDI and Soar resolved decades ago:

### Problem: LLM Agents Lack Explicit State Management

**What they do**: Maintain state implicitly in conversation history/context window
**BDI/Soar solution**: Explicit belief representation, separate from execution trace
**Why it matters**: State can be queried, updated, maintained beyond context limits

### Problem: LLM Agents Don't Learn Reusable Procedures

**What they do**: Generate plans from scratch each time, or retrieve via semantic similarity
**BDI solution**: Plan libraries with pre/postconditions, indexed by goals
**Soar solution**: Chunking to automatically create operators from problem-solving episodes
**Why it matters**: Avoid regenerating solutions to solved problems

### Problem: LLM Agents Lack Commitment Mechanisms

**What they do**: Potentially reconsider entire plan at each step
**BDI/Soar solution**: Selected operators/intentions remain committed unless termination conditions met
**Why it matters**: Avoid thrashing, enable multi-step coordination

### Problem: LLM Agents Can't Explain Their Choices

**What they do**: Generate actions from opaque neural processes
**BDI solution**: Explicit goal-plan relationships enable "I'm doing X to achieve Y"
**Soar solution**: Preference semantics enable "I chose X over Y because..."
**Why it matters**: Transparency, debugging, trust

Adding BDI/Soar structure to LLM-based agents doesn't mean replacing LLMs—it means using LLMs as components within a larger architecture:

- **LLM for plan generation**: Use LLM to generate candidate plans
- **BDI for plan management**: Use BDI architecture to select, commit to, execute, and reconsider plans
- **LLM for belief updates**: Use LLM to interpret perceptions and update beliefs
- **Soar for learning**: Use Soar-style chunking to cache LLM-generated plans that worked
- **LLM for operator selection**: Use LLM to generate preferences among operators
- **BDI for commitment**: Use BDI commitment strategies to decide when to keep vs. change LLM-suggested plans

This is the synthesis: LLMs provide flexible reasoning and natural language interface; BDI/Soar provide architectural structure for reliability, learning, and commitment.

## The Meta-Lesson: Multiple Paths to Truth

Perhaps the deepest lesson from the Soar-BDI convergence is epistemological: **different methodologies can validate the same result**.

- Philosophy can derive agent architectures from first principles (Bratman)
- Psychology can observe agent architectures in human cognition (Newell)
- Engineering can empirically discover agent architectures through application development (Georgeff)

When all three paths arrive at the same structure (beliefs, desires, intentions, plans), confidence in that structure increases dramatically.

For agent researchers and practitioners: don't dismiss work from other traditions. The philosophy papers, cognitive psychology experiments, and engineering case studies are all evidence for the same underlying truths about agent architecture.

The BDI-Soar mapping proves these truths are tradition-independent—they're laws of agent design, as fundamental as data structures are laws of programming.

## Conclusion: Convergent Architecture as Design Principle

The Soar-BDI convergence transforms how we should think about agent architecture:

**Not**: "I prefer BDI architecture" (matter of taste)
**But**: "Any system meeting these constraints will implement BDI-like structure" (matter of necessity)

**Not**: "Soar is one approach among many" (arbitrary choice)
**But**: "Soar rediscovered architectural necessities through cognitive modeling" (empirical validation)

**Not**: "Should we use BDI or Soar?" (false dichotomy)
**But**: "How can we synthesize insights from both traditions?" (constructive question)

For WinDAG orchestration: the convergence provides validation. If independent research traditions converge on beliefs-desires-intentions-plans, then building explicit infrastructure for these components (not leaving them implicit in code/prompts) is the principled choice.

The convergence also provides humility. BDI and Soar researchers thought they were building different things, only to discover they'd built the same thing. This suggests there are fundamental patterns in agent architecture that transcend individual frameworks—patterns we ignore at our peril.

The goal isn't to implement "BDI" or implement "Soar" but to implement the underlying architectural necessities they both discovered. Call them what you want; structure them explicitly, and you'll have agents that can commit, reconsider, learn, and adapt in dynamic environments.

That's not a philosophical preference. It's engineering reality, validated by convergent evolution across independent research traditions.
```

### FILE: multi-agent-commitment-and-coordination.md

```markdown
# Multi-Agent Coordination Through Commitments

## The Coordination Problem

Tambe's observation about multi-agent extensions reveals a critical limitation of basic BDI architecture: "the basic BDI model gives no archi
tectural consideration to explicitly multi-agent aspects of behaviour."

The single-agent BDI model addresses:
- How one agent reasons about its own beliefs, desires, intentions
- When one agent should commit to or reconsider its own plans
- How one agent recovers from failures in isolation

But multi-agent systems introduce fundamentally new challenges:
- How agents coordinate without central control
- How agents make commitments to each other
- How agents recover when coordinated plans fail
- How agents know what others are doing and planning

The extension from single-agent to multi-agent isn't just adding communication—it requires rethinking what commitments mean.

## Commitment as Coordination Mechanism

Tambe writes: "In multi-agent systems, intentions can be communicated to others, who can then plan around them. This only works if intentions have some stability (are not instantly abandoned)."

This reveals intentions playing a **second role** beyond their single-agent function:

### Single-Agent Role
- Filter options (focus reasoning)
- Provide stability (avoid thrashing)
- Enable multi-step plans (later steps depend on earlier commitments)

### Multi-Agent Role  
- Coordination substrate (others can depend on your commitments)
- Communication content (tell others what you'll do)
- Trust foundation (commitments have social meaning)

The multi-agent role imposes **stronger stability requirements**. In single-agent scenarios, you can reconsider intentions whenever locally rational. In multi-agent scenarios, premature intention abandonment breaks others' plans.

### Example: Cascading Failure from Broken Commitments

**Scenario**: Three agents building a report
- Agent A commits to data collection (by Tuesday)
- Agent B commits to analysis (by Thursday, depends on A's data)
- Agent C commits to visualization (by Friday, depends on B's analysis)

**Single-agent reasoning (A)**: "Data collection is harder than expected. I'll abandon this approach and try a different data source. Will take until Wednesday."

**Consequence**: A's local replanning breaks B's timeline, which breaks C's timeline. Report delivery fails, not because of capability limits but because of uncoordinated commitment changes.

**The problem**: A's commitment wasn't just to itself—it was implicitly to B and C. Unilateral reconsideration violated social commitment without renegotiation.

## Social vs. Internal Commitments

The solution requires distinguishing commitment types:

### Internal Commitments (Private Intentions)
- Agent's own planning choices
- Not communicated to others
- Can be reconsidered unilaterally based on local information
- Subject to single-agent commitment strategies (bold, cautious, etc.)

### Social Commitments (Public Intentions)
- Communicated to other agents
- Others may have planned around them
- Should not be reconsidered unilaterally
- Require explicit protocols for commitment change

**The key insight**: The same computational structure (intentions) serves different social roles depending on visibility.

### Implementation Pattern

```
Intention {
  plan: Plan
  goal: Goal
  commitment_level: {INTERNAL, ANNOUNCED, DEPENDED_UPON, CONTRACTED}
  dependent_agents: Set<AgentID>
  termination_conditions: TerminationPolicy
  social_reconsideration_policy: SocialPolicy
}

SocialPolicy {
  requires_notification: bool
  requires_permission: bool  
  requires_compensation: bool
  fallback_obligation: Option<Plan>
}
```

**Commitment levels**:

- **INTERNAL**: Private intention, reconsider freely
- **ANNOUNCED**: Communicated to others but no dependencies yet, reconsideration should notify
- **DEPENDED_UPON**: Others have planned around this, reconsideration requires negotiation  
- **CONTRACTED**: Formal agreement, reconsideration requires compensation or substitution

As commitments move up this hierarchy, reconsideration becomes more constrained—not for single-agent reasoning efficiency but for multi-agent coordination reliability.

## Protocols for Social Commitment Management

### 1. Commitment Announcement

Before others can depend on your intentions, they must know about them:

```
announce_commitment(agent_id, intention):
  message = {
    type: "COMMITMENT_ANNOUNCEMENT"
    agent: agent_id
    intention: {
      goal: intention.goal
      completion_time: estimate_completion(intention)
      confidence: estimate_probability_of_success(intention)
      preconditions: get_required_conditions(intention)
    }
  }
  broadcast(message, interested_agents)
  intention.commitment_level = ANNOUNCED
```

**Purpose**: Let others know what you'll do so they can:
- Avoid conflicts (not pursue incompatible goals)
- Identify synergies (coordinate complementary goals)
- Create dependencies (plan around your expected outcomes)

### 2. Dependency Declaration

When Agent B plans around Agent A's commitment:

```
declare_dependency(agent_b, agent_a, intention_a):
  message = {
    type: "DEPENDENCY_DECLARATION"
    from: agent_b
    on: agent_a
    intention_id: intention_a.id
    dependency_type: {REQUIRES_COMPLETION, REQUIRES_TIMING, REQUIRES_OUTCOME}
    impact_if_broken: estimate_impact()
  }
  send(message, agent_a)
  
  # Agent A updates its commitment
  agent_a.intentions[intention_id].commitment_level = DEPENDED_UPON
  agent_a.intentions[intention_id].dependent_agents.add(agent_b)
```

**Purpose**: Make dependencies explicit so Agent A knows:
- Others are counting on this commitment
- Unilateral reconsideration will cause problems
- Social renegotiation is required before changing plans

### 3. Commitment Renegotiation

When Agent A needs to reconsider a social commitment:

```
request_commitment_change(agent_a, intention):
  if intention.commitment_level < ANNOUNCED:
    # Internal commitment, reconsider freely
    reconsider(intention)
    return
  
  if intention.commitment_level == ANNOUNCED:
    # Notify others but don't need permission
    notify_commitment_change(intention, "Reconsidering announced intention")
    reconsider(intention)
    return
  
  if intention.commitment_level >= DEPENDED_UPON:
    # Must negotiate with dependent agents
    for dependent in intention.dependent_agents:
      request = {
        type: "COMMITMENT_CHANGE_REQUEST"
        intention: intention.id
        reason: explain_why_reconsidering()
        alternatives: [
          propose_alternative_1(),
          propose_alternative_2()
        ]
        compensation: offer_compensation()
      }
      send(request, dependent)
    
    # Wait for responses, negotiate
    responses = collect_responses(intention.dependent_agents)
    if all_agree(responses):
      reconsider(intention)
    else:
      resolve_conflicts(responses)
```

**Purpose**: Transform commitment changes from unilateral actions into negotiated agreements.

### 4. Commitment Monitoring

Agents monitor others' commitments they depend on:

```
monitor_dependencies(agent):
  for dependency in agent.dependencies:
    status = query_commitment_status(dependency.agent, dependency.intention)
    
    if status == ACHIEVED:
      # Dependency satisfied, proceed
      mark_precondition_satisfied(dependency)
    
    elif status == AT_RISK:
      # Commitment in trouble, prepare contingencies
      activate_backup_plan(dependency)
    
    elif status == BROKEN:
      # Commitment failed, replan
      handle_dependency_failure(dependency)
```

**Purpose**: Detect commitment failures early and respond proactively rather than being surprised by broken dependencies.

## Joint Intentions: Commitments to Shared Goals

The protocols above handle dependencies between independent goals. **Joint intentions** go further: multiple agents commit to a shared goal.

Tambe's STEAM system builds on Cohen and Levesque's joint intentions theory, and Grosz and Kraus's SharedPlans framework. Key principles:

### 1. Joint Commitment to Shared Goal

```
form_joint_intention(agents, shared_goal):
  joint_intention = {
    goal: shared_goal
    participants: agents
    individual_commitments: {}  # Each agent's part
    mutual_beliefs: {}          # What everyone knows everyone knows
    group_commitment_policy: {} # How group decides to reconsider
  }
  
  for agent in agents:
    individual_goal = agent.part_of(shared_goal)
    agent.commit_to(individual_goal, joint_intention)
    joint_intention.individual_commitments[agent] = individual_goal
```

**The social semantics**: Each agent commits not just to their individual part but to:
- The team achieving the overall goal
- Helping teammates if they struggle
- Monitoring team progress
- Notifying team of problems

### 2. Mutual Belief Maintenance

Joint intentions require **common ground**—what everyone knows everyone knows:

- Everyone knows the shared goal
- Everyone knows who's doing what part
- Everyone knows everyone knows this (recursive!)

Without common ground, agents might have different understandings of the joint plan, leading to coordination failures.

**Implementation**: Broadcast updates ensure common ground:

```
update_team_belief(joint_intention, new_fact):
  message = {
    type: "TEAM_BELIEF_UPDATE"
    joint_intention: joint_intention.id
    fact: new_fact
    known_by: [agent_id]  # Initiator
  }
  broadcast(message, joint_intention.participants)
  
  # Wait for acknowledgments to establish mutual belief
  acks = collect_acknowledgments(joint_intention.participants)
  if all_received(acks):
    establish_mutual_belief(new_fact)
```

### 3. Team-Oriented Commitment

Individual agents in joint intentions monitor:

- **Own task progress**: Am I on track?
- **Teammates' task progress**: Are they on track?
- **Overall goal status**: Are we collectively achieving the goal?

Commitment policies reflect team context:

```
reconsider_joint_intention(agent, joint_intention):
  # Stronger commitment than individual intentions
  if own_task_failed(agent, joint_intention):
    request_team_help()  # Before abandoning
  
  if teammate_task_failed(teammate, joint_intention):
    offer_help(teammate)  # Help before they fail
  
  if overall_goal_unachievable(joint_intention):
    propose_team_reconsideration()  # Abandon jointly
  
  # Never abandon unilaterally
```

**The principle**: Joint intentions require joint reconsideration. Individual agents don't drop out without team agreement.

## Coordination Without Communication: Intention Recognition

Not all coordination happens through explicit protocols. Agents can also coordinate by **recognizing each other's intentions** from observed behavior.

### Plan Recognition as Inverse Planning

Given observations of Agent A's actions, Agent B can infer:
- What goal is A pursuing?
- What plan is A executing?
- What will A likely do next?

This enables:
- **Predictive coordination**: B anticipates A's future actions
- **Complementary action**: B takes actions that help A achieve its goal
- **Conflict avoidance**: B avoids actions that would interfere with A's plan

### Intention-Based Prediction

Once Agent B recognizes Agent A's intention, prediction becomes easier:

- Intentions are stable (commitment), so A will likely continue the current plan
- Plans have typical structures (plan library), so B knows likely next steps
- Goal achievement is observable, so B knows when A will stop

**Example**: In autonomous vehicles, recognizing that another vehicle intends to merge allows predictive coordination: slow down to create space, rather than just reacting to each merge action.

### Implementation Pattern

```
recognize_intention(other_agent, observed_actions):
  # Hypothesis: what goals could these actions serve?
  possible_goals = infer_goals_from_actions(observed_actions)
  
  # Filter: which goals is other_agent likely pursuing?
  likely_goals = filter_by_agent_model(possible_goals, other_agent)
  
  # For each goal, what plans could achieve it?
  plan_hypotheses = []
  for goal in likely_goals:
    plans = find_plans_for_goal(goal)
    matching = [p for p in plans if consistent_with_observations(p, observed_actions)]
    plan_hypotheses.extend(matching)
  
  # Most likely intention
  best_hypothesis = rank_by_likelihood(plan_hypotheses)[0]
  
  return Intention {
    goal: best_hypothesis.goal
    plan: best_hypothesis.plan
    confidence: calculate_confidence(best_hypothesis, observed_actions)
  }
```

Once Agent B has a hypothesis about A's intention, it can:

```
coordinate_with_recognized_intention(agent_b, agent_a_intention):
  # Predict A's future actions
  predicted_actions = predict_future_actions(agent_a_intention)
  
  # Check for conflicts with own plans
  conflicts = find_conflicts(agent_b.intentions, predicted_actions)
  if conflicts:
    resolve_conflicts_proactively(conflicts)
  
  # Check for opportunities to help
  opportunities = find_helpful_actions(agent_b.capabilities, agent_a_intention)
  if opportunities and worthwhile(opportunities):
    incorporate_helpful_actions(agent_b.intentions, opportunities)
```

## Coordination Patterns

Different multi-agent scenarios require different coordination patterns:

### 1. Hierarchical Coordination (Master-Worker)

One agent (master) assigns subgoals to workers:

```
master_agent:
  goal: G
  decomposition: [G1, G2, G3]
  
  assign_task(worker_1, G1)
  assign_task(worker_2, G2)
  assign_task(worker_3, G3)
  
  monitor_progress([worker_1, worker_2, worker_3])
  aggregate_results()
```

**Commitment pattern**: Workers commit to assigned subgoals. Master commits to coordination and result aggregation.

**Advantages**: Clear responsibilities, simple protocol
**Disadvantages**: Central point of failure, master bottleneck

### 2. Peer Coordination (Negotiated Division of Labor)

Agents negotiate among themselves:

```
peer_agents: [A1, A2, A3]
shared_goal: G

negotiation_round:
  for agent in peer_agents:
    propose = agent.propose_contribution(G)
  
  allocation = negotiate_allocation([A1.propose, A2.propose, A3.propose])
  
  for agent in peer_agents:
    agent.commit_to(allocation[agent])
```

**Commitment pattern**: Agents jointly negotiate then individually commit.

**Advantages**: No central point of failure, flexible
**Disadvantages**: Negotiation overhead, potential conflicts

### 3. Opportunistic Coordination (Shared Attention)

Agents work independently but monitor for opportunities to help:

```
agent:
  own_intentions: [I1, I2]
  
  # Primary work
  execute(own_intentions)
  
  # Opportunistic monitoring
  for other_agent in nearby_agents:
    recognized_intention = recognize_intention(other_agent)
    if can_help_cheaply(recognized_intention):
      incorporate_helpful_action()
```

**Commitment pattern**: Primary commitment to own goals, secondary attention to helping others.

**Advantages**: Emergent cooperation without explicit coordination
**Disadvantages**: May miss opportunities requiring explicit coordination

### 4. Team-Based Coordination (Joint Intentions)

Agents form teams with shared goals:

```
team = form_team([A1, A2, A3], shared_goal=G)

team.establish_joint_intention(G)
team.allocate_roles()
team.monitor_team_progress()

for agent in team:
  agent.execute_role()
  agent.monitor_teammates()
  agent.help_struggling_teammates()
```

**Commitment pattern**: Joint commitment to shared goal, mutual support obligations.

**Advantages**: Strong coordination, robust to individual failures
**Disadvantages**: Overhead of team formation and maintenance

## Failure Modes in Multi-Agent Commitments

### 1. Unilateral Reconsideration (Breaking Social Commitments)

**Failure**: Agent reconsiders socially-committed intention without notification/negotiation

**Symptom**: Cascading failures as dependent agents' plans break

**Prevention**:
- Explicit commitment levels (social vs. internal)
- Protocols requiring negotiation before changing social commitments
- Monitoring for dependency violations

### 2. Commitment Rigidity (Can't Adapt to Changes)

**Failure**: Agents maintain commitments despite changed circumstances because coordination overhead is too high

**Symptom**: Inefficient or failing plans continue because renegotiation is harder than suffering through

**Prevention**:
- Lightweight reconsideration protocols
- Contingency clauses in commitment agreements
- Automatic triggers for renegotiation (if X happens, we'll reconsider)

### 3. Circular Dependencies (Coordination Deadlock)

**Failure**: Agent A waits for Agent B, who waits for Agent C, who waits for Agent A

**Symptom**: No agent can proceed, system deadlocked

**Prevention**:
- Dependency analysis before forming commitments
- Timeout mechanisms (if dependency not satisfied by time T, replan)
- Hierarchical commitment structures (prevent cycles)

### 4. Communication Failures (Lost Coordination Messages)

**Failure**: Commitment announcement, dependency declaration, or reconsideration request lost in transmission

**Symptom**: Agents have inconsistent views of commitments

**Prevention**:
- Acknowledgment protocols (ensure message receipt)
- Heartbeat monitoring (detect silent failures)
- Explicit synchronization points (verify consistent understanding)

### 5. Free Riding (Benefiting Without Contributing)

**Failure**: Agent benefits from team effort without contributing their share

**Symptom**: Joint intentions fail because some agents don't follow through

**Prevention**:
- Monitor individual contributions to joint intentions
- Reputation systems (track commitment reliability)
- Enforcement mechanisms (penalties for broken commitments)

## Implications for WinDAG Multi-Agent Orchestration

### 1. Explicit Social Commitment Infrastructure

DAG orchestration needs to distinguish:
- **Internal task planning**: Agent's private reasoning about how to execute assigned tasks
- **Announced capabilities**: Agent tells orchestrator what it can do (other agents can depend on this)
- **Committed tasks**: Agent has accepted task assignment (orchestrator can plan around this)
- **Joint tasks**: Multiple agents have accepted parts of shared goal (they monitor each other)

### 2. Dependency-Aware Scheduling

When orchestrator assigns tasks to agents:

```
assign_task(agent, task, dependencies):
  # Check if agent can commit to completion time
  agent_estimate = agent.estimate_completion(task, dependencies)
  
  # Check if dependencies are reliable
  dependency_reliability = check_dependency_reliability(dependencies)
  
  # If dependencies unreliable, provide alternatives or buffers
  if not dependency_reliability > threshold:
    provide_backup_dependencies(task)
  
  # Get commitment
  commitment = agent.commit_to_task(task, dependencies)
  commitment.commitment_level = DEPENDED_UPON
  
  # Notify dependent agents
  for dependent in find_dependent_tasks(task):
    notify_dependency(dependent.agent, commitment)
```

### 3. Coordination Protocol Selection

Different DAG structures need different coordination patterns:

- **Pipeline DAGs**: Hierarchical coordination (each agent waits for predecessor)
- **Parallel DAGs**: Peer coordination (agents negotiate resource allocation)
- **Collaborative DAGs**: Team-based coordination (agents share joint intention)

Orchestrator should select coordination protocol based on DAG topology.

### 4. Failure Recovery with Coordination Awareness

When a task fails:

```
handle_task_failure(failed_task):
  # Identify dependent tasks
  dependent_tasks = find_dependent_tasks(failed_task)
  
  # Notify dependent agents
  for task in dependent_tasks:
    notify_dependency_failure(task.agent, failed_task)
  
  # Renegotiate commitments
  for task in dependent_tasks:
    new_commitment = renegotiate_commitment(task.agent, failed_task)
    update_dag(task, new_commitment)
  
  # Find alternative for failed task
  alternative = find_alternative_task(failed_task)
  if alternative:
    reassign_task(alternative)
  else:
    escalate_failure(failed_task.goal)
```

This transforms orchestration failure from "restart DAG" to "renegotiate affected commitments."

## Conclusion: Commitments as Multi-Agent Glue

Single-agent BDI uses commitments for computational efficiency: commit to avoid thrashing, reconsider strategically to adapt.

Multi-agent BDI uses commitments for coordination: commit to enable others' planning, reconsider collaboratively to maintain consistency.

The same computational structure (intentions) serves both purposes, but multi-agent scenarios impose stronger stability requirements. Social commitments require:

1. **Explicit visibility**: Others must know your commitments
2. **Dependency tracking**: You must know who depends on your commitments
3. **Negotiated reconsideration**: You cannot unilaterally abandon commitments others depend on
4. **Mutual monitoring**: Joint intentions require monitoring team progress, not just individual progress

For DAG orchestration with multiple AI agents: the orchestrator must manage not just task execution but commitment relationships between agents. This transforms orchestration from scheduling (assign tasks, monitor completion) to coordination (establish commitments, track dependencies, facilitate renegotiation).

The BDI model's power in multi-agent settings comes from making commitments **first-class computational entities** that can be reasoned about, communicated, monitored, and renegotiated. This explicit representation is what enables flexible coordination without central control—agents coordinate by reasoning about each other's commitments, not by following centralized commands.
```

### FILE: learning-the-missing-piece.md

```markdown
# Learning and Adaptation: The Missing Piece in Basic BDI

## The Limitation Acknowledged

Pollack's panel response identifies a key limitation: "One criticism of the BDI model has been that it is not well-suited to certain types of behaviour. In particular, the basic BDI model appears to be inappropriate for building systems that must learn and adapt their behaviour – and such systems are becoming increasingly important."

This is not a minor gap. Learning is how agents improve performance over time, adapt to novel situations, and accumulate expertise. A theory of intelligent agency that doesn't address learning is missing a fundamental component.

Yet the basic BDI model says almost nothing about:
- How plans get into the plan library
- How commitment strategies are tuned
- How beliefs about the world are refined
- How operators improve with experience

This is particularly striking given that Soar—the independently convergent architecture—makes learning central through chunking.

## Why Basic BDI Ignores Learning

### Historical Context

BDI emerged from practical reasoning philosophy (Bratman) and logic-based AI. The focus was on:
- Representing mental states formally
- Reasoning about commitments
- Acting effectively in dynamic environments

Learning wasn't ignored due to oversight—it was out of scope. The research questions were:
- "What mental states are necessary for practical reasoning?" (Beliefs, desires, intentions)
- "How should commitments be managed?" (Commitment strategies)
- "What logics capture these concepts?" (BDI modal logics)

These are fundamentally different from learning questions:
- "How do agents acquire new knowledge?" (Learning problem)
- "How do agents improve procedures?" (Performance improvement)
- "How do agents adapt to novel situations?" (Generalization)

### The Static Plan Library Assumption

Most BDI systems assume a pre-existing plan library:

```
PlanLibrary {
  plans: {
    Plan1(preconditions, effects, procedure),
    Plan2(preconditions, effects, procedure),
    ...
  }
  indexing: by_goal, by_precondition
}
```

Where do these plans come from? Basic BDI answer: **domain expert specifies them**. This is adequate for:
- Well-understood domains (procedures are known)
- Stable environments (procedures don't need updating)
- Design-time knowledge (everything learnable can be learned during development)

But it's inadequate for:
- Novel domains (procedures must be discovered)
- Changing environments (procedures must adapt)
- Long-running systems (knowledge should accumulate during operation)

## What Needs to Be Learned

To extend BDI with learning, we must identify **what** should be learned:

### 1. New Plans (Procedural Learning)

**The problem**: Plan library is initially incomplete. Agent encounters goals for which no applicable plans exist.

**Learning requirement**: Generate new plans from experience and add them to the library.

**Example mechanisms**:
- **Case-based reasoning**: Remember solutions to past problems, adapt to new situations
- **Compositional learning**: Combine existing plans into new compositions
- **Planning by analogy**: Adapt plans from similar goals
- **Chunking (Soar)**: Compile problem-solving episodes into new operators

### 2. Plan Refinement (Performance Improvement)

**The problem**: Plans exist but are suboptimal—they work but waste resources or have low success rates.

**Learning requirement**: Improve plans through experience with execution.

**Example mechanisms**:
- **Reinforcement learning**: Adjust plan selection based on success/failure feedback
- **Explanation-based learning**: Analyze why plans succeed/fail, generalize lessons
- **Parameter tuning**: Adjust numeric parameters in plans based on outcomes
- **Failure pattern detection**: Identify common failure modes, add preconditions or repair strategies

### 3. Precondition Learning (Applicability Refinement)

**The problem**: Plans have incorrect or incomplete preconditions—they're selected in situations where they fail, or not selected in situations where they'd succeed.

**Learning requirement**: Refine preconditions to accurately predict when plans will work.

**Example mechanisms**:
- **Supervised learning**: Learn classifier predicting plan success from situation features
- **Version space**: Maintain most general and most specific preconditions consistent with experience
- **Exception learning**: Add negative preconditions when plans fail unexpectedly
- **Coverage extension**: Generalize preconditions when plans succeed in broader contexts

### 4. World Model Learning (Belief Refinement)

**The problem**: Agent's beliefs about domain dynamics are incomplete or incorrect—it doesn't understand how actions affect the world.

**Learning requirement**: Improve world model through observation and experimentation.

**Example mechanisms**:
- **Causal learning**: Discover causal relationships between actions and effects
- **Predictive model learning**: Learn forward models predicting effects of actions
- **Dynamics learning**: Learn equations or transition functions governing environment
- **Ontology learning**: Discover new concepts and relationships

### 5. Commitment Strategy Learning (Meta-Level Learning)

**The problem**: Agent's commitment strategy (when to reconsider intentions) is suboptimal for its environment.

**Learning requirement**: Adjust commitment policy based on performance.

**Example mechanisms**:
- **Meta-level reinforcement learning**: Treat commitment decisions as actions with costs/benefits
- **Statistical analysis**: Track when reconsideration helped vs. hurt, adjust thresholds
- **Environment classification**: Learn different commitment strategies for different environment types
- **Self-modeling**: Learn how long your own planning takes, factor into commitment decisions

### 6. Coordination Strategy Learning (Social Learning)

**The problem**: Agent's multi-agent coordination strategies are ineffective.

**Learning requirement**: Improve coordination through experience with other agents.

**Example mechanisms**:
- **Opponent modeling**: Learn other agents' goals, plans, and strategies
- **Communication strategy learning**: Learn what information to share and when
- **Joint policy learning**: Learn coordinated strategies through multi-agent RL
- **Social norm learning**: Discover conventions that facilitate coordination

## Soar's Chunking: A Case Study in BDI Learning

Soar provides an elegant learning mechanism that fits naturally into the BDI framework: **chunking**.

### How Chunking Works

When Soar encounters an impasse (doesn't know how to select among operators):

1. **Create subgoal**: Resolve the impasse by reasoning
2. **Solve subgoal**: Work through problem-solving episode
3. **Compile chunk**: Create new operator that directly solves this type of impasse
4. **Cache for reuse**: Add chunk to long-term memory

**Example**:

```
Initial situation: 
  - Goal: MoveTo(location=X)
  - Operators available: Walk, Drive, TakeBus
  - Impasse: Don't know which to choose

Subgoal: Determine best transportation method
  - Reasoning: X is far, Walking too slow, Bus not running, Drive best
  - Resolution: Select Drive operator

Chunk learned:
  IF goal=MoveTo AND destination=far AND bus_not_available
  THEN prefer_operator(Drive)
```

Next time a similar situation arises, the chunk fires directly—no impasse, no subgoal, no reasoning. The agent has **compiled knowledge** from problem-solving experience.

### Why Chunking Fits BDI

Chunking naturally addresses BDI learning gaps:

1. **New operators**: Chunks are new operators added to library
2. **Preconditions**: Chunk conditions are refined preconditions
3. **Performance improvement**: Eliminates impasse reasoning overhead
4. **Goal-directed**: Chunks solve goal-directed problems (BDI-compatible)
5. **Experience-driven**: Learn from execution, not specification

### Tambe's Observation

Tambe notes: "Thus, Soar includes modules such as chunking, a form of explanation-based learning, and a truth maintenance system for maintaining state consistency, which as yet appear to be absent from BDI systems."

This is the clearest path to adding learning to BDI: adopt chunking-like mechanisms that compile problem-solving episodes into reusable plans.

## Implementing Learning in BDI Systems

### Pattern 1: Episode Caching (Simple Chunking)

When a novel problem is solved, cache the solution:

```
solve_novel_goal(goal):
  # No applicable plans exist
  if not plan_library.has_applicable_plan(goal):
    
    # Fall back to first-principles planning
    episode = plan_from_scratch(goal)
    
    if episode.success:
      # Extract reusable plan from episode
      new_plan = compile_episode_to_plan(episode, goal)
      plan_library.add(new_plan)
      
      return episode.outcome
```

**Advantage**: Simple, doesn't require sophisticated learning algorithms
**Limitation**: Doesn't generalize—only helps with identical situations

### Pattern 2: Precondition Refinement (Coverage Learning)

Track when plans succeed/fail, adjust preconditions:

```
record_plan_outcome(plan, situation, outcome):
  if outcome == SUCCESS and not plan.preconditions.match(situation):
    # Plan succeeded outside expected preconditions, generalize
    plan.preconditions = generalize(plan.preconditions, situation)
  
  elif outcome == FAILURE and plan.preconditions.match(situation):
    # Plan failed despite preconditions, specialize
    plan.preconditions = specialize(plan.preconditions, situation)
```

**Advantage**: Improves plan applicability over time
**Limitation**: Risk of overgeneralization or overspecialization

### Pattern 3: Reinforcement Learning for Plan Selection

Learn value function over plans:

```
Q_values: plan × situation → expected_value

select_plan(goal, situation):
  applicable_plans = plan_library.get_applicable(goal, situation)
  
  if exploration_mode():
    # Explore: try different plans
    selected = random_choice(applicable_plans)
  else:
    # Exploit: use best plan
    selected = argmax(plan -> Q_values[plan, situation])
  
  return selected

update_after_execution(plan, situation, outcome):
  reward = calculate_reward(outcome)
  Q_values[plan, situation] += alpha * (reward - Q_values[plan, situation])
```

**Advantage**: Learns from both success and failure, handles uncertainty
**Limitation**: Requires substantial experience, may learn slowly

### Pattern 4: Compositional Plan Learning

Build new plans by composing existing plans:

```
learn_composite_plan(goal):
  # Decompose goal into subgoals
  subgoals = decompose(goal)
  
  # Find plans for subgoals
  subplans = [find_plan(sg) for sg in subgoals]
  
  if all subplans found:
    # Compose into new plan
    composite_plan