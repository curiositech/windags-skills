---
license: Apache-2.0
name: dag-cycle-analysis
description: Graph algorithms for detecting and resolving cycles in directed graphs and workflow definitions
category: Agent & Orchestration
tags:
  - dag
  - cycle-detection
  - graph-theory
  - validation
  - algorithms
---

# Hierarchical Cycle Analysis

**Skill ID**: `hierarchical-cycle-analysis`  
**Domain**: Complex systems, network science, information architecture

## Description

This skill applies rigorous cycle-theoretic methods to understand the hidden organizational structure of hierarchical systems. It reveals how systems that appear "acyclic" (DAGs) actually contain rich cyclic structure that determines their information-processing capabilities.

## Decision Points

### Algorithm Selection Tree

```
IF analyzing system behavior/comparison
├── THEN decompose DAG = undirected graph + directional metadata
├── IF need functional differences between similar topologies
│   └── THEN use metadata metrics (height, stretch, balance) + topology
└── IF need structural simplification
    └── THEN apply transitive reduction first

IF detecting cycles in DAG
├── IF raw cycle count needed
│   └── THEN use DFS on undirected substrate
├── IF functional classification needed
│   ├── THEN apply path-wedge contraction first
│   └── THEN classify: feedback/shortcut/diamond/mixer
└── IF comparing cycle organization
    └── THEN compute antichain structure + metadata positioning

IF system shows unexpected behavior despite "good" topology
├── THEN check antichain structure (parallel vs sequential)
├── THEN measure cycle height/stretch/balance distribution
└── IF still unclear, THEN load metadata-localizes-topology framework

IF redesigning hierarchical process
├── IF need resilience THEN preserve/add diamonds (parallel alternatives)
├── IF need integration THEN check mixer positioning (multi-level convergence)
└── IF optimizing efficiency THEN identify shortcuts for potential removal
```

### Stopping Criteria

- **Stop iterating** when TR converges (no more transitive edges to remove)
- **Stop analysis** when all cycles classified into four classes
- **Stop decomposition** when undirected substrate + metadata separated
- **Escalate to domain expert** if >50% of cycles are mixers (unusual integration pattern)

## Failure Modes

### Topology Blindness
**Symptom**: Two hierarchies have identical node/edge counts but behave differently  
**Diagnosis**: Analyzing structure without considering ordering metadata  
**Detection Rule**: If degree distributions match but information flow differs  
**Fix**: Decompose into undirected graph + metadata, compute metadata-derived metrics

### Acyclic Confusion
**Symptom**: Claiming "no cycles exist" in hierarchical system  
**Diagnosis**: Confusing directional constraint-compatibility with topological absence  
**Detection Rule**: If someone says "it's a DAG so no loops"  
**Fix**: Extract undirected substrate to reveal hidden cyclic structure

### Cycle Conflation
**Symptom**: Counting all cycles as equivalent structural features  
**Diagnosis**: Missing functional differences between diamonds vs mixers  
**Detection Rule**: If analysis treats 3-node triangle same as 6-node mixer  
**Fix**: Apply path-wedge contraction, classify into four classes

### Over-Reduction
**Symptom**: System performance degrades after applying transitive reduction  
**Diagnosis**: Removing shortcuts that were functionally valuable despite being informationally redundant  
**Detection Rule**: If TR improves "structural metrics" but worsens latency/reliability  
**Fix**: Distinguish informational redundancy from functional optimization

### Antichain Ignorance
**Symptom**: Cannot explain why parallel nodes behave differently  
**Diagnosis**: Missing hierarchical coordinate system, treating all "same level" nodes as equivalent  
**Detection Rule**: If surprised by different behaviors at "same hierarchical level"  
**Fix**: Compute antichain decomposition, analyze cycle organization by level

## Worked Examples

### Example 1: Organizational Chart Analysis

**Scenario**: Two companies with identical reporting structures (30 nodes, 35 edges) but different decision-making speeds.

**Step 1 - Decomposition**:
```
Company A: Extract undirected substrate → 12 cycles found
Company B: Extract undirected substrate → 12 cycles found
```
Topology identical, so analyze metadata.

**Step 2 - Classification**:
```
Apply transitive reduction:
Company A: 8 diamonds, 2 mixers remain
Company B: 4 diamonds, 4 mixers remain
```

**Step 3 - Metadata Analysis**:
```
Company A diamonds: Height 2-4 (mid-hierarchy resilience)
Company A mixers: Height 6-7 (senior integration points)

Company B diamonds: Height 1-2 (low-level redundancy)  
Company B mixers: Height 3-8 (integration at all levels)
```

**Expert Insight**: Company B's distributed mixers create more integration overhead but higher adaptability. Company A's concentrated senior mixers create bottlenecks but faster routine decisions.

**Novice Miss**: Would only count total cycles (12 each) and conclude structures identical.

### Example 2: Software Architecture Comparison

**Scenario**: Microservice dependency graphs with similar complexity metrics but different deployment reliability.

**Step 1 - Cycle Detection**:
```
System X: 45 cycles in undirected substrate
System Y: 47 cycles in undirected substrate  
```

**Step 2 - TR + Classification**:
```
System X after TR: 15 diamonds, 8 mixers
- Diamonds concentrated in data layer (height 1-3)
- Mixers in API gateway layer (height 5-6)

System Y after TR: 8 diamonds, 12 mixers  
- Diamonds scattered across all layers
- Mixers concentrated in business logic (height 3-4)
```

**Step 3 - Antichain Analysis**:
```
System X: 6 major antichains, services well-layered
System Y: 3 major antichains, more cross-cutting concerns
```

**Expert Diagnosis**: System X has resilient data access (diamonds) but single points of integration failure. System Y has complex business logic integration creating brittleness.

**Decision**: System X better for read-heavy workloads, System Y better for complex transactional workflows.

## Quality Gates

**Analysis Complete When**:
- [ ] DAG decomposed into undirected substrate + directional metadata
- [ ] All cycles classified into exactly four classes (feedback/shortcut/diamond/mixer)
- [ ] Antichain structure computed and hierarchical coordinates established  
- [ ] Both topological metrics (cycle count, size distribution) and metadata metrics (height, stretch, balance) calculated
- [ ] Transitive reduction applied and convergence verified
- [ ] Diamond vs mixer distinction mapped to functional requirements
- [ ] Edge cases identified where framework assumptions may not hold
- [ ] Integration points (mixers) and resilience points (diamonds) documented
- [ ] Comparison baseline established using both structural and positional metrics

**Ready for Implementation When**:
- [ ] Specific cycle classes linked to system requirements (resilience needs → diamond preservation)
- [ ] Optimization targets defined (remove shortcuts vs preserve alternatives)

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- **Real-time dynamic graphs**: For temporal networks, use `temporal-graph-analysis` instead
- **Undirected networks**: For social networks without ordering, use `community-detection` instead  
- **Weighted optimization**: For cost/flow optimization, use `network-flow-algorithms` instead
- **Stochastic processes**: For probabilistic workflows, use `markov-chain-analysis` instead

**Delegate when**:
- **Graph size >10K nodes**: Use `distributed-graph-algorithms` for scalability
- **Real-time constraints**: Use `streaming-dag-validation` for online systems
- **Complex temporal dynamics**: Use `temporal-motif-analysis` for time-varying hierarchies
- **Domain-specific rules**: Load domain frameworks (org-behavior, software-architecture, etc.)

**Framework applies only when**:
- Clear ordering constraint exists (time, causality, hierarchy, dependency)
- System can be meaningfully represented as DAG
- Cycles represent structural relationships, not just algorithmic artifacts
- Static analysis sufficient (system not rapidly evolving)