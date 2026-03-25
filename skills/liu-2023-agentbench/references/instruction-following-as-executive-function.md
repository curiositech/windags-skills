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