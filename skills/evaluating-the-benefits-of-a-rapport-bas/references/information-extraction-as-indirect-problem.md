# Information Extraction Is an Indirect Problem: The Rapport-Cooperation-Disclosure Chain

## Core Insight

When an intelligent system needs information from any source that has reasons to withhold, 
limit, or distort that information, direct extraction strategies will fail or produce corrupted 
output. The correct model is indirect: the system must first create conditions under which the 
source *chooses* to disclose, and that choice is mediated by the source's perception of the 
relationship with the requesting agent.

This is the central empirical finding of Brimbal et al. (2021), demonstrated in a controlled 
field study with experienced law enforcement investigators:

> "rapport and trust-building tactics are less likely to directly influence information 
> disclosure; instead, such tactics influence a subject's willingness to cooperate with 
> an interviewer's questioning." (p. 57)

The structural equation model confirmed this causal chain explicitly:

**Tactics → Perceived Rapport → Cooperation → Disclosure**

Training increased use of tactics (β = .88, p < .001). Tactics predicted perceived rapport 
(β = .17, p = .006). Perceived rapport predicted cooperation (β = .87, p < .001). 
Cooperation predicted disclosure (β = .29, p < .001).

Critically, the *direct* effects of training on cooperation and disclosure were 
**non-significant** (p = .62 and p = .17 respectively). Only the indirect pathway, running 
through rapport perception and cooperation, was significant. This is not a minor methodological 
note — it is the core architectural fact about how information elicitation works.

---

## Why This Matters for Agent Systems

In WinDAGs or any multi-agent orchestration system, agents frequently need information from 
sources that are not perfectly cooperative:

- A **user** who is uncertain, defensive about their requirements, or afraid of giving a 
  wrong answer
- An **external API or data source** that returns ambiguous, partial, or schema-inconsistent 
  responses
- A **downstream agent** in a pipeline that has partial information and uncertainty about 
  what to reveal
- A **subject matter expert** being queried who gives terse, incomplete answers because they 
  don't trust the question framing
- A **legacy system or documentation** that technically contains the information but requires 
  the right access path to yield it

In all these cases, the naive strategy — ask directly, ask repeatedly, rephrase the question, 
increase pressure — is the accusatorial approach. It produces what the source predicts the 
questioner wants to hear, not what the source actually knows. The information is corrupted 
before it arrives.

The rapport-cooperation-disclosure model reframes the problem: **the agent's goal in the 
first phase of interaction is not to extract information but to establish conditions under 
which information will flow voluntarily**.

---

## The Three-Stage Model for Agent Information Gathering

### Stage 1: Establish the Interaction Frame (Productive Questioning)
Before asking for specific information, the querying agent must:
- Use open, non-leading question structures that invite narrative rather than confirmation
- Avoid interrupting or constraining the response space
- Reflect and summarize what has been received to signal comprehension
- Affirm contributions to encourage continued engagement

This is not politeness — it is structural. Open-ended questions produce more accurate 
information because they don't contaminate the response with the questioner's assumptions. 
As Fisher & Geiselman (1992, cited in Brimbal et al.) established, closed-ended and leading 
questions "interfere with an individual's memory and prevent the individual from explaining 
their version of events" (p. 56).

For an agent system, this means: the first queries to any uncertain or semi-cooperative 
source should be broad exploratory queries, not specific targeted queries. Let the source 
reveal its structure before imposing your structure on it.

### Stage 2: Establish the Emotional/Epistemic Tone (Conversational Rapport)
The interaction must communicate:
- **Autonomy**: the source is not being pressured; its response pace and detail level are 
  respected
- **Adaptation**: the querying agent adjusts its approach based on what the source reveals, 
  rather than following a rigid script
- **Evocation**: the agent draws out the source's own perspective, motivations, and 
  uncertainties rather than projecting assumptions
- **Acceptance**: responses are received non-judgmentally; partial or uncertain answers are 
  not penalized
- **Empathy**: the agent demonstrates understanding of the source's position

In agent terms: a system that accepts "I don't know," "I'm uncertain," or "that's not quite 
right" gracefully — and responds by recalibrating rather than repeating the original query — 
is demonstrating conversational rapport. A system that loops the same query or escalates 
confidence requirements is demonstrating the accusatorial approach.

### Stage 3: Build the Relationship (Relational Rapport)
Over repeated interactions or within a single extended interaction:
- **Self-disclosure**: the querying agent shares relevant context about itself (its purpose, 
  its limitations, what it already knows)
- **Similarity-highlighting**: the agent finds and emphasizes common ground between its 
  goals and the source's goals
- **Reciprocity**: the agent offers something before asking — context, information, 
  validation of what the source has already provided
- **Verification**: the agent demonstrates accurate understanding of the source's 
  self-concept, constraints, and perspective

In agent system design: an agent that introduces itself, explains what it's trying to 
accomplish, demonstrates it has understood previous exchanges, and offers partial synthesis 
before asking for more detail is building relational rapport. This directly increases the 
probability that the source will volunteer information beyond the minimum required to answer 
the literal question.

---

## The Mediation Architecture: What This Means for Agent Design

The mediated model has a critical implication: **you cannot measure the success of rapport 
tactics by looking at immediate information yield**. The path runs through an unobservable 
internal state (the source's perception of rapport and trust), through a behavioral decision 
(cooperation vs. resistance), and only then to disclosure.

This means:
1. An agent that builds rapport but receives little information in the first exchange has 
   not necessarily failed — the cooperation decision may still be forming
2. An agent that receives lots of information without building rapport may be receiving 
   low-quality, filtered, or strategically shaped information
3. The right metric at the rapport-building stage is **perceived rapport** (or its proxy: 
   behavioral indicators of trust), not immediate information volume

For agent systems, this suggests that **information quality auditing** should include 
assessment of the interaction conditions under which information was obtained. Information 
obtained under adversarial, pressure-heavy, or poorly-framed conditions should be 
down-weighted or flagged for validation.

---

## Boundary Conditions

This model has clear limits:

**When the source has no relevant information**: No amount of rapport-building will produce 
information that doesn't exist. Rapport optimizes yield from what is available; it cannot 
manufacture content.

**When time constraints are severe**: The study imposed a 20-minute limit and found that 
investigators felt pressed for time, which likely suppressed information yield. Some 
rapport-building requires time that may not be available. In severely time-constrained 
interactions, the model's predictions weaken.

**When contextual factors dominate**: The study acknowledges that "contextual factors that 
are independent of an interviewer's tactics can influence the reporting of information by 
interview subjects" (p. 63). Environmental, situational, and source-specific factors can 
override even excellent rapport tactics. The model explains 17% of variance in cooperation 
and 9% in disclosure — meaningful, but far from complete.

**When the source's resistance is structural rather than relational**: If the source withholds 
information due to institutional policy, legal constraint, or hard technical limitation (not 
uncertainty or distrust), rapport-building will not overcome it. The mediation chain requires 
that the source has the information and is making a discretionary decision about disclosure.

---

## Design Principle for Agent Systems

> **When information yield from a source is below expectation, the first diagnostic question 
> is not "what better question can I ask?" but "what is the source's current state of 
> trust and cooperation, and what interaction history has produced that state?"**

Build into agent interaction loops:
1. A cooperation-state model of each source being queried
2. Tactics calibrated to the current cooperation state (not just the information target)
3. Escalation paths that move through rapport-building before moving to alternative sources
4. Quality flags on information obtained under low-rapport conditions