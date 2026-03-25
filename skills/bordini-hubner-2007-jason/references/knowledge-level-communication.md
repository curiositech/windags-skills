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