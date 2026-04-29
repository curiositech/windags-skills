# The Credential-Expertise Gap: Why Certification Doesn't Signal Competence and What to Do About It

## The Problem Wilson Is Diagnosing

The professional world is structured around credentials. They function as proxies for 
expertise — signals that a practitioner has met some standard of knowledge and capability. 
The fundamental assumption is that the credential and the expertise are correlated: 
having the certificate means being competent to do the thing the certificate certifies.

Wilson's book is, in part, a sustained argument that this assumption fails in the mediation 
profession — and that the failure is not accidental but structural. The failure modes she 
identifies are general enough to apply to any professional domain where credentials 
are commercially issued, outcomes are hard to measure, and performance is evaluated 
primarily in closed, private settings.

The McEldowney report (2012) is Wilson's primary evidence: a commissioned review of 
mediation training in England and Wales that found that "the expertise of family mediators 
is often taken for granted or misunderstood" (McEldowney, 2012: 12, cited on p.4). 
The report found credential inflation, training shallowness, and professional conflict 
between differently-credentialed practitioners — with the quality of mediation as the loser.

## Why the Gap Exists: Structural Forces

### Commercial Training Economics

"There is a bewildering choice of mediation training courses available worldwide. They 
are predominantly run by private (that is, commercial rather than academic) enterprises, 
which vie for a share of the growing market of potential mediators, many offering their 
own forms of validation or accreditation" (p.3).

The commercial structure of professional training creates a fundamental conflict of interest. 
Training providers are incentivized to:
- Minimize training duration (shorter courses are cheaper to deliver and more attractive 
  to potential enrollees)
- Maximize enrollment (acceptance standards that are too high reduce revenue)
- Issue credentials at the end of training (certificates justify the price and are the 
  deliverable the customer is buying)
- Maintain trainers who may not be domain experts (expert practitioners are expensive 
  and may not be available)

The result is training programs that are "relatively brief, often totalling around forty hours" 
(p.4), focused on "skills and substantive knowledge, with little attention to conflict theory" 
(p.5), with "few and far between" opportunities for situated learning.

Forty hours of training does not produce the ten years of deliberate practice that Ericsson's 
research identifies as the baseline for expertise development (2006a: 689). The certificate 
may certify that the holder attended a course and demonstrated basic skill; it does not and 
cannot certify expertise in the deeper sense.

### The Absence of Outcome Measurement

Credentials cannot reliably track expertise in domains where performance is hard to 
measure. Mediation operates in private; outcomes are complex, multi-causal, and often 
not known for months or years after the session; and "good" mediation is not simply 
defined by whether a settlement is reached (a skilled mediator may help parties reach a 
genuinely considered decision not to settle, which is also a good outcome).

In such domains, the feedback loop that would otherwise calibrate credentials to actual 
performance is absent. A mediator can practice for years with mediocre outcomes without 
this being registered in their credentials or reputation in ways that would reduce their 
credibility.

Wilson notes that referrals — the practical mechanism by which mediators get work — 
"sometimes reflect a practitioner's reputation for providing a certain type of work, 
self-promotion, previous or anticipated connections with the referrer, or economic, 
geographic or other factors that are not necessarily evidence that the mediator is an 
expert" (p.11). The market for expert mediation is poorly calibrated to actual expertise.

### Professional Tribalism

McEldowney reports "some degree of distrust between legally and non-legally qualified 
mediators, which may lead to disagreement or professional tensions. Family mediation 
may be the loser in any professional rivalry" (2012: 12, cited on p.4).

Professional tribalism — the tendency of credential-holders to defend the value of their 
particular credential against others — is a systemic force that works against genuine 
expertise calibration. Each professional group claims that their particular background 
(law, psychology, social work, etc.) is the most appropriate for mediation. This claim is 
almost always a function of identity and interest rather than evidence.

The experts who Wilson points to — genuine mediators with deep domain expertise — 
are often those who have moved beyond their discipline of origin to develop distinctively 
mediator expertise. But the professional structure makes it difficult to recognize and reward 
this: "their mediation skills may be viewed simply as adjuncts to their primary professions" 
(p.3-4).

## The Positive Case for Demonstrated Expertise

Wilson makes a careful positive argument alongside her critique. Credentials may be poor 
proxies for expertise, but expertise is real. The question is how to recognize it.

Honeyman's (1988) research identified six elements of mediation skill: investigation, 
empathy, persuasion, invention, distraction and substantive knowledge. These are not 
abstractions — they are observable in practice. The MELI is partly a mechanism for 
making them observable in a controlled educational setting.

Wilson also suggests outcome-based rough calibration: "it would be difficult to argue 
that mediators who seldom witness the resolution of any conflicts in which they are 
involved are nevertheless experts" (p.11). This is not a precise measurement, but it is 
a real constraint. Expert practitioners, over time, produce better outcomes than novices — 
even if the mechanism is hard to trace and individual cases are too noisy to be informative.

The development of expertise is "the product of complex interactions between person 
and place" (Farrington-Darby and Wilson, 2006: 20). Neither credentials alone, nor 
outcome counts alone, nor years of experience alone, reliably indicates expertise. 
What reliably indicates it is demonstrated performance on hard cases — the equivalent 
of the MELI's Pass 3, where the richness and sophistication of the expert's account 
of their own decision-making becomes visible.

## The Reflexive Problem: Experts Who Undervalue Themselves

Wilson observes the paradox that genuine experts may be reluctant to claim expertise 
while less experienced practitioners confidently self-promote: "Whilst some relatively 
inexperienced mediators claim expertise, others who are highly skilled may be reluctant 
to describe themselves as experts" (p.10-11).

This creates a market where the signal (self-claimed expertise) is inversely correlated 
with the underlying quality in some proportion of cases. Confident self-promotion correlates 
with reduced insight into one's own limitations; modest self-assessment correlates with 
deeper awareness of the complexity of the domain.

A referral system that rewards confident self-promotion over demonstrated expertise will 
systematically misallocate cases — routing clients to practitioners who are good at 
presenting as expert rather than those who are genuinely so.

## Application to Intelligent Agent Systems

### Routing as Expertise Assessment

The credential-expertise gap has a direct analog in how agent systems route tasks to 
specialized agents. If routing is based on agent self-description or declared capability, 
it is subject to the same failure modes as credential-based routing in professional markets:
- Agents may be configured to claim capabilities they don't reliably have
- The most confident-sounding agents may not be the most capable
- Routing based on category labels ("this is a coding task → route to coding agent") 
  may fail to account for the specific demands of the hard parts of the task

Wilson's framework argues for routing based on **demonstrated performance on analogous 
cases** rather than declared capability. This requires:
- Case-based evaluation systems where agents are tested on cases similar to the 
  incoming task before routing is committed
- Outcome tracking that is calibrated to task difficulty, not just task category
- Routing systems that can recognize the specific challenge in a task and route to 
  the agent that has demonstrated competence on that type of challenge, not just 
  that category of task

### Benchmark Credentials vs. In-Distribution Performance

Agent systems are routinely evaluated on benchmarks — the credential system of AI 
development. A model that performs at X% on MMLU is "certified" as having a certain 
level of capability. But benchmark performance is subject to the same credential-expertise 
gap dynamics:
- Benchmark composition may not reflect real deployment distribution
- Models may be specifically trained to perform well on known benchmarks without 
  developing corresponding real-world capability
- High benchmark scores may correlate with confident, fluent outputs rather than 
  genuinely correct reasoning

The Wilson framework suggests that evaluating agent systems requires:
- Hard-case evaluation: not the median task, but the edge cases where capability 
  differences actually matter
- In-distribution evaluation: calibrated to the specific deployment context, not 
  to benchmark distributions developed in other contexts
- Process evaluation: not just whether the output is correct, but whether the 
  reasoning that produced it is sound — the Pass 3 equivalent of probing the 
  decision process, not just its outcome

### Preventing Professional Tribalism in Agent Specialization

The dynamics of professional tribalism — different credentialed groups claiming their 
background is most appropriate for a given task — appear in agent system design as 
debates about which type of agent (RAG-based, fine-tuned, tool-using, etc.) is most 
appropriate for a class of tasks. These debates often reflect the interests and identities 
of different research communities more than they reflect evidence about what works.

Wilson's framework argues for empirical evaluation over tribal allegiance: "flawed theories 
must be rejected and correct theories accepted, regardless of tribal considerations such 
as the distinctions between conventionally recognised schools of thought within a 
profession" (p.1). Applied to agent system design: evaluate approaches based on 
demonstrated performance in the relevant deployment context, not based on which 
research community developed them.

### The Elicitive Approach to Capability Specification

The MELI's elicitive methodology — drawing on existing knowledge within a community 
rather than importing external frameworks — suggests an approach to capability 
specification for agent systems.

Rather than beginning from a general list of capabilities derived from the AI research 
literature, capability specification should begin from elicitation with domain practitioners: 
what do the hardest cases in this domain actually require? What do expert practitioners 
do in those cases that novices don't? What knowledge and reasoning processes would 
need to be present in an agent that could handle those cases well?

This produces capability specifications that are grounded in actual domain demands 
rather than in the categories that AI researchers have found useful to study — which 
is the agent system equivalent of developing indigenous theoretical constructs rather 
than importing North American frameworks.