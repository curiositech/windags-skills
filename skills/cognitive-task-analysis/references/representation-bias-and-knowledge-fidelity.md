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