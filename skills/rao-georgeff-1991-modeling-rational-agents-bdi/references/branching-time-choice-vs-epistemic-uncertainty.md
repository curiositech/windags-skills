# Branching Time: Separating Agent Choice from World Uncertainty

## The Core Architectural Insight

One of the most profound contributions of the BDI formalism is its treatment of **two fundamentally different types of uncertainty** that intelligent systems face. Traditional possible-worlds semantics conflates these; the BDI architecture separates them through an elegant mathematical structure.

**Epistemic Uncertainty**: The agent doesn't know which world she's in. She has multiple belief-accessible worlds, each representing a scenario she considers possible given her current information.

**Optionality Uncertainty**: Within any given world, the agent hasn't yet determined which actions to take. Multiple future branches exist, representing genuine choices not yet made.

The key architectural decision: **Each possible world is itself a time tree with a branching future** (and a single, linear past). This creates a two-dimensional structure:

- The horizontal dimension (across possible worlds) represents **epistemic uncertainty** about facts
- The vertical dimension (within each world's branches) represents **optionality** about actions

## Why This Matters for Multi-Agent Systems

Consider an AI agent in a WinDAGs orchestration system deciding whether to invoke an expensive API call or use cached data. The architectural question is: which uncertainty are we modeling?

**Epistemic uncertainty**: "I don't know whether the cache is still valid"
- This creates multiple belief-accessible worlds: one where cache is valid, one where it's stale
- In EACH of these worlds, the agent still has choices (use cache vs call API)

**Choice uncertainty**: "I haven't decided what to do yet"
- Within a single world (assume I know the cache state), I still have multiple branches
- One branch: I choose to use cache. Another: I choose to call API.
- These are genuine options available to me *in this world*

The formalism distinguishes these through modal operators:
- `optional(φ)` = "there exists at least one path (in this world) where φ"
- `inevitable(φ)` = "on all paths (in this world), φ"

An agent can **believe** optional(φ) without **intending** φ. She believes it's possible to use the cache, but she hasn't committed to doing so.

## The Decision-Tree Analogy

Rao and George provide an illuminating comparison: "each arc emanating from a chance node of a decision tree corresponds to a possible world, and each arc emanating from a decision node to the choice available within a possible world."

This maps directly to practical agent systems:

**Chance nodes → Multiple possible worlds**: When your agent doesn't know whether a database query will return 10 rows or 10,000 rows, that's epistemic uncertainty. You model it with multiple belief-accessible worlds.

**Decision nodes → Branching within a world**: When your agent must choose between parallel execution or sequential execution, that's optionality. You model it with branches in the time tree.

The WinDAGs orchestration engine faces both constantly:
- **I don't know** which skills will be available (some agents might be offline)
- **I haven't decided** which decomposition strategy to use even given full knowledge

## Implications for Task Decomposition

When a complex problem enters WinDAGs, the system faces a decomposition decision. Traditional approaches conflate two questions:

1. "What are the possible ways to decompose this?"
2. "Which decomposition will I attempt?"

The BDI architecture separates these:

**Belief level**: The agent believes optional(decomposition_A_works) ∧ optional(decomposition_B_works). Both are epistemically possible paths in her belief-accessible worlds.

**Goal level**: The agent has the goal inevitable(problem_solved). In all her goal-accessible worlds (which are sub-worlds of belief worlds), the problem gets solved somehow.

**Intention level**: The agent intends does(attempt_decomposition_A). She has committed to trying A (though she may not succeed).

The sub-world relationship is critical: her goal-world contains only the branches where the problem gets solved. Her intention-world contains only the branches where she attempts A. But her belief-world contains branches for both A and B, plus branches where both fail.

## The Failure Distinction: succeeded(e) vs failed(e) vs ¬done(e)

The formalism makes a crucial three-way distinction:

- `succeeded(e)`: Event e was attempted and succeeded (an arc labeled with S_w(t₀,t₁) = e)
- `failed(e)`: Event e was attempted and failed (an arc labeled with F_w(t₀,t₁) = e)  
- `¬done(e)`: Event e was never attempted (no arc for e)

For a WinDAGs agent routing a request:

**Case 1: succeeded(route_to_specialist)**: The routing happened and the specialist accepted. The world moves to a new time point along the success branch.

**Case 2: failed(route_to_specialist)**: The routing was attempted but the specialist rejected or was unavailable. The world moves to a new time point along the failure branch. **This is a different future than not attempting at all.**

**Case 3: ¬done(route_to_specialist)**: The routing was never attempted. We're still at the same decision point.

Why does this matter? Because **failing changes the world irrevocably**. When you attempt to route and fail, you may have:
- Consumed a rate-limited API call
- Alerted the specialist system (creating a record)
- Used computation time
- Learned something about system state

The formalism captures this by having distinct arcs for success and failure, both of which advance time. This is far superior to classical planning where "action didn't work" simply leaves you in the same state.

## Practical Encoding for Agent Systems

A WinDAGs skill invocation system might maintain:

```python
class AgentWorldState:
    belief_accessible_worlds: Set[TimeTree]  # Epistemic uncertainty
    goal_accessible_worlds: Set[TimeTree]    # Desired futures (subset)
    intention_accessible_worlds: Set[TimeTree]  # Committed futures (sub-subset)
    
class TimeTree:
    current_timepoint: TimePoint
    branches: Dict[Action, Tuple[TimePoint, SuccessProb]]  # Optionality
    success_arcs: Dict[Tuple[TimePoint, TimePoint], Event]
    failure_arcs: Dict[Tuple[TimePoint, TimePoint], Event]
```

When evaluating `BEL(optional(eventually(goal_achieved)))`:
1. For each belief-accessible world
2. Check if at least one branch path leads to goal_achieved
3. If yes for all worlds, the belief holds

When evaluating `INTEND(does(action_x))`:
1. Check that all intention-accessible worlds have action_x on the next step
2. If yes, the agent is committed to attempting action_x
3. The environment then determines which arc (success/failure) actually occurs

## When This Model Fails

This architecture assumes:

**Single-agent control**: The agent controls which branch to take. For multi-agent coordination, you need agent-labeled arcs (mentioned but not developed in the paper).

**Discrete actions**: The time tree advances by discrete event occurrences. Continuous control (like a robotic arm adjusting grip pressure) doesn't fit naturally.

**Observable action attempts**: The agent knows which primitive actions were attempted. In black-box environments, you might not observe your own failure.

**No true concurrency**: At each time point, one event occurs (though it may affect multiple state variables). True parallelism requires richer structures.

## The Deep Lesson for Orchestration

The branching-time architecture reveals a fundamental design principle: **Don't confuse uncertainty about the world with uncertainty about your own future choices.**

Many orchestration systems fail by collapsing these:
- "We don't know if the API will respond" (epistemic) becomes entangled with "We haven't decided whether to call it" (volitional)
- The result: systems that can't represent committed attempts that might fail

The BDI architecture keeps these separate, enabling agents that:
- Can commit to trying things they might fail at
- Can maintain intentions while believing success is uncertain  
- Can reason about "I will try X, and if it fails, I will try Y"

This is the architecture of resourceful agents that persist through failure.