# Review Concerns and Resolutions

9 reviewers examined the V3 consolidated specification. 4 technical reviewers (PM, EM, Design Lead, Market) and 5 outsider reviewers (Chef, Psychologist, Ad Creative, CEO, Sci-Fi Engineer). All approved with required changes.

---

## Technical Reviews (Phase 5a)

### PM Review

**Blocking concerns**:
1. Define first-run experience concretely → Deferred to implementation plan (constitution specifies architecture, not UX flow)
2. Specify seed template library (enumerate 10+ for Phase 1) → Addressed in Phase 1 critical path, week 7-8
3. Clarify Halt Gate UX → Addressed in Part 2: "The Halt Gate in Practice" with examples per failure mode
4. Add competitive first-run comparison → Deferred to measurement

**Key insight**: "Blank Problem Space Problem" — users arrive without a problem in mind. Need a demonstration DAG. → Addressed with `windags demo` command in practitioner's guide.

**Other changes**: Move Envelope to free tier (deterministic, zero cost). Add problem type picker for onboarding.

### EM Review

**Blocking concerns**:
1. Specify `estimateFailureProbability(node)` formula → Addressed in Part 3: "The Stage 2 Escalation Formula"
2. Define mock LLM provider interface → Addressed in Part 4: "Mock LLM Provider Interface"
3. Reduce Phase 1 scope — 11 systems too many for 3 engineers / 8 weeks. Defer: 4D failure classification (keep system-layer only), multi-dimensional Elo (keep scalar), coordination model abstraction (ship DAG-only) → Addressed in Part 4: "Phase 1 Scope Reduction"
4. Define `ConfidentIncorrectError` detection heuristic → Addressed in Part 2

**Key insight**: No V2→V3 migration path → Addressed in Part 4: "V2-to-V3 Compatibility" with clean-slate declaration for Phase 1, compatibility commitment for Phase 2+.

**Other changes**: Add Phase 1 feature dependency graph. Performance budgets: Stage 1 < 500ms, Stage 2 < 5s, context store < 50ms, skill cascade < 100ms.

### Design Lead Review

**Blocking concerns**:
1. Design pre-execution/onboarding state → Deferred to implementation (UX design task)
2. Design post-execution retrospective view → Addressed in Part 3: "Post-Execution Retrospective View"
3. Specify wave transition animation design → Addressed in Part 3: ADR-029
4. Failure explanation layer → Addressed in Part 2: "Failure Explanation Layer" with plain-language templates
5. Make `layer2_summary` required field → BC-UX-005

**Key insight**: No DAG authoring mode. Users can't modify decomposition before running. → Acknowledged as Phase 2 feature (power-user surface).

**Other changes**: 5 cognitive load spikes identified. Collapse L1 to 4-state vocabulary (ACTIVE/DONE/ATTENTION/PROBLEM).

### Market Review

**Blocking concerns**:
1. Revise free-tier evaluation depth → Envelope moved to free tier (ADR-033)
2. Add go-to-market narrative → Part 4: "Go-to-Market Timeline" with Day 1/30/180 story
3. Specify MCP relationship → ADR-034 covers MCP integration
4. Define open-source/commercial license boundary → Deferred to separate legal document

**Key insight**: Private organizational skill libraries should be an architectural concept, not just a tier feature. → Addressed in cross-deployment skill transfer protocol (Part 3).

**Other changes**: Rename "Market" coordination model (confuses economic/computational meanings).

---

## Outsider Reviews (Phase 5b)

### Chef Review — Approve with Required Changes

**Blocking concerns**:
1. Appoint Expediter function (monitors global execution arc) → Part 1: "The Expediter" with 5 signal/threshold/intervention rows
2. Define human gate timeout authority → Part 2: "Human Gate Timeout Authority" (fail DAG / escalate / proceed with default)
3. Specify "heightened monitoring" for competent stage → Part 3: "Heightened Monitoring in the Competent Stage" with 4 concrete triggers

**Key insight**: "Order of arrival problem" — execution order is not delivery order. Output delivery sequence concept is missing. → Partially addressed; acknowledged as implementation concern.

**Other changes**: Add freshness_ttl for time-sensitive outputs. PreMortem should include timing analysis.

### Psychologist Review — Approve with Required Changes

**Blocking concerns**:
1. Define maximum human cognitive load budget → Part 3: "Human Cognitive Load Budget" (max 3 gates per execution without batching, cognitive warmup, degradation conditions)
2. Collapse 9-color to 4-state vocabulary at L1 → Implemented: ACTIVE/DONE/ATTENTION/PROBLEM at L1; 9-state at L2/L3
3. Classify human gates by irreversibility (IRREVERSIBLE/QUALITY_CHECK/CALIBRATION) with limits → Part 3: gate classification with per-type limits

**Key insight**: Automation complacency — 99% reliable systems cause humans to rubber-stamp the critical 1%. → Addressed in Part 3: "The Complacency Break Mechanism" with periodic known-good/bad calibration cases.

**Other changes**: Add cognitive warmup at gate invocation. Model human override reliability as function of review count.

### Ad Creative Review — Major Revision (Positioning Only)

**Blocking concerns**:
1. Find "the sentence" — hire a copywriter → Part 1: "WinDAGs is the orchestration platform where AI agents accumulate genuine expertise — where every problem solved makes the next problem easier, and the system can show you exactly why."
2. Name audit — develop 5 alternatives, user test → Deferred (separate marketing effort)
3. Build and script canonical 90-second demo → Deferred (implementation task)

**Key insight**: Failure demo more persuasive than success demo for enterprise buyers. Show: problem → static tool fails → WinDAGs succeeds because it learned from similar problems.

**Preserved language**: "Monster-barring" is great marketing terminology. "Crystallized skills" should be a named product concept. Constitutional convention origin story is a marketing asset.

### CEO Review — Approve with Required Changes (Execution Planning)

**Blocking concerns**:
1. Write critical path document → Part 4: "Phase 1 Critical Path" with week-by-week deliverables
2. Name first paying customer persona → Part 4: "Alex, senior backend engineer at a 50-person fintech, managing 3 services"
3. Develop marketplace cold-start playbook → Part 3: "Marketplace Cold-Start Playbook" (who creates first 20 premium skills)

**Key insight**: Skills migration moat > data moat in months 6-18. Organizational embedding is the early moat. Design for stickiness from Phase 1.

**Other changes**: The $100M LangGraph question: 12-18 month window before well-funded competitor closes gap. 5-minute Hello World needs engineering budget.

### Sci-Fi Engineer Review — Approve with Required Changes

**Blocking concerns**:
1. Add cross-deployment skill transfer protocol → Part 3: "Cross-Deployment Skill Transfer Protocol" with privacy model and domain distance conditioning
2. Specify visualization chunking and scale boundaries → Part 3: ADR-029 (~300-500 node threshold, hierarchical collapse)
3. Add model cost drift watchdog → Part 4: monitors cost ratios, alerts when two-stage review becomes suboptimal

**Key insight**: Model substitution protocol — when new model deployed, flag Thompson params as stale, raise K-factors to novice, run calibration sequence. Model upgrades that break calibration are operationally indistinguishable from degradations.

**Other changes**: Synthetic bootstrapping for cold start. Skill library orthogonality metric (Gram-Schmidt analog). Context store breaks at 10K+ nodes.

---

## Summary: What Reviewers Changed

| Category | Concerns | Key Outcome |
|----------|:--------:|-------------|
| First-run experience | 3 | Demo DAG, problem type picker, 5-min Hello World |
| Phase 1 scope | 2 | Reduced from 11 to 7 systems |
| Cognitive load | 4 | 4-state L1, max 3 gates, complacency breaks |
| Business model | 3 | Envelope free, marketplace cold-start, license boundary |
| Implementation detail | 8 | Expediter, formulas, mock provider, gate timeout |
| Marketing | 3 | "The sentence," failure demo, 90-sec script |
| Scale | 2 | Visualization chunking, context store limits |
| Future-proofing | 2 | Model substitution protocol, cost drift watchdog |
| **Total blocking** | **27** | All addressed or explicitly deferred |
