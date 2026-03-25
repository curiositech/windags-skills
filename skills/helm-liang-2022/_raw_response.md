## BOOK IDENTITY
**Title**: Holistic Evaluation of Language Models (HELM)
**Author**: Percy Liang, Rishi Bommasani, Tony Lee, et al. (Stanford CRFM)
**Core Question**: What does it actually mean to evaluate an AI system *holistically*, and what happens when you try to do it rigorously across 30 models, 42 scenarios, 7 metric categories, and nearly 5 billion tokens of queries?
**Irreplaceable Contribution**: HELM is the first systematic attempt to treat language model evaluation as a *multi-dimensional measurement science* rather than a single-number leaderboard sport. It reveals that the intuitions researchers use to compare models — "Model A is better than Model B" — are almost always underdetermined, context-dependent, and metric-dependent. No other work simultaneously taxonomizes the full design space of evaluation, exposes what's missing, and actually executes the evaluation at scale. It teaches that benchmarks are not neutral instruments — they *encode values*, create incentives, and shape what gets built. And it demonstrates concretely that the gap between "knowing a model's accuracy" and "understanding what the model will do in deployment" is vast.

## KEY IDEAS

1. **Holistic evaluation requires a taxonomy before a benchmark.** You cannot evaluate comprehensively without first stating what you're trying to evaluate. HELM's two-stage architecture — (1) explicit taxonomy of all possible scenarios and metrics, (2) deliberate subset selection with acknowledged gaps — is what separates it from all predecessor benchmarks. The taxonomy makes incompleteness *visible*. You can point to what's missing. This is epistemically prior to any measurement.

2. **Single-metric optimization is a category error for complex systems.** Accuracy, robustness, fairness, calibration, bias, toxicity, and efficiency are all simultaneously relevant desiderata. HELM finds that these metrics are sometimes correlated (accuracy-robustness), sometimes anti-correlated (accuracy-calibration for HellaSwag), and sometimes orthogonal (accuracy-toxicity). There is no model that dominates on all metrics. Any system that optimizes for one is implicitly trading off others, usually invisibly.

3. **Adaptation procedure is as important as model architecture.** The same model can swing from 30% to 80% accuracy on the same task depending solely on how the prompt is formatted. Multiple-choice adaptation method, number of in-context examples, prompt phrasing, stop sequences — these are not implementation details, they are first-class variables that define what you're actually measuring. A model comparison is only valid if adaptation is controlled for.

4. **Scale predicts within a family but fails across families.** Scaling laws hold within model families (more parameters → better accuracy) but break down when comparing across families. A 52B instruction-tuned model outperforms a 530B base model. Perplexity on The Pile does not predict downstream accuracy. The key confound is *training procedure* (instruction tuning, RLHF), not just parameter count. This means capability prediction across disparate systems is fundamentally harder than scaling law papers suggest.

5. **What you can measure is constrained by what you can access.** HELM evaluates models as black-box text-in/text-out interfaces. This is not a methodological choice — it's a reflection of reality. Most powerful models are only accessible via API. This constraint shapes everything: which metrics are computable, what contamination claims can be verified, which models can be compared. The sociology of model access determines the epistemology of model evaluation.

## REFERENCE DOCUMENTS

### FILE: helm-multi-metric-evaluation-framework.md
```markdown
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
```

### FILE: helm-taxonomy-first-design.md
```markdown
# Taxonomy Before Benchmark: The Epistemology of Evaluation Design

## The Anti-Pattern That HELM Diagnoses

The dominant paradigm in AI evaluation before HELM: find existing datasets, combine them into a benchmark, measure models on the combination. The problem with this bottom-up approach is articulated precisely: "Benchmarks across AI, including those for language models like SuperGLUE, the EleutherAI LM Harness, and BIG-bench, are defined by specific choices of scenarios and metrics. Different benchmarks make different decisions on what to prioritize, how to make these decisions, and to what extent these processes are made clear." (§1.1)

When the decision process is invisible, you cannot know what the benchmark represents, what it's missing, or whether the coverage is principled. Prior to HELM, "models on average were evaluated on just 17.9% of the core HELM scenarios, with some prominent models not sharing a single scenario in common." (§1.1) This is not a measurement problem — it's a design problem. The field lacked a shared vocabulary for what "complete" evaluation would look like.

## The Two-Level Architecture

HELM's solution is explicit two-level architecture:

**Level 1: Abstract Taxonomy** — A structured enumeration of the entire design space. For scenarios: tasks × domains × languages. For metrics: the union of all desiderata studied across major AI venues (Table 2), then filtered by measurability requirements (Table 3). This taxonomy is the *aspiration* — it defines what holistic evaluation would look like if resources were unlimited.

**Level 2: Concrete Implementation** — A deliberate subset selected from the taxonomy, with explicit principles governing selection (coverage, minimality, user-facing priority) and explicit acknowledgment of what's missing (§10). This implementation is the *actual benchmark* — it's what you can run today.

The gap between Level 1 and Level 2 is the *recognized incompleteness*: "our benchmark foregrounds the limitations of our current benchmark by design: our benchmark is a subset of a pre-specified taxonomy. That is, the difference between what is in the taxonomy and what is in the benchmark identifies what we currently miss." (§10)

This is genuinely novel. Most benchmarks don't have a Level 1. They are their Level 2.

## Scenario Decomposition: The Three-Dimensional Structure

A scenario in HELM is a *triple*: (task, domain, language). This decomposition is non-trivial — each axis independently contributes variation in model behavior:

**Task**: What we want the system to do. HELM uses the ACL 2022 track taxonomy as a starting enumeration (Table 1), then filters for user-facing tasks: question answering, information retrieval, summarization, sentiment analysis, toxicity detection, miscellaneous text classification. The filtering principle is explicit: "user-facing tasks will confer much of the direct social impact of language models." (§3.2) Non-user-facing tasks (parsing, NLI) are deprioritized not because they're unimportant but because the benchmark's purpose is evaluating societal impact.

**Domain**: The "3 W's" — What (genre: Wikipedia, news, social media, scientific), Who (demographic speaker: Black/White, men/women, children/elderly), When (time period: pre-Internet, 2018, present). The domain decomposition is crucial because a model that performs well on Wikipedia data may degrade on social media, on African American English, or on text from before its training cutoff. "A dataset has a single domain corresponding to properties of its inputs, though it would be more precise to consider domains associated with all aspects of the input and output." (§3.1)

**Language/Language Variety**: HELM focuses on English but within English explicitly covers varieties — Standard American English, African American English, and international Englishes via ICE (India, Hong Kong, Kenya/Tanzania, etc.). The rationale: language technologies that degrade for non-dominant language varieties cause harm by "reinforcing a stigmatization" of those varieties and "historically and continue to deny social opportunity to the speakers of that language." (§5.1.1)

## The Desiderata Taxonomy

For metrics, HELM starts with a union of all desiderata appearing across major venues' calls for papers (Table 2). The full list is extensive: accuracy, bias, causality, creativity, credibility/provenance, emotional intelligence, environmental impact, explainability, fairness, inference efficiency, interpretability, legality, linguistic plausibility, maintainability, memory efficiency, morality, oversight, participatory design, privacy, reliability, robustness, sample efficiency, security, theoretical guarantees, toxicity, training efficiency, transparency, trustworthiness, uncertainty/calibration, user experience.

These are then filtered based on measurement requirements (Table 3):

- **Requires knowledge of training**: causality, environmental impact, linguistic plausibility, memory efficiency, training efficiency, theoretical guarantees → excluded or partially included
- **Requires specific model structure**: credibility/provenance, explainability → excluded (we treat models as black boxes)
- **Requires more than blackbox access**: interpretability → excluded
- **Requires knowledge of broader system context**: maintainability, reliability, security, transparency → excluded
- **Requires knowledge of broader social context**: accessibility, accountability, creativity, legality, morality, oversight, trustworthiness → excluded

What remains: accuracy, bias, fairness, inference efficiency, robustness, toxicity, uncertainty/calibration. The selection is principled, not arbitrary.

## The Recognition of Incompleteness as a Feature, Not a Bug

The most intellectually honest aspect of HELM is its §10 ("What is Missing"), which explicitly catalogs the gaps:

**Missing scenarios**: clinical notes, financial documents, education data, customer service domains; text from non-dominant time periods; non-US demographic groups; languages beyond English; interactive tasks like dialogue; entirely new tasks enabled by LM capabilities (copywriting, creative generation).

**Missing metrics**: user experience (as models become interfaces), linguistic plausibility (comparisons to human language behavior), credibility/provenance (critical as LMs are used in knowledge-intensive settings), adversarial robustness, privacy risk from memorization.

**Missing models**: proprietary models (PaLM, Gopher, Chinchilla, LaMDA) that couldn't be accessed; recently released models; entirely undisclosed models that may nonetheless be having social impact.

**Missing adaptation**: chain-of-thought prompting, parameter-efficient fine-tuning, retrieval-augmented generation — all of which may produce qualitatively different results.

This honest cataloging is itself methodologically important. It means consumers of the benchmark can calibrate their confidence: "I know HELM didn't measure this; I should not use HELM results to make claims about this."

## Application to Agent System Design

**Design the skill taxonomy before the skill library.** For a system with 180+ skills, the skills represent the Level 2 implementation. What's the Level 1 taxonomy? What are all the tasks agents should be able to do? What domains do they operate in? What desiderata should each skill be characterized on? Without the taxonomy, the skill library is a collection of bottom-up patches rather than a designed system.

**Track what's missing.** Every agent system has capabilities it hasn't yet characterized. The taxonomy framework makes this concrete: you can say "we haven't evaluated skill X on users who speak non-standard English" or "we haven't measured robustness for skill Y under input formatting variation." This is far more tractable than trying to enumerate every possible failure mode.

**Decompose scenarios into (task, domain, desiderata) triples.** When specifying what a skill should do, be explicit about all three dimensions. A "summarization skill" is underdetermined — it should be specified as (summarization, [legal documents, news, scientific papers], [accuracy/faithfulness, efficiency]) to be operationally meaningful.

**Use taxonomic coverage to drive testing priorities.** When testing an agent pipeline, use the taxonomy to identify which (task, domain) combinations are least tested. Random testing will over-represent common cases. Structured taxonomic testing surfaces rare but important coverage gaps.

**Acknowledge incompleteness to users.** Systems that present capability claims without acknowledging their scope of validity are misleading. A benchmark that scores highly on all tested scenarios and metrics should still communicate: "This evaluation does not cover [X, Y, Z]."

## The Deeper Epistemological Point

HELM's taxonomy-first design reflects a deeper epistemological position: **you cannot evaluate what you cannot name**. The history of NLP benchmarks is partly a history of measuring what was easy to measure, then assuming that what was easy to measure was what mattered. The taxonomy exercise forces the question: what should matter, given the deployment context and the values at stake? The answer is not determined by what datasets happen to exist.

This is why HELM describes benchmarks as encoding "values and priorities" that "orient the AI community." (§1) A benchmark is not a neutral instrument. It is a policy — it determines what gets optimized, and therefore what gets built.
```

### FILE: helm-adaptation-sensitivity-problem.md
```markdown
# The Adaptation Sensitivity Problem: When How You Ask Determines What You Measure

## The Fundamental Issue

HELM surfaces one of the most practically important and least discussed problems in AI evaluation: **the same model on the same task can exhibit wildly different performance depending solely on the adaptation procedure**. This is not noise. It is not implementation error. It is a fundamental property of how language models work as interfaces, and it has deep implications for what model evaluation actually means.

The most dramatic example: "accuracy for OPT (175B) on HellaSwag is 79.1% when each answer choice is presented in a separate 0-shot prompt (i.e. one of the most accurate models), but drops precipitously to 30.2% (almost random accuracy) when the answer choices are presented jointly in a single 5-shot prompt." (§1.2, Finding 23) The model hasn't changed. The task hasn't changed. Only the prompt structure changed. The difference is 49 percentage points.

This is not a pathological edge case. It is a general phenomenon. "All models show significant sensitivity to the formatting of prompt, the particular choice of in-context examples, and the number of in-context examples across all scenarios and for all metrics." (§1.2, Finding 22)

## The Three Sources of Adaptation Sensitivity

### 1. Multiple Choice Adaptation Method

For tasks with discrete answer choices, there are at least three distinct adaptation strategies:

**Separate approach**: Present each answer choice as a standalone completion, score each independently, take the argmax. This creates one query per choice.

**Joint approach**: Present all choices together in a formatted prompt, ask the model to select the correct option (e.g., "Answer: A/B/C"). This creates one query per question.

**Separate-calibrated approach**: Like separate, but calibrate each choice's probability by the probability of the choice presented alone (removing the tendency of models to favor certain token sequences regardless of context).

The finding: which approach maximizes accuracy is **scenario-dependent and model-dependent**. For HellaSwag, separate > separate-calibrated > joint for all tested models — up to 49 percentage points difference. But for OpenBookQA, separate-calibrated generally outperforms, *except* for Anthropic-LM which strongly prefers joint:

"If OPT (175B) and Anthropic-LM v4-s3 (52B) were compared using the separate-calibrated adaptation method, they would achieve near-equal accuracies (within 3%), but they are almost 40% apart when using the joint method." (§8.2)

This creates a legitimacy crisis for standardization: the adaptation method that is "fair" to one model is "unfair" to another. There is no neutral choice.

### 2. In-Context Example Selection

HELM finds that accuracy can vary from 37.6% to 63.6% for davinci on NaturalQuestions (open-book) across three different random seeds for in-context example selection — while holding everything else constant (§8.2). The median range across models is below 0.03, but some models/scenarios show dramatically higher variance.

Critically, HELM uses fixed in-context examples (the same examples for all test instances), rather than the more common approach of selecting different examples per test instance. This better reflects real deployment conditions but amplifies the variance visible across seeds. "This exacerbates the variation observed for different choices of in-context examples, consistent with the high variability one might witness in practice if they truly only have a few examples." (§8.2)

The practical implication: a model evaluated with one set of in-context examples may appear substantially stronger or weaker than the same model evaluated with different examples. Published results that don't report variance across seeds are presenting a single sample from a high-variance distribution.

### 3. Prompt Formatting

Beyond the in-context examples and the adaptation strategy, prompt formatting — instructions, input prefixes, output prefixes — creates additional variance. HELM finds that format variants can cause an accuracy of 67.3% for Anthropic-LM on NaturalQuestions with one format, while the same format causes BLOOM to drop from ~60% to 8.5%. (§8.2)

This is a model interoperability problem: "current models differ in what prompting decisions would maximize accuracy." (§1.2) Models have implicitly learned different conventions for what constitutes a well-formed query, and these conventions are not disclosed.

## The Adaptation Strategy Is a First-Class Variable

The implication of all this sensitivity is that the adaptation procedure is not an implementation detail — it is a *first-class experimental variable* that must be explicitly controlled, reported, and justified. HELM's response is to standardize on a specific adaptation strategy (5-shot prompting with consistent in-context example selection) and treat this as a modeling choice: "we opted to choose relatively simple, generic prompts in order to orient the development of language models towards generic language interfaces that respond robustly to direct natural language, rather than requiring model-specific incantations." (§1.1)

This is a normative choice, not just a practical one. The argument is that a good language model should work well with naturalistic prompts. A model that only performs well with carefully engineered model-specific prompts is, in an important sense, not truly general-purpose. The benchmark is designed to measure generality, not maximum performance under optimal prompting.

The limitation is acknowledged: "stronger results could be obtained from more sophisticated prompting (e.g. chain-of-thoughts), prompt decomposition, and prompt-tuning, potentially leading to qualitatively different findings." (§1.1) So the results are not "the true capability ceiling" but rather "capability under reasonable naturalistic prompting."

## Number of In-Context Examples

HELM systematically varies the number of in-context examples across {0, 1, 2, 4, 8, 16}. Findings:

- **0 → 1**: Universal improvement. Some models achieve 0% accuracy at zero-shot but non-trivial accuracy with one example.
- **Exception**: CNN/DailyMail summarization is *better* with 0 shots. Hypothesis: "models may not effectively understand the appropriate length distribution and the poor reference summaries may comparatively mislead the model." (§8.2)
- **1 → 16**: Inconsistent. Some models (especially OPT) show monotonically increasing performance. Others plateau or degrade.

This tells us that in-context examples are not just "more data" — they are a form of task specification. Getting the specification right matters as much as having more of it.

## Application to Agent System Design

**The interface contract problem.** When an orchestrator invokes a skill (language model endpoint), the invocation includes a prompt. The prompt is adaptation. If the orchestrator constructs prompts using different conventions than the ones the model was characterized under, the performance measurements are not predictive of actual behavior. Skills should be characterized under the same prompting conventions used in production.

**Adaptation as a skill capability.** Rather than treating all models as uniformly usable via the same interface, orchestration systems should maintain per-model adaptation profiles: which multiple-choice format works best, how many in-context examples are optimal, whether the model prefers instructions or examples. This is operationally more complex but produces more reliable behavior.

**Prompt sensitivity monitoring.** In production, small prompt changes (different system message wording, different number of examples available, different formatting of retrieved context) can cause large performance swings. Monitoring should track not just output quality but prompt variants, to detect when prompt drift is causing performance degradation.

**Calibration for downstream decisions.** When a model's probability outputs are used for downstream decisions (routing, confidence thresholding), the calibration of those probabilities depends heavily on adaptation strategy. A model that is well-calibrated under one prompting regime may be poorly calibrated under another. Calibration evaluation should be done under the specific prompting used in production.

**The "same model, different results" problem in multi-agent systems.** In a system where multiple agents call the same underlying model, but with different prompting conventions (e.g., different instruction formats for different task types), the model is effectively behaving as multiple different systems. This can create inconsistencies that are hard to diagnose. Standardizing prompting conventions across agents using the same model reduces this variance.

## The Deeper Lesson

The adaptation sensitivity problem reveals something fundamental about language models as systems: they don't have fixed capabilities. They have *contextually-elicited* capabilities. The capabilities visible in any evaluation are the capabilities elicited by that evaluation's prompting procedure. This is qualitatively different from how we think about traditional software components, which have defined, context-independent APIs.

For agent system designers, this means: **the interface is not just the model, it's the model + the prompting convention**. Treating models as black-box components with fixed capability profiles will produce systems that are brittler than expected, with performance that degrades in ways that appear mysterious until you understand that the prompting convention has drifted.
```

### FILE: helm-scale-vs-training-procedure-tradeoff.md
```markdown
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
```

### FILE: helm-failure-modes-evaluation-collapse.md
```markdown
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
```

### FILE: helm-standardization-comparability.md
```markdown
# The Comparability Crisis: Why AI Evaluation Needs Standardization

## The Problem of Incomparable Evaluations

HELM opens with a diagnostic that should disturb anyone building systems on top of AI capabilities: "Prior to our effort, models on average were evaluated on just 17.9% of the core HELM scenarios, with some prominent models not sharing a single scenario in common." (§1.1)

This is not a minor gap in coverage. It means that before HELM, there was essentially *no basis* for direct comparison between many of the world's most prominent and impactful language models. You could not answer "Is Anthropic-LM better than T5?" because they hadn't been evaluated on the same things, under the same conditions. You could only answer "Anthropic-LM is better at X and T5 is better at Y" — where X and Y were chosen by the respective authors of each model's paper.

The standardization problem has three components:

### 1. Different Scenario Coverage
Different model papers evaluate on different datasets. If Model A is evaluated on NaturalQuestions and Model B is not, comparing their question-answering capabilities is impossible without additional evaluation. HELM found that before its effort, "several of our 16 core scenarios had no models evaluated on them, and only a few scenarios (e.g. BoolQ, HellaSwag) had a considerable number of models evaluated on them." (Figure 4)

### 2. Different Adaptation Conditions
Even when models are evaluated on the same dataset, the adaptation conditions vary. "On HellaSwag, some prior work reports fine-tuned accuracies (e.g. T5), whereas others report prompting accuracies (e.g. davinci). Even when works report results through few-shot prompting, the exact details can vary." (§1.1) Fine-tuned T5 vs. few-shot davinci is not an apples-to-apples comparison; it conflates model capability with adaptation procedure.

### 3. Different Metrics
Even when models are evaluated on the same dataset under the same adaptation conditions, they may be evaluated on different metrics. F1 vs. exact match, ROUGE-1 vs. ROUGE-2 vs. BERTScore — these are not interchangeable, and switching metrics changes which model "wins."

## HELM's Standardization Response

HELM's standardization strategy has four components:

**Same scenarios**: All 30 models are evaluated on all 16 core scenarios. (With 4% exceptions due to technical issues, explicitly documented.)

**Same metrics**: All 7 metric categories are applied to all 16 core scenarios where applicable. The cases where a metric doesn't apply (e.g., calibration for generation scenarios without probability outputs) are explicit in Table 4.

**Same adaptation**: All models use 5-shot prompting with the same prompts. "We consistently work towards standardizing these dimensions (e.g. to ensure models are interoperable/performant using the same prompting practices)." (§1.2, Finding 22)

**Same conditions**: Evaluations run at the same time, with the same infrastructure, under the same random seed conditions (3 seeds to estimate variance).

The result: "We improve this to 96.0%: now all 30 models have been densely benchmarked on a set of core scenarios and metrics under standardized conditions." (§1.1) This is a genuine transformation of the evaluation landscape.

## What Standardization Reveals

Standardized evaluation reveals findings that would be invisible without it:

**The instruction-tuning gap**: The superiority of text-davinci-002 and Anthropic-LM is only visible when compared against a common baseline. Without standardization, each paper would cherry-pick its best comparisons.

**The access gap**: "We observe a consistent gap on all core scenarios between the current open models and non-open models." (§1.2, Finding 2) This gap is only quantifiable under standardized conditions. Without HELM, the comparison between open and closed models was anecdotal.

**State-of-the-art discoveries**: "We find text-davinci-002 achieves an accuracy of 74.4% ROUGE-L on NarrativeQA, which sets a new state-of-the-art across all methods to our knowledge." (§1.2, Finding 21) This SOTA was set not by any researcher optimizing for NarrativeQA, but by running standardized evaluation that happened to test text-davinci-002 on this benchmark for the first time.

**YaLM's anomaly**: "YaLM (100B) has a surprisingly poor accuracy win rate below 25%, perhaps because of significant training on Russian instead of English." (§8.1) This would not be apparent without comparing it to other 100B+ models under standardized conditions.

## The Fairness Paradox of Standardization

HELM explicitly acknowledges a deep tension: "while we standardize model evaluation, in particular by evaluating all models for the same scenarios, same metrics, and with the same prompts for 5-shot prompting, models themselves may be more suitable for particular scenarios, particular metrics, and particular prompts/adaptation methods." (§1.1)

In other words: standardization is both necessary for comparability and unfair to individual models. T0++ is designed for zero-shot prompting; evaluating it five-shot penalizes it relative to its designed use case. T5 was not designed for in-context learning at all. Evaluating models optimized for different paradigms under a common paradigm disadvantages some.

The resolution HELM proposes but doesn't fully implement: "we recommend model developers explicitly declare how their models should be evaluated and what the scope is of their generality/when models should be preferred." (§6) This is the right direction — explicit scope declarations that allow standardized comparisons within the declared scope. But the field hasn't widely adopted this.

## The Access Problem as an Epistemological Constraint

A thread running through HELM is the model access problem. Models exist on a spectrum: open (weights publicly available), limited-access (API only), closed (available only to the provider). This access structure shapes what evaluation is possible:

- Open models: can evaluate under fully standardized conditions, can inspect training data (somewhat), can run on controlled hardware.
- Limited-access models: must use the provider's API, which may change versions, have rate limits, and may not expose probability calibration.
- Closed models: require cooperation from the model provider; TNLG v2 (530B) and Anthropic-LM v4-s3 (52B) required Microsoft and Anthropic to provide access for this specific effort.

"Unfortunately, we did not evaluate models that we could not access (e.g. Google's PaLM and LaMDA, DeepMind's Gopher and RETRO)." (§6) The most capable models at the time of HELM's writing (PaLM, Chinchilla) were simply unavailable for independent evaluation.

This creates a systematic bias: the models that can be evaluated most thoroughly are the open models; the models with the most resources behind them are often the least evaluable. The models posing the highest potential for both benefit and harm are the least transparent.

## Application to Agent System Design

**Skill benchmarking under production conditions.** When characterizing skills for a WinDAGs system, standardize the evaluation conditions: same prompt templates, same inference configuration, same hardware. Comparisons between skills only mean something if the conditions are controlled.

**Document evaluation conditions with skill metadata.** For each skill, record: what scenarios it was evaluated on, what adaptation procedure was used, what metrics were computed, what versions of the model and API were used, and when the evaluation was conducted. This enables future comparability as models and APIs evolve.

**Version control for model behavior.** "For both the private models and commercial APIs, we are evaluating live systems that may be regularly updated in some cases." (§6) Commercial APIs change without notice. Skills that were characterized under one model version may behave differently under a later version. Implement model versioning and behavioral drift detection.

**Standardize evaluation infrastructure before the skill library gets large.** It becomes progressively harder to enforce evaluation standards as the number of skills grows. Establish evaluation protocols early, including automated testing pipelines that run standardized evaluations against each skill on each version change.

**Acknowledge incomparability when it exists.** If two skills were evaluated under different conditions (different prompts, different models, different scenarios), their comparison is not apples-to-apples. Be explicit about this in documentation, and do not let implicit comparisons drive routing decisions.

**Develop a shared scenario vocabulary.** For orchestration, define canonical scenarios (the equivalent of HELM's core scenarios) that all skills are characterized on. Skills that haven't been evaluated on a canonical scenario cannot be reliably used for tasks in that scenario's domain.
```

### FILE: helm-calibration-uncertainty-quantification.md
```markdown
# Calibration and Uncertainty Quantification: Why Confidence Matters as Much as Accuracy

## The Deployment Reality

When a language model generates text, it does not merely produce an output — it produces an output *along with implicit probability information* about that output. In most deployments, this probability information is either discarded entirely or used naively. HELM makes the case that this is a serious mistake: "When machine learning models are integrated into broader systems, it is critical for these models to be simultaneously accurate (i.e. frequently correct) and able to express their uncertainty (so that their errors can be appropriately anticipated and accommodated)." (§4.4)

The key insight: a model that knows when it doesn't know is qualitatively more useful than a model that is equally accurate but equally confident on both its correct and incorrect answers. Calibration is what makes a model's confidence signals trustworthy.

## What Calibration Means

A model is **calibrated** if its predicted probabilities match empirical frequencies. "A well-calibrated model predicts that 1,000 sentences are toxic each with probability 0.7, then we expect around 700 of them to be toxic." (§4.4)

The standard measure is **Expected Calibration Error (ECE)**: the weighted average, across probability bins, of the difference between predicted probability and actual accuracy within that bin. Low ECE → well-calibrated. High ECE → the model's confidence doesn't track its actual correctness.

**Selective classification** operationalizes calibration into a deployment mechanism: if a model abstains on the (1-C)% of examples it's least confident about, and only answers the C% it's most confident about, what accuracy does it achieve? A well-calibrated model should achieve higher accuracy on its most confident answers. HELM measures this at C=10% (accuracy on the 10% highest-confidence examples) and as area under the coverage-accuracy curve (SCAA).

## The Heterogeneous Calibration Findings

HELM's empirical calibration results are striking precisely because they are scenario-specific and non-obvious:

**The HellaSwag anomaly**: "For HellaSwag...accuracy and calibration error are highly correlated" — in the direction where more accurate models are *more* miscalibrated. The models that are best at the task have the worst-calibrated confidence. "Improving accuracy worsens calibration." (§1.2, Finding 3) 

This could occur if instruction-tuned models have been trained to express high confidence regardless of uncertainty, as part of responding helpfully. The model's response style (confident, direct) becomes calibrated away from its actual accuracy.

**The OpenBookQA pattern**: Here accuracy and calibration correlate positively — more accurate models are better calibrated. This may reflect that OpenBookQA tests scientific knowledge where models that genuinely understand the material express appropriate confidence, while models that don't understand guess randomly.

**The J1 models**: All three J-1 models (7.5B, 17B, 178B) have calibration errors of roughly 0.5 or more on multiple QA scenarios — meaning their confidence scores are essentially uninformative. A calibration error near 0.5 means the model's probability outputs are no better than random for predicting its own correctness.

**CivilComments**: "All models are poorly calibrated (e.g. ECE-10 of at least 0.40), with a clear anti-correlation between model accuracy and model calibration error." (§8.3) More accurate models are *less* calibrated on toxicity detection. The models that are best at the task have the least reliable confidence signals.

**Cohere xlarge**: "Cohere xlarge v20220609 (52.4B) has a calibration error of 0.06 on NarrativeQA" — well-calibrated despite not being the most accurate model for this scenario. This demonstrates that calibration and accuracy are genuinely separable properties.

## The Surprising Robustness-Fairness-Calibration Triangle

HELM reports a counterintuitive triple interaction: "while not unsurprising given the strong correlations between accuracy, robustness, and fairness, the finding that more robust and more fair models can be less well-calibrated is counter-intuitive and surprising." (§8.1)

Models that generalize well to perturbed inputs (robust) and maintain performance across demographic groups (fair) tend to be less well-calibrated. This is a genuine three-way tradeoff: you cannot jointly optimize all three without compromises. A system designed to be maximally fair and robust may produce poorly calibrated confidence signals, which could be problematic for downstream decisions.

## Why Calibration Matters for System Design

HELM explicitly connects calibration to practical system design applications:

**Human-in-the-loop intervention**: "if a model is uncertain in its prediction, a system designer could intervene by having a human perform the task instead to avoid a potential error (i.e. selective classification)." (§4.4) This is only possible if the model's confidence actually tracks its correctness.

**Aggregating multiple prompts**: "using model confidences/uncertainties to inform how to aggregate different prompts." (§4.4) If you run multiple prompt variants and want to take the most reliable output, you need calibrated confidence to know which output to trust.

**Prompt chain assembly**: "assemble prompt chains." (§4.4) In a multi-step reasoning chain, if intermediate steps produce poorly calibrated confidence, the chain cannot recover from uncertain outputs.

**Trust in deployed systems**: "since language models increasingly embed into myriad applications, calibration and reliable estimates of model uncertainty can build trust in their integration." (§4.4)

## Calibration for the Information Retrieval Case

HELM notes that information retrieval requires especially strong calibration: "these scenarios necessitate a strong degree of calibration, in which the probabilities assigned to each of the 'Yes'/'No' outputs accurately reflects the continuous degree of relevance of a passage to a query." (§8.3)

The passage ranking task is scored by comparing relative probabilities across passages. If the model is poorly calibrated, the ranking will be poor even if the model "knows" which passages are relevant in some abstract sense. Calibration is load-bearing for the task architecture.

## Application to Agent System Design

**Confidence-gated routing.** In multi-agent systems, routing decisions can be made based on agent confidence. "This task seems hard for skill X (low confidence) → route to skill Y (specialist) or human review." This only works if skill X's confidence is calibrated. Systematically measure calibration for each skill before using it in confidence-gated routing.

**Selective execution.** For high-stakes tasks, implement selective execution: run the skill, check if confidence exceeds a threshold, and only commit the output if the threshold is met. Below the threshold, flag for human review or escalate to a more powerful model. The threshold is meaningful only if calibration is measured.

**Calibration recalibration.** If a skill produces well-ordered but miscalibrated confidence (the model is good at knowing which answers it's more/less sure about, but the raw probabilities are off), you can apply post-hoc calibration methods (Platt scaling, temperature scaling) to correct the magnitude without changing the ranking. HELM's finding that selective classification accuracy sometimes remains useful even when raw calibration is poor (§4.4) supports this approach.

**Don't use raw probabilities for downstream decisions without verification.** Probability outputs from language model APIs should never be used as literal probability estimates without first verifying calibration on a representative sample. The J1 models' ECE of ~0.5 means their probabilities are essentially uninformative as confidence signals.

**Scenario-specific calibration monitoring.** Calibration is not a fixed property of a model — it varies by scenario, domain, and adaptation procedure. A model calibrated well for question answering may be poorly calibrated for toxicity detection. Monitor calibration separately for each skill type in production.

**Calibration under distribution shift.** Models are typically calibrated on in-distribution data. When inputs deviate from the training distribution (which is the norm in production), calibration tends to degrade before accuracy does. Implement drift detection that includes calibration monitoring, not just accuracy monitoring.
```

### FILE: helm-fairness-bias-evaluation-methodology.md
```markdown
# Measuring Fairness and Bias in AI Systems: Methodology, Distinctions, and Findings

## The Critical Distinction: Fairness vs. Bias

HELM makes a careful distinction that is often conflated in public discourse: fairness and bias are different properties, measured differently, with different implications.

**Fairness** refers to *performance disparities* — differences in task-specific accuracy across demographic groups. A model is unfair if it answers questions correctly for one demographic group but incorrectly for another. Fairness is about whether the model works equally well for different people.

**Bias** refers to *distributional properties of model generations* — systematic asymmetry in how models talk about or refer to demographic groups, independent of task performance. A model is biased if it generates text that systematically over- or under-represents certain groups, or associates groups with certain stereotypes. Bias is about what the model says, not just whether it's right.

"Fairness refers to disparities in the task-specific accuracy of models across social groups. In contrast, bias refers to properties of model generations, i.e. there is no (explicit) relationship with the accuracy or the specifics of a given task." (§4.7)

These require different measurement approaches and have different remediation pathways. A model can be fair (equal accuracy across groups) while being biased (generating stereotyped content). A model can be unbiased in its generations while being unfair (performing worse for one group).

## HELM's Two-Track Fairness Measurement

### Counterfactual Fairness

HELM measures counterfactual fairness by applying systematic perturbations to test instances and measuring whether the model's performance degrades more for some demographic conditions than others:

**Dialect perturbations**: Convert Standard American English (SAE) to African American English (AAE) using lexical substitutions from Ziems et al. (2022). If a model answers correctly for SAE but incorrectly for the AAE version of the same question, that is counterfactual unfairness with respect to dialect.

**Gender perturbations**: Substitute male pronouns/terms with female equivalents (and vice versa). If question-answering performance drops when the subject of a question is described with female pronouns, that's gender-related unfairness.

**Race perturbations**: Substitute racially-associated names and terms. Performance disparities under name substitution indicate differential treatment of racial groups.

The key finding: "across all scenarios, we observe strong correlations between accuracy, robustness, and fairness, where robustness and fairness metrics consider worst-case accuracy over a set of perturbations." (§1.2, Finding 4) More accurate models tend to be more fair. But the correlation is not perfect — the most accurate model is not always the most fair.

### Performance Disparity Analysis

For scenarios with demographic metadata, HELM measures accuracy separately for each subgroup and compares: "We generally see consistent performance disparities for all models." (§1.2, Finding 5)

The TwitterAAE finding: "OPT (175B) is the most accurate model on TwitterAAE but its accuracy degrades from 1.506 bits per byte for White English to 2.114 bits per byte for African American English." (§1.2, Finding 5) This 40% degradation in language modeling performance for AAE vs. SAE, present in every model tested, represents a systematic capability gap that correlates with historical linguistic marginalization.

The CivilComments religion finding: "for religion we see almost all models are considerably more accurate and robust for comments mentioning Christians as compared to comments mentioning Muslims. For example, Anthropic-LM v4-s3 (52B) accuracy improves to 62.8% for the Christian split from 61.0% overall, whereas it declines to 54.7% for the Muslim split." (§8.3)

The CivilComments race/robustness finding: "OPT (175B) drops precipitously from a standard accuracy of 51.3% on the Black split to 8.8% in the presence of robustness perturbations, whereas the standard accuracy of 50.8% on the White split drops considerably less to 24.3%." (§8.3) This is a 6× differential in robustness degradation — the model's ability to handle natural variations in text is dramatically worse for content about Black individuals.

## The Two-Track Bias Measurement

HELM measures two types of bias in model generations:

### Demographic Representation Bias

Count how often different demographic groups are mentioned in model outputs, normalize to a probability distribution, and measure total variation distance from the uniform distribution (equal representation). Formula:

```
demographic_representation = TVD(P_observed, P_uniform)
```

Where P_observed is the empirical distribution of group mentions across model generations.

Zero bias means the model mentions all groups at equal rates. Positive bias means some groups are over-represented and others under-represented.

### Stereotypical Association Bias

For a specific concept (e.g., "mathematician"), measure whether model generations disproportionately associate it with one demographic group. The mathematician-male association measures how often, when "mathematician" appears in generated text, the text also contains male vs. female terms.

The surprising finding: "we see a clear and surprising trade-off: models that tend to have better fairness performance...tend to have worse gender bias." (§8.1) Models that are accurate and fair on tasks nonetheless generate biased content in ways that are not captured by fairness metrics. The two failure modes are partially independent.

## The BBQ Paradox

HELM's targeted bias evaluation using BBQ (Bias Benchmark for Question Answering) reveals one of its most counterintuitive findings: accuracy and bias are linked, but in the wrong direction.

"We see a very striking relationship on BBQ between model accuracy and model bias for ambiguous contexts. These three models [text-davinci-002, T0++, TNLG v2], which are the three most accurate, are the only three models with biases in ambiguous contexts that align with broader social biases/discrimination, whereas all other models show biases in the other direction." (§1.2, Finding 19)

The pattern: the most accurate models reflect and amplify real-world societal biases (e.g., age discrimination, gender stereotypes). Less accurate models show the reverse pattern — seemingly less biased but actually just differently calibrated to the bias direction.

This means: **improving accuracy toward human-level performance tends to increase alignment with human biases**. Models trained to be helpful and accurate learn to reflect the biases encoded in human-generated training data and preference labels. This is a fundamental tension that cannot be resolved by making models more capable without also explicitly addressing the bias dimension.

## Practical Measurement Limitations

HELM is explicit about the limitations of its bias and fairness measurements:

**Perturbation validity**: "appropriate estimation of when perturbations should be introduced remains a challenge for constructing synthetic data that is realistic." (§10.2) A gender pronoun swap doesn't capture the full sociolinguistic context of gender.

**Statistical fragility**: Count-based bias metrics "can be brittle in several ways in general." (§4.7) Small samples produce unreliable estimates. HELM uses word lists that may not be representative.

**Context-free measurement**: Toxicity measurement using PerspectiveAPI lacks context — a comment that is toxic in one context may be acceptable in another. HELM acknowledges it "fails to articulate a more precise (operationalized) definition of toxicity." (§4.8)

**PerspectiveAPI known flaws**: HELM uses PerspectiveAPI despite its documented limitations, preferring "the toxicity detection system with extensive testing and clear measurement of its limitations as opposed to other (potentially better but largely unproven) toxicity detection methods." (§4.8) This is a reasonable pragmatic choice but means toxicity measurements are bounded by the API's reliability.

## Application to Agent System Design

**Build demographic performance profiling into skill evaluation.** For skills that interact with text about or from diverse demographic groups, measure accuracy separately by demographic. Don't assume that overall accuracy reflects performance for all groups.

**Counterfactual testing as a standard evaluation step.** For each skill, apply systematic perturbations (dialect, gender, race, name substitutions) and measure whether performance degrades differentially. This can be automated as part of CI/CD for skill updates.

**Distinguish fairness failures from bias failures.** A skill that produces accurate outputs but stereotyped content is a different problem than a skill that produces different-quality outputs for different groups. The remediation differs: fairness failures may require different training data or fine-tuning, bias failures may require output filtering or decoding constraints.

**Monitor for robustness-fairness differential.** The finding that OPT's robustness drops 6× more for Black English than White English content is a specific failure mode: the model is fragile on content about/from marginalized groups. Production monitoring should track robustness metrics broken down by content demographics.

**The accuracy-bias tradeoff is real — be intentional about it.** The BBQ finding means that as you improve skill accuracy toward human-level performance, you may be importing human biases. This is not inevitable, but it requires deliberate bias auditing at high accuracy levels. The intuition that "more capable = less biased" is empirically false.

**Set context-specific fairness criteria.** The appropriate fairness standard for a job application screening tool is different from a search engine and different from a medical diagnosis assistant. Fairness is not a universal property — it's contextual. Define what fairness means for your specific deployment context before measuring it.
```

### FILE: helm-benchmark-as-social-artifact.md
```markdown
# Benchmarks as Social Artifacts: How Evaluation Shapes What Gets Built

## The Opening Claim

HELM opens with an explicit normative statement that situates evaluation as more than a technical exercise: "Benchmarks orient AI. They encode values and priorities that specify directions for the AI community to improve upon." (§1)

This is not a metaphor. It is a causal claim: the benchmarks that exist determine what gets optimized, what capabilities improve, what failure modes remain unaddressed, and what problems are defined as "solved." The benchmark is the policy.

The history of NLP illustrates this. SQuAD made reading comprehension important. ImageNet made image classification important. GLUE made natural language understanding important. Not because these were the most important problems — but because these benchmarks existed, were widely adopted, and therefore attracted research effort.

## The Benchmark-as-Values-Encoding

HELM's taxonomy effort forces an uncomfortable question into the open: whose values determine what gets measured? The list of desiderata in Table 2 — collected from ACL, NeurIPS, FAccT, SIGIR, and others — reflects the values of academic ML/NLP researchers at a specific historical moment. It does not reflect the values of:

- Non-English speaking populations (underrepresented in both the benchmark and the research community)
- Marginalized communities who bear the costs of AI failures (racial groups, LGBTQ individuals, non-dominant language speakers)
- Users in the Global South (not well-represented in the datasets)
- Future users (who will interact with models trained on benchmarks designed today)

"Benchmarks set the agenda and orient progress: we should aspire for holistic, pluralistic and democratic benchmarks." (§12)

The reflexivity statement at the end of HELM explicitly acknowledges that it was produced by Stanford — "a privileged, high-resourced, and powerful institution" — continuing "a trend...that many works that introduce (influential) benchmarks come from privileged...institutions." (§12 reflexivity section) This is not self-flagellation; it's an honest accounting of the power dynamics embedded in benchmark creation.

## Strathern's Law in AI Evaluation

The most important practical implication of the benchmark-as-policy view is Strathern's Law: "When a measure becomes a target, it ceases to be a good measure." (Strathern, 1997, cited in §11.2)

HELM's summarization findings demonstrate this concretely. CNN/DailyMail and XSUM are the dominant summarization benchmarks. Years of optimization against ROUGE scores on these datasets have produced models that are good at ROUGE on CNN/DailyMail and XSUM. But "automated evaluations on these datasets largely fail to discriminate differences we observed in model quality." (§1.2, Finding 10) The measure has been optimized; therefore it is no longer a good measure.

The mechanism: research teams find prompting strategies, fine-tuning approaches, or model architectures that improve ROUGE scores. These improvements may or may not reflect improvements in actual summary quality. As the benchmark gets "solved," it stops distinguishing good summaries from poor ones on dimensions that matter (length appropriateness, faithfulness to the source document, coverage of key information). The benchmark that was once signal becomes noise.

## What "Solved" Really Means

HELM's calibration findings reveal another dimension of the benchmark-as-policy problem. HellaSwag is a commonsense inference dataset. The most accurate models on HellaSwag have calibration errors exceeding 0.28. What does it mean that text-davinci-002 "solves" HellaSwag with 81.5% accuracy if its confidence in its answers is systematically miscalibrated?

It means the benchmark has been solved in one dimension (accuracy) while remaining unsolved in another dimension (calibration). The field's declaration that commonsense inference is "largely solved" based on accuracy metrics is potentially premature. The models are accurate but overconfident — which means they will fail unexpectedly in downstream applications that depend on confidence signals.

More broadly: every time a benchmark appears "solved" based on a single metric, it may be "unsolved" on every other metric. HELM's insistence on multi-metric evaluation is partly a response to this: a task is not done until you've characterized performance across all the desiderata that matter for deployment.

## The Model Access Power Dynamic

HELM frames model access as a governance issue, not just a technical one: "The absence of an evaluation standard compromises the community's ability to clearly and rigorously understand the overall landscape of language models." (§1.1)

The power dynamic: model providers decide which models to release, which to keep closed, and which to permit for evaluation. PaLM, LaMDA, Gopher, Chinchilla — the models with the most investment and potentially the most capability — were not evaluated in HELM. They were unavailable. This is not a neutral fact; it is a policy choice by the companies that own these models.

The implication: the public understanding of AI capabilities is systematically biased toward models that have been released openly or through limited-access APIs. The most powerful models exist in a zone of opacity. "We raise this as an important open question for the community: how do we ensure foundation models (including language models) are transparently benchmarked when we do not know they exist and no existing mechanism requires they be disclosed?" (§10.4)

This is a call for governance mechanisms — standards, regulations, or norms — that would require disclosure and evaluation of models having social impact. Without such mechanisms, the models with the most potential impact are the least characterized.

## The Living Benchmark Concept

HELM's aspiration is to be "a living benchmark for the community, continuously updated with new scenarios, metrics, and models." (Abstract)

This reflects a recognition that any benchmark is a snapshot of current capabilities and current concerns. As capabilities evolve, the benchmark's scenarios may become saturated (easy for all models) or irrelevant (no longer representative of deployment). As social concerns evolve, new metrics become important. As new models are released, new comparisons become possible.

The living benchmark concept is a response to the problem that static benchmarks become outdated:
- Scenarios that were hard become easy; the benchmark no longer discriminates.
- New deployment contexts (LLMs as coding assistants, medical consultants, educational tutors) create new scenarios that aren't represented.
- New harms emerge (disinformation capabilities, copyright infringement) that weren't anticipated.
- New equity concerns are identified by communities affected by AI systems.

A living benchmark requires infrastructure (a codebase that accepts new scenarios, a website that presents results, a community process for validation) and commitment (ongoing evaluation as new models are released).

## Application to Agent System Design

**Benchmark governance for the skill library.** The skills in a WinDAGs system face the same benchmark-as-policy dynamics. Whatever skills are benchmarked will be optimized; what isn't benchmarked will drift. A governance process for the skill benchmark — who decides what scenarios are evaluated, what metrics matter, when evaluations are updated — is as important as the technical evaluation infrastructure.

**Anticipate Strathern's Law.** As skills are optimized against internal benchmarks, the benchmarks will increasingly fail to discriminate good from bad performance. Plan for benchmark refresh cycles: regularly introduce new test cases, new scenarios, new metrics that measure dimensions the current benchmark has started to miss.

**Treat evaluation gaps as known risks.** Every skill has dimensions that aren't evaluated. Those dimensions are not "fine" — they are *unknown*. Document evaluation gaps explicitly (the §10 equivalent for the skill library). When a skill is deployed in a new context, check whether that context involves evaluation gaps.

**Design for multi-stakeholder input on metrics.** The users of a WinDAGs system may have different values than its developers. A skill that performs well on developer-defined accuracy metrics may fail on user-defined quality dimensions. Build feedback loops that allow users to report when skills fail in ways not captured by automated metrics.

**Distinguish solved from saturated.** When a benchmark shows ceiling effects (all skills performing >95%), the benchmark has been saturated — it no longer provides signal. Don't confuse benchmark saturation with the problem being solved. The space of relevant inputs is larger than any benchmark; saturation means you've exhausted the benchmark's ability to discriminate, not that all relevant inputs are handled well.

## The Deeper Contribution

HELM's most important contribution is not any specific empirical finding. It is the demonstration that **evaluation is a form of power**. Whoever controls the benchmark controls the definition of "better." Whoever gets to choose which metrics matter is choosing what values get optimized. A field that accepts benchmark scores uncritically is accepting those value choices without examination.

For AI agent system designers, this means: the metrics you use to evaluate your agents are not neutral. They encode assumptions about what matters. Making those assumptions explicit — through taxonomy-first design, multi-metric evaluation, acknowledgment of gaps, and living benchmark practices — is not just methodological rigor. It is epistemic responsibility.
```

---

## SKILL ENRICHMENT

- **Model Selection and Routing**: HELM's findings on what actually predicts model performance (training procedure > scale, calibration varies by scenario, code models beat text models on reasoning) provide actionable guidance for routing decisions. Skills that route tasks to different models should use HELM's capability taxonomy: factual retrieval → large base models; instruction following → instruction-tuned models; reasoning/math → code-trained models; confidence-gated routing → calibration-verified models.

- **Task Decomposition**: HELM's (task × domain × language) framework provides a vocabulary for decomposing complex agent tasks. Before decomposing a task, identify which of HELM's scenario dimensions varies in the decomposition — a task that requires different linguistic registers for different sub-tasks should be decomposed at the register boundary, not just the logical boundary.

- **System Evaluation and Benchmarking**: HELM's multi-metric framework (7 desiderata across all scenarios simultaneously) directly improves system evaluation. Any agent system evaluation that measures only accuracy is missing calibration, robustness, fairness, bias, toxicity, and efficiency. The taxonomy-first approach (state what you're trying to measure before designing the benchmark) prevents bottom-up evaluation that measures what's easy rather than what matters.

- **Failure Mode Analysis / Debugging**: HELM documents specific, reproducible failure patterns: prompt sensitivity causing 30-80% accuracy swings; robustness collapse under dialect perturbation; calibration inversion where more accurate models become less trustworthy. These are concrete failure mode templates that debugging workflows should explicitly test for in agent pipelines.

- **Code Review / Code Generation Quality**: HELM's finding that code-trained models outperform text-trained models on *all* reasoning tasks (including those posed in natural language) has direct implications for code generation skill selection. Additionally, HELM's evaluation of HumanEval and APPS provides a benchmark framework for characterizing code generation skills.

- **Security Auditing**: HELM's memorization/copyright analysis (models can be induced to reproduce large spans of copyrighted text given short prompts) is directly relevant to security and legal risk assessment for agent systems. The finding that accuracy correlates with regurgitation risk means higher-capability agents pose higher memorization/copyright risks.

- **Frontend Development / User Interface**: HELM's robustness findings (behavior degrades under typos, dialect variation, informal language) have direct implications for how user interfaces should be designed. If users will interact with agents through natural language, the input preprocessing pipeline should account for the natural perturbations that degrade model performance.

- **Architecture Design**: HELM's distinction between core scenarios (multi-metric evaluation of deployment use cases) and targeted evaluations (deep diagnostic analysis of specific capabilities) provides a template for architecting agent evaluation systems. Core scenario evaluation should run on every model version; targeted evaluations should be triggered by specific capability concerns or deployment contexts.

- **Fairness/Bias Auditing**: HELM's two-track measurement (performance disparities + generation biases) and its finding that accuracy-bias correlation goes in the wrong direction (more accurate → more socially biased for BBQ) provides a framework and a warning for any agent system that processes or generates content about people. The AAE/SAE performance gap is a specific, measurable failure mode that all agent systems processing social media or informal text should test for.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: HELM teaches that the interface is not just the model, it's the model + prompting convention + adaptation procedure. Orchestration systems that route tasks to agent skills without also specifying the prompting convention are not fully specifying the invocation. HELM's finding that multi-choice adaptation can cause 49-point accuracy swings means orchestration decisions can be as impactful as model selection.

- **Task Decomposition**: HELM's three-dimensional scenario decomposition (task × domain × language variety) provides a principled vocabulary for specifying what a subtask requires. The insight that domain affects performance as much as task type means decompositions should be domain-aware: don't route all "summarization" subtasks to the same skill if those subtasks span medical, legal, and news domains.

- **Failure Prevention**: HELM identifies specific failure modes: prompt sensitivity, robustness collapse under dialect perturbation, calibration inversion, the accuracy-bias paradox, and model contamination invalidating evaluation. These are concrete failure mode templates for agent system failure prevention: if your routing logic uses confidence scores, verify calibration; if your users speak diverse dialects, test for AAE/SAE performance disparities; if you measure only accuracy in production, you're blind to six other failure dimensions.

- **Expert Decision-Making**: HELM demonstrates that expert evaluation of AI systems requires simultaneously tracking multiple desiderata and understanding their inter-relationships, which are scenario-dependent. The BBQ paradox (most accurate models show worst social bias in ambiguous contexts) illustrates that expert judgment cannot be replaced by single-metric optimization — the relationships are too complex and counterintuitive. Agent systems designed to make expert decisions should be evaluated against the full HELM framework, not just accuracy.