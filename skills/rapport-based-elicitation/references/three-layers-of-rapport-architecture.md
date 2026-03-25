# The Three-Layer Architecture of Effective Information Elicitation

## The Problem with Treating Rapport as a Single Variable

Most systems that acknowledge "rapport" or "trust" treat it as a single dial: 
be friendlier, be more polite, soften the tone. The research underlying Brimbal et al. (2021) 
reveals that rapport is a three-dimensional architecture, and each dimension operates at a 
different level of interaction. Conflating them leads to interventions that address one 
dimension while neglecting the others — producing partial, brittle, or counterproductive results.

The training program evaluated in this study was built on three distinct and sequentially 
layered components:

1. **Productive Questioning Tactics** — the structural foundation
2. **Conversational Rapport Tactics** — the emotional and epistemic tone
3. **Relational Rapport-Building Tactics** — the interpersonal relationship layer

Each is necessary. None is sufficient. The post-training effect sizes ranged from d = 0.53 
(relational rapport) to d = 1.10 (productive questioning), indicating that all three 
improved significantly — and that the combination drove the overall outcome.

---

## Layer 1: Productive Questioning — The Structural Foundation

This layer concerns the *mechanics* of how questions are posed and responses are handled. 
It is described as "critical to the collection of information but also foundational for the 
development of rapport and cooperation" (Griffiths & Milne, 2006, cited p. 56).

### What it includes:
- **Open-ended questions**: Invite narrative, not confirmation. "Tell me what happened" 
  rather than "Did you know about the meeting?"
- **Funnel structure**: Begin broad, carefully narrow focus. Let the source reveal the 
  relevant territory before the questioner constrains it.
- **Avoidance of leading and suggestive questions**: These contaminate the response with 
  the questioner's assumptions and interfere with the source's authentic recall or reasoning.
- **No interruptions**: Interrupting a source's answer cuts off the response space and 
  signals that the questioner's framework supersedes the source's perspective.
- **Affirmations**: Acknowledging and highlighting constructive contributions 
  ("I appreciate your specificity here") that encourage further engagement.
- **Reflective listening**: Repeating back key phrases, noting emotional content, 
  demonstrating that the questioner has genuinely processed the response.
- **Summaries**: Offering back a synthesis of what has been said — which serves both 
  as a comprehension check and as an invitation for the source to correct, expand, or 
  deepen the record.

### Why it is *foundational*:
Without this layer, the other layers cannot function. If the questioner's structural 
approach contaminate responses through leading questions, interruptions, or closed-ended 
constraints, then conversational warmth and relational investment cannot recover the 
quality of information. The structure of inquiry shapes what information can emerge before 
any relational dynamics have a chance to operate.

This is analogous in agent systems to **query design**: an agent that formulates queries 
correctly (open, non-assuming, inviting elaboration) before any other optimization is already 
operating at a higher information yield than an agent with excellent relational tactics but 
poor query structure.

---

## Layer 2: Conversational Rapport — The Epistemic and Emotional Tone

This layer operates throughout the entire interaction and sets "the tone for a productive 
interaction" (p. 57). It draws from Motivational Interviewing (Miller & Rollnick, 2013) 
and includes five core components:

### Autonomy
Allowing the source to provide their account in their own order, at their own pace, and 
with their preferred level of detail. Not just permitting this — actively supporting it. 
The questioner does not impose a sequence; it follows the source's sequence.

In agent systems: an agent that receives a partial answer and *waits* for the source to 
continue rather than immediately redirecting to the next sub-question is demonstrating 
autonomy support. An agent that follows its own question script regardless of what the 
source just revealed is undermining autonomy — and will receive less information than the 
source actually has.

### Adaptation
"The ability to adjust questioning based on an individual's responses — can facilitate 
perceived autonomy and encourage a free-flowing interview context" (p. 57). This means 
the questioner's next move is genuinely determined by the source's last response, not 
by a pre-planned sequence.

In agent systems: dynamic routing of follow-up queries based on what was just learned, 
rather than executing a predetermined question template. The plan is a starting point, 
not a script.

### Evocation
Drawing out the source's own perspective, motivations, uncertainties, and emotional 
state. Rather than assuming what the source knows or feels, the questioner creates space 
for the source to reveal it. "If the interviewer successfully evokes what an individual 
is feeling in the moment or why they are demonstrating resistance, they can offer acceptance 
and empathetic prompts that demonstrate a nonjudgmental tone" (p. 57).

In agent systems: explicitly querying for the source's uncertainty, confidence level, 
alternative interpretations, or reservations — rather than extracting only the content 
of answers and ignoring the epistemic state of the answerer. A source that says "I think 
it's X but I'm not sure" is providing more valuable information than the same source 
coerced into asserting "X" with false confidence.

### Acceptance
Responding to whatever the source offers without judgment. Partial answers, uncertain 
answers, answers that contradict the questioner's priors — all are received as valid 
contributions rather than failures. This communicates to the source that truthful 
uncertainty is safer than confident fabrication.

In agent systems: feedback loops that accept "I don't know," "That's outside my scope," 
or "I'm uncertain between A and B" gracefully — and build on them — rather than 
re-querying until a definitive answer is produced. Demanding false confidence from sources 
produces false confidence.

### Empathy
Demonstrating genuine understanding of the source's perspective, constraints, and 
situation. Not sympathy (agreeing with the source) but accurate understanding 
communicated back.

In agent systems: reflecting back an accurate model of the source's constraints and 
context before making requests. "I understand you're working with incomplete data on 
this" before asking for a synthesis is empathy. Asking for a synthesis without 
acknowledging the incompleteness is not.

---

## Layer 3: Relational Rapport-Building — The Interpersonal Foundation

This layer is "distinguished from conversational rapport in that [tactics] are not 
specifically linked to the questioning process" (p. 57). These are relationship-building 
moves that operate at the level of the human-to-human (or agent-to-agent, or agent-to-human) 
bond itself, not the specific content being exchanged.

### Self-Disclosure
The questioner shares relevant information about themselves — their purpose, their 
limitations, what they already know. This signals that the relationship is mutual, 
not extractive. It also provides the source with a model of the questioner's context, 
making it easier to calibrate what information is relevant.

### Similarity-Highlighting
Finding and explicitly acknowledging common ground between questioner and source. 
Not manufactured similarity (which sources detect and resent) but genuine shared 
interests, constraints, or goals. "Research has demonstrated that highlighting similarities 
between themselves and the subject can increase rapport" (Brimbal, Dianiska et al., 2019, 
cited p. 57).

In agent systems: an agent that identifies and verbalizes the ways in which its task 
goals align with the source's known interests is building relational rapport. An agent 
that treats the source purely instrumentally is not.

### Acts of Reciprocity
Offering something before asking. "Trust tactics that engage reciprocity, such as offering 
a bottle of water or food (Matsumoto & Hwang, 2018) or providing information or assistance 
to someone (Brimbal, Kleinman et al., 2019), can increase the elicitation of information 
through increased perceptions of trust" (p. 57–58).

In agent systems: providing partial synthesis, useful context, or relevant validation 
to the source *before* requesting more information. The agent contributes to the exchange 
before drawing from it.

### Verification/Affirmation of Self-Concept
"Verifications: displays of an accurate understanding of the individual's self-concept — 
whether positive or negative — can also increase rapport" (Davis et al., 2016, cited p. 57). 
This is subtler than affirmation: the questioner demonstrates that it has an accurate model 
of who the source is, including the source's own self-assessment of strengths and limitations.

In agent systems: an agent that acknowledges a source's known limitations, past 
contributions, or established expertise before making a request is demonstrating verification. 
This is different from flattery — it requires an accurate model of the source.

---

## The Layered Architecture in Practice

A critical finding is that these layers operate sequentially and cumulatively. The post-training 
analysis showed that all three layers contributed to the single latent factor "evidence-based 
tactics" (with relational rapport tactics loading at β = .40, productive questioning at β = .35, 
and conversational rapport at β = .15), and that this combined factor predicted perceived 
rapport (β = .17, p = .006).

No single layer drove the effect — the combination did. This means:

- An agent with excellent query structure (Layer 1) but no conversational adaptation 
  (Layer 2) will produce better-structured but not maximally rich information
- An agent with strong relational investment (Layer 3) but leading questions (Layer 1 
  failure) will poison its own information through contamination even while building trust
- An agent with emotional attunement (Layer 2) but no reciprocity (Layer 3) may be 
  perceived as skillful but not trustworthy

**For agent system design**: information-gathering agents should be evaluated across all 
three layers, not just query quality or response handling. Audit questions should include:
- Is the agent's query structure open, non-leading, and summary-providing? (Layer 1)
- Is the agent adapting its approach dynamically to source responses? (Layer 2)
- Is the agent offering context, acknowledging source constraints, and demonstrating 
  accurate models of its sources? (Layer 3)

---

## Boundary Conditions and Caveats

**Layer 1 is most learnable and most robustly trainable** (d = 1.10 for productive 
questioning vs. d = 0.53 for relational rapport). In constrained training or deployment 
contexts, Layer 1 improvements produce the most reliable gains.

**Layer 3 is most relationship-dependent** and may be less applicable in single-exchange 
or low-context interactions. For an agent making a one-shot API call, relational 
rapport-building may be minimal or inapplicable; for an agent engaged in multi-turn 
collaboration with a human expert, it is critical.

**The layers can interfere with each other if applied inconsistently**. An agent that 
builds relational warmth (Layer 3) while asking leading questions (Layer 1 violation) 
will produce a source that *likes* the agent but provides contaminated information — 
possibly the worst outcome, because the contamination will not be flagged.

---

## Summary Principle

> **Effective information elicitation requires three simultaneously maintained layers: 
> structural integrity in how questions are posed (Layer 1), dynamic emotional attunement 
> in how the interaction flows (Layer 2), and relational investment in the source as an 
> entity with its own perspective and interests (Layer 3). Optimizing any one layer while 
> neglecting the others produces a characteristic failure mode.**