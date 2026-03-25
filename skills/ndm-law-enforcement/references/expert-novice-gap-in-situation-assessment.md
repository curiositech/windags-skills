# The Expert-Novice Gap: Why Experts See Differently, Not Just Better

## The Surface Diagnosis Is Wrong

The common assumption about expert-novice differences is that experts know more facts and have faster access to them. Novices would become experts if they just acquired more knowledge. This turns out to be an incomplete picture — and the incompleteness has profound consequences for how we design training, knowledge transfer, and agent architectures.

The real difference, documented repeatedly across domains in this research, is not primarily about *quantity* of knowledge. It is about the *structure* of attention and the *level* at which the situation is processed.

"Experienced participants focused heavily on describing their assessment of the situation, while novices focused heavily on describing their actions and the actions of the subject" (Zimmerman, p. 53).

Experts assess. Novices act. More precisely: experts spend their cognitive resources on understanding what is happening; novices spend their cognitive resources on executing what they were taught to do.

## The Three-Level Mental Model Distinction

Fowlkes et al. (2000), studying helicopter pilots, identified three types of mental models that map cleanly onto the expert-novice distinction:

**Declarative models**: Concepts, facts, rules. "The suspect is holding a gun." "The building has two exits." "Officers should announce before entering."

**Procedural models**: Sequences, timing, correct execution. "Approach from the left," "keep weapon drawn," "announce, wait three seconds, enter." This is rule-following as behavior.

**Strategic models**: Strategies for applying knowledge to the current state. "He's escalating because he feels cornered — back off to give him an exit option." "This pattern matches a subject who wants to provoke a shooting." "The knife on the floor corroborates the kidnapping story."

**Novices operate primarily at the declarative and procedural levels.** They know the rules and they execute the procedures. What they lack is the strategic layer — the ability to read the situation as a whole and generate adaptive responses that fit the specific configuration of *this* situation.

**Experts operate primarily at the strategic level**, having automated the declarative and procedural components to the point where they no longer require conscious attention.

In the police scenarios: when an experienced officer heard a suspect say "I just got out of jail," they immediately constructed a strategic interpretation: "He knows the system, he knows what resisting means, which means if he's still resisting he's either desperate or willing to escalate." A novice heard the same words and... continued trying to apply the same procedural approach without modification.

## Cue Integration vs. Cue Detection

Both novice and experienced officers detected the same environmental cues. The differences appeared in what they did with those cues.

"Previous research has indicated that experts and novices often attend to the same cues, but experts tend to combine these cues in a more efficient manner" (p. 56, citing Randel & Pugh, 1996).

Novices noticed the suspect was "nervous." Experienced officers noticed the specific behavioral components of nervousness (fidgeting, arm-crossing, looking around, wringing hands) and integrated those components into a probabilistic model of the suspect's mental state and likely next actions.

This is the difference between feature detection and feature integration. Both require noticing the cue. Only integration produces actionable understanding.

The practical implication for agents: **receiving relevant signals is not the same as understanding the situation**. An agent that correctly identifies all individual features of a situation but fails to integrate them into a coherent situational model will perform like a trained novice — technically accurate on components, strategically blind.

## Dynamic Updating: The Clearest Expert-Novice Dividing Line

The sharpest empirical difference observed in this study was in how officers responded when the situation changed:

"Experienced officers tended to change their course of action in response to changes in the environment. Instead of deliberating about changing their actions, they seemed to react in a fluid manner, while novices tended to either ignore or note the changed condition but not change actions" (p. 58).

This manifested most strikingly in two scenarios:
1. When a suspect shifted from hostile to suicidal. Novices continued commanding compliance. Experienced officers switched to negotiation, picking up on the emotional cue ("family") and pivoting their entire approach.
2. When weapons jammed. Two novice officers stopped the scenario because they didn't have a mental model for the jam situation. Three experienced officers improvised — one cleared the jam, one bluffed, one attempted an alternative approach.

The novice failure mode is not stupidity or laziness — it is **the absence of a mental model for the changed situation**. Without a model, there's no recognition, no action retrieval, and the system defaults to... continuing the previous action. This is rational behavior given the absence of alternatives. It only looks like rigidity from outside.

This is one of the most important transfer lessons for agent systems: **an agent that lacks a mental model for a situation will default to executing its last known plan, even as that plan becomes increasingly inappropriate**. This is not a bug in the agent's reasoning — it is the predictable output of a system without situational coverage.

## The Dreyfus Five-Stage Model: A Developmental Map

Dreyfus and Dreyfus (1986) provide a five-stage model of skill acquisition that maps the development from novice to expert:

1. **Novice**: Context-free rules applied uniformly. Focuses on discrete cues and single acts. No holistic perception.
2. **Advanced Beginner**: Begins recognizing situational elements. Can apply basic context-specific rules. May notice important information but not integrate it.
3. **Competent**: Can decompose situation into discrete units. Better at prioritizing. Begins to engage in some rule-breaking. Still cannot differentiate the most important cues.
4. **Proficient**: Perceives the situation as a whole. Intuitive pattern recognition. Rules become less important; flexibility increases. Must still analyze to determine action.
5. **Expert**: Action becomes automatic. Intuitive recognition matched to prior experience. Access to broad mental model repertoire. Mental simulation for prediction. Deals with uncertainty through story-building and active information-seeking. Decision process has become automatic — hard to describe.

What's notable: the Competent stage often *looks* riskier than earlier stages. "Results indicate that 'competent' participants tended to engage in more risky actions... although this is the stage where decision makers become more organized, they also start breaking rules in order to accomplish their goals" (p. 63). This is the stage where enough confidence has developed to break rules but not enough judgment to know which rules to break.

For agent system design, this developmental map suggests that capability assessment should not be binary (can/can't). A system at "competent" level may be more dangerous than one at "advanced beginner" — precisely because it has enough capability to deviate from safe defaults but not enough judgment to deviate well.

## What Experts Can't Tell You (And Why It Matters)

A recurring methodological challenge in this research: "Decision makers at the expert level have trouble describing their decision process, which have now become automatic" (p. 29-30, summarizing Dreyfus & Dreyfus, 1986).

This is not evasiveness. It is the signature of genuinely automated expertise. When processing becomes automatic, it drops below the threshold of conscious awareness. Experts know what they noticed in the sense that they can reconstruct it when asked — but they did not *consciously decide* to notice it in real time.

This creates a knowledge elicitation problem with direct relevance to agent systems: **you cannot simply ask domain experts to write down their decision rules**. The most valuable knowledge is tacit, automatic, and reconstructed only through structured retrospective prompting.

The Critical Decision Method (CDM) is designed precisely to overcome this barrier — through multiple retrospective sweeps with structured probes that help experts reconstruct what they were attending to and why. For AI systems, this implies that expert knowledge capture requires something like CDM: not "describe your rules" but "tell me about a specific incident, walk me through what you noticed, what you expected, what you did."

## Implications for Agent System Architecture

1. **Situation assessment is a separate, prior module** to action selection. It should not be skipped or collapsed into action routing. The quality of action selection depends entirely on the quality of situation assessment.

2. **Cue integration requires contextual framing**. Detecting features is not enough. The agent needs mechanisms for asking: "what do these features, together, mean about the state of the world?"

3. **Domain coverage determines strategic capability**. An agent with many skills but sparse mental models for novel situations will behave like a competent novice — executing correctly when situations match training, defaulting to last-known-plan when they don't.

4. **The competent-level danger zone** should be designed around. Systems that have enough capability to deviate from safe defaults but insufficient contextual judgment need guardrails that more primitive systems don't — precisely because of their partial competence.

5. **Expert knowledge is most valuable when elicited from specific stories**, not abstract rules. System designers should prefer training data from structured retrospective accounts over rule-specification documents.