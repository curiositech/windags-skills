# What Actually Predicts Model Performance: Scale, Training Procedure, and the Confounds

## The Scaling Law Paradox

HELM's empirical findings create a paradox for the field's dominant narrative about large language models. The narrative: "more compute → larger model → better performance." HELM finds this is true *within* model families but false *across* model families, and that a key confound — training procedure — is doing more work than scale alone.

The finding stated directly: "We find that model scale, within a model family, reliably predicts model accuracy, but for no scenario is it a good predictor of downstream accuracy across all models." (§1.2, Finding 25)

The visual evidence (Figure 29): plotting parameter count against accuracy for all 30 models across 16 scenarios produces a "chaotic" scatter. Models of similar size from different families perform radically differently. The 52B Anthropic-LM frequently outperforms the 530B TNLG on accuracy, robustness, and fairness metrics — with a 10× difference in model size working against it.

## Instruction Tuning as a Confound

The key finding is that instruction tuning — training a model on human-written instructions and their desired outputs, optionally with reinforcement learning from human feedback (RLHF) — provides benefits that scale alone cannot explain:

"text-davinci-002 performs best on our accuracy, robustness, and fairness metrics, with Anthropic-LM v4-s3 (52B) being in the top 3 for all 3 metrics (despite being more than 10× smaller in model scale compared to TNLG v2 (530B), which is the second most accurate and fair). Given the very strong performance of both models, and that they are the only instruction-tuned models we evaluate, this suggests instruction-tuning provides a broad set of advantages." (§1.2, Finding 1)

This is not a marginal effect. The gap is large, consistent, and multi-metric. The instruction-tuned 52B model consistently beats the non-instruction-tuned 530B model on accuracy, robustness, and fairness. On knowledge-intensive tasks (NaturalQuestions closed-book, MMLU), scale helps significantly — TNLG narrowly edges out Anthropic-LM. But on most tasks, the training procedure advantage is decisive.

## The Calibration Anomaly

A critical and counterintuitive finding: instruction tuning improves accuracy, robustness, and fairness, but the relationship with calibration is scenario-dependent and sometimes inverted.

For HellaSwag: the two most accurate models (text-davinci-002 and Cohere xlarge) have calibration errors of 0.286 and 0.341 respectively — worse than many less accurate models. Improving accuracy worsens calibration.

For OpenBookQA: improving accuracy improves calibration (correlation > 0.8 between accuracy and calibration quality).

"Improving accuracy worsens calibration [for HellaSwag], whereas for OpenBookQA, improving accuracy improves calibration." (§1.2, Finding 3)

This matters for deployability. A model that is accurate but poorly calibrated cannot be reliably used in systems that depend on confidence scores for routing, abstention, or downstream decision-making. The instruction-tuned models that dominate accuracy leaderboards may be actively misleading when their probability outputs are used as confidence signals.

## Perplexity as a Broken Predictor

One of the implicit assumptions of the field is that upstream language modeling performance (perplexity on a text corpus) predicts downstream task performance. HELM tests this directly:

"BPB on The Pile is a poor predictor of downstream accuracy." (§1.2, Finding 24)

The scatter plot (Figure 30) confirms this: no reliable relationship between bits-per-byte on The Pile and accuracy across the 16 core scenarios. Models that are trained on The Pile (GPT-J, GPT-NeoX, OPT, BLOOM) achieve the lowest BPB on The Pile — they're good at predicting its text — but this doesn't translate to the best downstream accuracy.

This failure has two sources:
1. **Contamination confound**: Some models are trained on The Pile; others are not. Comparing their BPB is measuring different things.
2. **Task mismatch**: Language modeling performance on web text doesn't necessarily correlate with performance on specific downstream tasks, especially if those tasks require instruction-following or factual knowledge that is not well-represented in the pretraining distribution.

The implication: perplexity-based capability predictions across disparate model families are unreliable. You cannot use perplexity to compare models from different families on downstream tasks.

## The Thresholding Effect for Scale

While scale doesn't predict rank within the top-10 models, there is a clear threshold effect: "all models that win head-to-head model comparisons for accuracy at a rate well above chance (i.e. > 55%) are at least 50B parameters." (§1.2, Finding 25)

Below 50B parameters: consistent mediocre performance. Above 50B parameters: high performance, but with large variance driven by training procedure. The scale threshold is necessary but not sufficient for high performance.

This implies a different way of thinking about scale: it's a gate condition, not a performance predictor. You need to be above the threshold, but once above it, training procedure, instruction tuning, and data curation become the dominant factors.

## Knowledge Acquisition as a Scale-Sensitive Capability

One specific domain where scale does predict performance clearly: knowledge-intensive tasks. TNLG v2 (530B) shows "a wide margin for [NaturalQuestions (closed-book)] and WikiFact" (§1.2, Finding 15) compared to Anthropic-LM v4-s3 (52B). The 530B model's advantage is 38.5% vs 28.7% for NaturalQuestions (closed-book) and 34.3% vs 22.3% for WikiFact — roughly 10 percentage point gaps that don't exist on most other tasks.

"TNLG v2 (530B) demonstrates a wide margin for these two scenarios, which generally concurs with the hypothesis that model scale especially contributes to improvements in acquisition of factual knowledge." (§1.2, Finding 15)

Factual knowledge seems to be stored in model parameters in a way that scales roughly with parameter count. Reasoning and instruction-following, by contrast, are more sensitive to training procedure than to raw scale.

## Reasoning and Code as Special Cases

For reasoning-intensive tasks, the dominant finding is that code-trained models outperform text-trained models, even on reasoning tasks posed in natural language:

"For reasoning-intensive scenarios, we find that the code models, especially code-davinci-002, consistently outperform the text models, even on synthetic reasoning scenarios posed in natural language." (§1.2, Finding 16)

For GSM8K (grade-school math word problems): code-davinci-002 achieves 52.1%, text-davinci-002 achieves 35.0%, and no other model surpasses 16%. The gap between code-trained and text-trained models is larger than the gap between any two text-trained models of different sizes.

The hypothesis: code training teaches structured, step-by-step reasoning patterns that transfer to mathematical and logical reasoning, even when expressed in natural language. "The ability to generate fluent and coherent human-like text" is not the limiting factor for reasoning — the ability to maintain coherent logical structure is.

## Application to Agent System Design

**Skill selection based on capability type.** Different skills should be backed by different model types based on the capability structure HELM reveals:
- Factual knowledge retrieval → favor large-scale base models
- Instruction-following, general task completion → favor instruction-tuned models
- Mathematical and logical reasoning → favor code-trained models or specialized reasoning models
- Tasks where calibrated confidence matters → avoid highly instruction-tuned models without calibration recalibration

**Don't use perplexity as a proxy for capability.** If you're selecting a model for a specific skill based on language modeling performance metrics, you will make poor decisions. Characterize models on task-specific performance measures.

**Scale is a gate condition for capability.** When selecting backbone models for new skills, filter first for scale threshold (>50B for state-of-the-art performance at time of HELM writing, though this evolves), then select based on training procedure alignment with the skill's capability requirements.

**Calibration-capability tradeoff.** If a skill's outputs feed downstream decision logic that uses confidence scores, prefer models with better calibration even at the cost of some accuracy. If a skill produces final outputs consumed by humans, prioritize accuracy.

**Anticipate knowledge cutoffs.** The knowledge acquired during pretraining is scale-dependent and frozen at training time. Skills that require recent factual knowledge must be augmented with retrieval — the base model's knowledge acquisition, however accurate, is temporally bounded.