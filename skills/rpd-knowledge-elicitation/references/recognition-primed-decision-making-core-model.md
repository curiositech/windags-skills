# Recognition-Primed Decision Making: The Core Model and Its Implications for Agent Systems

## What This Document Teaches

This document describes the Recognition-Primed Decision (RPD) model developed by Gary Klein and colleagues through empirical study of expert decision-makers in naturalistic settings — fireground commanders, tank platoon leaders, paramedics, data analysts, and others. The RPD model explains how skilled practitioners actually make decisions under time pressure, uncertainty, and dynamic conditions. It is fundamentally different from how decision theory says decisions *should* be made, and it has profound implications for how intelligent agent systems should be designed.

## The Problem With Standard Decision Theory

Classical decision analysis prescribes the following procedure:
1. Enumerate all possible courses of action
2. Identify possible outcomes for each
3. Place values on each outcome
4. Assess probabilities of outcomes
5. Multiply values by probabilities to get expected utilities
6. Choose the action with the highest expected utility

This is the *concurrent evaluation* model (Figure 2 in Klein & MacGregor, p. 16): options are arrayed against evaluation dimensions and compared simultaneously. The model is mathematically coherent and prescriptively appealing.

The problem is that it doesn't describe what experts actually do, and it fails badly under time pressure. Studies cited by Klein and MacGregor show that analytical decision strategies are not effective "when there is less than one minute to respond" (Howell, 1984; Zakay & Wooler, 1984, cited on p. 19). Moreover, these studies used well-defined tasks with complete information — real-world conditions are far more demanding. In actual command situations, the concurrent evaluation model "cannot be outperformed" in theory but routinely fails in practice because it is too slow, requires complete option enumeration (which experts typically cannot generate), and demands probability assessments that are systematically biased.

## The RPD Model: Three Levels

Klein and MacGregor describe the RPD model as having three levels of increasing complexity (p. 17-19):

### Level A-1: Automatic RPD
The decision-maker uses cues and accumulated knowledge to recognize a situation as *familiar or typical*. This recognition is not a separate cognitive step — it is immediate and holistic, similar to Rosch and Mervis' (1973) concept of prototypicality judgment. The recognition carries with it:
- Recognition of what goals can be achieved
- Recognition of which cues to monitor
- Recognition of what to expect (expectancies)
- Recognition of the typical reaction

The typical reaction is immediately implemented. No comparison with alternatives occurs. The whole process is fast, automatic, and largely unconscious.

**Example**: A fireground commander recognizes that a laundry chute fire has spread to the top floor of an apartment building and immediately calls for a second alarm — without stopping to analyze alternatives.

### Level A-2: Verified RPD
The decision-maker recognizes typicality but has sufficient time to mentally simulate the chosen option before implementing it. No other options are considered. The single option is tested by imagining it being carried out, and if it passes this mental simulation, it is implemented.

**Example**: A rescue team commander knows what he wants to do but "plays the images out in his mind once or twice before issuing the order" (p. 18).

### Level A-3: Serial RPD
The favored option is evaluated more seriously through mental simulation. It may be:
- Implemented as is
- Modified to fit the current situation
- Rejected, after which the next most typical option is drawn from an "action queue"

This is a *serial* process — options are evaluated one at a time, not compared against each other.

**Example**: A commander trying to rescue an unconscious accident victim considers a harness rescue (rejected), then a strap (rejected), then a ladder belt (evaluated, accepted, implemented). "A series of options were considered, but there was never a comparison of the merits of one option vs. another" (p. 17-18).

## What Unifies All Three Levels

All three levels begin with **pattern recognition** — the expert's ability to recognize a situation as an instance of a known type. This recognition is not a separate preliminary step: it simultaneously surfaces goals, relevant cues, expectancies, and a candidate action.

As Klein and MacGregor write: "The recognition makes it obvious what can be accomplished, what dangers exist, what critical cues must be monitored, what expectations to form. The recognition also carries with it a realization of a typical set of reactions, and the most typical is considered first" (p. 19).

This is similar to von Clausewitz's concept of *coup d'oeil* — the "skill of making a quick assessment of a situation and its requirements" (cited on p. 20). It is also consistent with theories of expertise (de Groot, Dreyfus, Chase and Simon) that emphasize perceptual/recognitional abilities over analytical power.

## The Serial vs. Concurrent Distinction: Why It Matters

The crucial structural difference between RPD and classical decision analysis is this:

**Classical**: Multiple options held in working memory simultaneously, evaluated against shared criteria.

**RPD**: One option generated and evaluated at a time, drawn from a queue ordered by typicality, never compared against alternatives on explicit criteria.

This has enormous computational implications. The concurrent model is cognitively and computationally expensive — it requires holding multiple complex hypotheses active while applying a common evaluation framework. The serial model is much cheaper: at every moment, the decision-maker has one action ready to implement. Only if that action fails mental simulation does a second option get considered.

The serial model also has better graceful degradation under time pressure: you always have *something* to do. The concurrent model can fail catastrophically if time runs out before the comparison is complete.

## The Role of Situation Assessment

The RPD model reframes what decision-making is fundamentally about. It is not primarily about *choosing between options*. It is primarily about *assessing the situation accurately enough to recognize what type it is*. Once situation type is recognized, the appropriate action follows almost automatically.

This means that **decision quality depends almost entirely on situation assessment quality**, not on the sophistication of the evaluation procedure. An expert who misclassifies the situation will take the wrong action even if their option evaluation logic is perfect. An expert whose situation assessment is accurate will identify a workable course of action even under severe time pressure.

Klein and MacGregor define situation assessment as understanding:
- The goals currently active
- The critical cues to monitor
- The causal dynamics (what causes what, how fast, under what conditions)
- The expectancies (what should happen next if the current assessment is correct)

Shifts in situation assessment are defined as either *elaborations* (new information makes the current picture more specific) or *shifts* (new information contradicts the current picture and requires a new classification).

## Implications for Agent System Design

### 1. Build Recognition Before Reasoning
Agent systems should not begin with option generation. They should begin with **situation classification** — pattern matching of the current context against a library of known situation types. Only after classification should action candidates be generated.

This suggests a routing architecture where:
- A situation assessment agent classifies the problem type
- The classification activates a relevant knowledge context (goals, critical cues, expectancies, typical actions)
- Action selection proceeds from within that context rather than from a general-purpose optimizer

### 2. Serial Option Testing Beats Concurrent Comparison
For time-pressured or resource-constrained tasks, agents should implement serial option evaluation: generate one candidate action, test it through simulation or pre-execution checking, then either execute, modify, or reject and pull the next candidate.

This is more efficient than concurrent multi-option evaluation, produces a valid action at every timestep, and degrades gracefully under pressure.

### 3. The Action Queue Should Be Ordered By Typicality
The implicit architecture of RPD includes an *action queue* — a ranked list of candidate actions ordered by how typical (how frequently appropriate) they are for the recognized situation type. The most typical action is tried first. This is essentially a prior-probability-ordered search.

Agent systems should maintain and update such queues based on accumulated experience. Actions that succeed in recognized situation types rise in the queue; actions that fail drop.

### 4. Mental Simulation as a First-Pass Filter
Before committing to an action, agents should run a lightweight *forward simulation* — a check of whether the action is plausible given the current situation state, what its likely consequences are, and whether any obvious failure modes exist. This is the RPD "evaluation" step, and it is the key quality control mechanism in the model.

This is distinct from deep planning. It is a quick feasibility check, not an optimization.

### 5. Time-Budget Awareness Is Essential
The RPD model predicts that under sufficient time pressure, even the verification step (A-2) may be skipped and the automatic A-1 response implemented without any deliberation. Agent systems should be aware of their time budgets and gracefully reduce the depth of their evaluation as time pressure increases — from serial evaluation (A-3) to verified execution (A-2) to automatic execution (A-1).

## Boundary Conditions

The RPD model describes expertise in **time-pressured, dynamic, naturalistic settings** — firegrounds, military command, emergency medicine. It may not apply as well to:

- Decisions where time is abundant and optimization is feasible
- Novel problems where no prior experience exists (no typicality to recognize)
- Decisions with very high stakes where any action is costly, requiring thorough evaluation
- Team decisions where coordination costs make serial individual evaluation insufficient

The RPD model is descriptive, not prescriptive. Klein and MacGregor note explicitly: "It is an account of a process that allows people to proceed reasonably in many decision-making situations but does not insure optimal results" (p. 20). Expert RPD can still produce wrong answers when situation assessment is incorrect.

## Summary

The RPD model teaches that intelligent behavior under time pressure is fundamentally recognitional, not analytical. The action of experience is to make situation types familiar so that appropriate responses become automatic. The architecture is: classify situation → activate context → select most typical action → simulate → execute or modify. This model should be the template for time-pressured agent decision-making, with analytical deliberation reserved for situations where time permits and the stakes justify it.