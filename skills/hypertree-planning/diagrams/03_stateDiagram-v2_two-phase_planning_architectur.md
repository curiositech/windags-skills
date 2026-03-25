# Two-Phase Planning Architecture: Structure → Content

```mermaid
stateDiagram-v2
    [*] --> InputProblem
    
    InputProblem: Input Problem<br/>(Complex Multi-Constraint Task)
    InputProblem --> AnalyzeStructure: Identify decomposition patterns
    
    AnalyzeStructure: Analyze Problem Structure<br/>(Constraint & Complexity Assessment)
    AnalyzeStructure --> DecisionPoint1{Can decompose<br/>hierarchically?}
    
    DecisionPoint1 -->|No| LinearApproach: Use sequential reasoning
    DecisionPoint1 -->|Yes| StructurePhase
    LinearApproach --> [*]
    
    StructurePhase: STRUCTURE PHASE<br/>Generate Planning Outline
    StructurePhase --> ApplyRules: Apply decomposition rules<br/>(abstract patterns)
    
    ApplyRules: Apply Hierarchical Rules<br/>(Task → Independent Sub-tasks)
    ApplyRules --> GenerateSkeleton: Generate hypertree skeleton<br/>(multi-level decomposition)
    
    GenerateSkeleton: Hypertree Skeleton Generated<br/>(Outline with parent-child structure)
    GenerateSkeleton --> ReviewStructure{Structure<br/>valid?}
    
    ReviewStructure -->|Needs revision| ReviseStructure: Revise decomposition<br/>(adjust levels/branches)
    ReviseStructure --> ApplyRules
    ReviewStructure -->|Valid| OutlineGenerated
    
    OutlineGenerated: Planning Outline Complete<br/>(Structure encodes all constraints)
    OutlineGenerated --> ContentPhase: Proceed to detail work
    
    ContentPhase: CONTENT PHASE<br/>Fill Leaf Node Details
    ContentPhase --> PopulateLeaves: Populate leaf node solutions<br/>(guided by outline structure)
    
    PopulateLeaves: Fill Details at Leaf Nodes<br/>(independent parallel sub-tasks)
    PopulateLeaves --> IterativeRefinement: Iterative refinement<br/>(adjust per constraint)
    
    IterativeRefinement: Details Refined<br/>(coordinate via outline structure)
    IterativeRefinement --> ValidationCheck{All constraints<br/>satisfied?}
    
    ValidationCheck -->|Constraint conflict| BackToContent: Refine conflicting nodes
    BackToContent --> IterativeRefinement
    ValidationCheck -->|All satisfied| CompletePlan
    
    CompletePlan: Complete Plan Generated<br/>(Hierarchical structure + detailed content)
    CompletePlan --> [*]
```
