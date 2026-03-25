# Knowledge Types for Intelligent Problem Decomposition

## Core Insight

When an intelligent system solves a complex problem, it generates three distinct forms of knowledge simultaneously: **response knowledge** (what decision to make), **feature knowledge** (what representations matter), and **relational knowledge** (how elements connect). Understanding these knowledge types is critical for agent systems that must decompose tasks, because different aspects of a problem require different knowledge forms for effective transfer.

## The Three Knowledge Dimensions

### Response-Based Knowledge: Decision Boundaries

Response-based knowledge represents the final output layer's understanding—essentially, the system's decision policy. In knowledge distillation terminology, this manifests as "soft targets"—probability distributions over possible answers rather than hard classifications (Hinton et al., 2015).

**Why This Matters for Agent Systems**: When an agent routes a task to a specialized skill, response-based knowledge tells us *what* the system should output, but not *why*. This is analogous to an API contract—you know what format to expect, but not the reasoning behind it.

The key innovation in soft targets is the temperature parameter T:
```
p(zi, T) = exp(zi/T) / Σj exp(zj/T)
```

At high temperatures, the distribution becomes more uniform, revealing "dark knowledge"—the model's uncertainty and relative rankings between non-primary classes. For example, if a model classifies an image as "dog" with 95% confidence, the remaining 5% distribution between "wolf," "cat," and "car" contains rich structural information about the model's learned feature space.

**Application to Multi-Agent Orchestration**: When multiple agents must reach consensus on a complex task, soft targets are more informative than hard votes. An agent expressing {malware: 0.6, suspicious: 0.35, benign: 0.05} is conveying fundamentally different information than {malware: 1.0}, even though both would collapse to the same hard decision. The soft distribution reveals:

1. **Confidence calibration**: How certain is the agent?
2. **Near-miss information**: What other solutions were plausible?
3. **Learned similarity structure**: The model has learned that "malware" and "suspicious" are related, but both are distant from "benign"

**Boundary Condition**: Response-based knowledge is task-specific and doesn't transfer well across different problem types. A model that outputs "dog vs. cat" classifications cannot teach a model that outputs bounding boxes without translation.

### Feature-Based Knowledge: Representation Hierarchies

Feature-based knowledge captures the intermediate representations learned by hidden layers. In deep networks, this manifests as activation patterns, attention maps, or learned embeddings (Romero et al., 2015; Zagoruyko and Komodakis, 2017).

**The Hint Layer Concept**: Not all layers are equally informative for knowledge transfer. "Hint layers" are intermediate layers whose representations are rich enough to guide learning but not so high-level that they're task-specific. Choosing the right hint layers is analogous to choosing the right level of abstraction for task decomposition.

From FitNets (Romero et al., 2015): When training a thin-deep student from a thick-shallow teacher, matching intermediate features allows the student to learn "how to use depth" rather than just "what the answer is." The student learns a processing pathway, not just a mapping.

**Attention as Meta-Knowledge**: Zagoruyko and Komodakis (2017) proposed attention transfer, where the teacher's attention maps (indicating which spatial regions or feature channels are important) guide the student. The attention map A = Σc |F(x)|^p represents "where to look"—a form of meta-knowledge about the problem structure.

**Application to Agent Systems**: When an agent must learn a new skill, transferring feature-based knowledge means providing:

1. **Intermediate checkpoints**: Not just the final solution, but the reasoning pathway
2. **Attention guidance**: Which parts of the input space matter most
3. **Representation alignment**: How to organize internal state for effective computation

Consider a code review agent learning from an expert reviewer. Feature-based knowledge transfer would mean learning not just "this code is buggy" (response) but "these are the suspicious patterns to notice" (features) and "this is how to decompose code into analyzable chunks" (attention).

**Critical Limitation**: Feature-based knowledge requires structural compatibility. If the teacher has 512-dimensional representations and the student has 64-dimensional representations, direct matching fails. Solutions include:
- Projection layers (adapters)
- Selective feature matching (only transfer specific dimensions)
- Attention-based selection (student learns which teacher features to attend to)

### Relation-Based Knowledge: Structural Understanding

Relation-based knowledge captures relationships—between layers, between data samples, or between features. This is the most abstract form of knowledge, encoding the *structure of the problem space* rather than specific solutions (Park et al., 2019; Liu et al., 2019g).

**Inter-Layer Relations**: The Flow of Solution Process (FSP) matrix (Yim et al., 2017) captures relationships between feature maps from different layers via Gram matrices. This encodes "how information flows through the network"—a form of computational strategy knowledge.

**Inter-Sample Relations**: Several methods transfer knowledge by preserving similarity structures between data samples (Tung and Mori, 2019; Park et al., 2019). If samples A and B produce similar activations in the teacher, they should produce similar activations in the student—even if the absolute activations differ.

The Relational Knowledge Distillation (RKD) loss (Park et al., 2019):
```
L_RKD = L_distance + L_angle
```
where distance loss preserves pairwise distances between samples, and angle loss preserves angular relationships in triplets. This ensures the student learns the same *geometry* of the data manifold as the teacher.

**Why This Is Profound**: Relation-based knowledge is *task-invariant*. The same structural relationships might apply across different tasks if the underlying data geometry is similar. This enables transfer learning in ways that response-based or feature-based knowledge cannot.

**Application to Agent Systems**: Consider an agent system that must learn to detect anomalies in different domains (network traffic, code, user behavior). Relation-based knowledge transfer means:

1. **Similarity preservation**: If logs A and B are similar in one domain, their counterparts in another domain should be similar
2. **Boundary learning**: The shape of the decision boundary (smooth vs. jagged, linear vs. nonlinear) transfers across domains
3. **Graph-based reasoning**: Relationships between entities (e.g., code modules, network nodes) follow similar patterns

**Graph-Based Distillation**: Recent work (Lee and Song, 2019; Liu et al., 2019g) models data as graphs where nodes are samples and edges are similarities. Knowledge transfer becomes graph matching—ensuring the student's learned graph structure resembles the teacher's.

## Composing Knowledge Types

Effective knowledge transfer often requires combining multiple knowledge types:

1. **Response + Feature**: The student learns both what to predict (response) and how to compute it (features)
2. **Feature + Relation**: The student learns representations that preserve both absolute activations and relative relationships
3. **All three**: Comprehensive transfer that captures decisions, representations, and structure

**From the survey** (Zhao et al., 2020a): Collaborative Teacher-Student Knowledge Distillation (CTKD) combines feature-based and relation-based knowledge, achieving 1.22-2.43% improvement over single-knowledge approaches on CIFAR datasets.

## Design Principles for Agent Systems

### 1. Match Knowledge Type to Transfer Objective

- **Task-specific skills**: Response-based knowledge (what to output)
- **Reasoning strategies**: Feature-based knowledge (how to think)
- **Problem structure**: Relation-based knowledge (understanding relationships)

### 2. Consider the Capacity Gap

From Mirzadeh et al. (2020): A large teacher can overwhelm a small student. Solutions:
- **Teacher assistants**: Intermediate models that bridge the gap
- **Progressive transfer**: Gradually increase complexity
- **Selective knowledge**: Only transfer knowledge the student can absorb

### 3. Leverage Multiple Teachers for Complementary Knowledge

Multi-teacher distillation (You et al., 2017; Park and Kwak, 2020) shows that different teachers provide different perspectives. For agent orchestration:
- Different expert agents transfer different knowledge types
- Student agents learn richer representations by integrating multiple viewpoints
- Ensemble knowledge is more robust than single-teacher knowledge

### 4. Use Online Learning When Possible

Online distillation (Zhang et al., 2018b) enables mutual learning without pre-trained teachers. Benefits:
- No dependency on perfect teachers
- Collaborative improvement through peer learning
- Better generalization through diverse learning signals

## Failure Modes and Mitigations

### Over-Regularization
**Problem**: Too much feature-based knowledge from deep layers can constrain the student's learning
**Solution**: Use shallow hint layers or attention-based selective transfer

### Capacity Mismatch
**Problem**: Student cannot represent teacher's knowledge
**Solution**: Teacher assistants, progressive distillation, or architecture search for student design

### Knowledge Pollution
**Problem**: Teacher's mistakes are transferred to student
**Solution**: Use multiple teachers, confidence weighting, or adversarial distillation to identify unreliable knowledge

### Modality Gap
**Problem**: Knowledge doesn't transfer across modalities (e.g., vision→text)
**Solution**: Cross-modal distillation with paired samples or contrastive learning (Tian et al., 2020)

## Connection to Human Learning

The three knowledge types parallel human pedagogical strategies:

1. **Response-based**: "Here's the answer" (declarative knowledge)
2. **Feature-based**: "Here's how to think about it" (procedural knowledge)
3. **Relation-based**: "Here's how ideas connect" (structural knowledge)

Effective teaching—for both humans and agents—requires all three, delivered at the appropriate level of abstraction for the learner's current capability.

## Measurement and Evaluation

How do we know if knowledge transfer succeeded?

1. **Performance metrics**: Does the student solve tasks effectively?
2. **Representation similarity**: Do student representations match teacher representations (CKA, centered kernel alignment)?
3. **Structural preservation**: Are pairwise relationships preserved?
4. **Generalization**: Does the student perform well on unseen data?

The choice of evaluation depends on which knowledge type was transferred and what the transfer objective was.

## Implications for WinDAGs

For a DAG-based orchestration system with 180+ skills:

1. **Skill composition**: Use relation-based knowledge to understand which skills combine effectively
2. **Skill learning**: New skills can learn from existing skills through feature-based transfer
3. **Routing decisions**: Response-based knowledge helps determine which skill to invoke
4. **Meta-learning**: The system can learn "how to learn new skills" by transferring relational structure across skill acquisitions

The power of knowledge distillation for agent systems is not just compression—it's **knowledge modularization and strategic transfer**, enabling systems to learn faster, generalize better, and compose solutions from reusable knowledge components.