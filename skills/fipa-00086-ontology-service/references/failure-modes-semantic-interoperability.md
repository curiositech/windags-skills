# Failure Modes in Semantic Coordination: What the Specification Warns About

## The Core Insight: Silent Semantic Failure Is Catastrophic

The FIPA specification's treatment of failure modes reveals a sophisticated understanding: **syntactic success with semantic failure is worse than explicit failure**. When agents think they're communicating successfully but have divergent interpretations, errors propagate silently through the system, compounding until they cause catastrophic failures.

The specification designs explicit failure mechanisms into every layer of semantic coordination, prioritizing **fail-fast, fail-explicit** over "best effort" semantic approximation.

## Failure Mode 1: Syntactic Compatibility, Semantic Divergence

### The Problem

"Two ontologies whose formal models overlap may still fail to enable communication if their intended models do not overlap" (p. 46-47). 

Agents can exchange messages successfully—syntax parses, types match, protocols complete—while meaning diverges catastrophically.

### Concrete Examples

**The Coriander Trap** (p. 11):
- Chinese cooking ontology: Coriander ∈ Parsley (leaves used)
- European cooking ontology: Coriander ∈ Pepper (seeds used)
- Both ontologies include "Coriander" token
- Syntactic matching declares them compatible
- Semantic divergence: Chinese agent expects leaves, European expects seeds

**Failure manifestation**: Agent A requests "add coriander to soup," Agent B uses seeds instead of leaves, soup is ruined. Both agents believe they communicated successfully—they used same term, followed same protocol. The failure was invisible until execution.

**The Block World Illusion** (Figure 7, p. 44):
- Two agents observe different block arrangements
- Both define "above" relation
- Syntactic definitions might be identical
- Conceptualizations diverge: different spatial configurations
- Agents make incompatible inferences about what's above what

**Failure manifestation**: Agent A asks Agent B to "pick up block above block C," Agent B picks up wrong block. Both believe they agreed on which block—they used same "above" relation.

### How the Specification Prevents This

**1. Explicit Conceptualization Distinction**

The specification formally separates ontology (vocabulary + axioms) from conceptualization (intended models): "A conceptualization C = <D, W, ℜ> is a tuple where D is a domain, W is the set of all relevant states of affairs, and ℜ is a set of conceptual relations" (p. 44).

This enables agents to reason: "Do our intended models overlap?" rather than "Do our axioms match?"

**2. Relationship Levels with Explicit Semantics**

Rather than binary "compatible/incompatible," specification defines six relationship levels (pp. 8-11), each with precise semantic guarantees:
- Identical: Same intended models (physically identical ontologies)
- Equivalent: Same intended models (different syntax)
- Extension: Superset of intended models
- Strongly-Translatable: Lossless mapping between models
- Weakly-Translatable: Lossy but consistent mapping
- Approximately-Translatable: Mapping with possible inconsistency

**Failure prevention**: Agents check relationship level before coordination. If level insufficient for intended action, refuse early.

**3. Top-Level Ontology Requirement**

"It seems more convenient to agree on a single top-level ontology rather than relying on agreements based on the intersection of different ontologies" (p. 47).

By requiring shared conceptualization at abstract level (space, time, objects, events), specification ensures that domain-specific divergences are bounded—agents might disagree about what constitutes "coriander" but agree on what constitutes "ingredient" and "plant-part."

## Failure Mode 2: Invisible Information Loss

### The Problem

Weak translation succeeds syntactically but loses semantic information silently. Receiving agent doesn't know what was lost, makes decisions based on incomplete understanding.

### Concrete Example

**French→English Fruit Ontology** (p. 10):
- French: Fruit→{Pomme, Citron, Orange, Poire, Pamplemousse}, Agrume→{Citron, Orange, Pamplemousse}
- English: Fruit→{Apple, Lemon, Orange}
- Translation: Pomme→Apple, Citron→Lemon, Orange→Orange
- Lost: Poire (pear), Pamplemousse (grapefruit), Agrume (citrus category)

**Failure manifestation**: French agent requests "citrus fruits excluding pamplemousse." English translation receives "citrus fruits" with no exclusion clause—pamplemousse doesn't exist in English ontology, exclusion is silently dropped. English agent delivers oranges, lemons, AND grapefruits (if available), violating French agent's constraint.

**Severity**: French agent believes exclusion was communicated. English agent has no indication exclusion exists. No error signal. Failure discovered only when results don't match expectations—long after the communication that caused it.

### How the Specification Addresses This

**1. Explicit Weak-Translatable Relationship**

"This level relates two ontologies Osource and Odest when it is possible to translate from Osource to Odest, even if with a possible loss of information... Nevertheless, a weak translation should not introduce any inconsistency" (p. 10).

By labeling relationship as Weakly-Translatable, specification makes information loss **explicit metadata**. Agents know translation is lossy before using it.

**2. Action-Type Constraints**

Specification implies constraints on what actions are appropriate for different translation levels:

| Relationship | Appropriate Actions | Inappropriate Actions |
|--------------|---------------------|----------------------|
| Strongly-Translatable | Commands, commitments, contracts | None |
| Weakly-Translatable | Queries, information requests, monitoring | Commands requiring precision, legal commitments |
| Approx-Translatable | Confirmation-loop communication | Autonomous action, critical decisions |

**Design pattern**: Agent checks relationship level, refuses to send critical actions over weak translation:
```
if (action_type == COMMAND and
    ontol_relationship(my_ont, partner_ont) == Weakly-Translatable):
    refuse(reason="Weak translation insufficient for command")
    propose_alternative(negotiate_shared_ontology)
```

**3. Loss Reporting (Implied, Not Normative)**

While specification doesn't mandate loss reporting, it enables it: translation services could return:
```
(inform
  :content (= (translate ...) result-expression)
  :additional-info (lost-concepts (set Pamplemousse Poire Agrume)))
```

This makes information loss **observable**, enabling agents to decide if partial communication is acceptable.

## Failure Mode 3: Inconsistency Introduction

### The Problem

Approximate translation not only loses information but actively introduces false statements. Receiving agent infers conclusions that contradict sender's intent.

### Concrete Example

**Approximate Translation with Inconsistency** (p. 11):
- Source ontology: Coriander ∈ Parsley, has-property(Coriander, edible-part, leaves)
- Target ontology: Coriander ∈ Pepper, has-property(Coriander, edible-part, seeds)
- Translation maps Coriander→Coriander (same term)
- But properties are contradictory: leaves ≠ seeds

**Failure manifestation**: Source agent asserts "Coriander adds fresh flavor" (true for leaves). Target agent interprets "Coriander adds fresh flavor" under seeds conceptualization, might infer "seeds provide fresh flavor" (false, seeds provide pungent spicy flavor). Target makes plans based on wrong flavor profile.

**Severity**: Not just information loss (we could work around that) but **information corruption**. Target agent has *false* beliefs introduced by translation, not just incomplete beliefs.

### How the Specification Addresses This

**1. Explicit Approx-Translatable Level**

"Two ontologies Osource and Odest are said to be related with level Approx-Translatable if they are Weakly-Translatable with introduction of possible inconsistencies, for example, some of the relations become no more valid and some constraints do not apply anymore" (p. 11).

**Critical property**: This is the **weakest** relationship level. Specification makes clear this is last-resort coordination, not default.

**2. Confirmation Protocol Requirement**

For approximate translation, specification implies mandatory confirmation:
- Send message through approximate translation
- Receiver queries back to confirm understanding
- Sender verifies interpretation
- Only then proceed with action

**Example protocol**: