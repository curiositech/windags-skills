# Failure Modes in Expert Decision-Making: What Can Go Wrong and Why

## Overview

Klein and MacGregor's work is primarily constructive — they are building a model of how expert decision-making works, not cataloguing its failures. But the structure of the Recognition-Primed Decision model and the Critical Decision Method reveals, by implication and by direct acknowledgment, a set of systematic failure modes that are specific to expert naturalistic decision-making. These failure modes are distinct from the biases documented in behavioral decision theory laboratory research, and they are highly relevant to the design of agent systems that must perform reliably under uncertainty.

---

## Failure Mode 1: Prototype Misclassification

**What it is**: The expert's pattern-matching process confidently identifies the situation as an instance of prototype X when it is actually an instance of prototype Y. All subsequent situation assessment, expectation formation, and option selection is calibrated for the wrong situation type.

**Why it happens**: The pattern-matching process is fast, parallel, and largely preconscious. It is triggered by the features most salient in the initial observation. If the current situation shares many surface features with prototype X but differs on the causally critical features that distinguish it from prototype Y, the initial classification will be X — and may remain X even as contradicting evidence accumulates, because confirmatory cues are being selectively attended to.

**Klein and MacGregor's example**: The representativeness heuristic at work — "a battle commander might be fooled into reacting wrongly because the enemy presents to him a subset of activities that are like those that appeared previously when the enemy took certain actions. The commander ignores the other actions these activities might also indicate; basing his reaction solely upon a single previous event and a limited subset of the possible indications."

**Agent system implication**: Prototype classification should carry explicit confidence scores based on the *discriminating* features of the matched prototype — not just on the number of shared features. Features that are common to multiple prototypes are weak evidence; features that are distinctive to one prototype are strong evidence. The classifier should weight diagnostic discriminability, not raw similarity count.

**Detection mechanism**: Expectation monitoring. If the currently matched prototype predicts feature F at time T, and F does not appear, this is disconfirming evidence. Accumulating disconfirmation should trigger prototype reassessment.

---

## Failure Mode 2: SA-Shift Failure (Failure to Update)

**What it is**: New information arrives that genuinely indicates a need to revise the current situational model, but the revision does not occur. The decision-maker continues acting on an outdated or incorrect situation assessment.

**Why it happens**: The prototype match creates a strong prior. New information that contradicts the prior is expensive to process — it requires not just updating a fact but potentially reconstructing the entire situational model. Under time pressure, this reconstruction may be deferred or avoided. The expert may reinterpret contradicting evidence as consistent with the current model rather than triggering a shift.

**Klein and MacGregor's framework**: The SAR structure makes this failure explicit. Each SA-Elaboration is low-risk (it deepens the existing model). Each SA-Shift is high-risk (it requires abandoning the existing model and constructing a new one). The failure mode is treating an SA-Shift signal as an SA-Elaboration signal — updating a detail rather than revising the overall model.

**The tanker incident example**: When the storm sewer explodes, Chief McW correctly recognizes this as an SA-Shift — a new component of the situation that requires a new response thread — rather than treating it as an elaboration of the tanker situation. An expert who failed to make this distinction might have attempted to manage the sewer fire with the same resources as the tanker, leading to both being inadequately addressed.

**Agent system implication**: Implement explicit SA-Shift detection logic. Define, for each active situational model, the evidence patterns that would require a model revision (not just an update). Monitor specifically for these patterns. When they appear, trigger a full reassessment rather than a local update.

---

## Failure Mode 3: Action Queue Exhaustion

**What it is**: The expert works serially through the action queue for the currently recognized prototype, rejecting each option via mental simulation, until no further options are available. The situation requires action, but no validated option exists.

**Why it happens**: The prototype match determines the action queue. If the prototype is correct but the specific situation has unusual constraints that make all standard responses infeasible, the expert has no pre-loaded alternatives. This is the edge of the expert's experience — where accumulated case knowledge does not cover the current situation.

**Klein and MacGregor's framework**: The serial RPD model (A-3) describes this path explicitly — the favored option is implemented, modified, or rejected for the next. But the model assumes the queue is non-empty. When the queue is exhausted, the expert is forced into a mode for which the RPD model provides no guidance.

**Agent system implication**: Agents should track action queue depth explicitly. As options are exhausted, uncertainty should increase and escalation thresholds should decrease. An empty action queue (no validated option remains for the current prototype) is a critical failure condition that should trigger immediate escalation or request for human oversight.

---

## Failure Mode 4: The Articulation Gap (Introspective Error)

**What it is**: The expert's verbal account of their decision process does not accurately reflect the cognitive processes that actually produced the decision. This matters both for training system design (the system learns from incorrect self-reports) and for post-hoc accountability (the expert cannot explain a good decision in terms that transfer to others).

**Why it happens**: Nisbett and Wilson's work (cited by Klein and MacGregor) establishes that people "tell more than they can know" about their mental processes. The actual basis for expert decisions involves perceptual pattern recognition and automatic processes that are not available to verbal introspection. The expert constructs a plausible post-hoc explanation that fits their understanding of how decisions *should* be made, not how this one *was* made.

**Klein and MacGregor's concern**: This is precisely why the CDM is structured as it is — to probe *incidents* with specific cues, rather than asking for principles. The incident context partially bypasses the introspective error by anchoring the discussion in concrete sensory detail: "what did the smoke look like?" is harder to confabulate than "how do you read smoke?"

**Agent system implication**: When training agents on expert behavior, prefer behavioral evidence (what the expert did, in response to what cues, with what outcome) over verbal explanations (what the expert says they do and why). The behavioral record is more reliable. When verbal explanation is the only source available, treat it as hypothesis-generating rather than ground-truth.

---

## Failure Mode 5: Availability Bias in Case Library Construction

**What it is**: The case library that an expert's pattern-matching draws on is not representative of the population of situations the expert will face. Vivid, salient, and recent cases are over-represented; base-rate typical cases are under-represented; edge cases that the expert has never encountered are completely absent.

**Why it happens**: "What one retrieves from memory can be biased by temporal factors associated with storage and ease of recall. The latter has been termed an 'availability' bias in the memory for events (Tversky & Kahneman, 1973), a tendency for memory to be influenced by factors such as vividness, salience, and recency."

**Implication for knowledge base construction**: If a knowledge base is built by asking experts to recall cases, the resulting case library will inherit the availability bias of expert memory. Cases that are important precisely because they are common but unremarkable will be underrepresented. Cases that are vivid and memorable but rare will be overrepresented.

**Agent system implication**: Knowledge base construction should not rely solely on expert-selected cases. It should be supplemented with:
- Systematic sampling from known case populations (not just memorable ones)
- Deliberate inclusion of base-rate typical cases that experts find too routine to mention
- Adversarial construction of edge cases that the expert has never encountered but that lie within the problem domain

---

## Failure Mode 6: Overconfidence in Incomplete Situation Assessment

**What it is**: The expert achieves a good prototype match on the information available and proceeds with high confidence, without recognizing that critical information is missing. The situation assessment feels complete when it is not.

**Klein and MacGregor**: Reference Fischhoff, Slovic, and Lichtenstein (1978): "people are typically very poor at gauging the degree to which a structure they have been given to assist them in remembering components of a problem is a complete structure, and may actually judge it to be more complete than it actually is."

**Agent system implication**: Agents should maintain explicit awareness of **information they expected to receive and have not yet received**. A situation assessment that has received no disconfirming evidence is not thereby confirmed — it may simply be that the disconfirming evidence has not arrived yet. Expected-but-not-received information should count as active uncertainty, not as absence of uncertainty.

---

## Failure Mode 7: Time Pressure Induced Premature Closure

**What it is**: Under severe time pressure, the expert implements the first viable option (the top of the action queue) without allowing time for even the minimal mental simulation that constitutes verified RPD. The option may be adequate but not the best available, or may be feasible in normal conditions but fail given unnoticed constraints.

**Klein and MacGregor's framework**: The three levels of RPD (Automatic, Verified, Serial) represent increasing time costs. Time pressure pushes the system toward Automatic RPD — direct implementation of the top option without mental simulation. When the top option happens to be wrong, there is no error-catching mechanism.

**Agent system implication**: Under simulated time pressure, agents should implement explicit minimum verification requirements before committing to irreversible actions. A one-step mental simulation (does this action make sense given what I know about the current situation?) should be mandatory even under maximum time pressure. The cost of a brief verification step is almost always less than the cost of a failed irreversible action.

---

## The Common Thread

All of these failure modes share a common structure: they are failures of the **situation assessment phase**, not the **option evaluation phase**. The RPD model produces good decisions when the situation assessment is correct. When situation assessment fails — through misclassification, failure to update, incomplete information, or overconfidence — the subsequent action selection is building on a broken foundation.

This reinforces the core design principle: **invest in situation assessment robustness above all other aspects of the decision architecture**. Failure-resistant expert decision-making is failure-resistant situation assessment.