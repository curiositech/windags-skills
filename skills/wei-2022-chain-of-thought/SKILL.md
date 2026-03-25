---
license: Apache-2.0
name: wei-2022-chain-of-thought
description: Strategic framework for eliciting and orchestrating reasoning in LLM-based agents through structured decomposition
category: Research & Academic
tags:
  - chain-of-thought
  - prompting
  - reasoning
  - llm
  - few-shot
---

# Chain-of-Thought Reasoning for Agent Systems

Strategic framework for eliciting and orchestrating reasoning in LLM-based agents through structured decomposition

## Decision Points

### Primary Routing Decision: Decompose vs. Direct

```
Task Complexity × Agent Capability → Action

IF agent_parameters < 100B AND task_requires_multi_step_reasoning:
  → DIRECT prompting (decomposition hurts below emergence threshold)
  
ELIF baseline_accuracy > 80% AND reasoning_steps < 3:
  → DIRECT prompting (minimal gains, added latency cost)
  
ELIF task_complexity = HIGH AND multi_step_reasoning = TRUE:
  → CHAIN_OF_THOUGHT prompting (gains scale with complexity)
  
ELIF task_distribution = MIXED_COMPLEXITY:
  → SELF_SELECT mode (provide examples, let agent choose when to decompose)
```

### Failure Classification Decision Tree

```
Observe failure type:

IF error_type IN [calculator_mistake, symbol_mapping_error, missing_single_step]:
  → SHALLOW failure
  → Add external tools (calculator, validator)
  → Implement consistency checks
  → Re-run with augmentation
  
ELIF error_type IN [semantic_misunderstanding, incoherent_logic, fundamental_reasoning_flaw]:
  → DEEP failure
  → Check agent capability threshold
  → Re-route to more capable agent OR reject task
  
ELIF correct_answer = TRUE:
  → Verify reasoning chain (98% of correct answers have sound reasoning)
  → High confidence in output quality
```

### Reasoning Structure Selection Matrix

```
Task Type × Semantic Requirements → Structure

IF task = SYMBOLIC_MANIPULATION:
  → HYBRID: Natural language setup → formal operations → natural language verification
  
ELIF semantic_understanding_across_steps = TRUE:
  → FULL natural language chain-of-thought
  → Don't optimize for brevity (semantic grounding requires explicit articulation)
  
ELIF multi_agent_coordination = TRUE:
  → Natural language for coordination medium
  → Formal protocols within individual agents only
```

## Failure Modes

### 1. **Premature Decomposition Syndrome**
**Detection Rule**: If small model (<100B params) + chain-of-thought prompting → worse performance than baseline
**Symptom**: Fluent but illogical reasoning chains, performance degradation
**Fix**: Verify emergence threshold empirically before deploying decomposition; use direct prompting below threshold

### 2. **Raw Compute Fallacy**
**Detection Rule**: If adding compute time/tokens without structured intermediate steps → no performance gain
**Symptom**: Longer outputs with dots/padding but same accuracy
**Fix**: Structure compute through meaningful semantic intermediate states, not just duration

### 3. **Uniform Error Handling**
**Detection Rule**: If same recovery strategy applied to calculator errors and semantic failures
**Symptom**: Tool augmentation fails on deep reasoning errors; model re-routing wastes cycles on shallow errors
**Fix**: Classify failures first (shallow vs. deep), then route to appropriate intervention

### 4. **Optimization Premature Optimization**
**Detection Rule**: If natural language reasoning shortened to save tokens → coherence loss
**Symptom**: Broken semantic grounding, reasoning chain loses logical connection
**Fix**: Preserve explicit articulation; the "inefficiency" maintains semantic coherence

### 5. **Brittleness Blindness**
**Detection Rule**: If demo performance (95%) ≫ production performance (70%) across task variations
**Symptom**: High variance across annotators/exemplar sets on low-complexity tasks
**Fix**: Test robustness envelope before production; expect brittleness on tasks with high baseline accuracy

## Worked Examples

### Example 1: Math Word Problem Routing Decision

**Scenario**: Multi-step arithmetic problem arrives at LaMDA 68B agent

**Decision Process**:
1. Check capability: 68B > 100B threshold? No, but close to emergence
2. Check task complexity: 4 reasoning steps required = HIGH
3. Check baseline accuracy: ~6% without chain-of-thought
4. **Decision**: Use chain-of-thought (expected jump from 6% to ~14%)

**Execution**:
- Prompt: "Let's think step by step. [problem]"
- Agent produces: "First I need to find... Then I calculate... Next I..."
- **Expert catches**: Verify each calculation step has semantic grounding
- **Novice misses**: Would skip intermediate verification, trust fluent output

**Result**: 14% accuracy vs. 6% baseline (emergence threshold effect)

### Example 2: Failure Classification and Recovery

**Scenario**: Agent produces wrong answer: "The total cost is $47" (correct: $52)

**Analysis Process**:
1. **Examine reasoning chain**: "First, 3 items × $12 = $36. Then add $15 tax = $51. Wait, I mean $47."
2. **Classify failure**: Calculator error in final step (36 + 15 = 51, but output 47)
3. **Failure type**: SHALLOW (arithmetic mistake, reasoning structure sound)
4. **Decision**: Add calculator tool, re-run

**Recovery**:
- Augment with external calculator
- Re-run same reasoning chain with tool verification
- **Expert insight**: Don't re-route to bigger model for arithmetic errors
- **Novice error**: Would assume "model isn't smart enough" and upgrade unnecessarily

### Example 3: Natural Language vs. Formal Protocol Choice

**Scenario**: Multi-agent system coordinating complex financial analysis

**Decision Point**: Use formal API calls or natural language coordination?

**Analysis**:
- Task requires semantic understanding across 6 reasoning steps
- Each step builds on previous semantic context
- Formal protocol would lose grounding between symbolic operations and real-world meaning

**Decision**: Natural language coordination despite token overhead

**Implementation**:
```
Agent A: "Given the Q3 earnings show 15% revenue growth but 8% margin compression, 
         I need to analyze if this indicates sustainable growth or pricing pressure..."
Agent B: "Building on your margin analysis, the compression aligns with our competitive 
         positioning data showing 3 new market entrants..."
```

**Expert reasoning**: The "inefficiency" of natural language maintains semantic coherence
**Novice mistake**: Would optimize for concise formal protocols and lose reasoning grounding

### Example 4: Production Robustness Testing

**Scenario**: Prompting technique achieves 95% accuracy on test exemplars

**Pre-deployment Process**:
1. **Variance test**: Run across 5 different annotator sets
2. **Results**: Performance range 71% - 96% (high variance = brittleness indicator)
3. **Task analysis**: Coin flip reasoning (low complexity, high baseline)
4. **Decision**: Brittle application, implement stabilization or accept variance

**Production Strategy**:
- Deploy with variance monitoring
- Flag high-variance outputs for review
- **Expert insight**: Brittleness correlates with low reasoning complexity
- **Novice assumption**: Would expect consistent performance based on demo results

## Quality Gates

### Capability Assessment
- [ ] Agent parameter count verified (>100B for chain-of-thought effectiveness)
- [ ] Emergence threshold confirmed empirically on sample tasks
- [ ] Baseline accuracy measured without decomposition
- [ ] Task complexity categorized (steps required, semantic depth)

### Failure Mode Preparation
- [ ] Error classification system implemented (shallow vs. deep detection rules)
- [ ] Tool augmentation ready for shallow failures (calculator, validator)
- [ ] Re-routing paths defined for deep failures
- [ ] Recovery strategy mapped to failure type

### Reasoning Structure Validation
- [ ] Natural language vs. formal protocol choice justified
- [ ] Semantic grounding maintained across reasoning steps
- [ ] Intermediate states contain meaningful semantic content
- [ ] Brevity optimization balanced against coherence requirements

### Production Readiness
- [ ] Robustness tested across multiple annotator/exemplar sets
- [ ] Variance envelope mapped for task distribution
- [ ] Brittleness indicators identified and monitored
- [ ] Performance degradation thresholds defined

### Quality Assurance
- [ ] Sample outputs manually verified for reasoning chain coherence
- [ ] Correct answers verified to have sound reasoning (98% confidence rule)
- [ ] Edge cases tested at capability boundaries
- [ ] Fallback strategies defined for out-of-distribution tasks

## NOT-FOR Boundaries

**This skill is NOT for**:
- **Simple lookup tasks**: Use direct retrieval instead of reasoning decomposition
- **Tasks with >90% baseline accuracy**: Minimal gains don't justify latency overhead
- **Sub-100B parameter models on complex reasoning**: Use [model-scaling-strategy] to upgrade capability first
- **Pure symbolic computation**: Use [formal-reasoning-systems] for equation solving without semantic context
- **Real-time applications**: Decomposition latency incompatible with <100ms response requirements

**Delegate to other skills**:
- For model selection decisions → Use [capability-threshold-analysis]
- For tool integration strategy → Use [agent-tool-coordination] 
- For multi-agent protocol design → Use [agent-communication-patterns]
- For performance optimization → Use [latency-accuracy-tradeoffs]
- For error monitoring systems → Use [agent-observability-patterns]