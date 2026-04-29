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