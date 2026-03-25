# Problem Decomposition Strategies: Lessons from Graph Structure

## Two Fundamental Approaches to Decomposition

The Kritikakis-Tollis paper presents two categories of decomposition heuristics, originally from Jagadish (1990):

1. **Chain-Order Heuristic**: Constructs chains one by one, completing each before starting the next
2. **Node-Order Heuristic**: Constructs all chains in parallel, assigning each vertex to an existing chain if possible

These represent fundamentally different decomposition philosophies:
- **Sequential construction** (Chain-Order): Commit to complete subproblems greedily
- **Parallel construction** (Node-Order): Maintain all subproblems simultaneously, distribute work across them

**For agent orchestration**: This mirrors the choice between "depth-first task expansion" (explore one workflow branch completely before considering alternatives) versus "breadth-first task expansion" (incrementally grow all workflow branches in parallel).

## Chain-Order: Greedy Depth-First Decomposition

Algorithm 1 embodies the simplest decomposition strategy:

```
while there are unused vertices:
    pick an unused source vertex
    start a new chain
    extend the chain as far as possible (following immediate successors)
    when stuck, repeat
```

**Key characteristics**:
- **Commits early**: Once a vertex is added to a chain, it stays there
- **Exploits locality**: If vertices v→s→t form a natural sequence, they'll be grouped together
- **Simple termination**: Each chain ends when no unused successors exist
- **No backtracking**: Never reconsiders earlier decisions

### When Chain-Order Works Well

The experiments (Tables 1-2) show Chain-Order performs surprisingly well despite its simplicity, typically achieving 1.5-2× optimal chain count.

**Success cases**:
1. **Problems with natural pipelines**: Path-Based DAGs (where the graph is explicitly constructed from predefined paths) show Chain-Order performing within 10-20% of optimal for sparse graphs
2. **Problems with clear dependencies**: When topological structure has obvious "main threads" and "side branches," greedy extension finds the main threads
3. **Depth-dominated problems**: When longest paths are much longer than width, greedy depth-first exploration efficiently captures long chains

**For agent systems**: Chain-Order is effective when:
- Skill dependencies form natural workflows (data processing pipelines, UI rendering sequences)
- Commit early is acceptable (task requirements are stable, unlikely to change)
- Simplicity matters (need to implement quickly, minimize bugs)

### When Chain-Order Struggles

Table 1 shows Chain-Order producing 62% more chains than optimal for Watts-Strogatz graphs with average degree 5 (3095 chains vs. 1905 optimal).

**Failure mode**: WS graphs have high local clustering—many vertices are mutually reachable within small neighborhoods. Chain-Order's greedy approach gets "trapped" in local clusters, creating many short chains rather than finding opportunities to merge chains through longer paths.

**Agent system analogy**: If your skill graph has "skill clusters" (groups of related skills with dense internal dependencies but sparse external dependencies), greedy depth-first exploration might create many small workflows isolated to single clusters rather than finding cross-cluster workflows.

## Node-Order: Breadth-First Parallel Decomposition  

Algorithm 2 takes a different approach:

```
for each vertex in topological order:
    if vertex has an immediate predecessor that's the last vertex of a chain:
        add vertex to that chain
    else:
        start a new chain with this vertex
```

**Key characteristics**:
- **Parallel construction**: All chains grow together, one vertex at a time
- **Deferred commitment**: Each vertex is assigned to the "best available" chain at its time, considering all options
- **Topological order advantage**: Processing sources before sinks means chains are extended in valid order
- **No lookahead**: Decision for vertex v only considers immediate predecessors, not future implications

### The Enhanced Version: Algorithm 4 (H3)

Algorithm 4 adds two critical improvements to Node-Order:

**Improvement 1**: Line 8-9 - Choose lowest out-degree predecessor
```
instead of: pick any immediate predecessor that's last in a chain
do: pick the immediate predecessor with LOWEST out-degree that's last in a chain
```

**Rationale**: High out-degree vertices are "hubs"—many paths flow through them. Consuming them early limits flexibility. By preferring low out-degree vertices, you preserve high out-degree hubs for later when you have more information.

**Improvement 2**: Line 19-21 - Immediately consume unique successors
```
if there's an immediate successor with in-degree 1:
    add it to the current chain immediately
```

**Rationale**: If a vertex has a unique predecessor, it MUST be in that predecessor's chain (otherwise you'd need an extra chain for it). Claiming it immediately prevents accidentally starting a separate chain for it.

### Why Node-Order Outperforms Chain-Order

Tables 1-2 show Node-Order variants (H3 especially) producing significantly fewer chains than Chain-Order, typically 1.2-1.5× optimal vs. 1.5-2× optimal.

**Explanation**: Node-Order's parallel construction allows later decisions to consider earlier chains. When vertex v is processed, it can extend any existing chain, not just the most recent one. This creates more opportunities to merge what would be separate chains in Chain-Order.

**For agent systems**: Parallel workflow construction allows more flexible skill assignment. Rather than committing to complete one workflow before considering another, the orchestrator can incrementally grow multiple workflows, assigning each new skill to the most appropriate workflow based on current state.

## Progressive Refinement: Path Concatenation (Algorithm 3)

Algorithm 3 adds a post-processing refinement step that transforms path decomposition into chain decomposition:

```
for each path P:
    from P's first vertex, search backward (reversed DFS)
    find paths that P's first vertex can reach from
    if found, concatenate those paths with P
    mark all explored vertices (prevents redundant search)
```

**Key insight**: Two paths P1 and P2 can merge if there's ANY directed path connecting them, not just a direct edge. Chain-Order and Node-Order only connect via immediate edges; concatenation finds longer connections.

### The Reusable Search Optimization

The crucial optimization (line 9): `G ← G \ Ri`

After searching backward from vertex v, all explored vertices that didn't lead to a concatenation are marked. Future searches won't re-explore them.

**Why this matters**: Without this, each concatenation attempt would be O(|E|), giving O(kp * |E|) total. With it, each vertex is explored at most once, giving O(|V| + |E|) total search cost plus O(c*l) for actual concatenations.

**For agent systems**: When searching for workflow connections, **reuse negative results**. If you searched for a path from skill A to skill B and didn't find one, record this fact. Future queries can skip the search.

This is a general principle: **Cache negative results, not just positive ones**. Many systems cache successful searches (memoization) but re-execute failed searches, wasting effort.

### When Concatenation Provides Most Value

The experiments show concatenation reduces chain count by 20-40% compared to base heuristics for dense graphs, but only 5-15% for sparse graphs.

**Why**: Dense graphs have more opportunities for transitive connections (long paths between chain endpoints). Sparse graphs mostly connect via immediate edges, which base heuristics already find.

**For agent systems**: Post-processing refinement is most valuable when:
- The problem has "hidden structure" not obvious from immediate dependencies
- Initial decomposition was fast but rough (prioritized speed over quality)
- You'll use the decomposition many times (amortize refinement cost)

## Integrated Construction-Refinement: Algorithm 5 (H3 conc.)

Algorithm 5 combines Algorithm 4 and Algorithm 3 into a single pass:

```
for each vertex in topological order:
    if vertex has an immediate predecessor that's last in a chain:
        extend that chain (prioritize lowest out-degree)
    else:
        try reversed DFS to find ANY predecessor (concatenation opportunity)
        if found, extend that chain
        else, start new chain
    if vertex has unique immediate successor, claim it
```

**The innovation**: Rather than doing path decomposition followed by concatenation, attempt concatenation during construction when no immediate predecessor is available.

**Benefits**:
1. **Fewer total searches**: Some reversed DFS searches are avoided because the vertex gets claimed via immediate edge first
2. **Better topological ordering**: Concatenations happen in topological order, which may find opportunities that post-processing (arbitrary order) would miss
3. **Simpler code**: Single pass instead of two phases

The experiments show H3 conc. consistently produces the smallest chain counts among all heuristics (typically within 5-10% of optimal).

### The Cost-Benefit Trade-off

H3 conc. has complexity O(|E| + c*l) where c is concatenations and l is longest path. In worst case, this could be O(|E| + |V|²) if all vertices form one long chain and many concatenations occur along it.

But experimentally, the authors show (p. 6) execution times growing almost linearly: 10k nodes takes 9ms, 160k nodes takes 538ms, suggesting practical complexity closer to O(|E|) than worst-case.

**When to use H3 conc. vs. simpler heuristics**:
- **Use H3 conc.** if: Quality matters (need near-optimal decomposition), graph is moderately dense (avg degree > 10), will use decomposition many times
- **Use H3 (no concatenation)** if: Need decent quality, have tight time constraints, can accept 10-20% more chains
- **Use Chain-Order** if: Need something quick, structure is obvious, can accept 50-100% more chains

## Decomposition as Iterative Refinement

The progression from Algorithm 1 → 2 → 4 → 5 demonstrates **iterative refinement** as a design strategy:

**Level 1** (Chain-Order): O(|V|+|E|), 1.5-2× optimal
- One idea: extend chains greedily

**Level 2** (Node-Order): O(|V|+|E|), 1.3-1.7× optimal  
- Added: parallel construction, consider all existing chains

**Level 3** (H3): O(|V|+|E|), 1.2-1.5× optimal
- Added: prefer low out-degree, claim unique successors

**Level 4** (H3 conc.): O(|E|+c*l), 1.05-1.15× optimal
- Added: search for transitive connections

Each level adds sophistication without changing algorithmic complexity class (all are linear or near-linear). Each level provides incremental improvement.

**For agent systems**: Don't design one monolithic "optimal" planner. Instead:

1. Start with simple decomposition (Level 1)
2. Add cheap heuristics (Level 2-3)
3. Add refinement when needed (Level 4)
4. Measure improvement at each level
5. Stop when cost/benefit ratio becomes unfavorable

This allows deploying quickly (Level 1 works) while having upgrade path (Levels 2-4) when requirements justify it.

## Domain-Specific Decomposition Strategies

The paper tests four graph models, revealing that **optimal decomposition strategy depends on problem structure**:

### Erdős-Rényi (Random Dependencies)
- Node-Order variants perform best
- Random structure means no obvious "main threads" for Chain-Order to find
- Parallel construction explores more possibilities

**Agent analog**: Problems with unstructured skill dependencies (ad-hoc tasks, exploratory problem-solving) benefit from breadth-first exploration

### Barabási-Albert (Hub-and-Spoke)
- All heuristics struggle somewhat (higher width than ER)
- Hub vertices create bottlenecks that heuristics have trouble navigating
- H3's "prefer low out-degree" helps avoid consuming hubs early

**Agent analog**: Problems with "expert" skills that many workflows need (authentication, data validation, logging) require careful resource management—save experts for when truly needed

### Watts-Strogatz (Small-World Clustering)
- Node-Order significantly outperforms Chain-Order
- High local clustering means greedy gets trapped locally
- Parallel construction allows jumping between clusters

**Agent analog**: Problems with modular structure (UI layer + business logic + data layer) need breadth-first exploration to find cross-module connections

### Path-Based (Predefined Workflows)
- Chain-Order performs best (!) for sparse instances
- When structure is explicitly workflow-based, greedy depth-first finds workflows naturally
- As graphs densify, Node-Order catches up (cross-workflow connections matter more)

**Agent analog**: Problems with known workflow templates (standard operating procedures, established pipelines) can use greedy depth-first successfully

## Synthesis: Decomposition Design Principles

The paper reveals several principles for decomposition in complex systems:

### 1. Start Simple, Refine Progressively

Don't build optimal decomposition from scratch. Build adequate decomposition quickly, refine if needed.

**Chain-Order → Node-Order → H3 → H3 conc.** represents increasing sophistication at increasing cost. Ship Chain-Order first, upgrade later if necessary.

### 2. Parallel Construction Beats Sequential for Unstructured Problems

When problem structure isn't obvious (random dependencies, complex interactions), parallel construction (Node-Order) explores more options than sequential (Chain-Order).

For agent systems: When requirements are unclear or changing, maintain multiple partial plans in parallel rather than committing to one plan deeply.

### 3. Prefer Flexible Resources, Consume Constrained Resources

H3's "choose lowest out-degree predecessor" embodies this principle: keep flexible (high out-degree) vertices available as long as possible.

For agent systems: When assigning skills to workflows, prefer specialized skills (few dependencies) over general-purpose skills (many dependencies). Save the general-purpose skills for situations where specialization doesn't work.

### 4. Claim Forced Moves Immediately

H3's "consume unique immediate successors" recognizes that some assignments are forced by constraints. Claiming them immediately simplifies future decisions.

For agent systems: If a skill has only one possible predecessor skill, assign it to that predecessor's workflow immediately. Don't defer forced decisions.

### 5. Refinement Pays Off for Dense Problems

Concatenation reduces chain count by 20-40% for dense graphs but only 5-15% for sparse graphs.

For agent systems: Post-processing optimization is worthwhile when:
- Problem has many interdependencies (dense)
- Initial decomposition was quick-and-dirty
- Will use decomposition many times (amortize cost)

### 6. Reuse Negative Results

Algorithm 3's `G ← G \ Ri` (remove explored-but-failed vertices) prevents redundant searches.

For agent systems: Cache not just "skill A enables skill B" (positive results) but also "skill A cannot reach skill B" (negative results). Both guide future decisions.

### 7. Integrate Rather Than Pipeline When Possible

Algorithm 5 (integrated construction-refinement) outperforms Algorithm 4 + Algorithm 3 (pipelined construction then refinement).

For agent systems: Interleaving planning and execution often beats full planning then full execution. Opportunistically optimize during construction rather than treating optimization as separate phase.

The paper's decomposition algorithms provide a toolkit for problem-solving systems: multiple strategies at multiple sophistication levels, with clear guidance on when each applies. The key insight is that **decomposition strategy should match problem structure**, and simple heuristics often suffice—sophisticated optimization is needed only when problem density and query frequency justify it.