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