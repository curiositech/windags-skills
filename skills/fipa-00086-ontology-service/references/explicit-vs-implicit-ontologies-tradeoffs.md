# Explicit vs. Implicit Ontologies: The Coordination-Performance Trade-off

## The Fundamental Choice

The FIPA specification opens by acknowledging a design decision every agent system faces: "For a given domain, designers may decide to use ontologies that are explicit, declaratively represented (and stored somewhere) or, alternatively, ontologies that are implicitly encoded with the actual software implementation of the agent themselves and thus are not formally published to an ontology service" (p. 1).

This is not a minor implementation detail—it's a fundamental architectural choice with deep implications for how agents can coordinate, adapt, and scale. The specification doesn't mandate explicit ontologies, but it provides the infrastructure for them, recognizing that **open environments require different solutions than closed systems**.

## Implicit Ontologies: The Closed-System Optimum

An implicit ontology is one where "the agents have been programmed by the same designer or design team using the same worldview, concepts are hardcoded in their decision procedures, and the vocabulary is embedded in their message templates" (implied throughout the specification, explicitly acknowledged p. 1).

### Advantages of Implicit Encoding

**Performance**: No runtime lookup, no translation overhead, no discovery latency. When Agent A sends a message to Agent B using the term "Apple," B directly executes the procedure associated with apples. There's no interpretation step.

**Simplicity**: No ontology service infrastructure needed. No Directory Facilitator queries for compatible ontologies. No translation agents. No version management. The system is the ontology.

**Tight Coupling Enables Complex Protocols**: When all agents share implementation-level conceptualization, they can engage in intricate multi-step protocols with implicit shared expectations. Agent A can assume Agent B will interpret ambiguous terms the same way because they were programmed with the same biases.

**Boundary Condition**: This works "as long as the agents operate within the designed environment with the designed partners" (p. 1, implied). The moment an agent encounters a partner with different implicit assumptions, communication becomes unreliable or impossible.

### The Fatal Flaw for Open Systems

The specification notes: "Without explicit ontologies, agents need to share intrinsically the same ontology to be able to communicate and this is a strong constraint in an open environment where agents, designed by different programmers or organizations, may enter into communication" (p. 2).

The problem compounds over time:
- **No runtime adaptation**: When domain understanding evolves, all agents must be updated simultaneously
- **No heterogeneity**: Can't integrate agents from different vendors, research groups, or legacy systems
- **No partial understanding**: Either agents share the complete implicit ontology or they cannot communicate at all
- **No graceful degradation**: When assumptions diverge, errors are silent and catastrophic rather than detectable and recoverable

## Explicit Ontologies: The Open-System Necessity

An explicit ontology is "declaratively represented as opposed to implicitly, procedurally encoded. It can be then considered as 'a referring knowledge' and, as a consequence, could be outside the communicating agents; managed by a dedicated ontology agent" (p. 2).

### Advantages of Explicit Declaration

**Discovery**: Agents can query: "What ontologies do you support? What concepts does this ontology define? How does your ontology relate to mine?" This enables dynamic partner selection and runtime reconfiguration.

**Translation**: When Agent A and Agent B use different ontologies, an Ontology Agent (OA) can provide translation services—if the relationship between ontologies has been explicitly formalized. "There are already implementations that use one domain ontology to integrate several information sources, managed by a dedicated agent, whilst still allowing each source to use its private ontology" (p. 3).

**Evolution and Versioning**: Ontologies can be updated, extended, or deprecated independently of agent implementations. "Every agent can also have their own ontology depending on their preference, their role in the domain or simply their known language" (p. 3).

**Validation and Verification**: "Explicit axioms allow validation of specifications, unambiguous definition of vocabulary, automation of operations like classification and translation" (p. 3). Agents can check whether their understanding is consistent, whether a proposed action would violate ontological constraints, whether two concepts are compatible.

**Heterogeneous Integration**: "An ontology service for a community of agents is specified for this purpose. It is required that the service be provided by a dedicated agent, called an Ontology Agent (OA)" (p. 1). This enables agents from radically different backgrounds to coordinate through a common semantic infrastructure.

### Costs of Explicit Ontologies

**Infrastructure Complexity**: Requires Ontology Agents, Directory Facilitators, ontology servers, registration protocols, query languages, translation services. The specification devotes 55 pages to defining this infrastructure.

**Performance Overhead**: Every semantic operation may require:
- Directory Facilitator query to find relevant Ontology Agent
- Request to Ontology Agent for concept definition, relationship information, or translation
- Wait for response before proceeding
- Potential multi-step negotiation to agree on shared ontology

**Consistency Challenges**: "The OA is responsible to respect the consistency of the ontology and it can refuse (using the refuse communicative act) to do the action if the result would produce an inconsistent ontology" (p. 34-35). Maintaining consistency across distributed ontology modifications is computationally hard and sometimes undecidable.

**Human-in-the-Loop Requirements**: "Asserting that two ontologies have a relationship to each other... will often require manual intervention" (footnote, p. 8). Explicit ontologies don't eliminate human judgment—they make it more visible and structured.

## The Hybrid Reality: Most Systems Need Both

The specification's genius is recognizing that explicit and implicit approaches are not mutually exclusive: "The application of this specification does not prevent the existence of agents that, for a given domain, use ontologies implicitly encoded with the implementation of the agents themselves. In these cases full agent communication and understanding can still be obtained, however the services provided by the OA cannot apply to implicit encoded ontologies" (p. 1).

### Design Pattern: Explicit Interfaces, Implicit Cores

**External Communication**: Use explicit ontologies for inter-agent coordination. Agents expose their conceptualization through formal ontology commitments registered with the Directory Facilitator.

**Internal Reasoning**: Use implicit ontologies for performance-critical decision-making. Once an agent has negotiated a shared ontology with a partner, it can compile that ontology into efficient internal representations.

**Example from Specification**: "Agent B discovers that no pictures under the name citrus are available. Before sending the answer to Agent A, Agent B queries the appropriate OA... to obtain sub-species of citrus... The OA answers Agent B, informing it that oranges and lemon are sub-species of citrus" (p. 3).

Agent B might:
1. Have implicit knowledge that citrus pictures exist in its database
2. Use explicit ontology to understand that citrus includes oranges and lemons
3. Translate explicit ontological query results back into implicit database queries
4. Respond using explicit ontological vocabulary that Agent A understands

### Design Pattern: Cached Ontology Compilation

"It is left to agents, then, the responsibility to translate knowledge from the actual knowledge representation language into and out of this interlingua, as needed" (p. 18).

**Strategy**: Agents cache compiled versions of frequently-used explicit ontologies:
1. First encounter: Query OA for ontology, translate into internal representation (expensive)
2. Subsequent encounters: Use cached compiled version (cheap)
3. Periodically: Check if ontology has been updated, recompile if needed
4. Dynamically: Fall back to OA queries for concepts not in cached subset

This gives most of the performance of implicit ontologies with most of the flexibility of explicit ontologies.

## Application-Specific Guidance

### When to Prefer Implicit Ontologies

**Closed, performance-critical systems**: Real-time control systems, high-frequency trading, embedded systems where all agents are co-designed and latency is critical.

**Stable domains**: Ontological concepts won't change during system lifetime. Example: Chess-playing agents—the rules of chess are fixed.

**Homogeneous teams**: All agents from single vendor/designer, sharing implementation language and toolchain.

**Example**: "Some applications use machine learning techniques to adaptively extend an ontology based on the interaction of the user with the system. In this case, at the execution time, several user agents may compete or collaborate to request a dedicated agent to modify an ontology" (p. 3). The learning agents might use implicit representations internally while updating explicit ontologies for external coordination.

### When to Require Explicit Ontologies

**Open environments**: Internet-scale systems, marketplaces, ecosystems where new agents constantly join.

**Heterogeneous integration**: Legacy system integration, multi-vendor platforms, cross-organizational coordination.

**Evolving domains**: Ontological concepts change due to new regulations, scientific discoveries, or business model evolution.

**Semantic integration**: "Semantic integration of heterogeneous information sources in an open and dynamic environment, such as the Internet or a digital library, may also benefit from an ontology service" (p. 3).

**Example**: Information retrieval where "the size of some linguistic ontologies may prevent an agent from storing the ontology in its address space, so that agents need to remotely access and refer to ontologies for disambiguation of user queries, for using information about taxonomies of terms or thesauri to enhance the quality of retrieved results" (p. 3).

## The Specification's Pragmatic Stance

"It is not mandated that every AP must include an Ontology Agent. However, in order to promote interoperability, if one OA exists, then it must comply with these specification. And, if the services here described are required by a specific agent platform implementation, then they must be implemented in compliance with this specification" (p. 1).

**Translation for Agent System Designers**: Use implicit ontologies where you can, explicit ontologies where you must, but if you expose explicit ontology services, use the standard protocol so agents from outside your control boundary can interoperate.

This is sophisticated systems thinking: recognize that perfect solutions are impossible, provide infrastructure for the hard cases, but don't mandate overhead where it's not needed. The specification defines the boundary between local optimization (implicit) and global coordination (explicit), then standardizes only the global coordination interface.

## Distinctive Insight: Ontology as Interface vs. Implementation

The deepest contribution is the recognition that ontology serves two different roles:

**As Interface**: Explicit, declarative, negotiable, discoverable—the contract between agents for how they will interpret shared vocabulary.

**As Implementation**: Implicit, procedural, optimized, private—the efficient machinery each agent uses internally to reason and act.

Most systems collapse these roles, forcing agents to expose their internal representations as external interfaces (tight coupling, fragility) or to use heavy external representations internally (poor performance).

The FIPA specification separates them: "The OKBC Knowledge Model therefore serves as an implicit interlingua for knowledge that is being communicated using OKBC, and systems that use OKBC translate knowledge into and out of that interlingua as needed" (p. 18).

**Design Principle**: Treat ontologies like network protocols—standardize the wire format (explicit ontology), leave internal representation free (implicit ontology). Agents translate at the boundary, optimize internally. This is exactly the strategy that made the Internet scale.