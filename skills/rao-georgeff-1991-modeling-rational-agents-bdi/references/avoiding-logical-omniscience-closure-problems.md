# How BDI Avoids Over-Commitment: The Geometric Solution to Closure Problems

## The Classical Closure Disaster

Most possible-worlds formalisms for beliefs and goals suffer from what philosophers call "logical closure" problems. Two catastrophic versions:

**Problem 1: Inevitable Facts Become Goals**

If:
- The agent believes φ is inevitable (true in all possible futures)
- Goals must be compatible with beliefs (goal-worlds ⊆ belief-worlds)

Then: The agent is forced to have φ as a goal.

Example: "I believe the sun will rise tomorrow" becomes "I have the goal that the sun rises tomorrow."

This is absurd. Agents shouldn't want things merely because they're inevitable.

**Problem 2: Side-Effects Become Intentions**

If:
- The agent intends φ
- The agent believes φ → ψ (necessarily)
- Intentions are closed under believed implications

Then: The agent is forced to intend ψ.

Example: "I intend to go to the dentist" + "Going to the dentist causes pain" becomes "I intend to experience pain."

This is also absurd. Agents shouldn't want every consequence of what they intend.

**Why Standard Approaches Fail**: If you use classical possible-worlds semantics where beliefs, goals, and intentions are just sets of possible worlds, and you require goals ⊆ beliefs and intentions ⊆ goals (for "realism"), then closure follows automatically.

Cohen and Levesque tried to escape through temporal dynamics: maybe at some future moment the agent doesn't believe the implication. But this fails for persistent beliefs: `inevitable(BEL(φ → ψ))`.

The BDI architecture solves both problems through **geometric constraints**, not temporal tricks.

## The Solution: Non-Closure Through Sub-World Structure

Rao and George prove two crucial propositions:

### Proposition 1: Beliefs Don't Force Goals

**Satisfiable formula**:
```
BEL(φ) ∧ ¬GOAL(φ)
```

**Even for persistent beliefs**:
```
inevitable(BEL(φ)) ∧ ¬GOAL(φ)
```

**Why this works**: The sub-world constraint says:
```
∀w' ∈ B_wt, ∃w'' ∈ G_wt such that w'' ⊑ w'
```

"For each belief-world, there exists a goal-world that's a sub-world of it."

But the **converse doesn't hold**: There can be goal-worlds that don't correspond to any belief-world.

**Intuition**: Goal-worlds represent **selected branches** from belief-worlds. Even if all belief-worlds inevitably contain φ, a goal-world can be a sub-tree that doesn't include the φ-node if φ isn't part of what defines that branch as desirable.

More carefully: If φ is a proposition true at certain time points, the goal-world can simply not include those time points (being a strict sub-world). If φ is about branching structure ("inevitable that..."), the goal-world can have fewer branches, making φ untrue in the goal-world even though it's true in all belief-worlds.

### Proposition 2: Goals Don't Force Closure Under Believed Implications

**Satisfiable formula**:
```
GOAL(φ) ∧ BEL(inevitable(φ → ψ)) ∧ ¬GOAL(ψ)
```

**Even for persistent beliefs**:
```
GOAL(φ) ∧ inevitable(BEL(inevitable(φ → ψ))) ∧ ¬GOAL(ψ)
```

**Why this works**: Similar reasoning. The goal-accessibility relation G can map to worlds that don't correspond to any belief-accessible world. So even if φ → ψ is inevitable in all belief-worlds, the goal-world can be structured such that ψ is not present.

**The key**: Goals are **selected sub-structures**, not required to inherit all properties of belief-worlds.

## The Worked Example: Dentist and Pain

Let's trace this carefully.

**Belief-accessible world b**:

Time point t₀:
- Proposition at_home is true
- Two branches: go_to_dentist and stay_home

Branch 1 (go_to_dentist):
- t₁: at_dentist is true
- t₂: pain is true (inevitable consequence)
- t₃: tooth_fixed is true

Branch 2 (stay_home):
- t₁: at_home is true
- t₂: ¬pain is true
- t₃: ¬tooth_fixed is true

The agent believes: `inevitable((go_to_dentist → eventually(pain)))`

This is true in world b: on all branches where go_to_dentist occurs (Branch 1), pain eventually occurs.

**Goal-accessible world g** (where g ⊑ b):

Time points: t₀, t₁, t₃ only (note: t₂ is not included)

t₀: at_home is true (same as b)
One branch only: go_to_dentist
- t₁: at_dentist is true (same as b at t₁)
- t₃: tooth_fixed is true (same as b at t₃)

**Crucially**: Time point t₂ (where pain is true in b) is **not in g's time structure**.

Is g a sub-world of b?
- T_g ⊆ T_b? Yes: {t₀, t₁, t₃} ⊆ {t₀, t₁, t₂, t₃}
- For all shared time points, same truth values? Yes: at those points, propositions match
- Fewer branches? Yes: only the go_to_dentist branch

So g ⊑ b is satisfied.

Now check the modal formulas:

In world g:
- `go_to_dentist` is true (the single branch)
- `eventually(tooth_fixed)` is true (t₃ is reachable)
- `eventually(pain)` is **false** (t₂ doesn't exist in g)

So: `GOAL(go_to_dentist) ∧ GOAL(eventually(tooth_fixed)) ∧ ¬GOAL(eventually(pain))`

All three can be simultaneously true, even though the agent believes pain is an inevitable consequence of going to the dentist.

## Why This Doesn't Violate Realism

The concern: "If the agent believes pain is inevitable, how can she rationally have a goal-world where pain doesn't occur? Isn't that unrealistic?"

The answer: **Realism requires goal-worlds to be achievable sub-branches of belief-worlds, not that they include all consequences.**

The realism constraint (CI₁) says: `B_wt ⊃super G_wt`

"For each belief-world, there's a goal-world that's a sub-world."

This ensures: The agent can't have goals she believes are impossible.

It does **not** ensure: The agent must include all believed consequences in her goal-representation.

**Analogy**: Imagine a map (belief-world) showing all roads and all houses. Your destination (goal-world) is a specific route on that map. The map shows that Route A passes by a landfill (unpleasant consequence). Your goal is "get to the destination via Route A," not "get to the destination via Route A and smell the landfill." The landfill is on the map, but not in your goal-description.

The goal is **selective**, not **comprehensive**.

## Application to Multi-Agent Planning

Consider a WinDAGs system planning a complex task:

**Belief**: "If we allocate 10 agents to this task, it will complete in 1 hour, but will consume 100 API credits."

Formally: `BEL(inevitable((allocate_10_agents → (complete_in_1hr ∧ consume_100_credits))))`

**Question**: Must the system have the goal to consume 100 API credits?

**Classical logic**: If goals are closed under believed implications, YES. If you intend to allocate 10 agents, and this inevitably consumes credits, you must intend to consume credits.

**BDI answer**: NO. The goal-world can be structured as:

Goal-world g:
- allocate_10_agents: true
- complete_in_1hr: true
- (consume_100_credits is not represented as a goal-state)

This is a sub-world of the belief-world, which contains all three.

**Practical Implication**: 

When the orchestrator reasons about whether to execute this plan, it can weigh:
- Goal satisfaction: complete_in_1hr (positive)
- Believed side-effect: consume_100_credits (negative)

If costs become too high, the orchestrator can revise its goals without contradicting its beliefs. It never formed the goal to consume credits, so dropping the completion-time goal doesn't require believing credits won't be consumed.

## The Deeper Principle: Representation Selectivity

The BDI architecture embodies a profound principle about intelligent systems:

**Mental representations are selective, not exhaustive.**

Your goal-representation doesn't need to include every fact about the world-state you're aiming for. It includes the **defining features** that make that state desirable.

Going to the dentist is defined by:
- Being at the dentist
- Getting dental work done

Pain is a consequence, not a defining feature.

Similarly, your intention-representation includes the **actions you commit to**, not all their effects.

Attempting to route a request is defined by:
- Invoking the routing skill
- Providing the destination parameter

Consuming a retry token is a consequence, not a defining feature.

**This selectivity prevents explosion**: If every goal had to include all consequences, and every intention had to include all consequences of its consequences, mental states would become unmanageably large.

The sub-world structure formalizes this: g ⊑ b means g is **informationally simpler** than b (fewer time points, fewer branches), not just consistent with it.

## The Closure Properties That DO Hold

While goals aren't closed under believed implications, they ARE closed under goal-logical implications:

**Valid**:
```
GOAL(φ) ∧ GOAL(φ → ψ) ⊃ GOAL(ψ)
```

If you have the goal φ, and you have the goal "if φ then ψ", then you have the goal ψ.

**Also valid**:
```
INTEND(φ) ∧ INTEND(φ → ψ) ⊃ INTEND(ψ)
```

**Why these are okay**: These are about closure within the same modality. If your goal-world contains φ and contains (φ → ψ), then by logical necessity it contains ψ.

The problem was cross-modal closure: beliefs forcing goals, or beliefs forcing intentions.

**Design lesson**: An agent system should support goal-internal reasoning (if I want X and X implies Y, I should want Y) without requiring belief-to-goal inheritance (if I believe X is inevitable, I must want X).

## Implementation Pattern

```python
class SelectiveRepresentationAgent:
    def __init__(self):
        self.beliefs = WorldModel()  # Full, comprehensive model
        self.goals = PartialWorldModel()  # Selective sub-model
        self.intentions = PartialWorldModel()  # Even more selective
    
    def add_goal(self, goal_state):
        """Add a goal without inheriting all believed consequences"""
        # Ensure realism: goal must be achievable
        if not self.beliefs.is_achievable(goal_state):
            raise GoalNotAchievableError()
        
        # Add ONLY the defining features
        self.goals.add_defining_features(goal_state)
        
        # Do NOT add all believed consequences
        consequences = self.beliefs.query_consequences(goal_state)
        # These are NOT automatically added to self.goals
    
    def reason_about_goal(self, goal_state):
        """Can reason about consequences without adopting them as goals"""
        if goal_state in self.goals:
            consequences = self.beliefs.query_consequences(goal_state)
            
            # Evaluate consequences for decision-making
            positive_effects = [c for c in consequences if self.values(c) > 0]
            negative_effects = [c for c in consequences if self.values(c) < 0]
            
            # Might drop the goal if negative effects outweigh benefits
            if sum(self.values(c) for c in negative_effects) > threshold:
                self.goals.remove(goal_state)
                # This is open-minded commitment: drop goals when they're no longer desired
```

The key architectural decision: **beliefs are comprehensive, goals and intentions are selective, and selection is based on defining features, not on consequences.**

## Boundary Conditions

This solution works when:

1. **Defining features are identifiable**: You can distinguish "what makes this a goal" from "what follows from pursuing this goal"
2. **Sub-world structure is meaningful**: Time points and branches can be selected/pruned in a principled way
3. **Agent has reflective access**: The agent can introspect about what her goals are (vs. what she believes)

It struggles when:

1. **Holistic goals**: "I want the world to be in exactly state S" (no room for selectivity)
2. **Consequence-defined goals**: "I want whatever reduces suffering" (defined by consequences, not features)
3. **Implicit representation**: The agent can't explicitly represent what is/isn't part of her goals

For WinDAGs orchestration, the selective approach works well:
- Goals are typically about task completion, performance metrics (defining features)
- Consequences like resource consumption, latency side-effects can be evaluated without being goals
- The system can explicitly represent goal-states vs. believed consequences

## The Meta-Lesson

The deepest contribution is showing that **structure of world-representation matters just as much as content**.

It's not just about which propositions are in your belief-set vs. goal-set. It's about:
- **How those sets are structured** (as time trees with branching)
- **What relationships hold between them** (sub-world, not subset)
- **What this structure enables** (selective commitment without violating realism)

For AI systems more broadly: the lesson is that solving classical logic problems (like closure paradoxes) often requires rethinking representational structure, not just adding more axioms.

The BDI architecture's use of branching time-trees with sub-world relationships is a **structural solution** to what initially appeared to be a **logical problem**. That's the kind of deep insight that transfers across domains.