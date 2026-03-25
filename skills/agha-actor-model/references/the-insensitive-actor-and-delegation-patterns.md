# The Insensitive Actor and Delegation Patterns: Managing State During Long Computations

## The Core Problem

When an agent begins a computation that requires external input to complete — a result from another agent, a user response, a database query — it faces a fundamental question: what should it do while waiting?

In sequential programming, the answer is "wait." The computation blocks. Other work must wait too.

In the actor model, "waiting" is itself a design decision, and the insensitive actor pattern is the principled solution to this design problem.

## The Checking Account with Overdraft Protection

Agha motivates the insensitive actor through a bank account example (§4.2). A checking account has overdraft protection linked to a savings account. When a withdrawal would overdraw the checking account:

1. The checking account must query the savings account for a transfer
2. The savings account must process the request and reply
3. The checking account must receive the reply before it can determine its new balance
4. **During this period, new requests to the checking account may arrive**

The question: what should the checking account do with new requests while it's waiting for the overdraft response?

Options:
- **Block completely**: The checking account is unavailable until the overdraft resolves. This could be a significant delay. Any other user trying to check their balance is blocked.
- **Queue without processing**: The checking account accepts new requests into its queue but doesn't process them.
- **Process normally**: The checking account tries to process new requests, but it doesn't know its current balance yet, leading to inconsistencies.

The correct answer is: **become insensitive while the replacement behavior is being determined**.

## The Insensitive Actor Pattern

An insensitive actor is one that buffers all incoming communications until it receives a "become" message telling it what to do next:

```
insens-acc (buffer, proxy) [request, sender]
if request = become and sender = proxy
then become (replacement specified)
else send (communication) to buffer
```
(p. 80)

The pattern involves four actors:
1. **The checking account**: Detects the overdraft, creates buffer and proxy, becomes insensitive
2. **The buffer**: Accumulates messages received while the account is insensitive
3. **The overdraft proxy**: Sends the query to savings, waits for response, determines new balance, sends "become" to the insensitive account
4. **The savings account**: Processes the withdrawal request independently

The proxy is authenticated: only the proxy (whose address the insensitive actor knows) can send the "become" message. This prevents unauthorized state changes.

When the overdraft is resolved:
1. The proxy computes the new balance
2. The proxy sends "become new checking-acc(new-balance, my-savings)" to the insensitive account
3. The insensitive account resumes normal operation
4. The buffer drains, sending accumulated messages to the now-normal account

## Why This Pattern Matters

### It maintains responsiveness without sacrificing consistency

The checking account remains in a defined, valid state throughout the overdraft resolution:
- It accepts messages (it doesn't drop them)
- It doesn't process them incorrectly (it buffers, not processes)
- When resolution completes, it processes them in order

This is the correct behavior for any shared stateful resource that occasionally needs to perform a long-running external consultation before it can determine its next state.

### It makes "waiting" explicit and auditable

The insensitive actor pattern makes the "waiting for input" state *observable*: you can query the insensitive actor and learn that it is waiting for a specific proxy's message. This enables:
- Deadlock detection: if the proxy is also stuck, the cycle is visible
- Timeout handling: if the proxy takes too long, the orchestrator can intervene
- Status reporting: external observers can see that the account is "in overdraft resolution"

### The buffer is a protocol decision

Agha notes that the buffer can be implemented as a queue (FIFO) or a stack (LIFO): "One could also be a bit perverse and specify the buffer as a stack without changing the correctness of its behavior (recall the arrival order nondeterminism of the communications)." (p. 57)

The choice of buffering discipline (queue vs. stack vs. priority) is a design decision that affects performance but not correctness. This separation of concerns — correctness from performance — is characteristic of the actor model.

## The Customer Pattern: Continuations as Actors

The insensitive actor pattern generalizes into the *customer* pattern, which is Agha's solution to continuation-passing in concurrent systems.

When an actor needs a result from another actor before it can proceed, instead of blocking:
1. It creates a *customer* actor whose sole behavior is to receive the result and continue the computation
2. It sends the query to the target, specifying the customer as the reply address
3. It immediately computes its replacement behavior (possibly another insensitive actor)
4. The customer waits independently, not blocking anything else

The recursive factorial demonstrates this:

"The factorial actor relies on creating a customer which waits for the appropriate reply, in this case from the factorial itself, so that the factorial is concurrently free to process the next communication." (p. 53)

Each recursive call creates a chain of customers, each waiting for its predecessor's result. The factorial actor itself is never blocked — it immediately processes the next incoming message after delegating the recursive computation.

### Customer chains as parallel computation trees

A chain of customers is a *computation continuation* — it represents the work that remains to be done after each result arrives. Multiple such chains can exist simultaneously, executing in parallel:

"Given a network of processors, an actor-based language could process a large number of requests much faster by simply distributing the actors it creates among these processors. The factorial actor itself would not be the bottleneck for such computations." (p. 55-56)

This is the theoretical basis for *continuation-passing style* in concurrent systems, implemented through actor creation rather than function calls.

## The Call Expression: Blocking as a Special Case

For cases where true sequential dependency is required — computation B cannot start until computation A completes — Agha defines the *call expression*:

```
let x = (call g[k]) {S}
```

This creates a customer that waits for g's reply and then executes S with x bound to the reply. Critically:

"The actions implied by S' and S" can be executed concurrently with the request to g. Moreover, we do not force the actor f to wait until the reply from the actor g is received. The actor f would be free to accept the next communication on its mail queue, provided it can compute its replacement." (p. 72)

Even when sequential dependency is needed (S must wait for g's reply), other aspects of the computation proceed concurrently. The sequentiality is *local* to a particular computation thread, not global to the system.

### Sequential composition as emergent, not primitive

One of Agha's most important theoretical results: "Concurrent composition is intrinsic in a fundamental and elemental fashion to actor systems. Any sequentiality is built out of the underlying concurrency and is an emergent property of the causal dependencies of events in the course of the evolution of an actor system." (p. 83)

Sequential composition, in actor systems, is not a primitive — it is pattern of causally ordered message-passing. This means that any time you write sequential code in an agent system, you are implicitly creating a causal chain that could be parallelized if the dependencies were not actually necessary.

## Application to WinDAGs Agent Design

### The insensitive agent pattern for skill invocations

When a WinDAGs agent invokes a skill that requires an external result before its next state can be determined:

1. Create a buffer agent to hold incoming task requests
2. Create a continuation agent (customer) to handle the skill result
3. The main agent becomes insensitive, forwarding all new tasks to the buffer
4. The continuation agent receives the skill result, computes the new state, and sends "become" to the insensitive agent
5. The insensitive agent resumes, draining the buffer

This prevents the orchestrating agent from being unavailable during skill invocations.

### Customer chains for parallel sub-plans

When a WinDAGs plan requires multiple sequential steps, implement each step as a customer agent:

- Step N creates customer N+1 and sends work to step N's executor
- Step N's executor sends the result to customer N+1
- Customer N+1 creates customer N+2 and sends the next task

Each customer is a small, focused agent whose only job is to receive one result and dispatch the next task. This makes the computation:
- Parallel (multiple chains can execute simultaneously)
- Auditable (each customer is observable)
- Resilient (failed customers can be retried without restarting the entire plan)

### Making "waiting" explicit

WinDAGs orchestration should distinguish between:
- **Active agents**: Currently executing their primary behavior
- **Insensitive agents**: Waiting for a specific result before they can proceed
- **Customer agents**: Waiting for a result to continue a computation chain

Making these states observable enables:
- Better monitoring and debugging
- Deadlock detection (insensitive agents waiting for stuck proxies)
- Timeout policies (how long should an insensitive agent wait before aborting?)

### The continuation/callback pattern

Rather than polling for results, WinDAGs should adopt the customer model throughout:

```
# Instead of:
result = await skill.invoke(task)  # blocks
next_task = compute_next(result)

# Use:
customer = create_agent(behavior=lambda result: dispatch(compute_next(result)))
skill.invoke(task, reply_to=customer)
# Agent is immediately free for other work
```

## Boundary Conditions

**When is blocking acceptable?**

- When no other work is available anyway (the agent has nothing else to do while waiting)
- When the waiting time is guaranteed to be short (sub-millisecond)
- When the sequential dependency is so tight that creating a customer agent adds more overhead than the parallelism saves

**The proxy authentication requirement**

The insensitive actor pattern requires that only the correct proxy can send the "become" message. Without this, any actor could maliciously or erroneously change the insensitive actor's state. In WinDAGs, continuation agents should have authenticated channels back to the agents they serve.

**Buffer overflow**

The buffer agent is assumed to be unbounded in the formal model. In practice, buffers fill. A realistic implementation must decide what to do when the buffer reaches capacity: reject new messages (with error response), expand the buffer, or apply backpressure upstream.