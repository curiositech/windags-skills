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