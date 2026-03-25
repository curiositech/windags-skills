# LLM Self-Evaluation as Search Heuristic: A Third Way Beyond Programming and Learning

## The Historical Context

Classical AI faced a fundamental challenge in search-based problem solving: how do you determine which nodes in a search tree are promising without exhaustively exploring them? Two paradigms emerged:

1. **Programmed heuristics** (e.g., Deep Blue for chess): Expert human knowledge encoded as explicit evaluation functions. Brittle, domain-specific, requires deep expertise to design.

2. **Learned heuristics** (e.g., AlphaGo): Train neural networks on extensive data to predict state values. Sample-inefficient, requires training infrastructure, struggles with distribution shift.

The Tree of Thoughts paper introduces a third approach: **deliberative heuristics through language-based reasoning**. As the authors state: "We propose a third alternative, by using the LM to deliberately reason about states. When applicable, such a deliberate heuristic can be more flexible than programmed rules, and more sample-efficient than learned models."

This isn't just a minor technical variation—it's a fundamentally different relationship between the problem solver and the evaluation mechanism.

## How LLM Self-Evaluation Works

ToT employs two complementary evaluation strategies, chosen based on problem structure:

### Strategy 1: Independent State Valuation

**Mechanism**: "Value each state independently: V(pθ, S)(s) ∼ p_value^θ(v|s) ∀s ∈ S, where a value prompt reasons about the state s to generate a scalar value v (e.g. 1-10) or a classification (e.g. sure/likely/impossible)."

**Game of 24 Example** (Figure 2b):
```
Input: 4 9 10 13
Thought: 4 - 9 = -5 (left: 10 13 -5)
Evaluation prompt: "Evaluate if given numbers can reach 24 (sure/likely/impossible)"
LLM reasoning: "10 - (-5) * 13 = 10 + 65 = 75, here is no way to obtain 24 with these big numbers."
Result: "impossible"
```

The LM isn't just producing a score—it's engaging in explicit reasoning about whether the state has promise. Crucially, this reasoning can be *wrong* (as crossword experiments show) but still useful as a heuristic.

**Two Sources of Evaluation**:
1. **Lookahead simulation**: "quickly confirm that 5, 5, 14 can reach 24 via 5 + 5 + 14"
2. **Commonsense filtering**: "1 2 3 are too small to reach 24"

Neither requires formal verification. The LM combines approximate forward simulation with background knowledge to produce judgment.

### Strategy 2: Comparative Voting

**Mechanism**: "Vote across states: V(pθ, S)(s) = 1[s = s*], where a 'good' state s* ∼ p_vote^θ(s*|S) is voted out based on deliberately comparing different states in S in a vote prompt."

**Creative Writing Example** (Figure 4c):
```
Task: Write 4 coherent paragraphs ending with specific sentences
Generated plans:
1. Introduce handstand technique, witch to space story, woman using sign language, different perceptions
2. Use required sentences to present self-help book content about embracing challenges
3. [three more alternatives]

Vote prompt: "Analyze each choice in detail, then conclude in the last line 'The best choice is {s}'"
LLM reasoning: "Choice 1, while incorporating the required end sentences, seems to lack a clear connection between the paragraphs... Choice 2 offers an interesting perspective by using the required end sentences to present a self-help book's content. It connects the paragraphs with the theme of self-improvement and embracing challenges, making for a coherent passage..."
Result: 5 votes → Choice 2 wins (3/5)
```

This approach works when "problem success is harder to directly value (e.g. passage coherency)" but comparing alternatives is tractable. It's analogous to preference learning, but implemented through in-context reasoning rather than training.

## Why This Works: The Basis of Evaluative Reasoning

The paper identifies a subtle point: evaluation basis varies by problem and thought step. In Game of 24:

- **Early states** (e.g., "4 - 9 = -5"): Evaluated via commonsense about number magnitude ("these numbers are too big/small to reach 24")
- **Near-terminal states** (e.g., "5 5 14"): Evaluated via quick lookahead ("5 + 5 + 14 = 24, possible!")

For crosswords:
- **Word proposals**: "v1. To heap: tm_s_" → Check if any English word fits pattern
- **State viability**: Do remaining clues have any valid fills given current constraints?

The LM uses different reasoning strategies depending on:
1. **How close to goal**: Near-terminal states allow concrete verification, early states require heuristic judgment
2. **What knowledge applies**: Domain knowledge (crossword vocabulary), mathematical reasoning (arithmetic), commonsense (plausibility)
3. **Computational budget**: Quick checks vs. exhaustive verification

## The Imperfection is the Point

A critical insight from the experiments: **LLM evaluation doesn't need to be perfect to be useful**.

**Crosswords Pruning Analysis**:
"Sometimes when the crosswords game is actually solved, the state evaluator might still deem some words as 'impossible' and prune—possibly because 5 × 5 crosswords by design have some rare or obsolete words that GPT-4 cannot recognize."

Example: "agend" (obsolete form of "agendum") is marked impossible because GPT-4 thinks it's a typo for "agenda."

Yet ToT with imperfect pruning achieves 60% word-level success (Table 3), compared to 15.6% for CoT. The ablation removing pruning entirely ("-prune" in Table 3) gets 41.5% success—better than baselines but worse than with pruning. 

**Key insight**: An imperfect heuristic that eliminates many bad paths while occasionally pruning good ones can still dramatically improve search efficiency compared to no heuristic at all.

This mirrors classical AI: A* search doesn't require perfect heuristics, just admissible ones (for optimality guarantees) or consistent ones (for efficiency). LLM self-evaluation provides approximate heuristics that improve average-case performance even when worst-case failures exist.

## Sampling for Robustness

The paper consistently uses multiple evaluation samples: "we could prompt the LM multiple times to aggregate the value or vote results to trade time/resource/cost for more faithful/robust heuristics."

For Game of 24: "We sample values 3 times for each thought."
For Creative Writing: "where the LM samples 5 times to vote"

This addresses evaluation uncertainty through consensus. If 3/5 evaluations say "impossible," the state is pruned. This is more robust than single-sample evaluation but more expensive than no evaluation.

The tradeoff is explicit: more evaluation samples → more reliable heuristics → fewer wrong branches explored, but higher cost per evaluation.

## Comparison to Alternatives

**vs. Programmed Rules**:
- Programmed: "If remaining numbers are all < 5, reaching 24 is impossible"
- LLM: Reasons about specific numbers ("1 2 3 are too small") using implicit knowledge
- Advantage: Handles cases expert didn't anticipate; no explicit rule engineering
- Disadvantage: Inconsistent (may judge similar cases differently); opaque (hard to debug)

**vs. Learned Value Functions**:
- Learned: Train model to predict P(success | state) on thousands of examples
- LLM: Zero-shot or few-shot reasoning about state promise
- Advantage: No training data collection; works immediately on new tasks
- Disadvantage: Less accurate on any specific task; no improvement from experience

**vs. Self-Consistency**:
The paper positions this against self-consistency (CoT-SC): "Self-consistency with CoT is an ensemble approach that samples k i.i.d. chains of thought... then returns the most frequent output."

Self-consistency evaluates *complete solutions* by voting. ToT evaluates *intermediate states* to guide search. The former is post-hoc selection; the latter is active planning.

## Implications for Agent System Design

### 1. Evaluation Skills Should Be Distinct from Generation Skills

Current agent systems often conflate "solve the problem" with "evaluate if the solution is correct." ToT separates these:
- Generation: Propose possible next thoughts
- Evaluation: Assess which thoughts are promising

An orchestration system should have explicit evaluation hooks:
```python
def solve_with_search(problem, generator, evaluator, search_algorithm):
    # generator: problem_state → list[candidate_thoughts]
    # evaluator: list[states] → list[values]
    # search_algorithm: uses evaluator to pick which states to expand
```

This enables:
- Testing evaluation quality independently (do high-scored states lead to solutions?)
- Mixing generators (LLM proposals + programmed rules)
- Improving evaluation without retraining generation

### 2. Prompt Engineering for Evaluation is Different from Generation

The Game of 24 value prompt: "Evaluate if given numbers can reach 24 (sure/likely/impossible)"

This isn't asking the LLM to solve the problem—it's asking for judgment about solvability. The prompt structures:
- **Explicit reasoning requirement**: "Evaluate if..." forces deliberation
- **Discrete output space**: sure/likely/impossible (easier to aggregate than continuous scores)
- **Appropriate granularity**: Judgment about one path, not entire problem

Agent systems need evaluation-specific prompting strategies:
- For filtering: "Is this approach fundamentally flawed? (yes/no/unsure)"
- For ranking: "Which of these approaches is most promising? Explain reasoning then conclude."
- For verification: "Does this solution satisfy requirement X? Show why/why not."

### 3. Evaluation Basis Should Be Explicit and Task-Appropriate

The paper's evaluations use different strategies per task:
- **Game of 24**: Lookahead + commonsense → fast approximate verification
- **Creative Writing**: Comparative voting → human-like preference judgment  
- **Crosswords**: Constraint checking → logical feasibility

An agent system should explicitly specify evaluation basis in task decomposition:
```yaml
task: solve_crossword
thoughts: word_placements
evaluation:
  type: constraint_checking
  basis: 
    - letter_pattern_match
    - remaining_clue_feasibility
  sampling: 1  # deterministic check
```

vs.

```yaml
task: creative_writing
thoughts: paragraph_plans
evaluation:
  type: comparative_voting
  basis:
    - coherence_assessment
    - constraint_satisfaction
  sampling: 5  # aggregate votes
```

### 4. Explicit Uncertainty in Evaluation

The sure/likely/impossible classification (Game of 24) explicitly represents evaluation uncertainty:
- "sure" → aggressively expand (may already be solved)
- "likely" → continue exploring
- "impossible" → prune subtree

This is more sophisticated than binary keep/prune or continuous scores. It enables:
- Different search strategies by confidence level (explore "likely" in parallel, verify "sure" immediately)
- Meta-reasoning about when to invest in better evaluation (lots of "likely" states → need better discrimination)
- Transparent decision-making (agent can explain "I pruned this branch because it seemed impossible to reach 24 with numbers all less than 5")

### 5. Cost-Adaptive Evaluation

The paper's cost analysis (Table 7-8) shows evaluation is expensive: Game of 24 uses 5.5k completion tokens per problem (comparable to 100 independent CoT attempts).

Agent systems should adaptively allocate evaluation budget:
- **Shallow tree, high branching** (Game of 24): Invest heavily in early evaluation to prune bad branches
- **Deep tree, low branching** (sequential reasoning): Cheaper evaluation, rely on backtracking
- **Near-solution states**: More rigorous evaluation (verify solution correctness)
- **Early exploration**: Cheaper heuristics (quick feasibility checks)

This could be explicit in search configuration:
```python
evaluation_budget = {
    "depth_0_to_2": {"samples": 5, "reasoning_depth": "thorough"},
    "depth_3_plus": {"samples": 1, "reasoning_depth": "quick"},
    "terminal_nodes": {"samples": 3, "reasoning_depth": "verification"}
}
```

## Boundary Conditions and Failure Modes

**When LLM Evaluation Fails:**

1. **Knowledge Gaps**: Crossword words like "agend" that LLM doesn't recognize → incorrect pruning
   - Mitigation: External knowledge retrieval (dictionary lookup)
   - Fundamental: LLM evaluation bounded by LLM knowledge

2. **Complex Multi-Step Lookahead**: Game of 24 evaluation uses "quick lookahead simulations." But for problems requiring deep lookahead, evaluation becomes as hard as solving
   - Example: Chess positions requiring 10-move tactical calculation
   - Mitigation: Limit evaluation to tractable horizon; accept approximate heuristics

3. **Preference Instability**: Creative writing votes aren't fully consistent (5 samples needed for reliability)
   - Fundamental: Subjective judgments have inherent variance
   - Mitigation: More samples (but higher cost) or accept noise

4. **Evaluation-Generation Mismatch**: If generator can propose thoughts the evaluator can't judge
   - Example: Generator proposes advanced mathematical technique, evaluator can't assess correctness
   - Mitigation: Ensure generator and evaluator use same LLM or compatible capabilities

**When LLM Evaluation Excels:**

1. **Rich implicit knowledge available** (commonsense, domain knowledge) but hard to formalize
2. **Judgment is comparative** rather than absolute (easier to rank than score)
3. **Quick approximate reasoning** sufficient (perfect evaluation unnecessary)
4. **Task novel** or rapidly changing (no time to train specialized evaluator)

## The Deeper Principle: Deliberation as Computation

The most profound insight isn't technical but conceptual: **Evaluation can be implemented as language-based deliberation rather than function approximation.**

Traditional ML: Learn f: state → value from (state, value) pairs
ToT approach: Prompt LM to reason about state → derive value through inference

This works because the LM's pre-training included:
- Reasoning about partial solutions
- Judging quality and progress
- Comparing alternatives
- Explaining why approaches might fail

The pre-trained LLM already contains the "evaluation model"—ToT just activates it through prompting.

This suggests a broader principle for agent systems: **Capabilities that humans perform through deliberate reasoning (evaluation, planning, debugging) can potentially be elicited from LLMs through appropriate prompting, without task-specific training.**

The frontier question is: which capabilities? The paper demonstrates evaluation/judgment; other work shows planning, debugging, self-correction. The limit of this approach defines the boundary between "System 2 through prompting" and "capabilities requiring architectural changes or training."