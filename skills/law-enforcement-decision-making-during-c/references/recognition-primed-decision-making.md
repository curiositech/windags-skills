# Recognition-Primed Decision Making: How Experts Skip the Comparison Step

## Overview

The central empirical finding of Naturalistic Decision Making (NDM) research is surprising to anyone trained in classical decision theory: **expert decision-makers rarely compare options**. When Klein et al. (1986) originally studied fireground commanders, they expected to find decision-makers weighing their top choice against an alternative. Instead, the commanders reported that there was nothing to compare — the correct course of action was simply *obvious*. "They did not seem to compare any choices. Instead, the commanders would claim that they 'just knew' the correct course of action. Many commanders reported that they did not make decisions at all; that there was no time for deliberation and the solution was usually obvious" (Zimmerman, p. 6).

This is the Recognition-Primed Decision (RPD) model, and it has profound implications for how intelligent systems should approach decision-making under time pressure and uncertainty.

## The Three Levels of RPD Processing

The RPD model describes three levels of decision processing, distinguished by how familiar and clear the situation is.

### Level 1: Simple Match
The decision-maker recognizes the situation as typical. A known pattern is activated. Expected cues are present. The situation "fits" a familiar mental model. The appropriate action comes to mind automatically, and is implemented without deliberation. This is pure pattern recognition — fast, automatic, and accurate when the situation truly matches prior experience.

The decision-maker at Level 1 is doing four things simultaneously without conscious enumeration: recognizing important cues, generating expectancies about what happens next, identifying plausible goals, and retrieving a typical course of action. These are not sequential steps — they are a single cognitive act.

### Level 2: Situation Assessment
The situation is unfamiliar, ambiguous, or contradictory. Level 1 pattern recognition fails or produces an uncertain match. The decision-maker now engages in **feature-matching** (matching observed cues to known situations) and **story-building** (making inferences to fill in missing information and construct a coherent narrative of what is happening).

"When the decision-maker uses story-building, they make inferences to fill in missing information and create a coherent story of the situation. By matching mental models to the situation, decision makers are able to explain the causes of an event and predict outcomes" (p. 11).

Critically, Kaempf et al. (1996) found that in naval command-and-control, personnel reported more instances of situation assessment than decisions about courses of action — and 87% of those assessments used feature-matching. Only 12% required story-building. The implication: most expert decision-making is fast pattern recognition; story-building is the fallback for genuinely novel situations.

### Level 3: Mental Simulation of Actions
The situation is understood, but the correct action is not immediately clear — or the stakes of getting it wrong are high enough to warrant checking. The decision-maker mentally simulates the action sequence: imagines implementing it, projects what will happen, identifies potential failure points. If problems are found, the action is modified or rejected, and the next candidate action is considered.

"By envisioning what may happen, decision makers predict the course of events, identify potential problems, and create alternative action plans" (p. 12).

This is not option comparison. It is sequential evaluation of single options against imagined futures — a fundamentally different computational structure.

## Why This Architecture Matters for Agent Systems

Classical AI decision-making architectures often implement something like Level 3 by default: enumerate options, evaluate each against a utility function, select the maximum. This is computationally expensive and inappropriate for time-pressured environments. The RPD model suggests a different architecture:

**Front-load classification, not enumeration.**

The primary computational work is in recognizing *what kind of situation this is*. If classification succeeds cleanly (Level 1), action selection is trivial — the recognized situation carries an associated action directly. If classification is ambiguous (Level 2), the system should engage story-building: use inference and available evidence to construct the most coherent interpretation, then retrieve the action associated with that interpretation. Only when the action's consequences are genuinely uncertain should the system engage simulation (Level 3).

This maps directly to agent system design:
- **Level 1 → Skill routing by pattern recognition**: The incoming task matches a known template. Route to the appropriate skill with the associated default parameters. No deliberation needed.
- **Level 2 → Situation assessment module**: Ambiguous or conflicting signals. Invoke information-gathering, feature-matching, or inference to establish context before action selection.
- **Level 3 → Simulation or dry-run step**: Before committing to an action with high-stakes consequences, run a mental simulation — can be implemented as a lightweight forward-projection step that checks for likely failure modes.

## The Role of Mental Models

What makes Level 1 and Level 2 work is the richness of the decision-maker's mental models — internal representations of "how things typically go" in this domain. "Because experts have these mental models, they are able to perceive situations more efficiently and respond faster than novices who must filter through every bit of information before assessing and acting on the situation" (p. 24).

Mental models provide three functions:
1. **Description**: What is happening here?
2. **Explanation**: Why is it happening?
3. **Prediction**: What will happen next?

An agent system's "mental models" are its learned associations between situational features and outcomes — its training on domain-specific cases, its retrieved examples from memory, its stored patterns from past executions. The richness and coverage of these models directly determines the quality of Level 1 and Level 2 processing.

A critical asymmetry: **mental models are built from experience with specific situations, not from abstract rules**. Novice officers had rules ("approach cautiously," "draw weapon if threat present") but lacked the mental models that would tell them *what the situation meant* — which changed what the rules implied. "Novice participants relied on textbook-type procedural descriptions of how they dealt with the situation, while experienced participants provided descriptions of the strategic maneuvers used to negotiate through the situation" (p. 55).

## The Danger of Backward Reasoning

A subtle but important finding: novices tend to use **backward reasoning** (start with a hypothesis and try to fit incoming data to it), while experts use **forward reasoning** (start with data and build toward a conclusion).

"Forward reasoning is similar to mental simulation processes used by decision makers in level three of the recognition primed decision model, in which decision makers reason from facts to a hypothesis by integrating information into the problem task and then formulating goals" (p. 27-28).

Backward reasoning is dangerous in ambiguous situations because it creates confirmation bias — the decision-maker sees what they expect to see, and anomalous data gets discounted. In the police scenarios, novices who entered with the hypothesis "subject will comply" continued acting as if compliance were imminent even when compliance was clearly not occurring. The data was being fit to the hypothesis rather than the hypothesis being updated from the data.

For agent systems, this is a design warning: **be careful about architectures that commit to a task framing early and then route all subsequent inputs through that frame**. Backward reasoning architectures are fast and often correct, but they fail systematically in situations that violate initial expectations.

## Application Summary

| RPD Level | Decision-Making Mode | Agent System Analog |
|-----------|---------------------|---------------------|
| Level 1 | Pattern match → automatic action | Template routing; skill invocation by classification |
| Level 2 | Story-building; feature-matching under uncertainty | Inference module; context establishment before action |
| Level 3 | Mental simulation of action consequences | Forward-projection; pre-execution failure check |

The key architectural principle: **invest computational effort in situation assessment, not option comparison**. The bottleneck in expert decision-making is not "which of these options is best?" — it is "what is actually happening here?" Get that right, and the action often follows without deliberation.