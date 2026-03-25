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