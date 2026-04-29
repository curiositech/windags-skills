# Preference Over Consistency-Restoring Revisions: Encoding Deliberation Policy in Search Structures

## The Multiplicity Problem in Conflict Resolution

When an agent detects conflicting desires or constraints, consistency must be restored. But typically there are *multiple* ways to restore consistency—different subsets of desires could be satisfied, different actions could be abduced. How should the agent choose?

Móra et al. identify this clearly: "In general, there may be more than one subset of the eligible desires that are jointly achievable. Therefore, we should indicate which of these subsets are preferred to be adopted as intentions" (p. 20). The ELP revision mechanism finds *all* minimal ways to restore consistency. That's good—it explores the full solution space. But an agent must commit to one solution to act.

The naive approach: Enumerate all minimal revisions, score them according to utility, pick the best. But this is expensive—revision search already explores combinations, and scoring them all might be as costly as finding them.

The elegant approach: Encode preferences *in the revision process itself*, guiding search toward preferred solutions. This is what the preference graph (Definition 9) achieves. Instead of "find all solutions then filter," it's "search for solutions in preference order."

## The Preference Graph Structure

A preference graph is a labeled DAG where:
- **Nodes** are *revision levels*, each associated with a set of revisable literals: Rev(level_i) = {some revisables} ∪ Rev(parent_levels)
- **Edges** define preference order: child → parent means "try parent level before child"
- **Root** is a distinguished node (bottom) representing the most preferred revision

The semantics (from section 2.1, p. 14-15): "Rules like the one above for Level_0 state that we want to consider revisions for Level_0 only if, for some rule body, its levels have been considered and there are no revisions at any of those levels."

Translation: The revision mechanism tries to find consistent programs using only literals from the most preferred (lowest in graph) levels. If impossible, it explores less preferred levels. This implements best-first search over the revision space, pruning branches that require changing highly preferred literals.

## Desire Selection Preference Graph

For intention selection (Definition 9, p. 20-21), the graph is:

**Bottom level**: Rev(bottom) = {happens(E, Ti, Tf), act(E, A)}  
Meaning: The most preferred solutions involve only abducing actions—don't unselect any desires. Try to satisfy all eligible desires by finding a plan.

**Level i (for each importance rank i)**: Rev(level_i) = {unsel(D) | importance(D) = i} ∪ Rev(bottom)  
Meaning: If bottom level fails, permit dropping desires of importance rank i. The literals in this level are "unsel(D)" for desires D with that importance, plus all literals from lower levels (actions).

**Edge structure**: 
- level_i → bottom (for all i): Try bottom before any desire-dropping level
- level_i → level_j if importance(i) < importance(j): Try dropping less important desires before more important

This encodes the deliberation policy: "Maximize desires satisfied, prioritizing by importance." The graph structure makes this policy explicit and drives the search algorithm.

## How Preference Guides Search

The revision algorithm (from [Damásio, Nejdl, Pereira 1994], referenced p. 14) works:

1. Start at leaves of preference graph (most preferred levels)
2. Attempt to find a consistent program using only literals in those levels
3. If successful, return that revision (it's optimal according to preference)
4. If impossible, mark those levels as failed, move to next level in graph
5. Repeat until a revision is found or all levels exhausted

For the desire selection graph:

**Step 1**: Try Rev(bottom)—abduce actions satisfying all eligible desires  
If successful: All desires become intentions (best case)  
If fails: Some desires are mutually incompatible

**Step 2**: Try Rev(level_min), where level_min corresponds to least important desires  
Now can abduce actions AND set unsel(D_min) = true for least important desires  
If successful: Drop only least important desires, keep all others  
If fails: Even dropping least important isn't enough

**Step 3**: Try Rev(level_next), next importance level  
Can drop desires up to this importance level  
Continue until a consistent subset is found

This is much more efficient than enumerating all subsets of desires and scoring them. The graph prunes search: Once you find a solution at level L, you don't explore higher (less preferred) levels at all.

## The Preference Relation as Graph Compilation

The preference graph *compiles* the preference relation (Definition 7) into search structure. Definition 7 states: "R <_Pref S (R is less preferred than S) if the biggest value for importance occurring in S and not occurring in R is bigger than the biggest value for importance occurring in R and not occurring in S; if there is no such biggest value in S, than R is less preferred than S if S has more elements than R" (p. 20).

This is lexicographic preference: Importance is primary criterion, cardinality (number of desires satisfied) is tiebreaker. The graph encodes this:

- **Importance**: Levels correspond to importance ranks. Edges ensure low-importance levels are tried before high-importance.
- **Cardinality**: Within a level, the revision mechanism finds *minimal* changes. Dropping one desire (minimal) is preferred over dropping two (non-minimal).

So the graph structure naturally implements the preference relation. You don't need separate code to evaluate preference—the search algorithm using the graph will find preferred revisions first.

## Secondary Criteria and Tiebreaking

Even with the preference graph, multiple minimal revisions might exist at the same level. Example: Two desires d1, d2 both have importance 0.5. They conflict. The revision mechanism can either:
- Set unsel(d1) = true, satisfy d2
- Set unsel(d2) = true, satisfy d1

Both are minimal revisions at the same preference level. The graph doesn't distinguish them. This is where secondary criteria apply.

The authors note: "if an agent were to choose between d1={des(_, Ag, b, [0.5])} and d2={des(_, Ag, c, [0.5])}, based only on the importance of desires and maximization of desires satisfied, it would not prefer either of them. And, indeed, according to the preference relation, we have that neither (d1 <_Pref d2) nor (d2 <_Pref d1)" (Example 8, p. 20).

When the preference relation is indifferent, the agent can:
1. **Choose arbitrarily**: Pick any minimal revision (non-deterministic choice)
2. **Apply secondary criteria**: Urgency, resource cost, stakeholder priority, etc.
3. **Return all ties**: Present multiple options to a higher-level decision maker

The paper leaves this open: "When multiple candidate sets exist (different ways to satisfy desires), apply preference relation. This could be a scoring function, constraint optimization, or the revision preference graph approach" (implied throughout section 4.1).

For WinDAG systems: Implement secondary preference as a scoring function applied to tied minimal revisions. The preference graph does the heavy lifting (pruning most of the space), then scoring resolves final ties.

## Example: Incremental Preference Levels

Consider desires with importance levels 0.3, 0.5, 0.7, 0.9:

**Graph**:
```
bottom → (abduce actions, keep all)
  ↓
level_03 → (drop 0.3 desires, keep 0.5, 0.7, 0.9)
  ↓
level_05 → (drop 0.3, 0.5 desires, keep 0.7, 0.9)
  ↓
level_07 → (drop 0.3, 0.5, 0.7 desires, keep 0.9)
  ↓
level_09 → (drop all if necessary)
```

**Search**: 
1. Try bottom: Satisfy all desires? If yes → done (optimal)
2. If no, try level_03: Drop only 0.3 desires? If yes → done (second-best)
3. If no, try level_05: Drop 0.3 and 0.5? If yes → done
4. Continue...

Each level adds more freedom (more literals are revisable). The graph ensures we add freedom gradually, trying most constrained (preferred) levels first.

## Compositional Preference: Combining Criteria

The preference graph framework is compositional—you can combine multiple preference dimensions. Suppose you want:
1. Prefer more important desires
2. Among equally important, prefer less resource-expensive desires
3. Among equal cost, prefer desires from higher-authority stakeholders

Implement this with a multi-dimensional graph:

**Dimension 1 (Importance)**: Main spine of graph, as above

**Dimension 2 (Cost)**: Within each importance level, sub-levels for cost brackets:
```
level_imp09 → level_imp09_low_cost → level_imp09_med_cost → level_imp09_high_cost
```

**Dimension 3 (Stakeholder)**: Within cost sub-levels, further refinement

This creates a hierarchical preference structure. Search explores in lexicographic order: importance dominates cost dominates stakeholder. The graph structure encodes the priority, the algorithm traverses it.

## Generalizing Beyond Desires: Belief Revision Preferences

Though the paper focuses on intention selection, the preference mechanism applies to any revision problem. For belief revision (handling contradictory information):

**Bottom level**: Keep all beliefs (most preferred—don't drop anything)

**Level i**: Drop beliefs from source i (e.g., sensor readings vs. prior knowledge)

**Edges**: Prefer keeping high-reliability sources, drop low-reliability first

This implements *trust-based belief revision*: When information conflicts, prefer more reliable sources. The same revision machinery, different preference graph.

Similarly for plan repair: When a plan becomes infeasible, the preference graph could encode "prefer replanning over abandoning the goal; prefer local repairs over full replanning; prefer cheaper repairs over expensive."

The lesson: Preference graphs are a general mechanism for encoding search strategies in revision problems. Not specific to BDI desires.

## Implementation for WinDAG Orchestration

For skill composition/orchestration:

**Scenario**: Multiple skills can achieve a goal (e.g., "analyze code quality"). Skills have attributes: importance (how critical their analysis is), cost (time/tokens), dependencies (what artifacts they need).

**Preference Graph**:
```
bottom → (invoke all relevant skills)
  ↓
level_optional → (drop optional skills, keep critical)
  ↓
level_expensive → (drop expensive skills if over budget)
  ↓
level_critical → (drop even critical if absolutely necessary)
```

**Search**: Try to compose all skills. If over budget/time, drop optional ones first. If still infeasible, drop expensive ones. Only in extremis drop critical skills.

**Implementation**:
```python
class SkillOrchestrationRevision:
    def __init__(self, skills, constraints):
        self.skills = skills
        self.constraints = constraints  # time, memory, etc.
        self.preference_graph = self._build_graph()
    
    def _build_graph(self):
        # Create levels based on skill importance
        levels = {
            'bottom': [s for s in self.skills],
            'drop_optional': [s for s in self.skills if s.importance > 0.5],
            'drop_expensive': [s for s in self.skills if s.importance > 0.7 or s.cost < threshold],
            'drop_critical': [s for s in self.skills if s.importance >= 0.9],
        }
        edges = [
            ('drop_optional', 'bottom'),
            ('drop_expensive', 'drop_optional'),
            ('drop_critical', 'drop_expensive'),
        ]
        return PreferenceGraph(levels, edges)
    
    def select_skills(self):
        for level in self.preference_graph.traverse():
            candidate_skills = self.preference_graph.get_level(level)
            if self._check_feasibility(candidate_skills):
                return candidate_skills
        return None  # No feasible solution
```

This automates skill selection under constraints, preferring richer analysis when possible, gracefully degrading when resource-limited.

## Boundary Conditions

Preference graphs work well when:

**1. Preferences Have Structure**: If preferences are arbitrary (no clear levels/ordering), encoding them in a graph is hard. Best suited for hierarchical or lexicographic preferences.

**2. Levels Are Not Too Granular**: If every desire has unique importance (100 distinct levels), the graph becomes a linear chain with no pruning benefit. Works best when importance clusters into a manageable number of levels (<10).

**3. Revision Is Tractable**: The graph guides search but doesn't eliminate search. If the underlying revision problem is intractable (huge state space), the graph helps but doesn't solve it. Need additional techniques (heuristics, anytime search, abstraction).

**4. Preferences Are Static During Search**: The graph encodes a fixed preference order. If preferences change dynamically (e.g., based on partial search results), the graph would need rebuilding. Static preferences are easier.

## The Deeper Insight: Policy as Data Structure

The profound lesson: **Deliberation policy can be declaratively specified as a data structure (graph), then executed by a generic algorithm (revision search)**. You don't write procedural code like:

```python
def select_intentions(desires):
    # Try all desires
    if feasible(desires):
        return desires
    # Drop least important
    for d in sorted(desires, key=lambda x: x.importance):
        subset = desires - {d}
        if feasible(subset):
            return subset
    # etc.
```

Instead, you specify the preference graph declaratively, and the revision algorithm interprets it:

```python
def select_intentions(desires):
    graph = build_preference_graph(desires)
    return revision_search(program, graph)
```

This separation of policy (graph) and mechanism (search) is powerful:
- **Modular**: Change policy without changing algorithm
- **Analyzable**: Formally verify properties of policies (e.g., guarantee important desires are never dropped if feasible)
- **Reusable**: Same algorithm works for different problems (desires, beliefs, plans) with different graphs
- **Debuggable**: Trace which graph levels were explored, why certain revisions were chosen

For WinDAG systems: When designing decision-making components (task decomposition, skill selection, resource allocation), favor declarative specification of preferences (graphs, constraints, scoring functions) over procedural logic. This makes the system's priorities explicit, auditable, and reconfigurable without code changes.

Móra et al. demonstrate that this approach bridges theory and practice: The preference graph is both a formal specification (precisely defines preference semantics) and an operational implementation (directly drives the search algorithm). No gap between "what we want" and "how to compute it."