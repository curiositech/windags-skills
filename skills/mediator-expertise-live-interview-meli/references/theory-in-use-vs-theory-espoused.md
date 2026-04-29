# Theories-in-Use vs. Theories-Espoused: The Gap Between What Agents Say They Do and What They Do

## The Foundational Distinction

One of the most productive ideas Wilson draws on — attributed to Argyris and Schön (1974) 
and referenced as "theories-in-use" — describes a fundamental gap in professional practice 
that has direct implications for how we understand, evaluate, and build intelligent systems.

The distinction is simple but profound:

- **Theory-espoused**: What a practitioner (or system) says it does; the declared strategy, 
  the articulated principles, the official account of decision-making
- **Theory-in-use**: What the practitioner (or system) actually does; the real cognitive 
  operations, the real decision triggers, the real patterns driving behavior

Wilson notes that these "improvisational problem-centred aspects of professional practice 
have long been identified as 'theories-in-use' and posited as valid and useful" (p.3). The 
MELI methodology exists largely because the gap between these two is real and consequential: 
standard knowledge transfer methods extract theories-espoused, but the valuable knowledge 
is in theories-in-use.

Experts know this gap exists — they often experience it when they try to explain to a novice 
what they are doing and find themselves saying things that feel inadequate or incomplete. 
"I just knew" is not a war story failure; it is an honest acknowledgment that the theory-in-use 
is not fully accessible to introspection.

## The Schön Problem and Its Resolution

Wilson engages directly with Schön's model of the "reflective practitioner" (1983), which 
Lang and Taylor (2000: 145) use to argue that "experts are professionals wedded to a model 
of practice" — that is, that genuine experts apply known frameworks while reflective 
practitioners engage with the uncertainty of novel situations.

Wilson's response is to reject this as "an artificial construct" (p.10). The dichotomy between 
expert and reflective practitioner is false because genuine experts *are* reflective practitioners. 
They do not simply apply stored models; they continuously update their models through 
practice, reflection, and deliberate analysis of failure and success.

But she also engages Greenwood's critique of Schön — that the model "fails to recognise 
the importance of the reflection that takes place before action" (p.10). This is the 
distinction between reflection-in-action (Schön) and pre-reflective situation assessment 
(what experts do in the moment before they commit to any action). Greenwood argues that 
much of what looks like expert intuition is actually extremely rapid pre-action reflection 
that happens below the threshold of awareness.

This is consistent with Klein's recognition-primed decision model: the expert "reflects" 
on the situation in the sense of running a rapid model-comparison process before acting, 
but this happens so quickly and automatically that it doesn't feel like reflection. It feels 
like knowing.

The implication for knowledge transfer is significant: if pre-action reflection is real but 
operates below awareness, eliciting it requires specific techniques that slow it down 
and make it accessible — which is exactly what the MELI's Pass 3 questions are designed 
to do.

## The Honest-Expert Paradox

Wilson observes a phenomenon that is both ironic and practically important: "Whilst some 
relatively inexperienced mediators claim expertise, others who are highly skilled may be 
reluctant to describe themselves as experts" (p.10-11).

This is not just false modesty. It reflects genuine awareness of the theory-espoused / 
theory-in-use gap. The highly skilled practitioner knows that what they can articulate 
about their practice — their theory-espoused — doesn't fully capture what makes them 
effective. They know they can't explain it completely, and so they hesitate to claim 
expertise.

The less experienced practitioner, who has learned a procedure and can explain it clearly, 
has no such hesitation. Their theory-espoused is complete — because it is all they have. 
They don't know what they don't know.

This is a version of the Dunning-Kruger phenomenon, but grounded in something real 
about the structure of expertise: as expertise deepens, the gap between what can be 
articulated and what is actually done widens, because the most important expert knowledge 
operates at the level of rapid pattern recognition rather than explicit reasoning.

## Implications for Professional Identity and Self-Presentation

"Practitioners' reticence to admit expertise may mean that they are underrating their highly 
developed abilities and knowledge, and the levels of client satisfaction and demonstrable 
outcomes evidenced in their work" (p.10-11).

This creates a market dysfunction: clients and referrers cannot accurately identify genuine 
experts because the genuine experts are reluctant to make strong claims, while confident 
self-promoters may be less competent. Wilson is describing a market in which the signal 
(self-claimed expertise) is inversely correlated with the underlying quality it is supposed 
to represent.

The MELI addresses this in part by creating a setting where expertise can be demonstrated 
rather than claimed. In the MELI, the expert doesn't need to say "I am an expert mediator." 
The quality of their account — the richness of their situation awareness, the sophistication 
of their reasoning about decision points, the depth of their comparison between expert 
and novice approaches — demonstrates expertise in the act of articulating it.

## The Reflexive Ethics of Elicitation

Wilson emphasizes that the MELI "is not for the interviewer to test hypotheses, nor to check 
whether the interviewee's account complies with a particular mediation model, ideology, or 
is otherwise 'orthodox'" (p.16). And: "When taking the role of interviewer, it is essential to 
check any personal impetus to interpret or edit the interviewee's account, or draw attention 
to one's own predilections" (p.16).

This is a methodological commitment to something Wilson calls "safe uncertainty" (Mason, 
2005): the interviewer must tolerate not knowing where the interview will go, must resist 
the urge to impose a framework on the interviewee's account, and must follow the actual 
cognitive process that is being elicited rather than the process the interviewer expected to find.

This is an ethical as well as methodological stance. The interviewer who has strong views 
about the "right" way to mediate will unconsciously shape the questions to confirm those 
views, and will thereby elicit a theory-espoused version of the expert's practice that 
conforms to the interviewer's model. The result will be less true but more theoretically tidy.

True elicitation requires epistemic humility: the willingness to find out that expert practice 
differs from what the framework predicted.

## Application to Intelligent Agent Systems

### Agent Behavior vs. Agent Explanation

The theory-in-use / theory-espoused gap has a direct and practically important analog in 
current AI systems. When a language model is asked to explain its reasoning, it produces 
an explanation. But that explanation is generated by the same model that produced the 
behavior — it is not a privileged window into the computational process that actually drove 
the output. The explanation is the model's theory-espoused; the actual computation is its 
theory-in-use, and the two may differ substantially.

This is well-documented in the mechanistic interpretability literature: models sometimes 
produce confident explanations for decisions that were actually driven by entirely different 
features of the input. Chain-of-thought reasoning, similarly, may be a post-hoc 
rationalization rather than an accurate account of computation.

The practical implication for agent system design:
- Don't treat agent self-explanations as ground truth about agent reasoning
- Use behavioral testing (what does the agent actually do across a range of cases?) 
  rather than explanation evaluation as the primary capability assessment method
- When explanations matter for system trustworthiness, invest in evaluation methods 
  that check whether the claimed reasoning actually matches the behavioral patterns

### The Dunning-Kruger Problem in Agent Confidence Calibration

The honest-expert paradox maps onto confidence calibration in agent systems. A well-
calibrated agent should have lower confidence when it is in genuinely uncertain territory — 
when the task is novel, the domain is outside its training distribution, or multiple competing 
approaches are plausible. But naive confidence estimation in language models often produces 
the opposite: higher apparent confidence on plausible-sounding but incorrect outputs, 
and genuine uncertainty on technically well-specified questions where the agent actually 
knows the answer.

The Wilson framework suggests that agents (and their designers) should be suspicious 
of smooth, confident, well-organized answers to complex questions — these may be the 
computational equivalent of the inexperienced mediator who can explain their procedure 
clearly because they have no tacit knowledge to struggle to articulate.

### Evaluation as Demonstration, Not Declaration

Wilson's observation that the MELI creates a setting where expertise is demonstrated 
rather than claimed suggests an evaluation principle for agent systems: **assess capability 
through behavior on hard cases, not through self-description of capabilities.**

An agent that claims to be expert in a domain should be evaluated by:
- Performance on cases at the edge of the domain
- Quality of reasoning when standard approaches fail
- Accuracy of confidence calibration (does the agent know when it doesn't know?)
- Quality of improvised responses to genuinely novel cases

Not by:
- Fluency of self-description
- Confidence of output tone
- Agreement with known "good" answers on benchmark cases

### The "Orthodox" Problem in Agent Knowledge Systems

The MELI's commitment to not checking whether the expert's account "complies with a 
particular mediation model, ideology, or is otherwise orthodox" has an important analog 
in how agent knowledge bases are curated.

Knowledge bases built for agent systems are often implicitly normalized to a particular 
framework — the textbooks, the established practitioners, the canonical sources in a field. 
This normalization produces a bias toward theories-espoused at the field level: the 
official account of best practice, which may differ substantially from what genuinely 
expert practitioners actually do.

Wilson notes that "many practitioners do not engage with theory or seminal Alternative 
Dispute Resolution texts at all" (p.6). This is not incompetence — it may reflect that 
the practitioner's theory-in-use has diverged from the textbook in response to real 
practice demands in ways the textbook doesn't capture.

Agent knowledge systems that are calibrated primarily to canonical sources will inherit 
the same limitations as training programs that prioritize textbook knowledge over 
situated expertise: they will be better at explaining what should work than at knowing 
what actually works in the specific, messy, real situations where agents operate.