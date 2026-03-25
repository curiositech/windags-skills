## BOOK IDENTITY

**Title**: DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines

**Author**: Omar Khattab, Arnav Singhvi, and colleagues (Stanford University, UC Berkeley, et al.)

**Core Question**: How can we build language model pipelines that automatically optimize themselves rather than relying on hand-crafted prompts, and what programming abstractions enable modular composition of intelligent systems?

**Irreplaceable Contribution**: DSPy introduces the first programming model that treats prompting techniques as parameterized, learnable modules rather than brittle string templates. It demonstrates that intelligent systems can bootstrap their own demonstrations through compiler-based optimization, fundamentally separating the "what" (declarative signatures) from the "how" (learned implementations). The breakthrough is showing that modules like Chain-of-Thought can be expressed in ~10 lines of generic code that self-improves across tasks, rather than requiring 4000+ character hand-crafted prompts per task.

## KEY IDEAS (3-5 sentences each)

1. **Declarative Signatures Replace Prompt Engineering**: Instead of manually crafting prompt strings, DSPy uses natural language type signatures ("question -> answer") that abstract what a transformation should do, not how to prompt for it. The compiler then learns optimal demonstrations and instructions automatically. This mirrors the shift from hand-tuning neural network weights to using optimizers.

2. **Parameterized Modules Enable Learning**: DSPy modules (Predict, ChainOfThought, ReAct) are parameterized by their demonstrations, instructions, and target LM. During compilation, teleprompters optimize these parameters by bootstrapping useful examples from program execution traces, allowing modules to adapt to specific pipelines, tasks, and language models without manual intervention.

3. **Bootstrapping Through Execution Traces**: The compiler simulates program execution, tracks input-output behavior at each module, filters for traces that satisfy metrics, and uses successful traces as demonstrations for self-improvement. This creates a feedback loop where programs learn from their own successful executions rather than requiring human-annotated intermediate steps.

4. **Composability Through Abstraction Layers**: DSPy separates concerns into three layers: signatures (interface), modules (techniques), and teleprompters (optimizers). This allows arbitrary composition—the same ChainOfThought module works for math problems or question answering, simple programs can supervise complex ones, and optimization strategies apply to any pipeline.

5. **Metric-Driven Compilation**: Programs are optimized against user-defined metrics that can be simple (exact match) or complex DSPy programs themselves. The compiler searches for parameter configurations (demonstrations, LM selection) that maximize metric performance, treating prompt optimization as a discrete optimization problem rather than an art.

## REFERENCE DOCUMENTS

### FILE: declarative-signatures-vs-imperative-prompts.md

```markdown
# Declarative Signatures vs Imperative Prompts: Separating Interface from Implementation

## The Problem of Prompt Brittleness

The DSPy paper identifies a fundamental flaw in how AI systems are currently built: "LMs are known to be sensitive to how they are prompted for each task, and this is exacerbated in pipelines where multiple LM calls have to interact effectively" (p. 1). The standard approach treats prompts as "lengthy strings discovered via trial and error"—essentially hand-tuning the weights of a classifier. A prompt that works for GPT-3.5 may fail for Llama2. A prompt optimized for question answering may not transfer to summarization. A prompt tested on one data domain may collapse on another.

This brittleness creates a cascade of problems for agent systems:
- **Non-composability**: Each pipeline stage requires custom prompt engineering
- **Non-transferability**: Switching LMs means re-engineering all prompts
- **Fragility**: Small input variations can break carefully-crafted prompt chains
- **Opacity**: It's unclear why a particular prompt works or when it will fail

The authors observe that this is "conceptually akin to hand-tuning the weights for a classifier"—a practice the ML community abandoned decades ago in favor of learning algorithms.

## Signatures as Typed Interfaces

DSPy introduces **signatures** as a fundamentally different abstraction. A signature is "a short declarative spec that tells DSPy what a text transformation needs to do (e.g., 'consume questions and return answers'), rather than how a specific LM should be prompted to implement that behavior" (p. 4).

Concretely, a signature consists of:
1. Input field names (e.g., `question`, `context`)
2. Output field names (e.g., `answer`, `search_query`)
3. Optional instruction describing the transformation
4. Optional field metadata (descriptions, prefixes, types)

The simplest form uses shorthand notation:
```python
qa = dspy.Predict("question -> answer")
```

This single line specifies the interface—what goes in, what comes out—without prescribing implementation details. The DSPy compiler will interpret `question` differently from `answer` through in-context learning and iteratively refine usage based on the task.

## Key Benefits for Agent Systems

**1. Semantic Role Inference**: Field names carry semantic meaning. The signature `english_document -> french_translation` automatically prompts for English-to-French translation. The system infers transformation intent from the signature structure itself.

**2. Automatic Formatting**: Signatures "handle structured formatting and parsing logic to reduce (or, ideally, avoid) brittle string manipulation in user programs" (p. 4). The common failure mode of LM outputs not matching expected formats is handled systematically rather than through per-task regex hacking.

**3. Pipeline Adaptivity**: Because signatures are abstract, the same signature can be implemented differently depending on context. A `context, question -> answer` signature might use retrieval in one setting and pure reasoning in another, all determined by compilation rather than manual rewiring.

**4. Cross-LM Portability**: A signature compiled for GPT-3.5 can be recompiled for Llama2-13b or T5-Large. "DSPy programs compiled to open and relatively small LMs like 770M-parameter T5 and llama2-13b-chat are competitive with approaches that rely on expert-written prompt chains for proprietary GPT-3.5" (p. 1).

## From Signatures to Learned Prompts

The power of signatures emerges during compilation. The paper demonstrates that for GSM8K math problems, simple zero-shot instruction on GPT-3.5 achieves only 24% accuracy, while random few-shot examples reach 33.1%. But when DSPy compiles by bootstrapping demonstrations, accuracy jumps to 44.0% and iterative bootstrapping reaches 64.7% (Table 1, p. 8).

What happened? The compiler:
1. Simulated the program on training examples
2. Tracked which input-output patterns led to correct answers
3. Selected those patterns as demonstrations
4. Optimized demonstration selection via random search

The resulting prompts (Appendix F) contain task-appropriate demonstrations that were never hand-written. For HotPotQA multi-hop reasoning, the compiler learned to generate effective search queries through bootstrapped examples showing successful query formulation patterns.

## Design Principles for Agent Orchestration

For WinDAGs-style systems, this suggests several design principles:

**Principle 1: Skills Should Have Signatures, Not Prompts**
Rather than storing a prompt template for "code review," store a signature like `code, requirements -> review_comments, security_issues`. Let compilation determine optimal demonstration patterns for the current LM and task distribution.

**Principle 2: Signature Evolution Tracks Intent**
As skills evolve, signature changes capture semantic evolution. Changing `question -> answer` to `question, constraints -> answer, confidence` is a clear interface change that triggers recompilation, not silent prompt drift.

**Principle 3: Multi-Agent Coordination via Signature Composition**
When one agent needs another's output, compose signatures. If Agent A produces `task -> subtasks` and Agent B needs `subtask -> result`, the composition is explicit in types, and the compiler ensures compatible demonstrations.

**Principle 4: Failure Modes Become Signature Constraints**
Rather than debugging prompts, add constraints to signatures. If an agent produces ungrounded answers, the metric can enforce `answer_in_context` and recompilation will bootstrap only grounded examples.

## Boundary Conditions and Limitations

Signatures work best when:
- The transformation can be described in natural language types
- Example traces of correct behavior can be obtained (even noisily)
- The metric can evaluate output quality

They struggle when:
- The transformation requires procedural knowledge that can't be demonstrated
- No successful examples exist in reasonable simulation runs
- The task is so novel that field names don't carry semantic meaning

The paper notes that for very complex signatures, the expanded form with explicit instructions may be needed:
```python
class GenerateSearchQuery(dspy.Signature):
    """Write a simple search query that will help answer a complex question."""
    context = dspy.InputField(desc="may contain relevant facts")
    question = dspy.InputField()
    query = dspy.OutputField(dtype=dspy.SearchQuery)
```

This provides more control when the shorthand notation is insufficient.

## Connection to Program Synthesis

Signatures bear resemblance to type-directed program synthesis, where types constrain the space of valid programs. Here, natural language types constrain the space of valid prompts. The compiler searches this constrained space guided by metrics, similar to how synthesis searches are guided by input-output examples.

The key insight is that natural language is rich enough to specify interfaces for text transformations, just as formal types specify interfaces for functions. The "type system" is informal but interpretable by LMs, making it suitable for the inherently fuzzy domain of text processing.

## Implications for System Design

For a system with 180+ skills, the implications are profound:

1. **Reduced maintenance burden**: Changing the underlying LM doesn't require re-engineering 180+ prompts—just recompile all signatures against the new LM.

2. **Compositional reasoning**: New skills can be built by composing existing signatures, with automatic adaptation to the composition context.

3. **Systematic debugging**: When a skill fails, the question becomes "is the signature correct?" rather than "which part of this 2000-character prompt is wrong?"

4. **A/B testing at scale**: Different compilation strategies can be compared systematically across all skills.

The shift from imperative prompts to declarative signatures mirrors the historical shift from assembly to high-level languages—trading fine-grained control for composability, portability, and systematic optimization.
```

### FILE: bootstrapping-through-trace-analysis.md

```markdown
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
```

### FILE: parameterized-modules-as-learnable-techniques.md

```markdown
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
```

### FILE: compiler-based-optimization-for-pipelines.md

```markdown
# Compiler-Based Optimization for Pipelines: Treating Prompt Engineering as Program Compilation

## The Compiler Metaphor

DSPy introduces a genuinely novel idea: treating prompt optimization as **program compilation**. As the authors state, "We design a compiler that will optimize any DSPy pipeline to maximize a given metric" (p. 1). This isn't merely metaphorical—the DSPy compiler takes a program (DSPy modules composed in Python), a training set, and a metric, and produces an optimized program with different parameters.

The compilation pipeline mirrors traditional compilers:

**Input:** Source program (DSPy modules + control flow)
**Optimization:** Teleprompters (optimization strategies)  
**Output:** Optimized program (same structure, learned parameters)

But instead of optimizing assembly instructions, it optimizes how language models are invoked. Instead of register allocation, it's demonstration selection. Instead of loop unrolling, it's prompt formatting.

## The Three Stages of Compilation

### Stage 1: Candidate Generation

The compiler first identifies all unique `Predict` modules in the program, including those nested in higher-level modules. For each predictor, it generates candidate values for parameters—primarily **demonstrations** (example input-output pairs).

The key mechanism is **bootstrapping through simulation**: "The teleprompter will simulate a teacher program (or, if unset, the zero-shot version of the program being compiled) on some training inputs, possibly one or more times with a high temperature" (p. 7).

This creates a pool of potential demonstrations. Not all are good—the LM may produce nonsense on many runs. But "a well-decomposed program can typically find at least a few training examples where the LM can pass the constraints enforced by the signatures and metrics, allowing us to bootstrap iteratively if needed" (p. 7).

The demos are filtered by the metric: "The program's metric is used to filter for multi-stage traces that together help the pipeline pass the metric." Only demonstrations from successful runs are kept.

### Stage 2: Parameter Optimization

With candidate demonstrations available, the compiler must select which to use. The paper explores several strategies:

**Random Search (BootstrapFewShotWithRandomSearch):**
Generate multiple random demonstration sets, evaluate each, keep the best. Pseudocode from Appendix E.2:

```python
candidates = []
for seed in range(self.trials):
    shuffled_trainset = shuffle(trainset, seed=seed)
    candidate_program = BootstrapFewShot().compile(student, shuffled_trainset, teacher)
    score = evaluate_program(candidate_program, self.metric, valset)
    candidates.append((score, candidate_program))
return max(candidates, key=lambda x: x[0])[1]
```

This is remarkably simple yet effective. For GSM8K with GPT-3.5, this raises the reflection program from 71.7% (random few-shot) to 83.0% accuracy (Table 1).

**Bayesian Optimization (BootstrapFewShotWithOptuna):**
Treat demonstration selection as hyperparameter optimization using Tree-structured Parzen Estimators:

```python
for (name, predictor1), (_, predictor2) in \
    zip(pool.named_predictors(), candidate_program.named_predictors()):
    all_demos = predictor1.demos
    demo_index = trial.suggest_int(f"demo_index_for_{name}", 0, len(all_demos) - 1)
    predictor2.demos = [all_demos[demo_index]]
```

Optuna intelligently explores which demonstrations work best together, considering interactions between modules.

**Finetuning (BootstrapFinetune):**
Instead of in-context learning, update the LM's weights using demonstrations as training data. This produces specialized models:

```python
finetuning_teleprompter = BootstrapFinetune(metric=answer_passage_match)
compiled_rag_via_finetune = finetuning_teleprompter.compile(
    RAG(),
    teacher=compiled_rag,
    trainset=unlabeled_questions,
    target='google/flan-t5-large'
)
```

The finetuned T5-Large model achieves 39.3% on HotPotQA, competitive with much larger prompted models (p. 11).

### Stage 3: Higher-Order Program Optimization

Beyond parameter optimization, the compiler can modify control flow. The simplest form is **ensembling**:

```python
ensemble = Ensemble(reduce_fn=dspy.majority).compile(bootstrap.programs[:7])
```

This creates a new program that runs multiple variants in parallel and aggregates predictions. For GSM8K with GPT-3.5, ensembling seven bootstrapped CoT programs reaches 88.3% dev accuracy and 81.6% test accuracy (Table 1)—approaching the 92% that GPT-4 achieves (though GPT-4 was pre-trained on GSM8K training data).

The paper notes that "this stage can easily accommodate techniques for more dynamic (i.e., test-time) bootstrapping as well as automatic backtracking-like logic" (p. 7). Future work could optimize control flow itself—inserting retry loops, adding verification steps, or selecting between multiple strategies dynamically.

## Compile-Time vs Runtime

A crucial distinction: compilation happens once (or periodically), runtime execution uses compiled parameters. Compilation might take "minutes (or tens of minutes)" (p. 8), running the program thousands of times. But once compiled, runtime execution is just normal inference—no overhead from optimization.

This amortizes optimization cost. One compilation run produces a program usable for thousands or millions of runtime calls. This is exactly how traditional compilers work: slow compilation, fast execution.

For agent systems, this suggests:
- Compile skills offline or during low-load periods
- Use compiled versions in production
- Recompile when requirements change or new data accumulates
- Cache compiled programs for reuse

## The Power of Separation of Concerns

The compiler abstraction cleanly separates:

1. **What to compute** (signatures): "question -> answer"
2. **How to compute it** (modules): ChainOfThought, ReAct, etc.
3. **How to optimize it** (teleprompters): bootstrapping, random search, finetuning

This separation enables:

**Composable Optimization:** Different teleprompters for different parts of the pipeline. Expensive modules might use Bayesian optimization (fewer trials needed), cheap modules might use random search (more trials affordable).

**Progressive Refinement:** Start with simple bootstrapping, then apply random search, then Optuna, then ensembling. Each stage improves on the previous.

**Strategy Transfer:** The same teleprompter works across different programs. BootstrapFewShot doesn't know about GSM8K or HotPotQA—it just optimizes demonstration selection for any program.

## Metrics as Optimization Objectives

The metric defines "better." Simple metrics are functions:

```python
def exact_match(example, pred, trace=None):
    return example.answer == pred.answer
```

But metrics can be entire DSPy programs themselves:

```python
def answer_and_context_match(example, pred, trace=None):
    answer_match = dspy.evaluate.answer_exact_match(example, pred)
    
    # Is the prediction a substring of some passage?
    context_match = any((pred.answer.lower() in c) for c in pred.context)
    
    return answer_match and context_match
```

This allows expressing complex requirements: "answer must be correct AND grounded in retrieved context." The compiler optimizes for both simultaneously by only keeping demonstrations that satisfy both conditions.

You could even write: "answer must be correct AND another DSPy program verifies it's well-formatted AND a third program confirms it's safe." Each adds constraints that filter demonstrations during bootstrapping.

## Compilation Strategies in Practice

The paper demonstrates several compilation strategies:

**Cold Start → Warm Start:**
```python
# First, bootstrap from zero-shot
bootstrap1 = BootstrapFewShot().compile(program, trainset=train)

# Then use that as teacher for second round
bootstrap2 = BootstrapFewShot().compile(program, teacher=bootstrap1, trainset=train)
```

On GSM8K vanilla with GPT-3.5, this goes 33.1% → 44.0% → 64.7% (Table 1).

**Expensive Teacher → Cheap Student:**
```python
# Expensive GPT-3.5 program
expensive = compile_with_gpt35(program)

# Use it to teach T5-Large
cheap = BootstrapFinetune().compile(program, teacher=expensive, target='t5-large')
```

The T5 model becomes competitive with GPT-3.5 at a fraction of the cost.

**Ensembling Multiple Strategies:**
```python
# Try several compilation approaches
candidate1 = BootstrapFewShot().compile(...)
candidate2 = BootstrapFewShotWithRandomSearch().compile(...)  
candidate3 = BootstrapFewShotWithOptuna().compile(...)

# Ensemble the best
ensemble = Ensemble([candidate1, candidate2, candidate3])
```

Different strategies find different good solutions; ensemble captures multiple perspectives.

## Implications for Agent Orchestration

### 1. DAG-Level Optimization

In WinDAGs, a task gets decomposed into a DAG of subtasks. Each node is a skill invocation. Compilation can optimize:
- **Node level**: Each skill compiles independently  
- **Edge level**: How outputs from one skill feed into another
- **Path level**: Which paths through the DAG work best
- **Graph level**: Whether to parallelize, sequence, or retry nodes

The compiler sees the whole graph and can optimize globally, not just locally.

### 2. Online vs Offline Compilation

Most compilation is offline (before deployment). But you could compile online:
- Detect a skill is underperforming
- Trigger recompilation using recent failures
- A/B test the new version
- Roll out if better

This creates a self-improving system that adapts to shifting data distributions.

### 3. Multi-Objective Optimization

Metrics can balance multiple concerns:

```python
def composite_metric(example, pred, trace):
    quality = accuracy(example, pred)
    cost = sum(module.cost for module in trace)
    latency = trace.total_time
    
    return quality - 0.1 * cost - 0.05 * latency
```

The compiler finds the Pareto frontier of quality, cost, and latency. Different compilations make different tradeoffs.

### 4. Hierarchical Compilation

Compile subsystems independently, then compile the composition:

```python
# Compile skill A
compiled_A = teleprompter1.compile(skill_A, ...)

# Compile skill B  
compiled_B = teleprompter2.compile(skill_B, ...)

# Compile the system using them
system = SystemPipeline(compiled_A, compiled_B)
compiled_system = teleprompter3.compile(system, ...)
```

This mirrors how traditional compilers optimize functions, then optimize the program linking them.

## Boundary Conditions

Compilation requires:

1. **Training data**: At least some examples to simulate on. The paper uses 200-300 for GSM8K and HotPotQA.

2. **Compute budget**: Thousands of LM calls during compilation. Expensive for large models, but amortized across many runtime uses.

3. **Meaningful metric**: If the metric doesn't distinguish good from bad, optimization is aimless.

4. **Non-adversarial setting**: Compilation assumes the distribution is stationary. If inputs are adversarial (trying to fool the system), compiled parameters may not transfer.

The paper notes that "compiling generally runs on the order of minutes (or tens of minutes)" (p. 8) for their tasks. Larger programs or more trials increase time, but rarely beyond an hour.

## The Deeper Principle

Compiler-based optimization embodies a profound shift: from **artisanal prompt crafting** to **systematic prompt optimization**. The prompts don't disappear—they're in Appendix F, still 1000+ characters. But they're **generated** by the compiler, not written by humans.

This is exactly the shift that happened with neural networks. Early networks had hand-tuned weights. Then backpropagation: weights are learned from data. The weights don't disappear, but they're generated by optimization, not set by humans.

DSPy brings the same evolution to prompts. The prompts don't disappear, but they're generated by teleprompters, not written by prompt engineers. And just as backprop enabled neural networks to scale to billions of parameters, compiler-based optimization could enable prompt-based systems to scale to hundreds of interacting skills.

For a system with 180+ skills, this is the difference between:
- **Artisanal**: 180 hand-crafted prompts, each requiring expert tuning, breaking when LMs change
- **Systematic**: 180 modules with signatures, compiled automatically, adapting when LMs change

The latter is maintainable, testable, and improvable. The former is not. The compiler makes the latter possible.
```

### FILE: metrics-as-executable-specifications.md

```markdown
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
```

### FILE: modular-composition-in-complex-systems.md

```markdown
# Modular Composition in Complex Systems: Building Intelligent Pipelines from Composable Units

## The Modularity Problem in LM Systems

Current approaches to building LM pipelines suffer from what we might call "monolithic prompt syndrome." Each pipeline gets hand-crafted as a lengthy prompt string, making composition difficult. As the DSPy paper observes: "LM calls in existing LM pipelines and in popular developer frameworks are generally implemented using hard-coded 'prompt templates', that is, long strings of instructions and demonstrations that are hand crafted through manual trial and error" (p. 2).

When you want to combine techniques—say, chain-of-thought with retrieval with self-correction—you're essentially concatenating and manually orchestrating prompt strings. There's no clean abstraction boundary. Change one part, and you might break others. Use a different LM, and the whole string needs re-engineering.

DSPy's solution is genuine modularity: "DSPy modules are task-adaptive components—akin to neural network layers—that abstract any particular text transformation" (p. 2). Like neural network layers (convolution, attention, normalization), DSPy modules are generic components that compose into arbitrary architectures.

## The Anatomy of Modular Composition

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

This 14-line program composes three modules:
1. **Retrieve**: Searches for passages (tool use)
2. **ChainOfThought (query)**: Generates search queries with reasoning
3. **ChainOfThought (answer)**: Generates answers with reasoning

Each module is independently parameterized. During compilation:
- `generate_query` learns demonstrations of effective query generation
- `generate_answer` learns demonstrations of effective answer generation given context
- Both learn optimal prompt formats for the target LM

The key insight: **modules don't know about each other during definition, but learn to coordinate during compilation**. The query generator doesn't have hardcoded knowledge of what makes a "good query for the retriever." It learns from traces where its queries led to retrievals that led to correct answers.

## Composition Patterns

### Sequential Composition

The simplest pattern: output of module A feeds into module B:

```python
class RAG(dspy.Module):
    def __init__(self, num_passages=3):
        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate_answer = dspy.ChainOfThought("context, question -> answer")
    
    def forward(self, question):
        context = self.retrieve(question).passages
        return self.generate_answer(context=context, question=question)
```

Context flows from retrieval to generation. During bootstrapping, `generate_answer` sees demonstrations of answers grounded in retrieved context, automatically learning to reference passages.

### Parallel Composition

Multiple modules process the same input, results are aggregated:

```python
class ThoughtReflection(dspy.Module):
    def __init__(self, num_attempts):
        self.predict = dspy.ChainOfThought("question -> answer", n=num_attempts)
        self.compare = dspy.MultiChainComparison('question -> answer', M=num_attempts)
    
    def forward(self, question):
        completions = self.predict(question=question).completions
        return self.compare(question=question, completions=completions)
```

This generates five reasoning chains in parallel, then synthesizes them. The `compare` module learns to identify patterns across multiple chains, weighing evidence from different reasoning paths.

On GSM8K with GPT-3.5, this reflection pattern achieves 83% accuracy (bootstrap), substantially better than single-chain CoT at 63% (Table 1, p. 8). The composition captures the intuition that multiple perspectives improve reasoning—but without hardcoded aggregation logic. The `MultiChainComparison` module learns how to synthesize from demonstrations.

### Iterative Composition

Modules can invoke each other repeatedly in loops:

```python
def forward(self, question):
    context = []
    for hop in range(2):
        query = self.generate_query(context=context, question=question).search_query
        context += self.retrieve(query).passages
    return self.generate_answer(context=context, question=question)
```

Each iteration of the loop adds to `context`, creating a growing information base. The query generator at hop 2 sees hop 1's context, allowing it to ask follow-up questions. This emerges from the signature `context, question -> search_query` and bootstrapped demonstrations, not from manual prompt engineering.

### Hierarchical Composition

Modules can contain submodules arbitrarily deeply:

```python
class ComplexAgent(dspy.Module):
    def __init__(self):
        self.planner = PlanningModule()  # Contains its own submodules
        self.executor = ExecutionModule()  # Contains its own submodules
        self.verifier = VerificationModule()  # Contains its own submodules
    
    def forward(self, task):
        plan = self.planner(task=task)
        result = self.executor(plan=plan)
        if not self.verifier(result=result, task=task).is_valid:
            # Retry logic
            result = self.executor(plan=self.planner.refine(task=task, previous=plan))
        return result
```

Each top-level module is itself a composition of sub-modules. The compiler optimizes the entire hierarchy, bootstrapping demonstrations at each level.

## Type Safety Through Signatures

Signatures provide a form of type safety for composition. If module A outputs `search_query: str` and module B expects `query: str`, the composition works. If there's a mismatch, it's caught at construction time (or at least, can be caught with appropriate validation).

More sophisticated type checking could verify:
- Module A produces field X
- Module B consumes field X  
- Field X has compatible type/constraints

This prevents a common failure mode in prompt engineering: building a pipeline where step 3 expects output format from step 2 that step 2 doesn't actually produce. With signatures, such mismatches are explicit.

## Learning Through Composition

The power of modular composition emerges during compilation. Consider what happens when compiling `BasicMultiHop`:

1. **Zero-shot execution**: The system runs with no demonstrations, likely producing low-quality queries and answers. Most runs fail the metric.

2. **Find success**: Eventually, through temperature sampling or multiple attempts, some runs succeed. Maybe the LM got lucky and generated a good first query, retrieved relevant passages, generated a good second query, and produced a correct answer.

3. **Decompose success**: The compiler extracts demonstrations from the successful run:
   - First query generation: `(context=[], question=Q) -> query=Q1`
   - Second query generation: `(context=[passages from Q1], question=Q) -> query=Q2`  
   - Answer generation: `(context=[passages from Q1 and Q2], question=Q) -> answer=A`

4. **Generalize**: These demonstrations go into their respective modules' prompt. Now each module has an example of success in its specific role.

5. **Iterate**: With demonstrations, the program succeeds more often, producing more demonstrations, enabling further optimization.

This is visible in the results: HotPotQA multi-hop with GPT-3.5 goes from 36.9% (few-shot) to 48.7% (bootstrap) (Table 2, p. 11). For Llama2-13b-chat: 34.7% to 42.0%. The modules learned to coordinate through shared successful executions.

## Composition Scales Across LMs

A remarkable property: the same composition works across different LMs with recompilation. The RAG program is 6 lines, identical for GPT-3.5 and Llama2-13b-chat. But compilation learns different demonstrations appropriate to each LM's capabilities and training.

This is shown in Table 2: the same `multihop` program achieves 48.7% (GPT-3.5) and 42.0% (Llama2) after bootstrap compilation. Different demonstrations, same code structure.

Even more striking: compile to T5-Large (770M parameters):
```python
multihop_t5 = dspy.BootstrapFinetune().compile(
    program,
    teacher=bootstrap,
    trainset=trainset,
    target='t5-large'
)
```

This achieves 39.3% accuracy—competitive with Llama2-13b-chat (16× larger) and approaching GPT-3.5 (p. 11). The modular structure enables knowledge transfer: the teacher's execution traces become the student's training data.

## Implications for WinDAGs

### 1. DAG Construction from Module Composition

WinDAGs already uses DAG structure for task decomposition. DSPy modules suggest how to implement nodes:

```python
class TaskDecomposer(dspy.Module):
    def __init__(self):
        self.analyze = dspy.ChainOfThought("task, constraints -> subtasks: list")
        self.prioritize = dspy.Predict("subtasks: list -> dag: Dict[str, List[str]]")
    
    def forward(self, task, constraints):
        subtasks = self.analyze(task=task, constraints=constraints).subtasks
        dag = self.prioritize(subtasks=subtasks).dag
        return dag
```

Each node in the resulting DAG can itself be a DSPy module, compiled independently or as part of the larger pipeline.

### 2. Adaptive Routing

Module composition enables learned routing:

```python
class AdaptiveRouter(dspy.Module):
    def __init__(self, routes):
        self.classifier = dspy.Predict("task -> route: str")
        self.routes = {name: module for name, module in routes}
    
    def forward(self, task):
        route_name = self.classifier(task=task).route
        return self.routes[route_name](task)
```

The classifier learns from demonstrations which tasks should go to which specialist modules. No hand-coded rules.

### 3. Skill Discovery Through Composition

New skills can be discovered by composing existing ones:

```python
# Existing skills
debug_skill = dspy.ChainOfThought("code, error -> diagnosis")
fix_skill = dspy.ChainOfThought("code, diagnosis -> fixed_code")
test_skill = dspy.Predict("code -> test_results")

# Discovered composition
class SelfHealingDebugger(dspy.Module):
    def forward(self, code, error):
        diagnosis = debug_skill(code=code, error=error).diagnosis
        fixed = fix_skill(code=code, diagnosis=diagnosis).fixed_code
        tests = test_skill(code=fixed).test_results
        if not tests.passed:
            # Recursive composition
            return self.forward(fixed, tests.error)
        return fixed
```

This composition might be discovered through search over possible arrangements, then compiled to optimize its constituent modules.

### 4. Cross-Agent Protocol Learning

When multiple agents coordinate, their interaction protocol can be learned:

```python
class AgentCollaboration(dspy.Module):
    def __init__(self, agent_a, agent_b):
        self.agent_a = agent_a
        self.agent_b = agent_b
        self.messenger = dspy.ChainOfThought("context, agent_a_output -> message_to_agent_b")
    
    def forward(self, task):
        a_result = self.agent_a(task=task)
        message = self.messenger(context=task, agent_a_output=a_result).message_to_agent_b
        b_result = self.agent_b(message=message, context=task)
        return (a_result, b_result)
```

The `messenger` module learns to translate A's output into the format B needs, discovered through bootstrapping successful collaborations.

## Boundary Conditions

Modular composition works best when:

1. **Clean interfaces**: Modules have well-defined signatures. Fuzzy or overlapping responsibilities make composition brittle.

2. **Appropriate granularity**: Too fine-grained (modules doing trivial operations) adds overhead. Too coarse-grained (modules doing multiple conceptual operations) reduces reusability.

3. **Observable interactions**: The compiler can see how modules interact through traces. Black-box external tools are harder to optimize around.

4. **Composable metrics**: The top-level metric must provide signal about whether compositions work. If only end-to-end performance matters, the compiler can't assign credit to individual modules.

The paper's programs demonstrate good granularity: each module handles one conceptual operation (generate query, retrieve, generate answer), and metrics evaluate end-to-end performance that decomposes cleanly.

## The Deeper Principle

Modular composition in DSPy embodies **separation of architecture from parameterization**. The architecture (which modules, how connected) is specified by the programmer through normal Python code. The parameterization (what demonstrations, what instructions) is learned by the compiler.

This mirrors the evolution of neural networks: early networks had hand-tuned architectures and hand-initialized weights. Then came standardized layers (conv, pool, fc) with learned weights. Then came architecture search with learned structures.

DSPy is in the "standardized layers, learned parameters" phase for LM pipelines. The programmer specifies the computational graph (this pipeline does retrieval, then query generation, then more retrieval, then answer generation). The compiler learns optimal parameters for each node (what demonstrations make retrieval-aware query generation effective?).

Future work might explore architecture search: the compiler not only optimizes parameters but explores alternative module compositions. But even without that, the current framework dramatically reduces the engineering burden of building complex LM systems.

For a system with 180+ skills, modularity is non-negotiable. Hand-crafting 180 monolithic prompts is fragile and unscalable. Composing 180 skills from a library of ~20-30 well-optimized modules, each compiled automatically, is maintainable and powerful. The modules become building blocks; the compiler ensures they work together; the result is systems that approach the sophistication of hand-crafted pipelines with a fraction of the engineering effort.
```

### FILE: failure-modes-and-recovery-strategies.md

```markdown
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
```

### FILE: knowledge-vs-execution-gap.md

```markdown
# The Knowledge-vs-Execution Gap: Why Knowing What to Do Differs from Doing It Effectively

## The Gap Revealed

DSPy exposes a profound gap in how we think about intelligent systems: **knowing what technique to apply differs fundamentally from knowing how to apply it effectively.** The paper states this obliquely: "DSPy modules translate prompting techniques into modular functions that support any signature, contrasting with the standard approach of prompting LMs with task-specific details" (p. 4).

Consider Chain-of-Thought reasoning. The *knowledge* of CoT is simple: "reason step-by-step before answering." You could explain this to a human in one sentence. But the *execution* of CoT—what demonstrations to show, how to format the reasoning, when to use it vs. other techniques—requires thousands of characters of carefully crafted prompts (Appendix C shows prompts of 500-4000+ characters).

DSPy formalizes this gap: techniques become generic modules (knowledge), demonstrations become learned parameters (execution). A 12-line generic `ChainOfThought` implementation (p. 5) outperforms hand-crafted task-specific prompts because the execution details are learned automatically rather than manually specified.

## Why the Gap Exists

### 1. Context Dependence

Effective execution depends on context that isn't captured in technique descriptions:
- **Task domain**: CoT demonstrations for math look nothing like CoT demonstrations for legal reasoning
- **LM being used**: GPT-3.5 responds differently to instructions than Llama2-13b-chat
- **Pipeline position**: CoT in isolation differs from CoT following retrieval
- **Data distribution**: Demonstrations for simple questions don't transfer to complex questions

The paper demonstrates this through cross-LM and cross-task results. The same `ChainOfThought` module, compiled separately for GSM8K and HotPotQA, learns completely different demonstrations. On GSM8K with GPT-3.5, bootstrap compilation achieves 80.3% (Table 1, p. 8). On HotPotQA, the RAG program with CoT achieves 42.3% (Table 2, p. 11). Same technique, different contexts, different learned execution strategies.

### 2. Interaction Effects

In multi-stage pipelines, execution of one stage affects optimal execution of subsequent stages. The paper's `BasicMultiHop` program illustrates:

```python
def forward(self, question):
    context = []
    for hop in range(2):
        query = self.generate_query(context=context, question=question).search_query
        context += self.retrieve(query).passages
    return self.generate_answer(context=context, question=question)
```

The query generation module's execution strategy must account for:
- What the retrieval system returns (format, quality, length of passages)
- How the answer generation module will use the context
- What the first hop retrieved (to avoid redundancy in second hop)

No static prompt can capture these dependencies. But compilation observes full pipeline traces and learns execution strategies that work together. The result: multi-hop achieves 48.7% while simple RAG gets 42.3% with GPT-3.5 (Table 2).

### 3. Tacit Knowledge

Much of effective execution is tacit—difficult or impossible to articulate explicitly. Researchers who write effective prompts often can't fully explain why they work. They might say "I tried different phrasings until it worked," which is trial-and-error, not transferable knowledge.

DSPy makes this tacit knowledge explicit through demonstrations. The compiler's bootstrapping process effectively performs the trial-and-error automatically, finding execution patterns that work, then generalizing them as demonstrations for future use.

The automatically generated prompts in Appendix F reveal patterns that weren't explicitly programmed:
- Question decomposition strategies
- Reasoning chain structures  
- Context utilization patterns
- Query refinement approaches

These emerged from optimization, not from human specification.

## How DSPy Bridges the Gap

### Separating Strategy from Tactics

DSPy enforces a clean separation:

**Strategy (knowledge)**: The module structure captures high-level approach. "Use retrieval, generate queries, think step-by-step, compare multiple chains."

**Tactics (execution)**: The learned parameters capture low-level implementation. "Show these specific examples of effective query generation. Format reasoning chains this way. Weight evidence like this."

This separation allows strategy to be specified by humans (who understand problem structure) while tactics are learned by compilers (who can explore the space of effective executions).

The paper shows this in the `ThoughtReflection` program (p. 8):
```python
class ThoughtReflection(dspy.Module):
    def __init__(self, num_attempts):
        self.predict = dspy.ChainOfThought("question -> answer", n=num_attempts)
        self.compare = dspy.MultiChainComparison('question -> answer', M=num_attempts)
    
    def forward(self, question):
        completions = self.predict(question=question).completions
        return self.compare(question=question, completions=completions)
```

The strategy is clear: generate multiple reasoning chains, compare them, synthesize an answer. The tactics—what makes a "good" reasoning chain, how to weight different chains, what comparison criteria to use—are learned during compilation.

Result: 83% accuracy (bootstrap) on GSM8K vs 63% for basic CoT (Table 1), despite only minor additional strategic complexity.

### Learning From Successful Executions

Traditional approaches try to specify effective execution through explicit instructions. DSPy learns from examples of effective execution through bootstrapping:

1. Run program (with possibly weak execution)
2. Filter for successful runs (via metrics)
3. Extract execution traces from successes
4. Use traces as demonstrations for future runs

This inverts the knowledge-execution relationship. Instead of "specify how to execute, then execute," it's "execute (possibly poorly), then learn better execution from what worked."

The power of this inversion is visible in iterative bootstrapping. GSM8K vanilla with GPT-3.5 (Table 1):
- Few-shot (specified execution via random examples): 33.1%
- Bootstrap (learned execution from successful traces): 44.0%
- Bootstrap×2 (learned from traces of learned execution): 64.7%

Each iteration's learned execution becomes the foundation for the next iteration's learning, creating a compounding improvement effect.

### Adapting Execution to Constraints

The metric defines what counts as "effective execution." By changing metrics, you change what execution patterns are learned, without changing the strategic module structure.

Example from the paper (p. 6):
```python
def answer_and_context_match(example, pred, trace=None):
    answer_match = dspy.evaluate.answer_exact_match(example, pred)
    context_match = any((pred.answer.lower() in c) for c in pred.context)
    return answer_match and context_match
```

This metric enforces extractive answering. The compilation process will only keep demonstrations where answers appear in context. The system learns extractive execution patterns even though nothing in the module code specifies "be extractive."

This is execution learning guided by constraints, not by explicit procedure specification.

## Implications for Agent Systems

### 1. Skill Specifications vs. Skill Implementations

For each of 180+ skills in WinDAGs:

**Specify**: What the skill should accomplish (signature)
```python
code_review = dspy.ChainOfThought("code, requirements -> issues, suggestions")
```

**Don't specify**: How to accomplish it effectively (let compilation learn)
- Which example code reviews demonstrate good analysis?
- What reasoning patterns lead to finding bugs?
- How should suggestions be formatted and prioritized?

The skill specification captures human knowledge of what code review entails. The skill implementation (learned demonstrations) captures what effective code review looks like in practice.

### 2. Progressive Capability Acquisition

Systems can know *about* a capability before knowing *how to execute* it effectively:

```python
# Day 1: Define skill (knowledge)
debug_skill = dspy.ChainOfThought("code, error -> diagnosis, fix")

# Day 2-7: Accumulate execution experience
for case in training_cases:
    result = debug_skill(code=case.code, error=case.error)
    if human_validates(result):
        success_traces.append(result.trace)

# Day 8: Learn effective execution from accumulated experience
debug_skill = compile_from_traces(debug_skill, success_traces)
```

The skill exists from day 1, but its execution quality improves as it learns from experience. This mirrors human skill development: we can describe what an expert does before we can do it expertly ourselves.

### 3. Execution Specialization

Different execution contexts may require different tactics while using the same strategy:

```python
# General code review skill (strategy)
base_review = dspy.ChainOfThought("code, requirements -> issues")

# Specialized execution for security reviews
security_review = compile(base_review, metric=security_focused_metric, trainset=security_cases)

# Specialized execution for performance reviews
performance_review = compile(base_review, metric=performance_focused_metric, trainset=performance_cases)

# Specialized execution for readability reviews
readability_review = compile(base_review, metric=readability_focused_metric, trainset=readability_cases)
```

Same strategic structure, different learned demonstrations optimized for different execution goals. The system "knows" code review (strategy) but "executes" it differently based on context.

### 4. Execution Transfer

Effective execution in one domain can inform execution in related domains:

```python
# Learn effective Python debugging
python_debug = compile(debug_skill, trainset=python_cases)

# Use Python debugging demonstrations as starting point for JavaScript debugging
javascript_debug = compile(debug_skill, teacher=python_debug, trainset=javascript_cases)
```

The teacher's execution patterns (how it structures diagnosis, what it looks for, how it explains fixes) transfer to the student, providing a better initialization than zero-shot learning.

The paper demonstrates this in finetuning T5-Large with Llama2-13b-chat as teacher (p. 11). The teacher's execution knowledge transfers to the student through demonstrations, enabling effective execution with a much smaller model.

## The Deeper Principle

The knowledge-execution gap reveals a fundamental limitation of current AI system design: **we treat prompts as both specification and implementation**. When you write "Answer the question step-by-step," you're simultaneously:
- Specifying what to do (use reasoning chains)
- Implementing how to do it (this particular phrasing and format)

DSPy separates these concerns. Modules + signatures = specification. Learned parameters = implementation. This separation enables:

**Specification reuse**: Same module works across tasks, LMs, domains
**Implementation adaptation**: Execution automatically optimizes for context
**Independent evolution**: Specifications can evolve without breaking implementations; implementations can improve without changing specifications

This mirrors the evolution of software engineering. Early programs intertwined specification and implementation. Modern programs separate interfaces (specifications) from implementations. DSPy brings this separation to LM systems.

For orchestration systems coordinating 180+ skills, this separation is transformative:
- Skills can be specified once, deployed everywhere
- Implementations improve through experience without code changes
- New skills can be added by specifying their purpose, not their execution
- Execution strategies can be shared across related skills

The gap between knowing and doing becomes a feature, not a bug: it's the space where automated optimization happens, the interface where human strategic knowledge combines with machine-learned tactical execution to create systems more capable than either alone could produce.
```

## SKILL ENRICHMENT

- **Task Decomposition**: DSPy's approach to multi-stage pipelines directly enriches decomposition skills by teaching how to break complex problems into modules with clear signatures. The BasicMultiHop pattern (iterative query generation → retrieval → answer generation) provides a template for decomposing multi-hop reasoning tasks. Skills can learn to recognize when intermediate steps need their own reasoning chains vs.