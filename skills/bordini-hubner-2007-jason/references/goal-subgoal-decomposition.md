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