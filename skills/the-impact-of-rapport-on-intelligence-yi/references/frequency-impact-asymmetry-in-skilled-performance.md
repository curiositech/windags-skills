# The Frequency-Impact Asymmetry: Why What Practitioners Do Most Is Not What Works Best

## The Core Observation

In the Nunan et al. (2020) study, the three components of rapport are used at very different frequencies:
- Attention: M = 24.77 behaviors per interaction
- Positivity: M = 12.21 behaviors per interaction
- Coordination: M = 10.12 behaviors per interaction

But their impact on intelligence yield is:
- Attention: explains 69% of variance
- Coordination: explains 5% of variance
- Positivity: explains 4% of variance

The most used behavior is the most impactful. But the second most used behavior (positivity) is the least impactful, while the least used behavior (coordination) is the second most impactful. The rank ordering of frequency does not match the rank ordering of impact, except coincidentally for attention.

This frequency-impact asymmetry is not specific to police intelligence interviews. It is a general feature of skilled performance in complex domains, and understanding its structure has implications for how agent systems should be designed, optimized, and evaluated.

## Why Frequency and Impact Diverge

Several mechanisms drive the divergence between how often practitioners use a behavior and how much impact it has:

**Mechanism 1: Social automaticity vs. deliberate deployment**

Positivity behaviors (friendliness, warmth, humor, empathy) are socially automatic — they are the normal texture of cooperative human interaction. They require no special training to produce, and they are continuously reinforced by normal conversational feedback (warmth generates warmth, humor generates laughter). Their high frequency reflects this automaticity, not a deliberate allocation of effort toward high-impact behaviors.

Attention behaviors require more deliberate deployment (paraphrasing requires comprehension and reformulation; probing requires identifying what is missing; exploring motivation requires asking a potentially sensitive question). Their high frequency reflects deliberate training and professional commitment to information-gathering, not automaticity.

Coordination behaviors require the most deliberate, counter-habitual action (not filling silence, explicitly inviting account, stopping to explain procedure). Their low frequency reflects the cost of suppressing automatic social behaviors to implement the required structure.

**Mechanism 2: Impact lag and attribution difficulty**

The impact of positivity on long-term relationship health may be real but delayed and diffuse. A friendly interaction maintains the CHIS's willingness to continue engaging across many future interactions. This impact does not show up in the same-interaction yield correlation because it operates on a different time scale. Practitioners who observe that their CHIS continue to engage attribute this (plausibly) to the friendliness they display — reinforcing their belief that positivity is high-impact.

The impact of attention behaviors is immediate and visible within the interaction — probing a claim retrieves more detail right now. This makes attention's causal role in yield more visible and learnable from direct experience.

Coordination's impact may be similarly distributed across time — a well-established process understanding reduces friction across multiple interactions. But the diffuse temporal pattern makes coordination's causal contribution hard to observe and learn from.

**Mechanism 3: Training emphasis**

The paper notes that "discussions of rapport typically place the most emphasis on positivity." Training emphasis shapes behavior: what gets trained gets done. Practitioners who have been trained that rapport means warmth, empathy, and personal connection will deploy these behaviors more deliberately and consciously than they deploy behaviors that their training did not emphasize.

This creates a feedback loop: low-impact behaviors get trained because they are intuitively associated with rapport; high training emphasis increases their deployment; frequent deployment confirms their association with rapport (because rapport-as-concept is frequently present alongside these behaviors); this reinforces future training emphasis on these behaviors.

## The General Pattern: What This Looks Like in Other Domains

The frequency-impact asymmetry appears across many skilled performance domains:

**Medical diagnosis**: Physicians ask questions that patients commonly raise (chief complaint, symptom history) more frequently than they probe for what patients haven't thought to mention (medication interactions, lifestyle factors, psychosocial context). The frequently asked questions retrieve commonly presenting information; the infrequently probed areas often harbor the diagnostic key. Experienced diagnosticians report that their most important diagnostic questions are often the ones they had to train themselves to ask (Groopman, *How Doctors Think*).

**Software code review**: Reviewers most frequently flag style issues, obvious bugs, and missing documentation — things that are visually salient and socially safe to raise. They less frequently examine security edge cases, performance under load, or system-level interaction effects — things that require deeper reasoning and may require challenging architectural decisions. The high-frequency review behaviors catch the easily visible; the low-frequency behaviors catch the critical.

**Academic peer review**: Reviewers comment most frequently on presentation, clarity, and technical execution. They comment less frequently on the fundamental validity of the research design or the robustness of the central claims. Presentation comments are easy to make and easy for authors to address; fundamental validity challenges are expensive to make and receive pushback. The high-frequency feedback addresses the least important dimension of research quality.

**User interface testing**: Testers frequently test the primary user flows (onboarding, core use case, settings). They less frequently test edge cases, error states, and recovery behaviors. The primary flows were designed with attention and are usually robust; the edge cases were designed as afterthoughts and harbor most of the failure modes.

## The Implications for Agent System Design

### Implication 1: Optimize against impact, not frequency

Agent systems often develop implicit behavioral policies that reflect training data frequency — they do what appears most commonly in examples of successful performance. But if the training examples reflect the frequency-impact asymmetry (humans performing well despite misallocating behavior frequency), then optimizing against frequency will reproduce the misallocation.

Explicitly measure impact (variance explained in outcomes) for behavioral components, and weight optimization signals against impact rather than frequency. A behavior that appears infrequently in training examples but consistently in high-performing interactions should receive more weight in optimization than a behavior that appears frequently but correlates weakly with outcomes.

### Implication 2: Design for costly behaviors, not just natural ones

Agent systems trained primarily on human-generated examples will inherit human behavioral tendencies — including the tendency to over-deploy socially automatic behaviors and under-deploy cognitively costly ones. Deliberate design is required to counteract this:

- Build in explicit probing behaviors that the system must execute before proceeding (the agent equivalent of the attention probe)
- Build in explicit pausing behaviors (waiting for complete output before redirecting)
- Build in explicit coordination behaviors (goal confirmation, process explanation) that do not occur naturally in human-modeled conversation

### Implication 3: Monitor the distribution, not just the presence

A system can have all three rapport components present (attention, positivity, coordination) while deploying them in proportions that produce suboptimal outcomes. Monitoring presence ("did the agent use paraphrasing?") is insufficient — the distribution matters. 24.77:12.21:10.12 (attention:positivity:coordination) may be approximately right for the source handler context; a different distribution might be right for different agent contexts.

Establish target distributions for behavioral components based on their impact-to-frequency ratios in your specific context, and monitor against those distributions rather than just presence/absence.

### Implication 4: Audit for the under-deployed high-impact behaviors

Design audit processes that specifically look for the under-deployed high-impact behaviors — the equivalent of coordination in the source handler context. Ask: what are the behaviors in this domain that have high empirical impact but low deployment frequency? These are the behaviors most likely to be missing from current performance and most likely to produce yield improvements if added.

For WinDAGs skills:

- **Code review**: High-impact/under-used — security edge case analysis, input validation assumptions, system interaction effects
- **Document analysis**: High-impact/under-used — provenance verification, author bias identification, what-was-not-said analysis
- **Architecture design**: High-impact/under-used — failure mode enumeration, assumption documentation, reversibility analysis
- **Task decomposition**: High-impact/under-used — goal conflict identification between sub-tasks, integration risk assessment, shared-resource contention analysis

## The Training Trap

The paper's training recommendation is pointed: behavioral specificity enables training, while holistic impression does not. But there is a deeper training trap: training programs that emphasize what practitioners already do will have high completion rates and participant satisfaction but will not change behavior where it matters most.

Training that tells practitioners "be warm, empathetic, and friendly" confirms what they already know and already do. Training that tells practitioners "specifically, add more paraphrasing, more probing questions, more explicit pauses, more process explanation — and reduce friendly affirmations that pad the interaction without driving yield" is training against the grain of natural tendency. It will be more effortful, less satisfying, and initially produce interactions that feel less natural.

But it is the training that changes outcomes.

For agent system improvement: the highest-leverage improvements are typically not in the behaviors that already occur at high frequency. They are in the behaviors that have high impact, low current frequency, and high cognitive cost — precisely the behaviors that the system's automatic tendencies most suppress.

## Establishing Baseline and Target Distributions

The Nunan et al. data provide a baseline: for real-world source handler / CHIS telephone interactions averaging 7 minutes, the attention:positivity:coordination distribution is approximately 24:12:10 (roughly 2.4:1.2:1 by frequency), and this produces a mean intelligence yield of 87.26 details.

With attention explaining 69% of variance and coordination explaining 5%, the target distribution should increase attention relative to positivity, with coordination maintained at minimum sufficient levels. The research does not specify the optimal distribution — that would require experimental manipulation rather than correlational analysis — but it strongly implies that shifting from a 24:12:10 distribution to something like 30:8:12 (increasing attention and coordination, reducing positivity) would improve yield.

For agent system design: establish empirical baselines for behavioral distributions in your specific skill context, measure their correlations with outcome quality, and design target distributions that reflect the impact-weighted analysis rather than the naturally-occurring frequency distribution.

## Summary

The frequency-impact asymmetry — where the most deployed behaviors are not the most impactful — is a systematic feature of skilled performance in complex social domains. It arises from social automaticity (low-effort behaviors are over-deployed), impact lag (relationship-maintenance behaviors have delayed effects), and training emphasis that confirms existing intuitions rather than challenging them. For agent systems, this implies: optimize against measured impact rather than training frequency, explicitly design for cognitively costly high-impact behaviors, monitor behavioral distributions rather than just presence, and audit specifically for the under-deployed high-impact behaviors that are most likely to be missing. These are the interventions that change outcomes, precisely because they are counter-intuitive and counter-habitual.