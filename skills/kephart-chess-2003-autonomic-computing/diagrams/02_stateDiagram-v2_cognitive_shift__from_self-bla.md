# Cognitive Shift: From Self-Blame to System Accountability

```mermaid
stateDiagram-v2
    [*] --> InternalizedBlame
    
    InternalizedBlame: Internalized Blame<br/>("I'm bad with technology")
    RecognitionFailure: Recognition of<br/>Design Failure
    CriticalAwareness: Critical Awareness<br/>(Systems thinking)
    ExpectationExcellence: Expectation of<br/>Excellence
    
    InternalizedBlame --> RecognitionFailure: Encounter poor design<br/>pattern repeatedly
    RecognitionFailure --> CriticalAwareness: Reframe failure<br/>as system problem
    CriticalAwareness --> ExpectationExcellence: Demand accountability<br/>from vendors
    
    ExpectationExcellence --> [*]
    
    note right of InternalizedBlame
        User attributes system<br/>failures to personal<br/>inadequacy. Market<br/>pressure removed.
    end note
    
    note right of RecognitionFailure
        User recognizes design<br/>is suboptimal, not<br/>inevitable. Begins<br/>questioning expectations.
    end note
    
    note right of CriticalAwareness
        User understands<br/>systemic barriers to<br/>excellence. Sees<br/>incremental traps.
    end note
    
    note right of ExpectationExcellence
        User demands better.<br/>Market pressure restored.<br/>Shift becomes<br/>self-sustaining.
    end note
    
    InternalizedBlame -.->|Reinforcement loop:<br/>No feedback| InternalizedBlame
    ExpectationExcellence -.->|Self-sustaining<br/>through network effect| ExpectationExcellence
    RecognitionFailure -.->|Risk of regression<br/>if isolated| InternalizedBlame
    CriticalAwareness -.->|Conversation &<br/>network influence| ExpectationExcellence
```
