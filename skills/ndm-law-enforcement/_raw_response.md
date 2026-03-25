## BOOK IDENTITY
**Title**: Law Enforcement Decision Making During Critical Incidents: A Three-Pronged Approach to Understanding and Enhancing Law Enforcement Decision Processes
**Author**: Laura A. Zimmerman (Doctoral Dissertation, University of Texas at El Paso, 2006)
**Core Question**: How do expert decision makers operate in high-stakes, time-pressured, ambiguous situations — and how can that expertise be systematically understood, taught, and transferred to novices?
**Irreplaceable Contribution**: This dissertation is one of the few empirical studies to apply Naturalistic Decision Making (NDM) theory directly to law enforcement, using live simulated scenarios plus structured post-event interviews to capture real-time expert cognition. It uniquely examines decision-making about human behavior (not equipment or environment), traces the full novice-to-expert development arc with concrete behavioral examples at each stage, and introduces the "three-pronged" methodology (simulate → interview → train) as a replicable framework for surfacing and improving tacit expert knowledge in any high-stakes domain.

---

## KEY IDEAS

1. **Recognition-Primed Decision Making replaces deliberation under pressure.** Experts don't compare options — they recognize patterns, generate one plausible course of action, and mentally simulate its consequences. Only when simulation fails do they generate alternatives. This process is faster than analytic comparison and surprisingly reliable, but it depends entirely on the richness of a decision-maker's stored mental models. An agent system must replicate this architecture: pattern recognition first, option-generation only as fallback.

2. **Situation assessment, not action selection, is the core competency separating experts from novices.** Experienced officers spend cognitive resources understanding *what is happening* — interpreting cues, building coherent stories, making predictions about the subject's next move. Novices default to procedural action scripts. The failure mode is acting on a misread situation, not choosing a bad action from a correctly-read one. For agent systems: invest in situation assessment quality, not just action-selection breadth.

3. **Expertise is a five-stage developmental arc, and each stage has distinct failure signatures.** The Dreyfus model (Novice → Advanced Beginner → Competent → Proficient → Expert) predicts not just performance quality but *how* failures occur. Competent actors are paradoxically most dangerous: they begin breaking rules but lack the situational models to know when rule-breaking is appropriate. Agent systems need to know their own level on this arc and behave accordingly.

4. **Satisficing is not a failure of optimization — it is a rational strategy under real-world constraints.** The goal is not the best possible solution; it is the first solution that clears an acceptable threshold given time pressure, incomplete information, and dynamic conditions. The "quick test" (Is delay acceptable? Is error cost high? Is the situation unfamiliar?) determines whether to think or act. Agent systems need explicit stop-search rules, not unbounded optimization.

5. **Tacit expert knowledge can be systematically elicited, but only with structured, multi-pass techniques.** Experts cannot directly introspect their decision processes — but structured retrospective interviews (CDM) that use timeline reconstruction, progressive deepening, and hypothetical probing can surface the cues, mental models, and decision rules that experts cannot otherwise articulate. This is the methodology for building agent knowledge bases from human expertise.

---

## REFERENCE DOCUMENTS

### FILE: recognition-primed-decision-making-for-agents.md
```markdown
# Recognition-Primed Decision Making: How Experts Bypass Deliberation (And How Agents Should Too)

## The Core Insight

When we imagine a decision-maker in a crisis, we often picture someone rapidly comparing options — a mental scorecard filling up with pros and cons under time pressure. This is how traditional decision theory models the process, and it is almost entirely wrong for high-stakes, time-pressured environments.

The foundational discovery of Naturalistic Decision Making (NDM) research, beginning with Klein, Calderwood, and Clinton-Cirocco's landmark 1986 study of fireground commanders, was that expert decision-makers do not compare options at all. When Klein and colleagues set out to determine how many options firefighters considered before acting, they found that "the commanders would claim they 'just knew' the correct course of action. Many commanders reported that they did not make decisions at all; that there was no time for deliberation and the solution was usually obvious" (Zimmerman, p. 6).

This is not intuition as magic. It is pattern recognition as compressed expertise.

## The Three-Level Architecture of Recognition-Primed Decision Making

The Recognition-Primed Decision (RPD) model, developed by Klein et al., describes three distinct modes of operation based on how familiar or ambiguous the situation is.

### Level 1: Simple Match — Act Immediately

When the situation is familiar, the decision-maker recognizes it as a typical instance of a known category. Embedded in this recognition are:
- **Salient cues** — the features that make this instance recognizable
- **Expectancies** — what should happen next given this pattern
- **Plausible goals** — what success looks like in this situation type
- **The typical course of action** — what usually works here

From this package, the correct action becomes apparent and is implemented. No deliberation occurs because none is needed. The expert's mental model has pre-solved the problem.

**For agent systems:** This is the fast path. When a well-trained agent encounters a situation it has seen many times, it should execute the pattern-matched response without invoking expensive reasoning machinery. The design question is: how rich and well-indexed are the agent's stored patterns? A agent that must reason from scratch every time has no Level 1 capability.

### Level 2: Story-Building — Assess Before Acting

When the situation is unfamiliar or ambiguous, recognition fails. The decision-maker cannot match the current situation to a familiar pattern because "the situation is unfamiliar or ambiguous, the decision maker cannot rely on recognition; instead, they must assess and comprehend the novel aspects of the situation" (Phillips, Klein & Sieck, 2004, cited in Zimmerman, p. 11).

At Level 2, two cognitive tools are deployed:

**Feature-matching**: The decision-maker assembles observed cues and tries to match them to the closest known situation type. In the naval warfare study by Kaempf et al. (1996), 87% of situations were resolved through feature-matching, indicating that most "novel" situations can still be partially matched to prior patterns.

**Story-building**: When feature-matching fails, the decision-maker constructs a narrative that explains the available evidence. This process fills in missing information with inferences. The story must be coherent — every element must be explainable by the same underlying scenario. This concept comes originally from jury decision-making research (Pennington and Hastie, 1986, 1988), where jurors with no direct knowledge of events constructed explanatory stories from evidence. In policing and military contexts, experienced decision-makers apply the same process: "by matching mental models to the situation, decision makers are able to explain the causes of an event and predict outcomes" (Zimmerman, p. 11).

**For agent systems:** Level 2 is the domain of structured reasoning under uncertainty. The agent must have both a broad pattern library for feature-matching AND a narrative reasoning capability for story-building. Critically, the agent must know when it is in Level 2 territory — when the situation doesn't snap cleanly into a known pattern — and escalate its processing accordingly. An agent that confidently applies Level 1 responses to Level 2 situations will make the signature expert error: confident action on a misread situation.

### Level 3: Mental Simulation — Evaluate Before Committing

When the situation is understood but the best course of action is not clear, the decision-maker uses mental simulation: "they build stories to generate expectancies about what is likely to occur if they engage in a particular action and they attempt to determine if the actions will go according to plan, or if problems will arise that lead to undesired results" (Zimmerman, p. 12).

Mental simulation is forward reasoning: given what I know now, I project the execution of this action forward in time and check for failure modes. If the simulated action fails, I modify it or select another. "By envisioning what may happen, decision makers predict the course of events, identify potential problems, and create alternative action plans" (Zimmerman, p. 12).

This is not option comparison in the traditional sense. The decision-maker doesn't score Action A against Action B on multiple criteria. Instead, they test their single best candidate against anticipated reality. Only if it fails the test do they try another.

**For agent systems:** Level 3 corresponds to simulation or "pre-mortem" reasoning — the agent constructs a forward model of action consequences before committing. This is expensive but available. Agent systems should route to Level 3 when (a) situation assessment is complete but (b) the first-pass action selection feels uncertain. The key is that Level 3 evaluates one candidate at a time sequentially, not all candidates simultaneously.

## The Critical Finding: Experts Focus on Assessment, Not Action

Research across multiple domains consistently shows that "experienced decision makers focus on situation assessment more than on action choices" (Flin, 1996; Kaempf et al., 1996, cited in Zimmerman, p. 13). The Kaempf et al. study of naval warfare personnel found that officers "reported more instances of situation assessment than decisions about courses of action," and that 78% did not evaluate their action choices before implementing them.

This is counterintuitive. We expect expert decision-making to be characterized by rich option-generation and sophisticated choice. It is not. Experts trust pattern recognition to deliver a good-enough action; what they invest in is understanding the situation correctly. Novices, by contrast, focus on action — on what they are *supposed to do* procedurally — and often execute correct procedures in misread situations.

The Zimmerman study confirmed this directly: "Experienced participants focused heavily on describing their assessment of the situation, while novices focused heavily on describing their actions and the actions of the subject" (p. 53).

## What This Means for Agent Architecture

1. **Invest in pattern recognition infrastructure, not just reasoning chains.** An agent with a rich mental model library can operate at Level 1 and Level 2 efficiently. An agent without one will always be stuck at Level 3, reasoning expensively from first principles.

2. **Build explicit situation assessment as a pre-action step.** Before an agent selects an action, it should complete a situation assessment pass: What is happening? What type of situation is this? What should happen next? What is the goal? This assessment should be logged and available for retrospective review.

3. **Design for sequential option testing, not parallel option comparison.** The RPD model suggests that satisficing — finding the first acceptable option — is more computationally appropriate than optimization. Agent action selection should test the most plausible action, simulate its consequences, and only generate alternatives if the simulation fails.

4. **Know which level of the RPD model you're in.** This requires meta-cognition: is the situation familiar (Level 1)? Ambiguous but structurable (Level 2)? Clear but uncertain about action (Level 3)? Different routing through the agent's capabilities should follow from this assessment.

5. **Treat "I just knew" as an elicitation problem, not a mystery.** Expert intuition is decomposable. The pattern cues, expectancies, and mental models that drive recognition-primed decisions can be surfaced through structured retrospective analysis and encoded into agent knowledge bases. The RPD model is both a description of expert cognition and a specification for what agents need to replicate it.

## Boundary Conditions

The RPD model works well when:
- The decision-maker has domain-specific experience to draw on
- The situation, while stressful, belongs to a recognizable category
- Time pressure genuinely prohibits option comparison

It fails when:
- The situation is genuinely novel (no applicable patterns exist)
- The decision-maker's mental models are wrong (confidently misread situations)
- The domain involves predicting human behavior rather than physical systems (Shanteau, 1992, found significantly worse performance in behavior-prediction domains)

For agent systems, the last point is critical: human behavioral prediction is harder than physical system prediction, and agents operating in human-facing domains should expect lower pattern-match reliability and invest more heavily in Level 2 story-building and Level 3 simulation.
```

---

### FILE: expert-vs-novice-decision-signatures.md
```markdown
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
```

---

### FILE: satisficing-and-the-quick-test.md
```markdown
# Satisficing and the Quick Test: How Intelligent Systems Should Decide When to Think and When to Act

## The Foundational Problem

Every intelligent system operating under real-world conditions faces a paradox: the situations that most demand careful deliberation are precisely the situations that most severely constrain the time available for deliberation. Time pressure, high stakes, incomplete information, and dynamic conditions are not independent variables — they co-occur in the most consequential decisions.

Traditional decision theory resolves this by abstracting away time constraints and assuming the decision-maker can evaluate all alternatives against all criteria. This produces optimal decisions in theory and useless advice in practice.

Zimmerman's research, drawing on the NDM tradition, offers a better framework: **satisficing combined with explicit stop-search rules.** Together, these concepts tell an intelligent system both what to look for (the first acceptable option, not the best option) and when to stop looking (as soon as an option clears a threshold, unless specific conditions justify further analysis).

## Satisficing: The Logic of "Good Enough"

Herbert Simon's concept of satisficing describes decision-making that "lead[s] quickly to satisfying outcomes [that] allow for resolutions that may not be optimal, but are nonetheless acceptable" (Simon, 1990, cited in Zimmerman, p. 13). In time-limited, dynamic environments, "the optimal solution may not be attainable given the task constraints, and if the situation is dynamic, the optimal solution may change as events unfold, leaving the decision maker to redefine goals and reconsider the acceptableness of the outcome possibilities" (Gigerenzer & Todd, 1999; Simon, 1990, cited in Zimmerman, p. 13).

The logic of satisficing is not sloppiness — it is rational adaptation to real constraints. Goodrich, Stirling, and Boer (2000) state that "finding a 'good enough' solution entails weighing the costs and benefits of each option under consideration. When reaching a solution that satisfices, particularly in time-pressured situations that have unclear parameters and are dynamic, the costs of continuing to search may outweigh the costs of stopping" (cited in Zimmerman, p. 13).

Simon's scissors metaphor captures the essential structure: satisficing requires both "the structure of the task environment" and "the computational capabilities of the decision maker." Optimal satisficing — the fastest path to an acceptable solution — requires the decision-maker to read the environment accurately (what does "acceptable" mean here?) and apply the appropriate level of cognitive effort.

**For agent systems:** Satisficing has two design implications. First, agents need explicit *acceptability thresholds* for each class of task — not "find the best solution" but "find a solution that meets criterion X at cost Y." Second, agents need *dynamic threshold adjustment* — what counts as acceptable changes as the situation evolves, resources deplete, or time pressure increases.

## The Error Continuum: Reframing "Success"

Traditional evaluation frameworks ask: did the decision-maker choose the optimal option? The NDM framework replaces this binary with a continuum: "decision makers evaluate errors on a continuum from optimal to worst-case (often fatal) outcomes" (Zimmerman, p. 31).

The distinction matters enormously for how we evaluate and design intelligent systems. Weiss and Shanteau (2004) "make the differentiation between experts' evaluations of errors and researchers' evaluations of errors. They state that while experts try to avoid big mistakes, researchers tend to search for the 'correct answer.' Experts show little concern for minor deviations from the optimal outcome, but researchers find deviations from optimality a major source of concern" (cited in Zimmerman, p. 32).

The practical implication: an agent that reliably avoids worst-case outcomes while frequently missing the optimum is performing well by expert standards. An agent that occasionally achieves the optimum but also occasionally produces catastrophic outcomes is performing poorly by expert standards, even if its average outcome is higher.

**For agent systems:** Evaluate agents on the distribution of outcomes, not the mean. An agent with a lower mean outcome but a shorter left tail (fewer catastrophic failures) is often preferable for high-stakes applications to an agent with a higher mean but fat left tail. The error continuum framework demands robust evaluation, not just average-case evaluation.

## The Quick Test: A Three-Question Decision Gate

Cohen, Freeman, and Wolf (1996) developed the "quick test" as a practical mechanism for deciding whether a decision-maker should act immediately or invest time in "critiquing and correcting" — evaluating and refining the current plan before execution.

The quick test consists of three questions:
1. **Is the cost of delay acceptable?**
2. **Is the cost of an error high?**
3. **Is the situation unfamiliar or problematic?**

The routing logic: "If the answer to any one of these questions is 'no' then the decision maker engages in immediate action. If the answer to all of these is 'yes' then the decision maker engages in critical thinking" (Cohen et al., 1996; Cohen et al., 1998, cited in Zimmerman, pp. 14-15).

The elegance of this framework is that it converts a meta-decision ("should I think more?") into a three-question structured test that can be answered quickly. It is itself a satisficing strategy for the meta-decision about whether to engage in deeper analysis.

### Unpacking the Three Questions

**Is the cost of delay acceptable?**
This is not "do I have time?" but "what happens if I take more time?" In some situations, delay is neutral — the problem persists while you think. In others, delay itself causes harm — the opportunity closes, the situation deteriorates, the adversary acts first. If delay is costless, there is no reason to act without full analysis. If delay is costly, even imperfect analysis must eventually yield to action.

**Is the cost of an error high?**
This question calibrates risk tolerance. High error costs mean the wrong action is worse than no action, which favors more deliberation before commitment. Low error costs mean that even a wrong action can be corrected, which favors faster action with course-correction. Note that this interacts with reversibility: an irreversible action with high error cost demands maximum pre-action analysis. A reversible action with low error cost can be taken immediately and corrected if needed.

**Is the situation unfamiliar or problematic?**
This question triggers the expert's anomaly detection. If the situation fits a familiar pattern (Level 1 RPD), additional analysis adds little — the mental model already contains the relevant information. If the situation is genuinely novel or contains anomalous elements, the mental model may not apply, and additional analysis is warranted.

The logical structure is:
- If ANY answer is "no" (delay is costless, OR errors are cheap, OR the situation is familiar) → the cost of further deliberation exceeds its benefit → act on current best judgment
- If ALL three answers are "yes" (delay is costly AND errors are expensive AND the situation is novel) → the cost of acting without further deliberation is high enough to justify additional analysis → think before acting

## Applying the Quick Test to Agent Orchestration

In a multi-agent system, the quick test operates at multiple levels simultaneously.

**At the task level:** Before an agent begins a complex subtask, the quick test should run: Is time-to-completion critical? Can errors be corrected? Is this task type within the agent's trained distribution? The answers should determine how much pre-task planning to do before beginning execution.

**At the action level:** Within a task, as an agent considers each action step, a lightweight version of the quick test should run: Is acting now vs. gathering more information the right call? The quick test prevents both premature action (when more information would genuinely improve the decision) and analysis paralysis (when additional information would not change the decision).

**At the coordination level:** In multi-agent orchestration, the quick test determines when to escalate vs. proceed. An orchestrator receiving a partial result from a subagent should ask: Is waiting for a better result acceptable? Is the cost of using this imperfect result high? Is this situation outside the expected parameter space? These questions determine whether to accept the current result, request revision, or escalate to a more capable agent.

## The Critique-and-Correct Loop

The Cohen et al. Recognition/Metacognition (R/M) model introduces a more detailed version of the quick test logic: after initial situation recognition, the decision-maker engages in a critique-and-correct loop that evaluates the current plan against available evidence, looks for incomplete or conflicting information, and makes corrections before commitment.

This loop is terminated by the quick test: "if the costs [of critiquing and correcting] outweigh the benefits, the decision maker will take action without critical assessment" (Zimmerman, p. 14).

The critique-and-correct loop has a natural analog in agent systems: chain-of-thought reasoning, plan validation, adversarial self-checking ("what would need to be true for this plan to fail?"). These are all implementations of critiquing and correcting. The quick test determines when to run them.

**Critical design principle:** The critique-and-correct loop must have a time budget. An agent that critiques indefinitely is not sophisticated — it is stuck. The quick test provides the exit condition.

## Satisficing vs. Optimization: A Deeper Point

The choice between satisficing and optimizing is not simply a performance tradeoff — it reflects fundamentally different assumptions about the environment.

Optimization assumes: the problem is stable, all options are available simultaneously, and the cost of analysis is negligible compared to the benefit of finding the best option.

Satisficing assumes: the problem is dynamic, options appear sequentially, and analysis itself consumes resources (time, attention, energy) that have opportunity costs.

In most real-world agent deployment contexts, the satisficing assumptions are correct. The agent operates in a dynamic environment, options are generated sequentially (not pre-enumerated), and analysis time has real costs. Under these conditions, "finding an optimal solution... could be too costly compared to the benefits of selecting the option that is good enough" (Zimmerman, p. 13-14).

**The deeper design principle:** Build agents that satisfice efficiently, not agents that optimize exhaustively. The former will outperform the latter in almost every real-world deployment context.

## Boundary Conditions: When Satisficing Fails

Satisficing is not always the right strategy. It fails when:

1. **The acceptability threshold is wrong.** If the agent's threshold for "good enough" is miscalibrated — too high (misses acceptable solutions) or too low (accepts terrible solutions) — satisficing produces consistent errors. Threshold calibration is as important as the satisficing mechanism itself.

2. **The first option generated is systematically biased.** The RPD model generates actions in order of plausibility — the most pattern-matched option first. If pattern matching is biased, the first option will be wrong, and satisficing will accept it too quickly. Anti-bias mechanisms need to operate on the pattern library, not on the search process.

3. **The situation is stable and analysis is cheap.** When time pressure is genuinely low and deliberation is cheap, satisficing sacrifices solution quality unnecessarily. The quick test's first question ("Is the cost of delay acceptable?") guards against this: if delay is free, don't satisfice.

4. **Errors are catastrophic and irreversible.** Satisficing accepts "good enough" — but if the gap between good enough and worst-case is catastrophic, the expected cost of satisficing may be higher than the expected cost of exhaustive optimization. High-stakes, irreversible decisions warrant more deliberation even under time pressure.
```

---

### FILE: situation-assessment-as-the-critical-skill.md
```markdown
# Situation Assessment as the Core Competency: Why Getting the Picture Right Matters More Than Choosing the Right Action

## The Central Inversion

Most people's mental model of expert decision-making focuses on choice: the expert sees the options clearly and selects the best one. The NDM research tradition, and Zimmerman's empirical study, reveals that this model is inverted. The expert's primary cognitive investment is not in choosing — it is in understanding. The action follows almost automatically from a correct situational assessment.

"Research has generally found that experienced decision makers focus on situation assessment more than on action choices" (Flin, 1996; Kaempf et al., 1996, cited in Zimmerman, p. 13). And the error literature confirms the mirror image: "inadequate decisions are usually a result of poor situation assessment rather than poor action-choice decisions" (Flin, 1996, cited in Zimmerman, p. 30).

This is not just an academic finding — it is an architectural directive. If you want an agent to make better decisions, invest in situation assessment capability, not in richer option spaces or more sophisticated choice mechanisms.

## What Situation Assessment Actually Is

Situation assessment is not simply "taking in information." Endsley's three-level framework, referenced throughout the NDM literature and applied in Zimmerman's analysis of air traffic controller errors, defines situation assessment as:

**Level 1 — Perception of elements in the environment:** What is actually present and happening? This is raw data acquisition: seeing the cues, hearing the sounds, reading the signals. Error at this level: failing to notice relevant elements, or misperceiving what is there.

**Level 2 — Comprehension of their meaning:** What do these elements, taken together, mean? This is where pattern recognition and mental models operate. The decision-maker interprets the perceived elements in the context of prior experience. Error at this level: the most common expert error — "the main error that occurred was that controllers failed to comprehend the significance of perceived cues, rather than missing cues or making inaccurate predictions" (Jones and Endsley, 2000, cited in Zimmerman, p. 32). Perceived correctly, understood incorrectly.

**Level 3 — Projection of future state:** Given what is happening now, what will happen next? This is mental simulation applied to situation understanding rather than action selection. Error at this level: using an incorrect mental model to extrapolate, or over-projecting current trends.

Each level depends on the previous one. You cannot comprehend what you have not perceived. You cannot project what you have not comprehended. Expert errors at Level 2 are particularly insidious because they feel like confident, competent reasoning — the expert perceives all the cues, constructs a coherent story, and projects a future state, all without realizing that the story is wrong.

## The Mental Model: The Engine of Comprehension

At the heart of situation assessment is the mental model — "a mental representation of the decision task" that "help[s] decision makers describe, explain, and predict the situation" (Goodrich et al., 2000; Rouse & Morris, 1986, cited in Zimmerman, p. 23).

Mental models provide the context within which cues acquire meaning. A number reading "7.4" means nothing without a mental model that tells you whether this is a pH level (dangerous alkaline), a blood oxygen saturation (catastrophically low), a rating on a scale of 10 (moderately good), or a magnitude on the Richter scale (devastating earthquake). The raw perception is identical; the comprehension is entirely determined by the mental model applied.

"Because experts have these mental models, they are able to perceive situations more efficiently and respond faster than novices who must filter through every bit of information before assessing and acting on the situation" (Klein, 1998, cited in Zimmerman, p. 24). The mental model is not a shortcut that sacrifices accuracy — it is a pre-structured template that makes accurate perception possible in real time.

### Types of Mental Models

The Fowlkes et al. (2000) study of helicopter pilots distinguishes three types:

- **Declarative models**: concepts, facts, rules — what things are
- **Procedural models**: sequences, timings, positions, emergency procedures — what to do
- **Strategic models**: strategies for applying knowledge to current situations, including the current state, plan, and deviations from expected patterns

Novices use declarative and procedural models. Experts use strategic models. The strategic model is not just "know the facts and know the procedure" — it is "know how to apply what you know to this specific evolving situation, and notice when reality deviates from expectation."

**For agent systems:** This hierarchy maps to knowledge representation. Declarative knowledge = facts and entity properties. Procedural knowledge = workflow and task sequences. Strategic knowledge = meta-level understanding of when and how to apply the other two. Most agent knowledge bases are strong on declarative and procedural knowledge. Strategic knowledge — the condition-sensitive, context-aware application logic — is the gap.

## The Feature-Matching vs. Story-Building Distinction

When cues are sufficient to match a familiar pattern, experts use feature-matching: they compare the observed set of cues against known situation types and select the closest match. Kaempf et al.'s naval warfare study found that 87% of situation assessments were accomplished through feature-matching (cited in Zimmerman, p. 12). This is fast, reliable, and the backbone of expert performance.

When cues are insufficient or contradictory, experts switch to story-building: they construct a narrative explanation that accounts for all observed evidence. "By matching mental models to the situation, decision makers are able to explain the causes of an event and predict outcomes. Building stories is necessary when there is not enough information available to match features to internal representations" (Zimmerman, p. 11).

Story-building has its roots in Pennington and Hastie's jury research, where jurors without direct knowledge of events constructed coherent narratives from evidence fragments. The key properties of a valid story: it is internally consistent (no unexplained contradictions), it accounts for all observed evidence, and it generates testable predictions about what else should be true.

**The diagnostic question for a built story:** "Does this story account for every element in the environment?" If the answer is yes, the story is credible. If some elements remain unexplained, either the story is wrong or there are unexplained anomalies — both of which should trigger further assessment.

**For agent systems:** Story-building is the natural language analog of abductive reasoning — inference to the best explanation. Agents should be designed to explicitly construct situation narratives in ambiguous cases, rather than defaulting to the nearest pattern match. The quality of the story — its coherence, completeness, and predictive power — is a proxy for situation assessment quality.

## Expert Situation Assessment in Practice: The Behavioral Signatures

Zimmerman's empirical data provides concrete behavioral markers of high-quality situation assessment. Experienced officers:

**Provided interpretive descriptions, not just observational ones.** Rather than "he was nervous," experienced officers would say: "he's nervous, like fidgeting, crossing arms, looking around, wringing hands" (pilot study, Zimmerman, p. 50) — and then explain the probable causes and implications of that nervousness. The observation leads to interpretation, which leads to prediction.

**Applied mental models to explain and predict.** An expert officer, seeing a subject become irrational despite having a gun pointed at him, concluded: "he was going to try and make me shoot him, it wasn't going to end very quickly" (Zimmerman, p. 54). This is a complete mini-situational model: diagnosis (irrational, suicidal by cop), prediction (prolonged standoff), and implied goal revision (no quick resolution).

**Integrated novel cues into revised assessments.** When the subject mentioned just getting out of prison, experienced officers didn't just note the fact — they incorporated it into their whole situational model: "he's on parole so he's a convicted felon... I've even said before 'you know the game' and they're like 'ya.' It does concern you because once someone like that, who knows the system, challenges you or resists you, it's probably going to be bad" (Zimmerman, p. 56-57). The cue becomes evidence that updates the situational story.

**Used mental simulation for situation understanding, not just action selection.** Expert officers would explain environmental elements by simulating what must have happened: "there wouldn't be a knife laying in the center of the floor of a vacant warehouse... there is a good chance that a female student was carrying her backpack with her. In a public place, probably the easiest way to get control of somebody would be with a knife without drawing so much attention" (Zimmerman, p. 59). The backpack and knife are not just observations — they are evidence that constrains the situational story.

**Continuously self-evaluated their approach.** The Pliske et al. (2004) study of weather forecasters found that highly skilled forecasters "tended to evaluate their approach to the task continuously, while lower-skilled weather forecasters did not tend to engage in these self-reflective activities" (cited in Zimmerman, p. 24-25). Self-evaluation is a real-time check on situation assessment quality.

## The Catastrophic Failure Mode: Fixation on Initial Assessment

The most dangerous expert error is not choosing the wrong action — it is failing to update the situation assessment when the situation changes.

Weick's (2001) case study of wildfire fatalities demonstrated this with harrowing clarity: firefighters died with all their equipment in hand because they could not abandon their initial plan even when their situation had fundamentally changed. They did not fail to choose a better action — they failed to perceive that the situation had changed in ways that invalidated their current action.

"It is not usually initial assessments of the situation that are faulty, instead it is inadequate assessments of changing situations that result in disastrous outcomes. As the situation changes, decision makers sometimes fail to take the significance of the changes into account, leading them to remain on their chosen course of action" (Zimmerman, p. 30).

This is the Orasanu et al. finding in aviation: "the majority of errors made were errors of omission; meaning they failed to do something that should have been done" — specifically, they failed to change course when evidence demanded it. "The pilots inadequately assessed the situation, relying instead on familiar mental models to guide them through the situation" (Zimmerman, p. 31).

**The failure mechanism:** The initial situation assessment creates an expectational framework. As the situation evolves, incoming cues are interpreted through this framework. Cues consistent with the framework are noticed and incorporated. Cues inconsistent with the framework are noticed but not fully integrated — they are explained away, attributed to noise, or simply not processed into the current situational model. The decision-maker remains on the original course because their situational model says they should be.

**Jones and Endsley's error taxonomy** (from the air traffic control study, cited in Zimmerman, p. 32) provides the structured version:
- Level 1 error: fail to observe data, or misperceive it
- Level 2 error: use incorrect mental model, or rely too heavily on default values
- Level 3 error: lack proper mental model for projection, or over-project current trends

**For agent systems:** Build change detectors that are independent of the current situation model. An agent that is executing based on Assessment A needs a parallel process monitoring for cues inconsistent with Assessment A. When inconsistent cues accumulate past a threshold, this process should trigger reassessment — not just note the discrepancy and continue. The reassessment mechanism must be able to interrupt execution, not just add a note to the log.

## The Unique Challenge of Predicting Human Behavior

Most NDM research domains involve decision-making about physical systems: fire behavior, aircraft systems, weather patterns, naval vessel movements. These systems are complex but follow physical laws. Human behavior is categorically more unpredictable.

"The ability to assess and predict human behavior is vastly more complex than predicting the behavior of non-human entities. Humans interact socially and interpret intentions and actions based on their own previous experiences, their emotions before and during the event, their mental state, personality traits, and previous knowledge or misinformation" (Feldman, 2004; Forsythe, 2004, cited in Zimmerman, p. 22).

Shanteau (1992) confirmed this empirically, finding that decision-makers in human-behavior domains (clinical psychologists, court judges, parole officers) perform significantly worse than decision-makers in physical-system domains (weather forecasters, test pilots, chess masters) — even with equivalent expertise. The task characteristics of human behavior prediction (dynamic, unique, unpredictable, limited decision aids and feedback) systematically undermine performance.

**For agent systems:** Agents operating in domains that require predicting or assessing human behavior — user intent, adversary strategy, social dynamics — should be designed with explicit uncertainty budgets that are wider than in physical-system domains. Confidence calibration for human behavior prediction is harder, and overconfidence in this domain is especially dangerous. The novel finding in Zimmerman's study — that police officers "used tactics aimed at manipulating the thought processes of the subject" (p. 71), actively shaping the decision environment — suggests an additional capability: agents in human-interactive domains should not just assess the situation but consider how their own actions change the human's situational assessment.

## Design Principles for Agent Situation Assessment

1. **Make situation assessment an explicit, separable phase.** Before action selection, require agents to construct and log a situation assessment: what type of situation is this, what are the key cues, what story best explains them, what should happen next?

2. **Test story completeness.** A situation assessment is incomplete if any observed elements are unexplained. Build explicit completeness checks: "Are there any cues in the environment that my current story does not account for?"

3. **Distinguish perception from comprehension from projection.** An agent can fail at any level of Endsley's hierarchy. Errors at Level 2 (comprehension) are particularly subtle because the raw data is correctly observed. Evaluate agents at each level separately.

4. **Build parallel monitoring for situation change.** Current action execution should always be accompanied by a monitoring process that asks: "Is the situation still what I think it is?" This process needs independent trigger conditions that can interrupt execution.

5. **Calibrate confidence in proportion to mental model match quality.** When the situation closely matches a known pattern, high confidence in the situational assessment is warranted. When the situation is novel, conflicting, or partially matched, confidence should be explicitly reduced and the assessment flagged as provisional.

6. **Widen uncertainty budgets for human behavior domains.** Agents predicting human behavior should maintain wider priors and update more cautiously than agents operating in physical-system domains.
```

---

### FILE: tacit-knowledge-elicitation-for-agent-knowledge-bases.md
```markdown
# Eliciting Tacit Expert Knowledge: The CDM Method and Its Application to Building Agent Knowledge Bases

## The Knowledge Elicitation Problem

The central challenge in building expert agent systems is not architecture — it is knowledge. Experts possess vast amounts of domain knowledge that is genuinely effective in practice, but most of this knowledge is tacit: it is not written down, not consciously accessible to the expert, and not easily transferable through direct instruction.

When firefighters, pilots, or police officers are asked why they made a particular decision, they frequently cannot explain. They "just knew," their "gut told them," or "it was obvious." This is not evasion — it is accurate reporting of the phenomenology of expert decision-making. The expert's knowledge is proceduralized to the point of automaticity, running outside conscious awareness as fast parallel processing rather than slow serial reasoning.

The practical problem: you cannot put into an agent what you cannot get out of a human. If expert knowledge cannot be elicited, it cannot be encoded.

The solution developed by NDM researchers, and applied by Zimmerman to law enforcement, is the Critical Decision Method (CDM): a structured retrospective interview technique designed specifically to surface tacit expert knowledge in a form that can be captured, analyzed, and applied.

## Why Standard Elicitation Fails

Before describing what the CDM does, it helps to understand what goes wrong with simpler approaches.

**Direct introspection fails.** Experts cannot report on their cognitive processes by simply being asked about them. Nisbett and Wilson (1977) demonstrated that people "do not have access to their cognitive processes" and will "make implicit assumptions based on a priori theories about their responses to stimuli" (cited in Zimmerman, p. 18). When asked "why did you do that?", experts produce plausible-sounding post-hoc rationalizations that may not reflect the actual process.

**Observation without probing fails.** Watching experts work provides behavioral data but not cognitive data. "Observations require interpretation of behaviors but do not provide insight into internal processes" (Cooke, 1994, cited in Zimmerman, p. 19). The researcher sees what the expert does but not why, what they noticed, what they expected, or what alternatives they considered.

**Think-aloud methods partially fail.** Having experts verbalize their thinking in real time can work for some tasks, but "real-time reporting methods... may result in inadequate information elicitation, especially if the expert is involved in a complex task that has high cognitive demands" (Cooke, 1994; Ericsson & Simon, 1993, cited in Zimmerman, p. 19). In high-stakes, high-tempo situations, the expert cannot simultaneously perform and narrate. Demanding narration may also interfere with performance.

**Unstructured interviews fail.** Without specific probing, experts default to high-level procedural descriptions: "I assessed the situation and responded appropriately." This is accurate but not useful. Structured, semi-structured interviews that use specific cognitive probes produce dramatically more useful information: in a firefighting study, "those in the structured interview condition reported more information about the cues they attended to compared to those in the unstructured interview condition. The information obtained was more specific, more detailed, and more often linked to specific actions and plans" (Crandall, 1989, cited in Zimmerman, p. 17).

## The CDM Architecture: Five Steps, Three Sweeps

The Critical Decision Method is a semi-structured interview technique using "a four-step knowledge elicitation process to capture the knowledge of domain experts in real-world situations" (Hoffman et al., 1998, cited in Zimmerman, p. 17). In Zimmerman's implementation, this becomes a five-step process with three distinct information-gathering sweeps.

### Step 1: Incident Recall — Establishing the Baseline

The expert recounts the episode in its entirety, from beginning to end, without interruption. The interviewer listens actively but does not ask questions. The purpose is threefold: (1) to establish the basic factual structure of the incident, (2) to activate the expert's memory through uninterrupted narration, and (3) to identify the narrative structure — where the story pauses, where it accelerates, where the action changes — which indicates decision points.

**Key interviewing principle:** The interviewer maintains "encouraging body language and verbal indicators" to convey interest without directing the narrative. Interrupting the expert's memory reconstruction damages it.

### Step 2: Incident Retelling — Building Shared Understanding

The interviewer tells the story back to the expert "using the participant's phrasing and terminology." The purpose is to establish a shared factual baseline and to give the expert the opportunity to correct misunderstandings, fill in gaps, and add details.

**Critical technical point:** "Mismatching will interfere with their mental representation and hinder recall. Instead, mirror their account, which will assist in memory retrieval." The CDM relies on the expert's memory being actively engaged throughout the interview. Using the expert's language rather than the interviewer's maintains the mental context that keeps the memory accessible.

### Step 3: Timeline Verification and Decision Point Identification — Structural Mapping

The interviewer and expert work together to construct an explicit timeline of the incident, identifying "key events and points when decisions were made and actions were taken." Decision points are moments when "a major shift in assessment of the situation took place or where the participant took an action that influenced the outcome of events."

Not all actions are decision points in the CDM sense. Purely procedural actions — things any officer would do in any similar situation — are not the focus. The focus is on "decisions made when participants had to evaluate an ambiguous situation and choose a course of action from among multiple options." These are the moments of genuine expert cognition, where tacit knowledge is most actively engaged.

### Step 4: Progressive Deepening — Cognitive Archaeology

This is the core of the CDM. Using the timeline as a scaffold, the interviewer returns to each identified decision point and asks probe questions that dig progressively deeper into the expert's cognitive processing.

The probe questions target:
- **Cues**: "What were you seeing, hearing, smelling? What specific factors led to your interpretation?"
- **Concerns**: "What concerns did you have at this point? What was your stress level?"
- **Goals**: "What were your specific objectives at this time? What were you trying to achieve?"
- **Basis of choice**: "Why was this option selected? Why were other options rejected?"
- **Mental modeling**: "Did you think of the events that would unfold? Did you imagine the possible consequences?"
- **Expectations**: "What outcome did you expect? What did you think would happen next?"
- **Reasoning rules**: "Is this always the case? Under what conditions would you do it differently?"

**The guiding heuristic:** Whenever the expert says "I just knew," "my gut told me," or "it was obvious" — probe immediately. These phrases signal automatized expert knowledge that the interview technique is designed to surface. "Let natural questions that arise, and curiosity guide the questioning."

**The depth standard:** "By the end of step four, the interviewer should have a detailed, specific, and complete picture of each segment of the event and of the overall incident." Not just *what* happened, but *what the expert knew, when they knew it, how they knew it, and what they did with what they knew.*

### Step 5: "What-If" Queries — Boundary Condition Mapping

The final sweep uses hypothetical modifications to the incident to map the boundaries of the expert's knowledge. The interviewer poses changes to the scenario and asks how the expert would have responded differently.

Types of what-ifs:
- **Error introduction**: "Suppose that when you did X, the victim was injured — what would that have changed?"
- **Assumption testing**: "What if the suspect's nervous behavior was not due to deception but to physical illness?"
- **Expectancy violations**: "What if, instead of quiet when you arrived, you heard screaming?"
- **Experience level probing**: "What would a less experienced officer have done differently at this point? What cues might they have missed?"

The what-if sweep serves two functions: it reveals the conditions under which the expert's typical response would change (boundary conditions on mental models), and it surfaces alternatives that were considered and rejected, revealing the expert's option-evaluation process.

## The Three-Sweep Structure: Why Multiple Passes Work

The CDM uses multiple passes through the same incident not to gather more information but to gather deeper information at each pass. Each pass serves a different function:

**Pass 1 (incident recall):** Establishes the narrative frame, activates memory
**Pass 2 (retelling):** Confirms understanding, catches major gaps
**Pass 3 (timeline verification):** Structures the narrative into analyzable segments with identified decision points
**Pass 4 (progressive deepening):** Extracts cognitive content at each decision point
**Pass 5 (what-ifs):** Maps boundary conditions and reveals counterfactuals

The multi-pass structure works because "the CDM enhances recall by providing participants with multiple opportunities to recount the event, thus reinstating context in a slow and systematic manner" (Zimmerman, p. 36-37). Each retelling is not merely repetition — it reinstates mental context that makes previously inaccessible memories accessible. Research on context-dependent memory confirms that "mentally reinstating context can be as effective as physically returning to the location of the original incident" (Krafka & Penrod, 1985; Smith, 1988, cited in Zimmerman, p. 44).

## Validating CDM Data: The Triangulation Principle

A consistent concern in verbal report methods is accuracy. Retrospective accounts may be distorted by post-hoc rationalization, selective memory, or motivated reasoning. The CDM addresses this through several mechanisms.

**Triangulation**: Zimmerman's study used video recordings of the simulated scenarios to crosscheck interview data. "Participants' verbal reports were highly consistent with the observational data. Particularly, the conversation details and environmental cues reported by participants were reflected in the videos" (p. 69). Where discrepancies existed — such as participants understating how quickly or aggressively they approached a subject — these were themselves informative, revealing elements of the event that participants did not consciously process as decision-relevant.

**Internal consistency checking**: The multi-sweep structure of the CDM creates multiple opportunities for the expert to contradict themselves or fill in gaps inconsistently, which the interviewer can probe.

**Expert validation**: Zimmerman used subject matter experts who were not study participants to review and validate scenario design and coding categories. This provides external anchoring for the knowledge categories extracted.

**The appropriate epistemic position:** CDM produces *accurate verbal reports of cognitive content* — the cues noticed, the mental models applied, the goals pursued. It does not produce accurate reports of *meta-cognitive process* — why the decision-maker reasoned as they did at a neurological or computational level. These are different questions, and confusing them leads to unfair criticism of the method.

## From CDM Output to Agent Knowledge Base: The Translation Problem

The CDM produces richly structured qualitative data: decision points with associated cues, interpretations, expectancies, goals, and action rationales. Converting this into an agent knowledge base requires a translation process.

**Decision requirement tables**: "Researchers use decision requirement tables to categorize the cognitive demands of given tasks. Typically, each decision requirement table centers around one decision requirement and describes the cognitive components that contribute to that decision, such as the critical decisions and judgments necessary to that decision, the challenges and cues unique to that decision, and the strategies employed by the decision makers" (Phillips et al., 2001; Wong & Blandford, 2001, cited in Zimmerman, p. 77). These tables provide structured, analyzable representations of expert knowledge at each decision point.

**Pattern libraries**: The cues and cue-combinations that trigger recognition at Level 1 of the RPD model can be encoded as pattern libraries. Each pattern links a set of observable features to a situation type, a set of expectancies, and a typical course of action.

**Situation assessment rubrics**: The story-building logic at Level 2 can be encoded as structured reasoning templates: given this set of cues, what stories are consistent with them, and what additional evidence would distinguish between stories?

**Mental simulation scripts**: The forward-reasoning chains used at Level 3 can be encoded as "if I take action X in situation of type Y, the likely consequences are Z" templates, with associated monitoring conditions.

**The limit of CDM-based knowledge extraction**: CDM is best at extracting knowledge about *the expert's current practice* — how they currently perceive, interpret, and respond. It is less good at extracting knowledge about *what the expert should do in situations they have rarely or never encountered*. For novel situations, the expert's what-if responses are useful but speculative. Agent knowledge bases should be explicitly marked for coverage — where knowledge comes from real expert experience vs. extrapolation.

## Implications for Ongoing Agent Learning

The CDM framework suggests a model for ongoing agent knowledge development that goes beyond one-time knowledge elicitation.

**Post-incident interviews for agents**: After an agent completes a complex task — especially one that required non-routine decisions — a structured retrospective analysis should be conducted: what signals indicated the situation type? What interpretation was applied? What alternative interpretations were considered? What actions were taken and why? This creates an ongoing CDM-like process that continuously enriches the agent's knowledge base.

**High-performer feedback seeking**: Sonnentag's (2001) finding that high-performing software developers "sought significantly more feedback from team leaders and coworkers" (cited in Zimmerman, p. 28) suggests that agents should be designed to actively seek feedback, not just receive it when offered. Build feedback-seeking as a standard post-task behavior.

**Experience bank accumulation**: "It is possible to develop or expand mental models simply by hearing other people's stories" (Zimmerman, p. 69). Agents can accumulate vicarious experience — not just their own task completions but documented patterns from other agents, case studies, and retrospective analyses — to expand their pattern libraries beyond direct experience.

**The critical design principle**: Knowledge elicitation is not a one-time event before deployment — it is an ongoing process that should continue throughout an agent system's operational life. Treat every complex task as a knowledge elicitation opportunity, and build the retrospective analysis infrastructure to capture it.
```

---

### FILE: failure-modes-in-high-stakes-dynamic-systems.md
```markdown
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
```

---

### FILE: uncertainty-acceptance-and-information-seeking.md
```markdown
# Uncertainty Acceptance and Strategic Information Seeking: How Expert Systems Operate Without Complete Information

## The Fundamental Challenge

Every intelligent system operating in the real world faces a version of the same problem: the information needed to make the best decision is not fully available, may never become fully available, and waiting for it may itself be costly or impossible. The question is not whether to act under uncertainty — it is how.

Traditional decision theory has long studied decision-making under uncertainty, but typically treats uncertainty as a quantifiable property (unknown probability distributions over known outcomes). The NDM tradition, drawing on Lipshitz and Strauss (1997), presents a richer taxonomy that better reflects the kinds of uncertainty agents actually encounter.

## Three Types of Uncertainty

Lipshitz and Strauss (1997) classified uncertainty into three distinct types (cited in Zimmerman, pp. 6-7):

**Inadequate understanding**: The decision-maker doesn't know what is happening. The situation is not recognized, the diagnosis is unclear, the story doesn't make sense yet. This is uncertainty about the *nature of the problem*.

**Undifferentiated alternatives**: Multiple courses of action seem equally viable, or the decision-maker cannot distinguish which alternative is best. This is uncertainty about *what to do*.

**Lack of information**: Specific facts are missing that would be needed to resolve the above. This is uncertainty about *the data*.

The critical finding: "the subjective aspects of the situation, such as inadequate understanding and undifferentiated alternatives played a bigger role in uncertainty than did objective aspects, such as lack of information" (Lipshitz & Strauss, 1997, cited in Zimmerman, p. 7).

This is counterintuitive. We tend to think of uncertainty primarily as missing data — if we just had more information, we would understand the situation better and know what to do. But the research suggests that the harder problems are inadequate understanding (we can't make sense of the data we have) and undifferentiated alternatives (we understand the situation but still can't determine the best response).

**For agent systems:** This taxonomy has direct design implications. When an agent reports uncertainty, it matters enormously *which type* of uncertainty is present:
- Inadequate understanding → invest in situation assessment: story-building, pattern matching, seeking clarifying cues
- Undifferentiated alternatives → invest in action evaluation: mental simulation, quick test, explicit cost-benefit comparison
- Lack of information → invest in information acquisition: identify the specific data that would most reduce uncertainty, and seek it

Conflating these types leads to inappropriate responses: seeking more data when the problem is misinterpretation of existing data, or doing more analysis when the needed input is simply missing.

## Uncertainty as Staller vs. Uncertainty as Inevitable

Traditional framing: uncertainty is a problem to be resolved before action. Once sufficient certainty is achieved, action follows.

NDM framing: "Klein (1998) contends that once the inevitableness of uncertainty is accepted, decision makers can focus on the task of using the information that is available to reach effective decisions" (cited in Zimmerman, p. 7).

This reframing is crucial. Uncertainty is not a temporary state that precedes decision-making — it is the permanent condition within which decision-making occurs. Treating it as something to be eliminated leads to analysis paralysis. Treating it as the operating environment leads to pragmatic action under acknowledged uncertainty.

Zimmerman's empirical data confirmed this in law enforcement: "participants expected a high degree of uncertainty when encountering potentially threatening individuals and not only accepted this uncertainty, but also adapted to functioning in such environments" (p. 64). Officers' default operating mode was uncertainty acceptance — "I always expect the worst," "I assume everyone is armed," "everyone is a suspect, until I can determine otherwise." This is not pessimism; it is the expert's adaptation to a permanent epistemic condition.

**The expert's relationship to uncertainty**: The expert doesn't try to eliminate uncertainty before acting. Instead, they:
1. Acknowledge and calibrate the level of uncertainty present
2. Identify which decisions are robust to that uncertainty (can be made safely now) and which are not (should be deferred or made with escalated caution)
3. Act on robust decisions immediately
4. For non-robust decisions, actively seek the specific information that would most reduce uncertainty
5. Use worst-case assumptions as a protective default when uncertainty is irreducible

**For agent systems:** Build explicit uncertainty representation into agent architectures. Not just confidence scores (how sure am I?), but uncertainty type (which kind of not-sure?), uncertainty impact (does this uncertainty affect my decision?), and uncertainty reducibility (is there information I could get that would help?). An agent that represents uncertainty richly can make much better decisions about when to act, when to wait, and what information to seek.

## Active vs. Passive Information Seeking

A consistent finding across expertise research: experts actively seek information to reduce uncertainty, rather than passively waiting for information to arrive.

Vicente and Wang (1998) describe how "skilled decision makers are also better able to seek out relevant information and use leverage points to progress a situation to the desired end" (cited in Zimmerman, p. 26). The concept of **affordances** — opportunities provided by the environment — and **leverage points** — affordances that provide focus and direction — describes how experts scan the environment not just to record what's there, but to identify what's useful.

**Affordances**: elements of the environment that offer decision-relevant information or action opportunities. An expert officer entering an unknown building doesn't just see a room — they see cover positions, sight lines, entry and exit points, indicators of recent activity.

**Leverage points**: affordances that provide maximal progress toward the decision-maker's goal with minimal cost. The expert identifies *which* pieces of information, if obtained, would most efficiently resolve the current uncertainty, and directs attention accordingly.

The contrast with novice information seeking: novices tend to process information in order of presentation or salience, not in order of decision-relevance. They may note many features of the environment, but miss the specific feature that would most efficiently update their situational model.

**For agent systems:** Build leverage-point reasoning into agent information-gathering. Before seeking additional information, agents should ask:
- What specific uncertainty am I trying to reduce?
- What information would most efficiently reduce that uncertainty?
- Where is that information available, and what is the cost to obtain it?

This converts information-seeking from a diffuse "gather more data" process into a targeted, efficient reduction of the most important uncertainties.

## Satisficing Under Uncertainty: Integrating the Frameworks

The quick test, the satisficing framework, and the uncertainty acceptance principle together form an integrated decision policy:

**Step 1: Acknowledge uncertainty.** Accept that complete information is not available and will not become available in time. Classify the type of uncertainty present.

**Step 2: Run the quick test.** Is delay acceptable? Is error cost high? Is the situation unfamiliar? These three questions determine whether to act immediately or invest in further analysis.

**Step 3: If analysis is warranted, identify leverage points.** Don't seek information broadly — identify the specific information that would most reduce the most consequential uncertainty and seek that specifically.

**Step 4: Set the satisficing threshold.** Define what an acceptable solution looks like in this situation. This is context-dependent: in a life-or-death situation with high error costs, the threshold is different than in a low-stakes, easily reversible situation.

**Step 5: Evaluate the first viable option against the threshold.** If it passes, implement it. If not, modify it or generate the next option.

**Step 6: Monitor for situation change.** Continue tracking whether the situation remains what the initial assessment said it was. If it changes, reassess.

This integrated policy embeds uncertainty acceptance at every step: the goal is never to eliminate uncertainty, but to make the best decision possible given the uncertainty that exists.

## The Special Challenge of Human Behavior Uncertainty

Zimmerman's research introduces a finding that distinguishes law enforcement (and many other agent deployment contexts) from the domains where most NDM research has been conducted. In most NDM domains — aviation, firefighting, naval warfare, nuclear power — the decision-maker is assessing physical systems that follow physical laws. The uncertainty is about system state and physical process.

In law enforcement, the decision-maker must predict human behavior. "The ability to assess and predict human behavior is vastly more complex than predicting the behavior of non-human entities. Humans interact socially and interpret intentions and actions based on their own previous experiences, their emotions before and during the event, their mental state, personality traits, and previous knowledge or misinformation" (Zimmerman, p. 22).

Shanteau (1992) documented the performance gap empirically: decision-makers who make decisions about physical entities (weather, aircraft, chess positions) perform significantly better than decision-makers who make decisions about human behavior (clinical patients, defendants, parolees). The task characteristics that enable good performance — static, unique, predictable, with decision aids and feedback — are absent in human behavior domains.

**For agent systems operating in human-facing domains:** The fundamental finding is that human behavior uncertainty is categorically harder than physical system uncertainty. Several specific properties make it harder:

- **Intentionality**: Humans adapt their behavior in response to what they believe about the agent's intentions and capabilities. This creates adversarial dynamics that physical systems don't have.
- **Opacity**: Human internal states (emotions, intentions, beliefs) are not directly observable. The agent must infer them from behavioral signals that are often ambiguous and culturally variable.
- **Variability**: The same person in the same situation may behave differently depending on internal states that the agent cannot observe. The variance in human behavior prediction is simply higher than in physical system prediction.
- **Feedback scarcity**: In many human behavior prediction domains, feedback is delayed, noisy, or absent. The agent cannot learn quickly from mistakes.

**The novel opportunity identified by Zimmerman:** Experienced officers didn't just assess human behavior — they actively shaped it. "Instead of only using tactics to alter the physical environment, some participants attempted to manipulate the cognitive environment in order to achieve their goals" (p. 71). One expert officer, recognizing that a suicidal subject's agitation was centered on his family, "drop[ped his] voice way down and started asking about his family... If you can play on his emotions for his family, all of the sudden he realizes he's hurting someone besides himself, so I went after that and it ended up working" (p. 58).

This represents a second-order capability beyond situation assessment: the ability to influence the human's own situational assessment, changing what they perceive as possible and desirable. Agent systems operating in human-interactive domains should be designed not just to assess and respond to human behavior, but to consider how their responses shape the human's subsequent behavior — including whether the human's uncertainty about the agent's capabilities and intentions can be used strategically.

## Uncertainty, Stress, and Decision Quality

Acute stress — the kind present in high-stakes, time-pressured decision environments — interacts with uncertainty in specific ways that are relevant to agent design.

"Anxiety leads to a narrowing of attention (tunnel vision)" (CIDS Training, Appendix C). Under stress, decision-makers reduce the breadth of their attention, focusing narrowly on the most salient features of the environment. This has two effects: they process less information overall (increasing effective uncertainty), and they may miss peripheral cues that would be decision-relevant.

"Stress constrains the thinking process. Stress affects the way we process information, it does not cause poor decisions" (CIDS Training, Appendix C). This nuance is important: stress doesn't make people stupid. It narrows attention, reduces working memory capacity, and increases reliance on familiar patterns. For agents: elevated task complexity and time pressure should trigger similar conservatism — relying more heavily on well-established patterns and seeking fewer, more targeted pieces of new information.

"More experienced decision makers are less influenced by stress" (CIDS Training, Appendix C). The mechanism: experts have better-established mental models that are more resistant to degradation under stress, and their proceduralized knowledge requires less working memory to access. For agents: robust pattern libraries and proceduralized common-case handling are not just efficiency gains — they are resilience factors that maintain performance when computational resources are constrained.

**For agent systems under high-load conditions:** Design degradation protocols that explicitly trade breadth for reliability when resources are constrained. Under high load, narrow the attention window, rely on established patterns, reduce option generation, and apply satisficing with a higher threshold. This produces more conservative but more reliable behavior — which is appropriate when uncertainty and stakes are both elevated.
```

---

### FILE: the-three-pronged-framework-observation-interview-training.md
```markdown
# The Three-Pronged Framework: How to Observe, Understand, and Improve Complex Decision Processes

## The Problem With One-Method Approaches

Organizations that want to improve their decision-making capabilities typically choose one intervention: more training, or better tools, or smarter personnel. Research organizations that want to understand decision-making typically choose one method: field observation, or laboratory experiments, or interviews.

Both approaches suffer from the same limitation: the phenomenon they're studying is too complex and too multi-layered for any single method or intervention to capture adequately. Expert decision-making operates simultaneously at the behavioral level (what the expert does), the cognitive level (how the expert thinks), and the developmental level (how the expert became expert). Accessing all three levels requires different tools.

Zimmerman's research addresses this through an explicit three-pronged approach: "combining observation, interviews, and training creates a three-pronged training course: (a) practical/tactical skills, (b) information and knowledge gathering, and (c) cognitive skills training" (p. 38). Each prong accesses a different layer; together they provide coverage that no single approach achieves.

## Prong One: Observation Through Realistic Simulation

### The Information Observation Provides

Observation captures *behavioral reality* — what decision-makers actually do, as opposed to what they remember doing, what they think they're doing, or what they believe they should be doing. Video-recorded behavioral data provides:

- Precise timing of actions and decisions
- Physical positioning and movement patterns
- Verbal content and paraverbal qualities (volume, pace, tone)
- Sequential action chains
- Response to environmental changes
- Non-conscious behavioral indicators that the decision-maker does not monitor or report

Zimmerman's study confirmed the complementary value of observational data: "information about the amount of negotiation engaged in by the participant and the speed and distance at which the participant approached the subject, was generally vague in the interview reports, yet was readily observable in the videos" (p. 69). Specifically, some participants reported "negotiating" when their behavior was observationally characterized as issuing commands at elevated volume — a qualitative difference that interview data could not surface.

### The Limits of Observation Alone

"Observations require interpretation of behaviors but do not provide insight into internal processes" (Cooke, 1994, cited in Zimmerman, p. 16). Watching an expert work shows what they do; it cannot show what they noticed, what they expected, what alternatives they considered, or why they chose one action over another. The cognitive content — which is the most useful content for building agent systems — is invisible to direct observation.

### Simulation as the Observation Infrastructure

For most high-stakes domains, waiting to observe real critical incidents is not a viable research strategy. The Simunition® system used in Zimmerman's study provides an alternative: live simulation with sufficient fidelity to elicit realistic cognitive and behavioral responses.

The key properties of adequate simulation for decision-making research:
1. **Sufficient realism** to engage genuine decision processes, not artificial "what would you do?" reasoning
2. **Controlled variation** allowing specific decision-relevant variables to be scripted into scenarios
3. **Behavioral observability** — what the decision-maker does must be recordable and analyzable
4. **Physical consequences** — participants must have a genuine stake in the outcome, not just hypothetical deliberation

The Simunition® approach achieved all four: participants faced live actors (not pre-programmed simulations), scenarios were scripted to include specific decision variables (ambiguous information, expectancy violations, situation changes), all actions were video-recorded, and participants faced real physical risk from non-lethal training ammunition.

**For agent systems:** This maps directly to structured agent evaluation environments. To observe agent decision-making realistically, you need environments that engage genuine agent capabilities (not toy problems), allow specific variables to be systematically manipulated, record agent behavior at sufficient resolution for analysis, and present real stakes (non-trivial costs for poor decisions).

## Prong Two: Structured Post-Event Interviews

### What Interviews Provide That Observation Cannot

The CDM interview provides access to cognitive content: the cues attended to, the interpretations made, the expectations held, the alternatives considered, the mental models applied. This is precisely the information needed to build agent knowledge bases, but it is invisible to observation.

More specifically, the CDM's multi-sweep retrospective process accesses *retrospective awareness of cognitive processing* — the expert's reconstruction of what they were thinking during the event. This is not perfectly accurate (introspective reports never are), but when combined with structured elicitation and validated against observational data, it provides substantial genuine insight into expert cognitive processes.

The pilot study finding established the key signature: "Experienced participants would then explain the likely causes of this behavior, such as, the motorist was hiding a crime or that he was thinking about attacking the officer or running away" (Zimmerman, p. 50). The interview reveals not just what the expert noticed (cues) but how they interpreted the cues (mental models) and what they expected to follow (projection).

### What Interviews Cannot Provide

Interviews cannot access:
- Cognitive processes that are fully automatized (the expert genuinely doesn't know why they did something)
- Behavioral details the expert did not attend to as decision-relevant
- Real-time temporal dynamics (how long things took, when exactly the decision was made)
- Non-conscious behavioral patterns

These are precisely what observation provides. The two prongs are complementary, not redundant.

**Triangulation**: The combination of observation and interview allows cross-validation: where the two sources agree, confidence is high. Where they diverge, the divergence itself is informative — it reveals blind spots, non-conscious processes, or decision-relevant behaviors that the expert did not monitor. Zimmerman used this explicitly: "interview data was crosschecked with observational data (videos) to determine how consistent participants were in reporting actual behaviors during the event" (p. 46).

## Prong Three: Cognitive Skills Training

### What Training Provides That Observation and Interview Cannot

Observation describes current performance. Interviews explain current cognitive processes. Neither, by itself, improves future performance. Training is the intervention prong: it takes the knowledge gained from observation and interview and translates it into improved capability.

The CIDS (Critical Incident Decision Skills) training designed for this study combined elements from Cohen et al.'s Critical Thinking Training and Pliske et al.'s Decision Skills Training. Key components:

- **Lecture**: establishing the cognitive framework (OODA loop, RPD model, satisficing, quick test)
- **Video critique**: watching actual officer incidents and analyzing decisions, cues, and action choices
- **Class discussion**: sharing experiences, building vicarious mental models ("it is possible to develop or expand mental models simply by hearing other people's stories," Zimmerman, p. 69)
- **Decision making games**: structured paper-and-pencil scenarios requiring rapid decisions and justifications
- **Feedback**: explicit performance feedback from both instructors and peers

### What Training Alone Cannot Do

Zimmerman's results confirmed what the expertise literature predicts: a single training event cannot produce fundamental change in decision processes. "No readily apparent differences were found when comparing participant interviews across Time 1 and Time 2" (p. 66). Eight hours of training, however well-designed, cannot overcome years of habit and practice.

"It is through repeated exposure to a variety of domain-specific incidents and consistent feedback about performance that expertise develops" (Ericsson & Charness; Klein, 1998; Shanteau, 1992, cited in Zimmerman, p. 72). The expertise literature is unambiguous: expertise requires deliberate practice with feedback, distributed over time, not a single intensive training event.

"This class would benefit from further development, likely by introducing components that promote regular feedback and sharing of experiences" (Zimmerman, p. 69).

### The Training Design Principles That Do Transfer

Despite limited immediate effects, the CIDS training design incorporates principles that hold up across the expertise literature:

**Make the implicit explicit.** Decision skills training works by surfacing tacit knowledge — the cues, interpretations, and mental models that experts use automatically — and making them available for conscious examination and deliberate practice. The goal is to give novices explicit access to the knowledge that experts have proceduralized.

**Practice under realistic conditions.** Decision making games, simulation exercises, and video critiques provide structured practice with feedback. Each is a scaled-down version of the real decision environment.

**Harvest vicarious experience.** Class discussions that involve sharing how different participants handled or would handle particular situations expand each participant's mental model library without requiring direct experience. This is particularly valuable for rare or extreme situations that practitioners may not encounter often.

**Build metacognitive awareness.** Training decision-makers to articulate the reasons for their decisions — not just what they did, but why — serves two functions: it improves their ability to justify decisions in legal and organizational contexts, and it forces them to make their tacit mental models explicit, which is the first step toward revising and improving them.

**Introduce the quick test as a decision tool.** The three questions of the quick test (Is delay acceptable? Is error cost high? Is the situation unfamiliar?) give decision-makers a structured method for managing the think/act tension that is otherwise resolved by intuition alone.

## Integrating the Three Prongs: The Design Logic

The three-prong methodology has an explicit logical structure:

**Observation** provides the behavioral data needed to understand what decisions are being made and when.

**Interview** provides the cognitive data needed to understand how those decisions are being made — the cues, models, and reasoning processes underneath the behavior.

**Training** uses that understanding to improve future performance — teaching novices the mental models and cognitive strategies that experience would eventually build, at a faster rate.

The three prongs must be integrated: training without observation and interview is generic, not domain-specific. Interview without observation is missing the behavioral validation layer. Observation without interview provides behavior without cognitive context.

**For agent systems, the three prongs map as follows:**

**Observation → Agent behavioral logging and evaluation.** Capture what agents actually do at sufficient resolution for analysis. Build structured evaluation environments with known ground truth. Video equivalent: replay capability for agent decision sequences.

**Interview → Post-task retrospective analysis.** After complex task completion, run structured retrospective analysis of agent decision processes: what information was attended to, what pattern was matched, what alternatives were considered, what the decision rationale was. This is the agent equivalent of the CDM interview — structured elicitation of the cognitive content behind behavior.

**Training → Knowledge base enrichment and fine-tuning.** Use findings from behavioral evaluation and retrospective analysis to identify gaps in agent knowledge, update