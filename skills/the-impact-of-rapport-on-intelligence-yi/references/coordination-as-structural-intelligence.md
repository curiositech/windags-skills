# Coordination as Structural Intelligence: What Process Clarity Does That Social Warmth Cannot

## The Underused Component

Among the three rapport components in the Nunan et al. (2020) framework, coordination is the most neglected in both practice and theory:

- It is used *least frequently* (M=10.12 vs. 12.21 for positivity and 24.77 for attention)
- It receives *least training emphasis* — the paper notes that "nationally delivered source handler training in England and Wales includes little mention of rapport-building techniques," and within that, coordination is typically not central
- It is *most often cited as secondary* in discussions of rapport, which typically foreground positivity

Yet coordination is significantly correlated with intelligence yield (r=.21), and the paper explicitly notes that coordination "may be equally, if not more, important for interviewing" (Abbe & Brandon, 2014) than positivity, which receives disproportionate emphasis.

The under-deployment of coordination while it remains impactful — and the systematic over-deployment of positivity while it remains low-impact — is one of the clearest demonstrations in this research of the gap between practitioner intuition and empirical evidence.

## What Coordination Actually Contains

Coordination behaviors in the Nunan et al. framework include:

**1. Agreement**: Working toward a common goal — explicit acknowledgments like "yeah, that is what I meant" that confirm shared understanding rather than assumed understanding. These are not just pleasantries; they are confirmations that both parties are operating from the same model of the interaction.

**2. Encouraging account**: Evidence of explicitly asking the CHIS for their account and allowing them to give it "without any inappropriate interruptions." This is active — it is not just not-interrupting, but explicitly inviting narrative and then holding discipline to receive it.

**3. Appropriate use of pauses**: Using pauses to facilitate talking, "not awkwardly placed." A pause after a question is an invitation to answer. A pause after an answer is an invitation to continue. Source handlers who fill every pause are removing the invitations for continued production.

**4. Process, procedure, and what happens next**: Explaining the future agenda, regulatory requirements (e.g., "don't tell anyone about this conversation"), security and welfare considerations, when to next contact, and future taskings. This is the explicitly structural element — it establishes what the interaction is for, what will happen with what is shared, and what the ongoing relationship structure looks like.

## The Structural Intelligence Function

These behaviors serve a function that neither attention nor positivity can provide: they establish the *structural conditions* within which information can flow reliably.

Consider what happens in the absence of coordination behaviors:

- Without explicit agreement behaviors, both parties may proceed under different assumptions about what has been understood or agreed
- Without encouraging account behaviors, the source may not know whether to continue talking or wait for direction
- Without appropriate pauses, the source loses the space to continue retrieval before the handler moves to the next topic
- Without process and procedure explanation, the source does not know what the information will be used for, who else will see it, or what their obligations and protections are — all of which may affect what they are willing to share

Each of these absences is a structural barrier to information flow. They are not affective barriers (the source doesn't feel warm enough to share) or attentional barriers (the handler isn't tracking what the source is saying). They are organizational barriers — the interaction lacks the structure required for reliable, complete information transfer.

Coordination behaviors address exactly these structural barriers. They are the organizational scaffolding of the intelligence interaction.

## The Operational Accord Mechanism

The paper cites Kleinman's (2006) concept of "operational accord" as an elaboration of coordination that "ensures that the interviewer and interviewee have shared goals and cooperate." Shared goals are not established by friendliness or attention — they are established by explicit communication about what the interaction is for and what each party's role is in achieving it.

"A shared understanding (e.g. agreement) reinforces the common goal or working alliance mentality, especially when the purpose of the interaction and developing relationship are discussed" (Collins & Carthy, 2019). The phrase "when the purpose of the interaction and developing relationship are discussed" is key — this is explicit, verbal, structured communication about goal and purpose, not an assumption.

Without this, two parties can be in social contact and even in attentional engagement without being in operational accord. The handler may be listening carefully (attention), may be warm and friendly (positivity), but if both parties have different models of what the interaction is for — what information is needed, what will be done with it, what the source is expected to produce — then the interaction will not efficiently retrieve the information the handler needs.

## Why Coordination Is Under-Deployed

Several factors explain why coordination is systematically under-used:

**The invisible need problem**: Structural clarity feels necessary only when it is absent. When handler and source share assumptions (even wrong ones), the interaction proceeds smoothly, and the absence of explicit coordination is not felt as a gap. The handler who does not explain process and procedure will often have an interaction that feels complete — until later, when the source shares the information with someone else, or refuses to provide certain details because they did not understand their protections, or provides information of the wrong type because they misunderstood the handler's need.

**The formality problem**: Coordination behaviors feel formal in an informal setting. The source handler / CHIS relationship is specifically informal — it operates outside the Police and Criminal Evidence Act framework, often by telephone, often with established personal rapport. Saying "I want to explain what will happen with the information you provide" in this context can feel like breaking the relational register. The informality that makes the relationship work militates against the structural clarity that makes the information reliable.

**The assumption problem**: In ongoing relationships, handlers assume that prior coordination has established shared understanding that persists across interactions. "They already know the process" replaces explicit re-establishment of shared understanding for each new interaction. But each interaction has specific goals that may differ from prior interactions, and "they know the general process" is not the same as "we share specific understanding of what this interaction is for."

**The conversation-move problem**: Coordination behaviors require making specific moves that interrupt the conversational flow — explicitly inviting the account ("please tell me what you saw"), pausing rather than filling silence, stopping to explain future procedure. These moves feel interruptive because they are, in a sense — they interrupt the normal social script of conversation to impose a more structured interaction format.

## Coordination Failure Modes

The paper notes specific coordination failures in the data:

"Source handlers rarely used pauses to facilitate communication and on occasions interrupted their CHIS, [which] may explain why the coordination component of rapport was the least frequently utilised."

Two specific failure modes:

**Failure Mode 1: Not pausing** — The handler fills silences rather than allowing the CHIS to continue. This is perhaps the most common and consequential coordination failure. After a source provides an initial account, the information they have provided often needs processing time before additional details emerge. Filling that silence redirects the source from retrieval to response — shifting the cognitive mode from "what else do I know?" to "how do I answer the handler's new question?"

**Failure Mode 2: Inappropriate interruption** — The handler interrupts the CHIS's account. This disrupts the narrative structure that retrieval is following. The CHIS may have been about to produce a high-value detail that followed naturally from what they were saying; the interruption redirects them to a handler-selected topic, and the original thread is lost.

Both failures are probably not deliberate. They reflect automatic social behaviors — filling silence is natural, responding to something the source said is natural — that conflict with the structural needs of information elicitation.

## Application to Agent System Coordination

The coordination component of rapport maps directly onto coordination challenges in multi-agent systems:

### Agreement behaviors → Explicit goal confirmation

Before a sub-agent begins task execution, the orchestrating agent should obtain explicit confirmation that the sub-agent's model of the goal matches the orchestrator's intent. Not "I sent you the task specification" but "please confirm your understanding of what is needed." The sub-agent's confirmation is the system-level equivalent of an agreement behavior — it establishes shared understanding before work proceeds.

This matters especially when task specifications are complex, ambiguous, or involve constraints that may not be obvious. Assuming shared understanding from a task specification is the system equivalent of a handler who explains the task once and assumes the CHIS understood.

### Encouraging account → Inviting full output before redirecting

When an agent is receiving a report from a sub-agent, it should invite the full account before redirecting. Not "give me the results on component X" mid-report, but "please provide your full findings" and then ask targeted follow-up questions. This is the system equivalent of encouraging account without inappropriate interruption.

### Appropriate pauses → Timeout and buffer structures

In agent communication protocols, appropriate pauses translate to timeout structures and response buffering. A receiving agent that sends follow-up queries before the sending agent has completed its output is interrupting — and may cause the sending agent to abandon in-progress reasoning threads to address the new query. Communication protocols should ensure that agents can complete their outputs before receiving redirecting queries.

### Process and procedure explanation → Task context documentation

When an orchestrating agent delegates a task, it should provide explicit context about: what the output will be used for, what quality criteria apply, what constraints are in place, when and how the output will be reviewed, and what the sub-agent's obligations are (e.g., flag uncertainty rather than invent). This is the system equivalent of process and procedure explanation — it establishes the structural conditions within which the sub-agent's work will occur.

Without this context, the sub-agent must make assumptions about the use context, quality criteria, and obligations. These assumptions may systematically deviate from the orchestrator's needs in ways that are not visible in the output itself.

## The 5% Variance and Its Significance

Coordination explains only 5% of variance in intelligence yield despite being significantly correlated. The paper is explicit about what this means: "while coordination was reported as significantly correlated to intelligence yield, it may only explain 5% of the variance within the intelligence yielded... Although coordination could only explain a small percentage of the variability, its statistical significance may suggest it plays a small role in gaining intelligence."

This should be interpreted carefully. 5% is small in absolute terms but non-trivial in context. More importantly, coordination may function as a *threshold* rather than a continuous driver — its absence creates barriers that prevent attention behaviors from working effectively, while its presence establishes conditions that allow attention behaviors to function but does not directly generate yield on its own.

The analogy: proper temperature is necessary for cooking but explains little variance in meal quality. Meal quality is driven by skill, ingredients, technique. But without temperature, the other factors cannot operate. Coordination may be similarly structural — necessary for other behaviors to produce their effects, but not independently generative of yield.

This "enabling" function would not show up strongly in a correlation analysis where attention behaviors are also varying. When attention is high and coordination is high, yield is high — but the correlation with coordination is attenuated because attention is doing most of the direct driving.

For agent systems: design coordination behaviors as threshold conditions, not primary yield drivers. Ensure they are present at minimum sufficient levels, then optimize for the primary yield-driver (attention-equivalent behaviors). Treating coordination as the primary investment would be a misallocation — but ignoring it because of its low R² would be an error that removes the enabling conditions for everything else.

## Summary

Coordination is the structural scaffolding that makes the information-elicitation enterprise coherent. It establishes shared goals, creates the space for the source to produce a full account, ensures both parties understand the purpose and process of the interaction, and removes structural barriers to information flow. It is systematically under-used because it feels formal, assumes too much, and conflicts with automatic social behaviors (filling silence, responding immediately). In agent systems, it maps onto explicit goal confirmation, full-output invitations before redirection, communication timeout structures, and task context documentation. Its low direct R² does not mean it is unimportant — it may be that without coordination, attention behaviors cannot produce their full effect, making coordination a threshold condition for the system rather than a direct yield driver.