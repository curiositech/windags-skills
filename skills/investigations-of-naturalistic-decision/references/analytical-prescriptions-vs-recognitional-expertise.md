# When Analytical Prescriptions Harm Expert Performance: The Case Against Universal Optimization

## The Prescriptive Consensus and Its Failure

There is broad consensus in the behavioral decision-making literature about what good decision-making looks like. Janis and Mann (1977) articulate it clearly — the "ideal" decision-maker should: thoroughly canvass a wide range of alternatives, survey the full range of objectives, carefully weigh costs and risks of negative consequences, intensively search for new information, correctly assimilate new information even when it contradicts initial preferences, reexamine all known alternatives before final choice, and make detailed provisions for implementation.

These seven criteria are not fringe positions. They represent the mainstream of prescriptive decision research, the basis for Decision Analysis and Multi-Attribute Utility Analysis, and the implicit standard against which human decision-making has been found consistently deficient. The bias research tradition (Kahneman, Tversky, and their many followers) can be understood as a systematic documentation of the ways that real decision-makers fail to meet these criteria.

The implication drawn from this literature — invest in training, decision aids, and support systems that help people meet these criteria — has driven enormous practical effort. And the payoffs, as Klein and Calderwood bluntly note, "have yet to be seen." Decision aids based on these principles have not been well-accepted in operational settings. Decision training has not been shown effective under time pressure. The gap between prescriptive ideal and operational reality has not narrowed.

Klein and Calderwood's research explains why — and the explanation has implications not just for decision research but for the design of intelligent systems.

## The Fundamental Mismatch

The prescriptive tradition assumes that decision-making fundamentally consists of concurrent evaluation among options. The decision-maker's job is to generate options, evaluate them against criteria, and select the best. Analytical methods are prescriptions for doing this job better: more options, more criteria, more careful evaluation, less bias.

But Klein and Calderwood found that experienced decision-makers in operational settings rarely do this. Not because they are violating the prescriptions under time pressure (though time pressure does constrain them), but because concurrent evaluation is not the cognitive process through which expertise expresses itself. Expert decision-making works through recognition, not through systematic option comparison.

When analytical prescriptions are imposed on expert decision-makers, they do not get the same cognitive process done better. They get a different, inferior cognitive process. The expert's recognitional capabilities — which were the product of extensive experience — are rendered inaccessible, and a slower, less accurate analytical process is substituted.

"The greater concern is that they will be unable to make effective use of their own expertise. The Decision Analysis and MAUA approaches may not leave much room for the recognitional skills of experienced personnel. Therefore the risk of using these approaches is that decision performance will become worse, not better." (p. 20)

## The Bias Research Reinterpretation

The cognitive bias literature (availability, representativeness, anchoring, overconfidence, etc.) has created a widespread impression that human decision-making is systematically and severely flawed. The prescriptive implication is clear: replace human intuition with analytical methods that do not share these biases.

Klein and Calderwood offer a different interpretation. Christensen-Szalanski and Beach (1984), they note, argued that "these classical decision biases are artifacts of laboratory methodology and of the analytical perspective; they showed that studies of novice decision makers usually found evidence for biases whereas studies of experts usually documented their strengths." (p. 21)

Furthermore, even where biases exist in expert populations, they may be negligible in practical effect: "The biases primarily operate on very low frequency events. And if the frequency of such events increases, so will experience with them, thereby diminishing the bias." (p. 21)

And some tendencies coded as "biases" in laboratory tasks are actually strengths in operational contexts:

"'Biases' such as availability and representativeness reveal the fact that proficient decision makers have learned to rely on episodic memory. They can store earlier experiences as potential analogues to guide future performance. Surely the skilled use of episodic memory would be a strength for proficient cognitive performance in general, rather than a weakness for handling abstract story problems about female bank tellers." (p. 22)

Availability and representativeness are not pathologies of cognition — they are features of a cognitive system optimized for real-world performance. In the laboratory, stripped of domain context and experience, they produce errors. In operational settings, they produce rapid, accurate, experience-based judgments.

This is not an argument against all bias research or for uncritical trust in human judgment. It is an argument for context-specificity: the same cognitive process can be adaptive in one context and maladaptive in another. Judging operational expertise by laboratory standards produces a misleadingly negative picture.

## Should Decision-Makers Generate as Many Options as Possible?

The prescriptive recommendation to generate many options before deciding is standard in decision research. Klein and Calderwood's answer is direct: "No."

"In the time-pressured environment we studied, there simply was not enough time to follow such advice. It takes time to generate and evaluate options, and delays may be intolerable. In addition, the situation may shift during the analyses so that the whole process has to start over again. Even in the absence of time pressure we rarely observed proficient decision makers trying to generate large sets of options... Therefore, advice to generate large option sets is telling people to act like novices." (p. 19-20)

The final sentence is the key insight. Generating many options is what novices do — because they do not have the recognitional capabilities to know which options are worth considering. Telling experts to generate many options is telling them to simulate incompetence.

The appropriate time to generate large option sets is "when a situation is encountered that is unfamiliar, or when there are disputes." (p. 20) Novel situations and genuine disagreements are exactly when recognitional strategies fail or are contested — and in those cases, analytical enumeration becomes valuable precisely because it surfaces alternatives that recognition-based reasoning would not produce.

## The Novice Exception

The prescriptive tradition is not entirely wrong — it is population-specific. The critical caveat is that analytical methods are appropriate for novices and inappropriate for experts.

This distinction matters practically because it means that the best decision support for a system is calibrated to the expertise of the decision-maker:
- **For novices**: provide structure, prompts to consider multiple options, criteria frameworks, explicit evaluation procedures
- **For experts**: provide information, feedback on expectancy violations, and stay out of the way

The failure of prescriptive approaches in operational settings may largely be explained by their indiscriminate application — giving expert decision-makers the support appropriate for novices, thereby impairing rather than improving their performance.

Furthermore, there is a developmental concern: if novices learn to rely on analytical support rather than developing their own recognitional capabilities, they remain novices indefinitely. The analytical scaffolding that helps them in the short term prevents the experience-accumulation that would eventually allow them to operate expertly.

## Implications for Agent System Design

### Do Not Force Expert Agents into Analytical Frameworks

Agent systems that impose uniform decision procedures on all agents — requiring every agent to generate multiple options, score them on multiple criteria, and select the highest scorer — are applying the novice prescription to agents that may have expert-level capabilities. This actively impairs expert agent performance.

The design should instead allow agents to operate in the mode appropriate to their current capability and situation:
- **Recognition mode** (for familiar situations with high expertise): act on pattern match, with optional simulation
- **Deliberation mode** (for novel situations or explicitly requested deeper analysis): generate options and evaluate

The trigger for deliberation should be specific and earned: either the situation doesn't match any known prototype confidently, or the decision has been flagged as high enough stakes to justify the extra cost.

### Calibrate Decision Support to Expertise Level

Decision support mechanisms in multi-agent systems should be expertise-aware. For an agent operating in an unfamiliar domain:
- Prompt generation of multiple options
- Provide evaluation frameworks
- Offer relevant analogues (with appropriate qualification)
- Request explicit reasoning about tradeoffs

For an agent operating in its core domain:
- Provide situational information quickly and clearly
- Avoid requiring extensive justification for decisions
- Trust recognitional outputs as primary, not just as inputs to further analysis
- Flag expectancy violations without requiring defensive analytical justification

### The Bias Research Warning

Agent systems should not be designed with the assumption that their probabilistic reasoning is superior to expert-mode recognitional reasoning. In domains where the agent has accumulated substantial experience (equivalent to expert domain knowledge), recognitional processes may be more accurate than explicit probabilistic analysis — and certainly faster.

The prescriptive bias research has been systematically generated in low-expertise, high-control laboratory conditions. The findings do not straightforwardly transfer to operational conditions with experienced practitioners. Designing agent systems around the assumption that human-like intuitive processes are inevitably biased and need analytical correction will produce systems that impair rather than support expert-level performance.

### Decision Aids as Information Providers, Not Decision Replacers

The most successful use of decision support in operational contexts is as an information provider — giving decision-makers better situational information faster — rather than as a decision procedure replacement. The research suggests that expert decision-makers do not benefit from being told how to decide; they benefit from being given the information their recognitional processes need.

For agent systems, this means that decision support tools should be designed to enrich situation assessment (better information about cues, faster delivery of critical data, clearer expectancy violation signals) rather than to substitute for recognitional judgment (scoring options, ranking alternatives, recommending choices).