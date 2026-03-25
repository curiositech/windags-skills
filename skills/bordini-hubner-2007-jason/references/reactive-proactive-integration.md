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