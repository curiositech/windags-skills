# Achieving Closure: How Decision-Makers Know When Explanation Is Enough

## The Stopping Problem

Every intelligent system that performs causal reasoning faces a fundamental challenge that has no clean solution: when is the explanation complete enough to act on? This is the **stopping problem** in causal reasoning, and it is a problem that philosophers and scientists have largely avoided by adopting their own stopping criteria (logical necessity, statistical significance, peer review). Decision-makers in real organizations cannot use these criteria — they operate under time pressure, incomplete information, and the constant need to commit to action.

Klein and Hoffman identify this stopping problem as one of the defining features of naturalistic causal reasoning: "Managers have to stop at a certain point and make decisions." And: "We will investigate how decision makers simplify the causal stories they formulate, and how they determine whether an account is plausible and sufficient."

This document explores what "plausible and sufficient" means for decision-making agents, what factors govern when closure is appropriate, and how agent systems can implement principled stopping rules that are neither too early (acting on insufficient understanding) nor too late (over-analyzing while the window for action closes).

---

## Why Scientific Stopping Criteria Fail in Practice

Scientific stopping criteria include:
- Statistical significance at p < 0.05 (or better)
- Effect size large enough to be meaningful
- Replication across independent studies
- Mechanism understood at multiple levels
- No plausible alternative explanations

Each of these requires time, data, and conditions that real-world decision-makers don't have. More importantly, they are designed to support *knowledge claims* ("this causal relationship is real"), not *action decisions* ("I should do this now"). The action question requires different stopping criteria than the knowledge question.

A physician doesn't need to know the molecular mechanism of a drug to prescribe it if the clinical trial evidence is sufficient. A military commander doesn't need to establish causal certainty about why the enemy is moving before deciding to respond. A manager doesn't need a complete causal story about why a project is failing before intervening.

Klein and Hoffman note that for the decision-maker, "Scientists are driven by curiosity and are always looking for deeper explanations and further mysteries, whereas managers have to stop at a certain point and make decisions." The key word is "have to." This is not intellectual weakness — it is a pragmatic necessity driven by the time cost of action and the opportunity cost of inaction.

---

## The Concept of "Plausible and Sufficient"

Klein and Hoffman's Phase 2 research question is: "how decision makers determine whether an account is plausible and sufficient." Unpacking this:

**Plausible:** The causal account is consistent with available evidence and violates no strong prior knowledge. Each causal link in the story has a reasonable mechanism. The explanation could be true.

**Sufficient:** The causal account contains enough information to support the decision at hand. It doesn't need to be complete — it needs to be complete *for this purpose*.

These two criteria together define a pragmatic stopping point. An agent should stop constructing its causal explanation when:
1. The account is internally consistent and externally compatible with available evidence (plausible)
2. The account supports the specific decision being made without requiring additional causal depth (sufficient)

Crucially, sufficiency is decision-relative. The same underlying causal situation may require:
- A 30-second explanation for a time-pressured battlefield decision
- A 3-page explanation for a board-level strategic decision
- A 30-page explanation for a post-mortem investigation aimed at prevention

The agent should know what decision it is supporting and calibrate its explanation depth accordingly.

---

## Factors That Govern Appropriate Closure Points

### 1. Decision Stakes
High-stakes, irreversible decisions require more complete explanations before closure. Low-stakes or reversible decisions can tolerate higher uncertainty. An agent should assess:
- "How costly is acting on a wrong causal explanation here?"
- "Can the action be reversed if the causal account turns out to be wrong?"

If the answer to the first is "catastrophic" and the second is "no," the stopping threshold should be high. If the action is low-cost and reversible, early closure is appropriate.

### 2. Time Pressure
Klein and Hoffman specifically note that decision-makers face time pressure that scientists don't. Under extreme time pressure, even a list or event explanation may be sufficient for immediate action. The time cost of generating a complete story explanation must be weighed against the opportunity cost of delayed action.

**Agent implication:** Explanation quality and explanation timeliness are in tension. An agent system should allow callers to specify time constraints, and the explanation-generating agent should know how to produce explanations of appropriate quality within those constraints — a short event explanation now, with a richer story explanation to follow.

### 3. Reversibility of the Action
If the action being contemplated is reversible, lower-confidence causal accounts can support action. "Try this and see if it fixes the problem" is a valid strategy when the action is cheap and reversible. If the action is irreversible (a major surgery, a strategic military commitment, a large financial bet), the causal account must be more complete before action.

### 4. Asymmetry of Error Costs
In some situations, the cost of acting on a false causal account (treating a patient for the wrong disease) is much higher than the cost of not acting. In others, the cost of inaction (not treating a deadly infection) is much higher than the cost of acting on an imperfect account. The asymmetry of error costs should calibrate when closure is appropriate.

### 5. Availability of Alternative Investigation Paths
If the investigation can be continued during or after the initial action (try the intervention, monitor for effects, update the causal account), then earlier closure is appropriate — the action itself becomes part of the investigation. Klein and Hoffman note in their planned Phase 2 research: "We suspect that decision makers learn by action as much as by analysis—they take some actions in order to see how the situation changes."

This is action-as-inquiry: using interventions as probes of the causal structure. It requires:
- Interventions that are informative (if my causal account is right, this action should produce these specific observable effects)
- Monitoring systems that detect those effects
- Update mechanisms that revise the causal account based on the intervention's results

---

## The Spiral Problem: Preventing Infinite Regress

One specific challenge Klein and Hoffman identify for Phase 2 is "how decision makers achieve closure in their causal explanations... and prevent themselves from a never ending spiral into further depth." This is the infinite regress problem: every cause has a prior cause, every explanation can be deepened, every story can be extended backward.

The spiral is prevented, in practice, by several mechanisms:

**Pragmatic Anchoring:** Stop when the depth of causal explanation no longer changes the decision. If knowing whether the Federal Reserve's rate decision was caused by the dot-com bubble or by 9/11 fears doesn't change the current policy recommendation, that depth isn't needed.

**Domain Conventions:** Each domain has conventional starting points for causal stories. "The Fed's rate decisions" is a conventional starting point for explaining the mortgage crisis; investigating the political pressures on the Fed Chairman or the global economic conditions that shaped the Fed's context is possible but conventionally beyond the scope of most accounts. Conventions limit the spiral.

**Action Coupling:** Stop when you have enough to act, and let the action generate new information that either confirms or revises the account. The spiral ends when the account is actionable, not when it is complete.

**Resource Limits:** Practical constraints (time, cognitive load, organizational capacity) force closure. The question is whether the closure is principled (based on sufficiency assessment) or arbitrary (based on running out of time). Agent systems should make closure explicit and principled.

---

## Designing Agents for Principled Closure

An agent performing causal reasoning should have an explicit closure module that:

1. **Tracks the decision context**: What decision is being supported? What are the stakes? What is the time constraint? What is the reversibility of the action?

2. **Assesses current explanation quality against the decision context**: Is the current explanation plausible (internally consistent, evidence-compatible)? Is it sufficient (does it change the decision relative to a shallower or simpler account)?

3. **Triggers continued investigation when explanation is neither plausible nor sufficient** for the decision at hand.

4. **Triggers closure when explanation is plausible AND sufficient** OR when the cost of continued investigation exceeds the expected value of additional explanation quality.

5. **Generates explanation with appropriate depth label**: "This is a [shallow/moderate/deep] explanation, appropriate for [immediate action / tactical planning / strategic review]. A deeper explanation is [available / under construction / requires additional information]."

6. **Flags when closure is being driven by time pressure rather than sufficiency**: "This explanation has been closed due to time constraints. Causal confidence is [moderate/low]. Recommend continued investigation when time permits."

This is metacognitive infrastructure — the agent's ability to reason about its own reasoning process, including knowing when to stop. It is as important as the reasoning itself.