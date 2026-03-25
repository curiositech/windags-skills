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