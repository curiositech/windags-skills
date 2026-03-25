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