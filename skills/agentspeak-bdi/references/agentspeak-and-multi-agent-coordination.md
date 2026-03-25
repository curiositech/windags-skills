# From Single Agent to Multi-Agent: Coordination Without a Central Controller

## The Single-Agent Architecture as Foundation

AgentSpeak(L) is formally defined for a single agent, but Rao explicitly situates the work in the context of multi-agent systems — noting that the Distributed Multi-Agent Reasoning System (dMARS) is the implemented system being formalized, and that extensions to multi-agent coordination are natural.

The single-agent architecture — `<E, B, P, I, A, SE, SO, SI>` — becomes the building block for multi-agent systems. Each agent is an independent instance of this architecture. Multi-agent coordination then emerges from the interaction between agents' event queues: one agent's action generates events in another agent's event set E.

This bottom-up composition of multi-agent systems from single-agent BDI components has profound implications for system design. It means there is no architectural distinction between an agent's internal reasoning and its external coordination — both are mediated by the same event processing mechanism. Internal sub-goals generate internal events; inter-agent communications generate external events. The same plan matching and intention adoption mechanism handles both.

## Decentralized Coordination Through Event Passing

In the BDI multi-agent model, agents coordinate by:

1. **Sending belief updates**: Agent A performs an action that changes the environment; the environment broadcasts a belief update event to all agents that need to know. Agent B receives `+new_fact(X)` and its relevant plans may fire.

2. **Sending goal requests**: Agent A asks agent B to achieve a goal by sending a message that generates `+!goal(X)` in B's event queue. B processes this as an external event, selects an applicable plan, and creates a new intention to pursue the goal.

3. **Responding with results**: Agent B, upon completing a goal or discovering a fact, can send a belief assertion to A: generating `+result(X)` in A's event queue.

This is coordination without a central controller. No agent has global knowledge of what other agents are doing. No agent needs to coordinate with a supervisor before acting. Each agent pursues its own intentions based on its own beliefs, while events propagate between agents to create coordination.

This is the BDI analog of *stigmergy* in biological systems: ants coordinate complex behavior not by communicating directly but by modifying the environment in ways that generate signals for other ants. BDI agents coordinate by generating events that trigger appropriate responses in other agents' plan libraries.

## The Plan Library as Implicit Protocol

In multi-agent BDI systems, coordination protocols are implicitly encoded in the plan libraries of participating agents. If agent A wants to request help from agent B, A's plan library should include a plan that sends a goal-request event to B when appropriate. B's plan library should include plans that respond to such requests.

This means **multi-agent protocols are distributed across plan libraries** rather than centralized in a coordinator. The protocol emerges from the interaction of independently operating plan libraries — each agent contributing its part of the protocol without any agent having global protocol knowledge.

This has important consequences:

**Extensibility**: Adding a new agent to the system requires only that the new agent have appropriate plans in its library. Other agents don't need to be reprogrammed to accommodate the new participant.

**Fault tolerance**: If one agent fails, its absence may cause some events to go unhandled (no applicable plan from another agent), but the failure doesn't crash the entire system. Other agents continue operating.

**Opacity**: The protocol exists only in the aggregate behavior of the system. No single agent's plan library specifies the complete protocol. This makes the protocol hard to inspect, debug, and verify.

The last point is the critical limitation. In AgentSpeak(L), there is no formal language for specifying multi-agent protocols — only for specifying individual agent plans. Protocol verification requires reasoning across multiple agents' plan libraries simultaneously, which the single-agent proof theory does not support.

**For WinDAGs**: Make inter-agent protocols explicit at the orchestration level. While individual agent plans are specified locally (in each agent's plan library), the coordination patterns between agents should be specified and versioned as first-class artifacts — not left implicit in the aggregate of individual plan libraries.

## Goal Sharing and Joint Intentions

One of the key challenges in multi-agent coordination is *joint intention*: multiple agents committing to pursue a shared goal cooperatively. In single-agent AgentSpeak(L), intentions are purely individual — each agent has its own intention set, its own stack of committed plans.

Joint intentions require more: agents must agree on a shared goal, commit to pursuing it together, and maintain that commitment even when individual beliefs change. If agent A believes the shared goal is still achievable but agent B believes it is not, what happens to the joint intention?

Rao cites Jennings [7] on "belief, desire, joint-intention architecture for collaborative problem solving" as related work. The full theory of joint intentions — developed separately by Cohen and Levesque and by Jennings — extends the individual BDI model with team-level mental attitudes.

The key insight from this literature: joint intentions are more than the sum of individual intentions. A team pursues a goal jointly if each member:
1. Individually intends to pursue the goal
2. Believes the other members also intend to pursue it
3. Intends to maintain the joint commitment as long as the goal is collectively achievable

When a member's individual intent changes (they believe the goal is unachievable), they must communicate this to other team members — not just drop their individual intention silently.

**For WinDAGs**: Tasks assigned to multiple agents collaboratively should be tracked as *joint intentions* with explicit commitment protocols. When any agent working on a joint task updates its beliefs about task feasibility, it must propagate this update to other agents working on the task. Silent failure — an agent dropping its contribution to a joint task without notification — is the primary failure mode in poorly designed multi-agent systems.

## Coordination Overhead and the Limits of Decentralization

Decentralized coordination through event passing has appeal — no single point of failure, no coordinator bottleneck — but it also has a fundamental limitation: **without a central view, coordination efficiency suffers**.

In a fully decentralized BDI multi-agent system, each agent makes plan selection decisions based on its own beliefs. These beliefs may be inconsistent across agents (agent A believes fact X, agent B believes not-X) or incomplete (agent A doesn't know that agent B is already working on the goal A is about to adopt). Without a coordination mechanism, agents may:

- **Duplicate work**: Both A and B adopt intentions to achieve the same goal because neither knows the other is working on it.
- **Conflict**: A's actions interfere with B's because neither knows what the other is doing.
- **Deadlock**: A is waiting for a result from B; B is waiting for a result from A; neither proceeds.

These failures require coordination mechanisms beyond the basic AgentSpeak(L) formalism:

- **Intention broadcasting**: Agents announce their adopted intentions, so other agents can avoid duplicating work.
- **Reservation mechanisms**: Before adopting an intention to use a shared resource, an agent checks that the resource is available and reserves it.
- **Dependency tracking**: Agents track which other agents' intentions their own intentions depend on, enabling deadlock detection.

Rao's single-agent formalism does not address these multi-agent coordination problems. They must be added as extensions — either through additional plan structures (plans that include coordination protocols) or through infrastructure-level mechanisms (a coordination service that agents invoke through actions).

## WinDAGs-Specific Coordination Design

For a WinDAGs orchestration system, the AgentSpeak(L) model suggests the following multi-agent coordination design:

**Shared Belief Store with Agent-Local Views**: Maintain a shared, globally consistent belief store (representing the environment and task state) that all agents can read. Each agent additionally maintains its own private beliefs (its current intentions, its local context). Belief updates to shared state are propagated to all agents; private beliefs are not shared.

**Orchestrator as SE Surrogate**: The orchestrator (DAG engine) effectively implements the SE function for the multi-agent system: it selects which events (tasks) to assign to which agents. This centralizes the attentional policy while leaving the plan selection (SO) and execution (SI) policies distributed across individual agents.

**Explicit Task Assignment as Goal Events**: When the orchestrator assigns a task to an agent, it generates a `+!task(X)` event for that agent. The agent processes this as an external event, finds applicable plans (skills), and adopts an intention to complete the task. This cleanly separates orchestration (task assignment) from execution (plan selection and action).

**Result Propagation as Belief Events**: When an agent completes a task and produces a result, it generates a `+result(X)` event in the shared belief store. Other agents and the orchestrator can subscribe to such events and trigger appropriate plans or orchestration decisions.

This architecture captures the benefits of the BDI model — context-sensitive plan selection, hierarchical decomposition, event-driven reactivity — while providing the coordination infrastructure that the base formalism lacks.