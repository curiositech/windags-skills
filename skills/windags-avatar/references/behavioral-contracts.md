# WinDAGs V3 Behavioral Contracts

51 enforceable contracts. Each specifies what the system MUST do, not SHOULD do. These are testable requirements.

---

## Decomposition (BC-DECOMP)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | Halt and request clarification when validity < 0.6 | Feed ill-defined problems. Verify system halts, never produces a DAG. |
| 002 | Execute all three passes in order; Pass 2 uses no LLM calls | Instrument decomposer. Verify ordering. Verify Pass 2 makes zero LLM calls. |
| 003 | Vague nodes carry role_description and dependency_list but no agent config | Property-based test: every VagueNode has role_description, dependency_list, no agent field. |
| 004 | Wave N planned only after Wave N-1 completes (unless recognition >= 0.9) | Create multi-wave DAGs. Verify Wave N planning starts only after Wave N-1 completion event. |
| 005 | Every decomposition logged with meta-skill, method, commitment, scores | Execute any DAG. Verify decomposition log contains all four fields. |

## Planning (BC-PLAN)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | Planning completes before scheduling begins within each wave | Instrument plan/schedule phases. Verify no scheduling until plan is final. |
| 002 | Hard filters (signature, context) before any soft ranking or Thompson | Offer a skill with wrong output type. Verify it is never selected. |
| 003 | No shared failure domain nodes in same parallel batch | Create DAG with shared dependency. Verify they're scheduled sequentially. |
| 004 | PreMortem lightweight scan on every DAG, including depth-1 | Execute a trivial DAG. Verify PreMortem ran. |
| 005 | Edge protocol assignment at planning time, not changeable at runtime | Attempt to change edge protocol mid-execution. Verify rejection. |

## Execution (BC-EXEC)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | Kahn's algorithm for scheduling; batches respect failure domains | Verify topological sort. Inject shared-domain nodes. Verify separation. |
| 002 | Every mutation logged as MutationEvent with before/after diffs | Trigger every mutation type. Verify event stream has correct diffs. |
| 003 | Commitment reconsideration evaluated per strategy on events | Create TENTATIVE node. Trigger reconsideration event. Verify evaluation. |
| 004 | Progressive summarization: N-1 full, N-3+ one-liners | Execute 4-wave DAG. Verify Wave 1 content at Wave 4 is one-liner. |
| 005 | Coordination model abstraction in Phase 1; extensible without redesign | Verify interface exists. Adding Team model requires no Executor changes. |
| 006 | Protocol enforcement by infrastructure, not LLM | State machine transitions enforced in code. LLM cannot skip states. |

## Failure (BC-FAIL)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | System layer classification always; other dimensions at L2+ | Inject failures. Verify system_layer always populated. Other dims only at L2+. |
| 002 | Escalation ladder followed in order (L1→L5) | Inject failure. Verify L1 attempted before L2, etc. |
| 003 | Cross-family ensemble for Byzantine L3 | Inject confident-incorrect. Verify different model family used for review. |
| 004 | Circuit breakers independent at all three levels (node, skill, model) | Open per-skill breaker. Verify other skills still execute. |
| 005 | Saga compensation in reverse order; limitations logged honestly | Trigger saga. Verify reverse-order compensation. Verify limitation log. |
| 006 | Progressive/degenerating classification at L2+ | Track skill with narrowing scope. Verify degenerating flag at L2. |

## Learning (BC-LEARN)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | Thompson update after every node using Evaluator score, not self-assessment | Execute skill 5 times. Verify Thompson params change. Verify self-eval excluded. |
| 002 | Method quality tracked independently of skill quality | High method quality + low skill quality. Verify independent rankings. |
| 003 | Looking Back Q1-Q2 after every DAG; not skippable | Execute 3 DAGs. Verify LookingBackResult exists for all. |
| 004 | Near-miss events logged at 10% margin | Create node passing at 0.76 (threshold 0.70). Verify NearMissEvent logged. |
| 005 | Monster-barring on every skill revision; not overridable | Simulate narrowing skill. Verify alert fires. |
| 006 | G-Counter-compatible data structures for distribution readiness | Verify Thompson params are additive. Verify append-only quality history. |

## Evaluation (BC-EVAL)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | Floor before Wall before Ceiling; runtime protocol gate | Inject Floor failure. Verify Wall/Ceiling/Envelope NOT computed. |
| 002 | Self-eval outcome not in quality scoring | Verify quality scoring function excludes outcome self-assessment. |
| 003 | Position swapping on all pairwise neural evaluations | Verify both orderings tested. Verify position bias flag. |
| 004 | Quality stored as vectors; dimensions accessible to consumers | Verify QualityVector has per-dimension access. No scalar collapse. |
| 005 | Cognitive telemetry on all failures/mutations (mandatory) | Inject failure. Verify CognitiveTelemetryEvent logged. |
| 006 | Envelope computed for every DAG; zero cost (deterministic) | Execute any DAG. Verify EnvelopeScore exists. Verify zero LLM calls. |

## UX (BC-UX)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | No academic terminology at L1 (Overview layer) | Render L1 view. Search for BDI, HTN, Lakatos, Thompson. Verify none present. |
| 002 | Margin info in all node tooltips | Hover any completed node. Verify quality margin is shown. |
| 003 | Typed WebSocket events | Verify all WS events conform to DAGStateEvent type. |
| 004 | Resilience overlay default-on during execution | Start execution. Verify overlay is visible without user action. |
| 005 | layer2_summary required on every NodeVisualState | Verify type definition. Verify no null allowed. |
| 006 | Max 3 human gates per execution without batching | If 4+ gates needed, verify system batches them and warns user. |

## Business (BC-BIZ)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | Open-source core genuinely open (Apache 2.0) | Verify license file. Verify no BSL features required for basic operation. |
| 002 | Hello World < 5 minutes | Timed test on clean machine: install, configure, run first DAG. |
| 003 | Meta-layer cost < 10% of total execution cost | Execute 12-node DAG. Verify orchestration overhead < 10%. |

## Cross-Cutting (BC-CROSS)

| ID | Requirement | Test Strategy |
|----|-------------|---------------|
| 001 | ContextStore summarizes, not truncates | Verify summary output preserves structure. Never raw truncation. |
| 002 | ProviderRouter logs every selection decision | Execute DAG. Verify log entry for every model selection. |
| 003 | Failover events surfaced within 500ms | Inject provider failure. Verify failover event appears within 500ms. |
| 004 | Channel A uses different model family than execution | Verify Byzantine review channel uses different provider. |
| 005 | Cognitive telemetry stored separately from results | Verify separate storage. Telemetry deletion doesn't affect results. |
| 006 | Learning updates idempotent | Replay same update twice. Verify no double-counting. |
| 007 | Decomposition < 15s for < 20 nodes | Time three-pass on 15-node DAG. Verify < 15s. |
| 008 | Wave computation respects failure domain isolation | Verify failure domain check in wave scheduling. |
| 009 | Looking Back Q3-Q4 non-blocking | Verify Q3-Q4 run async, don't delay result delivery. |
| 010 | All types from single types.ts; no circular dependencies | Run tsc --noEmit. Verify no circular dependency errors. |
