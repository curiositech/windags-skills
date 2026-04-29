# Distributed Decision-Making Without Central Control: How Experts Coordinate at Scale

## The Wildland Fire Model

Study 2 of the Klein and Calderwood research program observed something remarkable: the coordinated management of a large wildland fire suppression effort by a distributed team of expert commanders. Thousands of firefighters were being directed across a complex, dynamic landscape, with decisions being made at multiple levels of the command hierarchy simultaneously, without the kind of central information processing that most command-and-control models assume.

The research team had anticipated coordination failures. What they found was largely the opposite: "Many of the complications of distributed decision tasks we had anticipated did not occur. There was little problem with information overload. Communication channels were limited but were used effectively. There was open communication about differences in the way situations were perceived and goals were formulated, but these were controlled so as to maintain team cooperation and morale." (p. 34-35)

How does coordination work at scale without a central controller who understands everything? The research provides partial answers — enough to inform how multi-agent systems should be designed for distributed operation.

## Shared Situation Assessment as Coordination Infrastructure

The most important enabling condition for coordination without central control is shared situation assessment — a common understanding of what is happening, what matters, and what is being attempted. When agents share a situation assessment, their individually recognitional decisions tend to be mutually compatible. They do not need to negotiate each individual decision because their common understanding of the situation generates compatible action schemas.

Coordination failures arise primarily when situation assessments diverge. The wildland fire study found open communication about "differences in the way situations were perceived and goals were formulated" — these were explicitly managed, not allowed to proliferate silently.

The implication for multi-agent systems: the coordination infrastructure should focus on maintaining shared situation assessment, not on coordinating individual decisions. If the agents agree on what is happening and what goals are in play, their individual decisions will tend to be mutually compatible without requiring explicit negotiation.

**Practically**: before assigning work to agents, the orchestrating system should establish a shared situation summary that all relevant agents have access to. This summary should include: current situation classification, active goals and their priorities, current expectations about how the situation will develop, and any flags for unusual or novel aspects that increase uncertainty.

## Recognitional vs. Analytical Strategies by Decision Type

The wildland fire study found that expert commanders did not use a uniform decision strategy across all decisions. Their strategy varied by decision type:

- **Technical/tactical decisions** (where to place fire control lines, how to deploy equipment): primarily recognitional
- **Organizational and interpersonal decisions** (resource allocation across teams, negotiation between commanders): primarily analytical (concurrent evaluation)

This is a key finding: even expert practitioners shift between recognitional and analytical modes depending on what kind of problem they are facing. Technical expertise enables recognition; interpersonal and organizational complexity requires analysis even from experts.

For multi-agent systems: the routing of decisions to recognition-mode versus analysis-mode processing should depend on the type of decision, not just on the agent's expertise. Technical/tactical decisions in familiar domains should be routed to recognition-mode processing. Decisions involving resource allocation across multiple competing stakeholders, novel situations, or interpersonal/organizational dynamics should trigger analysis-mode processing.

## The Role of Limited Communication Channels

An interesting finding from the wildland fire study: "Communication channels were limited but were used effectively." This is not despite limited channels being a constraint — it may be partially because of them. Limited channels force prioritization. Every communication must justify its cost, which means that only high-value information actually flows. The result may be lower communication volume but higher communication quality.

The RPD model explains how expert practitioners can function with limited communication: they need less information because their recognitional capabilities allow them to infer situational implications from sparse cues. An expert commander who receives a brief report of fire behavior changes can infer implications that a novice cannot. The same message carries more information for the expert.

For multi-agent systems: the assumption that more information flow is always better should be questioned. Information routing should be intelligent — directing information to agents who need it and can use it, rather than broadcasting broadly. Agents with high domain expertise in a given area need less briefing for decisions in that area; their inferential capabilities fill in gaps that would require explicit specification for less experienced agents.

## The Incident Command System as an Architectural Pattern

The wildland fire study embedded its subjects in the Incident Command System (ICS) — a modular, scalable command structure used in emergency management. The ICS provides a template for distributed coordination that has important architectural lessons.

The ICS is characterized by:
- **Hierarchical but modular structure**: clear chains of command but with significant autonomy at each level
- **Span of control**: each commander directly oversees a limited number of subordinates (typically 3-7)
- **Unity of command**: each unit has a single designated supervisor
- **Common terminology**: shared vocabulary enables rapid, unambiguous communication
- **Scalability**: the structure can be expanded or contracted as the incident grows or shrinks
- **Management by objectives**: high-level goals are specified, with significant tactical autonomy left to subordinate commanders

This structure enables coordination without central control of every decision. The high-level commander specifies objectives and constraints; subordinate commanders make tactical decisions using their local expertise and situational knowledge, within those objectives and constraints.

For multi-agent systems: the ICS provides a concrete architectural template. An orchestrating agent specifies high-level objectives, constraints, and resource allocation. Subordinate agents make tactical decisions within those specifications using domain expertise. Information flows up (status reports, escalation of novel situations) and down (updated objectives, constraint changes, resource adjustments), but tactical decisions are not centrally controlled.

## Escalation: When Recognition Fails at Lower Levels

In distributed systems, individual agents will periodically encounter situations that their recognitional capabilities cannot handle confidently. These are the genuinely novel situations — prototype mismatches, situations outside the agent's domain expertise, or situations where the stakes are high enough that the agent judges its own uncertainty too great to act alone.

The research suggests that the appropriate response is escalation — bringing the situation to a higher level where either greater expertise or greater authority is available. Escalation is not failure; it is an appropriate response to the limits of recognitional decision-making.

Effective escalation requires:
- **Accurate self-assessment**: the agent must recognize when its situation assessment is insufficient and escalation is needed
- **Efficient handoff**: the escalating agent must communicate the situation effectively to the higher-level agent
- **Appropriate authority allocation**: the higher-level agent must have the authority and capability to actually resolve the escalated situation

For multi-agent systems: build in explicit escalation mechanisms. Define, for each agent, the conditions under which escalation is triggered (low confidence in situation classification, situation outside the agent's domain, stakes above a threshold, expectancy violations not explained by reassessment). Define a clear escalation path and handoff protocol. Ensure that higher-level agents have both the authority and the situational information needed to handle escalated decisions.

## Progressive Deepening as a Distributed Process

An interesting possibility raised by the research is that progressive deepening — mental simulation of action consequences — can be distributed across agents. Rather than one agent simulating an entire action's consequences, multiple agents can each simulate the consequences within their domain of expertise and report back.

For example, in a complex multi-step plan:
- Agent A evaluates the tactical feasibility of step 1
- Agent B evaluates the resource implications of step 2
- Agent C evaluates the downstream effects of step 3 on Agent C's domain

This distributed simulation can be richer than any single agent's simulation (more domains covered) while avoiding the information-overload problem of centralizing all evaluation in one agent. The results of the distributed simulation are then aggregated by the orchestrating agent to assess the plan overall.

The design challenge is ensuring that the sub-simulations are coherent — that Agent A's simulation of step 1 is consistent with the situation that Agent B's simulation of step 2 assumes. Shared situation assessment again plays a key role: if all agents are working from the same situational understanding, their independent simulations will tend to be compatible.

## Information Overload and Its Prevention

The research expected information overload to be a serious problem in the wildland fire coordination task and found it was not. This finding deserves explanation — information overload is a genuine failure mode in distributed command-and-control systems. The research suggests several mechanisms that prevented it:

**Expertise-based filtering**: Expert decision-makers know which information is relevant to their current situation assessment and can filter out the rest. They are not overwhelmed because they are not attending to everything equally.

**Role-based information routing**: The ICS structure channels information to the people and roles for whom it is relevant, rather than broadcasting universally.

**Limited communication channels**: The discipline imposed by limited channels forces senders to prioritize before transmitting, reducing noise.

**Common operating picture**: When all agents share a common situational understanding, there is less need to transmit contextual information — agents can interpret brief messages correctly without extensive background.

For multi-agent systems: information routing should be intelligent, role-based, and context-dependent. The question for each piece of information is "which agents need this to update their situation assessment or action planning?" — not "which agents might possibly find this relevant?"