# Vision Sets and Perceptual Boundary Design: What Agents Can and Cannot Know

## The Vision Set Concept

A central computational construct in the Big Brother Logic framework is the **vision set**: for a given camera agent a at a given position and orientation, the vision set is the set of all entities (other cameras, the red ball) that a can currently see, plus — and this is the crucial extension — the set of all possible vision sets that a *could have*, across all possible orientations.

More precisely: the vision set captures not just current observation but the *range of observable outcomes* accessible to the agent from its current position. This range determines what the agent can learn by rotating — what observational states are achievable — and thereby what the agent can possibly know.

This concept is more general than "field of view." It is a description of the agent's *epistemic potential* — the space of knowledge states it could occupy given its physical position and capabilities.

## Why Perceptual Boundaries Are Epistemic Boundaries

In the camera surveillance scenario, the physical boundary of an agent's field of view is simultaneously its epistemic boundary. What the camera cannot see, it cannot know (directly). This seems obvious, but the implications are profound:

**Implication 1: Agent knowledge is physically grounded.**
What an agent can know is constrained by what it can perceive. No amount of intelligence or reasoning can give an agent knowledge of facts that are beyond its perceptual reach, unless another agent communicates those facts.

**Implication 2: Perceptual overlap determines knowledge overlap.**
Two agents whose fields of view overlap have shared observations and can develop consistent knowledge of the overlapping region. Two agents whose fields of view are entirely disjoint have entirely separate epistemic worlds and cannot share knowledge without communication.

**Implication 3: Perceptual architecture determines coordination architecture.**
The design of what each agent can perceive determines what each agent can know, which determines what kinds of coordination are possible without communication overhead. Getting the perceptual architecture right is getting the knowledge architecture right.

## Designing Agent Perceptual Boundaries in Software Systems

In software-based agent systems (as distinct from physical camera robots), "perception" is defined by what information each agent receives as input. The perceptual boundary of a WinDAGs agent is determined by:

- What task parameters are passed to it
- What prior task outputs it has access to
- What tools and APIs it can query
- What context it is given at invocation time

Designing an agent's "vision set" in this sense means asking: given the information we give this agent, what can it know? What is necessarily invisible to it? And does the invisible correspond to things it doesn't need to know, or things it critically needs but doesn't have access to?

The Big Brother Logic framework's approach to vision sets suggests a formal analysis:
1. **Enumerate the agent's information sources** (analogous to camera field of view)
2. **Determine what world states are distinguishable** given those sources (analogous to vision set)
3. **Identify what is necessarily unknown** to the agent from its information sources alone (analogous to epistemic blind spots)
4. **Design communication protocols** to fill the critical blind spots (analogous to allowing cameras to see each other)

## The Inferential Power of Observation: Knowing About Others from What You See

The paper highlights a sophisticated capability that truly distributed agents would need:

> "If a camera a1 sees another camera a2, a1 should be able to infer the direction of view of a2 from the image returned by the webcam of a1."

This is **observational inference about other agents' states** — deriving knowledge of another agent's internal configuration from observable signals. It's not just about what a1 sees in the environment; it's about what a1 can infer about a2's epistemic state by observing a2.

This principle generalizes: an agent can learn about another agent's state by:
- Observing the other agent's outputs
- Observing the other agent's behavior over time
- Observing what the other agent does and doesn't respond to
- Observing signals that the other agent emits about its internal state

For WinDAGs: Agent A can infer aspects of Agent B's state from:
- The format and content of B's outputs
- The latency of B's responses (indicating computational load or uncertainty)
- The confidence scores or uncertainty flags B attaches to its outputs
- The questions B asks (revealing what B doesn't know)
- The errors B produces (revealing the limits of B's knowledge or capability)

Designing agents that emit rich, informative signals about their epistemic state — and designing other agents that can read and interpret those signals — creates a form of distributed epistemic inference that doesn't require explicit communication of internal state.

## The Blind Spot Problem: What Agents Cannot See About Themselves

In the camera system, each camera can see other cameras but cannot see itself (specifically, cannot see its own forehead in the muddy children puzzle analogue — each child sees others but not themselves). This asymmetry — good knowledge of others' observable states, no knowledge of your own from the outside — is a general feature of agent systems.

Software agents have analogous blind spots:
- An agent may not know whether its own output is being interpreted correctly by downstream agents
- An agent may not know whether its reasoning is consistent with the reasoning of agents working on related sub-tasks
- An agent may not know whether its confidence in its outputs is calibrated correctly
- An agent may not know what knowledge the orchestrator has used to route tasks to it

These blind spots can only be filled by communication — by other agents or the orchestrator providing feedback about how the agent's outputs are being used and whether they are meeting requirements.

Design prescription: build explicit feedback loops from downstream agents back to upstream agents, informing the upstream agents about the quality, relevance, and impact of their outputs. This is the agent-system equivalent of cameras that can see their own orientation — it gives agents knowledge about their own epistemic performance.

## Varying Perceptual Access and Its Implications

In the camera system, the visual field of each camera is determined by its position and rotation. Different cameras at different positions have different perceptual access to different parts of the scene. This heterogeneity of perceptual access is a feature, not a bug — it means different cameras have different, complementary knowledge, and together they can cover the scene comprehensively.

For agent systems: heterogeneous perceptual access is the basis for the division of cognitive labor. Different agents are given access to different information, have different skills, and can address different aspects of a complex problem. The orchestration challenge is to cover the problem space without gaps — to ensure that every part of the problem is within at least one agent's "vision."

The Big Brother Logic framework provides a formal tool for analyzing whether coverage is complete: check whether the union of all agents' vision sets covers all relevant parts of the world. If some fact can be in no agent's vision set, no agent can directly observe it, and the system has a structural epistemic blind spot.

For WinDAGs: build a formal or semi-formal analysis of information coverage. For each piece of information required to solve the overall task, ensure that at least one agent has access to that information — and that there is a protocol for that agent to share it with agents that need it.

## The Moving Agent Challenge

The paper notes that mobile agents are a future research direction:

> "Another future work consist in handling mobile agents."

Mobile agents are interesting because their perceptual access changes over time. As the camera rotates, its vision set changes — facts that were invisible become visible, and vice versa. This temporal dynamics of perceptual access creates temporal dynamics of knowledge.

In WinDAGs, agents are effectively mobile in an abstract sense: as tasks proceed, agents receive new information (their "view" expands), and as context shifts, some previously relevant information may no longer be accessible (their "view" contracts). Building systems that track how agents' perceptual access (and therefore knowledge) evolves over the course of a task is an important open problem — and one that the Big Brother Logic framework's temporal extensions (combining epistemic and temporal logic) could address.

## Summary: Perceptual Architecture Is Knowledge Architecture

The deepest lesson from the vision set concept is: **the design of what agents can perceive is the design of what agents can know, which is the design of what coordination is possible.** There is no separation between the information architecture of an agent system (what data flows where) and its epistemic architecture (what agents know and can know). They are the same thing, viewed from different levels of abstraction.

Building excellent agent systems means designing information flow with epistemic intent: not just "does agent A get the data it needs to compute its output?" but "does agent A have enough information to know what it needs to know, to know what other agents know, and to act correctly in coordination with those agents?" The vision set formalism makes this question precise and computable. Even in systems where full formal analysis is impractical, the question itself — "what is in each agent's vision?" — is invaluable as a design guide.