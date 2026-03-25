# Ontology Relationships as Action and Coordination Constraints

## Beyond Vocabulary: Relationships as Operational Constraints

The FIPA specification defines ontology relationships not as abstract logical properties but as **constraints on what coordination strategies agents can use**. Each relationship level determines what kinds of actions are reliable, what communications will succeed, and what kinds of failures are possible.

This is a fundamental shift: ontology relationships aren't metadata for documentation—they're operational parameters for agent decision-making.

## The Six Relationship Levels As Decision Rules

### 1. Identical: No Translation Infrastructure Needed

When `(ontol-relationship O1 O2 Identical)` holds, agents can:

**Direct communication**: No translation layer required. If Agent A sends a message using O1 vocabulary, Agent B using O2 can interpret directly.

**Shared reasoning**: Inferences made by A about O1 are valid for B about O2. No semantic drift.

**Constraint**: Must verify physical identity, not just logical equivalence. "Same vocabulary, axiomatization, and representation language—physically identical" (p. 9).

**Failure mode**: False positives if names differ. Ontology agent must track that "O1" and "O2" are actually names for same file/resource.

**Example implementation**:
```
(query-if
  :content (ontol-relationship my-ontology partner-ontology Identical))
→ true
;; Proceed with direct communication, no translation needed
```

### 2. Equivalent: Syntax Translation Only

When `(ontol-relationship O1 O2 Equivalent)` holds, agents can:

**Bidirectional communication** with format translation only (KIF↔RDF, Ontolingua↔XML).

**Semantic equivalence**: "Everything that is provable or deductible from O1 will be provable from O2 and vice versa" (p. 9).

**Constraint**: "Two ontologies O1 and O2 are said to be equivalent whenever they share the same vocabulary and the same logical axiomatization, but possibly are expressed using different representation languages" (p. 9).

**Critical property**: `Equivalent(O1,O2) ⇒ Strongly-Translatable(O1,O2) ∧ Strongly-Translatable(O2,O1)` (p. 11).

**Failure mode**: Different ontology servers with different deduction capabilities may produce different results despite equivalent ontologies (footnote, p. 9).

**Action constraint for agents**: Can engage in symmetric bidirectional coordination without information loss, but cannot assume identical inferential capabilities.

### 3. Extension: Asymmetric Communication Protocols

When `(ontol-relationship O1 O2 Extension)` holds (O1 extends O2), agents must adopt **asymmetric protocols**:

**Agent with O2 can initiate requests using O2 vocabulary**: Agent with O1 understands because "all the symbols that are defined within the O2 ontology are found in the O1 ontology, with the very important restriction that the properties expressed between the entities in the O2 ontology are conserved in the O1 ontology" (p. 8).

**Agent with O1 must be conservative in unsolicited communications**: Cannot use O1-specific concepts that don't exist in O2.

**Example from specification** (p. 9): O1 defines Fruit→{Apple, Lemon, Orange}. O2 extends with Citrus: Fruit→Citrus→{Lemon, Orange}. Agent using O1 understands messages about Citrus because Citrus properties are preserved in O1, but should not spontaneously mention Citrus when talking to O1-only agent.

**Design pattern for protocol selection**:
```
if (ontol-relationship partner-ontology my-ontology Extension):
    # Partner's ontology extends mine
    # I can drive conversation, partner must follow my vocabulary
    initiate_request_in_my_terms()
elif (ontol-relationship my-ontology partner-ontology Extension):
    # My ontology extends partner's
    # Partner drives, I adapt to their vocabulary
    wait_for_partner_request()
    respond_using_partner_terms()
else:
    # No extension relationship, need translation or negotiation
    negotiate_shared_ontology()
```

**Failure mode**: Agent with extended ontology forgets to restrict vocabulary, sends message using extension-specific concepts, receiver doesn't understand. This is detectable—receiver sends `not-understood`.

### 4. Strongly-Translatable: Guaranteed Lossless Translation

When `(ontol-relationship Osource Odest Strongly-Translatable)` holds, agents can:

**Use translation as proxy**: Agent A (Osource) can communicate with Agent B (Odest) through translation service, with **guarantee of no information loss**.

**Bidirectional communication** if both directions are strongly-translatable: `Strongly-Translatable(O1,O2) ∧ Strongly-Translatable(O2,O1)`.

**Formal guarantees** (p. 10):
1. Vocabulary of Osource can be totally translated to vocabulary of Odest
2. Axiomatization of Osource holds in Odest
3. No loss of information
4. No introduction of inconsistency

**Action constraint**: Agents can engage in complex multi-step protocols with strong translation, because every step preserves full information. Can commit to contracts, make promises, establish obligations—semantic content is preserved.

**Example protocol with translation**:
```
Agent A: (request (action B (purchase item X)))
         [Translated by OA: English→French ontology]
Agent B: (agree (action B (purchase item X)))
         [Translated by OA: French→English ontology]
Agent A: (inform (paid payment-id 12345))
         [Translated]
Agent B: (inform (shipped tracking-id ABC))
         [Translated]
```

Because translation is strongly-translatable in both directions, no semantic drift occurs—the commitment established at step 1 is the commitment fulfilled at step 4.

**Failure mode**: Translation service fails (network, server down). But semantic failures don't occur—the relationship guarantees correctness when translation succeeds.

### 5. Weakly-Translatable: Communication With Known Loss

When `(ontol-relationship Osource Odest Weakly-Translatable)` holds, agents must:

**Track what information is lost**: "Some terms or relationships from Osource will be possibly simplified when translated to Odest... some terms or relationships will not be translatable to Odest, because they do not appear in the Odest axiomatizations" (p. 10).

**Never use for commitments or commands**: Information loss means you cannot be sure what the receiver understood.

**Appropriate for**:
- Information retrieval (query with detailed vocabulary, receive simpler results)
- Monitoring (understand status in simpler terms than original)
- Advisory communication (suggestions, not requirements)

**Example from specification** (p. 10): French fruit ontology has Pamplemousse (grapefruit), Poire (pear), and Agrume (citrus category). English ontology doesn't. When translating French→English, these concepts are lost. Agent must know this before using translation for critical coordination.

**Action constraint for agents**:
```
if (ontol-relationship my-ontology partner-ontology Weakly-Translatable):
    # Can send queries, can receive information
    allowed_actions = [query-ref, query-if, inform, request-information]
    # Cannot send commands or make commitments
    prohibited_actions = [request-action, agree, promise, commit]
```

**Failure mode**: Agent treats weak translation as strong, makes commitments based on weakly-translated information, misunderstanding occurs. This is a **design failure**, not a runtime failure—weak translation works as specified, but agent used it inappropriately.

### 6. Approximately-Translatable: Confirmation Required

When `(ontol-relationship Osource Odest Approx-Translatable)` holds, agents must:

**Always confirm understanding**: "Information loss and possible inconsistency introduction" (p. 11) means translation may be semantically incorrect.

**Use only when no alternative exists**: This is the coordination strategy of last resort.

**Example from specification** (p. 11): Coriander in Chinese cooking (parsley, leaves used) vs. European cooking (pepper, seeds used). Properties diverge after translation—"some of the properties expressed in the ingredients-for-chinese-cooking ontology do not hold any more in the ingredients-for-european-cooking ontology and vice versa."

**Confirmation protocol pattern**:
```
Agent A: (request (action B (use-ingredient Coriander)))
         [Approx translated: Chinese-cooking → European-cooking]
Agent B: (query-if (use-ingredient Coriander :part leaves))
         # "You said Coriander, did you mean the leaves?"
Agent A: (confirm true)
Agent B: (refuse (action ...) "Cannot use leaves, only have seeds")
```

The confirmation loop is **mandatory**—without it, Agent B would execute the wrong action (use seeds when Agent A meant leaves).

**Action constraint**: Approximately-translatable relationships should trigger **explicit negotiation mode**: agents don't assume understanding, they verify every step.

## Meta-Level Constraint: Relationship Hierarchy

The specification defines: "Strongly-Translatable ⇒ Weakly-Translatable ⇒ Approx-Translatable" (p. 11).

**Operational meaning**: If an agent discovers its planned action requires weak translation, it can check if strong translation is available first. If action requires strong but only approximate is available, it must abort or renegotiate.

**Search strategy for coordination**:
```
def find_coordination_strategy(my_ont, partner_ont):
    if ontol_relationship(my_ont, partner_ont, Identical):
        return DirectCommunication
    elif ontol_relationship(my_ont, partner_ont, Equivalent):
        return SyntaxTranslation
    elif ontol_relationship(my_ont, partner_ont, Extension):
        return AsymmetricProtocol
    elif ontol_relationship(my_ont, partner_ont, Strongly-Translatable):
        return StrongTranslation
    elif ontol_relationship(my_ont, partner_ont, Weakly-Translatable):
        if action_criticality == CRITICAL:
            return Abort  # Weak translation insufficient
        else:
            return WeakTranslationWithLossTracking
    elif ontol_relationship(my_ont, partner_ont, Approx-Translatable):
        if action_criticality == CRITICAL:
            return Abort
        else:
            return ApproximateTranslationWithConfirmation
    else:
        return NegotiateSharedOntology
```

## Interaction Protocol: Negotiating Shared Ontology

The specification provides protocol for when no satisfactory relationship exists (p. 40):

**Scenario 2 from specification** (p. 4): Agent SP provides service using `sell-wholesale-products` ontology. Agent C only knows `sell-products`. Three protocols possible:

**Protocol 1: Direct Query**
```
Agent C → Agent SP: (query-ref (supported-ontologies ?ont))
Agent SP → Agent C: (inform (supported-ontologies (set sell-products)))
Agent C → Agent SP: (request (action SP ...) :ontology sell-products)
```

**Protocol 2: Ontology Agent Mediation**
```
Agent C → DF: (search (OAs supporting (domain Commerce)))
DF → Agent C: (inform (set OA1))
Agent C → OA1: (query-ref (ontol-relationship sell-wholesale-products ?ont ?level))
OA1 → Agent C: (inform (= ?ont sell-products, ?level Extension))
Agent C → Agent SP: (request ... :ontology sell-products)
```

**Protocol 3: Direct Ontology Query**
```
Agent C → DF: (search (OA managing sell-wholesale-products))
DF → Agent C: (inform OA1)
Agent C → OA1: (query-ref (ontol-relationship sell-wholesale-products ?ont ?level))
OA1 → Agent C: (inform Extension of sell-products)
Agent C → Agent SP: (propose-shared-ontology sell-products)
Agent SP → Agent C: (agree)
[Communication proceeds]
```

**Design principle**: Relationship discovery is an explicit coordination activity, not a background process. Agents actively negotiate what ontology to use, based on available relationships.

## Error Handling: Refusing Based on Relationships

The specification defines refusal reasons (p. 38-39):

**`(READ-ONLY <frame-name>)`**: Ontology agent refuses modification that would violate immutability constraint.

**`(INCONSISTENT <frame-name>)`**: Proposed action would violate ontological consistency.

**Agent-level refusals based on relationships**:
```
(refuse
  :content ((action ...) unauthorised)
  :reason "Weak translation insufficient for command actions")
```

**Design pattern**: Agents inspect ontology relationships before sending requests, refuse if relationship level is insufficient for action type. This makes coordination failures **explicit and early** rather than implicit and late.

## Distinctive Insight: Relationships as Type System

The FIPA ontology relationship levels function like a **type system for agent coordination**:

- **Identical/Equivalent**: Direct communication "type checks"—no marshaling needed
- **Extension**: Subtype relationship—extended ontology can always be used where base ontology expected
- **Strongly-Translatable**: Isomorphic types—perfect translation exists
- **Weakly-Translatable**: Lossy conversion—information must be discarded
- **Approximately-Translatable**: Unsafe cast—may fail at runtime, requires checking

Agents use relationship information the same way programs use type information: to **determine what operations are valid before attempting them**, failing fast when type mismatch is detected.

This is the operational core of semantic interoperability—not solving the general problem of ontology alignment, but providing agents with enough information about alignment quality to make safe coordination decisions.