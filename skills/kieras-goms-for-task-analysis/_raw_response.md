## BOOK IDENTITY

**Title**: GOMS Models for Task Analysis

**Author**: David Kieras

**Core Question**: How can we formally represent procedural knowledge in a way that enables systematic prediction of learning time, execution time, and error patterns for human-computer interaction tasks?

**Irreplaceable Contribution**: This book provides the only comprehensive framework that bridges informal task analysis and executable computational models through a notation (GOMSL) that is simultaneously human-readable, theoretically grounded in cognitive architecture, and machine-executable. Unlike other HCI evaluation methods, GOMS enables quantitative predictions *before* building prototypes, while maintaining direct traceability between high-level user goals and keystroke-level actions. Its unique power lies in showing how hierarchical-sequential decomposition of tasks, when properly constrained by human cognitive architecture, creates both predictive accuracy and design insight.

## KEY IDEAS (3-5 sentences each)

1. **Generative Models vs. Specific Traces**: Effective procedural models must be generative—capable of producing correct behavior for any task instance within a class—rather than merely describing specific sequences of actions. This mirrors the difference between a user who has memorized one specific procedure versus one who understands the general method. The generative property is what makes GOMS models useful for design evaluation: they capture the actual procedural knowledge users must acquire, not just observable behavior.

2. **The Bypass Heuristic for Complex Processes**: When encountering psychological processes too complex to model practically (reading comprehension, problem-solving, aesthetic judgment), bypass them by treating results as if already available on a "yellow pad." This isn't avoiding the problem—it's explicitly documenting where task complexity lies outside the interface design space. The key insight: only model what varies with design alternatives; hold constant what doesn't.

3. **Hierarchical Decomposition Reveals Design Consistency**: Breaking tasks into goal-method hierarchies makes procedural inconsistencies visible. When similar high-level goals require radically different low-level methods, users must learn more procedures. When the same submethods serve multiple high-level goals (like "Select Text" serving both Cut and Copy), consistency reduces learning time. The hierarchy isn't just descriptive—it's the actual structure of learnable procedural knowledge.

4. **Working Memory as Tagged Values, Not Unlimited Storage**: The notation explicitly represents working memory load through tags (<filename>, <target>), making cognitive overload visible during design. Unlike programming variables, these tags model actual human memory constraints: accessing task information takes 1200ms, maintaining multiple tags creates real load, and "deliberate forgetting" (Delete operations) is necessary for managing mental state. This makes memory demands inspectable before user testing.

5. **Error Recovery as Just Another Goal**: Errors aren't failures of the model—they're predictable events that trigger error-recovery methods. Well-designed systems have simple, consistent error-recovery procedures. The model can identify error-prone steps (complex calculations, delayed feedback, ambiguous states) and predict recovery difficulty, enabling error-tolerant design through the same framework used for normal operation.

## REFERENCE DOCUMENTS

### FILE: hierarchical-decomposition-as-coordination-mechanism.md

```markdown
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
```

### FILE: generative-models-versus-behavioral-traces.md

```markdown
# Generative Models Versus Behavioral Traces: The Fundamental Distinction for Reusable Intelligence

## The Core Problem: Rote Memorization vs. Generalizable Knowledge

Kieras identifies what may be the most critical mistake in task analysis: confusing a description of specific behavior with a model of general capability. He states forcefully: "If the analyst falls into the trap of writing methods for specific task instances, the resulting methods will probably be 'flat,' containing little in the way of method and submethod hierarchies, and also may contain only the specific Keystroke-Level operations appearing in the trace... But the fatal problem is that a tiny change in the task instance, such as a different file name, means that the method will not work. This corresponds to a user who has memorized by rote how to do an exact task, but who can't execute variations of the task" (p. 7).

This isn't merely a modeling convenience—it reveals the difference between **brittle memorization** and **transferable understanding**. The distinction applies directly to how we should think about agent capabilities and skill design.

## What Makes a Model Generative

A generative model has a specific formal property: "a set of general methods will have the property that the information in a specific task instance acts like 'parameters' for a general program, and the general methods will thus generate the specific actions required to carry out that task instance. Any task instance of the general type will be successfully executed by the general method" (p. 7).

This is not about flexibility or adaptability in the vague sense. It's precise: **a generative model has variables where a trace has constants**. 

Consider these two representations of deleting a file:

**Trace-based (non-generative):**
```
Method_for_goal: Delete FOOBAR
Step 1. Type "DELETE".
Step 2. Type "FOOBAR".
Step 3. Keystroke ENTER.
Step 4. Return_with_goal_accomplished.
```

**Generative:**
```
Method_for_goal: Delete File
Step 1. Type "DELETE".
Step 2. Type_in Name of <current_file>.
Step 3. Keystroke ENTER.
Step 4. Return_with_goal_accomplished.
```

The generative version has `Name of <current_file>` where the trace has `"FOOBAR"`. This parameterization is what makes it work for any file. As Kieras says, "This corresponds to a user who knows how to use the system in the general way normally intended" (p. 7).

## Why This Matters for Agent Systems

When we define a skill in an agent system, we face the same choice: define a brittle special-case handler, or define a general capability that works across instances?

**Brittle approach** (trace-based):
- Skill: "Fix the null pointer bug on line 47 of UserService.java by adding a null check"
- Works exactly once
- Next similar bug requires a new skill
- Knowledge doesn't accumulate

**Generative approach**:
- Skill: "Fix null pointer exception by analyzing the error location, identifying the variable causing the exception, and adding appropriate null-checking logic"
- Works across files, variable names, and code structures
- Knowledge is reusable
- Learning one instance teaches the general pattern

The generative property is what makes skills **composable**. If "analyze-code" only works on one specific file structure, and "suggest-fix" only works for one error type, you need n×m skills for n file structures and m error types. Generative skills need only n+m—each handles its dimension of variation independently.

## The Task Description as the Parameter Space

GOMS achieves generativity through the task description: "A task description describes a generic task in terms of the goal to be accomplished, the situation information required to specify the goal, and the auxiliary information required to accomplish the goal" (p. 19).

The task description defines the **parameter space** for the method. When a method executes, it extracts specific values from the current task instance:

```
Task_item: T1
Name is First.
Type is copy.
Text_size is Word.
Text_selection is "foobar".
Text_insertion_point is "*".
Next is T2.
```

The method operates on these parameters:
```
Method_for_goal: Select Word
Step 1. Look_for_object_whose Content is Text_selection of <current_task>
        and_store_under <target>.
Step 2. Point_to <target>; Delete <target>.
Step 3. Double_click mouse_button.
Step 4. Verify "correct text is selected".
Step 5. Return_with_goal_accomplished.
```

Notice: the method never mentions "foobar" specifically. It refers to `Text_selection of <current_task>`—a parameter. Change the task description, and the same method generates different behavior.

**For agent systems**: The task description maps to the **input specification** for a skill. If your skill definition says "processes the User.java file," it's trace-based. If it says "processes a specified Java file containing a class definition," it's generative. The latter requires explicit parameters (which file? which class?) but works across instances.

## How to Construct Generative Representations

Kieras provides a systematic approach: "if the analyst has a collection of task scenarios or traces, he or she should study them to discover the range of things that the user has to do. They should then be set aside and a generative GOMS model written that contains a set of general methods that can correctly perform any specific task within the classes defined by the methods" (p. 8).

The process:

1. **Collect specific examples** (traces/scenarios)
2. **Identify variation dimensions**: What changes between instances? (file names, text selections, command types)
3. **Abstract to parameters**: Replace constants with references to task properties
4. **Verify across instances**: Check that the same method generates correct behavior for all examples

**Critical discipline**: "set aside" the specific traces once abstraction is complete. If you keep referring back to specific examples, you'll inadvertently code their specifics into the method. Test against different instances to verify generativity.

## The Hierarchical Structure Test

Kieras notes that trace-based methods tend to be flat: "the resulting methods will probably be 'flat,' containing little in the way of method and submethod hierarchies" (p. 7). This is diagnostic. 

**Why flatness indicates brittleness**: If each task instance is a unique sequence with no shared structure, there's no benefit to decomposition. Hierarchical structure emerges from **recognizing reusable patterns**—subgoals that appear across multiple task instances.

Example: If you analyze "copy a word," "copy a paragraph," and "copy arbitrary text," trace-based methods look completely different—one has "double-click", another has "click-drag", another has "shift-arrow keys." But generative analysis reveals they all share a `Select Text` subgoal, accomplished by different methods depending on text size.

The hierarchical structure isn't imposed—it emerges from recognizing shared patterns across instances. If your method hierarchy is flat, you probably haven't found the general patterns yet.

**For agent systems**: If you have many single-step skills that don't compose into larger patterns, you likely have trace-based definitions. Generative skills naturally form hierarchies because they decompose into reusable subgoals.

## Selection Rules as the Generativity Mechanism for Multiple Methods

When there are multiple ways to accomplish a goal, the generative approach requires **selection rules** that choose the appropriate method based on context:

```
Selection_rules_for_goal: Select Text
If Text_size of <current_task> is Word, 
   Then Accomplish_goal: Select Word.
If Text_size of <current_task> is Arbitrary,
   Then Accomplish_goal: Select Arbitrary_text.
Return_with_goal_accomplished.
```

This is still generative because the dispatch is based on **task properties** (what are we selecting?), not hardcoded for specific instances. The task property `Text_size` parameterizes the method selection.

**For agent orchestration**: When routing between skills, the routing logic should be generative—based on task characteristics (data type, complexity, context) rather than specific instances ("if the file is User.java, use SkillA; if Review.java, use SkillB"). The latter scales poorly and obscures the actual decision logic.

## The "Yellow Pad" Heuristic for Handling External Information

A subtle form of non-generativity is embedding assumptions about how information is obtained: "suppose the user has already done the complex processing and has written the results down on a yellow note pad and simply refers to them along with the rest of the information about the task instance" (p. 6).

Instead of modeling how the user figures out tab locations, assumes they're already known and included in the task description. This bypasses a complex subprocess while maintaining generativity—the method still works for any set of tab locations, it just doesn't model how they were determined.

**For agent systems**: When a skill needs information from a complex process you don't want to model (user intent, business logic decisions, external system state), treat it as **provided context** rather than trying to model its derivation. The skill remains generative with respect to its actual parameters while bypassing the un-modeled complexity.

Example: A "format-report" skill shouldn't model how business rules determine which sections to include. Instead, accept "sections_to_include" as a parameter. The skill is generative (works for any section list) while avoiding modeling business logic.

## Testing for Generativity

Kieras provides a concrete test: "The methods can be checked to ensure that they will generate the correct trace for each task scenario, but they should also work for any scenario of the same type" (p. 8).

Practical test procedure:
1. Given method M and task instance T1, execute M(T1) and verify it produces correct behavior
2. Create T2, T3, T4—variations on T1 (different parameters, different instances)
3. Execute M(T2), M(T3), M(T4) without modifying M
4. If M works for all variations, it's generative. If it needs modification for each instance, it's trace-based.

**For agent validation**: After defining a skill, test it on multiple instances within its intended scope:
- If it's "debug-null-pointer," test on different files, different variable names, different null-check patterns
- If it fails on variations without code changes, the skill definition is too narrow
- If it requires parameter changes but no logic changes, it's generative

## When Trace-Based Representations Are Appropriate

The book implicitly identifies situations where trace-based analysis is acceptable:

1. **Validation/verification**: Traces verify that a generative model works correctly: "choose some representative task instances, and check on the accuracy of the model... to verify that the methods generate the correct sequence of overt actions" (p. 22)

2. **Communication with non-technical stakeholders**: Concrete examples (traces) are easier to understand than parameterized methods

3. **When task instances truly don't generalize**: Some tasks are genuinely one-off with no repeating structure

But critically, even in these cases, the analyst should **attempt generative analysis first** and only conclude non-generalizability after trying to find patterns.

## Implications for Skill Libraries and Agent Development

**Skill definition principle**: Every skill should be defined generatively—with explicit parameters for variation dimensions, and logic that works across instances within its scope. A skill that only works for one specific case isn't a skill, it's a script.

**Skill composition**: Generative skills compose naturally because they have well-defined parameter spaces. If Skill A produces outputs that match the input parameters of Skill B, composition works. Trace-based skills don't compose—they're too specific.

**Learning and improvement**: When a generative skill fails, analyze whether:
- The task instance is outside its intended scope (parameters outside range) → extend parameter space
- The method logic is wrong for some valid instances → fix method
- The task is genuinely different → define new generative skill with selection rules

**Maintenance burden**: Trace-based systems grow linearly with task instances (n tasks → n scripts). Generative systems grow with task types (n task types × m variation dimensions → n+m components). The scaling difference is dramatic.

## Connection to Cognitive Architecture

The generative property isn't arbitrary—it reflects how human cognition actually works. Humans don't store separate procedures for "delete file named foobar" and "delete file named document"; we store one procedure "delete file" with a variable filename. 

GOMS captures this through the production rule architecture: "GOMSL is based on a comprehensive cognitive architecture, namely a simplified version of the EPIC architecture for simulating human cognition and performance" (p. 3). Production rules naturally represent generative knowledge—conditions match against variable patterns, actions operate on variable bindings.

**For agent architectures**: If your agent system represents skills as rigid scripts rather than parameterized procedures, you're building a system that doesn't match how intelligent systems (human or artificial) actually represent procedural knowledge. The result will be brittle, unlearnable, and unmaintainable.

## Practical Exercise: Converting Trace to Generative Model

Given this trace:
```
1. User opens file "UserService.java"
2. User searches for "NullPointerException" 
3. User scrolls to line 147
4. User adds "if (user != null)" before line 147
5. User indents lines 147-152
6. User saves file
```

Generative version:
```
Method_for_goal: Fix Null Pointer Exception
Step 1. Look_for_file_whose Name is Source_file of <current_task>
        and_store_under <file>.
Step 2. Search_for Text is Exception_type of <current_task>.
Step 3. Navigate_to Location is Error_line of <current_task>.
Step 4. Insert_code Content is Null_check of <current_task>.
Step 5. Adjust_indentation Start is Error_line, 
        End is Error_line + Block_size of <current_task>.
Step 6. Save <file>.
Step 7. Return_with_goal_accomplished.
```

The transformation: every constant becomes a task property reference. The method now describes the general procedure, valid for any file, any exception type, any line number.

## Conclusion: Generativity as a Requirement for Intelligence

Kieras's insistence on generative models isn't pedantic formalism—it's the requirement that models capture actual understanding rather than superficial behavior. A system that can only execute memorized traces hasn't learned anything transferable.

For WinDAGs and similar agent systems: **generativity should be a quality gate for skill definitions**. If a skill can't be expressed with parameters and general logic that works across instances, it doesn't belong in a reusable skill library. It might be useful as a one-off solution, but it's not a building block for intelligence.

The test is simple: Can you change the task parameters and have the skill still work? If not, you've memorized a trace, not modeled a capability.
```

### FILE: bypassing-complexity-yellow-pad-heuristic.md

```markdown
# The Bypass Heuristic: Managing Complexity by Explicit Non-Modeling

## The Central Insight: Not Everything Needs to Be Analyzed

One of GOMS's most pragmatic contributions is acknowledging that complete analysis is often neither possible nor necessary. Kieras states: "Many cognitive processes are too difficult to analyze in a practical context. Examples of such processes are reading, problem-solving, figuring out the best wording for a sentence, finding a bug in a computer program, and so forth. One approach is to bypass the analysis of a complex process by simply representing it with a 'dummy' or 'placeholder' operator" (p. 6).

This isn't admitting defeat—it's recognizing the boundary between what matters for design evaluation and what doesn't. The breakthrough is making the bypass **explicit and documented**, rather than leaving it as an unexamined assumption.

## The Yellow Pad Heuristic Explained

The core technique: "suppose the user has already done the complex processing and has written the results down on a yellow note pad and simply refers to them along with the rest of the information about the task instance" (p. 6).

This mental model has several powerful properties:

1. **Separates computation from use**: The yellow pad contains results, not the process that generated them
2. **Makes assumptions visible**: If your method says "refer to yellow pad for tab settings," it's obvious you've assumed tab settings are pre-determined
3. **Allows partial analysis**: You can model interface interaction without modeling domain expertise
4. **Preserves testability**: You can verify the method works by supplying different yellow-pad contents

The heuristic appears throughout the GOMSL notation. The `Get_task_item` operator embodies it: "This mental operator is used to represent that the user has a source of information available containing the specifics of the tasks to be executed, but the analyst does not wish to specify this source" (p. 12).

## When to Bypass: The Relevance Criterion

The critical decision: when is bypassing legitimate? Kieras provides clear guidance: "The analyst should only bypass processes for which a full analysis would be irrelevant to the design" (p. 6).

The test: **Would different design choices change the complexity of the bypassed process?**

**Legitimate bypass**: A text editor user must read marked-up documents regardless of editor design. Reading complexity doesn't vary with editor interface choices. Therefore, bypass reading by assuming marked-up text specifications are available in task description.

**Illegitimate bypass**: The POET editor requires users to devise find-strings constantly. If comparing POET to an editor that doesn't require find-strings, and you bypass find-string generation complexity, your comparison will be meaningless. As Kieras warns: "suppose we are comparing POET to an editor that does not require such heavy use of find strings. Any conclusions about the difficulty of POET compared to the other editor will depend critically how hard it is to think up good find-strings. In this case, bypassing a process might produce seriously misleading results" (p. 6).

**For agent systems**: Bypass a subprocess only if all alternative designs under consideration would require equally complex versions of that subprocess. If Design A makes a subprocess harder than Design B, the bypass hides the design impact.

## Placeholder Operators: Documenting What You Don't Model

GOMSL provides explicit placeholder operators:

```
Verify description
Think_of description
```

"These operators simply introduce a time delay to represent when the user must pause and think of something about the task; the actual results of this thinking are specified elsewhere, such as the task description. The description string serves as documentation, nothing more. Each operator requires 1200 ms" (p. 16).

The time estimate (1200ms) is based on empirical data for complex mental operations, but the key feature is **the operator makes the bypass visible** in the method:

```
Method_for_goal: Format Table
Step 1. Think_of "tab positions for table columns".
Step 2. Look_for_object_whose Content is Tab_marker
        and_store_under <target>.
Step 3. Get_task_item_whose Property is Tab_position
        and_store_under <position>.
Step 4. Point_to <position>.
Step 5. Keystroke TAB.
...
```

Step 1 explicitly acknowledges: "User has to figure something out here." Step 3 retrieves the result. The method doesn't pretend to model *how* tab positions are determined, but clearly shows *when* this determination must occur.

**For agent systems**: Define explicit "external computation" operators in your orchestration language. When a skill needs results from unmodeled processes (business logic decisions, user preferences, external system state), document it explicitly:

```
Step 1. Await_external_input "user approval for database migration".
Step 2. Retrieve_context Schema_changes from <migration_plan>.
Step 3. Execute_migration using <schema_changes>.
```

This makes dependencies visible. If the system fails, you know whether the failure is in modeled logic or in obtaining external inputs.

## The Task Description as the Yellow Pad

The formal mechanism for the yellow pad is the task description: "A task description describes a generic task in terms of the goal to be accomplished, the situation information required to specify the goal, and the auxiliary information required to accomplish the goal that might be involved in bypassing descriptions of complex processes" (p. 19).

Example from the MacWrite model:
```
Task_item: T4
Name is T4.
Type is move.
Text_size is Arbitrary.
Text_selection_start is "Now".
Text_selection_end is "country".
Next is None.
```

This task description bypasses several complex processes:

1. **How did the user decide to move text?** (editorial decision-making)
2. **How did the user identify the text boundaries?** (reading and comprehension)
3. **Why these specific words?** (document semantics)

But it provides what the interface methods need: text boundaries are at words "Now" and "country." The method `Select Arbitrary_text` can execute without modeling any of the bypassed complexity:

```
Method_for_goal: Select Arbitrary_text
Step 1. Look_for_object_whose
        Content is Text_selection_start of <current_task>
        and_store_under <target>.
Step 2. Point_to <target>.
Step 3. Hold_down mouse_button.
Step 4. Look_for_object_whose
        Content is Text_selection_end of <current_task>
        and_store_under <target>.
Step 5. Point_to <target>; Delete <target>.
Step 6. Release mouse_button.
...
```

The method reads from the yellow pad (task description) at Steps 1 and 4, but never models the complexity of determining what to select.

**For agent orchestration**: The task specification (input to an agent workflow) is the yellow pad. It should contain:

- **Goal**: What the workflow should accomplish (explicit)
- **Context**: What information is available (explicit)
- **Assumptions**: What has already been determined (explicit via bypass documentation)

## Structured Bypass: The Object-Property-Value Representation

GOMS uses a systematic representation for bypassed information: "The basic data representation in GOMSL consists of objects with properties and values" (p. 10). This structure ensures bypassed information is well-formed and accessible.

Instead of an unstructured note "user wants to cut some text," the task description provides structured information:

```
Task_item: T1
Type is move.        # What operation
Text_size is Word.   # What granularity  
Text_selection is "foobar".  # What target
```

Each bypassed decision becomes a structured property. Methods access properties uniformly:

```
If Text_size of <current_task> is Word, Then ...
```

**For agent systems**: Don't pass bypassed information as free-form text or unstructured context. Define schemas:

```json
{
  "task": "refactor_code",
  "target": {
    "file": "UserService.java",
    "function": "authenticate",
    "reason": "complexity"  // BYPASSED: how was complexity determined?
  },
  "constraints": {
    "preserve_api": true,
    "max_functions": 3  // BYPASSED: how were constraints chosen?
  }
}
```

The schema makes explicit what's provided (files, functions, constraints) and implicitly documents what's bypassed (how targets were chosen, how constraints were set).

## The Boundary Between Bypass and Implementation

A subtle judgment: when does bypassing become ignoring a real design problem?

Kieras's criterion: "sometimes the complexity of the bypassed process is related to the design. For example, a text editor user must be able to read the paper marked-up form of a document, regardless of the design of the text editor, meaning that the reading process can be bypassed because it does not need to be analyzed in order to choose between two different text editor designs" (p. 6).

The principle: **bypass only processes whose complexity is design-invariant** across the alternatives you're considering.

Counter-example: "suppose we are comparing POET to an editor that does not require such heavy use of find strings. Any conclusions about the difficulty of POET compared to the other editor will depend critically how hard it is to think up good find-strings. In this case, bypassing a process might produce seriously misleading results" (p. 6).

**For agent system design**: When evaluating alternative orchestration strategies, identify which complex subprocesses are affected by strategy choice:

- Comparing SQL generation approaches? You probably can't bypass SQL validation complexity—different approaches may make validation easier or harder
- Comparing UI testing frameworks? You can bypass test case authoring complexity if all frameworks require similar effort to write tests

The bypass decision is context-dependent: what varies between the alternatives under consideration?

## Multi-Level Bypass: Hierarchical Boundaries

Bypassing can occur at multiple levels of the goal hierarchy. Consider the MacWrite example:

**Top level**: `Edit Document` assumes you have a document to edit (bypasses document creation/selection)

**Mid level**: `Move Text` assumes you know what text to move (bypasses editorial decision-making)  

**Low level**: `Select Word` assumes you can identify word boundaries (bypasses linguistic analysis)

Each level bypasses different complexity. The task description provides results at each level:

```
Task_item: T1        # Top level: which document?
Type is move.        # Mid level: what operation?
Text_selection is "foobar".  # Low level: which word?
```

**For agent systems**: Orchestration occurs at multiple abstraction levels. Bypass decisions should be explicit at each level:

- **Strategic level**: Which major tasks to accomplish (bypass: business prioritization)
- **Tactical level**: How to decompose tasks into subtasks (bypass: domain planning)
- **Operational level**: How to execute individual operations (bypass: tool-specific optimization)

Document bypass decisions at each level so stakeholders understand where judgment is required outside the automated system.

## The Verify Operator: Acknowledging Unmodeled Complexity in Quality Checks

Every method in the example includes verification steps:

```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Cut Selection.
Step 2. Accomplish_goal: Paste Selection.
Step 3. Verify "correct text moved".
Step 4. Return_with_goal_accomplished.
```

The `Verify` operator is a placeholder for checking correctness. But what does "correct text moved" actually involve? The user must:

1. Read the current document state
2. Recall the intended change
3. Compare current to intended
4. Judge whether they match

This is enormously complex cognitively, yet it's represented as a single 1200ms operator. This is legitimate bypassing because:

- All text editor designs require verification
- The verification complexity doesn't vary between editors (assuming similar display quality)
- What matters for design comparison is *that* verification occurs, not its cognitive details

**For agent validation**: Include explicit verification steps even when you can't fully model verification logic:

```
Step 8. Validate_output "schema migration produces valid database state".
Step 9. If validation fails, Then Accomplish_goal: Rollback_and_report.
```

This documents that validation is required and creates a hook for actual validation logic (which might be human review, automated testing, or formal verification).

## When Bypass Becomes a Design Requirement

Sometimes analyzing a complex process reveals it's too hard for users, suggesting a design change to eliminate the need. Kieras hints at this: "Often these detailed design decisions are left up to whoever happens to write the relevant code. The analyst may not be able to provide many predictions until the design is more fully fleshed out" (p. 9).

If task analysis with bypass reveals: "User must think of correct cryptographic parameters" (placeholder operator), this might indicate a design problem. Better design: system chooses cryptographic parameters automatically, removing the need for complex user reasoning.

**Design insight from bypass difficulty**: If you find yourself wanting to bypass a process that's:
- Very complex (multiple 1200ms Think_of operators)
- Error-prone (requires expert knowledge)  
- Variable across task instances (no standard solution)

Consider redesigning to eliminate the need for that subprocess entirely.

**For agent systems**: If you're frequently bypassing the same complex reasoning step across many skills ("determine optimal caching strategy," "choose appropriate error recovery approach"), that might indicate a missing capability that should be explicitly modeled as a shared skill.

## Documentation Practice: Making Bypass Visible

Best practice from the GOMS approach: "list the any analyst-defined operators used, along with a brief description of each one, and the assumptions and judgment calls made during the analysis" (p. 22).

For the MacWrite example, documentation might include:

**Analyst-Defined Operators:**
- `Verify description`: 1200ms placeholder for correctness checking; bypasses visual comparison and memory recall complexity

**Bypassed Processes:**
- Editorial decision-making: Task descriptions specify what edits to make; analysis does not model how users decide which edits are needed
- Reading comprehension: Users' ability to parse marked-up manuscripts is assumed; focus is on editor interaction, not document understanding

**Critical Assumptions:**
- Users know MacWrite command structure (Cut/Paste model)
- Users can visually locate text without systematic search
- Verification is always successful (error-free model)

This documentation allows reviewers to assess whether bypass decisions are reasonable.

**For agent systems**: Include bypass documentation in skill definitions:

```yaml
skill: refactor_function
description: Refactors a function to reduce complexity
bypassed_processes:
  - complexity_metric_selection: "Assumes cyclomatic complexity is the relevant metric"
  - refactoring_strategy: "Assumes extract-method pattern; doesn't model strategy selection"
  - naming_conventions: "Follows project conventions; doesn't analyze optimal naming"
assumptions:
  - Function has clear single responsibility (can be determined)
  - Refactoring won't break external dependencies
  - Test suite exists and will catch regressions
```

This makes explicit what the skill does and doesn't handle.

## Practical Guidelines for Agent System Bypass

**When to bypass**:
1. Process complexity is design-invariant across alternatives
2. Process is domain-specific, not system-specific
3. Process has clear inputs/outputs even if internal logic is complex
4. Modeling the process wouldn't change design decisions

**How to bypass**:
1. Define placeholder operation with descriptive name
2. Specify inputs/outputs in task schema
3. Document what's bypassed in skill definition
4. Add verification step to catch bypass failures

**When NOT to bypass**:
1. Process complexity varies between design alternatives
2. Process is a novel capability the system must provide
3. Failures in bypassed process would be invisible
4. You're uncertain whether the process can succeed

**Validation of bypass**:
1. Can you specify concrete test inputs (yellow pad contents)?
2. Does the method work correctly with different inputs?
3. Would domain experts agree the bypassed process is "already solved"?
4. If the bypassed process failed, would the failure be obvious?

## Connection to System Boundaries and Interfaces

The bypass heuristic is fundamentally about **system boundaries**. When you bypass a process, you're declaring it's outside your system boundary. The yellow pad is the interface across that boundary.

For distributed agent systems:
- **Between agents and humans**: Bypass human decision-making; task specification is the interface
- **Between agents and external systems**: Bypass external system logic; API responses are the interface
- **Between agents and domain expertise**: Bypass domain planning; structured domain knowledge is the interface

The discipline: make the boundary explicit (what's inside vs. outside the system), specify the interface (what crosses the boundary), and document what complexity exists on the other side (what's bypassed).

## Conclusion: Strategic Incompleteness

The bypass heuristic teaches that **useful models are strategically incomplete**. They model what matters for the decision at hand, explicitly punt on what doesn't, and document the boundary.

This is the opposite of "we'll model everything eventually"—it's acknowledging that complete models are neither achievable nor necessary. The skill is knowing where to draw the boundary.

For WinDAGs: skills should be incomplete in the right ways. They should fully model their core capability while explicitly bypassing adjacent complexity that isn't their responsibility. The orchestration layer manages these boundaries, passing yellow-pad information between skills.

The test of good bypass: Can you clearly articulate what the skill needs to know (yellow pad contents) versus what it needs to figure out (its actual logic)? If the boundary is fuzzy, the bypass is probably wrong.
```

### FILE: working-memory-as-coordination-mechanism.md

```markdown
# Working Memory as Coordination Mechanism: Managing State in Distributed Cognition

## The Problem: Information Sharing Without Global State

One of the deepest challenges in multi-agent coordination is managing shared context. Each agent needs access to information produced by other agents, but maintaining truly global state creates tight coupling and brittleness. GOMS's treatment of working memory reveals a middle path: **structured temporary state with explicit lifetime management**.

Kieras explains: "Working memory in GOMSL consists of two kinds of information: one is a tag store... which represents an elementary form of working memory. The other kind is the object store which holds information about an object that has been brought into 'focus'" (p. 10-11).

The design encodes several crucial principles:

1. **Named access**: Information is stored and retrieved by symbolic tags, not by memory addresses or implicit context
2. **Limited scope**: Only certain information is "in focus" at any time; everything else requires explicit retrieval
3. **Explicit lifecycle**: Information is deliberately stored and deleted, not automatically managed
4. **Structured access**: Objects have properties that can be accessed uniformly

These properties make working memory a **coordination vocabulary** rather than just a data structure.

## Tags as Coordination Tokens

The fundamental mechanism is the tag: "Tags are expressed as identifiers enclosed in angle brackets" (p. 11). A tag is a symbolic name for a value stored in working memory.

Example:
```
Step 1. Store "foo.txt" under <filename>.
Step 2. Type_in <filename>.
```

In Step 1, the literal value is bound to the tag. In Step 2, the tag is dereferenced—replaced by its current value before the operator executes. This is "somewhat analogous to variables in a conventional programming language" but critically different: "these 'variables' are effectively global in scope" (p. 17).

**Why global scope?** Because working memory represents the shared mental workspace. When one method stores information under a tag, any method that has that tag in scope can retrieve it. This is coordination: Method A produces information that Method B consumes, mediated by the tag name.

But unlike truly global variables, tags have **semantic scope**—they're meaningful only within related methods. A tag like `<current_task>` is understood by methods that operate on tasks. A tag like `<target>` is used for visual objects. The naming convention creates implicit protocols for what information is available when.

**For agent systems**: Tags map directly to **context variables** in an orchestration system. When Agent A stores a result under a named key, Agent B can retrieve it. The key names form a coordination protocol—a shared vocabulary for passing information.

## Object Stores: Bringing Information Into Focus

The second working memory mechanism handles complex structured information: "The object stores correspond to working memory for visual input, task information, and long-term memory retrievals... bringing an object or item into focus is time-consuming, but then all of its properties are available in working memory" (p. 11).

This models an important cognitive constraint: you can't keep all information equally accessible. Visual attention can focus on one object at a time. Task information requires deliberate retrieval. Long-term memory access is a distinct operation.

Once an object is in focus, its properties are immediately available via the `property of object` construction:

```
Step 1. Get_task_item_whose Name is <current_task_name>
        and_store_under <current_task>.
Step 2. Store Next of <current_task> under <current_task_name>.
```

Step 1 brings a task object into focus and stores its name under `<current_task>`. Step 2 accesses the `Next` property of that object without additional retrieval time—it's already in focus.

But: "if the 'focus' is changed to a different object or item, the information is no longer available, and a time-consuming operation is required to bring it back into focus" (p. 11).

**For agent systems**: This maps to **context activation costs**. Switching from analyzing file A to file B requires reloading context. Within analysis of file A, detailed properties are "hot" in memory. Jumping between contexts is expensive; staying within one context is cheap.

Design implication: orchestration should **minimize context switching**. If three operations all need properties of the same database record, schedule them together so the record stays in focus.

## Deliberate Forgetting: The Delete Operator

One of GOMS's most counterintuitive features: explicit forgetting. "The Delete operator is more frequently used to eliminate working memory items that are no longer needed. Although this deliberate forgetting might seem counter-intuitive, it is a real phenomenon" (p. 15).

Why delete information? Two reasons:

1. **Memory load management**: Real humans can't maintain unlimited working memory. Models that don't delete anything aren't realistic.
2. **Explicit lifecycle**: Deletion documents when information is no longer needed, making dependencies visible.

Example from the Issue_Command method:
```
Step 10. Delete <command>; Delete <target>;
         Return_with_goal_accomplished.
```

After the command is issued, the intermediate information (which command object, which visual target) is explicitly deleted before returning. This documents: "These values were temporary scaffolding, not outputs of this method."

**For agent systems**: This maps to **explicit context cleanup**. When a skill completes, it should document which context values are:
- **Outputs** (preserved for downstream skills)
- **Intermediate** (cleaned up)
- **Pass-through** (preserved but not produced by this skill)

Example:
```yaml
skill: validate_schema
inputs:
  - schema_file
  - validation_rules
outputs:
  - is_valid
  - errors
cleanup:
  - parsed_schema  # Intermediate representation
  - rule_instances # Temporary validation objects
```

Making cleanup explicit prevents context bloat and makes information flow visible.

## Property-of-Object: Structured Access Without Copying

The `property of object` construction enables accessing structured information without copying it all into separate tags:

```
If Text_size of <current_task> is Word, Then ...
```

This accesses the `Text_size` property of whatever object is currently stored under `<current_task>`, without creating a separate `<text_size>` tag.

Benefits:
1. **Reduces tag proliferation**: Don't need separate tags for every property
2. **Maintains object coherence**: Properties stay associated with their object
3. **Enables uniform access**: Any object with a `Text_size` property can be accessed the same way

The notation thus supports both **loose coupling** (objects as units of information) and **structured access** (properties as named fields).

**For agent systems**: This maps to **structured context objects**. Instead of passing dozens of flat key-value pairs:

```python
# Flat context (tag-like)
context = {
  "file_name": "User.java",
  "file_path": "/src/User.java",  
  "file_size": 1024,
  "file_type": "java",
  "function_name": "authenticate",
  "function_lines": "10-45",
  ...
}
```

Use structured objects:

```python
# Structured context (object-like)
context = {
  "file": {
    "name": "User.java",
    "path": "/src/User.java",
    "size": 1024,
    "type": "java"
  },
  "function": {
    "name": "authenticate",
    "lines": "10-45"
  }
}
```

Skills access `file.name` or `function.lines`, making relationships clear and reducing naming collisions.

## Pseudoparameters: Controlled Context Passing

The tag-as-global-variable creates a problem for reusable methods: namespace pollution. If every method uses `<target>` for visual objects, nested method calls risk collision.

GOMS addresses this with pseudoparameters: "a method can be called with pseudoarguments in the Accomplish_goal operator and the corresponding pseudoparameters can be defined for a method or selection rule set. These are automatically deleted when the method completed" (p. 17).

Example:
```
Step 8. Accomplish_goal: Enter Data using "Name",
        and name of <current_person>.

Method_for_goal: Enter Data using <field_name>, and <data>
Step 1. Look_for_object_whose label is <field_name>
        and_store_under <field>.
...
Step 5. Delete <field>; Return_with_goal_accomplished.
```

The calling method passes two values: a literal string `"Name"` and a property lookup `name of <current_person>`. The called method receives these under the local pseudoparameters `<field_name>` and `<data>`, which shadow any global tags with the same names and are automatically cleaned up on return.

This provides **scoped parameter passing** while maintaining the simple global tag model for most purposes.

**For agent systems**: This maps directly to **skill parameters vs. shared context**. 

- **Shared context**: Information available to all skills in a workflow (like global WM tags)
- **Skill parameters**: Information passed specifically to one skill invocation (like pseudoparameters)

Example:
```python
# Shared context (workflow-wide)
context = {
  "repository": "my-app",
  "branch": "main"
}

# Skill invocation with parameters (scoped)
result = invoke_skill(
  "analyze_file",
  parameters={
    "file": "User.java",  # Specific to this invocation
    "analysis_type": "security"
  },
  context=context  # Shared workflow context
)
```

The skill sees both parameter values and shared context, but parameters take precedence, and are automatically cleaned up after execution.

## Working Memory as Execution Trace

Because working memory operations are explicit in GOMS methods, the working memory state at any step documents what information was needed to reach that point. This makes the **data dependencies** of the procedure visible.

Example from MacWrite:
```
Method_for_goal: Edit Document
Step. Store First under <current_task_name>.
Step Check_for_done. 
    Decide: If <current_task_name> is None, Then 
            Delete <current_task>; Delete <current_task_name>;
            Return_with_goal_accomplished.
Step. Get_task_item_whose Name is <current_task_name> 
      and_store_under <current_task>.
Step. Accomplish_goal: Perform Unit_task.
Step. Store Next of <current_task> under <current_task_name>;
      Goto Check_for_done.
```

Working memory evolution:
1. After Step 1: `<current_task_name>` = "First"
2. After Step 3: `<current_task_name>` = "First", `<current_task>` = T1 object (in focus)
3. After Step 5: `<current_task_name>` = "T2", `<current_task>` = T1 object (still in focus)
4. Back to Step 2: Check if `<current_task_name>` is "None"

The loop state is entirely captured in `<current_task_name>`. The current task object is in focus, allowing property access without repeated lookups.

**For agent orchestration**: Working memory state is the **execution context** at any point in the DAG. Execution traces should show:
- Which context values exist at each node
- How context changes as execution proceeds  
- What information is passed between nodes
- When information is cleaned up

This makes the DAG's data flow explicit and debuggable.

## Memory Load as a Quality Metric

GOMS makes an unusual claim: "So rather than set an arbitrary limit on when working memory overload would occur, the analyst can identify memory overload problems examining how many items are required in WM during task execution; GLEAN can provide this information" (p. 15).

The method: count how many tags are active at each step. If a method requires maintaining 7+ distinct tags simultaneously, that's a cognitive overload indicator—the procedure is probably too complex for users to execute reliably.

Example overload scenario:
```
Step 1. Store X under <var1>.
Step 2. Store Y under <var2>.
Step 3. Store Z under <var3>.
Step 4. Store A under <var4>.
Step 5. Store B under <var5>.
Step 6. Calculate using <var1>, <var2>, <var3>, <var4>, <var5>.
```

All five values must remain in WM until Step 6—high cognitive load.

Better decomposition:
```
Step 1. Store X under <var1>.
Step 2. Store Y under <var2>.
Step 3. Calculate partial using <var1>, <var2>.
Step 4. Store partial_result under <result1>; Delete <var1>; Delete <var2>.
Step 5. Store Z under <var3>.
Step 6. Calculate final using <result1>, <var3>.
```

Maximum simultaneous tags: 3. Lower cognitive load.

**For agent systems**: Context size is a complexity metric. If a skill requires 20 input parameters, that's a design smell—too much context to manage reliably. Either:
- Decompose into simpler skills with less context each
- Group related parameters into structured objects
- Redesign to require less information

## The Absence Value: Representing Missing Information

GOMS handles missing information explicitly: "If no object matching the specification is present, the result is the symbol absent" (p. 12). This value can be tested in decision operators:

```
Step 1. Look_for_object_whose Type is Button
        and_store_under <button>.
Step 2. Decide: If <button> is absent, Then Goto Error_handler.
Step 3. Point_to <button>.
```

The `absent` value makes missing information **first-class**—it's not an exception or error, it's a normal value that methods can test for and handle.

**For agent systems**: This maps to **explicit null handling**. Instead of exceptions or silent failures when expected context is missing:

```python
# Bad: implicit failure
file = context.get("target_file")  # Returns None if missing
result = analyze(file)  # Crashes if file is None

# Good: explicit handling  
file = context.get("target_file", ABSENT)
if file == ABSENT:
    return error("Missing required context: target_file")
result = analyze(file)
```

Making absence explicit and testable prevents silent failures and makes requirements clear.

## Interstep vs. Intrastep: When Memory Operations Matter for Performance

GOMS distinguishes operations by their time requirements: "Most of the built-in mental operators are all executed during this fixed step execution time, and so are termed intrastep operators. However, substantially longer execution times are required for... certain built-in mental operators such as searching long-term memory. Thus, these are interstep operators" (p. 12).

Memory operations are intrastep (fast/free):
- `Store value under <tag>`: bundled into step time
- `Delete <tag>`: bundled into step time
- Accessing focused object properties: bundled into step time

Memory operations are interstep (expensive):
- `Get_task_item_whose...`: 1200ms to search and focus
- `Recall_LTM_item_whose...`: 1200ms to recall and focus
- `Look_for_object_whose...`: 1200ms to search visual field

**For agent systems**: This maps to **hot vs. cold context**.

Hot context (intrastep):
- Information already in the execution environment
- Recent results from previous skills
- Cached data structures

Cold context (interstep):
- Database queries
- API calls to external systems
- File system access
- Cross-service RPC

Design principle: **Minimize cold context access by keeping hot context current**. If three consecutive skills all need the same database record, fetch it once and pass it through hot context rather than three cold lookups.

## Practical Patterns for Context Management

Based on GOMS working memory patterns:

**Pattern 1: Accumulator**
```
Step 1. Store 0 under <count>.
Step Loop. ... # Some operations
Step. Store <count> + 1 under <count>.
Step. Decide: If <count> < N, Then Goto Loop.
```

For agents: maintaining running state across iterations (collected results, counters, aggregations).

**Pattern 2: Temporary Scaffold**
```
Step 1. Accomplish_goal: Get_resource.  # Produces <resource>
Step 2. Use <resource> for something.
Step 3. Delete <resource>.
Step 4. Return_with_goal_accomplished.
```

For agents: results needed only within a skill's execution, not as outputs.

**Pattern 3: Context Transformation**
```
Step 1. Get_task_item... and_store_under <input>.
Step 2. Transform <input> and_store_under <output>.
Step 3. Delete <input>.
Step 4. Return_with_goal_accomplished.
```

For agents: converting context format between skills (parse then clean up parse tree).

**Pattern 4: Focus Management**
```
Step 1. Look_for_object_whose... and_store_under <obj1>.
Step 2. Do_something with <obj1>.
Step 3. Look_for_object_whose... and_store_under <obj2>.
Step 4. Do_something with <obj2>.
```

For agents: serial access to different context objects, explicit context switches.

## Connection to Production Systems and the 50ms Cycle

The working memory model derives from production system architectures: "these operators are based on the production rule models described by Bovair, Kieras, and Polson" (p. 13). In production systems, working memory is the shared data structure that production rules match against and modify.

The 50ms cycle time represents one **recognize-act cycle**: match production conditions against working memory (recognize), fire matching production and update working memory (act). Simple memory operations fit within this cycle; complex operations span multiple cycles.

**For agent architectures**: The analog is the **orchestration cycle time**—how frequently the orchestrator checks conditions and dispatches skills. If the cycle is too fast relative to skill execution, you pay orchestration overhead with no benefit. If too slow, latency suffers. The right balance: cycle time << typical skill duration, but >> typical context operation time.

## Conclusion: Memory as Interface, Not Just Storage

The deepest insight from GOMS working memory: **memory is a coordination mechanism, not just a storage mechanism**. Tags are a protocol for passing information between methods. The focus mechanism serializes access to structured information. Explicit deletion makes information lifecycle visible.

For multi-agent systems, this translates to: **context is the interface between agents**. The discipline of explicit storage, retrieval, and deletion creates a coordination vocabulary that makes information flow visible, debuggable, and analyzable.

The quality of an orchestration system can be measured by how well it manages context:
- Can you trace information flow through the DAG?
- Are context requirements explicit for each skill?
- Is context cleanup automatic or documented?
- Is hot vs. cold context distinction clear?
- Are context objects structured or flat?

GOMS working memory provides a model for "yes" answers to all these questions.
```

### FILE: judgment-calls-and-how-users-view-tasks.md

```markdown
# Judgment Calls and How Users View Tasks: Modeling the Unobservable

## The Central Problem: User Understanding Is Not Directly Observable

One of GOMS's most honest and practically important contributions is acknowledging that task analysis requires speculation about user cognition. Kieras states: "In constructing a GOMS model, the analyst is relying on a task analysis that involves judgments about how users view the task in terms of their natural goals, how they decompose the task into subtasks, and what the natural steps are in the user's methods. These are standard problems in task analysis" (p. 5).

The uncomfortable truth: we can observe what users do (keystrokes, mouse movements, timing), but we cannot directly observe how they think about what they're doing. Do MacWrite users think of "moving text" as a unified operation, or as "cut then paste"? The observable behavior (select, command-X, reposition cursor, command-V) is consistent with either mental model.

Yet the choice matters enormously. If users think "move," then methods for cutting and pasting should be learned together as components of moving. If users think "cut, then independently, paste," then those methods can be learned separately. This affects learning time, error patterns, and the mental model that documentation and training should foster.

## Judgment Calls: Necessary Speculation

GOMS makes explicit what many design methods leave implicit: "the analyst is actually speculating on a psychological theory or model for how people do the task, and so will have to make hypothetical claims and assumptions about how users think about the task. Because the analyst does not normally have the time or opportunities to collect the data required to test alternative models, these decisions may be wrong, but making them is better than not doing the analysis at all" (p. 5).

This is philosophically sophisticated. The analyst isn't pretending to know the truth—they're making an **explicit bet** about user cognition that can be documented, challenged, and revised. The alternative (not making the assumption) is worse because it means not analyzing the design at all.

**For agent systems**: The same applies to how we model user intent, task structure, and goal hierarchies when designing orchestration. We're speculating about how users (or client systems) think about their tasks. Document the speculation. Make it explicit. Test it when possible. But don't pretend the speculation isn't happening.

## Example: The Cut-and-Paste Judgment

The MacWrite example makes a critical judgment call about goal decomposition: "In the example below for moving text in MacWrite, the main judgment call is that due to the command structure, the user views moving text as first cutting, then pasting, rather than as a single unitary move operation. Given this judgment, the actual methods are determined by the possible sequences of actions that MacWrite permits" (p. 5).

This judgment is grounded in the interface design: MacWrite has separate Cut and Paste commands in the Edit menu, not a single Move command. This interface structure **encourages** users to think "cut then paste." But it doesn't **force** it—users could still conceptualize moving as a unitary operation that just happens to require two commands.

The model reflects the judgment:
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Cut Selection.
Step 2. Accomplish_goal: Paste Selection.
Step 3. Verify "correct text moved".
Step 4. Return_with_goal_accomplished.
```

This decomposition implies:
- Users learn "cut" and "paste" as separate capabilities
- Moving text is accomplished by composing these capabilities  
- Training should explain cut and paste independently, then show how they combine for moving

Alternative judgment (unitary move):
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Select Text.
Step 2. Accomplish_goal: Execute_Move_Command.
Step 3. Accomplish_goal: Designate_Destination.
Step 4. Verify "correct text moved".
Step 5. Return_with_goal_accomplished.
```

This would imply:
- Moving is the primary concept
- Cut and Paste are not independently meaningful to users
- Training should explain moving, with cut/paste as implementation details

**The interface design partly determines which judgment is reasonable**, but doesn't eliminate the need for judgment.

## How to Make Defensible Judgments

Kieras provides guidance: "If the analyst's assumptions are based on a careful consideration from the user's point of view, they can not do any more harm than that typically resulting from the designer's assumptions, and should lead to better results" (p. 6).

The standard: **thoughtful speculation is better than unconscious assumption**. Designers always make assumptions about users—GOMS just makes them explicit.

Sources of evidence for judgments:

1. **Interface structure**: "due to the command structure, the user views moving text as first cutting, then pasting" (p. 5)—the design suggests a decomposition

2. **Comparison to similar systems**: "In contrast, on the IBM DisplayWriter, the design did not include separate cut and paste operations. So here, the decomposition of moving into 'cut then paste' would be a weak judgment call" (p. 5)

3. **User interviews**: "the analyst can learn a lot about how users view the task by talking to the users to get ideas about how they decompose the task in to subtasks" (p. 6)

4. **Behavioral observation**: "rather than asking people to describe verbally what they do, a better approach is having users demonstrate on the system what they do, or better yet, observing what they normally do in an unobtrusive way" (p. 6)

5. **Linguistic evidence**: How do users spontaneously describe their actions? Do they say "I'll cut this and paste it there" or "I'll move this there"?

The key principle: **triangulate**. No single source is definitive, but convergent evidence strengthens a judgment.

## The Gap Between What Users Do and What They Think They Do

A critical insight: "people have only a very limited awareness of their own goals, strategies, and mental processes in general. Thus the analyst can not simply collect this information from interviews or having people 'think out loud.' What users actually do can differ a lot from what they think they do" (p. 6).

This is a fundamental result from cognitive psychology: introspection is unreliable. Users might say "I always use keyboard shortcuts" while observation reveals they use menus 80% of the time. They might claim "I just know where things are" while video shows systematic visual search.

**Implication**: Verbal reports are useful for hypotheses, not conclusions. If users say "moving text is one operation," that's evidence to consider, but observation of how they actually execute moves (pause between cut and paste? ever cut without pasting?) provides stronger evidence.

**For agent systems**: When gathering requirements about how users want agents to operate, distinguish between:
- **Stated preferences**: "I want the agent to optimize for speed"
- **Revealed preferences**: User actually chooses careful/slow operation when speed/risk tradeoff is real
- **Behavioral patterns**: User actually reviews every suggestion before applying

Design for revealed preferences and behavioral patterns, not stated preferences.

## Judgment About Suboptimal Usage

An important complication: "what users actually do with a system may not in fact be what they should be doing with it. As a result of poor design, bad documentation, or inadequate training, users may not in fact be taking advantage of features of the system that allow them to be more productive" (p. 6).

Example: Bhavnani & John (1996) showed that CAD users often used inefficient procedures because they didn't know about better features, even after years of experience.

This creates a choice for the analyst:
- **Descriptive model**: How users actually operate the system (including inefficiencies)
- **Normative model**: How users should operate if fully trained and making optimal use of features

The decision depends on purpose:
- Evaluating **current** usability problems: use descriptive model
- Predicting **potential** performance: use normative model  
- Designing **training**: identify gap between descriptive and normative

**For agent systems**: Similar choice exists. Should we model:
- How users currently accomplish tasks (possibly with suboptimal tool usage)?
- How users could accomplish tasks with full knowledge of available skills?
- How users would accomplish tasks after AI-augmented workflow training?

Document which assumption you're making, because it affects system design. If users currently use 5 steps but could use 2 with better knowledge, should the agent:
- Automate the current 5-step workflow?
- Teach/enforce the optimal 2-step workflow?
- Transparently execute the 2-step workflow for the user?

## Bracketing Uncertainty: Fastest and Slowest Models

When task strategy is genuinely uncertain, Kieras proposes **bracketing**: "Construct two models of the task, one representing using the system as cleverly as possible, producing the the fastest-possible performance, and another that represents the nominal or unenterprising use of the system, resulting in a slowest-reasonable model" (p. 7).

These two models bound the actual performance. If both models predict the same design conclusion (e.g., Design A is faster than Design B in both cases), the uncertainty about strategy doesn't matter. If the models give opposite conclusions, either gather more data or analyze where the sensitivity lies.

Example: For a data entry task, optimistic model assumes user memorizes common entries and types without looking up; pessimistic model assumes user looks up every entry. If both models predict System A is faster, the memorization question doesn't affect the design choice.

**For agent orchestration**: When uncertain about user strategy or context, create bracketing workflows:
- **Optimistic**: Assumes all required information is immediately available, user makes no errors, no external delays
- **Pessimistic**: Assumes information must be gathered, user will review/revise outputs, external dependencies slow execution

If Design A is better in both cases, proceed with Design A. If outcomes flip, identify the critical uncertainty and either gather data or design to handle both cases.

## The "How Should Users Use It?" Alternative

When speculative judgment is too difficult, Kieras suggests: "construct a GOMS model for how the user should do the task. This is much less speculative, and is thus relatively well-defined. It represents a sort of best-case analysis in which the system designer's intentions are assumed to be fully communicated to the user" (p. 7).

This shifts the question from "how will users think about this?" to "how did designers intend users to think about this?"—much easier to answer, because you can ask the designers.

This "intended use" model is valuable for:
1. **Evaluating design coherence**: Does the intended use make sense? Is it consistent across features?
2. **Worst-case testing**: If even ideal usage is problematic, actual usage will be worse
3. **Training design**: The model defines what users need to learn
4. **Documentation**: The model structure maps to help topics

**For agent systems**: When designing a new capability without existing user data, model the **intended workflow**:
- How should users think about this task given the skills available?
- What's the optimal decomposition given the orchestration capabilities?
- What mental model do we want users to form?

This "intended use" model becomes the basis for documentation, examples, and training. Then, after deployment, observe actual usage and refine the model toward descriptive accuracy.

## Documenting Judgment Calls

Critical practice: "By documenting these judgment calls, the analyst can explore more than one way of decomposing the task, and consider whether there are serious implications to how these decisions are made. If so, collecting behavioral data might then be required" (p. 5).

Best practice format:

```
JUDGMENT CALLS:

1. Goal decomposition for "Move Text"
   Decision: Move = Cut + Paste (sequential subgoals)
   Basis: MacWrite has separate Cut/Paste commands; 
          users describe actions as "cut...then paste"
   Alternatives: Move as single goal with multi-step method
   Sensitivity: Affects learning time prediction (separate vs. 
                unified learning); affects documentation structure
   Confidence: Medium (interface structure supports, verbal 
               reports support, no direct observation)

2. Selection method for "arbitrary text"
   Decision: Click-drag selection
   Basis: Most common method observed; menu alternative 
          requires more steps
   Alternatives: Shift-arrow keys; Edit>Select menu
   Sensitivity: Affects execution time (click-drag faster); 
                doesn't affect learning (all methods must be learned)
   Confidence: High (observation data available)
```

This documentation enables:
- **Review**: Others can assess judgment quality
- **Revision**: New data can target specific judgments
- **Sensitivity analysis**: Important judgments get more scrutiny
- **Learning**: Patterns in judgments inform future analyses

**For agent systems**: Document analogous judgments about user workflows, task decomposition, and skill composition:

```yaml
DESIGN ASSUMPTIONS:

assumption: sequential_file_processing
  decision: Process files one at a time, completing each before starting next
  basis: Users mentioned wanting to track progress; parallel processing 
         reduces visibility
  alternatives: Batch parallel processing; streaming with progress aggregation
  sensitivity: Affects resource usage (parallel would be faster but use more 
               memory); affects user experience (serial provides clear progress)
  confidence: Medium (user interviews only, no usage observation)
  validation_plan: Implement both modes, A/B test with telemetry on user 
                   satisfaction and task completion
```

## When Judgments Should Trigger Empirical Work

The judgment call framework includes knowing when speculation isn't enough: "If so, collecting behavioral data might then be required. But notice that once the basic decisions are made for a task, the methods are determined by the design of the system, and no longer by judgments on the part of the analyst" (p. 5).

Triggers for empirical investigation:

1. **High sensitivity**: Different judgments lead to opposite design conclusions (choose Design A vs. Design B)
2. **Large impact**: Judgment affects major resource allocation (hire 3 engineers to build feature X vs. not)
3. **Low confidence**: No interface structure or existing data supports the judgment
4. **Disagreement**: Stakeholders or users hold conflicting views about the task
5. **Novel situation**: No precedent or analogous system to learn from

When these conditions hold, the cost of being wrong exceeds the cost of data collection. Run a pilot study, observe actual usage, or conduct controlled experiments.

**For agent systems**: Invest in user research when:
- Workflow decomposition significantly affects which skills to build
- Unclear if users want automation vs. augmentation for a task
- Disagreement on whether a task is procedural or creative
- No existing system to learn from (truly novel capability)

## The Designer's Assumptions: Making the Implicit Explicit

A profound insight: "any designer of a system has de facto made many such assumptions. The usability problems in many software products are a result of the designer making assumptions, often unconsciously, with little or no thoughtful consideration of the implications for users" (p. 6).

GOMS doesn't create the need for assumptions—it makes existing assumptions visible. Designers always assume things about how users think. The question is whether these assumptions are:
- **Conscious or unconscious**
- **Documented or invisible**  
- **Testable or untestable**
- **Consistent or contradictory**

By forcing assumptions into the GOMS model structure, they become:
- Conscious (you must decide how to decompose goals)
- Documented (written in methods)
- Testable (can be verified against behavioral data)
- Consistency-checkable (do related goals decompose similarly?)

**For agent systems**: Orchestration design embeds assumptions about:
- How users think about task structure (sequential, parallel, hierarchical?)
- What information users have available when (context availability)
- What decisions users can make reliably (what requires agent assistance?)
- What outputs users find useful (intermediate results? only final answer?)

Make these assumptions explicit in design documents, even without full empirical validation. The act of articulation improves decision quality.

## Practical Process for Making Judgment Calls

Based on GOMS approach, a systematic process:

**Step 1: Identify the judgment point**
"Do users view Move as one operation or as Cut+Paste?"

**Step 2: List alternatives**
- Alternative A: Unitary move operation
- Alternative B: Sequential cut, then paste
- Alternative C: Users vary (some A, some B)

**Step 3: Gather evidence**
- Interface structure: Separate Cut/Paste commands → B
- User language: "I cut it and pasted it here" → B
- Timing data: Pause between cut and paste → B
- Error patterns: Sometimes cut without pasting → B

**Step 4: Make provisional judgment**
"We'll model as B (sequential Cut+Paste) because evidence converges"

**Step 5: Document with confidence level**
"Confidence: Medium-High (multiple weak signals, no contradictions, no direct observation)"

**Step 6: Identify sensitivity**
"Affects: Learning time estimates, documentation structure, error recovery design"

**Step 7: Set validation trigger**
"If learning time predictions miss by >20%, revisit this judgment"

**Step 8: Proceed with design based on judgment**

This process makes judgment-making systematic without requiring impossible levels of certainty before proceeding.

## Connection to Selection Rules: When Judgment Determines Code

The GOMS model makes judgment calls executable. When you decide users view a task one way vs. another, that judgment becomes code structure.

If you judge users think "Move = Cut + Paste":
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Cut Selection.
Step 2. Accomplish_goal: Paste Selection.
```

If you judge users think "Move = atomic operation":
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Execute_Move.
```

The selection rule structure captures judgments about when different strategies apply:
```
Selection_rules_for_goal: Select Text
If Text_size of <current_task> is Word, 
   Then Accomplish_goal: Select Word.
If Text_size of <current_task> is Arbitrary,
   Then Accomplish_goal: Select Arbitrary_text.
```

This encodes the judgment: "Users think of selecting words differently from selecting arbitrary text spans."

**For agent orchestration**: Judgment calls about task decomposition directly determine orchestration structure:

```yaml
# Judgment: Users separate data gathering from analysis
workflow: analyze_codebase
  steps:
    - skill: collect_files
    - skill: analyze_collected_files
    
# Alternative judgment: Users think of analysis as including gathering
workflow: analyze_codebase
  steps:
    - skill: analyze_codebase_including_discovery
```

These aren't mere implementation differences—they reflect different theories of how users conceptualize the task.

## Conclusion: Modeling Requires Theory

The deepest lesson: **any useful task model embeds a theory of user cognition**. You cannot model how users accomplish tasks without modeling how they understand tasks. You cannot predict learnability without modeling what users learn. You cannot evaluate consistency without modeling what counts as "the same thing" to users.

GOMS makes this explicit and systematic. It doesn't eliminate judgment—it structures judgment, documents it, and makes its implications traceable.

For WinDAGs and agent systems: **orchestration design is cognitive engineering**. You're not just wiring up capabilities—you're creating a structure that encourages certain ways of thinking about tasks. Document your theory of how users think. Test it when possible. Revise when wrong. But don't pretend you don't have a theory. That just makes your theory unconscious and untestable.

The standard: thoughtful, documented, revisable speculation beats unconscious assumption.
```

### FILE: failure-modes-in-procedural-systems.md

```markdown

# Failure Modes in Procedural Systems: What Goes Wrong When Intelligence Executes Procedures

## The Foundation: GOMS as a Theory of Correct Performance

GOMS is fundamentally a model of **error-free** behavior: "The GOMS models originally presented in Card, Moran, and Newell (1983) and subsequently dealt only with error-free behavior" (p. 23). This might seem like a limitation, but it's actually a prerequisite. As Kieras explains: "a remarkable thing about the extant theoretical work on human error is that it does not have at its core a well-worked out and useful theory of normal, or error-free, behavior in procedural tasks; it is hard to see how one could account for errors unless one can also account for correct performance!" (p. 23).

This is profound: **you can't understand failure modes without understanding success modes**. Errors aren't random—they're systematic deviations from correct procedures, and their patterns reveal where procedures are fragile.

For agent systems: before building robust error handling, you need a correct-case model. What should happen? Only then can you identify where things might go wrong and what would make them go wrong.

## Taxonomy of Procedural Errors

Wood (2000), building on GOMS, identifies systematic error types based on analyzing the method structure. These aren't implementation bugs—they're predictable places where correct procedures become incorrect executions.

### Memory Errors

**Working memory overload**: When a method requires maintaining too many active tags simultaneously, users forget values or confuse which tag holds which value.

Example from method analysis:
```
Step 1. Store X under <var1>.
Step 2. Store Y under <var2>.  
Step 3. Store Z under <var3>.
Step 4. Calculate using <var2> and <var3>.  # Error: use <var1> instead
```

If Steps 1-4 are separated by intervening operations, `<var1>` might decay from working memory, leading to substitution of a more recent value.

**For agent systems**: When context includes many similar values (10 file paths, 8 configuration parameters), substitution errors become likely. Symptom: agent uses wrong file or wrong parameter value. Prevention: structured grouping, minimizing simultaneous context values, explicit verification steps.

### Sequencing Errors

**Omission**: Skipping a step in a method.

Example:
```
Method_for_goal: Commit Changes
Step 1. Accomplish_goal: Stage Files.
Step 2. Accomplish_goal: Write Commit Message.  # Sometimes omitted
Step 3. Execute_commit_command.
```

If Step 2 is omitted (user types commit command without message), an incomplete operation results.

**For agent systems**: Multi-step skills where one step seems "optional" or "obvious." Users might skip authentication, validation, or confirmation steps. Design response: make critical steps non-optional through system constraints or explicit verification.

**Permutation**: Executing steps out of order.

Example:
```
Method_for_goal: Configure Service
Step 1. Set_configuration.
Step 2. Restart_service.
Step 3. Verify_configuration.
```

Executing Step 2 before Step 1 (restart before configuration) produces incorrect behavior but no immediate error signal.

**For agent systems**: When skill steps have implicit dependencies not enforced by the system, users or orchestration logic might execute out of order. Prevention: explicit dependency constraints in DAG, automatic dependency checking.

### Decision Errors

**Incorrect branch**: Decision operator selects wrong branch due to misread condition or misunderstood context.

Example:
```
Step 5. Decide:
    If file_type of <current_file> is "python",
       Then Use_python_linter;
    If file_type of <current_file> is "javascript",  
       Then Use_js_linter;
    Else Use_generic_linter.
```

Error: `file_type` is "py" (not exactly "python"), falls through to generic linter. Not what user intended, but syntactically correct.

**For agent systems**: Pattern matching in routing logic is error-prone. Exact string matches ("python" vs "py"), case sensitivity ("Python" vs "python"), enumeration gaps (unhandled file types). Prevention: robust condition evaluation, explicit handling of edge cases, logging of decision paths.

### Selection Rule Errors

**Wrong method chosen**: Selection rule dispatches to inappropriate method for context.

Example:
```
Selection_rules_for_goal: Format Document
If format of <document> is "markdown",
   Then Use_markdown_formatter.
If format of <document> is "html",
   Then Use_html_formatter.
Return_with_goal_accomplished.
```

No rule handles format "rst" (reStructuredText), so no method executes—silent failure.

**For agent systems**: Routing logic that doesn't cover all cases. Symptom: some task contexts produce no skill invocation, or invocation of inappropriate skill. Prevention: exhaustive case coverage, explicit "catch-all" handlers, logging of routing decisions.

## Delayed Error Detection: The Visibility Gap

A critical observation from Wood (2000): errors often don't become visible immediately. The user makes a mistake at Step N, but doesn't discover it until Step N+5 when consequences become apparent.

Example from interface analysis:
```
Method_for_goal: Compute_and_use_value
Step 1. Get_task_item... and_store_under <value>.
Step 2. Think_of "computation involving <value>".  # Error: miscalculate
Step 3. Store result under <computed_value>.
Step 4. Accomplish_goal: Execute_submethod.
Step 5. Accomplish_goal: Execute_another_submethod.
Step 6. Decide: If display_state is incorrect,    # Error finally visible
           Then Realize_mistake.
```

The calculation error at Step 2 doesn't manifest until Step 6 when the resulting display is wrong. By then, the user has executed several intervening steps, making it harder to identify the error source.

**Design implication**: Interfaces should make errors visible as close as possible to where they occur. The longer the gap, the harder recovery becomes.

**For agent systems**: When a skill produces incorrect output but no error signal, the incorrectness propagates through downstream skills until something fails catastrophically. Prevention:
- **Immediate validation**: Each skill validates its outputs before return
- **Incremental verification**: Downstream skills check input assumptions
- **Semantic constraints**: Type systems, schemas, pre/post-conditions catch errors early

## The Error Recovery Problem

Once an error is detected, recovery becomes its own task: "once the human detects an error, recovering from it becomes simply another goal; a well-designed system will have simple, efficient, and consistent methods for recovering from errors" (p. 23).

Recovery methods have the same properties as normal methods:
- They're learned procedures
- They can be easy or hard
- They can be consistent across error types or ad-hoc
- They can be error-prone themselves

**Poor error recovery design**:
```
Method_for_goal: Recover from wrong file selection
Step 1. Restart entire application.  # Loses all unsaved work
Step 2. Navigate back to original location.  # Tedious
Step 3. Re-enter all parameters.  # Duplicate effort
Step 4. Select correct file.
```

**Good error recovery design**:
```
Method_for_goal: Recover from wrong file selection  
Step 1. Click "back" button.  # Returns to selection state
Step 2. Select correct file.  # Everything else preserved
```

The good design has:
- **Short recovery path**: 2 steps vs. 4
- **Low recovery cost**: Preserved state vs. lost work
- **Simple recovery procedure**: Obvious "back" button vs. restart

**For agent systems**: Error recovery is a first-class design concern, not an afterthought:
- Can partial workflow results be preserved?
- Can execution be resumed from point of failure?
- Are error messages actionable (what to do, not just what went wrong)?
- Is undo/rollback available?

## Error-Tolerant Design Through GOMS Analysis

Wood (1999, 2000) developed heuristics for examining GOMS models to identify error vulnerabilities. The process:

**Step 1: For each method step, identify potential errors**
- Working memory errors (too many tags, similar tag values)
- Sequencing errors (step omission, permutation)
- Decision errors (misunderstood conditions, unhandled cases)
- Selection errors (no matching method, multiple matches)

**Step 2: Determine when each error becomes visible**
- Immediate (error produces obvious wrong result at same step)
- Delayed (error only manifests several steps later)
- Silent (error never produces obvious signal)

**Step 3: Analyze recovery difficulty**
- Can user return to pre-error state?
- How many steps to recover?
- Is recovery procedure obvious?
- Can recovery itself fail?

**Step 4: Identify design changes**
- **Prevent error**: Redesign to make error impossible (system constraints)
- **Detect earlier**: Make error visible sooner (immediate feedback)
- **Ease recovery**: Simplify recovery procedure (undo, checkpoints)

Example from e-commerce application (Wood 2000):

**Error vulnerability**: User enters credit card number in method requiring computation of verification digits. Miscomputation is easy (multi-digit mental arithmetic) but not detected until transaction fails at Step 15.

**Design changes**:
- **Prevent**: Eliminate mental computation—system computes verification automatically
- **Detect earlier**: Validate card number immediately after entry
- **Ease recovery**: Allow editing card number without re-entering all form data

**For agent systems**: Systematically analyze each skill for error vulnerabilities:
- Which parameters are error-prone (complex format, user-generated, ambiguous)?
- Which operations could fail (API calls, file I/O, parsing)?
- Which conditions could be misunderstood (complex boolean logic)?

Then design accordingly: validation, retries, partial results, clear failure modes.

## The Exception Handling Analogy

Modern programming languages use exceptions to separate normal flow of control from error handling. Wood suggests GOMS models need analogous mechanisms: "when an error is detected, an exception-like mechanism invokes the appropriate error-recovery method and then allows the original method to resume" (p. 23).

This prevents error-handling logic from cluttering the mainline methods:

**Without exceptions** (cluttered):
```
Method_for_goal: Process File
Step 1. Open_file.
Step 2. Decide: If file_open failed, Then Handle_open_error.
Step 3. Read_contents.
Step 4. Decide: If read failed, Then Handle_read_error.
Step 5. Parse_contents.  
Step 6. Decide: If parse failed, Then Handle_parse_error.
...
```

**With exceptions** (clean):
```
Method_for_goal: Process File
Step 1. Open_file.  # Exception on failure
Step 2. Read_contents.  # Exception on failure
Step 3. Parse_contents.  # Exception on failure
...

Exception_handler: File_processing_error
Step 1. Log_error.
Step 2. Notify_user.
Step 3. Cleanup_partial_state.
Step 4. Resume_or_abort.
```

The mainline method describes the success case; exception handlers describe failure cases. The two are decoupled, improving comprehensibility.

**For agent systems**: Orchestration should separate happy-path from error-path:

```yaml
skill: analyze_codebase
  steps:
    - load_repository
    - parse_files  
    - run_analysis
    - generate_report
  on_error:
    - log_failure
    - preserve_partial_results
    - notify_user
  cleanup:
    - close_repository_handle
```

Error handling is specified separately from normal flow, making both easier to understand and maintain.

## Consistency Errors: When Similar Tasks Have Different Procedures

A failure mode unique to complex systems: when similar high-level goals require different low-level procedures, users apply wrong procedure.

Example: In text editors, "delete" might work differently for:
- Selected text (press DELETE key)
- Entire line (use Edit>Delete Line menu)
- File in project (right-click>Delete from Tree)

If these all have different methods, users will misapply:
- Try DELETE key to delete line (wrong)
- Try Edit>Delete Line on file (wrong)
- Try right-click>Delete on selected text (wrong)

GOMS makes this visible through method comparison. If similar goals (all variations of "delete something") require structurally different methods, that's inconsistency—a major error source.

**For agent systems**: When similar task types require different skill invocations or different parameter formats, users and orchestration logic will confuse them. Design response: **uniform interfaces for similar operations**.

Example:
```yaml
# Inconsistent - error-prone
analyze_python:
  parameters: [directory, recursive_flag]
  
analyze_javascript:
  parameters: [file_list, options_object]
  
# Consistent - less error-prone  
analyze_codebase:
  parameters: 
    language: [python | javascript]
    target: [directory | file_list]
    options: [structured_options]
```

## The Interruption Problem: When External Events Disrupt Procedures

Standard GOMS assumes uninterrupted execution: one method runs to completion before another starts. But real environments include interruptions: phone calls, alerts, system events, competing priorities.

Interruptions cause:
- **Loss of place**: User returns from interruption unsure which step they were on
- **Working memory decay**: Tags forgotten during interruption
- **Context switch errors**: Resume with wrong context (old task's values)

Kieras discusses extensions: "an interrupt rule could be checking for evidence of an error, and then invoke the appropriate error-handling method" (p. 25).

**For agent systems**: Interruptions are the norm, not the exception. Design implications: