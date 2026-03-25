## BOOK IDENTITY
**Title**: SHOP2: An HTN Planning System
**Author**: Dana Nau et al.
**Core Question**: How can intelligent systems decompose complex tasks into executable actions by using hierarchical knowledge about "how things are normally done" rather than searching blindly through action spaces?
**Irreplaceable Contribution**: This paper uniquely demonstrates that planning systems become dramatically more powerful when they (1) plan in execution order so they always know the current state, eliminating uncertainty, and (2) encode domain-specific "standard operating procedures" as decomposition methods rather than searching from first principles. The insight that **ordering planning to match execution order fundamentally changes what's computationally tractable** is something you won't find clearly articulated elsewhere.

## KEY IDEAS (3-5 sentences each)

1. **Ordered Task Decomposition Eliminates Uncertainty**: By planning tasks in the exact order they'll be executed, SHOP2 always knows the current world state at each planning step. This eliminates the exponential complexity of reasoning about which conditions hold when, making it trivial to incorporate numeric computation, external function calls, and axiomatic inference. The reduction from reasoning about all possible world states to reasoning about one known state is the difference between intractable and tractable.

2. **HTN Methods Encode "Standard Operating Procedures"**: Rather than searching through all possible action sequences, HTN planning uses methods that describe how experts normally accomplish tasks in a domain. These methods are more expressive than classical planning operators and better capture how humans actually think about complex problems. A method says "to transport a person, normally you'd move a vehicle to their location, board them, move to destination, debark"—procedural knowledge that classical planning must rediscover through search.

3. **Hand-Tailorability vs. Full Automation Is a False Dichotomy**: SHOP2 demonstrates that domain-specific knowledge doesn't mean hard-coded solutions—it means encoding general problem-solving strategies that work across all problems in a domain. The system solved 899 of 904 competition problems (99%) using domain descriptions that took human experts days to write, but then handled arbitrarily large problem instances. The "fully automated" planners failed on most problems because they lacked strategic knowledge about how to decompose tasks.

4. **Multi-Timeline Preprocessing Handles Concurrency Through State Augmentation**: SHOP2 doesn't natively support temporal/concurrent actions, but handles them by augmenting the state with read-times and write-times for each dynamic property. This transforms temporal reasoning into state-based reasoning: two actions can overlap if one writes property P and the other neither reads nor writes P. This shows how expressive power in state representation can substitute for explicit temporal reasoning mechanisms.

5. **Hierarchical Decomposition Enables Polynomial Solutions to Exponential Problems**: The paper cites research showing that HTN planning with appropriate methods can solve in polynomial time what would take exponential time for classical planners. The key is that methods prune the search space by encoding which decompositions are sensible—they don't prevent backtracking, but they avoid ever considering the vast majority of nonsensical action sequences.

## REFERENCE DOCUMENTS

### FILE: ordered-decomposition-eliminates-uncertainty.md

```markdown
# Ordered Task Decomposition: How Execution-Order Planning Eliminates Exponential Uncertainty

## Core Principle

The fundamental insight of SHOP2's ordered task decomposition is deceptively simple: **plan for tasks in the same order they will be executed**. This single architectural decision transforms planning from reasoning about exponentially many possible world states into reasoning about exactly one known state at each step.

As the authors state: "SHOP2 generates the steps of each plan in the same order that those steps will later be executed, so it knows the current state at each step of the planning process. This reduces the complexity of reasoning by eliminating a great deal of uncertainty about the world, thereby making it easy to incorporate substantial expressive power into the planning system" (p. 379).

## Why This Matters for Agent Systems

Most planning approaches—whether classical STRIPS planning, partial-order planning, or modern neural approaches—maintain multiple possible world states simultaneously. They must reason about what *might* be true after various action sequences, leading to exponential branching in both the search space and the logical complexity of precondition checking.

SHOP2's approach is radically different. At each planning step, the system has a complete, ground-truth representation of the current world state. When evaluating whether a method or operator is applicable, there's no need to reason about possibility—you simply check the current state.

This has profound implications:

1. **Precondition evaluation becomes trivial**: Instead of maintaining belief states or possible worlds, you query a single state. This makes it feasible to have arbitrarily complex preconditions including numeric computations, external function calls, and theorem proving.

2. **Effects are deterministic and immediate**: When an operator executes, its effects directly modify the current state. There's no need to reason about how effects interact with multiple possible world states.

3. **Domain knowledge becomes executable**: The system can call external libraries, perform graph algorithms, access databases—anything computable—because it's always operating in a definite state, not reasoning about possibilities.

## The Algorithm Structure

The SHOP2 algorithm (Figure 5 in the paper) implements this through a careful discipline:

```
1. Choose a task t that has no predecessors (can start now)
2. If t is primitive:
   - Find an action a whose preconditions hold in current state s
   - Apply a's effects to s (deterministic update)
   - Add a to plan P
3. If t is compound:
   - Find a method m whose preconditions hold in s
   - Replace t with m's subtasks
   - Require that leftmost subtasks be planned before others
```

The crucial step is #3's final requirement. By forcing the leftmost branch of the decomposition tree to be planned all the way to primitive actions before planning other branches, SHOP2 ensures that when it evaluates a method's preconditions, those preconditions are evaluated in the correct world state—the state that will actually exist when the method's first action executes.

## The Example: Truck Availability

The paper provides an illuminating example (Figure 2). When transporting two packages:

1. SHOP2 decomposes `(transport-two p1 p2)` into `(transport p1)` and `(transport p2)`
2. It begins decomposing `(transport p1)` fully before touching `(transport p2)`
3. During `(transport p1)`, it reserves truck t1 by executing `(reserve t1)`, which removes `(available-truck t1)` from the state
4. Only after completing the `(dispatch t1 l1)` subtask does it return to decompose `(transport p2)`
5. When evaluating which truck to use for p2, truck t1 is no longer available in the current state
6. Therefore, p2 uses truck t2

If SHOP2 didn't plan in execution order, both transport tasks might simultaneously consider t1 available, leading to invalid plans where both packages try to use the same truck.

## Boundary Conditions: When This Doesn't Work

Ordered decomposition has a critical limitation: **it cannot easily handle situations where later planning decisions should influence earlier ones**. 

The paper acknowledges this subtly. SHOP2 allows subtasks to be partially ordered (unlike its predecessor SHOP, which required total ordering), which provides some flexibility for interleaving. However, the fundamental commitment to forward planning means:

- You cannot easily "reserve" resources that will be needed later without knowing what's needed
- Backtracking may be required if early decisions turn out suboptimal
- The planner cannot optimize globally across the entire plan simultaneously

The paper addresses this through two mechanisms:

1. **Sort-by constructs**: "When SHOP2 evaluates a method's precondition, it gets a list of all of the possible sets of variable bindings that satisfy the expression in the current state... This is especially useful when the planning problem is an optimization problem" (p. 386). By sorting alternatives according to heuristic estimates, the system tries promising branches first.

2. **Branch-and-bound search**: "SHOP2 allows the option of using branch-and-bound optimization to search for a least-cost plan" (p. 387). This explores multiple complete plans to find the best one, though the authors note this wasn't particularly successful in the competition because well-crafted methods already found near-optimal solutions.

## Application to Multi-Agent Orchestration

For WinDAG systems, the ordered decomposition principle suggests:

**Agent Coordination Pattern**: When multiple agents must coordinate, designate one agent as the "planner" who sequences subtasks in execution order. That agent maintains the definite current state and assigns subtasks to other agents only when the preconditions are definitively satisfied. This is superior to having all agents reason about possible world states.

**State Hydration**: At each decision point, the orchestrating agent should have complete access to current state—database queries, API calls, file system checks—rather than maintaining abstract state representations. Make precondition checking "look up ground truth" rather than "reason about possibilities."

**Leftmost-First Discipline**: When a task decomposes into subtasks with dependencies, complete the leftmost branch entirely before starting others. In code generation, this means: fully generate and validate the data model before generating the API layer that depends on it. Don't try to plan them "in parallel" abstractly.

**Avoid Premature Commitment**: The limitation of ordered decomposition is premature commitment to early decisions. Mitigate this by:
- Making early decisions "conservative" (prefer options that preserve future flexibility)
- Using sort-by style heuristics to try most-promising branches first
- Structuring methods to defer commitment (the "dispatch" method in Figure 1 selects which truck to use only when needed, not earlier)

## Key Insight for System Designers

The profound lesson is that **deterministic forward simulation is vastly simpler than reasoning about possibilities**, even though it seems to limit your options. Classical AI planning seemed more general and powerful because it could reason about any action ordering, but this generality made it computationally intractable for real problems.

SHOP2 solved 899 of 904 competition problems. The "fully automated" planners—which seemed more general—solved far fewer. The apparent limitation (planning in execution order) was actually a strength because it enabled sufficient expressive power to encode expert knowledge.

For AI agent systems: Don't try to make your orchestrator "consider all possible orderings." Instead, encode knowledge about sensible orderings (HTN methods), execute in that order while checking the actual current state, and backtrack only when you hit a genuine failure. This is how humans plan, and SHOP2 proves it's computationally superior.

## The Deeper Pattern

Ordered task decomposition is an instance of a broader principle: **Commit to structure early; defer commitment to values late**. SHOP2 commits early to the task decomposition structure (which subtasks, in what order), but defers commitment to specific variable bindings until the moment of execution (which specific truck, which specific city, evaluated in the current state).

This is the opposite of approaches that try to keep all structural options open while reasoning abstractly about values. SHOP2's success suggests that structural commitment + concrete state evaluation is more tractable than structural flexibility + abstract state reasoning.
```

### FILE: htn-methods-as-expert-procedures.md

```markdown
# HTN Methods: Encoding How Experts Actually Solve Problems

## The Central Insight

Hierarchical Task Network (HTN) planning represents a fundamentally different approach to problem-solving than classical planning. Rather than defining primitive actions and searching for sequences that achieve goals, HTN planning encodes **procedural knowledge about how tasks are normally accomplished**.

The authors write: "HTN methods generally describe the 'standard operating procedures' that one would normally use to perform tasks in some domain... Most HTN practitioners would argue that such representations are more appropriate for many real-world domains than are classical planning operators, as they better characterize the way that users think about problems" (p. 382).

## What Makes Methods Different from Operators

A classical planning operator says: "Action A can be taken when conditions C hold, producing effects E." The planner must search through all possible action sequences to find one that achieves the goal.

An HTN method says: "To accomplish task T when conditions C hold, here's the standard procedure: do subtasks S1, S2, ... Sn in this partial order." The method encodes human expertise about task decomposition.

Consider the example from Figure 1 (simplified logistics domain):

**Method for transporting one package**:
```
To transport package ?p:
1. Reserve a truck ?t
2. Dispatch ?t to package's location
3. Load ?p onto ?t  
4. Move ?t to package's destination
5. Unload ?p
6. Return ?t home
7. Free ?t (mark available)
```

This is how a human logistics coordinator thinks: "To transport something, you get a vehicle, go pick it up, deliver it, return the vehicle." The method captures this procedural knowledge directly.

Contrast with classical planning: you'd have operators for reserve, move, load, unload, etc., and the planner would have to discover through search that this particular sequence accomplishes the transport task.

## Expressiveness: HTN Planning is Turing-Complete

The paper makes a striking formal claim: "HTN planning is Turing-complete: even undecidable problems can be expressed as HTN planning problems. It remains Turing-complete even if we restrict the tasks and the logical atoms to be purely propositional (i.e., to have no arguments at all)" (footnote 4, p. 395).

This means HTN planning is strictly more expressive than classical planning. There exist problems that can be naturally expressed as HTN problems but cannot be expressed as classical planning problems at all.

Why? Because methods can encode arbitrary control flow and recursion. A method can say "to do X, recursively do X on smaller instances until you reach a base case"—representing algorithms, not just action sequences.

The paper notes: "In contrast, classical planning only represents planning problems for which the solutions are regular sets." Regular sets are far less expressive than the full range of computable problems.

## Methods Encode Multiple Levels of Abstraction

The power of HTN methods lies in their ability to represent problems at multiple levels of granularity simultaneously. Consider the abstract strategy for ZenoTravel (Figure 7):

**High-level strategy**:
- Task for each person: transport them to destination
- Task for each plane: move it to its destination  
- These are unordered; subtasks may interleave

**Mid-level method** (transport a person):
- If already at destination: done
- Else: select a plane, move it to person, board person, move to destination, debark

**Low-level operators**:
- board, debark, fly, zoom, refuel

Each level captures appropriate decision-making granularity. The high-level strategy recognizes that people can be transported in any order (they're independent tasks). The mid-level method encodes the standard procedure for using aircraft. The low-level operators are primitive actions.

This hierarchy mirrors how human experts think: strategic decisions (which people to prioritize?), tactical decisions (how to transport this person?), operational decisions (fly or zoom? when to refuel?).

## Methods Enable Polynomial Solutions to Exponential Problems

Perhaps the most practically important claim: "The ability to use domain-specific problem-solving knowledge can dramatically improve a planner's performance, and sometimes make the difference between solving a problem in exponential time and solving it in polynomial time" (p. 382).

The paper cites Gupta & Nau (1992) and Slaney & Thiébaux (2001) showing that for blocks-world planning:
- With appropriate HTN methods: polynomial time
- With classical planning: exponential time

Why? Because methods prune the search space by encoding which decompositions are sensible. A classical planner might consider stacking blocks in arbitrary orders, trying exponentially many possibilities. An HTN method encodes: "To clear a block, first recursively clear what's on top of it, then move it to the table." This procedural knowledge eliminates the need to search.

The paper reports experimental evidence: "hand-tailorable planners have quickly solved planning problems orders of magnitude more complicated than those typically solved by 'fully automated' planning systems" (p. 382).

In the competition, SHOP2 solved 899 of 904 problems. Most "fully automated" planners solved only a fraction of that.

## The Method Structure: Conditional Task Networks

A SHOP2 method has this general form:

```
(:method task-head
  precondition-1 subtask-network-1
  precondition-2 subtask-network-2
  ...
  precondition-n subtask-network-n)
```

This is analogous to if-then-else: "If precondition-1 holds, decompose using subtask-network-1; else if precondition-2 holds, use subtask-network-2; ..."

Figure 8 shows an example:

```
(:method (transport-person ?person ?destination)
  Case1  ; already there
    (and (at ?person ?current-position)
         (same ?current-position ?destination))
    ()  ; no subtasks needed
    
  Case2  ; need to transport
    (and (at ?person ?current-position)
         (plane ?p))
    ((transport-with-plane ?person ?p ?destination)))
```

This encodes two cases: "If the person is already at the destination, you're done. Otherwise, select a plane and transport them with that plane."

The ability to have multiple cases—each with different preconditions and subtask networks—makes methods highly expressive. They can encode case-based reasoning directly: "In situation A, use procedure X; in situation B, use procedure Y."

## Partial Ordering: Balancing Commitment and Flexibility

SHOP2 improves on its predecessor SHOP by allowing **partially ordered subtasks**: some subtasks must be done in sequence, others can be interleaved.

Consider transporting two packages (Figure 1):
```
(:method (transport-two ?p ?q)
  :unordered
  ((transport ?p)
   (transport ?q)))
```

The `:unordered` keyword says these can interleave. SHOP2 might:
1. Reserve truck for p
2. Reserve truck for q  
3. Dispatch truck for p
4. Dispatch truck for q
5. Load p, move, unload p
6. Load q, move, unload q

This is more flexible than forcing complete transport of p before starting q, but more structured than allowing arbitrary interleaving (some orderings would cause conflicts).

The paper notes: "This often makes it possible to specify domain knowledge in a more intuitive manner than was possible in SHOP" (p. 380).

The notation uses `:ordered` and `:unordered` tags, which can be nested:
```
(:method some-task
  :ordered
  (subtask-1
   :unordered
   (subtask-2a subtask-2b)
   subtask-3))
```

Meaning: do subtask-1, then do subtask-2a and subtask-2b in any interleaving, then do subtask-3.

The paper acknowledges: "This notation does not allow every possible partial ordering, but that has not been a problem in practice; and this notation is less clumsy than those that allow every possible partial ordering" (footnote 3, p. 384).

Practical lesson: Don't aim for maximal expressiveness; aim for the sweet spot where common patterns are natural to express.

## Boundary Condition: When Domain Knowledge Fails

The strength of HTN planning—encoding expert procedures—is also its limitation: **you need expert knowledge**.

The paper is honest about this: "HTN planning is 'hand-tailorable:' its planning engine is domain-independent, but the HTN methods may be domain-specific, and the planner can be customized to work in different problem domains by giving it different sets of HTN methods" (p. 382).

Writing good HTN methods requires:
1. Domain expertise (knowing the standard operating procedures)
2. Planning expertise (knowing how to encode them as methods)
3. Significant effort (the paper mentions "days" to write domain descriptions)

The competition exposed this challenge. In AIPS-2000, SHOP's team "made some mistakes in writing two of the domains. Thus SHOP found incorrect solutions for some of the problems in those domains, so the judges disqualified SHOP from those domains" (p. 388).

For AIPS-2002, they addressed this by: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This reveals the true challenge: automatic translation produces correct but inefficient domain descriptions (essentially, no better than classical planning). Human expertise is needed to add the procedural knowledge that makes planning tractable.

## Application to AI Agent Systems

For WinDAG and similar multi-agent systems:

**Skill Decomposition**: Each high-level skill (like "implement authentication system") should have HTN-style methods encoding standard procedures: "First design the data model, then implement user registration, then implement login, then implement password reset..." This is more useful than having primitive actions like "write function" and hoping the system discovers good orderings.

**Conditional Methods for Context**: Use SHOP2's conditional method structure:
```
method: implement-feature
  case: feature is already implemented → verify and return
  case: similar feature exists → adapt existing implementation  
  case: from scratch → standard implementation procedure
```

Each case encodes a different situation-appropriate strategy.

**Encode Development Conventions**: HTN methods should capture team standards: "To implement an API endpoint, first write the schema, then the handler, then the tests, then update the API documentation." These procedural conventions dramatically reduce search space.

**Hierarchical Task Monitoring**: When a high-level task decomposes into subtasks, the orchestrator can monitor progress at multiple levels. If a low-level subtask fails, the system can backtrack to the method level and try a different decomposition, rather than failing the entire high-level task.

**Method Libraries as Organizational Memory**: HTN methods become organizational memory—reusable procedures that capture institutional knowledge about how to accomplish tasks. New projects benefit from existing methods, and methods evolve as better procedures are discovered.

## The Profound Lesson

The success of HTN planning challenges a common assumption in AI: that **more general is better**. Classical planning seems more general because it doesn't require hand-crafted methods. But this "generality" makes it computationally intractable for real problems.

SHOP2's "limitation"—requiring domain-specific methods—is actually its strength. By encoding expert procedural knowledge, it reduces exponential search spaces to polynomial ones. The 99% success rate (899 of 904 problems) proves the approach scales.

The lesson for agent systems: **Don't make your agents figure out everything from first principles**. Encode standard operating procedures. Provide hierarchical task decomposition knowledge. Make your system "hand-tailorable" in the SHOP2 sense—capable of incorporating expert knowledge about how tasks should normally be accomplished.

This is how human organizations work: new employees don't rediscover procedures through trial and error; they learn standard operating procedures from experienced colleagues. HTN planning is the computational equivalent of institutional procedural knowledge.
```

### FILE: sort-by-and-search-control.md

```markdown
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
```

### FILE: multi-timeline-temporal-reasoning.md

```markdown
# Multi-Timeline Preprocessing: Handling Concurrency Through State Augmentation

## The Challenge: Temporal Planning Without Temporal Reasoning

SHOP2's operators are fundamentally non-temporal: each operator represents an instantaneous state transition. As the authors note: "SHOP2's operators are at least as expressive as Level 2 actions in PDDL, but SHOP2 does not explicitly support the durative actions in Level 3 of PDDL, nor does SHOP2 have an explicit mechanism for reasoning about durative and concurrent actions" (p. 390).

Yet SHOP2 needed to compete in temporal planning domains where actions have durations and can execute concurrently. How do you handle temporal reasoning without temporal logic?

The solution is **Multi-Timeline Preprocessing (MTP)**: a technique for encoding temporal information within non-temporal state representations. The key insight: **instead of one global time, maintain many local times—one for each dynamic property in the world**.

## The Core Idea: Read-Times and Write-Times

For each property P that changes over time (e.g., the location of a plane, the fuel level of a vehicle), MTP maintains two timestamps in the current state:

- **write-time(P)**: The last time any action modified P's value
- **read-time(P)**: The last time any action's precondition depended on P's value

These timestamps enable reasoning about temporal dependencies:

**Two actions can execute concurrently if and only if they don't conflict**. A conflict occurs when:
- One action writes property P while another reads P, OR
- One action writes property P while another writes P

The timestamps let SHOP2 detect these conflicts. An action A can start at time T only if:
- T ≥ write-time(P) for all properties P that A reads
- T ≥ read-time(P) for all properties P that A writes

## The MTP Algorithm

Figure 10 presents MTP as a preprocessing transformation applied to PDDL operators. For each operator o:

1. **Add temporal parameters**: Add ?start (when action begins) and ?duration (how long it takes)

2. **Compute duration**: In the precondition, add an assignment computing ?duration based on the action's parameters. Example: refueling duration = (capacity - current_fuel) / refuel_rate

3. **Compute start time**: In the precondition, compute ?start as the maximum of:
   - write-time(P) for all dynamic properties P in the precondition  
   - read-time(P) for all dynamic properties P in the effects
   
   This ensures the action doesn't start before it's safe to do so.

4. **Update write-times**: For each property P modified by the action, add an effect: write-time(P) := ?start + ?duration. This records when P was last modified.

5. **Update read-times**: For each property P accessed by the action (whether in precondition or effects), add an effect: read-time(P) := max(read-time(P), ?start + ?duration). This records when P was last accessed.

## Example: The Refuel Operator

Figure 11 shows a complete MTP-transformed operator for refueling. Let's analyze it:

```lisp
(:operator (!refuel ?plane ?city ?start ?duration)
  ; Preconditions
  ((aircraft ?plane)
   (city ?city)
   (at ?plane ?city)
   (fuel ?plane ?fuel-level)
   (capacity ?plane ?fuel-cap)
   (refuel-rate ?plane ?rate)
   ; Compute duration
   (assign ?duration (/ (- ?fuel-cap ?fuel-level) ?rate))
   ; Get timestamps for fuel (property being written)
   (write-time fuel ?plane ?t1)
   (read-time fuel ?plane ?t3)
   ; Get timestamps for location (property being read)
   (write-time at ?plane ?t2)
   (read-time at ?plane ?t4)
   ; Compute earliest start time
   (assign ?start (eval (max ?t1 ?t2 ?t3)))
   (assign ?end (eval (+ ?start ?duration)))
   ; Update location's read-time (refuel depends on location)
   (assign ?new-value (eval (max ?t4 ?end))))
```

The refuel action:
- **Reads** the plane's location (must be at ?city)
- **Writes** the plane's fuel level (changes it to ?fuel-cap)

Therefore:
- ?start must be ≥ max(?t1, ?t2, ?t3) where:
  - ?t1 = write-time(fuel) — can't start before last fuel modification
  - ?t2 = write-time(location) — can't start before last location change
  - ?t3 = read-time(fuel) — can't start before last action that depended on fuel

The effects update timestamps:
```lisp
; Delete old values
((fuel ?plane ?fuel-level)
 (write-time fuel ?plane ?t1)
 (read-time fuel ?plane ?t3)
 (read-time at ?plane ?t4))
; Add new values
((fuel ?plane ?fuel-cap)
 (write-time fuel ?plane ?end)
 (read-time fuel ?plane ?end)
 (read-time at ?plane ?new-value))
```

Notice: write-time(fuel) becomes ?end (the time refueling finishes), and read-time(at) becomes max(?t4, ?end) (updating the access time for location).

## Enabling Concurrency

The refuel operator can execute concurrently with other actions if those actions don't create conflicts. Consider:

**Concurrent with refueling**:
- Another plane's actions (different ?plane, so different properties)
- Loading passengers onto this plane (depends on location, not fuel, so no write conflict on fuel)

**Not concurrent with refueling**:
- Flying this plane (reads location AND writes location, conflicting with refuel's read of location)
- Another refuel on the same plane (both write fuel)
- Boarding that depends on fuel level (reads fuel while refuel writes fuel)

The paper explains: "a boarding operator and a fly operator on the same plane may not overlap, because the boarding operator requires that the plane be located in a particular city and the fly operator changes the location of the plane" (p. 391).

But refueling CAN overlap with boarding because: refuel reads location but doesn't write it, and boarding reads location but doesn't write it, and neither reads nor writes the other's properties (fuel vs. passenger list).

## Partial-Order Plans from Totally-Ordered Execution

A subtle point: SHOP2 still plans in execution order (totally ordered), but the timestamps encode a partial-order plan.

When SHOP2 adds action A at simulation time T, it computes A's actual start time based on timestamps. If A's computed start time is earlier than T, it means A can start while other actions are still running—creating concurrent execution.

The sequence of actions in SHOP2's plan is totally ordered (A is added before B), but their execution times may overlap (A.start < B.start < A.end), resulting in a partially-ordered plan.

Example: 
1. SHOP2 adds refuel(plane1) at simulation time T=0, which computes start=0, duration=10, end=10
2. SHOP2 adds board(person1, plane1) at simulation time T=0, which computes start=0, duration=1, end=1
3. The plan execution: refuel and board both start at T=0, board finishes at T=1, refuel finishes at T=10

SHOP2 added board after refuel (totally ordered planning), but they execute concurrently (partially ordered execution).

## Boundary Conditions and Limitations

**Expressiveness**: MTP can represent any temporal plan where actions have durations and preconditions/effects are instantaneous (PDDL Level 3). It cannot represent:
- Actions with continuous effects (resource consumption over time)
- Actions with preconditions that must hold throughout execution (over-all constraints)
- Explicit synchronization constraints beyond read/write dependencies

**Scalability**: Every property gets two timestamps, doubling state size. In large state spaces, this overhead could be significant. The paper doesn't discuss performance implications.

**Optimality**: MTP computes valid start times (ensuring safety), but not necessarily optimal ones. An action starts "as soon as possible given dependencies," but this greedy scheduling may not minimize total makespan. The sort-by construct can help guide toward better schedules.

**Manual Transformation**: The paper notes: "In principle, MTP could be automated—but in practice, we have always done it by hand, because it only needs to be done once for each planning domain" (p. 390). This suggests MTP is somewhat labor-intensive and error-prone, though straightforward for someone who understands the technique.

## Application to Agent Systems

For WinDAG orchestration with concurrent agents:

**Task-Level Timestamps**: Maintain timestamps for each task's inputs and outputs:
```python
class TaskState:
    outputs: Dict[str, Any]  # Task outputs
    output_write_times: Dict[str, float]  # When each output last changed
    input_read_times: Dict[str, float]  # When each input was last read
```

**Dependency Tracking**: When agent A produces output X and agent B consumes X:
- Update output_write_times[X] when A finishes
- Check output_write_times[X] when B starts (B can't start until X is written)
- Update input_read_times[X] when B starts (for tracking what depends on X)

**Concurrent Execution**: Two tasks can run concurrently if:
```python
def can_run_concurrently(task_a, task_b):
    # Check for write-write conflicts
    if task_a.outputs.keys() & task_b.outputs.keys():
        return False
    # Check for read-write conflicts
    if task_a.outputs.keys() & task_b.inputs.keys():
        return False
    if task_b.outputs.keys() & task_a.inputs.keys():
        return False
    return True
```

**Pipeline Parallelism**: In code generation workflows:
- Generate schema (writes: schema.json)
- Generate API handlers (reads: schema.json, writes: handlers.ts)
- Generate tests (reads: schema.json, handlers.ts, writes: tests.ts)
- Generate docs (reads: schema.json, handlers.ts, writes: docs.md)

The orchestrator can identify that tests and docs can run concurrently (both read schema and handlers, neither writes what the other reads), even though all tasks depend on schema.

**Resource Contention**: Extend MTP to handle resources:
```python
# A resource is "written" when acquired, "read" when its availability is checked
resource_write_times = {}  # When resource was acquired
resource_read_times = {}   # When resource availability was checked

def can_acquire_resource(resource, current_time):
    return current_time >= resource_write_times.get(resource, 0)
```

## The Profound Insight: State Augmentation as Mechanism Extension

MTP demonstrates a powerful meta-pattern: **You can extend a formalism's expressiveness by augmenting what you represent in states**, rather than modifying the reasoning mechanism.

SHOP2's planning algorithm didn't change to handle temporal domains. The algorithm still does state-based forward planning with methods and operators. But by augmenting states with temporal metadata (timestamps), the same planning mechanism gains temporal reasoning capabilities.

This pattern appears throughout computer science:
- **Type systems**: Augment values with type metadata; same runtime mechanism handles typed and untyped code
- **Garbage collection**: Augment memory blocks with reachability metadata; same allocation mechanism handles automatic memory management
- **Database transactions**: Augment records with version/timestamp metadata; same storage mechanism handles ACID properties

For agent systems: Rather than building specialized orchestration mechanisms for every new requirement (temporal planning, resource management, cost optimization, fault tolerance), consider **augmenting the state representation** with appropriate metadata and letting existing mechanisms handle the augmented state.

This is more maintainable than proliferating specialized mechanisms, and often more efficient because the core mechanisms remain simple and fast.

## Key Takeaway: Timestamps as a Universal Coordination Mechanism

The deepest lesson from MTP: **Timestamps are a universal mechanism for reasoning about dependencies and enabling concurrency**.

In distributed systems, this is Lamport timestamps and vector clocks. In databases, this is MVCC (Multi-Version Concurrency Control). In MTP, this is read-times and write-times for each property.

The common thread: By making time explicit in state representations, you can reason about what can safely happen when, without complex global synchronization.

For agent orchestration: Don't try to build a centralized scheduler that understands all dependencies. Instead, give each task/skill a timestamp interface:
- What are my input dependencies? (What do I read?)
- What are my output effects? (What do I write?)
- When were my dependencies last modified? (Read-times)
- When will my outputs be available? (Write-times)

The orchestrator uses these timestamps to detect conflicts and enable parallelism, without understanding the semantic content of dependencies. This scales far better than centralized reasoning about all possible interactions.
```

### FILE: hand-tailorable-vs-automated-tradeoff.md

```markdown
# The Hand-Tailorable vs. Fully-Automated Tradeoff: Lessons from Competition Results

## The Competition Landscape

The 2002 International Planning Competition included fourteen planning systems, split between two philosophies:

**Hand-Tailorable Planners** (3 systems): SHOP2, TLPlan, TALPlanner
- Accept domain-specific knowledge (HTN methods, control rules, etc.)
- Require human expertise to write domain descriptions
- "Cheating" according to pure AI research standards

**Fully-Automated Planners** (11 systems): Various STRIPS/PDDL planners
- Domain-independent search algorithms
- Work from generic operator descriptions only
- "Pure" AI research systems

The results were striking:
- **SHOP2**: 899 of 904 problems solved (99%)
- **TLPlan**: 894 of 904 problems solved (99%)  
- **TALPlanner**: 610 of 904 problems solved (67%, didn't do numeric domains)
- **Best fully-automated planner**: "several hundred" fewer problems than hand-tailorable ones

The paper notes: "SHOP2 solved more problems than any other planner in the competition" (p. 394).

## What Makes This Result Profound

The conventional wisdom in AI planning research has long been that **domain-independent is the goal**: the ideal planner should work on any domain given only operator descriptions, without human guidance.

SHOP2's competition results challenge this assumption. By accepting domain-specific procedural knowledge (HTN methods), hand-tailorable planners achieved:
- Higher success rates (99% vs. much lower)
- Faster solution times ("generally much faster than most of the fully-automated planners")
- Handling of much larger problems ("orders of magnitude more complicated than those typically solved by 'fully automated' planning systems")

The paper's experimental studies (Nau et al., 1999, 2001; Bacchus & Kabanza, 2000) consistently showed that hand-tailorable planners "have quickly solved planning problems orders of magnitude more complicated than those typically solved by 'fully automated' planning systems in which the domain-specific knowledge consists only of the planning operators" (p. 382).

## The Domain Knowledge Paradox

The paradox: Adding domain knowledge feels like "cheating"—you're encoding human expertise rather than discovering solutions algorithmically. Yet this "cheating" is what makes real-world problems tractable.

The paper frames this carefully: "The ability to use domain-specific problem-solving knowledge can dramatically improve a planner's performance, and sometimes make the difference between solving a problem in exponential time and solving it in polynomial time" (p. 382).

This isn't just a constant factor improvement—it's a complexity class difference. With appropriate HTN methods, problems solvable in O(n²) or O(n³) might otherwise require O(2ⁿ) without methods.

The paper cites formal results: "Gupta & Nau, 1992; Slaney & Thiébaux, 2001" showing that blocks-world planning is exponential for classical planners but polynomial for HTN planners with appropriate methods.

## Three Types of Domain Knowledge

The hand-tailorable planners in the competition used different types of domain knowledge:

### SHOP2: Hierarchical Task Networks (HTN Methods)

Methods encode procedural knowledge: "To accomplish task T, normally you'd do subtasks A, B, C in this order."

Example (Figure 1): "To transport a package, reserve a truck, dispatch it to the package, load, move to destination, unload, return truck, free it."

This knowledge prunes search space: SHOP2 never considers nonsensical sequences like "load package before dispatching truck" because the method specifies the correct order.

### TLPlan: Temporal Logic Control Rules

Control rules encode constraints: "Never reach a state where property P is violated" or "Always eventually reach a state where property Q holds."

These are specified in Linear Temporal Logic (LTL). The planner does forward search but backtracks when a control rule indicates the current state is "bad."

This knowledge prunes search space by excluding entire branches: if a state violates a control rule, all its successors are also excluded.

### TALPlanner: TAL (Temporal Action Logic) Rules

Similar to TLPlan but using TAL, a narrative-based temporal logic. Also encodes constraints about which states/transitions are valid.

## The Common Pattern: Expert Knowledge Enables Pruning

All three approaches share a key characteristic: **they use expert knowledge to prune the search space**, not to hardcode solutions.

This is crucial: they're not "cheating" by pre-computing answers. They're encoding general strategies that apply across all problem instances.

A SHOP2 method for "transport package" works whether there's 1 package or 1000, 1 truck or 100, simple topologies or complex ones. The method says "here's how to transport any package using any available truck," not "here's the solution to this specific problem."

The paper emphasizes: "SHOP2 is 'hand-tailorable:' its planning engine is domain-independent, but the HTN methods may be domain-specific" (p. 382).

The planner is domain-independent. The knowledge is domain-specific.

## The Cost: Human Expertise Required

The paper is honest about the cost of hand-tailorability:

**Expertise Required**: Writing good HTN methods requires both domain expertise (knowing standard procedures) and planning expertise (knowing how to encode them). "The ability to use domain-specific problem-solving knowledge" requires having that knowledge.

**Time Investment**: Domain descriptions took significant time to create. The paper mentions "days" and describes "spending a great deal of effort crafting the methods used in the competition" (p. 394).

**Risk of Errors**: In the AIPS-2000 competition, "SHOP's team made some mistakes in writing two of the domains. Thus SHOP found incorrect solutions for some of the problems in those domains, so the judges disqualified SHOP from those domains" (p. 388).

To address this, the SHOP2 team created a translator from PDDL to SHOP2: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This reveals the workflow: automated translation produces correct but inefficient domains (equivalent to fully-automated planning), then human expertise refines them into efficient domains.

## The Boundary Between Acceptable and Unacceptable Knowledge

An interesting question: What kinds of domain knowledge are "fair" vs. "cheating"?

The competition rules distinguished between:

**Acceptable**: General problem-solving strategies for a domain
- "To transport something, get a vehicle, pick it up, deliver it"
- "When optimizing fuel, prefer slower speeds"
- "Clear obstacles before moving objects"

**Unacceptable**: Problem-instance-specific information
- "In problem #42, use truck T3 to transport package P17"
- Hard-coding solutions to specific problem instances

The SHOP2 team's domain descriptions were accepted because they encoded general strategies, not specific solutions. The methods worked across all problem instances in each domain.

This suggests a principle: **Strategic knowledge is acceptable; tactical knowledge specific to individual problems is not**.

## Comparing the Three Hand-Tailorable Planners

The paper notes key differences:

**Speed**: "In general, SHOP2 tended to be slower than TALPlanner and TLPlanner, although there was one domain (Satellite-HardNumeric) where SHOP2 was consistently the fastest" (p. 394).

This is interesting: TLPlan and TALPlanner use forward search with control rules (pruning bad states), while SHOP2 uses hierarchical decomposition. Forward search with pruning can be faster when control rules efficiently eliminate bad branches.

**Plan Quality**: "None of the three hand-tailorable planners dominated the other two in terms of plan quality. For each of them, there were situations where its solutions were significantly better or significantly worse than the other two" (p. 394).

This suggests different types of domain knowledge lead to different optimization characteristics. HTN methods might find high-quality solutions in some domains, while temporal logic control rules might be better in others.

**Expressiveness**: The paper argues HTN planning is strictly more expressive than classical planning (Turing-complete vs. regular sets), but doesn't directly compare expressiveness of HTN methods vs. temporal logic control rules.

## The Deeper Argument: Why Hand-Tailorability Wins

The paper makes a subtle but powerful argument about why domain knowledge helps:

**Claim**: "Most HTN practitioners would argue that such representations are more appropriate for many real-world domains than are classical planning operators, as they better characterize the way that users think about problems" (p. 382).

This isn't just about computational efficiency—it's about **representational adequacy**. HTN methods naturally express how humans think about complex tasks.

When a logistics coordinator plans package delivery, they think: "I need to get a truck to the package, load it, deliver it." They don't think: "I need to find a sequence of primitive actions that achieves the goal that the package is at the destination."

The hierarchical decomposition matches human cognition. This makes domain descriptions:
- Easier to write (matches expert mental models)
- Easier to verify (experts can review and validate)
- More maintainable (modifications align with how humans think about changes)

**Computational efficiency is a consequence of cognitive alignment**, not just clever algorithms.

## Application to AI Agent Systems

For WinDAG and similar orchestration systems:

**Embrace Task Decomposition**: Don't make agents search through primitive actions. Give them hierarchical task decomposition knowledge. For "implement authentication," the decomposition might be: design data model → implement registration → implement login → implement password reset → add tests.

**Make Knowledge Explicit and Reviewable**: SHOP2's HTN methods are declarative and human-readable. Engineers can review them, validate them, and refine them. This is vastly superior to having domain knowledge implicit in neural network weights or buried in complex search heuristics.

**Start with Generated Knowledge, Refine with Expertise**: Like SHOP2's PDDL translator, you could generate initial task decompositions automatically (e.g., from API documentation, codebase analysis), then refine them with human expertise about best practices, common pitfalls, and optimization strategies.

**Distinguish Strategic from Tactical Knowledge**: Encode strategic knowledge (general problem-solving procedures) in reusable skills/methods. Let the orchestrator make tactical decisions (which specific resources to use) based on current state.

**Accept the Cost of Expertise**: Building high-performance agent systems will require domain expertise. This isn't a limitation—it's a feature. The alternative (fully automated systems with no domain knowledge) simply doesn't scale to complex real-world problems.

**Create Knowledge Repositories**: Treat HTN-style methods as organizational assets. Build libraries of reusable task decomposition knowledge. New projects leverage existing knowledge, and knowledge improves over time as you learn better procedures.

## The Meta-Lesson: Beware the Generality Trap

The fully-automated planners represent a seductive idea: build one system that works on everything without domain knowledge. This seems more "general" and therefore better.

But SHOP2's results suggest **apparent generality can be an anti-pattern** when it makes real problems intractable.

The "less general" approach—accepting domain knowledge—actually handles more problems, handles larger problems, and handles them faster. It's more useful in practice precisely because it's "less general" in theory.

This appears throughout computer science:

**Database query optimization**: Hand-written SQL with hints outperforms pure automated optimization on complex queries. Expert database administrators encode domain knowledge about data distributions, access patterns, and index usage.

**Compiler optimization**: Profile-guided optimization uses domain knowledge (actual runtime behavior) to generate faster code than pure static analysis.

**Machine learning**: Domain-specific feature engineering often outperforms "end-to-end learning" that learns features from scratch.

**Software architecture**: Domain-driven design encodes business domain knowledge in software structure, enabling more maintainable systems than generic CRUD frameworks.

The common thread: **Encoding domain knowledge, when done right, is a source of power, not a limitation**.

For agent systems: Don't aim for "fully automated" as the ultimate goal. Aim for "expertly guided"—systems that can leverage human expertise effectively, scale it across problems, and refine it over time.

The goal isn't to eliminate human knowledge from the loop. It's to make human knowledge maximally effective by encoding it in forms that machines can execute efficiently across arbitrarily many problem instances.

## Key Insight: Hand-Tailorability is a Feature, Not a Bug

The deepest lesson from SHOP2's competition success: **Hand-tailorability is what enables solving real-world problems at scale**.

The phrase "hand-tailorable" might suggest limitation or compromise—as if we're settling for less than the ideal of full automation. But the competition results suggest the opposite: hand-tailorability is a feature that enables capabilities fully-automated systems cannot match.

The 99% success rate vs. much lower success rates for fully-automated systems isn't a marginal difference—it's the difference between "works in practice" and "doesn't work in practice."

For AI agent systems: Design for hand-tailorability from the start. Make it easy to inject domain knowledge, encode procedural expertise, and refine strategies over time. The systems that accept human expertise will dramatically outperform those that insist on learning everything from scratch.
```

### FILE: failure-modes-in-complex-planning.md

```markdown
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
```

### FILE: gap-between-specification-and-execution.md

```markdown
# The Gap Between Knowing and Doing: Specification vs. Execution in Planning Systems

## The Translation Problem

One of the most revealing aspects of SHOP2's development is the tension between specification and execution—between knowing what operators do and being able to plan with them effectively.

The paper describes this tension through the PDDL-to-SHOP2 translation problem: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This statement contains a profound insight: **Knowing the primitive actions (PDDL operators) is not the same as knowing how to accomplish tasks (HTN methods).**

## Two Levels of Knowledge

### Operational Knowledge: What Can Be Done

PDDL operators specify operational knowledge:
- **Preconditions**: When this action can be executed
- **Effects**: What changes when it executes
- **Parameters**: What entities it operates on

Example from ZenoTravel:
```
operator: board(?person, ?aircraft, ?city)
precondition: at(?person, ?city) ∧ at(?aircraft, ?city)
effects: ¬at(?person, ?city) ∧ in(?person, ?aircraft)
```

This tells you: "You CAN board a person onto an aircraft when both are at the same city, and doing so puts the person in the aircraft."

### Procedural Knowledge: How To Accomplish Tasks

HTN methods specify procedural knowledge:
- **Task decomposition**: How to break complex tasks into simpler ones
- **Ordering constraints**: What sequence to follow
- **Alternative strategies**: Different ways to accomplish the same task

Example from Figure 8:
```
method: transport-person(?person, ?destination)
case 1: already there → done
case 2: not there → select aircraft, move it to person, 
                    board, fly to destination, debark
```

This tells you: "To TRANSPORT a person, here's the standard procedure..."

## The Gap

The gap between operational and procedural knowledge is the difference between:
- Knowing all the possible moves in chess vs. knowing how to play chess well
- Knowing what each function in a codebase does vs. knowing how to implement a new feature
- Knowing the rules of physics vs. knowing how to build a bridge

The PDDL operators give you the "rules of the game." The HTN methods give you the "strategy for playing well."

Classical planners try to bridge this gap through search: given only the rules, discover good strategies by trying many possibilities. SHOP2's approach is to encode the strategies explicitly as HTN methods.

## Why Translation Isn't Enough

The paper's translator can convert PDDL operators to SHOP2 operators mechanically. But it cannot generate effective HTN methods because:

**Methods encode domain-specific insight**: How do humans normally accomplish this task? What's the standard procedure? What are the common special cases?

**Methods prune the search space**: Without methods, SHOP2 would need to search through all possible action sequences, just like classical planners. With methods, it only explores sequences that follow sensible procedures.

**Methods enable tractability**: The paper cites results showing HTN planning can be polynomial where classical planning is exponential. This isn't magic—it's because methods encode problem structure that classical planning must rediscover through search.

An automatically generated SHOP2 domain without methods would be equivalent to classical planning: correct but inefficient.

## Example: The Logistics Domain

Consider a logistics domain with operators:
- load(truck, package, location)
- unload(truck, package, location)
- drive(truck, from-location, to-location)

A classical planner, given "get package P from location A to location B," might try:
1. drive(truck-1, somewhere, A)... no wait, wrong truck
2. drive(truck-2, depot, A)... okay
3. load(truck-2, P, A)... good
4. drive(truck-2, A, some-random-place)... no, need to go to B
5. [backtrack, try again]
6. drive(truck-2, A, B)... finally
7. unload(truck-2, P, B)... done

An HTN method encodes the procedure directly:
```
method: transport-package(?package, ?destination)
subtasks:
  1. find-truck(?truck, ?package-location)
  2. drive(?truck, ?current-location, ?package-location)
  3. load(?truck, ?package, ?package-location)
  4. drive(?truck, ?package-location, ?destination)
  5. unload(?truck, ?package, ?destination)
```

The method says: "First get a truck to the package, then load, then drive to destination, then unload." This procedural knowledge eliminates the need to search.

## The Cost of Bridging the Gap

Bridging the gap from operational to procedural knowledge requires:

**Domain Expertise**: You need to understand how tasks are normally accomplished in this domain. What are the standard procedures? What are the common cases and edge cases?

**Planning Expertise**: You need to understand how to encode procedural knowledge as HTN methods. What granularity of decomposition? How to handle alternatives? How to order subtasks?

**Time and Effort**: The paper mentions "days" to write domain descriptions and "a great deal of effort crafting the methods."

**Risk of Error**: The AIPS-2000 failure shows that hand-written methods can contain bugs. The operational knowledge (operators) might be correct while the procedural knowledge (methods) is wrong.

This cost is why many researchers prefer "fully automated" planners that work from operators alone. But the cost pays off: 99% success rate vs. much lower for automated planners.

## Validation: Checking the Gap

How do you verify that your procedural knowledge (HTN methods) correctly implements the operational knowledge (operators)?

SHOP2's team addressed this through testing and translator-based validation:

**Testing**: Run the planner on problem instances and verify solutions are valid. This catches errors where methods generate invalid action sequences.

**Translator baseline**: Generate a baseline domain from PDDL operators. Compare behavior of hand-written methods against baseline. Methods should solve the same problems (correctness) but faster (efficiency).

**Tracing and debugging**: SHOP2's tracing facility (Section 3.3.4) lets you observe method selection and verify it's doing what you expect.

But these are post-hoc validation techniques. There's no automated way to prove that a set of HTN methods correctly captures the "right" way to accomplish tasks, because "right" involves domain-specific judgment.

## Application to Agent Systems

### The AI Agent Gap

Modern agent systems face a similar gap:

**Operational Knowledge**: What each skill/tool can do
- API documentation
- Function signatures and types
- Preconditions and postconditions

**Procedural Knowledge**: How to accomplish complex tasks
- Which skills to use in what order
- How to handle failures and edge cases
- When to use alternative strategies

Current LLM-based agents try to bridge this gap through:
- Reasoning about task decomposition at runtime
- Learning from examples (few-shot learning)
- Trial-and-error with reflection

But this is expensive and unreliable. The SHOP2 approach suggests: **Encode procedural knowledge explicitly as reusable task decomposition templates**.

### Translating SHOP2's Lessons

**Skill Composition Patterns**: Create libraries of common task decomposition patterns:

```python
class TaskDecompositionPattern:
    """Base class for encoding how to accomplish task types"""
    
    def applies_to(self, task, state) -> bool:
        """Check if this pattern applies to the task"""
        pass
    
    def decompose(self, task, state) -> List[Subtask]:
        """Decompose task into subtasks"""
        pass

class ImplementFeaturePattern(TaskDecompositionPattern):
    """Standard pattern for implementing a feature"""
    
    def applies_to(self, task, state):
        return task.type == "implement_feature"
    
    def decompose(self, task, state):
        return [
            Subtask("design_data_model", task.feature),
            Subtask("implement_api_endpoints", task.feature),
            Subtask("add_tests", task.feature),
            Subtask("update_documentation", task.feature)
        ]
```

**Declarative Procedures**: Make task decomposition knowledge declarative and reviewable, like HTN methods:

```yaml
# Feature implementation procedure
task: implement_feature
cases:
  - condition: feature.type == "crud"
    subtasks:
      - design_data_model
      - generate_crud_endpoints
      - generate_crud_tests
      - update_api_docs
  
  - condition: feature.type == "integration"
    subtasks:
      - design_integration_interface
      - implement_adapter
      - add_integration_tests
      - update_integration_docs
```

This is readable by both humans (for validation) and machines (for execution).

**Learning from Execution**: Unlike SHOP2's static methods, agent systems can learn better decompositions from experience:

```python
class LearningTaskDecomposer:
    def __init__(self):
        self.patterns = load_initial_patterns()
        self.execution_history = []
    
    def decompose(self, task, state):
        # Use best-known pattern
        pattern = self.select_pattern(task, state)
        subtasks = pattern.decompose(task, state)
        
        # Record for learning
        self.execution_history.append({
            'task': task,
            'pattern': pattern,
            'subtasks': subtasks,
            'timestamp': now()
        })
        
        return subtasks
    
    def learn_from_outcome(self, task, success, cost):
        # Update pattern effectiveness estimates
        # Potentially generate new patterns
        pass
```

**Graduated Autonomy**: Use SHOP2's pattern of "baseline + enhancement":

1. **Level 0**: Human-written procedures (like HTN methods)
2. **Level 1**: Agent follows procedures, learns from deviations
3. **Level 2**: Agent proposes modifications to procedures, human approves
4. **Level 3**: Agent autonomously refines procedures based on outcomes

Start conservative (explicit procedures) and gradually increase autonomy as the system proves reliable.

## The Deeper Pattern: Executable Knowledge Representation

The gap between specification and execution reveals a fundamental challenge in AI: **How do you represent knowledge in a form that's both human-understandable and machine-executable?**

SHOP2's answer: **Hierarchical task networks as executable procedural knowledge**

This has several advantages:

**Human Readability**: HTN methods look like procedures/algorithms. Humans can read them, understand them, and validate them.

**Machine Executability**: Methods have precise semantics. SHOP2's algorithm can execute them deterministically.

**Composability**: Methods compose hierarchically. Complex procedures build from simpler ones.

**Modifiability**: You can modify one method without affecting others (assuming no unexpected interactions).

For agent systems, this suggests: **Invest in rich, explicit representations of procedural knowledge**, not just operational knowledge (what tools can do) or strategic knowledge (what goals to achieve).

## Key Insight: The Specification-Execution Gap is Fundamental

The gap between knowing what actions do and knowing how to accomplish tasks isn't a temporary limitation to be eliminated by better AI. It's a fundamental aspect of complex problem-solving.

Even if an agent perfectly understands all available actions, it still needs:
- Domain-specific insight about which action sequences are sensible
- Strategic knowledge about how to break down complex goals
- Procedural knowledge about standard operating procedures
- Heuristic knowledge about which alternatives to try first

SHOP2's success—99% problem-solving success rate—comes from encoding this knowledge explicitly as HTN methods, not from trying to discover it through search.

For agent systems: **Don't expect agents to discover good procedures from scratch**. Instead, encode procedural knowledge explicitly, make it learnable and refinable, and gradually improve it through experience.

The goal isn't to eliminate the specification-execution gap. It's to make the gap explicit, manageable, and traversable through a combination of human expertise and machine learning.
```

## SKILL ENRICHMENT

- **Task Decomposition Skills**: Dramatically improved by HTN method patterns—skills should declare standard decomposition strategies for common task types, not just individual action capabilities.

- **Architecture Design**: The hierarchical abstraction principle applies directly—system architectures should be designed as hierarchies of methods (task decomposition) not just modules (components), with explicit encoding of how high-level goals decompose into implementation subtasks.

- **Code Review**: The ordered decomposition principle suggests code should be reviewed in execution order (following data/control flow) rather than arbitrary file order, and the "what makes this wrong?" heuristics can be encoded as sort-by style rankings of common error patterns.

- **Debugging**: The ordered task decomposition approach suggests debugging by following execution order while maintaining definite state knowledge rather than reasoning about all possible states—use concrete execution traces, not abstract state spaces.

- **Project Planning**: HTN methods directly apply to project planning—encode standard procedures for different project types (greenfield vs. legacy, web vs. embedded, etc.) as hierarchical task networks, with explicit ordering constraints.

- **Security Auditing**: The multi-timeline approach suggests maintaining separate "timelines" for different security properties (authentication state, authorization state, data integrity, etc.) rather than monolithic security reasoning.

- **Testing Strategy**: The gap between specification and execution applies to tests—need both operational tests (does this function work?) and procedural tests (does this workflow accomplish the goal?), corresponding to unit tests vs. integration tests.

- **System Integration**: The external function call pattern with error handling applies directly—integration points should have timeouts, fallbacks, circuit breakers, and compensation logic for handling external system failures.

- **Performance Optimization**: The three optimization approaches (structural methods, sort-by heuristics, branch-and-bound) apply to performance work—start with architectural improvements, add heuristics for hotspots, use profiling/measurement only when heuristics aren't sufficient.

## CROSS-DOMAIN CONNECTIONS

**Agent Orchestration**: HTN planning's task decomposition hierarchy directly maps to agent orchestration patterns—high-level tasks decompose into skills, skills invoke tools, tools execute primitives. The ordered decomposition principle suggests orchestrators should maintain definite current state rather than reasoning about possible states, dramatically simplifying coordination logic.

**Task Decomposition**: SHOP2's most direct contribution—methods as executable representations of "standard operating procedures" provide a blueprint for how agent systems should represent task decomposition knowledge. The key insight: decomposition knowledge should be declarative, hierarchical, and separate from the execution engine.

**Failure Prevention**: The AIPS-2000 failure (incorrect domain descriptions) and the solution (automated translation + manual enhancement) provides a pattern for preventing failures in agent systems: generate baseline capabilities automatically (ensuring correctness), then enhance with human expertise (improving performance), maintaining traceability between specification and implementation.

**Expert Decision-Making**: Sort-by constructs and heuristic functions capture how experts make decisions under uncertainty—not by exhaustive search or formal optimization, but by encoding rules-of-thumb that identify promising alternatives quickly. The competition results prove that good heuristics + greedy search often outperforms optimal search.

**Search Space Pruning**: The exponential-to-polynomial complexity improvement from HTN methods demonstrates that encoding domain knowledge isn't "cheating"—it's essential for tractability. Agent systems should similarly use domain knowledge to prune search spaces rather than relying on brute-force search.

**Concurrency Handling**: Multi-timeline preprocessing shows how to handle concurrency without explicit temporal reasoning—by augmenting state with timestamps tracking read/write dependencies. This pattern applies broadly to any system managing concurrent activities (multi-agent coordination, parallel task execution, resource contention).

**Knowledge Representation**: The hand-tailorable vs. fully-automated tradeoff reveals that systems accepting human expertise outperform those insisting on learning everything from scratch. Agent systems should be designed for "graduated autonomy"—starting with human-provided procedures and gradually learning to modify/improve them.