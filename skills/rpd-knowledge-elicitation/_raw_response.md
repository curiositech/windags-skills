## BOOK IDENTITY

**Title**: Knowledge Elicitation of Recognition-Primed Decision Making (ARI Technical Report 799)
**Author**: Gary A. Klein and Donald MacGregor
**Core Question**: How do expert decision-makers actually make decisions in high-stakes, time-pressured, naturalistic settings — and how can we elicit, represent, and transfer that knowledge to build better training systems and decision aids?
**Irreplaceable Contribution**: This is the foundational technical report introducing both the Recognition-Primed Decision (RPD) model and the Critical Decision Method (CDM). Klein demonstrates empirically that expert decision-making under time pressure does not resemble normative decision analysis at all — experts rarely compare options, rarely enumerate alternatives, and succeed by *recognizing situations as instances of prototypes* and then mentally simulating a single course of action. No other work presents the CDM methodology in this level of procedural detail alongside the theoretical justification for why it was needed. This is the source document, not a summary of someone else's ideas.

---

## KEY IDEAS

1. **Recognition over enumeration**: Expert decision-makers under time pressure do not generate and compare multiple options — they recognize a situation as typical, access an associated course of action, and either execute it immediately or simulate it mentally to check feasibility. The decision is made *before* any formal comparison occurs. This is the core finding of the RPD model.

2. **Situation assessment is the bottleneck**: The cognitive work that separates experts from novices happens almost entirely in the pre-decision phase — the recognition of situation typicality, identification of critical cues, formation of expectations, and awareness of what goals are achievable. Once the situation is correctly assessed, the course of action is often obvious. Wrong decisions flow from wrong assessments, not from poor option-comparison.

3. **Expertise lives at the boundary between routine and novel**: Standard knowledge elicitation fails because routine tasks are automatized (experts can't describe them) and novel tasks don't involve domain expertise (the subject is effectively a novice). The productive zone for eliciting expertise is *non-routine incidents that required expertise* — events at the boundary where expert pattern libraries were genuinely stretched.

4. **Tacit knowledge is the core of expertise, not rules**: The most important things experts know cannot be expressed as rules or procedures. They consist of perceptual pattern recognition, analogical case libraries, anticipation of causal dynamics, and recognition of when standard patterns don't apply. Traditional knowledge representation schemes systematically fail to capture this, producing knowledge bases that experts reject as missing what actually matters.

5. **The knowledge-action gap is structural**: Experts cannot accurately report their own decision processes. They know more than they can tell (Polanyi's tacit dimension). This means elicitation methods that simply ask experts to explain their reasoning will systematically underrepresent the actual cognitive basis for expert performance. The CDM is designed specifically to work around this barrier by probing *incidents* rather than asking for abstract principles.

---

## REFERENCE DOCUMENTS

### FILE: recognition-primed-decision-model.md
```markdown
# The Recognition-Primed Decision Model: How Experts Actually Decide

## Why This Matters for Agent Systems

The dominant assumption embedded in most decision-support systems, planning algorithms, and agent architectures is that good decisions require:
1. Generating all possible options
2. Evaluating each option against a common set of criteria
3. Selecting the option with the highest score

This assumption is wrong — not marginally wrong, but fundamentally incompatible with how human experts actually make decisions under time pressure in naturalistic settings. Klein and MacGregor's empirical work with fireground commanders, tank platoon leaders, paramedics, and other domain experts converges on a different model: the **Recognition-Primed Decision (RPD) model**. Understanding this model is essential for any agent system that must make decisions under uncertainty, time pressure, or ambiguous information.

---

## The Three Levels of RPD

Klein and MacGregor describe three variants of the RPD model, ordered by increasing cognitive complexity:

### Level A-1: Automatic RPD
The decision-maker uses available cues and accumulated knowledge to **recognize a situation as familiar or typical**. This recognition automatically surfaces:
- What goals can be achieved given this situation type
- Which cues to monitor
- What expectations to form about how the situation will evolve
- A "typical reaction" — the action normally associated with this situation class

If the situation is sufficiently routine, the typical reaction is implemented directly, with no conscious deliberation. An experienced fireground commander arrives at a scene, reads the smoke color, building type, and flame characteristics, and within seconds is issuing commands — not because she computed an optimal strategy, but because she recognized the situation as an instance of a known type and accessed the associated response.

### Level A-2: Verified RPD
The decision-maker recognizes typicality but has time for minimal evaluation. The typical course of action is accessed from an "action queue" — an ordered repertoire of options, with the most contextually appropriate listed first. Before implementing, the decision-maker runs a quick **mental simulation**: imagining the action being carried out and checking whether it produces the desired outcome without generating unacceptable side effects.

Critically: **no other option is considered at the same time**. The mental simulation either confirms the option (implement), suggests a modification (implement a modified version), or rejects it (move to the next option in the queue).

### Level A-3: Serial RPD
The most complex case. The favored option is seriously evaluated via mental simulation, potentially rejected, and the next option in the action queue is considered. This continues until a workable option is found. Even here, **options are never compared against each other simultaneously** — they are evaluated serially, one at a time, against the single criterion of "will this work?"

As the report states: "At no time will the decision maker attempt to generate more than one option at a time, or to evaluate options by contrasting strengths and weaknesses."

---

## What Precedes the Decision: Situation Assessment

What actually distinguishes expert from novice performance is not the quality of option evaluation — it is the quality of **situation assessment**. The RPD model's key insight is that situation assessment is the primary cognitive work. Klein and MacGregor describe situation assessment as including:

- **Cue recognition**: What sensory data is present? What does it mean?
- **Prototype matching**: Does this situation resemble a familiar type?
- **Goal identification**: What can be accomplished? What is the priority?
- **Expectancy formation**: What will happen next if this prototype holds?
- **Causal dynamics modeling**: What forces are shaping the situation's evolution?

Experts are not better at evaluating options. They are better at recognizing situations correctly, which makes the appropriate option obvious. When experts make bad decisions, they almost always trace to failed situation assessment — misidentifying the situation type — not to a logical error in comparing options.

The Situational Awareness Record (SAR) that Klein and MacGregor develop for knowledge base construction captures this explicitly: it tracks not the decision but the evolving *understanding* of what the situation is, with each update (SA-Elaboration or SA-Shift) representing the acquisition of new information that changes or refines the current prototype match.

---

## Why Normative Decision Analysis Fails in Practice

Klein and MacGregor document the failure of formal decision analysis (enumerate options → assign probabilities → compute expected utilities → choose maximum) across multiple domains:

1. **Time incompatibility**: Analytical decision strategies are not effective when there is less than one minute to respond (Howell, 1984; Zakay & Wooler, 1984). Real-world command situations often require responses in seconds.

2. **Option generation failure**: People are very poor at generating complete sets of options (Gettys & Fisher, 1979). Expecting exhaustive enumeration sets up a systematic failure mode.

3. **Probability calibration failure**: Uncertainty assessments are poorly calibrated and exhibit insensitivity to actual knowledge levels (Lichtenstein, Fischhoff & Phillips, 1982).

4. **Artificial task mismatch**: Laboratory paradigms use well-defined tasks, naive subjects, ample time, and no personal consequences. These conditions specifically eliminate the features (ambiguity, time pressure, domain knowledge, stakes) that define real expertise.

The report is explicit: "The paradigms do not generalize well to natural environments where there is usually time pressure, limited resources, dynamic and ambiguous goals."

---

## The Role of Mental Simulation

One of the most important and underappreciated elements of the RPD model is **mental simulation** as an option evaluation mechanism. Rather than comparing Option A against Option B, the expert imagines Option A being executed in the current situation and watches what happens.

This mental simulation leverages the same causal knowledge that supports situation assessment. The expert has a mental model of how the situation dynamics work — how fire spreads through different building materials, how enemy units respond to flanking maneuvers, how patients in shock present — and can run this model forward to test whether a proposed action will achieve the desired outcome.

Mental imagery appears consistently across all of Klein and MacGregor's studies: "We have seen it in virtually all the studies we have performed. An example is the firefighter who ran through several repetitions of an image of how an unconscious car-accident victim was going to be supported prior to initiating the rescue."

The simulation is not abstract probability estimation. It is kinesthetic, contextual, and scenario-specific. This is a crucial distinction: the expert is not asking "what is the probability this will work?" but rather "can I imagine this working, given everything I know about this specific situation?"

---

## Implications for Agent System Design

### 1. Replace Option Comparison with Option Validation
Agent systems that generate N options and select the best via scoring function are implementing the normative model that human experts abandon under time pressure. A more naturalistic architecture generates **one option at a time from the most-to-least-typical ordering for the recognized situation type**, then validates each via simulation before implementation. This preserves the ability to act at every moment (always have a primed option) while allowing progressively deeper evaluation when time permits.

### 2. Invest Architecture in Situation Assessment, Not Option Evaluation
The RPD model implies that computational resources should be allocated primarily to:
- Cue recognition and pattern matching against known situation prototypes
- Causal modeling of situation dynamics
- Expectancy generation (what should I see next if my current assessment is correct?)

Option evaluation, by contrast, becomes relatively simple once the situation is correctly assessed: simulate one candidate action and check whether the causal model predicts success.

### 3. Maintain an Action Queue, Not a Decision Tree
Expert decision-making is better modeled as a **prioritized queue of applicable actions** for each recognized situation type, rather than a decision tree that must be traversed to a leaf node. The queue allows immediate action (take the top option), supports graceful degradation when the top option fails (try the next), and doesn't require exhaustive evaluation.

### 4. Separate Situation Assessment Confidence from Action Confidence
The RPD model suggests these can decouple. An expert may be highly confident in their situation assessment (I know this is a Type 3 situation) but uncertain about which action will work (the top option might not fit these specific constraints). Flagging when situation assessment is uncertain (SA-Shift risk is high) versus when the action queue is sparse (no well-validated options exist for this prototype) enables more intelligent escalation decisions.

### 5. Support SA-Shift Detection
One of the most dangerous failure modes in RPD-style decision-making is failure to update situation assessment when new information contradicts the current prototype match. Agents should maintain explicit vigilance for **disconfirming cues** — information that doesn't fit the current situational model — and trigger SA-Shift evaluation when such cues accumulate beyond threshold.

---

## Boundary Conditions: When RPD Doesn't Apply

The RPD model is descriptive of expert performance in naturalistic, time-pressured domains. It is not universally appropriate:

- **Truly novel situations** with no prior prototype have no recognized typicality to prime an action queue. The expert falls back to slower, more deliberative reasoning. Agents must have a fallback path when no prototype match meets confidence threshold.
- **High-stakes irreversible decisions** with ample time may warrant deliberative comparison even for experts. The RPD model itself acknowledges that when time permits, experts sometimes do compare options — they just rarely need to.
- **Multi-stakeholder value conflicts** cannot be resolved by pattern recognition alone; explicit normative reasoning about values is appropriate.
- **Novel domains where the agent has no accumulated prototype library** — RPD requires prior experience. A freshly initialized agent without domain exposure has no pattern library and cannot operate in RPD mode.

---

## The Coup d'Oeil Connection

Klein and MacGregor invoke von Clausewitz's concept of *coup d'oeil* — "the skill of making a quick assessment of a situation and its requirements" — to anchor the RPD model historically. Military commanders who could instantly read a battlefield and act were not computing expected utilities; they were pattern-matching at expert speed.

This historical resonance matters for agent design because it suggests the RPD architecture is not a computational approximation of something better. It *is* the better architecture for naturalistic conditions. The analytical models are special cases, appropriate for structured problems with ample time — not the default that experts devolve from when pressed.
```

---

### FILE: situational-awareness-as-primary-cognitive-work.md
```markdown
# Situational Awareness as the Primary Cognitive Work of Expertise

## The Central Insight

Conventional analysis of expert performance focuses on what experts *do* — their actions, their decisions, their outputs. Klein and MacGregor's research consistently redirects attention upstream: the decisive work happens before any action is selected. It happens in the formation of **situational awareness** — the expert's understanding of what kind of situation this is, what is at stake, what forces are operating, what will happen next.

The report defines this precisely: situation assessment involves an expert's understanding of "the dynamics of a particular case and is the basis for the ability to recognize cases as examples of standard prototypes." The Situation Assessment Record (SAR) the authors develop treats decision-making as fundamentally a **pattern-matching and causal-modeling process**, not an option-evaluation process.

This reframing has profound implications for how agent systems should allocate cognitive resources and structure their reasoning pipelines.

---

## The Structure of Situational Awareness

Klein and MacGregor's analysis of fireground commanders reveals that situational awareness has layered structure. For the urban fireground command task, experts assess across nine dimensions simultaneously:

1. **Problem** — smoke characteristics (color, amount, toxicity), fire amount and location, explosion potential, chemicals, rate of change
2. **Structure** — building type, materials, architecture, age
3. **Problem × Structure interaction** — where is the seat of the fire? What are the possibilities for fire movement given this structure?
4. **Weather** — temperature, moisture, wind velocity and direction
5. **Risk to Life** — direct cues, knowledge of potential risk, special populations
6. **Risk to Firefighters**
7. **Nature of Attack** — progress, hindrances
8. **Resources** — available, needed, special needs
9. **Goals Assessment** — search and rescue, fire control, property conservation

The expert doesn't check these dimensions sequentially. They are integrated simultaneously into a coherent picture — a *gestalt* of the situation — that immediately suggests what prototype applies and what actions are appropriate.

For a tank platoon leader, the dimensions are different (terrain, enemy position, friendly positions, mission objectives, timing) but the structure is the same: **multi-dimensional simultaneous integration** into a coherent situational model.

---

## Dynamic Situational Awareness: Elaboration and Shift

Situational awareness is not static. As incidents unfold, new information either:

**Elaborates** the existing model (SA-Elaboration): The commander's prototype match is confirmed, but additional detail becomes available. Goals become more specific. The action queue can be refined. The mental simulation of options becomes more accurate.

**Shifts** the existing model (SA-Shift): New information contradicts the current prototype match. The existing goals may need to be abandoned. A new prototype must be found or constructed. This is cognitively expensive and time-consuming — exactly when expert performance advantage is largest.

The Situational Awareness Record (SAR) makes this dynamic explicit:

```
SA-1: Initial Cues/Goals → Decision Points 1 and 2 (based on this assessment)
SA-2: Elaboration — additional cues deepen but don't change the model → Decision Point 3
SA-3: Shift — contradicting information → original goals rejected, new goals established → Decision Points 4, 5, 6
```

The most dangerous moments in expert decision-making are SA-Shifts that are *missed* — situations where contradicting information arrives but the expert fails to update their situational model. This is the mechanism behind confirmation bias in expert performance: the prototype match is so strong that disconfirming evidence is filtered out or reinterpreted to fit the existing model.

---

## The Tanker Truck Incident: A Case Study in Situational Awareness

The exemplar incident (Appendix B) demonstrates the SAR structure vividly. Chief McW responds to a tanker truck fire:

**Initial SA formation (first ~30 seconds):**
- Visual cue: large column of black smoke in unexpected location → acts on visual rather than dispatcher's location report (expertise: dispatch coordinates can be wrong; smoke doesn't lie)
- First sight of tanker: ruptured *lengthwise* rather than split in half → immediate relief, because "the danger of explosion was less"
- This is pure cue-to-prototype matching. The Chief knows that a lengthwise rupture has different explosion dynamics than a transverse split. This knowledge is not in any standard operating procedure — it's accumulated from experience with fuel fires.
- Second tanker: ~50 feet away → new threat element added to situational model
- Driver interview: JP-4 jet fuel, full load → refines the causal model (combustibility, foam vs. water requirements)

**SA-Elaboration through the incident:**
- Foam units arrive → goal shifts from containment to suppression
- Protective water streams established → safety goal integrated
- "The Chief felt that the situation was pretty much under control"

**SA-Shift (unexpected):**
- Storm sewer explodes into flame
- Burning fuel is in the sewer system
- This is *not* in the current prototype — it exceeds the incident type the Chief was managing
- Immediate recognition: "this new aspect of the situation would exceed his span of control"
- Response: call another alarm, delegate the sewer problem to the arriving Chief, retain personal focus on the tanker

The SA-Shift is handled correctly because the Chief has a *meta-prototype*: when a situation exceeds the current model in a way that creates a second, separate threat thread, escalate and distribute command. The shift itself is recognized and acted on within seconds.

---

## Why Situation Assessment is Where Expertise Lives

Klein and MacGregor observe that expertise "often occurs only at the boundaries of a problem domain." Routine problems don't require deep expertise — trained people can handle them. Novel problems don't reveal expertise — everyone is effectively a novice. The productive zone is:

> "Non-routine incidents that required expertise, and were carried out effectively only because of that expertise."

And the expertise that matters in these incidents is almost never option-evaluation skill. It is:

1. **Detecting non-routine features** — noticing that the situation has elements that don't fit the standard pattern
2. **Accessing the right prototype** — having a rich enough prototype library that the non-routine situation still resembles something familiar
3. **Correctly modeling causal dynamics** — understanding *why* the situation will evolve the way the prototype predicts
4. **Forming accurate expectations** — knowing what should happen next if the current assessment is correct, and being alert to disconfirmation

An expert who gets these right will generate an adequate action automatically. An expert who gets these wrong cannot be saved by superior option-evaluation — they will be selecting from the wrong option queue for the wrong prototype.

---

## Implications for Agent Architecture

### Situation Assessment as a Dedicated Phase
Agent systems should explicitly separate **situation assessment** from **action selection**. These are not the same computation and should not be collapsed into a single "decision" step.

The situation assessment phase should produce:
- A prototype label (what kind of situation is this?)
- A confidence score (how well does this situation match the prototype?)
- A set of active goals (what can/should be accomplished?)
- A set of monitored cues (what should I watch for next?)
- A set of expectations (what should I see if my assessment is correct?)
- A flag for SA-Shift risk (am I seeing disconfirming evidence?)

Only after situation assessment produces a sufficiently confident prototype match should the action selection phase activate — pulling from the associated action queue.

### Expectation Violation as a Primary Signal
Because situational awareness depends on forming accurate expectations, **expectation violation** — receiving information that contradicts what the current prototype predicted — should be treated as a high-priority interrupt. It is the primary signal that an SA-Shift may be required.

Agents that can only process what they receive passively, without actively monitoring for what they *expect* to receive and didn't, will systematically miss SA-Shift triggers.

### Cue Weighting is Domain-Specific and Cannot Be Generic
The nine situational awareness dimensions for fireground command are completely different from those for tank platoon command, which are different from those for paramedic triage, which are different from those for MIS system management. Klein and MacGregor found this consistently across all their CDM studies.

This means there is no generic "situation assessment module" that will work across domains. Situation assessment must be **domain-specialized**. For agent systems, this implies that the cue-to-prototype mappings, the relevant monitoring dimensions, and the causal dynamics models must be built from domain-specific knowledge elicitation — not from general-purpose reasoning.

### Span of Control Awareness
One of Chief McW's most important cognitive acts in the tanker incident was recognizing that the sewer fire exceeded his span of control. He did not try to manage both threads simultaneously. He escalated and delegated.

Agent systems should similarly model their own span of control — the number of simultaneous situational models they can maintain with adequate fidelity. When a new sub-situation emerges that would exceed this span, the appropriate response is escalation (request additional agent resources) or delegation (hand off one thread to another agent), not degraded performance across all threads.

---

## What Distinguishes This from Generic "Context Awareness"

Many agent systems claim to be "context aware." Klein and MacGregor's framework is more specific and more demanding:

Generic context awareness: "I know what data is in my current state."

Expert situational awareness: "I know what kind of situation this is, what will happen next, what I should be monitoring that I haven't received yet, and what would force me to reassess my current model."

The difference is the presence of **active causal modeling** and **expectation formation**. Situational awareness is not a snapshot — it is a running prediction about how the situation will evolve, subject to continuous confirmation or disconfirmation.
```

---

### FILE: tacit-knowledge-elicitation-for-agent-systems.md
```markdown
# Tacit Knowledge Elicitation: What Experts Know But Cannot Tell

## The Core Problem

Michael Polanyi's observation — cited by Klein and MacGregor — that "we can know more than we can tell" is not a minor qualification about expert communication. It describes a structural feature of expertise that makes conventional knowledge engineering systematically fail.

When a knowledge engineer sits down with an expert and asks "how do you make this decision?" the expert will answer. They will produce rules, principles, checklists, and procedures. These will be genuine, sincere, and substantially wrong. Not because the expert is lying or incompetent at introspection, but because the actual cognitive basis for their performance is not stored in propositional form and cannot be accurately recovered through verbal report alone.

Nisbett and Wilson's 1977 work — cited directly in the report — establishes this empirically: people systematically "tell more than they can know" about their own mental processes, producing confident explanations that don't correspond to the actual processes that generated their behavior.

For agent systems that incorporate domain expertise — whether through training data, knowledge base construction, or expert-in-the-loop design — this problem is fundamental. The question is not whether tacit knowledge exists, but how to get at it.

---

## The Taxonomy of Expert Knowledge

Klein and MacGregor distinguish several knowledge categories:

**(a) Structural knowledge: scripts and rules**
This is the most accessible knowledge — explicit procedures, if-then rules, decision trees. This is what standard knowledge engineering captures well. It represents the outer shell of expertise.

**(b) Perceptual discriminations and pattern recognition**
The ability to perceive meaningful differences in sensory data that a novice would see as identical or undifferentiated. A fireground commander reads smoke color as a precise diagnostic indicator. A paramedic reads a patient's skin tone, breathing pattern, and affect as a gestalt that immediately classifies the severity of their condition. This knowledge cannot be verbalized directly — it can only be demonstrated and potentially captured through structured elicitation of the cues that matter and why.

**(c) Conceptual patterns and discriminations: causal factors**
Understanding of the underlying dynamics that explain why situations evolve the way they do. Not "when I see X, I do Y" but "X causes Y because of Z, so when I see X, I know Y is coming and I should prepare." This causal understanding is what allows experts to form accurate expectations.

**(d) Analogues and metaphors**
Specific prior incidents that serve as reference points for current situations. The billboard that collapsed when its supports burned, informing a later decision to push crowds back. These analogical cases are stored as episodes and retrieved by similarity, not by rule-lookup. They carry enormous amounts of contextually embedded causal knowledge that is essentially inaccessible except through narrative.

**(e) Judgments of prototypicality and familiarity**
The felt sense of "this is typical" or "this is unusual" that precedes conscious analysis. Experts can often recognize that a situation is unusual before they can articulate why. This meta-cognitive signal is itself diagnostic information — the feeling that something is off is data, not noise.

Standard knowledge elicitation methods are excellent at capturing (a) and partial at capturing (c) in explicit form. They are very poor at capturing (b), (d), and (e) — which, according to Klein and MacGregor, is where the distinctive value of expertise actually resides.

---

## Why Standard Elicitation Methods Fail

### Memory Recall: The Availability Bias Problem
Asking experts to recall cases introduces systematic bias: what gets recalled is influenced by vividness, salience, and recency — not by the actual frequency or importance of the knowledge being sought. The most vivid case is not necessarily the most representative or instructive case.

Furthermore, people are "typically very poor at gauging the degree to which a structure they have been given to assist them in remembering components of a problem is a complete structure" (Fischhoff, Slovic & Lichtenstein, 1978). Experts will judge an elicitation framework as more complete than it is, leaving systematic gaps that neither the expert nor the knowledge engineer recognizes.

### Protocol Analysis: The Automaticity Problem
Think-aloud protocols work well for unfamiliar tasks (where subjects are actually reasoning deliberately and can verbalize the process). They work poorly for expert performance precisely because expert performance is **highly automatized** — the cognitive processes are rapid, parallel, and largely below the threshold of verbal accessibility.

As Klein and MacGregor note: "Familiar tasks tend to be associated with readily available cognitive strategies for solving them... have the disadvantage of becoming highly automatized, rapid, and less accessible to studies of verbal protocols."

The very expertise you want to capture is the part that is least accessible to protocol analysis.

### Normative Frameworks: The Cognitive Incompatibility Problem
A critical failure mode is eliciting knowledge through a framework that doesn't match how the expert actually represents the problem. If a fault tree representation is imposed on a diagnostician who doesn't think in fault tree terms, the elicitation process "may lead the expert into an unnatural task or into a misrepresentation."

The expert will dutifully fill out the fault tree, producing something that looks like valid knowledge but is actually a forced translation from the expert's natural representation into an alien one. The translation necessarily loses information. Knowledge representation schemes designed for computational convenience frequently have this property when imposed on domain experts.

---

## The Critical Decision Method: Working at the Boundary

Klein and MacGregor's solution — the Critical Decision Method (CDM) — is built on a specific theoretical insight:

> "We feel that it is at the boundary between routine and novel where expertise is stretched far enough to become visible."

The CDM deliberately targets **non-routine incidents** — events that were:
- Recent enough to be well-remembered
- Challenging enough to have genuinely required expertise
- Resolved well enough to have produced a good outcome worth studying

This is the productive zone:
- Routine cases: expertise is automatic and invisible, nothing to elicit
- Completely novel cases: the expert is operating outside their expertise, so you're not studying expertise
- Non-routine cases requiring expertise: the expert's pattern library was stretched, their causal models were actively engaged, and the decision process was slow enough to leave cognitive traces

Critically, the CDM interviews about **past incidents** rather than asking for think-aloud during ongoing problem-solving. This gives up experimental control but gains access to critical incidents that cannot be scheduled. The expert's memory of a vivid, consequential incident is richer and more representative of true expertise than their performance on a laboratory task.

---

## The CDM Probe Structure

The CDM uses structured probes to extract different knowledge types:

**Decision Point Options**: What alternative courses of action existed? What were the advantages and disadvantages of options not chosen? This surfaces the action queue structure associated with the recognized situation type.

**Cues**: What sensory data was critical to the expert's understanding? This surfaces perceptual discriminations — the specific features experts attend to that novices miss.

**Causal Factors**: What underlying dynamics affected what was possible, what was expected? This surfaces causal models — the expert's theory of how the situation works.

**Goal Shifts**: Where did the expert's understanding of what was possible or necessary change radically? This surfaces SA-Shift triggers and the conditions under which a situation reclassifies.

**Analogues**: What prior incidents was this situation similar to? What was different? This surfaces the episodic case library that experts use for analogical reasoning.

**Errors**: Where did the expert (or other experts) get it wrong? Errors are particularly valuable because they reveal the boundary conditions of expertise — where the pattern library fails, where the causal model breaks down.

**Hypotheticals**: What would have happened if X had not occurred? This surfaces expectancies — what the expert predicted would happen and why.

**Desired Data**: What information would the expert have wanted but didn't have? This surfaces the information architecture of expert decision-making — what signals they depend on.

Each probe type targets a different stratum of the tacit knowledge structure. Together they build a multi-layered picture that no single probe type could produce.

---

## Applications to Agent Knowledge Base Construction

### 1. Never Use Expert Rules as the Primary Knowledge Source
Rules that experts articulate under direct questioning represent the most accessible, least differentiating layer of their knowledge. They are necessary but not sufficient. A knowledge base built only from rules will produce a system that handles routine cases adequately but fails at the non-routine cases that most require expertise.

### 2. Build Incident Libraries, Not Just Rule Sets
The CDM produces **incident accounts** — rich narratives of specific cases with their cue patterns, situational assessments, decision points, and outcomes. These incident libraries serve multiple purposes:
- As training data for prototype learning
- As case-based reasoning libraries for analogical retrieval
- As evaluation benchmarks for testing whether a system can replicate expert performance on known cases
- As explanation resources (when the agent makes a decision, it can cite the analogous incident)

### 3. Elicit Cues Before Concepts
The perceptual discriminations that distinguish expert from novice performance (knowledge type b in Klein and MacGregor's taxonomy) must be identified before they can be represented. This requires specifically asking experts what they noticed — what sensory or data features they attended to — rather than asking them to explain their reasoning.

For AI systems, this translates to: identify what input features expert performance actually depends on, not what features seem conceptually relevant to the task. These may be completely different.

### 4. Map Expectation Structures
One of the CDM's most valuable products is the **Situation Assessment Record** — which tracks not just what the expert knew but what they expected to happen at each point. For agent systems, this expectation structure is critical: it defines what the system should be looking for, what constitutes confirming evidence, and what constitutes disconfirming evidence requiring reassessment.

### 5. Elicit Novice Failure Modes Explicitly
The probe "how might a less experienced officer have behaved differently?" and "where are mistakes most likely?" directly surfaces the failure modes that training and design must protect against. These are the cases where the agent should be most cautious, most willing to seek additional information, and most likely to escalate.

---

## The Verification Problem

Klein and MacGregor acknowledge a deep problem: knowledge bases produced by any elicitation method may be incomplete in ways that neither the expert nor the knowledge engineer can detect. The framework provided to structure recall shapes what gets recalled, and people overestimate the completeness of the resulting picture.

For agent systems, this implies that:
1. Knowledge base validation should prioritize edge cases and non-routine scenarios, not typical cases
2. The agent should maintain explicit uncertainty about its knowledge base coverage
3. Performance on novel situations (those dissimilar to any case in the knowledge base) should trigger heightened uncertainty and escalation propensity
4. The knowledge base should be treated as iteratively improvable, with each agent failure being analyzed as a CDM incident to extract the missing knowledge
```

---

### FILE: failure-modes-of-expert-decision-making.md
```markdown
# Failure Modes in Expert Decision-Making: What Can Go Wrong and Why

## Overview

Klein and MacGregor's work is primarily constructive — they are building a model of how expert decision-making works, not cataloguing its failures. But the structure of the Recognition-Primed Decision model and the Critical Decision Method reveals, by implication and by direct acknowledgment, a set of systematic failure modes that are specific to expert naturalistic decision-making. These failure modes are distinct from the biases documented in behavioral decision theory laboratory research, and they are highly relevant to the design of agent systems that must perform reliably under uncertainty.

---

## Failure Mode 1: Prototype Misclassification

**What it is**: The expert's pattern-matching process confidently identifies the situation as an instance of prototype X when it is actually an instance of prototype Y. All subsequent situation assessment, expectation formation, and option selection is calibrated for the wrong situation type.

**Why it happens**: The pattern-matching process is fast, parallel, and largely preconscious. It is triggered by the features most salient in the initial observation. If the current situation shares many surface features with prototype X but differs on the causally critical features that distinguish it from prototype Y, the initial classification will be X — and may remain X even as contradicting evidence accumulates, because confirmatory cues are being selectively attended to.

**Klein and MacGregor's example**: The representativeness heuristic at work — "a battle commander might be fooled into reacting wrongly because the enemy presents to him a subset of activities that are like those that appeared previously when the enemy took certain actions. The commander ignores the other actions these activities might also indicate; basing his reaction solely upon a single previous event and a limited subset of the possible indications."

**Agent system implication**: Prototype classification should carry explicit confidence scores based on the *discriminating* features of the matched prototype — not just on the number of shared features. Features that are common to multiple prototypes are weak evidence; features that are distinctive to one prototype are strong evidence. The classifier should weight diagnostic discriminability, not raw similarity count.

**Detection mechanism**: Expectation monitoring. If the currently matched prototype predicts feature F at time T, and F does not appear, this is disconfirming evidence. Accumulating disconfirmation should trigger prototype reassessment.

---

## Failure Mode 2: SA-Shift Failure (Failure to Update)

**What it is**: New information arrives that genuinely indicates a need to revise the current situational model, but the revision does not occur. The decision-maker continues acting on an outdated or incorrect situation assessment.

**Why it happens**: The prototype match creates a strong prior. New information that contradicts the prior is expensive to process — it requires not just updating a fact but potentially reconstructing the entire situational model. Under time pressure, this reconstruction may be deferred or avoided. The expert may reinterpret contradicting evidence as consistent with the current model rather than triggering a shift.

**Klein and MacGregor's framework**: The SAR structure makes this failure explicit. Each SA-Elaboration is low-risk (it deepens the existing model). Each SA-Shift is high-risk (it requires abandoning the existing model and constructing a new one). The failure mode is treating an SA-Shift signal as an SA-Elaboration signal — updating a detail rather than revising the overall model.

**The tanker incident example**: When the storm sewer explodes, Chief McW correctly recognizes this as an SA-Shift — a new component of the situation that requires a new response thread — rather than treating it as an elaboration of the tanker situation. An expert who failed to make this distinction might have attempted to manage the sewer fire with the same resources as the tanker, leading to both being inadequately addressed.

**Agent system implication**: Implement explicit SA-Shift detection logic. Define, for each active situational model, the evidence patterns that would require a model revision (not just an update). Monitor specifically for these patterns. When they appear, trigger a full reassessment rather than a local update.

---

## Failure Mode 3: Action Queue Exhaustion

**What it is**: The expert works serially through the action queue for the currently recognized prototype, rejecting each option via mental simulation, until no further options are available. The situation requires action, but no validated option exists.

**Why it happens**: The prototype match determines the action queue. If the prototype is correct but the specific situation has unusual constraints that make all standard responses infeasible, the expert has no pre-loaded alternatives. This is the edge of the expert's experience — where accumulated case knowledge does not cover the current situation.

**Klein and MacGregor's framework**: The serial RPD model (A-3) describes this path explicitly — the favored option is implemented, modified, or rejected for the next. But the model assumes the queue is non-empty. When the queue is exhausted, the expert is forced into a mode for which the RPD model provides no guidance.

**Agent system implication**: Agents should track action queue depth explicitly. As options are exhausted, uncertainty should increase and escalation thresholds should decrease. An empty action queue (no validated option remains for the current prototype) is a critical failure condition that should trigger immediate escalation or request for human oversight.

---

## Failure Mode 4: The Articulation Gap (Introspective Error)

**What it is**: The expert's verbal account of their decision process does not accurately reflect the cognitive processes that actually produced the decision. This matters both for training system design (the system learns from incorrect self-reports) and for post-hoc accountability (the expert cannot explain a good decision in terms that transfer to others).

**Why it happens**: Nisbett and Wilson's work (cited by Klein and MacGregor) establishes that people "tell more than they can know" about their mental processes. The actual basis for expert decisions involves perceptual pattern recognition and automatic processes that are not available to verbal introspection. The expert constructs a plausible post-hoc explanation that fits their understanding of how decisions *should* be made, not how this one *was* made.

**Klein and MacGregor's concern**: This is precisely why the CDM is structured as it is — to probe *incidents* with specific cues, rather than asking for principles. The incident context partially bypasses the introspective error by anchoring the discussion in concrete sensory detail: "what did the smoke look like?" is harder to confabulate than "how do you read smoke?"

**Agent system implication**: When training agents on expert behavior, prefer behavioral evidence (what the expert did, in response to what cues, with what outcome) over verbal explanations (what the expert says they do and why). The behavioral record is more reliable. When verbal explanation is the only source available, treat it as hypothesis-generating rather than ground-truth.

---

## Failure Mode 5: Availability Bias in Case Library Construction

**What it is**: The case library that an expert's pattern-matching draws on is not representative of the population of situations the expert will face. Vivid, salient, and recent cases are over-represented; base-rate typical cases are under-represented; edge cases that the expert has never encountered are completely absent.

**Why it happens**: "What one retrieves from memory can be biased by temporal factors associated with storage and ease of recall. The latter has been termed an 'availability' bias in the memory for events (Tversky & Kahneman, 1973), a tendency for memory to be influenced by factors such as vividness, salience, and recency."

**Implication for knowledge base construction**: If a knowledge base is built by asking experts to recall cases, the resulting case library will inherit the availability bias of expert memory. Cases that are important precisely because they are common but unremarkable will be underrepresented. Cases that are vivid and memorable but rare will be overrepresented.

**Agent system implication**: Knowledge base construction should not rely solely on expert-selected cases. It should be supplemented with:
- Systematic sampling from known case populations (not just memorable ones)
- Deliberate inclusion of base-rate typical cases that experts find too routine to mention
- Adversarial construction of edge cases that the expert has never encountered but that lie within the problem domain

---

## Failure Mode 6: Overconfidence in Incomplete Situation Assessment

**What it is**: The expert achieves a good prototype match on the information available and proceeds with high confidence, without recognizing that critical information is missing. The situation assessment feels complete when it is not.

**Klein and MacGregor**: Reference Fischhoff, Slovic, and Lichtenstein (1978): "people are typically very poor at gauging the degree to which a structure they have been given to assist them in remembering components of a problem is a complete structure, and may actually judge it to be more complete than it actually is."

**Agent system implication**: Agents should maintain explicit awareness of **information they expected to receive and have not yet received**. A situation assessment that has received no disconfirming evidence is not thereby confirmed — it may simply be that the disconfirming evidence has not arrived yet. Expected-but-not-received information should count as active uncertainty, not as absence of uncertainty.

---

## Failure Mode 7: Time Pressure Induced Premature Closure

**What it is**: Under severe time pressure, the expert implements the first viable option (the top of the action queue) without allowing time for even the minimal mental simulation that constitutes verified RPD. The option may be adequate but not the best available, or may be feasible in normal conditions but fail given unnoticed constraints.

**Klein and MacGregor's framework**: The three levels of RPD (Automatic, Verified, Serial) represent increasing time costs. Time pressure pushes the system toward Automatic RPD — direct implementation of the top option without mental simulation. When the top option happens to be wrong, there is no error-catching mechanism.

**Agent system implication**: Under simulated time pressure, agents should implement explicit minimum verification requirements before committing to irreversible actions. A one-step mental simulation (does this action make sense given what I know about the current situation?) should be mandatory even under maximum time pressure. The cost of a brief verification step is almost always less than the cost of a failed irreversible action.

---

## The Common Thread

All of these failure modes share a common structure: they are failures of the **situation assessment phase**, not the **option evaluation phase**. The RPD model produces good decisions when the situation assessment is correct. When situation assessment fails — through misclassification, failure to update, incomplete information, or overconfidence — the subsequent action selection is building on a broken foundation.

This reinforces the core design principle: **invest in situation assessment robustness above all other aspects of the decision architecture**. Failure-resistant expert decision-making is failure-resistant situation assessment.
```

---

### FILE: novice-to-expert-spectrum-and-knowledge-transfer.md
```markdown
# The Novice-to-Expert Spectrum: What Changes, What It Means for Training and Transfer

## The Nature of the Spectrum

Klein and MacGregor's work describes expertise not as a threshold but as a developmental continuum. Crucially, this continuum is not linear accumulation of facts and rules. It involves something closer to a **qualitative transformation** in how situations are perceived and responded to.

Drawing on Dreyfus (1979) and their own empirical work, the authors characterize the novice-expert difference along several dimensions:

**Awareness of causal factors**: "Experts are more aware of subtle causal elements in the tasks they perform than are novices." The novice sees the fire. The expert sees the fire *and* the building materials, *and* the wind direction, *and* the rate of smoke color change, *and* the implications of each for how the fire will evolve over the next five minutes.

**Predictive capability**: Experts "may have a better facility for making predictions about the future state of processes they are commanding or controlling." This is not forecasting in the probabilistic sense — it is causal model-based prediction. The expert knows how the situation works and can therefore project it forward.

**Pattern library depth**: The expert has accumulated a library of case prototypes from years of experience. Each prototype carries embedded within it: typical cues, typical dynamics, typical goals, typical actions, and typical outcomes. The novice has a shallow library (or one built from training scenarios rather than real incidents), which means fewer situations are recognized as typical, and more situations require slow deliberative reasoning.

**Tacit skill density**: The expert's performance is characterized by what Dreyfus called the "holistic relationship between the expert and the task being performed." Skills that required conscious attention early in development have become automatic — freeing cognitive capacity for monitoring, anticipation, and adaptation.

---

## What Does Not Define Expertise

Klein and MacGregor are explicit that standard institutional measures of expertise are often poor proxies:

- **Rank and seniority** may not correlate with task performance. Junior individuals with better task skills may not be identified as expert.
- **Verbal fluency** is not expertise. The most verbal expert in an interview may not be the most expert in the field.
- **Rule knowledge** is not expertise. Rules describe the outer shell of performance, not the tacit core.

The critical insight: "Identifying the skills that make up expertise must begin by first viewing expertise phenomenologically, in terms of the holistic relationship between the expert and the task being performed."

This phenomenological perspective means that expertise cannot be defined by decomposition alone. You cannot identify what an expert knows by listing the skills they possess, any more than you can understand language fluency by listing the phonetic rules a speaker follows.

---

## The ISD Failure at Upper Skill Levels

Instructional System Design (ISD) — the standard approach to training design — fails at upper skill levels, and Klein and MacGregor are candid about why:

ISD assumes that expertise is an aggregation — that mastery of lower skills leads to mastery of higher skills, and that training can be structured as sequential attainment of competencies. "Expertise is defined as an aggregation of knowledge through successful accomplishment of subordinate skills."

This assumption fails because:

1. Expert skills are difficult to decompose into testable sub-skills
2. Performance requirements for evaluation are extremely difficult to define for expert-level tasks
3. The "phenomenological nature of expert performance requires that a different tack be taken to bridging the gap between the well-schooled novice and the well-experienced expert"

The ISD approach produces excellent training for basic skills. It produces inadequate training for the non-decomposable, context-sensitive, pattern-driven skills that define expert performance.

---

## The Alternative: Direct Transfer of Expertise

Klein and MacGregor propose a fundamentally different training philosophy for upper-level expertise:

> "One avenue to achieving expertise is to teach it directly. By careful study of expert solutions to a wide range of situations, a 'data base' of expertise can be developed for a task that is a useful resource for transferring upper-level knowledge to others."

This database approach is not a syllabus of rules. It is a **case library** — incident accounts that capture:
- The situation cues available at each decision point
- The expert's evolving situational assessment
- The options considered and rejected
- The rationale for the chosen action
- The outcomes
- The knowledge and experience that made the expert's performance possible

The key is that the case library must include "not only the actions that the expert took in a given situation, but also the rationale behind the actions and the mental deliberations involved in assessment and choice."

The analogy Klein and MacGregor invoke is the Socratic method and the Suzuki music teaching approach — the learner acquires expertise through exposure to expert performance in rich context, not through sequential mastery of decomposed rules. The master is present to guide, correct, and explain; the novice observes and attempts, building their own case library through guided experience.

---

## The Transitional Expert Problem

One underappreciated insight in Klein and MacGregor's work concerns what happens at intermediate levels of the expertise spectrum. The transitional expert — more than a novice, less than a fully experienced practitioner — has a particular vulnerability:

They have enough pattern knowledge to recognize many situations as typical and respond automatically. But their pattern library has gaps — edge cases they haven't encountered, causal dynamics they don't fully understand, variations on prototypes they haven't seen.

The danger: the transitional expert responds with the confidence of an expert but without the coverage. They feel the situation is recognized when it may have been misclassified. They lack the meta-cognitive awareness to know when they are outside their expertise.

This is why the CDM specifically looks for incidents where "someone with less experience would have possibly been unable to be effective." The transitional expert might have been effective in the routine version of the incident, but not in the version that required the full depth of expertise. That gap — visible only at the boundary — is exactly what training must address.

---

## Implications for Agent System Design

### 1. The Agent Expertise Spectrum is Real and Must Be Tracked
An agent that has been trained on limited data is not simply a "less capable" version of a fully trained agent. It is a qualitatively different reasoner — one with a shallow prototype library that will generate overconfident classifications and sparse action queues for edge cases.

Agent systems should maintain explicit estimates of their prototype library coverage — domains and situation types for which they have adequate exposure versus those where they are effectively novices. This coverage estimate should directly influence confidence calibration and escalation thresholds.

### 2. Case Libraries Trump Rule Bases at the Upper End
For complex, naturalistic, high-stakes tasks, the most valuable knowledge representation is not a rule base but a **case library**: a collection of specific incidents with rich situational context, decision points, and outcomes. This is what the CDM produces, and it is what enables:
- Analogical reasoning (this situation resembles Case #47 in these ways, differs in these ways)
- Expectation calibration (in cases like this, X usually happens next)
- Option pruning (in Case #47, options A and B were tried and failed for these reasons)

### 3. Distinguish What the Agent Knows from How Well It Knows It
Novice agents know rules. Expert agents know prototypes with associated causal models, cue patterns, expectation structures, and action queues. These are not the same information and should not be represented the same way.

An agent that knows the rule "when X, do Y" is a novice. An agent that knows "when X (specifically, when cues A, B, and C are present in this configuration), the situation is typically of type T, which means goal G is most appropriate, action Y usually works but fails when condition F is present, and in Case #23 we encountered F and had to modify Y in this way" is an expert.

### 4. Training on Non-Routine Cases, Not Just Typical Cases
If agent training is conducted primarily on typical, well-formed cases (which are easiest to construct and label), the agent will perform well on typical cases and poorly on non-routine cases. But non-routine cases are precisely where intelligent agent behavior matters — routine cases can often be handled by simpler rule-based systems.

Training pipelines should deliberately include:
- Cases at the boundary of the typical — situations that look routine but have a critical non-standard feature
- Cases that require prototype shift mid-incident
- Cases where the most obvious action fails
- Adversarially constructed cases designed to trigger misclassification

### 5. Learning from Agent Errors via CDM-Equivalent Analysis
When an agent makes a significant error, the appropriate response is not simply to update training weights. It is to conduct a CDM-equivalent incident analysis:
- At what decision point did the error occur?
- What was the agent's situation assessment at that point?
- What cues were present and what cues were missed?
- What options were considered and what was the basis for the choice made?
- What knowledge or prototype coverage would have been needed for correct performance?

This analysis generates the missing knowledge needed to close the expertise gap — not just a gradient signal.
```

---

### FILE: knowledge-elicitation-methods-and-their-limits.md
```markdown
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
```

---

### FILE: option-evaluation-the-serial-vs-concurrent-distinction.md
```markdown
# Serial vs. Concurrent Option Evaluation: Why the Architecture of Decision-Making Matters

## The Fundamental Fork in Decision Architecture

When a decision must be made, there are two fundamentally different architectural approaches to evaluating options:

**Concurrent evaluation (the normative model)**: Generate all relevant options. Simultaneously evaluate each against a common set of criteria. Select the option with the highest overall score. This is the architecture implicit in decision analysis, multi-attribute utility theory, and most formal decision support systems.

**Serial evaluation (the descriptive model)**: Generate one option. Test it for feasibility via mental simulation. Either implement it, modify it, or reject it and generate the next most appropriate option. Never compare two options simultaneously.

Klein and MacGregor's research establishes that expert decision-makers under naturalistic conditions almost universally use the serial approach — not because they lack the cognitive capacity for concurrent evaluation, but because serial evaluation is better suited to the conditions they face.

---

## Why Concurrent Evaluation Fails in Practice

### Time Incompatibility
Concurrent evaluation requires holding multiple options in working memory simultaneously while applying evaluation criteria to each. Under time pressure, this creates demands that exceed available cognitive resources.

"Studies have shown that analytic decision strategies are not effective when there is less than one minute to respond (Howell, 1984; Zakay & Wooler, 1984; Rouse, 1978). And these studies were performed with tasks that were well-defined and clearly amenable to analytical decision strategies."

Real-world command decisions often require responses in seconds. The concurrent evaluation architecture simply cannot execute at operational tempo.

### Information Incompleteness
Concurrent evaluation requires commensurable information about all options across all evaluation dimensions. In naturalistic settings, information is partial, ambiguous, and sequentially revealed. You cannot simultaneously evaluate five options when you don't yet know what the full set of relevant dimensions is or what the values of the current situation's parameters are.

### The Spurious Completeness Problem
Concurrent evaluation implicitly assumes the set of options generated is complete. But "people are very poor at generating complete sets of options" (Gettys & Fisher, 1979). If the correct option is not in the generated set, concurrent evaluation among the wrong options cannot produce the right answer.

---

## Why Serial Evaluation Works

### It Always Produces an Action
The serial approach keeps an action primed at every moment. The first option in the action queue is always ready for immediate implementation if the situation demands it. This is critical in time-pressured environments — the expert always has an answer, even if time for evaluation is zero.

"Descriptively, the RPD model makes available to the decision maker a course of action at every point."

### It Leverages Prototype Knowledge to Order the Queue
The action queue is not randomly ordered. The most contextually appropriate action for the recognized situation type is at the top of the queue. This is not arbitrary — it reflects the accumulated experience of previous incidents in which this situation type was encountered. The best available action is tried first.

### It Uses Mental Simulation as a Feasibility Filter
Rather than comparing Option A vs. Option B on abstract criteria, serial evaluation asks a single concrete question: "If I imagine implementing this option in the current situation, does it produce the desired outcome without generating unacceptable side effects?"

This question can be answered without knowing anything about other options. It requires only a sufficiently accurate causal model of the current situation — which the expert has, by virtue of correct situation assessment.

### It Supports Option Modification
A key capability that concurrent evaluation misses: the ability to modify a nearly adequate option into an adequate one. If Option A is 80% right but has a specific problem, the expert can modify it to remove the problem rather than abandoning it entirely. "The favored option may be implemented, or it may be modified to fit the needs of the current situation."

This is essentially a local search in option space, guided by the mental simulation. It is more efficient than regenerating from scratch and more flexible than rigid option-list evaluation.

---

## The Action Queue Structure

The action queue is not explicitly constructed at decision time. It exists as a property of the prototype match. Each recognized situation type carries an associated ordering of applicable actions, roughly prioritized by:
- Typical effectiveness for this situation type
- Resource requirements (simpler actions first)
- Reversibility (more reversible actions may be preferred when situation uncertainty is high)

This implicit queue structure is one of the things an experienced expert has that a novice does not. The novice either has no action queue (and must reason from scratch) or has a shallow one (with few options, biased toward recently trained procedures).

The CDM's Decision Point Analysis explicitly maps this structure: for each decision point in an incident, it characterizes what options were in the queue, which was selected, how it was evaluated, and what alternatives were available but not tried.

---

## Implications for Agent System Architecture

### 1. Implement Action Queues, Not Option Comparison
Agent systems that select actions by scoring all options against evaluation criteria are implementing the concurrent evaluation architecture that expert humans abandon. A more naturalistic and operationally effective architecture:

1. **Recognize the situation type** (highest-confidence prototype match)
2. **Retrieve the associated action queue** (ordered list of applicable actions for this prototype)
3. **Validate the top action** via simulation (does causal model predict success?)
4. **If valid, implement**; if not, try next action; if top action needs modification, modify and re-validate

This architecture is faster, requires less working memory, and is more graceful under uncertainty.

### 2. Mental Simulation as a Validation Primitive
The agent system needs a simulation capability — a forward model that can predict the outcome of a proposed action given the current situational model. This is different from a planning module. It is not asked to find the best action; it is asked only whether a specific proposed action will succeed given the current situation.

This simulation can be implemented as:
- A causal model of the domain (explicit dynamics representation)
- A learned forward model (trained to predict action outcomes given situational features)
- A case-based retrieval (what happened in similar situations when this action was tried?)

### 3. Separate Action Queue Depth from Action Selection Confidence
These are different quantities:
- **Action queue depth**: How many validated options exist for this situation type?
- **Action selection confidence**: How confident is the system that the selected action will work?

Queue depth should influence escalation decisions: a shallow queue means the system is near the boundary of its knowledge and should seek help. Selection confidence should influence action commitment level: low confidence warrants more frequent monitoring and a lower threshold for aborting the action if the situation evolves unexpectedly.

### 4. Implement Option Modification, Not Just Option Selection
The ability to modify a nearly-adequate option is a key feature of expert serial evaluation. Agent systems should support:
- Identifying which specific aspect of a candidate action makes it infeasible
- Generating modified versions that address the specific infeasibility
- Re-validating the modified option via simulation

This is more powerful than simply moving to the next option in the queue, because it can produce solutions for situations that no queued option perfectly fits.

### 5. Preserve the "Action Always Available" Property
At any moment, the agent system should have a best-current-action ready for immediate execution. This is not the same as having a final decision — it is a fallback that allows action even if deeper evaluation is interrupted. Under extreme time pressure, the system executes the current best action; under normal conditions, it may evaluate further before committing.

This property mirrors the RPD model's key operational advantage: there is always a course of action available, even if time for deliberation is zero.

---

## When Concurrent Evaluation Is Appropriate

Klein and MacGregor's framework is not absolutist. Concurrent evaluation is appropriate when:

- **Time permits**: If there is substantial time before action is required, comparing options explicitly may produce better decisions than serial evaluation
- **Options are commensurable**: If all options can be meaningfully evaluated on the same criteria
- **Situation assessment uncertainty is low**: If the expert is confident about the situation type, they can afford to compare options because they know the evaluation criteria
- **The decision is irreversible and high-stakes**: When an error cannot be corrected, additional deliberation is warranted even if it is slow

The key design principle is that concurrent evaluation should be an available mode for agent systems — one that is triggered when conditions warrant it — rather than the default mode that the system always uses regardless of time pressure and situational certainty.
```

---

### FILE: knowledge-representation-and-system-design-alignment.md
```markdown
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
```

---

### FILE: distributed-decision-making-and-span-of-control.md
```markdown
# Distributed Decision-Making and Span of Control in Complex Situations

## The Multi-Thread Problem

Real-world expert decision-making rarely involves a single decision problem. The fireground commander is simultaneously managing the fire suppression effort, the rescue of civilians, the safety of firefighters, resource allocation across multiple units, and communication with dispatch. The tank platoon leader is managing multiple vehicles, monitoring terrain, anticipating enemy action, and maintaining communication with higher command. The paramedic is triaging multiple patients while coordinating with the hospital and managing team members.

Klein and MacGregor do not develop a formal theory of distributed decision-making, but their case data reveals important structural principles about how experts manage multiple simultaneous situational threads. These principles have direct implications for multi-agent orchestration systems.

---

## Span of Control as a Cognitive Limit

The most explicit principle emerges from Chief McW's response to the tanker fire when the storm sewer explodes. His immediate recognition: "This new aspect of the situation would exceed his span of control." His response: call for additional command resources and explicitly delegate the sewer problem to the incoming Chief, retaining personal focus on the tanker.

This is not just a practical resource-allocation decision. It is a **metacognitive act** — a recognition that the current decision-maker cannot maintain adequate situational awareness across two independent situational threads simultaneously, and that attempting to do so would degrade performance on both.

The span of control concept implies:
1. There is a maximum number of active situational models a decision-maker can maintain simultaneously
2. Operating near or above this limit degrades situational awareness quality (less frequent monitoring, less sensitive to disconfirming cues, slower SA-Shift detection)
3. The appropriate response when approaching the limit is not to reduce monitoring frequency on all threads but to delegate complete threads to other decision-makers

### Implications for Multi-Agent Architecture
Agent systems have their own version of span of control — determined by available context length, attention mechanisms, working memory capacity, and update frequency. A single agent attempting to maintain situational awareness across too many active problems will exhibit the same degradation pattern as an overloaded human commander: slower updates, reduced sensitivity to disconfirming cues, and SA-Shift failure.

Multi-agent orchestration should explicitly model span of control:
- Each agent should track the number of active situational models it is maintaining
- As this count approaches the agent's capacity, it should request delegation of complete sub-problems to other agents rather than accepting further degradation
- The orchestrator should be aware of each agent's current load and allocate new problems accordingly

---

## Parallel vs. Sequential Situational Awareness

Klein and MacGregor's SAR structure implies that situational awareness for a single problem is maintained as a continuously updated model. But how do expert decision-makers handle multiple simultaneous problems?

The CDM data suggests experts do not attempt to maintain all situational models at the same level of fidelity simultaneously. Instead, they apply a prioritization mechanism:

- **Active attention**: The highest-priority situational thread receives continuous monitoring and rapid response
- **Periodic monitoring**: Lower-priority threads are checked at intervals, with updates processed when attention cycles back
- **Background alerting**: Some threads are monitored only for high-salience signals (significant changes) rather than routine updates

This is analogous to interrupt-driven vs. polling-based monitoring architectures. The expert is running a polling loop across multiple situational models, but with variable polling frequencies determined by current priority assessment.

### Implications for Agent Monitoring Architecture
A single agent managing multiple situational threads should implement differential monitoring:
- High-priority threads: continuous monitoring, immediate response to new information
- Medium-priority threads: periodic polling, updates processed when priority resources are available
- Background threads: alert-driven monitoring (only signal on significant changes)

Priority should be dynamic — a thread that was low-priority can become high-priority based on new information. The system needs to detect priority-escalation signals and reallocate monitoring resources accordingly.

---

## The Coordination Without Central Control Problem

The CDM study of tank platoon leaders and wildland firefighting reveals a particularly important coordination challenge: multiple decision-makers must act coherently without real-time central coordination. The wildland firefighting case explicitly involves "distributed decision making" (Taynor, Klein, & Thordsen, 1987) where communication disruptions were themselves operationally significant.

The key mechanism for coordination without central control is **shared situational awareness**: all decision-makers have sufficiently aligned situational models that their independent decisions are mutually consistent. This is not guaranteed — it is achieved through explicit communication of situational updates, shared training that produces compatible prototype libraries, and established norms about what situations require coordination versus what can be handled independently.

When shared situational awareness fails — when different decision-makers have incompatible situational models — their independent decisions will conflict even when each is acting reasonably given their own model. The paramedic and the hospital may be acting optimally by their respective assessments while producing an incoherent outcome because their assessments differ.

### Implications for Multi-Agent Coordination
Multi-agent systems face the same challenge: independent agents with locally rational decision processes may produce globally incoherent outputs if their situational models diverge. Solutions must address the root cause (shared situational awareness) not just the symptom (conflicting outputs).

Key mechanisms:
1. **Situational model broadcast**: When one agent's situational model updates significantly, it should broadcast the update to agents whose decisions depend on that model
2. **SA-Shift synchronization**: When one agent detects an SA-Shift, all agents working on dependent sub-problems should receive notification and assess whether their own models need revision
3. **Consistency monitoring**: A meta-level agent or monitoring process should check for contradiction between the active situational models of different agents and flag when they diverge beyond acceptable bounds
4. **Shared prototype libraries**: Agents operating in the same domain should share the same prototype library, ensuring that they classify situations consistently even when making independent decisions

---

## Expertise Transfer and Hierarchical Coordination

Klein and MacGregor's analysis of command decisions reveals an important hierarchical pattern: expert commanders not only make decisions but recognize when a situation exceeds their authority level or expertise level and escalate appropriately.

The decision to escalate is itself an expert decision — and one that novices often get wrong in both directions. Novices sometimes escalate when they should handle a situation themselves (lack of confidence), and sometimes fail to escalate when the situation genuinely requires higher-level authority or expertise (overconfidence or inadequate SA-Shift detection).

The CDM probe "what specific training or experience was necessary to make this decision?" and "how might a less experienced officer have behaved differently?" are specifically designed to surface the escalation decision criteria — the indicators that tell an expert "this is beyond me."

### Implications for Agent Escalation Design
Agent escalation decisions should be governed by the same factors:
- **Prototype library coverage**: If no prototype in the agent's knowledge base has adequate confidence, escalate
- **Action queue depth**: If the action queue is exhausted (all options tried and failed), escalate
- **Situational model confidence**: If situation assessment confidence is below threshold, escalate rather than act on a poorly founded assessment
- **Span of control**: If the number of active situational threads exceeds capacity, escalate (delegate) the lowest-priority threads
- **Irreversibility**: If the action under consideration is irreversible and significant, escalate for verification even if the agent has adequate confidence

These escalation triggers should be explicit design parameters, not emergent behaviors. The system architect should specify the thresholds and the agent should monitor against them.

---

## The Situation Assessment Record as a Coordination Interface

One of the most practically valuable products of the CDM is the Situation Assessment Record — a structured representation of the current situational model, including active cues, current goals, and decision points. Klein and MacGregor develop this primarily for research purposes, but its value as a **coordination interface** in multi-agent systems is significant.

If each agent maintains and shares a SAR for its active situational threads, the orchestrating system gains:
- Visibility into each agent's current situational understanding
- Early detection of diverging situational models (before they produce conflicting outputs)
- A structured basis for coordination decisions (which agent handles which sub-problem)
- A record for post-hoc analysis when things go wrong

The SAR is a natural API for agent-to-agent situational handoff — when one agent delegates a situational thread to another, the SAR provides the initial situational context the receiving agent needs to continue seamlessly.

---

## The Desired Data Probe and Information Architecture

The CDM probe "what information would you have wanted but didn't have?" is among the most practically valuable for system design. In the command-and-control study, this probe revealed the critical value of knowing enemy location more precisely and knowing the location of friendly forces. In the fireground study, it revealed the importance of building construction data at the point of response.

These "desired but unavailable" information elements define the **information architecture** of expert decision-making — the data streams that expert performance depends on, even when they are not currently present in the environment. Building better sensor networks, information systems, or agent capabilities to provide this information directly addresses the bottlenecks in expert performance.

For agent systems, this analysis translates into: what inputs does the agent need but currently cannot access? What sensors, APIs, or data streams would most improve the quality of situation assessment? These are higher-value investments than improving the reasoning architecture operating on inadequate inputs.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: The RPD model directly challenges decomposition-first approaches. The book teaches that complex problems should be decomposed by *situation type* rather than by abstract task structure — the decomposition should follow how experts actually parse the problem space. Decomposition agents should first classify the problem type, then retrieve the associated sub-task structure, rather than applying a generic hierarchical decomposition algorithm.

- **Agent Routing/Orchestration**: The action queue concept is directly applicable to routing decisions. Rather than scoring all possible downstream agents simultaneously, an orchestrator can maintain a prioritized routing queue per recognized task type — route to the first applicable agent, validate the routing decision, and fall back to the next if needed. This is faster and more graceful under load.

- **Uncertainty Handling / Confidence Calibration**: The book teaches that confidence should be highest when situation assessment is complete (cues match prototype, expectations are confirmed, no disconfirming evidence) and lowest when the prototype match is weak, disconfirming evidence is accumulating, or the situational model is in mid-shift. Calibration systems should model these factors explicitly rather than treating confidence as a fixed property of the output.

- **Debugging and Root Cause Analysis**: The CDM's Decision Point Analysis is a natural template for debugging agent failures. For each significant failure: reconstruct the agent's situational assessment at each decision point, identify where the assessment first diverged from ground truth, determine what cues the agent attended to and missed, and trace the failure to its root cause (wrong prototype, missed SA-Shift, empty action queue, etc.).

- **Expert System / Knowledge Base Construction**: The book's entire methodology applies here. Knowledge bases should be built from incident-level case libraries (not just rules), should target the non-routine boundary where expertise is visible, and should explicitly represent tacit knowledge types (perceptual patterns, causal dynamics, analogical cases) that rule-based encoding systematically misses.

- **Planning / Strategy Generation**: The three-level RPD model provides a direct architecture for planning under different time constraints — Automatic RPD when time is critical, Verified RPD when slight deliberation is possible, Serial RPD when full evaluation is warranted. A planning agent should have all three modes available and switch between them based on the time available before a commitment must be made.

- **Security Auditing**: Situation assessment and prototype matching are directly applicable to threat recognition. Security experts recognize threat patterns similarly to how fireground commanders recognize fire patterns — not by checking exhaustive rule lists but by gestalt prototype matching. Security audit agents should model their threat-recognition logic as prototype matching with associated action queues, not as decision trees.

- **Code Review and Architecture Design**: Expert software architects perform a form of RPD — they recognize a proposed architecture as an instance of a known pattern (prototype) and immediately access associated concerns, potential failure modes, and improvement suggestions. Building this expertise into a code review agent means building a rich prototype library of code and architecture patterns with associated cue patterns and known failure modes.

- **Training Data Curation**: The CDM's focus on non-routine boundary cases directly applies to training data selection. The most valuable training examples for agent systems are not the easy typical cases but the edge cases at the boundary between routine and non-routine — cases that require genuine expertise to handle correctly. Training data pipelines should deliberately seek and over-weight these boundary cases.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: The RPD model maps directly to orchestration architecture. Orchestrators should recognize task-type prototypes and access associated coordination patterns (which agents to involve, in what order, with what handoff protocols) rather than computing coordination strategies from scratch for each task. The action queue model gives orchestrators an always-available routing decision while supporting progressive refinement when time permits.

- **Task Decomposition**: Klein and MacGregor's taxonomy of knowledge types (structural, perceptual, conceptual, analogical, prototypical) suggests that task decomposition should vary by knowledge type. Structural knowledge decomposes into sequential steps. Perceptual knowledge decomposes into distinguishing features. Conceptual knowledge decomposes into causal chains. Prototypical knowledge is irreducibly holistic — it resists decomposition into parts that can be independently mastered and recombined.

- **Failure Prevention**: The book's most powerful failure prevention insight is the SA-Shift failure mode — the decision-maker who has the wrong situational model and fails to update it. Prevention requires active monitoring for expectation violations (what I predicted but didn't see), not just passive reception of new information. Agents should explicitly track what they expected to receive and flag when expectations are violated, triggering model reassessment.

- **Expert Decision-Making**: The entire book is about this. The core teaching: expert decision-making under time pressure is pattern-matching + serial option validation, not option generation + concurrent comparison. Building systems that support expert decision-making means supporting pattern recognition and mental simulation, not providing better tools for comparing option scores. The decision aid that most improves expert performance is one that improves situation assessment speed and accuracy — not one that computes expected utilities more precisely.