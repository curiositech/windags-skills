# Expertise Is Domain-Specific: What This Means for Agent Specialization and Routing

## The Domain-Specificity Principle

One of the most robust findings in expertise research, and one that Wilson treats as foundational 
to her entire framework, is that expertise is domain-specific. Farrington-Darby and Wilson 
(2006: 18) state this directly: "experts may be found amongst those accomplished in processes 
such as decision-making," but expertise in one domain does not transfer automatically to another.

This finding has important implications that are frequently violated in practice. Wilson identifies 
a common failure mode in the mediation profession: "Trained mediators subsequently claiming 
expertise may not distinguish clearly — if at all — between their experience as a mediator and 
their achievements in their discipline of origin (typically law, psychology, mental health, social 
science and so forth). As a result, their mediation skills may be viewed simply as adjuncts to 
their primary professions" (p.3-4).

The problem here is category confusion about what skill is actually being claimed. A lawyer 
with twenty years of experience is genuinely expert in law. That expertise does not automatically 
transfer to mediation, which is a distinct skill domain requiring its own ten thousand hours of 
deliberate practice (Ericsson, 2006a: 689). Conflating the two produces practitioners who are 
confident, credentialed, and incompetent in the domain they think they're operating in.

More pointedly: "it is therefore probable that at least some practitioners promoting themselves 
as expert mediators do not actually possess mediator expertise; however, this critique is valid 
only if one accepts the profession-specific nature of expertise" (p.4).

The last clause is important. The entire critique of false expertise claims depends on accepting 
that there is such a thing as domain-specific mediator expertise distinct from general 
professional competence. Wilson accepts this claim and builds her entire framework on it. 
If you believe expertise is a general cognitive attribute, the MELI methodology makes no 
sense. If you believe it is domain-specific and built from thousands of hours of domain-specific 
deliberate practice, it becomes essential.

## The Ten-Year Threshold and What It Implies

Ericsson's finding that expert practice "typically takes ten years to achieve, regardless of the 
field" (2006a: 689) is cited by Wilson as a baseline for understanding mediator expertise. But 
the implication goes beyond just the time required. The *structure* of what happens during 
those ten years matters.

Wilson distinguishes expertise sharply from experience accumulation: "expertise comes from 
the analysis of the experienced profession or discipline and the application of this analysis to 
future practice" (p.1). Mere experience — doing a thing repeatedly — is not sufficient. 
The deliberate analysis of what worked and why, followed by modification of practice, is what 
transforms experience into expertise.

This is consistent with what Ericsson calls "deliberate practice" — practice that is specifically 
structured to push performance beyond current limits, with feedback mechanisms that reveal 
gaps. A mediator who handles fifty cases a year for twenty years but never analyzes why some 
sessions reach agreement and others don't is accumulating experience without building expertise.

The practical implication: time in a role is not evidence of expertise. Case volume is not 
evidence of expertise. The presence of deliberate analysis — of systematic engagement with 
failure and success and theory — is the marker.

## The Credential-Expertise Gap

Wilson is pointed about the gap between credentials and expertise in mediation training: 
"being a mediation trainer or CPD provider does not make someone an expert mediator, nor 
is expertise necessarily evidenced by qualifications which are only skills-based" (p.6).

This is a structural critique: the credentialing systems in mediation (and by extension, in many 
professional domains) validate surface competence rather than deep expertise. Training courses 
"typically require attendance for somewhere between eight to ten days" (p.4) and assess 
"skills and substantive knowledge, with little attention to conflict theory" (p.5). The result is 
practitioners who have been trained to *look like* mediators without having developed the 
genuine domain expertise that would make them effective.

The credential-expertise gap has a particular form: it is most dangerous in domains where 
performance is hard to measure. In high-stakes, objectively evaluated domains (surgery, 
chess, software engineering where code either works or it doesn't), incompetence tends to be 
surfaced. In domains where outcomes are ambiguous, contested, or slow to manifest, 
credential-holding incompetents can persist indefinitely.

Referral systems make this worse: "recognised expertise is not the automatic basis of referral 
to a particular mediator; referrals sometimes reflect a practitioner's reputation for providing 
a certain type of work, self-promotion, previous or anticipated connections with the referrer, 
or economic, geographic or other factors that are not necessarily evidence that the mediator 
is an expert" (p.11).

This is a market failure analysis. The signals that determine who gets hired (reputation, 
connections, self-promotion) are imperfectly correlated with actual expertise. The market 
for expert judgment is not efficiently calibrated.

## The "Natural Mediator" Question and Its Implications

Honeyman's (1988) observation that road training "worked adequately only for people 
naturally inclined toward mediation" raises a deep question that Wilson handles carefully. 
Are there natural mediators — individuals with innate qualities that make them more likely 
to develop expertise in this domain?

Wilson's answer is nuanced: "the development of expertise is therefore likely to be the 
product of complex interactions between person and place" (Farrington-Darby and Wilson, 
2006: 20, cited on p.11). Neither pure nature nor pure nurture.

Baitar et al.'s (2012) research finding that "dispute resolution professionals should shift from 
traditional adversarial and reserved professional attitudes toward behaviors that convey more 
warmth, authenticity, and caring" (p.9) is cited as evidence that some qualities underlying 
expert performance "are not necessarily susceptible to development or transfer through training." 
This is a significant claim: some components of expertise in relational domains may be 
personality-dependent in ways that training cannot fully compensate for.

This doesn't mean training is useless — it means the components of expertise are heterogeneous. 
Some can be taught (Honeyman's six elements: investigation, empathy, persuasion, invention, 
distraction, substantive knowledge), while others are more strongly shaped by innate disposition.

## Application to Intelligent Agent Systems

### Agent Specialization Is Not Optional

The domain-specificity principle maps directly onto agent architecture: **a general-purpose 
agent operating across domains will systematically underperform domain-specialized agents 
in those domains**. This is not just a capability claim — it is a structural claim about how 
expertise is organized.

A single agent that handles legal reasoning, emotional support, technical debugging, and 
creative writing is, in Wilson's terms, a practitioner claiming expertise in mediation on the 
basis of experience in law and psychology. The skills are related but distinct, and the 
generalizations from one domain will systematically fail in the specific demands of another.

This argues for:
- Specialized agents developed with domain-specific training data and evaluation criteria
- Routing systems that can accurately identify domain-specific task requirements and 
  match them to appropriate specialized agents
- Explicit separation of "background domain knowledge" (what a legal expert brings) 
  from "operational skill" (how to perform mediation)

### The Credential-Expertise Gap in Agent Systems

Agent systems face their own version of the credential-expertise gap. A model that scores 
highly on a benchmark may have learned to perform well on the *types of cases* that appear 
in benchmarks without developing genuine competence in the underlying domain. Benchmark 
performance is the computational analog of a training certificate.

The Wilson framework argues that genuine capability assessment requires:
- Evaluation on genuinely novel cases (the equivalent of non-rehearsed MELI incidents)
- Probing of decision processes, not just outcomes
- Comparison with what a less capable system would do (the Pass 4 novice comparison)
- Assessment in conditions where the "market signals" (human rater agreement, 
  fluency, confident tone) don't substitute for actual correctness

### Routing as Domain Recognition

If expertise is domain-specific, then intelligent routing is fundamentally a problem of domain 
recognition: accurately identifying which domain a task belongs to and routing it to an agent 
with genuine expertise in that domain — not one that *claims* expertise by virtue of adjacent 
credentials.

This is harder than it sounds. Many tasks span domain boundaries. A legal question with 
emotional stakes has components in both law and emotional support. An infrastructure 
debugging task may require both systems expertise and communication skill to gather 
information from stakeholders.

The MELI framework's emphasis on identifying the *specific* nature of a challenging case — 
not its general category — suggests that routing should be based on the specific demands of 
the hardest parts of a task, not just its surface domain label. What makes this case hard? 
What kind of expertise does the hard part require? That question should drive routing.

### The Deliberate Practice Analog in Agent Training

Ericsson's deliberate practice concept, as Wilson applies it, suggests that agent improvement 
requires more than task exposure. Agents need:
- Structured encounter with cases that push beyond current capability
- Feedback mechanisms that are calibrated to actual performance rather than just 
  outcome agreement
- Iterative cycles of error analysis and capability update

An agent training pipeline that simply exposes the agent to more data without specifically 
targeting the failure modes identified by performance analysis is accumulating experience 
without building expertise. The difference matters enormously at scale.

## Boundary Conditions

The domain-specificity principle applies most strongly when:
- The domain has non-trivial depth — enough that surface-level performance can be 
  sustained without deep competence
- The domain has performance ambiguity — outcomes that are hard to measure objectively 
  in real time
- Adjacent domains create credential-transfer temptations (law → legal mediation, 
  psychology → therapy)

It applies less strongly when:
- The task is genuinely general (reading comprehension, basic arithmetic)
- Domain transfer is real and well-documented (physics expertise transfers meaningfully 
  to engineering in ways that legal expertise does not transfer to mediation)
- Performance can be measured objectively and immediately