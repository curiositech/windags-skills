# Failure Modes of AI Evaluation: How Benchmarks Break and What They Miss

## The Proliferation Problem

Before HELM, "models on average were evaluated on just 17.9% of the core HELM scenarios, with some prominent models not sharing a single scenario in common in their original works." (§1.1) Major models like T5 (11B) and Anthropic-LM v4-s3 (52B) had not been evaluated on a single common dataset. The evaluation landscape was not just sparse — it was **structurally biased toward the scenarios that researchers happened to care about** or that happened to exist as standardized benchmarks.

This creates a specific failure mode: the models that appear to win evaluations are the ones that were evaluated on the scenarios they were tuned for. Without common evaluation, there's no way to know whether a model that achieves state-of-the-art on three benchmarks would fail on the other 39.

HELM's response — evaluating all 30 models under identical conditions on all 16 core scenarios — reveals that "model comparisons are only valid under standardized conditions." Even for datasets that are frequently evaluated (e.g., HellaSwag), prior evaluations vary in whether they use fine-tuning or prompting, zero-shot or few-shot, different numbers of in-context examples. "On HellaSwag, some prior work reports fine-tuned accuracies (e.g. T5), whereas others report prompting accuracies (e.g. davinci). Even when works report results through few-shot prompting, the exact details can vary, which in §8.2 we show leads to wild swings in accuracies (e.g. 30% to 80% for the same (model, scenario))." (§1.1)

## Automated Metrics That Fail to Track Human Judgment

HELM identifies a specific failure of automated evaluation for summarization: "for summarization on CNN/DailyMail and XSUM, we find that automated evaluations on these datasets largely fail to discriminate differences we observed in model quality." (§1.2, Finding 10)

The ROUGE scores (measuring n-gram overlap between generated and reference summaries) are the standard metric for summarization. HELM measures them alongside faithfulness metrics (SummaC, QAFactEval) and human evaluation. The finding: ROUGE doesn't discriminate well between models of genuinely different quality.

The deeper problem: "CNN/DailyMail and XSUM have been the subject of critique, and that broader change is required for dataset and evaluation design in summarization." (§3.5) The standard benchmark datasets for a mature NLP task may have methodological problems that have been papered over by years of ROUGE-chasing. The metric becomes the target, and the target is a poor proxy for what you actually want.

This is an instance of Strathern's Law, explicitly invoked by HELM: "When a measure becomes a target, it ceases to be a good measure." (§11.2) Benchmarks create optimization pressure. If the benchmark metric is poorly aligned with the underlying desideratum, optimization pressure will eventually produce models that score well on the metric while failing on the desideratum.

## The Contamination Problem

HELM documents a pervasive and largely unquantified threat to evaluation validity: train-test contamination. When models are trained on data scraped from the Internet, and evaluation datasets are also sourced from the Internet, there is a real possibility that test instances appeared in training data.

"We generally lack a precise characterization of, and access to, the training data for these models with notable exceptions." (§6) For most models, neither the researchers nor the users can determine whether contamination has occurred. The few documented instances (Table 13) are ones where the model developers voluntarily disclosed training data composition — a minority.

The contamination problem is especially pernicious for few-shot evaluation. In few-shot prompting, the model is not being fine-tuned on the task. But if the model was trained on instances that are statistically similar to the test distribution, the "few-shot generalization" being measured is at least partially just "retrieval from pre-training." This compromises the legitimacy of few-shot evaluation as a measure of generalization.

HELM's response: flag known contamination, encourage disclosure, use canaries (deliberately generated instances unlikely to appear in pretraining data). But the ultimate conclusion is honest: "we have a limited understanding on how contaminated models are, and to what extent this compromises the validity and legitimacy of our evaluation." (§1.1)

## The Aggregation Dilemma

HELM produces a (scenario × metric) score matrix rather than a single score. This is more informative but creates a practical problem: how do you compare models? "While it is possible for model A to be strictly better on every metric for every scenario than model B (i.e. strict Pareto dominance), in almost all cases A is sometimes better and B is sometimes better when one is sufficiently holistic/expansive." (§11.3)

HELM declines to define a canonical aggregation: "We leave the question of aggregating model performance to a single number...to future work. We do not believe there exists a universal aggregation that satisfies all preferences, reflects all values, or captures all circumstances appropriately." (§11.3)

This is epistemically honest but operationally uncomfortable. Every stakeholder who wants to "compare models" will implicitly aggregate somehow — typically by looking at accuracy alone, which is exactly the failure mode HELM is designed to prevent. The absence of a canonical aggregation means that the multi-metric framework will tend to be reduced to single-metric comparisons in practice, defeating its purpose.

## The Validity and Reliability Gap

HELM acknowledges that dataset quality is not guaranteed: "while all the datasets we use were introduced in works with some process for quality assurance...we note no unified standard has been set to ensure all datasets are sufficiently valid." (§11.2)

Validity: does the metric actually measure what it claims to measure? A dataset that claims to measure "toxicity detection" may be measuring "keyword matching" or "majority-annotator agreement in a US context" — neither of which is the same as toxicity in the general case.

Reliability: does the measurement vary systematically with undesired factors? Low reliability means you'd get different results with different annotators, different test instances, different random seeds. HELM uses 3 random seeds for in-context example selection and 1,000 instances per evaluation — enough to detect large effects but potentially underpowered for detecting subtle ones.

"We emphasize the importance of significance testing for making meaningful comparisons given we only run 3 random seeds (due to cost) for selecting in-context examples and we evaluate on 1000 instances instead of the full validation/test set." (§11.2)

## The Disinformation Risk Paradox

An unexpected finding: the most capable models pose the highest disinformation risk. "The largest models (particularly text-davinci-002 and Anthropic-LM v4-s3 (52B)) are effective at generating realistic headlines that support a given thesis." (§1.2, Finding 18) And the correlation between memorization and accuracy is positive: "the regurgitation risk clearly correlates with model accuracy: text-davinci-002, davinci, and Anthropic-LM v4-s3 (52B) demonstrate the highest amount of verbatim regurgitation in line with their high accuracies." (§1.2, Finding 17)

This creates a troubling tradeoff: the models best suited for beneficial applications are also the models most capable of harmful applications. "The bottle-neck for using model generations for disinformation is reliability: if model generations need extensive human post-editing, the cost and risk of using them might be comparable to hiring humans to author text in the first place." (§5.5) But the most capable models reduce this bottleneck.

Evaluating only beneficial capabilities without evaluating dual-use risks produces an incomplete picture. A model that appears excellent on the accuracy, robustness, and fairness metrics is simultaneously a more capable disinformation tool.

## The Social Bias Accuracy Paradox

One of the most striking empirical findings in HELM: for the BBQ bias dataset, the most accurate models show the *highest* social bias in ambiguous contexts. "Text-davinci-002 demonstrates the strongest bias that aligns with overarching societal biases and marginalization in ambiguous contexts, and the other two models [T0++ and TNLG v2 (530B)] are the only other ones with similar biases." (§8.4)

Simultaneously, the less accurate models show biases *against* broader societal patterns — a different and puzzling failure mode. The relationship between accuracy and bias is non-monotonic and context-dependent. "For BBQ the most accurate models are precisely those that are most concerning for social biases in ambiguous contexts." (§1.2, Finding 19)

This means that optimizing for accuracy on benchmarks does not move you toward lower bias. It may move you toward higher bias on dimensions that matter most in deployment.

## Application to Agent System Design

**Benchmark your skills on scenarios representative of actual deployment.** If a skill will be used in medical contexts, benchmark it on medical text, with medical terminology, with medical user queries. Generic benchmark performance is only partially predictive of domain-specific performance.

**Instrument dual-use capabilities.** If an agent system includes skills for persuasive writing, summarization, or information synthesis, these skills should be characterized for their potential misuse (disinformation generation, content policy violations) as well as their intended use. The capability is the capability regardless of intent.

**Treat calibration as a first-class requirement for high-stakes routing.** If confidence scores from an agent are used to decide whether to escalate to human review, miscalibrated confidence will cause systematic errors — overconfident wrong answers escape review, underconfident right answers are unnecessarily escalated.

**Design for graceful degradation under perturbation.** The performance gap between standard and perturbed inputs (accuracy vs. robust accuracy) tells you how much to trust an agent's outputs when inputs are noisy, informal, or from unexpected domains. Skills with large accuracy/robustness gaps should be used only in controlled-input contexts.

**Use targeted evaluations to stress-test specific risks.** Beyond core scenarios, run targeted evaluations on specific failure modes relevant to your deployment context: hallucination rate, performance on underrepresented user groups, behavior under adversarial prompts.