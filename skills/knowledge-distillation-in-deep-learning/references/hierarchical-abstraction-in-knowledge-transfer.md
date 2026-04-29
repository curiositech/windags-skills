# Hierarchical Abstraction in Knowledge Transfer: Which Layers Matter?

## The Problem: Not All Knowledge is Equally Transferable

When a teacher model solves a problem, it processes information hierarchically:

**Low-level layers** (near input):
- Extract basic features (edges, colors, textures in images; characters, words in text)
- Represent domain-specific patterns
- High dimensionality (many neurons/channels)

**Mid-level layers**:
- Combine basic features into concepts (shapes, objects in images; phrases, grammar in text)
- Represent compositional structure
- Moderate dimensionality

**High-level layers** (near output):
- Make task-specific decisions (classification, regression, generation)
- Represent abstract reasoning
- Low dimensionality (often bottlenecked to output classes)

The question: **Which layers should a student learn from?** Transfer all layers? Just the final output? Specific intermediate layers?

## Approaches to Layer Selection

### 1. Logit-Only Distillation (Hinton et al., 2015)

Transfer knowledge from the **final layer only** (logits before softmax):
- Teacher produces: [z₁, z₂, ..., z_n] (raw scores)
- Student learns to match these scores
- No intermediate layer involvement

**Advantages**:
- Simple: Only requires teacher's final output
- Architecture-agnostic: Student can have completely different internal structure
- Fast: No need to align intermediate representations

**Disadvantages**:
- Ignores intermediate reasoning
- Student must discover feature hierarchy independently
- Works poorly when student architecture is very different from teacher

**When to use**: Tasks where the decision boundary matters more than the reasoning process. Example: "Is this code snippet vulnerable?" (binary classification where the feature pathway is flexible).

### 2. Feature Map Distillation (Romero et al., 2015; Gao et al., 2018)

Transfer knowledge from **intermediate convolutional or feedforward layers**:
- Teacher produces feature maps: F_teacher = [f₁, f₂, ..., f_m]
- Student produces feature maps: F_student = [g₁, g₂, ..., g_m]
- Student learns to minimize: ||F_student - F_teacher||²

**Advantages**:
- Student learns feature hierarchy from teacher
- Faster convergence (student doesn't reinvent low-level features)
- Better performance when student capacity is limited

**Disadvantages**:
- Requires architecture alignment (which student layer corresponds to which teacher layer?)
- Dimension mismatch (student layers may have fewer channels than teacher)
- Computationally expensive (compute loss on multiple layers)

**When to use**: Tasks where feature hierarchy is critical. Example: Image segmentation where low-level edges, mid-level shapes, and high-level objects all matter.

### 3. Attention Map Distillation (Zagoruyko & Komodakis, 2017)

Transfer **attention maps** (which spatial locations are important):
- Teacher's attention: A_teacher[i,j] = sum over channels of F_teacher[i,j,:]²
- Student learns to match attention maps, not raw features

**Advantages**:
- Transfers "where to look" without specifying exact features
- More flexible than raw feature matching
- Works when student and teacher have different numbers of channels

**Disadvantages**:
- Loses information about what features are present, only where
- Requires spatial structure (doesn't apply to fully-connected layers)

**When to use**: Vision tasks where spatial attention is more important than specific features. Example: Object detection (learning where objects are matters more than exact pixel values).

### 4. Activation Boundary Distillation (Heo et al., 2019)

Transfer **decision boundaries** (which neurons activate vs. stay silent):
- Focus on sign of activations: sign(f_teacher[i]) vs. sign(f_student[i])
- Student learns to match activation patterns, not magnitudes

**Advantages**:
- Captures geometric structure of decision space
- Robust to magnitude scaling differences
- Works when student and teacher have very different architectures

**Disadvantages**:
- Requires non-linear activations (ReLU, etc.)
- May miss subtle gradient information
- Hard to apply to probabilistic activations

**When to use**: Transfer learning where student is applied to different domain than teacher. Example: Teacher trained on ImageNet, student applied to medical imaging (decision geometry transfers, but specific feature magnitudes don't).

### 5. Layer Selectivity Learning (Li et al., 2019)

**Automatically identify** which layers are most informative:
- Compute inter-layer Gram matrix (correlation between layers)
- Compute layer inter-class Gram matrix (how well layer discriminates classes)
- Select layers with high informativeness and discriminativeness
- Only transfer those layers

**Advantages**:
- Data-driven layer selection (no manual hyperparameter tuning)
- Transfers only the most valuable knowledge
- Reduces computational cost vs. transferring all layers

**Disadvantages**:
- Requires additional computation to select layers
- Selection may not generalize to different datasets
- Risk of overfitting to validation set used for selection

**When to use**: When computational budget is limited and you need to prioritize which knowledge to transfer. Example: Distilling a 50-layer teacher to a 10-layer student—select the 10 most informative teacher layers to mimic.

## The Hierarchical Abstraction Principle

The key insight from layer-selective distillation: **abstraction levels in the teacher's hierarchy must be preserved in the student, but not necessarily at the same depths**.

Example:
- Teacher: 50 layers deep, learns low-level features in layers 1-10, mid-level in layers 11-30, high-level in layers 31-50
- Student: 10 layers deep, must still learn low-level → mid-level → high-level progression
- Distillation maps: Teacher layers [5, 15, 25, 35, 45] → Student layers [2, 4, 6, 8, 10]

The student compresses the hierarchy (fewer layers) but preserves the progression (low → mid → high).

## Application to Agent Systems: Skill Hierarchies

### Scenario: Code Review Agent

A teacher agent for code review might have hierarchical structure:

**Level 1 (Syntax layer)**: 
- Extract tokens, parse AST
- Detect syntax errors
- Low-level features

**Level 2 (Pattern layer)**:
- Identify coding patterns (loops, conditionals, function calls)
- Detect anti-patterns (magic numbers, deep nesting)
- Mid-level features

**Level 3 (Logic layer)**:
- Analyze control flow
- Detect logical errors (null dereferences, race conditions)
- High-level features

**Level 4 (Semantic layer)**:
- Understand intent
- Detect architectural issues
- Abstract reasoning

When distilling to a smaller student agent, which levels should be transferred?

### Strategy 1: Transfer All Levels (Full Hierarchy)

Map each teacher level to corresponding student level:
- Student Layer 1 mimics Teacher Level 1
- Student Layer 2 mimics Teacher Level 2
- ...etc.

**Pros**: Student learns complete reasoning process
**Cons**: Requires student to have capacity for all levels (may not fit in size budget)

**Use case**: Medium-sized student deployed on laptop/desktop where size constraints are moderate.

### Strategy 2: Transfer Top Levels Only (Abstraction Compression)

Map only high-level teacher layers to student:
- Student Layer 1 mimics Teacher Level 3
- Student Layer 2 mimics Teacher Level 4

**Pros**: Student focuses on abstract reasoning, ignores low-level details
**Cons**: Student must independently learn low-level features, may fail on unusual syntax

**Use case**: Tiny student deployed on mobile device. Offloads syntax checking to a separate micro-agent, focuses on logic and semantics.

### Strategy 3: Transfer Bottom and Top (Skip Middle)

Map low-level and high-level layers, skip middle:
- Student Layer 1 mimics Teacher Level 1 (syntax)
- Student Layer 2 mimics Teacher Level 4 (semantics)

**Pros**: Preserves both low-level perception and high-level reasoning
**Cons**: Student must interpolate middle layers, may miss pattern-level features

**Use case**: Specialized student for well-understood codebases (where patterns are stereotypical, so middle layers are less critical).

### Strategy 4: Learned Layer Selection (LSL Approach)

Use Layer Selectivity Learning to identify which teacher layers are most informative for code review:
- Compute Gram matrices on validation set
- Identify layers with highest discriminative power
- Transfer only those layers

**Result** (hypothetical): LSL might discover that Teacher Levels 2 and 4 are most important, Level 1 is mostly noise (syntax is easy), Level 3 is redundant with Level 4.

**Use case**: Optimizing distillation when teacher has many layers and student budget is tight.

## Feature Pyramid Networks and Multi-Scale Transfer

Some tasks require reasoning at multiple scales simultaneously:
- Image segmentation: Detect fine details (pixel-level) and coarse structure (object-level)
- Code review: Detect local errors (line-level) and global issues (architecture-level)

Feature Pyramid Networks (FPN) explicitly maintain multi-scale representations:

```
Teacher FPN:
    Low-res, high-level: [H/32 × W/32, 256 channels]
         ↓ (upsampled and merged with)
    Mid-res, mid-level: [H/16 × W/16, 256 channels]
         ↓ (upsampled and merged with)
    High-res, low-level: [H/8 × W/8, 256 channels]
```

When distilling from an FPN teacher, the student must preserve multi-scale structure:

```
Student FPN (compressed):
    Low-res: [H/32 × W/32, 64 channels]  ← Mimics teacher's low-res layer
    Mid-res: [H/16 × W/16, 64 channels]  ← Mimics teacher's mid-res layer
    High-res: [H/8 × W/8, 64 channels]   ← Mimics teacher's high-res layer
```

**Key principle**: Compression should reduce channel counts (fewer features at each scale) but preserve scale hierarchy (same number of pyramid levels).

**Application to agents**: A "bug detection" agent ensemble:
- Micro-agent 1: Line-level syntax checker
- Micro-agent 2: Function-level logic checker
- Micro-agent 3: File-level architecture checker

Each agent operates at a different scale. They don't need to be hierarchical (one calling another)—they process in parallel and merge results. This is FPN for agent systems.

## The Connector Problem: Mapping Different Architectures

When student and teacher have different architectures, intermediate layers have different dimensions. A **connector function** maps between them:

### Linear Connector (1×1 Convolution)

```
Student feature: [H × W × C_student]
Connector: 1×1 conv, C_student → C_teacher channels
Teacher feature: [H × W × C_teacher]

Loss: ||Connector(Student) - Teacher||²
```

**Pros**: Simple, learnable, preserves spatial structure
**Cons**: Assumes spatial dimensions match (H and W same for student and teacher)

### Pooling Connector

```
Student feature: [H_s × W_s × C_s]
Pooling: Resize to [H_t × W_t]
Linear: C_s → C_t channels
Teacher feature: [H_t × W_t × C_t]
```

**Pros**: Handles different spatial resolutions
**Cons**: Loses fine-grained spatial information in pooling

### Attention Connector

```
Student feature: [H_s × W_s × C_s]
Query: Linear(Student) → [H_s × W_s × D]
Key, Value: Linear(Teacher) → [H_t × W_t × D]
Output: Attention(Query, Key, Value) → [H_s × W_s × D]
Linear: D → C_t
```

**Pros**: Flexibly aligns different spatial and channel dimensions, learned attention
**Cons**: Computationally expensive, requires careful initialization

**Application to agents**: When routing between agents with different internal representations:
- Agent A: Represents code as token sequences
- Agent B: Represents code as AST trees
- Connector: Transformer that maps sequences to tree-structured attention

The connector learns to translate between representation spaces, enabling heterogeneous agents to teach each other.

## Failure Mode: Over-Specifying Intermediate Layers

If you force a small student to exactly match too many teacher layers, you create **conflicting optimization pressures**:
- Loss on Layer 1: Forces student to learn low-level features exactly like teacher
- Loss on Layer 2: Forces student to learn mid-level features exactly like teacher
- ...
- Loss on Layer N: Forces student to learn high-level features exactly like teacher
- Loss on final output: Forces student to match teacher predictions

With limited capacity, the student can't satisfy all constraints. It thrashes between competing objectives, converging slowly or not at all.

**From the paper**: Min et al. (2019) proposed gradual distillation—instead of matching all layers simultaneously, match them sequentially:
- Phase 1: Match Layer 1 only
- Phase 2: Match Layers 1-2
- Phase 3: Match Layers 1-3
- ...

This gives the student time to learn each level of abstraction before adding the next.

**Application to agents**: When distilling complex skills, don't force the student to match all intermediate reasoning steps immediately. Instead:
1. Train student to match final outputs only (Phase 1)
2. Gradually add intermediate layer losses (Phase 2, 3, ...)
3. Monitor which intermediate losses actually improve performance
4. Prune intermediate losses that don't help (reduce optimization pressure)

## Practical Guidelines for Layer Selection

### For Vision Tasks:
- **Logit-only**: Simple classification (ImageNet-style)
- **Feature maps**: Semantic segmentation, object detection
- **Attention maps**: Tasks requiring spatial reasoning (where is the object?)
- **Activation boundaries**: Transfer learning across domains

### For Language Tasks:
- **Logit-only**: Sentiment analysis, topic classification
- **Intermediate layers**: Named entity recognition, part-of-speech tagging (structured outputs)
- **Attention patterns**: Machine translation, summarization (sequence-to-sequence)

### For Code Tasks:
- **Logit-only**: Binary classification (vulnerable / not vulnerable)
- **Feature maps**: Code completion (need to learn token patterns)
- **Attention patterns**: Code summarization (need to identify important lines)
- **Activation boundaries**: Cross-language transfer (Python → JavaScript)

### General Heuristic:

**If student architecture ≈ teacher architecture (same family, different size)**:
→ Use feature map distillation on 3-5 selected intermediate layers

**If student architecture ≠ teacher architecture (different families)**:
→ Use logit-only or activation boundary distillation (avoid raw feature matching)

**If computational budget is tight**:
→ Use Layer Selectivity Learning to identify 1-2 most informative layers, transfer only those

**If student capacity is very limited (>90% compression)**:
→ Use logit-only distillation (student doesn't have room for matching intermediate layers)

## Connection to System Design: Modular Skill Composition

The hierarchical abstraction principle suggests a modular agent architecture:

```
[Low-level Agents: Feature Extraction]
       ↓ (features passed to)
[Mid-level Agents: Pattern Recognition]
       ↓ (patterns passed to)
[High-level Agents: Abstract Reasoning]
```

Instead of one monolithic agent, decompose into a pipeline where:
- Low-level agents are heavily compressed (features are stereotypical)
- High-level agents are less compressed (reasoning requires capacity)
- Mid-level agents are moderately compressed (depends on task)

This maps directly to layer-selective distillation: different parts of the hierarchy have different compression tolerances. Size budget should be allocated proportionally to complexity at each level.

For WinDAG with 180+ skills, organize skills into hierarchical groups:
- **Tier 0 (Primitive)**: Syntax parsing, token extraction, basic pattern matching (heavy compression)
- **Tier 1 (Compositional)**: Combine primitives into concepts (moderate compression)
- **Tier 2 (Reasoning)**: High-level logic and semantic analysis (light compression)

Route tasks through tiers: Tier 0 always runs (fast, cheap), Tier 1 runs if Tier 0 detects patterns needing interpretation, Tier 2 runs if Tier 1 is uncertain. This implements hierarchical abstraction in the orchestration layer, mirroring hierarchical abstraction in the knowledge distillation process.