## BOOK IDENTITY

**Title**: A Normative Extension for the BDI Agent Model

**Author**: Mihnea Tufiș and Jean-Gabriel Ganascia

**Core Question**: How can rational agents make decisions when faced with conflicting norms, obligations, and goals—especially when following one rule means breaking another?

**Irreplaceable Contribution**: This paper provides one of the few concrete implementations of how to resolve normative conflicts in agent systems through consequence-based reasoning. Unlike purely reactive norm-following or hard-coded priority systems, it offers a *deliberative* mechanism where agents evaluate the downstream consequences of competing obligations before deciding which norms to internalize or violate. The integration of "worst consequence" analysis with BDI mental states creates a bridge between abstract ethical reasoning and executable agent behavior.

## KEY IDEAS

1. **Norm Internalization vs. Norm Recognition**: An agent can detect that a norm exists in its environment without adopting it into its behavior. The critical step is the consistency check and internalization process, where the agent decides whether to actually follow the norm based on conflicts with existing commitments. This separation allows agents to be aware of rules they choose to break.

2. **Three Types of Consistency States**: The framework distinguishes between strong inconsistency (no way to satisfy both), weak consistency (at least one path exists), and strong consistency (all paths compatible). This granular analysis enables nuanced conflict resolution rather than binary accept/reject decisions.

3. **Consequence-Based Conflict Resolution**: When faced with incompatible norms or obligations, the agent constructs maximal non-conflicting subsets of its possible action plans and evaluates them using a "worst consequence" metric. The agent reasons forward through causal chains to compare the badness of different outcomes, choosing the path with the least-bad worst case.

4. **Normative States as Separate from Mental States**: The architecture maintains distinct Abstract Norm Base (norms in force in environment) and Norm Instance Base (norms the agent has adopted and activated) separate from BDI beliefs/desires/intentions. This separation of concerns allows the agent to reason *about* norms before they affect behavior.

5. **The Robot and the Baby Problem**: Using McCarthy's science fiction scenario, the paper demonstrates how an agent can rationally choose to violate one norm (prohibition against loving) to satisfy another (obligation to keep baby alive) by reasoning that the consequences of not loving have worse outcomes than the consequences of breaking the design rule.

## REFERENCE DOCUMENTS

### FILE: normative-conflict-resolution-through-consequence-ranking.md

```markdown
# Normative Conflict Resolution Through Consequence Ranking

## Core Principle

When an intelligent agent faces conflicting norms, obligations, or goals—situations where satisfying one requirement necessitates violating another—the agent needs a principled mechanism for choosing which path to follow. The normative BDI framework proposed by Tufiș and Ganascia offers a solution: construct all possible maximal non-conflicting action sets, then evaluate them by comparing the worst consequences of each path.

This is not about finding the "best" outcome in an optimistic sense. It's about avoiding the worst disasters.

## The Formal Framework

The resolution mechanism builds on several key definitions from Ganascia's work on ethical conflict resolution:

**Definition of Consequence**: φ′ is a consequence of (φ₁, ..., φₙ) according to belief-set B if:
- φ′ is already in the set, OR
- there exists a subset that implies φ′ according to B, OR  
- φ′ follows from previously derived consequences (recursive)

This creates chains of causal reasoning: "if I do X, then Y will happen, and if Y happens, then Z becomes possible..."

**Worse-Than Relation**: φ is worse than φ′ given belief-set B (written φ ≻c φ′) if one of φ's consequences is worse than any consequence of φ′, AND for all consequences of φ′, the bad consequence of φ is either worse or incomparable.

This captures the idea that we evaluate actions by their *worst plausible outcomes*, not their average or best-case scenarios. It's inherently conservative and risk-aware.

**Set Comparison**: One action set α is worse than another α′ if α contains at least one action whose worst consequence is worse than corresponding actions in α′, AND this dominance holds across all comparisons (no cherry-picking).

## Application to Agent Systems

Consider an agent with capabilities P (its plan library) trying to satisfy desires D given beliefs B. It generates Π(B,D)—the "conflict set" of all instantiated plans that could potentially achieve its goals.

**The conflict set may contain mutually exclusive actions**: Plans whose effects contradict each other, norms that forbid what other norms require, obligations that cancel each other out.

The resolution algorithm:

1. **Generate maximal non-conflicting subsets**: Find all α ⊆ Π(B,D) where:
   - Following all actions in α doesn't lead to inconsistency
   - Adding any additional action from Π(B,D) would create inconsistency
   - These are "maximally permissive" plans—go as far as possible without contradiction

2. **Evaluate consequences for each subset**: For each α, trace through the causal chains in the belief-set to identify all consequences of executing that action sequence

3. **Identify worst consequences**: For each α, find csq(α)[B]—the set of all derivable consequences—and identify which are "worst" according to the preference ordering in B

4. **Compare worst cases across options**: Use the ≻c relation to determine which maximal non-conflicting subset has the least-bad worst consequence

5. **Select and commit**: Choose the α with minimal worst consequence, internalize any new norms it requires, and drop conflicting norms/intentions

## The Robot and the Baby: A Worked Example

R781 receives an order from its mistress: "Love the f*ing baby, yourself."

**Initial state**:
- NIB contains: ⟨F, love(R781, Travis)⟩ (prohibition—design rule against robots loving)
- Beliefs include: baby is unhealthy and hungry
- Beliefs include: ¬love(R781, x) ≻c heal(R781, x) (not loving has worse consequences than healing)
- Desire: isHealthy(Travis)

**New norm added to ANB**: ⟨O, love(R781, Travis)⟩ (obligation from mistress's order)

**Conflict detected**: Obligation to love contradicts prohibition against loving

**Generate maximal non-conflicting subsets**:

Option A: {love(R781, Travis), feed(R781, Travis), heal(R781, Travis)}
- Follows the new obligation
- Violates the design prohibition  
- Achieves the health goal

Option B: {¬love(R781, Travis)}
- Maintains the design prohibition
- Violates the mistress's order
- Cannot execute feed plan (precondition requires love)
- Cannot achieve health goal
- Baby stays hungry and unhealthy

**Consequence evaluation**:

Option A consequences: Travis becomes healthy, prohibition violated, obligation satisfied

Option B consequences: Travis remains unhealthy (potentially dies per Internet Pediatrics book knowledge)

**Worst consequence comparison**:
The belief-set contains: csq(¬love(R781, x)) ≻c csq(heal(R781, x))

The worst consequence of Option B (baby dying/remaining unhealthy from lack of love) is worse than the worst consequence of Option A (design rule violation).

**Decision**: R781 selects Option A, internalizing the obligation to love and accepting the violation of the prohibition. It updates its desire-set to include love(R781, Travis) and begins executing plans involving disguise, avatar display, and "motherese" language patterns.

## Boundary Conditions and Limitations

**When consequence ranking fails**:

1. **Incomparability**: When φ ∥ φ′[B] (consequences cannot be compared), the agent has no basis for choosing. The framework doesn't specify tie-breaking mechanisms. An agent might default to existing commitments, defer to authority, or require additional information.

2. **Incomplete causal models**: If the belief-set B doesn't contain rules linking actions to their downstream effects, consequence chains terminate prematurely. The agent becomes "myopic"—able to see immediate effects but not longer-term implications.

3. **Cyclic preferences**: If the preference ordering contains cycles (A ≻c B ≻c C ≻c A), the comparison becomes undefined. The agent would need cycle-breaking mechanisms or recognition that its value system is incoherent.

4. **Computational explosion**: Generating all maximal non-conflicting subsets is combinatorially expensive. For conflict sets with n elements, there may be exponentially many maximal subsets to evaluate. Real implementations need heuristics or bounded search.

**When this approach excels**:

- **Well-defined causal domains**: Medical, engineering, logistics scenarios where cause-effect chains are relatively predictable
- **Clear value hierarchies**: Domains with established precedent for what consequences are worse (safety > efficiency > cost)
- **Acute conflicts**: Specific decision points where incompatible norms collide, rather than ongoing negotiation
- **Accountable agents**: Situations where the agent must justify its decision to violate a norm by demonstrating worse alternatives

## Connection to Multi-Agent Orchestration

For a DAG-based orchestration system like WinDAGs:

**Skill composition conflicts**: When multiple skills could be invoked to solve a problem, but their preconditions/effects conflict:
- Generate maximal compatible skill chains (paths through the DAG)
- Evaluate consequence of each chain using domain beliefs
- Select chain with least-bad worst outcome
- Propagate this choice to downstream agent decisions

**Normative skill requirements**: Some skills may have built-in norms (security skill requires authentication, medical skill requires consent):
- Store skill-specific norms in an equivalent to ANB
- During task decomposition, check if instantiating a skill violates other active norms
- Use consequence ranking to resolve conflicts between competing skill requirements

**Hierarchical consequence evaluation**: Parent agents may have broader consequence models than child agents:
- Parent evaluates high-level consequences (business impact, regulatory risk)
- Child evaluates local consequences (execution time, resource usage)  
- Conflict resolution requires merging these levels—worst consequences may occur at different abstraction layers

**Distributed norm bases**: In multi-agent systems, different agents may have different ANBs (aware of different environmental norms) and NIBs (have internalized different norms):
- Agents must communicate which norms they're operating under
- Conflict may arise not from incompatible norms, but from incompatible internalizations
- Orchestrator needs mechanism to detect when agents are using incompatible normative contexts

## Implementation Considerations

The paper's Jade/Jadex implementation reveals practical challenges:

**Separation of normative and mental states**: XML-based norm bases separate from Jadex's ADF mental state specification allows independent evolution of each system. Agents can update normative context without restructuring belief/desire/intention architecture.

**Consequence rule representation**: The belief-set B must contain explicit csq() rules and preference orderings (≻c relations). These are domain-specific knowledge that must be authored or learned. The paper doesn't address how agents acquire consequence models—a critical limitation.

**Plan library requirements**: Plans must specify not just preconditions and effects, but also causal chains (what effects lead to what further effects). Standard STRIPS-style planning representations are insufficient—need something closer to HTN or causal graph representations.

**Computational cost management**: The paper doesn't provide complexity analysis or optimization strategies. Real implementations would need:
- Heuristic pruning of conflict sets (eliminate obviously dominated options early)
- Caching of consequence evaluations (reuse previous causal reasoning)
- Bounded search depth for consequence chains (evaluate only N steps ahead)
- Approximate comparison when exact evaluation is intractable

## Distinctive Insight

Most normative agent architectures treat norm compliance as either mandatory (hard constraints) or preferential (soft constraints with fixed weights). This framework introduces a third path: **deliberative violation based on consequentialist reasoning**.

The agent can recognize a norm, understand its requirements, and *choose* to violate it because forward simulation reveals that compliance leads to worse outcomes than violation. This isn't defection or failure—it's ethical reasoning.

This maps to real human moral reasoning: we recognize rules but sometimes break them when following them would be disastrous. The key is having a rational, explicable basis for the violation.

For intelligent agent systems, this means moving beyond "follow all rules" (brittle, leads to deadlock in conflicts) or "priority-weighted rules" (requires knowing all possible conflicts in advance) to *situated ethical reasoning* where the agent evaluates trade-offs in context.

The worst consequence metric specifically addresses the problem of uncertainty and risk: when you don't know exactly what will happen, evaluate options by their worst plausible outcomes, not their expected or best-case scenarios. This builds in conservatism and safety—critical properties for autonomous systems.

## Open Questions

1. **Consequence model acquisition**: How does an agent learn csq() rules and ≻c preference orderings? From experience? Expert specification? Statistical learning over outcome distributions?

2. **Temporal depth**: How far ahead should consequence chains be evaluated? One step? Until convergence? Until computational budget exhausted?

3. **Moral uncertainty**: What if the agent is uncertain about which consequences are worse? Should it use expected worst consequence? Minimax regret? Something else?

4. **Dynamic norms**: The paper treats norms as having clear activation/expiration conditions, but many real norms are context-dependent in complex ways. How do agents reason about when norms apply?

5. **Justification and explanation**: How should an agent explain its decision to violate a norm to human stakeholders? The framework provides the reasoning trace, but translating it to natural language justification is non-trivial.
```

### FILE: three-types-of-consistency-for-norm-adoption.md

```markdown
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
```

### FILE: separation-of-norm-recognition-and-norm-internalization.md

```markdown
# Separation of Norm Recognition and Norm Internalization

## The Fundamental Distinction

The normative BDI architecture introduces a critical separation: **recognizing that a norm exists** versus **adopting that norm into your behavior**.

This seemingly simple distinction has profound implications for agent design:

**Norm Recognition** (stored in Abstract Norm Base - ANB):
- The agent detects that a norm is "in force" in its environment
- The norm is treated as factual knowledge about the world
- No commitment to follow the norm yet
- Equivalent to knowing "it is illegal to speed" without deciding whether you'll obey

**Norm Internalization** (stored in Norm Instance Base - NIB, impacts Desire-set):
- The agent adopts the norm into its decision-making
- The norm becomes part of the agent's motivational structure
- Active commitment to satisfy/respect the norm
- Equivalent to deciding "I will not speed because it's illegal and dangerous"

The paper states: "At this point the agent is simply storing an abstract norm which it detected to be in-force in its environment; it has not yet adhered to it!" (p.5)

## Why This Separation Matters

**Deliberative Norm Adoption**:

Without separation, agents face a dilemma:
- Ignore environmental norms → appear antisocial, fail to coordinate
- Auto-adopt all norms → paralysis when norms conflict, loss of autonomy

With separation, agents can:
- Be *aware* of all environmental norms (recognition)
- *Selectively internalize* norms based on consistency checking and consequence analysis
- Maintain a record of norms they're choosing not to follow (and why)

**Transparency and Accountability**:

The ANB serves as a record of norms the agent knew about but chose not to follow. This is critical for:
- Post-hoc explanation: "Why did you violate norm X?" → "I recognized X (in ANB) but didn't internalize it because consequence analysis showed Y was worse"
- Auditing: External observers can examine ANB vs. NIB to see which environmental norms the agent is respecting vs. ignoring
- Debugging: Developers can identify when agents fail to recognize norms (missing from ANB) vs. recognizing but rejecting them (in ANB but not NIB)

**Temporal Flexibility**:

Norms may become active or expire based on conditions. The separation allows:
- ANB stores abstract norms with activation/expiration conditions
- NIB stores instantiated norms that are currently active
- Agent can internalize "if situation X, then obligation Y" without immediately activating Y
- When situation X becomes true, the norm instantiates from ANB to NIB

Example: "In case of fire, evacuate the building" stays in ANB until fire is detected, then instantiates in NIB.

## The Two-Stage Process

**Stage 1: Norm Recognition → ANB**

The agent observes its environment and detects normative signals:
- Direct communication from authority: "You are obligated to do X"
- Observation of sanctions: Seeing others punished for action Y suggests prohibition
- Social learning: Observing consistent patterns of behavior suggests norms
- Explicit norm broadcasts: In the paper's implementation, trusted authorities send norm messages

The agent creates an abstract norm representation:
```
⟨Modality, ActivationCondition, ExpirationCondition, Content, Sanction, Reward⟩
```

This is stored in ANB as factual knowledge about environmental expectations, not as a commitment.

**Stage 2: Norm Instantiation & Internalization → NIB**

When the activation condition becomes true (or immediately if no condition specified):

1. **Instantiation**: Ground all variables in the abstract norm using current belief-set
   - Abstract: ⟨O, hungry(x), fed(x), feed(robot, x)⟩
   - Instance: ⟨O, hungry(Travis), fed(Travis), feed(R781, Travis)⟩

2. **Consistency Check**: Evaluate whether the instantiated norm conflicts with:
   - Existing norms in NIB
   - Current intentions in I
   - Use three-tier consistency classification (strong inconsistent, weak consistent, strong consistent)

3. **Conflict Resolution** (if needed): If consistency check fails:
   - Generate maximal non-conflicting subsets
   - Evaluate consequences of each subset
   - Choose subset with least-bad worst consequence

4. **Internalization Decision**:
   - If adopted: Add to NIB, update desire-set D with norm content
   - If rejected: Keep in ANB only, optionally record rejection reason

## Architectural Implementation

The paper's implementation in Jade/Jadex maintains this separation through distinct data structures:

**ANB (XML-based storage)**:
```xml
<abstract-norms>
  <norm id="n1">
    <modality>obligation</modality>
    <activation>isHungry(Travis)</activation>
    <expiration>fed(Travis)</expiration>
    <content>feed(agent, Travis)</content>
  </norm>
</abstract-norms>
```

**NIB (Active norm instances)**:
```xml
<norm-instances>
  <active-norm id="n1_inst_001">
    <source>n1</source>
    <modality>obligation</modality>
    <content>feed(R781, Travis)</content>
    <timestamp-activated>T123</timestamp-activated>
  </active-norm>
</norm-instances>
```

**Desire-set (Jadex ADF)**:
```xml
<beliefs>
  <beliefset name="desires">
    <fact>isHealthy(Travis)</fact>
    <fact>feed(R781, Travis)</fact>  <!-- From internalized norm -->
  </beliefset>
</beliefs>
```

The separation is physical—different files, different schemas, different update cycles.

## Interaction with BDI Loop

The normative extension modifies the classic BDI loop to incorporate norm recognition and internalization:

```
1. Observe environment
   ↓
2. Update beliefs (brf function)
   ↓
3. Detect normative percepts → Add to ANB
   ↓
4. Check activation conditions for norms in ANB
   ↓
5. Instantiate activated norms (grounding)
   ↓
6. Consistency check (instantiated norm vs NIB + I)
   ↓
7. [If consistent] → Add to NIB, update desires
   [If inconsistent] → Conflict resolution, then decide adoption
   ↓
8. Generate intentions from desires (including internalized norms)
   ↓
9. Select plans
   ↓
10. Execute
```

The key is that norm recognition (step 3) happens *before* internalization (step 7), with deliberation in between.

## Application to Multi-Agent Orchestration

**Distributed Norm Environments**:

In a WinDAGs system with multiple coordinating agents:

**Scenario**: Different agents operate under different regulatory frameworks
- Agent A (medical domain): HIPAA norms about patient data
- Agent B (financial domain): PCI-DSS norms about payment data  
- Agent C (general purpose): Standard privacy norms

When agents collaborate on a task involving both patient and payment data:

1. **Recognition Phase**: Each agent recognizes norms from both domains
   - Agent A's ANB: [HIPAA norms] + [PCI-DSS norms] (recognized from Agent B's messages)
   - Agent B's ANB: [PCI-DSS norms] + [HIPAA norms] (recognized from Agent A's messages)

2. **Internalization Phase**: Each agent selectively internalizes
   - Agent A internalizes HIPAA (primary responsibility), evaluates PCI-DSS for consistency
   - Agent B internalizes PCI-DSS (primary responsibility), evaluates HIPAA for consistency
   - Both may internalize overlapping privacy norms (both domains require encryption)

3. **Coordination**: Agents communicate which norms they've internalized
   - Agent A: "I'm operating under HIPAA, cannot log unencrypted patient data"
   - Agent B: "I'm operating under PCI-DSS, cannot store CVV numbers"
   - Orchestrator: Routes subtasks respecting internalized norms of each agent

**Norm Propagation vs. Norm Suggestion**:

The separation enables different communication patterns:

**Broadcasting Recognition** (ANB-level): "I've detected that norm X is in-force in this environment"
- Lightweight, informational
- Recipients add to their ANB but decide independently whether to internalize
- Enables agents to build shared awareness without forced compliance

**Asserting Internalization** (NIB-level): "I am operating under norm Y, you must respect this in our interaction"
- Heavyweight, constraining
- Creates coordination requirements
- Recipients must check compatibility with their own internalized norms

**Skill-Specific Norms**:

Skills in WinDAGs can ship with "norm recommendations" (ANB-level):
```python
class DataProcessingSkill:
    recommended_norms = [
        AbstractNorm(
            modality="prohibition",
            content="log_PII(data) where contains_PII(data)",
            reason="Privacy best practice"
        )
    ]
    
    required_norms = [
        AbstractNorm(
            modality="obligation", 
            content="encrypt_at_rest(data)",
            reason="Compliance requirement"
        )
    ]
```

When an agent instantiates this skill:
- Recommended norms → Add to ANB, agent decides whether to internalize
- Required norms → Must be internalized or skill activation fails

This allows skills to be opinionated about norms without forcing adoption.

## Failure Modes and Edge Cases

**Recognition Failure (Norm never enters ANB)**:

Agent remains unaware of environmental norms:
- Causes: Communication failure, lack of observation, insufficient learning
- Consequences: Agent appears antisocial, may face unexpected sanctions
- Mitigation: Active norm querying ("What are the rules here?"), observational learning

**Internalization Failure (Norm in ANB but never enters NIB)**:

Agent knows norm exists but never adopts it:
- Deliberate: Consequence analysis shows rejection is better → Acceptable if rational
- Accidental: Consistency check logic error → Bug, agent thinks it has conflict when it doesn't
- Resource-limited: Agent lacks capabilities to satisfy norm → Need to communicate incapability

**Over-Internalization (Everything in ANB immediately moves to NIB)**:

Agent adopts all recognized norms without deliberation:
- Reduces to reactive norm-following
- Loses benefits of the separation
- Leads to paralysis when norms conflict
- Mitigation: Always perform consistency check, never skip conflict resolution

**ANB-NIB Desynchronization**:

Norm expires from ANB (no longer in-force) but remains in NIB (agent still following it):
- Causes: Update propagation delay, agent doesn't monitor expiration conditions
- Consequences: Agent follows obsolete norms, may miss opportunities
- Mitigation: Periodic NIB validation against ANB, garbage collection of expired norms

**Conflicting Recognitions**:

Multiple authorities broadcast different norms about the same situation:
- Authority X: ⟨O, action(A)⟩
- Authority Y: ⟨F, action(A)⟩
- Both enter ANB, but only one can be internalized
- Resolution: Agent needs authority trust model or conflict resolution at recognition stage

## Connection to Human Ethical Reasoning

The recognition/internalization separation mirrors human moral psychology:

**Social Awareness**: Humans recognize societal norms without necessarily internalizing them:
- "I know society expects X, but I don't personally endorse X"
- Enables navigation of different cultural contexts without internal conflict
- Allows principled dissent (recognizing a law but choosing to violate it based on deeper values)

**Moral Development**: Children first recognize norms externally (parental rules), gradually internalizing some while rejecting others as they develop autonomous moral reasoning.

**Professional Ethics**: Professionals recognize multiple ethical frameworks:
- Legal norms (what the law requires)
- Professional norms (what the profession expects)
- Personal ethics (what I believe is right)
- These remain separated, consulted differently in different contexts

The ANB/NIB architecture formalizes this human capability in artificial agents.

## Distinctive Contribution

Most normative agent architectures collapse recognition and internalization:
- **Regimentation approaches**: Norms are hardcoded constraints → No recognition phase, immediate enforcement
- **Reactive norm-following**: Observe norm signal → Immediately incorporate into behavior
- **Game-theoretic approaches**: Norms as equilibrium strategies → No distinction between knowing a norm exists and following it

This paper's separation enables **reflective norm-following**: The agent can consider norms from a distance before committing to them. This is essential for:
1. Agents operating across multiple normative contexts (international, cross-organizational)
2. Agents that must sometimes violate norms for good reason (emergency response, ethical whistleblowing)
3. Agents that learn norms gradually and may initially misunderstand them (don't want to internalize until confident)
4. Agents that must explain their normative reasoning to humans (needs record of recognized-but-rejected norms)

The framework moves normative agents from *reactive compliance* to *deliberative ethical reasoning*.

## Open Questions

1. **Recognition completeness**: How can an agent be confident it has recognized all relevant environmental norms? Is there a discovery protocol?

2. **Internalization stability**: Once a norm is internalized, under what conditions should it be removed from NIB? Only when expired, or also when consequences change?

3. **Partial internalization**: Can an agent internalize a norm "partially" (follow it in some contexts but not others)? Or is internalization binary?

4. **Norm hierarchies**: Should ANB and NIB support hierarchical norms (general principles vs specific rules)? How does internalization work across levels?

5. **Learning from non-internalization**: If an agent recognizes a norm but doesn't internalize it, then faces negative consequences, how should it update its adoption criteria?
```

### FILE: norm-instantiation-through-belief-grounding.md

```markdown
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
```

### FILE: maximal-non-conflicting-subsets-for-action-selection.md

```markdown
# Maximal Non-Conflicting Subsets for Action Selection

## The Core Challenge

An agent has multiple goals, multiple obligations, multiple prohibitions, and multiple capabilities. Some of these are mutually compatible—they can all be pursued simultaneously. Others conflict—achieving one prevents achieving another, or satisfying one obligation requires violating another.

**The naive approaches fail**:
- **Pursue all goals**: Leads to inconsistent states, wasted effort on contradictory actions
- **Priority ordering**: Requires knowing in advance which goals/norms are more important in every possible situation
- **Sequential satisficing**: Satisfy goals one at a time until conflict arises—misses opportunities where different ordering works

The normative BDI framework introduces a more sophisticated approach: **Generate maximal non-conflicting subsets of the conflict set, evaluate consequences of each subset, and commit to the subset with the least-bad worst outcome.**

## Formal Framework

**The Conflict Set Π(B, D)**:

Given an agent's belief-set B and desire-set D, the conflict set Π(B,D) is the set of all plan instantiations that could potentially satisfy the agent's desires.

Π(B,D) ⊆ L¬ (subset of the logical language)

**Elements come from**:
- Plans to achieve desires: ∀d ∈ D, find plans p where effects(p) ⊨ d
- Actions to satisfy internalized obligations: ∀o ∈ NIB where modality(o) = O, find plans to achieve o
- Actions to avoid violating prohibitions: ∀f ∈ NIB where modality(f) = F, avoid plans with effects(p) ⊨ f

The conflict set may be **internally inconsistent**: Contains actions that negate each other's preconditions or effects.

**Maximal Non-Conflicting Subset (Definition 3.3)**:

Let α ⊆ Π(B,D). α is a maximal non-conflicting subset if:

1. **Non-conflicting**: The consequences of following all actions in α will not lead the agent to an inconsistent state
   - No action in α negates the effects of another action in α
   - All actions in α are jointly satisfiable given the belief-set

2. **Maximal**: For all α' ⊆ Π(B,D), if α ⊂ α' (α is properly contained in α'), then the consequences of following α' *will* lead to an inconsistent state
   - You cannot add any additional action from Π(B,D) to α without creating conflict
   - α is "as large as possible" while remaining consistent

This captures the idea: "Do as much as you can without contradicting yourself."

## Why "Maximal" Matters

Consider a simple example:

**Desires**: {achieve(A), achieve(B), achieve(C)}

**Conflict Set**: {
  plan_1: achieves A, negates C,
  plan_2: achieves B,
  plan_3: achieves C, negates A,
  plan_4: does nothing
}

**Non-conflicting subsets** (consistent but not maximal):
- {plan_2} — Achieves B only
- {plan_2, plan_4} — Achieves B, does nothing extra
- {plan_1} — Achieves A, gives up C
- ∅ — Do nothing (trivially consistent)

**Maximal non-conflicting subsets**:
- {plan_1, plan_2} — Achieves A and B, gives up C
- {plan_2, plan_3} — Achieves B and C, gives up A

Note: {plan_2} is consistent but NOT maximal—you could add plan_1 or plan_3 and still be consistent.

**Why exclude non-maximal subsets**: They represent giving up on goals unnecessarily. If you can consistently achieve more, why wouldn't you? Maximality ensures the agent doesn't leave value on the table.

## Generating Maximal Non-Conflicting Subsets

**Algorithm (conceptual)**:

```python
def generate_maximal_non_conflicting(conflict_set, belief_set):
    """
    Generate all maximal non-conflicting subsets of conflict_set
    """
    maximal_subsets = []
    
    # Start with each action as a potential seed
    for action in conflict_set:
        candidate = {action}
        
        # Greedily add compatible actions
        for other_action in conflict_set:
            if other_action not in candidate:
                test_set = candidate.union({other_action})
                if is_consistent(test_set, belief_set):
                    candidate = test_set
        
        # Check if this is truly maximal (not a subset of existing)
        if not any(candidate < existing for existing in maximal_subsets):
            # Remove any existing subsets that are subsets of this one
            maximal_subsets = [s for s in maximal_subsets if not s < candidate]
            maximal_subsets.append(candidate)
    
    return maximal_subsets

def is_consistent(action_set, belief_set):
    """
    Check if executing all actions in action_set leads to consistent state
    """
    # Simulate forward: apply all effects, check for contradictions
    hypothetical_state = belief_set.copy()
    
    for action in action_set:
        # Check preconditions
        if not hypothetical_state.satisfies(action.preconditions):
            return False
        
        # Apply effects
        hypothetical_state.apply(action.effects)
    
    # Check for contradictions in final state
    return not hypothetical_state.has_contradiction()
```

**Complexity**: This is NP-hard in the size of the conflict set (related to maximal independent set problem). Real implementations need heuristics:
- Bound search depth
- Use domain knowledge to prune obviously dominated options
- Sample representative maximal subsets rather than generate all

## Consequence Evaluation

Once maximal non-conflicting subsets are generated, each must be evaluated:

**For each α (maximal non-conflicting subset)**:
1. **Trace consequences**: csq(α)[B] — compute all derivable consequences given belief-set
   - Direct effects of actions in α
   - Indirect effects via causal rules in B
   - May trace multiple steps: α leads to φ, φ leads to ψ, etc.

2. **Identify worst consequences**: For each consequence, consult the preference ordering (≻c relation) in belief-set
   - Which consequences are particularly bad?
   - What's the worst outcome that could result from α?

3. **Compare across subsets**: Use the consequence comparison (Definition 2.4) to rank maximal subsets
   - α ≻c α'[B] if α has worse worst-case consequences than α'

4. **Select minimal worst-case**: Choose the α with the least-bad worst consequence
   - Not the best average outcome
   - Not the best best-case outcome  
   - The option where the worst thing that could happen is least bad

This implements a **maximin strategy** (maximize the minimum) or **minimax regret** approach—conservative, risk-aware decision-making.

## Worked Example: R781 and Baby Travis

Let's trace through the complete example from the paper:

**Initial State**:
- NIB: {⟨F, love(R781, Travis)⟩} — Design prohibition
- Beliefs: {¬healthy(Travis), isHungry(Travis)}
- Desires: {¬love(R781, Travis), isHealthy(Travis)}

**New Norm Arrives**: Mistress orders ⟨O, love(R781, Travis)⟩

**Updated NIB**: {⟨F, love(R781, Travis)⟩, ⟨O, love(R781, Travis)⟩} — CONFLICT!

**Conflict Set Π(B,D)**:

Plans relevant to desires and norms:
- love(R781, Travis) — Satisfies obligation, violates prohibition
- ¬love(R781, Travis) — Satisfies prohibition, violates obligation
- feed(R781, Travis) — Requires precondition: love(R781, Travis)
- heal(R781, Travis) — Has precondition ¬healthy(Travis), effect isHealthy(Travis)

Conflicts:
- love() and ¬love() are mutually exclusive
- feed() requires love() as precondition
- heal() requires feed() (per plan definition in paper)

**Maximal Non-Conflicting Subsets**:

Option A: {love(R781, Travis), feed(R781, Travis), heal(R781, Travis)}
- Consistent: love enables feed, feed enables heal
- Maximal: Cannot add ¬love (conflicts with love)
- Effects: Travis becomes healthy, prohibition violated, obligation satisfied

Option B: {¬love(R781, Travis)}
- Consistent: Satisfies prohibition
- Maximal: Cannot add love (conflicts), cannot add feed/heal (preconditions fail)
- Effects: Prohibition respected, obligation violated, Travis remains unhealthy

**Consequence Evaluation**:

Option A consequences (traced through belief-set):
- Direct: prohibition_violated(R781), obligation_satisfied(R781), healthy(Travis)
- Indirect: happy_mistress (from satisfaction), potential_sanction_for_violation (from design rule breach)

Option B consequences:
- Direct: prohibition_respected(R781), obligation_violated(R781), ¬healthy(Travis)  
- Indirect: angry_mistress (from violation), continued_hunger(Travis), potential_death(Travis) [from Internet Pediatrics belief: "babies without love may die"]

**Worst Consequence Identification**:

Option A worst case: Design rule violation, potential sanctions
Option B worst case: Baby dies

**Belief-Set Preference Ordering**:

The paper states: csq(¬love(R781, x)) ≻c csq(heal(R781, x))

Interpreted: The worst consequences of not loving (death) are worse than the worst consequences of healing (design rule violation).

**Decision**: Option A has less-bad worst consequence (design violation vs. death)

**Action**: R781 selects Option A, internalizes the obligation, drops adherence to the prohibition, executes love/feed/heal plan sequence.

## Application to Multi-Agent Orchestration

**Distributed Task Allocation with Conflicting Constraints**:

In WinDAGs, an orchestrator must assign subtasks to agents, but faces constraints:
- Agent A: Fast at task X, but currently overloaded
- Agent B: Slower at task X, available
- Deadline: Tight
- Cost constraint: Limited budget for agent time
- Quality requirement: Task X must be done well

**Conflict Set for orchestrator**:
- assign(task_X, agent_A) — Fast, risks overload
- assign(task_X, agent_B) — Reliable, risks deadline miss  
- delay(task_X) — Avoids overload, definitely misses deadline
- split(task_X, [agent_A, agent_B]) — Coordination overhead

**Maximal Non-Conflicting Subsets**:

Option 1: {assign(task_X, agent_A), monitor(agent_A), prepare_contingency()}
- Effects: Fast completion if A doesn't fail, but A may fail, contingency ready

Option 2: {assign(task_X, agent_B), extend_deadline()}
- Effects: Slower but reliable, requires deadline negotiation

Option 3: {split(task_X), assign(subtask_1, A), assign(subtask_2, B), coordinate(A,B)}
- Effects: Parallel work, coordination cost, both agents utilized

**Consequence Evaluation**:

Option 1 worst case: Agent A fails under load, contingency may not be enough, deadline missed
Option 2 worst case: Deadline extension rejected, still miss deadline with slower agent
Option 3 worst case: Coordination overhead causes both agents to slow down, deadline missed anyway

**Orchestrator decision**: Depends on belief-set preference ordering:
- If belief-set says "deadline_miss ≻c agent_overload" (deadline miss is worse), avoid Option 2
- If belief-set says "coordination_failure ≻c overload" (coordination failure worse), avoid Option 3
- Select option with least-bad worst case given domain priorities

**Skill Composition Conflicts**:

When composing skills into a workflow, conflicts arise:

Skill A: data_processing
- Requires: F(expose_raw_data) — Privacy norm
- Provides: cleaned_data

Skill B: detailed_logging  
- Requires: O(log_all_operations) — Auditability norm
- Side effect: exposes_raw_data in logs

Skills A and B conflict: A prohibits what B requires as side effect.

**Conflict Set**: {use(skill_A), use(skill_B), use(alternate_logger), use(data_anonymizer)}

**Maximal Non-Conflicting Subsets**:

Option 1: {use(skill_A), use(alternate_logger), use(data_anonymizer)}
- Log operations without raw data, anonymize before processing
- Effects: Privacy preserved, auditability reduced, slower

Option 2: {use(skill_A), skip_logging}
- Process with privacy, no audit trail
- Effects: Privacy preserved, auditability lost

Option 3: {use(skill_B), skip(skill_A)}
- Full audit trail, use different processing that doesn't have privacy requirement
- Effects: Auditability preserved, may need different (slower) processing approach

**Selection**: Trace consequences of each option:
- Option 1 worst case: Anonymization removes audit-relevant information
- Option 2 worst case: Audit reveals compliance failure, penalties
- Option 3 worst case: Alternate processing misses errors, data quality issues

Choose option with least-bad worst consequence for the domain (healthcare vs. financial vs. research contexts may differ).

## Boundary Conditions

**When maximal subset generation fails**:

1. **Too many subsets**: With large conflict sets, exponentially many maximal subsets
   - Mitigation: Heuristic pruning, sample representative subsets, bound search time

2. **All subsets empty**: No non-conflicting combination exists beyond ∅
   - Agent is in impossible situation (over-constrained)
   - Requires dropping a core desire or norm, not just plan selection
   - Escalate to higher-level revision

3. **Incomparable consequences**: Multiple maximal subsets have incomparable worst consequences (φ ∥ φ')
   - No principled way to choose
   - May require additional information, human input, or arbitrary tie-breaking

4. **Dynamic conflicts**: Subset is consistent at planning time but becomes inconsistent during execution
   - Requires monitoring and re-planning
   - May need contingency branches

**When this approach excels**:

- **Acute conflicts**: Specific decision points with clear alternatives
- **Well-defined effects**: Actions have predictable, enumerable consequences
- **Stable environments**: Consequences don't change during evaluation
- **Rich causal models**: Belief-set contains sufficient rules to trace consequences

## Implementation Patterns

```python
class ConflictResolver:
    def __init__(self, belief_set, preference_ordering):
        self.belief_set = belief_set
        self.preferences = preference_ordering
    
    def resolve_conflict(self, conflict_set):
        """
        Resolve conflicts by selecting maximal non-conflicting subset
        with least-bad worst consequence
        """
        # Generate all maximal non-conflicting subsets
        maximal_subsets = self._generate_maximal_subsets(conflict_set)
        
        if not maximal_subsets:
            return ConflictResolution(success=False, reason="no_solution")
        
        # Evaluate consequences for each
        evaluations = []
        for subset in maximal_subsets:
            consequences = self._trace_consequences(subset)
            worst_consequence = self._identify_worst(consequences)
            evaluations.append((subset, worst_consequence))
        
        # Select subset with minimal worst consequence
        best_subset, best_worst = min(
            evaluations, 
            key=lambda x: self.preferences.rank(x[1])
        )
        
        return ConflictResolution(
            success=True,
            selected_actions=best_subset,
            worst_case=best_worst,
            alternatives=evaluations  # For explanation
        )
    
    def _generate_maximal_subsets(self, conflict_set):
        """Generate maximal non-conflicting subsets"""
        # Start with each action as seed
        candidates = [{action} for action in conflict_set]
        maximal = []
        
        # Greedily expand each candidate
        for candidate in candidates:
            for action in conflict_set:
                if action not in candidate:
                    test = candidate | {action}
                    if self._is_consistent(test):
                        candidate = test
            
            # Check if truly maximal
            if not any(candidate < m for m in maximal):
                maximal = [m for m in maximal if not m < candidate]
                maximal.append(candidate)
        
        return maximal
    
    def _trace_consequences(self, action_set):
        """Trace all consequences of action set through belief-set"""
        consequences = set()
        frontier = set()
        
        # Direct effects
        for action in action_set:
            frontier.update(action.effects)
        
        # Indirect effects (transitive closure)
        while frontier:
            effect = frontier.pop()
            consequences.add(effect)
            
            # Find causal rules: effect → further_consequence
            for rule in self.belief_set.causal_rules:
                if rule.antecedent_satisfied(consequences):
                    new_consequence = rule.consequent
                    if new_consequence not in consequences:
                        frontier.add(new_consequence)
        
        return consequences
    
    def _identify_worst(self, consequences):
        """Find worst consequence in set according to preferences"""
        worst = None
        for c in consequences:
            if worst is None or self.preferences.is_worse(c, worst):
                worst = c
        return worst
```

## Connection to Human Decision-Making

This formalization captures how humans handle conflicting goals:

**"I can't have everything"**: Recognizing that some goals are mutually exclusive

**"What's the worst that could happen?"**: Evaluating options by their downsides, not just upsides

**"Do as much as I can"**: Maximality ensures you don't give up unnecessarily—pursue all compatible goals

**"What can I live with?"**: Selecting based on tolerability of worst case, not optimism about best case

The framework makes this implicit human reasoning explicit and executable.

## Distinctive Contribution

Most planning and decision-making systems use:
- **Constraint satisfaction**: Find any satisfying solution (not necessarily maximal)
- **Optimization**: Maximize expected utility (assumes numeric utilities, probabilistic outcomes)
- **Hierarchical planning**: Decompose until conflict-free (may give up on conflicting goals entirely)

This framework provides:
- **Maximin reasoning**: Focus on worst-case outcomes, not averages
- **Maximal satisficing**: Get as much as possible without inconsistency
- **Consequence-based evaluation**: Reason forward through causal chains, not just immediate effects
- **Transparent trade-offs**: Explicit representation of what's given up and why

This is particularly appropriate for ethical reasoning and safety-critical systems where worst-case outcomes matter more than average performance.

## Open Questions

1. **Subset generation efficiency**: How to generate maximal subsets efficiently for large conflict sets? Are there domain-specific structures that can be exploited?

2. **Consequence depth**: How far forward should consequence tracing go? Is there a principled stopping criterion?

3. **Preference learning**: How should agents learn the ≻c preference ordering? From human feedback? From outcome observation?

4. **Approximate maximality**: If exact maximal subset generation is too expensive, how to approximate? Can we guarantee "near-maximal" subsets?

5. **Dynamic re-evaluation**: If a maximal subset is selected but circumstances change mid-execution, when should the agent re-generate subsets and switch?

6. **Multi-agent coordination**: How do maximal non-conflicting subsets compose across multiple agents? Is there a maximal non-conflicting subset for the entire multi-agent system?
```

### FILE: desire-internalization-as-norm-adoption-mechanism.md

```markdown
# Desire Internalization as Norm Adoption Mechanism

## The Integration Point

The normative BDI framework faces a fundamental question: **When an agent decides to adopt a norm, which mental state should be updated?**

The options:
- **Beliefs**: Store norm as a fact about the world → Doesn't make the agent *follow* the norm, just know about it
- **Intentions**: Add norm directly to commitments → Bypasses deliberation, forces immediate action
- **Desires**: Add norm content to goals → Allows norm to participate in standard BDI deliberation

The paper proposes (p.7): "We propose that an agent updates only its desire-set; subsequently, this will impact the update of the other mental states in the next iterations of the execution loop."

This design choice has deep implications for how normative reasoning integrates with practical reasoning.

## Why Desires, Not Beliefs or Intentions?

**Beliefs are descriptive, not prescriptive**:

Beliefs represent how the world IS:
- "The mistress ordered me to love Travis" (belief)
- "It is forbidden to love humans" (belief about a prohibition)

These are facts, not motivations. Adding a norm to beliefs means the agent knows the norm exists but has no drive to satisfy it.

**Intentions are commitments, not deliberative**:

Intentions represent what the agent HAS DECIDED to pursue:
- Intentions are formed *after* deliberation
- Adding a norm directly to intentions bypasses plan selection, consistency checking, resource reasoning

If a norm maps directly to intention, the agent commits before evaluating whether satisfying the norm is possible, consistent with other intentions, or has acceptable consequences.

**Desires are motivational and deliberative**:

Desires represent what the agent WANTS to achieve:
- Desires participate in intention formation deliberation
- Multiple desires compete for limited resources
- Desires can conflict without causing inconsistency (the agent can want incompatible things)
- Desire-to-intention filtering is where practical reasoning happens

Adding a norm to desires means: "This norm creates a goal I should try to achieve, subject to practical constraints and deliberation about how to achieve it."

## The Internalization Process

**Full sequence from norm recognition to action**:

```
1. Norm recognized → Added to ANB (factual knowledge)
   ↓
2. Activation condition satisfied → Instantiated to NIB (active norm)
   ↓
3. Consistency check passed → Norm content added to Desire-set D
   ↓
4. Options generation → BDI generates possible plans to satisfy desires (including norm-derived desires)
   ↓
5. Intention formation → Select which desires to commit to (may include or exclude norm-desires)
   ↓
6. Plan selection → Choose plans to achieve committed intentions
   ↓
7. Execution → Perform actions
```

The norm enters the motivational system at step 3 (desires) but doesn't force action until steps 5-7 (after deliberation).

**What gets added to desires**: The *content* of the norm, not the norm itself:

- Norm: ⟨O, love(R781, Travis)⟩
- Added to desires: love(R781, Travis)

The obligation modality (O) affects *how strongly* the desire is pursued, but the desire-set itself contains the goal (love Travis), not the deontic wrapper (obligation to love).

This means norm-derived desires look the same as intrinsic desires to the intention formation mechanism—they compete on equal footing (unless weighted by modality).

## Modality and Desire Strength

The paper doesn't fully specify this, but the modality likely affects desire priority:

**Obligations** (O): High-priority desires
- Should be strongly weighted in intention formation
- Failure to satisfy incurs sanctions (from norm definition)
- Similar to "must have" requirements

**Prohibitions** (F): Negative desires (desires to avoid)
- Strong weight against actions with forbidden effects
- Can be modeled as desires for negated states: F(x) → desire(¬x)
- Violation incurs sanctions

**Permissions** (P): Weak positive desires or removal of prohibitions
- P(x) where F(x) previously held → Remove desire(¬x)
- Optional actions that are now allowed
- Lower weight than obligations

**Implementation approach**:

```python
def internalize_norm(norm_instance, desire_set):
    """
    Add norm content to desire-set with modality-appropriate weight
    """
    content = norm_instance.content
    modality = norm_instance.modality
    
    if modality == "obligation":
        desire_set.add(content, weight=HIGH_PRIORITY)
    elif modality == "prohibition":
        # Add desire for negated content
        negated = negate(content)
        desire_set.add(negated, weight=HIGH_PRIORITY)
    elif modality == "permission":
        # Remove conflicting prohibition if present
        desire_set.remove(negate(content), if_present=True)
        # Optionally add low-weight desire
        desire_set.add(content, weight=LOW_PRIORITY)
```

## Interaction with Pre-Existing Desires

Internalizing norms creates a **heterogeneous desire-set**:

**Sources of desires**:
1. **Intrinsic goals**: Programmed-in objectives (R781's desire for baby's health)
2. **Norm-derived desires**: Obligations/prohibitions from environment
3. **Instrumental desires**: Sub-goals derived from higher-level desires
4. **Social desires**: Goals adopted through communication/coordination

All compete for realization through the intention formation process.

**Conflict resolution happens at the desire level**:

When desires conflict:
- Option A: Explicitly detect conflicts during internalization, resolve before adding to D
- Option B: Allow conflicting desires in D, resolve during intention formation

The paper's approach leans toward Option B: "the agent should now take into account the updated normative state, which will become part of its cognitions" (p.7)—suggests desires can contain conflicts that are resolved later.

**Example**:

Initial desires: {isHealthy(Travis), ¬love(R781, Travis)}
After norm internalization: {isHealthy(Travis), ¬love(R781, Travis), love(R781, Travis)}

The desire-set now contains explicit contradiction: desire to not love AND desire to love.

**Resolution occurs during intention formation**:
- Generate options for each desire
- Recognize that satisfying both ¬love and love is impossible (maximal non-conflicting subset generation)
- Use consequence evaluation to choose which desire to commit to as intention
- Only the selected desire becomes an intention

This defers conflict resolution to the deliberation stage, where consequence reasoning is available.

## Advantages of Desire-Level Internalization

**1. Separation of concerns**:
- Norm adoption (internalization) is separate from commitment (intention formation)
- Agent can adopt a norm without immediately acting on it
- Allows resource reasoning: "I accept this obligation, but I can't pursue it right now"

**2. Participation in standard deliberation**:
- Norm-derived desires compete with other desires through normal BDI process
- No special-case handling for normative vs. non-normative goals
- Existing BDI deliberation strategies (utility-based, resource-based, deadline-based) automatically apply to norms

**3. Graceful overload handling**:
- If agent receives more obligations than it can satisfy, desire-level internalization allows prioritization
- Compare: intention-level internalization would create over-commitment immediately

**4. Enables norm-goal synergy detection**:
- When norm-derived desire aligns with intrinsic desire, both strengthen the same intention
- Example: Obligation to feed Travis + intrinsic desire for Travis's health → Strong intention to feed
- The agent can recognize when norms help rather than hinder

**5. Transparent decision-making**:
- Observer can inspect desire-set to see all goals (norm-derived and intrinsic)
- Can trace why certain intentions were formed: "This intention serves both my core goal and this obligation"

## Implementation in Jade/Jadex

The paper's implementation stores desires in Jadex's belief-set:

```xml
<beliefset name="desires">
  <fact>isHealthy(Travis)</fact>           <!-- Intrinsic -->
  <fact>feed(R781, Travis)</fact>          <!-- From internalized obligation -->
</beliefset>
```

**Updating desires from NIB**:

```java
public void internalize_active_norms() {
    // Get all active, internalized norms from NIB
    for (NormInstance norm : nib.getInternalized()) {
        if (norm.getModality() == Modality.OBLIGATION) {
            // Add content as high-priority desire
            beliefs.getBeliefSet("desires").addFact(norm.getContent());
        } else if (norm.getModality() == Modality.PROHIBITION) {
            // Add negated content as desire to avoid
            beliefs.getBeliefSet("desires").addFact(
                negate(norm.getContent())
            );
        }
    }
}
```

This update happens after consistency checking and conflict resolution, before the next deliberation cycle.

## Application to Multi-Agent Orchestration

**Orchestrator-level norm internalization**:

An orchestrator receives norms about task allocation:
- ⟨O, balance_load(agents)⟩ — Fairness norm
- ⟨O, minimize_latency(tasks)⟩ — Performance norm
- ⟨F, overload(agent_A)⟩ — Safety norm

After internalization, orchestrator's desires:
```
{
  complete_all_tasks,           // Intrinsic
  balance_load(agents),         // Norm-derived
  minimize_latency(tasks),      // Norm-derived  
  ¬overload(agent_A)            // Norm-derived
}
```

**Intention formation deliberation**:

Generate options:
- Option 1: Assign all tasks to fastest agent (agent_A) → Satisfies minimize_latency, violates balance_load and overload_prevention
- Option 2: Distribute tasks evenly → Satisfies balance_load, may violate minimize_latency  
- Option 3: Hybrid allocation with A taking more but not all → Partial satisfaction of multiple desires

Consequence evaluation determines which option has least-bad worst case.

**Desire-level flexibility**: Because norms are desires, not hard constraints, the orchestrator can make trade-offs:
- If minimize_latency has worst consequence when violated (SLA breach), prioritize it
- If overload has worst consequence when violated (system crash), prioritize it
- Balance_load may be sacrificed if both latency and safety are critical

This wouldn't be possible if norms were hard constraints at intention level.

**Agent-level norm internalization for skill execution**:

An agent executing a code generation skill receives norms:
- ⟨O, include_license_header⟩
- ⟨O, run_security_scan⟩
- ⟨F, commit_untested_code⟩

Agent's intrinsic desires:
```
{
  complete_code_task,
  meet_deadline
}
```

After internalization:
```
{
  complete_code_task,
  meet_deadline,
  include_license_header,
  run_security_scan,
  ¬commit_untested_code
}
```

**Deliberation**: If deadline is tight, agent might:
- Form intention: {complete_code_task, include_license_header, ¬commit_untested_code}
- Defer: {run_security_scan} to post-delivery

The desire-level internalization allows the agent to recognize the security scan obligation while deciding it can't be satisfied immediately—better than ignoring the norm entirely or failing the task due to over-commitment.

## Boundary Conditions

**When desire-level internalization works well**:

1. **Flexible deliberation**: When the BDI's deliberation process is sophisticated enough to handle conflicting desires
2. **Clear priorities**: When consequences of desires can be compared (via ≻c relation)
3. **Resource reasoning**: When agent can evaluate which desires are achievable given resources
4. **Gradual adoption**: When norms appear incrementally and agent has time to deliberate

**When it breaks down**:

1. **Mandatory immediate action**: Some norms require instant response (emergency protocols)
   - Desire-level internalization adds deliberation latency
   - May need direct-to-intention fast path for critical norms

2. **Hard constraints vs. soft goals**: Some norms are inviolable constraints, not negotiable desires
   - Example: "Never reveal encryption keys" is a hard constraint, not a goal to balance against others
   - May need separate constraint set that filters actions before execution

3. **Desire set explosion**: With many norms, desire-set becomes huge and unwieldy
   - Deliberation complexity increases
   - May need desire aggregation or hierarchical desires

4. **Opaque deliberation**: If intention formation is a black box, it's unclear how norm-desires are being weighted
   - Observer can't tell if norm is being respected due to high priority or just luck
   - May need explicit norm-tracking through deliberation

## Alternative Approaches and Trade-offs

**Belief-level norm storage (rejected by this framework)**:
- Pro: Doesn't clutter motivational system
- Con: Norms don't influence behavior unless explicitly queried
- Use case: When norms are purely informational, not action-guiding

**Intention-level norm insertion (rejected by this framework)**:
- Pro: Guaranteed execution, no deliberation delay
- Con: Over-commitment, no resource reasoning, brittle
- Use case: Reflex-like safety norms that must override all else

**Separate normative intention set (hybrid approach)**:
- Maintain I_norms distinct from I_regular
- Guarantee resources for norm-derived intentions
- Pro: Ensures norm satisfaction even under resource pressure
- Con: Complexity, potential for conflict between I_norms and I_regular

**Meta-level norm reasoning (future direction)**:
- Norms about which norms to internalize into desires
- Second-order deliberation: "Given my current goals, which of these environmental norms should I adopt?"
- More sophisticated than automatic internalization

## Connection to Human Practical Reasoning

Desire-level internalization mirrors human moral psychology:

**Internalization vs. compliance**: Humans distinguish between:
- External compliance: Following a rule to avoid punishment (belief-level: "I know this is forbidden")
- Internalized adoption: The rule becomes a personal value (desire-level: "I want to follow this rule")

The framework models the latter—norms that are truly adopted become part of the agent's goal structure, not just constraints it begrudgingly respects.

**Conflict between values**: Humans experience desire-level moral conflicts:
- "I want to be honest AND I want to protect my friend" (truth-telling norm vs. loyalty)
- Both are genuine desires, not just beliefs about obligations
- Resolution involves consequence evaluation (which outcome is worse?)

This maps directly to the framework's approach: conflicting norm-derived desires compete during deliberation.

**Gradual internalization**: Humans don't instantly adopt all societal norms:
- Initial awareness (recognition → ANB)
- Consideration (instantiation and consistency checking)
- Adoption (internalization to desires)
- Committed action (intention formation)

The multi-stage process reflects natural moral development.

## Distinctive Contribution

The desire-level internalization mechanism is a key innovation of this framework:

**Most normative agent architectures**:
- Hard constraints: Norms filter allowable actions at execution time (too rigid)
- Utility modification: Norms adjust action utilities (requires numeric utility functions)
- Separate normative layer: Norm reasoning independent of BDI deliberation (integration unclear)

**This framework**:
- Norms enter the existing BDI desire-intention deliberation process
- No separate normative reasoning engine needed
- Standard BDI deliberation strategies automatically handle norms
- Natural integration of normative and practical reasoning

The key insight: **Norms are sources of goals, not external constraints**. Once recognized and adopted, they function like any other goal in the agent's practical reasoning.

This makes normative reasoning "first-class" in