# The Knowing-Doing Gap: Why Familiarity with a Method Predicts Almost Nothing About Competence

## The Core Problem

Perhaps the most practically important finding in Brimbal et al. (2021) is not about 
rapport at all — it is about the relationship between knowing what to do and actually 
doing it well.

Before training, investigators rated their familiarity with rapport-building tactics 
higher than any other category of skills measured:

> "Investigators reported being moderately familiar with the techniques before the 
> training (M = 4.35, SD = 1.46)... we only observed differences between techniques 
> on the likelihood of future use rating, such that investigators reported being... 
> most likely to use rapport-building tactics (M = 6.59, SD = .65)." (p. 61)

These same investigators, after a two-day training on exactly those tactics, showed 
significant increases in their actual use of those tactics (d = 0.53 to d = 1.10). 
Their pre-training behavior was not matching their pre-training self-assessed knowledge.

This is the knowing-doing gap in action: practitioners believed they were already using 
rapport-building tactics. The behavioral evidence showed they were not — or not nearly 
as effectively as they thought. Training that targeted those tactics produced large 
behavioral changes in people who thought they didn't need the training.

---

## Why Self-Reported Competence Is a Poor Proxy for Actual Competence

The study explicitly addresses this:

> "Although most training evaluations typically assess such self-reported learning 
> effects, these evaluations often fail to predict learning or subsequent use of the 
> information (Carpenter et al., 2020; Uttl et al., 2017). Thus, we designed our 
> study to examine changes in actual behavior as an assessment of learning." (p. 63)

This is a methodological statement with deep implications. Self-reported learning — 
"I understood the training," "I feel prepared to use these techniques," "I'm likely 
to use these in the future" — is largely uncorrelated with actual behavioral change 
and with the quality of outcomes produced.

The mechanisms behind this gap include:

### 1. The Illusion of Competence Through Conceptual Familiarity
Knowing the name of a technique, knowing its rationale, and being able to describe 
it verbally creates a feeling of competence that does not correspond to the behavioral 
integration required to execute it under the pressure of a live interaction. An 
investigator who has heard "use open-ended questions" in training knows about 
open-ended questions. Under the pressure of an actual interview with a resistant 
subject, that same investigator may revert to closed-ended questions without noticing.

### 2. The Pressure Reversion Effect
Skills that require deliberate cognitive effort — and all the rapport-building skills 
in this study require such effort — are the first to disappear when cognitive load 
increases. Facing a resistant subject who is providing incomplete answers, an interviewer 
under pressure will revert to the more automatic, habitual pattern: direct, closed-ended, 
pressure-based questioning. The known-but-not-practiced skill evaporates precisely 
when it is most needed.

### 3. The Implicit Theory Problem
Practitioners who have developed working theories of their practice through years of 
experience have strong implicit models of what works. When training offers an alternative 
model, practitioners may accept it conceptually while their implicit model continues 
to drive behavior. The explicit knowledge sits on top of a behavioral repertoire built 
from the implicit model. Under pressure, the implicit model takes over.

### 4. The Misclassification Problem
Because investigators rated themselves as already familiar with rapport-building, 
they may have been classifying some of their existing behaviors as rapport-building 
even when those behaviors did not meet the research standard. The accusatorial approach 
includes tactics like "expressing sympathy" and "friendly demeanor" (Horgan et al., 2012, 
cited p. 64) that *feel* like rapport to practitioners but are actually minimization 
tactics from the coercive playbook. Practitioners may have been counting these as 
rapport-building without recognizing the distinction.

The study explicitly notes this issue:

> "we emphasized throughout the training an important distinction between rapport-based 
> tactics and minimization tactics that are frequently taught for accusatorial interviews... 
> certain tactics classified as minimization were more likely to manipulate the perceived 
> consequences associated with a confession... whereas other tactics could more generally 
> facilitate engagement." (p. 64)

---

## The Behavioral Evidence Standard

The study's methodological response to the knowing-doing gap is crucial: **measure 
behavior, not self-report**. Trained coders, blind to condition, assessed actual 
interview behaviors against operational definitions. The behavioral measure told a 
very different story than the self-report measure.

This implies a general principle for any system that relies on learned skills:

> **Self-evaluation and self-report of skill competence are almost always biased 
> toward overestimation, with the bias being largest in domains where the person 
> has substantial experience (and thus a rich conceptual vocabulary for describing 
> the skill) but has not recently received behavioral feedback against an external 
> standard.**

For agent systems, this translates into a critical design principle: **do not use 
an agent's self-assessment of its own capabilities as the primary input to routing 
and task allocation decisions**. An agent that reports high confidence in a skill 
may be reporting familiarity with the concept of that skill, not demonstrated 
competence at executing it.

---

## The Training Design Implications

The fact that a two-day training produced effect sizes of d = 0.53 to d = 1.10 in 
behavioral change, in experienced practitioners who thought they were already competent, 
reveals several things about effective training design:

### Behavioral Practice Is Non-Negotiable
The training included "lectures, discussions, and practical exercises" (p. 59). The 
practical exercises — in which investigators actually conducted interviews and received 
feedback — are where the behavioral change occurs. Lectures and discussions alone do 
not close the knowing-doing gap.

### Feedback Against External Standards Closes the Gap
The pilot study refined the training "based on feedback from this sample of investigators" 
about which exercises were most helpful. External behavioral feedback — being told by 
an objective observer what you actually did, not what you thought you did — is the 
mechanism of change.

### Graduated Complexity Builds Competence
The training used a "funnel structure" (starting broad and carefully narrowing focus) 
as a teaching device for questioning itself. This mirrors best practices in skill 
acquisition: teach the broad principle first, then the specific application, rather 
than leading with the specific.

### Skill Erosion Is Real and Predictable
The study acknowledges: "previous research has often observed a decline in training 
effects following extended periods (e.g., Griffiths & Milne, 2006; Powell et al., 2005)" 
(p. 64). Behavioral skills, unlike conceptual knowledge, require maintenance through 
continued practice. A practitioner who was trained two years ago and has not practiced 
the trained skills systematically since will show significant skill erosion — yet may 
report high familiarity with the methods, because conceptual knowledge decays more slowly 
than behavioral competence.

---

## Implications for Agent System Design

### Capability Claims Require Behavioral Validation
When an agent (or a model, or a skill module) claims it can perform a task, that claim 
should be validated against behavioral evidence — actual outputs assessed against 
external standards — not taken at face value. The claim may accurately reflect 
conceptual understanding of the task without predicting successful execution.

### High-Stakes Tasks Should Include Pre-Task Skill Verification
For tasks where failure is costly, the system should include a verification step that 
assesses whether the agent's relevant skills are active and calibrated, not just 
available. An agent that "knows" how to do security auditing but hasn't done it recently 
under realistic conditions may show the same knowing-doing gap as the investigators 
in this study.

### Pressure and Difficulty Reveal the Gap
The knowing-doing gap widens under pressure. An agent that performs well on simple 
instances of a task may revert to simpler, less sophisticated patterns on hard instances. 
Testing capabilities on easy cases does not reveal whether the gap exists on hard cases.

### The Toolbox Failure Mode
The study references "a 'toolbox' approach" as a problematic pattern in practitioner 
adoption of evidence-based techniques (Snook et al., 2020, cited p. 58): practitioners 
selectively adopt the parts of evidence-based approaches that are easiest to execute 
or most consistent with their existing habits, rather than integrating the approach 
as a whole. The result is the appearance of evidence-based practice without the substance.

In agent system design, this corresponds to agents that have access to sophisticated 
skill modules but invoke them only in the easiest, most scripted ways — using the 
tools but not the methodology that makes the tools effective.

---

## Summary Principle

> **Knowing a method and being able to execute it under real conditions are largely 
> independent. Self-reported familiarity, confidence, and intent to use are poor 
> predictors of actual behavioral competence. Closing the gap requires behavioral 
> practice with external feedback against operational standards, not additional 
> conceptual instruction. Any system that allocates tasks based on claimed capability 
> rather than demonstrated behavioral output is systematically overestimating the 
> competence of its components.**