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