# Replacing Shared State with Encapsulated Behavior: The Actor Alternative to Global Variables

## The Problem with Shared Variables

Agha opens Chapter 2 with a crisp diagnosis of what is wrong with the shared variables approach to concurrent coordination:

"The shared variables approach does not provide any mechanism for abstraction and information hiding. For instance, there must be pre-determined protocols so that one process can determine if another has written the results it needs into the relevant variables. Perhaps, even more critical is the fact that this approach does not provide any mechanism for protecting data against arbitrary and improper operations." (p. 18)

The three failure modes of shared variables in concurrent systems:

1. **No encapsulation**: Any process can read or write any variable. There is no way to ensure that access follows the required protocol.

2. **No protection**: The data cannot protect itself against improper operations. A process that reads before the data is ready, or writes the wrong type of value, corrupts system state without the data structure having any recourse.

3. **Protocol burden on users**: "In a shared variables model, the programmer has the burden of specifying the relevant details to achieve meaningful interaction." (p. 18) The coordination protocol must be implemented by every user of the shared resource, not by the resource itself.

## The Actor Alternative: Total Containment

Actors implement what Agha calls *total containment*:

"An actor represents total containment, and can be 'accessed' only by sending it a communication." (p. 137)

Total containment means:
- The actor's state is accessible only through its defined message interface
- The actor processes one message at a time (mutual exclusion by default)
- The actor decides how to respond to each message (protocol enforcement by the actor, not by users)
- No external agent can read or write the actor's state directly

This is not object-oriented programming in the traditional sense — it is stronger. In OOP, objects can share references to their internal state. In actors, the only shared thing is the mail address. The state itself is always private.

## The Stack Example: Data Structure as Actor System

Agha demonstrates total containment through a stack implementation (§3.2.2):

"These actors will represent total containment of data as well as the operations valid on such data." (p. 52)

The stack is implemented as a chain of actor nodes, each holding one value and knowing the address of the next node. The top-of-stack actor is the only receptionist:

```
stack-node(content, link)
[case operation of
  pop: (customer)
  push: (new-content)
  end case]
if operation = pop AND content ≠ NIL then
    become link
    send content to customer
if operation = push then
    let P = new stack-node(content, link)
    {become new stack-node(new-content, P)}
```

Key observations:

1. **No pointer types**: "This simple example also illustrates how the acquaintance structure makes the need for pointer types superfluous in an actor language." (p. 51) Mail addresses serve as capability-safe references. You can only follow a reference if you have the address.

2. **Operations are encapsulated with data**: Push and pop are not separate procedures — they are behaviors of the stack-node actor. You cannot push or pop without going through the actor's interface.

3. **Automatic mutual exclusion**: The stack naturally handles concurrent push and pop requests correctly because each node processes one message at a time. There is no mutex to manage.

4. **Automatic memory management**: "The underlying architecture can splice through any chain of forwarding actors since their mail address would no longer be known to any actor, and in due course, will not be the target of any tasks." (p. 53) Garbage collection is natural — actors with no outstanding addresses are unreachable.

## History Sensitivity Without Side Effects

One of Agha's most important theoretical contributions is showing that history-sensitive computation (computation that depends on what has happened before) and side-effect-free computation are not opposites.

In functional programming, "history-sensitive" computation is achieved through feedback loops — feeding the output of a function back as input. But this requires a static topology and cannot handle dynamic reconfiguration.

In actor systems, history sensitivity is achieved through *replacement behavior*: each time an actor processes a message, it replaces itself with an actor whose behavior encodes the updated state.

The turnstile example: a counter that reports the number of people who have passed through cannot be modeled as a pure function — its output depends on its history. But as an actor:
- Actor state: `count = n`
- Receives "turn" message
- Replacement behavior: `count = n+1`
- Sends reply: `n+1`

This is history-sensitive but has no "side effects" in the traditional sense — the old actor is gone, the new actor is created fresh with updated state. The replacement is concurrent with any other computations.

"The concept of replacement provides us with the ability to define lazy evaluation so that the same expression would not be evaluated twice if it was passed (communicated) unevaluated." (p. 95)

## Streams and Functionality: The Side-Effect-Free Claim

Agha shows in §6.2.1 that actors can be understood as generalizations of dataflow streams — and therefore share the "side-effect-free" property of functional programming, in a meaningful sense.

The become command is analogous to a feedback loop in a dataflow graph:

"The become command in the program is equivalent to sending oneself a communication with the values of acquaintances including the identifier corresponding to the definition to be used in order to determine the replacement behavior." (p. 139)

The replacement actor doesn't "mutate" the original actor — it is a new actor, created fresh, that happens to have the same mail address. This is a crucial distinction: there is no shared mutable memory. The "state" of an actor is encoded in the behavior of its replacement, not in a memory location that multiple actors could access.

## Primitive Actors: The Bottom of the Stack

For the actor model to be complete, computation must bottom out somewhere. Agha introduces *primitive actors* — actors with pre-defined, unserialized behaviors that represent base data types:

"Each integer, n, may be sent a request to add itself an arbitrary integer expression, e. The integer would then reply with the sum of the two integers." (p. 85)

Integers, booleans, strings — these are actors, not data. Operations on them are message-passing, not function calls. This uniformity means that there is no "outside the actor model" — even primitive operations follow the same protocol.

The `unserialized` property of primitive actors means their behavior never changes: "The unserialized nature of primitive actors implies that there is no theoretical reason to differentiate between the expression `new 3` and simply `3`." (p. 87) You can create as many copies of the actor `3` as you want; they all behave identically.

## Application to WinDAGs Skill and State Design

### Every shared resource should be an actor

Any resource in WinDAGs that is accessed by multiple agents — a knowledge base, a configuration store, a result cache, a rate limiter — should be implemented as an actor with a message interface. Do not use shared memory, shared databases with optimistic locking, or any other shared-variable pattern.

The actor encapsulates:
- The resource state
- The valid operations on the state
- The mutual exclusion protocol (automatic through the message queue)
- The error handling (invalid operations produce error responses, not crashes)

### Agent state should be encoded in behavior, not in variables

When a WinDAGs agent needs to track history (how many tasks it has processed, what the last result was, whether it is in an error state), this state should be encoded in the agent's replacement behavior, not in shared variables:

```
# Agent encoding state in replacement:
def handle_task(task, history):
    result = process(task)
    new_history = history + [result]
    become new_behavior(new_history)  # State is in the new behavior
    send(result, task.customer)
```

This makes state transitions explicit and auditable. Every state change is a "become" — you can trace the agent's history by following the chain of replacement behaviors.

### Use message-passing for coordination, not shared state

When two WinDAGs agents need to coordinate — one waits for the other's result — the coordination should be through message-passing (customer pattern), not through a shared status variable that one polls.

Instead of:
```
# BAD: Shared variable coordination
agent_A.set_status("processing")
while agent_B.get_status("agent_A") != "done":
    sleep(100ms)
```

Use:
```
# GOOD: Message-passing coordination
customer = create_agent(lambda result: continue_computation(result))
send(task, agent_A, reply_to=customer)
# Agent B continues with other work; customer handles the result
```

### Capability-based access control

In WinDAGs, access to resources should be controlled by mail address knowledge, not by access control lists or central authority. If an agent knows a skill's address, it can invoke the skill. If it doesn't know the address, it cannot.

This means:
- Sensitive skills should have their addresses distributed only to authorized agents
- Skills can control their own accessibility by choosing whether to share their addresses
- No central access control system is needed — access control is distributed and enforced by the mail address system itself

### The acquaintance structure as capability transfer

When a WinDAGs agent creates a sub-agent, it should carefully consider which addresses (capabilities) to give the sub-agent. The sub-agent can only interact with the agents whose addresses it knows.

This provides a natural security boundary: a sub-agent given only the address of a specific data store can only access that store, not the broader system. Capabilities are *minimal by default* and must be explicitly granted.

## Boundary Conditions

**When is shared state acceptable?**

- For read-only data that never changes (immutable configuration, constants): sharing a reference is fine because there is no mutation race
- For performance-critical paths where actor message overhead is prohibitive: shared memory with explicit synchronization may be necessary, at the cost of the bugs it introduces
- For hardware-level data that is genuinely shared (sensor readings, hardware registers): the sharing is physical and must be modeled explicitly

**The cost of total containment**

Total containment through message-passing has overhead. Sending a message, queuing it, and processing it is slower than reading a shared memory location. For computations where the granularity of individual operations is very fine (matrix multiplication, sorting networks), actor-level encapsulation may be too coarse. At these scales, SIMD/vectorized computation within a single actor may be more appropriate than decomposing every operation into actor messages.

The actor model is not suited for *fine-grained parallel computation within a single data structure*. It is suited for *coarse-grained coordination between autonomous computational entities*.