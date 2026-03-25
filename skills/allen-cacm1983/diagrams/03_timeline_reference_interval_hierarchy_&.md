# Reference Interval Hierarchy & Scoping

```mermaid
timeline
    title Reference Interval Hierarchy & Scoping: Allen Interval Reasoning (1983)
    
    section Year Level
        2024 : Y2024[Reference Interval: Year 2024]
    
    section Quarter Level
        Q1 2024 : Q1[Jan-Mar: Planning Phase]
        Q2 2024 : Q2[Apr-Jun: Execution Phase]
        Q3 2024 : Q3[Jul-Sep: Review Phase]
    
    section Month Level (Q2 Detail)
        April : M1[Project Kickoff Milestone]
        May : M2[Sprint 1-2 Window]
        June : M3[Integration & Testing]
    
    section Week/Sprint Level (May Detail)
        Week 1 May : W1[Sprint 1 starts]
        Week 2 May : W2[Sprint 1 ends / Sprint 2 starts]
        Week 3 May : W3[Sprint 2 continues]
    
    section Day Level (Week 2 Detail)
        Mon May 13 : D1[Task A: Code Review<br/>Relation: DURING Sprint 1-2 boundary]
        Tue May 14 : D2[Task B: Deploy Staging<br/>Relation: MEETS Sprint 2 start]
        Wed May 15 : D3[Task C: QA Testing<br/>Relation: OVERLAPS Task B]
        Thu May 16 : D4[Task D: Documentation<br/>Relation: AFTER Task C ends]
    
    section Hour Level (Wed Detail)
        09:00-10:00 : H1[Test Suite Execution<br/>DURING Task C]
        10:00-11:30 : H2[Bug Triage Meeting<br/>OVERLAPS with Test Suite]
        11:30-13:00 : H3[Fix Implementation<br/>AFTER Bug Triage]
        14:00-15:00 : H4[Regression Testing<br/>STARTS after Fix ends]
    
    section Propagation Boundaries
        Local (Day) : LB1[Within Wed May 15:<br/>Constraints propagate freely<br/>H1, H2, H3, H4 mutually constrained]
        Local (Week) : LB2[Within Week 2:<br/>D1-D4 form closure<br/>Cost: O(4²) comparisons]
        Bridging Req. : LB3[Cross-Sprint (W2→W3):<br/>Explicit link: Task B MEETS Sprint 2<br/>Not automatic propagation]
        Global (Qtr) : LB4[Q2 Level:<br/>Milestones M1,M2,M3<br/>Remain independent unless bridged]
```
