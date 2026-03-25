# Problem Characteristics → Architecture Selection

```mermaid
quadrantChart
    title Problem Characteristics → Architecture Selection
    x-axis Shallow --> Deep Problem Depth
    y-axis Narrow --> Wide Branching Factor
    
    Game of 24: 0.25, 0.75
    Crosswords: 0.75, 0.25
    Creative Writing: 0.35, 0.65
    Math Proofs: 0.70, 0.40
    Code Generation: 0.60, 0.55
    Translation: 0.20, 0.30
    Planning Tasks: 0.65, 0.70
    Constraint Satisfaction: 0.80, 0.60
    
    quadrant-1 Deep + Wide: Beam Search, DFS hybrid, careful evaluation
    quadrant-2 Shallow + Wide: BFS, aggressive pruning, quick evals
    quadrant-3 Shallow + Narrow: Chain-of-Thought, basic sampling
    quadrant-4 Deep + Narrow: DFS, lookahead, backtracking enabled
```
