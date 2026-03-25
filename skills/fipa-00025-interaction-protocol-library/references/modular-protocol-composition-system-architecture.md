# Modular Protocol Composition: Building Complex Agent Systems from Simple Parts

## The Modularity Problem in Agent Systems

As agent systems grow in complexity, they face a fundamental scalability challenge: the interaction patterns between agents become too complex to be specified or reasoned about as a single monolithic coordination scheme. A large WinDAG system with 180+ skills and dozens of concurrent workflows cannot have its coordination specified in a single protocol diagram — the complexity would be unmanageable.

The FIPA Interaction Protocol Library addresses this through a principled approach to **modular protocol composition** — the ability to build complex interaction patterns from simpler, well-specified components. Three distinct composition mechanisms are provided, each suited to different structural relationships between protocols.

The specification introduces these mechanisms by first noting: "Nested protocols are applied to specify complex systems in a modular way. Moreover the reuse of parts of a specification increases the readability of them." (Section 3.2.7)

This statement connects modularity to *readability* as well as correctness — a complex coordination system that can be decomposed into named, reusable sub-protocols is not just technically better; it is humanly comprehensible. Protocol design for comprehensibility is a prerequisite for system maintenance, debugging, and extension.

## Three Composition Mechanisms and Their Appropriate Uses

The FIPA specification is unusually precise about when each composition mechanism should be used:

> "An interleaved protocol is used to show that during the execution of one protocol another one is started/performed. Nested protocols are used to show repetitions of sub-protocols, identifying fixed sub-protocols, reference to a fixed sub-protocol, like asking the DF for some information, or guarding a sub-protocol. Parameterised protocols are used to prepare patterns which can be instantiated in different contexts and applications." (Section 3.2.10.6)

### Mechanism 1: Nested Protocols — Sub-patterns Within a Flow

A nested protocol appears *inside* a larger protocol and is represented visually as a rounded-rectangle box containing message exchanges. It is used for:

**Repetition**: The constraint mechanism on nested protocols — specifying that a sub-protocol should repeat n..m times or until a guard condition is satisfied — enables the specification of iterative coordination patterns. A skill that progressively refines a result through repeated cycles of "propose → evaluate → refine" can be specified as a nested protocol with a repeat constraint.

**Fixed sub-protocol reference**: When a well-known protocol is used as a step within a larger workflow, the nested protocol notation allows you to say "at this point, execute the FIPA-Query-Protocol" without restating its entire definition. This is the agent equivalent of a function call — referencing a named, pre-defined behavior by name.

**Guarded sub-protocols**: When a sub-protocol should only execute under certain conditions, the nested protocol's guard mechanism specifies this: "If [commit] holds, execute the commitment sub-protocol; otherwise, treat it as an empty protocol." This enables conditional branching in coordination flows without requiring a separate top-level protocol for each branch.

### Mechanism 2: Interleaved Protocols — Concurrent Independent Conversations

Interleaved protocols represent conversations that are logically separate but temporally concurrent. The visual notation — two protocol rectangles that are *not* nested within each other — communicates independence: "these two conversations are happening at the same time, but neither is a sub-part of the other."

The example in Section 3.2.7.4 shows a Broker simultaneously running:
- A ContractNet-style negotiation with a Retailer (cfp, propose, ...)
- A Request interaction with a Wholesaler (request, inform, ...)

These are separate conversations with separate states. The Broker maintains both simultaneously, and the outcome of one may influence decisions made in the other — but this influence happens through the Broker's internal reasoning, not through a formal protocol dependency.

For WinDAG, interleaved protocols are the natural model for **parallel subtask dispatch**: an orchestrating agent distributes subtasks to multiple specialist agents simultaneously, each subtask being a separate conversation, and waits for results before proceeding. The orchestrator's internal state tracks all active conversations, and when sufficient results have arrived, it synthesizes them.

### Mechanism 3: Parameterized Protocols — Reusable Templates with Bound Instantiation

Parameterized protocols (covered in depth in the companion document) provide the reuse mechanism. A parameterized protocol is a *family* of protocols — the template specifies the structure, the parameters specify the variation points, and binding creates concrete instances.

The combination of these three mechanisms provides a compositional vocabulary sufficient for specifying arbitrarily complex coordination systems:
- Use **parameterized protocols** to define reusable coordination patterns
- Use **nested protocols** to assemble those patterns into sequential and conditional flows
- Use **interleaved protocols** to represent concurrent independent conversations

## Recursive Decomposition: Complex Protocols All the Way Down

The FIPA notation supports recursive protocol structure: nested protocols can themselves contain nested protocols, and parameterized protocols can take other parameterized protocols as parameters.

> "Another nested protocol can completely be drawn within the actual nested protocol denoting that the inner one is part of the outer one." (Section 3.2.7.2)

> "If the referencing scope is itself a parameterised protocol, then the parameters of the referencing parameterised protocol can be used as actual values in binding the referenced parameterised protocol." (Section 3.2.11.1)

This recursive structure is powerful: it means that complex coordination patterns can be built up layer by layer, with each layer being fully specified and independently verifiable. A high-level protocol might specify "run the task-allocation sub-protocol, then run the execution-monitoring sub-protocol, then run the result-verification sub-protocol" — with each sub-protocol being separately defined, separately testable, and separately reusable.

This is precisely the architecture that enables complex WinDAG workflows to remain comprehensible: each level of the protocol hierarchy is simple enough to understand on its own, even though the full protocol is complex.

## The Role of AUML's Complex Message Structures

Beyond protocol composition, AUML provides composition mechanisms at the message level through "complex messages" — patterns for sending multiple messages simultaneously or conditionally.

The three types mirror the three types of protocol branching:
- **AND complex messages**: All listed messages are sent simultaneously (broadcast)
- **OR complex messages**: One or more messages from the list are sent (multicast with partial response)
- **XOR complex messages**: Exactly one message from the list is sent (conditional routing)

The ContractNet `cfp` message, sent to all available Participants simultaneously, is a AND complex message. An orchestrator that routes a task to whichever of several agents is available first is using an OR complex message (whichever responds first gets the task). A conditional routing decision — "send this to Agent A if condition X, else to Agent B" — is a XOR complex message.

Understanding which type of message pattern is being used — AND vs. OR vs. XOR — is crucial for reasoning about system behavior. An orchestrator that treats an AND broadcast (expecting responses from all) the same as an OR multicast (expecting a response from any) will either wait too long or miss required results.

## Composition and the Inclusion Library

The specification's discussion of the FIPA IP Library maintenance reveals an important philosophy:

> "The most effective way of maintaining the FIPA IPL is through the use of the IPs themselves by different agent developers. This is the most direct way of discovering possible bugs, errors, inconsistencies, weaknesses, possible improvements, as well as capabilities, strengths, efficiency, etc." (Section 2.3)

And the inclusion criteria (Section 2.4) require:
- A clear AUML protocol diagram
- Substantial documentation
- Demonstrated usefulness

This is a *use-driven* library maintenance philosophy: protocols earn their place in the library by being genuinely useful across multiple contexts. A protocol that is used in only one application is not a library element — it is an application-specific detail. Library elements are patterns that recur across many applications.

For WinDAGs, this suggests that the protocol library should be grown organically from observed patterns, not designed from scratch. When the same coordination pattern appears in multiple workflows, extract it, name it, specify it formally, and add it to the library. The library grows through distillation of experience, not through up-front design.

## Boundaries and Context

Modular composition of protocols has boundaries and preconditions that must be respected:

**Boundary 1: Parameter types must match.** When binding a parameterized protocol, the actual values bound to each formal parameter must be of the appropriate type. An AgentRole parameter must be bound to an AgentRole value, not to a message type. The specification notes: "If the name does not match a parameterised protocol or if the number of arguments in the bound element does not match the number of formal parameters in the parameterised protocol, then the model is ill-formed." (Section 3.2.11.5)

**Boundary 2: Nested and interleaved protocols have different state semantics.** A nested protocol shares the conversational state of its containing protocol. An interleaved protocol has independent conversational state. Confusing these leads to incorrect state management.

**Boundary 3: Composition does not eliminate protocol limits.** The exception handling and interoperability gaps identified in the base protocols propagate through composition. A complex nested protocol that inherits from ContractNet still has ContractNet's silences on dropped messages and timeouts. Protocol composition is not protocol completion.

**Boundary 4: Complexity imposes cognitive costs.** The ability to compose protocols recursively is powerful but can produce specifications that are formally correct but humanly incomprehensible. Good protocol design requires judgment about when to flatten a recursive structure into a more explicit (but less reusable) form for the sake of clarity.

## Architectural Lessons for WinDAG

The FIPA compositional approach suggests a specific architecture for WinDAG protocol management:

1. **Maintain a tiered protocol library**: Base protocols (Request, ContractNet, Query-If) at the bottom; domain-specific protocols (task-allocation, code-review, result-verification) in the middle; application-specific protocols at the top.

2. **Design for extraction**: When building a new workflow, write the protocol flat first. Then identify recurring sub-patterns and extract them as named nested protocols. This bottom-up extraction is more reliable than top-down decomposition.

3. **Version protocols explicitly**: The FIPA spec notes that the IPL may include "stability information, versioning, contact information, different support levels." Protocol versioning prevents breaking changes from silently disrupting dependent workflows.

4. **Test protocols at each compositional level**: A nested sub-protocol should be testable in isolation, with stub implementations of its parent protocol's context. This allows protocol bugs to be caught at the appropriate level of abstraction.

5. **Document parameter semantics, not just parameter types**: The formal parameter list of a parameterized protocol tells you *what kinds* of things can be bound to each parameter. It doesn't tell you *what they mean in context*. Document the semantic constraints on parameter values: "the `deadline` parameter must be at least 30 seconds in the future; the `Participant` role must support the capability-assessment interface."

The FIPA compositional framework is ultimately an argument for treating protocol design with the same engineering rigor as data structure and algorithm design. Complex protocols should be built from tested, reusable parts; those parts should be organized in a maintained library; and the library should grow from use rather than from speculation. This is the architecture of a coordination system that can scale — and the FIPA specification, for all its age, articulates it with unusual clarity.