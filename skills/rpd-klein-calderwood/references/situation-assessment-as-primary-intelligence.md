# Situation Assessment as Primary Intelligence: Why Knowing What's Happening Matters More Than Knowing What to Do

## The Central Inversion

Most intelligent system design assumes that the hard problem is *deciding what to do*. Given a situation, how do you select the best action from among the available options? This is where optimization, utility theory, and multi-criteria evaluation live.

Klein and Calderwood's research inverts this assumption. For expert decision-makers, the hard problem is not selecting among options — it is *understanding the situation*. Once the situation is correctly classified, the appropriate action is usually obvious. The decision is implicit in the recognition.

This is not a minor technical adjustment. It is a fundamental reorientation of what intelligent systems should be trying to do. The question changes from "given these options, which is best?" to "given this situation, what is it?"

## What Situation Assessment Actually Involves

Klein and Calderwood identify four interdependent components that constitute a full situation assessment:

### 1. Goal Identification Through Contrast
Understanding a situation means understanding what is achievable and what matters. But goals must be understood through contrast sets — the selection of a goal is meaningful only in relation to the goals not selected.

A fireground commander who says "my goal is to do my job" has conveyed nothing. A commander who says "my goal is to perform an interior attack" has conveyed a great deal — because the alternatives (exterior attack, search-and-rescue, calling a second alarm, abandoning the structure) are all meaningful possibilities that have been implicitly ruled out. The goal is defined by its contrast set.

For agent system design, this means that goal specification should always be accompanied by the set of goals that were considered and rejected. An agent that can articulate not just what it is trying to do but *what it decided not to try to do* has a much richer situational understanding than one that simply has a goal label.

### 2. Critical Cue Prioritization
In any complex environment, there are far more potential inputs than any system can process equally. Situation assessment involves knowing which cues matter. Expert decision-makers do not feel overwhelmed by operational environments — not because the environments are simple, but because they have learned to filter.

Fireground commanders have learned to read smoke: its color indicates temperature and therefore combustion materials; its pressure indicates fire intensity; its distribution indicates spread pattern. These perceptual cues carry causal implications that extend far beyond their surface appearance.

The critical insight from Klein and Calderwood is that novices and experts notice the same cues. The difference is in what those cues mean. "Novices draw fewer inferences based on these cues. Novices tend to miss the tactical implications of situational cues." (p. v)

For agent systems, this means that feature extraction and feature interpretation are distinct capabilities. An agent may have excellent sensors (it notices what novices notice) but poor situation assessment (it cannot draw the causal inferences that experts draw from those same observations). Building in richer inference chains from observations to situational implications is the work of building expertise.

### 3. Expectancy Formation and Violation Detection
Perhaps the most underappreciated component of situation assessment is expectancy formation. When an expert reads a situation, they do not just classify the present — they predict the near future. These predictions are specific, temporally bounded, and directly observable.

The example from the research is instructive: an experienced fireground commander directs water at what he believes is the seat of a fire. He expects the smoke color to change within 20-30 seconds. When 45 seconds pass with no change, he concludes that his seat-of-fire hypothesis was wrong. The expectancy is not vague hope — it is a specific, testable consequence of the situation assessment.

This is fundamentally different from Bayesian updating as typically implemented. The expert is not saying "given this observation, I update my probability estimate of fire location by some factor." The expert has a *model* of the situation that generates *specific predictions*, and the failure of those predictions is diagnostic of model error.

For agent systems, this suggests that situation assessments should always be accompanied by explicit predictive consequences: "If my current situation assessment is correct, then within time window T, I should observe outcome O." These predictions serve two functions: (1) they prepare the system to detect when the situation has changed, and (2) they provide a continuous self-checking mechanism that can trigger reassessment before decisions go badly wrong.

### 4. Typical Action Schemas
The fourth component of situation assessment is the activation of action knowledge — knowing not just what the situation is, but what is typically done about it. In the RPD model, the action is part of the recognition. The situation and the appropriate response co-activate.

This has a specific implication: the "action queue" is ordered by typicality, not by any abstract evaluation. The most typical response for this type of situation is considered first. This is not arbitrary — typicality reflects accumulated experience with what has worked in similar situations. The most typical response is, by definition, the one that has most often been found to be workable.

The decision-maker's task is then to verify that the typical response is workable in *this specific* situation — not to determine whether it is optimal in some abstract sense, but to determine whether it will work here, now, given these specific constraints.

## The Expert-Novice Difference Is About Inference, Not Attention

One of the most important empirical findings in this research — documented in the armored platoon command study (Study 3) and confirmed in the protocol analysis study (Study 7) — is that novices and experts have similar attention profiles. They notice similar cues. The contextual cues and areas of knowledge students reported in their decision accounts were "very similar to information offered by the instructors."

What differs is what they do with those cues. "Performance difficulties were not generally the result of inattention to appropriate environmental cues but misinterpretation of the cues' importance." (p. 37)

Novices in the tank platoon study were less likely to consider hypotheticals — possible alternative future states. And the more abstract the hypothetical (platoon control, friendly support, communications, enemy movements), the greater the gap between novice and expert. Novices could consider concrete hypotheticals (what happens to my tank) but struggled with abstract ones (what happens to the platoon's coherence, what happens to the enemy's response).

This is a rich finding for agent system design. It suggests that building expert-level agents requires not just better sensors or larger training sets, but **richer causal models** that connect observed features to their downstream implications. The gap is not perceptual — it is inferential.

Practically: an agent that is given raw situational data but lacks the causal model to interpret it will behave like a novice, even if that data is complete and accurate. Enriching the causal model — the network of implications that connect cues to situations to likely developments to appropriate responses — is the key investment for building expert-level situational intelligence.

## Situation Assessment and the Timing of Action

An underappreciated aspect of situation assessment is that it governs not just *what* to do but *when* to do it. Klein gives the example of a fireground commander who says "I held off ventilating the roof until I could see that the fire was beginning to spread to the attic." The decision was not just about which action to take — it was about when the situation had developed to the point where that action was appropriate.

Expert decision-makers have temporal situation models. They understand the dynamics of their domain — how situations develop, at what pace, through what sequence of states. This temporal understanding is part of their situation assessment.

For agent systems, this means that situation classification should be event-based (what type of situation is this?) but also temporal (what stage of this situation type am I in? what transitions are imminent?). An agent that knows it is in a "fire_ground_interior_attack" situation needs also to know whether that situation is early-stage, mid-stage, or late-stage, because the appropriate actions differ by stage.

## Failure Modes in Situation Assessment

When situation assessment goes wrong, it goes wrong in characteristic ways:

**Prototype mismatch**: The situation is classified as a familiar type when it has important features that distinguish it from that type. The appropriate response for the prototype is applied to a situation that is actually different in ways that matter. This is why inappropriate analogues are "a primary cause of errors" — they trigger a situation assessment that fits the past case but not the present one.

**Expectancy blindness**: The decision-maker has a confident situation assessment and fails to notice when observations violate the predictions that assessment generates. Strong schema activation can suppress attention to disconfirming evidence.

**Cue salience failure**: Attention is captured by salient but less important cues, while the cues that would correctly classify the situation are either missed or underweighted. This is more likely in novel situations where the decision-maker doesn't yet have calibrated attention.

**Situation drift without reassessment**: Dynamic situations change. A situation assessment that was correct at T=0 may be wrong at T=10. Expert decision-makers continuously monitor for expectancy violations that would signal that the situation has changed. When this monitoring lapses — under stress, cognitive load, or overconfidence — stale assessments drive increasingly inappropriate actions.

For agent systems, these failure modes translate directly: watch for prototype mismatch (are the distinguishing features of this situation actually consistent with the prototype?), implement expectancy violation monitoring (are predictions being met?), audit cue weighting (are the most diagnostic cues getting the most attention?), and schedule reassessment (re-classify the situation at regular intervals or when key thresholds are crossed).

## Implications for Agent System Design

The primacy of situation assessment over option evaluation implies a specific architectural priority: **the situation assessment module should be the most sophisticated component of the system, not the evaluation module.**

In most current agent architectures, the most sophisticated reasoning is applied to option evaluation — the planner, the evaluator, the optimizer. Situation assessment (what is sometimes called "context" or "state") is treated as a given, typically represented as a flat feature vector or a structured state object.

Klein and Calderwood's research suggests this has things backwards. The expensive, high-quality computation should go into asking "what is happening here?" and "what type of situation is this?" The action selection, for a well-trained system, can then be fast and recognition-based.

Concretely:
- Invest more compute in situation classification than in action optimization
- Enrich situation representations to include inferred causal relationships, not just observed features
- Generate and track specific testable predictions from every situation assessment
- Build in mechanisms to detect prediction failure and trigger reassessment
- Maintain ordered action queues keyed to situation types, rather than performing fresh optimization for each decision