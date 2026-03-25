# Situation Assessment as the Core Competency: Why Getting the Picture Right Matters More Than Choosing the Right Action

## The Central Inversion

Most people's mental model of expert decision-making focuses on choice: the expert sees the options clearly and selects the best one. The NDM research tradition, and Zimmerman's empirical study, reveals that this model is inverted. The expert's primary cognitive investment is not in choosing — it is in understanding. The action follows almost automatically from a correct situational assessment.

"Research has generally found that experienced decision makers focus on situation assessment more than on action choices" (Flin, 1996; Kaempf et al., 1996, cited in Zimmerman, p. 13). And the error literature confirms the mirror image: "inadequate decisions are usually a result of poor situation assessment rather than poor action-choice decisions" (Flin, 1996, cited in Zimmerman, p. 30).

This is not just an academic finding — it is an architectural directive. If you want an agent to make better decisions, invest in situation assessment capability, not in richer option spaces or more sophisticated choice mechanisms.

## What Situation Assessment Actually Is

Situation assessment is not simply "taking in information." Endsley's three-level framework, referenced throughout the NDM literature and applied in Zimmerman's analysis of air traffic controller errors, defines situation assessment as:

**Level 1 — Perception of elements in the environment:** What is actually present and happening? This is raw data acquisition: seeing the cues, hearing the sounds, reading the signals. Error at this level: failing to notice relevant elements, or misperceiving what is there.

**Level 2 — Comprehension of their meaning:** What do these elements, taken together, mean? This is where pattern recognition and mental models operate. The decision-maker interprets the perceived elements in the context of prior experience. Error at this level: the most common expert error — "the main error that occurred was that controllers failed to comprehend the significance of perceived cues, rather than missing cues or making inaccurate predictions" (Jones and Endsley, 2000, cited in Zimmerman, p. 32). Perceived correctly, understood incorrectly.

**Level 3 — Projection of future state:** Given what is happening now, what will happen next? This is mental simulation applied to situation understanding rather than action selection. Error at this level: using an incorrect mental model to extrapolate, or over-projecting current trends.

Each level depends on the previous one. You cannot comprehend what you have not perceived. You cannot project what you have not comprehended. Expert errors at Level 2 are particularly insidious because they feel like confident, competent reasoning — the expert perceives all the cues, constructs a coherent story, and projects a future state, all without realizing that the story is wrong.

## The Mental Model: The Engine of Comprehension

At the heart of situation assessment is the mental model — "a mental representation of the decision task" that "help[s] decision makers describe, explain, and predict the situation" (Goodrich et al., 2000; Rouse & Morris, 1986, cited in Zimmerman, p. 23).

Mental models provide the context within which cues acquire meaning. A number reading "7.4" means nothing without a mental model that tells you whether this is a pH level (dangerous alkaline), a blood oxygen saturation (catastrophically low), a rating on a scale of 10 (moderately good), or a magnitude on the Richter scale (devastating earthquake). The raw perception is identical; the comprehension is entirely determined by the mental model applied.

"Because experts have these mental models, they are able to perceive situations more efficiently and respond faster than novices who must filter through every bit of information before assessing and acting on the situation" (Klein, 1998, cited in Zimmerman, p. 24). The mental model is not a shortcut that sacrifices accuracy — it is a pre-structured template that makes accurate perception possible in real time.

### Types of Mental Models

The Fowlkes et al. (2000) study of helicopter pilots distinguishes three types:

- **Declarative models**: concepts, facts, rules — what things are
- **Procedural models**: sequences, timings, positions, emergency procedures — what to do
- **Strategic models**: strategies for applying knowledge to current situations, including the current state, plan, and deviations from expected patterns

Novices use declarative and procedural models. Experts use strategic models. The strategic model is not just "know the facts and know the procedure" — it is "know how to apply what you know to this specific evolving situation, and notice when reality deviates from expectation."

**For agent systems:** This hierarchy maps to knowledge representation. Declarative knowledge = facts and entity properties. Procedural knowledge = workflow and task sequences. Strategic knowledge = meta-level understanding of when and how to apply the other two. Most agent knowledge bases are strong on declarative and procedural knowledge. Strategic knowledge — the condition-sensitive, context-aware application logic — is the gap.

## The Feature-Matching vs. Story-Building Distinction

When cues are sufficient to match a familiar pattern, experts use feature-matching: they compare the observed set of cues against known situation types and select the closest match. Kaempf et al.'s naval warfare study found that 87% of situation assessments were accomplished through feature-matching (cited in Zimmerman, p. 12). This is fast, reliable, and the backbone of expert performance.

When cues are insufficient or contradictory, experts switch to story-building: they construct a narrative explanation that accounts for all observed evidence. "By matching mental models to the situation, decision makers are able to explain the causes of an event and predict outcomes. Building stories is necessary when there is not enough information available to match features to internal representations" (Zimmerman, p. 11).

Story-building has its roots in Pennington and Hastie's jury research, where jurors without direct knowledge of events constructed coherent narratives from evidence fragments. The key properties of a valid story: it is internally consistent (no unexplained contradictions), it accounts for all observed evidence, and it generates testable predictions about what else should be true.

**The diagnostic question for a built story:** "Does this story account for every element in the environment?" If the answer is yes, the story is credible. If some elements remain unexplained, either the story is wrong or there are unexplained anomalies — both of which should trigger further assessment.

**For agent systems:** Story-building is the natural language analog of abductive reasoning — inference to the best explanation. Agents should be designed to explicitly construct situation narratives in ambiguous cases, rather than defaulting to the nearest pattern match. The quality of the story — its coherence, completeness, and predictive power — is a proxy for situation assessment quality.

## Expert Situation Assessment in Practice: The Behavioral Signatures

Zimmerman's empirical data provides concrete behavioral markers of high-quality situation assessment. Experienced officers:

**Provided interpretive descriptions, not just observational ones.** Rather than "he was nervous," experienced officers would say: "he's nervous, like fidgeting, crossing arms, looking around, wringing hands" (pilot study, Zimmerman, p. 50) — and then explain the probable causes and implications of that nervousness. The observation leads to interpretation, which leads to prediction.

**Applied mental models to explain and predict.** An expert officer, seeing a subject become irrational despite having a gun pointed at him, concluded: "he was going to try and make me shoot him, it wasn't going to end very quickly" (Zimmerman, p. 54). This is a complete mini-situational model: diagnosis (irrational, suicidal by cop), prediction (prolonged standoff), and implied goal revision (no quick resolution).

**Integrated novel cues into revised assessments.** When the subject mentioned just getting out of prison, experienced officers didn't just note the fact — they incorporated it into their whole situational model: "he's on parole so he's a convicted felon... I've even said before 'you know the game' and they're like 'ya.' It does concern you because once someone like that, who knows the system, challenges you or resists you, it's probably going to be bad" (Zimmerman, p. 56-57). The cue becomes evidence that updates the situational story.

**Used mental simulation for situation understanding, not just action selection.** Expert officers would explain environmental elements by simulating what must have happened: "there wouldn't be a knife laying in the center of the floor of a vacant warehouse... there is a good chance that a female student was carrying her backpack with her. In a public place, probably the easiest way to get control of somebody would be with a knife without drawing so much attention" (Zimmerman, p. 59). The backpack and knife are not just observations — they are evidence that constrains the situational story.

**Continuously self-evaluated their approach.** The Pliske et al. (2004) study of weather forecasters found that highly skilled forecasters "tended to evaluate their approach to the task continuously, while lower-skilled weather forecasters did not tend to engage in these self-reflective activities" (cited in Zimmerman, p. 24-25). Self-evaluation is a real-time check on situation assessment quality.

## The Catastrophic Failure Mode: Fixation on Initial Assessment

The most dangerous expert error is not choosing the wrong action — it is failing to update the situation assessment when the situation changes.

Weick's (2001) case study of wildfire fatalities demonstrated this with harrowing clarity: firefighters died with all their equipment in hand because they could not abandon their initial plan even when their situation had fundamentally changed. They did not fail to choose a better action — they failed to perceive that the situation had changed in ways that invalidated their current action.

"It is not usually initial assessments of the situation that are faulty, instead it is inadequate assessments of changing situations that result in disastrous outcomes. As the situation changes, decision makers sometimes fail to take the significance of the changes into account, leading them to remain on their chosen course of action" (Zimmerman, p. 30).

This is the Orasanu et al. finding in aviation: "the majority of errors made were errors of omission; meaning they failed to do something that should have been done" — specifically, they failed to change course when evidence demanded it. "The pilots inadequately assessed the situation, relying instead on familiar mental models to guide them through the situation" (Zimmerman, p. 31).

**The failure mechanism:** The initial situation assessment creates an expectational framework. As the situation evolves, incoming cues are interpreted through this framework. Cues consistent with the framework are noticed and incorporated. Cues inconsistent with the framework are noticed but not fully integrated — they are explained away, attributed to noise, or simply not processed into the current situational model. The decision-maker remains on the original course because their situational model says they should be.

**Jones and Endsley's error taxonomy** (from the air traffic control study, cited in Zimmerman, p. 32) provides the structured version:
- Level 1 error: fail to observe data, or misperceive it
- Level 2 error: use incorrect mental model, or rely too heavily on default values
- Level 3 error: lack proper mental model for projection, or over-project current trends

**For agent systems:** Build change detectors that are independent of the current situation model. An agent that is executing based on Assessment A needs a parallel process monitoring for cues inconsistent with Assessment A. When inconsistent cues accumulate past a threshold, this process should trigger reassessment — not just note the discrepancy and continue. The reassessment mechanism must be able to interrupt execution, not just add a note to the log.

## The Unique Challenge of Predicting Human Behavior

Most NDM research domains involve decision-making about physical systems: fire behavior, aircraft systems, weather patterns, naval vessel movements. These systems are complex but follow physical laws. Human behavior is categorically more unpredictable.

"The ability to assess and predict human behavior is vastly more complex than predicting the behavior of non-human entities. Humans interact socially and interpret intentions and actions based on their own previous experiences, their emotions before and during the event, their mental state, personality traits, and previous knowledge or misinformation" (Feldman, 2004; Forsythe, 2004, cited in Zimmerman, p. 22).

Shanteau (1992) confirmed this empirically, finding that decision-makers in human-behavior domains (clinical psychologists, court judges, parole officers) perform significantly worse than decision-makers in physical-system domains (weather forecasters, test pilots, chess masters) — even with equivalent expertise. The task characteristics of human behavior prediction (dynamic, unique, unpredictable, limited decision aids and feedback) systematically undermine performance.

**For agent systems:** Agents operating in domains that require predicting or assessing human behavior — user intent, adversary strategy, social dynamics — should be designed with explicit uncertainty budgets that are wider than in physical-system domains. Confidence calibration for human behavior prediction is harder, and overconfidence in this domain is especially dangerous. The novel finding in Zimmerman's study — that police officers "used tactics aimed at manipulating the thought processes of the subject" (p. 71), actively shaping the decision environment — suggests an additional capability: agents in human-interactive domains should not just assess the situation but consider how their own actions change the human's situational assessment.

## Design Principles for Agent Situation Assessment

1. **Make situation assessment an explicit, separable phase.** Before action selection, require agents to construct and log a situation assessment: what type of situation is this, what are the key cues, what story best explains them, what should happen next?

2. **Test story completeness.** A situation assessment is incomplete if any observed elements are unexplained. Build explicit completeness checks: "Are there any cues in the environment that my current story does not account for?"

3. **Distinguish perception from comprehension from projection.** An agent can fail at any level of Endsley's hierarchy. Errors at Level 2 (comprehension) are particularly subtle because the raw data is correctly observed. Evaluate agents at each level separately.

4. **Build parallel monitoring for situation change.** Current action execution should always be accompanied by a monitoring process that asks: "Is the situation still what I think it is?" This process needs independent trigger conditions that can interrupt execution.

5. **Calibrate confidence in proportion to mental model match quality.** When the situation closely matches a known pattern, high confidence in the situational assessment is warranted. When the situation is novel, conflicting, or partially matched, confidence should be explicitly reduced and the assessment flagged as provisional.

6. **Widen uncertainty budgets for human behavior domains.** Agents predicting human behavior should maintain wider priors and update more cautiously than agents operating in physical-system domains.