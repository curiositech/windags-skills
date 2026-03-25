# Situation Assessment as the Primary Cognitive Work of Expert Systems

## The Inversion of Classical Decision Theory

Classical decision theory focuses on the **moment of choice**: generating alternatives, assigning probabilities to outcomes, weighting utilities, selecting the option with the highest expected value. This framework treats situation assessment as a preprocessing step — something that happens before the "real" decision work begins.

Klein and Calderwood's field research inverts this entirely. "The primary effort is usually not the moment of choice but rather in situation assessment." In operational environments — fire commands, military C2, nuclear plant operations, business crises — the hardest cognitive work is not choosing between known options. It is **understanding what situation you are actually in.**

This distinction is not subtle. It is the difference between:
- "Given options A, B, and C, which should I choose?" (classical framing)
- "What is actually happening here, and what kind of problem is this?" (operational framing)

The second question is harder, more consequential, and almost entirely neglected by classical decision theory.

## What Situation Assessment Actually Involves

Klein and Calderwood describe situation assessment as "identifying and clarifying the current state of the world including goals and assumptions" — what Gettys calls "predecision processes." But this description, while accurate, undersells the complexity of what's happening.

Real situation assessment involves:

**1. Feature Extraction Under Noise**
The decision-maker must identify which cues in the environment are signal and which are noise. An FGC arriving at a burning building sees dozens of features: smoke color, smoke location, flame visibility, structural characteristics, time of day, weather, personnel availability, neighbors' reports, visual anomalies. Which of these are diagnostic? This question cannot be answered without knowing what type of situation this is — which is what you're trying to assess. It is circular in the best way: tentative classification guides attention, which confirms or revises classification.

**2. Goal Identification (Not Goal Assumption)**
Classical decision theory assumes goals can be specified in advance. In operational settings, "the actual goal is to do the best job possible with the appropriate amount of resources, hardly a well-defined goal." Goals are themselves discovered through situation assessment. A commander doesn't know if the goal is "extinguish the fire" or "contain the fire" or "protect adjacent structures" until they understand the situation well enough to know which is achievable.

**3. Expectancy Generation and Monitoring**
Once a situation type is tentatively recognized, expert decision-makers generate expectancies: "If this is an electrical fire, I would expect X." These expectancies serve as verification probes — if X doesn't show up, the situation assessment needs revision. This is active, predictive understanding, not passive observation.

**4. Goal-Cue-Action Bundle Activation**
Situation recognition is not just labeling. It activates a complete bundle: this type of situation calls for these goals, warrants attention to these cues, generates these expectancies, and makes these actions plausible. The classification and the action are linked — understanding the situation is not a separate step from knowing what to do about it. They unfold together.

## The Cuban Missile Crisis Parallel

Anderson's analysis of the Cuban Missile Crisis decision-making is instructive: "decision making during the missile crisis involved sequential choice over an array of noncompeting courses of action." Policy makers spent most of their time "trying to understand the dynamics of the situation and trying to anticipate how courses of action would play themselves out." This was not a failure of decision rigor — it was expert decision-making operating exactly as it should. The hard problem was situational: What does Khrushchev actually want? What is the military readiness situation? What will happen if we blockade? The "choice" between blockade, air strike, and invasion was genuinely secondary to understanding what each of those options would actually produce.

## The Failure Mode: Skipping to Option Evaluation

The most common failure mode in complex decision-making is **premature option evaluation**: jumping to "what should we do?" before adequately answering "what is actually happening?" This failure is built into classical decision frameworks, which begin by specifying options rather than by characterizing the situation.

In agent systems, this failure manifests as:
- Routing to action-execution agents before the situation has been adequately classified
- Generating solution proposals before the problem statement is well-formed
- Evaluating candidate outputs against predefined criteria that don't match the actual task
- Treating initial problem descriptions as complete and accurate when they are almost always incomplete

Klein and Calderwood note that Army commanders found that "the commander's image of the current state of the battlefield and the desired state was more important than the generation and evaluation of alternative courses of action." The image — the mental model of the current situation — is the primary product of expert cognition. Options emerge from it.

## Implications for Agent System Design

### Situation Assessment as an Explicit First Phase

Agent orchestration systems must treat situation assessment as an explicit, non-skippable phase. Before any task decomposition, option generation, or action planning begins, the system must invest in understanding:

1. **What type of problem is this?** (Domain classification, task type recognition)
2. **What is the current state of the relevant environment?** (Context gathering)
3. **What goals are actually feasible here?** (Constraints and resources)
4. **What cues deserve monitoring throughout execution?** (Expectancy generation)
5. **What would indicate that the initial assessment was wrong?** (Falsifiability conditions)

This is not a quick routing step. In complex or ambiguous tasks, situation assessment may require as much or more effort than execution. The system should budget accordingly.

### Context Completeness Before Action

A common failure in agent systems is acting on incomplete context. The RPD model implies that a crucial early step is checking whether the situation assessment is adequate — do we have enough information to recognize what type of problem this is? If not, the first action should be information-gathering, not solution-generation.

This maps to a specific agent design pattern: a **situation assessment agent** that, before any task is routed for execution, evaluates whether the available information is sufficient to characterize the problem type. If not, it generates clarifying questions or information-gathering sub-tasks before proceeding.

### Expectancy as Verification Infrastructure

Situation assessment generates expectancies — predictions about what should be true if the assessment is correct. In agent systems, these expectancies become **monitoring conditions**: checkpoints during execution where the system verifies that the world matches the model. If an expectancy is violated, this is a signal to revise the situation assessment, not just to handle an error.

Example: An agent system handling a software debugging task might assess the situation as "null pointer exception in the database layer." This assessment generates expectancies: the error should be reproducible, it should occur specifically on database calls, it should not appear in isolated unit tests of non-DB components. If mid-investigation a unit test for a non-DB component also fails, this violates the expectancy and triggers situation reassessment — the problem might be larger than initially characterized.

### Distinguishing Novel from Familiar Situations

The entire RPD architecture depends on the ability to recognize a situation as familiar. When a situation is genuinely novel — no good case matches, expectancies are consistently violated, cues don't cluster into known patterns — the agent must shift modes. Novel situations require explicit, deliberate situation construction: building a model from first principles rather than retrieving one from experience.

This distinction should be surfaced explicitly to orchestrating agents: "I cannot reliably characterize this situation type. My assessment confidence is low. Extended situation assessment is required before action."

## Situation Assessment in Multi-Agent Coordination

When multiple agents must coordinate on a shared task, **shared situation assessment** is the foundation of effective coordination. If agents have incompatible mental models of what situation they are in, their actions will be mutually inconsistent even if each is locally competent.

Noble, Boehm-Davis, and Grosz proposed a schema-based model of distributed decision-making in command-and-control environments that addresses exactly this: a format that "has clear implications for building decision support systems that facilitate shared situation assessment." In multi-agent systems, this means:

- Agents must have access to a shared, updatable situation model
- Changes to the situation assessment by one agent must propagate to coordinating agents
- Disagreements about situation type should be surfaced and resolved before action divergence becomes costly
- The shared model should include not just current state but goals, expectancies, and monitoring conditions

## Measuring Situation Assessment Quality

Situation assessment quality can be measured independently of decision quality. Good situation assessment means:
- Correct identification of the situation type (which activates the right experiential bundle)
- Accurate identification of relevant cues (and suppression of irrelevant noise)
- Appropriate goal specification (neither too narrow nor too broad)
- Generation of expectancies that are actually verified by subsequent observations
- Appropriate confidence calibration (neither overconfident in novel situations nor underconfident in familiar ones)

Poor decision outcomes can stem from poor situation assessment even when the downstream decision process is sound. This means that post-mortems should distinguish between "we made the wrong choice from the right situation model" and "we made a choice from the wrong situation model." These have completely different remediation strategies.