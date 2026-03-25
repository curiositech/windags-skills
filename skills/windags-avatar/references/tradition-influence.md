# Tradition Influence Map

What each of the 10 intellectual traditions contributed to WinDAGs V3, what they conceded, and their preserved dissenting positions.

---

## 1. BDI Architecture (Beliefs-Desires-Intentions)

**Primary influence on**: ADR-003, ADR-007, ADR-012, ADR-024 (4 ADRs)

**What it brought**:
- Commitment strategies (COMMITTED/TENTATIVE/EXPLORATORY) with reconsideration triggers
- Epistemic annotation depth graduated by commitment level
- Falsification costs for exploratory nodes
- Context conditions as hard filter in skill selection cascade
- Self-evaluation reform: split process self-check from outcome assessment

**What it conceded**:
- Per-task interleaving is too expensive for Phase 1. Accepted batch-with-preemption (ADR-006).
- Full epistemic annotation on every node is excessive. Accepted graduated depth (ADR-003).

**Preserved dissent**: D-2 — Per-task interleaving may prove correct at scale. Revisit if mid-batch preemption rates exceed 50%.

---

## 2. MAS Coordination (Multi-Agent Systems)

**Primary influence on**: ADR-008, ADR-013, ADR-010 (3 ADRs)

**What it brought**:
- Five edge protocol types (data-flow, contract, request, subscription, auction)
- Seven mutation types as first-class operations with saga classification
- Conway's Law as empirical heuristic for topology validation
- Organizational failure modes as a distinct failure category

**What it conceded**:
- Capability structure should validate decomposition, not drive it (ADR-001).
- Rich coordination models can wait for Phase 2 (ADR-010). MAS explicitly stated in Phase 3: "MAS's Phase 1 scope recommendation was wrong."
- Data-flow as strong default (80%+ of edges) is correct (ADR-008).

**Preserved dissent**: D-1 (capability-first decomposition, revisit at >30% revision rate), D-3 (rich default protocols, revisit at >40% manual upgrade), D-4 (aggressive phasing, revisit on competitive pressure).

---

## 3. NDM/RPD (Naturalistic Decision-Making / Recognition-Primed Decision)

**Primary influence on**: ADR-002, ADR-009, ADR-019, ADR-033 (4 ADRs)

**What it brought**:
- Pattern recognition fast path: if confidence >= 0.8, skip full cascade with post-hoc validation
- The "competent stage" danger zone: skills that are good enough to be trusted but not good enough to be reliable
- Stage-gated K-factors (novice=40, competent=32, proficient=24, expert=16)
- PreMortem conditionality: always lightweight, escalate on low confidence
- Pricing matrix intuitions (Envelope in free tier)

**What it conceded**:
- Pattern recognition alone is insufficient for cold start. Accepted four-layer cascade (ADR-002).
- NDM acknowledged that "in cold-start conditions, NDM/RPD systems are indistinguishable from novice systems" — this is an honest admission.

---

## 4. HTN Decomposition (Hierarchical Task Networks)

**Primary influence on**: ADR-001, ADR-005, ADR-006, ADR-010, ADR-011, ADR-015, ADR-018, ADR-029 (8 ADRs — most of any tradition)

**What it brought**:
- Three-pass decomposition protocol (structure, capability, topology)
- Planning-scheduling separation as distinct cognitive operations
- SHOP2 empirical data: 899/904 problems solved with domain-specific methods
- 34.78% cascading task failure rate for static decomposition vs. 4.35% for dynamic
- Method libraries and domain meta-skills
- P*C stopping rule for expansion depth estimation
- Visualization chunking thresholds

**What it conceded**:
- Full upfront planning is an optimization, not the default. Vague nodes are primary (Principle 9).
- Method-level learning may converge slowly. Accepted phased activation.

---

## 5. Resilience Engineering

**Primary influence on**: ADR-009, ADR-017, ADR-023, ADR-030 (4 ADRs)

**What it brought**:
- Five-layer resilience framework (prevention, detection, containment, recovery, adaptation)
- The Envelope quality layer (execution stress tracking, deterministic, zero cost)
- Near-miss logging at 10% margin
- Circuit breaker architecture at three independent levels
- Failure information prominence: resilience overlay default-on during execution
- PreMortem insistence (always run, at least lightweight)

**What it conceded**:
- Full 6 circuit breaker types are overkill for Phase 1. Accepted 3 exposed, full taxonomy internal.

---

## 6. DSPy Compiler Optimization

**Primary influence on**: ADR-007, ADR-011 (2 ADRs)

**What it brought**:
- Signature-based skill selection (output schema compatibility as hard filter)
- Compilation from execution traces: background optimization that improves skills over time
- The idea that prompt optimization is a compilation problem, not a craft
- Measured sycophancy bias data (0.749 sycophancy rate in pairwise comparison)

**What it conceded**:
- Compilation is Phase 2+, not Phase 1. Phase 1 is elicitation-first.
- Signature compatibility alone is insufficient. Accepted five-step cascade.

---

## 7. Cognitive Task Analysis (CTA)

**Primary influence on**: ADR-027 (1 ADR)

**What it brought**:
- CDM (Critical Decision Method) probes for structured knowledge elicitation
- Cognitive telemetry events for tracking reasoning quality
- ShadowBox methodology for expert-novice calibration
- The insight that tacit knowledge is the hardest to encode and the most valuable

**What it conceded**:
- Mandatory cognitive telemetry on all nodes is too expensive (15-20% token overhead). Accepted opt-in with mandatory-on-failure.

**Preserved dissent**: D-5 — mandatory telemetry. Revisit if process quality scores show <0.3 correlation with outcomes after 1000 executions.

---

## 8. Polya Problem-Solving

**Primary influence on**: ADR-021, ADR-015 (2 ADRs)

**What it brought**:
- Looking Back protocol: four questions after every execution (Q1: contract satisfied? Q2: unstated assumptions? Q3: generalizable method? Q4: broader connections?)
- The halt gate concept: "Can I restate the problem in my own words?" → if not, stop
- Principal parts analysis: unknown, data, conditions, output type
- Auxiliary problems: if the main problem is too hard, solve a related simpler one
- The escalation ladder structure (fix node → diagnose structure → generate alternative → fix topology → human)

**What it conceded**:
- All four Looking Back questions on every execution is expensive. Accepted tiered: Q1-Q2 mandatory, Q3-Q4 conditional.

---

## 9. Lakatosian Philosophy of Science

**Primary influence on**: ADR-022, ADR-025, ADR-026, ADR-035 (4 ADRs)

**What it brought**:
- Monster-barring detection: skills that appear to improve by excluding edge cases
- FORMALJUDGE integration: selective (binary for contracts, holistic for creative)
- Quality as vector, not scalar: "there exists no total ordering for quality" → multi-dimensional Elo
- Progressive vs. degenerating research programme classification for skills
- Kuhnian crisis detection retained from V2 (PSI >= 0.25, Hellinger distance)
- The moat architecture: evaluation data > skills > formal guarantees (concentric rings)

**What it conceded**:
- Not every evaluation needs FORMALJUDGE's rigor. Accepted selective application.

---

## 10. Distributed Systems Theory

**Primary influence on**: ADR-004, ADR-006, ADR-010, ADR-020, ADR-036 (5 ADRs)

**What it brought**:
- Topology validation as Pass 3 of decomposition
- CRDT-ready data structures (G-Counter-compatible) from day one for future distribution
- Phased coordination model introduction (Phase 1 DAG-only, Phase 2 +Team, Phase 3 +Market)
- Two-tier capability schema (behavioral contract + cognitive profile)
- Failure classification on the system layer (omission, crash, crash-recovery, Byzantine)
- Circuit breaker independence guarantees

**What it conceded**:
- BFT quorum (2f+1 independent evaluators) breaks with LLMs from the same family. The independence assumption is violated. Accepted layered Byzantine handling instead.
- Conway's Law is empirical, not mathematical. Accepted as strong heuristic, not formal constraint.

**Preserved dissent**: D-6 — formal BFT quorum. Revisit if model families become sufficiently different that independence can be empirically demonstrated.

---

## The Two Universal Agreements (All 10 Traditions)

Only two ADRs achieved explicit all-10 consensus:

1. **ADR-014: Multi-Dimensional Failure Classification** — Every tradition agreed that single-taxonomy failure handling is insufficient. Four orthogonal dimensions each trigger distinct response channels.

2. **ADR-028: Progressive Disclosure Architecture** — Every tradition agreed that the full system complexity must be hidden by default and revealed on demand. Three layers: Overview | Explanation | Deep Inspection.

---

## Tradition Contribution Summary

| Tradition | Primary Count | Key Unique Contribution |
|-----------|:---:|--------------------------|
| HTN | 8 | SHOP2 data, method libraries, decomposition protocol |
| Distributed Systems | 5 | BFT, CRDTs, topology validation, circuit breakers |
| BDI | 4 | Commitment strategies, falsification costs |
| NDM/RPD | 4 | Competent-stage danger zone, exploration budget |
| Resilience Eng. | 4 | Five-layer resilience, Envelope, near-miss logging |
| Lakatos | 4 | Monster-barring, FORMALJUDGE, quality vectors |
| DSPy | 2 | Signature-based selection, compilation |
| Polya | 2 | Looking Back, halt gate, auxiliary problems |
| MAS | 3 | Edge protocols, organizational failures |
| CTA | 1 | CDM probes, cognitive telemetry |
