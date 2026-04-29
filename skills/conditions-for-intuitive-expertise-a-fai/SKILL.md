---
name: conditions-for-intuitive-expertise-a-fai
description: >-
  Diagnose when intuitive judgment, agent confidence, or expert routing can be
  trusted by classifying environment validity, feedback quality, and
  task-boundary fit. Use for confidence calibration, agent routing, expertise
  audits, and escalation design. NOT for deterministic implementation tasks,
  pure syntax debugging, or domains with explicit verifiable answers.
license: Apache-2.0
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
metadata:
  category: Cognitive Science & Decision Making
  tags:
    - intuitive-expertise
    - environment-validity
    - confidence-calibration
    - agent-routing
    - feedback-loops
    - ndm
  pairs-with:
    - skill: llm-router
      reason: Environment validity should influence whether judgment-heavy or structured model paths get used.
    - skill: task-decomposer
      reason: Fractionated expertise is a decomposition problem before it becomes a routing failure.
  provenance:
    kind: legacy-recovered
    sourceDocument: "Conditions for Intuitive Expertise: A Failure to Disagree"
    sourceAuthors:
      - Daniel Kahneman
      - Gary Klein
    sourceArtifact: .claude/skills/conditions-for-intuitive-expertise-a-fai/_book_identity.json
    importedFrom: legacy-recovery
    owners:
      - some-claude-skills
  authorship:
    authors:
      - Daniel Kahneman
      - Gary Klein
    maintainers:
      - some-claude-skills
---

# Conditions for Intuitive Expertise

Use this skill when the hard problem is not generating an answer, but deciding whether intuition, expert judgment, or agent confidence deserves trust in the first place.

## When to Use

- An agent is confidently fluent in a domain where outcome feedback is weak, delayed, or confounded.
- You need to decide whether a task should route to algorithmic scoring, expert judgment, or a hybrid review path.
- A system keeps overreaching from one domain into an adjacent but structurally different one.
- You are designing escalation logic for ambiguous, noisy, or high-stakes decisions.
- You need to audit whether repeated practice in a domain actually builds skill or just entrenches confident noise.

## NOT for Boundaries

This skill is not the primary lens for:
- Deterministic implementation work with explicit acceptance criteria and fast feedback.
- Pure syntax debugging, schema repair, or tasks where correctness is directly testable.
- Situations where the right move is already specified by hard policy or exact computation.
- Generic "trust the expert" arguments that do not examine environment validity or feedback quality.

## Core Mental Models

### Environment Validity Comes First

Expert intuition is only trustworthy when the environment has stable, learnable regularities. If the domain is mostly noise, confidence will still form; it just will not track truth.

### Learning Opportunity Is the Second Gate

Even a valid environment will not produce expertise without timely, accurate feedback. Delayed, corrupted, or selectively remembered feedback produces practiced error rather than practiced skill.

### Confidence Measures Coherence, Not Accuracy

Confidence tracks how internally consistent the available cues feel. In low-validity environments, high confidence is often a hazard signal rather than reassurance.

### Expertise Is Fractionated

Skill at one subtask does not reliably transfer to a neighboring subtask that merely feels similar. The boundary problem matters more than the prestige of the prior success.

### Match Decision Mechanism to Ecology

Use judgment-heavy approaches when tacit cues are real and feedback is clean. Use algorithms or structured ensembles when noise dominates and intuitions cannot be trained safely.

## Decision Points

```mermaid
flowchart TD
  A[New decision domain] --> B{Stable cues that predict outcomes?}
  B -->|No| C[Low-validity environment]
  B -->|Yes| D{Fast, accurate, repeated feedback?}
  D -->|No| E[Wicked or degraded learning environment]
  D -->|Yes| F[High-validity environment]
  C --> G[Prefer algorithmic or structured ensemble path]
  E --> H[Use hybrid path with suppressed confidence and external checks]
  F --> I{Task matches demonstrated expertise boundary?}
  I -->|No| J[Escalate or re-route for fractionated expertise]
  I -->|Yes| K[Allow expert judgment or recognition-primed handling]
```

### 1. Classify the Environment Before the Actor

- Ask whether the domain contains repeatable cue-to-outcome regularities.
- Ask whether the learner receives honest enough feedback to tune those cues.
- Only after that should you decide whether judgment deserves weight.

### 2. Separate Confidence Review from Accuracy Review

- Treat raw confidence as a report about felt coherence.
- If the environment is low-validity, confidence should not drive autonomy.
- If confidence and evidence disagree, trust the evidence and investigate the cue story.

### 3. Check for Fractionated Expertise

- Compare the current task structure to the situations that created the skill.
- If the resemblance is lexical but not structural, downgrade trust.
- Adjacent domains need fresh validation, not inherited authority.

## Failure Modes

### 1. Confidence-As-Evidence

The system treats fluent, high-confidence output as proof of correctness. This repeats the exact illusion-of-validity failure the paper warns about.

### 2. Invalid-Environment Optimism

A team assumes repetition in a noisy domain will produce expertise. It instead produces stronger stories, better rhetoric, and no real predictive gain.

### 3. Wicked-Feedback Training

Feedback arrives late, is politically distorted, or only surfaces successes. Agents then learn the wrong cues and become confidently brittle.

### 4. Fractionation Blindness

A skill that works for one subtask is invoked on a neighboring task with different causal structure. The output sounds plausible because the vocabulary overlaps, but the competence boundary has already been crossed.

### 5. Escalation Theater

Human review is added only after confidence gets high, rather than when environment validity or task-boundary fit is poor. Review then becomes a rubber stamp instead of a real safeguard.

## Worked Examples

### Example 1: Stock Commentary Agent vs. Valuation Model

A team wants an "expert market intuition" agent to decide whether a stock is underpriced. The framework says the environment is low-validity and feedback is heavily confounded, so the agent should not get autonomy based on fluent market narratives. Route instead to an actuarial or ensemble baseline, then use judgment only for anomaly explanation.

### Example 2: Imaging Triage with Domain-Limited Judgment

A radiology-adjacent agent is strong on spotting abnormalities in one imaging modality and is asked to generalize to another that shares surface vocabulary but different cue structure. The framework flags fractionated expertise, so the system should degrade autonomy and require modality-specific validation before trusting the carryover.

## Quality Gates

- The environment has been explicitly classified as high-validity, degraded-validity, or low-validity.
- Feedback-loop quality has been examined, not assumed.
- Confidence is treated as coherence metadata rather than direct evidence.
- The task has been checked against demonstrated competence boundaries.
- Escalation rules are stricter in low-validity domains than in high-validity ones.

## Reference Files

| File | Load when... |
| --- | --- |
| `references/validity-environment-and-agent-trust.md` | You need the full environment-validity diagnostic and its implications for trust. |
| `references/algorithms-vs-intuition-routing-framework.md` | You are choosing between algorithmic, judgment-heavy, or hybrid routing. |
| `references/overconfidence-and-the-illusion-of-validity.md` | High-confidence output needs scrutiny and calibration policy. |
| `references/fractured-expertise-and-domain-boundary-detection.md` | A skill appears adjacent to the task, but you are unsure the competence really transfers. |
| `references/recognition-primed-decision-making-for-agents.md` | The environment is moderately valid and time pressure favors recognition plus simulation over exhaustive analysis. |
| `references/the-boundary-problem-knowing-when-not-to-trust-yourself.md` | You are designing escalation logic or competence self-monitoring. |

## Anti-Patterns

- Using confidence scores as a primary autonomy gate in noisy domains.
- Assuming years of exposure imply expertise without checking feedback quality.
- Porting a proven skill into adjacent tasks because the terms look familiar.
- Treating algorithmic methods as universally inferior or universally superior.
- Auditing outputs without auditing the ecology that produced them.

## Shibboleths

You have internalized this skill if you naturally ask:
- "What kind of environment is this before we talk about trust?"
- "What feedback actually taught this agent or expert?"
- "Is this the same task structure, or just an adjacent one?"
- "Does confidence here mean evidence, or just coherence?"
