# Rapport as a Causal Mechanism: The Three-Stage Pathway from Tactic to Disclosure

## The Misconception About Rapport

"Rapport" is one of the most misunderstood concepts in both interviewing practice and system design. Practitioners often treat it as an optional social nicety — something that friendly interviewers do to make subjects feel comfortable, but orthogonal to the actual business of extracting information. This view is wrong in a specifically important way: it treats rapport as parallel to information elicitation, when the research shows it is *causally prior* to it.

Brimbal et al. (2021) embed rapport in a precise causal model: "rapport and trust-building tactics are less likely to directly influence information disclosure; instead, such tactics influence a subject's willingness to cooperate with an interviewer's questioning" (p. 57). The structural equation model in Figure 4 of the paper demonstrates this path empirically:

**Rapport Tactics → Perceived Rapport → Cooperation → Disclosure**

Each arrow in this chain is a necessary condition for the next. Skipping a step does not accelerate the process — it breaks it. An interviewer who tries to elicit information without first building perceived rapport is working against the causal mechanism, not with it. The system literally cannot produce the output that is desired without the intermediate states being established first.

## What Rapport Actually Is (Operationally)

The paper defines rapport broadly as "the relationship between the interviewer and subject with a generally positive exchange (Tickle-Degnen & Rosenthal, 1990); attentiveness toward one another's concerns (Kleinman, 2006); and the importance of developing respect and trust (Duke et al., 2018)" (p. 56).

But operational measurement is more precise. The 22-item composite measure used in the study included items assessing:
- Whether the interviewer was friendly
- Whether the interviewer was interested in the interviewee's point of view
- Whether the interviewer was empathetic
- Whether the interviewer was capable
- Whether the interviewer would be viewed as trustworthy by others

Notice what this measurement captures: rapport is not just warmth, and not just competence, but a combination of *relational orientation* (interest, empathy, friendliness) and *trustworthiness signals* (capability, reliability). Both are necessary. A highly competent interviewer who projects no relational interest will not generate sufficient rapport. A warm, friendly interviewer who is perceived as incompetent or untrustworthy will not generate sufficient cooperation.

This dual structure — relational + competence-trustworthiness — is crucial for agent system design. An agent that produces correct outputs but signals no awareness of or interest in the counterpart's state is the "competent but cold" interviewer. An agent that is highly accommodating but produces unreliable outputs is the "warm but untrustworthy" interviewer. Both fail.

## The Three-Stage Causal Chain in Detail

### Stage 1: Rapport Tactics → Perceived Rapport

Rapport tactics are specific, trainable behaviors. The study groups them into three categories (detailed in the next reference document), but the mechanism at this stage is straightforward: certain behaviors, consistently applied, reliably increase the counterpart's subjective experience of being in rapport with the actor.

The key finding is that this is *not* automatic. Pre-training investigators believed they were already building rapport (moderate familiarity ratings), but their pre-training behavior showed significantly less rapport-building activity than post-training behavior. The gap between believed rapport-building and actual rapport-building is real and large.

For agent systems: an agent cannot assume that its counterpart perceives it as trustworthy and cooperative simply because the agent believes itself to be trustworthy and cooperative. Perceived rapport must be actively generated through specific behaviors. It cannot be assumed.

### Stage 2: Perceived Rapport → Cooperation

This is the stage where the mechanism becomes most important for resistant counterparts. The paper's mediation model shows that "the use of rapport tactics indirectly increased both cooperation (b = .14, p = .02) and information disclosure (b = .31, p = .049)" through perceived rapport as the mediator.

Cooperation here is specifically operationalized as willingness: "How willing were you to provide the information that the interviewer specifically asked for?" and "How willing were you to provide additional details, even details beyond the interviewer's questions?" (p. 60). The second item is critical — it captures *proactive* disclosure, where the counterpart volunteers information beyond what was asked. This is the information that the questioning agent didn't know to ask for.

Proactive disclosure only occurs when cooperation is high. A resistant counterpart will answer narrow questions narrowly, omitting context, caveats, and adjacent information that the questioning agent doesn't know to request. High cooperation means the counterpart actively helps the agent get what it needs, including information the agent doesn't know it needs.

For agent systems: the goal of rapport-building is not just to get answers to known questions. It is to create the conditions under which the counterpart (sub-agent, API, human, or external system) will *volunteer* information that the orchestrating agent didn't know to ask for. This proactive disclosure is often the highest-value output in complex systems, because it surfaces unknown unknowns.

### Stage 3: Cooperation → Disclosure

The final stage is disclosure — the actual release of information. The study measures this against ground truth (35 known scenario facts), distinguishing between absent/incorrect (0), vague (1), and specific (2) disclosure.

The path from cooperation to disclosure is not automatic, even with high cooperation. The interviewer must still ask productive questions and provide space for the counterpart to respond fully. Cooperation creates *willingness* to disclose; the questioning structure determines *how much* of that willingness is converted into actual information.

This is the most actionable finding for agent design: even after rapport is built and cooperation is established, the query structure matters. Open-ended, non-leading queries with space for full response convert cooperation into disclosure. Closed, narrow, leading queries waste the cooperation that was hard-won in stages 1 and 2.

## The Model's Explanatory Power and Limits

The structural equation model in Brimbal et al. (2021) explained 17% of the variance in cooperation and 9% of the variance in information disclosure. These are modest but significant effects, and the authors are appropriately candid: "Rapport is likely not the only means by which interviewers could overcome resistance and increase information yield. For example, contextual factors that are independent of an interviewer's tactics can influence the reporting of information by interview subjects" (p. 63, citing Dawson et al., 2017; Dianiska et al., 2020).

This is an important caveat for agent system design: rapport tactics are not the only lever. The paper specifically notes that "elements of the Cognitive Interview, such as context reinstatement instructions, can directly increase the amount of information provided by an individual" (p. 57, citing Dianiska et al., 2020; Memon et al., 2010). Some questioning tactics work through a *direct* pathway to disclosure, bypassing the rapport-cooperation mediation chain entirely.

The distinction is this:
- **Rapport/trust tactics**: indirect pathway through cooperation (rapport → cooperation → disclosure)
- **Cognitive/elicitation tactics** (e.g., context reinstatement): direct pathway to disclosure, less dependent on cooperation

For a cooperative, willing counterpart, direct elicitation tactics are sufficient and more efficient. For a resistant counterpart, direct elicitation tactics alone are insufficient — you must first traverse the rapport-cooperation chain.

**Agent System Translation:**
- With cooperative sub-agents or systems: use direct, well-structured queries with cognitive elicitation techniques (context setting, structured retrieval prompts)
- With resistant, uncooperative, or unexpectedly constrained systems: deploy the rapport-building pathway first, then use elicitation
- With partially cooperative systems: assess which stage of the chain is the bottleneck before choosing tactics

## Measuring Whether Rapport Is Working

One practical challenge the paper surfaces is that rapport cannot be measured by the actor building it — it must be measured by the counterpart experiencing it. Investigators cannot assess whether the subject perceives rapport; they can only assess whether they themselves are using rapport-building behaviors.

This creates a measurement gap: behavior ≠ perceived rapport, and perceived rapport must be inferred indirectly from the counterpart's responses (increased willingness to elaborate, unprompted disclosures, reduced resistance signals).

For agent systems, this translates to: an agent cannot self-certify that it has successfully built rapport with a counterpart system. It must observe the counterpart's behavioral responses — specifically, whether the counterpart is becoming more forthcoming, volunteering information beyond what was asked, and reducing refusal or error rates — as the proxy signal for perceived rapport.

The behavioral signals of increasing cooperation in a counterpart system:
- Responses becoming more detailed and less minimal
- Information being volunteered beyond the scope of the query
- Error rates and refusal rates decreasing
- Response latency patterns shifting toward more engaged processing
- Unprompted caveats, context, and qualifications appearing

These are the analogs to the interviewee's self-report cooperation measures in the study. They are the measurement instruments an agent must use to assess whether the rapport pathway is functioning.