# Failure Modes in Expert Judgment: Warnings for Intelligent System Design

## Why Failure Modes Matter

A theory of expert performance is only fully useful when it also explains expert failure. Klein and MacGregor's work, while primarily aimed at eliciting and transferring expertise, contains a clear-eyed account of where expert judgment goes wrong. These failure modes are not embarrassing exceptions to the model — they are predictable consequences of the same cognitive mechanisms that make expertise powerful.

For intelligent agent systems, understanding these failure modes serves two purposes: (1) it warns against replicating human cognitive biases in automated systems, and (2) it identifies specific monitoring and safeguard mechanisms that should be built into agent architectures.

## The Heuristics That Bias Judgment

Klein and MacGregor draw on the behavioral decision theory literature (particularly Tversky and Kahneman) to identify two fundamental heuristics that produce systematic errors:

### Availability Bias

"A commonly used heuristic for judging the uncertainty of a proposed event is availability (Tversky & Kahneman, 1973) whereby an individual relies upon the ease with which relevant instances can be recalled from memory as a basis for judgment. However, ease of recall can be influenced by factors unrelated to the actual frequency with which they are experienced, such as vividness, salience, and recency" (p. 15).

The availability heuristic means that situation assessment is biased toward classifications that resemble vivid, memorable, or recent past cases — not necessarily the most probable classification given current evidence. An expert who recently handled a particular type of incident will be primed to classify the next ambiguous situation as an instance of that type. An expert who has never encountered a rare type will consistently underestimate the probability of its occurrence.

**For agent systems**: Any system that learns from interaction data will inherit availability bias if that data is not carefully balanced. High-frequency, high-salience events will be overrepresented in the learned patterns. The system will overclassify rare events as common ones. This is especially dangerous in domains where the rare events (system failures, security breaches, edge cases) are precisely the ones that matter most.

### Representativeness Bias

"Judgments based on representativeness focus on the degree to which a particular case or instance shares features similar to a prototype, class, or stereotype (Tversky & Kahneman, 1974)... Biasing effects occur because the heuristic leads to an insensitivity to the distributional properties of samples. Small samples are regarded as more predictive than is appropriate and event patterns are judged as meaningful on the basis of appearance alone, without resort to the underlying uncertain process which generated them" (p. 15).

The battle commander example: "A battle commander might be fooled into reacting wrongly because the enemy presents to him a subset of activities that are like those that appeared previously when the enemy took certain actions. The commander ignores the other actions these activities might also indicate; basing his reaction solely upon a single previous event and a limited subset of the possible indications" (p. 15).

**For agent systems**: Classification based on surface feature matching without attention to base rates or alternative explanations is a direct analog of representativeness bias. An agent that classifies situations based on "looks like X" without checking whether the observed features are equally consistent with Y, Z, or an entirely different type, will be systematically misled in ambiguous situations.

## The Normative Model Trap

Klein and MacGregor identify a systemic failure mode in system design that is distinct from individual cognitive biases: the tendency to fit tasks to normative models rather than fitting models to tasks.

"Often the model selected is a normative one, such as a decision analytic model. The rationale generally given for this choice is that such models provide optimal solutions to a problem and cannot be outperformed by humans' natural abilities. An alternative and arguably more accurate reason is that systems designers are often far removed from the substantive aspects of the tasks with which they deal. Tasks are modeled in the abstract according to highly generalized principles that are familiar to them and that obey known rules and relationships... the task is then fit to the model rather than the model to the task" (p. 36).

This is a failure mode of the *system designer*, not of the expert user. It produces decision support systems that are technically correct according to their internal models but misaligned with how the decision is actually made and what actually matters in execution.

**For agent systems**: This is an architectural failure mode, not a runtime failure. An agent system built around analytical option comparison will fail to support domains where RPD-style recognition is the appropriate mechanism. An agent system built around explicit probability estimation will fail in domains where probability assessment is poorly calibrated and expert judgment is more reliable. The selection of cognitive architecture should be driven by careful study of how the domain actually works, not by the convenience of familiar modeling frameworks.

## Failure to Generate Complete Option Sets

Behavioral decision theory research cited by Klein and MacGregor shows that "people are typically not good at generating complete sets of options" (Gettys & Fisher, 1979; Pitz, Sachs, & Heerboth, 1980, cited on p. 14). The concurrent evaluation model requires a complete option set; if significant options are missing from the set, the "best" choice from the incomplete set may be far from optimal.

This is one of the arguments for the RPD model as a more robust design: by drawing on a recognition-activated "action queue" ordered by typicality, the RPD approach avoids the need to generate a complete option set. It starts with the most likely-to-work option rather than trying to survey all options.

**For agent systems**: Systems that require complete option enumeration before decision-making are vulnerable to missing options — particularly options that fall outside the designer's mental model of the problem. Building agents with action queues grounded in empirically observed expert behavior provides a better initial option set than analytical generation alone.

## The Decomposition Failure

One of the most important failure modes Klein and MacGregor identify is in the training and knowledge transfer domain: the assumption that expertise can be decomposed into subordinate skills and trained incrementally.

"This approach assumes that mastery of a skill must be achieved by incremental attainment of lower skill levels. Expertise is defined as an aggregation of knowledge through successful accomplishment of subordinate skills. It tacitly assumes that skilled performance is decomposable into ever finer increments of knowledge that can be trained independently" (p. 39).

The problem: "Expert skills are difficult to decompose according to an ISD format, performance requirements for testing and evaluation are extremely difficult to define, and learning objectives are difficult to specify. The phenomenological nature of expert performance requires that a different tack be taken" (p. 39).

The decomposition failure is particularly severe because it is self-reinforcing. Systems built on decomposed skill models appear to work at basic proficiency levels, because basic skills *can* be decomposed and trained independently. The failure only becomes visible at upper skill levels — which are precisely the levels that matter for handling non-routine situations.

**For agent systems**: Modular agent architectures that decompose tasks into sub-tasks and assign each sub-task to a specialized module may fail to capture cross-cutting expertise that operates at the level of the whole task. The integration of sub-task outputs into coherent situational understanding may be precisely what decomposition misses. Systems should have explicit mechanisms for *holistic* situation assessment that operates above the level of individual modules.

## Analytical Strategies Fail Under Time Pressure

"Studies have shown that analytical decision strategies are not effective when there is less than one minute to respond (Howell, 1984; Zakay & Wooler, 1984; Rouse, 1978). And these studies were performed with tasks that were well-defined and clearly amenable to analytical decision strategies. What would happen if the researchers used tasks that included ambiguous and missing data?" (p. 19).

The implication is stark: any agent system that relies on analytical multi-option evaluation as its primary decision mechanism will fail in time-pressured, ambiguous environments. It will run out of time before completing the evaluation, or it will generate poor quality inputs (poorly calibrated probability estimates, incomplete option sets) that invalidate the analytical output regardless.

**For agent systems**: Time budgets are first-class design constraints. Systems must degrade gracefully as time pressure increases. This means having tiered decision mechanisms: fast, recognitional responses available at all times, with analytical elaboration invoked only when time permits.

## The Confidence-Calibration Problem

Klein and MacGregor note that "uncertainty assessments are poorly calibrated and exhibit an insensitivity to the degree of actual knowledge" (Lichtenstein, Fischhoff, & Phillips, 1982, cited on p. 14). Experts and novices alike tend to be overconfident in their probability assessments, especially for areas where their knowledge is limited.

This is particularly dangerous in the CDM context because the *recall* process is itself subject to availability bias, and the framework used to structure recall can artificially inflate apparent completeness.

**For agent systems**: Confidence scores output by agents should be treated as inputs requiring calibration, not as direct probability estimates. Systems should maintain calibration data — how often has the agent been right when it reported X% confidence? — and apply corrections accordingly.

## The Social Masking of True Expertise

Klein and MacGregor identify a failure mode in expert selection that is surprisingly systematic: "Social processes may do little to reveal the critical knowledge that experts ultimately demonstrate when faced with real problems to solve. Moreover, experts may not be willing to disagree with one another for professional reasons, making their public statements less useful for identifying relative levels of expertise" (p. 5).

In other words, the experts with the highest institutional rank, the most comfortable social presentation, or the greatest verbal fluency may not be the most performatively capable. The most performative expert may be a junior person who lacks political standing to assert their knowledge publicly.

**For agent systems**: When building knowledge bases from human expert interaction, don't rely solely on designated "experts" at the top of institutional hierarchies. Seek out practitioners who have demonstrated expertise through performance outcomes, including junior practitioners who may have better task skills even if they lack rank. The CDM's focus on incident-based probing — "tell me about a time when..." — provides a performance-based rather than status-based selection mechanism.

## Designing Safeguards Against These Failure Modes

Based on the failure modes Klein and MacGregor identify, the following safeguards should be built into intelligent agent systems:

1. **Anti-availability correction**: Maintain calibrated base rates for situation types; don't allow recency or vividness to distort classification probability.

2. **Alternative hypothesis maintenance**: In ambiguous situations, maintain multiple active situation hypotheses rather than committing to a single classification. Require evidence to explicitly rule out alternatives.

3. **Time-aware architecture**: Build degradation schedules that gracefully reduce analytical depth as time pressure increases; never let the analytical process block a basic recognitional response.

4. **Architectural alignment with domain**: Study the domain before selecting the cognitive architecture. Don't impose normative decision frameworks on domains where recognition-based reasoning is the correct mechanism.

5. **Holistic SA layer**: Maintain a situation assessment layer that operates above the level of individual sub-task modules; it must integrate across all sub-tasks to detect situations that require cross-cutting expertise.

6. **Calibration maintenance**: Track agent confidence against outcomes; apply correction factors; flag domains where calibration is poor.

7. **Complete knowledge base validation**: After eliciting knowledge from domain experts, explicitly probe for completeness using hypotheticals and counterfactuals; don't trust any knowledge base that hasn't been tested against non-routine cases.

## Summary

The failure modes Klein and MacGregor identify — availability bias, representativeness bias, normative model imposition, decomposition failure, analytical strategy failure under time pressure, confidence miscalibration, and social masking of true expertise — are systematic and predictable. They arise from the same cognitive mechanisms that make expertise work, pushed beyond their domain of reliability. Designing intelligent agent systems with awareness of these failure modes means building in explicit safeguards: calibration mechanisms, alternative hypothesis maintenance, graceful degradation under time pressure, and architectural humility about when analytical strategies are appropriate.