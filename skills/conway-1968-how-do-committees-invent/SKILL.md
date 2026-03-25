---
license: Apache-2.0
name: conway-1968-how-do-committees-invent
description: Apply Conway's homomorphism principle to multi-agent system design, recognizing that agent coordination structure predetermines system architecture and capability.
category: Research & Academic
tags:
  - conways-law
  - organization
  - systems-design
  - architecture
  - communication
---

# SKILL: Conway's Law for Agent Systems

**Source**: "How Do Committees Invent?" by Melvin E. Conway (1968)

**Description**: Apply Conway's homomorphism principle to multi-agent system design, recognizing that agent coordination structure predetermines system architecture and capability.

**Core insight**: Agent coordination topology isn't infrastructure—it's an active constraint that makes certain solution architectures literally impossible to discover, regardless of agent capability.

## DECISION POINTS

### Agent Count Selection
```
Problem Complexity Assessment:
├─ Simple (< 3 sub-components)
│  └─ Use 1-2 agents with direct communication
├─ Moderate (3-6 sub-components)
│  ├─ If components are independent → Use 3-4 agents, minimal coordination
│  └─ If components must integrate → Use 2-3 agents, full communication mesh
└─ Complex (7+ sub-components)
   ├─ Can decompose cleanly → Use hierarchical coordination (5-8 agents)
   ├─ Requires tight integration → Limit to 3-4 agents, accept slower progress
   └─ Unknown decomposition → Use single agent until structure emerges
```

### Communication Model Selection
```
If coordination needs are:
├─ Sequential handoffs → Use pipeline topology (A→B→C)
├─ Parallel + merge → Use star topology (A,B,C → D)
├─ Collaborative design → Use mesh topology (all-to-all)
├─ Hierarchical review → Use tree topology (leaves→branches→root)
└─ Exploratory research → Use single agent initially
```

### Task Delegation Framework
```
Before delegating subtasks, check:
├─ Can you clearly define interfaces between subtasks?
│  ├─ Yes → Safe to delegate with defined communication
│  └─ No → Keep unified until interfaces emerge
├─ Will subtasks need runtime coordination?
│  ├─ Yes → Ensure agents can communicate during work
│  └─ No → Can use minimal coordination
└─ Is this delegation reversible if integration fails?
   ├─ Yes → Proceed with monitoring
   └─ No → Consider keeping unified longer
```

## FAILURE MODES

### 1. Resource Fungibility Fallacy
**Symptom**: "We have 10 agents available, let's use them all to go faster"
**Detection**: When agent count decisions are driven by availability rather than coordination topology
**Fix**: Evaluate coordination requirements first, then determine optimal agent count. Often fewer agents with better coordination outperform many agents with poor coordination.

### 2. Neutral Delegation Illusion
**Symptom**: Creating agent assignments without considering architectural implications
**Detection**: When task decomposition focuses only on workload distribution, not system boundaries
**Fix**: Design delegation as preliminary architecture. Map communication needs between subtasks before assigning agents.

### 3. Coordination Efficiency Trap
**Symptom**: Restricting agent communication to "reduce overhead" then wondering why solutions are suboptimal
**Detection**: Limited communication paths producing fast convergence to poor solutions
**Fix**: Recognize communication restrictions as solution space constraints. Open necessary paths even if coordination seems expensive.

### 4. Integration Capability Confusion
**Symptom**: Expecting better prompts or more capable agents to fix poorly integrated outputs
**Detection**: Repeated integration failures despite agent improvements
**Fix**: Examine coordination structure. Integration requires communication paths during design, not just assembly logic after completion.

### 5. Reorganization Fantasy
**Symptom**: Trying to "fix" system architecture through output processing while keeping coordination unchanged
**Detection**: Architecture problems persist despite multiple fix attempts that don't change agent coordination
**Fix**: Change coordination topology to match desired architecture. The homomorphism cannot be bypassed.

## WORKED EXAMPLES

### Example 1: API Design System
**Scenario**: Design a REST API for an e-commerce platform

**Poor approach** (ignoring Conway):
- Assign 6 agents: Authentication, Products, Orders, Payments, Users, Integration
- Minimal communication between agents during design
- Each agent designs their piece independently

**Result**: 6 separate API designs that don't integrate well, inconsistent patterns, authentication/authorization scattered across services

**Conway-aware approach**:
- Start with 2 agents: API-Design-Lead + Integration-Validator
- API-Design-Lead creates overall structure and interface patterns
- Integration-Validator continuously checks cross-service consistency
- Add specialized agents only after core architecture is stable

**Coordination topology**: Centralized with validation feedback loop
**System outcome**: Coherent API with consistent patterns, clean service boundaries

**Key insight**: More agents created more disconnected subsystems because coordination topology was fragmented

### Example 2: Research Report Generation
**Scenario**: Generate comprehensive analysis of market trends with multiple data sources

**Initial attempt**:
- 5 agents: Data-Collector, Trend-Analyzer, Competitor-Research, Market-Sizing, Report-Writer
- Sequential handoffs: Data → Analysis → Research → Sizing → Writing

**Problem**: Report-Writer receives incompatible analysis formats, trend timeframes don't align, competitor data uses different market segments than sizing data

**Conway diagnosis**: Pipeline topology created rigid boundaries, no coordination during analysis phase

**Revised approach**:
- 3 agents: Research-Coordinator, Analysis-Specialist, Integration-Writer
- Research-Coordinator maintains overall coherence, communicates continuously with Analysis-Specialist
- Integration-Writer involved from start to ensure compatible formats

**Key decision**: Fewer agents with richer communication > more agents with handoff boundaries

## QUALITY GATES

Task completion checklist:
- [ ] Agent coordination topology explicitly mapped and matches desired solution architecture
- [ ] Communication paths exist for all required integration points between agent outputs
- [ ] Decision made on agent count based on coordination needs, not resource availability
- [ ] Task delegation includes interface specifications between subtasks
- [ ] Verification that required solution features are structurally possible given coordination topology
- [ ] Assessment of what architectures current coordination makes unreachable (documented)
- [ ] Integration validation points established if multiple agents involved
- [ ] Recovery plan exists if coordination structure proves insufficient
- [ ] Clear escalation path to single agent if coordination complexity exceeds benefits

## NOT-FOR BOUNDARIES

**Don't use this skill for**:
- **Single-agent tasks**: Conway's Law applies to coordination between agents, not individual agent capability
- **Simple sequential workflows**: If tasks have clear handoffs with no integration needs, standard pipeline patterns suffice
- **Fixed system architectures**: If solution architecture is predetermined and proven, use standard multi-agent patterns
- **Real-time reactive systems**: Conway focuses on design-time coordination, not runtime event handling

**Use other skills instead**:
- For individual agent optimization → Use capability enhancement skills
- For known problem decompositions → Use standard orchestration patterns
- For performance optimization → Use agent efficiency and resource management skills
- For runtime coordination → Use event-driven architecture patterns

**When to delegate elsewhere**:
- If adding more agents would improve performance without changing architecture → Standard scaling approaches
- If coordination structure is dictated by external constraints → Focus on optimization within constraints
- If system architecture requirements are non-negotiable → Use implementation-focused skills