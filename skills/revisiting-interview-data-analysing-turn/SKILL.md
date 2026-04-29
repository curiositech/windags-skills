---
name: revisiting-interview-data-analysing-turn
description: 'license: Apache-2.0 NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  provenance:
    kind: legacy-recovered
    owners:
    - some-claude-skills
---
# SKILL.md — Intercultural Discourse Analysis & Multi-Perspectival Interpretation

license: Apache-2.0
```yaml
name: intercultural-discourse-analysis
version: 1.0
source: "Revisiting Interview Data: Analysing Turn-Taking in Interviews with Thai
  Participants Through 'Layers of Insight'" — John Adamson
domain: discourse analysis, research methodology, intercultural communication,
  qualitative research
activation_triggers:
  - analyzing conversation transcripts or interview data
  - detecting hidden failure modes in communication or feedback systems
  - designing multi-pass analytical workflows
  - evaluating whether surface-level output reflects actual understanding
  - studying cross-cultural interaction, power dynamics, or face-saving behavior
  - reviewing research methodology for bias or analytical sufficiency
  - interpreting complex qualitative data using multiple frameworks simultaneously
  - identifying when a primary knower inversion may distort data quality
```

---

## When to Use This Skill

Load this skill when:

- **You have data that's been partially analyzed** and want to extract more from it without recollecting. The thesis shows that revisiting with new tools is legitimate and often more fruitful than starting fresh.
- **Surface-level coding is producing suspiciously clean results.** If breakdowns, confusions, or failures are rare in the output, ask whether the system is face-sensitive — hiding errors rather than surfacing them.
- **You're analyzing interaction across power differentials** (teacher/student, expert/novice, interviewer/subject, AI/user) where the lower-power party may comply rather than clarify.
- **A single analytical framework feels insufficient** but you don't know how to use multiple frameworks without paralysis or contradiction.
- **Cultural context seems relevant** but you're unsure whether to foreground it a priori or let it emerge from the data.
- **You need to distinguish what was said from what was understood.** Adamson's central problem — the gap between surface discourse and actual comprehension — is a universal analytical challenge.

---

## Core Mental Models

### 1. Layers of Insight
No single analytical tool is sufficient for complex discourse. The expert approach stacks multiple transparent interpretive lenses — coding systems, cultural criteria, field notes, contextual background — over the same data and applies them selectively. The layers never fully merge into one master interpretation; they remain available individually and in combination.

> *Practical implication*: When interpreting complex output, don't ask "which framework is right?" Ask "what does each framework reveal that the others miss?"

### 2. Emergent Research as Accumulation
Data collected for purpose A contains latent information for purposes B, C, and beyond — *if contextual tools from prior investigations are preserved*. The key is that each analytical pass should deposit context (notes, codes, observations, anomalies) that enriches the next pass rather than being discarded.

> *Practical implication*: Intermediate analytical outputs are valuable assets. Route them forward, don't throw them away. The residue of earlier investigation is often the enabler of later insight.

### 3. Hidden Breakdown
In high power-distance or face-sensitive contexts, communicative failure is *systematically underrepresented* in surface-level discourse. Participants accept non-comprehension rather than risk face-threatening acts. Coding systems that rely on observable repair sequences will miss a significant proportion of actual failures.

> *Practical implication*: If a system depends on self-reported confusion or explicit repair to detect failure, it will produce false-negative rates proportional to the cost the participant perceives in admitting confusion. You need secondary verification mechanisms.

### 4. The Primary Knower Inversion
In standard educational interaction, the teacher holds authoritative knowledge and evaluates the student. In research interviews, this inverts: the student is the primary knower of their own experience, and the researcher should elicit rather than evaluate. When interviewees don't recognize this inversion, they optimize responses for *evaluation* (short, safe, deferential) rather than for *data richness* (expansive, honest, exploratory).

> *Practical implication*: The framing of a question signals who is expected to be the primary knower. Misaligned framing produces systematically distorted answers optimized for the wrong objective.

### 5. Cultural Criteria as Foregrounded Lens (Selective A Priori Analysis)
Standard conversation analysis insists on analyzing talk first, then context — avoiding a priori cultural assumptions. Adamson's experiment inverts this: deliberately foregrounding a specific cultural concept (*sam ruam* — composure under pressure) before analysis reveals patterns invisible to standard coding. The lesson is not to always foreground culture, but to recognize that the choice of when to foreground versus when to let it emerge is itself a consequential methodological decision.

> *Practical implication*: Sometimes you must decide what you're looking *for* before you can see it. Selective a priori framing, used consciously, is not bias — it's a tool.

---

## Decision Frameworks

### On Analytical Sufficiency
- **If** your analysis uses only one coding system or framework → **load** `coding-systems-and-the-limits-of-surface-analysis.md` and ask what each alternative lens would reveal
- **If** results feel conclusive too quickly → **treat this as a red flag**; apply a second layer before synthesizing
- **If** multiple frameworks produce contradictory readings → **do not force resolution**; document the tension as a finding; load `layers-of-insight-multi-tool-interpretation.md`

### On Communication Failure Detection
- **If** failure rates seem implausibly low → **suspect hidden breakdown**; load `hidden-breakdown-and-face-sensitive-communication.md`
- **If** your detection mechanism relies on explicit self-report or visible repair → **assume underreporting** proportional to perceived social cost of admitting failure
- **If** you observe smooth, compliant, minimal-resistance interaction → **do not interpret as comprehension**; load `repair-sequences-as-diagnostic-windows.md` for diagnostic alternatives

### On Power Dynamics in Data Collection
- **If** an interviewee gives short, highly accurate, low-elaboration responses → **consider** that they may be optimizing for evaluation rather than disclosure; load `primary-knower-inversion-and-role-contamination.md`
- **If** the interviewer has explicit authority over the interviewee (teacher, manager, system) → **assume** primary knower inversion risk is high
- **If** responses feel "correct" but lack texture or contradiction → **probe the framing** of your elicitation, not just the content of responses

### On Cultural Context
- **If** participants share a cultural background you don't fully inhabit → **load** `cultural-criteria-and-avoiding-anglocentric-evaluation.md` before finalizing interpretations
- **If** behavior looks like non-participation, passivity, or failure → **ask** whether a culturally-informed reading reframes it as competence or compliance with different norms
- **If** you're unsure whether to apply cultural criteria before or after analysis → **load** `cultural-criteria-and-avoiding-anglocentric-evaluation.md`; the answer depends on whether the pattern you seek is detectable without prior framing

### On Research Design and Data Reuse
- **If** you have prior data that partially addressed a different question → **before recollecting**, load `emergent-research-and-data-revisitation.md`; revisitation may be more efficient and more honest
- **If** you preserved field notes, context, or intermediate codes from prior analysis → **treat these as first-class analytical resources**, not background material
- **If** your current analytical question wasn't anticipated at data collection → this is normal; Adamson's entire thesis is premised on this situation

### On Interaction Structure
- **If** you need to understand how the *format* of an exchange constrains what participants can say → **load** `contingency-and-formality-in-structured-exchanges.md`
- **If** an exchange looks like IRF (Initiation-Response-Feedback) → **ask** whether the F slot is functioning as evaluation or as continuation; the answer changes everything about what the R slot means

---

## Reference Files

| File | When to Load |
|------|-------------|
| `emergent-research-and-data-revisitation.md` | You have existing data and are deciding whether to revisit vs. recollect; designing multi-pass analytical workflows; documenting how a research question evolved |
| `layers-of-insight-multi-tool-interpretation.md` | Applying multiple analytical frameworks to the same data; managing contradiction between lenses; designing sequential analytical passes without premature synthesis |
| `hidden-breakdown-and-face-sensitive-communication.md` | Failure rates seem suspiciously low; detecting non-comprehension in high power-distance contexts; designing systems where self-reporting of failure is unreliable |
| `primary-knower-inversion-and-role-contamination.md` | Analyzing interview data where authority roles are ambiguous; responses feel optimized for evaluation rather than disclosure; designing elicitation questions |
| `contingency-and-formality-in-structured-exchanges.md` | Understanding how exchange format (formal vs. casual) constrains what participants can say; analyzing IRF structures; examining turn-taking allocation systems |
| `cultural-criteria-and-avoiding-anglocentric-evaluation.md` | Participants from different cultural backgrounds than the researcher; behavior looks like failure but may reflect different communicative norms; deciding when to foreground cultural lenses |
| `coding-systems-and-the-limits-of-surface-analysis.md` | Setting up a discourse coding scheme; deciding what coding can and cannot reveal; understanding why coding must be supplemented by interpretive layers |
| `repair-sequences-as-diagnostic-windows.md` | Looking for evidence of comprehension failure in transcripts; distinguishing self-initiated from other-initiated repair; using repair as a proxy for interaction quality |
| `the-researcher-as-instrument-and-source-of-bias.md` | Conducting reflexive analysis of your own analytical process; identifying where researcher background shapes interpretation; writing up positionality |

---

## Anti-Patterns

These are the mistakes Adamson's thesis explicitly warns against:

**1. Treating smooth interaction as successful interaction.**
Absence of visible repair does not mean comprehension occurred. In face-sensitive contexts, apparent smoothness is a risk signal, not a quality signal.

**2. Applying Western (Anglocentric) discourse norms as universal defaults.**
Silence, minimal response, topic avoidance, and deference are competent communicative strategies in many cultures. Coding them as failure or disengagement is a category error.

**3. Collapsing multiple analytical layers into a single master interpretation prematurely.**
The layers are useful precisely because they sometimes contradict each other. Forcing synthesis loses the signal carried by the contradiction.

**4. Assuming the interviewer and interviewee share a frame for what the interaction is.**
If the interviewer intends a research interview but the participant experiences a classroom interaction, the data is shaped by that misalignment — regardless of what was intended.

**5. Discarding contextual residue from earlier analytical passes.**
Field notes, anomalies, unresolved tensions from prior analysis are not noise. They are often the raw material for the next layer of insight.

**6. Using observable repair as the primary or only indicator of breakdown.**
Repair sequences are visible breakdowns. Hidden breakdowns — accepted non-comprehension — are often more consequential and more numerous.

**7. Treating the choice of analytical framework as purely technical.**
Which frameworks you reach for first, which you treat as default, and which you foreground a priori are all value-laden decisions that shape what becomes visible.

---

## Shibboleths

*How to tell if someone has internalized this book's ideas — not just read about them:*

**They have**: When analyzing a dataset with multiple frameworks and hitting a contradiction, they say *"what does this tension itself tell us?"* rather than *"which framework is right?"*

**They haven't**: They reach for a single coding scheme and treat clean inter-rater reliability as validation of the analysis itself.

---

**They have**: When interaction looks smooth and cooperative, they become *more* curious about breakdown, not less. They ask: what would failure look like in this context, and would it be visible at all?

**They haven't**: They equate observable compliance with comprehension, and low explicit-repair rates with high communication quality.

---

**They have**: They distinguish between *the question the data was collected to answer* and *the questions the data is capable of answering*, and treat these as potentially very different.

**They haven't**: They assume that data not collected for their question cannot speak to it.

---

**They have**: When they describe their own analytical position, they include their cultural background, their prior analytical commitments, and the sequence in which they encountered the data — as methodology, not as disclaimer.

**They haven't**: They describe their analytical process as if the researcher were interchangeable with any other trained analyst.

---

**They have**: They can say what each analytical layer reveals *that the others cannot*, and can articulate specific cases where foregrounding one layer first would have made another layer's patterns invisible.

**They haven't**: They treat multiple frameworks as synonyms for "triangulation" — independent routes to the same truth — rather than as genuinely different windows that sometimes show incompatible things.

---

*Last updated: generated from source text*
*Reference documents: 9 files in `/references/`*