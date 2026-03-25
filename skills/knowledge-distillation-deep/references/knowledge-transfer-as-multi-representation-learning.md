# Knowledge Transfer as Multi-Representation Learning

## The Core Insight: Knowledge Lives in Multiple Places

Knowledge distillation reveals a profound insight about intelligent systems: what a system "knows" exists simultaneously in multiple forms, each capturing different aspects of understanding. This paper systematically documents these forms:

1. **Hard labels**: One-hot encoded ground truth (discrete decisions)
2. **Soft labels**: Probability distributions over classes (uncertainty quantification)
3. **Logits**: Pre-activation scores (raw decision boundaries before normalization)
4. **Feature maps**: Intermediate layer activations (hierarchical representations)
5. **Activation boundaries**: Hyperplanes determining neuron firing (decision geometry)

The existence of these multiple representations challenges the assumption that knowledge transfer requires copying all model parameters. Instead, as Hinton, Vinyals & Dean (2015) demonstrated in their foundational work, "the relative probabilities of incorrect answers" contain crucial information about how a model generalizes. A teacher model that assigns probability 0.9 to "cat," 0.08 to "dog," and 0.02 to "car" for an image is revealing far more about its understanding than just the label "cat."

## Implications for Agent System Design

### 1. Skill Decomposition Should Match Knowledge Granularity

When building agent systems with 180+ skills, the question arises: how should specialized skills transfer knowledge to generalist agents or to each other? The distillation literature provides clear guidance:

**Soft label transfer** (probability distributions) is most effective when:
- The source and target tasks are identical
- The student needs to learn uncertainty calibration
- The source model's "dark knowledge" (subtle inter-class relationships) is valuable

**Feature map transfer** (intermediate representations) is most effective when:
- The source and target tasks are related but not identical
- The student needs to learn hierarchical feature extraction
- Different parts of the problem-solving pipeline can be modularized

**Activation boundary transfer** (Heo et al., 2019) is most effective when:
- The decision geometry matters more than specific activations
- The student architecture differs significantly from the teacher
- Binary decision rules are more important than gradients

For a WinDAG system, this means: **a skill should not just expose its final outputs, but also its intermediate reasoning steps, its confidence distributions, and its decision boundaries**. A "code review" skill shouldn't just return "approved/rejected"—it should expose which code patterns triggered which rules, with what confidence levels, allowing other agents to learn the *structure* of good code review reasoning.

### 2. The Multi-Teacher Pattern for Handling Uncertainty

Fukuda et al. (2017) demonstrated that training a student on individual teacher predictions rather than averaged predictions helps "the student model to observe the input data from different angles." This is counterintuitive—ensemble averaging typically improves performance, but for knowledge transfer, preserving disagreement is more valuable than consensus.

In agent orchestration, this translates to a critical principle: **when multiple specialized agents provide recommendations, preserving their individual perspectives may teach more than aggregating them**. If three agents analyze a security vulnerability with confidence scores of 0.9, 0.6, and 0.3, a student agent learns more from seeing all three perspectives than from seeing their average (0.6). The disagreement itself is information about:
- Which aspects of the problem are ambiguous
- Which features different experts weight differently
- Where edge cases exist in the problem space

### 3. Hierarchical Abstraction and the Layer Selection Problem

Li et al. (2019) introduced Layer Selectivity Learning (LSL), which identifies intermediate layers that are "most informative and discriminative across different classes" using inter-layer Gram matrices. This addresses a fundamental problem: **not all intermediate representations are equally valuable for transfer**.

For agent systems, this insight is critical: when a complex agent decomposes a problem hierarchically, not all intermediate steps should be exposed for knowledge transfer. Some intermediate representations are:
- **Too high-level**: Already close to the final output, containing little additional structure
- **Too low-level**: Representing implementation details rather than conceptual understanding
- **Task-specific**: Useful for the specific instance but not generalizable

The LSL approach suggests measuring informativeness through **inter-layer correlation matrices**—essentially, which intermediate steps capture unique variance not present in other steps. In a DAG-based orchestration system, this means: track which intermediate agent outputs are actually used by downstream agents. If an intermediate result is rarely referenced or easily reconstructed from other signals, it's not a valuable transfer point.

### 4. The Self-Distillation Paradox: Models Teaching Themselves

Furlanello et al. (2018) demonstrated "Born-Again Neural Networks" where a student of identical architecture to the teacher achieves better performance. Their explanation: the student learns not just from the training data's hard labels, but from the teacher's predictions, which contain "regularization through the teacher's prediction uncertainty."

This creates a paradox: **a model can be improved by learning from itself**. The mechanism is that random initialization creates different feature learning trajectories. Student₁ learns from Teacher. Student₂ learns from Student₁ + ground truth. Student₃ learns from Student₂ + ground truth. Each iteration discovers slightly different features due to different starting conditions, and the ensemble of students outperforms any individual.

For agent systems, this suggests: **iterative self-improvement through re-initialization and retraining on self-generated predictions can improve performance even without new data**. An agent could:
1. Solve problems using its current parameters
2. Generate predictions with confidence scores
3. Retrain a new instance from scratch using both ground truth and its own predictions as teachers
4. Repeat, building an ensemble of agents that started from different initializations but learned from accumulated experience

This is particularly powerful for rare or expensive-to-label tasks where new training data is hard to obtain.

### 5. Online vs. Offline: Static vs. Dynamic Knowledge Transfer

The paper distinguishes between:
- **Offline distillation**: Teacher is fully trained and frozen before student training begins
- **Online distillation**: Teacher and student train simultaneously, potentially learning from each other

This maps to two fundamentally different coordination patterns in agent systems:

**Offline pattern (static expertise)**:
- Expert agents are pre-trained on large datasets and frozen
- Smaller agents learn by querying frozen experts
- Knowledge is stable and authoritative
- Appropriate when: expertise is well-established, computational budgets allow pre-training, expert knowledge doesn't need updating

**Online pattern (co-evolution)**:
- Multiple agents train simultaneously on the same data stream
- Agents share intermediate representations during training
- Knowledge is emergent from interaction
- Appropriate when: problem domain is evolving, training data arrives continuously, no single agent is authoritative

Methods like ONE (Lan et al., 2018) and OKDDip (Chen et al., 2020) demonstrate online distillation where multiple branches share backbone layers and teach each other through ensemble predictions. For WinDAG systems, this suggests: **agents solving the same problem simultaneously should share their reasoning processes during execution, not just their final outputs**. A group of agents debugging the same codebase should expose their feature extractions to each other in real-time, allowing faster convergence on the bug's location.

## Boundary Conditions and Failure Modes

### When Multi-Representation Transfer Fails

1. **Architecture mismatch**: If teacher and student architectures are too different, intermediate layer mappings become arbitrary. Lopes et al. (2017) showed that naive metadata transfer can actually harm student performance when architectures don't align. **Implication**: Don't force knowledge transfer between fundamentally different agent types. A language model agent and a vision agent shouldn't try to share intermediate representations.

2. **Capacity bottleneck**: If the student is too small, forcing it to match all teacher representations creates contradictory optimization pressures. Min et al. (2019) demonstrated "gradual distillation" where students learn from checkpoints of the teacher's training process, starting with easier checkpoints. **Implication**: When transferring complex skills to smaller agents, start with simplified versions of the task, not the full expert behavior.

3. **Over-regularization**: Polino et al. (2018) found that quantized distillation (extreme compression) works better with specialized loss functions accounting for quantization constraints. Standard distillation losses can over-regularize severely compressed models. **Implication**: Extreme agent specialization (reducing capability to minimal levels) requires specialized training procedures, not just naive compression.

## Connection to Agent Orchestration

In a DAG-based orchestration system:

**Nodes** (agents) should expose:
- Final outputs (hard predictions)
- Confidence distributions (soft labels)
- Intermediate reasoning states (feature maps)
- Decision boundaries (activation thresholds)

**Edges** (knowledge flows) should specify:
- Which representation type is being transferred
- Whether transfer is online (real-time) or offline (from memory)
- The mapping function between different agent architectures

**Routing decisions** should consider:
- Does the student agent's architecture support the teacher's representation type?
- Is the task similarity high enough to justify intermediate layer transfer?
- Should multiple teachers be consulted, preserving disagreement?

The multi-representation view fundamentally changes how we think about agent skill libraries. A skill isn't just a function with inputs and outputs—it's a hierarchical structure with multiple extractable knowledge representations at different levels of abstraction, each valuable for different types of transfer learning.

## Practical Implementation Considerations

For system builders:

1. **Instrument agents to expose internal states**, not just final answers. Every intermediate computation is potential teaching material.

2. **Version teacher representations**. As teacher agents evolve, their internal representations change. Students trained on old representations may fail when teachers update.

3. **Measure representation alignment**. Before attempting knowledge transfer, compute similarity metrics (Gram matrices, activation statistics) to verify that teacher and student representations are compatible.

4. **Allow students to select teachers**. Different teachers may be better for different subtasks. OKDDip (Chen et al., 2020) shows that learned attention weights over multiple teachers outperform fixed weighting schemes.

5. **Preserve ensemble diversity**. If building multiple student agents from one teacher, use different random initializations, different subsets of training data, or different distillation loss functions to maintain diversity. Homogeneous students create fragile systems.