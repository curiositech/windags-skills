# Recognition-Primed Decision Making: How Experts Decide Fast and What It Means for Agent Design

## The Problem With Rational Choice Models

Classical decision theory — and much early AI — assumed that good decision-making follows a recognizable structure: enumerate options, evaluate each against criteria, select the best. This model is clean, tractable, and wrong in most real-world conditions.

Gary Klein's decades of fieldwork — with firefighters, military commanders, intensive care nurses, chess grandmasters, and many other expert practitioners — revealed a fundamentally different pattern. Published through the Naturalistic Decision Making (NDM) research program (Zsambok & Klein, 1997), this work shows that experienced decision-makers in time-pressured, high-stakes, dynamic environments rarely generate and compare options. Instead, they *recognize*.

Klein's Recognition-Primed Decision (RPD) model describes how this actually works:

1. **Situation recognition**: The expert reads the available cues and rapidly classifies the situation as belonging to a known type — a "this is one of those" moment. This classification activates a bundle of associated knowledge: what the situation typically involves, what goals are relevant, what actions have worked before, what outcomes to expect.

2. **Course of action generation**: Rather than generating multiple options to compare, the expert's recognition of the situation type makes a *single* course of action salient. This is not random — the action is the one that experience has associated with this situation type.

3. **Mental simulation**: Before acting, the expert runs a quick mental simulation: "If I do this, what happens?" This simulation is not exhaustive analysis — it is a rapid forward projection that checks whether the action will work given the specific details of the current situation.

4. **Action or revision**: If the simulation succeeds, the expert acts. If the simulation reveals a problem ("if I do X, that will cause Y which will make things worse"), the expert modifies the action and re-simulates. If no modification fixes the problem, the expert revisits the situation assessment — maybe this isn't the type of situation they thought it was.

The critical point is that comparison of options is *not the primary mechanism*. Options are generated one at a time, evaluated for adequacy (not optimality), and accepted or rejected. The cognitive work is in the recognition and simulation, not in the comparison.

## Why This Matters: Speed, Uncertainty, and Adequacy

The RPD model is not a description of lazy or careless thinking — it is a description of *efficient expertise*. Consider the constraints under which real decisions must often be made:

- **Time pressure**: A fire commander deciding whether to evacuate a burning building has seconds, not hours.
- **Uncertainty**: Information is incomplete, ambiguous, or actively misleading.
- **Dynamic conditions**: The situation is changing while the decision is being made.
- **High stakes**: Wrong decisions have serious consequences.

Under these conditions, exhaustive option comparison is not just impractical — it is counterproductive. By the time you have generated and evaluated all options, the situation has changed, and your analysis is stale. The expert's recognition-based approach is calibrated to the actual demands of the environment: fast, good-enough decisions that can be revised as new information arrives.

This connects to a deeper principle: **satisficing over optimizing**. Herbert Simon recognized decades ago that real intelligent agents do not optimize — they satisfice. They find a solution that is good enough given their goals and constraints, and they act on it. The RPD model shows exactly *how* experts satisfice: by recognizing situation types that come with pre-validated, experience-tested response patterns.

## The Knowledge Underneath Recognition

Recognition is not magic — it is the output of *compiled experience*. What distinguishes the expert from the novice is not superior reasoning capacity but a richer, more densely structured library of situation types and associated responses.

Klein's research found that expert firefighters and other practitioners build this library through extended experience with varied cases, particularly cases where outcomes were surprising or where initial assessments proved wrong. The most educationally potent experiences are not the routine cases — they are the "near-miss" cases where something unexpected happened and the practitioner had to revise their situation model.

This has a direct implication: the structure of expert knowledge is not propositional rules ("if X then do Y") but *cases with associated patterns of cues, goals, expectations, and actions*. The knowledge is organized around situations, not around abstract decision criteria.

Hutchins (1995) in *Cognition in the Wild* extends this by showing that much of this situational knowledge is not in individual heads — it is distributed across tools, artifacts, practices, and the social organization of the workplace. Expert performance is therefore often *distributed cognition*, not just individual cognition.

## Translating RPD to Agent System Design

The RPD model has several specific, actionable implications for how AI agent systems should handle decisions under uncertainty.

### 1. Invest in Situation Classification Before Action Selection

The RPD model says that the most critical cognitive step is not "what should I do?" but "what kind of situation is this?" Agent systems should have explicit mechanisms for situation assessment before routing to action-taking agents. This might look like:

- A **classifier agent** that reads the current context, the task description, available resources, and prior outputs, and labels the situation with a type or category
- A **context representation** that accumulates relevant cues as the task progresses
- A **situation history** that tracks how the situation has evolved, enabling pattern matching against past cases

Without explicit situation classification, agents jump to action based on surface features of the task specification — which is the novice pattern, not the expert pattern.

### 2. Implement Mental Simulation Before Commitment

Before committing to a significant action (calling an expensive API, making an irreversible change, generating output that will be used by downstream agents), an agent or the orchestration layer should perform a lightweight forward simulation: "If I do X, what is the likely state of the system afterward? Does that state serve the goal?"

This is not full planning — it is the expert's "quick mental check." It catches obvious mismatches between the proposed action and the actual situation without the overhead of exhaustive planning.

Concretely, this might look like a prompt to a reasoning agent: "Given the current task state [description], I am about to [action]. Walk through what happens next if I take this action. Does the outcome serve the goal [goal description]? If not, what should I do differently?"

### 3. Generate One Good Option, Not All Options

Agent systems that are asked to "consider all possible approaches" often produce unfocused, hedged output. The RPD model suggests an alternative: generate the *first plausible approach* based on situation recognition, simulate it, and refine. If the first approach fails simulation, generate the next plausible approach.

This is more efficient and often produces better results than asking for an exhaustive menu of options, because it forces the system to commit to a specific plan and test it, rather than producing vague generalizations about what might work.

### 4. Design for Revision, Not Just Decision

A key feature of RPD is that decision-making is not a one-shot event — it is a continuous process of assessment, action, feedback, and reassessment. Agent systems should be designed with this cycle in mind:

- Actions should produce *observable outputs* that allow the system to assess whether the situation has evolved as expected
- The system should have explicit mechanisms for detecting when actual outcomes diverge from simulated expectations
- When divergence is detected, the system should return to situation assessment, not simply retry the failed action

This is a loop, not a pipeline. The difference matters enormously.

### 5. Build Libraries of Situation Types

The expert's recognition ability depends on a rich library of cases. Agent systems can develop analogous resources:

- **Example repositories**: Solved cases with annotated situation types, actions taken, and outcomes
- **Pattern libraries**: Descriptions of recognizable situation types with associated successful approaches
- **Anti-pattern libraries**: Cases where a plausible-seeming approach failed, and why

These resources, retrievable at decision time, give the agent system the functional equivalent of the expert's compiled experience.

## Boundary Conditions: When RPD Doesn't Apply

The RPD model is not universal. It describes expert behavior in specific conditions:

- **When the practitioner has genuine expertise**: Novices do not recognize situation types reliably because they lack the experiential library. An agent system with limited training on a domain cannot use recognition-primed methods effectively — it will recognize the wrong type or fail to recognize the situation at all.

- **When the situation type is genuinely familiar**: RPD fails when the situation is truly novel — when it doesn't match any known type. In these cases, knowledge-based reasoning from first principles is required, and the RPD model correctly identifies this as a different mode.

- **When stakes are high enough to justify exhaustive analysis**: For decisions with catastrophic irreversible consequences, the time investment in thorough option comparison may be warranted even when it is slow.

- **When multiple stakeholders have different goals**: RPD assumes a single coherent goal structure. When different parties want different things, the recognition-based approach may prematurely close off options that serve legitimate competing interests.

## The Deeper Lesson

What the RPD model ultimately teaches is that **intelligence in complex domains is not primarily about reasoning power — it is about recognition and simulation ability**. The expert and the novice may have similar raw cognitive capacity. What differs is the richness of the expert's situational library and the quality of their forward simulation.

For agent systems, this means: investing in richer context representations, better situation classification, and lightweight forward simulation will improve decision quality more than investing in more exhaustive search or larger reasoning budgets. The bottleneck is not computational power — it is situational knowledge and the mechanisms for applying it rapidly.

Build agents that recognize before they reason, and simulate before they commit.