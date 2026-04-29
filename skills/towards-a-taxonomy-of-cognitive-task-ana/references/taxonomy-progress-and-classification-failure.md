# How Classification Systems Fail: The DSM Parallel and What It Means for Agent Skill Taxonomies

## The Problem of Classification in Complex Domains

Yates opens his dissertation with an argument that is easy to miss but is fundamental: the failure to classify knowledge extraction methods correctly is not merely an academic inconvenience — it actively prevents scientific progress and practical effectiveness. The right classification system enables practitioners to choose appropriate tools, enables researchers to compare findings, and enables the development of theory. The wrong one proliferates categories while disguising its own inadequacy.

This argument applies directly to any complex domain that needs a taxonomy of its own capabilities — including AI agent systems with large libraries of skills.

## Hempel's Standard for Scientific Progress

Yates draws on Hempel (1965) to establish a precise criterion for what makes a classification system good versus merely descriptive. According to Hempel, scientific progress is made when "a broader spectrum of observable phenomena in a domain can be explained and predicted by increasingly generalized covering laws, and, in turn, when this theoretical development results in a reduction of taxonomic categories" (p. 27, summarizing Hempel).

Read that carefully: **scientific progress in a domain is marked by fewer categories, not more.** Fewer categories means that an underlying theory has been found that explains multiple phenomena as instances of a more general principle. More categories means the field is still in the descriptive stage — naming things without understanding their relationships.

The sign of a field that is progressing is category collapse. The sign of a field that is merely growing is category proliferation.

## The DSM as Cautionary Tale

Yates draws an extended parallel to the Diagnostic and Statistical Manual of Mental Disorders (DSM) as an example of classification gone wrong. Follette and Houts (1996), cited extensively by Yates, argue that the DSM's history demonstrates taxonomic failure by Hempelian standards:

"The taxonomy is not flourishing but foundering, because a system that merely enumerates symptoms and then syndromes cannot exhibit simplification by the application of an organizing theory" (Follette & Houts, 1996, as cited in Yates, p. 27-28).

Each edition of the DSM adds new categories rather than collapsing old ones into more general principles. This proliferation is the signature of a system without an organizing theory — one that names without explaining.

Yates argues that CTA methods have the same problem: over 100 methods have been identified, with multiple competing classification schemes, no consensus on definitions, and no organizing theory that could collapse categories. "It is unlikely that an organizing theory that facilitates a reduction in categories will emerge, unless common definitions and measures of probative data for specific goals of CTA are found" (p. 28).

## Typologies vs. Taxonomies: A Critical Distinction

Yates draws a distinction between typologies and taxonomies that has immediate practical implications:

"According to Patton (2002), typologies classify some aspect of the world into parts along a continuum. In contrast, taxonomies classify items into mutually exclusive and exhaustive categories" (p. 25).

A typology says: "These things are different from each other in these ways." A taxonomy says: "These things belong to one category, and those things belong to another, and a given item can only belong to one."

Most existing CTA classifications are typologies dressed as taxonomies. They organize methods by descriptive similarities without establishing the theoretical basis that would make categories mutually exclusive and exhaustive. The result is that the "same" method can appear in multiple categories, methods with the same name are used differently by different practitioners, and the category system gives no genuine guidance about what to expect from any given approach.

Yates identifies two functions that a genuine taxonomy must serve:

1. **Describe** things and events within the domain of investigation
2. **Enable establishment of general theories** to predict and understand observable phenomena

Current CTA classifications do the first. They have not achieved the second. The implication is that anyone using them to choose a method should expect limited predictability in outcomes — which Yates's data confirms.

## Three Roles of a Genuine Taxonomy

Yates, citing Chulef, Read, and Walsh (2001), identifies the three roles that taxonomies play:

1. **Common vocabulary and language**: Enable researchers and practitioners to communicate with shared conceptual meaning. Without this, "study" of a phenomenon is fragmented — each practitioner defines their own terms, and findings cannot be compared.

2. **Integration and systemization of findings**: A good taxonomy enables cumulative knowledge. When a finding is reported, the taxonomy tells you where it belongs and what it implies about adjacent categories.

3. **Facilitation of theory development**: When phenomena that seemed different are classified together, underlying causal relationships become visible. Taxonomy enables theory.

The absence of a genuine taxonomy, Yates shows, means that CTA "lacks a common vocabulary and language making systematic taxonomic research difficult" (p. 28). The field accumulates studies but not knowledge.

## Application to Agent Skill Taxonomies

The parallel to AI agent systems with large skill libraries (like the 180+ skills referenced for WinDAGs) is direct and important.

### The Current State: Proliferation Without Theory
A system with 180+ skills faces the same challenge as CTA with 100+ methods. If skills are classified primarily by what they do mechanically (their process), rather than by what knowledge type or problem type they address (their outcome), practitioners (agents and orchestration systems) will face the same problem CTA practitioners face: "no clear guidelines for the practitioner to choose the appropriate combination of methods to apply to a specific task or intended results" (p. 7, paraphrasing Cooke, 1994).

### The Process vs. Outcome Classification Error
Yates's core critique of CTA classifications is that they classify by process (how methods work) rather than outcome (what knowledge they produce). The current study represents a deliberate shift to "a product approach that explores the association between knowledge types as outcomes of the CTA process and the pairing of CTA methods" (p. 9).

For agent skill taxonomies, this means the primary classification dimension should be: **what type of problem does this skill solve?** Not: **what does this skill do mechanically?**

A skill that "generates code" and a skill that "generates documentation" may have similar mechanical profiles (both produce text from specifications) but categorically different outcome profiles (executable procedural artifacts versus declarative reference artifacts). A taxonomy organized around the outcome distinction will guide skill selection better than one organized around the mechanical similarity.

### Toward Category Collapse
By Hempelian standards, a mature agent skill taxonomy should be able to collapse categories. Skills that seem different should, upon theoretical analysis, be revealed as instances of more general skill types. If a skill taxonomy is growing (adding skills) without collapsing (finding that some skills are instances of general types), this is a sign that the taxonomy lacks an organizing theory.

The question to ask is: **what is the theoretical basis for predicting that this skill will address this problem type?** If the answer is "it has worked in similar cases" (empirical typology) rather than "it addresses this type of knowledge/reasoning need" (theoretical taxonomy), the classification is still in the descriptive stage.

### Common Vocabulary as Infrastructure
One of Yates's most important practical points is that classification progress requires common definitions first. "Researchers, as previously stated, need to agree on common definitions, goals, and measures to conduct their research" (p. 30).

For multi-agent systems, this is an architectural requirement. Agents must share vocabulary about problem types, knowledge types, and skill capabilities in order to coordinate without a central controller understanding everything. The common vocabulary is the shared protocol. Without it, coordination degrades to opaque signal-passing that cannot be debugged or improved systematically.

### The First Principles Alternative
Clark et al. (in press), cited by Yates, suggest applying Merrill's "first principles" approach to CTA: identify the active ingredients in key methods rather than enumerating all methods. "Merrill suggested that the most effective learning models are problem centered, and demonstrate what is to be learned, rather than telling information about what is to be learned" (p. 79).

For agent skill taxonomies: rather than cataloging all skills, identify the core reasoning and knowledge-handling capabilities that underlie groups of skills. What are the "active ingredients" that make a skill work for a problem type? Organizing around these first principles would produce a smaller, more theoretically coherent taxonomy with greater predictive power.

## Boundary Conditions

Hempel's criterion of category reduction as a sign of progress applies most directly to:
- Domains with genuine underlying theoretical structure
- Classification systems where the goal is prediction and guidance, not merely enumeration
- Applications where practitioners need to choose methods in advance based on expected outcomes

It applies less well to:
- Pure cataloging tasks where exhaustive enumeration (not theoretical coherence) is the goal
- Domains where heterogeneity is genuine and not reducible to theoretical unification

## Summary

The proliferation of categories without theoretical collapse is the signature of a classification system that is still in the descriptive stage. Yates's analysis of CTA classifications — drawing on Hempel's standard and the DSM parallel — provides a powerful framework for evaluating any taxonomy in any complex domain. A good taxonomy must enable prediction (given this problem type, these methods/skills should work) not just description (here are all the methods/skills that exist). The fact that CTA has over 100 methods with no clear selection guidance for practitioners is a failure that directly constrains the field's effectiveness. Agent systems with large skill libraries risk the same failure if their taxonomies are organized by process rather than outcome.