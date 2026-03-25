# Agent Computation vs Control Flow Separation

```mermaid
stateDiagram-v2
    [*] --> MessageReceived

    MessageReceived --> ParseContent: Analyze message type\nand context
    
    ParseContent --> ComputationLayer: Route to agent\nspecialization
    
    ComputationLayer --> ExecutionAgent: Execution task\n(run code, call tools)
    ComputationLayer --> ValidationAgent: Validation task\n(check correctness)
    ComputationLayer --> SafetyAgent: Safety task\n(audit constraints)
    ComputationLayer --> ExpertAgent: Domain task\n(specialized knowledge)
    
    ExecutionAgent --> ExecutionResult{Execution\nsucceeds?}
    ExecutionResult -->|Yes| ResultMessage: Generate result\nmessage
    ExecutionResult -->|No| ErrorMessage: Generate error\nmessage
    
    ValidationAgent --> ValidationCheck{Output\nvalid?}
    ValidationCheck -->|Yes| ValidMessage: Confirm validity
    ValidationCheck -->|No| CritiqueMessage: Return critique
    
    SafetyAgent --> SafetyCheck{Passes\nsafety rules?}
    SafetyCheck -->|Yes| SafeMessage: Approve
    SafetyCheck -->|No| BlockMessage: Veto/block
    
    ExpertAgent --> ExpertAnalysis: Apply expertise\nto message
    ExpertAnalysis --> ExpertMessage: Return analysis\nor refinement
    
    ErrorMessage --> ControlFlow
    ResultMessage --> ControlFlow
    ValidMessage --> ControlFlow
    CritiqueMessage --> ControlFlow
    SafeMessage --> ControlFlow
    BlockMessage --> ControlFlow
    ExpertMessage --> ControlFlow
    
    ControlFlow --> SpeakerSelection{Who speaks\nnext?}
    
    SpeakerSelection -->|Message pattern\nmatches rule| DynamicSpeaker: Select next speaker\nfrom pattern rules
    SpeakerSelection -->|Static topology| StaticSpeaker: Use predefined\nconversation flow
    SpeakerSelection -->|Requires human| HumanSpeaker: Escalate to human\nagent
    
    DynamicSpeaker --> TerminationCheck
    StaticSpeaker --> TerminationCheck
    HumanSpeaker --> TerminationCheck
    
    TerminationCheck --> ShouldTerminate{Termination\nconditions met?}
    
    ShouldTerminate -->|No| MessageReceived: Continue conversation
    ShouldTerminate -->|Yes| FinalOutput: Emit final output
    
    FinalOutput --> [*]
    
    note right of ComputationLayer
        COMPUTATION LAYER
        What agents can do:
        Determined by agent
        design and message
        content analysis
    end note
    
    note right of ControlFlow
        CONTROL FLOW LAYER
        Who speaks when:
        Determined by
        message patterns,
        validation results,
        dynamic rules
    end note
```
