# Recognition-Primed Decision Making: The Core Model and Its Architecture

## What This Document Teaches

This document describes the Recognition-Primed Decision (RPD) model — the empirically-derived framework for how expert decision makers actually function under operational conditions. It is drawn from Klein & Calderwood (1990), which synthesized seven field studies across urban fireground command, wildland fire incident command, and U.S. Army tank platoon leadership.

The RPD model is not a normative prescription. It is a descriptive account of what experts actually do — and it departs radically from what decision science has long claimed experts should do.

## The Central Discovery

When Klein and colleagues first studied experienced fireground commanders (FGCs), they were "surprised to find the commanders rejecting the notions that they were 'making choices,' 'considering alternatives,' or 'assessing probabilities.' They saw themselves as acting and reacting on the basis of prior experience, and generating, monitoring, and modifying plans to meet the needs of the situations."

The researchers "found no evidence for extensive option generation" and "little chance to observe tradeoffs between the utilities of outcomes." The FGCs were "more concerned with identifying actions that were 'workable,' 'timely,' and 'cost-effective'" than with finding optimal solutions.

This was not a failure of decision quality. These were the best performers in high-stakes environments. The finding forced a rethinking of what decision making actually is.

## The Three-Layer Architecture of RPD

The RPD model operates at three interlocking levels:

### Layer 1: Situation Assessment and Recognition

The foundational cognitive act is not option generation — it is situation classification. The expert scans incoming cues and asks (not consciously, but functionally): *What type of situation is this?*

This classification activates what Klein calls a "schema" or "script" — a structured package of knowledge containing:

**1. Plausible goals**: Not abstract utility functions, but concrete, context-bound objectives. The FGC doesn't ask "what maximizes expected value?" but "do I perform an interior attack, an exterior attack, or search-and-rescue?" Goals are meaningful through their contrast sets — what was chosen and what was not chosen.

**2. Critical cues and causal factors**: The expert's situation assessment includes a prioritized attention map. Rather than being overwhelmed by the environment (as novices report), the expert knows which cues matter and why. FGCs have "learned to quickly scrutinize the color of the flames. This cue has meaning in terms of fire temperature and, by inference, the types of materials that are burning. Similarly, patterns of smoke convey information about the intensity of the fire by the pressure with which smoke is being pushed out of the building." Perceptual cues carry causal implications that only years of experience can decode.

**3. Expectancies**: The expert holds specific, testable predictions about what should happen next. "An experienced FGC directed a stream of water at the area believed to be the seat of a fire. If correct, he expected the pattern and color of the smoke to change within 20-30 seconds. When he saw no changes after about 45 seconds he suspected the seat of the fire was elsewhere." Expectancy violation is the expert's primary error-detection mechanism. When the world doesn't match prediction, the situation assessment must be revised.

**4. Typical actions (the action queue)**: Recognizing a situation type automatically activates a queue of standard responses, ordered roughly by typicality. The expert doesn't generate options from scratch — they are retrieved as a package alongside the situation classification itself. "A familiar situation evokes a familiar set of actions."

The crucial insight is that for experienced decision makers in familiar-enough situations, this is *sufficient*. The classification happens, the action queue is retrieved, the first-listed action is implemented. No comparison occurs. No analysis occurs. The decision is made.

### Layer 2: Serial Evaluation via Mental Simulation

When the situation is ambiguous, the action is unusual, or there is enough time to check, the expert moves to Layer 2: mental simulation of the proposed action.

Klein's example of the rescue squad commander is illustrative. A young woman had fallen from a highway overpass and was lying face-down on a support strut. The commander needed to raise her to safety. Rather than generating all possible rescue equipment options and comparing them on a matrix of criteria, he:

1. Considered the Kingsley harness (standard equipment) — imagined its use — saw it wouldn't work from the front — saw that attaching from the back would put excessive strain on her back — rejected it.
2. Considered the Howd strap — imagined its use — same problems — rejected it.
3. Considered the ladder belt — imagined lifting her, slipping the belt under, buckling it, tying a rope to the snap — saw it working — selected it.

At no point did he compare option 1 to option 2 to option 3. He evaluated each in isolation, in sequence. "The decision maker reported that the whole decision took less than one minute."

This is serial evaluation: options are tested one at a time against the specific situation, not ranked against each other on abstract criteria. The evaluation tool is imagery — mental simulation of how the option would actually unfold in this particular context.

### Layer 3: Progressive Deepening

Progressive deepening is the process of imagining an option forward in time — step by step — to detect failure modes before they occur. It is "like running an 'instant pre-play' to see if anything might go wrong."

Klein traces this concept to de Groot's (1965/1978) work on chess grandmasters, who "follow out a line of play and make sure it does not lead to any blunders." De Groot's chess players "considered anywhere from 2 to 11 options but almost never compared one option to another."

Progressive deepening serves multiple functions:
- **Finding weaknesses** in an option before commitment
- **Repairing weaknesses** and improving the option rather than discarding it
- **Discovering new opportunities** that arise during imagined implementation
- **Revising the situation assessment** as imagined actions reveal new features of the problem

This last function is critical: progressive deepening is not linear. As the expert imagines executing an action, they may notice features of the situation they hadn't attended to before. The arrow in the RPD model's figure leads back from "Imagine Action" to "Recognize the Situation" — situation assessment and action evaluation are iterative, not sequential.

## The RPD Decision Cycle

Putting the three layers together, the RPD cycle operates as follows:

1. **Perceive**: Incoming cues from the environment enter awareness.
2. **Classify**: The expert matches cue patterns to prior experience, producing a situation type ("this is a search-and-rescue situation," not just "a burning building").
3. **Activate**: The situation type activates a package of (goals, cues to monitor, expectancies, typical actions).
4. **Check**: Are expectancies being met? If no, reassess — gather more information, reclassify.
5. **Select first action from queue**: The most typical action is proposed.
6. **Simulate**: Mentally run the action forward through the specific situation. Does anything go wrong?
7. **Accept, modify, or reject**: If the simulation reveals no fatal flaws, implement. If flaws are found, modify the action or reject and try the next in queue.
8. **Implement with monitoring**: Execute while watching for expectancy violations that would trigger reassessment.

## What Makes This Model Distinctive

Most decision models assume the decision maker is "faced with alternatives" — that options are presented like branches of a decision tree, ready to be evaluated and compared. The RPD model shows that for experts:

- Options are not pre-existing — they are generated sequentially from an experience-derived queue
- The first option generated is typically the best one (because it is the most typical for this situation type)
- Evaluation is serial and situational, not concurrent and abstract
- The expert almost always has a ready action available — they are never "stuck" waiting for analysis to complete
- Time pressure primarily affects the depth of Layer 2 and Layer 3 evaluation, not the quality of the Layer 1 recognition

## Application to Agent System Design

The RPD model is a blueprint for how high-performing AI agents should be architected for real-time, uncertain, high-stakes domains:

**Recognition = Pattern-to-Schema Retrieval**: Agents need not just data retrieval but schema activation — when cue pattern X is recognized, the associated (goals, monitoring criteria, expectancies, action queue) package should activate as a unit. This is richer than retrieval-augmented generation (RAG) — it is structured situational knowledge, not just relevant text.

**Serial Evaluation as Default**: Agents should default to proposing one action and simulating it rather than generating N options and comparing them on a scoring rubric. The latter is expensive, slow, and prevents ready-action availability.

**Progressive Deepening as Pre-Commitment Check**: Before committing to an action, agents should run a forward simulation: "If I do X, what happens at step 1? Step 2? Where might this fail?" This is not exhaustive checking — it is targeted simulation using domain knowledge.

**Expectancy-Based Monitoring**: After committing to an action, the agent should hold explicit expectancies about what should happen next. Violations of these expectancies should trigger reassessment, not just logging.

**Action-Readiness**: An agent should always have a current best action ready to execute. If interrupted mid-evaluation, it should be able to implement the best-so-far rather than reporting "analysis incomplete."