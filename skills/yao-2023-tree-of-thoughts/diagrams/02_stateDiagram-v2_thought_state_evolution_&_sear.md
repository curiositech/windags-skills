# Thought State Evolution & Search Strategies

```mermaid
stateDiagram-v2
    [*] --> ProblemAnalysis
    
    ProblemAnalysis --> DiagnoseStructure{Problem<br/>Structure?}
    
    DiagnoseStructure -->|Simple, Linear| System1Path["System 1:<br/>Autoregressive<br/>Generation"]
    DiagnoseStructure -->|Complex,<br/>Constraint-Rich| System2Path["System 2:<br/>Deliberate<br/>Search"]
    
    System1Path --> ChainOfThought["Chain-of-Thought<br/>Prompting"]
    ChainOfThought --> [*]
    
    System2Path --> DefineGranularity["Define Thought<br/>Decomposition<br/>Granularity"]
    DefineGranularity --> UnexploredThoughts["State:<br/>Unexplored<br/>Thoughts"]
    
    UnexploredThoughts --> GenerateThoughts["Generate<br/>Candidate<br/>Thoughts"]
    GenerateThoughts --> EvaluatedThoughts["State:<br/>Evaluated<br/>Thoughts<br/>(Quality Score)"]
    
    EvaluatedThoughts --> SelectSearchStrategy{Choose<br/>Search<br/>Algorithm}
    
    SelectSearchStrategy -->|Shallow Tree<br/>Early Branching| BFSSearch["BFS:<br/>Breadth-First<br/>Exploration"]
    SelectSearchStrategy -->|Deep Tree<br/>Sparse Solutions| DFSSearch["DFS:<br/>Depth-First<br/>with Backtrack"]
    SelectSearchStrategy -->|Balanced<br/>Exploration| BeamSearch["Beam Search:<br/>Top-K Pruning"]
    
    BFSSearch --> EvaluateQuality{Evaluation<br/>Mode}
    DFSSearch --> EvaluateQuality
    BeamSearch --> EvaluateQuality
    
    EvaluateQuality -->|Value Scoring| ValueScore["Score 1-10:<br/>Promise Rating"]
    EvaluateQuality -->|Voting| Voting["Compare 5 Options:<br/>Most Likely Path"]
    EvaluateQuality -->|Classification| Classification["Sure/Maybe/<br/>Impossible"]
    
    ValueScore --> PrunedThoughts
    Voting --> PrunedThoughts
    Classification --> PrunedThoughts
    
    PrunedThoughts["State:<br/>Pruned<br/>Thoughts"]
    
    PrunedThoughts --> ContinueSearch{Solution<br/>Found?}
    
    ContinueSearch -->|No| MoreExploration{Unexplored<br/>States<br/>Remain?}
    ContinueSearch -->|Yes| CompleteSolution["State:<br/>Complete<br/>Solution"]
    
    MoreExploration -->|Yes| UnexploredThoughts
    MoreExploration -->|No| Backtrack["Backtrack to<br/>Earlier State"]
    Backtrack --> UnexploredThoughts
    
    CompleteSolution --> ReturnResult["Execute<br/>Solution"]
    ReturnResult --> [*]
```
