# AUML Protocol Diagrams: Making Temporal Coordination Explicit and Verifiable

## The Inadequacy of Object-Oriented Modeling for Agent Systems

The FIPA specification provides a clear rationale for extending UML: "For modelling agents and agent-based systems, UML is insufficient. Compared to objects, agents are active because they act for reasons that emerge from themselves. The activity of agents is based on their internal states, which include goals and conditions that guide the execution of defined tasks. While objects need control from outside to execute their methods, agents know the conditions and intended effects of their actions and hence take responsibility for their needs" (lines 194-199).

This distinction cuts to the heart of what makes agent coordination different from object collaboration. Objects are passive—they wait for method calls. Agents are proactive—they initiate actions based on internal state and goals. Objects have simple interaction patterns (method call/return). Agents have complex conversational patterns with multiple paths, concurrent activities, and conditional flows.

Moreover, "agents do not only act solely but together with other agents. Multi-agent systems can often resemble a social community of interdependent members that act individually" (lines 199-200). This social, concurrent nature requires specification techniques that capture temporal ordering, concurrent execution, decision points, and protocol nesting—concepts largely absent from standard object modeling.

## Protocol Diagrams: Time as First-Class Dimension

The fundamental innovation in AUML protocol diagrams is making time and temporal ordering explicit and primary. As the specification states: "A PD has two dimensions: the vertical dimension represents time, the horizontal dimension represents different AgentRoles. Normally the time proceeds down the page and usually only time sequences are important, but in real-time applications the time axis could be an actual metric" (lines 223-226).

This seemingly simple design choice has profound implications. By making time the vertical axis:

1. **Message ordering becomes visually explicit**: You can see at a glance which messages precede others, which happen concurrently, and where decision points create alternative paths.

2. **Concurrency is natural to represent**: Horizontal bars with multiple outgoing arrows show parallel message sends; diamond decision points show exclusive choices.

3. **Protocol composition is spatial**: Nested protocols appear as boxes within the timeline, showing exactly where in the interaction sequence a sub-protocol executes.

4. **Asynchrony vs. synchrony becomes visible**: Stick arrows (→) show asynchronous sends that don't block; filled arrows (➞) show synchronous sends that wait for response.

For a DAG-based orchestration system, this suggests protocol diagrams should be first-class artifacts—not just documentation, but *executable specifications* that directly drive orchestration behavior.

## Agent Lifelines and Thread Management

AUML introduces the concept of an agent lifeline: "The lifeline represents the existence of an agent of a given AgentRole at a particular time" (lines 368-369). Lifelines can start (agent creation), end (agent destruction), split (for parallel processing), and merge (rejoining after parallelism).

The notation for splitting lifelines reveals sophisticated temporal semantics:
- **AND parallelism** (heavy bar): All branches execute concurrently
- **OR parallelism** (heavy bar + diamond): At least one branch executes, possibly more  
- **Decision/XOR** (heavy bar + diamond with X): Exactly one branch executes

This provides precise semantics for how protocols handle concurrency and choice—something often ambiguous in textual specifications or code.

Crucially, lifeline splits don't just represent internal parallelism within one agent; they can represent how one agent's behavior fans out to coordinate with multiple other agents simultaneously. A "broadcast query" protocol might show one initiator's lifeline remaining singular while multiple participant lifelines receive messages concurrently.

## Threads of Interaction: Reaction Patterns Made Explicit

A subtle but powerful concept in AUML is the "thread of interaction"—the tall thin rectangle drawn over an agent's lifeline showing "the period during which an AgentRole is performing some task as a reaction to an incoming message" (lines 421-422).

This makes *reactive behavior* explicit. When an agent receives a message, what task does it perform in response? How long does that task take? When can it receive additional messages? These questions are answered visually by thread-of-interaction boxes.

The specification notes: "If the distinction between the reaction to different incoming communicative acts can be neglected, the entire lifeline may be shown as one thread of interaction" (lines 433-435). This provides a presentation option for varying detail levels—show internal reaction structure when it matters, hide it when it doesn't.

For orchestration systems, threads of interaction map to several concepts:
- **Skill execution duration**: How long does processing a request take?
- **Blocking vs. non-blocking**: Can the agent handle other requests while processing this one?
- **State-dependent behavior**: Different reactions to the same message depending on current state

Making these explicit in protocol diagrams enables reasoning about concurrency limits, deadlock potential, and throughput characteristics.

## Message Semantics: Beyond Simple Communication

AUML message arrows carry rich semantics encoded in their visual form and labels. The label syntax is: