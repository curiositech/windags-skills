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