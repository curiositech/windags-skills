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