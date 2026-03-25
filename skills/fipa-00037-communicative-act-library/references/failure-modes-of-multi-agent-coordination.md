# Failure Modes and Robustness Patterns in Multi-Agent Coordination

## The Explicit Failure Vocabulary

Unlike traditional distributed systems that often treat failure as exceptional (exceptions, errors, timeouts), the FIPA specification makes **failure a first-class communicative act**. This reflects a profound recognition: in multi-agent systems, failure to achieve coordination is *normal*, not exceptional.

The specification defines three primary failure-related acts:

1. **REFUSE**: "I cannot or will not do what you asked"
2. **FAILURE**: "I tried but failed"
3. **NOT-UNDERSTOOD**: "I didn't understand what you said"

Each has precise semantics and addresses a different coordination breakdown mode.

## REFUSE: Capability Boundaries and Autonomy

### Formal Definition

```
<i, refuse(j, <i, act>, φ)> ≡
  <i, disconfirm(j, Feasible(<i, act>))>;
  <i, inform(j, φ ∧ ¬Done(<i, act>) ∧ ¬Iᵢ Done(<i, act>))>
  
FP: Bᵢ ¬Feasible(<i, act>) ∧ Bᵢ(Bⱼ Feasible(<i, act>) ∨ Uⱼ Feasible(<i, act>)) ∧
    Bᵢ α ∧ ¬Bᵢ(Bᵢfⱼ α ∨ Uᵢfⱼ α)
  
RE: Bⱼ ¬Feasible(<i, act>) ∧ Bⱼ α

Where: α = φ ∧ ¬Done(<i, act>) ∧ ¬Iᵢ Done(<i, act>)
```

### Translation

**Refuse means**: 
1. i informs j that the requested action is not feasible (from i's perspective)
2. i informs j why (the reason φ)
3. i informs j that the action hasn't been done and i has no intention to do it

**When to refuse**:
- Agent lacks capability: "I don't have database access"
- Resource constraints: "I'm at full capacity"
- Policy violation: "I don't have permission for that operation"
- Semantic impossibility: "That action is logically impossible given current state"

### Practical Example

```python
class Worker:
    def handle_request(self, sender, action):
        # Check feasibility
        if not self.can_perform(action):
            reason = self.diagnose_infeasibility(action)
            return Refuse(
                sender=self,
                receiver=sender,
                action=action,
                reason=reason
            )
        
        # If feasible, proceed with agree/execute
        return self.execute(action)
    
    def diagnose_infeasibility(self, action):
        """Return structured reason for infeasibility."""
        if not self.has_capability(action):
            return Reason(
                type="missing_capability",
                details=f"I don't have skill: {action.required_skill}"
            )
        elif not self.has_resources(action):
            return Reason(
                type="resource_constraint",
                details=f"Insufficient resources: {action.resource_requirement}"
            )
        elif not self.is_permitted(action):
            return Reason(
                type="policy_violation",
                details=f"Not authorized: {action} requires {action.required_permission}"
            )
        else:
            return Reason(
                type="unknown",
                details="Action not feasible for unknown reason"
            )
```

### Why Refuse is Critical for Orchestration

In a WinDAG orchestration system, refuse enables:

1. **Graceful degradation**: Orchestrator can try alternative agents or plans
2. **Root cause analysis**: The reason φ provides actionable diagnostic information
3. **Capability discovery**: Patterns of refusals reveal actual vs. claimed capabilities
4. **Workload management**: Agents can refuse when overloaded, enabling load balancing

**Anti-pattern**: Silently accepting requests you can't fulfill

```python
# Bad: Accept but never execute
def handle_request(self, sender, action):
    return Agree(action)  # Lying—will never actually do it
```

**Correct pattern**: Honest refusal with reason

```python
# Good: Refuse if infeasible
def handle_request(self, sender, action):
    if not self.can_perform(action):
        return Refuse(action, reason="Insufficient memory")
    return Agree(action)
```

## FAILURE: Attempting vs. Succeeding

### Formal Definition

```
<i, failure(j, a, φ)> ≡
  <i, inform(j, (∃e) Single(e) ∧ Done(e) ∧ Agent(e, i) ∧ 
            Bᵢ(Done(e) ∧ Agent(e, i) ∧ (a = e)) ∧ φ ∧ 
            ¬Done(a) ∧ ¬Iᵢ Done(a))>
  
FP: Bᵢ α ∧ ¬Bᵢ(Bᵢfⱼ α ∨ Uᵢfⱼ α)
RE: Bⱼ α

Where: α = (∃e) Single(e) ∧ Done(e, Feasible(a) ∧ Iᵢ Done(a)) ∧ φ ∧ 
              ¬Done(a) ∧ ¬Iᵢ Done(a)
```

### Translation

**Failure means**:
1. i had the intention to do action a
2. i believed a was feasible
3. i attempted to do a (there exists an event e where i tried)
4. The action a was not completed
5. i no longer intends to do a
6. The reason for failure is φ

**Key distinction from refuse**: 
- Refuse: "I can't do this" (before attempting)
- Failure: "I tried but it didn't work" (after attempting)

### Practical Example

```python
class Worker:
    def execute_task(self, sender, task):
        # Already agreed—now attempting execution
        try:
            # Attempt the task
            result = self.perform(task)
            
            # Success
            return Inform(
                self, sender,
                Done(task, result=result)
            )
        
        except ResourceExhausted as e:
            # Attempted but failed due to resource issue
            return Failure(
                self, sender,
                action=task,
                reason=f"Resource exhausted: {e}"
            )
        
        except NetworkTimeout as e:
            # Attempted but failed due to external dependency
            return Failure(
                self, sender,
                action=task,
                reason=f"Network timeout communicating with external service: {e}"
            )
        
        except Exception as e:
            # Attempted but failed for unknown reason
            return Failure(
                self, sender,
                action=task,
                reason=f"Unexpected error: {e}"
            )
```

### Why Failure is Critical

Failure enables:

1. **Distinguishing attempt from success**: Orchestrator knows the agent tried (vs. refused)
2. **Retry strategies**: Different failures warrant different retry approaches
3. **Debugging**: The reason φ provides exception-like diagnostic information
4. **Partial completion tracking**: Agent may have completed substeps before failing

**Orchestration pattern**: Differentiated failure handling

```python
class Orchestrator:
    def handle_response(self, worker, response):
        if isinstance(response, Agree):
            # Worker committed—wait for completion
            self.wait_for_completion(worker)
        
        elif isinstance(response, Refuse):
            # Worker can't do it—try alternative
            reason = response.reason
            if reason.type == "missing_capability":
                # Need different worker
                alternative = self.find_capable_worker(response.action)
                self.request(alternative, response.action)
            elif reason.type == "resource_constraint":
                # Worker might become available later—retry or queue
                self.schedule_retry(worker, response.action, delay=60)
        
        elif isinstance(response, Failure):
            # Worker tried but failed—analyze failure mode
            reason = response.reason
            if "timeout" in reason.details:
                # Transient failure—immediate retry might work
                self.request(worker, response.action)  # Retry same worker
            elif "resource" in reason.details:
                # Need more resources or different worker
                self.scale_up_resources() or self.delegate_to_another()
            else:
                # Unknown failure—escalate
                self.escalate_to_human(response)
```

## NOT-UNDERSTOOD: Communication Breakdowns

### Formal Definition

```
<i, not-understood(j, a, φ)> ≡
  <i, inform(j, α)>
  
FP: Bᵢ α ∧ ¬Bᵢ(Bᵢfⱼ α ∨ Uᵢfⱼ α)
RE: Bⱼ α

Where: α = φ ∧ (∃x) Bᵢ((ιe Done(e) ∧ Agent(e, j) ∧ 
              Bⱼ(Done(e) ∧ Agent(e, j) ∧ (a = e))) = x)
```

### Translation

**Not-understood means**:
1. i observed agent j perform action a
2. i doesn't understand what a was (semantic failure)
3. The reason i doesn't understand is φ

**Common reasons for not-understood**:
- Unknown ontology: "I don't recognize that domain vocabulary"
- Unknown content language: "I can't parse that syntax"
- Unknown act type: "I don't know what 'flobberate' means"
- Protocol violation: "That message doesn't make sense in this conversation"

### Practical Example

```python
class Agent:
    def receive_message(self, message):
        try:
            # Try to parse message
            parsed = self.parse(message)
        except UnknownLanguage as e:
            # Can't parse content language
            return NotUnderstood(
                self, message.sender,
                action=message,
                reason=f"Unknown content language: {message.language}"
            )
        except UnknownOntology as e:
            # Can't interpret domain terms
            return NotUnderstood(
                self, message.sender,
                action=message,
                reason=f"Unknown ontology: {message.ontology}"
            )
        
        try:
            # Try to understand act type
            act_type = parsed.act
            if act_type not in self.known_acts:
                return NotUnderstood(
                    self, message.sender,
                    action=message,
                    reason=f"Unknown communicative act: {act_type}"
                )
        except Exception as e:
            return NotUnderstood(
                self, message.sender,
                action=message,
                reason=f"Cannot interpret message: {e}"
            )
        
        # Successfully understood—process normally
        return self.handle_message(parsed)
```

### Why Not-Understood is Critical

Not-understood enables:

1. **Protocol negotiation**: Sender learns receiver's limitations and can adapt
2. **Graceful interoperability failure**: Better than silent misinterpretation
3. **Debugging multi-vendor systems**: Reveals incompatibilities explicitly
4. **Learning**: Agents can request clarification or negotiate common languages

**Pattern**: Falling back to simpler communication

```python
class Orchestrator:
    def send_request(self, worker, action):
        # Try sending with full semantic richness
        response = self.send(
            Request(
                self, worker, action,
                language="FIPA-SL",
                ontology="domain-specific-v2"
            )
        )
        
        if isinstance(response, NotUnderstood):
            reason = response.reason
            if "Unknown ontology" in reason:
                # Fall back to simpler ontology
                response = self.send(
                    Request(
                        self, worker, action,
                        language="FIPA-SL",
                        ontology="domain-specific-v1"  # Older version
                    )
                )
            
            if isinstance(response, NotUnderstood) and "Unknown language" in reason:
                # Fall back to string-based content
                response = self.send(
                    Request(
                        self, worker, action,
                        language="string",  # Minimal semantics
                        content=str(action)
                    )
                )
        
        return response
```

## Compositional Failure Handling

### Cancel: Retracting Intentions