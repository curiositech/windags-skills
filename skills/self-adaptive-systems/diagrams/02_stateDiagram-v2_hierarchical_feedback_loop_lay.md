# Hierarchical Feedback Loop Layers

```mermaid
stateDiagram-v2
    [*] --> ReactiveLayer

    state ReactiveLayer {
        [*] --> MonitorEvents
        MonitorEvents --> DetectFailure{Immediate<br/>failure detected?}
        DetectFailure -->|Yes| ExecutePreplanned["Execute pre-planned<br/>response"]
        DetectFailure -->|No| MonitorEvents
        ExecutePreplanned --> MonitorEvents
    }

    state DeliberativeLayer {
        [*] --> AnalyzePatterns
        AnalyzePatterns --> PatternFound{Recurring<br/>pattern or<br/>performance drift?}
        PatternFound -->|Yes| UpdatePolicies["Update reactive<br/>layer policies<br/>& thresholds"]
        PatternFound -->|No| AnalyzePatterns
        UpdatePolicies --> AnalyzePatterns
    }

    state ReflectiveLayer {
        [*] --> StrategicReview
        StrategicReview --> StrategyFailing{Adaptation<br/>approach<br/>failing overall?}
        StrategyFailing -->|Yes| EvolvStrategy["Change adaptation<br/>algorithm or<br/>update models"]
        StrategyFailing -->|No| StrategicReview
        EvolvStrategy --> StrategicReview
    }

    ReactiveLayer -->|Milliseconds-Seconds<br/>Goal not achieved| DeliberativeLayer
    DeliberativeLayer -->|Minutes-Hours<br/>Recurring failure pattern| ReflectiveLayer
    ReflectiveLayer -->|Days-Weeks<br/>Strategy validates| ReactiveLayer
    
    note right of ReactiveLayer
        Timescale: ms-seconds
        Handle events, execute
        pre-planned responses
    end note

    note right of DeliberativeLayer
        Timescale: minutes-hours
        Learn patterns, optimize
        reactive policies
    end note

    note right of ReflectiveLayer
        Timescale: days-weeks
        Evolve strategy itself,
        update core models
    end note
```
