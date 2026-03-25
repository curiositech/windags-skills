# Hierarchical Task Decomposition: Composable Abstractions for Complex Workflows

## The Decomposition Problem

A complex task (e.g., "Buy the best book on JADE at the lowest price") can't be solved by a single atomic action. It requires:
1. **Discovery**: Find all agents selling books
2. **Negotiation**: Request proposals from sellers
3. **Evaluation**: Compare proposals by price, delivery time, etc.
4. **Commitment**: Accept the best proposal
5. **Confirmation**: Receive and verify delivery

JADE's solution: **Behaviors as composable state machines.** Each behavior is a unit of work that can be:
- **Atomic** (one-shot: execute once and finish)
- **Cyclic** (loop forever: listen for messages, handle, repeat)
- **Sequential** (chain: do A, then B, then C)
- **Parallel** (fork-join: do A and B concurrently, wait for both)
- **Conditional** (FSM: do A, then B or C based on condition)

These compose into **arbitrarily deep hierarchies**: a SequentialBehaviour can contain ParallelBehaviours, each of which contains OneShotBehaviours, etc.

## Behavior as the Fundamental Unit of Work

### The Behavior Interface

```java
public abstract class Behaviour {
    public abstract void action();     // What to do
    public abstract boolean done();    // Are we finished?
    
    protected void block();            // Yield control (wait for event)
    protected void block(long timeout);
}
```

**Key insight from the book**:

> "The scheduling of behaviours in an agent is not pre-emptive (as for Java threads), but cooperative. This means that when a behaviour is scheduled for execution its action() method is called and runs until it returns."

Behaviors are **not threads**. They're lightweight units of work scheduled by the agent. Benefits:
1. **Single Java thread per agent** → scales to thousands of agents on one JVM
2. **No locks needed** → behaviors see consistent snapshots of agent state
3. **Fast switching** → behavior switching is method call overhead, not thread context switch

**Constraint**: A behavior must **return control** (either by finishing or calling `block()`). If it loops forever without yielding, the agent hangs.

### Three Primitive Behavior Types

#### 1. OneShotBehaviour
Executes once and finishes:

```java
public class SendMessageBehaviour extends OneShotBehaviour {
    public void action() {
        ACLMessage msg = new ACLMessage(ACLMessage.INFORM);
        msg.setContent("Hello");
        myAgent.send(msg);
    }
}
```

**Use cases**:
- Send a message
- Perform a computation
- Initialize state

#### 2. CyclicBehaviour
Loops forever:

```java
public class MessageListenerBehaviour extends CyclicBehaviour {
    public void action() {
        ACLMessage msg = myAgent.receive();
        if (msg != null) {
            // Process message
        } else {
            block();  // Wait for next message
        }
    }
}
```

**Critical pattern**: Call `block()` when no work available. The agent scheduler removes the behavior from the run queue. When a message arrives, the scheduler reactivates it.

**Use cases**:
- Listen for messages
- Monitor events
- Maintain a service

#### 3. Behaviour with State (Generic FSM)
Uses a `step` variable to track state:

```java
public class NegotiationBehaviour extends Behaviour {
    private int step = 0;

    public void action() {
        switch (step) {
            case 0:
                sendCFP();
                step = 1;
                break;
            case 1:
                collectProposals();
                if (allProposalsReceived()) step = 2;
                break;
            case 2:
                selectBestProposal();
                step = 3;
                break;
            case 3:
                sendAcceptance();
                step = 4;
                break;
        }
    }

    public boolean done() {
        return step == 4;
    }
}
```

**Why this pattern is powerful**: It's a **lightweight coroutine**. The behavior resumes from where it left off (state `step`) each time `action()` is called. No need for threads or continuations.

**Use cases**:
- Multi-step protocols (Contract Net, negotiation)
- Workflows with decision points
- Retry logic with backoff

## Composite Behaviors: Building Hierarchies

### SequentialBehaviour: Chain Tasks

Execute behaviors in order, one at a time:

```java
SequentialBehaviour seq = new SequentialBehaviour();
seq.addSubBehaviour(new RegisterWithDF());
seq.addSubBehaviour(new FindSellers());
seq.addSubBehaviour(new Negotiate());
seq.addSubBehaviour(new DeregisterFromDF());
myAgent.addBehaviour(seq);
```

**Execution model**:
1. Execute first sub-behavior until `done() == true`
2. Execute second sub-behavior until `done() == true`
3. ... continue until all sub-behaviors complete
4. SequentialBehaviour itself becomes `done()`

**Critical feature**: If a sub-behavior calls `block()`, the entire SequentialBehaviour blocks. Control returns to the agent scheduler, which can run other behaviors.

**For WinDAGs**: This is the **DAG linearization pattern**. If you have a dependency chain (Skill A → Skill B → Skill C), represent it as:

```python
seq = SequentialBehaviour()
seq.add(InvokeSkillA())
seq.add(InvokeSkillB())  # Waits for A to finish
seq.add(InvokeSkillC())  # Waits for B to finish
```

### ParallelBehaviour: Fork-Join

Execute behaviors concurrently (cooperatively, not preemptively):

```java
ParallelBehaviour par = new ParallelBehaviour(ParallelBehaviour.WHEN_ALL);
par.addSubBehaviour(new QuerySellerA());
par.addSubBehaviour(new QuerySellerB());
par.addSubBehaviour(new QuerySellerC());
myAgent.addBehaviour(par);
```

**Execution model**:
1. On each scheduler tick, execute one step of each sub-behavior (round-robin)
2. If a sub-behavior calls `block()`, skip it this tick
3. When all sub-behaviors are `done()`, ParallelBehaviour is done

**Termination conditions** (configurable):
- `WHEN_ALL`: Wait for all sub-behaviors to finish
- `WHEN_ANY`: Finish as soon as one sub-behavior finishes (race)

**For WinDAGs**: This is the **parallel skill execution pattern**. If Skill A, B, and C can run concurrently (no dependencies between them):

```python
par = ParallelBehaviour(WHEN_ALL)
par.add(InvokeSkillA())
par.add(InvokeSkillB())
par.add(InvokeSkillC())
# Wait for all three to complete before proceeding
```

**Example from book-trading**: A buyer sends CFPs to multiple sellers concurrently (ParallelBehaviour), waits for all responses (WHEN_ALL), then evaluates proposals (next behavior in SequentialBehaviour).

### FSMBehaviour: Conditional Branching

Execute behaviors based on state transitions:

```java
FSMBehaviour fsm = new FSMBehaviour();
fsm.registerFirstState(new SendCFP(), "SendCFP");
fsm.registerState(new EvaluateProposals(), "Evaluate");
fsm.registerState(new SendAcceptance(), "Accept");
fsm.registerLastState(new Confirm(), "Confirm");

fsm.registerTransition("SendCFP", "Evaluate", 0);  // Always transition
fsm.registerTransition("Evaluate", "Accept", 1);   // If acceptable proposal found
fsm.registerTransition("Evaluate", "Confirm", 2);  // If no acceptable proposal
fsm.registerTransition("Accept", "Confirm", 0);
```

**Execution model**:
1. Execute current state's behavior
2. When behavior finishes, call `onEnd()` to get exit code
3. Look up transition for (current_state, exit_code)
4. Transition to next state
5. Repeat until reaching a last state

**For WinDAGs**: This is the **decision-point pattern**. If Skill A succeeds, invoke Skill B; if Skill A fails, invoke Skill C (fallback):

```python
fsm = FSMBehaviour()
fsm.register_state("InvokeA", InvokeSkillA())
fsm.register_state("InvokeB", InvokeSkillB())
fsm.register_state("InvokeC", InvokeSkillC())  # Fallback

fsm.register_transition("InvokeA", "InvokeB", exit_code=SUCCESS)
fsm.register_transition("InvokeA", "InvokeC", exit_code=FAILURE)
```

## DataStore: Sharing State Across Behaviors

Behaviors in a composite need to share intermediate results. Example: `FindSellers` produces a list of seller AIDs that `Negotiate` needs.

**DataStore pattern**:

```java
DataStore ds = new DataStore();
SequentialBehaviour seq = new SequentialBehaviour();
seq.setDataStore(ds);

class FindSellers extends OneShotBehaviour {
    public void action() {
        DFAgentDescription[] sellers = DFService.search(...);
        getDataStore().put("sellers", sellers);  // Write to shared store
    }
}

class Negotiate extends Behaviour {
    public void action() {
        DFAgentDescription[] sellers = 
            (DFAgentDescription[]) getDataStore().get("sellers");  // Read from shared store
        // Use sellers...
    }
}

seq.addSubBehaviour(new FindSellers());
seq.addSubBehaviour(new Negotiate());
```

**Key insight**: The DataStore is **scoped to the composite behavior**. Sub-behaviors of the same parent share the store; unrelated behaviors don't see it. This is **lexical scoping for agent state**.

**For WinDAGs**: Implement a **workflow context** (similar to DataStore):

```python
class WorkflowContext:
    def __init__(self):
        self.data = {}

    def put(self, key, value):
        self.data[key] = value

    def get(self, key):
        return self.data.get(key)

seq = SequentialBehaviour(context=WorkflowContext())
seq.add(InvokeSkillA())  # Writes "result_a" to context
seq.add(InvokeSkillB())  # Reads "result_a" from context
```

## Example: Book-Trading Negotiation Decomposition

The book-trading system demonstrates hierarchical decomposition. The buyer agent's top-level behavior:

```
SequentialBehaviour (main workflow)
  ├─ OneShotBehaviour: Register with DF
  ├─ TickerBehaviour: Launch negotiations periodically
  │   └─ PurchaseManager (FSM)
  │       ├─ State 0: Send CFP to all sellers
  │       ├─ State 1: Collect PROPOSE replies (block until all received or timeout)
  │       ├─ State 2: Evaluate proposals, send ACCEPT to best
  │       ├─ State 3: Wait for INFORM (confirmation)
  │       └─ State 4: Terminal state (success or failure)
  └─ OneShotBehaviour: Deregister from DF on shutdown
```

**Key decomposition decisions**:

1. **Top-level is sequential**: Registration → negotiation loop → deregistration (lifecycle)
2. **Negotiation loop is cyclic**: Keep trying to buy books until stopped
3. **Each negotiation is an FSM**: Multi-step protocol with explicit state transitions
4. **CFP broadcast is implicit parallel**: Message sent to multiple sellers, wait for all replies

### Detailed FSM: PurchaseManager

```java
private class BookNegotiator extends Behaviour {
    private int step = 0;
    private MessageTemplate mt;
    private int repliesCnt = 0;
    private ACLMessage bestReply = null;

    public void action() {
        switch (step) {
            case 0:  // Send CFP
                ACLMessage cfp = new ACLMessage(ACLMessage.CFP);
                for (int i = 0; i < sellerAgents.length; ++i) {
                    cfp.addReceiver(sellerAgents[i]);
                }
                cfp.setContent(title);
                cfp.setConversationId("book-trade");
                cfp.setReplyWith("cfp" + System.currentTimeMillis());
                myAgent.send(cfp);

                mt = MessageTemplate.and(
                    MessageTemplate.MatchConversationId("book-trade"),
                    MessageTemplate.MatchInReplyTo(cfp.getReplyWith()));
                step = 1;
                break;

            case 1:  // Collect replies
                ACLMessage reply = myAgent.receive(mt);
                if (reply != null) {
                    if (reply.getPerformative() == ACLMessage.PROPOSE) {
                        int price = Integer.parseInt(reply.getContent());
                        if (bestReply == null || price < bestPrice) {
                            bestPrice = price;
                            bestReply = reply;
                        }
                    }
                    repliesCnt++;
                    if (repliesCnt >= sellerAgents.length) {
                        step = 2;  // All replies received
                    }
                } else {
                    block();  // Wait for more replies
                }
                break;

            case 2:  // Send acceptance
                if (bestReply != null && bestPrice <= maxPrice) {
                    ACLMessage order = new ACLMessage(ACLMessage.ACCEPT_PROPOSAL);
                    order.addReceiver(bestReply.getSender());
                    order.setContent(title);
                    order.setConversationId("book-trade");
                    order.setReplyWith("order" + System.currentTimeMillis());
                    myAgent.send(order);

                    mt = MessageTemplate.and(
                        MessageTemplate.MatchConversationId("book-trade"),
                        MessageTemplate.MatchInReplyTo(order.getReplyWith()));
                    step = 3;
                } else {
                    step = 4;  // No acceptable offer
                }
                break;

            case 3:  // Wait for confirmation
                reply = myAgent.receive(mt);
                if (reply != null) {
                    if (reply.getPerformative() == ACLMessage.INFORM) {
                        myGui.notifyUser("Book successfully purchased.");
                    }
                    step = 4;
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

**Decomposition lessons**:

1. **State variable tracks progress**: `step` explicitly encodes where we are in the protocol
2. **Blocking is explicit**: Call `block()` when waiting for messages (not busy-wait)
3. **Message templates prevent cross-talk**: Each state creates a template that matches only relevant replies
4. **Early exit on failure**: If no acceptable offer (state 2), jump directly to terminal state (state 4)
5. **Single responsibility per state**: State 0 sends, state 1 collects, state 2 evaluates, state 3 confirms

### Why This Scales

Contrast with a monolithic approach (no decomposition):

```java
// Monolithic (anti-pattern)
void buyBook() {
    ACLMessage cfp = ...; send(cfp);
    List<ACLMessage> replies = new ArrayList<>();
    while (replies.size() < sellers.length) {
        ACLMessage reply = blockingReceive();
        replies.add(reply);
    }
    ACLMessage best = evaluateBest(replies);
    if (best != null) {
        send(accept);
        ACLMessage confirm = blockingReceive();
        if (confirm.getPerformative() == INFORM) {
            success();
        }
    }
}
```

**Problems**:
1. **Blocks the entire agent**: No other behaviors can run while waiting for replies
2. **No timeout handling**: If a seller never replies, hangs forever
3. **No cancellation**: Can't abort mid-negotiation
4. **Not composable**: Can't nest this inside a larger workflow

The FSM-based approach fixes all of these:
- Cooperative scheduling → other behaviors run while waiting
- Explicit timeout → jump to terminal state if deadline exceeded
- Cancellable → agent can call `removeBehaviour(negotiator)` to abort
- Composable → `BookNegotiator` can be a sub-behavior of a larger workflow

## Advanced Pattern: Behavior Nesting and Reuse

Behaviors compose recursively. Example: A top-level workflow contains multiple negotiations, each of which contains multiple queries:

```
SequentialBehaviour (main)
  ├─ ParallelBehaviour (negotiate for multiple books concurrently)
  │   ├─ BookNegotiator("JADE book")
  │   │   └─ FSM (send CFP → collect → evaluate → accept → confirm)
  │   └─ BookNegotiator("Design Patterns book")
  │       └─ FSM (send CFP → collect → evaluate → accept → confirm)
  └─ OneShotBehaviour (report results to user)
```

**Key insight**: Each `BookNegotiator` is independent. They run concurrently (ParallelBehaviour), but each is internally an FSM with blocking waits. The agent scheduler interleaves their execution.

**For WinDAGs**: Nested workflows enable **reusable sub-workflows**:

```python
class InvokeSkillWithRetry(SequentialBehaviour):
    def __init__(self, skill_name, max_retries=3):
        self.add(TrySkill(skill_name))
        self.add(CheckResult())
        self.add(RetryIfFailed(max_retries))

# Use as a building block
workflow = SequentialBehaviour()
workflow.add(InvokeSkillWithRetry("ExtractText"))
workflow.add(InvokeSkillWithRetry("AnalyzeSentiment"))
workflow.add(InvokeSkillWithRetry("GenerateReport"))
```

Each skill invocation is wrapped in a retry sub-workflow. If `ExtractText` fails, the retry logic runs (exponential backoff, fallback to alternative skill, etc.) without polluting the top-level workflow.

## Lessons for 180+ Skill Orchestration

### 1. Represent Workflows as Behavior Hierarchies

Don't hard-code workflows in imperative logic. Use composable behaviors:
- **Sequential dependencies**: SequentialBehaviour
- **Parallel execution**: ParallelBehaviour
- **Conditional branching**: FSMBehaviour
- **Retry logic**: SequentialBehaviour with loop detection
- **Timeouts**: TickerBehaviour with deadline checks

### 2. Use FSMs for Multi-Step Protocols

Any interaction that requires:
- Multiple message exchanges
- Waiting for responses
- Decision points based on responses
- Failure recovery

Should be an FSM. Explicit states make the protocol **readable** and **debuggable**.

### 3. Isolate State with DataStore

Don't share state via global variables or agent fields. Use DataStore (or equivalent workflow context) so that:
- State is scoped to the workflow (not leaked across workflows)
- Sub-behaviors can pass data cleanly (put/get, not side effects)
- Composite behaviors are **testable in isolation** (inject a mock DataStore)

### 4. Block Explicitly, Don't Spin-Wait

When waiting for a message or external event, call `block()` (or equivalent). Don't:

```python
# Anti-pattern: busy-wait
while True:
    msg = receive(timeout=0.1)
    if msg is not None:
        process(msg)
        break
```

Instead:

```python
# Correct: block and yield
msg = receive_blocking(template=mt)
if msg is not None:
    process(msg)
```

This allows the scheduler to run other behaviors, reducing CPU waste and latency.

### 5. Compose Behaviors for Reuse

Common sub-workflows (authentication, retry logic, error reporting) should be **reusable behaviors**:

```python
class RetryWithBackoff(SequentialBehaviour):
    def __init__(self, action, max_retries=3, backoff=2.0):
        for attempt in range(max_retries):
            self.add(TryAction(action))
            self.add(CheckSuccess())
            if attempt < max_retries - 1:
                self.add(WaitWithBackoff(backoff ** attempt))

# Use in multiple workflows
workflow1 = SequentialBehaviour()
workflow1.add(RetryWithBackoff(InvokeSkillA()))

workflow2 = SequentialBehaviour()
workflow2.add(RetryWithBackoff(InvokeSkillB()))
```

### 6. Test Behaviors in Isolation

Because behaviors are composable, they can be tested independently:

```python
# Unit test for NegotiationBehaviour
def test_negotiation_behavior():
    behavior = NegotiationBehaviour()
    
    # Inject mock agent
    behavior.set_agent(MockAgent())
    
    # Step 0: Should send CFP
    behavior.action()
    assert behavior.step == 1
    
    # Step 1: Inject mock replies
    mock_agent.inject_message(PROPOSE(price=50))
    behavior.action()
    assert behavior.best_price == 50
    
    # ... continue testing each state
```

### 7. Design for Observability

Each state transition should be logged:

```python
class FSMBehaviour:
    def transition(self, from_state, to_state):
        logger.info(f"FSM transition: {from_state} -> {to_state}")
        self.state = to_state
```

When debugging a workflow failure, the log shows:
```
FSM transition: SendCFP -> CollectReplies
FSM transition: CollectReplies -> Evaluate
FSM transition: Evaluate -> FAILED (no acceptable offer)
```

This is **trace-level debugging without a debugger**.

## The Fundamental Insight

JADE's behavior model demonstrates: **Complex workflows are best expressed as hierarchies of simple state machines, not as monolithic control flow.**

Each behavior is:
- **Self-contained**: Has clear inputs (DataStore), outputs (DataStore), and termination condition
- **Composable**: Can be nested inside other behaviors
- **Testable**: Can be executed in isolation
- **Observable**: State transitions are explicit

This approach scales to arbitrarily complex workflows because:
- **Local reasoning**: Understand each behavior independently
- **Compositional semantics**: Behavior of composite = semantics of composition operator + semantics of sub-behaviors
- **Graceful failure**: Each behavior can fail independently without crashing the entire workflow

For WinDAGs managing 180+ skills, this means: Don't write a 10,000-line orchestrator function. Compose small, reusable behaviors (InvokeSkill, Retry, Timeout, Fallback) into hierarchies that match your task structure. The resulting system is understandable, maintainable, and extensible.