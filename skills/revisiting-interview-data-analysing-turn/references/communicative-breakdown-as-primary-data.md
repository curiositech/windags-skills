# Communicative Breakdown as Primary Data: What Failure Points Reveal

## The Inversion of Perspective

Standard analytical approaches treat communicative breakdown — moments where interaction fails, where repair is needed, where participants cannot understand each other — as interruptions to the real data. The "real" data is the smooth flow of successful communication. Breakdown is noise to be filtered.

Adamson's thesis inverts this perspective. Communicative breakdown is among the most informationally rich material in the corpus. Where breakdown occurs tells you about which topics are conceptually difficult. Who initiates breakdown tells you about the distribution of agency and face-concern in the interaction. How quickly breakdown is repaired — and what is done to repair it — reveals the cooperative norms each participant is operating under. What is *not* raised as breakdown, despite genuine non-comprehension, reveals the deepest cultural constraints on behavior.

> "Any analysis of research in the field of turn-taking needs, I believe, to include coverage of what happens when interaction breaks down as it can perhaps reveal another set of behaviours to contrast with turn-taking behaviour which apparently flows uninterruptedly." (p. 35)

## Where Breakdown Occurs: Topical Signals

The thesis documents that breakdown in the ten interviews was not randomly distributed across topics. It concentrated in:

- **Question 1**: Previous learning experiences (recall of specific behaviors, often subconscious)
- **Question 2**: What was learned by rote (similar recall demands)
- **Question 4**: Specific learning strategies (metacognitive awareness, often implicit)

It was much less common in:
- **Question 3**: Affective factors in learning English (preferences, feelings)
- **Question 7**: Differences between Thai and foreign teachers (opinion-based)
- **Question 9**: Attitudes toward collaborative learning (evaluative)

The pattern is consistent with Field's (1998) claim that learning strategies are often subconsciously embedded — interviewees cannot articulate what they implicitly know. Topics requiring recall of specific behaviors elicit breakdown; topics requiring expression of opinions or feelings do not.

This topical distribution is itself an analytical finding about the nature of the domain being investigated, not merely a methodological inconvenience. For any system analyzing human-generated data: **the pattern of where understanding fails is as informative as the pattern of where it succeeds**.

## Who Initiates Breakdown: Agency Distribution

The thesis finds a near-even split: 32 interviewee-initiated breakdowns vs. 29 interviewer-initiated. This is surprising — the expected pattern in an asymmetric interaction (authority interviewer, deferential Thai students) would be predominantly interviewer-initiated repair, with students reluctant to signal non-comprehension.

The actual data suggests that interviewees did initiate repair — but this finding requires qualification. The suppressed breakdown pattern (discussed above) means that the *actual* rate of interviewee non-comprehension was almost certainly higher than the rate of interviewee-initiated breakdown. Some breakdowns were absorbed silently, converted into false positive responses. The 32 interviewee-initiated breakdowns represent the cases where krengjai was overridden by the practical necessity of comprehension; the suppressed cases represent where krengjai won.

> "I would argue that there may have been more cases of breakdown as Thai cultural issues of krengjai... may have taken precedence over the desire to comprehend all that was discussed." (p. 171)

## The Structure of Repair Sequences

All repair sequences in the ten interviews completed in four turns or fewer, following one of two patterns:

**Pattern A (interviewee-initiated)**:
1. Interviewer Initiation
2. Interviewee request for clarification (R-ve/Ie:clarify)
3. Interviewer re-initiation (clarification)
4. Interviewee acknowledgment + Response

**Pattern B (interviewer-initiated)**:
1. Interviewer Initiation
2. Interviewee Response (potentially partial or unclear)
3. Interviewer request for clarification
4. Interviewee clarification + Interviewer acknowledgment + Return to topic

The brevity of these sequences raises a question: does four-turn completion represent genuine repair (the re-initiation actually clarified the issue), or strategic closure (the interviewee was willing to accept a partially-understood re-initiation to end the face-threatening breakdown sequence)?

Adamson argues for the second interpretation in at least some cases. The cultural constraint of krengjai creates pressure to close breakdown sequences quickly, regardless of whether comprehension has actually been achieved. The four-turn pattern may be a social achievement (maintaining the fiction of smooth interaction) rather than a cognitive achievement (genuine mutual comprehension).

> "Repair so commonly completed in four moves leads us to conclude either that the quality of the interviewer re-initiation in the third turn was consistently clarifying enough for true comprehension on the part of the interviewee, or that the interviewee was unwilling to continue the breakdown." (p. 172)

## The Absence of the Third Move as a Breakdown

A particularly subtle finding: the *absence* of an expected move can itself constitute a communicative disturbance. In question 4, the interviewer repeatedly used I-R-I-R sequences without providing the expected Feedback move (F). This violated the three-part exchange norm that students had internalized from classroom interaction.

The interviewees' expectations of a third move were shaped by years of classroom interaction where IRF sequences were the dominant pattern. When the third move was absent, they may have experienced ambiguity: Has the interaction gone wrong? Was my response unsatisfactory? Is the interviewer dissatisfied and moving on without acknowledgment?

> "If the interviewee expects its occurrence, then parallels can clearly be drawn to the type of three-part exchanges commonly occurring in 'low contingent' classroom interaction. When absent, as in question four, it raises the issue of whether the interviewer has contravened the interviewees' sense of what constitutes a 'communicative norm'." (p. 181)

This is a sophisticated point: **the absence of a signal is itself a signal**. Systems that analyze only what is present miss the communicative content carried by what should be present but isn't.

## Lexical vs. Conceptual Breakdown: Different Causes, Same Surface

The thesis identifies two types of breakdown that look identical at the surface level but require different responses:

**Lexical breakdown**: The specific word or phrase is unknown. Solution: provide a synonym or simpler reformulation.

Example: "by heart" → interviewee echoes it with rising tone → interviewer substitutes "memorize"

**Conceptual breakdown**: The concept itself is unfamiliar, abstract, or requires meta-cognitive awareness that the interviewee may not have explicitly developed.

Example: "organisation" → interviewee echoes → interviewer provides behavioral examples ("how you write your notes, if you keep your note-books and files in good order") → interviewee now understands and responds

The lexical repair unpacks the word; the conceptual repair unpacks the concept. Applying lexical repair to a conceptual breakdown will fail. Applying conceptual repair to a lexical breakdown is unnecessarily effortful.

The coding systems used in the thesis cannot distinguish these two types from the surface behavior alone. The analyst must use contextual knowledge — the student's language history, the topic domain, the nature of the prior interaction — to infer which type of breakdown is occurring and select the appropriate repair strategy.

## The Words That Consistently Caused Breakdown

The thesis documents specific lexical items that caused breakdown across multiple interviews:
- "guess" / "guesser"
- "by heart"
- "memorise"
- "strategies"
- "essay"
- "organise" / "well-organised" / "organisation"
- "self-responsibility"

This list is itself a finding: these are the abstract, metacognitive vocabulary items that the interview format assumed students possessed. The breakdown pattern reveals an assumption mismatch between the interview designer's vocabulary expectations and the students' actual lexical resources.

For any analytical system: **repeated breakdown in the same locations, around the same vocabulary or concepts, signals an assumption mismatch between the questioner's model and the respondent's actual knowledge state**. This is not a failure of the respondent; it is a failure of the question design.

## Application to Agent Systems

**Instrument systems to track where failures concentrate.** Errors, exceptions, timeouts, and repair loops should be logged by type, location, and trigger context. The pattern of failure distribution is a primary diagnostic, not a side effect to be managed.

**Design repair protocols that distinguish failure types before attempting repair.** A system that attempts the same repair strategy for "the agent didn't understand the task" and "the agent cannot execute the task" will systematically apply the wrong fix. Triage before repair.

**The absence of expected signals is itself a signal.** If a downstream agent normally confirms receipt and doesn't, that absence should trigger inquiry, not silence. If a data pipeline normally produces a certain output at a certain point and doesn't, the absence is the error signal.

**Track which requests consistently generate breakdown.** If certain request types, vocabulary choices, or task specifications consistently produce misunderstanding or failed execution, the pattern is diagnostic of a systematic mismatch between the requesting system's model and the receiving system's capabilities. The fix is not retry; it is redesign of the request.

**Build in mechanisms for graceful breakdown acknowledgment.** Systems that mask breakdown to appear compliant (the interviewee who produces a false positive response) are more dangerous than systems that flag breakdown. Design for transparent failure: the agent should be able to express "I am uncertain whether my understanding is correct" rather than producing a confident response that may be wrong.

**Distinguish between "repair completed" and "genuine comprehension achieved."** A four-turn repair sequence that ends with interviewee acknowledgment and a positive response is not automatically evidence of genuine repair. Build verification mechanisms that go beyond format compliance to check whether the content of the response addresses the actual question.