# Agent Programs vs. Logic Programs: Why the Difference Matters

## The Deceptive Similarity

AgentSpeak(L) plans look, at first glance, like Horn clauses in Prolog:

```prolog
% Prolog-style rule
location(robot, Y) :- location(robot, X), adjacent(X, Y), move(X, Y).

% AgentSpeak(L) plan
+!location(robot, X) : location(robot, Y) & not(X=Y) &
                        adjacent(Y, Z) & not(location(car, Z))
  <- move(Y, Z);
     +!location(robot, X).          [P3]
```

Both have a head, a set of conditions, and a body. Both use unification. Both enable
recursive decomposition. The superficial similarity is so strong that the paper notes
it explicitly and warns against it. Rao devotes Section 2 to carefully distinguishing
the two.

Understanding these distinctions is not academic pedantry. It is the key to
understanding why agent architectures are necessary for orchestration systems and
why simply using a logic engine (or a rule engine, or a workflow system) is
insufficient.

---

## Distinction 1: Triggering Events vs. Goal Heads

**In logic programming**: The head of a rule is a goal that the rule proves. If you
want to prove `location(robot, b)`, you search for rules whose head unifies with
`location(robot, b)` and attempt to prove their bodies. The head is a *logical fact
being established*.

**In AgentSpeak(L)**: The head of a plan contains a *triggering event* — not a fact
being established, but a *situation* that invokes the plan. The triggering event can
be:
- `+location(waste, X)`: a new belief was added (environment changed)
- `-location(robot, a)`: a belief was removed (something became false)
- `+!location(robot, X)`: a goal was adopted (agent decided to pursue something)
- `-!cleared(X)`: a goal was dropped (agent abandoned a commitment)

This is a fundamentally richer invocation mechanism. Logic programs can only be
invoked by goal queries. Agent plans can be invoked by environmental observations
(data-directed) as well as by goal adoption (goal-directed) and by goal abandonment.

**Practical consequence**: An orchestration system based on logic programming can
only respond to explicit requests ("prove this goal"). An orchestration system based
on plans can also respond to environmental changes ("this belief changed — what
should I do?"). The latter is necessary for truly reactive systems that must respond
to tool outputs, error signals, external notifications, and state changes without
explicit user invocation.

---

## Distinction 2: Context-Sensitivity

**In logic programming**: Rules are unconditionally applicable. If the head unifies
and the body conditions are satisfied through proof search, the rule fires. There
is no separate "context" check — all conditions are part of the body.

**In AgentSpeak(L)**: Plans have an explicit **context condition** in the head,
evaluated against current beliefs before the plan is selected. The context is not
part of the proof — it is a pre-selection filter. If the context fails, the plan
is not selected; other applicable plans are tried.

This two-level structure (triggering event + context condition) enables the plan
library to contain multiple alternative plans for the same event type, with different
context conditions selecting among them based on current world state.

Rao: "Rules in a pure logic program are not context-sensitive as plans." (Section 2)

**Practical consequence**: Logic programs implement a single strategy for achieving
each goal. Agent plan libraries implement *multiple strategies*, with context
conditions selecting the appropriate strategy for the current situation. This is
the difference between a system that has one approach and a system that has genuine
situational awareness.

---

## Distinction 3: Actions vs. Proof

**In logic programming**: "Executing" a query produces a binding — a substitution
that makes the goal provable. The execution produces knowledge, not world changes.
Side effects in logic programming (I/O, assert/retract) are non-logical extensions
that break the formal semantics.

**In AgentSpeak(L)**: Plan bodies contain **primitive actions** — operations that
change the external environment. Actions are not proved; they are *executed*.
"Executing a plan generates a sequence of ground actions that affect the environment."
(Section 2)

Actions are the agent's interface to the world. They have preconditions (enforced
by context conditions) and effects (which may generate new belief update events from
the environment). The semantics of actions is operational, not logical: you don't
prove that an action was taken; you execute it and observe the consequences.

**Practical consequence**: Any system that must change the world — call APIs, execute
code, modify databases, send messages — cannot be purely logic-based. It needs the
action/execution semantics of agent plans. Logic programming can support reasoning
about actions (situation calculus, etc.) but cannot *execute* them without non-logical
extensions.

---

## Distinction 4: Interruptibility

Rao identifies this as a key distinction: "While a goal is being queried the
execution of that query cannot be interrupted in a logic program. However, the plans
in an agent program can be interrupted." (Section 2)

**In logic programming**: A proof search runs to completion (or failure) without
interruption. The system cannot handle new inputs, respond to environmental changes,
or switch to a higher-priority task while a proof is in progress (without explicit
coroutining mechanisms).

**In AgentSpeak(L)**: Between any two execution steps of an intention, the agent
cycles back to the event queue E. New events can be processed. New intentions can
be created. SI can select a different intention to advance. The currently executing
intention is suspended between steps.

This gives agents **real-time responsiveness**: an agent executing a long plan for
one task can interrupt that task (between steps) to handle an urgent new event, then
resume the original task.

**Practical consequence**: Any system handling multiple concurrent tasks or requiring
real-time responsiveness to new inputs cannot use synchronous, blocking logic
evaluation as its execution model. It needs the interleaved, step-by-step execution
model of agent intentions.

---

## Distinction 5: Commitment vs. Search

**In logic programming**: The execution model is depth-first search with
backtracking. If a chosen path fails, the system backtracks and tries alternative
paths. This is exhaustive but has no notion of commitment.

**In AgentSpeak(L)**: The agent *commits* to an applicable plan when SO selects it.
If that plan fails during execution, the default behavior in AgentSpeak(L) is
failure (the base formalism has no automatic backtracking to alternative applicable
plans). Some implementations add limited backtracking, but commitment is the default.

Why is commitment better than backtracking for agents? Because agents act in a
changing world. The world state at the time of backtracking may be different from
the world state at the time of the original plan selection. Backtracking to try
alternative plans as if the world hadn't changed is semantically incorrect. The
appropriate response to plan failure is to regenerate events, re-evaluate applicable
plans given the *current* world state, and re-commit.

Rao: agent programs can be seen as "multi-threaded interruptible logic programming
clauses." (Section 3, after Definition 12) The key additions are multi-threading and
interruptibility — both of which require abandoning pure logic programming's
single-threaded, non-interruptible execution model.

**Practical consequence**: Orchestration systems that use "retry" logic (backtrack
to a previous state and try again) must account for world-state changes between the
original attempt and the retry. Simply retrying a failed plan in the same way, ignoring
world-state changes, is a common failure mode.

---

## The Multi-Agent Dimension: Why Logic Programming Fails at Coordination

Logic programming was designed for single agents reasoning about a static world.
Multi-agent coordination requires:

1. **Concurrent execution**: Multiple agents acting simultaneously, each with their
   own execution thread. Logic programming has no native concurrency model.

2. **Event-driven coordination**: Agents reacting to each other's actions, not just
   to explicit queries. Logic programming has no native event model.

3. **Distributed belief management**: Agents maintaining and sharing beliefs across
   boundaries. Logic programming databases are typically centralized.

4. **Heterogeneous skill invocation**: Agents calling external tools, APIs, and
   services. Logic programming has no native mechanism for non-logical external calls.

Agent architectures address all four. The plan library, intention structure, belief
base, and selection functions together provide a framework for building multi-agent
systems where these requirements are met by design, not by ad-hoc extension.

**For WinDAGs with 180+ skills**: The skill invocation mechanism is fundamentally
the agent's primitive action mechanism — calling a skill is like executing a
primitive action. The orchestration layer that decides which skills to invoke and
in what sequence is the agent's plan selection and intention execution mechanism.
The coordination layer that handles concurrent skill invocations is the agent's
multi-intention management. The gap between "a logic program that picks skills"
and "an agent system that orchestrates skills" is exactly the gap between logic
programming and agent programming that Rao describes.

---

## When Logic Programming Is Appropriate (Boundary Conditions)

Despite these distinctions, logic programming and logical query evaluation remain
appropriate for specific components of agent systems:

1. **Context condition evaluation**: Checking whether plan context conditions hold
   in the belief base is a logical query — Horn clause resolution is appropriate here.

2. **Test goal evaluation**: Test goals `?g(t)` query the belief base — a logical
   query. Logic programming mechanisms (unification, resolution) are the right tools.

3. **Constraint satisfaction sub-tasks**: When a plan step requires solving a
   constraint problem (route planning, scheduling) over a structured domain,
   logic programming or constraint solvers are appropriate sub-components.

4. **Static knowledge bases**: If part of the agent's knowledge is genuinely static
   (ontologies, taxonomies, type hierarchies), logic programming over that knowledge
   is appropriate.

The principle: **logic programming is a sub-component of agent architectures, used
for the reasoning phases (context checking, test goal evaluation) not for the
execution phases (action execution, plan selection, intention management)**.

---

## Summary

Agent programs differ from logic programs in ways that matter for orchestration:

| Feature | Logic Programs | Agent Programs |
|---------|---------------|----------------|
| Invocation | Goal query (pull) | Event + context (push+filter) |
| Context | None (all in body) | Explicit head condition |
| Execution result | Binding/proof | World-changing actions |
| Interruption | Blocking | Step-wise, interruptible |
| Failure handling | Backtracking | Commitment + event-driven recovery |
| Concurrency | None native | Multiple intentions, SI scheduling |
| Reactivity | Goal-directed only | Both data-directed and goal-directed |

An orchestration system that is "just" a logic program over a skill library will
fail to meet the requirements of real-time responsiveness, concurrent task management,
event-driven coordination, and robust failure recovery. These requirements demand
the agent architecture — not because of aesthetic preference, but because the logic
programming execution model is fundamentally inadequate for them.