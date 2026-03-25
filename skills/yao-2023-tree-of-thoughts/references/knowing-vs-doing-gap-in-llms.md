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