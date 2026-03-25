# Plans as Compiled Practical Reasoning: From Logic to Libraries

## The Computational Complexity Problem for Real-Time Agents

The BDI logic presented by Rao and Georgeff provides a formal specification of rational agency, but it has a critical flaw for practical implementation: "The architecture is based on a (logically) closed set of beliefs, desires, and intentions and the provability procedures required are not computable. Moreover, we have given no indication of how the option generator and deliberation procedures can be made sufficiently fast to satisfy the real-time demands placed upon the system."

This is not a minor technical issue but a fundamental obstacle. If an agent must reason from first principles at every decision point—constructing plans by theorem proving, verifying preconditions by logical inference, checking consistency of intentions—it will be far too slow for real-time control. The environment will change during deliberation, invalidating the assumptions on which the agent is reasoning.

The solution the authors propose is profound: represent the structure of practical reasoning not as axioms to be reasoned over but as compiled knowledge in the form of plans. Plans are not ad-hoc data structures but "a special form of beliefs" about means-end relationships, pre-compiled for efficient execution.

## Plans as Representing Beliefs About Means-End Relations

The key insight: "We represent the information about the means of achieving certain future world states and the options available to the agent as plans, which can be viewed as a special form of beliefs."

This needs unpacking. In the full BDI logic, an agent would reason:

1. I believe the world is in state S
2. I desire to achieve state G
3. I believe that action sequence [a₁, a₂, ..., aₙ] achieves G when executed in state S
4. Therefore, I should intend [a₁, a₂, ..., aₙ]

Steps 3-4 require search through a vast space of possible action sequences, checking preconditions and effects for each. This is the classical planning problem, computationally expensive even for small domains.

The plan library approach compiles step 3 in advance: "Intuitively, plans are abstract specifications of both the means for achieving certain desires and the options available to the agent."

Rather than deriving at runtime that "action sequence [a₁, a₂, ..., aₙ] achieves G in context S," the agent has pre-encoded this knowledge as a plan:

```
Plan: AchieveG
Invocation condition: desire(G)
Precondition: state_matches(S)
Body: [a₁, a₂, ..., aₙ]
```

The belief "this action sequence achieves this goal in this context" is compiled into the plan structure itself. At runtime, the agent need only pattern-match current desires and beliefs against plan invocation conditions and preconditions, vastly faster than first-principles planning.

## The Three-Part Structure of Plans

Plans in PRS/dMARS have three components:

**1. Invocation Condition**: "The conditions under which a plan can be chosen as an option are specified by an invocation condition... the invocation condition specifies the 'triggering' event that is necessary for invocation of the plan."

This determines when the plan is relevant. Invocation conditions respond to events:
- New goals adopted (e.g., achieve(land(QF001, 19:00)))
- Environmental changes (e.g., wind_change(sector_3, 45_knots))
- Plan failures (e.g., plan_failed(land_normal))

The invocation condition makes the plan library reactive: plans activate in response to situations rather than being explicitly called.

**2. Precondition**: "The precondition specifies the situation that must hold for the plan to be executable."

This determines when the plan is applicable. While the invocation condition checks "is this plan relevant to current events?", the precondition checks "is this plan feasible in the current state?"

For example:
- Invocation: achieve(land(Aircraft, ETA))
- Precondition: aircraft_altitude(Aircraft, Alt), Alt > 5000, runway_clear()

The plan is invoked by the landing goal but only applicable when the aircraft is above 5000 feet and the runway is clear.

**3. Body**: "Each plan has a body describing the primitive actions or subgoals that have to be achieved for plan execution to be successful."

The body specifies what to do. It can contain:
- Primitive actions (directly executable operations like speed_change(Aircraft, 250))
- Subgoals (objectives to be achieved by invoking other plans like achieve(intercept(waypoint_3)))
- Conditionals (branching based on beliefs)
- Loops (iteration until conditions are met)

The body represents the compiled knowledge about how to achieve the invocation condition given the precondition.

## How Plans Encode Beliefs, Desires, and Intentions

Plans aren't merely convenient data structures—they encode the relationships among beliefs, desires, and intentions:

**Plans encode beliefs about means**: The body of a plan represents the agent's belief that "this action sequence is a means to achieve this goal in this context." The precondition represents beliefs about when this means is feasible.

**Plans respond to desires**: The invocation condition often triggers on goal adoption. When a desire becomes active (the agent adopts a goal), plans that achieve that goal become candidate options.

**Plans generate intentions**: When a plan is selected and executed, its body becomes the current intention—the committed action sequence the agent is pursuing.

As the authors note: "The intention that the system forms by adopting certain plans of action is represented implicitly using a conventional run-time stack of hierarchically related plans (similar to how a Prolog interpreter handles clauses)."

This is computationally elegant: intentions don't need explicit representation as logical formulas. The call stack IS the intention structure—it implicitly represents the commitment to completing the current plan and its parent plans.

## Multiple Plans Per Goal: Pre-Compiled Deliberation

A critical feature: multiple plans can have the same invocation condition. When a goal is adopted, all plans that achieve that goal become options.

For example, for the goal achieve(land(Aircraft, ETA)), there might be multiple plans:
- land_fast: High speed, steep descent (saves time, wastes fuel)
- land_efficient: Optimal speed, gradual descent (saves fuel, takes time)
- land_emergency: Maximum speed, immediate descent (emergency situations)

Each has different preconditions (land_emergency requires emergency_declared), different bodies (different action sequences), and different characteristics (speed vs. fuel efficiency).

The deliberation function selects among these options based on current priorities and constraints: "The deliberator selects a subset of options to be adopted and adds these to the intention structure."

Crucially, this deliberation is not reasoning from first principles. The plans encode pre-compiled strategies. The deliberator merely chooses among them based on current utility function or heuristics. This is far cheaper than generating plans from scratch.

## The Option Generator: Fast Pattern Matching

The option-generation phase of the interpreter:

```
options := option-generator(event-queue);
```

This consults the event queue and returns plans whose invocation conditions match current events. The implementation is essentially pattern matching: match event patterns against plan invocation conditions.

For efficiency, plans can be indexed by their invocation conditions, making lookup fast. When event wind_change(sector_3, 45_knots) occurs, only plans with invocation conditions mentioning wind changes in sector 3 need to be considered.

The precondition check then filters: of the plans whose invocation conditions matched, which have preconditions satisfied by current beliefs?

This two-stage process (invocation matching, precondition filtering) quickly reduces the space of potential plans to a small set of applicable options, without expensive search or logical inference.

## The Hierarchical Intention Structure: Plans Call Plans

Plans can contain subgoals that invoke other plans: "The body describing the primitive actions or subgoals that have to be achieved for plan execution to be successful."

This creates a hierarchical intention structure. Consider a high-level plan:

```
Plan: SequenceAircraft
Invocation: achieve(optimal_sequence(Aircraft_List))
Body:
  achieve(calculate_arrival_times(Aircraft_List))
  achieve(optimize_sequence(ETAs))
  for each Aircraft in Sequence:
    achieve(assign_ETA(Aircraft, ETA))
```

Each achieve() in the body triggers option generation for a new subgoal, potentially invoking further plans. The runtime stack captures this hierarchy:

```
[SequenceAircraft
  [CalculateArrivalTimes
    [EstimateWindField
      [RequestWindData(QF001)]  <- Currently executing
    ]
  ]
]
```

The stack represents nested intentions: to sequence aircraft, I intend to calculate arrival times, which requires estimating wind field, which requires requesting wind data. When RequestWindData completes, execution pops back to EstimateWindField, then to CalculateArrivalTimes, etc.

This implicit representation of intentions through stack structure is vastly more efficient than explicitly maintaining logical formulas describing all current commitments.

## Modularity and Incremental Development

A key practical benefit highlighted by the authors: "The ability to construct plans that can react to specific situations, can be invoked based on their purpose, and are sensitive to the context of their invocation facilitates modular and incremental development."

Because plans are invoked by pattern matching on events and goals rather than explicit calls, they are loosely coupled:

**Adding a new plan doesn't require modifying existing plans**: If you add a new plan for achieve(land(Aircraft, ETA)) with better fuel efficiency, existing plans that post this as a subgoal automatically have the new option available. You don't need to find and modify every place that might want to land an aircraft.

**Plans can be made increasingly specific**: "It allows users to concentrate on writing plans for a subset of essential situations and construct plans for more specific situations as they debug the system."

You might start with a general landing plan:
```
Plan: LandGeneric
Invocation: achieve(land(Aircraft, ETA))
Precondition: aircraft_operational(Aircraft)
Body: [descend, approach, touchdown]
```

Then add more specific plans as edge cases are discovered:
```
Plan: LandEmergency
Invocation: achieve(land(Aircraft, ETA))
Precondition: emergency_declared(Aircraft)
Body: [alert_ground, clear_runway, fast_descend, emergency_approach, touchdown]
```

The more specific plan (with more restrictive preconditions) will be preferred when applicable, while the general plan handles normal cases. This enables graceful refinement of behavior without wholesale system rewrites.

## Plans vs. First-Principles Planning: The Tradeoff

The plan library approach trades generality for speed:

**What is lost:**
- **Optimality**: Pre-compiled plans may not be optimal for the current situation. A planner reasoning from first principles could potentially find better solutions.
- **Novel situations**: If a situation arises that doesn't match any plan's preconditions, the system is stuck. A first-principles planner could synthesize a novel solution.
- **Correctness guarantees**: Plans are hand-crafted and may contain bugs. An automated planner with verified semantics would have stronger correctness properties.

**What is gained:**
- **Speed**: Pattern matching and plan execution are orders of magnitude faster than search and inference.
- **Predictability**: Execution time is bounded by plan structure rather than search space size.
- **Human understandability**: Plans are written in a language domain experts can understand and debug.
- **Graceful degradation**: If deliberation time is limited, the system can still act using whatever plans match, rather than failing to find any solution.

The key insight: "When FORTRAN rules that modelled pilot reasoning were replaced with plans, the turnaround time for changes to tactics in an air-combat simulation system improved from two months to less than a day."

Plans operate at the right level of abstraction for domain experts to encode their knowledge directly, without requiring expertise in automated planning or logical reasoning systems.

## The Representational Choice: Ground Literals Only

The practical BDI system makes a critical representational restriction: "We explicitly represent only beliefs about the current state of the world and consider only ground sets of literals with no disjunctions or implications. Intuitively, these represent beliefs that are currently held, but which can be expected to change over time."

This means:
- Beliefs are facts: aircraft_altitude(QF001, 8000), runway_clear(runway_3)
- NOT logical formulas: ∀x. aircraft(x) ⇒ has_altitude(x)
- NOT disjunctions: runway_clear(runway_2) ∨ runway_clear(runway_3)
- NOT implications: if wind_speed > 40 then use_long_runway

This restriction has profound implications:

**Belief update becomes simple**: New sensor data adds or removes ground literals. No need for truth maintenance or non-monotonic reasoning.

**Precondition checking becomes simple**: Check if required literals are present in the belief set. No need for theorem proving.

**Consistency checking becomes simple**: Check for contradictory literals. No need to detect logical inconsistencies in complex formulas.

The cost: Cannot represent disjunctive or uncertain beliefs ("either runway 2 or runway 3 is clear but I don't know which"). Cannot represent conditional knowledge ("if wind from north, use runway 36"). These must be encoded procedurally in plan bodies rather than declaratively in beliefs.

## Plans as Compiled Conditional Knowledge

The restriction to ground literal beliefs pushes conditional knowledge into plans. Instead of:

```
Belief: if wind_direction == north then optimal_runway == runway_36
```

This becomes:

```
Plan: SelectRunway
Invocation: achieve(optimal_runway(R))
Body:
  wind_direction(Dir)
  if Dir == north:
    R := runway_36
  else if Dir == south:
    R := runway_18
  else:
    ...
```

The conditional knowledge about wind direction and runway selection is compiled into the plan's body rather than represented declaratively. This makes it executable but not inspectable or reasoned about.

This is a conscious tradeoff: executability over reflectivity. The system can execute conditional reasoning quickly but cannot explain or reason about its conditional knowledge as a first-class object.

## For WinDAGs: Skills as Compiled Plans

In a DAG-based orchestration system, skills map directly to the plan concept:

**Skill definition = Plan structure**:
- **Invocation condition**: What triggers this skill (which node in DAG, what event)
- **Precondition**: When this skill is applicable (input requirements, resource availability)
- **Body**: What this skill does (the actual computation)

**Skill library = Plan library**: The set of available skills is the compiled knowledge about how to achieve various objectives. When the orchestrator reaches a node requiring capability C, it pattern-matches against skills that provide C.

**Multiple skills per capability = Multiple plans per goal**: Different skills might provide the same capability with different tradeoffs:
- debug_fast: Quick surface-level check (fast, shallow)
- debug_deep: Comprehensive analysis (slow, thorough)
- debug_ai: Use LLM to generate hypotheses (resource-intensive, creative)

The orchestrator's deliberation selects among applicable skills based on current constraints and priorities.

**Skill composition = Hierarchical plans**: Complex skills can invoke other skills as subskills, creating a hierarchy identical to the plan/subgoal hierarchy. The execution stack represents nested skill invocations.

**Key advantage**: Like the BDI plan approach, skill libraries enable domain experts to encode strategies without reasoning expertise. A debugging expert can write skills encoding their debugging strategies without understanding formal planning or logical inference.

## The Meta-Knowledge Problem: Plans Don't Explain Themselves

A limitation: Plans encode knowledge but don't make it inspectable. If a plan fails, the system knows "this approach didn't work" but not WHY this approach was chosen or WHAT assumptions it relied on.

For example, if land_efficient fails, we know:
- This particular landing plan failed
- We should try a different plan or reconsider the landing goal

But we don't automatically know:
- Why we thought land_efficient would work (what beliefs justified this choice)
- What assumption was violated (which precondition check was inaccurate)
- How to prevent this failure in future (what general lesson to learn)

This knowledge is implicit in the plan structure but not explicitly represented. Adding meta-level annotations (rationale, assumptions, failure explanations) could address this, at the cost of additional complexity.

For debugging agent systems, this suggests: plan/skill libraries should include not just code but documentation of assumptions, expected contexts, and failure modes. The practical advantage of plans (human-understandable strategies) should extend to human-understandable failure analysis.

## When Plan Libraries Break Down

The plan library approach has limits:

**1. Truly novel situations**: If the environment presents a situation no plan anticipated, the system is stuck. First-principles reasoning would be needed to synthesize a new plan.

**2. Plan library explosion**: If the domain has enormous variation, the plan library becomes unwieldy. Every significant situation variation needs its own plan variant.

**3. Plan maintenance**: As the environment evolves, plans become obsolete. Keeping the library updated requires ongoing human effort.

**4. Conflicting abstractions**: Different plans may make incompatible assumptions about how the world works, leading to subtle interactions when plans call each other.

The framework works best when:
- The domain is well-understood and situations are anticipated
- Variation is manageable (not combinatorially explosive)
- The environment evolves slowly relative to development cycles
- Plans operate at similar levels of abstraction

These conditions often hold for operational systems (air traffic control, telecommunications management) but less so for open-ended domains (general household robotics, open-world game AI).