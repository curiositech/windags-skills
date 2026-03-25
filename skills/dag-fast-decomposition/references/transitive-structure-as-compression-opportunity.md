# Transitive Structure as Compression Opportunity: The 85-95% Rule

## The Striking Experimental Finding

Perhaps the most surprising result in the Kritikakis-Tollis paper appears in Tables 4 and 5: **"the transitive edges for almost all models of the graphs of 5000 and 10000 nodes with average degree above 20 is above 85%, i.e., |Etr|/|E| ≥85%"** (p. 22). In some dense graphs, over 95% of edges are transitive—compositionally redundant.

This isn't a theoretical curiosity. This is a fundamental property of dense directed acyclic graphs that has profound implications for how intelligent systems should represent and reason about complex problem spaces.

## Defining Transitive vs. Non-Transitive Edges

The paper provides crisp definitions (p. 2):

- **Transitive edge**: An edge (v1, v2) is transitive if there exists a path longer than one edge connecting v1 to v2
- **Non-transitive edges (Ered)**: E - Etr, the edges that aren't transitive
- **Transitive reduction (Gred)**: The unique minimal graph with the same transitive closure—contains only Ered

**Key insight**: If you can reach v2 from v1 through an intermediate vertex v3 (path v1→v3→v2), then the direct edge v1→v2 (if it exists) is transitive—it's logically redundant.

In skill dependency terms: If skill A enables skill B, and skill B enables skill C, then a direct "skill A enables skill C" relationship is transitive. You don't need to explicitly represent it—it's compositionally derivable.

## The |Ered| ≤ width * |V| Bound

The authors prove a crucial structural constraint (Section 4, observation 3): **"The non-transitive edges of G are less than or equal to width * |V|"**.

The proof follows from observations 1 and 2:
1. Each vertex can have at most one outgoing non-transitive edge to each chain
2. Each vertex can have at most one incoming non-transitive edge from each chain

Since there are width chains (in an optimal decomposition), each vertex has at most width outgoing non-transitive edges and at most width incoming non-transitive edges.

### Why This Matters

This bound says: **regardless of how many total edges exist, the non-transitive structure is bounded by width**. Even in a complete DAG (all possible edges that don't create cycles), |Ered| ≤ width * |V|.

For a graph with 10,000 vertices and width 100:
- Maximum non-transitive edges: 100 * 10,000 = 1,000,000
- But a complete DAG could have ~50 million edges
- So up to 98% of edges could be transitive

The experimental results (Table 5, ER model, avg degree 160) show exactly this pattern:
- |V| = 10,000, avg degree 160 → |E| ≈ 800,000 edges
- Width ≈ 63 (from width ≈ |V|/avg_degree formula)
- |Ered| = 59,377 edges (7.4% of total)
- |Etr| = 740,623 edges (92.6% of total)

The bound predicts |Ered| ≤ 63 * 10,000 = 630,000, and actual |Ered| is far below that.

## The Stability of |Ered| as Density Increases

The most striking pattern in Tables 4-5 is that **|Ered| barely grows as average degree increases**:

Table 5 (10,000 node ER graphs):
- Avg degree 5: |Ered| = 37,332 (75% of edges)
- Avg degree 10: |Ered| = 44,418 (45% of edges)
- Avg degree 20: |Ered| = 51,014 (26% of edges)
- Avg degree 40: |Ered| = 56,033 (14% of edges)
- Avg degree 80: |Ered| = 58,363 (7.3% of edges)
- Avg degree 160: |Ered| = 59,377 (7.4% of edges)

As average degree increases by 32× (from 5 to 160), |Ered| increases by only 1.6× (from 37K to 59K). Meanwhile, total edges increase by 32×.

**The interpretation**: Early edges you add to a sparse DAG create new structure—they connect previously disconnected components or create new paths. But as the graph densifies, additional edges increasingly connect already-connected vertices, creating transitive relationships.

### The Phase Transition

There's a phase transition somewhere around average degree 40-80 where |Ered| growth nearly stops. Beyond this point, the graph is "saturated"—almost all new edges are transitive.

For problem-solving systems, this suggests: **once you've established the essential dependencies, additional "nice to have" connections don't increase structural complexity**. They might make individual operations slightly more efficient (shorter paths), but they don't fundamentally change the problem's coordination requirements.

## Linear-Time Transitive Edge Detection

The authors show (Section 4) how to identify a large subset of transitive edges in linear time using chain decomposition:

**The algorithm** (described on p. 16):
1. Given a chain decomposition, process each vertex
2. For outgoing edges: keep only the edge pointing to the lowest vertex in each target chain; mark others as transitive (Figure 8a)
3. For incoming edges: keep only the edge coming from the highest vertex in each source chain; mark others as transitive (Figure 8b)

**Why this works**: If vertex v has edges to both vertex s and vertex t in the same chain, and s comes before t in the chain (s can reach t), then the edge v→t is transitive—it's redundant given v→s→...→t.

### The Subset E′tr

This linear-time scan doesn't identify *all* transitive edges (that would require computing full transitive closure, which is expensive). It identifies a subset E′tr ⊆ Etr.

The authors prove (Section 4): **|E - E′tr| ≤ kc * |V|** where kc is the number of chains.

For downstream algorithms, this means: "After linear-time preprocessing, the remaining graph has at most kc * |V| edges." This bounds the input size to subsequent algorithms.

### Application: Preprocessing for Other Algorithms

The paper suggests (p. 16): "this approach can be used as a linear-time preprocessing step in order to reduce the size of any DAG. Consequently, this will speed up every transitive closure algorithm bounding the number of edges of an input graph, and the indegree and outdegree of every vertex by kc."

Algorithms with complexity like O(|V|²) or O(|V|*|E|) benefit enormously if you can reduce |E| from millions to ~width * |V| (typically thousands or tens of thousands) in a preprocessing pass.

**For agent systems**: Before running expensive planning or analysis, do a fast chain decomposition, remove obvious transitive dependencies, then run the expensive algorithm on the reduced graph. The total time is often lower than running the expensive algorithm on the full graph.

## The Indexing Scheme: Exploiting Transitivity

The paper's indexing scheme (Section 5, Algorithm 7) is designed to exploit the transitive structure. The key insight is in Theorem 5.3:

**The indexing scheme runs in O(kc * |Ered| + |Etr|) time**.

Notice the terms:
- kc * |Ered|: This is the "real work"—updating indexes based on non-transitive edges
- |Etr|: This is just *recognizing* transitive edges and skipping them

The algorithm (lines 10-17 of Algorithm 7):

```
for each immediate successor in ascending topological order:
    if successor represents a non-transitive edge:
        update indexes
    else:
        skip it (it's transitive)
```

The check "is this edge transitive?" (line 14) is O(1): compare successor's chain position to current vertex's recorded reach into that chain. If we already reach further than successor, the edge is transitive.

### Why the Runtime Is Flat

Figure 11 shows the indexing scheme runtime for ER graphs as average degree increases from 5 to 160. The line is nearly flat—execution time barely increases.

**Explanation**: As density increases, |Etr| grows but |Ered| stays nearly constant. The algorithm traces all edges (linear in |E|) but only does O(kc) work per non-transitive edge. Since |Ered| is stable, total work is stable.

The authors note (p. 22): "Since the algorithm merely traces in linear time the transitive edges, the growth of |Etr| affects the run time only linearly. As a result, the run time of our technique does not increase as the size of the (edges) input graph increases."

This is remarkable: **complexity becomes independent of graph density once you've identified the transitive structure**.

## Implications for Agent System Design

### 1. Sparse Representation of Skill Dependencies

If 85-95% of potential skill invocation sequences are transitive (derivable from simpler relationships), the system should NOT explicitly store them.

**Design principle**: Store only the transitive reduction (Ered). Compute transitive implications on-demand using the indexing scheme or graph traversal. The storage savings are 10-20× for dense graphs.

### 2. Lazy Evaluation of Dependencies

When an agent considers invoking skill B after skill A, don't precompute all possible skill sequences. Instead:
1. Maintain Ered (direct skill dependencies) explicitly
2. When queried "can skill A eventually enable skill C?", use indexing scheme for O(1) answer
3. If the answer is yes, compute the actual path only if needed (many queries just need yes/no)

The paper's constant-time reachability queries make this practical.

### 3. Incremental Planning with Transitive Awareness

During plan construction, distinguish between:
- **Structural edges**: Non-transitive dependencies that represent genuine ordering constraints
- **Convenience edges**: Transitive dependencies that might optimize specific paths but aren't essential

Focus planning effort on satisfying structural edges. Convenience edges can be exploited opportunistically.

### 4. Change Impact Analysis

When a skill's behavior changes or an agent fails, the impact analysis question is: "what depends on this skill?"

If you've identified E′tr (transitive edges), you know that changes only directly propagate through Ered edges. The transitive dependencies are compositional consequences—they'll update automatically once the direct dependencies are handled.

This bounds the immediate impact analysis to width * |V| edges, not all |E| edges.

### 5. Hierarchical Abstraction Layers

The fact that 85-95% of structure is transitive suggests natural abstraction levels:

- **Level 0 (Concrete)**: All edges, including transitive—full detail
- **Level 1 (Essential)**: Only Ered edges—the structural skeleton
- **Level 2 (Chains)**: kc chains—the independent threads of reasoning
- **Level 3 (Width)**: width-level parallelism—the irreducible coordination requirement

Different operations need different levels:
- Real-time routing: Level 2 or 3 (chain-level decisions)
- Detailed execution: Level 1 (follow Ered edges)
- Verification/debugging: Level 0 (check all implications)

## Detecting Transitive Edges Without Full Closure

The linear-time detection (Section 4) doesn't require computing transitive closure. This is critical for scaling.

**The chain-based filter**:
```
For each vertex v:
    For each outgoing edge v→s:
        chain_id = which chain does s belong to?
        lowest_reach = v's index for chain_id
        if s's position > lowest_reach:
            v→s is non-transitive (keep it)
        else:
            v→s is transitive (can remove)
```

This is O(|E|) total work—one check per edge.

**For agent systems**: After constructing an initial skill dependency graph (possibly verbose, with many redundant connections), run this filter to reduce to essential dependencies. The reduced graph is easier to visualize, reason about, and optimize.

### Dynamic Maintenance

The authors note (Conclusion, p. 25): "the overwhelming majority of edges in a DAG are transitive. The insertion or deletion of a transitive edge clearly requires a constant time update since it does not affect transitivity."

**Implication**: In a dynamic system where skills are added/removed:
- Most additions/deletions are transitive—they don't change the structural properties
- Detect whether an edge is transitive using the indexing scheme (O(1) query)
- If transitive, no update needed to the decomposition
- If non-transitive, may need to recompute decomposition—but this is rare

This enables efficient incremental maintenance without recomputing everything on each change.

## Boundary Conditions: When Transitivity Doesn't Help

The 85-95% transitivity rule applies to **dense** graphs (average degree > 20 in experiments). For sparse graphs:

Table 4 (5000 node ER graphs, avg degree 5):
- |Ered| = 18,402 edges
- |E| = 24,505 edges  
- Transitivity = 25% (only 1/4 of edges are transitive)

**Interpretation**: In genuinely sparse problem spaces (few dependencies), most dependencies are structural. The transitive compression opportunity is small.

For agent systems: If your skill dependency graph is genuinely sparse (average skill has 2-3 dependencies), the chain decomposition and indexing scheme overhead may not be worthwhile. Simple adjacency list representation and DFS traversal might suffice.

### The Graph Model Matters

The transitivity percentage varies by graph model (Tables 4-5):
- ER (random): 85-95% for dense graphs
- BA (preferential attachment): Similar to ER
- WS (small-world): Even higher transitivity due to local clustering
- PB (path-based): Lower transitivity for sparse graphs, converges to ER for dense

**For problem domains**: If your domain naturally has "hub" skills that many paths flow through (BA-like), expect high transitivity. If it has modular structure with local dependencies (WS-like), expect very high transitivity. If it's genuinely random dependencies (ER-like), expect 85-95% for dense problems.

## Synthesis: Transitive Structure as a Resource

The paper reveals that **transitive structure is not a liability—it's an asset**. The 85-95% of "redundant" edges aren't clutter to be removed; they're compressed representations that enable efficient reasoning.

Key insights for intelligent systems:

1. **Compression without loss**: Storing only Ered and computing transitive implications on-demand provides full information at 5-15% storage cost

2. **Constant-time access**: The indexing scheme proves that compressed representation needn't mean slow access—O(1) queries are possible

3. **Stability under growth**: As problem details proliferate (new skills, new dependencies), the essential structure (|Ered|) grows slowly—coordination complexity is bounded

4. **Linear-time extraction**: Identifying transitive structure doesn't require expensive computation—chain decomposition + linear scan suffices

5. **Incremental maintenance**: Most changes are to transitive edges, which require minimal update effort

The paper's title emphasizes practical algorithms, but the deeper contribution is recognizing that **real-world complexity has redundant structure that can be exploited systematically**. For multi-agent systems, this means the apparent combinatorial explosion of possibilities (|E| growing quadratically) is mostly illusory—the essential coordination structure (|Ered|) grows much more slowly, often approaching a stable limit.