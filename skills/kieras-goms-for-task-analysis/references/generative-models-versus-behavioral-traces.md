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