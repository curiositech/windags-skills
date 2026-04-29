# The Differential Access Hypothesis: Method Selection Determines What Knowledge Gets Captured

## The Core Insight

Different methods for capturing knowledge do not merely differ in convenience or efficiency — they are **differentially sensitive to different types of knowledge**. This "differential access hypothesis" (Hoffman, Shadbolt, Burton, & Klein, 1995) is one of the most practically important principles to emerge from Cognitive Task Analysis research.

Yates' dissertation provides the first large-scale empirical examination of this hypothesis across 154 real studies, identifying which method pairings are actually associated with which knowledge outcomes. The results have direct implications for any system that depends on accurately specified knowledge.

---

## The Toolkit Metaphor

CTA is consistently described as a "practitioner's tool kit" (Cooke, 1999, p. 4). This metaphor is apt, but it can be misleading. A toolkit implies interchangeability — any hammer can drive any nail. The reality is closer to a surgical tray: using the wrong instrument produces the wrong result regardless of how skillfully you use it.

"As with any toolkit, the achievement of the desired outcome depends on the practitioner's understanding of what each tool accomplishes" (Yates, p. 11).

The problem: over 100 types of CTA methods have been identified, and existing classification schemes organize them primarily by mechanism (what they look like) rather than outcome (what they produce). This means practitioners choosing methods face "no clear guidelines... to choose the appropriate combination of methods to apply to a specific task or intended results, 'nor is it clear that an orderly relation exists between knowledge elicitation techniques and the type of knowledge that results'" (Cooke, 1994, p. 804, as cited in Yates, p. 7).

---

## The Three Families of Methods

Following Cooke (1994, 1999), CTA methods fall into three broad families:

**Observations and Interviews**: The least formal, most direct methods. Watching experts perform tasks; asking them questions ranging from free-flowing ("tell me everything you know about...") to highly structured (predetermined closed questions). Advantages: easy to conduct, flexible, accessible. Disadvantages: systematic omission of automated knowledge; subject to social desirability effects and reconstruction biases.

**Process Tracing / Protocol Analysis**: Techniques that capture sequential behavioral events as they occur, documenting cognitive processes through verbal reports, eye movements, and other behavioral traces. Core technique: think-aloud protocols, where the expert verbalizes perceptions, decisions, and actions while performing a task in real time. Theoretically grounded in the constraint that "a person can only verbalize that which is attended to in working memory" (Yates, p. 68). This is both the method's strength (it captures what's actually in working memory during execution) and its limitation (automated knowledge below the threshold of conscious attention is missed).

**Conceptual Techniques**: Methods producing structured, interrelated representations of relevant concepts within a domain. Includes concept mapping, repertory grid, card sorting, and clustering routines. These methods excel at capturing declarative conceptual knowledge — how experts organize their understanding of a domain. They are less suited to capturing procedural execution knowledge.

A fourth family, **Formal Models** (Wei & Salvendy, 2004), includes computational architectures like GOMS, ACT-R, SOAR, and COGNET — methods that formalize knowledge as executable cognitive models.

---

## What the Empirical Evidence Shows

Yates' analysis of 154 studies identified 1,010 method pairings, of which 276 (27%) clustered around 15 high-frequency pairings. The knowledge outcomes associated with these pairings reveal the differential access effect in action:

**Methods most associated with declarative knowledge only**:
- Document Analysis – Document Analysis (14 declarative, 2 procedural)
- Concept Mapping – Concept Mapping (14 declarative, 0 procedural)
- Structured Interview – Diagram Drawing (8 declarative, 0 procedural)
- Card Sort – Card Sort (7 declarative, 1 procedural)
- Repertory Grid – Repertory Grid (7 declarative, 2 procedural)

"These results were expected and consistent with the intended use of the methods found in the literature" (p. 69). These are methods designed for conceptual knowledge, and they produce conceptual knowledge reliably.

**Methods associated with both declarative and procedural knowledge**:
- Process Tracing/Protocol Analysis – Process Tracing/Protocol Analysis (7 declarative only, 3 procedural only, 34 both)
- Think Aloud – Process Tracing/Protocol Analysis (2 declarative only, 2 procedural only, 21 both)
- Semi-structured Interview – Diagram Drawing (4 declarative only, 2 procedural only, 15 both)

The process tracing family is the only approach that reliably reaches procedural knowledge — and even it produces predominantly mixed results rather than pure procedural capture.

**The subtype breakdown** reinforces this picture:
- Concept associations: 218 pairings
- Process associations: 123 pairings  
- Principle associations: only 19 pairings
- Classify procedure: 77 pairings
- Change procedure: 46 pairings

Principles — the most sophisticated form of declarative knowledge, enabling genuine understanding of cause-and-effect for creating new instances — are nearly invisible in the literature. Change procedures — the sequential steps that actually accomplish tasks — are the least captured procedural subtype.

---

## The Formal vs. Informal Method Distinction

The study identified four truly **formal methods** among the top 15 pairings:
1. Process Tracing/Protocol Analysis
2. Concept Mapping  
3. Repertory Grid
4. Card Sort

Formal methods have three characteristics: mechanisms are well-specified, they are intended to be applied systematically, and there is a substantial literature establishing their reliability and validity.

The remaining 11 high-frequency pairings are **informal** — less structured, more adaptable, but also less predictable in their outcomes.

"The findings indicate numerous haphazard pairings of methods that are ill-defined and result in the same knowledge type outcomes" (p. 81). This is a significant finding: informal methods, despite their flexibility, produce results that cannot be reliably predicted in advance. They may capture excellent knowledge, or they may not — and there is no systematic basis for knowing which.

For systems that require reliable knowledge of known types, formal methods should be preferred. For exploratory knowledge work, informal methods are appropriate as a first pass but should be followed by formal confirmation.

---

## The Method Contamination Problem

One of the more subtle findings concerns the contamination of formal methods by informal practices. Process Tracing/Protocol Analysis was found paired not only with itself (as the formal protocol requires) but also with Semi-structured Interview.

"Fundamental to Process Tracing/Protocol Analysis is the theory that a person can only verbalize that which is attended to in working memory. Thus, it would seem that interrupting the informant during task performance with questions would diminish or modify the results" (p. 68).

When practitioners mix a formal method with incompatible informal techniques, the theoretical basis of the formal method is undermined. The result may be labeled as "Protocol Analysis" in the literature but may not have the validity properties of true Protocol Analysis.

This suggests: **the label a method carries does not guarantee it was applied with fidelity to its theoretical foundations**. Method names in knowledge documentation should always be accompanied by descriptions of actual procedures, not just method labels.

---

## The Multiple Methods Imperative

Because no single method accesses the full knowledge landscape, the consistent recommendation throughout the CTA literature — from Bainbridge (1979) through Cooke (1994) through Crandall et al. (2006) — is to **use multiple methods**.

Bainbridge (1979) was among the first to observe that "different types of cognitive processing are most likely reported in different ways" and that "we are far from being clear about either the different types of cognitive process which exist or the best methods to use" (p. 432, as cited in Yates, p. 12).

The empirical basis for this recommendation: Chao and Salvendy (1994) demonstrated that three experts, queried with multiple methods, produced substantially more complete procedural knowledge than a single expert with any single method.

For agent systems, this translates directly to: **no single input channel is sufficient for high-fidelity knowledge capture**. Systems that rely on one source (a single expert, a single documentation source, a single evaluation pass) will have systematic blind spots that mirror the blind spots of their elicitation method.

---

## Matching Methods to Knowledge Targets: A Decision Guide

Based on Yates' empirical findings and the underlying theory:

**To capture declarative conceptual knowledge** (what things are, how they're categorized, what they're called):
- Concept Mapping (formal, highly reliable for concepts)
- Card Sort (formal, reliable for categories and relationships)
- Repertory Grid (formal, produces construct-element relationships)
- Structured Interview with Diagram Drawing (less formal but flexible)

**To capture declarative process knowledge** (how things work, what the stages are):
- Semi-structured Interview with Diagram Drawing (flexible, captures process descriptions)
- Document Analysis with Diagram Drawing (good for documented processes)
- Process Tracing with Diagram Drawing (captures actual process execution)

**To capture procedural knowledge** (how to do things, execution sequences):
- Think Aloud with Process Tracing/Protocol Analysis (highest fidelity for accessible procedural knowledge)
- Semi-structured Interview with Process Tracing/Protocol Analysis (broader capture including contextual knowledge)
- Critical Decision Method (captures decisions and their triggers in realistic scenarios)

**To reach automated/tacit knowledge** (requires meeting at least one sensitivity criterion):
- Use multiple experts to triangulate
- Use iterative review to prompt recognition of omitted knowledge
- Use multiple methods from different families
- Use behavioral observation rather than self-report wherever possible

---

## Transfer to Agent System Design

**Skill building should specify target knowledge types before selecting methods.**

Before defining how a skill will be built, specify: what type of knowledge does this skill require? Declarative concepts? Process understanding? Procedural execution? Tacit pattern recognition? The answers determine which approaches will be adequate.

**Routing decisions require procedural knowledge, not just declarative knowledge.**

An agent deciding which of 180+ skills to invoke is executing a classify procedure — grouping situations according to attributes that match skill profiles. This is procedural knowledge. A routing system built solely on declarative descriptions of skills will be less reliable than one built on procedurally-specified routing rules derived from actual routing decisions.

**Evaluation should match the knowledge type.**

Evaluating an agent's factual knowledge with a quiz is appropriate for declarative knowledge. Evaluating its ability to troubleshoot, diagnose, or create novel instances requires behavioral testing — applying the knowledge, not just reporting it.

**The differential access hypothesis applies to AI systems themselves.**

An AI agent asked to explain its reasoning is subject to the same limitations as a human expert: it can report what is accessible to its attention but may not accurately report its actual computational process. Method selection matters for understanding AI behavior, not just for capturing human knowledge.