# Three Criteria for Causal Attribution in Uncertain Domains

## Introduction: Why Formal Criteria Are Not Enough

Classical epistemology offers rigorous criteria for establishing causal relationships: controlled experiments, statistical significance, replication. These criteria are powerful in scientific settings. They are nearly useless in the settings where most agents must operate: indeterminate problems, no controlled conditions, complex interacting factors, time pressure, and decisions that must be made before certainty is achievable.

Klein and Hoffman identify three primary criteria that people *actually* use to assess whether something counts as a cause: **propensity, reversibility, and covariation**. These are not substitutes for scientific rigor — they are the practical tools that allow reasoning to proceed when rigor is unavailable. Understanding these criteria — their power, their limits, and their interactions — is essential for any agent that must perform causal attribution in the real world.

---

## Criterion 1: Propensity (Plausibility of the Causal Link)

**Definition:** The proposed cause must plausibly lead to the effect. There must be some mechanism — even if not fully understood — by which the cause could produce the outcome. "The strength of the cause will depend on the links between it and the effect. The more links, the less plausible. The strength is generally no greater than the weakest plausible link in the chain."

**The mosquito example:** A hundred years ago, researchers proposed that mosquitoes caused malaria and Yellow Fever. They were "ridiculed because no one could see how tiny mosquitoes could contain enough venom to sicken and kill grown men. It was not until viruses were identified that the mosquito link was understood." The causal relationship was real, but the propensity criterion could not be satisfied until the mechanism (viral transmission) was available.

**Implication:** Propensity is *mechanism-dependent*. As our understanding of mechanisms improves, previously implausible causal links become plausible, and previously plausible links may become implausible. An agent's causal attributions are limited by its mechanism library — its repertoire of understood causal pathways.

**For agent systems:**
- An agent with a richer mechanism library will recognize more plausible causal chains
- When no mechanism is available, propensity fails even for true causes — this is a systematic blind spot
- Multi-agent systems can distribute mechanism knowledge: a security agent may know attack vectors that a performance agent does not; their combined propensity assessments will be richer than either alone
- Propensity should be tracked as a probability, not a binary — and the agent should know *which link* in the chain is weakest, because that's where the explanation is most vulnerable

---

## Criterion 2: Reversibility (Mutability / Counterfactual Testability)

**Definition:** The effect should disappear if the putative cause is removed. Equivalently: can we imagine the cause NOT occurring, and does the effect then also not occur? This is Kahneman and Varey's "counterfactual reasoning" — the proposed cause is strong insofar as the counterfactual world (without the cause) leads to a clearly different outcome.

**The close counterfactual effect:** "A cause is identified by tracing back from the effect to the nearest plausible candidate in the causal chain." Events close in time to the effect are easier to mentally reverse, making them cognitively salient as causes even when they may not be the most structurally important factor. This is why the last-second basketball shot dominates sports causal accounts — not because it was the only cause, but because it is the most mentally reversible.

**Enabling conditions vs. causes:** The reversibility criterion allows us to distinguish causes from enabling conditions. "If someone lights a match and holds it under a piece of paper and the paper begins to burn, we would say that the match caused the burning. We would not say that the oxygen in the room caused the burning. Oxygen is necessary for the paper to burn but it is an enabling condition. We can more readily imagine that the match was not held under the paper than the room was void of oxygen."

**The time-lag complication:** "Time lags between cause and effect create an additional layer of complication... not simply because of the time but because of intervening events that cloud the picture." Dörner (1996) showed that participants in microworld tasks struggle to identify causal connections as time delay increases. Long-lag causes (decades of deregulation → financial crisis; years of smoking → cancer) are systematically under-attributed because the counterfactual is hard to construct over long time horizons.

**For agent systems:**
- Reversibility is the criterion most susceptible to **recency bias**: recent causes are cognitively easier to reverse, so they dominate explanations even when structural causes are more important
- An agent should explicitly test the time lag between proposed cause and effect, and adjust confidence accordingly
- For long-lag causes, the reversibility criterion may need to be replaced or supplemented by propensity (mechanism) reasoning
- "Who is responsible?" questions are often answered by reversibility: "The person responsible is the one whose actions cannot be reversed by anyone else." This has implications for attribution and accountability in multi-agent systems — the agent whose action was last and least reversible will tend to receive disproportionate blame, even if earlier decisions created the conditions for failure

---

## Criterion 3: Covariation (Statistical Co-occurrence)

**Definition:** The cause and effect should co-occur systematically — the cause is present when the effect is present, and absent when the effect is absent. This is the empirical basis of causal inference: "the observed coincidence of causes and effects... discovered through statistical regularities rather than propensity or reversibility."

**The misunderstood maxim:** Klein and Hoffman challenge the widely repeated claim that "correlation does not imply causality." They argue: "But of course it does; it was designed to. Correlation as a suite of mathematical techniques was invented precisely to enable the exploration of causal relations or potential ones. Correlation is a major cue to causality... Correlation certainly suggests causality, but it does not require a conclusion of causality."

The source of confusion is the word "implies" — it can mean "suggests" or "requires." Correlation *suggests* causality and initiates investigation. It does not *prove* causality. But to treat correlation as if it has no causal relevance is to throw away a powerful inferential tool.

**The Yellow Fever case:** "The persistence of medical authorities in Havana and then in Panama in trying to eradicate Yellow Fever by controlling the mosquito population was due to the strength of the relationship between the two, even in the absence of a plausible causal story." Covariation drove action even before propensity could be established. The action was correct. The propensity came later.

**For agent systems:**
- Covariation is the most computationally tractable criterion — it can be estimated from data without understanding mechanisms
- It is also the most misleading in isolation — confounders, selection effects, and spurious correlations abound
- The ideal diagnostic agent uses covariation to generate candidate causes, propensity to filter implausible ones, and reversibility to prioritize among plausible ones
- In high-stakes decisions with strong covariation but weak propensity, the appropriate response is to act on the covariation while simultaneously investing in mechanism discovery — not to wait for propensity before acting (the Yellow Fever lesson)
- When propensity and covariation conflict (strong mechanism suggests X causes Y, but empirical covariation is weak), this is a signal of confounding or of a complex, conditional relationship — not a reason to dismiss either criterion

---

## How the Three Criteria Interact

The three criteria are not independent — they interact in ways that matter for causal attribution:

**Covariation without Propensity:** You observe that A and B co-occur but have no mechanism. This can justify action (Yellow Fever mosquito control) but not explanation. You should act, but remain open to discovering that A and B are both caused by C.

**Propensity without Covariation:** You have a plausible mechanism but the correlation is weak or absent. This is a strong signal that the mechanism is operating under conditions you haven't controlled for, or that the causal effect is real but small relative to noise. Don't dismiss the cause — investigate why the covariation is weaker than the mechanism predicts.

**Reversibility without Propensity or Covariation:** The most common case in sports — the last-second shot is reversible (easy to imagine missing) but its "propensity" contribution is minimal (any single shot contributes a small amount to the game) and its covariation is low (the team that makes the last shot doesn't always win). Reversibility alone makes it feel like *the* cause. This is a systematic bias, not a valid causal inference.

**Context modulates all three:** As Klein and Hoffman note via the Einhorn and Hogarth watch crystal example — the same observation (hammer strikes crystal, crystal shatters) yields different causal attributions depending on context. In a factory where this is routine, the crystal is flawed. In a context where this never happens, the hammer force is too high. Context is not external to causal reasoning; it is constitutive of which criterion gets activated and how.

---

## The Practical Decision Rule

For an agent performing causal attribution, the following priority structure is suggested:

1. **Screen for propensity first**: If no plausible mechanism exists, the proposed cause requires extraordinary evidence. Mark it as low-confidence and continue investigation.

2. **Use covariation to generate candidates**: Statistical patterns are cheap to compute and powerful for generating hypotheses. Treat strong covariation as a reason to investigate, not as a conclusion.

3. **Use reversibility to prioritize among candidates**: Among plausible, covarying causes, the most reversible (closest in time, most easily imagined away) will feel most causally significant. Adjust: if the most reversible cause is a precipitating event with a long chain of enabling conditions behind it, the conditions may be more important for prevention even if the event is more salient for accountability.

4. **Beware time-lag blindness**: Systematically ask whether there are causes with long time lags that covariation (short-window) and reversibility (recency-biased) are both failing to surface.

5. **Use context to calibrate**: The same three criteria operate differently in different domains. An agent should maintain domain-specific priors about which criterion is most reliable in this type of problem.