# The Expertise Gap: Why Experts and Novices Notice the Same Things But See Different Worlds

## The Surprising Finding

One of the most important empirical findings in the Klein and Calderwood research — and one that runs counter to common assumptions — is that novices and experts pay attention to the same cues. In the armored platoon command study (Study 3), researchers compared the cues and knowledge reported by novice tank platoon leaders with those reported by experienced instructors who observed the same situations. The result: "The contextual cues and areas of knowledge students reported in their decision accounts were very similar to information offered by the instructors."

The conventional wisdom would predict a perceptual gap: experts notice more, or notice different things. The research found otherwise. The gap is not perceptual. It is inferential.

"Performance difficulties were not generally the result of inattention to appropriate environmental cues but misinterpretation of the cues' importance." (p. 37)

Both expert and novice see the same smoke. The expert knows what it means; the novice does not.

## The Structure of the Inferential Gap

The research identifies the inferential gap with precision. Novices struggle most with abstract hypotheticals — possible alternative future states that require reasoning beyond the immediately observable. In the platoon command study:

- Concrete hypotheticals (what happens to my own tank) were manageable for novices
- Abstract hypotheticals (what happens to platoon coherence, enemy response, communications, friendly support) showed the greatest expert-novice divergence

"The more abstract the hypotheticals were, the greater the discrepancy between the number considered by the TCIs versus the AOBs." (p. 37)

This is a specific, structured gap. Novices can reason about immediate, local, concrete consequences. They struggle with delayed, distributed, abstract consequences. Experts carry causal models that extend further in time and space from the immediately observable.

## Why the Same Cue Means Different Things

The key to understanding the inferential gap lies in the structure of expert knowledge. When an experienced fireground commander sees yellowish smoke under pressure from a window frame, they do not just perceive "yellowish smoke under pressure." They perceive an entire constellation of implications:

- The yellow color indicates high temperature combustion (probably above 1100°F)
- The pressure indicates the fire is in an enclosed space with no ventilation
- These combined indicators suggest the fire may be approaching flashover conditions
- Flashover implies imminent danger to any personnel inside
- Standard procedure (ventilation + interior attack) may need to be modified or abandoned

The cue is a node in a rich causal network. Perceiving the cue activates the network, which activates implications, which constrains goals, which suggests actions. The novice perceives the same cue but does not have the network — or has only a shallow version of it. "Yellowish smoke" is just yellowish smoke.

This is why Klein and Calderwood found that "whereas experts and novices notice the same cues in a situation, novices draw fewer inferences based on these cues." (p. v) The inference is not a second cognitive step that follows perception — it is part of what it means to perceive the cue as an expert. The cue is constituted differently by its network of implications.

## Analogues: The Double-Edged Sword of Experience

The research found that analogical reasoning — connecting the current situation to a previous experience — is infrequently reported by experts, and when it occurs, it is often largely automatic and unconscious. Experts do not consciously think "this reminds me of the Wentworth building fire in 2003." The reminding, if it happens, is typically absorbed into the recognition process without surfacing explicitly.

When analogues do surface explicitly, it is often in non-routine cases — situations where the expert's normal prototypical pattern-matching doesn't produce a confident classification. In these cases, an explicit analogical comparison becomes a tool for figuring out what kind of situation this is.

But analogues in novices work differently — and dangerously. "Novices appear to rely more heavily than experts on analogical reasoning, but have not learned how to apply the analogues, modify them, or reject them. Therefore almost half the analogue use by novices results in poor choices." (p. 39)

The problem is transferability. An analogue is useful only if the decision-maker can correctly identify which features of the comparison case transfer to the current situation and which do not. This requires exactly the kind of rich causal understanding that constitutes expertise. Without that understanding, analogical reasoning applies the wrong lessons, misses the important differences, and leads systematically to error.

The research finding: "Inappropriate analogues are a primary cause of errors." (p. vi)

This is a profound point for agent system design. An agent that retrieves similar past cases and applies their solutions is doing analogical reasoning. The quality of this reasoning depends entirely on the agent's ability to assess which features of similarity are causally relevant. Naive similarity matching — treating similarity as a simple feature overlap — will frequently surface inappropriate analogues and generate errors.

## The Development of Expertise: From Options to Assessment

One of the clearest patterns in the research is the developmental arc from novice to expert. Novices focus on option evaluation; experts focus on situation assessment. "Experienced decision makers come to rely more on situation assessment, while novices rely more on option evaluation strategies." (p. v)

This is counterintuitive. We might expect novices to struggle with evaluation (they don't know how to assess options) while experts have mastered it. What Klein and Calderwood found is the opposite: with experience, decision-makers shift their cognitive investment away from evaluation and toward classification. As the classification becomes more reliable, the evaluation becomes less necessary — because a correctly classified situation essentially selects its own response.

The developmental path is:
1. **Novice**: Observe cues → struggle to classify situation → generate options → compare options (poorly)
2. **Intermediate**: Observe cues → classify situation with some accuracy → generate first option → evaluate (serially)
3. **Expert**: Observe cues → classify situation with high accuracy → retrieve typical response → simulate (quickly)

The shift is not from "less skilled evaluation" to "more skilled evaluation." It is from "evaluation-centric cognition" to "assessment-centric cognition." Experience does not improve the evaluation step — it reduces the dependence on it.

## Implications for Agent Training and Architecture

### Building Inferential Richness, Not Just Pattern Coverage

The primary lesson of the expertise gap for agent systems is this: the limiting factor is not perceptual coverage (what features the agent can observe) but inferential richness (what implications the agent can draw from those features). Building expert-level agents requires building rich causal networks that connect observations to their downstream consequences.

Concretely, this means:
- Each feature should be accompanied by its causal implications — not just "what this feature typically correlates with" but "what this feature causally implies about the situation's state and likely development"
- Inferences should extend across multiple time steps — not just immediate consequences but delayed, distributed, abstract consequences
- The causal network should be domain-specific and experience-calibrated — not generic inference but inference trained on the specific domain's dynamics

### Detecting the Expertise Level of Each Agent

In a multi-agent system, different agents will have different levels of expertise in different domains. The research suggests that novice-mode and expert-mode agents should be used differently:

- **Expert-mode agents** should be given primary decision authority in their domain, with minimal requirement to justify or explain their choices (since their expertise is in recognition, not articulation)
- **Novice-mode agents** should be given more structured decision support — explicit option generation, evaluation frameworks, relevant analogues with careful qualification of which features transfer

Crucially, the research warns against forcing expert-mode agents to use novice-mode evaluation frameworks: this impairs their performance by preventing them from using their recognitional capabilities.

### Analogue Retrieval Requires Transfer Assessment

Any agent that uses case-based reasoning (retrieving similar past cases to inform current decisions) must also have a mechanism for assessing which features of the analogous case actually transfer to the current situation. Without this, the system will systematically generate inappropriate analogues — and the research shows that inappropriate analogues are a primary cause of errors.

Transfer assessment requires causal understanding: "is the similarity between these cases based on features that are causally relevant to the decision, or just surface features?" This is a high-level cognitive capability that requires exactly the kind of domain expertise that makes analogical reasoning useful in the first place.

The practical implication: analogical retrieval should be treated as a hypothesis-generation step, followed by explicit validation of whether the key causal features of the analogue case are present in the current situation. Simply retrieving the most similar case and applying its solution is insufficient.

### The Gap Between Knowing and Inferring

Perhaps the deepest lesson from the expertise research is this: the gap between novice and expert is not primarily a gap in what is known. It is a gap in what is inferred. Novices often know the relevant facts; they cannot derive their implications. Experts do not know more facts — they know more about what facts mean.

For agent systems, this means that knowledge bases and training data are necessary but not sufficient. What matters is the inferential structure built on top of that knowledge: the causal models, the prototype structures, the expectancy schemas that transform observed facts into understood situations. This inferential structure is what expertise actually consists of, and it is what makes expert cognition qualitatively different from novice cognition rather than just quantitatively better.