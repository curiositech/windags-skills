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