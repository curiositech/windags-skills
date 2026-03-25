# Errors, Uncertainty, and the Limits of Decision-Making

## Rethinking What a Poor Decision Is

Klein opens his analysis of errors with a definition that cuts against most of how we evaluate decisions:

"A person will consider a decision to be poor if the knowledge gained would lead to a different decision if a similar situation arose. Simply knowing that the outcome was unfavorable should not matter. Knowing what you failed to consider would matter."

This is not how organizations typically evaluate decisions. They evaluate outcomes. A decision that led to a bad outcome gets scrutinized; one that led to a good outcome gets celebrated. Klein argues this confounds decision quality with luck.

A genuinely poor decision is one where the decision process itself was flawed — where available information was ignored, where mental models were demonstrably wrong, where the reasoning was inadequate to the situation. A good decision that happened to produce a bad outcome is not a poor decision; it's evidence that the world is uncertain.

This distinction matters enormously for learning. If you evaluate by outcomes, you learn the wrong lessons. You punish good decisions that got unlucky and reward bad decisions that got lucky. The incentives corrupt the learning process.

## What Actually Causes Errors

Klein reviewed over 600 decision points across multiple domains and categorized 25 error types. The breakdown:

- **64% — Lack of experience**: The decision-maker lacked the mental models and pattern libraries to recognize the situation correctly
- **20% — Lack of information**: Critical information was unavailable, not received, or not in usable form
- **16% — Mental simulation failure**: The de minimus error — explaining away warning signs to preserve a favored explanation

The majority of errors traced to experience or information, not to reasoning failures. This has profound implications: **blaming operators for biased reasoning is usually wrong**. The operator is often the victim of latent design failures — poor training, bad interfaces, missing information — not the perpetrator of cognitive errors.

James Reason's concept of **latent pathogens** captures this: accidents don't happen because one operator made one mistake. They happen because a system has accumulated latent failures (poor design, inadequate training, inconsistent procedures) that wait for the right triggering conditions. The operator who "caused" the accident merely activated a trap that was already set.

## The Vincennes Shootdown: A Case Study in System Failure

On July 3, 1988, the USS Vincennes shot down Iran Air Flight 655, killing all 290 people aboard. The incident became a textbook case in decision-making research — typically cited as a tragic example of "expectancy bias" or "scenario fulfillment." Klein systematically dismantles this interpretation.

**The setup**: The Vincennes was engaged in surface combat with Iranian gunboats. A contact appeared on radar, rising from Bandar Abbas airport. The crew assigned track number 4474; the USS Sides assigned 4131; the computer merged them to 4131. The crew reported Mode II IFF (military aircraft), no radar lock, radio silence, and descent toward the ship.

**The problem — Table 6.1 shows it clearly**:
- F-14 story: Radar off (could use P-3 for targeting), Mode III IFF (Iran had faked this before), radio silence (hostile), descent (attack profile) ✓
- Commercial airliner story: Fly into surface battle? ✗ Not on schedule? ✗ Off centerline? ✗ Mode II signal? ✗ Descending? ✗

**What actually happened:**
1. **Mode II error**: The range gate had been left open from track 4474; a military aircraft coincidentally took off nearby; the crew saw *that aircraft's* Mode II signal, not Flight 655's
2. **Descent error**: Two crews were tracking two different aircraft (4474 vs. 4131); under ship pitch and time pressure, many punched the wrong track number into their keypads; some saw ascending, others descending
3. **Radio silence**: The commercial crew was monitoring Bandar Abbas departure frequency and Dubai arrival frequency — neither is the international distress channel

The decision had a 189-second window from first contact to engagement. Altitude was displayed as a 4-digit number on a *separate screen*, requiring 5-10 seconds of focused attention to read and another second to interpret the trend. During those 189 seconds, while the ship was pitching in combat, under noise, with split attention, this information was effectively inaccessible.

Klein's argument: "The cues were all consistent with a hostile aircraft: The IFF report showing that it was an F-14. The failure to respond to radio warnings. The timing of the takeoff to correspond to the attack by the gunboats. The final descent toward the Vincennes."

And then: "In order to reject this scenario fulfillment or expectancy bias explanation, we need to come up with a better one... the computer screens that the crew members worked with were not easy to read."

**The real diagnosis**: Track number recycling without clear announcement, altitude data on a secondary display without trend visualization, range gate errors from prior operations, crews tracking different contacts — these are system design failures. Context: 83% of challenges in the Gulf (June-July 1988) were to Iranian military; only 1.3% to commercial aircraft. If the Vincennes had *not* fired and the aircraft had been an attacking F-14, researchers would attribute that to "expectancy bias in reverse."

"This means that the decision bias approach explains too much." An explanation that explains everything explains nothing.

## The Heuristics and Biases Problem

The Kahneman-Tversky-Slovic research program identified numerous systematic deviations from rational choice theory: anchoring, availability bias, representativeness heuristic, confirmation bias, and many others. This framework became enormously influential, generating a picture of humans as fundamentally flawed reasoners.

Klein doesn't reject this research, but he argues it's been badly misinterpreted. The original work aimed to uncover cognitive processes, not prove inherent bias. And its critics have identified serious problems:

**Lola Lopes's critique**: The research confounds performance errors with genuine cognitive limitations. When you test people on statistics problems without giving them any statistical training, they perform poorly. But this tells us nothing about their everyday reasoning, which doesn't take the form of formal probability estimation.

**The irony of confirmation bias**: "One of the primary 'biases' is confirmation bias... Yet one of the most common strategies of scientific research is to derive a prediction from a favorite theory and test it... Researchers working in the heuristics and biases paradigm condemn this sort of bias in their subjects, even as those same researchers perform more laboratory studies confirming their theories."

The accusers are performing the accused behavior.

**The ecological validity problem**: Lab experiments use abstract problems (probability puzzles, verbal gambles) under conditions of no feedback, no meaningful stakes, and no domain expertise. Naturalistic decision-making researchers find that when they test people in their domains of expertise, with realistic stakes and feedback structures, performance looks much better.

The critical question isn't "are humans biased reasoners?" but "under what conditions does human reasoning work well, and under what conditions does it fail?"

## Four Sources of Uncertainty

Schmitt and Klein (1996) identified four distinct sources of uncertainty that experts navigate:

1. **Missing information** — unavailable because no one collected it, or available but not received
2. **Unreliable information** — low credibility due to source problems or distortion in transmission
3. **Ambiguous/conflicting information** — multiple plausible interpretations of the same data
4. **Complex information** — too many interacting elements to integrate straightforwardly

These require different responses. Missing information can sometimes be waited for; sometimes you must proceed with assumptions. Unreliable information calls for corroboration or confidence discounting. Ambiguous information calls for mental simulation of alternative interpretations. Complex information calls for decomposition into manageable elements.

**The critical insight**: Better technology doesn't eliminate uncertainty. When radar was introduced to shipping to prevent collisions in poor visibility, ships increased speed — so accident rates stayed roughly constant. Better information enabled faster decision cycles, which absorbed the safety margin the new information created.

"Previously, information was missing because no one had collected it; in the future, information will be missing because no one can find it."

The information age hasn't reduced uncertainty; it's changed its form. The decision-maker still has to make judgments under incomplete information; now the incompleteness comes from being unable to find the relevant signal in an enormous amount of data rather than from having too little data.

## How Great Commanders Handle Uncertainty

Klein's research on effective commanders reveals a consistent pattern: **they accept uncertainty rather than trying to eliminate it**, and they shape the battlefield to shift the uncertainty burden to the adversary.

Grant, Rommel, and other commanders who consistently won against larger or better-equipped forces shared several characteristics:
- Acted on incomplete information without paralysis
- Maintained flexibility rather than over-committing to detailed plans
- Focused on creating conditions where the enemy's uncertainty was greater than their own
- Appreciated that chance would always play a role, and worked with this rather than against it

"Skilled decision makers appear to know when to wait and when to act. Most important, they accept the need to act despite uncertainty."

The contrast with bureaucratic decision-making is stark. Bureaucratic processes often require certainty before action, which produces paralysis when certainty is unavailable (always) and creates the illusion of control when certainty is claimed (often falsely).

## Superstition and the Causality Problem

Klein makes an uncomfortable observation about domains where expertise cannot develop:

"Our lives are just as governed by superstitions as those of less advanced cultures. The content of the superstitions has changed but not the degree to which they control us. The reason is that for many important aspects of our lives, we cannot pin down the causal relationships."

We pass laws without evidence they work. Corporations reorganize without proof that the new structure helps. We follow management fads. Politicians claim expertise in governing — but governance is a domain with long feedback delays, many confounds, and few controlled trials. The feedback loop that builds genuine expertise is broken.

This is not a minor critique. It means that much of what we treat as expertise in important domains — politics, organizational management, long-term investing, child-rearing — may be ritual and superstition dressed in the clothes of experience.

James Shanteau's conditions for real expertise development:
- Domain is stable (not highly dynamic)
- No need to predict human behavior primarily
- Rapid feedback available
- Task is repetitive with variation
- Many trials possible

Few high-stakes domains meet all these criteria. The implication is that we should be much more humble about claiming expertise, and much more curious about which claimed experts are genuinely better than novices versus which merely have smoother routines.

## The De Minimus Error: Noticing and Explaining Away

Klein identifies a subtle but critical failure mode: **the de minimus error** — noticing warning signs but explaining each one away rather than recognizing the pattern they constitute.

The NICU nurse noticed:
- Distended stomach ("like her sister had")
- Blood in stool ("just from the nasogastral tube")
- 3cc aspirate ("not unusual by itself")

Each symptom has a local explanation. The problem isn't that she's ignoring evidence — she's noticing it. The problem is that she's never *assembling the pattern*. Necrotizing enterocolitis announces itself through a combination of these signs; individually, each sign is ambiguous. Recognition requires seeing the gestalt, not just the parts.

This is different from confirmation bias (seeking evidence that confirms your hypothesis). It's closer to **local coherence without global integration**: each piece of evidence is individually contextualized, and the contextualizations prevent the overall pattern from surfacing.

Klein and Perrow suggest this error is especially dangerous because it feels like good reasoning. You have an explanation for each anomaly. You're not ignoring data. You're being appropriately contextual. The failure is invisible until catastrophe.

Two interventions help:
1. **Premortem technique**: Before finalizing a diagnosis, explicitly imagine it's wrong and ask "what would we be missing if this explanation were incorrect?"
2. **Cue checklists**: For domains with known de minimus error risks (NICU, aviation, military intelligence), explicit pattern checklists force integration across symptoms rather than individual contextualization

## Stress and Decision Quality

A common assumption: stress degrades decision quality, particularly by warping judgment. Klein's research complicates this significantly.

"Stressors such as time pressure, noise, and ambiguity, result in the following effects: The stressors do not give us a chance to gather as much information. The stressors disrupt our ability to use our working memory to sort things out. The stressors distract our attention from the task at hand."

The mechanism is **information limitation and cognitive load** — not warped judgment. When decision quality degrades under stress, the primary cause is that the decision-maker has less information and less cognitive capacity for integration. The reasoning isn't biased; it's starved.

This distinction matters because it points to different solutions:
- If the problem were biased judgment, you'd need cognitive debiasing techniques
- If the problem is information limitation, you need better information design and selective attention training
- If the problem is cognitive load, you need to reduce extraneous demands and build automaticity through practice

The chess evidence makes this concrete: master chess players under extreme time pressure (6 seconds per move) maintain move quality and keep blunder rates at 7-8%. Class B players' blunder rates jump from 11% to 25%. The difference is that masters use recognition-based strategies that are fast and robust under cognitive load; Class B players use deliberative strategies that require more processing time.

Under stress, you still get expertise-driven recognition. What you don't get is time for deliberation and option comparison. If your decision-making relies on recognition, stress hurts you less. If it relies on deliberation, stress hurts you greatly.

This reframes training priorities: develop robust recognition rather than teaching deliberative procedures that won't function under realistic operational conditions.