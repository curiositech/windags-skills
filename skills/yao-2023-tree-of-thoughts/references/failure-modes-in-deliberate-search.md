# Failure Modes in Deliberate Search: When Planning Goes Wrong

## Overview

The Tree of Thoughts paper demonstrates impressive successes, but embedded in the experiments and ablations are critical lessons about **when and why deliberate search fails**. These failures aren't bugs to be fixed—they're fundamental limitations that emerge from the nature of heuristic-guided search with imperfect evaluators.

Understanding these failure modes is essential for agent systems: knowing when your planning approach will fail is as important as knowing when it will succeed.

## Failure Mode 1: Evaluation Knows Less Than Generator

### The Crossword Word Recognition Problem

The paper notes: "Sometimes when the crosswords game is actually solved, the state evaluator might still deem some words as 'impossible' and prune—possibly because 5 × 5 crosswords by design have some rare or obsolete words that GPT-4 cannot recognize."

**Specific example**: "agend" (obsolete form of "agendum") is marked impossible because GPT-4 thinks it's a typo for "agenda."

**Why this happens**: 
- Generator (when filling crosswords): Proposes "agend" based on letter pattern "_gend" and clue
- Evaluator (when checking validity): Doesn't recognize "agend" as a valid English word
- Result: Correct solution path gets pruned

**The deeper issue**: Generator and evaluator use the same LLM, but in different modes:
- Generation mode: Associative, produces words matching patterns
- Evaluation mode: Deliberative, checks against explicit knowledge
- These modes access different aspects of the LLM's knowledge

**Implications for agent systems**:

1. **Generator-evaluator knowledge mismatch is unavoidable**: Even with the same underlying model, different prompting strategies access different knowledge subsets.

2. **Evaluation cannot be trusted as ground truth**: A state marked "impossible" might still lead to valid solutions. Evaluation provides heuristic guidance, not logical guarantees.

3. **Consider confidence calibration**: Instead of hard pruning on "impossible," maintain probability of evaluation error:
   ```python
   if evaluation == "impossible":
       if random() < false_negative_rate:  # small chance evaluator is wrong
           continue_exploring(state)
       else:
           prune(state)
   ```

4. **Hybrid evaluation strategies**: Combine LLM evaluation with external tools:
   ```python
   def evaluate_crossword_word(word, pattern):
       llm_valid = ask_llm(f"Is {word} a valid English word?")
       dict_valid = dictionary_lookup(word)
       return llm_valid or dict_valid  # accept if either confirms
   ```

The ablation study ("-prune" in Table 3) confirms this: removing pruning entirely drops word accuracy from 60% → 41.5%, but allows solving 3 problems that ToT+pruning cannot solve. The imperfect pruning heuristic helps on average but hurts on specific cases.

## Failure Mode 2: Evaluation is Expensive Relative to Generation

### The Cost-Performance Tradeoff

Table 7 (Game of 24 cost analysis):
- IO (best of 100): 1.8k/1.0k tokens, $0.13 per task, 33% success
- CoT (best of 100): 6.7k/2.2k tokens, $0.47 per task, 49% success
- ToT: 5.5k/1.4k tokens, $0.74 per task, 74% success

**The calculation**: ToT costs ~1.6x more than exhaustive CoT sampling (100 attempts), while achieving 1.5x better success rate (74% vs 49%).

**Why this matters**:
- Evaluation in ToT requires prompting the LLM multiple times per state (3 samples for Game of 24)
- BFS requires evaluating all candidates at each level before pruning
- Total evaluation cost can exceed generation cost

**Scenario where evaluation cost dominates**:
- Depth 3 tree, breadth 5, 10 candidates per expansion
- Level 1: generate 10 thoughts → evaluate 10 states (3 samples each = 30 eval calls) → keep 5
- Level 2: generate 50 thoughts (5 × 10) → evaluate 50 states (150 eval calls) → keep 5  
- Level 3: generate 50 thoughts → evaluate 50 states (150 eval calls) → final solution
- **Total**: 110 generations, 330 evaluations

If evaluations are longer/slower than generations, this becomes prohibitively expensive.

**Implications for agent systems**:

1. **Evaluation budget must be explicit**:
   ```python
   search_config = {
       "max_generations": 100,
       "max_evaluations": 200,  # might hit eval limit before generation limit
       "eval_samples": 3  # reduce if budget-constrained
   }
   ```

2. **Adaptive evaluation granularity**: Use expensive multi-sample evaluation only when needed:
   ```python
   def adaptive_evaluate(state, depth):
       if depth < 2:  # early: cheap evaluation
           return quick_heuristic(state)
       elif is_promising(state):  # mid: detailed for good states
           return multi_sample_eval(state, samples=5)
       else:  # prune clearly bad states cheaply
           return single_sample_eval(state)
   ```

3. **Amortize evaluation across similar states**: If multiple states share structure, evaluate once:
   ```python
   # Instead of evaluating each "4 - 9 = -5 (left: 10, 13, -5)" separately,
   # evaluate "can numbers [10, 13, -5] reach 24?" once, 
   # reuse for all states with these remaining numbers
   ```

4. **Consider learned evaluators**: For tasks where search is frequent, train a lightweight evaluator (distilled from LLM evaluations) that's faster at inference time.

## Failure Mode 3: Solution Recognition Failure

### The "Best State" Selection Problem

Table 3 ablation: ToT achieves 60% word accuracy, but "+best state" (oracle selection of actual deepest correct state) achieves 67.5%. This means ~7.5% of the time, ToT found the correct solution during search but failed to recognize it as the final output.

**Why this happens**: ToT uses a simple heuristic: "simply render the deepest explored state (the first explored one if multiple) into the final output."

**Problems with depth-based selection**:

1. **Depth ≠ correctness**: A deep state might be a dead-end that wasn't pruned yet
   - Example: Filled 8/10 crossword clues incorrectly, but evaluator hasn't detected impossibility

2. **First-explored bias**: If multiple states reach same depth, taking first one is arbitrary
   - Example: Two different word orderings both complete 7/10 clues; first might be wrong solution

3. **No final verification**: Unlike intermediate evaluation (checking if state is promising), no explicit check that final state is actually a valid solution
   - Example: Crossword board might have all 10 words filled, but some words are invalid

**Implications for agent systems**:

1. **Separate search from solution extraction**: Finding good states vs. identifying which is the actual solution are different problems:
   ```python
   frontier = search_algorithm.explore(problem, budget=100)
   candidates = [s for s in frontier if is_potentially_terminal(s)]
   verified = [s for s in candidates if verify_solution(s)]
   return best_of(verified) if verified else best_heuristic(candidates)
   ```

2. **Solution verification should be strict**: Unlike heuristic evaluation during search (which can be loose), final verification should check actual problem constraints:
   ```python
   def verify_crossword(state):
       # Not "is this state promising?" but "does this satisfy all constraints?"
       for clue, word in state.words.items():
           if not word_matches_clue(clue, word):
               return False
           if not satisfies_crossing_constraints(word, state):
               return False
       return True
   ```

3. **Multi-criteria ranking**: Combine multiple signals for final selection:
   ```python
   def rank_solutions(candidates):
       return sorted(candidates, key=lambda s: (
           is_complete(s),           # complete solutions first
           verification_score(s),    # how well does it satisfy constraints?
           depth(s),                 # how much work was done?
           evaluation_score(s)       # what did search think of it?
       ), reverse=True)
   ```

4. **Continue search after first solution**: Don't stop at first valid solution; find multiple and pick best:
   ```python
   solutions = []
   while len(solutions) < k and not out_of_budget():
       state = search_step()
       if verify_solution(state):
           solutions.append(state)
   return best_of(solutions)
   ```

## Failure Mode 4: Backtracking Inability

### The No-Backtrack Ablation

Table 3: Removing backtracking ("-backtrack") drops word accuracy from 60% → 20%. This is a 3x performance drop, making ToT barely better than CoT (15.6%).

**What the ablation does**: "greedy" BFS with b=1, allowing overwrites—always fill the most promising remaining clue, but can't undo previous decisions except by overwriting.

**Why it fails so badly**:

1. **Early mistakes compound**: If h2 (second horizontal word) is filled incorrectly, all vertical clues intersecting it are now constrained by wrong letters.

2. **Overwriting causes cascading invalidation**: 
   - Fill h2: "motor" 
   - Fill v1 based on 'm': "might"
   - Realize h2 should be "mason" not "motor"
   - Overwrite h2 → v1's first letter is now wrong
   - Must overwrite v1 → this affects h1
   - Cascading rewrites explode search space

3. **No principled undo mechanism**: Overwriting is not true backtracking—it doesn't restore the state to "before h2 was filled," it just changes h2's value while keeping all dependent decisions.

**The deeper issue**: Some problem structures are fundamentally hierarchical with dependencies. Early decisions constrain later ones. Without backtracking, you're committed to early decisions even when they're wrong.

**Implications for agent systems**:

1. **Backtracking is essential for constraint-heavy tasks**: Any problem where early decisions constrain later ones (code refactoring, planning, configuration) benefits from backtracking.

2. **But backtracking requires side-effect-free operations**: You can backtrack word fills in a crossword (no side effects). You can't always backtrack in real-world systems:
   - Can't un-send an email after realizing the approach was wrong
   - Can't un-deploy code after search decides different implementation is better
   - Can't un-make API calls that charge money or have rate limits

3. **Distinguish planning vs. execution**:
   ```python
   # Planning phase: fully backtrackable
   plan = search_in_pure_thought_space(problem)
   
   # Execution phase: commits to real world, not backtrackable
   execute(plan)
   ```
   
   ToT operates entirely in "thought space" where backtracking is free. Real agent systems must carefully delineate this boundary.

4. **Checkpointing for expensive-to-recompute states**: If backtracking requires recomputing expensive operations, maintain checkpoints:
   ```python
   checkpoints = {}
   
   def explore_with_checkpointing(state, depth):
       if depth % checkpoint_interval == 0:
           checkpoints[depth] = deepcopy(state)
       
       result = explore(state)
       if result.failed and depth > checkpoint_interval:
           state = checkpoints[depth - checkpoint_interval]
           return explore_with_checkpointing(state, depth - checkpoint_interval)
   ```

## Failure Mode 5: Search Budget Exhaustion Before Solution Found

### The 100-Step Limit

Crosswords experiments: "We limit DFS search steps to 100, and simply render the deepest explored state (the first explored one if multiple) into the final output."

**What happens at step 100**: Search stops, return best state found so far (even if not a valid solution).

**Why this is necessary**: Without a budget limit, DFS might explore indefinitely on unsolvable problems or get stuck in unproductive regions of search space.

**The tradeoff**: 
- Too small budget → stop before solution found
- Too large budget → waste computation on unpromising paths
- Optimal budget depends on problem difficulty (unknown in advance)

**Evidence this hurts performance**: The "-prune" ablation finds correct solutions for 3 problems that ToT+pruning cannot solve within 100 steps. These are likely problems where:
- Correct solution is deep in the tree (requires >100 steps with pruning)
- Pruning eliminates the direct path, forcing longer exploration
- Without pruning, the correct path is eventually found (before 100 steps)

**Implications for agent systems**:

1. **Budget allocation is a critical hyperparameter**: No universal right answer; depends on:
   - Problem difficulty (harder → more budget)
   - Solution density (sparse solutions → more budget)
   - Evaluation quality (poor evaluator → more budget to compensate)

2. **Adaptive budgets based on progress**:
   ```python
   def adaptive_search(problem):
       budget = initial_budget
       result = search(problem, budget=budget)
       
       while not is_valid_solution(result) and budget < max_budget:
           if made_progress(result):  # getting closer to solution
               budget *= 2  # double budget
           else:
               budget *= 1.5  # increase more conservatively
           result = search(problem, budget=budget)
       
       return result
   ```

3. **Anytime algorithms**: Design search to return best-so-far solution at any point:
   ```python
   def anytime_search(problem, time_limit):
       best_so_far = None
       start_time = time()
       
       while time() - start_time < time_limit:
           state = search_step()
           if better_than(state, best_so_far):
               best_so_far = state
       
       return best_so_far  # return current best, even if not optimal
   ```

4. **Iterative deepening**: Start with small budget, increase if no solution found:
   ```python
   for depth_limit in [3, 5, 10, 20, 50]:
       result = search(problem, max_depth=depth_limit)
       if is_valid_solution(result):
           return result
   # exhausted all depth limits without finding solution
   ```

## Failure Mode 6: Thought Granularity Mismatch

### When Decomposition is Wrong for the Task

The paper carefully designs thought granularity per task (equations for Game of 24, words for crosswords, plans for writing). But what if the decomposition is wrong?

**Too fine-grained**: Game of 24 with token-level thoughts
- Branching factor ~10-30 per thought (possible next tokens)
- Depth ~20-30 tokens to complete solution  
- Search space: 10^20 to 30^30 (intractable)
- Evaluation meaningless: "does the token '4' make progress toward 24?"

**Too coarse-grained**: Game of 24 with solution-level thoughts
- Each thought is a complete equation sequence reaching 24
- Branching factor: all possible equation sequences (thousands)
- Depth: 1 (just pick the solution)
- Evaluation: checking if complete sequence is correct (no intermediate guidance)
- Degenerates to sampling multiple complete solutions (like CoT-SC)

**Just right**: Game of 24 with equation-level thoughts
- Each thought is one equation
- Branching factor: ~10-15 equations per step
- Depth: 3 equations to reach 24
- Search space: ~10^3 to 15^3 (tractable with pruning)
- Evaluation meaningful: "can remaining numbers reach 24?"

**Implications for agent systems**:

1. **Granularity is not a minor implementation detail**: It fundamentally determines whether search is tractable and whether evaluation is meaningful.

2. **Task analysis must identify natural decomposition**: For code review:
   - Too fine: per-line (can't evaluate "does this line improve code quality?")
   - Too coarse: entire PR (no intermediate guidance)
   - Just right: per logical change, per function, or per file (depends on what evaluator can assess)

3. **Hierarchical decomposition for multi-scale problems**: Some tasks need multiple levels:
   ```python
   # Level 1: High-level approach (coarse)
   approach = search_approaches(problem)  # e.g., "refactor X, then optimize Y"
   
   # Level 2: Implementation steps (medium)
   plan = search_implementations(approach)  # e.g., "extract method A, inline variable B"
   
   # Level 3: Detailed changes (fine)
   code = search_details(plan)  # e.g., specific code transformations
   ```

4. **Adaptive refinement**: Start coarse, refine if needed:
   ```python
   def adaptive_decomposition(problem):
       # Try coarse decomposition first
       result = search(problem, thought_size="coarse")
       if is_valid_solution(result):
           return result
       
       # If failed, try finer decomposition
       refined = refine_decomposition(problem)
       return search(refined, thought_size="medium")
   ```

## Failure Mode 7: LLM Capability Ceiling

### When The LLM Just Can't Do It

The GPT-3.5 experiments (Appendix B.2, Tables 5-6) show ToT still helps with weaker models, but with diminishing returns:

**Game of 24**:
- GPT-4+ToT: 74% success
- GPT-3.5+ToT: 19% success (still better than GPT-3.5+CoT's 3%, but dramatically worse than GPT-4)

**Creative Writing**:
- GPT-4+ToT: 7.56 coherency
- GPT-3.5+ToT: 6.62 coherency (closer to GPT-4+ToT than GPT-4+CoT)

**Why this matters**: If the LLM fundamentally cannot evaluate states correctly or generate valid thoughts, search structure won't help.

**Evidence from mixed experiments**: "GPT-4 generation + GPT-3.5 evaluation (64%) and GPT-3.5 generation + GPT-4 evaluation (31%)"

This reveals: **Generation quality is the bottleneck for Game of 24**, not evaluation quality. Even with perfect (GPT-4) evaluation, if generation is weak (GPT-3.5), success rate is only 31%.

**Implications for agent systems**:

1. **Search cannot overcome fundamental capability gaps**: If the LLM cannot generate correct thoughts or cannot evaluate states meaningfully, no amount of search will help.

2. **Invest in generation vs. evaluation based on bottleneck**:
   - Game of 24: Use stronger model for generation (or focus on improving thought proposals)
   - Creative Writing: Use stronger model for evaluation (comparative judgment more critical)

3. **Minimum capability thresholds**: Some tasks require minimum LLM capability for ToT to help:
   - Must be able to generate at least some valid thoughts
   - Must be able to discriminate between good and bad states better than random
   - If below threshold, fall back to simpler strategies (self-consistency, iterative refinement)

4. **Task difficulty must match model capability**:
   ```python
   def select_strategy(task, model):
       task_difficulty = estimate_difficulty(task)
       model_capability = benchmark_score(model)
       
       if model_capability >> task_difficulty:
           return "direct_generation"  # overkill to use search
       elif model_capability > task_difficulty:
           return "minimal_search"  # light deliberation helps
       elif model_capability ≈ task_difficulty:
           return "full_search"  # ToT's sweet spot
       else:
           return "task_too_hard"  # search won't help, need better model
   ```

## Meta-Failure Mode: Using ToT When You Shouldn't

### The GSM8k and StrategyQA Results

Appendix B.1 (Table 4) shows ToT provides minimal benefit on these standard benchmarks:
- GSM8k: CoT 86% → ToT 90% (+4%)
- StrategyQA: CoT 82% → ToT 83% (+1%)

**Why ToT doesn't help much**:
1. **Linear reasoning chains**: These tasks have relatively straightforward solution paths
2. **High baseline performance**: CoT already solves 80%+, little room for improvement
3. **Cost-inefficient**: ToT costs 5-10x more computation for <5% gain

**The lesson**: Don't use System 2 when System 1 suffices.

**Implications for agent systems**:

1. **Default to simpler strategies**: Start with direct generation or CoT, only escalate to ToT when:
   - Initial attempts fail
   - Task properties suggest search is needed (branching, constraints, backtracking)
   - Cost-benefit analysis justifies search overhead

2. **A/B test on representative problems**: Before deploying ToT:
   ```python
   baseline_perf = evaluate(CoT, test_problems)
   tot_perf = evaluate(ToT, test_problems)
   tot_cost = compute_cost(ToT, test_problems)
   
   if tot_perf - baseline_perf > threshold and cost_acceptable(tot_cost):
       deploy(ToT)
   else:
       deploy(CoT)
   ```

3. **Recognize task categories**: Build heuristics for when each approach works:
   - Linear reasoning: CoT
   - Creative open-ended: Direct generation + iterative refinement
   - Constrained search: ToT with BFS
   - Deep exploration: ToT with DFS
   - Multi-step with uncertainty: ToT with adaptive search

## The Broader Pattern: All Heuristic Search Failures

These failure modes are instances of a general principle from classical AI: **Heuristic search trades optimality guarantees for practical tractability, accepting failure modes as necessary costs**.

ToT inherits classical search limitations:
- **Incomplete**: May not find solution even if one exists (budget exhaustion)
- **Suboptimal**: May find worse solution than exists (evaluation errors)
- **Expensive**: May use more computation than necessary (over-exploration)

But ToT adds LLM-specific failure modes:
- **Knowledge-bounded**: Limited by LLM's knowledge (word recognition)
- **Inconsistent**: Same query may get different evaluations (sampling variance)
- **Opaque**: Hard to debug why evaluation failed (no explicit reasoning traces beyond language)

**The pragmatic stance**: These aren't bugs to eliminate, they're tradeoffs to manage. Design agent systems with awareness of:
1. **What can go wrong** (failure modes)
2. **How to detect it** (monitoring, verification)
3. **What to do about it** (fallbacks, adaptive strategies)
4. **When to avoid the approach entirely** (task-strategy matching)

This requires moving beyond "does ToT help on average?" to "when does ToT fail, and how do we mitigate those specific failures?"