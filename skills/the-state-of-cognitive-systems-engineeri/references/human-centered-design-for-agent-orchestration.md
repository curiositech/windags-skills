# Human-Centered (Agent-Centered) Design Principles for Orchestration Systems

## The Design Philosophy That CSE Demands

The cognitive systems engineering tradition is animated by a design philosophy that sounds obvious until you confront how consistently it is violated in practice: **machines should adapt to the intelligent agents that use them, not the other way around.** Hoffman et al. (2002) state this directly: "Machines should adapt to people, not the other way around. Machines should empower people."

The reason this principle is violated so consistently is not that designers are stupid or malicious. It is that the principle is much easier to state than to implement, and the market pressures, schedule pressures, and cognitive biases that shape system development consistently push in the other direction. A system that requires its users to adapt is a system that has transferred the burden of complexity from the machine to the human. That transfer is almost always easier and cheaper in the short run. The costs — in error, in performance degradation, in hostility and workaround proliferation — appear later, in operation, where they are harder to attribute to design choices.

Hoffman et al. are explicit about the systemic nature of this failure: "Even smart, clever, well-intentioned people can build fragile, hostile devices that force the human to adapt and build local kludges and workarounds. Worse still, even if you are aware of this trap, you will still fall into it."

This is a remarkable statement from people who have spent their careers studying this exact problem. The trap is deep enough that awareness is not sufficient to avoid it. What is required is sustained commitment to a specific methodology — and constant vigilance against the design pressures that push toward user-hostile outcomes.

## What "Human-Centered" Means in Agent System Design

When we extend the CSE principles from human-machine systems to multi-agent orchestration, "human-centered" becomes "agent-centered" — and the meaning shifts accordingly. But the structural insights remain:

**An agent-centered orchestration system is one that adapts its coordination requirements to the actual capabilities and limitations of the agents it orchestrates, not one that requires agents to adapt to a rigid coordination interface.**

This sounds simple. It is not. The default in most orchestration system design is to define a standard interface — standard input format, standard output format, standard error handling protocol, standard communication pattern — and require all agents to conform to it. This is efficient from a system engineering perspective. It makes the orchestration layer simple and predictable. And it transfers the burden of adaptation to the agents themselves — and, ultimately, to the humans who must compensate when the adaptation fails.

The CSE principle demands something harder: orchestration systems that can accommodate the natural variation in agent capabilities, that can communicate in the terms that different agents can actually process, that can adapt their requests to what each agent can actually provide, and that can recognize when an agent is being pushed outside its effective operating range.

## The Kludge and Workaround Problem

Hoffman et al. introduce the concept of "local kludges and workarounds" as a diagnostic signal: when practitioners begin inventing workarounds to the tools and systems they are supposed to be using, those tools and systems have become hostile. The workarounds are the visible symptom of a system that has failed to adapt to the true work its practitioners need to perform.

This diagnostic applies directly to multi-agent systems. When agents in a pipeline begin producing outputs in non-standard formats that compensate for the limitations of downstream agents, or when orchestrating agents begin routing around certain agents because they've learned those agents don't handle certain inputs well, or when the effective topology of the agent system diverges from the nominal topology because informal accommodations have accumulated — these are the kludges and workarounds that signal a design problem.

In human organizations, kludges and workarounds often persist for years because they are never made visible — they are absorbed into informal practice and invisible to organizational leadership. In AI agent systems, the analog is pipelines that have been tuned through accumulated prompt modifications, routing overrides, and output post-processing steps that compensate for individual agent limitations — none of which is documented or visible in the formal system architecture.

**The appropriate response to kludges and workarounds is not to eliminate them — they may be keeping the system functional — but to analyze them systematically.** Each kludge is evidence that the formal system design has failed to accommodate the true work in some specific way. The kludge reveals the gap. Closing the gap at the design level — rather than leaving it to informal accommodation — produces a more robust, more maintainable, and more understandable system.

## Revolutionary vs. Evolutionary Design

CSE distinguishes between two approaches to system design:

**Evolutionary design** starts from the existing system and improves it incrementally. You observe current practice, you identify inefficiencies and pain points, you address them one by one. This approach is safe and manageable but is constrained by the assumptions embedded in the current system. You can optimize the current system but you cannot escape its fundamental design decisions.

**Revolutionary design** starts from a fresh analysis of the true work to be accomplished, unconstrained by current implementation. You ask: given everything we know about what practitioners actually do and what they actually need, what would the ideal system look like? This approach can achieve qualitatively better outcomes but is risky and requires genuine commitment to following the analysis wherever it leads.

The CSE position is that evolutionary design is often insufficient precisely because the current system's most consequential flaws are embedded in its most fundamental assumptions — assumptions that incremental improvement cannot challenge. When task analysis has been applied in a way that encodes invariant sequences, no amount of incremental improvement will produce a system that supports the context-sensitive, knowledge-driven operation that expertise requires. The assumptions must be revisited at the root level.

For AI agent system design, this distinction is crucial. Evolutionary design of an agent orchestration system means adding more agents, improving existing prompts, adding more sophisticated routing rules, expanding the skill library. These improvements are valuable. But they operate within the architecture's fundamental assumptions about what agents are, how they communicate, how tasks are decomposed, and how coordination happens. Revolutionary design asks whether those assumptions are right.

## The Pennywise Trap

Hoffman et al. issue a specific warning that agent system designers should hear clearly: "system designers must refuse to cave in to penny-wise, short-term thinking in system development."

The penny-wise trap in agent system design looks like this: the robust solution — the one that properly represents the true work, that provides adequate transparency, that supports alternative path generation, that avoids the known failure modes — is more expensive to build than the expedient solution. The expedient solution works under nominal conditions. It passes acceptance testing. It ships. The costs of its design limitations appear later, in operation, as accumulated incidents, workarounds, and degraded performance in edge cases.

This is not a failure of intelligence. The people making the tradeoff are often aware of the long-term costs. The problem is that the long-term costs are uncertain, distant, and attributed to the complexity of the domain rather than the limitations of the design — while the short-term costs of doing it right are certain, immediate, and attributed to the expense of good engineering. The incentive structure systematically favors the expedient solution.

CSE's answer is zero tolerance: "They also must have zero tolerance for user-hostile systems." This is a strong statement. It means that design decisions that produce fragility, hostility, or automation surprises are not acceptable, even when they are cheaper, even when they work most of the time, even when the failure cases are rare.

For AI agent systems, this translates into: **no tolerance for silent failure propagation, no tolerance for agents that operate opaquely when they are most likely to be wrong, no tolerance for orchestration architectures that cannot gracefully handle the failure of their components.**

## Design for the Long Tail of Cases

A recurrent theme in CSE is that systems are usually designed for the common case and fail in the uncommon case — but it is the uncommon case that most matters for system reliability and for the wellbeing of the people (or agents) who depend on the system.

"You can expect them to lead to fragilities, hostilities, and automation surprises" — the "them" here refers specifically to systems designed for invariant sequences. These systems perform well in the center of the distribution — the cases that look like the cases the designers imagined. They perform poorly at the tails — the edge cases, the degraded conditions, the novel situations.

The tragedy of tail-case failure is that it is invisible during design and testing. Tests are naturally drawn from the part of the distribution that designers know about — the nominal cases. The tail cases, by definition, are not well-represented in any test set drawn from prior experience. They appear only in deployment, in real-world operation, where failure costs are high.

**The CSE design methodology is specifically aimed at closing the tail-case gap.** By studying real experts in real environments, by analyzing incidents and near-misses, by explicitly asking "when does this fail?", CSE researchers surface the true distribution of conditions that a system will encounter — including the tail cases that will never appear in a synthetic test environment.

For AI agent systems, this means: **design validation that explicitly tests the system at the boundaries of its operating envelope, in degraded conditions, with malformed inputs, with failed components, with novel task types that fall outside the training distribution.** These are the cases where the gap between evolutionary and revolutionary design will be most visible.

## Empowerment as a Design Criterion

One final principle from the CSE tradition that deserves emphasis in the context of agent orchestration: **good systems empower their users, they don't constrain them.** Hoffman et al. state: "Machines should empower people."

Empowerment is not the same as automation. Automation takes a task away from a human (or an agent) and performs it automatically. Empowerment gives a human (or an agent) the capabilities they need to perform a task more effectively. These are different, and the difference matters.

An agent that automates a sub-task — that takes it out of the orchestration pipeline and performs it without any external visibility or coordination — has removed a degree of freedom from the system. If the automated sub-task is always correct, this is efficient. If the automated sub-task can fail in ways that cascade, the automation has removed the opportunity for detection and correction that the explicit coordination step would have provided.

An orchestration system that empowers agents — that gives each agent access to the situational awareness, the tools, and the coordination support it needs to perform its sub-task effectively — produces a different kind of system. More complex to design, more verbose in its coordination, but more robust in its failure modes and more capable of graceful adaptation.

The CSE tradition is unambiguous about which of these to prefer. The road to fragile, hostile, surprise-generating systems is paved with well-intentioned automation decisions that transferred complexity from the machine to the operator. The road to robust, empowering systems requires accepting that complexity, making it visible, and designing support for it explicitly.