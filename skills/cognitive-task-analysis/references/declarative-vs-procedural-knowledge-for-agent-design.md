# The Declarative/Procedural Distinction: The Master Fault Line for Agent Knowledge Architecture

## Why This Distinction Is Not Optional

Every discussion of agent knowledge architecture eventually encounters a fundamental question: what kind of thing is this piece of knowledge? Is it a fact to be retrieved, or a skill to be executed? Is it something the agent can describe, or something the agent must do?

Yates (2007), drawing on Anderson's ACT-R cognitive architecture (1983, 1998, 2005), provides the most operationally precise framework available for answering this question. The declarative/procedural distinction is not merely terminological — it reflects a fundamental difference in cognitive structure, acquisition pathway, representation format, and failure mode.

Getting this distinction wrong in agent system design produces predictable failures that are very difficult to diagnose after the fact.

## Declarative Knowledge: What We Know

Declarative knowledge "corresponds to things we are aware we know and can usually describe to others" (Anderson & Lebiere, 1998, as cited in Yates, p. 32). In formal terms, it consists of propositions, temporal strings, and spatial images — cognitive units that encode elements in specific relationships.

Yates operationalizes declarative knowledge into three subtypes that are practically useful for agent system design:

**Concepts**: Objects, events, or symbols that share common attributes and are identified by the same name. Declarative knowledge of a concept means being able to define it and recognize instances of it.

**Processes**: A series of stages describing how something works — how a system evolves, how a disease progresses, how a market moves. Declarative knowledge of a process means being able to describe its stages.

**Principles**: Cause-and-effect or correlational relationships used to interpret events or circumstances. Declarative knowledge of a principle means being able to state the relationship.

Critically, Yates adapts Merrill's (1983) Component Display Theory to show that declarative knowledge is primarily associated with two activities: **remember/say** (retrieve and report) and a preliminary **use** function of classifying or recognizing instances. The key property is that declarative knowledge is relatively static — "facts, subjective beliefs, scripts, and organized passages" (Schunk, 2000, as cited in Yates, p. 33).

## Procedural Knowledge: What We Know How To Do

Procedural knowledge "represents 'how to do things.' It is knowledge that is displayed in our behavior, but that we do not hold consciously" (Anderson & Lebiere, 1998, as cited in Yates, p. 33). It is structured as condition-action (IF-THEN) productions: IF this situation is recognized, THEN execute this action.

Yates operationalizes procedural knowledge into two subtypes:

**Classify procedures**: Grouping situations, objects, or events according to attributes. This is the application of conceptual knowledge — moving from "I know what X is" to "I can determine whether this situation is an instance of X."

**Change procedures**: An ordered sequence of steps necessary to accomplish a goal, solve a problem, or produce a product. This is execution — moving from recognition to action.

The critical property of procedural knowledge is dynamism: "Procedural knowledge is transformational, in that the output is quite different than the input" (Gagné, 1985, as cited in Yates, p. 34). And crucially: "the activation of procedural knowledge increases with practice, until it becomes fast and automatic" (p. 34).

This is the gateway to automated knowledge — the compiled, unconscious form of expertise discussed in the companion document on invisible knowledge.

## The Performance-Content Matrix: A Classification Framework

Yates deploys Merrill's (1983) Performance-Content Matrix as a practical tool for classifying any piece of knowledge by both what kind it is (content type) and what level of cognitive operation it requires (performance level). The matrix coordinates:

**Performance Levels**:
- *Remember*: Retrieve and report stored information (recognize or reproduce)
- *Use*: Apply an abstraction to a specific case (classify a concept, troubleshoot a process, create from a principle, perform a procedure)
- *Find*: Derive or invent a new abstraction (for agent systems, this is the highest-level generalization capability)

**Content Types**: Fact, Concept, Process, Principle, Procedure

The matrix generates 15 cells, each representing a specific type of cognitive operation. Critically, Yates notes an adaptation of Merrill's system that collapses this to practical guidance:

| Type | Remember/Say | Use/Apply |
|------|-------------|-----------|
| Concept | Define an object, event, or symbol | Classify objects, events, or symbols |
| Process | Describe the stages | Troubleshoot a system |
| Principle | Identify cause and effect | Create a new instance |
| Procedure | List steps | Perform steps |

This table is among the most immediately actionable frameworks in the book for agent system designers. It makes explicit that there are two categorically different things you can do with each type of knowledge — and that "know about" and "know how to use" require entirely different agent capabilities.

## Why the Distinction Breaks Down in Practice — and Why This Matters

Yates documents a critical empirical finding: "the application of the methods have been associated more with declarative knowledge than procedural knowledge" (p. 77) across 154 CTA studies. Fully 75% of knowledge outcomes in the literature are classified as declarative, versus 25% procedural.

This is almost certainly a methodological artifact, not a feature of expert knowledge itself. The most commonly used CTA methods — interviews, concept mapping, document analysis — are inherently better at surfacing declarative knowledge. Experts can describe concepts and processes in interviews. They cannot easily describe their IF-THEN rules, because those rules have been compiled into unconscious automaticity.

The field, in other words, has been systematically producing declarative maps of expert knowledge while the procedural and automated knowledge remains largely uncaptured. This is precisely the knowledge that determines performance in high-stakes situations.

For agent systems, this creates a specific architectural risk: **an agent trained primarily on declarative knowledge about a domain will perform well on structured, well-defined tasks that require information retrieval and reasoning about explicit facts, but will fail on tasks that require the rapid pattern recognition, situation classification, and condition-action execution that characterize expert performance under pressure.**

## Representation Bias: The Expert System Problem

Yates identifies a particularly important failure mode he calls **representation bias**: "the analyst's choice of elicitation methods is influenced by the final representation and use of the results" (p. 75). When knowledge is being acquired for expert systems (the largest application category in his dataset, 49% of studies), there is pressure to represent everything as condition-action rules for computer implementation. This causes analysts to:

1. Select methods that produce more formal, structured outputs
2. Represent declarative knowledge (concepts, processes, principles) *as if* it were procedural (IF-THEN rules)
3. Confuse the representation format with the knowledge type

The result is systems that look procedurally complete but are actually declarative knowledge formatted as procedures — which behaves differently in novel situations than genuine procedural expertise.

Modern AI agent systems face an analogous representation bias. Large language models are primarily trained on text — which is overwhelmingly declarative. When these systems are used in agentic contexts requiring genuine procedural execution, they frequently produce plausible-sounding declarative descriptions of what should be done rather than executing the underlying procedure. This is the same failure mode Yates documents, applied to a new substrate.

## Design Implications for Agent Systems

### 1. Knowledge Type Audit Before Architecture Decisions
Before designing how an agent will acquire, store, or use knowledge, identify the dominant knowledge type required for each task class. Use Merrill's table as a classification guide. Tasks requiring "troubleshoot a system" or "perform steps" need procedural capability; tasks requiring "define" or "describe stages" need declarative retrieval.

### 2. Separate Retrieval from Execution Pathways
An agent system should have distinct pathways for declarative retrieval (pattern matching against stored representations) and procedural execution (condition-action chains that transform situations into outputs). Conflating these pathways produces systems that describe procedures accurately but execute them poorly — a common failure mode.

### 3. Test for Knowledge Type Under Pressure
A system that knows a procedure declaratively ("list the steps") may fail to execute it correctly when contextual cues are ambiguous or when steps must be sequenced dynamically. Testing should include scenarios that require the *apply* column of Merrill's table, not just the *remember/say* column. Agents that pass declarative tests but fail application tests have a specific type of knowledge gap that is diagnosable using this framework.

### 4. Procedural Knowledge Requires Condition Specification
Any procedural knowledge loaded into an agent system should be specified in IF-THEN format rather than as declarative descriptions of what to do. "When blood pressure drops below 80 systolic in a post-surgical patient, immediately notify attending physician and initiate fluid resuscitation protocol" is procedural. "Blood pressure management is important in post-surgical patients" is declarative. Only the procedural form will drive correct behavior under novel conditions.

### 5. The Find Level Requires Compositional Reasoning
Merrill's "find" performance level — deriving or inventing new abstractions — is the highest cognitive operation and corresponds to generalization, transfer, and creative problem-solving. This capability requires that an agent can operate with deep understanding of principles (the causal relationships between concepts), not just surface familiarity with facts. Agent systems that need to handle genuinely novel situations must be architected with this level in mind — which typically means richer representation of causal structure, not just more facts.

## Boundary Conditions

The declarative/procedural distinction is most operationally useful when:
- The task domain has genuine procedural expertise (i.e., condition-action rules that experts have compiled through practice)
- The agent needs to perform under time pressure or with incomplete information
- Knowledge transfer between agents or to human users is required

The distinction matters less when:
- All required knowledge is genuinely declarative (reference lookup, factual question answering)
- Tasks are fully specified and leave no room for judgment or classification
- The performance standard is "accurate description" rather than "correct execution"

## Summary

The declarative/procedural distinction is the deepest structural feature of expert knowledge. Confusing the two in agent system design produces systems that sound like experts but don't perform like experts — systems that can explain a procedure but fail to execute it when conditions are messy, systems that can retrieve the right rule but cannot recognize the situation that triggers it. Yates's framework, grounded in Anderson's ACT-R architecture and Merrill's CDT, provides a practical, testable vocabulary for getting this right.