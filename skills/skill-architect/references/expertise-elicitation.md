# Expertise Elicitation for Skills: L1, L2, L3 and CTA

Use this reference when a skill needs to encode real expert performance rather than polished prose.

## The Three Layers

- **L1: Work domain structure**
  - objects, constraints, states, resources, environment, hazards
  - what changes over time
  - what inputs are mandatory
- **L2: Conceptual knowledge**
  - distinctions, categories, definitions, mechanisms
  - the conceptual map of the domain
  - what kinds of situations look similar but must be treated differently
- **L3: Reasoning strategies**
  - cues experts notice
  - decision thresholds and tradeoffs
  - sequencing, mental simulation, recovery moves, escalation logic

If a skill only restates procedures, it is usually missing L3.

## Core Principle: Scaffolding Beats Extraction

Experts are often bad at answering generic prompts like "tell me how you do this." That does not mean their knowledge is inaccessible. It means the elicitation method is weak.

Prefer:

- concrete cases
- near misses and failure cases
- "what would a novice miss?"
- "what changed your mind?"
- "what cue told you this was not the default case?"
- "what would have fooled you five years ago?"

## Method Selection

| Need | Best method |
|---|---|
| capture reasoning under time pressure | Critical Decision Method (CDM) |
| capture work-domain constraints and functional relationships | Work Domain Analysis |
| capture conceptual structure and vocabulary | concept mapping |
| capture discrimination criteria | contrasting cases |
| capture expert prioritization under ambiguity | ShadowBox-style scenario comparison |
| capture tacit cue use in live work | think-aloud, retrospective replay, artifact walkthrough |

## ACTA-Oriented Interview Moves

Use these moves when upgrading a skill from L2 to L3:

1. Pick a real task instance.
2. Ask the expert to walk through what happened, not what "should" happen.
3. Pause on surprise points, decision points, and recoveries.
4. Ask what cues were visible at that moment.
5. Ask what a competent novice would likely miss.
6. Force the result into a cognitive demands table:
   - demand
   - cue or signal
   - common novice failure
   - expert strategy
   - recovery move

## ShadowBox Moves

When a skill needs judgment rather than procedure:

- give two or three plausible actions
- force a ranking
- ask for the rationale behind first and last choice
- compare multiple experts when possible
- preserve disagreement instead of flattening it away

The point is not consensus. The point is to expose priorities, thresholds, and cue weighting.

## What Good Skill Content Looks Like

Translate elicited expertise into:

- decision points
- failure modes
- worked examples
- contrastive examples
- escalation triggers
- checklists or quality gates
- domain-specific shibboleths

## What Documents Usually Miss

Source documents rarely contain:

- perceptual cues
- productive workarounds
- tradeoff thresholds
- novice traps
- disconfirming evidence
- minority expert rationale
- the actual point where an expert stops trusting the default path

That is why structural-upgrade work cannot be reduced to summarization.

## Quality Bars

Do not call an elicitation complete unless the resulting skill can answer:

- what cues trigger each branch
- what failures are common and how they are detected
- what a novice is likely to do wrong
- what separates an edge case from the default case
- what tradeoff or threshold changes the recommendation
- how the skill should behave on a realistic novel scenario

If you cannot answer those, you probably collected L1/L2 but not L3.
