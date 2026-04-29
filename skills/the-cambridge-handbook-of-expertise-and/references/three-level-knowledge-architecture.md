# The Three-Level Architecture for Expert Knowledge Representation

## Core Principle

When building intelligent agent systems, a fundamental error is treating "expert knowledge" as monolithic. Hoffman and Lintern's empirical work across domains—from weather forecasting to nuclear power plant operation—reveals that effective knowledge capture requires distinguishing three distinct levels of representation, each serving different purposes in system design.

## The Three Levels

### Level 1: Work Domain Structure (Functional Constraints)

This level represents the objective structure of the work environment—physical laws, organizational purposes, resource flows, causal relationships—independent of any particular worker or procedure. It answers: "What are the constraints and affordances of this domain?"

**Example from weather forecasting**: The physics of atmospheric convection, organizational mandate to issue forecasts within specific timeframes, available data sources (satellite, radar, weather balloons), geographical constraints of the forecast region.

**Elicitation approach**: Primarily document analysis supplemented by expert verification. Work Domain Analysis using Abstraction-Decomposition matrices captures this effectively.

**Use in agent systems**: Defines the possibility space for agent actions, establishes hard constraints, informs world modeling.

### Level 2: Practitioner Knowledge (Domain Concepts and Relations)

This level captures what experts know about domain entities, their properties, relationships, categories, and principles. It's conceptual knowledge—the semantic network in the expert's head. It answers: "What concepts does an expert have, and how are they related?"

**Example from weather forecasting**: "Cold fronts in the Gulf Coast region typically move southeast, bringing thunderstorms in summer but clear weather in winter. The sea breeze can stall a weak front. Frontal passage is indicated by wind shift, pressure rise, and temperature drop."

**Elicitation approach**: Concept Mapping proves most efficient, yielding 1-2 informative propositions per task minute. Structured interviews and domain concept sorting tasks also work well.

**Use in agent systems**: Builds semantic knowledge bases, informs natural language understanding, supports explanation generation, defines ontologies.

### Level 3: Reasoning Strategies (Decision-Making and Problem-Solving)

This level captures how experts actually think through problems—their decision strategies, perceptual cues they monitor, options they consider, metacognitive awareness, and problem-solving heuristics. It answers: "How does an expert reason in this domain?"

**Example from firefighting** (Table 12.2): "This is going to be a tough fire... It is 70 degrees now and it is going to get hotter [cue leading to anticipation of heat exhaustion]. The first truck, I would go ahead and have them open the roof up [action]. I am assuming engine 2 will probably be there in a second [anticipation]. I don't know how long the supply lay line is, but it appears we are probably going to need more water than one supply line is going to give us [cue-deliberation]. So I would keep in mind, unless we can check the fire fairly rapidly, consider laying another supply line [contingency planning]."

**Elicitation approach**: The Critical Decision Method—multi-pass retrospection on challenging cases using probe questions ("What were you seeing?" "What might someone else have done?"). Also: think-aloud protocols, tough case analysis.

**Use in agent systems**: Informs decision-making algorithms, guides attention mechanisms, supports strategy selection, enables adaptive behavior.

## Why This Matters for Agent Orchestration

**The Integration Problem**: Early expert systems failed partly because they conflated these levels. Procedural if-then rules tried to capture both domain structure AND reasoning strategies AND conceptual knowledge, resulting in brittle, opaque systems. Modern agent architectures must maintain these distinctions.

**For WinDAG-style systems**: 
- **World models** draw primarily on Level 1 (domain structure)
- **Skill libraries and knowledge bases** draw on Level 2 (conceptual knowledge)  
- **Planning and decision modules** draw on Level 3 (reasoning strategies)
- **Orchestration logic** must understand which level a particular skill or query addresses

**Practical implication**: When an agent struggles with a task, diagnosis requires asking: Is this a world model problem (Level 1—we don't understand the domain constraints)? A knowledge problem (Level 2—we lack key concepts or relations)? Or a reasoning problem (Level 3—we have the knowledge but don't know how to apply it)?

## The Activity Overlay Technique

Hoffman's weather forecasting work (Figures 12.2-12.3) demonstrates a powerful integration technique: Build the Level 1 domain structure, then overlay Level 3 reasoning trajectories showing how experts navigate through the abstraction-decomposition space. This reveals:

- Which domain elements experts actually attend to (vs. which exist in principle)
- The temporal sequence of information seeking
- Opportunistic problem-solving patterns
- Where experts spend cognitive effort

For multi-agent systems, this overlay technique can reveal:
- Natural decomposition boundaries (where expert attention shifts suggest subtask boundaries)
- Information dependencies (expert A needs output from expert B at this decision point)
- Coordination requirements (multiple experts examining same domain element suggests need for shared context)

## Boundary Conditions

**When the distinction blurs**: In highly proceduralized domains (assembly line work, routine clerical tasks), Level 3 reasoning may be minimal—experts mostly follow Level 1 constraints with Level 2 knowledge. The three-level distinction is most valuable in knowledge-intensive, judgment-heavy domains.

**When you need all three**: Any agent system attempting to replace or augment expert judgment needs all three levels. A system providing only Level 2 (knowledge lookup) fails when novel situations require reasoning. A system with only Level 3 (reasoning rules) fails when domain structure changes.

**Resource allocation**: In time-constrained projects, prioritize Level 3 (reasoning) elicitation—it's the hardest to reconstruct from other sources and the most critical for handling novel situations. Level 1 can often be extracted from documentation; Level 2 from textbooks and training materials. But Level 3—how experts actually think—exists primarily in experts' heads.

## Implications for Skill Design

When designing skills for an agent system:

- **Foundational skills** (data retrieval, calculation) primarily need Level 1 and Level 2
- **Judgment skills** (evaluation, assessment, diagnosis) critically need Level 3
- **Coordination skills** (orchestration, delegation) need all three levels properly distinguished

The architecture should make explicit which level(s) each skill draws upon, enabling meta-reasoning about gaps and appropriate skill composition.