# The Three-Layer Elicitation Architecture: Productive Questioning, Conversational Rapport, and Relational Rapport

## Overview: Why Layers Matter

One of the most practically valuable contributions of Brimbal et al. (2021) is the explicit decomposition of effective information elicitation into three distinct, ordered layers of technique. This is not a flat menu of tactics to choose from arbitrarily — it is an architecture where each layer provides the foundation for the next, and where deploying higher-order tactics without establishing lower-order foundations reliably fails.

The three layers are:
1. **Productive Questioning** — the foundational information-gathering substrate
2. **Conversational Rapport** — the relational tone and dynamic management layer
3. **Relational Rapport-Building** — the deep resistance-mitigation and trust-establishment layer

The training presented these in order, "with trainers presenting productive questioning tactics as the foundation of an effective information-gathering interview, followed by conversational rapport tactics... and relational rapport tactics as tools to overcome resistance and obtain cooperation" (p. 56, paraphrased from training description). This ordering is not arbitrary — it reflects the causal structure of effective elicitation.

## Layer 1: Productive Questioning

Productive questioning is described as "critical to the collection of information but also foundational for the development of rapport and cooperation" (Griffiths & Milne, 2006, as cited in Brimbal et al., p. 56). This layer is foundational in two senses: it directly gathers information AND it creates the structural conditions under which rapport can develop.

**Core components:**
- **Open-ended questions**: Allow the counterpart to generate their own account rather than selecting from the actor's offered options. This is a generative query, not a classificatory one.
- **Avoidance of closed-ended and leading questions**: Closed questions constrain output to binary or narrow responses. Leading questions embed the expected answer in the question, contaminating the output with the asker's prior.
- **No interruptions**: Interruptions are not just rude — they "interfere with an individual's memory" (Fisher & Geiselman, 1992, cited in Brimbal et al., p. 56) and "prevent the individual from explaining their version of events." Interrupting a generative process mid-stream degrades the quality of the final output.
- **Affirmations**: Highlighting "an individual's constructive statements, attributes, or experiences (e.g., 'I appreciate your honesty')" (p. 57). Positive reinforcement of productive disclosure behavior increases the probability of more productive disclosure.
- **Reflections**: "Repeating back to the individual certain words or phrases and/or sharing observations relating to the individual's emotional state" (p. 57). This signals that the output has been received and processed — a critical acknowledgment in any information-exchange system.
- **Summaries**: "Offering back a concise, yet detailed, encapsulation of what the individual has said" (p. 57). Summaries serve multiple functions: they demonstrate active processing, create opportunity for error correction, and signal a transition point in the conversation.

**The funnel structure**: Training included "a funnel structure (i.e., starting broad and carefully narrowing the focus)" (p. 59). This is a classic top-down query architecture — begin with maximum scope to capture the full output space, then progressively narrow to specific elements of interest. Inverting this (starting narrow and broadening) is less effective because narrow early queries prime specific response frames that constrain later broad responses.

**Agent System Translation for Layer 1:**

When an agent queries a sub-agent, API, human user, or external system for information:
- Start with scope-setting open queries: "Describe what you know about X" before "What is the specific value of parameter Y in X?"
- Process the full response before querying further — don't interrupt with follow-up queries before the initial response is complete
- Acknowledge receipt explicitly: reflect key elements of the response back before proceeding ("So what you're telling me is that X has property Y and constraint Z — is that correct?")
- Provide summaries before transitions: "To summarize what I've gathered so far..." creates checkpoints where errors can be corrected before they propagate
- Avoid embedding expected answers in queries: "Is the bug in the authentication module?" is worse than "Where in the system do you think the bug originates?"

**Training effect**: Productive questioning showed the largest training effect (d = 1.10, 95% CI [0.56, 1.65]), indicating it was the most dramatically underused skill before training and the most readily improvable through instruction. This is significant: the most foundational layer was the most neglected.

## Layer 2: Conversational Rapport

Conversational rapport "establishes the tone for a productive interaction throughout an interview" (p. 57). Unlike productive questioning, which is about query structure, conversational rapport is about dynamic relationship management — how the actor adapts its style and stance to the specific counterpart in the specific moment.

The paper derives this layer from Motivational Interviewing (Miller & Rollnick, 2013), translating its five core components:

**Autonomy**: "Allowing [the counterpart] to provide their own account of an event absent pressure or direction from the interviewer, and to do so in the order and level of detail they feel most comfortable" (p. 57). Autonomy is not just absence of coercion — it is active creation of space for self-directed output. The counterpart structures the narrative; the actor follows rather than leads.

**Adaptation**: "The ability to adjust questioning based on an individual's responses — can facilitate perceived autonomy and encourage a free-flowing interview context" (p. 57). Adaptation means the actor's behavior is continuously updated by the counterpart's behavior. It is fundamentally responsive rather than scripted. A scripted interviewer who follows a predetermined question list regardless of responses is not adaptive — and adaptive failure creates rigidity that counterparts experience as uncanniness and resistance.

**Evocation**: "Drawing-out an individual's emotions and motivations during the interview" (p. 57). This is the process of making explicit what is implicit — surfacing the counterpart's internal state so it can be acknowledged and addressed. An actor that ignores the counterpart's emotional or motivational state is missing the layer of information that explains *why* resistance is occurring.

**Acceptance**: "If the interviewer successfully evokes what an individual is feeling in the moment or why they are demonstrating resistance, they can offer acceptance and empathetic prompts that demonstrate a nonjudgmental tone" (p. 57). Acceptance means the actor does not penalize or resist the counterpart's expressed state — it receives it without judgment. This is the opposite of the accusatorial approach's implicit message that resistance is wrong and must be overcome.

**Empathy**: The behavioral expression of understanding the counterpart's perspective. Empathy demonstrations are the observable signals through which acceptance is communicated.

**Agent System Translation for Layer 2:**

- **Autonomy**: When querying for analysis or output, allow the sub-agent or counterpart system to structure its response. Avoid rigidly formatted query templates that force output into pre-specified categories before the information has been gathered.
- **Adaptation**: Agent query strategies should update based on counterpart responses. If a sub-agent's output suggests it has knowledge in an adjacent domain, follow that thread rather than returning to the scripted query sequence. If responses are becoming minimal or evasive, recognize this as a resistance signal and shift tactics.
- **Evocation**: When a counterpart system produces unexpected errors, minimal outputs, or refusals, the appropriate response is to surface and name what is happening: "It seems like this request is encountering a constraint — can you describe what the constraint is?" This is evocation applied to system diagnosis.
- **Acceptance**: Do not treat unexpected output as inherently wrong. Receive it, process it, and treat it as information about the actual state of the world.
- **Empathy**: For human-facing agents, demonstrating understanding of the user's frustration, confusion, or constraint before proceeding is the conversational rapport equivalent.

**Training effect**: Conversational rapport also showed a large training effect (d = 1.03, 95% CI [0.49, 1.56]), comparable to productive questioning. Both foundational layers were dramatically underutilized before training.

## Layer 3: Relational Rapport-Building

Relational rapport-building tactics "can be distinguished from conversational rapport in that they are not specifically linked to the questioning process" (p. 57). They operate at the level of the *relationship itself* rather than the *conversation within the relationship*. They are deployed specifically to address resistance that conversational rapport cannot resolve.

**Core components:**

**Self-disclosure**: "Self-disclosure on the part of the interviewer can increase rapport, while prompting self-disclosure from the individual" (Dianiska et al., 2020; Goodman-Delahunty et al., 2014, cited in Brimbal et al., p. 57). Sharing relevant information about the actor creates reciprocal pressure for disclosure and signals that information exchange is safe. The actor is not just a one-way extraction device — it is a participant in a mutual exchange.

**Similarity highlighting**: "Highlighting similarities between themselves and the subject" (Brimbal, Dianiska, et al., 2019, cited in p. 57) increases affiliation. Shared identity, shared experience, or shared perspective creates in-group dynamics that reduce adversarial posturing.

**Affirmations and verifications**: "Shining a positive light on an individual's self-esteem by underlining positive aspects of their identity" (affirmations) and "displays of an accurate understanding of the individual's self-concept — whether positive or negative" (verifications) (Davis et al., 2016; Dianiska et al., 2020, cited in p. 57). Verifications are particularly powerful: accurate acknowledgment of even negative aspects of someone's self-concept (struggles, limitations, constraints) signals genuine understanding rather than superficial flattery.

**Reciprocity-based trust tactics**: "Trust tactics that engage reciprocity, such as offering a bottle of water or food... or providing information or assistance to someone" (Matsumoto & Hwang, 2018; Brimbal, Kleinman, et al., 2019, cited in p. 57) can increase information elicitation through increased perceptions of trust. The actor gives something before asking for something, activating reciprocity norms.

**Training effect**: Relational rapport showed the smallest but still significant training effect (d = 0.53, 95% CI [0.03, 1.02]), indicating it is the hardest layer to train and the most resistant to rapid improvement. This makes sense: relational tactics require the most context-sensitivity and the most departure from scripted behavior.

**Agent System Translation for Layer 3:**

Layer 3 is the most nuanced to translate because it operates at the relationship level, which many agent systems don't model explicitly. But the principles apply:

- **Self-disclosure**: When an agent system encounters a resistant human user or stakeholder, sharing relevant context about the agent's own constraints, uncertainties, or reasoning process can unlock reciprocal disclosure. "Here's what I know and don't know about this problem" before "Can you help me fill in the gap?" is more effective than a direct query.
- **Similarity highlighting**: Finding common ground between agent and counterpart — shared goals, shared constraints, shared understanding of the problem space — reduces adversarial framing.
- **Affirmations and verifications**: Acknowledging what the counterpart has already contributed accurately, including acknowledgment of limitations, before asking for more.
- **Reciprocity**: An agent that provides value to a counterpart before requesting value from that counterpart will generate more cooperative responses. In multi-agent systems, this means agents that help other agents succeed (even partially, even with information that aids but doesn't complete the other agent's task) will generate more cooperative responses in return.

## The Integration: Why Ordering Matters

The training explicitly ordered these layers, and the ordering reflects necessity:

- **Layer 1 without Layers 2 or 3**: Gets information from cooperative counterparts; fails with resistant ones. The structural questions are right but the relational container is missing.
- **Layers 2 or 3 without Layer 1**: Creates warm, cooperative feeling but elicits vague or unstructured information because the questioning architecture is poor. Rapport without productive questioning wastes the cooperative window.
- **All three layers applied in order**: Establishes the information-gathering structure (Layer 1), creates the relational dynamic that makes the counterpart willing to engage with that structure (Layer 2), and addresses deep resistance or mistrust that prevents engagement even when the dynamic is otherwise positive (Layer 3).

For agent system orchestration: this is a sequenced protocol, not a bag of tricks. Agents should be designed to assess which layer is the bottleneck in a given interaction and deploy the appropriate layer — while maintaining the foundational layers that are already working.