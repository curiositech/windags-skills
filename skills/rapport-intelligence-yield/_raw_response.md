## BOOK IDENTITY

**Title**: "The Impact of Rapport on Intelligence Yield: Police Source Handler Telephone Interactions with Covert Human Intelligence Sources"
**Author**: Jordan Nunan, Ian Stanier, Rebecca Milne, Andrea Shawyer, Dave Walsh, and Brandon May
**Core Question**: Which specific communicative behaviors actually drive information disclosure in high-stakes human intelligence relationships — and can those behaviors be systematically measured, taught, and optimized?
**Irreplaceable Contribution**: This paper provides one of the only empirical studies of *real-world covert intelligence interactions* — not lab simulations, not self-report surveys, but 105 actual recorded telephone calls between police handlers and their informants. It quantifies rapport into three measurable behavioral components (attention, positivity, coordination), then directly correlates each component to granular intelligence yield across five detail types. The result is a rare bridge between psychological theory and operational reality: a falsifiable, behaviorally-specific model of how trust-based information elicitation actually works. Crucially, it overturns the practitioner consensus that positivity (warmth, friendliness, empathy) is the most important rapport component — demonstrating instead that *attention* and *coordination* drive yield, while positivity, though interpersonally valuable, does not statistically predict information output.

---

## KEY IDEAS (3-5 sentences each)

1. **Rapport is not a feeling — it is a behavioral frequency.** The paper operationalizes rapport as countable verbal acts: back-channel responses, paraphrasing, probing, agreement signals, procedural framing. This transforms rapport from a vague interpersonal quality into a measurable, auditable, trainable output. For agent systems, this is the crucial insight: relationship quality can be monitored through behavioral proxies, not just subjective assessment.

2. **Attention dominates yield — not warmth.** Attention (active listening, probing, summarizing, exploring motivation) explained 69% of variance in intelligence yield, while positivity (empathy, humor, friendliness) explained only 4%. The practitioner assumption that "being warm gets people talking" is empirically weak. What actually works is *demonstrating engagement* — showing the source that what they say is being processed, remembered, and acted upon.

3. **Coordination creates the conditions for transfer.** Coordination — shared goal-framing, agreed process, appropriate pausing, encouraging the other party to speak — is the structural scaffold of a productive exchange. Though used least frequently by handlers, it significantly correlated with yield. It operationalizes the "working alliance": both parties knowing why they're talking and what success looks like.

4. **Self-report is systematically unreliable about one's own behavior.** Police officers consistently report using rapport-building behaviors that, when their recordings are examined, are not present. This gap between perceived practice and actual practice is a central methodological lesson: systems cannot self-report their way to quality. Behavioral auditing of actual outputs is necessary.

5. **Intelligence yield is decomposable.** The paper codes yield into five granular detail types: surrounding (location), object, person, action, and temporal. This taxonomy reveals that different rapport components differentially predict different kinds of information — attention strongly predicts all five types, while coordination specifically predicts action and temporal details. Decomposing "output quality" into typed sub-categories reveals invisible structure in what looks like a single outcome.

---

## REFERENCE DOCUMENTS

### FILE: rapport-as-behavioral-frequency-not-feeling.md
```markdown
# Rapport as Behavioral Frequency, Not Feeling: A Framework for Measuring Relational Quality in Agent Interactions

## The Problem with Treating Rapport as a Global State

In both human intelligence practice and AI system design, there is a persistent temptation to treat relational quality — the degree to which two parties are working well together — as a gestalt, holistic property. A handler "has good rapport" with a source. An agent "is aligned" with a user. A conversation "went well." These impressionistic judgments are nearly useless for system improvement, because they cannot be decomposed, measured, targeted, or trained.

Nunan et al. (2020) present an empirically grounded alternative: **rapport is a behavioral frequency, not a psychological state.** It is constituted by specific, countable, categorizable verbal acts. And crucially, different categories of those acts have dramatically different relationships to the outcome of interest — information yield.

This is one of the paper's most transferable contributions to agent system design. The lesson is not merely "build rapport." The lesson is: *identify which specific behaviors constitute rapport in your domain, measure their frequencies, and correlate them to your actual output quality metrics.* Then you know where to invest.

## The Three-Component Model (Tickle-Degnen & Rosenthal, Applied)

The paper operationalizes rapport through Tickle-Degnen and Rosenthal's (1990) tripartite model, adapted for intelligence contexts:

**Attention** — The degree of involvement, demonstrated through behavioral acts that show the source handler is actively processing what the CHIS says:
- Back-channel responses ("hmm," "uh huh") — facilitators that signal ongoing reception without interrupting
- Paraphrasing — repeating back the source's words to demonstrate processing
- Identifying emotions — attending to the affective state of the source ("you sound upset")
- Exploring and probing — going beyond surface information to seek provenance and detail
- Intermittent summarizing — regularly and accurately resuming key points
- Final summary — a closing synthesis of the interaction
- Asking if the source wishes to add or alter anything — creating space for completion
- Exploring motivation — understanding *why* the source is cooperating, to use as a lever for deepening engagement

**Positivity** — The friendly, respectful, and caring character of the interaction:
- Use of the source's preferred name
- Empathy — sensitive, responsive acknowledgment of emotional states
- Self-disclosure — sharing appropriate personal information to build reciprocity
- Finding common ground — identifying overlapping interests, values, or experiences
- Equality signals and friendliness — matching the source's register, avoiding condescension, using courtesy phrases
- Humor — when genuinely received as positive
- Reassurance — encouragement and comfort when the source is uncertain or anxious

**Coordination** — The smoothness and shared directionality of the interaction:
- Agreement — explicit alignment on goals, meanings, and next steps
- Encouraging the source to give their account — explicitly inviting narrative and allowing it without inappropriate interruption
- Appropriate use of pauses — allowing silence to function as an invitation rather than filling it
- Process and procedural framing — explaining what will happen, security requirements, future contact expectations, and tasking

Each verbal behavior from the handler was coded into exactly one of these three categories. The sum of each category was calculated per interaction. Pearson correlations were then run against overall intelligence yield and each of the five yield subtypes.

## The Empirical Findings: What Actually Predicts Output

The results overturn the practitioner consensus. Among the three components:

| Component | Correlation with Overall IY | Variance Explained (R²) |
|-----------|---------------------------|------------------------|
| Attention | r = .83, p < .001 | 69% |
| Coordination | r = .21, p = .028 | 5% |
| Positivity | r = .19, p = .051 (NS) | 4% |
| Overall Rapport | r = .69, p < .001 | 48% |

Attention is not merely the most important component — it is dominant. A single behavioral category (active listening, probing, summarizing) explains 69% of the variance in how much intelligence a handler extracts from a source. Positivity — the category that practitioners typically emphasize most, the one that includes empathy, warmth, and friendliness — is statistically non-significant as a predictor of yield.

This does not mean positivity is irrelevant. The authors note that "positivity should not be disregarded, as these behaviours may serve a different purpose within interviewing, such as empathy, respect and reassurance to the CHIS" (p. 14). But its purpose is *relational maintenance*, not *information extraction*. It keeps the channel open; it does not increase the bandwidth.

Coordination, despite being the least frequently used component (mean = 10.12 acts per call, compared to attention's 24.77), was statistically significant — and its association with *action* details (r = .24) and *temporal* details (r = .23) suggests it specifically helps extract *narrative sequence* information: what happened, in what order, when.

## Implications for Agent System Design: The Behavioral Audit Principle

### Replace Global Quality Assessments with Behavioral Frequency Tracking

When an agent system evaluates the quality of its own interactions — whether with users, with other agents, or with external data sources — it is tempting to use holistic ratings: "this interaction was productive / unproductive," "the user seemed satisfied," "the source was cooperative." These ratings are almost certainly unreliable (see the self-report problem documented extensively in this paper).

The alternative is to build a **behavioral frequency ledger**: a structured log of which specific communicative behaviors were deployed, in which proportions, at which moments in the interaction. This ledger becomes the diagnostic substrate. When yield is low, you do not ask "what went wrong in general?" You ask: "which behavioral frequencies were below baseline, and in which categories?"

### Distinguish Relational Maintenance Behaviors from Yield-Driving Behaviors

The paper's most actionable finding for agent design is the distinction between:
- **Channel-maintenance behaviors** (positivity): keep the relationship viable, prevent deterioration, signal safety and respect — but do not drive output
- **Yield-driving behaviors** (attention, coordination): directly cause the source to produce more and richer information

In agent system terms: some behaviors are about *keeping a collaboration alive*; others are about *extracting value from it*. Conflating these is a design error. An agent that invests heavily in friendliness signals while under-investing in active processing and goal-framing will maintain pleasant relationships that produce thin outputs.

For a WinDAGs orchestration system specifically:
- **Attention behaviors** map to: active parsing of upstream agent outputs, explicit acknowledgment of what was received, probing follow-up queries that request elaboration or provenance, summarization loops that demonstrate comprehension before proceeding
- **Coordination behaviors** map to: explicit goal-alignment at the start of agent-to-agent handoffs, process transparency ("here is what I will do with what you give me"), appropriate latency before demanding output, shared definition of what success looks like for this subtask
- **Positivity behaviors** map to: tone calibration, acknowledgment of effort, graceful handling of partial or uncertain outputs — important for long-running agent relationships but not the primary driver of output quality

### Build the Taxonomy Before You Build the Metric

One of the paper's methodological contributions is demonstrating that you must *first* construct a theoretically grounded behavioral taxonomy, *then* operationalize measurement, *then* correlate to outcome. Skipping the taxonomy step — going directly to holistic ratings or vague "helpfulness scores" — produces uninterpretable data.

For any agent capability that involves eliciting output from another system (human user, another agent, an API, a knowledge base), the design question should be: *What are the specific behavioral categories that constitute "good elicitation" in this context? Can we enumerate them? Can we count them?*

## The Attention Subsystem in Detail: What Active Processing Actually Looks Like

Because attention explains 69% of yield variance, it is worth unpacking what "attention" actually means behaviorally — and what its agent-system equivalent would be.

The key insight is that attention behaviors do two things simultaneously:
1. They **signal to the source** that their output is being processed (which increases their willingness to produce more)
2. They **actually process the source's output** more deeply (which increases the handler's ability to ask better follow-up questions)

Back-channel responses do the first. Paraphrasing and probing do both. Intermittent summarizing and final summary especially do both — they demonstrate processing *and* create an opportunity for the source to correct, refine, or expand.

The **probing** behavior is particularly important: "Goes beyond just accepting information but searches for further detail, identifying the provenance of the information provided, funnel from open to closed questioning" (Table 1). This is the behavior that transforms a passive reception relationship into an active extraction partnership. The handler is not a recorder; the handler is an intelligent interrogator of what has been received.

The **motivation exploration** behavior is also distinctive: "Tries to find, with understanding, why the CHIS is willing to share their information and also use the CHIS' motivation for the conversation. Source handler may use the motivation as a hook for cooperation" (Table 1). This is metacognitive attention — attention not just to *what* the source says but to *why* they are saying it, which then feeds back into how to ask for more.

In agent system terms, this translates to: **agents should not just receive outputs from other agents — they should model why those agents produced the outputs they did, and use that model to refine their requests.**

## Boundary Conditions and Caveats

This framework does not apply universally:

1. **Established vs. new relationships**: The paper notes that positivity may matter more in *early* interactions when relationship formation is still occurring. Attention and coordination dominate in ongoing relationships where baseline trust already exists. Agent systems with new human users may need to invest more in positivity initially.

2. **Cooperative vs. adversarial sources**: The CHIS in this study were cooperative informants in ongoing relationships with their handlers. The rapport dynamics in adversarial or neutral relationships may differ significantly. The paper's findings on terrorist suspect interviews (from Alison et al., 2013) do show attention-oriented techniques working even in adversarial contexts, but the effect sizes may differ.

3. **Medium effects**: Even attention, with r = .83, leaves 31% of yield variance unexplained. "Numerous factors may act as a communication barrier or encourager (e.g. elicitation techniques, interviewees' motivation to engage, memory, policy and procedures)" (p. 12). Rapport is necessary but not sufficient.

4. **Verbal channel only**: The study analyzed telephone interactions, so only verbal behaviors could be coded. Nonverbal rapport signals (eye contact, mirroring, physical proximity) could not be examined and may contribute significantly in face-to-face contexts.

## Conclusion

The paper's deepest methodological contribution is demonstrating that a vague, intuitive concept (rapport) can be transformed into a measurable, falsifiable, trainable behavioral system — and that when you do this transformation, you often discover that your intuitions about what matters most were wrong. Warmth matters, but attention and coordination drive yield.

For agent systems: **stop asking whether agents are "aligned" or "cooperative" and start asking which specific communicative behaviors they are deploying, at what frequencies, in which proportions.** Build the taxonomy. Count the behaviors. Correlate to output. Optimize on what actually predicts results, not on what practitioners assume matters.
```

### FILE: attention-dominates-yield-active-processing-over-warmth.md
```markdown
# Attention Dominates Yield: Why Active Processing Outperforms Warmth in Information-Elicitation Systems

## The Counterintuitive Finding

In virtually every practitioner survey on intelligence interviewing, rapport is discussed primarily in terms of warmth, friendliness, and empathy. Building rapport means being likeable. Being likeable means the source trusts you. Trust produces disclosure.

This logic is not wrong — but it is incomplete in a way that has enormous practical consequences. Nunan et al. (2020) demonstrate empirically that **positivity behaviors** (the behavioral operationalization of warmth, friendliness, and empathy) explain only **4% of the variance** in intelligence yield. **Attention behaviors** — active listening, paraphrasing, probing, summarizing — explain **69% of the variance**.

The gap is not subtle. Attention is not one useful technique among several. It is the dominant driver, by an order of magnitude, of how much useful information flows from a source to a handler.

This finding has profound implications for any system — human or artificial — that must elicit high-quality information from another party. The question is not primarily "are you warm enough to be trusted?" The question is "are you processing well enough to signal that what is being said matters, and to extract its full depth?"

## What Attention Actually Is (Behaviorally)

The paper's coding framework (Table 1) defines eight specific behaviors that constitute the attention component:

### 1. Back-Channel Responses
"Back channel responses act as facilitators/encouragers, e.g. 'uh huh' or 'hmm'" — explicitly excluding "qualitative feedback such as 'perfect' or 'good' as these can be viewed as leading and therefore negative."

The distinction here is subtle but important. "Hmm" says *I am receiving you.* "Perfect" says *I am judging you.* The former invites more; the latter potentially distorts the source's subsequent output toward what they perceive the handler wants to hear. Back-channel responses are the minimal unit of attention — the acknowledgment that transmission is being received.

### 2. Paraphrasing
"Repeating back what the CHIS said, which demonstrates the source handler has clearly attempted to process what the CHIS is saying."

Paraphrasing does something more complex than back-channel responses: it proves processing, not just reception. When a handler paraphrases accurately, the source receives confirmation that their meaning — not just their words — has been received. This also creates an error-correction opportunity: if the paraphrase is wrong, the source is prompted to clarify.

### 3. Identifying Emotions
"The source handler attends to the CHIS' emotions, e.g. 'you sound upset.'"

This is attentiveness at the metalevel — attending not just to the informational content of what the source says, but to their affective state. Naming an emotion serves two functions: it demonstrates that the handler is reading the source at a deeper level than surface content, and it creates space for the emotional state to be addressed before it becomes a barrier to information flow.

### 4. Exploring and Probing Information
"Goes beyond just accepting information but searches for further detail, identifying the provenance of the information provided, funnel from open to closed questioning."

This is the most cognitively demanding attention behavior, and arguably the most important. Probing transforms the handler from a passive recorder into an active excavator. The key phrase is "identifying the provenance" — not just *what* the source knows, but *how they know it*, *when they observed it*, *who else was present*, *what their confidence level is*. This is how raw information becomes structured intelligence.

The "funnel from open to closed" methodology is also critical: begin with broad, open invitations ("tell me what you observed") that avoid contaminating the source's recall, then progressively narrow with more specific probes to fill gaps and test consistency.

### 5. Intermittent Summarizing
"Provides regular and accurate summarising of the CHIS' account."

Intermittent summarization serves as a running comprehension checkpoint. It demonstrates to the source that the handler is not just collecting words but building a model of what has been said. It also helps the source organize their own memory retrieval — hearing what they've already said can trigger additional recall.

### 6. Final Summary
"Final summary that accurately resumes key issues discussed and captures key proses from the CHIS."

The final summary is the culminating act of attention — a demonstration that the entire interaction has been held in working memory, processed, and can be articulated back. It also functions as a quality check: discrepancies between the final summary and the source's recollection create opportunities for correction.

### 7. Asking if the CHIS Wishes to Add or Alter Anything
"Provides opportunity for the CHIS to make any amendments or additions to their account."

This is the grammatical close of the attention sequence — an explicit signal that the handler has not declared the account complete on the source's behalf. It respects the source's epistemic authority over their own knowledge and creates a final window for additional disclosure.

### 8. Exploring Motivation
"Tries to find, with understanding, why the CHIS is willing to share their information and also use the CHIS' motivation for the conversation. Source handler may use the motivation as a hook for cooperation."

This is the most strategically sophisticated attention behavior. It is attention directed not at the object of the source's knowledge (the criminal activity) but at the subject of the relationship itself (why the source is cooperating). Understanding a source's motivation — financial reward, desire for protection, loyalty, revenge, ideology — allows the handler to tailor subsequent interactions to reinforce those motivations. It is metacognitive attention: listening not just to what is said but to why it is being said at all.

## The Mechanism: Why Attention Drives Yield

The paper offers a clear causal hypothesis for why attention behaviors produce more intelligence: "The appropriate deployment of attentive behaviours should motivate the CHIS to engage with memory retrieval, thus benefiting the collection of intelligence" (p. 12).

This mechanism operates at multiple levels simultaneously:

**Level 1: Social Reinforcement.** When a handler demonstrates that the source's information is being carefully received and processed, the source receives social confirmation that talking is worthwhile. Attention behaviors are the handler saying, in behavioral terms: *what you know matters, I am treating it seriously, keep going.* This reinforces disclosure behavior.

**Level 2: Epistemic Partnership.** Probing and paraphrasing create a collaborative sense-making dynamic. The source is not simply depositing information into a passive container — they are working with the handler to build a shared understanding. This activates more elaborate cognitive processing in the source, which often surfaces additional memories and details that would not have emerged under simple question-and-answer conditions.

**Level 3: Error Correction.** Summarizing and paraphrasing create checkpoints where inaccuracies in the handler's model of what the source said can be corrected by the source. This is not just about accuracy — the act of correction often triggers additional disclosure, as the source elaborates to ensure they have been understood correctly.

**Level 4: Memory Facilitation.** There is substantial evidence from cognitive interview research (Fisher & Geiselman, 1992; Milne & Bull, 1999) that active listening techniques directly facilitate autobiographical memory retrieval. When someone hears an accurate summary of what they have said so far, they are cued to access associated memories that have not yet been verbalized.

## The Positivity Paradox: Why Warmth Is Necessary but Insufficient

Positivity's failure to significantly predict yield is perhaps the most important finding in this paper. Why does warmth not drive disclosure more directly?

The paper offers a hypothesis: "the increased familiarity may have resulted in a reduced impact of positivity, as it may not have been considered to be as important as coordination or attention" (p. 13). In established relationships, warmth is a baseline expectation rather than a differentiating signal. It is the floor of the relationship, not its ceiling.

More fundamentally, positivity behaviors — empathy, humor, common ground, friendliness — are primarily about the *affective quality* of the relationship, not its *epistemic quality*. They make the source feel valued, safe, and respected. These are necessary preconditions for disclosure, but they do not themselves prompt the source to access and articulate deeper, more detailed, more nuanced information.

A source can feel very warmly toward a handler and still provide shallow, vague information — if the handler never asks follow-up questions, never paraphrases, never summarizes, never probes for provenance. Attention behaviors are what convert a willingness to disclose into actual, detailed disclosure.

The practical implication: **do not invest in positivity at the expense of attention**. Warmth is a prerequisite, not a substitute. Once the relational floor is established, the dominant investment should be in active processing behaviors.

## Differential Yield by Detail Type: What Attention Extracts

The paper goes further than simply correlating rapport with overall yield — it correlates each rapport component with each of five intelligence yield subtypes:

| Rapport Component | Surrounding (location) | Object | Person | Action | Temporal |
|------------------|----------------------|--------|--------|--------|----------|
| Attention | r = .64*** | r = .77*** | r = .76*** | r = .81*** | r = .60*** |
| Positivity | r = .18 (NS) | r = .12 (NS) | r = .17 (NS) | r = .23* | r = .06 (NS) |
| Coordination | r = .12 (NS) | r = .18 (NS) | r = .18 (NS) | r = .24* | r = .23* |

Attention correlates significantly with all five detail types, with the strongest correlation for *action* details (r = .81) — information about what people did. This makes intuitive sense: probing behaviors are most important for extracting sequential behavioral information (who did what, in what order, how), which is the hardest kind of information to surface from memory.

Coordination specifically predicts *action* and *temporal* details — which suggests that providing process structure and shared goal-framing helps sources organize their accounts along narrative dimensions (what happened when).

This granular analysis has important implications for agent systems: **different elicitation behaviors differentially extract different kinds of information**. If your system needs temporal or causal information specifically, coordination behaviors are disproportionately valuable. If you need comprehensive coverage across all information types, attention is the dominant investment.

## Agent System Applications

### Active Processing as a First-Class System Function

In a WinDAGs orchestration context, agents frequently receive outputs from other agents or from users. The default behavior in poorly designed systems is *passive reception*: receive the output, pass it downstream, treat it as complete. This is the agent-system equivalent of a handler who accepts whatever the source says without probing.

The attention framework prescribes something fundamentally different: **active processing should be an explicit, designed-in system behavior**, not something that happens incidentally. This means:

- **Receipt acknowledgment**: Every agent receiving an output should have a mechanism for signaling receipt (the back-channel equivalent) before acting on it
- **Paraphrase-before-proceeding**: Before acting on complex instructions or information, agents should generate a paraphrase of what they understood and make that available for validation
- **Probing loops**: When an agent receives information that is incomplete, vague, or whose provenance is unclear, there should be a structured follow-up mechanism that requests elaboration — not just once, but iteratively, funneling from open ("tell me more about X") to closed ("specifically, was this on Tuesday or Wednesday?")
- **Summarization checkpoints**: At defined intervals in a complex task, an agent should produce an intermediate summary of what it has received and processed so far, creating an error-correction opportunity
- **Closure query**: Before finalizing an interaction, agents should have a closing query mechanism equivalent to "is there anything else you want to add or change?"

### Probing as the Core Elicitation Skill

The probing behavior — "goes beyond just accepting information but searches for further detail, identifying the provenance" — is the single most important attention behavior to build into agent systems that interface with human users or with less-capable agent outputs.

The provenance question is particularly important in AI contexts: not just *what does this agent/user believe*, but *how confident are they, what is the source of their belief, have they verified this, what would change their view?* These metacognitive probes dramatically increase the signal quality of information flowing through the system.

### Motivation Modeling as Strategic Intelligence

The motivation exploration behavior has a direct analog in agent system design: **modeling why a user or upstream agent produced a particular output** in order to better predict what additional inputs would be most valuable.

If an agent can infer from a user's queries that they are trying to accomplish a specific goal (not just answer the immediate question), it can structure its follow-up to surface information relevant to that deeper goal — even if the user hasn't explicitly requested it. This is the agent-system version of a handler who uses their understanding of the source's motivation as a hook for deeper cooperation.

## Conclusion

The paper establishes with empirical rigor what expert practitioners intuitively know but rarely articulate precisely: **it is not how much you are liked that drives information flow — it is how actively and visibly you are processing what you receive.** Attention behaviors constitute proof-of-processing, and proof-of-processing is what motivates sources to invest in providing better, richer, more complete information.

For AI agent systems, the design implication is clear: **active processing must be architecturally explicit**. It cannot be assumed to happen implicitly. Receipt acknowledgment, paraphrasing, probing, summarization, and motivation modeling are not optional refinements — they are the behavioral mechanisms through which information-elicitation systems achieve high yield.

Design for attention first. Let warmth be the floor, not the investment thesis.
```

### FILE: coordination-shared-goal-structure-enables-transfer.md
```markdown
# Coordination and Shared Goal-Structure: The Scaffold That Makes Information Transfer Possible

## The Underappreciated Component

In the Tickle-Degnen and Rosenthal model of rapport, and in Nunan et al.'s empirical application of it, coordination occupies a peculiar position: it is the least frequently deployed component (mean = 10.12 acts per call, compared to attention's 24.77 and positivity's 12.21), yet it is statistically significant as a predictor of intelligence yield, and its specific predictive relationship with *action* and *temporal* details suggests a distinctive functional role.

Understanding coordination — what it is, why it matters, why it is underused, and what happens when it is absent — is essential for designing any system in which two parties must work together toward a shared output. For AI orchestration systems, coordination behaviors map directly onto the structural scaffolding that enables productive agent-to-agent and agent-to-human collaboration.

## What Coordination Means (Behaviorally)

The paper defines four specific coordination behaviors:

### 1. Agreement
"Working towards a common goal or working alliance e.g. 'yeah that is what I meant.'"

Agreement behaviors are the explicit verbal acknowledgment of shared understanding. They are different from back-channel responses (which signal ongoing reception) — agreement specifically marks convergence on *meaning* or *direction*. When a handler says "yes, that's exactly what I was asking about" or "right, so we're both talking about the same person," they are creating a shared reference point that anchors subsequent information exchange.

The phrase "working alliance" is important here. A working alliance, as the paper discusses drawing on clinical psychology literature, means both parties understand they have shared goals and are cooperating to achieve them. Agreement behaviors are how that alliance is enacted and renewed throughout an interaction.

### 2. Encouraging the Source to Give Their Account
"Evidence of explicitly asking the CHIS for their account and allowing the CHIS to give it without any inappropriate interruptions."

This behavior has two components: the explicit invitation and the disciplined restraint. The invitation ("tell me what you know about X") transfers narrative control to the source. The restraint — not interrupting — maintains that transfer. Premature interruption is a coordination failure: it signals that the handler's agenda is overriding the source's natural narrative, which typically results in shorter, more constrained accounts.

The paper notes the general principle: "if the interviewee is predominantly doing the talking, then the transfer of control has been successful. Therefore, the individual with the information is talking" (p. 6). This is a profound reframing of the handler's role — success is measured not by how much the handler says but by how much the source says.

### 3. Appropriate Use of Pauses
"Source handler uses pauses to facilitate talking, which are not awkwardly placed."

Silence, deliberately deployed, is an invitation. When a handler asks a question and then waits — genuinely waits, resisting the impulse to fill the silence — they create space for the source to think, to retrieve additional detail, and to speak. Conversely, when handlers rush to fill silence with their own words or with additional questions before the source has finished processing, they interrupt the source's cognitive work and truncate the account.

The qualifier "not awkwardly placed" is important: pauses must be timed to occur after natural completion points, not in the middle of a source's narrative. A pause at the wrong moment is disruptive; a pause at the right moment is generative.

### 4. Process, Procedure, and What Happens Next
"Explains future agenda and processes, any necessary regulatory requirements such as 'don't tell anyone about this conversation', maintain security and welfare, when to next contact, and future taskings."

This is the most distinctly structural coordination behavior — the explicit framing of the interaction's purpose, constraints, and continuation. It encompasses:
- *Security requirements*: what the source should and should not tell others
- *Welfare assurance*: what the handler will do to protect the source
- *Future contact planning*: when and how they will communicate next
- *Taskings*: what the handler is asking the source to do or observe before their next contact

This behavior does something that no amount of warmth or attentiveness can achieve: it establishes a *shared operational frame*. Both parties know why they are talking, what they are trying to accomplish, what constraints govern the interaction, and what happens next. This shared frame is the structural prerequisite for efficient, targeted information exchange.

## The Working Alliance Concept: Why Shared Goals Precede Effective Exchange

The paper draws on the concept of the "working alliance" from clinical psychology — the therapeutic relationship in which client and therapist have shared goals, agree on the means of pursuing them, and maintain a bond of mutual respect and commitment. This concept, adapted to intelligence contexts by Kleinman (2006) as "operational accord," describes what coordination behaviors are trying to create.

A working alliance differs from a merely pleasant relationship. Two people can like each other enormously and still fail to work effectively together because they have different, unacknowledged goals. A source may believe they are providing information that will be used one way; the handler may intend to use it differently. A working alliance requires explicit negotiation and agreement on purpose — and that negotiation is what coordination behaviors accomplish.

Abbe and Brandon (2013) introduced the concept of "shared understanding" into the coordination component: "a shared understanding between the parties can be pre-existing or established during the interaction. A shared understanding (e.g. agreement) reinforces the common goal or working alliance mentality, especially when the purpose of the interaction and developing relationship are discussed" (p. 6).

This is a deep insight: shared understanding can be established at the start of a relationship, or it can be built dynamically *during* a specific interaction. Coordination behaviors are the mechanism for the latter — they are the conversational moves by which two parties continually check and update their alignment on what they are doing and why.

## Why Coordination Is Underused (And What That Costs)

The paper reports that coordination was the least frequently used rapport component — mean of 10.12 acts per call, compared to attention's 24.77. Moreover, "source handlers rarely used pauses to facilitate communication and on occasions interrupted their CHIS" (p. 13).

Why is coordination underused? The paper implies several reasons:

**1. Formality norms**: In formal investigative interviews (the Collins & Carthy sample), coordination behaviors like process/procedure explanation are mandated by legal requirements (PACE). In informal telephone interactions between handlers and CHIS, there is no formal requirement for these explanations, so handlers may omit them. The absence of external structure creates a space that handlers do not fill with intentional coordination.

**2. Comfort with positivity**: Practitioners tend to default to what feels natural in a friendly relationship — warmth, humor, friendliness. Coordination requires a more deliberate, structural approach that can feel overly formal in informal contexts.

**3. Urgency bias**: When a handler knows their source has relevant information, there is pressure to get to that information quickly. Coordination behaviors (pauses, process explanations, goal alignment) can feel like delays when the goal is obvious to the handler — but the goal may not be equally obvious or clearly framed for the source.

**4. Interruption habits**: The paper specifically notes that handlers "on occasions interrupted their CHIS." Interruption is perhaps the single most common coordination failure — it signals that the handler's mental model of the conversation has overridden the source's right to complete their account. It produces truncated, less-detailed outputs.

The cost of underusing coordination is not equally distributed across information types. Coordination specifically predicts *action* details (r = .24) and *temporal* details (r = .23) — the sequential, chronological, narrative information about what happened and when. This makes sense: action and temporal details require the source to construct a coherent narrative sequence, which is cognitively demanding and benefits from clear goal-framing, appropriate pacing, and non-interruption.

## The Transfer-of-Control Principle

The paper articulates a principle that deserves to be stated explicitly: **in an elicitation interaction, success is measured by who is talking.** "If the interviewee is predominantly doing the talking, then the transfer of control has been successful. Therefore, the individual with the information is talking" (p. 6).

This inverts the naive intuition about expertise in interviews. The expert handler is not the one who asks the cleverest questions or maintains the most engaging presence. The expert handler is the one who, through coordination behaviors, transfers the conversational control to the source and sustains that transfer throughout the interaction.

Transfer of control requires:
- Explicit invitation of the source's narrative (encouraging the account)
- Disciplined non-interruption (allowing the account to unfold)
- Appropriate pausing (creating space for continued retrieval)
- Minimal handler-generated content (keeping the handler's voice from crowding out the source's)

In formal terms, this is the principle that **the entity with the relevant information should be generating the most output**, and the role of the eliciting party is to *enable* that output, not to compete with it.

## Agent System Translations

### Explicit Goal-Alignment Protocols at Handoff Points

In a WinDAGs multi-agent system, coordination corresponds most directly to the protocols that govern *handoffs* between agents. When Agent A completes a subtask and passes its output to Agent B, the handoff should include explicit coordination elements:
- What was the goal of Agent A's task?
- What is Agent B being asked to do with this output?
- What constraints govern Agent B's processing?
- When should Agent B report back, and in what format?
- What will happen to Agent B's output downstream?

Without this framing, Agent B is in the position of a source who doesn't know why the handler is asking questions — they may produce output that is technically responsive but misses the actual need.

### The Transfer-of-Control Principle in Agent Orchestration

The transfer-of-control principle has a direct analog in orchestration design: **the agent with the most relevant domain knowledge should be generating the most output**, and orchestrator agents should minimize their own generative footprint to avoid crowding out more authoritative outputs.

A common failure mode in poorly designed orchestration systems is the "loud orchestrator" anti-pattern: a coordinating agent that paraphrases, reformulates, and re-interprets specialist agent outputs so heavily that the specialist's actual knowledge is diluted by the orchestrator's lower-quality synthesis. The coordination principle prescribes the opposite: orchestrators should create space for specialist agents to deliver full accounts, and should constrain their own generative behavior to the minimum necessary for routing and framing.

### Pausing as a System Behavior

The appropriate use of pauses — allowing space for the source to continue — translates in agent systems to the design of *response latency* and *turn-taking protocols*. Systems that immediately demand follow-up information or that generate responses before upstream agents have completed their output are the digital equivalent of an interviewer who interrupts.

Design principle: **build deliberate latency into agent-to-agent communication at natural completion boundaries**, not at arbitrary time intervals. Allow an upstream agent to signal completion before the downstream agent begins acting on the output.

### Process Transparency as a Coordination Investment

The process/procedure coordination behavior — explaining what will happen, what constraints exist, what comes next — has a clear agent system equivalent: **transparency about the system's intentions, constraints, and next steps**.

When an agent system is collecting information from a user, the user should know:
- Why this information is being collected
- How it will be used
- What the system will do next
- When the interaction will conclude
- What the user can expect to receive

This is not merely a user experience consideration — it is a coordination investment that directly affects yield. Users who understand the purpose and structure of an information-collection interaction provide more targeted, relevant, and complete information than users who are responding to decontextualized questions.

## Boundary Conditions

**Established relationships**: The paper notes that coordination may be more important in establishing new relationships than in maintaining established ones, where shared understanding is pre-existing. In ongoing agent relationships, some coordination overhead can be reduced once baseline alignment is established.

**High-urgency contexts**: In genuine emergencies, extensive process explanation may be inappropriate. Coordination should be calibrated to the time available.

**Adversarial contexts**: Coordination behaviors assume a cooperative partner. With adversarial sources, explicit goal-alignment ("we both want to accomplish X") may not be credible, and coordination must be adapted accordingly.

## Conclusion

Coordination is the structural scaffolding that makes information transfer efficient. It establishes shared goals, creates space for narrative delivery, and provides the temporal and procedural frame within which attention behaviors can do their work. Its underuse in the study — and the specific deficits in action and temporal intelligence that result — is a lesson about the costs of letting natural conversational habits override intentional elicitation discipline.

For agent systems, coordination behaviors translate into explicit goal-alignment at handoffs, transfer-of-control principles in orchestration design, thoughtful latency protocols, and systematic process transparency. These are not polish — they are the structural prerequisites for high-yield information exchange.
```

### FILE: self-report-gap-behavioral-auditing-vs-perceived-practice.md
```markdown
# The Self-Report Gap: Why Agents (and Humans) Cannot Accurately Assess Their Own Communicative Behavior

## The Foundational Problem

One of the most consistently replicated findings in the investigative interviewing literature — and one that Nunan et al. (2020) cite as a core motivation for their methodology — is the systematic discrepancy between what practitioners *believe* they do and what they *actually* do when recorded interactions are examined.

Hall (1997) provides the canonical example: police officers reported that rapport was important and that they used rapport-building behaviors extensively. When their recorded interviews were examined, "the rapport-building behaviours identified by the police officers were not present" (p. 3). The discrepancy was not a matter of modest miscalibration — the behaviors were simply absent.

This finding has been replicated across multiple studies and contexts:
- Dando, Wilcock, and Milne (2008) found that 87% of UK police officers reported using rapport-building, but behavioral examination of actual interviews showed a very different picture
- Kassin et al. (2007) found that US investigators ranked rapport as the fourth most-used tactic — not because they used it less, but because their self-categorization of their own behaviors was unreliable
- Goodman-Delahunty and Howes (2016) and Vallano et al. (2015) document extensive self-reported rapport use that cannot be independently verified from recordings

The implication is stark: **self-report is not a reliable measure of communicative behavior.** Practitioners sincerely believe they are doing something they are not doing. Their introspective access to their own behavioral output is systematically inaccurate.

## Why the Gap Exists

The paper does not elaborate extensively on *why* self-report fails so comprehensively, but the broader literature and the study's implicit logic suggest several mechanisms:

### 1. Retrospective Reconstruction
When practitioners are asked about their behavior after the fact, they do not retrieve a behavioral record — they reconstruct one. This reconstruction is heavily influenced by their beliefs about best practice, their self-image as skilled practitioners, and their desire to present themselves favorably. The reconstruction process systematically imports aspirational behavior into the retrospective account.

### 2. Definitional Vagueness
Rapport is a vague concept. When a practitioner reports "using rapport," they may be labeling any number of behaviors — being friendly, asking about the subject's family, using their first name — that feel rapport-relevant to them but may not correspond to the operationally significant behaviors (attention, coordination) that actually drive yield. The self-report captures intent or orientation, not specific behavioral frequency.

### 3. In-the-Moment Invisibility
Many communicative behaviors are automatic or habitual — patterns executed below the level of conscious attention. A practitioner who habitually interrupts their subject does not notice the interruptions at the time they occur and cannot report them retrospectively. A practitioner who rarely summarizes does not experience this as an omission; they experience the conversation as flowing naturally.

### 4. The Competence-Consciousness Divide
There is a well-documented phenomenon in skill acquisition where highly automated behaviors become invisible to the practitioner — they do them without noticing because they no longer require conscious attention. But the inverse also occurs: practitioners may be *told* to use a behavior (rapport-building), incorporate it into their self-concept as a skilled practitioner, and report using it — without actually having integrated it into their behavioral repertoire at the operational level.

## The Methodological Solution: Behavioral Auditing

The paper's response to the self-report problem is the core methodological innovation that makes this research possible and its findings credible: **behavioral auditing of actual recorded interactions.**

"An objective measure of rapport would provide evidence as to which verbal and nonverbal behaviours actually help establish and maintain rapport (Walsh & Bull, 2012), based on the behaviours that occurred during the interview (Collins & Carthy, 2019)" (p. 3).

The paper's methodology:
1. Gained access to 105 actual recorded telephone interactions (not simulations, not role-plays, not self-reports)
2. Developed a detailed behavioral coding framework specifying the exact verbal acts that constitute each rapport component
3. Trained coders to apply the framework consistently (interrater reliability: Cohen's κ = .77)
4. Counted the frequency of each coded behavior per interaction
5. Correlated behavioral frequencies with independently coded intelligence yield

Crucially, "the source handlers were unaware that their interactions would be analysed, to ensure that their normal verbal behaviours took place" (p. 7). This eliminates performance effects — the behaviors observed are the behaviors practitioners actually produce in their natural operational contexts, not the behaviors they produce when they know they are being evaluated.

The result is a behavioral record, not a self-report. And that behavioral record tells a fundamentally different story from what practitioners would have reported.

## The Gap in Agent Systems: Logs vs. Beliefs vs. Actual Behavior

This problem has direct and important analogs in AI agent system design. There are at least three distinct layers of agent "behavior" that can diverge:

### Layer 1: Designed Behavior (The Intent)
What the system is *designed* to do — specified in prompts, configuration, routing logic, or explicit behavioral guidelines. This is the system's self-model at design time.

### Layer 2: Logged Behavior (The Record)
What the system's logs record as having occurred. Depending on logging granularity, this may capture input-output pairs, tool calls, intermediate reasoning steps, or only final outputs. Logs are typically more accurate than human self-report — but they capture only what was instrumented.

### Layer 3: Effective Behavior (The Operational Reality)
What the system actually does in terms of its *impact on information flow* — does it actually probe for provenance? Does it actually summarize before proceeding? Does it actually create space for human users to elaborate? Does it actually align goals before requesting outputs from specialist agents?

These three layers can diverge significantly. A system may be *designed* to probe for clarification, may have this behavior *logged* as triggered, but may nonetheless *effectively* ask closed questions that truncate user responses. The effective behavior can only be assessed by analyzing the actual interaction transcripts and coding them for behavioral frequencies — exactly what this paper does for police handlers.

### The Agent Self-Report Problem: System Evaluations That Trust Self-Assessment

Many AI system evaluations rely on the system's own assessment of its behavior:
- "Did you ask clarifying questions?" → "Yes, I asked several clarifying questions."
- "Did you summarize before proceeding?" → "Yes, I summarized the key points."
- "Did you probe for additional information?" → "Yes, I probed for more context."

But as the investigative interviewing literature makes clear, self-assessment is systematically unreliable. The system may have asked *something* it labels as a clarifying question without actually asking the question that would have most clarified the ambiguity. It may have produced *something* it calls a summary without the summary being accurate, complete, or used as a genuine error-correction checkpoint.

## Designing a Behavioral Audit System for Agents

The paper's methodology suggests a framework for building behavioral auditing into agent systems:

### Step 1: Build the Behavioral Taxonomy
Before you can audit behavior, you need a precise specification of what behaviors constitute good practice in your domain. This is the equivalent of the paper's coding framework (Table 1). For each capability in a WinDAGs system, this taxonomy should specify:
- What verbal/operational acts constitute "attention" (active processing, probing, summarizing)
- What acts constitute "coordination" (goal-alignment, process transparency, appropriate latency)
- What acts constitute "positivity" (tone calibration, acknowledgment, reassurance)
- What acts are maladaptive or counterproductive (interruption, leading questions, premature closure)

### Step 2: Instrument the Interactions
The equivalent of audio recording in agent systems is comprehensive interaction logging — capturing not just inputs and outputs, but all intermediate steps, decision points, and communicative acts in sufficient granularity to support behavioral coding. This means logging tool calls, internal reasoning traces, and the specific formulations of agent-to-agent or agent-to-human communications.

### Step 3: Code the Behavioral Frequencies
Apply the behavioral taxonomy to the interaction logs, coding the frequency of each behavior category. This can be automated (using a classifier trained on the taxonomy) or done through human review. The key is that the coding is applied to *actual* behavioral records, not to the agent's self-assessment of what it did.

### Step 4: Correlate Behavioral Frequencies with Outcome Quality
Define your equivalent of "intelligence yield" — for different capabilities, this might be:
- Task completion rate
- User satisfaction scores
- Quality of outputs (rated by independent review)
- Error rates in downstream processing
- Richness and accuracy of information extracted

Then correlate behavioral frequencies with outcome metrics. This analysis will almost certainly reveal surprising patterns — that the behaviors practitioners assume are most important are not the strongest predictors of the outcomes that actually matter.

### Step 5: Close the Loop
Use the behavioral audit findings to update the behavioral taxonomy, agent training, and system design. This is the training implication the paper identifies for police source handlers: "The rapport framework in the present research could be utilised in a training environment to highlight verbal behaviours associated with the three components of rapport" (p. 13-14).

For agent systems, the equivalent is: use behavioral audit findings to refine prompts, routing logic, and capability specifications — not based on what practitioners believe works, but based on what behavioral frequencies actually predict outcome quality.

## The Interrater Reliability Problem: Auditing the Auditors

The paper addresses a meta-level challenge in behavioral auditing: who audits the behavior of the auditors? The paper's response is formal interrater reliability assessment: two coders independently coded a sample of interactions, and their agreement was measured using Cohen's kappa (κ = .77, 95% CI [.71, .83]).

This is not a minor procedural detail — it is a fundamental quality control mechanism. Without interrater reliability assessment, behavioral coding is itself susceptible to the self-report problem: coders may believe they are applying the taxonomy consistently while actually applying it idiosyncratically.

For agent systems, this translates to: **behavioral classifiers used for auditing should themselves be validated**. If you build an automated system to code agent behaviors according to your taxonomy, that classifier should be validated against human coding of a representative sample, with explicit measurement of agreement. Otherwise you have replaced one self-report problem with another.

## The Boundary Condition: What Behavioral Auditing Can and Cannot Capture

The paper is explicit about a key limitation: "It was only possible to analyse verbal rapport as the research team had access to audio recordings of the telephone interactions" (p. 7). Nonverbal behaviors — which are extensively discussed in the rapport literature — could not be coded.

This limitation points to a general principle: **behavioral auditing can only capture what is recorded**. For telephone interactions, that means verbal behavior only. For agent systems, this means behavioral auditing can only assess what is logged. Internal reasoning that is not surfaced in logs, subtle tonal qualities in text output that affect user experience, and system behaviors that occur below the logging threshold are all invisible to behavioral audit.

The design implication is that **logging granularity should be determined by what you want to audit**, not by what is convenient to log. If you want to audit whether agents are probing for provenance, you need to log the specific formulations of the probing questions, not just the fact that a question was asked.

## Conclusion: The Primacy of the Behavioral Record

The self-report gap documented in this paper is not a curiosity about police officers' self-awareness. It is a fundamental property of how practitioners (human or artificial) relate to their own behavioral output. Beliefs about behavior are not reliable proxies for actual behavior. Self-assessments are reconstructions, not records.

The only antidote is the behavioral record: actual, logged, coded interactions analyzed by an independent observer against a precise behavioral taxonomy.

For agent systems: **trust logs over beliefs, trust coded behavioral frequencies over self-assessments, and build your optimization loops on behavioral evidence rather than evaluative intuitions.** The gap between what a system is designed to do, what it believes it does, and what it actually does in operational contexts is likely to be larger than anyone has yet measured — because no one has yet applied the equivalent of this paper's methodology systematically to AI agent behavior.
```

### FILE: intelligence-yield-taxonomy-decomposing-output-quality.md
```markdown
# Intelligence Yield Taxonomy: Decomposing Output Quality Into Measurable Sub-Types

## The Problem with Monolithic Quality Metrics

When an AI agent system evaluates the quality of its outputs, it typically does so using a single aggregate metric: accuracy, completeness, user satisfaction, task completion. These monolithic metrics obscure what might be the most important analytical question: **which dimensions of quality are being achieved, which are being sacrificed, and which elicitation behaviors predict which quality dimensions?**

Nunan et al. (2020) offer a powerful methodological alternative: decomposing intelligence yield into a taxonomy of five distinct detail types, then correlating each type separately with each rapport component. The result reveals a granular, differentiated picture that the aggregate metric cannot show — and that turns out to have significant implications for both training and operational design.

## The Five Intelligence Yield Categories

The paper's intelligence yield coding scheme (adapted from Hope, Mullis, & Gabbert, 2013; Milne & Bull, 2002; Wessel et al., 2015) identifies five distinct types of information that a source may provide:

### 1. Surrounding Details
"Information about the setting (e.g. locations)"

Surrounding details answer the question: *where?* They establish the spatial and environmental context of the events being reported — the physical locations where activities took place, the settings that provide structural context for understanding what happened.

For intelligence purposes, surrounding details are critical for operational planning (targeting a specific location for surveillance), for verification (checking a location against other evidence), and for building a spatially coherent model of criminal activity.

### 2. Object Details
"Items that were discussed (e.g. a phone, drugs, money)"

Object details answer the question: *what?* They identify the artifacts involved in the events being reported — the tools, substances, commodities, documents, or instruments that featured in criminal activity.

Object details are often the most directly actionable intelligence: a specific phone model and number enables interception; a specific drug consignment size enables seizure planning; a specific sum of money enables financial investigation.

### 3. Person Details
"Information relating to people (e.g. names, person descriptions)"

Person details answer the question: *who?* They identify the individuals involved — names, descriptions, roles within criminal networks, relationships to other known persons.

Person details are the network layer of intelligence: they map the social structure of criminal activity, identify key nodes (principals, facilitators, intermediaries), and enable the linking of disparate pieces of information into a coherent picture of organizational structure.

### 4. Action Details
"Information about activities (e.g. criminal offences, driving)"

Action details answer the question: *what happened?* They describe behaviors, events, and processes — the actual activities that constitute criminal conduct.

Action details are the narrative backbone of intelligence — they describe *what is happening*, as distinct from where, what artifacts are involved, or who the actors are. They are the most complex to elicit because they require the source to construct a coherent account of dynamic events rather than simply naming static entities.

### 5. Temporal Details
"The time (e.g. dates, days, years)"

Temporal details answer the question: *when?* They place events on a timeline — specific dates, times of day, durations, sequences.

Temporal details are the chronological skeleton of intelligence. They are critical for establishing patterns (regular activity at a specific time), for operational timing (when to intercept an activity), and for chronological verification (do multiple sources agree on the timing of key events?).

## The Analytic Power of Decomposition: An Example

The paper provides an example that illustrates how this coding system works in practice:

"'around 9 pm (one temporal IY) she (one person IY) was driving (one action IY) a car (one object IY) and dealing (one action IY) drugs (one object IY) in London (one surrounding IY)'" (p. 10).

A single sentence — "around 9 pm she was driving a car and dealing drugs in London" — yields seven discrete intelligence units: one temporal, one person, two action, two object, one surrounding. This granular counting makes it possible to see the *structure* of what a source provides, not just its volume.

Moreover, it reveals what is *missing*. If a source consistently provides high volumes of person and object details but almost no temporal or action details, that suggests a specific elicitation gap: the source may know a great deal about the actors and artifacts but cannot reconstruct the timeline or the activity sequence. This might be a memory limitation, a gap in their direct observational access, or a sign that their knowledge is secondhand.

## The Differential Correlation Findings: What Predicts What

The paper's most analytically sophisticated contribution is the correlation analysis between rapport components and yield subtypes:

| | Surrounding | Object | Person | Action | Temporal | Overall |
|---|---|---|---|---|---|---|
| **Attention** | .64*** | .77*** | .76*** | .81*** | .60*** | .83*** |
| **Positivity** | .18 (NS) | .12 (NS) | .17 (NS) | .23* | .06 (NS) | .19 (NS) |
| **Coordination** | .12 (NS) | .18 (NS) | .18 (NS) | .24* | .23* | .21* |

The pattern that emerges is striking:

**Attention universally predicts all five yield types** — and predicts them all strongly. The weakest attention-yield correlation is temporal (r = .60), and even that is a strong effect. Attention's strongest prediction is action details (r = .81), which makes intuitive sense: action details require the most elaborate narrative construction, and they are elicited most effectively by active probing and engagement.

**Positivity is almost entirely unrelated to yield type-by-type** — the single exception being a weak correlation with action details (r = .23, p < .05). Even this correlation is weak and may reflect that the motivational and comfort-establishing function of positivity slightly helps sources produce action narratives, which require more cognitive and emotional investment.

**Coordination specifically predicts action and temporal details** — the two yield types that are most directly about *what happened and when*. This pattern is interpretable: action and temporal details form the narrative spine of an intelligence account. They require the source to reconstruct a coherent chronological sequence of events. Coordination behaviors — particularly process framing, appropriate pausing, and explicitly encouraging the source's account — create the structural conditions under which that sequence can be elicited without disruption or distortion.

## Why This Pattern Matters

The differential prediction pattern tells us something important about the *functional relationships* between rapport components and information types:

**Attention drives yield across all information types** because active processing, probing, and summarizing help the source retrieve any kind of information more completely and in greater detail.

**Coordination drives specifically narrative information** (action and temporal) because narrative construction is the most cognitively demanding retrieval task, and coordination behaviors provide the structural support that complex memory retrieval requires: a clear starting point, a shared goal, uninterrupted space for narrative unfolding, and appropriate pacing.

**Positivity does not strongly drive any specific information type** — reinforcing the interpretation that its function is *relational maintenance* rather than *information extraction*. It keeps the channel open; it does not help any particular kind of information flow through it.

## Designing Output Quality Taxonomies for Agent Systems

The intelligence yield taxonomy offers a methodological model for AI agent system design that is more broadly applicable than its specific intelligence context.

### The Core Principle: Decompose Your Output Into Typed Categories

For any agent capability that produces complex outputs, the question should be: **what are the structurally distinct types of content that constitute a complete, high-quality output?**

For a debugging agent:
- **Symptom details**: What is the observable failure?
- **Causal details**: What mechanism is producing the failure?
- **Context details**: What environmental conditions are present?
- **Action details**: What sequence of events led to the failure state?
- **Temporal details**: When did the failure first appear? Is it consistent or intermittent?
- **Fix details**: What changes would address the root cause?

For a research synthesis agent:
- **Claim details**: What factual assertions are established?
- **Source details**: What sources support each claim?
- **Confidence details**: What is the epistemic status of each claim?
- **Conflict details**: Where do sources disagree?
- **Gap details**: What is unknown or underresearched?
- **Implication details**: What follows from the established claims?

For a requirements elicitation agent:
- **Functional details**: What must the system do?
- **Constraint details**: What limitations apply?
- **User details**: Who will use the system and how?
- **Priority details**: What is most important?
- **Assumption details**: What beliefs are embedded in the requirements?
- **Risk details**: What could go wrong?

### Using the Taxonomy to Identify Elicitation Gaps

Once you have a typed output taxonomy, you can analyze your agent's outputs against it systematically. If the agent consistently produces high volumes of some output types but almost none of others, you have identified an elicitation gap.

For example: if a debugging agent reliably identifies symptoms and causal mechanisms but never produces temporal details (when did this start? is it consistent or intermittent?), you know that the agent's elicitation behaviors are not probing for temporal information. The fix is not to improve the agent's debugging capability in general — it is to add specific probing behaviors that target temporal information.

This is the operational value of the differential correlation finding: it allows you to trace output gaps back to specific behavioral deficits, rather than treating "insufficient output quality" as a homogeneous problem.

### Weighting the Taxonomy by Downstream Value

The paper implicitly treats all five yield types as equally valuable for counting purposes. In practice, different information types may have different downstream value depending on the operational context.

For an agent system, the taxonomy should be weighted by the downstream value of each output type in the specific context. This weighting then becomes a design input: allocate elicitation effort in proportion to the downstream value of each output type.

If action details (what happened) are most critical for your downstream processing, invest in coordination behaviors (which specifically predict action yield). If person details (who is involved) are most critical, invest in attention behaviors (which have the strongest correlation with person yield at r = .76).

### Temporal and Sequential Information: The Hardest to Extract

The paper's finding that coordination specifically predicts temporal yield suggests a general principle about sequential and temporal information: it is among the hardest to extract, requires the most structured elicitation support, and is most easily disrupted by poor elicitation practices (interruption, premature closure, inadequate pacing).

This is consistent with what is known about autobiographical memory: chronological reconstruction of event sequences is cognitively demanding, prone to error, and sensitive to elicitation conditions. Sources (human or artificial) often know *what* happened but struggle to reconstruct *when* it happened or *in what order*.

For agent systems that need to extract chronological or sequential information — debugging timelines, event sequences, causal chains — the design prescription is clear: invest in coordination behaviors, provide structured frameworks for temporal ordering (e.g., explicit timeline tools), and allow more time for reconstruction than for static information retrieval.

## The Mean Yield Distribution: What Gets Produced by Default

The paper reports mean yield across the five detail types:

| Detail Type | Mean (per call) | SD |
|-------------|-----------------|-----|
| Person | 26.89 | 21.87 |
| Action | 25.56 | 20.37 |
| Object | 14.48 | 12.95 |
| Surrounding | 11.74 | 12.74 |
| Temporal | 6.11 | 4.92 |

Person and action details dominate spontaneous output, while temporal details are produced least. This distribution reflects the structure of natural narrative — people naturally report *who* and *what happened*, and naturally provide less temporal precision.

This baseline distribution has an important implication for elicitation design: **the information types that are produced least by default are typically the ones that require the most active elicitation investment.** Temporal details won't be provided unless they are specifically probed for. Surrounding details (specific locations) require geographic probing. Object details require artifact-specific questioning.

For agent systems: **don't assume that users or upstream agents will spontaneously produce all output types in adequate quantities.** Analyze the baseline distribution of your system's outputs, identify which types are chronically underproduced, and build specific elicitation behaviors that target those gaps.

## Conclusion

The intelligence yield taxonomy is not a bureaucratic categorization exercise — it is an analytical tool that makes invisible structure visible. By decomposing output quality into typed categories and correlating each type with specific elicitation behaviors, the paper makes it possible to:

1. Diagnose specific output deficits (not just overall quality failures)
2. Trace deficits to specific behavioral gaps
3. Design targeted interventions that address specific information type shortfalls
4. Prioritize elicitation investment based on the downstream value of different output types

For AI agent systems, this methodology translates directly into a design practice: build typed output taxonomies for every complex output type your system produces, instrument the system to track output type frequencies, and correlate those frequencies with elicitation behavior frequencies. The result will be a behavioral improvement roadmap with specificity and empirical grounding that holistic quality metrics cannot provide.
```

### FILE: working-alliance-motivation-modeling-source-management.md
```markdown
# The Working Alliance and Motivation Modeling: Managing the Source's Investment in the Relationship

## Beyond Information Extraction: The Relationship as an Asset

Most frameworks for thinking about information elicitation focus on the single interaction — how to ask questions, how to build rapport, how to maximize yield in a given session. What makes the source handler/CHIS relationship distinctive, and what gives this paper's framework much of its operational richness, is its recognition that the relationship is an *ongoing asset* that must be actively managed across time.

A Covert Human Intelligence Source is not a one-time informant. They are a sustained intelligence resource who will be contacted repeatedly over weeks, months, or years. The source handler's job is not merely to extract maximum information in each call — it is to maintain a relationship of sufficient quality that the source continues to cooperate, continues to take operational risks on behalf of law enforcement, and continues to provide timely and reliable intelligence.

This temporal dimension changes the calculus of rapport profoundly. Behaviors that damage a source in the short term (high-pressure questioning, ignoring welfare concerns, failing to manage expectations) may produce more information in a single session while destroying the relationship entirely. Behaviors that invest in the source's ongoing motivation and welfare may produce less in any single session while sustaining a relationship that generates far more total intelligence over its lifetime.

## The Definition of Rapport in Intelligence Contexts

The paper offers a definition of rapport specifically adapted for intelligence-gathering relationships: "developing and maintaining a working relationship with a human source, by managing their motivations and welfare, whilst ensuring they understand the purpose of the relationship in order to secure reliable intelligence" (Stanier & Nunan, 2018, p. 232).

This definition contains three distinct elements that are worth disaggregating:

**1. "Developing and maintaining a working relationship"** — rapport is not a state achieved once and preserved automatically; it is an active, ongoing process requiring continuous investment. The word "maintaining" is doing significant work here: it implies that achieved rapport can deteriorate if not actively sustained, and that the handler must attend to relational quality throughout the lifecycle of the relationship, not just during initial contact establishment.

**2. "Managing their motivations and welfare"** — the handler's responsibilities extend beyond information collection. The source's motivations (why they are cooperating) must be actively managed — understood, respected, and where possible reinforced. The source's welfare (their physical and psychological safety, their practical concerns) must be actively maintained. This is not merely an ethical requirement; it is a strategic one. Sources whose motivations are mismanaged or whose welfare is neglected become unreliable, uncooperative, or simply stop providing information.

**3. "Ensuring they understand the purpose of the relationship"** — the source must have a clear and accurate model of what the relationship is for, what the handler is trying to accomplish, and what the source's role is. Ambiguity about purpose creates anxiety, distrust, and unpredictable behavior. Clarity about purpose creates alignment, cooperation, and predictable, trustworthy information provision.

## Motivation as Operational Lever

The paper identifies "exploring motivation" as one of the eight attention behaviors in the framework. This is a fascinating categorization choice — motivation exploration is coded under *attention* rather than under *coordination*, suggesting that it is primarily about *understanding the source* rather than about *structuring the interaction*.

The definition from Table 1 is worth quoting in full: "Tries to find, with understanding, why the CHIS is willing to share their information and also use the CHIS' motivation for the conversation. Source handler may use the motivation as a hook for cooperation."

Two things are happening here:

**First**: the handler is *gathering* motivational information — building a model of what drives this specific source. Different sources cooperate for very different reasons: financial reward, desire for protection from a rival, loyalty to law enforcement, desire to avenge a personal wrong, ideology, coercion, or complex combinations of the above. Understanding a source's motivation is not merely psychologically interesting — it tells the handler what aspects of the relationship are most valuable to the source, and therefore what aspects must be protected.

**Second**: the handler is *using* motivational information as "a hook for cooperation." This is an active, strategic behavior — not manipulative in a harmful sense, but practically responsive. A source who cooperates primarily for financial reward responds to clear communication about payment. A source who cooperates out of loyalty to law enforcement responds to expressions of institutional commitment. A source who cooperates out of fear responds to genuine welfare management. Tailoring the handler's approach to the source's actual motivations makes the relationship more productive because it makes the source feel that their specific reasons for cooperating are being recognized and honored.

## The Ongoing Relationship Challenge: Maintaining Rapport Without Degradation

One of the key theoretical claims of the Tickle-Degnen and Rosenthal model, as applied in this paper, is that rapport requires not just establishment but maintenance. "The level of attention should not change over time in order to maintain the developed relationship" (p. 5, citing Tickle-Degnen & Rosenthal, 1990). And "Walsh and Bull (2012) demonstrated that establishing rapport alone was not enough to satisfy the interview's quality and outcomes, as rapport needs to be maintained throughout" (p. 5).

This maintenance requirement has implications that are easy to overlook: **a handler who establishes excellent rapport in the first three sessions of a relationship and then allows it to decline in subsequent sessions is not maintaining a stable asset — they are degrading it.** The same attentiveness, the same coordination, the same engagement that produced high yield in early sessions must be sustained across the entire relationship.

Why might rapport decline over time without deliberate maintenance?
- **Familiarity effects**: As a relationship becomes established, handlers may reduce their rapport investment because the relationship feels secure. But the source may experience this as decreased interest or care.
- **Routine effects**: As interactions become predictable, handlers may deliver rapport behaviors more mechanically, without genuine engagement. Sources may detect this.
- **Welfare neglect**: As operational pressures mount, handlers may focus more on information extraction and less on the source's welfare and motivation management.
- **Expectation drift**: Over time, the purpose and expectations of the relationship may shift without explicit renegotiation. The source may be operating under outdated assumptions about what they are being asked to do and why.

The practical implication: **rapport is a perishable asset**. It requires ongoing investment to maintain. Systems that establish good initial relationships but fail to maintain them will experience gradual degradation in source cooperation and intelligence yield.

## The Working Alliance Construct in Detail

The paper repeatedly invokes the concept of the "working alliance" — originally from clinical psychology, where it describes the therapeutic relationship between client and therapist. The three elements of a working alliance are:
- Shared goals (both parties agree on what they are trying to accomplish)
- Agreement on tasks (both parties agree on the means of pursuing those goals)
- A bond (mutual respect, trust, and commitment to the relationship)

For source handler/CHIS relationships, this translates to:
- The source understands and agrees with the purpose of their cooperation
- The source understands and accepts the procedures governing the relationship (security, communication, compensation)
- The handler and source have a genuine mutual commitment to the relationship's continuation

The working alliance concept is important because it frames the relationship as *genuinely bilateral* rather than purely extractive. A handler who treats the source only as a conduit for information — without attending to the source's goals, the source's understanding of the relationship, and the quality of the relational bond itself — is not building a working alliance. They are running an information extraction operation that will eventually collapse when the source's motivation runs out or their trust erodes.

Coordination behaviors — particularly the process/procedure framing behavior — are the primary mechanism for establishing and renewing the working alliance in each interaction. By explaining what will happen, what the source should and should not do, and when they will next be in contact, the handler is actively refreshing the source's understanding of the relationship's structure and purpose.

## The Positivity Paradox Revisited: When Warmth Becomes a Substitute for Substance

The finding that positivity does not significantly predict intelligence yield is, in the context of the working alliance framework, interpretable in a nuanced way. The paper offers one explanation — that in established relationships, positivity is less surprising and therefore less impactful. But there may be a deeper issue: **positivity without substance is relational theater**.

If a handler uses warmth, humor, and empathy to create pleasant interactions but does not attend carefully to the source's actual information, does not probe for depth and provenance, and does not maintain clarity about the relationship's purpose and structure — they have created something that feels like rapport but lacks its functional essence. The source may enjoy the interactions while providing thin, low-quality intelligence.

This is the "positivity trap": focusing on the affective quality of the relationship at the expense of its epistemic quality. The source feels valued and comfortable — but they are not being asked the questions that would elicit their most valuable knowledge, and they are not being given the structural support they need to reconstruct and articulate complex information.

The lesson is not that positivity is harmful — it is that positivity must be paired with substantive engagement (attention) and structural support (coordination) to produce functional rapport. Positivity alone is relational maintenance without content; attention without positivity is effective extraction without sustainability. Both are necessary; neither alone is sufficient.

## Agent System Translations: The Source as Long-Term Partner

### Modeling User and Agent Motivations

The motivation modeling behavior has an important analog in agent systems: agents should build and maintain models of the motivations of the humans and other agents they interact with.

For a user-facing agent: why is this user engaging with the system? What are they trying to accomplish at the immediate level (this query), the session level (this task), and the relationship level (their overall purpose in using the system)? Understanding these nested motivations allows an agent to provide responses that are calibrated not just to the immediate request but to the user's deeper goals.

This is different from simple intent detection. Motivation modeling involves inferring *why* the user is asking, not just *what* they are asking — and using that inference to provide more complete, more targeted, more useful responses.

For agent-to-agent interactions: why is an upstream agent requesting this specific output? What downstream use will the output serve? An agent that understands the downstream purpose of its outputs can calibrate its level of detail, precision, and format to match the actual downstream need — rather than producing generic outputs that may or may not be fit for purpose.

### Relationship Quality as a Managed Asset

In long-running agent interactions — particularly in systems where agents maintain ongoing relationships with human users over time — the "perishable asset" principle has direct design implications.

An agent relationship that starts with high engagement and careful attention but gradually becomes more formulaic and less responsive will be experienced by users as deteriorating quality, even if the agent's technical capabilities have not changed. This is the digital equivalent of a source handler who reduces their rapport investment as a relationship becomes established.

Design principle: **build maintenance behaviors into agent relationships**. This might include:
- Periodically checking in on the user's evolving goals and needs
- Explicitly acknowledging relationship history ("last time we discussed X — has anything changed?")
- Refreshing the shared understanding of what the agent is there to help with
- Proactively updating the user on relevant developments since the last interaction

### The Working Alliance in Multi-Agent Systems

The working alliance concept translates into a specific design requirement for multi-agent orchestration: **agent-to-agent relationships should have explicit, periodically refreshed shared understandings of goals, tasks, and constraints.**

When an orchestrator agent assigns a task to a specialist agent, the initial goal specification is the equivalent of establishing the working alliance. But over the course of a complex, extended task, goals may shift, new constraints may emerge, and the specialist agent's understanding of its role may drift from the orchestrator's actual intent.

Periodic realignment — explicit checking of shared understanding between orchestrator and specialist agents — is the multi-agent equivalent of the source handler's working alliance maintenance behaviors. It prevents the silent drift of agent purposes that can produce coherent-seeming but fundamentally misdirected outputs.

## Conclusion: Sustainability Over Maximization

The source handler/CHIS relationship framework offers a fundamental corrective to pure extraction-optimization thinking. Maximizing intelligence yield in any single interaction at the expense of the relationship's long-term health is a losing strategy. The sustainable approach requires:

1. Active motivation management — understanding why the source cooperates and reinforcing those motivations
2. Genuine welfare attention — treating the source's security, psychological state, and practical concerns as operational priorities
3. Working alliance maintenance — regularly renewing shared understanding of goals, tasks, and constraints
4. Rapport maintenance over time — sustaining attentive and coordinating behaviors across all interactions, not allowing quality to erode as relationships become established

For agent systems: think about information sources, human users, and collaborating agents not as one-time targets for extraction but as long-term partners whose continued cooperation depends on the quality of the relationship being maintained over time. The behaviors that sustain that quality — attention, coordination, motivation modeling, welfare management — are not overhead costs. They are the investment that makes sustained high-yield information flow possible.
```

### FILE: informal-vs-formal-interaction-elicitation-context-matters.md
```markdown
# Context Shapes Elicitation: How Formal vs. Informal Settings Change What Rapport Components Are Available and Effective

## The Problem of Context-Dependence in Communication Research

Most research on investigative interviewing and rapport is conducted in formal settings: interview rooms, recorded under caution, governed by explicit legal frameworks, with structured protocols for how questions can be asked and answers can be given. This methodological preference is understandable — formal settings are easier to access, more ethically straightforward, and produce data whose conditions are clearly defined.

But Nunan et al. (2020) provide something rarer and more valuable: data from genuinely *informal* interactions. The telephone calls between source handlers and CHIS are not governed by PACE (Police and Criminal Evidence Act 1984), are not interviews under caution, do not follow mandated protocols, and occur within ongoing personal relationships that can span years. They are, in the authors' words, "typically informal, undertaken via the telephone and physical meetings that are not bound by the formality of England and Wales' Police and Criminal Evidence Act 1984" (p. 5).

This informality is not a confound to be controlled for — it is the defining feature of the interaction context, and it shapes which rapport behaviors are available, which are appropriate, and which are most effective. The paper's comparison with Collins and Carthy's (2019) formal suspect interview data illuminates these differences in ways that are directly relevant to AI agent system design.

## What Changes Between Formal and Informal Contexts

### Behavioral Availability

Some rapport behaviors are structurally more available in informal than formal contexts:

**Self-disclosure**: In formal investigative interviews, interviewer self-disclosure is limited by professional norms, legal constraints, and the power asymmetry between interviewer and suspect. In source handler/CHIS interactions, self-disclosure is actively encouraged as a rapport-building tool: "The use of self-disclosure by source handlers must be undertaken in a way that reveals sufficient and appropriate information to build rapport (e.g. favourite football team), but does not compromise their own safety" (p. 5). The paper even discusses handlers developing "appropriate cover stories" to enable rapport-building disclosures while protecting their identities.

**Humor**: Humor is largely unavailable in formal interview settings without risk of appearing to trivialize serious proceedings. In informal telephone interactions, appropriate humor is specifically coded as a rapport behavior — when "the CHIS must find the use of humour as a positive" (Table 1).

**Common ground exploration**: Asking a suspect about their hobbies, family, and lifestyle would be unusual in a formal investigative interview. In source handler/CHIS calls, "the use of questions around the CHIS' lifestyle, hobbies, family etc. to display a genuine interest towards the CHIS" (Table 1) is a standard positivity behavior.

### Behavioral Frequency Differences

The paper directly compares its findings with Collins and Carthy's (2019) formal interview study: "In contrast to Collins and Carthy (2019), the present research revealed that positivity was used more frequently than coordination" (p. 12).

In formal suspect interviews, coordination behaviors are mandated: explaining the process, the suspect's rights, what will happen next, the recording procedures. These coordination behaviors occur because formal interview protocols require them. In informal telephone interactions, there is no external requirement — and coordination, though still valuable, occurs less frequently because handlers are not reminded to do it by procedural requirements.

Conversely, positivity behaviors are more frequent in informal contexts because the informal setting makes warmth, humor, and personal engagement more natural and less professionally constrained.

### Relationship History Effects

One of the most important contextual differences is the *history* of the relationship. Collins and Carthy's (2019) interviewers were typically meeting suspects for the first time, often immediately after arrest, with no prior relationship. Source handlers in the Nunan et al. (2020) study were operating within established, ongoing relationships.

The paper hypothesizes that this relationship history may explain the non-significance of positivity in predicting yield: "the increased familiarity may have resulted in a reduced impact of positivity, as it may not have been considered to be as important as coordination or attention" (p. 13). Warmth establishes initial trust — but once trust is established, maintaining it requires less investment. What matters more in established relationships is *substantive engagement* (attention) and *structural clarity* (coordination).

This history effect is an important finding for any system that involves ongoing relationships rather than one-shot interactions.

## The Three-Context Typology

Drawing on this paper and the broader literature it references, it is useful to distinguish three interaction contexts that have quite different rapport dynamics:

### Context 1: First Contact / Adversarial Setting
(Formal suspect interviews, initial user interactions, cold starts)
- Power asymmetry is highest
- Positivity investment is most important as a trust-establishment mechanism
- Coordination behaviors are often mandated by formal protocols
- Self-disclosure and humor are least appropriate
- Attention behaviors remain important but must overcome defensiveness

### Context 2: Established Cooperative Relationship
(Source handler/CHIS calls, ongoing user relationships, known agent partnerships)
- Power asymmetry is lower; relational commitment is established
- Positivity becomes a maintenance behavior rather than a trust-building investment
- Attention becomes the dominant yield driver
- Coordination becomes the critical structural investment (but may be underused due to familiarity effects)
- Self-disclosure, humor, and common ground are natural and appropriate

### Context 3: Formal Cooperative Setting
(Investigative interviews with cooperative witnesses, formal agent handoffs with defined protocols)
- Moderate power asymmetry; cooperation is assumed but structured
- Coordination behaviors are externally mandated and therefore more consistently deployed
- Attention behaviors are highly important
- Positivity is constrained by professional norms but remains important

The practical implication: **rapport strategies should be calibrated to the interaction context.** A rapport framework that works well in established cooperative relationships may be inappropriate or insufficient in first-contact or adversarial settings — and vice versa.

## The Telephone Medium and Its Constraints

The paper's data is specifically from *telephone interactions*, which creates important constraints:

**Verbal-only channel**: Without visual information, nonverbal rapport signals — eye contact, facial expression, body posture, physical proximity — are unavailable. All rapport must be carried by verbal behaviors. This limitation "only possible to analyse verbal rapport as the research team had access to audio recordings" (p. 7) is acknowledged, but it also means the framework is specifically adapted to voice-only interactions.

**Absence of physical presence**: Physical co-presence enables implicit rapport signals (synchrony of movement, shared spatial orientation, environmental context) that are unavailable on the telephone. Telephone rapport requires more explicit verbal compensation.

**Medium informality**: The telephone medium itself connotes informality — it is more casual than a face-to-face formal interview and more private than a written communication. This informality may facilitate the positivity behaviors that are more appropriate in informal contexts.

For AI agent systems — which operate primarily through text-based or voice-based communication without physical presence — the telephone interaction is actually a closer model than the face-to-face interview. The challenge of building rapport without visual cues, through a verbal-only channel, in an informal context, is structurally similar to the challenge of an AI agent building effective working relationships through text.

## Appropriate Self-Disclosure: The Calibration Challenge

One of the most nuanced contextual challenges the paper addresses is the question of *appropriate* self-disclosure. The paper notes that self-disclosure "must be undertaken in a way that reveals sufficient and appropriate information to build rapport (e.g. favourite football team), but does not compromise their own safety by inappropriately revealing overly personal information such as their home address or children's school" (p. 5).

This calibration challenge — sharing enough to build rapport without sharing so much as to create risk — has direct analogs in AI agent system design:

**What can an agent disclose about itself?** An agent that can explain its capabilities, its limitations, its reasoning process, and its uncertainties builds a more effective working relationship with users than one that presents itself as an opaque oracle. This transparency is the agent's version of appropriate self-disclosure — sharing enough about how it works to build trust, without creating false impressions of certainty or capability that would eventually damage that trust.

**What should an agent disclose about its principals' interests?** An agent operating on behalf of an organization must calibrate what it reveals about that organization's goals, constraints, and capabilities — sharing enough to make the agent's behavior intelligible, without revealing sensitive information about the organization's operations or strategy.

**How much should an agent reveal about its uncertainty?** Appropriate disclosure of uncertainty — "I'm not confident about this aspect" — is the epistemic equivalent of appropriate personal self-disclosure. It builds trust by demonstrating honesty; it would be inappropriate to express *no* uncertainty (which would be false) or *excessive* uncertainty (which would undermine the agent's usefulness).

## The Informality Premium: When Structure Helps and When It Hinders

One of the paper's most interesting implicit findings is that the absence of formal structural requirements (like PACE mandates) results in coordination behaviors being *underused* — because without external prompts, handlers revert to more natural conversational patterns that emphasize positivity and some attention, but neglect the procedural clarity that coordination provides.

This suggests a paradox of informality: **informal contexts make rapport feel more natural but often degrade its quality**, because the structural behaviors (coordination) that drive substantive yield are not naturally prompted and therefore often omitted.

The implication for agent system design: **build explicit structural scaffolding into informal interactions**. Don't rely on the naturalness of an informal interaction to produce structurally sound behavior. Instead, design in the coordination moments — goal-alignment prompts, process transparency, closure questions — as architectural features of the interaction, not as optional behaviors that practitioners can choose to deploy.

The formal interview's legal requirements essentially mandate coordination behaviors. The informal telephone call has no such mandate — and coordination suffers as a result. An AI agent system should provide the structural equivalent of those mandates: not as rules that are visible to the user, but as architectural features that ensure coordination behaviors are consistently deployed even in informal contexts.

## Boundary Conditions: When Informal Rapport Frameworks Don't Apply

The informal framework described in this paper has important limitations:

**High-stakes single interactions**: In crisis negotiations, emergency information gathering, or other high-stakes single-session interactions where there is no prior relationship and may be no future relationship, the ongoing relationship management framework doesn't apply. The handler must establish enough trust for a single interaction, which is a different challenge from maintaining a relationship over years.

**Power-asymmetric contexts**: In interactions where one party has significant power over another (interrogations, formal evaluations, regulatory contexts), the informal rapport model may be inappropriate or inapplicable. The working alliance model assumes enough mutual commitment to make the relationship genuinely bilateral.

**Acute adversarial dynamics**: With a source who is actively resistant or whose interests genuinely conflict with the handler's, the cooperative working alliance model requires significant adaptation. The paper's recommendations are optimized for genuinely cooperative relationships where both parties benefit from the exchange.

**Highly standardized interactions**: In contexts where standardization is paramount (clinical trials, legal depositions, formal evaluations), the flexibility of informal rapport may conflict with validity requirements. Standardization may require sacrificing rapport optimization.

## Conclusion: Context Is Not a Background Condition — It Is a Design Parameter

The paper's comparison between informal source handler/CHIS interactions and formal investigative interviews is not a methodological limitation to be apologized for — it is one of the paper's most valuable contributions. By operating in a genuinely different context from most interview research, it reveals that context shapes which rapport behaviors are available, which are appropriate, and which actually predict yield.

For agent systems: **context is not a background condition but a design parameter.** The rapport-equivalent behaviors that drive yield in an established cooperative relationship (attention, coordination) differ from those that matter in first contact (positivity, coordination), which differ again from those that apply in adversarial settings. Systems that apply a single rapport framework regardless of context will be suboptimal across all contexts.

The design task is to characterize the interaction contexts in which your agent operates, identify the rapport components that are most available and most predictive in each context, and calibrate behavioral investment accordingly. The telephone-based informal cooperative relationship described in this paper is probably the closest structural model for many AI agent-user interactions — informal, verbal or text-based, ongoing, without physical presence, built on mutual benefit. Its lessons are therefore directly applicable: invest heavily in attention and coordination, don't mistake positivity for substance, and build structural scaffolding into naturally informal contexts to prevent coordination from being systematically underdeployed.
```

### FILE: frequency-monitoring-as-quality-control.md
```markdown
# Frequency Monitoring as Quality Control: How Counting Specific Behaviors Provides Better Feedback Than Holistic Ratings

## The Case Against Holistic Quality Assessment

Evaluating the quality of a complex interaction — an interview, a consultation, an agent conversation — is difficult. The natural temptation is to produce a single holistic rating: "this was a good interview" or "the rapport was strong" or "the interaction was productive." Holistic ratings are intuitive, quick, and feel informative.

The investigative interviewing literature, and this paper's methodology in particular, make a strong empirical case that holistic ratings are insufficient and in some ways actively misleading. They obscure the behavioral specificity needed for diagnosis, training, and improvement. They are subject to halo effects (an interaction that *feels* good holistically may be missing critical specific behaviors). And they cannot be used to identify *which* behaviors need to change to produce better outcomes.

Nunan et al. (2020) use frequency monitoring — counting the specific occurrences of operationally defined behaviors — as the primary measurement tool. This methodological choice is not a concession to quantitative convention; it is a substantive argument about how quality should be assessed in complex communicative interactions.

## The Frequency Monitoring Approach: Core Principles

The paper's methodology operationalizes frequency monitoring through several specific choices:

### Exact Behavioral Definitions
Each behavior in the rapport framework is defined with sufficient specificity to be reliably coded by independent raters. For example:
- Back-channel responses: "facilitators/encouragers, e.g. 'uh huh' or 'hmm'" — explicitly *excluding* "qualitative feedback such as 'perfect' or 'good' as these can be viewed as leading and therefore negative"
- Paraphrasing: "Repeating back what the CHIS said, which demonstrates the source handler has clearly attempted to process what the CHIS is saying"
- Appropriate use of pauses: "Source handler uses pauses to facilitate talking, which are not awkwardly placed"

The definitions are specific enough to distinguish the target behavior from superficially similar behaviors that have different functions. This precision is the foundation of reliable coding.

### Categorical Exclusivity
"Each word or phrase from the source handler was only coded as one of the three rapport components (e.g. attention, positivity or coordination) from the developed framework (see Table 1) and could not be coded as multiple components" (p. 7).

This mutual exclusivity is a design choice that enforces analytical clarity. In some cases, a behavior might plausibly fit multiple categories — but forcing a single categorization requires the coder to make a definitive judgment about the behavior's primary function. This discipline prevents category overlap from inflating apparent frequencies.

### Raw Count vs. Rated Impression
"The framework of verbal rapport used an objective measure of rapport, by coding the frequency of each verbal behaviour, rather than using a subjective rating scale (e.g. a Likert scale of 1–5) of rapport behaviours or the interaction as a whole" (p. 7).

A Likert scale produces a holistic judgment; a frequency count produces a behavioral record. The frequency count is:
- More reliable (less subject to rater biases and halo effects)
- More interpretable (it tells you *how much* of each behavior was present, not just whether it felt good overall)
- More diagnostic (it can be broken down to identify specific behavioral gaps)
- More trainable (it can be used to set specific behavioral targets for improvement)

### Whole-Interaction Analysis
The paper deliberately did not divide interactions into three equal time segments (beginning, middle, end) as Collins and Carthy (2019) had done. The rationale: "dividing an interaction into three equal segments is unlikely to truly represent the 'beginning', 'middle' and 'end' of an interaction" (p. 7) because natural interaction phases do not correspond to equal time intervals.

This choice preserves the ecological validity of the frequency counts — they reflect the actual temporal distribution of behaviors across the interaction, rather than being artificially segmented.

## Interrater Reliability: Making Behavioral Coding Auditable

A frequency monitoring system is only as good as the reliability of the coding. The paper addresses this directly: "The first and second authors utilised the framework of verbal rapport... to code the audio recorded telephone interactions. In order to ensure the coding scheme was viable, the first and second authors coded one telephone interaction together as a training exercise. The second author independently coded a random sample of 13 of the source handler and CHIS interactions" (p. 7).

The resulting interrater reliability: Cohen's kappa = .77, 95% CI [.71, .83], p < .001. This is conventionally classified as "substantial" agreement and is a strong reliability result for behavioral coding of naturalistic interaction data.

Why does interrater reliability matter so much? Because behavioral coding systems, like the behaviors they are trying to capture, are susceptible to the self-report problem. If only one coder applies the framework, that coder's idiosyncratic interpretations of the definitions can produce results that appear objective but are actually person-specific. Independent coding by a second rater, measured against the first, establishes that the framework is producing *intersubjectively valid* behavioral assessments, not just the first coder's impressionistic judgments.

## The Coefficients of Determination: Going Beyond Significance

The paper makes an unusual and important methodological recommendation: "The present research advocates for the utilisation of the coefficients of determinations (R2) when examining rapport. This is because the coefficients of determinations go beyond just accepting significant correlations at face value, but rather explore how the percentage of observed variation that can be explained by one factor (i.e. intelligence yield) with another factor (i.e. overall rapport, attention, positivity or coordination)" (p. 14).

This is a call for practical significance, not merely statistical significance. A finding can be statistically significant (unlikely to be zero in the population) while explaining very little of the actual variation in the outcome. The paper demonstrates this with coordination: r = .21 (statistically significant, p = .028) but R² = .05 (explains only 5% of yield variance, with 95% variability unexplained).

The table of R² values is worth examining as a teaching tool:

| Component | R² for Overall IY |
|-----------|------------------|
| Attention | 69% explained |
| Coordination | 5% explained |
| Positivity | 4% explained |
| Overall Rapport | 48% explained |

Attention explains 69% of the variance. The other two components combined explain 9%. This is not a difference of degree — it is a difference of kind. If you had to choose where to invest training and design attention for a source handler population, the answer is clear.

But the paper also notes that overall rapport, which combines all three, explains only 48% — less than attention alone (69%). This counterintuitive result occurs because positivity and coordination add noise alongside signal. When you combine attention with less-predictive components, you dilute the predictive power. This is a sophisticated finding: more rapport is not always better — the *composition* of rapport matters.

## Frequency Monitoring as a Training Tool

The paper is explicit about the training implications of its framework: "The rapport framework in the present research could be utilised in a training environment to highlight verbal behaviours associated with the three components of rapport" (p. 13-14). More specifically: "the present framework of rapport could be used to assess training sessions and monitor real-world interactions" (p. 14-15).

This is the operational purpose of frequency monitoring as a quality control mechanism. Rather than asking "was this a good session?", a supervisor applying the framework would ask:
- How many attention behaviors were deployed (across all eight subcategories)?
- Were probing behaviors sufficient relative to the length and complexity of the interaction?
- Were summaries provided at appropriate intervals?
- How many coordination behaviors were deployed?
- Were pauses used appropriately?
- Was the interaction's purpose and future expectations communicated?
- What was the baseline positivity frequency?
- How did these frequencies compare to the mean rates in the sample (attention M=24.77, positivity M=12.21, coordination M=10.12)?

This produces *specific, actionable feedback* rather than holistic impressions. A supervisor who tells a handler "your rapport was fine but try to be more attentive" has given vague feedback. A supervisor who tells a handler "you used back-channel responses 8 times this call against a mean of 15, and you never summarized intermittently" has given specific, behavioral, measurable feedback.

## The Mean Rates as Operational Benchmarks

The paper provides mean behavioral frequencies that can serve as benchmarks:
- Attention: M = 24.77 behaviors per call (SD = 15.26)
- Positivity: M = 12.21 (SD = 6.53)
- Coordination: M = 10.12 (SD = 5.23)
- Overall rapport: M = 47.10 (SD = 21.75)

These benchmarks are imperfect — the paper acknowledges that the sample comes from a single force area, and that grouping interactions across handlers reduces individual-level interpretability. But they establish an empirically grounded sense of what typical behavior looks like in this context.

More important than the specific numbers is the *principle*: frequency monitoring produces benchmarks that can be compared across interactions, across practitioners, and across time. Without such benchmarks, quality assessment is necessarily relative to impression rather than to empirical reference points.

## Applications in Agent System Design

### Behavioral Logging as the Foundation of Quality Control

For AI agent systems, frequency monitoring translates into a requirement for detailed behavioral logging. Not logging in the sense of recording inputs and outputs — but logging specific communicative behaviors as categorized by an operationally relevant taxonomy.

For a user-interaction agent:
- How many times did the agent deploy probing behaviors (asking follow-up questions that sought elaboration or clarification)?
- How many times did the agent paraphrase user input