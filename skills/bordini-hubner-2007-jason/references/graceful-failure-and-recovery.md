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