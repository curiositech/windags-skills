# The Multi-Metric Imperative: Why Single-Score Evaluation Fails Complex AI Systems

## The Core Problem

When AI systems are evaluated using a single metric — typically accuracy — something fundamental is hidden: the system's behavior along every other dimension that matters for deployment. HELM makes this concrete through empirical demonstration across 30 language models: "Too often in AI, this has come to mean the system should be accurate in an average sense. While (average) accuracy is an important, and often necessary, property for a system, accuracy is often not sufficient for a system to be useful/desirable." (§4.1)

The failure mode is not that single-metric evaluation is wrong about what it measures. It's that what it doesn't measure is precisely what causes systems to fail in production. A toxicity-detection model that achieves 66.8% accuracy sounds acceptable until you discover it drops to 46.3% accuracy under fairness perturbations (§8.3). A question-answering model with 72.6% accuracy that drops to 38.9% under robustness perturbations (§1.2, Finding 4) would be catastrophic in a deployed system. Neither of these failure modes is visible from accuracy alone.

## The Seven Desiderata

HELM operationalizes seven categories of metrics, selected through a principled process: enumerate all desiderata studied across major AI/ML venues (ACL, NeurIPS, ICML, FAccT, WWW, KDD, etc.), then filter for those measurable given only black-box access to the model. The seven that survive this filter are:

**1. Accuracy** — the standard task-specific performance metric (exact match, F1, ROUGE, NDCG, etc.)

**2. Calibration and Uncertainty** — whether model confidence scores actually predict when the model is right. A well-calibrated model that predicts 1,000 examples as toxic with probability 0.7 should have approximately 700 of them actually be toxic. HELM measures Expected Calibration Error (ECE) and selective classification accuracy (the accuracy on the C% of examples the model is most confident about). Critically: "if a model is uncertain in its prediction, a system designer could intervene by having a human perform the task instead to avoid a potential error." (§4.4)

**3. Robustness** — worst-case performance over semantic-preserving perturbations (typos, capitalizations, synonym substitutions, contractions). The finding: robustness and accuracy are strongly correlated on average, but individual models show striking exceptions. TNLG v2 (530B) drops from 72.6% to 38.9% on NarrativeQA under robustness perturbations despite being the third-most accurate model (§1.2).

**4. Fairness** — performance disparities across demographic groups, measured both via counterfactual perturbations (substituting gender/race/dialect markers) and via direct comparison on demographically-stratified subsets. Key finding: on CivilComments, OPT (175B) drops from 51.3% standard accuracy to 8.8% robust accuracy on the Black English split, versus only 50.8% to 24.3% on the White English split — a differential fragility by a factor of 6 (§8.3).

**5. Bias and Stereotypes** — systematic asymmetry in model generations, measured as deviation from uniform demographic representation and uniform stereotypical associations. Critically distinguished from fairness: "Fairness refers to disparities in the task-specific accuracy of models across social groups. In contrast, bias refers to properties of model generations." (§4.7)

**6. Toxicity** — fraction of model generations classified as toxic by PerspectiveAPI. The finding: toxicity rates are low on average for realistic use cases, but spike dramatically for toxic prompts. Multiple models generate toxicity in over 10% of generations when given toxic prompts in RealToxicityPrompts (§8.4).

**7. Efficiency** — both training efficiency (energy in kWh, CO2 emissions) and inference efficiency (denoised runtime accounting for API noise, idealized runtime on standardized hardware).

## The Score Matrix Architecture

Prior benchmarks produced either a scalar score (ImageNet accuracy) or a score vector (GLUE accuracies on multiple datasets). HELM produces a **score matrix**: for each model, a matrix of (scenario × metric) values. This is more complex, but the complexity is necessary — it correctly reflects that no total ordering over models exists. "While it is possible for model A to be strictly better on every metric for every scenario than model B (i.e. strict Pareto dominance), in almost all cases A is sometimes better and B is sometimes better when one is sufficiently holistic." (§11.3)

The practical implication: you cannot ask "which model is best?" without also asking "best for what purpose, for what user population, under what constraints?" The score matrix makes these contextual judgments explicit rather than hiding them in a single-number aggregate.

## Empirical Inter-Metric Relationships

The most important empirical finding is that metric relationships are **scenario-dependent**, not universal. The same pair of metrics can be positively correlated in one scenario and negatively correlated in another:

- **Accuracy vs. Robustness**: Strong positive correlation across scenarios. More accurate models tend to be more robust. But exceptions exist: Cohere xlarge on HellaSwag drops 15+ points under fairness perturbations despite being third-most accurate overall.
- **Accuracy vs. Calibration**: Scenario-dependent. For HellaSwag: accuracy and calibration error are *positively* correlated (more accurate → less calibrated). For OpenBookQA: correlation exceeds 0.8 in the opposite direction (more accurate → better calibrated). This heterogeneity is critical — "the relationship between accuracy and calibration can be quite different for very similar scenarios." (§8.1)
- **Accuracy vs. Fairness**: Strongly correlated, but with important exceptions where the most accurate model is not the most fair.
- **Fairness vs. Bias**: Surprising anti-correlation. "Models that tend to have better fairness performance...tend to have worse gender bias." (§8.1) Efforts to reduce one harm may increase the other.
- **Accuracy vs. Efficiency**: Weak correlation overall. No strong accuracy-efficiency tradeoff across model families, only within families.
- **Toxicity vs. Accuracy/Fairness**: Near-zero correlation. Toxicity rates are largely invariant across models and scenarios for realistic use cases, making toxicity orthogonal to other performance dimensions.

## Dense Multi-Metric Coverage as a Design Principle

HELM achieves 87.5% coverage of the (scenario, metric) matrix — 98 of 112 possible pairs. The 14% that are missing are missing for principled reasons (e.g., calibration requires probability outputs which some generation scenarios don't produce; fairness/robustness perturbations for long-form summarization raise validity concerns). The point is that gaps in measurement should be *acknowledged and justified*, not accidentally left blank.

The design principle: **every use case should be measured across all applicable desiderata simultaneously**, not sequenced into separate benchmark papers. "We believe it is integral that all of these metrics be evaluated in the same contexts where we expect to deploy models." (§1.1) When toxicity and accuracy are measured in separate benchmarks for separate datasets, their relationship is invisible. When they're measured together on the same scenarios, their relationship (or lack of it) becomes legible.

## Application to Agent System Design

For WinDAGs and multi-agent orchestration systems, the multi-metric framework teaches several things:

**Skill routing should be metric-aware.** When an orchestrator routes a task to a specific agent/skill, it should know which desiderata that agent has been characterized on. An agent that is highly accurate but poorly calibrated is appropriate for tasks where the output is consumed directly by a human. It is inappropriate for tasks where the output feeds downstream decision logic that depends on probability scores.

**Pipeline evaluation must propagate metric concerns.** If a summarization skill has low faithfulness scores, any downstream skill that uses that summary as context inherits that uncertainty. A multi-metric characterization of each skill enables propagating uncertainty and risk estimates through pipelines.

**Pareto-aware selection.** When multiple skills are available for a task, the selection should be Pareto-aware: which skill is not strictly dominated by another on the metrics that matter for this specific use case? The answer depends on the deployment context — mobile (efficiency priority), high-stakes medical (calibration priority), content moderation (fairness/bias priority).

**Monitoring requires multi-metric telemetry.** A system that monitors only accuracy in production will miss degradation in robustness, calibration drift under distribution shift, and emerging disparate impacts on subpopulations. Production monitoring should instrument the full metric vector.

## When This Framework Does NOT Apply

- When you genuinely have a single, unambiguous objective and a single user population. In those cases, multi-metric complexity adds noise.
- When metrics cannot be measured automatically at scale (e.g., subjective quality of creative writing). HELM focuses on automatable metrics; many important desiderata require human judgment.
- When the system is not yet deployed and you're doing early capability exploration. Multi-metric evaluation is most valuable at deployment decision points, not during research exploration.
- When adversarial robustness (not perturbation robustness) is the concern. HELM measures natural perturbations; adversarial attacks require fundamentally different measurement approaches.