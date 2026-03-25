---
license: Apache-2.0
name: automatic-stateful-prompt-improver
description: Automatically intercepts and optimizes prompts using the prompt-learning MCP server. Learns from performance over time via embedding-indexed history. Uses APE, OPRO, DSPy patterns. Activate on "optimize prompt", "improve this prompt", "prompt engineering", or ANY complex task request. Requires prompt-learning MCP server. NOT for simple questions (just answer them), NOT for direct commands (just execute them), NOT for conversational responses (no optimization needed).
allowed-tools: mcp__prompt-learning__optimize_prompt,mcp__prompt-learning__retrieve_prompts,mcp__prompt-learning__record_feedback,mcp__prompt-learning__suggest_improvements,mcp__prompt-learning__get_analytics,mcp__SequentialThinking__sequentialthinking
category: AI & Machine Learning
tags:
  - prompt-engineering
  - optimization
  - stateful
  - improvement
  - llm
pairs-with:
  - skill: skill-coach
    reason: Optimize skill prompts systematically
  - skill: skill-logger
    reason: Track prompt performance over time
---

# Automatic Stateful Prompt Improver

## DECISION POINTS

```
PROMPT ASSESSMENT:
├── Simple question/command (what, when, how)
│   └── Skip optimization → Answer directly
├── Complex task (multi-step, reasoning, technical)
│   ├── Token budget < 1000
│   │   └── APE: 3-5 iterations
│   ├── Token budget 1000-5000
│   │   └── OPRO: 5-10 iterations
│   └── Token budget > 5000
│       └── DSPy compilation: 10-20 iterations
└── Reusable template/system prompt
    └── Full optimization with historical retrieval

OPTIMIZATION TECHNIQUE SELECTION:
├── Instruction rewriting needed
│   └── Use APE (Automatic Prompt Engineer)
├── Parameter tuning with constraints  
│   └── Use OPRO (Optimization by PROmpting)
├── Complex pipeline with multiple modules
│   └── Use DSPy compilation patterns
└── Unknown/exploratory domain
    └── Hybrid APE→OPRO→DSPy cascade

ITERATION CONTROL:
├── Improvement < 1% for 3 rounds → STOP
├── Quality score > 0.95 → STOP  
├── Max iterations reached → STOP
├── User satisfaction confirmed → STOP
└── Continue → Next iteration

FEEDBACK INTEGRATION:
├── Task successful (user confirms/metrics good)
│   └── Record positive feedback + embed for retrieval
├── Task failed/poor quality
│   └── Record negative feedback + analyze failure mode
└── Unclear outcome
    └── Ask user for explicit feedback before recording
```

## FAILURE MODES

**Over-Optimization Spiral**
- SYMPTOM: Prompt grows to 500+ tokens with many nested constraints
- DIAGNOSIS: Chasing diminishing returns instead of stopping at "good enough"
- FIX: Apply 80/20 rule - if improvement drops below 5% per iteration, stop

**Template Obsession**  
- SYMPTOM: Spending iterations on formatting/structure vs. task clarity
- DIAGNOSIS: Confusing presentation with performance
- FIX: Measure actual task success, not template conformity

**Historical Overfitting**
- SYMPTOM: Optimized prompt works for past examples but fails on new inputs
- DIAGNOSIS: Training on too narrow a dataset from retrieval
- FIX: Include diverse examples in optimization, test on held-out cases

**Capability Misjudgment**
- SYMPTOM: Adding extensive scaffolding for tasks model handles natively
- DIAGNOSIS: Assuming model limitations without testing
- FIX: Test baseline capability before heavy prompting

**Measurement Blindness**
- SYMPTOM: Multiple iterations without clear success metrics
- DIAGNOSIS: Optimizing without knowing what "better" means
- FIX: Define measurable success criteria in first step

## WORKED EXAMPLES

### Example 1: Code Optimization Request

**Original**: "Make this code better"
```python
def process_data(data):
    results = []
    for item in data:
        if item > 0:
            results.append(item * 2)
    return results
```

**Decision Point Navigation**:
1. **Assessment**: Complex task (requires code analysis) → Trigger optimization
2. **Technique Selection**: Code review + improvement → APE with 5 iterations
3. **Retrieved Context**: Similar code optimization prompts from history
4. **Optimized Prompt**: "Analyze this Python function for performance, readability, and Pythonic patterns. Identify specific improvements: algorithmic complexity, memory usage, edge cases, and style. Provide refactored code with explanations."

**What Novice Misses**: Vague "make better" doesn't specify criteria
**What Expert Catches**: Need explicit dimensions (performance, style, edge cases)

**Result**: Clear analysis of list comprehension opportunity, edge case handling, type hints

### Example 2: Reasoning Task Template

**Original**: "Help me think through this decision"

**Decision Point Navigation**:
1. **Assessment**: Reusable template + reasoning task → Full optimization
2. **Historical Retrieval**: Found decision framework prompts (0.87 similarity)
3. **Technique Selection**: DSPy compilation (structured reasoning pipeline)
4. **Iteration Strategy**: 10 rounds, measuring decision quality

**Optimized Template**:
```
Decision Analysis Framework:
1. SITUATION: State the decision clearly with constraints
2. STAKEHOLDERS: List affected parties and their interests  
3. OPTIONS: Generate 3-5 distinct alternatives
4. CRITERIA: Define success metrics and weighting
5. TRADE-OFFS: Analyze each option against criteria
6. RECOMMENDATION: Select best option with confidence level
```

**Quality Gates Applied**: Template completeness, reusability score, user satisfaction

### Example 3: Ambiguous Technical Request

**Original**: "Set up monitoring"

**Decision Point Navigation**:
1. **Assessment**: Underspecified + technical → Trigger optimization
2. **Clarification Strategy**: OPRO with constraint elicitation
3. **Domain Context**: Retrieved monitoring setup patterns

**Optimized Prompt**:
"Design monitoring setup by specifying: (1) Infrastructure scope (servers, containers, applications), (2) Key metrics (performance, availability, business), (3) Alert thresholds and escalation, (4) Technology stack constraints, (5) Budget/complexity limits. Provide implementation roadmap with priorities."

**Before/After Trade-offs**:
- Before: Endless back-and-forth clarification
- After: Structured requirements gathering in single exchange
- Cost: Longer initial prompt
- Benefit: Complete specification in one round

## QUALITY GATES

Pre-execution checklist before calling optimize_prompt:

- [ ] Task complexity score > 3 (multi-step/reasoning required)
- [ ] Clear success criteria defined or derivable
- [ ] Token budget estimated and technique selected
- [ ] Domain context identified for retrieval
- [ ] Iteration limit set based on complexity

Post-optimization validation:

- [ ] Optimized prompt is specific and actionable
- [ ] Success metrics are measurable
- [ ] Constraint coherence verified (no contradictions)
- [ ] Token efficiency: improvement justifies added length
- [ ] Historical context integrated appropriately
- [ ] User confirmation obtained for major changes

Quality scoring rubric (0-100):
- Clarity: Can naive user understand requirements? (25 pts)
- Specificity: Concrete vs. abstract instructions? (25 pts)  
- Completeness: Covers edge cases and constraints? (25 pts)
- Efficiency: Achieves goals without bloat? (25 pts)

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**

- **Simple factual questions** → Answer directly with knowledge
- **File operations without reasoning** → Use file-management skill
- **Direct command execution** → Execute immediately  
- **Conversational responses** → Respond naturally
- **Already optimized prompts** → Check history first to avoid re-optimization
- **User explicitly says "don't optimize"** → Respect user preference

**Delegate instead:**

- For mathematical problems → Use calculation-focused skills
- For creative writing → Use creative-writing skill (unless template creation)
- For data analysis → Use data-analysis skill (unless complex reasoning required)
- For debugging → Use debugging skill (unless systematic improvement needed)

**Gray areas requiring judgment:**

- Medium complexity tasks (score 2-4) → Test baseline performance first
- Domain expertise requests → Optimize only if reusable template potential
- Follow-up questions → Optimize if expanding scope significantly