# The Most Dangerous Failure Mode: When Good Plans Become Wrong Plans

## The Persistent Pattern Across Domains

One of the most consistent findings across the NDM literature synthesized in this research is that catastrophic failures in complex systems are rarely caused by *initial* misassessment. The initial reading of a situation is often reasonable. The failure comes later, when the situation changes and the decision-maker does not.

"Research has shown that inadequate decisions are usually a result of poor situation assessment rather than poor action-choice decisions. Studies of errors in NDM environments have revealed that it is not usually initial assessments of the situation that are faulty, instead it is inadequate assessments of *changing situations* that result in disastrous outcomes" (Zimmerman, p. 30, emphasis added).

This pattern has been documented in:
- **Wildfire firefighting**: Weick (2001) analyzed incidents where firefighters died with equipment still in hand. They had been commanded to drop their tools and run. They didn't. The plan (fight the fire, use the tools) had become so deeply committed that even a direct command to abandon it couldn't override the cognitive commitment. "Either decision makers fail to take appropriate action or they take action that allows them to continue on the same, now inappropriate, course of action" (p. 30).
- **Aviation**: Analysis of 37 airline accidents showed that the majority of errors were errors of *omission* — "failing to do something that should have been done. These omission errors happened in situations where pilots continued with their course of action although evidence indicated that a change in action was necessary" (p. 31).
- **Police scenarios**: Officers who entered a scenario expecting compliance from a subject often continued commanding compliance long after it was clear the situation had shifted to something else — suicidal crisis, armed confrontation, or innocent bystander.

## The Mechanism: Why Plans Persist

Why do intelligent, trained professionals continue executing plans that have stopped working? The research identifies several interacting mechanisms:

**1. Ambiguity in the signal of change.** The cues that indicate a situation has changed are often initially ambiguous. In the aviation study, "cues that indicate a problem exists are not clear cut (ambiguity)" — so the pilot discounts them rather than updating the plan. The threshold for plan revision is calibrated against the pain of unnecessary revision (false alarms), which can set it dangerously high.

**2. The sunk cost of the current plan.** Once a course of action has been initiated, there are real costs to abandoning it: tactical repositioning, loss of momentum, need to re-brief other agents, risk of the gap between plans. These costs are concrete and immediate. The benefit of changing plans is probabilistic and future. Under cognitive load, the concrete often wins over the probabilistic.

**3. Mental model lock-in.** The initial assessment activates a mental model that generates expectations about what should happen next. Incoming information gets filtered through that model. "The pilots inadequately assessed the situation, relying instead on familiar mental models to guide them through the situation" (p. 31). Paradoxically, rich mental models — the expert's great advantage — can become a disadvantage when the situation no longer matches any known pattern. The mental model fills in what "should" be there and suppresses awareness of what is actually there.

**4. Organizational and social pressure.** Abandoning a plan exposes the decision-maker to social judgment. "What if I'm wrong to change?" The firefighters who dropped their tools would have looked foolish if the fire hadn't been as dangerous as they feared. The pilot who aborts an approach takes on schedule costs, fuel costs, and the need to explain the decision. These social costs bias toward plan continuation even when the rational update would be to change.

## Jones & Endsley's Error Taxonomy

Jones and Endsley (2000), analyzing air traffic controller errors, developed a taxonomy of situation assessment failures that maps the failure modes with precision:

**Level 1 — Failure to perceive**: The decision-maker misses relevant data or misperceives it. Possible causes: data was not salient enough, attention was occupied elsewhere, or the decision-maker was not looking for it because the mental model said it shouldn't be there.

**Level 2 — Failure to integrate/comprehend**: The decision-maker perceives the data but draws the wrong conclusion about its significance. "Fails to comprehend the significance of perceived cues, rather than missing cues or making inaccurate predictions" was the *primary* error mode found. Using an incorrect mental model, or relying on default values, produces conclusions that are systematically wrong in specific ways.

**Level 3 — Incorrect projection**: The decision-maker has correctly understood the current state but projects incorrectly into the future. Over-extrapolating current trends, failing to account for near-term changes in the system, or lacking the mental model for what typically happens next.

Critically, the research found that **Level 2 errors were most common** — the problem was not in seeing the data or in predicting the future, but in *interpreting the present*. This is a finding about where the cognitive leverage is: improving situation comprehension produces more safety gain than improving perception or prediction.

## Task Fixation: The Named Failure Mode

The CIDS training program specifically addresses "task fixation" as a named failure mode: "hang on to inappropriate action choices — 'get-there-itis'" (Appendix C, lesson plan). The aviation term "get-there-itis" describes the compulsion to complete a planned approach despite accumulating evidence that the approach should be aborted.

The firefighter version: "tool retention." The commitment to the tool (the shovel, the saw) is so strong that dropping it feels like surrendering identity — the firefighter is a person who uses tools to fight fires. Dropping the tools means ceasing to be what they are. This psychological dimension of task fixation is rarely discussed in technical systems but matters enormously in human teams and potentially in agent systems that have been given strong goal representations.

## The Update-Failure Pattern in Agent Systems

For AI agent systems, the update-failure pattern manifests as:

**Plan commitment without re-evaluation triggers.** An agent is given a task, decomposes it into a plan, and begins execution. The plan has no mechanism for detecting that initial assumptions have become invalid. It executes to completion (or to failure) without checking whether the world still matches the plan's presuppositions.

**Single-pass situation assessment.** The system assesses the situation at the beginning of a task, selects a plan, and executes. There is no continuous situation monitoring — no loop that periodically asks "is this still the right plan given what I now know?"

**Missing anomaly detection.** Expert decision-makers notice when something is *not* what they expected. "Experts noticed typical and atypical patterns at greater rates" (p. 25). A system without an anomaly detector — something that flags when incoming information violates the plan's assumptions — lacks the trigger for plan re-evaluation.

**Confidence escalation under uncertainty.** As execution proceeds without explicit feedback that the plan is wrong, the system may increase its confidence in the plan (absence of disconfirmation read as confirmation). The pilot who hasn't received warnings assumes the approach is safe. This is the inverse of appropriate updating.

## Design Principles for Update-Resistant Systems

**1. Explicit assumption documentation.** Every plan should carry a list of the conditions under which it is valid. "This plan assumes: subject is cooperative, building is clear, backup is available." These assumptions create testable conditions that can be monitored during execution.

**2. Continuous situation monitoring as a first-class process.** Situation monitoring is not a background process — it is co-equal with plan execution. In NDM terms: experts are *always* assessing, not just at the beginning. Architecturally, this means a persistent monitoring thread that runs in parallel with execution, watching for signals that violate plan assumptions.

**3. Anomaly triggers over threshold alerts.** Rather than waiting for explicit failure signals, the system should have lower-cost checks for "is this proceeding as expected?" A deviation from expectation — even a small one — should trigger attention, not just threshold crossings.

**4. Plan revision as a supported operation, not a failure mode.** If the cognitive cost of plan revision is architecturally high (requires escalation, disrupts downstream agents, requires full re-planning), the system will bias toward plan continuation just as human decision-makers do. Make plan revision cheap and normalized.

**5. The "enemy's OODA loop" perspective.** The CIDS training (derived from Boyd's OODA loop framework) specifically addresses getting *inside* the adversary's decision cycle — acting faster than they can update their own plans. The same logic applies to agent systems: an agent that updates faster than the problem evolves has a fundamental advantage. Speed of update is a competitive capability.

## Summary

The most dangerous assumption an intelligent system can make is that the situation has not changed. This assumption is usually correct — most situations evolve slowly. But it is catastrophically wrong precisely when the situation changes sharply, and sharp changes are precisely when update failure causes disasters.

The design imperative: build systems that are as good at *detecting that their plan is wrong* as they are at *generating a plan in the first place*. These are different cognitive functions, and the second one is systematically undertrained in both humans and artificial systems.