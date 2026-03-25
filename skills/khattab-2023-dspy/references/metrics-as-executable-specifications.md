# Metrics as Executable Specifications: Defining Success for Self-Improving Systems

## Beyond Accuracy: Metrics as Behavioral Constraints

DSPy introduces a powerful idea: metrics are not just evaluation functions but **executable specifications** that guide optimization. As the authors state, "Metrics can be simple notions like exact match (EM) or F1, but they can be entire DSPy programs that balance multiple concerns" (p. 6).

This transforms the role of metrics from passive measurement to active shaping of system behavior. The metric doesn't just assess a compiled program—it determines which demonstrations get bootstrapped, which candidate programs survive random search, and which behaviors the system learns to exhibit.

## The Metric Signature

Every DSPy metric has the signature:
```python
def metric(example, prediction, trace=None) -> float | bool
```

Where:
- `example`: The ground truth training/validation instance
- `prediction`: The program's output on that instance
- `trace`: Optional full execution trace showing intermediate steps
- Returns: Score (higher better) or boolean (pass/fail)

The simplest metrics ignore the trace:
```python
def exact_match(example, pred, trace=None):
    return example.answer == pred.answer
```

But accessing the trace enables powerful constraints on **how** the answer was derived, not just whether it's correct.

## Metrics That Constrain Intermediate Steps

Consider answer generation with retrieval. You want correct answers, but also answers **grounded in retrieved context**:

```python
def answer_and_context_match(example, pred, trace=None):
    answer_match = dspy.evaluate.answer_exact_match(example, pred)
    
    # Is the prediction a substring of some passage?
    context_match = any((pred.answer.lower() in c) for c in pred.context)
    
    return answer_match and context_match
```

Now during bootstrapping, only demonstrations where the answer appears in retrieved passages are kept. The system learns to be extractive rather than generative, even though this was never specified in the prompts—it emerges from the metric.

The paper uses a similar metric for HotPotQA: `answer_passage_match` (p. 8). This ensures the multi-hop retrieval program learns to use retrieved passages effectively, not just memorize answers.

## Metrics as DSPy Programs

The real power emerges when metrics are themselves DSPy programs. Consider verifying that code changes don't introduce security vulnerabilities:

```python
class SecurityMetric(dspy.Module):
    def __init__(self):
        self.check = dspy.ChainOfThought("code_before, code_after -> has_vulnerability: bool, explanation")
    
    def __call__(self, example, pred, trace):
        result = self.check(code_before=example.original_code, code_after=pred.modified_code)
        return not result.has_vulnerability
```

This metric is a neural network! It learns to recognize vulnerabilities through its own compilation. The system being optimized uses a metric that is itself optimized.

This enables expressing complex, nuanced requirements that would be impossible to code as simple functions. Does this explanation sound convincing? Is this code refactoring safe? Does this summary preserve key information? These are judgment calls that benefit from learned evaluation.

## Metrics Enable Multi-Objective Optimization

A metric can balance multiple objectives:

```python
def quality_and_efficiency(example, pred, trace):
    # Correctness
    correct = (pred.answer == example.answer)
    
    # Efficiency: penalize long reasoning chains
    reasoning_length = len(pred.rationale.split())
    efficiency_score = max(0, 1 - reasoning_length / 1000)
    
    # Cost: count LM calls in trace
    if trace:
        num_calls = len([t for t in trace if isinstance(t['predictor'], dspy.Predict)])
        cost_score = max(0, 1 - num_calls / 10)
    else:
        cost_score = 1
    
    # Weighted combination
    return correct * (0.5 + 0.25 * efficiency_score + 0.25 * cost_score)
```

This creates pressure toward correct, efficient, cheap solutions. During bootstrapping, demonstrations that achieve all three get higher weight. During random search, candidate programs balancing these concerns score higher.

The paper demonstrates this implicitly through compilation time—optimizations that take "minutes (or tens of minutes)" (p. 8) are acceptable because they produce faster, cheaper runtime execution.

## Metrics Guide Demonstration Selection

The most important role of metrics in DSPy is **filtering bootstrapped demonstrations**. From the compiler pseudocode (Appendix E.1):

```python
for example in trainset:
    with dspy.settings.context(compiling=True):
        prediction = teacher(**example.inputs())
        predicted_traces = dspy.settings.trace
        
        # Critical: metric decides which traces become demonstrations
        if self.metric(example, prediction, predicted_traces):
            for predictor, inputs, outputs in predicted_traces:
                d = dspy.Example(automated=True, **inputs, **outputs)
                compiled_program[predictor_name].demonstrations.append(d)
```

Only runs passing the metric contribute demonstrations. This is rejection sampling guided by the metric. If your metric requires extractive answers, only extractive demonstration traces are kept. If your metric requires safe code changes, only safe change demonstrations are kept.

The metric effectively defines the **valid region of behavior space** the system should learn to operate in.

## Metric Expressiveness Enables Complex Behaviors

The paper shows how different metrics shape different behaviors. For the vanilla program on GSM8K, the metric just checks the final numerical answer. Interestingly, this allows the program to use the `answer` field for intermediate reasoning—the metric extracts only the final number (p. 8).

For HotPotQA's multi-hop program, the metric could check:
- Answer correctness (standard)
- Passage relevance (did retrieval find supporting facts?)
- Query quality (do generated queries lead to useful passages?)
- Reasoning coherence (does the explanation make sense?)

Each additional constraint prunes the space of acceptable demonstrations, focusing learning on desired behaviors.

## Metrics Enable Curriculum Learning

Metrics can evolve over time to implement curriculum learning:

```python
# Phase 1: Learn basic correctness
metric_v1 = lambda ex, pred, tr: (ex.answer == pred.answer)
program_v1 = teleprompter.compile(program, metric=metric_v1, trainset=easy_examples)

# Phase 2: Add efficiency constraints  
metric_v2 = lambda ex, pred, tr: (ex.answer == pred.answer) and len(tr) < 5
program_v2 = teleprompter.compile(program, teacher=program_v1, metric=metric_v2, trainset=hard_examples)

# Phase 3: Add safety constraints
metric_v3 = lambda ex, pred, tr: metric_v2(ex, pred, tr) and safety_check(pred)
program_v3 = teleprompter.compile(program, teacher=program_v2, metric=metric_v3, trainset=all_examples)
```

Each phase tightens constraints, building on the previous phase's learning. This mirrors how humans learn: first get it working, then make it efficient, then make it safe.

## Implications for Agent Systems

### 1. Metrics as Skill Contracts

In a multi-agent system, each skill should have a metric defining its contract:

```python
class CodeReviewSkill(dspy.Module):
    def metric(self, example, pred, trace):
        # Did we identify the bugs?
        bugs_found = set(pred.issues) & set(example.known_bugs)
        recall = len(bugs_found) / len(example.known_bugs) if example.known_bugs else 1
        
        # Did we avoid false positives?  
        false_positives = set(pred.issues) - set(example.known_bugs)
        precision = len(bugs_found) / len(pred.issues) if pred.issues else 0
        
        # Must achieve minimum recall and precision
        return recall > 0.7 and precision > 0.5
```

This contract guides compilation: demonstrations must find ≥70% of bugs with ≥50% precision. The skill's behavior is specified declaratively.

### 2. Compositional Metrics for Pipelines

When skills compose, metrics compose:

```python
def pipeline_metric(example, pred, trace):
    # Check each stage
    decomposition_ok = decomposition_metric(example, trace['decomposer_output'], trace)
    execution_ok = all(execution_metric(subtask, result) 
                       for subtask, result in zip(trace['subtasks'], trace['results']))
    aggregation_ok = aggregation_metric(example, pred, trace)
    
    return decomposition_ok and execution_ok and aggregation_ok
```

This ensures each pipeline stage satisfies its requirements. During bootstrapping, only fully-successful pipeline executions contribute demonstrations.

### 3. Human-in-the-Loop Metrics

Metrics can incorporate human feedback:

```python
class HumanApprovalMetric:
    def __init__(self):
        self.approved = {}  # Cache of human judgments
    
    def __call__(self, example, pred, trace):
        key = (example.id, pred.hash)
        if key not in self.approved:
            self.approved[key] = show_to_human_for_approval(example, pred)
        return self.approved[key]
```

Use this during compilation to bootstrap demonstrations from human-approved outputs. The system learns patterns from human preferences without requiring humans to write demonstrations manually.

### 4. Adversarial Metrics for Robustness

Metrics can test robustness:

```python
def robustness_metric(example, pred, trace):
    # Original input
    baseline_correct = (pred.answer == example.answer)
    
    # Perturbed inputs  
    perturbed_examples = generate_perturbations(example)
    perturbed_correct = all(
        program(perturbed).answer == example.answer
        for perturbed in perturbed_examples
    )
    
    return baseline_correct and perturbed_correct
```

This forces the system to learn demonstrations that work across input variations, not just the exact training distribution.

## Boundary Conditions

Effective metrics require:

1. **Distinguishing power**: Must separate good from bad. If everything passes or fails, no learning signal.

2. **Alignment with goals**: The metric must actually capture what you care about. Proxy metrics (like string overlap) may not align with true goals (like usefulness).

3. **Computational feasibility**: The metric runs during every bootstrapping attempt. If each call takes minutes, compilation becomes impractical.

4. **Determinism or stable stochasticity**: Random metrics make optimization chaotic. If using stochastic metrics (like sampling-based evaluation), use enough samples for stable estimates.

The paper's metrics are primarily deterministic (exact match, substring checking) or based on deterministic LM calls. This ensures repeatable optimization.

## The Deeper Principle

Metrics as executable specifications embody a shift from **descriptive to prescriptive evaluation**. Traditional metrics describe how good a system is (accuracy = 73%). DSPy metrics prescribe what behaviors are acceptable during learning (only keep demonstrations where accuracy = 100% AND answer is grounded).

This is closer to property-based testing or formal verification than traditional ML evaluation. You're not just measuring average behavior—you're defining a space of acceptable behaviors and guiding the system to stay within it.

For agent orchestration, this is transformative. Instead of:
1. Build a system
2. Evaluate it
3. Manually tune prompts when it fails
4. Repeat

You get:
1. Define behavioral requirements as metrics
2. Let the compiler find implementations satisfying those metrics
3. Requirements change? Update metric and recompile

The metric becomes the specification. The compiler finds an implementation. This inverts the traditional relationship between specification and implementation, enabling systems that adapt to changing requirements without manual re-engineering.

For a system with 180+ skills, maintaining 180 sets of prompt engineering notes is impossible. But maintaining 180 metrics—each clearly stating what that skill should do—is tractable. The metrics become living documentation that also drives optimization.