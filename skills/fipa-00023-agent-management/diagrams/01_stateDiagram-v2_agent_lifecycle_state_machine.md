# Agent Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Initiated
    
    Initiated -->|Agent-initiated: register| Active
    
    Active -->|Agent-initiated: wait| Waiting
    Active -->|AMS-only: suspend| Suspended
    Active -->|AMS-only: move/migrate| Transit
    
    Waiting -->|Agent-initiated: resume| Active
    Waiting -->|AMS-only: suspend| Suspended
    Waiting -->|AMS-only: timeout/detect failure| Unknown
    
    Suspended -->|AMS-only: resume| Active
    Suspended -->|AMS-only: move/migrate| Transit
    Suspended -->|AMS-only: deregister| [*]
    
    Transit -->|AMS-only: arrival confirmed| Active
    Transit -->|AMS-only: arrival timeout| Unknown
    
    Unknown -->|AMS-only: recovery detected| Active
    Unknown -->|AMS-only: deregister| [*]
    
    Active -->|Agent-initiated: deregister| [*]
    Waiting -->|Agent-initiated: deregister| [*]
    
    note right of Initiated
        Initial state upon creation.
        Agent must register to become Active.
    end note
    
    note right of Active
        Agent is operational and processing messages.
        Only guaranteed state for safe invocation.
    end note
    
    note right of Waiting
        Agent is idle but alive.
        Can resume to Active or be suspended by AMS.
    end note
    
    note right of Suspended
        Agent is administratively suspended by AMS.
        Lifecycle frozen; no messaging.
    end note
    
    note right of Transit
        Agent is migrating between platforms.
        Temporarily unreachable.
    end note
    
    note right of Unknown
        AMS has lost contact; lifecycle unknown.
        May recover or be deregistered.
    end note
```
