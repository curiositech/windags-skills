# Eliciting and Encoding Tacit Expert Knowledge: Lessons from Cognitive Task Analysis

## The Problem of Unexplained Expertise

One of the most practically important findings from the Naturalistic Decision Making tradition is that experts often cannot explain their own expertise. The knowledge lives in their pattern recognition, not in their explicit propositions. When asked why they made a decision, they will construct post-hoc rationalizations that may or may not capture the real cognitive process.

"A central goal of NDM is to demystify intuition by identifying the cues that experts use to make their judgments, even if those cues involve tacit knowledge and are difficult for the expert to articulate." (p. 516)

The nurses in the neonatal intensive care unit could detect infants developing life-threatening sepsis before standard diagnostic indicators appeared. When first asked, they could not describe how. Not because they were being evasive — but because the knowledge was genuinely inaccessible to introspection. CTA methods eventually extracted the cues, and some were surprising: "A few of these cues were opposite to the indicators of infection in adults." (p. 517) No amount of asking the nurses to explain their reasoning would have surfaced these inverted cues — because the nurses didn't know they were using them.

This is Nisbett and Wilson's (1977) finding applied to expertise: "Researchers cannot expect decision makers to accurately explain why they made decisions. CTA methods provide a basis for making inferences about the judgment and decision process." (p. 517)

## Why Tacit Knowledge Matters for AI Systems

The implication for building AI agent systems is profound and often overlooked: **the most valuable expert knowledge is often not available in the form that most AI training pipelines are designed to capture.**

Training on explicit documentation, stated best practices, and articulated reasoning processes captures what experts *say* they do. Cognitive task analysis — and its AI analogs — captures what they *actually* do, which often differs substantially and may in fact contradict the stated principles.

Consider:
- A senior engineer's stated code review principles ("maintain single responsibility," "avoid premature optimization") versus their actual pattern recognition on seeing a problematic architecture (immediate gestalt of "this will be a maintenance nightmare in six months")
- A security researcher's stated methodology versus their actual triage process when reviewing a codebase for vulnerabilities
- A product manager's stated prioritization framework versus their actual intuitive judgment about which features will matter to users

The stated principles are often a post-hoc rationalization of pattern recognition that happens faster and operates on different cues than the stated framework implies. Training only on the stated principles produces agents that can discuss the principles coherently but cannot replicate the underlying expert judgment.

## The CTA Methodology and Its AI Analogs

Cognitive task analysis methods are "semi-structured interview techniques that elicit the cues and contextual considerations influencing judgments and decisions." (p. 517) The specific techniques include:

**The Critical Decision Method (CDM)**: Focuses on retrospective accounts of specific challenging incidents. The expert is walked through a past case in detail, with probing questions designed to surface the specific cues that triggered decisions, the alternative interpretations considered, and the specific indicators that led to rejecting those alternatives.

**Progressive deepening of incidents**: Rather than asking for general principles, CTA focuses on specific episodes. "Tell me about a time when you were monitoring an infant and something felt wrong before you could say why." Then: "What did you notice first? What did that make you think? What else were you looking for? When did you become more or less certain?"

**Counterfactual probing**: "What would have had to be different about that situation for you to have made a different decision?" This probes the specific cues that were driving the judgment, by asking what would negate it.

**Simulation walk-through**: The expert is walked through a simulated scenario and asked to report what they notice, what they're thinking, what they're expecting next. This externalizes the pattern recognition process in real-time rather than retrospectively.

## Translating CTA to AI Training and Evaluation

For building better agent systems, the CTA methodology suggests several practical approaches that go beyond standard supervised learning:

**Case-based fine-tuning over principle-based fine-tuning**: Rather than training agents on explicit principles ("a good code review should check for X, Y, Z"), train them on rich case descriptions including specific examples, the cues that triggered decisions, alternative framings that were considered and rejected, and the reasoning behind rejections. This builds the pattern repertoire that tacit expertise operates through.

**Anomaly elicitation**: Train specifically on the hard cases — the cases where the expert's judgment diverged from the application of stated rules. These are the cases where tacit knowledge is doing the most work and where the pattern repertoire is most distinctive from the explicit principles.

**Multi-level case annotation**: For each training case, capture not just the final judgment but the intermediate states: what cues were salient, what patterns they matched, what alternative interpretations were live, and what specific features resolved the ambiguity. This is more expensive to produce but produces training data that actually captures the cognition, not just the output.

**Confidence calibration at the case level**: Track which types of cases produce high vs. low confidence in human experts, and verify that the agent's confidence calibration matches the human expert's calibration profile. If the agent is highly confident on cases where experienced experts are uncertain, the agent is producing the illusion of validity.

## The Knowledge Elicitation Problem in Agent Systems

There is a specific challenge in agent system design that the CTA framework illuminates: agents are often used to replicate expertise that was developed through informal experience, and the training data available for building those agents consists primarily of outputs (finished code, approved designs, resolved bugs) rather than processes (the pattern recognition that led to those outputs).

The NICU nurses example is instructive: the first CTA produced a set of cues. Some were novel (not in existing nursing literature). Some were counter-intuitive (opposite to adult infection indicators). None would have been surfaced by asking nurses to explain their process, because they genuinely didn't know they were using those specific cues.

The equivalent challenge for agent training: a senior engineer reviewing code is likely using cues that:
- Are not in any coding style guide (informal pattern knowledge)
- Are not articulable in principle form (perceptual-structural rather than propositional)
- May run counter to stated best practices (tacit adjustments learned from hard experience)
- Are not present in the output of the code review (they informed the decision but aren't stated in the comment)

Capturing this knowledge requires something like CTA methods applied to the human experts whose expertise is being replicated:
- Walk the expert through past cases
- Ask about the specific features that triggered concern
- Probe counterfactually what would have changed the judgment
- Ask about the cases that seemed similar to concerning cases but turned out to be fine, and what distinguished them

This is expensive to do rigorously, but even partial application — collecting rich annotation on a sample of high-value cases — substantially improves the quality of pattern knowledge encoded in the training data.

## Skill Propagation: How CTA Results Get Disseminated

One of the most practically valuable applications of CTA in the NDM tradition is direct dissemination of elicited expertise:

"Crandall and Gamblian (1991) extended the NICU work. They confirmed the findings with nurses from a different hospital and then created an instructional program to help new NICU nurses learn how to identify the early signs of sepsis in neonates. That program has been widely disseminated throughout the nursing community." (p. 517)

The CTA process produced not just understanding of expert judgment but a training program that could transfer that expertise to novices. The tacit knowledge, once surfaced, became teachable — not necessarily as explicit principles, but as cases, patterns, and cue recognition exercises.

For agent systems: the output of a thorough capability elicitation process should not just be a better-trained model but a richer specification of what the capability is actually doing — a form of documentation that:
- Describes the key cue types the skill is sensitive to
- Provides annotated examples of high-difficulty cases with explanations of the discriminating features
- Identifies the boundaries of the skill's expertise (which case types it handles reliably vs. which require escalation)
- Specifies the counterfactual: what features, if different, would change the output

This documentation serves multiple purposes: it guides fine-tuning, it enables calibrated confidence reporting, it supports routing decisions, and it gives human supervisors the mental model they need to appropriately oversee the skill's outputs.

## The Limit: Tacit Knowledge That Cannot Be Transferred

The paper acknowledges that some expertise may be fundamentally non-transferable, even with CTA methods: "Intuitions that are available only to a few exceptional individuals are often called creative. Like other intuitions, however, creative intuitions are based on finding valid patterns in memory, a task that some people perform much better than others." (p. 521)

The reference to Fischer and Kasparov is telling: these are players whose pattern recognition exceeded that of other grandmasters — who could recognize patterns that other grandmasters couldn't see on their own, even when led through them. The knowledge wasn't just unexplained; it was potentially inexplicable — not because of the articulation problem but because the underlying pattern recognition operated at a level that couldn't be verbalized even in principle.

For agent systems, this sets a realistic ceiling: some domain expertise, especially at the frontier of human performance in high-validity domains, may not be fully transferable through any training process that operates on articulable outputs. The knowledge may only be implicit in the architecture and weights of the trained model, not in any extractable representation. This is not a failure of methodology — it is a structural feature of what the deepest tacit expertise is.

The practical implication: don't expect full replication of frontier human expertise. Expect replication of the documented, elicitable component of expertise — which is substantial — while acknowledging that the residual will require either novel training approaches, ongoing human-in-the-loop involvement, or explicit flagging of cases that require frontier expertise that is not fully encoded.