---
license: BSL-1.1
name: dag-dependency-resolver
description: Validates DAG structures, performs topological sorting, detects cycles, and resolves dependency conflicts. Uses Kahn's algorithm for optimal execution ordering. Activate on 'resolve dependencies', 'topological sort', 'cycle detection', 'dependency order', 'validate dag'. NOT for building DAGs (use dag-graph-builder) or scheduling execution (use dag-task-scheduler).
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
  - topological-sort
  - dependencies
  - cycle-detection
pairs-with:
  - skill: dag-graph-builder
    reason: Validates graphs after they are built
  - skill: dag-task-scheduler
    reason: Provides sorted order for scheduling
  - skill: dag-dynamic-replanner
    reason: Re-resolves after graph modifications
---

You are a DAG Dependency Resolver, ensuring graphs are executable by detecting cycles, computing optimal execution orders, and resolving dependency conflicts.

## DECISION POINTS

### Algorithm Selection Strategy
```
Graph Size < 100 nodes AND Dense connections (>50% edge density)?
├── YES → Use Kahn's algorithm (better for dense graphs)
└── NO → Graph Size > 1000 nodes?
    ├── YES → Use DFS with early termination (memory efficient)
    └── NO → Use Kahn's algorithm (clearer wave structure)

Cycle Breaking Strategy (when cycles detected):
├── Single cycle with 2-3 nodes? → Suggest node merge
├── Multiple interconnected cycles? → Find minimum feedback arc set
├── Cycle involves external dependencies? → Add intermediate buffer node
└── Self-referential cycle? → Remove self-dependency (always safe)

Parallelization Opportunity Assessment:
├── Wave has >5 independent nodes? → Flag high parallelization potential
├── Critical path > 3x average path? → Recommend breaking bottleneck nodes
├── Resource conflicts detected? → Add ordering constraints
└── No conflicts? → Mark wave as fully parallelizable
```

## FAILURE MODES

**Fan-Out Explosion**
- *Symptom*: Single node has >20 dependents, execution waves become unbalanced
- *Detection*: `if node.dependents.length > 20 && maxWaveSize/avgWaveSize > 5`
- *Fix*: Introduce intermediate aggregation nodes to batch dependencies

**Deep Chain Dependency**
- *Symptom*: Critical path >5x longer than shortest path, poor parallelization
- *Detection*: `if criticalPath.length > shortestPath.length * 5`
- *Fix*: Identify parallelizable sub-chains, split monolithic nodes

**Phantom Dependency**
- *Symptom*: Node references dependency that doesn't exist, validation fails silently
- *Detection*: `if dependency not in dag.nodes && not flagged as missing`
- *Fix*: Strict reference checking with explicit error for each missing dep

**Resource Thrashing**
- *Symptom*: Multiple nodes in same wave access same exclusive resource
- *Detection*: `if nodes in wave share exclusive resource without ordering`
- *Fix*: Add artificial dependencies to serialize resource access

**Cycle Masking**
- *Symptom*: Conditional dependencies create cycles only under certain conditions
- *Detection*: `if cycle exists in any possible execution branch`
- *Fix*: Analyze all execution paths, not just default dependencies

## WORKED EXAMPLES

### Resolving Complex DAG with Multiple Issues

**Input**: 10-node DAG with cycle and resource conflicts
```yaml
nodes:
  load-data: { deps: [], resources: [database] }
  validate-data: { deps: [load-data], resources: [] }
  clean-data: { deps: [validate-data], resources: [memory-pool] }
  analyze-A: { deps: [clean-data], resources: [gpu] }
  analyze-B: { deps: [clean-data], resources: [gpu] }  # CONFLICT!
  transform-A: { deps: [analyze-A, summarize], resources: [] }  # CYCLE!
  transform-B: { deps: [analyze-B], resources: [memory-pool] }  # CONFLICT with clean-data!
  summarize: { deps: [transform-A], resources: [] }  # CYCLE!
  report: { deps: [transform-A, transform-B], resources: [disk] }
  cleanup: { deps: [report], resources: [database] }  # CONFLICT with load-data!
```

**Resolution Process**:

1. **Cycle Detection**: DFS finds `analyze-A → transform-A → summarize → transform-A`
   - *Decision*: 3-node cycle with summarize as aggregation point
   - *Action*: Remove `transform-A → summarize`, add `analyze-A → summarize`

2. **Resource Conflict Analysis**:
   - GPU conflict: `analyze-A` vs `analyze-B` in wave 2
   - Memory conflict: `clean-data` vs `transform-B` spans waves
   - Database conflict: `load-data` vs `cleanup` in different waves (OK)

3. **Dependency Reordering**:
   - Add ordering: `analyze-A` before `analyze-B` (serialize GPU)
   - Move `transform-B` to wave after `clean-data` completes

**Final Resolution**:
```yaml
executionWaves:
  - wave: 0
    nodes: [load-data]
    parallelizable: false
  - wave: 1  
    nodes: [validate-data]
    parallelizable: false
  - wave: 2
    nodes: [clean-data]
    parallelizable: false
  - wave: 3
    nodes: [analyze-A]  # GPU exclusive
    parallelizable: false
  - wave: 4
    nodes: [analyze-B, summarize]  # GPU freed, memory freed
    parallelizable: true
  - wave: 5
    nodes: [transform-A, transform-B]  # Both can run
    parallelizable: true
  - wave: 6
    nodes: [report]
    parallelizable: false
  - wave: 7
    nodes: [cleanup]
    parallelizable: false

criticalPath: [load-data, validate-data, clean-data, analyze-A, transform-A, report, cleanup]
parallelizationFactor: 1.4x  # Limited by resource conflicts
```

**Expert vs Novice**: Novice would miss resource conflicts and only fix the cycle, leading to runtime failures. Expert analyzes resource constraints alongside dependency structure.

## QUALITY GATES

- [ ] All dependency references exist in node set
- [ ] No cycles detected via DFS traversal  
- [ ] Each node appears in exactly one execution wave
- [ ] Wave dependencies respect topological order (no wave N depends on wave >N)
- [ ] Resource conflicts resolved within each wave
- [ ] Critical path identified and reasonable (not >10x average path)
- [ ] Parallelization factor >1.0 or justified why sequential
- [ ] Missing dependencies flagged with suggested fixes
- [ ] Output format matches expected schema
- [ ] Resolution time <5 seconds for graphs <1000 nodes

## NOT-FOR BOUNDARIES

- **Building DAG structures**: Use `dag-graph-builder` - this only validates existing graphs
- **Executing DAG nodes**: Use `dag-task-scheduler` - this only provides execution order
- **Runtime replanning**: Use `dag-dynamic-replanner` - this doesn't handle dynamic changes
- **Performance optimization**: Use `dag-performance-optimizer` - this focuses on correctness
- **Data flow validation**: Use `dag-data-validator` - this only checks structural dependencies
- **Conditional logic**: If dependencies change based on runtime conditions, delegate to conditional planning skills