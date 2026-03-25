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