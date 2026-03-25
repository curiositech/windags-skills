---
license: BSL-1.1
name: windags-architect
description: Architecture skill for building winDAGs.ai — a system that solves arbitrary problems with DAGs of skillful agents. Covers local execution, web service deployment, meta-DAGs (DAGs creating DAGs), dynamic DAG mutation during execution, human-in-the-loop control structures, and real-time DAG visualization. Activate on "windags", "agent DAG", "DAG of agents", "workflow orchestration", "agent pipeline", "dynamic DAG", "meta-DAG". NOT for single-agent prompting, skill creation (use skill-architect), or static diagram rendering (use mermaid-graph-renderer).
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
argument-hint: '[problem-description] [mode: local|web|embedded]'
metadata:
  tags:
    - windags
    - architect
    - agent-dag
    - dag-of-agents
category: Agent & Orchestration
tags:
  - windags
  - architecture
  - v1
  - platform
  - design
---

# winDAGs Architect

Architecture skill for building winDAGs.ai — a system that solves arbitrary problems with directed acyclic graphs of skillful agents.

## DECISION POINTS

### 1. DAG Topology Selection
```
Input: Problem dependencies and latency requirements
│
├─ Dependency Analysis
│  ├─ Sequential dependencies? → Linear chain topology
│  ├─ Independent subtasks? → Parallel fan-out topology
│  └─ Complex interdependencies? → Diamond/mesh topology
│
└─ Latency Constraints
   ├─ Real-time requirement (<5s)? → Maximum parallelism + Haiku routing
   ├─ Budget-optimized? → Sequential execution + tier cascade
   └─ Quality-first? → Parallel validation nodes + Sonnet/Opus
```

### 2. Execution Mode Selection
```
Input: Resource constraints and deployment context
│
├─ Local execution?
│  ├─ Single machine + I/O bound → asyncio/Promise.all
│  ├─ Single machine + CPU bound → multiprocess
│  └─ Security isolation needed → Docker containers
│
└─ Distributed execution?
   ├─ Team collaboration → Web service + worker pool
   ├─ Scale requirements → Temporal + horizontal workers
   └─ Development/testing → Local with web dashboard
```

### 3. Failure Recovery Strategy
```
Input: Node failure type and DAG state
│
├─ Transient failure (timeout/rate limit)?
│  ├─ Retry budget remaining? → Exponential backoff retry
│  └─ Retry exhausted? → Downgrade to cheaper model
│
├─ Quality failure (output below threshold)?
│  ├─ Downstream nodes not started? → Mutate: replace node skills
│  └─ Downstream dependencies? → Mutate: insert validation node
│
└─ Systemic failure (multiple nodes failing)?
   ├─ Cost budget exceeded? → Escalate to human review
   └─ Template DAG issue? → Switch to meta-DAG generation
```

### 4. Model Routing Per Node
```
Input: Node task type and cost budget
│
├─ Task Classification
│  ├─ Simple formatting/validation? → Haiku tier ($0.001)
│  ├─ Complex reasoning/creation? → Sonnet tier ($0.015)
│  └─ Expert-level synthesis? → Opus tier ($0.075)
│
└─ Budget Allocation
   ├─ >80% budget remaining? → Use optimal tier
   ├─ 20-80% budget remaining? → Tier cascade (try cheap first)
   └─ <20% budget remaining? → Force cheap tier + quality gates
```

### 5. Human-in-the-Loop Integration
```
Input: Node output quality and approval requirements
│
├─ Quality Gate Results
│  ├─ Auto-approve score >0.8? → Continue execution
│  ├─ Uncertain score 0.5-0.8? → Human review with options
│  └─ Failure score <0.5? → Block execution, require human fix
│
└─ Human Review Outcomes
   ├─ Approve? → Continue to next nodes
   ├─ Reject? → Loop back to revision node
   ├─ Modify? → Human edit + agent integration node
   └─ Escalate? → Switch to full human workflow
```

## FAILURE MODES

### 1. Deadlock Detection ("Circular Wait")
**Symptoms**: DAG execution hangs indefinitely, nodes showing "waiting for dependencies"  
**Detection Rule**: If any node waits >5 minutes with all dependencies still "pending", check for cycles  
**Root Cause**: Invalid edge in DAG created dependency loop despite topological validation  
**Recovery**: Remove youngest edge in detected cycle, re-validate DAG, restart execution

### 2. Orphaned Nodes ("Floating Islands")
**Symptoms**: Some nodes never execute despite DAG completion, showing "pending" status permanently  
**Detection Rule**: If DAG reports "complete" but any nodes remain in "pending" state  
**Root Cause**: Edge removal during mutation disconnected nodes from execution flow  
**Recovery**: Auto-connect orphaned nodes to nearest completed node by semantic similarity, or human review for critical nodes

### 3. Cost Overrun Mid-Execution ("Budget Explosion")
**Symptoms**: Execution halts with "budget exceeded" before DAG completion  
**Detection Rule**: If total cost >1.5x projected budget before 80% of nodes complete  
**Root Cause**: Model routing failed, expensive nodes used cheap model budgets, or scope creep in node outputs  
**Recovery**: Switch all remaining nodes to cheapest tier, add quality validation nodes, continue with reduced expectations

### 4. Schema Drift ("Contract Violation")  
**Symptoms**: Node fails with "input validation error" despite predecessor claiming success  
**Detection Rule**: If node input doesn't match expected schema after successful predecessor execution  
**Root Cause**: Dynamic mutation changed node expectations, or predecessor output format evolved  
**Recovery**: Insert schema adapter node between mismatched nodes, or rollback to last valid DAG state

### 5. Human Gate Abandonment ("Review Timeout")
**Symptoms**: DAG stuck at human-in-the-loop node for >24 hours without response  
**Detection Rule**: If human review node shows "awaiting input" for >configured timeout  
**Root Cause**: Human reviewer unavailable, unclear review instructions, or overwhelming review complexity  
**Recovery**: Auto-approve with confidence score, escalate to backup reviewer, or degrade to automated quality gates

## WORKED EXAMPLES

### Example: "Build a Portfolio Website"

**Problem Input**: "I need a beautiful portfolio website for my design work. Make it modern and showcase my projects well."

**Step 1: Topology Decision**
- Dependencies: Need content before design, design before implementation
- Latency: Not time-critical, quality-first approach
- **Decision**: Diamond topology with parallel content/research → converge for design → implementation

**Step 2: DAG Generation**
```
interview-user (get preferences, existing assets)
    ├── research-trends (design inspiration)
    └── write-content (project descriptions, bio)
        ↓
design-mockup (combines research + content)
    ↓
build-website (implement design)
    ↓
deploy-live (hosting setup)
    ↓
human-review (final approval gate)
```

**Step 3: Model Routing Decisions**
- interview-user: Sonnet (complex human interaction)
- research-trends: Haiku (web scraping + summarization)  
- write-content: Sonnet (creative writing)
- design-mockup: Opus (visual design expertise)
- build-website: Sonnet (complex code generation)
- deploy-live: Haiku (simple script execution)

**Step 4: Execution with Mutation**
- Nodes 1-3 complete successfully
- design-mockup produces generic output (quality score 0.4)
- **Mutation triggered**: Insert "analyze-portfolio-examples" node before design-mockup
- Re-run design-mockup with better context → quality score 0.8
- Continue execution to completion

**What novice would miss**: Using Opus for research-trends (3x cost overrun), no quality gates (accepting poor design), linear topology (missing parallelization opportunity)

**What expert catches**: Parallel content/research saves 2 minutes execution time, quality gate prevents poor design propagating downstream, cost-aware model routing saves $0.12 (60% cost reduction)

## QUALITY GATES

Pre-execution validation checklist:

- [ ] DAG topology is acyclic (topological sort succeeds)
- [ ] All node input/output schemas are compatible with connected edges
- [ ] Total projected cost is within specified budget (±20% margin)
- [ ] All required skills are available in the skill library
- [ ] Model routing assignments respect capability requirements
- [ ] Human review nodes have configured timeouts and escalation paths
- [ ] Critical path analysis shows reasonable completion time estimate
- [ ] Resource requirements (tokens, memory) are within platform limits

Post-execution validation checklist:

- [ ] All leaf nodes completed successfully or with acceptable quality scores
- [ ] Total execution cost is within 150% of projected budget
- [ ] No nodes remain in "pending" or "running" states
- [ ] All human gates were resolved within configured timeouts
- [ ] Generated artifacts match expected output schemas
- [ ] End-to-end execution time is reasonable for problem complexity

## NOT-FOR BOUNDARIES

**This skill should NOT be used for**:

- **Single-agent prompting**: If the problem can be solved with one agent call, don't create a DAG. Use direct agent interaction instead.
- **Static workflow documentation**: For documenting existing processes without execution, use `mermaid-graph-renderer` instead.
- **Individual skill creation**: For building new skills, use `skill-architect` instead.
- **Simple linear task chains**: If tasks are strictly sequential with no parallelization opportunities, use basic agent chaining.
- **Real-time streaming responses**: DAGs add latency overhead. For conversational AI, use streaming single agents.

**Delegate to other skills when**:

- For skill creation → use `skill-architect`  
- For subagent creation → use `skillful-subagent-creator`
- For static diagrams → use `mermaid-graph-renderer`
- For simple automation → use appropriate task-specific skills
- For conversational AI → use direct agent interaction