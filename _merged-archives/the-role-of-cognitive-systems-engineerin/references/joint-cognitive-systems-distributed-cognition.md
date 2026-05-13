# Joint Cognitive Systems: Why Complex Cognition Is Always Distributed

## Beyond the Single Agent Assumption

The dominant mental model for AI systems — and for a great deal of cognitive science — is the single intelligent agent: one reasoner, one knowledge base, one decision process, one output. This mental model is wrong for almost all interesting problems, and the field of Cognitive Systems Engineering was partly built on recognizing its inadequacy.

Militello et al. ground their entire framework in what Hollnagel and Woods call the "joint cognitive system": "In a single term, the agenda of CSE is how can we design joint cognitive systems so they can effectively control the situations where they have to function." The word "joint" is doing enormous work here. It signals that cognition — real problem-solving cognition in complex domains — is not performed by isolated individuals but by systems of agents (human and technological) whose cognitive work is deeply interdependent.

The paper's definition of cognitive complexity reflects this: "These activities [identifying, judging, attending, perceiving, remembering, reasoning, deciding, problem solving, and planning] rarely reside in one individual, but instead often happen in the context of teams, as well as within human-technology interactions. This distributed and large-scale collaboration between humans and interaction with technology has been referred to as a sociotechnical system, highlighting the notion that the humans, the technologies, and the larger system are highly interdependent and are linked by human social processes of collaboration and shared goals."

This is not a philosophical abstraction. It has direct architectural implications for how AI agent systems should be designed.

## What the Joint Cognitive System Actually Contains

The sociotechnical system that performs cognitive work includes at minimum:

**Human practitioners** with domain expertise, tacit knowledge, and developed perceptual and decision skills. These practitioners are not the users of the system in a passive sense — they are cognitive participants whose knowledge and judgment are part of the system's total cognitive capacity.

**Technological artifacts** — tools, displays, databases, communication systems — that extend, augment, or replace aspects of human cognitive work. These artifacts are not neutral conduits for information; their design choices actively shape what information is salient, what patterns are visible, what actions are easy or hard.

**Organizational structures** — role definitions, authority relationships, communication channels, procedures — that coordinate the cognitive work of multiple practitioners and distribute responsibility across the system.

**Physical workspace configurations** that either enable or impede the coordination and information sharing that joint cognitive work requires. The nuclear plant case is the clearest example: rearranging physical positions to group people by coordination requirements was one of the most important interventions.

**The work itself** — the domain with its intrinsic structure, constraints, goals, and the situations that arise within it. Work is not simply assigned to the system; the domain generates demands that the system must be capable of meeting.

All five components interact continuously. A change in any one of them changes the cognitive demands on all the others. This is why the paper insists that CSE addresses not a specific technology but "the design of technology, training, and processes intended to manage cognitive complexity in sociotechnical systems" — because effective cognitive support requires attending to the entire system, not just the technology component.

## The Global Weather Management Case: Joint Cognition in Action

The Global Weather Management case is the paper's clearest illustration of joint cognitive system design. The initial problem framing was likely something like: "flight managers need decision support for weather-affected mission planning." This frames the cognitive work as residing in a single role (the flight manager) and a single cognitive task (deciding how to handle weather impacts on missions).

The CSE investigation revealed that the actual cognitive work was distributed across *two* roles — flight managers and weather forecasters — who needed to integrate complementary knowledge to produce actionable situational understanding. Neither role had all the information needed; neither could perform the cognitive work independently; the quality of their joint output depended critically on how well they could share and integrate their respective knowledge.

The design response accordingly targeted the *interface between* the two roles: "the research team focused on designing a technology that would serve as an information-sharing and collaboration tool for both flight managers and weather forecasters." The geographic display with mission and weather information overlaid was not a tool for either individual — it was a tool for the joint cognitive system, supporting the coordination and integration that neither could do alone.

This reorientation — from designing for individual cognitive work to designing for joint cognitive work — is one of the most practically important contributions of the CSE framework.

## Situation Awareness as a Joint System Property

The paper traces situation awareness research from its origins in WWI fighter pilots to its modern applications in complex automated systems. The early definition captures the distributed nature of the challenge: "the pilot's need to observe the opponent's current move and anticipate the opponent's next move a fraction of a second before the opponent could observe and anticipate one's own."

What makes this definition interesting for joint cognitive system design is that it frames situation awareness as fundamentally relational and competitive: you need to know not just the state of the situation but what *other agents* in the situation know and what they are likely to do based on that knowledge. This is not a property of one agent's information processing — it is a property of the interaction between agents in a shared situation.

When advanced cockpit automation "brought increased potential for information overload," the CSE response was to design for situation awareness as a system property — ensuring that the human-machine joint cognitive system maintained adequate shared situational understanding, not just that the automation had accurate data.

For multi-agent AI systems, situation awareness as a joint property means: what does each agent in the system know? What does it *not* know? What assumptions is it making that other agents might correct? Where are the gaps between what the system as a whole knows and what any individual agent can access? These are not questions about individual agent performance — they are questions about the cognitive architecture of the joint system.

## Coordination and Information Flow as Design Variables

The paper's Work-Centered Design framework emerged specifically from observing "stove-piped technologies within large military socio-technical systems" where "multiple databases, collaborative systems, and decision support systems... used different interface design conventions. This lack of a unifying structure resulted in unneeded complexity and increased likelihood of error as users were required to maintain expertise not only in the content area of the job... but also in how to use a broad range of technological interfaces."

This is a systems-level failure: individually functional components that collectively degrade the performance of the joint cognitive system because they do not share a coherent information architecture. The cognitive cost of navigating interface heterogeneity is real and cumulative — it consumes cognitive resources that should be available for the actual work.

The Work-Centered Design response is a "First-Person Perspective principle suggesting that the worker's terminology should be used as information elements in the interface display" — creating a unified vocabulary that spans the components of the system and reduces the translation cost that practitioners otherwise bear.

For AI agent systems, the analogous design challenge is ensuring that the 180+ skills in a system like WinDAGs share coherent representations, vocabulary, and information formats — not just technically but cognitively. When one agent produces an output that another agent must consume, the question is not only whether the data is technically compatible but whether it carries the semantic structure that the receiving agent needs to use it effectively. Stove-piped AI skills that use different internal representations and produce outputs in incompatible formats impose the same kind of cognitive coordination cost on the orchestration layer that incompatible military systems imposed on human operators.

## Designing Automated Systems as Team Players

The paper references Christoffersen and Woods's work on "strategies for making automated systems team players." This framing is crucial: in a joint cognitive system, automation is not a replacement for human cognitive work but a *participant* in the joint system — a participant that has specific capabilities, specific limitations, specific knowledge, and specific failure modes that the other participants (human and technological) must be able to anticipate and work with.

An automated system that is *not* a good team player is one that:
- Takes action without making its reasoning visible to other system participants
- Fails in ways that are surprising and non-diagnostic (automation surprises)
- Does not signal its own uncertainty or confidence level
- Cannot be effectively monitored or overridden by human participants
- Assumes competencies that other system participants do not actually have

An automated system that *is* a good team player:
- Makes its actions and reasoning visible to other participants
- Fails gracefully and informatively — failures signal what went wrong and why
- Communicates confidence and uncertainty as part of its outputs
- Supports human monitoring and intervention at appropriate granularity
- Takes into account the cognitive state and workload of the other participants it is coordinating with

This framework applies directly to agent orchestration: each agent in a WinDAGs system is a participant in a joint cognitive system, and the quality of the system as a whole depends on how well each agent supports the cognitive work of the agents and humans it coordinates with — not just on how well each agent performs its own task.

## Implications for Multi-Agent Orchestration

**Implication 1: Design for the joint system, not for individual agents.** The performance metrics that matter are system-level cognitive outcomes: does the system as a whole maintain adequate situational understanding? Does it coordinate effectively? Does it produce outputs that human operators can use? These cannot be inferred from individual agent performance alone.

**Implication 2: Coordination is cognitive work, not overhead.** The tendency to treat coordination between agents as a logistical problem (routing, scheduling, interface formats) rather than a cognitive problem (shared understanding, joint situation awareness, distributed knowledge integration) underestimates the cognitive demands of multi-agent work and produces systems that coordinate efficiently in nominal cases but fail catastrophically in complex ones.

**Implication 3: Information flow should be designed around cognitive needs, not technical convenience.** What information does each agent need from other agents to perform its cognitive work? What is the minimal representation that preserves the information needed while reducing the translation cost? These questions should drive interface design between agents, not just technical compatibility.

**Implication 4: The human-AI interface is part of the joint cognitive system.** Human operators who monitor, audit, or collaborate with the agent system are participants in the joint cognitive system. Their cognitive needs — for situation awareness, for appropriate confidence signals, for ability to intervene effectively — are design requirements for the system, not add-ons.

**Implication 5: Model the joint system's failure modes, not just individual agent failures.** A joint cognitive system can fail in ways that no individual component fails — through coordination breakdown, through gaps in shared understanding, through automation surprises that emerge at the interfaces between components. Failure mode analysis must be conducted at the system level.