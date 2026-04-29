# Declarative vs. Procedural Knowledge: The Architecture of What Agents Need to Know

## Why the Distinction Matters More Than It Appears

All knowledge is not the same kind of thing. This is not merely a philosophical observation — it has direct, measurable consequences for how knowledge is acquired, stored, retrieved, and applied. Systems that conflate declarative and procedural knowledge — treating both as "things to look up" or "facts to retrieve" — will perform well on simple tasks and fail systematically on complex ones.

Cognitive Task Analysis research, as synthesized and extended by Yates (2007), provides a practical framework for understanding the distinction and its implications for intelligent systems.

---

## The Fundamental Architecture

**Declarative Knowledge** (Anderson, 1983) is knowledge about things — facts, concepts, processes, principles. It corresponds to "knowing that." It is stored as cognitive units in an associative memory network. It can be verbalized. It can be taught through description.

Declarative knowledge is organized into subtypes with different structures and uses:
- **Facts**: Arbitrarily associated pieces of information (names, dates, specific instances)
- **Concepts**: Objects, events, or symbols sharing common attributes, identified by the same name
- **Processes**: Sequences of stages describing how something works, a series of events
- **Principles**: Cause-and-effect or correlational relationships used to interpret events or create new instances

The critical characteristic of declarative knowledge: "the activation of declarative knowledge is slower and more conscious" (Gagné, 1985, as cited in Yates, p. 34).

**Procedural Knowledge** consists of condition-action (IF-THEN) pairs called productions (Anderson, 1983). It is knowledge that is "displayed in our behavior, but that we do not hold consciously" (Anderson & Lebiere, 1998, as cited in Yates, p. 33). It corresponds to "knowing how."

Procedural knowledge subtypes:
- **Classify procedures**: Grouping things, events, or symbols according to attributes
- **Change procedures**: Ordered sequences of steps to accomplish a goal, solve a problem, or produce a product

The critical characteristic of procedural knowledge: "the activation of procedural knowledge increases with practice, until it becomes fast and automatic" (Gagné, 1985, as cited in Yates, p. 34).

---

## How Declarative Becomes Procedural

This transformation is one of the most important dynamics in expertise acquisition, and it has direct implications for how agent capabilities should be built.

The process, called **knowledge compilation**, has two components:

**Proceduralization**: "As a task is performed, interpretive applications are gradually replaced with productions that perform the task directly... explicit declarative knowledge is replaced by direct application of procedural knowledge" (Anderson, 2005, as cited in Yates, p. 33). A medical intern who must consciously recall the steps for central venous catheter placement eventually reaches a point where those steps fire automatically in response to the clinical situation.

**Composition**: "Sequences of productions may be combined into a single production... Together, proceduralization and composition are called knowledge compilation, which creates task-specific productions during practice" (Yates, p. 33). What was ten steps becomes three becomes one.

The result: "The process of proceduralization affects working memory by reducing the load resulting from information being retrieved from long-term memory" (Yates, p. 33-34). Expert performance is fast, fluid, and low-effort not because experts are smarter, but because they have converted expensive declarative retrieval into cheap procedural execution.

---

## Merrill's Performance-Content Matrix: A Practical Classification Tool

Yates builds on Merrill's (1983) Component Display Theory to provide a two-dimensional classification of knowledge that is directly useful for system design:

**Performance Dimension**:
- **Remember**: Search memory to reproduce or recognize stored information
- **Use/Apply**: Apply an abstraction to a specific case
- **Find**: Derive or invent a new abstraction

**Content Dimension**:
- Facts, Concepts, Processes, Principles, Procedures

The power of this matrix is the intersection. It predicts what type of cognitive activity is required for a given task, which in turn guides both elicitation and representation:

| Type | Remember/Say | Use/Apply |
|------|-------------|-----------|
| Concept | Define an object, event, or symbol | Classify objects, events, or symbols |
| Process | Describe the stages | Troubleshoot a system |
| Principle | Identify cause and effect | Create a new instance |
| Procedure | List steps | Perform steps |

(Yates, p. 39, adapted from Merrill, 1983 with Clark modifications)

**The critical insight**: The same knowledge type has completely different requirements depending on whether it needs to be remembered or applied. An agent that can *describe* a diagnostic process (Remember/Process) has a completely different capability requirement than one that must actually *troubleshoot a system* (Use/Process). Most knowledge specification conflates these two performance levels.

---

## The Empirical Gap: Why Procedural Knowledge Is Systematically Undercaptured

One of the most striking findings in Yates' study is the **lopsided association between CTA methods and knowledge types**:

- 89 method pairings (32.25%) were associated with declarative knowledge only
- Only 17 (6.16%) were associated with procedural knowledge only  
- 170 (61.59%) were associated with both

More significantly, across all knowledge subtype coding:
- Concept associations: 218
- Process associations: 123
- Principle associations: 19
- Classify procedure associations: 77
- Change procedure associations: 46

**Declarative knowledge outcomes dominated: 75% of associations were declarative, only 25% procedural** (p. 71).

This is not because expert performance is mostly declarative. It is because the methods most commonly used — interviews, concept mapping, document analysis — are better suited to eliciting declarative knowledge. The methods best suited to procedural knowledge (process tracing, think-aloud protocols, critical decision methods) are less frequently used or less correctly applied.

The consequence: **expert systems and agent systems built on this knowledge base systematically over-represent what experts know and under-represent what experts do**.

---

## Practical Implications for Representation Bias

Yates identifies "representation bias" as a specific failure mode: "the analyst's choice of elicitation methods is influenced by the final representation and use of the results" (Cooke, 1992, as cited in Yates, p. 75).

When a system requires knowledge in IF-THEN rule format, analysts tend to choose methods that produce IF-THEN-compatible outputs. This means conceptual elicitation techniques (Concept Map, Repertory Grid, Card Sort) are overused because their outputs are more easily converted to production rules — even though the underlying expertise may be heavily procedural.

The result: "knowledge acquisition for expert systems appears to assume that expertise can be represented by conditional rules and seeks to capture declarative knowledge as an intermediate step" (p. 76) — even when the actual expertise is deeply procedural.

For agent systems, this suggests: **the format in which you plan to store knowledge should not drive the method you use to elicit it**. The knowledge architecture should drive the representation format, not the reverse.

---

## Transfer to Agent System Design

**Skill specification requires separate treatment of declarative and procedural components.**

Every complex skill has both a declarative component (facts, concepts, processes, principles that inform judgment) and a procedural component (the actual execution sequences that accomplish the task). Conflating these in a single specification leads to skills that can explain what they're doing but can't actually do it well, or that execute mechanically without appropriate contextual judgment.

**Different knowledge types require different validation strategies.**

- Declarative knowledge can be validated by asking the agent to state, explain, or classify
- Procedural knowledge must be validated by observing execution on novel cases
- Automated procedural knowledge can only be validated by comparing behavioral outputs to expert behavioral benchmarks

**The remember/use distinction is critical for task decomposition.**

When decomposing a complex task, explicitly ask for each component: is this a remember task or a use task? Is the agent being asked to retrieve information, or to apply a procedure? The cognitive load, failure modes, and appropriate methods differ dramatically between these.

**Procedural knowledge should be elicited through execution, not description.**

For skills involving complex procedures, the highest-fidelity knowledge elicitation occurs when agents (or the experts they are built from) execute the procedure while simultaneously generating a trace — not when they describe the procedure from memory. Think-aloud and process tracing protocols exist for this reason.

**Working memory constraints are real.**

Anderson's ACT-R theory places cognitive units at 5 (±2) chunks in working memory (Miller, 1956). This constraint applies to how much context an agent can effectively work with at once. When procedural skills require maintaining more than 5-7 distinct considerations simultaneously, performance degrades. Complex procedures should be chunked into sub-procedures to keep working memory load manageable.