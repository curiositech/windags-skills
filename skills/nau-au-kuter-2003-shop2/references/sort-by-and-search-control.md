# Sort-By and Search Control: Heuristic Guidance Without Hard Commitments

## The Problem: Nondeterministic Choice Points

When SHOP2 evaluates a method's precondition, it often finds multiple sets of variable bindings that satisfy the precondition. Each binding represents a branch in the search space—a different way to accomplish the current task.

For example, when transporting a person, there might be multiple available aircraft. Which one should SHOP2 try first? The naïve answer is "try them all via backtracking," but this can lead to exponential search even when good heuristics could identify the best choice.

The authors explain: "Each set of variable bindings can lead to a different branch in SHOP2's search tree. This nondeterministic choice is implemented in SHOP2 via depth-first backtracking. For SHOP2 to find a good solution and to find it quickly, it is important to decide which set of variable bindings to try first" (p. 386).

## The Sort-By Construct

SHOP2's solution is the `:sort-by` construct, which sorts alternative variable bindings by a specified criterion before trying them. The general form is:

```
(:sort-by ?variable comparison-function
  precondition-expression)
```

This tells SHOP2: "Find all variable bindings satisfying the precondition, then sort them according to ?variable using comparison-function, then try them in that order."

### Simple Example

```lisp
(:sort-by ?d #'>
  (and (at ?here)
       (distance ?here ?there ?d)))
```

Meaning: "Find all locations ?there reachable from ?here, sort them by distance ?d in decreasing order (using the #'> comparison function), and try the farthest locations first."

Why would you want farthest first? Perhaps because you're trying to make long trips while fuel is plentiful, saving short trips for when fuel is low. The domain author encodes this strategic knowledge via sort-by.

### Complex Example: Cost-Based Aircraft Selection

Figure 6 shows a more sophisticated use in the ZenoTravel domain:

```lisp
(:method (transport-person ?p ?c2)
  Case2 (:sort-by ?cost #'<
          (and (at ?p ?c1)
               (at ?a ?c1)
               (aircraft ?a)
               (onboard ?a ?num)
               (cost-of ?a ?c3 ?c1 ?cost)))
  ((board ?p ?a ?c1)
   (move-aircraft ?a ?c2)
   (debark ?p ?a ?c2)))
```

This says: "Find all aircraft ?a at the person's current location ?c1. For each, compute ?cost (via the cost-of predicate). Sort aircraft by cost in ascending order. Try the cheapest aircraft first."

The `cost-of` predicate is defined as an axiom (logical rule) that computes expected cost based on fuel requirements, current fuel level, refueling needs, etc. This allows sophisticated heuristic functions to be encoded declaratively.

## Integration with Axiomatic Inference

The power of sort-by is amplified by SHOP2's axioms. An axiom is a logical rule (generalized Horn clause) that can infer derived predicates.

Figure 4 shows an axiom for fuel sufficiency:

```lisp
(:-
  (enough-fuel ?plane ?current-position ?destination ?speed)
  (and (distance ?current-position ?destination ?dist)
       (fuel ?plane ?fuel-level)
       (fuel-burn ?speed ?rate)
       (eval (>= ?fuel-level (* ?rate ?dist)))))
```

This defines `enough-fuel` as a derived predicate: it's true when the plane's current fuel level is at least the distance times the burn rate.

Now you can use this in sort-by:

```lisp
(:sort-by ?cost #'<
  (and (aircraft ?a)
       (enough-fuel ?a ?from ?to slow)
       (assign ?cost (compute-cost ?a ?from ?to))))
```

The axiom encapsulates the fuel computation logic, making the sort-by expression cleaner and more maintainable.

## Heuristic Functions via External Calls

SHOP2 allows external function calls in preconditions, including within sort-by. The authors note: "External function calls are useful, for example, to do numeric evaluations... In the competition, SHOP2 used a graph-algorithm library to compute the shortest paths in a graph" (p. 385).

Example from the appendix:

```lisp
(assign ?cost (eval (if (< ?cap (* ?dist ?burn)) 
                        most-positive-fixnum
                        (float (/ (+ *tc* (* *fc* (* ?dist ?burn))) 1)))))
```

This computes a cost estimate using:
- Global variables `*tc*` (time coefficient) and `*fc*` (fuel coefficient)
- Numeric expressions involving capacity, distance, burn rate
- Special handling (infinite cost) if capacity is insufficient

The `eval` construct evaluates arbitrary Lisp expressions, allowing sophisticated heuristics to be embedded directly in domain descriptions.

## Three Approaches to Optimization

The paper describes three approaches for finding optimal or near-optimal plans:

### Approach 1: Structure Methods for Optimality

"Structure the SHOP2 methods in such a way as to take SHOP2 more-or-less directly toward a plan that minimizes the objective function" (p. 392).

Example: If the objective is to minimize fuel consumption, always prefer the `fly` action over `zoom` (which is faster but uses more fuel). This can be encoded in the methods themselves—don't offer zoom as an alternative when optimizing for fuel.

**Limitation**: "This approach doesn't work so well if it isn't immediately obvious which alternative is best" (p. 393). For time optimization, should you use zoom (faster but costs more fuel so may require refueling stops) or fly? The optimal choice depends on context.

### Approach 2: Sort-By with Greedy Heuristics

"Write methods, operators, and axioms to generate plans quickly, and use the 'sort-by' feature to tell SHOP2 to sort the alternatives and try the most promising ones first" (p. 392).

This is a **greedy approach**: at each decision point, sort alternatives by estimated cost and try the cheapest first. It's not guaranteed optimal, but combined with good heuristics, "this approach results in near-optimal plans. In the competition we used this technique extensively, and it produced satisfactory plans even for the largest problems" (p. 393).

The key insight: **greedy heuristic search guided by domain knowledge often finds near-optimal solutions efficiently**, even though it's not guaranteed optimal.

### Approach 3: Branch-and-Bound Optimization

"Assign costs to the operators, and use a branch-and-bound search to find the best plan within the execution time limit" (p. 392).

SHOP2 supports branch-and-bound search with time limits: "If the search takes longer than the time limit, SHOP2 terminates the search and returns the best plan it has found so far; this functionality was partly inspired by anytime algorithms" (p. 387).

This approach: quickly find a feasible plan using approaches 1 and 2, then continue searching for improvements until time runs out.

**Surprising result**: "In the International Planning Competition, we did not use the optimization approach in any official competition trial... in our preliminary tests, this never provided significant improvements in cost across an entire problem set" (p. 394).

Why? Because approaches 1 and 2 already found near-optimal solutions: "we spent a great deal of effort crafting the methods used in the competition... One reason for this lack of improvement was that we spent a great deal of effort crafting the methods" (p. 394).

## Boundary Conditions: When Sort-By Isn't Enough

Sort-by is powerful for local optimization—choosing the best alternative at a single decision point. But it has limitations:

**Global Optimization**: Sort-by makes greedy local choices. Global optimality requires considering interactions between decisions across the entire plan. Branch-and-bound addresses this but is computationally expensive.

**Context-Dependent Heuristics**: Sometimes the best choice depends on future decisions that haven't been made yet. Example from the paper: "suppose the latest event in the current partial plan is for a plane to arrive at an airport at time t, and two passengers need to board the plane... The first boarding action will increase the total time by tb, so its cost is tb. However, the second boarding action will not increase the total time of the plan, so its cost is 0" (p. 393).

The cost of an action depends on what other actions will be executed concurrently. Sort-by can't easily capture this because it evaluates alternatives before committing to the plan.

**Heuristic Quality**: Sort-by is only as good as the heuristic function. If `cost-of` doesn't accurately predict true cost, sort-by will try alternatives in suboptimal order. The paper notes extensive effort went into crafting good heuristics.

## Application to Agent Systems

For WinDAG orchestration:

**Skill Selection with Cost Estimates**: When multiple skills could accomplish a task, use sort-by style ranking:

```python
# Pseudocode for agent skill selection
available_skills = find_applicable_skills(task, current_state)
ranked_skills = sorted(available_skills, 
                       key=lambda s: estimate_cost(s, task, current_state))
for skill in ranked_skills:
    result = try_skill(skill, task)
    if result.success:
        return result
    # Implicit backtracking: try next-ranked skill
```

**Dynamic Heuristics**: Compute heuristic estimates using current system state—API latency, resource availability, cost budgets, etc. Don't use static heuristics; make them context-sensitive.

**Encode Strategic Preferences**: Use ranking to encode organizational priorities:
- Prefer cached/memoized solutions over computation
- Prefer tested/validated approaches over novel ones  
- Prefer cheaper resources when performance is acceptable
- Prefer faster approaches when cost is acceptable

**Multi-Objective Optimization**: Combine multiple criteria in heuristic:
```python
def estimate_cost(skill, task, state):
    time_cost = estimate_time(skill, task) * TIME_WEIGHT
    resource_cost = estimate_resources(skill, task) * RESOURCE_WEIGHT  
    risk_cost = estimate_failure_risk(skill, task) * RISK_WEIGHT
    return time_cost + resource_cost + risk_cost
```

The weights (TIME_WEIGHT, etc.) encode strategic priorities, analogous to SHOP2's *tc* and *fc* coefficients.

**Anytime Planning**: Implement SHOP2's time-limited search pattern:
1. Quickly find a feasible solution using greedy heuristics
2. If time permits, continue searching for improvements
3. Return the best solution found when time expires

This provides graceful degradation: you always get a solution, but more time yields better solutions.

## The Deeper Pattern: Declarative Heuristic Knowledge

The profound insight is that **heuristic knowledge should be declarative, not procedural**. 

In traditional planners, heuristics are buried in the search algorithm (e.g., A* with a hardcoded heuristic function). Changing the heuristic requires modifying the planner's code.

SHOP2 makes heuristics **part of the domain description**: axioms compute derived predicates, external functions compute estimates, sort-by specifies preferences. The domain author controls search behavior without modifying the planner.

This is analogous to declarative query optimization in databases: the domain description says "prefer cheaper alternatives" (analogous to "use indexes when available"), and the planning engine implements this preference (analogous to the query optimizer).

For agent systems, this means: **Don't hardcode task selection strategies in your orchestrator**. Instead, let each skill/method declare its expected cost, prerequisites, and quality characteristics. The orchestrator uses this declarative metadata to make intelligent choices.

This creates a virtuous cycle: as you add more skills and accumulate operational experience, you refine the cost estimates and heuristics, making the orchestrator progressively smarter without modifying its core logic.

## Key Insight: Greedy + Backtracking Often Beats Optimal Search

The competition results reveal something counterintuitive: **greedy heuristic search with backtracking (approach 2) often outperforms optimal search (approach 3)**.

Why? Because:
1. Good heuristics usually pick the right alternative first, making backtracking rare
2. Branch-and-bound's overhead (exploring multiple complete plans) exceeds the benefit of guaranteed optimality
3. Near-optimal solutions are often sufficient in practice

The paper's conclusion: "We think the third approach would be more useful in cases where it is not immediately clear how to implement the first two approaches, and one does not want to spend too much time devising a sophisticated domain description" (p. 394).

Translation: Invest in good heuristics (approach 2) rather than optimal search (approach 3). The payoff is better.

For agent systems: Don't aim for provably optimal task decompositions. Aim for high-quality heuristics that usually make good choices, with backtracking as a safety net.