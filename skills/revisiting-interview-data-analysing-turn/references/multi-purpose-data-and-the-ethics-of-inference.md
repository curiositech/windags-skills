# Multi-Purpose Data and the Ethics of Inference

## Data Collected for One Purpose, Used for Another

A central ethical and methodological tension in Adamson's thesis: the interviews were collected with the explicit purpose of gathering information about learning strategies. The participants consented to this purpose. They were not informed that the interviews would later be analyzed for their turn-taking behavior — for how they spoke, not just what they said.

This creates a genuine ethical complexity that the thesis handles honestly:

> "The current study is one in which interviews originally transcribed for the purpose of finding out about students' learning strategies are further analysed in terms of the spoken discourse of the interaction taking place as my primary focus is upon how both participants in the interview situation take turns when communicating with one another." (p. 7-8)

The shift from content analysis to discourse analysis changes what is being studied from the interviewees' answers to their behavior as speakers. The participants consented to be informants about their learning strategies; they may not have consented to be analyzed as discourse subjects — as people whose patterns of hesitation, repair, and face-saving are now the data.

## The Anonymity Question

The thesis shows that full anonymity was not achieved. Students were asked whether they wanted to be referred to by their real names, nicknames, or pseudonyms — but most provided their actual names or nicknames, and these appear throughout the thesis. The thesis includes a consent form (Appendix A11) for Rungnapa, acknowledging that names would appear in research.

Adamson's defense:
> "I would argue, in defence, though, that those students were informed that their names may be published or made known in academic circles and no student requested confidentiality. Full briefing of research objectives, methodology (including taping) and where the report would appear and be read by was conducted before the interviews took place." (p. 103)

This defense is reasonable but incomplete. The question of whether students from a Thai cultural background, in an asymmetric relationship with their teacher, could genuinely decline to participate or request anonymity is not fully resolved. The thesis itself acknowledges that "the chance to refuse discretely without the perceived loss of 'face'... was, despite my advice... always possibly too difficult to take up" (p. 102).

## The Problem of "Preferred" Responses and Data Validity

The thesis returns repeatedly to the concept of "preferred" responses (Tsui 1994): responses that the interviewee believes the interviewer wants to hear, regardless of whether they reflect the interviewee's actual beliefs or experiences. If preferred responses are common — and the thesis provides substantial evidence that they are, particularly for Thai participants in asymmetric interactions — then the validity of the data as evidence about the interviewees' actual learning strategies is undermined.

This creates a recursive problem: the learning-strategies data (the first analysis) is partly invalid because the interaction structure created preferred responses. The turn-taking data (the second analysis) is partly a record of the same preferred-response production. Both analyses are working with data that is shaped by the very power dynamics the second analysis is now trying to understand.

> "Most staff and teachers mentioned the danger of students giving 'preferred' responses (Tsui 1994) to questions set by either Thai staff or western teachers." (p. 100)

The appropriate response is not to abandon the data but to annotate conclusions with uncertainty: findings derived from interaction data in asymmetric contexts must be held with awareness that some behavior may be performed rather than genuine.

## The Interviewer as Co-Author of the Data

A sophisticated methodological point that runs throughout the thesis: the data is not produced by the interviewees. It is co-produced by both participants. The interviewer's choice of questions, the order of questions, the decision to use a closed vs. open question, the provision of endorsing vs. acknowledging feedback, the decision to follow or not follow a topic extension — all of these shape what the interviewee produces.

> "The semi-structured interview is fundamentally a formal event in which the subject under discussion is agreed and... 'on record'. It differs from the ethnographic interview in that the interviewer shares a 'common frame of reference' with the interviewee." (p. 46)

The implication for data interpretation: conclusions about the interviewees cannot be cleanly separated from conclusions about the interaction. "This student has limited metacognitive awareness" may actually be "this student's metacognitive awareness was not accessible through this interviewer's question design." The two conclusions look the same in the data but imply very different interventions.

For any system that produces data by interacting with a source — whether that source is a human, another system, or a data environment — the same principle applies: **the data reflects the interaction, not just the source**. Attributing properties of the interaction to the source alone is a systematic inference error.

## Block's Distinction: Veridical vs. Symptomatic Interpretation

Block (2000), cited extensively in the thesis, provides a useful frame:

**Veridical interpretation**: Treating interview responses as reliable reports of actual events, beliefs, or strategies. The responses accurately represent the interviewee's genuine knowledge state.

**Symptomatic interpretation**: Treating interview responses as symptoms of the interviewee's relationship to the topic and to the interview context. The responses tell you about the dynamics of the interaction as much as about the content.

The thesis argues that both interpretations are simultaneously available and both are legitimate. The learning-strategies analysis was primarily veridical; the turn-taking analysis is primarily symptomatic. Neither is complete without the other.

> "This draws parallels between my learning strategies purpose — 'veridical' in nature — and the turn-taking research purpose — 'symptomatic' in nature." (p. 130)

The risk of exclusively veridical interpretation: taking face value as truth, missing the performed-comprehension and face-saving behaviors that make much of the data unreliable.

The risk of exclusively symptomatic interpretation: losing the content, treating every response as a symptom of relational dynamics rather than as genuine evidence about the subject matter.

## Whose Communicative Norms Dominate?

The thesis makes a strong claim about cultural hegemony in research contexts:

> "The fundamental question of exactly whose 'norms' are dominant, in operation, subdued or suppressed in the interview setting is related to the larger issue of 'cultural hegemony' (Briggs 1986). I feel, as a participant and researcher in this study, that some degree of an imposition of my interpretation of the interview as a speech event must have been present." (p. 198)

This is an honest acknowledgment that the researcher's communicative norms — their intuitions about what constitutes a complete answer, what counts as appropriate turn-taking, what silence means, what topic extension implies — shaped the data collection and the analysis. The "well-formedness" that the interviewer brings to the interaction is culturally constructed, not universal.

For any cross-context analysis — an agent analyzing text from a domain where it wasn't trained, an agent interpreting responses from a system with different communication conventions — the same point applies: the analyst's norms are not universal. Behavior that appears as anomaly from one normative framework may be correct behavior under a different framework.

## Application to Agent Systems

**Track data provenance through the interaction that produced it.** Data collected through structured queries reflects the structure of the queries, not just the underlying system state. Analysis of the data should account for this: what did the query design make visible, and what did it suppress?

**Build in uncertainty markers for inferences from asymmetric interaction data.** When data is collected in contexts where one party has significantly more power than the other, the data may reflect performed compliance rather than genuine state. Conclusions should be annotated with this uncertainty rather than treated as direct evidence of underlying states.

**Distinguish veridical from symptomatic analytical modes.** When analyzing outputs from another system, the analysis can be veridical (these outputs tell us about the system's capabilities and knowledge) or symptomatic (these outputs tell us about the relationship between the requesting context and the responding system). Both modes yield insights; mixing them without awareness produces confused conclusions.

**Implement "preferred response" detection.** In any interaction where one party can produce responses that appear to satisfy the requester's expectations without actually solving the problem, build detection mechanisms for this pattern. Signals: responses that are formally correct but substantively thin; sudden shifts from partial compliance to full compliance without clear reason; responses that echo the request's framing more than they address its content.

**Design interactions to minimize preference pressure.** When possible, structure requests so that "I don't know" or "I can't do this" is genuinely available as a response — not just formally available but practically available without social cost. Systems that punish non-compliance (by generating error states, triggering escalation, or producing negative feedback) will systematically suppress honest non-compliance signals.