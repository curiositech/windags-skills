# The Four Biases of LLM Judges: A Taxonomy for Agent System Design

## Why This Matters for Agent Systems

In any WinDAGs orchestration where one AI agent evaluates, scores, routes, or selects between outputs of other agents, that evaluating agent is functioning as an **LLM judge**. This includes: quality-routing agents that decide which answer to return to the user; debate-resolution agents that adjudicate between competing agent outputs; review agents in code generation pipelines; and meta-agents that assess task completion. The research by Zheng et al. (NeurIPS 2023) is the most systematic empirical study of how LLM judges fail — and it names four distinct failure modes that any agent system designer must understand.

---

## Bias 1: Position Bias

**Definition**: An LLM judge exhibits a propensity to favor responses based on their position in the prompt (first vs. second), independent of response quality.

**Empirical severity**: Claude-v1 with the default prompt shows only **23.8% consistency** when responses are swapped — meaning its judgment flips in 76.2% of cases when the order of two responses is reversed. GPT-3.5 achieves 46.2% consistency. Only GPT-4 reaches 65.0%, and even that is far from perfect.

**The mechanism**: Most LLM judges favor the *first* position. Claude-v1 also exhibits *name bias* — it systematically favors whichever assistant is labeled "Assistant A," regardless of content. The bias appears to stem from training data patterns or the left-to-right autoregressive architecture, though the authors leave deeper study to future work.

**Category variation is critical**: Position bias is NOT uniform across task types. On math and coding questions, consistency reaches 86% — judges are more confident (though they may be confidently wrong). On writing and humanities questions, consistency drops to 36-42%. This means a routing agent that uses LLM judgment to select between creative writing outputs is *dramatically* more vulnerable to position bias than one evaluating code correctness.

| Category | Consistent | Biased toward first |
|----------|-----------|---------------------|
| Writing | 42% | 46% |
| Humanities | 36% | 60% |
| Reasoning | 76% | 20% |
| Math | 86% | 4% |
| Coding | 86% | 14% |

**Model pair interaction**: Position bias is most severe when competing outputs are *similar in quality*. When GPT-3.5 is judged against Claude-v1 (similar capability), consistency is 67.5%. When GPT-3.5 is judged against LLaMA-13B (large quality gap), consistency reaches 98.8%. This is the "easy case" principle: judges are reliable when the answer is obvious, unreliable when it's close.

**Mitigation — Position Swapping**: Call the judge twice with responses in reversed order. Only declare a winner when the same response wins in both orderings; otherwise declare a tie. This conservative approach eliminates positional advantage entirely at the cost of double API calls and an increased tie rate. The authors use this mitigation in their main experiments.

**Mitigation — Few-Shot Examples**: Providing three high-quality judging examples (A better, B better, tie) improves GPT-4 consistency from 65.0% to 77.5%. However: (a) this 4x increases prompt length and API cost, and (b) "high consistency may not imply high accuracy and we are not sure whether the few-shot examples will introduce new biases." Use with caution.

**Agent system design implication**: Any agent that selects between two options should never rely on a single LLM evaluation call. The evaluation infrastructure must either swap positions and require agreement, or use score-based evaluation that avoids relative ordering entirely.

---

## Bias 2: Verbosity Bias

**Definition**: LLM judges systematically prefer longer, more verbose responses even when length adds no informational value — and even when the length is created by pure repetition.

**The "repetitive list" attack experiment**: The researchers took 23 model answers containing numbered lists and created a "bloated" version by asking GPT-4 to rephrase each list item and insert the rephrased items *before* the original items. The bloated response contained the same information twice — once rephrased, once original — with no new content. They then asked LLM judges to compare the original vs. bloated response.

**Results**:
- Claude-v1: **91.3% failure rate** (judged the bloated, redundant response as better)
- GPT-3.5: **91.3% failure rate**
- GPT-4: **8.7% failure rate** (largely resistant)

This is not a subtle bias. Claude-v1 and GPT-3.5 are fooled more than 9 times out of 10 by the mere presence of more text, even text they were told not to let influence their judgment.

**What makes this insidious**: The standard judge prompt explicitly instructs "Do not allow the length of the responses to influence your evaluation." Despite this instruction, Claude-v1 and GPT-3.5 cannot follow it. The instruction is processed but not obeyed. Only GPT-4 demonstrates meaningful resistance.

**Calibration test**: All judges correctly identify *identical* responses as a tie. The failure is specific to the scenario where length is added without quality. This means verbosity bias is not a general incapacity — it's triggered specifically when length and quality are decoupled.

**Agent system design implication**: In any pipeline where agents compete for selection (debate patterns, parallel generation with selection), agents that generate longer outputs will be systematically favored by all but the strongest judges. This creates a perverse incentive: agents can "win" evaluations not by being better, but by being wordier. System designers should:
1. Use only GPT-4-class models as judges in verbosity-sensitive contexts
2. Consider preprocessing responses to normalize length before judging
3. Explicitly test judge models against the repetitive list attack before deploying them in routing roles

---

## Bias 3: Self-Enhancement Bias

**Definition**: LLM judges may systematically favor outputs generated by models similar to themselves (or by themselves directly).

**Empirical status — partially confirmed**: The researchers examine win rates under different judges vs. human evaluation. Compared to humans, GPT-4 gives itself a ~10% higher win rate; Claude-v1 gives itself ~25% higher win rate. However, GPT-3.5 does not show this pattern. Due to limited data and the confound that stylistically similar outputs are also harder to distinguish, the authors cannot definitively confirm self-enhancement bias.

**Why it's hard to isolate**: "Conducting a controlled study is challenging because we cannot easily rephrase a response to fit the style of another model without changing the quality." The bias may reflect genuine quality correlation (models judge what's good by their own standards, which may be correct) or it may reflect stylistic favoritism (models prefer their own voice). Both are real concerns for agent systems.

**Agent system design implication**: Do not use a model to be the sole judge of outputs from models in its own family or with the same training approach. In a multi-agent debate system, if the mediator/judge agent is GPT-4, GPT-4-generated arguments will receive a systematic advantage. Where possible, use diverse judge ensembles or human-calibrated reference judges.

---

## Bias 4: Limited Reasoning Capability Under Context Contamination

**Definition**: LLM judges fail to correctly evaluate responses to math and reasoning questions because they are *misled by the answers being evaluated*, even when they can correctly solve the same problems independently.

**This is the most subtle and dangerous bias.** It is not simply that judges can't do math — GPT-4 can solve the problems presented. The failure occurs because when GPT-4 is shown an incorrect answer *in the context of judging*, it incorporates that answer's logic into its own reasoning process and arrives at the same wrong answer.

**The math example** (Figure 13): Benjamin buys books worth $295 total. Assistant B answers correctly ($295). Assistant A answers incorrectly ($115). GPT-4's judgment correctly identifies B as right — but when computing the total itself, makes an arithmetic error (arrives at $280), copying the *structure* of the shown work despite being able to independently compute $295.

**The reasoning example** (Figure 14): A logic problem about fruit prices where the correct answer is "true." Both assistants answer "false." GPT-4 judges both assistants as correct — because when it encounters confident wrong answers in context, it updates toward them.

**Chain-of-thought makes it worse in some cases**: Even with a chain-of-thought prompt instructing GPT-4 to "independently solve the question first," it still copies the reasoning errors from the shown answers (Figure 15). The contamination is stronger than the meta-instruction to be independent.

**The judge failure rate on math problems**:
| Prompt Type | Failure Rate |
|-------------|-------------|
| Default | 14/20 (70%) |
| Chain-of-Thought | 6/20 (30%) |
| Reference-guided | 3/20 (15%) |

**Mitigation — Reference-Guided Judging**: Generate the judge's own answer *independently* first, store it as a reference answer, then present it in the judging prompt. This reduces failure rate from 70% to 15%. The key is that the reference is generated *before* contaminating context is introduced.

**Agent system design implication**: Any agent that evaluates code correctness, mathematical reasoning, or logical validity must use reference-guided evaluation — never raw pairwise comparison. The judge must commit to an answer before seeing the candidates. This is the agent equivalent of "write down your prediction before looking at the results."

---

## The Bias Interaction Matrix

These four biases interact in important ways:

| Scenario | Dominant Bias | Recommended Mitigation |
|----------|--------------|------------------------|
| Creative writing evaluation | Position + Verbosity | Position swap + GPT-4-class judge |
| Math/code correctness | Reasoning contamination | Reference-guided judging |
| Similar-quality model comparison | Position | Position swap |
| Different-quality model comparison | None (low bias) | Standard evaluation |
| Same-model family comparison | Self-enhancement | Diverse judge ensemble |

---

## Summary: What Judge Quality Buys You

The data shows a clear capability cliff. GPT-4 class judges are qualitatively different from GPT-3.5 and Claude-v1 on every bias dimension:
- Position bias: GPT-4 65% consistent vs. Claude-v1 23.8% consistent
- Verbosity bias: GPT-4 8.7% failure vs. Claude-v1/GPT-3.5 91.3% failure
- Reasoning: GPT-4 reduces to 15% failure with reference-guided prompting

The implication for WinDAGs: **judge agent selection is not a cost-optimization decision — it is a reliability decision.** Using a weaker judge to save costs introduces systematic distortions that corrupt every routing and selection decision downstream. The cost of a bad judge is not the API cost — it is the degraded quality of every output selected by that judge.