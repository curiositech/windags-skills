---
license: Apache-2.0
name: recursive-synthesis
description: Orchestrate multi-agent collaborative document synthesis through 6 phases - Divergence, Synthesis, Commentary, Consolidation, Reality Check, Final Merge. Produces authoritative founding documents from complex multi-perspective inputs. Use for constitutional documents, architecture decisions, organizational charters, or any document requiring rigorous multi-perspective synthesis. Activates on "synthesize document", "multi-agent authorship", "collaborative synthesis", "founding document", "architecture document", "recursive synthesis", "constitutional document", "multi-perspective document". NOT for simple document writing, single-author tasks, quick summaries, or documents that don't require adversarial review.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - Task
category: Cognitive Science & Decision Making
tags:
  - recursive-synthesis
  - analysis
  - integration
  - deep-thinking
  - methodology
pairs-with:
  - skill: team-builder
    reason: Design agent teams for each phase
  - skill: dag-planner
    reason: Plan execution waves for parallel phases
  - skill: orchestrator
    reason: Coordinate multi-phase execution
---

# Recursive Synthesis

Orchestrate multi-agent collaborative document synthesis through 6 phases to produce authoritative founding documents that require rigorous multi-perspective analysis.

## Decision Points

### Primary Execution Tree

```
Is this a founding document (constitution, charter, ADR)?
├── NO → Use single-author writing skills instead
└── YES → Continue to phase selection

Are 10+ perspectives genuinely needed?
├── NO → Use standard collaborative writing
└── YES → Continue to agent selection

Are there irreconcilable tensions expected?
├── NO → Use simplified consensus process
└── YES → Full 6-phase recursive synthesis
    │
    ├── Phase 0: Setup (always required)
    │   ├── Problem scope clear? → NO: Clarify before proceeding
    │   ├── Agents selected for max diversity? → NO: Redesign roster
    │   └── Ground rules established? → NO: Define steel-man rules
    │
    ├── Phase 1: Divergence
    │   ├── All 10 papers received? → NO: Wait/chase missing
    │   ├── Genuine diversity achieved? → NO: Replace echo agents
    │   └── Quality threshold met? → NO: Request rewrites
    │
    ├── Phase 2: Synthesis
    │   ├── Convergence > 50%? → YES: Proceed to commentary
    │   ├── Convergence 25-50%? → Flag high-tension synthesis
    │   └── Convergence < 25%? → Abort: Unsynthesizable problem
    │
    ├── Phase 3: Commentary
    │   ├── All steel-man sections present? → NO: Enforce requirement
    │   ├── Irreconcilable tensions flagged? → YES: Prepare dissenting appendix
    │   └── Constructive amendments provided? → NO: Request specifics
    │
    ├── Phase 4: Consolidation
    │   ├── Soul Document coherent? → NO: Lead Architect revision
    │   ├── Dissenting Appendix honest? → NO: Add minority voices
    │   └── Scope clearly documented? → NO: Define boundaries
    │
    ├── Phase 5: Reality Check
    │   ├── Any "COMPLEX" verdicts? → YES: Major rework required
    │   ├── Multiple "BUILD" verdicts? → YES: Address P0/P1 demands
    │   └── Majority "SHIP" verdicts? → YES: Proceed to final merge
    │
    └── Phase 6: Final Merge
        ├── Constitution authoritative? → NO: Strengthen principles
        ├── Practitioner's Guide actionable? → NO: Add concrete steps
        └── Editorial Notes complete? → NO: Document all decisions
```

### Model Selection Decision Tree

```
Which agent type?
├── Philosophical/Complex reasoning → Use Opus
├── Domain-specific technical → Use Sonnet  
└── Senior practitioner judgment → Use Opus

Which phase?
├── Phase 1 (Divergence) → Mix: 4 Opus (complex), 6 Sonnet (technical)
├── Phase 2 (Synthesis) → Opus (long context required)
├── Phase 3 (Commentary) → Match Phase 1 model per agent
├── Phase 4 (Consolidation) → Opus (highest judgment)
├── Phase 5 (Reality Check) → Opus (senior practitioner)
└── Phase 6 (Final Merge) → Opus (best writing quality)
```

## Failure Modes

### Echo Chamber Collapse
**Symptoms**: All agents reach similar conclusions despite different prompts; position papers sound alike; no genuine tensions emerge
**Diagnosis**: Agent selection lacks intellectual diversity OR prompts insufficiently enforce perspective differences
**Fix**: Replace 3-4 agents with genuinely opposing viewpoints; strengthen agent persona prompts with specific belief systems; enforce no-cross-talk rules

### Premature Convergence
**Symptoms**: Synthesis phase finds 80%+ agreement; few items in dissenting appendix; Reality Check agents have no major concerns
**Diagnosis**: Problem wasn't complex enough to require recursive synthesis OR agent perspectives were too narrow
**Fix**: Either abort to simpler process OR restart with more adversarial agent selection (add contrarians, edge cases, minority positions)

### Context Window Degradation
**Symptoms**: Later phases lose nuance from earlier phases; agents reference incomplete information; final document doesn't reflect early insights
**Diagnosis**: Token limits causing information loss between phases OR inadequate summarization strategy
**Fix**: Use structured references instead of full text; create phase summaries at each transition; implement strategic excerpt selection

### Analysis Paralysis
**Symptoms**: Agents get stuck in Phase 3 commentary requesting endless revisions; Lead Architect can't reconcile conflicting demands; Reality Check identifies problems but no solutions
**Diagnosis**: No clear decision-making authority established OR quality gates too perfectionist
**Fix**: Designate tie-breaking authority; set "good enough" thresholds; impose time boxes on each phase; accept documented tensions rather than forcing resolution

### Complexity Theater
**Symptoms**: Process generates more meta-documents than actual content; agents debate methodology more than substance; final Constitution is less clear than original problem statement
**Diagnosis**: Process became end in itself rather than means to clarity
**Fix**: Enforce deliverable-focused phase gates; require every meta-document to improve end-user experience; Constitution must be simpler than process that created it

## Worked Examples

### Case Study: API Governance Constitution

**Context**: Engineering org with 50+ microservices needs unified API design principles. Current state: conflicting guidance, inconsistent implementations, integration friction.

**Phase 0 Setup**:
Agent selection for maximum tension:
- REST Purist (OpenAPI, resource modeling)
- GraphQL Advocate (single endpoint, type safety)  
- Performance Engineer (caching, latency optimization)
- Security Expert (auth, validation, threat modeling)
- Developer Experience (SDK generation, documentation)
- Event-Driven Architect (async messaging, eventual consistency)
- Legacy Systems Integrator (backwards compatibility)
- Domain Expert (business logic, service boundaries)
- Platform Engineer (infrastructure, deployment)
- Mobile-First Designer (bandwidth constraints, offline)

**Phase 1 Divergence Results**:
- REST Purist: "APIs must be resource-oriented with proper HTTP semantics"
- GraphQL Advocate: "Single endpoint with strong typing eliminates versioning hell"
- Performance Engineer: "Cache headers and compression are non-negotiable"
- Security Expert: "Zero-trust architecture with API gateway authentication"
- Developer Experience: "Auto-generated SDKs from machine-readable specs"

*Key insight: These aren't just different opinions—they represent fundamentally different mental models of what an API should optimize for.*

**Phase 2 Synthesis Challenge**:
Synthesizer finds convergence on:
- Machine-readable specifications (100% agreement)
- Consistent authentication (90% agreement)
- Proper error handling (80% agreement)

But irreconcilable tensions:
- REST vs GraphQL (fundamental architectural choice)
- Sync vs Async (different consistency models)
- Developer convenience vs Performance optimization

**Phase 3 Commentary Reveals**:
- Performance Engineer steel-mans GraphQL: "Eliminates over-fetching, reduces round trips"
- GraphQL Advocate steel-mans REST: "Simpler caching, better HTTP tooling support"
- Both critique synthesis for trying to support both paradigms

**Phase 4 Consolidation Decision**:
Lead Architect makes architectural choice: "REST-first with GraphQL gateway for specific use cases"
Dissenting Appendix: Documents when GraphQL is preferred, migration path

**Phase 5 Reality Check Catches**:
- EM: "No rollout timeline provided - this will take 18 months minimum"
- PM: "No metrics for measuring adoption success"
- Design: "No user journey for external developers consuming these APIs"

**Phase 6 Final Output**:
- Constitution: 12 core principles with REST-first architecture
- Practitioner's Guide: Step-by-step API design checklist with templates
- Editorial Notes: Documents GraphQL exception criteria and review process

## Quality Gates

### Phase-by-Phase Completion Rubric

**Phase 0 Complete When**:
- [ ] Problem definition is one clear sentence
- [ ] 10 agents selected with maximum intellectual diversity
- [ ] Ground rules include steel-man requirement
- [ ] File structure created with all directories
- [ ] PM/EM/Design excluded from Phases 1-4

**Phase 1 Complete When**:
- [ ] All 10 position papers received (1500+ words each)
- [ ] Each paper states 3-5 non-negotiable principles
- [ ] Papers represent genuinely different perspectives (not echoes)
- [ ] No coordination detected between agents
- [ ] Each paper includes concrete examples/case studies

**Phase 2 Complete When**:
- [ ] Principle hierarchy created with ranked-choice logic
- [ ] Convergence analysis shows Universal/Strong/Minority/Unique categories
- [ ] All irreconcilable tensions explicitly mapped
- [ ] Structural skeleton addresses all major themes
- [ ] No position paper ignored or misrepresented

**Phase 3 Complete When**:
- [ ] All 10 commentaries received
- [ ] Every commentary includes 3-point steel-man section
- [ ] Critiques are specific with line numbers/quotes
- [ ] Constructive amendments proposed (not just problems)
- [ ] Irreconcilable tensions confirmed/refined

**Phase 4 Complete When**:
- [ ] Soul Document speaks with one coherent voice
- [ ] Commentary integration decisions documented
- [ ] Dissenting Appendix handles tensions honestly
- [ ] Document scope clearly bounded
- [ ] All major positions represented fairly

**Phase 5 Complete When**:
- [ ] All 3 reality reports received (PM/EM/Design)
- [ ] Each report includes SHIP/BUILD/COMPLEX verdict
- [ ] P0/P1 demands are specific and actionable
- [ ] Fresh perspective genuinely challenges assumptions
- [ ] Implementation concerns surfaced and prioritized

**Phase 6 Complete When**:
- [ ] Constitution is authoritative and stands alone
- [ ] Practitioner's Guide provides concrete next steps
- [ ] Editorial Notes explain all major decisions
- [ ] All P0 Reality Check demands addressed
- [ ] Final deliverable simpler than process that created it

### Success Metrics
- **Authoritative**: Constitution resolves 80%+ of future disputes in domain
- **Actionable**: Practitioner can implement without further clarification
- **Honest**: Dissenting Appendix documents real tensions, not theater
- **Bounded**: Clear scope prevents mission creep
- **Adoptable**: Reality Check confirms implementability

## NOT-FOR Boundaries

**Do NOT use recursive synthesis for**:
- **Simple documentation**: README files, API docs, how-to guides → Use single-author writing instead
- **Time-sensitive decisions**: Incident responses, urgent releases, hotfixes → Use rapid decision-making instead  
- **Uncontested domains**: Well-established practices, purely technical specs → Use standard documentation instead
- **Single-stakeholder documents**: Team procedures, individual role definitions → Use collaborative editing instead
- **Exploratory work**: Research summaries, market analysis, brainstorming → Use research and analysis skills instead

**When to delegate instead**:
- For team formation → Use `team-builder` skill
- For execution planning → Use `dag-planner` skill  
- For multi-phase coordination → Use `orchestrator` skill
- For conflict resolution → Use `negotiator` skill
- For quick consensus → Use `facilitator` skill

**Anti-boundaries** (when you SHOULD use this):
- Constitutional documents that will govern future decisions
- Architecture decisions with multiple valid approaches
- Organizational charters with competing values
- Any document where "getting it right" matters more than speed
- Situations where irreconcilable tensions must be surfaced, not buried