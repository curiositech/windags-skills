# Task Limit Exceeded: The Planning Collapse That Kills Agent Systems

## The Dominant Failure Mode

In AgentBench's evaluation across 29 LLMs and 8 environments, Task Limit Exceeded (TLE) is the most common failure type:
- **24.9%** of commercial API-based model interactions
- **36.9%** of open-source model interactions

This means roughly **1 in 3 agent tasks** fail not because the model gave a wrong answer, not because it violated protocol, but because it exhausted the maximum allowed interaction rounds without making progress. The agent didn't fail—it got stuck.

## The Repetition Signature

Analysis of TLE trajectories reveals a striking pattern: **Over 90% of TLE cases contain pairs of responses with Rouge-L similarity ≥0.8 within the last 10 rounds.** The agent is cycling through nearly identical actions repeatedly.

A typical TLE trajectory from the House Holding environment (gpt-3.5-turbo):

```
Round 12: go to cabinet 1
Round 13: open cabinet 1
Round 14: [observes: cloth 1 inside]
Round 15: close cabinet 1
Round 16: examine cabinet 1
Round 17: go to cabinet 1      [repeat begins]
Round 18: open cabinet 1       [repeat]
Round 19: [observes: cloth 1]  [repeat]
Round 20: close cabinet 1      [repeat]
Round 21: examine cabinet 1    [repeat]
Round 22: go to cabinet 1      [cycle continues]
Round 23: open cabinet 1
...
[Continues until round limit]
```

The model is trapped in a 5-round loop: go → open → observe → close → examine. It never breaks free. The task fails not from a single error but from the inability to recognize the loop and try something different.

## What TLE Reveals About Agent Cognition

TLE is not a simple failure—it's a catastrophic collapse of the agent's planning capability. It indicates three interrelated deficits:

### 1. Lack of Progress Monitoring

Successful task completion requires tracking: *Am I getting closer to my goal?* Agents in TLE have lost this monitoring capability. They execute actions without evaluating whether those actions advance the task.

**Evidence**: In the example above, the model checks cabinet 1 repeatedly but never realizes that:
- It has already checked cabinet 1 (memory failure)
- Cabinet 1 doesn't contain the target object (inference failure)
- Repeated checking won't change the cabinet's contents (world model failure)

**Contrast with successful agents**: GPT-4's successful trajectory on the same task shows explicit progress tracking:

```
Round 3: [after checking cabinet 1] "There's no soapbar in cabinet 1. 
         I'll check the other cabinets."
Round 6: [after checking all cabinets] "There's no soapbar in any cabinets. 
         I'll check the sinkbasins next."
Round 9: [after checking sinkbasins] "Still no soapbar. The last place 
         to check is the toilet."
```

Each round includes a meta-cognitive assessment: what have I learned, where should I go next? This prevents loops—the model won't re-check cabinet 1 because it explicitly noted that cabinet 1 was already explored.

### 2. Absence of Strategy Switching

When an approach fails, effective agents switch strategies. TLE agents don't—they perseverate on the same failed approach indefinitely.

**The local minimum problem**: The agent has a strategy (check cabinets), and that strategy is *locally coherent* (cabinets often contain objects). But the strategy is *globally ineffective* (the object isn't in any cabinet). Without strategy switching, the agent is trapped in a local minimum of the action space.

**Evidence from AgentBench statistics**: Successfully completed tasks have a median of 6 rounds and mean of 7.95 rounds. TLE tasks have a mean of 25.5 rounds—roughly 3× longer. The TLE agent is doing far more work for no progress, suggesting it's exploring the same dead-end strategies repeatedly rather than switching to new approaches.

### 3. Poor Long-Term Planning

TLE reveals that many agents operate *reactively* (respond to immediate observation) rather than *proactively* (execute a coherent multi-step plan).

**Reactive vs. Proactive**:
- **Reactive**: "I see a cabinet. I'll open it. I see it's empty. I'll close it. I'll open it again to check."
- **Proactive**: "My plan is: (1) Check all cabinets, (2) Check sinkbasins, (3) Check toilet. I'll execute this plan systematically and only revise if I find new information."

TLE agents lack explicit plan representations. Without a plan, there's no basis for:
- Detecting that the plan has failed (no progress monitoring)
- Deciding to abandon the plan (no strategy switching)
- Remembering what has already been tried (no action history tracking)

## Why Loops Form: The Attention-Memory Problem

The technical cause of loops is an **attention-memory mismatch**: The agent's attention focuses on the immediate observation, causing it to forget previous actions that led to the same observation.

**The cycle of forgetting**:
1. Agent checks cabinet 1 → observes "cloth 1"
2. Agent decides cabinet 1 doesn't have target object
3. Many rounds pass (checking other locations)
4. Agent's attention shifts to recent context (last few observations)
5. Earlier memory (already checked cabinet 1) fades in attention weight
6. Agent "notices" cabinet 1 again, doesn't remember checking it
7. Agent checks cabinet 1 again → observes "cloth 1" → loop

**Why 10-round cycles?**: Analysis shows loops typically span 5-10 actions. This corresponds roughly to the recency window in transformer attention—recent tokens dominate attention, distant tokens fade. After ~10 rounds, the memory of "I already tried this" is sufficiently distant that it doesn't inhibit retrying.

## The Statistics of Successful Completion

Understanding what *doesn't* lead to TLE is instructive. Analysis of successfully completed AgentBench tasks:

**Distribution of rounds to completion**:
- Median: 6 rounds
- Mean: 7.95 rounds
- Interquartile range: 4-9 rounds
- 75th percentile: 9 rounds

**Distribution of tokens to completion**:
- Median: 1,850 tokens
- Mean: 2,220 tokens
- Interquartile range: 761-2,709 tokens
- 75th percentile: 2,709 tokens

**Key insight**: Most tasks are completable in <10 rounds and <3,000 tokens. Tasks that exceed 15 rounds or 5,000 tokens are almost certainly stuck in unproductive loops, not making genuine progress.

This gives us quantitative thresholds for early intervention: If an agent exceeds 15 rounds or 5,000 tokens without completion, it's statistically likely to be in TLE trajectory. Intervening at this point (rather than waiting for max rounds) can save computation and enable recovery strategies.

## Implications for Agent System Design

### 1. Implement Loop Detection as Infrastructure

Don't wait until max rounds to detect TLE. Implement real-time loop detection:

```python
def detect_loop(action_history, window=10, threshold=0.8):
    """
    Detect if agent is in a repetitive loop
    
    Args:
        action_history: List of (thought, action) tuples
        window: Number of recent rounds to check
        threshold: Rouge-L similarity threshold for loop detection
    
    Returns:
        True if loop detected, False otherwise
    """
    if len(action_history) < window:
        return False
    
    recent_actions = action_history[-window:]
    
    # Check all pairs in recent window
    for i in range(len(recent_actions)):
        for j in range(i+1, len(recent_actions)):
            similarity = rouge_l(recent_actions[i], recent_actions[j])
            if similarity >= threshold:
                return True  # Loop detected
    
    return False
```

**When loop is detected**, trigger intervention:
- Force strategy switch: "Your recent actions are repetitive. Try a completely different approach."
- Provide state summary: "You have already checked: cabinet 1, cabinet 2, ..."
- Escalate to supervisor: "Agent stuck in loop. Requesting supervisor guidance."

### 2. Force Explicit Progress Tracking

Prompt agents to track progress explicitly in each round:

```
After each action, assess your progress:
1. What did I just learn?
2. What locations/options have I already explored?
3. Am I closer to the goal than before?
4. If no progress in last 3 rounds, what new strategy should I try?
```

This forces the agent to:
- Maintain a memory trace (what have I tried?)
- Evaluate effectiveness (did it work?)
- Recognize stagnation (no progress)
- Trigger strategy switches (try something new)

**Evidence from AgentBench**: GPT-4's successful trajectories almost always include explicit progress assessment statements. GPT-3.5-turbo's failed trajectories rarely do. The presence of explicit progress tracking is a strong predictor of success.

### 3. Separate Planning from Execution

TLE occurs when agents conflate planning and execution—they generate next actions reactively without a coherent plan. Separating planning from execution prevents this:

**Planning phase**:
```
Given your task and current state, generate a complete plan:
1. [First step]
2. [Second step]
3. [Third step]
...

Do not execute anything yet. Just plan.
```

**Execution phase**:
```
Your plan is:
1. [First step]
2. [Second step]
...

Execute step 1. After execution, check:
- Did it succeed? If yes, proceed to step 2.
- Did it fail? If yes, revise the plan.
```

This creates two advantages:
- **Plan serves as memory**: The agent can reference the plan to avoid repeating steps
- **Plan failure is detectable**: If executing the plan doesn't make progress, the plan itself is wrong and needs revision

**Limitation**: This doubles the number of LLM calls (one for planning, one per execution step). For time/cost-sensitive applications, this may be prohibitive. The trade-off is between robustness (less likely to loop) and efficiency (more LLM calls).

### 4. Implement Strategy Diversity Requirements

When an approach fails repeatedly, force the agent to try diverse alternatives:

```python
def generate_next_action(agent, state, action_history, diversity_threshold=3):
    """
    Generate next action with enforced diversity
    """
    # Check if recent actions are too similar
    recent_actions = action_history[-diversity_threshold:]
    
    while True:
        proposed_action = agent.generate_action(state)
        
        # Check similarity to recent actions
        is_diverse = all(
            rouge_l(proposed_action, past_action) < 0.5 
            for past_action in recent_actions
        )
        
        if is_diverse:
            return proposed_action
        else:
            # Reject and request diverse alternative
            agent.add_feedback(
                "Your proposed action is too similar to recent actions. "
                "Propose something completely different."
            )
```

This prevents the agent from proposing "go to cabinet 1" when it just checked cabinet 1 in the previous 3 rounds.

**Trade-off**: Enforced diversity can prevent useful action repetition (sometimes you *should* retry an action with different parameters). The threshold needs tuning per task type.

### 5. Use Early Stopping Based on Statistical Thresholds

Since successful tasks complete in median 6 rounds (75th percentile: 9 rounds), implement early stopping:

```python
def should_terminate_early(agent, round_number, task_type):
    """
    Determine if agent should be terminated early based on statistical norms
    """
    # Get task-specific completion statistics
    median_rounds = get_median_rounds(task_type)  # e.g., 6
    percentile_90_rounds = get_90th_percentile_rounds(task_type)  # e.g., 12
    
    if round_number > percentile_90_rounds:
        # Agent is taking much longer than 90% of successful completions
        # Likely stuck in loop
        return True
    
    return False
```

**When early termination triggers**:
- Log the partial trajectory for debugging
- Attempt recovery strategies (force strategy switch, escalate to supervisor)
- If recovery fails, fail fast rather than exhausting max rounds

This saves computation—rather than running 50 rounds to TLE, terminate at 15 rounds and move on.

### 6. Learn Task-Specific Round Budgets

Different tasks have different complexity. AgentBench tasks range from:
- Operating System: ~8 rounds average
- Knowledge Graph: ~15 rounds average
- Lateral Thinking Puzzles: ~25 rounds average

Set round limits adaptively based on task type:

```python
round_limits = {
    "os": 15,           # 2× median completion time
    "database": 12,
    "knowledge_graph": 30,
    "card_game": 40,
    ...
}
```

This prevents premature termination on genuinely complex tasks while catching loops quickly on simpler tasks.

## When TLE Is Not a Bug, But a Signal

Sometimes TLE indicates the task is *too complex* for monolithic agent execution. If TLE occurs consistently across multiple capable models, the problem may not be the agent but the task decomposition.

**Signs the task needs decomposition**:
- TLE rate >50% across models
- Successful completions take >20 rounds
- Task requires multiple distinct sub-goals (exploration + reasoning + execution)

**Response**: Decompose into subtasks:
- Subtask 1: Explore environment, build state representation
- Subtask 2: Reason about state, identify solution
- Subtask 3: Execute solution

Each subtask is simpler, less likely to loop, and failures are more debuggable.

## The GPT-4 vs. GPT-3.5 Contrast: What Persistence Looks Like

AgentBench includes a case study where GPT-4 and GPT-3.5-turbo are given the identical House Holding task. 

**GPT-3.5-turbo**: Enters loop at round 12, repeatedly checking cabinet 1. TLE at round 25.

**GPT-4**: Systematically checks all cabinets (rounds 1-8), then sinkbasins (rounds 9-10), then toilet (round 11). Finds no soapbar in any location. Then—critically—**realizes it missed a location**: "I should check the countertop" (round 12). Finds soapbar on countertop, completes task (round 15).

**The difference**: GPT-4 demonstrated:
1. **Systematic exploration** (didn't re-check locations)
2. **Completeness checking** (realized it hadn't checked countertop)
3. **Self-correction** (revised assumption that soapbar must come from elsewhere)

This isn't just "smarter"—it's a qualitatively different cognitive process. GPT-4 maintains a mental model of the search space, detects incompleteness, and self-corrects. GPT-3.5-turbo has none of these capabilities, leading to loops.

## Summary: TLE as a Metacognitive Failure

Task Limit Exceeded is the most common agent failure mode, and it reflects a fundamental metacognitive deficit: **the inability to monitor one's own progress, recognize stagnation, and switch strategies.**

For agent orchestration systems:
1. **Implement loop detection** early, don't wait for max rounds
2. **Force explicit progress tracking** in prompts
3. **Separate planning from execution** to make plan failures observable
4. **Enforce strategy diversity** when approaches fail repeatedly
5. **Use early stopping** based on statistical completion norms
6. **Decompose tasks** that consistently cause TLE across models

TLE is not just a timeout—it's a red flag that the agent has lost coherence. Systems that detect and respond to TLE proactively will be far more robust than systems that simply set high round limits and hope for the best.