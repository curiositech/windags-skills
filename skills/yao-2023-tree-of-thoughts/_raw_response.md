## BOOK IDENTITY
**Title**: Tree of Thoughts: Deliberate Problem Solving with Large Language Models

**Author**: Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, Karthik Narasimhan

**Core Question**: How can language models move beyond left-to-right token generation to solve problems requiring exploration, strategic lookahead, and deliberate reasoning?

**Irreplaceable Contribution**: This paper provides the first systematic framework for enabling LLMs to engage in "System 2" deliberate reasoning through explicit search over intermediate thought states. Unlike previous work that treats LLM outputs as linear sequences, ToT introduces a structured methodology for decomposing problems into searchable thought spaces, evaluating partial solutions through self-reflection, and conducting lookahead/backtracking. The irreplaceable insight is that LMs can serve as their own heuristic evaluators in search processes—neither purely programmed (like DeepBlue) nor learned from extensive training data (like AlphaGo), but through deliberate language-based reasoning about progress toward goals.

## KEY IDEAS (3-5 sentences each)

1. **System 1 vs System 2 for LLMs**: Current autoregressive LLMs operate in a "System 1" mode—fast, associative, token-by-token generation. Complex problem-solving requires "System 2" capabilities: maintaining multiple hypotheses, evaluating alternatives, planning ahead, and backtracking when needed. The ToT framework implements System 2 by treating problem-solving as search through a tree where nodes are coherent "thoughts" (intermediate reasoning steps), enabling exploration and deliberate decision-making rather than committed left-to-right generation.

2. **Thought Decomposition as Problem Structure**: The granularity of "thoughts" must match problem properties—small enough for LMs to generate diverse, promising candidates, yet large enough to meaningfully evaluate progress. In Game of 24, thoughts are single equations; in Creative Writing, entire paragraph plans; in Crosswords, individual word placements. This decomposition isn't arbitrary but reflects the natural decision points where exploration branches and evaluation becomes meaningful.

3. **LLM Self-Evaluation as Search Heuristic**: ToT introduces a novel approach to search heuristics where the LM itself evaluates states through deliberate reasoning rather than learned value functions or programmed rules. The LM can assess thoughts as "sure/maybe/impossible," vote among alternatives, or simulate lookahead scenarios. This is more flexible than hardcoded rules and more sample-efficient than training specialized evaluators, though imperfect evaluations can lead to pruning correct paths.

4. **Search Algorithm Modularity**: ToT separates thought generation, evaluation, and search strategy as independent components. BFS works for shallow trees where early pruning is valuable (Game of 24); DFS suits deeper exploration with backtracking when dead-ends are detected (Crosswords). This modularity allows matching search strategy to problem structure—critical since no single approach dominates all problem types.

5. **The Gap Between Token-Level and Decision-Level Intelligence**: Left-to-right decoding fails catastrophically on problems where initial choices constrain future possibilities. In Game of 24, 60% of CoT samples fail after generating just three words (e.g., "4 + 9" leaves numbers too small to reach 24). The ability to consider multiple options before committing, then backtrack when needed, is qualitatively different from sampling multiple complete chains independently.

## REFERENCE DOCUMENTS

### FILE: thought-decomposition-and-problem-structure.md
```markdown
# Thought Decomposition and Problem Structure: Matching Reasoning Granularity to Task Properties

## Core Principle

The Tree of Thoughts framework introduces a critical design decision that most prompting approaches ignore: **how to decompose the problem-solving process into intermediate "thoughts" that serve as nodes in a search tree**. This isn't a minor implementation detail—it's the foundation that determines whether deliberate search is even possible.

As the ToT paper states: "In general, a thought should be 'small' enough so that LMs can generate promising and diverse samples (e.g. generating a whole book is usually too 'big' to be coherent), yet 'big' enough so that LMs can evaluate its prospect toward problem solving (e.g. generating one token is usually too 'small' to evaluate)."

This reveals a fundamental tension in agent system design: the granularity at which you decompose a problem determines both what you can explore and what you can meaningfully evaluate.

## The Three-Way Balance

Effective thought decomposition must balance three competing demands:

1. **Generation Diversity**: Thoughts must be small enough that the LM can generate meaningfully different alternatives at each step. If thoughts are too large (e.g., "write the entire essay"), the LM cannot explore different structural approaches—it's forced to commit to a complete solution immediately.

2. **Evaluation Meaningfulness**: Thoughts must be large enough that partial progress can be assessed. Individual tokens cannot be evaluated for "making progress toward solving a crossword puzzle." But a proposed word for one clue can be evaluated against constraints from crossing words.

3. **Search Space Tractability**: The number of possible thoughts at each step, multiplied across tree depth, determines computational feasibility. Too fine-grained decomposition explodes the search space; too coarse-grained eliminates the benefits of search.

## Task-Specific Decomposition Examples

The paper demonstrates three radically different decomposition strategies, each matched to problem structure:

**Game of 24** (depth = 3, high branching):
- Thought = one arithmetic equation using two numbers
- Why this works: Each equation reduces the problem size (4 numbers → 3 → 2 → 1). The space of valid next equations is constrainable (basic arithmetic on remaining numbers). Evaluation is possible through quick lookahead simulation ("can these three numbers still make 24?") plus commonsense heuristics ("1, 2, 3 are too small").
- Alternative decompositions that fail: Token-level (cannot evaluate "4" or "4 +" for progress); solution-level (no exploration of intermediate states).

**Creative Writing** (depth = 2, creative constraints):
- First thought = paragraph-level plan (e.g., "1. Introduce a book that connects to challenges")
- Second thought = complete passage implementing the plan
- Why this works: Plans are concrete enough to evaluate for coherence and constraint satisfaction, abstract enough to allow multiple implementation approaches. The two-level structure separates "what to write about" from "how to write it," enabling evaluation at both strategic and execution levels.
- The paper notes this could be seen as a form of iterative refinement, suggesting thought generation isn't always from scratch—it can involve refining previous thoughts.

**Mini Crosswords** (depth = 5-10, variable, high constraint):
- Thought = one word placement for a specific clue
- Why this works: Each word placement adds letters that constrain future placements. Evaluation is possible by checking if remaining clues can still be satisfied given current letter constraints. The variable depth (solving clues in different orders) requires a search algorithm that can handle dynamic tree structures.
- Critical insight: "Subsequent thoughts are constrained not to change any filled words or letters" - this prevents exponential blowup from allowing arbitrary modifications.

## Implications for Agent System Design

### 1. Task Decomposition Skills Must Consider Evaluation Granularity

When an orchestration system decomposes a complex task, it typically thinks about functional decomposition (what subtasks are needed) or dependency ordering (what must happen first). ToT adds a third dimension: **at what granularity can progress be meaningfully evaluated?**

For debugging a complex system failure:
- Too coarse: "Debug the entire authentication system" (no intermediate evaluation possible)
- Too fine: "Check if variable `x` is null on line 47" (cannot evaluate progress toward root cause)
- Appropriate: "Verify authentication token is correctly generated" → "Verify token is correctly transmitted" → "Verify token is correctly validated" (each is evaluable for correctness and contribution to overall goal)

### 2. Skill Design Should Enable Multiple Generation Strategies

ToT identifies two distinct thought generation approaches:

**i.i.d. sampling** (Creative Writing): "Sample i.i.d. thoughts from a CoT prompt... This works better when the thought space is rich (e.g. each thought is a paragraph), and i.i.d. samples lead to diversity."

**Sequential proposal** (Game of 24, Crosswords): "Propose thoughts sequentially using a 'propose prompt'... This works better when the thought space is more constrained (e.g. each thought is just a word or a line), so proposing different thoughts in the same context avoids duplication."

Agent systems should recognize that "generate alternatives" isn't a single capability but depends on constraint density:
- Rich, unconstrained spaces: parallel independent generation
- Constrained spaces: sequential proposal that builds on context to avoid redundancy

### 3. Decomposition Enables or Prevents Backtracking

The crossword experiments demonstrate a subtle point: decomposition strategy determines what backtracking means. By constraining thoughts to never modify previously filled words, ToT makes backtracking simple—just return to the parent state. If thoughts could modify arbitrary prior decisions, backtracking would require reasoning about which previous decisions to revise.

For code refactoring agents:
- Allowing "modify any previous change" creates exponential search complexity
- Constraining to "add new transformations without undoing previous ones" simplifies search but may miss optimal solutions
- The tradeoff must be explicit in task decomposition

### 4. The Evaluation Budget Shapes Decomposition

Table 7 in the paper shows ToT uses 5.5k completion tokens to solve Game of 24, comparable to 100 independent CoT trials but with 74% success vs 49%. The thought decomposition enables investing those tokens in evaluating partial paths rather than generating complete but likely-wrong solutions.

This means decomposition should consider: *Given N tokens of evaluation budget, how should we divide the problem such that N/depth tokens per evaluation is sufficient to discriminate good from bad partial solutions?*

### 5. Domain-Specific Decomposition Strategies Are Unavoidable

The paper's three tasks require completely different decomposition strategies. There's no universal granularity for thoughts. This challenges agent systems that aim for task-agnostic decomposition:

- Some tasks have natural evaluation points (crosswords: per word; code: per function; proofs: per lemma)
- Some tasks require imposing artificial structure (creative writing: forcing a planning phase)
- Some tasks have multiple valid decompositions (mathematical reasoning: by subproblem vs by technique)

An agent system's "task decomposition" skill cannot be a single general procedure. It must incorporate domain knowledge about where evaluation is meaningful.

## Boundary Conditions and Failure Modes

**When Fine-Grained Decomposition Fails:**
The paper notes crossword solving required constraining thoughts to avoid modifying previous words, "so that the ToT has at most 10 intermediate steps" for tractability. Without this constraint, the tree depth could explode. Fine-grained decomposition only works when:
- Each step significantly reduces remaining search space
- Constraints from previous steps limit future branching
- Dead-ends can be detected before exhausting search budget

**When Coarse-Grained Decomposition Fails:**
The creative writing task used only depth-2 search (plan → passage). The paper shows this works (7.56 vs 6.93 coherency score over CoT), but notes "iterative-refine is more effective on this natural language task" (7.67 from just refining IO output). This suggests:
- For highly creative tasks, the evaluation bottleneck may be more important than exploration breadth
- Very coarse decomposition works when the LM's generation quality is already high and evaluation provides clear signal for refinement

**When Evaluation Granularity Mismatches Thought Granularity:**
The crossword ablation (Table 3, "-prune") shows that sometimes correct solutions get pruned because "5 × 5 crosswords by design have some rare or obsolete words that GPT-4 cannot recognize." The evaluation heuristic ("is this word valid?") operates at wrong granularity for the actual goal ("will this lead to a complete solution?"). Thought decomposition must match evaluation capabilities.

## Practical Application: Designing a Decomposition Strategy

For an agent system encountering a new complex task:

**Step 1: Identify Natural Evaluation Points**
Where can partial progress be meaningfully assessed? In code review: per file? Per function? Per logical change? The answer depends on what properties you're evaluating (correctness, style, security).

**Step 2: Estimate Branching Factor**
How many reasonable alternatives exist at each decision point? High branching (>10) suggests needing good evaluation heuristics or pruning strategies. Low branching (<3) suggests sequential exploration may suffice.

**Step 3: Consider Constraint Propagation**
Do early decisions strongly constrain later ones (like crosswords), or are decisions relatively independent (like parallel bug fixes)? High constraint propagation favors finer decomposition with frequent evaluation.

**Step 4: Match Search Budget to Tree Size**
If depth D and branching B create B^D possible paths, and you can afford E evaluations, you must either:
- Reduce depth (coarser decomposition)
- Reduce branching (stronger constraints on thought generation)
- Improve evaluation efficiency (faster heuristics)
- Accept incomplete search (DFS with pruning instead of exhaustive BFS)

**Step 5: Design Evaluation That Matches Decomposition**
The Game of 24 evaluation (sure/likely/impossible) works because thoughts are equations that can be quickly simulated. Crossword evaluation (possible/impossible to fill remaining clues) works because thoughts are word placements with checkable constraints. The evaluation strategy must be designed in tandem with decomposition, not after.

## Connection to Classical AI Planning

The ToT paper explicitly connects to Newell, Shaw, and Simon's work on problem-solving as search through a combinatorial problem space. The key insight from 1950s AI—that problem representation determines solution tractability—remains true:

"A genuine problem-solving process involves the repeated use of available information to initiate exploration, which discloses, in turn, more information until a way to attain the solution is finally discovered."

Modern LLMs don't change this fundamental principle. They provide a new mechanism for generating and evaluating intermediate states, but the requirement that these states be appropriately granular for meaningful evaluation remains. The "representation problem" is now a "thought decomposition problem," but it's the same essential challenge.

## The Open Question: Can Decomposition Be Learned?

The paper uses hand-designed decompositions for each task. An open question for agent systems: can appropriate decomposition strategies be learned or automatically discovered?

Possible approaches:
- Meta-learning over problem classes to identify common evaluation structures
- Reinforcement learning where decomposition granularity is a learnable parameter
- LLM self-reflection on what granularity enables progress assessment
- Adaptive decomposition that starts coarse and refines when evaluation is ambiguous

The paper hints at this: "fine-tuning LMs using a ToT-style high-level counterfactual decision making (e.g. deliberating over potential choices for the next paragraph, instead of predicting the next token) might present opportunities to enhance the problem-solving capabilities of LMs."

This suggests the future isn't hand-designed decomposition for every task, but training systems to recognize problem structures that afford particular decomposition strategies.
```

### FILE: llm-self-evaluation-as-search-heuristic.md
```markdown
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
```

### FILE: search-algorithm-modularity-and-problem-structure.md
```markdown
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
```

### FILE: system-1-vs-system-2-and-reasoning-modes.md
```markdown
# System 1 vs System 2: Fast Associative Generation vs Deliberate Search

## The Dual-Process Framework

The Tree of Thoughts paper grounds itself in a fundamental distinction from cognitive science: **System 1 (fast, automatic, unconscious) vs System 2 (slow, deliberate, conscious) thinking**. The authors cite Kahneman, Sloman, and Stanovich to position current LLM behavior as primarily System 1, then ask: "Is such a simple mechanism sufficient for a LM to be built toward a general problem solver? If not, what problems would challenge the current paradigm, and what should be alternative mechanisms?"

Their answer: autoregressive token generation is System 1—associative, reactive, committed. It lacks System 2's hallmarks:
1. **Maintaining multiple hypotheses simultaneously** rather than committing to a single path
2. **Evaluating alternatives before choosing** rather than generating then post-hoc filtering  
3. **Strategic lookahead** (what will this decision enable later?)
4. **Backtracking** when a line of reasoning proves unfruitful

The paper connects this to reinforcement learning literature on "model-free" (associative, cached responses) vs "model-based" (deliberate planning using world models). The claim: current LLMs are analogous to model-free RL—they respond based on learned patterns, not explicit forward simulation of consequences.

## Why Token-Level Left-to-Right Generation Fails

The most striking empirical finding: **In Game of 24, ~60% of Chain-of-Thought samples fail after generating just the first three words** (Figure 3b).

Example failure:
- Input: 4 9 10 13  
- CoT output starts: "4 + 9 = 13..."
- Why this fails: Now left with 10, 13, 13. No combination reaches 24.
- The commitment happened at token level: "4" → "+" → "9" → "=", each sampled independently

The LLM is playing a highly sequential game where early moves constrain all future moves, but its generation mechanism has no lookahead. It's like chess where you must say your move aloud one character at a time, committing before seeing the full move's consequences.

**The fundamental limitation**: Token-level autoregressive generation provides no opportunity to "try out" a thought, evaluate it, and revise before committing. Every token is immediately part of the sequence that conditions all future tokens.

This works fine for tasks where:
- Each token is locally determinable (grammar, style)
- No long-range constraints bind decisions (open-ended creative writing)
- First attempts are usually good enough (factual recall, common reasoning patterns)

It fails catastrophically when:
- Early decisions create hard constraints (Game of 24: first equation determines remaining numbers)
- Solution requires exploring alternatives (Crosswords: word for h2 might force unsatisfiable constraint on v1)
- Optimal paths are non-obvious (Creative Writing: paragraph structure determines flow)

## What Makes a Problem Require System 2?

The paper proposes three new tasks specifically chosen to challenge GPT-4's System 1 capabilities:

### Game of 24 (Mathematical Reasoning + Search)
- **Why System 1 fails**: 
  - 4% success with CoT prompting (Table 2)
  - 9% even with self-consistency across 100 samples
  - First equation determines remaining numbers; no backtracking
- **What System 2 provides**:
  - Explore multiple first equations (breadth)
  - Evaluate each: "can these remaining numbers reach 24?" (lookahead)
  - Prune impossible branches: "1,2,3 are too small" (heuristic filtering)
  - Result: 74% success with b=5 BFS

The task is simple enough that humans solve it reliably, but its combinatorial structure (4! × 4! × 4 operations = ~13,824 possible equation sequences) makes sampling unlikely to stumble on solutions. You need deliberate search with pruning.

### Creative Writing (Planning + Coherence)
- **Why System 1 struggles**:
  - GPT-4 with IO prompting: 6.19/10 coherency score
  - Starting to write immediately without plan often leads to incoherent transitions
  - Hard to maintain constraint (each paragraph must end with specific sentence) without top-down structure
- **What System 2 provides**:
  - Generate 5 different plans first (explore structural alternatives)
  - Vote on best plan (comparative evaluation)
  - Generate 5 passages implementing best plan
  - Vote on best passage
  - Result: 7.56/10 coherency, humans prefer ToT over CoT 41% vs 21%

This task doesn't require search per se (it's only depth 2), but benefits from **planning before execution**. The plan acts as a global constraint guiding local generation. System 1 has no mechanism for this—it generates locally coherent text but may violate global constraints.

### Mini Crosswords (Constraint Satisfaction + Backtracking)
- **Why System 1 fails badly**:
  - CoT: 15.6% word-level accuracy (Table 3)
  - Cannot backtrack when word choice creates unsolvable constraints
  - Cannot systematically explore different clue orderings
- **What System 2 provides**:
  - DFS: try filling most promising clue
  - Evaluate: are remaining clues still solvable given current letters?
  - Prune: if any remaining clue is impossible, backtrack and try different word
  - Result: 60% word-level accuracy (4x better than CoT)

The task is deep (5-10 steps), highly constrained (each word must fit cross-constraints), and requires backtracking (no single greedy order works for all puzzles). Pure System 1 has no mechanism for any of these.

## The Cognitive Science Connection: Why This Framework Matters

The paper's citation of Kahneman, Sloman, and dual-process models isn't decorative—it provides theoretical grounding for why ToT should work.

**Key claims from dual-process theory**:
1. **System 1 is fast but inflexible**: Operates by pattern matching and association. Excellent for familiar tasks, poor for novel problems requiring combination of known elements in new ways.
2. **System 2 is slow but adaptive**: Operates by explicit reasoning and simulation. Can handle novel situations by systematically exploring possibilities.
3. **Humans use System 1 by default, invoke System 2 when System 1 fails or task requires it**: You read text with System 1; you solve logic puzzles with System 2.

The paper's contribution is showing how to give LLMs a System 2 mode:
- System 1 = autoregressive sampling (what current LLMs do all the time)
- System 2 = ToT (explicit search over thoughts, with evaluation and backtracking)

**The deeper claim**: LLMs' impressive capabilities come from System 1 operating on massive training data. But to be truly "general problem solvers," they need System 2 mechanisms for deliberate reasoning.

## The RL Connection: Model-Free vs Model-Based

The paper cites research on RL distinguishing "associative 'model free' learning" from "more deliberative 'model based' planning." This provides another lens:

**Model-Free RL** (analogous to current LLM generation):
- Learn policy: state → action, directly from experience
- No explicit world model; cached action values
- Fast at test time; inflexible (can't adapt to new goals without retraining)

**Model-Based RL** (analogous to ToT):
- Learn world model: (state, action) → next state
- Plan by simulating possible action sequences using world model
- Slower (requires forward simulation); flexible (can adapt to new goals)

The claim: LLMs trained on massive text corpora have implicitly learned a "world model" (language/reasoning patterns), but their generation process doesn't explicitly invoke this model for planning. ToT makes the world model explicit—using the LLM to simulate "if I take this thought step, what states become reachable?"

Example from Game of 24:
- Model-free: "4 + 9" (direct generation based on training patterns)
- Model-based: "If I do 4 + 9 = 13, I'm left with 10, 13, 13. Can these reach 24? Let me check: 13 - 10 = 3, 13 × 3 = 39 (no), 13 + 13 - 10 = 16 (no), looks hard. Maybe try different first step."

The world model here is the LLM's ability to simulate arithmetic and reason about number magnitudes. ToT invokes this explicitly for lookahead; pure token generation does not.

## Implications for Agent System Design

### 1. Mode Switching: When to Invoke System 2

The most important practical implication: **Agent systems need a meta-level controller that decides when to use System 1 vs System 2**.

System 1 (direct generation) appropriate when:
- Task is familiar (well-represented in training data)
- Solution path is relatively linear (few decision points)
- Errors are non-catastrophic (can be caught by post-hoc validation)
- Time/cost is constrained

System 2 (ToT-style search) appropriate when:
- Task is novel or underspecified
- Solution requires exploring alternatives (high branching factor)
- Early decisions constrain later ones (need lookahead)
- Errors are expensive (worth investing in deliberate planning)

An agent framework might implement this as:
```python
def solve(problem, context):
    complexity = estimate_complexity(problem)
    if complexity < threshold:
        return system1_generate(problem)
    else:
        return system2_search(problem, 
                             search_strategy=select_search(problem))
```

The ToT paper doesn't provide the `estimate_complexity` function, but task properties like "depth of decision tree," "constraint density," and "solution sparsity" would be relevant features.

### 2. Gradual Expansion: Not All Problems Need Full Search

The Creative Writing experiment is revealing: ToT uses only depth 2 (plan → passage), yet still outperforms CoT. This suggests:

**Minimal System 2 intervention can help System 1 problems**. You don't always need deep search—sometimes just:
- Generate multiple alternatives at one key decision point
- Evaluate and pick best
- Execute chosen alternative with System 1

This is much cheaper than full tree search but still provides deliberation benefits.

An agent system might adaptively increase deliberation:
```python
# Start with minimal System 2
result = generate_with_voting(problem, k=5)
if validate(result):
    return result

# If failed, expand to depth-2 search
plan = generate_plans(problem, k=5)
best_plan = vote(plan)
result = execute_plan(best_plan)
if validate(result):
    return result

# If still failing, invoke full search
return tree_search(problem, max_depth=5)
```

This avoids paying for full search when simpler deliberation suffices.

### 3. Explicit Separation of Generation and Evaluation

System 2 requires the ability to **evaluate thoughts without committing to them**. This is architecturally different from System 1's generate-then-done approach.

Current LLM APIs don't cleanly support this:
- Autoregressive generation produces tokens incrementally; can't evaluate incomplete thoughts
- Sampling multiple completions is post-hoc selection, not guided search

ToT's approach: use separate evaluation prompts that judge thoughts without generating complete solutions. This requires:
1. **Reified thoughts**: Intermediate states must be explicit objects, not just prefixes of token sequences
2. **Evaluation as distinct capability**: Separate prompts/calls for "generate next thought" vs "evaluate current thought"
3. **State management**: Track which thoughts have been evaluated, what scores they received, which should be expanded

For agent systems:
```python
class Thought:
    state: str  # current partial solution
    parent: Optional[Thought]
    evaluation: Optional[float]
    children: List[Thought]

def system2_search(problem):
    root = Thought(state=problem, parent=None)
    frontier = [root]
    
    while not solution_found(frontier):
        # Generate
        for thought in frontier:
            thought.children = generate_next_thoughts(thought.state)
        
        # Evaluate
        all_children = flatten([t.children for t in frontier])
        for child in all_children:
            child.evaluation = evaluate_thought(child.state)
        
        # Search step
        frontier = search_strategy.select_next(all_children)
```

This explicit separation enables debugging (why was this thought pruned?), monitoring (how many evaluations per solution?), and optimization (can we batch evaluations?).

### 4. Thought Granularity Must Match Evaluation Capability

System 2 only works if you can meaningfully evaluate partial solutions. This creates a hard constraint:

**Thoughts must be at a granularity where the evaluator can judge progress**.

If thoughts are too small (individual tokens), evaluation is meaningless ("does the token 'the' make progress toward solving this crossword?"). If thoughts are too large (complete essays), evaluation collapses back to evaluating final solutions.

For agent systems, this means:
- **Domain-specific thought decomposition**: Code review might use "per function" or "per logical change" depending on what evaluator can assess
- **Evaluator capability determines search granularity**: If you have a good unit test suite, fine-grained decomposition works; if only human evaluation available, need coarser thoughts
- **Iterative refinement of decomposition**: Start with coarse thoughts (high-level approaches), refine to finer thoughts as evaluator provides signal

This is a co-design problem: thought structure and evaluation capability must be designed together.

### 5. Training for System 2 Capabilities

The paper uses GPT-4 zero-shot or few-shot for all ToT components. But the conclusion notes: "fine-tuning LMs using a ToT-style high-level counterfactual decision making (e.g. deliberating over potential choices for the next paragraph, instead of predicting the next token) might present opportunities to enhance the problem-solving capabilities of LMs."

**The training implication**: Current LLMs are trained exclusively on System 1 objectives (next-token prediction). To improve System 2:

Train on counterfactual reasoning:
- Given state S and thought T, will T lead to solution? (evaluation training)
- Given state S, what are diverse promising next thoughts? (exploration training)
- Given state S that led to dead-end, what earlier decision should have been different? (credit assignment training)

This is fundamentally different from current LLM training:
- **Non-myopic objectives**: Reward spans multiple steps, not immediate next token
- **Counterfactual reasoning**: Evaluate paths not taken, not just observed paths
- **Explicit search training**: Directly optimize for search efficiency, not just generation quality

An agent system might fine-tune LLMs on:
- Task-specific thought evaluation datasets (states labeled with "will this lead to solution?")
- Search trajectories showing good exploration strategies
- Counterfactual improvements ("better first equation: 13-9=4 instead of 4+9=13")

## Boundary Conditions: When System 2 Helps vs Hurts

The paper provides evidence for both sides:

**System 2 dramatically helps** (Game of 24):
- CoT: 4% success
- CoT-SC (k=100): 9% success  
- ToT (b=5): 74% success

18x improvement over baseline, 8x over self-consistency. The task fundamentally requires search.

**System 2 marginally helps** (GSM8k, StrategyQA - Appendix B.1):
- GSM8k: CoT 86% → ToT 90% (+4%)
- StrategyQA: CoT 82% → ToT 83% (+1%)

These tasks have relatively linear reasoning chains. Search overhead isn't justified.

**System 2 might hurt** (not tested but implied):
- Simple factual recall: "What is the capital of France?" - ToT would waste computation exploring alternatives
- Open-ended generation: "Write a poem about trees" - deliberation might reduce creativity
- Time-critical tasks: 5-100x cost of ToT might exceed benefit

The principle: **System 2 is justified when the cost of errors (or quality gain from deliberation) exceeds the computational cost of search**.

For agent systems, this suggests:
- Don't always use ToT by default
- Estimate error cost vs search cost per task
- Start with System 1, escalate to System 2 only when needed

## The Deeper Principle: Computation Buys Intelligence

The most profound implication is philosophical: **More computation, structured appropriately, produces better reasoning**.

ToT uses 5-100x more compute than CoT (Table 7-8):
- Game of 24: 5.5k tokens (equivalent to ~100 CoT attempts)
- Creative Writing: 5x tokens vs single CoT

But the results are qualitatively better, not just quantitatively—ToT solves problems CoT simply cannot (74% vs 4% on Game of 24).

This challenges the narrative that "scale is all you need" for LLM capabilities. More parameters and training data improve System 1 performance, but some problems require System 2's deliberate search **regardless of model size**.

The implication for agent systems: **Don't just scale models; scale computation during inference, structured as deliberate reasoning**.

This is the core insight: intelligence isn't just in the model weights, it's in the computation pattern applied at inference time. A smaller model with ToT search might outperform a larger model with simple sampling on problems requiring deliberation.
```

### FILE: failure-modes-in-deliberate-search.md
```markdown
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
```

### FILE: knowing-vs-doing-gap-in-llms.md
```markdown
# The Knowing-vs-Doing Gap: When LLMs Have Knowledge But Cannot Apply It

## The Core Paradox

The Tree of Thoughts paper reveals a subtle but profound gap in LLM capabilities: **The same model that can solve Game of 24 when using ToT (74% success) fails catastrophically with standard prompting (4% success).** This isn't about missing knowledge—GPT-4 "knows" arithmetic, number properties, and how to reach 24. The gap is in **applying that knowledge through appropriate reasoning structure**.

This mirrors a phenomenon well-known in education and cognitive science: knowing facts or procedures doesn't automatically translate to problem-solving ability. A student might know all the chess rules yet play poorly. A programmer might understand algorithms yet struggle to debug complex systems. The ToT paper demonstrates that LLMs exhibit the same gap—and that bridging it requires external structure, not just more training data.

## Evidence: The Game of 24 Breakdown

Figure 3(b) shows where CoT samples fail in Game of 24:
- **~60% fail after step 1** (generating first equation)
- ~20% fail after step 2
- ~10% fail after step 3
- ~10% reach step 4 (succeed)

**What this reveals**: The model possesses the knowledge to detect failures (ToT's evaluation capability proves this), but the token-by-token generation process doesn't invoke that knowledge appropriately.

Consider this sequence:
1. Input: 4 9 10 13
2. CoT generates: "4 + 9 = 13..."  
3. This leaves: 10, 13, 13

The model "knows":
- Arithmetic: Can compute 10 + 13 = 23, 13 - 10 = 3, etc.
- Number properties: 13 × 3 = 39 (too big), 23 + 13 = 36 (too big)
- Goal: Need to reach 24, but remaining operations can't reach it

Yet in CoT mode, it generates "4 + 9" anyway. In ToT evaluation mode, the same model correctly identifies this path as "impossible."

**The gap**: Knowledge exists in the model's parameters, but the autoregressive generation process doesn't trigger the right knowledge at the right time. It's a *failure of control flow*, not knowledge absence.

## Why This Matters: Implications Beyond Game of 24

This isn't specific to arithmetic puzzles. The knowing-vs-doing gap appears whenever:

### 1. Multi-Step Problems with Constraints

**Crosswords**: The model "knows" English vocabulary and can check if words fit patterns. But CoT achieves only 15.6% word-level accuracy while ToT achieves 60%. Same knowledge, different access patterns.

Why CoT fails: Generates words sequentially without checking cross-constraints. When it fills h2: "motor," it doesn't verify that v1 (now constrained to "m____") has valid completions.

Why ToT succeeds: Explicit evaluation step checks "given current state, can remaining clues be satisfied?" This invokes the model's constraint-checking knowledge.

### 2. Creative Tasks Requiring Global Coherence

**Creative Writing**: ToT (7.56 coherency) outperforms CoT (6.93) not because GPT-4 suddenly learned to write better, but because the plan-then-write structure enforces global coherence that unconstrained generation misses.

The model "knows" what makes writing coherent—this is evident in its ability to evaluate passages and vote for better plans. But sequential paragraph generation doesn't maintain global constraints well. The planning phase invokes knowledge about story structure; the evaluation phase invokes knowledge about paragraph flow.

### 3. Tasks Requiring Lookahead or Backtracking

The model "knows" when a decision is bad—but only after making it. CoT's left-to-right structure commits to decisions before consequences are clear.

Example: In Game of 24, after generating "4 + 9 = 13," the model could in principle recognize "wait, this leaves numbers that can't reach 24." But the generation process has already committed those tokens to the sequence. There's no mechanism to backtrack.

ToT solves this by separating generation (propose thoughts) from commitment (evaluation and selection). The model's knowledge about consequences is invoked *before* committing to thoughts.

## The Control Flow Hypothesis

The paper implicitly argues: **LLMs' capabilities are gated not (just) by what they know, but by what reasoning control flow is imposed on them.**

**Standard prompting** (IO): Knowledge accessed in simple input → output mapping
- Appropriate for: Tasks where output is direct function of input (translation, fact recall)
- Fails for: Tasks requiring intermediate reasoning, exploration, or backtracking

**Chain of Thought**: Knowledge accessed in linear sequential reasoning
- Appropriate for: Tasks with clear reasoning chains (math word problems, logical deduction)
- Fails for: Tasks where first steps constrain later steps in non-obvious ways

**Tree of Thoughts**: Knowledge accessed in deliberate search with evaluation
- Appropriate for: Tasks requiring exploration, strategic lookahead, or backtracking
- Fails for: Tasks where the reasoning structure itself is unclear (very open-ended generation)

**The implication**: To unlock LLM capabilities, we need to discover and apply appropriate control structures—not just better prompts within existing structures.

## Analogy: Human Problem-Solving and External Scaffolding

Educational psychology has long recognized that humans exhibit similar gaps:

**Expertise studies** (Chase & Simon, 1973): Chess masters don't just "know more" than novices—they access their knowledge differently. Masters recognize patterns (chunks) that trigger relevant knowledge; novices see individual pieces.

**Worked examples effect** (Sweller, 1988): Students learn better from studying worked examples than solving problems from scratch, even if they "know" the relevant facts. The example structure scaffolds appropriate knowledge access.

**External representations** (Larkin & Simon, 1987): Solving physics problems is easier with diagrams not because diagrams contain new information, but because they make relevant knowledge relationships explicit.

ToT is analogous: It provides external scaffolding (the tree structure, explicit evaluation steps, search algorithm) that helps the LLM access its own knowledge appropriately. The LLM is like a student who knows the material but needs the problem broken down into steps with explicit prompts to check their work.

## Implications for Agent System Design

### 1. Capability Assessment Must Distinguish Knowledge from Application

When evaluating if an LLM can handle a task, don't just test final performance. Test:

**Knowledge presence**: Can the model answer direct questions about task components?
- "Can these numbers reach 24: 5, 5, 14?" (yes)
- "Is 'agend' a valid English word?" (uncertain, but can be looked up)

**Application ability**: Can the model solve the task with standard prompting?
- Game of 24 with IO: 7.3% success (knowledge present but not applied)

**Application with structure**: Can the model solve the task with appropriate reasoning structure?
- Game of 24 with ToT: 74% success (same knowledge, better access)

If knowledge is present but application fails, the solution is better control flow, not more training.

### 2. Design Tasks to Externalize Critical Decision Points

The ToT paper's thought decomposition isn't arbitrary—it identifies points where:
- Multiple alternatives should be considered (branching)
- Progress should be evaluated (potential backtracking)
- Knowledge must be accessed deliberately (evaluation)

For agent systems, this means:
```python
def design_task_decomposition(task):
    # Identify critical decision points
    decisions = find_decision_points(task)
    
    # At each decision point, externalize:
    return [
        {
            "alternatives": generate_options(decision),  # make branching explicit
            "evaluation": check_progress(decision),      # force deliberate assessment
            "commitment": select_best(alternatives)      # separate choice from generation
        }
        for decision in decisions
    ]
```

This transforms implicit reasoning (hidden in token generation) into explicit reasoning (structured as searchable thoughts).

### 3. Prompt Engineering Should Focus on Knowledge Access Patterns

Traditional prompt engineering optimizes what information is in the prompt. ToT suggests optimizing *how that information is accessed*.

**Bad prompt engineering**: Adding more examples, longer context, detailed instructions
- Assumes the bottleneck is missing information
- Doesn't help if information is present but not accessed appropriately

**Good prompt engineering**: Structuring prompts to trigger appropriate knowledge at appropriate times
- Proposal prompts (generate alternatives): "What are possible next steps?"
- Evaluation prompts (assess progress): "Can this state lead to a solution?"
- Voting prompts (comparative judgment): "Which option is most promising?"

Each prompt is designed to invoke specific aspects of the model's knowledge:
- Proposal → generative, exploratory knowledge
- Evaluation → analytical, critical knowledge  
- Voting → comparative, preferential knowledge

### 4. Training Objectives Should Reflect Control Flow Requirements

The paper's conclusion notes: "fine-tuning LMs using a ToT-style high-level counterfactual decision making... might present opportunities to enhance the problem-solving capabilities of LMs."

**Current training** (next-token prediction): Optimizes for knowledge storage and local coherence
- Learns: What words follow what words
- Doesn't learn: When to explore alternatives, how to evaluate partial solutions, when to backtrack

**ToT-style training**: Could optimize for control flow capabilities
- Train on: "Given state S, generate diverse next thoughts" (exploration)
- Train