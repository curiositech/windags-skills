# Failure Modes in Automated Evaluation Systems: A Catalog for Agent System Designers

## Why Failure Mode Analysis Matters

The researchers' approach to LLM-as-a-judge is distinguished by its commitment to finding where the approach fails before claiming it succeeds. They do not merely report that GPT-4 agrees with humans 80% of the time — they design experiments specifically to break the system and catalog the mechanisms of failure.

This adversarial mindset toward one's own evaluation infrastructure is the correct approach for any production system. An evaluation system that has not been tested for failure modes is an evaluation system that will fail unexpectedly in production. The following catalog of failure modes, derived from the paper's experimental findings, applies broadly to any agent system that uses AI to evaluate AI.

---

## Failure Mode 1: The Positional Exploit

**What it is**: An agent can "win" an evaluation simply by being presented first, regardless of output quality.

**Severity**: Claude-v1 with default prompt favors the first position 75% of the time. This means that if your routing infrastructure always presents Agent A's output before Agent B's output, Agent A will win 75% of head-to-head comparisons in a Claude-judged system — not because it's better, but because it's first.

**Detection method**: Run the same evaluation twice with swapped ordering. Measure consistency rate. Below 70% consistency is dangerous; below 50% means the judge is essentially random.

**Exploit surface**: Any agent that knows its output will be presented first will be systematically advantaged. Any system design where ordering is non-random (e.g., alphabetical agent naming, consistent ordering conventions) will produce systematically distorted results.

**Mitigation**: Mandatory position swapping + consensus requirement. No exceptions.

---

## Failure Mode 2: The Verbosity Exploit

**What it is**: An agent can win evaluations by generating longer, more verbose outputs even when length adds no value.

**Severity**: 91.3% of evaluations by Claude-v1 and GPT-3.5 are corrupted by the repetitive list attack — a deliberately constructed verbose-but-empty response.

**This is an actively exploitable vulnerability in multi-agent systems.** If agents are competing for selection and are aware (directly or through fine-tuning dynamics) that longer outputs are preferred, there will be selection pressure toward verbosity. This is a form of reward hacking: the agent learns to optimize for the proxy metric (length) rather than the target metric (quality).

**Detection method**: Run the repetitive list attack on your judge. Generate a correct response. Double its length by inserting rephrased duplicates. Check if the judge prefers the bloated version. Failure rate above 20% indicates a dangerous verbosity bias.

**Mitigation**: 
1. Use only GPT-4-class judges (8.7% failure rate vs. 91.3%)
2. Preprocess responses to normalize length before judging (e.g., truncate to equal length)
3. Add explicit length normalization to the evaluation rubric
4. Test the judge against the repetitive list attack before deployment

---

## Failure Mode 3: The Self-Serving Judge

**What it is**: A judge that favors outputs from its own model family, creating a systematically biased evaluation.

**Severity**: Claude-v1 favors itself with ~25% higher win rate vs. human baseline. GPT-4 favors itself with ~10% higher win rate. These are large effects that corrupt leaderboard rankings.

**The mechanism is unclear but likely**: The model's "taste" for good responses was trained on examples from its own training distribution. When it evaluates, it applies those preferences. Outputs that stylistically resemble its own outputs are rated higher — not necessarily because they're better, but because they match the judge's internalized aesthetic.

**Detection method**: Compare win rates under different judges for the same model pairs. If model X does significantly better under judge X than under judge Y, self-enhancement bias is likely present.

**Mitigation**:
1. Use judges from different model families for final rankings
2. Ensemble multiple judges from different families and aggregate
3. Anchor judgments to human preference data through calibration

---

## Failure Mode 4: Context Contamination in Factual Evaluation

**What it is**: A judge is misled by the candidate answers it is evaluating, causing it to endorse incorrect answers even when it could independently identify the correct answer.

**Severity**: 70% failure rate for math evaluation with default prompt. Even with chain-of-thought prompting, 30% failure rate. The judge is more likely to be wrong than right on math problems without reference-guided evaluation.

**The most dangerous aspect**: The failure is silent. The judge does not say "I'm not sure" — it produces a confident, well-reasoned explanation for the wrong answer. The reasoning is internally coherent but factually wrong, because the reasoning itself was contaminated by the incorrect candidate answers.

**The chain-of-thought failure mode**: Figure 15 shows GPT-4 being instructed to "independently solve the question first" and then still copying the arithmetic errors from the candidate answers into its own step-by-step solution. The meta-instruction was not strong enough to override the contextual influence.

**Detection method**: Take a set of problems with known correct answers. Generate some incorrect candidate answers with confident-looking reasoning. Check whether the judge endorses the incorrect answers at elevated rates compared to a baseline of correct candidates.

**Mitigation**: Reference-guided evaluation — mandatory for any task with verifiable correct answers. No exceptions for math, code, logic, or factual evaluation.

---

## Failure Mode 5: Multi-Turn Attribution Error

**What it is**: In multi-turn conversation evaluation, the judge incorrectly attributes responses to the wrong assistant, leading to wrong judgments.

**The example** (Figure 16): A user asks about art masterpieces, then asks for a "concrete plan for your second example." Assistant A's second example was "The Persistence of Memory." Assistant B's second example was "Mona Lisa." The user wants a concrete plan for whichever assistant they're evaluating. When the evaluation is split into two prompts, GPT-4 confuses which assistant's prior response is being referenced, producing a wrong judgment — rating Assistant B's response as better because GPT-4 was looking for a plan about "Mona Lisa" but found it in B, while A had a plan about "Persistence of Memory."

**The structural failure**: When context is split across multiple prompts, cross-references between prompts are unreliable. The judge cannot look back to a prior API call.

**Detection method**: Evaluate multi-turn conversations both with split prompts and with unified prompts. Measure consistency of judgments. High inconsistency indicates attribution errors.

**Mitigation**: Always present complete conversation histories in a single prompt. Never split multi-turn evaluation across multiple API calls.

---

## Failure Mode 6: Category-Inappropriate Evaluation

**What it is**: Applying a judge or evaluation method designed for one category to a different category with different properties.

**The empirical basis**: Position bias is 36-42% consistency on writing/humanities but 86% consistency on math/coding. Verbosity bias is high for subjective responses but may be lower for technical responses where correctness is checkable.

**The risk in agent systems**: A routing agent that uses a single evaluation method for all task types will produce reliable results for some categories and unreliable results for others — without any indication of which evaluations are trustworthy.

**Detection method**: Measure evaluation reliability separately by task category. Identify which categories have high consistency and which have low consistency.

**Mitigation**: Maintain separate evaluation pipelines per task category:
- Math/code/logic: Reference-guided evaluation mandatory
- Writing/creative: Accept higher uncertainty; position swap mandatory
- Factual: Reference-guided or fact-checking tools
- Multi-turn dialogue: Full context mandatory; position swap recommended

---

## Failure Mode 7: Benchmark Saturation and Gaming

**What it is**: Static benchmarks become targets for optimization. Once a benchmark is widely used, models are fine-tuned to perform well on it, and the benchmark stops measuring the underlying capability.

**The paper's position**: This is acknowledged but not the paper's primary focus. The reference to DynaBench is a gesture toward the solution: dynamic, human-in-the-loop evaluation that can't easily be gamed because the questions change.

**For agent systems**: Any fixed evaluation set used in continuous improvement loops will eventually be gamed by the optimization process — either deliberately (if agents are updated to score well on evaluations) or accidentally (through distributional shift as agents are fine-tuned on evaluated interactions).

**Mitigation**:
- Rotate evaluation questions periodically
- Use Chatbot Arena-style crowdsourced evaluation for preference metrics
- Reserve a held-out evaluation set that is never used for optimization
- Monitor for suspicious performance improvements on evaluation sets vs. held-out tests

---

## System-Level Failure Mode: The Evaluation Feedback Loop

This failure mode is not explicitly in the paper but is implied by the system design:

**What it is**: An evaluation system is used to select between agent outputs. Those outputs are then used as training data. The evaluation system's biases are thus encoded into the training data and amplified over iterations.

**Example**: A judge with verbosity bias selects longer outputs. Longer outputs become training data. The fine-tuned agent produces even longer outputs. The judge selects those even more strongly. Output length spirals upward, uncoupled from quality.

**This is RLHF reward hacking at the evaluation infrastructure level.** If the judge is biased, and the bias is not corrected, fine-tuning on judge-selected outputs will amplify the bias.

**Mitigation**:
1. Human calibration of judge must happen before and during any training loop that uses judge selection
2. Periodic audits comparing judge-selected outputs to human-selected outputs
3. Explicit monitoring for known bias proxies (response length, response structure, etc.) in selected outputs over time
4. Diverse judge ensemble to prevent single-judge bias amplification

---

## The Failure Mode Interaction Map

Some failure modes amplify each other:

**Verbosity bias + Feedback loop**: Verbosity bias selects longer outputs → training amplifies length → outputs get longer → verbosity bias selects them more strongly → recursive length explosion.

**Position bias + Non-random ordering**: If your infrastructure always puts Agent A first (alphabetical ordering, registry ordering), position bias creates systematic Agent A advantage → Agent A always wins → Agent A gets selected for improvement → Agent B is never improved → performance gap widens, justifying Agent A's continued selection.

**Context contamination + Human spot checking**: If judges produce confidently wrong math evaluations, human spot-checkers may agree with the confident-sounding explanation even when the math is wrong. The explainability of LLM judges can amplify errors by making wrong judgments sound convincing.

---

## Failure Mode Detection Battery

For any WinDAGs evaluation infrastructure, run these tests before deployment:

| Test | What It Detects | Pass Criterion |
|------|----------------|----------------|
| Position swap consistency | Position bias | >70% consistency |
| Repetitive list attack | Verbosity bias | <20% failure rate |
| Self-comparison rate | Self-enhancement bias | Win rate within 10% of human baseline |
| Known-wrong answers in math | Context contamination | <20% endorsement of wrong answers |
| Split vs. unified multi-turn | Attribution error | >90% consistency |
| Category-specific consistency | Category-inappropriate evaluation | Consistency >65% in target categories |
| Benchmark drift test | Saturation/gaming | Performance on held-out vs. eval set within 5% |