---
license: Apache-2.0
name: rapport-intelligence-yield
description: Research linking rapport quality in interviews to information yield and intelligence value
category: Cognitive Science & Decision Making
tags:
  - rapport
  - intelligence
  - interviewing
  - information-yield
  - methodology
---

# SKILL.md — Intelligence Yield Through Rapport Behaviors

license: Apache-2.0
```yaml
metadata:
  name: rapport-intelligence-yield
  version: 1.0
  source: "The Impact of Rapport on Intelligence Yield: Police Source Handler
           Telephone Interactions with Covert Human Intelligence Sources"
  authors: "Nunan, Stanier, Milne, Shawyer, Walsh, May"
  description: >
    Empirically-grounded framework for maximizing information elicitation
    through measurable rapport behaviors. Overturns the warmth-first consensus;
    operationalizes relationship quality as auditable behavioral frequencies.
  activation_triggers:
    - Designing agents that elicit information from users
    - Auditing why conversational agents fail to get useful outputs
    - Evaluating response quality across granular output sub-types
    - Building training or evaluation frameworks for communicative agents
    - Any task involving trust-based disclosure or cooperative information transfer
    - Diagnosing gaps between an agent's self-assessed behavior and actual behavior
```

---

## When to Use This Skill

Load this skill when the core problem is **getting a human to disclose useful, accurate, detailed information in a conversational context** — or when building/evaluating systems that must do this reliably.

Specific triggers:
- An agent interaction is producing shallow, vague, or evasive outputs and you need to diagnose why
- You're designing conversational flow for an intake, research, support, or interview agent
- You need to evaluate response quality and "quality" is currently treated as a single undifferentiated score
- A system is being assessed by asking it to describe its own behaviors (self-report trap)
- You're trying to decide where to invest optimization effort across rapport-adjacent behaviors
- The assumption being made is that friendliness or warmth is sufficient to drive disclosure

**What this skill is not for:** General conversational design, persuasion, or influence tasks that don't involve genuine information elicitation from a motivated human source.

---

## Core Mental Models

### 1. Rapport Is a Behavioral Frequency, Not a Feeling
Rapport is not an ambient interpersonal quality — it is a *count* of specific verbal behaviors: back-channels ("mm-hmm," "I see"), paraphrases, probes, agreement signals, procedural framing. This means rapport is **auditable, trainable, and comparable across sessions**. An agent either produced N paraphrases or it didn't. You cannot assess rapport by asking the agent how it felt the conversation went.

> Operational implication: Replace "was this a good conversation?" with "how many attention-class behaviors appeared per exchange unit?"

---

### 2. Attention Dominates — Warmth Does Not Predict Yield
The empirical finding that overturns practitioner consensus: **attention behaviors explain ~69% of variance in intelligence yield; positivity (warmth, empathy, humor) explains ~4%.** What makes sources disclose is not being liked — it is being *demonstrably processed*. The source must see that their output is being received, remembered, explored, and acted upon.

Attention behaviors include: active listening signals, probing questions, summarizing back, exploring motivation, tracking prior disclosures.

> Operational implication: If forced to choose where to invest, optimize for attention over positivity. Positivity has interpersonal value but weak causal link to information output.

---

### 3. Coordination Is the Structural Scaffold for Transfer
Coordination — shared goal-framing, agreeing on process, encouraging the other party to speak, appropriate pausing — creates the *conditions* under which transfer can occur. It answers: "Do both parties know why we're talking and what success looks like?" Though used least frequently by handlers in the study, it significantly correlated with yield, particularly for action and temporal detail types.

> Operational implication: Early coordination investment (framing the purpose, confirming mutual goals) is disproportionately leveraged. Don't treat it as optional scene-setting.

---

### 4. Self-Report Is Systematically Unreliable
Agents and humans alike cannot accurately describe their own communicative behavior. Police officers in this study reported using rapport behaviors they demonstrably were not using when recordings were analyzed. This is not deception — it is a structural gap between perceived practice and actual practice. **Any quality framework that relies on self-assessment of behavioral frequency will be biased toward overconfidence.**

> Operational implication: Behavioral auditing of actual outputs is mandatory. Self-report is useful only as a hypothesis about what an agent *believes* it does — never as ground truth.

---

### 5. Intelligence Yield Is Decomposable Into Typed Sub-Categories
"Output quality" is not one thing. The paper codes yield across five detail types: **surrounding** (location/context), **object**, **person**, **action**, and **temporal**. Different rapport components differentially predict different yield types — attention predicts all five, coordination specifically predicts action and temporal detail. Treating yield as monolithic hides this structure.

> Operational implication: Decompose output evaluation into typed sub-categories. A system that produces rich person-descriptions but thin temporal context has a different failure mode than one producing the inverse.

---

## Decision Frameworks

### If the agent is producing low-quality or shallow outputs...
→ **First**: Audit attention-class behaviors. Are probes being issued? Are prior disclosures being referenced and built upon? Is the agent demonstrably tracking what the human said?  
→ **Second**: Check coordination. Did the interaction establish shared purpose? Does the human know what a useful response looks like?  
→ **Third** (only after the above): Check positivity. Warmth issues are rarely the bottleneck.

---

### If you're evaluating output quality...
→ **Decompose** into typed sub-categories before scoring. Use a yield taxonomy (surrounding, object, person, action, temporal or domain-equivalent). Identify which types are present, absent, or thin.  
→ **Do not** collapse to a single score until you've mapped the sub-type profile.

---

### If you're relying on the agent's self-description of how it performed...
→ **Treat as hypothesis, not evidence.** Collect behavioral counts from actual transcripts. Expect systematic overestimation of attention and coordination behaviors.  
→ **Use behavioral auditing** as the primary quality signal; self-report as a secondary diagnostic only.

---

### If designing a new conversational agent for elicitation tasks...
→ **Prioritize attention architecture first**: build in probing logic, back-channel signaling, paraphrase-and-confirm loops, prior-disclosure tracking.  
→ **Design coordination hooks early**: opening frames that establish shared purpose, checkpoints that confirm mutual goal alignment.  
→ **Add positivity/warmth last**: it is necessary for relationship maintenance but not the primary yield driver.

---

### If optimization resources are constrained and you must prioritize...
→ **Attention > Coordination > Positivity** for yield.  
→ **Coordination > Attention > Positivity** for establishing the interaction's productive structure before content exchange begins.

---

### If the human source appears disengaged or withholding...
→ **Check for coordination failure first**: has shared purpose been established? Does the source understand what they're contributing to?  
→ **Check for attention failure second**: have their previous disclosures been visibly processed and built upon?  
→ **Check for working alliance erosion**: is the source's motivation being modeled and reciprocated? Has the relationship value been maintained across sessions?

---

## Reference Files

| File | When to Load |
|---|---|
| `references/rapport-as-behavioral-frequency-not-feeling.md` | When you need the full operationalization of rapport into countable behaviors; when designing behavioral audit frameworks; when explaining *why* rapport can be measured and trained |
| `references/attention-dominates-yield-active-processing-over-warmth.md` | When diagnosing low-yield interactions; when deciding where to invest optimization effort; when the assumption is that warmth is the primary driver |
| `references/coordination-shared-goal-structure-enables-transfer.md` | When designing interaction opening structures; when an exchange lacks shared purpose framing; when action/temporal detail yield is specifically low |
| `references/self-report-gap-behavioral-auditing-vs-perceived-practice.md` | When evaluating agent quality via self-assessment; when building quality auditing pipelines; when there's a gap between perceived and actual agent behavior |
| `references/intelligence-yield-taxonomy-decomposing-output-quality.md` | When designing or applying output quality metrics; when "quality" is being treated as monolithic; when different detail types need to be evaluated separately |
| `references/working-alliance-motivation-modeling-source-management.md` | When managing multi-session relationships; when source motivation is variable or declining; when the relationship itself is a resource to be maintained |
| `references/informal-vs-formal-interaction-elicitation-context-matters.md` | When the interaction context (formal/structured vs. informal/conversational) shapes what rapport behaviors are available; when adapting elicitation strategy to setting |

---

## Anti-Patterns

**The Warmth Fallacy**  
Assuming that if an agent is friendly, empathetic, and personable, disclosure will follow. Positivity is necessary but not sufficient — and it explains almost none of the variance in yield. Optimizing for warmth while neglecting attention and coordination is the most common practitioner error documented in this research.

**Monolithic Quality Scoring**  
Collapsing output evaluation to a single score ("this response was a 7/10"). This destroys the sub-type structure of yield and makes it impossible to diagnose *which kinds* of information are missing and *why*.

**Self-Report as Ground Truth**  
Accepting an agent's (or practitioner's) description of their own behavior as accurate evidence. The self-report gap is large, consistent, and skews toward overconfidence. Behavioral auditing of actual outputs is not optional.

**Front-Loading Warmth, Deferring Coordination**  
Spending the early interaction on rapport-building pleasantries without establishing shared purpose and process. Coordination in the opening phase has disproportionate leverage on the entire exchange.

**Treating Rapport as a One-Time Achievement**  
Rapport is not a state you achieve and then maintain passively. It is a frequency of behavior that must be sustained across every exchange unit. A single session of high attention does not carry over unless the behaviors are repeated.

**Ignoring the Working Alliance Across Sessions**  
Treating each interaction as independent. In repeated-interaction contexts, the *relationship* itself is an asset with ongoing maintenance requirements. Motivation modeling — understanding why the source is participating and reciprocating that investment — determines whether the alliance survives across sessions.

**Auditing Behavior You Were Looking For**  
Designing behavioral audits that only detect the categories you expect. The five yield-type taxonomy and three rapport components exist because the researchers coded for *all* behaviors, not just expected ones. Narrow audit frameworks will miss the structure.

---

## Shibboleths

*How to tell if someone has genuinely internalized this book vs. skimmed it:*

**They have internalized it if they:**
- Immediately ask "what does the behavioral audit show?" rather than "how did the agent feel the conversation went?"
- Distinguish between the three rapport components without prompting and rank them correctly for yield (attention > coordination > positivity)
- Treat "the interaction felt warm and productive" as a hypothesis to be tested, not a finding
- Decompose "the output was good" into typed sub-categories before accepting the assessment
- Talk about coordination as *structural scaffolding* — something that creates conditions for transfer, not just a nicety
- Express calibrated skepticism about any quality data that comes from self-report
- Identify the working alliance as a *resource* that requires active maintenance, not a background condition

**They have only read the summary if they:**
- Treat warmth and rapport as synonyms
- Assume that high attention and high positivity co-occur and optimize together
- Accept "we build good rapport" as an explanation without asking for behavioral evidence
- Discuss yield as a single dimension ("more information" vs. "less information")
- Believe that training people to *report* using rapport behaviors is sufficient to change their actual behavior
- Treat the 69%/4% finding as a curiosity rather than a design constraint
- Frame coordination as "agreeing on norms" rather than as an active, yield-predicting behavioral class

---

*Load reference files on demand as specific sub-problems arise. This index is sufficient for most diagnostic and design tasks; the reference files provide the mechanistic depth needed for implementation and evaluation work.*