# The OKBC Knowledge Model: Meta-Knowledge as Operational Infrastructure

## The Core Problem: Talking About Knowledge

When agents need to manipulate knowledge itself—to query for concept definitions, assert new relations, modify ontologies, translate between representations—they face a bootstrapping problem: **What vocabulary do you use to talk about vocabularies? What ontology describes ontologies?**

The FIPA specification solves this by adopting the Open Knowledge Base Connectivity (OKBC) Knowledge Model as "an implicit interlingua for knowledge that is being communicated using OKBC, and systems that use OKBC translate knowledge into and out of that interlingua as needed" (p. 18).

This is not just a representation language—it's **operational infrastructure**. The OKBC model defines the primitives that agents use to actually perform knowledge management tasks, not just to document what knowledge means.

## What the OKBC Knowledge Model Provides

### A Minimal Ontological Commitment

The model defines a small set of primitives that "supports an object-oriented representation of knowledge and provides a set of representational constructs commonly found in object-oriented knowledge representation systems" (p. 18):

- **Frames**: Entities representing domain objects or concepts
- **Slots**: Binary relations between frames and values
- **Facets**: Ternary relations constraining slots
- **Classes**: Sets of entities with instances
- **Individuals**: Entities that are not classes

This is deliberately minimal—it's not a rich upper ontology but a meta-level framework that can represent many different domain ontologies.

### Formal Semantics Through KIF

Critically, the specification provides formal semantics using Knowledge Interchange Format (KIF), a first-order logic with set theory. For example:

```
(<=> (class ?X) (not (individual ?X)))
```
"An entity is a class if and only if it is not an individual" (p. 19).

```
(<=> (holds ?C ?I) (instance-of ?I ?C))
```
"A class holds for an instance if and only if the instance is a member of the class" (p. 19).

**Why this matters**: The formal semantics means agents can *reason* about ontologies, not just store and retrieve them. They can verify consistency, infer implicit relationships, and validate modifications.

### Template Slots and Inheritance

The model distinguishes between:
- **Own slots**: Properties of a specific frame
- **Template slots**: Properties that inherit to all instances of a class

"Each value V of a template slot S of a class frame C represents the assertion that the relation template-slot-value holds for the relation S, the class represented by C, and the entity represented by V... That assertion, in turn, implies that the relation S holds between each instance I of class C and value V" (p. 20).

**Agent System Implication**: Agents can make statements that automatically propagate to all instances. If an agent asserts `(template-slot-value Gender Female-Person Female)`, this establishes that all female persons have gender female—without needing to explicitly assert this for each individual.

**The slot value inheritance axiom** formalizes this:
```
(=> (template-slot-value ?S ?C ?V)
    (and (=> (instance-of ?I ?C) (holds ?S ?I ?V))
         (=> (subclass-of ?Csub ?C)
             (template-slot-value ?S ?Csub ?V))))
```

This says: template slot values inherit both to instances (as own slot values) and to subclasses (as template slot values).

## Standard Vocabulary: The Normative Primitives

### Standard Classes

The specification defines standard class names (pp. 23-24):

- `:THING` - Root of class hierarchy, superclass of all classes
- `:CLASS` - Class of all classes (every class is instance-of :CLASS)
- `:INDIVIDUAL` - Class of all non-classes
- `:NUMBER`, `:INTEGER`, `:STRING`, `:SYMBOL`, `:LIST` - Basic datatypes

**Design principle**: "Whether the classes described in this section are actually present in a KB or not, OKBC guarantees that all of these class names are valid values for the :VALUE-TYPE facet" (p. 23).

This means agents can use these names in ontological statements even if the ontology they're working with doesn't explicitly define them. They're guaranteed interlingua vocabulary.

### Standard Facets

Facets constrain slot values. The specification defines 13 standard facets (pp. 23-27):

**`:VALUE-TYPE`** - "specifies a type restriction on the values of a slot"
```
(=> (:VALUE-TYPE ?S ?F ?C)
    (and (class ?C)
         (=> (holds ?S ?F ?V) (instance-of ?V ?C))))
```
Every value of slot S of frame F must be instance of class C.

**`:CARDINALITY`** - "specifies the exact number of values that may be asserted for a slot"
```
(=> (:CARDINALITY ?S ?F ?N)
    (= (cardinality (setofall ?V (holds ?S ?F ?V))) ?N))
```

**`:INVERSE`** - "specifies inverses for that slot"
```
(=> (:INVERSE ?S1 ?F ?S2)
    (and (:SLOT ?S2)
         (=> (holds ?S1 ?F ?V) (holds ?S2 ?V ?F))))
```
If V is value of S1 of F, then F is value of S2 of V.

**Agent System Implication**: These facets enable *constraint-based reasoning*. An agent can assert constraints and have the ontology agent verify that assertions don't violate them:

```
(assert ontology (:VALUE-TYPE favorite-food Person Edible-Food))
(assert ontology (favorite-food Fred Rock))
→ REFUSE: INCONSISTENT - Rock is not Edible-Food
```

### Standard Slots on Slot Frames

Slots can themselves be represented by frames (slot frames), with properties:

**`:DOMAIN`** - "specifies the domain of the binary relation represented by a slot frame"
```
(=> (:DOMAIN ?S ?C)
    (and (:SLOT ?S) (class ?C)
         (=> (holds ?S ?F ?V) (instance-of ?F ?C))))
```

**`:SLOT-VALUE-TYPE`** - "specifies the classes of which values of a slot must be an instance (i.e., the range)"

**Example**: If `Parent` is a slot frame with `(:DOMAIN Parent Person)` and `(:SLOT-VALUE-TYPE Parent Person)`, this establishes that the Parent relation is Person → Person—both the entity having a parent and the parent itself must be Persons.

**Agent System Implication**: Agents can query for slot properties to validate proposed assertions *before* sending them: "Can I assert that a Company has a Parent? Let me check the domain of Parent..." This enables **defensive coordination**—agents avoid making requests they know will fail.

## Operational Actions: How Agents Actually Use This

### Assertion and Retraction

The specification defines standard actions (pp. 34-35):

**`(ASSERT predicate)`** - "to add, create or define the said predicate in the ontology definition"

**`(RETRACT predicate)`** - "to remove, delete or detach the said predicate"

The ontology agent "is responsible to respect consistency of the ontology and it can refuse... if the result would produce an inconsistent ontology" (p. 35).

**Example from specification** (p. 33-34):
```
(request
  :sender (agent-identifier :name client-agent@foo.com)
  :receiver (set (agent-identifier :name ontology-agent@foo.com))
  :language FIPA-SL2
  :ontology (set FIPA-Ontol-Service-Ontology animal-ontology)
  :content
    (action (agent-identifier :name ontology-agent@foo.com)
            (assert (subclass-of whale mammal))))
```

Agent requests assertion that `whale` is subclass of `mammal` in the `animal-ontology`.

### Query Operations

Agents use standard communicative acts with OKBC predicates:

**`query-if`** - "to query a proposition, which is either true or false"
**`query-ref`** - "to ask for identifying referencing expression, which denotes an object"

**Example** (p. 35-36):
```
(query-ref
  :content (iota ?x (instance-of ?x citrus)))
```
"Give me all instances of the class citrus."

Response:
```
(inform
  :content (= (iota ?x (instance-of ?x citrus)) 
              (orange lemon grapefruit)))
```

**Agent System Implication**: Agents can explore ontologies they've never seen before. No compile-time binding to specific schemas. Runtime semantic discovery.

### Atomic Modifications

For complex updates, `(ATOMIC-SEQUENCE action*)` provides ACID properties (p. 36):

```
(action OA
  (atomic-sequence
    (action OA (assert animal (class mammal)))
    (action OA (retract animal (subclass-of whale fish)))
    (action OA (retract animal (class fish)))
    (action OA (assert animal (subclass-of whale mammal)))))
```

This sequence: create class `mammal`, remove whale from fish, delete fish class, add whale to mammals—all atomically. If any step fails, all steps roll back.

**Why critical**: Ontology modifications can introduce transient inconsistencies. Atomic sequences ensure the ontology is never visible in inconsistent state to other agents.

### Translation Action

`(TRANSLATE expression translation-description)` (p. 36-37):

```
(request
  :content
    (action ontology-agent
      (translate (temperature today (F 50))
        (translation-description
          :from us-english-ontology
          :to italian-ontology))))
```

Response:
```
(inform
  :content (= (result ...) (temperatura oggi (C 10))))
```

The ontology agent performed vocabulary translation (temperature→temperatura, today→oggi) AND semantic translation (Fahrenheit to Celsius).

**Agent System Implication**: Translation is a *first-class operation*, not an offline preprocessing step. Agents can request translation on-demand for specific expressions, enabling dynamic coordination across ontologies.

## Why This Is An Interlingua, Not Just A Representation

### Platform Independence

"The approach used is platform independent. In particular, this specification does not mandate the storage format of ontologies but only the way agents access an ontology service" (p. 1).

Ontologies might be stored in:
- Ontolingua (the native format of OKBC)
- RDF/XML
- OWL
- KIF
- Custom database schemas

But when agents communicate about them, they use OKBC primitives. The ontology agent is responsible for translation between storage format and interlingua.

**Example** (Figure 3, p. 7): OA connects to Ontology Server 1 (Ontolingua) via OKBC protocol, to Server 2 (ODL) via OQL, to Server 3 (XML) via HTTP. Agents see only the OKBC interface.

### Translation at Boundaries

"It is left to agents, then, the responsibility to translate knowledge from the actual knowledge representation language into and out of this interlingua, as needed" (p. 18).

**Design pattern**:
1. Agent has internal knowledge representation (optimized for its reasoning)
2. To communicate with ontology agent: translate to OKBC primitives
3. Ontology agent processes request
4. Response received in OKBC primitives
5. Agent translates back to internal representation

This is exactly like network protocols: optimize internal representation, standardize wire format. TCP/IP doesn't dictate how you store data in memory, just how you send it over the wire.

## Limitations and Boundary Conditions

### Expressivity Bounds

The OKBC model is deliberately limited: "supports an object-oriented representation... provides a set of representational constructs commonly found in object-oriented knowledge representation systems" (p. 18).

It cannot express:
- Complex modal logics
- Probabilistic reasoning primitives
- Temporal logics with sophisticated operators
- Non-monotonic reasoning constructs

If an ontology uses these, it must be translated to OKBC approximation for communication, with possible information loss.

### Computational Intractability

"The problem of deciding if two logical theories have relationships to each other, is in general computationally very difficult. For instance, it can quickly become undecidable if two ontologies are identical when the expressive power of the ontologies concerned is high enough" (footnote, p. 8).

The OKBC model provides the *vocabulary* to state ontological relationships, but not necessarily the *algorithms* to compute them automatically.

### Default Values Are Underspecified

"OKBC does not require a KRS to be able to determine the logical consistency of a KB, nor does it provide a means of explicitly overriding default values. Instead, OKBC leaves the inheritance of default values unspecified" (p. 22).

This is pragmatic but limits interoperability: different ontology agents might handle default reasoning differently, leading to divergent inferences from the same ontology.

## Application to Agent System Design

### Design Pattern: Capability Discovery Through Meta-Queries

Agents can query what an ontology agent can do:

```
(query-ref
  :content (iota ?ont 
    (and (ontol-relationship my-ontology ?ont ?level)
         (or (= ?level Equivalent)
             (= ?level Strongly-Translatable)))))
```
"What ontologies are equivalent or strongly translatable to mine?"

This enables **dynamic capability-based routing**: agents discover at runtime which ontology agents can provide needed services.

### Design Pattern: Lazy Ontology Loading

Instead of loading entire ontologies upfront:
1. Agent encounters unfamiliar term in message
2. Queries ontology agent: `(query-ref :content (iota ?def (definition ?term)))`
3. Caches definition
4. Proceeds with original task

This keeps agents lightweight while maintaining semantic precision.

### Design Pattern: Constraint-Based Validation

Before executing actions, agents validate against ontological constraints:

```
;; Check if proposed action violates cardinality
(query-if
  :content
    (and (:CARDINALITY assigned-task Person 1)
         (assigned-task Person task1)
         (assigned-task Person task2)))
→ false (cardinality would be 2, violating constraint)
```

This prevents constraint violations from propagating through the system.

## Distinctive Contribution: Meta-Knowledge as Service

Most ontology specifications treat meta-knowledge as documentation: "Here's what classes and slots mean, for human understanding." The FIPA specification treats meta-knowledge as **executable infrastructure**:

- Agents don't just read about ontologies, they query, modify, and reason about them
- The meta-ontology isn't just a schema, it's an API
- Ontological operations are first-class actions in agent communication protocols

This shift—from ontology as static artifact to ontology as runtime service—is what enables true semantic interoperability in open multi-agent systems. Agents can adapt to ontologies they've never encountered, negotiate semantic bridges, and coordinate despite heterogeneity, all because the meta-knowledge infrastructure is operational, not just documentary.