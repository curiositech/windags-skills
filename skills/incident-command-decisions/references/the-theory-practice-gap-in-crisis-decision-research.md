# The Theory-Practice Gap: When Research Models Fail to Meet Operational Reality

## The Gap Njå and Rake Are Actually Diagnosing

The surface reading of this paper is that it compares two frameworks for crisis decision making. But the deeper diagnosis is about an institutional failure: the gap between research communities that produce models of crisis decision making and operational communities that practice crisis management. This gap is not incidental; it is structural, culturally conditioned, and self-perpetuating — and it has direct consequences for how decision support systems get designed.

Njå and Rake are explicit about this at the paper's conclusion:

**"Incident commanders and their emergency organisations appear to be very little concerned with research and the practical use of scientific results. The barriers between researchers and first responders are both structurally and culturally conditioned. There are very few arenas where researchers and operative responders meet. Researchers developing descriptive and normative models seem unable to communicate with the responders. The responders, on the other hand, work in a rather enclosed community in which exposure to outside criticism is infrequent and experience transfer within and across services does not work very well."**

This is a diagnosis of mutual isolation. The researchers don't understand operations well enough to make their models applicable. The practitioners don't engage with research enough to benefit from it. And critically: neither side has good feedback loops to the other.

For agent systems, this is a warning about the relationship between the system designers (analogous to researchers) and the system operators (analogous to practitioners). If this relationship is not actively managed, the same mutual isolation will develop: a system built on models that don't accurately represent operational reality, used by operators who have neither the context to evaluate the model's validity nor the channel to communicate its failures back to the designers.

## The Normative vs. Descriptive Confusion

A central methodological challenge the paper identifies is the confusion between normative models (how decisions *should* be made) and descriptive models (how decisions *are* made). Both NDM and the CA claim to be primarily descriptive — they are telling us how decisions actually happen in crisis environments. But both inevitably import normative elements:

- The RPD model was developed by observing expert decision makers and identifying their strategies. But which decision makers were selected as "expert"? The selection criteria import a normative judgment about what good performance looks like.
- The CA's description of bureaucratic failure modes implies a normative standard: these are failures because there is a better way to operate. But what is that better way?

**"The literature on crisis and emergency management outlines theories and models on how decisions are typically made (descriptive models) or how they should be made (prescriptive models)."**

The problem is that when normative and descriptive models are conflated, the prescriptive force of the model is incorrectly grounded. If I say "you should make decisions like this because this is how experts actually decide," and it turns out that experts actually decide differently, then my prescriptive advice is built on a false empirical premise.

For agent systems, this confusion appears in the design of decision support: is the system modeling how humans actually make decisions in this domain (descriptive), or how they should make decisions (normative), or how the system's own reasoning process works (mechanistic)? These are three different things, and conflating them produces systems that are evaluated against the wrong standard.

**Design implication**: Agent systems should be explicit about which mode they are operating in:
- *Descriptive mode*: Modeling how domain experts actually behave, for purposes of automation or assistance that matches expert practice
- *Normative mode*: Implementing an ideal decision process, regardless of how humans currently do it
- *Mechanistic mode*: Executing a computational procedure that may not correspond to any human decision process

Each mode has appropriate evaluation criteria. Descriptive mode should be evaluated against behavioral match to expert practice. Normative mode should be evaluated against outcome quality. Mechanistic mode should be evaluated against computational correctness. Mixing these evaluation criteria produces systematically misleading assessments.

## Action Cards, Procedures, and the Limits of Explicit Knowledge

The paper notes that one application of crisis decision research is "a basis for developing procedures (e.g., action cards)." Action cards are explicit, pre-written guidance documents that responders are supposed to consult in specific situations. They are the embodiment of normative decision guidance — the "correct" action sequence for defined situation types.

But the paper's analysis of actual crisis behavior reveals the fundamental tension with this approach:

**"Formal rules and procedures give way to informal processes and improvisation."** (From the CA's findings)

And from the RPD perspective: experienced decision makers don't consult action cards — they act on recognition. The action card is essentially an attempt to make an expert's compiled RB knowledge available to a novice in text form. But the novice's problem is not that they lack the action sequence — it is that they lack the situation classification ability needed to know *which* action card applies.

This is a version of the classic problem in knowledge management: explicit knowledge (what can be written down) is a subset of tacit knowledge (what experts actually know). The action card can capture the "if-then" rule, but it cannot fully capture the pattern recognition ability that correctly classifies the situation as one to which the rule applies.

**The implication for agent systems**: Pre-written skill invocation sequences, decision trees, and fixed protocols face the same limitation. They encode the action part of expert knowledge but not the situation assessment part. A system that has excellent decision procedures but poor situation classification will apply excellent procedures to the wrong situations — often with high confidence.

This is why the paper argues for developing better *naturalistic* methods — approaches that can capture the tacit, experiential, perceptual elements of expert knowledge, not just the explicit rule structures.

**For WinDAGs**: The skill library should be understood as encoding procedural knowledge (the "what to do" part), but the orchestration layer must encode situational knowledge (the "when this applies" part). Gaps in the orchestration layer's situational knowledge will produce confident, systematic misapplication of otherwise correct skills.

## The Control Problem: Measuring Performance Without a Dependent Variable

Njå and Rake raise a methodological challenge that goes to the heart of both research and system evaluation:

**"There is no easily accessible and measurable output quantity of incident commanding which can be used as the dependent variable, for example, the production rate of a process system. The independent variables are also difficult to retrieve and scale in an analysis of incident command."**

This is the control problem: without a clear, measurable dependent variable (outcome quality), it is impossible to conduct the kind of controlled analysis that would allow us to definitively say "this decision process produces better outcomes than that one." We are left comparing processes without a reliable measure of their outputs.

The researchers have attempted workarounds:
- Using expert judgment to evaluate decision quality (but expert judgment is itself subject to retrospective distortion)
- Using incident outcomes as proxies (but outcomes depend on factors beyond command quality)
- Using process adherence as a measure (but normative and descriptive models disagree about what good process looks like)

None of these is satisfactory. And the paper is honest about it: both NDM and CA research have the problem of controls — both struggle to make valid inferences about causal relationships in crises.

**This matters for agent system design in three ways**:

**1. Evaluation methodology must be matched to domain characteristics**: Agent systems operating in crisis-like domains (high uncertainty, dynamic environments, novel problem types) face the same dependent-variable problem. The evaluation metrics appropriate for well-defined tasks (accuracy, precision, recall, BLEU score, etc.) may be inappropriate or misleading for open-ended, contextual tasks.

**2. Process metrics supplement outcome metrics**: Since outcome quality is often difficult to measure directly, process quality metrics (Is the reasoning transparent? Is the situation assessment calibrated? Are feedback loops active? Are uncertainty estimates appropriate?) provide complementary evaluation evidence.

**3. Longitudinal evaluation matters more than single-task evaluation**: In the absence of clean causal analysis, the best evidence for system quality is consistent performance across many diverse tasks. This requires maintaining evaluation infrastructure that tracks performance over time, not just at deployment.

## The Research-Practice Interface as a System Design Problem

Njå and Rake's conclusion about the researcher-practitioner gap is ultimately a statement about system design: a system in which feedback from operations doesn't flow back to system design will perpetuate systematic errors. The researchers produce models; the practitioners operate under those models; the models are wrong in ways that the practitioners can see; the practitioners have no channel to communicate those errors back to the researchers; the researchers continue developing increasingly sophisticated versions of the wrong model.

This is a closed-loop failure. The system is producing high-volume outputs (research models, procedures, training programs) and receiving no effective feedback. It is operating open-loop.

**The agent system parallel is exact**: A WinDAGs system that does not have effective feedback from operators about where its outputs are wrong, where its skill invocations are inappropriate, where its situation assessments are miscalibrated, will perpetuate those errors even as it accumulates more experience. More experience without feedback correction produces more confident, more consistent wrong answers.

The practical requirements for closing the loop:
- **Structured feedback channels**: Operators must have a mechanism to flag specific outputs as wrong, with enough context for the system designers to understand why
- **Active error seeking**: The system designers must actively seek failure cases, not wait for operators to report them — operators under time pressure will not systematically document system failures
- **Feedback integration**: Error reports must be integrated into system improvement, not merely logged
- **Validation before deployment**: Changes to system behavior must be validated against the class of errors they are supposed to fix before being deployed

The theory-practice gap is not a natural law. It is a failure of system design. The agent orchestration system that takes this lesson seriously will build feedback mechanisms as core architecture, not as afterthoughts.

## What This Book Is Really Arguing

Stepping back to the meta-level: Njå and Rake's paper is an argument for *epistemological humility* in crisis decision research — and, by extension, in the design of any system meant to operate in complex, uncertain, high-stakes environments.

Their argument:
1. Both dominant frameworks (NDM and CA) have genuine insights
2. Both are also built on methodologically compromised foundations (retrospective interviews, selection effects, researcher bias)
3. The frameworks have been developed in relative isolation from each other and from operational practice
4. The gap between the models and reality is larger than either research community acknowledges
5. Closing that gap requires better methods, better researcher-practitioner interaction, and greater honesty about what we don't know

For agent systems, this translates to: operate with confidence appropriate to the quality of your knowledge base; maintain active mechanisms for updating that knowledge base when it is wrong; prefer robust processes over optimal ones in novel situations; and build feedback loops as core architecture, not as optional instrumentation.

The agent system that embodies this epistemological humility will outperform the one that doesn't — not because humility is intrinsically valuable, but because the domain is genuinely uncertain and systems calibrated to the actual uncertainty of their domain will outperform those that are overconfident about their knowledge.