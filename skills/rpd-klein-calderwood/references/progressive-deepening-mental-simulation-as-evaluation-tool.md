# Progressive Deepening: Mental Simulation as the Expert's Evaluation Engine

## The Concept

Progressive deepening is the process by which expert decision makers evaluate an option without comparing it to other options. Rather than asking "how does this option rank against alternatives on a set of dimensions?", the expert asks "what would actually happen if I executed this option in this specific situation?"

The name comes from de Groot's (1965/1978) study of chess grandmasters. He observed that grandmasters would select a candidate move and then trace through the likely sequence of responses — move by move, anticipating the opponent's reactions, looking for where the line leads. They didn't compare candidate moves against each other. They deepened into each one, following it forward in time, until they found either a catastrophic flaw or a satisfactory outcome.

Klein extended this concept from chess to real-world command decisions, finding it operative in urban firefighting, wildland fire incident command, and military tactical decision making. In all these domains, "options are frequently evaluated through the use of images or a 'mental model' that operates as a simulation for judging whether an option will be successful in a specific case."

## The Mechanism: Forward Simulation in a Specific Context

What makes progressive deepening different from abstract option evaluation is its radical situational specificity. The expert is not asking "does this option have good properties in general?" but "would this option work *here*, *now*, in *this* configuration of constraints?"

Klein's example of the rescue squad commander is the clearest illustration. Given a woman lying face-down on a highway sign support strut, the commander imagined each rescue approach in that specific geometry: "He imagined how the victim would be supported, lifted, and turned. He imagined how the victim's neck and back would be protected. He said that he ran this imagining through at least twice before ordering the rescue, which was successful."

The Kingsley harness failed not because it is a bad rescue tool generally, but because in this specific situation (victim face-down, three people involved, limited space), attaching it from the front would require pushing the woman to a sitting position at risk to everyone, and attaching it from the back would stress her spine. These are situation-specific failure modes discoverable only through contextual simulation.

This is why progressive deepening requires both domain knowledge (to know what is likely to go wrong in general) and situational knowledge (to know what is likely to go wrong here specifically). Abstract evaluation cannot substitute for it.

## The Multiple Functions of Progressive Deepening

Progressive deepening serves more functions than simple flaw detection:

**Finding weaknesses**: The primary function — running the simulation forward to find where the plan breaks down. This requires knowing enough about the domain to predict realistic failure modes, not just logical possibilities.

**Repairing weaknesses**: When a flaw is found, the expert's first response is typically to ask whether the option can be modified to address it, not whether to abandon it. Klein notes that "the decision maker often tries to find ways of overcoming them, thereby strengthening the option." This option-strengthening capability is unique to serial evaluation — concurrent evaluation treats options as fixed and would be disrupted by mid-evaluation modification.

**Discovering new opportunities**: As the simulation runs forward, the expert may notice features of the situation that create opportunities not previously visible. "New opportunities that arise through implementing an option" are a regular byproduct of progressive deepening.

**Revising the situation assessment**: Perhaps most importantly, progressive deepening provides feedback to the situation assessment itself. "As actions are imagined, new features of the situation may be found" — which can change the expert's understanding of what type of situation they are in, potentially triggering a completely different course of action. This is why the RPD model's figure shows an arrow from "Imagine Action" back to "Recognize the Situation." The simulation loop is not downstream of situation assessment — it feeds back into it.

## The Contrast with Contingency Planning

Progressive deepening might seem similar to formal contingency planning — thinking through what could go wrong. But there is a crucial structural difference.

Systematic contingency planning examines plan assumptions exhaustively: "If the contingency planner checks for possible errors and oversights by examining as many assumptions as possible within the time available, this can be a very tedious process that could bog down in an exponential explosion of different factors and possibilities."

Progressive deepening is not exhaustive. The expert does not check every assumption — they check the *important* ones. Their domain knowledge allows them to know in advance which failure modes are most likely and most consequential. They focus simulation depth where it matters most.

Moreover, contingency planning typically requires the decision maker to first enumerate what to check and what to ignore — which requires examining everything to decide what not to examine. Progressive deepening bypasses this meta-level problem: the expert's tacit domain knowledge automatically directs attention to the most likely failure points without requiring explicit enumeration.

This is why "contingency planning by progressive deepening enables a skilled performer to be alert to important flaws in a plan without having to examine everything, and without having to decide what to examine and what to ignore."

## Expert vs. Novice Use of Progressive Deepening

Study 1 found that "Experts were almost twice as likely as Novices to consider future contingencies in their decision making." This is consistent with the broader pattern: progressive deepening requires a rich mental model of domain dynamics to simulate forward accurately. Novices lack this model, so their forward simulations are shallow, vague, and unreliable.

The armored platoon study showed this in the specific domain of hypothetical reasoning. Novices (armored officer basic students) could reason about "concrete hypotheticals" — factors concerning their own tank, immediate terrain. They struggled with "abstract hypotheticals" — platoon control, other friendly support, communications, enemy unit behavior. These abstract factors involve dynamics that are only visible from accumulated experience watching how situations unfold over time.

The expert's progressive deepening is rich with these higher-order dynamics because they have watched them operate in real situations. They know not just what typically happens next (shallow simulation) but what typically happens two or three steps downstream (deep simulation).

## Progressive Deepening and Error: The Failure Mode

Progressive deepening can fail in a specific and important way. If the expert's situation assessment is wrong — if they have classified the situation as type A when it is actually type B — their progressive deepening will simulate the wrong future. The simulation will be sophisticated, detailed, and internally coherent, and it will be evaluating the wrong option against the wrong backdrop.

This is a pernicious failure mode because the expert will feel confident. The simulation worked — it just worked on the wrong situation. The primary detection mechanism for this error is expectancy violation: as the expert monitors the unfolding situation, events that fail to match predictions should trigger reassessment. But if the expert's attention is captured by the execution of the chosen plan, they may not notice the diagnostic violations that would force reassessment.

The inappropriate analogue (discussed in the analogical reasoning document) is a related failure: a bad situation classification driven by the wrong comparison case, leading to a sophisticated but misdirected simulation.

## Application to Agent System Design

**Simulation as Core Evaluation Infrastructure**: Agent systems should invest in forward simulation capabilities, not just option scoring. The ability to run a proposed action forward through a model of the domain — step by step — and detect failure modes is the heart of RPD-style evaluation. This is richer than applying a scoring rubric.

**Contextual Simulation, Not Abstract Scoring**: When evaluating an option, the simulation should be grounded in the specific current situation — this topology, these constraints, this moment — not in abstract properties of the option type. An agent that scores "send an email" as 0.7 on a general utility function is not doing progressive deepening. An agent that imagines "if I send this email now, the recipient is currently in a meeting and likely won't see it until after the deadline, which means..." is approximating it.

**Feedback Loops Back to Situation Assessment**: Agent architectures should allow action simulation to revise the situation model. If simulating action X reveals a feature of the situation that changes the classification, that reclassification should propagate. This requires situation assessment to be a live, modifiable data structure, not a fixed input.

**Selective Depth, Not Uniform Depth**: The agent should not simulate all possible futures to equal depth. Domain knowledge (encoded or learned) should direct simulation effort toward the most consequential and most likely failure modes. Uniform depth is computationally expensive and misses the expert's efficiency advantage.

**Repair Before Rejection**: When simulation reveals a flaw in a proposed action, the agent should attempt to modify the action to address the flaw before moving to the next option. This option-strengthening step is often faster than rejection-and-replacement, and it preserves the expert's hard-won intuition about which action class is appropriate.

**Expectancy-Based Action Monitoring**: After committing to an action, the agent should maintain a forward model of expected events and monitor for violations. Violations should trigger progressive deepening on the current situation reassessment — not just logging.