# The Gap Between Knowing and Doing: Specification vs. Execution in Planning Systems

## The Translation Problem

One of the most revealing aspects of SHOP2's development is the tension between specification and execution—between knowing what operators do and being able to plan with them effectively.

The paper describes this tension through the PDDL-to-SHOP2 translation problem: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This statement contains a profound insight: **Knowing the primitive actions (PDDL operators) is not the same as knowing how to accomplish tasks (HTN methods).**

## Two Levels of Knowledge

### Operational Knowledge: What Can Be Done

PDDL operators specify operational knowledge:
- **Preconditions**: When this action can be executed
- **Effects**: What changes when it executes
- **Parameters**: What entities it operates on

Example from ZenoTravel:
```
operator: board(?person, ?aircraft, ?city)
precondition: at(?person, ?city) ∧ at(?aircraft, ?city)
effects: ¬at(?person, ?city) ∧ in(?person, ?aircraft)
```

This tells you: "You CAN board a person onto an aircraft when both are at the same city, and doing so puts the person in the aircraft."

### Procedural Knowledge: How To Accomplish Tasks

HTN methods specify procedural knowledge:
- **Task decomposition**: How to break complex tasks into simpler ones
- **Ordering constraints**: What sequence to follow
- **Alternative strategies**: Different ways to accomplish the same task

Example from Figure 8:
```
method: transport-person(?person, ?destination)
case 1: already there → done
case 2: not there → select aircraft, move it to person, 
                    board, fly to destination, debark
```

This tells you: "To TRANSPORT a person, here's the standard procedure..."

## The Gap

The gap between operational and procedural knowledge is the difference between:
- Knowing all the possible moves in chess vs. knowing how to play chess well
- Knowing what each function in a codebase does vs. knowing how to implement a new feature
- Knowing the rules of physics vs. knowing how to build a bridge

The PDDL operators give you the "rules of the game." The HTN methods give you the "strategy for playing well."

Classical planners try to bridge this gap through search: given only the rules, discover good strategies by trying many possibilities. SHOP2's approach is to encode the strategies explicitly as HTN methods.

## Why Translation Isn't Enough

The paper's translator can convert PDDL operators to SHOP2 operators mechanically. But it cannot generate effective HTN methods because:

**Methods encode domain-specific insight**: How do humans normally accomplish this task? What's the standard procedure? What are the common special cases?

**Methods prune the search space**: Without methods, SHOP2 would need to search through all possible action sequences, just like classical planners. With methods, it only explores sequences that follow sensible procedures.

**Methods enable tractability**: The paper cites results showing HTN planning can be polynomial where classical planning is exponential. This isn't magic—it's because methods encode problem structure that classical planning must rediscover through search.

An automatically generated SHOP2 domain without methods would be equivalent to classical planning: correct but inefficient.

## Example: The Logistics Domain

Consider a logistics domain with operators:
- load(truck, package, location)
- unload(truck, package, location)
- drive(truck, from-location, to-location)

A classical planner, given "get package P from location A to location B," might try:
1. drive(truck-1, somewhere, A)... no wait, wrong truck
2. drive(truck-2, depot, A)... okay
3. load(truck-2, P, A)... good
4. drive(truck-2, A, some-random-place)... no, need to go to B
5. [backtrack, try again]
6. drive(truck-2, A, B)... finally
7. unload(truck-2, P, B)... done

An HTN method encodes the procedure directly:
```
method: transport-package(?package, ?destination)
subtasks:
  1. find-truck(?truck, ?package-location)
  2. drive(?truck, ?current-location, ?package-location)
  3. load(?truck, ?package, ?package-location)
  4. drive(?truck, ?package-location, ?destination)
  5. unload(?truck, ?package, ?destination)
```

The method says: "First get a truck to the package, then load, then drive to destination, then unload." This procedural knowledge eliminates the need to search.

## The Cost of Bridging the Gap

Bridging the gap from operational to procedural knowledge requires:

**Domain Expertise**: You need to understand how tasks are normally accomplished in this domain. What are the standard procedures? What are the common cases and edge cases?

**Planning Expertise**: You need to understand how to encode procedural knowledge as HTN methods. What granularity of decomposition? How to handle alternatives? How to order subtasks?

**Time and Effort**: The paper mentions "days" to write domain descriptions and "a great deal of effort crafting the methods."

**Risk of Error**: The AIPS-2000 failure shows that hand-written methods can contain bugs. The operational knowledge (operators) might be correct while the procedural knowledge (methods) is wrong.

This cost is why many researchers prefer "fully automated" planners that work from operators alone. But the cost pays off: 99% success rate vs. much lower for automated planners.

## Validation: Checking the Gap

How do you verify that your procedural knowledge (HTN methods) correctly implements the operational knowledge (operators)?

SHOP2's team addressed this through testing and translator-based validation:

**Testing**: Run the planner on problem instances and verify solutions are valid. This catches errors where methods generate invalid action sequences.

**Translator baseline**: Generate a baseline domain from PDDL operators. Compare behavior of hand-written methods against baseline. Methods should solve the same problems (correctness) but faster (efficiency).

**Tracing and debugging**: SHOP2's tracing facility (Section 3.3.4) lets you observe method selection and verify it's doing what you expect.

But these are post-hoc validation techniques. There's no automated way to prove that a set of HTN methods correctly captures the "right" way to accomplish tasks, because "right" involves domain-specific judgment.

## Application to Agent Systems

### The AI Agent Gap

Modern agent systems face a similar gap:

**Operational Knowledge**: What each skill/tool can do
- API documentation
- Function signatures and types
- Preconditions and postconditions

**Procedural Knowledge**: How to accomplish complex tasks
- Which skills to use in what order
- How to handle failures and edge cases
- When to use alternative strategies

Current LLM-based agents try to bridge this gap through:
- Reasoning about task decomposition at runtime
- Learning from examples (few-shot learning)
- Trial-and-error with reflection

But this is expensive and unreliable. The SHOP2 approach suggests: **Encode procedural knowledge explicitly as reusable task decomposition templates**.

### Translating SHOP2's Lessons

**Skill Composition Patterns**: Create libraries of common task decomposition patterns:

```python
class TaskDecompositionPattern:
    """Base class for encoding how to accomplish task types"""
    
    def applies_to(self, task, state) -> bool:
        """Check if this pattern applies to the task"""
        pass
    
    def decompose(self, task, state) -> List[Subtask]:
        """Decompose task into subtasks"""
        pass

class ImplementFeaturePattern(TaskDecompositionPattern):
    """Standard pattern for implementing a feature"""
    
    def applies_to(self, task, state):
        return task.type == "implement_feature"
    
    def decompose(self, task, state):
        return [
            Subtask("design_data_model", task.feature),
            Subtask("implement_api_endpoints", task.feature),
            Subtask("add_tests", task.feature),
            Subtask("update_documentation", task.feature)
        ]
```

**Declarative Procedures**: Make task decomposition knowledge declarative and reviewable, like HTN methods:

```yaml
# Feature implementation procedure
task: implement_feature
cases:
  - condition: feature.type == "crud"
    subtasks:
      - design_data_model
      - generate_crud_endpoints
      - generate_crud_tests
      - update_api_docs
  
  - condition: feature.type == "integration"
    subtasks:
      - design_integration_interface
      - implement_adapter
      - add_integration_tests
      - update_integration_docs
```

This is readable by both humans (for validation) and machines (for execution).

**Learning from Execution**: Unlike SHOP2's static methods, agent systems can learn better decompositions from experience:

```python
class LearningTaskDecomposer:
    def __init__(self):
        self.patterns = load_initial_patterns()
        self.execution_history = []
    
    def decompose(self, task, state):
        # Use best-known pattern
        pattern = self.select_pattern(task, state)
        subtasks = pattern.decompose(task, state)
        
        # Record for learning
        self.execution_history.append({
            'task': task,
            'pattern': pattern,
            'subtasks': subtasks,
            'timestamp': now()
        })
        
        return subtasks
    
    def learn_from_outcome(self, task, success, cost):
        # Update pattern effectiveness estimates
        # Potentially generate new patterns
        pass
```

**Graduated Autonomy**: Use SHOP2's pattern of "baseline + enhancement":

1. **Level 0**: Human-written procedures (like HTN methods)
2. **Level 1**: Agent follows procedures, learns from deviations
3. **Level 2**: Agent proposes modifications to procedures, human approves
4. **Level 3**: Agent autonomously refines procedures based on outcomes

Start conservative (explicit procedures) and gradually increase autonomy as the system proves reliable.

## The Deeper Pattern: Executable Knowledge Representation

The gap between specification and execution reveals a fundamental challenge in AI: **How do you represent knowledge in a form that's both human-understandable and machine-executable?**

SHOP2's answer: **Hierarchical task networks as executable procedural knowledge**

This has several advantages:

**Human Readability**: HTN methods look like procedures/algorithms. Humans can read them, understand them, and validate them.

**Machine Executability**: Methods have precise semantics. SHOP2's algorithm can execute them deterministically.

**Composability**: Methods compose hierarchically. Complex procedures build from simpler ones.

**Modifiability**: You can modify one method without affecting others (assuming no unexpected interactions).

For agent systems, this suggests: **Invest in rich, explicit representations of procedural knowledge**, not just operational knowledge (what tools can do) or strategic knowledge (what goals to achieve).

## Key Insight: The Specification-Execution Gap is Fundamental

The gap between knowing what actions do and knowing how to accomplish tasks isn't a temporary limitation to be eliminated by better AI. It's a fundamental aspect of complex problem-solving.

Even if an agent perfectly understands all available actions, it still needs:
- Domain-specific insight about which action sequences are sensible
- Strategic knowledge about how to break down complex goals
- Procedural knowledge about standard operating procedures
- Heuristic knowledge about which alternatives to try first

SHOP2's success—99% problem-solving success rate—comes from encoding this knowledge explicitly as HTN methods, not from trying to discover it through search.

For agent systems: **Don't expect agents to discover good procedures from scratch**. Instead, encode procedural knowledge explicitly, make it learnable and refinable, and gradually improve it through experience.

The goal isn't to eliminate the specification-execution gap. It's to make the gap explicit, manageable, and traversable through a combination of human expertise and machine learning.