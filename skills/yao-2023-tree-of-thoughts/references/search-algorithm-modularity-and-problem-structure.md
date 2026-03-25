# Search Algorithm Modularity: Matching Exploration Strategy to Problem Structure

## The Core Design Principle

One of ToT's most important but understated contributions is its **separation of concerns between thought structure, evaluation mechanisms, and search algorithms**. The paper states: "To design such a planning process, we return to the origins of artificial intelligence (and cognitive science), drawing inspiration from the planning processes explored by Newell, Shaw, and Simon starting in the 1950s."

This isn't nostalgia—it's recognizing that classical AI's modularity insights remain valuable. ToT implements four independent components:

1. **Thought decomposition**: What granularity of intermediate steps?
2. **Thought generation**: How to propose candidate next steps?
3. **State evaluation**: How to judge which states are promising?
4. **Search algorithm**: How to systematically explore the thought tree?

The paper demonstrates that components 1-3 must be carefully designed per task, but component 4 (search algorithm) can be relatively generic—**if** chosen appropriately for the problem's tree structure.

## Two Canonical Search Strategies

### Breadth-First Search (BFS) - Algorithm 1

**Structure**:
```
For each depth level t:
  Generate k candidate thoughts for each of the b states from previous level
  Evaluate all b × k candidate next-states
  Keep the top b states based on evaluation scores
Continue until solution found or depth limit T reached
```

**When BFS Works** (Game of 24, Creative Writing):

The paper explicitly states: "This is used for Game of 24 and Creative Writing where the tree depth is limit (T ≤ 3), and initial thought steps can be evaluated and pruned to a small set (b ≤ 5)."

**Critical properties**:
1. **Shallow trees** (T ≤ 3): BFS explores all branches at each level before going deeper. With depth 10, this becomes intractable even with small b.
2. **Good early discrimination** (b ≤ 5): Evaluation must be reliable enough to identify the best 5 out of 25-50 candidates at each level. Poor evaluation → pruning good paths.
3. **High branching without local exploitation**: Many possible next steps, and no obvious greedy strategy. Need to maintain multiple hypotheses in parallel.

**Game of 24 Example**:
- Input: 4 9 10 13
- Depth 1: Generate ~10-15 possible equations, evaluate each, keep best 5
  - Example: "13 - 9 = 4 (left: 4 4 10)" scores "likely"
  - "4 + 9 = 13 (left: 10 13 13)" scores "likely"  
  - "4 - 9 = -5 (left: 10 13 -5)" scores "impossible" → pruned
- Depth 2: For each of 5 kept states, generate ~10 equations, keep best 5 overall
- Depth 3: For each of 5 kept states, generate final step
- Total nodes evaluated: ~5 × 10 + 5 × 10 + 5 = ~105 nodes

Compare to exhaustive search: ~15^3 = 3375 nodes, or simple chain sampling: 100 independent attempts with ~4% success (Table 2).

**The tradeoff**: BFS pays high evaluation cost at early levels (must score all candidates to pick best b) but avoids exploring unpromising subtrees. Works when:
- Evaluation cost < wasted exploration cost
- Depth is limited (otherwise exponential blowup even with pruning)

### Depth-First Search (DFS) - Algorithm 2

**Structure**:
```
Starting from root:
  Generate k candidate thoughts, sorted by promise
  For each candidate (best-first order):
    If evaluation deems promising (above threshold):
      Recursively explore this subtree with DFS
    If evaluation deems unpromising:
      Prune: backtrack to parent, try next sibling
Continue until solution found or all paths exhausted
```

**When DFS Works** (Mini Crosswords):

The paper states: "We leverage a depth-first search that keeps exploring the most promising subsequent word clue until the state is no longer promising, then backtrack to the parent state to explore alternative thoughts."

**Critical properties**:
1. **Deep trees** (T = 5-10 or variable): DFS explores one path completely before trying alternatives. Memory efficient for deep trees.
2. **Reliable pruning heuristics**: Can detect dead-ends before reaching terminal states. Without this, DFS wastes time going down rabbit holes.
3. **Constraint propagation**: Early decisions restrict later options, so dead-ends become apparent before tree depth is exhausted.

**Crosswords Example**:
- Input: 10 clues (5 horizontal, 5 vertical) for 5×5 grid
- DFS picks most promising clue to fill (say h2: "motor")
- This adds letters: M_T_R constrains v1 (must start with M), v2 (must have O), etc.
- Evaluate remaining clues: "v1: To heap (pattern: 'tm_s_')" → check if any valid word exists
  - If no valid words: prune this entire subtree, backtrack, try different word for h2
  - If valid words exist: recursively fill v1, which further constrains h1, h3...
- Key constraint: "subsequent thoughts are constrained not to change any filled words or letters, so that the ToT has at most 10 intermediate steps"

Without this constraint, backtracking could modify arbitrary previous decisions → exponential state space. With it, tree depth is bounded by number of clues.

**The tradeoff**: DFS commits to promising path early, explores deeply before trying alternatives. Works when:
- Dead-ends are detectable (pruning prevents wasted deep exploration)
- Best-first ordering identifies good paths early (otherwise thrashes through bad paths)
- Memory limited but time available (DFS uses O(depth) memory vs BFS's O(breadth^depth))

## The Crosswords Ablation: Why Search Strategy Matters

Table 3 provides crucial experimental evidence:

| Method | Letter | Word | Game |
|--------|--------|------|------|
| IO | 38.7% | 14% | 0% |
| CoT | 40.6% | 15.6% | 1% |
| **ToT** | **78%** | **60%** | **20%** |
| +best state | 82.4% | 67.5% | 35% |
| -prune | 65.4% | 41.5% | 5% |
| -backtrack | 54.6% | 20% | 5% |

**Key insights**:

**"+best state" (oracle final state selection)**:
ToT's heuristic for "which explored state is the solution" is imperfect. With oracle selection (picking the actual deepest correct state), performance jumps from 60% → 67.5% word accuracy and 20% → 35% game success.

This means ~13% of the time, ToT found the solution during search but incorrectly identified it as non-terminal. Improving terminal state recognition would boost performance without changing search.

**"-prune" (DFS without pruning impossible states)**:
Performance drops from 60% → 41.5% word accuracy. But interestingly, this version solves 4/20 games correctly (only outputs 1 via heuristic), and 3 of those are games ToT+pruning cannot solve within 100 steps.

**What this reveals**: The pruning heuristic (GPT-4 judging "is this word valid?") is imperfect—sometimes marks valid words impossible (like "agend"). Without pruning, search occasionally stumbles onto correct solutions that would have been pruned. But overall, pruning's efficiency gain (not exploring dead-ends) outweighs its errors (occasionally pruning good paths).

**"-backtrack" (greedy best-first, no backtracking)**:
Performance collapses from 60% → 20% word accuracy. This is "similar to a 'greedy' BFS search with breadth limit of b = 1"—always fill the most promising remaining clue, allowing overwrites.

**Why it fails**: Without backtracking, early mistakes compound. If h2 is filled incorrectly, constraining all vertical clues, the system has no mechanism to revise h2. It must either:
- Overwrite h2 (but this invalidates dependent vertical words → cascading invalidation)
- Continue with wrong h2 (provably unsolvable)

Backtracking is essential when early decisions constrain later ones.

## Implications for Agent Orchestration

### 1. Search Strategy Should Be Configurable Per Task

Agent systems often hard-code exploration strategies (e.g., "always try all subtasks in parallel" or "always do sequential refinement"). ToT demonstrates this is a mistake.

**Task properties determining search strategy**:

| Property | Favors BFS | Favors DFS |
|----------|-----------|-----------|
| Tree depth | Shallow (≤3) | Deep (>5) |
| Branching factor | High (>10) | Moderate (<10) |
| Evaluation reliability | High (good pruning) | Variable (need multiple attempts) |
| Constraint propagation | Low (independent branches) | High (early decisions limit later) |
| Dead-end detection | Hard (must reach terminal state) | Easy (local inconsistency check) |
| Solution density | Sparse (few correct paths) | Dense (many paths to solution) |

An orchestration system should allow:
```yaml
search_config:
  algorithm: bfs
  breadth_limit: 5
  depth_limit: 3
  evaluation_samples: 3
```

vs.

```yaml
search_config:
  algorithm: dfs
  max_depth: 20
  pruning_threshold: 0.3
  best_first_ordering: true
```

### 2. Hybrid Search Strategies for Complex Tasks

The paper uses pure BFS or pure DFS, but real-world tasks might benefit from hybrids:

**BFS early, DFS later**:
- Use BFS for first 2 levels to explore diverse high-level approaches
- Switch to DFS for detailed implementation of top approaches
- Rationale: Early exploration benefits from parallelism; deep execution benefits from sequential refinement

**Beam search with backtracking**:
- Maintain beam of b paths, explore each with DFS
- If all paths in beam get pruned, backtrack to previous beam level
- Rationale: More robust than pure DFS (doesn't commit to single path), more efficient than pure BFS (doesn't explore all branches)

**Iterative deepening**:
- DFS with increasing depth limits: depth 1, then 2, then 3...
- If solution found at depth d, return; else increase depth
- Rationale: Combines DFS memory efficiency with BFS's guarantee of finding shallowest solution

The paper hints at this: "We explore two relatively simple search algorithms and leave more advanced ones (e.g. A* [11], MCTS [2]) for future work."

### 3. The 100-Step Budget and Search Horizons

The crosswords experiment "limit DFS search steps to 100." This is a practical constraint: with unlimited steps, DFS might explore unproductively.

This raises a key design question for agent systems: **How to allocate fixed computational budget across search strategies?**

Options:
- **Time-bounded**: Search for N seconds, return best state found
- **Node-bounded**: Evaluate at most M states, return best terminal state
- **Solution-bounded**: Search until K solutions found, return best (if K=1, first solution)
- **Quality-bounded**: Search until solution exceeds quality threshold Q

The crosswords approach is node-bounded (100 steps). Game of 24 is implicitly solution-bounded (stops at first complete equation) with depth-bounded BFS (T=3 levels).

An agent system should expose budget configuration:
```python
search_result = search(
    problem=task,
    algorithm=DFS,
    budget={"max_nodes": 100, "timeout_sec": 30},
    termination={"first_solution": True}
)
```

### 4. Backtracking Requires Explicit State Management

The -backtrack ablation shows backtracking is essential for constraint-heavy tasks. But backtracking requires the system to maintain:

1. **State history**: Full tree of explored states, not just current path
2. **Undo mechanism**: Ability to restore previous state without side effects
3. **Exploration ordering**: Which sibling to try next after backtrack

For agent systems with side effects (API calls, file writes, environment changes), backtracking is non-trivial:
- Can't always undo actions (email sent, payment processed)
- State restoration may be expensive (database rollback, environment reset)
- Partial effects may persist (cached results, logged events)

**Design implications**:
- Separate planning (in pure thought space, fully backtrackable) from execution (in real world, not backtrackable)
- Use transactional execution when possible (commit only after search completes)
- For non-transactional tasks, limit backtracking to checkpoints

The crosswords task is naturally backtrackable (unfilling a word has no side effects). Code refactoring is partially backtrackable (git revert, but may break dependencies). Web automation is often not backtrackable (actions like "post comment" are permanent).

### 5. Early Stopping and Solution Recognition

The +best state ablation shows ToT's solution recognition is imperfect. It uses a simple heuristic: "simply render the deepest explored state (the first explored one if multiple) into the final output."

**Why this is suboptimal**:
- Assumes deeper = better (not always true, may be stuck in dead-end)
- Doesn't use solution verification (check if all crossword clues satisfied)
- Doesn't leverage evaluation scores from search (states marked "likely" during search aren't prioritized for output)

**Better strategies**:
1. **Explicit solution verification**: Check if candidate state satisfies all problem constraints
2. **Multi-criteria ranking**: Combine depth, evaluation score, and solution completeness
3. **Post-search refinement**: Take best K states, try to complete/fix each, return best result

For agent systems, this means:
- Search algorithm should maintain candidate solutions, not just current path
- Final output selection should be separate phase after search
- May want to continue search even after finding first solution (to find better ones)

## The Deeper Architectural Point: Search as a First-Class Abstraction

Most LLM agent frameworks treat search implicitly—hidden inside prompts or hardcoded in control flow. ToT makes search explicit and modular:

```python
# Simplified ToT interface
result = tree_of_thought(
    problem=input,
    thought_decomposition=lambda s: propose_next_thoughts(s),
    state_evaluation=lambda states: [evaluate(s) for s in states],
    search_algorithm=BFS(breadth=5, depth=3),
    termination=first_valid_solution
)
```

This enables:
- **Debugging search**: Visualize tree, identify where good paths were pruned
- **Testing components**: Evaluate thought quality independently of search algorithm
- **Configuration**: Non-experts can try different search strategies without code changes
- **Optimization**: Profile where computation is spent (generation vs evaluation vs search overhead)

The paper's codebase reflects this: separate modules for prompts (thought generation/evaluation), search algorithms (BFS/DFS), and tasks (problem-specific decomposition).

For agent orchestration systems, this suggests:
- Search should be a reusable component, not reimplemented per task
- Task definitions should specify thought structure and evaluation, but not search strategy (which could be configured or auto-selected)
- Monitoring should expose search metrics (nodes evaluated, branches pruned, backtrack count)

## Boundary Conditions: When Search Doesn't Help

The paper acknowledges: "Deliberate search such as ToT might not be necessary for many existing tasks that GPT-4 already excels at."

**When simple prompting suffices**:
- Output directly determinable from input (translation, summarization)
- Single-path reasoning (deterministic calculation, fact lookup)
- Open-ended generation where first attempt is satisfactory (simple story writing)

**When search overhead exceeds benefit**:
- Very high branching factor + deep trees → exponential blowup even with pruning
- Poor evaluation heuristics → random search, no convergence
- Solution space so sparse that exploration unlikely to find anything

The GSM8k and StrategyQA experiments (Appendix B.1, Table 4) show ToT provides only marginal gains over CoT on these tasks:
- GSM8k: CoT 86% → ToT 90%
- StrategyQA: CoT 82% → ToT 83%

**Why**: These tasks have relatively linear reasoning chains. Search doesn't help much when there's essentially one good path. The 4% GSM8k improvement might come from catching arithmetic errors through evaluation, not fundamental reasoning benefits.

This suggests a meta-question for agent systems: **When should we invoke search vs. direct generation?**

Possible heuristics:
- If task has known evaluation criteria → enable search
- If past attempts failed → enable search for alternative approaches
- If problem has multiple steps with uncertain dependencies → enable search
- If time-constrained and single path likely sufficient → disable search

The ToT paper doesn't address this meta-level decision, but real agent systems must.

## Connection to Classical Planning

The paper explicitly invokes Newell, Shaw, and Simon: "We return to the origins of artificial intelligence (and cognitive science), drawing inspiration from the planning processes explored by Newell, Shaw, and Simon starting in the 1950s. Newell and colleagues characterized problem solving as search through a combinatorial problem space, represented as a tree."

This isn't just historical context—it's a claim that **the classical AI paradigm of search-based problem solving remains fundamental**, even with modern LLMs.

The key additions that LLMs provide:
1. **Heuristic generation through language**: Classical systems used hand-coded heuristics; LLMs can reason about what makes a state promising
2. **Flexible problem representation**: Classical systems required formal state representations; LLMs work with natural language thoughts
3. **Transfer across tasks**: Classical systems were domain-specific; LLMs apply same search framework to crosswords, math, writing

But the core insight—**problem solving as heuristic-guided search through a tree of partial solutions**—remains unchanged from the 1950s.

This suggests that modern AI progress isn't making classical paradigms obsolete, but rather providing better implementations of the same fundamental algorithms.