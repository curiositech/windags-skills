# Context-Sensitive Plans: How Agents Encode Situated Knowledge

## The Central Idea

The most distinctive architectural contribution of AgentSpeak(L) — and of the PRS/dMARS
systems it formalizes — is the **plan** as the fundamental unit of agent knowledge.
A plan is not a procedure. It is not a rule. It is not a heuristic. It is something
more precise: a **context-sensitive, event-triggered recipe** that encodes both *when*
a particular strategy is appropriate and *what to do* when it is.

Understanding plans properly — their structure, their selection, their hierarchical
composition — is essential for anyone building a system where multiple agents or
skills must coordinate to handle complex, varying situations.

---

## The Anatomy of a Plan

Every plan in AgentSpeak(L) has three components:

```
triggering_event : context_condition <- body
```

**Triggering Event**: Specifies what *kind* of situation activates this plan. Events
can be:
- `+b(t)`: a new belief was added (environmental change detected)
- `-b(t)`: a belief was deleted (something is no longer true)
- `+!g(t)`: an achievement goal was adopted
- `-!g(t)`: an achievement goal was dropped
- `+?g(t)`: a test goal was adopted

The triggering event captures *why* a plan is invoked — the external or internal
stimulus that makes it relevant.

**Context Condition**: A conjunction of belief literals that must be true in the
agent's current belief state for the plan to be *applicable* (not just relevant).
The context is the plan's precondition — it encodes the situational constraints
under which this particular strategy makes sense.

**Body**: A sequence of goals and actions that constitute the plan's execution.
Body elements can be:
- Achievement goals `!g(t)`: sub-goals to achieve (generate internal events, push
  onto intention stack)
- Test goals `?g(t)`: beliefs to verify (query B, bind variables)
- Primitive actions `a(t)`: operations dispatched to the environment

Consider the full plan from the robot example:

```
+location(waste, X) : location(robot, X) & location(bin, Y)
  <- pick(waste);
     !location(robot, Y);
     drop(waste).          [P1]
```

Reading this plan: "When new waste is detected at location X [triggering event],
*if* the robot is already at X and there is a bin at Y [context condition], *then*
pick up the waste, achieve the goal of being at location Y, and drop the waste [body]."

The plan encodes situational intelligence: it is not just a procedure for handling
waste, but specifically for handling waste *when the robot is already at the waste
location*. A different situation (robot not at waste location) requires a different
plan.

---

## Plans Are Not Logic Rules: Key Differences

Rao is explicit that plans superficially resemble Horn clauses in logic programming
but differ in fundamental ways (Section 2):

**1. Triggering events vs. goal heads**: In logic programming, the head of a rule
is the fact it proves. In an agent program, the head contains a *triggering event*
— the situation that invokes the plan. This allows both data-directed invocation
(belief changes) and goal-directed invocation (goal additions), neither of which
is possible in pure logic programming.

**2. Context-sensitivity**: Logic programming rules have no notion of context —
if the rule matches, it fires. Plans are context-sensitive: a plan matches only
when its context condition holds in the current belief state. This is closer to
*guarded commands* than to logic clauses.

**3. Actions affect the world**: Logic programming rules derive new facts within
the system. Agent plan bodies execute *primitive actions* that change the external
environment. The semantics of execution is not proof search but world-changing
behavior.

**4. Interruptibility**: "While a goal is being queried the execution of that query
cannot be interrupted in a logic program. However, the plans in an agent program
can be interrupted." (Section 2) This is critical for real-time systems where new
events must be handled before current tasks complete.

---

## The Plan Library as Behavioral Repertoire

An agent's **plan library P** is its complete repository of situational knowledge.
It encodes *everything the agent knows how to do*, organized by situation. The
library's design determines the agent's competence:

- A **complete plan library** has applicable plans for every situation the agent
  might encounter. Missing plans mean the agent cannot respond to certain events.

- A **well-structured plan library** has multiple alternative plans for the same
  triggering event with different context conditions — giving the agent genuine
  situational flexibility.

- A **hierarchical plan library** has plans whose bodies invoke sub-goals, which
  in turn have their own plans, enabling complex task decomposition from simple
  primitives.

The robot example demonstrates hierarchy beautifully. The top-level plan P1 for
handling waste invokes the sub-goal `!location(robot, Y)`. This sub-goal is handled
by plans P2 and P3:

```
+!location(robot, X) : location(robot, X) <- true.                    [P2]
+!location(robot, X) : location(robot, Y) & not(X=Y) &
                        adjacent(Y, Z) & not(location(car, Z))
  <- move(Y, Z);
     +!location(robot, X).                                              [P3]
```

P2 handles the base case (already at destination). P3 handles the recursive case
(move to adjacent clear lane, then retry). The plan library encodes *pattern of
behavior* (navigate to location) as a composable, reusable piece of agent knowledge.

**For WinDAGs**: The skill library is the plan library. Each skill should be
understood as a context-sensitive, event-triggered recipe:
- What *type* of task does this skill handle? (triggering event)
- Under what *conditions* is this skill applicable? (context condition)
- What *sequence of operations* does this skill perform? (body, potentially invoking
  other skills as sub-goals)

Skills that don't make their context conditions explicit cannot be reliably selected.
Skills that don't decompose into sub-goals are monolithic and non-reusable.

---

## Plan Selection: Choosing Among Alternatives

When multiple plans share the same triggering event but have different context
conditions, plan selection becomes the agent's primary intelligence. In the robot
example, both P2 and P3 trigger on `+!location(robot, X)`, but only one is
applicable in any given context.

The **SO selection function** chooses among applicable plans. Rao leaves SO
deliberately abstract — it is a policy parameter. Different implementations of SO
produce different agent behaviors:

- **First applicable**: Choose the first plan in the library that is applicable.
  Simple but brittle — depends on library ordering.
- **Random applicable**: Choose randomly among applicable plans. Useful for
  non-deterministic domains.
- **Meta-level selection**: Use a meta-plan to evaluate applicable plans and choose
  the best. Powerful but expensive.
- **Priority-weighted**: Assign priorities to plans; select the highest-priority
  applicable plan. Common in practice.

The insight is that **the plan selection policy is architecturally separate from
the plans themselves**. Changing SO changes the agent's decision-making strategy
without changing its behavioral repertoire. This separation is crucial for building
adaptive agents: you can tune selection policy empirically without modifying the
plan library.

---

## Context Conditions as Precondition Logic

The context condition of a plan is evaluated against the current belief state B
using logical consequence. Formally: "A plan p is an applicable plan with respect
to an event ε iff there exists a relevant unifier θ for ε and there exists a
substitution σ such that (b₁∧...∧bₘ)θσ is a logical consequence of B." (Def. 10)

This means context conditions support:
- **Positive conditions**: `location(robot, X)` — belief must be present
- **Negative conditions**: `not(location(car, Z))` — belief must be absent
- **Equality conditions**: `not(X = Y)` — term inequality
- **Conjunctions**: multiple conditions all must hold

Context conditions do *not* support (in the base formalism):
- Disjunctions (handled by having multiple plans)
- Arithmetic (requires extension)
- Probabilistic conditions (requires extension)
- Temporal conditions (requires extension)

**Practical limitation**: The context evaluation is a logical query against a belief
base. For large belief bases, this query can be expensive. In practice, belief bases
are kept small and well-indexed. Agents with very large knowledge bases need
optimized indexing structures for context checking.

---

## Plans as Units of Failure Recovery

A critical aspect of plan-based architectures not fully developed in the base
AgentSpeak(L) formalism but noted by Rao is **failure handling**. When a plan
fails — because an action fails, or a sub-goal has no applicable plan — the agent
needs a recovery strategy.

The natural recovery mechanism is **plan abandonment and alternative selection**:
if the current applicable plan fails, return to SO and select a different applicable
plan for the same event. This gives agents automatic resilience: they have a
repertoire of alternatives and can try each in sequence.

This maps directly to failure recovery in skill orchestration:
- Primary skill fails → context has changed → re-evaluate applicable skills
- No applicable skill found → escalate to meta-level handler
- All alternatives exhausted → signal failure to parent intention

The plan library should explicitly include **failure-recovery plans** — plans that
trigger on `!goal_failed` events and implement graceful degradation strategies.

---

## Summary: Designing Plans for Intelligent Systems

A well-designed plan (skill) must specify:

1. **Exactly what event type triggers it** — be specific; over-general triggers
   cause spurious invocations

2. **Precise context conditions** — the minimal set of beliefs that must hold for
   this plan to be appropriate; missing conditions cause inappropriate invocations

3. **A body that decomposes cleanly** — prefer sequences of sub-goals over
   monolithic action sequences; sub-goals enable reuse and independent failure
   handling

4. **Failure behavior** — what happens if a sub-goal fails? Should the plan retry,
   substitute, or escalate?

5. **Variable binding discipline** — variables in the head that appear in the
   context and body create the plan's generality; ensure all variables are grounded
   before primitive actions execute

The plan library's coverage, structure, and selection policy together determine an
agent's effective intelligence. The agent's cleverness is not in its reasoner — it
is in its plans.