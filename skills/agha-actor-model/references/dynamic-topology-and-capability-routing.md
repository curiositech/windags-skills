# Dynamic Topology and Capability Routing: Why Agent Systems Must Communicate Addresses

## The Static Topology Problem

A fundamental design decision in any concurrent system is whether the communication graph is *static* (fixed at compile time) or *dynamic* (evolving at runtime). Agha demonstrates through the resource manager example that static topologies are insufficient for modeling real systems.

The resource manager problem (§2.5): A manager coordinates two printing devices. Requirements:
1. Send print requests to the first *available* device
2. Send receipts to users when printing completes
3. Handle a varying number of users over time
4. Gracefully extend to support additional devices without redesign

A static topology — where the communication graph is fixed — cannot satisfy these requirements. A dataflow graph with fixed edges either sends to *both* devices always or neither. It cannot make a choice based on availability. It cannot send receipts to users whose number varies. It cannot incorporate new devices.

"A system that is not only reconfigurable but extensible is powerful enough to handle these problems." (p. 29)

## The Solution: Mail Addresses as First-Class Values

The actor model's solution is that mail addresses — the identifiers of agents — can be *communicated as data*. An agent can send another agent its own address, the address of a third agent, or an address it just learned. This transforms the communication topology from a fixed graph into a dynamically evolving network.

"Reconfigurability in actor systems is obtained using the mail system abstraction. Each actor has a mail address which may be freely communicated to other actors, thus changing the interconnection network of the system of actors as it evolves." (p. 30-31)

This is the actor-theoretic foundation of *capability-based security and routing*: possessing an address is possessing a capability. You can communicate with an agent if and only if you know its address. You gain addresses through:

1. **Acquaintance**: Known before any communication (built into initial configuration)
2. **Communication**: Received as part of an incoming message
3. **Creation**: The address of an actor you just created

"There are three ways in which an actor a, upon accepting a communication k, can know of a target to which it can send a communication: the target was known to the actor a before it accepted the communication k; the target became known when a accepted the communication k because it was contained in the communication k; or the target is the mail address of a new actor created as a result of accepting the communication k." (p. 35)

## Balanced Addition: Dynamic Parallelism Scaling

Agha illustrates the power of dynamic topology with the balanced addition problem (§2.5.2):

Adding n numbers sequentially: `(((a1 + a2) + a3) + a4) + ...` — linear time, error propagation
Adding in pairs: `((a1+a2) + (a3+a4)) + ((a5+a6) + ...)` — log-time parallel, statistically better errors

The pairwise algorithm requires a different graph for each input size. "We cannot define a static network to deal with this problem." (p. 30) But with dynamic actor creation, the computation naturally spawns the right number of actors for whatever input it receives. The agent creating actors doesn't need to know in advance how many it will need.

This is a general principle: **problem-adaptive parallelism requires dynamic agent creation**.

## Open Systems and the Receptionist Pattern

Agha introduces the concept of *receptionists* — the designated agents that interface with the external world:

"The receptionists are the only actors that are free to receive communications from outside the system." (p. 48)

An actor system is *open* if it has receptionists. The set of receptionists changes over time: "Whenever a communication containing a mail address is sent to an actor outside the system, the actor residing at that mail address can receive communications from the outside and therefore become a receptionist." (p. 48)

This is crucial for composition: two independently developed systems are composed by identifying some external actors in one with receptionists in the other, and having them forward mail appropriately:

"Independent systems are connected by sending some external actors in each module a communication to become forwarding actors which simply send their mail to some receptionists in the other module." (p. 154)

The composition is achievable purely through message-passing — no meta-level coordinator needs to "connect" the systems. The systems compose themselves by exchanging addresses.

## The External Actor Pattern for Deferred Composition

When a system needs to communicate with something not yet defined, Agha introduces *external actor declarations*:

"Whenever a given actor system is composed with another in which the external actors are actually specified, the buffered mail can be forwarded to the mail address of the actual actor (which was hitherto unknown)." (p. 49)

The implementation: an external actor buffers all communications it receives until it gets a message telling it what to forward them to. This is a deferred binding pattern — the system can begin computation before all its dependencies are resolved, and those dependencies are injected later.

```
extern with acquaintances buffer
if the communication is become customer
then become customer
    send release request with customer to buffer
else send hold request with customer to buffer
```
(p. 58)

## The Forwarding Equivalence

A forwarding actor — one that sends all communications to another actor — is semantically equivalent to that target actor. This is proven by Agha using arrival order nondeterminism:

"Proposition: If the behavior of an actor x is unserialized, and its behavior is to forward all the communications it accepts to an actor y, then sending a communication to x is equivalent to sending the communication to y." (p. 154)

This enables hot-swapping of agent implementations: replace an actor with a forwarding actor pointing to a new implementation, and all in-flight messages seamlessly redirect. This is the theoretical basis for versioning and live updates in agent systems.

## Application to WinDAGs Routing and Orchestration

### Skills as receptionists

Each WinDAGs skill endpoint is a receptionist. Skills should be designed with this in mind:
- Skills may receive their own address as part of a message, enabling callbacks
- Skills can spawn sub-skills and pass their addresses for direct communication
- Skills can be dynamically routed by sending their address to appropriate orchestrators

### Capability-based routing

The actor model suggests that routing decisions should be based on *who has the address*, not on central routing tables. In WinDAGs:
- An orchestrator that learns of a skill's address during runtime can route to it directly
- Skills can introduce agents to each other by sending addresses
- Access control is implicit: if an agent doesn't know a skill's address, it cannot invoke it

This is more flexible than central routing: new skills can be introduced into a running system without updating a central registry, as long as some agent knows their address and can communicate it to agents that need them.

### The resource manager pattern

The printing resource manager maps directly to WinDAGs skill scheduling:
- The orchestrator is the resource manager
- Skills are the "printing devices"  
- The orchestrator should not statically assign work to specific skill instances
- Instead, it should dynamically discover which skill instance is available and route to it

### Dynamic agent spawning for adaptive parallelism

For tasks of unknown size, WinDAGs should support the balanced addition pattern: spawn agents as needed, scaling parallelism to problem size. This requires:
- Agents that can create other agents
- A tagging scheme that guarantees unique task IDs even for dynamically created tasks
- A DAG structure that grows as computation proceeds

### Open system composition

When WinDAGs integrates with external systems, the external actor pattern applies:
- Define external stubs that buffer communications until the external system is connected
- When integration occurs, send the stub a "become" message with the real address
- Buffered messages then flow to the real system

This enables composition without requiring all systems to be ready simultaneously.

## Boundary Conditions

**When is static topology acceptable?**

- When the communication graph genuinely does not change (batch pipelines with fixed stages)
- When performance analysis requires knowing the graph at compile time
- When the number of agents is fixed and known

**The cost of dynamic topology**

Dynamic topology makes static analysis harder. You cannot statically determine all possible communication paths. This is a real tradeoff: expressiveness vs. analyzability. Agha acknowledges this: "Any system of processes is somewhat easier to analyze if its interconnection topology is static." (p. 26)

For safety-critical subsystems, static topologies with formal verification may be preferred even at the cost of flexibility.