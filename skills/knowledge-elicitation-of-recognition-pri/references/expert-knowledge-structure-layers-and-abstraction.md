# The Layered Structure of Expert Knowledge: From Perception to Strategy

## Introduction: Knowledge Is Not Flat

One of the most important structural insights in Klein and MacGregor's work is that expert knowledge is not a flat list of rules. It is organized in distinct layers, each serving a different function in the recognition-primed decision architecture. Understanding these layers is essential for building agent systems that can replicate — or at least approximate — the depth of expert performance.

Klein and MacGregor's framework distinguishes between "domain-independent" knowledge, "domain-specific" knowledge of facts and procedures, "domain-specific" knowledge of causal interactions, and "perceptual-motor knowledge" (p. 3). But the CDM adds additional granularity through its probe types (Table 1, p. 23), which together produce a map of the knowledge layers that constitute expertise:

1. **Perceptual discriminations**: What cues can the expert detect that novices miss?
2. **Causal models**: How does the expert understand the dynamics of the domain?
3. **Prototypicality judgments**: How does the expert classify situations into types?
4. **Analogical knowledge**: How does the expert use past cases to inform current decisions?
5. **Goal and priority structures**: What is the expert trying to accomplish, and how does this shift?
6. **Structural/procedural knowledge**: What rules and procedures apply in this domain?

## Layer 1: Perceptual Discriminations

The foundational layer of expertise is perceptual. Before any reasoning occurs, the expert must perceive the right things — notice the cues that novices miss, attend to the features that are diagnostically significant.

The CDM's cue probes target this layer explicitly: "What information relevant to the decision was available and how was it obtained?" and "How confident was the officer in the information?" (Table 3, p. 27). The Critical Cue Inventory is the primary product of this layer — a structured record of what the expert perceives and what those perceptions mean.

The paramedic study provides the clearest example. The CCI produced by CDM analysis documented the cues that allowed expert paramedics to recognize heart attack victims *before* the standard clinical signs appeared. These were perceptual discriminations — subtle features of patient appearance, behavior, and reported experience — that were completely invisible to novices but that experts had learned to notice through accumulated case exposure.

What makes this layer distinctive is that **it cannot be transferred through rule-based instruction**. You cannot tell someone to "notice the subtle cyanosis around the lips" if they don't have the perceptual calibration to see it. Perceptual expertise must be developed through exposure to annotated examples — which is why the CCI produced by CDM analysis is directly usable as training material (in the paramedic study, it became the basis for a training videotape).

**For agent systems**: The perceptual layer corresponds to the *feature extraction* and *attention* mechanisms of an agent. What features does the agent extract from its input? Which features does it attend to? These choices are not neutral — they encode assumptions about what matters. The CCI provides an empirically grounded basis for these choices in any domain where human expert performance has been CDM-analyzed.

## Layer 2: Causal Models

The second layer is the expert's understanding of *why things happen the way they do*. Causal models enable forward projection — if the current situation is X, and the agent takes action A, what will happen? If no action is taken, how will the situation evolve?

CDM causal factor probes target this layer: "What made you expect the fire to spread that way?" "Why did the roof construction matter?" The causal model is the machinery behind expectancies — it is what makes expectations possible.

In fireground command, causal models connect:
- Building construction to fire spread rate
- Smoke color and behavior to fire temperature and composition
- Weather conditions to fire dynamics
- Resource levels to time-to-control estimates

These are not rules ("if building is old wood-frame then fire spreads fast"). They are dynamic relational models that allow continuous projection under varying conditions. The expert doesn't just know *that* old buildings are more dangerous — they know *how much more* dangerous, *under what conditions*, *at what rate*, and *what specific actions change this trajectory*.

**For agent systems**: Causal models are the machinery of predictive capability. Agents with explicit causal models can anticipate consequences, project trajectories, and evaluate actions prospectively rather than reactively. Building causal models from CDM analysis is more reliable than inferring them from statistical regularities in training data, because statistical models may capture correlations without the underlying mechanisms.

## Layer 3: Prototypicality and Situation Typing

The third layer is the expert's ability to classify situations as instances of known types — to "recognize typicality" in the language of the RPD model (Figure 4, p. 18). This is the layer that makes recognition-primed decision-making possible: without reliable situation typing, there is nothing to prime.

Prototypicality judgments are not binary (this is/is not type X) but continuous (this is more or less typical of type X). The expert's situation typing involves:
- Recognizing the core features that define each type
- Understanding the variability within types (how much can features vary and still be type X?)
- Recognizing borderline cases where typing is uncertain
- Understanding the implications of misclassification (what happens if I treat this as type X when it's actually type Y?)

CDM analogues probes access this layer: "Does the incident fit a standard scenario that you have ever seen or been trained for? Probe basis for match, differences/modifications" (Table 2, p. 26).

The distinction between types is often not about obvious features but about subtle causal or consequential differences. Two fires may look similar visually but be typed differently because of differences in building construction or chemical content that affect the hazard level and appropriate response.

**For agent systems**: Situation typing is the classification layer — the module that assigns incoming situations to types before activating type-specific knowledge. The fidelity of this classification directly controls the quality of everything downstream. Building the classifier from CDM-elicited typology (using the actual distinctions that matter to domain experts) is far superior to building it from arbitrary feature clustering.

## Layer 4: Analogical Knowledge

The fourth layer is the expert's case library — the accumulated store of past incidents that provide templates for current situations. Analogical reasoning draws on this library: "this reminds me of the billboard fire, where the supports burned through unexpectedly."

The CDM's analogue probes surface this layer explicitly (Table 1, p. 23), asking experts to identify past cases that were similar to the current situation and to articulate the similarities and differences. This is the layer that explains why experienced experts handle novel problems better than inexperienced ones even when the novel problem doesn't match any previously encountered type exactly: the expert can construct an analogy to a related case and reason about the differences.

Analogical knowledge is particularly important for handling edge cases — situations that fall in the gap between known types. The expert doesn't abandon all knowledge when facing a truly novel problem; they find the closest analogue and reason about how it differs.

**For agent systems**: The case library is a first-class knowledge representation that should be built explicitly, not just left implicit in model weights. Case-based reasoning systems that retrieve relevant past cases and adapt their solutions provide more transparent and controllable analogical reasoning than purely statistical models. The CDM's products — annotated incident accounts — are the raw material for building these case libraries.

## Layer 5: Goal and Priority Structures

The fifth layer is the dynamic goal structure that shapes what the expert is trying to accomplish at each moment. Goals are not static: they shift as the situation evolves, and the ability to manage these shifts competently is a hallmark of expertise.

CDM goal probes target this layer: "What was the command objective?" "What subsidiary goals were active?" "Was there a goal shift — a radical change in situational assessment?" (p. 23-25).

Goal structures are hierarchical: a top-level goal (life safety) generates sub-goals (evacuate building, establish protective streams, control fire spread) that in turn generate tactical objectives. When new information arrives, the expert may need to reorganize this hierarchy — abandoning a goal that is no longer achievable, elevating a sub-goal to primary status, or introducing entirely new goals.

The SA-Shift is often driven by goal restructuring. The fireground commander who realizes that the fire cannot be controlled and must shift from firefighting to evacuation has experienced both an SA-Shift and a fundamental goal restructuring. The ability to make this shift quickly and completely — rather than persisting in the original goal structure despite contradicting evidence — is a critical expert capability.

**For agent systems**: Goal management is a first-class architectural component, not a peripheral concern. Agents should maintain explicit goal hierarchies that can be dynamically restructured as new information arrives. The ability to detect when a goal has become unachievable and to reorganize around a new goal — an SA-Shift at the goal level — should be built in as a specific capability, not assumed to emerge from general-purpose optimization.

## Layer 6: Structural and Procedural Knowledge

The sixth and most surface layer is the explicit rules and procedures that can be directly articulated. This is what standard task analysis and knowledge engineering elicits: "in situation X, do Y." "Follow procedure Z." "Check list item A before proceeding to B."

This layer is real and important. Expert performance is grounded in thorough knowledge of domain procedures. But it is insufficient on its own — as Klein and MacGregor note, "Catalogs of domain facts, rules, and procedures alone, however, are insufficient to capture the qualitative aspects of expertise" (p. 3). The expert who knows only the rules will fail at the boundary of routine, where the rules run out or conflict.

**For agent systems**: Procedural knowledge is a necessary but insufficient foundation. Build it first, but don't stop there. The deeper layers — perceptual, causal, typological, analogical, goal-structural — are what differentiate capable agents from brittle rule-followers.

## Integration: How the Layers Work Together

These six layers do not operate sequentially. They are simultaneously active, feeding into each other in a continuous, parallel fashion that is characteristic of expert performance:

1. Perceptual discriminations produce cues
2. Cues activate causal models and typicality judgments
3. Typicality judgments activate situation types
4. Situation types activate goals and action queues
5. Analogues from the case library provide comparison points for ambiguous situations
6. Procedural knowledge provides the execution templates for selected actions

The speed of expert performance comes from the fact that these layers are tightly integrated and operate in parallel — not from the simplicity of any single layer. The expert doesn't first perceive, then classify, then access causal knowledge, then consult goals, then check procedures. It all happens together, in a holistic flash of situational understanding.

**For agent systems**: Tight integration between the knowledge layers is as important as building each layer correctly. A system that does perceptual analysis correctly but connects its percepts to a misaligned causal model will fail. A system that does situation typing correctly but activates the wrong goal structure from that type will fail. The integration architecture — how knowledge flows between layers — is as important as the knowledge itself.

## The Expert-Novice Difference, Revisited

Understanding the layered structure makes the expert-novice difference precise. The novice:
- Has procedural and structural knowledge (the rules and facts from training)
- Lacks perceptual calibration (can't notice the critical cues)
- Lacks rich causal models (can't project consequences accurately)
- Lacks situation type library (can't classify novel variants)
- Lacks case library (no analogues to draw on)
- Has rigid goal structures (can't shift goals fluidly when situations change)

The expert:
- Has all the procedural knowledge the novice has, plus
- Rich perceptual discrimination (notices what matters)
- Deep causal models (understands dynamics, projects consequences)
- Large, well-calibrated situation type library
- Extensive case library organized by relevant features
- Flexible, dynamically managed goal structures

Development from novice to expert is not primarily about learning more rules. It is about building out the deeper layers — developing perceptual sensitivity, building causal models, accumulating cases, refining situation typing, and developing flexible goal management.

## Summary

Expert knowledge has a layered structure: perceptual discriminations, causal models, prototypicality judgments, analogical knowledge, goal structures, and procedural knowledge. Each layer serves a distinct function in the RPD architecture. None is sufficient alone; together they enable the rapid, accurate, holistic performance that characterizes genuine expertise. For agent systems, building all six layers explicitly — and integrating them in architectures that allow parallel, interactive processing — is the path from brittle rule-following to robust expertise.