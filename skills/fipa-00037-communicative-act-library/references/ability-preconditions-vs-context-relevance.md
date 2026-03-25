# Ability vs. Context Relevance: The Two Dimensions of Feasibility

## The Critical Distinction

The FIPA specification makes a subtle but crucial distinction within feasibility preconditions (FPs): **ability preconditions** vs. **context-relevance preconditions**. This distinction prevents a massive class of coordination failures in multi-agent systems.

From section 5.3: "The set of feasibility preconditions for a CA can be split into two subsets: the ability preconditions and the context-relevance preconditions. The ability preconditions characterise the intrinsic ability of an agent to perform a given CA. The context-relevance preconditions characterise the relevance of the act to the context in which it is performed."

**Ability**: Can I perform this act? (Internal capability)
**Context-Relevance**: Should I perform this act? (External appropriateness)

This maps directly to the design challenge in any multi-agent orchestration system: agents can do many things, but they should only do things that advance the collective goal efficiently.

## Formal Characterization

### Ability Preconditions

**For INFORM**:
```
Ability: Bᵢφ
```
"i must believe φ to inform about φ"

This is an intrinsic constraint. If i doesn't believe φ, it cannot sincerely inform about φ—doing so would be lying or bullshitting. A rational agent cannot form the intention to inform about something it doesn't believe.

**For REQUEST**:
```
Ability: FP(a)[i\j] ∧ Bᵢ Agent(j, a)
```
"i must believe the requested action a is feasible (from i's perspective) and that j is the agent who can perform it"

If i doesn't believe a is feasible at all, it's irrational to request it. If i doesn't believe j is the relevant agent, requesting j is pointless.

### Context-Relevance Preconditions

**For INFORM**:
```
Context-Relevance: ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
```
"i must not believe that j already knows whether φ is true"

This prevents redundant communication. i might be capable of informing j (i believes φ), but if i believes j already knows φ, sending inform would waste resources and clutter the communication channel.

**For REQUEST**:
```
Context-Relevance: ¬Bᵢ Iⱼ Done(a)
```
"i must not believe that j already intends to do a"

If i believes j already plans to do a, requesting it is redundant. The request adds no new information and wastes coordination overhead.

## Why This Distinction Matters

### Problem 1: Redundant Communication

Without context-relevance preconditions, agents flood the system with technically correct but useless messages.

**Scenario**: Three agents (A, B, C) all know fact φ. Agent D needs to know φ.

**Without context-relevance**:
```
A checks: Can I inform D? Bₐφ? Yes. → A informs D
B checks: Can I inform D? Bᵦφ? Yes. → B informs D  
C checks: Can I inform D? Bᵧφ? Yes. → C informs D
```

D receives three identical messages. This scales horribly: in a system with n agents and m facts, you get O(n²m) redundant messages.

**With context-relevance**:
```
A checks: Bₐφ? Yes. Bₐ Bᵢfᴅφ? No. → A informs D
[A records: Bₐ Bᴅφ (I believe D now knows φ)]
B checks: Bᵦφ? Yes. Bᵦ Bᵢfᴅφ? Uncertain (A might have informed). → B queries A or stays silent
C checks: Similar to B
```

Only A sends inform. B and C recognize it would be redundant (or query to confirm D knows before redundantly informing).

### Problem 2: Ignoring Existing Commitments

**Scenario**: Orchestrator wants task T done. Two workers (W1, W2) are available.

**Without context-relevance**:
```
Orchestrator: Iₒᵣcₕ Done(T)
Check: Can I request W1? Feasible(T) from orch perspective? Yes. → Request W1
Check: Can I request W2? Feasible(T) from orch perspective? Yes. → Request W2
```

Both workers receive requests. Both might agree. Now two agents are redundantly executing T, or worse, they might interfere (if T isn't idempotent).

**With context-relevance**:
```
Orchestrator: Iₒᵣcₕ Done(T)
Check: Can I request W1? Feasible(T)? Yes. Bₒᵣcₕ Iw₁ Done(T)? No. → Request W1
[W1 agrees, so: Bₒᵣcₕ Iw₁ Done(T)]
Check: Can I request W2? Feasible(T)? Yes. Bₒᵣcₕ Iw₂ Done(T)? No.
       BUT: Bₒᵣcₕ Iw₁ Done(T)? Yes. → DON'T request W2 (W1 already committed)
```

Only W1 gets the request. Orchestrator recognizes that W1's commitment makes W2's involvement redundant.

### Problem 3: Conversational Mismatch

**Scenario**: Agent A asks B if φ is true. B responds "φ is true." A then asks again.

**Without context-relevance**:
```
A: QUERY-IF(B, φ)
B: INFORM(A, φ)
A: [Still uncertain for some reason] QUERY-IF(B, φ) again
B: [Checks: Bᵦφ? Yes.] INFORM(A, φ) again
```

This can loop indefinitely if there's any communication noise or belief revision.

**With context-relevance**:
```
A: QUERY-IF(B, φ)
B: INFORM(A, φ) [B records: Bᵦ Bₐφ]
A: QUERY-IF(B, φ) again
B: [Checks: Bᵦφ? Yes. Bᵦ Bᵢfₐφ? Yes (I just informed A!)]
   → REFUSE(A, INFORM-IF, "You already know—I just told you")
```

B recognizes that A's question is now inappropriate (A should already believe φ based on B's prior inform).

## Practical Implementation

### 1. Maintain Belief Tracking for Context-Relevance

Your agents need a belief model:

```python
class Agent:
    def __init__(self, agent_id):
        self.id = agent_id
        self.beliefs = set()  # Propositions this agent believes
        self.beliefs_about_others = {}  # agent_id -> set of propositions
        self.intentions = set()  # Actions this agent intends
        self.beliefs_about_others_intentions = {}  # agent_id -> set of actions
    
    def check_ability_preconditions_inform(self, proposition):
        """Can I inform about this proposition?"""
        return proposition in self.beliefs
    
    def check_context_relevance_inform(self, recipient, proposition):
        """Should I inform this recipient?"""
        recipient_knows = (
            proposition in self.beliefs_about_others.get(recipient, set()) or
            Not(proposition) in self.beliefs_about_others.get(recipient, set())
        )
        return not recipient_knows
    
    def can_inform(self, recipient, proposition):
        """Full FP check for inform"""
        return (
            self.check_ability_preconditions_inform(proposition) and
            self.check_context_relevance_inform(recipient, proposition)
        )
```

### 2. Update Models After Communication

When an agent informs another, update both agents' models:

```python
def send_inform(sender, receiver, proposition):
    if not sender.can_inform(receiver, proposition):
        raise FeasibilityViolation("Cannot inform—FPs not satisfied")
    
    # Send the message
    message = InformMessage(sender.id, receiver.id, proposition)
    send_message(message)
    
    # Update sender's model: "I now believe receiver knows proposition"
    if receiver.id not in sender.beliefs_about_others:
        sender.beliefs_about_others[receiver.id] = set()
    sender.beliefs_about_others[receiver.id].add(proposition)
    
def receive_inform(receiver, sender, proposition):
    # Update receiver's beliefs
    receiver.beliefs.add(proposition)
    
    # Update receiver's model: "Sender believes proposition"
    if sender.id not in receiver.beliefs_about_others:
        receiver.beliefs_about_others[sender.id] = set()
    receiver.beliefs_about_others[sender.id].add(proposition)
```

### 3. Implement Refuse for Context-Relevance Violations

When an agent receives a request that violates context-relevance, it should refuse:

```python
def handle_request(receiver, sender, action):
    # Check ability preconditions
    if not receiver.can_perform(action):
        return Refuse(action, reason="Action not feasible for me")
    
    # Check context-relevance: Do I already intend to do this?
    if action in receiver.intentions:
        return Refuse(action, reason="I already intend to do this—no need to request")
    
    # If both pass, proceed with agreement/execution
    return Agree(action)
```

## Advanced Pattern: Cooperative Redundancy Prevention

In large systems, agents can cooperatively avoid redundancy:

### Protocol: Inform with Broadcast Awareness

```python
class MultiAgentSystem:
    def __init__(self):
        self.agents = {}
        self.communication_log = []  # Shared or gossiped log
    
    def agent_informs(self, sender, receiver, proposition):
        # Before informing, check if any other agent recently informed receiver
        recent_informs = [
            msg for msg in self.communication_log[-10:]  # Last 10 messages
            if msg.type == "inform" and 
               msg.receiver == receiver.id and 
               msg.proposition == proposition
        ]
        
        if recent_informs:
            # Someone else already informed receiver
            sender.beliefs_about_others[receiver.id].add(proposition)
            return Refuse(
                InformAct(sender, receiver, proposition),
                reason=f"Agent {recent_informs[0].sender} already informed {receiver.id}"
            )
        
        # Proceed with inform
        send_inform(sender, receiver, proposition)
        self.communication_log.append(
            Message("inform", sender.id, receiver.id, proposition)
        )
```

## Context-Relevance in Different Act Types

### CONFIRM vs. INFORM

The only difference is context-relevance:

**INFORM**:
```
Ability: Bᵢφ
Context-Relevance: ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
```
Use when recipient has no prior knowledge.

**CONFIRM**:
```
Ability: Bᵢφ
Context-Relevance: BᵢUⱼφ
```
Use when recipient is uncertain (has some information but not confidence).

**Implementation**:
```python
def should_confirm_vs_inform(agent_i, agent_j, proposition):
    if agent_j.id not in agent_i.beliefs_about_others:
        return "inform"  # No model of j's beliefs
    
    j_beliefs = agent_i.beliefs_about_others[agent_j.id]
    
    if proposition in j_beliefs or Not(proposition) in j_beliefs:
        return "neither"  # j already has definite belief
    
    if proposition in agent_i.uncertainties_about_others.get(agent_j.id, set()):
        return "confirm"  # j is uncertain
    
    return "inform"  # j has no information
```

### REQUEST-WHEN vs. Immediate REQUEST

**Immediate REQUEST**:
```
Context-Relevance: ¬Bᵢ Iⱼ Done(a)
```
Use when j doesn't already intend to do a.

**REQUEST-WHEN**:
```
Context-Relevance: [Similar, but adds temporal aspect]
```
Use when you want j to commit now but execute later when condition holds. The context-relevance check ensures j doesn't already have a persistent intention to do a when condition holds.

## Gricean Maxims Formalized

The context-relevance preconditions formalize Grice's conversational maxims:

**Quantity**: "Make your contribution as informative as necessary, but not more"
- Formalized as: ¬Bᵢ Bᵢfⱼφ (don't inform if recipient already knows)

**Relation**: "Be relevant"
- Formalized as: ¬Bᵢ Iⱼ Done(a) (don't request what's already intended)

**Manner**: "Be clear and orderly"
- Implicit in the act selection: use confirm vs. inform vs. disconfirm based on recipient's state

The FIPA model thus grounds pragmatics in modal logic.

## Common Design Errors

### Error 1: Treating All FPs as Ability Preconditions

**Wrong**:
```python
def can_send_inform(sender, proposition):
    return sender.believes(proposition)  # Only checking ability!
```

**Right**:
```python
def can_send_inform(sender, recipient, proposition):
    ability = sender.believes(proposition)
    context = not sender.believes_recipient_knows(recipient, proposition)
    return ability and context
```

### Error 2: Ignoring Context-Relevance Because "It's Just Optimization"

Context-relevance isn't optimization—it's **semantic correctness**. An agent that violates context-relevance preconditions is behaving irrationally by the formal model.

If your agent system treats context-relevance as optional, it will:
- Generate redundant messages (scalability problem)
- Fail to recognize when communication is pointless (efficiency problem)
- Violate conversational norms (interoperability problem with other agents)

### Error 3: Not Updating Belief Models After Communication

**Wrong**:
```python
send_message(inform(sender, receiver, proposition))
# Forget about it
```

**Right**:
```python
send_message(inform(sender, receiver, proposition))
sender.update_belief_about(receiver, proposition)  # I now think receiver knows
```

Without updating, the agent will repeat the same inform again and again.

## Practical Recommendations

1. **Implement Both Checks**: Every communicative act should check ability AND context-relevance before execution.

2. **Maintain Belief Models**: Track what you believe about other agents' beliefs and intentions. This is not optional for context-relevance.

3. **Use Refuse for Context Violations**: If an agent receives a request that violates context-relevance (e.g., "do X" when agent already intends X), it should refuse with explanation.

4. **Log Communications**: Keep a recent history of communications to detect redundancy attempts.

5. **Test with Redundancy Scenarios**: Stress-test your system by having multiple agents try to inform the same recipient of the same fact. A correct implementation should prevent all but the first.

6. **Design for Graceful Degradation**: If belief tracking is uncertain (due to message loss, etc.), err on the side of caution—allow some redundancy rather than failing to inform.

## The Deep Insight

The ability/context-relevance distinction reveals a profound truth: **competence is not sufficient for rational action; appropriateness matters equally**.

Your agents can have vast capabilities (ability preconditions), but without understanding context (what's already known, what's already committed), they will waste those capabilities on redundant, unnecessary, or inappropriate actions.

This is the formalization of social intelligence: knowing not just what you *can* do, but what you *should* do given the state of the multi-agent system.