# The Option Generation Problem: From Search to Pattern Matching

## The Bottleneck in Practical Reasoning

One of the most computationally critical components in the BDI architecture is option generation: determining which actions are applicable and relevant in the current situation. The authors identify this as the primary bottleneck for real-time performance:

"We have given no indication of how the option generator and deliberation procedures can be made sufficiently fast to satisfy the real-time demands placed upon the system."

The challenge: In any reasonably complex domain, there are combinatorially many possible action sequences. The classical planning approach—search through this space to find sequences achieving desired goals—is computationally prohibitive when "the rate at which computations and actions can be carried out is within reasonable bounds to the rate at which the environment evolves."

The option generator must answer: "Given current beliefs and desires, which plans are relevant and applicable?" This must be fast enough that the answer remains valid—the environment hasn't changed significantly during the computation itself.

## Two-Stage Filtering: Invocation and Preconditions

The solution presented is a two-stage filtering process:

**Stage 1: Invocation Condition Matching**
"The conditions under which a plan can be chosen as an option are specified by an invocation condition... the invocation condition specifies the 'triggering' event that is necessary for invocation of the plan."

This narrows the search space dramatically. Rather than considering all plans in the library, only plans whose invocation conditions match current events are considered.

Example: Event queue contains:
```
[wind_change(sector_3, 45_knots),
 achieve(land(QF001, 19:00)),
 aircraft_entered(QF123, sector_7)]
```

Invocation condition matching returns only plans invoked by these specific events:
- Plans invoked by wind_change events
- Plans invoked by landing goals
- Plans invoked by aircraft entry events

All other plans (hundreds or thousands) are ignored. This is pattern matching, not search—computationally efficient.

**Stage 2: Precondition Checking**
"The precondition specifies the situation that must hold for the plan to be executable."

Of the plans whose invocation conditions matched, check which have preconditions satisfied by current beliefs. Example:

Plan: Land_High_Wind
- Invocation: achieve(land(Aircraft, ETA))
- Precondition: wind_speed(Aircraft_Sector, Speed), Speed > 40
- Body: [extend_approach, reduce_speed, land]

Plan: Land_Normal
- Invocation: achieve(land(Aircraft, ETA))
- Precondition: wind_speed(Aircraft_Sector, Speed), Speed ≤ 40
- Body: [standard_approach, maintain_speed, land]

Both plans are invoked by the landing goal, but only one has preconditions satisfied. Precondition checking eliminates inapplicable options.

## Why This Is Fast: The Indexing Structure

The two-stage process works efficiently because:

**1. Event-based indexing**: Plans can be indexed by their invocation condition patterns. When event E occurs, lookup plans[E] returns all relevant plans directly. No iteration through the entire plan library.

**2. Precondition simplicity**: Preconditions are simple conjunctions of ground literals. Checking if current beliefs satisfy a precondition is pattern matching against the belief database, not theorem proving.

**3. Small working set**: At any moment, only a small subset of plans have invocation conditions matching current events. Of these, only a subset have preconditions satisfied. The deliberation function chooses among perhaps 2-5 options, not thousands.

Compare to classical planning:
- **Classical**: Search space is all possible action sequences. Branching factor = number of applicable actions at each step. Search depth = plan horizon. Total states = branching_factor^depth.
- **Plan library**: Match events to plans. Filter by preconditions. Select among options. Complexity = O(plans_matching_event) << O(branching_factor^depth).

The authors note: "This and a wide class of other real-time application domains exhibit a number of important characteristics," specifically that "the rate at which computations and actions can be carried out is within reasonable bounds to the rate at which the environment evolves."

Fast option generation is what makes this possible. If option generation took minutes, the environment would change during the computation, invalidating the generated options.

## The Role of Events: Controlling Attention

The event queue is central to efficient option generation: "Three dynamic data structures representing the agent's beliefs, desires, and intentions, together with an input queue of events."

Events control the agent's attention:

**External events**: Environmental changes detected by sensors (wind_change, aircraft_entered, runway_closed)

**Internal events**: Goal adoption and plan status changes (achieve(G), plan_succeeded(P), plan_failed(P))

The event queue determines which plans are considered: only those whose invocation conditions match queued events. This implements a form of focus of attention—the agent doesn't reconsider everything at every moment, only things relevant to current events.

The authors emphasize: "By posting appropriate events to the event queue the procedure can determine, among other things, which changes to the intention structure will be noticed by the option generator."

This is a control mechanism: post-intention-status can choose which changes trigger option generation. If intention stack completes successfully, post event plan_succeeded(P). If an intention becomes impossible, post event plan_failed(P). These events trigger option generation for response plans (e.g., plans invoked by plan failures to handle errors).

Critically, not all changes trigger events. A minor update to beliefs might not post any event, so option generation isn't invoked. This prevents the continuous reconsideration problem (Failure Mode 2).

## Deliberation After Option Generation: The Selection Function

Once option generation has filtered to a small set of applicable plans, deliberation selects among them:

```
options := option-generator(event-queue);
selected-options := deliberate(options);
update-intentions(selected-options);
```

The deliberate function is the agent's decision-making. The authors don't specify its implementation, noting only: "An agent can now make use of the chosen deliberation function to decide the best course(s) of action."

Possible deliberation strategies:

**1. Priority-based**: Each plan has a priority. Select highest priority applicable plan. Simple and fast, but requires careful priority assignment.

**2. Utility-based**: Each plan (or plan+context) has an expected utility. Select plan with highest expected utility. More flexible but requires utility estimation.

**3. Heuristic-based**: Use domain-specific heuristics to rank options. "Prefer fuel-efficient landing unless time-critical, then prefer fast landing."

**4. Meta-level reasoning**: Estimate value of deliberation itself. If expected benefit of further deliberation < cost of delay, act on current best option.

Crucially, deliberation operates on a small pre-filtered set. Even if deliberation is expensive (e.g., Monte Carlo simulation to estimate utilities), it's tractable because option generation reduced the space to 2-5 options, not thousands.

## The Meta-Level Architecture: When to Generate Options

The abstract interpreter shows option generation occurring once per cycle:

```
repeat
  options := option-generator(event-queue);
  selected-options := deliberate(options);
  update-intentions(selected-options);
  execute();
  get-new-external-events();
  drop-successful-attitudes();
  drop-impossible-attitudes();
end repeat
```

But when should this cycle run? If too frequent, the system wastes time on unnecessary option generation. If too infrequent, the system is unresponsive to environmental changes.

The event queue provides the answer: the cycle runs when events occur. If event queue is empty (nothing has changed since last cycle), the agent continues executing current intentions without generating new options. This is the commitment aspect—the agent doesn't reconsider unless something significant happens.

The post-intention-status procedure controls what counts as "something significant":