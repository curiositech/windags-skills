# Multi-Agent Coordination Without Central Control

## The Coordination Problem

The most challenging aspect of multi-agent systems is coordination without a
central controller that understands everything. Each agent has its own beliefs,
its own goals, its own intentions. No single entity has complete knowledge of
the system state. Yet the agents must collaborate to achieve outcomes no single
agent could achieve alone.

AgentSpeak(L) is formally specified for single agents, but its architecture —
particularly its treatment of events, beliefs, and intention interleaving —
directly informs the design of multi-agent coordination systems. Reading Rao
alongside the multi-agent extensions he references (dMARS, GRATE*, INTERRAP,
COSY) reveals a consistent set of principles for coordination without central
control.

---

## Decentralized Coordination Through Shared Beliefs

The cleanest multi-agent coordination mechanism consistent with BDI architecture
is **shared belief coordination**: agents share a common (or partially shared)
belief base, and coordinate by posting and reading beliefs.

In this model:
- Agent A completes a task → posts `+task_complete(X, result)` to shared beliefs
- Agent B has a plan triggered by `+task_complete(X, result)` → B's event queue
  receives the triggering event → B's plan selection finds an applicable plan → B
  begins its dependent task

No central controller is needed. Agent B doesn't need to know about Agent A.
Agent A doesn't need to know about Agent B. They coordinate through the shared
epistemic state.

This is the multi-agent analogue of the single-agent event system: just as
environmental changes generate events for a single agent, agent actions generate
belief changes that generate events for other agents.

**Critical design requirement**: The shared belief base must support:
- Atomic belief updates (a multi-step change appears as one transition)
- Concurrent read access (multiple agents checking context conditions simultaneously)
- Sequential write ordering (belief updates have consistent causal ordering)
- Selective sharing (some beliefs are private to one agent; others are shared)

---

## No Central Controller: The Selection Function Distribution

In a single-agent system, SE, SO, and SI are centralized — one agent runs all
three selection functions. In a multi-agent system, **each agent runs its own
selection functions over its own event queue, belief base, and intention set**.

The coordination emerges from the interaction of these distributed decisions through
shared beliefs. No central orchestrator decides what each agent does — each agent
decides for itself based on its own beliefs and plan library.

This is coordination through **emergent scheduling**: the global task allocation
emerges from local decisions. The design challenge is ensuring that the emergent
allocation is efficient and correct — that tasks are not duplicated, not missed,
and not executed in wrong order.

**Mechanisms for emergent coordination**:

1. **Token passing**: A belief `+right_to_execute(task_X, agent_id)` grants one agent
   the right to execute task X. The agent that posted the task creates the token;
   when done, it passes or revokes the token.

2. **Claim/reserve patterns**: Agent posts `+claiming(task_X)` to indicate intent.
   Other agents with plans for `task_X` see the claim belief in context condition
   and decline. The claiming agent posts `+executing(task_X)` when it starts.

3. **Dependency ordering**: Belief `+ready(task_X)` triggers only after all
   predecessor tasks have posted their completion beliefs. Agents with plans for
   `task_X` trigger only when `ready(task_X)` is in the shared belief base.

4. **Capability-based routing**: Agent A posts `+needs(task_X)`. Each capable agent
   has a plan triggered by `+needs(task_X)` with context condition checking its own
   availability. The first available capable agent commits.

---

## Task Decomposition as Intention Delegation

In single-agent AgentSpeak(L), sub-goals are pushed onto the current intention stack —
the same agent handles both the parent task and the sub-task. In multi-agent systems,
sub-goals can be **delegated** to other agents.

Agent A is executing intention I with a plan body that includes `!task_X`. Instead
of generating an internal event for itself, Agent A posts `+delegate(task_X, agent_a_id)`
to the shared belief base. Agent B (specialized for task_X) has a plan triggered by
`+delegate(task_X, _)` that handles the task and posts `+completed(task_X)` when done.

Agent A's plan can include:
```
!task_X;
?completed(task_X)    ← test goal: wait until completion is visible in beliefs
!next_step.