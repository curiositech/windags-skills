---
license: Apache-2.0
name: episodic-memory-algorithms
description: |
  Data structures and algorithms for AI agent episodic memory. Covers vector stores (HNSW, IVF, PQ), temporal indexing, knowledge graphs with triple stores, hierarchical summarization, forgetting curves, working/long-term/ procedural memory, and memory consolidation. Deep analysis of MemGPT/Letta, Zep/Graphiti, Mem0, and the Stanford generative agents memory architecture. Teaches the CS fundamentals behind how agents remember, retrieve, and forget. Activate on: "agent memory", "episodic memory", "vector search algorithm", "HNSW", "memory retrieval", "forgetting curve", "knowledge graph memory", "MemGPT", "Letta", "Zep", "Mem0", "memory consolidation", "temporal retrieval", "agent long-term memory", "memory layer". NOT for: conversation protocol design (use agent-conversation-protocols), agent infrastructure selection (use agentic-infrastructure-2026), building RAG pipelines (use ai-engineer).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
metadata:
  category: AI & Agents
  tags:
    - memory
    - algorithms
    - vector-search
    - knowledge-graphs
    - HNSW
    - episodic-memory
    - agents
    - data-structures
  pairs-with:
    - skill: always-on-agent-architecture
      reason: Always-on agents require persistent memory across sessions
    - skill: always-on-agent-inputs
      reason: Input streams feed into memory; memory informs input processing
    - skill: ai-engineer
      reason: AI engineers implement these algorithms in production agents
    - skill: agent-interchange-formats
      reason: Memory retrieval results must be serialized for agent consumption
category: AI & Machine Learning
tags:
  - episodic-memory
  - algorithms
  - retrieval
  - agent-memory
  - recall
---

# Episodic Memory Algorithms

You are an expert in the data structures and algorithms that give AI agents memory. You understand the full stack from vector search to knowledge graphs to temporal retrieval. You can design memory systems that balance recall accuracy, latency, storage cost, and token budget.

## Decision Points

### 1. Memory Architecture Selection

```
What type of facts does your agent need to remember?
│
├─ User identity + preferences ONLY
│  └─ Use: Core memory (always in context) + simple vector store
│      Algorithm: Flat search or small HNSW (<10K entries)
│      Reasoning: Static facts don't need complex temporal tracking
│
├─ Past conversations + events
│  ├─ Need fact change tracking over time?
│  │  ├─ YES → Bi-temporal knowledge graph (Zep/Graphiti approach)
│  │  │   Algorithm: Triple store with (validFrom, ingestedAt) timestamps
│  │  │   Reasoning: Legal/medical/preference changes require audit trail
│  │  └─ NO → Vector store + simple timestamps
│  │      Algorithm: HNSW + exponential decay scoring
│  │      Reasoning: Most conversational agents don't need change history
│  │
│  └─ Need multi-hop reasoning ("who did X introduce me to")?
│      ├─ YES → Knowledge graph + vector store hybrid
│      │   Algorithm: Triple store + HNSW with graph traversal
│      │   Reasoning: Relational queries require structured relationships
│      └─ NO → Vector store with entity extraction
│          Algorithm: HNSW with named entity metadata
│          Reasoning: Simpler, faster, good enough for most cases
│
└─ Learned skills + behaviors
   └─ Use: Procedural memory (prompt templates, tool definitions)
       Algorithm: Static prompt injection + skill registry
       Reasoning: Skills change infrequently, need immediate access
```

### 2. Vector Search Algorithm Selection

```
How many memories will you store?
│
├─ <100K entries
│  ├─ Need real-time updates? → HNSW (efConstruction=200, M=32)
│  └─ Batch updates only? → Flat search (brute force cosine similarity)
│
├─ 100K - 10M entries
│  ├─ Memory constrained? → IVF-PQ (nlist=4096, m=64, nbits=8)
│  └─ Memory abundant? → HNSW (efConstruction=400, M=64)
│
└─ >10M entries
   └─ Use: DiskANN or distributed IVF-PQ
       Reasoning: Single-machine HNSW becomes prohibitively expensive
```

### 3. Retrieval Scoring Strategy

```
What's the query context?
│
├─ User asked specific question about past
│  └─ Prioritize: relevance=0.6, recency=0.2, importance=0.2
│      Reasoning: Accuracy matters more than freshness for specific recall
│
├─ Agent deciding what context to include
│  └─ Prioritize: importance=0.5, relevance=0.3, recency=0.2
│      Reasoning: Include high-value facts even if not perfectly relevant
│
├─ Real-time conversation flow
│  └─ Prioritize: recency=0.5, relevance=0.3, importance=0.2
│      Reasoning: Recent context usually most relevant to ongoing discussion
│
└─ Cold start (new session beginning)
   └─ Prioritize: importance=0.7, relevance=0.3, recency=0.0
       Reasoning: Load core identity facts regardless of when they happened
```

### 4. Forgetting Policy Assignment

```
What's the importance score of this memory? (1-10 scale)
│
├─ 9-10 (Core identity, critical preferences)
│  └─ Policy: never_forget
│      Reasoning: Agent loses coherent identity without these facts
│
├─ 7-8 (Important decisions, key relationships)
│  └─ Policy: decay with halfLife=720 hours (30 days)
│      Reasoning: Important enough to remember long-term but not forever
│
├─ 4-6 (Interesting conversations, moderate preferences)
│  └─ Policy: decay with halfLife=168 hours (7 days)
│      Reasoning: Useful for context but not critical to preserve
│
├─ 1-3 (Small talk, transient mentions)
│  └─ Policy: decay with halfLife=24 hours (1 day)
│      Reasoning: Clutter that wastes token budget if retained
│
└─ Temporary working notes
   └─ Policy: session_scoped (delete on session end)
       Reasoning: Only useful within current conversation context
```

## Failure Modes

### 1. Memory Retrieval Hallucination

**Symptoms:** Agent confidently states facts that aren't in retrieved memories, or misattributes information.

**Detection Rule:** If cosine similarity < 0.7 but agent states specific facts, you've hit retrieval hallucination.

**Diagnosis:** The retrieval scored poorly but LLM filled gaps with plausible-sounding information.

**Fix:**
- Set hard similarity threshold (0.75+) for factual claims
- Include confidence scores in retrieved memory context
- Add "I don't have specific information about..." fallback responses
- Log retrieval scores for manual audit of false positives

### 2. Token Budget Overflow

**Symptoms:** Context window consistently full, important instructions truncated, degraded performance.

**Detection Rule:** If retrieved memories + recent messages > 80% of context window, you've hit token overflow.

**Diagnosis:** Too many low-quality memories retrieved, no prioritization by token cost vs. value.

**Fix:**
- Implement token-aware retrieval: score = (relevance * importance) / token_cost
- Set hard token budget for memories (e.g., max 30% of context window)
- Prioritize recent high-importance memories over old low-importance ones
- Use hierarchical summarization to compress old conversations

### 3. Stale Memory Pollution

**Symptoms:** Agent references outdated preferences or facts, inconsistent behavior over time.

**Detection Rule:** If memories with validUntil < now are being retrieved, you've hit stale pollution.

**Diagnosis:** Forgetting mechanism not working, or no superseding logic for changed facts.

**Fix:**
- Implement bi-temporal validity (Zep approach): track when facts become invalid
- Add contradiction detection: when storing "user likes X", mark "user dislikes X" as superseded
- Run periodic cleanup to remove or archive low-strength memories
- Use fact versioning: store "user liked coffee shop A until March, now likes B"

### 4. Semantic Drift in Embeddings

**Symptoms:** Retrieval quality degrades over time, semantically similar memories aren't found together.

**Detection Rule:** If recall@10 drops below baseline (0.85+) in evaluation, you've hit semantic drift.

**Diagnosis:** Embedding model changed, or very old embeddings becoming incompatible with new ones.

**Fix:**
- Version your embeddings with model identifier
- Re-embed old memories when changing models (batch job)
- Monitor retrieval quality with synthetic test queries
- Consider embedding-agnostic fallback (keyword search) for critical memories

### 5. Knowledge Graph Explosion

**Symptoms:** Graph grows indefinitely, query latency increases, many low-confidence triples.

**Detection Rule:** If triple count > 100 * conversation_count or average confidence < 0.6, you've hit graph explosion.

**Diagnosis:** Over-aggressive triple extraction creating noise, no confidence thresholding.

**Fix:**
- Set minimum confidence threshold for storing triples (0.7+)
- Implement triple decay: low-confidence triples expire faster
- Deduplicate similar triples: merge (user, likes, coffee) and (user, enjoys, coffee)
- Limit extraction to high-importance messages (importance >= 5)

## Worked Examples

### Example 1: Personal Assistant Memory Design (1M memories, <200ms retrieval)

**Scenario:** Building memory for a personal assistant agent that helps with scheduling, email, and personal tasks. Needs to remember user preferences, past decisions, and ongoing projects across 2-year timespan.

**Step 1: Architecture Decision**
- Query: "What type of facts?" → User preferences + past conversations + learned behaviors
- Decision: Hybrid system (core memory + vector store + knowledge graph)
- Reasoning: Need identity facts always available, episodic search, and relationship tracking

**Step 2: Scale Planning**
- Expected growth: ~1,500 memories/day = 1M memories over 2 years
- Latency requirement: <200ms P95 (user-facing)
- Decision: HNSW with efConstruction=400, M=64, efSearch=100

**Step 3: Forgetting Strategy**
```
Core identity (importance 9-10): never_forget
  "User is vegetarian, lives in SF, works at Google"

Work preferences (importance 7-8): 30-day half-life
  "Prefers morning meetings, dislikes back-to-back calls"

Project context (importance 5-6): 7-day half-life
  "Working on Q3 planning, deadline is July 15"

Small talk (importance 1-3): 1-day half-life
  "Mentioned liking the weather yesterday"
```

**Step 4: Retrieval Tuning**
```python
# Morning briefing (load important context)
recall(query="daily tasks", weights={
  importance: 0.6,  # Prioritize high-value facts
  relevance: 0.3,
  recency: 0.1     # Old todos still matter
})

# Answering specific question
recall(query="when is my dentist appointment", weights={
  relevance: 0.7,   # Exact match most important
  recency: 0.2,     # Recent scheduling changes
  importance: 0.1
})
```

**What a novice would miss:** Setting uniform weights (0.33 each) regardless of query type, no importance scoring, storing entire emails instead of extracted facts.

**What an expert catches:** Query-adaptive scoring, importance assessment at write time, chunking long content before embedding, token budget management.

### Example 2: Customer Service Agent (Enterprise Scale)

**Scenario:** Support agent for SaaS product. Needs to remember customer issues, feature requests, and resolutions. 10M+ customer interactions, need bi-temporal tracking for compliance.

**Step 1: Compliance Requirements**
- Must track "when did issue occur" vs "when did we log it"
- Decision: Bi-temporal knowledge graph (Zep/Graphiti model)
- Reasoning: Regulatory audit requires fact change history

**Step 2: Scale Architecture**
- 10M+ memories, memory-constrained deployment
- Decision: IVF-PQ (nlist=8192, m=96, nbits=8)
- Reasoning: 20x compression vs raw vectors, acceptable recall@10 of 0.92

**Step 3: Entity-Centric Storage**
```
Triple examples:
(customer_123, reported, login_bug, validFrom=2025-01-15, ingestedAt=2025-01-15)
(login_bug, resolved_by, patch_v2.3, validFrom=2025-01-20, ingestedAt=2025-01-20)
(customer_123, subscription_tier, enterprise, validFrom=2024-06-01, validUntil=null)
```

**Step 4: Retrieval Strategy**
```python
# Customer context loading
def load_customer_context(customer_id: str, as_of: str = None):
    # Get all facts valid at time as_of (or now)
    facts = knowledge_graph.query(
        subject=customer_id,
        valid_at=as_of or datetime.now()
    )
    
    # Semantic search for related issues
    similar_cases = vector_store.search(
        embedding=embed(f"customer {customer_id} context"),
        filter={"customer_tier": facts.get("subscription_tier")}
    )
    
    return merge_and_rank(facts, similar_cases)
```

**What a novice would miss:** No compliance tracking, single timestamp per fact, no customer segmentation in retrieval.

**What an expert catches:** Bi-temporal model, fact superseding logic, customer-tier-aware retrieval, audit trail preservation.

## Quality Gates

Memory system is production-ready when:

- [ ] Retrieval latency P95 < 300ms for target memory count
- [ ] Recall@10 > 0.85 on evaluation dataset of real queries  
- [ ] Core memory facts (importance >= 9) never get forgotten
- [ ] Token budget for retrieved memories < 30% of context window
- [ ] Importance scoring is consistent (same content gets same score ±1)
- [ ] Forgetting policy removes >90% of low-importance memories within TTL
- [ ] Knowledge graph has <5% invalid triples (broken references, low confidence)
- [ ] Memory consolidation reduces storage by >50% without losing high-importance facts
- [ ] Cold start retrieval loads user identity within 3 queries
- [ ] Bi-temporal queries return correct facts for "what did we know at time T"
- [ ] Contradiction detection flags conflicting facts with >0.8 confidence
- [ ] System degrades gracefully when vector index is empty (fallback to keyword search)

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **RAG document search**: For retrieving chunks from static documents, use `ai-engineer` instead. Agent memory is for dynamic, temporal facts about ongoing relationships.

- **Infrastructure selection**: For choosing between Pinecone vs Weaviate vs Qdrant, use `agentic-infrastructure-2026` instead. This skill covers algorithms, not vendor comparison.

- **Conversation protocol design**: For structuring agent-to-agent communication, use `agent-conversation-protocols` instead. Memory retrieval format ≠ interchange format.

- **Prompt engineering**: For optimizing how memories are injected into context, use `prompt-engineer` instead. This skill covers storage/retrieval, not context formatting.

- **General vector database usage**: For embedding search in recommendation systems or semantic search over documents, use `ai-engineer` instead. Agent memory has unique temporal and importance requirements.

**When to delegate:**
- "How should I structure memory in prompts?" → `prompt-engineer`
- "Which vector database should I deploy?" → `agentic-infrastructure-2026`  
- "How do agents exchange memory between each other?" → `agent-conversation-protocols`
- "How do I build a RAG system?" → `ai-engineer`