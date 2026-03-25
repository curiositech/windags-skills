# Contingency and Formality: How Exchange Structure Shapes What Participants Can Say

## The Spectrum of Spoken Interaction

Sacks, Schegloff, and Jefferson (1974) describe a "linear array" of speech events from casual conversation to formal interaction. At the formal end — courtrooms, ceremonies, institutional interviews — turns are "pre-allocated": both participants know in advance who speaks when, in what order, and for how long. At the casual end, turn construction is locally negotiated moment-by-moment.

Adamson extends and complicates this model with van Lier's (1996) concept of **contingency**: the degree to which what happens next in an interaction depends on what just happened, in an unpredictable way. High contingency means each utterance genuinely opens new possibilities; low contingency means the next move is predictable from the current one.

The key insight is that **contingency is variable within a single interaction** — and that this variability is controlled by the participant with higher status.

## The IRF Structure as a Contingency Regulator

The Initiation-Response-Feedback (IRF) exchange, originally described by Sinclair and Coulthard (1975) for classroom discourse, is a three-part structure that regulates contingency by design:

- The **Initiation** constrains what counts as an appropriate Response
- The **Response** fulfills or fails to fulfill the Initiation's constraints
- The **Feedback** evaluates the Response and signals whether the exchange is complete

This structure produces low contingency: given an Initiation, the relevant Response space is narrow; given a Response, the relevant Feedback space is narrow. The interaction is "pre-determined" in van Lier's sense.

But van Lier observes that IRF is not monolithic. The controlling participant can introduce **higher contingency** by relaxing the constraints on Responses, inviting elaboration, following tangents, or treating Feedback as an invitation rather than an evaluation. The interaction moves along the formal-casual spectrum depending on these micro-decisions.

> "The controlling influence in turn then leads to a contradiction of Sacks et al in their claim that turns are predictable in size, content, distribution and order. Surely talk which has some degree of formal purpose may waver from low contingency towards higher contingency with the purpose of relaxing the participant of lower status." (p. 40–41)

## The Doctor-Teacher-Interviewer Analogy

Adamson repeatedly uses the analogy of doctor-patient interaction to illustrate managed contingency. A doctor conducting a medical interview begins with low-contingency questions (What are your symptoms?) but can introduce higher contingency at any moment (Tell me more about that — how does it affect your daily life?). The transition from formal to conversational and back is engineered by the doctor, who retains authority over the interaction structure throughout.

Similarly, a teacher in the classroom can introduce more student-led discussion while retaining the right to close it down and return to transmission mode. The authority to engineer the contingency level is asymmetric — it belongs to the participant with higher status.

For Adamson's research interviews, this means:
- The interviewer controls the contingency level
- Moves to increase contingency (creating space for student elaboration) are interviewer decisions
- Students may exploit higher-contingency moments but cannot unilaterally create them

This has direct implications for what information can be elicited. Low-contingency IRF exchanges produce narrow, response-optimized answers. High-contingency moments produce elaborations, tangents, corrections, and genuine opinion — the data the interviewer actually needs.

## How Contingency Affects Data Quality

The research interviews were designed with a semi-structured format — ten questions organized around five topic areas, with scripted prompts available if initial questions failed to generate sufficient response. This format carries an implicit contingency level: relatively low, with defined question types and expected response domains.

But Adamson observes that some of his most valuable data came when the contingency level rose unexpectedly — when a student's response shifted the topic direction and the interviewer followed rather than redirecting. This is illustrated strikingly in Komkrit's interview:

> Komkrit begins discussing his favorite teacher, identifies his mathematics teacher, explains "maths is real... the calculation... the result doesn't change... there is one answer." The interviewer follows the tangent: "How is that different to, say, English?" Komkrit: "English... is very big... there are many ways to say something." Interviewer: "Is that good or not so good for you?" Komkrit: "Sometimes not so good... because too many choices." (p. 175-176)

This exchange about the nature of mathematical vs. linguistic knowledge — never scripted, never planned — reveals something about Komkrit's cognitive orientation toward language learning that no scripted question would have reached. It was possible only because the interviewer allowed contingency to rise above the scripted level.

The cost was format deviation: Komkrit's interview required more turns than others and drifted from the structured topic. The benefit was a richness of insight unavailable through low-contingency exchange.

## The Problem with Standardization

The desire for standardized interviewing — asking the same questions in the same way to all participants — is a desire for low contingency. It produces comparable data at the cost of depth.

Adamson's eventual conclusion is that standardization of *questions* is less valuable than standardization of *meaning* — adapting the linguistic form of questions while preserving the semantic intent:

> "The interviewer, if sufficiently sensitive to how those questions are understood by the interviewee, will attempt to make linguistic adaptations to the elicitations." (p. 51)

> "The semi-structured interviewer must adapt each set of questions and prompts to the linguistic and conceptual level and abilities of each interviewee and that standardisation cannot, indeed should not, be a priority as long as the main topics discussed remain constant." (p. 90)

This is a practical resolution: maintain low contingency at the *topic* level (the same domains are always covered) while allowing high contingency at the *exchange* level (the exact questions and follow-ups vary per participant).

## The Feedback Move as Contingency Signal

Within the IRF structure, the Feedback move carries the heaviest contingency-signaling load. An evaluative Feedback ("That's a good idea!") signals closure and low contingency — the exchange is complete, evaluate and move on. An acknowledging Feedback ("I see...") is lower in evaluation and higher in openness. A turn-passing Feedback ("OK" + pause) signals that the floor is available for continuation.

Adamson finds that the type of Feedback given influenced whether students extended their responses. But he also finds that the absence of Feedback — observed frequently in the rapid I-R-I-R sequences of question 4 — was itself a contingency signal, and a confusing one. Students accustomed to classroom three-part exchanges may have been disoriented by exchanges that closed without evaluation:

> "This lack of the third turn pragmatically is clearly not necessary to conform to the interviewer's sense of 'well-formedness' in this particular instance. However, this is done without consideration of what constitutes the 'communicative norms' of the interviewee." (p. 154–155)

The absent Feedback is not a neutral absence. It is a violation of an expected pattern — and for students whose interaction schemas are strongly classroom-shaped, such violations may produce confusion, over-careful responses, or silent withdrawal.

## Application to Agent Systems

**Principle 1: Contingency is a design variable, not a fixed property.** The degree to which an agent conversation is constrained (narrow response options, rapid task progression) or open (inviting elaboration, following tangents) is a parameter that should be consciously designed for each task type. Low-contingency interactions are efficient; high-contingency interactions are informative.

**Principle 2: The Feedback move is the primary contingency signal.** How an agent responds to a user's output determines what the user believes is appropriate to say next. Evaluative responses close down; acknowledging responses open up; turn-passing responses invite continuation. Agents that always evaluate will receive narrow, evaluation-optimized responses.

**Principle 3: Topic-level standardization is compatible with exchange-level variability.** Systems that require consistency across users can standardize at the domain level (ensuring the same topics are covered) while allowing adaptive variation at the interaction level (adjusting the form of questions and follow-ups). This produces consistent coverage without suppressing informative divergence.

**Principle 4: Absent signals are not neutral.** When an agent fails to acknowledge a user's input before proceeding, this is experienced as a skip, a slight, or a confusion — not as efficiency. The absence of expected patterns is itself a communication.

**Principle 5: High-contingency moments produce the most informative outputs.** Scripted, constrained interactions will miss what high-contingency exchanges reveal. Systems designed to gather genuine user understanding, preference, or state should include mechanisms for inviting and following unexpected elaborations.

## Boundary Conditions

High contingency is valuable when:
- Information depth is more important than efficiency
- The domain of relevant response is not known in advance
- Participants have something genuine to say that constrained formats would suppress

High contingency is costly when:
- Speed and consistency matter more than depth
- Participants exploit openness to avoid the actual task
- The interaction needs to serve as comparable data across many participants

The skill lies in knowing when to engineer contingency upward and when to bring it back down — and in recognizing that this control belongs to the party with authority in the interaction.