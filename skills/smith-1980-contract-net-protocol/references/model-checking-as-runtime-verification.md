# Model Checking as Runtime Verification: Evaluating System Properties During Operation

## What Model Checking Offers That Testing Does Not

Traditional software testing asks: "Did the system produce the right output for this input?" It is retrospective, sample-based, and bound by the creativity of test case designers. Model checking asks something more powerful: "Does this property hold in *every* state the system can be in?" It is exhaustive (within the model), property-based, and capable of finding failures in edge cases that no human tester would think to test.

The Big Brother Logic paper implements model checking in a real physical system. Given the current physical configuration of cameras (actual orientations) and the actual position of the red ball and hats, the system evaluates whether a given epistemic formula is true. This is not just verification of a static design — it is *runtime verification* of a live, dynamic system.

This is the key insight: **model checking is not only a design-time tool. It can be a runtime oracle, continuously evaluating whether a system's epistemic state meets its specification.**

## The Algorithm: Computing Vision Sets and Traversing the Kripke Model On-the-Fly

The paper describes the model checking procedure:

> "The positions of the cameras are fixed and we first compute the so-called vision sets, that is, for a given camera a, the set of all possible sets of cameras that a can see. The model checking is implemented as follows: from the vision sets and the set of cameras that see the red ball, we browse the inferred Kripke model on the fly and we evaluate the formula."

The key phrase is "on the fly" — the Kripke model is not pre-computed and stored in full (which would be intractable for large systems). Instead, it is generated lazily, only computing the parts of the model needed to evaluate the formula. This is a standard optimization in model checking known as *on-the-fly* or *explicit-state* model checking.

The computation proceeds in stages:
1. **Physical sensing**: Webcams capture images; image processing infers ball position and hat presence
2. **Geometric computation**: Given camera positions and angles, compute for each camera what it can see (vision sets)
3. **Model construction**: From vision sets, construct the Kripke model — which worlds (angle assignments) are consistent with each camera's observations
4. **Formula evaluation**: Traverse the Kripke model, evaluating the epistemic formula according to its semantics

The output is binary: Yes (the formula is satisfied) or No (it is not). This binary verdict is actionable — it tells the system whether to proceed, wait, reconfigure, or raise an alert.

## Runtime Verification vs. Design-Time Verification

Traditional model checking is applied to system *models* at design time — before the system is built or deployed. You verify that the design satisfies the spec. The paper's approach extends this to runtime:

**Design-time model checking:**
- Input: formal model of the system's possible behaviors
- Property: temporal/epistemic formula
- Output: Does the model satisfy the property? (plus counterexample if not)
- When: Before deployment

**Runtime model checking (paper's approach):**
- Input: current sensory state of the actual system
- Property: epistemic formula
- Output: Does the current state satisfy the property? Yes/No
- When: During operation, repeatedly as the system evolves

Runtime verification catches failures that design-time verification cannot: violations that arise from unexpected environmental conditions, sensor noise, actuator failures, or emergent behaviors that weren't anticipated in the design model.

## The Formula as an Operational Invariant

In the Big Brother Logic system, the epistemic formula being checked is an *invariant* — a condition that should hold throughout operation. Before taking any action (moving the cameras, announcing a property), the system can check whether the invariant holds. If not, the system knows something is wrong and can take corrective action (reconfiguration, announcement, alert).

This is the pattern of **assertion-based programming**, extended to epistemic properties. Just as a software function asserts pre- and post-conditions to catch logical errors, an agent system can assert epistemic pre- and post-conditions to catch coordination failures.

For WinDAGs:
- **Pre-condition checks**: Before agent A hands a result to agent B, verify that agent B knows the result is coming, knows the format, and knows the context needed to process it.
- **Post-condition checks**: After a coordinated action completes, verify that all involved agents are in the correct epistemic state (they know the action completed, they know its outcome, they know the next step).
- **Invariant checks**: Throughout a long-running workflow, periodically verify that all agents have consistent world models — that no agent has a stale or incorrect belief about shared state.

## Model Checking as a Guard Before Action

The most powerful use of runtime model checking in multi-agent systems is as a **guard before action**. Before taking an irreversible or high-stakes action, check that the epistemic preconditions for that action are met.

Example: Before an agent commits a database transaction, check that all agents that contributed to the transaction's data have completed their contributions and know the data is final. This check, implemented as a model check over the current epistemic state, prevents commits based on incomplete or inconsistent data.

Example: Before an orchestrator routes a task to a specialized agent, check that the routing is appropriate given the current task state — that the task has all the inputs the specialized agent needs, that the specialized agent knows what task it is receiving, and that no other agent is simultaneously working on incompatible sub-tasks.

These checks are more powerful than simple status flags ("is task X complete?") because they verify the full epistemic state, including higher-order conditions ("does agent B know that agent A knows that B needs to process X before A can proceed?").

## The Computational Cost: When Runtime Model Checking Is Feasible

Model checking has well-known computational costs. In general:
- Model checking for propositional modal logic: PSPACE-complete
- Model checking with common knowledge operators: can be even harder
- For finite, small models: often tractable in practice

The Big Brother Logic system addresses this by:
1. Working with a small number of agents (a few cameras)
2. Computing on-the-fly (lazy model construction)
3. Restricting to discrete, finite angle assignments

For WinDAGs with 180+ skills and potentially many simultaneous agents, full epistemic model checking at runtime would be computationally expensive. Practical approximations:
- **Lightweight epistemic checks**: Replace full model checking with structured assertions that check specific, pre-identified properties rather than arbitrary formulas
- **Bounded depth checks**: Only verify K(φ) and K(K(φ)), not deeper nesting
- **Probabilistic verification**: Use sampling-based methods to check with high confidence rather than certainty
- **Incremental updates**: When the world state changes only slightly, update the epistemic model incrementally rather than recomputing from scratch

The key is to identify *which* epistemic properties are important enough to warrant runtime verification, and to build efficient checkers for those specific properties rather than a general-purpose model checker.

## The Human-in-the-Loop: Interactive Model Checking

The paper's demonstration is explicitly interactive — the user can enter epistemic properties to check, and the system evaluates them against the current state. This is *interactive model checking*, where the human provides the query and the system provides the answer.

This is a powerful design pattern for agent systems: **build an epistemic query interface** that lets operators, developers, or even other agents ask questions about the system's current epistemic state. "Does agent A know the deadline?" "Do all agents commonly know the current task priority?" "Is there any agent that believes the database is inconsistent?"

An epistemic query interface transforms abstract coordination concerns into concrete, checkable properties — enabling rapid diagnosis of coordination failures and targeted remediation.

## Conclusion: Embed Epistemic Verification into the Agent Loop

The Big Brother Logic paper demonstrates that epistemic model checking is not just a theoretical tool — it is a practical, implementable runtime verification mechanism. For agent systems, the lesson is: build epistemic verification into the operation loop, not just the design loop. Check epistemic preconditions before critical actions. Verify epistemic post-conditions after coordination events. Query the epistemic state when coordination fails. Use model checking not just to prove that the design is correct, but to confirm that the running system is behaving correctly — right now, in the current state of the world.