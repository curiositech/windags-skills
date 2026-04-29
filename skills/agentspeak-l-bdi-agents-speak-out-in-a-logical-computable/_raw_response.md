## BOOK IDENTITY

**Title**: AgentSpeak(L): BDI Agents Speak Out in a Logical Computable Language
**Author**: Anand S. Rao
**Core Question**: How can we build a single formalism that is simultaneously executable as a program, interpretable as a logical system, and faithful to how rational agents actually deliberate — closing the gap between theoretical BDI models and working implementations?
**Irreplaceable Contribution**: Rao's paper is the foundational document that shows you can take an *implemented* agent system (PRS/dMARS), abstract its operational behavior into a clean formal language (AgentSpeak(L)), and then prove a one-to-one correspondence between that operational semantics and a proof-theoretic semantics based on labeled transition systems. No other work of this era achieves all three simultaneously: executability, logical soundness, and fidelity to practice. It also introduces the canonical architecture of event-driven, context-sensitive, intention-stack agents that underlies virtually every modern multi-agent and orchestration system.

---

## KEY IDEAS (3-5 sentences each)

1. **The BDI Trinity as Executable Architecture**: Beliefs, desires, and intentions are not merely philosophical attitudes — they are a complete computational architecture. Beliefs are queryable facts about the world; desires are triggering conditions that motivate action; intentions are *committed* plan stacks that the agent is actively executing. The key insight is that these three structures, kept separate and interacting through well-defined selection functions, produce rational, interruptible, goal-directed behavior without requiring a central omniscient planner.

2. **Context-Sensitive Plans as the Unit of Agent Knowledge**: Agent behavior is encoded not as monolithic procedures but as *plans* — event-triggered, context-guarded recipes that are applicable only when the world matches their preconditions. This means agent knowledge is inherently situational: the same triggering event may invoke different plans depending on current beliefs. A library of such plans constitutes the agent's full behavioral repertoire, and the agent's intelligence lies in selecting the right plan at the right moment.

3. **The Theory-Practice Gap and How to Close It**: Prior BDI formalisms were theoretically rich but computationally intractable; prior implementations were efficient but lacked formal grounding. Rao's solution is to start from practice (a working system) and formalize *upward* rather than starting from theory and approximating *downward*. This yields a formalism that is both provably correct and practically executable — the operational semantics and proof theory are in one-to-one correspondence.

4. **Intentions as Interruptible Multi-Threaded Commitment**: Unlike logic programming goals (which execute atomically to completion), intentions in AgentSpeak(L) are stacks of partially-instantiated plans that can be suspended, interleaved, and interrupted. Multiple intentions run concurrently, selected by a scheduling function. This gives agents real-time responsiveness: they can shift attention when the environment changes without abandoning their overall commitments.

5. **Selection Functions as the Locus of Agent Policy**: The architecture separates *what to do* (plans) from *how to choose* (selection functions SE, SO, SI). The selection function for events (SE), for applicable options (SO), and for which intention to execute (SI) are explicit, replaceable components. This means agent policy — rationality, priority, risk tolerance — lives in these functions, not buried in plan logic. Changing the agent's decision-making strategy requires only changing its selection functions.

---

## REFERENCE DOCUMENTS

### FILE: bdi-architecture-for-agent-orchestration.md
```markdown
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
```

---

### FILE: context-sensitive-plans-as-agent-knowledge.md
```markdown
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
```

---

### FILE: closing-theory-practice-gap-in-agent-systems.md
```markdown
# Closing the Theory-Practice Gap: Starting from Working Systems

## The Problem Rao Identified

In the opening pages of AgentSpeak(L), Rao describes a fundamental dysfunction in
the field of agent research that has direct relevance to any complex system-building
enterprise:

> "The complexity of theorem-proving and the completeness of these logics have not
> been clear. On the other hand, there are a number of implementations of BDI agents
> that are being used successfully in critical application domains. These
> implementations have made a number of simplifying assumptions... The complexity of
> the code written for these systems and the simplifying assumptions made by them have
> meant that the implemented systems have lacked a strong theoretical underpinning.
> The specification logics have shed very little light on the practical problems. As
> a result the two streams of work seem to be diverging." (Section 1)

Two communities were working on the same problem — rational agent behavior — and
diverging. Theorists built beautiful, expressive logics that were computationally
intractable. Practitioners built working systems that lacked formal grounding and
were therefore impossible to verify, analyze, or systematically improve.

This divergence is not unique to agent research. It appears wherever complex systems
are built: the theory of how systems *should* work drifts from the practice of how
they *do* work, until neither community can help the other.

---

## Rao's Solution: Formalize Upward from Practice

Rao's methodological contribution is as important as his technical contribution. He
inverts the standard approach:

**Standard approach**: Start with an idealized theoretical model (e.g., a multi-modal
temporal logic of belief, desire, and intention). Prove completeness and decidability.
Then attempt to implement it, discovering that the theory requires simplifying
assumptions that undermine its theoretical properties.

**Rao's approach**: Start with a *working implementation* (PRS/dMARS). Abstract its
operational behavior into a clean formal language (AgentSpeak(L)). Then develop the
proof theory *of that language*, showing that the proof theory and operational
semantics are in one-to-one correspondence.

> "Unlike some of the previous attempts, it takes as its starting point one of the
> implemented systems and formalizes its operational semantics." (Section 1)

> "The primary contribution of this work is in opening up an alternative, restricted,
> first-order characterization of BDI agents and showing a one-to-one correspondence
> between the operational and proof-theoretic semantics of such a characterization."
> (Section 5)

The result is a formalism that is:
- **Executable**: the interpreter in Figure 1 is a direct implementation
- **Logically sound**: the labeled transition system provides provable properties
- **Practically grounded**: it abstracts a system that has been running in critical
  domains since the mid-1980s

The sacrifice is expressiveness: AgentSpeak(L) is less expressive than the
multi-modal logics it replaces. But it is decidable, implementable, and verifiable
— and it captures what practitioners actually need.

---

## The Lesson for System Design: Formalize What You Build

This methodological lesson transfers directly to the design of intelligent
orchestration systems.

**Failure mode**: Build a complex orchestration system (routing logic, agent
coordination, skill invocation, state management) without any formal model of what
it is supposed to do. The system works in testing but fails unpredictably in
production. Debugging is impossible because no one can specify precisely what
correct behavior looks like. Improvements are made by intuition and break other
things.

**Rao's method applied**: 
1. Build a working prototype of the coordination mechanism
2. Abstract its behavior into a formal operational description (not a full logic —
   just a precise state-transition specification)
3. Identify the key selection functions / policy points
4. Specify properties you want the system to guarantee (liveness, safety, fairness)
5. Verify those properties against the operational description

The formal description need not be published research. It need only be precise
enough to reason about. A state machine diagram with well-defined transitions is
enough. The goal is to make the gap between specification and implementation
*visible and measurable*.

---

## The One-to-One Correspondence Principle

The technical heart of Rao's contribution is the **one-to-one correspondence**
between:

1. **The interpreter** (Figure 1 — the operational, computational description)
2. **The proof rules** (Section 4 — the logical, declarative description)

Each step in the interpreter corresponds to exactly one proof rule in the transition
system. Executing the interpreter is equivalent to constructing a proof. Proving a
property in the transition system implies the property holds in any execution of
the interpreter.

This correspondence is the formalization of a design principle: **what a system
computes should be exactly what its specification says it should compute**. No more,
no less. The specification is not aspirational — it is definitional.

For the IntendEnd proof rule (adopting a top-level intention), the rule states:

```
<{..., <+!g(t); T>, ...}, Bi, Ii, Ai, i>
    ⊢
<{...}, Bi, Ii ∪ {[p₁]}, Ai, i+1>
```

where p is the applicable plan whose context is logically entailed by B. This is
not a description of what *should* happen in some ideal world. It is a formal
specification of *exactly* what the interpreter does when it processes an external
event. The correspondence is the guarantee.

**Applied to WinDAGs**: Every coordination mechanism — routing decisions, skill
invocation, state update, failure propagation — should have a corresponding formal
description, even if informal. The question to ask of every component: "Can I write
down exactly what this does as a state transition? If not, what is the implicit
behavior that I cannot specify?" Unspecifiable behavior is where bugs live.

---

## Simplifying Assumptions as Features, Not Bugs

A key aspect of Rao's approach is his willingness to accept expressive limitations
in exchange for tractability and correspondence. AgentSpeak(L) omits many features
of full BDI logics:

- No probabilistic beliefs (beliefs are binary: present or absent)
- No explicit desire representation (desires become goals when adopted)
- No deontic operators (no obligations, permissions)
- No temporal operators (no belief about past or future states)
- Negation is only over ground atoms

These are not oversights — they are deliberate choices. The simplifying assumptions
make the formalism decidable and the interpreter straightforward. Rao explicitly
acknowledges that "the implemented system has more language constructs to make the
task of agent programming easier" (Section 2) — the paper is an abstraction, not a
full description.

**The lesson**: In building complex systems, the temptation is always to add more
features, more expressiveness, more flexibility. Rao's example argues for the
opposite strategy: **identify the minimal set of features that captures the essential
behavior, formalize that, verify it, then extend carefully**. Each extension should
be accompanied by an extension of the formal model and a re-verification of key
properties.

The failure mode of maximum expressiveness is the theory-practice gap Rao identifies
in his opening: you build something so expressive it cannot be analyzed, so complex
it cannot be verified, so general it cannot be optimized.

---

## Operational Semantics as Living Documentation

One underappreciated contribution of AgentSpeak(L) is its demonstration that
**operational semantics can serve as living documentation**. The interpreter in
Figure 1 is simultaneously:

- A specification (it defines what the agent does)
- Documentation (it explains what the agent does)
- A test oracle (correct behavior is whatever the interpreter says)
- A formal basis (the proof rules are derived from it)

For any orchestration system, the interpreter-level description should be the
primary documentation artifact. Not architecture diagrams (too high-level). Not
code comments (too low-level). A precise description of what the system does with
each type of input, given each type of state.

This is what Rao means by "the holy grail of BDI agent research is to show a
one-to-one correspondence between the model theory, proof theory, and the abstract
interpreter." (Section 1) The holy grail is not an exotic technical achievement
— it is documentation that is simultaneously precise enough to reason about and
concrete enough to implement.

---

## Caveats and Limitations

**The gap can be too far to close**: Rao's approach works because PRS/dMARS, while
complex in implementation, has a relatively simple underlying computational model.
For systems with extremely complex behaviors (e.g., systems with continuous
state spaces, stochastic transitions, or emergent behavior from agent interactions),
the distance between working implementation and clean formalism may be unbridgeable
without radical simplification.

**Simplification can eliminate important behavior**: When abstracting from practice
to formalism, it is possible to abstract away the *interesting* behavior — the
edge cases, the error handling, the optimizations — that make the system work in
practice. The formalism may be consistent with many different implementations,
only some of which work correctly.

**Formal verification scales poorly**: Even with a clean formalism, proving
properties of agent systems is computationally expensive. Model checking state
spaces of multi-agent systems is PSPACE-complete or worse. Rao provides a basis
for formal verification but does not claim it is computationally tractable for
large systems.

---

## Summary

The theory-practice gap is closed by:

1. Starting from working practice, not theoretical idealization
2. Abstracting upward to the minimal formalism that captures essential behavior
3. Demonstrating one-to-one correspondence between formalism and implementation
4. Accepting expressive limitations as the price of tractability and verifiability
5. Treating operational semantics as the primary documentation artifact

For intelligent system design, the principle is: **every coordination mechanism
should have a precise operational description that serves simultaneously as
specification, documentation, and basis for reasoning about correctness**.
```

---

### FILE: selection-functions-as-agent-policy.md
```markdown
# Selection Functions: Where Agent Policy Lives

## The Key Architectural Insight

One of the most practically important contributions of AgentSpeak(L) is its
explicit separation of **what an agent knows how to do** (the plan library P)
from **how an agent decides what to do** (the selection functions SE, SO, SI).

This separation is architecturally profound. It means that the agent's behavioral
*repertoire* and the agent's *decision-making strategy* are independent, replaceable
components. You can change an agent's strategy without changing its skills. You can
reuse an agent's skills with a different strategy. You can analyze the strategy
independently of the skills and vice versa.

Most real-world orchestration systems violate this separation catastrophically —
routing logic, priority decisions, and skill invocations are entangled in monolithic
decision procedures that cannot be analyzed, replaced, or tuned independently.

---

## The Three Selection Functions

**SE: Event Selection**

SE selects which event to process from the pending event set E. The event set can
contain multiple pending events simultaneously — new environmental observations,
internally generated sub-goals from executing intentions, external requests. SE
determines the agent's *attention* — what it focuses on next.

Different SE policies produce radically different agent behaviors:

- **FIFO**: Process events in arrival order. Fair, predictable, but potentially
  slow to respond to urgent events.
- **Priority queue**: Process highest-priority events first. Responsive to urgency
  but can starve low-priority events.
- **Recency-based**: Process most recently arrived events first. Responsive but
  can abandon long-running tasks.
- **Type-based**: Process certain event types (e.g., failure events, belief updates)
  before goal events. Implements meta-level priorities.
- **Deadline-aware**: Process events closest to their deadline first. Appropriate
  for real-time systems.

The choice of SE determines whether the agent is primarily **reactive** (handles
new observations quickly) or **deliberative** (completes current intentions before
attending to new inputs). Neither is universally correct — the right SE depends on
the domain.

**SO: Option Selection**

SO selects which applicable plan to commit to when multiple plans are applicable
for a given event. This is the agent's *strategic* selection — given that it must
respond to this event, which approach should it take?

Different SO policies:

- **First-match**: Select the first applicable plan in library order. Simple,
  deterministic, depends on library structure.
- **Random**: Select randomly among applicable plans. Useful for exploration or
  stochastic domains.
- **Utility-weighted**: Assign utilities to plans (expected cost, risk, resource
  consumption); select the highest-utility applicable plan.
- **Meta-plan**: Use a specialized meta-level plan that evaluates applicable plans
  and selects the best. Enables context-sensitive strategy selection beyond what
  context conditions capture.
- **Learning-based**: Use past execution history to estimate plan success probability;
  select accordingly.

SO is where the agent's *wisdom* lives — its ability to choose not just applicable
strategies but *good* strategies given the current situation. A naive SO (first-match)
makes an otherwise brilliant plan library useless; a sophisticated SO can compensate
for an incomplete plan library by making good guesses.

**SI: Intention Selection**

SI selects which active intention to advance in each interpreter cycle. An agent
can have multiple active intentions simultaneously — multiple top-level goals it
is pursuing in parallel. SI determines which one gets computational resources in
each cycle.

Different SI policies:

- **Round-robin**: Advance each intention in turn. Fair, predictable, gives
  each intention equal throughput.
- **Priority-based**: Advance the highest-priority active intention. Ensures
  critical intentions complete faster.
- **Shortest-remaining**: Advance the intention closest to completion. Minimizes
  mean completion time.
- **Dependency-aware**: Advance intentions that are not blocked on sub-goals;
  skip blocked intentions. Prevents wasted cycles.
- **Context-sensitive**: Advance intentions whose next step is feasible given
  current beliefs; skip intentions whose next action is currently impossible.

SI determines the agent's *multitasking behavior* — how it interleaves concurrent
commitments. In real-time systems, SI is crucial: a delayed-intention that should
have been advanced three cycles ago may cause the agent to miss a deadline.

---

## Selection Functions as Replaceable Policy Modules

The architectural importance of making selection functions explicit and replaceable
cannot be overstated. Consider what this enables:

**1. Separate development**: Plan library authors focus on *what to do* in each
situation. Policy designers focus on *how to prioritize* and *how to choose*. These
are genuinely different skills requiring different expertise.

**2. Domain adaptation**: The same plan library (same behavioral knowledge) can be
deployed with different selection policies for different deployment contexts. A
medical diagnosis agent with urgent vs. non-urgent cases might use different SE
policies in ICU vs. outpatient settings.

**3. Empirical tuning**: Selection functions can be tuned based on observed
performance without modifying plans. Track which SO choices led to successful
intention completions; train a policy accordingly.

**4. Formal analysis**: The formal properties of an agent — liveness (intentions
eventually complete), safety (certain actions never taken), fairness (all intentions
eventually advance) — depend critically on the selection function policies. You can
prove these properties for specific selection function implementations.

**5. Testing isolation**: Test the plan library with a known, simple selection
policy (first-match, round-robin). Test selection function policies with a known,
simple plan library. Problems in integration are then attributable to the interaction,
not to either component alone.

---

## Selection Functions in WinDAGs

Translating this to a DAG-based orchestration system with 180+ skills:

**SE equivalent: Task/Event Router**

The orchestrator receives events — user requests, tool outputs, error signals,
sub-agent completions. Which event gets processed next? This is SE. The router
should be an explicit, configurable component with a well-defined interface:
input is the current event queue and system state; output is the next event to
process.

Design considerations:
- Failure events should generally take priority over normal task events (safety)
- User-initiated events may take priority over internally generated events (responsiveness)
- Events with pending timeouts need deadline-aware priority
- Sub-goal completions that unblock other intentions should be processed promptly

**SO equivalent: Skill Selector**

Given a task type and current system state, which skill (among applicable skills)
should be invoked? This is SO. The skill selector should be an explicit component
separate from the skill library itself.

Design considerations:
- Skills with lower computational cost should be preferred when equivalently capable
- Skills with recent failures should be deprioritized temporarily
- Skills that produce outputs directly usable by subsequent pipeline steps should
  be preferred for intermediate tasks
- Meta-skill selection (using one skill to choose among others) is possible and
  powerful but expensive

**SI equivalent: Intention/Thread Scheduler**

The orchestrator may have multiple concurrent task threads active — multiple
user requests, multiple long-running sub-tasks. Which thread gets the next
computational resource allocation? This is SI.

Design considerations:
- Threads blocked on external tool calls should not consume scheduler resources
- Threads with user-visible latency implications should be prioritized
- Threads that have been waiting longest should eventually advance (starvation prevention)
- Threads executing non-interruptible skill invocations should complete current
  step before yielding

---

## The Meta-Level: Selection Functions Selecting Selection Functions

An important extension not fully developed in Rao's base formalism is the
possibility of **adaptive selection functions** — selection functions that change
their own behavior based on observed outcomes.

A meta-level SO, for example, might:
1. Maintain statistics on plan success rates per context type
2. Estimate probability of success for each applicable plan given current context
3. Select the plan with highest expected utility
4. Update statistics after execution

This is the agent learning its own selection policy from experience. The plan
library remains fixed; the selection function adapts. This is computationally
tractable (the selection function is lightweight compared to plan execution) and
empirically grounded (based on actual execution history).

The architectural insight: **learning and adaptation should be implemented in the
selection functions, not in the plans**. Plans encode domain knowledge, which
changes slowly. Selection functions encode policy, which can be adapted quickly.

---

## Failure Handling and Selection Function Interaction

An important but subtle interaction: what happens when SO selects a plan that
subsequently fails during execution? The selection function must be informed of
this failure and adjust accordingly.

There are two approaches:

**Backtracking SO**: When a plan fails, return control to SO to select a different
applicable plan for the same event. This makes failure recovery automatic and
transparent. The agent tries each applicable plan in sequence until one succeeds
or all are exhausted.

**Failure event generation**: When a plan fails, generate a failure event and add
it to E. SE processes this failure event; SO selects a recovery plan. This makes
failure handling explicit and allows specialized recovery plans.

The first approach is simpler and automatically robust. The second approach is more
flexible — failure recovery can be as sophisticated as any other agent behavior.

Most practical systems use a combination: backtracking within a plan family
(plans for the same event type) and failure events for cross-cutting recovery.

---

## Boundary Conditions

**When selection functions are insufficient**:

1. **Global optimization problems**: SE, SO, and SI are all local, greedy policies.
   They optimize the current decision without lookahead. Problems requiring global
   optimization (e.g., scheduling n intentions to minimize total completion time)
   require planning, not selection.

2. **Adversarial environments**: Selection functions that are deterministic can be
   exploited in adversarial settings. Randomized selection may be necessary.

3. **Resource-constrained systems**: Standard selection functions do not account for
   computational resource availability. In resource-constrained settings, SO must
   consider resource costs of each applicable plan, and SI must account for
   concurrent resource consumption across active intentions.

---

## Summary

Selection functions are the agent's policy layer:

1. **SE** controls attention — which events get processed and in what order
2. **SO** controls strategy — which applicable plan to commit to
3. **SI** controls multitasking — which active intention to advance

These functions should be:
- **Explicit**: named, documented, independently specified components
- **Replaceable**: pluggable policies with well-defined interfaces
- **Separate from plans**: behavioral knowledge and selection policy are distinct
- **Tunable**: adaptable based on observed performance without modifying plans
- **Formally analyzable**: agent properties (liveness, safety, fairness) depend on
  selection functions and should be provable from their specifications

In WinDAGs, the event router, skill selector, and thread scheduler are the concrete
manifestations of SE, SO, and SI respectively. They deserve as much design attention
as the skills themselves.
```

---

### FILE: intention-management-and-goal-decomposition.md
```markdown
# Intention Management and Hierarchical Goal Decomposition

## Intentions Are Not Goals

A fundamental conceptual distinction in AgentSpeak(L) — one that most informal
descriptions of agent systems blur — is between **goals** and **intentions**.

A **goal** is what an agent *wants to bring about*. It is motivational. An agent can
have goals it never acts on, goals it cannot currently pursue, goals it is holding
in reserve. Goals are desires adopted into the system.

An **intention** is an agent's *committed course of action to achieve a goal*. It is
not just the goal — it is the goal together with the specific plan the agent has
selected to achieve it, the current execution state of that plan, and the stack of
sub-plans generated during execution. Rao: "The adoption of programs to satisfy such
stimuli can be viewed as intentions." (Section 1)

This distinction matters enormously for system design. You can have a goal without
an intention (you want X but aren't doing anything about it). You can have an
intention that outlasts its original goal (you're executing a plan even though the
goal has been achieved or abandoned — a form of practical inertia). The distinction
makes both phenomenons explicit and manageable.

---

## The Intention Stack: Capturing Hierarchical Decomposition

Each intention in AgentSpeak(L) is represented as a **stack of partially instantiated
plan frames**:

```
[p₁ | p₂ | ... | pₙ]
```

where p₁ is at the bottom (the top-level plan frame) and pₙ is at the top (the
currently executing frame). The stack discipline captures hierarchical decomposition:

- **Adopting a top-level intention**: A new intention is created containing a single
  frame — the applicable plan for the top-level event. Stack: `[p₁]`

- **Encountering a sub-goal**: When executing p₁, the agent encounters an achievement
  goal `!g(t)`. This generates an internal event, plan selection finds an applicable
  plan p₂ for `!g(t)`, and p₂ is pushed onto the stack. Stack: `[p₁ | p₂]`

- **Completing a sub-goal**: When p₂ completes (its body reduces to `true`), the
  frame is popped and the parent frame p₁ resumes execution at the point after the
  achievement goal. Stack: `[p₁]`

- **Completing the top-level intention**: When p₁ completes, the stack is empty and
  the intention is finished.

This stack structure is precisely what you need for hierarchical task decomposition:
each level of the hierarchy corresponds to one level of the stack. The stack
automatically tracks "where you are" in the decomposition.

The formal definition (Definition 7): "Each intention is a stack of partially
instantiated plans, i.e., plans where some of the variables have been instantiated.
An intention is denoted by [p₁ ⫿ ··· ⫿ pₙ], where p₁ is the bottom of the stack
and pₙ is the top of the stack."

---

## Internal vs. External Events: The Two Ways Intentions Grow

Rao distinguishes two types of events with fundamentally different effects on the
intention set (Definition 8):

**External events** arrive from the environment (or from an external user). They
are paired with the *true intention* T as their source intention. When an external
event is processed and an applicable plan is found, the plan creates a **new**
intention — a fresh, independent thread of activity.

**Internal events** are generated during the execution of an existing intention
(e.g., when an achievement goal is encountered in a plan body). They are paired with
the *existing intention* that generated them. When an internal event is processed and
an applicable plan is found, the plan is **pushed onto the stack** of the generating
intention — not creating a new intention but deepening the current one.

This distinction is crucial for understanding agent concurrency:

- Multiple external events → multiple concurrent intentions → genuine parallelism
- Sub-goal chains from one external event → one intention with a deep stack → sequential decomposition

An agent that responds to three simultaneous external requests will have three
concurrent intentions. Each intention may develop a deep stack as it decomposes
its task hierarchically. The SI selection function interleaves execution across
these concurrent intentions.

**For WinDAGs**: This maps directly to the distinction between parallel task
execution (multiple top-level requests become multiple concurrent workflows) and
sequential sub-task decomposition (a single workflow decomposes into sequential
sub-skills, each waiting for the previous to complete before proceeding). Confusing
these two patterns — using parallel execution for sequential dependencies — is one
of the most common orchestration failures.

---

## The Complete Lifecycle of an Intention

An intention progresses through the following lifecycle:

**1. Creation**: An external event `<e, T>` arrives. SE selects it. Applicable plans
are found. SO selects one. The applicable plan is instantiated with the applicable
unifier. A new intention containing this plan frame is added to I.

**2. Execution**: SI selects this intention. The first formula in the body of the
top frame is examined:

- **Achievement goal** `!g(t)`: Generate internal event `<+!g(t), intention>`.
  Add to E. The intention "waits" — it will not advance until the sub-goal is
  processed and a plan is pushed onto its stack.

- **Test goal** `?g(t)`: Query B. If satisfied, apply substitution to remaining
  body, remove test goal from body. Intention advances immediately.

- **Primitive action** `a(t)`: Add action to A (dispatch to environment). Remove
  from body. Intention advances.

- **`true`**: The current frame is complete. Pop the frame. If the stack is now
  empty, the intention is complete and removed from I. If not empty, the parent
  frame resumes.

**3. Interleaving**: Between any two execution steps, the agent processes pending
events (cycling back to SE). This is where new information from the environment
can change beliefs, trigger new intentions, or affect the applicability of plans
in existing intentions.

**4. Completion**: The intention stack empties. The top-level goal is achieved.
The intention is removed from I.

**5. Abandonment** (not in base formalism, noted as extension): An intention can
be abandoned if its top-level goal is no longer desired or becomes unsatisfiable.
This requires explicit mechanisms for goal deletion events and intention cancellation.

---

## Intention Dropping: The Missing Mechanism

One of the most practically important gaps in the base AgentSpeak(L) formalism is
the absence of a mechanism for **dropping intentions**. Rao notes that the operational
semantics can be extended with "deletion of intentions, and success and failure events
for actions, plans, goals, and intentions" (Section 4), but does not develop these.

In practice, agents *must* be able to drop intentions when:
- The goal that motivated the intention has been achieved by other means
- The goal is no longer desired (external conditions changed)
- The resources required for the intention are no longer available
- A higher-priority intention requires the same resources

Intention dropping is where BDI theory and practice most dramatically diverge.
Full BDI logics specify precise conditions under which agents should reconsider and
drop intentions (related to commitment strategies: "blind commitment" = never drop,
"single-minded commitment" = drop when achieved or impossible, "open-minded
commitment" = periodically reconsider). Implemented systems handle this with various
ad-hoc mechanisms.

**For WinDAGs**: Every orchestration system needs explicit cancellation and timeout
mechanisms. A running skill invocation should be cancellable if the parent task
is dropped. Long-running intentions should periodically check whether their goal
is still valid. The architecture should support "intention interruption" (suspend
without dropping) and "intention cancellation" (drop with cleanup).

---

## Multiple Concurrent Intentions: Interleaving and Fairness

When multiple intentions are active simultaneously, SI must interleave their
execution fairly. Consider:

- Intention I₁: handling a complex query requiring 10 steps
- Intention I₂: handling an urgent notification requiring 2 steps
- Intention I₃: monitoring a background process, 1 step per cycle

With round-robin SI: I₂ and I₃ progress at the same rate as I₁, which is fair but
means the urgent notification waits.

With priority SI: I₂ completes before I₁ advances significantly, I₁ before I₃. But
I₃ may never advance if I₁ and I₂ keep arriving.

With deadline-aware SI: Whichever intention is closest to its deadline advances next.
Good for real-time systems but requires deadline specification for all intentions.

The key insight is that **SI policy has global effects on system performance** that
are not visible from the plan library. A plan library designed with the assumption
of sequential execution (SI always advances the same intention until completion) will
behave very differently when deployed with a round-robin SI. The interaction between
SI policy and plan structure must be considered jointly.

---

## Sub-Goal Resolution as SLD-Resolution

Rao explicitly notes the connection to logic programming: "The above definition is
very similar to SLD-resolution of logic programming languages. However, the primary
difference between the two is that the goal g is called indirectly by generating an
event." (Section 3, after Definition 12)

This analogy illuminates both the power and the limitations of the mechanism:

**Power**: Like SLD-resolution, intention execution performs principled, systematic
goal decomposition. Each sub-goal invokes its applicable plan, which decomposes it
further, until primitive actions are reached. This is provably complete (within the
plan library) for the deterministic case.

**Limitation**: Like SLD-resolution, the basic mechanism is depth-first (commit to
one applicable plan, execute it fully, backtrack only on failure). Alternative
approaches (breadth-first plan selection, best-first search over plan trees) are
not captured by the base formalism and would require significant extensions.

**Key difference from logic programming**: Goal g is called "indirectly by generating
an event" — the sub-goal becomes an event in E, allowing the agent to interleave
with other intentions before committing to a sub-plan. This interleaving capability
is the crucial real-time advantage of the agent architecture over pure logic
programming: new environmental information can affect which plans are applicable to
the sub-goal before it is processed.

---

## Practical Design Patterns

**Pattern 1: Intention Isolation**
Each top-level user request becomes a separate intention. This gives each request
independent execution, independent failure handling, and independent resource
tracking. Intentions do not share state except through the shared belief base.

**Pattern 2: Sub-Goal Factoring**
Common sub-tasks should be factored into achievement goals with their own plans,
not copied into every plan that needs them. This enables plan reuse and centralized
improvement of common behaviors.

**Pattern 3: Context-Checkpoint Sub-Goals**
At critical decision points in a long plan body, insert test goals `?context_check`
that verify the plan's assumptions still hold. This gives the agent periodic
opportunities to detect environmental changes that invalidate the current strategy.

**Pattern 4: Explicit Milestone Actions**
Use primitive actions not just to affect the environment but to emit progress signals.
This allows the parent intention (and external monitors) to track execution progress
without inspecting the intention stack directly.

**Pattern 5: Failure Recovery as Sub-Goal**
When a plan step may fail, wrap it in a sub-goal with multiple applicable plans:
primary strategy as Plan A, recovery strategy as Plan B. The automatic backtracking
mechanism tries Plan A first; if it fails, SO selects Plan B.

---

## Summary

Intention management in AgentSpeak(L) teaches:

1. **Intentions are not goals** — they are committed, executing, hierarchically
   structured courses of action

2. **Intention stacks capture hierarchical decomposition** — each stack level
   corresponds to one decomposition level; completion pops the stack; the discipline
   is automatic

3. **External events create new intentions; internal events deepen existing ones** —
   this is the fundamental distinction between parallelism and sequentiality in
   agent execution

4. **Concurrent intentions interleave via SI** — the scheduler policy has global
   performance implications that interact with plan structure

5. **Intention dropping is architecturally necessary but absent in the base
   formalism** — all practical systems must add explicit cancellation, timeout,
   and reconsideration mechanisms

6. **Sub-goal resolution resembles SLD-resolution but with event-mediated
   invocation** — the event mechanism provides real-time flexibility that pure
   logic programming cannot offer
```

---

### FILE: belief-management-and-world-modeling.md
```markdown
# Belief Management: How Agents Model Their World

## Beliefs as the Agent's Epistemic Foundation

In AgentSpeak(L), the belief base B is the agent's complete model of the world —
of itself, its environment, and other agents. Everything the agent "knows" lives in B.
Plan context conditions are checked against B. Test goals query B. Variable bindings
are established through B. The belief base is the epistemic foundation upon which all
agent behavior rests.

Rao defines beliefs precisely (Definition 1):

> "If b is a predicate symbol, and t₁,...,tₙ are terms then b(t₁,...,tₙ) or b(t) is
> a belief atom. If b(t) and c(s) are belief atoms, b(t)∧c(s), and ¬b(t) are beliefs.
> A belief atom or its negation will be referred to as a belief literal. A ground
> belief atom will be called a base belief."

The base beliefs are ground atoms — specific, concrete facts about the current state.
The robot example's base beliefs at a given moment might be:

```
adjacent(a,b).    adjacent(b,c).    adjacent(c,d).
location(robot,a).
location(waste,b).
location(bin,d).
```

This is the agent's current world model. It is not a theory, not a probability
distribution, not a fuzzy assessment — it is a set of facts the agent treats as
currently true.

---

## Belief Updates: How the World Enters the Agent

The agent's belief base changes through **belief update events** generated by the
environment. When the environment changes — a robot moves, waste appears, a car
enters a lane — the environment sends the agent a belief update:

- `+location(robot, b)`: the robot is now at location b
- `-location(robot, a)`: the robot is no longer at location a
- `+location(car, c)`: a car has appeared at location c

These updates arrive as external events in E, are processed by SE, and potentially
trigger plans via their triggering events. Plans can also assert and retract beliefs
internally (noted as an extension in Section 4: "assertion and deletion of beliefs
in plan bodies").

The critical architectural point: **the belief base is the agent's only representation
of world state**. There is no hidden world model, no cached state in plans, no
implicit assumptions. When a plan needs to know the robot's location, it queries B.
When a plan's context condition checks for the absence of a car, it checks B.
The belief base is the single source of truth.

**Consequences for system design**:
- All environmental observations must be converted to belief updates
- Beliefs must be kept current — stale beliefs cause incorrect plan selection
- The belief base must be queryable efficiently — context checking happens at
  every event processing cycle
- Belief atomicity matters — a multi-step belief update (robot leaves a, robot
  arrives b) should be atomic with respect to plan triggering

---

## The Closed World Assumption and Its Limits

AgentSpeak(L) operates under the **closed world assumption** (CWA): if a belief
atom is not in B, it is assumed to be false. This is why `not(location(car, Z))`
in plan P3's context works — if no car location is recorded in B, the agent infers
no car is present.

The CWA is computationally efficient (no explicit negation storage needed) and
logically clean (negation is just absence). But it creates a critical failure mode:
**the agent cannot distinguish between "no car is here" and "I don't know if a car
is here"**. Both are represented identically — absence from B.

In the robot domain, this is safe because the environment reliably informs the
agent of all car locations. In domains where observations are incomplete or delayed,
the CWA can cause catastrophically wrong conclusions. An agent that infers the road
is clear because it has no belief about a car — when in reality it simply hasn't
observed the car — may take dangerous actions.

**Extension needed for uncertainty**: Production systems need either:
1. **Open world assumption** (OWA): explicit representation of what the agent
   doesn't know, not just what it knows
2. **Probabilistic beliefs**: confidence values attached to belief atoms
3. **Epistemic actions**: "look" and "check" actions that explicitly resolve
   uncertainty before committing to plans with safety implications

The base AgentSpeak(L) formalism does not provide any of these. Rao acknowledges
this as a limitation by restricting negation: "we require that all negations be
ground when evaluated." (Section 2, footnote) Negation over non-ground atoms would
require full non-ground negation as failure — computationally expensive and
semantically problematic.

---

## Belief Queries: How Plans Access World State

Plans access world state in two ways:

**Context condition queries** (at plan selection time): The context condition is
a conjunction of belief literals that must hold in B for the plan to be applicable.
These are evaluated as part of plan selection — before the plan is committed to.
Context conditions are the agent's way of asking: "Is this plan appropriate right
now?"

**Test goal queries** (during plan execution): A test goal `?g(t)` in a plan body
queries B during execution and binds variables in the answer. These are evaluated
at the specific moment in execution when the test goal is reached.

The difference is temporal:
- Context conditions are evaluated at the moment of plan selection
- Test goal queries are evaluated at the moment of execution (which may be later)

This temporal gap creates a subtle failure mode: the context condition checked at
selection time may no longer hold by the time the relevant test goal or action is
reached in execution. The world may have changed between plan selection and plan
step execution. Robust plan design must account for this:

**Design principle**: Place test goals that re-verify critical conditions *immediately
before* actions that depend on those conditions, not just in the context condition.
The context condition is a filter for plan selection; test goals within the body
provide runtime verification.

---

## Variable Binding Through Belief Queries

A sophisticated use of the belief base is **variable binding during context checking
and test goal resolution**. Consider plan P1:

```
+location(waste, X) : location(robot, X) & location(bin, Y)
  <- pick(waste);
     !location(robot, Y);
     drop(waste).
```

The variables X and Y are not provided externally — they are bound by matching the
context condition against B. When B contains `location(robot, a)` and
`location(bin, d)`, the applicable unifier binds X to `a` and Y to `d`. The plan
body then executes with these specific values: the sub-goal becomes
`!location(robot, d)`.

This is unification-based parameterization: the plan's specific parameters are
determined by the current world state, not by the triggering event alone. The same
plan handles any waste-robot-bin configuration, with the specific values extracted
from beliefs.

**For WinDAGs**: Skills should be parameterized through context queries, not through
hardcoded values or all-explicit parameters. A skill that handles "files" should
query the current context for relevant file paths, permissions, and metadata rather
than requiring all these as explicit inputs. This makes skills more general and
reduces the coordination overhead of explicit parameter passing.

---

## Belief Dynamics and Plan Reactivity

The belief base changes continuously as the environment sends updates. Each belief
change is an event — `+b(t)` or `-b(t)` — that can trigger plans. This gives the
agent **data-directed reactivity**: plans are not just invoked by goal adoption but
by environmental observations.

In the robot example, detecting waste at location X (`+location(waste, X)`) triggers
plan P1 (if context conditions are met). The agent doesn't need to be told to pick
up the waste as a goal — it observes the waste and reacts automatically.

This data-directed invocation is one of the key differences from pure goal-directed
planning. Pure planning systems respond only to explicitly stated goals. BDI agents
respond to both goals and observations. This makes them genuinely reactive to their
environment rather than merely responsive to instructions.

**Reactivity patterns**:
- **Opportunity detection**: Plans triggered by positive belief additions that detect
  favorable conditions ("waste appeared in my current lane — pick it up now")
- **Threat detection**: Plans triggered by positive belief additions that detect
  dangerous conditions ("car appeared in adjacent lane — change plan")
- **Goal maintenance**: Plans triggered by negative belief deletions that detect
  desired conditions being lost ("bin is no longer at expected location — re-plan")

---

## Belief Base as Shared Memory in Multi-Agent Systems

Rao's paper focuses on single agents, but the architecture extends naturally to
multi-agent systems. If multiple agents share a belief base (or portions of one),
beliefs become a communication medium:

- Agent A posts belief `+task_completed(X)` → Agent B has a plan triggered by
  `+task_completed(X)` → Agent B begins its next task

This is indirect communication through shared belief state — a form of blackboard
architecture where agents coordinate by posting and reading beliefs rather than
by direct message passing. It decouples agents: neither needs to know the other
exists; they coordinate through the shared epistemic state.

**Advantages**: Decoupled, asynchronous coordination; no direct message routing needed;
new agents can join by registering interest in certain belief patterns.

**Disadvantages**: Requires a shared belief base infrastructure; consistency and
concurrency control for belief updates; potential for agents to act on stale
observations.

**For WinDAGs**: The orchestrator's shared state (task completion status, resource
availability, context information) should be structured as a queryable belief base,
not as opaque variables passed between agents. This enables any agent to react to
any state change that falls within its plan library's triggering events.

---

## Summary

The belief base teaches:

1. **World state must be explicitly represented** — beliefs are the single source
   of truth; implicit assumptions in plan code create invisible failure modes

2. **Belief updates drive reactivity** — both data-directed (+belief) and
   goal-directed (+goal) events give agents full environmental responsiveness

3. **The CWA enables efficient inference but creates epistemic blindness** —
   distinguish domains where CWA is safe from those requiring explicit uncertainty
   representation

4. **Context conditions and test goals access beliefs at different times** —
   the temporal gap between plan selection and plan execution requires runtime
   re-verification of critical conditions

5. **Variable binding through belief queries enables plan generality** — plans
   extract their parameters from the current world state, making them broadly
   applicable without explicit parameterization

6. **In multi-agent systems, the shared belief base is the coordination medium** —
   structure shared state as a queryable belief base to enable reactive, decoupled
   agent coordination
```

---

### FILE: agent-vs-logic-programs-key-distinctions.md
```markdown
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
```

---

### FILE: proof-theory-and-verifiable-agent-behavior.md
```markdown
# Proof Theory and Verifiable Agent Behavior: Making Correctness Provable

## Why Proof Theory Matters for Practical Systems

The proof theory section of AgentSpeak(L) is the most technically demanding part
of the paper and the most often skipped by practitioners. This is a mistake. The
labeled transition system that Rao provides is not merely a theoretical curiosity
— it is the foundation for *verifying that your orchestration system does what you
think it does*.

The core promise of the proof theory is stated precisely:

> "These transitions have a direct relationship to the operational semantics of the
> language and hence help to establish the strong correspondence between the
> AgentSpeak(L) interpreter and its proof theory." (Section 4)

And the application:

> "Using the above proof rules we can formally prove certain behavioural properties,
> such as safety and liveness of agent systems." (Section 4)

Safety and liveness are the two fundamental properties of any system that matters:
- **Safety**: nothing bad ever happens ("the agent never drives into a car")
- **Liveness**: something good eventually happens ("the agent eventually clears all waste")

These are the properties that matter when your agent system controls real things —
not "does it usually work" but "can we prove it always works."

---

## Labeled Transition Systems: The Formal Substrate

Rao's proof theory is based on **labeled transition systems** (LTS), a standard
formalism for specifying and reasoning about reactive systems.

A BDI transition system (Definition 17) is a pair `<Γ, ⊢>` where:
- **Γ** is a set of BDI configurations
- **⊢** is a binary transition relation on Γ

A BDI configuration (Definition 18) is a tuple `<Eᵢ, Bᵢ, Iᵢ, Aᵢ, i>` representing
the agent's complete state at step i: pending events, current beliefs, active
intentions, dispatched actions, and a step label.

The transition relation ⊢ defines which configurations can succeed which other
configurations. Each proof rule specifies one type of valid transition. The full
set of proof rules defines all possible evolution paths of the agent system.

**IntendEnd** (adopting a top-level intention):
```
<{..., <+!g(t); T>, ...}, Bᵢ, Iᵢ, Aᵢ, i>
    ⊢
<{...}, Bᵢ, Iᵢ ∪ {[p₁θ]}, Aᵢ, i+1>
```
where p is the applicable plan with applicable unifier θ, and g(t)θ = g(s)θ with
context satisfied by Bᵢ.

This is not a description of behavior — it is a *constraint on behavior*. No
transition can occur from a configuration unless it matches one of the proof rules.
The proof rules are necessary and sufficient conditions for valid transitions.

---

## BDI Derivations: Formal Execution Traces

A **BDI derivation** (Definition 19) is a finite or infinite sequence of BDI
configurations, each related to the next by the transition relation:

```
γ₀, ..., γᵢ, ...
```

where each consecutive pair satisfies the transition rules.

This formal notion of derivation corresponds exactly to an execution trace of the
AgentSpeak(L) interpreter. Every execution of the interpreter is a BDI derivation.
Every valid BDI derivation corresponds to a possible execution of the interpreter.

The one-to-one correspondence means: **if you can prove something about all BDI
derivations, you have proved it about all executions of the interpreter**. This is
the link between formal verification and implementation correctness.

For practical systems, derivations allow you to:

1. **Trace execution**: Record the sequence of configurations during execution —
   this is a structured execution log, not just a flat event log

2. **Verify properties**: Check whether all derivations satisfy a given property
   (safety, liveness, fairness)

3. **Identify failure modes**: Find derivations that lead to bad configurations
   (deadlock, safety violations, goal non-achievement)

4. **Prove completeness**: Show that for every situation, a derivation exists that
   achieves the top-level goal

---

## Safety and Liveness in Agent Systems

The two fundamental correctness properties for agent orchestration systems:

**Safety properties**: "Nothing bad ever happens." In formal terms: in all reachable
configurations, certain conditions hold (or certain transitions never occur).

Examples for an orchestration system:
- "The system never invokes Skill X while Skill Y is also running" (mutual exclusion)
- "The system never provides the user with output that contradicts a verified fact"
  (epistemic safety)
- "The system never takes an irreversible action without user confirmation" (action
  safety)
- "No intention is executed with unresolved variable bindings" (type safety)

Safety properties can be verified by **reachability analysis**: show that no
sequence of valid transitions (derivation) leads to a configuration violating the
property.

**Liveness properties**: "Something good eventually happens." In formal terms:
every derivation (or every sufficiently long derivation) eventually reaches a
configuration where a desired condition holds.

Examples for an orchestration system:
- "Every user request is eventually answered" (response liveness)
- "Every adopted intention eventually either completes or generates a failure event"
  (intention progress)
- "Every skill invocation eventually returns a result" (tool liveness)
- "The event queue E is never permanently non-empty" (event processing liveness)

Liveness properties require **fairness assumptions**: the selection functions
(SE, SO, SI) must eventually select every pending event, every applicable plan
that keeps being relevant, and every runnable intention. Without fairness, the
agent could ignore events indefinitely — a starvation failure mode.

---

## The Four Proof Rules: What They Tell Us

Rao provides four proof rules (showing only ExecAch explicitly):

**IntendEnd**: How external events create new intentions. Tells us: every external
event with an applicable plan results in a new intention being added to I. Safety
property implied: intentions are only created from applicable plans (context verified).

**IntendMeans**: How internal sub-goals deepen existing intentions. Tells us: every
sub-goal pushes exactly one plan frame onto the generating intention's stack. Safety
property implied: the intention stack grows only through valid plan selection.

**ExecAch** (and analogues for test goals, actions, plan completion): How intention
execution proceeds step by step. Safety property implied: each execution step is
well-typed (achievement goals generate events, test goals query beliefs, actions
are dispatched, completed frames are popped).

The proof rules together define the **invariant** of the agent: the set of properties
that hold in every reachable configuration. In the robot example:
- Every action in A resulted from a plan execution
- Every plan in I was selected by SO as applicable
- Every belief in B is either an initial belief or was added by an external update
- Variable bindings in intentions are ground for primitive actions

These invariants can be verified by inspecting the proof rules — you don't need
to test the system; you can prove the invariants hold.

---

## Practical Verification for WinDAGs

Full formal verification of a 180-skill orchestration system is computationally
expensive. But the principles apply at multiple levels of rigor:

**Level 1: Informal verification (design review)**

For each skill invocation pattern, ask:
- What triggering events invoke this skill?
- What context conditions must hold?
- What are the possible outcomes (success, failure, side effects)?
- What intentions are unblocked or completed by this skill's output?

This is informal but systematic — it forces explicit reasoning about the skill's
role in the overall coordination system.

**Level 2: Property-based testing (semi-formal)**

Identify key invariants that should hold throughout execution:
- No two conflicting skills are simultaneously in A
- Every pending sub-goal has an applicable plan (or an explicit failure handler)
- Every intention in I has a well-formed stack (no empty frames, no unground actions)

Write property checkers that verify these invariants at each step of the interpreter
cycle. Run extensive tests with varied inputs. This catches many failure modes without
full formal verification.

**Level 3: Model checking (formal, bounded)**

Formalize the orchestration system's core coordination mechanism (a small, clean
abstraction of the actual system) as a labeled transition system. Use a model checker
(TLA+, SPIN, NuSMV) to verify safety and liveness properties over bounded traces.
This is expensive but provides strong guarantees for the specified properties over
the bounded model.

**Level 4: Theorem proving (formal, unbounded)**

Use an interactive theorem prover (Coq, Isabelle) to verify properties about the
full operational semantics. This is very expensive but provides the strongest
guarantees. Appropriate only for safety-critical deployments.

---

## The Refutation Concept: When Does an Intention Succeed?

Rao defines refutation specifically for intentions: "The notion of refutation in
AgentSpeak(L) is with respect to a particular intention. In other words, the
refutation for an intention starts when an intention is adopted and ends when the
intention stack is empty." (Section 4)

This is a precise definition of **task completion**: an intention is complete when
its stack is empty. Not when a certain belief is established, not when an action
is dispatched, but when the full stack of committed plan frames has been executed
to completion.

This gives us a formal basis for tracking task completion in orchestration:
- Task created → intention adopted → stack = [p₁]
- Sub-tasks executed → stack grows/shrinks as sub-goals push/pop
- Task complete → stack = [] → intention removed from I

Every user request, every orchestrated workflow, every compound skill invocation
should have a corresponding intention whose lifecycle (creation, execution,
completion/failure) is tracked through the formal refutation concept.

**For WinDAGs**: Every active task should have:
- An intention ID (unique identifier for the intention)
- An intention stack (the current decomposition state)
- A lifecycle status (active, suspended, completing, complete, failed)
- A completion condition (when is the stack empty? What constitutes success?)

These are not implementation details — they are the formal requirements implied by
the proof theory's notion of refutation.

---

## Boundary Conditions: When Formal Verification Is Insufficient

**Undecidability**: For sufficiently expressive agent languages (full first-order
logic, unrestricted plan bodies), verification is undecidable. AgentSpeak(L)'s
restriction to Horn-clause context conditions and sequential plan bodies is
specifically motivated by keeping verification tractable.

**Open systems**: The proof theory assumes a fixed plan library P and a well-behaved
environment that sends belief updates faithfully. Real systems face dynamic plan
libraries (skills added/removed at runtime) and adversarial environments (updates
arrive late, out of order, or not at all). Extending the proof theory to handle
these requires significant additional work.

**Probabilistic correctness**: The deterministic proof theory cannot express
"succeeds with probability 0.99." Probabilistic agent logics exist but are far more
complex and less computationally tractable.

**Emergence**: In multi-agent systems, global properties emerge from local agent
interactions in ways that are not predictable from individual agent specifications.
The proof theory for individual agents does not automatically extend to multi-agent
systems without significant compositional reasoning.

---

## Summary

The proof theory of AgentSpeak(L) teaches:

1. **Agent behavior can be formalized as labeled transition systems** — configurations
   and transition rules together define all possible executions

2. **Every execution is a derivation; every derivation is an execution** — the
   one-to-one correspondence is the guarantee of implementation correctness

3. **Safety and liveness are the fundamental correctness properties** — both can be
   formally specified and verified against the labeled transition system

4. **Refutation = task completion** — an intention is complete when its stack is empty;
   this is the formal basis for tracking workflow completion

5. **Formal verification is a spectrum** — from informal reasoning (cheap, incomplete)
   through property testing and model checking to theorem proving (expensive, complete)

6. **The proof theory motivates the language restrictions** — limited negation,
   sequential bodies, Horn-clause contexts are not arbitrary — they are necessary
   for computational tractability of verification

For any orchestration system handling tasks where failure has significant consequences,
the investment in formal (or semi-formal) verification of the core coordination
mechanism is justified by the guarantee it provides.
```

---

### FILE: multi-agent-coordination-without-central-control.md
```markdown
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
```

This is intention delegation through belief coordination. Agent A's intention stack
is suspended at the test goal `?completed(task_X)` until B posts the completion
belief. The test goal acts as a synchronization point.

**This pattern is the direct multi-agent analogue of the single-agent sub-goal
mechanism**: instead of pushing onto the same intention stack, the delegation creates
an independent intention in a different agent, with synchronization through the
shared belief base.

---

## Failure Propagation in Multi-Agent Systems

Failure in one agent's intention may require notification to other agents that
are waiting on its output. The belief-based coordination mechanism handles this
naturally:

- Agent B fails to complete task_X → posts `+failed(task_X, reason)` instead of
  `+completed(task_X)`
- Agent A's test goal `?completed(task_X)` never succeeds → Agent A needs a failure
  handler
- Alternatively, Agent A has a plan triggered by `+failed(task_X, _)` that implements
  the recovery strategy

The failure propagation mechanism mirrors the success mechanism: both are belief
postings that trigger other agents' plans. This uniformity is a key architectural
virtue — success and failure are handled by the same mechanism, just with different
belief predicates.

**For WinDAGs**: Skill failures should post structured failure beliefs (not just
log errors) that other waiting agents/intentions can query and react to. The
orchestration layer should have explicit plans (error-handling skills) triggered
by failure beliefs, not just exception handlers buried in skill code.

---

## Communication vs. Shared Beliefs: A Design Choice

Multi-agent BDI systems can coordinate through two mechanisms:

**Direct message passing** (AGENT0/PLACA approach): Agents send typed messages
to specific recipients. Agent A sends `tell(Agent_B, goal(task_X))`. Agent B
receives this as an external event and adopts the goal.

**Shared belief coordination** (blackboard approach): Agents share a belief base.
Agent A posts `+goal(task_X)`. Agent B, monitoring the shared base, has a plan
triggered by `+goal(task_X)`.

Message passing is more explicit but tightly coupled — sender must know recipient.
Shared belief coordination is looser but requires careful consistency management.

Rao's single-agent model uses a local belief base with event generation — the
multi-agent extension to shared beliefs is architecturally natural. The key extension
needed is a **shared belief synchron