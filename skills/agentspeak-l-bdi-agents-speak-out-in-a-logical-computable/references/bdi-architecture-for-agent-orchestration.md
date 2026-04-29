# The BDI Architecture: A Foundation for Rational Agent Orchestration

## What This Document Is

This document teaches the Belief-Desire-Intention (BDI) architecture as formalized
in Rao's AgentSpeak(L) paper, and translates its core insights into design principles
for building intelligent orchestration systems like WinDAGs. The BDI model is not
merely a historical curiosity — it is the clearest formal account we have of how a
rational agent should manage information, motivation, and committed action
simultaneously. Every orchestration system that routes tasks, manages state, and
coordinates agents is implicitly implementing some version of this architecture,
usually poorly. Understanding BDI explicitly lets you do it well.

---

## The Three Attitudes and Why They Must Be Kept Separate

A BDI agent is defined by three distinct mental attitudes, each serving a different
functional role:

**Beliefs (B)** represent the agent's current model of the world — itself, its
environment, and other agents. In AgentSpeak(L), beliefs are ground atoms in a
first-order base: `location(robot, a)`, `adjacent(a, b)`, `location(waste, b)`.
Beliefs are updated when the environment sends signals. They are the agent's
epistemic state — what it takes to be true right now.

**Desires** (which in the operational model become **Goals**) represent states the
agent wants to bring about. Rao distinguishes between *achievement goals*
(`!cleared(b)` — bring about a state where lane b is cleared) and *test goals*
(`?location(car, b)` — verify whether a condition holds). Goals are motivational:
they generate the events that drive plan selection and execution.

**Intentions (I)** represent the agent's *committed* courses of action — the plans it
has adopted and is actively pursuing. Each intention is a stack of partially
instantiated plans. The stack structure is crucial: sub-goals push new plan frames
onto the stack; completing a sub-goal pops the frame and resumes the parent plan.
This gives intentions their hierarchical, interruptible character.

The critical design insight is that **these three must remain architecturally
separate**. Systems that conflate them — storing goals as facts, or embedding beliefs
inside plans, or treating intentions as simple task queues — lose the ability to
reason about them independently. You cannot update a belief without triggering
re-evaluation of which plans are applicable. You cannot drop an intention cleanly
if intention state is scattered across belief storage. The separation is not academic
fastidiousness — it is the foundation of coherent agent behavior.

---

## The Agent as a Tuple

Rao defines an agent formally as:

> `<E, B, P, I, A, SE, SO, SI>`

Where:
- **E** = the set of pending events (external and internal)
- **B** = the set of base beliefs
- **P** = the library of available plans
- **I** = the set of active intentions (each an intention stack)
- **A** = the set of actions being executed
- **SE** = selection function: which event to process next
- **SO** = selection function: which applicable plan to commit to
- **SI** = selection function: which active intention to advance

This tuple is the complete state of a rational agent at any moment. Notice what is
*not* in this tuple: there is no "current task," no "global objective," no "plan of
plans." The agent's behavior emerges entirely from the interaction of these components
through the interpreter cycle. This is powerful precisely because it is minimal.

For WinDAGs, this suggests that each agent node should maintain explicit, separate
data structures for these six components, rather than collapsing them into a single
"agent state" blob. The selection functions in particular should be exposed as
configurable policies, not hardcoded logic.

---

## The Interpreter Cycle: The Heartbeat of Agent Rationality

The AgentSpeak(L) interpreter runs the following cycle continuously:

1. **Select an event** from E using SE (remove it from E)
2. **Find relevant plans**: plans whose triggering event unifies with the selected event
3. **Filter to applicable plans**: relevant plans whose context condition is a logical
   consequence of current beliefs B
4. **Select one applicable plan** using SO
5. **Adopt it as an intention**: if external event, create new intention; if internal
   event (sub-goal), push onto existing intention stack
6. **Select an intention** to execute using SI
7. **Execute the first step** of the top frame of that intention:
   - If it's an achievement goal `!g(t)`: generate internal event, add to E
   - If it's a test goal `?g(t)`: query B, apply substitution, remove from body
   - If it's a primitive action `a(t)`: add to A (dispatch to environment)
   - If it's `true` (plan completed): pop frame, resume parent
8. **Return to step 1**

This cycle is the agent's *reasoning loop*. Every step is formally defined. The loop
terminates only when E is empty and no intention is runnable. This gives the agent
both reactivity (it processes new events continuously) and deliberativeness (it
maintains and advances committed intention stacks across cycles).

**The key architectural lesson**: the loop separates event selection, plan selection,
intention selection, and step execution into distinct phases with distinct policies.
In a naive orchestration system, all of these are conflated into a single dispatch
function. Separating them enables principled control over priority, fairness,
preemption, and error recovery.

---

## Relevant vs. Applicable Plans: Two-Stage Filtering

One of the most important distinctions in AgentSpeak(L) is between **relevant plans**
and **applicable plans**:

- A plan is **relevant** if its triggering event *unifies* with the current event — i.e.,
  the plan is designed to handle this type of event, regardless of current world state.
- A plan is **applicable** if, additionally, its **context condition** is satisfied by
  current beliefs — i.e., it is appropriate to use *this particular plan* given the
  current state of the world.

Formally: "A plan p is an applicable plan with respect to an event ε iff there exists
a relevant unifier θ for ε and there exists a substitution σ such that (b₁∧...∧bₘ)θσ
is a logical consequence of B." (Definition 10)

The context condition is the agent's situational intelligence. It encodes the
preconditions under which a given strategy is appropriate. Consider the robot example:
both P2 and P3 are *relevant* for the goal `+!location(robot, X)`, but only P3 is
*applicable* when the robot is not already at the target location and an adjacent
clear lane exists.

**For WinDAGs**: This two-stage filtering maps directly onto skill selection. A skill
may be *relevant* (handles this task type) without being *applicable* (preconditions
not met: wrong permissions, missing data, system state incompatible). The orchestrator
should implement both relevance filtering (fast, syntactic) and applicability checking
(slower, semantic) as distinct steps, not collapse them into a single capability
lookup.

---

## Intentions as Stacks: Hierarchical Goal Decomposition

Each intention in AgentSpeak(L) is a **stack of partially instantiated plans**. When
an achievement goal `!g(t)` is encountered during execution, it generates an internal
event, which triggers plan selection, which pushes a new plan frame onto the *same*
intention stack. The stack captures the hierarchical decomposition of the current task.

This is subtly but importantly different from spawning a new intention. A new
intention would be a separate concurrent thread of activity. Pushing onto an existing
intention stack means: "this is a sub-task I must complete before I can continue with
my current task." The stack enforces sequential commitment within a task decomposition
while allowing concurrent interleaving between distinct top-level intentions.

Rao notes: "one can view agent programs as multi-threaded interruptible logic
programming clauses." (Section 3)

**Practical implication**: When designing a DAG-based orchestration system, distinguish
between:
- **Vertical decomposition** (sub-tasks within a single intention stack): use stack
  discipline — the parent task is suspended until the child completes
- **Horizontal concurrency** (multiple independent intentions): use parallel scheduling
  via SI

The failure mode of not making this distinction is spawning parallel agents for tasks
that are actually sequential sub-goals of a single commitment, creating race conditions
and coordination overhead where none was needed.

---

## Boundary Conditions and Caveats

**When BDI architecture is less appropriate**:

1. **Purely reactive systems**: If no goal-directed behavior is needed — only
   stimulus-response — the intention stack mechanism is unnecessary overhead. Simple
   reactive rules suffice.

2. **Systems requiring global optimization**: BDI agents commit to local plans based
   on local context. They do not perform global search over all possible plan
   combinations. Problems requiring globally optimal solutions (scheduling, resource
   allocation at scale) need different machinery.

3. **Highly dynamic belief revision**: AgentSpeak(L) assumes beliefs are updated by
   the environment and queried during context checking, but does not provide a full
   belief revision mechanism (no non-monotonic reasoning, no defeasibility). Systems
   where beliefs frequently conflict or require sophisticated revision need extensions.

4. **The plan library must be complete**: The system has no behavior for events with
   no applicable plans. Failure handling for missing plans must be explicitly designed.
   This is a significant practical gap in the basic formalism.

---

## Summary for System Designers

The BDI architecture teaches:

1. **Separate epistemic state (beliefs) from motivational state (goals) from
   deliberative state (intentions)** — these serve different functions and must be
   independently queryable and modifiable.

2. **Agent behavior is plan selection, not planning** — the hard work happens
   offline (writing the plan library); online, the agent selects among pre-written
   plans based on context. This is computationally tractable and practically effective.

3. **The interpreter cycle is the agent's rationality** — event processing, plan
   selection, intention scheduling, and step execution are distinct phases with
   distinct, replaceable policies.

4. **Intentions are stacks, not queues** — hierarchical decomposition is captured
   through stack discipline; concurrent activity through multiple intention stacks.

5. **Selection functions are the locus of agent strategy** — changing what the agent
   *does* without changing what it *knows how to do* means changing the selection
   functions, not the plan library.