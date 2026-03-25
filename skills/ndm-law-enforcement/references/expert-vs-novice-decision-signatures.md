# The Novice-to-Expert Arc: Decision Signatures at Each Stage and What They Mean for Agent Development

## Why This Matters

One of the most practically useful findings in Zimmerman's research is not just that experts and novices differ, but *how* they differ at each stage of development. The Dreyfus and Dreyfus (1986) five-stage model of skill acquisition, as applied to law enforcement decision-making, provides a diagnostic framework: given an agent's or system's behavioral signature, you can identify where it sits on the development arc, predict its characteristic failure modes, and design interventions accordingly.

This has direct implications for agent systems: knowing the developmental level of an agent component allows you to route tasks appropriately, set appropriate confidence thresholds, and design training or fine-tuning interventions that match the component's current capability.

## The Five-Stage Model Applied

### Stage 1: Novice — Rule Application Without Context

The novice "recognizes objective facts about the situation and applies 'context-free' rules to the task" (Dreyfus & Dreyfus, 1986, cited in Zimmerman, p. 29). Rules are applied across situations without considering the unique aspects of the current case. Performance is often technically correct but contextually inappropriate.

**Behavioral signature**: Procedural, sequential, rule-following. Novice officers in Zimmerman's study would describe exactly what they were supposed to do at each step ("I wanted him to comply... once he showed me his hands, I would have got him in the kneeling position, hands on top of his head, and then I would have searched him"). They focus on discrete actions, not holistic assessment.

**Failure mode**: Correct procedure in wrong situation. Novices apply the traffic stop protocol to a kidnapping situation, or the armed-suspect protocol to a suicidal person, because they match surface features to the nearest procedure.

**For agents:** A novice-level agent is essentially a rule engine. It can be reliable within its trained distribution but will fail at distribution edges. The key is that it doesn't know it's failing — it simply executes the nearest rule. Novice agents need hard guardrails that prevent them from operating in domains where their rules don't apply.

### Stage 2: Advanced Beginner — Situational Rules Emerge

The advanced beginner "begins to recognize meaningful elements of specific situations" and applies basic context-specific rules (Zimmerman, p. 29). However, "while these decision makers are able to recognize important information, they may ignore the importance of these cues and may not yet be able to incorporate them into decisions."

**Behavioral signature**: Notices cues but doesn't integrate them. In Zimmerman's study, advanced beginners would say things like "something is not right" without elaborating, or acknowledge a cue ("he just got out of prison") without incorporating it into a revised situation assessment or changed action plan. They notice but don't update.

**Failure mode**: Incomplete integration. The advanced beginner perceives the signals of a changing situation but maintains the original course of action. This is the precursor to the catastrophic "task fixation" failure mode seen in expert-level errors.

**For agents:** Advanced beginner agents have better pattern recognition but poor update mechanisms. They detect anomalies but don't revise their world models accordingly. Fixing this requires not just better pattern matching, but explicit mechanisms for cue integration and belief revision.

### Stage 3: Competent — Decomposition and Planning, But Risky Transitions

The competent decision-maker "is able to decompose the situation into discrete units and assess small sets of information in order to plan courses of actions. They are more proficient at prioritizing tasks and are able to think about the situation as a whole. They begin to engage in some rule-breaking behavior" (Zimmerman, p. 29).

**Behavioral signature**: More organized, beginning to use strategy, starts simulating future states. However, competent officers in Zimmerman's study "tended to engage in more risky actions than did those in the other groups, either by shooting without seeing a gun pointed at them, or by tackling the subject" (p. 63). They break rules but lack the situational models to know when rule-breaking is appropriate.

**Failure mode**: Overconfident rule-breaking. Competent actors know that rigid procedures are suboptimal, but they haven't yet developed the situational models that tell them *when* to deviate. This produces paradoxically more dangerous behavior than the novice stage — they act boldly on incomplete situational understanding.

**For agents:** The competent stage is the most dangerous transition point in agent deployment. An agent that has learned to deviate from its training distribution without having learned the situational models that make deviation safe is a high-risk component. This is the zone where "creative" behavior becomes unreliable behavior. Agents in this zone need more human oversight, not less.

### Stage 4: Proficient — Whole-Situation Perception and Intuitive Recognition

The proficient decision-maker "is able to perceive the situation as a whole, and recognize important patterns in an intuitive manner. Rules become less important, and decision makers become more flexible and react quicker to incoming information. They focus on long-term goals and understand when situations may require different actions, however they must still analyze the situation in order to determine a course of action" (Zimmerman, p. 29).

**Behavioral signature**: Rich situational commentary. Proficient officers in Zimmerman's study would interpret cue packages into coherent situation models: "he's been in jail, he understands that if he doesn't follow our commands, we're going to progress our use of force... It does concern you because once someone like that, who knows the system, challenges you or resists you, it's probably going to be bad" (p. 56). They read meaning, not just signal.

**Failure mode**: Analysis bottleneck. Proficient actors can perceive situations holistically but still need deliberate analysis to generate action. Under extreme time pressure, this analysis step can become a liability.

**For agents:** Proficient agents are the reliable workhorses for complex, non-routine tasks. They have genuine situational understanding but are appropriately cautious about action selection. The design challenge is giving them fast enough analysis pathways to operate under time constraints.

### Stage 5: Expert — Fluid, Automatic, Holistic

The expert has "access to a broad range of mental models and large repertoire of action choices. They use mental simulation to predict events and the outcome of actions, are able to use leverage points to their advantage, and can deal with uncertainty by story-building and actively seeking information. Action becomes fluid and intuitive and decision makers have trouble describing their decision process, which have now become automatic" (Dreyfus & Dreyfus, 1986; Ross, Phillips, Klein, & Cohn, 2005, cited in Zimmerman, pp. 29-30).

**Behavioral signature**: Integrated assessment and action, with difficulty articulating the process. Expert officers in Zimmerman's study would say things like "I just caught 'family' very briefly and I thought obviously his family means something to him so that's what I'm going to go after" and then seamlessly change strategy: "What I did was drop my voice way down and started asking about his family" (p. 58). The recognition and the action are unified.

**Failure mode**: The expert's errors are rare but often catastrophic — they occur when familiar mental models are applied to situations that appear familiar but aren't, leading to confident action on a misread situation. "Inadequate decisions are usually a result of poor situation assessment rather than poor action-choice decisions" (Flin, 1996, cited in Zimmerman, p. 30).

**For agents:** Expert-level agents are the goal — but they require the broadest mental model coverage and the most robust anomaly detection. The expert's confidence is only warranted when the situation is truly familiar. A mechanism that forces even expert agents to pause when anomaly signals are strong is essential.

## Cross-Stage Patterns: What Consistently Differentiates Levels

### Cue Integration vs. Cue Enumeration

Across all stages, a consistent finding: "experienced participants provided detailed descriptions of their situation assessments, whereas novices tended to mention discrete cues with less detail about the meaning and implications of those cues" (Zimmerman, p. 56). The difference is not in *what* cues are noticed, but in whether those cues are integrated into a coherent situational model.

**For agents:** Cue enumeration is easy (list the features present). Cue integration is hard (build the story that explains all features). Agent evaluation should test not just feature detection but feature integration — can the agent explain why the features observed are consistent with a particular situation type?

### Mental Models vs. Procedural Models

The Fowlkes et al. (2000) study of helicopter pilots found that instructors focused on "strategic models (strategies for applying knowledge to current situation, state, plan, and deviations)," while students focused on "procedural models (sequence, timing of activities, aircraft position, emergency procedures)." This distinction maps cleanly to the expert-novice divide across all domains studied.

**For agents:** Agent architecture should explicitly distinguish between procedural knowledge (if X then do Y) and strategic/mental models (this type of situation calls for this class of approach, with these indicators of success and failure). Both are necessary, but the ratio should shift dramatically toward strategic models as agents become more capable.

### Forward vs. Backward Reasoning

"Experts tend to use forward reasoning whereas novices use backward reasoning" (Ericsson & Charness, 1994, cited in Zimmerman, p. 27). Forward reasoning: from observed facts, project toward hypothesis and goals. Backward reasoning: from desired goals, search backward for facts that support them.

The Patel and Groen (1991) study of medical experts found "forward reasoning to be highly correlated with diagnostic accuracy." Backward reasoning produces confirmation bias — the decision-maker finds evidence for what they already believe.

**For agents:** This maps directly to agent chain-of-thought architectures. Forward-reasoning agents build situational models from evidence upward. Backward-reasoning agents start from a likely conclusion and seek supporting evidence. The former is more reliable but requires more sophisticated pattern libraries. Agents prone to anchoring on an early hypothesis are exhibiting backward-reasoning failure.

### Updating vs. Fixating

Perhaps the most consequential difference: expert decision-makers "change their course of action in response to changes in the environment" while novices "tended to either ignore or note the changed condition but not change actions" (Zimmerman, p. 58).

This updating capability is not automatic even in experts. Weick's (2001) study of wildfire fatalities found that firefighters "died with all their equipment and tools still in hand" because they could not abandon a plan even when commanded to. Orasanu et al.'s (2001) analysis of airline accidents found that "the majority of errors made were errors of omission; meaning they failed to do something that should have been done... pilots continued with their course of action although evidence indicated that a change in action was necessary."

**For agents:** Build explicit situation-change detectors that are independent of the action-execution pipeline. An agent executing Plan A should have a parallel monitoring process asking: "Has the situation changed in ways that invalidate Plan A?" This process must be able to interrupt execution, not just flag a note for later review.

## Implications for Agent Development and Deployment

1. **Assess agent developmental level before deployment.** Using the signatures above, determine whether a given agent or component behaves like a Novice, Advanced Beginner, Competent, Proficient, or Expert in each domain area. Deploy accordingly.

2. **The Competent stage is the danger zone.** Agents that have learned to break rules but haven't learned situational judgment are the most unpredictable. Don't reduce oversight at this stage.

3. **Expertise development requires deliberate practice with feedback, not just more data.** "Outstanding performance comes about when a person has obtained domain specific skills... development of these skills occurs through repeated and lengthy exposure to a specific skill set" with feedback (Ericsson et al., 1993, cited in Zimmerman, p. 26). For agents, this means structured fine-tuning with performance feedback, not just more training data.

4. **High-performers seek more feedback.** Sonnentag's (2001) study of software developers found that "high-performers sought significantly more feedback from team leaders and coworkers." Build feedback-seeking behavior into agent post-task routines.

5. **Track the cue-integration ratio.** A diagnostic: what proportion of an agent's decision justifications mention integrated patterns vs. individual features? Low integration ratios are an early warning of novice-level operation regardless of overall performance metrics.