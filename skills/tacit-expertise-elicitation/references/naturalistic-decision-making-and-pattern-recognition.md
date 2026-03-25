# Naturalistic Decision-Making: How Experts Actually Decide Under Uncertainty

## Beyond Option Enumeration

Most formal models of decision-making — including those embedded in classical AI systems — 
assume a process of option enumeration, evaluation against criteria, and selection of the 
highest-scoring alternative. This is the rational choice model, and it describes almost nothing 
about how genuine experts make decisions under time pressure and uncertainty.

Gary Klein's research on naturalistic decision-making, which Wilson draws on extensively 
as the intellectual foundation for the MELI methodology, describes a fundamentally different 
process. Experts don't enumerate options and compare them. They recognize situations as 
instances of familiar patterns, and they act on the first option that seems workable — not 
the best option among all considered alternatives.

This recognition-primed decision (RPD) model has profound implications for how we 
understand expertise and for how we should design agent systems intended to replicate it.

Wilson's MELI protocol is specifically designed to surface this process. The Pass 3 questions 
are not asking the expert to retrospectively reconstruct a formal decision tree. They are trying 
to access the perceptual recognition, the anomaly detection, and the rapid action generation 
that actually drove the decision:

- "What were your initial reactions?" — the recognition phase
- "Which behavioral features did you expect to see, and what did you actually observe?" — 
  the model-world comparison
- "What, if anything, was unusual about this case?" — anomaly detection, the signal 
  that pattern recognition is insufficient and deliberate analysis is required
- "How did you know what to do at that moment?" — the recognition-primed action 
  generation, usually inarticulate but occasionally accessible through reflection
- "Did you observe that party b's reactions were as you expected, or not? Did that reaction 
  raise any issues for you?" — the feedback loop monitoring that allows mid-action adjustment

Baxter, Prevou and Pruyt (2008: 6), cited by Wilson, propose that elicitation should be 
"organized around knowledge categories that have been found to characterize expertise: 
diagnosing and predicting, situation awareness, perceptual skills, developing and knowing 
when to apply tricks of the trade, improvising, metacognition, recognizing anomalies, and 
compensating for system limitations" (p.17).

This list is a functional taxonomy of expert cognition. It is not a list of knowledge facts 
(things the expert knows) but a list of cognitive operations (things the expert does). 
Each item represents a distinct cognitive capacity that develops through deliberate practice 
and that novices systematically lack.

## Situation Awareness as the Foundation of Expert Action

The most fundamental of these capacities is situation awareness — the continuous, 
real-time model of what is happening, why, and what is likely to happen next. Experts 
maintain richer, more accurate, and more rapidly updated situation models than novices.

What makes this difficult to capture is that much of situation awareness is perceptual — 
it is driven by pattern recognition of cues that experts notice and novices don't. Honeyman's 
(1988) six elements of mediation skill include "investigation" and "empathy" — both of which 
are situation awareness capacities. The expert mediator notices things about the parties that 
the novice doesn't see: micro-expressions, changes in posture, hesitations, the way someone 
uses particular words.

These perceptual cues are the raw material for the expert's situation model. The expert 
then uses this model to predict what will happen next, to detect when something is going 
unexpectedly, and to generate appropriate responses. This is not a process the expert 
consciously controls step by step — it is an automatic process that years of deliberate 
practice have made fluent.

Wilson notes that the MELI questions are aimed at "what the mediator thought and did 
in a specific situation, rather than a description of what s/he would usually do in similar 
circumstances" (p.17). This distinction — specific instance versus general description — 
is critical because it is in specific instances that the perceptual cues and real-time judgments 
are accessible. General descriptions elicit policy statements; specific instances elicit 
the actual cognitive process.

## Anomaly Detection: When Pattern Recognition Breaks Down

One of the most important capabilities listed by Baxter et al. is "recognizing anomalies." 
This is the expert's ability to notice when a situation deviates from expected patterns — 
when something is wrong in a way that requires deliberate attention rather than routine response.

The MELI question "What, if anything, was unusual about this case?" is specifically designed 
to elicit this. And the Pass 4 question "Which factors do you think someone with less experience 
might have missed?" often reveals that the expert noticed something anomalous — a cue that 
signaled the situation was not what it appeared to be — that the novice would have missed.

Anomaly detection is doubly important because it is both the trigger for deliberate analysis 
(as opposed to routine response) and a signal of the limits of the expert's current pattern 
library. When the expert encounters something genuinely novel — something that doesn't 
match any familiar pattern — they must engage in slow, deliberate, effortful reasoning. 
And in those moments, the expert's advantage over the novice is reduced; both are operating 
with limited pattern-matching support.

This is why Wilson notes that "critical incidents, even if brief, are often chaotic and messy, 
and sometimes it can be difficult to establish exactly what happened as an event developed" 
(p.18). The incidents that are most worth examining in the MELI are often those that were 
anomalous — situations where the expert's usual pattern recognition was insufficient and 
they had to improvise.

## Improvisation as Expert Capacity

The inclusion of "improvising" in Baxter et al.'s list of expertise characteristics is significant. 
Experts are not just better at executing known procedures. They are better at creating new 
responses in situations where no stored procedure is adequate.

Wilson emphasizes this: "Expert mediators typically use a repertoire of questions as a primary 
form of intervention. Questions tend to emerge dynamically to meet the demands of the conflict 
in which the mediator is engaged" (p.15). The word "dynamically" is key — the questions are 
not selected from a pre-planned list. They are generated in real time by the expert's model of 
the current situation.

This improvisational capacity is supported by deep domain knowledge, but it is not reducible 
to it. The expert mediator does not improvise by knowing more facts about mediation — they 
improvise because their domain model is rich enough and flexible enough to generate novel 
appropriate responses to novel situations.

For agent systems, this points to the limits of rule-based approaches. A system that operates 
by matching situations to pre-specified responses will fail in exactly the situations where expert 
improvisation is most needed: the anomalous cases, the edge cases, the genuinely novel 
situations that don't fit the known patterns.

## Metacognition: Thinking About Thinking

The MELI's exploration of "metacognition" — the expert's awareness of their own thinking 
processes — is particularly sophisticated. The Pass 4 questions ("Looking back, was there 
anything that you would have changed about how you dealt with this incident?" and "What 
has contributed most to the way you now practice?") are invitations to metacognitive reflection.

Wilson's broader argument is that genuine expertise requires metacognitive engagement — 
"a commitment to lifelong learning" (Adler, 2003, cited on p.10) and an ongoing analytical 
relationship with one's own practice. The expert mediator is not just good at mediation; 
they think carefully about *how* they are good at mediation, and they use that thinking to 
continue improving.

This is Wilson's response to the potential Schön critique: reflection without action is not 
expertise. But the expert's reflection *is* followed by action — the continual updating of 
practice based on analysis of experience. The issue with Schön, as Wilson reads it, is a 
false dichotomy between reflective practitioners and experts. Genuine experts *are* reflective 
practitioners: "Expert mediators who have undertaken the requisite thousands of hours of 
practice and deliberation necessary to achieve expertise are hallmarked by a commitment to 
lifelong learning, and are seldom complacent" (p.10).

## Compensating for System Limitations

The last item in Baxter et al.'s list — "compensating for system limitations" — is often 
overlooked but is deeply important. Expert practitioners know the limitations of their tools, 
their methods, and their own capacities. They develop strategies to work around these 
limitations rather than being blindsided by them.

In mediation, this might mean knowing when a particular technique is unlikely to work 
with a particular party, or knowing when the mediation process itself is not the right vehicle 
for a given dispute. The expert's ability to compensate for system limitations is what allows 
them to function effectively even when conditions are unfavorable.

The MELI question "Were there any other relevant theories you might have used? Would you 
say that model is always useful or appropriate?" probes this directly. The expert who 
acknowledges the limits of their preferred model, and can articulate when it fails and what 
they do instead, demonstrates a form of practical wisdom that goes beyond technique mastery.

## Application to Intelligent Agent Systems

### Recognition-Primed Decision Architectures

The RPD model suggests that expert agent performance in complex domains may be better 
achieved through rich retrieval and pattern-matching systems than through explicit reasoning 
chains. An agent that can recognize the current situation as similar to known successful cases 
and adapt the relevant response is closer to the naturalistic decision-making model than 
an agent that enumerates possible actions and scores each one.

This argues for:
- Rich case libraries that capture the texture of real expert decisions, not just their 
  outcomes
- Similarity matching that operates on the relevant features of situations (what the 
  expert would notice), not just surface features
- First-workable-option generation rather than exhaustive option enumeration in 
  time-constrained contexts

### Anomaly Detection as a Core Agent Capability

An agent that operates in a complex domain needs dedicated anomaly detection — the 
capacity to recognize when a current situation deviates significantly from familiar patterns 
in ways that indicate the standard response will be inadequate.

This is architecturally distinct from error detection (noticing that something went wrong) 
and from uncertainty quantification (estimating confidence in a response). Anomaly detection 
is prospective — it fires *before* the agent commits to a response, signaling that the situation 
warrants deliberate analysis rather than pattern-matched action.

Agents that lack anomaly detection will confidently apply the wrong pattern in novel 
situations — the computational equivalent of the novice who misses what's unusual about 
a case.

### Improvisation as Generalization Depth

The improvisational capacity of experts suggests that agent improvement should be measured 
not just by performance on known case types but by the quality of responses to genuinely 
novel cases. A system that performs excellently on in-distribution cases but fails 
catastrophically on edge cases has not developed the deep generalization that characterizes 
genuine expertise.

Evaluation protocols for expert-level agent performance should include:
- Cases that are deliberately constructed to be anomalous
- Cases that require novel combinations of known patterns
- Assessment of the quality of the reasoning when pattern-matching is insufficient

### Situation Model Maintenance

The rich situation models that experts maintain — updated continuously as new information 
arrives — suggest that agent systems handling complex, extended interactions need explicit 
situation model management. Not just storing conversation history, but maintaining an 
updated model of the current state of the task, what has been tried, what has been learned, 
what the current constraints are, and what anomalies have been observed.

This is especially important for long-running agent tasks where the situation evolves and 
early assessments may become outdated. Expert practitioners continuously update their 
situation models; agent systems need architectural support for the same.