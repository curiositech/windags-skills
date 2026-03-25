# Multi-Timescale Planning Decomposition

```mermaid
timeline
    title Multi-Timescale Planning Decomposition: Exhibition Opening Example
    
    section Day-Level Intention
        Prepare for exhibition opening : a1, 2023-10-15, 1d
    
    section Hour-Level Activities
        Review artwork 2-4pm : a2, 2023-10-15, 2h
        Setup gallery space : a3, after a2, 2h
        Greeting preparation : a4, after a3, 1h
    
    section Minute-Level Actions
        Walk to gallery at 2:00pm : a5, 2023-10-15, 5m
        Unlock gallery doors : a6, after a5, 2m
        Begin artwork review : a7, after a6, 113m
    
    section Observation & Interruption
        Observation: Gallery entrance blocked : crit, o1, 2023-10-15, 1m
        Interrupt minute-level plan : crit, i1, after o1, 1m
        Reassess hour-level activity : i2, after i1, 2m
        Replan: Find alternate entrance : i3, after i2, 3m
        Resume minute-level: Enter via side door : i4, after i3, 2m
```
