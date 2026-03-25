---
license: Apache-2.0
name: mythical-man-month
description: Classic software engineering text on project management, Brooks's Law, and the nature of software complexity
category: Research & Academic
tags:
  - software-engineering
  - project-management
  - brooks-law
  - complexity
  - classic
---

# SKILL: The Mythical Man-Month

Strategic framework for managing complex system development, revealing why intuitive approaches to scaling, coordination, and change management systematically fail.

## DECISION POINTS

### Scope Change Response Matrix

| Change Size | Timeline Pressure | Action |
|-------------|------------------|---------|
| <10% features | Low pressure | Accept change, adjust internally |
| <10% features | High pressure | Accept change, extend deadline 1-2 weeks |
| 10-25% features | Low pressure | Formal re-estimation, likely extend timeline |
| 10-25% features | High pressure | **Cut other features OR extend deadline** |
| >25% features | Any pressure | **Stop and redesign architecture** |
| >50% features | Any pressure | **Treat as new project, plan to throw one away** |

### Team Scaling Decision Tree

```
IF task has zero interdependencies
  THEN people scale linearly (rare in software)

IF task requires coordination between workers
  ├─ IF coordination is <20% of effort per person
  │   THEN add people cautiously (2-3x max team size)
  ├─ IF coordination is 20-50% of effort
  │   THEN keep team small (3-7 people max)
  └─ IF coordination is >50% of effort
      THEN redesign task to reduce dependencies

IF project is late AND <50% complete
  THEN extend deadline OR cut scope (never add people)

IF project is late AND >50% complete
  THEN extend deadline only (adding people guarantees failure)
```

### Agent Architecture Coordination Strategy

```
IF agents need shared state
  ├─ IF state changes <10 times/minute
  │   THEN use single coordinator with state ownership
  └─ IF state changes >10 times/minute
      THEN redesign to eliminate shared state

IF agents need to negotiate outcomes
  ├─ IF <3 agents total
  │   THEN allow peer-to-peer communication
  └─ IF ≥3 agents
      THEN use mediator pattern (single orchestrator)

IF task requires conceptual unity
  THEN single orchestrator with specialized tools
  NOT peer-to-peer agent democracy
```

### Documentation Priority Decisions

```
IF you can't write clear spec in 2 pages
  THEN design isn't ready for implementation

IF writing documentation feels painful
  THEN you haven't decided what you're building

IF spec and code diverge
  ├─ IF spec is more accurate → fix code
  ├─ IF code is more accurate → update spec
  └─ IF both are wrong → stop and redesign

Priority order:
1. User interface/API spec (what system does)
2. Architecture overview (how pieces fit)  
3. Individual component specs
4. Implementation details (last)
```

## FAILURE MODES

### The Late Project Death Spiral
**Symptoms**: Project behind schedule, management proposes adding people, velocity decreases further
**Detection**: "We're 3 months late, let's hire 5 more developers"
**Root Cause**: Training overhead + repartitioning costs exceed productivity gains
**Fix**: Accept delay OR cut scope OR redesign for different partitioning. Never add people to late project in final stages.

### Committee Architecture Syndrome  
**Symptoms**: System has multiple interaction paradigms, inconsistent interfaces, users can't form mental model
**Detection**: Every feature requires learning new interaction pattern
**Root Cause**: Democratic design process without single architectural vision
**Fix**: Designate single architect for external interfaces. Implementation can be distributed, architecture must be unified.

### The 90% Done Trap
**Symptoms**: Progress reports show 90% complete for months, testing keeps finding integration issues
**Detection**: No concrete deliverable milestones, "almost done" status persists >2 weeks  
**Root Cause**: Underestimated integration complexity, no sharp completion criteria
**Fix**: Define binary milestones (passes all tests, user can complete workflow X). Allocate 50% of schedule to integration/testing.

### Requirements Stability Delusion
**Symptoms**: Every change request treated as scope creep emergency, architecture can't accommodate variations
**Detection**: "But that's not what we originally agreed to!" repeated frequently
**Root Cause**: Assuming requirements won't change vs. designing for inevitable change
**Fix**: Plan for 25% requirement changes. Build clean interfaces. Treat change as normal, not exceptional.

### Second System Effect
**Symptoms**: Reimplementation includes every withheld feature plus kitchen sink, loses original system's elegance
**Detection**: New version has 3x features but takes 5x longer to learn
**Root Cause**: Architect compensating for first system's limitations by including everything
**Fix**: Maintain discipline. Second system should be refined, not inflated. Test conceptual integrity with naive users.

## WORKED EXAMPLES

### Multi-Agent Code Review System

**Scenario**: Building automated code review with 4 specialized agents (syntax, security, performance, architecture).

**Naive Approach**: Peer-to-peer agent communication where each agent reviews independently then they negotiate final score.

**Brooks Analysis Applied**:
1. **Communication overhead**: 4 agents = 6 communication links. Each agent must understand others' reasoning.
2. **Conceptual integrity**: Who owns the final "accept/reject" decision? Committee vote creates inconsistent standards.
3. **Change impact**: New review criteria requires updating all 4 agents' negotiation logic.

**Expert Decision Process**:
- **Architecture choice**: Single orchestrator agent with 4 specialized tool agents
- **Reasoning**: Orchestrator maintains consistent review philosophy, tools provide analysis
- **Interface design**: Each tool returns structured data + confidence score, orchestrator decides
- **Change management**: New criteria only requires updating orchestrator logic

**What novice misses**: Tries to make agents "smart" and autonomous
**What expert catches**: Minimizes coordination points, preserves decision consistency

**Result**: 5x simpler debugging, consistent review standards, easy to modify review criteria

### Late AI Training Pipeline Project  

**Situation**: ML training pipeline 2 months behind, manager wants to add 3 GPU engineers.

**Decision Process**:
1. **Task analysis**: Pipeline requires sequential stages (data → preprocessing → training → validation)
2. **Current bottleneck**: Data preprocessing taking 3x expected time
3. **Communication overhead**: New engineers need 2-4 weeks to understand custom data formats
4. **Training burden**: Existing 2 engineers must stop work to onboard newcomers

**Brooks-informed decision**:
- **Don't add people**: Training cost (8 person-weeks) exceeds remaining schedule slack (6 weeks)  
- **Cut scope instead**: Defer advanced preprocessing features, use simpler baseline
- **Extend deadline**: 4 weeks for current team to finish vs. 8+ weeks with added people

**Outcome**: Delivered in 10 weeks vs. estimated 12+ weeks if people added

## QUALITY GATES

### Design Phase Completion
- [ ] Single architect can explain system in 2-page overview
- [ ] External interfaces documented before any implementation starts  
- [ ] User mental model tested with 3+ naive users
- [ ] All major components identified with <5 interfaces between them
- [ ] Change scenarios (25% requirement shift) don't break architecture

### Development Phase Milestones  
- [ ] Each milestone produces working system (not just components)
- [ ] Integration budget allocated (25% of total effort minimum)
- [ ] Communication overhead measured: coordination time <20% per developer
- [ ] Team size stable: no additions after 50% schedule point
- [ ] Documentation current: spec changes drive code changes, not reverse

### Pre-Ship Quality Gates
- [ ] Conceptual integrity verified: naive user can predict system behavior
- [ ] All planned features implemented OR explicitly descoped with stakeholder sign-off
- [ ] System testing complete: full end-to-end workflows pass
- [ ] Performance meets requirements under realistic load
- [ ] Documentation sufficient for maintenance team handoff

## NOT-FOR BOUNDARIES

**This skill should NOT be used for**:
- Perfectly partitionable tasks (data processing, batch jobs) → Use parallel processing patterns
- Research/exploration projects → Use rapid prototyping methodologies  
- Small teams (<4 people) → Coordination overhead is minimal, other factors dominate
- Well-understood problems with stable requirements → Use standard SDLC approaches
- Real-time systems with hard latency constraints → Use real-time engineering principles

**Delegate instead**:
- For technical architecture decisions → Use `system-design` skill
- For individual productivity → Use `deep-work` and `focus-management` skills  
- For requirements gathering → Use `stakeholder-management` skill
- For team dynamics → Use `team-leadership` skills
- For project tracking → Use `agile-project-management` skill

**Key boundary**: Brooks's insights apply when **coordination overhead** becomes significant factor. If your team spends <10% time on coordination, other management approaches may be more relevant.