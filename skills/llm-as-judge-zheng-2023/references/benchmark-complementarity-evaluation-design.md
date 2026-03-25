# What Benchmarks Actually Measure: The Complementarity Principle and Its Implications for Agent Evaluation

## The Fundamental Misalignment Problem

The paper opens with an observation that should disturb anyone building AI evaluation infrastructure:

> "The heightened user preference does not always correspond to improved scores on traditional LLM benchmarks — benchmarks like MMLU and HELM cannot effectively tell the difference between these aligned models and the base models."

LLaMA-13B, an unaligned base model, performs comparably to Vicuna-13B on MMLU-style benchmarks. But in actual conversation, as Figure 1 illustrates dramatically, LLaMA-13B produces repetitive, degenerate responses while Vicuna-13B produces coherent, helpful multi-turn dialogue. MMLU cannot see this difference.

This is not merely a "benchmark saturation" problem (where models have been over-trained to ace specific tests). It is a **measurement validity** problem: the benchmarks are measuring the wrong thing. They measure core knowledge retrieval under constrained conditions. They do not measure the ability to follow multi-turn instructions, adapt to user intent, maintain conversational coherence, or produce output that humans find genuinely useful.

---

## The Two-Benchmark Complementarity Finding

The researchers' empirical demonstration of complementarity is precise and instructive. Table 8 shows the cross-benchmark results for LLaMA and Vicuna model variants:

| Model | MMLU (5-shot) | MT-Bench Score |
|-------|--------------|----------------|
| LLaMA-7B | 35.2 | 2.74 |
| LLaMA-13B | 47.0 | 2.61 |
| Alpaca-7B | 40.1 | 4.54 |
| Alpaca-13B | 48.1 | 4.53 |
| Vicuna-7B (selected, 4.8M tokens) | 37.3 | 5.95 |
| Vicuna-7B (single, 184M tokens) | 44.1 | 6.04 |
| Vicuna-13B (all, 370M tokens) | 52.1 | 6.39 |
| GPT-3.5 | 70.0 | 7.94 |
| GPT-4 | 86.4 | 8.99 |

**Key observation 1**: Vicuna-7B (selected) — trained on only 4.8M tokens of high-quality GPT-4 conversations — achieves an MT-Bench score of 5.95, dramatically better than LLaMA-13B (2.61) which was trained on 1 trillion tokens. The conversation-alignment training had a massive effect on human preference metrics while barely moving MMLU.

**Key observation 2**: "A small high-quality conversation dataset can quickly teach the model a style preferred by GPT-4 (or approximately human) but cannot improve MMLU significantly." This means the two metrics are measuring genuinely different properties — not just different difficulty levels of the same underlying capability.

**Key observation 3**: "No single benchmark can determine model quality, meaning that a comprehensive evaluation is needed." This is not a hedging statement — it is an empirical finding. The correlation between MMLU and MT-Bench is real but far from determinative.

---

## The Three Categories of LLM Benchmarks

The paper provides a useful taxonomy:

**1. Core-knowledge benchmarks** (MMLU, HellaSwag, ARC, WinoGrande, HumanEval, GSM-8K, AGIEval): Evaluate pre-trained LLM capabilities using zero-shot and few-shot settings. Require short, specific answers that can be automatically validated. Measure: *what does the model know?*

**2. Instruction-following benchmarks** (Flan, Self-Instruct, NaturalInstructions): Slightly more open-ended, used to evaluate post-instruction-fine-tuning models. Measure: *can the model follow diverse instructions?*

**3. Conversational / preference benchmarks** (MT-Bench, Chatbot Arena, CoQA): Evaluate multi-turn conversational ability and human preference alignment. Measure: *is the model useful to actual humans in realistic interaction?*

The critical insight: **these three categories measure genuinely different things, and a model can be excellent on one while being poor on another.** This is not a transitional state to be fixed — it reflects different underlying capabilities.

---

## What This Means for Agent System Evaluation

### The Routing Evaluation Problem

In WinDAGs, routing decisions — which agent to invoke for a given task — often depend on some model of agent capability. If that capability model is built from benchmark-style scoring, it will systematically mismatch agent selection for preference-dependent tasks.

Concretely: if your system routes tasks to "the best agent at reasoning" based on GSM-8K scores, you may be routing correctly for isolated arithmetic reasoning but incorrectly for multi-turn problem-solving conversations where instruction following and response quality matter as much as raw accuracy.

**Recommendation**: Maintain separate capability profiles per task type, and ensure that conversational/preference-aligned tasks use preference-based capability estimates, not just capability benchmarks.

### The Evaluation Pyramid

For agent system quality assessment, a hybrid evaluation architecture is necessary:

**Layer 1 — Capability assertions** (automated, fast): Does the agent output pass syntactic validators? Does code execute? Do factual answers match reference facts? These are MT-Bench-analogous capability checks.

**Layer 2 — Preference scoring** (LLM judge, GPT-4 class): Is the output helpful, relevant, accurate, deep, appropriately detailed? This requires a strong LLM judge using the validated prompts from this paper.

**Layer 3 — Human spot checks** (expensive, periodic): Sample-based human evaluation to calibrate the LLM judge and detect drift.

The key insight: Layer 1 cannot substitute for Layer 2, and Layer 2 cannot substitute for Layer 1. They measure different things.

### Task-Category Awareness in Evaluation

The MT-Bench category-wise analysis (Table 7) reveals that models have dramatically different strength profiles:

| Model | Math | Coding | Writing | Reasoning |
|-------|------|--------|---------|-----------|
| GPT-4 | 66.1% | 56.3% | 61.2% | 49.3% |
| GPT-3.5 | 63.8% | 55.0% | 50.9% | 32.6% |
| Vicuna-13B | 18.0% | 36.9% | 39.7% | 20.1% |

GPT-3.5 and GPT-4 have similar *overall* win rates in math/coding because both fail certain hard questions — but GPT-4 is significantly better in direct pairwise comparison. Win rate as a summary statistic conceals this.

**Implication**: Agent routing that uses a single quality score to select among agents will make different errors depending on task category. A system that routes to "the best agent" will systematically underperform a system that routes to "the best agent for this category of task."

---

## The Agreement Gradient: When Judges Are Reliable

One of the most practically useful findings in the paper is that **LLM judge agreement with humans scales with the performance gap between compared models** (Figure 2):

- When model win rate difference is near 0 (very similar models): GPT-4 agreement with humans ≈ 70%
- When model win rate difference is large (very different models): GPT-4 agreement with humans ≈ 100%

This means automated evaluation is highly reliable for "easy" comparisons and less reliable for "hard" comparisons. The appropriate response is not to distrust automated evaluation universally — it is to **reserve expensive human evaluation for close cases where automated judgment is least reliable.**

**Implementation pattern for WinDAGs**: 
1. Run automated evaluation (GPT-4 judge, position-swapped)
2. If the evaluation produces a clear winner (large score gap), trust it
3. If the evaluation produces a tie or near-tie, escalate to human review or additional evaluation with reference guidance
4. Only invest human evaluation effort where it adds the most value — close comparisons

---

## Static vs. Dynamic Benchmarks: The Saturation Problem

The paper mentions DynaBench as a kindred approach: "DynaBench addresses the challenges posed by static standardized benchmarks, such as saturation and overfitting, by emphasizing dynamic data with human-in-the-loop."

This points to a fundamental limitation that the paper's authors are honest about: static benchmarks become targets for optimization. Once MMLU becomes a standard benchmark, models are fine-tuned on MMLU-adjacent data, and MMLU scores stop measuring the underlying capability they were designed to measure.

**For agent system evaluation**: Any fixed benchmark used to evaluate agent quality will eventually be optimized against. Evaluation infrastructure must include:
1. Rotating question sets that prevent memorization
2. Human-in-the-loop evaluation for novel cases
3. Chatbot Arena-style crowdsourced evaluation for preference metrics that are harder to game
4. Category-specific evaluation that prevents "Goodhart's Law" gaming via narrow optimization

The Chatbot Arena model — where users interact with anonymous models and vote based on genuine preference, without knowing which model they're evaluating — is the most "gaming-resistant" evaluation design in the paper. Its weakness is cost and scale. Its strength is authenticity.