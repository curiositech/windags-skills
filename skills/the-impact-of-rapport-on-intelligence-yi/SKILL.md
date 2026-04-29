---
name: the-impact-of-rapport-on-intelligence-yi
description: Use for rapport, elicitation, transcript audit, interview design, and disclosure-yield analysis by auditing attention, coordination, and typed yield instead of vague warmth or self-report. NOT for coercive extraction, generic tone polishing, or persuasion tasks that do not depend on genuine disclosure.
license: Apache-2.0
allowed-tools: Read,Grep,Glob
metadata:
  category: Communication & Elicitation
  tags: [rapport, elicitation, conversational-audit, trust, evaluation]
  provenance:
    kind: first-party
    owners: [some-claude-skills]
    source:
      title: The Impact of Rapport on Intelligence Yield
      authors: [Jordan Nunan, Ian Stanier, Rebecca Milne, Andrea Shawyer, Dave Walsh, Brandon May]
  authorship:
    authors: [some-claude-skills]
    maintainers: [some-claude-skills]
---
# The Impact of Rapport on Intelligence Yield

Source basis: field research on real intelligence-source phone calls showing which rapport behaviors actually increase usable disclosure.

## When to Use

- A conversational agent is friendly but still gets shallow, vague, or evasive answers.
- You need to audit information yield by transcript rather than trust an agent's self-assessment.
- Output quality is being treated as one score even though different detail types are failing differently.
- You are designing intake, interview, support, or research flows where cooperative disclosure matters.
- You need to decide whether to invest in tone, attention behaviors, or interaction structure.

## NOT for

- Coercive extraction, manipulation, or adversarial interrogation tactics.
- Generic conversation design where the goal is entertainment, persuasion, or style rather than reliable disclosure.
- Superficial tone rewrites that do not change behavioral attention or coordination.

## Decision Points

1. Decide whether the bottleneck is attention, coordination, or positivity. Audit attention first, then coordination, and only then warmth.
2. Decompose yield into typed detail categories before judging quality globally.
3. Treat self-report as a hypothesis. Use transcript evidence to confirm what behaviors actually occurred.
4. Check whether the relationship problem is local to one exchange or structural across sessions.

## Decision Flow

```mermaid
flowchart TD
  A[Weak disclosure or thin answers] --> B{Attention behaviors present?}
  B -->|No| C[Add paraphrase, follow-up, and memory signals]
  B -->|Yes| D{Coordination clear?}
  D -->|No| E[Clarify purpose, pacing, and answer format]
  D -->|Yes| F{Yield broken down by type?}
  F -->|No| G[Audit person, action, object, temporal detail]
  F -->|Yes| H{Only positivity changed?}
  H -->|Yes| I[Do not mistake warmth for attentional skill]
  H -->|No| J[Propose targeted repair]
  C --> J
  E --> J
  G --> J
  I --> J
```

## Working Model

- Rapport is a count of behaviors, not a vague feeling. Back-channels, paraphrases, probes, and procedural framing are auditable.
- Attention dominates yield. Demonstrating that the other person's information was heard, remembered, and explored matters more than sounding nice.
- Coordination builds the scaffold for transfer. Shared purpose, pacing, and process framing make later disclosure easier.
- Self-report is unreliable for behavioral frequency. An agent or operator can sincerely believe it was attentive while the transcript shows otherwise.
- Yield is decomposable. Surrounding, object, person, action, and temporal detail can fail independently and should be inspected that way.

## Failure Modes

- Optimizing warmth before attention, producing pleasant but uninformative exchanges.
- Scoring quality as one number and missing which detail type is actually thin.
- Trusting the agent's own narrative about how it behaved instead of auditing transcripts.
- Ignoring coordination in openings and transitions, then blaming weak disclosure on tone.
- Treating rapport as coercion or compliance rather than cooperative transfer.

## Anti-Patterns and Shibboleths

- Anti-pattern: rewriting copy to sound warmer while leaving turn-taking, paraphrase, and follow-up behavior unchanged.
- Anti-pattern: grading the whole conversation with one satisfaction score instead of checking which detail types are missing.
- Shibboleth: if the audit cites vibes instead of transcript evidence, it is not a rapport diagnosis yet.

## Worked Examples

- An intake agent uses reassuring language but rarely paraphrases or asks follow-up questions. The fix is to add attention behaviors and yield-type auditing, not more empathy copy.
- A multi-session support workflow gets good person detail but weak action and temporal detail. The likely repair is stronger coordination about purpose, chronology, and what kind of answer is needed.

## Fork Guidance

- Stay in-process when you are auditing one transcript and only need to count behaviors plus yield types.
- Fork one subagent for behavior-count auditing and another for yield-type auditing when you want independent evidence before proposing a fix.

## Quality Gates

- The audit cites observable behaviors from transcripts or logs, not impressions.
- Yield is decomposed by detail type before any summary score is used.
- Optimization advice names whether it targets attention, coordination, or positivity.
- Self-report is never treated as ground truth.
- Recommendations stay within ethical, cooperative information elicitation boundaries.

## Reference Routing

- `references/rapport-as-behavioral-frequency-not-feeling.md`: load when you need the operational definition of rapport and its measurable behaviors.
- `references/attention-dominates-yield-active-processing-over-warmth.md`: load when warmth is being overvalued relative to actual yield.
- `references/coordination-shared-goal-structure-enables-transfer.md`: load when opening structure, pacing, or shared purpose looks weak.
- `references/intelligence-yield-taxonomy-decomposing-output-quality.md`: load when output quality needs to be broken into detail types.
- `references/self-report-gap-behavioral-auditing-vs-perceived-practice.md`: load when an operator or agent's self-story conflicts with observed behavior.
- `references/working-alliance-motivation-modeling-source-management.md`: load when long-run source motivation or multi-session relationship management is the real issue.
