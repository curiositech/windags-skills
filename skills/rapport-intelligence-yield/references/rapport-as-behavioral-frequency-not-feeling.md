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