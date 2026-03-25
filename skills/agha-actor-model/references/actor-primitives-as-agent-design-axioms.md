# Actor Primitives as Agent Design Axioms: Why the Three-Part Response Is Irreducibly Minimal

## The Core Claim

Agha's 1985 thesis establishes that any computational agent operating in a concurrent distributed system must, at minimum, do three things when it processes a message:

1. **Send a finite set of messages** to other agents (by mail address)
2. **Create a finite set of new agents** (with specified behaviors)
3. **Specify a replacement behavior** (its own next state)

This is not a design choice among many. Agha demonstrates that this 3-tuple is the *minimal complete specification* for a concurrent computational element. Remove any component and the resulting system loses expressiveness — it can no longer model important classes of real computation.

The formal definition: "Actors are computational agents which map each incoming communication to a 3-tuple consisting of: 1. a finite set of communications sent to other actors; 2. a new behavior (which will govern the response to the next communication processed); and, 3. a finite set of new actors created." (Chapter 2, p. 12)

## Why Each Component Is Necessary

### Component 1: Sending Messages

Without the ability to send messages, an agent is isolated — it can compute internally but cannot influence the rest of the system. This is trivially insufficient. But the critical insight is that messages must be sent *to specified targets by mail address*, not broadcast, not through shared variables. Mail addresses provide:

- **Encapsulation**: Only actors that know an address can communicate with it
- **Dynamic topology**: Addresses can be communicated as data, allowing the communication graph to evolve
- **No action at a distance**: An agent cannot affect another without explicit communication

### Component 2: Creating New Agents

This is the component that distinguishes actors from both sequential processes and pure functional systems. Agha writes: "Actors may create other actors; value-transforming functions, such as the ones used in dataflow, cannot create other functions and sequential processes, as in Communicating Sequential Processes, do not create other sequential processes." (p. 14)

The significance: "In the context of parallel systems, the degree to which a computation can be distributed over its lifetime is an important consideration. Creation of new actors guarantees the ability to abstractly increase the distributivity of the computation as it evolves." (p. 14)

In agent system terms: a system that cannot spawn new agents cannot adapt its own parallelism to the demands of the computation. The number of workers cannot grow with the work.

### Component 3: Replacement Behavior (Local State Evolution)

Without replacement behavior, actors are *history-insensitive* — they respond identically to every message regardless of what they've processed before. Agha demonstrates this is insufficient using the turnstile example: a counter that reports how many people have passed through cannot be modeled by a pure function, because its output depends on prior history.

"The behavior of an actor can be history sensitive." (p. 13)

The replacement behavior is the mechanism by which actors model *objects with changing local state* — bank accounts, resource managers, configuration registries, anything that must remember what has happened to it.

Crucially, the replacement behavior is not the same as mutation of a shared store. The replacement executes *concurrently* with any already-created tasks. This enables pipelining: "if there are sufficient resources available, computation in an actor system can be speeded up by an order of magnitude, by simply proceeding with the next communication as soon as the ontological necessity of determining the replacement behavior has been satisfied." (p. 41)

## The Hierarchy of Expressiveness

Agha establishes a strict expressiveness hierarchy:

```
Pure Functions ⊂ Sequential Processes ⊂ Actors
```

Pure functions are history-insensitive; they cannot model shared state.
Sequential processes lack dynamic creation; they cannot adaptively distribute computation.
Actors subsume both. Any functional program or sequential process can be expressed as an actor system, but the converse does not hold.

This is a *mathematical result*, not an opinion. It has direct consequences for agent system design.

## Application to WinDAGs Agent System Design

### Every WinDAGs skill invocation is an actor step

When an agent invokes a skill, it is executing the actor pattern:
- **Messages sent**: Requests to other agents/skills, sub-task delegations
- **New agents created**: Spawned sub-agents for parallel subtasks
- **Replacement behavior**: The agent's updated context/state after skill completion

The 3-tuple structure should be explicit in skill design. A skill that does not specify what state changes result from its execution (replacement behavior) leaves the orchestrator without information needed to route subsequent work.

### The "customer" pattern for continuation

Agha introduces the *customer* pattern — creating a new agent whose sole purpose is to receive and continue processing a computation result:

"The factorial actor relies on creating a customer which waits for the appropriate reply, in this case from the factorial itself, so that the factorial is concurrently free to process the next communication." (p. 53)

This pattern is directly applicable to WinDAGs: when an agent delegates a subtask and needs to continue processing after the result arrives, it should create a continuation agent (customer) rather than blocking. This enables the delegating agent to immediately accept new work.

### Dynamic agent creation scales concurrency to problem size

A critical advantage of the actor model: "Extensibility allows a system to dynamically allocate resources to a problem by generating computational agents in response to the magnitude of a computation required to solve a problem. The precise magnitude of the problem need not be known in advance: more agents can be created as the computation proceeds and the maximal amount of concurrency can be exploited." (p. 29)

In WinDAGs, this means orchestration strategies should not pre-determine the number of parallel agents. The computation itself should drive spawning decisions.

## What This Teaches About Skill Design

A well-designed skill in an agent system should have explicit:

1. **Output targets**: What agents/systems receive the skill's results? (message recipients)
2. **Spawn decisions**: Does this skill create sub-tasks that require new agent instances? (actor creation)
3. **State transition**: How does the invoking agent's context change after this skill runs? (replacement behavior)

Skills that blur these three components create systems that are difficult to reason about, difficult to pipeline, and prone to the failure modes (deadlock, starvation) that the actor model was designed to prevent.

## Boundary Conditions

**When does this NOT apply?**

- For purely stateless, one-shot transformations (e.g., a pure text formatter), the full actor machinery is unnecessary overhead. These are pure functions and should be designed as such.
- When the computation graph is known at compile time and never changes, simpler dataflow models may be more efficient.
- The actor model assumes *reliable* message delivery (guaranteed delivery). In systems with message loss, additional protocols must be layered on top.

The actor model is most powerful when:
- Computation structure is not known in advance
- Agents need to maintain and update local state
- The system must remain responsive even while some agents are in long-running computations
- Compositionality (building systems from independently verified subsystems) is required