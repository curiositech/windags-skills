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