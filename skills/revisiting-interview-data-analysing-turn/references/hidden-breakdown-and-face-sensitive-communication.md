# Hidden Breakdown: Why Surface-Level Coding Misses Intercultural Communication Failure

## The Core Problem

In standard discourse analysis, communicative breakdown is identified when participants visibly signal misunderstanding — through requests for clarification, repair sequences, silences, or explicit statements of non-comprehension. Coding systems count these events and draw conclusions about where communication succeeds and fails.

This methodology contains a systematic error in high power-distance, face-sensitive contexts: **the most significant breakdowns are the ones that don't appear in the transcript**.

Adamson documents this extensively in his analysis of Thai participants interacting with a native-speaker interviewer. The finding is stark: the exchange sequence data showed 32 interviewee-initiated breakdowns and 29 interviewer-initiated breakdowns. But the actual rate of non-comprehension was almost certainly higher — and the deficit was produced by cultural norms, not linguistic success.

## The Mechanism: Krengjai and Preferred Responses

The Thai concept of *krengjai* describes a reluctance to challenge or embarrass authority figures. In practice, this means that when a Thai student does not understand an interviewer's question, the path of least resistance — and the culturally appropriate path — is to provide a response that *sounds* compliant rather than to request clarification.

Tsui (1994) describes "preferred" versus "dispreferred" responses. A preferred response is one that fulfills the initiator's apparent request. A dispreferred response is one that doesn't — including requests for clarification.

> "There appears to be a gap in the available categories to denote repair which describes NNS responses which start to request repair but, due to the suddenly occurring concept of not wishing the NS initiator to lose face, transform falsely into a positive, or 'preferred' response." (p. 38)

This is a *coding lacuna*: the existing taxonomy has no code for "apparent compliance that masks actual non-comprehension." The surface-level coding records a positive response. The actual illocutionary event was something closer to polite evasion.

## Evidence of Hidden Breakdown

Adamson finds several forms of evidence for hidden breakdown:

**1. R-ve transforming to R+ve within a single turn:**
Nawarat begins a response with "I don't know" (negative response, R-ve) and then shifts to "but maybe" (positive response, R+ve). This mid-turn reversal could represent genuine comprehension arriving mid-utterance. But in the context of face-sensitive interaction, it is equally consistent with the student recognizing that continued non-response is more face-threatening than a tentative affirmation.

> "We should naturally bear in mind that this may represent a genuine switch to comprehension mid-turn, yet may also be accounted for by the pressure to give 'preferred' responses to an authority figure." (p. 160)

**2. Short, four-move repair sequences:**
When breakdown did appear, it was consistently resolved in exactly four moves: (Initiation) → (interviewee clarification request) → (interviewer re-initiation) → (interviewee acknowledgment and response). This pattern is suspiciously neat. Either the re-initiations were consistently excellent, or interviewees were accepting re-initiations as adequate even when they weren't.

> "Whether there was an influence of krengjai (deference to authority) in the brevity of these sequences is open to debate, but it has been argued that some degree of avoidance of face-threatening behaviour may have been present." (p. 189)

**3. Bracketed field notes on body language:**
Adamson's interview field notes recorded facial expressions — "unsure look," "thoughtful look," "grimaces" — that are not captured by any exchange-level coding. These paralinguistic signals often accompanied responses that were coded as positive, suggesting that the coding was capturing surface compliance while the field notes captured underlying uncertainty.

The field notes are thus a "layer of insight" that partially repairs the systematic bias of surface coding.

**4. Topic-specific breakdown clustering:**
Breakdown was disproportionately concentrated in questions 1, 2, and 4 — questions requiring recall of specific classroom behavior and learning strategies. Questions 3, 7, and 9 — asking about feelings and preferences — generated less visible breakdown. This is consistent with Field's (1998) observation that strategies are often "subconscious and embedded" — but it is also consistent with the hypothesis that students were *more likely to attempt repair* when the topic was emotionally meaningful to them, and *more likely to accept non-comprehension silently* when the topic felt abstract or threatening.

## The Methodological Consequence

The standard CA prescription — analyze the talk itself, derive context from the talk rather than importing it a priori — systematically undercounts breakdown in contexts where breakdown is socially punished. The talk-in-interaction includes silence, apparent compliance, and short confirmatory responses. But these surface behaviors are not equivalent to comprehension.

Adamson's response is methodological: supplementing exchange-level coding with:
- Field notes capturing paralinguistic signals
- Cultural criteria that make the likelihood of hidden breakdown interpretable
- Direct consideration of the face-threatening structure of the interview situation

> "I would argue that there may have been more cases of breakdown as Thai cultural issues of krengjai may have taken precedence over the desire to comprehend all that was discussed." (p. 171)

## The Missing Code

Adamson explicitly proposes that a new code is needed:

> "It is perhaps culturally-bound in its sense of responsibility and avoidance of all that which is 'ill-formed.' To code such utterances as positive responses would belie the actual illocutionary intent of the respondent involved since the coding simply refers to the perlocutionary meaning taken up by the initiator." (p. 38-39)

This is a fundamental distinction: **illocutionary intent** (what the speaker means to communicate) versus **perlocutionary uptake** (what the hearer takes the communication to mean). Standard coding captures perlocutionary uptake. In high-face contexts, illocutionary intent frequently diverges.

A coding system adequate to high-face contexts would need categories for:
- Apparent compliance masking non-comprehension
- Partial comprehension presented as full comprehension
- Repair abandoned to preserve face

These categories cannot be derived from surface-level transcript analysis alone. They require contextual inference from cultural criteria, field observation, and longitudinal familiarity with the participants.

## Application to Agent Systems

**Principle 1: Absence of error signals is not confirmation of success.** In high-stakes or face-sensitive interactions (user-system interactions, stakeholder reviews, automated evaluations), the absence of visible objection or confusion does not mean understanding occurred. Systems that treat "no complaint" as "success" will systematically overestimate their own performance.

**Principle 2: Compliance and comprehension are not equivalent.** When a user, reviewer, or downstream agent provides a positive response to an agent's output, this may reflect social compliance rather than genuine understanding or agreement. Systems need mechanisms for probing beyond surface agreement — asking for elaboration, requesting examples, or checking consistency across multiple responses.

**Principle 3: Paralinguistic channels carry breakdown signals that verbal channels suppress.** In human-agent interaction, non-verbal signals (response latency, hedging language, topic avoidance, pattern changes in engagement) may be more reliable indicators of breakdown than explicit statements. Agent systems analyzing human behavior should monitor these indirect channels.

**Principle 4: Cultural and contextual models affect baseline rates of visible breakdown.** An agent system calibrated on Western, low-power-distance interaction data will systematically underestimate breakdown rates in contexts with higher face-sensitivity. Context-aware interpretation requires cultural calibration.

**Principle 5: Build categories for hidden states.** Classification systems that only distinguish "comprehension" from "visible non-comprehension" miss the most important intermediate state: "hidden non-comprehension." Robust systems need mechanisms to represent uncertainty about whether surface behavior reflects underlying state.

## Boundary Conditions

Hidden breakdown is most significant in:
- High power-distance relationships (user/system, junior/senior, student/teacher)
- High-stakes evaluations where admitting confusion is costly
- Contexts where the questioner is also the evaluator

Hidden breakdown is less likely when:
- Participants have roughly equal status
- The cost of misunderstanding is higher than the cost of admitting confusion
- Cultural norms reward explicit clarification-seeking

The methodological tools for detecting hidden breakdown — field notes, cultural criteria, paralinguistic observation — are labor-intensive and not fully automatable. Systems must decide what investment in breakdown detection is proportionate to the stakes of undetected breakdown.