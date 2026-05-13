# The Value Case Problem: Making Invisible Contributions Visible in Complex Systems

## The Paradox of Good Cognitive Systems Engineering

There is a frustrating paradox at the heart of Cognitive Systems Engineering: its most valuable contributions are the hardest to demonstrate. When CSE works well, disasters don't happen, systems get used, practitioners don't have to develop elaborate workarounds, and coordination happens smoothly. None of these are visible as outcomes — they are absences, the non-occurrence of failures that were never triggered.

Militello et al. describe this directly: "The CSE community still faces the challenge of providing a convincing value case at the time work is scoped and planned... Often the only way to provide a convincing value case is to explain CSE processes and show specific work products that have resulted from previous CSE efforts."

And the more troubling version: "As a relatively new approach to design, the contribution and value of CSE are not widely understood. Although examples of difficult-to-use and even failed technologies are plentiful and widely appreciated, there is a pervasive tendency to underestimate the difficulty of developing effective solutions. Resources devoted specifically to exploring worker perspectives, work constraints, and cognitive requirements are hard to justify if program managers and system designers believe issues of usability, usefulness, and impact are to be resolved as a natural byproduct of smart people using common sense."

This is the value case problem in its pure form: smart people using common sense can build functional systems, and the gap between a functionally correct system and a cognitively effective one is mostly invisible until it manifests as failure. The cost of that gap is systematically underestimated because it is invisible.

## The "Smart People Using Common Sense" Assumption

The assumption that good designers using engineering intuition will naturally address cognitive requirements is not irrational — it is wrong in a specific way that the paper traces carefully. Engineering intuition is calibrated by experience with systems, and experience with systems is a poor basis for understanding the cognitive requirements of human work in those systems for several reasons:

**Engineers are not representative practitioners.** The people who design systems typically have extensive expertise in the design domain (software, hardware, systems architecture) and limited expertise in the work domain the system will support. Their intuitions about what practitioners need are formed through limited, often atypical contact with the work.

**Common sense systematically underestimates tacit knowledge.** Work that looks simple or routine from the outside — the expert who handles a complex situation smoothly, the team that coordinates without apparent effort — looks that way precisely because expertise and practiced coordination have made it so. The difficulty of the underlying cognitive work is invisible in the performance. When designers use that performance as their model of the work, they design systems that support the appearance of the work rather than its cognitive substrate.

**Normative models of work are poor approximations of actual work.** Designers have access to procedure manuals, process flows, and official descriptions of how work is supposed to happen. These normative models are internally consistent and make the work look more tractable than it is. Actual work involves constant improvisation, judgment, workarounds, and adaptation — the "informal artifacts" that practitioners develop when official tools don't fully support actual cognitive demands.

**Error analysis without CSE methodology blames practitioners, not systems.** When things go wrong, the most visible explanation is practitioner error — the operator didn't follow the procedure, the analyst made a judgment mistake, the team didn't communicate adequately. CSE methodology consistently finds that what looks like practitioner error is actually a system design failure: "Errors can often be traced to misleading information technology, contradictory processes, or competing goals." Without that analytical lens, each error produces attribution to human failure rather than insight into system design inadequacy.

## The Cost Visibility Problem

The paper identifies a specific measurement challenge: "outcomes of CSE include more productive iterations during the design cycle (and often fewer false starts) and fielded systems that better support cognitive work and reduce the likelihood of error. Systems designed using CSE methods and principles are more likely to feature the flexibility required to accommodate a changing world."

Each of these outcomes is genuinely valuable. None is easily measured as an isolated contribution of CSE:

- "More productive iterations" requires counterfactual comparison to iterations that would have occurred without CSE input
- "Fewer false starts" requires identifying which starts were avoided, which is impossible to observe
- "Better support cognitive work" requires cognitive performance measures that most organizations don't collect
- "Reduce the likelihood of error" requires a baseline of errors that would have occurred, which again requires counterfactual reasoning
- "Flexibility to accommodate a changing world" is only visible when the world actually changes

The paper acknowledges directly: "It does not make sense to build one work system using CSE and one work system without CSE for comparison in terms of development costs and the impact of the final design on cognitive work and error rates."

The practical result is that CSE is chronically underfunded relative to its actual contribution because its contribution is systematically invisible to the metrics that drive funding decisions.

## The Worker Acceptance Indicator

The paper notes: "Worker acceptance is an excellent indicator of success in hindsight (after the design is complete)." This is important: while CSE's positive contributions are hard to measure prospectively, rejection by workers is a clear indicator of failure in retrospect. The Cedars-Sinai and TRILOGY cases both ultimately produced clear rejection signals — though only after enormous investment.

The inverse is also true: systems that are readily adopted and used by practitioners — without the workarounds, complaints, and informal adaptations that signal design-practice mismatch — are a positive indicator of CSE effectiveness. The Global Weather Management tool being "so well received that a fieldable version was immediately requested" is an example.

For agent system design, worker acceptance of the system's outputs by the practitioners or downstream agents that consume them is the clearest immediate indicator of whether cognitive requirements have been adequately addressed. Outputs that require extensive post-processing, that are frequently overridden, that generate complaints from downstream users, or that are used only when no alternative is available — these are the analog of systems that workers boycott.

## Making the Value Case Concretely

The paper's practical suggestion is to "capture and share success stories in which cognitive requirements and worker perspectives are incorporated early in the design process." The success stories work as value cases because they make visible the contrast between the design trajectory with CSE input and what the design trajectory would have been without it.

The nuclear plant case is the most striking value case in the paper precisely because the counterfactual is so clear: the plant was about to spend millions of dollars adding technology and staff to solve a problem that a CSE investigation revealed was not the actual problem. The CSE contribution is not measured in the effectiveness of the eventual solution — it is measured in the millions of dollars of wrong investment that were avoided.

For agent systems, the analogous value case approach is:
- Document cases where problem reframing prevented expensive investment in the wrong solution
- Track cases where skill failures or coordination breakdowns were caught and corrected before manifesting as consequential errors
- Measure the frequency with which human operators override or post-process agent outputs (high frequency = poor cognitive support; low frequency = effective cognitive support)
- Capture cases where adaptability features enabled the system to handle unanticipated situations that a more rigid system would have failed on

## The Justification Challenge and Its Structural Cause

The paper identifies a structural cause for the justification challenge that goes beyond measurement difficulty: "often the CSE contribution is difficult, if not impossible, to isolate from the contributions of others on the design team — particularly if it is done well as part of an integrated design effort."

This is the deepest version of the problem. CSE is most effective when it is not a separate activity — when cognitive requirements are integrated into every phase of design, when problem framing is continuously updated as cognitive analysis deepens, when design decisions are made with full awareness of cognitive implications. In that integrated case, there is no "CSE contribution" to isolate — the whole system reflects CSE principles, and the value is diffused throughout.

The systems that produce the most visible CSE value cases — like the nuclear plant case — are often ones where CSE was not integrated into design from the beginning. The dramatic contrast between the initial (wrong) problem framing and the CSE-generated (correct) problem framing is visible precisely because CSE was brought in after the fact to correct a trajectory that had already diverged from cognitive reality.

This creates a perverse incentive: the most dramatic value cases come from late, corrective CSE interventions, while the greatest actual value comes from early, integrated CSE involvement that prevents those dramatic failures from occurring. But the value of prevention is invisible.

## For WinDAGs: The Invisible Contribution Problem

For an AI agent orchestration system, the same paradox applies. The hardest-to-demonstrate but most valuable contributions of cognitive quality in system design include:

- **Problem reframings that prevented expensive wrong-direction work.** If an agent recognizes that a task specification embeds a wrong problem framing and requests clarification before executing, the value of that recognition is entirely invisible — the wrong work never happened.

- **Coordination quality that prevents cascading failures.** A well-designed inter-agent coordination protocol that prevents one agent's uncertainty from being misinterpreted as confidence by the next agent in the chain prevents a class of errors that is entirely invisible when the protocol is working.

- **Appropriate uncertainty signaling.** An agent that correctly signals low confidence on an unusual case and escalates to human judgment has prevented a potential error — but because the error never occurred, its prevention has no obvious value in any metric that counts successes.

- **Graceful failure handling.** A skill that fails informatively, producing diagnostically useful error information rather than a plausible-looking wrong answer, contributes to system quality in ways that are invisible when the system is working and visible only in the aftermath of failures that were caught rather than propagated.

The practical implication: design the system to make these invisible contributions visible by tracking them explicitly. Log problem reframings and their estimated impact. Track escalations and their outcomes. Measure uncertainty calibration (how often does stated confidence correspond to actual accuracy?). Analyze cases where graceful failure prevented downstream error propagation. Build the metrics infrastructure to see the value that would otherwise be invisible — because invisible contributions don't get resourced, and under-resourcing them produces the failures that expensive post-hoc corrections try to fix.