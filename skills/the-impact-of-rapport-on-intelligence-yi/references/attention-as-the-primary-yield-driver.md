# Attention as the Primary Yield Driver: What Active Listening Actually Requires

## The Empirical Finding

Among the three components of rapport measured in Nunan et al. (2020), attention is by far the strongest predictor of intelligence yield:

- Attention correlates r = .83 with overall intelligence yield (p < .001)
- Attention explains 69% of the variance in intelligence yield
- Attention correlates significantly with *all five detail types* of intelligence yield, ranging from r=.60 (temporal) to r=.81 (action)
- By comparison, overall rapport explains 48% of variance; positivity explains 4%

This is not a subtle finding. Attention, operationalized as a cluster of specific verbal behaviors, is the dominant driver of what a source produces. Everything else — friendliness, warmth, coordination, shared goals — matters, but it matters considerably less.

The question this raises is not "should we focus on attention?" (the answer is clearly yes) but "what does attention *actually consist of* in behavioral terms, and why does it work?"

## What Attention Is Made Of

The coding framework used in this study breaks attention into eight specific behaviors:

**1. Back-channel responses**: Short facilitators like "uh huh" or "hmm." These are not evaluative — crucially, feedback like "perfect" or "good" is explicitly *excluded* and coded differently because evaluative responses are potentially leading. Back-channel responses signal "I am receiving; continue" without directing the content of what continues.

**2. Paraphrasing**: Repeating back what the CHIS said in slightly reformulated form. This demonstrates that the handler has "clearly attempted to process what the CHIS is saying." It is not repetition — it requires comprehension and reformulation, which is why it demonstrates processing.

**3. Identifying emotions**: Attending to the CHIS's emotional state: "you sound upset." This is attention directed at the affective channel, not just the informational channel. The emotional state of a source is informational: it signals what aspects of the account are salient, threatening, or important to the source.

**4. Explores and probes information**: Going "beyond just accepting information" by searching for further detail, identifying the provenance of information, funneling from open to closed questioning. This is the most cognitively demanding attention behavior — it requires the handler to identify what is missing, ambiguous, or underspecified in the source's account and formulate targeted follow-up.

**5. Intermittent summarizing**: Providing regular, accurate summaries of the CHIS's account during the interaction. This serves two functions: it demonstrates processing (I have been tracking your account), and it invites correction (did I get that right?). Both functions are informational.

**6. Final summary**: A summary at the end of the interaction that accurately "resumes key issues discussed and captures key proses from the CHIS." This is a closure behavior, but it is also an opportunity for the source to identify errors, add omissions, and confirm what has been understood.

**7. Asks if the CHIS wishes to add or alter anything**: Providing explicit opportunity for amendment. This behavior is simple but powerful: it signals that the interaction is not closed, that additions are welcome, and that the handler is not just extracting a fixed quantity of information but inviting comprehensive disclosure.

**8. Explores motivation**: Understanding why the CHIS is willing to share, and using this as a hook for cooperation (detailed in the motivation document above).

## Why These Behaviors Work: The Cognitive Mechanism

Attention behaviors work through at least three distinct mechanisms:

### Mechanism 1: Signal That Information Is Being Received and Valued

When a handler paraphrases, summarizes, and asks follow-up questions calibrated to what has been said, this sends a clear signal to the source: *what you are saying is being heard, processed, and matters.* This is not just pleasant — it is functionally important for maintaining information flow.

Sources often calibrate their output to perceived reception. If they cannot confirm that their information is being received and understood, they have no feedback loop to drive continued production. Back-channel responses and paraphrasing close this feedback loop — they confirm reception, which sustains production.

### Mechanism 2: Probe for What Is Missing

The single most important attention behavior for intelligence yield is probably "explores and probes information" — going beyond the volunteered account to identify and retrieve what has not been said. A source does not necessarily know what information is most valuable to the handler. They produce an account structured by their own salience judgments. The handler's probing redirects attention to what the handler actually needs.

The funnel technique (open to closed questioning) is structurally optimal for this: start with open questions that retrieve the source's own narrative in their own terms, then use closed questions to specify details that are missing, ambiguous, or contradicted. This ensures that the source's full account is retrieved before being narrowed, which avoids the anchoring effects of leading with specific closed questions.

### Mechanism 3: Engage Memory Retrieval Effort

The research explicitly notes that appropriate deployment of attentive behaviors "should motivate the CHIS to engage with memory retrieval" (Abbe & Brandon, 2013). This is a claim about the cognitive relationship between being attended to and effortful retrieval.

When a handler paraphrases what was said and then probes for more, the source is not just answering a question — they are being invited into an active reconstruction of what they know. This reconstruction is effortful and produces more than passive recall. The handler's attention signals that the effort is worthwhile and that detailed retrieval will be received and used.

This mechanism is particularly relevant for intermittent summarizing: when the handler summarizes the account so far and asks what else the source can add, this is explicitly inviting the source to search their memory for what has not yet been produced. The summary functions as a retrieval cue and a gap-identifier — the source can see what has been captured and notice what is missing from their own account.

## Attention vs. Interruption: The Critical Negative Case

The paper notes that source handlers "on occasions interrupted their CHIS." Interruption is the failure mode of attention — it is what happens when the handler stops receiving in order to contribute. The paradox is that interruption often *feels* like attention (I'm so interested in what you said that I want to respond immediately) while functionally being the opposite (I have stopped letting you produce your account).

The cognitive interview research (Milne & Bull, 1999; Fisher & Geiselman, 1992) consistently shows that interrupting free recall reduces both quantity and quality of information retrieved. The source's narrative has a structure — events are recalled in relation to each other, with each element cuing the next. Interruption disrupts this structure, causing loss of narrative threads and potentially redirecting the source to parts of their account that the handler finds salient but the source would not have reached organically.

Non-interruption is not passive. It is active maintenance of a discipline — resisting the urge to respond, question, or redirect while the source is in retrieval mode. This discipline is cognitively costly, which is probably why it fails regularly in practice.

## Attention in Agent System Terms

The behavioral components of attention translate remarkably directly to agent system design:

### Back-channel responses → Acknowledgment tokens
An agent receiving information from a source (human or other agent) should produce explicit acknowledgment signals — not evaluative ("great!") but reception-confirming ("received" / "understood" / "processing"). These signals close the feedback loop and signal that the information is being incorporated.

### Paraphrasing → Restatement before action
Before an agent acts on information it has received, it should restate its understanding of the information and invite correction. This is the agent equivalent of paraphrasing — demonstrating processing and opening opportunity for error-correction before action produces irreversible outputs.

### Identifying emotions → State detection
For agents interacting with human sources, attending to emotional state signals (urgency, frustration, confusion, confidence) provides information about the source's current state that is relevant to calibrating the interaction. An urgency signal from a human collaborator should trigger triage behavior; a confidence signal may warrant trusting an account without deep probing; a confusion signal should trigger re-explanation before proceeding.

### Explores and probes → Targeted follow-up queries
The highest-leverage attention behavior for agents is the equivalent of probing — generating targeted follow-up queries calibrated to what is missing or underspecified in what has been received. An agent that accepts a first-pass account and acts on it without probing is like a handler who accepts initial CHIS testimony without follow-up — it will miss the high-value details that require explicit elicitation.

**Practical design**: Before completing a task delegation, an agent should generate a set of "probing questions" — identified gaps in the information received — and issue these before proceeding. This should be systematic, not opportunistic.

### Intermittent summarizing → Progress checkpoints
In multi-step task execution, periodic summaries of progress-so-far serve multiple functions: they confirm that the executing agent's understanding matches the orchestrator's intent, they identify gaps or errors before they compound, and they invite the human (or orchestrating agent) to redirect before significant work is lost. These checkpoints are the agent equivalent of intermittent summaries.

### Final summary → Handoff documentation
When an agent completes a task and hands off its output, the handoff should include a summary of what was understood, what was produced, what was uncertain, and what the agent recommends for follow-up. This is the final summary behavior — it gives the receiving party an opportunity to identify errors or omissions before the output is consumed.

### Asks if the CHIS wishes to add or alter → Invitation to supplement
After producing an output, an agent should explicitly invite supplementation: "Is there additional context that would affect this analysis?" / "Are there aspects I should reconsider?" This is not a formality — it is an active retrieval cue that prompts the source to search their own knowledge for what was not yet provided.

## The Attention-Yield Relationship Across Detail Types

The research shows that attention correlates significantly with *all five detail types*, with varying strength:

- Action IY: r = .81 (strongest)
- Object IY: r = .77
- Person IY: r = .76
- Surrounding IY: r = .64
- Temporal IY: r = .60 (weakest but still substantial)

Action details (activities, events, behaviors) are the most attention-sensitive. This makes sense: actions are often the most narratively structured part of an account, requiring the most complex retrieval and the most specific probing to extract at adequate granularity. "They drove somewhere and dealt drugs" is the low-attention version; "around 9pm she drove a silver Audi southeast on the A40 and met a man in a grey hoodie at the Tesco car park off Junction 12 where she transferred what appeared to be a package in exchange for an envelope" is the high-attention version.

For agent systems: in information-elicitation contexts, probing should be calibrated to the most attention-sensitive information types for the specific task. In code review, this is the equivalent of action details — not just "what does this code do" but "what does it do under these specific conditions, with these specific inputs, through these specific execution paths."

## Boundary Conditions

**Attention without competence**: The attention behaviors only produce yield if the handler knows what to probe for. A handler who listens carefully but has no model of what information is useful will produce high-attention, low-yield interactions. The attention behaviors are necessary but not sufficient — they are execution-layer behaviors that require a knowledge layer to direct them. This is why handler training must develop both behavioral skills (attention behaviors) and domain knowledge (what information is relevant and how to probe for it).

**Attention under cognitive load**: Source handlers under time pressure, in physically uncomfortable environments, or with multiple CHIS to manage will struggle to maintain high attention. The cognitively costly behaviors (probing, summarizing, motivational exploration) are the first to degrade under load. Agent systems under resource pressure will experience analogous degradation — and should be designed with attention behavior preservation as a priority under constraint.

**Attention in established relationships**: The paper focuses on ongoing handler-CHIS relationships where the relationship pre-existed the recorded interactions. Attention behaviors may have different functions in first interactions (establishing trust, demonstrating competence) vs. ongoing interactions (sustaining production). The r=.83 correlation with yield may be partly a selection effect: handlers who are attentive have built better relationships over time, and interactions with better-established sources produce more yield.

## Summary

Attention is not a single behavior but a cluster of specific, cognitively demanding behaviors — back-channeling, paraphrasing, emotion-identification, probing, summarizing, inviting amendment, exploring motivation. This cluster explains 69% of the variance in intelligence yield from cooperative sources in real interactions. The behavioral components translate directly into agent system design principles: acknowledgment tokens, restatement before action, state detection, targeted follow-up queries, progress checkpoints, handoff documentation, and explicit invitations to supplement. Designing agent skills with these attention behaviors built in — not as optional courtesies but as functional components — is the highest-leverage single change a WinDAGs system can make to improve information yield from its human and agent sources.