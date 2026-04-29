# Expert and Novice Error Patterns: Different Failures Requiring Different Interventions

## The Asymmetry of Error

One of the most important practical implications of the RPD framework is that expert and novice decision makers fail in fundamentally different ways. Interventions designed to prevent novice errors may be useless or harmful when applied to experts, and vice versa. Understanding the error taxonomy is essential for designing systems that support performance at multiple levels of expertise.

## Novice Error Pattern 1: Inference Failure on Correct Cues

The most consistent finding across multiple studies is that novices notice the same cues as experts but draw fewer and weaker inferences from them.

"Whereas experts and novices notice the same cues in a situation, novices draw fewer inferences based on these cues. Novices tend to miss the tactical implications of situational cues."

The novice sees the same smoke color as the expert. They may even know abstractly that smoke color is relevant. But they fail to generate the causal chain: smoke color → fire temperature → burning materials → fire behavior → tactical constraints → action implications. Each step in this chain is a potential inference failure point.

The practical consequence is that novices may take correct data and reach incorrect situation assessments — not because they missed information, but because they lacked the causal model to interpret it. Their errors look like "wrong situation assessment" but the underlying cause is "incomplete inference chain."

**Intervention**: Provide explicit causal chain training — not just "attend to smoke color" but "smoke color indicates temperature because X, which tells you about burning materials because Y, which constrains your interior attack options because Z." Building the inference chain, not just the cue list, is the training priority.

## Novice Error Pattern 2: Shallow Temporal Reasoning

Novices reason primarily about the current state. Experts reason about the current state plus its likely trajectory.

The armored platoon study quantified this: novices showed much weaker inclination to consider hypotheticals — alternative future states — especially abstract hypotheticals involving platoon control, communications, enemy unit behavior. The more the hypothetical required reasoning about system dynamics over time, the greater the expert-novice gap.

This temporal shallowness has several consequences:
- Novices are reactive (responding to events) rather than proactive (acting in anticipation of events)
- Novices miss precursor cues that indicate where the situation is heading
- Novices fail to plan for contingencies that experts would consider obvious
- Novices' timing of actions may be poor — acting too early (before conditions are right) or too late (after the opportunity has passed)

**Intervention**: Scenario-based training that emphasizes temporal reasoning — requiring novices to explicitly predict what will happen next, then see whether their predictions were correct. Building the habit of forward modeling is the goal.

## Novice Error Pattern 3: Inappropriate Option Generation

When novices face uncertainty, their primary compensatory strategy is option generation — they try to enumerate alternatives and compare them analytically. This is the strategy the prescriptive models recommend, and it does describe what novices actually do.

The problem is that novice option generation is often of poor quality. Options are generated without strong situational grounding, so the list may include options that are not actually viable for this situation. Options may be generated in an order unrelated to their likely effectiveness. Evaluation of generated options may be poorly structured.

The novice is doing the right process (explicit deliberation) but lacks the knowledge base to do it effectively. Their concurrent evaluation is slower than expert recognition and produces lower-quality results — not because they are using the wrong process, but because they lack the domain knowledge to execute it well.

**Intervention**: For novices, structured analytical decision aids (checklists, evaluation rubrics, decision trees) can partially compensate for limited domain knowledge by providing scaffolding for option generation and evaluation. These aids should be understood as novice tools with an expiration date — as expertise develops, reliance on analytical scaffolding should decrease.

## Novice Error Pattern 4: Analogue Misapplication

Novices use analogical reasoning, but at a higher rate of error than experts. "Almost half the analogue use by novices results in poor choices."

The novice error is not in using analogues — it is in failing to adapt them. "Novices appear to rely more heavily than experts on analogical reasoning, but have not learned how to apply the analogues, modify them, or reject them."

The novice finds a past case that superficially matches the current situation and applies its implied response wholesale, without checking whether the differences between the cases are consequential. The expert applies the analogue as a starting point and explicitly adjusts for relevant differences.

This error is particularly dangerous because it produces confident wrong actions. The novice who has found a "matching" case feels they know what to do. Their decision is quick and definite — it just may be wrong.

**Intervention**: Train explicit analogue adaptation protocols: when using a past case as a guide, explicitly enumerate the differences between the past case and the current situation, then check whether each difference is consequential for the implied response. If consequential differences exist, modify the response accordingly or find a better analogue.

## Expert Error Pattern 1: Situation Misclassification

The expert's primary failure mode is classifying the situation as the wrong type. If the situation assessment is wrong, everything downstream — goals, critical cues, expectancies, action queue — is optimized for the wrong situation.

Situation misclassification is dangerous precisely because it is not visible. The expert is confident, their processing is smooth, their actions are coherent — within the wrong frame. They are effectively solving the wrong problem very well.

Misclassification typically occurs at the edges of prototype coverage — when the current situation resembles situation type A in most respects but differs in the specific ways that would make type B's response more appropriate. The expert's pattern recognition fires on the resemblance and misses the critical difference.

**Detection**: Expectancy violation is the primary detection mechanism. When events don't match what the expert predicted, this signals that the situation assessment may be wrong. But this requires the expert to actually monitor expectancies rather than focusing solely on plan execution — a habit that must be cultivated.

**Intervention**: Develop "situation reconsideration triggers" — specific conditions that should prompt the expert to explicitly question whether their current situation assessment is correct. Near-miss incidents should be analyzed specifically for misclassification patterns.

## Expert Error Pattern 2: Inappropriate Analogue Retrieval

When experts face non-routine situations, they rely on analogues to bridge the gap between the generic prototype and the specific case. If the retrieved analogue is inappropriate — structurally similar in the wrong ways — it drives the situation assessment, option generation, and progressive deepening toward the wrong solution.

"Inappropriate analogues are a primary cause of errors" in expert decision making.

The insidiousness of this error pattern is that it occurs precisely in the situations where the expert's recognitional processing is most stressed — the non-routine cases. It is the cases where expert judgment is most needed that are most vulnerable to this failure mode.

**Detection**: When an expert is using an analogue explicitly (they report being reminded of a specific past case), that is a moment for intervention — asking whether the analogue is truly appropriate, whether the relevant causal features match.

**Intervention**: Training to recognize when an analogue may be inappropriate. Developing the meta-cognitive habit of asking "how is this situation different from the case I'm thinking of? Do those differences matter?" when relying on analogical reasoning.

## Expert Error Pattern 3: Progressive Deepening Failure

Even when situation assessment is correct, progressive deepening can fail to detect a fatal flaw. This happens when:

- The expert's forward model is inaccurate in a specific respect relevant to this situation
- The time available for progressive deepening is insufficient to detect the flaw before commitment
- The expert's attention during simulation is captured by salient features and misses less salient but more critical ones

Progressive deepening failure is different from situation misclassification because the situation is correctly assessed — the expert knows what type of situation they're in and is simulating the right option class — but the simulation is incomplete or inaccurate in a way that allows a fatal flaw to pass undetected.

**Detection**: Post-hoc analysis of failures should examine whether the committed option would have "passed" a more thorough progressive deepening. If so, the failure is in the depth or accuracy of the simulation, not in the option selection.

**Intervention**: Explicit checklists for high-frequency failure modes in specific option types. Rather than asking experts to simulate exhaustively (which is neither possible nor desirable), identify the specific known failure modes for each option class and ensure those are always checked.

## The Error Pattern Inversion: What This Means for Training and System Design

The most important implication of the expert/novice error taxonomy is that effective interventions are different at different expertise levels — and interventions targeted at novice errors may be harmful when applied to experts.

Telling a novice to "generate more options" is good advice — they are not generating enough, and what they generate may be poorly grounded. Telling an expert to "generate more options" is harmful — it prevents their recognition capabilities from operating and makes performance worse.

Giving a novice a structured decision matrix provides scaffolding they genuinely need. Giving an expert the same matrix imposes analytical overhead that prevents their superior strategy from operating.

Providing a novice with explicit causal chains ("smoke color means X because Y") fills gaps in their knowledge base. An expert already has these chains internalized — providing them is neutral at best.

**For Agent System Design**:

**Expertise-Level-Aware Architecture**: Agent systems should adapt their decision process to their expertise level in a given domain. In domains where schema libraries are rich and validated, use RPD-style fast paths. In domains where schemas are thin, use more analytical protocols with explicit option generation and evaluation scaffolding.

**Error Detection Appropriate to the Mode**: For recognition-mode operation, the critical error detector is expectancy violation monitoring. For analytical-mode operation, the critical error detector is option generation completeness checking and evaluation consistency. Different modes require different error detection infrastructure.

**Failure Mode Libraries**: Maintain libraries of known failure modes for each option class, indexed by situation type. Progressive deepening should preferentially check against these known failure modes rather than performing exhaustive simulation.

**Misclassification Red Flags**: Maintain a set of "situation reconsideration triggers" — observable conditions that historically indicate that the current situation classification may be wrong. When these triggers fire, the agent should explicitly pause and recheck its situation assessment before proceeding.

**Analogue Validation Protocols**: When analogical reasoning is invoked (explicitly or detectably), apply a structured validation step: enumerate the key differences between the analogue and the current situation, check whether any of those differences are causally relevant to the implied response, and modify accordingly if they are.