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