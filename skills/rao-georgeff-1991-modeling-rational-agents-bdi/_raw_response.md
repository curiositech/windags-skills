## BOOK IDENTITY
**Title**: Modeling Rational Agents within a BDI-Architecture
**Author**: Anand S. Rao and Michael P. George
**Core Question**: How can we formally model intelligent agents that reason and act through beliefs, desires/goals, and intentions in ways that avoid classical problems of commitment, side-effects, and logical omniscience?
**Irreplaceable Contribution**: This paper provides the first rigorous formal framework that treats intentions as **first-class mental attitudes** (not reducible to beliefs and desires), distinguishes between **agent choice and environmental outcomes** through branching-time possible worlds, and solves the "unwanted side-effects" problem through a precise mathematical relationship (the "sub-world" constraint) between belief-accessible, goal-accessible, and intention-accessible worlds.

## KEY IDEAS (3-5 sentences each)

1. **Intentions as Irreducible Mental States**: Unlike philosophical traditions that reduce intentions to beliefs and desires, this framework treats intentions (I) as equally fundamental to beliefs (B) and goals/desires (G/D). This allows modeling different commitment strategies by imposing different persistence conditions on intentions independently of beliefs and goals. The BDI architecture becomes a system of three interrelated but distinct modal operators, each with its own accessibility relation over possible worlds.

2. **Branching-Time Choice Architecture**: Each possible world is not a timeline but a **time tree**—a branching structure where branches represent the agent's optionality (choices available) while multiple possible worlds represent epistemic uncertainty. This crucial distinction separates what the agent can control (choosing which branch to take) from what the environment determines (which world she's actually in). The formalism uses "optional" (at least one path) vs "inevitable" (all paths) modalities to express this.

3. **Sub-World Compatibility Solves Side-Effects**: The elegant solution to unwanted commitment is a mathematical constraint: for each belief-accessible world, there must exist a goal-accessible world that is a **sub-world** (subset of branches) of it; similarly for goal-to-intention relationships (G ⊃super I, B ⊃super G). This means an agent can intend to go to the dentist without intending the inevitable pain, because her intention-world includes only the branch where she goes, not all the consequences her belief-world predicts.

4. **Commitment Strategies as Axioms of Change**: Rather than hardcoding commitment into the definition of intention, different rational agent types emerge from different **axioms of persistence**: blind commitment (maintain intentions until believed achieved), single-minded commitment (maintain until believed achieved OR believed impossible), and open-minded commitment (maintain until believed achieved OR no longer a goal). These aren't personality traits but formal specifications of when intention-accessible worlds are maintained or revised.

5. **Action as Intention Realization**: The critical axiom AI₄ states INTEND(does(e)) ⊃ does(e)—if you intend a primitive action, you do it (though not necessarily successfully). This creates **volitional commitment** while acknowledging environmental uncertainty: intending succeeds(e) commits you to attempting e, but the environment determines whether you succeed or fail. The formalism elegantly separates succeeded(e), failed(e), and done(e) as distinct state transitions.

## REFERENCE DOCUMENTS

### FILE: branching-time-choice-vs-epistemic-uncertainty.md
```markdown
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
```

### FILE: sub-world-compatibility-solves-side-effects.md
```markdown
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
```

### FILE: commitment-strategies-as-persistence-axioms.md
```markdown
# Commitment Strategies: From Mental States to Behavioral Types Through Axioms of Change

## The Central Innovation

Traditional agent formalisms define intention through its relationship to beliefs and goals at a **single moment in time**. The BDI architecture makes intention a first-class attitude, then asks: **How do intentions evolve over time?**

The answer: Different rational agent types emerge from different **axioms of change**—formal rules specifying when intentions are maintained or dropped.

Rao and George introduce three commitment strategies:
1. **Blind commitment**: Maintain intentions until believed achieved
2. **Single-minded commitment**: Maintain intentions until believed achieved OR believed impossible  
3. **Open-minded commitment**: Maintain intentions until believed achieved OR no longer a goal

These aren't personality descriptions. They are **precise logical axioms** that generate different patterns of persistence.

## The Three Axioms

### AI₉a: Blind Commitment

```
INTEND(inevitable(φ)) ⊃ inevitable(INTEND(inevitable(φ)) U BEL(φ))
```

**English**: "If you intend that φ inevitably occurs, then inevitably you will maintain that intention until you believe φ."

**Temporal structure**: On ALL future paths, the intention persists until the belief holds.

**Behavioral consequence**: A blindly committed agent never drops intentions except by believing they're achieved. If the agent is wrong about achievement, she's stuck forever.

**Example**: An agent intends to deliver a package. She maintains this intention even if:
- The package is destroyed (but she doesn't believe this)
- The destination no longer exists (but she doesn't believe this)
- A higher-priority goal emerges (doesn't matter—she's blind to it)

She drops the intention only when she believes "package delivered."

### AI₉b: Single-Minded Commitment

```
INTEND(inevitable(φ)) ⊃ inevitable(INTEND(inevitable(φ)) U (BEL(φ) ∨ ¬BEL(optional(φ))))
```

**English**: "If you intend that φ inevitably occurs, then inevitably you maintain that intention until you believe φ OR you stop believing φ is possible."

**Relaxation**: Adds the escape clause `¬BEL(optional(φ))`—"I no longer believe there's any path where φ occurs."

**Behavioral consequence**: The agent drops intentions when she believes them impossible, not just when achieved.

**Example**: The package-delivery agent maintains her intention until:
- She believes the package is delivered, OR
- She believes there's no possible way to deliver it (package destroyed, destination unreachable)

But she does NOT drop the intention just because a better opportunity arises. She's single-minded about her commitments.

### AI₉c: Open-Minded Commitment  

```
INTEND(inevitable(φ)) ⊃ inevitable(INTEND(inevitable(φ)) U (BEL(φ) ∨ ¬GOAL(optional(φ))))
```

**English**: "If you intend that φ inevitably occurs, then inevitably you maintain that intention until you believe φ OR φ is no longer your goal."

**Relaxation**: Adds the escape clause `¬GOAL(optional(φ))`—"I no longer have this as a goal."

**Behavioral consequence**: The agent can drop intentions when her goals change, even if achievement is still possible.

**Example**: The package-delivery agent maintains intention until:
- She believes package is delivered, OR
- She no longer wants to deliver the package (higher priority task arrived)

She's open to reconsidering her commitments based on changing objectives.

## Why This Structure Matters: Axioms of Change vs. Static Definitions

Most agent architectures define mental states statically: "An intention is a persistent goal the agent believes she can achieve." But this doesn't tell you:

- How persistent? Forever? Until failure? Until reconsideration?
- What triggers reconsideration? New information? New goals? Time passing?
- How do you formally verify an agent maintains appropriate commitment?

**The BDI insight**: Separate **formation** of intentions from **maintenance** of intentions.

Formation (not fully specified in this paper, but sketched): Through deliberation, the agent selects a goal-accessible world and commits to a specific branch (creating an intention-accessible world).

Maintenance (the focus here): **Axioms of change** specify temporal dynamics.

This separation allows you to:

1. **Mix and match**: Blind commitment to means, open-minded about ends
2. **Formally verify**: Prove an agent with axiom AI₉b will eventually drop impossible intentions  
3. **Debug**: "This agent is failing to reconsider when new information arrives" → Check which commitment axiom it's using
4. **Design**: Choose commitment strategy based on environment properties

## Theorem 1: What Basic Agents Achieve

The paper proves (Theorem 1) that for each commitment strategy, under certain conditions, the agent will eventually believe she's achieved her intentions:

**(a) Blind agent**: `INTEND(inevitable(φ)) ⊃ inevitable(BEL(φ))`

She will inevitably come to believe φ—either because she achieved it or because she's deluded.

**(b) Single-minded agent**: `INTEND(inevitable(φ)) ∧ inevitable(BEL(optional(φ)) U BEL(φ)) ⊃ inevitable(BEL(φ))`

If she maintains the belief that φ is achievable until she believes she's achieved it, she'll eventually believe she's achieved it.

**(c) Open-minded agent**: `INTEND(inevitable(φ)) ∧ inevitable(GOAL(optional(φ)) U BEL(φ)) ⊃ inevitable(BEL(φ))`

If she maintains the goal until she believes achievement, she'll eventually believe she's achieved it.

**Critical note**: These theorems are about **belief in achievement**, not actual achievement. The agent might be wrong.

## Theorem 2: Competent Agents Actually Achieve Goals

If the agent has **true beliefs** (Axiom AI₀: `BEL(φ) ⊃ φ`), then:

All three agent types actually achieve φ, not just believe they do.

**But this is nearly useless** for real systems. AI₀ requires true beliefs about the future ("omniscience"). No real agent satisfies this.

## Theorem 3: The Practical Result for Intentional Agents

Here's the theorem that matters for real systems:

**A single-minded agent who (a) only performs intentional actions and (b) preserves beliefs over those actions will eventually believe she's achieved her intentions.**

Formally (Theorem 3a):
```
INTEND(inevitable(φ)) 
∧ inevitable(∃x(INTEND(does(x)) ∧ (BEL(optional(done(x) ∧ φ)) ⊃ optional(BEL(done(x) ∧ φ)))))
⊃ inevitable(BEL(φ))
```

**Unpacking**:
- The agent intends φ
- At each step, she intends a specific action x (no random actions)
- If she believes "after doing x, φ will hold", then after doing x, she does believe φ (belief preservation)
- **Then**: She will eventually believe φ

**Why this matters**: These are conditions the agent can **control**:
- Only take intentional actions (don't perform random behaviors)
- Maintain belief coherence across actions (don't suffer amnesia)

Unlike omniscience, these are achievable properties.

## Application to WinDAGs Orchestration

Consider an orchestration task: "Route this request to the optimal agent and get a response."

### Blind Commitment Orchestrator

```python
class BlindCommitmentOrchestrator:
    def __init__(self):
        self.intention = None
    
    def update(self, belief_state):
        # Maintain intention until believed achieved
        if self.intention is None:
            self.intention = self.select_agent(belief_state)
        
        # Drop intention ONLY if we believe response received
        if belief_state.believes_response_received():
            self.intention = None
        else:
            # Keep trying the same agent, even if it's clearly failing
            self.attempt_routing(self.intention)
```

**Problem**: If the chosen agent is offline but the orchestrator doesn't believe this (false belief), it will retry forever.

**When useful**: Environments where initial information is reliable and persistence pays off. Avoiding "grass is greener" thrashing.

### Single-Minded Commitment Orchestrator

```python
class SingleMindedOrchestrator:
    def __init__(self):
        self.intention = None
    
    def update(self, belief_state):
        if self.intention is None:
            self.intention = self.select_agent(belief_state)
        
        # Drop if achieved OR believed impossible
        if belief_state.believes_response_received():
            self.intention = None
        elif not belief_state.believes_agent_reachable(self.intention):
            # Agent is offline/unreachable - this routing is impossible
            self.intention = self.select_agent(belief_state)  # Replan
        else:
            self.attempt_routing(self.intention)
```

**Improvement**: Handles failures. When the agent realizes the chosen route is impossible, it reconsiders.

**Limitation**: Won't reconsider just because a better agent becomes available. Committed to current plan unless impossible.

### Open-Minded Commitment Orchestrator

```python
class OpenMindedOrchestrator:
    def __init__(self):
        self.intention = None
    
    def update(self, belief_state, goal_state):
        if self.intention is None:
            self.intention = self.select_agent(belief_state, goal_state)
        
        # Drop if achieved OR no longer a goal OR better option found
        if belief_state.believes_response_received():
            self.intention = None
        elif not goal_state.still_desires_routing(self.intention):
            # Goals changed - maybe higher priority task arrived
            self.intention = None
        elif self.better_agent_available(belief_state, goal_state):
            # Reconsider: new information suggests better route
            self.intention = self.select_agent(belief_state, goal_state)
        else:
            self.attempt_routing(self.intention)
```

**Flexibility**: Reconsiders when environment changes (new agents available) or goals change (priorities shift).

**Risk**: Potential thrashing if constantly reconsidering. Requires good heuristics for "significantly better."

## Mixing Commitment Strategies: Means vs. Ends

The paper suggests a powerful combination: **Open-minded about ends, single-minded about means.**

For task decomposition:

```python
class MixedCommitmentOrchestrator:
    def __init__(self):
        self.goal = None  # What to achieve (end)
        self.plan = None  # How to achieve it (means)
    
    def update(self, belief_state, goal_state):
        # OPEN-MINDED about goals
        if self.goal is None or not goal_state.still_important(self.goal):
            self.goal = goal_state.select_highest_priority()
            self.plan = self.create_plan(self.goal, belief_state)
        
        # SINGLE-MINDED about plan execution
        if self.plan.is_complete(belief_state):
            self.plan = None  # Achieved
        elif not belief_state.believes_plan_feasible(self.plan):
            self.plan = self.create_plan(self.goal, belief_state)  # Replan
        else:
            # Execute next step of plan regardless of new opportunities
            self.plan.execute_next_step()
```

**Design principle**: 
- **Reconsider your objectives** when the world changes (open-minded about "what")
- **Stick to your methods** unless they fail (single-minded about "how")

This balances adaptability with stability.

## Cohen & Levesque's Approaches as Special Cases

**Fanatical commitment** (Cohen & Levesque): The agent is a **competent single-minded agent**. She maintains intentions until believed achieved or believed impossible, and her beliefs are true. This ensures actual achievement, not just believed achievement.

**Relativized commitment**: The agent is a **competent open-minded agent** (competent about both means and ends). She drops intentions when they're achieved or no longer goals, and her beliefs are accurate.

The BDI framework generalizes these by:
1. Dropping the omniscience requirement (competence)
2. Making commitment axioms explicit and modular
3. Allowing different commitment strategies for means vs. ends

## Practical Implementation Guidance

**For deterministic, well-understood domains**: Use single-minded commitment. The agent won't waste time reconsidering when execution is straightforward.

**For dynamic, multi-agent environments**: Use open-minded commitment about task allocation, single-minded about individual skill execution.

**For long-running, high-stakes tasks**: Use blind commitment with very careful intention formation. Once committed, persist despite short-term setbacks.

**For rapid prototyping/exploration**: Use open-minded commitment everywhere. Prioritize adaptability over persistence.

**Detection pattern**: If your agent system exhibits:
- **Thrashing** (constantly changing plans): Too open-minded
- **Stuck behavior** (persisting with failing plans): Too blind/single-minded
- **Missing opportunities** (not reconsidering when world changes): Too single-minded

Then adjust commitment axioms accordingly.

## The Meta-Lesson

The deepest contribution here is **not** the specific three commitment strategies. It's the **methodology**:

**Define agent types through axioms of change over mental states, not through static properties.**

This opens the door to:
- Formal verification of temporal properties
- Systematic exploration of the space of rational agents
- Debugging via "which axiom is violated?"
- Design via "which axioms should this agent satisfy?"

For WinDAGs, this suggests: Don't just specify what an orchestration agent believes, wants, and intends **right now**. Specify how these attitudes evolve under different classes of information updates.

That's the difference between a reactive system and a rationally persistent agent.
```

### FILE: intention-to-action-volitional-commitment.md
```markdown
# From Intention to Action: Volitional Commitment and the Control-Result Distinction

## Axiom AI₄: The Bridge from Mental State to Behavior

The most concrete axiom in the BDI framework is AI₄:

```
INTEND(does(e)) ⊃ does(e)
```

**English**: "If you intend to do action e, then you will do action e."

This is **volitional commitment**—the agent acts on her intentions. Without this axiom, intentions would be mere wishes, disconnected from behavior.

But the formalism contains a critical subtlety that many agent architectures miss: **intending to do is not the same as intending to succeed**.

## The Crucial Distinction: does(e) vs. succeeds(e)

The BDI formalism defines three future-oriented predicates about events:

- **does(e)**: Event e is attempted (either succeeds or fails)
- **succeeds(e)**: Event e is attempted and succeeds  
- **fails(e)**: Event e is attempted and fails

And three past-oriented predicates:
- **done(e)**: Event e was attempted (either succeeded or failed)
- **succeeded(e)**: Event e was attempted and succeeded
- **failed(e)**: Event e was attempted and failed

Critically: `does(e) ≡ succeeds(e) ∨ fails(e)` but `does(e) ≢ succeeds(e)`

The time tree has **separate arcs** for success and failure:
- Success arc: S_w(t₀, t₁) = e  
- Failure arc: F_w(t₀, t₁) = e

Both advance time. Both represent e being attempted. But they lead to different futures.

## Why This Matters: Committed Action Under Uncertainty

Consider a WinDAGs agent tasked with calling an external API. The agent forms the intention:

`INTEND(does(call_api))`

**NOT** `INTEND(succeeds(call_api))`

Why? Because the agent cannot guarantee success. The API might be down, the network might fail, the request might timeout.

**What the agent controls**: Whether to attempt the call  
**What the environment controls**: Whether the attempt succeeds

AI₄ (`INTEND(does(e)) ⊃ does(e)`) says: If you intend to attempt the call, you will attempt it.

But it does **not** say: If you intend to succeed, you will succeed. That would require omnipotence.

## The Architecture of Graceful Failure

This distinction enables rational behavior under uncertainty:

```python
class IntentionalAgent:
    def __init__(self):
        self.intention = None
    
    def form_intention(self, action):
        """Agent commits to ATTEMPTING action"""
        self.intention = ('does', action)  # Not ('succeeds', action)
    
    def act(self):
        """Volitional commitment: execute intended action"""
        if self.intention:
            action_type, action = self.intention
            result = self.attempt(action)
            
            if result == 'success':
                self.observe(('succeeded', action))
                # Continue with plan assuming success
            else:
                self.observe(('failed', action))
                # Trigger replanning or error handling
```

**Key property**: The agent's commitment is to the *attempt*, not the *outcome*. This allows:

1. **Persistent trying**: Agent can maintain INTEND(does(retry_api)) even after failed(call_api)
2. **Reality-grounded**: Agent doesn't maintain contradictory beliefs (believing she'll succeed when she observes failure)
3. **Replanning triggers**: Observing failed(e) is new information that can trigger intention revision

## Inevitable vs. Optional: Two Kinds of Intention

The BDI formalism allows intentions over both "inevitable" and "optional" formulas:

**Inevitable intentions**: `INTEND(inevitable(φ))`  
- "I intend that φ be true on ALL future paths"
- For deterministic actions under agent's full control
- Example: `INTEND(inevitable(does(set_variable)))`—the agent fully controls this

**Optional intentions**: `INTEND(optional(φ))`  
- "I intend that φ be true on AT LEAST ONE future path"  
- For actions with uncertain outcomes
- Example: `INTEND(optional(succeeds(call_api)))`—agent wants success but recognizes uncertainty

Most practical commitments should be optional for outcomes, inevitable only for actions:

```
INTEND(inevitable(does(attempt_optimization)))  # Will definitely try
INTEND(optional(succeeds(attempt_optimization)))  # Hope to succeed
```

But the commitment axioms (AI₉a-c) only specify behavior for inevitable intentions. This is a limitation of the formalism—it doesn't fully address how agents maintain optional intentions.

## Belief Preservation Over Intentional Actions: Theorem 3

The most practically useful result in the paper is Theorem 3, which requires:

**Condition**: The agent preserves beliefs over intentional actions.

Formally: 
```
INTEND(does(x)) ∧ BEL(optional(done(x) ∧ φ)) ⊃ optional(BEL(done(x) ∧ φ))
```

**English**: "If I intend to do x, and I believe that after doing x, φ will hold, then after I do x, I will believe φ."

This is **NOT** requiring true beliefs. It's requiring **belief coherence**:
- Before action: "I believe that if I do x, then φ"
- After action: "I did x, and now I believe φ"

**What can break this**:
- Amnesia (agent forgets what she believed)
- Surprise outcomes (agent observes done(x) but ¬φ, updating belief)
- Failed action detection (agent believes done(x) but actually ¬done(x))

**What maintains it**:
- Correct prediction (φ actually holds after x)  
- Consistent reasoning (no contradictory belief updates)
- Successful execution monitoring (accurate observation of outcomes)

## Application: Multi-Step Task Orchestration

Consider a WinDAGs orchestration task with three steps:

1. Route request to agent A
2. Agent A processes request  
3. Return result to user

The orchestrator forms intentions:

```python
intentions = [
    INTEND(inevitable(does(route_to_A))),
    INTEND(inevitable(does(wait_for_A_response))),
    INTEND(inevitable(does(return_to_user)))
]
```

Now suppose step 1 fails: `observe(failed(route_to_A))`

**Critical question**: Should the orchestrator still intend steps 2 and 3?

**BDI answer**: It depends on belief preservation.

If the orchestrator believes:
```
BEL(succeeded(route_to_A) → possible(agent_A_processes_request))
```

Then observing `failed(route_to_A)` should update beliefs:
```
BEL(¬succeeded(route_to_A))
```

By modus tollens, if the agent reasons correctly:
```
BEL(¬possible(agent_A_processes_request))
```

For a single-minded agent, this triggers:
```
¬BEL(optional(agent_A_processes_request))
```

Which by AI₉b (single-minded commitment) allows dropping the intention.

**The lesson**: Failure of a primitive action (route_to_A) propagates through belief updates to intention updates to behavioral changes (replanning).

## When Volitional Commitment Fails: The Unintended Action Problem

AI₄ says: `INTEND(does(e)) ⊃ does(e)`

But it does **not** say: `does(e) ⊃ INTEND(does(e))`

**The converse is not required.** An agent might perform actions she doesn't intend.

Examples:
- **Reflex actions**: Agent has a hardcoded safety interrupt that halts execution. She does(emergency_stop) without intending it.
- **Environmental forcing**: A buggy subsystem invokes a skill. The agent does(unexpected_action) without intention.
- **Concurrent processes**: In a multi-agent system, another agent performs an action attributed to this agent.

The formalism acknowledges this: not all actions are intentional.

**But** Theorem 3 requires: `inevitable(∃x(INTEND(does(x)) ∧ ...))`

"At each step, there exists some action x that the agent intends."

This is stronger than AI₄ alone. It says: **The agent always acts intentionally, even if not all actions are intended.**

For orchestration systems, this suggests:

```python
class StrictlyIntentionalOrchestrator:
    def act(self):
        """Only perform intended actions"""
        if not self.has_current_intention():
            self.deliberate()  # Form an intention before acting
        
        # AI₄: If I intend it, I do it
        intended_action = self.current_intention()
        self.execute(intended_action)
        
        # Converse: Don't do things I don't intend
        self.block_unintended_actions()
```

This is a strong architectural constraint: no reactive behaviors, no unexpected skill invocations. Everything flows through intention formation.

**Trade-off**: 
- **Benefit**: Predictable, verifiable behavior. Can prove properties about the agent's trajectory.
- **Cost**: No fast reflexes, no opportunistic actions. Might miss time-critical opportunities.

## Practical Guidance for Skill Systems

When designing a WinDAGs skill invocation system:

### 1. Separate Attempt from Success in Skill Signatures

Bad:
```python
def call_external_api(params) -> Result:
    """Returns Result on success, raises Exception on failure"""
```

Better:
```python
def call_external_api(params) -> Tuple[AttemptStatus, Optional[Result]]:
    """Returns (SUCCEEDED, result) or (FAILED, None)"""
    # Both are valid returns—both mean 'done'
```

This makes the does/succeeds/fails distinction explicit.

### 2. Model Intentions Over Attempts, Not Outcomes

Bad:
```python
orchestrator.intend("api_call_succeeds")  # Can't guarantee
```

Better:
```python
orchestrator.intend("attempt_api_call")  # Can guarantee
orchestrator.monitor_outcome()  # Separate concern
```

### 3. Design Belief Preservation Into Update Logic

```python
class BeliefUpdateEngine:
    def update_after_action(self, intended_action, outcome):
        """Maintain belief coherence per Theorem 3"""
        
        # Before action: believed(action → effect)
        predicted_effects = self.beliefs.query(
            f"what_follows({intended_action})"
        )
        
        # After action: observe outcome
        observed_effects = outcome.effects
        
        # Belief preservation: update beliefs to be consistent
        if predicted_effects == observed_effects:
            # Success: strengthen belief in model
            self.beliefs.reinforce(f"{intended_action} → {outcome}")
        else:
            # Surprise: revise model
            self.beliefs.revise(f"{intended_action} → {observed_effects}")
            
            # This may trigger intention dropping (single-minded)
            self.check_intention_conditions()
```

### 4. Implement Commitment Strategies Appropriate to Action Type

For **idempotent, retryable actions** (like reading a database):
- Single-minded commitment
- Retry until believed achieved or believed impossible

For **non-idempotent actions** (like sending an email):
- Open-minded commitment  
- Reconsider quickly after failure (don't spam)

For **irreversible actions** (like deleting data):
- Blind commitment during execution (don't interrupt)
- Open-minded during formation (reconsider before starting)

## The Boundary Case: Failed Actions That Don't Advance Time

The formalism requires: both succeeded(e) and failed(e) create new arcs in the time tree, advancing time.

But in some systems, failed actions are **undone**—the state is rolled back as if nothing happened.

Example: A database transaction that fails is rolled back, returning to the exact previous state.

**This is NOT captured by the BDI formalism as presented.** Here, failed(e) would not advance time—there'd be no arc.

**Implication**: The formalism is best suited for **situated agents in persistent environments**, where attempts have lasting effects even when unsuccessful.

For systems with perfect rollback, you'd need to extend the formalism to include "null transitions" or treat rollback failures differently from persistent failures.

## Summary: The Action Architecture

The BDI framework's treatment of action reveals a sophisticated architecture:

1. **Intentions are about attempts**, not guarantees (does, not succeeds)
2. **The environment determines outcomes**, not the agent (success vs. failure arcs)
3. **Volitional commitment** bridges mental states to behavior (AI₄)
4. **Belief preservation** allows rational persistence (Theorem 3's key condition)
5. **Not all actions need be intended**, but intentional action is the normal mode

For multi-agent orchestration systems, this suggests:
- Model capabilities as attempts (can_attempt_X), not guarantees (will_succeed_at_X)
- Separate execution layer (attempts) from outcome monitoring (success/failure detection)
- Design commitment strategies around attempt-level intentions
- Build belief update systems that maintain coherence across action outcomes

The result: agents that commit to trying, gracefully handle failure, and rationally revise intentions based on what they observe rather than what they wished would happen.
```

### FILE: avoiding-logical-omniscience-closure-problems.md
```markdown
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
```

### FILE: problem-decomposition-through-world-branching.md
```markdown
# Problem Decomposition as Branch Selection in Belief-Goal-Intention Worlds

## The Implicit Theory of Decomposition

While the BDI paper focuses on formalizing beliefs, goals, and intentions, it contains an implicit but powerful theory of how complex problems are decomposed:

**Complex problems exist as multiple branching possibilities in belief-worlds. Problem-solving is the progressive selection of branches through the belief→goal→intention hierarchy.**

This isn't explicitly stated in the paper, but it emerges from the formalism's structure. Let's make it explicit and explore its implications for agent systems.

## The Three-Stage Selection Process

### Stage 1: Belief-Accessible Worlds (Epistemic Branching)

At the belief level, the agent doesn't know:
- Which world she's actually in (multiple possible worlds)
- Which future will occur (multiple branches in each world)

This represents **full problem space**:

```
Belief-World b₁:
  t₀ → Branch A: Use Algorithm 1 → succeeds
            ↳ Branch B: Use Algorithm 1 → fails
            ↳ Branch C: Use Algorithm 2 → succeeds
            ↳ Branch D: Use Algorithm 2 → fails

Belief-World b₂:
  t₀ → Branch E: Use Algorithm 1 → fails  
            ↳ Branch F: Use Algorithm 2 → succeeds
```

The agent believes: "Either I'm in world b₁ (where Algorithm 1 might work) or world b₂ (where only Algorithm 2 works)."

**This is epistemic uncertainty about problem structure.**

### Stage 2: Goal-Accessible Worlds (Desirability Pruning)

Goal-worlds are sub-worlds of belief-worlds. The agent selects branches that lead to desired outcomes:

```
Goal-World g₁ (g₁ ⊑ b₁):
  t₀ → Branch A: Use Algorithm 1 → succeeds
            ↳ Branch C: Use Algorithm 2 → succeeds

Goal-World g₂ (g₂ ⊑ b₂):
  t₀ → Branch F: Use Algorithm 2 → succeeds
```

Notice:
- Failure branches (B, D, E) are pruned
- Only success branches remain
- But both algorithms are still possible (optionality preserved)

**This is desirability filtering over the problem space.**

The agent now represents: "I want to succeed, which means either Algorithm 1 works (if I'm in world b₁) or Algorithm 2 works (if I'm in b₂)."

### Stage 3: Intention-Accessible Worlds (Commitment Selection)

Intention-worlds are sub-worlds of goal-worlds. The agent commits to specific branches:

```
Intention-World i₁ (i₁ ⊑ g₁):
  t₀ → Branch A: Use Algorithm 1 → succeeds

Intention-World i₂ (i₂ ⊑ g₂):
  t₀ → Branch F: Use Algorithm 2 → succeeds
```

Now:
- Only one algorithm per world
- The agent has committed to attempting Algorithm 1 in world-context b₁, Algorithm 2 in world-context b₂

**This is commitment-based selection.**

The agent now represents: "I will attempt Algorithm 1 (if b₁ is actual) or Algorithm 2 (if b₂ is actual), depending on which world I'm actually in."

## Problem Decomposition Emerges from This Structure

A complex problem is one with many belief-branches. Decomposition is the process of:

1. **Identify alternatives** (multiple branches in belief-worlds)
2. **Evaluate alternatives** (prune to goal-worlds based on desirability)
3. **Commit to approach** (prune to intention-worlds based on commitment strategy)

Each stage reduces optionality:
- **Beliefs**: "Many things might happen"
- **Goals**: "I want some of those things"
- **Intentions**: "I'm committed to attempting specific things"

## Application to WinDAGs: Hierarchical Skill Decomposition

Consider a complex request: "Analyze the security vulnerabilities in this codebase."

### Belief-World Structure

```
Belief-World b:
  t₀ → Branch 1: Invoke comprehensive_security_audit skill
           ↳ → succeeds in 2 hours with deep analysis
           ↳ → fails (skill unavailable)
       
       Branch 2: Decompose into [static_analysis, dynamic_analysis, dependency_check]
           ↳ → succeeds in 1 hour with good coverage
           ↳ → static_analysis fails (syntax errors)
           
       Branch 3: Decompose into [pattern_matching, manual_review]
           ↳ → succeeds in 4 hours with manual effort
           ↳ → succeeds in 3 hours if expert available
```

The orchestrator believes all three approaches are possible, with various success/failure branches.

### Goal-World Structure

```
Goal-World g (g ⊑ b):
  t₀ → Branch 1: comprehensive_security_audit succeeds (ideal outcome)
       Branch 2: [static_analysis, dynamic_analysis, dependency_check] succeeds (acceptable outcome)
```

Pruning decisions:
- Branch 1 failure case removed (not a goal to fail)
- Branch 2 failure case removed
- Branch 3 kept only if under time pressure

The goal-world represents: "I want comprehensive audit if possible, otherwise good-enough decomposed approach."

### Intention-World Structure

```
Intention-World i (i ⊑ g):
  t₀ → Branch 2: Attempt [static_analysis, dynamic_analysis, dependency_check]
```

Commitment decision:
- Comprehensive audit might be unavailable → too risky
- Decomposed approach balances coverage and reliability
- Commit to this specific plan

The intention-world represents: "I will attempt the three-skill decomposition."

## The Formalism Reveals: Decomposition is NOT Binary

Traditional decomposition views it as a single decision: "Should I decompose or not?"

The BDI structure reveals **three distinct questions**:

**Question 1 (Belief)**: Is decomposition possible?
- Are the sub-skills available?
- Can they combine to solve the problem?
- What are the failure modes?

**Question 2 (Goal)**: Is decomposition desirable?
- Does it achieve the outcome I want?
- Are there better alternatives?
- What are the trade-offs?

**Question 3 (Intention)**: Am I committed to this decomposition?
- Have I selected this over alternatives?
- Will I persist if initial steps fail?
- What's my commitment strategy?

An agent might believe decomposition is possible (multiple branches in belief-world), decide it's desirable (include it in goal-world), but not yet commit to it (not yet in intention-world because deliberation continues).

## The Non-Primitive Event Mapping

The paper briefly mentions: "Non-primitive events map to non-adjacent time points, thus allowing us to model the partial nature of plans."

This is crucial for decomposition. A non-primitive event like "secure_codebase" maps from t₀ to t₁₀, say, without specifying all intermediate steps.

**Belief-world**: Contains multiple ways to decompose secure_codebase:
- secure_codebase = [static_analysis, fix_issues]
- secure_codebase = [penetration_test, remediation]
- secure_codebase = [comprehensive_audit, apply_patches]

**Goal-world**: Selects decompositions that achieve security (pruning those that don't)

**Intention-world**: Commits to a specific decomposition with specific primitive actions

The formalism naturally represents **hierarchical abstraction**:
- High-level: intend(secure_codebase)
- Mid-level: intend([static_analysis, fix_issues])
- Low-level: intend(run_static_analyzer), intend(parse_results), intend(generate_patches)

Each level is a different granularity of the time-tree branching structure.

## Coordination Without Central Control

Here's a profound implication: **Multiple agents can each have their own belief/goal/intention worlds for the same objective, without requiring a central controller.**

Agent A believes:
- Branch 1: I handle security_audit
- Branch 2: Agent B handles it

Agent A's intention-world:
- Branch 1 only (committed to doing it herself)

Agent B believes:
- Branch 1: I handle security_audit
- Branch 2: Agent A handles it

Agent B's intention-world:
- Branch 2 only (believes A is handling it)

**Coordination emerges** from:
1. Compatible belief-worlds (both agents believe similar branching structures)
2. Complementary intention-worlds (A commits to Branch 1, B commits to "wait for A")
3. Communication that aligns these (A announces intention, B updates beliefs)

No central controller needs to understand the full branching structure. Each agent maintains their own partial view.

For WinDAGs: This suggests a **distributed orchestration pattern** where each agent:
- Maintains beliefs about task structure (branching possibilities)
- Selects goals based on local objectives
- Commits to intentions based on coordination signals
- Updates beliefs based on observed actions of others

## Failure as Branch Discovery

When an intended action fails, the agent moves to a different branch than intended:

**Intended**: i contains Branch A (success path)

**Observed**: Actually moved to Branch B (failure path)

This is **new information** that updates belief-worlds:

**Before**: BEL(optional(Branch A succeeds))

**After**: BEL(¬succeeded(Branch A)) ∧ BEL(observed(Branch B))

This triggers:
1. Belief revision (update world model)
2. Possible goal revision (if single-minded: drop goal if now believed impossible)
3. Possible intention revision (if open-minded: reconsider if still desirable)

**Decomposition implication**: When a sub-task fails, it's not just "task failed, try alternative." It's:

1. Update belief about which world we're in
2. Prune branches now believed impossible
3. Re-evaluate remaining goal-branches
4. Re-commit to new intention-branch

For WinDAGs orchestration, this means failure handling should:

```python
def handle_subtask_failure(self, failed_task, error):
    # 1. Belief update: learn about world structure
    self.beliefs.remove_branch(f"{failed_task}_succeeds")
    self.beliefs.add_observation(f"{failed_task}_failed: {error}")
    
    # 2. Check if overall goal is still achievable
    if not self.beliefs.any_path_to_goal():
        # Single-minded commitment: drop if impossible
        self.intentions.clear()
        return IMPOSSIBLE
    
    # 3. Replan: find alternative branch in goal-world
    alternative_branches = self.goals.find_branches_to(target_state)
    
    # 4. Commit to new intention-branch
    if alternative_branches:
        self.intentions.select(best_alternative(alternative_branches))
        return REPLAN
    else:
        # Open-minded commitment: reconsider goal
        return RECONSIDER_GOAL
```

## The Temporality of Decomposition

Because the formalism uses time-trees, decomposition is **temporally situated**:

**At t₀**: Agent believes multiple decompositions are possible (many branches)

**At t₁** (after attempting first sub-task): Some branches are pruned (attempted routes revealed)

**At t₂** (after second sub-task): Further pruning

The agent's **view of the problem evolves** as she acts. Decomposition is not a one-time plan formation, but an ongoing process of branch-selection-through-action.

This fits situated agent systems where:
- The environment provides feedback
- Sub-task results inform further decomposition
- Replanning happens continuously

Traditional planning: "Decompose fully upfront, then execute."

BDI decomposition: "Commit to initial branches, observe results, prune impossible branches, select next branches."

## Practical Pattern: Progressive Commitment

```python
class ProgressiveDecompositionAgent:
    def __init__(self):
        self.belief_branches = set()  # All possible decompositions
        self.goal_branches = set()    # Desirable decompositions
        self.intention_branch = None  # Currently committed decomposition
    
    def solve(self, problem):
        # Stage 1: Epistemic - identify all possible approaches
        self.belief_branches = self.generate_all_decompositions(problem)
        
        # Stage 2: Desirability - filter to good approaches
        self.goal_branches = {
            b for b in self.belief_branches 
            if self.satisfies_constraints(b)
        }
        
        # Stage 3: Commitment - select one approach
        self.intention_branch = self.select_best(self.goal_branches)
        
        # Stage 4: Execution - act on first step
        first_task = self.intention_branch.first_step()
        result = self.execute(first_task)
        
        # Stage 5: Revision - update based on result
        if result.failed:
            # Prune this branch from beliefs
            self.belief_branches.remove(self.intention_branch)
            # Reconsider goals (might still be achievable via other branches)
            self.goal_branches = {
                b for b in self.belief_branches
                if self.satisfies_constraints(b)
            }
            # Recommit to new branch
            if self.goal_branches:
                self.intention_branch = self.select_best(self.goal_branches)
                return RETRY
            else:
                return IMPOSSIBLE
        else:
            # Continue with this branch
            return CONTINUE
```

This pattern implements the BDI structure:
- Beliefs = full option space
- Goals = filtered option space
- Intentions = committed option
- Action = branch traversal
- Update = branch pruning

## The Meta-Lesson for Orchestration

The BDI formalism reveals that **decomposition is not a function from problems to sub-problems**. It's a **multi-stage filtering process** over a branching possibility space:

1. **Generate** the branching structure (belief-worlds)
2. **Filter** based on desirability (goal-worlds)  
3. **Commit** to specific branches (intention-worlds)
4. **Execute** and observe which branch is actual (action)
5. **Revise** the structure based on observations (belief update)

For WinDAGs, this suggests:
- Don't just ask "How should I decompose this task?"
- Ask: "What are all possible decompositions?" (belief)
- Then: "Which would achieve my objectives?" (goal)
- Then: "Which will I commit to attempting?" (intention)
- Then: "What did I learn from trying?" (revision)

The architecture is **progressive commitment through branch selection**, not one-shot decomposition.
```

### FILE: when-bdi-formalism-applies-and-when-it-breaks.md
```markdown
# Boundary Conditions: When the BDI Architecture Applies and When It Fails

## The Assumptions Behind the Formalism

Every formal system rests on assumptions. The BDI architecture is elegant and powerful, but only within its domain of applicability. Understanding where it breaks down is as important as understanding where it succeeds.

### Assumption 1: Discrete Time and Events

**What the formalism assumes**: Time advances in discrete steps via event occurrences. The time tree has discrete nodes (time points) connected by arcs (events).

**When this holds**:
- Task execution in workflow systems (task 1 → task 2 → task 3)
- API calls and responses (send_request → receive_response)
- Discrete decision points (route to agent A vs. agent B)
- Message-passing systems (send_msg → receive_msg)

**When this breaks**:
- Continuous control (robot arm adjusting grip pressure continuously)
- Real-time signal processing (audio filtering, video encoding)
- Analog measurements (temperature gradually rising)
- Concurrent processes that don't have clear event boundaries

**Implication for WinDAGs**: The formalism naturally fits task orchestration (discrete skill invocations) but would struggle with continuous monitoring or real-time control systems.

If you need to model "gradually improving performance" or "continuously adjusting strategy," you'd need extensions like dense time or hybrid systems.

### Assumption 2: Single Agent in Control of Action Selection

**What the formalism assumes**: At each time point, there's a single agent whose choice determines which branch (event) occurs. The branching structure represents this agent's options.

**When this holds**:
- Single-agent planning (one orchestrator deciding task allocation)
- Turn-based multi-agent systems (agents alternate, each controls their turn)
- Hierarchical systems with clear control boundaries (orchestrator commands sub-agents)

**When this breaks**:
- True concurrent action by multiple agents (simultaneous decisions affecting shared state)
- Adversarial environments (opponent makes unpredictable choices)
- Decentralized coordination (no single agent controls branching)

**The paper acknowledges this**: "If parallel actions among multiple agents are to be allowed, the functions S_w and F_w must be extended to map to a set of event-agent pairs."

**Implication for WinDAGs**: Works well for orchestrator-centric architectures where the orchestrator controls routing and task assignment. Needs extension for peer-to-peer agent coordination where multiple agents simultaneously make decisions.

### Assumption 3: Observable Action Attempts

**What the formalism assumes**: The agent knows when she's attempted an action (done(e)) and can distinguish success (succeeded(e)) from failure (failed(e)).

**When this holds**:
- Instrumented systems with clear success/failure signals
- APIs that return status codes
- Skills that report completion/error explicitly

**When this breaks**:
- Black-box environments where attempts are hidden
- Ambiguous outcomes (partial success)
- Delayed feedback (don't know if action succeeded until much later)
- Unobservable failures (action failed silently, agent thinks it succeeded)

**Implication for WinDAGs**: Requires robust logging and monitoring. Each skill invocation should explicitly report:
- That it was attempted (done)
- Whether it succeeded or failed
- What effects it had (for belief updates)

Without this observability, the agent can't maintain accurate belief-worlds.

### Assumption 4: Separable Success and Failure Arcs

**What the formalism assumes**: Attempting an action and failing creates a different future state than attempting and succeeding. Both advance time along different branches.

**When this holds**:
- Irreversible actions (sending an email: succeeded vs. failed both consume time/resources)
- Learning systems (attempting and failing provides information, changes state)
- Resource-consuming attempts (failed database transaction still consumes connection time)

**When this breaks**:
- Perfect rollback (failed transaction returns to exact previous state, as if nothing happened)
- Pure computation (failed attempt has no side effects, no time advancement)
- Idempotent retries (failing and immediately retrying is equivalent to never attempting)

**Implication for WinDAGs**: The formalism assumes attempts have costs/effects even when they fail. This fits real distributed systems (failed API calls consume rate limits, network bandwidth). 

For pure computation with no side effects, you might model failure as "staying at the same time point" (no arc), which isn't directly supported.

### Assumption 5: Beliefs, Goals, and Intentions are Introspectable

**What the formalism assumes**: The agent has full access to her own mental states. She knows what she believes, wants, and intends.

**Axioms AI₅, AI₆, AI₇ require**:
- `INTEND(φ) ⊃ BEL(INTEND(φ))` (you know what you intend)
- `GOAL(φ) ⊃ BEL(GOAL(φ))` (you know what your goals are)
- `INTEND(φ) ⊃ GOAL(INTEND(φ))` (you want to have the intentions you have)

**When this holds**:
- Explicitly represented mental states (data structures storing beliefs/goals/intentions)
- Deliberate architectures (agent reasons about its own states)
- Single-process agents (no hidden sub-processes with unknown intentions)

**When this breaks**:
- Implicit learning systems (neural networks don't explicitly represent beliefs)
- Subconscious processes (reflexes, learned behaviors not accessible to reasoning)
- Distributed cognition (agent's "beliefs" are spread across multiple systems)

**Implication for WinDAGs**: Requires explicit representation of agent mental states. The orchestrator should maintain data structures for:
- `belief_worlds`: What do I believe is possible?
- `goal_worlds`: What do I want to achieve?
- `intention_worlds`: What am I committed to attempting?

Systems using implicit policies (like end-to-end RL) wouldn't fit this architecture.

## Where the Formalism is Underspecified

### 1. Intention Formation (Deliberation)

**What's missing**: The formalism specifies how intentions are maintained (commitment axioms) but not how they're formed.

The paper says: "Through deliberation, the agent selects a goal-accessible world and commits to a specific branch."

But **how**? What are the rules? When does deliberation occur? How long does it take?

**Implication**: You need to add a deliberation mechanism:

```python
def deliberate(self, goal_worlds):
    """Form intentions from goals - NOT specified by BDI formalism"""
    # Option 1: Expected utility
    return max(goal_worlds, key=lambda g: self.expected_utility(g))
    
    # Option 2: Bounded rationality (limited time)
    return self.satisficing_search(goal_worlds, time_limit=100ms)
    
    # Option 3: Habit-based (prefer similar to past intentions)
    return most_similar(goal_worlds, self.past_intentions)
```

The BDI formalism doesn't dictate which approach. You must choose based on domain requirements.

### 2. Belief Revision

**What's missing**: The formalism specifies sub-world relationships between beliefs/goals/intentions, but not how beliefs are updated when observations contradict them.

When the agent observes `failed(e)` but believed `inevitable(succeeds(e))`, what happens?

**Implication**: You need a belief revision strategy:

```python
def update_beliefs(self, observation):
    """Update belief-worlds when observation contradicts them"""
    # Option 1: Remove contradicted worlds
    self.belief_worlds = {
        w for w in self.belief_worlds 
        if w.consistent_with(observation)
    }
    
    # Option 2: Minimum change (keep most of old beliefs)
    self.belief_worlds = minimal_revision(
        self.belief_worlds, 
        observation
    )
    
    # Option 3: Bayesian update (probability-weighted)
    for w in self.belief_worlds:
        w.probability *= likelihood(observation | w)
    self.belief_worlds = normalize(self.belief_worlds)
```

Again, the BDI formalism doesn't specify this. It's an extension point.

### 3. Goal Revision (Reconsideration)

**What's missing**: Open-minded commitment allows dropping intentions when goals change (`¬GOAL(optional(φ))`). But what triggers goal change?

**Implication**: You need a reconsideration policy:

```python
def reconsider_goals(self):
    """Decide whether to revise goals - NOT specified by BDI"""
    # Option 1: Time-based (reconsider every N steps)
    if self.time % reconsideration_interval == 0:
        self.recompute_goals()
    
    # Option 2: Event-based (reconsider on significant observations)
    if self.observed_unexpected_event():
        self.recompute_goals()
    
    # Option 3: Meta-reasoning (reconsider if expected benefit > cost)
    if self.expected_value_of_reconsideration() > cost:
        self.recompute_goals()
```

Bratman discusses this extensively in his book, but it's not formalized in this paper.

### 4. Multiple Goal/Intention Priorities

**What's missing**: The formalism treats goals and intentions as sets. But what if they conflict or have different priorities?

Example: `GOAL(fast_response) ∧ GOAL(accurate_response)` might be in conflict (speed vs. accuracy trade-off).

**Implication**: You might need to extend to:

```python
class PrioritizedGoal:
    proposition: Formula
    priority: float
    
    def conflicts_with(self, other):
        """Check if goals are incompatible"""
        return mutual_exclusion(self.proposition, other.proposition)

def resolve_goal_conflicts(goals):
    """Resolve conflicting goals by priority - EXTENSION of BDI"""
    # Remove lower-priority goals that conflict with higher-priority ones
    sorted_goals = sorted(goals, key=lambda g: g.priority, reverse=True)
    consistent_goals = []
    for g in sorted_goals:
        if not any(g.conflicts_with(existing) for existing in consistent_goals):
            consistent_goals.append(g)
    return consistent_goals
```

## When You Should Use This Formalism

**Strong fit**:
1. **Task orchestration systems** (WinDAGs, workflow engines)
2. **Multi-agent planning** with discrete tasks
3. **Autonomous systems** making sequential decisions under uncertainty
4. **Deliberative architectures** where reasoning about commitments is important
5. **Systems requiring explainability** (can trace: believed, wanted, intended, attempted)

**Example**: A medical diagnosis agent that:
- Believes multiple conditions are possible (belief-worlds)
- Wants to identify the correct condition (goal-worlds)
- Commits to ordering specific tests (intention-worlds)
- Performs tests and updates beliefs (action + revision)
- Maintains commitment to diagnosis strategy unless impossible (commitment strategy)

**Moderate fit** (requires extensions):
1. **Continuous control** (need dense time or hybrid extensions)
2. **Multi-agent competition** (need game-theoretic extensions)
3. **Learning systems** (need to represent belief/goal evolution through learning)
4. **Soft real-time systems** (need to model time costs explicitly)

**Poor fit**:
1. **Reactive systems** with no deliberation (purely stimulus-response)
2. **End-to-end neural systems** with no explicit representations
3. **Pure optimization** with no notion of commitment (can always reconsider costlessly)
4. **Systems with holistic, implicit goals** (e.g., "maximize long-term reward" without decomposition)

## Adapting the Formalism: Extension Patterns

### Extension 1: Probabilistic Beliefs

**Original**: Belief-accessible worlds are unweighted (agent believes all are possible)

**Extension**: Add probabilities to belief-worlds

```python
class ProbabilisticBeliefWorld:
    world: TimeTree
    probability: float
    
    def update(self, observation):
        """Bayesian update"""
        self.probability *= likelihood(observation | self.world)
```

Now: `BEL(φ)` means "I assign high probability to φ" rather than "φ is true in all belief-worlds."

This fits partially observable environments better.

### Extension 2: Team Intentions

**Original**: Single agent with individual intentions

**Extension**: Shared intentions across agents

```python
class TeamIntention:
    agents: Set[Agent]
    joint_action: Action
    individual_commitments: Dict[Agent, Action]
    
    def is_maintained(self):
        """Joint intention maintained if all agents maintain individual parts"""
        return all(
            agent.intends(commitment)
            for agent, commitment in self.individual_commitments.items()
        )
```

This extends BDI to **multi-agent BDI** (Cohen & Levesque's work on teamwork).

### Extension 3: Meta-Level Reasoning

**Original**: Intention formation unspecified

**Extension**: Explicit meta-level intentions about reasoning

```python
meta_intention = INTEND(inevitable(
    does(deliberate_about(primary_goal))
))
```

The agent can intend to deliberate, intend to gather information, intend to reconsider, etc.

This fits resource-bounded agents that must allocate reasoning time.

## The Core Strength: Separation of Concerns

What makes the BDI formalism valuable even at its boundaries is **architectural separation**:

**Belief module**: "What might be true?"
**Goal module**: "What do I want?"
**Intention module**: "What am I committed to?"
**Action module**: "What am I doing?"

Even if you modify the internal workings of each module (probabilistic beliefs, utility-based goals, bounded deliberation), the **interfaces between modules** remain clean:

- Beliefs constrain goals (realism)
- Goals constrain intentions (sub-world relationship)
- Intentions drive actions (volitional commitment)
- Actions update beliefs (perception)

This architectural separation is the transferable insight, even if you don't use the exact formalism.

## Practical Guidance for WinDAGs

**Use BDI-style architecture when**:
- Tasks are discrete (skill invocations, API calls)
- Decision points are clear (routing decisions, decomposition choices)
- Commitment persistence matters (don't want to thrash)
- Explainability is important (why did orchestrator choose this plan?)

**Extend or modify when**:
- Need probabilistic reasoning (add belief probabilities)
- Need soft real-time (add time costs to deliberation)
- Need learning (add mechanisms for belief/goal evolution)

**Don't force BDI when**:
- System is purely reactive (no need for beliefs/goals/intentions)
- Decisions are stateless (no commitment persistence needed)
- Continuous control (time-tree structure doesn't fit)

The formalism is a powerful tool for a specific class of agent systems. Know when you're in that class, and know when you're not.
```

## SKILL ENRICHMENT

- **Task Decomposition Skill**: The branching-time structure provides a formal model for representing multiple decomposition strategies simultaneously. A task decomposition skill could maintain belief-accessible worlds for different possible decompositions, goal-worlds for desirable decompositions, and intention-worlds for committed strategies. When a sub-task fails, the skill can systematically prune branches and replan rather than ad-hoc backtracking. The sub-world relationship helps distinguish "what I'm trying to achieve" (goal) from "how I'll achieve it" (intention) from "what might work" (belief).

- **Agent Coordination/Routing**: The distinction between epistemic uncertainty (which agent is available?) and choice uncertainty (which agent should I select?) directly maps to routing decisions. The formalism shows how to represent "I believe agents A, B, C could handle this" (belief-worlds with branches for each) vs. "I want the best-performing agent" (goal-worlds pruning to high-quality branches) vs. "I'm committed to trying agent A first" (intention-world). The commitment strategies (blind/single-minded/open-minded) provide formal guidance on when to retry vs. when to switch agents.

- **Error Handling and Recovery**: The succeeded(e)/failed(e)/done(e) distinction provides a principled approach to failure handling. Current systems often conflate "didn't try," "tried and failed," and "tried and succeeded." The BDI formalism shows these are different state transitions requiring different handling. The belief preservation condition (Theorem 3) gives formal requirements for when an agent can rationally persist with a plan vs. when failure should trigger replanning.

- **Requirements Analysis and Architecture Design**: The sub-world compatibility relationship solves the side-effects problem that plagues requirements specifications. When capturing system goals, architects can specify "the system should achieve X" without being forced to specify "the system should want all inevitable consequences of X." This allows cleaner separation between functional requirements (goals) and expected side-effects (believed consequences). The formalism also provides a template for designing observable systems: ensure actions report done/succeeded/failed distinctly.

- **Code Review and Debugging**: The commitment strategies formalize what "appropriate persistence" means. When reviewing agent/orchestration code, reviewers can ask: "What commitment strategy does this implement?" Code that retries forever implements blind commitment (often wrong). Code that abandons on first failure might be too open-minded. The formalism provides vocabulary and formal properties to reason about whether error-handling logic is appropriate.

- **Testing and Verification**: The possible-worlds structure suggests test case design: test not just success paths, but belief/goal/intention misalignments. Test cases should verify: (1) Agent only performs intended actions (AI₄), (2) Agent drops impossible intentions (single-minded commitment), (3) Agent maintains beliefs across actions (Theorem 3 condition), (4) Agent doesn't acquire unwanted goals from believed side-effects (Proposition 2). The formalism converts fuzzy notions of "correct agent behavior" into verifiable logical properties.

- **API Design for Agent Systems**: The distinction between does(e), succeeds(e), fails(e) should be reflected in API design. Instead of functions that either return a result or throw an exception, agent-system APIs should return a structure indicating: (1) Was this attempted? (2) Did it succeed or fail? (3) What were the effects? This supports accurate belief updating and intention maintenance in calling systems.

- **System Monitoring and Observability**: The formalism reveals what agent systems need to observe: not just "what happened" but "what was intended, what was believed, what was attempted, what succeeded/failed." Monitoring systems should track intention formation (when/why), belief updates (what was learned), and commitment persistence (how long intentions maintained). This enables debugging questions like "Why did the agent persist with a failing strategy?" (commitment strategy issue) vs. "Why did the agent give up too quickly?" (commitment or belief revision issue).

- **Prompt Engineering for LLM Agents**: The BDI architecture suggests a prompt structure that separates reasoning phases: (1) "Based on available information, what approaches are possible?" (belief generation), (2) "Which approaches would achieve the goal?" (goal filtering), (3) "Which approach will you attempt?" (intention formation), (4) "Execute and report success/failure" (action + observation). This structured reasoning may