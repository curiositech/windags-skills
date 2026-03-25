# Open Systems and the Impossibility of Closed-World Assumptions in Agent Orchestration

## The Closed-World Failure

A closed-world assumption is the belief that a system's behavior can be fully characterized by specifying what is *known* at design time. In sequential programming, this works: you specify all inputs, all states, all outputs. The system is closed.

Agha's entire framework is built around the rejection of this assumption for concurrent distributed systems. His actor model is explicitly a model of *open systems* — systems that can receive communications from the external world at any point in their operation, whose population of agents changes dynamically, and whose interface with the outside world evolves as computation proceeds.

"Our model makes no closed-world assumption since communications may be received from the outside at any point in time." (Abstract, p. 2)

This is not a limitation of the model — it is a *feature* that makes the model realistic.

## What Makes a System "Open"

An open system has three properties that distinguish it from a closed system:

1. **Dynamic receptionist set**: The set of agents that can receive external communications changes over time. Any time a mail address is communicated to an external actor, a new receptionist is created. You cannot enumerate the receptionists statically.

2. **Dynamic external actor set**: The set of external systems the agent network communicates with changes over time. Communications received from the outside may contain mail addresses of external actors previously unknown.

3. **No global quiescence**: The system does not have a well-defined "done" state. It is always potentially accepting more input. Termination is a local concept (a particular computation completes) not a global one.

"It is useless to have an actor system which has no receptionists and no external actors because such an autistic system will never affect the outside world!" (p. 49)

## Extensibility vs. Reconfigurability

Agha distinguishes two related properties:

**Reconfigurability**: The ability to change *which* agents communicate with *which* other agents, while all agents already exist.

**Extensibility**: The ability to *add new agents* to a running system, with the new agents interoperating with existing ones.

"Reconfigurability is the logical prerequisite of extensibility in a system because the ability to gracefully extend a system is dependent on the ability to relate the extension to the elements of the system that are already in existence." (p. 29)

The key scenario: "If we wanted to add a third printing device, we should not necessarily have to program another resource-manager, but rather should be able to define a resource-manager which can incorporate the presence of a new printing device when sent an appropriate message to that effect." (p. 29)

This is the theoretical foundation for *live system extension*: adding new capabilities to a running agent system without restarting it.

## The Receptionist as Interface Contract

The receptionist abstraction is Agha's mechanism for defining a stable interface in an evolving system:

"The receptionists are the only actors that are free to receive communications from outside the system." (p. 48)

Since the receptionist is the only externally visible interface, two important properties follow:

1. **Implementation hiding**: Changes to internal agents do not affect external behavior, as long as the receptionist's behavior is unchanged.

2. **Controlled growth**: New receptionists are added only when the system *chooses* to expose them (by communicating their addresses externally). The system controls its own interface surface.

However, the receptionist set is not static: "Since actor systems are dynamically evolving and open in nature, the set of receptionists may also be constantly changing. Whenever a communication containing a mail address is sent to an actor outside the system, the actor residing at that mail address can receive communications from the outside and therefore become a receptionist." (p. 48)

This means *any internal agent becomes a receptionist the moment its address is communicated externally*. There is no firewall except address knowledge.

## External Actor Declarations and Deferred Binding

For systems that must interact with components not yet implemented or not yet connected, Agha introduces *external actor declarations*:

"We allow the ability to declare a sequence of identifiers as external. The compiler associates these identifiers with actors whose behavior is to buffer the communications they accept. Whenever a given actor system is composed with another in which the external actors are actually specified, the buffered mail can be forwarded to the mail address of the actual actor." (p. 48-49)

This is deferred binding: the system begins operating before all its dependencies are resolved. Requests that would go to unconnected components are buffered. When the component becomes available, it is connected and the buffer drains.

This is not a workaround — it is a principled design pattern for open systems where components come and go dynamically.

## The Evolving Community Model

Agha explicitly adopts a *community* metaphor for actor systems:

"A system of actors is best thought of as a community... Message-passing viewed in this manner provides a foundation for reasoning in open, evolving systems." (p. 136)

In a community:
- Members have persistent identities (mail addresses)
- Members communicate through messages, not through direct manipulation
- The community grows and shrinks as members are created and become inactive
- No member needs to know the internal structure of others
- Coordination emerges from message-passing protocols, not central authority

"Another consequence of 'reasoning' actors is that systems can be easily programmed to learn: A philosopher may become one that has learned to query some particular philosopher who is a frequent user of the chopstick it needs instead of first querying the chopstick. Or the actor may become one which avoids eating at certain times by first querying a clock." (p. 137)

This paragraph, almost an aside in a technical paper, is actually a profound observation: agents that can reason about the behavior of other agents can *adapt their strategies* based on experience. The actor model naturally enables learning behaviors.

## No Central Coordinator

The community model implies the impossibility of a central coordinator that fully understands the system state. No single actor can have complete knowledge of all other actors' states because:

1. States change continuously
2. Getting current state requires sending messages (which takes non-zero time)
3. By the time a state report arrives, the state may have changed

"Each computational agent has a local time which linearly orders the events as they occur at that agent." (p. 15)

The only consistent global ordering of events is a *partial order* — the causal order defined by which messages triggered which other messages. Imposing a total order requires imposing a global coordinator, which creates a bottleneck.

"The important point to be made is that any such global synchronization creates a bottleneck which can be extremely inefficient in the context of a distributed environment." (p. 17)

## Application to WinDAGs Open System Design

### WinDAGs is an open system by nature

WinDAGs operates in a world where:
- New tasks arrive from external sources at any time
- New skills are added to the system as needed
- User requirements change during execution
- External services the system depends on come and go

The closed-world assumption fails immediately. WinDAGs design must embrace openness.

### Design for dynamic skill registration

Skills should be registrable at runtime without system restart. The receptionist pattern applies: a skill registry is a receptionist that accepts "register skill" messages and makes new skills available without any downtime.

When a new skill registers:
1. The registry creates an entry for it
2. The registry communicates the skill's address to agents that need to know about it
3. Those agents can now route to the new skill

No central reconfiguration step is needed. The system extends itself through message-passing.

### Design for graceful degradation

When a skill becomes unavailable:
1. The skill's address should resolve to a buffer actor (the external actor pattern)
2. Requests that would go to the skill queue in the buffer
3. When the skill returns or a replacement is registered, the buffer drains

The system continues operating with reduced capability rather than failing.

### Avoid assuming knowledge of system state

Orchestration algorithms in WinDAGs should not assume they know the current state of other agents. When an orchestrator needs to know if a skill is available, it should *ask* (send a status query) rather than assuming based on stale information.

The actor model guarantees this query will eventually be answered. If the skill is busy, the response will say so. If the skill is down, the buffer will eventually drain or timeout.

### The learning community pattern

Agha's philosopher-that-learns suggests a design pattern for adaptive orchestration: agents should track which routing decisions worked well and update their routing strategies accordingly.

An orchestrating agent that remembers "skill X was faster than skill Y for tasks of type T" and routes accordingly is implementing exactly the community-learning behavior Agha describes. This is emergent learning without a central machine learning system — just agents updating their local state (replacement behavior) based on accumulated experience.

### Multi-level interface surfaces

WinDAGs should define explicit interface surfaces at multiple levels:
- **Task interface**: What tasks the system accepts from external clients
- **Skill interface**: What the orchestrator exposes to skills
- **Monitoring interface**: What the monitoring system can observe

Each interface level is a set of receptionists. Internal changes (how orchestration happens, which skills are used) should not affect external interfaces. The receptionist boundary enforces this separation.

## Boundary Conditions

**When does the open system model create problems?**

- Security: if any agent can become a receptionist by having its address communicated externally, there are no hard boundaries. Access control must be implemented as part of agent behavior, not assumed from the infrastructure.
- Consistency: open systems with evolving populations make global consistency guarantees impossible. Systems that require strong consistency (e.g., database transactions) must implement consistency protocols within the actor framework, not assume it.
- Debugging: open systems are harder to debug because the system state at any moment depends on what external messages have arrived. Deterministic testing requires controlling external message injection.

**When is a closed-world assumption acceptable?**

- For bounded computations with known inputs and known termination (e.g., batch processing a fixed dataset)
- For safety-critical subsystems where the cost of unexpected inputs is too high
- During testing, when you want to control all inputs precisely