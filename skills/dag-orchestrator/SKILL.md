---
license: BSL-1.1
name: dag-orchestrator
description: |
  The intelligence layer of WinDAGs. Decomposes natural language tasks into Hierarchical Task DAGs (HTDAGs), matches subtasks to skills, executes waves in parallel, and dynamically expands nodes when complexity exceeds executor capability. Use for 'orchestrate', 'execute DAG', 'parallel agents', 'decompose task', 'coordinate skills'. NOT for single-skill tasks or simple linear workflows.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Task
  - TodoWrite
  - Grep
  - Glob
category: Agent & Orchestration
tags:
  - dag
  - orchestration
  - task-decomposition
  - parallel-execution
  - htdag
  - adaptive-planning
---

# DAG Orchestrator

The beating heart of WinDAGs. Transforms arbitrary natural language tasks into parallelized agent graphs that execute in waves, adapting dynamically to task complexity and executor capabilities.

## Decision Points

### 1. Initial Decomposition Strategy
```
Task Complexity Assessment:
├─ Single verb, single output file? → Use single-skill task
├─ 2-3 clear sequential steps? → Use linear workflow  
├─ Multiple independent components? → Use parallel DAG
├─ Requires research phase? → Use phase orchestration
└─ Unclear requirements? → Start shallow, expand on failure
```

### 2. AND vs OR Composition Logic
```
Subtask Relationship Analysis:
├─ All must succeed for parent success? → AND composition
├─ Any success satisfies parent goal? → OR composition  
├─ Primary approach with fallbacks? → Mixed (AND primary, OR fallbacks)
└─ Exploration of multiple options? → OR with confidence weighting
```

### 3. Max Depth Calibration
```
Task Complexity Heuristics:
├─ Simple CRUD operations? → max_depth = 2
├─ Feature development? → max_depth = 3
├─ System architecture? → max_depth = 4  
├─ Research + implementation? → max_depth = 5
└─ If >5 levels needed → Use phase orchestration instead
```

### 4. Parallelization Safety Check
```
File Conflict Analysis:
├─ Predicted file overlap? → Force sequential execution
├─ Singleton operations (build/test)? → Isolate in separate wave
├─ Independent file modifications? → Safe to parallelize
└─ Database/config changes? → Serialize critical sections
```

### 5. Failure Recovery Strategy
```
Executor Failure Response:
├─ depth < max_depth? → Decompose failed node into sub-DAG
├─ depth >= max_depth? → Mark dependents as skipped, continue independents
├─ Critical path failure? → Halt DAG, report blocking issue
└─ Low confidence result? → Flag for review, continue with warnings
```

## Failure Modes

### Schema Bloat
**Symptoms**: DAG has >15 nodes in single level, execution takes >10 minutes
**Detection**: `if nodeCount > 15 || estimatedTime > 600s`
**Fix**: Group related subtasks into composite nodes, increase abstraction level

### Circular Dependencies  
**Symptoms**: Topological sort fails, "cyclic dependency" error in wave computation
**Detection**: `if waves.length === 0 && nodes.length > 0`
**Fix**: Identify cycle using DFS, break with intermediate artifact or merge conflicting nodes

### Premature Parallelization
**Symptoms**: File conflicts, race conditions, inconsistent final state  
**Detection**: `if conflictingFiles.length > 0 || inconsistentOutputs`
**Fix**: Add explicit dependencies, use sequential waves for conflicting operations

### Infinite Decomposition
**Symptoms**: Depth keeps increasing, same task fails repeatedly at leaf level
**Detection**: `if depth > max_depth && taskId appears in call stack`  
**Fix**: Flag task as requiring human skill creation or use general-purpose fallback

### Context Loss Cascade
**Symptoms**: Later waves fail due to missing information from earlier waves
**Detection**: `if waveN.inputs.missing.length > 0`
**Fix**: Ensure explicit context passing between waves, add context aggregation nodes

## Worked Examples

### Example: "Build authentication system for web app"

**Initial Assessment**: Complex multi-component task → Use parallel DAG with max_depth=4

**Wave 0 Decomposition**:
```typescript
// Initial breakdown
subtasks = [
  "Design user data schema",           // skill: database-architect  
  "Create login/signup API endpoints", // skill: api-architect
  "Build frontend auth components",    // skill: react-developer
  "Set up JWT token handling",        // skill: security-engineer
  "Write authentication tests"        // skill: test-engineer
]
```

**Dependency Analysis**: 
- API endpoints need schema → Add dependency edge
- Frontend needs API → Add dependency edge  
- Tests need all components → Add dependency edge

**Final Wave Structure**:
```
Wave 0: [Design schema]
Wave 1: [Create API endpoints] (depends on schema)
Wave 2: [Build frontend, Set up JWT] (parallel, both depend on API)
Wave 3: [Write tests] (depends on all above)
```

**Execution with Failure**:
```typescript
// Wave 1 executor fails on "Create API endpoints" - too complex
if (executorResult.failed && depth < maxDepth) {
  // Decompose the failing node
  const apiSubtasks = [
    "Define authentication routes",
    "Implement password hashing", 
    "Add session management",
    "Create user CRUD operations"
  ];
  // Execute sub-DAG, then continue main DAG
}
```

**Expert vs Novice**: 
- Novice: Would try to execute all at once, miss dependencies
- Expert: Identifies that schema must come first, API before frontend, tests last

## Quality Gates

- [ ] All subtasks have identified skill matches or fallback strategy
- [ ] Dependency graph has no cycles (topological sort succeeds)
- [ ] File conflict prediction shows no overlapping modifications per wave
- [ ] Maximum decomposition depth doesn't exceed 5 levels
- [ ] Each wave has ≤10 parallel tasks (Claude execution limit)
- [ ] Critical path execution time estimated <30 minutes
- [ ] All executor confidence scores >60% or flagged for review
- [ ] Context passing between waves explicitly defined
- [ ] Failure handling strategy defined for each critical node
- [ ] Resource constraints (memory, tokens, API calls) within limits

## NOT-FOR Boundaries

**Don't use DAG Orchestrator for**:
- Single-skill tasks → Use direct skill invocation
- Simple linear workflows with <3 steps → Use sequential task calls
- Real-time interactive tasks → Use conversational agents instead
- Tasks requiring human creativity/judgment → Use human-in-loop workflows
- Debugging/troubleshooting → Use diagnostic-specialist skill
- Data analysis/visualization → Use data-analyst skill

**Delegate instead**:
- Code reviews → Use code-reviewer skill
- Writing/editing → Use copywriter or technical-writer  
- Research synthesis → Use research-synthesizer skill
- UI/UX design → Use ui-ux-designer skill