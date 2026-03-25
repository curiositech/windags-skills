# The Gap Between Planning and Execution: When Agents Know What to Do But Can't Do It

## The Planning-Execution Paradox

One of the most striking findings in AgentBench is the disconnect between what models *say* they will do and what they *actually* do. Models frequently articulate correct plans in their "thought" sections but then execute actions that violate those plans. This isn't occasional noise—it's a systematic pattern revealing a fundamental gap in agent cognition.

Consider this example from the House Holding environment (GPT-3.5-turbo):

```
Round 1:
THOUGHT: "To complete the task, I need to find a clean soapbar and place 
         it on the countertop. I should start by searching for a clean 
         soapbar in the available locations."
ACTION: go to cabinet 1

[... many rounds later ...]

Round 12:
THOUGHT: "I didn't find a clean soapbar in cabinet 1, but I did find a 
         cloth. I should keep searching for a clean soapbar in other 
         locations."
ACTION: close cabinet 1

Round 13:
THOUGHT: "Since I didn't find a clean soapbar in cabinet 1, I should try 
         examining other locations. Let's examine cabinet 2 to see if 
         there is a clean soapbar there."
ACTION: examine cabinet 1   [violates the stated plan!]

Round 14:
THOUGHT: "I apologize for the confusion. Let's try examining cabinet 1 
         again since it was previously closed."
ACTION: examine cabinet 1   [still examining cabinet 1, not cabinet 2]
```

The model *says* it will examine cabinet 2, but *actually* examines cabinet 1 repeatedly. The thought process is coherent, but execution doesn't follow the thought. This is the planning-execution gap.

## What the Gap Reveals

### 1. Thoughts Are Not Commitments

In Chain-of-Thought (CoT) prompting, models generate reasoning text before action selection. We often treat this as "the model's plan," but AgentBench reveals that thoughts are more like *post-hoc rationalizations* than binding commitments.

**Why thoughts diverge from actions**:

**Separate token generation streams**: The thought is one generation context, the action is another. The model generates thought tokens conditioning on the task, then generates action tokens conditioning on the thought. But the attention mechanism doesn't enforce consistency—the action generation can drift from the thought without penalty.

**Competing objectives during generation**: When generating the action, the model faces multiple pressures:
- *Linguistic coherence*: The action should "make sense" given recent observations
- *Thought consistency*: The action should match the stated thought
- *Action space constraints*: The action must be valid in the environment

Under cognitive load, linguistic coherence often wins. The model generates an action that "sounds right" given recent text, even if it contradicts the stated plan.

**Evidence from AgentBench**: Cases where models explicitly state "I will do X" but then do Y correlate with high cognitive load situations (many rounds, complex state, ambiguous observations). Simple tasks show high thought-action consistency. Complex tasks show increasing divergence.

### 2. Models Don't Detect Their Own Inconsistencies

Even more striking: Models rarely recognize when they've violated their own plans. In the example above, GPT-3.5-turbo states it will examine cabinet 2, examines cabinet 1, receives feedback confirming it examined cabinet 1, and then... apologizes for "confusion" without correcting the error.

This suggests models lack **self-monitoring**—the ability to compare intended actions against executed actions and detect mismatches.

**Why self-monitoring is hard for LLMs**:

**No execution trace representation**: Humans maintain an explicit memory of "what I planned to do vs. what I did." LLMs don't have a comparable structure. The plan exists as generated text tokens, the action exists as other generated tokens, but there's no mechanism comparing them.

**Attention doesn't implement consistency checking**: Attention weights determine which previous tokens influence current token generation. But attention is soft and distributed—it doesn't implement hard constraints like "action MUST match stated thought."

**Training doesn't penalize plan-execution mismatch**: RLHF and instruction tuning optimize for task success, not plan consistency. A model that says "I'll check cabinet 2" but checks cabinet 1 and gets a good result isn't penalized, so the behavior persists.

### 3. The Execution Context Can Override Planning Context

AgentBench's multi-round interaction reveals that execution context (recent observations, immediate action space) often dominates over planning context (earlier thoughts, long-term goals).

**The recency bias in action generation**:

Models are transformer-based, and attention weights decay with distance. When generating an action:
- Recent observations have high attention weight
- Earlier thoughts have lower attention weight
- Distant task instructions have very low attention weight

This creates a bias toward **reactive** behavior (respond to what I just saw) over **proactive** behavior (execute my plan regardless of recent observations).

**Example from House Holding**: The model plans "search all cabinets systematically," but after seeing "cabinet 1 is closed," the immediate observation triggers "open cabinet 1 again" rather than moving to cabinet 2 as planned. The recent observation of "closed cabinet" dominates the earlier plan of "move to cabinet 2."

## Implications for Agent System Design

### 1. Don't Assume Thoughts Predict Actions

Many agent frameworks parse the "thought" section to understand the agent's intentions. AgentBench shows this is unreliable—thoughts predict actions at best probabilistically, not deterministically.

**Design principle**: Treat thoughts as **partial evidence** of intent, not ground truth. When making decisions about agent behavior (should I interrupt? should I provide hints?), weight actual actions more heavily than stated thoughts.

### 2. Implement Explicit Plan Representations

If plans live only in generated text, they're not enforceable. To bridge the gap, separate planning from execution:

**Planning phase** (explicit plan structure):
```json
{
  "goal": "Find and place clean soapbar on countertop",
  "steps": [
    {"action": "search_all_cabinets", "locations": ["cabinet_1", "cabinet_2", "cabinet_3"]},
    {"action": "search_sinkbasins", "locations": ["sinkbasin_1", "sinkbasin_2"]},
    {"action": "clean_soapbar", "tool": "sinkbasin"},
    {"action": "place_soapbar", "target": "countertop"}
  ],
  "current_step": 0
}
```

**Execution phase** (enforce plan):
```python
def execute_step(plan, environment):
    current_step = plan["steps"][plan["current_step"]]
    
    # Generate action constrained by plan
    action = agent.generate_action(
        context=environment.observe(),
        constraint=f"You must execute: {current_step['action']}"
    )
    
    # Verify action matches plan
    if not matches_step(action, current_step):
        return retry_with_plan_reminder(action, current_step)
    
    # Execute
    result = environment.execute(action)
    
    # Update plan state
    if result.success:
        plan["current_step"] += 1
    else:
        # Plan failed, trigger replanning
        plan = replan(plan, result)
    
    return result
```

This makes plans **first-class data structures** rather than emergent properties of text generation. The system can:
- Detect plan-execution mismatch programmatically
- Force actions to align with plans
- Detect plan failures and trigger replanning

**Trade-off**: This requires structured planning, which not all LLMs do well. It also increases latency (separate planning call + execution calls). But for long-running, high-stakes tasks, the consistency gain is worth it.

### 3. Implement Plan-Execution Monitoring

Even without explicit plan structures, you can detect inconsistencies:

```python
def monitor_plan_execution(thoughts, action, action_history):
    """
    Detect when action violates stated plan
    """
    # Extract plan commitment from thought
    # e.g., "I should examine cabinet 2" → planned_action = "examine cabinet 2"
    planned_action = extract_commitment(thoughts)
    
    if planned_action is None:
        return None  # No explicit plan stated
    
    # Check if action matches plan
    if not matches(action, planned_action):
        # Inconsistency detected
        return {
            "warning": "Action does not match stated plan",
            "planned": planned_action,
            "executed": action,
            "suggestion": "Revise plan or execute stated action"
        }
    
    return None  # Consistent
```

**When inconsistency detected**:
- Log it for analysis (helps identify systematic failures)
- Optionally interrupt agent: "You said you'd do X, but you're doing Y. Confirm this is intentional."
- Use as signal for agent reliability scoring

### 4. Design Tasks to Test Plan-Execution Consistency

When evaluating new models, don't just test final task success. Test whether the model:
- States plans explicitly
- Executes stated plans
- Detects when plans fail
- Revises plans appropriately

**Evaluation metrics**:
- **Plan adherence rate**: % of actions that match previously stated plans
- **Self-correction rate**: % of times model detects and corrects its own plan violations
- **Plan revision rate**: % of times model abandons failed plans and tries new strategies

These metrics capture operational reliability distinct from cognitive capability.

### 5. Prompt for Explicit Pre-Commitment

Force models to commit to specific actions before generating them:

```
After stating your thought, explicitly commit to the next action:
THOUGHT: [your reasoning]
PLAN: [specific action you will take]
ACTION: [execute the action from PLAN]

The ACTION must match the PLAN exactly.
```

This makes the plan-action relationship explicit and linguistically local (PLAN and ACTION are adjacent), reducing the chance of divergence.

**Why this helps**: It creates a two-step generation process where the model must first generate a specific commitment, then immediately execute that commitment. The adjacency increases attention weight from PLAN to ACTION, reducing drift.

### 6. Post-Execution Verification

After action execution, prompt the model to verify consistency:

```
You planned to: [extracted plan]
You actually did: [executed action]

Are these consistent? If not, explain the discrepancy and decide:
1. Was the original plan wrong? (Revise plan)
2. Was the execution wrong? (Retry with correct action)
3. Did new information justify changing course? (Update plan)
```

This forces the model into a self-monitoring loop, potentially detecting inconsistencies that were invisible during action generation.

## The GPT-4 Advantage: Sustained Coherence

GPT-4's success on AgentBench correlates strongly with plan-execution consistency. Analysis of its successful House Holding trajectories shows:

**Explicit plan articulation**:
```
Round 1: "My plan is: (1) Check all cabinets, (2) Check sinkbasins, 
         (3) Check toilet. I'll execute this systematically."
```

**Step-by-step execution**:
```
Round 2: "Executing step 1: Check all cabinets. Starting with cabinet 1."
Round 3: "Cabinet 1 done. Moving to cabinet 2."
Round 4: "Cabinet 2 done. Moving to cabinet 3."
...
```

**Progress tracking**:
```
Round 8: "Completed step 1 (all cabinets checked, no soapbar found). 
         Moving to step 2: Check sinkbasins."
```

**Plan revision when needed**:
```
Round 11: "Completed all planned steps, but no soapbar found. I must have 
          missed a location. Let me check the countertop, which I didn't 
          include in my original plan."
```

This shows GPT-4 maintains:
- Explicit plan representation (verbalized clearly)
- Execution discipline (follows plan step by step)
- Progress awareness (tracks completion status)
- Replanning capability (revises when plan fails)

These are not emergent—they're explicitly demonstrated in the generated text. GPT-4 has internalized a planning-execution-monitoring loop that lesser models lack.

## When Planning Helps vs. When It Doesn't

Not all tasks benefit from explicit planning. AgentBench reveals:

**Planning helps when**:
- Task requires multiple steps (median successful task: 6 rounds)
- Steps have dependencies (must do X before Y)
- Failure modes are loops/repetition
- State is complex (many locations, entities, options)

**Planning less critical when**:
- Task is single-step or very short (1-3 rounds)
- Actions are independent (order doesn't matter)
- State is simple (few entities)
- Feedback is immediate and clear (error messages guide next step)

**Example: Database vs. House Holding**:
- **Database**: Often single-step (generate SQL query, execute, done). Planning overhead may not be worth it.
- **House Holding**: Median 7+ rounds, requires systematic exploration. Planning essential to avoid loops.

**Design principle**: Use explicit planning infrastructure for long, complex tasks. For short, reactive tasks, simple prompting suffices.

## The Open Problem: Multi-Step Verification

One gap AgentBench exposes: We don't have good ways to verify multi-step plans before execution. 

**The problem**: Agent generates a 10-step plan. Steps 1-5 execute successfully. Step 6 fails because the plan's assumptions were wrong. Now steps 7-10 are invalid, but the agent doesn't know this until it tries them.

**What we need**: Plan verification systems that:
- Check plan assumptions against current state
- Detect steps that depend on failed previous steps
- Invalidate downstream steps when upstream steps fail
- Trigger replanning proactively, not reactively

This requires:
1. Formal plan representations (not just text)
2. Dependency tracking between steps
3. State models that predict action outcomes
4. Verification logic that checks plan validity

This is an open research problem. AgentBench shows the pain points but doesn't provide solutions.

## Summary: Bridging the Gap

The planning-execution gap is one of the fundamental challenges in LLM agents. Models can articulate what they should do but struggle to reliably do it. This creates brittleness—agents fail not from cognitive limitations but from operational inconsistencies.

**For agent orchestration systems like WinDAGs**:

1. **Don't trust thoughts alone**—monitor actual actions
2. **Make plans explicit structures**, not just text
3. **Implement plan-execution verification** to detect violations
4. **Prompt for pre-commitment** to reduce divergence
5. **Post-execution verification** to enable self-correction
6. **Select models based on plan-execution consistency**, not just capability

The lesson: **Knowing what to do and doing it are separate capabilities.** A model can be cognitively strong (good plans) but operationally weak (inconsistent execution). Agent systems must treat plan-execution consistency as a first-class design concern, not an afterthought.