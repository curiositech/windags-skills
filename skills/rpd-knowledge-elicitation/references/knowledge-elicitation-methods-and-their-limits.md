# Knowledge Elicitation Methods: Capabilities, Failure Modes, and Design Principles

## Why Method Selection is a First-Order Decision

The process of building a knowledge base for an intelligent system begins long before any architecture decisions are made. It begins with the question: how will we get knowledge from people who have it into a form that the system can use?

Klein and MacGregor present this choice using a toolbox metaphor — a collection of elicitation tools, each suited to different knowledge types, different task structures, and different purposes. The choice of tool determines what kinds of knowledge can be captured and what kinds will be systematically missed. A knowledge base built with the wrong tool will produce a system that fails in predictable ways — and those failures may not be apparent until the system encounters the conditions the tool couldn't capture.

This document maps the tool landscape Klein and MacGregor survey, identifies the failure modes of each, and derives principles for knowledge elicitation in agent system contexts.

---

## The Tool Landscape

### Memory Recall and Reconstruction
**What it captures**: Explicit rules, procedures, facts, and memorable case examples that experts can verbally report.

**Mechanism**: Expert recalls cases (typical and atypical), knowledge engineer extracts and encodes the content.

**Strengths**: Easy to conduct, directly produces propositional content (rules, facts), scalable.

**Failure modes**:
- **Availability bias**: What gets recalled is influenced by vividness, salience, and recency — not representativeness. Memorable cases dominate the knowledge base; typical unremarkable cases are underrepresented.
- **Completeness illusion**: Experts and knowledge engineers both systematically overestimate how complete the resulting knowledge base is. "Failure to do so may lead to unwarranted confidence in the quality of the knowledge base elicited."
- **Tacit knowledge barrier**: Automatic, perceptual, and pattern-based knowledge doesn't surface through recall because it's not stored in propositional form.

**Best suited for**: Building the explicit rule and procedure layer of a knowledge base. Not sufficient alone.

---

### Cloze Experiments
**What it captures**: Decision-relevant relationships between situational features and appropriate responses, by selective omission.

**Mechanism**: Expert is given a scenario with key terms or conclusions omitted; provides the missing elements.

**Strengths**: Directly tests knowledge operationally rather than abstractly. The expert must demonstrate knowledge by completing specific scenarios rather than just describing it.

**Failure modes**:
- **Scenario construction dependence**: The quality of the output depends entirely on the quality of the scenarios constructed. The method provides no guidance on what scenarios to use.
- **Cognitive format mismatch**: The cloze format may not match how the expert's knowledge is organized. "The problem may be particularly acute for the cloze test when important qualifying details are omitted from scenario passages."

**Best suited for**: Validating and testing specific propositions about expert knowledge, not for initial discovery.

---

### Multidimensional Scaling (MDS)
**What it captures**: The conceptual structure of a domain — which concepts the expert groups together, which are seen as distant from each other.

**Mechanism**: Expert makes pairwise similarity judgments about domain concepts; statistical analysis reveals clustering and dimensionality.

**Strengths**: Can reveal implicit conceptual organization that experts cannot articulate directly. Useful for initial domain mapping.

**Failure modes**:
- **Element set dependence**: "The user must define the set of elements a priori." If the wrong concepts are included, the resulting map is a map of the wrong space.
- **No cognitive content**: MDS is a mathematical procedure. "It has no cognitive content apart from the interpretation given to its results by a knowledge elicitor." The map needs a theory to interpret it.

**Best suited for**: Initial domain structuring and identifying conceptual clusters to guide deeper elicitation. Not sufficient for capturing decision-making knowledge.

---

### Protocol Analysis (Think-Aloud)
**What it captures**: Reasoning processes during active problem-solving, as verbalized by the solver.

**Mechanism**: Subject thinks aloud while solving a problem; protocols are transcribed and analyzed.

**Strengths**: Provides detailed access to reasoning sequences during active problem-solving. Does not require retrospective reconstruction.

**Failure modes**:
- **Automaticity barrier**: Expert performance on familiar tasks is highly automatized. "Familiar tasks tend to be associated with readily available cognitive strategies for solving them... have the disadvantage of becoming highly automatized, rapid, and less accessible to studies of verbal protocols."
- **Verbalization distortion**: "People are typically unaccustomed to giving verbal expression to cognitive events and may seriously distort their reasoning processes in attempting to apply language concepts to them."
- **Analysis framework dependence**: "Protocol analysis provides virtually no guidance on how that data should be organized and interpreted."
- **Scheduling problem**: Operational non-routine incidents cannot be scheduled. The incidents where expertise matters most cannot be studied via think-aloud.

**Best suited for**: Studying reasoning in contexts where tasks can be observed as they occur and where automaticity is limited (early skill acquisition, novel problems). Poor fit for naturalistic expert performance.

---

### Repertory Grid
**What it captures**: The construct dimensions experts use to differentiate between cases or concepts; the implicit judgmental framework.

**Mechanism**: Expert makes triad comparisons (two elements are alike in this way; the third differs in this way), yielding a grid of element-construct ratings.

**Strengths**: Surfaces implicit differentiation criteria that experts may not spontaneously articulate. Produces a structured representation of expert categorization.

**Failure modes**:
- **Polarity forcing**: The triad method forces bipolar dimension construction. This "can produce an apparent orthogonal dimension structure when one is absent" and may produce "logical opposites rather than constructs that are logical in meaning."
- **Element set dependence**: "The selection of elements defines the relevant judgmental domain." Wrong elements → wrong constructs.
- **Clinical interpretation requirement**: "Interpretation is more clinical art than methodological technique."

**Best suited for**: Capturing the categorical distinctions experts use to differentiate situations — a useful complement to protocol analysis and CDM.

---

### Lens Model / Regression Approaches
**What it captures**: The implicit weighting of information cues in expert judgment, modeled as a regression equation.

**Mechanism**: Expert makes judgments across many systematically varied cases; regression analysis reveals implicit cue weights.

**Strengths**: Non-intrusive. Does not require experts to verbalize their reasoning. Produces a quantitative model of judgment policy.

**Failure modes**:
- **Cognitive process opacity**: "While a model obtained this way may bear good fidelity in a predictive sense to the behavior of the individual, there is no guarantee that the parameters within the model are isomorphic to the underlying cognitive processes that produced the response."
- **Limited to quantifiable cues**: Works for judgment tasks with identifiable, measurable cues. Fails for recognition-primed decisions where the cues themselves are not pre-specified.
- **Time pressure incompatibility**: Requires multiple carefully constructed cases, which cannot be presented at operational tempo.

**Best suited for**: Modeling judgmental policy in well-structured domains where cues are quantifiable and multiple observations are feasible.

---

### The Critical Decision Method
**What it captures**: The full range of expert knowledge types (structural, perceptual, conceptual, analogical, prototypical) as deployed in consequential non-routine incidents.

**Mechanism**: Semi-structured retrospective interview focused on recent non-routine incidents, with structured probes targeting different knowledge types.

**Strengths**:
- Operates at the productive boundary between routine and novel
- Accesses tacit knowledge indirectly through incident probing
- Preserves contextual richness
- Works with operational incidents that cannot be scheduled
- Produces multiple output types (Critical Cue Inventory, SAR, Decision Point Analysis, Case Studies)

**Failure modes**:
- **Retrospective reconstruction error**: Memory for even vivid incidents is imperfect. Reconstruction can be influenced by subsequent experience.
- **Interviewer expertise requirement**: The quality of CDM output depends heavily on the interviewer's domain familiarity and probing skill.
- **Availability bias in incident selection**: Experts select incidents that are memorable — which may not be representative.
- **Sample size limitation**: CDM interviews are expensive and time-consuming. Knowledge bases built from small numbers of incidents will have coverage gaps.

**Best suited for**: Primary elicitation method for expertise in naturalistic, time-pressured, high-stakes domains. Should be supplemented with other methods for complete coverage.

---

## Design Principles for Knowledge Elicitation in Agent Systems

### Principle 1: Cognitive Compatibility is Non-Negotiable
"A knowledge elicitation method is cognitively compatible to the extent that the structure and process used to elicit the knowledge is consistent with how that knowledge is naturally thought of or expressed by the expert."

If you impose a knowledge representation scheme (ontology, decision tree, probabilistic model) on experts whose knowledge is organized differently, you will get a forced translation that misrepresents what the expert knows. The representation scheme should follow the knowledge structure, not the other way around.

### Principle 2: Match Method to Knowledge Type
Different elicitation methods access different strata of the expert's knowledge:
- Rules and procedures → memory recall
- Conceptual structure → MDS + repertory grid
- Perceptual discriminations → CDM cue probes
- Causal dynamics → CDM causal factor probes
- Analogical cases → CDM analogue probes
- Expectation structures → CDM hypothetical and goal shift probes

A robust knowledge base requires multiple methods targeting multiple knowledge types.

### Principle 3: Prioritize Incidents Over Principles
When asking experts what they know versus asking them what they did in specific situations, prefer the latter. Incident-level knowledge is more accurate, more contextually grounded, and surfaces tacit knowledge that principle-level questioning misses.

For agent systems: training on behavioral records (what did the expert do, given these specific inputs, in this specific context) is more reliable than training on verbal explanations of decision processes.

### Principle 4: Build for Coverage Awareness, Not Coverage Completeness
No knowledge elicitation effort will produce a complete knowledge base. The goal is not completeness but **known incompleteness** — understanding which situation types are well-covered and which are not. Agent systems should be calibrated to recognize when they are operating in poorly-covered territory and respond with appropriate uncertainty and escalation behavior.

### Principle 5: Validate on Non-Routine Cases
Knowledge bases built from typical cases will validate well on typical cases. The failures will appear on non-routine cases — exactly the cases where intelligence is most needed. Validation protocols should deliberately include adversarial, edge, and boundary cases.

### Principle 6: Elicitation is Iterative
The model of knowledge base development Klein and MacGregor present is explicitly iterative: build prototype → test for completeness, consistency, and validity → resolve inconsistencies → revise → test again. A single elicitation pass produces a prototype, not a finished knowledge base.

This maps directly to agent system development: initial training produces a prototype system whose failure modes reveal the gaps in the knowledge base, which are then addressed through targeted additional elicitation or data collection.