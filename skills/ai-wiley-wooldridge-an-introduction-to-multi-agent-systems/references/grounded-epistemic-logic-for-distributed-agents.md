# Grounding Epistemic Logic in Computational Models

## The Crisis of Ungrounded Semantics

Wooldridge opens Chapter 12 with a devastating critique that most formal methods literature ignores:

> "The ontology of possible worlds and accessibility relations...is frankly mysterious to most practically minded people, and in particular has nothing to say about agent architecture."

This is the **theory-practice gap** in formal agent research: Logics for knowledge, belief, desire, and intention are mathematically elegant but **computationally vacuous**. They don't tell you:
- What data structures represent beliefs?
- What algorithms compute knowledge?
- How to verify that code implements the logic?

The quote from Seel (1989) sharpens this:

> "[T]he ontology of possible worlds and accessibility relations...is frankly mysterious to most practically minded people, and in particular has nothing to say about agent architecture."

**Consequence**: Specifications written in BDI (Belief-Desire-Intention) logic or epistemic logic can't be:
- Automatically compiled to executable code
- Systematically verified against implementations
- Debugged when agents misbehave

**Wooldridge's solution**: Ground possible-worlds semantics in **runs of distributed systems** (Fagin, Halpern, Moses, Vardi).

## Runs, Points, and Local States

The grounding approach replaces abstract "possible worlds" with concrete computational entities:

### Definitions

**Run**: A sequence of global states the system passes through during one execution.
```
r = (s₀, s₁, s₂, ..., sₙ)
```
where each sᵢ is a complete snapshot of all agents' states.

**Point**: A (run, time) pair.
```
(r, u) = "the state of the system at time u in run r"
```

**Local state of agent i**: The portion of the global state that agent i can observe.
```
lᵢ(r, u) = "what agent i observes at point (r, u)"
```

**Indistinguishability relation**: Two points are indistinguishable to agent i if i has the same local state at both:
```
(r, u) ~ᵢ (r', u') ⟺ lᵢ(r, u) = lᵢ(r', u')
```

**Knowledge (semantic rule)**:
```
(M, r, u) ⊨ Kᵢφ iff (M, r', u') ⊨ φ for all (r', u') such that (r, u) ~ᵢ (r', u')
```

**Translation**: Agent i **knows** φ at point (r, u) if φ is true in **all points indistinguishable from (r, u) to i**.

## Why This Solves the Grounding Problem

### Before (Ungrounded)

"Agent i knows φ" means: φ is true in all worlds accessible to i via relation Rᵢ.

**Problem**: What are "worlds"? What is "accessibility"? How do you compute this?

### After (Grounded)

"Agent i knows φ" means: φ is true in all (run, time) pairs where i has the same local state.

**Now concrete**:
- **Local state** = agent's data structures (message buffer, sensor readings, internal variables)
- **Indistinguishability** = two execution traces where those data structures hold identical values
- **Verification**: Run the system, log local states, check if φ holds in all indistinguishable points

## Example: Two-Process Message-Passing System

**System**:
- Two processes: P₁, P₂
- P₁ can send messages to P₂
- P₂ can send messages to P₁
- Messages may be delayed arbitrarily (but arrive eventually)

**Run r₁**:
```
Time 0: P₁ = (state: idle, buffer: []),        P₂ = (state: idle, buffer: [])
Time 1: P₁ sends "hello" to P₂
Time 2: P₁ = (state: waiting, buffer: []),     P₂ = (state: idle, buffer: [])  // message in flight
Time 3: P₂ receives "hello"
Time 4: P₁ = (state: waiting, buffer: []),     P₂ = (state: active, buffer: ["hello"])
```

**Run r₂** (identical to r₁ except message arrives at time 5 instead of 3):
```
Time 0-2: Identical to r₁
Time 3: P₁ = (state: waiting, buffer: []),     P₂ = (state: idle, buffer: [])  // message still in flight
Time 4: P₁ = (state: waiting, buffer: []),     P₂ = (state: idle, buffer: [])
Time 5: P₂ receives "hello"
```

**Question**: At time 3, does P₁ know that P₂ has received the message?

**Analysis**:
- At (r₁, 3): P₂ has received "hello"
- At (r₂, 3): P₂ has not received "hello"
- P₁'s local state at time 3 is **identical in both runs**: (state: waiting, buffer: [])
- Therefore: (r₁, 3) ~₁ (r₂, 3)
- Since "P₂ received message" is true in r₁ but false in r₂, and both are indistinguishable to P₁:
  - **(M, r₁, 3) ⊭ K₁(P₂ received message)**

**Conclusion**: P₁ does **not** know P₂ received the message at time 3, even in run r₁ where P₂ actually did receive it (earlier at time 3). Because P₁ can't distinguish r₁ from r₂, it can't know which run it's in.

## The Coordinated Attack Problem (Common Knowledge Impossibility)

**Scenario**: Two generals (agents) must coordinate simultaneous attack. They can communicate via messengers, but messengers may be captured (messages lost).

**Protocol** (naive attempt):
1. General A sends "attack at dawn"
2. General B receives it, sends ack
3. General A receives ack, sends ack-of-ack
4. ... indefinitely

**Theorem**: **Common knowledge of "attack at dawn" can never be established**, regardless of how many messages are sent.

**Proof sketch**:

Define **E^k φ** = "Everyone knows to depth k":
- E¹φ = Eφ (everyone knows φ)
- E²φ = E(Eφ) (everyone knows that everyone knows)
- E^k φ = E(E^(k-1) φ)

Common knowledge: C φ = E¹φ ∧ E²φ ∧ E³φ ∧ ... (infinite conjunction)

**After message 1** (A → B):
- If message delivered: B knows "attack at dawn"
- If message lost: B doesn't know
- A doesn't know which case occurred
- Therefore: E¹("attack at dawn") **not** established

**After message 2** (B → A, ack):
- If delivered: A knows "B knows 'attack at dawn'"
- But B doesn't know whether A received the ack
- Therefore: E²("attack at dawn") **not** established

**Induction**: After n messages, at most E^n φ is established, never E^(n+1) φ.

**Consequence**: Common knowledge (infinite nesting) requires **infinite communication with guaranteed delivery at every step**—impossible in realistic systems.

## Implications for Multi-Agent Coordination

### Don't Design Protocols Requiring Common Knowledge

Many coordination protocols implicitly assume common knowledge:

**Example (flawed protocol)**:
```
All agents commit to executing task T at time t₀.
Commitment requires: C(all agents will execute at t₀)
```

This **cannot be achieved** in asynchronous systems with unreliable communication.

**Better protocol**:
```
Each agent commits if it receives confirmation from all others.
Commitment requires: Kᵢ(all others confirmed)  // individual knowledge, not common
```

This is achievable via point-to-point acknowledgment.

### Use Weaker Epistemic Operators

**Hierarchy of knowledge** (weakest to strongest):

1. **Distributed knowledge** Dφ: An omniscient observer combining all agents' knowledge could deduce φ
   - Useful for **specification**: "The system as a whole has enough information to determine φ"
   - Not useful for **coordination**: No individual agent knows φ

2. **Individual knowledge** Kᵢφ: Agent i knows φ
   - Achievable via local computation
   - Cheap to verify (check agent's data structures)

3. **Everyone knows** Eφ: All agents know φ
   - Achievable via broadcast (in reliable networks)
   - Cost: O(n) messages for n agents

4. **Everyone knows depth k** E^k φ: All agents know (all know (all know... k times))
   - Achievable via k rounds of acknowledgment
   - Cost: O(nk) messages

5. **Common knowledge** Cφ: Infinite nesting
   - **Not achievable** in unreliable asynchronous systems
   - Should be avoided in specifications

**Design principle**: Specify coordination properties using the **weakest epistemic operator** that suffices.

## Grounding Knowledge in Observations

The indistinguishability relation ~ᵢ directly captures **information hiding** and **perception limits**.

### Perfect vs. Partial Observability

**Perfect observability**: Agent can distinguish all distinct global states.
```
|{equivalence classes under ~ᵢ}| = |{possible global states}|
```
Every global state is distinguishable.

**Partial observability**: Multiple global states look identical to the agent.
```
|{equivalence classes under ~ᵢ}| < |{possible global states}|
```

**Example**: Robot vacuum cleaner
- **Global state**: (robot position, dirt locations in all cells)
- **Local state** (partial observation): (robot position, dirt status of **current cell only**)

Two global states are indistinguishable:
- State 1: Robot at (0,0), dirt at (1,1)
- State 2: Robot at (0,0), dirt at (2,2)

Robot's local state is identical: (position: (0,0), current_cell_dirt: no).

Therefore: Robot doesn't know which of these states it's in. It **cannot** plan optimally (doesn't know where dirt is).

### Consequences for Agent Architecture

If an agent's actions depend on global state, but it only observes local state, then **different global states must map to different actions based on local state alone**.

**Formal constraint**:
```
If (r, u) ~ᵢ (r', u'), then action(i, r, u) = action(i, r', u')
```

The agent **cannot** take different actions in indistinguishable states (it doesn't know which state it's in).

**For WinDAGs orchestration**:
- If skill A's optimal action depends on skill B's internal state, but A can't observe B's state, then:
  - A must either: (1) query B for state, OR (2) make conservative assumptions
  - This is **coordination via information exchange**, not independent reasoning

## Verification: Model Checking BDI Agents

**The problem**: Given:
- An agent program (code)
- A BDI specification (logic formula φ)

Check: Does the program satisfy φ?

**Challenge**: The program operates on data structures; the spec is in modal logic. How to relate them?

### Rao & Georgeff's Approach (1993)

**Step 1**: Extract a **computational model** from code:
- Identify agent's **local state** (variables, message buffer)
- Identify **transition function** (how state changes per action)
- Identify **observation function** (what agent perceives)

**Step 2**: Generate **epistemic structure**:
- **Runs**: All possible execution traces (enumerate or sample)
- **Indistinguishability**: Partition runs by local state
- **Accessibility relations**: For belief (Bel), desire (Des), intention (Int)

**Step 3**: Model-check φ against epistemic structure:
- Use temporal logic model checker (e.g., SPIN, NuSMV)
- Verify: Do all runs satisfy φ?

**Computational complexity**: Despite adding three modalities (Bel, Des, Int), model-checking remains **polynomial time** O(|φ| × |M|).

**But critical caveat**:

> "Because, as we noted earlier, there is no clear relationship between the BDI logic and the concrete computational models used to implement agents, it is not clear how such a model could be derived."

**The grounding gap remains**: Even with grounded semantics, extracting the epistemic structure from arbitrary code is **not automated**. You must manually map:
- Which variables represent beliefs?
- Which variables represent goals/desires?
- Which variables represent intentions?

Without this mapping, verification is impossible.

## Practical Grounding Strategies

### Strategy 1: Explicit Belief State

**Design agents with explicit belief data structure**:
```python
class Agent:
    def __init__(self):
        self.beliefs = {}  # Dictionary of proposition → confidence
        self.desires = []  # List of goals
        self.intentions = []  # List of committed plans
```

Now verification is tractable:
- `(Bel i φ)` maps to `self.beliefs[φ] > threshold`
- `(Des i φ)` maps to `φ in self.desires`
- `(Int i φ)` maps to `φ in self.intentions`

**Advantage**: Clear correspondence between logic and code.

**Disadvantage**: Forces agents to use specific data structures; limits implementation flexibility.

### Strategy 2: Annotated Code

**Annotate code with logic assertions**:
```python
def check_budget():
    # @requires: Bel(self, budget_available > 1000)
    # @ensures: Bel(self, budget_validated)
    ...
```

Verification tool extracts annotations, checks consistency.

**Advantage**: Doesn't constrain implementation.

**Disadvantage**: Annotations may become stale (code changes, annotations don't).

### Strategy 3: Shadow Execution

**Run agent alongside a "shadow" epistemic model**:
- Agent executes normally
- Shadow model maintains explicit belief/desire/intention states
- After each action, shadow model checks: "Is the agent's behavior consistent with its stated beliefs?"

**Advantage**: Detects inconsistencies at runtime.

**Disadvantage**: Overhead; requires duplicate modeling.

## The Logical Omniscience Problem (Still Unsolved)

Possible-worlds semantics imply **logical omniscience**:
```
If Kᵢφ and (φ ⊨ ψ), then Kᵢψ
```

"If agent knows φ, and ψ is a logical consequence of φ, then agent knows ψ."

**Problem**: Real agents don't automatically know all consequences of their beliefs.

**Example**:
- Agent believes: "The number is prime"
- Logical consequence: "The number has exactly two divisors"
- But agent may never compute this unless explicitly queried

Wooldridge acknowledges:

> "Possible-worlds semantics imply that agents are logically perfect reasoners...No real agent, artificial or otherwise, has these properties."

**Workarounds**:

1. **Explicit derivation**: Don't assume agents know consequences; require explicit reasoning steps
   ```
   Kᵢφ ∧ Kᵢ(φ → ψ) ⟹ (after reasoning) Kᵢψ
   ```

2. **Resource-bounded logics**: Extend semantics to track computation cost
   ```
   Kᵢ^c φ = "Agent knows φ with computation cost ≤ c"
   ```

3. **Awareness models**: Agent knows φ only if explicitly aware of it
   ```
   Kᵢφ ⟺ Awareᵢ(φ) ∧ φ true in all accessible worlds
   ```

None are fully satisfactory; logical omniscience remains an open problem.

## Transfer to Multi-Agent Orchestration

### WinDAGs with 180+ Skills: Grounding Knowledge

**Challenge**: How do you verify that orchestration correctly coordinates 180 skills?

**Grounding approach**:

1. **Define local state per skill**:
   - **Input buffer**: Messages/data received from upstream skills
   - **Output buffer**: Results produced
   - **Internal state**: Variables, cached computations
   - **Observation**: What skill "sees" (input data + environment queries)

2. **Define indistinguishability**:
   - Two execution traces (runs) are indistinguishable to skill S if S's local state is identical in both

3. **Specify coordination properties epistemically**:
   ```
   Safety: □(Kₛ(precondition_met) → eventually(Kₛ(postcondition_met)))
   ```
   "If skill S knows its precondition is met, it will eventually know its postcondition is met."

4. **Verify via trace analysis**:
   - Log: (skill ID, timestamp, local state, action taken)
   - Group traces by local state (find indistinguishable points)
   - Check: Does the property hold in all traces?

**Example property**:

"Skill_B should only execute if Skill_A has completed successfully."

**Grounded translation**:
```
∀r, u. (execute(Skill_B) at (r, u)) ⟹ 
       (∃u' < u. (Skill_A_completed at (r, u') ∧ 
                  (r, u) ~_B (r', u') ⟹ Skill_A_completed at (r', u')))
```

"In all runs, if Skill_B executes at time u, then Skill_A must have completed at some earlier time u', **and** in all runs indistinguishable to Skill_B, Skill_A also completed."

This ensures Skill_B **knows** (not just that it happens to be true) that Skill_A completed.

### Failure Mode: Ungrounded Coordination Assumptions

**Anti-pattern**:
```
Orchestrator assumes: "Skill_A has completed"
But Skill_A's completion message was lost
Orchestrator proceeds to Skill_B
Skill_B fails because Skill_A's output is missing
```

**Root cause**: Orchestrator's belief ("Skill_A completed") is not grounded in observation (no message received).

**Grounded solution**:
```python
def orchestrate():
    send_execute(Skill_A)
    
    # Block until EXPLICIT confirmation (grounded observation)
    while not received_completion(Skill_A):
        wait()
    
    # Now orchestrator KNOWS Skill_A completed (grounded in message receipt)
    send_execute(Skill_B)
```

This maps the informal "orchestrator should know A completed" to a **concrete computational condition** (message receipt).

## Philosophical Insight: External vs. Internal Knowledge

Halpern (1987):

> "Knowledge is an external notion. We do not imagine a processor scratching its head wondering whether or not it knows a fact φ. Rather, a programmer reasoning about a particular protocol would say, from the outside, that the processor knew φ because in all global states [indistinguishable] from its current state, φ is true."

**Key distinction**:
- **Internal perspective**: Agent queries its belief data structure
- **External perspective**: Observer computes what agent must believe given its observations

**For verification**: We use the **external perspective** (what the agent must believe, given its local state), not the internal perspective (what the agent claims to believe).

This sidesteps the problem of agents lying or being internally inconsistent—verification is based on **observational equivalence**, not self-report.

## Practical Takeaway: Design Checklist

When designing epistemic properties for multi-agent coordination:

1. **Ground modal operators in concrete observations**:
   - `Kᵢφ` → "Agent i's sensor X reports φ" or "Agent i received message asserting φ"
   - `Belᵢφ` → "Agent i's world model contains φ with confidence > C"

2. **Avoid requiring common knowledge**:
   - Replace `C(φ)` with `E(φ)` (everyone knows) or `D(φ)` (distributed knowledge)

3. **Verify using grounded semantics**:
   - Log local states during execution
   - Partition execution traces by indistinguishability
   - Check epistemic formulas against partitioned traces

4. **Expect logical omniscience failures**:
   - Don't assume agents automatically know consequences of beliefs
   - Make critical inferences explicit (add derivation steps)

5. **Use weakest epistemic operator that suffices**:
   - Coordination requiring only `Kᵢφ` (individual knowledge) is cheaper than `Eφ` (everyone knows)