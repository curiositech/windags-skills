# Failure Modes and Recovery Strategies: What DSPy Reveals About Robust System Design

## The Brittleness Problem

The DSPy paper identifies a fundamental tension in LM systems: they're powerful but brittle. "LMs are known to be sensitive to how they are prompted for each task, and this is exacerbated in pipelines where multiple LM calls have to interact effectively" (p. 1). A prompt that works for one input fails on slight variations. A pipeline tuned for one LM breaks when switching to another. A system optimized on one domain degrades on distribution shift.

The paper's approach doesn't eliminate these failure modes—LMs remain inherently unreliable—but provides systematic tools for detection and recovery. Understanding these tools illuminates principles for building robust agent systems.

## Failure Mode 1: Module-Level Failures

**Manifestation**: A single module in a pipeline produces unusable output (wrong format, nonsensical content, factually incorrect).

**Traditional Diagnosis**: Difficult. Is the prompt wrong? The examples? The LM temperature? The input? No systematic way to localize the issue.

**DSPy Approach**: Module boundaries provide fault isolation. Each module has:
- A clear signature defining expected inputs/outputs
- Demonstrations showing working examples
- Metrics that can evaluate its outputs independently

When a module fails, you can:
1. Examine its demonstrations: Are they actually good examples?
2. Test it in isolation: Does it fail consistently or only in pipeline context?
3. Check its signature: Does it match how it's actually being used?
4. Adjust its metric: Is the quality bar too low?

The paper demonstrates this implicitly through iterative bootstrapping. When vanilla GSM8K with GPT-3.5 only scores 24% zero-shot (Table 1, p. 8), the solution isn't "try different prompts randomly." It's:
1. Add few-shot demonstrations: 33.1%
2. Bootstrap better demonstrations: 44.0%
3. Bootstrap again with the improved program as teacher: 64.7%

Each step systematically addresses the failure mode (weak zero-shot performance) through increasingly sophisticated parameterization.

## Failure Mode 2: Composition Failures

**Manifestation**: Individual modules work in isolation but fail when composed. Module A's output format doesn't match Module B's expected input. Module A's behavior shifts when receiving outputs from Module B instead of clean test inputs.

**Traditional Diagnosis**: Usually discovered late, during integration testing. Fixing requires coordinated changes to multiple prompts, risking unintended side effects.

**DSPy Approach**: Signatures provide interface contracts. If Module A's signature is `question -> search_query: str` and Module B expects `query: str`, the composition is valid by construction. Type mismatches are caught early.

More subtly, joint compilation optimizes modules **in context of each other**. When compiling `BasicMultiHop`, the query generation module learns demonstrations from full pipeline traces where its queries led to successful answer generation. It's not optimized in isolation but as part of the system.

This is visible in the HotPotQA results: simple RAG (retrieve once, then answer) achieves 42.3% with bootstrap (Table 2, p. 11). Multi-hop (retrieve, generate query, retrieve again, then answer) achieves 48.7%. The query generation module learned to formulate queries that complement the first-hop retrieval, something it couldn't learn in isolation.

## Failure Mode 3: Distribution Shift

**Manifestation**: System works on training distribution but fails on deployment distribution. Common causes: domain shift (trained on Wikipedia, deployed on news), temporal shift (trained on 2020 data, deployed in 2024), adversarial shift (users actively trying to confuse the system).

**Traditional Diagnosis**: Often not detected until user complaints. Mitigation requires collecting new data, re-engineering prompts, hoping the changes don't break existing cases.

**DSPy Approach**: Recompilation. If you detect degradation:
1. Collect examples from the new distribution
2. Add them to training set
3. Recompile with updated data

The modular structure ensures changes propagate appropriately. If the new distribution requires different query formulation strategies, the query module gets new demonstrations. If answer grounding becomes more important, adjust the metric to emphasize grounding, then recompile.

The paper demonstrates this through cross-LM transfer. GPT-3.5 and Llama2-13b-chat are effectively different distributions—different training data, different architectures, different capabilities. The same program, compiled separately for each, achieves strong performance on both (Tables 1-2). This wouldn't work with hand-crafted prompts, which rarely transfer across LMs without modification.

## Failure Mode 4: Catastrophic Success Forgetting

**Manifestation**: When optimizing for a new objective or dataset, the system forgets how to handle previously-working cases.

**Traditional Diagnosis**: Usually discovered through regression testing. Mitigation requires careful prompt engineering to maintain old behavior while adding new.

**DSPy Approach**: Curriculum through metric evolution and teacher-student compilation:

```python
# Phase 1: Learn basic skills
basic_program = teleprompter.compile(program, trainset=basic_cases, metric=simple_metric)

# Phase 2: Add complex skills using Phase 1 as teacher
advanced_program = teleprompter.compile(
    program, 
    teacher=basic_program,
    trainset=basic_cases + complex_cases,
    metric=comprehensive_metric
)
```

The teacher provides demonstrations for basic cases while the student learns complex cases. This is used implicitly in the paper's iterative bootstrapping: `bootstrap×2` uses `bootstrap` as teacher, preventing forgetting while improving.

## Failure Mode 5: Prompt Overfitting

**Manifestation**: Demonstrations that work on validation set but don't generalize to test set. Often caused by choosing demonstrations that exhibit spurious correlations.

**Traditional Diagnosis**: High validation accuracy, poor test accuracy. Hard to fix because you can't see the test set to diagnose the issue.

**DSPy Approach**: Random search and Bayesian optimization with held-out validation. From Appendix E.2:

```python
for seed in range(self.trials):
    shuffled_trainset = shuffle(trainset, seed=seed)
    candidate_program = tp.compile(student, shuffled_trainset, teacher)
    score = evaluate_program(candidate_program, self.metric, valset)
    candidates.append((score, candidate_program))
```

By evaluating multiple demonstration sets on held-out data, the optimizer selects for generalization, not memorization. This is standard ML practice but often skipped in prompt engineering, where people tune on the only examples they have.

The paper's results show this matters. For GSM8K with CoT and GPT-3.5, bootstrap achieves 80.3% dev but only 72.9% test—some overfitting (Table 1, p. 8). But this is mild compared to typical prompt engineering, where test performance often drops significantly more.

## Recovery Strategy 1: Ensembling

**When**: Individual programs have modest accuracy but diverse failure modes.

**How**: Train multiple variants, combine predictions:

```python
ensemble = Ensemble(reduce_fn=dspy.majority).compile(bootstrap.programs[:7])
```

**Results**: For GSM8K CoT with GPT-3.5, bootstrap achieves 80.3% dev, ensemble achieves 88.3%—an 8-point boost (Table 1). For Llama2-13b-chat reflection, single bootstrap gets 44.3%, ensemble gets 49.0%—nearly 5 points (Table 1).

Ensembling works because different compiled programs learn different demonstrations, creating diversity in reasoning patterns. When combined with majority voting, errors often cancel out while correct answers reinforce.

## Recovery Strategy 2: Progressive Refinement

**When**: Zero-shot or few-shot performance is too weak to bootstrap effectively.

**How**: Iteratively improve:
1. Get weak initial program working at all
2. Use it to bootstrap better demonstrations  
3. Use bootstrapped program to bootstrap even better demonstrations
4. Repeat until convergence or resource limits

**Results**: GSM8K vanilla with GPT-3.5 goes 33.1% (few-shot) → 44.0% (bootstrap) → 64.7% (bootstrap×2) (Table 1). Each iteration uses improved demonstrations to find even better demonstrations, escaping the cold-start trap.

## Recovery Strategy 3: Teacher-Student Distillation

**When**: Need cheaper/faster inference than current program provides, or need to deploy to a smaller LM.

**How**: Use expensive program as teacher to train cheap program:

```python
cheap_program = BootstrapFinetune().compile(
    program,
    teacher=expensive_program,
    trainset=unlabeled_data,
    target='small-model'
)
```

**Results**: T5-Large (770M parameters) trained with Llama2-13b-chat teacher achieves 39.3% on HotPotQA, competitive with Llama2 itself (p. 11). The small model learns from the large model's reasoning traces, not from scratch.

## Recovery Strategy 4: Metric-Guided Repair

**When**: System produces correct answers but through wrong means (unfaithful reasoning, ungrounded claims, unsafe operations).

**How**: Define metrics that enforce constraints, recompile:

```python
def grounded_metric(example, pred, trace):
    correct = (pred.answer == example.answer)
    grounded = any(pred.answer.lower() in passage.lower() 
                   for passage in pred.context)
    return correct and grounded

compiled = teleprompter.compile(program, trainset=train, metric=grounded_metric)
```

The compiler will only keep demonstrations where answers are grounded, teaching the system to ground answers even when not explicitly prompted to.

## Recovery Strategy 5: Trace-Based Debugging

**When**: Need to understand why a particular instance failed.

**How**: Inspect execution trace:

```python
with dspy.settings.context(trace_enabled=True):
    prediction = program(**input)
    trace = dspy.settings.trace

for step in trace:
    print(f"Module: {step['predictor']}")
    print(f"Inputs: {step['inputs']}")
    print(f"Outputs: {step['outputs']}")
```

This shows exactly what each module did. Unlike debugging a monolithic prompt, you can see the pipeline's internal state at each step.

## Implications for WinDAGs

### 1. Fault Isolation in DAG Execution

In a DAG with 20 nodes, when the final output is wrong, which node(s) failed? With DSPy modules:
- Each node has a signature defining its contract
- Each node's demonstrations show expected behavior
- Traces show actual intermediate values

Compare the trace to expected signatures to localize failures. If a node outputs malformed data that downstream nodes can't process, the signature violation pinpoints the failure.

### 2. Graceful Degradation

Define fallback chains:

```python
class RobustSkill(dspy.Module):
    def __init__(self):
        self.primary = ComplexModule()
        self.fallback = SimplerModule()
    
    def forward(self, input):
        try:
            result = self.primary(input)
            if validation_passes(result):
                return result
        except:
            pass
        return self.fallback(input)
```

Compile both primary and fallback. In production, attempt primary, fall back if needed. The fallback learns from cases where primary fails, specializing in "hard cases."

### 3. Continuous Learning from Failures

Collect failure cases during production:

```python
if not meets_quality_bar(result):
    failure_log.append((input, result, expected))
```

Periodically:
1. Analyze failure patterns
2. Add failure cases to training set (with corrections)
3. Recompile affected skills
4. A/B test new version
5. Roll out if better

This creates a self-healing system that learns from production experience.

### 4. Defensive Programming Through Metrics

Embed defensive checks in metrics:

```python
def safe_code_metric(example, pred, trace):
    functionally_correct = runs_and_passes_tests(pred.code)
    security_safe = no_vulnerabilities(pred.code)
    maintains_invariants = preserves_properties(example.code, pred.code)
    
    return functionally_correct and security_safe and maintains_invariants
```

The compiler will only learn demonstrations satisfying all safety properties. The system becomes robust-by-construction rather than robust-by-luck.

## Boundary Conditions

These recovery strategies require:

1. **Sufficient signal**: Failure modes must be detectable. If bad outputs are indistinguishable from good, no recovery strategy helps.

2. **Learnable patterns**: Failures must have patterns that demonstrations can capture. Pure randomness is unlearnable.

3. **Computational budget**: Recovery strategies (especially recompilation, ensembling) have costs. Must be acceptable for the application.

4. **Semantic decomposition**: Recovery through module boundaries requires that modules correspond to meaningful subtasks. Arbitrary decomposition doesn't help.

## The Deeper Principle

DSPy's approach to failure modes embodies **defense in depth through abstraction layers**:

1. **Signature layer**: Type-like contracts catch obvious composition errors
2. **Module layer**: Boundaries enable fault isolation and independent testing
3. **Metric layer**: Quality gates filter bad demonstrations during learning
4. **Compilation layer**: Systematic optimization reduces reliance on luck
5. **Ensemble layer**: Diversity compensates for individual failures

Each layer catches different failure modes. No single layer is perfect, but combined, they create systems substantially more robust than monolithic prompts.

For agent orchestration with 180+ skills, this multi-layered defense is essential. Any single skill might fail on edge cases. But if:
- Skills have clear contracts (signatures)
- Failed skills can be isolated and debugged (module boundaries)
- Skills are compiled against quality metrics (metric layer)  
- Multiple skill variants exist (ensemble layer)
- Skills can be recompiled from production feedback (continuous learning)

Then the overall system degrades gracefully rather than catastrophically. Individual component failures become opportunities for targeted improvement rather than system-wide breakage.

This is the fundamental lesson DSPy teaches about robust system design: **abstraction boundaries aren't just for human understanding—they're load-bearing structures that enable automated recovery from failure.**