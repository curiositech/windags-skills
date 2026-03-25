# Skill Library State Transitions & Contamination Risk

```mermaid
stateDiagram-v2
    [*] --> ProposedSkill
    
    ProposedSkill --> FastVerification: Skill proposed<br/>by System 1 (LLM)
    
    FastVerification --> FastDecision{Fast Verification<br/>passes?}
    
    FastDecision -->|REJECT| Discarded: ❌ False hypothesis<br/>rejected early
    Discarded --> [*]
    
    FastDecision -->|ACCEPT| SlowVerification: ✓ Candidate advances<br/>to independent review
    
    SlowVerification --> SlowDecision{Slow Verification<br/>confirms?<br/>(System 2: VLM)}
    
    SlowDecision -->|REJECT| Quarantine: ⚠️ False positive caught<br/>before library admission
    Quarantine --> [*]
    
    SlowDecision -->|ACCEPT| AdmitLibrary: ✅ Dual-verified skill<br/>admitted to library
    
    AdmitLibrary --> CascadingImpact: Skill available for<br/>RAG + composition
    
    CascadingImpact --> DownstreamChaining: Enables skill chaining<br/>in future tasks
    
    DownstreamChaining --> [*]
    
    note right of FastVerification
        System 1: Fast, cheap,
        biased evaluation
        (46.43% precision alone)
    end note
    
    note right of SlowVerification
        System 2: Slow, expensive,
        independent validation
        (removes ~60% false positives)
    end note
    
    note right of Quarantine
        Contamination prevented:
        Library stays clean for
        future composition chains
    end note
    
    note right of AdmitLibrary
        Combined precision: 76.50%
        Architectural separation
        solves circular dependency
    end note
```
