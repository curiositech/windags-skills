# Situation Awareness and Context-Bound Reasoning: Why Context is Not Background Noise

## The Core Claim of Naturalistic Decision Making

The Naturalistic Decision Making (NDM) paradigm, as characterized by Njå and Rake, made a specific and radical claim about decision theory: that the classical models were wrong not because they were imprecise, but because they were *context-free*.

> "NDM researchers replaced four essential characteristics of the classical decision theory: comprehensive choice was replaced by matching, input-output orientation was replaced by process orientation, context-free formal modelling was replaced by context-bound informal modelling and normative decision models were replaced by empirical-based prescriptions." (Njå & Rake, p. 5)

The substitution of context-bound for context-free modeling is not just a methodological preference. It reflects a fundamental insight about the nature of expert performance: **expertise is always expertise in a context**. The knowledge that makes a fireground commander effective is not abstract reasoning skill — it is a library of patterns built in and calibrated to the specific conditions of fire response. Move that commander to a different domain and most of that expertise doesn't transfer.

## What "Context-Bound" Means

Context-boundedness means that decision quality cannot be evaluated independently of the situation in which the decision was made. As Njå and Rake state:

> "The decisions are contextual and should be assessed on specific evidence, circumstances and the commander's assessments in real time." (Njå & Rake, p. 13)

Context includes:
- **Information available at the time of decision** (not information available afterward)
- **Resources on hand** (not resources that could have been requested)
- **Time pressure** (the real time pressure, not the time pressure in retrospect)
- **Prior decisions** (which have already committed certain resources and foreclosed certain options)
- **Who is present** (which expertise is available, which authorities are present)
- **The specific physical environment** (not a generic environment)

This list matters because it identifies the most common failure mode in evaluating decisions: **judging context-bound decisions with context-free standards**. An incident commander who made a reasonable decision given available information at T=0 may look foolish when evaluated against information that became available at T=30. The post-hoc clarity is not available to the decision maker at the moment of decision.

## Situation Awareness: The Active Construction of Context

"Situation awareness" (SA) is the cognitive construct that captures how decision makers build and maintain their understanding of their current context. Njå and Rake cite it as a key factor in incident commander performance:

> "It is the incident commander's degree of expertise, intuition and situation awareness that are important for success or failure." (Njå & Rake, p. 5, citing Flin, 2001)

SA is not passive reception of information. It is active construction. The commander is not simply receiving data about the fire; they are building a mental model of the fire's current state, trajectory, and probable evolution — using current cues, past experience, physical intuition, and probabilistic reasoning about what is likely to happen next.

This active construction is why the RPD model works: the "recognition" in Recognition-Primed Decision is recognition of the *situation type*, which is itself a constructed mental model rather than raw data.

## The Flin Analysis: When Situation Awareness Fails

Njå and Rake cite Flin's analysis of the Piper Alpha disaster — one of the most consequential industrial disasters in history — as an example of what happens when situation awareness fails under pressure.

> "Her analysis of the three offshore installation managers involved in the crisis revealed significant weaknesses in their situation awareness and willingness to mitigate risk (for example, shutting down production). She concludes that 'leadership in routine situations may not predict leadership ability for crisis management'." (Njå & Rake, p. 5, citing Flin, 2001)

The managers had led their operations effectively for years. Under routine conditions, their SA was adequate. Under the novel, escalating, high-uncertainty conditions of the Piper Alpha fire, their SA collapsed. They failed to recognize the severity of the situation until it was too late to act effectively.

This is a specific failure mode: **SA that is adequate for the expected range of conditions but fails at the extremes**. It is not a failure of intelligence or training — it is a failure of calibration. The managers' models were built for routine operations; they had never experienced anything like Piper Alpha, and their models couldn't be extended to cover it.

## Information Dynamics in Crisis: Overload and Underload Simultaneously

Njå and Rake identify a peculiarly non-intuitive feature of crisis information environments:

> "Decision makers need to cope with a peculiar variety of information 'overload' and 'underload' in incoming data as well as external demands for information." (Njå & Rake, p. 4)

Crisis information is not just abundant or scarce — it is both simultaneously, in different channels. The radio is overwhelmed with communications (overload) while the commander's key question ("Are there people in the building?") goes unanswered (underload). The news media is saturating with coverage while the operational information needed to direct resources is absent.

This simultaneous overload/underload creates a specific cognitive challenge: the system must filter aggressively while also recognizing that the information it most needs may not be arriving at all. Standard information-processing architectures handle high volume or low volume — they are not designed for the simultaneous challenge of both.

## Implications for Agent System Design

### 1. Context Must Be First-Class Data

If decision quality is context-bound, then the agent system must treat context as first-class data, not background. This means:

- Every task should arrive with an explicit context packet: not just the task specification but the relevant environmental state, the resources available, the time constraints, the prior decisions that have been made, the information that is missing
- The agent's responses should be explicitly conditioned on this context: "Given X context, recommend Y" — not just "recommend Y"
- Evaluation of agent performance should be context-conditioned: was the recommendation good given the information available at the time? Not: was it good given what we know now?

### 2. Situation Model Maintenance

The RPD model requires a continuously updated situation model — a mental representation of the current state of the environment that gets updated as new cues arrive and as actions produce consequences. For agent systems, this translates to:

- A persistent, updateable situation representation that is maintained across the lifecycle of a task
- Explicit tracking of what is *known*, what is *uncertain*, and what is *unknown but relevant*
- Monitoring for cue violations: cues that are expected but haven't arrived, and cues that arrived but weren't expected
- Explicit handling of the overload/underload asymmetry: mechanisms to prioritize information retrieval for missing critical variables while filtering low-value high-volume noise

### 3. Context Dependency Bounds Knowledge Transfer

The context-boundedness of expertise means that knowledge transfer between domains is always risky and often misleading. A pattern that works in domain A may fail in domain B not because the underlying principle is wrong, but because the contextual conditions that make the principle applicable are not present.

For agent systems with skills spanning many domains:
- Every skill's applicability should be explicitly conditioned on context features
- Skill invocation should include a context-validity check: does the current context fall within the applicability conditions for this skill?
- Cross-domain skill transfer should be explicit, flagged as analogical reasoning with appropriate uncertainty markings, not treated as direct application

### 4. The Missing Information Problem

One of the most important SA failures in crisis management is failing to notice that crucial information is *absent*. The commander proceeds on the assumption that the information they have is sufficient, not realizing that a critical variable is unknown.

For agent systems, this requires an explicit **unknown-variable tracker**: a component that asks, for each task, "What information would be material to this decision that I don't currently have?" This is not the same as identifying what information is available. It requires reasoning about the decision structure to identify what is missing.

When the unknown-variable analysis reveals material gaps, the system has three options:
1. Seek the missing information before proceeding
2. Make the uncertainty explicit in the output
3. Escalate to human oversight

The default should never be "proceed as if the missing information doesn't matter."

### 5. SA Testing Under Novel Conditions

Flin's conclusion — that "leadership in routine situations may not predict leadership ability for crisis management" — should be taken seriously by anyone responsible for agent system reliability. A system that performs excellently on the test suite may fail in production when it encounters genuinely novel situations that fall outside the SA it was built for.

Testing should include deliberate novelty injection: conditions that violate the system's trained expectations, that present unfamiliar combinations of features, that require SA to be extended beyond its training domain. The system's response to these conditions — does it fail gracefully? Does it recognize its own uncertainty? Does it escalate appropriately? — is a more reliable predictor of production performance than performance on familiar test cases.