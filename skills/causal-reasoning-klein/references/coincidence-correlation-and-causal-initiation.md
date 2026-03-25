# Coincidence as Causal Evidence: Rehabilitating Correlation as an Investigative Tool

## The Maligned Maxim

Few principles are more often repeated in scientific and statistical training than "correlation does not imply causality." It is invoked as a warning against naive inference, as a reminder that confounding variables exist, as a corrective to the human tendency to see pattern and meaning in random co-occurrence. The maxim is so universally repeated that it has become a kind of cognitive reflex — a first response to any claim based on observed co-occurrence.

Klein and Hoffman challenge this reflex directly and persuasively. Their challenge is not a defense of naive causal inference — it is a defense of correlation's proper role in causal reasoning, which is to *initiate* investigation, not *terminate* it.

Their argument: "Correlation does not imply causality. But of course it does; it was designed to. Correlation as a suite of mathematical techniques was invented precisely to enable the exploration of causal relations or potential ones. Correlation is a major cue to causality. Even in scientific investigations, correlation is required in order for causation to be proved. The source of confusion here is the term 'implies' which can mean 'suggests' or 'requires.' Correlation certainly *suggests* causality, but it does not *require* a conclusion of causality."

This is a linguistic and logical clarification with major practical consequences. If correlation *suggests* causality, then strong correlation is a reason to investigate. If you reflexively suppress that suggestion ("correlation doesn't imply causality, therefore I should not update toward a causal hypothesis"), you are throwing away a powerful evidential signal.

---

## The Yellow Fever Case: Acting on Correlation Without Mechanism

The paradigm example for this teaching is the control of Yellow Fever. Medical authorities in Havana and Panama observed a strong correlation between mosquito presence/absence and Yellow Fever prevalence/absence. They had no mechanism — no propensity account of how mosquitoes could transmit disease. But the correlation was strong enough that they acted: they controlled the mosquito population and the disease came under control.

They were right. And they were right to act on correlation alone, even without mechanism, because:
1. The correlation was strong (high covariation)
2. The intervention was testable (control mosquitoes, observe effect)
3. The cost of inaction (continued disease and death) was high
4. The mechanism question ("how does this work?") was distinct from the action question ("should we try this?")

Waiting for a propensity account before acting would have been epistemically cautious and pragmatically catastrophic. The correlation was sufficient to justify action. The mechanism came later and confirmed the action's basis — but the action didn't need to wait.

**The general principle:** In high-stakes, time-pressured, or difficult-to-experiment-in domains, acting on strong covariation with unknown mechanism is often the right decision. The Yellow Fever case is not an anomaly; it is a model. Many of the most important interventions in medicine, public health, and engineering have been initiated by observed covariation before the mechanism was understood.

---

## How People Actually Notice Coincidences

Klein and Hoffman observe: "People do not mentally calculate correlations, but rather are apprehending co-occurrences and covariations. Sharp observers use coincidence to speculate about causality."

This is a description of naturalistic causal initiation: people notice that two things tend to go together — not through explicit statistical calculation but through the accumulation of co-occurrences that generate a sense of pattern. A doctor sees several patients with an unusual symptom cluster. A security analyst notices that a certain attack pattern precedes certain system behaviors. A supply chain manager observes that delivery delays tend to cluster around certain vendor decisions.

These are not formal correlations — they are *noticed coincidences*. They have the character of a hypothesis: "Hmm, these things seem to go together. Is that real? If so, what does it mean?"

The appropriate response to a noticed coincidence is not:
- "Correlation doesn't imply causality, ignore it."

Nor is it:
- "Correlation implies causality, conclude the cause has been found."

It is:
- "This coincidence initiates investigation. Test the covariation more carefully. Generate candidate mechanisms. Apply the full three-criterion framework (propensity, reversibility, covariation)."

---

## Correlations as Causal Hypotheses, Not Causal Conclusions

The key insight is that observed correlations are not causal conclusions — they are causal *hypotheses* that deserve further investigation. A strong correlation is strong evidence that one of the following is true:
1. A causes B
2. B causes A
3. C causes both A and B
4. A and B co-occur for complex systemic reasons involving many factors

All four of these are causal hypotheses worth investigating. None of them is the conclusion that "correlation doesn't imply causality, therefore there's nothing to investigate here."

The question "what causes this correlation?" is itself a valuable and often productive question. And the answer is almost always some causal story, even if it's more complex than the naive "A causes B."

---

## Implications for Agent Systems

### 1. Correlation as Causal Signal, Not Noise

An agent performing diagnostic reasoning should treat strong observed correlations as high-priority causal hypotheses deserving investigation. The appropriate pipeline is: