# The Translation Hierarchy: Problem Decomposition for Semantic Interoperability

## The Core Framework

The FIPA specification defines six levels of ontological relationship, from strongest to weakest:

1. **Identical**: Same vocabulary, axiomatization, and representation language—physically identical files
2. **Equivalent**: Same vocabulary and axiomatization, different representation languages
3. **Extension**: O1 includes all of O2, preserving O2's properties
4. **Strongly-Translatable**: Total vocabulary mapping, no information loss, no inconsistency
5. **Weakly-Translatable**: Possible information loss but no inconsistency introduction
6. **Approximately-Translatable**: Information loss and possible inconsistency introduction

This hierarchy is not merely descriptive—it's prescriptive. It tells agent system designers: **different coordination problems require different solutions, and the type of ontological relationship determines which coordination strategies are available**.

## Decomposing the Semantic Interoperability Problem

### Level 1: Identical Ontologies - No Coordination Needed

"By identical, we mean that the vocabulary, the axiomatization and the representation language used are physically identical, like are for instance two mirror copies of a file" (p. 9).

**Agent System Implication**: If two agents use identical ontologies (even under different names), no translation is needed. The coordination problem reduces to **discovery**: "Do you use ontology X? I use ontology Y. Are they identical?" 

The ontology agent can answer with the `ontol-relationship` predicate: `(ontol-relationship O1 O2 Identical)` without any translation infrastructure. This is the simplest case but surprisingly common in practice—many agents in a system might simply register different names for the same ontology file.

### Level 2: Equivalent Ontologies - Language Translation Only

"Two ontologies O1 and O2 are said to be equivalent whenever they share the same vocabulary and the same logical axiomatization, but possibly are expressed using different representation languages (for instance, Ontolingua and XML)" (p. 9).

**Agent System Implication**: Coordination requires only **syntactic translation** between representation formats (KIF↔RDF, Ontolingua↔LOOM). The conceptualization is identical, so no semantic reasoning is needed about domain entities.

Critical property: "if O1 and O2 are equivalent then O1 and O2 are strongly translatable in both ways" (p. 9). This means bidirectional communication with zero information loss is guaranteed. Agent system designers can treat equivalent ontologies as interchangeable for planning purposes.

**Boundary condition**: The specification warns that "equivalent ontologies may still be served by different ontology servers with different deduction capabilities" (footnote, p. 9). So equivalence guarantees identical *representations* but not identical *inferential capabilities*. An agent using LOOM might derive conclusions that an agent using the equivalent RDF ontology cannot, due to reasoner limitations.

### Level 3: Extension - Asymmetric Coordination

"When (ontol-relationship O1 O2 extension) holds, then the ontology O1 extends or includes the ontology O2. Informally this means that all the symbols that are defined within the O2 ontology are found in the O1 ontology, with the very important restriction that the properties expressed between the entities in the O2 ontology are conserved in the O1 ontology" (p. 8).

**Agent System Implication**: Agent A using O2 can communicate with Agent B using O1, but not necessarily vice versa. This is **asymmetric interoperability**.

The specification gives the example (p. 9): O1 defines Fruit→{Apple, Lemon, Orange}. O2 extends this with Citrus as intermediate class: Fruit→Citrus→{Lemon, Orange}, and Fruit→Apple. Agent using O1 can understand Agent using O2 because "in O1 Lemon is a Fruit, and in O2 Lemon is a Citrus and Citrus is a Fruit implies that Lemon is a Fruit."

**Design Pattern for Agent Systems**: When Agent A (O2) requests a service from Agent B (O1), A can make requests that B fully understands. But B should not make unsolicited communications using O1-specific concepts (like Citrus) that A doesn't recognize. The coordination protocol must be **asymmetrically conservative**: the agent with the smaller ontology drives the interaction vocabulary.

### Level 4: Strongly-Translatable - Full Bidirectional Communication

"An ontology Osource is said to be related with level Strongly-Translatable to ontology Odest if: 1) the vocabulary of Osource can be totally translated to the vocabulary of Odest, 2) the axiomatization of Osource holds in Odest, 3) there is no loss of information from Osource to Odest, and 4) there is no introduction of inconsistency" (p. 10).

**Agent System Implication**: This is the gold standard for translation services. The specification gives the example of English→French fruit ontologies where every English term maps perfectly to French: Apple→Pomme, Lemon→Citron, Pear→Poire, Citrus→Agrume (p. 10-11).

Critically, this relationship is directional: English→French might be Strongly-Translatable while French→English is only Weakly-Translatable (because French has "Pamplemousse" with no English equivalent in that particular ontology).

**Design Pattern**: When an ontology agent supports strong translation, agents can coordinate as follows:
1. Agent A queries: "Can you strongly translate from my ontology to one that Agent B understands?"
2. If yes, A and B can engage in bidirectional communication through the translation service as proxy
3. The translation service guarantees no information loss in A→B direction
4. But A must verify reverse translation before assuming perfect bidirectional communication

### Level 5: Weakly-Translatable - Communication with Known Loss

"This level relates two ontologies Osource and Odest when it is possible to translate from Osource to Odest, even if with a possible loss of information... Nevertheless, a weak translation should not introduce any inconsistency" (p. 10).

**Agent System Implication**: Coordination is possible but **agents must be aware of what they're losing**. The French→English example shows this: French has {Pomme, Citron, Orange, Poire, Pamplemousse, Agrume} but English only has {Apple, Lemon, Orange}. When translating, Poire and Pamplemousse have no equivalent, and the Agrume (citrus fruit) concept is lost—but no false statements are introduced.

**Critical Design Requirement**: Agents must know *what* information is lost. The specification doesn't detail how to communicate this, but a robust implementation would require the translation service to report: "I translated your request, but these concepts have no equivalent: [Pamplemousse, Poire, Agrume as subclass]."

**Use Case for Weakly-Translatable Communication**:
- Information retrieval: Agent can query with detailed French vocabulary, receive answers in simpler English vocabulary
- Monitoring: Agent can understand English status reports even though it thinks in more detailed French categories
- Defensive programming: Agent should NOT use weak translation for commitments, commands, or safety-critical coordination

### Level 6: Approximately-Translatable - Communication with Inconsistency Risk

"This level is the less restrictive. Two ontologies Osource and Odest are said to be related with level Approx-Translatable if they are Weakly-Translatable with introduction of possible inconsistencies, for example, some of the relations become no more valid and some constraints do not apply anymore" (p. 11).

**Agent System Implication**: This is the last resort. The specification's example is brilliant: Chinese cooking ontology classifies Coriander as Parsley (leaves used), European cooking ontology classifies Coriander as Pepper (seeds used). Translating "Coriander" maintains the plant reference but "some of the properties expressed in the ingredients-for-chinese-cooking ontology do not hold any more in the ingredients-for-european-cooking ontology and vice versa" (p. 11).

**Design Pattern for Approximate Translation**:
1. Use only when no better translation exists and communication value exceeds risk
2. Mark translated content as "approximate" in agent communications
3. Implement confirmation protocols: "I understood you to say X, correct?"
4. Never use for safety-critical coordination or legal commitments
5. Consider approximate translation as hypothesis generation: "You might mean X, let me verify..."

## Hierarchical Properties Enable Incremental Reasoning

The specification defines formal properties: "Strongly-Translatable ⇒ Weakly-Translatable ⇒ Approx-Translatable" and "Equivalent (O1, O2) ⇒ Strongly-Translatable (O1, O2) ∧ Strongly-Translatable (O2, O1)" (p. 11).

**Agent System Implication**: An agent searching for coordination options can use **hierarchical search**:

```
1. Do we use identical ontologies? → No coordination needed
2. Are our ontologies equivalent? → Syntax translation only
3. Does one extend the other? → Asymmetric communication
4. Strong translation available? → Full bidirectional with guarantees
5. Weak translation available? → Communication with known loss
6. Approximate translation only? → Risky communication, needs confirmation
7. None of the above? → Negotiation needed or communication impossible
```

This search is not just conceptual—it can be implemented as actual agent reasoning using the `ontol-relationship` predicate and the Directory Facilitator services.

## The Gap Between Formal Specification and Computational Reality

The specification includes a crucial warning: "The problem of deciding if two logical theories (as ontologies in general are) have relationships to each other, is in general computationally very difficult. For instance, it can quickly become undecidable if two ontologies are identical when the expressive power of the ontologies concerned is high enough. Therefore, asserting that two ontologies have a relationship to each other as defined in this section, will often require manual intervention" (footnote, p. 8).

**Agent System Implication**: The translation hierarchy is not something agents discover automatically—it's something that must be:
- Asserted by ontology designers
- Verified by domain experts
- Registered with ontology agents
- Treated as fallible knowledge by coordinating agents

Agents must be prepared for three scenarios:
1. **Known relationships**: Ontology agent has registered translation levels, agents can trust them
2. **Unknown relationships**: No information available, agents must negotiate or fail gracefully
3. **Incorrect relationships**: Registered translations turn out wrong (Agent discovers "strong translation" actually loses critical information), agents must detect and report violations

## Distinctive Contribution: Coordination Strategy Selection

Most multi-agent systems treat semantic interoperability as binary: either agents understand each other or they don't. The FIPA specification's genius is recognizing that **there are degrees of understanding, and each degree enables different coordination strategies**.

This hierarchy gives agent system designers a **problem decomposition framework**:
- Don't build one monolithic "translation service"
- Build specialized services for each level: identity detection, syntax translation, strong translation, weak translation with loss reporting, approximate translation with confirmation loops
- Let agents select the appropriate service based on their coordination requirements and risk tolerance
- Design interaction protocols that degrade gracefully as translation quality decreases

The specification doesn't just define what semantic relationships exist—it defines what coordination is possible at each level of semantic alignment, which is exactly what autonomous agents need to know.