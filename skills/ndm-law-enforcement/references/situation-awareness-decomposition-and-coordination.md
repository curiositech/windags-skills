# Situation Awareness, Problem Decomposition, and Coordination Without Full Understanding

## The Coordination Problem in Complex Systems

One of the deepest challenges in any complex system — whether human teams or multi-agent networks — is how to coordinate effective action when no single actor has complete understanding of the situation. In the NDM literature, this problem surfaces as the challenge of **shared situation awareness**: how do multiple decision-makers develop compatible enough models of a shared situation to coordinate effectively without requiring a central controller who understands everything?

In the police scenarios studied, this problem appeared even at the individual level. A single officer entering a scenario had to coordinate:
- Their own situation assessment (what is happening here?)
- Their action planning (what should I do?)
- Their anticipation of the subject's next moves (what will the subject do?)
- Their management of their own cognitive and emotional state (am I responding appropriately to what's actually here?)

This is already a multi-process coordination challenge before any second agent enters the picture.

## Endsley's Three-Level Situation Awareness Model

The Jones and Endsley (2000) error taxonomy developed for air traffic controllers provides a decomposition of situation awareness into three distinct cognitive levels, each of which can fail independently:

**Level 1: Perception**
What elements are present in the environment? The raw sensory inputs — positions, states, attributes of objects and actors in the scene. Failure at this level: missing data, misperceived data, attention on the wrong elements.

**Level 2: Comprehension**
What do these elements mean? What is the current state of the system? Integration of perceived elements into a coherent understanding of the situation. Failure at this level: incorrect mental model leading to misinterpretation of correctly perceived data; over-reliance on default values; failure to update model when new information arrives. This was the most common error mode in the air traffic control study.

**Level 3: Projection**
What will happen next? Given the current situation, what are the likely near-future states? Failure at this level: incorrect projection from correct comprehension; over-extrapolation of current trends; failure to account for near-term state changes.

The critical finding: **most errors occur at Level 2, not Level 1 or Level 3**. Decision-makers were perceiving data correctly and often projecting reasonably from their models — but the models themselves were wrong, causing systematic misinterpretation of correctly observed information.

This has profound implications for intelligent system design: the leverage point is in **comprehension** — the process of constructing a coherent model of the current situation from available data. Improving perception (more sensors, more data) or projection (better forecasting models) yields less improvement than improving the integration process that connects perception to model to action.

## Problem Decomposition Under Uncertainty

How do expert decision-makers break down complex, ill-defined problems into tractable sub-problems? The research provides a window into this through the analysis of major decision points.

Within each police scenario, four major decision points were identified as structural decompositions of the task:
1. **Entering the room** — tactical approach, announcing presence, weapon management
2. **Approaching the subject** — route, cover selection, distance management, timing
3. **Interacting with the subject** — command communication, situation assessment, negotiation
4. **Engagement and resolution** — use-of-force decision, de-escalation, arrest, or retreat

Each of these is a nested decision problem with its own sub-decisions. The approaching-the-subject decision alone contains: safe route, cover location, timing of announcement, stopping distance, environmental scan scope, weapon status.

**Expert decomposition is dynamic, not static.** Experts don't decompose the problem fully at the outset — they decompose it sequentially as the situation reveals itself. "Within each scenario, four major decision points were identified" — but these decision points are not all equally relevant in every scenario. Which decision points matter, and how they're framed, depends on what the situation turns out to be.

This is a critical difference from classical planning decomposition, which typically requires full problem specification before decomposition begins. NDM decomposition is opportunistic, incremental, and continuously revised.

**For agent systems**: Task decomposition in NDM-like environments should not be done fully at the outset. The architecture should support partial decomposition — identify the immediately tractable next decision point, address it, let the results refine the framing of the next decomposition. Full upfront decomposition commits to a problem structure that may be invalidated by what the execution reveals.

## The Quick Test as a Coordination Gate

In multi-agent systems, the quick test (Is delay acceptable? Are stakes high? Is the situation unfamiliar?) functions as a coordination gate: when an individual agent is uncertain whether to act or seek more information, this test determines whether the agent should:
- Act independently with current information
- Seek information from other agents before acting
- Escalate to a coordinating agent for higher-level guidance

The test is particularly valuable because it prevents two common coordination failure modes:
1. **Overcommunication/coordination bottleneck**: Every agent checks in with coordinators for every decision, creating bottlenecks and reducing system speed.
2. **Undercommunication/unilateral action**: Every agent acts independently, creating coordination failures when actions have interdependencies.

The quick test provides a principled middle ground: agents act independently when cost of delay is high or stakes are low or situation is familiar; they communicate and coordinate when delay is acceptable AND stakes are high AND situation is genuinely unclear.

## Distributed Situation Awareness

In team NDM environments, no single actor has complete situation awareness — each actor has a partial view. Effective team coordination requires:
1. **Compatible world models**: actors don't need identical models, but they need models that are consistent enough to generate compatible predictions
2. **Communication of assessment, not just action**: "I think this is a kidnapping scenario" is more coordinating than "I'm going to enter from the left" because it lets other agents update their own models
3. **Anomaly broadcasting**: when one actor perceives something that doesn't fit the team's shared model, broadcasting that anomaly is high-value coordination

"Multiple players (team factors) play an important role in many NDM situations, including many policing situations. Group decision processes encompass many additional processes" (p. 10).

The failure to communicate situation assessment (as opposed to action plans) is a systematic error in human teams and likely in agent systems. Actions communicate what is being done; assessment communication tells other agents *why* it is being done, enabling them to detect conflicts and inconsistencies.

**For agent orchestration**: Inter-agent communication protocols should include structured channels for situation assessment sharing, not just task assignment and result reporting. An orchestrator that receives only action outputs from agents — not their situational models — cannot detect when two agents are operating from incompatible models of the same situation.

## Coordination Without Central Understanding

The most challenging coordination problem is when no actor — including the coordinator — has full understanding of the situation. In the 9/11 context mentioned in the opening of this research, "decision making was severely hindered by lack of information and communication" — the critical failure was not that any individual actor made wrong decisions, but that actors could not coordinate because they were operating from fundamentally different situational models with no mechanism for reconciliation.

The NDM solution to this problem is not to require a central coordinator to achieve full understanding before coordinating action. It is to develop protocols that enable effective coordination under irreducible uncertainty:

1. **Make situational uncertainty explicit**: explicitly communicate what is unknown, not just what is known. "I don't know if there's a victim in the building" is coordination-relevant information.

2. **Coordinate through shared goals rather than shared action plans**: when situations are too uncertain for detailed coordination, coordinating around high-level goals (find and secure the victim; avoid casualties) allows independent agents to adapt their specific actions to local conditions while remaining aligned on objectives.

3. **Use anomaly signals as coordination triggers**: rather than requiring comprehensive shared understanding, trigger coordination when any actor detects a significant anomaly relative to the team's shared working model.

4. **Build in redundancy at decision points**: in high-stakes situations, multiple agents checking each other's situation assessments catches errors that individual agents miss.

## The Feedback Loop Architecture

Action feedback loops — where agent actions change the environment, which changes the information available, which changes the assessment, which changes subsequent actions — are a defining feature of naturalistic decision environments.

This is not a bug to be designed around — it is the fundamental structure of complex task environments. Agent systems that treat their interactions with the environment as one-way (action → result) rather than bidirectional (action → environment change → new information → updated model → next action) will fail to learn from their own interventions.

The architecture implication: every action should generate:
1. An intended outcome state (what the action was designed to achieve)
2. A monitoring expectation (what signals would indicate the action succeeded or failed)
3. A feedback integration process (how the result updates the working model)

This is the feedback loop structure that distinguishes expert decision-making in dynamic environments from novice rule-following. Novices execute actions. Experts execute actions *and* track their effects *and* update their models *and* revise subsequent actions accordingly. The loop is the mechanism of expertise in action.