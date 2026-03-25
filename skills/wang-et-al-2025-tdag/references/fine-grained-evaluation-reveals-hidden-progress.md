# Fine-Grained Evaluation Reveals Hidden Progress: Why Binary Metrics Hide Agent Capabilities

## The Binary Evaluation Trap

Figure 3 in the TDAG paper contains a startling revelation: when evaluated with binary scoring (success/failure), all tested methods score between 27-32% with no clear winner. But when evaluated with fine-grained metrics, the performance spread is 43-49%—a 20% gap between worst and best methods.

**The binary evaluation hides 20 percentage points of real performance difference.**

This isn't measurement noise. It's a fundamental problem: **in complex multi-step tasks with low completion rates, binary metrics conflate "accomplished nothing" with "accomplished most subtasks but failed the last one."**

The paper states: "The evaluation metrics in current benchmarks often lack the granularity needed to accurately reflect the incremental progress of agents. In complex multi-step tasks, even if an agent fails to achieve the ultimate targets, it might successfully accomplish some of the subtasks. It is essential to include these partial successes in evaluation metrics to faithfully capture the capabilities of agents. Reporting only a binary score (success or failure) can lead to misconceptions such as emergent abilities" (Introduction).

This last point is crucial: the "emergent abilities" phenomenon (Wei et al., 2022) may be partly an artifact of crude measurement that jumps from 0% to 100% success as model scale increases, when in reality capabilities grow gradually but sub-100% completion scores as "failure."

## ItineraryBench's Three-Level Evaluation

The paper introduces a hierarchical evaluation system (Section 3.3):

### Level 1: Executability (60 points)
**Question**: Are the individual actions physically possible?

Example checks:
- `go_to_city(Shanghai, Beijing, 07-01 14:40, 07-01 20:30, G2305)`: Does train G2305 actually run from Shanghai to Beijing with those times?
- `visit(Great_Wall, 07-02 08:00, 07-02 12:00)`: Is the Great Wall open 08:00-12:00?
- Sequential consistency: Does person arrive in Beijing before trying to visit Beijing attractions?

**Scoring formula**:
```
s1 = w1 × (A1 / B1)
```
Where A1 = completed checks, B1 = total checks, w1 = 60 points.

This is **partial credit for valid actions**: if an itinerary correctly books 4/5 trains and visits 6/8 attractions, it scores ~(10/13) × 60 ≈ 46 points, not 0.

### Level 2: Constraint Satisfaction (20 points)
**Question**: Does the plan satisfy specified requirements?

Example constraints:
- Budget limit: <5000 RMB
- Stay duration: 2 nights in Beijing
- Visit requirements: must see Great Wall, Forbidden City, Summer Palace
- Activity windows: only 07:00-22:00

**Scoring formula**:
```
s2 = w2 × (A2 / B2)
```
Where A2 = satisfied constraints, B2 = total constraints, w2 = 20 points.

**Critical rule**: "Level 2 evaluation only proceeds after the complete attainment of scores in the lower levels" (Section 3.3). If an itinerary scores <60 in Level 1 (has infeasible actions), Level 2 isn't evaluated—constraint satisfaction is meaningless if the plan is impossible.

### Level 3: Time and Cost Efficiency (20 points)
**Question**: How optimized is the solution?

The paper uses a reference range [a, b] where:
- a = mean - std_dev of valid sample itineraries
- b = mean + std_dev

**Scoring formula**:
```
s3 = w3                           if cost ≤ a
s3 = w3 × (1 - (cost-a)/(b-a))   if a < cost < b
s3 = 0                            if cost ≥ b
```

This rewards efficiency but with diminishing returns: beating the mean by 1 std_dev gives full 20 points, being at the mean gives ~10 points, exceeding mean by 1 std_dev gives 0 points.

**Critical rule**: Level 3 only evaluates if Level 1 = 60 points (full executability) AND Level 2 requirements met. "This approach reinforces the importance of a strong base in practical execution, as advanced optimizations are irrelevant if basic executability is not achieved" (Section 3.3).

## Why This Matters: The Emergent Abilities Illusion

Wei et al. (2022) documented "emergent abilities" where capabilities appear suddenly at certain model scales—graphs show flat zero performance, then a sharp jump to non-zero performance.

The TDAG authors suggest this may be **measurement artifact**: "Reporting only a binary score (success or failure) can lead to misconceptions such as emergent abilities."

Consider this scenario:

**Task**: Book trains for 5-city tour, visit 12 attractions, return home in 10 days.

**Small model behavior**:
- Books 3/5 trains correctly (others have schedule errors)
- Visits 7/12 attractions (others closed when visited)
- Returns 2 days late
- **Binary score: 0% (failure)**
- **Fine-grained score: ~35% (partial completion)**

**Large model behavior**:
- Books 5/5 trains correctly
- Visits 11/12 attractions (one closed due to unexpected holiday)
- Returns on time
- **Binary score: 0% (failure—missed one attraction)**
- **Fine-grained score: ~85% (near-complete)**

**Even larger model behavior**:
- Books 5/5 trains
- Visits 12/12 attractions
- Returns on time
- **Binary score: 100% (success)**
- **Fine-grained score: 100%**

With binary evaluation, you see: 0%, 0%, 100%—an "emergent" jump. With fine-grained evaluation, you see: 35%, 85%, 100%—smooth capability growth.

Figure 3 demonstrates this empirically: binary scoring shows all methods between 27-32% (no significant difference), while fine-grained scoring reveals ReAct=43%, P&S=44%, ADAPT=45%, TDAG=49%—clear stratification invisible to binary metrics.

## Implementation for WinDAGs: Hierarchical Scoring

The three-level structure generalizes to any complex task:

### Level 1: Syntactic/Mechanical Correctness
**What it measures**: Can actions execute without errors?

For code generation:
- Does code parse?
- Do imported libraries exist?
- Are function calls syntactically correct?

For data processing:
- Do input files exist?
- Are data formats valid?
- Do queries run without errors?

**Scoring**: Percentage of actions that execute without runtime errors.

### Level 2: Semantic Correctness
**What it measures**: Do actions achieve their intended local goals?

For code generation:
- Does each function do what its docstring claims?
- Are test cases passing?
- Do components integrate correctly?

For data processing:
- Is the output schema correct?
- Are required fields present?
- Do values satisfy domain constraints?

**Scoring**: Percentage of sub-goals achieved, only evaluated if Level 1 = 100%.

### Level 3: Global Optimality
**What it measures**: How good is the overall solution?

For code generation:
- Performance benchmarks
- Code quality metrics
- Security/maintainability scores

For data processing:
- Processing time
- Resource utilization
- Output quality metrics

**Scoring**: Continuous score relative to reference distribution, only evaluated if Level 1 = 100% and Level 2 requirements met.

## The Reference Distribution Problem

Level 3 scoring requires a reference distribution—what's "good" vs. "acceptable" vs. "poor" efficiency?

The paper's approach (Section 3.3):
1. Generate many candidate solutions (100s)
2. Execute in simulator, filter to valid ones (Level 1 = 100%)
3. Randomly sample 50 valid solutions
4. Compute mean μ and std σ of cost/time
5. Set a = μ - σ, b = μ + σ

This ensures [a, b] reflects "realistic achievable performance" not "theoretical optimum."

**Why not use theoretical optimum?** Example: Traveling Salesman Problem has a globally optimal route. But:
- Finding it may be NP-hard
- Agents have limited computation time
- "Good enough" solutions (within 10% of optimal) are valuable

Scoring against mean ± std_dev measures **how much better than typical** a solution is, which is often more practical than **how close to perfect** it is.

**For WinDAGs**: When adding new task types:
1. Generate initial solutions using baseline methods
2. Execute and measure cost/time/quality metrics
3. Compute statistics from successful runs
4. Use these as reference distributions for Level 3 scoring

**Bootstrap problem**: First runs have no reference. Solution: Use first N successful runs to establish baseline, then evaluate subsequent runs against it. Refine reference distribution periodically.

## Partial Credit Anti-Patterns

Fine-grained evaluation can be misapplied:

### Anti-Pattern 1: Credit for Irrelevant Work
**Example**: Task requires file processing + analysis + reporting. Agent processes file correctly, fails analysis, produces empty report. Scores 33% (1/3 stages).

**Problem**: Processing without analysis is useless—no value delivered.

**Solution**: Use dependencies in scoring. ItineraryBench does this via sequential evaluation: Level 2 only counts if Level 1 = 100%. Extend this: sub-tasks only count if their dependencies succeeded.

### Anti-Pattern 2: Hiding Critical Failures
**Example**: Task requires 10 data transformations. Agent completes 9, fails the last (data export). Scores 90%.

**Problem**: If export is critical and others are preparatory, 90% hides complete failure to deliver.

**Solution**: Weight subtasks by importance. ItineraryBench does this via points allocation: Level 1 (executability) = 60 points, Level 2 (constraints) = 20 points, Level 3 (efficiency) = 20 points. Executability is 3× more important than efficiency.

### Anti-Pattern 3: Rewarding Redundancy
**Example**: Task requires 3 analyses. Agent performs 6 (including the 3 required + 3 unnecessary). Scores 200% (6/3).

**Problem**: Unnecessary work wastes resources.

**Solution**: Cap scores at 100% per category. ItineraryBench's formula `s1 = w1 × (A1/B1)` caps at w1 when A1=B1, doesn't give extra credit for A1>B1.

## Instrumentation Requirements

Fine-grained evaluation requires **observable intermediate states**. The paper uses a simulator (Section 3.3) that validates each action as it executes.

**For WinDAGs**, this means:

### 1. Structured Task Decomposition
Tasks must decompose into checkpointable subtasks. Instead of:
```python
# Black-box function
result = agent.solve_task(task)
```

Use:
```python
# Observable subtasks
subtasks = decompose(task)
results = []
for st in subtasks:
    r = agent.solve_subtask(st)
    results.append(r)
    evaluate_partial_progress(results)  # Incremental scoring
```

### 2. Validation Functions Per Subtask
Each subtask needs a validator that checks correctness without requiring full task completion:

```python
def validate_subtask(subtask: Task, result: Result) -> Score:
    """
    Check if this subtask result is correct in isolation.
    """
    if subtask.type == "train_booking":
        return validate_train_booking(result)
    elif subtask.type == "attraction_visit":
        return validate_attraction_visit(result)
    # etc.
```

ItineraryBench's simulator does this by checking each action against the database: does this train exist? Are these times consistent?

### 3. Dependency Tracking
Know which subtasks depend on which:
```python
class Task:
    subtasks: List[Subtask]
    dependencies: Dict[Subtask, List[Subtask]]  # subtask → prerequisites
```

When subtask S fails, mark all dependent subtasks as unscoreable (don't count as 0, count as N/A).

### 4. Continuous Scoring During Execution
Don't wait until task completion to compute score:

```python
def execute_task(task: Task) -> Tuple[Result, Score]:
    score = Score(level1=0, level2=0, level3=0)
    
    for subtask in task.subtasks:
        result = execute_subtask(subtask)
        
        # Update Level 1 score incrementally
        if is_valid(result):
            score.level1 += weight_of(subtask)
        
        # Update Level 2 if Level 1 is perfect
        if score.level1 == max_level1:
            if satisfies_constraints(result):
                score.level2 += constraint_weight(subtask)
        
        # Update Level 3 if Levels 1&2 are perfect
        if score.level1 == max_level1 and score.level2 == max_level2:
            score.level3 = compute_efficiency(results)
    
    return results, score
```

This provides **real-time progress visibility** rather than waiting until the end.

## Reporting Guidelines

The paper's insight: in low-completion-rate scenarios, binary metrics are uninformative (Figure 3). But even fine-grained metrics can be reported poorly.

**Good reporting includes:**

### 1. Distribution of Completion Levels
Don't just report mean score. Report:
- What % of runs achieve Level 1 = 100%?
- What % achieve Level 2 requirements?
- What % reach Level 3 evaluation?

Example:
```
Method: TDAG
Level 1 (executability): 73% of runs achieve 100%, mean=89%
Level 2 (constraints):   51% of runs evaluated (Level 1=100%), 68% satisfy all
Level 3 (efficiency):    34% of runs evaluated (Levels 1&2=100%), mean efficiency score=14.2/20
```

This reveals the "funnel": 73% get executable plans, but only 51% also satisfy constraints, and only 34% are eligible for efficiency scoring.

### 2. Subtask-Level Breakdowns
Which subtasks are bottlenecks?

```
Train booking: 92% success rate
Hotel booking: 88% success rate
Attraction visits: 67% success rate ← bottleneck
Route planning: 78% success rate
```

Identifies where to focus improvement efforts.

### 3. Failure Mode Analysis
Table 3 in the paper breaks down error types:
- Cascading Task Failure (CTF): 4.35% for TDAG vs 34.78% for P&E
- Commonsense Knowledge Errors (CKE): 18.87% vs 20.94%
- External Information Misalignment (EIM): 19.33% vs 22.14%
- Constraint Non-compliance (CNC): 18.63% vs 21.05%

This granularity reveals *why* methods fail differently: P&E suffers CTF due to static planning; ReAct suffers EIM due to context overload.

### 4. Comparison to Random/Heuristic Baselines
Fine-grained metrics should show:
- Random agent: ~20% Level 1 score (some actions accidentally valid)
- Heuristic agent: ~60% Level 1 score (simple rules work partially)
- LLM agent: 85%+ Level 1 score

If your LLM agent scores near heuristic baseline, fine-grained metrics reveal it's not leveraging LLM capabilities effectively, even if binary metric says "both fail."

## The Psychological Benefit: Maintaining Morale

Anecdotally, the paper's approach has a human benefit: **developers can see progress even when tasks don't fully complete**.

Working on complex agents is demoralizing when every run scores "0% - failed." Fine-grained metrics show:
- Week 1: 25% average (actions are valid but constraints violated)
- Week 2: 45% average (most constraints satisfied, efficiency poor)
- Week 3: 62% average (some runs complete fully, others nearly so)

This visible progress sustains development effort. Binary metrics would show "0%, 0%, 30%" across these same weeks—looks like nothing happened for two weeks, then sudden breakthrough.

**For WinDAGs development**: Use fine-grained metrics internally even if external reporting uses binary metrics. It helps teams understand where they are in capability development.

## Summary: Evaluation as Debugging Tool

The deepest insight: **fine-grained evaluation isn't just about fairness in comparison—it's a debugging tool**.

Binary metrics tell you "it doesn't work." Fine-grained metrics tell you:
- **Where** it doesn't work (which subtasks fail)
- **How badly** it doesn't work (10% complete vs 90% complete)
- **Why** it doesn't work (executability issues vs constraint violations vs inefficiency)

The paper's three levels provide a **diagnostic framework**:
- Level 1 failures → agent doesn't understand action mechanics
- Level 2 failures → agent understands actions but not requirements
- Level 3 suboptimal → agent understands both but doesn't optimize

This guides fixes:
- Level 1 issues → improve tool documentation, provide examples
- Level 2 issues → improve task specification, add constraint checking
- Level 3 issues → add optimization skills to skill library

Treat evaluation not as a final grade but as an ongoing diagnostic that reveals what capabilities are present and which are missing.