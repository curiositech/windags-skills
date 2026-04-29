# Stratification: Converting Global Optimization to Local Decisions

## The Core Technique

Chen's algorithm achieves its efficiency through **stratification**: decomposing a DAG into levels V₁, V₂, ..., Vₕ such that "each node in Vᵢ has its children appearing only in Vᵢ₋₁, ..., V₁" (p. 245). This converts the global problem of "find an optimal chain decomposition for the entire DAG" into a series of local problems: "find an optimal matching between level i+1 and level i."

The stratification can be computed in O(e) time—linear in the number of edges (p. 245-246). This is remarkably efficient: you scan through the graph once, processing each edge exactly once, and you've transformed your problem structure.

## Why This Matters for Agent Systems

Most complex problems that agent systems face have an implicit or explicit notion of **levels of abstraction** or **stages of refinement**:
- High-level goals decompose to sub-goals decompose to concrete actions
- Abstract requirements flow to design decisions flow to implementation details
- Strategic planning informs tactical choices informs operational execution

But agent systems often struggle with these hierarchies because they try to **reason globally**: every decision-making step considers the entire problem space. This leads to computational explosion and coordination bottlenecks.

Stratification offers a different approach: **establish levels such that each level only needs to reason about its immediate neighbors**. A node at level 3 doesn't need to know the details of level 1 nodes—it only needs to know about its children in level 2, and level 2 handles the connection to level 1.

## The Algorithm's Insight

The stratification algorithm (p. 245-246) works bottom-up:

1. **V₁ = all nodes with no outgoing edges** (leaf nodes, terminal states)
2. **For each subsequent level**: Find nodes that have at least one child in the previous level. If a node has children ONLY in already-processed levels, it belongs to the current level.

The key check (line 7 of the algorithm): `if d(v) > k then remove v from W` where k is the number of children already processed. This determines: "Does this node still have unresolved dependencies below, or are all its children accounted for?"

This is maintained efficiently by updating outdegree as you go: `d(v) := d(v) - k` (line 9). After processing level i, any node's remaining outdegree tells you whether it has children in unprocessed levels.

## Translation to Agent Task Decomposition

For a WinDAG system orchestrating skills:

**Traditional approach**: 
```
decompose_problem(problem):
    identify all possible subtasks
    identify all dependencies between subtasks  
    optimize globally for best decomposition
    execute
```

**Stratified approach**:
```
decompose_problem(problem):
    # Level 1: Terminal/atomic skills (no dependencies)
    L1 = identify_atomic_actions(problem)
    
    # Level 2: Skills that depend only on L1
    L2 = identify_tasks_depending_on(L1)
    
    # Level 3: Skills that depend on L2 (may indirectly depend on L1)
    L3 = identify_tasks_depending_on(L2)
    
    # ...continue until reaching root problem
    
    # Now solve level-by-level, each level only reasoning about adjacent levels
```

The advantage: **at each level, the search space is bounded by the size of that level and its neighbors, not the entire problem**.

## Bipartite Matching as Local Optimization

Once stratified, Chen converts each adjacent pair of levels into a bipartite graph and finds a maximum matching. A bipartite graph G(T, S; E) has edges only between the two sets T and S, never within a set (Definition 1, p. 246).

For levels Vᵢ₊₁ and Vᵢ, the bipartite graph represents: "which tasks at level i+1 can be directly connected to which tasks at level i based on dependency edges."

Finding a maximum matching means: **assign as many level i+1 tasks as possible to connect with level i tasks, maximizing the number of chains extended from level i**.

This is a **local optimization** (optimize between two levels) that composes into a **global optimum** (minimum number of chains overall). The proof (Proposition 1, p. 250-251) establishes this rigorously.

## Why Local Decisions Compose to Global Optimality

This is subtle and profound. Usually, greedy local optimization doesn't guarantee global optimality—you might make locally good choices that paint you into a corner later.

But stratification plus maximum matching has a special property: **the dependencies are already captured in the graph structure**. When you make a matching decision at level i, you're not arbitrarily constraining future levels—you're respecting the dependencies that were already there.

The mathematical proof relies on König's theorem and Dilworth's theorem (referenced p. 251-252), showing that in this specific structure (DAG with stratification), local maximum matchings compose correctly.

For agent systems, the lesson: **if you can structure your problem space as a proper hierarchy where dependencies flow only downward, local optimization at each level will compose into a globally optimal solution**.

## Practical Example: API Design Problem

Suppose an agent system is tasked with designing a REST API for a complex application. Stratification might look like:

**Level 1 (Atomic/Terminal)**:
- Define data model entities (User, Order, Product)
- Choose authentication method
- Select database technology

**Level 2 (Depends on L1)**:
- Design user endpoints (depends on User entity, authentication)
- Design order endpoints (depends on Order entity, User entity)
- Design product endpoints (depends on Product entity)

**Level 3 (Depends on L2)**:
- Design aggregate endpoints (e.g., user order history—depends on user AND order endpoints)
- Design search functionality (depends on multiple L2 endpoints)

**Level 4 (Depends on L3)**:
- Design API gateway routing
- Design rate limiting strategy

At each level, you're finding maximum matchings: "How many L3 tasks can I assign to existing chains from L2?" This is asking: "Which L3 tasks can extend the work already being done, versus which require starting new independent chains?"

## Computational Implications

The stratification's O(e) cost is negligible—you're scanning the dependency graph once. The expensive part is the maximum matching at each level: O(√(|Vᵢ₊₁| · |Vᵢ|) · |Cᵢ|) using Hopcroft-Karp (p. 247, 251-252).

But crucially, this is **bounded by local structure, not global size**. Even if your DAG has 10,000 nodes, if it's stratified into levels of ~100 nodes each, you're solving 100-node bipartite matching problems, not 10,000-node global optimization.

Compare to Jagadish's O(n³) algorithm (p. 243) that treats the problem globally. Chen's stratification brings it down to O(n² + b√(n/b)) where b is width.

## When Stratification Fails or Is Hard

**Cyclic dependencies**: The paper notes (p. 244) that cyclic graphs need preprocessing—collapse each strongly connected component (SCC) into a single node. For agents, this means: if tasks have circular dependencies (A needs B's output, B needs A's output, requiring iteration), you must identify these cycles and treat them as single atomic units.

**Unclear dependency structure**: If you don't know or can't determine dependencies upfront, you can't stratify. This forces dynamic/adaptive approaches. However, partial stratification (stratify what you know, handle emergent dependencies specially) may still provide value.

**Very flat hierarchies**: If your problem has height h = 2 (one level of tasks, one level of sub-tasks), stratification provides less benefit. It works best for deep hierarchies (h >> 1).

## Design Principles for Agent Systems

Based on stratification:

1. **Explicit level detection**: When decomposing problems, actively identify which subtasks are "same level" (have dependencies in common lower levels) versus "different levels" (one depends on the other).

2. **Level-local skill routing**: An agent at level i should route to skills that operate at level i or bridge to level i-1. Cross-level routing (level i to level i-3 directly) bypasses the compositional structure.

3. **Dependency-first decomposition**: Before deciding what skills to invoke, map out dependencies. Let dependencies determine levels, let levels determine skill routing.

4. **Bottom-up execution, top-down planning**: Stratification works bottom-up (start with leaves). But problem decomposition often works top-down (start with root goal). These aren't contradictory—decompose top-down to discover structure, stratify bottom-up to execute efficiently.

## The Fundamental Trade

Stratification trades **global visibility** for **computational tractability**. A node at level 3 doesn't "see" level 1 directly—it only sees level 2. This limited visibility enables efficient local reasoning.

For agents: **you cannot have both complete global knowledge and efficient coordination**. Stratification formalizes this trade-off and shows how to make it optimally: structure your information flow through levels such that local visibility is sufficient for correct global behavior.

## Connection to Hierarchical Planning

This connects to classical AI planning work on abstraction hierarchies (Sacerdoti's ABSTRIPS, Knoblock's ALPINE). But Chen's contribution is showing the **graph decomposition structure** that makes hierarchical reasoning provably optimal, not just heuristically useful.

The lesson: hierarchical agent architectures aren't just an engineering convenience—they're the mathematically correct approach when your problem has genuine hierarchical dependency structure.

```
Stratification is to problem-solving what modularity is to software design:
a way to ensure that local reasoning composes into global correctness.
```