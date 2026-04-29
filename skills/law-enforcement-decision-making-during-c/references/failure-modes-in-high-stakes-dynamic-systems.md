# Failure Modes in High-Stakes Dynamic Systems: What Goes Wrong and Why

## The Failure Mode Taxonomy

One of the most practically valuable contributions of Zimmerman's research and the broader NDM tradition is not a description of what experts do right — it is a taxonomy of what goes wrong, even for experts, even in systems designed to perform well. Understanding failure modes is the foundation of robust system design: you cannot build reliable safeguards against failure patterns you have not identified.

The failures described in the NDM literature are not random. They cluster into recognizable patterns that occur across domains — firefighting, aviation, naval warfare, policing — and are rooted in the same underlying cognitive mechanisms. This cross-domain consistency makes them genuinely useful as a design resource for agent systems.

## Failure Mode 1: Task Fixation — The Sunk Cost of a Bad Plan

Perhaps the most documented failure mode in NDM research is task fixation: the inability to abandon an inappropriate course of action even when evidence clearly demands a change.

The defining case is Weick's (2001) analysis of wildfire fatalities: "firefighters died with all their equipment and tools still in hand. This is significant because if the firefighters had dropped their tools and equipment as they retreated, they likely would have survived. Even when commanded to drop their equipment, many did not respond and maintained their tools" (cited in Zimmerman, pp. 30-31).

The tools that were saving their lives in one phase of the incident became the weights that killed them in another phase. The mental model had not updated. The plan remained in force long after the conditions that justified it had changed.

Orasanu et al.'s (2001) aviation accident analysis confirmed the same pattern at scale: "analysis of 37 airline accidents revealed that the majority of errors made were errors of omission; meaning they failed to do something that should have been done. These omission errors happened in situations where pilots continued with their course of action although evidence indicated that a change in action was necessary. The pilots inadequately assessed the situation, relying instead on familiar mental models to guide them through the situation" (cited in Zimmerman, p. 31).

Note the causal chain: familiar mental model → confident situation assessment → continued plan execution → failure to notice or integrate disconfirming evidence → omission error → catastrophe.

This failure is not stupidity or carelessness. It is the dark side of expertise. The very mechanism that makes experts fast — the automatic application of well-practiced mental models — makes them slow to detect that a model no longer applies. The stronger the expert's experience with a pattern, the more resistant they are to recognizing that the current situation is not an instance of it.

**Contributing factors** (Orasanu et al., cited in Zimmerman, p. 31):
- **Ambiguity**: When cues indicating a problem are not clear-cut, the decision-maker has latitude to interpret them as consistent with the current mental model
- **Dynamic risks**: When the risk of not changing plans develops gradually, it is underestimated at each individual moment
- **Organizational and social pressures**: Changing course can feel like admitting error; social dynamics push toward continuing the original plan
- **Stress**: Acute stress narrows attention, reducing the bandwidth available for detecting disconfirming evidence

**For agent systems:**
- Build plan-revision triggers that are independent of the action-execution pipeline. The process "is my plan still valid?" must not be part of the process "execute my plan" — they need to run in parallel.
- Implement explicit plan expiration: a plan generated under situation assessment X is valid only as long as the situation remains X. Build this logic into plan data structures.
- Design for disconfirmation, not just confirmation. Agents should actively seek evidence that would invalidate their current situation model, not just evidence that supports it.
- Include "plan abandonment" as a first-class action in the agent's action space. If abandoning a plan is not explicitly available and rewarded, it will be systematically underselected.

## Failure Mode 2: Comprehension Failure — Perceiving Without Understanding

Jones and Endsley's (2000) study of air traffic controllers developed a situation assessment error taxonomy that identifies three levels of failure. The most dangerous — because it is the most invisible — is Level 2 failure: comprehension failure.

At Level 1, the decision-maker fails to perceive relevant cues. This is detectable in retrospect: the data was available but the agent missed it.

At Level 2, the decision-maker perceives all the relevant cues but fails to comprehend their meaning. The data is acquired correctly; the interpretation is wrong. "The main error that occurred was that controllers failed to comprehend the significance of perceived cues, rather than missing cues or making inaccurate predictions" (Jones & Endsley, 2000, cited in Zimmerman, p. 32).

At Level 3, the decision-maker correctly perceives and comprehends but makes incorrect projections about future states.

Comprehension failure is particularly dangerous because:
1. The decision-maker believes they understand the situation
2. They have correctly identified the relevant cues (so they're not obviously missing information)
3. Their subsequent planning and action are confidently based on a wrong situational model
4. There is no internal signal of failure — the decision-maker's experience of the decision is identical to the experience of a correct decision

The contributing mechanism is usually the wrong mental model: the decision-maker applies a familiar pattern to an unfamiliar situation that superficially resembles it. Jones and Endsley specify the Level 2 failure modes as using "an incorrect mental model" or relying "too heavily on default values when evaluating the perceived cues."

Zimmerman's empirical data confirmed this in law enforcement: novice officers would frequently note important cues and then not integrate them into their situational assessment. When a subject announced he "just got out of prison," many novice officers acknowledged the fact but continued with their original approach plan unchanged. They perceived the cue but did not comprehend its implications for their situation model.

**For agent systems:**
- Test agents for comprehension, not just perception. Evaluation should require agents to not only identify relevant features but to explain what those features mean in the context of the current situation.
- Build explicit comprehension checkpoints: before proceeding from assessment to action, require agents to produce a coherent situation narrative and check it for internal consistency and completeness.
- Design explicit wrong-model detectors. If an agent has applied Mental Model A to a situation, build a check that asks: "Are there any observed features that are inconsistent with Mental Model A?" Inconsistencies that cannot be explained away should trigger model revision, not be silently absorbed.
- Track the base rate of "unexpected developments" following confident situation assessments. A high rate of unexpected developments is a diagnostic indicator of systematic comprehension failure — the agent is perceiving correctly but understanding incorrectly.

## Failure Mode 3: Expectancy Bias — The Scenario That Must Unfold

A closely related but distinct failure mode is expectancy bias, described by Zimmerman as "scenario fulfillment": the tendency to interpret incoming information in ways that confirm an expected scenario, rather than evaluating it on its own terms.

Zimmerman observed this in novice officers who "entered the situation with the hypothesis that people will comply to their commands" (p. 60). When subjects did not comply, many novice officers continued their compliance-elicitation approach rather than revising their situational model to account for a non-compliant subject. The evidence was inconsistent with the hypothesis, but the hypothesis was not revised — instead, the evidence was interpreted through the lens of the hypothesis ("he'll comply if I just keep giving commands").

This is backward reasoning in Klein's framework: starting from the expected scenario and seeking evidence to confirm it, rather than starting from evidence and building the scenario that best explains it. Patel and Groen (1991) found that backward reasoning was associated with lower diagnostic accuracy in medical experts (cited in Zimmerman, p. 27). Forward reasoners — who build from evidence to hypothesis — are more accurate.

Expectancy bias interacts with the availability of familiar mental models: the more experience the decision-maker has with a particular scenario type, the more strongly they expect that type, and the more they tend to interpret ambiguous evidence as confirming it.

**For agent systems:**
- Implement forward-reasoning chains as the default architecture. Build agents that start from observed evidence, not from hypothesized conclusions.
- Create explicit hypothesis revision mechanisms. When accumulated evidence scores lower against the current hypothesis than against alternative hypotheses, force a hypothesis revision — don't just add the discrepant evidence to the log.
- Avoid commitment to scenario frames too early. The more specific and committed an agent's situational model, the more strongly it will filter subsequent evidence. Allow situational models to remain partial and provisional until sufficient evidence accumulates.
- Build adversarial checking into the reasoning process: "If my current scenario interpretation is wrong, what would I expect to see? Is any of that present?"

## Failure Mode 4: The Dangerous Middle — Competent-Stage Overconfidence

Zimmerman's data reveals an unexpected finding about the developmental arc of expertise: the competent stage may be more dangerous than either the novice stage or the expert stage.

"Competent participants tended to engage in more risky actions than did those in the other groups, either by shooting without seeing a gun pointed at them, or by tackling the subject" (Zimmerman, p. 63). This is not random — it is explained by the Dreyfus model. At the competent stage, decision-makers have learned that rigid rule-following is suboptimal and have started to break rules. But they have not yet developed the situational models that tell them *when* rule-breaking is appropriate.

The result is a dangerous combination: the confidence to deviate from procedure combined with the insufficient situational understanding to know when deviation is safe. "At earlier stages, participants are more concerned about not breaking rule or using force when it is not justified. At later stages, participants are more likely to choose options other than firing" (Zimmerman, p. 63). The competent stage is the gap: past the caution of novices, not yet at the wisdom of experts.

This pattern has obvious implications for any domain where agents operate at different points on the expertise arc: the most dangerous components are not necessarily the newest ones.

**For agent systems:**
- Do not reduce oversight at the competent stage. The behavioral signature of reduced rule-following should trigger *more* monitoring, not less.
- Distinguish confidence from calibration. A competent-stage agent may produce high-confidence outputs while having lower calibration than a novice-stage agent that appropriately reports uncertainty.
- Build explicit escalation for rule-violation decisions. When an agent proposes deviating from its trained procedures, this should trigger a review — the deviation may be expert-level flexibility or competent-stage overconfidence, and these require different responses.

## Failure Mode 5: Omission Errors — The Things Not Done

A consistent finding across NDM error research is the dominance of omission errors: failures to act rather than wrong actions. In aviation accidents, "the majority of errors made were errors of omission; meaning they failed to do something that should have been done" (Orasanu et al., 2001, cited in Zimmerman, p. 31).

This challenges the typical error taxonomy used in system evaluation, which focuses heavily on commission errors — wrong actions taken. Omission errors are often harder to detect because they leave no trace: there is no wrong output to analyze, only an absence of correct output.

In dynamic environments, omission errors are particularly severe because they compound: failing to change course at time T1 makes the situation at T2 worse, which makes the required course correction at T2 larger and more costly. The earlier the failure to act, the larger the eventual consequence.

**For agent systems:**
- Build explicit "inaction" detection. Track not just what agents do but what they fail to do. Compare agent behavior against expected-behavior baselines and flag significant deviations in either direction.
- Include omission detection in evaluation frameworks. Standard metrics that only measure correctness of outputs are insufficient — they miss the absence of required outputs.
- Create time-triggered review prompts. At predefined intervals during task execution, require agents to explicitly confirm that all expected actions for this phase have been taken. This surfaces omission errors before they compound.

## Failure Mode 6: Self-Report Blindspots — What Agents Say vs. What They Do

Zimmerman's observational data revealed a specific class of discrepancy: participants described their behavior in ways that were technically accurate but omitted key qualitative aspects. "Information about the amount of negotiation engaged in by the participant and the speed and distance at which the participant approached the subject, was generally vague in the interview reports, yet was readily observable in the videos" (p. 69).

Specifically: "some 'negotiation' was little more than yelling, 'we'll get you some help, just put the gun down.'" Participants reported negotiating; they were actually commanding. The behavioral reality and the self-description diverged in the qualitative dimensions that most mattered.

This is the introspection problem in acute form: even with structured elicitation, experts cannot reliably report on qualitative aspects of their own behavior — especially aspects they did not consciously attend to as decision-relevant. "Differences in observation and interview data do not necessarily indicate that participants incorrectly report information, instead it may indicate that these participants did not focus on these actions or did not factor them into their processing of the situation" (Zimmerman, p. 74).

**For agent systems:**
- Do not rely exclusively on agent self-reporting for performance evaluation. Build external behavioral monitoring that captures what agents actually do, not just what they report doing.
- Be specific about evaluation dimensions. Zimmerman's lesson: asking "did you negotiate?" gets a yes. Asking "at what volume and with what content did you speak to the subject?" would have surfaced the discrepancy. Evaluation questions that are specific enough to distinguish qualitatively different behaviors will catch what generic questions miss.
- Treat discrepancies between agent reports and behavioral logs as knowledge elicitation opportunities. When an agent's self-report of its reasoning process diverges from the behavioral record, this reveals a blindspot — an aspect of its processing that it does not monitor or represent. These blindspots are the targets for improved introspective capability.

## Synthesis: A Framework for Robust Failure Prevention

The failure modes above are not independent — they form a constellation. Comprehension failure sets the stage for task fixation; expectancy bias feeds comprehension failure; the competent-stage transitions create windows of overconfident deviation; omission errors compound during fixation periods; self-report blindspots prevent detection.

The systemic intervention point is situation assessment quality. Most downstream failures originate in an incorrect or incomplete situation assessment that was not detected and revised. Build situation assessment robustness as the primary failure prevention investment:

1. **Explicit situation models** — make assessments visible and revisable
2. **Completeness checks** — require all observed evidence to be accounted for
3. **Change detection** — monitor for cues that invalidate current models
4. **Hypothesis testing** — seek disconfirmation, not just confirmation
5. **Behavioral tracking** — compare intended behavior to actual behavior
6. **Escalation triggers** — when multiple failure mode indicators appear simultaneously, escalate

The NDM tradition's core insight for system design: invest in understanding the situation correctly. Everything else follows.