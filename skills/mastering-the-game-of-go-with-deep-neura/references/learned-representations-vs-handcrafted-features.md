# Learned Representations vs. Handcrafted Features: Why End-to-End Learning Wins in Complex Domains

## The Historical Context

Before AlphaGo, computer Go programs relied heavily on handcrafted features and domain knowledge accumulated over decades:

- **Pattern libraries**: Databases of joseki (corner sequences), fuseki (opening patterns), life-and-death problems
- **Hand-designed evaluation functions**: Linear combinations of features like territory, influence, captured stones, liberty counts
- **Expert heuristics**: Rules for move selection, tactical calculations, strategic assessments

These systems achieved strong amateur level play—programs like Pachi and Crazy Stone reached 2-6 dan on KGS. But they plateaued below professional level, seemingly unable to capture the full complexity of Go.

The fundamental problem: **human experts cannot fully articulate their knowledge**. A professional Go player "knows" that a position is good or bad, but cannot enumerate all the features that contribute to this judgment. The intuition developed over years of study resists decomposition into explicit rules.

AlphaGo's breakthrough was to **learn representations end-to-end from raw board state**, bypassing the need for human feature engineering.

## The Neural Network Architecture

AlphaGo's policy and value networks take as input a 19×19×48 tensor representing raw board state:

**48 feature planes:**
- Stone color (3 planes: player/opponent/empty)
- Move history (8 planes: turns since stone was played)
- Liberties (8 planes: 1, 2, 3, ..., ≥8 liberties)
- Capture size (8 planes: how many stones would be captured)
- Self-atari size (8 planes: how many own stones would be captured)
- Liberties after move (8 planes)
- Ladder capture/escape (2 planes: whether tactical ladder succeeds)
- Legality and sensibleness (2 planes)
- Current player color (1 plane for value network only)

These are **minimal feature planes**—they encode game rules but no strategic knowledge. Compare to handcrafted Go programs which encode hundreds of patterns, joseki databases, tactical heuristics.

The **convolutional neural network** then builds hierarchical representations:

1. **First hidden layer**: Convolves k filters of kernel size 5×5 → learns local patterns
2. **Hidden layers 2-12**: Convolve k filters of kernel size 3×3 → learn increasingly abstract patterns
3. **Output layer**: Convolves 1 filter of kernel size 1×1 → produces position-specific outputs

The match version used k=192 filters per layer (Fig 2b shows results with k=128, 256, 384 as well).

The key insight: **each convolutional layer learns to detect patterns at increasing levels of abstraction**. Early layers might detect simple patterns like "two stones with one liberty." Middle layers detect tactical situations like "ladder" or "shortage of liberties." Late layers detect strategic concepts like "thickness" or "influence" that human experts use but cannot formalize.

## Empirical Evidence for End-to-End Learning

### Policy Network Accuracy

The paper reports systematic improvement from end-to-end learning:

**Prior work** (handcrafted features + shallow networks): 44.4% move prediction accuracy

**AlphaGo SL policy network** (learned representations):
- 55.7% accuracy using only raw board position and move history
- 57.0% accuracy using all input features
- Small improvements in accuracy lead to large improvements in playing strength (Fig 2a)

This 12+ percentage point improvement over prior work isn't just quantitative—it represents fundamentally better representations. The policy network learns patterns that handcrafted features missed.

### Network Depth Matters

Extended Data Table 3 shows that **larger networks perform better despite being slower**:

**128 filters**: 54.6% test accuracy, 53% win rate vs AlphaGo  
**192 filters**: 55.4% test accuracy, 50% win rate (this is AlphaGo's baseline)  
**256 filters**: 55.9% test accuracy, 55% win rate vs AlphaGo  
**384 filters**: ~56% test accuracy (inferred), but slower

The 256-filter network achieves 55% win rate against the 192-filter network—a substantial advantage. This network is significantly slower (7.1ms vs 4.8ms evaluation time), but the improved representations are worth the cost.

The lesson: **in complex domains, representational capacity matters more than evaluation speed**. A slower network with better representations outperforms a faster network with weaker representations.

### Value Network Generalization

The value network achieves MSE of 0.226 on training set and 0.234 on test set—minimal overfitting despite the network's large capacity (13 layers, 192 filters).

This generalization comes from:
1. **Large training set**: 30 million positions from self-play
2. **Decorrelated examples**: One position per game to ensure independence
3. **Sufficient capacity**: Deep network can learn complex patterns without memorizing individual positions

The value network learns to evaluate positions it has never seen. This is only possible because the learned representations capture general principles—not memorized specific situations.

## Why Learned Representations Outperform Handcrafted Features

### 1. Experts Cannot Articulate Implicit Knowledge

Professional Go players make intuitive judgments based on pattern recognition developed through thousands of games. But they cannot enumerate all the patterns they recognize.

Example: A professional might look at a position and say "White is slightly better because of thickness in the center." But:
- What specific visual pattern indicates "thickness"?
- How does thickness convert to winning probability?
- What other factors modify this judgment?

These questions don't have explicit answers. The knowledge is **tacit**—embodied in the professional's perceptual system, not available for conscious articulation.

Handcrafted features capture what experts can articulate. Learned representations capture what experts actually use—which is vastly richer.

### 2. Hierarchical Abstraction Emerges Naturally

Convolutional networks learn hierarchical representations automatically:

**Early layers** detect local patterns (adjacent stones, liberties)  
**Middle layers** combine local patterns into tactical motifs (ladders, capturing races)  
**Late layers** combine tactical motifs into strategic concepts (influence, territory, thickness)

This hierarchy emerges from optimization—no human explicitly programmed it. The network discovers that hierarchical decomposition is an effective way to represent Go positions, because this structure exists in the problem.

Handcrafted features must manually define this hierarchy. But humans might miss important intermediate abstractions or impose incorrect hierarchical structure.

### 3. End-to-End Optimization

When features are handcrafted, the learning algorithm only optimizes the final layer (typically linear weights on features). The features themselves are fixed.

With learned representations, **gradient descent optimizes the entire network**—both feature extractors and the final decision. This joint optimization can discover feature combinations that work well together.

Example: Maybe raw "liberty count" isn't the right feature—maybe "liberty count minus opponent's liberty count in local region" is better. Handcrafted features would have to anticipate this. Learned representations discover it automatically through backpropagation.

### 4. Capacity for Subtle Patterns

Go has enormous complexity—approximately 10^170 legal positions. Many important patterns are subtle:
- Positions that look similar to human eyes have different values
- Distant stones interact in non-obvious ways
- Timing of moves matters (same position reached in different move orders can have different value)

Handcrafted features cannot capture all this subtlety—there are too many patterns, many unknown to human experts.

Deep networks with sufficient capacity can learn to distinguish subtly different positions. The 192-filter policy network has ~13 million parameters—enough to encode vastly more patterns than any handcrafted feature set.

## Application to Agent System Design

### For Code Understanding Systems

Code analysis agents should learn representations rather than rely only on handcrafted features:

**Handcrafted features** (traditional static analysis):
- Lines of code
- Cyclomatic complexity
- Number of dependencies
- Pattern matching for known antipatterns

**Learned representations** (neural code models):
- Train transformers on large code corpora
- Learn to embed code into vector space where similar code is nearby
- Use embeddings for bug detection, code search, generation

The learned representations capture semantic patterns that handcrafted features miss: coding idioms, common bug patterns, architectural styles.

Concretely: A learned code model might notice "these two functions have similar structure but different variable names—probably copy-paste code with customization" without explicitly programming this pattern.

### For Task Decomposition Systems

Task decomposition agents benefit from learned representations of task structure:

**Handcrafted features**:
- Keyword matching ("build" → construction task)
- Dependency parsing (explicit task requirements)
- Template matching (known task patterns)

**Learned representations**:
- Train on corpus of (task description, successful decomposition) pairs
- Learn to embed tasks into space where similar tasks are nearby
- Use embeddings to predict good decomposition strategies

The learned model discovers patterns like: "Tasks mentioning both 'database' and 'API' usually need an intermediate data access layer" without explicitly encoding this rule.

### For Architecture Review Systems

Architecture review agents should learn representations of architectural quality:

**Handcrafted features**:
- Coupling metrics (dependencies between modules)
- Cohesion metrics (relatedness within modules)
- Layer violations (lower layer depending on higher layer)

**Learned representations**:
- Train on corpus of (architecture, quality ratings) from past reviews
- Learn to embed architectures into space where good architectures cluster
- Use embeddings to predict maintainability, scalability issues

The learned model might discover patterns like: "Architectures with this dependency structure tend to be hard to test" by observing correlations in training data, without being told explicit rules.

### For Multi-Agent Coordination

Agents coordinating without central control benefit from learned representations of other agents' policies:

**Handcrafted models**:
- Assume other agents follow fixed protocols
- Explicitly programmed response policies

**Learned models**:
- Observe other agents' behavior
- Learn to predict their actions from context
- Adapt coordination strategy based on learned model

Example: In a code review scenario, one agent learns to predict another agent's review criteria by observing past reviews. It generates code more likely to pass review by leveraging learned model of reviewer's preferences.

## Critical Design Choices for Learned Representations

### 1. Architecture Selection

AlphaGo uses convolutional networks because Go has **translation invariance**—patterns have the same meaning regardless of position on the board. A "ladder" pattern in the corner has the same tactical significance as in the center.

For agent systems, choose architecture based on problem structure:
- **Transformers** for sequential data (code, text, time series)
- **Graph neural networks** for relational data (dependency graphs, knowledge graphs)
- **Convolutional networks** for spatial data (images, board games, gridded data)

The key: **match network architecture to problem symmetries and structure**.

### 2. Input Representation

AlphaGo's 19×19×48 input tensor is carefully designed:

- **Multiple time steps**: 8 planes encoding "turns since stone was played" provide temporal context
- **Multiple aspects per position**: Separate planes for liberties, captures, etc. let the network learn which aspects matter
- **Relative encoding**: Features encode "player vs opponent" not "black vs white"—makes learned representations invariant to which color is playing

For code analysis: represent code as token sequences, AST trees, or dependency graphs. Include multiple aspects: syntax, types, data flow, control flow. Let the network learn which aspects matter for each prediction.

### 3. Training Data Size and Quality

AlphaGo's supervised learning used 30 million positions from expert games. The value network used another 30 million positions from self-play.

**Large data matters**: Figure 2b shows that larger networks (more capacity) achieve better accuracy—this only works with sufficient training data. Small networks on small data would overfit.

For agent systems: **invest in data collection**. Learned representations require substantial training data to reach their potential. If you only have hundreds of examples, handcrafted features might work better. With thousands to millions of examples, learned representations win.

### 4. Feature Augmentation vs Pure Learning

AlphaGo includes some handcrafted features:
- Ladder capture/escape (1 bit per intersection indicating if ladder succeeds)
- Legality and sensibleness (2 bits encoding basic Go rules)

These are **minimal domain knowledge**—just enough to make learning tractable. The paper tested variants with fewer features:

**Only 4 feature planes**: 49.2% accuracy (8-symmetry ensemble)  
**Only 12 feature planes**: 55.7% accuracy  
**All 20 feature planes**: 55.8% accuracy  

More features help slightly, but even minimal features (4 planes) achieve reasonable accuracy with enough network capacity.

For agent systems: **start with minimal domain knowledge, add features if they provide substantial benefit**. Don't prematurely optimize with handcrafted features—let the network learn first, then see what's missing.

## Boundary Conditions and Failure Modes

### When Learned Representations Fail

**1. Insufficient training data**: With only hundreds of examples, learned representations overfit. Handcrafted features work better in small-data regimes.

**2. Distribution shift**: Learned representations may not generalize to inputs far from training distribution. If the network learned from professional games but faces unusual amateur mistakes, it might not evaluate well.

**3. Adversarial examples**: Learned representations can be fooled by carefully constructed inputs. This is less a concern for Go than for security-critical systems.

**4. Interpretability**: Handcrafted features are human-understandable. Learned representations are opaque—you can't explain why the network made a particular decision. This matters for systems requiring auditability.

### When Handcrafted Features Win

**1. Clear domain theory**: If you have precise rules (like type checking), handcrafted features capture them exactly. Learning would approximate them imperfectly.

**2. Safety-critical systems**: When failures are catastrophic, relying on learned representations (which might fail unexpectedly) is risky. Handcrafted features with formal guarantees are safer.

**3. Rare events**: If important patterns are rare in training data, the network might not learn them. Handcrafted features can explicitly encode known-rare-but-important patterns.

**4. Computational constraints**: Learned representations require neural network evaluation (milliseconds). Handcrafted features might be much faster (microseconds). When speed is critical, handcrafted features may be necessary.

## What Makes This Result Irreplaceable

Many papers show neural networks outperforming handcrafted features. What makes AlphaGo distinctive?

**1. Complexity of domain**: Go is vastly more complex than previous neural network successes. Showing that learned representations work for b≈250, d≈150 game proves they scale to truly hard problems.

**2. Exceeded human expertise**: AlphaGo didn't just match human-level representations—it learned representations that lead to superhuman play. This proves learned representations can discover patterns humans missed.

**3. Minimal domain knowledge**: Only 48 feature planes encoding basic game rules. Compare to previous Go programs with thousands of handcrafted patterns. The simplicity of AlphaGo's input proves that learned representations truly learn from data, not from encoded human knowledge.

**4. Quantitative evidence**: Figure 2b shows that larger networks consistently achieve better accuracy, and Figure 2a shows that accuracy improvements lead to stronger play. This provides clear evidence that representational capacity matters.

For agent systems, the profound lesson: **in complex domains where expert knowledge is implicit, invest in learned representations rather than trying to exhaustively enumerate handcrafted features**.

The key insight: **intelligence emerges not from enumerating rules, but from learning hierarchical representations that capture problem structure**.