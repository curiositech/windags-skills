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