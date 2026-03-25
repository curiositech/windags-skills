---
license: Apache-2.0
name: ai-engineer
description: Build production-ready LLM applications, advanced RAG systems, and intelligent agents. Implements vector search, multimodal AI, agent orchestration, and enterprise AI integrations. Use PROACTIVELY for LLM features, chatbots, AI agents, or AI-powered applications.
allowed-tools: Read,Write,Edit,Glob,Grep,Bash,WebFetch,mcp__SequentialThinking__sequentialthinking
category: AI & Machine Learning
tags:
  - llm
  - rag
  - agents
  - ai
  - production
  - embeddings
pairs-with:
  - skill: prompt-engineer
    reason: Optimize prompts for LLM applications
  - skill: chatbot-analytics
    reason: Monitor and analyze AI chatbot performance
  - skill: backend-architect
    reason: Design scalable AI service architecture
---

# AI Engineer

Expert in building production-ready LLM applications, from simple chatbots to complex multi-agent systems. Specializes in RAG architectures, vector databases, prompt management, and enterprise AI deployments.

## Decision Points

### RAG Component Selection
```
Query Type Assessment:
├── Simple FAQ/Knowledge Lookup
│   ├── Document Count < 1000 → Chroma + text-embedding-3-small
│   └── Document Count > 1000 → Pinecone + text-embedding-3-large
├── Technical/Code Documentation  
│   ├── Budget Constrained → bge-large + pgvector
│   └── Performance Critical → voyage-2 + Weaviate
└── Conversational/Multi-turn
    ├── Memory Required → Agent pattern + context management
    └── Stateless → Standard RAG pipeline

Reranking Decision:
├── Precision Critical (legal, medical) → Always use Cohere Rerank
├── Latency < 200ms → Skip reranking, tune retrieval
├── Budget Constrained → Cross-encoder (bge-reranker-large)
└── Default → Cohere Rerank with top-10 → top-3

Database Selection:
├── Existing Postgres → pgvector extension
├── Need Hybrid Search → Weaviate or Qdrant
├── Managed Service → Pinecone
└── Self-hosted/Local → Chroma or Qdrant
```

### Model Routing Strategy
```
Complexity Assessment:
├── Keywords Only (FAQ) → Claude Haiku
├── Single Document Reference → Claude Sonnet  
├── Multi-document Synthesis → Claude Opus
└── Code Generation → Claude Sonnet with tools

Token Budget Check:
├── < 1K tokens → Any model
├── 1K-4K tokens → Sonnet/GPT-4
├── 4K-32K tokens → Claude Opus
└── > 32K tokens → Chunk and summarize first
```

### Agent vs RAG Decision
```
Task Classification:
├── Static Knowledge Query → Pure RAG
├── Need External APIs → Agent with tools
├── Multi-step Reasoning → Agent with planning
├── Real-time Data Required → Agent with live tools
└── Simple Q&A → RAG with fallback to agent
```

## Failure Modes

### **Semantic Mismatch Cascade**
**Symptoms**: Good retrieval precision but poor answer relevance, users say "close but not quite right"
**Detection Rule**: If semantic similarity > 0.8 but user satisfaction < 60%
**Root Cause**: Query and document embeddings optimized for different semantic spaces
**Fix**: Switch to domain-specific embedding model or implement query expansion with synonyms

### **Context Window Overflow**
**Symptoms**: Responses become generic, model ignores specific retrieved context, inconsistent answers
**Detection Rule**: If context utilization ratio < 30% and response generality score > 0.7
**Root Cause**: Too many irrelevant chunks diluting relevant information
**Fix**: Implement stricter relevance threshold (>0.8) and dynamic context selection

### **Tool Hallucination Loop**
**Symptoms**: Agent makes up API calls, references non-existent functions, infinite retry cycles
**Detection Rule**: If tool call success rate < 50% or iteration count > max_iterations * 0.8
**Root Cause**: Model trained on different tool schemas than implementation
**Fix**: Add tool validation layer and explicit error handling in agent system prompt

### **Embedding Drift Degradation**
**Symptoms**: Gradual decline in retrieval quality over time, seasonal performance drops
**Detection Rule**: If monthly average retrieval@5 drops > 10% from baseline
**Root Cause**: Domain language evolves but embedding model remains static
**Fix**: Implement embedding model retraining pipeline or switch to adaptive embeddings

### **Response Latency Creep**
**Symptoms**: P95 latency increases gradually, user complaints about slow responses
**Detection Rule**: If P95 response time > 2x baseline for 7 consecutive days
**Root Cause**: Vector index degradation, context size inflation, or model endpoint saturation
**Fix**: Implement index optimization schedule, context pruning, and multi-model load balancing

## Worked Examples

### Example: Customer Support Chatbot Implementation

**Initial Requirements**: "Build a chatbot that can answer questions about our 500-page product documentation"

**Step 1: Architecture Decision**
- Document count: 500 pages → Use Pinecone for scalability
- Query type: Mixed FAQ + troubleshooting → Hybrid search needed
- Latency requirement: < 3 seconds → Include reranking but optimize

**Step 2: Implementation Walkthrough**
```typescript
// Novice approach - would use basic similarity search
const chunks = await vectorDb.query(queryEmbedding, { topK: 5 });

// Expert approach - considers relevance thresholds
const rawChunks = await vectorDb.query(queryEmbedding, { 
  topK: 20, 
  threshold: 0.7  // Ensure minimum relevance
});

// Expert adds reranking step novice would skip
const reranked = await reranker.rank(query, rawChunks);
const finalChunks = reranked.slice(0, 3);

// Expert includes fallback handling
if (finalChunks.length === 0) {
  return await fallbackToGeneralSupport(query);
}
```

**Step 3: Performance Optimization Discovery**
- Initial P95 latency: 4.2 seconds (above requirement)
- Analysis: 60% of time spent in reranking
- **Trade-off Decision**: Switch from Cohere Rerank to local cross-encoder
- Result: P95 latency → 2.1 seconds, slight quality drop (92% → 89% satisfaction)
- **Expert Insight**: For support use case, speed > perfect accuracy

**Step 4: Failure Scenario Handling**
- Discovered 15% of queries were about features not in documentation
- Novice: Would return "I don't know"
- Expert: Added escalation detection and handoff to human agent

**Final Architecture**: Pinecone + local reranker + agent escalation = 89% automation rate at 2.1s P95

## Quality Gates

- [ ] Retrieval@5 accuracy > 85% on evaluation dataset
- [ ] Average response latency < 3 seconds for P95
- [ ] Context utilization ratio > 60% (model uses retrieved information)
- [ ] Hallucination rate < 5% (responses not supported by retrieved context)
- [ ] User satisfaction score > 80% over 30-day rolling window
- [ ] Token cost per query < predefined budget threshold
- [ ] System uptime > 99.9% excluding planned maintenance
- [ ] PII detection rate > 95% (no personal info in responses)
- [ ] Embedding model performance stable (no >10% monthly degradation)
- [ ] Error handling covers all failure modes with graceful degradation

## Not-For Boundaries

**Do NOT use this skill for:**

**Prompt Engineering Tasks** → Use `prompt-engineer` instead
- Optimizing prompt templates and instructions
- A/B testing prompt variations
- Chain-of-thought prompt design

**ML Model Training/Fine-tuning** → Use `ml-engineer` instead  
- Training custom embedding models
- Fine-tuning LLMs on domain data
- Model architecture research

**Data Pipeline Engineering** → Use `data-pipeline-engineer` instead
- ETL processes for training data
- Data validation and cleaning workflows
- Batch processing systems

**Infrastructure/DevOps** → Use `backend-architect` instead
- Kubernetes deployment strategies
- Database optimization and sharding
- Load balancer configuration

**Analytics and Monitoring Setup** → Use `chatbot-analytics` instead
- Conversation flow analysis
- User behavior tracking
- Performance dashboard creation

**Delegate When:**
- Task requires deep ML expertise → `ml-engineer`
- Focus is on conversation design → `prompt-engineer`  
- Need infrastructure scaling → `backend-architect`
- Want usage analytics → `chatbot-analytics`
- Building non-AI features → Relevant specialist skill