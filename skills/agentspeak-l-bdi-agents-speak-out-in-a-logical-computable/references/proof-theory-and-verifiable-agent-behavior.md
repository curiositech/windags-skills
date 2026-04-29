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