# Failure Modes in Complex Planning Systems: Lessons from SHOP2 Competition Experiences

## The AIPS-2000 Failure: When Incorrect Domain Descriptions Cause Invalid Plans

The most instructive failure in SHOP2's history occurred at the AIPS-2000 planning competition. The paper states it directly: "In the AIPS-2000 planning competition, that problem caused difficulty for SHOP2's predecessor SHOP. The SHOP team was developing domain descriptions for SHOP purely by hand, and made some mistakes in writing two of the domains. Thus SHOP found incorrect solutions for some of the problems in those domains, so the judges disqualified SHOP from those domains" (p. 388).

This failure is particularly interesting because SHOP's planning algorithm was correct—the bug was in the domain description (the HTN methods), not the planner itself.

### What Went Wrong

When you hand-write domain descriptions, you're essentially programming at a very high level. Each HTN method is a procedure specification. If the methods don't accurately represent the domain operators, the planner will generate plans that:
- Are valid according to the methods (satisfy the method preconditions and decomposition structure)
- Are invalid in the actual domain (violate operator preconditions or don't achieve intended effects)

This is a **semantic gap failure**: the planner's model of the world doesn't match the actual world.

Think of it like writing a program where your functions' documentation (the methods) doesn't match their implementation (the operators). The program might execute without errors but produce wrong results.

### The Fix: PDDL-to-SHOP2 Translation

The team's response is revealing: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This establishes a two-phase workflow:

**Phase 1: Automated Translation for Correctness**
- Translate PDDL operators to SHOP2 mechanically
- Resulting domain description is provably correct (matches operators)
- But is inefficient (no domain-specific procedural knowledge)

**Phase 2: Manual Enhancement for Efficiency**
- Add HTN methods encoding standard operating procedures
- Add heuristics for choosing among alternatives
- Add axioms for derived predicates
- Optimize for the domain's structure

This workflow provides a safety net: you start from a correct baseline and enhance it, rather than writing everything from scratch and hoping it's correct.

### The Lesson for Agent Systems

For WinDAG orchestration:

**Validation Gap**: When skills are described declaratively (preconditions, effects) but implemented procedurally (code), there's risk of mismatch. The description says "this skill generates authentication code given a schema" but the implementation might fail to handle edge cases in the schema.

**Solution**: Automated translation from high-level specifications to implementation stubs:
```python
# Generated from specification
def implement_auth(schema: Schema) -> AuthCode:
    """
    Preconditions:
      - schema.has_user_model() == True
      - schema.user_model.has_field('password') == True
    Effects:
      - returns AuthCode with register/login/logout endpoints
      - AuthCode.test_coverage >= 0.8
    """
    # Manual implementation here
    ...
```

The generated stub includes assertions checking preconditions and postconditions. If the implementation violates these, tests catch it immediately.

**Continuous Validation**: Run domain-specific test suites that verify skills match their specifications. SHOP2's PDDL translator is a one-time verification; for agent systems, you need ongoing verification as skills evolve.

## Failure Mode: Premature Commitment in Ordered Decomposition

Ordered task decomposition's strength—planning in execution order—is also a potential weakness: **you might commit to a choice early that turns out to be suboptimal later**.

The paper doesn't explicitly discuss this failure mode, but it's implicit in the algorithm. Consider:

**Scenario**: Transporting two packages P1 and P2
1. SHOP2 decomposes transport(P1) first
2. Reserves truck T1 for P1
3. Then decomposes transport(P2)
4. Reserves truck T2 for P2

But suppose the optimal plan would have been:
- Use T1 for P2 (closer to P2's location)
- Use T2 for P1 (closer to P1's location)

Because SHOP2 committed to P1 first, it didn't consider this globally optimal allocation.

### When Does This Fail?

Premature commitment fails when:
- **Global constraints** that aren't visible locally (resource limits, load balancing)
- **Future interactions** between early and late decisions (one choice makes another choice more expensive)
- **Opportunity costs** (committing resource X to task A prevents better use on task B)

The paper addresses this through:

1. **Sort-by heuristics**: "For SHOP2 to find a good solution and to find it quickly, it is important to decide which set of variable bindings to try first" (p. 386). Good heuristics reduce the chance that the first choice is suboptimal.

2. **Backtracking**: If an early commitment leads to failure later, SHOP2 backtracks and tries alternatives. "If the plan later turns out to be infeasible, the planning system will need to backtrack and try other methods" (p. 382).

3. **Branch-and-bound**: "SHOP2 allows the option of using branch-and-bound optimization to search for a least-cost plan" (p. 387). This explores multiple complete plans to find the best.

However, the paper notes that in competition: "In our preliminary testing of SHOP2 with optimization and no time limits, SHOP2 was unable to find solutions within the amount of time that we were willing to let it run, except on the very smallest problems" (p. 394).

This reveals a fundamental tradeoff: avoiding premature commitment through exhaustive search is computationally expensive. In practice, "good enough" heuristics outperform optimal search.

### Application to Agent Systems

**Resource Allocation**: When orchestrating multiple agents, don't assign resources (agents, API quotas, database connections) to tasks in arbitrary order. Use heuristics to allocate resources to tasks where they'll have greatest impact.

**Lazy Commitment**: Defer committing to specific implementations as long as possible. Instead of immediately choosing "use PostgreSQL for persistence," commit only to "need persistence" and choose specific technology when you have more context.

**Checkpoint and Rollback**: If an early decision leads to failure, don't start over completely. Roll back to the decision point and try alternatives. This is SHOP2's backtracking applied to agent execution.

## Failure Mode: Inadequate Heuristics in Sort-By

The sort-by construct relies on heuristic functions to estimate costs. If the heuristic is poor, sort-by tries alternatives in suboptimal order, leading to:
- Exploring many branches before finding solutions
- Finding suboptimal solutions (if using greedy search without backtracking)
- Timeout failures (exhausting time limits before finding any solution)

The paper doesn't provide explicit examples of heuristic failure, but notes the extensive effort required: "we spent a great deal of effort crafting the methods used in the competition" (p. 394).

### Characteristics of Bad Heuristics

**Inconsistent with actual costs**: Heuristic estimates don't correlate with true costs. Example: estimating aircraft selection by fuel capacity alone, ignoring current fuel level and distance to be traveled.

**Missing important factors**: The heuristic considers only some cost components. Example: optimizing for time but ignoring that some actions are parallelizable.

**Not adapted to problem characteristics**: The heuristic uses fixed weights that don't adjust to problem scale or structure.

The paper's temporal planning example illustrates this: "The cost of an action depends on what other actions will be executed concurrently... The first boarding action will increase the total time by tb, so its cost is tb. However, the second boarding action will not increase the total time of the plan, so its cost is 0" (p. 393).

A naive heuristic would assign cost tb to both boarding actions. A sophisticated heuristic recognizes concurrency and adjusts costs dynamically.

### Application to Agent Systems

**Multi-factor cost models**: When estimating skill costs, consider all relevant factors:
```python
def estimate_cost(skill, task, state):
    base_cost = skill.estimated_duration
    resource_cost = estimate_resource_usage(skill, task)
    failure_risk = skill.historical_failure_rate
    opportunity_cost = estimate_blocked_alternatives(skill, task, state)
    return base_cost + resource_cost + failure_risk + opportunity_cost
```

**Adaptive heuristics**: Refine cost estimates based on execution history:
```python
class AdaptiveHeuristic:
    def __init__(self):
        self.estimates = {}
        self.actuals = {}
    
    def estimate_cost(self, skill, task):
        key = (skill.name, task.type)
        if key in self.estimates:
            # Use historical average
            return statistics.mean(self.actuals[key])
        else:
            # Use skill's declared estimate
            return skill.estimated_cost(task)
    
    def observe_actual(self, skill, task, actual_cost):
        key = (skill.name, task.type)
        self.actuals.setdefault(key, []).append(actual_cost)
```

**Heuristic debugging**: SHOP2's tracing facility (Section 3.3.4) allows debugging method selection. Agent systems need similar observability for cost estimation:
- Log estimated vs. actual costs
- Identify skills where estimates are consistently wrong
- Analyze correlation between estimates and outcomes

## Failure Mode: Method Combinatorial Explosion

When multiple methods apply to a task, and each method decomposes into multiple subtasks, and each subtask has multiple applicable methods, the search space explodes combinatorially.

The paper notes that SHOP2 achieves high success rates "because these planners' domain knowledge enabled them to find solutions without doing very much backtracking" (p. 394).

This implies: without good domain knowledge, you'd do lots of backtracking, exploring many branches.

### The Problem Structure

Consider a task T with 3 applicable methods, each decomposing into 3 subtasks, and each subtask having 3 applicable methods:
- 3 choices at top level
- 3³ = 27 choices for first-level decomposition
- 3⁹ = 19,683 choices for second-level decomposition
- Grows as 3^(3^n) with decomposition depth

Even with "only" 3 alternatives per decision point, you get exponential blowup.

### How SHOP2 Mitigates This

**Strategic methods**: Good HTN methods encode which decomposition is usually right, reducing branching factor. Instead of 3 applicable methods for "transport person," have 1 method with 3 cases:
```
method: transport-person
  case: already at destination → done (0 subtasks)
  case: plane at same location → board and fly (2 subtasks)
  case: plane elsewhere → move plane, board, fly (3 subtasks)
```

The preconditions select which case applies, avoiding branching.

**Sort-by**: When multiple alternatives exist, sort-by ensures you try the most promising first. If the best alternative succeeds (no backtracking needed), you avoid exploring others.

**Anti-interleaving**: The `:immediate` keyword (Section 3.3.5) forces certain subtasks to be planned immediately, preventing interleaving with other tasks. This reduces the combinatorial explosion from interleaving alternatives.

### Application to Agent Systems

**Hierarchical selectivity**: Don't make every skill selection a branching point. Use preconditions to eliminate inapplicable skills early:
```python
def select_applicable_skills(task, state):
    all_skills = skill_registry.find_by_task_type(task.type)
    # Filter by preconditions before creating branches
    applicable = [s for s in all_skills if s.preconditions_satisfied(state)]
    if len(applicable) == 1:
        return applicable[0]  # No branching!
    else:
        return rank_and_try(applicable, task, state)
```

**Batching decisions**: Instead of branching on every individual decision, batch related decisions:
```python
# Bad: Branch on each file separately
for file in files:
    choose_processing_method(file)  # Branching point

# Good: Choose strategy for entire batch
strategy = choose_batch_strategy(files)  # Single branching point
for file in files:
    apply_strategy(strategy, file)  # No branching
```

**Prune obviously bad alternatives**: Before adding branches to search space, eliminate alternatives that can't possibly be optimal:
```python
def filter_viable_alternatives(alternatives, task, constraints):
    return [alt for alt in alternatives 
            if not obviously_infeasible(alt, task, constraints)]
```

## Failure Mode: Integration with External Systems

SHOP2's power comes partly from calling external functions (Section 3.1.5): "In the competition, SHOP2 used a graph-algorithm library to compute the shortest paths in a graph" (p. 385).

But external calls introduce failure modes:

**External Function Failures**: The external function might raise exceptions, timeout, or return invalid results. SHOP2's algorithms assume operators and axioms always succeed (or clearly fail).

**Side Effects**: External functions might have side effects (writing files, modifying databases, consuming API quotas). If SHOP2 backtracks, these side effects aren't automatically undone.

**Performance Unpredictability**: An external function that's usually fast might occasionally be slow (network latency, garbage collection, etc.). This makes planning time unpredictable.

The paper doesn't discuss these failure modes explicitly, suggesting they weren't major issues in competition. But for real-world agent systems, they're critical.

### Application to Agent Systems

**Idempotent external calls**: Design external functions to be idempotent where possible. If the orchestrator retries due to transient failure, repeated calls shouldn't cause problems.

**Timeouts and fallbacks**: Wrap external calls in timeouts with fallback strategies:
```python
def call_external_service(request, timeout=5.0):
    try:
        return service.call(request, timeout=timeout)
    except TimeoutError:
        return use_cached_result(request)
    except ServiceError as e:
        return use_alternative_service(request)
```

**Side effect compensation**: If backtracking occurs after side effects, have compensation logic:
```python
class CompensatableAction:
    def execute(self):
        result = self.do_action()
        self.compensation_stack.append(self.undo_action)
        return result
    
    def compensate(self):
        for undo in reversed(self.compensation_stack):
            undo()
```

**Circuit breakers**: If an external service is failing repeatedly, stop calling it temporarily:
```python
class CircuitBreaker:
    def call_with_protection(self, func, *args):
        if self.failure_count > self.threshold:
            raise ServiceUnavailable("Circuit breaker open")
        try:
            result = func(*args)
            self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            raise
```

## The Meta-Failure: Optimization Without Understanding

The paper's most surprising negative result: "In the International Planning Competition, we did not use the optimization approach in any official competition trial. For all of the competition domains, in our preliminary testing of SHOP2 with optimization and no time limits, SHOP2 was unable to find solutions within the amount of time that we were willing to let it run, except on the very smallest problems" (p. 394).

Branch-and-bound optimization—supposedly the "right" way to find optimal plans—was too slow to be useful, even for experts who understood SHOP2 deeply.

### Why Optimization Failed

The paper hints at the reason: "One reason for this lack of improvement was that we spent a great deal of effort crafting the methods used in the competition" (p. 394).

The well-crafted methods already found near-optimal solutions. The additional search to prove optimality or find marginally better solutions wasn't worth the computational cost.

This reveals a profound point: **Good heuristics + greedy search often beats optimal search**, even when you have the computational machinery for optimal search.

### The Lesson

For agent systems: Don't assume "more sophisticated optimization = better results." Sometimes:
- Greedy search with good heuristics is fast and effective
- Optimal search is slow and provides little benefit
- Time spent improving heuristics yields better ROI than time spent on optimization algorithms

The SHOP2 experience suggests: Invest in **domain knowledge and heuristics first, optimization second**.

## Key Insight: Failure Modes Reveal Design Tradeoffs

The failures and near-failures in SHOP2's development reveal fundamental tradeoffs in planning system design:

**Correctness vs. Efficiency**: Automatically translated domain descriptions are correct but inefficient. Hand-crafted descriptions are efficient but risk errors. Solution: Start with automated translation, enhance with careful testing.

**Commitment vs. Flexibility**: Forward planning enables efficiency but risks premature commitment. Full backtracking enables optimality but is computationally expensive. Solution: Good heuristics + selective backtracking.

**Expressiveness vs. Complexity**: Rich preconditions (numeric computation, external calls, axioms) enable powerful reasoning but introduce failure modes. Solution: Defensive programming (timeouts, error handling, validation).

**Generality vs. Performance**: Domain-independent algorithms work anywhere but slowly. Domain-specific knowledge enables speed but requires expertise. Solution: Hand-tailorable architecture accepting domain knowledge.

For agent systems: Recognize these tradeoffs explicitly. Design for graceful degradation rather than perfect optimization. Build systems that work well in practice, not perfectly in theory.