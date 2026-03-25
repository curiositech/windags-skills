# Stratification Phase Transitions

```mermaid
stateDiagram-v2
    [*] --> ProblemDefinition
    
    ProblemDefinition: Problem Definition\n(Identify DAG structure)
    ProblemDefinition --> MeasureWidthDepth
    
    MeasureWidthDepth: Measure Width & Depth\n(Identify antichain size & levels)
    MeasureWidthDepth --> WidthAnalysis{Width Analysis}
    
    WidthAnalysis -->|Width ≤ 2-3| KeepMonolithic
    WidthAnalysis -->|Width > 2-3| PartitionLevels
    
    KeepMonolithic: Keep Monolithic\n(Low coordination overhead)
    KeepMonolithic --> OptimalDecomposition
    
    PartitionLevels: Partition Into Levels\n(Stratification: V₁, V₂, ..., Vₕ)
    PartitionLevels --> BipartiteMatching
    
    BipartiteMatching: Bipartite Matching Per Level\n(Max matching: assign to existing chains)
    BipartiteMatching --> MatchingDecision{Unmatched Nodes?}
    
    MatchingDecision -->|All matched| NextLevel{More Levels?}
    MatchingDecision -->|Unmatched exist| VirtualNodeCreation
    
    VirtualNodeCreation: Virtual Node Creation\n(Defer decisions, aggregate context)
    VirtualNodeCreation --> ResolutionDecision{Sufficient Context?}
    
    ResolutionDecision -->|Not yet| PropagateUp
    ResolutionDecision -->|Yes| ResolutionPhase
    
    PropagateUp: Propagate Virtual Nodes\n(Accumulate information upward)
    PropagateUp --> NextLevel
    
    NextLevel -->|Yes| BipartiteMatching
    NextLevel -->|No| ResolutionPhase
    
    ResolutionPhase: Resolution Phase\n(Top-down resolution of virtual nodes)
    ResolutionPhase --> OptimalDecomposition
    
    OptimalDecomposition: Optimal Decomposition\n(Minimal disjoint execution chains)
    OptimalDecomposition --> [*]
```
