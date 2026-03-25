# Parameterized Protocols: Designing Coordination Patterns for Reuse

## The Problem With One-Off Protocols

Every time a new workflow is designed in an agent orchestration system, there is a temptation to design a bespoke coordination protocol for it. "This workflow needs agents to negotiate, so we'll have them exchange messages like this..." The result is a proliferation of slightly different negotiation patterns — each designed for one specific use case, none reusable, all requiring separate documentation and testing.

The FIPA specification introduces a powerful alternative: **parameterized protocols**. These are protocol definitions with explicit formal parameters — placeholders for roles, deadlines, message types, and constraints — that can be bound to specific values when the protocol is instantiated for a particular use case.

> "A parameterised protocol is the description for an IP with one or more unbound formal parameters. It therefore defines a family of protocols, each protocol specified by binding the parameters to actual values. Typically the parameters represent agent roles, constraints, instances of communicative acts and nested protocols. The parameters used within the parameterised protocol are defined in terms of the formal parameters so they are become bound when the parameterised protocol itself is bound to the actual values." (Section 3.2.10.1)

This is a form of abstraction over coordination behavior — exactly analogous to generic functions in programming, where the same algorithm can operate on different types. A parameterized protocol defines the *structure* of a coordination pattern; the parameters fill in the *specifics* for each application.

## The ContractNet Protocol as a Parameterized Template

The FIPA ContractNet protocol is specified as a parameterized protocol with the following formal parameters:

```
FIPA-ContractNet-Protocol
< Initiator, Participant, deadline, 
  cfp, refuse*, not-understood*, propose, 
  reject-proposal*, accept-proposal*, inform* >
```

The asterisk on certain message types indicates that those slots can accept *different kinds* of messages — a `refuse` message might carry different content in different instantiations, and the protocol does not constrain its content, only its presence in the flow.

This template can be instantiated for a buyer-seller negotiation:

```
FIPA-ContractNet-Protocol
< Buyer, Seller, 20000807,
  cfp-seller : cfp,
  refuse-1 : refuse,
  refuse-2 : refuse, not-understood, propose, reject-proposal, accept-proposal, cancel, inform, failure >
```

Here, the abstract `Initiator` role is bound to `Buyer`, `Participant` to `Seller`, the deadline to a specific date, and specific named messages to each message slot. The result is a concrete protocol — fully specified for this application — that inherits all the structural guarantees of the ContractNet template.

The same template, bound with different parameters, governs appointment scheduling, resource allocation, task bidding, and service discovery. **The structure is shared; the semantics are specific to each binding.**

## The Anatomy of Parameterization

What can be parameterized in a FIPA protocol? Four categories:

### 1. Agent Roles
The participants in the protocol are specified abstractly. `Initiator` and `Participant` are role labels that will be bound to specific agent types or instances at deployment time. This means the protocol works for any pair of agents satisfying the specified role interfaces.

### 2. Constraints
Temporal and behavioral constraints — like deadlines — are parameters. Different instantiations of the same protocol can have different timing requirements without changing the protocol structure.

### 3. Communicative Act Instances
Message types are parameters. The abstract `cfp` slot in the template can be bound to a specific `cfp-seller` message instance with specific content semantics. This allows the same protocol structure to carry different informational content in different applications.

### 4. Nested Protocols
The FIPA specification allows entire sub-protocols to be parameters: "Typically the parameters represent agent roles, constraints, instances of communicative acts and **nested protocols**." (Section 3.2.10.1) This is the most powerful form of parameterization — it allows a protocol template to have *behavioral* parameters, where the actions taken at certain points in the protocol are themselves specified by the instantiation.

## Three Types of Protocol Composition

The FIPA specification carefully distinguishes three different mechanisms for building complex protocols from simpler ones. Understanding the difference is essential for protocol design:

### Nested Protocols: Sub-protocols Within a Protocol
A nested protocol is a fixed sub-protocol that appears as a unit within a larger protocol. It is used for:
- **Repetition**: "perform this sub-protocol until condition X is met"
- **Modularity**: "at this point, perform the standard DF-query protocol"
- **Guarding**: "perform this sub-protocol only if condition Y holds"

Nested protocols are *fixed* — they are abbreviations for a specific embedded pattern, not parameterized.

### Interleaved Protocols: Concurrent Independent Protocols
An interleaved protocol shows that "during the execution of one protocol another one is started/performed." (Section 3.2.10.6) This represents two separate ongoing conversations that proceed concurrently but may have coordination dependencies between them.

For example, a Broker might be running a ContractNet protocol with a Retailer while simultaneously running a separate Request protocol with a Wholesaler, where the outcome of the Wholesaler interaction affects the Broker's responses in the Retailer interaction.

### Parameterized Protocols: Reusable Templates
Parameterized protocols are used to "prepare patterns which can be instantiated in different contexts and applications, for example, the FIPA Contract Net Protocol for appointment scheduling and negotiation about some good which should be sold." (Section 3.2.10.6)

The comment in Section 3.2.10.6 is explicit about when to use each: "An interleaved protocol is used to show that during the execution of one protocol another one is started/performed. Nested protocols are used to show repetitions of sub-protocols, identifying fixed sub-protocols, reference to a fixed sub-protocol... or guarding a sub-protocol. Parameterised protocols are used to prepare patterns which can be instantiated in different contexts and applications."

## Bound Elements: Closing the Template

A parameterized protocol becomes usable only when all its parameters are bound to actual values. The FIPA specification provides precise syntax for this:

```
parameterised-protocol-name < role-list, constraint-expression-list, value-list >
```

Binding creates a *concrete* protocol — one that can be registered in the protocol library, referenced by agents, and used in actual conversations. The binding operation is analogous to type instantiation in generic programming: the template's structural guarantees apply to all bindings, while the specific semantics are determined by the bound values.

Critically: "If the referencing scope is itself a parameterised protocol, then the parameters of the referencing parameterised protocol can be used as actual values in binding the referenced parameterised protocol." (Section 3.2.11.1) This enables *composition* of parameterized protocols — a higher-level protocol template can use another parameterized protocol as a sub-component, passing its own parameters through.

## Implications for WinDAG Skill Protocol Design

### Skills Have Protocol Templates

In a WinDAG system, each skill category should have an associated protocol *template* that governs how that skill is invoked, how it responds to various conditions, and how its results are reported. The template has parameters for:
- The specific skill variant being invoked
- The timeout and retry constraints for this invocation
- The expected output format and content
- The error handling behavior

When an orchestrator invokes skill X on task Y, it is instantiating the skill's protocol template with specific bindings for that invocation.

### Building a WinDAG Protocol Library

The FIPA approach suggests that WinDAGs should maintain a **protocol library** analogous to the skill library: a registry of named, parameterized protocol templates that can be instantiated for specific coordination needs. This library would contain:

- Generic patterns (ContractNet-style negotiation, Request-Response, Publish-Subscribe)
- Domain-specific patterns (code-review-then-merge, verify-then-deploy, decompose-then-aggregate)
- Infrastructure patterns (heartbeat, cancellation, error escalation)

New workflow designs start by selecting the appropriate protocol template from the library and instantiating it with workflow-specific parameters, rather than designing a new protocol from scratch.

### Protocol Reuse Reduces Coordination Bugs

A major benefit of protocol templates is that the structural correctness of the template only needs to be verified once. If ContractNet is known to correctly handle the proposal/selection/execution cycle, then any correct instantiation of ContractNet inherits that correctness. The risk of coordination bugs concentrates at the binding site — where application-specific semantics are attached to protocol slots — rather than being spread across the entire protocol.

### Parameterized Protocols as Design Documentation

Even in systems that don't formally implement FIPA protocols, the concept of parameterized protocols provides a valuable documentation discipline. Specifying "this workflow uses ContractNet with parameters: Orchestrator→TaskAllocator, Workers→CodeGenerators, deadline=30s, cfp=task-description, propose=capability-estimate" is dramatically clearer than describing the workflow in prose. It communicates the structural pattern, the roles involved, the timing constraints, and the message semantics in a compact, standard form.

## The Deeper Principle: Separate Structure From Specifics

The underlying insight of parameterized protocols is a general design principle: **separate the structural pattern of coordination from the specific semantics of any particular application of that pattern**. The structure can be verified, tested, and reused. The specifics can be varied without re-verifying the structure.

This principle applies well beyond formal protocol specification. Any time you find yourself designing "a workflow that's basically like X but with different Y and Z," you are recognizing that a parameterized protocol template exists. Make it explicit. Name the template. Specify the parameters. Build the binding. You'll find that your system's coordination layer becomes as organized, reusable, and inspectable as its capability layer.