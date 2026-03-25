---
license: Apache-2.0
name: always-on-agent-inputs
description: |
  How to design contextual inputs for an always-on AI agent with episodic memory. Covers what data to feed the agent, how to structure observations and triggers, ambient context capture (screen, audio, calendar), context window budgeting, and retrieval strategies that keep the agent grounded in what's actually happening. Activate on: "what should the agent observe", "context inputs for agent", "ambient context capture", "agent triggers", "agent input design", "screenpipe integration", "context window budget", "what data to feed my agent", "/always-on-agent-inputs". NOT for: memory architecture and storage (use always-on-agent-architecture), application ideas (use always-on-agent-applications), safety concerns (use always-on-agent-safety).
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
    - context-engineering
    - inputs
    - triggers
    - ambient-context
    - RAG
    - observations
  pairs-with:
    - skill: always-on-agent-architecture
      reason: Architecture defines the memory tiers; this skill defines what fills them
    - skill: always-on-agent-safety
      reason: Every input channel is a privacy surface — safety must review what you capture
    - skill: prompt-engineer
      reason: How you format and compress inputs determines agent reasoning quality
    - skill: agentic-patterns
      reason: Context management is a core agentic pattern that this skill specializes
category: Agent & Orchestration
tags:
  - always
  - agent
  - inputs
  - rag
  - ai
  - design
---

# /always-on-agent-inputs — Feeding Context to a Persistent Agent

You are designing what an always-on agent sees, hears, and knows. The architecture skill handles where memory lives. This skill handles what goes into it — the raw signals, how they're structured, when the agent wakes up, and how to keep the context window honest.

---

## DECISION POINTS

**RETRIEVAL STRATEGY SELECTION**
```
Agent Task Type → Retrieval Strategy

IF conversational/chat:
  ├─ Use recency-first (70% temporal, 30% semantic)
  ├─ Budget: 15K conversation history + 4K recent recall
  └─ Skip archival unless user asks "remember when..."

IF problem-solving/debugging:
  ├─ Use relevance-first (60% semantic, 40% temporal)
  ├─ Budget: 8K archival + 4K recall + 2K ambient
  └─ Include error patterns from past solutions

IF context-switch detected:
  ├─ Use frequency-based (what does user work on most?)
  ├─ Budget: 6K project context + 2K recent + 4K goals
  └─ Pull entity history for active files/people

IF scheduled trigger (morning briefing):
  ├─ Use structured agenda (calendar + tasks + updates)
  ├─ Budget: 4K calendar + 4K unfinished tasks + 2K changes
  └─ No conversation history needed

IF reactive trigger (CI failure, meeting starting):
  ├─ Use event-specific context loading
  ├─ Budget: 8K event context + 4K related history
  └─ Skip general conversation unless relevant
```

**AMBIENT DATA FILTERING**
```
Screen/Audio Observation → Filter Decision

IF same app + same text for >5 minutes:
  └─ DISCARD (no change, noise)

IF app switch detected:
  ├─ KEEP transition record
  └─ Score relevance of new app content

IF high-signal keywords found:
  ├─ Check against active projects/goals
  ├─ IF match score >0.6 → STORE to archival + recall
  ├─ IF match score 0.3-0.6 → STORE to recall only
  └─ IF match score <0.3 → DISCARD

IF technical error/exception visible:
  ├─ ALWAYS STORE (debugging context)
  └─ Tag with urgency level

IF calendar event mentioned:
  ├─ ALWAYS STORE (temporal anchor)
  └─ Cross-reference with actual calendar
```

**TRIGGER URGENCY ASSIGNMENT**
```
Event Type + Context → Urgency Level

IF CI failure:
  ├─ Production branch → ACTIVE (notify user)
  ├─ Feature branch + user currently coding → PASSIVE (mention when user next engages)
  └─ Old branch/PR → SILENT (log only)

IF meeting starting:
  ├─ <5 minutes → ACTIVE (interrupt with prep)
  ├─ 5-15 minutes → BADGE (show prep available)
  └─ >15 minutes → SILENT (prep in background)

IF code change detected:
  ├─ First commit on new branch → PASSIVE (note new work)
  ├─ Commit fixes previous error → PASSIVE (note resolution)
  └─ Regular commits → SILENT (track progress)

IF mentioned in Slack:
  ├─ Direct message → ACTIVE (respond needed)
  ├─ Channel mention + urgent keywords → ACTIVE
  └─ Channel mention, normal → BADGE (review when convenient)
```

---

## FAILURE MODES

**Schema Bloat**
- **Symptoms:** Context window constantly maxed out, slow responses, high token costs despite filtering
- **Root Cause:** Observation schemas capture every field instead of just what the agent needs for reasoning
- **Detection Rule:** If average context size >50K tokens or observation storage >1MB/day, you have schema bloat
- **Fix:** Audit schemas every month. Remove fields that haven't influenced a decision in 30 days. Use summarization over raw storage.

**Retrieval Thrashing**
- **Symptoms:** Agent mentions outdated info, misses recent context, or retrieves irrelevant memories repeatedly
- **Root Cause:** Single-pass vector search without reranking, or temporal/semantic weights badly tuned
- **Detection Rule:** If >30% of retrieved context goes unused in responses, or user corrects agent about recent events
- **Fix:** Implement two-stage retrieval (broad search + rerank). A/B test different temporal/semantic weight ratios.

**Trigger Spam**
- **Symptoms:** User disables agent notifications, complains about interruptions, or agent gets ignored
- **Root Cause:** No urgency tiering, or thresholds set too low for active/interrupt triggers
- **Detection Rule:** If user dismisses >50% of active notifications, or avg time between user engagement >4 hours
- **Fix:** Default everything to silent. Let user explicitly configure what deserves active notification. Track dismissal rates.

**Context Staleness**
- **Symptoms:** Agent acts on outdated information, misses that user changed focus/projects
- **Root Cause:** No freshness decay on context, or retrieval weights don't factor in recency enough
- **Detection Rule:** If agent references info >7 days old when recent context exists, or mentions completed projects
- **Fix:** Add exponential decay to relevance scores. Weight recent observations 2-3x higher than archival.

**Ambient Noise Flooding**
- **Symptoms:** High costs, poor response quality, agent mentions irrelevant screen context
- **Root Cause:** Raw ambient data bypasses filtering, or relevance gates set too permissive
- **Detection Rule:** If ambient observations make up >30% of stored memories, or token costs >$10/day
- **Fix:** Tighten relevance scoring. Batch ambient observations in 5-minute windows. Require 2+ signals to confirm relevance.

---

## WORKED EXAMPLES

**Scenario: Billing Bug Investigation with Token Budget Constraints**

User reports: "The billing calculation is wrong for enterprise customers."

**Step 1: Context Budget Allocation (40K total)**
```
System + Identity: 4K tokens (fixed)
Core Memory: 2K tokens (user preferences, active projects)
DECISION: Problem-solving task → use relevance-first retrieval
Allocated: 8K archival + 4K recall + 2K ambient + 15K conversation + 5K output buffer
```

**Step 2: Retrieval Strategy Execution**
```python
# Broad semantic search for billing-related memories
archival_candidates = vector_search(
    query="billing calculation enterprise customer error bug",
    top_k=20,
    filters={"project": ["billing", "payments"]}
)

# Rerank by true relevance (not just embedding similarity)
reranked = rerank_results(archival_candidates, query, top_k=5)
# Result: Gets "enterprise discount logic bug from 3 weeks ago" 
# that pure vector search ranked #12

# Temporal search for recent billing work
recent_work = temporal_search(
    time_range="last_7_days",
    entity_filters=["billing", "enterprise"],
    max_results=3
)
# Result: User was debugging pricing tiers yesterday
```

**Step 3: Ambient Context Integration**
```python
# Check what user is currently doing
screen_summary = get_ambient_summary(last_30_minutes)
# Result: "User has billing_calculator.py open, looking at 
# calculate_enterprise_discount() function"

# Budget check: 8K archival + 4K recent + 2K ambient = 14K (under budget)
```

**Step 4: Fast vs Complete Trade-off**
Agent has two options:
- **Fast retrieval (current):** 14K context, focuses on recent bug patterns
- **Complete context:** Add git history, related PR discussions (+8K tokens, exceeds budget)

**Decision:** Stay with fast retrieval for initial response. If user asks for deeper investigation, trigger a follow-up with expanded context budget.

**Agent Response Quality:**
- **Novice approach:** Would dump all billing-related context, exceed budget, get confused response
- **Expert approach:** Curated 14K of most relevant context, mentions the specific enterprise discount bug from 3 weeks ago that vector search alone would have missed, stays under budget

---

## QUALITY GATES

- [ ] Context window allocation explicitly budgeted across tiers (system/core/retrieved/conversation)
- [ ] Total per-request token count averages <40K for routine interactions
- [ ] Ambient observations filtered through relevance pipeline before storage
- [ ] Retrieval uses two-stage process (broad search + reranking)
- [ ] All triggers categorized by urgency (silent/badge/passive/active/interrupt)
- [ ] Observation schemas include timestamp, confidence score, and source
- [ ] Filter pipeline tested: <30% of retrieved context goes unused in responses
- [ ] User dismisses <20% of active notifications (trigger spam check)
- [ ] Agent references recent info (last 24h) when available vs defaulting to archival
- [ ] Storage growth rate <100MB/week per user (efficiency check)

---

## NOT-FOR BOUNDARIES

**Use /always-on-agent-inputs for:**
- Deciding what data to capture from user environment
- Structuring triggers and observation schemas
- Context window budgeting and retrieval strategy selection
- Filtering ambient data before it reaches the agent

**Do NOT use for:**
- **Memory architecture design** (vector stores, databases, memory tiers) → use `/always-on-agent-architecture`
- **Application and use case ideation** → use `/always-on-agent-applications`
- **Privacy and safety of captured data** → use `/always-on-agent-safety`
- **General prompt engineering techniques** → use `/prompt-engineer`
- **Agent reasoning patterns** → use `/agentic-patterns`