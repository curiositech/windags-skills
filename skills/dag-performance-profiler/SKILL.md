---
license: BSL-1.1
name: dag-performance-profiler
description: Profiles DAG execution performance including latency, token usage, cost, and resource consumption. Identifies bottlenecks and optimization opportunities. Activate on 'performance profile', 'execution metrics', 'latency analysis', 'token usage', 'cost analysis'. NOT for execution tracing (use dag-execution-tracer) or failure analysis (use dag-failure-analyzer).
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
category: Agent & Orchestration
tags:
  - dag
  - observability
  - performance
  - metrics
  - optimization
pairs-with:
  - skill: dag-execution-tracer
    reason: Uses execution traces
  - skill: dag-failure-analyzer
    reason: Performance-related failures
  - skill: dag-pattern-learner
    reason: Provides performance patterns
  - skill: dag-task-scheduler
    reason: Scheduling optimization
---

# DAG Performance Profiler

You analyze DAG execution performance to identify bottlenecks and optimization opportunities through systematic profiling of latency, token usage, cost, and resource consumption.

## DECISION POINTS

### 1. Bottleneck Classification
```
Primary bottleneck detected?
├─ High latency (>3x avg node time)
│  ├─ Sequential dependency chain → Restructure for parallelization
│  └─ Single slow node → Break into smaller tasks or downgrade model
├─ High cost (>40% of total budget)
│  ├─ Token usage >5000/node → Context reduction strategy
│  └─ Expensive model overuse → Model selection optimization
└─ Resource contention (wait time >50% execution time)
   ├─ Tool latency bottleneck → Cache or parallelize tool calls
   └─ Dependency blocking → DAG restructuring
```

### 2. Optimization Priority Matrix
```
Impact vs Effort analysis:
├─ High Impact (>20% improvement) + Low Effort → IMMEDIATE (same day)
│  ├─ Model downgrade for simple tasks → Execute immediately
│  └─ Remove obvious sequential dependencies → Execute immediately
├─ High Impact + High Effort → PLANNED (next sprint)
│  ├─ Major DAG restructuring → Schedule with stakeholders
│  └─ Tool replacement/caching → Plan implementation
├─ Low Impact (<10% improvement) → DEFER
│  └─ Minor optimizations → Document but don't implement
└─ Negative Impact → REJECT
   └─ Optimizations that hurt other metrics → Explicitly reject
```

### 3. Cost-Latency Trade-off Decision
```
Performance requirement context?
├─ Cost-sensitive (budget constrained)
│  ├─ Accept 20% latency increase for 30%+ cost reduction → Recommend
│  └─ <20% cost savings → Keep current configuration
├─ Latency-critical (real-time requirements)
│  ├─ Accept 40%+ cost increase for 20% latency reduction → Recommend
│  └─ <15% latency improvement → Reject cost increase
└─ Balanced requirements
   ├─ Cost/latency ratio improvement >15% → Recommend
   └─ <10% improvement either metric → No change recommended
```

## FAILURE MODES

### Over-Optimization Syndrome
**Symptoms**: Recommending micro-optimizations that save <5% while ignoring major bottlenecks
**Detection**: If optimization list has >5 items with <10% individual impact each
**Fix**: Rank by impact percentage, focus only on top 2-3 optimizations with >15% impact. Defer others explicitly.

### False Bottleneck Attribution  
**Symptoms**: Misidentifying wait time as execution bottleneck, blaming wrong nodes
**Detection**: If "slow node" has high wait time but normal execution time relative to task complexity
**Fix**: Separate wait time from execution time in analysis. Focus on dependency structure causing waits, not node speed.

### Cost Underestimation Trap
**Symptoms**: Providing token savings calculations without accounting for model pricing differences
**Detection**: If cost savings percentages don't match token reduction ratios by model type
**Fix**: Always calculate actual cost: (token_change / 1000) × model_price_per_1k. Show both token AND dollar impact.

### Parallelization Fantasy
**Symptoms**: Suggesting parallelization for inherently sequential tasks with data dependencies
**Detection**: If recommending parallel execution for nodes where output of A feeds input of B
**Fix**: Map actual data dependencies before suggesting parallelization. Only truly independent nodes can run parallel.

### Single-Metric Tunnel Vision
**Symptoms**: Optimizing one metric while catastrophically degrading another
**Detection**: If optimizing for cost increases latency >50% or optimizing latency increases cost >100%
**Fix**: Always provide trade-off analysis: "20% cost savings, 15% latency increase, 5% accuracy impact"

## WORKED EXAMPLES

### Code Review DAG Analysis
**Initial State**: 5-node code review DAG: 45s total, $0.42 cost
- `extract-code`: 4.2s, 2,400 tokens, Sonnet
- `analyze-complexity`: 8.1s (3.4s wait + 4.7s exec), 4,200 tokens, Sonnet  
- `check-security`: 6.8s, 3,100 tokens, Sonnet
- `review-performance`: 12.4s, 8,900 tokens, Opus
- `generate-report`: 13.5s (9.2s wait + 4.3s exec), 5,200 tokens, Sonnet

**Step 1 - Bottleneck Classification**
Primary bottleneck: `review-performance` at 12.4s (27% of total) - Single slow node pattern
Secondary: Dependency blocking causing 12.6s total wait time

**Step 2 - Apply Decision Tree** 
High latency bottleneck + resource contention → Restructure for parallelization + break down slow node

**Step 3 - Optimization Recommendations**
1. **HIGH IMPACT**: Split `review-performance` into `check-patterns` (3s, Sonnet) + `assess-complexity` (4s, Sonnet) 
   - Saves: 5.4s latency, $0.08 cost (model downgrade)
2. **MEDIUM IMPACT**: Parallelize `analyze-complexity` + `check-security` (currently sequential)
   - Saves: 6.8s latency by removing wait time
3. **DEFER**: Context reduction could save $0.05 but <5% impact

**Final Result**: 28s total (38% faster), $0.34 cost (19% cheaper)

### High-Cost Analytics Pipeline
**Initial State**: 8-node data analysis: 67s total, $2.40 cost, 95% Opus usage

**Step 1 - Cost Analysis Discovery**
- `extract-tables`: 2,800 tokens, Opus ($0.42) - Simple extraction task
- `clean-data`: 3,200 tokens, Opus ($0.48) - Pattern matching task  
- `statistical-analysis`: 12,600 tokens, Opus ($1.89) - Complex reasoning
- `generate-insights`: 9,400 tokens, Opus ($1.41) - Moderate analysis

**Step 2 - Model Selection Decision Tree**
Using complexity assessment:
- Extract/clean: Simple → Haiku ($0.007 vs $0.15/1k) 
- Statistical: Complex reasoning → Keep Opus
- Insights: Moderate → Sonnet ($0.003 vs $0.15/1k)

**Step 3 - Impact Calculation**
- Extract + clean: 6,000 tokens × $0.143 savings/1K = $0.86 savings
- Insights: 9,400 tokens × $0.012 savings/1K = $0.11 savings  
- **Total: $0.97 savings (40% cost reduction), 2s latency increase (3%)**

**Expert Decision**: Accept trade-off - massive cost savings for minimal latency impact in non-critical analytics pipeline.

## QUALITY GATES

Performance profiling complete when:

- [ ] Execution metrics parsed with node-by-node timing breakdown
- [ ] Token usage calculated per node with model cost attribution  
- [ ] Wait time separated from execution time for each node
- [ ] Critical path identified with percentage of total duration
- [ ] Bottlenecks ranked by impact (>15% improvement threshold)
- [ ] Cost-latency trade-offs quantified for major recommendations
- [ ] Model selection recommendations matched to task complexity levels
- [ ] Parallelization suggestions verified against actual data dependencies
- [ ] Implementation effort estimated (immediate/planned/complex) for each optimization
- [ ] Performance improvement projections include confidence intervals

## NOT-FOR BOUNDARIES

**This skill should NOT be used for**:
- Real-time execution monitoring → Use `dag-execution-tracer` instead
- Failure root cause analysis → Use `dag-failure-analyzer` instead  
- DAG structural design from scratch → Use `dag-architect` instead
- Automatic optimization implementation → Use `dag-auto-optimizer` instead
- Resource allocation planning → Use `dag-task-scheduler` instead

**Delegate when**:
- Need live execution logs or traces → `dag-execution-tracer`
- Performance issue is masking failures → `dag-failure-analyzer`
- Recommendations require major DAG redesign → `dag-architect`  
- User wants hands-off optimization → `dag-auto-optimizer`
- Need to schedule optimized DAG → `dag-task-scheduler`

This skill focuses on **analysis and actionable recommendations**, not monitoring, design, or automatic implementation.