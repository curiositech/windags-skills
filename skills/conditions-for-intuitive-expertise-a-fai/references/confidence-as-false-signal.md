# Why Confidence Is a False Signal — and What to Use Instead

## The Central Paradox

Kahneman and Klein identify what may be the most dangerous systematic error in how intelligent systems — human and artificial — are evaluated and trusted: **subjective confidence is not a reliable indicator of judgment accuracy**.

This is counterintuitive. In everyday reasoning, we treat confidence as informative: we ask "how sure are you?" and calibrate our trust accordingly. In experimental psychology, explicit confidence reporting is a standard measure. In AI systems, confidence scores are ubiquitous outputs. All of these practices assume that the internal signal of confidence tracks something real about the quality of the judgment.

The authors' finding: this assumption is systematically wrong in ways that have predictable failure modes.

"High subjective confidence is not a good indication of validity." (p. 522)

"Subjective confidence is often determined by the internal consistency of the information on which a judgment is based, rather than by the quality of that information." (p. 522)

These two statements together define the problem precisely. Confidence tracks *coherence of information* — how well the available evidence hangs together into a consistent story — not *validity of the conclusion* — whether that coherent story is actually true.

## Three Failure Mechanisms

### 1. The Illusion of Validity

Kahneman's formative experience, described early in the paper, involved assessing Israeli military officer candidates. He and his colleagues felt profound subjective certainty about their assessments of each candidate — a vivid sense of "knowing" how each person would perform. The statistical feedback from officer training school indicated their predictions had negligible validity.

The experience was not unique: the subjective conviction of understanding was not diminished by the statistical evidence of failure. This is the illusion of validity: "the unjustified sense of confidence that often comes with clinical judgment."

The mechanism: when you have rich, consistent, internally coherent information about a case (this candidate was verbal, confident, led his team effectively in field exercises, came from a military family), the information produces a strong narrative. That narrative feels like understanding. The feeling of understanding produces confidence. But the validity of that understanding — whether the narrative actually predicts performance — depends on factors the narrative doesn't capture: what the training environment will demand, how the candidate responds to sustained failure, whether the field exercises measure the same things as officer performance. The narrative is coherent but not predictive. The confidence is real but not earned.

### 2. Heuristic-Generated Confidence

When people (and agents) don't have relevant experience to draw on, they still produce intuitive answers — and those answers come with confidence. The source is not pattern recognition but heuristic substitution.

Frederick's (2005) bat-and-ball problem: "A ball and a bat together cost $1.10. The bat costs a dollar more than the ball. How much does the ball cost?" The immediately compelling answer is 10 cents. It's wrong (the correct answer is 5 cents). What's remarkable is that people not only get the wrong answer but fail to check it even when checking would take seconds. The answer *feels correct*. The confidence is not a signal of correctness — it's a signal of how naturally the wrong answer came to mind.

The anchoring phenomenon demonstrates the same point at scale: an irrelevant initial number systematically biases subsequent estimates by tens of thousands of dollars in real estate transactions and legal settlements — and people confidently deny that the anchor affected them. The confidence in the final judgment is unrelated to whether the judgment was corrupted by anchoring.

Attribute substitution (Kahneman & Frederick, 2002) is the deep mechanism: when faced with a hard question (What will Julie's GPA be?), people automatically substitute an easier question (How impressive is her early reading?), answer that question, and project the answer onto the scale of the hard question. The resulting judgment is confidently held — because the answer to the substituted question was easy to generate. But it's wrong, because it's an answer to the wrong question.

### 3. Redundant Evidence Inflating Confidence

"Evidence that is both redundant and flimsy tends to produce judgments held with too much confidence." 

When multiple pieces of evidence all point the same direction, confidence increases — even if those pieces are all caused by the same underlying factor (and therefore contain no more independent information than a single piece). A clinical assessment where the patient's presenting symptoms, their self-report, their prior history, and their family history all point to the same diagnosis feels extremely compelling. But if all four observations are downstream of the same cause, they contain essentially one piece of information, not four. The diagnosis may be correct, but the confidence it warrants is much lower than the apparent weight of evidence suggests.

In AI systems, this manifests when multiple features in a model are highly correlated — the model assigns high confidence based on the apparent wealth of evidence, when the actual information content is much lower.

## What to Use Instead of Confidence

Kahneman and Klein propose a specific alternative: **evaluate the validity of the environment and the learning opportunity of the judge.**

"The safe way to evaluate the probable accuracy of a judgment (our own or someone else's) is by considering the validity of the environment in which the judgment was made as well as the judge's history of learning the rules of that environment." (p. 522)

This is a structural evaluation, not an introspective one. Instead of asking "how confident are you?" ask:
1. Does this domain have stable, learnable regularities between observable cues and outcomes?
2. Has this judge had adequate practice in this domain with rapid, unambiguous feedback?
3. Are there any wicked feedback loops that might have reinforced wrong patterns?

If the answer to (1) is yes and (2) is yes and (3) is no, then the confidence produced by the expert's judgment is *more likely* to track actual accuracy. But even then, confidence is only weakly predictive of accuracy for any individual judgment — it tells you about the judge's state, not about the world.

## Implications for Agent System Design

### Confidence Scores Are Not Trust Scores

Agent systems routinely output confidence scores (or probability estimates) as a proxy for trust. This paper argues that these scores are unreliable trust signals for the same reasons human confidence is unreliable:

- They track internal consistency (coherence of the model's activations), not environmental validity
- They are subject to the heuristic-generation problem: if the model learned to answer by substituting a tractable proxy for the actual question, it will be confident about the answer to the proxy, not the actual question
- They are inflated by correlated features in ways that don't reflect true information gain

A better design: **decouple confidence from domain-validity metadata**. The agent's output should include:
- Its confidence (coherence signal — what it is)
- The validity class of the domain (what it means)
- The learning opportunity it had (training coverage of this subtask type)
- Whether the query is within its pattern library coverage (is this a recognized situation or an anomalous one?)

### Anomaly Detection as Priority

Since agents cannot reliably distinguish their own skilled responses from their heuristically-generated ones, agent systems need external anomaly detection: a meta-level monitor that flags cases where:
- The current query is substantially different from the distribution of queries the agent was trained on
- The agent's stated confidence is high but its domain validity is low
- Multiple agents processing the same query produce substantially different outputs (disagreement as a validity signal)
- The agent is being asked to operate in a subtask type where its historical accuracy has been poor

### Calibration Testing as a Requirement

Because confidence scores are not reliable validity indicators, agent systems should be evaluated on *calibration*: the degree to which stated confidence levels correspond to actual accuracy rates. A well-calibrated agent that says "0.7 confidence" should be right about 70% of the time on cases where it reports that confidence level.

Calibration testing is a routine engineering practice for probabilistic models but is often omitted for language model agents where output confidence is implicit rather than numeric. Making calibration testing explicit and domain-specific (calibration may be good in high-validity subtasks and poor in low-validity ones) is essential for managing trust appropriately.

### The Pre-Mortem as Confidence Correction

Klein's pre-mortem method — asking a team to imagine the plan has already failed and generate reasons — works precisely because it breaks the confidence-coherence trap. When a plan is under development, all information is filtered through the "we're on the right track" frame. The coherence of the available information produces high confidence. The pre-mortem forces a frame shift: "it has failed" creates a new frame that makes previously filtered disconfirming information suddenly accessible.

For agent systems, pre-mortem equivalents would include:
- Running adversarial agents that assume the current plan is wrong and generate failure modes
- Explicitly querying for conditions under which the current output would be incorrect
- Sampling from the distribution of ways the environment could differ from the agent's assumptions

The goal is not to eliminate confidence but to calibrate it: to ensure that the confidence signal reflects something about the actual probability of correctness, not just the internal coherence of the information the agent has access to.

## The Deeper Point: No Subjective Marker Distinguishes Valid from Invalid Intuitions

The most profound statement in the paper is quiet but devastating: "People have no way to know where their intuitions came from. There is no subjective marker that distinguishes correct intuitions from intuitions that are produced by highly imperfect heuristics."

This is not a statement about human weakness. It is a statement about the architecture of intuitive cognition: the output of pattern recognition and the output of heuristic substitution are phenomenologically identical. Both arrive in consciousness as ready-made answers. Both feel like knowledge. Neither announces its origin.

For agent systems, the analogous statement: there is no internal signal that distinguishes an output generated by genuine pattern recognition in a high-validity domain from an output generated by a heuristic that happened to produce a plausible-sounding answer. Confidence scores do not distinguish them. Fluency of output does not distinguish them. The agent cannot know from inside.

This is why the external, structural approach — evaluating the environment and learning opportunity — is not just better but *necessary*. It is the only approach that reaches past the phenomenology of the judgment to the conditions that determine whether the judgment is trustworthy.