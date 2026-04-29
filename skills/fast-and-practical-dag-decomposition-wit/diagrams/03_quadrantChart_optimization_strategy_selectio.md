# Optimization Strategy Selection Matrix

```mermaid
quadrantChart
    title Optimization Strategy Selection Matrix
    x-axis Low --> High: Solution Quality Required
    y-axis Low --> High: Query/Iteration Frequency
    quadrant-1 Hybrid Preprocessing (High Quality, High Frequency)
    quadrant-2 Optimal Algorithms (High Quality, Low Frequency)
    quadrant-3 Fast Heuristics (Low Quality, Low Frequency)
    quadrant-4 Iterative Refinement (Medium Quality, High Frequency)
    
    Fast Heuristics: 0.25, 0.25
    Optimal Algorithms: 0.75, 0.25
    Hybrid Preprocessing: 0.75, 0.75
    Iterative Refinement: 0.5, 0.65
    
    classDef q1 fill:#2ecc71,stroke:#27ae60,color:#fff
    classDef q2 fill:#3498db,stroke:#2980b9,color:#fff
    classDef q3 fill:#e74c3c,stroke:#c0392b,color:#fff
    classDef q4 fill:#f39c12,stroke:#d68910,color:#fff
```
