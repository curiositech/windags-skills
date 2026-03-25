# Crisis Decision Pathologies: What Goes Wrong When Systems Are Under Pressure

## The Systematic Nature of Failure

One of the most valuable contributions of the Contingency Approach (CA) to crisis management research is its documentation that organizational decision-making under stress does not fail *randomly*. It fails in *predictable, recurring patterns*. Rosenthal et al. (1989) identified a specific cluster of decision pathologies that emerge reliably under crisis conditions:

> - "Decision-making becomes increasingly centralised."
> - "Formal rules and procedures give way to informal processes and improvisation."
> - "Decision makers tend to give priority to the source of information instead of its contents."
> - "Decision makers tend to reduce uncertainty by supplementing sparse information with analogous data."
> - "Decision makers can have extreme difficulty in redefining the situation. They stick to the chosen course of action."
> - "Decision makers in crisis units can yield to groupthink."
> (Njå & Rake, pp. 4-5, citing Rosenthal et al., 1989)

These are not descriptions of bad actors or poorly trained personnel. They are descriptions of what happens to *any* complex decision-making system under conditions of high stress, time pressure, information overload, and high stakes. Agent systems are not immune. Understanding these pathologies is prerequisite to designing systems that resist them.

## Pathology 1: Centralization Under Pressure

When a system comes under stress, decision authority collapses upward. The local nodes stop making decisions and defer to the center. The center becomes a bottleneck.

**Why this happens**: Uncertainty increases the perceived cost of a wrong decision. Local nodes, uncertain whether their judgment is adequate, escalate. The center, facing a flood of escalated decisions, makes them faster and less carefully.

**The agent system analog**: In a WinDAGs orchestration system, this manifests as over-routing to the orchestrator. Agents that should be invoking skills autonomously instead ask the orchestrator for permission. The orchestrator becomes overwhelmed. Latency increases, throughput decreases, and the very intelligence that was distributed gets funneled through a single bottleneck.

**Mitigation design**:
- Give agents explicit authority budgets: conditions under which they are authorized to act without escalation
- Design escalation triggers narrowly: only escalate when genuinely novel, when stakes exceed a threshold, or when resources are required that the agent doesn't have
- Monitor centralization rate as a system health metric: if escalation frequency is rising, the system is entering crisis mode
- Ensure that high-centralization states are temporary, with explicit mechanisms to redistribute authority once the acute pressure passes

## Pathology 2: Procedural Breakdown and Improvisation

Under crisis conditions, formal rules and procedures give way to improvisation. This can be adaptive (flexibility enables response to novel situations) or catastrophic (the procedures existed for good reason and abandoning them creates new vulnerabilities).

**The agent system analog**: Agents bypassing their standard skill invocation chains, skipping validation steps, or generating ad-hoc outputs that don't conform to expected formats because "the situation is urgent." The immediate problem gets addressed while downstream consumers of those outputs fail.

**The key distinction**: Improvisation that *extends* known procedures to novel situations is adaptive. Improvisation that *abandons* procedures because they feel slow is dangerous. The difference is whether the agent understands *why* the procedure exists.

**Mitigation design**:
- Every procedural step should carry a documented rationale, not just the procedure itself
- Agents authorized to deviate from procedure should be required to log the deviation and the rationale
- Some procedure steps should be non-overridable regardless of time pressure (safety constraints, output format requirements, data validation)
- Post-crisis review should distinguish adaptive improvisation from dangerous shortcutting

## Pathology 3: Source Prioritization Over Content

> "Decision makers tend to give priority to the source of information instead of its contents. It may become impossible to acquire the most crucial aspects of the crisis." (Njå & Rake, p. 4)

Under stress, the cognitive cost of evaluating information quality becomes too high. Shortcuts emerge: trust high-authority sources, distrust low-authority ones, regardless of accuracy.

**The agent system analog**: An agent that weights output from a "senior" or "trusted" sub-agent too heavily, even when that output is inconsistent with other evidence. Or a system that trusts the most recently received information over accumulated context. Or an orchestrator that privileges the loudest/most confident agent over the most accurate one.

**Mitigation design**:
- Separate source credibility (historical accuracy of this agent on this type of task) from source authority (this agent is senior in the hierarchy)
- Build explicit information quality assessment into the routing layer: evaluate the *content* of a claim, not just who made it
- When high-confidence outputs from different sources conflict, treat the conflict as information — do not automatically defer to authority
- Calibration tracking: maintain a running record of each agent's confidence-accuracy relationship

## Pathology 4: Analogical Reasoning as Uncertainty Reduction

> "Decision makers tend to reduce uncertainty by supplementing sparse information with analogous data and arguments. Decision makers are inclined to refer to previous crises as a reference point." (Njå & Rake, p. 4)

This is not inherently wrong — analogical reasoning is a powerful tool. The problem arises when the analogy is *forced*: when a novel situation is mapped onto a prior case despite significant disanalogous features, simply because uncertainty is uncomfortable.

**The agent system analog**: An agent that retrieves the most similar prior case and applies its solution without adequately assessing whether the similarity is deep enough to warrant transfer. The retrieved case provides a confident answer, which is applied to a problem it only superficially resembles.

**Mitigation design**:
- Analogical reasoning should always produce a *similarity score and a list of disanalogies*, not just a retrieved answer
- The system should explicitly ask: "What features of this case are *different* from the retrieved case? Do any of those differences affect the validity of the transferred solution?"
- Situations with low similarity scores to any known case should trigger KB-level reasoning rather than analogical transfer
- Build a "novel situation" flag: when no retrieved case scores above a similarity threshold, the system acknowledges novelty rather than forcing a match

## Pathology 5: Commitment Persistence ("Tunneling")

> "Decision makers can have extreme difficulty in redefining the situation. They stick to the chosen course of action. Decision makers tend to focus on one goal and one particular way of achieving that goal." (Njå & Rake, p. 5)

This is perhaps the most dangerous pathology in the list. Once a course of action is committed to, cognitive resources are marshaled to support it rather than evaluate it. Disconfirming evidence is discounted. The original situation model is defended against updating.

This pathology is amplified by the RPD model's strengths: expertise gives commanders confidence in their initial assessment, which makes it harder to abandon.

**The agent system analog**: An agent that has committed to a task decomposition, a solution approach, or a situation classification, and continues along that path even as evidence accumulates that the initial assessment was wrong. The system keeps trying to make its original approach work rather than stepping back.

**Mitigation design**:
- Every committed plan should carry an explicit set of *abort criteria*: conditions that, if observed, trigger mandatory reassessment rather than continued execution
- Separate the agent that *generates* a plan from the agent that *monitors* its execution: the monitoring agent has no commitment to the plan's success
- Use staged commitment: don't commit fully at the beginning; commit incrementally as early stages succeed
- Build a "sunk cost override": the system should be explicitly taught that prior resource investment is not a reason to continue a failing approach

## Pathology 6: Groupthink in Agent Collectives

> "Decision makers in crisis units can yield to groupthink (Janis, 1982), i.e., the preservation of group harmony overrides the group's ability to critically assess decision problems and choose an adequate course of action." (Njå & Rake, p. 5)

Groupthink is a well-documented phenomenon in human teams. In agent systems, its analog appears when:
- All agents in a collective have been trained on the same data and share the same biases
- Agents systematically agree with each other because consensus-seeking is built into their coordination protocol
- Dissenting signals are smoothed out by aggregation mechanisms

**Mitigation design**:
- Deliberately instantiate diversity in agent perspectives: different training emphases, different problem-solving heuristics
- Build an explicit "devil's advocate" role into multi-agent coordination: an agent whose job is to find the strongest argument *against* the current consensus
- Do not aggregate agent outputs by averaging; surface disagreements explicitly for higher-level resolution
- Track correlation between agent outputs: high correlation is a warning sign, not a sign of reliability

## The Meta-Lesson: Pressured Systems Regress

The deepest lesson from this catalogue of pathologies is that **complex systems under pressure do not fail randomly — they regress to simpler, less adaptive modes of operation**. Centralization is regression to hierarchy. Commitment persistence is regression to the first pattern matched. Analogical reasoning is regression to the known. Source prioritization is regression to authority.

This regression is not irrational — it is a coherent response to cognitive overload. But it means that system designers must actively engineer resistance to these regression patterns, because they will emerge whenever the system is under the kind of stress it was designed to handle.

The worst time to discover that your agent system has these pathologies is during a high-stakes, time-pressured operation. The design and testing for these failure modes must happen during low-pressure operation, when there is time to observe and correct.