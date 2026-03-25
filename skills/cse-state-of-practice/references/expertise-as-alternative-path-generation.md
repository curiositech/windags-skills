# Expertise as the Capacity to Generate Alternative Paths

## What Expertise Actually Is

The cognitive systems engineering research tradition — drawing on decades of fieldwork across aviation, medicine, firefighting, military command, weather forecasting, and industrial operations — arrived at a definition of expertise that is both simple and radical:

**Expertise is not the ability to execute a known procedure faster or more accurately than a novice. Expertise is the ability to recognize when known procedures are insufficient and to generate effective alternative paths to the goal.**

This distinction sounds minor until you confront its implications for system design. If expertise were primarily about procedure execution speed and accuracy, you would design systems to make procedure execution easy, fast, and error-resistant — and you would be done. If expertise is primarily about alternative path generation, the design requirements are completely different. You need to support recognition of deviation from normal conditions. You need to support rapid access to the knowledge that grounds alternative strategies. You need to support the evaluation of alternatives against current conditions. And you need to get out of the way when the expert needs to improvise.

## The Knowledge That Makes Alternatives Possible

Why can the weather forecaster work around a failed radar uplink when a novice cannot? Because the forecaster has a *model of the problem* that is not identical to the procedure for solving it.

The novice has learned: step 1, check radar; step 2, check surface observations; step 3, check upper air data; step 4, issue forecast. The procedure is the knowledge. When step 1 fails, the novice has lost an irreplaceable input and the procedure is broken.

The expert has learned something different: what radar data contributes to the forecast. The expert knows that radar tells you about precipitation intensity and movement, about mesoscale circulation patterns, about storm structure. And the expert knows that some of this information is also available — less directly, less precisely, but available — in satellite imagery, in surface pressure tendencies, in pilot reports, in the model guidance. The expert can construct an approximate substitute for the failed channel because the expert knows what the channel was providing, not just when to access it.

Hoffman et al. (2002) capture this: "knowledge permits the creation of alternative paths to the goal." The knowledge in question is specifically deep causal, structural, functional knowledge about the problem domain — not procedural knowledge about how to solve it. These are not the same thing, and systems that focus exclusively on the latter will not produce experts.

## Naturalistic Decision Making: How Experts Actually Choose

The work of Gary Klein — one of the authors of the foundational CSE paper — on Naturalistic Decision Making (NDM) provides the most detailed account of how experts make decisions under real-world conditions. The picture that emerges from NDM research is not the picture that classical decision theory would predict.

Classical decision theory imagines expert decision-making as: enumerate options, assess probability and utility of each, select the option with the highest expected value. Extensive field observation found that experienced practitioners almost never do this. Instead:

1. **They recognize situations.** Experienced practitioners rapidly classify incoming information into situation types they have encountered before. This classification is not a deliberate analytical process — it happens automatically, as a product of accumulated pattern recognition developed over many exposures.

2. **They generate a single option.** Based on the recognized situation type, they generate a single candidate action. Not a list of options to compare — one option.

3. **They mentally simulate the option.** Before committing, they run a rapid forward simulation: if I do this, what happens? They are checking the option for obvious problems, not comparing it against alternatives.

4. **They either proceed or adjust.** If the mental simulation reveals no problems, they proceed. If it reveals a problem, they modify the option and re-simulate — they don't go back to option generation and start over.

Klein called this Recognition-Primed Decision making (RPD). It has been replicated across domains ranging from chess to firefighting to intensive care nursing. And it has a critical implication: **expert decision-making is primarily a pattern-recognition and simulation process, not an optimization process.**

This means that expert decision quality depends almost entirely on the quality of the expert's mental model — their internal representation of how the domain works, what situations look like, what actions are available, and what consequences follow from actions. Degrade the mental model, and you degrade the decisions. Build a system that prevents the formation of accurate mental models, and you prevent expertise from developing.

## The Novice-Expert Continuum in Agent Systems

CSE research on the development of expertise — drawing on the work of Chi, Glaser, Farr, Ericsson, and others — has established a fairly clear picture of the novice-to-expert continuum:

**Novices** have explicit, declarative rules. They follow procedures deliberately and effortfully. They have difficulty detecting when rules don't apply. They cannot generate alternatives when procedures fail.

**Advanced beginners** have begun to recognize recurring patterns. Their rule application becomes less effortful. They can handle anticipated variations but not unanticipated ones.

**Competent practitioners** have a more integrated knowledge structure. They can prioritize — recognize which aspects of a situation are important and which can be ignored. They begin to take ownership of outcomes (not just procedure execution).

**Proficient practitioners** have rich situational awareness. They recognize when situations are developing in anomalous directions, often before they can articulate why.

**Experts** have the full package: automatic situation recognition, rich alternative path generation, ability to operate effectively in novel situations that don't map onto any stored template.

The design lesson for AI agent systems is direct: **an agent's effective expertise level is determined by the quality and richness of its internal representations, not by the sophistication of its reasoning algorithms.** An agent with impoverished representations of its task domain will make novice errors regardless of how clever its reasoning engine is. An agent with rich, grounded, causally-structured domain representations will handle novel situations gracefully — because it can generate alternatives, not just execute procedures.

## Knowledge Elicitation: Getting Expert Knowledge Into Agents

One of CSE's major practical contributions is the development of methods for eliciting tacit expert knowledge — the knowledge that experts have but cannot easily articulate, because it has been automated through practice and is no longer accessible to conscious introspection.

Hoffman, Crandall, and Shadbolt (cited in the source material) developed the Critical Decision Method: a structured interview technique that probes experts' decisions in past critical incidents, specifically designed to surface the tacit knowledge that underlies expert performance. The method asks not "what do you do in situation X?" but "tell me about a time when you faced situation X. Walk me through what you noticed, what you considered, what you did, and what happened." This narrative reconstruction surfaces the recognitional patterns, the alternative strategies, the cues that signal situation types — the knowledge that procedural documentation never captures.

For AI agent systems, the analog is: **what is the equivalent of the Critical Decision Method for extracting expert knowledge into agent representations?** This is not a rhetorical question. The quality of agent performance is bounded by the quality of the knowledge embedded in the agent. If that knowledge was extracted by asking "what steps do you follow?" rather than "how do you recognize when the standard approach won't work?", the agent will perform at a novice level in exactly the situations where expert performance matters most.

## Implications for Agent Design and Orchestration

**Design agents around goal representations, not procedure representations.** An agent that knows *what it is trying to achieve* — the epistemic goal, the functional purpose — can adapt when the nominal procedure is unavailable. An agent that only knows *what steps to execute* cannot.

**Build recognition capability before planning capability.** The bottleneck in expert performance is usually situation recognition, not action generation. An agent that can accurately classify the current situation into a rich taxonomy of types can rapidly access the appropriate response strategies. An agent that must plan from scratch in every situation will be slow, error-prone, and brittle.

**Enable mental simulation — forward modeling of action consequences.** Expert performance depends heavily on the ability to rapidly evaluate candidate actions by simulating their consequences. Agents that can project forward — "if I take action X in situation S, what is the likely state at time T?" — will select better actions and catch their own errors before they propagate.

**Represent the boundary conditions of every strategy.** Expert practitioners know not just what to do but *when not to do it*. They know the conditions under which strategy A is appropriate and conditions under which it fails. This conditional knowledge — the meta-knowledge about strategy applicability — is often the most valuable expert knowledge and the hardest to elicit. It must be explicitly represented in agent systems.

**Create mechanisms for agents to signal "outside normal operating envelope."** When an agent is operating in territory where its stored patterns don't apply well, it should be able to signal this — to request additional guidance, to escalate to a more capable agent, or to proceed with explicit uncertainty flags. Silent operation outside the training envelope is the agent-system equivalent of an automation surprise.