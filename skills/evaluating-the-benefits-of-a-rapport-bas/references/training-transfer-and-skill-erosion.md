# Training Transfer and Skill Erosion: What the Study Reveals About Behavioral Change in Expert Systems

## The Central Challenge of Training Transfer

The Brimbal et al. (2021) study is, at its core, a study of training transfer: does the knowledge and skill acquired in a two-day training program actually change behavior when practitioners face real interactions under real conditions? This question is fundamental not just to human training programs but to any system — agent, human, or institutional — that attempts to improve its behavioral repertoire through deliberate intervention.

The study demonstrates robust training transfer for two of three skill categories: large effect sizes (d = 1.10 for productive questioning, d = 1.03 for conversational rapport) indicate that trained investigators showed dramatically improved behavior compared to their pre-training baseline. Relational rapport showed a smaller but significant effect (d = 0.53).

But the study also acknowledges the key limitation: "it is possible that over time investigators may not maintain the skills they demonstrated in this immediate assessment, as previous research has often observed a decline in training effects following extended periods (e.g., Griffiths & Milne, 2006; Powell et al., 2005)" (p. 64). The post-training interviews were conducted *immediately* after training. Six-month retention data was not collected due to funding limitations.

This is the skill erosion problem: gains made through training decay over time without reinforcement, and the decay rate is faster when the trained behavior competes with a deeply ingrained dominant response pattern.

## Why Skill Erosion Occurs

**1. The Dominant Response Pattern Reasserts Itself**

When investigators were trained in rapport-based tactics, they had to suppress their dominant behavioral pattern (accusatorial approach, built through years of practice and reinforced by their occupational identity) in order to perform the trained behavior. Suppression of a dominant response requires active effort and degrades under pressure and reduced attention.

As the training recedes in time and the everyday occupational environment reinforces the dominant pattern, the new behavior becomes increasingly effortful to maintain and the dominant pattern becomes increasingly effortless. Without reinforcement, the ratio shifts back toward the original baseline.

Griffiths and Milne (2006), cited in the paper, found "both a significant increase in the use of good tactics and that the use of these tactics transferred to the real world, with some degree of skill erosion over time" (p. 57). Walsh and Milne (2008) found "no significant improvement in the use of rapport-building skills" in a PEACE training evaluation — suggesting that in some conditions, skill erosion was complete.

**2. Feedback Deficit in the Transfer Environment**

In the training environment, there is immediate, specific feedback: trainers observe practice interviews and provide corrective guidance. In the field, this feedback is absent. Practitioners cannot easily evaluate whether their rapport-building is working (since perceived rapport is not directly observable) or whether their questioning structure is optimal. The feedback system that reinforced learning during training is absent in the transfer environment.

**3. The Transfer Context Differs from the Training Context**

The training interviews in the study were conducted in standardized, controlled conditions with community members playing scripted roles. Real field interviews involve unpredictable counterparts, time pressure from competing case demands, organizational oversight, legal constraints, and occupational stakes that the training context cannot fully replicate. As the transfer context diverges from the training context, the trained behavior may not trigger appropriately, and the dominant response pattern fills the gap.

**4. Organizational Support or Lack Thereof**

If the organizational culture, supervision, and incentive structure don't support the new approach, individual practitioners face social pressure to conform to the organizational norm. A practitioner who was trained in rapport-based interviewing but returns to a unit where accusatorial approaches are valued, reinforced by peers, and modeled by supervisors will face constant pressure to revert.

## The Pilot Study Iteration Model

The Brimbal et al. study ran a pilot with 11 practitioners before the main study: "Feedback from this sample of investigators allowed us to improve both the training content (e.g., which topics to spend more time on to ensure effective comprehension) and the format of practical exercises (e.g., which exercises were most helpful, what topics might require more practice and feedback from instructors)" (p. 58).

This iterative design process — deploy, measure, diagnose failure points, revise, redeploy — is directly applicable to agent system training and improvement. The pilot data showed that relational rapport-building tactics were not significantly improved by the initial training design (non-significant effect in pilot: t(10) = 1.02, p = .33, d = .31). This diagnostic led to modifications in the training that produced a significant improvement in the main study (d = .53). Without the pilot measurement and iteration, the main study would have replicated the same training failure.

## Translation to Agent System Design

**Problem 1: Immediate Post-Training vs. Long-Term Retention**

AI agent systems that are fine-tuned or prompt-conditioned for specific behavioral patterns may show robust performance on immediate post-training evaluations but decay toward base behavior over time, especially when:
- The trained behavior competes with a strong prior in the base model
- Production inputs diverge from training inputs
- The evaluation environment provides insufficient signal to maintain the trained behavior

**Design Implication**: Evaluation at training time is not sufficient. Implement ongoing behavioral monitoring that tracks the agent's actual behavioral pattern over time, with specific attention to the behaviors most likely to regress: the hardest-to-code, most context-sensitive behaviors (analogous to relational rapport tactics in the study — the lowest d in the training, the most difficult to maintain).

**Problem 2: The Missing Feedback Loop**

In the training environment, there is rich feedback. In the deployment environment, there may be none. An agent system that was trained with explicit feedback on specific behavioral dimensions will not automatically generate equivalent feedback in production.

**Design Implication**: Build production monitoring that tracks the behavioral dimensions identified as most important during training. For interrogation training, the important dimensions were: open-ended vs. closed-ended question ratio, use of affirmations and reflections, autonomy-supporting vs. directive language, and relational rapport tactics. For agent systems, the analogous dimensions depend on the task, but should be explicitly identified, operationally defined, and monitored in production — not just during evaluation.

**Problem 3: The Transfer Context Gap**

Agent systems evaluated on benchmark tasks may show excellent performance that fails to transfer to production tasks if the production context differs significantly from the evaluation context. This is the agent-system analog of the training-to-field transfer problem.

**Design Implication**: Evaluation environments should be designed to match production conditions as closely as possible — including realistic time constraints, realistic input distributions, realistic interaction partner behavior (including resistance and adversarial inputs), and realistic stakes. Evaluation on simplified, cooperative, standardized inputs will overestimate performance in the realistic context.

**Problem 4: Organizational Environment Effects**

A well-trained agent deployed into an organizational workflow that doesn't support its trained behaviors will be modified over time — through prompt changes, workflow constraints, organizational policies, or user interactions — to conform to the dominant organizational pattern. This is the agent-system analog of the investigator returning to an organizationally unsupportive environment.

**Design Implication**: Assess organizational alignment before deployment. If the organizational workflow, user expectations, and governance structure don't support the agent's trained behavioral pattern, either modify the organizational context (the harder path) or acknowledge that the deployment will not maintain trained performance and adjust expectations accordingly.

## The Three-Cohort Design and Its Lesson

The study's three training cohorts across different locations introduced natural variation: "Neither cohort nor scenario yielded significant effects on key outcome variables" (p. 61). This is a positive finding — training effects were consistent across different practitioner populations and locations, suggesting generalizability of the approach.

But the multi-cohort design also reveals something important: the same training program can be delivered to different populations in different contexts and produce consistently good results only if the training design is sufficiently robust and well-specified. The two trainers were "experienced interviewing professionals... familiar with both the science and practice of a rapport-based approach" (p. 59). Trainer quality is a variable in training effectiveness, and variable trainer quality will produce variable training outcomes.

For agent system design: this is the analogy of deployment variability. A well-specified agent system with high-quality training can be deployed across different organizational contexts and produce consistently good results — but only if the deployment environment is sufficiently controlled and the deployment process is sufficiently well-specified. Variable deployment conditions produce variable performance, even with a robust trained system.

## What the Study Couldn't Measure and Why It Matters

The study explicitly acknowledges several important limitations:

- No no-training control group (randomization not feasible given practitioner recruitment)
- No long-term follow-up (funding constraint)
- 20-minute time limit on interviews (investigators wanted more time)
- Community members, not actual criminal suspects
- Memorized scenario information, not lived experience

Each of these limitations represents a gap between the study context and the real-world context. The gap is not fatal to the study's conclusions — the training effects are large enough to be meaningful even with these limitations — but it represents uncertainty about the magnitude of effects in real-world deployment.

For agent systems, this is the model for honest capability assessment: identify the gaps between evaluation context and production context, quantify the uncertainty they introduce, and report performance claims with appropriate confidence intervals rather than point estimates. An agent system evaluated on benchmark tasks should report performance claims that are explicitly conditioned on the similarity between benchmark conditions and production conditions.

## The Synthesis: What Robust Behavioral Change Requires

Pulling together the lessons from this study:

1. **Behavior must be measured, not self-reported**: Assess actual behavioral outputs against objective standards
2. **Training must address the full skill stack**: Foundation first (productive questioning), then conversational layer, then relational layer — in order
3. **Transfer environment must be realistic**: The training context must approximate the deployment context or transfer will be incomplete
4. **Feedback must be maintained post-training**: Without ongoing feedback, trained behavior decays toward the dominant prior
5. **Organizational support is necessary but not sufficient**: The organizational environment must be aligned with the trained behavior or deployment will erode it
6. **Iteration is essential**: Pilot → measure → diagnose → revise → redeploy is more reliable than single-shot training
7. **Long-term retention must be assessed separately**: Immediate post-training performance is a poor proxy for long-term behavioral change

These seven conditions apply equally to human practitioner training and to AI agent system development. The study documents a case where several of these conditions were met (full skill stack, realistic scenarios, behavioral measurement, experienced practitioners) but others were not (long-term retention, organizational integration, field transfer). The result was strong training effects that may or may not persist in production.

The honest conclusion: demonstrated robust immediate training transfer with uncertain long-term field retention, and a clear specification of what would be needed to close that uncertainty gap. This is the appropriate epistemic stance for any training study, and it is the appropriate epistemic stance for any agent capability claim.