---
name: ml-system-design-interview
license: Apache-2.0
description: Coaches end-to-end ML system design interviews covering inference pipelines, recommendation systems, RAG, feature stores, and monitoring. Use for L6+ design rounds, ML architecture whiteboarding, system design practice, serving tradeoff analysis. Activate on "ML system design", "ML interview", "recommendation system design", "RAG architecture", "feature store design", "model serving". NOT for coding interviews, behavioral questions, ML theory quizzes, or paper implementations.
allowed-tools: Read,Write,Edit
metadata:
  category: Career & Interview
  pairs-with:
    - skill: interview-loop-strategist
      reason: Complementary skill
    - skill: senior-coding-interview
      reason: Complementary skill
    - skill: anthropic-technical-deep-dive
      reason: Complementary skill
    - skill: interview-simulator
      reason: Complementary skill
  tags:
    - interview
    - ml-system-design
    - machine-learning
    - architecture
category: Career & Interview
tags:
  - ml-system-design
  - interview
  - machine-learning
  - architecture
  - preparation
---

# ML System Design Interview

End-to-end ML pipeline design coaching for staff+ engineers. Covers the full arc from problem definition through production monitoring -- the scope expected at L6+ interviews at top-tier ML organizations.

## Decision Points

### Serving Architecture Selection

```
Query: What inference pattern should we use?

1. Input Predictability?
   ├─ Finite/enumerable → BATCH PREDICTION
   │  └─ Example: recommend videos for all users nightly
   └─ Infinite/dynamic → ONLINE INFERENCE
      └─ Go to #2

2. Latency Requirement?
   ├─ <100ms → ONLINE INFERENCE (cached features)
   │  └─ Example: search ranking, fraud detection
   ├─ 100ms-1s → NEAR-REAL-TIME
   │  └─ Example: feed ranking with fresh user signals
   └─ >1s → STREAMING COMPUTATION
       └─ Example: complex multi-modal analysis

3. Feature Freshness?
   ├─ Static features only → Precompute embeddings
   ├─ Daily updates acceptable → Feature store + cache
   └─ Real-time required → Online feature computation
```

### Problem Scoping Strategy

```
Given a vague prompt like "design a recommendation system":

1. Business Objective Clarification
   ├─ Revenue optimization? → Focus on purchase conversion metrics
   ├─ Engagement optimization? → Focus on time-spent, retention metrics  
   └─ Exploration/discovery? → Focus on diversity, serendipity metrics

2. Scale Assessment
   ├─ <1M users → Simple collaborative filtering acceptable
   ├─ 1-100M users → Need distributed training, caching layer
   └─ >100M users → Multi-stage retrieval mandatory (retrieval→ranking)

3. Cold Start Criticality
   ├─ High new user/item churn → Content-based features essential
   ├─ Stable catalog → Collaborative filtering sufficient
   └─ Mixed → Hybrid approach with exploration bonus
```

### Model Complexity Progression

```
Start simple, justify complexity upgrades:

1. Baseline Decision
   ├─ Tabular features → XGBoost/LightGBM
   ├─ Text/sequences → BERT/RoBERTa fine-tuned
   └─ Multi-modal → Pre-trained encoders + MLP

2. Production Upgrade Triggers
   ├─ Baseline hits accuracy ceiling → Deep architecture
   ├─ Cold start problems → Content-based + collaborative hybrid
   ├─ Real-time features critical → Online learning/streaming updates
   └─ Multi-objective conflicts → Multi-task architecture

3. Scaling Triggers  
   ├─ Inference latency >SLA → Model distillation/quantization
   ├─ Training time >acceptable → Distributed training
   └─ Serving cost >budget → Cheaper architecture or caching
```

## Failure Modes

### **Cold Start Death Spiral**
**Symptoms**: New users see irrelevant recommendations, bounce immediately, never generate engagement signals for learning.
**Root Cause**: System relies entirely on collaborative filtering without content-based fallback.
**Detection Rule**: If new user retention <50% of established user retention, you have cold start problems.
**Fix**: Implement content-based features (item metadata, user demographics), exploration bonus for new users, and onboarding questionnaire to bootstrap preferences.

### **Batch-Online Training Skew**
**Symptoms**: Model performs well offline but poorly in production. Offline metrics improve but online metrics stagnate.
**Root Cause**: Training data differs from serving data (features computed differently, timing gaps, selection bias).
**Detection Rule**: If offline metric improves >5% but online metric shows <1% gain, suspect training-serving skew.
**Fix**: Log exact serving features for training, implement feature validation pipeline, use identical preprocessing code paths.

### **Metric Misalignment Trap**
**Symptoms**: Optimizing for clicks but business wants purchases. Model achieves high CTR but low conversion.
**Root Cause**: Proxy metric (clicks) diverges from business metric (revenue) due to clickbait or low-intent traffic.
**Detection Rule**: If primary metric improves but business KPI degrades or stagnates, your metrics are misaligned.
**Fix**: Multi-objective optimization with business metric as constraint, or switch to business metric despite noisiness.

### **Serving Latency Creep**
**Symptoms**: Model performance is good but p99 latency gradually increases over time, eventually hitting SLA violations.
**Root Cause**: Feature computation becomes more expensive, model complexity grows, cache hit rates degrade.
**Detection Rule**: If p99 latency increases >20% over 3 months without architecture changes, you have latency creep.
**Fix**: Implement latency budgeting, feature computation timeout, model complexity governance, and cache performance monitoring.

### **Data Drift Blindness**
**Symptoms**: Model performance silently degrades over weeks/months. No alerts fire until business impact is severe.
**Root Cause**: Input data distribution shifts but model continues making confident predictions on out-of-distribution examples.
**Detection Rule**: If model confidence remains high (>0.8) but accuracy drops >10%, suspect distribution shift.
**Fix**: Population Stability Index monitoring, feature distribution alerts, model uncertainty calibration, and automatic retraining triggers.

## Worked Examples

### Example 1: E-commerce Fraud Detection System

**Context**: Design real-time fraud detection for payment processing. 10M transactions/day, must decide approve/deny in <100ms, false positive cost $50/transaction, fraud loss $500/transaction on average.

**Requirements Analysis**:
- Latency SLA: 100ms (hard constraint - payment flow blocks)
- Scale: 10M/day = 116 QPS, 1000 QPS peak
- Cost structure: 10:1 ratio favors precision over recall (better to block legitimate than approve fraud)

**Serving Architecture Decision**:
```
Option 1: Online ML model only
├─ Latency: 50-80ms (acceptable)  
├─ Accuracy: High (full feature set)
└─ Risk: Model failure = no fraud protection

Option 2: Rules + ML model
├─ Latency: 30ms rules + 50ms ML = 80ms  
├─ Accuracy: Rules catch obvious fraud, ML handles edge cases
└─ Risk: Rule maintenance overhead

DECISION: Option 2 - Rules as first line, ML for nuanced cases
REASONING: 80ms meets SLA, rules provide failure safety, ML adds precision
```

**Feature Strategy**:
- Real-time: Transaction amount, merchant, device fingerprint, IP geo (cached)
- Historical: User velocity features (transactions/hour last 4 hours)  
- Engineered: Amount deviation from user's typical spending, merchant category risk score
- Trade-off: Skip computationally expensive graph features (user-merchant network) due to latency constraint

**Model Selection**:
- Baseline: Rule-based thresholds (amount >$1000, international merchant, new device)
- Production: XGBoost ensemble (fast inference, handles feature interactions, interpretable for compliance)
- Rejected: Deep neural networks (unnecessary complexity, harder to debug, longer inference time)

**Final Architecture**:
Rules Engine (30ms) → If uncertain → XGBoost Model (50ms) → Decision
Total latency: 80ms (within 100ms SLA)

### Example 2: Document RAG System

**Context**: Build RAG system for company knowledge base. 50k documents, 1000 employees, must handle complex multi-hop questions about policies, procedures, and project history.

**Requirements Analysis**:
- Users: Employees asking policy/procedure questions
- Scale: 1000 users, ~10 queries/user/day = 10k queries/day  
- Latency: <3 seconds acceptable for knowledge work
- Accuracy: High precision required (wrong policy advice costly)

**Retrieval Strategy Decision**:
```
Question: How to find relevant documents for complex queries?

Option 1: Keyword search only (BM25)
├─ Pros: Fast, interpretable, good for exact matches
├─ Cons: Misses semantic similarity, poor on multi-hop
└─ Verdict: Insufficient for complex queries

Option 2: Embedding search only  
├─ Pros: Semantic understanding, handles paraphrasing
├─ Cons: May miss exact keyword matches, harder to debug
└─ Verdict: Good but incomplete

Option 3: Hybrid search (BM25 + embeddings)
├─ Pros: Gets both exact matches AND semantic similarity
├─ Cons: More complex, need score fusion strategy
└─ CHOSEN: Best of both worlds

Fusion Strategy: RRF (Reciprocal Rank Fusion)
Score = 1/(rank_bm25 + k) + 1/(rank_embedding + k) where k=60
```

**Chunking Strategy**:
- Challenge: Documents vary from 1-page forms to 100-page manuals
- Strategy: Hierarchical chunking
  - Level 1: Sections (preserve context boundaries)
  - Level 2: Paragraphs (if section >1000 tokens)
  - Overlap: 100 tokens between chunks
- Reasoning: Preserve logical document structure while staying within embedding model limits

**Reranking Decision**:
```
After retrieval, should we rerank results?

Raw retrieval quality assessment:
├─ Top-5 contains answer: 75% of time
├─ Top-1 contains answer: 40% of time  
└─ Conclusion: Retrieval recall good, precision needs work

Reranking options:
├─ Cross-encoder (BERT-based): +15% top-1 precision, +200ms latency
├─ LLM-based: +25% top-1 precision, +800ms latency
└─ CHOSEN: Cross-encoder (better precision/latency trade-off)

Final pipeline: Hybrid retrieval → Cross-encoder reranking → LLM generation
```

### Example 3: Real-time Recommendation System

**Context**: Design homepage recommendations for social media app. 100M monthly users, infinite scroll feed, optimize for time spent and user satisfaction.

**Cold Start Strategy**:
- New users: No historical interactions
- Solution: Content-based onboarding
  1. Interest survey during signup (5 topics)  
  2. Seed recommendations from popular content in chosen topics
  3. Switch to collaborative filtering after 10 interactions
  4. Exploration bonus: 20% of recommendations are random (decreases to 5% over time)

**Multi-Stage Architecture Decision**:
```
Scale constraint: Cannot run complex model on all user-item pairs

Stage 1: Candidate Retrieval  
├─ Input: User profile
├─ Output: 10k candidate items (from 100M+ total)
├─ Methods: Collaborative filtering, content similarity, trending
├─ Latency budget: 50ms

Stage 2: Ranking
├─ Input: 10k candidates  
├─ Output: Ranked list of 100 items
├─ Model: Deep neural network with rich features
├─ Latency budget: 100ms

Stage 3: Diversification
├─ Input: Ranked 100 items
├─ Output: Final 20 items for feed
├─ Logic: MMR algorithm (maximal marginal relevance)
├─ Latency budget: 20ms

Total: 170ms (within 200ms SLA)
```

## Quality Gates

- [ ] **Requirements defined**: Business metric, user scale, latency SLA, and constraints are explicitly stated
- [ ] **Metrics aligned**: Offline metrics connect to online metrics with explanation of gaps/alignment issues  
- [ ] **Data pipeline complete**: Sources, labeling strategy, ETL, quality checks, and freshness requirements covered
- [ ] **Feature architecture specified**: Online/offline split, feature store design, freshness requirements, and computation costs
- [ ] **Baseline established**: Simple model proposed first with performance expectations before complex architecture
- [ ] **Serving pattern justified**: Batch vs online vs streaming decision made with latency/cost/freshness trade-offs
- [ ] **Monitoring strategy**: Data drift detection, model performance alerts, A/B testing, and rollback plan specified
- [ ] **Failure modes addressed**: At least 3 potential failure points identified with detection and mitigation strategies
- [ ] **Organizational constraints**: Team size, on-call burden, compliance, migration path, and build-vs-buy decisions discussed
- [ ] **End-to-end latency calculated**: All components have latency estimates that sum to meet SLA

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- **Coding interviews**: For algorithm/data structure problems, use `senior-coding-interview` instead
- **ML theory questions**: For mathematical derivations, optimization theory, or paper explanations, delegate to domain expert
- **Behavioral interviews**: For leadership scenarios, conflict resolution, or career progression questions, use `interview-loop-strategist`
- **Implementation details**: For actual code writing, debugging, or framework-specific syntax, this is whiteboard design only
- **Research paper review**: For novel architecture analysis or cutting-edge technique evaluation, focus on production-proven approaches
- **Data science exploratory work**: For hypothesis generation, statistical analysis, or experimental design, this assumes production deployment context

**Where to delegate**:
- Deep technical coding → `senior-coding-interview`
- Leadership and team dynamics → `interview-loop-strategist`  
- Company-specific technical deep dives → `anthropic-technical-deep-dive`
- General interview strategy and loop navigation → `interview-simulator`