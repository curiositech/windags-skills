# Rapport Decomposition: Why Disaggregating a Complex Construct Reveals What Actually Works

## The Central Problem with Holistic Constructs

When a system — whether a human organization or an AI agent network — relies on a complex construct like "rapport," "quality," "trust," or "alignment" as a whole, it loses the ability to intervene usefully. The construct feels meaningful, practitioners agree it matters, and training programs are built around it. But without decomposition, you cannot know which *sub-behaviors* actually drive outcomes, which are neutral, and which might even be counterproductive.

The research by Nunan et al. (2020) on police source handler interactions provides a rare empirical demonstration of what happens when you *do* decompose a complex construct and measure each component independently against a concrete outcome metric (intelligence yield, coded as discrete detail types: surrounding, object, person, action, temporal).

The finding is striking and counterintuitive: the three components of rapport — attention, positivity, and coordination — have wildly different predictive power:

| Component | Correlation with IY | Variance Explained (R²) |
|-----------|--------------------|-----------------------|
| Attention | r = .83*** | 69% |
| Coordination | r = .21* | 5% |
| Positivity | r = .19 (ns) | 4% |
| Overall Rapport | r = .69*** | 48% |

Attention explains 69% of the variance in intelligence yield. Positivity explains 4%. If you had measured only *overall rapport* (r=.69, R²=.48), you would have concluded that rapport broadly matters — which is true — but you would have no idea that positivity is largely irrelevant to yield, or that attention alone does most of the predictive work. Worse, you would design training programs that balance all three components equally, wasting training resources on the least impactful behaviors.

## What Each Component Actually Is

Understanding why this decomposition matters requires understanding what each component consists of in behavioral terms.

**Attention** is not passive acknowledgment. It encompasses:
- Back-channel responses (facilitators: "uh huh," "hmm") — note these are explicitly *not* evaluative feedback like "good" or "perfect," which are coded separately
- Paraphrasing (demonstrating active processing of what the source said)
- Identifying emotions ("you sound upset" — attending to affective state as informational signal)
- Exploring and probing information (going beyond accepting the account; funneling from open to closed questioning; identifying provenance)
- Intermittent summarizing (regular, accurate compression of the account so far)
- Providing a final summary (capturing key points at closure)
- Asking if the source wishes to add or alter anything (inviting amendment)
- Exploring motivation (understanding *why* the source is willing to share, and using this as a "hook for cooperation")

This is cognitively demanding, sustained, other-directed behavior. It requires processing what the other party is saying, tracking the structure of their account, and continuously generating probes calibrated to what has been offered so far. It is *information-directed* attention, not social attention.

**Positivity** includes:
- Use of preferred name
- Empathy ("I can understand why you might feel nervous")
- Self-disclosure ("I have children too")
- Common ground / getting to know the CHIS (hobbies, lifestyle, family)
- Equality signs / friendliness (politeness, matching style, courtesy)
- Humor
- Reassurance ("we will get this sorted")

These are the behaviors practitioners most naturally associate with rapport. They feel good. They probably *do* serve a function — maintaining the long-term relationship, communicating safety and non-judgment, sustaining willingness to engage across multiple interactions. But in the moment of intelligence collection, they do not independently drive yield.

**Coordination** includes:
- Agreement (working toward common goal: "yeah that is what I meant")
- Encouraging account (explicitly inviting narrative without inappropriate interruption)
- Appropriate use of pauses (facilitating talk, not awkward silence)
- Process, procedure, and what happens next (explaining future agenda, regulatory requirements, security, next contact timing)

Coordination is the structural scaffolding of the interaction — who is doing what, toward what goal, according to what process. The authors note that "coordination symbolises the smoothness of interactions, exemplified by a feeling of cooperation and synchrony between the parties involved" (Tickle-Degnen & Rosenthal, 1990). Importantly, behaviors of coordination "should directly benefit memory retrieval, particularly when the source handler minimises disruptions, such as appropriately using pauses" (Abbe & Brandon, 2013).

The paper notes that source handlers "rarely used pauses to facilitate communication and on occasions interrupted their CHIS" — which may explain why coordination was the *least frequently used* component despite being significantly correlated with yield.

## The Asymmetry Between Frequency and Impact

There is a structural lesson here about skilled performance under conditions of social complexity:

**Practitioners systematically over-use behaviors that feel productive and under-use behaviors that require cognitive discipline.**

Positivity was used more than coordination (M=12.21 vs. M=10.12 per interaction). But coordination was the more impactful and the more underused. This is not random — it reflects the fact that positivity behaviors (friendliness, warmth, humor) are socially automatic, reinforced by normal conversational norms, and easy to deploy without disrupting the conversational flow. Coordination behaviors (appropriate pauses, explicit process-setting, encouraging sustained narrative) require deliberate counter-habitual action — *not* filling silence, *not* interjecting, *explicitly* structuring an interaction in ways that feel unnatural in ordinary conversation.

This asymmetry — where the high-impact behaviors are cognitively costly and therefore under-deployed — is a general feature of expert performance. The behaviors that most help are often the ones that feel least like what "helping" looks like intuitively.

## Application to AI Agent System Design

For WinDAGs agents operating in coordination and information-elicitation contexts, this research offers several direct architectural lessons:

### 1. Decompose composite quality metrics before optimizing against them

If an agent system uses a composite metric like "conversation quality," "alignment," or "collaboration score," disaggregate it before building optimization loops. Ask: which sub-components of this metric actually predict the downstream outcome we care about? A composite metric that averages high-impact and zero-impact components will produce agents optimized for the wrong mix of behaviors.

**Practical implementation**: When defining a skill's success metric, require that the metric be decomposable into at least 2-3 independently measurable sub-components, each with its own correlation to the outcome. If they cannot be decomposed, treat the metric as a placeholder that needs further specification.

### 2. Distinguish relationship-maintenance behaviors from yield-producing behaviors

The research suggests that positivity behaviors serve a *different* function than yield-producing behaviors. They are not useless — they maintain the relationship across time, manage the source's emotional state, and sustain willingness to continue engaging. But they should not be confused with the behaviors that directly extract information.

In agent design terms: some behaviors are **infrastructure** (maintaining the conditions for future productive interaction) and some are **production** (directly generating outputs). Infrastructure behaviors are necessary but should not be confused with production behaviors when the goal is immediate output.

**Practical implementation**: Agent skill libraries should tag skills with whether they are primarily infrastructure (relationship-maintaining, context-setting, state-management) or production (directly output-generating). When an agent is under time pressure or resource constraints, it should be able to deprioritize infrastructure behaviors that have low immediate yield — without eliminating them entirely, since they protect future yield.

### 3. Attention is the primary driver; design agents to sustain it

The attention component — paraphrasing, probing, summarizing, identifying emotions, exploring motivation — is the highest-leverage behavior cluster in human intelligence elicitation. In agent terms, this maps directly to:

- **Active tracking of what an interlocutor (human or agent) has said** rather than generating responses from prior templates
- **Probing for depth** rather than accepting the first-pass account
- **Summarizing back** to demonstrate processing and invite correction
- **Identifying motivation/intent** of the information source (human or upstream agent) to calibrate what to ask next

An agent that generates fluent, friendly responses without deeply processing the content of what was said is implementing high positivity and low attention — exactly the wrong mix for information yield.

### 4. The 52% unexplained variance is as important as the 48% explained

Overall rapport explains 48% of variance in intelligence yield. The paper explicitly notes: "it does not appear to be the only factor at play... numerous factors may act as a communication barrier or encourager (e.g. elicitation techniques, interviewees' motivation to engage, memory, policy and procedures)." 

For agent systems, this is a reminder that rapport/coordination behaviors are *necessary but not sufficient*. Other factors — the source's intrinsic motivation to share, the quality of the underlying information they hold, the specificity of the task framing, the source's memory and access — are not fully controllable through interaction style. Agents should be designed with awareness that even optimal behavior will leave substantial variance unexplained, and should not over-fit their style to the correlation signal.

## Boundary Conditions

This decomposition finding has specific boundary conditions that matter for transfer:

**Established vs. new relationships**: The finding that positivity did not correlate with yield may partly reflect that the source handler / CHIS relationships were *already established* at the time of the recorded interactions. In a first interaction with a new source, positivity may function differently — building the foundation that allows attention and coordination to operate. In established relationships, positivity may become baseline expectation rather than yield-driver.

**Cooperative vs. non-cooperative sources**: The CHIS in this study were cooperative (they had agreed to provide intelligence). With adversarial or ambivalent sources, positivity might serve a different function — reducing defensiveness enough to allow attention behaviors to operate at all. The authors note: "Positivity in a law enforcement interaction is unlikely to have the same impact as it would in a therapeutic interaction, as the aims of the two interaction types differ" (Abbe & Brandon, 2013).

**Short vs. long interactions**: Mean call length was 7.03 minutes. In longer interactions, the relative weight of components might shift. Coordination and positivity might become relatively more important in sustained interactions where relationship fatigue or structural drift can undermine attention.

**Telephone vs. in-person**: The entire dataset is telephone interactions. Non-verbal signals (which constitute a major portion of rapport literature) are unavailable. The dominance of attention may partly reflect that on a telephone, verbal attention behaviors carry a larger portion of the total rapport signal.

## The Core Lesson for System Design

**Do not let a high composite correlation obscure zero-impact components.** A complex system optimizing against "overall rapport" will dilute its efforts across three components with 69%, 5%, and 4% explanatory power respectively. The principled response is to decompose the composite, measure each component against the outcome metric independently, and concentrate resources on the high-leverage behaviors — while maintaining low-frequency infrastructure behaviors that serve different functions (relationship maintenance, future yield protection) rather than current yield.

This is not intuitive. The zero-impact component (positivity) *feels* most important to practitioners, which is exactly why it receives disproportionate training emphasis and why the gap between intuition and evidence is widest here. Any agent system that relies on practitioner intuition to allocate behavioral effort will reproduce this same distortion.