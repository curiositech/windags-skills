# The Actor Model: Core Primitives for Concurrent Intelligent Systems

## What This Document Teaches

This document teaches the foundational computational model underlying all concurrent multi-agent systems, drawn from Gul Agha's 1985 formalization of the Actor paradigm. The core insight: **three primitives are sufficient for all concurrent computation**, and these three primitives map precisely onto what modern AI agent orchestration systems need.

## The Three Primitives of Actor Computation

Agha defines an actor as a computational agent that maps each incoming communication to a **3-tuple**:

1. **A finite set of communications sent to other actors** — the outputs, delegations, and notifications
2. **A new behavior (replacement)** — the updated state that will govern response to the next communication
3. **A finite set of new actors created** — the dynamic spawning of new computational agents

This is written formally as:
> "Actors are computational agents which map each incoming communication to a 3-tuple consisting of: a finite set of communications sent to other actors; a new behavior (which will govern the response to the next communication processed); and, a finite set of new actors created." (p. 12)

Nothing else is needed. No shared variables. No global clock. No central scheduler. No stack. No store.

## Why This Model Strictly Subsumes All Others

Agha demonstrates that actors are **strictly more powerful** than the two competing models of computation available in 1985:

**Sequential Processes** (CSP, Concurrent Pascal): Can be simulated by actors. Sequential processes cannot create other sequential processes during execution — their topology is fixed. Actors can create new actors dynamically, meaning the degree of parallelism can grow unboundedly during computation.

**Value-Transforming Functions** (Dataflow, pure functional): Can be simulated by actors. But functions are **history-insensitive** — given the same inputs, they produce the same outputs. They cannot model objects with changing state. Agha illustrates this with the turnstile problem:
> "Consider the behavior of a turnstile with a counter which records the number of people passing through it. Each time the turnstile is turned, it reports a new number on the counter. Thus its behavior is not simply a function of a 'turn' message but sensitive to the prior history of the computation." (p. 11)

Actors handle this trivially: the replacement behavior carries the updated count forward.

**The key asymmetry**: Actors can represent arbitrary sequential processes and arbitrary functional programs, but neither of those models can represent an arbitrary actor system. This is because:
> "actors may create other actors; value-transforming functions, such as the ones used in dataflow, cannot create other functions and sequential processes, as in Communicating Sequential Processes, do not create other sequential processes." (p. 14)

## The Task: The Atom of Work

A **task** is a 3-tuple:
1. A **tag** — a unique identifier that distinguishes this task from all others
2. A **target** — the mail address to which the communication will be delivered
3. A **communication** — the content delivered to the target actor upon processing

The tag system is crucial and non-obvious: tags are structured strings (e.g., `w.n`) such that new tasks created from processing task `w` receive tags of the form `w.n`. This ensures global uniqueness without a global counter — each actor generates unique tags locally from the tag of the task it's currently processing. This is **distributed unique ID generation** as a first principle.

## The Configuration: The State of a System

At any moment, an actor system is completely described by its **configuration**: a 2-tuple of:
- A **local states function** mapping mail addresses to behaviors
- A **finite set of unprocessed tasks** (the "work queue" for the system)

This is the complete world-state. There is no hidden global state. The system evolves by processing one task at a time (from any observer's viewpoint), each transition consuming one task and potentially producing new tasks and new actors.

## Mail Addresses: Identity Without Shared State

Actors interact exclusively through mail addresses. An actor can send a message to another actor only if it **knows that actor's mail address**. There are exactly three ways an actor can acquire a mail address:
1. It was known before the current communication arrived (an "acquaintance")
2. It arrived in the current communication
3. It is the address of an actor the current actor just created

This is a **capability model**: you cannot communicate with an actor you have no reference to. Information hiding is structural, not enforced by access control mechanisms.

## The Replacement Behavior: State Without Assignment

The most important primitive is the `become` command — specifying the replacement behavior. This is how actors represent changing state without assignment to a shared store:
> "Replacements may exist concurrently. This kind of pipelining can be a powerful tool in the exploitation of parallel processors." (p. 173)

The semantics of replacement is fundamentally different from assignment. When an actor specifies its replacement, the old machine and the new machine **can exist concurrently** — the old machine finishes producing its effects (messages, new actors) even as the replacement begins accepting the next communication. This is not mutation; it is succession.

## Application to WinDAGs Agent Systems

**For skill routing**: Each skill invocation is a task. The skill is an actor. The routing system creates a task with the skill's address as target and the request as communication. The skill's response (which may include creating sub-tasks) maps directly onto the 3-tuple primitive.

**For state management**: Agent state should be carried in the replacement behavior, not in shared variables. An agent processing a multi-step task creates a new behavior at each step that carries forward only the state needed for continuation.

**For dynamic scaling**: When a problem requires more parallelism than anticipated, actors can create new actors. A skill can dynamically spawn sub-agents to handle sub-problems without the orchestrator needing to pre-allocate them.

**For unique task identification**: The tag system provides a model for how WinDAGs should generate globally unique task IDs without a central ID server: prefix-based hierarchical IDs derived from the initiating task's ID.

## What This Model Does NOT Cover

- **Performance guarantees**: The model abstracts away all implementation details, including timing, memory limits, and communication latency. A real system must re-introduce these constraints.
- **Typed communications**: SAL and Act have minimal type systems. Real agent systems need richer contracts between agents.
- **Security**: Knowing a mail address grants full communication rights. Real systems may need finer-grained access control.
- **Prioritization**: The basic model treats all pending tasks as equally schedulable. Priority queues require explicit encoding.