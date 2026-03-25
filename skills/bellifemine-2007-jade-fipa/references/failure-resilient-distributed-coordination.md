# Failure-Resilient Distributed Coordination: How Production Agent Systems Stay Alive

## The Distributed Failure Problem

Distributed systems fail in ways single-machine systems don't. JADE, running production systems like OASIS (air traffic control at Sydney airport) and industrial process control, codifies hard-won lessons about how to keep multi-agent systems running when components fail.

The book's approach: **Failure is not exceptional—it's structural.** The architecture assumes:
- Messages can be lost or delayed
- Agents can crash mid-execution
- Network partitions can isolate subsets of agents
- Devices can go offline and reconnect hours later

Rather than try to prevent failures (impossible), JADE provides **protocols and patterns that degrade gracefully**.

## Layer 1: Protocol-Level Failure Handling

FIPA-ACL defines **performatives** (communicative acts) that explicitly represent failure:

- **REFUSE**: "I can't do this task" (sent *before* starting)
- **FAILURE**: "I tried but couldn't complete" (sent *after* starting)
- **NOT-UNDERSTOOD**: "I can't parse your message" (semantic mismatch)
- **CANCEL**: "Stop what you're doing" (meta-protocol)

These aren't error codes—they're **first-class messages** that agents must be prepared to receive and handle.

### Example: Contract Net with Explicit Failure Paths

The Contract Net protocol (FIPA29) includes failure handling at every step:

```
1. Manager sends CFP (Call for Proposals)
   - Contractors can respond: PROPOSE (I can do it) or REFUSE (I can't)
   - Timeout if no responses → Manager retries or escalates

2. Manager sends ACCEPT-PROPOSAL to winner
   - Contractor can respond: AGREE (I'm starting) or REFUSE (I changed my mind)
   - AGREE establishes a contract (commitment)

3. Contractor executes
   - On success: INFORM (result)
   - On failure: FAILURE (reason)
   - Timeout → Manager retries with another contractor

4. Manager can send CANCEL at any time
   - Contractor must stop and respond: INFORM (stopped) or FAILURE (couldn't stop cleanly)
```

**Key design principle**: Every step has **explicit failure paths**, not implicit error handling. The protocol anticipates refusal, timeout, and cancellation as **normal cases**, not exceptions.

### Book-Trading Example: Refusal Before Commitment

The BookSellerAgent checks preconditions before agreeing to sell:

```java
private class CallForOfferServer extends CyclicBehaviour {
    public void action() {
        ACLMessage msg = myAgent.receive();
        if (msg != null) {
            String title = msg.getContent();
            ACLMessage reply = msg.createReply();
            PriceManager pm = (PriceManager) catalogue.get(title);
            if (pm != null) {
                reply.setPerformative(ACLMessage.PROPOSE);
                reply.setContent(String.valueOf(pm.getCurrentPrice()));
            } else {
                reply.setPerformative(ACLMessage.REFUSE);  // No commitment
            }
            myAgent.send(reply);
        }
    }
}
```

If the book isn't in the catalog, the seller **immediately refuses** (doesn't accept and then fail later). This prevents wasted work and allows the buyer to query other sellers quickly.

**For WinDAGs**: Skills should check preconditions *before* accepting work:

```python
def handle_task_request(task):
    if not check_preconditions(task):
        return REFUSE(reason="Preconditions not met")
    if resource_unavailable():
        return REFUSE(reason="Resource busy")
    # Only accept if we can commit
    return AGREE()
```

This is better than accepting and failing later (which blocks the requester while you fail).

## Layer 2: Message-Level Reliability

### Asynchronous Message Passing with Timeouts

JADE's communication is **asynchronous by default**:

> "Message-based asynchronous communication is the basic form of communication between agents in JADE; an agent wishing to communicate must send a message to an identified destination (or set of destinations). There is no temporal dependency between the sender and receivers: a receiver might not be available when the sender issues the message."

This eliminates **temporal coupling**: the sender doesn't block waiting for a reply. But it introduces a problem: **How do you know if a reply is coming?**

JADE's solution: **blockingReceive with timeout**:

```java
ACLMessage reply = myAgent.blockingReceive(mt, timeout);
if (reply == null) {
    // Timeout: receiver didn't respond
    // Options: retry, escalate, abort
}
```

The `timeout` parameter is critical. Without it, the agent hangs indefinitely if the receiver crashes. With it, the agent can implement **retry logic**:

```java
int retries = 3;
ACLMessage reply = null;
while (retries > 0 && reply == null) {
    myAgent.send(request);
    reply = myAgent.blockingReceive(mt, 5000); // 5 sec timeout
    retries--;
}
if (reply == null) {
    // All retries exhausted: escalate or fail gracefully
}
```

### Persistent Message Delivery

For critical messages (e.g., task assignments, payment transactions), JADE provides **Persistent Delivery Service**:

```
persistent-delivery-basedir: /var/jade/messages
persistent-delivery-storagemethod: file
persistent-delivery-sendfailureperiod: 60000  # Retry every 60 seconds
```

Messages are written to disk before sending. If delivery fails:
1. Message remains on disk
2. JADE retries periodically
3. If receiver comes online later, message is delivered
4. After successful delivery, message is deleted

**For WinDAGs**: Implement persistent queues (e.g., Kafka, RabbitMQ with durable queues) for inter-skill messages. If Skill B crashes while Skill A is sending results, the message waits in the queue until B restarts.

### Message Templates for Resilient Routing

The book emphasizes **conversation-id** and **in-reply-to** fields:

> "It is a good practice to specify the conversation control fields in the messages exchanged within the conversation. This allows the easy creation of unambiguous templates matching the possible replies."

This prevents a failure mode: Agent A sends requests to Skill X and Skill Y concurrently. Responses arrive out of order. Without correlation IDs, Agent A can't tell which response is for which request.

**Pattern from book-trading**:

```java
// Send CFP with unique ID
cfp.setConversationId("book-trade");
cfp.setReplyWith("cfp" + System.currentTimeMillis());

// Create template that matches only replies to this CFP
MessageTemplate mt = MessageTemplate.and(
    MessageTemplate.MatchConversationId("book-trade"),
    MessageTemplate.MatchInReplyTo(cfp.getReplyWith()));

// Receive with template: only matching replies are returned
ACLMessage reply = myAgent.receive(mt);
```

**For WinDAGs**: Every skill invocation should include:
- **Request-ID**: Globally unique (UUID)
- **Conversation-ID**: Identifies the workflow instance
- **In-reply-to**: Points to the request this is responding to

This allows the orchestrator to:
- Route responses to the correct workflow state
- Detect lost messages (request sent, no reply with matching in-reply-to after timeout)
- Detect duplicate messages (same request-id seen twice → deduplicate)

## Layer 3: Agent-Level Resilience

### Cooperative Scheduling Eliminates Synchronization Bugs

JADE uses **non-preemptive scheduling** for behaviors:

> "The scheduling of behaviours in an agent is not pre-emptive (as for Java threads), but cooperative. This means that when a behaviour is scheduled for execution its action() method is called and runs until it returns."

**Why this matters for failure prevention**:
1. **No data races**: Only one behavior runs at a time per agent → no need for locks
2. **Predictable state**: Behaviors see consistent snapshots of agent state
3. **Explicit yield points**: Behaviors call `block()` to yield control → agent can schedule other behaviors or check for termination

**Failure mode this prevents**: Traditional multi-threaded agents can deadlock (two threads waiting for each other's locks) or corrupt state (race conditions). Cooperative scheduling eliminates both.

**Constraint**: Behaviors must **not block indefinitely** in `action()`. A misbehaving behavior can hang the agent. The book warns:

> "A behaviour such as that shown below will prevent any other behaviour from being executed because its action() method will never return."

**For WinDAGs**: If using cooperative scheduling for skill executors:
- Enforce **per-behavior timeouts** at the scheduler level
- If a behavior doesn't return within N seconds, forcibly terminate it
- Log timeout events for debugging (which behaviors are misbehaving?)

### State Machine Pattern for Explicit Failure Handling

The book demonstrates **FSM-based behaviors** where each state explicitly handles failure transitions:

```java
private class BookNegotiator extends Behaviour {
    private int step = 0;

    public void action() {
        switch (step) {
            case 0:  // Send CFP
                myAgent.send(cfp);
                step = 1;
                break;

            case 1:  // Collect replies
                ACLMessage reply = myAgent.receive(mt);
                if (reply != null) {
                    // Process reply
                    repliesCnt++;
                    if (repliesCnt >= sellerAgents.length) {
                        step = 2;  // All replies received
                    }
                } else {
                    block();  // Wait for more replies
                }
                break;

            case 2:  // Send purchase order
                if (bestSeller != null && bestPrice <= maxPrice) {
                    myAgent.send(order);
                    step = 3;
                } else {
                    step = 4;  // No acceptable offer → terminate
                }
                break;

            case 3:  // Receive confirmation
                reply = myAgent.receive(mt);
                if (reply != null) {
                    if (reply.getPerformative() == ACLMessage.INFORM) {
                        // Success
                    }
                    step = 4;  // Terminal state
                } else {
                    block();
                }
                break;
        }
    }

    public boolean done() {
        return step == 4;
    }
}
```

**Explicit failure paths**:
- If no acceptable offers (step 2), jump directly to terminal state (step 4)
- If confirmation doesn't arrive (step 3), timeout logic (implicit in receive + block)
- Each state has a clear next state or terminal condition

**For WinDAGs**: Represent workflows as explicit FSMs:

```python
class WorkflowFSM:
    def __init__(self):
        self.state = "INIT"

    def step(self):
        if self.state == "INIT":
            self.send_requests()
            self.state = "WAITING"
        elif self.state == "WAITING":
            replies = self.receive_replies(timeout=5)
            if all_replies_received(replies):
                self.state = "PROCESSING"
            elif timeout_expired():
                self.state = "RETRY" if retries_left() else "FAILED"
        elif self.state == "PROCESSING":
            result = self.process(replies)
            if result.success:
                self.state = "SUCCESS"
            else:
                self.state = "FAILED"
        elif self.state in ["SUCCESS", "FAILED"]:
            return True  # Terminal state
        return False  # Not done yet
```

This makes failure handling **compositional**: each state's failure paths are explicit, and higher-level workflows can inspect the terminal state (SUCCESS vs. FAILED) to decide recovery.

## Layer 4: Platform-Level Resilience

### Main Container Replication

The main container (which hosts the AMS and DF) is a single point of failure. JADE provides **Main Replication Service** (MCRS):

```
Configuration:
jade_core_replication_AddressNotificationService: true
jade_core_replication_MainReplicationService: true
```

MCRS works by:
1. **Backup containers** periodically sync state from the main container
2. If the main container crashes, a backup **promotes itself** to main
3. Agents re-register with the new main container
4. Service continuity maintained (agents don't need to restart)

**For WinDAGs**: If the central orchestrator is a single point of failure:
- Deploy multiple orchestrator replicas (active-passive or active-active)
- Use leader election (e.g., Raft, Zookeeper) to choose the active orchestrator
- Replicate orchestrator state (workflow states, skill registry) across replicas
- On failover, workflows resume from last checkpointed state

### UDP Node Monitoring

JADE uses **periodic health checks** to detect dead agents:

```
udp-node-monitoring-pingdelay: 5000           # Ping every 5 seconds
udp-node-monitoring-pingdelaylimit: 30000     # Tolerate 30 sec delay
udp-node-monitoring-unreachablelimit: 3       # 3 missed pings → unreachable
```

If an agent doesn't respond to pings:
1. Mark as **unreachable**
2. Remove from routing tables (messages to it will fail-fast)
3. Notify dependent agents (if configured)

**For WinDAGs**: Implement heartbeat monitoring:
- Each skill sends heartbeat every N seconds
- Orchestrator expects heartbeats within 3N seconds
- If 3 consecutive heartbeats missed → mark skill as down
- Route new tasks to healthy replicas
- When skill recovers, re-add to pool automatically

## Layer 5: Application-Level Recovery Strategies

### The Connection Listener Pattern (JADE-LEAP)

For mobile agents (JADE-LEAP), the split-container architecture exposes **connection events**:

```java
MicroRuntime.setConnectionListener(new ConnectionListener() {
    public void handleConnectionEvent(int code, Object info) {
        switch (code) {
            case DISCONNECTED:
                // Cache messages locally
                log.warning("Connection lost");
                break;

            case RECONNECTED:
                // Flush cached messages
                log.info("Connection restored");
                break;

            case RECONNECTION_FAILURE:
                // Escalate to user or fallback to alternative network
                log.error("Reconnection failed after retries");
                break;

            case BE_NOT_FOUND:
                // Back-end was killed during disconnect
                log.error("Back-end lost: state unrecoverable");
                break;
        }
    }
});
```

**Why this matters**: The system doesn't pretend disconnections don't happen. Instead, it **exposes them to application logic** so apps can make informed decisions:
- Buffer messages during disconnect (don't fail silently)
- Retry reconnection with exponential backoff
- Escalate to user if recovery impossible
- Invalidate cached state if back-end lost

**For WinDAGs**: Expose similar events:
- `SKILL_UNAVAILABLE`: Registry lookup failed
- `EXECUTION_STALLED`: Skill started but no heartbeat
- `RESULT_UNDELIVERABLE`: Skill completed but orchestrator unreachable
- `WORKFLOW_TIMEOUT`: End-to-end deadline exceeded

Applications can register handlers:

```python
orchestrator.on_event(SKILL_UNAVAILABLE, lambda event: 
    retry_with_fallback(event.skill_id))

orchestrator.on_event(WORKFLOW_TIMEOUT, lambda event: 
    send_alert_to_human(event.workflow_id))
```

### Subscription-Based Monitoring

FIPA35 (Subscribe interaction protocol) enables **push-based updates**:

```
Agent A → Agent B: SUBSCRIBE (notify me when condition C holds)
Agent B: AGREE (I'll monitor C)
... time passes ...
Agent B → Agent A: INFORM (C is now true)
Agent A: CANCEL (stop monitoring)
```

**Use for failure detection**: An orchestrator can subscribe to skill health updates:

```java
ACLMessage subscribe = new ACLMessage(ACLMessage.SUBSCRIBE);
subscribe.setContent("(status ?x)");  // Notify me of any status changes
subscribe.addReceiver(skillAgent);
myAgent.send(subscribe);

// Later, skill sends INFORM whenever its status changes
// Orchestrator processes INFORMs asynchronously
```

**For WinDAGs**: Use pub/sub (e.g., Redis Pub/Sub, Kafka) for status updates:
- Skills publish `(skill_id, status, timestamp)` to a topic
- Orchestrators subscribe to the topic
- On status change (ready → running → failed), orchestrator updates workflow state
- No polling; push-based updates reduce latency and load

## Lessons for 180+ Skill Orchestration

### 1. Explicit Failure Performatives

Don't use generic error codes. Define specific failure types:
- **Skill not found**: Registry lookup failed
- **Preconditions not met**: Skill can't start due to missing inputs
- **Resource exhausted**: Skill started but ran out of memory/time/quota
- **Logical contradiction**: Skill's output conflicts with existing beliefs

Each failure type enables different recovery:
- Skill not found → retry with fallback skill
- Preconditions not met → wait for upstream skills to complete
- Resource exhausted → allocate more resources or degrade gracefully
- Logical contradiction → abort workflow or invoke conflict resolution

### 2. Message Correlation IDs

Every message must have:
- **Request-ID** (globally unique)
- **Conversation-ID** (workflow instance)
- **In-reply-to** (parent message)

This enables:
- Response routing (which workflow does this reply belong to?)
- Timeout detection (request sent at T, no reply with matching in-reply-to by T+timeout)
- Duplicate detection (same request-id seen twice → deduplicate)

### 3. Timeout at Every Layer

- **Network timeout**: TCP/HTTP connection timeout (3-10 seconds)
- **Message timeout**: Expected reply by deadline (5-60 seconds)
- **Workflow timeout**: End-to-end deadline (minutes to hours)
- **Heartbeat timeout**: Expect periodic health check (5-30 seconds)

Each timeout has a different recovery strategy:
- Network timeout → retry with exponential backoff
- Message timeout → send to fallback skill
- Workflow timeout → escalate to human or abort
- Heartbeat timeout → mark skill as down, route to replica

### 4. Persistent Queues for Critical Paths

Use durable message queues (Kafka, RabbitMQ with persistence) for:
- Task assignments (don't lose work)
- Results (don't lose computed outputs)
- State transitions (don't lose workflow progress)

Avoid persistent queues for:
- Heartbeats (ephemeral, no replay needed)
- Logs (write to separate logging infrastructure)
- Temporary queries (recompute if lost)

### 5. Health Monitoring with Automatic Remediation

- **Passive monitoring**: Skills send periodic heartbeats
- **Active monitoring**: Orchestrator pings skills periodically
- **Remediation**: On failure detected, automatically:
  - Mark skill as down in registry
  - Redirect in-flight tasks to replicas
  - Alert human if no replicas available
  - Re-add skill when heartbeat resumes

### 6. Graceful Degradation Over Fail-Stop

When a skill fails, don't crash the entire workflow. Options:
- **Retry**: Same skill, different input or parameters
- **Fallback**: Different skill with similar capability
- **Partial result**: Return incomplete output with warning
- **Abort subtree**: Fail this branch but continue other branches

JADE's FSM-based behaviors enable this: each state can transition to SUCCESS, RETRY, FALLBACK, or TERMINAL_FAILURE based on domain logic.

### 7. Semantic Error Handling

Use NOT_UNDERSTOOD performative when messages don't match expected ontology:
- Sender gets explicit feedback (not silent failure)
- Sender can retry with corrected data or negotiate a compatible ontology
- Receiver doesn't crash on unexpected input

**For WinDAGs**: Validate skill inputs against declared schemas before execution. If validation fails, return schema mismatch error (not runtime exception).

## The Hard Truth About Distributed Failures

The book's approach reflects a mature understanding: **You cannot prevent distributed failures. You can only design systems that remain coherent when failures occur.**

Key principles:
1. **Explicit failure paths** in protocols (not exceptions)
2. **Asynchronous messaging** with timeouts (not blocking calls)
3. **Stateful recovery** via persistent queues (not replay from logs)
4. **Decentralized coordination** with central discovery (not all-or-nothing)
5. **Observable failure** via events (not silent degradation)

These patterns, proven in mission-critical systems (air traffic control, industrial automation), are directly applicable to DAG-based orchestration of 180+ skills. Failure resilience isn't an add-on—it's a structural property that must be designed in from the start.