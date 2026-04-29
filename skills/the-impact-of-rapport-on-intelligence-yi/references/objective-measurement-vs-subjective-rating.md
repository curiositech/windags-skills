# Objective Behavioral Measurement vs. Subjective Rating: Why the Measurement Choice Changes What You Can Learn

## The Methodological Core of the Research

The Nunan et al. (2020) study makes a deliberate and consequential methodological choice: it measures rapport through "the coding of behaviours that have been theoretically and empirically linked to rapport" rather than through subjective rating scales (e.g., Likert scales of 1-5 for overall rapport quality). The outcome measure (intelligence yield) is similarly coded as discrete detail units rather than rated holistically.

"The framework of verbal rapport used an objective measure of rapport, by coding the frequency of each verbal behaviour, rather than using a subjective rating scale (e.g. a Likert scale of 1–5) of rapport behaviours or the interaction as a whole."

This choice is explicitly motivated by prior research (Walsh & Bull, 2012) showing that "an objective measure of rapport would provide evidence as to which verbal and nonverbal behaviours actually help establish and maintain rapport... based on the behaviours that occurred during the interview." The contrast is with subjective ratings, which reflect rater impressions of overall interaction quality rather than behavioral counts.

This methodological decision is not merely academic — it has profound implications for what questions can be answered and what interventions can be designed.

## What Objective Behavioral Coding Enables

**1. Decomposition**: When you count individual behaviors (each back-channel response, each paraphrase, each probe), you can ask which specific behaviors are associated with outcomes. When you rate overall quality on a scale of 1-5, you cannot decompose the rating — you can only know that some interactions felt better than others.

The discovery that positivity explains 4% of variance while attention explains 69% is *only possible* with behavioral counting. A holistic quality rating would have merged these into a single score, and the 69%/4% split would have been invisible.

**2. Training target specification**: Objective behavioral counts produce actionable training targets. "Increase back-channel responses, paraphrasing, and probing questions" is specific and trainable. "Improve rapport quality" is not.

The paper explicitly notes: "The rapport framework in the present research could be utilised in a training environment to highlight verbal behaviours associated with the three components of rapport." And: "if source handlers were to place an emphasis on both attention and coordination, this may benefit the elicitation of intelligence." These recommendations are possible *because* the measurement is behavioral and specific.

**3. Real-time monitoring**: The research notes that "frequency monitoring of rapport and its three components can provide an insight into the current state of rapport in an interaction" (Collins & Carthy, 2019). A behavioral coding scheme is monitorable in real time — you can track the frequency of attention behaviors mid-interaction and know whether the current state of rapport is likely to sustain information flow. A holistic rating can only be applied post-hoc.

**4. Disambiguation of correlated constructs**: The three components of rapport are positively correlated with each other (attention and positivity: r=.35; attention and coordination: r=.38; coordination and positivity: r=.60). Without behavioral measurement, these correlations would make it nearly impossible to distinguish their independent contributions. With behavioral counting, you can enter all three into a model and examine their independent relationships to yield.

## What Holistic Rating Cannot Do

Holistic rating scales have a different epistemological structure than behavioral coding. When a rater assigns a score of 4/5 to "overall rapport," that score reflects:

- The rater's implicit model of what rapport is
- The salience of specific moments in the interaction (recent moments, emotionally vivid moments)
- The rater's own rapport preferences and cultural background
- Halo effects from other aspects of the interaction that seemed good

These factors produce ratings that are consistent enough to be reliable (if raters share a model) but that cannot be decomposed into the behaviors that produced them. You know the interaction was a "4" — you do not know which of the hundreds of individual acts in the interaction pushed it to 4 rather than 3 or 5.

More problematically, holistic ratings tend to converge on the behaviors most salient to the rater — which may not be the behaviors most predictive of outcomes. Given the research finding that positivity is the component practitioners most emphasize (and that correlates least with yield), there is every reason to expect that holistic rating would be dominated by positivity signals. The "warm, friendly, empathetic" interaction would score high on holistic rating while the "focused, probing, summarizing" interaction might score lower — even if the second produces substantially more intelligence.

## The Intelligence Yield Coding System

The outcome measurement is equally behaviorally specific. Intelligence yield is not rated as "how much useful information was obtained" (1-5). It is coded as discrete detail units across five categories:

- **Surrounding details**: Settings, locations ("London," "the Tesco car park off Junction 12")
- **Object details**: Items discussed ("a silver Audi," "drugs," "an envelope")
- **Person details**: People and descriptions ("she," "a man in a grey hoodie")
- **Action details**: Activities ("drove," "met," "transferred," "dealing")
- **Temporal details**: Time references ("around 9pm," "on Tuesday," "in January")

The example given in the paper illustrates the coding: "around 9 pm (one temporal IY) she (one person IY) was driving (one action IY) a car (one object IY) and dealing (one action IY) drugs (one object IY) in London (one surrounding IY)." This single sentence yields seven intelligence details.

This coding system has several properties that holistic rating lacks:

**Granularity**: The difference between 60 and 90 intelligence details in a 7-minute call is measurable. A holistic rating might not distinguish these ("both were good interactions").

**Category specificity**: Different categories of detail may have different operational significance. Person details (who is involved) may be more immediately actionable than temporal details (when things happened). The ability to measure by category allows this analysis.

**Independence from interaction quality impressions**: An interaction where the handler was rude but extracted 120 intelligence details would score differently on outcome than on holistic quality rating. Behavioral outcome measurement is not contaminated by process impressions.

**Ground truth for model evaluation**: Because IY is coded independently of rapport, the correlation between rapport behaviors and IY is not a tautology — it is an empirical finding. If both were rated holistically by the same rater, the correlation might reflect rater consistency rather than a real relationship.

## The Inter-Rater Reliability Requirement

Objective behavioral coding requires demonstrating that different coders apply the framework consistently. The study reports inter-rater reliability of k=.77 — a high level of agreement between two independent coders. This is not just a methodological formality. It demonstrates that the behavioral categories are *specified clearly enough* that two different people can apply them consistently to the same material.

This is a demanding standard that subjective rating often fails. "Overall rapport quality" rated 1-5 by two independent raters will typically produce lower inter-rater reliability than counting specific behaviors — because the behavioral categories are more objectively specified than holistic quality impressions.

For agent systems: any quality metric that cannot be reliably coded by two independent agents using the same specification is underspecified. The specification should be refined until inter-rater reliability is demonstrably high. This is the operational meaning of "having a well-defined metric."

## The Coefficient of Determination Requirement

The paper advocates explicitly for using R² (coefficient of determination) rather than just r (correlation coefficient): "The present research advocates for the utilisation of the coefficients of determinations (R²) when examining rapport. This is because the coefficients of determinations go beyond just accepting significant correlations at face value, but rather explore how the percentage of observed variation that can be explained by one factor."

The practical implication: coordination was *statistically significant* (r=.21, p=.028) but explained only 5% of variance. "Accepting significant correlations at face value" would lead to the conclusion that coordination matters as much as attention, because both are significant. The R² analysis reveals that they differ by a factor of 14 in explanatory power (69% vs. 5%).

For agent systems: when evaluating factors that influence outcomes, require variance-explained metrics, not just significance tests. A factor that significantly correlates with an outcome but explains 5% of its variance is very different from one that explains 69%, even if both are "significant." Decision-making should be proportional to effect size, not to statistical significance.

## Application to Agent System Quality Metrics

The methodological lessons from this paper apply directly to how agent systems should measure their own performance:

### Principle 1: Count behaviors, don't rate impressions

When designing quality metrics for agent skills, specify the behaviors to count rather than the impressions to rate. Not "was the code review thorough?" (1-5) but "how many functions were checked for edge cases? how many dependency paths were traced? how many input validation assumptions were tested?" These can be counted; thoroughness impressions cannot be decomposed.

### Principle 2: Require inter-rater reliability before using a metric

Any quality metric used in agent system evaluation should be tested for inter-rater reliability before deployment. If two independent evaluation agents applying the same specification produce substantially different assessments, the specification is underspecified and will produce unreliable optimization signals.

### Principle 3: Separate process metrics from outcome metrics

The study measures rapport behaviors (process) and intelligence yield (outcome) independently, then examines their relationship. This independence is what allows the finding that positivity correlates with yield at r=.19 while attention correlates at r=.83. If process and outcome were measured by the same method, this differentiation would not be possible.

Agent systems should maintain separate measurement of:
- Process behaviors (what the agent did: probing frequency, output coverage, revision cycles)
- Outcomes (what resulted: task completion, error rate, downstream utility)

The relationship between process and outcome is then an empirical finding, not an assumption.

### Principle 4: Report variance explained, not just correlation

When selecting among possible metrics or behaviors to optimize, require reporting of R² not just r. This prevents over-investment in factors that are significant but low-effect. The 69% vs. 5% distinction is the most important single finding in this paper for practical intervention design — and it is only visible through the R² lens.

### Principle 5: Measure at the act level, aggregate for analysis

The study codes individual utterances — each back-channel response, each paraphrase, each probe — and sums across the interaction for analysis. This granularity makes aggregation possible while preserving the ability to examine specific behavior distributions. Agent systems should log at the act level (each query, each assertion, each probe, each summary) and aggregate for analysis — not log only at the episode level ("completed task").

## The Training Implications of Behavioral Specificity

The paper closes with explicit training recommendations enabled by behavioral specificity: "The rapport framework in the present research could be utilised in a training environment to highlight verbal behaviours associated with the three components of rapport."

Behavioral specificity makes training possible because it specifies what to practice. "Build rapport" is not trainable — you cannot practice it because you cannot observe yourself doing it. "Paraphrase what the source says before asking your next question" is trainable — you can observe yourself doing it, count how often you do it, and receive feedback on whether you did it well.

This is the fundamental reason that behavioral coding is superior to holistic rating for improvement purposes: you can only improve what you can specifically observe and count. Holistic quality impressions are post-hoc constructions that do not decompose into behavioral targets. Behavioral counts are direct targets for behavioral training.

For WinDAGs skill development: when developing training data, evaluation rubrics, or fine-tuning signals for specific skills, specify the behaviors to be measured at the behavioral-count level, not the holistic-impression level. This enables the system to learn what specific behaviors to increase or decrease, not just whether its overall performance was good or bad.

## Summary

The methodological choice to count specific behaviors rather than rate holistic impressions is not a technical detail — it is the decision that makes the paper's central finding possible. Only behavioral counting allows you to discover that one component explains 69% of variance while another explains 4%. Only behavioral outcome coding allows independent measurement of process and outcome. Only R² reporting reveals the practical significance of the 5% vs. 69% distinction. For agent system design, these lessons translate to: count behaviors (don't rate impressions), require inter-rater reliability, separate process from outcome measurement, report variance explained, and log at the act level. These are the measurement practices that make improvement tractable rather than impressionistic.