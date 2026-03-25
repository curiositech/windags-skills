## BOOK IDENTITY
**Title**: Towards a Taxonomy of Cognitive Task Analysis Methods: A Search for Cognition and Task Analysis Interactions
**Author**: Kenneth Anthony Yates (Doctoral Dissertation, University of Southern California, 2007)
**Core Question**: How can we systematically map the methods used to extract expert knowledge onto the types of knowledge those methods actually produce — and what does this tell us about how to build systems that replicate expert performance?
**Irreplaceable Contribution**: This dissertation is the only empirical study that systematically examined *what kinds of knowledge* (declarative vs. procedural, and their subtypes) result from *which pairings* of cognitive task analysis methods across 154 real studies. It reveals that expert knowledge has a hidden architecture — automated, tacit, and procedural components that even experts themselves cannot report — and that the methods used to capture knowledge systematically bias *what gets captured*. This is essential reading for anyone building systems that must replicate expert judgment.

---

## KEY IDEAS (3-5 sentences each)

1. **The Automation Gap**: Expert knowledge, through deliberate practice, becomes automated and unconscious (Anderson & Lebiere, 1998). When called upon to explain what they know, experts suffer systematic omissions of their most reliable and fastest-executing knowledge — precisely the knowledge that makes them expert. Any system that relies on self-report alone will inherit these gaps, producing a pale shadow of expert capability. The "curse of expertise" (Hinds, 1999) means experts are actively bad at explaining their own best knowledge.

2. **Knowledge Has Architecture**: Declarative knowledge ("knowing that") and procedural knowledge ("knowing how") are fundamentally different cognitive structures with different acquisition paths, different storage mechanisms, and different failure modes under elicitation. Procedural knowledge is further divided into classify procedures (grouping by attributes) and change procedures (ordered steps to accomplish goals). Understanding which type of knowledge a task requires is prerequisite to choosing how to capture or represent it.

3. **Method-Outcome Coupling**: Different elicitation methods produce systematically different types of knowledge. Concept mapping reliably produces declarative conceptual knowledge; process tracing/protocol analysis can produce both but requires careful application. The "differential access hypothesis" (Hoffman et al., 1995) holds that no single method captures the full knowledge landscape — and the empirical evidence confirms this: 75% of method pairings in the literature produced declarative knowledge results, while procedural knowledge was significantly undercaptured.

4. **Representation Bias Shapes Systems**: When the intended output format of a system (e.g., IF-THEN production rules for an expert system) influences which elicitation methods are chosen, the result is that knowledge is systematically distorted to fit the output format rather than accurately captured. This "representation bias" creates a circular trap: the system encodes what the format can express, not what the expert actually knows.

5. **Taxonomies Must Be Theory-Driven, Not Just Descriptive**: Classification schemes that organize methods by their mechanics (what they look like) rather than by their outcomes (what knowledge they produce) fail to guide practitioners effectively and impede scientific progress. Using Hempel's (1965) criterion, a scientifically useful taxonomy should allow *reduction* of categories over time as theory develops — not proliferation. The DSM comparison is damning: both CTA and the DSM suffered from category explosion for lack of an organizing theory.

---

## REFERENCE DOCUMENTS

### FILE: expert-knowledge-automation-gap.md
```markdown
# The Automation Gap: Why Experts Cannot Fully Report Their Own Expertise

## The Core Problem for Any System That Relies on Expert Input

When intelligent systems are built to replicate expert performance — whether those systems are AI agents, knowledge bases, training programs, or orchestration pipelines — they face a fundamental epistemological problem: **the experts whose knowledge they need to capture cannot fully report that knowledge**.

This is not a matter of expertise, willingness, or intelligence. It is structural. It follows from the basic mechanics of how expertise is acquired and stored.

As Yates summarizes from Anderson and Lebiere (1998): "As new knowledge is acquired and practiced, it becomes automated and unconscious. Thus, when called upon, experts are often unable to completely and accurately recall the knowledge and skills that comprise their expertise, resulting in significant omissions that can negatively impact instructional efficacy and lead to subsequent difficulties for learners" (p. 2).

The implication is stark: **if you ask an expert to describe how they do something, you will systematically miss the most valuable parts of what they know**.

---

## The Mechanism: Knowledge Compilation

The cognitive architecture underlying this phenomenon is well-established. Anderson's ACT-R theory describes a process called **knowledge compilation**, which has two sub-processes:

**Proceduralization**: Explicit declarative knowledge is gradually replaced by direct procedural application. The surgeon who once consciously recalled "check catheter type, check placement location, verify vessel identification" no longer retrieves these as propositions — they fire as automatic productions in response to perceptual cues.

**Composition**: Multiple sequential productions are combined into single composite productions. What was once a twelve-step conscious process becomes a three-step semi-conscious pattern, which then becomes a single fluid response.

The result: "Procedural knowledge represents 'how to do things.' It is knowledge that is displayed in our behavior, but that we do not hold consciously" (Anderson & Lebiere, 1998, as cited in Yates, p. 33).

When you ask an expert to introspect on a compiled procedure, they either:
1. **Reconstruct it declaratively** — producing an account that is formally plausible but not what they actually do
2. **Skip compiled steps** — producing an account with systematic gaps at precisely the high-expertise moments
3. **Over-simplify** — collapsing sophisticated pattern recognition into "I just know" or "it depends"

---

## Empirical Evidence: The Stakes Are Real

The dissertation assembles compelling evidence that these gaps are not trivial:

**Medical procedures**: Velmahos et al. (2004) compared surgical interns trained via traditional observation ("see one, do one, teach one") vs. training based on knowledge elicited through cognitive task analysis. Qualitative analysis showed that "those tasks requiring non-observable decision making, such as selection of the appropriate type of catheter and the placement location, were more likely to be made by participants in the control group" (p. 3). The traditional method failed precisely at the automated decision points.

**Neonatal nursing**: Hoffman, Crandall, and Shadbolt (1998) found that experienced neonatal nurses possessed diagnostic indicators that were "more elaborate and related more to perceptual judgments and alertness of shifts in the patients' conditions" than anything in the textbooks (p. 4). The textbooks captured declarative knowledge. The automated expert knowledge was nowhere in the official record.

**Military troubleshooting**: Schaafstal, Schraagen, and van Berlo (2000) showed that training based on CTA methods produced groups that solved problems in "at least 50% less time" and with dramatically higher systematic reasoning scores (4.64 vs. 2.60 on a 5-point scale) compared to controls (p. 4-5).

**Meta-analysis**: Lee's (2004) meta-analysis across domains showed CTA-based training produced effect sizes between .91 and 1.45, with a mean of d=+1.72 and an overall performance gain of 75.2% over comparison conditions (p. 5-6). These are extraordinary effect sizes — the difference between CTA-captured knowledge and conventionally captured knowledge is enormous.

---

## The Three Layers of Expert Knowledge

For practical purposes in building intelligent systems, it helps to distinguish three layers of expert knowledge:

**Layer 1: Articulable Declarative Knowledge**
What experts can say when asked. Facts, concepts, principles, general rules. This is what interviews, questionnaires, and textbooks capture. It is the least complete layer.

**Layer 2: Accessible Procedural Knowledge**
Step sequences that experts can reconstruct with prompting — not automatic enough to be invisible, but not naturally verbalized. Think-aloud protocols during task performance can capture some of this.

**Layer 3: Automated/Tacit Knowledge**
The compiled productions that fire below the threshold of conscious attention. Perceptual cues that trigger judgment. Pattern recognition that presents as intuition. This is the most valuable layer and the hardest to capture.

Yates notes: "Maximally effective approaches to CTA tend to be those that are organized around and guided by the desired knowledge results" (Chipman et al., 2000, as cited in Yates, p. 8). For systems requiring expert-level performance, Layer 3 is often the critical gap.

---

## Why Standard "Ask the Expert" Methods Fail

The dissertation identifies several specific failure modes in standard knowledge elicitation:

**Single Expert Reliance**: Early expert systems often relied on one expert "because only one was available or 'easier to work with'" (p. 73). A single expert's report covers only the fraction of their knowledge that is articulable. Multiple experts provide triangulation and prompt recall of omitted knowledge.

**No Iteration**: Without iterative review, experts cannot correct or supplement their initial reports. Memory for automated procedures is reconstructive — providing feedback on an initial account often triggers recognition of omitted steps.

**Wrong Methods for the Knowledge Type**: Using concept mapping (which excels at declarative conceptual knowledge) to elicit procedural troubleshooting knowledge will produce the wrong kind of output regardless of expert effort.

**Representation Bias**: When the analyst already knows what format the knowledge will be stored in (e.g., production rules), they unconsciously guide the elicitation toward knowledge that fits that format, systematically excluding knowledge that doesn't.

---

## What Actually Works: The Three Criteria for Sensitivity to Automated Knowledge

Yates operationalizes "sensitivity to automated knowledge" as meeting at least one of three criteria:
1. **Multiple experts** — comparing reports across domain practitioners reveals discrepancies that point to automated knowledge
2. **Iterative approach** — providing experts the opportunity to review and supplement previous results
3. **Multiple methods** — different elicitation techniques access different layers of knowledge

Of 154 studies examined, 132 (85%) met at least one criterion. This is encouraging, but it also means 15% of studies — nearly one in six — were capturing expert knowledge without any protections against the automation gap (p. 73).

---

## Transfer to Agent System Design

For WinDAGs and similar agent orchestration systems, the automation gap has direct implications:

**Skill specification is incomplete by default.** When skills are defined based on interviews with domain experts or review of documentation, the resulting specifications miss automated expert knowledge. Skills that "perform well in demos" may fail on edge cases that require compiled expertise.

**Agent self-report is unreliable.** An agent asked to explain its reasoning may produce a plausible reconstruction that does not reflect its actual processing. This is the AI equivalent of the automation gap. Confidence scores and explanations may be systematically misleading about the nature of the underlying process.

**Validation requires behavioral comparison, not just introspection.** The only reliable check on whether a skill captures expert-level knowledge is behavioral — comparing its outputs to expert outputs across diverse cases, especially those involving non-observable decision points.

**High-stakes skills need extra elicitation investment.** The meta-analysis effect size (d=+1.72) suggests that the difference between properly-captured and poorly-captured expertise is enormous. For skills in medical, legal, financial, or safety-critical domains, the cost of missing automated knowledge is high.

**Iterative refinement is not optional.** Skills should be built with feedback loops that allow domain experts to review outputs and flag omissions — not just to correct errors, but to surface the automated knowledge they couldn't report up front.

---

## The Curse of Expertise as System Design Constraint

Hinds (1999) coined "the curse of expertise" to describe how experts systematically underestimate how difficult tasks are for novices — precisely because they can no longer consciously access the knowledge that makes the task easy for them.

In agent systems, this curse manifests as: **experts who define skills believe they have specified the task completely, when in fact they have specified the easily-articulable fraction**. The remaining knowledge is invisible to them because it is invisible to themselves.

This is not a failure of the experts. It is the structural consequence of how expertise works. Building systems that replicate expert performance requires methods that go around the limitation, not better experts.

The correct response is methodological: use process tracing during actual task performance, use multiple experts, use iterative review, and always compare system outputs to expert behavioral benchmarks — not just to expert self-reports.
```

### FILE: declarative-vs-procedural-knowledge-in-agent-systems.md
```markdown
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
```

### FILE: method-selection-drives-knowledge-outcomes.md
```markdown
# The Differential Access Hypothesis: Method Selection Determines What Knowledge Gets Captured

## The Core Insight

Different methods for capturing knowledge do not merely differ in convenience or efficiency — they are **differentially sensitive to different types of knowledge**. This "differential access hypothesis" (Hoffman, Shadbolt, Burton, & Klein, 1995) is one of the most practically important principles to emerge from Cognitive Task Analysis research.

Yates' dissertation provides the first large-scale empirical examination of this hypothesis across 154 real studies, identifying which method pairings are actually associated with which knowledge outcomes. The results have direct implications for any system that depends on accurately specified knowledge.

---

## The Toolkit Metaphor

CTA is consistently described as a "practitioner's tool kit" (Cooke, 1999, p. 4). This metaphor is apt, but it can be misleading. A toolkit implies interchangeability — any hammer can drive any nail. The reality is closer to a surgical tray: using the wrong instrument produces the wrong result regardless of how skillfully you use it.

"As with any toolkit, the achievement of the desired outcome depends on the practitioner's understanding of what each tool accomplishes" (Yates, p. 11).

The problem: over 100 types of CTA methods have been identified, and existing classification schemes organize them primarily by mechanism (what they look like) rather than outcome (what they produce). This means practitioners choosing methods face "no clear guidelines... to choose the appropriate combination of methods to apply to a specific task or intended results, 'nor is it clear that an orderly relation exists between knowledge elicitation techniques and the type of knowledge that results'" (Cooke, 1994, p. 804, as cited in Yates, p. 7).

---

## The Three Families of Methods

Following Cooke (1994, 1999), CTA methods fall into three broad families:

**Observations and Interviews**: The least formal, most direct methods. Watching experts perform tasks; asking them questions ranging from free-flowing ("tell me everything you know about...") to highly structured (predetermined closed questions). Advantages: easy to conduct, flexible, accessible. Disadvantages: systematic omission of automated knowledge; subject to social desirability effects and reconstruction biases.

**Process Tracing / Protocol Analysis**: Techniques that capture sequential behavioral events as they occur, documenting cognitive processes through verbal reports, eye movements, and other behavioral traces. Core technique: think-aloud protocols, where the expert verbalizes perceptions, decisions, and actions while performing a task in real time. Theoretically grounded in the constraint that "a person can only verbalize that which is attended to in working memory" (Yates, p. 68). This is both the method's strength (it captures what's actually in working memory during execution) and its limitation (automated knowledge below the threshold of conscious attention is missed).

**Conceptual Techniques**: Methods producing structured, interrelated representations of relevant concepts within a domain. Includes concept mapping, repertory grid, card sorting, and clustering routines. These methods excel at capturing declarative conceptual knowledge — how experts organize their understanding of a domain. They are less suited to capturing procedural execution knowledge.

A fourth family, **Formal Models** (Wei & Salvendy, 2004), includes computational architectures like GOMS, ACT-R, SOAR, and COGNET — methods that formalize knowledge as executable cognitive models.

---

## What the Empirical Evidence Shows

Yates' analysis of 154 studies identified 1,010 method pairings, of which 276 (27%) clustered around 15 high-frequency pairings. The knowledge outcomes associated with these pairings reveal the differential access effect in action:

**Methods most associated with declarative knowledge only**:
- Document Analysis – Document Analysis (14 declarative, 2 procedural)
- Concept Mapping – Concept Mapping (14 declarative, 0 procedural)
- Structured Interview – Diagram Drawing (8 declarative, 0 procedural)
- Card Sort – Card Sort (7 declarative, 1 procedural)
- Repertory Grid – Repertory Grid (7 declarative, 2 procedural)

"These results were expected and consistent with the intended use of the methods found in the literature" (p. 69). These are methods designed for conceptual knowledge, and they produce conceptual knowledge reliably.

**Methods associated with both declarative and procedural knowledge**:
- Process Tracing/Protocol Analysis – Process Tracing/Protocol Analysis (7 declarative only, 3 procedural only, 34 both)
- Think Aloud – Process Tracing/Protocol Analysis (2 declarative only, 2 procedural only, 21 both)
- Semi-structured Interview – Diagram Drawing (4 declarative only, 2 procedural only, 15 both)

The process tracing family is the only approach that reliably reaches procedural knowledge — and even it produces predominantly mixed results rather than pure procedural capture.

**The subtype breakdown** reinforces this picture:
- Concept associations: 218 pairings
- Process associations: 123 pairings  
- Principle associations: only 19 pairings
- Classify procedure: 77 pairings
- Change procedure: 46 pairings

Principles — the most sophisticated form of declarative knowledge, enabling genuine understanding of cause-and-effect for creating new instances — are nearly invisible in the literature. Change procedures — the sequential steps that actually accomplish tasks — are the least captured procedural subtype.

---

## The Formal vs. Informal Method Distinction

The study identified four truly **formal methods** among the top 15 pairings:
1. Process Tracing/Protocol Analysis
2. Concept Mapping  
3. Repertory Grid
4. Card Sort

Formal methods have three characteristics: mechanisms are well-specified, they are intended to be applied systematically, and there is a substantial literature establishing their reliability and validity.

The remaining 11 high-frequency pairings are **informal** — less structured, more adaptable, but also less predictable in their outcomes.

"The findings indicate numerous haphazard pairings of methods that are ill-defined and result in the same knowledge type outcomes" (p. 81). This is a significant finding: informal methods, despite their flexibility, produce results that cannot be reliably predicted in advance. They may capture excellent knowledge, or they may not — and there is no systematic basis for knowing which.

For systems that require reliable knowledge of known types, formal methods should be preferred. For exploratory knowledge work, informal methods are appropriate as a first pass but should be followed by formal confirmation.

---

## The Method Contamination Problem

One of the more subtle findings concerns the contamination of formal methods by informal practices. Process Tracing/Protocol Analysis was found paired not only with itself (as the formal protocol requires) but also with Semi-structured Interview.

"Fundamental to Process Tracing/Protocol Analysis is the theory that a person can only verbalize that which is attended to in working memory. Thus, it would seem that interrupting the informant during task performance with questions would diminish or modify the results" (p. 68).

When practitioners mix a formal method with incompatible informal techniques, the theoretical basis of the formal method is undermined. The result may be labeled as "Protocol Analysis" in the literature but may not have the validity properties of true Protocol Analysis.

This suggests: **the label a method carries does not guarantee it was applied with fidelity to its theoretical foundations**. Method names in knowledge documentation should always be accompanied by descriptions of actual procedures, not just method labels.

---

## The Multiple Methods Imperative

Because no single method accesses the full knowledge landscape, the consistent recommendation throughout the CTA literature — from Bainbridge (1979) through Cooke (1994) through Crandall et al. (2006) — is to **use multiple methods**.

Bainbridge (1979) was among the first to observe that "different types of cognitive processing are most likely reported in different ways" and that "we are far from being clear about either the different types of cognitive process which exist or the best methods to use" (p. 432, as cited in Yates, p. 12).

The empirical basis for this recommendation: Chao and Salvendy (1994) demonstrated that three experts, queried with multiple methods, produced substantially more complete procedural knowledge than a single expert with any single method.

For agent systems, this translates directly to: **no single input channel is sufficient for high-fidelity knowledge capture**. Systems that rely on one source (a single expert, a single documentation source, a single evaluation pass) will have systematic blind spots that mirror the blind spots of their elicitation method.

---

## Matching Methods to Knowledge Targets: A Decision Guide

Based on Yates' empirical findings and the underlying theory:

**To capture declarative conceptual knowledge** (what things are, how they're categorized, what they're called):
- Concept Mapping (formal, highly reliable for concepts)
- Card Sort (formal, reliable for categories and relationships)
- Repertory Grid (formal, produces construct-element relationships)
- Structured Interview with Diagram Drawing (less formal but flexible)

**To capture declarative process knowledge** (how things work, what the stages are):
- Semi-structured Interview with Diagram Drawing (flexible, captures process descriptions)
- Document Analysis with Diagram Drawing (good for documented processes)
- Process Tracing with Diagram Drawing (captures actual process execution)

**To capture procedural knowledge** (how to do things, execution sequences):
- Think Aloud with Process Tracing/Protocol Analysis (highest fidelity for accessible procedural knowledge)
- Semi-structured Interview with Process Tracing/Protocol Analysis (broader capture including contextual knowledge)
- Critical Decision Method (captures decisions and their triggers in realistic scenarios)

**To reach automated/tacit knowledge** (requires meeting at least one sensitivity criterion):
- Use multiple experts to triangulate
- Use iterative review to prompt recognition of omitted knowledge
- Use multiple methods from different families
- Use behavioral observation rather than self-report wherever possible

---

## Transfer to Agent System Design

**Skill building should specify target knowledge types before selecting methods.**

Before defining how a skill will be built, specify: what type of knowledge does this skill require? Declarative concepts? Process understanding? Procedural execution? Tacit pattern recognition? The answers determine which approaches will be adequate.

**Routing decisions require procedural knowledge, not just declarative knowledge.**

An agent deciding which of 180+ skills to invoke is executing a classify procedure — grouping situations according to attributes that match skill profiles. This is procedural knowledge. A routing system built solely on declarative descriptions of skills will be less reliable than one built on procedurally-specified routing rules derived from actual routing decisions.

**Evaluation should match the knowledge type.**

Evaluating an agent's factual knowledge with a quiz is appropriate for declarative knowledge. Evaluating its ability to troubleshoot, diagnose, or create novel instances requires behavioral testing — applying the knowledge, not just reporting it.

**The differential access hypothesis applies to AI systems themselves.**

An AI agent asked to explain its reasoning is subject to the same limitations as a human expert: it can report what is accessible to its attention but may not accurately report its actual computational process. Method selection matters for understanding AI behavior, not just for capturing human knowledge.
```

### FILE: taxonomy-theory-and-the-proliferation-trap.md
```markdown
# The Proliferation Trap: Why Classification Systems Fail and What Scientific Progress Actually Looks Like

## The Problem of Too Many Categories

Over 100 types of Cognitive Task Analysis methods have been identified and catalogued. Dozens of classification schemes exist to organize them. Yet practitioners still lack clear guidance on which method to choose for which purpose.

This situation is not an accident of insufficient research. It is the predictable outcome of classification schemes built without theoretical foundations — schemes that organize by description rather than by principle.

Yates draws on Hempel's (1965) philosophy of science to diagnose this failure and articulate what genuine taxonomic progress would look like. The analysis has broad implications for any domain that accumulates methods, tools, or categories faster than it develops organizing theory.

---

## Hempel's Standard for Scientific Progress

Carl Hempel (1965) provided a rigorous account of what it means for a classification system to advance scientific understanding. His key principles:

**1. Classification systems should be driven by theoretical concepts, not just observable features.**
"Scientific concepts (a) give way to the formulation and systemization of principles that refer to unobservable entities, (b) are expressed in theoretical terms, and (c) explain observable phenomena" (Hempel, 1965, as cited in Yates, p. 26-27).

A classification that groups methods by how they look (mechanism-based) rather than by what they do (outcome-based) is a pre-scientific typology, not a taxonomy. It describes; it does not explain.

**2. Scientific progress is marked by reduction in categories, not proliferation.**
"Scientific progress is made when a broader spectrum of observable phenomena in a domain can be explained and predicted by increasingly generalized covering laws, and, in turn, when this theoretical development results in a reduction of taxonomic categories" (Yates, p. 27).

This is counterintuitive. More categories feels like more precision. But under Hempel's framework, more categories means the theory is failing to find underlying unities. The periodic table didn't grow to hundreds of elements — it revealed that all elements are instances of a small number of principles (atomic number, electron configuration, etc.).

**3. Categories should be instances of theoretical generalizations, not consensual labels.**
"Categories are instances of theoretical generalizations, rather than socially consensual labels" (Yates, p. 27-28). When categories are created by committee to satisfy stakeholders (as in some diagnostic systems), they lack the theoretical grounding needed for predictive power.

---

## The DSM Analogy: A Warning Case

Yates draws a sustained and illuminating parallel between CTA classification and the Diagnostic and Statistical Manual of Mental Disorders (DSM).

Follette and Houts (1996) argued that successive editions of the DSM failed Hempel's standards by adding categories rather than unifying them: "the taxonomy is not flourishing but foundering, because a system that merely enumerates symptoms and then syndromes cannot exhibit simplification by the application of an organizing theory" (p. 1126, as cited in Yates, p. 27).

The DSM's claim to be "atheoretical" (to enable broad adoption) paradoxically prevented theoretical progress: "this claim of atheoreticality is not only an illusion, but it also impedes the progress of research in mental disorders" (Yates, p. 27). By refusing to commit to a theory, the DSM committed to no systematic basis for reduction — and so kept adding categories whenever clinicians encountered distinctions they couldn't fit into existing ones.

**The parallel to CTA is direct**: "There are strikingly similarities between the developmental history of the DSM and the challenges CTA researchers face to move current CTA classification systems toward theoretically driven taxonomies... the number of CTA methods has proliferated dramatically" (Yates, p. 28).

Both systems suffered from:
- Mechanism-based rather than theory-based classification
- Proliferation of categories as the default response to new phenomena
- Lack of a unifying theory that could collapse distinctions
- Diverse stakeholder contexts preventing consensus on theoretical foundations

---

## Typologies vs. Taxonomies: The Critical Distinction

Yates, following Patton (2002), draws a sharp distinction that is often blurred in practice:

**Typologies** classify "some aspect of the world into parts along a continuum." They are descriptive. They can be useful for organizing and communicating, but they do not generate predictions and cannot be refuted by evidence.

**Taxonomies** classify "items into mutually exclusive and exhaustive categories." They are theoretically derived. Each category is an instance of a general principle. They generate predictions and can be tested.

Current CTA classification systems "appear to have characteristics more associated with typologies than with true taxonomies" (Yates, p. 25). They organize by visible features; they do not explain why those features cluster; they do not predict what outcomes will follow from which methods.

The practical consequence: practitioners using these typologies get descriptive information about methods but cannot predict outcomes from method selection. They must learn by trial and error, or by accumulating domain-specific experience — knowledge that is itself undocumented and tacit.

---

## What a Theory-Driven Taxonomy Would Require

Yates argues that the path to genuine taxonomic progress in CTA runs through cognitive theory:

"If the common goal among CTA methods is to capture the cognitive properties of expertise at varying levels, a potentially productive line of taxonomic research and theory development should focus on common measures and methods to identify the types and functions of knowledge that ultimately produce models of expertise" (p. 30).

The organizing theory already exists: Anderson's ACT-R model of cognitive architecture, with its distinction between declarative and procedural knowledge and its account of knowledge compilation. Merrill's Component Display Theory, with its performance-content matrix. These theories are "well-developed and articulated" (p. 30) — what's missing is their systematic application to CTA method classification.

The prediction: if CTA methods were classified by the knowledge types they reliably produce (which Yates' study begins to establish empirically), the number of distinct categories would be much smaller than the current 100+, and practitioners would have genuine predictive guidance for method selection.

---

## The Three Functions of Taxonomies

Chulef, Read, and Walsh (2001) identify three fundamental roles taxonomies play, as cited by Yates:

1. **"Provide a common vocabulary and language system to aid communication among researchers"** — enabling accumulation of findings across studies
2. **"Support the integration and systemization of findings and theories"** — enabling phenomena to be studied in relationship rather than isolation
3. **"Facilitate theory development"** — enabling comparative analysis that generates and tests causal models

CTA's lack of a proper taxonomy means all three functions are impaired. Studies cannot be easily compared because they use different names for similar methods. Findings cannot be integrated because there's no common framework. Theory cannot develop because there's no systematic basis for comparison.

---

## The Vocabulary Problem and Its Consequences

One specific manifestation of the taxonomy failure is the vocabulary problem. Yates documents it in detail for the specific case of "interview" — but it applies throughout CTA:

Interviews are classified as unstructured, semi-structured, and structured — but "there is no clear distinction between them" (p. 23). In practice, the distinctions fall along three independent dimensions: formality (structured to unstructured), content range (broad domain to specific incident), and target knowledge type (declarative, procedural, or both). These dimensions are independent, but the classification system collapses them.

The result: a "semi-structured interview" in one study may have nothing in common with a "semi-structured interview" in another. Researchers trying to compare studies or replicate findings face irreducible ambiguity.

More broadly: "CTA lacks a common vocabulary and language making systematic taxonomic research difficult" (p. 28). Without a common vocabulary, knowledge accumulates in isolated pockets, never aggregating into a unified body.

---

## Transfer to Agent System Design

**Skill libraries suffer from the same proliferation trap.**

Agent systems with 180+ skills face exactly the Hempel problem: at what point do you have too many skills? The answer from taxonomic theory is: when you can explain multiple existing skills as instances of a more general principle, and you haven't unified them. Skill proliferation is a symptom of insufficient theory.

**Skill naming conventions should aim at theoretical precision, not descriptive richness.**

Names that describe what a skill looks like (its mechanism) are typological. Names that describe what the skill produces (its knowledge or action type) are taxonomic. "Interview-based elicitation" is typological. "Declarative concept extraction from domain expert" is moving toward taxonomic.

**The vocabulary problem in agent systems is real and costly.**

If "debugging" in one context means something different than "debugging" in another, skill routing will be unreliable. The cost of vocabulary ambiguity in agent systems is routing failures, redundant skills, and inability to build on prior work.

**Reducing categories is a sign of theoretical maturity, not loss of capability.**

If an agent system discovers that three skills are really instances of one underlying capability applied in different contexts, collapsing them is scientific progress. Resistance to this reduction — insisting on maintaining separate skills because they "feel different" — is the DSM failure mode applied to software.

**Theory-driven skill specification predicts outcomes; mechanism-based specification does not.**

A skill specified in terms of its theoretical basis (what cognitive operation it performs, what knowledge type it produces or consumes) can predict behavior in novel situations. A skill specified in terms of its mechanism (what steps it takes) only describes what it does in known situations. For robust generalization, theoretical specification is required.
```

### FILE: knowledge-elicitation-as-a-three-phase-pipeline.md
```markdown
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
```

### FILE: the-automated-knowledge-problem-for-ai-agents.md
```markdown
# The Automated Knowledge Problem: What AI Agents Cannot Report About Themselves

## The Deepest Challenge in Building Expert-Level Systems

Expert systems and intelligent agents face a fundamental paradox: the knowledge that makes expert performance *excellent* is precisely the knowledge that is hardest to specify, capture, and verify. This is not a technical limitation waiting for better tools — it is structural, grounded in how expertise works at the cognitive level.

Yates' dissertation provides the most comprehensive treatment of this problem in the CTA literature, and its implications extend directly to the design of modern AI agent systems.

---

## The Three Criteria for Sensitivity to Automated Knowledge

Yates operationalizes "sensitivity to automated knowledge" with three practical criteria. A study (or, by extension, a system-building effort) is sensitive to automated knowledge if it:

1. **Uses more than one subject matter expert** — multiple experts triangulate on knowledge that any individual expert cannot fully access
2. **Calls for an iterative approach** where the expert has the opportunity to correct and supplement previous results — iteration allows recognition memory to supplement recall memory
3. **Uses multiple methods** — different methods access different layers of knowledge; no single method is sufficient

Of 154 studies examined, 132 (85%) met at least one criterion. Interestingly, "this was an unexpected result, as it was generally thought that efforts to capture automated knowledge have been applied relatively recently" (p. 73). The recognition of the automated knowledge problem turns out to be almost as old as the field itself.

The 22 studies (15%) that met no criterion were capturing expert knowledge without any protection against the automation gap — producing specifications that were systematically incomplete in ways that neither the analyst nor the expert would recognize.

---

## Why Multiple Experts Are Essential

The reliance on single experts in early expert system development is instructive. Yates notes that "during the 1970s and 1980s, expert systems sometimes relied on a single expert for the knowledge required to design and develop the system, because only one expert was available or 'easier to work with' than multiple experts" (p. 73).

The practical pressures that produced single-expert reliance are understandable. Multiple experts introduce:
- Coordination costs
- Potential conflicts between expert accounts
- Mechanisms needed to resolve ideological and factual disagreements

But the cost of single-expert reliance is systematic underspecification. Chao and Salvendy (1994) demonstrated quantitatively that "the percentage of procedures acquired increases significantly as the number of experts increases" (as cited throughout Yates). Three experts was their practical recommendation — providing substantially more complete procedural knowledge than any single expert while remaining manageable.

The mechanism: **expert knowledge is distributed, not concentrated**. No single expert has conscious access to all relevant knowledge even within their own domain. Different experts, queried independently, activate different procedural memories. Discrepancies between expert accounts are diagnostic — they point to knowledge that at least one expert has automated beyond articulable access.

---

## Why Iteration Is Essential

Single-pass elicitation misses knowledge that requires feedback to surface. This happens for two reasons:

**Recognition vs. recall**: Automated knowledge is often inaccessible to recall (direct retrieval) but accessible to recognition (comparison to a presented option). An expert who cannot describe a decision criterion when asked can often recognize whether a proposed criterion is correct when shown it. Iterative approaches — showing the expert the results of analysis and asking for corrections — convert a recall problem into a recognition problem.

**Incomplete initial activation**: The first time an expert describes a procedure, they are drawing on whatever was most recently activated in memory. Review of a transcript often activates additional memories — "Oh, I forgot to mention that when X happens, you have to..." This is not fabrication; it is the natural structure of memory retrieval, where early retrieval primes later retrieval.

The iterative approach operationalizes this: after an initial elicitation and analysis pass, the expert reviews the results and supplements or corrects them. Multiple iterations converge on a more complete specification than any single pass.

---

## Why Multiple Methods Are Essential

The "differential access hypothesis" (Hoffman et al., 1995) holds that different methods access different knowledge types. This is the empirical basis for the multiple-methods recommendation.

But the hypothesis goes deeper than simply accessing "different" knowledge. It implies that **the knowledge landscape has a topology** — some knowledge is accessible to Method A, some to Method B, and some is only accessible to the intersection of multiple methods. Automated knowledge, in particular, is often invisible to any single method because it operates below the threshold that any single method can probe.

Consider:
- A structured interview captures what an expert believes they do
- A think-aloud protocol captures what is currently in working memory during execution
- Behavioral observation captures what actually happens
- Comparison across multiple experts captures where the accounts diverge

None of these alone reaches automated knowledge. The interview produces reconstruction, not execution. The think-aloud captures conscious processing but misses automated firing below the attention threshold. Observation captures behavior but not underlying cognition. Expert comparison surfaces discrepancies but doesn't resolve them.

Combining methods in the right sequence — observation first to understand the task structure, then think-aloud to access accessible procedural knowledge, then interview to fill in declarative context, then multiple-expert comparison to triangulate — creates a layered probe that approximates the full knowledge landscape.

---

## The Representation Bias and Expert System Failures

A subtle but important cause of automated knowledge loss is representation bias — the way the intended output format of a system shapes the elicitation process, often invisibly.

Yates documents that expert systems require knowledge in IF-THEN production rule format. This requirement filters elicitation: analysts unconsciously guide conversations toward knowledge that can be expressed as conditions and actions. Knowledge that is pattern-recognition based, contextually contingent, or continuously graded — rather than binary and conditional — is systematically excluded.

"Knowledge acquisition for expert systems appears to assume that expertise can be represented by conditional rules and seeks to capture declarative knowledge as an intermediate step" (p. 76). The "intermediate step" becomes the final product. Procedural execution knowledge — the most valuable layer — is lost in the formatting process.

This explains a well-known observation in expert systems research: systems built from knowledge engineering often performed well in narrow test conditions specified by the engineers but failed unpredictably in real deployment. The deployed cases triggered automated expert knowledge that was never captured because the format couldn't express it.

---

## The AI Agent Parallel: What Models Cannot Report About Themselves

The automated knowledge problem extends, in a modified form, to AI agents themselves. There are at least three parallel phenomena:

**1. The Explanation Gap**

An AI agent asked to explain its reasoning produces an explanation generated by the same or similar process as the original reasoning — but this explanation is a post-hoc reconstruction, not a faithful account of what happened computationally. The explanation may be plausible and internally consistent while being fundamentally inaccurate about the actual computational process.

This is the machine equivalent of the expert who provides a clean, rational account of a decision that was actually driven by pattern recognition below the level of articulable reasoning. The account is not dishonest; it is the best the system can produce. But it is not the ground truth.

**2. The Distribution Shift Problem**

Expert human knowledge shows automated bias toward familiar cases — the patterns that have been practiced most are the most automated, and therefore the hardest to articulate. AI agents show analogous patterns: they perform well in the distribution of cases most represented in training and fail in ways that are systematic but hard to predict on cases at the distribution boundary.

The failure is not random. It has structure — the same structure that makes certain automated expert knowledge invisible to introspection. Neither the expert nor the agent can fully specify the boundary conditions of their own competence.

**3. The Confidence Calibration Problem**

Automated knowledge in experts shows up as high confidence without supporting reasoning — the expert "just knows" and may be right. AI systems show analogous patterns: high confidence outputs on inputs where the training distribution provides poor basis for confidence. Like the expert who cannot account for their certainty, the AI system cannot always distinguish "I know this" from "I pattern-matched this."

---

## Practical Implications: Building Sensitivity to Automated Knowledge into Agent Systems

**Multiple agents should be consulted for high-stakes decisions.**

Just as multiple human experts surface knowledge that any single expert cannot articulate, multiple AI agents queried on the same problem can reveal the contours of the knowledge landscape. Divergence between agents is diagnostic, not just noise — it marks the boundary of well-specified knowledge.

**Iterative refinement should be built into skill development.**

Skills should not be defined, validated once, and deployed. The iterative approach that Yates identifies as critical for human knowledge elicitation applies equally to AI skill development: initial specification, behavioral evaluation, gap analysis, refined specification, re-evaluation. Each iteration surfaces automated knowledge that the previous pass missed.

**Behavioral evaluation is necessary, not sufficient, but superior to introspective evaluation.**

Evaluating a skill by asking the agent to explain what it would do is analogous to interviewing a human expert — it accesses articulable knowledge and misses automated knowledge. Evaluating a skill by observing its performance across a diverse set of actual cases is closer to behavioral observation, which is more reliable. High-fidelity evaluation requires both, with behavioral evaluation as the ground truth.

**Confidence scores should be treated with the same skepticism as expert self-reports.**

An agent's reported confidence on a task is its best attempt at calibration, but it may not reflect the actual reliability of its outputs on that task. Just as expert self-assessment of procedural knowledge is systematically incomplete, agent confidence may be systematically miscalibrated. External validation against ground truth is required to establish reliability.

**The 85% sensitivity rate in Yates' literature review is a useful benchmark.**

85% of CTA studies in Yates' sample incorporated at least one sensitivity criterion. For AI agent system development, a similar standard should apply: 85% of significant skill development efforts should incorporate multiple evaluation sources, iterative refinement, or comparative evaluation against independent benchmarks — preferably all three.
```

### FILE: skill-selection-as-cognitive-task-analysis-problem.md
```markdown
# Skill Selection as a Cognitive Task Analysis Problem: How Agents Should Choose Their Tools

## Reframing the Routing Problem

In WinDAGs and similar multi-agent orchestration systems, one of the most consequential decisions made at runtime is skill selection: given a task, which of 180+ available skills should be invoked? This is typically framed as a routing or classification problem — given a description of a task, select the most appropriate skill.

Cognitive Task Analysis research reveals that this framing is incomplete. Skill selection is not merely a classification problem; it is an instance of the broader problem of matching knowledge types to elicitation and application methods. The principles developed over decades of CTA research apply directly.

---

## The Task Decomposition Problem: You Must Know the Knowledge Type First

The dissertation's opening quotation is directly relevant: "Unless one can decompose the particular task, in terms of desired learning outcomes and cognitive-process elements, there is almost no point to understanding knowledge structures" (Howell & Cooke, 1989, p. 160, as cited in Yates, p. 1).

This is not a claim about learning theory. It is a claim about the prerequisite structure of any intelligent capability deployment: **before you can select the right tool, you must know what type of work the task requires**.

Merrill's Performance-Content Matrix provides the operational framework:

| Task Type | What It Requires |
|-----------|-----------------|
| Remember/Fact | Retrieval of specific stored information |
| Remember/Concept | Recognition and definition of category |
| Remember/Process | Recall of stage sequence |
| Remember/Principle | Statement of cause-effect relationship |
| Remember/Procedure | Recitation of ordered steps |
| Use/Concept | Classification of new instance |
| Use/Process | Troubleshooting a system |
| Use/Principle | Creating a new instance |
| Use/Procedure | Executing ordered steps on a target |

The failure mode in naive skill selection: routing systems that treat all tasks as "retrieval tasks" (Remember type) when many tasks require "application" (Use type). A skill that can tell you what a debugging procedure is may be completely wrong for a task that requires actually debugging a system.

---

## Declarative vs. Procedural Skills: A Fundamental Taxonomy

Following Anderson's (1983) distinction and its operationalization in CTA research, skills in an agent system should be differentiated by their primary knowledge type:

**Declarative skills** produce or apply factual, conceptual, process, or principle knowledge. They answer questions like:
- What is X?
- What are the properties of X?
- How does system X work (description)?
- What principle explains phenomenon X?
- What are the stages of process X?

**Procedural skills** execute sequences or apply procedures. They answer questions like:
- How do I accomplish task X?
- What is wrong with this system?
- How do I create a new instance of X?
- What are the steps to transform Y into Z?

This distinction has direct implications for skill specification:

A declarative skill can be evaluated by asking the agent to state its output — the output is a proposition that can be checked for accuracy. A procedural skill must be evaluated by observing whether execution produces the correct result — the output is a transformation of state.

Specifications that describe skills in declarative terms when the skill is actually procedural will fail systematically: the skill will produce accurate descriptions of what it should do without actually doing it correctly.

---

## The Representation Bias Problem in Skill Libraries

CTA research reveals a specific failure mode with direct analogs in agent system design: **representation bias**, where the format in which knowledge will be stored determines what knowledge gets captured.

In expert systems, the requirement for IF-THEN production rules caused analysts to elicit declarative knowledge that could be converted to conditional rules, systematically missing procedural execution knowledge.

In agent skill libraries, the analog is: skills specified in terms of their *description* (what they do) rather than their *performance characteristics* (what knowledge type they require, what their inputs and outputs are at the knowledge-type level) will be routed incorrectly.

A skill described as "code debugging" could involve:
- Explaining common debugging approaches (Remember/Process — declarative)
- Classifying an error message as belonging to a known error category (Use/Concept — classify procedure)
- Executing a systematic troubleshooting sequence on a faulty system (Use/Process — change procedure)

These are three fundamentally different knowledge activities. A routing system that cannot distinguish between them will select the right skill for the task approximately one-third of the time.

---

## Method Selection Principles Applied to Skill Selection

The CTA principle that "maximally effective approaches to CTA tend to be those that are organized around and guided by the desired knowledge results" (Chipman et al., 2000, as cited in Yates, p. 8) translates directly to skill selection:

**Maximally effective skill selection is organized around and guided by the required knowledge type of the task.**

This requires:

**1. Task decomposition before skill selection.** Before selecting a skill, decompose the task into its knowledge type components. Is this a task that requires classification? Troubleshooting? Factual retrieval? Step execution? Each of these may require a different skill, even if they appear superficially similar.

**2. Skill profiles that include knowledge type requirements.** Skills should be specified not just by what they do (descriptively) but by what type of knowledge operation they perform. "This skill performs Use/Process operations on software systems" is more useful for routing than "this skill debugs code."

**3. Recognition of the declarative/procedural distinction in routing.** Tasks that require "knowing about" something should route to declarative skills. Tasks that require "doing with" something should route to procedural skills. Many tasks require both — in sequence.

---

## The Pairing Principle: Skills Should Be Combined, Not Used in Isolation

One of the most consistent findings in CTA research is that **method pairings are more effective than individual methods**. "In practice, CTA studies often incorporated more than one individual knowledge elicitation and analysis/representation method, as often recommended in the literature" (Yates, p. 65).

The reason: "components of both knowledge elicitation and analysis/representation must be present for a successful CTA study" (Crandall et al., 2006, as cited in Yates, p. 43-44). Elicitation without analysis leaves raw data unstructured. Analysis without elicitation has nothing to analyze.

The agent system parallel: **most complex tasks require paired skills — one for information gathering and one for result generation**. A skill that retrieves relevant information (analogous to elicitation) paired with a skill that analyzes and represents the result (analogous to analysis/representation) will outperform either skill deployed alone.

The most frequent and reliable method pairings identified in Yates' study suggest prototypical skill pairs:
- Information gathering (document analysis, field observation, interviews) + Structured representation (diagram drawing, content analysis, process tracing)
- Conceptual elicitation (concept mapping, card sort, repertory grid) + Formal analysis (clustering, structural analysis)
- Behavioral trace capture (think-aloud, protocol) + Systematic analysis (protocol analysis)

Each pairing has a characteristic knowledge output. Building skill pairs with known output profiles enables more reliable orchestration.

---

## The Formal vs. Informal Skill Distinction

CTA research distinguishes formal methods (well-specified, standardized, predictable outcomes) from informal methods (flexible, adaptable, variable outcomes). This distinction applies to agent skills.

**Formal skills** have:
- Precisely specified inputs and outputs
- Deterministic or near-deterministic behavior on specified input types
- Validated performance on defined task types
- Known failure modes

**Informal skills** have:
- Broad applicability
- Variable performance depending on input characteristics
- Difficult-to-predict behavior on novel inputs
- Flexible but unreliable

"Standardized methods appear to provide greater consistency in the results than informal models" (Yates, p. 77). For critical tasks, formal skills should be preferred. For exploratory or novel tasks, informal skills provide flexibility but require validation.

The practical recommendation: **high-stakes decisions should route to formal skills wherever available**. Informal skills are appropriate for initial exploration or when formal skills don't cover the required task type — but their use should trigger additional validation.

---

## Sensitivity to Context: When Skill Performance Depends on Domain

CTA research consistently demonstrates that knowledge elicitation methods interact with domain characteristics. Methods appropriate for familiar, well-structured tasks (surgical procedures) may be inappropriate for unfamiliar, ill-structured tasks (strategic planning). The optimal method is domain-sensitive.

Yates cites Wei and Salvendy (2004) on the HCIP model's finding that standard CTA methods fail to cover important cognitive attributes like "generate ideas, intervene, human learning, cognitive attention, sensory memory, ability and skills, and social environment" (p. 21-22).

The agent system parallel: skill performance depends on domain context, and skills that work well in familiar domains may fail systematically in novel ones. Domain-sensitive skill selection — routing to skills validated for the specific domain, not just the general task type — produces more reliable results.

This suggests that skill profiles should include not just knowledge type but also domain context: "This skill performs well for Use/Process tasks in software domains. Its performance on Use/Process tasks in medical domains has not been validated."

---

## A Decision Framework for Skill Selection

Based on the CTA research framework:

**Step 1: Characterize the task by knowledge type**
- Is this a Remember task or a Use/Apply task?
- What is the content type: Fact, Concept, Process, Principle, or Procedure?
- Fill in the Merrill matrix cell: Remember/Concept? Use/Process? Use/Principle?

**Step 2: Check for automated knowledge requirements**
- Does this task involve decisions that may be context-sensitive or domain-specific?
- Are there edge cases or critical boundary conditions?
- Would a single pass be sufficient, or does this task require iterative refinement?

**Step 3: Select primary skill based on knowledge type**
- Declarative tasks: select declarative skills (information retrieval, concept definition, process description)
- Procedural tasks: select procedural skills (execution, troubleshooting, creation)
- Mixed tasks: plan a sequence of skill invocations

**Step 4: Identify appropriate pairing**
- What analysis/representation skill should accompany the primary elicitation/gathering skill?
- What does the downstream consumer of this skill's output need? Format accordingly.

**Step 5: Validate based on task stakes**
- For high-stakes decisions, engage multiple skills or multiple agents
- For novel domains, require iterative refinement
- For critical outputs, compare against independent benchmarks

This framework does not guarantee perfect skill selection. But it provides a systematic basis for selection that is more reliable than keyword matching or surface similarity — which are the agent system equivalents of mechanism-based typologies.
```

### FILE: building-theory-driven-agent-capability-taxonomies.md
```markdown
# Building Theory-Driven Agent Capability Taxonomies: Lessons from CTA Classification Research

## The Current State of Agent Skill Libraries

Most multi-agent orchestration systems with large skill libraries (100+) face a version of the same problem that CTA researchers faced in the 1990s: many different methods (skills) with overlapping names, unclear distinctions, no principled basis for choosing among them, and no systematic understanding of which skills produce which types of outputs.

The CTA literature evolved through exactly this problem over thirty years. The lessons it learned — both about the failure modes and about what genuine taxonomic progress requires — provide a direct guide for building skill libraries that scale intelligently.

---

## How Classification Systems Fail: The CTA History as Warning

Over 100 CTA methods were identified and classified under at least a dozen different schemes. Each scheme provided partial guidance but failed to solve the core practical problem: "there remain no clear guidelines for the practitioner to choose the appropriate combination of methods to apply to a specific task or intended results" (Cooke, 1994, p. 804, as cited in Yates, p. 7).

The failure patterns:

**Mechanism-based classification**: Early schemes organized methods by what they looked like (observation, interview, process tracing). This answered the question "how does this method work?" but not "when should I use this method?" The mechanic of a tool and its appropriate application are different questions.

**Domain-specific classification**: Methods were often classified within the context of a particular application (expert systems, human factors, instructional design). A classification valid for expert systems development might not transfer to instructional design. Practitioners working across domains had no portable guidance.

**Theory-neutral classification**: By refusing to commit to cognitive theory, classification schemes remained permanently descriptive. "Interviews are used for elicitation" is not a theoretical claim and generates no predictions. It merely names.

**Proliferation without reduction**: Each time a new application context was encountered or a new research group became involved, new methods were named. Without a unifying theory that could collapse distinctions, the category count only grew.

The result: "it is difficult to consolidate the literature around one methodological theme" (Yates, p. 25). A practitioner approaching the field found not a toolkit with instructions, but a warehouse with unlabeled contents.

---

## What Taxonomic Success Looks Like: The Hempelian Standard Applied

A well-functioning taxonomy, under Hempel's standard:

1. **Provides a common vocabulary** that enables communication across contexts and accumulation of findings
2. **Supports integration** of findings from disparate sources under a common framework
3. **Facilitates theory development** by revealing relationships that generate testable predictions
4. **Reduces categories** over time as theory identifies underlying unities

The periodic table is the paradigm case: 92 naturally occurring elements organized by atomic number and electron configuration. This organization reveals patterns (periodicity, valence, reactivity families) that could not be seen in a list-based classification. It generates predictions (undiscovered elements with specific properties) and has been progressively refined rather than expanded without bound.

Bloom's taxonomy of educational objectives is a closer analog: six categories of cognitive complexity (remember, understand, apply, analyze, evaluate, create), organized by the type of cognitive activity required. It generates predictions about instructional design and assessment that have been empirically validated across decades of research.

Yates proposes that Anderson's ACT-R cognitive architecture could serve as the organizing theory for a genuinely taxonomic CTA classification: "Based on existing theories of cognition that are well-developed and articulated, a taxonomy of CTA methods and cognition could possibly achieve the desired reduction in taxonomic categories, while providing clearly explicated guidelines for conducting the CTA enterprise" (p. 30-31).

---

## Applying Hempelian Standards to Agent Skill Libraries

**Test 1: Common Vocabulary**

Can a skill in this library be described in terms that would be understood the same way by any agent or system in the ecosystem? Or does "debugging" mean something different in the context of Skill #47 than in the context of Skill #112?

Taxonomic vocabulary requires that names be instances of theoretical categories, not descriptive labels. "Use/Process skill for software systems" is taxonomic. "Debugging" is descriptive. The former generates predictions (this skill will perform classification operations, produce diagnoses, require sequential reasoning); the latter does not.

**Test 2: Integration Support**

Can findings from one skill's performance be applied to another skill of the same type? If Skill A and Skill B are both Use/Process skills for different domains, should we expect their performance patterns to be similar? Their failure modes to be similar? Their validation requirements to be similar?

A taxonomy that supports integration allows lessons learned from one skill to transfer systematically to others of the same type. A typology does not.

**Test 3: Theory-Derived Predictions**

Does the classification generate predictions about skill behavior that can be tested? "Skills that perform Use/Procedure operations will require ordered sequential execution and will fail when steps are performed out of order" is a testable prediction. "Debugging skills debug code" is not.

**Test 4: Category Reduction**

Is the category count shrinking over time as theory identifies underlying unities, or growing over time as new applications generate new labels? In most agent skill libraries, the count only grows. This is the DSM failure mode.

---

## A Candidate Theoretical Framework for Skill Classification

Based on Merrill's Performance-Content Matrix (adapted with Clark modifications, as described in Yates p. 38-39), a theory-driven skill taxonomy could organize skills on two dimensions:

**Performance Dimension**:
- **Remember/Retrieve**: Search knowledge base and return information
- **Classify**: Apply conceptual categories to novel instances
- **Troubleshoot**: Diagnose failures in systems with known structure
- **Create-Instance**: Apply principles to generate new examples
- **Execute-Procedure**: Perform ordered steps to accomplish a transformation

**Content Dimension**:
- **Fact** (arbitrary associations — names, codes, specific instances)
- **Concept** (class memberships with shared attributes)
- **Process** (stage sequences describing how systems work)
- **Principle** (cause-effect relationships)
- **Procedure** (ordered steps for goal accomplishment)

The cross-product of these dimensions yields 25 cells, each representing a distinct type of cognitive operation. Not all cells will be populated in any given skill library, but the framework provides a principled basis for classification.

**Predicted properties from this framework**:

| Cell | Expected Input | Expected Output | Failure Mode |
|------|---------------|-----------------|--------------|
| Remember/Concept | Instance description | Definition or properties | Retrieval failure; outdated knowledge |
| Classify/Concept | Novel instance | Category assignment | Out-of-distribution cases; ambiguous boundaries |
| Troubleshoot/Process | Faulty system state | Diagnosis | Missing causal model; novel failure modes |
| Create/Principle | Constraints | New instance | Constraint satisfaction failure; principle misapplication |
| Execute/Procedure | Goal + target | Transformed target | Step omission; sequence error; precondition violation |

Each cell type requires different validation, different elicitation methods for specification, and different error recovery strategies. A taxonomy based on this framework would predict these properties from the skill classification alone.

---

## Practical Steps Toward Taxonomic Skill Organization

**Step 1: Audit existing skills against the performance-content matrix.**

Classify each existing skill in the library by its primary knowledge type (content dimension) and primary operation type (performance dimension). Expect to find:
- Many skills currently classified by mechanism (what they do mechanically) rather than knowledge type
- Significant overlap between skills that are actually the same type deployed in different domains
- Gaps in certain cells (typically the procedural execution cells, which are hardest to specify)

**Step 2: Identify skills that are actually the same type.**

Following Hempel, skills that are mechanisms for the same cognitive operation should be collapsed or organized as domain variants of a single skill type. "Medical diagnosis" and "software debugging" may both be Use/Process skills — differing in domain but sharing core cognitive structure.

**Step 3: Specify skills in knowledge-type terms, not just descriptive terms.**

Each skill profile should include:
- Primary knowledge operation (cell in the performance-content matrix)
- Input knowledge type (what the skill receives)
- Output knowledge type (what the skill produces)
- Domain applicability (where it has been validated)
- Sensitivity to automated knowledge (does this skill require iterative refinement? multiple input sources?)

**Step 4: Build routing logic from knowledge type, not just keyword matching.**

A routing system informed by knowledge type can ask: "Does this task require classification of a novel instance into a known category? Route to a Classify/Concept skill. Does it require troubleshooting a system with known structure? Route to a Troubleshoot/Process skill."

**Step 5: Track category reduction as a quality metric.**

If the skill library is growing without bound, that is a warning sign. A mature, theory-driven library should show periods of reduction — where multiple skills are recognized as instances of the same underlying type and collapsed. The ratio of unifications to additions is a rough measure of theoretical maturity.

---

## The First Principles Approach: A Research Agenda for Skill Libraries

Clark et al. (in press, as cited in Yates p. 79) propose applying Merrill's "first principles" approach to CTA research — identifying the active ingredients in effective CTA methods across their diverse implementations.

This approach is directly applicable to agent skill libraries:

**Identify the active ingredients in high-performing skills.** What cognitive operations make a skill effective? Strip away domain-specific content and look for structural commonalities across skills that perform well on similar task types.

**Systematically compare skill types on similar task goals.** If two skills both claim to perform Use/Process operations, compare them on the same tasks and measure which elements of each contribute to performance.

**Develop standardized protocols for skill specification.** Just as CTA research developed formal methods with standardized procedures, agent skills should be developed with standardized specification protocols that capture knowledge type, operation type, input/output characteristics, and validation methodology.

This is not a completed research program — it is a research agenda. But the CTA literature suggests it is achievable: formal methods with standardized procedures do produce more consistent and predictable results than informal methods. The same principle should apply to agent skill development.
```

### FILE: representation-bias-and-knowledge-fidelity.md
```markdown
# Representation Bias: How Output Format Corrupts Knowledge Capture

## The Invisible Distortion

Among all the ways that expert knowledge can be lost or distorted in the process of being captured and encoded into a system, representation bias is perhaps the most insidious because it operates invisibly. The analyst does not know it is happening. The expert does not know it is happening. The resulting system does not know it is missing anything. The knowledge that has been lost leaves no trace of its absence.

Representation bias was identified in the CTA literature by Cooke and McDonald (1986): "the analyst's choice of elicitation methods is influenced by the final representation and use of the results" (as cited in Yates, p. 75). When you know what format the knowledge will end up in, you unconsciously — or consciously — choose methods that produce knowledge in that format. Knowledge that doesn't fit the format is not wrong; it is simply not captured.

---

## The Mechanism

The logic of representation bias operates as follows:

1. A system is designed that requires knowledge in Format X (e.g., IF-THEN production rules)
2. The analyst, knowing this requirement, selects elicitation methods whose outputs can be easily converted to Format X
3. Methods that would capture knowledge incompatible with Format X are not selected
4. The system is built with knowledge that fits Format X and is missing knowledge that doesn't fit Format X
5. The system performs well on cases where Format X captures the relevant knowledge, and poorly on cases where it doesn't
6. The poor performance is attributed to implementation errors, insufficient data, or domain complexity — not to the representational limitation of Format X

The cycle is self-reinforcing: if Format X is the only output format, systems will only ever be built with Format X-compatible knowledge, and the limitations of Format X will never be identified as the root cause of failures.

---

## Expert Systems and the Production Rule Trap

Yates provides detailed documentation of how representation bias operated in expert system development:

"The development of expert systems requires that knowledge be represented as condition-action pairs. This requirement influences the choice of CTA methods and the final representation of expertise, including declarative knowledge (concepts, processes, principles), as procedural IF-THEN rules" (p. 75).

The practical consequence: even declarative knowledge — which has its own natural structure — was forced into production rule format. A concept, which is naturally represented as a class with attributes and membership criteria, was converted to a set of conditions that collectively define the class. A process, which is naturally a temporal sequence of stages, was converted to a chain of condition-action pairs.

This conversion is not loss-free. "Representation bias at work may be, for example, in the greater use of formal conceptual elicitation and analysis/representation pairings, which results can be more easily converted to production rules" (p. 75-76). Concept mapping, card sorting, and repertory grid — all formal conceptual methods — dominated the literature because their outputs were production-rule compatible. Process tracing and think-aloud — which capture procedural execution knowledge that resists production-rule conversion — were used less consistently and applied with less rigor.

The result: expert systems were systematically better at rules-based knowledge than at the contextual, continuous, and pattern-recognition-based knowledge that characterizes genuine expertise. "Expert systems sometimes relied on a single expert... because only one expert was available or 'easier to work with'" (p. 73) — but the deeper reason was that the production rule format made some knowledge easy to capture and other knowledge effectively invisible.

---

## Evidence of Representation Bias in the Data

Yates finds statistical evidence of representation bias in the study sample:

"When sorted by frequency, the cluster of the most frequently cited individual CTA methods includes Concept Map, Repertory Grid, Card Sort, and Process Tracing/Protocol Analysis, all of which are classified as both elicitation and analysis/representation methods" (p. 75-76). The prominence of conceptual methods in a literature dominated by expert system applications (49% of studies) is consistent with representation-driven method selection.

Even more telling: "the unexpected association between the Repertory Grid method, typically associated with conceptual knowledge elicitation, and procedural knowledge outcomes" (p. 76). Repertory Grid is a conceptual method. Its appearance in procedural knowledge contexts — in expert system applications specifically — suggests that procedural knowledge was being expressed through conceptual methods because the conceptual outputs could be more easily converted to production rules. The knowledge was being translated through an incompatible representation, likely losing fidelity in the translation.

---

## Representation Bias in Modern AI Systems

The phenomenon Yates documents in 1990s expert system development has direct analogs in modern AI system design:

**Training data format bias**: The format of training data determines what knowledge patterns a model can learn. A language model trained on text can learn text-expressible knowledge; it cannot learn knowledge that would require other modalities to express (spatial relationships, temporal sequences not expressible in words, haptic patterns). The format of training data is a form of representation — and bias toward text-expressible knowledge is a form of representation bias.

**Prompt format bias**: When agents receive tasks through prompt interfaces, knowledge that is easy to express in natural language will be better represented than knowledge that is difficult to express in natural language. Quantitative relationships, spatial configurations, and procedural sequences all suffer from the natural language representation constraint.

**Output format bias in skill specification**: When skills are specified by their outputs (what they produce), skills whose outputs are easy to specify will be better-specified than skills whose outputs are difficult to specify. Declarative knowledge outputs ("Here is a definition of X") are easy to specify. Procedural knowledge outputs ("Here is how to perform X on this specific case") are harder to specify and evaluate.

**Embedding space bias**: When knowledge is represented as embeddings for retrieval, the structure of the embedding space determines which knowledge relationships are captured. Semantic similarity is well-captured; causal relationships, temporal sequences, and procedural dependencies are less well-captured. Retrieval-augmented systems with embedding-based retrieval have systematic blind spots in knowledge types that are poorly represented in embedding geometry.

---

## Detecting Representation Bias in Your System

Because representation bias operates invisibly, detecting it requires deliberate effort:

**Audit the gap between task requirements and available representations.** What knowledge does the system need to perform well? What knowledge does the format actually capture? The gap between these is the representation bias.

**Compare performance across knowledge types.** If a system performs well on declarative tasks and poorly on procedural tasks, or vice versa, this may indicate representation bias. The discrepancy reveals which knowledge types fit the format and which don't.

**Ask domain experts to identify what the system misses.** The content that experts identify as missing — "it doesn't understand that when X happens, you have to do Y before Z" — is often the procedural execution knowledge that doesn't fit the format.

**Track where the system's confident wrong answers cluster.** False confidence is often a sign of format-compatible but wrong knowledge — the system produces a plausible format-compatible answer when the actual answer requires knowledge the format can't express.

**Examine failures for systematic patterns, not just random errors.** Random errors suggest noise or insufficient data. Systematic errors in specific knowledge domains suggest representation bias.

---

## Avoiding Representation Bias: Design Principles

**Elicitation should precede representation format selection.**

The correct sequence is: determine what knowledge is needed → choose methods to elicit that knowledge → choose a representation format that fits the elicited knowledge. The incorrect sequence is: choose the output format → choose elicitation methods that produce format-compatible outputs.

This sounds obvious, but the pressure to reuse existing infrastructure pushes toward the incorrect sequence. When a system already uses production rules, embedding retrieval, or natural language outputs, the path of least resistance is to elicit knowledge that fits those formats.

**Multiple representation formats should be considered.**

Just as the CTA literature recommends multiple methods to capture different knowledge types, complex intelligent systems should consider multiple representation formats. Declarative knowledge may be best represented in concept networks; procedural knowledge in production rules or flowcharts; contextual knowledge in cases or examples; meta-knowledge in explicit strategy representations.

**Representation format fitness should be evaluated empirically.**

Don't assume a format captures the required knowledge — test it. Compare system performance using the proposed format against domain expert performance and identify specific cases where the format fails to support adequate performance. These failures diagnose the representation gap.

**Knowledge types that resist current formats should be explicitly flagged.**

When domain experts identify knowledge that is important for good performance but that doesn't fit the available formats, this should be documented and explicitly tracked as a known limitation. "This system does not represent [contextual pattern recognition knowledge] because it resists [format X]" is more honest and more useful than treating the limitation as if it doesn't exist.

**For high-stakes applications, test format adequacy before deployment.**

A medical expert system that performs well on rule-based cases but fails on cases requiring contextual judgment should not be deployed in clinical settings without explicit testing on contextual cases. The representation bias is predictable in advance from the format choice; its consequences should be explored before deployment.

---

## The Deeper Lesson: Format Is Theory

At the deepest level, representation bias is an instance of the general principle that all representations embody theoretical commitments. Choosing production rules commits you to the theory that expertise is organized as condition-action pairs. Choosing embeddings commits you to the theory that relevance is captured by semantic proximity. Choosing hierarchical task decomposition commits you to the theory that task structure is hierarchical.

These commitments may be true enough for many cases. But they are never true without exception. The question is always: what cases does this theoretical commitment get right, and what cases does it systematically get wrong?

Representation bias becomes visible when you ask this question explicitly. It remains invisible when the format is treated as neutral infrastructure rather than theoretical commitment.

The CTA literature's thirty-year struggle with representation bias offers a useful lesson: the formats we choose to store and process knowledge are not neutral containers. They are theories about the structure of knowledge. Building intelligent systems requires taking those theories seriously — which means understanding both what they capture and what they inevitably miss.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: The Performance-Content Matrix (Merrill/Clark as described in Yates) provides a direct upgrade to task decomposition — every decomposed task should be classified by performance type (remember vs. use) and content type (fact/concept/process/principle/procedure). This immediately reveals whether the sub-task requires retrieval or execution, conceptual knowledge or procedural knowledge, enabling more precise skill routing.

- **Architecture Design / System Design**: The three-phase pipeline (elicitation → analysis → representation) applies directly to system design workflows. Systems architects should ask: are we designing the representation format first and then choosing what knowledge to collect? Or are we capturing knowledge first and then choosing a format that fits it? The former is representation bias; the latter is correct design.

- **Code Debugging / Troubleshooting**: This is the quintessential Use/Process cognitive operation — "troubleshoot a system" in the Merrill matrix. CTA research shows that experts performing troubleshooting have heavily automated procedural knowledge that they cannot fully articulate. Debugging agents should be built from process tracing methods (observing expert debugging in action), not from interview-based methods (asking experts to describe how they debug).

- **Security Auditing**: Security expertise is deeply tacit and highly automated — experienced security auditors recognize vulnerability patterns through compiled procedures that are nearly impossible to elicit through standard interviews. The Critical Decision Method (eliciting decisions made during challenging past incidents) is the recommended approach for capturing security expertise at the level that matters.

- **Code Review**: Code review is a complex combination of knowledge types — concepts (what is bad code?), processes (how does a program execute?), principles (what causes security vulnerabilities?), and procedures (how do I systematically review a module?). A code review skill built only from declarative knowledge specifications will identify named patterns but miss novel instances requiring principled inference.

- **Frontend Development**: Frontend development skills involve the full range of knowledge types from Merrill's matrix — facts (browser compatibility), concepts (accessibility standards), processes (rendering pipelines), principles (UX principles for creating accessible interfaces), and procedures (implementation steps). Skills that conflate these will perform unevenly across the range of frontend tasks.

- **Agent Routing / Orchestration**: The central contribution of this book to orchestration is the Performance-Content Matrix as a routing framework. Rather than routing by keyword or semantic similarity (analogous to mechanism-based typologies), route by task knowledge type (analogous to outcome-based taxonomies). This requires enriching both task descriptions and skill profiles with knowledge-type metadata.

- **Knowledge Base / RAG Systems**: The document's analysis of how different methods produce different knowledge types applies directly to knowledge base construction. Retrieval systems that retrieve only declarative factual knowledge will fail on tasks requiring procedural guidance. Knowledge bases should be explicitly audited for knowledge type coverage.

- **Evaluation and Testing**: CTA research distinguishes evaluating declarative knowledge (asking the agent to state what it knows) from evaluating procedural knowledge (observing whether the agent can actually execute the procedure correctly). Most current AI evaluation focuses on the former. Robust evaluation requires behavioral testing — not just asking agents what they would do, but observing what they do when required to do it.

- **Expert System / Knowledge Engineering**: This is the book's home domain, and its lessons are most direct here. Any skill that claims to replicate expert decision-making should be built using multiple experts, iterative refinement, multiple elicitation methods, and explicit tests for automated knowledge gaps. Single-expert, single-method, single-pass knowledge engineering systematically undercaptures the most valuable expert knowledge.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: CTA's toolkit model maps directly onto orchestration: just as a CTA practitioner selects from observation, interview, process tracing, and conceptual methods based on the target knowledge type, an orchestrator selects from 180+ skills based on task knowledge type requirements. The Performance-Content Matrix provides a formal routing schema.

- **Task Decomposition**: The Howell & Cooke (1989) quote that opens the dissertation — "unless one can decompose the particular task, in terms of desired learning outcomes and cognitive-process elements, there is almost no point to understanding knowledge structures" — is the most direct statement of the decomposition principle in the literature. Decomposition must distinguish knowledge types, not just subtask boundaries.

- **Failure Prevention**: The dissertation identifies five distinct failure modes: (1) automation gap — missing tacit knowledge; (2) representation bias — format distorting knowledge capture; (3) single-expert reliance — losing distributed knowledge; (4) single-method reliance — missing knowledge types inaccessible to that method; (5) typological (not taxonomic) skill classification — preventing principled routing. Each failure mode has a corresponding mitigation strategy.

- **Expert Decision-Making**: The deepest contribution on expert decision-making is the ACT-R framework showing that expert decisions are predominantly procedural (automated IF-THEN productions), not deliberative (conscious declarative retrieval). Agents designed to replicate expert decision-making should be built with procedural execution architectures, not retrieval-and-reason architectures. The retrieval-and-reason approach captures the expert's post-hoc reconstruction, not their actual decision process.