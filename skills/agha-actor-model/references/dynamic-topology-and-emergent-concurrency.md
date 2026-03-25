# Dynamic Topology and Emergent Concurrency: How Actor Systems Scale

## The Problem with Static Topologies

Most early models of concurrent computation assumed a **static topology**: the set of agents and the communication links between them are fixed at the start of computation. Agha shows this is a fundamental limitation:

> "A static topology, however, has severe limitations in representing the behavior of real systems." (p. 26)

The resource manager example illustrates the problem precisely. A resource manager for two printers must:
1. Send print requests to the **first available** printing device
2. Send receipts back to the **user who requested** printing

Neither requirement can be met by a static graph. The manager cannot know in advance which device will be free. The number of users varies over time. The system might later need a third printer. A static topology would require either knowing all this in advance or rewriting the entire system for each configuration.

## The Dynamic Allocation Principle

Agha's solution: **actors can freely communicate their mail addresses**. This single capability transforms static topology into dynamic topology:

> "Reconfigurability in actor systems is obtained using the mail system abstraction. Each actor has a mail address which may be freely communicated to other actors, thus changing the interconnection network of the system of actors as it evolves." (p. 30-31)

This means:
- An agent can introduce two previously unconnected agents by sending one agent the address of the other
- New agents can be created on demand and integrated into existing communication networks
- The communication graph is not fixed but grows and changes with the computation

## Actor Creation as Computational Scaling

The most powerful consequence of dynamic topology is **computational scaling through creation**:

> "Extensibility has other important consequences. It allows a system to dynamically allocate resources to a problem by generating computational agents in response to the magnitude of a computation required to solve a problem. The precise magnitude of the problem need not be known in advance: more agents can be created as the computation proceeds and the maximal amount of concurrency can be exploited." (p. 29)

The balanced addition example makes this concrete. Sequential addition of `n` numbers requires `O(n)` time and suffers from floating-point error propagation. Parallel pairwise addition requires `O(log n)` time and statistically reduces errors. But to implement pairwise addition, you need a number of agents proportional to `n`. If you don't know `n` in advance, you need to create agents dynamically.

This is the general pattern: **the shape of the computation determines the resources needed, and that shape may not be known until the computation begins**.

## Customers: The Mechanism for Distributed Continuations

The "customer" pattern is Agha's most elegant contribution to practical concurrent programming. Rather than blocking to wait for a result, an agent creates a **customer** — a new actor that captures the continuation of the computation — and passes that customer's address to the sub-computation:

> "The actor originally receiving the request delegates most of the processing required by the request to a large number of actors, each of whom is dynamically created. Furthermore, the number of such actors created is in direct proportion to the magnitude of the computation required." (p. 55)

The factorial example demonstrates this: