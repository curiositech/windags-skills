---
license: Apache-2.0
name: yao-2023-tree-of-thoughts
description: Framework for deliberate problem-solving with LLMs through exploration of branching reasoning paths
category: Research & Academic
tags:
  - tree-of-thoughts
  - reasoning
  - search
  - llm
  - problem-solving
---

# Tree of Thoughts: Deliberate Problem Solving with LLMs

license: Apache-2.0
## Metadata
- **Name**: Tree of Thoughts Framework
- **Domain**: LLM reasoning architecture, AI problem-solving
- **Source**: Yao et al. (2023) - "Tree of Thoughts: Deliberate Problem Solving with Large Language Models"
- **Activation triggers**: 
  - Designing multi-step reasoning systems
  - Problems where early decisions constrain later options
  - Tasks requiring exploration, backtracking, or lookahead
  - Debugging why chain-of-thought fails on specific problems
  - Evaluating partial solutions during generation

## When to Use This Skill

Load this skill when encountering:

- **Reasoning architecture decisions**: Should this use chain-of-thought, tree search, or standard prompting?
- **Problems with constraint interdependencies**: Where choice A affects what's possible for choice B (puzzles, planning, construction tasks)
- **High early failure rates**: When most reasoning chains fail in the first few steps
- **Need for exploration vs exploitation tradeoffs**: Multiple plausible approaches that need evaluation before commitment
- **Self-evaluation design**: How should an LLM assess its own intermediate reasoning?
- **System 1 vs System 2 distinctions**: Understanding when fast generation suffices vs when deliberate search is needed

This framework is NOT about general prompting techniques—it's about **architectural choices for problem-solving systems** where the structure of reasoning matters as much as the content.

## Core Mental Models

### 1. System 1 vs System 2 for Language Models

**The Distinction**: 
- **System 1** = Autoregressive token generation. Fast, associative, committed. Each token depends on the last, flowing left-to-right without reconsidering.
- **System 2** = Deliberate search through thought states. Maintains multiple hypotheses, evaluates alternatives before committing, backtracks when needed.

**Why It Matters**: Most LLM reasoning (including chain-of-thought) is System 1 with scaffolding. True System 2 requires:
- Representing multiple candidate paths simultaneously
- Explicit evaluation of partial progress
- Ability to abandon unproductive directions
- Lookahead to avoid dead-ends

**The Implication**: When a task demands "thinking before speaking," you need more than better prompts—you need search architecture.

### 2. Thought Decomposition = Problem Factorization

**The Principle**: A "thought" is the atomic unit of reasoning in your search tree. Its granularity must match the problem's natural decision points.

**Examples from the paper**:
- **Game of 24**: Thoughts = individual equations (e.g., "14 - 9 = 5"). Too fine (single tokens) → no semantic evaluation. Too coarse (full solution) → no search.
- **Creative Writing**: Thoughts = paragraph-level plans. Evaluating sentence-by-sentence is premature; evaluating full stories comes too late.
- **Crosswords**: Thoughts = word placements with constraints propagated across the grid.

**Design Question**: What's the smallest reasoning unit where:
1. The LM can generate diverse, non-trivial candidates?
2. Progress toward the goal becomes evaluable?
3. Mistakes can be detected before cascading?

**Anti-pattern**: Choosing thought granularity for computational convenience rather than problem structure.

### 3. LLM Self-Evaluation as a Third Way

**Historical Context**:
- **Classical AI** (DeepBlue): Hardcoded evaluation functions. Precise but brittle, domain-specific.
- **Deep RL** (AlphaGo): Learned value networks. Powerful but requires massive training data.
- **ToT Insight**: LLMs can deliberate about state quality through prompted reasoning.

**The Three Evaluation Modes**:
1. **Value scoring**: "Rate this thought's promise on a scale of 1-10"
2. **Voting**: "Which of these 5 options is most likely to succeed?"
3. **Classification**: "Is this state sure/maybe/impossible?"

**Tradeoffs**:
- ✅ More flexible than hardcoded rules
- ✅ More sample-efficient than training evaluators
- ✅ Can articulate *why* a state is good/bad
- ❌ Imperfect judgments can prune correct paths
- ❌ Slower than learned heuristics

**Key Insight**: This works because evaluation is often easier than generation. The LM might not reliably generate a winning strategy, but can recognize when a partial path is doomed.

### 4. Search Strategy as Separate Module

**The Design Principle**: Thought generation, evaluation, and search algorithm should be **independently swappable** components.

**Why This Matters**: Different problem structures demand different exploration strategies:

| Problem Type | Search Strategy | Reason |
|--------------|----------------|---------|
| Shallow trees, high early branching (Game of 24) | **BFS** | Prune bad branches early; depth is limited |
| Deep trees, sparse solutions (Crosswords) | **DFS** | Need to explore deeply before evaluating; backtrack on dead-ends |
| Balanced exploration (Creative Writing) | **Beam search** | Maintain diverse candidates while limiting combinatorial explosion |

**Critical Insight**: No single search algorithm dominates. The paper's ablations show BFS excels on Game of 24 (92% → 74% when switching to sampling) but DFS is necessary for crosswords.

**Design Implication**: Build systems where you can swap BFS ↔ DFS ↔ MCTS without rewriting thought generation.

### 5. The Token-vs-Decision Intelligence Gap

**The Phenomenon**: In Game of 24 with {4, 9, 10, 13}, ~60% of chain-of-thought attempts fail after generating just three tokens: "4 + 9".

**Why This Happens**: 
- Token-level left-to-right generation commits immediately
- 4+9=13 leaves {13, 10, 13}—already difficult
- No way to undo the first operation choice

**The Deeper Point**: Some problems have *non-local constraints* where early decisions create bottlenecks. Standard prompting can't help because the failure mode is architectural:
- Sampling multiple chains independently doesn't solve this (all make similar early mistakes)
- Self-consistency helps only if SOME chains avoid the trap
- You need to consider options BEFORE committing

**Recognition Pattern**: When increasing samples or temperature doesn't improve success rate, you're hitting a structural ceiling.

## Decision Frameworks

### Should I use Tree of Thoughts?

```
IF problem success rate is already >90% with chain-of-thought
  THEN ToT overhead likely not justified
  
ELIF most failures happen in first few reasoning steps
  AND sampling more chains doesn't help
  THEN strong signal for ToT (token-vs-decision gap)

ELIF task requires comparing multiple approaches before choosing
  OR involves constraint satisfaction
  OR needs backtracking when hitting dead-ends
  THEN consider ToT architecture

ELIF task is open-ended generation with subjective quality
  THEN ToT may help but evaluation design is critical
  
ELSE start with simpler approaches (CoT, self-consistency)
```

### Designing Thought Granularity

```
ASK: What are the natural "decision points" in this problem?
  - Where does the problem require choosing between approaches?
  - What are the intermediate states between start and solution?

ASK: Can the LM generate diverse candidates at this level?
  - Too fine → no semantic content (individual tokens)
  - Too coarse → no search benefit (full solutions)

ASK: Can progress be evaluated at this granularity?
  - Must be able to distinguish promising from doomed paths
  - Evaluation should be easier than generation at this level

TEST: Generate 5 candidate thoughts—are they meaningfully different?
TEST: Can you evaluate them without completing the full solution?
```

### Choosing Search Strategy

```
IF problem has shallow depth (<5 steps)
  AND early mistakes are easy to detect
  THEN start with BFS + aggressive pruning

ELIF problem requires deep exploration
  AND dead-ends only apparent after many steps
  THEN use DFS with backtracking

ELIF need to maintain multiple diverse hypotheses
  AND can tolerate some pruning of promising paths
  THEN beam search with moderate beam width

WHEN IN DOUBT: Implement both BFS and DFS as swappable modules, test empirically
```

### Evaluation Strategy Selection

```
IF evaluation is mostly binary (valid/invalid)
  THEN use classification ("sure/maybe/impossible")
  - Cheaper, clearer thresholds for pruning

ELIF need to rank many similar options
  THEN use voting across multiple proposals
  - More robust than point estimates

ELIF need fine-grained progress assessment
  THEN use value scoring
  - But beware: imprecise scores can mislead search

ALWAYS: Test evaluator reliability independently
  - Generate known good/bad states, check if evaluation matches
```

## Reference Documentation

| File | Load When... | Contains |
|------|-------------|----------|
| `thought-decomposition-and-problem-structure.md` | Deciding what counts as a "thought" in your problem; designing the state space | Deep dive on matching reasoning granularity to task properties; examples across Game of 24, Creative Writing, Crosswords; principles for decomposition |
| `llm-self-evaluation-as-search-heuristic.md` | Designing evaluation mechanisms; comparing ToT to classical AI/RL approaches | Historical context of search heuristics; how LLM deliberation differs from learned value functions; tradeoffs and limitations |
| `search-algorithm-modularity-and-problem-structure.md` | Choosing between BFS/DFS/MCTS; understanding when to switch strategies | Why modularity matters; detailed analysis of search algorithm performance across problems; implementation considerations |
| `system-1-vs-system-2-and-reasoning-modes.md` | Understanding when chain-of-thought fails; explaining why sampling doesn't solve certain problems | Cognitive science foundations; how autoregressive generation differs from deliberate search; the architectural vs prompting distinction |
| `failure-modes-in-deliberate-search.md` | Debugging ToT systems; understanding performance ceilings; when ToT underperforms simpler methods | What goes wrong in ToT; imperfect evaluation consequences; local optima; when added complexity hurts |
| `knowing-vs-doing-gap-in-llms.md` | LM can describe the solution but fails to generate it; evaluation is good but generation is poor | The paradox of LLMs having knowledge they can't apply; why self-evaluation works despite generation failures; implications for system design |

## Anti-Patterns

### 1. Thought Granularity Mismatch
**Mistake**: Choosing thoughts that are too fine (individual tokens) or too coarse (complete solutions) for computational convenience.

**Why It Fails**: Search only works when thoughts are semantically meaningful yet incomplete enough to branch.

**Example**: Treating each word in creative writing as a separate thought → 1000-deep trees, no coherent narrative structure to evaluate.

### 2. Evaluation Without Validation
**Mistake**: Assuming the LM's self-evaluation is accurate without testing it independently.

**Why It Fails**: Imperfect evaluation prunes correct paths. In Game of 24, if the evaluator misjudges "8 * 3 = 24" as unlikely, search fails despite having the solution.

**Fix**: Generate known good/bad states, verify evaluator judgments. Measure how often the evaluator ranks the optimal path in top-k.

### 3. Algorithm-Problem Mismatch
**Mistake**: Using BFS for deep search problems or DFS for shallow ones because "that's what the paper used."

**Why It Fails**: Search strategy must match problem structure. BFS on 20-step problems → combinatorial explosion. DFS on problems with early pruning opportunities → wasted computation.

**Example**: Using DFS on Game of 24 reduced success rate from 92% to 52% in the paper's ablations.

### 4. Using ToT When Chain-of-Thought Suffices
**Mistake**: Adding search overhead when the problem doesn't have constraint interdependencies or when sampling diversity already works.

**Why It Fails**: ToT adds significant computational cost (multiple thoughts × evaluations × search steps). Only justified when simpler methods hit architectural ceilings.

**Signal**: If self-consistency with k=10 samples works, ToT is probably overkill.

### 5. Forgetting That This Is Architecture, Not Prompting
**Mistake**: Treating ToT as a clever prompt rather than a system design requiring state management, search control, and evaluation loops.

**Why It Fails**: You can't implement real lookahead/backtracking without explicit tree structure. "Just ask the LM to consider alternatives" in a single prompt is not ToT.

**Key**: True ToT requires code managing the search process, not just meta-prompts about thinking systematically.

## Shibboleths: Recognizing Deep Understanding

### Surface-level (read the abstract):
- "ToT makes LLMs think step by step in a tree"
- "It's like chain-of-thought but better"
- Treating ToT as a prompting technique

### Intermediate (read the paper):
- Can explain the Game of 24 results
- Knows ToT beats CoT on the three benchmark tasks
- Recognizes self-evaluation as key innovation

### Deep understanding (internalized the framework):

**1. Knows when NOT to use ToT**: 
"Our problem has 95% success with self-consistency, so ToT's complexity isn't justified. The failure mode isn't architectural—it's knowledge gaps."

**2. Designs thoughts from problem structure**:
"We tried sentence-level thoughts for story writing, but the LM can't meaningfully evaluate coherence until paragraph-level. Coarsening to paragraph thoughts reduced tree depth and improved final quality."

**3. Anticipates evaluation failure modes**:
"The evaluator might prefer safe, conventional ideas over creative ones. We need to test if it's systematically pruning the highest-quality paths by checking if human-preferred stories appear in the evaluated branches."

**4. Separates concerns cleanly**:
"We can swap BFS for DFS without touching thought generation or evaluation—that's how we discovered our problem actually needs beam search with width 5."

**5. Recognizes the knowing-doing gap**:
"The same model that fails to solve Game of 24 via generation correctly identifies which partial equations are promising. This asymmetry is why self-evaluation works."

**6. Understands token-vs-decision intelligence**:
"Chain-of-thought has 100% accuracy on trivial examples but 20% on hard ones, even with temperature=1 and 100 samples. That's not a prompting problem—early token commitments create bottlenecks. We need actual search."

**7. Thinks in tradeoff spaces**:
"Finer thoughts → better evaluation precision but exponentially larger trees. We chose 3-word-phrase granularity as the point where diversity peaks before computational cost dominates."

### The Ultimate Shibboleth

Someone who truly gets ToT can answer: **"When would you use standard prompting, chain-of-thought, self-consistency, and ToT for the SAME problem across different difficulty levels?"**

Deep answer:
- Easy instances (95%+ success): Standard prompting—overhead isn't justified
- Medium instances with knowledge gaps: Chain-of-thought—makes reasoning explicit, improves accuracy
- Medium instances with consistency issues: Self-consistency—same-approach diversity helps
- Hard instances with early commitment traps: ToT—need actual exploration before deciding

The key insight: These aren't competing techniques but a **ladder of architectural sophistication** matched to problem requirements.

---

*This skill helps you reason about reasoning systems—when to add deliberate search, how to structure thought spaces, and where the boundaries of different approaches lie.*