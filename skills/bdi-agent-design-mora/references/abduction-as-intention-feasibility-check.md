# Abduction as Intention Feasibility Check: How Rational Agents Avoid Impossible Commitments

## The Rationality Constraint: Intending the Possible

A core principle of rational agency is that agents shouldn't commit to goals they believe are impossible to achieve. As Móra et al. state in their non-triviality condition: "an agent should not intend something it believes is already satisfied or that will be satisfied with no efforts by the agent" (p. 18). More fundamentally, condition 5 in Definition 4 requires: "¬∃(P' ∪ Δ ⊨ ⊥)" where P' includes beliefs and temporal axioms, meaning the agent must believe there exists a course of actions consistent with achieving the intended state.

This raises an implementation question: How does an agent *check* if a goal is achievable before committing? In real environments, you can't exhaustively verify reachability—the state space is too large, actions have uncertain effects, and the environment changes. But you need *some* feasibility check or the agent commits to fantasy goals.

The paper's answer: Use abductive reasoning to hypothesize a course of actions that would satisfy the goal. If abduction succeeds (finds a consistent explanation), the goal is provisionally feasible. If it fails (no consistent explanation exists), the goal is currently impossible given beliefs.

## Abduction in Extended Logic Programming

The authors define abduction formally: "Abductive reasoning consists of, given a theory T and a set of observations O, to find a theory Δ such that T ∪ Δ ⊨ O and T ∪ Δ is consistent" (p. 14). In the ELP context, an abductive framework is "P' is a tuple ⟨P, Abd, IC⟩, where P is an extended logic program, Abd is the set of abducible literals and IC is the set of integrity constraints. An observation O has an abductive explanation Δ iff P' ∪ Δ ⊨ O and P ⊨ Δ" (p. 14).

Translation for agent architectures: Given a goal G (the observation to explain), the agent's beliefs and action models (the theory P), and integrity constraints (including already-adopted intentions), find a set of hypothesized action occurrences Δ (from the abducible predicates) such that executing those actions would achieve G without contradiction.

The abducible predicates in this model are: "Abd = {happens(E, Ti, Tf), act(E, Act)}" (from Definition 10, p. 21). These represent hypothetical events: "happens(e1, 0, 5)" means "suppose event e1 occurs from time 0 to 5", and "act(e1, move_to(loc2))" means "e1 is an execution of the move_to(loc2) action."

The integrity constraints IC include:
1. **Intention constraints**: For each existing intention int_that(I, Ag, P, A), there's a constraint "holds_at(bel(Ag, P), T) ←" requiring P hold at time T
2. **Desire constraints**: For each candidate desire, "holds_at(bel(Ag, P), T) ← not unsel(D)" requiring P hold if desire D is selected (not unselected)
3. **Event coherence**: Events must have associated actions, valid time intervals, no duplicate occurrences (see EC constraints, p. 15-16)

Abduction searches for values of abducible literals that satisfy all constraints. If it succeeds, Δ is a "plan sketch"—a hypothetical sequence of actions that would achieve the goal.

## Abduction vs. Planning: The Crucial Difference

It's critical to understand: This is NOT full planning. The paper uses abduction for *feasibility checking*, not plan execution. The difference:

**Planning** produces a detailed, executable sequence of actions with preconditions verified, resources allocated, and contingencies handled. Planning is expensive—you explore a search space of action sequences, prune infeasible branches, and optimize over multiple criteria.

**Abduction** produces a hypothetical explanation: "If these actions were to occur in this order, the goal would be achieved." It doesn't verify executability, acquire resources, or handle execution failures. It's a consistency check: "Is there a conceivable path to this goal given what I believe?"

The authors are explicit about this role: "In order to know if a given property P holds at time T, the EC checks what properties remain valid after the execution of the actions that happened before T. We are now ready to define the agent's model" (p. 16, emphasis added). The Event Calculus allows reasoning about hypothetical action consequences, not actual execution.

This separation is architecturally important. During deliberation (selecting intentions), the agent needs to quickly evaluate many candidate goal sets. Expensive planning for each candidate would make deliberation intractable. Abductive feasibility checking is cheaper—it asks "is there any explanation?" not "what is the best plan?"

Once intentions are adopted, *then* the agent invokes full planning: "Once the agent adopts its intentions, it will start planning to achieve those intentions" (p. 22). Planning elaborates the abstract action hypotheses from abduction into executable plans with resource allocation, contingencies, etc.

## How Abduction Works in the Candidate Desires Selection

Definition 10 (Candidate Desires Set) shows abduction in action. The agent has a set D' of eligible desires. For each subset R ⊆ D', it attempts to find a revision (minimal change to revisable literals) such that:

1. **All desires in R are satisfied**: For each des(D, Ag, P, A) in R, the constraint "holds_at(bel(Ag, P), T) ← not unsel(D)" must hold
2. **Existing intentions remain satisfied**: Constraints IC(I) from current intentions must hold
3. **The program is consistent**: P' ∪ Δ ⊭ ⊥ (no contradiction)

The revision mechanism searches over values for literals in Abd (actions to abduce) and "unsel(D)" literals (desires to unselect). At the bottom level of the preference graph, "Rev(bottom) = {happens(E, Ti, Tf), act(E, A)}" (Definition 9, p. 20)—try to find actions satisfying all eligible desires.

If revision succeeds without changing any unsel(D) literals (they all remain false), all eligible desires are jointly achievable—there exists an abduced action sequence Δ satisfying them all. That's a candidate desires set.

If revision requires some unsel(D) to become true, those desires must be dropped to restore consistency. The preference graph guides which to drop: less important ones first, fewer if possible. Multiple revisions might exist (multiple candidate sets), each with a different subset of desires satisfied.

## Example: Warehouse Robot Feasibility Checking

Consider the warehouse robot example (Example 5, continued in 13, 16). Initially it has desires:
- des(d1, rbt, stored(a), [0.5]) — store object a
- No battery desire yet (precondition "low battery" not believed)

Eligible desires: {des(d1, ...)}. Abduction attempts: Find Δ such that holds_at(bel(rbt, stored(a)), T) given beliefs that initiates(E, Tf, bel(rbt, stored(O))) ← happens(E, Ti, Tf), act(E, store(O)).

Solution: Δ = {happens(e1, now, now+5), act(e1, store(a))}. If event e1 (a store(a) action) happens, stored(a) will hold. No contradiction—feasible. The desire is adopted as primary intention: I_P = {int_that(i1, rbt, bel(rbt, stored(a)), [0.5])}.

Later, a sense_low_bat event occurs. This makes the battery desire eligible:
- des(d2, rbt, bat_charged, [0.9])

Now eligible desires: {d1 (still not completed), d2 (newly eligible)}. Abduction attempts to find Δ satisfying both. But beliefs include:
- initiates(E, Tf, bel(rbt, bat_charged)) ← happens(E, Ti, Tf), act(E, charge)
- initiates(E, Tf, bel(rbt, stored(a))) ← happens(E, Ti, Tf), act(E, store(a))

And from EC axioms plus typical action models, charge requires being at base, store requires being at storage location—these are mutually exclusive at the same time. Moreover, the robot has limited battery, so it can't store *then* charge—it would run out of power.

Abduction at bottom level fails (cannot satisfy both). Revision must unselect one desire. The preference graph has:
- Rev(bottom) = {happens, act} — try all desires
- Rev(level1) = {unsel(d1)} ∪ Rev(bottom) — drop d1 (importance 0.5)
- Rev(level2) = {unsel(d2)} ∪ Rev(bottom) — drop d2 (importance 0.9)

Prefer revisions with fewer unsel changes first, less important desires first. Revision at level1 succeeds: unsel(d1) = true drops the storage desire, Δ = {happens(e2, t1, t2), act(e2, charge)} satisfies battery desire. Candidate set: {d2}.

The agent adopts int_that(i2, rbt, bat_charged, [0.9]), dropping the storage intention. Example 16 shows the robot now charges instead of storing.

This is abduction performing feasibility+prioritization: "Can I achieve both? No. Can I achieve the more important one? Yes, by abducing the charge action."

## Boundary Conditions: When Abduction Is Insufficient

Abduction-based feasibility checking has several limitations:

**1. Completeness of Action Models**: Abduction relies on initiates/terminates axioms in the Event Calculus. If action effects are incompletely specified, abduction may spuriously succeed (abduce an action whose negative side effects aren't modeled) or fail (not find achievable goals because enabling actions aren't in the model).

The authors assume: "The EC allows us to reason about the future, by hypothetically assuming a sequence of actions represented by happens= and act= predicates and verifying which properties would hold" (p. 16). This requires comprehensive action models—a significant knowledge engineering burden in open domains.

**2. Resource and Timing Abstraction**: The simple EC formulation doesn't model resource consumption, continuous quantities, or complex temporal constraints. An abduced action sequence might be infeasible due to resource limits (not enough fuel, memory, etc.) or timing (action A takes so long that deadline for B is missed).

Handling this requires richer models. Some options:
- Extend EC with resource fluents (consumable quantities)
- Add explicit time arithmetic constraints
- Perform abduction, then validate the sketch with a resource-aware planner

**3. Probabilistic and Uncertain Effects**: Abduction in ELP is purely logical—actions deterministically initiate/terminate properties. Real actions have uncertain effects. Abduction says "if this action occurs, the goal will hold" but doesn't handle "this action has 70% success probability."

Combining abduction with probabilistic reasoning (Bayesian networks, Markov models) is an open research problem. One approach: Abduce a plan sketch, then evaluate its probability using a probabilistic model.

**4. Scalability**: Abduction is a search problem. In the worst case, it's intractable (depending on theory structure). The ELP framework provides optimization, but for large action spaces or deeply nested goals, abduction may be too slow for online deliberation.

Mitigations:
- Restrict abducibles (only certain actions are abducible)
- Use heuristics to guide search (domain-specific abduction strategies)
- Cache abduction results (memoize feasible goal-action mappings)
- Hierarchical abduction (abduce abstract actions, refine later)

**5. Reactive vs. Deliberative Context**: Abduction is appropriate during deliberation (low-frequency, high-deliberation), not reactive response. If a situation demands immediate action (emergency), there's no time for abductive feasibility checking. The agent needs pre-compiled reactive policies.

The paper's architecture assumes a deliberative layer (where abduction happens) and an execution layer (where plans run). Purely reactive agents don't fit this model.

## Application to WinDAG Agent Systems

For orchestration systems with 180+ skills, abduction provides a feasibility check for skill chains:

**Goal**: "Analyze code for security vulnerabilities"  
**Abducibles**: Skill invocations (code_scan, dependency_check, taint_analysis, ...)  
**Beliefs**: Skill preconditions (code_scan requires source code file, taint_analysis requires call graph, ...)  
**Integrity Constraints**: Goals to achieve (vulnerabilities identified), resource limits (time budget, memory), consistency (don't invoke conflicting skills simultaneously)

**Abduction Query**: Find skill invocation sequence that achieves goal while satisfying constraints.

If abduction succeeds, produce a skill chain: [fetch_code → parse → build_call_graph → taint_analysis → vulnerability_report]. If it fails (e.g., source code unavailable, no skill can produce required intermediate artifacts), reject the goal as infeasible.

This prevents the orchestrator from attempting impossible task decompositions. Without feasibility checking, it might assign skills that can't produce the required results, wasting resources and failing opaquely.

Implementation sketch:

```python
class OrchestrationAbduction:
    def __init__(self, skill_registry, belief_base):
        # skill_registry: maps skills to preconditions/effects
        # belief_base: current environment state
        
    def check_goal_feasibility(self, goal, constraints):
        """
        Returns: (feasible: bool, skill_chain: List[Skill] | None)
        """
        abducibles = self._get_candidate_skills(goal)
        
        for skill_sequence in self._generate_sequences(abducibles):
            if self._simulate_execution(skill_sequence, goal, constraints):
                return (True, skill_sequence)
        
        return (False, None)
    
    def _simulate_execution(self, skills, goal, constraints):
        """Event Calculus simulation: would these skills achieve goal?"""
        state = self.belief_base.copy()
        
        for skill in skills:
            # Check preconditions
            if not skill.preconditions_satisfied(state):
                return False
            
            # Apply effects (initiates/terminates)
            state.update(skill.effects())
            
            # Check constraints (time, resources, ...)
            if not constraints.check(state):
                return False
        
        # Goal achieved?
        return goal.satisfied(state)
```

The key: Abduction is cheap hypothesis checking, not full planning. It answers "is this goal feasible in principle?" not "what is the optimal plan?"

## The Deeper Lesson: Rationality Requires Possibility Checking

The broader lesson transcends BDI agents: Rational commitment requires feasibility checking. Before allocating resources to a goal (time, compute, tokens), verify it's achievable. Systems that blindly accept all requests and attempt impossible tasks waste resources and degrade performance.

The challenge: Full planning is too expensive for every potential goal. The solution: Use a lightweight consistency check (abduction, constraint satisfaction, reachability analysis) to filter out obvious impossibilities before investing in detailed planning.

This applies to:
- **Task schedulers**: Check if deadlines are feasible before accepting tasks
- **Query planners**: Verify query is answerable before executing expensive joins
- **Code generators**: Check if specification is implementable before generating (avoid hallucinated APIs)
- **Multi-agent systems**: Verify joint goals are achievable before committing to cooperation

The pattern: Use a weaker, cheaper reasoning method (abduction, SAT solving, graph reachability) as a "gate" before expensive reasoning (planning, execution, learning). Accept only goals that pass the gate.

Móra et al. show that abduction is a natural fit for this gate in BDI architectures: It operates on the same belief/action representation, provides yes/no feasibility answers, and integrates with the revision mechanism for handling conflicts. The specific technique might differ in other architectures, but the principle—check feasibility before commitment—is universal for rational agents.