# Failure Modes in Agent Decision Systems: Lessons from Naturalistic Decision Research

## Overview

Klein and Calderwood's research identifies a specific and interconnected set of failure modes that emerge when decision systems — whether human or artificial — use inappropriate models in operational environments. These failure modes are not random; they follow predictable patterns that arise from the mismatch between the structure of formal decision methods and the structure of real-world problems. Understanding these failure modes is essential for designing agent systems that are robust where it matters most.

## Failure Mode 1: Analytical Paralysis Under Time Pressure

**The failure**: When agents are required to complete an analytical decision process (enumerate options, assess probabilities, compute utilities, select maximum) in time frames that don't support such processing, one of two outcomes follows: the agent delays action while completing analysis, or it completes truncated analysis that produces unreliable outputs while consuming the same time.

Klein and Calderwood document that analytical decision strategies "cannot be effectively accomplished" in time frames under one minute — the time frame in which approximately 85% of the critical decisions in their fireground commander study were made. "Such a term [optimal choice] was seen as potentially paralyzing action."

**The mechanism**: Analytical methods require holding multiple options simultaneously in working memory while applying shared evaluation criteria to each. This is computationally demanding even under ideal conditions. Under stress, time pressure, and information overload — exactly the conditions where decisions are most critical — the working memory and attentional resources required for analysis are precisely the resources being depleted by the situation itself.

**For agent systems**: This failure mode manifests when agents have decision pipelines that are architecturally committed to enumeration-and-comparison regardless of available time. The fix is not to speed up the analysis — it is to recognize when time constraints preclude analysis and switch to recognitional processing. Agents need an explicit time budget for decision processes, with graceful degradation to faster (if less analytically complete) strategies when the budget is constrained.

## Failure Mode 2: Goal Isolation Distortion

**The failure**: When agents extract a single goal from a multi-goal environment and optimize against it, they produce solutions that are optimal for the stated goal and suboptimal or destructive for the unstated goals. The optimization itself is not flawed — the goal specification is.

"In messy environments, goals are often interrelated in many different ways and it is dangerous to make simplifying assumptions in order to isolate goals to make the analysis work."

The military example: optimizing to "deny enemy use of key roads" without representing the parallel goal of "using those same roads for a counterattack in three days" produces solutions that achieve the first goal while destroying the means to achieve the second. The analysis is technically correct given its inputs and catastrophically wrong given the actual situation.

**The mechanism**: Goal isolation is a methodological convenience, not an operational reality. Real situations contain hierarchical, parallel, and interacting goals. Optimization against a subset of them treats the others as unconstrained and will exploit them.

**For agent systems**: Goal specification must include explicit modeling of goal interactions, constraints, and hierarchies. Agents should actively probe for unstated goals before committing to any optimization. When goals cannot be fully specified, agents should prefer strategies that are robust across multiple plausible goal interpretations (satisficing) over strategies that are optimal for the stated goal (optimizing) — because the stated goal is likely incomplete.

## Failure Mode 3: Abstract Utility Versus Contextual Value

**The failure**: When option evaluation uses abstract, context-independent utility dimensions, it misses the contextual value information that actually determines which option is appropriate. The option with the highest abstract score may be the wrong option in the specific situation.

"Expertise often enables a decision maker to sense all kinds of implications for carrying out a course of action within a specific context, and this sensitivity can be degraded by using generic and abstract evaluation dimensions."

The chess example: rating moves on dimensions like "center control" or "kingside attack potential" produces worse evaluations than evaluating moves in context, considering the specific position dynamics and the specific trajectory of this particular game. The abstract dimensions capture some signal but lose the crucial contextual information that expert evaluation preserves.

**The mechanism**: Abstract dimensions are averages — they represent value across a distribution of situations. In any specific situation, the actual value may be substantially above or below the average. Evaluation systems that use abstract dimensions will systematically get contextually unusual situations wrong.

**For agent systems**: Where possible, move option evaluation from abstract scoring to situational simulation. The question "is this option good?" should be replaced by "does this option work in *this* specific situation?" Simulation against the specific current context — the RPD mental simulation mechanism — preserves contextual information that abstract scoring loses. When abstract scoring must be used, include explicit mechanisms for detecting when the current situation is far from the distribution on which the scoring model was calibrated.

## Failure Mode 4: The Confident Wrong Assessment

**The failure**: Misclassification of the current situation leads to appropriate actions for the wrong situation — which look well-reasoned and internally coherent because the reasoning is valid given the (wrong) situation model.

This is the most dangerous failure mode because it is the hardest to detect from the outside. The agent's behavior is coherent, justified, and well-executed. It is simply responding to a situation that doesn't exist.

**The mechanism**: Recognitional decision-making (which is appropriate and efficient for experts in familiar domains) fails catastrophically when the situation is misclassified. The pattern match returns a wrong prototype, which generates wrong action priors, wrong expectations, and wrong monitoring attention. The mental simulation is run against a wrong situation model and passes — because it is testing whether the action works for the classified situation, not the actual situation.

**For agent systems**: This failure mode requires multiple independent defenses:

1. **Expectancy monitoring**: After classification and action, monitor whether the situation evolves as the classified prototype predicts. Significant divergence from prediction should trigger reassessment.

2. **Anomaly attention**: During situation assessment, actively attend to cues that don't fit the current classification. Anomalies are evidence against the classification, not noise to be discarded.

3. **Classification confidence tracking**: Maintain explicit confidence estimates for situation classifications and reduce reliance on rapid recognitional action when classification confidence is low.

4. **Novel situation detection**: Identify situations that don't match any known prototype and explicitly switch to deliberative (not recognitional) processing for them.

## Failure Mode 5: Post-Hoc Rationalization as Analysis

**The failure**: Agents (or humans) generate an action through rapid intuitive processing, then construct analytical justification for it — producing outputs that look analytically derived but are actually rationalizations of intuitively reached conclusions.

Soelberg's study of business school graduates found that "the apparent reliance on analytic option evaluation was largely a fiction used to buttress their intuitive choice made much earlier than the business students were prepared to admit."

**The mechanism**: Analytical frameworks can be applied in reverse — starting from a conclusion and selecting supporting analysis — as readily as they can be applied forward — starting from analysis and arriving at a conclusion. The outputs look identical from the outside, but only one is genuine analytical reasoning.

**For agent systems**: Chain-of-thought reasoning, rationale generation, and explicit deliberation are all vulnerable to this failure. The diagnostic question is: if the reasoning were not present, would the agent produce the same output? If yes, the reasoning is post-hoc. This is testable by removing or randomizing the reasoning process and checking whether outputs change.

Systems should be designed so that reasoning processes are causally upstream of conclusions, not descriptively downstream. This requires architectural commitment: the conclusion must not be computed until the reasoning is complete.

## Failure Mode 6: Expertise Degradation Through Forced Analysis

**The failure**: Requiring experienced agents (or human experts) to use analytical frameworks in domains where they have reliable recognitional competence degrades their performance below what they would achieve using natural recognitional processing.

"By trying to force experienced decision makers to adjust to the needs of the prescriptive models we run the risk of degrading their ability to make use of their own experience. We can interfere with their proficiency."

**The mechanism**: Recognitional processing is fast and reliable in familiar domains precisely because it bypasses the costly and error-prone steps of explicit option generation and utility computation. Forcing those steps reintroduces exactly the costs that expertise eliminates. The expert is now operating as a novice would — slowly, formally, and without access to the rapid pattern-matching that makes their performance distinctive.

**For agent systems**: When an agent has strong performance on a class of problems through trained pattern recognition, introducing mandatory analytical review of its outputs will:
- Slow the decision process
- Potentially override reliable recognitional outputs with less reliable analytical outputs
- Create friction that interferes with the natural operation of the learned capability

The right role for analytical review is *exception handling* — catching cases where the recognitional system's confidence is low or where anomalies suggest the pattern match may be wrong — not *standard processing* applied uniformly to all cases.

## Failure Mode 7: Training on Prototype Cases, Failing on Boundary Cases

**The failure**: Agents trained primarily on clear, unambiguous prototype cases develop strong performance on those cases and weak performance on boundary cases — cases near the boundary between situation types, where the discriminating features are ambiguous or absent.

In operational environments, boundary cases are not rare events to be tolerated. They are systematically overrepresented among the hardest and most consequential decisions. Easy cases resolve themselves; it is the ambiguous ones that require skilled judgment and that determine outcomes.

**The mechanism**: If training data is sampled proportionally from the case distribution, easy prototype cases dominate (they are more common) and boundary cases are underrepresented. The agent learns to perform well on the majority distribution but fails in the tail — which is exactly where performance most matters.

**For agent systems**: Deliberate oversampling of boundary cases in training, combined with explicit evaluation on held-out boundary case sets, is required to build agents that perform where it counts. This is more expensive to curate and harder to evaluate, but without it the agent's apparently strong benchmark performance will systematically overstate its capability in deployment.

## Summary: The Common Thread

All seven failure modes share a common structure: they arise from a mismatch between the decision architecture (analytical, formal, static) and the problem structure (operational, naturalistic, dynamic). The fix is not to improve the analytical tools — it is to recognize the mismatch and select decision architectures that fit the problem.

"The problem is that classical decision theory rests on some restrictive assumptions... If the assumptions are rarely met, then these models may not be useful guidelines for making better decisions."

The same principle applies to agent systems: check your architectural assumptions against your deployment conditions. When they match, analytical frameworks are powerful. When they don't, recognitional frameworks — supported by rich case libraries, effective situation assessment, and mental simulation — are the appropriate alternative.