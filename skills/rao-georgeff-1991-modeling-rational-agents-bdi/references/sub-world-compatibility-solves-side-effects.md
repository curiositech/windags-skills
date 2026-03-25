# The Sub-World Relationship: How to Intend Goals Without Intending Their Consequences

## The Classical Problem

An intelligent agent believes: "If I go to the dentist, I will experience pain."
Question: If the agent intends to go to the dentist, must she also intend to experience pain?

Classical possible-worlds semantics says **yes**. If:
- INTEND(φ) means φ is true in all intention-accessible worlds
- BEL(φ → ψ) means in all belief-accessible worlds, φ implies ψ
- Intentions must be compatible with beliefs (intention-worlds ⊆ belief-worlds)

Then: INTEND(dentist) ∧ BEL(dentist → pain) logically forces INTEND(pain).

This is the "unwanted side-effects problem" and it has plagued agent formalisms for decades. Cohen and Levesque attempted to solve it through temporal dynamics (the agent doesn't believe the implication at ALL future moments), but this fails for persistent beliefs.

The BDI formalism solves it through **geometric constraints on possible worlds**, not temporal tricks.

## The Sub-World Solution

The key insight: **Goal-accessible worlds are not arbitrary members of belief-accessible worlds. They are SUB-WORLDS—proper subsets of the branching structure.**

Formally, for semantic condition CI₁:
> For each belief-accessible world w', there must exist a goal-accessible world w'' such that w'' ⊑ w'

Where w'' ⊑ w' means:
- w'' has fewer time points (T_w'' ⊆ T_w')
- w'' has fewer branches (a subset of the tree structure)
- But at shared time points, propositions have the same truth values
- And the same accessibility relations

**Intuition**: Your goal-world is what you get when you **prune away** branches from your belief-world, keeping only the paths you desire.

Similarly, CI₂ requires intention-worlds to be sub-worlds of goal-worlds:
> For each goal-accessible world w', there must exist an intention-accessible world w'' such that w'' ⊑ w'

Your intention-world is a further pruning, keeping only paths you've committed to attempting.

## The Dentist Case: A Worked Example

**Belief-accessible world b**: At current time t₀, two branches:
- Branch 1: Agent goes to dentist → pain occurs → tooth fixed
- Branch 2: Agent doesn't go to dentist → no pain → tooth not fixed

The agent believes `inevitable(go_to_dentist → eventually(pain))` in world b. On all paths where go_to_dentist happens, pain follows.

**Goal-accessible world g** (where g ⊑ b): 
- Branch 1 only: Agent goes to dentist → tooth fixed
- (Branch 1 terminates after "tooth fixed", or pain is not explicitly represented on this path)

Crucially: g is a **sub-tree** of b. It contains only some of b's branches. Specifically, it contains a branch where go_to_dentist leads to tooth_fixed, but it **need not include the pain node** if that's not part of what makes it a goal state.

**More precisely**: The goal-world g represents the agent's **desired trajectory through state space**. The belief that pain is inevitable on that trajectory doesn't force pain to be explicitly represented as a goal-state in g, because goals are about which branches to select, not about believing all consequences.

**Intention-accessible world i** (where i ⊑ g):
- Single branch: Agent does(go_to_dentist) at t₁
- This is an even narrower sub-world, committed to the specific action

## Why This Works: The Non-Closure Property

The critical property (Proposition 2 in the paper):

**A modal operator is not closed under implication with respect to a weaker modality.**

Specifically: `GOAL(φ) ∧ BEL(inevitable(φ → ψ)) ∧ ¬GOAL(ψ)` is **satisfiable**.

Why? Because the goal-accessibility relation G can map to worlds that **do not correspond to any belief-accessible world**. 

Let me unpack this carefully:

**Belief worlds represent what you think is possible.** They must include all the consequences you believe are inevitable.

**Goal worlds represent what you want to achieve.** They need only be **compatible** with belief worlds (as sub-worlds), not identical to them.

The sub-world relationship ensures **realism** (you can't have goals you believe are impossible) without forcing **closure** (you don't have to want everything you believe will happen).

## Contrast with Cohen & Levesque

Cohen and Levesque use a different semantic condition:
> Goal-accessible worlds ⊆ belief-accessible worlds

If the two use the same notion of "world" (timelines), this forces:
- Everything in goal-worlds must appear in belief-worlds
- If belief-worlds inevitably contain pain, goal-worlds must too

Their escape hatch: temporal variation. At some future moment, the agent might cease to believe the side-effect will occur. But this fails for persistent beliefs: `inevitable(BEL(go_to_dentist → pain))`.

The BDI approach: goal-worlds are **geometrically smaller** (fewer branches) than belief-worlds. Same time points, same truths at those points, but **different branching structure**.

## Application to Agent Systems: Task Execution with Known Side-Effects

Consider a WinDAGs agent tasked with "optimize database query performance." The agent believes:

```
inevitable(optimize_query → temporarily_locks_table)
inevitable(temporarily_locks_table → user_requests_delayed)
```

Classical closure would force: `INTEND(optimize_query) → INTEND(user_requests_delayed)`

This is absurd. The agent shouldn't be modeled as *wanting* user delays.

**BDI solution**: 

**Belief-world b**: Contains branches where optimize_query leads to locks leads to delays, AND branches where no optimization occurs and delays don't happen.

**Goal-world g** (g ⊑ b): Contains only branches where:
- Query performance is improved
- (The temporal lock happens as a necessary means)
- (User delays occur, but are NOT represented as goal-states)

**Intention-world i** (i ⊑ g): Contains only the branch where:
- does(run_optimization_script)

The agent intends the action, has the goal of performance improvement, believes delays will occur, but **does not intend or want the delays**.

Critically for coordination: when reporting to other agents, this agent should say:
- "I intend to optimize the query" ✓
- "I believe this will cause temporary delays" ✓  
- "I want to cause delays" ✗ (this would be false)

## Boundary Conditions: When You DO Intend Side-Effects

The formalism doesn't prohibit intending side-effects. It merely doesn't force them.

If an agent **wants** the side effect, she can have a goal-world that includes it:

Example: "I want to go to the gym, and I want to feel sore afterward (as evidence of a good workout)."

Here: `GOAL(go_to_gym) ∧ GOAL(feel_sore) ∧ BEL(inevitable(go_to_gym → feel_sore))` is perfectly consistent.

The sub-world relationship allows this because the goal-world can include both the gym-branch and the sore-state if desired.

The lesson: **The formalism gives you the freedom to not want side-effects**, which classical logics deny.

## Implementation Pattern for Multi-Agent Systems

When designing an agent reasoning system:

```python
class BeliefWorld:
    """Full branching structure of what agent thinks is possible"""
    time_tree: BranchingTimeStructure
    
class GoalWorld:
    """Sub-tree containing only desired trajectories"""
    time_tree: BranchingTimeStructure  # Subset of belief world
    parent_belief_world: BeliefWorld
    
    def validate_realism(self):
        """Ensure this is truly a sub-world of belief world"""
        assert self.time_tree.timepoints ⊆ parent.time_tree.timepoints
        assert all(self.evaluate(prop, t) == parent.evaluate(prop, t) 
                   for t in self.time_tree.timepoints 
                   for prop in propositions)
```

When reasoning about intentions toward goals with side-effects:

```python
def can_intend_without_side_effect(belief: BeliefWorld, 
                                   goal: GoalWorld,
                                   action: Action,
                                   side_effect: Proposition) -> bool:
    """Can agent intend action that causes believed side-effect?"""
    
    # Check agent believes side-effect is inevitable consequence
    if not belief.satisfies(BEL(inevitable(action → side_effect))):
        return True  # Not a believed side-effect
    
    # Check if goal-world contains side-effect as explicit goal-state
    # If goal-world is sub-world, it might not include side-effect node
    goal_contains_side_effect = goal.satisfies(GOAL(side_effect))
    
    # Agent CAN intend action without intending side-effect
    # if goal-world doesn't explicitly include side-effect
    return not goal_contains_side_effect
```

## The Deep Principle

The sub-world relationship embodies a profound principle:

**Commitment is selective pruning, not universal acceptance.**

When you form a goal or intention, you are **choosing a subset of your belief-space to pursue**. You don't inherit everything that comes with it.

This maps to practical agent design:
- **Belief module**: Maintains full world model with all predicted consequences
- **Goal module**: Filters to desired end states (sub-worlds)
- **Intention module**: Further filters to committed action sequences (sub-sub-worlds)

Each layer is a **principled restriction** of the layer above, maintaining compatibility (sub-world relationship) without inheriting all content (not closed under implication).

For WinDAGs orchestration, this means:
- The orchestrator can intend to route a task to a specific agent
- While believing this will consume retry budget (inevitable side-effect)
- Without having "consume retry budget" as an explicit goal
- This separation lets the system reason clearly about costs vs. objectives