---
license: Apache-2.0
name: llm-cost-optimizer
description: "Track and reduce LLM API costs with per-request token tracking, model routing, budget alerts, and prompt compression. Activate on: reduce AI costs, token tracking, model routing, LLM budget, prompt compression. NOT for: general cloud cost optimization (cost-accrual-tracker), model training costs (ai-engineer)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - cost-optimization
  - token-tracking
  - model-routing
  - budget-management
  - prompt-compression
pairs-with:
  - skill: cost-accrual-tracker
    reason: General cost tracking infrastructure complements LLM-specific optimization
  - skill: llm-response-caching-layer
    reason: Caching is the highest-impact cost reduction lever
  - skill: model-serving-api-builder
    reason: Self-hosted serving eliminates per-token API costs at scale
---

# LLM Cost Optimizer

Track per-request token usage, implement intelligent model routing, set budget alerts, and compress prompts to reduce LLM API costs by 40-70%.

## Decision Points

### When to Optimize Which Dimension

```
High API costs (>$500/month) AND unknown spend breakdown?
├─ YES → Start with token tracking middleware
│   ├─ Instrument all LLM calls for 1 week
│   └─ Generate cost breakdown report
└─ NO → Skip to routing or compression

Cost breakdown shows 80% from 20% of endpoints?
├─ YES → Implement model routing for top cost drivers
│   ├─ Simple tasks (classify/extract) → Haiku/GPT-4o-mini
│   ├─ Medium tasks (summarize/explain) → Sonnet/GPT-4o  
│   └─ Complex tasks (reason/create) → Opus/GPT-4
└─ NO → Focus on prompt compression

System prompts >1000 tokens AND high request volume?
├─ YES → Compress prompts first (highest ROI)
│   ├─ Enable prompt caching (Anthropic/OpenAI)
│   ├─ Reduce few-shot examples to 2-3 best
│   └─ LLMLingua compress system instructions
└─ NO → Set budget alerts and monitoring

Budget overruns happening frequently?
├─ YES → Implement automated throttling
│   ├─ Daily caps with 80% soft limit warnings
│   ├─ Auto-downgrade expensive → cheap models
│   └─ Emergency circuit breaker at 95%
└─ NO → Set up monitoring dashboards
```

### Model Selection Decision Tree

```
Request Analysis:
├─ Input tokens <200 AND structured output needed?
│   └─ Route to: Haiku ($0.80/M) or GPT-4o-mini ($0.15/M)
├─ Single-step reasoning OR summarization <2000 tokens?
│   └─ Route to: Sonnet ($3/M) or GPT-4o ($2.50/M)
├─ Multi-step reasoning OR creative writing OR high-stakes?
│   └─ Route to: Opus ($15/M) or GPT-4 ($30/M)
└─ Latency <100ms required?
    └─ Route to: Fastest model regardless of cost
```

## Failure Modes

### Quality Degradation Spiral
**Symptom**: Model performance drops after cost optimization
**Detection**: Eval metrics decline >5% after routing/compression changes
**Diagnosis**: Over-aggressive optimization sacrificing capability for cost
**Fix**: 
- A/B test compressed vs original prompts on eval suite
- Route complex reasoning back to capable models
- Implement quality gates before cost optimizations go live

### Misclassification Cascade
**Symptom**: Simple tasks routed to expensive models, complex to cheap
**Detection**: Haiku/mini models showing high retry rates or error responses
**Diagnosis**: Complexity classifier is miscalibrated or missing edge cases
**Fix**:
- Log classification confidence scores
- Manual review of misclassified requests
- Retrain classifier with corrected examples
- Add safety net: retry on cheap model failure with expensive model

### Budget Alert Fatigue
**Symptom**: Team ignores budget alerts, overruns become normal
**Detection**: >3 budget alerts per week with no corrective action
**Diagnosis**: Alerts are noise without automated enforcement
**Fix**:
- Implement automated throttling at 80% budget
- Auto-downgrade models at 90% budget  
- Circuit breaker at 95% to prevent overruns
- Weekly budget review meetings with stakeholders

### Pricing Staleness Trap
**Symptom**: Cost calculations wrong, optimization decisions based on old pricing
**Detection**: Calculated costs don't match actual API bills (>10% variance)
**Diagnosis**: Hardcoded pricing table outdated, new models not included
**Fix**:
- Pull pricing from provider APIs weekly
- Alert on pricing table age >30 days
- Version pricing configs with update timestamps
- Fallback to conservative estimates for unknown models

### Cache Thrashing
**Symptom**: Prompt caching provides no savings despite implementation
**Detection**: Cache hit rate <20% despite repeated system prompts
**Diagnosis**: Prompts have subtle variations breaking exact-match caching
**Fix**:
- Normalize system prompts to remove timestamp/session variations
- Use prompt templates with variable substitution
- Implement fuzzy matching for near-duplicate prompts
- Monitor cache hit rates and investigate misses

## Worked Example

**Scenario**: API costs jumped from $800/month to $3,200/month after launching new chat feature.

### Step 1: Token Tracking Analysis (Week 1)
```python
# After 1 week of tracking
breakdown = {
    "/chat/respond": {"requests": 45000, "cost": 2100, "avg_tokens": 850},
    "/chat/summarize": {"requests": 12000, "cost": 400, "avg_tokens": 600}, 
    "/admin/classify": {"requests": 8000, "cost": 120, "avg_tokens": 200}
}
# Insight: Chat responses drive 77% of cost but use Opus for everything
```

**Novice approach**: "Let's switch everything to Haiku to save money"
**Expert decision**: "Chat classification can use Haiku, but creative responses need Sonnet/Opus routing"

### Step 2: Implement Intelligent Routing (Week 2)
```python
def route_chat_request(prompt, conversation_length, task_type):
    if task_type == "classify_intent" or len(prompt) < 200:
        return "claude-haiku-3-5"  # $0.80/M input
    elif task_type in ["summarize", "explain"] and conversation_length < 5:
        return "claude-sonnet-3-5"  # $3/M input  
    else:  # creative, long conversations, complex reasoning
        return "claude-opus-3"     # $15/M input
```

**Results after 1 week**:
- `/chat/respond`: 60% Haiku, 35% Sonnet, 5% Opus
- Cost reduction: $2,100 → $950 (55% savings)
- Quality metrics: unchanged for classification, 2% improvement for creative tasks

### Step 3: Prompt Compression (Week 3)
```python
# Original system prompt: 1,800 tokens
original_prompt = """You are a helpful AI assistant. Your role is to provide accurate, helpful, and engaging responses to user questions. You should always be polite and professional. Here are some examples of good responses:

Example 1: [300 tokens of example]
Example 2: [300 tokens of example] 
Example 3: [300 tokens of example]
Example 4: [300 tokens of example]

Remember to always follow these guidelines: [400 tokens of detailed rules]
"""

# Compressed version: 720 tokens (60% reduction)
compressed_prompt = """You are a helpful AI assistant providing accurate, engaging responses.

Best examples:
- [100 token example 1]  
- [100 token example 2]

Guidelines: [320 tokens of essential rules only]
"""
```

**A/B Test Results**:
- Quality score: 94.2% vs 94.8% (0.6% degradation - acceptable)
- Token savings: 1,080 tokens per request 
- Cost impact: Additional $600/month savings

### Final Results (Week 4)
- **Total cost reduction**: $3,200 → $1,100 (66% savings)
- **Quality maintained**: <1% degradation on eval suite
- **Implementation effort**: 2 engineer-weeks
- **ROI**: $2,100/month savings = $25K annual savings

**Trade-off analysis shown to stakeholders**:
1. **Aggressive path**: All Haiku + max compression = 80% cost savings, 8% quality drop
2. **Balanced path** (chosen): Intelligent routing + moderate compression = 66% savings, <1% quality drop  
3. **Conservative path**: Routing only = 45% savings, no quality impact

## Quality Gates

- [ ] Token tracking captures model, input tokens, output tokens, cost, and latency for every LLM call
- [ ] Cost breakdown dashboard shows spend by endpoint, model, user, and time period  
- [ ] Model routing classifier achieves >90% accuracy on complexity classification task
- [ ] Compressed prompts maintain >95% quality score compared to original on eval suite
- [ ] Prompt caching enabled and achieving >40% hit rate for repeated system prompts
- [ ] Budget alerts trigger at 50%, 80%, and 95% of daily/weekly/monthly limits
- [ ] Automated throttling or model downgrade prevents budget overruns >5%  
- [ ] Monthly cost variance between calculated and actual API bills <10%
- [ ] All pricing tables updated within last 30 days and include fallback estimates
- [ ] Quality monitoring detects performance regressions >2% within 24 hours of deployment

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- **General cloud infrastructure costs** → Use `cost-accrual-tracker` for compute, storage, networking costs
- **Model training or fine-tuning costs** → Use `ai-engineer` for training optimization and compute allocation
- **Vector database storage and query costs** → Use `rag-document-ingestion-pipeline` for embedding and retrieval optimization  
- **Self-hosted model serving optimization** → Use `model-serving-api-builder` for inference server tuning
- **Data pipeline costs from LLM preprocessing** → Use `data-pipeline-builder` for ETL cost optimization

**Delegate to other skills when**:
- Request involves training custom models → `ai-engineer`
- Need to optimize embedding generation costs → `rag-document-ingestion-pipeline`
- Caching requirements exceed simple prompt/response caching → `llm-response-caching-layer`
- Cost tracking needs to integrate with broader cloud cost management → `cost-accrual-tracker`