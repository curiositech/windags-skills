# Epistemic Uncertainty and Information Triage: Acting Well When You Cannot Know Enough

## The Nature of Crisis Uncertainty

When we speak of uncertainty in intelligent systems, we often reach for probabilistic frameworks — probability distributions, confidence intervals, Bayesian updates. These tools assume that uncertainty is *aleatory* — inherent randomness in the world that we can characterize statistically even if we cannot eliminate it.

The incident command research analyzed by Njå and Rake points to a different, more fundamental kind of uncertainty that dominates real crisis environments. Their characterization is precise:

**"Such quantities are uncertain and this uncertainty could be expressed by probabilities. In this sense, the risk is purely epistemic; we are uncertain because we lack sufficient knowledge."**

*Epistemic* uncertainty is uncertainty that exists in the knower, not the world. The number of victims trapped in a collapsed building is not random — it is a fixed, knowable number. But from the incident commander's position, that number is unknown because information retrieval is impossible, dangerous, or delayed. The uncertainty is a property of the *information state*, not the *world state*.

This distinction matters enormously for how systems should handle it. Aleatory uncertainty is managed by expected value calculation. Epistemic uncertainty is managed by *knowledge acquisition* — by reducing the gap between the information state and the world state.

## What Makes Crisis Information So Difficult

The paper catalogs the specific features that make information management hard in crisis environments. Each one maps directly to challenges in complex agent systems:

**Fragmentation**: Information arrives in pieces from multiple sources, each with partial coverage. No single agent at the scene has a complete picture. "The information is fragmented and ambiguous and it is difficult to form a clear picture of the situation."

**Ambiguity**: The same observable cues can be consistent with multiple situation types. Smoke from a basement can indicate a contained fire or a structurally compromised building about to collapse. Without additional cues, the reading is ambiguous.

**Source priority over content**: Under information overload, commanders tend to evaluate information by its source (known, trusted responder) rather than its content. This is cognitively efficient but epistemically dangerous — it means bad information from trusted sources gets through.

**Simultaneous overload and underload**: Crisis systems paradoxically suffer from both too much and too little information simultaneously. "Decision makers need to cope with a peculiar variety of information 'overload' and 'underload' in incoming data." The channel is flooded with low-value information while the specific high-value information needed for the critical decision is absent.

**Analogical gap-filling**: When critical information is missing, decision makers "reduce uncertainty by supplementing sparse information with analogous data and arguments." They treat past similar situations as informative about the current one. This is reasonable — and dangerous. It is reasonable because past cases are genuinely informative. It is dangerous because the current situation may differ from the analogue in precisely the ways that matter most.

**Dynamic drift**: The situation changes while information is being gathered. Information that was accurate 10 minutes ago may be misleading now. There is no stable target — the epistemic goal is a moving one.

## The Three-Layer Information Problem

Njå and Rake's analysis reveals that crisis information problems exist at three distinct layers, each requiring different management strategies:

### Layer 1: First-Order Uncertainty (What Is The Situation?)

The most immediate problem is situation assessment — determining what type of crisis this is and what the current state of the key variables actually is. This is the cue-to-recognition mapping in the RPD model. The quality of first-order information determines the quality of pattern recognition.

Agent system translation: This is the quality of the input context provided to the decision-making agent. If the upstream information gathering is poor, the decision-making agent's pattern recognition will be miscued regardless of its sophistication.

### Layer 2: Second-Order Uncertainty (What Don't I Know, and How Bad Is That?)

More sophisticated than knowing what you don't know is knowing *which of the things you don't know actually matter for the decision at hand*. A commander at a house fire doesn't know the exact gas composition in the basement, but they may not need to for the immediate tactical decision. They do need to know whether anyone is still inside.

This is triage of epistemic gaps — not all missing information is equally consequential. Effective crisis commanders know which gaps to prioritize closing and which gaps to operate through. This is a skill that cannot be formalized through a checklist; it requires understanding the causal structure of how different pieces of information feed into different decisions.

Agent system translation: Agents should maintain an explicit model of *decision-critical unknowns* — the specific information gaps whose resolution would most change the current action plan. Information gathering should be targeted at these gaps, not at generating comprehensive situational awareness.

### Layer 3: Meta-Uncertainty (How Reliable Is My Situation Assessment?)

The most difficult layer is uncertainty about the quality of the situation assessment itself. The experienced commander has a working hypothesis about what type of situation this is. But how confident should they be in that hypothesis? What evidence would falsify it?

The paper's discussion of the Piper Alpha disaster is instructive here. Flin's analysis revealed that the offshore installation managers had "significant weaknesses in their situation awareness and willingness to mitigate risk." They had a situation assessment — but it was wrong, and they weren't testing it against falsifying evidence.

Agent system translation: Every situation assessment should be tagged with a confidence level and a list of observations that would invalidate it. Agents should actively seek disconfirming evidence, not just confirming evidence. The tendency to "give priority to the source of information instead of its contents" is a meta-uncertainty failure — the agent is not questioning whether their situation model is correct.

## The Analogy Trap: When Pattern Matching Misfires

One of the most important and underappreciated warnings in this paper concerns the use of analogical reasoning under uncertainty:

**"Decision makers tend to reduce uncertainty by supplementing sparse information with analogous data and arguments. Specifically, decision makers are inclined to refer to previous crises as a reference point and a means to achieve stability in an unstable and uncertain environment."**

This is the dark side of recognition-primed decision making. The same mechanism that enables experts to make rapid, effective decisions in familiar situations — pattern matching to prior experience — can systematically mislead in genuinely novel situations by forcing novel situations into familiar categories.

The analogical trap has a specific structure:
1. Novel situation presents partial pattern match to a familiar category
2. Expert classifies the situation as familiar type X
3. Expert's mental simulation and action selection are now governed by the X-template
4. But the current situation differs from type X in the specific dimension that determines the correct response
5. The expert acts on the wrong model without realizing the mismatch

For agent systems, this is the fundamental failure mode of any pattern-matching architecture: the system will perform excellently on in-distribution cases and fail silently on out-of-distribution cases that appear superficially similar to in-distribution ones. The failure is silent because the system believes it has correctly classified the situation.

**Mitigation strategies**:
- Maintain explicit "anomaly registers" — features of the current situation that do *not* match the inferred category
- Require active reasoning about what would be different if the situation were *not* of the inferred type
- Monitor expected vs. actual outcomes and flag persistent divergence as a signal of category misclassification
- Do not allow high pattern-matching confidence to suppress KB-level scrutiny in high-stakes situations

## Information Triage in Practice: The Bryne Fire Example

Njå and Rake provide a concrete example that illustrates effective information triage in action. At the Bryne house fire:

The first officer identifies critical cues: location and extent of fire, wind direction, feasible spread. He does not try to gather all possible information — he targets the cues most relevant to the immediate tactical decision (which doors of attack, how many engines).

As the situation evolves, new critical cues emerge: the fire is not being suppressed, which suggests more resource commitment; then, a cue about potential occupants, which shifts the priority entirely. The officer doesn't wait for complete information before acting; he acts on best available information, maintains observation of outcomes, and updates his information priorities as the situation develops.

When the incident commander arrives 20 minutes later, the information triage shifts: now the critical questions are about the comprehensive situation (who is safe, what can be saved, what is the spread risk) rather than the immediate tactical questions. Different decision layer, different information requirements.

**The pattern**: Information gathering is *goal-directed*, not *comprehensive*. The question is always "what do I need to know to make the next critical decision?" not "what can I learn about this situation?"

## Implications for Agent System Architecture

### Design for Active Information Acquisition

Agents in WinDAGs should not be passive recipients of context. They should be equipped with mechanisms to request specific information from upstream agents or the environment when they detect decision-critical gaps. The architecture should support targeted information requests, not just push-based information flows.

### Distinguish Information States from World States

The system should maintain an explicit separation between what is known (information state) and what is estimated to be true (world state model). Actions are taken based on the world state model, but the world state model is always partial and potentially wrong. The gap between them — the epistemic uncertainty — should be a first-class object in the system's reasoning.

### Build Anomaly Detection Into Pattern Matching

Every pattern-match should surface the "anomaly register" — features of the current situation that don't fit the matched category. These anomalies should not be ignored; they should trigger a brief KB-level check: "Could this be a different type of situation than I've classified it as?"

### Prioritize Reducing Decision-Critical Unknowns

When information gathering resources are limited, they should be allocated to closing the gaps that most directly affect the next critical decision. This requires agents to maintain an explicit model of which unknowns are decision-critical and which can be operated through.

### Build Feedback Loops That Detect Model Failure

The paper emphasizes that experienced commanders "collect more information, collect it more systematically, establish adequate goals and evaluate the effects of their decisions." This evaluation is epistemic feedback — comparing expected outcomes to actual outcomes. Persistent divergence signals that the situation model is wrong, not that the situation is being unlucky.

Agent systems should implement this same feedback mechanism: expected outcomes from the current situation model are compared to observed outcomes, and significant divergence triggers situation reassessment rather than incremental plan adjustment.