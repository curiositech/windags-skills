# The Recognition-Primed Decision Model: How Experts Actually Decide

## Why This Matters for Agent Systems

The dominant assumption embedded in most decision-support systems, planning algorithms, and agent architectures is that good decisions require:
1. Generating all possible options
2. Evaluating each option against a common set of criteria
3. Selecting the option with the highest score

This assumption is wrong — not marginally wrong, but fundamentally incompatible with how human experts actually make decisions under time pressure in naturalistic settings. Klein and MacGregor's empirical work with fireground commanders, tank platoon leaders, paramedics, and other domain experts converges on a different model: the **Recognition-Primed Decision (RPD) model**. Understanding this model is essential for any agent system that must make decisions under uncertainty, time pressure, or ambiguous information.

---

## The Three Levels of RPD

Klein and MacGregor describe three variants of the RPD model, ordered by increasing cognitive complexity:

### Level A-1: Automatic RPD
The decision-maker uses available cues and accumulated knowledge to **recognize a situation as familiar or typical**. This recognition automatically surfaces:
- What goals can be achieved given this situation type
- Which cues to monitor
- What expectations to form about how the situation will evolve
- A "typical reaction" — the action normally associated with this situation class

If the situation is sufficiently routine, the typical reaction is implemented directly, with no conscious deliberation. An experienced fireground commander arrives at a scene, reads the smoke color, building type, and flame characteristics, and within seconds is issuing commands — not because she computed an optimal strategy, but because she recognized the situation as an instance of a known type and accessed the associated response.

### Level A-2: Verified RPD
The decision-maker recognizes typicality but has time for minimal evaluation. The typical course of action is accessed from an "action queue" — an ordered repertoire of options, with the most contextually appropriate listed first. Before implementing, the decision-maker runs a quick **mental simulation**: imagining the action being carried out and checking whether it produces the desired outcome without generating unacceptable side effects.

Critically: **no other option is considered at the same time**. The mental simulation either confirms the option (implement), suggests a modification (implement a modified version), or rejects it (move to the next option in the queue).

### Level A-3: Serial RPD
The most complex case. The favored option is seriously evaluated via mental simulation, potentially rejected, and the next option in the action queue is considered. This continues until a workable option is found. Even here, **options are never compared against each other simultaneously** — they are evaluated serially, one at a time, against the single criterion of "will this work?"

As the report states: "At no time will the decision maker attempt to generate more than one option at a time, or to evaluate options by contrasting strengths and weaknesses."

---

## What Precedes the Decision: Situation Assessment

What actually distinguishes expert from novice performance is not the quality of option evaluation — it is the quality of **situation assessment**. The RPD model's key insight is that situation assessment is the primary cognitive work. Klein and MacGregor describe situation assessment as including:

- **Cue recognition**: What sensory data is present? What does it mean?
- **Prototype matching**: Does this situation resemble a familiar type?
- **Goal identification**: What can be accomplished? What is the priority?
- **Expectancy formation**: What will happen next if this prototype holds?
- **Causal dynamics modeling**: What forces are shaping the situation's evolution?

Experts are not better at evaluating options. They are better at recognizing situations correctly, which makes the appropriate option obvious. When experts make bad decisions, they almost always trace to failed situation assessment — misidentifying the situation type — not to a logical error in comparing options.

The Situational Awareness Record (SAR) that Klein and MacGregor develop for knowledge base construction captures this explicitly: it tracks not the decision but the evolving *understanding* of what the situation is, with each update (SA-Elaboration or SA-Shift) representing the acquisition of new information that changes or refines the current prototype match.

---

## Why Normative Decision Analysis Fails in Practice

Klein and MacGregor document the failure of formal decision analysis (enumerate options → assign probabilities → compute expected utilities → choose maximum) across multiple domains:

1. **Time incompatibility**: Analytical decision strategies are not effective when there is less than one minute to respond (Howell, 1984; Zakay & Wooler, 1984). Real-world command situations often require responses in seconds.

2. **Option generation failure**: People are very poor at generating complete sets of options (Gettys & Fisher, 1979). Expecting exhaustive enumeration sets up a systematic failure mode.

3. **Probability calibration failure**: Uncertainty assessments are poorly calibrated and exhibit insensitivity to actual knowledge levels (Lichtenstein, Fischhoff & Phillips, 1982).

4. **Artificial task mismatch**: Laboratory paradigms use well-defined tasks, naive subjects, ample time, and no personal consequences. These conditions specifically eliminate the features (ambiguity, time pressure, domain knowledge, stakes) that define real expertise.

The report is explicit: "The paradigms do not generalize well to natural environments where there is usually time pressure, limited resources, dynamic and ambiguous goals."

---

## The Role of Mental Simulation

One of the most important and underappreciated elements of the RPD model is **mental simulation** as an option evaluation mechanism. Rather than comparing Option A against Option B, the expert imagines Option A being executed in the current situation and watches what happens.

This mental simulation leverages the same causal knowledge that supports situation assessment. The expert has a mental model of how the situation dynamics work — how fire spreads through different building materials, how enemy units respond to flanking maneuvers, how patients in shock present — and can run this model forward to test whether a proposed action will achieve the desired outcome.

Mental imagery appears consistently across all of Klein and MacGregor's studies: "We have seen it in virtually all the studies we have performed. An example is the firefighter who ran through several repetitions of an image of how an unconscious car-accident victim was going to be supported prior to initiating the rescue."

The simulation is not abstract probability estimation. It is kinesthetic, contextual, and scenario-specific. This is a crucial distinction: the expert is not asking "what is the probability this will work?" but rather "can I imagine this working, given everything I know about this specific situation?"

---

## Implications for Agent System Design

### 1. Replace Option Comparison with Option Validation
Agent systems that generate N options and select the best via scoring function are implementing the normative model that human experts abandon under time pressure. A more naturalistic architecture generates **one option at a time from the most-to-least-typical ordering for the recognized situation type**, then validates each via simulation before implementation. This preserves the ability to act at every moment (always have a primed option) while allowing progressively deeper evaluation when time permits.

### 2. Invest Architecture in Situation Assessment, Not Option Evaluation
The RPD model implies that computational resources should be allocated primarily to:
- Cue recognition and pattern matching against known situation prototypes
- Causal modeling of situation dynamics
- Expectancy generation (what should I see next if my current assessment is correct?)

Option evaluation, by contrast, becomes relatively simple once the situation is correctly assessed: simulate one candidate action and check whether the causal model predicts success.

### 3. Maintain an Action Queue, Not a Decision Tree
Expert decision-making is better modeled as a **prioritized queue of applicable actions** for each recognized situation type, rather than a decision tree that must be traversed to a leaf node. The queue allows immediate action (take the top option), supports graceful degradation when the top option fails (try the next), and doesn't require exhaustive evaluation.

### 4. Separate Situation Assessment Confidence from Action Confidence
The RPD model suggests these can decouple. An expert may be highly confident in their situation assessment (I know this is a Type 3 situation) but uncertain about which action will work (the top option might not fit these specific constraints). Flagging when situation assessment is uncertain (SA-Shift risk is high) versus when the action queue is sparse (no well-validated options exist for this prototype) enables more intelligent escalation decisions.

### 5. Support SA-Shift Detection
One of the most dangerous failure modes in RPD-style decision-making is failure to update situation assessment when new information contradicts the current prototype match. Agents should maintain explicit vigilance for **disconfirming cues** — information that doesn't fit the current situational model — and trigger SA-Shift evaluation when such cues accumulate beyond threshold.

---

## Boundary Conditions: When RPD Doesn't Apply

The RPD model is descriptive of expert performance in naturalistic, time-pressured domains. It is not universally appropriate:

- **Truly novel situations** with no prior prototype have no recognized typicality to prime an action queue. The expert falls back to slower, more deliberative reasoning. Agents must have a fallback path when no prototype match meets confidence threshold.
- **High-stakes irreversible decisions** with ample time may warrant deliberative comparison even for experts. The RPD model itself acknowledges that when time permits, experts sometimes do compare options — they just rarely need to.
- **Multi-stakeholder value conflicts** cannot be resolved by pattern recognition alone; explicit normative reasoning about values is appropriate.
- **Novel domains where the agent has no accumulated prototype library** — RPD requires prior experience. A freshly initialized agent without domain exposure has no pattern library and cannot operate in RPD mode.

---

## The Coup d'Oeil Connection

Klein and MacGregor invoke von Clausewitz's concept of *coup d'oeil* — "the skill of making a quick assessment of a situation and its requirements" — to anchor the RPD model historically. Military commanders who could instantly read a battlefield and act were not computing expected utilities; they were pattern-matching at expert speed.

This historical resonance matters for agent design because it suggests the RPD architecture is not a computational approximation of something better. It *is* the better architecture for naturalistic conditions. The analytical models are special cases, appropriate for structured problems with ample time — not the default that experts devolve from when pressed.