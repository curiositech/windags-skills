# Task Complexity vs. Agent Capability: Decomposition Strategy Matrix

```mermaid
quadrantChart
    title Task Complexity vs. Agent Capability: Decomposition Strategy Matrix
    x-axis Low Complexity --> High Complexity
    y-axis Below Emergence Threshold --> Above Emergence Threshold
    
    %% Quadrant 1: Low complexity + below threshold
    %%DIRECT PROMPTING (No Benefit)
    point 25, 25, Math: Single Step Addition, direct-no-benefit
    point 30, 20, Simple Fact Lookup, direct-no-benefit
    
    %% Quadrant 2: Low complexity + above threshold
    %% DIRECT PROMPTING (Minimal Gains)
    point 25, 75, Math: Single Step Multiplication, direct-minimal
    point 35, 80, Basic Commonsense Q&A, direct-minimal
    
    %% Quadrant 3: High complexity + below threshold
    %% DIRECT PROMPTING (Decomposition Hurts)
    point 75, 30, Math: Multi-Step Word Problem, decomp-hurts
    point 80, 25, Symbolic Manipulation (Complex), decomp-hurts
    point 70, 35, Multi-Constraint Reasoning, decomp-hurts
    
    %% Quadrant 4: High complexity + above threshold
    %% CHAIN-OF-THOUGHT (Maximum Gains)
    point 75, 75, Math: 2-5 Step Word Problem, cot-max
    point 85, 85, Commonsense Multi-Step Reasoning, cot-max
    point 80, 80, Symbolic Manipulation (7B+ Model), cot-max
    point 75, 90, Code Generation with Reasoning, cot-max
    
    %% Emergence threshold marker at ~100B parameters
    %% Represented as the transition line between low and high capability zones
```
