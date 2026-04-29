# Three Types of Consistency for Norm Adoption

## The Central Problem

When an agent receives a new norm—a prohibition, obligation, or permission—it must determine: *Can I adopt this norm while maintaining consistency with my existing commitments?*

The naive approaches fail:
- **Always adopt**: Leads to paralyzing conflicts when norms contradict each other or the agent's core goals
- **Adopt if no explicit contradiction**: Misses subtle conflicts where the norm is technically compatible but impossible to satisfy given the agent's capabilities
- **Priority-based adoption**: Requires pre-specified rankings of all possible norms—impossible to enumerate in advance

The normative BDI framework introduces a three-tier consistency classification: **strong inconsistency**, **weak consistency**, and **strong consistency**. This granular analysis enables nuanced adoption decisions.

## Formal Definitions

**Plan-Norm Consistency**: A plan instance p is consistent with currently active norms in NIB if:
- The effects of p are not among forbidden effects (modulo permissions)
- The effects of p don't negate required effects of obligations

Formally:
```
consistent(p, NIB) ⇐⇒ 
  (effects(n_F_i) \ effects(n_P_i)) ∩ effects(p) = ∅
  ∧ effects(n_O_i) ∩ neg_effects(p) = ∅
```

Where n_F_i are active prohibitions, n_P_i are active permissions (which carve out exceptions to prohibitions), and n_O_i are active obligations.

**The three consistency types for a new obligation**:

1. **Strong Inconsistency**: ALL plan instantiations that would satisfy the obligation are either:
   - Explicitly prohibited by NIB, OR
   - Would make the agent inconsistent with NIB through their side effects

   The agent has *no way* to satisfy the obligation without violating other commitments.

2. **Strong Consistency**: ALL plan instantiations that would satisfy the obligation are:
   - Not explicitly prohibited by NIB, AND
   - Keep the agent consistent with NIB through their effects
   
   The agent can satisfy the obligation *no matter which specific plan it chooses*.

3. **Weak Consistency**: There EXISTS at least one plan instantiation that:
   - Is not explicitly prohibited by NIB, AND
   - Keeps the agent consistent with NIB
   
   The agent can satisfy the obligation *if it chooses carefully*, but wrong choices exist.

## Why Three Categories Matter

The distinction enables different adoption strategies:

**Strong Inconsistency → Rejection or Conflict Resolution**:
When a new obligation is strongly inconsistent, the agent *cannot* adopt it without dropping existing commitments. This triggers the consequence-based conflict resolution mechanism described in the previous document. The agent must choose: adopt the new obligation and drop conflicting norms/goals, or reject the obligation.

**Strong Consistency → Immediate Adoption**:
When a new obligation is strongly consistent, adoption is "safe"—any way the agent chooses to satisfy it will work. The agent can immediately internalize the norm without further analysis. This is the fast path for norm adoption.

**Weak Consistency → Constrained Adoption**:
When a new obligation is weakly consistent, the agent can adopt it but must be *careful* in how it satisfies it. Some plan choices lead to conflicts, others don't. The agent should:
- Internalize the norm (update desire-set)
- Annotate which specific plans are safe to use
- During intention formation, avoid the problematic plans
- Monitor for situations where only problematic plans are available (requires escalation)

This is sophisticated but tractable—the agent doesn't reject the norm, but it doesn't treat it as unconditional either.

## Plan-Intention Consistency

The framework applies similar reasoning to consistency between plans and existing intentions:

**Definition**: Plan p is consistent with intention set I when:
```
consistent(p, I) ⇐⇒ ∀i ∈ I. (effects(π_i) ∩ effects(p) = ∅)
```

Where π_i is the plan instantiated to achieve intention i.

This checks whether executing p would interfere with ongoing committed activities.

**Three consistency types** (analogous to plan-norm consistency):

1. **Strong Inconsistency**: All plans satisfying the obligation interfere with current intentions—achieving the new goal requires abandoning current work

2. **Strong Consistency**: All plans satisfying the obligation are compatible with current intentions—the agent can pursue both simultaneously

3. **Weak Consistency**: Some plans work, some don't—the agent must choose carefully to avoid interference

## The Compound Consistency Check

A new norm must pass *both* checks:
- Consistency with existing norms (NIB)
- Consistency with existing intentions (I)

This creates a 3×3 matrix of possibilities:

| NIB Consistency | I Consistency | Interpretation |
|----------------|---------------|----------------|
| Strong | Strong | Ideal—adopt immediately |
| Strong | Weak | Safe for norms, careful with intentions |
| Strong | Strong Inconsistent | Safe for norms, conflicts with current work |
| Weak | Strong | Careful with norms, safe for intentions |
| Weak | Weak | Careful on both dimensions |
| Weak | Strong Inconsistent | Careful with norms, conflicts with work |
| Strong Inconsistent | Strong | Normative conflict, no intention conflict |
| Strong Inconsistent | Weak | Normative conflict, limited intention options |
| Strong Inconsistent | Strong Inconsistent | Complete conflict—requires major revision |

## Application to Agent Orchestration

**Task Decomposition with Consistency Checking**:

When an orchestrator decomposes a complex task into subtasks:

1. **Check subtask compatibility**: Are the required subtasks strongly, weakly, or strongly inconsistent with each other?
   - Strong inconsistency: The decomposition is invalid, try alternative decomposition
   - Weak consistency: The decomposition works but execution order matters—create explicit sequencing constraints
   - Strong consistency: Any execution order works—maximize parallelism

2. **Check agent capability compatibility**: For each subtask assignment to an agent:
   - Is the subtask strongly, weakly, or strongly inconsistent with the agent's active norms?
   - Is the subtask strongly, weakly, or strongly inconsistent with the agent's current workload?
   - Route subtasks to agents where consistency is strong or weak, avoid strong inconsistency

3. **Propagate consistency constraints**: When weak consistency exists, propagate the "safe plan" information to the assigned agent:
   - "You can solve this subtask, but use method X not method Y"
   - "You can process this data, but don't cache it (conflicts with privacy norm)"

**Skill Composition with Normative Constraints**:

Skills in WinDAGs may have embedded norms:
- Authentication skill requires: O(verify_identity) before allowing access
- Data processing skill has: F(log_PII) to comply with privacy regulations
- Code generation skill has: O(include_license_header) for legal compliance

When composing skills into workflows:

1. **Collect skill-specific norms**: As skills are added to a workflow, accumulate their normative requirements into a temporary NIB

2. **Check composition consistency**: 
   - Strong inconsistency: Skills have contradictory norms (can't satisfy both)—reject composition or require human intervention
   - Weak consistency: Skills have compatible norms but ordering matters—enforce sequencing
   - Strong consistency: Norms are compatible—any composition order works

3. **Minimize weak consistency through ordering**: If Skill A's norms create weak consistency with Skill B's norms, try reordering:
   - If A-then-B creates weak consistency but B-then-A creates strong consistency, prefer B-then-A
   - If both orderings create weak consistency, document the constraints and pass them to the executor

## Concrete Example: Healthcare Agent

**Scenario**: An AI agent managing patient care receives a new obligation: O(administer_medication(patient_42, drug_X))

**NIB contains**:
- F(administer_medication(p, d)) where allergy(p, d) — prohibition against giving drugs a patient is allergic to
- O(verify_allergies(p)) before any drug administration
- F(exceed_dosage(p, d, max_safe)) — prohibition against overdosing

**Current Intentions (I)**:
- Ongoing: monitor_vitals(patient_42)
- Scheduled: conduct_physical_exam(patient_42)

**Plan Library**:
- Plan A: administer_IV(patient_42, drug_X) — requires IV line, takes 30 minutes
- Plan B: administer_oral(patient_42, drug_X) — requires patient conscious, takes 5 minutes  
- Plan C: administer_injection(patient_42, drug_X) — requires sterile prep, takes 10 minutes

**Consistency Analysis**:

Norm Consistency Check:
- Plan A effects: IV_line_inserted(patient_42), drug_X_administered(patient_42)
  - Not explicitly forbidden (assuming no allergy)
  - Doesn't negate verify_allergies obligation (assumed already completed)
  - Doesn't exceed dosage (assuming correct amount)
  - **Consistent with NIB**

- Plan B effects: oral_intake(patient_42), drug_X_administered(patient_42)
  - Precondition: conscious(patient_42)
  - If patient is unconscious: **Not applicable**
  - If conscious: **Consistent with NIB**

- Plan C: Similar analysis to Plan A: **Consistent with NIB**

Intention Consistency Check:
- Plan A vs. monitor_vitals: 
  - IV insertion interferes with some vital monitoring (need to pause for insertion)
  - **Weakly Consistent** — can be done but requires coordination

- Plan A vs. conduct_physical_exam:
  - IV line interferes with certain exam procedures (range of motion tests)
  - **Weakly Consistent** — do exam before IV insertion, or use different plan

- Plan B vs. monitor_vitals:
  - Oral administration doesn't interfere with monitoring
  - **Strongly Consistent**

- Plan B vs. conduct_physical_exam:
  - Oral administration briefly interrupts exam
  - **Weakly Consistent**

**Compound Analysis**:
- If patient is conscious: Plan B is strongly consistent with norms, weakly consistent with intentions → **Preferred choice**
- If patient is unconscious: Plan A is weakly consistent with both norms and intentions → **Requires careful scheduling**
- Plan C falls somewhere in between

**Agent Decision**:
1. Check consciousness
2. If conscious: Adopt obligation, select Plan B, note that it should be done during a brief exam pause
3. If unconscious: Adopt obligation, select Plan A, coordinate with monitoring system to pause during IV insertion

This is weak consistency reasoning in action—the agent can satisfy the obligation, but must choose and schedule carefully.

## Boundary Conditions

**When consistency classification breaks down**:

1. **Incomplete plan specifications**: If plans don't fully specify their effects, the consistency check can miss conflicts. Requires comprehensive effect annotations or runtime monitoring to detect emergent conflicts.

2. **Non-deterministic effects**: If plan effects are probabilistic, consistency becomes fuzzy. May need extension to: "strongly consistent with probability p" or expected consistency metrics.

3. **Continuous consistency changes**: In dynamic environments, a strongly consistent plan at decision time may become inconsistent by execution time. Requires:
   - Pre-execution revalidation of consistency
   - Contingency plans for consistency violations
   - Ability to suspend/revise commitments mid-execution

4. **Emergent interactions**: When combining multiple plans, their joint effects may create conflicts not present in individual plans. Requires compositional consistency checking, not just pairwise.

**When this approach excels**:

- **Well-defined action models**: Domains where plan preconditions and effects can be precisely specified (robotics, workflow automation, database transactions)
- **Moderate plan libraries**: When the number of plan alternatives is manageable (dozens to hundreds, not millions)
- **Explicit norms**: When norms can be formally stated as constraints on actions/states
- **Synchronous decision points**: When consistency can be checked before commitment, not during parallel execution

## Implementation Patterns

**For WinDAGs orchestration**:

```python
def adopt_norm(agent, new_norm):
    """
    Attempt to adopt a new norm with consistency checking
    """
    # Get all plans that could satisfy the norm
    satisfying_plans = agent.plan_library.find_satisfying(new_norm)
    
    if not satisfying_plans:
        return AdoptionResult.NO_CAPABILITY
    
    # Check each plan against NIB and current intentions
    norm_consistent = []
    intention_consistent = []
    
    for plan in satisfying_plans:
        if is_consistent(plan, agent.nib):
            norm_consistent.append(plan)
        if is_consistent(plan, agent.intentions):
            intention_consistent.append(plan)
    
    # Classify consistency type
    if not norm_consistent:
        # Strong inconsistency with norms
        return handle_normative_conflict(agent, new_norm)
    elif len(norm_consistent) == len(satisfying_plans):
        # Strong consistency with norms
        norm_consistency = "strong"
    else:
        # Weak consistency with norms
        norm_consistency = "weak"
        agent.annotate_safe_plans(new_norm, norm_consistent)
    
    # Similar for intentions...
    
    # Adopt norm, update desire-set
    agent.desires.add(new_norm.content)
    agent.nib.add_active(new_norm)
    
    return AdoptionResult(
        success=True, 
        norm_consistency=norm_consistency,
        intention_consistency=intention_consistency,
        safe_plans=norm_consistent if norm_consistency == "weak" else None
    )
```

## Connection to Human Expert Reasoning

The three-tier consistency model mirrors how human experts reason about taking on new commitments:

**Strong Inconsistency Recognition**: Experts immediately recognize when a new request is impossible given current commitments: "I can't take that case—it conflicts with my representation of the opposing party."

**Strong Consistency Recognition**: Experts recognize when a new commitment fits seamlessly: "Sure, I can add that to my workload—it doesn't interfere with anything."

**Weak Consistency Recognition**: Experts recognize when a new commitment is *possible but constrained*: "I can take that on, but I'll need to shuffle my schedule" or "I can do that, but only if I use approach X not approach Y."

The formal framework captures this intuitive reasoning and makes it executable by artificial agents.

## Distinctive Contribution

Most agent architectures treat norm adoption as binary: adopt or reject. This framework introduces *qualified adoption*—the agent can adopt a norm with annotations about how it must be satisfied.

This prevents two failure modes:
1. **Over-rejection**: Rejecting norms that are actually satisfiable if the agent is careful about plan selection
2. **Over-adoption**: Adopting norms blindly then discovering at execution time that chosen plans conflict

The weak consistency category enables "yes, but..." reasoning—a critical capability for flexible, adaptive agents operating in complex normative environments.