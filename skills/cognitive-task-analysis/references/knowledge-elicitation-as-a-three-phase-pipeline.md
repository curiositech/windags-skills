# Knowledge Elicitation as a Three-Phase Pipeline: Capture, Analysis, Representation

## The Pipeline Architecture

Cognitive Task Analysis is not a single activity — it is a pipeline with three distinct phases, each with its own methods, failure modes, and quality requirements. Understanding this pipeline structure is essential for building systems that capture knowledge with fidelity.

Crandall, Klein, and Hoffman (2006) define the three phases:

**Phase 1 — Knowledge Elicitation**: Methods "used to collect information about 'what people know and how they know it: the judgments, strategies, knowledge, and skills that underlie performance'" (p. 10, as cited in Yates, p. 10). This phase produces raw data — verbal reports, behavioral traces, structured responses.

**Phase 2 — Data Analysis**: "The process of structuring data, identifying findings, and discovering meaning" (p. 21, as cited in Yates, p. 10). This phase transforms raw data into structured knowledge claims.

**Phase 3 — Knowledge Representation**: "The critical tasks of displaying data, presenting findings, and communicating meaning" (p. 21, as cited in Yates, p. 10). This phase produces the artifact — the concept map, the flowchart, the production rules, the training program — that encodes the knowledge for use.

The three phases are distinct but frequently entangled. "Many knowledge elicitation methods have analytical processes and representational formats embedded within the method" (Crandall et al., 2006, as cited in Yates, p. 23). A repertory grid, for example, integrates all three phases: the grid structure elicits knowledge, the rating procedure provides analysis, and the resulting matrix is a representation. This integration is efficient but obscures the separate quality requirements of each phase.

---

## Why Phase Boundaries Matter

Entanglement of phases creates a specific class of failure: **representation-driven elicitation**. When the representation format is chosen before elicitation begins (because the system already knows what format it needs), the elicitation process is unconsciously guided toward knowledge that fits that format.

Yates identifies this as "representation bias": "the analyst's choice of elicitation methods is influenced by the final representation and use of the results" (Cooke, 1992, as cited in Yates, p. 75).

Example: Building an expert system requires knowledge in IF-THEN production rule format. The analyst, knowing this, selects Concept Mapping and Repertory Grid because their outputs can be most easily converted to production rules. These methods produce predominantly declarative conceptual knowledge. The procedural knowledge underlying expert performance — which would require process tracing methods — is systematically underrepresented in the final system.

"Knowledge acquisition for expert systems appears to assume that expertise can be represented by conditional rules and seeks to capture declarative knowledge as an intermediate step" (Yates, p. 76). The intermediate step becomes the final product, and the system encodes a pale shadow of actual expert capability.

**The principle**: Choose elicitation methods based on the knowledge that needs to be captured, not based on the format in which it will eventually be stored. The representation format should be chosen after elicitation, to fit the knowledge, not before it.

---

## Phase 1: Elicitation Methods and Their Properties

The most frequently used elicitation methods, with their properties:

**Structured Interview** (most frequently cited, 135 occurrences in Stage 1 of Yates' study):
- Predetermined, often closed questions; no opportunistic follow-up
- Best for: specific declarative knowledge; verifying known information
- Weakness: misses context-dependent knowledge; constraining format prevents surfacing of unexpected expert knowledge

**Semi-structured Interview** (45 occurrences in Stage 2):
- Predetermined outline with opportunistic follow-up and branching
- Best for: broad knowledge capture with depth on important topics
- Weakness: knowledge type outcomes are variable and hard to predict; heavily dependent on interviewer skill

**Think-Aloud** (33 occurrences):
- Expert verbalizes perceptions, decisions, and actions while performing a task
- Best for: capturing knowledge that is currently in working memory during execution
- Weakness: misses automated knowledge below conscious attention threshold; verbalization may disrupt complex performance

**Process Tracing/Protocol Analysis** (44 pairings in Stage 2):
- Set of techniques tracing cognitive and decision-making processes through a problem
- Best for: capturing sequential decision-making and problem-solving structure
- Weakness: requires careful application to maintain theoretical validity; easily contaminated by interview-like elements

**Critical Decision Method** (9 occurrences):
- Expert recalls a challenging past experience; analyst elicits timeline, cues, decisions, alternatives
- Best for: capturing high-stakes decision knowledge in natural context; surfacing tacit cue-response patterns
- Weakness: retrospective reconstruction may distort actual decision processes

**Field Observations/Ethnography** (13 occurrences):
- Practitioners observed and interviewed in actual work environments
- Best for: ecological validity; capturing knowledge-in-use rather than knowledge-in-description
- Weakness: time-intensive; limited control; automated knowledge still invisible

**Retrospective/Aided Recall** (14 occurrences):
- Expert reports thoughts after task performance, sometimes with aids (recordings, transcripts)
- Best for: accessing knowledge about recently performed tasks without disrupting performance
- Weakness: subject to reconstruction biases; time gap reduces fidelity

---

## Phase 2: Analysis Methods and Their Affordances

Analysis methods transform raw elicitation data into structured knowledge claims. They are less often discussed but equally critical.

**Content Analysis** (37 occurrences):
- Organizes verbal reports into a priori or emergent categories
- Strength: flexible; applicable to any domain; can reveal unexpected patterns
- Weakness: category development is theory-dependent; inter-coder reliability issues common

**Diagram Drawing** (47 occurrences — the most frequently occurring analysis/representation method):
- Represents processes or states through flow charts, activity diagrams, system state diagrams
- Strength: visual representation facilitates communication and review
- Weakness: format constrains knowledge; process knowledge often distorted to fit diagram conventions

**Hierarchical Task Analysis** (11 occurrences):
- Decomposes tasks into hierarchy of actions, goals, sub-goals
- Strength: captures structural relationships in task knowledge
- Weakness: captures what (actions) better than why (decisions) or when (context)

**Grounded Theory** (5 occurrences):
- Organizes verbal reports into emergent categories not predetermined by analyst
- Strength: discovers unexpected knowledge structures; avoids premature closure
- Weakness: time-intensive; requires methodological rigor to maintain validity

**Information Flow Analysis** (9 occurrences):
- Develops flow chart of information and decisions required for system functions
- Strength: captures decision structure and information dependencies
- Weakness: imposes flow-chart structure on knowledge that may not naturally have that form

---

## Phase 3: Representation Formats and Their Implications

The representation format determines what users and downstream systems can do with the knowledge:

**Production Rules (IF-THEN format)**: Executable, clear decision structure, natural fit for expert systems. Limitation: distorts knowledge that is not genuinely condition-action in structure; imposes binary structure on continuous or contextual knowledge.

**Concept Maps**: Visual representation of concept relationships. Natural fit for declarative conceptual knowledge. Limitation: poor at representing temporal sequences or procedural knowledge.

**Hierarchical Task Decomposition**: Natural fit for procedural task knowledge. Limitation: loses contextual and conditional information.

**Narrative / Case-Based Representation**: Natural fit for tacit situational knowledge captured through Critical Decision Method. Limitation: not directly executable; requires interpretation to apply.

**Flowcharts and State Diagrams**: Natural fit for process knowledge. Limitation: imposes discrete state structure on what may be continuous or fuzzy transitions.

---

## The Integration Problem

The most significant practical challenge in the three-phase pipeline is maintaining coherence across phases. Several failure modes emerge at the phase boundaries:

**Elicitation-Analysis mismatch**: Using a formal elicitation method (e.g., Think-Aloud) and then analyzing results with a method calibrated for different data (e.g., Content Analysis rather than Protocol Analysis) produces results that misrepresent what was actually elicited.

**Analysis-Representation distortion**: Analysis that finds complex, contextual knowledge but forces it into a representation format (e.g., production rules) that cannot capture that complexity produces a representation that is cleaner than the underlying knowledge justifies.

**Vocabulary drift across phases**: Knowledge labeled one way during elicitation may be relabeled during analysis or representation, losing the original semantic content. Without explicit tracking, what appeared to be procedural knowledge during elicitation may end up represented as declarative knowledge.

---

## Transfer to Agent System Design

**Skills are pipelines, not monoliths.**

Every skill in an agent system is implicitly executing a pipeline: something analogous to elicitation (gathering relevant information), analysis (processing it), and representation (producing an output). Making this pipeline explicit — and ensuring the three phases are aligned — improves skill reliability.

**The three-phase structure applies to skill specification, not just skill execution.**

When defining a skill, the same three-phase logic applies: what information needs to be gathered about the task (elicitation), how should it be processed (analysis), and in what form should the result be expressed (representation). Conflating these phases during specification leads to skills that are hard to debug because failures could be in any phase.

**Phase handoffs require explicit validation.**

The most common failure points in the pipeline are phase boundaries. In agent systems: does the information-gathering phase produce data in a form that the analysis phase can actually use? Does the analysis phase produce results in a form the representation/output phase can communicate? These handoffs should be explicitly specified and validated.

**Representation format should not drive knowledge architecture.**

The format an agent uses to store or express knowledge (embedding, production rule, natural language, structured data) should be chosen to fit the knowledge, not to fit existing infrastructure. When infrastructure drives knowledge representation, the system optimizes for format-compatibility rather than knowledge-fidelity.

**Audit trails across pipeline phases support debugging.**

When a skill fails, knowing which phase failed and why requires visibility into the pipeline. Systems that only expose final outputs cannot diagnose phase-specific failures. Structured logging of intermediate phase outputs — what was gathered, how it was processed, what representation was produced — enables systematic improvement.