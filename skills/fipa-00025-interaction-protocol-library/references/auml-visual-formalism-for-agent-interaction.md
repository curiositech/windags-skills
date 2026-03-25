# AUML: The Visual Formalism for Agent Interaction and Its Lessons for System Design

## Why Multi-Agent Systems Need Their Own Modeling Language

When the architects of FIPA sat down to specify interaction protocols, they faced a fundamental problem: the dominant software modeling language of the era — UML — was designed for objects, not agents. Objects are passive: they execute methods when called from outside. Agents are active: they act based on their own goals, beliefs, and internal states. Objects don't negotiate. Agents do.

The specification states this limitation directly:

> "For modelling agents and agent-based systems, UML is insufficient. Compared to objects, agents are active because they act for reasons that emerge from themselves. The activity of agents is based on their internal states, which include goals and conditions that guide the execution of defined tasks. While objects need control from outside to execute their methods, agents know the conditions and intended effects of their actions and hence take responsibility for their needs. Furthermore, agents do not only act solely but together with other agents. Multi-agent systems can often resemble a social community of interdependent members that act individually." (Section 3.1)

The response was AUML — Agent Unified Modeling Language — which extends UML's sequence diagrams with concepts specifically needed for agent interaction: parallel execution threads, decision branches, nested and interleaved protocols, parameterization, and explicit role modeling. The result is a visual notation rich enough to specify complex multi-agent coordination in a form that is both human-readable and formally mappable to a computational model.

## The Two Dimensions of a Protocol Diagram

A Protocol Diagram (PD) in AUML has two dimensions with precise meanings:

> "A PD has two dimensions: the vertical dimension represents time, the horizontal dimension represents different AgentRoles." (Section 3.2.1.2)

This deceptively simple statement has significant design implications. The horizontal axis is purely organizational — the positions of agent roles have no meaning relative to each other. You can place the Initiator on the left or right; it doesn't matter. What matters is the set of roles present and the messages between them.

The vertical axis is temporal — downward movement represents time passing. Messages are represented as arrows between vertical lifelines, and the vertical position of an arrow indicates when it is sent relative to other messages. In real-time applications, the vertical axis can represent actual metric time; in most cases, only relative ordering matters.

This two-dimensional representation forces a discipline that prose descriptions of protocols cannot: every message must be placed at a specific point in time relative to every other message, and every agent must have a lifeline that explicitly shows its existence at each moment. The formalism prevents the vague "and then they exchange some messages" descriptions that plague informal protocol documentation.

## Lifelines, Creation, and Destruction

One of AUML's contributions beyond standard UML sequence diagrams is the explicit modeling of agent creation and destruction within a protocol:

> "If the agent is created or destroyed during the period of time shown on the PD, then its lifeline starts or stops at the appropriate point; otherwise it goes from the top of the diagram to the bottom." (Section 3.2.3.2)

An agent role that exists before the protocol starts is shown at the top of the diagram. An agent that is created during the protocol has an arrow pointing to its role box, and its lifeline begins there. An agent that terminates during the protocol has its lifeline end with a large "X."

This explicit lifecycle modeling is significant for orchestration system design. In a WinDAG system, the equivalent of agent creation is skill instantiation or agent spawning — dynamically creating a new agent to handle a specific subtask. The AUML convention makes this creation event a named, visible point in the coordination diagram, not an implementation detail. You can see, from the protocol diagram alone, that "at this point, a new specialist agent is created and handed the sub-problem."

## Lifeline Splitting: Parallelism and Decisions Made Visible

The most powerful extension AUML makes to standard UML sequence diagrams is the explicit representation of parallel execution and decision branches in a single diagram. Lifelines can split:

> "The lifeline may split into two or more lifelines to show AND/OR parallelism and decisions. Each separate track corresponds to a branch in the message flow. The lifelines may merge together at some subsequent point." (Section 3.2.3.1)

Three types of splits are distinguished:
- **AND parallelism**: A heavy horizontal bar — all branches execute concurrently
- **OR parallelism (inclusive-or)**: Heavy bar with an unfilled diamond — one or more branches execute
- **Decision (exclusive-or)**: Heavy bar with a diamond containing an "X" — exactly one branch executes

This tripartite distinction is crucial for protocol correctness. Many coordination failures arise from confusing these three cases:
- Treating an exclusive decision as an AND (executing both branches when only one should fire)
- Treating an AND as an exclusive decision (waiting for one branch when both must complete)
- Treating an OR as an exclusive decision (requiring exactly one branch when any combination is valid)

The AUML notation forces the designer to commit to which type of branching is intended, and the formal mapping to the UML metamodel means this commitment has computational consequences — a tool implementing AUML can verify that downstream messages are consistent with the branching type.

## Thread of Interaction: The Active Processing Period

AUML introduces the "thread of interaction" — shown as a tall thin rectangle over an agent's lifeline — to represent the period during which an agent is actively processing a received message:

> "A thread of interaction is shown as a tall thin rectangle whose top is aligned with its initiation time and whose bottom is aligned with its completion time. It is drawn over the lifeline of an AgentRole. The task being performed may be labelled as text next to the thread of interaction." (Section 3.2.4.2)

This is more than visual decoration. The thread of interaction distinguishes between an agent's *existence* (its lifeline) and its *active processing* (the thread). An agent can exist — be present in the conversation — without actively processing; it might be waiting for a message, or waiting for a resource. The thread of interaction makes this distinction visible.

For WinDAG systems, this distinction corresponds to the difference between a skill being *registered* (lifeline exists) and a skill being *invoked* (thread of interaction active). A busy skill has an active thread of interaction; an available skill has a lifeline but no current thread.

The thread also has a branching semantics: when an agent receives different types of messages, each possible response follows a different thread of interaction. The AUML diagram shows all possible threads — the designer must specify the response to every valid incoming message type, not just the happy-path case.

## Message Syntax: Encoding Everything a Message Needs

AUML provides a rich syntax for labeling message arrows, designed to capture all the information needed for protocol specification:

```
predecessor guard-condition sequence-expression communicative-act argument-list
```

Each component carries specific meaning:
- **predecessor**: sequencing constraint — which messages must precede this one
- **guard-condition**: when this message is sent (evaluated on behavioral state, not internal agent state)
- **sequence-expression**: cardinality — how many times this message can be sent (with `n..m` notation for repetition)
- **communicative-act**: the type of communication (inform, request, propose, etc.)
- **argument-list**: the content parameters

The guard-condition constraint deserves special attention. The specification notes: "The guard conditions must be defined on the behavioural semantics of the agents, that is, the internal state of the agent must not be used in the definition of the guard." (Section 3.2.5.2)

This is a subtle but important constraint: protocol-level guards can only reference observable conversational state, not an agent's private internal state. A guard like `[proposal-received]` is valid — it references a conversational fact. A guard like `[agent's confidence level > 0.7]` is not valid at the protocol level — that's internal to the agent and not observable by the protocol.

This constraint enforces the separation between protocol behavior (which is observable and verifiable) and agent reasoning (which is private and implementation-specific).

## Complex Messages: Parallelism in Sending

Beyond the basic message arrow, AUML defines "complex messages" for cases where a single trigger causes multiple simultaneous messages:

- **AND parallel sending**: All listed messages are sent simultaneously
- **OR parallel sending (inclusive-or)**: One or more messages from the list are sent
- **Decision (exclusive-or)**: Exactly one message from the list is sent

This is particularly relevant for broadcast scenarios — the ContractNet `cfp` message is typically sent to multiple Participants simultaneously. The AND complex message notation captures this precisely: one triggering event, multiple simultaneous deliveries.

## Synchronous vs. Asynchronous: A First-Class Distinction

AUML distinguishes message types by their synchronicity:

> "An asynchronous message is drawn with a stick arrowhead. It shows the sending of the message without yielding control. A synchronous message is drawn with a filled solid arrowhead. It shows the yielding of the thread of control (wait semantics), that is, the AgentRole waits until an answer message is received and nothing else can be processed." (Section 3.2.5.3)

In an orchestration system, this distinction has direct performance implications. An agent sending a synchronous message is blocked until it receives a response — it cannot process other messages. An agent sending an asynchronous message continues execution and handles the response when it arrives.

For WinDAG skill invocation, this maps to:
- **Synchronous invocation**: The orchestrating agent waits for the skill to complete before proceeding. Simpler to reason about, but blocks the orchestrator.
- **Asynchronous invocation**: The orchestrating agent fires off the skill invocation and continues with other work. More complex to reason about (what state are we in when the response arrives?), but enables parallelism.

A third variant — time-intensive message passing — is shown with a slanted downward arrow, indicating that "the duration required to send the message is [not] atomic" and "something else can occur during the message transmission." This is the model for long-running skill invocations where the orchestrator should actively pursue other work during the wait.

## What AUML Teaches About Specification Quality

The deeper lesson of AUML's design is about what *good* specification of agent interaction looks like. A well-formed AUML diagram forces the designer to answer:

1. **Who participates?** (the agent roles on the horizontal axis)
2. **When do they exist?** (lifelines, creation, and destruction)
3. **What is the temporal ordering of messages?** (vertical position and predecessor relationships)
4. **What are the branching points?** (AND/OR/XOR splits)
5. **What triggers active processing?** (threads of interaction)
6. **What are the cardinalities?** (how many instances send/receive each message)
7. **What guards control message sending?** (behavioral guards)
8. **Is communication synchronous or asynchronous?** (arrowhead types)

Any protocol that cannot answer all eight of these questions is underspecified. Any orchestration system design that cannot answer these questions for each of its coordination patterns has hidden assumptions that will surface as bugs.

AUML as a formalism is valuable not because every team will draw AUML diagrams — they won't — but because its structure identifies the *questions that every team must answer*, whether they use formal notation or not. These are the questions that distinguish a designed coordination system from an accidentally-working one.