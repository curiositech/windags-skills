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