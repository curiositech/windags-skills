# Context-Driven Plan Selection: Programming Agents Through Situated Know-How

## The Core Paradigm Shift

The fundamental innovation in AgentSpeak is not merely that agents have plans—many systems have plans. The innovation is that **agents are programmed by giving them a library of context-sensitive know-how, not a single monolithic procedure**. As the authors state: "Programming in AgentSpeak thus involves encoding such plans, and AgentSpeak provides a rich, high-level language that allows programmers to capture this 'procedural knowledge' in a transparent manner" (p. xiii).

The essential structure is this: multiple plans can respond to the same triggering event, but each plan has a **context condition** that determines whether it is applicable in the current situation. When an event occurs (either externally through perception, or internally through goal adoption), the agent:

1. Identifies all plans whose trigger matches the event
2. Evaluates the context conditions of these plans against current beliefs
3. Selects one applicable plan (the "intention")
4. Begins executing that plan's body

This creates a fundamentally different programming model from both procedural and object-oriented languages. In Java, when you call a method, you know exactly what code will execute. In AgentSpeak, when you adopt a goal, **which code executes depends on what the agent currently believes about its situation**.

## Why This Matters for Intelligent Systems

This addresses a critical problem in building adaptive systems: **the same high-level goal may require completely different approaches depending on circumstances**, and we cannot enumerate all possible circumstances at design time.

Consider the authors' motivating scenario from the Preface: traveling to the airport. You start with a plan involving the bus. The bus doesn't arrive (belief change: `+busLate`). This triggers a new plan: take a taxi. The taxi driver doesn't know the terminal (belief: `+driverUncertain`). This triggers information-seeking behavior: call the airport. Each decision point involves selecting from alternative plans based on what you currently believe about the world.

In AgentSpeak, this would be encoded as something like:

```
// Plan 1: Default approach when not late
+!atAirport : not(busLate) <- waitForBus; boardBus.

// Plan 2: Alternative when bus is late  
+!atAirport : busLate <- hailTaxi; !getInTaxi.

// Plan 3: What to do once in taxi, if uncertain about terminal
+!getInTaxi : driverUncertain <- callAirportInfo; !getInTaxi.

// Plan 4: What to do once in taxi, if terminal known
+!getInTaxi : terminalKnown <- tellDriver; payDriver.
```

The same goal `!atAirport` invokes different plans in different contexts. The agent doesn't need a master controller deciding "should I use plan 1 or plan 2?"—the context conditions themselves encode this decision logic, distributed across the plan library.

## The Mechanics: Triggers, Contexts, and Bodies

Every AgentSpeak plan has three parts:

**Trigger**: Defines what event this plan responds to. Triggers can be:
- `+belief`: A new belief was added (perception or communication)
- `-belief`: A belief was removed  
- `+!goal`: An achievement goal was adopted (something to make true)
- `-!goal`: An achievement goal was dropped
- `+?query`: A test goal was adopted (something to check)

**Context**: A logical condition over the agent's beliefs. The plan is only **applicable** if this condition is true when evaluated. An empty context means "always applicable." The authors note: "In the context part of plans, we can define complex conditions which an agent uses to determine whether or not to choose a particular plan for a given event. In particular, an agent can have multiple plans triggered by the same event which deal with this event in different ways: thus an agent can have multiple different responses to events, and can choose between these depending on the situation" (p. 9).

**Body**: A sequence of actions, sub-goal adoptions, belief additions/removals, and control structures. This is the "recipe" for handling the triggering event, assuming the context holds.

## Implications for Agent System Design

### 1. Skill Decomposition Should Mirror Decision Contexts

When building an orchestration system with 180+ skills, don't organize skills solely by functional domain (database skills, API skills, etc.). Instead, consider organizing by **decision context**. A skill like "fetch user data" might have multiple implementations:
- One for when local cache is fresh
- One for when cache is stale but network is unreliable (return stale data with warning)
- One for normal operation (fetch from database)
- One for when database is down (fetch from backup service)

Each becomes a plan with the same trigger (`+!getUserData`) but different contexts (`cacheAge < threshold`, `cacheStale & networkUnreliable`, etc.).

### 2. Context Evaluation Is Where Intelligence Happens

The authors emphasize that context conditions are evaluated against the agent's **current beliefs**. This means the intelligence of the system is not in a central decision-maker, but distributed across the context conditions of all plans. When designing multi-agent systems:

- **Context conditions should be simple to evaluate** (boolean expressions over beliefs) but **expressive enough to capture decision logic**
- Beliefs should represent actionable information—not just raw data, but interpreted states ("server overloaded", not just "cpu=95%")
- The plan library becomes your "policy base"—adding a new plan is like adding a new conditional response strategy

### 3. Handling Ambiguity: Multiple Applicable Plans

A crucial design question: what if multiple plans have contexts that are all true? The authors' answer is that the AgentSpeak interpreter maintains an "applicable plans" set and selects one—typically the first applicable plan found, though Jason allows custom selection functions.

This has important implications:
- **Plan ordering matters**: More specific plans should come before general fallback plans
- **Context conditions should be mutually exclusive when possible**: If plans represent truly different strategies, their contexts should ideally not overlap
- **When contexts do overlap**, it means the agent has multiple valid choices—this can be exploited for parallel exploration or probabilistic selection

### 4. The Library Metaphor: Plans as Reusable Knowledge

The authors consistently refer to the "plan library" rather than "the agent's code." This is deliberate. Plans are modular units of situated know-how that can be:
- **Reused across agents**: Standard plans for common scenarios (error recovery, negotiation protocols)
- **Composed**: Plans invoke sub-goals, which trigger other plans
- **Extended**: New plans can be added without modifying existing ones—you're extending the library, not rewriting the program
- **Shared**: Agent communication can include sharing plans (though Jason doesn't emphasize this)

For agent orchestration systems, think of your skill library as providing "primitives" (atomic actions) and "patterns" (plans that compose these actions). The context conditions in patterns encode when each pattern is appropriate.

## Boundary Conditions and Limitations

### When Context-Based Selection Fails

The paradigm breaks down when:

1. **Contexts are too expensive to evaluate**: If checking whether a plan is applicable requires costly computation or I/O, the selection phase becomes a bottleneck. Solution: maintain pre-computed "state summaries" as beliefs.

2. **Context information is unavailable**: If the agent lacks the beliefs needed to distinguish between plans, it either picks arbitrarily or fails. This is the "closed-world assumption" problem. Solution: explicit plans for information-gathering when key beliefs are absent.

3. **Too many plans match**: If dozens of plans have true contexts, selection becomes arbitrary. Solution: use plan metadata (priorities, costs, past success rates) to guide selection—Jason supports this through plan annotations.

4. **Contexts are interdependent**: If evaluating context A requires information that would be computed in plan B's execution, you have circularity. Solution: separate diagnostic beliefs from action-triggering beliefs.

### The Expressiveness/Decidability Tradeoff

Context conditions in Jason are expressed as logical formulas over beliefs. The authors provide formal semantics in Chapter 10, but pragmatically:
- **Simple contexts** (conjunctions of literals) are fast to evaluate and easy to reason about
- **Complex contexts** (disjunctions, negations, quantifiers) can become hard to debug and may have subtle interactions

There's a temptation to encode complex decision logic in contexts. Resist this. If context logic becomes byzantine, it should probably be factored into separate plans that establish intermediate beliefs.

## Connections to Distributed Agent Coordination

When multiple agents each use context-based plan selection, coordination emerges from:

1. **Shared environment**: All agents perceive state changes (beliefs). A state change that makes one agent's plan applicable might disable another agent's plan.

2. **Communication as belief update**: When Agent A tells Agent B something, B adds a belief. This may make previously inapplicable plans suddenly applicable.

3. **Delegation through goal adoption**: When Agent A achieves a goal through Agent B, B triggers plans for that goal—which plans execute depends on B's local context, not A's.

This creates a powerful emergent property: **coordination strategies are encoded in plan contexts, not in a central coordinator**. If agents have plans like:

```
+!processItem(X) : not(overloaded) & hasCapacity <- process(X).
+!processItem(X) : overloaded <- .send(lessLoadedPeer, achieve, processItem(X)).
```

Then load balancing emerges from local context-based decisions, not global load-balancing logic.

## Practical Implications for Orchestration Systems

For WinDAGs-like systems:

1. **Routing should be context-aware**: Instead of static routing tables, have agents with plans for "where to send this query" with contexts like "database_available", "cache_hit_rate > threshold", etc.

2. **Failure handling should be first-class**: Have explicit plans triggered by failure events (`-!goal`) with contexts indicating what recovery strategy is appropriate.

3. **Skills should declare preconditions as contexts**: A skill "deploy to production" might have contexts: `allTestsPassed & approvalReceived & productionHealthy`. The skill only executes when conditions are right.

4. **Dynamic skill composition**: High-level goals like `!completeUserRequest` trigger plans that compose multiple skills. Which skills, in what order, depends on context.

5. **Observable behavior through belief sharing**: If agents share beliefs about system state, other agents' plan selections become observable and predictable—enabling implicit coordination.

## Conclusion: Separation of Policy and Mechanism

The deepest insight is that **context-driven plan selection separates policy (which strategy to use) from mechanism (how to execute that strategy)**. Traditional programming intermingles these: if-statements inside functions make decisions inseparable from actions.

AgentSpeak externalizes the decision: the "if" is in the context, the "then" is in the body. This makes policies:
- **Visible**: You can read the plan library and see all conditional strategies
- **Modular**: Adding a new strategy means adding a new plan, not modifying existing code  
- **Verifiable**: Formal methods can reason about which contexts are reachable, whether contexts overlap, etc.

For building intelligent orchestration systems, this is transformative: you're not programming agents to follow specific procedures—you're giving them knowledge about how to operate in different situations, and letting them figure out which situation they're in.