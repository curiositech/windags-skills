# Situation Assessment as the Primary Cognitive Task: What Agents Must Get Right First

## The Central Insight

There is a pervasive assumption built into most intelligent system architectures: that the hard problem is *choosing between options*. Given a set of possible actions and a set of evaluation criteria, the system must find the best action. This frames intelligent behavior as an optimization problem.

Klein and MacGregor's research, and the Recognition-Primed Decision model it grounds, reveals that this assumption is almost entirely wrong for expert performance in naturalistic settings. The hard problem is not choosing between options. The hard problem is **understanding the situation accurately enough to recognize which type of problem you're in**.

As they write: "Because the RPD model assumes that an acceptable course of action may be chosen without conscious generation and evaluation of alternatives, the emphasis in this model is on what we have called situational awareness" (p. 19). The analogy they invoke is von Clausewitz's *coup d'oeil* — the ability to make a quick, accurate assessment of a situation and its requirements.

Once situation assessment is correct, action selection follows almost automatically. When situation assessment is wrong, sophisticated option evaluation still produces wrong actions.

## What Situation Assessment Contains

Situation assessment is not simply "knowing the facts." It is a structured understanding of the current situation that activates the relevant expert knowledge context. Klein and MacGregor's checklist for urban fireground commanders (Table 4, p. 29) gives a concrete anatomy of what situation assessment must cover:

- **Problem**: What is the nature of the hazard? How is it changing?
- **Structure**: What is the physical environment? What are its properties?
- **Problem × Structure interaction**: Where is the seat of the problem? How can it move?
- **Weather/Environmental conditions**: What external factors are active?
- **Risk to life**: Who is at risk? What are the exposure levels?
- **Risk to responders**: What hazards exist for the agents acting?
- **Nature of current action**: Is the current approach working? What is impeding it?
- **Resources**: What is available and what is needed?
- **Goals**: What is the current priority hierarchy?

This is not a static checklist to be completed once. Situation assessment is *dynamic* — it updates as new information arrives. Klein and MacGregor distinguish two types of updates:

- **SA-Elaboration**: New information makes the current picture more specific and detailed. Goals become more explicit. The same fundamental situation type is maintained.
- **SA-Shift**: New information is inconsistent with the current picture. The situation type classification must change. Old goals are rejected; new goals are established.

The Situation Assessment Record (SAR) structure (Table 5, p. 30) shows how these dynamics play out: SA-1 supports decision points 1 and 2; receipt of new information triggers SA-2 (elaboration), which supports DP-3; further information triggers SA-3 (shift), which restructures all subsequent decisions.

The SA-Shift is the most dangerous moment in dynamic decision-making. The fireground commander who suddenly realizes "this fire is too advanced to fight — we must evacuate the building" has experienced an SA-Shift. Failing to shift when the evidence demands it is a primary source of expert failure.

## The Apparatus of Situation Assessment: Cues, Causal Factors, and Expectancies

Situation assessment works through three cognitive mechanisms:

### Cues
Cues are the "primarily sensory data that affected the understanding of the situation" (p. 23). In fireground command, cues include: color, amount, and toxicity of smoke; amount and location of fire; explosion potential; presence of chemicals; rate of change; building type and construction; weather conditions; visible signs of occupancy.

The critical observation from the CDM research is that **expert cues are often invisible to novices**. In the paramedic study, for example, the CDM produced a Critical Cue Inventory for recognizing heart attack victims *before* they showed standard symptoms — perceptual discriminations that defined the expertise. Novices looking at the same patient would see nothing unusual. Experts see a pattern that demands immediate action.

This means that **cue sensitivity is a learnable and teachable dimension of expertise**. A critical output of the CDM is precisely this inventory: what did the expert notice that made the situation assessment possible?

### Causal Factors
Causal factors are "the dynamics affecting what was expected, what could be accomplished, etc." (p. 23). They are the underlying mechanisms that connect cues to outcomes. In fireground command: roof construction affects whether firefighters can safely go on the roof. Building material affects fire spread rate. Communications status affects coordination capability.

Causal factors allow situation assessment to project forward in time — to generate *expectancies* about what will happen if current trends continue and what will happen if specific actions are taken. Without causal understanding, situation assessment is purely reactive. With it, the decision-maker can act *before* the situation deteriorates.

### Expectancies
Expectancies are what should happen next *if the current situation assessment is correct*. They serve as a continuous validity check on the assessment. If expectancies are violated — if the fire doesn't respond as predicted, if the patient's condition changes unexpectedly — this signals that the situation assessment may need revision.

Expectancy violation is the trigger for SA-Shifts. A good decision-maker maintains active expectancies and updates them continuously against incoming observations.

## Why Situation Assessment Fails

Klein and MacGregor's research surfaces several failure modes in situation assessment:

### Availability Bias
Experts tend to select interpretations of situations that match cases that are most easily recalled from memory — cases that are vivid, salient, or recent. This can produce confident misclassifications when the current situation is actually different from the most available precedent (Tversky & Kahneman, 1973, cited on p. 15).

### Representativeness Bias
Experts judge situation type based on how many features the current situation shares with a known prototype. They may "ignore the distributional properties of samples" — overconfidently classifying based on a subset of available features, while missing features that would indicate a different situation type (Kahneman & Tversky, 1972, cited on p. 15).

The example Klein and MacGregor give is striking: "A battle commander might be fooled into reacting wrongly because the enemy presents to him a subset of activities that are like those that appeared previously when the enemy took certain actions. The commander ignores the other actions these activities might also indicate" (p. 15).

### Failure to Shift
Perhaps the most dangerous failure mode is the failure to execute an SA-Shift when evidence demands it. Once a situation assessment is established, it tends to persist even against contradictory evidence — because the expert interprets new cues through the lens of the current assessment rather than as evidence against it. This is a form of confirmation bias specific to the SA context.

### Missing Critical Cues
If the expert's cue inventory doesn't include the relevant cues for the current situation, situation assessment will be incomplete or wrong regardless of how much information is processed. This is why the CDM emphasizes building explicit Critical Cue Inventories — making visible what might otherwise remain tacit.

## Implications for Agent System Design

### 1. Structure the Situation Assessment Phase Explicitly
Agent systems processing complex tasks should have an explicit *situation assessment phase* before any action planning begins. This phase should:
- Collect and organize available information into the relevant categories (problem, environment, resources, risks, goals)
- Classify the situation type against a library of known types
- Activate the appropriate knowledge context (relevant cues to monitor, typical actions, expectancies)
- Flag anomalies — observations that don't fit the current classification

### 2. Build Dynamic SA Maintenance
Situation assessment is not a one-time initialization step. Agents must continuously update their SA as new information arrives, explicitly distinguishing between elaborations (current classification holds, becomes more specific) and shifts (new classification required). A dedicated SA-maintenance process should run throughout task execution.

### 3. Explicit Expectancy Generation and Monitoring
After situation assessment, agents should generate explicit expectancies: "If my current SA is correct, I expect to observe X in the next N steps." These expectancies should be actively monitored. Expectancy violations should trigger SA review and possible reclassification.

### 4. Cue Sensitivity as a First-Class Skill
The ability to notice the right things — to have a calibrated cue sensitivity — is a learnable, transferable skill distinct from reasoning ability. Agent systems should have explicit mechanisms for:
- Maintaining domain-specific cue libraries (Critical Cue Inventories)
- Weighting cues by their diagnostic value for different situation types
- Flagging high-diagnostic cues that appear in the current context

### 5. SA-Shift Detection as a Safety Mechanism
A critical safety capability is the ability to detect when a situation has shifted and the current SA is no longer valid. This requires:
- Maintaining an active hypothesis (the current SA)
- Running a continuous background check: "Is new information consistent with this SA?"
- Triggering reclassification when inconsistency exceeds a threshold

This is analogous to anomaly detection in system monitoring, but applied to the agent's own world model.

## The Expert-Novice Difference in Situation Assessment

Klein and MacGregor's research with tank platoon leaders (Figure 5, p. 31) makes the expert-novice difference in SA strikingly visible. When shown side-by-side, expert SA and novice SA for the same decision point differ not in analytical sophistication but in *what they notice and how they categorize it*. Experts attend to more contextually nuanced cues, integrate them into richer causal models, and generate more accurate expectancies.

The study notes: "A last method is simply to present the SA of experts and novices side by side, in verbal format, for the same decisions. This was also done for the study of tank platoon leaders, and was very effective in portraying the increased sensitivity of experts to contextual nuances" (p. 30).

This suggests that the primary development path from novice to expert is not learning more rules but developing richer, more accurate situation assessment — better cue sensitivity, richer causal models, more reliable type classification, and better expectancy generation.

## Summary

For intelligent agent systems, this teaching can be stated directly: **Don't jump to action generation. Build the situation model first.** The quality of everything downstream — option generation, action selection, execution — depends on the accuracy of the situation assessment. Invest in cue sensitivity, causal modeling, and continuous SA maintenance. Build explicit mechanisms for SA-Shifts. Monitor expectancies. And remember that the failure to correctly assess a situation is the most common source of expert error — not failures in option evaluation or planning.