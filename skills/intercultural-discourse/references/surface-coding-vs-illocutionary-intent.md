# The Gap Between Surface Coding and Illocutionary Intent

## The Core Problem

The most important thing happening in a conversation is frequently not visible in its surface features. Adamson's thesis documents this systematically: responses that appear positive are sometimes false comprehension; responses that appear negative are sometimes culturally-mandated face-saving; silences that appear to be mere gaps are sometimes suppressed breakdowns. Any analytical system that codes only surface features will be systematically wrong in exactly the situations that carry the most information.

> "To code such utterances as positive responses would belie the actual illocutionary intent of the respondent involved since the coding simply refers to the perlocutionary meaning taken up by the initiator." (p. 38-39)

The distinction here is Searle's (1969): *illocutionary intent* is what the speaker means to communicate; *perlocutionary uptake* is what the listener actually receives. A positive response (R+ve) may represent perfect illocutionary uptake — or it may represent a culturally-shaped suppression of the true illocutionary intent. The surface coding cannot distinguish between these cases.

## Specific Examples from the Data

**Example 1: The false comprehension response**
Nawarat, in question 4 of his interview, produces:
> "(thoughtful look)..I …don't know… but maybe."

This is initially coded as R-ve (negative response — unable to answer) but then shifts to R+ve (positive response — provides some answer). The surface reading: Nawarat recovers from momentary confusion and provides an answer. The deeper reading: Nawarat cannot answer but feels the pressure of interacting with an authority figure and performs comprehension rather than sustaining the face-threatening admission of non-comprehension.

The act-level coding partially captures this — 'qu' (qualify) signals tentativeness — but does not definitively distinguish genuine partial comprehension from performed comprehension. The cultural layer (krengjai — deference to authority, avoidance of face-threatening challenges) provides the interpretive key.

**Example 2: The short-answer problem**
Burin consistently provides minimal responses to open-ended questions. Surface reading: low linguistic ability, limited strategic awareness. The learning-strategies layer reveals that Burin was explicit about one thing: he believed singing was a valuable learning strategy and expressed this with great confidence. He is not globally passive or strategically unaware.

The turn-taking analysis, supplemented by Burin's educational background (secondary school, NNS-only classroom experience, large class sizes), suggests a different explanation: Burin has been socialized in a classroom environment where short, accurate answers to authority figures are the *correct* response and earn merit (bun). His brief answers are not failure — they are competence operating in the wrong context.

**Example 3: The suppressed breakdown**
Several interviewees show a pattern where a request for clarification begins but then transforms into a positive response. This is the most analytically important case in the thesis:

> "There appears to be a gap in the available categories... to denote repair which describes NNS, or indeed perhaps NS, responses which start to request repair but, due to the suddenly occurring concept of not wishing the NS initiator to lose face, transform falsely into a positive, or 'preferred' response." (p. 38)

This pattern has no existing code in any of the taxonomies Adamson uses. It requires *invention* of a new analytical category: the suppressed breakdown request. The interviewee begins to signal non-comprehension, then overrides that signal to perform comprehension. The surface coding shows only a positive response. The deeper analysis shows a moment of genuine cognitive gap covered by a cultural reflex.

## Why Surface Coding Persists Despite Its Limitations

Adamson is honest about why systematic coding at the surface level remains valuable despite its inadequacy:

1. **It is reproducible.** Surface codes can be applied consistently across large datasets. Illocutionary intent requires interpretation that varies by analyst, by context, and by available background information.

2. **It creates patterns visible across multiple instances.** The exchange sequence displays (Appendix A2) allow cross-interview comparison precisely because they use consistent surface codes. The patterns — question 4 has more communicative breakdown than question 9; the interviewer shifts to more open questions in August — are only detectable through consistent coding.

3. **It provides anchors for deeper analysis.** Surface codes are not the conclusion; they are the starting point. The question "why does this exchange show R-ve at this point?" triggers the interpretive process that uses the deeper layers.

The problem arises when surface coding is treated as *sufficient* rather than *necessary but insufficient*. Adamson's methodological contribution is precisely to insist that surface coding is always the beginning, never the end, of analysis.

## The Taxonomy Problem

A recurring theme in the thesis is the inadequacy of existing taxonomies for capturing the phenomena actually observed. Several specific gaps are identified:

**Missing: A code for linguistically vs. conceptually motivated breakdown.** The same observable behavior — requesting clarification — can arise from not knowing a word or from not understanding a concept. The treatment is different; the coding is the same.

**Missing: A code for the suppressed breakdown request** (described above). A response that begins as repair-seeking but is overridden to produce false compliance requires a new category.

**Missing: A code for interviewer utterance-completion** of interviewee's word. When Orathai's response "self-organi.." is completed by the interviewer, the exchange can only be coded as Ii:report — which is inadequate. A new code is needed.

**Missing: A code for responses that switch polarity within a turn.** Nawarat's R-ve...R+ve switch mid-response is treated as two consecutive exchange acts, but may be a single complex act requiring a compound coding.

> "An important insight can be best created for that purpose by visually displaying the exchange level sequences alongside other interviews." (p. 208)

The conclusion is that taxonomies grow from encounter with data. No pre-existing taxonomy is adequate to phenomena not encountered when the taxonomy was constructed. Analysts must be prepared to identify gaps and propose new categories.

## The Relevance of Gricean Maxims (and Their Limits)

Adamson engages extensively with Grice's cooperative maxims as a framework for understanding whether participants are communicating in good faith. The maxims (be truthful, be relevant, be clear, say no more than necessary) assume a cooperative rational participant sharing communicative norms with the other participant.

The problem in cross-cultural interaction: what counts as "cooperative" is culturally variable. The Thai participant who provides a false positive response is not violating the cooperative principle from their perspective — they are performing a different kind of cooperation, one oriented to preserving the social fabric of the interaction rather than maximizing informational accuracy. Clyne (1994, cited in the thesis) notes the revision needed: cooperative norms must be understood "within the bounds of the discourse parameters of the given culture."

> "Perhaps Allan's (1991 as cited in Clyne 1994: 11) cautionary advice to regard these maxims as 'reference points for language interchange' rather than 'laws to be obeyed' is a more suitable perspective." (p. 32)

For analytical systems: surface behavioral norms (what counts as a valid response, a complete answer, a successful repair) are always culturally situated. An agent analyzing human communication — or another agent's output — must hold open the possibility that the surface behavior conforms to local cooperative norms rather than the analyst's default norms.

## Application to Agent Systems

**Treat surface-level classifications as hypotheses, not conclusions.** A response categorized as "positive" or "compliant" should trigger a secondary analysis: Is there evidence that this classification captures the underlying intent? What alternative interpretations would also be consistent with the surface behavior?

**Build in explicit handling for the false-positive response pattern.** In human-agent interaction and inter-agent communication, agents may produce responses that appear compliant but actually indicate non-comprehension or incapacity. Design systems to detect the signals of this pattern: hedging language, excessive brevity for an open-ended question, sudden shift from hesitancy to confident assertion.

**Recognize that taxonomies require extension as new phenomena are encountered.** No pre-built taxonomy is adequate to all phenomena. Build agents that can identify when existing categories fail — when the best available code is "approximately this" rather than "exactly this" — and flag these cases for taxonomy extension or human review.

**Distinguish between linguistic and conceptual breakdown.** An agent that fails to parse a request may fail because the syntax is unclear or because the concept is unfamiliar. The repair strategy differs: syntactic clarification vs. conceptual explanation. Systems that conflate these failure modes will apply the wrong repair consistently.

**Surface compliance does not imply deep understanding.** In inter-agent protocols, an agent that returns a well-formed response may still have misunderstood the request. Verification of actual task completion requires looking at outputs, not just at response formatting.