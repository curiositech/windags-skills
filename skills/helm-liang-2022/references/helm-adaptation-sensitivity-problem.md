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