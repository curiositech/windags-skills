---
license: Apache-2.0
name: fipa-00086-ontology-service
description: Framework for coordinating meaning across autonomous agents that use different conceptual models, vocabularies, and knowledge representations. Treats ontologies as first-class negotiable resources rather than hardcoded implementation details.
category: Research & Academic
tags:
  - fipa
  - ontology
  - agents
  - knowledge-representation
  - standards
---

# SKILL: FIPA Ontology Service — Semantic Coordination for Multi-Agent Systems

## Decision Points

### Mismatch Type → Coordination Strategy

```
Agent A & B have semantic mismatch:

├─ Syntactic mismatch (different formats/protocols)?
│  └─ NOT an ontology problem → use protocol adapters/formatters
│
├─ Same ontology by reference?
│  └─ SUCCESS → direct communication, no translation needed
│
├─ Different ontologies, assess relationship:
│  ├─ Equivalent conceptualizations, different vocabularies?
│  │  └─ Create bidirectional term mapping → strong translatability
│  │
│  ├─ One ontology subsumes the other?
│  │  ├─ Task requires specialized concepts → use richer ontology
│  │  └─ Task works with general concepts → use simpler ontology
│  │
│  ├─ Partial overlap with acceptable information loss?
│  │  ├─ Task tolerates approximation → implement lossy translation
│  │  └─ Task requires precision → negotiate shared ontology or mediator
│  │
│  └─ No meaningful translation possible?
│     ├─ Find mediating ontology both can translate to
│     ├─ Renegotiate task to use compatible concepts
│     └─ ESCALATE: coordination impossible at ontology level
```

### Explicit vs Implicit Ontology Choice

```
System requirements analysis:

Will unknown agents join at runtime?
├─ YES → EXPLICIT ontologies required
│  └─ Need discovery/negotiation infrastructure
│
└─ NO → Analyze further:
   │
   ├─ Performance critical (real-time, embedded)?
   │  └─ IMPLICIT → hard-code shared conceptualization
   │
   ├─ Requirements likely to evolve?
   │  └─ EXPLICIT → enable runtime adaptation
   │
   └─ Stable, closed system?
      └─ IMPLICIT → optimize for execution speed
```

### Integration Approach Selection

```
Integrating existing heterogeneous systems:

Proposed approach is "find ontology intersection"?
├─ YES → RED FLAG: Bottom-up integration
│  ├─ Syntactic overlap ≠ semantic overlap
│  ├─ Risk of silent semantic failures
│  └─ ALTERNATIVE: Top-down foundation approach
│
└─ NO → Assess current approach:
   │
   ├─ Starting with shared conceptual primitives?
   │  └─ GOOD → verify intended models align
   │
   ├─ Mapping to existing standard ontology?
   │  └─ GOOD → validate translation completeness
   │
   └─ Building custom mediating ontology?
      └─ VERIFY: covers both systems' essential concepts
```

## Failure Modes

### 1. Rubber Stamp Translation
**Symptoms**: Systems exchange messages successfully, but agents take incompatible actions based on "translated" content
**Detection Rule**: If agents claim successful communication but exhibit contradictory behaviors, check for semantic misalignment despite syntactic compatibility
**Root Cause**: Assumed same vocabulary means same conceptualization
**Fix**: Verify intended models, not just formal models; implement semantic validation checks

### 2. Intersection Illusion
**Symptoms**: Integration project finds "common concepts" between ontologies but coordination fails mysteriously during testing
**Detection Rule**: If ontology intersection contains terms with identical names but agents interpret them differently, this is intersection illusion
**Root Cause**: Bottom-up integration assuming syntactic overlap guarantees semantic overlap
**Fix**: Switch to top-down approach; establish shared conceptual foundation first

### 3. Perfect Translation Trap
**Symptoms**: Integration project stalls because "perfect" translation between ontologies is impossible to achieve
**Detection Rule**: If project blocks on achieving lossless bidirectional translation when task only requires approximate coordination
**Root Cause**: Over-engineering translation requirements beyond task needs
**Fix**: Match translation quality to task requirements using hierarchy (identical → equivalent → strongly translatable → weakly translatable → approximate)

### 4. Silent Semantic Drift
**Symptoms**: System appears to work initially but produces increasingly incorrect results over time
**Detection Rule**: If coordination quality degrades without syntax errors, check for conceptualization divergence
**Root Cause**: Implicit ontologies evolving independently without coordination
**Fix**: Make ontologies explicit; implement semantic version control and change notification

### 5. Ontology Service Neglect
**Symptoms**: Each agent implements its own translation logic, creating N² complexity and inconsistent translations
**Detection Rule**: If translation code is duplicated across agents and produces different results for same inputs
**Root Cause**: Treating ontology coordination as per-agent concern rather than system infrastructure
**Fix**: Implement centralized Ontology Agent service; standardize on OKBC interlingua for meta-knowledge operations

## Worked Examples

### Example 1: Weather Data Integration

**Scenario**: Emergency response system needs weather data from two sources: MeteoService (European, Celsius, wind in km/h) and WeatherAPI (US, Fahrenheit, wind in mph).

**Symptom**: Both services provide "temperature" and "wind_speed" but emergency system makes wrong evacuation decisions.

**Diagnosis Process**:
1. Check syntactic compatibility ✓ (both use JSON)
2. Check ontology relationship: Different vocabularies, same conceptualization (weather measurements)
3. Assess translation requirement: Emergency system needs "hot enough to cause fire risk" (approximate translation sufficient)

**Decision Navigation**:
- Mismatch type: Different ontologies, partial overlap with acceptable loss
- Task tolerates approximation: YES (fire risk threshold has safety margins)
- Strategy: Implement lossy translation with explicit bounds

**Solution**: Create translation service with conversion functions and explicit error bounds (±2°C, ±5km/h). Emergency system uses "hot enough for fire risk" threshold that accounts for translation uncertainty.

**Expert vs Novice**: 
- Novice would try to achieve perfect translation or assume same field names mean same semantics
- Expert recognizes approximate translation suffices for task and implements explicit error bounds

### Example 2: Multi-Organization Agent Coordination

**Scenario**: Healthcare agents from Hospital-A (using HL7 FHIR) and Research-Lab (custom medical ontology) need to coordinate patient data for clinical trial.

**Symptom**: Agents exchange messages but Research-Lab misinterprets "patient status" leading to wrong treatment group assignments.

**Diagnosis Process**:
1. Both claim FHIR compatibility but Research-Lab extends concepts differently
2. Check conceptualization alignment: Different interpretations of "patient status" (Hospital: administrative, Research: clinical)
3. Translation hierarchy assessment: Weakly translatable (Hospital→Research works, reverse loses information)

**Decision Navigation**:
- Mismatch type: Extension relationship with semantic drift
- Information loss acceptable: NO (clinical trial requires precision)
- Strategy: Negotiate shared subset or use mediating ontology

**Solution**: Deploy Ontology Agent with mediating vocabulary covering both systems' essential concepts. Both agents translate to/from mediator rather than direct translation.

**Trade-offs Discussed**:
- Performance cost of mediated translation vs. risk of semantic errors
- Complexity of three-way ontology maintenance vs. benefits of precision
- Option to constrain Hospital system to Research concepts vs. developing comprehensive mediator

## Quality Gates

- [ ] Ontology relationships formally verified (not assumed based on syntax similarity)
- [ ] Translation completeness validated for task-essential concepts
- [ ] Semantic failure detection mechanisms implemented (not just syntactic error handling)
- [ ] Error bounds established for approximate translations with explicit uncertainty propagation
- [ ] Intended model alignment confirmed through test cases, not just formal model compatibility
- [ ] Runtime ontology negotiation protocols specified if system supports dynamic agent joining
- [ ] Escalation paths defined for untranslatable semantic mismatches
- [ ] Performance impact of explicit ontologies measured against coordination benefits
- [ ] Conceptualization vs ontology vs knowledge base layers explicitly distinguished in design
- [ ] Silent semantic failure prevention measures in place (validation, bounds checking, compatibility verification)

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- **Syntactic data format conversion** → Use data mapping/ETL tools instead
- **Database schema integration** → Use database integration patterns instead  
- **API versioning and compatibility** → Use API evolution strategies instead
- **Performance optimization of knowledge queries** → Use database optimization techniques instead
- **Natural language processing and understanding** → Use NLP/NLU frameworks instead
- **Closed systems with stable, shared conceptual models** → Use direct integration patterns instead
- **Real-time systems where translation overhead is prohibitive** → Use pre-compiled shared ontologies instead

**When to delegate**:
- For syntactic transformations: Use `data-transformation-pipelines` skill
- For performance-critical knowledge operations: Use `knowledge-base-optimization` skill  
- For natural language semantic understanding: Use `semantic-nlp-processing` skill
- For API design and evolution: Use `api-design-patterns` skill

This skill focuses specifically on **coordination between autonomous agents with different conceptual models**. It is not a general-purpose semantic technology or data integration solution.