# Hierarchical Decomposition as a Coordination Mechanism for Distributed Intelligence

## Core Principle: Structure Enables Reuse and Reveals Consistency

The GOMS framework reveals a profound insight about how intelligent systems should decompose complex problems: hierarchical structure isn't just organizational convenience—it's the mechanism that enables knowledge reuse, exposes design inconsistencies, and determines learnability. As Kieras states, "Methods often call sub-methods to accomplish goals that are subgoals. This method hierarchy takes the following form..." (p. 17). But the deeper principle is that this hierarchy mirrors how users actually acquire and deploy procedural knowledge.

## Why Hierarchies Matter for Coordination

In a multi-agent system like WinDAGs, agents don't communicate through a shared understanding of the entire problem space. Instead, they coordinate through **goal decomposition**—one agent accomplishes a goal by invoking subgoals that other agents (or itself at a different level) fulfill. GOMS shows that this only works when decomposition follows certain principles:

**Subgoal Independence**: Each subgoal must be accomplishable without detailed knowledge of its parent goal's context. Kieras notes, "A method may call for sub-Goals to be accomplished, so the Methods have a hierarchical structure" (p. 2). The critical design question: what information does a subgoal need? GOMS represents this through pseudoparameters and the task description, showing exactly what context must be passed down.

For agent systems: when Agent A invokes a skill that Agent B executes, the interface between them—what parameters are passed, what state is assumed—determines whether the system works. GOMS makes these dependencies explicit through its pseudoparameter mechanism and working memory tags.

**Breadth-First Analysis Reveals Reuse Opportunities**: The construction methodology explicitly requires: "It is important to perform the analysis breadth-first, rather than depth-first. By considering all of the methods that are at the same level of the hierarchy before getting more specific, similar methods are more likely to be noticed" (p. 20).

This principle directly transfers to agent system design. If you design skills depth-first (fully implementing "process-payment" before considering "refund-payment"), you'll miss that both need a "validate-account" subskill. The breadth-first discipline forces you to identify shared submethods—the reusable components that make the system learnable (or maintainable).

## Detecting Inconsistency Through Method Comparison

Kieras observes: "When the same submethods serve multiple high-level goals (like 'Select Text' serving both Cut and Copy), consistency reduces learning time. The hierarchy isn't just descriptive—it's the actual structure of learnable procedural knowledge" (p. 28, implicit throughout methods).

The analog for agent orchestration: **inconsistent decomposition creates coordination overhead**. If "analyze-codebase" decomposes differently when invoked by "security-audit" versus "performance-review," agents must maintain multiple procedural pathways for conceptually similar operations. Each inconsistency is a place where the system could fail due to unexpected interaction patterns.

GOMS makes inconsistency **syntactically visible**. When you write out methods at the same hierarchical level, structural differences jump out:

```
Method_for_goal: Cut Selection
Step 1. Accomplish_goal: Select Text.
Step 2. Accomplish_goal: Issue Command using Cut.
Step 3. Return_with_goal_accomplished.

Method_for_goal: Copy Selection
Step 1. Accomplish_goal: Select Text.
Step 2. Accomplish_goal: Issue Command using Copy.
Step 3. Return_with_goal_accomplished.
```

The identical structure reveals design consistency. If Copy_Selection had required three additional steps for verification, that asymmetry would signal a design problem. For agent systems: when two skills accomplish related goals, their method structures should be comparable. Radical differences suggest either (a) the goals aren't actually related, or (b) one path has hidden complexity that will surprise users/orchestrators.

## The Selection Rule Boundary: Where Hierarchy Meets Dispatch

GOMS distinguishes sharply between **decision within a method** (Decide operators) and **dispatch between methods** (Selection Rules). As Kieras explains: "A common and natural confusion is when a selection rule set should be used and when a Decide operator should be used. A selection rule set is used exclusively to route control to the suitable method for a goal... while a Decide operator controls flow of control within a method" (p. 18).

For agent orchestration, this maps to: **routing vs. execution logic**. 

- **Selection rules** = the orchestrator's dispatch logic: "Given this goal and context, which skill should execute?"
- **Decide operators** = internal skill logic: "Within my execution, what sequence of operations should I perform?"

The disciplined separation prevents conceptual mud. Selection rules evaluate context in parallel (all conditions checked against current state) and choose one method. Decide operators execute sequentially within a chosen method. Mixing these creates opacity—you can't tell if branching is "which subgoal to pursue" or "what step comes next in this goal."

```
Selection_rules_for_goal: Perform Unit_task
If Type of <current_task> is move, 
   Then Accomplish_goal: Move Text.
If Type of <current_task> is delete, 
   Then Accomplish_goal: Erase Text.
If Type of <current_task> is copy, 
   Then Accomplish_goal: Copy Text.
Return_with_goal_accomplished.
```

For agent systems: when a skill can operate in multiple modes, should those be separate skills with a selection rule, or one skill with internal branching? GOMS says: if the execution procedures differ substantially (different subgoals, different subskill invocations), make them separate methods with selection rules. If only the parameters differ, use one method with Decide operators.

## Working Memory Tags as Coordination Tokens

GOMS represents working memory through tags: `<filename>`, `<target>`, `<current_task>`. These aren't variables in the programming sense—they're **coordination tokens** that let methods share information without global state. Kieras notes: "these tags are used in a way that is somewhat analogous to variables in a conventional programming language" but critically, "these 'variables' are effectively global in scope" (p. 17).

The design tension: agents need shared context (what file are we operating on?) without tight coupling (Agent A shouldn't depend on Agent B's internal state). GOMS handles this through:

1. **Explicit storage/retrieval**: `Store "foo.txt" under <filename>` makes state changes visible
2. **Deliberate forgetting**: `Delete <filename>` documents when information is no longer needed
3. **Focus management**: Only one object can be "in focus" at a time, forcing explicit context switches

For DAG-based orchestration: this maps to **context passing between skills**. Each node in the DAG has explicit inputs (tags loaded at start) and outputs (tags stored before return). The discipline of making these explicit prevents action-at-a-distance bugs where Skill X mysteriously depends on state created three skills ago.

The pseudoparameter mechanism extends this: when calling a subgoal, explicitly bind working memory tags to the submethod's expected parameters. This is the GOMS equivalent of a function call with arguments, and it makes the interface contract explicit.

## The 50ms Quantum: Why Step Granularity Matters

GOMS assumes "each step in a GOMS model takes a certain time to execute, estimated at 50 ms" (p. 12). This isn't just about prediction accuracy—it's a **unit of atomic cognitive action**. As Kieras explains, "Most of the built-in mental operators are all executed during this fixed step execution time, and so are termed intrastep operators. However, substantially longer execution times are required for external operators... Thus, these are interstep operators" (p. 12).

The principle: complex operations decompose into a standard cognitive cycle time. For agent systems, this translates to: **what's the atomic unit of orchestration action?** 

If skills are too fine-grained (each does one 50ms cognitive operation), orchestration overhead dominates. If too coarse-grained (each does minutes of work), you lose composability and can't recover from mid-execution failures. GOMS suggests the right grain size: **one step = one logically atomic decision or action** that could meaningfully fail or need to be retried independently.

The interstep vs. intrastep distinction matters for failure handling. Interstep operations (mouse movements, memory retrievals, visual searches) take variable time and can fail. Intrastep operations (storing values, making decisions) are assumed reliable. For agents: I/O operations, external API calls, and cross-agent communication are interstep—they need error handling, timeouts, retry logic. Internal state manipulations are intrastep—they should be fast and reliable, or something is architecturally wrong.

## Practical Implications for Agent Decomposition

**How to decompose a complex agent task:**

1. **Start with the unit-task structure** (p. 20): Assume the top-level goal is accomplished by a series of subtasks, each independent. This prevents monolithic agents that must understand the entire problem.

2. **Identify subgoals breadth-first** (p. 19-20): Before fully implementing any one skill, identify all skills at the same level of abstraction. This reveals natural reuse opportunities (multiple top-level tasks share the same subtask).

3. **Make selection rules explicit** (p. 17-18): When multiple skills could accomplish a goal, write out the conditions that choose between them. This is your routing logic. It should be based on task properties and context, not on guessing what will work.

4. **Represent working memory explicitly** (p. 11-12): Don't pass information between skills through side effects. Make context explicit through named values that are stored, retrieved, and deliberately deleted.

5. **Stop decomposing when you hit primitives** (p. 19): For agents, "primitives" are the built-in capabilities of your system—API calls, database queries, LLM invocations. Don't decompose below what the infrastructure can directly execute.

## What This Means for DAG Construction

A DAG in WinDAGs is essentially a method hierarchy made explicit as a graph. Each node is a goal; each edge is a subgoal relationship. GOMS teaches:

- **Nodes at the same depth should be comparable in complexity**: If one node takes 100x longer than its siblings, the decomposition is unbalanced.
- **Shared subDAGs indicate consistency**: When multiple top-level tasks invoke the same sub-pattern, you've found a reusable component.
- **Selection rule nodes are dispatch points**: A node that examines context and chooses which subDAG to invoke is a selection rule set. It should evaluate conditions in parallel, not sequential if-else chains.
- **The "return with goal accomplished" pattern**: Every DAG path must have a clear termination condition that signals success back up the hierarchy.

## Boundary Conditions and Limitations

GOMS hierarchical decomposition works best when:

- **Tasks are predominantly sequential**: Each subgoal completes before the next begins. GOMS extensions handle interrupts (p. 23-24), but the base model assumes sequential composition.
- **Goals are clearly decomposable**: Some tasks resist hierarchical breakdown (open-ended creative work, opportunistic problem-solving). GOMS is for procedural knowledge, not insight or discovery.
- **Context requirements are identifiable**: You can specify what information each subgoal needs. If context is implicit, holistic, or gestalt-like, GOMS can't represent it.

**When not to use this approach**: If your agent task is fundamentally exploratory (searching an unknown solution space), purely reactive (responding to unpredictable events with no sequential structure), or requires maintaining complex global invariants that can't be localized to subgoals. GOMS excels at *procedural* tasks—tasks where there's a knowable how-to-do-it method.

## Connection to Agent System Design

For WinDAGs specifically:

- **Skill definition = method definition**: Each skill should be documentable as a GOMS method—clear goal, defined steps, explicit subgoal calls, identifiable completion.
- **Skill composition = method hierarchy**: When Skill A invokes Skill B, document the pseudoparameters (what context is passed) and the working memory contract (what state must exist).
- **Routing logic = selection rules**: When the orchestrator chooses between skills, make the dispatch conditions explicit and parallel-testable, not sequential and ad-hoc.
- **Failure recovery = error-handling methods**: Design recovery procedures with the same discipline as normal operation procedures (p. 22-23). Each error type should have a standard recovery method.

The deepest insight: **hierarchy isn't about control, it's about knowledge structure**. A well-decomposed task is one where each level of the hierarchy represents a coherent unit of knowledge that can be learned, verified, and reused independently. For agents, this means: a well-decomposed system is one where each skill is understandable and testable in isolation, yet composes reliably into complex behaviors.