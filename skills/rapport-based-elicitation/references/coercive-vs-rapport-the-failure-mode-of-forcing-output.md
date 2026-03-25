# The Coercive Approach as a Systemic Failure Mode: Why Forcing Output Backfires in Resistant Systems

## The Central Problem

When an intelligent system — human interviewer or AI agent — encounters a resistant counterpart that holds information the system needs, the intuitive response is to apply pressure: ask more directly, repeat the question, narrow the options, assert authority, or manipulate the environment to make non-disclosure costly. This is the accusatorial approach, and it dominated U.S. law enforcement interrogation for more than five decades.

It is also demonstrably wrong.

Brimbal et al. (2021) document what decades of field studies, wrongful conviction analyses, and laboratory research have confirmed: "accusatorial tactics can lead to false confessions... and unreliable information" (p. 56). The paper cites a meta-analysis (Meissner et al., 2014) showing that accusatorial approaches produce *less diagnostic* outcomes compared to information-gathering approaches. And yet the approach persisted. Understanding *why* it persisted — and why it still feels compelling to practitioners — is one of the most important lessons this paper offers to anyone designing intelligent agent systems.

## The Structure of the Accusatorial Failure

The accusatorial approach has three defining features that make it self-defeating when applied to a resistant counterpart holding valuable information:

**1. It assumes guilt and narrows the response space.**
"Once an individual is suspected of guilt, interviewers attempt to secure a confession by exerting control, manipulating an individual's perception of the evidence against them, and suggesting the potential benefits of providing a confession" (p. 56). This means the system has pre-committed to a hypothesis and is now selecting for evidence that confirms it. In information theory terms, the system has collapsed the prior distribution before gathering evidence. Any output that doesn't fit the expected confession is treated as resistance to be overcome rather than data to be processed.

**2. It prevents free narrative generation.**
"It is often difficult for an individual to provide their own narrative in this context, given the implication of guilt and the coercive nature of the questioning that this approach places an emphasis on (i.e., asking closed-ended and suggestive questions, interrupting an interviewee's objections or denials)" (p. 56). Closed-ended questions constrain the output space. Interruptions destroy the generative process mid-stream. The interviewer is essentially inserting their own cognitive model into the interviewee's output channel, which guarantees that what comes out is contaminated by the interviewer's assumptions.

**3. It generates high-confidence false outputs.**
This is the most dangerous failure mode. The accusatorial approach doesn't just fail to get information — it actively produces false information that *looks like real information* (confessions, admissions, confirmations). The system generates output, the output is high-confidence, and the output is wrong. Laboratory research (Kassin & Kiechel, 1996; Russano et al., 2005, cited in Brimbal et al.) demonstrated that accusatorial tactics produce false confessions even from innocent subjects, and field studies of wrongful convictions (Garrett, 2015, cited in Brimbal et al.) confirm this at scale.

## Why the Failure Mode Persists: The Institutional Blindness Problem

If the accusatorial approach fails systematically, why did it dominate for 50 years? The paper reveals a key mechanism: "for more than 50 years interviewing techniques have been based on customary knowledge developed through practitioner experience and informed by anecdotal evidence" (p. 55, citing Hartwig et al., 2014).

This is the classic gap between anecdotal feedback loops and rigorous measurement. When an interrogator uses coercive tactics and the suspect eventually confesses, the interrogator receives a positive signal — confession obtained. But the interrogator cannot know:
- Whether the confession is true
- Whether a less coercive approach would have obtained the same confession faster
- Whether a less coercive approach would have obtained *more* information
- What information was lost because the suspect managed resistance by providing a false narrative

The feedback system is corrupted. Success looks like success even when the output is garbage, because there is no ground-truth measurement against which to compare.

The experimental design in Brimbal et al. (2021) specifically addressed this by providing interviewees with 35 known facts and measuring what percentage was disclosed — a ground-truth comparison that is impossible in real interrogation. This is precisely the measurement capability that prevents institutional learning from occurring in the field.

## Translation to Agent System Design

**Failure Mode: Output-Forcing Under Resistance**

Any agent system that, when facing a resistant or uncooperative upstream system, defaults to:
- Repeating the same query with higher specificity (closed-ended escalation)
- Asserting authority or priority signals
- Narrowing the response space through constraints
- Interrupting partial outputs to redirect toward expected answers

...is implementing the accusatorial approach. It will generate high-confidence false outputs, miss true information, and create adversarial dynamics that persist across future interactions.

**Specific Failure Patterns to Watch For:**
- An agent that retries failed API calls with increasingly specific parameters (closed-ended escalation) rather than backing off and asking what the system can provide
- An orchestrator that, when a sub-agent produces an unexpected result, immediately re-queues with a corrected prompt that embeds the expected answer (suggestive questioning)
- A system that interprets any output that doesn't match the expected schema as an error and discards it rather than treating it as information about the actual state of the world
- An agent that interrupts a long-running sub-process to redirect it based on a partial read of its output

**The Key Diagnostic Question:**
When your agent system encounters resistance or unexpected output from a sub-system or external API, does it move toward *information gathering* (what is the counterpart actually able to tell me?) or toward *output forcing* (how do I make the counterpart produce what I expected)?

The accusatorial approach always chooses output forcing. The evidence-based approach always chooses information gathering.

## The Practitioner Resistance Problem

One final lesson from this section of the paper: "Absent a compelling alternative, it has proven difficult to convince law enforcement to alter their tactics, particularly when interviewing resistant subjects" (p. 56).

This translates directly to agent system design and adoption. A dominant strategy (however wrong) will not be abandoned unless there is a concrete, demonstrated alternative that works on the *hardest cases* — not the easy ones. Easy cases are always solved by the existing approach. The new approach must prove itself on resistant, uncooperative, or edge-case scenarios.

When designing a new approach for agent coordination, routing, or information elicitation, the validation target should always be the hard cases: the resistant sub-systems, the edge-case inputs, the adversarial conditions. If the new approach only demonstrates superiority on cooperative inputs, practitioners (human or AI) will revert to the coercive default when things get difficult.

## Boundary Conditions

This framework applies most directly when:
- The counterpart (human, API, sub-agent, or external system) is capable of providing more information than it currently is
- The system cannot force compliance without corrupting the output
- The long-term relationship between systems matters (repeated interactions)
- Ground truth is knowable and measurable

It applies less directly when:
- The counterpart is genuinely incapable of providing the information (not resistant, but empty)
- Single-shot interactions where relationship dynamics don't apply
- Contexts where output verification is immediately available and false outputs can be caught before they propagate

In those boundary cases, more directive querying may be appropriate — but even then, the lesson holds: *confirm what the system can actually provide before specifying what you expect it to provide*.