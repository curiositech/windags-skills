# Distributed Decision Making: Coordination Without Central Understanding

## The Wildland Fire Study as a Model of Distributed Cognition

Study 2 in the Klein/Calderwood research program investigated decision making not within a single commander's cognition but across a distributed team of seventeen highly experienced incident commanders managing a large wildland fire. The Incident Command System (ICS) — under which this team operated — is a model of distributed command-and-control under extreme uncertainty, information scarcity, and high consequences.

What they found challenges naive assumptions about how coordination requires shared understanding, central oversight, and unified information.

"Many of the complications of distributed decision tasks we had anticipated did not occur. There was little problem with information overload. Communication channels were limited but were used effectively. There was open communication about differences in the way situations were perceived and goals were formulated, but these were controlled so as to maintain team cooperation and morale."

This is remarkable. Seventeen experts, operating across a massive fire perimeter with limited communications, were coordinating effectively without a central controller who understood everything. How?

## Recognition-Primed Coordination: Expertise as Shared Language

The key insight is that when multiple experts share a schema library — when they have been trained in the same domain and have accumulated similar case experience — their individual recognition-primed decisions tend to be compatible without requiring explicit coordination.

If Expert A and Expert B both recognize a situation as "type X," they will independently activate similar action queues, similar goals, and similar expectancies. Their independent decisions will tend to be complementary, not conflicting, because they are drawing on the same underlying domain knowledge.

This is coordination through shared expertise rather than coordination through explicit communication. Each individual makes recognition-primed decisions; because they share schemas, those decisions fit together.

This has an important corollary: coordination failures in expert teams often manifest as *disagreement about situation classification* rather than disagreement about option preferences. If Expert A classifies the situation as type X and Expert B classifies it as type Y, they will generate incompatible action queues — and their individual decisions will conflict even though each is internally coherent.

The wildland fire study found exactly this: "There was open communication about differences in the way situations were perceived and goals were formulated." The communication priority was shared situation assessment, not negotiated option ranking.

## Communication for Situation Assessment, Not Option Negotiation

In the distributed wildland fire command, communication served primarily to synchronize situation assessments — sharing cue observations, comparing expectancies, resolving classification disagreements — rather than to negotiate between independently-derived options.

This is the appropriate communication priority under RPD logic. If situation assessments align, action compatibility follows automatically through shared schemas. If situation assessments diverge, no amount of option negotiation will produce coherent coordination.

The implication for distributed decision systems: communication protocols should prioritize information sharing that supports situation assessment over information sharing that supports option evaluation. Sharing observations ("the fire is crowning on the east face") and expectancies ("I expect the wind to shift at 1400") is more valuable than sharing option preferences ("I think we should do X").

## Domain-Specific vs. Cross-Domain Coordination

The wildland fire study found an important asymmetry: recognitional strategies dominated "in areas in which they had the greatest expertise," while "for decisions involving organizational issues and interpersonal negotiations (28% of the incidents identified as critical), we found a predominance of analytical strategies in which several options were evaluated concurrently."

This is the expertise boundary effect: RPD works within a domain of expertise; cross-domain decisions (organizational structure, resource allocation, interpersonal dynamics) often require explicit analytical deliberation because no one has the same kind of schema-based expertise in these domains.

For distributed AI agent systems, this maps to a crucial architectural principle: agents operating within their trained domain should be configured for recognition-based fast paths; coordination and meta-level decisions (task allocation, priority setting, resource sharing between agents) may require more explicit deliberative protocols precisely because no single agent has domain-expert-level schema libraries for these coordination problems.

## The Role of Expectancy Sharing in Distributed Coordination

One of the most valuable things distributed agents can share is not actions or options but *expectancies*. An agent that shares its current situation assessment and its expectancies about what will happen next enables other agents to:

1. Check whether their own situation assessments are compatible
2. Detect expectancy violations more quickly (by having multiple observers)
3. Anticipate where their own actions need to interface with others' anticipated actions

Expectancy sharing is lightweight (a small structured data packet: "I assess situation as type X; I expect Y to happen by time T; my planned action is Z") and information-dense. It communicates the essential cognitive state without requiring the receiver to reconstruct the sender's full situation model.

In the wildland fire incident, the most critical communications were essentially expectancy broadcasts: "I expect the fire to crown on the east face by 1200" or "my crews won't be in position to build a line at that location by 0600." These expectancies allow other commanders to adjust their plans without requiring a central coordinator to model the entire situation.

## When Coordination Requires Central Control

The RPD-based distributed coordination model breaks down under specific conditions:

**Genuine novelty**: If the situation is novel enough that different experts activate different (and incompatible) schemas, shared domain expertise no longer produces compatible decisions. Explicit coordination is required to reach a common situation assessment.

**Time-sensitive interdependencies**: When individual decisions must be tightly synchronized in time — not just compatible in direction but executed in a specific sequence — the implicit coordination of shared schemas may not be precise enough. Explicit communication and orchestration is required.

**Resource contention**: When multiple agents need the same resource simultaneously, implicit coordination fails even if their situation assessments are identical. Resource allocation requires explicit deliberation.

**Novel domains**: When expertise has not been built up — when agents are operating in domains where schemas are weak — the shared expertise basis for implicit coordination doesn't exist. These cases require explicit analytical coordination.

Understanding these boundary conditions is as important as understanding when implicit coordination works.

## Application to Multi-Agent System Design

**Schema Alignment as a Coordination Infrastructure**: In multi-agent systems where agents share a domain, ensuring schema alignment — common situation typologies, common cue interpretations, common action queues for each type — reduces the need for explicit inter-agent coordination. Agents with aligned schemas will make independently-generated decisions that fit together.

**Situation Assessment Broadcasting**: Design agents to broadcast their current situation assessment and expectancies, not just their intended actions. Receiving agents can use this information to detect classification conflicts early (before incompatible actions are executed) and to calibrate their own situation models.

**Conflict Detection at the Classification Level**: When two agents have incompatible situation assessments, this is a higher-priority conflict than when they have compatible assessments but different option preferences. Agent coordination protocols should check situation assessment compatibility before option compatibility.

**Domain-Specific Fast Paths, Meta-Level Deliberation**: Design your agent coordination architecture with different protocols for within-domain decisions (RPD fast path, rely on shared schemas) and cross-domain/meta-level decisions (explicit analytical coordination). Don't apply the same coordination protocol uniformly.

**Expectancy-Based Conflict Prediction**: Agents that share their expectancies enable the system to detect *anticipated* conflicts before they materialize. If Agent A expects to need Resource R at time T and Agent B expects to need Resource R at time T+5, the system can anticipate a sequencing conflict and resolve it before both agents are committed.

**Graceful Degradation Under Communication Loss**: Distributed systems designed on RPD principles should degrade gracefully when communication is lost, because individual agents continue making sensible recognition-primed decisions within their domain even without coordination signals. This is more robust than systems where agents require constant coordination signals to function.