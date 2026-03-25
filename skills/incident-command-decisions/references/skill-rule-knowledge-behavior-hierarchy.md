# The Skill-Rule-Knowledge Hierarchy: Three Modes of Cognition for Intelligent Agents

## Overview

Jens Rasmussen's behavior model, introduced in his 1983 paper and cited by Njå and Rake as foundational to understanding incident command, describes three qualitatively distinct levels at which human (and, by extension, artificial) intelligent systems can operate:

1. **Skill-Based (SB) Behavior**: Automated, pre-programmed responses governed by stored patterns of instruction in a time-space domain. No conscious deliberation is involved.
2. **Rule-Based (RB) Behavior**: Application of stored if-then rules to familiar problem classes. The pattern is recognized, the rule is retrieved and applied.
3. **Knowledge-Based (KB) Behavior**: Online reasoning using stored knowledge to construct novel responses to genuinely unfamiliar situations.

> "The SB level means that human performance is governed by stored patterns of pre-programmed instructions... The RB level can tackle familiar problems in which solutions are governed by stored if (state) then (diagnosis) or if (state) then (remedial action) rules... The KB level comes into play in novel situations for which actions must be planned online using conscious analytical processes and stored knowledge." (Njå & Rake, p. 9)

This is not merely a taxonomy. It is a *dynamic* model: experience and training move behavior from KB toward RB toward SB. What was once a labored novel problem becomes a recognized pattern, which becomes an automatic response. The trajectory of expertise is a progressive migration toward lower (faster, more automatic) levels of the hierarchy.

## Why This Hierarchy Matters for Agent Systems

### The Cost of Operating at the Wrong Level

Each level of the hierarchy has different resource requirements:
- SB behavior is nearly free: fast, low-overhead, reliable within its domain
- RB behavior requires pattern-matching overhead but is still highly efficient
- KB behavior is expensive: it requires working memory, deliberation time, and generates significant uncertainty

An agent that invokes KB-level reasoning when SB would suffice is wasting resources. An agent that applies SB-level responses to KB-level problems will produce confident, fast, and *wrong* answers. The allocation decision — which level to engage — is itself a metacognitive judgment, and it is one of the most important design decisions in an agent architecture.

### SB for WinDAGs: The Automated Skill Layer

In a WinDAGs context, SB behavior corresponds to **skill invocations that require no upstream reasoning**. These are the 180+ specialized skills that agents can invoke directly when a clear, recognized trigger pattern is matched. Examples:
- "Format this output as JSON" — no deliberation needed
- "Check this URL for 404 errors" — direct invocation
- "Extract named entities from this text" — pattern-triggered

The correct design principle for SB-level skills: they should be **fast, narrowly scoped, and invokable without planning overhead**. They should not require the agent to understand why they are being called — only that the trigger condition is met.

### RB for WinDAGs: The Routing and Classification Layer

RB behavior corresponds to **conditional routing** based on recognized problem classes. The architecture here is explicitly if-then: if the task matches pattern X, invoke skill set Y; if it matches Z, invoke skill set W.

This is the dominant mode for a well-functioning orchestration system. Most problems seen by a mature agent system will be variations of known problem types. The goal of system maturation is to expand the RB layer — to convert KB problems into RB problems by building up a library of recognized patterns and associated response strategies.

Design principles for the RB layer:
- Rules should be explicit and auditable, not implicit in neural weights
- Each rule should carry a confidence score and a validity domain (conditions under which the rule applies)
- Rules should be able to fail gracefully and hand off to the KB layer when they encounter edge cases
- The system should track which rules are applied most frequently and which produce the best outcomes, creating a feedback loop for rule refinement

### KB for WinDAGs: The Deliberate Reasoning Layer

KB behavior corresponds to situations that genuinely exceed the existing rule library — where the agent must reason from first principles, construct novel plans, and operate with high uncertainty.

The KB layer is expensive and should be triggered *only* when necessary. Signals that KB engagement is required:
- No rule in the RB library matches the current situation
- Multiple rules match but with conflicting recommendations
- A rule was applied but its expectancies were violated (suggesting the situation was misclassified)
- The stakes are high enough that the cost of a confident-but-wrong SB/RB response is unacceptable

The KB layer should operate differently from SB/RB. It should:
- Make its uncertainty explicit
- Generate multiple candidate approaches and evaluate them
- Seek additional information before committing to action
- Document its reasoning for later learning (potential conversion to an RB rule)

### The Migration Path: KB → RB → SB

The most important implication of Rasmussen's hierarchy for agent system design is the **learning trajectory**. As the system encounters more cases:

- KB solutions that proved effective should be codified as RB rules
- RB rules that proved highly reliable in specific contexts can be hardened into SB skills
- The system becomes progressively faster and more efficient as the KB load is reduced

This is not just efficiency optimization — it is a model of *expertise development*. The system is not just getting faster; it is developing the same cognitive structure that makes human experts effective.

> "Experience and training can influence a person's behaviour to become more automatic (moving from KB towards SB). Experience and training can also improve the cognitive process and increase the quality of decisions (improving performance within the SB, RB and KB levels of behaviour)." (Njå & Rake, p. 9)

## The Failure Mode: Level Misclassification

The most dangerous failure mode in the SBK hierarchy is **applying a lower-level response to a higher-level problem**. This produces high confidence, high speed, and high error rates.

This failure is particularly insidious because:
- The agent does not know it is operating at the wrong level
- The response is generated quickly and confidently, reducing the chance of external review
- The error may not be visible until downstream consequences emerge

Signals that level misclassification may be occurring:
- The agent has high confidence but the problem statement contains novel features it hasn't acknowledged
- The expected outcomes of the SB/RB response don't match the actual outcomes
- Multiple independent classification attempts produce different level assignments

The recommended mitigation is a **level-confidence score** alongside every response: not just "here is my answer" but "I am operating at RB level with 0.85 confidence that this situation falls within my rule library's coverage."

## The Interplay Between Levels in Crisis Conditions

Njå and Rake note that under extreme time pressure, commanders *must* rely more heavily on SB and RB responses — there is simply no time for KB deliberation. This has a critical implication: **the quality of crisis performance is largely determined before the crisis begins**, by how well SB and RB libraries were built during non-crisis periods.

For agent systems facing real-time or high-throughput requirements, the same principle applies: you cannot build expertise during peak demand. The architecture must be designed so that the KB layer is actively engaged during low-stakes periods to convert novel solutions into rules, and rules into skills — *before* those patterns are needed at full speed.