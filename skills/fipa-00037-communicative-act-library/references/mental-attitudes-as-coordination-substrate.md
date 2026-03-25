# Mental Attitudes as the Substrate for Agent Coordination

## The Core Insight

The FIPA ACL semantics are grounded not in message syntax or protocol state machines, but in **modal operators over mental attitudes**: Belief (B), Uncertainty (U), and Intention (I). This is not merely a theoretical choice—it fundamentally changes how agent coordination works.

Traditional distributed systems coordinate through shared state, locks, transactions, or message acknowledgment. Agent systems coordinate through **mutual modeling of each other's mental states**. When agent i sends a message to agent j, i is not pushing data or invoking a remote procedure—i is attempting to shape j's beliefs and intentions.

## The Formal Primitives

The specification defines three modal operators:

**Belief (Bᵢφ)**: "Agent i believes proposition φ"
- Models: KD45 modal logic (belief is consistent, agents believe what they believe, and know what they don't believe)
- Key property: Bᵢφ ⇒ BᵢBᵢφ (introspection)
- Practical meaning: An agent's beliefs form a consistent, introspectively accessible worldview

**Uncertainty (Uᵢφ)**: "Agent i is uncertain about φ but thinks φ more likely than ¬φ"
- Strictly weaker than belief, strictly stronger than ignorance
- Mutually exclusive with belief: Bᵢφ ⇒ ¬Uᵢφ
- Practical meaning: Probabilistic or confidence-weighted knowledge states

**Intention (Iᵢφ)**: "Agent i intends to bring about φ"
- Derived from Choice (Cᵢφ, "i desires φ") + commitment until success/impossibility
- Generates planning: Iᵢφ ⇒ planning process to achieve φ
- Practical meaning: Goals that drive action selection

## Why Mental Attitudes, Not Message Types?

### Traditional Approach: Message-Type Coordination

Imagine designing agent communication with message types:

```
MESSAGE_TYPE: {QUERY, RESPONSE, COMMAND, ERROR, ...}
```

Each type triggers predefined handlers. This is how most distributed systems work. But this fails for multi-agent systems because:

1. **Semantic Ambiguity**: What does QUERY mean? "Tell me X" could be a request for information, a test of knowledge, a demand for proof, or a conversational filler. Without grounding in mental attitudes, there's no principled way to disambiguate.

2. **Context Insensitivity**: The same message means different things in different contexts. "The door is open" could inform (if you didn't know), confirm (if you were uncertain), or remind (if you forgot). Message-type systems hardcode context, which doesn't scale.

3. **Brittle Composition**: How do you compose QUERY + COMMAND to mean "ask who can do X, then tell them to do it"? Message-type systems require explicitly enumerating all compositions. The FIPA model composes naturally through mental attitude operators.

### FIPA Approach: Mental-Attitude Coordination

Every communicative act is defined in terms of what mental attitudes it requires (FP) and what mental attitudes it aims to create (RE):

```
<i, inform(j, φ)>
  FP: Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
  RE: Bⱼφ
```

This reads: "i can inform j of φ if i believes φ and i doesn't believe j already knows whether φ. The intended effect is j believes φ."

**Advantages**:

1. **Semantic Grounding**: Every act's meaning is precisely defined in terms of belief, uncertainty, and intention. No ambiguity.

2. **Context Sensitivity**: The FPs naturally encode context. i should only inform j if j doesn't already know—this isn't an extra rule, it falls out of the rationality constraints.

3. **Natural Composition**: Complex acts compose through modal operator logic. query-if is defined as request(inform-if), which expands to request(inform(φ) | inform(¬φ)), which has clear FPs and RE.

## Practical Implications for Agent System Design

### 1. Agents Must Model Each Other's Mental States

In a FIPA-compliant system, agent i cannot rationally send inform(j, φ) without modeling Bⱼφ. This has profound implications:

**Traditional orchestration**:
```python
def orchestrator_logic():
    for agent in agents:
        agent.send("QUERY", content)  # Broadcast to all
```

**Mental-attitude orchestration**:
```python
def orchestrator_logic():
    for agent in agents:
        if not self.believes_agent_knows(agent, content):
            if self.believes(content):
                agent.send(inform(content))
            elif self.uncertain(content):
                agent.send(query_if(content))
```

The orchestrator must maintain models of what each agent believes. This is not optional overhead—it's required for rational communication.

### 2. Message Redundancy is Irrational

The FP for inform includes ¬Bᵢ(Bᵢfⱼφ)—"i doesn't believe j knows φ". If i already believes j knows, sending inform violates rationality.

**Implication**: Your agent system should track what has been communicated to avoid redundant messages. If agent A already informed agent B of φ, agent C shouldn't also inform B of φ (unless C believes A's message failed).

This is formalized in the specification (section 2.1): "If an agent knows already that some state of the world holds (that the receiver knows proposition p), it cannot rationally adopt an intention to bring about that state of the world."

**Design pattern**: Maintain a shared or distributed belief tracking system:
```
BeliefTracker {
    agent_beliefs: Map<Agent, Set<Proposition>>
    
    fn should_inform(sender: Agent, receiver: Agent, φ: Proposition) -> bool {
        !self.agent_beliefs[receiver].contains(φ) &&
        !self.agent_beliefs[receiver].contains(¬φ)
    }
}
```

### 3. Confirmation vs. Information

The specification distinguishes three assertive acts based on the receiver's prior mental state:

- **inform**: Use when receiver has no knowledge of φ
  - FP: Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
  
- **confirm**: Use when receiver is uncertain about φ
  - FP: Bᵢφ ∧ BᵢUⱼφ
  
- **disconfirm**: Use when receiver believes φ but i believes ¬φ
  - FP: Bᵢ¬φ ∧ Bᵢ(Uⱼφ ∨ Bⱼφ)

**Practical difference**: Imagine an agent debugging system. Agent Worker reports status to Orchestrator:

- If Orchestrator hasn't asked, Worker should **inform**: "Task X completed"
- If Orchestrator asked "Is X done?" and seems uncertain, Worker should **confirm**: "Yes, X is done"
- If Orchestrator wrongly believes X failed, Worker should **disconfirm**: "No, X did not fail"

These aren't synonyms—they represent different rational responses to different belief states. A well-designed agent system selects the right act based on the recipient's modeled mental state.

### 4. Uncertainty as a First-Class State

Most systems model binary knowledge: known/unknown. The FIPA model adds uncertainty as a distinct state:

- **Belief (Bᵢφ)**: High confidence φ is true
- **Uncertainty (Uᵢφ)**: φ more likely than ¬φ, but not confident
- **Ignorance (¬Bᵢfᵢφ)**: No information about φ

This maps naturally to confidence scores, probabilistic reasoning, or evidence-based systems:

```python
class BeliefState:
    def __init__(self, confidence: float):
        self.confidence = confidence
    
    def is_belief(self) -> bool:
        return self.confidence > 0.9  # High confidence
    
    def is_uncertain(self) -> bool:
        return 0.6 <= self.confidence <= 0.9  # Moderate confidence
    
    def is_ignorant(self) -> bool:
        return self.confidence < 0.6  # Low or no information
```

When an agent queries another, it should use:
- **query-if** if ignorant (¬Bᵢfᵢφ)
- **request(confirm | disconfirm)** if uncertain (Uᵢφ)

### 5. Intention Drives Planning

The specification defines (Property 1, section 5.3.1):

"An agent's intention to achieve a given goal generates an intention that one of the acts known to the agent be done, such that its rational effect corresponds to the agent's goal."

Formally:
```
Iᵢφ ⇒ Iᵢ Done(a₁ | ... | aₙ)
```

Where each aᵢ has RE = φ.

**Practical meaning**: When an agent forms an intention, it automatically triggers planning for communicative acts that would achieve that intention.

**Example**: 
```
Orchestrator has: I_orchestrator(Task_X_completed)
This generates: I_orchestrator Done(<Worker, perform-task-X>)
Which leads to: <Orchestrator, request(Worker, perform-task-X)>
```

Your agent architecture should implement this as a planning loop:
1. Agent has intention Iφ
2. Agent searches for acts whose RE = φ
3. Agent checks FPs for those acts
4. Agent executes feasible act with highest expected utility

## The Deep Coordination Mechanism

The genius of the FIPA model is that **coordination emerges from mutual belief modeling without central control**.

When agent i requests agent j to perform action a:
1. i forms intention: Iᵢ Done(a)
2. i sends request, which informs j: Bⱼ(Iᵢ Done(a))
3. j models i's intention and decides whether to adopt: Iⱼ Done(a)
4. If yes, j sends agree, informing i: Bᵢ(Iⱼ Done(a))
5. Now both agents mutually believe j intends to do a: Bᵢ Bⱼ Iⱼ Done(a) ∧ Bⱼ Bᵢ Iⱼ Done(a)

This is **distributed commitment through shared mental state**, not through locks, transactions, or two-phase commit.

## When This Model Fails

The mental attitude approach assumes:

1. **Agents are rational**: They follow the FP→Act→RE pattern. An agent that violates FPs (e.g., informs without believing) breaks the model.

2. **Mental states are somewhat stable**: If agent beliefs change faster than communication latency, the model breaks down. High-frequency trading agents might face this.

3. **Computational tractability**: Maintaining mental models of other agents scales as O(n×m) where n=agents, m=propositions. Very large systems may need approximations.

## Design Recommendations

1. **Implement belief tracking**: Don't just send messages—track what each agent believes you've told them.

2. **Use acts that match belief states**: Don't inform when you should confirm. Let mental state dictate act selection.

3. **Model uncertainty explicitly**: If your agents have confidence scores, map them to belief/uncertainty/ignorance and use appropriate acts.

4. **Treat intention as the planning trigger**: When an agent needs something, it forms an intention, which triggers search for communicative acts with matching REs.

5. **Accept that mental models are approximations**: You can't perfectly know another agent's beliefs. Design for occasional mismatches (use not-understood to handle).

The mental attitude substrate is not theoretical overhead—it's the mechanism that enables agents to coordinate without a coordinator.