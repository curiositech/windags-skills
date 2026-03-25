# Satisfiability as Autonomous Reconfiguration: From Specification to Action

## The Core Idea: Solving for Configuration, Not Just Verifying It

Most formal verification systems work in one direction: given a system configuration and a property, determine whether the property holds. This is *model checking* — a verification tool. But the Big Brother Logic paper goes further by implementing a *satisfiability solver*: given an epistemic property, automatically find a system configuration that satisfies it.

This is a fundamentally different mode of operation. Instead of asking "does my current setup meet the spec?", you ask "what setup *would* meet the spec, and put me there."

In the paper's physical demonstration, this means: given an epistemic formula specifying what knowledge relationships must hold among the cameras, the system automatically rotates the cameras to angles that satisfy the formula. The cameras reconfigure themselves to achieve a specified epistemic goal.

> "The satisfiability problem consists in turning the cameras so that a given property is satisfied."

This is autonomous planning under epistemic specification — one of the most sophisticated forms of agent autonomy.

## Why This Is Architecturally Significant

Standard agent architectures separate:
1. **Specification**: what the system should do (written by humans)
2. **Execution**: what the system actually does (run by agents)
3. **Verification**: whether the system did it correctly (checked by monitors)

The satisfiability approach collapses steps 1 and 2: the specification *is* the driver of execution. The agent doesn't need a procedural script ("first rotate to 45 degrees, then check if camera B is visible, then adjust..."). It needs only the *goal* in epistemic terms, and the satisfiability solver finds the path to that goal.

This is the difference between:
- **Imperative coordination**: "Do steps A, B, C in order"
- **Declarative coordination**: "Achieve state S; figure out A, B, C yourself"

Declarative coordination is more flexible, more robust to unexpected environments, and more maintainable — because changing the goal doesn't require rewriting the procedure. But it requires a satisfiability-solving capability, which is computationally more expensive.

## The Constraint: Restricted Language for Satisfiability

The paper notes an important limitation:

> "We here restrict the language by avoiding constructions `ab` since we cannot move the ball."

For satisfiability (reconfiguration), the formula cannot contain propositions about things the system cannot control. The cameras can rotate, so formulas about camera-to-camera visibility are valid targets. The ball cannot be moved, so formulas about ball visibility are constraints (observed facts) rather than targets.

This restriction reveals a general principle for satisfiability-based planning: **the satisfiability language must distinguish between controllable and uncontrollable propositions.** Controllable propositions can be targeted by the satisfiability solver. Uncontrollable ones are inputs — they constrain the search space but are not variables the solver can change.

For WinDAGs agent systems, this maps to:
- **Controllable**: which agents to invoke, what parameters to pass, which skills to activate, what order to sequence tasks
- **Uncontrollable**: external API responses, user inputs, environment state, time constraints

A satisfiability-based orchestration system would specify the desired epistemic/task outcome in terms of controllable propositions, and search for a configuration of agent invocations, parameters, and orderings that achieves it.

## From Satisfiability to Goal-Directed Planning

The satisfiability approach is closely related to classical AI planning, but with an epistemic twist. Classical planning asks: given an initial world state and a goal world state, find a sequence of actions that transforms one into the other. Epistemic planning asks: given an initial *knowledge* state and a goal *knowledge* state, find a sequence of actions (including communicative actions) that transforms one into the other.

The Big Brother Logic framework is an instance of epistemic planning:
- **Initial state**: cameras at arbitrary orientations; unknown knowledge relationships
- **Goal state**: a specific epistemic formula is satisfied (e.g., "camera a1 knows camera a3 sees the intruder")
- **Actions**: rotate camera (ontic action) or make public announcement (epistemic action)
- **Solution**: a sequence of camera rotations that achieves the goal epistemic state

For agent systems, this suggests a powerful design pattern: rather than scripting agent workflows procedurally, express the coordination goal as an epistemic formula and use a planner to find the workflow that achieves it.

## Automatic Reconfiguration in Practice: What It Requires

To implement satisfiability-based autonomous reconfiguration, a system needs:

**Requirement 1: A formal model of the configuration space.**
The solver must know what configurations are possible. For cameras, this is angle assignments. For agents, this might be: which skills to invoke, in what order, with what parameters.

**Requirement 2: A mapping from configurations to epistemic states.**
Given a configuration, what does each agent know? This mapping must be computable. In the camera system, it's computed via vision sets. In an agent system, it might be computed by simulating the information flow through the planned workflow.

**Requirement 3: A search procedure over the configuration space.**
The satisfiability solver must efficiently search for configurations that satisfy the goal formula. For small, discrete spaces, exhaustive search is feasible. For large or continuous spaces, heuristic or constraint-based search is needed.

**Requirement 4: A restricted, controllable goal language.**
The formula must only mention controllable propositions. Uncontrollable environmental facts must be treated as constraints rather than variables.

## The Bidirectional Architecture: Verify and Reconfigure

The paper presents two distinct system architectures — one for model checking and one for satisfiability solving:

**Model checking architecture:**
Webcams → image processing → ball/hat positions → Kripke model → formula evaluation → Yes/No

**Satisfiability solving architecture:**
Epistemic formula → satisfiability solver → optimal angle assignments → motor commands → camera reconfiguration

Note that the satisfiability architecture *doesn't* use webcams as input. It computes from the formula alone — the cameras' visual feedback is not needed because the solver works from the formal model, not from direct observation. The cameras are *actuated* based on the solution, not *sensed* to drive the solution.

This bidirectional capability — verify what is, then reconfigure to what should be — is extremely powerful. For WinDAGs:
- **Verification mode**: Given the current agent configuration and task state, does the epistemic condition for proceeding hold? (Model check)
- **Reconfiguration mode**: Given that the epistemic condition doesn't hold, what changes to the agent configuration will make it hold? (Satisfiability solve)

## Limitations and Computational Concerns

Satisfiability in epistemic modal logic is computationally expensive — it is PSPACE-complete in general, and can be harder for logics with common knowledge operators. The paper does not discuss the computational complexity in detail, but refers the reader to the companion theoretical paper ([1]) for the algorithm details.

For practical agent systems, this means:
- Satisfiability-based reconfiguration is feasible for small numbers of agents and simple epistemic properties
- For larger systems, approximations (greedy search, genetic algorithms, constraint propagation) may be necessary
- The expressiveness of the goal language should be tuned to keep the satisfiability problem tractable
- Caching solutions for common goal types can dramatically reduce computation overhead

## Design Prescription: Goal-Driven Agent Configuration

For WinDAGs and similar systems, the satisfiability approach suggests the following design pattern:

**Step 1: Specify the task outcome as an epistemic/state formula.**
Don't just say "run agents A, B, C." Say "achieve a state where the synthesis agent has all necessary validated inputs, the validation agent knows the synthesis is waiting for it, and the orchestrator knows both know their role."

**Step 2: Build a lightweight planner that searches for a workflow satisfying the formula.**
This doesn't need to be full modal logic model checking. A goal-directed search over possible agent invocation orderings and parameter assignments, evaluated against a formal goal condition, captures much of the power.

**Step 3: Verify the plan before execution.**
Before running the planned workflow, model-check that it indeed satisfies the goal formula given the current environment state.

**Step 4: Re-plan on failure.**
If execution fails at a step (the epistemic condition for proceeding is not met), re-invoke the satisfiability solver with the updated initial state to find a new configuration.

This creates a system that is not just reactive (model checking) but *proactive* (satisfiability solving) — one that can reason from goals to plans, not just from plans to verification.