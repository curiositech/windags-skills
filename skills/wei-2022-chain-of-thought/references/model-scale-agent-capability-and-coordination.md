# Model Scale, Agent Capability, and the Economics of Coordination

## The Scaling Curves Tell Different Stories for Different Tasks

The paper provides extensive scaling curves showing how chain-of-thought performance changes with model size across multiple models (LaMDA, GPT-3, PaLM) and sizes (from 420M to 540B parameters). The curves reveal fundamentally different patterns for different task types, with critical implications for agent orchestration.

**Flat then emergent (GSM8K math problems)**:
- LaMDA 420M-8B: essentially flat around 0.4-3.2% (standard prompting)
- LaMDA 68B: jumps to 5.7%
- LaMDA 137B: jumps again to 6.5%
- With chain-of-thought: 420M-8B remains flat at ~1%, then 68B jumps to 8.2%, 137B to 14.3%

This is emergence: the capability doesn't improve gradually—it appears suddenly when you cross a scale threshold.

**Gradually increasing (SVAMP, ASDiv)**:
- Performance increases roughly monotonically with scale
- Chain-of-thought provides consistent boost at all scales
- No dramatic emergence threshold

**Already strong at smaller scales (SingleOp from MAWPS)**:
- LaMDA 68B standard prompting: 36.5%
- LaMDA 137B standard prompting: 73.2%
- PaLM 540B standard prompting: 94.1%
- Chain-of-thought adds little (PaLM 540B: 94.1% → 94.1%, no change)

## The Economic Implications for Agent Orchestration

These scaling patterns create complex cost-benefit tradeoffs. The paper notes: "the emergence of chain-of-thought reasoning only at large model scales makes it costly to serve in real-world applications."

Consider the economics:

**PaLM 540B with chain-of-thought on GSM8K**:
- Solve rate: 56.9%
- Requires: 540B parameter model (expensive to serve)
- Requires: 3-5x more tokens than standard prompting (chain of thought overhead)
- Total cost: HIGH

**GPT-3 175B with chain-of-thought on GSM8K**:
- Solve rate: 46.9%
- Requires: 175B parameter model (expensive but less than 540B)
- Requires: 3-5x more tokens
- Total cost: MEDIUM-HIGH
- Performance gap vs. PaLM 540B: 10 percentage points

**LaMDA 137B with chain-of-thought on GSM8K**:
- Solve rate: 14.3%
- Requires: 137B parameter model (expensive but less than GPT-3 175B)
- Requires: 3-5x more tokens
- Total cost: MEDIUM
- Performance gap vs. GPT-3 175B: 32.6 percentage points

**Decision framework for orchestration**:
```
cost_per_token = model_size_cost[agent_scale]
tokens_required = base_tokens * (3.5 if use_chain_of_thought else 1.0)
solve_rate = performance_curve[agent_scale][task_type][use_chain_of_thought]

expected_cost_per_solve = (cost_per_token * tokens_required) / solve_rate
```

For GSM8K:
- LaMDA 137B + CoT: expensive per token, 14.3% solve rate → very high cost per solve
- GPT-3 175B + CoT: very expensive per token, 46.9% solve rate → high cost per solve
- PaLM 540B + CoT: extremely expensive per token, 56.9% solve rate → might be cheaper per solve if token cost scales sublinearly with model size

**Key insight**: The cheapest agent per API call is often not the cheapest agent per successfully solved problem. Larger models that solve problems more reliably may have lower cost-per-solve despite higher cost-per-token.

## The Coordination Overhead Tax

When you coordinate multiple smaller agents instead of using one large agent, you pay coordination overhead:

1. **Context passing**: Each agent handoff requires serializing results, passing to next agent, deserializing
2. **Redundant processing**: Each agent may need to re-process shared context
3. **Error propagation**: Mistakes by early agents compound through the chain
4. **Routing decisions**: Meta-overhead of deciding which agent handles what

The paper's findings suggest: **Coordination overhead is justified only when division of labor provides specialization benefits that outweigh coordination costs.**

**When coordination helps**:
- Different subtasks require different specialized knowledge (e.g., math calculation vs. code generation vs. factual retrieval)
- Subtasks have different capability requirements (some simple, some complex)
- Parallel execution possible (subtasks independent)
- Error recovery possible (can retry failed subtasks without restarting everything)

**When using a single large agent is better**:
- Task requires consistent context throughout (coordination passes lose information)
- Subtasks are tightly coupled (dependencies make parallelization impossible)
- Small models are below emergence threshold (coordination enables nothing)
- Latency is critical (coordination adds round-trips)

## The Transfer Question: Do Models Below Emergence Threshold Still Help?

The paper's results raise an important question: If small models can't do chain-of-thought reasoning, can they still contribute to a multi-agent system?

**They can contribute to non-reasoning tasks**:
- Information retrieval (fetching facts, documents, data)
- Format conversion (parse, transform, serialize)
- Pattern matching (regex, keyword extraction, classification)
- Summarization (if topic is in-distribution)

**They struggle with**:
- Multi-step reasoning
- Novel problem solving
- Out-of-distribution generalization
- Tasks requiring semantic understanding of complex scenarios

For orchestration: **Use small models for well-defined, limited-scope subtasks. Route reasoning-heavy subtasks to larger models.**

Example decomposition:
```
Task: "Analyze this customer complaint and recommend a resolution."

Step 1 (small model, 1B params): Extract structured info (customer ID, product, issue category)
Step 2 (small model, 1B params): Retrieve relevant policies and past cases
Step 3 (large model, 100B+ params): Reason about situation, consider precedents, generate recommendation
Step 4 (small model, 1B params): Format recommendation as customer-facing response
```

The small models handle structured, deterministic subtasks. The large model handles reasoning. This minimizes expensive large-model token usage.

## Cross-Model Consistency: A Warning

The paper tests the same prompts across LaMDA, GPT-3, and PaLM and finds: "chain-of-thought prompting improves performance across all three models (LaMDA, GPT-3, and PaLM) for all datasets except CSQA and StrategyQA for GPT-3."

This is a warning: **Techniques that work for one model family don't always transfer to others**. If you develop a multi-agent system using OpenAI models, don't assume the same orchestration strategies work with Anthropic or Google models.

**Practical implications**:
- Test orchestration strategies across all model providers you plan to use
- Maintain provider-specific routing rules and prompting strategies
- Don't assume emergent capabilities appear at the same scale across providers
- Monitor for performance degradation when switching providers

## The Ensemble Strategy: Combining Models of Different Scales

The paper doesn't explicitly test this, but the scaling curves suggest an ensemble approach:

**Cascade by scale**:
1. Try problem with small, cheap model (e.g., 8B params)
2. If confidence is low or answer seems incorrect, escalate to medium model (e.g., 62B)
3. If still low confidence, escalate to large model (e.g., 540B)

**Cost-benefit**: Most problems might be solvable by smaller models. Expensive large models only invoked for hard cases.

**Implementation challenge**: Need reliable confidence estimation. The paper shows that models can produce fluent but incorrect reasoning. Confidence calibration is critical.

**Verification-based cascading**:
1. Solve with medium model
2. Verify answer with lightweight checks (consistency, constraint satisfaction)
3. If verification fails, escalate to large model
4. If verification passes, accept answer

This requires good verification heuristics but can dramatically reduce large-model usage.

## The Economics of Specialization

The paper demonstrates that different tasks have different scaling curves. This creates opportunity for specialization:

**Task-specific model selection**:
- Simple arithmetic (SingleOp): Even LaMDA 68B achieves 36.5%, PaLM 8B achieves 41.8%. Use small models.
- Complex arithmetic (MultiArith): LaMDA 68B only achieves 8.7%, PaLM 540B achieves 42.2% standard (94.7% with CoT). Need large models.
- Commonsense (Sports Understanding): LaMDA 68B achieves 55.2% standard, 77.5% with CoT. Medium models sufficient.

**Orchestration strategy**:
```python
def select_agent(task):
    task_profile = estimate_task_profile(task)  # complexity, domain, etc.
    
    for agent in sorted_agents_by_cost():
        expected_performance = performance_model[agent][task_profile]
        cost = cost_model[agent][task_profile]
        
        if expected_performance > threshold and cost < budget:
            return agent
    
    return most_capable_agent()  # fallback
```

This is cost-aware routing: select the cheapest agent likely to solve the problem successfully.

## Future-Proofing: The Moving Emergence Threshold

The paper shows emergence thresholds at ~100B parameters for 2022 models. But model capability improves over time. Two implications:

**Capability inflation**: What required 540B params in 2022 might require 62B params in 2024 due to better training, better architectures, better data.

**Orchestration systems must adapt**: Hard-coded routing rules ("always use 540B model for math") become obsolete. Better approach:
- Continuously benchmark agents on representative task samples
- Update routing rules based on current performance profiles
- A/B test new models/techniques to measure real-world impact

**Design for capability growth**: Assume that:
- Smaller models will become more capable over time
- What's expensive today will be cheap tomorrow
- What requires decomposition today might not tomorrow

Build orchestration systems that automatically route to smaller/cheaper agents as they become capable, without manual rule updates.

## The Fundamental Tradeoff: Scale vs. Decomposition

The paper's findings reveal a fundamental tradeoff:

**Strategy A: Use larger model with less decomposition**
- Pros: Simpler coordination, fewer failure modes, lower latency
- Cons: Higher cost per token, may be overkill for simple subtasks

**Strategy B: Use smaller models with more decomposition**
- Pros: Lower cost per token, can specialize subtask handling
- Cons: Coordination overhead, error propagation, only works if agents above emergence threshold

The optimal point depends on:
- Cost structure ($/token for different model sizes)
- Task distribution (how complex are your problems?)
- Latency requirements (coordination adds latency)
- Reliability requirements (more steps = more failure points)

**No universal answer**. Measure empirically for your workload.