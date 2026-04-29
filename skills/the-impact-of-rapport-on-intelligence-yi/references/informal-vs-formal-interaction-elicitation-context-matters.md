# Context Shapes Elicitation: How Formal vs. Informal Settings Change What Rapport Components Are Available and Effective

## The Problem of Context-Dependence in Communication Research

Most research on investigative interviewing and rapport is conducted in formal settings: interview rooms, recorded under caution, governed by explicit legal frameworks, with structured protocols for how questions can be asked and answers can be given. This methodological preference is understandable — formal settings are easier to access, more ethically straightforward, and produce data whose conditions are clearly defined.

But Nunan et al. (2020) provide something rarer and more valuable: data from genuinely *informal* interactions. The telephone calls between source handlers and CHIS are not governed by PACE (Police and Criminal Evidence Act 1984), are not interviews under caution, do not follow mandated protocols, and occur within ongoing personal relationships that can span years. They are, in the authors' words, "typically informal, undertaken via the telephone and physical meetings that are not bound by the formality of England and Wales' Police and Criminal Evidence Act 1984" (p. 5).

This informality is not a confound to be controlled for — it is the defining feature of the interaction context, and it shapes which rapport behaviors are available, which are appropriate, and which are most effective. The paper's comparison with Collins and Carthy's (2019) formal suspect interview data illuminates these differences in ways that are directly relevant to AI agent system design.

## What Changes Between Formal and Informal Contexts

### Behavioral Availability

Some rapport behaviors are structurally more available in informal than formal contexts:

**Self-disclosure**: In formal investigative interviews, interviewer self-disclosure is limited by professional norms, legal constraints, and the power asymmetry between interviewer and suspect. In source handler/CHIS interactions, self-disclosure is actively encouraged as a rapport-building tool: "The use of self-disclosure by source handlers must be undertaken in a way that reveals sufficient and appropriate information to build rapport (e.g. favourite football team), but does not compromise their own safety" (p. 5). The paper even discusses handlers developing "appropriate cover stories" to enable rapport-building disclosures while protecting their identities.

**Humor**: Humor is largely unavailable in formal interview settings without risk of appearing to trivialize serious proceedings. In informal telephone interactions, appropriate humor is specifically coded as a rapport behavior — when "the CHIS must find the use of humour as a positive" (Table 1).

**Common ground exploration**: Asking a suspect about their hobbies, family, and lifestyle would be unusual in a formal investigative interview. In source handler/CHIS calls, "the use of questions around the CHIS' lifestyle, hobbies, family etc. to display a genuine interest towards the CHIS" (Table 1) is a standard positivity behavior.

### Behavioral Frequency Differences

The paper directly compares its findings with Collins and Carthy's (2019) formal interview study: "In contrast to Collins and Carthy (2019), the present research revealed that positivity was used more frequently than coordination" (p. 12).

In formal suspect interviews, coordination behaviors are mandated: explaining the process, the suspect's rights, what will happen next, the recording procedures. These coordination behaviors occur because formal interview protocols require them. In informal telephone interactions, there is no external requirement — and coordination, though still valuable, occurs less frequently because handlers are not reminded to do it by procedural requirements.

Conversely, positivity behaviors are more frequent in informal contexts because the informal setting makes warmth, humor, and personal engagement more natural and less professionally constrained.

### Relationship History Effects

One of the most important contextual differences is the *history* of the relationship. Collins and Carthy's (2019) interviewers were typically meeting suspects for the first time, often immediately after arrest, with no prior relationship. Source handlers in the Nunan et al. (2020) study were operating within established, ongoing relationships.

The paper hypothesizes that this relationship history may explain the non-significance of positivity in predicting yield: "the increased familiarity may have resulted in a reduced impact of positivity, as it may not have been considered to be as important as coordination or attention" (p. 13). Warmth establishes initial trust — but once trust is established, maintaining it requires less investment. What matters more in established relationships is *substantive engagement* (attention) and *structural clarity* (coordination).

This history effect is an important finding for any system that involves ongoing relationships rather than one-shot interactions.

## The Three-Context Typology

Drawing on this paper and the broader literature it references, it is useful to distinguish three interaction contexts that have quite different rapport dynamics:

### Context 1: First Contact / Adversarial Setting
(Formal suspect interviews, initial user interactions, cold starts)
- Power asymmetry is highest
- Positivity investment is most important as a trust-establishment mechanism
- Coordination behaviors are often mandated by formal protocols
- Self-disclosure and humor are least appropriate
- Attention behaviors remain important but must overcome defensiveness

### Context 2: Established Cooperative Relationship
(Source handler/CHIS calls, ongoing user relationships, known agent partnerships)
- Power asymmetry is lower; relational commitment is established
- Positivity becomes a maintenance behavior rather than a trust-building investment
- Attention becomes the dominant yield driver
- Coordination becomes the critical structural investment (but may be underused due to familiarity effects)
- Self-disclosure, humor, and common ground are natural and appropriate

### Context 3: Formal Cooperative Setting
(Investigative interviews with cooperative witnesses, formal agent handoffs with defined protocols)
- Moderate power asymmetry; cooperation is assumed but structured
- Coordination behaviors are externally mandated and therefore more consistently deployed
- Attention behaviors are highly important
- Positivity is constrained by professional norms but remains important

The practical implication: **rapport strategies should be calibrated to the interaction context.** A rapport framework that works well in established cooperative relationships may be inappropriate or insufficient in first-contact or adversarial settings — and vice versa.

## The Telephone Medium and Its Constraints

The paper's data is specifically from *telephone interactions*, which creates important constraints:

**Verbal-only channel**: Without visual information, nonverbal rapport signals — eye contact, facial expression, body posture, physical proximity — are unavailable. All rapport must be carried by verbal behaviors. This limitation "only possible to analyse verbal rapport as the research team had access to audio recordings" (p. 7) is acknowledged, but it also means the framework is specifically adapted to voice-only interactions.

**Absence of physical presence**: Physical co-presence enables implicit rapport signals (synchrony of movement, shared spatial orientation, environmental context) that are unavailable on the telephone. Telephone rapport requires more explicit verbal compensation.

**Medium informality**: The telephone medium itself connotes informality — it is more casual than a face-to-face formal interview and more private than a written communication. This informality may facilitate the positivity behaviors that are more appropriate in informal contexts.

For AI agent systems — which operate primarily through text-based or voice-based communication without physical presence — the telephone interaction is actually a closer model than the face-to-face interview. The challenge of building rapport without visual cues, through a verbal-only channel, in an informal context, is structurally similar to the challenge of an AI agent building effective working relationships through text.

## Appropriate Self-Disclosure: The Calibration Challenge

One of the most nuanced contextual challenges the paper addresses is the question of *appropriate* self-disclosure. The paper notes that self-disclosure "must be undertaken in a way that reveals sufficient and appropriate information to build rapport (e.g. favourite football team), but does not compromise their own safety by inappropriately revealing overly personal information such as their home address or children's school" (p. 5).

This calibration challenge — sharing enough to build rapport without sharing so much as to create risk — has direct analogs in AI agent system design:

**What can an agent disclose about itself?** An agent that can explain its capabilities, its limitations, its reasoning process, and its uncertainties builds a more effective working relationship with users than one that presents itself as an opaque oracle. This transparency is the agent's version of appropriate self-disclosure — sharing enough about how it works to build trust, without creating false impressions of certainty or capability that would eventually damage that trust.

**What should an agent disclose about its principals' interests?** An agent operating on behalf of an organization must calibrate what it reveals about that organization's goals, constraints, and capabilities — sharing enough to make the agent's behavior intelligible, without revealing sensitive information about the organization's operations or strategy.

**How much should an agent reveal about its uncertainty?** Appropriate disclosure of uncertainty — "I'm not confident about this aspect" — is the epistemic equivalent of appropriate personal self-disclosure. It builds trust by demonstrating honesty; it would be inappropriate to express *no* uncertainty (which would be false) or *excessive* uncertainty (which would undermine the agent's usefulness).

## The Informality Premium: When Structure Helps and When It Hinders

One of the paper's most interesting implicit findings is that the absence of formal structural requirements (like PACE mandates) results in coordination behaviors being *underused* — because without external prompts, handlers revert to more natural conversational patterns that emphasize positivity and some attention, but neglect the procedural clarity that coordination provides.

This suggests a paradox of informality: **informal contexts make rapport feel more natural but often degrade its quality**, because the structural behaviors (coordination) that drive substantive yield are not naturally prompted and therefore often omitted.

The implication for agent system design: **build explicit structural scaffolding into informal interactions**. Don't rely on the naturalness of an informal interaction to produce structurally sound behavior. Instead, design in the coordination moments — goal-alignment prompts, process transparency, closure questions — as architectural features of the interaction, not as optional behaviors that practitioners can choose to deploy.

The formal interview's legal requirements essentially mandate coordination behaviors. The informal telephone call has no such mandate — and coordination suffers as a result. An AI agent system should provide the structural equivalent of those mandates: not as rules that are visible to the user, but as architectural features that ensure coordination behaviors are consistently deployed even in informal contexts.

## Boundary Conditions: When Informal Rapport Frameworks Don't Apply

The informal framework described in this paper has important limitations:

**High-stakes single interactions**: In crisis negotiations, emergency information gathering, or other high-stakes single-session interactions where there is no prior relationship and may be no future relationship, the ongoing relationship management framework doesn't apply. The handler must establish enough trust for a single interaction, which is a different challenge from maintaining a relationship over years.

**Power-asymmetric contexts**: In interactions where one party has significant power over another (interrogations, formal evaluations, regulatory contexts), the informal rapport model may be inappropriate or inapplicable. The working alliance model assumes enough mutual commitment to make the relationship genuinely bilateral.

**Acute adversarial dynamics**: With a source who is actively resistant or whose interests genuinely conflict with the handler's, the cooperative working alliance model requires significant adaptation. The paper's recommendations are optimized for genuinely cooperative relationships where both parties benefit from the exchange.

**Highly standardized interactions**: In contexts where standardization is paramount (clinical trials, legal depositions, formal evaluations), the flexibility of informal rapport may conflict with validity requirements. Standardization may require sacrificing rapport optimization.

## Conclusion: Context Is Not a Background Condition — It Is a Design Parameter

The paper's comparison between informal source handler/CHIS interactions and formal investigative interviews is not a methodological limitation to be apologized for — it is one of the paper's most valuable contributions. By operating in a genuinely different context from most interview research, it reveals that context shapes which rapport behaviors are available, which are appropriate, and which actually predict yield.

For agent systems: **context is not a background condition but a design parameter.** The rapport-equivalent behaviors that drive yield in an established cooperative relationship (attention, coordination) differ from those that matter in first contact (positivity, coordination), which differ again from those that apply in adversarial settings. Systems that apply a single rapport framework regardless of context will be suboptimal across all contexts.

The design task is to characterize the interaction contexts in which your agent operates, identify the rapport components that are most available and most predictive in each context, and calibrate behavioral investment accordingly. The telephone-based informal cooperative relationship described in this paper is probably the closest structural model for many AI agent-user interactions — informal, verbal or text-based, ongoing, without physical presence, built on mutual benefit. Its lessons are therefore directly applicable: invest heavily in attention and coordination, don't mistake positivity for substance, and build structural scaffolding into naturally informal contexts to prevent coordination from being systematically underdeployed.