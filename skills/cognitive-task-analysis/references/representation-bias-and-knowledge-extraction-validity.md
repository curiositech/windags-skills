# Representation Bias: How the Intended Output Corrupts the Extraction Process

## The Phenomenon

One of the most subtle and important findings in Yates's work is the identification of **representation bias** as a systematic distortion in knowledge extraction. Representation bias occurs when the intended final format of knowledge influences what knowledge is extracted and how it is elicited — before the elicitation even begins.

Yates defines it precisely: "the analyst's choice of elicitation methods is influenced by the final representation and use of the results" (Cooke, 1992; Cooke & McDonald, 1986, as cited in Yates, p. 75).

The practical consequence is severe: "The development of expert systems requires that knowledge be represented as condition-action pairs. This requirement influences the choice of CTA methods and the final representation of expertise, including declarative knowledge (concepts, processes, principles), as procedural IF-THEN rules" (p. 75).

In other words, when you know in advance that your output format is IF-THEN rules, you unconsciously select elicitation methods that produce IF-THEN-compatible outputs, and you interpret your elicited data through an IF-THEN lens. The result is a system that looks procedurally complete but is actually declarative knowledge forced into a procedural format.

## Why This Is a Validity Problem, Not Just a Formatting Problem

The distinction matters because declarative knowledge in procedural format behaves differently from genuinely procedural knowledge in novel situations.

Declarative knowledge in IF-THEN format: "IF the patient has a fever AND elevated white blood cell count, THEN consider infection." This is a fact (infections cause fever and elevated WBC) formatted as a rule. It can be derived from any medical textbook.

Genuinely procedural knowledge in IF-THEN format: "IF a post-surgical patient who was afebrile at 6 hours develops a temperature of 38.5°C at 12 hours AND the surgical site shows erythema that was not present at 6 hours AND the patient reports localized pain disproportionate to surgical expectations, THEN initiate wound inspection protocol and contact attending surgeon within 15 minutes."

The second rule encodes perceptual discrimination (erythema), temporal pattern recognition (rate of temperature change), comparative judgment (pain disproportionate to surgical expectations), and contextual specificity (post-surgical, specific timing). This cannot be derived from textbook facts. It is compiled procedural knowledge from clinical experience.

Representation bias produces the first type while appearing to have produced the second.

## The Evidence for Representation Bias in Yates's Data

Yates finds indirect evidence for representation bias in his data. Expert systems account for approximately 49% of all applications in his study sample. Methods commonly associated with conceptual knowledge (Concept Map, Repertory Grid, Card Sort) dominate the frequency distributions — "when sorted by frequency, the cluster of the most frequently cited individual CTA methods includes Concept Map, Repertory Grid, Card Sort, and Process Tracing/Protocol Analysis, all of which are classified as both elicitation and analysis/representation methods" (p. 75-76).

These methods are popular in expert system development contexts specifically because their outputs (concept hierarchies, construct grids, sorted categories) are more easily converted to production rules than the outputs of less formal methods.

The anomalous finding that "Repertory Grid, typically associated with conceptual knowledge elicitation, and procedural knowledge outcomes" are occasionally associated (p. 76) is explained by representation bias: in expert system contexts, conceptual knowledge is routinely converted to procedural format, making the association artifact of the output format rather than a genuine property of the knowledge type.

## Representation Bias in Agent Systems: Three Manifestations

For AI agent systems, representation bias appears in at least three structural forms:

### 1. Training Data Bias
An agent trained on text data inherits the representation biases of that text. Technical documentation tends to describe procedures declaratively ("the steps are...") rather than procedurally (with explicit IF-THEN structure). The agent learns declarative descriptions of procedures and may be unable to execute the procedures when conditions don't match the described pattern.

When such an agent is subsequently prompted to produce procedural outputs (code, decision rules, operational protocols), it formats declarative knowledge into procedural structure — exactly the representation bias Yates documents. The format changes; the cognitive substrate does not.

**Mitigation**: When agent outputs need to be genuinely procedural, evaluate them not against whether they look like procedures (IF-THEN format), but against whether they perform like procedures — correctly handling edge cases, novel inputs, and situations that weren't in the training description.

### 2. Skill Selection Bias
In a multi-agent orchestration system, the skills available to an agent influence which types of knowledge the agent represents well. If most skills are designed for processing and transforming text (fundamentally declarative operations), the system will be biased toward declarative representations even for problems that require procedural knowledge.

A system with 180 skills, if 150 of them are essentially declarative in character (retrieve, summarize, classify, describe), will systematically produce declarative outputs regardless of the problem type — because those are the tools available.

**Mitigation**: Audit the skill library for the declarative/procedural balance. Identify which skills genuinely execute procedures (not just describe them) versus which skills produce descriptions of what should be done. Ensure adequate procedural skill coverage for domains where execution, not description, is the performance standard.

### 3. Evaluation Metric Bias
If agent performance is evaluated primarily on output quality metrics that are easy to measure — coherence, fluency, factual accuracy, completeness of coverage — evaluation will be biased toward declarative quality. Procedural quality (does the agent's recommended procedure actually work when executed? does it handle edge cases correctly?) is harder to measure and therefore systematically under-measured.

"The criteria for selecting methods would, therefore, influence both the type of knowledge that is extracted and the way in which the results are interpreted" (paraphrasing Yates's analysis, p. 25). In evaluation terms: the criteria for evaluating agent performance influence both what performance capabilities are developed and how results are interpreted.

**Mitigation**: Include procedural performance tests in agent evaluation — scenarios where the agent must execute (not just describe) a procedure correctly, including under conditions with incomplete information, novel situational patterns, and time pressure.

## The Specific Danger for Expert System Design

Yates's most pointed observation is about the knowledge acquisition process for expert systems specifically:

"Knowledge acquisition for expert systems appears to assume that expertise can be represented by conditional rules and seeks to capture declarative knowledge as an intermediate step. Development of training and other instructional programs, on the other hand, require the representation of both declarative and procedural knowledge that underlie expert performance of a task" (p. 76).

This creates a fundamental architectural asymmetry: expert systems and instructional design programs use similar knowledge acquisition processes but have different underlying assumptions about what kind of knowledge representation is sufficient. Expert system developers assume declarative knowledge can be compiled into adequate conditional rules. Instructional designers assume both types are needed and that they interact.

For AI agent systems that are intended to function as something between expert systems and learning systems — capable of both retrieving knowledge and performing — this asymmetry is a design flaw. The system needs both declarative and procedural representations, properly distinguished and properly evaluated.

## The "Active Ingredients" Alternative

Clark et al. (in press, cited by Yates) propose a "first principles" approach to CTA research: rather than cataloging all methods, identify the active ingredients — the specific features of methods that make them work for specific knowledge types.

"Merrill examined the key cognitive components of well-known research-based instructional design methods and identified their similarities, which he compiled as 'first principles.'" (p. 79). The suggestion is to do the same for CTA: find what makes Process Tracing work for procedural knowledge, what makes Concept Mapping work for conceptual structure, and build knowledge acquisition systems around those active ingredients rather than around named methods that may have drifted from their theoretical foundations.

For agent systems: rather than deploying "knowledge extraction skills" defined by their process (interview, document analysis, concept mapping), deploy skills defined by their active knowledge-type ingredients — "perceptual cue elicitation," "decision branch articulation," "condition-action compilation," "exception case enumeration." These ingredients target specific knowledge types and resist representation bias because their targets are defined by outcome, not format.

## Detecting Representation Bias After the Fact

Yates's empirical results suggest two diagnostic signals for representation bias:

**1. Unexpected method-outcome associations**: When a method that theoretically should produce one knowledge type consistently produces another (as with Repertory Grid producing procedural outcomes in expert system contexts), representation bias is a likely explanation.

**2. Knowledge type imbalance inconsistent with domain requirements**: When the knowledge type distribution of outputs is dramatically skewed (as Yates finds 75% declarative vs. 25% procedural overall), this suggests that elicitation and representation choices are distorting the distribution away from what domain expertise actually looks like.

For agent systems: if an agent consistently produces outputs that describe what should be done rather than implementing it, or if evaluations consistently find the agent strong on factual accuracy but weak on edge-case performance, these are diagnostic signals of representation bias — declarative knowledge in procedural clothing.

## Summary

Representation bias is the tendency for the intended output format to corrupt the knowledge extraction process, producing knowledge that is formatted correctly but is cognitively the wrong type. In CTA, this manifests as declarative knowledge formatted as IF-THEN rules. In agent systems, it manifests as training data biases, skill selection biases, and evaluation metric biases that systematically produce declarative outputs when procedural performance is required. Detecting representation bias requires checking not just format but cognitive substrate — do the system's outputs actually perform like procedures when tested under novel conditions? If not, the representation may be correct while the knowledge type is wrong.