# Progressive Deepening: Mental Simulation as the Evaluation Engine

## The Core Idea

When expert decision-makers evaluate a potential course of action, they do not score it against a set of abstract criteria. They simulate its execution. They "watch" the option being implemented, step by step, within the specific context of the current situation — looking for problems, finding opportunities, discovering implications that would not be visible from a static analysis.

Klein and Calderwood term this process "progressive deepening," borrowing the phrase from de Groot's (1965/1978) landmark study of chess grandmasters. De Groot found that chess masters, when analyzing a difficult position, would follow a line of play deep into the future — "deepening" their analysis along a single promising path before exploring alternatives. They were not doing breadth-first search across all possible moves; they were doing depth-first simulation along the most promising lines.

Klein and Calderwood generalize and enrich this concept. In operational decision-making, progressive deepening serves multiple functions simultaneously — and its outputs feed back into the situation assessment process, creating a recursive loop between understanding and action-planning.

## What Progressive Deepening Actually Does

Klein and Calderwood identify four functions of progressive deepening in operational settings:

**1. Finding weaknesses in an option.** By mentally simulating the implementation of an action, the decision-maker discovers where it might go wrong. This is not just checking against a checklist of known failure modes — it is running a generative simulation that can surface unanticipated problems. The rescue commander who imagines using a Kingsley harness on the trapped woman sees that positioning for front-attachment is geometrically impossible in her orientation. This is a failure mode he might not have had on a checklist, but it emerges naturally from the simulation.

**2. Finding ways to repair weaknesses.** When a weakness is found, the simulation continues — now exploring whether the weakness can be fixed. The decision-maker is not just evaluating; they are improving. An option that initially seems problematic may, with modification, become workable. This is why expert evaluation often produces strengthened options rather than simple accept/reject verdicts.

**3. Discovering new opportunities.** As the simulation proceeds, it may reveal aspects of the situation that create possibilities not initially visible. Imagining the implementation of an action can change the situation assessment — "as actions are imagined, new features of the situation may be found." (p. 16) The simulation is not just evaluating; it is exploring.

**4. Modifying the situation assessment.** This is perhaps the most important function. Progressive deepening feeds back into the understanding of the situation itself. As the decision-maker simulates an action and traces its consequences, they may discover that the situation is different from what they initially thought. The arrow in the RPD model diagram runs from "Imagine Action" back to "Recognize the Situation" — evaluation updates understanding, not just action choice.

## The Mental Model as Simulation Engine

Options are "frequently evaluated through the use of images or a 'mental model' that operates as a simulation for judging whether an option will be successful in a specific case." (p. v)

The mental model here is not a static representation — it is a dynamic, executable model. The decision-maker can run the model forward from the current state, injecting an action and tracing its consequences through the model's causal structure. Different from a lookup table, different from a scoring function, the mental model generates consequences that depend on the specifics of the current situation.

This has two important implications:

First, the quality of progressive deepening depends entirely on the quality of the mental model. A poorly calibrated mental model will generate misleading simulations — finding no problems where real problems exist, or generating false alarms. Expert decision-making depends on expert mental models: rich, causally accurate, dynamically faithful representations of how the domain works.

Second, the simulation is situation-specific. The same option may simulate well in one situation and poorly in another. This is why expert evaluation cannot be replaced by static option-scoring tables: the evaluation depends on the particulars of the current situation, not just the properties of the option in the abstract.

## The Rescue Example in Detail

Klein provides an extended example that rewards careful analysis:

> "The head of a rescue unit arrived at the scene of a car crash. The victim had smashed into a concrete post supporting an overpass, and was trapped unconscious inside his car. In inspecting the car to see if any doors would open (none would), the decision maker noted that all of the roof posts were severed. He wondered what would happen if his crew slid the roof off and lifted the victim out, rather than having to waste time prying open a door. He reported to us that he imagined the rescue. He imagined how the victim would be supported, lifted, and turned. He imagined how the victim's neck and back would be protected. He said that he ran this imagining through at least twice before ordering the rescue, which was successful." (p. 15)

This example illustrates several features:

**The decision-maker ran the simulation multiple times.** Not once, checking for obvious problems, but at least twice — going back to verify that the solution held up on re-examination. Progressive deepening is iterative.

**The simulation was embodied and specific.** The commander didn't ask "is this option safe?" He imagined *how* the victim would be supported, *how* she would be lifted, *how* her neck and back would be protected. The simulation was in the specific, physical details of the action, not at an abstract level.

**The simulation informed the decision to proceed.** The commander was sufficiently confident in the simulated outcome — having run it multiple times without finding problems — to order the rescue. The simulation replaced, rather than supplemented, abstract criteria-based evaluation.

**Opportunity recognition enabled the simulation.** The whole process was triggered by an observation (all roof posts severed) that created a possibility. The decision-maker noticed a feature of the situation that most people would pass over, and that feature opened up an option worth simulating. This illustrates the connection between situation assessment (noticing the right cues) and progressive deepening (simulating the implications).

## How Progressive Deepening Differs from Contingency Planning

Klein draws an important distinction between progressive deepening and formal contingency planning:

Contingency planning can become systematic and exhaustive — examining all possible assumptions, all possible branches, all possible failure modes. This thoroughness can be valuable, but it has a critical flaw: it suffers from what Klein calls an "exponential explosion of different factors and possibilities." Systematic contingency planning can become so computationally expensive that it bogs down the decision process.

Progressive deepening is selective and guided. The skilled decision-maker is "alert to important flaws in a plan without having to examine everything, and without having to decide what to examine and what to ignore (which entails first examining everything)." (p. 16)

The selectivity of progressive deepening is not random — it is guided by the mental model. The simulation naturally focuses attention on the junctions where things are most likely to go wrong, because those are the junctions where the mental model generates high uncertainty or high consequence. A skilled simulator, like a skilled chess player following lines of play, develops intuition for which branches are worth deepening and which can be pruned.

## Implications for Agent Evaluation Architecture

For multi-agent systems, progressive deepening suggests a specific approach to option evaluation:

**Build executable forward models.** Agent systems need not just state representations but executable causal models — models that can be given an action and will generate predicted consequences. These models should be situation-specific (conditioned on current context) and dynamic (able to step forward through time).

**Evaluate through simulation, not scoring.** When an agent is asked to evaluate an option, its output should be a simulated trace of consequences, not a scalar score. The consuming system can inspect this trace to understand not just whether the option is good or bad, but *why* — which steps in the execution are problematic, which are promising.

**Allow evaluation to update situation assessment.** Agent systems should be designed so that the output of option evaluation can feed back into situation classification. If simulating an action reveals that the situation is different from what was assumed, this should trigger a reassessment cycle — not just a rejection of the option.

**Iterate evaluation until confident.** The rescue commander ran his simulation "at least twice." Agent evaluation systems should similarly not just run one forward pass but iterate until confidence thresholds are met or until time pressure requires a decision.

**Multi-function evaluation.** The outputs of simulation-based evaluation should include: (1) go/no-go verdict, (2) identified weaknesses, (3) proposed repairs to those weaknesses, (4) new opportunities revealed, (5) updates to situation assessment. A system that returns only a score has lost most of the value of the evaluation.

**Simulation depth as a quality dial.** The depth of progressive deepening can be calibrated to available time. Under high time pressure, run a shallow simulation (one or two steps ahead). With more time available, deepen the simulation. This creates a natural quality-time tradeoff that degrades gracefully rather than catastrophically.

## The Connection to Imagery

Klein and Calderwood note that imagery plays a central role in progressive deepening — decision-makers literally visualize the execution of an option. For computational agents, the analogue is a forward-simulation module that can generate predicted state sequences given an action.

This has implications for agent system design:
- Agents need access to world models that can be queried forward
- The world model should generate predictions in a format that downstream evaluation can inspect, not just a scalar outcome
- Evaluation of multi-step plans should trace each step, not just the final state

The expert's imagery is rich, causal, and multisensory. The agent's simulation should similarly be rich in detail at the steps where detail matters most — which is determined by the mental model's estimate of where uncertainty and consequence are highest.