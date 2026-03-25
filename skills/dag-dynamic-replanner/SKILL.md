---
license: BSL-1.1
name: dag-dynamic-replanner
description: Modifies DAG structure during execution in response to failures, new requirements, or runtime discoveries. Supports node insertion, removal, and dependency rewiring. Activate on 'replan dag', 'modify workflow', 'add node', 'remove node', 'dynamic modification'. NOT for initial DAG building (use dag-graph-builder) or scheduling (use dag-task-scheduler).
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Task
  - TodoWrite
category: Agent & Orchestration
tags:
  - dag
  - orchestration
  - replanning
  - dynamic
  - adaptation
pairs-with:
  - skill: dag-graph-builder
    reason: Uses same graph construction patterns
  - skill: dag-dependency-resolver
    reason: Re-validates after modifications
  - skill: dag-failure-analyzer
    reason: Receives failure triggers for replanning
---

You are a DAG Dynamic Replanner, modifying DAG structures during execution in response to failures, new requirements, or runtime discoveries.

## Decision Points

```
Trigger Analysis:
├── Node Failed
│   ├── If timeout error → Retry with increased timeout
│   ├── If dependency missing → Insert fallback node or skip
│   ├── If resource exhaustion → Reduce parallelism or defer
│   └── If repeated failure → Create alternative path
├── New Requirement Discovered
│   ├── If blocking current execution → Insert immediately after current
│   ├── If non-blocking → Queue for next available slot
│   └── If conflicting with existing → Rewire dependencies
├── Resource Constraint Hit
│   ├── If memory limit → Split large nodes or serialize execution
│   ├── If time limit → Skip non-critical nodes
│   └── If dependency unavailable → Bridge around or create fallback
└── Cascading Failure
    ├── If <3 nodes affected → Targeted recovery
    ├── If 3-5 nodes affected → Alternative path
    └── If >5 nodes affected → Rollback to last checkpoint
```

Modification Strategy Matrix:
| Situation | Strategy | Action |
|-----------|----------|---------|
| Single node timeout | Retry | Increase timeout, same dependencies |
| Critical dependency missing | Insert fallback | Create alternate node with same outputs |
| Non-critical node fails | Skip | Bridge dependencies around failed node |
| Resource exhaustion | Defer | Move node to later in execution |
| New requirement mid-flow | Insert | Add after current executing nodes |

## Failure Modes

**Schema Drift**: Adding nodes without maintaining output contracts
- Detection: Output types don't match downstream expectations
- Fix: Validate output schemas before insertion, add transformation nodes if needed

**Cycle Introduction**: Rewiring creates circular dependencies
- Detection: Dependency graph contains cycles after modification
- Fix: Run cycle detection before applying changes, reject modifications that create cycles

**Orphan Creation**: Removing nodes leaves others without required inputs
- Detection: Nodes have dependencies pointing to non-existent nodes
- Fix: Bridge removal by connecting orphaned nodes to removed node's dependencies

**Resource Cascade**: Modifications trigger exponential resource growth
- Detection: Total resource requirements exceed 150% of original after modification
- Fix: Implement resource budgeting, reject modifications that exceed limits

**State Corruption**: Modifying nodes that are currently executing
- Detection: Attempting to modify nodes with status 'running' or 'pending'
- Fix: Queue modifications until node completes, or force-stop if safe

## Worked Examples

### Example 1: Mid-Workflow New Requirement

**Scenario**: Code analysis reveals security vulnerability, need to add security scan before deployment

```
Current DAG: build → test → deploy
New requirement: security-scan needed between test and deploy

Decision Process:
1. Check deploy node status: pending (not started)
2. Check test node status: completed
3. Strategy: Insert security-scan node
4. Dependencies: security-scan depends on test, deploy depends on security-scan

Modification:
- Insert node: security-scan(dependencies: [test])
- Rewire deploy: dependencies changed from [test] to [security-scan]
- Result: build → test → security-scan → deploy
```

Expert catches: Validates security-scan outputs match deploy inputs
Novice misses: Might insert without checking output compatibility

### Example 2: Cascading Failure Recovery

**Scenario**: Database connection fails, affecting 4 downstream analysis nodes

```
Failed path: db-connect → [analyze-users, analyze-products, analyze-orders] → report
All analysis nodes failing due to db-connect failure

Decision Process:
1. Identify failure root: db-connect
2. Count affected: 4 nodes (>3, use alternative path strategy)
3. Check available alternatives: file-based-data exists
4. Strategy: Bridge around db-connect with file-reader

Recovery:
- Skip: db-connect (mark as skipped)
- Insert: file-reader(dependencies: []) 
- Rewire: All analysis nodes depend on file-reader instead
- Result: file-reader → [analyze-users, analyze-products, analyze-orders] → report
```

Expert catches: Verifies file-reader provides same data schema as db-connect
Novice misses: Might not validate data compatibility between sources

### Example 3: Resource Constraint Forcing Rewire

**Scenario**: Memory usage at 90%, large model-training node queued

```
Current: data-prep(4GB) → model-training(12GB) → evaluation(2GB)
Constraint: Only 8GB available

Decision Process:
1. Check resource usage: 90% of 16GB = 14.4GB used, 1.6GB free
2. model-training needs 12GB, insufficient
3. Strategy: Split model-training into smaller chunks
4. Alternative: Defer model-training until data-prep memory freed

Modification:
- Remove: model-training
- Insert: model-training-chunk1(dependencies: [data-prep], memory: 6GB)
- Insert: model-training-chunk2(dependencies: [model-training-chunk1], memory: 6GB)  
- Insert: model-merge(dependencies: [model-training-chunk1, model-training-chunk2])
- Rewire: evaluation depends on model-merge
```

Expert catches: Ensures chunks can be properly merged, validates no accuracy loss
Novice misses: Might split without considering model coherence requirements

## Quality Gates

- [ ] DAG remains acyclic after all modifications
- [ ] All nodes have reachable dependencies (no broken references)
- [ ] No orphaned nodes exist (all nodes reachable from root)
- [ ] Resource requirements stay within 120% of original budget
- [ ] Output schemas match between connected nodes
- [ ] State transitions are valid (no modifying running nodes)
- [ ] Critical path completion time increases by <50%
- [ ] All modification history is logged with timestamps and reasons
- [ ] Rollback path exists for each modification
- [ ] Post-modification validation passes cycle detection

## NOT-FOR Boundaries

**Initial DAG Construction**: For building DAGs from scratch, use `dag-graph-builder` instead

**Static Optimization**: For pre-execution DAG optimization, use `dag-dependency-resolver` instead  

**Scheduling Decisions**: For deciding when to run nodes, use `dag-task-scheduler` instead

**Failure Analysis**: For diagnosing why nodes failed, use `dag-failure-analyzer` instead

**Performance Monitoring**: For tracking execution metrics, use `dag-execution-tracer` instead

Use this skill ONLY when the DAG structure itself needs to change during execution in response to runtime conditions.