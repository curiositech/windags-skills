# Failure Taxonomy for Interactive Agent Systems

## Core Teaching

When intelligent systems fail in interactive environments, they fail in predictable, categorizable ways. The AgentBench evaluation across 29 LLMs and 8 distinct environments reveals a systematic failure taxonomy that goes far beyond "the model gave a wrong answer." Understanding these failure modes is essential for building robust agent orchestration systems, because each failure type indicates a different underlying capability deficit and requires different remediation strategies.

This teaching counters the common assumption that agent failure is monolithic—that models either "work" or "don't work." In reality, failure is structured, and the structure tells you what's broken.

## The Five Failure Modes

AgentBench identifies five distinct termination states for agent interactions:

### 1. Complete (Success or Failure)
The agent followed the interaction protocol through to a natural conclusion, producing a result that can be evaluated for correctness. This is the only category where task performance metrics (accuracy, reward, success rate) are meaningful. Critically, "Complete" does not mean "Correct"—an agent can follow all protocols and still produce wrong answers.

**What this indicates**: The agent possesses basic operational competence. It understands the interaction protocol, formats responses correctly, and reaches a termination condition. Failures here are cognitive (wrong reasoning, insufficient knowledge) rather than operational.

### 2. Context Limit Exceeded (CLE)
The interaction history grows beyond the model's maximum context window. In AgentBench, this primarily affected text-davinci models with 2,048-token limits, occurring in 3.0% of commercial API interactions but 0% for modern models with larger contexts.

**What this indicates**: The environment's information density exceeds the agent's memory capacity. This is fundamentally an architectural limitation, not a reasoning failure. For agent systems, this reveals tasks that require either context summarization, external memory systems, or hierarchical decomposition.

**Design implication for WinDAGs**: Long-running agent workflows must implement memory management strategies—periodic summarization, hierarchical state representation, or delegation to specialized sub-agents that operate on compressed state representations.

### 3. Invalid Format (IF)
The agent produces output that doesn't match the specified format, making it unparseable by the environment. This occurred in 6.0% of commercial API cases but 10.4% of open-source model cases.

**Example from Database task**: Despite explicit instructions to format SQL as:
```
Action: Operation
'''sql
SELECT * FROM table WHERE condition;
'''
```

GPT-4 sometimes produces:
```
The syntax for the UPDATE statement is as follows:
'''sql
UPDATE table_name SET column1 = value1...
'''
```

The "Action: Operation" label is missing, making the output unparseable.

**What this indicates**: The model fails to maintain operational discipline under the pressure of task complexity. Even when format specifications are in the prompt, models revert to "natural" explanation patterns learned during training. This is particularly common with complex reasoning—the cognitive load of solving the problem overwhelms format adherence.

**Critical insight**: Format adherence is not a linguistic capability but an executive function capability. Models must simultaneously (1) solve the problem cognitively and (2) maintain awareness of output constraints. The latter is a form of meta-cognitive monitoring that many models lack.

**Design implication for WinDAGs**: Skills that invoke LLM agents should implement format validation layers with retry logic. When format violations occur, the system should extract the semantic intent and reformat it, rather than treating the entire response as failed. This separates the cognitive output (which may be correct) from the formatting output (which may be wrong).

### 4. Invalid Action (IA)
The agent produces correctly formatted output, but the action itself is invalid—it references non-existent entities, violates action space constraints, or has malformed parameters. This occurred in 4.6% of commercial API cases and 13.6% of open-source cases.

**Examples**:
- In House Holding: Attempting to "take soapbar 1 from cabinet 5" when only cabinets 1-4 exist
- In Web Browsing: Clicking element ID "B000VOHH99I" when available IDs are "B000VOHH8I", etc.
- In Digital Card Game: Selecting a dead fish as the action target

**What this indicates**: The model fails to track environment state accurately. It either (1) doesn't parse observations carefully enough to extract valid action spaces, (2) doesn't maintain memory of state constraints across rounds, or (3) generates actions from language priors rather than environment affordances.

**The grounding problem**: Models trained on text corpora learn action-language associations ("take X from Y" is a common pattern) but struggle to ground those patterns in the specific entities present in the current state. They generate plausible-sounding actions rather than environmentally-valid actions.

**Design implication for WinDAGs**: Agent skills should separate action *generation* from action *validation*. After an LLM proposes an action, a deterministic validation layer checks it against the current action space. If invalid, the system can either (1) request a retry with explicit constraint listing, (2) find the nearest valid action (e.g., via BLEU similarity to valid options, as AgentBench does for ALFWorld), or (3) prompt for clarification of intent.

### 5. Task Limit Exceeded (TLE)
The agent exhausts the maximum allowed interaction rounds without completing the task. This is the most common failure mode, occurring in 24.9% of commercial API cases and 36.9% of open-source cases.

**The repetition signature**: Analysis of TLE trajectories reveals that 90%+ contain pairs of responses with Rouge-L similarity ≥0.8 within the last 10 rounds. The agent is trapped in a loop, cycling through the same actions repeatedly:

```
Round 15: go to cabinet 1
Round 16: open cabinet 1  
Round 17: close cabinet 1
Round 18: examine cabinet 1
Round 19: go to cabinet 1  [repeating]
Round 20: open cabinet 1   [repeating]
```

**What this indicates**: TLE reveals three interrelated failures:

1. **Lack of progress monitoring**: The agent doesn't recognize that repeated actions are failing to advance toward the goal. It lacks metacognitive awareness of its own trajectory.

2. **Absence of strategy switching**: When a approach fails, the agent doesn't generate alternative strategies. It's stuck in a local minimum of its action space.

3. **Poor long-term planning**: The agent operates reactively (responding to immediate observations) rather than proactively (following a coherent multi-step plan). Without an explicit plan representation, there's no basis for detecting plan failure.

**The median task uses 6 rounds and 1,850 tokens**: Analysis of successfully completed trajectories shows that most tasks require relatively few interactions (median 6 rounds, interquartile range 4-9). This means TLE cases are doing 3-4x more work than necessary, indicating profound inefficiency in exploration strategy.

## Comparative Failure Rates: What They Reveal About Model Classes

| Failure Type | Commercial APIs | Open-Source (<70B) |
|--------------|-----------------|---------------------|
| Complete | 61.5% | 39.1% |
| CLE | 3.0% | 0.0% |
| Invalid Format | 6.0% | 10.4% |
| Invalid Action | 4.6% | 13.6% |
| TLE | 24.9% | 36.9% |

**The gap is operational, not just cognitive**: Open-source models fail more often at operational tasks (IF: +4.4%, IA: +9.0%, TLE: +12.0%) than at task completion itself. This suggests the primary deficit is not reasoning ability but executive control—the ability to maintain protocol adherence, track state accurately, and avoid repetitive loops.

**Instruction following is the bottleneck**: The combined IF + IA rate (16.4% for commercial, 24.0% for open-source) indicates that roughly 1 in 4 open-source interactions fail purely due to protocol violations, before reasoning quality even becomes relevant.

## Implications for Agent System Design

### 1. Failure Detection Must Be Multimodal
Don't just check if the task succeeded. Classify *how* it failed. Each failure mode requires different recovery strategies:
- **IF → Format repair**: Extract semantic intent, reformat, retry
- **IA → Constraint enforcement**: Validate against action space, prompt with valid options
- **TLE → Strategy intervention**: Detect loops, force strategy switch, or escalate to supervisor agent

### 2. Build Operational Guardrails, Not Just Cognitive Prompts
Prompts alone don't prevent operational failures. Even GPT-4 violates format specifications. Systems need:
- **Pre-execution validation**: Check format and action validity before executing
- **Loop detection**: Track state history, flag repetition early (don't wait for max rounds)
- **Graceful degradation**: When agents fail operationally, extract partial progress and re-route

### 3. Separate Cognitive and Operational Competence in Routing
When selecting which agent/model to use for a task, consider:
- **Cognitive requirements**: Does this need strategic reasoning (card game) or procedural execution (web shopping)?
- **Operational requirements**: Can this model maintain format discipline under complexity? Does it track state accurately?

A model might be cognitively capable but operationally unreliable, making it unsuitable for long autonomous workflows but fine for supervised single-step tasks.

### 4. TLE as a Red Flag for Decomposition
If a task consistently hits TLE across multiple models, it's probably too complex for monolithic agent execution. The task should be decomposed into:
- Explicit planning phase (generate multi-step plan)
- Execution phase (follow plan step-by-step)
- Monitoring phase (detect plan failures, trigger replanning)

### 5. The "Completed but Wrong" Category Requires Different Analysis
Many failures in AgentBench occur *after* operational success—the agent completes the protocol but produces wrong answers. These cognitive failures require analysis of:
- Knowledge gaps (does the model lack domain information?)
- Reasoning errors (does the model make logical mistakes?)
- Grounding failures (does the model misinterpret observations?)

This is a separate problem space from operational failures.

## When This Taxonomy Doesn't Apply

This failure taxonomy is specific to **multi-turn interactive tasks with defined protocols**. It doesn't apply to:
- **Single-turn generation tasks**: No interaction protocol to violate
- **Open-ended creative tasks**: No "invalid action" when action space is unrestricted
- **Human-in-the-loop workflows**: Human can interpret and repair malformed outputs

The taxonomy is most valuable for **autonomous agent systems operating in structured environments**—exactly the domain WinDAGs targets.

## Connection to Skill Design

When designing skills for WinDAGs:

1. **Define explicit failure modes in skill specifications**: Don't just return success/failure. Return structured failure information (CLE, IF, IA, TLE) so orchestrator can respond appropriately.

2. **Implement per-failure-type recovery strategies**: Each skill should handle predictable failure modes locally before escalating.

3. **Track failure patterns across skill invocations**: If a particular model consistently fails with IF on a particular skill, route that skill to a more operationally reliable model.

4. **Design skills to be loop-resistant**: For skills that involve exploration or search, implement explicit loop detection and forced diversification of action selection.

The lesson from AgentBench: **Failure is not random. It has structure. Exploit that structure.**