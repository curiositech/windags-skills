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