# Expertise as Situational Knowledge: What Experience Actually Builds

## The Wrong Model of Expertise

The standard model of expertise — implicit in most training designs, decision aids, and AI system architectures — treats experts as people who can perform the same cognitive operations as novices, but faster and more accurately. The expert is a better calculator, a faster searcher, a more reliable evaluator.

Klein and Calderwood's research shows this is wrong in a fundamental way. Expert decision makers are not doing the same thing as novices, more efficiently. They are doing something structurally different: situation assessment-driven recognition, rather than option generation and evaluation. The expert has built a different cognitive architecture, not a faster version of the novice architecture.

Understanding what expertise actually is — and what experience actually builds — is essential for designing systems that genuinely benefit from domain knowledge.

## What Experience Builds: The Schema Library

The core product of expertise is not faster option evaluation. It is a rich library of situation schemas — structured packages of knowledge linking situation features to goals, critical cues, expectancies, and action queues.

Each schema encodes:
- **What this situation type looks like**: the cue pattern that identifies it
- **What matters in this situation**: the critical factors that differentiate workable from unworkable responses
- **What is likely to happen**: the forward model of how this situation type typically evolves
- **What to do**: the action queue, roughly ordered by typicality
- **What would tell you you're wrong**: the expectancies whose violation would force reassessment

Building this library requires experiencing many real cases, processing them reflectively enough to extract the pattern, and accumulating enough variation to understand which features are essential to the situation type and which are incidental.

This is why expertise development is slow and cannot be shortcut through analytical training. "We may not know how they do this, and we may never be able to bring this skill under conscious control, but we should not ignore or deny it."

## The Cue-Inference Structure: Where Novices and Experts Diverge

The armored platoon study provides the clearest experimental evidence of where expertise lives. Novice and expert observers of the same tactical situation reported noticing the same cues. The divergence was entirely in what they *inferred* from those cues.

"Performance difficulties were not generally the result of inattention to appropriate environmental cues but misinterpretation of the cues' importance."

The expert's schema encodes not just which cues to attend to but what those cues mean causally. Smoke color does not just mean "fire type" in the abstract — it means "if the smoke is this color, the fire is burning these materials, which means the interior will respond to water in this way, which means an interior attack is/is not viable." The cue is embedded in a causal model that chains from observation to tactical implication.

The novice sees the same smoke. They may know, abstractly, that smoke color is relevant. But they lack the causal chain that converts observation into tactical implication. The expert's schema does not just identify important cues — it provides a complete causal interpretation of those cues within the specific operational context.

## The Prototype Abstraction Process

Over many cases, specific memories of individual incidents gradually abstract into prototypes. The expert no longer remembers "that apartment fire on Fifth Street where the roof self-ventilated" as an individual case — they remember the pattern of vertical spread indicating chimney dynamics, which has been confirmed by multiple cases and distilled into a schema feature.

This abstraction process is why "analogical reasoning is reported relatively infrequently by experts, perhaps because the individual cases have often merged into prototypes."

The prototype is more useful than the specific case for routine decision making — it covers a wider range of situations with a single schema. But it loses the specificity of individual cases. When a novel situation arises that shares features with one particular past case but not with the general prototype, the expert may need to retrieve that specific case — which may or may not still be accessible as a distinct memory.

This suggests that expertise development involves a tension between abstraction (which supports efficient routine performance) and case retention (which supports non-routine performance). Optimal expert memory is not purely prototypical — it retains a set of "important cases" as accessible analogues alongside the general schemas.

## Expertise Involves Knowing What Not to Attend To

Attention management is an underappreciated component of expertise. Novices report feeling "overwhelmed with stimuli" because they cannot determine which of the many available signals are relevant.

Expert situation assessment includes an implicit attention filter — a prioritization of which cues are critical for this situation type and which can be safely ignored. "The formulation of a situation assessment includes prioritizing critical cues, helping insure that attention is not diverted to less important cues or events."

This is not simple filtering based on general relevance. It is filtering based on causal relevance within a specific situation type. The nature of roof construction matters enormously when fire is spreading via flame — but is less important when the danger is from smoke. The expert's schema switches the attention filter as the situation type changes.

Novices apply either a uniform attention strategy (attempt to process everything) or a domain-general relevance filter (attend to things that seem fire-related). Neither delivers the situation-specific causal prioritization that expert attention management provides.

## The Expert's Temporal Advantage

One of the most distinctive features of expert situation assessment is temporal depth. Experts reason into the future — they form expectancies not just about the current state but about the likely sequence of future states.

From Study 3, comparing expert instructors (TCIs) to novice students (AOBs): "Overall, the AOBs showed a much weaker inclination to consider hypotheticals. In addition, the more abstract the hypotheticals were, the greater the discrepancy between the number considered by the TCIs versus the AOBs."

The expert's schema does not just classify the current situation — it activates a forward model of how this situation type typically evolves. This temporal depth enables:

- **Proactive action**: Acting to prevent anticipated problems before they materialize, rather than reacting to problems after they emerge
- **Timing optimization**: Klein cites an FGC who "held off ventilating the roof until I could see that the fire was beginning to spread to the attic" — waiting for a specific expected cue rather than acting immediately
- **Expectancy violation detection**: Recognizing when the situation is evolving differently than the schema predicts, signaling a need for reassessment

The novice's lack of temporal depth forces reactive decision making — acting in response to events rather than in anticipation of them. This is slower and less effective even when the individual decisions are equivalently good, because reactive decisions are always behind the action curve.

## Progressive Deepening as Experience-Leverage

Progressive deepening — the mental simulation of how an option would unfold — is only as good as the domain knowledge that drives it. What makes the expert's progressive deepening valuable is not that they imagine the future more vividly, but that their imagination is constrained and guided by accurate knowledge of domain dynamics.

When an expert imagines a rescue approach, they imagine it with accurate models of how victims respond to physical stress, how rescue equipment behaves under load, how team coordination works in confined spaces. When they identify a potential failure mode, it is a plausible failure mode — not a random concern but a known failure mode for this option in this situation type.

The novice imagining the same option will simulate it with less accurate domain models. They may miss real failure modes (because they don't know to look for them) and may worry about implausible failures (because they cannot distinguish likely from unlikely problems). Their simulation is less useful not because they simulate less thoroughly but because their domain model is less accurate.

This is why there is no shortcut to progressive deepening capability. It requires the same experiential base that generates situation assessment schemas — you cannot simulate accurately without knowing how things actually behave.

## Application to Agent System Design

**Expertise Is Structured, Not Just Data**: Building a domain-expert agent is not primarily about providing more data. It is about providing structured situational knowledge — schemas that link cue patterns to (goals, critical cues, expectancies, action queues). Raw information retrieval does not substitute for schema-based situation classification.

**Cue-Interpretation Chains Are the Core Asset**: The most valuable encoding is not "attend to smoke color" but "smoke color → temperature → material type → fire behavior → tactical implication." These causal chains are what convert cue detection into actionable intelligence. Agent knowledge engineering should focus on encoding these chains, not just encoding facts.

**Forward Models for Each Schema**: Each situation type schema should include a forward temporal model — what typically happens next, on what timeline, under what conditions. This enables expectancy generation and temporal reasoning, which are among the most distinctive and valuable features of expert cognition.

**Attention Prioritization as a Schema Component**: Agents operating in information-rich environments should not give equal weight to all available information. Situation-type-specific attention weights — which information sources are critical for this schema, which are irrelevant — should be encoded as part of each schema package.

**Schema Learning Over Time**: An agent system that processes many real cases should gradually abstract individual cases into schema prototypes, while maintaining a library of distinctive cases that can serve as analogues for non-routine situations. This mirrors the expert abstraction process and supports both efficient routine performance and robust non-routine performance.

**Simulating Domain Dynamics, Not Just Logical Possibilities**: Agent progressive deepening requires domain dynamic models — how systems behave, how people respond, how constraints interact — not just logical consequence computation. The difference between a useful forward simulation and an unhelpful one is whether the simulating agent knows how things actually work.