# Decomposition Principles: What Multi-Environment Evaluation Teaches About Breaking Down Complex Problems

## The Setup: Why Eight Environments?

AgentBench doesn't just test agents—it tests them across eight *structurally different* environments spanning code, games, and web. This multi-environment approach reveals principles that single-environment benchmarks miss: **How tasks should be decomposed depends on task structure, not just task complexity.**

The critical insight: Task complexity (how many steps required) and task decomposability (how it should be broken down) are independent dimensions. Some simple tasks are hard to decompose; some complex tasks decompose naturally. Understanding the difference is essential for building robust agent orchestration systems.

## What Makes Tasks Decomposable?

### Decomposability Dimension 1: Subtask Independence

**Highly decomposable** (subtasks are independent):
- **Database**: "Count users" and "Find max salary" can be separate queries
- **Knowledge Graph**: "Find entity type" and "Query relations" can be separate API calls
- **Web Shopping**: "Search products" and "Filter by price" are separable steps

**Weakly decomposable** (subtasks are interdependent):
- **House Holding**: Must explore environment before you know where objects are; can't parallelize "find soapbar" and "clean soapbar"
- **Digital Card Game**: Your next move depends on opponent's previous move; can't pre-plan entire game
- **Lateral Thinking Puzzles**: Each question depends on answers to previous questions; must be sequential

**Design principle**: Decompose along independence boundaries. If subtask B depends on results of subtask A, don't try to parallelize them. If they're independent, decomposition can improve efficiency.

**Example from AgentBench**: Knowledge Graph tasks naturally decompose into independent API calls:
```
Task: "Find tropical cyclones similar to Hurricane Marie that affected Eastern North America"

Subtask 1: get_relations(Hurricane Marie) → find relation types
Subtask 2: get_neighbors(Hurricane Marie, similar_to) → find similar cyclones
Subtask 3: get_neighbors(results, affected_region) → filter by region
```

Each subtask is independently executable (no shared state), making them parallelizable if needed.

### Decomposability Dimension 2: Clear Intermediate Goals

**Highly decomposable** (clear intermediate milestones):
- **Operating System**: "Find files" → "Check permissions" → "Count results" (each has verifiable output)
- **Database**: "Select records" → "Filter" → "Aggregate" (each produces a table/value)
- **Web Browsing**: "Navigate to page" → "Click element" → "Verify result" (each has observable state change)

**Weakly decomposable** (fuzzy intermediate goals):
- **Lateral Thinking Puzzles**: Hard to define "progress" until you've solved it
- **Digital Card Game**: "Winning" is clear, but intermediate goals are strategic (gain advantage? preserve resources? mislead opponent?)

**Design principle**: When intermediate goals are verifiable, decompose into subtasks with explicit success criteria. When intermediate goals are fuzzy, keep tasks monolithic (let agent figure out its own intermediate goals).

**Example from AgentBench**: House Holding tasks have clear milestones:
```
Task: "Put clean soapbar on countertop"

Milestone 1: Locate soapbar (verifiable: soapbar is in inventory)
Milestone 2: Clean soapbar (verifiable: soapbar is clean)
Milestone 3: Place on countertop (verifiable: soapbar is on countertop)
```

Each milestone is independently checkable, enabling decomposition with verification at each step.

### Decomposability Dimension 3: Action Space Consistency

**Highly decomposable** (same action space across subtasks):
- **Database**: Every subtask uses SQL queries (uniform interface)
- **Operating System**: Every subtask uses bash commands (uniform interface)

**Weakly decomposable** (different action spaces for subtasks):
- **Web Browsing**: Some subtasks require search (text generation), others require click (element selection)—hybrid action space
- **House Holding**: Some actions are movement (go to X), others are manipulation (take Y)—different cognitive demands

**Design principle**: When action spaces are uniform, subtasks can use the same agent infrastructure. When action spaces differ, decomposition boundaries should align with action space boundaries.

**Example from AgentBench**: Web Browsing's hybrid action space:
```
Task: "Find a latest post with >10k upvotes in r/announcements and upvote it"

Subtask 1 (search action): Search for r/announcements
Subtask 2 (click action): Click on r/announcements link
Subtask 3 (scan action): Identify posts with >10k upvotes
Subtask 4 (click action): Click upvote button
```

Subtasks 1 and 3 require element selection (click), while subtask 3 requires text analysis (scan). Decomposing along these boundaries allows using specialized models for each action type.

## Patterns from AgentBench: What Decomposes Well

### Code-Grounded Tasks: Natural Decomposition

Operating System, Database, and Knowledge Graph tasks show high decomposability:

**Why?**
1. **Deterministic outcomes**: Each command/query has clear success/failure
2. **Inspectable state**: Can verify intermediate results (database tables, file listings, API responses)
3. **Compositional semantics**: Complex queries build from simple primitives (JOIN, FILTER, etc.)

**Decomposition strategy**:
- Break complex queries into simple queries
- Execute and verify each query independently
- Compose results at the end

**Example: Database multi-step query**:
```
Task: "Find departments where average salary > 100k and employee count > 50"

Step 1: SELECT dept, AVG(salary) FROM employees GROUP BY dept HAVING AVG(salary) > 100k
Step 2: SELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 50
Step 3: Intersect results from Steps 1 and 2
```

Each step is independently executable and verifiable.

**AgentBench evidence**: GPT-4's successful Database trajectories frequently decompose complex queries into simpler ones, executing and verifying each step before proceeding.

### Game-Grounded Tasks: Resist Decomposition

Digital Card Game and Lateral Thinking Puzzles show low decomposability:

**Why?**
1. **Strategic interdependence**: Each move depends on previous moves and opponent responses
2. **Fuzzy intermediate goals**: "Progress" is hard to define until task completion
3. **Stochastic outcomes**: Same action can have different results depending on context

**Decomposition strategy**: Don't decompose. Keep as monolithic task where agent maintains full context and adapts dynamically.

**Example: Digital Card Game**:
```
Task: "Win the card game"

Bad decomposition attempt:
  Subtask 1: "Reduce opponent's health to <200"
  Subtask 2: "Preserve your own health >200"
  Subtask 3: "Guess opponent's fish identities"
  
Problem: These subtasks conflict! Reducing opponent's health might require
sacrificing your own health. Guessing identities might be more/less important
depending on current board state.
```

Strategic tasks require holistic reasoning—decomposing them breaks the strategic coherence.

**AgentBench evidence**: GPT-4's successful Card Game trajectories show continuous strategic adaptation, not step-by-step plan execution. The model reasons about the entire game state, not isolated subtasks.

### Web-Grounded Tasks: Hybrid Decomposability

Web Shopping and Web Browsing show mixed patterns:

**Web Shopping** (high decomposability):
- Clear template: Search → Filter → Select → Buy
- Independent subtasks: Search doesn't depend on filter results beforehand
- Verifiable milestones: "Correct product found" is checkable

**Web Browsing** (lower decomposability):
- Open-ended navigation: No fixed template
- Context-dependent actions: What to click depends on page contents
- Fuzzy milestones: "Found relevant information" is subjective

**Decomposition strategy**:
- **For template-following web tasks**: Decompose into template steps
- **For open-ended web tasks**: Keep monolithic, let agent explore

**AgentBench evidence**: CodeLlama excels on Web Shopping (template-following) but struggles on Web Browsing (open-ended). The former's decomposability allows procedural execution; the latter's lack of decomposability requires flexible exploration.

## Anti-Patterns: When Decomposition Hurts

### Anti-Pattern 1: Decomposing Along Arbitrary Milestones

Bad: "Break every task into 5-step plans regardless of task structure"

**Why it fails**: Some tasks naturally have 2 steps (search + execute). Others have 15 (systematic exploration). Forcing artificial decomposition creates:
- Unnecessary overhead (coordination between subtasks)
- Lost context (subtask 3 doesn't remember subtask 1's findings)
- False milestones (declaring "progress" that isn't real progress)

**AgentBench evidence**: Models that over-decompose (breaking simple tasks into many microsteps) show higher round counts without higher success rates. The overhead of decomposition exceeds the benefit.

### Anti-Pattern 2: Decomposing Without Verification

Bad: "Divide task into subtasks, assume subtask 1 succeeds, proceed to subtask 2"

**Why it fails**: If subtask 1 fails silently, subtask 2's assumptions are wrong, and the entire task cascades into failure.

**AgentBench evidence**: Database tasks where models generate multi-step query plans often fail when:
- Step 1 produces empty result (no matching records)
- Step 2 assumes step 1 produced results
- Step 2 fails with "no data" error, but model doesn't revise plan

**Fix**: Implement verification checkpoints between subtasks. If subtask 1 doesn't produce expected output, halt and revise plan.

### Anti-Pattern 3: Decomposing Strategic Tasks

Bad: "Break card game into 'early game', 'mid game', 'end game' phases"

**Why it fails**: Strategic tasks require fluid adaptation. Rigid phase boundaries prevent opportunistic moves (e.g., "I could win now if I attack, but I'm in 'mid game phase' so I'll continue building resources").

**AgentBench evidence**: Models that try to follow fixed strategic plans (always use AOE attack in rounds 1-5, always target low-health enemy in rounds 6-10) lose to models that adapt flexibly to current board state.

## Decomposition Strategies for WinDAGs

### Strategy 1: Detect Decomposability Automatically

When a task arrives, classify its decomposability:

```python
def assess_decomposability(task):
    """
    Determine if and how task should be decomposed
    """
    score = 0
    
    # Check subtask independence
    if task.has_independent_subtasks():
        score += 2
    
    # Check for clear intermediate goals
    if task.has_verifiable_milestones():
        score += 2
    
    # Check action space consistency
    if task.action_space_is_uniform():
        score += 1
    
    if score >= 4:
        return "highly_decomposable"
    elif score >= 2:
        return "partially_decomposable"
    else:
        return "not_decomposable"
```

Route decomposable tasks to hierarchical agent architectures; non-decomposable tasks to monolithic agents.

### Strategy 2: Decompose Only at Natural Boundaries

Don't force decomposition. Find natural boundaries:

**Natural boundaries**:
- Action space changes (search → click, code → interpretation)
- Agent type changes (code generation → strategic reasoning)
- Verification points (query result available)

**Unnatural boundaries**:
- Arbitrary round numbers ("decompose every 10 rounds")
- Artificial milestones ("25% progress")

### Strategy 3: Implement Subtask Contracts

When decomposing, define explicit contracts between subtasks:

```python
class SubtaskContract:
    def __init__(self, inputs, outputs, postconditions):
        self.inputs = inputs          # What this subtask needs
        self.outputs = outputs        # What this subtask produces
        self.postconditions = postconditions  # Verifiable success criteria
    
    def verify(self, result):
        """Check if result satisfies postconditions"""
        for condition in self.postconditions:
            if not condition(result):
                return False
        return True

# Example: Database task decomposition
subtask1 = SubtaskContract(
    inputs=["table_name", "filter_criteria"],
    outputs=["filtered_records"],
    postconditions=[lambda r: len(r) > 0]  # Must return at least one record
)

subtask2 = SubtaskContract(
    inputs=["filtered_records"],
    outputs=["aggregated_value"],
    postconditions=[lambda v: isinstance(v, float)]  # Must return numeric value
)
```

This makes decomposition explicit and verifiable.

### Strategy 4: Use Hierarchical Agents for Decomposable Tasks

When tasks are highly decomposable, use hierarchical architecture:

```
Supervisor Agent (strategic)
   |
   ├─> Subtask 1 Agent (operational)
   ├─> Subtask 2 Agent (operational)
   └─> Subtask 3 Agent (operational)