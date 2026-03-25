# Extracting Tacit Expert Knowledge: Lessons from Cognitive Task Analysis

## The Problem of Tacit Expertise

One of the most practically significant findings in this paper — and in the naturalistic decision making research tradition it represents — is that expert practitioners often *cannot* explain how they make their best decisions. The knowledge is real, the performance is demonstrably superior, and the cues being used are genuine. But the expert cannot articulate them on request.

This is not false modesty or intellectual laziness. It is a structural feature of how expertise is encoded. Simon's definition of intuition as pattern recognition implies that the knowledge lives in the pattern library, not in propositional memory. The expert has access to the *conclusion* that the pattern activates — this situation requires X — without having access to the *rule* that generated the conclusion.

The neonatal nurses in Crandall and Getchell-Reiter's (1993) study could detect early sepsis in infants before blood tests confirmed it. When first asked, "the nurses were at first unable to describe how they made their judgments." This was not a failure of cooperation. They genuinely did not know what they were noticing. The knowledge was pre-verbal, pre-analytical, embedded in pattern recognition that operated below the level of articulable reasoning.

"We cannot expect decision makers to accurately explain why they made decisions (Nisbett & Wilson, 1977)."

## What Cognitive Task Analysis Revealed

Crandall and Getchell-Reiter used structured interview methods — Cognitive Task Analysis (CTA) — to probe specific incidents rather than asking for general descriptions of the decision process. CTA methods work by:

1. **Anchoring in concrete incidents**: Rather than "How do you detect sepsis?", the researcher asks "Tell me about a specific time you suspected sepsis before the tests came back. Walk me through that case."

2. **Probing for cues**: "What did you notice first? What made you uncomfortable? At what moment did you think something might be wrong?"

3. **Exploring the counterfactual**: "What would the baby have looked like if you hadn't been concerned? What would have been different?"

4. **Identifying the decision point**: "When did you decide to act? What happened that crossed the threshold?"

5. **Surfacing the knowledge**: "Looking back, what were you seeing that the newer nurses weren't noticing?"

The result, after extended analysis of specific incidents: a catalogue of early sepsis cues, some of which had not appeared in the nursing or medical literature. Crucially, some of these cues were *opposite* to infection indicators in adults — an infant showing signs that would be reassuring in an adult was actually in early danger.

This extracted knowledge was then organized into a training program that was disseminated throughout the nursing community. The tacit expertise of a few exceptional practitioners was transformed into teachable, transmissible knowledge that improved outcomes broadly.

## The Gap Between Knowing and Explaining

Nisbett and Wilson's (1977) foundational paper "Telling more than we can know" established that people's verbal explanations of their mental processes are often confabulations — narratives constructed post-hoc that feel accurate but don't reflect the actual causal process that produced the behavior.

This means that the standard approach to knowledge elicitation — asking experts "How do you do X?" and recording their answers — reliably produces:
- Post-hoc rationalizations that feel correct to the expert
- General principles that the expert believes guide their decisions (and may well guide their *less skilled* decisions)
- Articulated rules that reflect explicit training and protocol, not tacit expertise
- Significant underrepresentation of the actual cues being used

CTA is specifically designed to route around this limitation. By anchoring in specific incidents and probing the moment-by-moment experience rather than asking for general descriptions, CTA gives researchers access to the actual decision process rather than the expert's theory of their decision process.

## Implications for Knowledge Transfer to Agent Systems

This has profound implications for how knowledge is transferred to intelligent agent systems.

### The Training Data Problem

Standard approaches to training agents on expert knowledge typically involve:
- Asking experts to document their decision processes
- Having experts label examples with explanations
- Recording experts' verbal reasoning as they solve problems (think-aloud protocols)

All of these methods are subject to the verbal reporting problem Nisbett and Wilson identified. The expert's explanations may bear limited relationship to the actual cues that drive their decisions. An agent trained on experts' *descriptions* of their expertise rather than on actual examples of their *exercise* of expertise will learn the expert's theory of their performance, not the performance itself.

The better approach mirrors CTA: expose the agent to the actual situations in which expertise matters, with outcome labels, and let the pattern recognition system discover the actual cues. Supplement with CTA-derived explicit cue descriptions where those are available — not as the primary training signal, but as a verification and enrichment layer.

### The Counterfactual Question

CTA's "what would you have seen if you hadn't been concerned?" question is particularly powerful because it forces experts to articulate the discriminating features — the cues that distinguish the dangerous situation from the benign one that looks superficially similar.

This is the right framing for agent training data generation: not "what are the features of this example?" but "what features distinguish this example from the hard negatives that look similar?" The discriminating features are the actual signal. The common features of all examples are noise.

### Knowledge Extraction Before Automation

When building an agent to automate or assist with a task currently performed by human experts, the appropriate sequence is:

1. **CTA to surface tacit knowledge**: Before building the agent, use structured interviews and incident analysis to extract the cues that drive expert performance. This surfaces knowledge that would not appear in documentation, not be visible in outcome labels alone, and would not be accessible from expert self-report.

2. **Pattern verification**: Validate the extracted cues empirically — do they actually predict outcomes? (Some cues experts believe they use may not be statistically predictive; some they don't mention may be highly predictive.)

3. **Training data construction**: Use the verified cues to design training data that includes the right features, with appropriate coverage of discriminating edge cases.

4. **Calibration against expert performance**: Evaluate the agent against expert performance on novel cases, focusing especially on cases at the margins of the pattern library (anomalous cases where expert novice differences are largest).

### Anomaly Recognition as a Target Skill

One of the most important expert skills identified by Klein and colleagues — and one that is particularly difficult to capture through standard training — is the ability to recognize that a situation is anomalous. The expert doesn't just recognize known patterns; they notice when known patterns *don't fit*.

This anomaly recognition is a negative pattern: not "this matches pattern X" but "this doesn't match anything I know." It requires a complete enough coverage of the pattern library that the absence of a match is itself a meaningful signal.

For agents, this suggests:
- Training should include explicit examples of anomalous cases with labels identifying them as anomalous
- The pattern library should have coverage estimations — how confident is the agent that a given situation is within its training distribution?
- Low coverage/high novelty should trigger explicit escalation to deliberate analysis, not confident pattern application

## What Makes CTA Methods Relevant to Agent System Design

CTA methods were developed to study human decision making, but their underlying principles apply directly to the problem of understanding and improving agent decision making:

**Incident-anchored analysis**: When an agent makes a surprising error, analyze the specific incident — what were the inputs, what pattern did the agent appear to match, what was the actual situation? Don't ask "why does the agent make errors?" (which would produce general descriptions). Ask "what specifically happened in this case?"

**Cue identification**: What features of the input were the most predictive of the output? (Explainability methods like SHAP or attention visualization are the computational analog of CTA's cue-probing.) Are those the same cues that would discriminate this case from similar non-problematic cases?

**Counterfactual probing**: What would the input have looked like if the correct output were different? Does the agent's decision boundary correspond to the actual discriminating features?

**Expert comparison**: Where do expert human judgments and agent judgments diverge? Do the divergences occur in predictable subtask types? (This is the computational version of comparing expert and novice pattern libraries.)

The core insight from Kahneman and Klein's discussion of CTA: **the knowledge required for high performance is often not the knowledge that practitioners believe they use**. Uncovering the actual drivers of performance requires methods that bypass self-report and access the actual decision process — whether that process occurs in a human brain or an agent model.