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