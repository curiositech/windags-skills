# Making the Invisible Visible: How to Justify What Can't Easily Be Measured

## The Justification Problem

One of the most practically important sections of Militello et al. (2009) addresses what the authors call "a second challenge" for CSE: **justification**. They state it plainly:

"As a relatively new approach to design, the contribution and value of CSE are not widely understood. Although examples of difficult-to-use and even failed technologies are plentiful and widely appreciated, there is a pervasive tendency to underestimate the difficulty of developing effective solutions. Resources devoted specifically to exploring worker perspectives, work constraints, and cognitive requirements are hard to justify if program managers and system designers believe issues of usability, usefulness, and impact are to be resolved as a natural byproduct of smart people using common sense." (p. 10)

This is not unique to CSE. It is a structural feature of all investments in *preventing invisible failures*. The value of preventing the Cedars-Sinai CPOE failure is enormous — but it can only be seen in counterfactual ("what would have happened without CSE") terms. The actual success looks like nothing: the system works, doctors use it, no boycott occurs. The absence of catastrophe is invisible.

The authors identify the specific measurement challenge: "Often the only way to provide a convincing value case is to explain CSE processes and show specific work products that have resulted from previous CSE efforts. It is important to note... that there may be some danger in focusing solely on success stories as there is often much to be learned from failures." (p. 10-11)

## The Measurement Problem in Depth

Why is the contribution of cognitive systems engineering (and analogously, good agent system design) so hard to measure?

**Confounding with team quality**: "Often the CSE contribution is difficult, if not impossible, to isolate from the contributions of others on the design team — particularly if it is done well as part of an integrated design effort." (p. 10) Good cognitive systems engineering is woven into every design decision; its contribution is not separable from the contribution of the team that incorporated it.

**No valid counterfactual**: "It does not make sense to build one work system using CSE and one work system without CSE for comparison in terms of development costs and the impact of the final design on cognitive work and error rates." (p. 10) You can't run the controlled experiment. You can't build two nuclear power plants, staff one with CSE-designed processes and one without, and compare outcomes.

**Task transformation**: "Simply comparing a new work system to the previous work system is not straightforward, as often the nature of the task or mission is transformed with the introduction of the new system, making meaningful pre-and post-comparisons difficult." (p. 10) The landmine detection training didn't just improve performance on the same task — it transformed what the task looked like for trained operators. Comparing before-and-after is not comparing like with like.

**Prevention is invisible**: The primary value of CSE — like the primary value of good security practices, good error prevention, good cognitive architecture — is in what *doesn't* happen. Failed deployments, user boycotts, catastrophic errors, costly rework. These non-events don't appear in productivity reports.

## What the Value Case Actually Is

The authors propose a value case that, while not perfectly measurable, is articulable and compelling:

**Making explicit the invisible aspects of system operation**: CSE surfaces the cognitive demands, constraints, and expertise that are present in every complex system but normally invisible to designers. By making these visible, designers can address them deliberately rather than hoping that "smart people using common sense" will somehow accommodate them.

**Providing flexibility for unanticipated situations**: "Systems designed using CSE methods and principles are more likely to feature the flexibility required to accommodate the never ending creativity of humans as they adapt technologies and processes to accomplish work tasks, as well as the many unexpected situations that arise in a changing world." (p. 10-11) Rigid systems work until they don't. Flexible systems adapt.

**Making visible the expertise needed within a system**: Expert performance is a system asset. Systems designed around expert cognitive models can preserve and extend that expertise through tool support and training. Systems that ignore expert models lose that asset or actively undermine it.

**Making visible potential errors from misuse or novel contexts**: "It can make visible the potential errors that might arise if technologies are used in ways that are not intended, or in contexts that were not envisioned." (p. 10) This is anticipatory failure analysis — identifying failure modes before deployment rather than discovering them after.

**More productive iterations, fewer false starts**: "Outcomes of CSE include more productive iterations during the design cycle (and often fewer false starts) and fielded systems that better support cognitive work and reduce the likelihood of error." (p. 10) The investment pays in development efficiency, not just final product quality.

## Application to Agent System Justification

This justification challenge appears directly in the context of agent system design decisions. Many of the most important architectural choices for robust, reliable agent systems are hard to justify in advance:

**Uncertainty propagation**: Should agents surface their confidence levels explicitly? The answer is yes — but demonstrating the value of this requires imagining the cases where an orchestrating agent over-relies on a low-confidence sub-agent output and produces a confidently wrong result. That failure is invisible until it happens.

**Problem reframing capabilities**: Should the orchestration system include a stage that explicitly reframes the task before committing to a decomposition? Yes — but the value is in the cases where the initial framing was wrong. You can't easily demonstrate this without case studies.

**Joint cognitive system design**: Should all agents be designed as team players with explicit coordination protocols? Yes — but the value of this is clearest in the complex, novel situations where stove-piped agents would produce incoherent joint behavior. In routine cases, coordination overhead is visible and the coordination benefit is not.

**Expert routing heuristics**: Should the system encode expert routing knowledge rather than relying on general-purpose heuristics? Yes — but the value is in task types where the routing is non-obvious, and demonstrating this requires curated examples.

### Strategies for Making the Value Case

Drawing on the CSE justification literature and the paper's specific recommendations:

**Maintain a case library of prevented failures**: When problem reframing prevents a costly wrong-solution investment, document it. When uncertainty propagation prevents an orchestrator from over-committing on a low-confidence result, document it. These counterfactuals — "what would have happened without X" — are the evidence base for the value case.

**Use diagnostic frameworks as value demonstrations**: When a system fails, apply the constraint mapping diagnostic to show why it failed and how the failure could have been anticipated. This retrospective analysis demonstrates the value of prospective analysis.

**Measure leading indicators, not just outcomes**: Rather than waiting for dramatic failures, measure leading indicators of cognitive system quality: expert review of outputs, detection of near-misses, frequency of human override, identification of bottlenecks. These intermediate measures are more tractable than ultimate outcome measures.

**Compare development cycles**: Track false starts, costly rework, post-deployment changes, and user rejection rates across projects with and without systematic cognitive systems design. These process metrics are more measurable than product quality metrics.

**Document success in a form that enables transfer**: The most convincing value case for future projects is a portfolio of successes in past projects, with enough detail about what was done and why that the approach can be replicated. This is the agent-system equivalent of the landmine detection training package that the US Army adopted as an integrated unit.

### The Invisible Architecture Principle

There is a deeper point embedded in the justification challenge: **the best system design is invisible**. When cognitive systems engineering has been done well, the system works so naturally that users (or downstream agents) don't notice the design decisions that make it work. The interface is transparent. The coordination is smooth. The bottlenecks don't appear. The automation surprises don't happen.

This invisibility is both the success criterion and the measurement problem. We should design agent systems with this in mind: the target is not a system that displays its sophistication, but a system that makes complex problems tractable without making its own operation a new source of complexity.

The value case for this invisible architecture must be made through cases — documented instances where the invisible design choices made the difference between a system that worked and one that failed. Building that case library is not just a political exercise — it is the empirical foundation for continuous improvement of the joint cognitive system.