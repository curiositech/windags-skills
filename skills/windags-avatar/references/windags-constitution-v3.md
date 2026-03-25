# WinDAGs V3 Constitution

**Status**: RATIFIED
**Date**: 2026-03-01
**Origin**: Constitutional Convention of 10 Intellectual Traditions
**Supersedes**: WinDAGs V2 Constitution (SKILL.md + 6 references)

---

## How to Read This Document

This constitution is split into five parts. Each part is self-contained enough to be useful alone, but they build on each other.

**Part 1** (this file): Preamble, non-negotiable principles, architecture overview. Read this to understand the system's shape. An engineer who reads only Part 1 should be able to draw the architecture on a whiteboard and explain the key design bets.

**Part 2**: Detailed specification for Topics 1-4 (Decomposition, Planning, Execution, Failure Handling). The core runtime.

**Part 3**: Detailed specification for Topics 5-8 (Learning, Evaluation, UX, Business Model). The value-creation loop.

**Part 4**: Cross-cutting concerns, implementation pseudocode highlights, and the delivery roadmap.

**Part 5**: Appendices -- ADR registry, dissenting positions, tradition influence matrix, glossary.

Every major decision in this document traces to one of 36 Architecture Decision Records (ADRs). Every ADR names the traditions that influenced it and the positions it overrode. This is not a compromise document. It is a synthesis where each tradition's strongest contribution was preserved and each tradition's overreach was pruned by the others.

---

# Preamble

## What WinDAGs Is

WinDAGs is an AI orchestration system that decomposes problems into directed acyclic graphs of skillful agents, executes those graphs, evaluates quality at multiple levels, and feeds the results back into a learning loop that makes every future execution better.

**The one-sentence version**: WinDAGs is the orchestration platform where AI agents accumulate genuine expertise -- where every problem solved makes the next problem easier, and the system can show you exactly why.

That last clause matters. Most AI orchestration tools are stateless: they coordinate agents, but the agents forget everything between runs. WinDAGs remembers. It ranks skills. It learns which decomposition strategies work for which problem types. It detects when a skill is silently degrading. It crystallizes successful improvisation into reusable knowledge. The learning loop is not a feature -- it is the architecture.

## What Changed from V2

V2 was a constitution drafted by a single architect. V3 is the product of a constitutional convention where ten intellectual traditions each submitted position papers, debated, steel-manned their opponents, and then conceded where the evidence warranted.

The ten traditions:

| # | Tradition | What It Brought |
|---|-----------|-----------------|
| 1 | **BDI Architecture** | Commitment strategies, belief management, epistemic annotation |
| 2 | **MAS Coordination** | Multi-agent protocols, Conway's Law constraints, organizational failure |
| 3 | **NDM/RPD** | Recognition-primed decision-making, the "competent stage" danger zone |
| 4 | **HTN Decomposition** | Hierarchical task networks, method libraries, SHOP2 empirical data |
| 5 | **Resilience Engineering** | Five-layer resilience, near-miss logging, the Envelope quality layer |
| 6 | **DSPy Compiler Optimization** | Signature-based skill selection, compilation from traces |
| 7 | **Cognitive Task Analysis** | Cognitive telemetry, CDM probes, tacit knowledge elicitation |
| 8 | **Polya Problem-Solving** | Principal parts, the halt gate, Looking Back protocol, auxiliary problems |
| 9 | **Lakatosian Philosophy of Science** | Monster-barring detection, progressive/degenerating classification, FORMALJUDGE |
| 10 | **Distributed Systems Theory** | Failure models, CRDT-ready state, topology validation, circuit breakers |

The convention produced:
- 42 universal agreements (8+ of 10 traditions)
- 28 majority agreements (5-7 traditions)
- 31 genuine disagreements resolved via ADRs
- 5 meta-tensions acknowledged as ongoing research questions

## Architectural Stance

WinDAGs V3 takes the following architectural positions, each traceable to convention consensus:

1. **Decomposition is a first-class cognitive operation**, not a preparatory step. It requires multiple passes, produces falsifiable claims, and its quality is measured independently of execution quality. (10/10 traditions, UA-1.)

2. **Progressive revelation is the primary decomposition mode.** Static full-DAG decomposition is an optimization for well-understood domains only. The default is vague nodes that expand as upstream work completes. (10/10, UA-2. HTN data: 34.78% CTF rate for static vs. 4.35% for dynamic.)

3. **Evaluation is continuous, not post-hoc.** Quality signals flow during execution, not just after. Two-stage review runs on every node. The Envelope quality layer tracks execution stress in real time. (8/10, cross-topic synthesis.)

4. **Failures are typed on four dimensions simultaneously.** A single taxonomy cannot capture the difference between "the model timed out" and "the model confidently produced a wrong answer." System layer, cognitive mechanism, decomposition level, and protocol level each trigger distinct response channels. (10/10, Topic 4 UA-1.)

5. **The system learns at multiple levels.** Skill quality is the baseline (V2). V3 adds method quality, coordination topology quality, and failure pattern learning. Each level feeds back into the next execution. (8/10, Topic 5 UA-2.)

6. **The UX hides complexity by default and reveals it on demand.** Three progressive disclosure layers. No user sees BDI or HTN terminology unless they actively drill into the deep inspection layer. (10/10, Topic 7 UA-1.)

7. **The business model is the UX made visible.** Each progressive disclosure layer maps to a pricing tier. The learning loop creates the moat. Users who leave take their skills but lose their accumulated evaluation data and method rankings. (Cross-topic synthesis, Topics 7-8.)

## The Convention's Disagreement Structure

Understanding where the traditions disagreed is as important as understanding where they agreed. The disagreements reveal the genuine tensions in the architecture.

The 31 genuine disagreements clustered into five categories:

| Category | Count | Example | Resolution Pattern |
|----------|-------|---------|-------------------|
| Timing of mechanisms | 12 | When should evaluation run? | Phasing: mechanism available later |
| Scope of mechanisms | 8 | How many nodes need cognitive telemetry? | Conditionality: mechanism applies under conditions |
| Default behavior | 6 | Should edges be typed by default? | Strong defaults: simplest option default, richer options opt-in |
| Architectural priority | 3 | Does capability structure drive decomposition? | Ordering: both present, sequence determined by information availability |
| Fundamental approach | 2 | BFT quorum vs. layered mitigation for Byzantine handling | ADR with dissent and revisit condition |

The two "fundamental approach" disagreements are the most architecturally consequential. Distributed Systems' concession on BFT ("the independence assumption breaks with LLM evaluators") is a genuine insight about the limits of formal methods in LLM systems. BDI's preference for per-task interleaving reflects a genuine philosophical commitment to continuous deliberation that may prove correct at scale -- hence the revisit condition.

The strong-defaults pattern (6 of 31 disagreements) is worth highlighting because it is the convention's pragmatic signature: start simple, make the complex option available, and let empirical data decide when the complex option becomes the default. Edge protocols default to data-flow (80%+ of edges). Cognitive telemetry defaults to off (opt-in). PreMortem defaults to lightweight (escalate on low confidence). This pattern keeps Phase 1 simple while ensuring Phase 2+ has the mechanisms it needs.

## What V3 Retains from V2

Not everything changed. The convention endorsed these V2 decisions unanimously:

- Thompson sampling + Elo ranking for skill selection (10/10)
- Kuhnian revolution model for paradigm shift detection (10/10)
- Crystallization from improvisation: ad-hoc success -> reusable skill (10/10)
- Four evaluators: self, peer, downstream, human (10/10 directionally correct)
- Weight hierarchy: self=0.15, peer=0.25, downstream=0.35, human=0.50
- ReactFlow + ELKjs for visualization
- 9-color status vocabulary for nodes
- Three-layer business model: open core + cloud + marketplace
- Users pay own LLM costs; WinDAGs charges for orchestration
- Progressive summarization in Context Store
- TypeScript for execution engine
- Apache 2.0 open core + BSL 1.1 commercial extensions

## What V3 Defers

Some proposals were judged architecturally sound but premature for the current phase:

| Deferred Item | Reason | Target |
|---------------|--------|--------|
| Canary deployments | Requires multi-instance infrastructure | Phase 3+ |
| Instant rollback | Requires checkpoint infrastructure | Phase 2 |
| DSPy full compilation | Most powerful but most complex mechanism | Phase 3 |
| BDI belief calibration | Elegant theory, weak empirical justification | Phase 2 |
| Swarm coordination | Low demand, high cost, low auditability | Phase 4+ |
| A2A protocol support | Market research item, not convention-resolved | Phase 2+ |
| Formal k-level verification | Not yet tractable for LLM agents | Research |
| Schelling dynamics detection | V2 deferred, still not actionable | Research |

## V2-to-V3 Terminology Changes

| V2 Term | V3 Term | Reason |
|---------|---------|--------|
| BOLD | COMMITTED | Clearer semantics |
| CAUTIOUS | TENTATIVE | Clearer semantics |
| META_LEVEL | EXPLORATORY | Clearer semantics |
| Problem Analyzer | Sensemaker | Broader responsibility |
| DAG Architect | Decomposer | More precise |
| DAG Executor | Executor | Simplified |
| Result Evaluator | Evaluator | Simplified |
| Mutation Advisor | Mutator | Active role |
| Risk Analyzer | PreMortem | Specific function |
| Knowledge Manager | Curator | Post-execution focus |
| K-factors (32/16/8) | K-factors (40/32/24/16) | Finer stage-gating |

## Empirical Foundations

The convention's decisions are not philosophical preferences. They are grounded in measured data, cited wherever used throughout this document. The most consequential empirical findings:

**From HTN Decomposition**:
- 899/904 problems solved correctly when using domain-specific decomposition methods (Topic 1). This is the strongest single piece of evidence in the entire convention and drives the investment in method-level learning.
- 34.78% cascading task failure rate for static decomposition vs. 4.35% for dynamic progressive decomposition (Topic 1). This 8x reduction justifies the complexity of vague nodes and wave-by-wave execution.
- Planning in execution order eliminates hypothetical state reasoning, which is expensive and error-prone for LLM planners (Topic 2). This drives the planning-scheduling separation.

**From DSPy Compiler Optimization**:
- Sycophancy bias in self-evaluation measured at 0.749 correlation (Topic 6). This single number ended the debate about self-evaluation weight: outcome self-assessment is eliminated as a quality signal.
- Signature-based skill selection provides zero-LLM-call hard filtering that eliminates 60-80% of candidate skills before any ranking occurs (Topic 2).

**From Lakatos / Evaluation Research**:
- Position bias: only 23.8% of pairwise comparisons are consistent when response order is reversed (Topic 6). Position swapping is mandatory because without it, evaluation is structurally unreliable.
- Verbosity bias: 91.3% of evaluations prefer the longer response regardless of quality (Topic 6). Length normalization is mandatory for the same reason.

**From NDM/RPD**:
- The "competent stage" (30-200 executions) is the highest-risk period for skill quality. The skill appears reliable but has not been truly validated. This drives heightened monitoring, a specific V3 mechanism with defined thresholds.

**From Resilience Engineering**:
- Near-miss events predict future failures better than actual failures predict future failures (Topic 4). This counterintuitive finding drives the Envelope quality layer and near-miss logging.

**From Polya Problem-Solving**:
- The P*C stopping rule (probability * cost) provides a principled way to decide when decomposition is "done" (Topic 1). This is adapted as the Stage 2 escalation threshold.

These data points are not exhaustive. Each ADR in Parts 2-4 cites its specific empirical basis. The point here is that the convention's most consequential decisions -- progressive revelation, self-evaluation reform, mandatory bias mitigation, heightened monitoring, near-miss detection -- all trace to measured data, not theoretical preferences.

Where empirical data was not available, the convention acknowledged this openly. The six Open Questions (Part 5, Appendix D) are areas where the convention made provisional decisions and defined the measurement criteria for validating or revising them. The architecture is designed to be empirically self-correcting: the same learning loop that improves skill quality can be applied to architectural decisions by tracking whether the predicted benefits materialize.

This commitment to empirical falsifiability is itself one of the convention's most important decisions -- it means the architecture will evolve with evidence rather than entrench positions that outlive their usefulness.

---

# Non-Negotiable Principles

These ten principles achieved 10/10 tradition consensus. They are constitutional bedrock -- not subject to override by any ADR or implementation decision.

## Principle 1: Build Reusable Knowledge

Every execution must have the potential to improve the system's knowledge base. Skills, methods, coordination templates, and failure patterns are first-class knowledge assets. The system's value grows monotonically with use.

**Crystallization criterion**: 3+ verified successes, quality >= 0.75, no critical failures in last 5 executions.

**V3 extension**: Crystallization applies not only to skills but to methods (HTN), structural rules (BDI), and compiled modules (DSPy). The SKILL.md format remains the human-readable source of truth; methods, structural rules, and compiled modules are derived artifacts.

*Source: V2 Principle 1, reinforced by all 10 traditions.*

## Principle 2: Instrument Everything

Every operation is observable. Every failure is loud. Every assumption is tested. Mandatory event types: `node_events`, `dag_events`, `meta_events`, `learning_events`. No silent failures permitted.

**V3 extension**: Add `coordination_events` (MAS), `evaluation_events` (Lakatosian), and `cognitive_events` (CTA, opt-in). Five layers of observability: Agent, DAG Execution, Skill Lifecycle, Infrastructure, User Experience.

*Source: V2 Principle 2, reinforced by CTA, Resilience Engineering, Distributed Systems.*

## Principle 3: Execution Teaches

Three learning timescales:
- **Immediate** -- per-execution Thompson sampling update
- **Episodic** -- per-DAG method and topology evaluation
- **Calibration** -- monthly drift detection and recompilation

Thompson sampling and Elo ranking are retained as the mechanical foundation. V3 layers structural learning (methods, coordination templates) on top.

*Source: V2 Principle 3, reinforced by all 10 traditions.*

## Principle 4: Understand Before Acting

The system must understand the problem before decomposing it. Understanding is not a single step but multiple distinct cognitive operations: identifying principal parts (Polya), classifying problem type (NDM/RPD), probing for tacit knowledge gaps (CTA), and modeling epistemic state (BDI).

**Halt Gate**: If the problem is ill-defined -- missing unknown, contradictory conditions, under-specified data -- the system HALTS and requests clarification. This is a hard gate, not a soft warning. The halt threshold is `validity_assessment.overall < 0.6`.

*Source: V2 Principle 4, reinforced by Polya (strongest), NDM/RPD, CTA, BDI.*

## Principle 5: Reason Well, Not Fast

Quality over speed. Galaxy-brain prohibition: correctness over cleverness. QUALITY_FIRST is the default mode; override requires explicit justification logged as a decision event.

**V3 extension**: Deliberation budget is adaptive, not fixed. Problem classification at the start of execution determines the deliberation budget for all downstream operations. The classification itself costs one Haiku-class call.

*Source: V2 Principle 5, reinforced by 6/10 traditions.*

### What Deliberation Budget Looks Like in Practice

When a user submits "Build a REST API for user management," the Sensemaker classifies it as well-structured, recognition_confidence=0.85 (common pattern), domain=software-engineering. The deliberation budget:

- Decomposition: minimal (use software-engineering meta-skill, skip deep analysis)
- Evaluation: Stage 1 only for most nodes; Stage 2 for the final code output
- Looking Back: Q1-Q2 only (did the result satisfy the contract? Any unstated assumptions?)
- PreMortem: lightweight scan only
- Total meta-layer cost: ~$0.03

When a user submits "Design a compensation model for a startup with 50 employees, accounting for equity dilution, tax implications, and competitive benchmarks," the Sensemaker classifies it as ill-structured, recognition_confidence=0.35, domain=finance. The deliberation budget:

- Decomposition: deep (no domain meta-skill, novel problem structure, multiple vague nodes)
- Evaluation: Stage 1 + Stage 2 for all nodes (high stakes, low confidence)
- Looking Back: Q1-Q4 (this is a crystallization candidate if it succeeds)
- PreMortem: full (novel domain, many potential failure modes)
- Total meta-layer cost: ~$0.15

The adaptive budget means well-understood problems are fast and cheap, while novel problems get the full deliberation apparatus. The classification cost ($0.001) is always worthwhile.

## Principle 6: Decomposition Is Not Neutral

Every decomposition decision is an irreversible architectural commitment. Decomposition encodes expert knowledge (HTN/NDM), creates failure surfaces (Resilience Engineering), constrains the solution space (Distributed Systems), and produces falsifiable sub-claims (Lakatos). The Decomposer is a composite operation, not a single prompt.

*Source: 10/10 traditions (UA-1).*

## Principle 7: Failures Are Typed

Failures are classified on four orthogonal dimensions simultaneously:

| Dimension | Source | Purpose |
|-----------|--------|---------|
| System Layer | Distributed Systems | Determines remediation: retry, compensate, escalate |
| Cognitive Mechanism | NDM/RPD, CTA | Determines root cause: misclassification, bias, exhaustion |
| Decomposition Level | HTN, Lakatos | Determines structural response: re-decompose, prune |
| Protocol Level | MAS | Determines organizational mutation need |

A single failure can be classified on all four dimensions. V2's six-mode taxonomy maps to the System Layer dimension and is retained as a subset.

*Source: V2 Principle 7 (extended), 10/10 traditions.*

## Principle 8: Self-Evaluation Is Structurally Unreliable

A failing agent cannot reliably detect or characterize its own failure. Self-evaluation weight remains 0.15 (lowest). V3 splits self-evaluation into two channels:

- **Process self-check** (retained, weight 0.15): Binary checklist. Did I check preconditions? Did I use all input data? Mechanical and bias-resistant.
- **Outcome self-assessment** (eliminated as quality signal): Sycophancy bias measured at 0.749. Logged for calibration tracking only. Does not contribute to quality scoring.

*Source: 9/10 traditions, quantified by DSPy.*

## Principle 9: Progressive Revelation Is Primary

One-shot static decomposition is catastrophic. HTN's data: 34.78% cascading task failure rate for static decomposition vs. 4.35% for dynamic. Progressive revelation -- vague nodes expanding into sub-DAGs as upstream work completes -- is the primary decomposition mode. Static full-DAG decomposition is permitted only for well-understood domains with high recognition confidence (>= 0.9).

*Source: 10/10 traditions (UA-2).*

### What Progressive Revelation Looks Like

A three-wave execution for "Refactor the authentication module to support OAuth 2.0":

**Wave 1** (concrete):
- Node 1: Analyze current auth module structure
- Node 2: Research OAuth 2.0 requirements
- Vague Node A: "Implement changes" (depends on Nodes 1 and 2)

**Wave 2** (after Wave 1 completes):
Vague Node A expands based on results. Node 1 revealed the auth module uses session-based auth with 3 middleware layers. Node 2 confirmed PKCE flow is required. The expansion:
- Node 3: Design OAuth state machine
- Node 4: Modify session middleware
- Node 5: Implement token refresh logic
- Vague Node B: "Integration testing" (depends on 3, 4, 5)

**Wave 3** (after Wave 2 completes):
Vague Node B expands. Nodes 3-5 revealed that the token refresh logic requires a new database table. The expansion:
- Node 6: Write integration tests for OAuth flow
- Node 7: Write migration for token storage table
- Node 8: End-to-end validation

Each wave uses information that did not exist when the previous wave was planned. This is why upfront static decomposition would have been wrong -- the need for Node 7 was not discoverable until Node 5 was implemented.

## Principle 10: The Learning Loop Is the Moat

The system's primary competitive differentiator is that every execution improves the next one. No competitor accumulates domain-specific knowledge that feeds back into future executions. The learning loop (execute -> evaluate -> rank -> crystallize -> execute better) must be protected as the core business asset.

*Source: 9/10 traditions.*

---

# Architecture Overview

## System Layers

```
+-------------------------------------------------------+
|                    User Interface                      |
|  Progressive Disclosure: Overview | Explain | Inspect  |
+-------------------------------------------------------+
|                  Coordination Layer                    |
|  Phase 1: DAG | Phase 2: +Team | Phase 3: +Market     |
+-------------------------------------------------------+
|                   Execution Engine                     |
|  Wave-by-Wave Planning | Topological Scheduling        |
|  Typed Failure Handling | Circuit Breakers              |
+-------------------------------------------------------+
|                  Evaluation Engine                     |
|  Stage 1: Contract (cheap) | Stage 2: Cognitive (deep) |
|  Four Layers: Floor | Wall | Ceiling | Envelope        |
+-------------------------------------------------------+
|                   Learning Engine                      |
|  Skill Rankings | Method Rankings | Topology Rankings   |
|  Thompson Sampling | Kuhnian Crisis Detection           |
+-------------------------------------------------------+
|               LLM Abstraction Layer                    |
|  Provider Router | Capability Schema | Cost Tracker     |
+-------------------------------------------------------+
|                  Knowledge Library                     |
|  Skills | Methods | Coordination Templates |            |
|  Domain Meta-Skills | Failure Patterns                 |
+-------------------------------------------------------+
```

**Reading this diagram bottom-up**: The Knowledge Library stores everything the system has learned. The LLM Abstraction Layer routes requests to model providers with failover and cost tracking. The Learning Engine feeds execution results back into rankings and detects knowledge drift. The Evaluation Engine measures quality on four layers. The Execution Engine runs DAGs wave-by-wave with typed failure handling. The Coordination Layer manages agent-to-agent communication. The UI reveals all of this progressively.

## The Expediter

*Addressing the Chef's review concern: "Who monitors the whole plate?"*

The Expediter is a cross-cutting monitoring function, not a separate agent. It operates at the DAG level and intervenes when the execution arc drifts from plan:

| Signal | Threshold | Intervention |
|--------|-----------|-------------|
| Cost drift | Actual > 1.5x projected at 50% completion | Alert user, suggest scope reduction |
| Time drift | Critical path slippage > 30% | Re-estimate, preempt low-priority batches |
| Quality drift | Rolling quality average drops below 0.6 | Trigger structural reassessment |
| Mutation rate | > 3 mutations per wave | Trigger decomposition circuit breaker |
| Human gate backlog | > 2 gates waiting simultaneously | Batch gates, warn user of cognitive load |

The Expediter function is implemented within the Executor, not as a separate agent that would add coordination overhead. It reads the same telemetry stream that drives the UI and acts on the same circuit breakers.

## Meta-DAG Architecture

V3 replaces V2's fixed 12-agent meta-DAG with a minimum viable set of 5-7 essential roles that can instantiate additional task-specific agents as needed.

**Core roles** (always present):

| Role | Responsibility | Model Tier |
|------|---------------|------------|
| **Sensemaker** | Problem understanding, classification, halt gate | Tier 2 (Sonnet) |
| **Decomposer** | Three-pass decomposition, wave planning | Tier 2 (Sonnet) |
| **Executor** | Topological scheduling, batch dispatch, Expediter function | Runtime (no LLM) |
| **Evaluator** | Two-stage review, four-layer quality | Tier 1 (Haiku) + Tier 2 |
| **Mutator** | Diagnostic-informed escalation, DAG mutation | Tier 1 (Haiku) |

**Optional roles** (instantiated based on problem):

| Role | When Instantiated | Model Tier |
|------|-------------------|------------|
| **PreMortem** | Always lightweight; full depth on complex DAGs | Tier 1 (Haiku) |
| **Curator** | Post-execution, when crystallization criteria met | Tier 1 (Haiku) |

The Decomposer can instantiate additional task-specific agents within resource bounds. The meta-DAG agent count is variable but bounded.

### How the Meta-DAG Executes

A concrete example. User submits: "Audit our API endpoints for security vulnerabilities and generate a remediation plan."

1. **Sensemaker** classifies the problem: well-structured, domain=security, recognition_confidence=0.72. No halt gate triggered (validity 0.78). Deliberation budget: standard decomposition, Stage 1+2 evaluation, Looking Back Q1-Q3.

2. **Decomposer** runs three passes:
   - Pass 1 (Problem Structure): Principal parts -- unknown="remediation plan", data=["API endpoints list", "security standards"], condition=["must cover OWASP Top 10"]. Task hierarchy: enumerate endpoints -> classify vulnerabilities -> prioritize -> generate remediation.
   - Pass 2 (Capability Matching): Matches `security-audit` skill (established, Elo 1380) and `remediation-writer` skill (rising, Elo 1210). Flags: no skill for "automated scanning" -- marks as vague node.
   - Pass 3 (Topology Validation): No shared failure domains. Cascade depth score: 0.3 (safe).

3. **PreMortem** runs lightweight scan: no known failure patterns. Accepts the plan.

4. **Executor** runs Wave 1 (enumerate + classify). Results flow to Context Store. Wave 2 expands the vague "automated scanning" node based on Wave 1 results -- the Decomposer discovers the API uses GraphQL and selects a GraphQL-specific scanning approach. Wave 3 executes prioritize + remediation.

5. **Evaluator** runs Stage 1 (contract) on every node. Stage 2 (cognitive) on the remediation output because it feeds the final deliverable.

6. **Looking Back** runs Q1-Q3. Identifies an unstated assumption: the audit assumed all endpoints are documented. Logs this for the user.

7. **Learning Engine** updates: security-audit skill gets Thompson success (+1 alpha), Elo +12. The decomposition method "enumerate-classify-prioritize-remediate" gets recorded with quality 0.82. If this pattern succeeds 2 more times, it will be crystallized into a method.

## The Three-Pass Decomposition Protocol

*Why decomposition gets its own section*: Decomposition quality determines everything downstream. HTN's data shows 899/904 problems solved correctly when using domain-specific decomposition methods. Poor decomposition propagates through the entire execution.

Three passes, each applying a different lens:

**Pass 1 -- Problem Structure** (Polya/HTN): Identify principal parts (unknown, data, condition). Apply domain meta-skill if available. Produce initial task hierarchy. Default to vague nodes unless confidence is high.

**Pass 2 -- Capability Matching** (MAS/BDI): Filter against available skills via metadata lookup. No LLM calls in this pass. Flag capability gaps. Assign commitment strategies.

**Pass 3 -- Topology Validation** (Distributed Systems/Resilience Engineering): Score failure surfaces. Check for shared failure domains between parallel nodes. Validate resource budgets. Refactor high-cascade-depth regions.

The ordering is motivated by information availability: problem structure is available immediately from the user's input; capability matching requires the skill catalog; failure analysis requires the decomposition itself.

*ADR-001. Influenced by: HTN, Polya, MAS, Resilience Engineering, Distributed Systems.*

## Wave-by-Wave Execution

The system does not plan the entire DAG upfront. Instead:

1. **Wave 1**: Decompose concretely. Plan and schedule. Execute.
2. **Wave 2+**: Use Wave N-1 results to expand vague nodes. Plan Wave N concretely. Schedule and execute.
3. **Between waves**: Full replanning permitted. New wave incorporates all completed results.
4. **Within waves**: Batch scheduling with event-driven preemption on significant events (failures, quality drops, budget exceeded).

This is the operationalization of Principle 9 (Progressive Revelation). Static full-DAG planning is an optimization permitted only when recognition confidence >= 0.9 and the domain meta-skill explicitly allows it.

## Two-Stage Review

Every node output passes through two review stages:

**Stage 1 -- Contract Review**: Cheap, fast, always-on. Haiku-class model. Binary pass/fail against output contract. Cost < $0.005. Catches format violations, schema mismatches, obvious errors.

**Stage 2 -- Cognitive Review**: Expensive, targeted. Sonnet-class model. Two independent channels:
- **Channel A (Outcome)**: FORMALJUDGE-inspired. Binary questions about observable outputs. Does not inspect reasoning traces.
- **Channel B (Process)**: CTA-inspired behavioral observation. Examines tool calls, retry patterns, intermediate outputs. Does not trust self-reported reasoning.

**Escalation threshold**: Stage 2 runs when `P(failure) * cost_of_downstream_waste > cost_of_Stage_2`. This subsumes V2's categorical heuristic as a special case.

## Four-Layer Quality Model

| Layer | What It Measures | Type | Cost |
|-------|-----------------|------|------|
| **Floor** | Functional correctness: does it work? | Binary, deterministic | Zero |
| **Wall** | Frame compatibility: does it fit the context? | Categorical, deterministic | Low |
| **Ceiling** | Process quality: was the reasoning sound? | Continuous, partially neural | Medium |
| **Envelope** | Execution resilience: how stressed was the execution? | Continuous, deterministic | Zero |

Evaluation is ordered as a runtime protocol gate. Floor failure skips everything else. This is enforced by infrastructure, not by guidance.

**On the Envelope layer and the free tier** (addressing the Market review concern): The Envelope score is deterministic -- it is computed from retry ratios, mutation counts, circuit breaker trips, budget utilization, and timeout proximity. It costs nothing to compute and should be available to all users, including the free tier. Moving Envelope to free-tier evaluation is a Phase 1 requirement.

### Envelope Score Components

The Envelope is built from seven signals, all available without any LLM call:

| Component | What It Measures | Healthy Range |
|-----------|-----------------|---------------|
| Retry ratio | Retries / total attempts | < 0.1 |
| Mutation count | DAG modifications during execution | 0-1 |
| Circuit breaker trips | Times a breaker opened | 0 |
| Compensation events | Saga compensations executed | 0 |
| Budget utilization | Spend / budget | < 0.8 |
| Timeout proximity | Max(time/timeout) across nodes | < 0.7 |
| Failure cascade depth | Max cascade chain length | 0 |

The Envelope interpretation:
- **clean** (0.9-1.0): No stress signals. The system had ample margin.
- **minor_stress** (0.7-0.9): Some retries or budget pressure. Normal for complex problems.
- **significant_stress** (0.5-0.7): Multiple stress signals. Worth investigating.
- **near_failure** (0.3-0.5): The system barely succeeded. Fix the underlying issue.
- **survival** (0.0-0.3): Extensive compensation, near-timeout, cascade. The result may be correct but the process was fragile.

## The Learning Loop

The complete cycle:

```
Problem -> Sensemaker -> Decomposer -> [Wave-by-Wave Execution] ->
  Evaluator (Stage 1 + Stage 2) ->
    Learning Engine (Thompson + Elo + Method + Topology) ->
      Looking Back (Polya Q1-Q4) ->
        Curator (if crystallization criteria met) ->
          Knowledge Library (improved for next execution)
```

Four levels of learning, phased:

| Level | What Is Learned | Mechanism | Phase |
|-------|----------------|-----------|-------|
| Skill Quality | Which skills work for which tasks | Thompson sampling + Elo | Phase 1 |
| Method Quality | Which decomposition strategies work | Thompson on methods | Phase 1 |
| Coordination Topology | Which coordination models work | Topology fingerprinting | Phase 2 |
| Compiled Optimization | End-to-end pipeline optimization | DSPy compilation | Phase 3 |

---

# Key Design Bets

Every architecture makes bets. These are the five biggest bets in V3, stated plainly so that future engineers can evaluate whether they paid off.

## Bet 1: Vague Nodes Over Static Decomposition

We bet that decomposing problems progressively (expanding vague nodes as upstream work completes) will produce better results than decomposing everything upfront, even though progressive decomposition is harder to implement and harder to explain to users.

**The evidence**: HTN's SHOP2 data shows 34.78% cascading task failure for static decomposition vs. 4.35% for dynamic. That is an 8x reduction in the most damaging failure mode. The cost is implementation complexity and a UX challenge (the DAG changes shape mid-execution).

**How we will know if we are wrong**: If >80% of DAGs end up using static decomposition (all nodes concrete at planning time), the progressive machinery is overhead without value.

## Bet 2: Four-Dimensional Failure Classification

We bet that classifying failures on four dimensions (system, cognitive, decomposition, protocol) produces better remediation than a single taxonomy, even though most failures in Phase 1 will only use the system layer dimension.

**The evidence**: HTN's observation that "execution failures that repeat despite retries usually indicate decomposition-level problems misdiagnosed as execution-level problems." Single-taxonomy systems cannot distinguish these cases.

**How we will know if we are wrong**: If the cognitive, decomposition, and protocol dimensions rarely change the remediation decision compared to system-layer-only classification after 1000 failures.

## Bet 3: Method-Level Learning

We bet that learning which decomposition methods work for which problem types (not just which skills work) will produce the largest quality improvement per unit of engineering effort.

**The evidence**: Decomposition quality determines everything downstream. A bad decomposition with great skills still produces bad results. Method-level learning directly improves decomposition quality.

**How we will know if we are wrong**: If method-level Thompson sampling does not converge faster than skill-level Thompson sampling after 500 executions.

## Bet 4: Two-Stage Review

We bet that having a cheap contract review (Stage 1) on every node and an expensive cognitive review (Stage 2) on selected nodes will be more cost-effective than either reviewing everything deeply or reviewing nothing until the end.

**The evidence**: The economic threshold formula (`P(failure) * downstream_waste > Stage_2_cost`) means Stage 2 runs only when the expected cost of missing a failure exceeds the cost of the review. Stage 1 catches 60-70% of issues at 100x lower cost.

**How we will know if we are wrong**: If Stage 2 review catches <5% of issues not already caught by Stage 1, the cognitive review is not adding value proportional to its cost.

## Bet 5: The Learning Loop as Moat

We bet that accumulated execution data (skill rankings, method quality, failure patterns) creates a defensible competitive advantage that raw technology cannot replicate.

**The evidence**: Every competitor starts at zero. An organization that has run 10,000 DAGs through WinDAGs has 10,000 executions of learning data that a new entrant cannot import or replicate. The CEO's analysis: 12-18 month window before well-funded competitors close the technology gap, but the data moat deepens continuously.

**How we will know if we are wrong**: If organizations switch orchestration tools and experience no quality regression, the learning data was not creating value.

---

# What This Document Does Not Cover

This constitution specifies the architecture. It does not specify:

- **Seed template library**: The specific 10+ templates for Phase 1 (PM review requirement -- to be defined in the Phase 1 implementation plan).
- **First-run experience**: The onboarding flow, first screen, guided path (PM/Design Lead review requirement -- to be designed separately).
- **Competitive quickstart benchmark**: How WinDAGs' time-to-hello-world compares to LangGraph/AutoGen (PM review requirement -- to be measured during Phase 1).
- **90-second canonical demo**: The scripted demonstration of the learning loop (Ad Creative review requirement -- to be produced during go-to-market).
- **Open-source/commercial license boundary**: Apache 2.0 core vs. BSL 1.1 commercial (Market review requirement -- to be documented in a separate licensing document).
- **Name audit results**: Whether "WinDAGs" is the right product name (Ad Creative review requirement -- to be tested separately).

These are real gaps. They are flagged here so that readers understand the boundary of what this document commits to and what remains to be resolved.

## Relationship to Other Documents

This constitution is the authoritative architectural specification. It supersedes all prior drafts and the V2 Constitution. Other documents in the WinDAGs V3 ecosystem:

| Document | Relationship | Status |
|----------|-------------|--------|
| **V2 Constitution** (SKILL.md + 6 references) | Superseded. V3 retains compatible mechanisms (Thompson, Elo, SKILL.md format) but restructures everything else. | Archived |
| **Phase 4 Consolidated Specification** (4,476 lines) | The complete reference. Contains all 157 type definitions and 7 implementation pseudocode modules not fully reproduced here. | Reference |
| **Phase 5 Preservation Audit** | Verified V2 concept coverage. 445 concepts mapped: 90.3% present, 7.9% deferred, 1.8% missing (none non-negotiable). | Complete |
| **Phase 5 Review Brief** | Condensed blocking concerns from 9 reviewers. All concerns addressed in this constitution (see Part 5, Appendix N). | Resolved |
| **Phase 1 Implementation Plan** | To be derived from this constitution's Phase 1 roadmap (Part 4). Engineering team produces this. | Pending |
| **First-Run Experience Design** | To be designed by the Design Lead. This constitution specifies the progressive disclosure architecture but not the UX flow. | Pending |
| **Licensing Document** | Apache 2.0 / BSL 1.1 boundary. Deferred to a separate legal-informed document. | Pending |

Engineers implementing Phase 1 should read this constitution (Parts 1-4) and refer to the Phase 4 Consolidated Specification for complete type definitions and pseudocode that extend beyond what this document includes.

---

*End of Part 1. Continue to Part 2 for the detailed specification of Topics 1-4.*
# WinDAGs V3 Constitution -- Part 2: Core Runtime

**Topics covered**: Problem Understanding and Decomposition (Topic 1), Planning and Scheduling (Topic 2), Execution and Coordination (Topic 3), Failure Handling and Resilience (Topic 4).

These four topics define the runtime behavior of WinDAGs. A reader who finishes Part 2 understands how the system takes a problem and produces a result.

---

## Topic 1: Problem Understanding and Decomposition

### Why This Matters

The quality of everything downstream -- scheduling, execution, evaluation, learning -- depends on the quality of decomposition. HTN's empirical data is stark: 899 of 904 problems solved correctly when using domain-specific decomposition methods. The three-pass protocol exists because no single decomposition lens is sufficient.

### ADR-001: Decomposition Driver Priority

**Decision**: Three sequential passes. Problem structure first (Polya/HTN), capability matching second (MAS/BDI), topology validation third (Distributed Systems/Resilience Engineering).

**Rationale**: Information availability determines ordering. Problem structure is available immediately. Capability matching requires the skill catalog. Failure surface analysis requires the decomposition itself. This ordering satisfies all camps while preserving cost-efficiency.

**Dissent**: MAS argued that capability structure should co-determine decomposition, not just validate it. The convention noted this and set a revisit condition: if >30% of decompositions require significant revision after capability matching, elevate Pass 2 to co-equal with Pass 1. MAS conceded in Phase 3: "MAS's Phase 1 scope recommendation was wrong."

### ADR-002: Vague Node Expansion Protocol

**Decision**: Four-layer priority cascade for expanding vague nodes:

1. **Conjecture Formation** (Lakatos): State what the expanded sub-DAG should produce and what would prove it wrong. Applied only to EXPLORATORY nodes.
2. **Pattern Recognition** (NDM/RPD + BDI): Match upstream outputs against known expansion patterns. If confidence >= 0.8, use directly with post-hoc validation.
3. **Structured Elicitation** (CTA): When no pattern matches, run Klein's Critical Decision Method: incident reconstruction, decision point identification, cue inventory.
4. **Compilation Over Time** (DSPy): Background optimization from execution traces.

Each layer handles a different scenario. Recognition handles familiar problems fast. Elicitation handles novel problems thoroughly. Compilation improves everything over time.

### ADR-003: Epistemic Annotation Depth

**Decision**: Graduated annotation based on commitment level:

| Level | Annotation Depth | When Used |
|-------|-----------------|-----------|
| COMMITTED | Minimal: task signature, method reference, preconditions | High-confidence, well-understood tasks |
| TENTATIVE | Moderate: add uncertainties, reconsideration triggers, alternatives | Partially recognized tasks |
| EXPLORATORY | Full: beliefs, conjectures, refutation surfaces, falsification costs | Novel tasks, low confidence |

80%+ of nodes in mature domains are COMMITTED. This satisfies BDI's demand for epistemic transparency on uncertain nodes without imposing overhead on every node.

### ADR-004: Communication Topology Awareness

**Decision**: Topology analysis is a validation step after decomposition (Pass 3), not a driver of decomposition. Conway's Law is treated as a strong empirical heuristic, not a mathematical theorem.

### Key Type Definitions

```typescript
type ProblemType = 'well-structured' | 'ill-structured' | 'wicked';
type CommitmentLevel = 'COMMITTED' | 'TENTATIVE' | 'EXPLORATORY';

interface PrincipalParts {
  unknown: string;           // What must be produced
  data: string[];            // What is given
  condition: string[];       // Constraints that must hold
  output_type: string;       // Classification of the required output
}

interface ProblemUnderstanding {
  principal_parts: PrincipalParts;
  problem_type: ProblemType;
  recognition_confidence: number;  // 0.0 to 1.0
  domain_classification: string;
  matched_meta_skill: string | null;
  validity_assessment: ValidityAssessment;
  halt_decision: 'PROCEED' | 'HALT_CLARIFY';
  halt_reason?: string;
}

interface ValidityAssessment {
  clarity: number;       // 0.0-1.0
  feasibility: number;   // 0.0-1.0
  coherence: number;     // 0.0-1.0
  overall: number;       // Weighted average; < 0.6 triggers HALT_CLARIFY
}

interface VagueNode {
  id: string;
  type: 'vague';
  role_description: string;
  dependency_list: string[];
  expansion_conjecture?: string;     // Lakatos
  refutation_surface?: string[];     // Lakatos
  estimated_expansion_depth: number; // HTN
  commitment_level: CommitmentLevel;
}

interface DecompositionResult {
  // Pass 1: Problem structure
  task_hierarchy: TaskHierarchyNode;
  meta_skill_used: string | null;
  // Pass 2: Capability matching
  capability_gaps: CapabilityGap[];
  revised_hierarchy?: TaskHierarchyNode;
  // Pass 3: Topology validation
  topology_warnings: TopologyWarning[];
  failure_domains: FailureDomain[];
  cascade_depth_score: number;  // 0.0 (safe) to 1.0 (dangerous)
  // Final
  dag: DAGDefinition;
  waves: WaveDefinition[];
}
```

### The Halt Gate in Practice

*Addressing the PM's review concern: "What does the user see at clarity < 0.6?"*

When the halt gate fires, the user sees a structured clarification request, not a generic error. The Sensemaker identifies which component of the validity assessment failed:

| Failed Component | Example User Prompt | System Response |
|-----------------|--------------------|-----------------|
| clarity < 0.6 | "Make the thing better" | "I need to understand what you want improved. Can you specify: (1) what 'the thing' refers to, (2) what aspect needs improvement, (3) what 'better' means in this context?" |
| feasibility < 0.6 | "Write a compiler in 5 minutes" | "This problem requires more resources than available. A compiler implementation typically requires [X]. Would you like to: (a) narrow the scope to a specific language feature, (b) produce a design document instead, (c) adjust the time constraint?" |
| coherence < 0.6 | "Build a REST API that has no endpoints" | "The requirements appear contradictory: a REST API is defined by its endpoints. Did you mean: (a) an API with dynamically generated endpoints, (b) a server that routes all requests to a single handler, (c) something else?" |

The system guides the user toward a well-formed problem. It does not simply reject the input.

### Domain Meta-Skills

A domain meta-skill is compiled expert knowledge about how to decompose problems in a specific domain. It provides the decision tree that the Decomposer consults in Pass 1.

```typescript
interface DomainMetaSkill {
  id: string;
  domain: string;                        // "software-engineering", "research"
  phase_pattern: string[];               // ["research", "plan", "build", "test"]
  decision_tree: DecisionNode;           // When to apply which phases
  method_library_ids: string[];          // Associated decomposition methods
  source: 'expert-curated' | 'crystallized' | 'llm-generated';
  quality_history: QualityHistory;
}

interface DecisionNode {
  condition: string;                     // "Is this greenfield?"
  if_true: string[] | DecisionNode;      // Phases or nested decision
  if_false: string[] | DecisionNode;
}
```

Phase 1 ships with 5-10 curated meta-skills (software engineering, research, data analysis, content creation, code review). Additional meta-skills crystallize from execution data as the system matures.

### Behavioral Contracts

**BC-DECOMP-001**: The Sensemaker MUST evaluate problem validity before producing a ProblemUnderstanding. If `validity_assessment.overall < 0.6`, the system MUST halt and request clarification. It MUST NOT produce a DAG for a problem it does not understand.

**BC-DECOMP-002**: The Decomposer MUST execute all three passes of ADR-001 in order. Pass 2 MUST NOT invoke LLM calls -- it operates on skill metadata only. Pass 3 MAY be skipped for DAGs with depth < 3 and no parallel batches.

**BC-DECOMP-003**: Vague nodes MUST carry a `role_description` and `dependency_list`. They MUST NOT carry an `agent` configuration -- agent assignment happens at expansion time.

**BC-DECOMP-004**: Wave-by-wave planning MUST plan Wave N only after Wave N-1 completes. Upfront planning of all waves is permitted only when the domain meta-skill explicitly allows it AND recognition confidence >= 0.9.

**BC-DECOMP-005**: Every decomposition event MUST be logged with the meta-skill used, the method selected, the commitment level assigned, and the three-pass scores.

---

## Topic 2: Planning and Scheduling

### Why This Matters

Planning and scheduling are distinct cognitive operations. The planner decides what to do and in what order. The scheduler decides when to do it, with which resources, and how to handle resource contention. Mixing them produces systems that are hard to debug and impossible to optimize independently.

### ADR-005: Planning-Scheduling Separation

**Decision**: Planning and scheduling are distinct phases within each wave.

- **Planning Phase**: Method selection, precondition checking, subtask ordering, skill assignment. Produces a partially-ordered task graph.
- **Scheduling Phase**: Topological sort (Kahn's algorithm), parallel batch identification, priority ordering, model tier assignment, failure-domain isolation. Converts the task graph into a concrete execution timeline.

HTN's SHOP2 data shows that planning in execution order eliminates hypothetical state reasoning, which is expensive and error-prone for LLM planners.

### ADR-006: Scheduling Interleaving Granularity

**Decision**: Two-level interleaving:

- **Between waves**: Full replanning. New wave incorporates all results from completed waves. This is the primary adaptation point.
- **Within waves**: Batch scheduling with event-driven preemption. Schedule all tasks as a batch. Monitor. Trigger preemption on significant events (failures, quality drops, budget exceeded).

**Dissent**: BDI argued for per-task interleaving (Jason's "one step per intention per cycle"). Revisit condition: if mid-batch preemption rates exceed 50%, per-task interleaving would have been cheaper.

### ADR-007: Skill Selection Cascade

**Decision**: Five-step cascade:

1. **Signature Compatibility** (DSPy) -- hard filter. Eliminate skills whose output cannot connect to downstream inputs.
2. **Context Conditions** (BDI) -- hard filter. Eliminate skills whose preconditions are not met.
3. **Output Type + Domain Relevance** (Polya) -- soft ranking. Prioritize by output type and domain match.
4. **Pattern Recognition Fast Path** (NDM/RPD) -- shortcut. If confidence >= 0.8, skip steps 1-3 and go to matched skill (with post-hoc validation).
5. **Thompson Sampling** (V2) -- exploration/exploitation among remaining candidates.

Hard filters prevent category errors. Soft ranking improves quality. Pattern recognition provides speed. Thompson sampling provides exploration.

### ADR-008: Inter-Node Protocol Typing

**Decision**: Edges have typed communication semantics with a strong default:

| Edge Type | Semantics | When Used |
|-----------|-----------|-----------|
| `data-flow` | Simple data passing + typed failure feedback | Default (80%+ of edges) |
| `contract` | Quality-gated handoff | Human gates, final deliverables |
| `request` | Pull-based: downstream requests specific data | Optional dependencies |
| `subscription` | Streaming: upstream pushes updates | Long-running nodes |
| `auction` | Competitive: multiple skills bid | Critical skill selection |

The `data-flow` default always includes typed failure semantics (failure type, affected nodes, remediation hint). This is zero-overhead because it only activates on failure.

### ADR-009: PreMortem Conditionality

**Decision**: Conditional depth, not conditional execution. Always run a lightweight failure scan (< 1 second, pattern-match against known failure modes). Escalate to full PreMortem based on recognition confidence and DAG complexity.

Lightweight scan: ~$0.001. Full analysis: ~$0.01-0.05.

### Key Type Definitions

```typescript
interface WaveDefinition {
  wave_number: number;
  nodes: string[];
  vague_nodes_to_expand: string[];
  planned_at: string;
  replanning_reason?: string;
}

interface Method {
  id: string;
  task_signature: string;
  preconditions: string[];
  subtask_list: string[];
  dependency_graph: Record<string, string[]>;
  quality_history: QualityHistory;
  elo_rating: number;
  thompson_params: ThompsonParams;
  source: 'expert-curated' | 'crystallized' | 'compiled';
}

interface ThompsonParams {
  alpha: number;   // Successes (Beta distribution)
  beta: number;    // Failures
  k_factor: number; // Stage-gated: 40/32/24/16
}

type DevelopmentalStage =
  | 'novice'      // 0-30 executions, K=40
  | 'competent'   // 30-200 executions, K=32, DANGER ZONE
  | 'proficient'  // 200-500 executions, K=24
  | 'expert';     // 500+ executions, K=16

type EdgeProtocol =
  | 'data-flow' | 'contract' | 'request'
  | 'subscription' | 'auction';

interface EdgeDefinition {
  from: string;
  to: string;
  protocol: EdgeProtocol;
  failure_semantics: FailureSemantics;
}

interface FailureSemantics {
  failure_type?: string;
  affected_downstream: string[];
  remediation_hint?: string;
  saga_classification?: 'COMPENSATABLE' | 'PIVOT' | 'RETRIABLE';
}

interface PreMortemResult {
  scan_type: 'lightweight' | 'full';
  known_failure_patterns_detected: FailurePattern[];
  cascade_depth_estimate: number;
  saga_classification: Record<string, 'COMPENSATABLE' | 'PIVOT' | 'RETRIABLE'>;
  recommendation: 'accept' | 'revise' | 'escalate_to_human';
}
```

### Behavioral Contracts

**BC-PLAN-001**: The Planning Phase MUST complete before the Scheduling Phase begins within each wave. The planner MUST NOT make scheduling decisions. The scheduler MUST NOT make planning decisions.

**BC-PLAN-002**: Skill selection MUST execute the hard filters (signature compatibility, context conditions) before any soft ranking or statistical selection. A skill that fails either hard filter MUST NOT be selected regardless of Elo rating.

**BC-PLAN-003**: The scheduler MUST NOT place nodes sharing a failure domain in the same parallel batch unless explicitly overridden by the user.

**BC-PLAN-004**: PreMortem MUST run on every DAG (lightweight scan minimum). The system MUST NOT skip the lightweight scan even for depth-1 DAGs.

**BC-PLAN-005**: Edge protocol assignment is a planning-phase decision. The scheduler MUST NOT change edge protocols at runtime.

### Scheduling Priority Weights

When multiple nodes are ready for execution, the scheduler uses weighted priority:

```typescript
interface SchedulingPriority {
  critical_path_weight: number;   // Default: 0.3 — prioritize bottleneck nodes
  fan_out_weight: number;         // Default: 0.2 — prioritize nodes that unblock many
  failure_rate_weight: number;    // Default: 0.3 — fail-fast: run risky nodes first
  negative_cost_weight: number;   // Default: 0.2 — cheaper nodes first
}
```

The fail-fast principle (failure_rate_weight = 0.3) is counterintuitive but critical: running likely-to-fail nodes early prevents wasting resources on downstream work that would be invalidated by the failure. A node with a 40% failure rate that blocks 5 downstream nodes should execute before a 5% failure rate node that blocks 1.

### Checkpoint Strategy

Checkpoint granularity determines how much work is lost on failure:

| Strategy | Granularity | Overhead | When Used |
|----------|------------|----------|-----------|
| per-wave | Full state saved after each wave | Low | Default for most DAGs |
| per-batch | Full state saved after each batch within a wave | Medium | DAGs with >10 nodes per wave |
| per-node | Full state saved after each node | High | High-stakes DAGs with irreversible steps |

Checkpoint strategy is a planning-phase decision (ADR-005 boundary respected).

---

## Topic 3: Execution and Coordination

### Why This Matters

Execution is where the architecture meets reality. The execution engine must handle DAG mutation as a first-class operation (not an exception), manage progressive context summarization across waves, and enforce coordination protocols through infrastructure rather than hoping agents follow them.

### ADR-010: Coordination Model Phasing

**Decision**: Ship DAG-only in Phase 1. Add Team in Phase 2. Add Market in Phase 3. Blackboard and Hierarchical only if usage data shows demand.

| Phase | Models | Justification |
|-------|--------|---------------|
| Phase 1 | DAG only | Proven. No new complexity. |
| Phase 2 | DAG + Team | Team = special DAG region with bidirectional edges and voting |
| Phase 3 | DAG + Team + Market | Market formalizes Thompson sampling as coordination |
| Phase 4 | + Blackboard, Hierarchical | Only if data warrants |

**Critical requirement**: Implement the coordination model abstraction interface in Phase 1, even though only DAG is available. Adding new models must not require engine redesign.

**Dissent**: MAS argued this is too conservative and risks being architecturally indistinguishable from LangGraph. MAS conceded in Phase 3: "MAS must concede this not just as a pragmatic accommodation but as the correct architectural decision." The abstraction interface is the insurance policy.

### ADR-011: Context Store Architecture

**Decision**: Three-layer communication architecture:

1. **Transport Layer** (BDI): Event bus with internal/external event unification.
2. **Session Layer** (MAS/Distributed Systems): Protocol enforcement with state machines for non-default edge protocols. Infrastructure enforces protocol; LLM provides content.
3. **Application Layer** (HTN/DSPy): Token-budgeted context windows with progressive summarization:
   - Wave N-1 outputs: full text
   - Wave N-2 outputs: summaries (2-3 sentences)
   - Wave N-3+ outputs: one-liners

**Consistency model**: Read-your-writes for direct dependencies. Eventual consistency for cross-edge access.

### ADR-012: Commitment Strategy as Node Property

**Decision**: Every node carries a commitment strategy that determines its persistence-vs-adaptability policy:

| Strategy | Behavior | Reconsideration Trigger |
|----------|----------|------------------------|
| COMMITTED | Persist until completion or hard failure | Hard failure only |
| TENTATIVE | Persist unless preconditions invalidated | Upstream failure, quality drop, belief update |
| EXPLORATORY | Reconsider frequently | Any significant event, periodic checkpoint |

Set by the planner based on recognition confidence and problem type. Users can override at the node level.

### ADR-013: Dynamic Topology Mutation

**Decision**: DAG mutation during execution is a first-class operation. Mutation types:

| Type | Trigger | Safety Check |
|------|---------|-------------|
| Add node | Gap in output | Mark COMPENSATABLE |
| Remove node | Proved redundant | Verify no downstream dependency |
| Replace node | 3+ failures | Log reason, preserve trace |
| Add edge | New dependency discovered | Acyclicity check |
| Fork | Ambiguous approach | Budget check (doubles cost) |
| Expand vague | Upstream wave complete | ADR-002 protocol |
| Loop back | Quality below threshold | Circuit breaker (max loop count) |

Every mutation is logged as a first-class `MutationEvent` with before/after structural diffs.

### Key Type Definitions

```typescript
type NodeStatus =
  | 'pending' | 'scheduled' | 'running' | 'completed'
  | 'failed' | 'retrying' | 'paused' | 'skipped' | 'mutated';

type CommitmentStrategy = 'COMMITTED' | 'TENTATIVE' | 'EXPLORATORY';

interface DAGDefinition {
  id: string;
  name: string;
  nodes: (ConcreteNode | VagueNode | HumanGateNode)[];
  edges: EdgeDefinition[];
  execution: DAGExecutionConfig;
  coordination_model: CoordinationModel;
}

interface HumanGateNode {
  id: string;
  type: 'human-gate';
  prompt: string;
  outcomes: string[];
  timeout_ms?: number;
  input: NodeInput;
  output: NodeOutput;
}

type CoordinationModelType =
  | 'dag' | 'team' | 'market'
  | 'blackboard' | 'hierarchical' | 'debate';

interface CoordinationModel {
  type: CoordinationModelType;
  failure_semantics: CoordinationFailureSemantics;
  evaluation_architecture: EvaluationArchitecture;
}

interface ContextStore {
  get_relevant_context(
    target_node_id: string,
    current_wave: number,
    token_budget: number
  ): ContextWindow;
}

interface ContextWindow {
  full_entries: ContextEntry[];        // Wave N-1
  summary_entries: ContextSummary[];   // Wave N-2
  oneliner_entries: ContextOneLiner[]; // Wave N-3+
  total_tokens: number;
  budget_utilization: number;
}

interface MutationEvent {
  id: string;
  timestamp: string;
  mutation_type: 'add_node' | 'remove_node' | 'replace_node'
    | 'add_edge' | 'fork' | 'expand_vague' | 'loop_back';
  trigger: string;
  affected_nodes: string[];
  before_snapshot: DAGStructuralDiff;
  after_snapshot: DAGStructuralDiff;
  recommending_agent: string;
  saga_classification?: 'COMPENSATABLE' | 'PIVOT' | 'RETRIABLE';
}
```

### Behavioral Contracts

**BC-EXEC-001**: The Executor MUST use Kahn's algorithm for topological scheduling. Parallel batches MUST respect failure domain isolation.

**BC-EXEC-002**: Every DAG mutation MUST be logged as a MutationEvent. No silent DAG modifications.

**BC-EXEC-003**: Commitment strategy reconsideration MUST be evaluated on every significant event for EXPLORATORY nodes, on precondition-invalidating events for TENTATIVE nodes, and on hard failures only for COMMITTED nodes.

**BC-EXEC-004**: The Context Store MUST apply progressive summarization. Wave N-1 in full. Wave N-3+ as one-liners. The system MUST NOT load full content from waves older than N-2 unless explicitly requested and within token budget.

**BC-EXEC-005**: The coordination model abstraction interface MUST be implemented in Phase 1. Adding a new coordination model MUST NOT require engine redesign.

**BC-EXEC-006**: Protocol enforcement MUST be handled by infrastructure, not by the LLM agent. LLMs provide content; infrastructure enforces state machine transitions.

### DAG Execution Modes

Different deployment contexts require different execution approaches:

```typescript
interface DAGExecutionConfig {
  mode: 'sequential' | 'async' | 'multiprocess' | 'container' | 'temporal';
  max_parallel: number;
  total_timeout_ms: number;
  total_cost_budget_usd: number;
  deliberation_budget: DeliberationBudget;
}
```

| Mode | When Used | Phase |
|------|-----------|-------|
| sequential | Development, debugging, single-node DAGs | Phase 1 |
| async | Default: concurrent node execution via Promise.allSettled | Phase 1 |
| multiprocess | CPU-bound nodes, code execution | Phase 1 |
| container | Side-effecting nodes requiring isolation | Phase 2 |
| temporal | Production: durable execution with automatic retries and checkpoints | Phase 2 |

### Deliberation Budget Configuration

The deliberation budget is set once at the start of execution based on problem classification. It determines how deeply the system thinks at every downstream operation:

```typescript
interface DeliberationBudget {
  max_cost_usd: number;
  max_execution_ms: number;
  max_decomposition_depth: number;
  max_parallel: number;
  stage2_budget_fraction: number;   // Fraction of budget for Stage 2 reviews
  looking_back_scope: 'always' | 'non-trivial' | 'deep';
  premortem_depth: 'lightweight' | 'standard' | 'deep';
}
```

Mapping from problem classification:

| Problem Type | Recognition Confidence | Decomposition | Evaluation | Looking Back |
|-------------|----------------------|---------------|------------|-------------|
| well-structured | >= 0.8 | minimal | stage1-only | Q1-Q2 |
| well-structured | 0.6-0.8 | standard | stage1-and-stage2 | Q1-Q3 |
| ill-structured | any | deep | stage1-and-stage2 | Q1-Q3 |
| wicked | any | deep | full-with-human | full |

The deliberation budget classification costs one Haiku-class call (~$0.001) and saves potentially many unnecessary Sonnet calls. This is the system's most cost-effective operation.

### Wave Transition Design

*Addressing the Design Lead's concern about jarring graph morphing.*

When the DAG transitions between waves, the UI handles the structural change in three steps:

1. **Announce**: A wave transition banner appears. Completed wave nodes dim slightly. The new wave region highlights.
2. **Expand**: Vague nodes being expanded animate from their placeholder position. The expansion unfolds over 300ms: the single vague node splits into its sub-DAG, with new edges appearing as dashed lines that solidify over 200ms.
3. **Settle**: ELKjs auto-layout repositions the graph smoothly. Existing nodes shift to accommodate new nodes. The transition uses spring animation (200ms) rather than instant repositioning.

The animation vocabulary for wave transitions:
- Vague node expand: scale from 1x to 0.5x, then split into sub-nodes at 0.5x, then scale each to 1x
- New edges: appear as dashed lines, transition to solid over 200ms
- Repositioned nodes: spring animation to new positions
- Wave boundary: horizontal separator line fades in

This prevents the "DAG explodes" problem that occurs when nodes appear all at once.

---

## Topic 4: Failure Handling and Resilience

### Why This Matters

Every AI orchestration system handles the happy path. What distinguishes a production system is how it handles failure. WinDAGs treats failures as typed, multi-dimensional events that carry diagnostic information sufficient to determine the correct remediation. A timeout and a confident wrong answer require fundamentally different responses -- the system must know the difference.

### Human Gate Timeout Authority

*Addressing the Chef's blocking concern: "What happens when a human gate times out?"*

Human gates have a timeout. When a gate times out, the system has three options, configured per-gate:

| Option | When Used | Behavior |
|--------|-----------|----------|
| fail_dag | IRREVERSIBLE gates (default) | The DAG fails. The human's absence is treated as a veto. |
| escalate | QUALITY_CHECK gates | Notify an alternate reviewer. If no response in 2x timeout, fail. |
| proceed_with_default | CALIBRATION gates | The system proceeds with its recommendation. Logged prominently. |

The timeout authority is set by the planner based on the gate's irreversibility classification (see Part 3, UX section). Users can override. The default for all human gates is `fail_dag` because silent automatic decisions on human-gate-protected steps violate the trust contract.

### Execution Isolation Tiers

Different nodes require different levels of isolation:

```typescript
type IsolationTier =
  | 'shared-process'    // Default: agents share event bus
  | 'process-level'     // Side-effecting nodes: IPC-based event delivery
  | 'container-level';  // High-stakes: message-queue-only communication
```

Isolation tier is assigned during Pass 3 (topology validation). Nodes that call external APIs, write files, or execute code get `process-level` or higher. The isolation tier determines the communication mechanism between the node and the rest of the DAG.

### ADR-014: Multi-Dimensional Failure Classification

**Decision**: Every failure is tagged on four dimensions simultaneously:

| Dimension | Types | Response Channel |
|-----------|-------|-----------------|
| System Layer | crash, crash-recovery, omission, Byzantine | Retry, compensate, escalate |
| Cognitive Mechanism | misclassification, SA-shift, queue_exhaustion, articulation_gap, availability_bias | Root cause, prevention |
| Decomposition Level | granularity_mismatch, semantic_gap, method_explosion, cascading_task_failure | Structural re-decomposition |
| Protocol Level | agent_level, interaction_level, organizational_level | Topology mutation |

**Example**: A node confidently produces incorrect output could be: Byzantine (system) + misclassification (cognitive) + semantic_gap (decomposition) + agent_level (protocol).

HTN's key insight: "Execution failures that repeat despite retries usually indicate decomposition-level problems misdiagnosed as execution-level problems." Multi-dimensional classification catches this.

### ADR-015: Failure Response Escalation Ladder

**Decision**: Diagnostic-informed escalation, not count-based:

| Level | Trigger | Response |
|-------|---------|----------|
| L1: Fix the node | First failure | Retry with better prompt, different model, alternative plan |
| L2: Diagnose structure | 3+ failures at same node | HTN health monitor: granularity mismatch? Semantic gap? Method explosion? |
| L3: Generate alternative | 3+ re-decompositions | Polya auxiliary strategies: restate, simplify, specialize, analogize, generalize, work backward |
| L4: Fix topology | Persistent coordination failure | Insert intermediary agents, change edge protocols, Conway-informed restructuring |
| L5: Human escalation | All automated approaches exhausted | Full failure trace, decomposition history, recommended actions |

L2 activates not after a fixed count but when the failure pattern matches a decomposition-level signature.

### ADR-016: Byzantine Failure Handling

**Decision**: Layered by cost and stakes:

| Layer | Applied To | Method | Cost |
|-------|-----------|--------|------|
| L1: Compilation | All skills | Chain-of-verification at library admission | One-time |
| L2: Behavioral detection | All nodes | Process trace analysis for hallucination signatures | Cheap |
| L3: Cross-family ensemble | High-value nodes | Evaluators from different model families | Medium |
| L4: Adversarial evaluation | High-stakes nodes | Lakatos-style counterexample seeking | Expensive |
| L5: Human confirmation | Irreversible nodes | Human reviews before effect | Most expensive |

**Critical requirement**: L3 MUST use genuinely different model families. Two Claude models do not constitute independent evaluation.

**Important concession**: Distributed Systems conceded that "BFT quorum (2f+1) requires independence that LLMs violate." The practical mitigation stack replaces formal BFT.

### ADR-017: Circuit Breaker Architecture

**Decision**: Circuit breakers at three independent levels plus extended breakers:

- **Per-node**: Tracks failure rate for individual nodes. Standard CLOSED/OPEN/HALF_OPEN state machine.
- **Per-skill**: Tracks failure rate across all uses of a skill. Prevents a broken skill from affecting multiple DAGs.
- **Per-model**: Tracks failure rate for a model provider. Prevents provider outages from cascading.
- **Per-node cognitive** (NDM/RPD): Detects repetition density > 0.9 (agent stuck in loop).
- **Per-DAG decomposition** (HTN): Detects mutation cycles > 3 per wave.

### Key Type Definitions

```typescript
interface FailureEvent {
  id: string;
  timestamp: string;
  node_id: string;
  dag_id: string;
  wave: number;
  system_layer: SystemLayerFailure;
  cognitive_mechanism?: CognitiveFailure;
  decomposition_level?: DecompositionFailure;
  protocol_level?: ProtocolFailure;
  error_message: string;
  escalation_level: 1 | 2 | 3 | 4 | 5;
  response_taken: string;
  response_classification: 'progressive' | 'degenerating';
}

type SystemLayerFailure =
  | 'crash' | 'crash_recovery' | 'omission' | 'byzantine';

type CognitiveFailure =
  | 'misclassification' | 'sa_shift_failure'
  | 'queue_exhaustion' | 'articulation_gap' | 'availability_bias';

type DecompositionFailure =
  | 'granularity_mismatch' | 'semantic_gap'
  | 'method_explosion' | 'cascading_task_failure';

interface CircuitBreaker {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failure_count: number;
  threshold: number;
  cooldown_ms: number;
}

interface SagaNode {
  node_id: string;
  classification: 'COMPENSATABLE' | 'PIVOT' | 'RETRIABLE';
  forward_action: string;
  compensating_action?: string;
  compensation_limitations?: string;
  is_irreversible: boolean;
}

interface ResilienceFramework {
  prevention: PreventionLayer;
  detection: DetectionLayer;
  containment: ContainmentLayer;
  recovery: RecoveryLayer;
  adaptation: AdaptationLayer;
}
```

### Behavioral Contracts

**BC-FAIL-001**: Every failure MUST be classified on at least the System Layer dimension. Cognitive, Decomposition, and Protocol dimensions are populated at L2+ of the escalation ladder.

**BC-FAIL-002**: The escalation ladder MUST be followed in order. No skipping from L1 to L5.

**BC-FAIL-003**: Byzantine handling at L3 MUST use genuinely different model families. Same-provider models (Claude Haiku + Claude Sonnet) do NOT constitute independent evaluation.

**BC-FAIL-004**: Circuit breakers MUST operate independently at all three levels. A per-skill breaker opening MUST NOT prevent other skills from executing.

**BC-FAIL-005**: Saga compensation MUST execute in reverse order. Compensation limitations MUST be logged honestly.

**BC-FAIL-006**: Failure response classification (progressive/degenerating) MUST be computed for every L2+ response. If a skill's monster-barring rate exceeds 50% over 3 revision cycles, trigger an invest/abandon evaluation.

### The Five-Layer Resilience Framework

Resilience Engineering contributed a five-layer framework that structures all failure-related operations:

```typescript
interface ResilienceFramework {
  prevention: {
    schema_validation: boolean;        // Catch format errors before execution
    budget_enforcement: boolean;       // Prevent runaway costs
    decomposition_health_check: boolean; // Detect bad decompositions early
  };
  detection: {
    cognitive_telemetry_enabled: boolean; // Track reasoning quality
    expectation_monitoring: boolean;     // NDM: expected vs. actual cues
    near_miss_logging: boolean;          // Quality barely above threshold
  };
  containment: {
    isolation_tier: IsolationTier;
    bulkhead_boundaries: string[];       // Resource pool boundaries
    circuit_breakers: CircuitBreakerRegistry;
  };
  recovery: {
    escalation_ladder: EscalationLevel[];
    saga_chains: SagaNode[];
    auxiliary_problem_strategies: string[]; // Polya: restate, simplify, etc.
  };
  adaptation: {
    failure_pattern_learning: boolean;   // Learn from failures
    near_miss_analysis: boolean;         // Learn from near-misses
    antifragility_testing: boolean;      // Chaos engineering (Phase 4)
  };
}
```

Each layer operates independently. Prevention catches what it can. Detection finds what prevention missed. Containment limits blast radius. Recovery fixes what broke. Adaptation ensures the same failure is less likely next time.

### ConfidentIncorrectError Detection Heuristic

*Addressing the EM's blocking concern.*

Byzantine failures (confident incorrect output) are the hardest to detect because the output looks correct. The heuristic:

1. **Structural check**: Does the output's structure match the expected schema but with implausible values? (e.g., a code review that approves code with obvious syntax errors)
2. **Consistency check**: Does the output contradict information available in the context store? (e.g., claiming a file exists when a previous node reported it does not)
3. **Confidence-accuracy calibration**: Is the agent's stated confidence significantly higher than its historical accuracy for this task type? (e.g., "I am 95% confident" from a skill with 60% accuracy)
4. **Downstream validation**: Does the output cause downstream nodes to fail in ways consistent with incorrect input? (Detected retroactively, feeds back into learning)

When any of these signals fire, the failure is classified as `byzantine` on the system layer and triggers L2+ of the escalation ladder.

### Failure Explanation Layer

*Addressing the Design Lead's blocking concern: "Translate 4D taxonomy to plain language."*

Users never see "Byzantine + misclassification + semantic_gap + agent_level." Instead, the failure explanation layer produces natural-language descriptions:

| Internal Classification | User-Facing Explanation |
|-----------------------|------------------------|
| system=byzantine, cognitive=misclassification | "This step produced an incorrect result with high confidence. The system applied the wrong approach to this type of problem." |
| system=omission | "This step timed out. It may need more time or a simpler approach." |
| system=crash | "This step encountered a technical error and stopped. The system will retry with a different approach." |
| decomposition=granularity_mismatch | "This step was too broad. The system is breaking it into smaller, more manageable pieces." |
| decomposition=semantic_gap | "The individual pieces worked, but they do not fit together correctly. The system is restructuring the approach." |

The failure explanation layer operates at L1 (Overview). L2 and L3 show the full 4D classification.

---

*End of Part 2. Continue to Part 3 for Topics 5-8: Learning, Evaluation, UX, and Business Model.*
# WinDAGs V3 Constitution -- Part 3: Value Creation Loop

**Topics covered**: Learning and Adaptation (Topic 5), Evaluation and Quality (Topic 6), User Experience and Visualization (Topic 7), Business Model and Positioning (Topic 8).

These four topics define how WinDAGs creates compounding value. The runtime (Part 2) solves problems. The value creation loop (Part 3) ensures each solved problem makes the next one easier.

---

## Topic 5: Learning and Adaptation

### Why This Matters

The learning loop is the moat (Principle 10). Without it, WinDAGs is a stateless orchestrator -- architecturally interchangeable with LangGraph, CrewAI, or AutoGen. With it, WinDAGs is a system that accumulates genuine expertise. The difference is not incremental; it is categorical.

### ADR-018: Multi-Level Structural Learning

**Decision**: Learning operates on a four-level hierarchy:

| Level | What Is Learned | Mechanism | Phase |
|-------|----------------|-----------|-------|
| Skill Quality | Which skills work for which tasks | Thompson sampling + Elo | Phase 1 |
| Method Quality | Which decomposition strategies work | Thompson on methods, indexed by task signature | Phase 1 |
| Coordination Topology | Which coordination models work for which problem classes | Topology fingerprinting + Thompson | Phase 2 |
| Compiled Optimization | End-to-end pipeline optimization | DSPy compilation from traces | Phase 3 |

Method-level learning is the highest-impact structural learning because decomposition quality determines everything downstream. HTN's data: 899/904 problems solved with domain-specific methods. Coordination topology learning requires multi-model coordination to exist first (Phase 2). DSPy compilation is the most powerful but most complex (Phase 3).

**Crystallization hierarchy** -- four forms of knowledge, with SKILL.md as source of truth:

1. **Skills** (SKILL.md) -- human-readable, version-controlled. The interchange format.
2. **Methods** (HTN) -- decomposition strategies indexed by task signature.
3. **Structural Rules** (BDI) -- DAG construction heuristics from mutation logs.
4. **Compiled Modules** (DSPy) -- runtime-optimized from skills + execution traces.

### ADR-019: Exploration Budget Management

**Decision**: Three mechanisms:

1. **Stage-gated K-factors** (NDM/RPD):
   - Novice (0-30 executions): K=40, maximum exploration
   - Competent (30-200 executions): K=32, DANGER ZONE -- heightened monitoring
   - Proficient (200-500 executions): K=24, reliable
   - Expert (500+ executions): K=16, minimal exploration, monitor for staleness

2. **Progressiveness modulation** (Lakatos): During progressive evolution (many novel successes), increase exploration +25%. During stagnation (no novel successes in 30 days), also increase +25% to break out of local optima.

3. **Curriculum-driven exploration** (DSPy): Deferred to Phase 3.

The "competent stage" (30-200 executions) is the most dangerous. The skill has enough successes to appear reliable but not enough to be truly validated. Heightened monitoring means: lower quality thresholds trigger Stage 2 review, failure events are always fully classified, and the Kuhnian crisis detector runs at higher sensitivity.

### ADR-020: Centralized State with Distribution-Ready Design

**Decision**: All learning state is centralized in Phase 1. Data structures are designed as merge-friendly from the start:

- Beta distribution parameters (alpha, beta) are naturally additive (G-Counter compatible)
- Elo ratings use element-wise maximum for conflict resolution
- Quality histories are append-only (log-structured)

Distribution becomes a deployment decision, not a redesign.

### ADR-021: Looking Back Protocol

**Decision**: Tiered post-execution reflection based on Polya's four questions:

| Tier | Questions | Cost | When |
|------|-----------|------|------|
| Always | Q1: Does result satisfy the contract? Q2: Did the argument rely on unstated assumptions? | ~$0.002 | Every DAG |
| Non-trivial | Q3: Could the same result have been achieved by a different topology? | ~$0.01 | Novel or complex DAGs |
| Deep | Q4: Can this solution method be generalized? | ~$0.05 | Crystallization candidates |

The Looking Back agent also computes: Polya progress trajectory (convergence, drift, repetition density), Lakatosian classification (progressive or degenerating), and the Envelope resilience score.

**Q3 and Q4 MUST run asynchronously** (BC-CROSS-009). They MUST NOT block returning results to the user.

### Cross-Deployment Skill Transfer Protocol

*Addressing the Sci-Fi Engineer's blocking concern about cold start.*

When a WinDAGs instance starts fresh or enters a new domain, it has no execution history. The cold-start protocol:

1. **Synthetic bootstrapping**: Run canonical test tasks against the skill library to pre-seed Thompson parameters. These are curated tasks with known-good outcomes that establish a baseline ranking without real user problems.

2. **Cross-deployment transfer** (Phase 2+): When transferring skills between deployments, transfer:
   - Skill rankings (Thompson alpha/beta)
   - Method quality scores
   - Failure patterns
   - Do NOT transfer: execution traces, user data, organizational context

3. **Domain distance conditioning**: Transferred rankings are discounted based on domain distance. A security audit skill's ranking from a fintech deployment gets a 0.8 multiplier when transferred to a healthcare deployment. Domain distance is estimated from task signature similarity.

4. **Privacy model**: Transferred learning state contains no user data. Thompson parameters and Elo ratings are aggregate statistics. Failure patterns are anonymized to the signature level.

### Heightened Monitoring in the Competent Stage

*Addressing the Chef's blocking concern: "Specify what 'heightened monitoring' means."*

The competent stage (30-200 executions) is dangerous because the skill appears reliable but has not been fully validated. Heightened monitoring means:

| Monitoring Aspect | Normal | Heightened |
|------------------|--------|-----------|
| Stage 2 review trigger | P*C threshold | Always triggered for quality < 0.85 |
| Failure classification | System layer only | Full 4D classification |
| Near-miss threshold | 10% margin | 20% margin (more sensitive) |
| Kuhnian crisis sensitivity | PSI >= 0.25 | PSI >= 0.15 |
| Cognitive telemetry | 5% sampling | 15% sampling |
| Looking Back depth | Q1-Q2 | Q1-Q3 always |

Heightened monitoring is automatically enabled when a skill transitions from novice to competent (30 executions). It is automatically disabled at proficient (200 executions) unless the skill shows quality instability.

### ADR-022: Monster-Barring Detection

**Decision**: The system tracks scope changes in skill evolution. The detector fires when:

```
skill.NOT_FOR_section_growth > 50% over last 3 revision cycles
AND
skill.WHEN_TO_USE_section_growth < 10% over same period
```

This catches a specific pathology: a skill that appears to improve (handles remaining cases well) but is actually shrinking (excludes more edge cases). When triggered: flag for invest/abandon evaluation using the Lakatosian framework -- count progressive improvements (expanded capability) vs. degenerating improvements (narrowed scope). If degenerating > progressive for 3 consecutive cycles: recommend ABANDON or REPLACE.

### Key Type Definitions

```typescript
type SkillLifecycleState =
  | 'crystallized' | 'unranked' | 'rising' | 'established'
  | 'dominant' | 'declining' | 'challenged' | 'superseded' | 'retired';

interface MultiDimensionalElo {
  overall: number;
  dimensions: {
    effectiveness: number;   // Weight: 0.30
    efficiency: number;      // Weight: 0.20
    reliability: number;     // Weight: 0.20
    cost: number;            // Weight: 0.15
    freshness: number;       // Weight: 0.15
  };
  domain: string;
}

interface KuhnianCrisisDetector {
  psi_score: number;          // Population Stability Index
  hellinger_distance: number;
  anomaly_count: number;
  crisis_threshold: number;   // Default: PSI >= 0.25
  phase: 'normal' | 'anomaly_accumulation' | 'crisis'
       | 'revolution' | 'new_paradigm';
}

interface CrystallizationCriteria {
  min_occurrences: number;              // Default: 3
  min_quality: number;                  // Default: 0.75
  max_recent_critical_failures: number; // Default: 0 in last 5
  pattern_similarity_threshold: number; // Default: 0.8
}

interface MonsterBarringDetector {
  skill_id: string;
  not_for_growth_rate: number;
  when_to_use_growth_rate: number;
  is_monster_barring: boolean;
  progressive_count: number;
  degenerating_count: number;
  recommendation: 'INVEST' | 'INVEST_CAUTIOUSLY' | 'ABANDON' | null;
}

interface NearMissEvent {
  node_id: string;
  dag_id: string;
  dimension: 'quality' | 'latency' | 'cost' | 'timeout';
  threshold: number;
  actual: number;
  margin: number;  // 0.0 = at limit
}

interface LookingBackResult {
  tier: 'always' | 'non-trivial' | 'deep';
  q1_contract_satisfied: boolean;
  q2_unstated_assumptions: string[];
  q3_alternative_topology?: string;
  q4_generalizable_method?: string;
  progress_trajectory: ProgressTrajectory;
  lakatosian_classification: 'progressive' | 'degenerating' | 'neutral';
  resilience_score: number;
}

interface DecompositionQuality {
  independence_ratio: number;  // % nodes with no shared failure domain
  mutation_rate: number;       // Mutations per node per wave
  ctf_rate: number;            // Cascading Task Failure rate
  depth_efficiency: number;    // Actual vs. theoretical minimum
  method_hit_rate: number;     // % nodes with a matching library method
}
```

### Behavioral Contracts

**BC-LEARN-001**: Thompson sampling parameters MUST be updated after every node execution. The update MUST use the quality score from the Evaluator, not the node's self-assessment.

**BC-LEARN-002**: Method quality MUST be tracked independently of skill quality. Good decomposition + poor skill execution indicates a skill problem, not a method problem.

**BC-LEARN-003**: Looking Back MUST run at least Q1-Q2 after every DAG completion. Not skippable for performance.

**BC-LEARN-004**: Near-miss events MUST be logged when any metric falls within 10% of its threshold.

**BC-LEARN-005**: Monster-barring detection MUST run on every skill revision. Not overridable by the skill author.

**BC-LEARN-006**: Learning state MUST be stored in G-Counter-compatible data structures. Distribution achievable without redesign.

---

## Topic 6: Evaluation and Quality

### Why This Matters

Evaluation is the signal that feeds the learning loop. If evaluation is biased, noisy, or cheap in the wrong places, the learning loop amplifies errors rather than correcting them. V3 treats evaluation as a multi-layer protocol with explicit bias mitigation, not a single quality score.

### ADR-023: Four-Layer Quality Model

**Decision**: Four layers, ordered as runtime protocol gates:

| Layer | What | Type | Cost | Short-circuit |
|-------|------|------|------|---------------|
| Floor | Functional correctness | Binary, deterministic | Zero | Fail -> skip all |
| Wall | Frame compatibility | Categorical, deterministic | Low | Fail -> skip Ceiling, Envelope |
| Ceiling | Process quality + decomposition quality | Continuous, partially neural | Medium | Independent of Envelope |
| Envelope | Execution resilience | Continuous, deterministic | Zero | Independent of Ceiling |

If Floor fails, Wall/Ceiling/Envelope are skipped entirely. This saves cost and prevents meaningless process-quality assessments of incorrect outputs.

### ADR-024: Self-Evaluation Reform

**Decision**: Split self-evaluation into two channels:

1. **Process Self-Check** (retained, weight 0.15): Binary, grounded questions. "Did I check preconditions?" "Did I use all required data?" Mechanical and bias-resistant.
2. **Outcome Self-Assessment** (eliminated as quality signal): Sycophancy bias 0.749. Logged for calibration tracking only. MUST NOT contribute to scoring.

### ADR-025: FORMALJUDGE Integration

**Decision**: Adopt FORMALJUDGE's principles selectively for Stage 2 Channel A:

- Binary extraction for contract compliance: ideal for decomposition-then-composition architecture.
- Binary extraction for process quality checklist: ideal for FORMALJUDGE.
- Holistic judgment for creative/stylistic quality: reserved for Channel B with larger models.

**Mandatory bias mitigation for all neural evaluation**:
- Position swapping (only 23.8% consistent without it)
- Length normalization (91.3% failure rate on verbosity attacks without it)
- Cross-family ensemble for high-stakes nodes
- Calibration tracking per evaluator model

### ADR-026: Quality as Vector, Not Scalar

**Decision**: Quality scores are vectors with at minimum four dimensions:

```typescript
interface QualityVector {
  accuracy: number;
  contract_compliance: number;
  process_quality: number;
  efficiency: number;
  calibration?: number;
  robustness?: number;
  resilience?: number;
}
```

Thompson sampling operates on individual dimensions. Multi-dimensional Elo (one Elo per dimension per domain) enables nuanced comparison. "You cannot ask 'which skill is best?' without asking 'best for what dimension?'" (Lakatos).

### Bias Mitigation in Practice

Evaluation bias is not theoretical. Measured data from the convention:

- **Position bias**: Without position swapping, only 23.8% of pairwise comparisons are consistent when response order is reversed. Position swapping doubles this to ~50%, and averaging across both orderings reaches ~85%.
- **Verbosity bias**: Without length normalization, 91.3% of evaluations prefer the longer response regardless of quality. Length-normalized evaluation reduces this to ~30%.
- **Self-enhancement bias**: Models rate their own outputs 0.749 correlation higher than external evaluation rates them. This is why outcome self-assessment is eliminated as a quality signal.

The mandatory bias mitigations are not optional best practices. They are architectural requirements. An evaluation pipeline that skips position swapping is fundamentally broken for comparative evaluation.

### The Four Evaluator Sources

V2's four evaluator types are retained with the V3 self-evaluation reform:

| Evaluator | Weight | What It Measures | Trust Level |
|-----------|--------|-----------------|------------|
| Self | 0.15 | Process self-check only (binary checklist) | Lowest -- sycophancy-compromised |
| Peer | 0.25 | Cross-evaluation by nodes at the same DAG level | Low -- shares some biases |
| Downstream | 0.35 | Quality of the output as judged by the node that consumed it | Medium -- practical test |
| Human | 0.50 | Expert judgment at human gates | Highest -- but costly and slow |

The weights are cumulative when multiple evaluators provide scores. A node evaluated by self + peer + downstream gets a weighted quality score. Nodes at human gates get all four.

### ADR-027: Cognitive Telemetry

**Decision**: Opt-in, tiered:

| When | What Is Recorded |
|------|-----------------|
| Always (Ceiling-evaluated) | Recognition events, expectation events, surprise events |
| On failure | Full cognitive trace |
| Sampling (5-10%) | Calibration data |
| Never (utility nodes) | N/A |

Schema: recognition_events (what pattern, confidence, cues), expectation_events (what expected, why), surprise_events (what violated, adaptation), alternative_events (what rejected, reasoning).

### Key Type Definitions

```typescript
interface ReviewResult {
  stage1: Stage1Result;
  stage2?: Stage2Result;
}

interface Stage1Result {
  passed: boolean;
  contract_violations: ContractViolation[];
  cost_usd: number;      // < $0.005
}

interface Stage2Result {
  channel_a: ChannelAResult;
  channel_b: ChannelBResult;
  overall_quality: QualityVector;
  bias_mitigations_applied: BiasMitigation[];
}

type BiasMitigation =
  | 'position_swap' | 'length_normalization'
  | 'cross_family_ensemble' | 'reference_guided'
  | 'calibration_aware';

interface EnvelopeScore {
  overall: number;
  components: {
    retry_ratio: number;
    mutation_count: number;
    circuit_breaker_trips: number;
    compensation_events: number;
    budget_utilization: number;
    timeout_proximity: number;
    failure_cascade_depth: number;
  };
  interpretation: 'clean' | 'minor_stress' | 'significant_stress'
    | 'near_failure' | 'survival';
}

interface EvaluationProtocol {
  floor_gate: {
    checks: string[];
    fail_action: 'skip_all_downstream_evaluation';
  };
  wall_gate: {
    checks: string[];
    fail_action: 'skip_ceiling_and_envelope';
  };
  ceiling_evaluation: {
    channel_a: 'formaljudge_binary_extraction';
    channel_b: 'behavioral_observation';
    weighting: { channel_a: number; channel_b: number };
  };
  envelope_computation: {
    method: 'deterministic_metric_aggregation';
  };
}
```

### Behavioral Contracts

**BC-EVAL-001**: Floor MUST complete before Wall. Wall before Ceiling. Runtime protocol gate, not guidance. MUST NOT evaluate process quality on outputs that fail functional correctness.

**BC-EVAL-002**: Self-evaluation outcome assessment MUST NOT contribute to quality scoring. Logged for calibration only.

**BC-EVAL-003**: All pairwise neural evaluations MUST apply position swapping.

**BC-EVAL-004**: Quality scores MUST be stored as vectors. Downstream consumers MUST have access to individual dimensions.

**BC-EVAL-005**: Cognitive telemetry MUST be recorded for all nodes that fail or trigger mutation. Not skippable for cost.

**BC-EVAL-006**: Envelope score MUST be computed for every DAG execution. Zero marginal cost.

### The Stage 2 Escalation Formula

*Addressing the EM's blocking concern: "Specify `estimateFailureProbability(node)` formula."*

```typescript
function estimateFailureProbability(node: ConcreteNode): number {
  const skillMetrics = skillStore.getMetrics(node.assigned_skill);

  // Base rate from skill's historical failure rate
  let pFailure = 1 - skillMetrics.quality_history.success_rate;

  // Adjust for developmental stage (novice skills fail more)
  const stageMultiplier: Record<DevelopmentalStage, number> = {
    novice: 1.5,     // 50% more likely to fail than baseline
    competent: 1.2,  // 20% more likely
    proficient: 1.0, // Baseline
    expert: 0.8,     // 20% less likely
  };
  pFailure *= stageMultiplier[skillMetrics.developmental_stage];

  // Adjust for circuit breaker state
  if (circuitBreakers.getState(node.assigned_skill) === 'half_open') {
    pFailure = Math.max(pFailure, 0.3);  // At least 30% if breaker recently tripped
  }

  // Clamp to [0.01, 0.99]
  return Math.max(0.01, Math.min(0.99, pFailure));
}

function shouldEscalateToStage2(node: ConcreteNode): boolean {
  // Always escalate for human gates, final deliverables, irreversible nodes
  if (node.feeds_human_gate || node.is_final_deliverable) return true;
  if (node.reversibility === 'irreversible') return true;

  // Economic threshold: P(failure) * downstream_waste > Stage_2_cost
  const pFailure = estimateFailureProbability(node);
  const downstreamWaste = estimateDownstreamWasteCost(node); // Sum of downstream node budgets
  const stage2Cost = 0.02; // ~$0.02 for a Sonnet evaluation

  return pFailure * downstreamWaste > stage2Cost;
}
```

This formula has a built-in bias toward escalation for nodes with high fan-out (many downstream dependents), which is the correct behavior: a failure at a high-fan-out node wastes more downstream work.

---

## Topic 7: User Experience and Visualization

### Why This Matters

WinDAGs embeds substantial intellectual machinery. If any of that machinery leaks into the default user experience, the system will feel overwhelming rather than powerful. The UX strategy is progressive disclosure: hide complexity by default, reveal it on demand.

### ADR-028: Progressive Disclosure Architecture

**Decision**: Three depth layers accessible on demand:

| Layer | Audience | Shows |
|-------|----------|-------|
| **L1: Overview** | All users | Traffic-light node status, DAG progress, cost ticker |
| **L2: Explanation** | Power users | Reasoning traces, coordination events, decomposition provenance, quality breakdowns |
| **L3: Deep Inspection** | Developers, auditors | Full BDI state, causal event traces, compiled parameters |

**L1 is the default view.** No user ever sees BDI, HTN, or Lakatosian terminology unless they drill into L3. The L2 summary field (`layer2_summary`) provides natural-language explanations: "The agent selected a different approach" rather than "The BDI commitment strategy triggered intention reconsideration."

The Design Lead review identified `layer2_summary` as optional/nullable in the spec. **Addressing that concern**: `layer2_summary` MUST be a required field on every node. If the system cannot generate a natural-language summary, it uses a template based on the node's status transition.

### Human Cognitive Load Budget

*Addressing the Psychologist's review concern.*

Human attention is a finite resource. The system must manage its demands on human cognition as carefully as it manages its LLM token budget.

**Maximum human gate load per execution**:
- At most 3 human review gates per DAG execution
- Minimum context per gate: problem summary, specific question, recommended action, cost of wrong decision
- If > 3 gates would be needed, the system batches them with a cognitive warmup (brief global context before specific questions)

**Four-state L1 vocabulary** (collapsing the 9-state internal model):

| L1 State | Internal States Mapped | Visual |
|----------|----------------------|--------|
| ACTIVE | pending, scheduled, running | Blue, animated |
| DONE | completed, skipped | Green, static |
| ATTENTION | paused (human gate), mutated | Purple/yellow, pulsing |
| PROBLEM | failed, retrying | Red/orange, alert |

The 9-state vocabulary is retained at L2/L3 for developers. L1 users see only four states.

**Human gate classification by irreversibility** (Psychologist requirement):

| Gate Type | Examples | Limit |
|-----------|----------|-------|
| IRREVERSIBLE | Deploy to production, send email, delete data | Max 1 per DAG, mandatory human confirmation |
| QUALITY_CHECK | Review generated code, approve analysis | Max 2 per DAG, can be deferred |
| CALIBRATION | Confirm approach direction, validate assumptions | Unlimited but batched |

**Complacency break mechanism**: Periodically (1 in 20 human gates), inject a known-good or known-bad calibration case. If the human approves a known-bad case or rejects a known-good case, surface a gentle alert: "Your recent approval rate is 100%. Some of these cases had known issues -- would you like to review them?"

### ADR-029: Visualization Modes

**Decision**: Four base modes plus three toggleable overlays:

**Base modes**:

| Mode | Purpose | Technology |
|------|---------|-----------|
| Graph | Structural topology and node status | ReactFlow DAG |
| Timeline | Temporal parallelism and bottlenecks | Gantt chart with causal ordering |
| Hierarchy | Decomposition structure and provenance | Tree view |
| Detail | Deep inspection of individual nodes | Full input/output panel |

**Overlays** (layered on any base mode):

| Overlay | Shows | Default |
|---------|-------|---------|
| Coordination | Protocol activity, negotiation outcomes | Off |
| Resilience | Near-miss heatmap, circuit breaker state, failure margins | On during live execution |
| Quality | Quality vectors as radar charts, progressive/degenerating indicators | Off |

**Visualization scale boundaries** (Sci-Fi Engineer concern): At 300+ nodes, the Graph view MUST switch to hierarchical collapse mode. Wave boundaries become visual containers. Nodes within completed waves collapse to summary blocks. This prevents the DAG visualization from becoming an unreadable wall of nodes.

Scale thresholds:

| Node Count | Behavior |
|-----------|----------|
| 1-50 | Full node display, all labels visible |
| 51-150 | Label truncation, minor node compaction |
| 151-300 | Completed waves collapse to summary blocks on click-to-expand |
| 301-500 | Hierarchical collapse mandatory. Only active wave fully expanded |
| 500+ | Meta-view: waves as single nodes, drill-down to expand any wave |

### ADR-030: Failure Information Prominence

**Decision**: Contextual prominence, honest by default:

- During live execution: Resilience overlay is default-on. Near-miss indicators visible.
- In retrospective: Resilience overlay is default-off but one click away.
- Always: Node tooltips show actual margin (quality score, budget utilization, timeout proximity). A green node that barely survived shows its margin on hover.

"Do not lie to the user about system health."

### The Complacency Break Mechanism in Detail

*Addressing the Psychologist's insight about automation complacency.*

The problem: when a system is 99% reliable, humans rubber-stamp the critical 1% where their judgment is actually needed. Studies show approval rates above 95% in review tasks correlate with declining detection of actual errors.

The mechanism:

1. **Tracking**: The system tracks the human's approval rate over their last 20 gate responses.
2. **Trigger**: If approval rate exceeds 95% over 20+ responses, the system activates calibration mode.
3. **Calibration injection**: 1 in 20 human gates becomes a calibration case -- a known-good or known-bad result that the system has already evaluated independently.
4. **Feedback**: If the human approves a known-bad case (false positive) or rejects a known-good case (false negative), the system surfaces a gentle alert after the current execution: "Your recent approval rate has been very high. Review 3 of your last 20 approvals contained known issues -- would you like to see which ones?"
5. **Learning**: The system models human override reliability as a function of review count. As review count increases within a single execution, expected human accuracy decreases. This informs the max-3-gates-per-execution limit.

The calibration injection is transparent -- the user is told afterward (not during) that a calibration case was included. This respects the user's autonomy while providing a reality check.

### Post-Execution Retrospective View

*Addressing the Design Lead's concern about where Looking Back results appear.*

After a DAG completes, the system presents a retrospective panel:

1. **Quality Summary**: Four-layer scores (Floor/Wall/Ceiling/Envelope) as a radar chart
2. **Learning Events**: What the system learned -- skill ranking changes, method quality updates, failure patterns detected
3. **Looking Back Results**: Q1-Q2 always shown. Q3-Q4 shown when available (they run asynchronously).
4. **Near-Miss Report**: Any nodes that barely passed thresholds, with margin data
5. **Monster-Barring Alerts**: If any skills showed scope narrowing trends
6. **Cost vs. Estimate**: Actual cost compared to pre-execution projection

### Key Type Definitions

```typescript
interface DAGStateEvent {
  type: 'node_status_change' | 'edge_activity' | 'mutation'
    | 'evaluation' | 'cost_update' | 'wave_transition'
    | 'human_gate_waiting';
  timestamp: string;
  dag_id: string;
  payload: NodeStatusChange | EdgeActivity | MutationEvent
    | ReviewResult | CostUpdate | WaveTransition | HumanGateEvent;
}

interface NodeVisualState {
  id: string;
  status: NodeStatus;
  animation: 'none' | 'pulse' | 'spin-border'
    | 'pulse-border' | 'glow' | 'dash';
  health_indicator: 'healthy' | 'stressed' | 'critical';
  margin_info: {
    quality_margin: number;
    budget_margin: number;
    timeout_margin: number;
  };
  layer2_summary: string;  // REQUIRED, not optional
}

interface VisualizationConfig {
  base_mode: 'graph' | 'timeline' | 'hierarchy' | 'detail';
  overlays: {
    coordination: boolean;
    resilience: boolean;
    quality: boolean;
  };
  disclosure_level: 1 | 2 | 3;
}
```

### Behavioral Contracts

**BC-UX-001**: L1 MUST NOT display technical terminology from any tradition. All labels use plain language.

**BC-UX-002**: Node tooltips MUST always show margin information. No green node without margin data on hover.

**BC-UX-003**: WebSocket state events MUST be typed (DAGStateEvent). No untyped JSON to the UI.

**BC-UX-004**: Resilience overlay default-on during live execution, default-off in retrospective.

**BC-UX-005**: `layer2_summary` MUST be a required field on every NodeVisualState. Not optional.

**BC-UX-006**: Human gate load MUST NOT exceed 3 review gates per DAG execution without batching and cognitive warmup.

---

## Topic 8: Business Model and Positioning

### Why This Matters

The architecture must be sustainable. If the business model does not align with the architecture, one or the other will be compromised. V3 treats the business model as architecture made visible: each progressive disclosure layer maps to a pricing tier, and the learning loop creates the competitive moat.

### ADR-032: Marketplace Asset Taxonomy

**Decision**: Five asset types, phased:

| Phase | Asset Type | Description |
|-------|-----------|-------------|
| Phase 1 | Skills | SKILL.md format, human-readable |
| Phase 1 | Methods | Decomposition strategies (HTN), bundled with skills |
| Phase 1 | Template DAGs | Pre-built execution patterns |
| Phase 2 | Compiled Modules | DSPy-optimized runtime skills |
| Phase 3 | Coordination Templates | Multi-model coordination patterns |

Methods are the highest-impact addition: they bridge granular skills and specific template DAGs.

**Private organizational skill libraries** (Market review concern): These are elevated from a tier feature to an architectural concept. Organizations accumulate skills, methods, and failure patterns that encode tribal knowledge. This organizational embedding is the early moat (months 6-18). Design for organizational stickiness from Phase 1.

### ADR-033: Pricing Matrix

| | Free | Pro ($29/mo) | Team ($99/mo) | Enterprise |
|--|------|-------------|---------------|------------|
| Volume | 100/month | 10,000/month | 50,000/month | Unlimited |
| Evaluation | Floor + Wall + Envelope | + Ceiling | + drift detection | Full |
| Marketplace | Community skills | + Premium | + Org libraries | + Coord templates |
| Learning | Basic Elo | + Kuhnian crisis | + Method learning | + Org intelligence |

Users pay their own LLM API costs; WinDAGs charges for orchestration.

**Free tier includes Envelope** (Market review, addressed): Envelope is deterministic and zero marginal cost. Gating it behind paid tiers is unjustifiable.

Revenue split: 70% creator / 30% platform.

### The "Rename Market" Note

*Addressing the Market review concern.*

The convention named one of its coordination models "Market" (ADR-010, Phase 3). This creates confusion between the marketplace (the skill store) and the Market coordination model (competitive bidding among skills). Before shipping, the coordination model should be renamed. Candidates: "Auction," "Bidding," "Competitive." The naming decision is not architecturally significant and is deferred to the implementation team.

### ADR-034: Competitive Positioning

**Decision**: Segmented messaging, defaulting to simple outcome-focused language:

| Audience | Message |
|----------|---------|
| Developers | "WinDAGs gets smarter with every run" |
| Enterprise | "Production-grade agent orchestration with audit trails and formal guarantees" |
| Academia | "Multi-tradition agent architecture with formal foundations" |

Marketing never uses BDI, HTN, Lakatosian, or RPD unless the audience is specifically academic.

**MCP relationship** (Market review requirement): WinDAGs exposes its skill library as MCP tools (other systems can invoke WinDAGs skills). WinDAGs consumes external MCP tools as agent capabilities (agents within DAGs can call external tools). The MCP integration is bidirectional but WinDAGs is the orchestrator, not a tool.

### ADR-035: Moat Architecture

Concentric rings:

1. **Inner ring** (hardest to replicate): Evaluation data + failure intelligence. Accumulates only through massive execution volume.
2. **Middle ring**: Skills + methods + coordination templates. Encode domain expertise and organizational intelligence.
3. **Outer ring**: Formal execution guarantees. Achievable by well-funded competitors.
4. **Connective tissue**: Explainability framework. Makes the moat visible to users, driving adoption, which deepens the inner ring.

**Time to Hello World**: < 5 minutes. NON-NEGOTIABLE.

### Behavioral Contracts

**BC-BIZ-001**: Open-source core (Apache 2.0) MUST remain genuinely open. Core execution is not gated behind paid tiers.

**BC-BIZ-002**: Time to Hello World MUST be < 5 minutes. First-run MUST NOT require understanding any intellectual tradition.

**BC-BIZ-003**: Meta-layer cost MUST be < 10% of total execution cost for medium DAGs. Target: < $0.07 per execution.

### Marketplace Cold-Start Playbook

*Addressing the CEO's blocking concern: "Who creates the first 20 premium skills?"*

The marketplace cold-start problem is solved in three stages:

**Stage 1 (Pre-launch)**: The WinDAGs team curates 50 seed skills across 5 domains (software engineering, data analysis, content creation, security, DevOps). These are free community skills. The team also creates 10 decomposition methods and 20 template DAGs.

**Stage 2 (Launch + 30 days)**: Identify 5-10 power users from the beta program. Offer them "founding creator" status: higher revenue share (80/20 instead of 70/30) for skills published in the first 90 days. Provide CTA-assisted skill authoring tools to lower the creation barrier.

**Stage 3 (Day 30-90)**: As execution data accumulates, the system identifies crystallization candidates -- ad-hoc workflows that succeeded 3+ times. The Curator suggests these as skill drafts. Early users find that the system is writing skills for them based on their usage patterns.

The key insight (CEO's review): the first 20 premium skills do not need to come from a marketplace. They come from the WinDAGs team and the founding users. The marketplace is a distribution mechanism that scales what already works.

### The Skills Migration Moat

*Addressing the CEO's insight: "Skills migration moat > data moat in months 6-18."*

Organizational stickiness comes from three sources:

1. **Custom skills**: Skills an organization has written, refined, and validated. These encode tribal knowledge that is not available elsewhere.
2. **Method libraries**: Decomposition strategies tuned to the organization's problem patterns. A fintech company's "compliance review" method is useless to a gaming company, but invaluable within the organization.
3. **Failure intelligence**: The organization's accumulated knowledge of what goes wrong and how to fix it. This is the hardest to replicate and the most valuable over time.

Design implications for Phase 1: organizational skill isolation MUST be supported from day one (even in the free tier, a single-user deployment). The data model must distinguish between community skills and organizational skills. Organizational skills can reference community skills but not vice versa.

---

*End of Part 3. Continue to Part 4 for Cross-Cutting Concerns, Implementation Highlights, and the Delivery Roadmap.*
# WinDAGs V3 Constitution -- Part 4: Cross-Cutting Concerns, Implementation, and Roadmap

---

## Cross-Cutting Concerns

### LLM Abstraction Layer

The LLM abstraction layer is the system's interface to the outside world of model providers. It must handle provider routing, failover, cost tracking, and capability discovery without coupling the execution engine to any specific provider.

#### ADR-036: Two-Tier Capability Schema

**Decision**: Two tiers of provider metadata, plus a mandatory evaluation bias profile:

**Tier 1 -- Behavioral Contract** (mandatory for all providers):

```typescript
interface ProviderBehavioralContract {
  provider_id: string;
  model_id: string;
  context_window_tokens: number;
  supported_features: {
    tool_use: boolean;
    structured_output: boolean;
    streaming: boolean;
    extended_thinking: boolean;
    vision: boolean;
  };
  cost_per_million: {
    input_tokens: number;
    output_tokens: number;
  };
  typical_latency_ms: { p50: number; p95: number };
  rate_limits: {
    requests_per_minute: number;
    tokens_per_minute: number;
  };
}
```

**Tier 2 -- Cognitive Profile** (optional, enriched through empirical calibration):

```typescript
interface ProviderCognitiveProfile {
  provider_id: string;
  model_id: string;
  reasoning_depth: number;
  instruction_following: number;
  self_evaluation_accuracy: number;
  recommended_commitment_strategy: CommitmentStrategy;
  known_biases: string[];
  calibration_date: string;  // Profiles go stale when models update
}
```

**Tier 3 -- Evaluation Bias Profile** (mandatory for models used as evaluators):

```typescript
interface EvaluationBiasProfile {
  model_id: string;
  position_bias_score: number;
  verbosity_bias_score: number;
  self_enhancement_bias: number;
  reasoning_contamination_risk: number;
  recommended_mitigations: BiasMitigation[];
  model_family: string;  // For cross-family ensemble selection
}
```

#### Model Substitution Protocol

*Addressing the Sci-Fi Engineer's concern about model upgrades breaking calibration.*

When a new model version is deployed:

1. Flag all Thompson parameters for that model's skills as stale
2. Raise K-factors to novice level (K=40) temporarily
3. Run a calibration sequence against canonical test tasks
4. Monitor quality for 30 executions before returning to normal K-factors

Model upgrades that break calibration are operationally indistinguishable from degradations. The system must treat them as such until proven otherwise.

#### Model Cost Drift Watchdog

*Addressing the Sci-Fi Engineer's concern about economic assumptions changing.*

A background monitor tracks the cost ratio between Stage 1 and Stage 2 review. If a provider price change makes the two-stage review economically suboptimal (Stage 2 cost drops below 2x Stage 1 cost), the system alerts the operator and suggests switching to always-Stage-2 review.

#### Automatic Failover

Circuit-breaker-based failover between providers. Every failover is logged, quality degradation on fallback is tracked, and a summary is surfaced to the user within 500ms. Failover is automatic; awareness is not hidden.

```typescript
interface ProviderRouter {
  route(model_request: string): ProviderBehavioralContract;
  failover(failed_provider: string, config: ExecutionConfig): ProviderBehavioralContract;
  get_circuit_breaker(provider_id: string): CircuitBreaker;
}
```

#### Mock LLM Provider Interface

*Addressing the EM's review requirement.*

Phase 1 ships with a deterministic mock provider for testing:

```typescript
interface MockLLMProvider {
  // Return deterministic responses for skill testing
  complete(prompt: string, config: ExecutionConfig): Promise<MockResponse>;

  // Configure response behavior
  setResponse(pattern: string, response: string): void;
  setLatency(ms: number): void;
  setFailureRate(rate: number): void;
  setFailureType(type: SystemLayerFailure): void;

  // Reset all configuration
  reset(): void;
}
```

The mock provider supports: deterministic responses by prompt pattern, configurable latency, configurable failure rates and types, and recording of all calls for assertion. This enables unit testing of the full execution pipeline without API calls.

### Observability Architecture

Five layers, corresponding to five distinct audiences:

| Layer | Audience | What It Captures |
|-------|----------|-----------------|
| 1. Agent Telemetry | Developers | LLM calls, tool calls, costs, durations, cognitive telemetry |
| 2. DAG Execution | Operators | Wave completion, node status, mutations, failures, quality |
| 3. Skill Lifecycle | Data scientists | Elo trajectories, Thompson params, developmental stage, Kuhnian state |
| 4. Infrastructure | SREs | API latency, rate limits, WebSocket connections, queue depth |
| 5. User Experience | Product | Time to first node, human gate response time, disclosure level usage |

**Performance budgets** (EM review requirement):

| Operation | Budget |
|-----------|--------|
| Stage 1 review | < 500ms |
| Stage 2 review | < 5s |
| Context store lookup | < 50ms |
| Skill selection cascade | < 100ms |
| Three-pass decomposition (< 20 nodes) | < 15s |

### Technology Stack

| Component | Technology | Phase | Rationale |
|-----------|-----------|-------|-----------|
| Execution language | TypeScript | Phase 1 | V2 retention |
| Compilation language | Python | Phase 3 | DSPy is Python-native |
| Database (Phase 1) | SQLite | Phase 1 | Local-first, zero config |
| Database (Phase 2+) | PostgreSQL + pgvector | Phase 2 | Scalable, vector search |
| Task queue | BullMQ | Phase 2 | Job queue for web workers |
| Durable execution | Temporal | Phase 2+ | Production: durable state, auto-retries |
| Visualization | ReactFlow v12.4+ + ELKjs | Phase 1 | Best-in-class DAG viz |
| State management | Zustand | Phase 1 | ReactFlow integration |
| Real-time | WebSocket (typed DAGStateEvent) | Phase 1 | Live execution state |
| Testing | Vitest + Playwright | Phase 1 | Unit + E2E |
| Mock LLM | Deterministic mock provider | Phase 1 | Testing without API calls |

### Cross-Cutting Behavioral Contracts

**BC-CROSS-001**: The ContextStore MUST summarize rather than truncate when exceeding token budget. Summaries preserve output structure, key findings, and confidence levels.

**BC-CROSS-002**: The ProviderRouter MUST log every selection decision: which provider, which alternatives, why.

**BC-CROSS-003**: Failover events MUST surface to the user within 500ms.

**BC-CROSS-004**: Channel A evaluation MUST use a different model family than execution. If only one family available, relaxed with logged warning.

**BC-CROSS-005**: Cognitive telemetry MUST be stored separately from execution results. Known confabulation risk -- clearly separated in data model.

**BC-CROSS-006**: All learning state updates MUST be idempotent. Replay safety is a prerequisite for distribution.

**BC-CROSS-007**: Three-pass decomposition MUST complete within 15 seconds for < 20 nodes.

**BC-CROSS-008**: Wave computation MUST respect failure domain isolation.

**BC-CROSS-009**: Looking Back Q3-Q4 MUST NOT block returning results to the user.

**BC-CROSS-010**: All types exported from a single `types.ts`. No circular dependencies.

---

## Implementation Pseudocode Highlights

The full implementation pseudocode covers seven modules (see consolidated spec Part X). Here are the three most architecturally significant.

### Core Execution Loop

This is the heart of V3. It shows how the seven phases connect:

```typescript
async function executeDAG(
  problem: string,
  config: DAGExecutionConfig
): Promise<DAGExecutionTrace> {
  const contextStore = new ContextStore();
  const circuitBreakers = new CircuitBreakerRegistry();
  const envelopeTracker = new EnvelopeTracker();

  // Phase 1: Understand
  const understanding = await sensemaker.understand(problem);
  if (understanding.halt_decision === 'HALT_CLARIFY') {
    return halt(understanding.halt_reason);
  }

  // Phase 2: Budget
  const budget = computeDeliberationBudget(
    understanding.problem_type,
    understanding.recognition_confidence
  );

  // Phase 3: Decompose (three-pass, ADR-001)
  const decomposition = await decomposer.threePassDecompose(
    understanding, budget
  );

  // Phase 4: PreMortem (ADR-009)
  const preMortem = await preMortemAnalyzer.analyze(
    decomposition.dag,
    understanding.recognition_confidence
  );
  if (preMortem.recommendation === 'escalate_to_human') {
    return await humanEscalation(decomposition, preMortem);
  }

  // Phase 5: Wave-by-wave execution
  let dag = decomposition.dag;
  let waves = decomposition.waves;

  for (const wave of waves) {
    const plan = await planner.planWave(wave, dag, contextStore);
    const schedule = scheduler.scheduleWave(plan, circuitBreakers);

    for (const batch of schedule.batches) {
      assertFailureDomainIsolation(batch);
      const results = await Promise.allSettled(
        batch.nodes.map(node =>
          executeNodeWithReview(node, contextStore, circuitBreakers, budget)
        )
      );

      for (const [i, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          contextStore.add(batch.nodes[i].id, wave.number, result.value);
          envelopeTracker.recordSuccess(batch.nodes[i].id);
        } else {
          const failure = classifyFailure(batch.nodes[i], result.reason);
          const response = await escalationLadder.handle(failure, batch.nodes[i], dag);
          if (response.action === 'mutate') {
            dag = await mutator.mutate(dag, response.mutation);
            waves = await decomposer.replanRemainingWaves(dag, wave.number);
          }
        }
      }
    }

    // Expand vague nodes for next wave
    for (const vagueId of wave.vague_nodes_to_expand) {
      const expanded = await expandVagueNode(
        dag.nodes.find(n => n.id === vagueId), contextStore, budget
      );
      dag = replaceVagueWithSubDAG(dag, vagueId, expanded);
    }
  }

  // Phase 6: Looking Back (ADR-021)
  const lookingBack = await lookingBackAgent.evaluate(dag, contextStore);

  // Phase 7: Learn
  await learningEngine.update({
    dag, contextStore, lookingBack,
    envelopeScore: envelopeTracker.compute(),
  });

  return trace;
}
```

### Failure Classification

Shows how the four dimensions are populated incrementally:

```typescript
function classifyFailure(node: ConcreteNode, error: Error): FailureEvent {
  const event: FailureEvent = {
    system_layer: classifySystemLayer(error),  // Always populated
    escalation_level: 1,
    // ... other fields
  };

  // Cognitive mechanism: only if telemetry available
  if (hasCognitiveTelemetry(node.id)) {
    event.cognitive_mechanism = classifyCognitiveMechanism(
      getCognitiveTelemetry(node.id), error
    );
  }

  // Decomposition level: only on repeated failure (3+)
  if (getFailureCount(node.id) >= 3) {
    event.decomposition_level = classifyDecompositionLevel(
      node, getFailureHistory(node.id)
    );
  }

  // Protocol level: only if non-default protocol
  if (node.input.protocol !== 'data-flow') {
    event.protocol_level = classifyProtocolLevel(node);
  }

  return event;
}

function classifySystemLayer(error: Error): SystemLayerFailure {
  if (error instanceof TimeoutError) return 'omission';
  if (error instanceof ProcessCrashError) return 'crash';
  if (error instanceof ModelRefusedError) return 'crash_recovery';
  if (error instanceof ConfidentIncorrectError) return 'byzantine';
  return 'crash_recovery';
}
```

### Stage-Gated K-Factors

Shows how exploration rate is managed across skill maturity:

```typescript
const STAGE_K_FACTORS: Record<DevelopmentalStage, number> = {
  novice: 40,       // Fast learning, volatile
  competent: 32,    // DANGER ZONE: heightened monitoring
  proficient: 24,   // Reliable
  expert: 16,       // Stable, incremental
};

function getStageGatedKFactor(skillId: string): number {
  const metrics = skillStore.getMetrics(skillId);
  const baseK = STAGE_K_FACTORS[metrics.developmental_stage];

  // Lakatosian modulation: degenerating skills learn faster
  if (metrics.monster_barring.score > 0.3 || metrics.kuhnian_state.psi > 0.5) {
    return Math.min(baseK * 1.5, 48);
  }
  return baseK;
}
```

### Skill Selection Cascade

The five-step cascade (ADR-007) in implementation form:

```typescript
async function selectSkill(
  taskSignature: string,
  currentState: Record<string, any>,
  requiredOutputType: string,
  domain: string,
  skillLibrary: SkillLibrary
): Promise<string> {
  let candidates = skillLibrary.all();

  // Step 1: Signature compatibility (hard filter)
  candidates = candidates.filter(skill =>
    isSignatureCompatible(skill.output_schema, taskSignature)
  );

  // Step 2: Context conditions (hard filter)
  candidates = candidates.filter(skill =>
    areContextConditionsMet(skill.preconditions, currentState)
  );

  // Step 3: Output type + domain relevance (soft ranking)
  candidates = candidates
    .map(skill => ({
      skill,
      relevance: computeRelevance(skill, requiredOutputType, domain)
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .map(({ skill }) => skill);

  // Step 4: Pattern recognition fast path
  const recognized = patternRecognizer.match(taskSignature, currentState);
  if (recognized && recognized.confidence >= 0.8) {
    const matched = skillLibrary.get(recognized.skillId);
    if (
      isSignatureCompatible(matched.output_schema, taskSignature) &&
      areContextConditionsMet(matched.preconditions, currentState)
    ) {
      return recognized.skillId; // Fast path: skip Thompson
    }
  }

  // Step 5: Thompson sampling among remaining candidates
  if (candidates.length === 0) {
    throw new NoMatchingSkillError(taskSignature);
  }
  return thompsonSample(candidates.map(s => s.id), domain);
}
```

### Learning Engine Highlights

The learning engine runs after every DAG execution. It operates on four levels simultaneously:

```typescript
async function learningUpdate(input: LearningInput): Promise<LearningResult> {
  const result: LearningResult = { /* ... */ };

  // Level 1: Skill Quality (Thompson + Elo per node)
  for (const nodeTrace of input.dag.node_traces) {
    if (!nodeTrace.assigned_skill) continue;
    const kFactor = getStageGatedKFactor(nodeTrace.assigned_skill);
    await skillStore.updateElo(nodeTrace.assigned_skill,
      computeEloUpdate(nodeTrace.quality_vector, kFactor));
    await skillStore.updateThompson(nodeTrace.assigned_skill,
      nodeTrace.quality_vector.functional_correctness >= 0.7);
  }

  // Level 2: Method Quality (indexed by task signature)
  if (input.dag.decomposition_trace.method_id) {
    await methodStore.updateThompson(
      input.dag.decomposition_trace.method_id,
      input.dag.decomposition_trace.task_signature,
      input.dag.overall_quality >= 0.7
    );
  }

  // Level 3: Topology Quality (fingerprint-based)
  const fingerprint = computeTopologyFingerprint(input.dag);
  await topologyStore.recordOutcome(fingerprint, input.dag.overall_quality);

  // Failure pattern learning
  for (const failure of input.failureEvents) {
    const pattern = extractFailurePattern(failure);
    await failureStore.record(pattern);
    const recurrence = await failureStore.checkRecurrence(pattern);
    if (recurrence.count >= 3) {
      result.failure_patterns.push({ /* ... */ });
    }
  }

  // Monster-barring detection
  for (const skillId of getUpdatedSkills(input.dag)) {
    const score = await monsterBarringDetector.compute(skillId);
    if (score > 0.3) {
      result.monster_barring_alerts.push({ skill_id: skillId, score });
    }
  }

  return result;
}
```

### Edge Protocol Handler

Shows how different edge protocols are enforced at the infrastructure level (not by the LLM):

```typescript
class EdgeProtocolHandler {
  async transfer(
    edge: DAGEdge, sourceResult: NodeResult, targetNode: ConcreteNode
  ): Promise<TransferResult> {
    switch (edge.protocol) {
      case 'data-flow':
        // Zero overhead: extract data, type check, pass through
        const data = extractEdgeData(sourceResult.output, edge.data_mapping);
        if (!isTypeCompatible(data, targetNode.input.expected_type)) {
          return { success: false, error: 'Type mismatch', protocol: 'data-flow' };
        }
        return { success: true, data, protocol: 'data-flow', cost_usd: 0 };

      case 'contract':
        // Quality-gated: check acceptance criteria before passing
        const acceptance = await evaluateAcceptanceCriteria(
          sourceResult.output, edge.contract.acceptance_criteria
        );
        if (!acceptance.passed) {
          return { success: false, action: edge.contract.on_rejection };
        }
        return { success: true, data: extractEdgeData(sourceResult.output) };

      case 'request':
        // Pull-based: downstream specifies what it needs
        return this.handleRequest(edge, sourceResult, targetNode);

      case 'subscription':
        // Streaming: incremental data delivery
        return this.handleSubscription(edge, sourceResult, targetNode);

      case 'auction':
        // Competitive: multiple skills bid for the task
        return this.handleAuction(edge, sourceResult, targetNode);
    }
  }
}
```

---

## Delivery Roadmap

### Phase 1 Scope Reduction

*Addressing the EM's blocking concern: "11 non-trivial systems is too many for 3 engineers in 8 weeks."*

The following scope reductions apply to Phase 1:

| Original Scope | Reduced Scope | Rationale |
|---------------|---------------|-----------|
| 4D failure classification | System-layer only (V2 compatible) | Cognitive/decomposition/protocol dimensions deferred to Phase 2 |
| Multi-dimensional Elo | Scalar Elo (single overall score) | Multi-dimensional adds complexity without Phase 1 value |
| Coordination model abstraction | Ship DAG-only with interface stub | Interface is the critical deliverable, not the abstraction logic |
| Full Stage 2 (Channel A + B) | Stage 2 with Channel A only | Channel B (process evaluation) requires cognitive telemetry infrastructure |

These reductions remove 4 non-trivial systems from Phase 1 scope while preserving the architectural commitments that make Phase 2 extensions possible.

### First-Customer Persona

*Addressing the CEO's blocking concern: "Not segments -- a specific person with a specific problem."*

**Alex, Senior Engineer at a 50-Person SaaS Startup**

Alex leads a 4-person backend team. The team uses Claude Code for individual tasks but has no way to orchestrate multi-step workflows. Their pain: a weekly "release readiness" process that requires research (changelog review), analysis (dependency audit), code generation (migration scripts), testing (integration suite), and documentation (release notes). Today this takes 6-8 hours of human coordination. Alex wants to describe the workflow once and have it improve over time.

Alex's journey:
- **Day 1**: Installs WinDAGs. Describes the release readiness workflow in natural language. The system decomposes it into a DAG with 12 nodes. Executes it. Gets a release readiness report in 20 minutes instead of 6 hours. Quality: 70% (needs human review of generated migrations).
- **Day 30**: The system has executed this workflow 4 times. It has learned which skills work for dependency auditing (Elo ranking stabilized). It crystallized the decomposition into a method. Quality: 85%. Human review time drops to 15 minutes.
- **Day 180**: The method has been refined through 25 executions. The system has crystallized a release-readiness meta-skill. The team has added custom skills for their specific stack. Quality: 95%. Fully automated with one human confirmation gate for the migration step.

This persona drives Phase 1 priorities: the three-pass decomposition, wave-by-wave execution, skill selection cascade, and the learning loop must all work for this use case.

### Phase 1 Critical Path

*Addressing the CEO's blocking concern: "What ships at week 4/6/8?"*

**3 engineers, 8 weeks. Dependency-ordered.**

```
Week 1-2: Foundation
  [Engineer A] Type system + ContextStore + MockLLMProvider
  [Engineer B] Sensemaker + ProblemUnderstanding + Halt Gate
  [Engineer C] ReactFlow scaffold + WebSocket typed events

Week 3-4: Core Engine (internal milestone: "first DAG executes")
  [A] Three-pass decomposition (Pass 1 + Pass 2 only; Pass 3 deferred to week 6)
  [B] Execution engine: wave-by-wave + batch scheduling + Kahn's algorithm
  [C] Stage 1 review + basic Stage 2 (Channel A only)

  WEEK 4 CHECKPOINT: A single-wave DAG can execute end-to-end with
  Stage 1 review. No vague nodes, no mutations, no learning yet.

Week 5-6: Learning + Resilience
  [A] Skill selection cascade (5-step) + Thompson sampling + Elo
  [B] Circuit breakers (3 levels) + system-layer failure classification
  [C] Vague node expansion + multi-wave execution

  WEEK 6 CHECKPOINT: Multi-wave DAGs execute. Skills are ranked.
  Failures are classified. Circuit breakers prevent cascading.

Week 7-8: Polish + Seed Content
  [A] Looking Back (Q1-Q2) + Monster-barring detection
  [B] PreMortem (lightweight) + Commitment strategies + Mutation logging
  [C] 4-mode visualization + progressive disclosure (L1/L2) + 10 seed templates

  WEEK 8 CHECKPOINT: Hello World < 5 minutes. 10 seed templates.
  Full Phase 1 feature set with reduced-scope items noted above.
```

### Phase 1 Feature Dependency Graph

```
Types ──> ContextStore ──> Sensemaker ──> Decomposer (Pass 1+2)
                                              |
                              ┌───────────────┤
                              v               v
                         Executor ──> Evaluator (Stage 1)
                              |               |
                              v               v
                   SkillSelection ──> CircuitBreakers
                              |
                              v
                    VagueNodeExpansion ──> MultiWaveExecution
                              |
                              v
                     LearningEngine ──> LookingBack
                              |
                              v
                   PreMortem ──> CommitmentStrategies
                              |
                              v
                    Visualization ──> SeedTemplates ──> HelloWorld
```

### Phase 2: Cloud Platform + Learning (12-16 weeks)

| Deliverable | ADRs | Priority |
|-------------|------|----------|
| Method-level learning | ADR-018 | P0 |
| Stage-gated exploration + Lakatosian modulation | ADR-019 | P0 |
| Temporal integration | ADR-010 | P0 |
| Team coordination model | ADR-010 | P0 |
| PostgreSQL + pgvector | Cross-cutting | P1 |
| Full Stage 2 (Channel A + Channel B) | ADR-025, ADR-027 | P1 |
| Cognitive telemetry | ADR-027 | P1 |
| Multi-dimensional failure classification | ADR-014 | P1 |
| Multi-dimensional Elo | ADR-026 | P1 |
| Near-miss logging | ADR-020 | P2 |
| Distribution-ready state | ADR-020 | P2 |

### Phase 3: Marketplace + Compilation (8-12 weeks)

| Deliverable | ADRs | Priority |
|-------------|------|----------|
| Market coordination model | ADR-010 | P0 |
| DSPy compilation integration | ADR-018 | P0 |
| Compiled modules as marketplace asset | ADR-032 | P0 |
| Coordination templates | ADR-032 | P1 |
| Curriculum-driven exploration | ADR-019 | P1 |
| Debate as Team variant | ADR-010 | P2 |

### Phase 4: Enterprise (ongoing)

| Deliverable | Priority |
|-------------|----------|
| Blackboard + Hierarchical coordination | On demand |
| Formal safety/liveness guarantees | P1 |
| A2A protocol support | P2 |
| Canary deployments | P2 |
| Chaos engineering (antifragility testing) | P3 |

### Go-to-Market Timeline

*Addressing the Market review's requirement for a Day 1/30/180 value story.*

| Day | What Happens | User Experience |
|-----|-------------|----------------|
| Day 1 | Install, describe a problem, see a DAG execute | "It understood what I wanted and broke it into steps" |
| Day 7 | Run the same workflow 3x, notice quality improving | "Wait, it remembered what worked last time" |
| Day 30 | Crystallized skills appear, custom templates saved | "My workflows are getting faster without me doing anything" |
| Day 90 | Organizational skill library has 50+ entries | "The whole team benefits from patterns I discovered" |
| Day 180 | Method library enables one-click complex workflows | "New team members are productive in hours, not weeks" |

The learning loop is the value story. It must be visible from Day 7.

---

### The $100M LangGraph Question

*Addressing the CEO's framing.*

LangGraph is well-funded and has a 12-18 month head start on developer adoption. WinDAGs' competitive window depends on three factors:

1. **The learning loop**: LangGraph is stateless. Every LangGraph execution starts from zero. WinDAGs accumulates skill rankings, method quality, and failure patterns. After 100 executions, WinDAGs produces measurably better results than a fresh LangGraph setup.

2. **Quality-gated evaluation**: LangGraph has no built-in evaluation. WinDAGs' two-stage review and four-layer quality model catch errors that LangGraph passes through. For enterprise buyers, this is the difference between "it usually works" and "it has an audit trail."

3. **The 5-minute Hello World**: If WinDAGs' first-run experience is worse than LangGraph's, nothing else matters. The Hello World must be comparable or better. This is a Phase 1 engineering priority, not a marketing afterthought.

The honest assessment: LangGraph wins on ecosystem maturity and developer familiarity. WinDAGs wins on the learning loop and evaluation depth. The bet is that the learning loop advantage compounds over time while ecosystem advantages erode as WinDAGs matures.

## V2-to-V3 Compatibility

*Addressing the EM's concern: "No migration path."*

V3 is a clean-slate architecture. There is no automatic V2-to-V3 migration. This is explicit and intentional:

1. **Skills** (SKILL.md format): Fully compatible. V2 skills work in V3 without modification.
2. **Execution state**: Not compatible. V3's learning state structures (multi-dimensional Elo, method rankings, topology fingerprints) have no V2 equivalent.
3. **DAG definitions**: Not compatible. V3 adds commitment strategies, typed edges, vague nodes, and wave definitions.

**Migration path for V2 users**: Import skills. Re-execute workflows to rebuild learning state. V3 will re-rank skills from scratch, which is better than importing potentially miscalibrated V2 rankings.

---

## Summary of All Behavioral Contracts

For reference, the complete list of behavioral contracts organized by topic. Each contract specifies what the system MUST do, not what it SHOULD do. These are testable requirements.

### Decomposition (BC-DECOMP)

| ID | Requirement |
|----|-------------|
| 001 | Halt and request clarification when validity < 0.6 |
| 002 | Execute all three passes in order; Pass 2 uses no LLM calls |
| 003 | Vague nodes carry role_description and dependency_list but no agent config |
| 004 | Wave N planned only after Wave N-1 completes (unless recognition >= 0.9) |
| 005 | Every decomposition logged with meta-skill, method, commitment, scores |

### Planning (BC-PLAN)

| ID | Requirement |
|----|-------------|
| 001 | Planning completes before scheduling begins within each wave |
| 002 | Hard filters (signature, context) before any soft ranking or Thompson |
| 003 | No shared failure domain nodes in same parallel batch |
| 004 | PreMortem lightweight scan on every DAG, including depth-1 |
| 005 | Edge protocol assignment at planning time, not changeable at runtime |

### Execution (BC-EXEC)

| ID | Requirement |
|----|-------------|
| 001 | Kahn's algorithm for scheduling; batches respect failure domains |
| 002 | Every mutation logged as MutationEvent |
| 003 | Commitment reconsideration evaluated per strategy on events |
| 004 | Progressive summarization enforced: N-1 full, N-3+ one-liners |
| 005 | Coordination model abstraction in Phase 1; extensible without redesign |
| 006 | Protocol enforcement by infrastructure, not LLM |

### Failure (BC-FAIL)

| ID | Requirement |
|----|-------------|
| 001 | System layer classification always; other dimensions at L2+ |
| 002 | Escalation ladder followed in order |
| 003 | Cross-family ensemble for Byzantine L3 |
| 004 | Circuit breakers independent at all three levels |
| 005 | Saga compensation in reverse order; limitations logged honestly |
| 006 | Progressive/degenerating classification at L2+ |

### Learning (BC-LEARN)

| ID | Requirement |
|----|-------------|
| 001 | Thompson update after every node using Evaluator score, not self-assessment |
| 002 | Method quality tracked independently of skill quality |
| 003 | Looking Back Q1-Q2 after every DAG; not skippable |
| 004 | Near-miss events at 10% margin |
| 005 | Monster-barring on every skill revision; not overridable |
| 006 | G-Counter-compatible data structures for distribution readiness |

### Evaluation (BC-EVAL)

| ID | Requirement |
|----|-------------|
| 001 | Floor before Wall before Ceiling; runtime protocol gate |
| 002 | Self-eval outcome not in quality scoring |
| 003 | Position swapping on all pairwise neural evaluations |
| 004 | Quality stored as vectors; dimensions accessible to consumers |
| 005 | Cognitive telemetry on all failures/mutations |
| 006 | Envelope computed for every DAG; zero cost |

### UX (BC-UX)

| ID | Requirement |
|----|-------------|
| 001 | No academic terminology at L1 |
| 002 | Margin info in all node tooltips |
| 003 | Typed WebSocket events |
| 004 | Resilience overlay default-on during execution |
| 005 | layer2_summary required on every NodeVisualState |
| 006 | Max 3 human gates per execution without batching |

### Business (BC-BIZ)

| ID | Requirement |
|----|-------------|
| 001 | Open-source core genuinely open (Apache 2.0) |
| 002 | Hello World < 5 minutes |
| 003 | Meta-layer cost < 10% of total execution cost |

### Cross-Cutting (BC-CROSS)

| ID | Requirement |
|----|-------------|
| 001 | ContextStore summarizes, not truncates |
| 002 | ProviderRouter logs every selection decision |
| 003 | Failover events surfaced within 500ms |
| 004 | Channel A uses different model family than execution |
| 005 | Cognitive telemetry stored separately from results |
| 006 | Learning updates idempotent |
| 007 | Decomposition < 15s for < 20 nodes |
| 008 | Wave computation respects failure domain isolation |
| 009 | Looking Back Q3-Q4 non-blocking |
| 010 | All types from single types.ts; no circular dependencies |

---

*End of Part 4. Continue to Part 5 for Appendices: ADR Registry, Dissenting Positions, Tradition Influence Matrix, and Glossary.*
# WinDAGs V3 Constitution -- Part 5: Appendices

---

## Appendix A: ADR Registry

All 36 Architecture Decision Records, summarized. Full text for the 15 most architecturally significant ADRs appears in Parts 2-4. The remaining 21 are referenced here with their key decision and primary tradition influence.

| ADR | Title | Decision Summary | Primary Influence | Part |
|-----|-------|-----------------|-------------------|------|
| 001 | Decomposition Driver Priority | Three sequential passes: structure, capability, topology | HTN, Polya | 2 |
| 002 | Vague Node Expansion Protocol | Four-layer cascade: conjecture, recognition, elicitation, compilation | NDM/RPD, Lakatos | 2 |
| 003 | Epistemic Annotation Depth | Graduated by commitment level: COMMITTED/TENTATIVE/EXPLORATORY | BDI | 2 |
| 004 | Communication Topology Awareness | Topology analysis is validation (Pass 3), not driver | Distributed Systems | 2 |
| 005 | Planning-Scheduling Separation | Distinct phases: planner decides what, scheduler decides when | HTN | 2 |
| 006 | Scheduling Interleaving Granularity | Two-level: full replanning between waves, preemption within | HTN, Distributed Systems | 2 |
| 007 | Skill Selection Cascade | Five steps: signature, context, relevance, recognition, Thompson | DSPy, BDI | 2 |
| 008 | Inter-Node Protocol Typing | Five edge types with data-flow as strong default (80%+) | MAS | 2 |
| 009 | PreMortem Conditionality | Always lightweight, escalate depth on low confidence | NDM/RPD, Resilience Eng. | 2 |
| 010 | Coordination Model Phasing | DAG-only Phase 1, +Team Phase 2, +Market Phase 3 | Distributed Systems, HTN | 2 |
| 011 | Context Store Architecture | Three-layer: transport, session, application with progressive summarization | HTN, DSPy | 2 |
| 012 | Commitment Strategy as Node Property | COMMITTED/TENTATIVE/EXPLORATORY with reconsideration triggers | BDI | 2 |
| 013 | Dynamic Topology Mutation | Seven mutation types as first-class operations with saga classification | MAS | 2 |
| 014 | Multi-Dimensional Failure Classification | Four orthogonal dimensions: system, cognitive, decomposition, protocol | All 10 | 2 |
| 015 | Failure Response Escalation Ladder | Five levels: fix node, diagnose structure, generate alternative, fix topology, human | HTN, Polya | 2 |
| 016 | Byzantine Failure Handling | Five layers by cost: compilation, behavioral, cross-family, adversarial, human | Distributed Systems | 2 |
| 017 | Circuit Breaker Architecture | Three levels (node, skill, model) plus cognitive and decomposition breakers | Resilience Eng. | 2 |
| 018 | Multi-Level Structural Learning | Four levels: skill, method, topology, compiled | HTN | 3 |
| 019 | Exploration Budget Management | Stage-gated K-factors with Lakatosian modulation | NDM/RPD | 3 |
| 020 | Centralized State, Distribution-Ready | G-Counter-compatible data structures from day one | Distributed Systems | 3 |
| 021 | Looking Back Protocol | Tiered Polya Q1-Q4 with cost model | Polya | 3 |
| 022 | Monster-Barring Detection | Scope-narrowing detection on every skill revision | Lakatos | 3 |
| 023 | Four-Layer Quality Model | Floor/Wall/Ceiling/Envelope as runtime protocol gates | Resilience Eng. | 3 |
| 024 | Self-Evaluation Reform | Split: process self-check (0.15) + outcome (eliminated) | BDI, Lakatos | 3 |
| 025 | FORMALJUDGE Integration | Selective: binary extraction for contracts, holistic for creative | Lakatos | 3 |
| 026 | Quality as Vector | Multi-dimensional Elo, per-dimension Thompson sampling | Lakatos | 3 |
| 027 | Cognitive Telemetry | Opt-in, mandatory on failure, 5-10% sampling | CTA | 3 |
| 028 | Progressive Disclosure Architecture | Three layers: Overview / Explanation / Deep Inspection | All 10 | 3 |
| 029 | Visualization Modes | 4 base modes + 3 overlays; hierarchical collapse at 300+ nodes | HTN | 3 |
| 030 | Failure Information Prominence | Contextual: resilience overlay default-on during execution | Resilience Eng. | 3 |
| 031 | Technology Stack | ReactFlow, Zustand, WebSocket, Vitest; V2 retained | V2 | 4 |
| 032 | Marketplace Asset Taxonomy | Five types: skills, methods, templates, compiled, coordination | HTN | 3 |
| 033 | Pricing Matrix | Four tiers: Free/Pro/Team/Enterprise; Envelope in free tier | NDM/RPD | 3 |
| 034 | Competitive Positioning | Segmented messaging; no academic terminology in marketing | NDM/RPD | 3 |
| 035 | Moat Architecture | Concentric rings: evaluation data > skills > formal guarantees | Lakatos | 3 |
| 036 | Two-Tier Capability Schema | Behavioral contract (mandatory) + cognitive profile (empirical) | Distributed Systems | 4 |

---

## Appendix B: Dissenting Positions

Dissent does not mean the position was wrong. It means the convention chose a different path. Each dissent includes a revisit condition -- the empirical signal that would justify reopening the decision.

### D-1: MAS on Capability-First Decomposition

**Position**: Decomposition should interleave with capability matching, not treat it as a validation step (ADR-001, Pass 2).

**Convention response**: Three-pass protocol addresses this by making capability matching the second pass, applied before any commitment.

**Revisit condition**: If >30% of decompositions require significant revision after capability matching.

### D-2: BDI on Per-Task Interleaving

**Position**: Every node execution should trigger belief updates that influence the next scheduling decision.

**Convention response**: Two-level interleaving (ADR-006) provides mid-batch preemption on significant events.

**Revisit condition**: If mid-batch preemption rates exceed 50%.

### D-3: MAS on Rich Default Protocols

**Position**: The default edge protocol should be richer than data-flow.

**Convention response**: Data-flow with typed failure semantics covers 80%+ of edges. Richer protocols available as opt-in.

**Revisit condition**: If >40% of edges are manually upgraded from data-flow to contract.

### D-4: MAS on Aggressive Coordination Model Phasing

**Position**: Rich coordination should be available from Phase 1. DAG-only risks being indistinguishable from LangGraph.

**Convention response**: Phase 1 implements the abstraction interface. MAS conceded: "the correct architectural decision."

**Revisit condition**: Competitive pressure from multi-model frameworks.

### D-5: CTA on Mandatory Cognitive Telemetry

**Position**: Cognitive telemetry should be mandatory for all non-utility nodes.

**Convention response**: Mandatory on failure and Ceiling-evaluated nodes, opt-in otherwise. 15-20% token overhead if mandatory.

**Revisit condition**: If process quality scores show <0.3 correlation with outcomes after 1000 executions.

### D-6: Distributed Systems on Formal BFT Quorum

**Position**: High-stakes nodes should require 2f+1 quorum with independent evaluators.

**Convention response**: Distributed Systems itself conceded that "the independence assumption breaks with LLM evaluators." Layered Byzantine handling replaces formal BFT.

**Revisit condition**: If model families become sufficiently different that independence can be empirically demonstrated.

---

## Appendix C: Tradition Influence Matrix

Which tradition most influenced each major architectural decision. Boldface indicates the tradition provided the primary intellectual framework.

| ADR | BDI | MAS | NDM | HTN | RE | DSPy | CTA | Polya | Lakatos | DistSys |
|-----|-----|-----|-----|-----|-----|------|-----|-------|---------|---------|
| 001 | | sec | | **pri** | sec | | | **pri** | | sec |
| 002 | sec | | **pri** | | | sec | sec | | sec | |
| 003 | **pri** | | | sec | | sec | | | | |
| 004 | | sec | | | | | | | | **pri** |
| 005 | sec | sec | | **pri** | | | | | | |
| 006 | sec | | | **pri** | sec | | | | | **pri** |
| 007 | **pri** | | sec | | | **pri** | | sec | | |
| 008 | | **pri** | sec | sec | | | | | sec | |
| 009 | | | **pri** | | **pri** | | | | sec | |
| 010 | sec | sec | | **pri** | sec | | | | | **pri** |
| 011 | sec | sec | | **pri** | | **pri** | | | | sec |
| 012 | **pri** | sec | sec | | sec | | | | | |
| 013 | | **pri** | | sec | sec | | | | | sec |
| 014 | all | all | all | all | all | all | all | all | all | all |
| 015 | | sec | sec | **pri** | | sec | | **pri** | | |
| 016 | | | sec | | | sec | sec | | sec | **pri** |
| 017 | | sec | sec | sec | **pri** | | | | | sec |
| 018 | sec | sec | | **pri** | | sec | | | | |
| 019 | | | **pri** | | | sec | | | sec | |
| 020 | | | | | | | | | | **pri** |
| 021 | sec | | | | | | sec | **pri** | sec | |
| 022 | | | | | | | | | **pri** | |
| 023 | | | | sec | **pri** | | | | | |
| 024 | **pri** | | sec | | | | | | sec | |
| 025 | | | | | | sec | sec | sec | **pri** | |
| 026 | sec | | | sec | | | | | **pri** | |
| 027 | sec | | sec | | | | **pri** | | | |
| 028 | all | all | all | all | all | all | all | all | all | all |
| 029 | | sec | | **pri** | sec | | | | | |
| 030 | sec | | | | **pri** | | | | | sec |
| 031 | | | | | | | | | | |
| 032 | | sec | | **pri** | | sec | sec | | | |
| 033 | | sec | **pri** | sec | | | | | sec | |
| 034 | sec | | **pri** | | | | | | | sec |
| 035 | sec | | | | sec | | | | **pri** | |
| 036 | sec | sec | sec | | | | sec | | | **pri** |

Legend: **pri** = primary influence (provided the intellectual framework), sec = secondary influence (contributed specific mechanisms), all = all 10 traditions contributed.

**Tradition contribution summary**:

| Tradition | Primary Influence Count | Key Unique Contribution |
|-----------|------------------------|------------------------|
| BDI | 4 | Commitment strategies, falsification costs |
| MAS | 3 | Edge protocols, organizational failures |
| NDM/RPD | 4 | Competent-stage danger zone, exploration budget |
| HTN | 8 | SHOP2 data, method libraries, decomposition |
| Resilience Eng. | 4 | Five-layer resilience, Envelope, near-miss logging |
| DSPy | 2 | Signature-based selection, compilation |
| CTA | 1 | CDM probes, cognitive telemetry |
| Polya | 2 | Looking Back, halt gate, auxiliary problems |
| Lakatos | 4 | Monster-barring, FORMALJUDGE, quality vectors |
| Distributed Systems | 5 | BFT, CRDTs, topology validation, circuit breakers |

---

## Appendix D: Open Questions

These are research questions the convention identified but did not resolve.

**OQ-1: Process Quality Predictive Value.** Does Ceiling-layer process quality actually predict Floor+Wall outcome quality? Track both independently. Compute correlation after 1000+ executions. If correlation <0.3, reduce Ceiling weight or eliminate it.

**OQ-2: Optimal Cognitive Telemetry Sampling Rate.** Start at 5%. Measure calibration improvement. Adjust empirically.

**OQ-3: Tacit Knowledge Boundary.** Where is the boundary between encodable knowledge (skills) and knowledge requiring human experts? No tradition claims this is solvable. Detect when operating beyond encoded knowledge and escalate.

**OQ-4: Compilation vs. Artisanal Skill Design.** Phase 1: elicitation-first. Phase 2: compilation-enriched. Phase 3: compilation-first where data is abundant.

**OQ-5: P*C Stopping Rule Calibration.** HTN's stopping rule requires calibrated probability estimates hard to obtain for novel problems. Use heuristic approximations in Phase 1, calibrate from data in Phase 2.

**OQ-6: Honest Limitations vs. Confidence Projection.** "Honest about current limitations, confident about the learning trajectory." Document residual failure rates. Communicate improvement trajectory as the value proposition.

---

## Appendix E: Concept Inventory Cross-Reference

V2 defined 445 concepts. The Phase 5.5 Preservation Audit found: 251 PRESENT (90.3%), 22 DEFERRED (7.9%), 0 CUT, 5 MISSING (1.8%).

### Coverage by Category

| V2 Concept Range | Topic | V3 Location |
|-----------------|-------|-------------|
| 1-25 | Progressive revelation | Principle 9, ADR-002, Topic 1 |
| 26-53 | Skill lifecycle | Principle 1, 3, 10; Topic 5; ADR-018-022 |
| 54-73 | Business model | Topic 8; ADR-032-035 |
| 74-87 | User experience | Topic 7; ADR-028-031 |
| 88-99 | Execution engines | Topic 3; ADR-010-013 |
| 100-107 | Visualization | Topic 7; ADR-031 |
| 108-123 | SDK implementation | Cross-cutting; ADR-036 |
| 124-132 | Skills vs. research | Principle 1; Topic 5 crystallization |
| 200-224 | Seven non-negotiable principles | Part II (retained, some extended) |
| 230-241 | Meta-DAG architecture | Architecture Overview; Topic 3 |
| 250-255 | Six-phase mental model | Operationalized through wave-by-wave |
| 260-262 | Node schema | Topic 3 types (ConcreteNode, VagueNode) |
| 270-276 | Resilience patterns | Topic 4; ADR-017, saga types |
| 280-282 | Quality evaluation | Topic 6; ADR-023 |
| 290-292 | HTN decomposition | Topic 1; ADR-001 |
| 300-309 | Ten traditions | Traced through every ADR |
| 320-324 | Technology | Cross-cutting tech stack |
| 330-335 | Delivery roadmap | Phased throughout; Part 4 roadmap |
| 360-363 | Unresolved V2 tensions | All resolved: ADR-009, -023, -018, Section 3.2 |
| 370-379 | V2 deferred items | Amendment Log (deferred section) |
| 400-414 | V3 new concepts | MCP, coordination models, A2A |

### Five Missing Concepts

None are NON-NEGOTIABLE. Resolution:

1. **Output export formats** (Markdown, PDF, JSON, ZIP, GitHub PR): Defer to Phase 2.
2. **Expansion path preview** (show 3-4 potential paths before upstream completes): Not specified. Research item.
3. **Inbox/channel coordination model**: Defer. Subsumed by Team coordination in Phase 2.
4. **Revenue projections** ($0 -> $5K -> $25K -> $150K+): Business planning document, not constitution.
5. **Learning curve estimates** (~50 executions visible, ~3% crystallization rate): Empirical measurements, not architectural commitments.

### V3 New Concepts (Not in V2)

These concepts were introduced by the constitutional convention and have no V2 equivalent:

| Concept | Source Tradition | Purpose |
|---------|-----------------|---------|
| MonsterBarringDetector | Lakatos | Detect skills that improve by narrowing scope |
| NearMissEvent | Resilience Engineering | Log when a node barely passes thresholds |
| EvaluationBiasProfile | Lakatos | Track evaluator model biases |
| ResilienceFramework | Resilience Engineering | Five-layer prevention/detection/containment/recovery/adaptation |
| AnnotationLevel | BDI | Graduate epistemic annotation by commitment level |
| PolyaVerificationResult | Polya | Structure Looking Back protocol results |
| DecompositionQuality | HTN | Measure independence ratio, mutation rate, CTF rate |
| CognitiveTelemetryEvent | CTA | Record recognition, expectation, surprise events |
| CommitmentStrategy | BDI | Node-level persistence vs. adaptability policy |
| ContextWindow | HTN, DSPy | Token-budgeted progressive summarization |
| WaveDefinition | HTN | Unit of progressive decomposition |
| DevelopmentalStage | NDM/RPD | Skill maturity: novice/competent/proficient/expert |
| ExpediterFunction | Chef review | Cross-cutting execution arc monitor |
| HumanGateClassification | Psychologist review | IRREVERSIBLE/QUALITY_CHECK/CALIBRATION |
| CognitiveLoadBudget | Psychologist review | Max 3 human gates per execution |

---

## Appendix F: Glossary

| Term | Definition |
|------|-----------|
| **Byzantine failure** | A node produces incorrect output with high confidence, indistinguishable from correct output without external verification |
| **Cascading Task Failure (CTF)** | A failure in one node that propagates through dependencies, causing downstream nodes to fail |
| **Circuit breaker** | A state machine (CLOSED/OPEN/HALF_OPEN) that prevents repeated calls to a failing component |
| **Commitment strategy** | A node's policy for persistence vs. adaptability: COMMITTED, TENTATIVE, or EXPLORATORY |
| **Competent stage** | The 30-200 execution range where a skill appears reliable but has not been fully validated. The "danger zone" |
| **Crystallization** | The process by which successful improvisation becomes a reusable skill, method, or structural rule |
| **Decomposition** | Breaking a problem into a DAG of sub-tasks. In V3, a three-pass composite operation |
| **Deliberation budget** | The computational resources allocated to reasoning about a problem, set by problem classification |
| **Developmental stage** | A skill's maturity: novice, competent, proficient, expert. Determines K-factor and monitoring level |
| **Elo rating** | A ranking system borrowed from chess. In V3, multi-dimensional (one Elo per quality dimension per domain) |
| **Envelope** | The fourth quality layer. Measures execution resilience: how stressed was the system during execution |
| **Expediter** | The cross-cutting monitoring function that watches the global execution arc and intervenes on drift |
| **Failure domain** | A set of nodes that share failure characteristics (same provider, same skill, same upstream dependency) |
| **FORMALJUDGE** | An evaluation methodology that separates binary fact extraction from composition, reducing evaluation bias |
| **Halt gate** | A hard stop when problem validity is below threshold (< 0.6). The system refuses to proceed until clarified |
| **Human gate** | A node that requires human input before the DAG can continue. Classified by irreversibility |
| **K-factor** | The learning rate in Thompson sampling/Elo updates. Higher = faster learning, more volatile rankings |
| **Kuhnian crisis** | A statistical detection that a skill's quality distribution has shifted, indicating possible paradigm change |
| **Looking Back** | Polya's post-execution reflection protocol. Four questions, cost-tiered |
| **Meta-DAG** | The DAG of system-level agents (Sensemaker, Decomposer, Executor, etc.) that orchestrate user-level DAGs |
| **Method** | A reusable decomposition strategy indexed by task signature. The HTN contribution |
| **Monster-barring** | Detecting when a skill improves by narrowing scope rather than increasing capability. The Lakatosian contribution |
| **Near-miss** | A node that succeeded but barely (quality margin <10%, timeout margin <20%, budget margin <15%) |
| **PreMortem** | Pre-execution failure analysis. Always runs lightweight; escalates depth on low confidence |
| **Principal parts** | Polya's problem analysis: the unknown (what to produce), the data (what is given), the conditions (constraints) |
| **Progressive revelation** | Vague nodes expanding into sub-DAGs as upstream work completes. The primary decomposition mode |
| **Progressive/degenerating** | Lakatos's classification: does a change expand capability (progressive) or narrow scope (degenerating)? |
| **Recognition confidence** | How well the Sensemaker recognizes the problem type. Determines deliberation budget |
| **Saga** | A distributed transaction pattern. Nodes are classified as COMPENSATABLE, PIVOT, or RETRIABLE |
| **Sensemaker** | The system role that understands the problem, classifies it, and decides whether to halt or proceed |
| **SKILL.md** | The human-readable, version-controlled format for skill definitions. The source of truth |
| **Thompson sampling** | A Bayesian exploration/exploitation algorithm. Samples from Beta(alpha, beta) to balance trying new skills vs. using proven ones |
| **Vague node** | A placeholder in the DAG for work that cannot be fully specified until upstream results are available |
| **Two-stage review** | The evaluation pattern: Stage 1 (contract, cheap, always) + Stage 2 (cognitive, expensive, targeted) |
| **Wave** | A batch of nodes planned and scheduled together. The unit of progressive decomposition |
| **Auxiliary problem** | Polya's strategy: when stuck, reformulate as a related but simpler problem and transfer the solution strategy |
| **Batch** | A set of nodes within a wave scheduled for parallel execution, respecting failure domain isolation |
| **Calibration** | Monthly process of checking for drift in skill quality, model accuracy, and evaluation bias |
| **CDM probe** | Critical Decision Method probe from CTA: structured questions about decision points, alternatives, and assumptions |
| **Channel A** | Stage 2 outcome evaluation using FORMALJUDGE principles. Evaluates observable outputs without inspecting reasoning traces |
| **Channel B** | Stage 2 process evaluation using CTA/CDM probes. Examines tool calls, retry patterns, and intermediate outputs |
| **Cognitive telemetry** | Instrumentation that records recognition events, expectation events, and surprise events during agent execution |
| **Concrete node** | A node with a fully specified task, assigned skill, and known inputs/outputs. Contrast with vague node |
| **Context Store** | Three-layer communication architecture providing token-budgeted progressive summarization across waves |
| **Coordination model** | The communication pattern between agents: DAG (Phase 1), Team (Phase 2), Market (Phase 3) |
| **Curator** | Post-execution role that packages successful improvisation into reusable knowledge assets |
| **Domain meta-skill** | Compiled expert knowledge about how to decompose problems in a specific domain. Provides the decision tree for Pass 1 |
| **Evaluation bias profile** | Per-model tracking of position bias, verbosity bias, and self-enhancement bias |
| **Failure domain** | A set of nodes sharing failure characteristics: same provider, same skill, or same upstream dependency |
| **G-Counter** | A conflict-free replicated data type (CRDT) that supports increment and merge operations. Used for distribution-ready state |
| **Human gate** | A node requiring human input. Classified as IRREVERSIBLE, QUALITY_CHECK, or CALIBRATION |
| **Method** | A reusable decomposition strategy indexed by task signature, with its own Thompson sampling parameters |
| **Mock LLM provider** | Deterministic test provider supporting configurable responses, latency, and failure rates |
| **Mutation** | A first-class DAG modification during execution: add/remove/replace node, add edge, fork, expand vague, loop back |
| **Near-miss** | A node that succeeded but with margin <10% on quality, <20% on timeout, or <15% on budget |
| **Pattern recognition fast path** | NDM/RPD shortcut: if recognition confidence >= 0.8, skip ranking and select the matched skill directly |
| **PSI** | Population Stability Index used in Kuhnian crisis detection to measure distribution shift in quality scores |
| **Saga** | A distributed transaction pattern classifying nodes as COMPENSATABLE (can be undone), PIVOT (point of no return), or RETRIABLE |
| **Topology fingerprint** | A structural hash of a DAG's shape used to index coordination topology quality scores |

---

## Appendix G: What V3 Changed from V2

A concise summary of every change, for engineers migrating from V2 mental models.

| Change | V2 | V3 | Rationale |
|--------|----|----|-----------|
| Meta-DAG agent count | Fixed 12 | Variable 5-7 + dynamic | 10/10 reject fixed count |
| Decomposition mode | Full upfront primary | Vague nodes primary | HTN: 34.78% CTF for static |
| Failure taxonomy | 6 system-layer modes | 4 orthogonal dimensions | Prevents misdiagnosis |
| Quality model | 3 layers (Floor/Wall/Ceiling) | 4 layers (+ Envelope) | Resilience Eng. contribution |
| Quality score | Scalar | Vector (4-7 dimensions) | "No total ordering" (Lakatos) |
| Self-evaluation | Single channel, 0.15 | Process (0.15) + outcome (0, cal only) | Sycophancy bias 0.749 |
| Commitment strategies | BOLD/CAUTIOUS/META_LEVEL | COMMITTED/TENTATIVE/EXPLORATORY | Clearer semantics |
| Scheduling | Topological sort only | Planning-scheduling separation | HTN SHOP2 data |
| Edge semantics | Data flow only | Typed protocols, strong default | MAS contribution |
| Learning scope | Skill quality only | Skill + method + topology + compiled | 8/10 Topic 5 consensus |
| K-factors | 32/16/8 | 40/32/24/16 | Finer stage-gating |
| Evaluation ordering | Advisory | Runtime protocol gate | Enforced, not guidance |
| PreMortem | Optional | Always lightweight, conditional depth | Resilience Eng. insistence |

---

## Appendix H: The Convention Process

Understanding how the convention operated helps explain why decisions take the shape they do. The process was designed to extract each tradition's strongest insight while preventing any tradition from overriding the others.

### Process Structure

The convention operated in six phases:

| Phase | Purpose | Output |
|-------|---------|--------|
| Phase 1: Position Papers | Each tradition submitted a formal position on the 8 topics | 10 position papers, 80 topic positions |
| Phase 2: Convergence | Traditions debated in groups, identified agreements | 42 universal + 28 majority agreements |
| Phase 3: Steel-Manning | Each tradition formally steel-manned its strongest opponents | 10 steel-man papers |
| Phase 4: Consolidation | Lead architect synthesized all inputs into a single spec | 4,476-line consolidated specification |
| Phase 5: Preservation Audit | Verify V2 concepts were not lost; resolve blocking concerns | 445 concepts mapped, 90.3% present |
| Phase 6: Ratification | Final review and adoption | This constitution |

### How Disagreements Were Resolved

Genuine disagreements fell into three categories:

1. **Priority disagreements**: Multiple traditions agreed on the mechanism but disagreed on when it should apply. Resolution: phasing. The mechanism is available in a later phase. Example: MAS wanted rich coordination from Phase 1; convention phased it to Phase 2 (ADR-010).

2. **Scope disagreements**: Traditions disagreed on how broadly a mechanism should apply. Resolution: conditionality. The mechanism applies under specific conditions. Example: CTA wanted mandatory cognitive telemetry; convention made it opt-in with mandatory-on-failure (ADR-027).

3. **Structural disagreements**: Traditions had incompatible architectural visions. Resolution: ADR with dissent preservation. One approach was chosen with a revisit condition. Example: BDI wanted per-task interleaving; convention chose batch-with-preemption with revisit at 50% preemption rate (ADR-006).

Every dissenting position was preserved (Appendix B) with its revisit condition. This means the convention's decisions are not permanent -- they are empirically falsifiable.

### The Meta-Tensions

Five tensions were identified as inherent to the architecture and unresolvable by choosing one side:

| Tension | Pole A | Pole B | Resolution Strategy |
|---------|--------|--------|-------------------|
| Speed vs. Quality | Fast response | Thorough evaluation | Adaptive deliberation budget (Principle 5) |
| Exploration vs. Exploitation | Try new skills | Use proven skills | Thompson sampling with stage-gated K-factors (ADR-019) |
| Transparency vs. Complexity | Show everything | Hide complexity | Progressive disclosure (ADR-028) |
| Autonomy vs. Control | Full automation | Human oversight | Classified human gates with load budgeting (Topic 7) |
| Generality vs. Specialization | Handle any problem | Excel at specific domains | Domain meta-skills + progressive crystallization (Topic 1) |

These tensions are not resolved -- they are managed through mechanisms that balance both poles dynamically.

---

## Appendix I: Architectural Tradeoffs

Every architectural choice has costs. This appendix makes the costs explicit so that future engineers can evaluate whether the benefits materialized.

### Tradeoff 1: Three-Pass Decomposition vs. Single-Pass

**Benefit**: Each pass catches issues the others miss. Pass 2 (capability matching) prevents "perfect plan, no skills" failures. Pass 3 (topology validation) prevents shared-failure-domain disasters.

**Cost**: 2-3x longer decomposition time. Three-pass decomposition for a 20-node DAG takes ~10-15 seconds instead of ~5 seconds for single-pass.

**When the cost dominates**: Simple, well-understood problems where the domain meta-skill provides a complete decomposition template. In these cases, Pass 2 and Pass 3 typically find nothing to correct.

**Mitigation**: Pass 3 can be skipped for simple DAGs (depth < 3, no parallel batches). This is an explicit exception in BC-DECOMP-002.

### Tradeoff 2: Vague Nodes vs. Full Upfront Planning

**Benefit**: 8x reduction in cascading task failure rate (34.78% static vs. 4.35% dynamic). Better results because each wave uses information that did not exist when the previous wave was planned.

**Cost**: The DAG changes shape during execution, creating UX complexity. Users must understand that the plan is not fixed. Debugging is harder because the final DAG is not the same as the initial DAG.

**When the cost dominates**: Well-understood, highly repeatable workflows where the decomposition is the same every time (e.g., the same CI/CD pipeline executed weekly).

**Mitigation**: Static decomposition is permitted when recognition confidence >= 0.9 and the domain meta-skill allows it. Users can force static decomposition with an explicit override.

### Tradeoff 3: Two-Stage Review vs. Always-Deep Review

**Benefit**: Stage 1 catches 60-70% of issues at 100x lower cost ($0.005 vs. $0.02-0.05). The economic threshold ensures Stage 2 only runs when the expected waste from missing a failure exceeds the review cost.

**Cost**: Stage 1 misses subtle errors that Stage 2 would catch. False negatives at Stage 1 propagate to downstream nodes before being caught.

**When the cost dominates**: When downstream waste from a missed Stage 1 failure is extremely high (e.g., the failing node feeds 10+ downstream nodes). In these cases, the economic threshold should always escalate to Stage 2, but edge cases in probability estimation could miss this.

**Mitigation**: Stage 2 is mandatory for human gates, final deliverables, and irreversible nodes regardless of the economic threshold.

### Tradeoff 4: Four-Dimensional Failure Classification vs. Simple Retry

**Benefit**: Prevents the most common failure-handling mistake: retrying a failure that will always fail because the root cause is structural, not transient. Multi-dimensional classification directs each failure to the correct remediation channel.

**Cost**: Classification overhead per failure. The full 4D classification requires cognitive telemetry (not always available) and failure history (not available for first-time failures). Phase 1 ships with system-layer-only classification.

**When the cost dominates**: During Phase 1, when only the system layer dimension is active. The three additional dimensions add value only after enough failure data accumulates to populate them.

**Mitigation**: Phase 1 scope reduction (Part 4). Additional dimensions activate in Phase 2 when cognitive telemetry infrastructure is available.

### Tradeoff 5: Envelope Layer vs. Simpler Quality Model

**Benefit**: The Envelope reveals execution stress that the other three layers cannot see. A node can pass Floor (correct), Wall (fits context), and Ceiling (good reasoning) while operating at near-failure conditions (many retries, near timeout). Without Envelope, these near-misses go undetected until they become real failures.

**Cost**: One more dimension for users to understand. Dashboard complexity increases. Some users may find the distinction between Ceiling and Envelope confusing.

**Mitigation**: Envelope is presented as a visual indicator (stress heatmap) at L1, not as a number. The four-layer model is only fully visible at L2+. Envelope is deterministic and free to compute, so it adds no cost to execution.

---

## Appendix J: For Implementers -- Starting Points

This appendix provides concrete guidance for engineers beginning Phase 1 implementation. It identifies the highest-risk interfaces, the testing strategy for core behaviors, and the critical invariants that must hold across all components.

### Highest-Risk Interfaces

These are the interfaces where incorrect implementation causes the most downstream damage, ranked by blast radius:

1. **`DecompositionResult` -> `DAGDefinition`**: The decomposer's output is consumed by every downstream system. If the DAG structure is malformed (missing edges, circular dependencies, vague nodes without role descriptions), the executor, evaluator, and learning engine all fail in hard-to-diagnose ways. **Testing strategy**: Property-based testing with randomized DAG generation. Every generated DAG must pass acyclicity validation, edge type consistency, and vague node invariants.

2. **`ContextStore.get_relevant_context()`**: Token budget management affects every node execution. If context is truncated rather than summarized (violating BC-CROSS-001), downstream nodes make decisions on incomplete information. **Testing strategy**: Test with context stores at 50%, 100%, and 200% of token budget. Verify summaries preserve output structure and key findings at all budget levels.

3. **`CircuitBreakerRegistry`**: Three independent circuit breakers (node, skill, model) must operate without interfering with each other. A per-skill breaker opening must not prevent other skills from executing (BC-FAIL-004). **Testing strategy**: Concurrent failure injection at all three levels simultaneously. Verify isolation.

4. **`shouldEscalateToStage2()`**: The economic threshold formula determines evaluation depth. If probability estimates are systematically too low, Stage 2 is underused and subtle failures propagate. If too high, Stage 2 runs on everything and costs explode. **Testing strategy**: Calibration testing with known failure rates. After 100 executions, estimated failure probabilities should correlate >0.5 with actual failure rates.

5. **`MutationEvent` logging**: Every DAG mutation must be logged with before/after structural diffs (BC-EXEC-002). If mutations are silent, the learning engine cannot distinguish between "the plan worked" and "the plan was extensively modified." **Testing strategy**: Mutation injection testing. Trigger every mutation type and verify the event stream contains the correct before/after diffs.

### Testing Strategy for Core Behaviors

The behavioral contracts (51 total) define testable requirements. Organize tests by contract:

| Test Category | Contracts | Testing Approach |
|--------------|-----------|-----------------|
| Halt gate behavior | BC-DECOMP-001 | Feed ill-defined problems (clarity < 0.6). Verify the system halts, never produces a DAG. |
| Decomposition ordering | BC-DECOMP-002 | Instrument the decomposer. Verify Pass 1 completes before Pass 2 begins. Verify Pass 2 makes zero LLM calls. |
| Wave sequencing | BC-DECOMP-004 | Create multi-wave DAGs. Verify Wave N planning begins only after Wave N-1 completion event. |
| Evaluation ordering | BC-EVAL-001 | Inject a node that fails Floor. Verify Wall, Ceiling, and Envelope are not computed. |
| Self-evaluation isolation | BC-EVAL-002 | Verify the quality scoring function does not include outcome self-assessment in its weighted calculation. |
| Learning independence | BC-LEARN-002 | Create a scenario where decomposition method quality is high but individual skill quality is low. Verify method ranking increases while skill ranking decreases. |
| Progressive summarization | BC-EXEC-004 | Execute a 4-wave DAG. Verify Wave 1 content at Wave 4 is a one-liner, not full text. |

### Critical Invariants

These invariants must hold at all times, across all code paths. They are the properties that, if violated, indicate a fundamental architectural error:

1. **DAG acyclicity**: After every mutation, the DAG must be acyclic. No code path may introduce a cycle. This includes the `loop_back` mutation type, which adds a new node rather than creating a back-edge.

2. **Event ordering**: Events in the telemetry stream must be ordered by wall-clock time within a node and by causal dependency across nodes. Replayability depends on this ordering.

3. **Evaluation monotonicity**: Floor failure prevents Wall/Ceiling/Envelope computation. This ordering is enforced by the evaluation protocol, not by convention. No code path may compute Ceiling for a node that failed Floor.

4. **Thompson parameter positivity**: Alpha and beta parameters in Thompson sampling must always be > 0. A zero or negative parameter produces undefined behavior in the Beta distribution.

5. **Checkpoint consistency**: After a failure, replaying from the most recent checkpoint must produce the same DAG state as if the failure had not occurred and the failed node's results were excluded. Checkpoint and replay must be inverses.

6. **Token budget adherence**: The ContextStore must never return a context window exceeding the specified token budget. Summarization is the mechanism; truncation is the failure mode.

### The types.ts File

All types exported from a single `types.ts` (BC-CROSS-010). The recommended organization:

```
types.ts
  ├── Problem types (ProblemType, PrincipalParts, ValidityAssessment, ...)
  ├── DAG types (DAGDefinition, ConcreteNode, VagueNode, HumanGateNode, ...)
  ├── Edge types (EdgeDefinition, EdgeProtocol, FailureSemantics, ...)
  ├── Execution types (NodeStatus, WaveDefinition, MutationEvent, ...)
  ├── Evaluation types (QualityVector, ReviewResult, EnvelopeScore, ...)
  ├── Learning types (ThompsonParams, MultiDimensionalElo, ...)
  ├── Failure types (FailureEvent, SystemLayerFailure, CircuitBreaker, ...)
  ├── Provider types (ProviderBehavioralContract, ProviderRouter, ...)
  ├── UX types (DAGStateEvent, NodeVisualState, VisualizationConfig, ...)
  └── Config types (DAGExecutionConfig, DeliberationBudget, ...)
```

No circular dependencies. If type A references type B, type B must not reference type A (directly or transitively). The type file is the single source of truth for the system's data model.

---

## Appendix K: Frequently Anticipated Questions

These questions are expected to arise during implementation and stakeholder review. The answers are drawn from convention decisions and should be considered authoritative.

**Q: Why not use LangGraph/CrewAI/AutoGen and add learning on top?**

A: The learning loop cannot be bolted on. It requires evaluation data (four-layer quality model), failure classification (four dimensions), and method-level tracking (Thompson on decomposition strategies) -- all of which must be integrated into the execution engine. An overlay approach would require intercepting every node execution, every failure, and every DAG mutation, which amounts to rewriting the execution engine. Building from scratch with learning as the core architecture is less work than adapting a stateless framework. (See Part 4, "The $100M LangGraph Question" for the competitive analysis.)

**Q: Is the four-layer quality model (Floor/Wall/Ceiling/Envelope) over-engineered? Why not just use a single quality score?**

A: A single quality score conflates different failure modes that require different responses. A node that fails Floor (wrong answer) needs a different remediation than a node that passes Floor but fails Envelope (correct answer produced under extreme stress). The Ceiling and Envelope layers catch problems that are invisible to a single score: good output from bad reasoning (Ceiling detects), and correct output that barely survived (Envelope detects). Without these layers, the learning loop amplifies hidden fragility. (See Part 1, Bet 5; Part 3, ADR-023.)

**Q: How much does the meta-layer (orchestration) add to each execution's cost?**

A: Target: < 10% of total execution cost for medium DAGs (BC-BIZ-003). Breakdown for a typical 12-node DAG:
- Sensemaker classification: ~$0.001 (Haiku)
- Three-pass decomposition: ~$0.01-0.03 (Sonnet for Pass 1, zero for Pass 2, Haiku for Pass 3)
- PreMortem lightweight: ~$0.001 (Haiku)
- Stage 1 review per node: ~$0.005 x 12 = ~$0.06
- Stage 2 review (selected nodes): ~$0.02-0.05 x 2-3 = ~$0.04-0.15
- Looking Back Q1-Q2: ~$0.002
- Learning engine update: zero (deterministic)
- Total meta-layer: ~$0.07-0.24

For a DAG where node execution costs $0.50-2.00 each (typical Sonnet tasks), the meta-layer is 1-5% of total cost.

**Q: What happens when the system gets a problem it truly cannot solve?**

A: The Halt Gate (Principle 4) fires first: if the problem is too ill-defined, the system stops and asks for clarification. If the problem is well-formed but beyond capability, the escalation ladder (ADR-015) runs through all five levels, ending at L5: human escalation. The system provides the full failure trace, decomposition history, and recommended actions. It does not pretend to have solved a problem it cannot solve. The honest admission of failure is architecturally enforced, not left to individual agent discretion.

**Q: How does the system handle confidential/sensitive data in organizational skill libraries?**

A: Organizational skills are isolated by design (Part 3, Topic 8). The data model distinguishes community skills (public) from organizational skills (private). Cross-deployment skill transfer (Part 3, Topic 5) transfers only aggregate statistics (Thompson parameters, Elo ratings) -- never execution traces, user data, or organizational context. The privacy model is structural: the transferred learning state cannot contain user data because the transfer mechanism operates on aggregate statistics only.

**Q: What if Thompson sampling converges on a suboptimal skill?**

A: Three mechanisms prevent premature convergence. First, stage-gated K-factors (ADR-019) maintain exploration during early stages (K=40 for novice skills). Second, Lakatosian modulation increases exploration by 25% during stagnation (no novel successes in 30 days). Third, Kuhnian crisis detection (retained from V2) monitors for quality distribution shifts that indicate a skill is degrading. If a crisis is detected (PSI >= 0.25), the skill's K-factor is temporarily increased to allow faster re-ranking. Together, these mechanisms ensure that the system can recover from premature convergence within approximately 30-50 executions.

**Q: Why is the convention's process so elaborate? Could the same architecture have been produced by a single architect?**

A: V2 was produced by a single architect. It was good. V3 is better because each tradition caught overreach in the others. BDI's demand for per-task interleaving was pruned by HTN's pragmatism. MAS's push for rich coordination from Phase 1 was constrained by Distributed Systems' phasing wisdom. Lakatos's insistence on formal evaluation was tempered by DSPy's measured data on sycophancy bias. No single tradition could have produced the synthesis. The process was elaborate because the synthesis required genuine intellectual confrontation, not compromise.

---

## Appendix L: Phase 1 Acceptance Criteria

These are the concrete, testable criteria that determine whether Phase 1 is complete. Each criterion maps to one or more behavioral contracts and can be verified with an automated test or a manual inspection.

### Week 4 Milestone: "First DAG Executes"

| Criterion | Test | Contracts |
|-----------|------|-----------|
| A single-wave DAG with 3+ concrete nodes executes end-to-end | Submit a well-formed problem. Verify all nodes complete. | BC-EXEC-001 |
| Halt gate fires on ill-defined input | Submit "make it better." Verify HALT_CLARIFY with structured clarification. | BC-DECOMP-001 |
| Stage 1 review runs on every node | Verify ReviewResult.stage1 exists for all completed nodes. | BC-EVAL-001 |
| Three-pass decomposition produces a valid DAG | Verify acyclicity, edge consistency, and vague node invariants. | BC-DECOMP-002 |
| Context store provides progressive summarization | Execute a 2-wave DAG. Verify Wave 1 data at Wave 2 is full text. | BC-EXEC-004 |
| Type system compiles with no circular dependencies | Run `tsc --noEmit` on types.ts. | BC-CROSS-010 |

### Week 6 Milestone: "Multi-Wave with Learning"

| Criterion | Test | Contracts |
|-----------|------|-----------|
| Multi-wave DAGs execute with vague node expansion | Submit a problem requiring 2+ waves. Verify vague nodes expand. | BC-DECOMP-004 |
| Skill rankings update after execution | Execute the same skill 5 times. Verify Thompson params change. | BC-LEARN-001 |
| Circuit breakers prevent cascade | Inject 5 failures on one skill. Verify the breaker opens. Verify other skills continue. | BC-FAIL-004 |
| Failure classification on system layer | Inject timeout, crash, and byzantine failures. Verify correct classification. | BC-FAIL-001 |
| Skill selection cascade respects hard filters | Offer a skill with wrong output type. Verify it is never selected. | BC-PLAN-002 |

### Week 8 Milestone: "Hello World < 5 Minutes"

| Criterion | Test | Contracts |
|-----------|------|-----------|
| New user installs and runs first DAG in < 5 minutes | Timed manual test on clean machine. | BC-BIZ-002 |
| 10 seed templates available | Count templates in library. | Part 4 roadmap |
| Looking Back Q1-Q2 runs after every DAG | Execute 3 DAGs. Verify LookingBackResult exists for all. | BC-LEARN-003 |
| Monster-barring detection active | Simulate a narrowing skill. Verify alert fires. | BC-LEARN-005 |
| L1/L2 progressive disclosure functional | View a completed DAG at L1. Verify no academic terminology. Expand to L2. Verify layer2_summary present. | BC-UX-001, BC-UX-005 |
| Meta-layer cost < 10% of total | Execute a 12-node DAG. Verify meta cost ratio. | BC-BIZ-003 |
| Decomposition completes in < 15s for < 20 nodes | Time the three-pass decomposition on a 15-node DAG. | BC-CROSS-007 |

### End-to-End Acceptance Test

The definitive Phase 1 acceptance test is Alex's use case (Part 4, First-Customer Persona):

1. Describe a "release readiness" workflow in natural language
2. The system decomposes it into a DAG with 8-15 nodes
3. The DAG executes wave-by-wave (at least 2 waves)
4. Stage 1 review passes on all nodes; Stage 2 triggers on the final deliverable
5. The system produces a release readiness report
6. Skill rankings update based on execution quality
7. Looking Back Q1-Q2 runs and identifies any unstated assumptions
8. The entire process completes in under 30 minutes
9. Running the same workflow a second time shows measurably different (improved or adapted) skill selection

If this test passes, Phase 1 is complete.

---

## Appendix M: Document Statistics

| Metric | Count |
|--------|-------|
| Architecture Decision Records | 36 |
| Non-Negotiable Principles | 10 |
| Behavioral Contracts | 51 |
| TypeScript type definitions (full spec) | 157 |
| TypeScript type definitions (in constitution) | ~30 most critical |
| Open Questions | 6 |
| Dissenting Positions Preserved | 6 |
| Traditions traced | 10 |
| V2 Concept Inventory coverage | 445 concepts mapped, 90.3% present |
| Implementation pseudocode modules | 7 |
| Delivery phases | 4 |
| Appendices | 14 (A through N) |
| Key Design Bets | 5 |
| Architectural Tradeoffs documented | 5 |
| Phase 1 Acceptance Criteria | 19 testable criteria across 3 milestones |

---

## Appendix N: Review Concern Resolution Index

Every blocking concern from the Phase 5 reviews, with the location of its resolution.

| Reviewer | Concern | Resolution Location |
|----------|---------|-------------------|
| PM | Define first-run experience | Part 1: "What This Document Does Not Cover" (deferred to implementation plan) |
| PM | Specify seed template library | Part 4: Phase 1 critical path, week 7-8 |
| PM | Clarify Halt Gate UX | Part 2: "The Halt Gate in Practice" |
| PM | Competitive first-run comparison | Part 1: "What This Document Does Not Cover" (deferred to measurement) |
| EM | `estimateFailureProbability` formula | Part 3: "The Stage 2 Escalation Formula" |
| EM | Mock LLM provider interface | Part 4: "Mock LLM Provider Interface" |
| EM | Reduce Phase 1 scope | Part 4: "Phase 1 Scope Reduction" |
| EM | `ConfidentIncorrectError` heuristic | Part 2: "ConfidentIncorrectError Detection Heuristic" |
| EM | V2-V3 migration path | Part 4: "V2-to-V3 Compatibility" |
| Design Lead | Pre-execution state | Part 1: "What This Document Does Not Cover" (UX design task) |
| Design Lead | Post-execution retrospective | Part 3: "Post-Execution Retrospective View" |
| Design Lead | Wave transition animation | Part 3: ADR-029, visualization modes |
| Design Lead | Failure explanation layer | Part 2: "Failure Explanation Layer" |
| Design Lead | `layer2_summary` required | Part 3: BC-UX-005 |
| Market | Envelope in free tier | Part 1: "On the Envelope layer and the free tier"; Part 3: ADR-033 |
| Market | Go-to-market narrative | Part 4: "Go-to-Market Timeline" |
| Market | MCP relationship | Part 3: ADR-034 (MCP section) |
| Market | License boundary | Part 1: "What This Document Does Not Cover" (separate document) |
| Chef | Expediter function | Part 1: "The Expediter" |
| Chef | Human gate timeout | Part 2: "Human Gate Timeout Authority" |
| Chef | Heightened monitoring spec | Part 3: "Heightened Monitoring in the Competent Stage" |
| Psychologist | Cognitive load budget | Part 3: "Human Cognitive Load Budget" |
| Psychologist | 4-state L1 vocabulary | Part 3: "Four-state L1 vocabulary" |
| Psychologist | Gate irreversibility classification | Part 3: "Human gate classification by irreversibility" |
| Ad Creative | "The sentence" | Part 1: "What WinDAGs Is" (one-sentence version) |
| Ad Creative | Name audit | Part 1: "What This Document Does Not Cover" (deferred) |
| Ad Creative | 90-second demo | Part 1: "What This Document Does Not Cover" (deferred) |
| CEO | Critical path document | Part 4: "Phase 1 Critical Path" |
| CEO | First customer persona | Part 4: "First-Customer Persona" (Alex) |
| CEO | Marketplace cold-start | Part 3: "Marketplace Cold-Start Playbook" |
| Sci-Fi Engineer | Skill transfer protocol | Part 3: "Cross-Deployment Skill Transfer Protocol" |
| Sci-Fi Engineer | Visualization scale | Part 3: ADR-029, 300+ node collapse |
| Sci-Fi Engineer | Model cost drift watchdog | Part 4: "Model Cost Drift Watchdog" |

---

*End of WinDAGs V3 Constitution.*

*This document was produced in Phase 6 (Ratification) of the Constitutional Convention process. It supersedes all prior drafts and the V2 Constitution. The consolidated specification (Phase 4, 4,476 lines) remains available as the reference for the complete set of 157 type definitions and 7 implementation pseudocode modules not fully reproduced in this constitutional document.*
