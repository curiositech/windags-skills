---
license: Apache-2.0
name: always-on-agent-architecture
description: |
  Architecture and systems design for building always-on AI agents with episodic memory. Covers the memory hierarchy (core/recall/archival), persistence layers, agent server infrastructure, vector stores, and framework selection. Provides concrete deployment patterns for agents that maintain identity and learn across sessions. Activate on: "always-on agent", "persistent agent architecture", "episodic memory system", "agent memory design", "long-running agent", "stateful agent", "agent that remembers", "MemGPT architecture", "Letta deployment", "/always-on-agent-architecture". NOT for: choosing what data to feed the agent (use always-on-agent-inputs), brainstorming applications (use always-on-agent-applications), safety and privacy concerns (use always-on-agent-safety), general agentic patterns (use agentic-patterns).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - WebSearch
  - WebFetch
metadata:
  category: AI & Agents
  tags:
    - always-on
    - persistent-agent
    - episodic-memory
    - architecture
    - memory-systems
    - stateful-agents
    - infrastructure
  pairs-with:
    - skill: always-on-agent-inputs
      reason: Architecture defines what memory stores exist; inputs defines what fills them
    - skill: always-on-agent-safety
      reason: Persistent memory creates unique privacy and cost risks that must be designed in
    - skill: background-job-orchestrator
      reason: Always-on agents need daemon-style process management and supervision
    - skill: agentic-patterns
      reason: Core agent loop patterns apply within each reasoning cycle of the persistent agent
    - skill: agent-creator
      reason: The agent-creator skill handles building the agent itself; this skill handles the persistence layer
category: Agent & Orchestration
tags:
  - always
  - agent
  - architecture
  - deployment
  - ai
  - design
---

# /always-on-agent-architecture — Building Agents That Never Forget

You are designing the architecture for an always-on AI agent with episodic memory. This is not a chatbot with a long context window. This is a system that persists state across sessions, manages its own memory hierarchy, runs as a service, and maintains identity over weeks and months. The core insight: treat the LLM as a CPU that operates on managed memory, not as a stateless function.

## Decision Points

### Memory Framework Selection Tree

```
Q1: Do you want a full agent runtime (server, APIs, tools)?
├─ Yes → Use Letta (most complete, production-ready)
└─ No, I have my own agent loop
   ├─ Q2: Do you need temporal/relationship tracking?
   │  ├─ Yes → Use Zep/Graphiti (best temporal knowledge graph)
   │  └─ No → Go to Q3
   │     ├─ Q3: Do you need graph + vector hybrid?
   │     │  ├─ Yes → Use Mem0 (graph mode)
   │     │  └─ No → Go to Q4
   │     │     ├─ Q4: Already on LangGraph?
   │     │     │  ├─ Yes → Use LangMem
   │     │     │  └─ No → Use pgvector or Chroma
   └─ Want zero dependencies? → Custom SQLite + local embeddings
```

### Core Memory Eviction Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| **Size Overflow** | Core memory > 4KB | Summarize least-recent block, move summary to archival |
| **Age Decay** | Data unused > 30 days | Mark for compaction review |
| **Relevance Drop** | Access score < 0.3 | Move to archival memory with decay tag |
| **User Override** | User says "forget X" | Immediate removal + archival tombstone |
| **Conflict Detection** | Contradictory facts stored | Prompt agent to reconcile or ask user |

### Vector DB Selection Criteria

```
If query_latency_requirement < 10ms AND data_size > 100M vectors:
    → Use Qdrant (optimized for speed)
Else if already_using_postgresql:
    → Use pgvector (single DB, simpler ops)
Else if need_hybrid_search (keyword + semantic):
    → Use Weaviate (best hybrid)
Else if zero_ops_preferred:
    → Use Pinecone (fully managed)
Else:
    → Use Chroma (local-first, simple API)
```

### Memory Tier Routing Decision

```
Input: User message or agent observation
│
├─ Contains identity/preference update?
│  └─ Yes → Update core memory, persist immediately
├─ Requires conversation context?
│  └─ Yes → Search recall memory (conversation history)
├─ Needs factual knowledge?
│  └─ Yes → Search archival memory (vector store)
└─ External data needed?
   └─ Yes → Use external tools (APIs, files, etc.)
```

## Failure Modes

### Memory Corruption Cascade
**Symptoms:** Agent personality drift, contradictory responses, core memory conflicts
**Root Cause:** Concurrent writes to core memory without locking, or failed partial updates
**Detection Rule:** If core memory size suddenly drops >50% or contains malformed JSON/YAML
**Recovery Procedure:**
1. Stop agent immediately to prevent further corruption
2. Restore core memory from last known good backup (< 1hr old)
3. Replay conversation log since backup to reconstruct lost updates
4. Implement write locks on core memory updates before restart

### Vector Search Degradation
**Symptoms:** Increasingly irrelevant search results, agent can't find recently stored facts
**Root Cause:** Embedding model drift, index corruption, or no memory compaction
**Detection Rule:** If average cosine similarity of top-3 results < 0.7 for known queries
**Recovery Procedure:**
1. Run embedding consistency check on random sample of 100 vectors
2. If >10% show anomalous embeddings, rebuild entire index
3. Implement embedding model version pinning
4. Add embedding drift monitoring to prevent recurrence

### Persistence Layer Deadlock
**Symptoms:** Agent hangs on memory operations, database connection timeouts
**Root Cause:** Simultaneous read/write to same memory blocks, insufficient connection pooling
**Detection Rule:** If memory operation takes >30s or database shows lock wait timeouts
**Recovery Procedure:**
1. Kill hanging connections to release locks
2. Implement exponential backoff retry logic for memory operations
3. Add connection pooling with max connection limits
4. Review transaction isolation levels for memory updates

### Context Window Explosion
**Symptoms:** API costs spike, response latency increases, token limit errors
**Root Cause:** Core memory bloat, retrieving too many archival chunks per query
**Detection Rule:** If average tokens per request > 80% of model's context limit
**Recovery Procedure:**
1. Audit core memory size - compress or archive oversized blocks
2. Reduce archival search result count from default (10 → 5)
3. Implement token counting before LLM calls
4. Add cost monitoring alerts for >$1/conversation

### Memory Leak - Unbounded Growth
**Symptoms:** Database size grows linearly, search performance degrades over time
**Root Cause:** No memory compaction, duplicate fact insertion, missing garbage collection
**Detection Rule:** If total memory size grows >100MB/month with normal usage
**Recovery Procedure:**
1. Run fact deduplication across archival memory (cosine similarity > 0.92)
2. Implement conversation summarization for recall memory >7 days old
3. Add relevance scoring with automatic pruning of low-score memories
4. Schedule weekly compaction jobs

## Worked Examples

### Example: Building a Personal Research Assistant

**Scenario:** Design architecture for an agent that helps with technical research, remembers your preferences, and builds knowledge over months.

**Step 1 - Memory Tier Design**
```
Core Memory (2KB):
- User name: "Sarah"
- Research domains: ["machine learning", "distributed systems"]
- Preferred paper sources: ["arxiv", "acm digital library"]
- Writing style: "detailed with code examples"
- Current project: "distributed training optimization"

Recall Memory:
- All conversations in PostgreSQL with full-text search
- 30-day retention window, then summarized

Archival Memory:
- Paper summaries, extracted insights, code snippets
- pgvector on PostgreSQL (already using it for recall)
- nomic-embed-text for local embedding (privacy + cost)
```

**Step 2 - Framework Selection Decision**
Following decision tree:
- Need full agent runtime? No (building custom)
- Need temporal tracking? No (research facts are mostly timeless)
- Need graph+vector? No (simple semantic search sufficient)
- Already on LangGraph? No
- → **Decision: pgvector + PostgreSQL**

**Step 3 - Agent Loop Implementation**
```python
async def research_step(user_query: str):
    # Load core memory
    core = load_core_memory()  # User prefs, active project
    
    # Check if query relates to current project
    if "optimization" in user_query.lower():
        # Search archival for project-specific knowledge
        relevant_papers = search_archival("distributed training optimization")
        context = f"Current project context: {relevant_papers}"
    else:
        # Search for general domain knowledge
        context = search_archival(user_query)
    
    # Build prompt with core memory + retrieved context
    system_prompt = f"""
    You are Sarah's research assistant.
    User preferences: {core['preferences']}
    Current project: {core['current_project']}
    
    Retrieved context: {context}
    """
    
    response = await llm.chat([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query}
    ])
    
    # Persist interaction
    save_to_recall(user_query, response)
    
    return response
```

**What a novice would miss:**
- Storing raw papers instead of extracted insights in archival
- Not implementing conversation search (recall memory)
- Putting too much in core memory (research domains list with 50 entries)
- No memory compaction strategy

**What an expert catches:**
- Core memory stays focused on "working identity" not knowledge
- Archival memory gets curated facts, not raw documents
- Implements search before retrieval (agent decides what's relevant)
- Plans for memory growth from day one

## Quality Gates

### Deployment Validation Checklist

- [ ] **Memory Latency SLO:** Core memory loads in <100ms, archival search completes in <500ms
- [ ] **Memory Consistency:** Core memory survives agent restart without corruption (test with deliberate kill)
- [ ] **Search Relevance:** Top-3 archival results have cosine similarity >0.6 for known queries
- [ ] **Memory Sizing Rules:** Core memory ≤4KB, recall retention ≤30 days, archival chunks ≤1KB each
- [ ] **Persistence Durability:** All memory updates survive database restart (ACID compliance verified)
- [ ] **Cost Controls:** Memory operations cost <$0.01/conversation at 100 conversations/day
- [ ] **Compaction Schedule:** Memory compaction runs weekly and reduces total size by ≥10%
- [ ] **Identity Consistency:** Agent personality remains stable across 50+ conversation sessions
- [ ] **Cold Start Recovery:** Agent gracefully handles empty memory state (onboarding flow works)
- [ ] **Backup Verification:** Memory backup restores successfully and preserves agent identity

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **Choosing agent training data** → Use `/always-on-agent-inputs` instead - that skill covers what data to feed the agent, this covers how to store and retrieve it
- **Brainstorming agent applications** → Use `/always-on-agent-applications` instead - that skill covers use case ideation, this covers technical implementation
- **Agent safety and privacy** → Use `/always-on-agent-safety` instead - that skill covers data governance, consent, and security; this assumes those are already designed
- **General agentic patterns** → Use `/agentic-patterns` instead - that skill covers ReAct loops, tool use, planning; this covers the persistence layer underneath
- **One-shot agent tasks** → Use `/agent-creator` instead - if the agent doesn't need to remember across sessions, you don't need always-on architecture
- **Database schema design** → This skill assumes you understand basic database concepts; use database-specific skills for schema optimization
- **Cost optimization strategies** → This skill mentions cost considerations but doesn't deep-dive optimization; delegate to cost-specific skills