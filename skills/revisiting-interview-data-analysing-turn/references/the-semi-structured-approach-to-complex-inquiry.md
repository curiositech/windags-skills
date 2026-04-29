# The Semi-Structured Approach to Complex Inquiry

## The Problem with Fully Structured Inquiry

Fully structured inquiry — a fixed set of questions, in a fixed order, with fixed acceptable responses — guarantees comparability and reproducibility. It also guarantees that you will learn exactly what your questions were designed to ask, and nothing more. When the most important information is not captured by your prior question structure, you will miss it systematically.

In Adamson's thesis, the fully-structured alternative would have meant: ten identical questions, asked in identical order, with identical prompts, producing comparable but thin responses. The semi-structured approach he actually uses — a set of topic areas, prepared questions with optional prompts, flexibility to extend or omit — produces richer data at the cost of standardization.

> "The semi-structured interview is perhaps the preferred choice for researchers wishing to interpret responses from interviewees. This type of interview does not need to have a list of pre-determined questions. There is a 'flexibility' involved which allows the interviewer, as Nunan (ibid.: 149) indicates, to steer the interview topics rather than simply rely upon set questions." (p. 45)

## What Semi-Structure Enables

**Extension when the data offers more than the script expects.** Komkrit's unprompted distinction between mathematics (a single correct answer) and English (many ways to say something) was not in any script. The semi-structured approach allowed the interviewer to follow this distinction into a productive exploration of Komkrit's learning attitudes. A fully-structured interview would have cut this off and moved to the next scripted question.

**Adaptation when the script doesn't fit the participant.** Burin needed a linguistic level of question that the script did not provide. The semi-structured approach allowed the interviewer to rephrase, simplify, and recontextualize without violating the inquiry. A fully-structured approach would have logged his responses as failures and moved on.

**Standardization of meaning rather than standardization of form.** Gorden (1969), cited in the thesis, advocates "standardization of meaning" — the interviewer ensures that each participant understands what is being asked, even if the exact words differ. This is the opposite of standardization of form (identical questions regardless of comprehension). The semi-structured approach operationalizes standardization of meaning through adaptive rephrasing.

> "Woods and Kroger (2000: 73) who advocate that interviewers in such cases become 'interventionist' in nature 'by providing opportunities for the participant to produce the fullest account'." (p. 90)

## What Semi-Structure Costs

The semi-structured approach does not come free:

**Comparability is reduced.** Question 5 was asked differently to Rungnapa (brief, abrupt) than to Serm (with extended contextual framing). The responses are not strictly comparable — they were elicited by different stimuli. This is a genuine methodological cost, not a problem to be explained away.

**The interviewer's learning effects are baked into the data.** Because the interviewer adapted questions over time, the August interviews were conducted differently from the July interviews. Insights gained from the July interviews changed the August approach. This creates a systematic bias: later interviews are better-designed than earlier ones. There is no way to retrofit the earlier interviews with the improved design.

**Analyst subjectivity enters at the moment of deciding to extend or omit.** The decision to follow Komkrit's mathematics digression was a real-time judgment call. Another interviewer might not have followed it. The same topic might be pursued with one student and not another. These asymmetries are invisible in the final transcript unless documented.

> "My reaction to the potential criticism that I had gradually improved the contextual features of the interview... was that it was an inevitability that I took such actions since the failure to do so would have created a consistent liability." (p. 90-91)

## The "Framing" Problem

A specific finding from the data: the interviewer's "framing" moves — the contextualizing preambles he added to questions 5 and 7 after noticing comprehension difficulties with earlier students — were not part of the original script. They evolved in real time as a response to observed failure. They made the questions more comprehensible but also different.

This is an example of a general principle: **structured inquiry always contains implicit assumptions about the participant's knowledge state**. When those assumptions are wrong (the participant doesn't have the vocabulary, or doesn't share the conceptual framework the question assumes), the structured question fails. The semi-structured approach's flexibility allows recovery from these failures; the fully-structured approach does not.

## The Appropriate Level of Structure for Different Task Types

The thesis implicitly identifies a typology of tasks by appropriate structure level:

**Tasks requiring high structure**: Cross-interview comparison of specific behavioral patterns. For this, consistent coding is essential. The exchange-sequence representations in Appendix A2 are effective precisely because they apply the same coding consistently across all ten interviews, making cross-interview patterns visible.

**Tasks requiring low structure**: Discovery of unexpected patterns within individual interviews. For this, the eclectic application of "layers of insight" — applied in whatever order seems productive for the specific interview — is more effective than a rigid analytical sequence.

**Tasks requiring graduated structure**: Initial data collection, where you need both comparability (to aggregate across participants) and flexibility (to capture participant-specific information). The semi-structured interview is the appropriate instrument: a fixed core with adaptive periphery.

## The Relationship Between Structure and Validity

A provocative implication of the thesis: **standardized, reproducible interview designs may produce less valid data than adaptive, non-standardized ones**. If the purpose of an interview is to capture each participant's genuine knowledge, beliefs, and experiences, then a design that doesn't adapt to each participant will systematically miss what that participant uniquely brings.

The trade-off is between reliability (consistent results across replications) and validity (results that accurately capture what they claim to capture). Fully-structured inquiry optimizes for reliability. Semi-structured inquiry trades some reliability for validity.

> "Gorden (1969) calls this a standardisation of meaning which inevitably challenges the concept of interview reliability. Overall, this seems to concur with what Wolfson terms as the 'emergent' context of the interviewing process, making standardisation of interviewing technique impossible to achieve." (p. 51)

## The Role of Prompts

The thesis documents in detail the use of scripted prompts — prepared follow-up questions and elicitations to be deployed if the initial question doesn't produce sufficient response. Prompts serve several functions:

1. **Scaffolding for linguistically challenged participants**: When the initial question produces no response, a more specific, simpler prompt provides a smaller cognitive and linguistic challenge.

2. **Boundary-setting for the analytically capable**: When an extended response drifts from the topic, a targeted prompt can return attention to the specific aspect the interviewer needs.

3. **Consistency assurance**: By scripting the most likely follow-up paths, prompts ensure that the most important sub-topics are covered across participants, even if the primary question elicited only tangential responses.

The decision of *when* to use a prompt — whether the initial response was sufficient without it — is itself an analytical judgment that affected what data was gathered. Burin required prompts for almost every question; Serm required almost none. This difference is itself a finding about their linguistic and conceptual positions, but it also means that the same interview format produced structurally different interactions.

## Application to Agent Systems

**Design agent inquiry with a structured core and flexible periphery.** Fixed elements ensure coverage of essential information; flexible elements allow adaptation to what the source actually provides. Don't optimize for structural purity at the expense of adaptive capacity.

**Build scripted fallback paths for when primary inquiry fails.** When a request or question fails to produce the expected response, prepared follow-up probes provide scaffolding rather than leaving the interaction in a failure state. These probes should be designed with the most likely failure modes in mind.

**Distinguish between standardization of form and standardization of meaning.** When an agent adapts its phrasing to ensure the downstream system correctly interprets the request, this is good practice, not a reliability failure. The goal is mutual comprehension, not identical stimulus presentation.

**Document adaptation decisions as metadata.** When an agent adapts its approach mid-task — extending analysis of an unexpected pattern, simplifying a request because the target system seems to be struggling — this adaptation should be logged. The log of adaptations is itself analytically useful: it reveals where the original design was inadequate.

**Accept that learning effects are baked into sequential tasks.** An agent that handles a task type repeatedly will handle it better over time. The early instances in a sequence will be handled differently from the late instances. This is not a problem to be eliminated; it is a property to be tracked and made explicit in evaluating outputs.

**Validate through meaning, not form.** An agent that returns a well-formed response has satisfied formal requirements. An agent that returns a response that addresses the actual question has satisfied validity requirements. Evaluation systems should check both.