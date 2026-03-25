# Parameterized Modules as Learnable Techniques: Beyond Hand-Crafted Prompts

## The Module Abstraction

DSPy introduces **modules** as parameterized, composable units that abstract prompting techniques. This is a fundamental shift in how we think about building LM systems. As the paper states: "DSPy modules translate prompting techniques into modular functions that support any signature, contrasting with the standard approach of prompting LMs with task-specific details (e.g., hand-written few-shot examples)" (p. 4).

The simplest module is `Predict`, which takes a signature and produces a function implementing it:

```python
qa = dspy.Predict("question -> answer")
qa(question="Where is Guaraní spoken?")
# Out: Prediction(answer='Guaraní is spoken mainly in South America.')
```

But modules can implement sophisticated techniques. The built-in `ChainOfThought` module adds step-by-step reasoning. `ReAct` implements the reasoning-and-acting agent pattern. `MultiChainComparison` generates multiple reasoning chains and selects the best.

What makes these "parameterized"? Each module has learnable parameters:
1. **Demonstrations**: The few-shot examples shown to the LM
2. **Instructions**: The natural language description of the task  
3. **LM selection**: Which model to use for this step
4. **Field descriptions**: How to format and parse inputs/outputs

The compiler optimizes these parameters through bootstrapping, random search, or Bayesian optimization.

## Generic Techniques, Task-Adaptive Behavior

The paper includes an striking comparison (Appendix C) showing that hand-written Chain-of-Thought prompts from research papers and libraries like LangChain average 500-4000 characters, with task-specific examples hard-coded as strings. In contrast, DSPy's `ChainOfThought` implementation is **12 lines of code** (p. 5):

```python
class ChainOfThought(dspy.Module):
    def __init__(self, signature):
        # Modify signature to include rationale
        rationale_field = dspy.OutputField(prefix="Reasoning: Let's think step by step.")
        signature = dspy.Signature(signature).prepend_output_field(rationale_field)
        
        # Declare sub-module with modified signature
        self.predict = dspy.Predict(signature)
    
    def forward(self, **kwargs):
        return self.predict(**kwargs)
```

This generic implementation works across tasks because:
1. It modifies the signature structurally (adding a `rationale` field)
2. The `Predict` module handles task-specific demonstration learning
3. The compiler bootstraps task-appropriate reasoning examples
4. The metric guides what counts as "good reasoning"

On GSM8K math problems, zero-shot ChainOfThought with GPT-3.5 achieves 50% accuracy. With hand-written reasoning chains from humans, it reaches 78.6%. But with bootstrapped demonstrations—learned automatically through compilation—it achieves 80.3%, **surpassing human-written examples** (Table 1, p. 8).

## Composability Through Parameterization

Modules compose naturally because they share the same abstraction. Consider the `ThoughtReflection` program:

```python
class ThoughtReflection(dspy.Module):
    def __init__(self, num_attempts):
        self.predict = dspy.ChainOfThought("question -> answer", n=num_attempts)
        self.compare = dspy.MultiChainComparison('question -> answer', M=num_attempts)
    
    def forward(self, question):
        completions = self.predict(question=question).completions
        return self.compare(question=question, completions=completions)
```

This composes two sophisticated modules:
- `ChainOfThought` generates multiple reasoning chains
- `MultiChainComparison` evaluates and synthesizes them

Both modules independently learn appropriate demonstrations during compilation. The composition "just works" because modules are parameterized—they adapt to their role in the pipeline automatically.

The results show this matters: on GSM8K with GPT-3.5, the reflection program achieves 83% accuracy (bootstrap) and 86.7% (ensemble), substantially better than vanilla CoT at 63% (Table 1). This is a 10-line program outperforming carefully engineered prompts.

## Tool Use as Parameterized Modules

Tools fit naturally into the module framework. The paper implements retrieval as a module:

```python
self.retrieve = dspy.Retrieve(k=num_passages)
```

Importantly, modules can generate **queries for tools** rather than using fixed query patterns. The `BasicMultiHop` program (Section 7) includes:

```python
self.generate_query = dspy.ChainOfThought("context, question -> search_query")
```

During compilation, this module learns to generate effective search queries by bootstrapping from successful retrieval traces. The automatically generated prompts (Figure 11, Appendix F) show the system learned patterns like:

```
Question: The Victorians - Their Story In Pictures is a documentary 
series written by an author born in what year?

Reasoning: We know the documentary series is about Victorian art and culture,
and it was written and presented by Jeremy Paxman. Therefore, we need to
find the year in which Jeremy Paxman was born.

Search Query: Jeremy Paxman birth year
```

This query decomposition—from "when was the author born?" to "who wrote it?" to "when was that person born?"—emerged through bootstrapping, not prompt engineering.

## The Power of Adaptive Parameterization

Why does parameterization matter so much? Consider the RAG (retrieval-augmented generation) program:

```python
class RAG(dspy.Module):
    def __init__(self, num_passages=3):
        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate_answer = dspy.ChainOfThought("context, question -> answer")
    
    def forward(self, question):
        context = self.retrieve(question).passages
        return self.generate_answer(context=context, question=question)
```

When compiled for GPT-3.5 on HotPotQA:
- Learns demonstrations showing how to ground answers in retrieved passages
- Adapts to GPT-3.5's particular way of following instructions
- Optimizes for the specific retrieval model's passage format

When compiled for Llama2-13b-chat:
- Learns different demonstrations suited to Llama2's training
- Adapts to Llama2's different reasoning style
- Uses different numbers/types of demonstrations

**Same 6-line program, different parameterizations, both effective.** The few-shot RAG with GPT-3.5 scores 36.4% answer accuracy, bootstrap raises it to 42.3%. For Llama2, few-shot gets 34.5%, bootstrap gets 38.3% (Table 2, p. 11).

## Cross-Model Knowledge Transfer

Perhaps most remarkably, parameterized modules enable **knowledge transfer across model scales**. The paper shows:

```python
# Expensive GPT-3.5 ensemble serves as teacher
compiled_rag = expensive_gpt35_program

# Train cheap T5-Large (770M parameters) using teacher's traces
compiled_rag_via_finetune = BootstrapFinetune().compile(
    RAG(),
    teacher=compiled_rag,
    trainset=unlabeled_questions,
    target='google/flan-t5-large'
)
```

The T5-Large program achieves 39.3% answer accuracy on HotPotQA—competitive with much larger models—using only demonstrations from the teacher (Section 7, p. 11). The module abstraction makes this transfer natural: the teacher's execution traces become the student's training data.

## Implications for Agent System Design

### 1. Technique Libraries, Not Prompt Libraries

Instead of maintaining a library of prompt templates, maintain a library of parameterized modules. A "code review" skill doesn't store a 2000-character prompt; it stores:

```python
class CodeReview(dspy.Module):
    def __init__(self):
        self.analyze = dspy.ChainOfThought("code, requirements -> issues")
        self.prioritize = dspy.Predict("issues -> critical_issues")
        self.suggest = dspy.ChainOfThought("issues -> fixes")
    
    def forward(self, code, requirements):
        issues = self.analyze(code=code, requirements=requirements).issues
        critical = self.prioritize(issues=issues).critical_issues
        fixes = self.suggest(issues=critical).fixes
        return dspy.Prediction(issues=critical, fixes=fixes)
```

When the underlying LM changes, recompile. When requirements evolve, adjust the metric and recompile. The module structure captures the **strategy** (analyze → prioritize → suggest) while parameters adapt to execution context.

### 2. Progressive Module Refinement

Start simple, add sophistication incrementally:

```python
# V1: Basic prediction
skill = dspy.Predict("task -> result")

# V2: Add reasoning
skill = dspy.ChainOfThought("task -> result")

# V3: Add self-correction
class SelfCorrectingSkill(dspy.Module):
    def __init__(self):
        self.initial = dspy.ChainOfThought("task -> result")
        self.critique = dspy.Predict("task, result -> critique")
        self.refine = dspy.ChainOfThought("task, result, critique -> final_result")
```

Each version compiles to optimized implementations. The module abstraction makes this evolution tractable—you're modifying the technique structure, not hunting through prompt strings.

### 3. Skill Composition Patterns

Modules enable clean composition patterns:

**Sequential Refinement:**
```python
initial_solution = module1(problem)
refined_solution = module2(problem, initial_solution)
final_solution = module3(problem, refined_solution)
```

**Parallel Exploration:**
```python
approach1 = module1(problem)
approach2 = module2(problem)
approach3 = module3(problem)
best = selector_module(problem, approach1, approach2, approach3)
```

**Hierarchical Decomposition:**
```python
subtasks = decomposer(complex_task)
results = [solver(st) for st in subtasks]
final = aggregator(complex_task, results)
```

All compile automatically, with each module learning appropriate demonstrations for its role.

### 4. Fail-Safe Through Modularity

When a skill fails, module boundaries provide debugging structure:
- Which module produced bad output?
- What demonstrations is it using?
- Does its signature match actual needs?
- Is the metric correctly evaluating its outputs?

Compare to debugging a 3000-character monolithic prompt where failures are opaque.

## Boundary Conditions

Parameterized modules work best when:
- The technique can be expressed as a small computational graph
- Successful demonstrations can be bootstrapped or provided
- The module's role in larger pipelines varies enough to benefit from adaptation

They struggle when:
- The technique requires deeply procedural knowledge (complex state machines)
- No successful examples exist for bootstrapping
- The module must learn from very few examples (though few-shot meta-learning could help)

The paper notes that for extremely novel modules, you may need to provide initial demonstrations or instructions, then let the compiler refine them.

## The Deeper Principle

Parameterized modules operationalize the idea that **techniques are strategy skeletons filled in by learned tactics**. Chain-of-thought is a strategy: "reason before answering." But what counts as good reasoning? What examples demonstrate it effectively? Those are tactics determined by compilation.

This mirrors software engineering's evolution from hardcoded values to configuration files to learned parameters. We're seeing the same progression in prompt engineering, with DSPy providing the framework for the "learned parameters" stage.

For systems with 180+ skills, this is transformative. Each skill becomes a composable module with a clear interface (signature) and adaptive implementation (learned parameters). The system can evolve skill implementations without breaking compositions, test alternative techniques systematically, and transfer learning across skills through shared modules.

The result is systems that are more maintainable, more robust, and more capable—not despite abstraction, but because of it.