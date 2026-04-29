# Knowledge Elicitation as a Two-Component Toolkit: Why You Always Need Both Halves

## The Fundamental Structure of Knowledge Extraction

One of Yates's most practically significant findings is that CTA — cognitive task analysis, the science of extracting expert knowledge — is never actually practiced as a single method. Despite the fact that classification schemes in the literature treat methods individually, real practitioners consistently pair methods together: one to pull knowledge out of an expert, another to structure and represent what was extracted.

Yates defines this with precision: CTA encompasses three sets of activities — "knowledge elicitation, data analysis, and knowledge representation" (Crandall et al., 2006, as cited in Yates, p. 8). Knowledge elicitation methods collect "what people know and how they know it: the judgments, strategies, knowledge, and skills that underlie performance." Analysis/representation methods handle "the process of structuring data, identifying findings, and discovering meaning" and "the critical tasks of displaying data, presenting findings, and communicating meaning."

The empirical core of Yates's study confirms that in the literature, 276 (27%) of identified CTA method pairings cluster around just 15 elicitation/analysis-representation method pairs (p. 56). Pairings, not individual methods, are what the field actually uses.

## Why Both Halves Are Necessary

An elicitation method without an analysis/representation method produces raw data — verbal transcripts, observation notes, recalled incidents — that remains inaccessible and unusable. An analysis/representation method without elicitation produces structure imposed on inadequate data. The pairing is the unit of effective knowledge extraction.

This is directly analogous to a two-phase pipeline in any information processing system:
- **Phase 1 (Elicitation)**: Access the source. Draw out the knowledge that is present.
- **Phase 2 (Analysis/Representation)**: Transform the raw output into a usable, structured form.

The choice of each phase independently, and the relationship between the two choices, determines what knowledge type you end up with.

## The 15 Most Frequent Pairings: What the Field Actually Uses

Yates's empirical analysis identifies 15 method pairings that account for the clustered high-frequency zone of actual practice. Each pairing has a characteristic knowledge profile:

### Formal Method Pairings (High Predictability)
Four pairings are considered "formal" — their mechanisms are well-specified, standardized, and systematically applicable:

1. **Process Tracing/Protocol Analysis → Process Tracing/Protocol Analysis**: The workhorse of CTA. Elicits both declarative and procedural knowledge; especially strong for processes (sequential stages) and classify/change procedures. The analyst captures the cognitive trace of an expert working through a problem. High frequency: 44 occurrences in the study sample.

2. **Concept Mapping → Concept Mapping**: Produces static representations of conceptual structure. Strong for concepts and processes (declarative subtypes); weak for procedural knowledge. Fourteen pure declarative associations. Frequency: 20.

3. **Repertory Grid → Repertory Grid**: A formal psychometric method for eliciting personal constructs. Strongly associated with declarative concepts; occasionally produces procedural classify outcomes when used for expert system development. Frequency: 18.

4. **Card Sort → Card Sort**: Reveals conceptual organization. Strong for concepts; limited procedural output. Frequency: 13.

### Informal Method Pairings (High Flexibility, Lower Predictability)
The remaining high-frequency pairings involve less formal methods that are more adaptable but less predictable in their knowledge outputs:

5. **Think Aloud → Process Tracing/Protocol Analysis**: Think aloud is an essential component of protocol analysis, making this pairing natural. Strong for both declarative and procedural knowledge. Frequency: 25.

6. **Semi-structured Interview → Diagram Drawing**: The most versatile pairing. Semi-structured interviews allow opportunistic follow-up; diagram drawing provides flexible visual representation. Produces concepts, processes, classify, and change procedures — the broadest knowledge coverage. Frequency: 21.

7. **Document Analysis → Document Analysis**: Bootstrapping — using existing documentation to familiarize the analyst with the domain. Strong for declarative knowledge; frequently used as a preliminary phase. Frequency: 32.

8. **Semi-structured Interview → Content Analysis**: Interview data organized into a priori or emergent categories. Strong for concepts and classify procedures. Frequency: 17.

9. **Document Analysis → Diagram Drawing**: Deriving diagrams from documented knowledge. Strong for declarative subtypes. Frequency: 17.

10. **Semi-structured Interview → Process Tracing/Protocol Analysis**: An interesting anomaly — semi-structured interviewing is not a standard component of protocol analysis, yet this pairing appears frequently. Suggests informal adaptation of formal methods (see below). Frequency: 13.

11. **Card Sort → Card Sort**: Already covered above.

12. **Semi-structured Interview → Document Analysis**: Interview as a supplement to or validation of documented knowledge. Frequency: 12.

13. **Structured Interview → Diagram Drawing**: Constrained questions producing visual representations. Strong for declarative, especially concepts. Frequency: 12.

14. **Group Interview → Diagram Drawing**: Consensus-building interviews producing visual outputs. Frequency: 12.

15. **Process Tracing/Protocol Analysis → Diagram Drawing**: Protocol analysis producing flow diagrams. Strong for processes and change procedures. Frequency: 11.

## The Differential Access Hypothesis: Why No Single Method Is Enough

Hoffman et al. (1995), cited by Yates, proposed what they call the "differential access hypothesis": "different elicitation techniques capture different types of knowledge, and that the characteristics of the domain and task should be considered when choosing a technique" (p. 22).

This is a critical insight for agent system design: **there is no universal knowledge extraction method.** Each method accesses a different facet of expert knowledge. Formal conceptual methods (concept mapping, card sort, repertory grid) are optimized for declarative structure. Process tracing is optimized for temporal sequences and decision logic. Critical Decision Method is optimized for non-routine events and situational judgment. The Semi-structured interview is flexible but produces inconsistent knowledge types.

The recommendation that follows from this — widely echoed across the literature Yates reviews — is to **combine methods from different families to ensure complete and accurate coverage.** This recommendation appears "early and consistently throughout the literature" (p. 73). The study finds that 85% of publications in the sample took steps to address automated knowledge through multiple experts, iterative approaches, or multiple methods (p. 73).

## Applying the Pairing Framework to Agent Knowledge Acquisition

### The Agent Analog to Method Pairings
In agent system design, the two-component structure of CTA translates directly:

- **Elicitation** → The interface through which the agent accesses source knowledge (prompting strategies, question templates, structured information gathering from human experts or from documents)
- **Analysis/Representation** → The structure imposed on that raw access (knowledge graph construction, IF-THEN rule extraction, concept taxonomy building, process flow mapping)

Both halves must be consciously designed. An agent that retrieves information but has no representation layer produces unstructured output that cannot drive subsequent reasoning. An agent with a sophisticated representation layer but poor elicitation strategies will impose structure on systematically incomplete inputs.

### Choosing the Right Pairing for the Knowledge Type
Yates's empirical data provides guidance for matching method pairings to knowledge type targets:

| Target Knowledge Type | Recommended Pairing Class | Rationale |
|----------------------|--------------------------|-----------|
| Conceptual structure (how concepts relate) | Formal conceptual methods: Concept Map, Card Sort, Repertory Grid | Designed for static conceptual representation |
| Process knowledge (how things work) | Process Tracing/Protocol Analysis + Diagram Drawing | Captures sequential cognitive traces |
| Situational judgment (when to deviate) | Critical Decision Method + Content Analysis | Designed for non-routine decisions |
| Procedural execution (how to perform) | Think Aloud + Protocol Analysis | Captures real-time decision-action sequences |
| Domain bootstrapping | Document Analysis + Diagram Drawing | Preliminary orientation before deeper elicitation |

### The Semi-structured Interview Warning
Yates's data shows that the Semi-structured Interview appears in more pairings than any other elicitation method — but produces the most inconsistent knowledge type outcomes. This makes it the most dangerous method to use without a clearly specified target knowledge type. It is highly flexible and therefore widely used, but its flexibility means that what you get depends heavily on what questions are asked and how results are analyzed.

For agent systems, this translates to a warning about unstructured information gathering: prompting an expert without a specific knowledge-type target will produce plausible-sounding information that may be declarative when procedural knowledge was needed, or vice versa.

### The Formal Method Advantage
Formal methods (Process Tracing/Protocol Analysis, Concept Mapping, Repertory Grid, Card Sort) are associated with more consistent knowledge outcomes than informal ones. "Standardized methods appear to provide greater consistency in the results than informal models" (p. 77).

This is because formal methods have theoretically grounded protocols that determine what questions are asked, how responses are probed, and how outputs are structured. The protocols encode knowledge about what types of knowledge the method is sensitive to.

In agent system terms: **structured knowledge acquisition templates consistently outperform ad-hoc information gathering**, especially when the target knowledge type is specified in advance.

## The Anomaly of Method Adaptation

Yates documents an important finding about formal methods in practice: they are frequently adapted in ways that depart from their formal specifications. The most notable case is Process Tracing/Protocol Analysis, which is supposed to capture cognitive traces during task performance (think-aloud during actual execution). But Yates finds it frequently paired with Semi-structured Interview — which involves conversational dialog, not cognitive trace capture.

"The more that the practice of these methods departs from the formal protocols, which have empirically supported theoretical foundations, the less likely the results will be valid and reliable" (p. 69).

This is a warning about method drift: as practitioners adapt formal methods to their constraints, they may lose the theoretical properties that make those methods sensitive to specific knowledge types. The method name becomes a label that no longer accurately describes the procedure.

For agent systems: when deploying standardized knowledge extraction templates, monitor for drift from the intended procedure. Label and protocol integrity matter — not because of formality for its own sake, but because the formal specifications encode the theoretical sensitivity to specific knowledge types.

## Summary

CTA is always practiced as a pairing: elicitation + analysis/representation. No single method is complete. Different pairings are differentially sensitive to different knowledge types. The 15 most frequent pairings in the literature provide empirically grounded starting points for knowledge extraction strategy. Formal methods produce more consistent outcomes but less flexibility; informal methods produce broader coverage but less predictable knowledge type results. For agent systems that need specific types of knowledge, matching the extraction method pairing to the target knowledge type is as important as the extraction itself.