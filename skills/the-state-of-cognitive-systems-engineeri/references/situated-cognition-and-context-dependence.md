# Situated Cognition: Why Context Is Not Optional Background

## The Standard Model and Its Failure

Classical cognitive science, and much early AI, operated with a model of cognition as symbol manipulation: the mind receives inputs, applies rules to those inputs (stored in memory), and generates outputs. In this model, context is a relatively minor factor — it provides the inputs, but the processing that matters happens in the isolated cognitive system.

Lucy Suchman's *Plans and Situated Actions* (1987), Jean Lave's *Cognition in Practice* (1988), and Edwin Hutchins' *Cognition in the Wild* (1995) demolished this model through careful empirical investigation of actual cognitive performance in actual settings. Their finding, replicated across many domains and methods, is that cognition is *situated* — irreducibly bound to the specific context in which it occurs, in ways that the standard model cannot capture.

This is not merely a theoretical point. It has direct, practical implications for how AI agent systems should be designed.

## What "Situated" Actually Means

Situated cognition means that intelligent behavior cannot be understood — and cannot be built — by abstracting away the specific context in which it occurs. The context is not background noise to be controlled out; it is *constitutive* of the intelligence.

Several specific claims follow from this:

**Intelligence is distributed across person and environment**: The expert navigator does not carry a complete mental model of the ship's position. The navigation computation is distributed across the navigator's knowledge, the instruments, the charts, the log, the communication with other crew members, and the physical structure of the bridge. Remove any of these components and the navigation system degrades — not because the individual navigator has lost knowledge, but because the distributed cognitive system has lost a component.

**Action is responsive to local conditions, not to plans**: Suchman's analysis showed that human action is organized *in response to circumstances* — it is not the execution of a pre-formed plan. Plans exist and are useful, but they are *resources for action* rather than *specifications of action*. When you are about to run a planned route and discover that the road is closed, you don't execute the plan — you use the plan's goal (reach the destination) to improvise an alternative path in response to the local condition (closed road). The plan enabled the action without determining it.

**Context provides resources that cognition exploits**: Experts routinely exploit environmental structure to reduce cognitive load. The chess player can think about positions by manipulating the pieces rather than carrying all possibilities in working memory. The programmer uses the code's structure on screen rather than maintaining a complete model internally. The navigator uses landmarks to orient rather than computing position from scratch. This exploitation of environmental structure is not cheating — it is fundamental to how intelligence actually operates.

**Categories are context-dependent**: What counts as an instance of a concept depends on the context. Lave showed that mathematical understanding is context-dependent in ways that formal mathematics education often misses: people who cannot solve arithmetic problems in test conditions can solve formally identical problems in everyday shopping contexts. The "knowledge" is not stored in an abstract form that transfers across contexts — it is organized around the contexts in which it was developed.

## The Implications for "Plans" and "Goals" in Agent Systems

Suchman's analysis of plans versus situated action is particularly important for agent system design. She argues that plans — representations of intended future action — are always incomplete specifications of behavior. The actual behavior always involves filling in the plan's gaps in response to the local situation.

This means that an agent system cannot succeed by generating complete, fully specified plans and then executing them mechanically. The execution phase is always itself a cognitive activity — interpreting the plan's intentions, recognizing how the current local situation applies to the plan's abstract specifications, and adapting when the plan's assumptions turn out not to hold.

Concretely:

- An orchestrating agent that generates a plan for a complex task ("step 1: retrieve data, step 2: analyze, step 3: synthesize, step 4: report") has not determined the behavior of the execution agents — it has provided a resource that the execution agents will interpret and adapt.
- The fidelity of plan execution depends on whether the execution agents share a sufficiently rich common understanding of the plan's *intentions* to interpret it appropriately in their specific local contexts.
- When local conditions diverge from the plan's assumptions, successful adaptation requires that execution agents understand *why* the plan specified what it did — so that they can find alternative means to the same end.

This argues for **intention-explicit planning** in agent systems: plans should specify not just what to do but why, so that execution agents have the resources to adapt intelligently when conditions change.

## Context as Input to Intelligence

One of the most practically important insights from situated cognition research is that context should be treated as a primary input to intelligence, not as incidental background.

For agent systems, this means:

**Context richness determines performance quality**: An agent operating with rich, accurate contextual information will perform substantially better than the same agent operating with impoverished context — even if its underlying capabilities are identical. Investing in context representation and maintenance is therefore a direct investment in performance quality.

**Context changes require active monitoring**: If context is constitutive of intelligent behavior, then changes in context require corresponding updates in the agent's situational model. An agent that acquired its situational model at time T and is now operating at time T+N (after context has changed) is not operating with the same cognitive resources as it appeared to have at T. The agent is, in an important sense, *a different agent* in a different context — and may not perform as expected.

**Context is partly created by the agent's own actions**: As agents act, they change the context in which subsequent actions occur. The planning agent that decomposes a task and assigns subtasks to execution agents has *created a context* for those execution agents — the assignments, the implied relationships, the expected outputs, the implicit deadlines. Managing the context that agent actions create is part of the coordination challenge, not a separate issue.

## Distributed Cognition in Multi-Agent Systems

Hutchins' distributed cognition framework is perhaps the most directly applicable to multi-agent systems of any insight in this literature.

Hutchins argues that the unit of cognitive analysis should be the *cognitive system*, not the individual cognizer. The system includes the humans, the artifacts, the communication channels, the shared representations, and the organizational structure — all of which contribute to the system's cognitive performance.

For multi-agent systems:

**The system's knowledge is not the sum of agent knowledge**: The multi-agent system may know things that no individual agent knows — because knowledge is encoded in the coordination patterns, the communication protocols, the shared representations, and the organizational structure. Similarly, the system may be unable to act on knowledge that individual agents possess, if that knowledge cannot be communicated or integrated appropriately.

**Coordination architecture is cognitive infrastructure**: The way agents communicate, the representations they share, the protocols they use for handoffs — these are not just logistics. They are the infrastructure through which the distributed cognitive system performs. Poor coordination architecture degrades cognitive performance even when individual agents are capable.

**Artifacts carry cognition**: In Hutchins' analysis, the ship's navigation instruments are not just tools — they are cognitive components. They store information, perform computations, and mediate the navigation process in ways that are constitutive of the cognitive system's performance. In agent systems, prompts, knowledge bases, context documents, example repositories, and output formats all play analogous roles. They are cognitive artifacts, and their design determines what kinds of cognition the system can perform.

**Propagation of representational states**: Hutchins analyzes navigation as a process of *propagating representational states* across the components of the system — from physical measurement to instrument reading to chart marking to position calculation. Each transformation preserves the information needed while converting it to a form that the next component can use. For agent systems, this translates to: every handoff between agents should be analyzed as a representational state propagation. Is the information being preserved? Is it being transformed into a form the receiving agent can use? Are important properties (uncertainty, limitations, context) being maintained across the transformation?

## Context Failures in Agent Systems

Agent systems fail in characteristic ways that can be understood through the situated cognition lens:

**Context stripping**: When a task is decomposed and distributed across agents, each agent receives only a portion of the original context. If the distribution is done carelessly, agents may receive the *what* of their subtask without the *why* — stripping the context they need to adapt intelligently when local conditions differ from plan assumptions.

**Context drift**: As a long-running task progresses, the context accumulates changes. Early agents produced outputs based on an early context; later agents inherit those outputs without necessarily having access to the earlier context. The output of agent A made sense given the context in which A was operating; when agent C (operating in a different context) builds on A's output, the mismatch may be invisible but consequential.

**Context explosion**: In the other direction, some agent systems accumulate context so aggressively that agents are overwhelmed — they receive more contextual information than they can effectively integrate, and performance degrades despite (or because of) the richness of available context. Expertise research shows that experts do not use all available information — they selectively attend to the cues that are most informative given their situational model. Agent systems should similarly have mechanisms for *selective context attention*, not just context accumulation.

**Decontextualized knowledge application**: An agent that applies a reasoning pattern or knowledge that was developed in one context to a different context — without recognizing that the change in context may change the appropriateness of the pattern — is committing the decontextualized knowledge error that situated cognition research systematically identifies. The recommendation that "applied in context X" may not apply in context Y, even if the surface problem looks similar.

## Design Principles from Situated Cognition

1. **Treat context as a first-class system resource**: Design explicit mechanisms for capturing, maintaining, propagating, and updating contextual representations across agent interactions.

2. **Design for intention preservation**: When tasks are decomposed and distributed, ensure that execution agents receive not just task specifications but task intentions — enough context to adapt intelligently when local conditions diverge from plan assumptions.

3. **Design handoffs as representational state propagations**: Every handoff between agents should be analyzed to ensure that information is preserved, transformed appropriately for the receiving agent, and not stripped of important properties.

4. **Recognize that the system's knowledge differs from agent knowledge**: Analyze what the multi-agent system collectively knows and can do — including what is encoded in coordination patterns and shared representations — rather than only analyzing individual agent capabilities.

5. **Monitor context change**: Build explicit mechanisms for detecting when the context has changed significantly enough that previous situational assessments and plans may no longer be appropriate.

6. **Design cognitive artifacts with care**: Treat prompts, knowledge bases, context documents, and output formats as cognitive infrastructure — analyze what cognition they enable or constrain, and design them to support the full range of intelligent behavior the system needs to exhibit.

The situated cognition insight does not make agent system design impossible — it makes it honest. Intelligence is not a context-free capacity that can be developed in abstraction and deployed anywhere. It is a distributed, contextual achievement that depends on the full cognitive system: the agents, their coordination architecture, their shared representations, and the contexts in which they operate.