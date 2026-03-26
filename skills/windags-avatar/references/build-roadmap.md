# WinDAGs V3 — Phase 1 Build Roadmap and Critical Path

**Document type**: Engineering Manager planning artifact
**Derived from**: Constitution Parts 4-5, Phase 5 Review Brief
**Audience**: Engineering team (3 engineers), CEO, and technical stakeholders
**Status**: Phase 6 ratified — ready for sprint planning

---

## 1. Phase 1 Scope (Reduced)

The EM's blocking concern was explicit: eleven non-trivial systems cannot ship in eight weeks with three engineers. The constitution's Phase 1 scope reduction table is operationalized here as a definitive in/out list.

### What Stays (P0 — Must Ship)

| System | Constitution Reference | Rationale |
|--------|----------------------|-----------|
| Type system (`types.ts`) | BC-CROSS-010 | Foundation for everything; no circular deps |
| Three-pass decomposition (Passes 1 + 2; Pass 3 optional for simple DAGs) | ADR-001, BC-DECOMP-002 | Core product capability |
| Sensemaker + Halt Gate | BC-DECOMP-001 | Prevents garbage-in execution |
| ContextStore with progressive summarization | ADR-011, BC-CROSS-001 | Required for multi-wave correctness |
| Wave-by-wave execution engine | ADR-005, ADR-006 | The primary execution mode |
| Vague node expansion | ADR-002 | 8x CTF reduction vs. static planning |
| Stage 1 review (contract evaluation) | ADR-023, BC-EVAL-001 | Every node, every execution |
| Stage 2 review — Channel A only | ADR-025 | Outcome evaluation; Channel B deferred |
| Skill selection cascade (5-step) | ADR-007, BC-PLAN-002 | Hard filters + Thompson sampling |
| Thompson sampling on skill quality (scalar) | ADR-019 | Exploration/exploitation balance |
| Scalar Elo per skill | ADR-026 (reduced) | Quality ranking; multi-dim deferred |
| System-layer failure classification only | ADR-014 (reduced) | Omission, crash, crash_recovery, byzantine |
| Circuit breakers at node/skill/model levels | ADR-017, BC-FAIL-004 | Prevents cascade failures |
| Escalation ladder (Levels 1-5) | ADR-015 | Structured failure response |
| Looking Back Q1-Q2 | ADR-021, BC-LEARN-003 | Post-execution reflection; Q3-Q4 deferred |
| Monster-barring detection | ADR-022, BC-LEARN-005 | Scope-narrowing alert |
| PreMortem (lightweight) | ADR-009, BC-PLAN-004 | Always runs; no deep mode yet |
| Mock LLM provider | Part 4 cross-cutting | Testing without API calls |
| ReactFlow visualization (4 modes + resilience overlay) | ADR-029 | L1/L2 progressive disclosure |
| WebSocket typed DAGStateEvents | BC-UX-003 | Live execution state |
| 10 seed templates | Part 4 roadmap | Hello World enabler |
| Commitment strategies (COMMITTED/TENTATIVE/EXPLORATORY) | ADR-012 | Node persistence policy |
| Mutation logging (7 mutation types) | ADR-013, BC-EXEC-002 | DAG change audit trail |
| DAG-only coordination model | ADR-010 (Phase 1) | Interface stub for Phase 2 Team model |

### What Is Cut (Deferred to Phase 2 or Later)

| Deferred System | Why Deferred | Phase 2 ADR |
|-----------------|-------------|-------------|
| Cognitive failure dimension | Requires cognitive telemetry infrastructure not in Phase 1 scope | ADR-014 |
| Decomposition failure dimension | Requires failure history accumulation (3+ repeats) to be meaningful | ADR-014 |
| Protocol failure dimension | Applies only to non-data-flow edges; Phase 1 can't validate without data | ADR-014 |
| Multi-dimensional Elo (per-dimension ratings) | Adds implementation complexity; scalar Elo provides the same exploration benefit | ADR-026 |
| Coordination model abstraction layer | Interface stub is the Phase 1 deliverable; the abstraction logic ships in Phase 2 when Team model is implemented | ADR-010 |
| Stage 2 Channel B (process evaluation) | Requires cognitive telemetry events; CDM probes require execution trace infrastructure | ADR-027 |
| Looking Back Q3-Q4 | Q3-Q4 require expensive LLM calls; Q1-Q2 provide the learning signal needed for Phase 1 | ADR-021 |
| Method-level learning (Thompson on decomposition strategies) | Requires method library with stable indexing; Phase 1 builds the index, Phase 2 populates it | ADR-018 |
| Topology fingerprint learning | Insufficient data to learn topology quality in Phase 1 | ADR-018 |
| Near-miss event logging | Nice-to-have; adds instrumentation overhead without Phase 1 value | ADR-020 |
| G-Counter/CRDT distribution readiness | Phase 2 when multi-user concurrency is needed | ADR-020 |
| PostgreSQL + pgvector | SQLite is sufficient for Phase 1 single-user | Tech stack |
| BullMQ task queue | Not needed until web workers in Phase 2 | Tech stack |
| Temporal durable execution | Phase 2+ production | Tech stack |
| Cognitive telemetry (opt-in + mandatory-on-failure) | Infrastructure dependency for Channel B; deferred together | ADR-027 |
| Output export formats (Markdown, PDF, GitHub PR) | Appendix E — defer to Phase 2 | Phase 2 |

**Net reduction**: 11 major systems from the original scope become 7 (combining similar items). Four non-trivial system-level decisions are cleanly deferred. Every deferral preserves the interface contract for Phase 2 extension — no Phase 1 decision requires rework for Phase 2 features to land.

---

## 2. V2 to V3 Migration and Compatibility Statement

**V3 is a clean-slate architecture. There is no automatic migration from V2.**

This is an explicit, intentional choice stated in the constitution (Part 4: "V2-to-V3 Compatibility"). The EM flagged the absence of a migration path as a concern; this is the answer.

### What is Compatible

| Asset | Compatibility | Action Required |
|-------|-------------|-----------------|
| Skills (SKILL.md format) | Fully compatible | None. V2 skills work in V3 without modification. |
| Skill documentation | Fully compatible | None. |

### What is Not Compatible

| Asset | Compatibility | Reason |
|-------|-------------|--------|
| V2 execution state | Not compatible | V3 learning state (scalar Elo, Thompson params, topology fingerprints) has no V2 equivalent structure |
| V2 DAG definitions | Not compatible | V3 DAGs add commitment strategies, typed edges, vague nodes, and wave definitions |
| V2 quality scores | Not compatible | V3 uses four-layer quality vectors; V2 used single-dimension scoring |
| V2 skill rankings | Not compatible | Importing miscalibrated V2 rankings would corrupt Thompson sampling from day one |

### Migration Path for V2 Users

1. Import all V2 skills (SKILL.md format is unchanged)
2. Re-execute existing workflows under V3 to rebuild learning state from scratch
3. V3 will re-rank skills starting from priors; stabilization occurs in approximately 30-50 executions per workflow

**Clean-slate is the correct call.** Importing V2 rankings would import V2 miscalibrations. V3's Thompson sampling recovers to correct rankings faster starting from priors than starting from potentially wrong V2 data.

---

## 3. Feature Dependency Graph

Build order is strict. Nothing below a line can start before the line above it completes. Parallel tracks are shown side by side.

```
LAYER 0 — Types (1 engineer, 3 days)
  types.ts (all types exported, no circular deps)
       |
       |————————————————————————————————
       |                               |
LAYER 1A — Core Data               LAYER 1B — Scaffold
  ContextStore                       ReactFlow + WebSocket
  MockLLMProvider                    DAGStateEvent types
       |                               |
       |———————————————————————————————|
       |
LAYER 2 — Problem Entry (sequential)
  Sensemaker --> ProblemUnderstanding --> Halt Gate
       |
LAYER 3 — Decomposition
  Three-pass Decomposer (Pass 1 + Pass 2; Pass 3 for complex DAGs)
       |
       |————————————————————————————————
       |                               |
LAYER 4A — Evaluation              LAYER 4B — Execution Engine
  Stage 1 Review                     Kahn's algorithm
  Stage 2 Channel A                  Wave scheduling
  shouldEscalateToStage2()           Batch isolation
       |                               |
       |———————————————————————————————|
       |
LAYER 5 — Skill Intelligence
  5-step Skill Selection Cascade
  Thompson Sampling
  Scalar Elo
  PatternRecognizer fast path
       |
       |————————————————————————————————
       |                               |
LAYER 6A — Resilience              LAYER 6B — Multi-Wave
  System-layer failure classify      VagueNode expansion
  Circuit breakers (3 levels)        Wave replanning
  Escalation Ladder (L1-L5)          Multi-wave execution
       |                               |
       |———————————————————————————————|
       |
LAYER 7 — Learning + Post-Execution
  Looking Back Q1-Q2
  Monster-barring detection
  Thompson parameter updates (post-execution)
       |
       |————————————————————————————————
       |                               |
LAYER 8A — Planning Intelligence   LAYER 8B — UX Polish
  PreMortem (lightweight)            L1/L2 progressive disclosure
  Commitment strategies              4-mode visualization
  Mutation logging                   Resilience overlay
       |                               |
       |———————————————————————————————|
       |
LAYER 9 — Shipping
  10 seed templates
  Hello World < 5 minutes (timed test)
  End-to-end acceptance test (Alex's use case)
```

### P0 Dependencies Summary (table form)

| Feature | Depends On | Blocked Until |
|---------|-----------|--------------|
| Sensemaker | types.ts | Layer 0 done |
| Decomposer | Sensemaker, ContextStore | Layer 1+2 done |
| Stage 1 Review | Decomposer, MockLLMProvider | Layer 3 done |
| Execution Engine | Decomposer, Stage 1 Review | Layer 4 done |
| Skill Selection Cascade | Execution Engine, ContextStore | Layer 4 done |
| Circuit Breakers | Execution Engine | Layer 4 done |
| VagueNode Expansion | Execution Engine, Skill Cascade | Layer 5 done |
| Looking Back | Execution Engine (completed trace) | Layer 6 done |
| Monster-Barring | Looking Back, Thompson updates | Layer 7 done |
| PreMortem | Decomposer | Layer 3 done (can parallelize with Layer 4) |
| Seed Templates | Full execution pipeline | Layer 8 done |

---

## 4. Three Engineers, Eight Weeks — Assignment Plan

**Engineer A**: Systems and data. Owns the type system, context management, learning engine, and provider abstraction.
**Engineer B**: Execution and resilience. Owns the execution engine, failure handling, and planning/scheduling.
**Engineer C**: Evaluation and UX. Owns the review pipeline, visualization, and the end-to-end experience.

### Week-by-Week Assignments

| Week | Engineer A | Engineer B | Engineer C |
|------|-----------|-----------|-----------|
| 1 | `types.ts` (full type system, zero circular deps). `ContextStore` skeleton. `MockLLMProvider`. | Sensemaker + ProblemUnderstanding + Halt Gate. Hook Sensemaker to MockLLMProvider. | ReactFlow scaffold. WebSocket server. Typed `DAGStateEvent` stream. DAG rendering (static, no execution). |
| 2 | `ContextStore` complete: 3-layer architecture, progressive summarization, token budget enforcement. Integration tests vs. BC-CROSS-001. | Three-pass Decomposer: Pass 1 (LLM, structure), Pass 2 (no LLM, capability matching), Pass 3 stub. Output: valid `DAGDefinition`. | Stage 1 Review: contract evaluation, `ReviewResult` type, Floor/Wall gate. `shouldEscalateToStage2()` formula. Unit tests. |
| 3 | Skill library storage: SQLite schema for Thompson params + Elo. CRUD for skills, params. 5-step skill selection cascade steps 1-3 (hard filters + relevance ranking). | Execution engine: Kahn's topological sort, single-wave batch scheduling, failure domain isolation. `Promise.allSettled` batch runner. Failure domain assertion. | Stage 2 Channel A: FORMALJUDGE-style outcome evaluation. Position swapping. Integration with Stage 1 escalation formula. |
| 4 | Skill selection steps 4-5: pattern recognizer fast path (confidence >= 0.8 bypass) + Thompson sampling. Scalar Elo update formula. | Wire everything: Sensemaker -> Decomposer -> Executor -> Evaluator. Single-wave DAG executes end-to-end with MockLLMProvider. | Visualization: live DAG rendering from WebSocket events. L1 4-state vocabulary (ACTIVE/DONE/ATTENTION/PROBLEM). Resilience overlay default-on during execution. |
| **WEEK 4 CHECKPOINT** | **First DAG executes end-to-end. Single-wave only. No vague nodes. No mutations. No learning updates yet.** | | |
| 5 | Thompson parameter updates post-execution. Looking Back Q1-Q2 (structured Polya reflection, Haiku-priced). Monster-barring detection logic. | System-layer failure classification: omission, crash, crash_recovery, byzantine. `classifySystemLayer()`. `ConfidentIncorrectError` detection heuristic. | Vague node expansion: role_description + dependency_list pass-through, downstream expansion trigger. Multi-wave execution: Wave N waits for Wave N-1 `COMPLETE` event. |
| 6 | Skill ranking stabilization tests. Stage-gated K-factors (40/32/24/16 by developmental stage). Learning idempotency (BC-LEARN updates replay-safe). | Circuit breakers (node, skill, model): CLOSED/OPEN/HALF_OPEN state machines, independent at all three levels. Escalation Ladder L1-L5. Mutation logging (`MutationEvent` with before/after diffs). | PreMortem lightweight: runs on every DAG before execution. Commitment strategies: COMMITTED/TENTATIVE/EXPLORATORY, reconsideration triggers. |
| **WEEK 6 CHECKPOINT** | **Multi-wave DAGs execute. Skills are ranked and updated after execution. Circuit breakers isolate failures. Failure classification works on system layer.** | | |
| 7 | Provider router: circuit-breaker-based failover, selection decision logging (BC-CROSS-002), failover surfaced within 500ms (BC-CROSS-003). Model cost drift watchdog stub. | Three-pass Decomposer Pass 3 complete (topology validation, failure domain check). Wave replanning after mutations. DAG acyclicity check post-mutation. | L2 progressive disclosure: `layer2_summary` required field on all `NodeVisualState`. 4-mode visualization complete (execution, learning, resilience, planning). Tooltip margin info. |
| 8 | End-to-end performance validation against all 5 budgets. Meta-layer cost measurement (target < 10% of execution cost). SQLite read/write optimization for < 50ms context store. | 10 seed templates authored and validated. Alex's use case acceptance test (release readiness workflow, 8-15 nodes, 2+ waves). Hello World timed test on clean machine. | UX polish: no academic terminology at L1 (BC-UX-001). Max 3 human gates per execution (BC-UX-006). Resilience overlay default-on verification. Complete Playwright E2E tests for Week 4 + 6 + 8 acceptance criteria. |
| **WEEK 8 CHECKPOINT** | **Phase 1 release. Hello World < 5 minutes. 10 seed templates. Alex's use case end-to-end. All 19 acceptance criteria pass.** | | |

### Integration Coordination Points

These are the moments where engineers must synchronize explicitly. Calendar these at the start of the project.

| Week | Integration Point | Engineers | Coordination Needed |
|------|-------------------|-----------|---------------------|
| 1, end | Type system handoff | A, B, C | A publishes `types.ts`. B and C review for missing types before building on top. Freeze types.ts API for 48 hours after handoff. |
| 2, end | MockLLMProvider handoff | A -> B, C | A publishes mock provider interface. B and C switch from stubs to mock provider. |
| 3, end | Execution engine + Evaluator join | B + C | B's Executor calls C's Stage 1 Reviewer inline. Define the interface contract and fix it before either continues building. |
| 4, mid | ContextStore + Execution join | A + B | B's Executor calls A's ContextStore for progressive summarization. Integration test: context at 100% and 200% token budget. |
| 5, end | Learning engine + Execution trace | A + B | A's Thompson/Elo updates consume B's execution trace format. Agree on `NodeTrace` schema before A builds update logic. |
| 6, end | Circuit breaker + Skill cascade | A + B | A's skill cascade must check B's circuit breaker state before selecting a skill. Integration test: breaker open, cascade skips skill. |
| 7, mid | Provider router + Execution | A + B | A's failover logic must surface within 500ms (BC-CROSS-003). B's executor calls router and handles failover events. |
| 8, start | Full system integration test | A, B, C | All three engineers run Alex's acceptance test together. Fix blockers before Week 8 polish begins. |

---

## 5. Performance Budgets

| Operation | Target | Measurement Method | Acceptance Criteria |
|-----------|--------|--------------------|---------------------|
| Stage 1 review (per node) | < 500ms | Wall-clock timer wrapping `reviewStage1()`. Percentile measurement over 100 calls with MockLLMProvider at realistic latency. | p95 < 500ms. No single call > 1000ms. |
| Stage 2 review Channel A (per node) | < 5s | Wall-clock timer wrapping `reviewStage2ChannelA()`. Includes position-swap double evaluation. | p95 < 5s. No single call > 10s. |
| ContextStore lookup (`get_relevant_context()`) | < 50ms | Benchmark with context store at 100%, 200%, and 500% of token budget. Summarization path must not exceed budget. | p95 < 50ms at all fill levels. Summarization never produces output exceeding token budget. |
| Skill selection cascade (5 steps end-to-end) | < 100ms | Timer wrapping `selectSkill()`. Includes all 5 steps: hard filters, relevance ranking, pattern recognition, Thompson sampling. | p95 < 100ms with a skill library of 50+ skills. Fast path (pattern recognition bypass) must complete in < 10ms. |
| Three-pass decomposition (< 20 nodes) | < 15s | Wall-clock timer wrapping `threePassDecompose()`. Tested on 15-node and 20-node problems. | p95 < 15s. BC-CROSS-007. Fails acceptance if any run on a < 20-node problem exceeds 20s. |
| Meta-layer cost (all orchestration per 12-node DAG) | < 10% of execution cost | Cost tracking middleware on every LLM call. Sum: Sensemaker + Decomposer + PreMortem + Stage 1 x N + Stage 2 x M + Looking Back. | Verified against a 12-node Sonnet-execution DAG. Meta-layer cost < 10% of node execution cost. BC-BIZ-003. |
| WebSocket event delivery (executor -> visualization) | < 200ms | Instrument event emit and receipt timestamps. Test with 10-node concurrent execution. | p95 < 200ms from node state change to visualization update. |
| Hello World (install to first DAG complete) | < 5 minutes | Timed manual test on a clean machine by a person who has not seen the tool before. | Two independent timed tests both < 5 minutes. BC-BIZ-002. |

### Performance Budget Measurement Infrastructure

Engineer A owns performance measurement infrastructure by Week 4. Required:

- Timing wrapper utility that logs operation name, duration, and percentile bucket
- Cost tracking middleware that intercepts all LLM calls and accumulates cost by operation type
- Benchmark harness in Vitest that runs each operation 100 times and reports p50/p95/p99
- Performance regression gate in CI: any operation exceeding its p95 budget fails the build

---

## 6. Risk Register

Risks ordered by (probability x impact). Top 10 risks to Phase 1 delivery.

| # | Risk | Probability | Impact | Mitigation | Owner |
|---|------|-------------|--------|-----------|-------|
| 1 | **Three-pass decomposition quality is too low for Alex's use case.** The sensemaker and decomposer, running on Haiku/Sonnet, produce DAGs that require excessive human correction before they are useful. | High | Critical | Prioritize seed templates that constrain the decomposition space. Accept that Pass 1 will be weak until skills accumulate. Alex's use case must work with a hand-crafted seed template for the acceptance test. Measure decomposition quality empirically from Week 4 and tune prompts. | Engineer B |
| 2 | **ContextStore performance degrades under realistic multi-wave load.** Progressive summarization logic hits token budget limits and fails to stay under 50ms. | Medium | High | Implement ContextStore with caching layer for summarized content. Benchmark weekly from Week 3. If p95 > 50ms in Week 5, escalate to architecture review. Redis or in-memory LRU cache may be required earlier than planned. | Engineer A |
| 3 | **MockLLMProvider insufficient for testing complex behaviors.** Tests that depend on the mock cannot exercise the skill cascade, circuit breaker interactions, or Byzantine failure modes realistically. | Medium | High | Define MockLLMProvider interface in Week 1 before any other system depends on it. Include: response patterns, configurable latency, configurable failure types, call recording. Run integration tests against real API (gated, low-cost) for complex scenarios. | Engineer A |
| 4 | **ReactFlow performance unacceptable at 50+ nodes with live WebSocket updates.** The visualization layer becomes the bottleneck, not the execution engine. | Medium | High | ReactFlow v12.4+ is specified in the tech stack for its virtual rendering. Benchmark at 50 nodes with 10 WebSocket events/second in Week 4. If perf is unacceptable, limit concurrent node rendering and batch state updates. Hierarchical collapse (ADR-029) is the escape hatch above 300 nodes. | Engineer C |
| 5 | **Integration between Execution Engine and Evaluator causes latency blowup.** Stage 1 runs synchronously per node; sequential evaluation adds more latency than expected to multi-node waves. | Medium | High | Stage 1 must run in parallel with other nodes in the same batch, not sequentially. Architect the executor to fire evaluation concurrently per node. If p95 Stage 1 budget is tight, profile in Week 3 and optimize before multi-wave work in Week 5. | Engineer B + C |
| 6 | **Thompson sampling converges prematurely on limited Phase 1 skill library.** With only 10-15 seed skills, the algorithm has nothing useful to explore. | Low-Medium | Medium | Pre-seed Thompson parameters with calibration runs before shipping seed templates. Use K=40 (novice) to maintain high exploration during Phase 1. Accept that Phase 1 Thompson benefits are limited; the mechanism must be correct, not impactful, in Phase 1. | Engineer A |
| 7 | **The Hello World 5-minute requirement fails even for the team.** Onboarding friction (install, config, first problem) consumes more than 5 minutes before the first DAG runs. | Medium | High | Designate Engineer C as the UX lead. Conduct an internal timed dry run in Week 6. If it takes > 5 minutes internally, block Week 7 scope until the install path is fixed. Seed templates must be immediately accessible without configuration. | Engineer C |
| 8 | **Week 4 integration sync fails.** The execution engine and evaluator are not ready to wire together, and Week 5 begins without a working end-to-end path. | Low-Medium | Critical | Escalate to EM immediately if integration sync is at risk by Week 3, Day 3. De-scope to a mock evaluator for the Week 4 checkpoint if necessary. The Week 4 milestone requires end-to-end flow with real execution, not real evaluation quality. | All |
| 9 | **ConfidentIncorrectError detection heuristic produces too many false positives.** Byzantine classification fires on correct outputs, causing unnecessary Stage 2 escalation and cost blowup. | Medium | Medium | Start with the conservative heuristic from the constitution (cross-reference with independent evaluation, not self-assessment). Tune detection threshold empirically from Week 5 data. If false positive rate > 5%, raise the threshold. | Engineer B |
| 10 | **Scope creep from Phase 2 features.** Engineers begin implementing method-level learning or multi-dimensional Elo during Phase 1 because the architecture "makes it easy." | Low | High | Define a strict scope freeze after Week 1. Any Phase 2 feature request goes into a backlog document, not the Phase 1 sprint. The scope reduction table in Section 1 is the enforcement document. EM reviews scope weekly. | EM |

---

## 7. What Ships at Week 4

**Internal milestone: "First DAG Executes"**

This is a working internal demo, not a user-facing release. Purpose: validate the core execution pipeline, identify integration failures before they compound.

### What Works at Week 4

- A well-formed problem submitted to the Sensemaker produces a ProblemUnderstanding with validity score
- The Halt Gate fires on ill-defined input ("make it better" -> HALT_CLARIFY with structured clarification request)
- Three-pass decomposer (Passes 1+2) produces a valid DAGDefinition with no cycles and consistent edge types
- A single-wave DAG with 3+ concrete nodes executes end-to-end using MockLLMProvider
- Stage 1 review runs on every node; ReviewResult exists for all completed nodes
- Stage 2 Channel A triggers when `shouldEscalateToStage2()` returns true
- The ReactFlow visualization renders a live DAG with WebSocket state updates (4-state L1 vocabulary)
- The ContextStore provides progressive summarization and returns context within 50ms budget
- The type system compiles with no circular dependencies (`tsc --noEmit` passes)

### What Does Not Work at Week 4

- No multi-wave execution (vague nodes are rendered but not expanded)
- No skill learning (Thompson parameters exist in SQLite but are not updated post-execution)
- No circuit breakers (failure handling is basic retry only)
- No failure classification (system-layer taxonomy exists in types but is not populated)
- No Looking Back or Monster-barring
- No seed templates (Alex's use case is hand-constructed)
- Real LLM provider integrations are present but not performance-tested

### Week 4 Acceptance Criteria (from Appendix L)

| Criterion | Contract |
|-----------|---------|
| Single-wave DAG with 3+ nodes executes end-to-end | BC-EXEC-001 |
| Halt gate fires on ill-defined input with HALT_CLARIFY | BC-DECOMP-001 |
| Stage 1 review runs on every node | BC-EVAL-001 |
| Three-pass decomposition produces valid DAG (acyclic, consistent, vague node invariants) | BC-DECOMP-002 |
| Context store provides progressive summarization | BC-EXEC-004 |
| Type system compiles with no circular dependencies | BC-CROSS-010 |

### Week 4 Hard Obstacle Scenario (CEO's question)

**Assume**: The Sensemaker + Decomposer integration is slower than expected. Pass 1 takes 8-12 seconds on its own, threatening the 15-second overall budget.

**Response**: Do not slip Week 4 milestone. Instead: (a) complete the pipeline end-to-end with a manual decomposition injection for the demo, (b) parallelize Pass 1 prompt optimization in Week 5 alongside Week 5 scope, (c) file a performance risk in the risk register. The milestone requires the pipeline to work, not the pipeline to be fast. Performance is a separate concern with its own acceptance criteria measured at Week 8.

---

## 8. What Ships at Week 6

**Alpha candidate milestone: "Multi-Wave with Learning"**

This is the first version that demonstrates the core V3 value proposition: execution that improves through learning and survives failures without cascading.

### What Works at Week 6

- Multi-wave DAGs execute: Wave N begins only after Wave N-1 completion event
- Vague nodes expand into sub-DAGs when upstream results become available
- Skill rankings update after every DAG execution (Thompson params and scalar Elo in SQLite)
- Stage-gated K-factors (40/32/24/16) are applied by developmental stage
- Circuit breakers operate independently at node, skill, and model levels; opening one does not block others
- System-layer failure classification correctly identifies omission, crash, crash_recovery, and byzantine failures
- Escalation Ladder runs through all 5 levels on repeated failures
- Skill selection cascade respects hard filters; wrong output type skills are never selected
- Monster-barring detection alerts when a skill improves by narrowing its scope
- Looking Back Q1-Q2 runs after every DAG execution and is non-skippable
- Mutation logging captures all 7 mutation types with before/after DAG diffs

### What Does Not Work at Week 6

- No seed templates yet (Alex's use case is still hand-constructed)
- UX is functional but not polished; L2 progressive disclosure is in progress
- PreMortem is lightweight only; no deep mode calibration
- Performance budgets have been benchmarked but not fully optimized
- Hello World install path has not been timed with an external tester

### Week 6 Acceptance Criteria (from Appendix L)

| Criterion | Contract |
|-----------|---------|
| Multi-wave DAGs execute with vague node expansion | BC-DECOMP-004 |
| Skill rankings update after execution | BC-LEARN-001 |
| Circuit breakers prevent cascade (5 failures -> breaker opens, others continue) | BC-FAIL-004 |
| Failure classification on system layer | BC-FAIL-001 |
| Skill selection cascade respects hard filters | BC-PLAN-002 |

### Week 6 Hard Obstacle Scenario (CEO's question)

**Assume**: Vague node expansion produces DAGs that fail Pass 3 topology validation at high rates. Expansion creates shared failure domains, and the topology validator keeps blocking execution.

**Response**: Downgrade Pass 3 from blocking to advisory for vague-node-expanded sub-DAGs only. Log all Pass 3 failures as warnings. Continue execution with failure domain warnings visible in the L1 resilience overlay. This preserves Week 6 milestone scope while the underlying topology problem is investigated. File as a research item for Week 7 PreMortem calibration.

---

## 9. What Ships at Week 8

**Phase 1 Release: "Hello World < 5 Minutes"**

This is the external-facing Phase 1 deliverable. It satisfies the CEO's business requirement (5-minute Hello World, first-customer value story) and the EM's engineering requirement (19 acceptance criteria from Appendix L).

### What Works at Week 8

Everything from Week 6, plus:

- 10 seed templates available on first launch (no configuration required)
- L1/L2 progressive disclosure complete: L1 uses only 4-state vocabulary with no academic terminology; L2 shows `layer2_summary` on every node
- PreMortem (lightweight) runs on every DAG including depth-1 problems
- Commitment strategies (COMMITTED/TENTATIVE/EXPLORATORY) assigned at planning time, enforced at runtime
- DAG-only coordination model operational with interface stub for Phase 2 Team model
- Provider router with circuit-breaker-based failover and 500ms surface guarantee
- Mock LLM provider fully tested with all failure mode types
- Performance: all 5 budgets met at p95
- Meta-layer cost < 10% of execution cost on a 12-node DAG
- Decomposition < 15 seconds for < 20 nodes
- All 19 acceptance criteria from Appendix L pass
- Alex's end-to-end acceptance test passes: release readiness workflow, 8-15 nodes, 2+ waves, Looking Back, measurably different skill selection on second run

### Week 8 Acceptance Criteria (from Appendix L)

| Criterion | Test | Contract |
|-----------|------|---------|
| New user installs and runs first DAG in < 5 minutes | Timed manual test on clean machine | BC-BIZ-002 |
| 10 seed templates available | Count templates in library | Part 4 roadmap |
| Looking Back Q1-Q2 runs after every DAG | Execute 3 DAGs; verify LookingBackResult exists for all | BC-LEARN-003 |
| Monster-barring detection active | Simulate a narrowing skill; verify alert fires | BC-LEARN-005 |
| L1/L2 progressive disclosure functional | View completed DAG at L1 (no academic terminology); expand to L2 (layer2_summary present) | BC-UX-001, BC-UX-005 |
| Meta-layer cost < 10% of total | Execute a 12-node DAG; verify meta cost ratio | BC-BIZ-003 |
| Decomposition < 15s for < 20 nodes | Time three-pass decomposition on a 15-node DAG | BC-CROSS-007 |
| Stage 1 review < 500ms (p95) | Performance benchmark | EM requirement |
| Stage 2 review < 5s (p95) | Performance benchmark | EM requirement |
| Context store lookup < 50ms (p95) | Performance benchmark | EM requirement |
| Skill cascade < 100ms (p95) | Performance benchmark | EM requirement |
| DAG acyclicity invariant holds after all mutation types | Inject all 7 mutation types; verify no cycles introduced | BC-EXEC-001 |
| Evaluation monotonicity: Floor failure prevents Wall/Ceiling computation | Inject Floor failure; verify Wall not computed | BC-EVAL-001 |

### Week 8 Hard Obstacle Scenario (CEO's question)

**Assume**: The Hello World timed test fails in Week 7. It takes 8 minutes on a clean machine. Install friction and seed template discovery are the blockers.

**Response**: Declare a UX emergency in Week 7. Pull Engineer A off provider router polish (defer to Phase 1.1 patch). Reassign full Week 7 and Week 8 UX capacity to install experience. The provider router failover is a correctness feature; a 5-minute Hello World is the business-critical gate for external credibility. Ship Week 8 with provider router at basic (no-failover) level and a Phase 1.1 patch on the schedule.

---

## 10. Addresses to CEO and EM Review Blockers

A complete cross-reference to confirm every blocking item from the Phase 5 reviews is resolved in this document or in the constitution.

### EM Blocking Items

| Concern | Resolution |
|---------|-----------|
| `estimateFailureProbability()` formula not specified | Constitution Part 3: "The Stage 2 Escalation Formula." Not repeated here; see Part 3. |
| Mock LLM provider interface not defined | Constitution Part 4: "Mock LLM Provider Interface" with full TypeScript interface. Assigned to Engineer A Week 1 in Section 4 of this document. |
| Phase 1 scope too large (11 systems, 3 engineers, 8 weeks) | Section 1 of this document: 23-system in-scope list, 16-system deferred list, rationale for each deferral. |
| `ConfidentIncorrectError` detection heuristic missing | Constitution Part 2: "ConfidentIncorrectError Detection Heuristic." Assigned to Engineer B Week 5 risk mitigation in Section 6. |
| No V2-to-V3 migration path | Section 2 of this document: explicit clean-slate declaration with 3-step migration path for V2 users. |
| Feature dependency graph missing | Section 3 of this document: 9-layer ASCII dependency graph with P0 dependency table. |
| Performance budgets not specified | Section 5 of this document: 8 operations with target, measurement method, and acceptance criteria. |

### CEO Blocking Items

| Concern | Resolution |
|---------|-----------|
| Critical path document missing (week 4/6/8 deliverables) | Sections 7, 8, 9 of this document: week 4, 6, and 8 with hard obstacle scenarios. |
| First paying customer persona not named | Constitution Part 4: "First-Customer Persona" — Alex, senior engineer at a 50-person SaaS startup, with Day 1/30/180 journey. This document enforces Alex's use case as the Week 8 end-to-end acceptance test. |
| No critical path with engineer assignments | Section 4 of this document: 8-week assignment plan for Engineers A, B, C with integration coordination points. |

---

*End of Phase 1 Build Roadmap.*

*Derived from WinDAGs V3 Constitution (Parts 4-5) and Phase 5 Review Brief. Intended for sprint planning. Next step: sprint 0 kickoff with all three engineers to validate estimates and surface early risks.*
