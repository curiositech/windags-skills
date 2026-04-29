# The Critical Decision Method: Extracting Expert Knowledge from Operational Memory

## The Problem of Expert Knowledge

Expert knowledge is famously difficult to elicit. Experts often cannot articulate the basis for their decisions — not because they are withholding, but because the most important components of their expertise have become automatic and unconscious. The fireground commander who instantly recognizes a dangerous smoke pattern cannot easily explain the features of the pattern that triggered the recognition, because the recognition process itself has become opaque to introspection.

This creates a central challenge for building intelligent systems: how do you transfer expert knowledge into a form that a system can use, when the expert cannot directly articulate that knowledge?

Klein and Calderwood developed the Critical Decision Method (CDM) as their primary solution to this problem. It is a retrospective interview methodology designed to surface the tacit, proceduralized knowledge that experts have difficulty articulating directly. Understanding the CDM has direct value for agent system design — both as a knowledge-elicitation tool and as a model for how intelligent systems should probe their own knowledge sources.

## Why Standard Elicitation Fails

The standard approaches to knowledge elicitation from experts are:
1. **Structured interviews**: Ask the expert to explain the rules they follow
2. **Protocol analysis**: Have the expert think aloud while solving a problem
3. **Questionnaires**: Survey the expert's beliefs and heuristics

These approaches share a problem: they privilege conscious, articulable knowledge over tacit, proceduralized knowledge. But the most important expert knowledge — the recognition patterns, the causal inferences, the expectancy schemas — is precisely the knowledge that has become most automatic and is therefore least accessible to conscious report.

Fireground commanders, when asked "what rules do you use to decide whether to attack a fire from the inside or outside?" will give answers that are generic, simplified, and often inconsistent with their actual behavior. They are not lying or being evasive — they genuinely cannot fully access the pattern-recognition process through direct introspection.

## The Critical Decision Method: Design Principles

The CDM addresses this problem through several design principles:

### Focus on Specific Incidents, Not General Rules

The CDM does not ask experts to describe their general approach or the rules they follow. Instead, it asks them to describe a specific incident — a memorable case where their expertise was genuinely engaged and their decisions made a difference. The specificity of the incident anchors the account in concrete memory rather than abstract self-model.

"Incidents were typically self-selected by the commander with the constraint that the case should represent a 'command challenge;' that is, they should illustrate a situation in which a decision had a significant impact on the outcome." (p. 28)

This focus on exceptional cases is deliberate. Routine cases are handled routinely — the expert's decision process is fast, automatic, and leaves little memorable trace. The critical incident, precisely because it was challenging, required more deliberate processing and is therefore more accessible to retrospective report.

### Reconstruct the Timeline Before Probing Decisions

Before probing specific decision points, the CDM constructs a detailed timeline of the incident — a sequence of events, both objective (what happened) and subjective (what the commander perceived, believed, and decided). This serves multiple functions:

- It activates detailed memory of the incident, creating a rich context for subsequent questioning
- It surfaces the sequence and duration of events, which is important for understanding time pressure and information availability
- It allows inconsistencies in the account to be detected and corrected (a single-pass narrative often contains errors that the timeline reconstruction reveals)
- It creates a shared understanding between interviewer and expert of "the facts of the case"

The timeline construction is not just a methodological step — it is cognitively effective. The multi-perspective temporal analysis has "demonstrated utility for obtaining accurate eyewitness testimony." (p. 29-30)

### Identify Decision Points Through Behavioral Markers, Not Self-Report

Not all decision points in an incident are explicitly recognized as such by the decision-maker. The CDM identifies decision points through behavioral markers — moments when the expert took one of several possible courses of action, or made a judgment that affected the outcome — not just through the expert's self-report of "having made a decision."

"A decision point was probed if the participant confirmed that other reasonable courses of action were possible or that another participant (perhaps one with less or greater expertise) might have chosen differently." (p. 30)

This is important because, as the research shows, expert decision-makers often do not experience their recognitional responses as "decisions" — they experience them as simply knowing what to do. The CDM recovers these invisible decisions by checking, at each behavioral choice point, whether alternative courses of action existed. If they did, the choice point is a decision point, regardless of whether the expert consciously experienced deliberation.

### Probe Each Decision Point with Structured but Open Questions

The CDM probe set is designed to surface the tacit knowledge that underlies each decision point:

- **CUES**: What were you seeing, hearing, smelling?
- **KNOWLEDGE**: What information did you use, and how was it obtained?
- **ANALOGUE**: Were you reminded of any previous experience?
- **GOALS**: What were your specific goals at this time?
- **OPTIONS**: What other courses of action were considered or available?
- **BASIS**: How was this option selected/other options rejected?
- **EXPERIENCE**: What training or experience was necessary?
- **AIDING**: If the decision was not optimal, what would have helped?
- **TIME PRESSURE**: How much time pressure was involved?
- **SITUATION ASSESSMENT**: How would you summarize the situation to a relief officer at this point?
- **HYPOTHETICALS**: If a key feature had been different, what difference would it have made?

The hypotheticals probe is particularly powerful. By systematically varying key features of the situation — "what if the smoke had been black instead of yellow?" — it forces the expert to articulate the causal links between situational features and their decision consequences. These causal links are precisely the tacit knowledge that is hardest to access through direct questioning.

## What the CDM Reveals

When properly conducted, the CDM surfaces knowledge that is inaccessible through standard elicitation:

**Cue interpretation patterns**: Which cues the expert attended to and what causal inferences they drew from them. Not "firefighters use smoke color to assess fire temperature" (which is generic and well-known) but "at this point I saw the smoke was yellow and being pushed out under pressure, which told me the fire had spread beyond the room of origin into an enclosed space with limited ventilation, which meant I might have a flashover risk within the next few minutes, which meant I needed to get my crews out" (which is specific, causal, and actionable).

**Goal activation sequences**: How the situation assessment changed the expert's goals — what they were trying to accomplish at each stage of the incident, and how that changed as the situation developed.

**Expectancy structures**: What the expert predicted would happen and how they responded when predictions were violated. This is particularly valuable because expectancy structures are almost entirely tacit — experts form them automatically and don't usually articulate them explicitly.

**Analogical reasoning traces**: The previous experiences that explicitly influenced the current decision and how the expert applied (and appropriately modified) those previous experiences. The CDM explicitly probes for analogues: "Were you reminded of any previous experience?"

**The shape of the option space**: Even in recognitional decision-making, alternatives exist. The CDM's "options" probe recovers the alternatives that were available but not pursued — revealing the boundaries of the decision space and the criteria (often implicit) that led to the selection of the chosen course.

## Implications for Knowledge Engineering in Agent Systems

The CDM provides a model for how agent systems should approach knowledge elicitation from human experts:

**Focus on cases, not rules**: Asking domain experts to articulate rules produces impoverished, over-simplified output. Asking them to walk through specific challenging cases produces rich, contextually embedded knowledge that can be converted into situation-action patterns.

**Use timelines to reconstruct context**: When building knowledge bases from expert memory, reconstruct the temporal sequence of events before probing decision points. Context is not a backdrop to knowledge — it is part of the knowledge.

**Probe the invisible decisions**: The most important expert knowledge is often in decisions that experts don't recognize as decisions. Systematic identification of behavioral choice points (moments where alternatives existed) surfaces this tacit knowledge.

**Use hypotheticals to elicit causal models**: The hypotheticals probe is the most powerful tool for surfacing causal knowledge. "What would have been different if X had been the case?" forces the expert to trace causal paths from situational features to decision consequences. This is the structure of a situation-action rule.

**Capture the full situation assessment, not just the action**: A complete knowledge record includes the cues that triggered recognition, the inferences drawn from those cues, the goals activated, the expectations formed, and the action taken — not just the action. Without the situation assessment components, the action record is uninterpretable: you know what was done but not when to do it.

## The CDM as a Model for Agent Self-Examination

The CDM also offers a model for how agents should examine their own past decisions. An agent that can retrospectively analyze its own decision history using CDM-style probes can extract and codify the patterns that its own learned behavior instantiates — building explicit knowledge representations from implicit operational behavior.

Concretely: an agent reviewing a past decision episode should ask:
- What cues triggered this decision path?
- What situation assessment did I form?
- What expectancies did that assessment generate?
- Were those expectancies met or violated?
- What options were available? What determined my selection?
- What analogues from past experience (if any) influenced the decision?
- Were there hypothetical variations that would have changed the decision? What does this reveal about the causal structure of my decision?

This self-examination process is the computational equivalent of the CDM interview — and the outputs can be used to build richer, more explicit knowledge representations that improve future performance.

## Boundary Conditions of the CDM

The CDM has important limitations that should be acknowledged:

**Retrospective memory is imperfect.** The CDM relies on expert recollection of past events. Memory distorts, especially under the influence of outcome knowledge (knowing how things turned out affects memory of what was known at the time). The timeline reconstruction helps, but does not eliminate this limitation.

**Articulation is not representation.** Even with the best interview technique, experts can only report what they can articulate. Fully automatic, pre-conscious processes remain inaccessible. The CDM surfaces more than standard elicitation, but not everything.

**The exceptional case is not the typical case.** CDM focuses on critical incidents — challenging, memorable cases. This may systematically sample unusual rather than typical situations, creating knowledge representations that are well-suited for handling novel situations but underrepresent the common case.

**The method requires significant investment.** A full CDM interview takes 1-3 hours and produces data that requires substantial analysis. It cannot be scaled easily to large expert populations. It is best suited for extracting knowledge from a small number of deeply expert practitioners about complex, high-stakes decisions.

Within these limits, the CDM remains one of the most powerful methods for accessing tacit expert knowledge — and the principles underlying it have broad application to knowledge engineering for intelligent systems.