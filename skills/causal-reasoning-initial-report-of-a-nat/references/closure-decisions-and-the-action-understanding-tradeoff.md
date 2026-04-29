# The Closure Problem: When to Stop Reasoning and Start Acting

## The Problem Klein and Hoffman Name But Don't Fully Solve

Among the most intellectually honest moments in Klein and Hoffman's paper is their acknowledgment of a problem they have identified but not resolved: "Our next step, for Phase 2 of this project, is to understand how decision makers achieve closure in their causal explanations of events in which they themselves have causal powers, and prevent themselves from a never ending spiral into further depth."

Closure — the decision to stop investigating causes and commit to an explanation sufficient for action — is one of the hardest problems in practical causal reasoning. The tension is irreducible: more investigation produces better causal understanding but delays action; faster closure enables action but on the basis of an incomplete or wrong causal account.

This is not a problem unique to causal reasoning. It appears in every domain where intelligent systems must decide when they have enough information to act. But causal reasoning makes it particularly acute because:

1. Causal investigation in complex domains can always go deeper (the reductive tendency can always be partially unwound)
2. The cost of acting on a wrong causal account can be severe (wrong treatment, wrong intervention, wrong strategy)
3. The cost of delayed action is also often severe (the situation deteriorates while investigation continues)
4. The investigator is often *causally entangled* in the situation — their investigation is itself changing what they are investigating

---

## The Key Observation: Action as Causal Investigation

Klein and Hoffman's hypothesis for Phase 2 is revealing: "We suspect that decision makers learn by action as much as by analysis — they take some actions in order to see how the situation changes."

This is a profound reframing of the closure problem. The traditional view of the action-investigation relationship is sequential:
- First you investigate until you understand the cause
- Then you act based on that understanding

Klein and Hoffman suggest that in practice (and appropriately), the relationship is *iterative*:
- You investigate until you have a "good enough" hypothesis
- You act on that hypothesis as an *experiment* — a probe designed to generate information as well as to address the problem
- You observe the results of the action
- You update your causal model based on the results
- You investigate further, guided by the updated model
- You act again

This transforms action from the *endpoint* of causal reasoning into an *instrument* of causal reasoning. You don't stop reasoning causally when you start acting; you reason causally through and because of action.

For agent systems, this is not a philosophical nicety — it is a design specification for how the investigation-action cycle should work.

---

## What Makes a Causal Account "Good Enough" for Action?

Although Klein and Hoffman do not fully answer the closure question, their framework suggests several criteria for when a causal account is sufficient to support action:

### 1. Actionable: The Account Identifies Levers

A causal account is actionable when it identifies specific, changeable factors — things that a decision-maker can actually influence. An account that correctly identifies "the fundamental unpredictability of complex systems" as the cause of a failure is epistemically honest but not actionable. An account that identifies "the absence of circuit breakers in the deployment pipeline" is actionable, even if incomplete.

The closure criterion of actionability asks: "Given this causal account, is there a specific action that would plausibly reduce the probability of this outcome in the future?" If yes, the account is actionable. If no, further investigation is needed.

### 2. Proportionate to Decision Stakes

The required depth of causal account should scale with the stakes of the decision. A decision about whether to patch a minor UI bug can be based on a shallow event-type explanation. A decision about whether to redesign a critical security system requires a story-type explanation that models the full causal structure of the vulnerability.

This is calibrated closure: the more important and irreversible the action, the more complete the causal account must be before closure is appropriate.

### 3. Achieves Plausibility Threshold

A causal account is sufficiently complete when the major elements of the situation are accounted for and there are no large, unexplained residuals — surprising features of the outcome that the current causal account cannot explain. If the current story explains 85% of what happened and the remaining 15% seems like noise, closure may be appropriate. If the remaining 15% includes a major surprising feature that the story cannot account for, more investigation is needed.

### 4. Survives Frame-Switching

A causal account that is robust under frame-switching — that looks credible whether you analyze it as an event-type problem, a condition-type problem, or a story-type problem — is more reliably complete than one that only makes sense under one frame. If switching frames reveals gaping holes in the account, those holes are evidence that closure is premature.

---

## The Spiral Problem: When More Investigation Generates More Questions

Klein and Hoffman identify the failure mode on the other side of premature closure: "prevent themselves from a never ending spiral into further depth."

In indeterminate domains, every new cause discovered raises the question of what caused *that* cause. Why did the Federal Reserve keep rates low? Because they feared deflation. Why did they fear deflation? Because of the dot-com bust and 9/11. Why were those events so economically disruptive? Because... and so on. The spiral can continue indefinitely.

The spiral is not just a practical time problem — it reflects a genuine feature of indeterminate causal systems: causes have causes, all the way back (and sideways) as far as you care to look. There is no natural stopping point built into the domain. The stopping point must be imposed by a decision about *purpose*.

**The purpose-relative stopping criterion**: The appropriate depth of causal investigation is determined by the purpose of the investigation. If the purpose is:
- *Blame assignment* → stop at the reversible decision nearest to the effect
- *Legal liability* → stop at the point where legal responsibility can be determined
- *Operational improvement* → stop at the point where actionable interventions can be identified
- *System redesign* → go deeper, to the structural conditions that enabled the problem
- *Scientific understanding* → go as deep as the evidence permits

Different purposes require different depths. An agent system must be designed to accept a purpose parameter and calibrate its closure decisions accordingly.

---

## The Self-Referential Problem: When the Investigator Is Part of the Causal System

Klein and Hoffman note the difference between "passive onlookers" and "participants in the to-be-explained events." When decision-makers are themselves causally entangled in the situation they are analyzing, the causal reasoning becomes self-referential: understanding the cause requires understanding your own role in the cause, which requires understanding the situation, which requires understanding your own role...

This creates a specific failure mode: *motivated causal reasoning*. Decision-makers who are causally entangled in a failure have incentives to construct causal accounts that minimize their own role and maximize the role of external factors. This is not necessarily dishonest — the human mind genuinely perceives situations differently when it is implicated in them.

**For agent systems**: Agents analyzing situations in which their own previous actions may have contributed to the current state must be explicitly designed to:
1. Include their own previous actions as candidate causes
2. Apply the same causal criteria (propensity, reversibility, covariation) to their own actions as to external factors
3. Flag when their own actions are causally relevant to the situation being analyzed

This self-referential causation analysis is one of the hardest problems in agent system design. An agent that cannot identify when it is causally responsible for the situation it is analyzing will systematically produce biased causal accounts.

---

## The Reductive Tendency and Premature Closure: The Unholy Alliance

The reductive tendency and premature closure reinforce each other in dangerous ways. Under time pressure, the reductive tendency suggests "simplify the causal story" and premature closure suggests "stop investigating." Together, they produce confident, simple, wrong causal accounts.

Klein and Hoffman's scientists are described as resisting the reductive tendency and avoiding premature closure — they are "always looking for deeper explanations and further mysteries." But managers "have to stop at a certain point and make decisions" and "depend on the reduction to avoid some of the complexity that might otherwise be unleashed."

The design challenge for agent systems is to provide the manager's practicality without losing the scientist's honesty. The key is *transparency about what has been simplified and when closure was forced*:

- "We stopped the investigation at this point because action was required, not because the causal story was complete"
- "We simplified by treating these simultaneous causes as sequential — this simplification may have cost us the following information..."
- "This root cause designation is a decision-aid simplification. The fuller causal story is available in the appended analysis"

These disclosures do not undo the simplification — they preserve the epistemic integrity of the organization by making clear what is being assumed and what is being acknowledged as uncertain.

---

## A Practical Closure Decision Protocol for Agents

When an agent must decide whether to continue investigating or to produce an output sufficient for action, the following protocol applies:

1. **Check actionability**: Does the current causal account identify specific, changeable factors? If not, continue investigating.

2. **Check proportionality**: Is the current account depth proportionate to the decision stakes and irreversibility? If underdepth for high-stakes decision, continue investigating.

3. **Check unexplained residuals**: Are there significant surprising features of the situation that the current account cannot explain? If yes, continue investigating — these may be symptoms of a wrong frame.

4. **Check frame robustness**: Does the account hold up under frame-switching? If switching frames reveals major holes, continue investigating.

5. **Check purpose alignment**: Is the depth of the current account appropriate for the stated purpose of the investigation? If underdepth for the purpose, continue investigating.

6. **Assess investigation cost vs. expected benefit**: What is the expected gain in causal accuracy from continued investigation, and what is the cost (time, resources, action delay)? If the cost exceeds the expected benefit, close with documented caveats.

7. **If closing**: Produce a closure output that includes:
   - The causal account at the current depth
   - The closure reason (time, resource constraints, actionability achieved)
   - The known gaps and uncertainties in the account
   - The recommended probe actions that would generate the most information for the least cost
   - The update triggers — what new evidence would cause the account to be reopened and revised

8. **Set update triggers**: Define specific observable conditions that would cause the causal account to be reopened. These are the leading indicators that the current account may be wrong — early warning signals that the intervention based on the current account is not producing the expected effect.