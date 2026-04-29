# Satisficing Over Optimizing: Why "Good Enough" Is the Right Standard for Complex Agents

## The Optimality Trap

One of the most consequential design decisions in any agent system is the choice of success criterion. Should the agent find the *best* solution, or the *first workable* solution?

Classical decision theory answers unambiguously: find the best solution. Enumerate options, score each against utility criteria, select the maximum. This is optimization, and it has deep theoretical appeal — it is formally justified by expected utility theory and produces provably correct results when its assumptions are met.

Klein and Calderwood's field research reveals a different answer: in operational environments, satisficing — finding the first workable solution and acting on it — is not a compromise forced by bounded rationality. It is the *appropriate* decision strategy, one that outperforms optimization precisely because it fits the structure of real problems.

## What Satisficing Actually Means in the RPD Framework

Herbert Simon introduced satisficing as a description of how humans cope with cognitive limitations: unable to find the optimal solution, they settle for a "good enough" one. This framing accepts optimization as the ideal and treats satisficing as a second-best adaptation.

Klein and Calderwood's research reframes this entirely. In the RPD model, satisficing is not a concession — it is a *deliberate and appropriate strategy* that takes advantage of domain expertise in a way that optimization cannot.

Here is the key insight: **an expert's first generated option is not a random sample from the option space.** It is experience-weighted. It is the option that has worked most often in situations like this one. The expert doesn't need to compare it to other options to know it is likely to work — the comparison has already been done, implicitly, across years of experience and thousands of prior cases. The first option generated is, in a very real sense, the product of a massive prior optimization — it just happened at the population level, over time, rather than at the individual decision level, in the moment.

Given this, comparing the first option to alternatives is not refining a random choice — it is doubting an informed one. And under time pressure, it is doubting it at potentially catastrophic cost.

## The Serial Evaluation Strategy

The RPD model does not simply recommend acting on the first option that comes to mind. It specifies a serial evaluation strategy:

1. Generate the most plausible option (experience-weighted)
2. Mentally simulate the option in the current context
3. If simulation reveals the option is workable → execute
4. If simulation reveals fixable problems → modify and execute
5. If simulation reveals fundamental problems → reject and generate the next most plausible option
6. Repeat from step 2

This is satisficing with a quality gate. The first option is not blindly accepted — it is tested against the specific constraints and features of the current situation through mental simulation. What is *not* done is comparing this option to alternatives. The quality gate is not "is this better than that?" — it is "will this work here, now, given what I know about the situation?"

"Notice that several different options were considered but none was contrasted to another. Instead, each was examined for feasibility, and the first acceptable one was implemented."

## Why the Serial Strategy Outperforms Optimization Under Real Conditions

**Time efficiency**: Mental simulation of a single option against current constraints is fast. Full option comparison requires holding multiple options in working memory simultaneously while running evaluation against shared criteria — a much more demanding process. Klein and Calderwood note that approximately 85% of the decisions they studied were made in under one minute, and that "analytic decision strategies cannot be effectively accomplished in this time frame."

**Context sensitivity**: Simulation evaluates an option against the specific, current situation — all its particular features, constraints, and dynamics. Abstract utility scoring evaluates against general criteria that may not capture what actually matters in this particular case. The option that scores highest on generic dimensions may fail in the specific context where dimensions interact in unexpected ways.

**Cognitive load management**: Under stress and time pressure, cognitive resources are reduced. The serial satisficing strategy makes minimal demands on working memory (evaluate one option at a time) while producing reliable results because experience-weighting makes the first option a good bet. Optimization under stress is doubly penalized — it requires more cognitive resources at exactly the time when fewer are available.

**Avoidance of analysis paralysis**: In the fireground commander's world, "workable" and "timely" are the relevant criteria. A brilliant action taken too late is no action at all. The optimization process itself carries real costs — the time spent optimizing is time the fire is burning, time the patient is deteriorating, time the adversary is maneuvering. Satisficing keeps the agent acting at the pace the situation demands.

## When Optimization IS Appropriate

Klein and Calderwood are precise about this. Hammond et al.'s research demonstrates that different problem structures favor different strategies. Optimization is appropriate when:

- **Time is available**: The decision cycle is long enough to support exhaustive analysis
- **Goals are isolable**: The objective function can be cleanly specified without loss of important contextual information
- **Probabilities are estimable**: The decision involves repeated events or well-calibrated distributions
- **The domain is novel**: The decision-maker lacks relevant experience for recognitional processing, so all options must be explicitly evaluated
- **Stakes are high and asymmetric**: The cost of a suboptimal choice far exceeds the cost of the time and resources spent optimizing

But notice the conditions: they correspond to the *exact opposite* of typical operational environments. High stakes operational domains are characterized by time pressure, entangled goals, unique events, and significant experience — precisely the conditions where satisficing outperforms optimization.

## Implications for Agent System Design

### Design Principle 1: Build Both Modalities

Agent systems should support both recognitional (satisficing) and analytical (optimizing) decision modes, with explicit switching logic based on situational features. The switching trigger should be sensitive to:
- Available time
- Degree of situation novelty
- Goal clarity
- Agent's relevant experience (case library coverage)
- Reversibility of the action being considered

Defaulting always to optimization is a common and costly mistake.

### Design Principle 2: Experience-Weight the First Option

The satisficing advantage depends on the first option being experience-weighted — informed by a rich library of similar past situations. An agent that satisfices based on random option generation is not using the RPD strategy; it is just being fast and wrong. The investment required to make satisficing work is the investment in building, maintaining, and retrieving from a rich case library.

### Design Principle 3: Make the Quality Gate Situational

The mental simulation step — testing the first option against current constraints — should be specifically tailored to the current situation, not applied through generic criteria. The simulation asks: "Does this work *here*, with *these* resources, *given* what I know about the current state?" Generic feasibility checks are not mental simulation; they are just another form of abstract utility evaluation.

### Design Principle 4: Track Satisficing Failure Rates

When the first generated option fails mental simulation, the second is tried, then the third. In a well-calibrated agent, this should be rare — the first option should usually be workable. High first-option rejection rates are a diagnostic signal that the situation classification (which drives option generation) may be unreliable, or that the agent's experience base is insufficient for the situations it is encountering.

### Design Principle 5: Don't Mistake "Workable" for "Mediocre"

The concern that satisficing produces poor-quality outputs misunderstands the mechanism. In a domain-expert agent, the first workable option is not a random draw from a quality distribution — it is the modal response from a population of experienced practitioners in similar situations. Its quality is high, not because it was optimized in the moment, but because it represents the accumulated wisdom of many prior cases. The goal is not to lower quality standards; it is to use experience to make high-quality options the default first candidate.

## The Broader Lesson: Fit Strategy to Problem Structure

The deepest lesson from Klein and Calderwood's work on satisficing is methodological: *problem structure should determine decision strategy, not the other way around.* The dominance of optimization in formal decision theory created a cultural default toward analytical approaches that ignore this fit requirement.

For agent systems, the design question is never simply "how can we optimize the agent's decisions?" It is always "what decision structure is appropriate for the problem structure this agent will face?" Sometimes the answer is optimization. Often, for the most operationally important decisions — the ones that happen fastest, under the most pressure, with the most ambiguity — the answer is a well-designed recognitional satisficing process supported by rich domain experience and effective mental simulation.