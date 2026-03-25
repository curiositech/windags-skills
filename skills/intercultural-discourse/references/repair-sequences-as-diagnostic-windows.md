# Repair Sequences as Diagnostic Windows into Interaction Quality

## What Repair Reveals

In conversation analysis, "repair" describes the processes by which participants address actual or potential problems in speaking, hearing, and understanding. Repair sequences — where the normal flow of discourse is interrupted to address breakdown — are typically treated as noise to be minimized, evidence of failure.

Adamson's treatment inverts this: **repair sequences are diagnostic windows into the quality and character of an interaction**. Where breakdown occurs, who initiates repair, how repair is accomplished, and how long it takes all reveal information about the underlying communication dynamics that cannot be read from smooth, uninterrupted exchanges.

In particular, the *absence* of expected repair — in a context where breakdown has clearly occurred — is a signal of its own, and often a more important one.

## The Standard Repair Taxonomy

Schegloff, Jefferson, and Sacks (1977) proposed four categories of repair:
- Self-initiated self-repair (speaker corrects themselves)
- Self-initiated other-repair (speaker starts the repair; other person completes it)
- Other-initiated self-repair (other person flags problem; speaker repairs)
- Other-initiated other-repair (other person both flags and repairs)

Adamson challenges this taxonomy as inadequate for intercultural interaction:

> "There appears to be a gap in the available categories to denote repair which describes NNS responses which start to request repair but, due to the suddenly occurring concept of not wishing the NS initiator to lose face, transform falsely into a positive, or 'preferred' response." (p. 38)

The missing category is what might be called **abandoned repair** — where the repair-seeking impulse is present but is suppressed by face-sensitivity before it becomes overt. This is the "hidden breakdown" discussed in the companion document, now viewed from the repair side.

## Repair Initiation: Who Stops the Flow?

Adamson finds that in his ten interviews, interviewee-initiated breakdown was marginally more common (32 instances) than interviewer-initiated breakdown (29 instances). This finding requires careful interpretation.

The raw counts suggest something close to parity — both participants were approximately equally likely to stop the interaction and request clarification. But this apparent parity is almost certainly misleading. If Thai participants were suppressing repair-seeking behavior due to krengjai, then the actual rate of interviewee non-comprehension was higher than the repair count shows.

The implication is that the 32 interviewee-initiated breakdowns represent the instances where the need for clarification *overcame* the social pressure not to request it. The number of instances where social pressure *won* — where apparent compliance masked actual confusion — is unknown and unquantifiable from the transcript data alone.

## The Suspicious Uniformity of Repair Sequences

All repair sequences in Adamson's data followed a four-move pattern:

1. Initiation (by interviewer)
2. Interviewee request for clarification (R-ve / Ie:clarify)
3. Interviewer re-initiation (repair attempt)
4. Interviewee acknowledgment and response

This uniformity across ten different interviews with ten different participants about ten different questions is, on reflection, surprising. Real comprehension processes are messy and variable. The uniform four-move structure is more consistent with social management than with genuine disambiguation.

Possible interpretations:
- The re-initiations were consistently excellent and actually achieved comprehension (optimistic)
- Interviewees were accepting re-initiations as adequate closure even when they weren't (consistent with krengjai)
- The four-move structure was itself a learned script for navigating uncomfortable moments without prolonged disruption (plausible given Thai norms around smooth social interaction)

> "Repair so commonly completed in four moves leads us to conclude either that the quality of the interviewer re-initiation in the third turn was consistently clarifying enough for true comprehension on the part of the interviewee, or that the interviewee was unwilling to continue the breakdown." (p. 172)

## Repair Language as Diagnostic Data

The *type* of language used in repair sequences reveals information about the nature of the breakdown:

**Lexical breakdown** is indicated by repetition of a specific word with rising intonation: "By heart?" / "My organisation?" — the participant signals that a particular lexical item is the problem, not the overall conceptual content.

**Conceptual breakdown** is indicated by paraphrase attempts or broader clarification requests: "So you mean how I do things in speaking, listening and the others?" — the participant has understood the words but is uncertain about the conceptual frame being invoked.

**Strategic repair** appears when interviewees use formulas to seek confirmation while appearing to already understand: "You mean special methods, like games?" — the participant offers an interpretation and awaits confirmation, simultaneously advancing the conversation and checking comprehension.

This taxonomy of repair language — lexical, conceptual, strategic — is more informative than the surface classification of repair initiator. It tells you *where* the breakdown happened: at the word level, at the concept level, or at the level of mapping language to task expectations.

## The Absent Feedback Problem in Repair Sequences

Adamson identifies a recurring pattern where interviewer-requested clarification from interviewees was not followed by the expected Feedback before the interviewer's next Initiation:

> "[T]his lack of the third turn pragmatically is clearly not necessary to conform to the interviewer's sense of 'well-formedness' in this particular instance. However, this is done without consideration of what constitutes the 'communicative norms' of the interviewee who may have expected some form of feedback." (p. 154–155)

When a repair sequence concludes, both participants need to register that the break in normal flow is over — that the problem has been addressed and the main exchange can resume. This registration function is typically served by an acknowledging Feedback move. Its absence leaves an ambiguous transition: was the repair adequate? Is the exchange complete? Has the topic changed?

For students whose prior interaction schema (the classroom) made Feedback obligatory, the absent Feedback in repair sequences was a violation of expected discourse structure. This violation may have produced additional uncertainty on top of whatever original comprehension problem triggered the repair.

## Repair as Distributed Responsibility

One of Adamson's most important theoretical contributions is his challenge to the assumption that repair in NS-NNS interaction is primarily the responsibility of the native speaker:

> "Milroy, though, distinguishes firstly between breakdown and 'misunderstandings' — the 'simple disparity between the speaker's and the hearer's semantic analysis of a given utterance,' and also recognises that communicative breakdown occurs when either participant adjudges the interaction to have 'gone wrong' in some linguistic or other capacity. Clearly this latter point implies a shift in emphasis away from interpretation and jurisdiction of the interviewer." (p. 35–36)

If the NNS has "cultural criteria which... underlie and remain beyond the control of the NS" (Schegloff 2000, cited p. 36), then repair is not simply a correction mechanism controlled by the person with greater linguistic authority. It is a joint achievement, and the NNS's contributions to it — including the decision about when to seek repair and when to let apparent breakdown pass — are substantive acts, not deficits.

This positions repair as a **co-construction**: both participants are actively shaping the discourse at the points where it is most fragile. The NNS's choice to suppress a repair request is not passivity — it is a deliberate social act with cultural rationale.

## Application to Agent Systems

**Principle 1: Repair sequences are the most diagnostic moments in an interaction.** Where breakdown occurs and how it is addressed reveals more about the quality of communication than smooth, successful exchanges. Agent systems should log and analyze repair sequences as a primary quality indicator.

**Principle 2: Uniform repair patterns suggest social management, not genuine comprehension.** If users always resolve confusion in exactly the same way, in the same number of steps, this uniformity is suspicious. Genuine comprehension processes are variable. Uniform patterns suggest learned scripts for closing uncomfortable moments without resolution.

**Principle 3: Classify breakdown by type, not just by occurrence.** Lexical breakdown, conceptual breakdown, and strategic clarification-seeking have different causes and require different responses. An agent that treats all breakdown as equivalent will produce inappropriate repair attempts.

**Principle 4: Repair is co-produced; track both parties.** In human-agent interaction, users bear responsibility for signaling confusion, and agents bear responsibility for detecting it and repairing it. Systems that track only agent-initiated repair will miss user-initiated breakdown signals. Systems that track only user-initiated repair will miss the cases where agents produce ambiguous or non-repairable outputs.

**Principle 5: The transition out of repair needs explicit marking.** When a repair sequence concludes, the return to normal interaction needs to be clearly signaled. Agents that move immediately to the next task after a repair without explicitly closing the repair leave users uncertain about whether the problem was actually resolved.

**Principle 6: Monitor for suppressed repair signals.** In high-stakes or authority-differential interactions, users may suppress breakdown signals. Indirect evidence of suppressed repair includes: response latency, hedging language, sudden topic minimization, inconsistency between prior and subsequent responses. These indirect signals should trigger proactive repair-seeking by the agent.

## Boundary Conditions

Repair analysis is most valuable when:
- The interaction is long enough to contain multiple exchanges and potential breakdown points
- There is enough structural variation to distinguish genuine repair from ritualized breakdown management
- The analyst has access to information (field notes, cultural context, participant background) beyond the transcript itself

Repair analysis is limited by:
- The inability to directly access hidden breakdown (repair not requested)
- The interpretive indeterminacy of ambiguous responses (genuine comprehension vs. compliance)
- The labor intensity of detailed sequence-level analysis at scale