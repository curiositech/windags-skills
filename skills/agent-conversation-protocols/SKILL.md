---
license: Apache-2.0
name: agent-conversation-protocols
description: |
  Conversation patterns and interaction protocols for multi-agent systems. Covers request/response, pub/sub, blackboard, delegation chains, debate, critique, consensus, fan-out/fan-in, supervisor-worker, and peer negotiation. Deep analysis of AutoGen conversation patterns, CrewAI delegation, LangGraph state passing, and FIPA-ACL performatives. Teaches how to design what agents say to each other and in what order. Activate on: "agent conversation", "agent protocol", "multi-agent debate", "agent delegation", "supervisor worker pattern", "agent voting", "consensus protocol", "fan-out fan-in", "agent negotiation", "blackboard pattern", "agent dialogue", "conversation topology", "agent handoff". NOT for: wire format or serialization (use agent-interchange-formats), orchestration infrastructure (use agentic-infrastructure-2026), single agent behavior (use agentic-patterns).
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
    - agents
    - protocols
    - conversation
    - delegation
    - debate
    - consensus
    - multi-agent
    - orchestration
  pairs-with:
    - skill: agent-interchange-formats
      reason: Interchange formats define the wire; this skill defines the dialogue
    - skill: multi-agent-coordination
      reason: Coordination is the topology; conversation is what flows through it
    - skill: agentic-infrastructure-2026
      reason: Framework choice constrains available conversation patterns
    - skill: agentic-patterns
      reason: Single-agent patterns compose into multi-agent conversations
category: Agent & Orchestration
tags:
  - agent
  - conversation
  - protocols
  - ai
  - orchestration
  - design
---

# Agent Conversation Protocols

You are an expert in multi-agent conversation design. You understand how agents talk to each other -- the message types, turn-taking rules, delegation patterns, and conflict resolution mechanisms that make multi-agent systems coherent rather than chaotic.

## DECISION POINTS

### Primary Pattern Selection Tree

```
Given problem characteristics:

├── Task is decomposable into independent subtasks?
│   ├── YES + Quality matters more than speed
│   │   └── Use FAN-OUT/FAN-IN with redundant execution (3+ agents same task)
│   ├── YES + Speed matters more than quality  
│   │   └── Use FAN-OUT/FAN-IN with partitioned execution (divide work)
│   └── NO + Task requires sequential dependencies
│       └── Use SUPERVISOR-WORKER with delegation chains
│
├── Multiple valid approaches exist?
│   ├── YES + Verifiable ground truth exists
│   │   └── Use DEBATE (adversarial refinement with judge)
│   ├── YES + Subjective preference decision
│   │   └── Use VOTING/CONSENSUS (democratic selection)
│   └── NO + Single approach but needs refinement
│       └── Use CRITIQUE-REFINE (iterative improvement)
│
├── Knowledge synthesis from diverse sources?
│   └── Use BLACKBOARD (shared state accumulation)
│
└── Simple capability delegation?
    └── Use REQUEST/RESPONSE (synchronous handoff)
```

### Topology × Initiative × Turn Order Decision Matrix

| Topology | Initiative | Turn Order | Use When | Example |
|----------|------------|------------|----------|---------|
| Star | Push | Round-robin | Clear leader coordinates work | CrewAI hierarchical process |
| Star | Pull | Priority-queue | Workers request tasks when ready | AutoGen GroupChat with manager |
| Mesh | Push | Free-form | Peer collaboration, no bottlenecks | Multi-agent debate |
| Tree | Push | Depth-first | Hierarchical decomposition | Complex delegation chains |
| Broadcast | Reactive | Event-driven | Knowledge sharing, updates | LangGraph state updates |

### Termination Condition Selection

```
If conversation type is:
├── DEBATE → Stop when judge_confidence > 0.8 OR rounds >= 3
├── CRITIQUE → Stop when verdict == 'approve' OR iterations >= 4  
├── VOTING → Stop when all votes collected OR timeout
├── FAN-OUT → Stop when gather_policy satisfied (all/majority/first)
├── SUPERVISOR → Stop when all subtasks complete OR budget exceeded
└── BLACKBOARD → Stop when goal_condition met OR staleness detected
```

## FAILURE MODES

### 1. Delegation Ping-Pong
**Detection:** Agent A delegates to B, B delegates back to A, creating infinite loops
**Symptoms:** Exponentially growing message counts, same tasks repeated endlessly
**Root Cause:** No cycle detection in delegation chains, workers can delegate upward
**Fix:** Implement delegation constraints with chain tracking and upward delegation blocks

### 2. Sycophancy Collapse  
**Detection:** In debates, all agents converge to same position by round 2 regardless of evidence
**Symptoms:** No position changes after initial round, unanimous agreement on complex topics
**Root Cause:** Agents optimize for agreement rather than truth-seeking
**Fix:** Assign explicit adversarial roles, require agents to defend assigned perspectives

### 3. Supervisor Bottleneck
**Detection:** All coordination flows through single supervisor, high latency on parallel tasks
**Symptoms:** Workers idle waiting for supervisor responses, linear scaling on parallelizable work
**Root Cause:** Supervisor acts as message router instead of synthesizer
**Fix:** Restructure as fan-out/fan-in or enable direct worker-to-worker communication

### 4. Blackboard State Explosion
**Detection:** Shared state grows unbounded, agents waste tokens reading irrelevant entries
**Symptoms:** Query response times increasing over time, high token usage on reads
**Root Cause:** No garbage collection or relevance filtering on blackboard entries
**Fix:** Implement confidence-based expiration and semantic filtering on reads

### 5. Context Degradation Cascade
**Detection:** Deep delegation chains (>3 levels) lose essential context at each hop
**Symptoms:** Workers ask clarifying questions, output quality decreases with chain depth
**Root Cause:** Context compression artifacts compound across delegation hops
**Fix:** Flatten hierarchy to max 2 levels or pass full context to all workers

## WORKED EXAMPLES

### Example 1: Code Review System Design

**Problem:** Design conversation protocol for 4-agent code review (author, security reviewer, performance reviewer, style reviewer)

**Decision Process:**
1. **Pattern Selection:** Quality-critical output → CRITIQUE-REFINE + multiple perspectives → DEBATE hybrid
2. **Topology Analysis:** 4 reviewers need to see same code → Star topology with author as hub
3. **Turn Order:** Security must run first (blocks), then performance and style in parallel

**Chosen Protocol:**
```
Phase 1: Author submits initial code (REQUEST/RESPONSE)
Phase 2: Security review (CRITIQUE-REFINE, blocking)
Phase 3: Performance + Style reviews (FAN-OUT/FAN-IN, parallel)  
Phase 4: Conflict resolution if issues overlap (DEBATE)
Phase 5: Author incorporates feedback (CRITIQUE-REFINE)
```

**Pattern Trade Matrix:**
- Pure CRITIQUE chain: Too slow (sequential reviews)
- Pure DEBATE: Security issues get debated away by majority
- Pure FAN-OUT: No blocking for security failures
- Hybrid: Security first, then parallel, then resolve conflicts

### Example 2: Research Paper Writing

**Problem:** 3 agents (researcher, writer, fact-checker) produce literature review

**Decision Process:**
1. **Initiative Type:** Pull-based (agents work when ready) vs Push-based (coordinator assigns)
2. **Quality vs Speed:** Quality critical → redundancy needed
3. **Decomposition:** Topic can be partitioned by research area

**Chosen Protocol:**
```
researcher: Partitioned FAN-OUT across research areas
fact-checker: CRITIQUE-REFINE on each section  
writer: SUPERVISOR role synthesizing all inputs
```

**Why not alternatives:**
- All agents in single DEBATE: No clear roles, writer expertise wasted on fact-checking
- Sequential REQUEST/RESPONSE chain: Too slow, no parallel research
- Pure BLACKBOARD: No synthesis, just knowledge accumulation

**Termination Logic:**
```
Stop when:
- All research areas covered (completeness check)
- Fact-checker confidence > 0.85 on all sections
- Writer produces coherent synthesis
- Total tokens < budget OR time < deadline
```

### Example 3: Dynamic Routing Decision

**Problem:** During execution, supervisor realizes 3 workers are overwhelmed, 1 worker is idle

**Real-time Decision Tree:**
```
Current state: 3 workers at 90% capacity, 1 worker at 10%
Options:
1. Rebalance work (migrate tasks to idle worker)
2. Add redundancy (parallel execution on critical path)  
3. Change topology (switch from star to mesh for peer delegation)

Decision factors:
├── Time remaining? < 25% → Option 2 (parallel, accept higher cost)
├── Budget remaining? < 50% → Option 1 (rebalance, optimize cost)  
└── Task dependencies? High coupling → Option 3 (mesh topology)
```

**Execution:** Supervisor detects state, broadcasts topology change message, workers update their delegation rules, work continues with new pattern

## QUALITY GATES

- [ ] **Termination Policy Defined:** Every conversation has explicit max messages, time, and cost limits
- [ ] **Cycle Detection Active:** Delegation chains track agent history and prevent A→B→A loops  
- [ ] **Confidence Scores Present:** All outputs include agent confidence (0.0-1.0) for quality assessment
- [ ] **Progress Reporting Wired:** Long-running tasks send periodic heartbeat messages to coordinator
- [ ] **Context Handoff Validated:** Each delegation includes token estimates and identifies droppable context sections
- [ ] **Error Propagation Designed:** System handles single agent failures without total conversation collapse
- [ ] **Gather Policy Explicit:** Fan-out operations specify wait conditions (all/majority/first/quorum)
- [ ] **Role Diversity Enforced:** Debate protocols assign distinct perspectives, not generic "discuss this topic"
- [ ] **State Expiration Configured:** Blackboard entries have TTL or confidence thresholds for automatic cleanup
- [ ] **Topology Matches Task:** Conversation structure aligns with problem decomposition (see decision tree)

## NOT-FOR BOUNDARIES

**This skill covers conversation design, NOT:**

- **Serialization formats** (JSON schemas, message encoding) → Use `agent-interchange-formats`
- **Infrastructure setup** (message queues, service discovery) → Use `agentic-infrastructure-2026`  
- **Single-agent tool usage** (function calling, chain-of-thought) → Use `agentic-patterns`
- **Memory persistence** (vector stores, episodic recall) → Use `episodic-memory-algorithms`
- **Framework selection** (AutoGen vs LangGraph vs CrewAI) → Use `agentic-infrastructure-2026`

**Delegate to other skills when you encounter:**
- Wire protocol design → `agent-interchange-formats`
- Performance optimization → `agentic-infrastructure-2026`
- Individual agent reasoning → `agentic-patterns`
- Long-term memory → `episodic-memory-algorithms`
- Tool integration → `agentic-patterns`