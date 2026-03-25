---
license: Apache-2.0
name: klein-1998-sources-of-power
description: Naturalistic decision-making research showing how experts make decisions through recognition-primed processes
category: Cognitive Science & Decision Making
tags:
  - naturalistic-decision-making
  - expertise
  - recognition-primed
  - intuition
  - ndm
---

# SKILL.md — Sources of Power: How People Make Decisions

license: Apache-2.0
```yaml
name: sources-of-power
version: 1.0
author: Gary Klein (field research synthesis)
description: >
  Cognitive science of naturalistic decision-making — how skilled practitioners
  actually decide under pressure, uncertainty, and time constraints.
activation_triggers:
  - expert judgment / intuition / gut feeling
  - decision-making under pressure or uncertainty
  - analyzing errors, failures, or near-misses
  - designing training programs or onboarding
  - building team coordination or communication protocols
  - evaluating a course of action with incomplete information
  - understanding the gap between novice and expert performance
  - interface design, procedure design, or checklist design
  - incident post-mortems and root cause analysis
```

---

## When to Use This Skill

Load this skill when someone is:

- **Trying to make a high-stakes decision** with incomplete information and no time for exhaustive analysis
- **Designing systems for human operators** (interfaces, checklists, procedures, training)
- **Diagnosing why an expert failed** or made a surprising judgment call
- **Building expertise** in themselves or others — what actually produces skilled performance?
- **Running a post-mortem** and trying to understand how a reasonable person made an error
- **Coordinating under pressure** — teams working fast with partial information
- **Questioning their own intuition** — should I trust this feeling, or override it?
- **Evaluating options** when a formal decision matrix feels inadequate to the situation

This skill is *not* primarily about rational choice, expected utility, or optimization. It's about the cognitive mechanisms that operate when stakes are real and time is short.

---

## Core Mental Models

### 1. Recognition-Primed Decision Making (RPD)
Experts don't compare options — they *recognize* situations as types and see the appropriate response directly. In Klein's 156-case firefighting study, **80% of decisions involved a single option evaluated alone**, not a comparison between alternatives. The commander asks: *"Will this work?"* not *"Which is best?"*

Recognition delivers four things simultaneously: **goals, cues, expectancies, and a plausible action**. The action is then evaluated through mental simulation. If it passes, it's executed. If not, the next plausible option is generated — not all options at once.

*Implication*: When an expert says "I just knew," they're compressing a sophisticated recognition-and-simulation process, not guessing. When a novice tries to be rigorous by comparing all options, they often lack the pattern library to generate good options in the first place.

### 2. Mental Simulation as the Evaluation Tool
Rather than scoring options against criteria, experts **run the action forward in time** — watching it unfold, noticing where it might break. This simulation has hard cognitive limits:
- **~3 moving parts** can be tracked simultaneously
- **~6 state transitions** before working memory collapses
- Experts compensate by **chunking**: compressing complex sequences into single abstract units ("the fire's going to cut off egress" = many variables collapsed into one)

Mental simulation is the difference between "this plan looks good on paper" and "I can see three places this falls apart." It's teachable but requires a rich mental model of the domain to run.

### 3. Intuition Is Pattern Recognition, Not Instinct
When a firefighter evacuates a building he can't explain, he's detecting an **expectancy violation** — fire behavior, heat, and sound don't match his mental model. Intuition is the signal that the pattern doesn't fit. It's neither mystical nor infallible.

Intuition can be:
- **Trained**: by exposure to many varied cases with accurate feedback
- **Trusted selectively**: in domains with regular patterns and reliable feedback (firefighting, chess, experienced nursing)
- **Distrusted**: in domains with irregular patterns, outcome delays, or motivated reasoning (stock picking, political forecasting, hiring)

The key question is always: *"What is this intuition pattern-matched to, and is that pattern library reliable?"*

### 4. Errors Come From System Failures, Not Biased Brains
Klein's 600+ decision-point review found:
- **64% of errors**: lack of experience (operator couldn't recognize the situation correctly)
- **20% of errors**: missing/corrupted information (bad interface, incomplete data)
- **16% of errors**: simulation failures (operator recognized correctly but simulated poorly)

The **operator blamed for the error is usually the victim of latent system failures** — interfaces that hide critical information, training that didn't expose relevant patterns, designs that make errors easy and recovery hard. This reframes post-mortems entirely.

### 5. Expertise Is Perceptual, Not Procedural
The deepest finding: experts *see differently*. They:
- Detect patterns novices can't perceive
- Notice **anomalies** — things that *didn't* happen but should have
- Read the **past and future** of a situation from present cues
- Manage their own cognitive load strategically

Rules and procedures can encode what experts know, but they cannot *build* expertise. Expertise requires thousands of varied cases with accurate feedback, structured reflection, and mentorship that makes invisible perceptions visible.

---

## Decision Frameworks

### When evaluating a course of action:
> **If you're an expert in the domain** → run a mental simulation. Watch it fail. Ask: *"Where does this break?"* Trust the result more than a criteria matrix.
>
> **If you're a novice** → don't trust your first option. You may not have the pattern library to generate a good one. Slow down; seek expert input; use checklists as scaffolding, not replacement for judgment.

### When trusting (or overriding) intuition:
> **If the domain has regular patterns and accurate feedback loops** → intuition is probably worth examining seriously. Probe: *"What is this feeling pattern-matched to?"*
>
> **If the domain has irregular patterns, long feedback delays, or strong incentives for motivated reasoning** → treat intuition as a hypothesis to test, not a decision.

### When diagnosing an error:
> **If the operator "should have known better"** → first ask: *"What information did they actually have? What patterns had they been trained to recognize? Was the interface showing what it needed to show?"* Blame is almost always the wrong stop.
>
> **If you're designing training to prevent the error** → focus on **pattern exposure** (varied cases, not procedures) and **feedback accuracy** (do trainees learn whether their recognition was right?).

### When coordinating a team under pressure:
> **If the team is experienced and aligned** → communicate **intent** ("here's why we're doing this and what matters"), not procedure. Let recognition guide local decisions.
>
> **If alignment is uncertain** → surface mental models explicitly before acting. The failure mode is two people who both think they're on the same page but have incompatible situational pictures.

### When problem-solving hits a wall:
> **If the goal is unclear or keeps shifting** → stop optimizing the path; redefine the destination. Most "solution failures" are actually goal-framing failures.
>
> **If the problem seems intractable** → look for **leverage points**: the small intervention that changes the system's behavior, not the large intervention that attacks the symptom directly.

---

## Reference Files

| File | Description | Load When... |
|------|-------------|--------------|
| `references/recognition-primed-decision-making.md` | Full RPD model with case studies from firefighting, military, and chess. Covers the three RPD variants (simple match, diagnosed match, evaluate + simulate). | Someone needs to understand *how* expert decision-making actually works, or is designing a system that should support it rather than replace it. |
| `references/mental-simulation-and-expertise.md` | Deep dive on mental simulation: cognitive limits, chunking, how experts run forward simulations, what breaks them. | Evaluating a plan, designing a training exercise, understanding why "thinking it through" failed, or building decision support tools. |
| `references/expertise-and-the-power-to-see-invisible.md` | What expertise actually consists of: perceptual chunking, anomaly detection, past/future reading, cognitive load management. Includes how to *build* expertise deliberately. | Designing training programs, onboarding, mentorship structures, or diagnosing why a "trained" person still can't perform. |
| `references/errors-and-uncertainty.md` | Klein's taxonomy of errors (experience gaps, information failures, simulation failures). The "operator as victim" framework. How to run a post-mortem that finds real causes. | Post-mortems, incident analysis, blame attribution, system design for error resistance, understanding how good people make bad calls. |
| `references/communicating-intent-and-team-mind.md` | Distributed cognition, intent-based coordination, shared mental models. Why "telling people what to do" fails under pressure and what to do instead. | Team coordination, communication breakdowns, command-and-control design, handoffs, delegation, and high-stakes collaboration. |
| `references/problem-solving-and-leverage-points.md` | Ill-defined goals, nonlinear systems, leverage points, why stage-model problem solving fails on real problems. | Stuck problems, strategy questions, reframing failures, and situations where more effort on the current path isn't working. |

---

## Anti-Patterns

These are the mistakes this book most directly warns against:

**1. Comparing all options before acting**
Generating a full option set and scoring them is correct in stable, well-defined problems with known variables. In dynamic, time-pressured, ambiguous situations, it's often impossible and actively harmful — you're comparing options you don't have time to generate correctly while the situation deteriorates.

**2. Treating intuition as either oracle or noise**
Dismissing expert intuition as "not rigorous" loses the pattern library of thousands of cases. Treating it as infallible ignores that pattern libraries can be wrong, outdated, or misapplied. The right move is always: *"What is this matched to, and is that match valid here?"*

**3. Blaming the operator for system-created errors**
When an expert makes a surprising error, the first question should be about the system (training, information, interface, workload), not the person. The "human error" framing almost always stops the analysis too early and prevents the real fix.

**4. Trying to encode expertise as rules**
Procedures and checklists capture *some* of what experts know — primarily the verifiable, sequential, easily articulable parts. They cannot capture pattern recognition, anomaly detection, or situational awareness. Building rule-following systems and calling them expert systems is a category error.

**5. Optimizing a solution to a misframed problem**
The most efficient path to the wrong destination. Klein's fieldwork shows that significant failures often traced not to poor execution but to a goal that was never correctly defined or that shifted without the team noticing.

**6. Teaching decision-making as a procedure**
Decision trees and formal frameworks work in training novices to ask the right questions. They don't produce expert judgment. The evidence is unambiguous: expertise comes from varied case exposure with accurate feedback, not from better procedures.

---

## Shibboleths

*How to tell if someone has actually internalized Klein vs. just read the summary:*

**They have internalized it if:**
- They ask *"what's your pattern library in this domain?"* before trusting someone's intuition — including their own
- They treat a decision post-mortem as a systems investigation, not a blame assignment
- They can explain why generating one option and stress-testing it is often *smarter* than generating many options
- They're skeptical that any checklist or procedure fully replaces domain expertise — and can say precisely why
- They know the difference between domains where intuition is calibrated vs. domains where it isn't
- When someone says "I just knew," they get curious rather than dismissive
- They understand that "experienced" and "expert" are not synonyms — experience without accurate feedback doesn't build expertise

**They're still on the surface if:**
- They use RPD as a justification for acting on gut feeling without probing what the gut is matching to
- They think the book argues *against* analysis or rigor — it doesn't; it argues for the *right kind* at the *right time*
- They summarize the book as "experts use intuition" without understanding the recognition-simulation mechanism
- They apply Klein's framework in domains where it doesn't belong (domains without regular patterns or reliable feedback)
- They treat the error taxonomy as interesting trivia rather than as a complete reorientation of how to run a post-mortem

**The deepest marker**: Someone who has genuinely absorbed Klein understands that the question *"what should I decide?"* is downstream of *"what am I actually seeing — and is my perception of this situation accurate?"* Expertise lives in the perception, not in the final call.