# The Agent vs. Object Distinction: Why Active Systems Need Different Design Principles

## The Conceptual Watershed

At the heart of the FIPA specification lies a distinction that shapes everything else in the document — and that has profound implications for any system built with agents:

> "For modelling agents and agent-based systems, UML is insufficient. Compared to objects, agents are active because they act for reasons that emerge from themselves. The activity of agents is based on their internal states, which include goals and conditions that guide the execution of defined tasks. While objects need control from outside to execute their methods, agents know the conditions and intended effects of their actions and hence take responsibility for their needs." (Section 3.1)

This passage is making a claim about *locus of control*. In an object-oriented system, control is external: something else calls your method, something else decides when you execute. In an agent-based system, control is internal: the agent decides when to act, based on its own goals, beliefs, and assessment of the situation. The agent is not merely a passive recipient of function calls — it is an autonomous decision-maker embedded in a social environment with other autonomous decision-makers.

This is not just a philosophical distinction. It has direct, practical consequences for how you design, specify, and reason about systems composed of agents.

## What the Object Model Assumes and Why It Breaks

The UML object model — and the software engineering practices built around it — rests on several assumptions that are violated in agent-based systems:

**Assumption 1: Deterministic activation.** An object executes when called. The caller determines the timing, the parameters, and the context. In an agent system, an agent may act *at any time* based on its perception of the environment. You cannot predict when it will act without understanding its internal decision-making process.

**Assumption 2: Passive state.** An object's state changes only in response to external method calls. An agent's state may change as a result of its own internal reasoning, perception of the environment, or receipt of messages from other agents.

**Assumption 3: No goals.** An object has no concept of what it is *trying to achieve*. It simply executes the method it was called with. An agent has goals, and those goals shape *which* methods it will call on others, *when* it will call them, and *what* it will do with the results.

**Assumption 4: No social dimension.** Objects interact in a controlled, designed hierarchy (this class calls that class). Agents interact in a *social* environment where the patterns of interaction emerge from the agents' goals and beliefs, and where multiple agents may simultaneously be trying to achieve related or competing goals.

The FIPA specification recognizes that none of these object-model assumptions hold for agents, and builds its specification language (AUML) accordingly.

## The Social Community of Interdependent Members

The specification describes multi-agent systems as potentially resembling "a social community of interdependent members that act individually." (Section 3.1) This social metaphor is not accidental — it captures something important about the design of agent-based systems.

In a social community:
- Members have individual goals and capabilities
- Members communicate through a shared language and shared conventions
- Members develop norms of interaction (protocols) that enable coordination without requiring that everyone understand everyone else's internal state
- Trust, reputation, and role all matter for determining who interacts with whom and how

This is precisely the design model that FIPA formalizes. The "shared language" is FIPA ACL (Agent Communication Language). The "shared conventions" are the interaction protocols in the IP Library. The "norms of interaction" are the protocol specifications. The "role" system is AUML's AgentRole mechanism.

For WinDAG system design, this social metaphor has practical implications: **design your agent ecosystem as a society, not as a call graph**. A call graph specifies who calls whom and in what order; this is the right model for objects. A social design specifies who plays which roles, what protocols govern their interactions, and what norms apply when protocols don't fully specify behavior — this is the right model for agents.

## Why Objects Are Not Enough, Even for Simple Orchestration

It might be tempting to dismiss the agent-vs-object distinction as a philosophical nicety irrelevant to practical system design. "My system just calls skills and collects results — that's basically object-oriented, isn't it?"

The answer is no, even for apparently simple orchestration scenarios, for three reasons:

**Reason 1: Asynchrony destroys the call stack.** In a synchronous object-oriented system, the call stack encodes the current state of the computation. In an asynchronous agent system, there is no call stack — there are concurrent threads of interaction, each with its own state, none of which has a clear "parent" in the calling sense. An agent waiting for three concurrent skill results cannot represent its state as a call stack; it must represent it as a protocol state.

**Reason 2: Failure modes are qualitatively different.** When an object method fails, it throws an exception that propagates up the call stack to a handler. When an agent interaction fails, the failure might be: the other agent is unreachable, the response is malformed, the response arrived too late, the response contradicts a previous response, or the interaction entered an undefined state. These failure modes require a richer response vocabulary than exception handling — they require protocol-level failure handling as described in the FIPA specifications.

**Reason 3: Agents have opinions.** An object doesn't decide whether to fulfill a method call — it just executes. An agent may decide that it cannot, should not, or will not fulfill a request — and it communicates this decision through the protocol (`refuse`, `not-understood`, `failure`). This means the system designer must account for agent agency in their coordination designs, not assume that every invocation will be honored.

## The Implications for Designing Skills in WinDAG

A WinDAG skill is, in the FIPA sense, an agent — not an object. This has concrete design implications:

**Skills may decline requests.** Unlike an object method that executes when called, a skill may legitimately respond to an invocation with `refuse` (I cannot do this) or `not-understood` (I don't understand this request). The orchestration system must handle these responses gracefully, not assume they cannot occur.

**Skills have internal state that affects their behavior.** A skill that is currently executing a related task may respond differently to a new invocation than a skill at rest. A skill that has recently encountered failures may be more cautious in its capability assessments. This internal state is private — the orchestrator cannot directly observe it — but it affects the skill's behavior in the protocol.

**Skills act in a social context.** A skill invocation is not an isolated method call — it is a message in an ongoing conversation within a protocol. The skill's response should be understood in terms of the protocol state, not just the message content. A `failure` message means something different at the beginning of a task than at the end.

**Skills may initiate interactions.** In a pure object model, objects are passive responders. In an agent model, an agent may initiate interactions on its own — reporting a discovered problem, requesting additional information, or proactively coordinating with related agents. WinDAG skills that can initiate interactions provide richer coordination capabilities than purely reactive skills.

## The Limits of the Agent Model

The FIPA specification is honest that the agent model introduces complexity that the object model avoids. The vision of a fully agent-based system — where coordination emerges spontaneously from agents' rational goal-pursuit — "places a heavy burden of capability and complexity on the agent implementation." (Section 2.1)

This suggests a practical design principle: **use the agent model where its properties are genuinely needed, and use the object model where they are not**.

Not every component of a WinDAG system needs to be a full agent. A deterministic text-processing utility that always produces the same output for the same input and has no goals, no protocol obligations, and no need for autonomous action is better modeled as a function than as an agent. The overhead of protocol-based interaction, role specification, and message-passing semantics is not justified for components with no social dimension.

The agent model is justified when:
- The component has goals that may lead it to decline or modify requests
- The component participates in negotiation or coordination protocols
- The component's behavior is affected by its social context (history of interactions, trust, reputation)
- The component may need to initiate interactions proactively
- Multiple instances of the component must coordinate or compete

Where these conditions are absent, the simpler object model is more appropriate. The skill of agent system design is knowing which components truly need agent semantics and which can be simpler functions — and not overapplying the more complex model where it adds overhead without benefit.

## What the Agent-Object Distinction Teaches About AI Orchestration

The FIPA specification was written before the current era of LLM-based AI agents, but its central insight applies with renewed force. Contemporary AI agents — particularly LLM-based agents — are emphatically *not* objects. They are active, goal-directed, capable of declining requests, affected by context and history, and potentially engaged in complex social interactions with other agents.

Designing orchestration systems for such agents using purely object-oriented principles — treating LLM agents as functions to be called — is a category error. It ignores precisely the properties that make these agents powerful (their goal-directedness, their ability to reason about context) and fails to provide the coordination infrastructure (protocols, roles, message semantics) that those properties require.

The FIPA specification, written in 2001, anticipated the design challenges that AI engineers are grappling with today. Its core lesson: if your system components are agents in any meaningful sense, design your coordination layer as an agent coordination system — with explicit protocols, role abstractions, message semantics, and acknowledgment of the limits of protocol-based coordination. Anything less is architectural debt.