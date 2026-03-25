---
license: Apache-2.0
name: dag-chain-decomposition
description: Algorithms for decomposing DAGs into chains for parallel execution and resource optimization
category: Agent & Orchestration
tags:
  - dag
  - chain-decomposition
  - graph-theory
  - task-decomposition
  - algorithms
---

# SKILL.md: DAG Chain Decomposition for Parallel Execution

## When to Use This Skill

Load this skill when you encounter dependency networks that require optimal parallel execution with minimal coordination overhead. Key triggers:
- Task decomposition with ordering constraints but parallelizable components
- Multi-agent coordination where agent count impacts efficiency
- Resource allocation under dependencies
- Workflow optimization with inherent parallelism

## DECISION POINTS

### 1. Decomposition Strategy Selection
```
IF problem has clear topological levels (stratifiable)
  AND width ≤ √n
  THEN use Chen's stratification algorithm
    → Stratify into levels V₁, V₂, ..., Vₕ
    → Apply maximum matching between adjacent levels

ELSE IF width >> √n (width-dominated problem)
  THEN accept minimal compression possible
    → Create b chains (one per antichain element)
    → Focus on efficient chain management, not decomposition

ELSE IF dependencies are tangled (no clear levels)
  THEN question dependency model validity
    → Look for missing abstractions
    → Consider alternative graph representations
```

### 2. Virtual Node vs. Immediate Assignment
```
IF task cannot be assigned to existing chains
  AND remaining depth ≥ 3 levels
  AND assignment would violate dependencies
  THEN create virtual node for deferred resolution
    → Propagate virtual node to next level
    → Resolve in second phase with full context

ELSE IF remaining depth < 3 levels
  THEN create new chain immediately
    → Overhead of deferred resolution exceeds benefit
```

### 3. Resource Allocation Strategy
```
WHEN assigning level Vᵢ to existing chains
  FIRST formulate bipartite matching:
    - Left: tasks in Vᵢ needing assignment
    - Right: existing chains from previous levels
    - Edges: assignments that preserve dependencies
  
  IF maximum matching covers all tasks
    THEN assign per matching (no new chains needed)
  
  ELSE unmatched tasks each spawn new chain
    → This minimizes total chain count
    → Provably optimal by maximum matching theory
```

### 4. Width Measurement and Validation
```
TO measure problem width (coordination lower bound):
  1. Identify all mutually incomparable elements (antichain)
  2. Find maximum antichain size = width b
  
  IF achieved chain count = b
    THEN decomposition is optimal
  
  ELSE IF achieved count > b
    THEN investigate inefficiency
      → Check for premature commitment
      → Verify stratification correctness
      → Look for missed matching opportunities
```

## FAILURE MODES

### 1. **Sub-Width Compression Fallacy**
**Symptoms**: Attempting to use fewer than b chains, or claiming decomposition into k < b chains
**Detection**: Count maximum antichain size; if solution uses fewer chains than antichain size, it's impossible
**Fix**: Measure width first, accept it as absolute lower bound, optimize other aspects

### 2. **Premature Assignment Thrashing**
**Symptoms**: Creating many short chains instead of fewer long ones; poor chain utilization
**Detection**: Chain count significantly exceeds width; many chains with only 1-2 tasks
**Fix**: Use virtual nodes for deferred decisions; resolve assignments only when full context available

### 3. **Depth-Width Confusion**
**Symptoms**: Treating long dependency chains as coordination problems; over-parallelizing sequential workflows
**Detection**: Trying to parallelize tasks that must run sequentially; creating false dependencies
**Fix**: Distinguish depth (latency) from width (coordination); long chains ≠ coordination complexity

### 4. **Local Optimization Without Stratification**
**Symptoms**: Greedy assignment without global structure; decisions that block future optimal assignments
**Detection**: Assignment quality degrades with problem size; no clear levelization strategy
**Fix**: Stratify first to isolate levels, then apply maximum matching within each level interface

### 5. **Resource Spawning Before Matching**
**Symptoms**: Creating new chains/agents without fully utilizing existing ones
**Detection**: Chain utilization is low; new resources created while existing ones could handle tasks
**Fix**: Apply maximum matching to existing resources before spawning new ones

## WORKED EXAMPLES

### Example 1: Multi-Agent Task Coordination
**Scenario**: Deploying software across 3 environments (dev, staging, prod) with 8 microservices, where some services depend on others being deployed first.

**Dependencies**: 
- Database services must deploy before application services
- Shared libraries before services that use them  
- Cross-environment promotion only after full environment validation

**Step 1 - Width Analysis**:
```
Level analysis reveals maximum antichain: {DB-dev, DB-staging, DB-prod, SharedLib-dev, SharedLib-staging, SharedLib-prod}
Width b = 6 (these can all run in parallel)
Minimum agents needed = 6
```

**Step 2 - Stratification**:
```
V₁: {DB-dev, DB-staging, DB-prod, SharedLib-dev, SharedLib-staging, SharedLib-prod} (6 nodes)
V₂: {App1-dev, App1-staging, App1-prod, App2-dev, App2-staging, App2-prod} (6 nodes)  
V₃: {Integration-tests-dev, Integration-tests-staging, Integration-tests-prod} (3 nodes)
V₄: {Promotion-to-staging, Promotion-to-prod} (2 nodes)
```

**Step 3 - Chain Assignment**:
V₁ → V₂ matching:
- Chain 1: DB-dev → App1-dev  
- Chain 2: DB-staging → App1-staging
- Chain 3: DB-prod → App1-prod
- Chain 4: SharedLib-dev → App2-dev
- Chain 5: SharedLib-staging → App2-staging  
- Chain 6: SharedLib-prod → App2-prod

V₂ → V₃ matching produces 3 unmatched tasks (integration tests), but we can extend existing chains:
- Chain 1 extended: DB-dev → App1-dev → Integration-tests-dev
- Chain 2 extended: DB-staging → App1-staging → Integration-tests-staging
- Chain 3 extended: DB-prod → App1-prod → Integration-tests-prod
- Chains 4,5,6 complete after V₂

**Result**: 6 parallel agents (optimal), each handling one complete deployment pipeline.

### Example 2: Parallel Data Pipeline with Deferred Decisions
**Scenario**: Processing sensor data where some transformations depend on data quality metrics that aren't known until runtime.

**Initial structure**: Raw data → Quality check → [Unknown branching] → Aggregation → Output

**Challenge**: Can't determine optimal assignment until quality metrics computed, but want to minimize coordination overhead.

**Solution using virtual nodes**:
```
Level 1: Raw data ingestion (parallel by sensor type)
Level 2: Quality assessment (one per data stream)  
Level 3: Virtual nodes for "post-quality processing" (deferred)
Level 4: Aggregation and output

Maximum matching L1→L2: Direct assignment (each sensor to quality checker)
L2→L3: Create virtual nodes since branching strategy unknown
L3→L4: Resolve during execution based on actual quality metrics
```

**Two-phase resolution**:
1. Structure phase: Establish pipeline skeleton with virtual placeholders
2. Runtime phase: Resolve virtual nodes based on computed quality metrics

**Benefit**: Avoids premature commitment to processing strategy while ensuring resource utilization stays optimal.

## QUALITY GATES

Decomposition is complete when ALL conditions are satisfied:

- [ ] **Width optimality**: Number of chains equals measured width (maximum antichain size)
- [ ] **Stratification validity**: All nodes partitioned into levels where dependencies only flow from higher to lower levels
- [ ] **Chain coverage**: Every node appears in exactly one chain
- [ ] **Dependency preservation**: All original dependencies maintained within or between chains
- [ ] **Maximum matching applied**: At each level interface, maximum possible assignments made to existing chains
- [ ] **Virtual resolution**: All virtual nodes resolved to concrete assignments
- [ ] **Balance verification**: No chain significantly longer than others unless forced by dependencies
- [ ] **Coordination minimality**: No unnecessary communication points between chains
- [ ] **Base case atomic**: All leaf nodes (Level 1) represent truly independent operations
- [ ] **Complexity bounds met**: Achieved O(n + bh + m) or better time complexity for decomposition process

## NOT-FOR Boundaries

**DO NOT use this skill for:**

- **Independent parallel tasks**: If width = n (no dependencies), use simple parallel dispatch instead → Use: `parallel-task-dispatch`
- **Purely sequential workflows**: If width = 1, no decomposition benefit → Use: `sequential-pipeline-optimization`  
- **Real-time scheduling**: This optimizes structure, not timing → Use: `real-time-task-scheduling`
- **Dynamic dependencies**: When dependency graph changes frequently → Use: `adaptive-workflow-management`
- **Resource-constrained allocation**: When you have fewer resources than optimal chains → Use: `resource-constrained-scheduling`
- **Event-driven architectures**: When tasks are triggered by external events → Use: `event-driven-orchestration`

**Delegate to other skills when:**
- Problem has < 10 nodes → Use simple dependency resolution
- Dependencies are cyclic → Use: `cycle-breaking-strategies`  
- Need load balancing across resources → Use: `dynamic-load-balancing`
- Optimizing for latency rather than throughput → Use: `critical-path-optimization`