## BOOK IDENTITY
**Title**: Programming Multi-Agent Systems in AgentSpeak using Jason  
**Author**: Rafael H. Bordini, Jomi Fred Hübner, Michael Wooldridge  
**Core Question**: How do we build autonomous software agents that can pursue goals flexibly, respond to changing conditions, recover from failures, and coordinate with other agents—all while being programmed through declarative know-how rather than imperative procedures?  
**Irreplaceable Contribution**: This book provides the only comprehensive treatment of BDI (Belief-Desire-Intention) agent programming as a practical engineering discipline. Unlike theoretical treatments of rational agency or general AI frameworks, it offers a complete, executable semantics for goal-directed agents that seamlessly blend reactive and proactive behavior. The key insight is that **agents should be programmed by encoding procedural knowledge (plans) rather than procedures**, enabling the same goal to be achieved through different means depending on context, and allowing graceful degradation when plans fail.

## KEY IDEAS

1. **Plan-Based Autonomy Through Context-Sensitive Know-How**: The fundamental programming paradigm shift is from writing procedures that specify *how* to do things step-by-step, to encoding *know-how*—multiple alternative plans for achieving goals, each with context conditions determining applicability. The same goal invocation dynamically selects different implementations based on the agent's beliefs about its current situation. This enables true autonomy: you delegate goals, not procedures.

2. **Seamless Integration of Reactive and Proactive Behavior**: The "triggering event" mechanism allows plans to respond both to goal adoption (proactive, deliberative) and to belief changes (reactive, responsive). The reasoning cycle continuously interleaves perception, belief updating, event generation, plan selection, and execution. This solves the "integration problem"—how to build systems that both pursue goals systematically and respond to unexpected changes without requiring explicit switching between modes.

3. **Graceful Degradation Through Plan Failure and Re-planning**: When a plan fails (action fails, context becomes false, sub-goal cannot be achieved), the system doesn't crash—it triggers failure events that can themselves have handling plans. If no handler exists, the system backtracks to try alternative plans for the same triggering event. This creates cascading resilience: failure at any level propagates upward until a recovery strategy is found or the original goal is abandoned.

4. **Knowledge-Level Communication Enables Distributed Problem-Solving**: Agents communicate not through method calls or byte streams, but through speech acts that convey mental attitudes—beliefs, goals, queries. The `.send()` performatives (tell, achieve, askOne, askAll) allow agents to share information, delegate goals, and coordinate plans. This enables emergent cooperation: agents can construct joint plans, negotiate about conflicting goals, and recover from communication failures.

5. **The Gap Between Declarative Goals and Procedural Execution**: AgentSpeak explicitly represents this gap through the distinction between achievement goals (`!goal`) and test goals (`?query`). Achievement goals trigger deliberation—finding and executing plans. Test goals merely query beliefs. The plan library is the bridge: it encodes operational knowledge about how abstract goals map to concrete actions in specific contexts. This separation enables both flexibility (multiple ways to achieve goals) and verifiability (formal semantics for what agents believe, intend, and achieve).

## REFERENCE DOCUMENTS

### FILE: context-driven-plan-selection.md
```markdown
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
```

### FILE: reactive-proactive-integration.md
```markdown
# The Reasoning Cycle: Integrating Reactive and Proactive Behavior

## The Integration Challenge

The authors identify a fundamental challenge in building autonomous systems: "Designing a system which simply responds to environmental stimuli in a reflexive way is not hard—we can implement such a system as a lookup table, which simply maps environment states directly to actions. Similarly, developing a purely goal-driven system is not hard. (After all, this is ultimately what conventional computer programs are: they are just pieces of code designed to achieve certain goals.) However, implementing a system that achieves an effective balance between goal-directed and reactive behaviour turns out to be hard. This is one of the key design objectives of AgentSpeak" (p. 5).

This is the **integration problem**: how do you build a system that simultaneously:
- Pursues long-term goals systematically (proactive)
- Responds to unexpected environmental changes (reactive)
- Doesn't freeze when something unexpected happens
- Doesn't get distracted from important goals by every minor stimulus

Traditional software architectures fail here. Interrupt-driven systems are reactive but not goal-directed. Procedural programs pursuing goals are brittle when preconditions change. Trying to manually code "if something unexpected happens, do X" leads to exponential complexity—you can't anticipate all contingencies.

## The AgentSpeak Solution: Event-Driven Deliberation

AgentSpeak solves this through a **unified event mechanism** where both external perceptions and internal goal adoptions are treated as events triggering plan selection. The reasoning cycle (detailed in Chapter 4) continuously:

1. **Perceives environment**: Updates beliefs based on sensors
2. **Generates events**: Both from belief changes and from pending goals
3. **Selects applicable plans**: Matches events to plan triggers, evaluates contexts
4. **Executes intentions**: Runs plan bodies step-by-step
5. **Manages intention stack**: Handles sub-goal decomposition and plan failure

The critical insight: **reactivity and proactivity use the same mechanism**. There's no separate "reactive module" and "deliberative module" competing for control. Both are handled through event triggers:

```
// REACTIVE: Respond when environment changes
+fire_detected : true <- activate_sprinklers; alert_occupants.

// PROACTIVE: Pursue a goal
+!secure_building : after_hours <- lock_all_doors; arm_alarm.

// HYBRID: Reactive response that triggers proactive goal
+intruder_detected : armed <- !investigate_intruder.
```

## The Reasoning Cycle in Detail

The authors provide a detailed operational semantics in Chapter 4, but the intuition is:

### Step 1: Perception (Belief Update)

The agent senses its environment and updates beliefs. Critically, belief changes generate events:
- Adding belief `B` generates event `+B`
- Removing belief `B` generates event `-B`

This is where reactivity enters the system. If the environment changes (sensor value changes, message arrives, timer expires), beliefs update, events are generated, and plans can respond.

### Step 2: Event Selection  

The agent has a queue of pending events (from perception, from previous plan steps that adopted sub-goals, from message reception). It selects one event to handle—Jason allows custom selection functions, defaulting to FIFO.

This is a key degree of freedom: **event prioritization determines what the agent pays attention to**. A simple priority scheme might be:
1. Failures (negative goal events `-!goal`)
2. External belief updates (perceptions)  
3. Internal goal adoptions
4. Test goals (queries)

### Step 3: Plan Retrieval and Applicability

Given event E, retrieve all plans with trigger matching E. For each plan, evaluate its context condition against current beliefs. This produces a set of **applicable plans**—plans that could handle this event in the current situation.

This is where proactive choice happens: multiple plans might achieve the same goal, but in different ways. Context evaluation selects which way is appropriate now.

### Step 4: Intention Selection

If applicable plans exist, select one (Jason allows custom selection). Create an "intention"—a stack of partially executed plans. The selected plan's body becomes the top of the stack.

If the event was `+!goal` (achievement goal adoption), the intention's purpose is to make `goal` true. The system will keep trying alternative plans if this one fails.

### Step 5: Intention Execution

Execute one step from the currently active intention. A "step" might be:
- Primitive action (modifies environment)
- Internal action (e.g., `.print()`, belief manipulation)
- Sub-goal adoption (adds goal to event queue)
- Test goal (queries beliefs, fails if not satisfied)

After each step, control returns to Step 1. The agent never runs a plan to completion without checking perception. This ensures responsiveness: even while pursuing a goal, the agent continuously monitors for belief changes that might trigger reactions.

## Key Properties Enabling Integration

### Property 1: Fine-Grained Interleaving

By executing only one step per intention per cycle, then returning to perception, the agent interleaves:
- Progress on multiple intentions (multiple goals being pursued in parallel)
- Environmental monitoring (belief updates)  
- Reaction to new information (new events generated from belief changes)

The authors note: "The resulting programming paradigm incorporates aspects of conventional, so-called procedural programming, as embodied in languages like Pascal and C, as well as a kind of declarative, deductive style of programming, as embodied in Prolog. Ultimately, though, while these analogies may be useful, the style of programming in AgentSpeak is fundamentally different" (p. xiii).

The difference is precisely this interleaving: procedural code runs to completion; AgentSpeak code is constantly interrupted to check for new information.

### Property 2: Sub-Goal Decomposition as Event Generation

When a plan body contains `!subgoal`, this doesn't immediately execute sub-goal achievement. Instead:
1. Event `+!subgoal` is added to event queue
2. In a future cycle, this event triggers plan selection for the sub-goal
3. A new intention (plan stack) is created for the sub-goal
4. The parent intention suspends, waiting for sub-goal completion

This creates hierarchical goal pursuit: high-level goals decompose into sub-goals, which decompose further. But at each level, the system remains responsive. If the environment changes such that the high-level goal's context becomes false, failure handling kicks in (see next section).

### Property 3: Belief Changes Automatically Trigger Re-Assessment

Suppose an agent is pursuing goal G via plan P, and P has context condition C. If during execution, beliefs change such that C becomes false, the next time the agent attempts to execute from P, it will detect context failure and trigger plan failure handling.

This means: **proactive goal pursuit is continuously re-validated against reactive belief updates**. The agent doesn't blindly continue executing a plan when preconditions have changed—it notices and responds.

### Property 4: Message Reception as Belief Change

Agent communication (Chapter 6) is integrated into this cycle. When agent A sends a message to agent B with performative `tell`:

```
.send(agentB, tell, weather(sunny)).
```

Agent B generates event `+weather(sunny)`. This can trigger reactive plans just like perception. Communication isn't a separate channel—it's unified with environmental perception as a belief update mechanism.

This enables coordination: Agent A's actions (sending messages) directly influence Agent B's beliefs, which influences which plans B selects, which influences what goals B pursues.

## Implications for Multi-Agent Orchestration

### Implication 1: No Central Scheduler Needed

In traditional orchestration systems, there's typically a central scheduler deciding "what runs next." AgentSpeak's reasoning cycle is **distributed**—each agent has its own cycle, running asynchronously. Coordination emerges from:
- Shared environment (belief updates from common perceptions)
- Message passing (belief updates from communication)
- Complementary plan libraries (Agent A has plans for X, Agent B has plans for Y)

For a WinDAGs-like system: each skill could be an agent, each with plans for "when to activate" (contexts), "what to do" (plan bodies), and "how to coordinate" (communication actions). No central DAG executor—the DAG emerges from agents adopting goals that trigger sub-goals handled by other agents.

### Implication 2: Load Balancing Through Event Prioritization

If multiple agents share a task queue (common environment), they can implement load balancing through:
- Event selection functions that favor events corresponding to work items
- Context conditions that check local capacity before accepting work
- Communication that redistributes work items when overloaded

No global load balancer needed—each agent locally decides whether to take on work based on its context.

### Implication 3: Graceful Degradation Under Load

When an agent is overloaded (too many pending events), the event selection function determines degradation behavior:
- Priority-based: Drop low-priority events, focus on critical goals
- Deadline-aware: Process events with nearest deadlines first
- Energy-aware: Defer non-urgent work to preserve resources

The agent doesn't crash or freeze—it makes local decisions about what to sacrifice.

### Implication 4: Real-Time Responsiveness vs. Completeness

The authors acknowledge: "If you run this example, you will see that the program does not terminate!" (p. 10). This is deliberate. Agents are **reactive systems**—they run continuously, monitoring and responding. There's no "done" state.

For orchestration: distinguish between:
- **Mission-critical reactive loops**: Always running, monitoring for critical conditions (health checks, security alerts)
- **Goal-directed tasks**: Finite (complete user request, generate report), but still responsive during execution

The reasoning cycle supports both: some agents have only reactive plans (`+fire_detected`), others have goal-driven plans (`+!generateReport`), and most have mixtures.

## Boundary Conditions and Failure Modes

### When Integration Fails: Reactive Thrashing

**Problem**: If belief updates generate events faster than the agent can process them, the agent thrashes—constantly reacting, never making progress on goals.

**Example**: Security camera detects motion → triggers investigation goal → during investigation, camera detects more motion → triggers new investigation → original investigation never completes.

**Solution**: Event filtering and aggregation. Instead of generating events for every belief change, aggregate: `motion_detected_count` increments, and only when count > threshold or time > interval do we generate `+suspicious_activity`.

### When Integration Fails: Deadlock

**Problem**: Agent A waits for information from Agent B, Agent B waits for permission from Agent A. Both suspend intentions, neither makes progress.

**Example**:
```
// Agent A
+!task : true <- .send(B, askOne, resource_available, R); !proceed(R).

// Agent B  
+!allocate_resource : true <- .send(A, askOne, priority, P); !decide(P).
```

Both suspend waiting for replies. No progress.

**Solution**: Timeouts on test goals. If reply doesn't arrive within T, context failure triggers alternative plan (use default assumption, request from different agent, etc.).

### When Integration Fails: Starvation

**Problem**: High-priority events continuously preempt lower-priority work, which never executes.

**Example**: Agent responsible for both handling user requests (high priority) and database maintenance (low priority). User requests arrive frequently enough that maintenance never runs → database degrades → user requests eventually fail.

**Solution**: Aging in event selection—events gain priority over time, ensuring even low-priority work eventually executes. Alternatively, dedicate separate agents to different priority classes.

### When Integration Succeeds: Opportunistic Composition

**Positive Case**: Agent has goal `!deliverPackage(P)`, with plans for delivery by truck, drone, or courier. While pursuing truck delivery, agent perceives `+drone_available`. Belief change triggers reactive plan `+drone_available : delivering_by_truck <- !switch_to_drone`. The agent opportunistically switches to a faster method when it becomes available.

This is emergent adaptability—not explicitly programmed as "check for better options," but arising from reactive triggers monitoring for opportunity.

## Practical Design Principles

### Principle 1: Separate Monitoring from Action

Have distinct plans for:
- **Monitors**: Triggered by belief changes, set higher-level beliefs or adopt goals
- **Actors**: Triggered by goals, execute actions

Example:
```
// Monitor
+temperature(T) : T > threshold <- +overheating; !initiate_cooldown.

// Actor
+!initiate_cooldown : overheating <- activate_fans; reduce_load.
```

This separates "what we observe" from "what we do about it," making both easier to modify independently.

### Principle 2: Use Test Goals to Explicitly Wait

When a plan needs certain conditions before proceeding:
```
+!process_order : true <- 
    ?payment_confirmed;  // Wait/block until this belief is true
    ship_product.
```

The test goal `?payment_confirmed` suspends the intention until `payment_confirmed` becomes a belief (from perception or communication). This makes waiting explicit and context-dependent.

### Principle 3: Parameterize Reactivity Through Beliefs

Instead of hardcoding priorities or thresholds:
```
+sensor_reading(V) : alert_threshold(T) & V > T <- !handle_alert.
```

Now `alert_threshold(T)` can be dynamically adjusted (by other plans, by communication, by user input), changing reactivity without changing code.

### Principle 4: Design for Observable Side Effects

When Agent A's actions should influence Agent B's decisions, ensure A's actions create observable effects (shared environment changes, messages sent). Agent B's reactive plans can then respond.

Example: In contract net protocol (Chapter 6), Initiator sends CFP (call for proposals). Participants' plans trigger on `+cfp(Task)`, generate bids, send back. Initiator's plan triggers on `+propose(Bid)`, accumulates bids, then triggers decision plan. Each stage is reactive to previous stage's observable effects.

## Conclusion: The Reasoning Cycle as Universal Integration Mechanism

The AgentSpeak reasoning cycle demonstrates that **reactive and proactive behavior are not competing paradigms requiring explicit arbitration**, but complementary aspects of a unified event-driven architecture. By treating both external perceptions and internal goal adoptions as events, and by continuously interleaving perception with plan execution, AgentSpeak achieves seamless integration.

For intelligent orchestration systems, this suggests:
- Don't build separate "monitoring" and "execution" subsystems that need coordination
- Instead, build agents where monitoring naturally triggers action through reactive plans, and action naturally adapts to monitored changes through context-sensitive plan selection
- The "DAG" of task dependencies emerges from goal-sub-goal relationships in plan bodies, not from a static graph
- Coordination happens through observable effects (shared beliefs, messages), not through centralized control

The key enabler is fine-grained interleaving: never let execution run so long that you miss important changes. Always return to perception. Always give every intention a chance to make progress. This creates responsiveness by design, not by adding explicit interruption mechanisms to otherwise brittle goal-pursuit code.
```

### FILE: graceful-failure-and-recovery.md
```markdown
# Cascading Resilience: Plan Failure and Recovery in AgentSpeak

## The Inevitability of Failure

A recurring theme in the book is that **plans are not guarantees—they are contingent recipes that may fail**. The authors emphasize: "In everyday life, plans rarely run smoothly. They are frequently thwarted, accidentally or deliberately. When we become aware that our plans have gone wrong, we respond, choosing an alternative course of action" (p. 4-5).

Traditional programming treats failure as exceptional—errors, exceptions, crashes. Normal execution proceeds along the "happy path," with error handling as an afterthought (try-catch blocks, error codes). AgentSpeak inverts this: **failure is expected, and recovery is built into the core semantics**.

The system handles failure through three complementary mechanisms:

1. **Alternative Plans**: Multiple plans can handle the same triggering event; if one fails, try another with a different context
2. **Failure Events**: Plan failure itself triggers events (`-!goal`) that can have handling plans  
3. **Intention Dropping**: If all recovery fails, the goal is abandoned (not the entire agent)

This creates **cascading resilience**: failure at any level of goal decomposition can trigger recovery strategies, and if recovery is impossible, failure propagates upward until handled or the original goal is abandoned.

## How Plan Failure Occurs

The authors detail several failure modes in Chapter 4:

### Failure Mode 1: Action Execution Failure

A plan body contains a primitive action (modifying the environment):
```
+!openDoor : true <- unlock; push.
```

The `unlock` action might fail (door jammed, lock broken, no power). The external environment determines success/failure. When action execution fails, the AgentSpeak interpreter marks the entire plan as failed.

### Failure Mode 2: Context Condition Becomes False

A plan is selected because its context was true:
```
+!retrieveFile(F) : networkAvailable <- downloadFrom(remoteServer, F).
```

During execution, beliefs update (perception detects network failure), and `networkAvailable` becomes false. The next time the interpreter tries to execute a step from this plan, it re-evaluates the context, detects it's false, and marks the plan as failed.

**Key Insight**: This creates **continuous context monitoring**. You're not just checking context at selection time—context is a persistent validity condition. Plans "expire" when their preconditions cease to hold.

### Failure Mode 3: Sub-Goal Failure

A plan adopts a sub-goal:
```
+!secureLab : true <- !lockDoors; !activateAlarm.
```

The sub-goal `!lockDoors` triggers plan selection, execution, and that plan might fail (door jammed, as above). Sub-goal failure propagates: the parent intention (pursuing `!secureLab`) also fails.

**Key Insight**: Failure propagates up the goal decomposition hierarchy. You don't just fail the immediate action—you fail the entire goal that action was serving.

### Failure Mode 4: Test Goal Failure

A plan queries beliefs:
```
+!processPayment : true <- ?creditCardValid; chargeCard.
```

If belief `creditCardValid` doesn't exist (or is explicitly false), the test goal `?creditCardValid` fails immediately. The plan fails.

**Key Insight**: Test goals are assumptions. If an assumption doesn't hold, the plan can't proceed.

## Failure Recovery: The Three-Stage Process

When a plan fails, AgentSpeak doesn't give up immediately. Instead:

### Stage 1: Try Alternative Plans for the Same Event

The original triggering event is still pending. The system returns to plan selection: retrieve all plans triggered by this event, evaluate contexts, select an applicable plan (excluding already-tried plans).

If an alternative exists, create a new intention from that plan and continue. This handles **context-dependent alternatives**:

```
// Plan A: Preferred method, requires network
+!sendData(D) : networkAvailable <- uploadToCloud(D).

// Plan B: Fallback method, works offline  
+!sendData(D) : not(networkAvailable) <- saveToLocalQueue(D).
```

If Plan A fails (network goes down mid-upload), Plan B becomes applicable and gets tried. This is **automated failover** at the plan level.

### Stage 2: Trigger Failure Event for Current Goal

If no alternative plans exist (or all have been tried and failed), generate a **failure event** `-!goal` where `goal` is the current goal that failed.

This allows explicit failure handling plans:

```
// Normal plan
+!criticalTask : true <- performTask.

// Failure handler
-!criticalTask : true <- .print("Task failed, alerting supervisor"); 
                         .send(supervisor, tell, taskFailed).
```

Failure handling can:
- **Retry with delay**: `.wait(1000); !criticalTask` (re-adopt the goal after waiting)
- **Graceful degradation**: Adopt a less ambitious goal
- **Alerting**: Notify other agents or humans  
- **Compensation**: Undo partial effects (like database rollback)

**Key Insight**: Failure is not an error—it's an event like any other, and can be planned for. This makes recovery strategies explicit and first-class.

### Stage 3: Propagate Failure Upward

If no failure handling plan exists (or the failure handler itself fails), failure propagates to the **parent goal** in the intention stack.

Recall that intentions are stacks: when Plan P1 adopts sub-goal G2, Plan P2 is selected for G2, and P2 is pushed on the intention stack. P1 suspends, waiting for P2 to complete. If P2 fails and failure isn't handled, the failure event for G2 triggers. If that fails, the *parent* goal G1 (being pursued by P1) also fails.

This cascades upward: if G1's failure isn't handled, G0 (which triggered G1) fails, and so on, until either:
- A failure handler succeeds in recovering
- The root goal fails and the entire intention is dropped

**Key Insight**: This creates hierarchical resilience. Low-level failures (can't open one door) might be handled locally (try another door). High-level failures (can't secure building) might require different strategies (alert security guards).

## Design Implications for Robust Systems

### Implication 1: Explicit Failure Taxonomies

Design your plan libraries with failure in mind. For each major goal, identify:
- **Expected failure modes**: What can go wrong?  
- **Recovery strategies**: For each failure mode, what's the response?
- **Escalation paths**: When does failure propagate upward vs. handled locally?

Example: Goal `!completeTransaction`
- Failure Mode: `payment_declined` → Recovery: `!requestAlternatePayment`
- Failure Mode: `inventory_unavailable` → Recovery: `!notifyCustomerDelay`  
- Failure Mode: `system_error` → Escalate: Let parent goal (`!processOrder`) handle it

### Implication 2: Separate Failure Handling from Normal Plans

Avoid the temptation to handle errors inside plan bodies with conditionals:
```
// BAD: Mixed success and failure logic
+!sendEmail(M) : true <- 
    send(M);
    if (sendFailed) { logError; retryLater }.
```

Instead:
```
// GOOD: Separate normal and failure plans
+!sendEmail(M) : true <- send(M).

-!sendEmail(M) : retryCount(N) & N < 3 <- 
    -+retryCount(N+1);
    .wait(5000);
    !sendEmail(M).

-!sendEmail(M) : retryCount(N) & N >= 3 <-
    .print("Email send failed after 3 retries");
    !logFailure(emailFailure).
```

Benefits:
- **Clarity**: Separate concerns—normal operation vs. failure recovery
- **Modularity**: Can add failure handlers without modifying working code  
- **Reusability**: Failure patterns (retry with backoff) can be abstracted

### Implication 3: Use Beliefs to Track Failure State

Since failure handlers can check context conditions, maintain beliefs about failure history:
```
// Track consecutive failures
-!fetchData(Source) : failureCount(Source, N) <-
    -+failureCount(Source, N+1);
    if (N+1 >= threshold) { !switchSource }.

// Reset on success
+!fetchData(Source) : true <- 
    fetch(Source);
    -failureCount(Source, _);
    +failureCount(Source, 0).
```

This enables **adaptive recovery**: strategies change based on failure patterns (one failure → retry; repeated failures → find alternative source).

### Implication 4: Defensive Context Conditions

Plans should assume as little as possible and explicitly check preconditions in contexts:

```
// FRAGILE: Assumes resourceAllocated  
+!useResource(R) : true <- access(R); process(R); release(R).

// ROBUST: Checks explicitly
+!useResource(R) : resourceAllocated(R) <- access(R); process(R); release(R).

// FALLBACK: Handle case where not allocated
+!useResource(R) : not(resourceAllocated(R)) <- !allocateResource(R); !useResource(R).
```

If `resourceAllocated(R)` unexpectedly becomes false during execution (another agent deallocated it), the plan fails immediately with clear cause, rather than proceeding with invalid assumptions.

## Advanced Pattern: Compensating Actions

For plans that modify state (beliefs, environment), failure may require **compensation**—undoing partial effects:

```
+!transferFunds(Amt, From, To) : true <- 
    !debit(From, Amt);
    !credit(To, Amt).

// If credit fails, compensate by refunding debit
-!transferFunds(Amt, From, To) : debited(From, Amt) <-
    .print("Transfer failed, compensating...");
    !credit(From, Amt);  // Refund
    -debited(From, Amt).
```

This is analogous to database transactions and rollback, but at the plan level. Compensation plans make multi-step operations more atomic.

## Advanced Pattern: Failure-Aware Coordination

In multi-agent settings, one agent's failure should be observable to collaborators:

```
// Agent A: Delegate task
+!completeProject : true <-
    .send(agentB, achieve, subtaskX);
    ?subtaskX_done;  // Wait for completion
    !integrateResults.

// Agent A: Handle delegation failure  
-!completeProject : delegatedTo(agentB, subtaskX) <-
    .print("Agent B failed subtask, finding alternative");
    .send(agentC, achieve, subtaskX);
    // ...or...
    !doSubtaskLocally(subtaskX).
```

For this to work, Agent B must signal failure. Jason's `.send()` with `achieve` performative does this automatically: if Agent B's plan for `subtaskX` fails and isn't recovered, Agent A's intention waiting on `?subtaskX_done` will eventually timeout or receive a failure notification (depending on implementation).

## Boundary Conditions: When Recovery Fails

### Problem 1: Infinite Retry Loops

If failure handlers unconditionally re-adopt the goal, and the goal keeps failing, you get infinite loops:
```
-!task : true <- .wait(1000); !task.
```

**Solution**: Track retry count, impose limits, or change context (try alternative approach after N failures).

### Problem 2: Cascading Failures

Agent A fails → sends failure notification to Agent B → Agent B's plan fails on receiving this → Agent B notifies Agent C → C fails → ... System-wide collapse.

**Solution**: 
- **Failure isolation**: Some agents should have "default safe state" plans that always succeed
- **Circuit breakers**: After N consecutive failures, stop trying and enter degraded mode  
- **Supervision hierarchies**: Dedicated supervisor agents that handle failures from multiple worker agents

### Problem 3: Resource Leaks from Incomplete Plans

A plan acquires a resource, then fails before releasing it:
```
+!processFile(F) : true <- 
    openFile(F);
    processData;  // Fails here
    closeFile(F).  // Never executes
```

**Solution**: Failure handlers as "finally blocks":
```
+!processFile(F) : true <- 
    +fileOpen(F);
    openFile(F);
    processData;
    closeFile(F);
    -fileOpen(F).

-!processFile(F) : fileOpen(F) <- 
    closeFile(F);
    -fileOpen(F).
```

Alternatively, use internal actions with cleanup semantics built-in.

### Problem 4: Failure Handlers That Make Things Worse

Poorly designed recovery logic can amplify problems:
```
// BAD: Broadcast failure to all agents, creating notification storm
-!criticalTask : true <- 
    .broadcast(tell, systemFailure);
    !panicMode.
```

**Solution**: Principle of least disruption—recovery should minimize impact on other components. Notify only those who need to know. Degrade gracefully rather than shut down.

## Comparative Advantage: Why This Beats Exception Handling

Traditional exception handling (try-catch) vs. AgentSpeak failure handling:

| Aspect | Exceptions (Java/Python) | AgentSpeak Failure Handling |
|--------|-------------------------|----------------------------|  
| **Scope** | Lexical (catch block around code) | Intentional (failure events propagate through goal hierarchy) |
| **Separation** | Try-catch intermixed with logic | Failure plans separate from normal plans |
| **Alternatives** | Manual (programmer writes if-else for retries) | Automatic (system tries alternative plans) |
| **Context-awareness** | No (catch block always executes) | Yes (failure plans have contexts) |
| **Propagation** | Call stack | Intention stack + event queue |
| **Recovery** | Often generic (log and rethrow) | Specific to goal and context |

The key advantage: **AgentSpeak's failure handling is goal-aware**. You're not just catching an exception type—you're handling failure *to achieve a specific goal* in *a specific context*. This allows recovery strategies tailored to the goal, not just the error.

## Implications for Orchestration Robustness

For WinDAGs-style systems:

1. **Skill Composition as Intention Stacks**: When one skill invokes another, the invocation stack is an intention stack. If inner skill fails, outer skill's failure plan handles it. This creates natural layering: high-level orchestration plans delegate to skills, and skill failures propagate upward for high-level recovery decisions.

2. **Timeout as Failure Detection**: Use test goals with timeouts to detect unresponsive sub-systems:
   ```
   +!queryDatabase(Q) : true <-
       .send(dbAgent, askOne, query(Q), Result);
       .wait({+result(R)}, 5000);  // Wait up to 5 seconds
       ?result(R).  // Will fail if timeout
   ```
   Timeout = test goal failure → plan fails → failure recovery kicks in (try replica, use cache, etc.).

3. **Graceful Degradation Hierarchies**: Structure goals from "ideal" to "acceptable" to "minimal":
   ```
   +!provideService : true <- !highQualityService.
   -!provideService : highQualityServiceFailed <- !standardService.
   -!provideService : standardServiceFailed <- !minimalService.
   -!provideService : allServicesFailed <- !apologizeToUser.
   ```

4. **Observable Failure Propagation**: In multi-agent orchestration, ensure failures are observable (via message or shared belief) so dependent agents can react. Example: if data ingestion agent fails, downstream processing agents should detect this and pause/retry rather than operating on stale data.

## Conclusion: Resilience by Design

The core lesson is that **resilience isn't added through defensive programming—it's inherent in the architecture**. By treating failure as an event, providing multiple alternative plans, and allowing context-sensitive failure handling, AgentSpeak builds systems that:

- **Degrade gracefully** rather than crash
- **Adapt strategies** when primary approaches fail  
- **Isolate failures** to specific goals rather than whole agents
- **Recover autonomously** without human intervention for anticipated failures
- **Escalate intelligently** when autonomous recovery isn't possible

For building robust orchestration systems, this means: design your skill library with failure in mind from the start. Every skill should have a "what if this fails?" plan. Every high-level goal should have alternative paths to achievement. The system's resilience emerges from the density of your plan library—the more ways you know how to achieve goals and recover from failures, the more robust the system becomes.
```

### FILE: knowledge-level-communication.md
```markdown
# Knowledge-Level Communication: Speech Acts and Mental State Coordination

## Beyond Byte-Passing: Communication as Mental State Update

The authors emphasize a fundamental shift in how agents communicate: "Every day, millions of computers across the world routinely exchange information with humans and other computers. In this sense, building computer systems that have some kind of social ability is not hard. However, the ability to exchange bytes is not social ability in the sense that we mean it. We are talking about the ability of agents to cooperate and coordinate activities with other agents, in order to accomplish our goals" (p. 5).

Traditional inter-process communication is **transport-level**: sockets, RPC, method invocation. You send data structures or call functions. AgentSpeak communication is **knowledge-level**: you communicate *beliefs*, *goals*, and *queries*. The semantics are defined in terms of mental states, not network protocols.

This approach stems from speech act theory (Austin, Searle) and the FIPA-ACL (Foundation for Intelligent Physical Agents - Agent Communication Language) standard. The core idea: **communication is action**, and each communicative act has preconditions and effects defined over mental states.

## The Jason Performatives

Jason provides several communicative acts (performatives) as internal actions. The primary ones, detailed in Chapter 6:

### 1. `tell`: Asserting Beliefs

**Syntax**: `.send(Receiver, tell, Belief)`

**Semantics**: Inform another agent of a belief you hold. 

**Effect on Receiver**: Adds `Belief[source(Sender)]` to receiver's belief base and generates event `+Belief[source(Sender)]`.

**Example**:
```
// Agent sensor detects fire
+temperature(T) : T > threshold <- 
    +fire_detected;
    .send(controller, tell, fire_detected).

// Agent controller reacts to belief from sensor
+fire_detected[source(sensor)] : true <- 
    !activate_sprinklers;
    !evacuate_building.
```

The annotation `[source(sensor)]` indicates the belief originated from `sensor`. This allows the receiver to:
- Track information provenance (who told me this?)
- Have different plans for beliefs from different sources (trust-based reasoning)
- Update beliefs with source tracking (if sensor tells me X, but camera tells me not(X), I can reason about conflict)

**Key Insight**: `tell` is not just message passing—it's **belief synchronization**. You're making another agent aware of what you believe. The receiver doesn't have to believe it (plans can ignore or filter), but the information is available.

### 2. `achieve`: Delegating Goals

**Syntax**: `.send(Receiver, achieve, Goal)`

**Semantics**: Request another agent to achieve a goal.

**Effect on Receiver**: Generates event `+!Goal[source(Sender)]` if receiver accepts delegation.

**Example**:
```
// Manager delegates task
+!completeProject : true <- 
    .send(worker, achieve, implementFeature(X));
    .send(tester, achieve, verifyFeature(X));
    ?feature_verified;  // Wait for completion
    !integrate.

// Worker responds to delegation
+!implementFeature(X)[source(manager)] : hasCapacity <-
    doImplementation(X);
    .send(manager, tell, feature_implemented(X)).
```

**Key Insight**: `achieve` is **goal delegation**. You're not telling the receiver *how* to achieve the goal (like RPC), you're giving them *what* to achieve. The receiver uses its own plan library to figure out how. This enables:
- **Heterogeneous implementation**: Different agents can achieve the same goal differently
- **Autonomy preservation**: Receiver decides whether to accept (context conditions on plans for `+!Goal`)
- **Loose coupling**: Sender doesn't need to know receiver's internal capabilities

### 3. `askOne` and `askAll`: Querying Beliefs

**Syntax**: `.send(Receiver, askOne, QueryPattern, Response)`

**Semantics**: Query another agent's beliefs. `askOne` expects one answer, `askAll` expects all matching answers.

**Effect on Receiver**: Generates query event, receiver's plan produces response, sends back `tell` with answer.

**Example**:
```
// Agent A queries Agent B
+!planRoute(Dest) : true <-
    .send(mapService, askOne, route(currentLocation, Dest, R), ResponseRoute);
    ?ResponseRoute;  // Wait for response
    !followRoute(R).

// Agent B (mapService) responds to query
+route(From, To, R)[source(S)] : map(From, To, Path) <-
    .send(S, tell, route(From, To, Path)).
```

**Key Insight**: `askOne` is **knowledge sharing on demand**. You're not broadcasting everything—you're requesting specific information. This enables:
- **Information retrieval**: Agents can consult experts
- **Privacy**: Agent only shares what's explicitly queried (vs. broadcasting all beliefs)
- **Lazy synchronization**: Beliefs shared when needed, not preemptively

### 4. `tellHow`: Sharing Plans

**Syntax**: `.send(Receiver, tellHow, Plan)`

**Semantics**: Share know-how—give another agent a plan to add to its plan library.

**Example**:
```
// Experienced agent teaches novice
+noviceAgent(N) : hasExpertise <-
    .send(N, tellHow, {+!optimize(X) : true <- advancedOptimization(X)}).

// Novice receives plan
+{+!optimize(X) : true <- advancedOptimization(X)}[source(expert)] : true <-
    // Plan added to library, now available for use
```

**Key Insight**: This is **capability transfer**. Not just data or goals, but *procedural knowledge*. The receiver gains new ways to achieve goals. This enables:
- **Learning**: Agents acquire new strategies from others
- **Adaptation**: System capabilities evolve without redeploying code
- **Collaboration**: Agents share not just what to do, but how to do it

## Semantic Depth: Mental State Preconditions and Effects

Chapter 10 provides formal semantics. Key points:

### Sending Preconditions

To send a message with performative `P` and content `C`, the sender typically must:
- **For `tell`**: Believe `C` (sincerity condition)  
- **For `achieve`**: Want `C` to become true (goal adoption)
- **For `askOne`**: Want to know whether `C` is true

These aren't enforced by Jason (you can `.send(A, tell, X)` without believing X), but they're part of the rational agent model—agents *should* follow these conventions for cooperation to work.

### Receiving Effects  

When agent B receives message from agent A:
- **For `tell(Belief)`**: Add `Belief[source(A)]` and generate `+Belief[source(A)]` event
- **For `achieve(Goal)`**: Generate `+!Goal[source(A)]` event if agent decides to accept
- **For `askOne(Query)`**: Generate query processing event, execute plans to find answer, send back `tell`

The critical point: **message reception integrates with the reasoning cycle**. It's not a separate communication-handling thread—messages become events that trigger plans just like perception.

## Coordination Patterns Through Communication

The authors demonstrate several coordination patterns in Chapter 6, most notably the Contract Net Protocol (CNET). The pattern:

1. **Initiator broadcasts CFP** (call for proposals): `.broadcast(achieve, bid_on_task(T))`
2. **Participants evaluate**: Each has plan `+!bid_on_task(T) : canDo(T) <- calculateBid; .send(initiator, tell, propose(B))`
3. **Initiator collects bids**: Plan triggered by `+propose(B)[source(S)]`, accumulates in belief base
4. **Initiator selects winner**: After timeout, evaluate bids, select best: `.send(winner, achieve, executeTask(T))`
5. **Winner executes**: Plan `+!executeTask(T)[source(initiator)] : true <- doTask; .send(initiator, tell, taskComplete)`

**Key Insight**: Complex multi-agent coordination emerges from simple communicative acts + local plan-based reasoning. No central coordinator—each agent follows local plans, but global behavior (auction, task allocation) emerges.

## Implications for Multi-Agent Orchestration

### Implication 1: Decentralized Control Through Delegation

Instead of a central orchestrator calling microservices, have orchestrator agents delegate goals to specialist agents:

```
// Orchestrator
+!processUserRequest(R) : true <-
    .send(authAgent, achieve, validateUser(R.user));
    .send(dataAgent, achieve, fetchData(R.query));
    .send(analyticsAgent, achieve, analyzeData(data));
    !synthesizeResponse.
```

Each specialist agent decides *how* to achieve its delegated goal. They can:
- Choose strategies based on their local context (load, available resources)
- Fail and recover independently (without crashing orchestrator)
- Evolve their implementations without changing orchestration logic

### Implication 2: Information-Driven Coordination

Agents broadcast relevant beliefs to interested parties, who reactively respond:

```
// Data agent detects anomaly
+anomalyDetected(A) : severity(A, high) <-
    .broadcast(tell, anomalyDetected(A)).

// Security agent reacts
+anomalyDetected(A)[source(dataAgent)] : true <-
    !investigateAnomaly(A);
    !alertAdministrator.

// Performance agent also reacts  
+anomalyDetected(A)[source(dataAgent)] : affectsPerformance(A) <-
    !applyMitigation(A).
```

Multiple agents independently respond to the same information, each according to their concerns. No explicit "who should handle this?" decision—implicit based on plans.

### Implication 3: Lazy Knowledge Sharing with Queries

Don't synchronize all state eagerly. Instead, agents query when they need information:

```
+!makeDecision(D) : true <-
    .send(expertAgent, askOne, recommendation(D, R), Answer);
    ?Answer;
    !executeDecision(R).
```

This reduces communication overhead—only transfer information when necessary. Also enables **separation of concerns**: decision-making agent doesn't need to know how expert produces recommendations, just that it can query for them.

### Implication 4: Dynamic Team Formation Through Broadcasting

Use broadcast for discovering collaborators:

```
// Agent needs help
+!solveComplexProblem(P) : true <-
    .broadcast(askOne, canHelp(P, capability(C)));
    .wait(1000);  // Collect responses
    ?helper(H, C);  // Select a helper
    .send(H, achieve, colaborate(P)).

// Specialist agents respond if capable
+canHelp(P, C)[source(S)] : hasCapability(C) <-
    .send(S, tell, helper(myself, C)).
```

No pre-configured team—agents dynamically discover who can contribute.

## Advanced Pattern: Conversation Management

Multi-step interactions require tracking conversation state. Use beliefs to manage:

```
// Negotiation initiator
+!negotiate(Item, MaxPrice) : true <-
    .send(seller, askOne, price(Item, P), Response);
    +conversationId(C);  // Track this conversation
    ?Response;
    !evaluateOffer(Item, P, MaxPrice, C).

+!evaluateOffer(Item, P, Max, C) : P <= Max <-
    .send(seller, tell, accept(Item, P, C));
    -conversationId(C).

+!evaluateOffer(Item, P, Max, C) : P > Max & attemptsLeft(N) & N > 0 <-
    .send(seller, tell, counteroffer(Item, Max*0.9, C));
    -+attemptsLeft(N-1);
    // Wait for seller's response...
```

Conversation ID `C` links messages to specific interaction threads. Belief `conversationId(C)` tracks active conversations. This enables concurrent multi-party interactions without confusion.

## Advanced Pattern: Belief Revision from Multiple Sources

When multiple agents provide conflicting information, use source annotations to reason about trust:

```
+temperature(T1)[source(sensor1)] : true <- 
    +temp_report(sensor1, T1).

+temperature(T2)[source(sensor2)] : true <-
    +temp_report(sensor2, T2).

+!determineTemperature : temp_report(S1, T1) & temp_report(S2, T2) <-
    if (abs(T1 - T2) < threshold) {
        +actual_temp((T1 + T2) / 2)
    } else {
        !resolveConflict(S1, T1, S2, T2)
    }.
```

Source tracking enables:
- Conflict detection (different sources, different beliefs)
- Trust-based weighting (prefer more reliable sources)  
- Provenance tracking (audit trail of where beliefs came from)

## Boundary Conditions and Failure Modes

### Problem 1: Message Loss and Asynchrony

Jason doesn't guarantee message delivery (depends on infrastructure). If Agent A sends `achieve(task)` to Agent B, but message is lost, A might wait indefinitely for completion.

**Solution**: Timeouts on test goals waiting for responses:
```
.send(B, achieve, task);
.wait({+task_done}, 10000);  // Wait up to 10 seconds
if (not task_done) {
    // Handle timeout: retry, use alternative agent, etc.
}
```

### Problem 2: Belief Flooding

If agents broadcast every belief change, network and processing overhead explodes.

**Solution**:
- **Selective telling**: Only share beliefs others need (`.send` instead of `.broadcast`)
- **Aggregation**: Update beliefs locally, periodically broadcast summaries
- **Subscription model**: Agents explicitly request to be informed of certain beliefs

### Problem 3: Commitment Without Capacity

Agent receives `achieve(goal)` delegation, but lacks capacity to execute. If it blindly accepts (plan with empty context), it overcommits.

**Solution**: Context conditions on delegation acceptance:
```
+!task(T)[source(S)] : available & hasResources <-
    doTask(T);
    .send(S, tell, task_complete).

+!task(T)[source(S)] : not(available) <-
    .send(S, tell, refusal(task(T))).
```

Agents should be explicit about refusal, enabling delegator to find alternatives.

### Problem 4: Circular Delegation

Agent A delegates to B, B delegates to C, C delegates to A. Deadlock.

**Example**:
```
// Agent A
+!process(X) : complexCase(X) <- .send(B, achieve, process(X)).

// Agent B
+!process(X) : needsAdvice(X) <- .send(C, achieve, process(X)).

// Agent C  
+!process(X) : uncertain(X) <- .send(A, achieve, process(X)).
```

**Solution**: Delegation depth tracking, termination conditions, or explicit refusal when delegation loops detected.

## Comparative Advantage: Knowledge-Level vs. Service-Oriented

| Aspect | Service-Oriented (REST, RPC) | Knowledge-Level (AgentSpeak) |
|--------|------------------------------|----------------------------|
| **Invocation** | Call specific endpoint/method | Delegate goal, receiver chooses method |
| **Coupling** | Tight (caller knows service interface) | Loose (caller knows goal, not implementation) |
| **Failure** | Error code/exception | Goal failure, alternative plans |
| **Semantics** | Operational (what happens) | Mental state (what's believed/intended) |
| **Coordination** | Explicit orchestration | Emergent from plan-based responses |
| **Evolution** | Breaking changes require caller updates | New plans enable new behaviors without caller changes |

The advantage: **future-proofing**. When Agent B learns new ways to achieve goals (new plans added), Agent A's delegations automatically benefit, without A being updated. In SOA, if a service adds a new capability, clients must be updated to use it.

## Implications for WinDAGs Skill Coordination

For orchestrating 180+ skills:

1. **Skills as Agents**: Each skill is an agent that responds to `achieve(skillGoal)`. Skill implementation hidden behind goal interface.

2. **Orchestration as Goal Graphs**: High-level orchestration doesn't call Skill1, then Skill2, etc. Instead:
   ```
   +!userRequest(R) : true <-
       !authenticate(R);
       !fetchData(R);
       !processData;
       !respondToUser.
   ```
   Each sub-goal triggers specialist skill agents. Dependencies implicit in goal structure.

3. **Skill Discovery**: Use `broadcast(askOne, ...)` to find which agents provide needed capabilities:
   ```
   +!needCapability(C) : true <-
       .broadcast(askOne, provides(C, details(D)));
       .wait(500);
       ?provider(Agent, D);
       .send(Agent, achieve, useCapability(C)).
   ```

4. **Information Sharing Between Skills**: Skills share intermediate results via `tell`:
   ```
   // DataFetch skill
   +!fetchData(Q)[source(orchestrator)] : true <-
       data = queryDatabase(Q);
       .send(orchestrator, tell, dataAvailable(data)).

   // Process skill waits for data
   +!processData : true <-
       ?dataAvailable(D);  // Blocks until data available
       result = analyze(D);
       ...
   ```

5. **Error Propagation**: When a skill agent fails, it tells the orchestrator:
   ```
   -!skillTask[source(orchestrator)] : true <-
       .send(orchestrator, tell, skillFailure(skillTask, reason)).
   ```
   Orchestrator's plan reacts to `+skillFailure(...)` with recovery logic.

## Conclusion: Communication as the Foundation of Coordination

The key lesson is that **rich communication enables emergent coordination without central control**. By communicating beliefs, goals, and queries—not just data—agents can:

- **Delegate autonomously**: "Here's what needs doing, you figure out how"
- **Share situational awareness**: "Here's what I see, act accordingly"  
- **Discover capabilities**: "Who can help with this?"
- **Coordinate implicitly**: Each agent reacts to others' communications based on local plans

For intelligent orchestration, this means: don't build a central dispatcher that knows about all skills and explicitly routes tasks. Instead, build agents that communicate goals and beliefs, and let coordination emerge from their plan-based responses. The "DAG" of task dependencies isn't a static structure—it's the dynamic web of goal delegations, belief sharing, and query responses that arises as agents interact.

This requires a mindset shift: you're not programming workflows, you're programming communicative agents whose interactions produce workflows. The flexibility and robustness gains are substantial, but so is the need to think differently about system design.
```

### FILE: procedural-knowledge-encoding.md
```markdown
# Procedural Knowledge as Plans: The Know-How Library Paradigm

## Know-How vs. Know-That

A foundational distinction runs throughout the book: the difference between **declarative knowledge** (know-that: facts, beliefs about the world) and **procedural knowledge** (know-how: knowledge about how to do things). The authors frame AgentSpeak as fundamentally about encoding know-how: "The basic idea behind programming in AgentSpeak is to define the know-how of a program, in the form of plans. By 'know-how', we mean knowledge about how to do things" (p. xiii).

This isn't just a linguistic distinction—it's architectural. In traditional programming:
- **Declarative knowledge** = data structures, databases, configuration files
- **Procedural knowledge** = functions, methods, procedures

But there's a problem: traditional procedural code conflates **what needs doing** with **how to do it**. A function like `deployApplication()` contains both the goal (get app deployed) and a specific procedure (these exact steps). If any step fails, the whole function fails. If context changes mid-execution, the function doesn't adapt—it blindly continues or crashes.

AgentSpeak inverts this. Procedural knowledge is represented as **plans**—context-sensitive recipes that:
- Declare what situation (context) they apply to
- Describe a procedure for achieving a goal in that situation  
- Can fail and be replaced by alternative plans
- Can be composed hierarchically (plans invoke sub-goals)

The result: **a library of know-how** rather than a monolithic program.

## Anatomy of Procedural Knowledge: Plan Structure

Every plan encodes a piece of know-how with three essential components:

### 1. Triggering Event: When Is This Know-How Relevant?

Plans aren't invoked directly like functions. They're **triggered by events**:
- Belief addition: `+belief` (I just learned something)
- Belief removal: `-belief` (Something I believed is no longer true)  
- Goal adoption: `+!goal` (I want to achieve something)
- Goal completion: `+!goal[achieved]` (I've achieved this)
- Goal failure: `-!goal` (I failed to achieve this)

This is the **applicability trigger**: which situations does this piece of know-how address?

Example:
```
// Know-how for responding to fire detection
+fire_detected : true <- !evacuate; !call_fire_dept.

// Know-how for achieving building security
+!secure_building : night_time <- !lock_doors; !arm_alarm.
```

The trigger makes procedural knowledge **event-responsive**. You're not calling functions—you're saying "when X happens, here's what to do."

### 2. Context: Under What Conditions Is This Know-How Applicable?

The context is a logical condition over beliefs. It answers: "Is this the right approach given what I currently believe?"

Multiple plans can respond to the same event with different contexts:
```
// Plan A: Fastest route when traffic is light
+!getToAirport : traffic(light) & timeRemaining > 60 <- 
    takeHighway.

// Plan B: Reliable route when traffic is heavy  
+!getToAirport : traffic(heavy) <- 
    takeBackroads.

// Plan C: Emergency route when very late
+!getToAirport : timeRemaining < 30 <-
    callTaxi.
```

Same goal (`!getToAirport`), different contexts, different procedures. The agent doesn't need a master decision procedure—each plan embodies a conditional strategy, and context evaluation selects which applies now.

**Key Insight**: Context conditions distribute decision logic across the plan library. Instead of one big decision tree, you have many small conditional recipes. This is more modular—you can add a new strategy (new plan) without modifying existing decision logic.

### 3. Body: What Procedure Achieves This Goal?

The plan body is a sequence of:
- **Actions**: Primitive operations modifying the environment (`unlock`, `send_email`)
- **Sub-goal adoptions**: Delegate to other plans (`!call_fire_dept`)  
- **Test goals**: Check beliefs (`?door_locked`)
- **Mental operations**: Belief updates (`+new_belief`, `-old_belief`)
- **Internal actions**: Pre-defined operations (`.print`, `.send`, `.broadcast`)

The body encodes the **recipe**: if the triggering event happens and the context holds, follow these steps to handle it.

Critically, bodies can contain **sub-goals** (`!goal`). This doesn't directly execute code—it triggers goal adoption, which starts a new deliberation cycle: find plans triggered by `+!goal`, evaluate contexts, select one, execute it. This enables:

- **Hierarchical decomposition**: High-level goals decompose into sub-goals recursively
- **Reusability**: Sub-goal `!call_fire_dept` can be achieved by a plan used in multiple higher-level contexts
- **Context-sensitive composition**: Which plan achieves the sub-goal depends on beliefs at invocation time

**Example**:
```
// High-level know-how
+!evacuate_building : true <-
    !disable_elevators;
    !open_emergency_exits;
    !broadcast_alarm;
    !guide_occupants.

// Sub-goal know-how, multiple strategies
+!open_emergency_exits : automatic_system_online <-
    trigger_automatic_release.

+!open_emergency_exits : not(automatic_system_online) <-
    !manually_unlock_exits.
```

The high-level plan doesn't know *how* exits will be opened—that's delegated to sub-goal `!open_emergency_exits`, which will select the appropriate plan based on context.

## The Library Metaphor: Plans as Modular Knowledge Units

The authors consistently refer to the **plan library** rather than "the program." This metaphor is deliberate and important:

### Libraries Are Reference Collections

You don't read a library cover-to-cover—you consult it when needed. Similarly, not all plans are always active. Plans are **dormant knowledge** until their triggering event occurs. The agent "looks up" relevant plans when events happen.

### Libraries Are Extensible

Adding a book to a library doesn't require reorganizing existing books. Adding a plan to the library doesn't require modifying existing plans (in most cases). If you realize there's a new scenario to handle:

```
// Existing plans for securing building
+!secure_building : night_time <- ...
+!secure_building : event_scheduled <- ...

// New plan for new scenario (doesn't touch existing plans)
+!secure_building : high_threat_alert <- 
    !full_lockdown;
    !notify_security;
    !monitor_all_entrances.
```

The library grows organically. Compare this to a monolithic `secureBuildingFunction()` with nested if-statements—each new scenario requires modifying and retesting the entire function.

### Libraries Are Composable

Books reference other books. Plans invoke sub-goals handled by other plans. You build complex know-how by composing simple pieces:

```
+!deploy_application : production <-
    !run_tests;
    !backup_current_version;
    !upload_new_version;
    !restart_services;
    !verify_deployment.
```

Each sub-goal has its own plans, potentially with multiple strategies. The high-level plan doesn't care—it delegates. This is **declarative composition**: specify what sub-goals to achieve, not how.

### Libraries Have Organization Principles

Just as libraries organize books by subject, agents' plan libraries should organize plans by:
- **Goal hierarchies**: Plans for high-level goals, plans for sub-goals, plans for primitive actions
- **Domain areas**: Plans for security, plans for communication, plans for resource management
- **Abstraction levels**: Generic plans (work in many contexts), specialized plans (work in specific contexts)

Poor organization → hard to find relevant plans (for humans reading code, and potentially for agents if custom plan selection). Good organization → clear structure, easy to extend.

## Implications for Intelligent System Design

### Implication 1: Program by Accumulating Know-How

Traditional development: write a program that solves the problem. AgentSpeak development: accumulate a library of know-how that *collectively* addresses the problem space.

For a WinDAGs orchestration system with 180+ skills:
- Don't write one orchestration procedure
- Instead, build a library where each plan encodes one coordination pattern, one failure recovery strategy, one optimization heuristic
- The system's intelligence is the size and quality of the library

### Implication 2: Knowledge Gaps Are Explicit

If an event occurs and no plan handles it, the agent simply doesn't respond (or defaults to a generic handler). This is **explicit ignorance**: the agent doesn't know what to do.

This is actually valuable for debugging and system evolution:
- Run system, observe which events are unhandled → those are knowledge gaps
- Add plans to fill gaps → system becomes more capable
- Compare to implicit ignorance in procedural code: function doesn't handle edge case, silently does wrong thing

For orchestration: log unhandled events. These indicate scenarios your skill library doesn't cover yet.

### Implication 3: Contextual Specialization Over Generalization

Traditional software engineering emphasizes generic, reusable code. AgentSpeak emphasizes **contextually specialized** plans.

Instead of:
```
function handleRequest(request) {
    if (request.type == A) {
        if (database.available) { ... }
        else { ... }
    } else if (request.type == B) {
        if (user.authenticated) { ... }
        else { ... }
    }
    // Exponential complexity as cases multiply
}
```

Use:
```
+!handleRequest(R) : type(R, A) & database_available <- ...
+!handleRequest(R) : type(R, A) & not(database_available) <- ...
+!handleRequest(R) : type(R, B) & user_authenticated <- ...
+!handleRequest(R) : type(R, B) & not(user_authenticated) <- ...
```

Each plan is a specialized recipe for one situation. The explosion of cases doesn't create one massive function—it creates multiple small, focused plans. Easier to understand, test, and maintain individually.

### Implication 4: Runtime Composition vs. Compile-Time Binding

In traditional programs, function calls bind at compile time (or class loading). In AgentSpeak, sub-goal invocations bind **at runtime** based on current context.

`!subgoal` means "achieve this, using whatever plan is appropriate *now*." If beliefs change between two invocations of the same high-level plan, different low-level plans might execute.

Example: Orchestration plan for "fetch user data" might invoke `!queryDatabase`. Normally, this uses plan "query primary database." But if belief `+primary_database_down` becomes true, next invocation of the orchestration plan will trigger different plan for `!queryDatabase` (query replica or cache). **No code change needed**—behavior adapts because plan selection re-evaluates context each time.

## Advanced Pattern: Meta-Level Plans for Plan Management

Plans can reason about and manipulate other plans:

```
// Detect that a plan repeatedly fails
+plan_failed(P, N) : N > threshold <- 
    !disable_plan(P);
    !find_alternative_plan(P);
    !notify_human_operator.

// Meta-plan to disable problematic plans  
+!disable_plan(P) : true <-
    .remove_plan(P);  // Internal action to remove from library
    +plan_disabled(P).
```

This is **adaptive know-how**: the agent learns (through failure tracking) that certain plans aren't working, and adjusts its library. Meta-plans enable:
- Learning from experience (disable bad plans, prioritize good plans)
- Dynamic reconfiguration (load new plans based on situation)  
- Self-monitoring (detect when own know-how is inadequate)

For orchestration: track success rates of different skill invocation strategies, prefer high-success strategies, investigate low-success ones.

## Boundary Conditions: When Libraries Become Unwieldy

### Problem 1: Library Explosion

If you create hyper-specialized plans for every tiny variation, the library becomes massive and hard to navigate.

**Example**: Plans for "send email" specialized by recipient, time of day, email client, network status, user preferences, etc. → hundreds of plans.

**Solution**: Find the right **granularity**. Use variables and conditionals within plan bodies for minor variations:
```
+!send_email(To, Subject, Body) : true <-
    if (priority(To, high)) { urgent_send } 
    else { normal_send }.
```
Reserve separate plans for truly different *strategies*, not just parameterized variations of the same strategy.

### Problem 2: Context Overlap Ambiguity

If multiple plans have contexts that overlap significantly, plan selection becomes unpredictable.

**Example**:
```
+!task : condition1 & condition2 <- approach_A.
+!task : condition1 & condition3 <- approach_B.
```

If `condition1`, `condition2`, and `condition3` are all true, which plan executes? Jason uses plan ordering (first defined), but this is fragile.

**Solution**: Make contexts mutually exclusive when possible:
```
+!task : condition1 & condition2 & not(condition3) <- approach_A.
+!task : condition1 & condition3 & not(condition2) <- approach_B.  
+!task : condition1 & condition2 & condition3 <- approach_C.  // Explicitly handle overlap
```

### Problem 3: Implicit Knowledge Gaps

Suppose plan P1 invokes sub-goal `!G`, assuming there's always a plan for G. But in some rare context, no plan for G is applicable → G fails → P1 fails → cascading failure.

**Solution**: Defensive sub-goal invocation:
```
+!main_goal : true <-
    if (not !try_subgoal) {
        // Subgoal failed, use fallback
        !alternative_approach
    }.
```

Or, ensure fallback plans with universal contexts:
```
+!subgoal : specific_context <- optimized_approach.
+!subgoal : true <- general_approach.  // Always applicable
```

### Problem 4: Circular Dependencies in Know-How

Plan for goal G1 invokes G2, plan for G2 invokes G3, plan for G3 invokes G1 → infinite loop.

**Example**:
```
+!analyze : true <- !preprocess; !compute.
+!preprocess : needs_analysis <- !analyze.  // Circular!
```

**Solution**: Design goal hierarchies as DAGs (directed acyclic graphs). Use beliefs to track progress and prevent re-invoking completed goals:
```
+!analyze : not(analyzed) <- !preprocess; !compute; +analyzed.
+!preprocess : needs_analysis & not(analyzed) <- !analyze.  // Guarded by not(analyzed)
```

## Comparison to Other Knowledge Representation Paradigms

| Paradigm | Knowledge Encoding | Execution Model | Adaptability |
|----------|-------------------|----------------|--------------|
| **Procedural (C, Java)** | Functions/methods | Call stack, direct invocation | Low (fixed call graphs) |
| **Rule-Based (Prolog)** | Horn clauses | Unification, backtracking | Medium (query-driven) |
| **Planning (STRIPS)** | Operators with precond/effects | Search over plan space | High (generates plans) |
| **AgentSpeak** | Plans with triggers/contexts | Event-driven deliberation | High (context-sensitive selection) |

AgentSpeak combines aspects of all three:
- **From procedural**: Explicit sequences of actions (plan bodies)
- **From rule-based**: Pattern matching (trigger matching), logical contexts (context conditions)  
- **From planning**: Goal-oriented (achievement goals), hierarchical decomposition

But it's distinct: plans are pre-defined (not generated), but selection is dynamic (not fixed calls). This trades off planning flexibility for execution efficiency and predictability.

## Implications for WinDAGs Skill Orchestration

### 1. Skills as Composable Know-How Units

Each skill should be designed as a library contribution:
- **Trigger**: What event makes this skill relevant? (`+!processData`, `+newDataAvailable`)
- **Context**: When is this skill the right choice? (`dataType(structured)`, `system_load < 0.7`)  
- **Body**: What does this skill do? (Invoke APIs, transform data, update state)

Skills aren't just functions in a registry—they're contextual know-how that activates when appropriate.

### 2. Orchestration as Goal Decomposition

High-level orchestration plans decompose user requests into sub-goals:
```
+!fulfillUserRequest(R) : authenticated(R) <-
    !validateInput(R);
    !fetchRelevantData(R);
    !applyBusinessLogic(R);
    !formatResponse(R);
    !deliverToUser(R).
```

Each sub-goal is achieved by specialist skills (agents). The orchestration plan doesn't specify which skill—that's determined by sub-goal plan selection based on context.

### 3. Dynamic Skill Selection

If multiple skills can achieve the same goal (e.g., multiple data fetching strategies), contexts determine which:
```
+!fetchData(Query) : cache_hit(Query) <- fetch_from_cache(Query).
+!fetchData(Query) : not(cache_hit) & db_available <- fetch_from_db(Query).
+!fetchData(Query) : not(db_available) <- fetch_from_backup(Query).
```

No explicit if-else in orchestration code—skill selection is implicit in plan library structure.

### 4. Extending Capabilities Without Breaking Existing Flows

Add new skill (new plan for existing goal) → existing orchestration automatically uses it when context is right:
```
// Existing skill
+!fetchData(Q) : source(Q, database) <- query_database(Q).

// New skill added later (doesn't modify existing)
+!fetchData(Q) : source(Q, api) & api_available <- query_api(Q).
```

Orchestration code invoking `!fetchData(Q)` now automatically uses API when appropriate, without changes to orchestration.

### 5. Observable Know-How for Debugging

The plan library is **inspectable**: you can list all plans, see which are applicable in a given state, trace which plan was selected for each goal. This enables:
- **Explainability**: "Why did the system do X?" → "Because plan P was selected for goal G in context C"
- **Debugging**: "Why didn't the system do Y?" → "No plan for Y was applicable (contexts all false)"  
- **Verification**: "Can the system handle scenario Z?" → "Check if plans exist for events in Z with appropriate contexts"

For orchestration: build tooling to visualize plan library, show active intentions, trace goal decomposition. This makes system behavior transparent.

## Conclusion: The Epistemological Shift

The deepest insight of AgentSpeak is **procedural knowledge as first-class, modular, context-sensitive artifacts**. Traditional programming treats know-how as code—monolithic, imperative, bound at compile time. AgentSpeak treats know-how as a library—modular, declarative (in triggers/contexts), bound at runtime based on situation.

This enables:
- **Flexibility**: Multiple ways to achieve goals, selected based on context
- **Robustness**: If one plan fails, try alternatives  
- **Extensibility**: Add know-how without modifying existing know-how
- **Transparency**: Know-how is inspectable, explainable
- **Autonomy**: Agents compose know-how on the fly to achieve delegated goals

For building intelligent orchestration systems, this means: stop thinking of your system as "a program that orchestrates skills" and start thinking of it as "a collection of know-how about how to coordinate skills in various situations." The system's intelligence is not in one smart orchestration algorithm—it's distributed across the library of plans, each encoding a piece of situated procedural knowledge.

The programming task shifts from "write the orchestration algorithm" to "accumulate the know-how library." The latter is more incremental, more maintainable, and more aligned with how complex systems actually evolve—through accumulation of learned strategies, not through design of monolithic master plans.
```

### FILE: goal-subgoal-decomposition.md
```markdown
# Hierarchical Goal Decomposition: Intentions as Dynamic Execution Stacks

## The Fundamental Abstraction: Goals as First-Class Entities

A central innovation in AgentSpeak is treating **goals as first-class programming constructs**—not just comments or design documents, but executable entities that drive behavior. The authors explain: "Proactiveness means being able to exhibit goal-directed behaviour. If an agent has been delegated a particular goal, then we expect the agent to try to achieve this goal" (p. 4).

In conventional programming, goals are implicit in code structure. A function named `deployApplication()` implies a goal, but the goal itself isn't represented—only a specific procedure for achieving it. In AgentSpeak, goals are **explicit**:

```
// Goal adoption (declarative what)
+!deploy_application : true <- ...

// NOT a function call (imperative how)
```

This distinction enables:
- **Multiple strategies**: Different plans can achieve the same goal
- **Failure recovery**: If one strategy fails, try another
- **Context sensitivity**: Which strategy executes depends on beliefs
- **Hierarchical decomposition**: Goals decompose into sub-goals, which decompose further

The goal `!deploy_application` is an abstract intention. **How** it gets achieved is determined by runtime plan selection, not by compile-time binding.

## Goal Types: Achievement vs. Test Goals

AgentSpeak distinguishes two goal types (Chapter 3):

### Achievement Goals: `!goal`

**Semantics**: Make `goal` true in the world (or in beliefs). The agent should **achieve** this outcome.

**Triggering**: When `!goal` is adopted (from plan body or external request), event `+!goal` is generated. This triggers plan selection: find plans with trigger `+!goal`, evaluate contexts, execute one.

**Example**:
```
+!secure_building : true <- 
    !lock_all_doors;
    !arm_alarm;
    !verify_security.
```

Each sub-goal (`!lock_all_doors`, etc.) is an achievement goal. The agent finds plans to achieve them. If `lock_all_doors` is already true (belief exists), some plans might treat this as trivial (do nothing). Others might verify and report.

### Test Goals: `?query`

**Semantics**: Check whether `query` is true in beliefs. The agent should **test** this condition.

**Behavior**: If `query` unifies with a belief, succeed immediately. If not, suspend intention until belief appears (with optional timeout), or fail immediately depending on configuration.

**Example**:
```
+!process_order : true <-
    ?payment_received;  // Wait until this belief exists
    !ship_product.
```

Test goals enable **synchronization**: a plan waits for conditions to become true before proceeding. This is critical for coordination—one agent waits for another to complete a task (signaled by belief change).

**Key Difference**: Achievement goals trigger deliberation (plan selection, execution). Test goals trigger passive waiting (query beliefs, wait if not found). Achievement goals *change* the world; test goals *observe* it.

## Intention Stacks: The Hierarchical Execution Model

When an agent adopts a goal, it doesn't immediately execute to completion. Instead, it creates an **intention**—a stack of partially executed plans. The authors detail this in Chapter 4's operational semantics.

### Stack Structure

An intention is a stack where each frame represents:
- The **plan** being executed
- The **current position** in the plan body (which step is next)
- The **goal** this plan is achieving (if any)
- The **unification** (variable bindings) for this plan

Example: Agent has goal `!fulfillOrder(order123)`. 

**Step 1**: Plan selected:
```
+!fulfillOrder(O) : true <-
    !validatePayment(O);
    !checkInventory(O);
    !shipProduct(O).
```

Intention stack:
```
Frame 1: Plan P1 for !fulfillOrder(order123), at step "!validatePayment(order123)"
```

**Step 2**: Execute `!validatePayment(order123)`. This adopts sub-goal, triggers plan selection, selects plan:
```
+!validatePayment(O) : paymentMethod(O, creditCard) <-
    charge(O.creditCard);
    +paymentConfirmed(O).
```

Intention stack becomes:
```
Frame 2: Plan P2 for !validatePayment(order123), at step "charge(order123.creditCard)"
Frame 1: Plan P1 for !fulfillOrder(order123), at step "!validatePayment(order123)" [SUSPENDED]
```

**Step 3**: Execute `charge(...)` action. If successful, move to next step in P2: `+paymentConfirmed(order123)`.

**Step 4**: P2 completes (no more steps). Pop Frame 2. Frame 1 resumes at next step: `!checkInventory(order123)`.

**Step 5**: This adopts another sub-goal, pushes another frame, etc.

### Key Properties

**Property 1: Hierarchical Suspension**

When a plan adopts a sub-goal, the parent plan **suspends** until sub-goal completes. This creates a natural hierarchy:
- High-level goals wait for low-level goals
- No explicit "call and wait" syntax—it's implicit in sub-goal adoption
- Parent doesn't need to know *how* sub-goal is achieved—just that it *is* achieved

**Property 2: Failure Propagation**

If a plan at the top of the stack fails (action fails, context becomes false, sub-goal fails), the failure propagates:
1. Try alternative plans for current goal (pop failed plan, push alternative if exists)
2. If no alternatives, pop frame, signal failure to parent goal
3. Parent goal now fails, repeat process upward

This creates **cascading failure handling**: low-level failure might be recovered locally, or might propagate to higher levels that have better recovery strategies.

**Property 3: Intention Interleaving**

An agent can have **multiple intentions** simultaneously (multiple intention stacks). Each cycle, the agent executes one step from one intention, then switches to another. This enables:
- **Concurrency**: Multiple goals pursued in parallel
- **Responsiveness**: No intention monopolizes execution; all make incremental progress
- **Prioritization**: Intention selection can be customized (high-priority goals get more CPU time)

**Example**: Agent simultaneously pursues:
- Intention 1: `!monitor_temperature` (continuous, reactive)
- Intention 2: `!complete_report` (deadline-driven, proactive)  
- Intention 3: `!respond_to_query` (interactive, high-priority)

Each cycle, one step from one intention executes. All make progress, none starve (unless prioritized).

## Implications for Problem Decomposition

### Implication 1: Decompose by Purpose, Not Procedure

Traditional decomposition: break complex function into sub-functions. Focus on procedural steps.

AgentSpeak decomposition: break high-level goal into sub-goals. Focus on outcomes.

**Example—Traditional**:
```
function deployApplication() {
    runTests();
    backupCurrentVersion();
    uploadNewVersion();
    restartServices();
}
```

Rigid sequence, no alternatives, single point of failure.

**Example—AgentSpeak**:
```
+!deploy_application : true <-
    !ensure_tests_pass;
    !ensure_backup_exists;
    !ensure_new_version_deployed;
    !ensure_services_running.
```

Each sub-goal is abstract—multiple plans can achieve each, selected based on context. `!ensure_backup_exists` might have plans for "incremental backup" vs. "full backup" vs. "skip if recent backup exists."

### Implication 2: Separate Concerns via Goal Hierarchy

Different concerns → different levels of goal hierarchy.

**High-level**: Business logic (what needs to be achieved for user)
```
+!fulfill_customer_order(O) : true <-
    !validate_order(O);
    !process_payment(O);
    !ship_product(O);
    !notify_customer(O).
```

**Mid-level**: Domain logic (how to achieve business sub-goals)
```
+!process_payment(O) : paymentMethod(O, card) <-
    !charge_card(O.card, O.amount);
    !record_transaction(O).

+!process_payment(O) : paymentMethod(O, paypal) <-
    !initiate_paypal_flow(O);
    !await_confirmation(O);
    !record_transaction(O).
```

**Low-level**: Technical operations (how to interact with infrastructure)
```
+!charge_card(Card, Amt) : gateway_available(stripe) <-
    call_stripe_api(Card, Amt).

+!charge_card(Card, Amt) : not(gateway_available(stripe)) <-
    call_backup_gateway(Card, Amt).
```

Each level abstracts away lower-level details. Changes at low level (switch payment gateway) don't affect high level (business logic unchanged).

### Implication 3: Exploit Parallelism via Multiple Intentions

If sub-goals are independent, adopt multiple simultaneously:
```
+!prepare_report : true <-
    !fetch_sales_data;
    !fetch_inventory_data;
    !fetch_customer_data;
    ?sales_data(S) & ?inventory_data(I) & ?customer_data(C);  // Wait for all
    !synthesize_report(S, I, C).
```

Each `!fetch_*` sub-goal creates an intention. All execute concurrently (interleaved). Test goals wait for all to complete. This is **declarative parallelism**—no explicit thread management.

For orchestration systems: if multiple skills can run in parallel, adopt their goals simultaneously. The agent runtime handles interleaving.

### Implication 4: Opportunistic Re-Planning

Because sub-goals are late-bound (plan selection at sub-goal adoption time), the system can adapt mid-execution.

**Scenario**: High-level goal `!optimize_system` has sub-goal `!reduce_latency`. Initially, context is `userLoad(low)`, so plan "cache warming" is selected. During execution, belief updates: `+userLoad(high)`. Next sub-goal adoption for `!reduce_latency` might select different plan: "increase server capacity."

The high-level plan didn't change—but the strategy for achieving its sub-goals adapted to changed context. This is **reactive planning**: the "plan" (which sub-goals to pursue) is fixed, but the "strategies" (how to achieve them) are dynamic.

## Advanced Pattern: Conditional Goal Adoption

Sometimes, whether to pursue a sub-goal depends on runtime conditions:

```
+!handle_request(R) : true <-
    !authenticate(R);
    if (authorized(R)) {
        !process_request(R)
    } else {
        !reject_request(R)
    };
    !log_outcome(R).
```

The `if` is a plan body control structure (Jason supports these). Goal adoption is conditional on belief state. This enables **dynamic goal selection**, not just dynamic plan selection.

## Advanced Pattern: Goal Parameterization and Instantiation

Goals can carry parameters:
```
+!process_batch(Items) : true <-
    for (I in Items) {
        !process_item(I)
    }.
```

This creates multiple goal instances: `!process_item(item1)`, `!process_item(item2)`, etc. Each might trigger different plans (based on item properties in context):

```
+!process_item(I) : type(I, urgent) <- fast_process(I).
+!process_item(I) : type(I, normal) <- standard_process(I).
```

This is **data-driven goal decomposition**: the structure of sub-goals emerges from data, not fixed in code.

## Advanced Pattern: Goal Lifecycle Management

Jason allows dropping goals:
```
+!long_running_task : true <-
    +task_in_progress;
    compute_heavy_operation;
    -task_in_progress.

// Cancel if overtaken by events
+urgent_interrupt : task_in_progress <-
    .drop_goal(!long_running_task);
    !handle_interrupt.
```

This enables **goal abandonment**: recognize when a goal is no longer relevant (context changed, deadline passed, user canceled) and explicitly stop pursuing it. The intention stack for that goal is removed, freeing resources.

## Boundary Conditions and Anti-Patterns

### Anti-Pattern 1: Deep Nesting Without Justification

Too many levels of goal decomposition → hard to understand, hard to debug.

**Bad**:
```
+!A : true <- !B.
+!B : true <- !C.
+!C : true <- !D.
+!D : true <- do_actual_work.
```

Four levels of indirection to do simple work. Why?

**Better**: Only introduce sub-goals when there's genuine abstraction or alternative strategies:
```
+!A : true <- do_actual_work.
```

**Guideline**: Each level of goal hierarchy should either:
- Represent a meaningful abstraction (business logic → domain logic → technical operations)
- Provide alternative strategies (multiple plans for same goal)
- Enable parallelism (independent sub-goals)

### Anti-Pattern 2: Pseudo-Goals (Goals That Aren't Really Goals)

Using goals for simple sequencing that doesn't need abstraction:

**Bad**:
```
+!task : true <- !step1; !step2; !step3.
+!step1 : true <- action1.
+!step2 : true <- action2.
+!step3 :