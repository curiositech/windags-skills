# The Four Classes of Directed Cycles: An Information-Processing Taxonomy

## The Complete Classification

After extensive analysis, the authors prove that all directed cycles, regardless of size, belong to exactly four classes after path-wedge contraction. This isn't an empirical observation - it's a mathematical completeness result. The classification is based on two properties:

1. **Number of source-sink pairs**: How many node pairs have both edges pointing outward (source) and inward (sink)?
2. **Antichain structure**: Are nodes organized in unitary antichains (single nodes) or non-unitary antichains (sets of incomparable nodes)?

| Class | Source-Sink Pairs | Antichain Structure | DAG Legal? | TR-DAG Legal? |
|-------|------------------|---------------------|------------|---------------|
| Feedback | 0 | 4 unitary | NO | NO |
| Shortcut | 1 (connected) | 4 unitary | YES | NO |
| Diamond | 1 (disconnected) | 2 unitary, 1 non-unitary | YES | YES |
| Mixer | 2+ | 2 non-unitary | YES | YES |

## Information-Processing Interpretation

The brilliance of this classification is that each class has a clear functional meaning:

### Feedback Cycles (Forbidden in DAGs)

**Structure**: All neutral nodes (each has one edge in, one out), forming a closed directed loop.

**Information Role**: Reinforcement/iteration loop. Information circulates and accumulates.

**Why Forbidden**: Violates the ordering constraint by definition. If time flows forward (or hierarchy ascends), you can't have a path that returns to earlier times/levels. The absence of feedback cycles IS what makes a DAG acyclic.

**Agent Implication**: In a valid orchestration DAG, you should never see these. If detected, it indicates either:
- Circular dependency (bug in task decomposition)
- Violation of temporal/causal ordering (logical error)
- Need to break the loop (e.g., convergence criterion, iteration limit)

### Shortcut Cycles (Transitively Reducible)

**Structure**: One source-sink pair with direct connection, forming a triangle (or larger with neutral intermediaries).

**Information Role**: Redundant path. The direct edge S→K provides the same reachability as the longer path S→...→K.

**Why Reducible**: "Since no nodes exist on the transitive edge, no new information is created and there is no information mixing at the sink wedge of such cycle and therefore removal of this edge leads to no loss of topological information, nor no loss of information processing."

**Agent Implication**: These represent optimization opportunities:
- The shortcut edge might be a cache/memoization
- The longer path does actual computation
- Removing shortcuts reveals the "work backbone" of the system
- BUT shortcuts provide resilience - if longer path fails, shortcut remains

Example: In a build system DAG, if test.exe depends on both source.cpp (directly, for timestamps) and compiled.obj (which itself depends on source.cpp), the direct edge is a shortcut. TR removes it, revealing that the actual dependency chain is source→compile→link→test.

### Diamond Cycles (Resilience Structures)

**Structure**: One source-sink pair NOT directly connected. Two or more paths between them of potentially different lengths.

**Information Role**: "Diamond cycles encode both resilience, as information set from one source has two paths to reach its destination, and diversity of information processing as the intermediary nodes might modify the information they receive."

**Why Persist After TR**: No single path is redundant - each represents a distinct processing chain. The source must spawn multiple processing branches; the sink must reconcile their results.

**Agent Implication**: Critical coordination structure:
- **At source**: Must dispatch work to multiple paths (fan-out)
- **On paths**: May perform different transformations
- **At sink**: Must merge/reconcile results (fan-in)
- **Failure mode**: If paths produce inconsistent results, what's the reconciliation strategy?

The **balance metric** b = σ(ℓ)/⟨ℓ⟩ measures path length variation:
- b = 0: Perfectly balanced (all paths same length) - suggests parallel processing
- b > 0: Unbalanced - suggests primary path + fallback, or fast-path + slow-path

Example: A web service that queries both local cache and remote database. Two paths (cache and DB) from request to response. Sink must merge (preferring cache if available). Diamond cycle with unbalanced paths (cache is fast-path).

### Mixer Cycles (Information Integration)

**Structure**: Two or more source-sink pairs. Multiple independent information sources feeding into multiple sinks.

**Information Role**: "Mixers are providing information from two independent sources to each sink."

**Why Most Complex**: True multi-source integration. Sources are in different antichains (incomparable in ordering), meaning they represent genuinely independent processes. Sinks must perform cross-cutting synthesis.

**Agent Implication**: Highest coordination complexity:
- **Multiple sources**: May complete at different times (no ordering between them)
- **Sinks must wait**: Cannot proceed until ALL sources complete
- **Integration logic**: Sinks must understand how to combine disparate inputs
- **Failure mode**: If any source fails, all sinks are blocked (unless there's graceful degradation)

The paper notes that in contracted form, mixers appear as two non-unitary antichains connected by edges. This reveals the fundamental structure: parallel processing streams (antichains) being merged.

Example: A machine learning training orchestration where data_loader and model_initializer (independent sources) must both complete before trainer_agent (sink) can begin. If there are multiple trainers (multiple sinks), this forms a mixer.

## Why Only These Four?

The paper provides a constructive proof using edge operations:

1. **Edge Reversal**: Flipping an edge's direction changes source/sink structure
2. **Edge-Wedge Extension**: Inserting neutral nodes preserves cycle class
3. **Edge-Wedge Contraction**: Removing neutral nodes preserves fundamental structure

Starting from the smallest possible cycles (size 3), they show:
- Triangles: Only 2 distinct types (feedback, shortcut) under reversal
- Size 4: Adding one node to triangles produces all 4 classes
- Larger sizes: Extension operations only reproduce these 4 classes

"Any generalised cycle can be contracted into a form that falls into one of the four classes we defined."

## Practical Classification Algorithm

For an agent analyzing a cycle C in a DAG:

```
1. Contract neutral wedges (remove neutral nodes with ≤1 source/sink neighbor)
2. Count source nodes: ns = |{v ∈ C : both edges point out}|
3. Count sink nodes: nk = |{v ∈ C : both edges point in}|
4. 
   IF ns = 0 AND nk = 0:
      RETURN "Feedback" (ERROR - shouldn't exist in DAG)
   ELIF ns = 1 AND nk = 1:
      IF direct edge from source to sink:
         RETURN "Shortcut" (will be removed by TR)
      ELSE:
         RETURN "Diamond" (resilience structure)
   ELIF ns ≥ 2 OR nk ≥ 2:
      RETURN "Mixer" (integration structure)
```

## Design Implications for Agent Systems

**Task Decomposition**: When breaking a problem into subtasks (creating a DAG):
- Minimize mixers unless true integration is needed (high coordination cost)
- Use diamonds deliberately for fault tolerance
- Be aware that shortcuts will disappear under optimization (TR)
- Absolutely prevent feedbacks (ensure DAG property)

**Failure Handling**:
- Feedback: Impossible in valid DAG
- Shortcut: Losing shortcut edge doesn't break system (longer path exists)
- Diamond: Can survive single path failure (alternative exists)
- Mixer: Vulnerable to any source failure (all sources required)

**Parallelization**:
- Feedbacks: Sequential by nature
- Shortcuts: Main path vs fast path (potential parallel execution)
- Diamonds: All paths can run in parallel
- Mixers: All sources can run in parallel (they're in antichains)

**Performance Metrics**:
Use the paper's balance metric for diamonds:
- Low balance (b ≈ 0): Expect consistent parallel processing time
- High balance: Expect one path to dominate (optimize that one)

For mixers, monitor source completion times:
- If sources are in same antichain (truly independent), should complete at similar times
- If large time differences, may indicate false independence or load imbalance

## Boundary Conditions

This classification assumes:
- Cycles are simple (no repeated nodes except start=end)
- After path-wedge contraction (removes neutral chains)
- In context of a DAG (feedback class is theoretical only)

The classification becomes less useful when:
- Cycles are huge and complex (contraction may over-simplify)
- Network is nearly complete (almost everything is a mixer)
- Ordering constraint is weak (many violations)

## The Key Insight for Multi-Agent Systems

**Each cycle class represents a different coordination pattern required**:

- **Shortcut**: Optional optimization (one agent can skip work if shortcut available)
- **Diamond**: Mandatory parallelization with reconciliation (multiple agents must work then agree)
- **Mixer**: Mandatory synchronization (multiple independent agents must all complete before downstream can proceed)

An orchestration system that understands these classes can:
1. Automatically identify coordination patterns in a task DAG
2. Select appropriate coordination primitives (locks, barriers, consensus, voting)
3. Predict bottlenecks (mixers are natural synchronization points)
4. Optimize execution (shortcuts can be exploited or removed)

The classification is not just descriptive - it's prescriptive for how agents should coordinate.