# WinDAGs V2 to V3 Amendment Log

**Document**: Phase 6 Final — Technical Changelog
**Date**: 2026-03-01
**Status**: RATIFIED
**Source**: Phase 4 Consolidated Specification + Phase 5/5.5 Review Audit

---

## 1. Executive Summary

WinDAGs V3 is the product of a constitutional convention where 10 intellectual traditions — BDI Architecture, Multi-Agent Systems (MAS) Coordination, Naturalistic Decision Making / Recognition-Primed Decision (NDM/RPD), Hierarchical Task Networks (HTN) Decomposition, Resilience Engineering, DSPy Compiler Optimization, Cognitive Task Analysis (CTA), Polya Problem-Solving, Lakatosian Philosophy of Science, and Distributed Systems Theory — each submitted position papers, reached convergence, and produced a ratified specification.

V2 was a constitution drafted by a single architect supported by six reference documents. V3 is a synthesis where each tradition's strongest contribution was retained and each tradition's overreach was constrained by the others.

**Convention output statistics:**
- 42 universal agreements (8 or more of 10 traditions in accord)
- 28 majority agreements (5-7 traditions)
- 31 genuine disagreements resolved via Architecture Decision Records (ADRs)
- 5 meta-tensions acknowledged as open research questions
- 36 ADRs ratified
- 10 Principles (up from 7)
- 157 TypeScript interface definitions
- 51 behavioral contracts
- 6 dissenting positions preserved in the Dissenting Appendix

**Concept inventory results (Phase 5.5 Preservation Audit):**
- 278 V2 concepts audited: 251 PRESENT (90.3%), 22 DEFERRED (7.9%), 0 CUT, 5 MISSING (1.8%)
- The 5 missing items are all DETAIL or ARCHITECTURAL classification (none NON-NEGOTIABLE)

**Roadmap structure:** Phase 1 (Core Engine, 8-12 weeks), Phase 2 (Cloud Platform + Learning, 12-16 weeks), Phase 3 (Marketplace + Compilation, 8-12 weeks), Phase 4+ (Enterprise, ongoing).

The Learning Loop is identified in V3 — and confirmed by Phase 5 review — as the primary competitive moat. Every execution improves future performance. No competitor accumulates domain-specific knowledge that feeds back into execution. This framing is structurally identical to V2 Principle 3 but is now explicitly named the moat (ADR-035, Lakatos + Resilience Engineering).

---

## 2. What V3 Retains from V2

All of the following survived the convention without modification. Their retention reflects either 10/10 tradition consensus or the absence of any superior alternative proposed by any tradition.

### 2.1 Non-Negotiable Principles Carried Forward

| V2 Principle | V3 Principle | Consensus |
|---|---|---|
| Build Reusable Knowledge | Principle 1 (extended to methods, topology) | 10/10 |
| Instrument Everything | Principle 2 (extended to 5 event layers) | 10/10 |
| Execution Teaches | Principle 3 (extended to 3 timescales) | 10/10 |
| Understand Before Acting | Principle 4 (extended to Halt Gate) | 10/10 |
| Reason Well, Not Fast | Principle 5 (extended to adaptive deliberation budget) | 6/10 |
| Decomposition Is Not Neutral | Principle 6 (new name; V2 implied this) | 10/10 |
| Failures Are Typed | Principle 7 (extended from 6 modes to 4 dimensions) | 10/10 |

### 2.2 Mechanical Foundations Retained Verbatim

**Thompson sampling + Elo ranking**: All 10 traditions endorsed this as the correct bayesian approach to skill selection under uncertainty. The weight hierarchy (self: 0.15, peer: 0.25, downstream: 0.35, human: 0.50) is retained without modification.

**Kuhnian revolution model**: Crisis detection, normal-science vs. anomaly-accumulation phases, and paradigm shift events are all carried forward unchanged. V3 adds the monster-barring detector as a pre-revolution diagnostic (ADR-022, Lakatos).

**Crystallization criterion**: 3+ verified successes, quality >= 0.75, no critical failures in last 5 executions. This threshold was endorsed unanimously and is unchanged. V3 extends crystallization scope to methods and coordination topology (see Section 3.6).

**Progressive summarization in Context Store**: No alternative was proposed. Retained as the mechanism for managing context window growth across long-running executions.

**Four evaluators**: Self, peer, downstream, human. Directionally correct per 10/10 traditions. V3 modifies the self-evaluation channel (see Section 4.2).

**9-color status vocabulary**: Retained at L2/L3 of the progressive disclosure layer. L1 collapses to a 4-state vocabulary (ACTIVE / DONE / ATTENTION / PROBLEM) per Phase 5 Design Lead and Psychologist review requirements.

### 2.3 Technology Choices Retained

**ReactFlow + ELKjs**: No alternative was proposed by any tradition. Retained for execution visualization.

**Temporal for durable execution**: Retained as the production-grade durable workflow engine. Deferred to Phase 2 (EM review scope reduction).

**TypeScript for execution engine**: Retained. No tradition challenged this.

**Apache 2.0 open core + BSL 1.1 commercial**: Retained. The licensing boundary document was flagged as a Phase 1 deliverable by Market review.

**"Users pay own LLM costs; WinDAGs charges for orchestration"**: The business model stance is unchanged. V3 specifies which evaluation tiers map to which pricing tiers (ADR-033).

### 2.4 Type Definitions Carried Forward

The V2 node definition schema (id, agent, input, output, execution, resources) is carried forward. V3 adds: `commitmentStrategy`, `typedEdgeProtocol`, `failureDimensions`, and `qualityVector` as node-level fields. Backward compatibility is preserved at the schema level; the fields are optional with defined defaults.

---

## 3. What V3 Adds

### 3.1 Decomposition

**Three-pass decomposition protocol (ADR-001, HTN + Polya + Resilience Eng.)**: V2 treated decomposition as a single operation. V3 separates it into three sequential passes: (1) Problem Structure — identify principal parts (unknown, data, condition) using domain meta-skill; (2) Capability Matching — filter decomposition against available skills and plan libraries, revise infeasible splits; (3) Failure Surface — score resilience of the decomposition, refactor high-cascade-depth regions. Each pass is a distinct LLM call with distinct output contracts.

**Vague node expansion protocol (ADR-002, NDM/RPD + Lakatos + CTA + DSPy)**: V2 permitted vague nodes as a secondary mechanism. V3 makes vague node expansion the primary decomposition mode. A vague node is a node whose subtask graph is not known at planning time. It expands into a concrete sub-DAG when upstream results arrive. Four-layer priority cascade determines expansion driver: recognition confidence, available methods, capability match score, and past performance.

**Graduated epistemic annotation (ADR-003, BDI + HTN + DSPy)**: Each node is annotated with its commitment level: COMMITTED (concrete, executable, contract-specified), TENTATIVE (partially specified, higher variance expected), or EXPLORATORY (unknown territory, branching permitted). This annotation drives evaluation tier selection and cost budgeting automatically.

**Topology validation pass (ADR-004, Distributed Systems + MAS)**: After decomposition and before execution, a lightweight structural validation confirms the DAG is acyclic, all node contracts are schema-valid, and resource budgets do not exceed limits. This catches structural errors at near-zero cost.

**Planning-scheduling separation (ADR-005, HTN + MAS + BDI)**: V2 conflated planning (what to do) and scheduling (when to do it). V3 separates these. The Decomposer produces a plan. The Executor schedules from the plan using topological batching. Between-wave replanning is full; within-wave rescheduling is mid-batch preemption only.

**Wave-by-wave planning (ADR-006, HTN + Distributed Systems + BDI)**: Wave N's concrete plan is produced using Wave N-1's results. This replaces V2's static full-DAG planning with incremental commitment. HTN empirical data: static decomposition failure rate 34.78%, dynamic (vague node) failure rate 4.35%.

### 3.2 Execution

**Typed edge protocols (ADR-008, MAS + Lakatos + NDM/RPD)**: V2 edges carried data only. V3 edges are typed: `data-flow` (default), `quality-gate`, `contract`, `event`, `control`. The default `data-flow` covers 80%+ of edges with no additional configuration. Richer protocols are opt-in via edge type declaration.

**Commitment strategy as node property (ADR-012, BDI + MAS + NDM/RPD)**: Each node declares its commitment strategy. V2 used BOLD/CAUTIOUS/META_LEVEL (see Section 4.1 for rename). V3 renames and extends: COMMITTED nodes receive full execution resources; TENTATIVE nodes receive conditional depth constraints; EXPLORATORY nodes receive branching budgets and convergence gates.

**Expediter function (Phase 5, Chef review)**: A monitoring function that observes the global execution arc, compares actual against estimated timing and cost, and intervenes when drift exceeds threshold. This addresses the "order of arrival problem" (execution order does not equal delivery order). Not a separate agent; a cross-cutting monitor function invoked by the Executor.

**`freshness_ttl` for time-sensitive outputs (Phase 5, Chef review)**: Outputs with TTL fields are flagged for re-execution if not consumed within the TTL window. This is a node-level metadata field, not an architectural restructuring.

### 3.3 Failure Handling

**Four-dimension failure taxonomy (ADR-014, all 10 traditions)**: V2 specified six failure modes (INVALID_FORMAT, INVALID_ACTION, TASK_LIMIT_EXCEEDED, CONTEXT_OVERFLOW, TASK_MISMATCH, CASCADE_FAILURE). These map to the System Layer dimension of V3's four-dimensional taxonomy and are retained. Three new dimensions: Cognitive Mechanism (misclassification, SA-shift, queue exhaustion, articulation gap, availability bias), Decomposition Level (granularity mismatch, semantic gap, method explosion, cascading task failure), and Protocol Level (agent-level, interaction-level, organizational-level).

**Diagnostic-informed escalation ladder (ADR-015, HTN + Polya + DSPy + MAS)**: V2's `on_failure` field had four discrete options (escalate, skip, retry, mutate-dag). V3 replaces this with a diagnostic-first escalation protocol: classify failure on all four dimensions, consult the escalation ladder (retry with modified prompt, retry with different skill, escalate to PreMortem, mutate DAG structure, halt and request human input), then execute the indicated response.

**Layered Byzantine failure handling (ADR-016, Distributed Systems + CTA + NDM/RPD + Lakatos)**: Confident-incorrect outputs (the agent produces plausible but wrong output with high stated confidence) are the highest-severity failure mode. V3 adds: `ConfidentIncorrectError` detection heuristic (EM review requirement), cross-model validation for irreversible nodes, and an EvaluationBiasProfile per model that tracks systematic confidence miscalibration.

**Multi-level circuit breakers (ADR-017, Resilience Eng. + Distributed Systems)**: Per-node, per-skill, per-model. V2 specified circuit breakers at concept level; V3 specifies trip conditions, reset conditions, and half-open probe behavior at all three levels. Saga compensation pattern added for distributed state rollback on circuit-tripped paths.

### 3.4 Evaluation

**Four-layer quality model (ADR-023, Resilience Eng. + V2)**: V2 defined three layers: Floor (functional correctness, binary), Wall (quality baseline, continuous), Ceiling (expert judgment, continuous). V3 adds Envelope: does the output remain correct under perturbation? Tests robustness to input variation, edge cases, and adversarial conditions. Resilience Engineering's unique contribution.

**Two-stage review with sycophancy reform (ADR-023, ADR-024, ADR-025)**: Stage 1 is cheap, always-on, binary, Haiku-class. Stage 2 is targeted, triggered by expected-value threshold (`P(failure) * cost_of_downstream_waste > cost_of_Stage_2`). Stage 2 splits into two independent channels: Channel A (FORMALJUDGE-inspired outcome evaluation, binary observable questions) and Channel B (CTA-inspired process evaluation, examines tool calls and retry patterns). Self-reported reasoning is not trusted in either channel.

**Self-evaluation reform (ADR-024, BDI + Lakatos + NDM/RPD)**: V2 used a single self-evaluation channel weighted 0.15. V3 splits it: process self-check (retained, binary checklist, bias-resistant) and outcome self-assessment (eliminated as quality signal, logged for calibration only). Motivation: DSPy-measured sycophancy bias 0.749 makes outcome self-assessment structurally unreliable.

**Quality as vector (ADR-026, Lakatos + BDI + HTN)**: V2 used a scalar quality score. V3 uses a vector of 4-7 dimensions (correctness, completeness, efficiency, robustness, and optional domain-specific dimensions). No total ordering over quality vectors is assumed. Comparison is domain-specific. Elo rankings remain scalar for selection purposes; the vector is stored for diagnostic and learning use.

### 3.5 Learning

**Four-level structural learning (ADR-018, HTN + MAS + DSPy + BDI)**: V2 learned skill quality only. V3 adds: method-level learning (which HTN methods work for which problem types), topology-level learning (which coordination structures succeed for which domains), and compiled module learning (DSPy-style optimization of decomposition prompts). All four levels use Thompson sampling; learning events are emitted at each level.

**Stage-gated exploration with Lakatosian modulation (ADR-019, NDM/RPD + Lakatos + DSPy)**: V2's exploration budget was fixed per skill lifecycle stage. V3 adds Lakatosian modulation: exploration gates are opened wider when a skill's research program is classified as progressive (anomalies resolved, predictions confirmed) and narrowed when classified as degenerating (anomalies accumulating, predictions failing). This prevents the system from over-investing in skills whose failure patterns suggest structural unsoundness.

**Monster-barring detection (ADR-022, Lakatos)**: When a failure is handled by redefining what constitutes success (rather than by improving the method), V3 emits a MonsterBarringEvent. This is Lakatos's "monster-barring" move — a warning signal that the skill's protective belt is being patched in ways that narrow its scope without genuine improvement. Detected via linguistic pattern matching on post-failure evaluation notes.

**Kuhnian crisis detection (V2 retained, extended)**: V2 described crisis detection. V3 adds the trigger condition: when anomaly count for a skill exceeds a configurable threshold (default: 5 within 20 executions) without resolution, the system raises a KuhnianCrisisEvent and opens the skill for paradigm-shift exploration (higher exploration factor, cross-skill contamination permitted).

**Looking Back protocol (ADR-021, Polya + BDI + CTA + Lakatos)**: V2 did not specify post-execution retrospective. V3 mandates a structured four-question retrospective after each DAG completion: (Q1) What was the problem? (Q2) What was the plan? (Q3) What worked and what failed? (Q4) What would a better plan look like? Q1 and Q2 always run. Q3 and Q4 are conditional on execution quality falling below Wall threshold or new failure patterns detected.

**Distribution-ready learning state (ADR-020, Distributed Systems)**: Learning state (Thompson parameters, Elo scores, method rankings) is designed as G-Counter-compatible CRDT structures from Phase 1, enabling multi-instance merge without coordination in Phase 2. No implementation cost in Phase 1; architectural constraint only.

### 3.6 UX and Progressive Disclosure

**Three-layer progressive disclosure (ADR-028, all 10 traditions)**: L1 (Overview): DAG graph, 4-state status vocabulary (ACTIVE/DONE/ATTENTION/PROBLEM), cost and time. L2 (Explain): Node detail cards, 9-state status vocabulary, quality vectors, evaluation summaries. L3 (Inspect): Full execution traces, cognitive telemetry, decomposition rationale, raw evaluation scores. Default view is L1. L2 and L3 are accessed on demand.

**4-state L1 vocabulary (Phase 5, Design Lead + Psychologist reviews)**: The 9-color full vocabulary is preserved at L2/L3 but is not displayed at L1. L1 uses ACTIVE/DONE/ATTENTION/PROBLEM only. Motivation: 5 cognitive load spikes were identified at L1 for first-time users; collapsing to 4 states eliminates 3 of them.

**Human cognitive load budget (Phase 5, Psychologist review)**: Maximum review gates per execution is bounded. Gates are classified by irreversibility: IRREVERSIBLE (require explicit confirmation, count against daily budget), QUALITY_CHECK (lighter confirmation, partial budget cost), CALIBRATION (background, no budget cost). Complacency-break mechanism: periodic calibration cases with known outcomes injected into the gate queue.

**Failure explanation layer (Phase 5, Design Lead review)**: The 4D failure taxonomy is translated to plain language at L1/L2. The system produces a one-sentence failure explanation ("This step failed because the output format did not match the downstream contract") for every non-trivial failure before showing the technical classification.

### 3.7 Business and Market

**Marketplace asset taxonomy (ADR-032, HTN + MAS + DSPy + CTA)**: V2 described a marketplace abstractly. V3 specifies three asset classes: Skills (SKILL.md format, human-readable), Methods (HTN method libraries, structured), and Compiled Modules (DSPy-optimized, Phase 3). Each has distinct provenance, pricing, and licensing treatment.

**Private organizational skill libraries (Phase 5, Market review)**: V2 treated organizational skills as a tier feature. V3 elevates them to an architectural concept: organizational skills are competitive advantages and are not marketplace-shareable by default. The privacy model is opt-in sharing, not opt-out.

**MCP integration stance (Phase 5, Market review)**: V3 explicitly specifies what WinDAGs exposes as MCP tools (DAG execution, skill invocation, quality evaluation) and what it consumes (external tools, data sources). This was unspecified in V2.

**Two-tier capability schema (ADR-036, Distributed Systems + MAS + BDI + CTA + NDM/RPD)**: Tier 1 (behavioral contracts): deterministic, testable, provider-independent specifications of what the LLM must do. Tier 2 (cognitive profiles): probabilistic, empirically measured specifications of how the LLM reasons. All provider selection uses Tier 1 contracts; Tier 2 is used for Stage 2 evaluation targeting and exploration budget allocation.

---

## 4. What V3 Changes from V2

### 4.1 Terminology Translation Table

| V2 Term | V3 Term | Rationale |
|---|---|---|
| BOLD commitment | COMMITTED | BDI convention terminology; "bold" implies recklessness |
| CAUTIOUS commitment | TENTATIVE | BDI convention terminology; clearer scope |
| META_LEVEL commitment | EXPLORATORY | HTN convention terminology; accurate to the mechanism |
| Problem Analyzer (meta-DAG role) | Sensemaker | Reflects NDM/RPD recognition-primed decision framing |
| DAG Architect (meta-DAG role) | Decomposer | Matches three-pass protocol terminology |
| DAG Executor (meta-DAG role) | Executor | Simplified; role unchanged |
| Result Evaluator (meta-DAG role) | Evaluator | Simplified; role extended |
| Mutation Advisor (meta-DAG role) | Mutator | Simplified; role unchanged |
| Market coordination model | (renamed before shipping) | Market review: "Market" conflates economic and computational meanings |
| 3-layer quality model | 4-layer quality model | Resilience Eng. Envelope addition |
| Scalar quality score | Quality vector | Lakatos: no total ordering over models |

### 4.2 Value Changes

**K-factors for Elo ranking (Sci-Fi Engineer review)**:
- V2: new=32, established=16, dominant=8
- V3: novice=40, competent=32, proficient=24, expert=16
- Rationale: V2 K-factors were too conservative for early-stage skill learning. V3 rates are empirically motivated by NDM/RPD's competent stage danger zone (30-200 executions where overconfidence peaks). Model upgrade events reset K-factors to novice (40) and run a synthetic calibration sequence.

**Meta-DAG agent count**:
- V2: Fixed 12 agents
- V3: Variable 5-7 core roles + dynamic task-specific agents
- Rationale: 10/10 traditions rejected fixed count. Agent count should be determined by problem classification, not by constitutional decree.

**Self-evaluation outcome weight**:
- V2: 0.15 (single channel)
- V3: Process self-check retained at 0.15; outcome self-assessment eliminated as quality signal (weight 0)
- Rationale: DSPy measured sycophancy bias 0.749. Outcome self-assessment is logged for calibration only, not fed to the quality aggregation.

### 4.3 Architectural Restructuring

**Decomposition mode priority**: V2 treated static full-DAG decomposition as primary and vague nodes as a recovery mechanism. V3 inverts this: vague nodes are primary, static decomposition is an optimization for well-understood domains with high recognition confidence only. This is the largest single architectural change in V3.

**Meta-DAG role scope**: V2's 12 fixed roles included redundant coverage. V3's 5 core roles (Sensemaker, Decomposer, Executor, Evaluator, Mutator) plus 2 optional roles (PreMortem, Curator) cover the same functional scope with fewer agents and clearer responsibility boundaries.

**Coordination model abstraction**: V2 had no abstraction layer over coordination models. V3 defines a `CoordinationModel` interface with a Phase 1 implementation (DAG-only) and a clear extension path for Team (Phase 2), Market/Debate (Phase 3), and Blackboard/Hierarchical/Swarm (Phase 4+). The abstraction is implemented in Phase 1; the additional models are not.

---

## 5. What V3 Defers

Items here are explicitly deferred with rationale and target phase. Deferral is not removal; each has a revisit condition.

### Phase 2 Targets

| Deferred Item | Reason | Revisit Condition |
|---|---|---|
| Team coordination model | Phase 1 scope (EM review); CoordinationModel interface ships in Phase 1 | Phase 2 as P0 |
| Multi-dimensional Elo | Requires quality vector storage infrastructure | Phase 2 after vector store |
| Temporal integration (durable execution) | Requires multi-instance infrastructure | Phase 2 as P0 |
| BDI belief calibration learning | Theoretically elegant, weakest empirical justification | Phase 2 after Phase 1 data |
| Full Stage 2 review (both channels) | Channel A only in Phase 1 | Phase 2 as P1 |
| Cognitive telemetry (opt-in) | Requires process observation instrumentation | Phase 2 as P1 |
| Distribution-ready state merge | Infrastructure not needed single-instance | Phase 2 |
| Instant rollback | Requires checkpoint infrastructure | Phase 2 |
| A2A protocol support | Not convention-resolved, market research item | Phase 2+ |
| Near-miss logging (full) | Lightweight version in Phase 1 | Phase 2 |

### Phase 3 Targets

| Deferred Item | Reason | Revisit Condition |
|---|---|---|
| Market coordination model | Requires Team model as prerequisite | Phase 3 as P0 |
| DSPy compilation framework | Most powerful, most complex dependency | Phase 3 as P0 |
| Compiled modules as marketplace asset | Requires DSPy | Phase 3 |
| CTA elicitation-assisted skill authoring | Tooling complexity; seed skills cover Phase 1 | Phase 3 as P2 |
| Debate coordination model | Requires Team model as prerequisite | Phase 3 as P2 |
| Curriculum-driven exploration | Requires DSPy + Phase 2 execution data | Phase 3 |
| Skill versioning with 6-month SLA | Marketplace maturity feature | Phase 3 |

### Phase 4+ and Research

| Deferred Item | Reason |
|---|---|
| Blackboard coordination model | Low demand, high architectural complexity |
| Hierarchical coordination model | Requires organizational context not available Phase 1-3 |
| Swarm coordination model | Low demand, high cost, low auditability |
| Canary deployments | Requires multi-instance infrastructure |
| Full HTN within-wave interleaving | Convention did not resolve; V2 also deferred |
| Formal k-level verification | Mathematical proof not tractable for LLM agents |
| Schelling dynamics detection | V2 deferred; no new evidence from convention |
| Chaos engineering / antifragility testing | Phase 4 enterprise feature |

---

## 6. What V3 Cuts

V3 cuts zero V2 concepts. The preservation audit confirmed 0 CUT out of 278 audited. Items that appear removed are either deferred (tracked above) or subsumed into a broader V3 mechanism.

Two V2 concepts were subsumed rather than cut:
- V2's six-mode failure taxonomy is preserved as the System Layer dimension of V3's four-dimension taxonomy. No information is lost; the taxonomy is extended.
- V2's single self-evaluation channel is split into process (retained) and outcome (eliminated as quality signal, preserved as calibration log). The outcome data is not discarded; it is re-classified.

The "Market" coordination model name is flagged for rename before Phase 3 shipping (Market review, BLOCKING). The model itself is not cut.

---

## 7. Tradition Attribution

The following table records which tradition most influenced each major ADR, with supporting traditions.

| ADR | Decision | Primary Tradition | Supporting Traditions |
|---|---|---|---|
| ADR-001 | Three-pass decomposition | HTN, Polya | MAS, Resilience Eng., Distributed Systems |
| ADR-002 | Vague node expansion as primary mode | NDM/RPD | Lakatos, CTA, DSPy |
| ADR-003 | Graduated epistemic annotation | BDI | HTN, DSPy |
| ADR-004 | Topology validation pass | Distributed Systems | MAS |
| ADR-005 | Planning-scheduling separation | HTN | MAS, BDI |
| ADR-006 | Two-level interleaving | HTN, Distributed Systems | BDI, Resilience Eng. |
| ADR-007 | Five-step skill selection cascade | DSPy, BDI | Polya, NDM/RPD, V2 |
| ADR-008 | Typed edge protocols | MAS | Lakatos, NDM/RPD, HTN |
| ADR-009 | Conditional-depth PreMortem | NDM/RPD, Resilience Eng. | Lakatos |
| ADR-010 | Coordination model abstraction + phasing | Distributed Systems, HTN | MAS, BDI, Resilience Eng. |
| ADR-012 | Commitment strategy as node property | BDI | MAS, NDM/RPD, Resilience Eng. |
| ADR-013 | Dynamic DAG mutation | MAS | HTN, Distributed Systems, Resilience Eng. |
| ADR-014 | Four-dimension failure classification | All 10 traditions | — |
| ADR-015 | Diagnostic-informed escalation ladder | HTN, Polya | DSPy, MAS, NDM/RPD |
| ADR-016 | Layered Byzantine handling | Distributed Systems | CTA, NDM/RPD, Lakatos |
| ADR-017 | Multi-level circuit breakers | Resilience Eng. | Distributed Systems, NDM/RPD, HTN |
| ADR-018 | Four-level structural learning | HTN | MAS, DSPy, BDI |
| ADR-019 | Stage-gated exploration with Lakatosian modulation | NDM/RPD | Lakatos, DSPy |
| ADR-020 | Distribution-ready learning state | Distributed Systems | — |
| ADR-021 | Looking Back protocol | Polya | BDI, CTA, Lakatos |
| ADR-022 | Monster-barring detection | Lakatos | — |
| ADR-023 | Four-layer quality model (+ Envelope) | Resilience Eng. | V2, HTN |
| ADR-024 | Self-evaluation reform (process/outcome split) | BDI | Lakatos, NDM/RPD |
| ADR-025 | FORMALJUDGE selective integration | Lakatos | DSPy, CTA, Polya |
| ADR-026 | Quality as vector | Lakatos | BDI, HTN |
| ADR-027 | Cognitive telemetry (mandatory on failure, opt-in otherwise) | CTA | NDM/RPD, BDI |
| ADR-028 | Three-layer progressive disclosure | All 10 traditions | — |
| ADR-029 | Four visualization modes | HTN | MAS, Resilience Eng. |
| ADR-032 | Marketplace asset taxonomy | HTN | MAS, DSPy, CTA |
| ADR-033 | Pricing tier alignment with disclosure layers | NDM/RPD | Lakatos, MAS, HTN |
| ADR-035 | Learning loop as primary moat | Lakatos | Resilience Eng., BDI |
| ADR-036 | Two-tier capability schema | Distributed Systems, MAS | BDI, CTA, NDM/RPD |

**Tradition contribution summary:**

| Tradition | Primary Driver Of | Key Unique Contribution |
|---|---|---|
| BDI | Commitment strategies, annotation depth, self-eval reform | Falsification cost model, paraconsistent belief handling |
| MAS | Edge protocols, dynamic mutation, organizational failures | Conway's theorem constraint on decomposition |
| NDM/RPD | PreMortem, exploration budget, pricing tier | Competent-stage danger zone (30-200 executions) |
| HTN | Decomposition, planning-scheduling separation, structural learning | SHOP2 empirical data (899/904 success rate) |
| Resilience Eng. | Circuit breakers, Envelope layer, failure prominence | Five-layer resilience framework, near-miss logging |
| DSPy | Skill selection cascade, compilation path | Compilable decomposer, sycophancy bias measurement (0.749) |
| CTA | Cognitive telemetry, process evaluation channel | CDM probe structure, misrecognition as distinct failure mode |
| Polya | Looking Back protocol, escalation alternatives, Halt Gate | Four-question retrospective with cost model |
| Lakatos | FORMALJUDGE, quality vectors, monster-barring, moat framing | Progressive vs. degenerating program classification |
| Distributed Systems | Topology validation, Byzantine handling, CRDT state design | BFT-inspired consensus, workflow pattern library |

---

## 8. Preservation Audit Results

Phase 5.5 audited 278 V2 concepts against the Phase 4 consolidated specification.

**Result summary:**

| Classification | Count | Status |
|---|---|---|
| PRESENT | 251 | 90.3% — confirmed in V3 spec with location citations |
| DEFERRED | 22 | 7.9% — tracked in Part VI Amendment Log, all have phase targets |
| CUT | 0 | 0% — no V2 concepts were removed |
| MISSING | 5 | 1.8% — not found; see resolution below |

**The 5 missing concepts and their resolution:**

1. **Output export formats** (Markdown, PDF, JSON, ZIP, GitHub PR, Notion/Confluence, HTML): Classification ARCHITECTURAL. Not in V3. Resolution: defer to Phase 2 as a P2 deliverable. Add to Phase 2 roadmap before Phase 1 ships.

2. **Expansion path preview** (show 3-4 potential expansion paths before upstream completes): Classification DETAIL. Not specified in V3. Resolution: fold into vague node expansion protocol (ADR-002) as an optional UI affordance. No new ADR required.

3. **Inbox/channel coordination model**: Classification ARCHITECTURAL. Not in the CoordinationModelType enum. Resolution: Determine before Phase 1 ships whether to defer with rationale or cut with rationale. Current recommendation is defer to Phase 3 alongside Market model; confirm with architect.

4. **Revenue projections** ($0 -> $5K -> $25K -> $150K+): Classification DETAIL. Not in V3 spec. Resolution: This is a business planning item, not an architectural item. Include in the go-to-market document required by Market review (BLOCKING).

5. **Learning curve and crystallization rate estimates** (~50 executions for visibility, ~3% crystallization rate): Classification DETAIL. Not stated in V3. Resolution: Include as target metrics in Phase 1 observability requirements. These are empirical targets to track, not architecture decisions.

**New V3 concepts not in V2 inventory** (identified by audit):
- MonsterBarringDetector, NearMissEvent logging, EvaluationBiasProfile, ResilienceFramework 5-layer model, AnnotationLevel enum, PolyaVerificationResult, DecompositionQuality metrics, Expediter function, `freshness_ttl` field, cognitive load budget, complacency-break mechanism.

---

## 9. Review Feedback Integration

Phase 5 reviews produced changes across three categories: BLOCKING (must resolve before Phase 1 ships), INSIGHT (incorporated into spec or roadmap), and DEFERRED (acknowledged, out of current phase scope).

**PM review (BLOCKING items addressed):**
- First-run experience: required in Phase 1 scope. Pre-loaded demonstration DAG added as P2 Phase 1 item. Problem-type picker added as onboarding accelerant.
- Seed template library: 10+ templates enumerated in ADR-032 as Phase 1 P2 deliverable (50 curated skills, 10 methods, 20 template DAGs).
- Halt Gate UX: plain-language failure explanation layer added (Design Lead integration). Clarity threshold (< 0.6) triggers rephrasing guidance, not just a halt.
- Envelope score moved to free tier (deterministic, zero marginal cost). Ceiling evaluation remains Pro.

**EM review (BLOCKING items addressed):**
- `estimateFailureProbability(node)` formula: specified in Stage 2 escalation threshold as `P(failure) * cost_of_downstream_waste > cost_of_Stage_2`. Implementation pseudocode included in spec.
- Mock LLM provider interface: defined in cross-cutting specifications. Supports deterministic responses and configurable latency/failure injection.
- Phase 1 scope reduced: 4D failure classification ships with system-layer only in Phase 1 (other three dimensions Phase 2); multi-dimensional Elo deferred to Phase 2; coordination model abstraction ships as interface only.
- `ConfidentIncorrectError` heuristic: defined in ADR-016 (cross-model confidence disagreement as primary signal).
- V2-to-V3 migration path: declared as clean-slate. No backward compatibility at the execution state level. Schema compatibility at the node definition level is maintained.

**Design Lead review (BLOCKING items addressed):**
- Pre-execution state: defined as demonstration DAG view (PM integration).
- Post-execution retrospective: Looking Back protocol (ADR-021) provides the structured retrospective view location.
- Wave transition animation: flagged as Phase 1 P2 UX deliverable. Not an architectural constraint.
- `layer2_summary` made required field (not optional nullable).
- L1 collapsed to 4-state vocabulary (ACTIVE/DONE/ATTENTION/PROBLEM) per Psychologist review alignment.

**Market review (BLOCKING items addressed):**
- Free-tier evaluation depth: Envelope to free, Ceiling to Pro (PM integration).
- MCP relationship: explicitly specified (WinDAGs exposes DAG execution, skill invocation, quality evaluation; consumes external tools and data sources).
- Open-source/commercial boundary: ADR-031 specifies Apache 2.0 open core + BSL 1.1 commercial. Boundary document flagged as Phase 1 documentation deliverable.
- Private organizational skill libraries elevated to architectural concept (Section 3.7).

**Chef review (BLOCKING items addressed):**
- Expediter function defined (Section 3.2).
- Human gate timeout authority: Executor holds authority to fail DAG, escalate, or proceed with documented default per gate classification.
- `freshness_ttl` field added to node schema.
- PreMortem extended to include timing analysis as Q3 subquestion.

**Psychologist review (BLOCKING items addressed):**
- Cognitive load budget defined with gate classification (IRREVERSIBLE/QUALITY_CHECK/CALIBRATION) and daily limits.
- L1 vocabulary collapsed to 4 states (Design Lead alignment).
- Complacency-break mechanism added: periodic calibration cases with known outcomes injected into gate queue.

**Sci-Fi Engineer review (BLOCKING items addressed):**
- Cross-deployment skill transfer protocol: learning state transfer defined in ADR-020 with privacy model and domain distance conditioning.
- Visualization chunking: 300-500 node boundary with hierarchical collapse specified in ADR-029.
- Model cost drift watchdog: monitors cost ratios, alerts when 2-stage review expected-value threshold becomes suboptimal.
- K-factor reset on model upgrade: flagged in ADR-007; model substitution triggers K-factor reset to novice (40) and synthetic calibration sequence.

**CEO review (BLOCKING items addressed):**
- Critical path document: Phase 1 deliverables ordered by dependency. Week 4 milestone: decomposition + execution engine running. Week 6: evaluation + learning. Week 8: visualization + first marketplace skill.
- First paying customer persona: organizational developer managing multi-step agentic workflows across a team, currently using LangGraph with custom glue code.
- Marketplace cold-start playbook: architect produces first 20 premium skills; organizational skill library as early moat mechanism.

**Ad Creative and Sci-Fi Engineer insight items (incorporated into roadmap, not spec):**
- Monster-barring terminology retained and elevated as a named, visible product concept.
- Crystallized skills named as a visible product concept in marketplace UX.
- Constitutional convention origin story documented as a marketing asset (not in spec).
- 90-second canonical demo scripted around the learning loop demonstration.

---

*Total ADRs: 36*
*Total TypeScript interfaces: 157*
*Total behavioral contracts: 51*
*Total V2 concepts preserved or deferred: 278 (0 cut)*
*Total traditions traced: 10 — every ADR names its influences*
