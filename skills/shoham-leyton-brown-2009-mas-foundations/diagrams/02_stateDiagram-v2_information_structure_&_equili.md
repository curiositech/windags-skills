# Information Structure & Equilibrium Tractability States

```mermaid
stateDiagram-v2
    [*] --> PerfectInfo: Problem Formulation
    
    PerfectInfo: Perfect Information<br/>(Complete observability)
    PerfectInfo --> BackwardInduction: Solve via Backward Induction
    BackwardInduction --> SubgamePerfect: Subgame Perfect Equilibrium<br/>(Linear Time)
    
    PerfectInfo --> ImperfectInfo: Agents have<br/>private information
    
    ImperfectInfo: Imperfect Information<br/>+ Perfect Recall
    ImperfectInfo --> RepresentationChoice{Choose<br/>Representation}
    
    RepresentationChoice -->|Normal Form| NormalFormComp: Exponential<br/>Complexity
    RepresentationChoice -->|Sequence Form| SequenceForm: Polynomial<br/>Complexity
    
    SequenceForm --> NashViaSeqForm: Nash Equilibrium<br/>via Sequence Form
    
    NormalFormComp --> TractabilityIssue: Computationally<br/>Intractable
    TractabilityIssue --> CorrelatedEq: Use Correlated<br/>Equilibrium
    CorrelatedEq --> LinearProgram: Linear Program<br/>Solution (Polynomial)
    
    ImperfectInfo --> ImperfectRecall: Agents cannot<br/>recall past observations
    
    ImperfectRecall: Imperfect Recall<br/>(Hardest Case)
    ImperfectRecall --> FundamentallyHard: Mixed ≠ Behavioral<br/>Equilibrium Harder
    
    SubgamePerfect --> EquilibriumFound: Equilibrium<br/>Tractable
    LinearProgram --> EquilibriumFound
    NashViaSeqForm --> EquilibriumFound
    
    FundamentallyHard --> BoundedRationality: Apply Bounded<br/>Rationality Heuristics
    BoundedRationality --> ApproximateEq: Approximate<br/>Equilibrium
    
    EquilibriumFound --> MechanismDesign{Design<br/>Mechanism?}
    ApproximateEq --> MechanismDesign
    
    MechanismDesign -->|Yes| RevealTruth: Apply Revelation<br/>Principle
    RevealTruth --> ChooseImpossibility: Choose Which<br/>Property to Sacrifice
    ChooseImpossibility --> VCG: VCG Mechanism<br/>(Truthful + Efficient<br/>- Budget Balance)
    ChooseImpossibility --> Arrow: Voting System<br/>(Satisfies subset<br/>of Arrow axioms)
    
    MechanismDesign -->|No| DirectSolution: Solve as<br/>Strategic Game
    
    VCG --> Implementation: Implement<br/>Mechanism
    Arrow --> Implementation
    DirectSolution --> Implementation
    
    Implementation --> [*]
```
