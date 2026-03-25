# Motivation as Functional Intelligence: Why Understanding Why Someone Shares Changes How You Elicit

## The Standard Information-Gathering Model

Most information-elicitation frameworks treat the source as a container of information and the elicitation process as a method for extracting it. The key variables are: Does the source have the information? Are they willing to share it? What questions will retrieve it?

The Nunan et al. (2020) research, building on Cooper (2011), Taylor (2002), and Abbe & Brandon (2013), introduces a more sophisticated model: **the source's motivation for sharing is itself a functional input to the elicitation process, not merely a background condition.** Understanding motivation is listed as an explicit attention behavior in the rapport coding framework — it is something the skilled handler actively investigates and uses, not just infers and assumes.

"The source handler should be listening out for and probing information to help identify the CHIS' motivation. By understanding why a CHIS is willing to engage, this may provide rapport-building opportunities (Cooper, 2011), adapt the approach used (Taylor, 2002) and motivate the CHIS to engage with memory retrieval (Abbe & Brandon, 2013)."

This single passage contains three distinct claims about what motivational understanding enables:
1. It creates rapport-building opportunities (by connecting to what the source actually cares about)
2. It allows approach adaptation (different motivations call for different elicitation styles)
3. It motivates memory retrieval (by making the source's own goals salient in the context of sharing)

## What Motivation Actually Is in This Context

The paper uses CHIS (covert human intelligence sources) as its domain, but the motivational analysis generalizes. A CHIS might share information because of:

- **Financial reward** (the UK spent £22 million on informants over five years)
- **Personal safety** (they fear a criminal associate and want protection)
- **Ideological alignment** (they believe criminals should be caught)
- **Personal grievance** (revenge against a specific target)
- **Legal pressure** (a deal with prosecution services)
- **Relationship loyalty** (to the handler personally)
- **Civic duty** (general public interest motivation)

Each motivational structure generates a different information-sharing pattern:

**Financial motivation** → Tends to maximize volume (more information = more payment), may over-report, may include padded or invented details, may underweight quality control

**Safety motivation** → Tends to emphasize threat-relevant information, may under-report information that could expose the source's own position or complicity, information has survival stakes for the source

**Ideological motivation** → Tends to selectively emphasize information that confirms the source's prior beliefs about who is guilty or dangerous, may filter information that conflicts with their narrative

**Grievance motivation** → May be targeted at harming specific individuals, information may be accurate about targets but selectively framed, reliability depends on what is damaging to the target

**Relationship loyalty** → Information quality depends on the relationship's health; as relationship deteriorates, information quality and completeness may drop before explicit withdrawal

A handler who knows the motivational structure can:
1. Probe for specific types of information that the motivation makes likely (safety-motivated CHIS will have actively gathered threat information)
2. Discount or probe harder on information types that the motivation makes liable to distortion (financial motivation → probe for detail specificity)
3. Maintain the interaction in ways that sustain the motivation (for financially motivated CHIS, acknowledging the value of what they've provided; for safety-motivated CHIS, explicitly addressing their security concerns)
4. Anticipate reliability patterns in the output (not just "is this person reliable" but "in what specific ways is their motivation likely to shape what they share")

## Motivation and Memory Retrieval

The claim that motivational understanding "motivates the CHIS to engage with memory retrieval" (Abbe & Brandon, 2013) is worth unpacking. It is not simply that knowing motivation makes the source try harder. The mechanism is more specific:

When the handler explicitly connects the information need to the source's own motivation ("you mentioned you're worried about what happens to your family — if we can establish where they're meeting, we can act before it gets dangerous"), the source's own goal-relevant concerns activate. This makes memory retrieval *purposive from the source's perspective*, not just something they're doing to satisfy the handler.

Purposive memory retrieval is more effortful and more thorough than passive recall. The source becomes an active collaborator in the information production, not just a passive respondent to questions. They think forward about what they know, not just backward about what they've seen.

This is related to what the coordination component calls "shared understanding" and "working alliance" — but it goes one level deeper. It's not just that both parties share a goal for *this interaction*; it's that the source's *personal* goal is explicitly engaged in service of the *interaction's* goal. The source's motivation becomes a tool for driving their own retrieval effort.

## The Self-Disclosure Asymmetry

The paper notes that source handlers' self-disclosure must be "undertaken in a way that reveals sufficient and appropriate information to build rapport... but does not compromise their own safety by inappropriately revealing overly personal information." Source handlers may use "cover stories" to disclose "non-attributable information" where needed.

This creates an interesting asymmetry: the handler uses self-disclosure strategically, calibrated to the rapport-building function, while the source is expected to share genuine (not strategic) information. The working alliance is not symmetric in this respect — both parties have motivational structures and information asymmetries, but they have very different relationships to disclosure.

For agent systems, this asymmetry has a parallel: when an orchestrating agent delegates to a sub-agent, it may share task context selectively — sharing what is needed to motivate the sub-agent's best effort without sharing information that would distort the sub-agent's approach or reveal information about other parts of the system. The delegation itself is a form of strategic self-disclosure calibrated to the sub-agent's role and the interaction's purpose.

## Failure Mode: Assuming Motivation is Obvious or Stable

The research emphasizes that motivation must be actively explored, not assumed. This is a failure mode in both police intelligence and agent system design:

**In intelligence**: Handlers may assume they know why a CHIS is engaged (financial arrangement, established trust) and stop actively attending to motivational signals. If motivation shifts (the CHIS becomes frightened, has a personal grievance against the handler, wants to exit the relationship), the handler who is not attending to motivational signals will miss the change and fail to adapt.

**In agent systems**: An orchestrating agent may assume it knows why a sub-agent (or a human collaborator) is performing a task — because it was assigned, because it is designed to optimize for X. But sub-agent behavior may be driven by other factors: optimization targets that diverge from stated goals, accumulated context that shapes interpretation, capability boundaries that the sub-agent is working around. If the orchestrator does not actively probe for the factors shaping sub-agent behavior, it loses the ability to calibrate its interpretation of outputs.

## Motivational Alignment as a Design Principle

The working alliance concept requires that both parties understand the *purpose* of the relationship. But purpose-alignment is not the same as motivation-alignment. Two parties can share a stated purpose while having very different motivations — and those motivational differences will shape their behavior in ways that diverge from what shared purpose alone would predict.

For agent system design:

**1. Specify incentive structures explicitly**: When designing a sub-agent or a skill, specify what the agent is being rewarded for (or penalized for). Make the motivational structure explicit, not assumed. Assume that the agent will optimize for its specified incentive structure even when that diverges from stated purpose.

**2. Probe outputs for motivational signatures**: Different motivational structures generate different output patterns. A code-review agent optimized for speed will produce different outputs than one optimized for thoroughness. Knowing which optimization is active allows calibration of how to interpret and use the outputs.

**3. Maintain motivational attention across interactions**: Do not assume motivation is stable. In long-running multi-step tasks, sub-agent motivation may shift as context accumulates, as the task proves more or less tractable, as earlier results shape later approach. Build in regular motivational checkpoints — not just "are you on track?" but "given what you've found so far, what are you now optimizing for?"

**4. Use motivation as a hook for effort**: When delegating to a sub-agent, explicitly connect the task to what the sub-agent is designed to care about. "This code review will directly impact the reliability of the authentication system" engages a security-oriented agent differently than "please review this code." Motivational framing is not manipulation — it is alignment between the agent's optimization target and the task's most important dimension.

## The Intelligence Yield Types and Their Motivational Correlates

The paper codes intelligence into five detail types: surrounding (setting), object (items), person (people and descriptions), action (activities), and temporal (time references). The overall IY mean was 87.26 details per 7-minute interaction — a substantial information density.

Motivation may correlate with which detail types are most reliably produced:

- **Safety-motivated sources** may be reliably specific on person details (who exactly is threatening) and temporal details (when things are happening) because these are the details most salient to their personal threat calculus
- **Financially motivated sources** may produce high volumes of object and action details (what is happening, what is being traded) where volume is most visible
- **Ideologically motivated sources** may be specific on surrounding details (locations, settings) that support narrative about patterns of criminality

A handler who knows the motivational structure can probe specifically for the detail types most likely to be reliable and complete from this source's perspective. This is a form of motivated question design — asking the questions most likely to retrieve the best information given this source's particular informational strengths.

For agent systems: understanding what a skill or sub-agent is *designed* to produce (its equivalent of "motivational structure") allows the orchestrator to formulate queries that will retrieve the highest-quality outputs from that skill's particular strengths — and to avoid over-relying on output types that the skill's design makes systematically unreliable.

## Summary

Motivation is not background context — it is functional intelligence that changes how you elicit, how you interpret, and how you calibrate your response to what you receive. The skilled handler attends to motivation actively, uses it to adapt approach, and deploys it as a tool for sustaining the source's retrieval effort. This same logic applies to agent systems: understanding why a source (human or agent) is producing what it produces is a prerequisite for knowing how to elicit better, how to interpret what is received, and how to sustain the cooperative relationship across time.