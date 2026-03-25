# The Automated Knowledge Problem: What AI Agents Cannot Report About Themselves

## The Deepest Challenge in Building Expert-Level Systems

Expert systems and intelligent agents face a fundamental paradox: the knowledge that makes expert performance *excellent* is precisely the knowledge that is hardest to specify, capture, and verify. This is not a technical limitation waiting for better tools — it is structural, grounded in how expertise works at the cognitive level.

Yates' dissertation provides the most comprehensive treatment of this problem in the CTA literature, and its implications extend directly to the design of modern AI agent systems.

---

## The Three Criteria for Sensitivity to Automated Knowledge

Yates operationalizes "sensitivity to automated knowledge" with three practical criteria. A study (or, by extension, a system-building effort) is sensitive to automated knowledge if it:

1. **Uses more than one subject matter expert** — multiple experts triangulate on knowledge that any individual expert cannot fully access
2. **Calls for an iterative approach** where the expert has the opportunity to correct and supplement previous results — iteration allows recognition memory to supplement recall memory
3. **Uses multiple methods** — different methods access different layers of knowledge; no single method is sufficient

Of 154 studies examined, 132 (85%) met at least one criterion. Interestingly, "this was an unexpected result, as it was generally thought that efforts to capture automated knowledge have been applied relatively recently" (p. 73). The recognition of the automated knowledge problem turns out to be almost as old as the field itself.

The 22 studies (15%) that met no criterion were capturing expert knowledge without any protection against the automation gap — producing specifications that were systematically incomplete in ways that neither the analyst nor the expert would recognize.

---

## Why Multiple Experts Are Essential

The reliance on single experts in early expert system development is instructive. Yates notes that "during the 1970s and 1980s, expert systems sometimes relied on a single expert for the knowledge required to design and develop the system, because only one expert was available or 'easier to work with' than multiple experts" (p. 73).

The practical pressures that produced single-expert reliance are understandable. Multiple experts introduce:
- Coordination costs
- Potential conflicts between expert accounts
- Mechanisms needed to resolve ideological and factual disagreements

But the cost of single-expert reliance is systematic underspecification. Chao and Salvendy (1994) demonstrated quantitatively that "the percentage of procedures acquired increases significantly as the number of experts increases" (as cited throughout Yates). Three experts was their practical recommendation — providing substantially more complete procedural knowledge than any single expert while remaining manageable.

The mechanism: **expert knowledge is distributed, not concentrated**. No single expert has conscious access to all relevant knowledge even within their own domain. Different experts, queried independently, activate different procedural memories. Discrepancies between expert accounts are diagnostic — they point to knowledge that at least one expert has automated beyond articulable access.

---

## Why Iteration Is Essential

Single-pass elicitation misses knowledge that requires feedback to surface. This happens for two reasons:

**Recognition vs. recall**: Automated knowledge is often inaccessible to recall (direct retrieval) but accessible to recognition (comparison to a presented option). An expert who cannot describe a decision criterion when asked can often recognize whether a proposed criterion is correct when shown it. Iterative approaches — showing the expert the results of analysis and asking for corrections — convert a recall problem into a recognition problem.

**Incomplete initial activation**: The first time an expert describes a procedure, they are drawing on whatever was most recently activated in memory. Review of a transcript often activates additional memories — "Oh, I forgot to mention that when X happens, you have to..." This is not fabrication; it is the natural structure of memory retrieval, where early retrieval primes later retrieval.

The iterative approach operationalizes this: after an initial elicitation and analysis pass, the expert reviews the results and supplements or corrects them. Multiple iterations converge on a more complete specification than any single pass.

---

## Why Multiple Methods Are Essential

The "differential access hypothesis" (Hoffman et al., 1995) holds that different methods access different knowledge types. This is the empirical basis for the multiple-methods recommendation.

But the hypothesis goes deeper than simply accessing "different" knowledge. It implies that **the knowledge landscape has a topology** — some knowledge is accessible to Method A, some to Method B, and some is only accessible to the intersection of multiple methods. Automated knowledge, in particular, is often invisible to any single method because it operates below the threshold that any single method can probe.

Consider:
- A structured interview captures what an expert believes they do
- A think-aloud protocol captures what is currently in working memory during execution
- Behavioral observation captures what actually happens
- Comparison across multiple experts captures where the accounts diverge

None of these alone reaches automated knowledge. The interview produces reconstruction, not execution. The think-aloud captures conscious processing but misses automated firing below the attention threshold. Observation captures behavior but not underlying cognition. Expert comparison surfaces discrepancies but doesn't resolve them.

Combining methods in the right sequence — observation first to understand the task structure, then think-aloud to access accessible procedural knowledge, then interview to fill in declarative context, then multiple-expert comparison to triangulate — creates a layered probe that approximates the full knowledge landscape.

---

## The Representation Bias and Expert System Failures

A subtle but important cause of automated knowledge loss is representation bias — the way the intended output format of a system shapes the elicitation process, often invisibly.

Yates documents that expert systems require knowledge in IF-THEN production rule format. This requirement filters elicitation: analysts unconsciously guide conversations toward knowledge that can be expressed as conditions and actions. Knowledge that is pattern-recognition based, contextually contingent, or continuously graded — rather than binary and conditional — is systematically excluded.

"Knowledge acquisition for expert systems appears to assume that expertise can be represented by conditional rules and seeks to capture declarative knowledge as an intermediate step" (p. 76). The "intermediate step" becomes the final product. Procedural execution knowledge — the most valuable layer — is lost in the formatting process.

This explains a well-known observation in expert systems research: systems built from knowledge engineering often performed well in narrow test conditions specified by the engineers but failed unpredictably in real deployment. The deployed cases triggered automated expert knowledge that was never captured because the format couldn't express it.

---

## The AI Agent Parallel: What Models Cannot Report About Themselves

The automated knowledge problem extends, in a modified form, to AI agents themselves. There are at least three parallel phenomena:

**1. The Explanation Gap**

An AI agent asked to explain its reasoning produces an explanation generated by the same or similar process as the original reasoning — but this explanation is a post-hoc reconstruction, not a faithful account of what happened computationally. The explanation may be plausible and internally consistent while being fundamentally inaccurate about the actual computational process.

This is the machine equivalent of the expert who provides a clean, rational account of a decision that was actually driven by pattern recognition below the level of articulable reasoning. The account is not dishonest; it is the best the system can produce. But it is not the ground truth.

**2. The Distribution Shift Problem**

Expert human knowledge shows automated bias toward familiar cases — the patterns that have been practiced most are the most automated, and therefore the hardest to articulate. AI agents show analogous patterns: they perform well in the distribution of cases most represented in training and fail in ways that are systematic but hard to predict on cases at the distribution boundary.

The failure is not random. It has structure — the same structure that makes certain automated expert knowledge invisible to introspection. Neither the expert nor the agent can fully specify the boundary conditions of their own competence.

**3. The Confidence Calibration Problem**

Automated knowledge in experts shows up as high confidence without supporting reasoning — the expert "just knows" and may be right. AI systems show analogous patterns: high confidence outputs on inputs where the training distribution provides poor basis for confidence. Like the expert who cannot account for their certainty, the AI system cannot always distinguish "I know this" from "I pattern-matched this."

---

## Practical Implications: Building Sensitivity to Automated Knowledge into Agent Systems

**Multiple agents should be consulted for high-stakes decisions.**

Just as multiple human experts surface knowledge that any single expert cannot articulate, multiple AI agents queried on the same problem can reveal the contours of the knowledge landscape. Divergence between agents is diagnostic, not just noise — it marks the boundary of well-specified knowledge.

**Iterative refinement should be built into skill development.**

Skills should not be defined, validated once, and deployed. The iterative approach that Yates identifies as critical for human knowledge elicitation applies equally to AI skill development: initial specification, behavioral evaluation, gap analysis, refined specification, re-evaluation. Each iteration surfaces automated knowledge that the previous pass missed.

**Behavioral evaluation is necessary, not sufficient, but superior to introspective evaluation.**

Evaluating a skill by asking the agent to explain what it would do is analogous to interviewing a human expert — it accesses articulable knowledge and misses automated knowledge. Evaluating a skill by observing its performance across a diverse set of actual cases is closer to behavioral observation, which is more reliable. High-fidelity evaluation requires both, with behavioral evaluation as the ground truth.

**Confidence scores should be treated with the same skepticism as expert self-reports.**

An agent's reported confidence on a task is its best attempt at calibration, but it may not reflect the actual reliability of its outputs on that task. Just as expert self-assessment of procedural knowledge is systematically incomplete, agent confidence may be systematically miscalibrated. External validation against ground truth is required to establish reliability.

**The 85% sensitivity rate in Yates' literature review is a useful benchmark.**

85% of CTA studies in Yates' sample incorporated at least one sensitivity criterion. For AI agent system development, a similar standard should apply: 85% of significant skill development efforts should incorporate multiple evaluation sources, iterative refinement, or comparative evaluation against independent benchmarks — preferably all three.