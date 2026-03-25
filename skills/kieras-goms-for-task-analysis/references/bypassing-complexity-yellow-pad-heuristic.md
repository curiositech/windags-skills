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