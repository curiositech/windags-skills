# Why Prescriptive Analytical Decision Methods Fail Experts — and How to Avoid Imposing Them on Agents

## The Prescriptive Orthodoxy

For decades, the dominant prescription for improving decision making in complex, high-stakes environments was some version of analytical decision theory: generate options, evaluate them systematically, select the one with the highest expected utility or best multi-attribute score. This approach is instantiated in tools like Decision Analysis, Multi-Attribute Utility Analysis (MAUA), fault trees, decision matrices, and structured analytic techniques.

These tools share a common architecture:
1. Enumerate the options
2. Enumerate the evaluation dimensions (criteria, objectives, attributes)
3. Score each option on each dimension
4. Aggregate scores into an overall ranking
5. Select the highest-ranked option

This architecture is mathematically coherent. It is transparent. It is auditable. It is also, according to Klein and Calderwood's field research, "not well accepted in operational settings" and demonstrably harmful when imposed on expert practitioners.

Understanding *why* these tools fail experts is essential for designing intelligent agent systems that do not make the same mistake.

## Failure Mode 1: The Tools Assume the Wrong Cognitive Bottleneck

Analytical decision tools are designed to help with option evaluation — the process of comparing alternatives on dimensions and aggregating scores. This assumes that evaluation is the hard part of expert decision making.

Klein's research shows it is not. "Only 18% of the decisions fit the classical definition of decision making as concurrent evaluation between options." The hard cognitive work for experts is *situation assessment* — understanding what type of situation they are in and what options are even relevant. Decision Analysis and MAUA "have more to say about the consequences of selecting individual options" than about situation assessment.

By optimizing the easy part (option ranking among predefined options) while ignoring the hard part (situation classification and option generation), analytical tools provide scaffolding where it isn't needed and leave experts unsupported where it is.

## Failure Mode 2: They Require Pre-Specification of What Cannot Be Pre-Specified

Analytical models require that options and evaluation dimensions be "well-defined and remain constant over the course of the decision problem." But in operational environments, "the structure of the decision may change over time as events change and/or a new understanding of a decision problem is achieved."

In dynamic environments, options cannot be pre-enumerated because the situation generating them is constantly changing. Evaluation dimensions cannot be fixed because which dimensions matter depends on the situation assessment — and situation assessments evolve. A decision matrix set up based on the initial situation reading becomes increasingly irrelevant as the situation develops.

Expert decision makers understand this implicitly: "A search for an optimal choice could stall the FGCs long enough to lose control of the firefighting operations." The time spent computing the optimal decision is time in which the world has moved, potentially invalidating the computation.

## Failure Mode 3: They Undermine the Expert's Primary Capability

The deepest problem with imposing analytical methods on experts is not that they are inefficient — it is that they actively prevent the expert from using their primary strength.

"The greater concern is that they will be unable to make effective use of their own expertise. The Decision Analysis and MAUA approaches may not leave much room for the recognitional skills of experienced personnel. Therefore the risk of using these approaches is that decision performance will become worse, not better."

Expert recognition-primed decision making works because the expert's schema activation delivers a situationally-appropriate option as the first-considered — not through random search, but through experience-derived pattern matching. Forcing this expert into a generate-and-compare framework does two things simultaneously:

1. It *prevents* the recognition process from operating efficiently by requiring explicit option enumeration where recognition would have delivered a workable option immediately.
2. It *substitutes* a weaker analytical process that, because it treats all options symmetrically, cannot take advantage of the expert's knowledge about which options are most likely to work in this situation type.

The result: the expert is slower than they would be using recognition, and the quality of the resulting decision is degraded because the expertise is locked out of the decision process.

## Failure Mode 4: They Create a Training Trap for Developing Expertise

There is a second-order effect that compounds the direct performance degradation. "Trainees may not have a chance to develop expertise if they learn to rely on analytical methods rather than developing their own recognitional capabilities."

Recognition-primed decision making is a skill that develops through accumulated experience of seeing how situations unfold, learning which cues predict which consequences, building the schema library that supports fast, accurate situation classification. This learning requires active engagement with the recognition process — it cannot be outsourced to a decision tool.

If trainees learn to rely on analytical tools as a crutch, they may never develop the situational recognition that makes expert decision making fast and robust. They remain permanently in the novice mode of explicit option comparison, just with better tools for doing the comparison. But "novices lack the recognitional skills needed to effectively perform recognitional decision making" — and the tools do not provide those skills.

## Failure Mode 5: Decision Biases Are Context-Dependent

The traditional case for analytical decision tools rests partly on the large literature documenting human cognitive biases (availability, representativeness, anchoring, etc.) that lead to poor decisions. If people are systematically biased, the argument goes, we need tools to correct those biases.

Klein and Calderwood contest this at multiple levels:

**Biases are demonstrated in decontextualized laboratory conditions**: "These biases have been demonstrated in settings where context has been carefully limited, tasks are well-defined, and experience level is usually low. In other words, the opportunity for effective recognitional decision making has been limited."

**Expert studies show capability, not bias**: "Christensen-Szalanski and Beach (1984) has argued that these classical decision biases are artifacts of laboratory methodology and of the analytical perspective; they showed that studies of novice decision makers usually found evidence for biases whereas studies of experts usually documented their strengths."

**Even documented biases have small real-world effects**: "Biases primarily operate on very low frequency events (e.g., a clear bias in the way physicians diagnose pneumonia would lead to an average of only one missed diagnosis per year). And if the frequency of such events increases, so will experience with them, thereby diminishing the bias."

**"Biases" may reflect adaptive strategies**: "Some tendencies that show up as biases for well-defined laboratory tasks may be of value in the field. 'Biases' such as availability and representativeness reveal the fact that proficient decision makers have learned to rely on episodic memory." Episodic memory-based reasoning is not a flaw to be corrected — it is the mechanism of expertise.

## When Analytical Methods Are Appropriate

This is not an argument against analytical decision methods categorically. Klein identifies conditions under which they add value:

- When the decision maker is genuinely a novice and lacks recognition capabilities
- When there is ample time, low dynamism, and the situation is stable enough for extended analysis
- When there are genuine disputes between stakeholders that require a visible, auditable deliberation process
- When the situation is truly unprecedented and no prototype fits

The key is not to use analytical methods as a universal improvement prescription but as a specific tool for specific conditions. The default for experts under operational conditions should be recognition-based decision making, with analytical methods available as a deliberate override when conditions warrant.

## Implications for Agent System Design

The failure modes of analytical prescriptions map directly onto failure modes in AI agent architectures:

**Anti-Pattern: Always Enumerate Options Before Acting**: Agent systems that default to generating a slate of candidate actions and scoring them impose concurrent evaluation on every decision, regardless of whether recognition-based fast-path would suffice. This is expensive, slows response time, and prevents expertise (in the form of trained recognition patterns) from driving the process.

**Anti-Pattern: Fixed Evaluation Rubrics**: Scoring rubrics with fixed weights for fixed dimensions encode the assumption that evaluation criteria are stable across situation types. In dynamic environments, which dimensions matter and how much they matter depends on the situation assessment. Fixed rubrics apply the wrong criteria as situations shift.

**Anti-Pattern: Decision Quality = Score Maximization**: Systems designed to maximize a scoring function are optimizing for the wrong thing in expert-like operational contexts. The goal is not the highest-scoring option — it is a workable option that can be implemented quickly and monitored for failure. "Workable, timely, and cost-effective" rather than "optimal."

**Design Principle: Fast-Path Recognition Before Analytical Path**: Architecturally, agent systems should check for strong pattern matches first. If a strong situational prototype is activated, follow the fast RPD path (action queue → serial evaluation → progressive deepening). Fall back to analytical option generation only when the recognition confidence is below a threshold.

**Design Principle: Support Skill Development, Not Skill Replacement**: For agent systems designed to work *with* human experts, the design should augment situation assessment (richer cue interpretation, expectancy generation, schema access) rather than replace the expert's judgment with a scoring system. The scoring system undermines the very expertise it is supposed to support.

**Design Principle: Preserve Action-Readiness**: Whatever decision process an agent runs, it should always be able to report a current best action. Never design an agent that can say "I don't know what to do yet — waiting for analysis to complete." In dynamic environments, that is a fatal state.