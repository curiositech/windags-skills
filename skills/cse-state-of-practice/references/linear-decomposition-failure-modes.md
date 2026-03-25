# Why Linear Task Decomposition Fails — And What To Do Instead

## The Core Problem That CSE Discovered

One of the foundational findings of Cognitive Systems Engineering — earned through decades of studying real experts in real environments — is that the intuitive way humans design systems for other humans (and, by extension, the intuitive way AI architects design systems for other AI agents) is systematically wrong in a specific, predictable, and deeply consequential way.

The error is this: **we decompose tasks into invariant, linear, or tree-like sequences of prescribed steps, and we build systems that expect those sequences to be followed**. This approach has a long history. It dates to what European psychologists in the late 1800s called "psychotechnics" — the idea that work could be analyzed by breaking it into its component actions, sequenced in the right order, and that this analysis would be sufficient to design systems, training programs, and support tools. A century and a half later, this assumption still dominates how most system designers think about tasks. And it is still wrong.

Hoffman, Klein, and Laughery (2002) are explicit: "Studies of the modern workplace suggest that significant problems can arise when you design systems based on a decomposition of tasks into invariant sequences of prescribed steps." The key word is *invariant*. The decomposition isn't the problem. Breaking a complex goal into sub-goals is often necessary and useful. The problem is assuming that those sub-goals will always be pursued in the same order, through the same operations, using the same inputs, with the same contingencies. Real work doesn't work that way.

## What Actually Happens When Experts Work

Here is what the research actually found when cognitive scientists went into the field and studied expert practitioners — weather forecasters, military commanders, firefighters, intensive care nurses, nuclear plant operators, pilots:

**"Sometimes, people might appear to be conducting linear sequences of actions, when they are actually engaging in context-sensitive, knowledge-driven choices among alternative actions."**

This is the key insight. From the outside, expert behavior can look sequential. You observe step A, then step B, then step C. So you conclude that the task structure is A → B → C and you design your system accordingly. But what is actually happening inside the expert's head is something more like: *Given what I know about the current situation, given what has already happened, given what I anticipate happening next, given the resources currently available, the fastest path to the goal right now is A. After A, I'll reassess. After reassessment, B is appropriate. After B, the situation has changed in a way I expected, so C follows.*

The sequence looks the same from the outside. The internal logic is completely different. And the difference matters enormously when conditions change.

## The Weather Forecaster Example

Hoffman et al. offer a concrete illustration: "Would loss of the uplink to the weather radar keep a forecaster from crafting a forecast? No, the forecaster can work around it because knowledge permits the creation of alternative paths to the goal."

Unpack this carefully. In a system designed around invariant sequences, radar data appears at step 3. If step 3 fails, the system stalls — or worse, proceeds with a silent gap where the data should have been, producing an output that looks complete but isn't. The system has no mechanism for recognizing that step 3 failed in a way that requires adaptation, because the sequence was assumed to be invariant.

The expert forecaster, by contrast, has *multiple representations* of the problem. They know what the radar tells them and they know what other data sources can substitute for it — satellite imagery, surface observations, model output, climatological priors. When the radar fails, they don't experience a hard stop. They experience a degradation of one input channel, and they compensate using their understanding of what that channel was providing and what can approximate it.

This is expertise. Not the ability to follow the sequence faster or more accurately — the ability to recognize when the sequence must be abandoned and to generate an alternative path to the goal.

## The Software Upgrade Analogy

The authors offer a second example closer to everyday experience: "When you are forced to adapt, kicking and screaming, to a new software upgrade and are frustrated by changes in functionality, are you totally paralyzed? No, you can craft a workaround."

This example illuminates something the first example might obscure: the workaround-generating capacity is not limited to domain experts with years of specialized training. It is a general feature of human cognition. We are, as a species, extraordinarily good at finding alternative paths to goals. This is why we find systems that prevent workarounds so infuriating — they are fighting against one of our most deeply ingrained cognitive capacities.

For AI agent systems, the design implication runs in both directions:
1. Don't design agents that can only execute the prescribed path.
2. Don't design orchestration systems that prevent agents from adapting.

## The Three Failure Modes of Linear Decomposition Systems

CSE research identifies three specific failure modes that emerge predictably when systems are designed on linear decomposition assumptions:

**Fragility**: The system fails whenever conditions deviate from the assumed sequence. Steps that are assumed to always have valid inputs will receive invalid ones. Assumed preconditions will not hold. Steps that are assumed to be independent will turn out to be interdependent in ways the decomposition didn't capture.

**Hostility**: The system becomes adversarial to the practitioners who use it. Because the system assumes an invariant sequence, it resists attempts to work around it. It may not expose the right information at the right time for context-sensitive decision-making. It may force practitioners into prescribed paths that are wrong for current conditions. It may not support the cognitive operations that experts actually perform.

**Automation Surprises**: The system behaves in ways that practitioners don't expect and can't interpret. This is the most dangerous failure mode. The system continues to operate — it doesn't crash — but it is doing something other than what its operators believe it is doing, and nothing in its interface or behavior makes this visible. Sarter, Woods, and Billings (cited in Hoffman et al.) devoted a major research program to this phenomenon. It is responsible for a substantial fraction of aviation accidents, industrial incidents, and system failures.

## How This Translates to AI Agent Orchestration

In WinDAGs and similar multi-agent systems, the temptation to use linear decomposition is overwhelming. It's clean. It's auditable. It maps naturally onto graph structures. And it works — until it doesn't.

The failure modes are identical:

**Agent-level fragility** emerges when an agent expects a specific input format, a specific set of preconditions, or a specific sequence of prior operations, and the upstream environment delivers something different. If the agent has no capacity to recognize the deviation and adapt, it will either fail silently or fail in a way that corrupts downstream agents.

**Orchestration-level hostility** emerges when the DAG structure prevents agents from taking alternative paths that would be appropriate given current state. If the only way to route around a failed sub-task is to abort and restart the entire pipeline, the system is hostile to the kind of flexible, knowledge-driven adaptation that expert performance requires.

**Cross-agent automation surprises** emerge when one agent completes its task but in a way that makes silent assumptions — about the interpretation of its outputs, about the state of the environment, about what downstream agents will do with its results. The downstream agent receives the output, treats it as valid, and proceeds. No alarm is raised. But the output carries embedded errors that propagate silently through the pipeline.

## What the Alternative Looks Like

CSE doesn't just diagnose the problem — it points toward solutions:

**Represent the goal, not just the steps.** A system that knows *why* step 3 exists — what it is trying to learn or accomplish — can recognize when an alternative step could achieve the same epistemic purpose. Goal-directed representation enables flexible execution.

**Make preconditions explicit and checkable.** If the conditions under which step B follows step A are made explicit, agents can detect when those conditions don't hold and either adapt or escalate.

**Design for degraded-mode operation.** Every critical capability in the pipeline should have a fallback path. The fallback may be lower quality, slower, or less confident — but it should be explicitly designed and available.

**Enable agents to communicate about uncertainty and failure.** An agent that knows it has operated outside its normal operating envelope should be able to signal this to downstream agents and to any supervisory layer. Silent propagation of uncertain outputs is the root cause of automation surprises.

**Build the orchestration layer around situations, not sequences.** Rather than a fixed pipeline, design the orchestration layer to recognize situations — configurations of task state, agent state, and environmental state — and route accordingly. This is closer to how expert practitioners actually operate.

## The Boundary Condition: When Linear Decomposition IS Appropriate

Linear decomposition fails specifically at the boundaries — in edge cases, failure modes, novel situations, and degraded conditions. For the large majority of cases where conditions are nominal, the prescribed sequence works, and it has real advantages: it's predictable, auditable, efficient, and easy to reason about.

The design challenge, therefore, is not to eliminate linear decomposition but to ensure that the system does not *assume* linearity holds everywhere. The brittle system is one that uses linear decomposition and has no mechanism for detecting when conditions have moved outside the zone where that decomposition is valid. The robust system uses linear decomposition as a default — efficiently executing the known-good path under nominal conditions — while maintaining the capacity to detect deviation and route adaptively.

This distinction — between the system that assumes linearity and the system that chooses linearity when appropriate — is everything.