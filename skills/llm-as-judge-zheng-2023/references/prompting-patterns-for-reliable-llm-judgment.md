# Prompt Engineering for Reliable LLM Judgment: Validated Patterns and Their Mechanisms

## Why Prompt Design Is Not Cosmetic

The research presented in Zheng et al. demonstrates conclusively that **prompt design has large, measurable effects on judge reliability** — effects large enough to change which model "wins" a comparison. This is not a matter of fine-tuning — it's about how the prompt structures the cognitive task for the judge.

The finding that Claude-v1 goes from 23.8% consistency (default prompt) to 56.2% consistency (rename prompt) simply by changing assistant labels is striking. The same model, the same question, the same responses — but different labeling conventions produce radically different reliability. Understanding *why* enables principled prompt engineering for any evaluation task.

---

## The Default Pairwise Comparison Prompt: What Each Element Does

The researchers' validated default prompt (Figure 5) contains specific elements that each serve a function:

```
[System]
Please act as an impartial judge and evaluate the quality of the responses 
provided by two AI assistants to the user question displayed below.
```
**Function**: Frame-setting. The word "impartial" is a direct instruction to suppress bias. This alone doesn't eliminate bias but reduces it. Without frame-setting, the model defaults to its natural response patterns (which include position bias).

```
You should choose the assistant that follows the user's instructions and 
answers the user's question better.
```
**Function**: Primary criterion specification. The instruction to evaluate "which follows instructions better" focuses the judge on alignment with user intent rather than style, length, or other surface features.

```
Your evaluation should consider factors such as the helpfulness, relevance, 
accuracy, depth, creativity, and level of detail of their responses.
```
**Function**: Multi-dimensional rubric. Listing specific evaluation dimensions prevents the judge from collapsing to a single heuristic (like length). Each dimension is a separate axis.

```
Begin your evaluation by comparing the two responses and provide a short 
explanation.
```
**Function**: Chain-of-thought activation. Requiring explanation before verdict forces the model to generate reasoning, which anchors the judgment in explicit logic rather than pattern matching. This is a lightweight form of scratchpad reasoning.

```
Avoid any position biases and ensure that the order in which the responses 
were presented does not influence your decision.
Do not allow the length of the responses to influence your evaluation.
Do not favor certain names of the assistants.
Be as objective as possible.
```
**Function**: Bias suppression instructions. The paper shows these reduce but do not eliminate biases. The explicit verbosity bias instruction fails for Claude-v1 and GPT-3.5 (91% failure rate against repetitive list attack). But for GPT-4, these instructions significantly help — suggesting that stronger models are better able to follow metacognitive instructions.

```
After providing your explanation, output your final verdict by strictly 
following this format: "[[A]]" if assistant A is better, "[[B]]" if 
assistant B is better, and "[[C]]" for a tie.
```
**Function**: Structured output enforcement. The double-bracket format ([[A]]) is specifically chosen to be easily parseable. The constraint to produce this exact format reduces error rates. Claude-v1 and GPT-3.5 show higher error rates (failing to follow the format) than GPT-4, contributing to their lower reliability.

---

## The Reference-Guided Prompts: The Two-Phase Architecture

The reference-guided approach requires two separate API calls with two separate prompts.

### Phase 1: Independent Solution Generation

This prompt is NOT in the paper explicitly — it is implied by the method. The key requirement is that the judge generates its answer without any candidate answers present:

```
[System]
You are solving the following problem. Show your work step by step.
Produce a complete, correct answer.

[Question]
{question}
```

The independence is the point. No candidates, no context contamination. Store the output as `reference_answer`.

### Phase 2: Reference-Guided Pairwise Judgment (Figure 8)

```
[System]
Please act as an impartial judge and evaluate the quality of the responses 
provided by two AI assistants to the user question displayed below. Your 
evaluation should consider correctness and helpfulness. You will be given a 
reference answer, assistant A's answer, and assistant B's answer. Your job 
is to evaluate which assistant's answer is better. Begin your evaluation by 
comparing both assistants' answers with the reference answer. Identify and 
correct any mistakes. Avoid any position biases and ensure that the order in 
which the responses were presented does not influence your decision. Do not 
allow the length of the responses to influence your evaluation. Do not favor 
certain names of the assistants. Be as objective as possible. After providing 
your explanation, output your final verdict by strictly following this format: 
"[[A]]" if assistant A is better, "[[B]]" if assistant B is better, and 
"[[C]]" for a tie.

[User Question]
{question}

[The Start of Reference Answer]
{answer_ref}
[The End of Reference Answer]

[The Start of Assistant A's Answer]
{answer_a}
[The End of Assistant A's Answer]

[The Start of Assistant B's Answer]
{answer_b}
[The End of Assistant B's Answer]
```

**Critical structural choice**: The reference answer appears *before* the assistant answers. This ordering is deliberate — it establishes the reference as the primary evaluative anchor before the potentially contaminating candidate answers are introduced.

**Effect**: Reduces math grading failure from 70% to 15%.

---

## The Chain-of-Thought Judge Prompt: Capabilities and Limitations

The CoT judge prompt (Figure 7) instructs the judge to "independently solve the user question step-by-step first":

```
[System]
Please act as an impartial judge and evaluate the quality of the responses 
provided by two AI assistants to the user question displayed below. Your 
evaluation should consider correctness and helpfulness. You will be given 
assistant A's answer, and assistant B's answer. Your job is to evaluate which 
assistant's answer is better. You should independently solve the user question 
step-by-step first. Then compare both assistants' answers with your answer. 
Identify and correct any mistakes...
```

**What CoT achieves**: Drops failure rate from 70% to 30% on math questions. The reduction is real.

**What CoT fails to achieve**: It still fails 30% of the time. More importantly, Figure 15 demonstrates *why*: even when asked to think independently, GPT-4 "exactly copied Assistant B's answer (which contains arithmetic errors) and determined Assistant A's answer is incorrect." The contamination happens *within the chain-of-thought itself* — the model generates what looks like independent reasoning but is actually copying the structure of the shown incorrect answer.

**The mechanism of CoT contamination**: The model is asked to think step-by-step in the same context window as the candidate answers. When generating step-by-step work, the model is influenced by the most recent relevant content in its context — which is the candidate answers. The instruction to "think independently" is a metacognitive instruction that the model cannot fully obey because independence requires *spatial* separation of contexts, not just an instruction.

**Conclusion**: CoT is better than nothing but worse than reference-guided. Reference-guided is better because the independence is enforced architecturally (separate API call) rather than just instructed. Always prefer architectural enforcement over instructional enforcement when possible.

---

## The Multi-Turn Prompt: Structural Lessons

The multi-turn evaluation prompt (Figure 9) reveals important structural principles:

```
<|The Start of Assistant A's Conversation with User|>
### User:
{question_1}
### Assistant A:
{answer_1}
### User:
{question_2}
### Assistant A:
{answer_2}
<|The End of Assistant A's Conversation with User|>

<|The Start of Assistant B's Conversation with User|>
### User:
{question_1}
### Assistant B:
{answer_1}
### User:
{question_2}
### Assistant B:
{answer_2}
<|The End of Assistant B's Conversation with User|>
```

**Structural lesson 1 — Conversation boundaries**: Clear delimiters (`<|The Start of...|>`, `<|The End of...|>`) prevent the judge from confusing which assistant said what. Without these, the model makes attribution errors.

**Structural lesson 2 — Consistent labeling**: "Assistant A" and "Assistant B" are used consistently throughout, creating clear reference anchors.

**Structural lesson 3 — Complete context**: The full conversation is present in a single prompt. The failure mode of splitting into two prompts (Figure 16) demonstrates that GPT-4 cannot reliably cross-reference between separate API calls even for the same conversation.

**General principle**: Context that must be reasoned about together must be present together. This applies to any prompt where the judge needs to track relationships between pieces of information.

---

## The Position Swapping Protocol: Implementation Details

The conservative position swap protocol the researchers use:

```python
def judge_with_swap(question, answer_a, answer_b, judge_model):
    # Call 1: A first
    result_1 = judge(question, answer_a, answer_b, judge_model)
    
    # Call 2: B first (swap)
    result_2 = judge(question, answer_b, answer_a, judge_model)
    # Interpret result_2 from B's perspective
    result_2_reinterpreted = flip_verdict(result_2)
    
    # Consensus logic
    if result_1 == result_2_reinterpreted == "A wins":
        return "A wins"
    elif result_1 == result_2_reinterpreted == "B wins":
        return "B wins"
    else:
        return "tie"  # Inconsistent → treat as tie
```

This doubles API costs but eliminates positional advantage. In close comparisons, it will increase tie rate — which is the correct response to genuine uncertainty.

**The "aggressive" alternative**: Randomly assign positions across many evaluations. Individual evaluations remain noisy, but at scale, positional advantage averages out. Appropriate for leaderboard-style evaluation with many comparisons, not for individual high-stakes selections.

---

## The Single Answer Grading Prompt: When and Why

The single-answer grading prompt (Figure 6) asks for a 1-10 score with explanation. The paper finds that GPT-4 single-answer grading "matches both pairwise GPT-4 and human preferences very well" and that "GPT-4 has a relatively stable internal rubric."

**When to use single-answer grading**:
- Building a leaderboard (need to rank many models)
- Continuous monitoring (need comparable scores over time)
- When two candidates are not known in advance

**When to prefer pairwise**:
- Direct A/B comparison of two specific agents
- When subtle differences matter (pairwise is more sensitive to fine distinctions)
- When tie handling is less important

**The rubric stability finding is important**: If GPT-4 has a "relatively stable internal rubric," then single-answer scores from GPT-4 are comparable across evaluations, enabling meaningful aggregation. This is not guaranteed for weaker models, whose absolute scores may shift based on contextual factors.

---

## Summary: The Prompt Engineering Decision Tree

```
Task type: Math / Code / Logic / Factual?
  → YES: Use reference-guided grading (two-phase)
  → NO: Continue

Number of candidates:
  → 2: Use pairwise comparison with position swap
  → >2: Use single-answer grading

Multi-turn context?
  → YES: Present full conversation in single prompt
  → NO: Standard prompt

High-stakes decision?
  → YES: Use GPT-4 class judge only
  → NO: Acceptable to use GPT-3.5 with awareness of ~91% verbosity failure rate

Evaluating similar-quality models?
  → YES: Position swap is critical; consider human escalation for ties
  → NO: Standard automated evaluation is reliable
```