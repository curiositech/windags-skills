# Knowledge Elicitation: Getting What Experts Know Into Agent Systems

## The Problem of Tacit Knowledge

The single most important resource in any intelligent system is its knowledge — and the single biggest challenge in building intelligent systems is that the knowledge you most need is usually the hardest to get. This is the problem of tacit knowledge, and it sits at the center of the Cognitive Systems Engineering research program.

Tacit knowledge is knowledge that practitioners have but cannot easily articulate. It is the knowledge that has been automated through years of practice — the pattern recognitions, the situational assessments, the micro-decisions that experts make automatically, without conscious deliberation, and that they consequently cannot directly report. When you ask an expert "how do you know when situation X requires approach A rather than approach B?", they often cannot tell you. Not because they don't know — they clearly do, because their judgments are reliably accurate — but because the knowing is no longer accessible to conscious introspection. It has been compiled into perception.

This is not a minor inconvenience. Tacit knowledge is the most valuable knowledge an expert has. The explicit, articulable knowledge — the knowledge that appears in manuals, textbooks, and training programs — is available to novices. What distinguishes experts from novices is precisely the tacit layer: the perceptual sensitivity to subtle cues, the fluent situation recognition, the automatic generation of contextually appropriate responses, the instant recognition of anomalies.

And it is exactly this tacit layer that is most commonly missing from AI systems — because the knowledge acquisition methods typically used (documentation analysis, procedure specification, rule elicitation) can only capture explicit knowledge.

## Why Standard Knowledge Acquisition Fails

The history of knowledge-based AI systems includes a long record of systems that performed at novice levels despite being built with the best available domain knowledge, because that knowledge was acquired through methods that could only capture the explicit layer.

Hoffman et al. (2002) are direct about this: "Effective methodologies for eliciting and preserving the knowledge of domain practitioners" is a specific and hard-won research achievement, not a given. The methodologies matter. The wrong methodology will give you the wrong knowledge.

What are the wrong methodologies?

**Think-aloud protocols under nominal conditions** capture conscious deliberation — which is exactly what experts don't use for most of their decisions. You observe expert performance, the expert narrates their thinking, you encode the narrative. What you get is the expert's post-hoc rationalization of decisions that were actually made pre-consciously. It is accurate in the large, misleading in the details, and missing the most valuable knowledge entirely.

**Interview-based procedure elicitation** captures what experts say they do, not what they actually do. The gap between these can be enormous — not because experts are lying, but because they genuinely don't know. Their conscious model of their own practice is an incomplete and often inaccurate representation of their actual practice.

**Observation of nominal performance** captures what experts do when everything is going according to plan. It misses entirely the knowledge that emerges when plans fail — which is exactly the knowledge that distinguishes expert performance from novice performance in consequential situations.

## The Critical Decision Method

The Critical Decision Method (CDM), developed by Hoffman, Crandall, and Shadbolt (1998, cited in the source material), represents a methodologically rigorous solution to the tacit knowledge elicitation problem. The CDM addresses the core difficulty — that tacit knowledge is not accessible to direct introspection — by using a different access route: narrative reconstruction of past critical incidents.

The method is built on a key insight: **although experts cannot articulate their tacit knowledge in response to abstract questions, they can often reconstruct the cognitive process they used in a specific past incident, given sufficient contextual cues.** The narrative of "what happened, what did I notice, what did I consider, what did I decide, and what happened next?" provides enough context to surface knowledge that abstract questioning cannot reach.

The CDM interview proceeds through multiple passes over the same incident:

**First pass**: the expert gives a free narrative account of the incident. The interviewer listens without interruption, noting the decision points and the cognitive operations that appear in the narrative.

**Second pass**: the interviewer asks probing questions at the decision points identified in the first pass. What did you notice just before you made that decision? What were you considering? Were there other options you evaluated? Why did you reject them? What would a less experienced person have done differently at this point?

**Third pass**: the interviewer explores the boundaries of the situation — the cues that made this situation recognizable as a particular type, the conditions under which the expert's response would have been different, the factors that would have changed the assessment.

**Fourth pass** (in some variants): the interviewer presents counterfactual modifications to the incident and asks how the expert's response would have changed. This surfaces conditional knowledge — the decision rules that depend on situational features — that may not have been explicitly invoked in the original incident.

The output of a CDM session is not a procedure. It is a rich representation of the knowledge structures — the situation models, the recognitional patterns, the decision rules, the evaluative criteria — that the expert used in a specific, consequential case. This knowledge, aggregated across many incidents with many experts, forms the basis for a genuine model of expert performance.

## From Elicited Knowledge to Agent Knowledge Representation

The CDM and related methods (Verbal Protocol Analysis, Task-Analytic methods, Observation studies) produce rich qualitative data. The challenge is to translate this into representations that can ground effective agent behavior. CSE points to several principles:

**Represent situations, not just actions.** Expert knowledge is fundamentally situational — the same action is right in one situation and wrong in another. Agent knowledge representations must include the situation conditions under which each action is appropriate, not just the action itself.

**Represent the cues, not just the conclusions.** What the expert perceives — the specific features of the situation that triggered recognition — is as important as what they concluded. Agents that know "situation type X requires response Y" but don't know what makes a situation a type-X situation cannot recognize type-X situations reliably.

**Represent the boundary conditions explicitly.** Experts know when their knowledge applies and when it doesn't. This meta-knowledge — the conditions under which a strategy is reliable and the conditions under which it fails — is critical for robust agent performance. An agent without boundary condition knowledge will apply strategies confidently outside their valid range.

**Preserve uncertainty and confidence information.** Expert knowledge is not uniformly certain. Experts have different degrees of confidence in different recognitions, different assessments, different recommendations. An agent system that normalizes this to uniform confidence loses important information.

**Represent the reasoning, not just the conclusion.** When agents communicate their outputs to other agents, they should communicate the reasoning behind those outputs — what situation was recognized, what considerations were weighed, what assumptions were made. This enables downstream agents to evaluate the appropriateness of the upstream agent's output for the current context.

## The Knowledge Preservation Problem

CSE identifies a practical challenge that AI agent systems face in particularly acute form: **expert knowledge is perishable.** Experts retire, die, change jobs, lose their currency in rapidly changing domains. Organizational expertise that took decades to accumulate can be lost in a few years if it is not explicitly captured and preserved.

This is not just a human organizational problem. AI agents face a version of it in model drift: as the world changes, as the distribution of tasks shifts, as new tools and methods emerge, the knowledge embedded in an agent's representations can become outdated without any explicit signal that this has happened. An agent trained on historical cases will progressively misrepresent current practice unless its knowledge is actively maintained.

Hoffman et al. identify "effective methodologies for eliciting and preserving the knowledge of domain practitioners" as a major research achievement — one that took decades to develop and that remains an active area of research. The emphasis on *preserving* is important. Elicitation that is not followed by effective preservation and maintenance produces knowledge that degrades over time.

For AI agent systems, knowledge preservation means: explicit versioning of agent knowledge representations, active monitoring for knowledge drift (comparing agent outputs against current ground truth), mechanisms for incremental updating as new cases accumulate, and systematic processes for re-eliciting expert knowledge as domains evolve.

## The Bootstrapping Problem and How to Escape It

A challenge in building expert-level AI agents is the bootstrapping problem: to elicit expert knowledge using CDM and similar methods, you need domain experts. But identifying who the domain experts are, getting access to them, designing the elicitation sessions, and translating the output into agent representations requires a level of domain understanding that is itself hard to acquire without expertise.

CSE addresses this through a methodology of "bootstrapping multiple converging cognitive task analysis techniques" (Potter et al., cited in Hoffman et al., 2002). The idea is to use multiple methods simultaneously, each of which provides partial insight, and to converge on a more complete picture through the combination. No single method is sufficient; the combination is.

For AI agent systems, the analog is: don't rely on any single source of knowledge. Use documentation, use expert interviews, use case analysis, use incident reports, use observation studies — and build the agent's knowledge representation as a synthesis of these multiple streams, explicitly noting where they agree and where they conflict, and treating conflicts as signals that require deeper investigation rather than anomalies to be resolved by fiat.

The goal is not to elicit perfect knowledge — there is no perfect knowledge in complex domains. The goal is to elicit *representative* knowledge: knowledge that covers the breadth of situations the agent will encounter, that is accurate in its characterization of expert performance, and that is honest about its limitations and boundary conditions. An agent built on representative knowledge will perform at an appropriate level across the range of cases it encounters, fail gracefully when it encounters cases outside its knowledge coverage, and provide the transparency needed for its supervisors to detect and correct its errors.