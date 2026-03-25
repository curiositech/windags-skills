# Definitions as Products of Inquiry, Not Preconditions: Why Ontologies Must Be Provisional

## The Standard Model of Definitions

Most engineering systems — and most automated reasoning systems — treat definitions as preconditions of reasoning. You first define your terms precisely, then you reason about them. The schema comes first; the data comes second. The ontology is built before the system is deployed. This seems obviously correct: how can you reason about something if you don't know what it is?

Imre Lakatos, in *Proofs and Refutations*, presents a sustained historical argument that this model is not merely incomplete but inverted. In the actual practice of rigorous inquiry, **definitions are not preconditions of discovery but products of it**. The concept of "polyhedron" that Lakatos's students are using at the start of the dialogue is not the concept they end up with — and the gap between starting-concept and ending-concept is not a failure of initial precision but a *measure of the inquiry's success*.

This is not an argument for vagueness. It is an argument about the *epistemic timing* of precision: precision comes *after* the dialectic between conjecture and counterexample, not before it.

## The Dialogue as Definition Factory

Watch what happens to "polyhedron" across the dialogue:

**Starting point (implicit)**: A polyhedron is a solid with flat faces, like a cube or tetrahedron.

**After Alpha's hollow cube (Counterexample 1)**: Delta proposes Def. 2 — a polyhedron is a *surface*, not a solid. "It has faces, edges, vertices, it can be deformed, stretched out on a blackboard, and has nothing to do with the concept of 'solid'." (p. 16)

**After Counterexamples 2a and 2b (twin tetrahedra sharing an edge or vertex)**: Delta proposes Def. 3 — a polyhedron is "a system of polygons arranged in such a way that (1) exactly two polygons meet at every edge and (2) it is possible to get from the inside of any polygon to the inside of any other polygon by a route which never crosses any edge at a vertex." (p. 17)

**After the urchin (star-polyhedron, Counterexample 3)**: Debate erupts about whether a "polygon" can be a star-polygon, leading to Def. 4 (polygons have no self-intersections) vs. Def. 4' (polygons are just closed curves with vertices).

**After the picture-frame (Counterexample 4)**: Delta proposes Def. 5 — through any point in a genuine polyhedron's interior, there exists a plane whose cross-section consists of a single polygon.

**After the cylinder (Counterexample 5)**: Debate about whether edges must have vertices, leading to Def. 6.

Six definitions of "polyhedron" in a single dialogue — each one richer, more precise, and theoretically better motivated than the last. None of them could have been stated at the beginning of the inquiry, because each one was *produced by encountering a case that the previous definition failed to handle*.

The Teacher observes this pattern explicitly:

> "I assumed familiarity with the concept, i.e. the ability to distinguish a thing which is a polyhedron from a thing which is not a polyhedron... It turned out that the extension of the concept wasn't at all obvious: definitions are frequently proposed and argued about when counterexamples emerge." (p. 18)

## What This Means for the Epistemology of Definitions

There is a philosophical position embedded in this observation that goes far beyond mathematical pedagogy. Lakatos is claiming that **the content of a concept is revealed by its application at boundaries, not specified in advance by its stipulation**. You don't know what "polyhedron" really means — what theoretical work the concept needs to do — until you encounter cases that stress-test it.

This is not relativism or conceptual anarchism. It is a claim about the *order* of knowledge: extensional knowledge (which things fall under a concept) precedes and generates intensional knowledge (what properties define the concept). We learn what a concept means by learning what it applies to — including, crucially, the cases where its application is contested.

Gamma makes the positive case for this at the end of the dialogue:

> "I think that if we want to learn about anything really deep, we have to study it not in its 'normal', regular, usual form, but in its critical state, in fever, in passion. If you want to know the normal healthy body, study it when it is abnormal, when it is ill. If you want to know functions, study their singularities. If you want to know ordinary polyhedra, study their lunatic fringe." (p. 25)

The boundary cases are not distractions from understanding — they *are* the primary source of understanding. The ordinary, well-behaved cases don't reveal the structure of a concept; the anomalous, edge cases do.

## The "Perfect Definition" Trap

The dialogue presents the logical extreme of the alternative view in the form of "Def. P" (Perfect Definition): define a polyhedron as a solid for which V-E+F=2. The theorem is then tautologically true by definition, and no counterexample is possible.

Alpha introduces this with mordant sarcasm:

> "Why don't you just define a polyhedron as a system of polygons for which the equation V-E+F=2 holds, and this Perfect Definition... would settle the dispute for ever? There would be no need to investigate the subject any further." (p. 17)

The "Perfect Definition" purchases certainty at the cost of *informativeness*. The theorem no longer tells you anything about the structure of solids in the world; it tells you only what you've decided to call "polyhedra." The concept has been cut loose from its natural domain of application and redefined to fit the formula — which means the formula now fits nothing beyond itself.

The Teacher rejects this approach not on logical grounds (it is, in fact, logically coherent) but on *epistemic* grounds: it stops inquiry. A definition that makes a claim unfalsifiable is not a stronger version of the claim — it is the *abandonment* of the claim's cognitive content.

For agent systems, the Def. P trap looks like: defining "success" as "whatever the system produces," or defining "correct output" as "output that the system generates consistently." These are formally consistent but epistemically empty — they prevent the system from learning anything from its outputs.

## Applications to Agent System Design

### 1. Schemas and Ontologies Should Be Versioned and Mutable

An agent system that requires its entire ontology to be specified before deployment is implementing the "definitions as preconditions" model. This will work tolerably well in stable, well-understood domains. It will fail systematically in novel, complex, or rapidly-changing domains, because the concepts required to handle those domains are not yet known.

Better design: treat all schemas, taxonomies, and concept definitions as **versioned hypotheses**. Every schema has a version number, a history of revision triggers (the counterexamples that forced each revision), and a "currently challenged by" field listing edge cases not yet handled by the current definition. This is not overhead — it is the epistemic record of the system's conceptual development.

### 2. Task Taxonomies Should Record Their Own Edge Cases

When an orchestration system classifies incoming tasks into types (code generation, data analysis, creative writing, etc.), those types are concept-definitions — and they should be treated as products of inquiry rather than fixed infrastructure. The edge cases that don't fit cleanly into any category are not classification failures; they are *information about the inadequacy of the current taxonomy*.

An agent system should maintain a log of "uncategorizable" or "ambiguously-categorized" inputs, and periodically use this log to revise the taxonomy. The uncategorizable cases are exactly the "polyhedra" at the boundary of current definitions — and they are the most informative ones.

### 3. Domain-Specific Language Design

When agents generate code, queries, or structured outputs in domain-specific languages, they rely on implicit or explicit definitions of terms. These definitions should not be treated as permanent fixtures. As the system encounters more diverse use cases, the definitions will need to evolve. 

Design implication: build **definition revision pathways** into the system architecture. When an agent encounters an input that satisfies some but not all criteria of a concept, route it to a "definition challenge" queue rather than forcing it into the nearest category. Let accumulated definition challenges trigger concept review.

### 4. Calibrate Concept Stability to Domain Stability

Not all concepts need to evolve at the same rate. In a well-understood, stable domain (e.g., basic arithmetic operations), the definitions can be treated as essentially fixed — the inquiry is complete enough that the concepts are robust. In novel, complex, or rapidly-evolving domains (e.g., classifying types of AI outputs, identifying novel security vulnerabilities, categorizing user intent in open-ended interactions), definitions should be treated as highly provisional and actively monitored for stress.

The appropriate level of schema rigidity is a function of domain maturity, not of engineering preference for clean interfaces.

### 5. Distinguish Definition-by-Stipulation from Definition-by-Discovery

Some definitions in agent systems are pragmatic conventions — chosen for engineering convenience and not meant to track any natural structure. Others are meant to carve the world at its joints — to identify natural categories that the system needs to reason about correctly.

Lakatos's lesson applies primarily to the second type. For concepts meant to track real structure, definitions that emerge from encounter with boundary cases are more reliable than definitions stipulated in advance. The concept of "polyhedron" that emerges from the dialogue — something like "a two-dimensional surface of finite genus, triangulable, without boundary" — is not the concept that anyone would have stipulated at the start. But it is the concept that *explains* which polyhedra satisfy Euler's formula and which don't.

For agent systems: identify which of your core concepts are stipulative (engineering conventions) and which are meant to track real structure. Apply Lakatos-style provisional treatment only to the latter — but don't confuse the two by treating all stipulative conventions as if they track real structure.

### 6. The Role of Anomalies in Concept Development

The hollow cube, the urchin, the picture-frame, the cylinder — each is an anomaly relative to the current definition of "polyhedron," and each forces the definition forward. Anomalies are not problems to be suppressed; they are **the engine of conceptual development**.

For agent systems monitoring incoming data: design anomaly detection not as a filter (remove anomalies before they reach the main system) but as a *conceptual probe* (route anomalies to a concept-revision process). The anomalies that appear most frequently and most systematically are the most important evidence about where the current concepts are inadequate.

## The Deepest Point: Concept-as-Research-Program

Lakatos's philosophy of mathematics treats a mathematical concept not as a static definition but as a **research program** — an ongoing investigation into what properties are essential, what boundary cases reveal about the structure, and what theorems hold for what precisely-characterized domains.

This framing is transferable to any domain where an agent system needs to reason about complex, evolving categories. The "concept of polyhedron" in Lakatos is a research program that runs for decades, producing along the way the concepts of genus, Euler characteristic, and topological classification of surfaces. The starting definition — "a solid with flat faces" — is the first rough approximation in this program, not its terminus.

For agent systems with long operational lifespans and broad domains: build in the expectation that core concepts will evolve. Not because the system is failing, but because *evolution of concepts under the pressure of counterexamples is what intellectual progress looks like*. A system whose concept-vocabulary has not changed after years of operation in a complex domain is not a mature system — it is a stagnant one.

## Boundary Conditions

This framework is most important when:
- The domain is complex and not fully understood (biology, social behavior, novel technology)
- The system will encounter genuinely novel inputs (not just variations on known patterns)
- Errors in concept application have significant downstream costs

It matters less when:
- The domain is fully formalized (pure mathematics with established axioms, logic circuits)
- The concept vocabulary is deliberately stipulative (engineering convenience rather than natural-kind tracking)
- The system operates in a completely stable, closed-world environment

Even in stable domains, however, the question "which of our concepts are genuinely tracking real structure vs. merely stipulative?" is worth asking periodically.

## Conclusion

The lesson of Lakatos on definitions is not that precision is bad or that ambiguity is acceptable. It is that **premature precision is epistemically costly** — it forecloses the discovery that comes from encountering boundary cases with an open conceptual hand.

The great advances in Lakatos's dialogue come not from better stipulation at the start but from more honest engagement with the things that don't fit. The hollow cube is not a failure of the inquiry; it is one of its most productive moments. The concept that emerges from that encounter is richer, more powerful, and more theoretically coherent than anything that could have been stipulated beforehand.

An agent system designed with this insight builds in mechanisms for concept revision, preserves the history of boundary-case encounters, treats anomalies as information rather than noise, and understands its own ontology as a current-best-approximation rather than a fixed truth. This is not a less rigorous system. It is a more epistemically mature one.