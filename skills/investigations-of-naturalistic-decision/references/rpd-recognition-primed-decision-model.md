# The Recognition-Primed Decision Model: How Experts Actually Decide

## Why This Matters for Agent Systems

The Recognition-Primed Decision (RPD) model, developed by Gary Klein and Roberta Calderwood through field studies of urban fireground commanders, wildland fire incident commanders, and Army tank platoon leaders, is the most empirically grounded account of how expert cognition works under real operational conditions. It describes a process radically different from what normative decision theory assumes — and that difference has profound implications for how intelligent agent systems should be designed.

The core finding: **experienced decision-makers do not make decisions by generating options and comparing them. They make decisions by recognizing situations.**

## The Standard Model — and Why It Fails

For decades, the dominant framework for decision-making — both descriptive and prescriptive — assumed a structure something like this:

1. Perceive the situation
2. Generate a set of candidate options
3. Evaluate each option against criteria (utilities, probabilities, consequences)
4. Select the option with the highest expected value

This model underlies Decision Analysis, Multi-Attribute Utility Analysis (MAUA), and countless decision support systems. It is also how most AI planning systems are architecturally structured: enumerate possible actions, score them, pick the best.

Klein and Calderwood found that this model is simply not what experts do. When they interviewed fireground commanders with 20+ years of experience — people who had managed hundreds of complex, dangerous incidents — they found that:

- 54% of decision points involved no deliberation at all. The commander recognized the situation type and implemented the standard reaction directly.
- Only 18% of decisions fit the classical definition of concurrent evaluation between options.
- Even among decisions that involved deliberation, experts were more likely to use serial (one-at-a-time) evaluation than concurrent comparison.
- Experts almost never reported consciously comparing the strengths and weaknesses of one option against another.

The commanders themselves rejected the language of the decision models: "We were surprised to find the commanders rejecting the notions that they were 'making choices,' 'considering alternatives,' or 'assessing probabilities.' They saw themselves as acting and reacting on the basis of prior experience, and generating, monitoring, and modifying plans to meet the needs of the situations." (p. 4)

## The RPD Model: Three Levels of Operation

The Recognition-Primed Decision model describes three modes of operation, ranging from simplest to most complex:

### Level 1: Pure Recognition
The simplest and most common case. The decision-maker perceives the situation, recognizes it as an instance of a familiar type, and immediately knows what to do. No deliberation occurs. The recognition itself constitutes the decision.

This is not impulsive or thoughtless. It is the product of accumulated experience with a wide variety of cases. The expert has internalized thousands of situation-action mappings, and recognition activates the appropriate one with minimal cognitive overhead.

### Level 2: Recognition + Mental Simulation
The decision-maker recognizes the situation type but performs a quick mental simulation of the proposed action before implementing it. This is "progressive deepening" — imagining the action being carried out, step by step, within the specific context of this situation, to check whether anything might go wrong.

If the simulation reveals no serious problems, the action is implemented. If problems are found, the action may be modified. If the problems are severe enough that modification can't fix them, the action is rejected and the next candidate from the "action queue" is considered.

### Level 3: Ambiguous Situation
The most complex case occurs when the situation is not immediately recognizable. The decision-maker must diagnose the situation before a course of action can be determined. More information may be sought. Multiple competing situation assessments may be considered. Once the situation is classified, the appropriate action typically becomes obvious — but getting to a confident classification may require significant work.

## The Four Elements of Situation Assessment

The central cognitive work in RPD is situation assessment. Klein and Calderwood identify four types of knowledge activated by successful situation recognition:

**1. Plausible Goals**
Not abstract utility functions, but specific, context-bound objectives that a decision-maker is trying to achieve in this particular situation. Crucially, goals are understood through contrast sets — "perform an interior attack" is meaningful because the alternatives are "exterior attack," "search-and-rescue," "call second alarm," or "abandon the structure." The choice of a goal is always a choice against other goals.

**2. Critical Cues and Causal Factors**
Experts know which cues matter. In a burning building, the color and pressure of smoke, the nature of roof construction, the rate and direction of flame spread — these are not equally weighted inputs. The situation assessment prioritizes attention. Experts do not feel overwhelmed by environmental information; they have learned which signals carry the most diagnostic weight.

Importantly, Klein and Calderwood found that novices notice the same cues as experts. The difference is inference: "Novices draw fewer inferences based on these cues. Novices tend to miss the tactical implications of situational cues." (p. v) The cues are the same; the network of meaning attached to them is not.

**3. Expectancies**
Experts form specific, testable predictions about what should happen next if their situation assessment is correct. A fireground commander who believes the seat of a fire is in room A will direct water there and expect to see the smoke color change within 20-30 seconds. When 45 seconds pass with no change, the discrepancy is diagnostic: the assessment was probably wrong.

These expectancies are not vague hunches. They are specific, temporally bounded, and directly linked to observable indicators. They function as self-testing mechanisms — the expert is continuously checking their own model of the situation against incoming data.

**4. Typical Actions**
A recognized situation activates not just a description of the world, but a functional understanding of what to do. The action is part of the recognition. Klein notes that "a fire might feel like a 'search-and-rescue' situation more than a 'single-family 2-story home with brick exterior.' The emphasis is on a functional understanding of what to do." (p. 12)

The concept of an "action queue" is useful here: the recognition activates an ordered list of appropriate responses, with the most typical response first. This is the starting point for serial evaluation.

## The Serial Evaluation Strategy

When deliberation does occur, experts evaluate options serially — one at a time — rather than generating a complete set and comparing them. Klein gives the example of a rescue squad commander dealing with a woman trapped on a highway sign strut. He considered five options in sequence (Kingsley harness front-attached, Kingsley harness back-attached, Howd strap front-attached, Howd strap back-attached, ladder belt), rejecting each by mental simulation until the ladder belt option worked. At no point did he compare options to each other. He found the first workable option and stopped.

The strategic advantages of serial evaluation are significant:

- **Constant readiness**: A decision-maker using serial evaluation always has a current best option ready to implement. If time runs out, they are never caught mid-analysis with no answer. A concurrent evaluator cannot know which option is best until all analysis is complete.
- **Reduced computational burden**: Comparing N options across M criteria is O(N×M) work. Evaluating options one-at-a-time until one passes is, in the best case, O(1) (if the first option works) and in practice much better than full comparison.
- **Bias toward quality**: Because the action queue is ordered by typicality — most likely to work first — the first option evaluated tends to be the most promising. Satisficing over a typicality-ordered queue is a much stronger strategy than satisficing over a random queue.
- **Modifiability**: Serial evaluation includes the option of improving a candidate action rather than simply accepting or rejecting it. Weaknesses found in mental simulation are often repairable; the decision-maker strengthens the option rather than discarding it.

## What This Means for Agent System Architecture

The RPD model suggests several important design principles for intelligent agent systems:

**Recognition before search**: An agent's first response to a new situation should not be to generate all possible actions and evaluate them. It should be to match the current situation against known patterns and retrieve the associated response. Search and evaluation are expensive; recognition is cheap. Reserve deliberation for genuinely novel situations.

**Situation assessment is the bottleneck**: The quality of an agent's decisions depends primarily on the quality of its situation classification. An agent that correctly identifies "what kind of problem this is" will almost automatically know what to do. An agent that misclassifies the situation will apply an inappropriate action schema regardless of how sophisticated its evaluation machinery is.

**Build action queues, not action comparators**: Agent systems should maintain typicality-ordered action sequences for recognized situation types. The question is not "which of these options is best" but "does this option work?" — answered by simulation or evaluation of the single top candidate.

**Expectancy monitoring as a control mechanism**: Agent systems should generate specific, testable predictions about what should happen after an action, and monitor whether those predictions are met. Violated expectancies should trigger re-assessment of the situation classification, not just re-evaluation of the action.

**Expert-mode vs. novice-mode should be architecturally distinct**: Systems that have accumulated experience should operate differently from systems that have not. Forcing experienced components to use analytical evaluation frameworks prevents them from leveraging their actual competence.

## Boundary Conditions

The RPD model was developed from studies of specific domains: urban firefighting, wildland firefighting, and military command. These domains share important features: high time pressure, high stakes, dynamic environments, experienced practitioners, embodied action. Several boundary conditions deserve attention:

- **The model applies to experienced practitioners**. Novices cannot rely on recognition because they have not built the pattern libraries that make recognition possible. The model explicitly warns against training novices with analytical methods that prevent them from developing recognitional capabilities.
- **Organizational and interpersonal decisions are exceptions**. Klein found that even expert commanders shifted to analytical (concurrent evaluation) strategies for decisions involving organizational structure and interpersonal negotiations — roughly 28% of wildland firefighting decisions. Recognitional decision-making works best for technical/tactical problems, not social/political ones.
- **Novel situations break the model**. When a situation has no good prototype match, recognition fails and deliberation is necessary. The model accommodates this (Level 3 operation), but the transition from recognition to deliberation is underspecified.
- **The model is descriptive, not fully prescriptive**. Klein explicitly acknowledges that the RPD model "lacks the set of clear postulates that would allow it to be used to generate testable hypotheses." It is a conceptual framework, not a formal algorithm.