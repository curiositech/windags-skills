## BOOK IDENTITY
**Title**: AgentBench: Evaluating LLMs as Agents
**Author**: Xiao Liu, Hao Yu, Hanchen Zhang, et al. (Tsinghua University, The Ohio State University, UC Berkeley)
**Core Question**: How can we systematically evaluate Large Language Models' ability to act as autonomous agents in complex, interactive environments, and what distinguishes successful agent behavior from failure?
**Irreplaceable Contribution**: This paper provides the first comprehensive, multi-dimensional benchmark for evaluating LLMs as agents across diverse real-world environments. Unlike previous work that focuses on narrow domains or single metrics, AgentBench reveals the critical gap between static language understanding and dynamic decision-making under uncertainty. It exposes the specific failure modes (invalid format, invalid action, task limit exceeded) that prevent even powerful LLMs from functioning as practical agents, and demonstrates that success requires instruction following, long-term reasoning, and decision-making abilities that transcend mere linguistic competence.

## KEY IDEAS (3-5 sentences each)

1. **Agent Capability is Multidimensional and Environment-Dependent**: LLM performance as agents cannot be assessed through a single task or metric. The benchmark's eight distinct environments (OS, Database, Knowledge Graph, Digital Card Game, Lateral Thinking Puzzles, House Holding, Web Shopping, Web Browsing) reveal that agent competence requires code generation, strategic reasoning, commonsense grounding, and web navigation—capabilities that don't correlate perfectly. A model may excel at procedural web shopping while failing at strategic card games, indicating that "agent capability" is not a unified construct but a constellation of context-dependent skills.

2. **The Instruction Following Bottleneck**: A primary failure mode across environments is invalid format (10.4% for open-source models vs 6.0% for commercial APIs) and invalid action (13.6% vs 4.6%), revealing that models struggle to consistently follow precise operational specifications even when explicitly instructed. This suggests that the gap between understanding instructions linguistically and executing them operationally is substantial—models may "comprehend" what's required but fail to produce outputs that satisfy the formal constraints of interactive systems.

3. **Task Limit Exceeded as a Reasoning Failure**: The predominant cause of task failure is "Task Limit Exceeded" (TLE), where agents enter repetitive loops or fail to make progress within allowed rounds. Analysis reveals that 90%+ of TLE cases involve high Rouge-L similarity (≥0.8) between responses in the last 10 rounds, indicating models are cycling through repeated states. This reflects inadequate long-term planning, poor state tracking, and inability to recognize when current strategies are failing—the model lacks metacognitive awareness of its own progress.

4. **Code Training is a Double-Edged Sword**: Models fine-tuned on code (CodeLlama series) outperform base models (Llama2 series) on procedural, template-following tasks like Web Shopping but underperform on strategic reasoning tasks like Digital Card Game. This reveals that code training biases models toward deterministic, step-by-step execution patterns while potentially reducing flexible strategic thinking. The optimization is task-specific, not universally beneficial for agent behavior.

5. **The Planning-Execution Consistency Gap**: Advanced models like GPT-4 demonstrate the ability to decompose tasks into coherent plans (Find → Clean → Put) and maintain consistent thought processes across dozens of interaction rounds, including self-correction when assumptions prove wrong. Lesser models quickly lose track of their own plans, reopening the same cabinet multiple times or examining already-explored locations. This persistence of coherent mental models under extended interaction is a critical differentiator that doesn't emerge from static benchmarks.

## REFERENCE DOCUMENTS

### FILE: failure-taxonomy-interactive-systems.md
```markdown
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
```

### FILE: instruction-following-as-executive-function.md
```markdown
# Instruction Following as Executive Function: Why Smart Models Still Fail to Follow Directions

## The Paradox

Here is one of the most striking findings in AgentBench: GPT-4, arguably the most capable reasoning model available, sometimes fails to follow explicit, clearly-stated format instructions. Consider this example from the Database task:

**Explicit instruction in prompt:**
```
your operation should be like this:
Action: Operation
'''sql
SELECT * FROM table WHERE condition;
'''
```

**GPT-4's actual output:**
```
To modify the capacity of the 'Princeton Tigers' team in the 
'Team Information' table to '45,000', we need to use the 
UPDATE statement in SQL.

The syntax for the UPDATE statement is as follows:
'''sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
'''
```

The SQL is correct. The reasoning is sound. But the required "Action: Operation" label is missing, making the output unparseable by the environment. The task fails not because of insufficient intelligence but because of insufficient *operational discipline*.

This is not an isolated incident. Across AgentBench's environments:
- **Invalid Format (IF)** occurs in 6.0% of commercial API interactions and 10.4% of open-source interactions
- **Invalid Action (IA)** occurs in 4.6% of commercial interactions and 13.6% of open-source interactions

Combined, these operational failures account for 10.6% of commercial failures and 24.0% of open-source failures—nearly one in four interactions fails purely due to protocol violations before reasoning quality even matters.

## The Teaching: Instruction Following is Not a Linguistic Capability

The conventional understanding of "instruction following" treats it as a linguistic comprehension problem: Can the model understand what I'm asking for? But AgentBench reveals that instruction following in interactive systems is actually an **executive function problem**: Can the model maintain operational discipline while simultaneously solving complex cognitive tasks?

This distinction is critical. Consider the cognitive load when GPT-4 generates the Database response above:

1. **Task-level reasoning**: Understand the user's goal (modify capacity)
2. **Domain knowledge retrieval**: Recall SQL UPDATE syntax
3. **Query construction**: Generate correct SQL with proper table/column references
4. **Explanation generation**: Provide clear reasoning about the approach
5. **Format adherence**: Remember to prepend "Action: Operation"

Items 1-4 are cognitively demanding. Item 5 is trivial—it's just a label. But under cognitive load, the trivial requirement gets dropped. The model reverts to its "natural" pattern (explain the solution clearly) rather than the *constrained* pattern (format the output precisely).

## Why Format Discipline Breaks Down

### 1. Training Distribution Dominates Under Load

LLMs are trained on massive corpora where explanatory, natural language responses are rewarded. The pattern "explain your reasoning in clear prose" is deeply ingrained. Format constraints like "Action: Operation" are:
- Rare in training data
- Semantically arbitrary (the label adds no meaning)
- Externally imposed (not intrinsically motivated by the task)

When cognitive resources are strained by complex reasoning, the model defaults to high-probability patterns from training. The format constraint, being low-probability and arbitrary, gets dropped.

**Evidence from AgentBench**: Format violations increase with task complexity. Simple queries rarely violate format. Complex multi-step problems (requiring nested reasoning, table joins, etc.) violate format much more often. The correlation suggests format adherence competes with task reasoning for limited cognitive resources.

### 2. Lack of Meta-Cognitive Monitoring

Humans maintain instruction adherence through meta-cognitive monitoring—we periodically ask ourselves "Am I still following the rules?" This creates a dual-track cognitive process:
- **Object level**: Solve the problem
- **Meta level**: Monitor problem-solving process for constraint violations

LLMs don't have robust meta-cognitive monitoring. They don't naturally pause mid-generation to ask "Is my output formatted correctly?" They generate tokens sequentially based on local coherence and semantic appropriateness.

**Evidence from AgentBench**: When models violate format, they often continue for many tokens in the wrong format, suggesting no monitoring system detects the violation mid-generation. If meta-monitoring existed, we'd expect early termination and correction.

### 3. The Instruction Is Distal, The Task Is Proximal

Format instructions appear early in the prompt (or in system messages). The actual problem appears later, often after many rounds of interaction. Attention mechanisms and recency bias mean the proximal task (solve the SQL problem) dominates over distal constraints (format your output correctly).

**Evidence from AgentBench**: The multi-round evaluation setting exacerbates this. After several rounds of interaction, the original format instructions are many thousands of tokens away. Even with perfect attention mechanisms, the salience of distal instructions degrades.

### 4. Format Constraints Are Under-Specified in Alignment

Instruction-following models are typically aligned using RLHF or similar techniques on datasets where:
- **Helpfulness** is highly rewarded (give complete, clear answers)
- **Correctness** is highly rewarded (get the facts right)
- **Format adherence** is weakly rewarded (it's rarely the primary evaluation criterion)

This creates a preference ranking where semantic correctness >> format correctness. When forced to trade off (due to finite generation budget), models choose semantic quality over format precision.

## Implications for Agent System Design

### 1. Don't Expect Prompt Engineering Alone to Solve This

The instinct when seeing format violations is to improve the prompt: make instructions clearer, add more examples, use bold formatting, repeat the format specification. AgentBench shows this has limited efficacy—even with clear, repeated format instructions, top models still violate format.

**Why prompting isn't enough**: Prompting operates at the input level, but format failures occur at the generation level under cognitive load. No amount of input clarity prevents degradation of output discipline when reasoning becomes complex.

### 2. Implement Format Validation as Infrastructure, Not Prompt Engineering

Robust agent systems need **format validation layers** separate from the LLM:

```python
def execute_agent_step(llm_output, environment):
    # Parse output
    parsed = parse_format(llm_output)
    
    if parsed is None:
        # Format violation detected
        # Option 1: Retry with format reminder
        return retry_with_format_emphasis(llm_output)
        
        # Option 2: Extract semantic intent, reformat
        intent = extract_semantic_intent(llm_output)
        reformatted = apply_format_template(intent)
        return execute_agent_step(reformatted, environment)
        
        # Option 3: Escalate to format-specialized model
        reformatted = format_fixer_model(llm_output, format_spec)
        return execute_agent_step(reformatted, environment)
```

**Key principle**: Separate cognitive output (what the model is trying to do) from format output (how it's expressing it). The cognitive output may be correct even when format is wrong.

### 3. Design Formats That Are Cognitively Natural, Not Arbitrary

Some formats are easier to maintain than others. Compare:

**High cognitive load format** (arbitrary labels):
```
Action: Operation
'''sql
SELECT * FROM table;
'''
```

**Lower cognitive load format** (structured JSON):
```json
{
  "thought": "I need to select from table",
  "action": {
    "type": "sql",
    "query": "SELECT * FROM table;"
  }
}
```

JSON is easier because:
- It's common in training data (higher probability)
- Structure is self-reinforcing (closing braces prompt proper nesting)
- Semantic labels are meaningful ("thought", "action" have clear roles)

**Design principle**: Format constraints should align with semantic structure. Arbitrary labels ("Action: Operation") that add no meaning are harder to maintain than structured representations that reflect task decomposition.

### 4. Use Format Adherence as a Model Selection Criterion

AgentBench shows commercial APIs have 4.4% better IF rates and 9.0% better IA rates than open-source models. This isn't just about intelligence—it's about operational reliability.

**For agent orchestration**: When selecting which model to use for a task:
- **High-stakes, long-running workflows**: Choose models with low IF/IA rates, even if they're slightly less capable cognitively. Operational reliability prevents cascading failures.
- **Supervised, retriable tasks**: More capable but operationally unreliable models are acceptable, since humans can catch and fix format violations.

### 5. Distinguish Formatting Failures from Reasoning Failures in Logs

Agent system telemetry should separate:
- **Format failures**: Model violated protocol (IF, IA)
- **Reasoning failures**: Model followed protocol but got wrong answer
- **Planning failures**: Model entered loops or exceeded task limits (TLE)

This enables targeted improvements:
- High IF rates → improve format validation/repair infrastructure
- High reasoning failure → improve prompts, examples, or model selection
- High TLE rates → improve task decomposition or loop detection

### 6. Consider Few-Shot Examples as Executive Function Training

AgentBench uses 1-shot examples in most tasks. This isn't just for task demonstration—it's for format conditioning. The example shows the model *in practice* how to maintain format discipline while solving a real problem.

**Why this helps**: Few-shot examples prime the generation process with a high-probability trajectory that already embeds the format constraint. The model is more likely to continue an existing pattern than to generate a new one.

**Design principle for WinDAGs skills**: When invoking LLMs, include not just task instructions but complete examples showing correct format adherence in realistic scenarios. The example serves as an execution trace the model can pattern-match against.

## The Code Training Effect: A Special Case

AgentBench reveals that code-trained models (CodeLlama series) show ambivalent effects on agent tasks:
- **Better at Web Shopping** (procedural, template-following tasks)
- **Worse at Digital Card Game** (strategic reasoning tasks)

The hypothesis: Code training reinforces *procedural* thinking (follow steps exactly) at the expense of *strategic* thinking (adapt flexibly to context).

For format adherence, this suggests code-trained models might be more reliable at following rigid protocols but less capable at tasks requiring flexible planning. This creates a trade-off:
- Use code-trained models for skills with strict format requirements and procedural execution
- Use generally-trained models for skills requiring strategic adaptation

## When Instruction Following Is Not the Bottleneck

This teaching applies to **structured, protocol-driven agent tasks**. It's less relevant for:
- **Open-ended creative generation**: No strict format to violate
- **Single-turn completions**: Less cognitive load, format easier to maintain
- **Human-in-the-loop**: Humans can interpret and repair malformed outputs

The instruction following problem is most acute in **autonomous, multi-turn, structured interaction**—exactly what agent orchestration systems like WinDAGs require.

## Summary: Executive Function as a First-Class Capability

The core teaching: **Instruction following in agent systems is not about linguistic understanding—it's about executive function.** Models must maintain operational discipline under cognitive load, monitor their own output for constraint violations, and resist defaulting to training distribution patterns when those patterns violate task requirements.

This is a capability largely orthogonal to reasoning ability. A model can be highly intelligent (correct reasoning, good knowledge) but operationally unreliable (frequent format violations). Agent systems must treat executive function as a first-class design consideration:

1. **Don't rely on prompting alone** for format adherence
2. **Build validation infrastructure** to detect and repair violations
3. **Design formats that align with cognitive structure**
4. **Select models based on operational reliability**, not just capability
5. **Log and analyze format failures separately** from reasoning failures

The paradox of GPT-4 failing to prepend "Action: Operation" is not a quirk—it's a window into the fundamental challenge of maintaining protocol discipline under cognitive load. Agent systems that ignore this challenge will fail unexpectedly and frequently, no matter how intelligent their underlying models.
```

### FILE: task-limit-exceeded-and-loop-detection.md
```markdown
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
```

### FILE: environment-grounding-types-and-skill-design.md
```markdown
# Environment Grounding Types: How Task Structure Shapes Agent Capability Requirements

## The Core Teaching

Not all agent tasks are created equal. AgentBench's eight environments cluster into three distinct grounding types—**Code, Game, and Web**—and agent performance varies dramatically across these types in ways that don't correlate with general intelligence. A model can excel at code-grounded database queries while failing at game-grounded strategic reasoning, even though both require multi-step planning.

This reveals a critical principle for agent system design: **Task structure determines capability requirements.** Systems that route all tasks to the "best" general-purpose model will fail. Effective orchestration requires matching task grounding types to model capabilities.

## The Three Grounding Types

### Code-Grounded Environments (OS, Database, Knowledge Graph)

**Characteristics**:
- Execution in formal, deterministic systems (bash, SQL, SPARQL-like APIs)
- Ground truth is verifiable by execution (query returns a result or an error)
- Action space is unbounded but syntactically constrained (any valid code is allowed)
- Success requires precise syntax and semantic correctness

**Cognitive demands**:
1. **Syntax knowledge**: Know the grammar of bash, SQL, etc.
2. **Semantic grounding**: Understand what operations mean in the domain (what does JOIN do?)
3. **Error interpretation**: When code fails, parse error messages to diagnose problems
4. **Multi-step composition**: Complex tasks require sequences of operations (filter, then aggregate, then sort)

**Performance patterns in AgentBench**:
- GPT-4 excels across all three (OS: 42.4%, DB: 32.0%, KG: 58.8%)
- Code-trained models (CodeLlama-34b) do well on OS (2.8%) and DB (14.0%) but weaker on KG (23.5%)
- General open-source models struggle uniformly (Llama2-70b: OS 9.7%, DB 13.0%, KG 8.0%)

**Key insight**: Code grounding rewards *procedural precision*. The model must generate exact syntax and compose operations correctly. There's little room for ambiguity—code either executes or fails. Models trained on code gain this precision but may sacrifice flexibility.

**Design implications for WinDAGs**:
- Skills that interact with code-grounded environments (CLI tools, databases, APIs) should prefer code-trained models when syntax precision is critical
- Implement error-recovery loops: When code fails, feed error messages back to the agent for debugging
- For complex tasks (multi-step queries), separate planning (what queries to run) from execution (generate actual syntax)

### Game-Grounded Environments (Digital Card Game, Lateral Thinking Puzzles, House Holding)

**Characteristics**:
- Execution in simulated worlds with state, rules, and goals
- Ground truth is defined by game rules (did you win? did you solve the puzzle?)
- Action space is discrete and constrained (legal moves only)
- Success requires strategic reasoning, not just correct syntax

**Cognitive demands**:
1. **Rule understanding**: Internalize complex game mechanics (fish abilities, puzzle logic, physics)
2. **Strategic planning**: Reason about opponent behavior, long-term consequences of actions
3. **State tracking**: Maintain mental model of current game state across many rounds
4. **Adaptability**: Adjust strategy based on opponent moves or new information

**Performance patterns in AgentBench**:
- GPT-4 excels at all three (DCG: 74.5%, LTP: 16.6%, HH: 78.0%)
- Claude-2 strong on DCG (55.5%) and HH (54.0%) but weaker on LTP (8.4%)
- Code-trained models *weaker* on strategic tasks (CodeLlama-34b DCG: 8.4%) despite being strong on code tasks
- Open-source models struggle, especially on LTP (Llama2-70b: 0.0%)

**Key insight**: Game grounding rewards *strategic flexibility*. Success requires adapting to dynamic situations, not following fixed procedures. Code training may actually *harm* performance here—it biases toward procedural execution when flexible adaptation is needed.

**The Code Training Trade-Off**:
AgentBench shows CodeLlama-34b outperforms Llama2-70b on Web Shopping (procedural, template-following task) but underperforms on Digital Card Game (strategic reasoning task). Code training optimizes for deterministic execution at the cost of strategic flexibility.

**Design implications for WinDAGs**:
- Skills requiring strategic reasoning (planning, competitive scenarios, puzzle-solving) should prefer generally-trained models over code-specialized ones
- Game-grounded skills need explicit state tracking mechanisms—don't rely on implicit attention to maintain game state
- For adversarial scenarios (card game), consider multi-agent simulations where models play against each other to generate training data

### Web-Grounded Environments (Web Shopping, Web Browsing)

**Characteristics**:
- Execution in semi-structured web interfaces (HTML, clickable elements, forms)
- Ground truth is task completion (bought the right item, reached the right page)
- Action space is hybrid: discrete (click options) + continuous (search text, form inputs)
- Success requires navigating information overload (thousands of products, complex page structures)

**Cognitive demands**:
1. **Information filtering**: Extract relevant info from verbose HTML or product descriptions
2. **Goal decomposition**: Break high-level goals ("buy cheap flight") into web actions (search, filter, click)
3. **Navigation strategy**: Decide between search (jump to target) vs. browse (explore systematically)
4. **Context tracking**: Remember search criteria across page transitions

**Performance patterns in AgentBench**:
- GPT-4 strong on WS (61.1%) but weaker on WB (29.0%)
- Claude-2 excellent on WS (61.4%) but fails completely on WB (0.0%!)
- Code-trained models excel on WS (CodeLlama-34b: 52.1%) but mixed on WB (20.0%)
- Open-source models mostly weak on both

**Key insight**: Web grounding has two sub-types:
- **Template-following (Web Shopping)**: Task has clear procedure (search → filter → select → buy). Code-trained models excel because it's essentially procedural execution.
- **Open-ended navigation (Web Browsing)**: Task requires flexible exploration of unfamiliar websites. Requires adaptability more than procedural execution.

**Design implications for WinDAGs**:
- Distinguish template-following web skills (booking flights, shopping) from open-ended web skills (research, exploration)
- For template-following, use code-trained models and explicit step-by-step templates
- For open-ended browsing, use generally-capable models with strong instruction following
- Implement element ranking/filtering (as Mind2Web does) to reduce action space—raw HTML is too large for most models

## Cross-Environment Performance Patterns

AgentBench allows analyzing which models have balanced vs. specialized capabilities:

**Balanced performers** (strong across grounding types):
- GPT-4: Top performer in 6/8 environments
- Claude-3-opus: Strong across code, game, web (with some weak spots)

**Specialized performers** (strong in specific grounding):
- CodeLlama-34b: Strong in code and template-following web, weak in strategic games
- Claude-2: Strong in procedural tasks (DB, web shopping), weak in open-ended (web browsing)

**Struggling across board**:
- Most open-source models <70B show poor performance across all grounding types
- Instruction-following deficits (high IF/IA rates) harm performance universally

## Routing Strategies for Agent Orchestration

Based on grounding type analysis, here's a routing decision tree:

```
Task arrives → Classify grounding type:

IF Code-grounded:
    IF task requires syntax precision:
        → Use code-trained model (CodeLlama, CodeGen)
    IF task requires reasoning over knowledge:
        → Use general capable model (GPT-4, Claude)
    
IF Game-grounded:
    IF task is strategic (adversarial, puzzle):
        → Avoid code-trained models
        → Use general capable model with strong reasoning
    IF task is procedural (follow rules):
        → Code-trained models acceptable
        
IF Web-grounded:
    IF task follows template (shopping, booking):
        → Use code-trained model with template
    IF task is open-ended (research, exploration):
        → Use general capable model
        → Implement element filtering to reduce action space
```

## The Instruction Following Bottleneck Applies Everywhere

While grounding types have different cognitive demands, one factor affects all environments: **instruction following capability**. AgentBench shows:

- Invalid Format (IF) errors: 6.0% commercial, 10.4% open-source
- Invalid Action (IA) errors: 4.6% commercial, 13.6% open-source

These rates are relatively consistent across grounding types—instruction following is a universal bottleneck. A model might be cognitively capable for a task but operationally unreliable due to poor instruction following.

**Design implication**: Instruction following is a first-order filter. Before considering grounding-specific routing, filter out models with high IF/IA rates for autonomous workflows. Reserve instruction-unreliable models for human-supervised or retriable tasks.

## Emergent Properties: What Doesn't Transfer Across Grounding Types

Traditional NLP benchmarks (MMLU, HumanEval, etc.) test isolated capabilities. AgentBench reveals capabilities that *don't transfer* across grounding types:

**Code skill doesn't transfer to strategy**: CodeLlama-34b's code performance doesn't help with Digital Card Game

**Strategic skill doesn't transfer to syntax**: GPT-4's card game dominance doesn't perfectly predict database success

**Template-following doesn't transfer to open exploration**: Claude-2's web shopping success doesn't transfer to web browsing

**Why this matters**: Traditional capability evaluations (can the model write code? can it reason?) don't predict agent task performance. Agent capability is *interaction-grounded*—you can only evaluate it by testing the model in the actual interaction loop.

**Design implication for benchmarking**: When evaluating a new model for your agent system, test it on diverse grounding types. Performance on one type weakly predicts performance on others.

## Task Decomposition Should Respect Grounding Boundaries

When decomposing complex tasks, partition along grounding type boundaries:

**Good decomposition** (respects grounding):
```
Complex task: "Research competitors and build database of findings"

Subtask 1 (Web-grounded): Research competitors on web, extract info
Subtask 2 (Code-grounded): Insert findings into SQL database
```
Each subtask can be routed to grounding-appropriate model.

**Poor decomposition** (mixes grounding):
```
Complex task: "Research competitors and build database"

Subtask 1: "Do everything"
```
Single model must handle both web navigation and SQL generation, requiring proficiency in multiple grounding types.

**Design principle**: Decompose tasks at grounding type boundaries. This allows specialized routing per subtask.

## Environment Construction Principles

AgentBench's environment design offers lessons for building evaluation environments:

1. **Deterministic evaluation where possible**: Code-grounded tasks have clear right/wrong answers. Game-grounded tasks have win/loss conditions. Web-grounded tasks have verifiable goal completion. This enables automatic evaluation at scale.

2. **Partial observability is realistic**: Knowledge Graph tasks simulate real scenarios where agents can't see the full state. This tests planning under uncertainty.

3. **Multi-round interaction is essential**: Single-turn evaluations miss instruction following, loop detection, and progress monitoring—all critical for real agents.

4. **Action space design matters**: House Holding's discrete action space is easier than Web Browsing's hybrid space (click + type). Constrain action spaces when possible.

5. **Evaluation should capture operational failures**: Don't just measure final accuracy. Capture IF, IA, TLE, CLE. These reveal different failure modes requiring different fixes.

## Summary: Match Task Structure to Model Capabilities

The core teaching: **Agent performance is grounding-dependent. Code, game, and web tasks require different cognitive profiles.** Systems that treat all tasks uniformly will underperform. Effective orchestration requires:

1. **Classify tasks by grounding type** (code/game/web)
2. **Route to grounding-appropriate models** (code-trained for syntax, general for strategy)
3. **Implement grounding-specific infrastructure** (error recovery for code, state tracking for games, element filtering for web)
4. **Decompose along grounding boundaries** to enable specialized routing
5. **Test models across grounding types** to map their capability profiles

The success of GPT-4 across grounding types indicates that general capability eventually overcomes specialization. But for resource-constrained systems, grounding-aware routing enables using smaller, specialized models effectively. A 13B code-trained model may match a 70B general model on code-grounded tasks while being 5× cheaper to run.

The lesson for WinDAGs: Don't build a monolithic agent. Build a routing system that matches tasks to appropriate specialists based on grounding type.
```

### FILE: the-gap-between-planning-and-execution.md
```markdown
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
```

### FILE: code-training-double-edged-sword.md
```markdown
# The Code Training Paradox: When Specialization Helps and When It Hurts

## The Unexpected Finding

One of the most counterintuitive results in AgentBench is the ambivalent effect of code training on agent performance. The CodeLlama series (models specifically fine-tuned on code) shows a striking pattern:

**Where CodeLlama-34b excels**:
- Web Shopping: 52.1% (vs. Llama2-70b: 5.6%)
- Database: 14.0% (vs. Llama2-70b: 13.0%)

**Where CodeLlama-34b struggles**:
- Digital Card Game: 8.4% (vs. Llama2-70b: 21.3%)
- Operating System: 2.8% (vs. Llama2-70b: 9.7%)

This is paradoxical. The Digital Card Game doesn't involve coding, yet the non-code-trained model does better. The Operating System task *does* involve bash commands (code), yet the code-trained model does worse. What's happening?

## The Teaching: Code Training Optimizes for Procedural Execution at the Cost of Strategic Flexibility

Code training doesn't just teach syntax—it shapes how models *think*. Code is fundamentally procedural: explicit steps executed in sequence, with deterministic results. Training on code pushes models toward procedural reasoning patterns.

This is beneficial when the task itself is procedural (follow template, execute steps, verify results). It's detrimental when the task requires strategic flexibility (adapt to opponent, explore possibilities, reason counterfactually).

## Evidence from AgentBench Environments

### Web Shopping: Where Procedural Thinking Wins

Web Shopping has a clear template:
1. Search for keywords based on requirements
2. Filter results by attributes (price, color, etc.)
3. Select product matching criteria
4. Click "buy now"

This is essentially a **code-like procedure**. There's a correct sequence of steps, and following the sequence reliably yields success.

**CodeLlama-34b's completion rate**: 50.3%
**Llama2-70b's completion rate**: 36.5%

CodeLlama's advantage: It treats the task as executing a template. When faced with "buy a queen size bedspread in redwood, price < $70," it:
- Extracts parameters (queen, redspread, redwood, <$70)
- Executes search(bedspread)
- Applies filters sequentially
- Verifies result matches all criteria

This is structurally similar to executing a function with parameters. Code-trained models excel at this pattern.

**Supporting evidence**: CodeLlama's trajectories show highly consistent structure across different products. Llama2's trajectories show more variation, including false starts and strategy switches. The consistency reflects procedural thinking.

### Digital Card Game: Where Procedural Thinking Loses

The Digital Card Game (Aquawar) requires:
- Assessing opponent's fish types and abilities
- Reasoning about multi-turn strategies (if I attack now, they might counter, so I should...)
- Adapting to unexpected plays
- Strategic deception (guess opponent's identities)

This is **non-procedural**. There's no template to follow. Success requires:
- Counterfactual reasoning ("what if I had done X instead?")
- Opponent modeling ("what will they do given what they know?")
- Strategy adaptation ("my plan isn't working, try something different")

**CodeLlama-34b's reward**: 8.4
**Llama2-70b's reward**: 21.3

Llama2's advantage: It's not biased toward procedural execution. It can explore multiple strategies, adapt when a strategy fails, and reason about the opponent as an active agent (not a passive environment).

**Supporting evidence**: CodeLlama's failed trajectories show repetitive action patterns—it finds a strategy (e.g., "always use AOE attack") and sticks to it even when it's failing. Llama2's trajectories show more strategic diversity.

### Operating System: The Paradox

Operating System tasks involve bash commands (code), yet CodeLlama underperforms. Why?

**The key distinction**: OS tasks are not primarily about *writing code*—they're about *interacting with a system*. The challenge is:
- Understanding what the system state is (what files exist, what permissions are set)
- Deciding what to ask the system (what commands will reveal needed information)
- Interpreting system output (error messages, file listings)

This is closer to **dialogue with a complex environment** than to code generation.

**Example task**: "Find all files in /etc owned by users without /home directories"

**CodeLlama's approach** (procedural):
```bash
# Generate commands in sequence
ls /etc
cat /etc/passwd
# ... generates syntactically correct bash but doesn't adapt to outputs
```

**Llama2's approach** (interactive):
```bash
ls /etc                    # See what's there
[observes: many files]
getent passwd              # Check user info
[observes: some users lack /home]
find /etc -user username   # Check ownership
[observes: several matches]
# Adapts strategy based on observations
```

The difference: Llama2 treats the OS as a dialogue partner, adjusting queries based on responses. CodeLlama treats it as a code execution environment, generating scripts without tight feedback loops.

**Why code training hurts here**: Code training emphasizes batch processing (write complete script, run it, get result). OS interaction requires incremental querying (run command, observe, adjust next command). The procedural bias of code training is misaligned with the interactive nature of OS tasks.

## The Mechanism: How Code Training Changes Reasoning

### Procedural Priming

Code training exposes models to millions of examples of:
- Function definitions (clear input → output mappings)
- Sequential execution (step 1, step 2, step 3...)
- Deterministic logic (if X, then Y, no ambiguity)

This creates a **procedural prior**: When faced with a task, the model's first instinct is to decompose it into sequential steps and execute them in order.

This prior helps when tasks actually are sequential (web shopping template). It hurts when tasks require exploration, adaptation, or strategic reasoning.

### Reduced Stochasticity in Action Selection

Analysis of CodeLlama trajectories shows lower action diversity than Llama2:
- CodeLlama tends to repeat similar actions round after round
- Llama2 shows more exploration of different approaches

**Hypothesis**: Code training reduces exploration behavior. Code values correctness over diversity—there's usually one right answer, and you should find it, not explore alternatives. This bias carries over to agent tasks, reducing the model's willingness to try diverse strategies.

### Stronger Commitment to Plans

Code emphasizes upfront planning: Define the function signature, then implement the body. Changing course mid-implementation is discouraged (you don't redesign the function interface after writing half the code).

This creates a **plan commitment bias**: Once CodeLlama commits to a strategy, it's less likely to abandon it even when it's failing.

**Evidence**: In Card Game, CodeLlama continues using failing strategies (e.g., AOE attack every turn) far longer than Llama2. In Web Shopping, this same persistence is beneficial (stick to the template, don't get distracted).

## Design Implications for Agent Systems

### 1. Route Tasks Based on Procedural vs. Strategic Nature

**Procedural tasks** (benefiting from code training):
- Template-following workflows (booking, shopping, form-filling)
- Multi-step processes with clear sequences (setup → configure → execute → verify)
- Tasks with deterministic outcomes (query database, call API, parse response)

**Strategic tasks** (harmed by code training):
- Adversarial scenarios (games, negotiations, competitive agents)
- Open-ended exploration (research, investigation, discovery)
- Tasks requiring adaptation (when plan A fails, try plan B, C, D...)

**Routing rule**:
```python
if task.has_clear_template() and task.steps_are_sequential():
    use_model("code-trained")  # CodeLlama, CodeGen
elif task.requires_strategy() or task.is_adversarial():
    use_model("general")       # Llama2, GPT, Claude
else:
    use_model("most-capable")  # Default to best available
```

### 2. Combine Code and General Models via Ensemble

For tasks with both procedural and strategic elements:
- Use code-trained model for procedural subtasks (generate queries, parse outputs)
- Use general model for strategic subtasks (decide what to query, adapt plan)

**Example: Complex Database Task**:
```
Task: "Analyze database and generate report of anomalies"

Planning phase (general model):
  - Decide what constitutes an anomaly
  - Plan what queries will reveal anomalies

Query generation phase (code-trained model):
  - Generate specific SQL queries
  - Parse query results

Analysis phase (general model):
  - Interpret results
  - Decide if more queries are needed
  - Adapt strategy based on findings
```

This exploits each model's strengths while avoiding their weaknesses.

### 3. Detect When Procedural Bias Causes Failure

Monitor for signs that code training's procedural bias is harming performance:
- **Repetitive actions without adaptation**: Model repeats same strategy despite failure
- **Ignoring feedback**: Model continues executing plan despite error messages or poor results
- **Lack of exploration**: Model doesn't try alternative approaches

When detected, either:
- Switch to general model
- Inject explicit strategy diversity requirements ("try 3 completely different approaches")
- Force plan revision ("your current strategy isn't working; generate entirely new strategy")

### 4. Use Code Training for Syntax, Not Strategy

Even in procedural tasks, separate syntax generation from strategic decisions:

**Strategic decision** (general model):
```
"Given that we need to find users without home directories, 
what's the best approach?"
→ "Query /etc/passwd for users with non-standard home directories"
```

**Syntax generation** (code-trained model):
```
"Generate bash command to query /etc/passwd for users 
with home directories not starting with /home"
→ "grep -v '^[^:]*:[^:]*:[^:]*:[^:]*:/home' /etc/passwd"
```

This leverages code training's strength (precise syntax) without its weakness (inflexible strategy).

### 5. Consider Task-Specific Fine-Tuning Instead of General Code Training

AgentBench suggests that *what you train on* shapes *how you think*. Rather than using general code-trained models, consider task-specific fine-tuning:

- **Web shopping agent**: Fine-tune on web shopping trajectories specifically
- **Database agent**: Fine-tune on SQL query-response cycles specifically
- **Card game agent**: Fine-tune on strategic game play specifically

This gives models task-appropriate reasoning patterns without the baggage of general code training.

**Trade-off**: Requires data and compute for task-specific fine-tuning. But for high-value, frequently-used agent skills, the performance gain may justify it.

## The Broader Lesson: Training Distribution Shapes Reasoning Style

Code training is just one example of a broader phenomenon: **What models train on shapes how they reason, not just what they know.**

Other examples from AgentBench:
- **RLHF on helpfulness**: Models over-explain, even when conciseness is required
- **Training on web text**: Models default to verbose, explanatory text even when formal outputs (JSON, SQL) are needed
- **Training on dialogue**: Models perform multi-turn interaction well but struggle with batch processing tasks

**Design principle**: When selecting or training models for agents, consider not just capability (can it do X?) but reasoning style (does it think in ways appropriate for X?).

## When Code Training Is Essential

Despite the limitations, code training is critical for:

1. **Syntax precision tasks**: Generating compilable code, valid SQL, correct API calls
2. **Formal verification**: Tasks where outputs must satisfy strict formal constraints
3. **Template instantiation**: Filling structured templates with specific values

In these cases, the procedural bias is exactly what you want. The model should follow the template rigidly, not explore alternatives.

**Recommendation**: Maintain both code-trained and general models in your agent infrastructure. Route tasks based on whether procedural rigidity or strategic flexibility is more important.

## Open Questions

AgentBench raises but doesn't fully answer:

1. **Can we fine-tune away the procedural bias?** Train on code but also on strategic tasks, balancing the priors.
2. **Can we prompt code-trained models to be more exploratory?** Explicit instructions like "try multiple diverse strategies" might overcome the procedural bias.
3. **Is the code training effect generalizable?** Would training on other formal domains (mathematics, logic) show similar procedural bias?

These are avenues for future research.

## Summary: Code Training as a Trade-Off

The core teaching: **Code training is not a pure win. It trades strategic flexibility for procedural precision.**

For agent systems:
- **Use code-trained models** when tasks are template-like, sequential, deterministic
- **Avoid code-trained models** when tasks are adversarial, exploratory, adaptive
- **Combine both** for complex tasks with procedural and strategic elements
- **Monitor for procedural bias** (repetition, lack of adaptation) as a failure signal
- **Consider task-specific fine-tuning** instead of general code training

The lesson for WinDAGs: Don't assume "better at code = better at agents." Task structure matters more than raw capability. A weaker model with the right reasoning style can outperform a stronger model with the wrong style.
```

### FILE: decomposition-principles-from-multi-environment-evaluation.md
```markdown
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
```

**Supervisor's role**:
- Decompose task into subtasks
- Assign subtasks to operational agents
- Verify subtask results
- Revise plan if subtasks fail

**Operational agents' role**:
- Execute assigned subtask
- Report results
- Don't worry about overall task strategy

**AgentBench evidence**: GPT-4's successful complex task trajectories often show this pattern implicitly—the model generates high-level plans (supervisor behavior) then executes each step (operational behavior).

### Strategy 5: Keep Non-Decomposable Tasks Monolithic

For strategic/adaptive tasks, don't decompose. Use single powerful agent with:
- Large context window (to maintain full task history)
- Strong reasoning capability (to handle strategic complexity)
- Explicit progress monitoring (to prevent loops)

**AgentBench evidence**: Digital Card Game and Lateral Thinking Puzzles show that successful models (GPT-4) maintain holistic context across entire interaction, not subtask-by-subtask execution.

## Metrics: Measuring Decomposition Effectiveness

How do you know if decomposition helped?

**Positive indicators**:
- Lower round count to completion (decomposition reduces redundancy)
- Higher success rate (subtasks are easier than monolithic task)
- Better error localization (can identify which subtask failed)

**Negative indicators**