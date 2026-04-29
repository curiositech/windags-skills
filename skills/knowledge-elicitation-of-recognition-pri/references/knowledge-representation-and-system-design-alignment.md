# Knowledge Representation and System Design: The Alignment Problem

## The Core Tension

There is a fundamental tension in the design of intelligent systems that use expert knowledge: the representations most convenient for computation are often the representations most distorting for the knowledge being represented.

Klein and MacGregor identify this tension explicitly as the central failure mode of traditional knowledge engineering:

> "The majority of knowledge base development processes have emphasized the use of highly structured methodological tools designed to fit conveniently into the knowledge representation schemes of expert systems and instructional design technologies. To their credit, they lead to knowledge bases that are readily operated on by computer technologies... To their detriment, they fail to preserve the contextual aspects of decision making and call upon experts to relate their experiences in unnatural and often meaningless ways."

The result is systematically impoverished knowledge bases — ones that capture the explicit, rule-like surface of expertise but miss the contextual, perceptual, and causal depth that constitutes the core of expert performance.

---

## How Representation Schemes Distort Knowledge

### Fault Trees and Expert Diagnostics
Fault trees are computationally tractable representations of causal failure paths. They are widely used in safety analysis and expert system construction. The problem: if a diagnostician does not naturally think in fault tree terms, imposing a fault tree structure "may lead the expert into an unnatural task or into a misrepresentation."

The expert will dutifully construct a fault tree. The resulting structure will be internally consistent and computationally operable. It will not accurately represent how the expert actually reasons about diagnostic problems — which is typically through pattern recognition, analogy to past cases, and causal model simulation rather than fault tree traversal.

### Decision Trees and Recognition-Primed Decisions
The standard knowledge engineering approach to decision making produces decision trees: if condition A then do X; if condition B then do Y. This representation assumes that decisions are made by testing discrete conditions and following logical branches.

The RPD model reveals that expert decisions are not structured this way. The expert is not testing conditions and following branches — they are recognizing a situation as an instance of a prototype and executing the associated action queue. These are fundamentally different computational structures. A decision tree cannot represent:
- The prototype match confidence and what happens when confidence is low
- The ordering of options in the action queue and the conditions under which each is preferred
- The mental simulation process that validates options
- The SA-Shift that causes the entire decision context to reconfigure

### Rule-Based Systems and Tacit Knowledge
Rule-based expert systems express domain knowledge as explicit IF-THEN rules. This representation captures the structural knowledge layer (what Klein and MacGregor call knowledge type a) but systematically excludes perceptual discriminations, conceptual causal models, analogical cases, and prototypicality judgments (types b, c, d, e).

The result: rule-based systems that can handle standard cases adequately but fail on edge cases — precisely because edge cases require the knowledge types that rule-based representation cannot capture.

---

## The Task-to-Model Direction of Fit

Klein and MacGregor identify the asymmetry at the heart of the problem:

> "The task is then fit to the model rather than the model to the task. Consequently, opportunities for aiding and support are sought by looking to the designer's abstract model rather than to the task's substantive elements."

This is a direction-of-fit error. The correct process: study the task as performed by experts → develop a representation that captures how they actually do it → build a system that supports or automates that actual process.

The incorrect process (which is common): select a representation scheme from the available toolkit → ask experts to describe their knowledge in terms of that scheme → build a system that implements the scheme.

The incorrect process is tempting because it is faster and more tractable — you know how to build rule-based systems, so you elicit rules. The result is a system that solves the problem the knowledge engineer knew how to solve, which may or may not be the problem the expert actually solved.

---

## Identification of Decision-Aiding Opportunities: The CDM Approach

Klein and MacGregor propose four criteria for identifying which components of a task are good candidates for decision aid support:

**1. Criticality**: Components that are important precursors to other components — failing here causes cascading failures downstream. Situation assessment is typically the most critical component.

**2. Temporal sufficiency**: Components where the available time window is too small for adequate human performance. A sooner and more accurate situation assessment can have "a large impact on the quality of a decision maker's performance."

**3. Quality of human performance**: Components where even experts reliably struggle — where inherent human cognitive limitations create predictable error patterns. Pre-flight checklists exist because even expert pilots cannot reliably remember all necessary items under the full cognitive load of flight preparation.

**4. Technical achievability**: "Highly achievable aids, in a relative sense, are those that present, collate or summarize information relevant to specific aspects of task performance." These are aids for the perceptual and information processing layers — displays, databases, information aggregators — rather than aids for the reasoning layer.

Crucially, this analysis must begin from the task as experts actually perform it — not from an abstract model. The CDM provides the knowledge base that makes this analysis possible.

---

## Implications for Agent System Architecture and Knowledge Representation

### 1. Build Around the RPD Structure, Not the Decision Analysis Structure
The RPD model provides a more accurate functional architecture for naturalistic decision-making than the standard decision analysis model. Representing domain knowledge in RPD terms means:

- **Prototypes**: Named situation types with associated cue patterns, goal structures, expectation sets, and causal dynamics
- **Action queues**: Ordered lists of applicable actions per prototype, with conditions under which each is appropriate
- **Cue patterns**: The specific perceptual and data features that identify each prototype and distinguish it from similar ones
- **Expectation structures**: What should happen next if the prototype is correctly matched
- **Causal models**: How the situation will evolve as a function of current state and applied actions
- **Analogical cases**: Specific prior incidents that provide concrete reference points for reasoning

This is richer and more complex than a rule base. It is also more accurately representative of how expert knowledge is actually organized.

### 2. Separate Decision Support from Decision Replacement
Klein and MacGregor's framework for decision aiding focuses on supporting the human decision process, not replacing it. The aid improves situation assessment (by providing better information faster), enhances option validation (by running more comprehensive simulations), or expands the action queue (by surfacing options the expert hasn't considered).

For agent systems, this distinction matters when the agent is operating in a human-oversight context. The agent's role may be to support a human decision-maker's RPD process rather than to make autonomous decisions. In this role, the highest-value contributions are:
- Early and accurate situation assessment (feeding the human's prototype matching)
- Monitoring for disconfirming cues (flagging potential SA-Shifts)
- Expanding the action queue with options the human might not have considered
- Running mental simulations more comprehensively than the human can in the available time

### 3. Represent What You Don't Know, Not Just What You Know
The knowledge base has gaps. Some situation types are well-covered; others are poorly represented. Some action queues are deep; others contain only one or two options. Some causal models are precise; others are rough approximations.

These gaps should be explicitly represented. The agent system should know which regions of its knowledge base are dense and which are sparse, and should calibrate its confidence accordingly. Operating in a sparse region should trigger:
- Explicit uncertainty in situation classification
- Shallow action queues (escalation is appropriate sooner)
- More conservative mental simulation thresholds (require higher confidence before committing to an action)
- Active requests for additional information to reduce situation assessment uncertainty

### 4. The Knowledge Base is the Asset; The Architecture is the Vehicle
The RPD insights suggest that the primary engineering investment in a sophisticated agent system should be in the **knowledge base** — the case library, the prototype structures, the cue inventories, the causal models — rather than in the reasoning architecture.

A mediocre reasoning architecture with a rich, accurate knowledge base will outperform a sophisticated reasoning architecture with a shallow or inaccurate knowledge base. Expert performance in the RPD model derives from the depth and accuracy of accumulated experience, not from the sophistication of the deliberation process applied to that experience.

This has practical implications: early development effort should focus on knowledge acquisition (CDM-equivalent elicitation, case library construction, prototype mapping) before architecture optimization. Premature optimization of the reasoning engine without adequate knowledge base development is a common and costly error.

### 5. Test with CDM-Style Incident Analysis
The standard evaluation paradigm for agent systems is benchmark performance — how does the system perform on a set of held-out test cases? Klein and MacGregor's work suggests this paradigm is insufficient.

A more informative evaluation protocol would apply CDM-style incident analysis to agent failures:
- What was the agent's situational assessment at the point of failure?
- What cues did the agent attend to and which did it miss?
- What options did the agent consider and in what order?
- What specific knowledge or prototype coverage would have been needed for correct performance?

This analysis generates the missing knowledge needed to close the performance gap — and it tells you *why* the agent failed, not just *that* it failed.