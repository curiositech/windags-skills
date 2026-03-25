# Bootstrapping Through Trace Analysis: How Programs Learn from Their Own Execution

## The Self-Improvement Paradox

A central challenge in building intelligent systems is what we might call the "self-improvement paradox": a system must be good enough to generate useful training data for itself, yet needs that training data to become good. DSPy resolves this paradox through a elegant mechanism: **trace-based bootstrapping**.

The key insight is that even unreliable components can search the space of solutions efficiently when decomposed properly. "While LMs can be highly unreliable, we find they can be rather efficient at searching the space of solutions for multi-stage designs. A well-decomposed program can typically find at least a few training examples where the LM can pass the constraints enforced by the signatures and metrics" (p. 7).

## How Bootstrapping Works

The DSPy compiler's bootstrapping process follows three phases:

### Phase 1: Trace Collection

When running in compilation mode, the system transparently tracks execution:

```python
if dspy.settings.compiling is not None:
    trace = dict(predictor=self, inputs=kwargs, outputs=prediction)
    dspy.settings.traces.append(trace)
```

Every module invocation records:
- Which predictor was called
- What inputs it received
- What outputs it produced
- The context in which it ran

This happens "transparently and in a thread-safe fashion throughout execution" (p. 7), meaning the program doesn't need to be written differently to support trace collection. The tracing infrastructure is injected at runtime.

### Phase 2: Trace Filtering

Not all executions are equally valuable. The compiler applies the user-defined metric to filter traces:

```python
# run the teacher program on the example, and get its final prediction
prediction = teacher(**example.inputs())

# get the trace of all internal Predict calls from teacher program
predicted_traces = dspy.settings.trace

# if the prediction is valid, add the example to the traces
if self.metric(example, prediction, predicted_traces):
    for predictor, inputs, outputs in predicted_traces:
        d = dspy.Example(automated=True, **inputs, **outputs)
        predictor_name = self.predictor2name[id(predictor)]
        compiled_program[predictor_name].demonstrations.append(d)
```

This is rejection sampling: generate candidates through execution, keep only those that pass quality gates. The metric might be simple (exact match) or complex (another DSPy program checking multiple constraints).

### Phase 3: Demonstration Integration

Filtered traces become demonstrations for in-context learning. Each module in the pipeline gets demonstrations specific to its role. For a multi-hop QA system:
- The query generation module sees examples of good queries
- The answer generation module sees examples of good answers given context
- The reflection module sees examples of good answer comparisons

Critically, "labels for the pipeline steps are not required, unless they need to be used in the metric" (p. 6). The system can bootstrap from question-answer pairs alone, deriving intermediate reasoning chains and search queries automatically.

## The Power of Multi-Stage Traces

The truly novel aspect is that bootstrapping works across **multi-stage pipelines**. Traditional few-shot learning requires examples of direct input-output pairs. DSPy bootstrapping collects entire execution traces showing how inputs transform through multiple stages to reach outputs.

Consider the `BasicMultiHop` program from Section 7:

```python
class BasicMultiHop(dspy.Module):
    def __init__(self, passages_per_hop):
        self.retrieve = dspy.Retrieve(k=passages_per_hop)
        self.generate_query = dspy.ChainOfThought("context, question -> search_query")
        self.generate_answer = dspy.ChainOfThought("context, question -> answer")
    
    def forward(self, question):
        context = []
        for hop in range(2):
            query = self.generate_query(context=context, question=question).search_query
            context += self.retrieve(query).passages
        return self.generate_answer(context=context, question=question)
```

When bootstrapping this program with only question-answer pairs:

1. The system generates first-hop queries (even if imperfect)
2. Retrieves passages with those queries
3. Generates second-hop queries given first-hop context
4. Retrieves again
5. Generates final answers

For runs where the final answer is correct (per the metric), the **entire trace**—both queries and the reasoning chains leading to them—becomes training data. The query generation modules learn from their own successful query formulations.

This is visible in the results: on HotPotQA, simple few-shot prompting with GPT-3.5 achieves 36.9% answer accuracy, but bootstrap compilation raises it to 48.7% (Table 2, p. 11). For Llama2-13b-chat, the jump is even more dramatic: 34.7% to 42.0%.

## Iterative Bootstrapping

DSPy supports **nested bootstrapping** where one compiled program supervises another:

```python
tp = BootstrapFewShotWithRandomSearch(metric=gsm8k_accuracy)
bootstrap = tp.compile(program, trainset=trainset, valset=devset)

# Use the optimized bootstrap program to further bootstrap
bootstrap2 = tp.compile(program, teacher=bootstrap, trainset=trainset, valset=devset)
```

This addresses the cold-start problem: if the zero-shot program is too weak to generate any successful traces, bootstrap it once to get a better teacher, then bootstrap again from that teacher.

On GSM8K with GPT-3.5, this lifts vanilla accuracy from 33.1% (random few-shot) to 44.0% (single bootstrap) to 64.7% (double bootstrap) (Table 1, p. 8). Each iteration uses better-quality demonstrations to find even-better demonstrations.

## Search Strategies Over Traces

The simplest bootstrapping strategy is to collect all successful traces. But DSPy supports more sophisticated optimization:

**Random Search**: Generate multiple demonstration sets, evaluate each, keep the best:
```python
for seed in range(self.trials):
    shuffled_trainset = shuffle(trainset, seed=seed)
    candidate_program = tp.compile(student, shuffled_trainset, teacher)
    score = evaluate_program(candidate_program, self.metric, valset)
    candidates.append((score, candidate_program))
return max(candidates, key=lambda x: x[0])[1]
```

**Bayesian Optimization**: Use Optuna's Tree-structured Parzen Estimators to intelligently select which demonstrations to include:
```python
for (name, predictor1), (_, predictor2) in \
    zip(pool.named_predictors(), candidate_program.named_predictors()):
    all_demos = predictor1.demos
    demo_index = trial.suggest_int(f"demo_index_for_{name}", 0, len(all_demos) - 1)
    predictor2.demos = [all_demos[demo_index]]
```

This treats demonstration selection as a hyperparameter optimization problem. Which examples to show the LM? How many? In what order? The optimizer explores this space guided by validation performance.

## Implications for Agent Systems

### 1. Cold-Start Mitigation

When deploying a new skill, you don't need perfectly labeled data. Give the system a rough metric and some input examples. Let it try, fail, and learn from rare successes. As the paper shows, even starting from 9% accuracy (vanilla Llama2 on GSM8K), bootstrap compilation can reach 37.3% by finding and learning from the working cases.

### 2. Continuous Improvement

Traces can be collected during production use. When agents succeed at tasks, those traces become demonstrations for future runs. The system improves from its own successes, creating a flywheel effect. This is particularly powerful for WinDAGs where successful task decompositions can teach better decompositions.

### 3. Cross-Agent Learning

If Agent A successfully solves a problem, its trace can bootstrap Agent B facing a similar problem. The `teacher` parameter in compilation enables this:

```python
# compiled_rag is an expensive GPT-3.5 based program
# We want a cheap T5-Large program with similar quality
compiled_rag_via_finetune = finetuning_teleprompter.compile(
    RAG(), 
    teacher=compiled_rag,
    trainset=unlabeled_questions, 
    target='google/flan-t5-large'
)
```

Agent A (expensive, accurate) supervises Agent B (cheap, initially weak), transferring knowledge through demonstrations.

### 4. Metric-Driven Evolution

As system requirements evolve, changing the metric triggers recompilation with new constraints. Need extractive answers? Change the metric to check `answer_in_context`. The system re-bootstraps, now learning only from traces that satisfy the new constraint.

## Boundary Conditions

Bootstrapping requires:

1. **Some successful executions**: The search space must contain solutions findable by the initial program. For extremely difficult tasks, even noisy success is rare.

2. **Informative metrics**: The metric must distinguish good from bad traces. If everything passes or fails, no signal for learning.

3. **Sufficient diversity**: If all successful traces look identical, bootstrapping overfits to that pattern. The paper's use of random shuffling and multiple trials addresses this.

4. **Computational budget**: Each compilation run requires executing the program hundreds or thousands of times. The paper notes compilation "runs on the order of minutes (or tens of minutes)" (p. 8).

## The Deeper Principle

Bootstrapping through trace analysis operationalizes a profound idea: **decomposition enables learning from weak supervision**. A monolithic system that directly maps questions to answers struggles to learn without answer explanations. But decompose into query generation → retrieval → answer generation, and now you can learn from question-answer pairs alone. The decomposition creates intermediate checkpoints where partial success can be recognized and reinforced.

This connects to curriculum learning and progressive improvement. Simple tasks bootstrap harder tasks. Successful runs bootstrap better runs. Expensive models bootstrap cheap models. The trace becomes the unit of knowledge transfer, encoding not just input-output mappings but the **process** that transforms one to the other.

For agent orchestration, this suggests designing pipelines where:
- Each stage has a clear, evaluable role
- Stage outputs can be assessed independently when needed
- Successful end-to-end runs provide implicit supervision for all stages
- Traces capture enough context to understand why something worked

The result is systems that improve through use rather than requiring constant manual tuning—a critical property for scaling to 180+ skills.