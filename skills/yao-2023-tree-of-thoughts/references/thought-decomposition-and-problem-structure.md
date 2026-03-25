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