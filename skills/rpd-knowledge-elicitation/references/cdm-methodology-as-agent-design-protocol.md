# The Critical Decision Method as a Protocol for Designing Agent Capabilities

## Overview

The Critical Decision Method (CDM) is not merely a research technique. It is a *design protocol* — a structured approach for identifying what an intelligent system needs to know, what information it needs to process, what decisions it needs to make, and where its greatest vulnerabilities lie. Every step of the CDM, from incident selection to probe design to knowledge product generation, has a direct translation into the design of intelligent agent capabilities.

This document describes the CDM in operational detail and translates each component into agent system design principles.

## The CDM's Theoretical Grounding

The CDM was developed as a direct expression of the Recognition-Primed Decision model. It is designed to surface the knowledge that RPD actually uses — not the rules and procedures that standard task analysis produces, but the cues, causal factors, typicality judgments, and goal shifts that drive expert performance.

Its rationale can be stated in three principles:

1. **Expertise is visible at the boundary of routine**: Standard task analysis probes routine cases and produces rule descriptions. The CDM probes non-routine cases and produces situational knowledge.

2. **Expert knowledge is cue-indexed and contextual**: Expert performance depends on recognizing specific cues in specific contexts. Knowledge elicitation must preserve this contextual richness, not abstract it away.

3. **Tacit knowledge is accessible through retrospective incident probing**: Experts cannot give think-aloud reports of their most automatic performance, but they can describe past incidents where their expertise was called upon — and careful probing of these incidents surfaces the underlying tacit knowledge.

## The CDM Process in Detail

### Stage 1: Incident Selection

The most important design choice in the CDM is what incidents to study. The criteria are:

- **Recency**: Usually within the last 3 months, though memory for critical incidents appears good even after a year or more — "These are vivid incidents, sometimes with lives at stake. They have been thought about and discussed in the intervening time" (p. 21).
- **Non-routine challenge**: "We look for incidents where experience was important, where someone with less experience would have possibly been unable to be effective" (p. 21).
- **Presence of risk**: High-stakes situations call on deeper expertise.
- **Errors and mistakes**: "We also look for errors, since these are good sources of data about the uses of knowledge" (p. 22).

**Translation to agent design**: When designing a new agent capability, identify the non-routine cases that the agent needs to handle. What are the situations where a naive implementation would fail? What are the known edge cases, failure modes, and expert-level challenges? These are the cases that should drive the capability design, not the routine cases that any basic implementation handles adequately.

### Stage 2: Narrative Reconstruction

After incident selection, the expert provides a free narrative of the incident — an uninterrupted account from initial awareness through resolution. The interviewer listens, takes notes, and does not probe yet.

The narrative serves several functions:
- Establishes rapport
- Provides an overall timeline and structure
- Identifies the key decision points for subsequent probing
- Activates the expert's memory and emotional engagement with the incident

**Translation to agent design**: Before designing any agent capability in detail, construct rich narrative descriptions of the scenarios the agent will face. Not abstract specifications, but concrete stories: what happens, in what order, with what information arriving when, and what decisions arise. These narratives are the primary design inputs.

### Stage 3: Timeline Construction

A key CDM output is the timeline — a representation of the chronological sequence of events, cues, and actions during the incident. The timeline serves multiple purposes:

- Clarifies the sequencing and duration of events
- Identifies what information was available at each point
- Reveals the relationship between new information and decision points
- Reactivates contextual memory

Klein and MacGregor note that constructing the timeline "reactivated memory for much of the contextual knowledge of the incident from more than a single time perspective" (p. 21). The timeline is not just a documentation tool — it is an elicitation tool that surfaces knowledge that wouldn't emerge from direct questioning.

**Translation to agent design**: Agent systems operating in dynamic domains should maintain explicit timelines — representations of how the situation has evolved, what information arrived when, and what actions have been taken. This timeline serves as both working memory and audit trail. The timeline makes visible the temporal structure of decisions, which is often invisible in static state representations.

### Stage 4: Probing for Situation Assessment

This is the core of the CDM. The interviewer probes the expert's situational understanding at each key moment:
- What did you know at this point?
- What were you expecting to happen?
- What were you trying to achieve?
- What were the critical cues that shaped your understanding?
- Was there a moment when your understanding of the situation changed?

These probes target the SA structure that the RPD model places at the center of expert performance. The key distinction is between SA-Elaborations (the picture becomes more detailed) and SA-Shifts (the picture is replaced by a fundamentally different assessment).

SA-Shifts are the most critical moments. They represent the expert realizing "I was wrong about what this situation was" — and the cognitive work required to execute that realization competently is some of the most demanding in the domain.

**Translation to agent design**: Build explicit SA representation into agent architectures. At each major decision point, the agent should be able to articulate (at least internally): "My current SA is X. The critical cues supporting this are A, B, C. My active goals are P, Q. My expectancies are E1, E2. Observations that would trigger an SA-Shift include F, G." This explicit SA representation is both a quality mechanism (forcing clarity about what is actually known) and a debugging mechanism (making visible why the agent made the decisions it did).

### Stage 5: Probing for Decision Points

Decision points are moments when alternative courses of action were possible. For each decision point, the CDM probes:
- What options were available?
- What was the basis for the choice?
- How did this option get selected vs. alternatives?
- Was the decision process recognitional or analytical?
- How much time did it take?
- What would a less experienced person have done?

The probe types (Table 1, p. 23) target different forms of knowledge:
- **DP Options**: What alternatives existed (structural knowledge)
- **Cues**: What perceptual data drove the assessment
- **Causal Factors**: What underlying dynamics were understood
- **Goal Shifts**: When did priorities change radically
- **Analogues**: What past cases were similar
- **Errors**: Where did judgment go wrong
- **Hypotheticals**: What would have happened if...
- **Desired Data**: What information was missing

**Translation to agent design**: For each decision point in a designed scenario, build explicit probes into the agent's evaluation mechanism:
- What are the decision alternatives that exist here?
- What would a naive agent do?
- What information would change the decision?
- What is the worst case if this decision is wrong?
- What analogous situations in the agent's case library are most relevant?

These probes can be implemented as explicit deliberation steps when the agent is in a high-stakes or ambiguous situation.

## The CDM Probe Types as Agent Design Patterns

Each CDM probe type has a direct translation into agent capability design:

### Cue Probes → Critical Cue Inventories
"What did you notice? What was the smoke color/texture/speed that told you this was unusual?" — these probes produce CCI entries. For agent design, CCIs define the features the agent should prioritize when processing input. They are the *feature importance weights* grounded in expert situational knowledge.

### Causal Factor Probes → Causal Model Components
"What made you expect the fire to spread that way? Why did the building construction matter?" — these probes surface causal models. For agent design, causal models enable forward projection: given the current situation, what will happen if no action is taken? What will happen if action X is taken? These models enable prospective SA, not just reactive response.

### Analogue Probes → Case-Based Retrieval
"Was there a past situation this reminded you of? How was it similar? How was it different?" — these probes surface the expert's case library. For agent design, analogue probing translates directly into case-based reasoning: retrieve the most similar known case, identify how the current situation differs, and adapt the case's solution accordingly.

### Error Probes → Failure Mode Libraries
"Where did you go wrong? What mistakes do novices typically make here?" — these probes produce failure mode descriptions. For agent design, failure mode libraries inform monitoring mechanisms: if the agent is about to do what a novice typically does wrong, flag it for review.

### Hypothetical Probes → Counterfactual Simulation
"What would have happened if you had waited another minute? What would have happened if you had taken the rescue approach you initially considered?" — these probes surface the expert's simulation capability. For agent design, explicit counterfactual simulation before major actions provides the quality check that the RPD model calls "mental simulation" in the A-2 and A-3 variants.

### Desired Data Probes → Information Gap Analysis
"What information would have made this decision easier? What were you missing?" — these probes identify where the information architecture failed the expert. For agent design, desired data analysis identifies what data the agent needs that it currently can't access, and guides prioritization of information collection capabilities.

## The CDM's Knowledge Products as Agent System Components

### Critical Cue Inventories → Feature Libraries
CCIs become the explicit feature sets that agent systems monitor in each domain. They are the answer to "what should the agent be looking for?" They should be maintained, updated, and made accessible by domain.

### Situation Assessment Records → Dynamic World Models
SARs become the structure of the agent's dynamic world model — not a static state, but a time-indexed representation of how the situation has evolved, with explicit SA classifications and transition reasons at each major shift.

### Decision Point Analyses → Action Policy Libraries
Decision point analyses become the structured knowledge base from which agents derive action policies. Each entry contains: situation type, available options, selection rationale, process type (recognitional vs. analytical), timing constraints, stress indicators, and outcome.

### Case Studies → Training Data
The narrative case studies that the CDM produces are the highest-density training material available. They contain everything: the SA structure, the cue recognition, the option selection, the rationale, the errors, the outcomes. For agent training, these cases should be curated, annotated, and used as the primary few-shot examples for complex decision scenarios.

## Boundary Conditions

The CDM was developed and validated in time-pressured, naturalistic, dynamic domains: fireground command, military command, emergency medicine, logistics. Its power derives from the fact that these domains have high-quality expertise embodied in human practitioners, and that this expertise is experiential and tacit.

The CDM may be less valuable in:
- Domains where expertise is primarily analytical and fully articulable (formal mathematics, algorithm design)
- Domains so new that no genuine expertise exists yet
- Domains where performance cannot be reliably evaluated, making it hard to identify true experts
- Domains where critical incidents are so rare that adequate case libraries cannot be assembled through retrospective elicitation

In these domains, alternative knowledge elicitation approaches (protocol analysis, lens modeling, multi-dimensional scaling) may be more appropriate.

## Summary

The CDM is a complete design protocol for building intelligent systems from naturalistic expertise. Its structure — incident selection → narrative → timeline → SA probing → decision point analysis → knowledge product generation — maps directly onto the pipeline for building agent knowledge bases that reflect how experts actually think. Each probe type produces a specific knowledge product that has a direct architectural translation in agent system design. The CDM's most important design principle is foundational: start from what experts actually do in non-routine situations, not from the normative model that is most convenient to implement.