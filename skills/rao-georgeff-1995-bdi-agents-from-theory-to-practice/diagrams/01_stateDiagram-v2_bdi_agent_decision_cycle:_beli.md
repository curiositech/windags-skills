# BDI Agent Decision Cycle: Belief-Desire-Intention State Machine

```mermaid
stateDiagram-v2
    [*] --> Perceive
    
    Perceive: Perceive Event from Environment
    Perceive --> UpdateBeliefs
    
    UpdateBeliefs: Update Beliefs\n(World Model)
    UpdateBeliefs --> DetectSignificantChange
    
    DetectSignificantChange: Detect Potentially\nSignificant Change?
    DetectSignificantChange -->|No significant change| ExecutePlan
    DetectSignificantChange -->|Significant change detected| Deliberate
    
    Deliberate: Deliberate\n(Goal Selection & Prioritization)
    Deliberate --> AdoptIntention
    
    AdoptIntention: Adopt New Intention\n(Commitment Decision)
    AdoptIntention --> SelectCommitmentStrategy
    
    SelectCommitmentStrategy: Choose Commitment\nStrategy
    SelectCommitmentStrategy -->|Blind Commitment| BlindMode
    SelectCommitmentStrategy -->|Single-Minded Commitment| SingleMindedMode
    SelectCommitmentStrategy -->|Open-Minded Commitment| OpenMindedMode
    
    BlindMode: Persist Until\nGoal Achieved
    SingleMindedMode: Persist Until\nGoal Achieved or Impossible
    OpenMindedMode: Persist Until\nNo Longer Desired
    
    BlindMode --> MeansEndReasoning
    SingleMindedMode --> MeansEndReasoning
    OpenMindedMode --> MeansEndReasoning
    
    MeansEndReasoning: Means-End Reasoning\n(Plan Selection from Library)
    MeansEndReasoning --> SelectPlan
    
    SelectPlan: Select Applicable Plan\n(Preconditions Satisfied)
    SelectPlan --> ExecutePlan
    
    ExecutePlan: Execute Next Action\nfrom Plan
    ExecutePlan --> CheckReconsideration
    
    CheckReconsideration: Reconsideration Trigger\nFired?
    CheckReconsideration -->|Goal achieved| IntentionSuccess
    CheckReconsideration -->|Plan impossible| IntentionFailed
    CheckReconsideration -->|Intention invalid\n(open-minded)| IntentionInvalid
    CheckReconsideration -->|No trigger:\nContinue execution| Perceive
    
    IntentionSuccess: Abandon Intention\n(Success)
    IntentionFailed: Abandon Intention\n(Failure)
    IntentionInvalid: Reconsider Goals\n(Priority Change)
    
    IntentionSuccess --> Perceive
    IntentionFailed --> Perceive
    IntentionInvalid --> Perceive
    
    Perceive --> [*]
```
