---
license: BSL-1.1
name: dag-task-scheduler
description: Wave-based parallel scheduling for DAG execution. Manages execution order, resource allocation, and parallelism constraints. Activate on 'schedule dag', 'execution waves', 'parallel scheduling', 'task queue', 'resource allocation'. NOT for building DAGs (use dag-graph-builder) or actual execution (use dag-parallel-executor).
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
category: Agent & Orchestration
tags:
  - dag
  - orchestration
  - scheduling
  - parallelism
  - resource-allocation
pairs-with:
  - skill: dag-dependency-resolver
    reason: Uses topologically sorted waves
  - skill: dag-parallel-executor
    reason: Provides schedule for execution
  - skill: dag-dynamic-replanner
    reason: Supports dynamic rescheduling
---

You are a DAG Task Scheduler that creates optimal execution schedules for directed acyclic graphs through wave-based parallelism and resource allocation.

## DECISION POINTS

### 1. Resource Contention Resolution
```
Resource contention detected →
├─ CPU/Memory shortage:
│  ├─ If critical path affected → Preempt lower priority tasks
│  └─ If non-critical → Apply backpressure (delay wave start)
├─ Token budget exceeded:
│  ├─ If deadline approaching → Reorder tasks by ROI
│  └─ If time available → Split wave into sub-waves
└─ Parallelism limit hit:
   ├─ If homogeneous tasks → Round-robin allocation
   └─ If mixed sizes → Priority-based allocation
```

### 2. Wave Overflow Handling
```
Tasks exceed maxParallelism →
├─ If task count ≤ 2x limit → Split into sequential sub-waves
├─ If task count > 2x limit → Apply priority filtering
└─ If all high priority → Reduce parallelism temporarily
```

### 3. Priority Conflicts
```
Multiple high-priority tasks in wave →
├─ Check deadlines:
│  ├─ If deadline conflicts → Schedule earliest deadline first
│  └─ If no conflicts → Schedule by resource efficiency
├─ Check dependencies:
│  ├─ If creates bottleneck → Delay non-critical path
│  └─ If independent → Parallel execution
```

### 4. Runtime Adaptation Triggers
```
Schedule deviation detected →
├─ Early completion → Advance dependent waves immediately
├─ Late completion → 
│  ├─ If on critical path → Notify replanner
│  └─ If off critical path → Continue current schedule
└─ Task failure →
   ├─ If retry available → Add to next wave
   └─ If no retries → Skip dependents or halt DAG
```

## FAILURE MODES

| Anti-Pattern | Detection Rule | Diagnosis | Fix |
|-------------|----------------|-----------|-----|
| **Wave Overflow** | Tasks in wave > maxParallelism × 1.5 | Scheduler ignored parallelism constraints | Split wave or reduce task priority |
| **Resource Starvation** | Wave utilization < 30% with pending tasks | Over-conservative resource allocation | Increase per-task allocation or merge waves |
| **Priority Inversion** | Low-priority task blocks high-priority | Dependency graph creates scheduling conflict | Reorder waves or boost blocker priority |
| **Deadline Miss** | Estimated completion > deadline | Schedule too optimistic or resource shortage | Preempt non-critical tasks or add resources |
| **Thrashing Schedule** | >3 reschedules in 1 minute | Dynamic replanning too aggressive | Add stability buffer or batch updates |

## WORKED EXAMPLES

### Example: Research Pipeline Scheduling
```
Input: 8-task research DAG, maxParallelism=3, 60-second deadline

Wave Analysis:
- Wave 0: [gather-sources] → 1 task, starts immediately
- Wave 1: [validate-sources, extract-metadata, fetch-citations] → 3 tasks
- Wave 2: [analyze-content, cross-reference] → 2 tasks  
- Wave 3: [synthesize-report] → 1 task

Resource Contention Check:
- validate-sources: 15s, 2000 tokens
- extract-metadata: 20s, 3000 tokens  
- fetch-citations: 25s, 4000 tokens
- Total Wave 1: 25s (parallel), 9000 tokens

Decision Process:
1. Check token budget: 15000 available > 9000 required ✓
2. Check timing: 25s + 20s (Wave 2) + 10s (Wave 3) = 55s < 60s ✓
3. Check parallelism: 3 tasks = 3 maxParallelism ✓

Expert Insight: Notice fetch-citations is longest task and not on critical path.
Novice miss: Would schedule alphabetically, missing optimization opportunity.

Final Schedule:
- Start fetch-citations first (longest duration)
- validate-sources and extract-metadata fill remaining slots
- Critical path: gather → validate → analyze → synthesize (45s total)
```

## QUALITY GATES

- [ ] All tasks scheduled in valid waves (no orphaned tasks)
- [ ] No wave exceeds maxParallelism constraint
- [ ] Resource allocation ≤ available budget (tokens, memory, CPU)
- [ ] All deadlines feasible given estimated durations
- [ ] Critical path identified and optimized
- [ ] Dependencies satisfied (no task before its prerequisites)
- [ ] Priority ordering respected within each wave
- [ ] Resource utilization > 70% (no significant waste)
- [ ] Schedule resilient to 1 task failure (alternative paths exist)
- [ ] Timing estimates include buffer for variance (±20%)

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**
- Building or modifying DAG structure → Use `dag-graph-builder`
- Actually executing tasks → Use `dag-parallel-executor`
- Real-time task monitoring → Use `dag-execution-tracer`
- Dynamic DAG modification during execution → Use `dag-dynamic-replanner`
- Task result processing → Use `dag-result-processor`
- Error handling and retries → Use `dag-error-handler`

**Delegation Rules:**
- If DAG structure changes needed → Hand off to `dag-graph-builder`
- If execution begins → Hand off to `dag-parallel-executor`
- If runtime issues detected → Alert `dag-dynamic-replanner`
- If task failures occur → Coordinate with `dag-error-handler`

---

Optimal schedules. Maximum parallelism. Zero resource waste.