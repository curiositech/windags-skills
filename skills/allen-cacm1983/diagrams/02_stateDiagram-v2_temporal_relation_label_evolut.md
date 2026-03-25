# Temporal Relation Label Evolution Under Evidence

```mermaid
stateDiagram-v2
    [*] --> InitialDisjunction: New arc asserted\nwith uncertainty set
    
    InitialDisjunction: Initial Label\n{r1, r2, ..., r13}
    
    InitialDisjunction --> PropagateConstraints: Lookup transitivity\nconsequences
    
    PropagateConstraints: Compute implications\nfrom new fact
    
    PropagateConstraints --> IntersectLabel: Intersect computed\nset with current label
    
    IntersectLabel --> CheckEmpty{Label\nempty?}
    
    CheckEmpty -->|Yes| InconsistencyDetected: Inconsistency Found\n∅ label
    CheckEmpty -->|No| CheckSingleton{Single\nrelation?}
    
    CheckSingleton -->|Yes| DeterminedRelation: Determined State\n{r}
    CheckSingleton -->|No| CheckShrinkage{Label\nshrunk?}
    
    CheckShrinkage -->|Yes| PropagateRefinement: Propagate refinement\nto neighbors
    PropagateRefinement --> PropagateConstraints
    
    CheckShrinkage -->|No| Stable: Stable State\n(no change)
    
    Stable --> AwaitNewEvidence: Await new assertion\nor query
    AwaitNewEvidence --> PropagateConstraints
    
    DeterminedRelation --> AwaitNewEvidence
    
    InconsistencyDetected --> [*]
    AwaitNewEvidence --> [*]
```
