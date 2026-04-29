# Propensity, Reversibility, and Covariation: The Three Lenses of Causal Attribution

## Overview

Klein and Hoffman identify three primary criteria — drawn from Hume but refined through naturalistic observation — that human reasoners use to evaluate whether something counts as a cause. These are:

1. **Propensity**: Could this plausibly lead to that effect? Is there a mechanism?
2. **Reversibility (Mutability)**: Would the effect disappear if the cause were removed?
3. **Covariation**: Do cause and effect reliably travel together statistically?

These are not three steps in a sequence. They are three independent lenses that can be applied simultaneously, and they can disagree with each other. A candidate cause might satisfy covariation (statistically correlated) but fail propensity (no plausible mechanism). A cause might satisfy propensity (clear mechanism) but fail reversibility (removing it doesn't change the outcome because another cause would take its place). Understanding when each criterion applies, when they conflict, and how context changes their verdicts is essential for building agents that reason about causality as robustly as expert humans do.

---

## Criterion 1: Propensity — "Could This Plausibly Lead to That?"

Propensity is the intuitive check: given what we know about how the world works, is it conceivable that A would produce B? Klein and Hoffman describe it as similar to Hume's "necessary connection" — not that the connection is logically necessary, but that it is *mechanistically plausible*.

**The mosquito-malaria example**: A century ago, researchers suggested mosquitoes caused malaria and yellow fever. They were ridiculed because "no one could see how tiny mosquitoes could contain enough venom to sicken and kill grown men." The propensity criterion *failed* — there was no plausible mechanism. It was only after viruses were identified that the mosquito link became propensitively credible. The statistical covariation was always there; the propensity became available only when the mechanistic understanding arrived.

**Critical implication**: Propensity is *theory-dependent*. What counts as a plausible mechanism depends on what theories and models the reasoner has available. An agent with a richer domain model will find more causes propensitively plausible. An agent with a limited or incorrect domain model will reject real causes because it cannot see the mechanism.

**The chain-length rule**: Klein and Hoffman note that "the strength of the cause will depend on the links between it and the effect. The more links, the less plausible. The strength is generally no greater than the weakest plausible link in the chain." This is a quantitative claim embedded in the propensity criterion: long causal chains are inherently less credible than short ones, because each link introduces uncertainty. An agent constructing causal chains should explicitly track chain length and flag long chains as requiring additional evidence.

**For agent systems**: Propensity checks require the agent to have (or query) a domain model. When an agent nominates a candidate cause, it should immediately ask: "What is the mechanism by which this cause would produce this effect? How many steps does the mechanism require? What is the weakest link in the chain?" If the mechanism cannot be specified, the cause should be flagged as covariation-only (suggestive but not confirmed).

---

## Criterion 2: Reversibility — "Would the Effect Disappear If We Removed This Cause?"

Reversibility (which the literature often calls "mutability") is the counterfactual test: imagine the cause had not happened — would the effect still have occurred? If yes, the proposed cause is not doing causal work. If no, it is genuinely causally relevant.

**The basketball example**: Klein and Hoffman use the image of a last-second three-point shot winning a game. It is easy to imagine the shot missing; if it had missed, the game would have ended differently. The shot is reversible, therefore causally credible. By contrast, a free throw made mid-game would not receive the same causal attribution — it could easily be "replaced" by any other play.

**The enabling condition distinction**: Reversibility allows us to distinguish *causes* from *enabling conditions*. When a match held under paper causes it to burn, the oxygen in the room is an enabling condition, not a cause. We cannot easily imagine the room being void of oxygen; we can easily imagine the match not being held to the paper. The match is more reversible, therefore it is the cause. Enabling conditions are necessary but not *causally salient*.

This is one of the most powerful distinctions in the entire paper. In complex system analysis, the vast majority of identified "causes" are actually enabling conditions — necessary background states that, if absent, would have prevented the failure, but that are not *the* cause in any action-relevant sense. An organization that blames a system failure on "lack of redundancy" (an enabling condition) rather than on the specific architectural decision that created the fragility (the reversible event) has mislocated the cause and will likely implement wrong-headed solutions.

**Time lag complexity**: Klein and Hoffman note that reversibility is cleaner for close-in-time causes. "A cause is identified by tracing back from the effect to the nearest plausible candidate in the causal chain." But greater time lags permit "intervening factors to tangle up the assessment." Dörner's research on microworld tasks shows that participants struggle to understand causal connections when time delays increase — not just because of memory limitations, but because intervening events cloud the picture.

**The person-responsibility application**: "The person responsible is the one whose actions cannot be reversed by anyone else." This is a fascinatingly precise definition. It implies that causal responsibility is not about who was "most involved" or "who was there" but about whose action was irreplaceable — the one that, if undone, would have changed the outcome, and that no one else could have undone on their behalf.

**For agent systems**: Reversibility checks should be a standard component of any causal analysis protocol. For each candidate cause, the agent should explicitly construct the counterfactual: "If this cause had not occurred (or had occurred differently), what would have happened?" This can be implemented as a simple intervention simulation: "Remove cause X from the causal model; what does the model predict for the outcome?" Causes that do not change the predicted outcome should be reclassified as enabling conditions.

Critically, agents should track the *distance* between cause and effect in the causal chain. Close-in-time, easily reversible causes should receive high credibility. Distal causes should receive lower default credibility and require more evidence.

---

## Criterion 3: Covariation — "Do These Travel Together?"

Covariation is the statistical criterion: when the cause is present, is the effect also present? When the cause is absent, is the effect also absent? This is the empirical foundation of causal reasoning — you do not need to understand the mechanism (propensity) or to run a thought experiment (reversibility) if you have enough observations showing reliable co-occurrence.

**The yellow fever example**: Even before anyone understood how mosquitoes transmitted yellow fever, the persistent covariation between mosquito populations and yellow fever cases was strong enough to motivate eradication campaigns that worked. The propensity story (how tiny mosquitoes could cause disease) was unavailable; the covariation signal was strong enough to act on.

**The critical misconception**: "Correlation does not imply causality." Klein and Hoffman address this directly and find the statement misleading: "Correlation as a suite of mathematical techniques was invented precisely to enable the exploration of causal relations or potential ones... Correlation certainly suggests causality, but it does not require a conclusion of causality." The confusion comes from conflating "implies" as "suggests" versus "requires." Correlation *suggests* causation — strongly, systematically, and usefully. It does not *prove* causation. But neither does it prove nothing.

"Sharp observers use coincidence to speculate about causality. The coincidence of prevalence/absence of mosquitoes and presence/absence of Yellow Fever helped control and then understand the disease." Covariation is not a weak or fallacious form of causal reasoning — it is the empirical raw material from which causal understanding is built.

**For agent systems**: Agents should actively seek covariation signals as a legitimate and powerful input to causal analysis. This means:
- Tracking co-occurrence patterns across events and outcomes
- Treating strong covariation as a prompt for propensity investigation ("we see these always travel together — what is the mechanism?")
- Not dismissing covariation-based hypotheses simply because the mechanism is not yet understood
- Flagging covariation-only causes as requiring propensity investigation before action is taken

The appropriate epistemic status of a covariation-only cause is: *this is a credible candidate cause requiring mechanistic investigation; do not act on it as confirmed until propensity is established, but do not ignore it either.*

---

## How Context Changes the Verdict: The Watch Factory Case

Klein and Hoffman describe Einhorn and Hogarth's watch-factory example, which is worth quoting at length because it so cleanly illustrates how context inverts causal attributions:

*If we see a hammer strike and shatter a watch crystal, we would say that the hammer was the cause of the crystal's destruction. But if the observation took place in a watch factory where the hammer was used to test the crystals, and this was the only crystal that shattered, we would now say that the crystal must have been flawed. But if the test hammer shattered crystal after crystal, we might speculate that perhaps the hammer force was set too high.*

Same physical event (hammer + crystal → shattering), three different contexts, three different causal attributions. The change in attribution is not irrational — it is appropriate updating based on information about the base rate of the effect (how often do crystals shatter in this context?) and the presence of alternative explanations (is the hammer or the crystal more variable?).

This has a direct and important implication for agent systems: **causal attribution is not a function of the event alone. It is a function of event + context + base rates + alternative explanations.** An agent that assigns causes without modeling context will produce systematically wrong attributions.

Specifically, agents should ask:
- What is the base rate of this effect in this context? (High base rate → look for structural/condition causes; low base rate → look for unusual events)
- What is the most variable element in this situation? (The most variable element is the most likely cause — this is essentially the method of differences)
- What alternative explanations exist that could account for the same effect?

---

## Criteria in Conflict: What to Do When They Disagree

The three criteria can and frequently do disagree. Agents must be able to handle disagreement between criteria, not just apply them in isolation.

**High covariation, low propensity**: The mosquito-malaria case. This pattern suggests a real but mechanistically obscure cause. Appropriate action: treat as a strong causal candidate, invest in propensity investigation (mechanism research), act on the covariation signal if action is urgent and safe (eradicate mosquitoes even without understanding why).

**High propensity, low covariation**: We have a clear mechanism story, but the proposed cause doesn't reliably produce the effect. This suggests the mechanism is correct but the cause is not sufficient on its own — other enabling conditions must also be present. Appropriate action: search for the enabling conditions that are required alongside this cause.

**High reversibility, low propensity**: The cause is easy to remove counterfactually, and the effect seems to track it, but there's no clear mechanism. This is the "last-second shot wins the game" situation — the correlation with the specific moment is high, but the mechanism is just "basketball." Appropriate action: use as a candidate cause for event-type explanations, but investigate whether structural factors (team skill, prior plays) are the real cause with the event just being the observable trigger.

**All three high**: Strong causal candidate. This is the closest to confirmed causation in naturalistic settings.

**All three low**: Not a cause. Remove from consideration.

---

## Summary Decision Protocol

For each candidate cause C of effect E, an agent should apply:

1. **Propensity check**: What is the proposed mechanism from C to E? How many steps? What is the weakest link? Score: strong / moderate / weak / none

2. **Reversibility check**: If C had not occurred, would E still have occurred? Is C reversible (could it have gone differently)? Who or what was in a position to prevent C? Score: high / moderate / low

3. **Context calibration**: What is the base rate of E in this context? What is the most variable element? What alternative causes exist? How does this context change the above scores?

4. **Covariation check**: Is there statistical evidence of C reliably co-occurring with E? Is this from direct observation, known patterns, or inference? Score: strong / moderate / weak / none

5. **Criteria synthesis**:
   - All three strong → confirmed cause candidate (subject to alternative cause competition)
   - Covariation strong, propensity weak → credible candidate, mechanism investigation required
   - Propensity strong, covariation weak → possible cause, look for missing enabling conditions
   - Reversibility high, others weak → event-type cause candidate, check for structural alternatives
   - Enabling condition flag: if removing C would prevent E but C is not easily imaginable as absent, classify as enabling condition rather than cause

6. **Output**: Labeled cause candidate with criteria scores, enabling condition flags, chain length, and confidence level