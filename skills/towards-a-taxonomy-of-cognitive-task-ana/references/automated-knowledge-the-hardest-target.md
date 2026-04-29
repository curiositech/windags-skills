# Automated Knowledge: The Hardest Target in Expert Systems and Why It Matters Most

## The Paradox of Expertise

The most powerful part of expert knowledge is also the least accessible. Automated knowledge — the compiled, unconscious, fast-executing procedural knowledge that defines peak expert performance — is what separates experts from competent practitioners. It is also what makes experts unable to fully explain what they know.

Yates frames the paradox directly: expertise produces "automated procedures for effective and efficient decision-making" (p. 30). But automation means these procedures are no longer consciously accessible. The expert cannot tell you what they know in its most powerful form, because in its most powerful form it is no longer conscious.

This is not a temporary problem that better interviewing techniques will solve. It is a structural feature of how human expertise is acquired and stored. Understanding it is essential for any agent system that needs to replicate, coordinate with, or augment human expertise.

## The Anderson ACT-R Mechanism

The process by which declarative knowledge becomes automated is described by Anderson's ACT-R architecture (1983, 1998, 2005) through two sub-processes:

**Proceduralization**: "Interpretive applications are gradually replaced with productions that perform the task directly" (p. 33). A person who must consciously recall each rule for shifting gears eventually develops a production that executes the whole sequence without conscious retrieval.

**Composition**: "Sequences of productions may be combined into a single production" (p. 33). Multiple steps collapse into a single automatic response.

Together, these create **knowledge compilation**: "task-specific productions during practice" that "affects working memory by reducing the load resulting from information being retrieved from long-term memory" (p. 33-34).

The result is expertise that is fast, accurate, and largely opaque to introspection. The proceduralized, compiled knowledge is also what makes experts unreliable self-reporters — they can describe early, consciously acquired versions of their knowledge, but not the later, compiled versions that actually drive their performance.

## What Methods Capture Automated Knowledge

Yates defines sensitivity to automated knowledge operationally. A CTA study is classified as sensitive to automated knowledge if it meets at least one of three criteria:

1. **Multiple experts**: Recommended or used methods with more than one subject matter expert. Using multiple experts allows cross-checking that catches the systematic omissions any single expert makes.

2. **Iterative approach**: Called for the subject matter expert to have the opportunity to correct and supplement previous results. Iteration allows the expert to catch their own omissions over multiple passes.

3. **Multiple methods**: Recommended or used multiple knowledge elicitation and analysis/representation methods. Different methods access different aspects of knowledge, including those too automated for one method to surface.

Yates finds that 132 out of 154 studies (86%) in his sample met at least one of these criteria. This was "an unexpected result, as it was generally thought that efforts to capture automated knowledge have been applied relatively recently" (p. 73).

This finding suggests the field implicitly understood the automated knowledge problem earlier than the theoretical literature acknowledged it. Practitioners, confronted with systematic gaps in single-expert, single-method elicitation, naturally evolved multi-expert, iterative, multi-method approaches as corrections.

## Why Single-Expert, Single-Method Approaches Fail for Automated Knowledge

The historical evolution of knowledge acquisition for expert systems illustrates the failure mode clearly. Early expert systems in the 1980s "sometimes relied on a single expert for the knowledge required to design and develop the system, because only one expert was available or 'easier to work with' than multiple experts" (p. 73).

The result, documented extensively in the expert systems literature, was systems that performed well in the specific situations the one expert described, and catastrophically in situations the expert didn't think to mention — because those situations were handled by automated knowledge that never surfaced in the elicitation.

Chao and Salvendy's (1994) empirical study, cited by Yates, quantifies this directly. Using a single expert, protocol analysis captured approximately 41% of available procedures. Three experts together captured dramatically more. The study "demonstrated significant increases in the percentage of procedures as a result of using multiple experts" (p. 80).

The 41% figure is a sobering benchmark. A single-expert, single-method knowledge acquisition approach captures less than half the available procedural knowledge. The automated remainder — the compiled expertise — is invisible to it.

## Three Categories of Invisible Expert Knowledge

Synthesizing the CTA literature, Yates implies a classification of knowledge that resists standard elicitation:

**1. Compiled Decision Rules**: The IF-THEN productions that experts execute automatically. These were once conscious rules but have been compiled into direct condition-action mappings. Expert can describe the outcomes of these rules but not the rules themselves — because the rules no longer pass through conscious working memory.

**2. Perceptual Cues**: The pattern recognition capabilities that allow experts to classify situations rapidly. Experienced neonatal nurses in the Hoffman et al. (1998) study recognized "shifts in the patients' conditions" through perceptual cues not captured in any textbook. These cues are acquired through exposure to thousands of cases and represent a form of automated classification that is extremely difficult to verbalize.

**3. Tacit Standards**: The implicit criteria by which experts evaluate whether a situation is normal, marginal, or critical. These thresholds are learned experientially and are rarely explicitly stated, because experts rarely encounter situations where they need to state them — until something goes wrong.

## Application to Agent System Design

### The Three-Layer Problem
Agent systems that need to operate with genuine expertise must be designed to capture all three layers:

- **Explicit knowledge** (Declarative, fully accessible): Captured through standard documentation and interview.
- **Compiled procedural knowledge** (Implicit, partially accessible with specific methods): Requires process tracing, think-aloud, critical incident methods, and multiple expert cross-validation.
- **Automated perceptual knowledge** (Tacit, minimally accessible): Requires extensive behavioral observation, large case libraries, and probabilistic modeling of decision patterns.

Most current agent system knowledge bases address only the first layer. This produces agents that are articulate about the domain but brittle in execution.

### Multi-Expert Validation as Architecture
The finding that multi-expert approaches dramatically improve procedural knowledge capture should be architecturally embedded in agent knowledge acquisition. Specifically:

- Knowledge from a single source should be flagged as provisional pending cross-validation
- Agent system design should include explicit processes for surfacing disagreements between expert sources (which often reveal automated knowledge that one expert didn't mention because it was obvious to them)
- Conflict resolution between expert sources should be treated as a knowledge enrichment opportunity, not a problem to be resolved by averaging

### Iterative Refinement as Necessity, Not Luxury
The requirement for iterative approaches means that agent knowledge bases are never "done." A single pass through expert knowledge will systematically miss the automated portions. The knowledge base must be designed for ongoing enrichment, with mechanisms for:

- Re-querying experts about specific decision points when agent failures indicate knowledge gaps
- Version control of knowledge base changes with attribution to the gap type that prompted them
- Explicit modeling of what the agent doesn't know, so gaps can be systematically targeted

### The 41% Baseline
Yates's synthesis of the Chao and Salvendy (1994) finding implies a practical benchmark: any knowledge acquisition from a single expert using a single method should be treated as capturing approximately 40% of available procedural knowledge. This is the planning assumption for estimating how many additional passes, experts, or methods will be needed to approach adequate coverage.

## The Representation Bias Risk for Automated Knowledge

One of Yates's most nuanced observations concerns how representation bias distorts automated knowledge capture. When knowledge is being acquired for systems that use IF-THEN rule representation (as most expert systems do), there is pressure to represent all knowledge in that format.

The risk is that declarative knowledge — concepts, processes, principles — gets *formatted* as IF-THEN rules without actually being converted into genuine procedural knowledge. The system has the right representational structure but the wrong cognitive substrate underneath it.

"The development of expert systems requires that knowledge be represented as condition-action pairs. This requirement influences the choice of CTA methods and the final representation of expertise" (p. 75).

For agent systems: the ability to express knowledge in IF-THEN format does not mean that knowledge was acquired as genuine procedural knowledge. Systems that elicit declarative descriptions and then format them as rules have declarative content in a procedural container — which will fail when the IF conditions include perceptual cues or contextual factors that the declarative description didn't capture.

## Methods Most Sensitive to Automated Knowledge

Drawing on Yates's framework, the methods most likely to surface automated knowledge are:

1. **Process Tracing/Protocol Analysis**: Captures cognitive trace during actual task execution, including automated responses as they occur.
2. **Think Aloud**: Forces real-time verbalization, which can surface some automated knowledge as it executes.
3. **Critical Decision Method**: Focuses on non-routine cases where automated procedures broke down — which forces experts to articulate what normally goes without saying.
4. **Retrospective Aided Recall**: Use of artifacts (video, notes) to cue memory of cognitive processes during past events.
5. **Multiple-Expert Cross-Validation**: Not a single method, but a cross-cutting strategy that uses disagreement between experts to surface knowledge that each expert considers too obvious to mention.

## Summary

Automated knowledge is the most valuable and most inaccessible component of expert expertise. Standard elicitation methods capture at most 40% of available procedural knowledge from a single expert pass. Addressing the automated knowledge problem requires multiple experts, iterative refinement, and multiple methods — all three. For agent systems, this translates to architectural requirements for ongoing knowledge enrichment, multi-source validation, and explicit modeling of knowledge gaps. The 41% baseline should be a sobering planning assumption for any agent system that claims to operate with genuine domain expertise.