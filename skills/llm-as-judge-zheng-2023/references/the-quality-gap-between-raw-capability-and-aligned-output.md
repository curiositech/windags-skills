# Capability vs. Alignment: What Fine-Tuning on Conversation Does (and Doesn't) Change

## The MMLU Paradox

The central empirical puzzle that motivates this entire research program is what we can call the MMLU paradox:

LLaMA-13B, trained on 1 trillion tokens without instruction fine-tuning, scores 47.0 on MMLU (5-shot). Vicuna-7B (selected), trained on only 4.8 million tokens of high-quality GPT-4 conversations, scores 37.3 on MMLU — meaningfully worse. Yet on MT-Bench (measuring multi-turn conversation quality and human preference), LLaMA-13B scores 2.61 while Vicuna-7B (selected) scores 5.95 — more than twice as good.

Ninety-one percent fewer training tokens. Dramatically lower capability benchmark score. More than 2x better at what users actually care about.

This is not a measurement artifact. It is revealing something fundamental about what capability benchmarks measure vs. what matters for real AI system utility.

---

## What Conversation Fine-Tuning Actually Changes

The paper's training ablations (Table 8) allow precise conclusions:

### What conversation fine-tuning changes dramatically:
- **Conversational coherence**: The ability to maintain topic, context, and intent across multiple turns
- **Instruction following**: Adherence to multi-part, complex, or constrained instructions
- **Output style alignment**: Producing responses in formats and styles that humans find natural and useful
- **Human preference metrics**: MT-Bench score, Chatbot Arena win rate

### What conversation fine-tuning changes modestly:
- **Core knowledge**: MMLU scores improve with more conversation data (Vicuna-7B all: 47.1 vs. LLaMA-7B: 35.2) but the improvement is partially obscured by the data volume effect
- **Factual accuracy**: TruthfulQA scores improve slightly (Vicuna-13B: 0.35 vs. LLaMA-13B: 0.26)

### What conversation fine-tuning does NOT change:
- The underlying knowledge that enables performance on closed-domain benchmarks is not significantly affected by small-scale conversation fine-tuning
- LLaMA's competitive MMLU performance despite being preferred far less by humans demonstrates that knowledge and utility are genuinely separable

**The key quote**: "A small high-quality conversation dataset can quickly teach the model a style preferred by GPT-4 (or approximately human) but cannot improve MMLU significantly."

---

## The "Style" Hypothesis and Its Implications

The paper's finding suggests that much of what makes a model "good" for human users is not knowledge — it is the ability to package knowledge in the format that users find helpful. This "style" includes:

1. **Response structure**: Using numbered lists when appropriate, providing context before conclusions, organizing complex answers
2. **Instruction adherence**: Following all parts of a multi-part instruction, not just the most salient part
3. **Turn-appropriate depth**: Providing the right level of detail for the question type and context
4. **Conversational continuity**: Maintaining context from prior turns, referencing prior answers, building on established understanding

Critically, this style is learnable from a small number of high-quality examples. Vicuna-7B (selected) — trained on only 3,000 GPT-4 conversations — demonstrates this conclusively.

**For agent system design**: This means that an agent's effectiveness for user-facing tasks depends substantially on training data quality and format, not just model scale. A smaller model fine-tuned on high-quality, representative interactions may outperform a larger raw model on actual user tasks.

---

## The Alignment Gap in Practice: Figure 1 Illustrated

The paper's opening figure shows two assistants responding to an MMLU question about Federal Reserve bond buying, followed by a follow-up question about daily life impacts.

**LLaMA-13B (Assistant A)**:
Turn 1: "The Federal Reserve buys bonds in the secondary market to increase the money supply."
Turn 2: "The Federal Reserve buys bonds in the secondary market to increase the money supply. This affects your daily life by: 1. Increasing the money supply. 2. Increasing the money supply and lowering the discount rate. 3. Increasing the money supply and lowering the discount rate and increasing the money supply."

This response is repetitive, incoherent, and fails to follow the instruction to give "3 examples" of daily life impacts. On MMLU, LLaMA-13B answers the base question correctly (it knows the answer). But it cannot translate that knowledge into a useful multi-turn response.

**Vicuna-13B (Assistant B)** provides three distinct, substantive examples (interest rates, inflation, employment) with appropriate elaboration. It follows instructions, maintains coherence, and produces output that is genuinely useful to the user.

The models have similar MMLU scores. Their utility is dramatically different. MMLU cannot see this difference. GPT-4 can.

---

## What This Means for Agent System Design

### Capability Selection vs. Task Fitness

In WinDAGs, when selecting which agent to route a task to, the question is not just "which agent is most capable?" but "which agent is most capable for this type of task?"

The capability-preference distinction maps to a routing distinction:

**Tasks where capability benchmarks are reliable routing signals**:
- Factual lookup and retrieval (knowledge is the bottleneck)
- Mathematical computation (accuracy is the bottleneck)
- Code generation in isolated functions (correctness is the bottleneck)
- Multi-choice question answering

**Tasks where preference metrics are better routing signals**:
- Multi-turn dialogue assistance
- Document summarization for human consumption
- Creative writing and content generation
- Task planning and complex instruction following
- User-facing explanation and education

A routing agent that uses only capability scores (MMLU-equivalent) will systematically misroute conversational and preference-dependent tasks.

### The Training Data Design Implication

The finding that 3,000 high-quality GPT-4 conversations can dramatically improve conversational performance suggests a principle for agent improvement:

**Agent performance on preference-sensitive tasks is more efficiently improved by training on small amounts of high-quality exemplar interactions than by scaling training data volume.**

This means that when an agent is underperforming on multi-turn tasks, the most efficient improvement path may not be "scale up the base model" but "fine-tune on 3,000 carefully selected high-quality interactions of the target task type."

### The Quality Pyramid of Training Data

The Vicuna training ablations reveal a quality-quantity tradeoff:
- 3,000 high-quality GPT-4 conversations (4.8M tokens): MT-Bench 5.95
- 257,000 single-turn conversations (184M tokens, less curated): MT-Bench 6.04
- 257,000 full multi-turn conversations (370M tokens): MT-Bench 6.39

The returns to quality are large at low data volume. The returns to quantity are real but less dramatic. The practical implication: curated, high-quality training examples deliver more improvement per dollar than raw data volume, especially in early training stages.

---

## The Data Selection Method: A Reusable Pattern

For the "selected" dataset, the researchers use a principled method worth noting:

1. Filter for sequences with at least 3 turns generated by GPT-4 (quality filter)
2. Run clustering algorithm to identify 3,000 diverse clusters
3. Select the centroid of each cluster (diversity-maximizing selection)

This method — quality filter + clustering + centroid selection — is a general-purpose technique for building small, high-quality, diverse training datasets from large corpora. It selects examples that are both high quality (GPT-4 generated, multi-turn) and maximally representative of the space (cluster centroids).

**For agent system improvement**: When collecting training data to fine-tune an agent on a new task domain, apply this method: (1) filter by quality signal, (2) cluster by task type and structure, (3) select diverse representatives. This will produce a small, high-quality, representative dataset more efficiently than random sampling.

---

## The Boundary Condition: When Alignment Doesn't Help

The paper focuses on tasks where human preference is a meaningful signal. There is a class of tasks where alignment fine-tuning may actively degrade performance:

- **Formal theorem proving**: The "style" of human-preferred responses may interfere with rigorous logical derivation
- **Adversarial robustness**: Alignment toward helpfulness may reduce resistance to adversarial prompts
- **Raw knowledge recall**: As seen in MMLU, alignment fine-tuning on small datasets can *reduce* knowledge benchmark performance
- **Tool use requiring precise syntax**: Human-preferred verbose explanations may be worse than terse correct syntax for tool-calling

**The key question**: Is the task's quality metric measured by human preference or by formal correctness? Alignment fine-tuning optimizes for human preference. For tasks with objective correctness criteria, it may not help and may hurt.

Agent routing should take this into account: prefer base (less aligned) models for formal correctness tasks, prefer aligned models for human-facing preference tasks.