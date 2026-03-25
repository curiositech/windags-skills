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