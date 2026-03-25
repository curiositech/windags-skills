# Domain Expertise and the Selection of Causal Frames: What Experts Know That Novices Don't

## The Expertise Gap in Causal Reasoning

Klein and Hoffman make a finding that passes almost without comment in their paper, but that has substantial implications: "Domain knowledge seems critical for reliably identifying the causes mentioned in a media account. However, once the causes are specific, domain knowledge doesn't seem necessary for coding the causes into the explanatory categories."

This is a profound distinction. It separates causal reasoning into two phases with very different knowledge requirements:

1. **Cause identification**: Finding candidate causes in the first place. This requires deep domain knowledge — you must know the domain well enough to recognize what counts as causally relevant.

2. **Cause categorization**: Once causes are identified, classifying them into explanation types (event, condition, abstraction, list, story). This does not require domain expertise — it is a generic analytical skill.

For agent systems, this has direct architectural implications. Domain expertise and analytical structure are separate competencies that can be provided by different system components.

---

## What Domain Expertise Provides: The Propensity Repository

Domain expertise functions primarily as a *propensity repository* — a stored collection of mechanistic knowledge about what kinds of causes can plausibly produce what kinds of effects in this domain.

The mosquito-malaria example illustrates this perfectly. The covariation between mosquitoes and malaria was observable by anyone. But the propensity connection — understanding *how* mosquitoes could transmit disease — required specific domain knowledge (virology, epidemiology, understanding of transmission mechanisms) that was not available until viruses were identified.

An expert in a domain can:
- Quickly assess whether a proposed mechanism is plausible (propensity check)
- Know the expected temporal signature of causal mechanisms (how long between cause and effect)
- Recognize when apparent covariation is likely to be spurious (confounds, common causes)
- Identify enabling conditions that are so standard in the domain that they are invisible to non-experts
- Know the base rates for different classes of outcomes in this domain

A non-expert can observe the same events, identify the same covariations, and apply the same logical framework — but will make systematic errors in propensity assessment and will miss enabling conditions that are domain-specific background knowledge.

**The AIDS example**: The physicians who were detecting the early AIDS cases were not performing sophisticated logical analysis — they were noticing patterns that their domain knowledge told them were unusual. "Each case showed different symptoms (because AIDS is an opportunistic infection)" — recognizing that different symptoms could reflect the *same* underlying immune system failure required deep medical expertise. A layperson seeing different symptoms in different patients would not recognize them as a pattern.

---

## Expertise as Frame Generation

Beyond propensity assessment, domain expertise shapes the *frames* available to an expert reasoner. Different domains have characteristic explanatory structures — the kinds of stories that "work" in that domain.

Klein and Hoffman's data shows this clearly:
- **Sports** accounts favor event-type (counterfactual/mutable) explanations — because sports experts know that individual plays really do matter, and the domain is structured around competitive reversible events
- **Economics** accounts favor complex story-type explanations — because economics experts know that economic outcomes are produced by multiple interacting structural forces operating across time
- **Politics** accounts favor list-type explanations — because political outcomes genuinely are produced by multiple independent contributing factors

This domain-appropriate frame selection is itself a form of expertise. A novice applying the wrong explanatory frame to a domain will generate systematically distorted causal accounts. Someone applying a sports-type (single pivotal event) frame to an economic crisis will conclude that "Alan Greenspan's 2002 rate decision" caused the financial crisis — a conclusion that satisfies the narrative demand for a pivotal moment but misses the multi-year, multi-actor, interactive causal structure that the crisis actually reflects.

---

## Expert Recognition of Enabling Conditions vs. Causes

One of the most important things domain expertise provides is the ability to distinguish *enabling conditions* from *causes* — and to recognize when a proposed "cause" is actually just background that was always present in this domain.

Klein and Hoffman's example: oxygen in a burning room is an enabling condition, not a cause of the fire. Someone who knows nothing about combustion might include "oxygen presence" in their causal list. A chemistry-domain expert immediately classifies it as a background enabling condition because oxygen is ubiquitously present and does not vary in normal fire scenarios.

The enabling condition recognition problem is pervasive in complex domains:
- An organizational analyst looking at a company failure might include "competitive market environment" as a cause — but an industry expert knows that competitive pressure is the constant background condition of all companies in this sector, and is therefore an enabling condition rather than a cause of this specific failure
- A software engineer analyzing a system failure might include "high traffic volume" as a cause — but a domain expert knows that the system was supposed to handle this traffic volume, and the traffic is an enabling condition that revealed a design flaw, not the cause

**For agent systems**: Domain-expert behavior should be modeled by building systems that have access to domain-specific databases of "always-present enabling conditions" for each domain. When these enabling conditions appear as candidate causes, the system should reclassify them and note: "This is a standard enabling condition in this domain. The causally relevant question is what changed — what event or condition *in addition to* this background factor produced this outcome?"

---

## The Reductive Tendency and Expert Efficiency

Klein and Hoffman note that domain experts often simplify more aggressively than domain novices — but their simplifications are calibrated. Feltovich et al.'s "reductive tendency" is not equally dangerous in all hands. An expert's simplification is informed by deep knowledge of what can be safely ignored; a novice's simplification is based on ignorance of what they don't know they're ignoring.

A master chess player who quickly decides on a move has not failed to consider all possibilities — they have efficiently pruned the search space using pattern recognition that compresses the relevant causal structure of the position into a few key features. A novice who makes a quick move is just not considering enough options.

The same dynamic applies to causal reasoning. An experienced incident commander assessing a fire scene may quickly settle on a causal account that a more careful analyst would take an hour to reach — and the commander's rapid account may be more accurate than the careful analyst's, because the commander's pattern recognition correctly identifies the causally relevant features.

**For agent systems**: This means that the goal is not *always* to resist simplification and demand full causal analysis. The goal is to have the domain knowledge necessary to simplify *wisely* — to know what can be safely reduced and what cannot.

Systems should:
1. Be calibrated by domain — have domain-specific models of safe simplification
2. Distinguish between simplification based on domain expertise (probably safe) and simplification based on cognitive convenience (probably dangerous)
3. When uncertain about whether a simplification is safe, flag it explicitly rather than silently accepting it

---

## The Commentator vs. Participant Problem

Klein and Hoffman acknowledge a significant limitation of their Phase 1 research: "It was based on passive onlookers rather than participants in the to-be-explained events, such as decision makers in mortgage banking industry. The causal reasoning is heavily analytical and not grounded in the context of making choices."

This points to an important distinction between two types of causal reasoning expertise:

**Analytical expertise** (the commentator): The ability to construct accurate causal accounts of events after the fact, from a detached position, with full information and no action pressure.

**Practical expertise** (the participant): The ability to reason causally in real-time, under action pressure, with incomplete information, while being causally entangled in the situation being analyzed.

These are different skills, and they produce different kinds of causal reasoning. Commentators can construct rich, complete, accurate causal accounts. Participants must construct *actionable* accounts quickly, while managing uncertainty about whether their own actions will change the causal dynamics they are analyzing.

The physician treating a patient is in a different epistemic position than the epidemiologist studying disease patterns. The military commander ordering an advance is in a different position than the military historian studying the battle. The software engineer debugging a live production failure is in a different position than the post-mortem analyst reviewing logs the next day.

**For agent systems**: Systems that must reason causally in real-time should be designed with the participant constraint explicitly in mind:
- Prioritize actionable causal hypotheses over complete causal accounts
- Flag when action pressure is forcing premature closure
- Identify the highest-leverage reversible action that could generate causal information while also addressing the immediate problem
- Maintain the partial causal account and continue updating it as the situation evolves, even after action has begun

This is fundamentally different from the design of post-hoc analysis systems, which can take full advantage of the commentator's perspective.

---

## Implications for Agent Skill Design

The distinction between domain expertise and analytical structure has a direct architectural implication for agent systems: these two components should be separable.

**The analytical structure component** (domain-independent):
- Recognition of explanation types (event, condition, abstraction, list, story)
- Application of causal criteria (propensity, reversibility, covariation)
- Frame-switching protocols
- Hypothesis-management and closure decision rules
- Reduction-awareness flags

**The domain expertise component** (domain-specific):
- Propensity databases (what mechanisms are plausible in this domain)
- Enabling condition libraries (what background conditions are always present)
- Causal pattern libraries (what explanatory structures work in this domain)
- Temporal signature databases (how long between cause and effect for different mechanism types)
- Base rate knowledge (how common are different types of outcomes in this domain)

This separation enables a powerful design pattern: a single analytical reasoning system paired with swappable domain expertise modules. When deployed in a new domain, you don't replace the reasoning system — you load new domain expertise. When domain knowledge is updated, you update the domain expertise module without changing the reasoning architecture.

This mirrors how human expertise actually works: experienced analysts bring both a general reasoning toolkit and domain-specific knowledge, and it is the combination that produces expert causal reasoning.