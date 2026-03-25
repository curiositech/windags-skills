# Joint Cognitive Systems: Why the Unit of Analysis Must Be the Whole, Not the Parts

## The Fundamental Reframing

The most foundational conceptual move in Cognitive Systems Engineering — and in this paper by Militello et al. (2009) — is a shift in the unit of analysis from the individual component to the *joint cognitive system*.

The authors explicitly position CSE as having moved beyond early cognitive engineering, which "focused primarily on the one human–one computer dyad." CSE instead focuses on "teams of humans interacting within a larger work context" and recognizes that cognitive activities "rarely reside in one individual, but instead often happen in the context of teams, as well as within human-technology interactions." (p. 3)

The resulting concept — the **joint cognitive system** — is defined by Hollnagel and Woods (2005, p. 24), quoted in the paper: "In a single term, the agenda of CSE is *how can we design joint cognitive systems so they can effectively control the situations where they have to function.*"

This reframing has consequences that ripple through every aspect of system design. When you optimize for the individual component (the single human, the single agent, the single skill), you can easily produce systems where each part performs well and the whole fails — because the *integration* is where complex systems live or die.

## What Makes a System "Joint"?

A joint cognitive system is not merely a collection of agents that happen to share an environment. It has specific characteristics that distinguish it from a mere collection:

**Interdependence**: The components of a joint cognitive system depend on each other in ways that cannot be unilaterally removed. A flight manager and a weather forecaster are jointly dependent — each needs what the other knows, and neither can perform effectively without information from the other.

**Distributed cognition**: The cognitive work of the system is distributed across components. No single component holds all the relevant information, makes all the relevant decisions, or performs all the relevant functions. The system's intelligence emerges from how components interact.

**Shared goals**: The components of a joint cognitive system are oriented toward shared goals — but crucially, they may have different sub-goals, different information, and different perspectives. Coordination is the work of aligning distributed cognition toward shared goals.

**Social processes of collaboration**: The paper emphasizes that joint cognitive systems are "linked by human social processes of collaboration and shared goals." This is not incidental — the quality of collaboration determines the quality of joint cognitive system performance.

**Co-evolution**: Joint cognitive systems evolve as their components learn, their environment changes, and their goals shift. As the Global Weather Management case showed, even shortly after deployment, "goals and priorities, scale of operations, organizational structure, complexity of problems, information sources, and the physical layout of the workspace" had all changed.

## The Work-Centered Design Critique of Stove-Piping

The Work-Centered Design framework emerged specifically from a failure mode of joint cognitive systems: **stove-piping**. At the US Air Force's Air Mobility Command, researchers observed "multiple databases, collaborative systems, and decision support systems, each of which used different interface design conventions. This lack of a unifying structure resulted in unneeded complexity and increased likelihood of error as users were required to maintain expertise not only in the content area of the job... but also in how to use a broad range of technological interfaces." (p. 4)

Stove-piping is the failure mode that results from optimizing components independently. Each database, each collaborative tool, each decision support system was presumably designed by competent engineers to perform its specific function. But the *joint system* — the ensemble of components that workers actually operated within — was incoherent: inconsistent conventions, redundant information in incompatible formats, coordination overhead at every interface boundary.

This is not a theoretical concern. The cognitive costs of stove-piped systems are real and cumulative:
- Workers must maintain mental models of multiple systems simultaneously
- Context-switching between systems breaks attention continuity
- Information must be manually translated across system conventions
- Errors occur at interface boundaries where translations fail
- Expert knowledge developed within one system doesn't transfer to others

The solution is not to build a single monolithic system — that trades one failure mode for others (brittleness, inability to evolve, concentration of risk). The solution is to design the *joint system* explicitly, ensuring that the components are coherent at the level of the whole even as they remain modular.

## The Emergency Response Organization as Joint System Redesign

The nuclear power plant case is worth revisiting through the lens of joint cognitive systems. The problem the plant experienced was fundamentally a joint cognitive system failure:

- 80 people were present in the emergency response organization
- Most key decision-makers "were not making any decisions at all"
- Some personnel were "irrelevant to emergency responses"
- The emergency director was "a bottleneck" — a single point of failure in the joint cognitive system

This is a *coordination failure*, not a capacity failure. The joint system had more than enough cognitive capacity (80 people) but that capacity was not organized to effectively coordinate. The bottleneck was at the integration point — the emergency director who had to synthesize distributed information and make decisions that depended on what everyone else knew.

The solution was a joint cognitive system redesign: rearrange positions by coordination requirements (so that people who need to exchange information are proximate), establish shared situational awareness tools (the simple status board), and reduce personnel to those whose contributions are actually integrated into the joint system's functioning.

The result: a smaller, better-coordinated joint cognitive system outperformed the larger, poorly-coordinated one.

## Application to AI Agent Orchestration

### The Orchestration Layer IS the Joint System

In a WinDAGs-style agent orchestration system, the joint cognitive system is not any individual agent or skill — it is the entire ensemble of orchestrating agents, specialized skills, routing logic, shared memory, and coordination mechanisms. Optimization of individual skills in isolation will not produce an effective joint system if the integration points are poorly designed.

This means:

**Evaluate joint system performance, not just component performance**: A skill that performs well in isolation may degrade system performance if it produces outputs in formats that create coordination overhead for downstream agents, or if it fails to surface uncertainty in ways the orchestrating agent can use.

**Design information flows as first-class system elements**: In the Global Weather Management tool, the geographic display served as a *shared cognitive artifact* — a common representation that both flight managers and weather forecasters could use to integrate their different knowledge. Agent systems need analogous shared representations that enable different agents to coordinate without requiring a central coordinator to hold all state.

**Identify and eliminate bottlenecks in the cognitive coordination structure**: The emergency director bottleneck is a pattern that recurs in agent systems wherever a single agent must process information from multiple sources before any downstream action can proceed. Bottlenecks limit overall system throughput and create single points of failure. Design coordination structures that distribute the cognitive load.

### Stove-Piping in Agent Systems

The stove-piping failure mode manifests in agent systems as:

- **Inconsistent output formats across skills**: When each skill returns results in its own format, the orchestrating agent must maintain parsers and translation logic for every skill — cognitive overhead that scales as O(n) with the number of skills
- **Siloed context**: When sub-agents operate with only the information needed for their specific sub-task, they cannot contribute insights that emerge from the intersection of their domain with adjacent domains
- **Interface boundaries as failure points**: When agent A hands off to agent B, information loss, misinterpretation, and format errors are most likely at the interface — exactly where the joint system's coherence is most fragile

Design principles to prevent stove-piping:
- Establish a common information representation language that all agents can read and write
- Design handoffs explicitly as joint cognitive events, not just data transfers — include context, uncertainty, and goal relevance in every handoff
- Create shared situational awareness mechanisms (analogous to the status board in the nuclear plant redesign) that all active agents can consult

### Making Automated Systems Team Players

Christoffersen and Woods (2002), cited in the paper, developed strategies for "making automated systems team players." This framing is important: automation is not a substitute for joint cognitive system membership — it is a *participant* in the joint system, subject to the same coordination requirements as human participants.

An automated system (or an AI agent) that doesn't communicate its state, doesn't surface its uncertainty, doesn't signal when its assumptions are violated, and doesn't coordinate its actions with other system components is not a team player — it is an unpredictable actor that makes the joint system harder to coordinate.

For agent systems: **design every agent as a joint cognitive system participant**:
- Every agent should maintain and expose its current understanding of the task and its confidence in that understanding
- Every agent should signal when its assumptions are violated or when it encounters situations outside its reliable operating range
- Every agent should produce outputs that are useful not just to the immediate task but to the coordinating context

### The "Finish the Design" Principle at System Level

The Global Weather Management tool was designed to allow users to "finish the design" — to adapt the tool to changing conditions without requiring a new development cycle. This principle applies at the joint cognitive system level as well.

No orchestration system design can anticipate all the ways that its agent ensemble will need to coordinate. The joint system design should therefore expose enough flexibility that the system can self-organize as it learns what coordination patterns work — through mechanisms like:
- Agents updating routing heuristics based on downstream feedback
- The orchestrator learning which skill combinations tend to produce high-quality joint outputs
- The system detecting coordination bottlenecks dynamically and adjusting load distribution

The joint cognitive system is not built once. It co-evolves with the tasks it addresses, the agents it incorporates, and the capabilities it develops. Design for that evolution.