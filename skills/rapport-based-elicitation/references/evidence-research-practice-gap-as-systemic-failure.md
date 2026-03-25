# The Research-Practice Gap as a Systemic Failure: Why Evidence-Based Approaches Fail to Propagate

## The Central Paradox

Brimbal et al. (2021) open with a striking observation: "Policing is unlike many other fields of practice (e.g., medicine) in that historically researchers and practitioners do not consistently collaborate (Weisburd & Neyroud, 2011). As a prominent example, for more than 50 years interviewing techniques have been based on customary knowledge developed through practitioner experience and informed by anecdotal evidence (Hartwig et al., 2014)" (p. 55).

This is a remarkable statement. For fifty years, a domain with enormous consequences — criminal investigation, false confessions, intelligence gathering — operated on practices that were not just unvalidated but demonstrably harmful, while a parallel body of rigorous scientific research was developing superior approaches. And the two streams did not meet.

This is not a story about ignorance. The research existed. The evidence existed. And it still did not propagate into practice. Understanding why this happened — and continues to happen in many complex fields — is one of the most important lessons this paper offers.

## The Mechanisms of Research-Practice Separation

**1. Different Feedback Systems**
Practitioners develop knowledge through anecdotal feedback: they try something, observe the immediate result, and update their practice accordingly. Researchers develop knowledge through controlled experiments with ground-truth measurement. These are fundamentally different epistemologies.

The anecdotal feedback system, as noted in the coercive approach reference document, is corrupted by the absence of ground truth: practitioners cannot distinguish true from false confessions in many cases, cannot measure information yield against a known baseline, and cannot observe the counterfactual (what would have happened with a different approach). The research feedback system specifically addresses these gaps.

But the research feedback system produces knowledge in a form that is inaccessible to practitioners who are not embedded in research culture: peer-reviewed journal articles, statistical models, meta-analyses. These are not the knowledge formats that law enforcement investigators encounter in their daily practice.

**2. The Compelling Alternative Problem**
"Absent a compelling alternative, it has proven difficult to convince law enforcement to alter their tactics, particularly when interviewing resistant subjects" (p. 56). This is not irrationality — it is sensible conservatism. A practitioner who changes an established approach without a clear, demonstrated alternative bears the cost of the change (reduced performance during transition, unfamiliar behavior in high-stakes situations) without confidence in the benefit.

The research literature, even when it demonstrated the superiority of rapport-based approaches, was produced in laboratory settings with student subjects in low-stakes scenarios. Practitioners correctly noted that these conditions don't replicate the full pressure and complexity of real investigative interviews with resistant, high-value subjects. The evidence was there; the *compelling demonstration in the relevant context* was not.

This is precisely what the Brimbal et al. study was designed to provide: evidence that the approach works *with experienced investigators, in realistic scenarios, with genuinely resistant subjects*. The ecological validity of the demonstration matters as much as the quality of the evidence.

**3. The Identity and Tradition Problem**
Accusatorial interrogation was not just a technical approach — it was embedded in law enforcement identity, culture, and professional tradition. Practitioners who were trained in the accusatorial approach, who mentored others in it, and who believed it represented expertise were being asked to conclude that their expertise was wrong. This is an identity threat, not just an information update.

Research that challenges professional identity meets resistance that is not purely epistemic. It requires not just evidence but a face-saving transition path: a way to adopt the new approach that doesn't require explicitly repudiating the old one. The Brimbal et al. training addressed this by emphasizing that investigators already knew rapport tactics (high pre-training familiarity ratings) and were simply learning to use them more systematically — a framing that preserved professional identity while enabling behavioral change.

**4. The Validation Context Mismatch**
"No published research has yet to assess the efficacy of training U.S. law enforcement in an alternative, information-gathering approach" (p. 58) prior to this study. The research base had been built primarily in other contexts (UK PEACE model, laboratory settings, non-U.S. law enforcement). Even with good evidence, practitioners in the U.S. law enforcement context could reasonably argue that their context was different.

Context specificity of evidence is a genuine issue, not just an excuse. Evidence generated in controlled laboratory settings with cooperative student subjects doesn't automatically generalize to field settings with experienced, resistant subjects from different cultural and institutional contexts. The practitioners were, in part, correct — and the appropriate response was to generate the missing context-specific evidence, which is what this study did.

## The "Toolbox" Adoption Problem

The paper cites Snook et al. (2020) on a specific failure mode of partial adoption: "the selective adoption of evidence-based practices often associated with a 'toolbox' approach" (p. 58). When practitioners begin to incorporate evidence-based tactics, they often do so by adding the new tactics as optional tools to an otherwise unchanged approach rather than adopting the underlying philosophy and orientation.

This creates a hybrid approach that has the surface features of evidence-based practice without its substance. A practitioner who adds open-ended questions to an otherwise accusatorial interrogation is not practicing information-gathering interviewing. The questions are open-ended; the underlying orientation — that the goal is to secure a confession, that resistance must be overcome, that the subject's account is inherently suspect — is unchanged. The new tools are deployed in service of the old goals, which fundamentally limits their effectiveness.

The toolbox problem is also a measurement problem. If a practitioner adds rapport-building tactics to an accusatorial approach and the outcome doesn't improve much, they conclude that the evidence-based tactics don't work — when in fact the failure is in the approach, not the tactics. The tactics require the correct underlying framework to be effective, just as a good question requires an appropriate conversational context to elicit a meaningful answer.

## The Training Study as a Solution Model

The Brimbal et al. study represents one model for bridging the research-practice gap:

**Quasi-experimental field design**: Real practitioners, realistic scenarios, ground-truth measurement. Not a laboratory study with students; not a field observation study without ground truth. The combination of ecological validity and measurement rigor is the key innovation.

**Pre/post behavioral measurement**: Assess actual behavior, not self-report, before and after training. This provides evidence of *change* in behavior, not just self-reported learning.

**Mediation modeling**: Demonstrate the causal mechanism (rapport → cooperation → disclosure), not just the association. This gives practitioners a conceptual model for *why* the approach works, which is more useful for sustained adoption than a black-box "it works" finding.

**Pilot iteration**: The study ran a pilot with 11 practitioners before the main study, using their feedback to refine both training content and experimental procedures. This iterative design improves ecological validity and training effectiveness.

**Instructor quality**: "The trainers were two experienced interviewing professionals... who were familiar with both the science and practice of a rapport-based approach" (p. 59). Practitioners respond better to training delivered by people who demonstrate both scientific credibility and practical competence. Pure researchers teaching practitioners, or pure practitioners teaching without research backing, are both less effective than the combination.

## Translation to Agent System Design

**Problem 1: Evidence-Based Agent Design Not Adopted by Practitioners**

AI agent systems face the exact same research-practice gap as law enforcement interviewing. Evidence-based approaches to agent orchestration, prompt design, multi-agent coordination, and failure prevention exist in research literature and are not consistently adopted by practitioners building production systems. The mechanisms are the same: anecdotal feedback loops, identity investment in existing approaches, lack of compelling demonstration in relevant contexts, and toolbox-style partial adoption that preserves the underlying wrong approach.

**Design Implication**: For evidence-based approaches to agent design to be adopted, they must be demonstrated in conditions that practitioners find credible: production-scale systems, real tasks, adversarial or resistant inputs, with ground-truth measurement of outcomes. Laboratory demonstrations on synthetic benchmarks have the same ecological validity problem as the pre-existing rapport research.

**Problem 2: Agent Systems That Don't Learn From Ground Truth**

Many agent evaluation systems use human ratings, self-assessment, or outcome proxies rather than ground-truth measurement. Like the corrupted feedback system in accusatorial interviewing, these systems cannot distinguish genuinely good performance from confident-but-wrong performance. The result is that the system "learns" to optimize for the proxy signal rather than the actual outcome.

**Design Implication**: Build evaluation pipelines that include ground-truth comparison wherever possible. Use blind evaluation (evaluators who don't know which system produced which output). Maintain separate evaluation data that is not used in training to prevent the system from teaching itself to fool its own evaluators.

**Problem 3: The Toolbox Integration Failure**

When organizations add agent capabilities to existing workflows, they frequently add them as optional tools to an otherwise unchanged process — the digital equivalent of the toolbox approach. The existing workflow was designed for human practitioners using conventional approaches. Adding agent capabilities to that workflow, without redesigning the workflow around the agents' actual capabilities and limitations, creates hybrid processes that have neither the reliability of the original human process nor the speed and scale of a well-designed agent process.

**Design Implication**: When integrating agent capabilities into existing processes, the entire workflow must be redesigned around the agent's actual capabilities — not retrofitted with agent tools on top of a human-workflow skeleton. This requires the same kind of fundamental orientation shift (from "how do I add AI to this?" to "how would I design this process from scratch if AI capabilities were available?") that rapport-based interviewing requires relative to accusatorial interviewing.

**Problem 4: The Compelling Demonstration Requirement**

Practitioners (human or AI system designers) will not abandon established approaches without a compelling demonstration that works on the *hardest cases in their specific context*. General evidence from other domains is insufficient. The demonstration must be:
- In the specific type of task that the practitioner finds most challenging
- Under conditions similar to the practitioner's real environment
- With real practitioners or systems (not laboratory stand-ins)
- With ground-truth measurement that proves the outcome was actually better

For AI agent systems, this means that new approaches to orchestration, failure prevention, or information elicitation must be validated on the hard cases: adversarial inputs, resistant sub-systems, edge cases, high-stakes tasks with real consequences. Easy-case demonstrations will not change practice.

## Skill Erosion and Long-Term Maintenance

The paper notes a critical concern about training effects: "it is possible that over time investigators may not maintain the skills they demonstrated in this immediate assessment, as previous research has often observed a decline in training effects following extended periods (e.g., Griffiths & Milne, 2006; Powell et al., 2005)" (p. 64). The training effects were measured immediately after training. What happens six months later is an open question.

This skill erosion pattern is well-documented in practitioner training: without reinforcement, practice, feedback, and institutional support, newly trained skills decay back toward the pre-training baseline. The dominant behavioral pattern reasserts itself under pressure.

For agent systems, the analog is fine-tuning or prompt-conditioning decay: an agent that has been tuned for a specific behavioral pattern may drift toward base model behavior over time, especially if the production environment doesn't maintain the conditions that support the trained behavior.

The implication for both human practitioners and agent systems is that single-point-in-time training is insufficient for sustained behavioral change. Ongoing reinforcement, feedback, and measurement are required to maintain performance against the dominant competing pattern.