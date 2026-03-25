# The Knowing-Doing Gap: Why Expert Self-Assessment Is an Unreliable Signal of Behavioral Competence

## The Discovery That Changes Everything

The most methodologically important finding in Brimbal et al. (2021) is not in the structural equation model — it is in the pre-training data. Before receiving any training, experienced law enforcement investigators — professionals with an average of 13.59 years on the job and most having conducted between 100 and 1,000 interviews — reported being "moderately familiar" with rapport-building tactics (mean familiarity = 4.35 on a 7-point scale, with rapport-building specifically rated 5.39). They knew what rapport was. They believed they used it. They could talk about it.

And then their actual pre-training interviews were coded by blind, trained, experienced researchers.

Post-training, those same investigators showed effect sizes of d = 1.10 for productive questioning, d = 1.03 for conversational rapport, and d = 0.53 for relational rapport tactics — meaning their actual behavior in recorded interviews improved by one to one-and-a-half standard deviations. These are not modest improvements. These are transformational shifts in behavior, in people who already *believed they were competent*.

This is the knowing-doing gap in its clearest empirical form. It is not a story about ignorant practitioners who didn't know the right approach. It is a story about highly experienced, self-aware practitioners who knew the right approach conceptually and failed to implement it under the pressures of an actual interaction.

## Why Self-Reported Competence Fails as a Predictor

The paper cites Carpenter et al. (2020) and Uttl et al. (2017) to note that "training evaluations typically assess such self-reported learning effects, these evaluations often fail to predict learning or subsequent use of the information" (p. 62). This is a general finding across education and training research: how well someone believes they understand something is poorly correlated with how well they actually perform on tasks requiring that understanding.

Several mechanisms explain why:

**1. Declarative vs. Procedural Knowledge**
Knowing *that* open-ended questions are better is declarative knowledge. Knowing *how* to formulate an open-ended question in the moment, under pressure, while simultaneously managing the conversational dynamic, tracking what has already been disclosed, and monitoring for resistance signals — that is procedural knowledge. The two are stored and retrieved differently, and declarative competence does not guarantee procedural competence. Experts routinely have high declarative knowledge about the correct approach and low procedural fluency in applying it under real-world conditions.

**2. Context Pressure Reverts Behavior to Dominant Response**
When under pressure — time constraints, resistant counterparts, unexpected responses — trained behavior tends to revert to the most well-practiced default. For U.S. law enforcement investigators, the most well-practiced default was the accusatorial approach. Even when they knew intellectually that a rapport-based approach was superior, the pressure of a live interaction with a resistant subject triggered the deeply grooved response patterns of their dominant training.

This is precisely the 20-minute time limit problem in the study: "Interviewers also commented that they wanted more time in their posttraining interviews to both build rapport and gather information" (p. 63). Time pressure pushed behavior toward the familiar even among freshly trained practitioners.

**3. Calibration Failure**
Self-assessment of competence is calibrated against the practitioner's own behavioral repertoire, not against an objective standard. A practitioner who has never experienced truly excellent rapport-building cannot accurately compare their own behavior to that standard. They compare themselves to their peers, to their past self, and to their intuitive sense of what "good" looks like — all of which are subject to the same calibration failures as the practitioner.

**4. Feedback System Corruption**
As discussed in the coercive approach reference document, the natural feedback system for interviewing is corrupted by the absence of ground truth. A practitioner who uses minimal rapport-building and obtains a confession believes they used effective tactics. A practitioner who uses extensive rapport-building and obtains the same confession believes they used effective tactics. Without objective outcome measurement, practitioners cannot distinguish effective from ineffective behavior.

## The Measurement Fix

The Brimbal et al. study design directly addresses the knowing-doing gap by using *behavioral observation by blind coders* rather than self-report as the primary measure of competence. "We designed our study to examine changes in actual behavior as an assessment of learning" (p. 62, emphasis added).

The blind coding system had intraclass correlations ranging from .54 to .98 with an average of .72 — indicating moderate to excellent inter-rater reliability. This is objective behavioral measurement, not self-report. And it revealed a dramatically different picture of competence than self-report would have shown.

The specific tactics coded included items that are typically "more difficult to operationalize (e.g., respect, autonomy)" (p. 61), which showed lower reliability (ICCs < .60) — indicating that even expert behavioral coders struggle to reliably identify when subtle relational tactics are being used. This suggests that the hardest-to-code behaviors are also the hardest to learn, because learners cannot accurately assess whether they are doing them correctly.

## Translation to Agent System Design

**Problem 1: Agents That Self-Report Capability**

Many agent systems include self-assessment components — agents that report their confidence in their outputs, their certainty about their reasoning, or their capability to handle a specific task. If the knowing-doing gap is real for expert humans, it is at minimum as real for AI agents. An agent's confidence in its output is not a reliable proxy for the quality of that output.

**Design Implication**: Do not route high-stakes tasks to agents based primarily on agent self-reported confidence or capability. Route based on behavioral track record — measured outputs compared to ground truth in comparable tasks. Build measurement systems that assess actual output quality against objective standards, not agent confidence scores.

**Problem 2: Systems That Accept Practitioner Self-Assessment as Training Signal**

If a human practitioner's self-assessment of their interviewing skill is unreliable, then a system trained on that practitioner's self-assessments will inherit that miscalibration. This applies directly to any AI system trained on human expert judgment that was itself produced without ground-truth comparison.

**Design Implication**: Training data quality must be assessed against objective outcomes, not practitioner self-report. "This expert said this was correct" is a weaker signal than "this approach produced these measurable outcomes." Build training pipelines that include ground-truth comparison wherever possible.

**Problem 3: Behavioral Regression Under Pressure**

Just as experienced investigators reverted to accusatorial approaches under time pressure despite fresh rapport training, agents that have been prompted or fine-tuned toward one behavioral pattern may revert to earlier, more deeply ingrained patterns when under token budget pressure, latency constraints, or high-complexity task load.

**Design Implication**: Evaluate agent behavior specifically under constraint — not just in ideal conditions. An agent that performs well on a rapport-building interaction with unlimited time and no pressure may perform very differently under a strict latency budget. The constrained-condition performance is the more ecologically valid measure.

**Problem 4: The Calibration Gap in Multi-Agent Systems**

In a multi-agent system, Agent A may assess Agent B's capability based on Agent B's outputs in past interactions. If Agent B's outputs in easy, cooperative contexts were high-quality, Agent A may incorrectly infer high capability for harder, adversarial contexts. This is the same calibration failure that experienced investigators exhibit — assessing competence in easy cases and over-generalizing to hard cases.

**Design Implication**: Maintain separate capability assessments for different difficulty levels and resistance conditions. An agent that performs well on cooperative tasks should not be automatically routed to resistant or adversarial tasks without separate evidence of capability in those conditions.

## The Training Study as a Model for Agent Evaluation

The Brimbal et al. methodology — pre/post behavioral measurement with blind coding against ground truth — is a model for evaluating agent capability improvement:

1. **Pre-assessment**: Measure actual behavioral outputs (not self-report) on a standardized task before any intervention
2. **Intervention**: Apply the training, prompt change, fine-tuning, or architectural modification
3. **Post-assessment**: Measure actual behavioral outputs on a comparable standardized task after intervention
4. **Ground-truth comparison**: Compare outputs against known-truth outcomes (35 scenario facts, in the study)
5. **Blind coding**: Use coders/evaluators who don't know which condition produced which output

This is more expensive than self-report, but it is the only measurement approach that actually captures the knowing-doing gap. The question "does the agent know how to do this?" is the wrong question. The question "does the agent actually do this when the task requires it?" is the right question, and it requires behavioral observation to answer.

## Boundary Conditions

The knowing-doing gap is most severe when:
- The skill requires procedural fluency rather than just declarative knowledge
- Real-world conditions involve pressure, time constraints, or resistance
- The dominant training history supports a competing behavioral pattern
- Feedback systems are corrupted (no clear signal of success vs. failure)
- Self-assessment is calibrated only against similar-competence peers

The knowing-doing gap is less severe when:
- The skill is primarily declarative (retrieving information rather than applying skill)
- Conditions are low-pressure and allow deliberate, slow application of knowledge
- There is no competing dominant response pattern
- Clear, fast, accurate feedback is available

Most of the tasks that matter in high-stakes agent systems fall into the first category: complex, real-world, time-pressured, with corrupted feedback signals. This is precisely where the knowing-doing gap is largest, and where the lesson of this paper is most applicable.