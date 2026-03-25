# Norm Instantiation Through Belief Grounding

## The Problem of Abstract Norms

Norms in the environment are often stated abstractly, with variables and conditions that must be specialized to concrete situations:

**Abstract norm**: "Physicians must obtain informed consent before treating patients."
- Who is the physician? (variable x)
- Who is the patient? (variable y)
- What constitutes "before"? (temporal relation)
- When does this obligation activate? (condition)

An agent cannot act on an abstract norm directly—it must **instantiate** the norm by grounding its variables and conditions in the current belief state.

The normative BDI framework formalizes this instantiation process: An abstract norm stored in the ANB becomes an active norm instance in the NIB when its activation conditions are satisfied and its variables are bound to concrete entities.

## Formal Framework

**Abstract Norm Definition** (from the paper):
```
n_a = ⟨M, A, E, C, S, R⟩
```

Where:
- M: Modality (O=obligation, F=prohibition, P=permission)
- A: Activation condition (logical formula over beliefs)
- E: Expiration condition (logical formula over beliefs)
- C: Content (what is obligated/forbidden/permitted, may contain variables)
- S: Sanction (consequence of violating)
- R: Reward (consequence of respecting)

**Norm Instance Definition**:

A norm instance is derived from an abstract norm by:
1. Evaluating activation condition A against belief-set B
2. If A is satisfied and E is not satisfied, then instantiate
3. Ground all variables in C according to B
4. Store the instantiated norm in NIB with timestamp

**Instantiation Bridge Rule** (p.5):

"If in the ANB there exists an abstract norm with modality M about C and according to the belief-set the activation condition is true, while the expiration condition is not, then we can instantiate the abstract norm and store an instance of it in the NIB."

Formally:
```
∃n_a ∈ ANB. n_a = ⟨M, A, E, C, S, R⟩ 
∧ eval(A, B) = true 
∧ eval(E, B) = false
→ n_i = ⟨M, ground(C, B), timestamp⟩ ∈ NIB
```

## The Grounding Process

Grounding transforms abstract predicates with variables into concrete predicates with constants from the belief-set.

**Example from the paper**:

**Abstract norm in ANB**:
```
⟨O, hungry(x), fed(x), feed(agent, x), sanctions, rewards⟩
```

This represents: "When x is hungry and not yet fed, the agent is obligated to feed x."

**Belief-set contains**:
```
isHungry(Travis) = true
fed(Travis) = false
robot_id = R781
```

**Grounding process**:
1. Check activation condition: hungry(x) → hungry(Travis)? 
   - Query belief-set: isHungry(Travis) = true ✓
2. Check expiration condition: fed(x) → fed(Travis)?
   - Query belief-set: fed(Travis) = false ✓ (expiration not met, norm still active)
3. Ground variables in content: feed(agent, x) → feed(R781, Travis)
4. Create instance: ⟨O, feed(R781, Travis)⟩

**Instantiated norm in NIB**:
```
⟨O, feed(R781, Travis)⟩
```

This is now a concrete, actionable obligation the agent can reason about.

## Multiple Instantiations

A single abstract norm may instantiate multiple times if multiple groundings satisfy the conditions:

**Abstract norm**:
```
⟨F, inRoom(x, room) ∧ hasAllergy(x, room_content), 
    ∅,  // No expiration—remains active while condition holds
    allow_entry(x, room)⟩
```

"It is forbidden to allow entry to anyone with relevant allergies."

**Belief-set**:
```
inRoom(patient1, lab_A) = false
hasAllergy(patient1, latex) = true
contains(lab_A, latex_equipment) = true

inRoom(patient2, lab_A) = false  
hasAllergy(patient2, peanuts) = true
contains(lab_A, no_peanuts) = true

inRoom(patient3, lab_B) = false
hasAllergy(patient3, radiation) = true
contains(lab_B, radiation_source) = true
```

**Instantiations produced**:
```
NIB:
⟨F, allow_entry(patient1, lab_A)⟩  // Latex allergy matches lab content
⟨F, allow_entry(patient3, lab_B)⟩  // Radiation allergy matches lab content
```

Note: patient2's allergy doesn't match any lab content, so no prohibition instantiates for them.

## Temporal Dynamics

The instantiation bridge rule creates a dynamic relationship between ANB and NIB:

**Activation triggers instantiation**:
- At time T1: Condition A becomes true in belief-set
- Instantiation occurs: Abstract norm → Norm instance added to NIB
- Agent now has active obligation/prohibition/permission

**Expiration triggers de-instantiation**:
- At time T2: Condition E becomes true in belief-set
- De-instantiation occurs: Norm instance removed from NIB
- Agent's obligation/prohibition/permission expires

**Example timeline**:

```
T0: ANB contains ⟨O, temperature_high(reactor), temperature_normal(reactor), activate_cooling(reactor)⟩
    NIB is empty
    belief: temperature_high(reactor) = false

T1: Sensor update → temperature_high(reactor) = true
    Activation condition satisfied
    Instantiation: ⟨O, activate_cooling(reactor)⟩ added to NIB

T2: Agent executes cooling plan
    Effect: temperature decreases

T3: Sensor update → temperature_high(reactor) = false
    Expiration condition satisfied  
    De-instantiation: ⟨O, activate_cooling(reactor)⟩ removed from NIB
```

The NIB acts as a "working memory" for currently-active normative constraints.

## Conditional Norms and Complex Activation Logic

Activation conditions can be arbitrarily complex logical formulas:

**Conjunctive activation**:
```
⟨O, (emergency = true) ∧ (staff_available > 0), 
    emergency = false,
    mobilize_staff()⟩
```

Both conditions must hold for instantiation.

**Disjunctive activation**:
```
⟨F, (system_overload = true) ∨ (maintenance_mode = true),
    (system_overload = false) ∧ (maintenance_mode = false),
    accept_new_requests()⟩
```

Either condition triggers the prohibition.

**Quantified activation**:
```
⟨O, ∃p. (priority(task_p) = critical ∧ status(task_p) = pending),
    ¬∃p. (priority(task_p) = critical ∧ status(task_p) = pending),
    process_critical_tasks()⟩
```

Instantiates if *any* critical task is pending, expires when *no* critical tasks remain.

**Threshold-based activation**:
```
⟨F, count(active_connections) > max_capacity,
    count(active_connections) ≤ max_capacity,
    create_new_connection()⟩
```

Numeric comparisons in belief-set.

## Application to Agent Orchestration

**Dynamic Task Allocation with Normative Constraints**:

In WinDAGs, tasks may have normative requirements that only activate under certain conditions:

**Abstract norm for a data processing task**:
```
⟨O, contains_PII(dataset) ∧ jurisdiction(dataset) = EU,
    processing_complete(dataset),
    apply_GDPR_protections(dataset)⟩
```

**Orchestration flow**:
1. Task arrives: Process dataset_X
2. Orchestrator queries metadata: contains_PII(dataset_X)? jurisdiction(dataset_X)?
3. Beliefs updated: contains_PII(dataset_X) = true, jurisdiction(dataset_X) = EU
4. Activation condition satisfied → Norm instantiates
5. NIB now contains: ⟨O, apply_GDPR_protections(dataset_X)⟩
6. Task decomposition must include GDPR compliance subtasks
7. Assign to agents with GDPR capabilities

If a different dataset arrives without PII or from US jurisdiction, the norm doesn't instantiate—no GDPR overhead.

**Context-Dependent Skill Activation**:

Skills may have norms that only apply in specific contexts:

**Authentication skill abstract norm**:
```
⟨O, sensitivity_level(request) ≥ HIGH ∧ ¬authenticated(requester),
    authenticated(requester) ∨ request_denied(requester),
    perform_2FA(requester)⟩
```

- Low-sensitivity requests: Activation condition false, no 2FA required
- High-sensitivity requests: Activation condition true, 2FA norm instantiates

The skill behavior adapts based on instantiation of its normative requirements.

**Deadline-Based Norm Activation**:

```
⟨O, time_remaining(task) < emergency_threshold,
    task_complete(task) ∨ deadline_passed(task),
    escalate_priority(task)⟩
```

As deadline approaches, the obligation to escalate instantiates automatically. This allows agents to shift behavior based on temporal urgency without explicit deadline checking in every plan.

**Resource-Constraint Norms**:

```
⟨F, memory_usage > 0.9 * total_memory,
    memory_usage ≤ 0.8 * total_memory,
    allocate_large_buffer()⟩
```

When system resources become constrained, prohibitions against resource-intensive actions instantiate. As resources free up, prohibitions expire.

## Integration with Plan Selection

Instantiated norms directly impact which plans can be selected:

**Plan-Norm Consistency Check** (as described in previous documents):

When selecting a plan to achieve intention i:
1. Retrieve all instantiated norms from NIB
2. For each candidate plan p:
   - Check effects(p) against forbidden effects in NIB
   - Check effects(p) against obligated effects in NIB
   - Filter out inconsistent plans
3. Select from remaining consistent plans

**Example**:

**NIB contains**:
```
⟨F, transmit_unencrypted(data_X)⟩  // Recently instantiated due to data_X sensitivity
⟨O, log_access(data_X)⟩            // Compliance requirement
```

**Candidate plans for intention "deliver(data_X, destination)"**:
- Plan A: compress(data_X), transmit_unencrypted(data_X), decompress(data_X)
  - **Rejected**: transmit_unencrypted violates prohibition
- Plan B: encrypt(data_X), transmit_encrypted(data_X), decrypt(data_X)
  - **Accepted**: No forbidden effects
  - But check: Does it include log_access? No → Must be composed with logging plan
- Plan C: encrypt(data_X), transmit_encrypted(data_X), log_access(data_X), decrypt(data_X)
  - **Accepted**: Satisfies prohibition avoidance and obligation satisfaction

The instantiated norms act as runtime constraints on plan selection.

## Belief-Set Requirements for Effective Instantiation

For instantiation to work, the belief-set must contain:

1. **Ground facts matching variables**: If norm has variable x, beliefs must include facts about concrete entities that can bind to x

2. **Evaluable predicates**: All predicates in activation/expiration conditions must be queryable from beliefs
   - If condition is temperature_high(reactor), belief-set must support temperature_high queries

3. **Temporal information**: If activation/expiration involve temporal relations, belief-set needs time-aware facts
   - before(event_X, event_Y)
   - time_remaining(task) < threshold

4. **Compositional evaluation**: Complex conditions require compositional belief queries
   - (p ∧ q) requires evaluating both p and q
   - ∃x.φ(x) requires iterating over entities in belief-set

**Failure modes**:

**Incomplete beliefs**: Activation condition references predicate not in belief-set
- Norm cannot instantiate (undefined condition)
- Agent may miss important normative constraints
- Mitigation: Closed-world assumption (undefined = false) or open-world (undefined = unknown, skip)

**Stale beliefs**: Beliefs not updated, activation/expiration conditions evaluated on outdated information
- Norms instantiate late or expire late
- Agent operates under wrong normative state
- Mitigation: Frequent belief updates, timestamped beliefs with freshness checking

**Inconsistent beliefs**: Belief-set contains contradictions
- Activation condition may evaluate to both true and false
- Undefined instantiation behavior
- Mitigation: Belief revision, consistency maintenance in belief-set

## Implementation Patterns

**For WinDAGs orchestration**:

```python
class NormInstantiationEngine:
    def __init__(self, anb, nib, belief_set):
        self.anb = anb  # Abstract Norm Base
        self.nib = nib  # Norm Instance Base  
        self.belief_set = belief_set
    
    def update_instantiations(self):
        """
        Check all abstract norms for activation/expiration
        """
        # Check for new instantiations
        for abstract_norm in self.anb:
            if self._should_instantiate(abstract_norm):
                instance = self._instantiate(abstract_norm)
                self.nib.add(instance)
        
        # Check for expirations
        for norm_instance in self.nib:
            if self._should_expire(norm_instance):
                self.nib.remove(norm_instance)
    
    def _should_instantiate(self, abstract_norm):
        """
        Evaluate activation condition against belief-set
        """
        activation = abstract_norm.activation_condition
        expiration = abstract_norm.expiration_condition
        
        return (self.belief_set.evaluate(activation) == True and
                self.belief_set.evaluate(expiration) == False)
    
    def _instantiate(self, abstract_norm):
        """
        Ground variables in abstract norm using belief-set
        """
        # Find all variable bindings that satisfy activation condition
        bindings = self.belief_set.find_satisfying_bindings(
            abstract_norm.activation_condition
        )
        
        # Ground content with bindings
        instances = []
        for binding in bindings:
            grounded_content = self._ground(abstract_norm.content, binding)
            instances.append(NormInstance(
                modality=abstract_norm.modality,
                content=grounded_content,
                source=abstract_norm.id,
                timestamp=current_time()
            ))
        
        return instances
    
    def _ground(self, formula, binding):
        """
        Replace variables in formula with constants from binding
        """
        result = formula
        for var, value in binding.items():
            result = result.replace(var, value)
        return result
    
    def _should_expire(self, norm_instance):
        """
        Check if expiration condition now holds
        """
        # Look up original abstract norm
        abstract_norm = self.anb.get(norm_instance.source)
        expiration = abstract_norm.expiration_condition
        
        # Ground expiration condition with instance's bindings
        grounded_expiration = self._extract_and_ground(
            expiration, norm_instance.content
        )
        
        return self.belief_set.evaluate(grounded_expiration) == True
```

**Usage in BDI loop**:

```python
def bdi_loop_iteration():
    # 1. Observe environment, update beliefs
    new_percepts = sense_environment()
    belief_set.update(new_percepts)
    
    # 2. Update norm instantiations based on new beliefs
    instantiation_engine.update_instantiations()
    
    # 3. Check consistency of instantiated norms
    for new_instance in nib.get_new_instances():
        consistency = check_consistency(new_instance, nib, intentions)
        if consistency == "strong_inconsistent":
            resolve_conflict(new_instance, nib, intentions)
    
    # 4. Internalize consistent norms into desires
    for norm_instance in nib.get_active():
        if norm_instance.internalized:
            desires.add(norm_instance.content)
    
    # 5. Generate intentions from desires (standard BDI)
    intentions = generate_intentions(beliefs, desires)
    
    # 6. Select plans consistent with NIB
    plans = select_plans(intentions, plan_library, nib)
    
    # 7. Execute
    execute(plans)
```

## Connection to Human Cognitive Processes

The instantiation mechanism mirrors human ethical reasoning:

**Principle-to-situation mapping**: Humans hold general ethical principles ("help those in need") and instantiate them in specific situations:
- See person struggling with groceries → Instantiate "offer help to this person now"
- Abstract principle remains constant, instances come and go

**Context-sensitive activation**: Ethical requirements activate based on context:
- Honesty obligation generally inactive
- When asked a direct question → Honesty obligation instantiates
- After answering → Obligation expires until next query

**Variable binding**: Humans ground abstract norms with contextual entities:
- "Respect your elders" + (elderly person X present) → "Respect person X"
- Same norm generates different instances with different people

The formal instantiation process captures this natural cognitive pattern.

## Distinctive Contribution

Most normative agent systems either:
1. **Hardcode specific norms**: No abstraction, every situation requires new norm
2. **Use static norm sets**: All norms active all the time, no conditional activation
3. **Require explicit triggering**: Programmer must manually activate/deactivate norms

This framework's instantiation mechanism provides:
- **Declarative norm specification**: State abstract norms once with conditions
- **Automatic activation**: Norms instantiate when conditions emerge in beliefs
- **Automatic expiration**: Norms deactivate when no longer relevant
- **Dynamic adaptation**: Normative state tracks environmental state without explicit management

This enables agents to operate under complex, context-dependent normative regimes without brittle conditional logic scattered through code.

The instantiation bridge rule is the *mechanism* that makes the recognition/internalization separation *practical*—without it, ANB would just be a static knowledge base, not a dynamic norm management system.

## Open Questions

1. **Instantiation granularity**: How fine-grained should variables be? Can norms quantify over infinite domains?

2. **Computational cost**: With many abstract norms and large belief-sets, how often should instantiation be checked? Every belief update? Periodically?

3. **Instantiation failure handling**: If activation condition is satisfied but grounding fails (no suitable bindings), how should agent respond?

4. **Hierarchical instantiation**: Can an instantiated norm serve as the activation condition for another abstract norm? Norms about norms?

5. **Probabilistic instantiation**: If belief-set contains uncertain beliefs, should norms instantiate with probability? How does this affect downstream reasoning?