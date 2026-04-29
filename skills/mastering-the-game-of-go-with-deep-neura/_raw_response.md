## BOOK IDENTITY

**Title**: Mastering the game of Go with deep neural networks and tree search

**Author**: David Silver, Aja Huang, et al. (DeepMind/Google)

**Core Question**: How can artificial intelligence systems solve problems where the search space is too large for exhaustive computation and the evaluation of intermediate states appears intractable?

**Irreplaceable Contribution**: This paper demonstrates the first successful integration of deep neural networks with Monte Carlo tree search to achieve superhuman performance in Go—a domain previously thought to require another decade of research. More importantly, it reveals a profound architectural pattern: **combining learned intuition (policy networks) with learned evaluation (value networks) and systematic search creates capabilities that exceed what any component achieves alone**. The system doesn't just play Go; it shows how intelligent systems can decompose intractable problems by using multiple specialized evaluators operating at different time scales and levels of precision.

## KEY IDEAS (3-5 sentences each)

1. **Hierarchical Approximation Under Uncertainty**: AlphaGo solves an intractable problem (b≈250, d≈150) through cascading approximations: the policy network narrows the search beam, the value network replaces deep rollouts, and fast rollouts provide cheap but noisy estimates. Each approximation trades precision for speed at different points in the search tree, and their combination converges toward optimal play. This demonstrates that intelligent systems need multiple evaluation mechanisms operating at different computational budgets.

2. **Self-Play as Curriculum Generation**: The system transcends its training data through reinforcement learning from self-play, where the RL policy network plays against previous versions of itself to discover strategies beyond human games. This creates a curriculum of increasing difficulty without requiring additional human expertise. The insight: **expert imitation gets you to competence; self-improvement under your own objective function gets you to mastery**.

3. **Mixing Complementary Evaluations**: AlphaGo's position evaluation combines value network predictions (vθ) with rollout outcomes (zL) using mixing parameter λ=0.5. The value network approximates play by the strong-but-slow RL policy; rollouts precisely evaluate the weak-but-fast rollout policy. Neither alone performs as well as the mixture, revealing that **intelligent systems benefit from multiple imperfect evaluators with different bias-variance tradeoffs**.

4. **Asynchronous Heterogeneous Computation**: The system combines CPU-based tree search with GPU-based neural network evaluation through lock-free asynchronous updates. Leaf nodes queue for evaluation while search continues; evaluations return and update statistics without blocking. This architecture pattern—**fast heuristic search coordinating with slow deep evaluation**—enables scaling that wouldn't work with synchronous coupling.

5. **Learning Representations vs. Handcrafted Features**: AlphaGo's neural networks learn position representations end-to-end from raw board state, replacing decades of handcrafted Go knowledge. Larger networks achieve better accuracy and stronger play despite being slower, because learned representations capture patterns human experts never explicitly formulated. The lesson: **in complex domains, the capacity to learn relevant abstractions matters more than the speed of evaluation**.

## REFERENCE DOCUMENTS

### FILE: cascading-approximation-architecture.md

```markdown
# Cascading Approximation: How Intelligent Systems Manage Intractable Search Spaces

## The Fundamental Challenge

Go presents a brutally honest mathematical problem: with branching factor b≈250 and game depth d≈150, exhaustive search requires evaluating approximately 250^150 positions—a number that dwarfs the atoms in the observable universe. Chess, with b≈35 and d≈80, yields "only" 35^80 positions and succumbed to brute-force search in Deep Blue. Go does not yield to this approach. Any system attempting to solve Go—human or artificial—must find ways to avoid exploring the vast majority of this space while still finding good moves.

The AlphaGo paper reveals a profound architectural principle: **intelligent systems solve intractable problems through cascading approximations, where each layer trades precision for computational speed at appropriate points in the decision process**.

## The Three-Layer Approximation Stack

AlphaGo implements three distinct approximation mechanisms, each operating at a different time scale:

### Layer 1: Policy Network (Slowest, Most Precise Move Selection)

The supervised learning policy network pσ evaluates the prior probability P(s,a) for each legal action from state s. Taking 3ms per evaluation on GPU, it's far too slow to evaluate during every node expansion in search. But it achieves 57% accuracy in predicting expert human moves—capturing in a learned representation what decades of Go knowledge could not articulate explicitly.

**Time scale**: 3ms per position  
**Role**: Narrow the search beam to high-probability moves  
**Tradeoff**: Expensive but accurate move selection

The paper demonstrates that small improvements in prediction accuracy lead to large improvements in playing strength (Fig 2a). A network with 57% accuracy substantially outperforms one with 55% accuracy, which outperforms one with 44% accuracy. This matters because the policy network determines which branches of the tree get explored—errors here compound through the entire search.

### Layer 2: Value Network (Medium Speed, Position Evaluation)

The value network vθ(s) predicts the probability of winning from position s, taking approximately 3ms per evaluation. It replaces the need for deep rollouts to terminal positions. Trained on 30 million positions from self-play, it learns to approximate the value function v^p_ρ under play by the RL policy network.

**Time scale**: 3ms per position  
**Role**: Evaluate leaf nodes without rollouts to game end  
**Tradeoff**: Faster than rollouts, but introduces approximation error

Critically, the paper shows (Fig 2b) that a single value network evaluation achieves similar accuracy to 100 rollouts using the SL policy network, but uses "15,000 times less computation." This isn't just an optimization—it's a fundamental architectural choice. The value network learns to internalize what thousands of rollouts would discover through simulation.

### Layer 3: Fast Rollout Policy (Fastest, Noisiest)

The rollout policy pπ uses simple pattern features and linear softmax, selecting moves in just 2µs (1,500 times faster than the policy network). It achieves only 24.2% accuracy compared to 57% for the policy network, but it can execute complete game simulations from leaf nodes to termination at approximately 1,000 simulations per second per CPU thread.

**Time scale**: 2µs per move selection  
**Role**: Provide cheap Monte Carlo estimates through complete game simulation  
**Tradeoff**: Weak play but sufficient for unbiased outcome sampling

The insight here is profound: **you don't need accurate move selection for Monte Carlo estimation—you need unbiased sampling**. The rollout policy is weak, but given enough samples, averaging over complete games provides reliable position evaluation.

## How the Layers Compose in MCTS

The cascading approximation architecture becomes clear in AlphaGo's Monte Carlo tree search (Fig 3):

**1. Tree Traversal (Fast Heuristic)**: Each simulation descends the tree by selecting actions that maximize Q(s,a) + u(s,a), where u depends on prior probabilities from the policy network and visit counts. This happens at CPU speeds without neural network evaluation.

**2. Leaf Expansion (Policy Network)**: When a node's visit count exceeds threshold n_thr, it's expanded. The position queues for policy network evaluation. The output probabilities P(s,a) = p_σ(a|s) replace placeholder priors, making future tree traversals more informed.

**3. Leaf Evaluation (Value Network + Rollouts)**: Leaf position s_L gets evaluated two ways:
   - **Deep evaluation**: Queue for value network evaluation vθ(s_L) on GPU
   - **Fast evaluation**: Execute rollout to game end using pπ, obtaining outcome z_L

**4. Backup (Statistical Aggregation)**: Both evaluations back up through the tree: V(s_L) = (1-λ)vθ(s_L) + λz_L. The mixing parameter λ=0.5 combines value network and rollout estimates.

Each layer operates asynchronously at its natural time scale. The tree search executes on CPUs; the policy and value networks evaluate on GPUs with queues managing the latency. This **asynchronous heterogeneous architecture** is essential—trying to synchronously wait for neural network evaluation at every node would make search impossibly slow.

## The Mixing Parameter: Why Both Evaluations Matter

A critical insight emerges from Figure 4b: AlphaGo with mixed evaluation (λ=0.5) defeats variants using only value networks (λ=0) or only rollouts (λ=1) by winning ≥95% of games against either.

Why do two imperfect evaluators outperform either alone?

**The value network** approximates v^p_ρ—the outcome under play by the strong RL policy network. But this is an approximation; the value network has never seen most positions in the search tree and must generalize. Its predictions are smooth but potentially biased.

**The rollouts** precisely compute the outcome under the weak rollout policy pπ. They're unbiased estimators but have high variance (one game is a noisy sample) and evaluate a different policy than the one being optimized.

**The mixture** combines a biased-but-low-variance estimate (value network) with an unbiased-but-high-variance estimate (rollouts). This is a deliberate architectural choice: **maintain multiple evaluation mechanisms with complementary failure modes**.

## Application to Agent System Design

### For Task Decomposition Systems

When a WinDAGs orchestrator faces a complex task, it should employ cascading approximation:

1. **Fast heuristic evaluation**: Quickly score all possible decompositions using simple pattern matching or learned heuristics
2. **Medium-depth evaluation**: For promising decompositions, evaluate feasibility using more sophisticated analysis
3. **Deep evaluation**: For the best candidates, actually attempt partial execution or detailed planning

The key insight: **don't apply your most expensive evaluation uniformly**. Use fast approximations to narrow the beam, then apply expensive evaluation only where it matters.

### For Multi-Agent Coordination

In agent systems without central control, cascading approximation provides a coordination pattern:

- **Local fast policies** make immediate decisions without coordination
- **Intermediate evaluation** shares learned value functions across agents to align understanding
- **Deep coordination** happens only for critical decisions through explicit communication

Each agent maintains multiple evaluation mechanisms at different computational costs, choosing which to invoke based on time pressure and decision importance.

### For Debugging and Code Review

Code review agents should cascade their approximation:

1. **Syntax and pattern matching** (milliseconds): Catch obvious errors
2. **Type checking and linting** (seconds): Catch structural problems  
3. **Semantic analysis** (tens of seconds): Understand intent
4. **Formal verification or extensive testing** (minutes): Prove correctness for critical sections

The pattern: **progressive refinement of approximation quality, with each layer catching different error types**.

## Boundary Conditions and Failure Modes

### When Cascading Approximation Fails

**1. When approximations are correlated**: If your fast and slow evaluators make the same mistakes, mixing them provides no benefit. AlphaGo avoids this by having the value network approximate a different policy (RL policy) than the rollout policy evaluates.

**2. When the tree search horizon is too short**: If the search doesn't look ahead far enough, even perfect leaf evaluation can't find good moves. The approximation cascade only works if tree search provides sufficient lookahead.

**3. When approximations are too crude**: Early in training, AlphaGo's policy network was only 44% accurate (prior work). This wasn't sufficient to narrow the search beam effectively—the system needed 57% accuracy to achieve master-level play.

### Critical Design Choices

**Queue management**: With asynchronous evaluation, queues can grow unboundedly if evaluation can't keep up with leaf expansion. AlphaGo dynamically adjusts the expansion threshold n_thr to match GPU throughput—a critical detail for systems mixing fast and slow components.

**Virtual loss**: During tree traversal, AlphaGo applies "virtual loss"—temporarily marking nodes as if they've been tried and lost n_vl times. This discourages other search threads from exploring the same variation simultaneously. Without this, parallel search threads would redundantly explore the same paths.

**Lock-free updates**: All statistics updates happen without locks, using atomic operations. This enables the asynchronous architecture to scale to 40 search threads and 8 GPUs without synchronization overhead.

## What Makes This Architecture Distinctive

Prior Go programs used MCTS with handcrafted pattern features and fast rollouts. Prior neural network approaches used end-to-end learning without search. AlphaGo's breakthrough is the **integration pattern**: multiple learned components (policy network, value network, fast rollout policy) operating at different time scales, coordinated through asynchronous tree search.

The architecture doesn't just play Go—it demonstrates how to structure any intelligent system facing intractable search spaces: **use your fastest approximations to narrow the beam, your medium-speed approximations to evaluate positions, and your slowest/most-precise mechanisms only where they provide the most value**.

For agent systems, this means: **don't treat all skills equally**. Some skills are fast heuristics (pattern matching, syntax checking, quick filters). Some are medium-depth analysis (semantic understanding, feasibility checking). Some are expensive verification (formal proof, extensive testing, human consultation). The architecture should cascade through these layers, using cheap skills to avoid invoking expensive ones unnecessarily.

The profound insight: **intelligent behavior emerges not from a single perfect evaluator, but from the composition of multiple imperfect evaluators with complementary strengths, operating at different computational budgets and coordinated through systematic search**.
```

### FILE: self-play-curriculum-generation.md

```markdown
# Self-Play as Curriculum Generation: How Systems Learn Beyond Their Teachers

## The Supervised Learning Ceiling

AlphaGo's training pipeline reveals a critical limitation of supervised learning: **you can only be as good as your training data**. The supervised learning (SL) policy network pσ was trained on 30 million positions from games played by human experts (KGS 6-9 dan players). It achieved 57% accuracy at predicting human expert moves—a substantial improvement over prior work's 44% accuracy.

But there's a ceiling here. The SL policy network learns to imitate human experts, not to play optimally. It learns the moves humans chose, including their mistakes, biases, and stylistic preferences. The paper notes that "the SL policy network pσ performed better in AlphaGo than the stronger RL policy network pρ" when used for guiding tree search, "presumably because humans select a diverse beam of promising moves, whereas RL optimizes for the single best move."

This reveals something profound: **supervised learning from experts teaches diversity and reasonable play; reinforcement learning from self-play teaches winning**.

## The Reinforcement Learning Breakthrough

The second stage of AlphaGo's training pipeline breaks through the supervised learning ceiling using policy gradient reinforcement learning. The RL policy network pρ is initialized to the SL network's weights (ρ = σ), then improved by playing games against itself.

### The Self-Play Protocol

The training process is elegantly simple but carefully designed:

1. **Play games** between the current policy network pρ and a randomly selected previous iteration of the policy network from a pool of opponents
2. **Observe outcomes**: zt = ±r(sT) at game end (+1 for win, -1 for loss)
3. **Update weights** using policy gradient: Δρ ∝ ∂log pρ(at|st)/∂ρ · zt

The key insight: **randomizing opponents from a pool of previous iterations prevents overfitting to the current policy**. If you only played against the most recent version of yourself, you might develop a narrow strategy that exploits weaknesses in that specific opponent. By playing against a diversity of past selves, you're forced to develop robust strategies.

### Performance Gains

The results are striking. The RL policy network won:
- **80%+ of games** against the SL policy network it was initialized from
- **85% of games** against Pachi (a strong Monte Carlo search program), using no search at all
- By comparison, the SL policy network won only 11-12% against similar programs

This isn't incremental improvement—it's a qualitative leap. The system learned to play better than any human in its training data by playing against itself and optimizing for the actual objective: winning games.

## Why Self-Play Works: The Curriculum Properties

Self-play functions as an **automatically generated curriculum** with several critical properties:

### 1. Always Appropriately Challenging

When you play against yourself, your opponent is always exactly at your skill level. Early in training, both players make similar mistakes, but some mistakes are more costly than others. The policy gradient updates amplify strategies that win more often and suppress strategies that lose.

As training progresses, the opponent gets stronger because you get stronger. The curriculum naturally adapts—you're always training against an opponent who's challenging but not overwhelming.

This contrasts with training against a fixed opponent (too easy or too hard as you improve) or random play (too noisy to learn from efficiently).

### 2. Unlimited Data Generation

Human expert games are finite. The KGS dataset contained 160,000 games—a large corpus, but fundamentally limited by how many games humans have played and recorded.

Self-play generates unlimited training data. AlphaGo played millions of games against itself, exploring positions and strategies that no human had ever encountered. The value network alone was trained on "30 million distinct positions, each sampled from a separate game" of self-play.

This matters because neural networks are data-hungry. Given enough capacity and data, they can learn patterns that smaller models or limited data would miss.

### 3. Exploration of Novel Strategies

Perhaps most importantly, self-play allows the system to discover moves and strategies that human experts never considered. Because it's optimizing for winning (not imitating humans), it's free to explore unusual moves if they lead to victory.

The paper notes that in the match against Fan Hui, AlphaGo evaluated "thousands of times fewer positions than Deep Blue did in its chess match against Kasparov," instead "selecting those positions more intelligently" and "evaluating them more precisely." This suggests AlphaGo developed Go intuitions that differed from human intuitions—not just imitating human pattern recognition but learning its own.

## The Value Network: Preventing Overfitting Through Decorrelation

The value network training reveals a subtle but crucial insight about preventing overfitting in self-play systems.

### The Naive Approach Fails

The authors initially tried training the value network on complete games from the KGS dataset:

"The naive approach of predicting game outcomes from data consisting of complete games leads to overfitting. The problem is that successive positions are strongly correlated, differing by just one stone, but the regression target is shared for the entire game."

The result: minimum MSE of 0.37 on test set vs 0.19 on training set—clear overfitting. **The value network memorized game outcomes rather than generalizing to new positions**.

### The Solution: One Position Per Game

To solve this, they generated a new self-play dataset with a crucial property: **each training example came from a different game**. Specifically:

1. Sample a random time step U from uniform{1, 450}
2. Play moves 1 through U-1 from the SL policy network
3. Play one random legal move at step U
4. Play remaining moves from the RL policy network until game ends
5. **Use only position sU+1 from this game** for training

This creates 30 million decorrelated training examples. The single random move at step U ensures that similar positions lead to different games, preventing the network from memorizing specific game trajectories.

Training on this decorrelated dataset: MSE of 0.226 on training set and 0.234 on test set—almost no overfitting.

The insight: **when generating training data through self-play, ensure examples are independent**. Successive positions in a single game are too correlated to count as independent samples.

## Application to Agent System Design

### For Multi-Agent Learning Systems

When training agents to coordinate or compete, consider self-play dynamics:

**For cooperative agents**: Have teams play against other versions of themselves. The agents learn to coordinate strategies that beat other similarly-skilled teams, developing robust cooperation patterns.

**For adversarial agents**: Red teams training against blue teams should maintain pools of previous iterations on both sides. This prevents narrow strategies that exploit a single opponent's weaknesses.

**For mixed-motive games**: Agents negotiating or bargaining should train against diverse past versions of themselves to develop strategies that work against many counterparty types.

### For Code Generation and Review Systems

Self-play principles apply to code agents:

**Generation + Review**: An agent that generates code and an agent that reviews it can improve through adversarial self-play:
- Generator learns to write code that passes review
- Reviewer learns to catch mistakes the generator makes
- Both improve together, like AlphaGo playing against itself

The key: **maintain a pool of previous generator and reviewer versions**. The generator should face reviewers of varying strictness; the reviewer should see code from generators of varying sophistication.

### For Architecture and Design Systems

Architectural agents benefit from self-play when:

**Design proposal vs. critique**: One agent proposes architectures; another critiques them. Train both through self-play where:
- Proposer learns to create designs that withstand critique
- Critic learns to identify flaws in increasingly sophisticated designs
- Pool of past versions prevents narrow design patterns

### For Task Decomposition Systems

Self-play applies to hierarchical task decomposition:

**Task proposer vs. task validator**: 
- Proposer learns to break tasks into executable subtasks
- Validator learns to identify infeasible decompositions
- Through self-play, both improve: proposer gets better at creating valid decompositions; validator gets better at catching subtle infeasibilities

The curriculum naturally increases in difficulty as both improve.

## Critical Design Choices for Self-Play Systems

### 1. Opponent Pool Management

AlphaGo "randomized from a pool of opponents to prevent overfitting to the current policy." The paper doesn't specify the pool size or update frequency, but states "every 500 iterations, we added the current parameters ρ to the opponent pool."

For agent systems: **maintain sufficient opponent diversity**. If your pool is too small or updates too slowly, you risk overfitting to a narrow strategy space. If it's too large or updates too quickly, you may lose training signal by playing against opponents far from your current skill level.

### 2. Reward Shaping vs. Terminal Rewards

AlphaGo used only terminal rewards: "We use a reward function r(s) that is zero for all non-terminal time steps t < T." The outcome zt = ±r(sT) is either +1 (win) or -1 (loss).

This is **sparse reward**—the system only learns from final outcomes, not intermediate positions. It works for Go because MCTS provides sufficient structure to credit-assign through the game tree.

For agent systems with longer horizons or less structured search: **consider whether intermediate rewards are necessary**. Sparse rewards are cleaner (no reward shaping bias) but harder to learn from. Dense rewards provide more training signal but risk reward hacking.

### 3. Policy Gradient Algorithm Choice

AlphaGo uses REINFORCE with baseline: Δρ ∝ ∂log pρ(at|st)/∂ρ · (zt - v(st))

The baseline v(st) "for variance reduction" is initially zero, then replaced by the value network vθ(s) on the second training pass, providing "a small performance boost."

The insight: **policy gradient variance is high with sparse terminal rewards**. Using the value network as baseline reduces variance by removing the expected return, leaving only the advantage. This is standard practice but worth emphasizing: **when training policies through self-play, invest in a good value function to use as baseline**.

### 4. Training Phases and Curriculum

AlphaGo's three-stage training pipeline is carefully ordered:

1. **Supervised learning** from human experts (fast, efficient, achieves competence)
2. **Reinforcement learning** from self-play (slower, achieves mastery)
3. **Value network training** from self-play positions (learns to evaluate the improved policy)

This ordering matters. Starting with supervised learning provides a strong initialization—the RL policy network doesn't start from random weights but from a network that already plays competently. Self-play then refines this competence into mastery.

For agent systems: **use supervised learning to achieve competence quickly, then use self-play or other optimization to push beyond training data**. Don't skip the supervised phase—it provides essential structure that makes RL tractable.

## Boundary Conditions and Failure Modes

### When Self-Play Fails

**1. In non-transitive games**: Self-play assumes that if strategy A beats strategy B, and B beats C, then A beats C. In games with rock-paper-scissors dynamics, self-play can cycle without converging.

**2. With insufficient exploration**: If the policy becomes too deterministic early in training, it may not explore enough to discover better strategies. AlphaGo's use of the SL policy network for tree search (which provides diversity) helps mitigate this.

**3. Without proper opponent pools**: Playing only against the most recent version of yourself can lead to forgetting previously-learned strategies. The opponent pool is essential for maintaining robustness.

**4. With poorly chosen architectures**: If the neural network doesn't have sufficient capacity to represent the value function or policy, self-play just amplifies the limitations. AlphaGo used deep networks (13 layers for policy, similar for value) to provide sufficient representational capacity.

## What Makes This Approach Irreplaceable

Many papers describe self-play for game AI. What makes AlphaGo's treatment distinctive?

**1. The scale**: 30 million self-play positions for value network training is unprecedented. This demonstrates that self-play isn't just a cute idea—it's a serious training methodology that works at scale.

**2. The integration**: Self-play isn't used in isolation but integrated with supervised learning (for initialization) and tree search (for improved training signal). The whole pipeline matters.

**3. The decorrelation technique**: The single-position-per-game sampling to prevent overfitting is a subtle but crucial detail that many implementations miss.

**4. The empirical validation**: Beating a professional human player proves that self-play can push beyond human expertise, not just match it. This wasn't guaranteed—many feared neural networks would plateau below human level.

For agent systems, the lesson is clear: **supervised learning gets you to competence by imitating experts; self-play gets you to mastery by optimizing your actual objective**. If your agents need to exceed the capabilities in their training data, self-play (or more generally, self-improvement through optimization against the true objective) is essential.

The profound insight: **the best teacher isn't an expert showing you what to do—it's yourself, optimized to win**.
```

### FILE: multiple-imperfect-evaluators.md

```markdown
# Multiple Imperfect Evaluators: Why Complementary Error Modes Beat Single Perfect Models

## The Mixed Evaluation Result

Figure 4b in the AlphaGo paper contains a finding that seems counterintuitive at first: **AlphaGo using mixed evaluation (λ=0.5) wins ≥95% of games against variants using only value network evaluation (λ=0) or only rollout evaluation (λ=1)**.

Neither evaluation mechanism alone is perfect. The value network vθ(s) achieves mean squared error of 0.226-0.234 on predicting game outcomes. Monte Carlo rollouts using the fast policy pπ are unbiased but high variance—a single rollout is a noisy sample. Yet combining these two imperfect evaluators substantially outperforms using either alone.

This isn't an artifact of Go or AlphaGo's specific implementation. It reveals a deep principle about intelligent system design: **systems benefit from maintaining multiple imperfect evaluation mechanisms with complementary failure modes, rather than investing everything in a single "best" evaluator**.

## Why Multiple Evaluators Work: Bias-Variance Tradeoff

### The Value Network: Biased but Low Variance

The value network vθ(s) approximates the value function v^pρ(s) under play by the RL policy network pρ. It's trained on 30 million positions from self-play, learning to predict game outcomes from board position alone.

**Strengths:**
- **Smooth predictions**: The network generalizes across similar positions, providing stable estimates
- **Fast**: Single forward pass takes ~3ms, much faster than rollouts to game end
- **Captures strategic patterns**: Learns high-level position features that correlate with winning

**Weaknesses:**
- **Biased**: Approximates v^pρ, not the true value under optimal play v*
- **Generalization errors**: For positions far from training distribution, predictions may be wrong
- **No exploration**: Evaluates only the position given, doesn't sample alternative continuations

Critically, the value network's errors are **systematic**—if it misunderstands a position type, it will consistently misunderstand similar positions. It's a learned function with a fixed bias.

### Rollouts: Unbiased but High Variance

Monte Carlo rollouts using the fast policy pπ play the game to completion and return the actual outcome zt = ±r(sT). These are unbiased estimates of the value function v^pπ under the rollout policy.

**Strengths:**
- **Unbiased**: Rollouts sample actual game trajectories and return real outcomes
- **Explores variations**: Different rollouts explore different continuations from the same position
- **Ground truth connection**: Ultimately tied to the objective (game outcome)

**Weaknesses:**
- **High variance**: Single rollouts are noisy; outcomes depend on stochastic action selection
- **Weak policy**: pπ achieves only 24.2% move prediction accuracy (vs 57% for the policy network)
- **Computationally expensive**: Even at 1,000 simulations/second, rollouts are slower than value network evaluation for large-scale search

Rollout errors are **random**—two rollouts from the same position can have opposite outcomes if the random action selections happen to be lucky or unlucky. Averaging many rollouts reduces variance, but each individual rollout is unreliable.

### The Mixture: Combining Complementary Error Modes

AlphaGo combines both evaluations with mixing parameter λ = 0.5:

V(sL) = (1-λ) vθ(sL) + λ zL

This is more than averaging—it's exploiting complementary error characteristics:

- **Value network smooths variance**: If rollouts happen to be unlucky (high variance), the value network provides a stable baseline estimate
- **Rollouts correct bias**: If the value network has systematic error in a position type, rollouts provide ground truth signal to counteract it
- **Different policies evaluated**: vθ approximates play under pρ (strong RL policy); rollouts evaluate play under pπ (weak fast policy). The mixture implicitly considers both strategies.

The paper states: "the two position-evaluation mechanisms are complementary: the value network approximates the outcome of games played by the strong but impractically slow pρ, while the rollouts can precisely score and evaluate the outcome of games played by the weaker but faster rollout policy pπ."

This is profound: **you don't need perfect evaluation—you need diverse imperfect evaluation that covers each mechanism's blind spots**.

## Empirical Evidence for Complementarity

Figure 2b shows evaluation accuracy (MSE) across game progression for different evaluation methods:

- **Value network**: Consistently low MSE (~0.23) throughout the game
- **RL policy network rollouts**: Slightly lower MSE (~0.20) but much more computationally expensive
- **SL policy network rollouts**: MSE ~0.25, worse than value network
- **Fast rollout policy**: MSE ~0.30, worse than all neural network methods
- **Uniform random rollouts**: MSE ~0.45, terrible baseline

The value network alone outperforms fast rollouts alone. Yet AlphaGo uses both because:

1. **Coverage**: Value network might fail on tactical positions where concrete calculation matters; rollouts provide grounding in actual tactics
2. **Calibration**: Rollouts help calibrate value network predictions—if the value network consistently disagrees with rollout outcomes, this signals potential bias
3. **Adaptation**: During search, as the tree grows, rollout statistics become more precise (averaging over more samples); value network provides immediate estimates for newly-expanded nodes

## Application to Agent System Architecture

### For Task Decomposition Systems

When breaking complex tasks into subtasks, use multiple imperfect evaluators:

**Fast heuristic evaluation**: Pattern matching, simple rules (biased but fast)  
**Learned feasibility model**: Neural network predicting subtask success probability (smooth but potentially wrong for novel situations)  
**Actual execution attempt**: Try running subtasks in sandbox (unbiased but expensive)

The pattern: **use fast biased evaluators to narrow options, then validate with expensive unbiased evaluation on the most promising candidates**.

For example, when decomposing "build a web application":
- **Heuristic**: Check if proposed subtasks match known architectural patterns (fast, biased toward conventional solutions)
- **Learned model**: Estimate probability that the combination of subtasks satisfies requirements (smooth prediction)
- **Sandbox execution**: Actually try to compile/run the proposed implementation (ground truth but expensive)

Mixing these evaluations provides better task decomposition than any single method.

### For Code Review Systems

Code review agents should maintain multiple evaluation mechanisms:

**Static analysis**: Type checking, linting, pattern matching (fast, deterministic, catches known error patterns)  
**Learned bug detector**: Neural network trained on past bugs (catches common mistakes even if they pass static analysis)  
**Dynamic testing**: Actually run code with test inputs (expensive but finds real bugs)  
**Formal verification**: Prove correctness properties (extremely expensive, only for critical sections)

The key insight: **static analysis has systematic blind spots (misses semantic errors); dynamic testing has random blind spots (only finds bugs in tested paths)**. Using both together provides better coverage than either alone.

A practical architecture:
1. Run static analysis on all code (cheap, catches obvious errors)
2. Run learned bug detector on code that passed static analysis (catches common patterns of semantic errors)
3. Run dynamic tests on suspicious sections flagged by either detector
4. Apply formal verification only to critical security/safety properties

This cascade uses multiple imperfect evaluators, each catching errors the others miss.

### For Multi-Agent Coordination

When multiple agents must coordinate without central control, each agent should maintain multiple models:

**Own value function**: Agent's estimate of outcome from its perspective (potentially biased by limited information)  
**Other agents' value functions**: Models of what other agents likely believe (helps predict their actions)  
**Ground truth feedback**: Actual outcomes from past coordination attempts (unbiased but sparse)

An agent choosing whether to wait for another agent's result or proceed independently can:
- **Use own value function** to estimate value of proceeding independently (fast, but may miss information about what other agent knows)
- **Use model of other agent** to estimate value of waiting (catches cases where other agent has better information)
- **Use past outcomes** to calibrate these models (prevents systematic overconfidence)

The mixture prevents failures where one model is systematically wrong: if your own value function is overconfident, the other-agent model provides a conservative check; if both are uncertain, past outcomes provide ground truth.

### For Architecture Review Systems

When reviewing software architectures, use multiple complementary evaluations:

**Pattern matching**: Compare to known good/bad architectural patterns (fast, catches common antipatterns)  
**Learned quality model**: Neural network predicting maintainability, scalability based on structural features (smooth, catches subtle quality issues)  
**Simulation**: Model system behavior under load (expensive, finds performance problems)  
**Expert review**: Human architect review (very expensive, finds conceptual problems)

Different evaluators catch different problems:
- Pattern matching catches violations of known best practices
- Learned models catch architectural smells that correlate with past problems
- Simulation finds concrete performance bottlenecks
- Expert review finds novel problems or subtle requirement mismatches

Using all four provides better coverage than any single evaluation—each has complementary blind spots.

## Design Principles for Multiple-Evaluator Systems

### 1. Ensure Complementary Error Modes

Don't use two evaluators with identical failure modes. The value comes from diversity of error types.

**Good complementarity:**
- Biased+fast vs. unbiased+slow
- Learned+smooth vs. rules-based+discrete  
- Model-based vs. model-free
- Aggregate statistics vs. individual samples

**Poor complementarity:**
- Two neural networks trained on the same data with similar architectures (likely similar errors)
- Two rule-based systems using the same knowledge base (likely identical blind spots)

### 2. Weight by Inverse Error Correlation

If evaluators make independent errors, equal weighting (λ=0.5) works well. If errors are correlated, weight toward the evaluator with more independent errors.

AlphaGo uses λ=0.5 because value network and rollout errors are largely independent: value network errors are systematic (wrong about position types); rollout errors are random (noisy sampling).

For agent systems: **empirically measure error correlation between evaluators**. If two evaluators often make the same mistakes, they're not complementary—diversify your evaluation methods.

### 3. Use Appropriate Computational Budget Allocation

Different evaluators have different computational costs. Allocate budget to maximize total evaluation quality, not to equalize usage.

AlphaGo uses:
- Value network: ~3ms per evaluation, used once per leaf node
- Rollouts: ~1000 simulations/second, averaged over many samples per leaf
- Policy network: ~3ms per evaluation, used once per node expansion

The system doesn't try to invoke all evaluators equally—it uses each where it provides maximum value per computational cost.

For agent systems: **measure evaluation cost vs. accuracy improvement**. Some evaluators are so cheap (static analysis) you should use them on everything. Some are so expensive (formal verification) you should use them only on critical code. Optimize the portfolio, not individual evaluators.

### 4. Maintain Evaluation Diversity Under Pressure

When time is limited, it's tempting to use only your fastest evaluator. This is often wrong—losing evaluation diversity hurts more than losing computational depth.

AlphaGo always uses both value network and rollouts, even in time pressure. The mixed evaluation (λ=0.5) is not a luxury for when you have spare computation—it's essential for robust evaluation.

For agent systems: **resist the temptation to skip expensive evaluators when rushed**. If dynamic testing takes too long, run fewer tests on critical paths, but don't skip testing entirely. Maintaining evaluation diversity matters more than depth of any single evaluation.

## Boundary Conditions and Failure Modes

### When Multiple Evaluators Hurt

**1. Highly correlated errors**: If two evaluators make identical mistakes, combining them provides no benefit and wastes computation. Example: two neural networks with similar architecture trained on identical data.

**2. Miscalibrated mixing**: If one evaluator is much better but you weight them equally, you're averaging good evaluation with bad. AlphaGo's λ=0.5 works because neither evaluator strongly dominates. If value network MSE was 0.10 and rollout MSE was 0.40, λ=0.2 might work better.

**3. Adversarially constructed examples**: If an adversary can craft inputs where all evaluators fail together, the diversity protection disappears. This is a concern for security-critical systems.

**4. Computational budget constraints**: In extreme resource limits, one evaluator may be better than a mixture if other evaluators are too expensive to be useful.

### Critical Design Choices

**Asynchronous evaluation**: AlphaGo evaluates value network and rollouts asynchronously—value network evaluation queues on GPU while rollouts execute on CPU. This is essential for the architecture to work efficiently.

For agent systems: **don't wait for all evaluators to complete before making decisions**. Use fast evaluators immediately; incorporate slow evaluators when they return. The search tree structure enables this—backup happens whenever evaluation completes, not synchronously.

**Dynamic mixing**: AlphaGo uses fixed λ=0.5, but one could imagine adaptive mixing based on:
- Position complexity (more rollouts for tactical positions?)
- Evaluation agreement (if value network and rollouts agree, trust them; if they disagree, gather more evidence?)
- Computational budget remaining (shift toward cheaper evaluation in time pressure?)

The paper doesn't explore this, but it's a natural extension for agent systems with varying resource constraints.

## What Makes This Insight Irreplaceable

The multiple-evaluator principle appears in various forms across AI: ensemble methods, mixture of experts, bagging/boosting. But AlphaGo's treatment is distinctive because:

**1. Explicit bias-variance tradeoff**: The paper clearly articulates why value network (biased, low variance) and rollouts (unbiased, high variance) complement each other. This isn't just "more evaluators is better"—it's specific insight about error characteristics.

**2. Different policies evaluated**: The value network approximates play under policy pρ; rollouts evaluate policy pπ. This means the evaluators aren't just different measurement techniques—they're estimating fundamentally different quantities. Their mixture implicitly considers multiple strategies.

**3. Empirical validation**: The tournament results (Figure 4b) prove that mixing outperforms either component alone by a large margin (≥95% win rate). This isn't a theoretical nicety—it's a practical necessity.

**4. Scale demonstration**: Using both evaluators at the scale of tens of GPUs and thousands of CPUs shows this isn't just a laboratory trick—it's a production-grade architectural pattern.

For agent system design, the lesson is profound: **don't search for the single best evaluator—design a portfolio of complementary evaluators with diverse error modes**. The system's robustness comes not from perfect individual components but from their composition covering each other's blind spots.

The key insight: **perfect evaluation is impossible; diverse imperfect evaluation is sufficient**.
```

### FILE: asynchronous-heterogeneous-architecture.md

```markdown
# Asynchronous Heterogeneous Architecture: Coordinating Fast Heuristic Search with Slow Deep Evaluation

## The Computational Asymmetry Problem

AlphaGo faces a fundamental architectural challenge: the components that make good decisions operate at radically different speeds.

**Tree search** (selecting actions that maximize Q(s,a) + u(s,a)): ~microseconds per decision, runs on CPU  
**Fast rollout policy** (selecting moves in simulation): 2µs per action, runs on CPU  
**Policy network** (evaluating move probabilities): ~3ms per evaluation, requires GPU  
**Value network** (evaluating positions): ~3ms per evaluation, requires GPU

The neural networks are **1,000-1,500 times slower** than the tree search and rollout components. If tree search waited synchronously for neural network evaluation at every step, the system would be crippled—you'd get at most ~300 evaluations per second, far too slow for effective search.

Yet the neural networks provide the highest-quality evaluation. The policy network achieves 57% move prediction accuracy vs 24.2% for the fast rollout policy. The value network provides position evaluation that approaches the accuracy of many rollouts using the RL policy network "using 15,000 times less computation."

The architecture must somehow get the benefits of deep neural network evaluation without suffering the latency cost at every decision point. This requires **asynchronous heterogeneous computation**: fast CPU-based search coordinating with slow GPU-based evaluation through carefully designed queues and lock-free updates.

## The Asynchronous Policy and Value MCTS Algorithm

AlphaGo's APV-MCTS (Asynchronous Policy and Value Monte Carlo Tree Search) elegantly solves the speed asymmetry problem through four key mechanisms:

### 1. Decoupled Search and Evaluation

The tree search runs continuously on CPUs without waiting for neural network evaluation:

**Tree traversal** (CPU): Select actions by maximizing Q(s,a) + u(s,a) using statistics already in the tree. This requires no neural network evaluation—just looking up stored values and computing a simple exploration bonus u(s,a) ∝ P(s,a)/(1 + N(s,a)).

**Leaf expansion** (CPU→GPU queue): When reaching a leaf node sL, add it to the policy network evaluation queue, but **don't wait**. Continue with other simulations immediately. The position will be evaluated asynchronously on GPU; results return later.

**Leaf evaluation** (CPU + GPU): The leaf gets two types of evaluation:
- **Rollout** (CPU): Execute immediately using fast policy pπ until game end
- **Value network** (GPU): Queue for asynchronous evaluation, result returns when GPU completes

**Backup** (CPU): When rollout completes or value network evaluation returns, update statistics through the path from leaf to root. These updates happen asynchronously—tree search doesn't wait for them.

The key insight: **decouple decision-making (which must be fast) from evaluation (which can be slow)**. Make decisions using already-computed statistics; update statistics asynchronously when new evaluations complete.

### 2. Queue-Based GPU Communication

Neural network evaluation happens through queues:

**Policy network queue**: When node expansion threshold is reached (Nr(s,a) > nthr), add position s′ to policy network queue. GPU pulls mini-batches from this queue, evaluates them in parallel, returns probability distributions P(s′,a) = pσ(a|s′).

**Value network queue**: When reaching leaf node sL, add to value network queue. GPU evaluates mini-batches, returns value estimates vθ(sL).

The paper uses **mini-batch size of 1** "to minimize end-to-end evaluation time." This seems counterintuitive—GPUs are designed for large batches. But for tree search, latency matters more than throughput. A single position queuing for evaluation should get a result quickly, not wait for a full batch to accumulate.

For agent systems with less time-critical needs, larger mini-batches might be appropriate. The key is balancing:
- **Throughput**: Larger batches use GPU more efficiently (higher ops/second)
- **Latency**: Smaller batches return results faster (lower seconds/result)

AlphaGo optimizes for latency because tree search can't make progress without evaluation results.

### 3. Lock-Free Parallel Updates

Multiple search threads run in parallel (40 threads in match configuration), all reading and writing the shared search tree. Traditional parallel programming would require locks to prevent concurrent writes from corrupting data.

AlphaGo instead uses **lock-free updates**: "All updates are performed lock-free." The paper references "Enzenberger & Müller 2009" which describes a lock-free multithreaded MCTS algorithm.

The basic technique:
- Action values Q(s,a) are computed from visit counts N(s,a) and win counts W(s,a): Q(s,a) = W(s,a)/N(s,a)
- Updates increment these statistics: N(s,a) ← N(s,a) + 1, W(s,a) ← W(s,a) + value
- Using atomic increments (available in modern CPUs), these updates are thread-safe without locks

The benefit: **no synchronization overhead**. Threads never wait for each other. Occasionally, a thread reads slightly stale statistics (another thread's update hasn't completed yet), but this introduces negligible error compared to the statistical noise in Monte Carlo evaluation.

This is crucial for scaling to 40 search threads. With locks, contention would limit parallel speedup—threads would spend time waiting for locks. Without locks, scaling is nearly linear in thread count.

### 4. Virtual Loss for Coordination

Without coordination, parallel search threads might redundantly explore the same variation:
- Thread A selects action a1 from root because it has high Q + u
- Thread B, running simultaneously, also selects a1 for the same reason
- Both threads explore identical paths, wasting computation

AlphaGo uses **virtual loss** to prevent this:

During tree traversal, before evaluating a leaf, "update rollout statistics as if it has lost nvl games": Nr(st, at) ← Nr(st, at) + nvl, Wr(st, at) ← Wr(st, at) - nvl.

This temporarily makes the path look worse, discouraging other threads from selecting it. When evaluation completes, remove the virtual loss and add actual results: Nr(st, at) ← Nr(st, at) - nvl + 1, Wr(st, at) ← Wr(st, at) + nvl + zt.

The paper uses nvl = 3. This means in-flight evaluations look like they've already lost 3 games, providing strong discouragement without completely blocking the path (which would be appropriate if you had hard evidence it was bad).

**Virtual loss is subtle coordination without communication**: threads don't explicitly coordinate, but they avoid redundant work by marking in-progress explorations as temporarily undesirable.

## Scaling to Distributed Architecture

The single-machine version uses 40 search threads, 48 CPUs, 8 GPUs. The distributed version scales to 40 search threads, 1,202 CPUs, 176 GPUs.

This requires architectural evolution:

**Centralized search tree**: A single master machine stores the entire search tree and executes tree traversal. This avoids the need to synchronize tree state across machines—only the master writes to the tree.

**Remote worker CPUs**: Execute rollouts. The master sends leaf positions to worker CPUs; workers execute rollouts to game end and return outcomes. This parallelizes the CPU-intensive rollout computation.

**Remote worker GPUs**: Evaluate policy and value networks. The master sends positions to worker GPUs; workers compute neural network forward passes and return probabilities/values.

The architecture is **hierarchical**: fast decisions (tree traversal) happen on master; slow evaluation (rollouts, neural networks) distributes to workers.

Communication pattern:
- Master → Workers: Send positions to evaluate
- Workers → Master: Return evaluation results (probabilities, values, rollout outcomes)
- No Worker-Worker communication

This minimizes communication overhead and avoids synchronization complexity. Workers don't coordinate with each other—only the master maintains global state.

### Scaling Results

Figure 4c shows how AlphaGo's performance (Elo rating) scales with computation:

**Single machine** (asynchronous):
- 1 thread, 8 GPUs: ~2,200 Elo
- 40 threads, 8 GPUs: ~2,900 Elo (+700 Elo from parallelization)

**Distributed**:
- 12 threads, 64 GPUs, 428 CPUs: ~2,937 Elo
- 40 threads, 176 GPUs, 1,202 CPUs: ~3,140 Elo (+240 Elo from distribution)

The scaling isn't linear (doubling resources doesn't double Elo), but it's substantial. Going from 8 to 176 GPUs (22× increase) gains ~240 Elo. This represents the difference between strong amateur and world champion.

Critically, **scaling continues to help even at large resource counts**. The 64-GPU distributed version still benefits from scaling to 280 GPUs, gaining ~90 Elo. This suggests the architecture doesn't hit diminishing returns until very large scale.

## Application to Agent System Design

### For Multi-Agent Orchestration

WinDAGs orchestrates multiple agents with heterogeneous speeds:
- **Fast skills**: Syntax checking, pattern matching, quick filters (milliseconds)
- **Medium skills**: Code analysis, feasibility checking (seconds)
- **Slow skills**: Formal verification, extensive testing, human review (minutes)

The AlphaGo pattern applies directly:

**Asynchronous execution**: Don't wait for slow skills to complete before invoking fast skills. Queue slow skill invocations; continue with fast skills immediately.

**Queue-based communication**: Slow skills pull work from queues, return results asynchronously. The orchestrator makes decisions based on available information, incorporating slow results when they arrive.

**Lock-free coordination**: If multiple orchestration threads operate on shared state (like a task graph), use lock-free data structures to avoid synchronization overhead.

**Virtual loss analog**: Mark in-progress skill invocations in the task graph to prevent redundant work. If Agent A is already analyzing a code module, Agent B shouldn't duplicate that work—the in-progress analysis should temporarily make that path less attractive.

### For Progressive Enhancement in Code Review

Code review agents should use asynchronous heterogeneous architecture:

**Fast pass** (CPU, milliseconds):
- Syntax checking
- Style linting
- Basic pattern matching
- → Results available immediately

**Medium pass** (CPU, seconds):
- Type checking
- Static analysis
- Complexity metrics
- → Queue these analyses, continue with fast results

**Deep pass** (GPU or remote service, minutes):
- Semantic bug detection using neural networks
- Cross-module dependency analysis
- Security vulnerability scanning
- → Queue these, incorporate results when available

The review report evolves over time:
1. Fast results appear immediately (syntax errors, style violations)
2. Medium results appear within seconds (type errors, static analysis warnings)
3. Deep results appear within minutes (semantic bugs, security issues)

Users get immediate feedback from fast passes while slow passes complete in background. This is better than blocking for minutes before showing any results.

### For Hierarchical Task Decomposition

Task decomposition systems face similar asymmetry:

**Fast decomposition** (pattern matching): "Build web app" → ["frontend", "backend", "database"] (milliseconds)

**Feasibility checking** (heuristics): Check if proposed subtasks make sense given requirements (seconds)

**Detailed planning** (search/optimization): Generate concrete implementation plans for each subtask (tens of seconds)

**Validation** (execution): Actually attempt to build components in sandbox (minutes)

Use AlphaGo's pattern:
- Generate many decompositions quickly using pattern matching
- Queue them for feasibility checking
- Select most feasible for detailed planning
- Validate top candidates through sandbox execution

The key: **don't wait for slow validation before generating more decompositions**. Generate many candidates quickly; validate them asynchronously; refine promising candidates while validation completes.

### For Multi-Stage Code Generation

Code generation with review has natural asynchrony:

**Stage 1**: Generate code skeleton (fast, runs on CPU)  
**Stage 2**: Fill in implementation details (medium, might use GPU for code completion)  
**Stage 3**: Review generated code (slow, might use large model or human review)  
**Stage 4**: Execute and test (very slow, requires sandboxing)

Traditional pipeline: Stage 1 → wait → Stage 2 → wait → Stage 3 → wait → Stage 4

Asynchronous architecture:
- Stage 1 generates multiple skeletons in parallel
- Queue all of them for Stage 2 implementation
- As implementations complete, queue for Stage 3 review
- As reviews complete, queue for Stage 4 testing
- Continue generating new skeletons while later stages process earlier results

This **pipeline parallelism** keeps all components busy. GPUs process implementations while CPUs generate skeletons and execute tests. The system achieves much higher throughput than sequential processing.

## Critical Design Patterns

### 1. Dynamic Threshold Adjustment

AlphaGo "dynamically adjusts the expansion threshold nthr to ensure that the rate at which positions are added to the policy queue matches the rate at which the GPUs evaluate the policy network."

This is **backpressure control**: if GPUs can't keep up with the rate of leaf expansion, increase nthr so fewer leaves get expanded. If GPUs are idle, decrease nthr to give them more work.

For agent systems: **monitor queue depths and adjust thresholds**. If slow skill queues are growing unboundedly, you're generating work faster than you can process it—throttle fast skill invocation. If queues are empty, you're under-utilizing slow skills—generate more work.

### 2. Placeholder Priors

When a node is first expanded, AlphaGo initializes prior probabilities using a fast tree policy pτ (simpler than policy network but more features than rollout policy). These are **placeholder priors**—they're replaced when policy network evaluation completes, but they allow tree search to proceed immediately without waiting.

For agent systems: **use fast approximations as placeholders for slow evaluations**. When decomposing a task, use pattern-matching heuristics to get initial feasibility estimates. Replace them with learned model predictions when available. Don't block on slow evaluation—make decisions with approximations and refine them asynchronously.

### 3. Atomic Updates with Relaxed Consistency

Lock-free updates mean threads occasionally read slightly stale data. A thread might read N(s,a) before another thread's increment completes, getting an outdated visit count.

This is **relaxed consistency**—you don't guarantee every thread sees the most recent state, just that updates eventually become visible to all threads.

For agent systems: **embrace eventual consistency in coordination**. If multiple agents are updating a shared task graph, they don't need to see every update immediately. As long as updates propagate within a reasonable time frame, the system functions correctly. This is much more scalable than requiring immediate global consistency.

### 4. Explicit Symmetry Handling

AlphaGo handles board symmetries (8 rotations/reflections) through "implicit symmetry ensemble": randomly select one symmetry j ∈ [1,8] for each evaluation, compute neural network for that orientation only.

This is cheaper than evaluating all 8 orientations and averaging (used in policy network training). The search tree averages over many simulations with different random symmetries, achieving similar benefit at 1/8 the cost per evaluation.

For agent systems: **when problems have inherent symmetries, exploit them through random sampling rather than exhaustive enumeration**. If a code review can be performed in multiple orders (analyze function A then B, or B then A), randomly select an order rather than trying both. The averaged results converge to the same answer with less computation.

## Boundary Conditions and Failure Modes

### When Asynchrony Fails

**1. High evaluation latency**: If neural network evaluation takes many seconds (maybe using a slow remote API), the asynchronous architecture helps less. Tree search can't make progress without evaluation results—if results take too long, search stalls waiting for enough evaluations to accumulate statistics.

**2. Unbounded queue growth**: If evaluation is slower than work generation, queues grow unboundedly and memory explodes. Dynamic threshold adjustment is essential—without it, the system crashes.

**3. Ordering dependencies**: If evaluation B depends on evaluation A completing first, asynchrony requires explicit dependency tracking. AlphaGo avoids this—all evaluations are independent. Agent systems with complex dependencies need a DAG of tasks, not just queues.

**4. Inconsistent partial results**: If users see results before all evaluations complete, partial results might be misleading. AlphaGo addresses this by only selecting a move after search completes. Agent systems might need to mark results as "preliminary" until all evaluations finish.

### Critical Implementation Details

**Queue management**: AlphaGo uses "mini-batch size of 1 to minimize end-to-end evaluation time." But the paper doesn't specify queue data structures, timeout policies, or what happens if GPUs fall behind. Real implementations need:
- Maximum queue depths to prevent memory exhaustion
- Timeout policies for stuck evaluations
- Graceful degradation if GPUs fail

**Error handling**: What if a GPU crashes mid-evaluation? The paper doesn't address this, but production systems need:
- Retry logic for failed evaluations
- Fallback to CPU evaluation if GPUs unavailable
- Placeholder values if evaluation fails completely

**Result delivery**: When GPU evaluation completes, how does the result reach the search thread that requested it? The paper says results "back up the originating search path," implying some mapping from evaluation result to search thread. This requires tracking which thread initiated each evaluation.

## What Makes This Architecture Irreplaceable

Many parallel search algorithms exist. Many systems use GPUs for neural network evaluation. What makes AlphaGo's architecture distinctive?

**1. Scale**: 40 threads, 8 GPUs on single machine; 1,202 CPUs, 176 GPUs distributed. This demonstrates the architecture works at production scale, not just in laboratory conditions.

**2. Measured impact**: Figure 4c shows precisely how performance scales with resources. Most papers don't provide detailed scaling curves—this one does, proving the architecture actually utilizes additional resources effectively.

**3. Integration**: The architecture seamlessly combines CPU search (fast), GPU policy networks (medium), and GPU value networks (medium), plus CPU rollouts (fast but noisy). Four different computational patterns coordinated through queues and lock-free updates.

**4. Empirical validation**: Beating a professional Go player proves the architecture doesn't just scale—it actually solves hard problems. This validates that asynchronous heterogeneous computation can achieve superhuman performance.

For agent systems, the lesson is clear: **don't wait for slow components before invoking fast ones; don't force synchronization when eventual consistency suffices; don't use locks when atomic operations will work**.

The profound insight: **intelligent systems are fundamentally heterogeneous—different components operate at different speeds, and the architecture must embrace this asymmetry rather than trying to impose uniform synchrony**.
```

### FILE: learned-representations-vs-handcrafted-features.md

```markdown
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
```

### FILE: evaluation-approximation-tradeoffs.md

```markdown
# Evaluation Approximation Tradeoffs: Speed, Accuracy, and Computational Budget Allocation

## The Evaluation Landscape

AlphaGo's search must evaluate positions quickly enough to explore sufficient search depth, but accurately enough to distinguish good moves from bad. This tension—**speed vs accuracy in position evaluation**—shapes the entire system architecture.

Different evaluation mechanisms occupy different points in this tradeoff space:

**Uniform random rollouts**: ~1000 simulations/sec, MSE ≈ 0.45 (terrible accuracy)  
**Fast rollout policy pπ**: ~1000 simulations/sec, MSE ≈ 0.30 (poor but usable)  
**Value network vθ**: ~333 evaluations/sec (3ms each), MSE ≈ 0.23 (good accuracy)  
**SL policy network rollouts**: ~333 rollouts/sec, MSE ≈ 0.25 (good but expensive)  
**RL policy network rollouts**: ~50 rollouts/sec (slower policy), MSE ≈ 0.20 (best accuracy)

Each mechanism makes different tradeoffs. Fast rollouts are weak but allow many simulations. Value network provides good accuracy with single evaluation. RL policy rollouts are most accurate but too slow for search.

The system must **allocate limited computational budget** across these evaluation mechanisms to maximize playing strength.

## The Computational Budget Problem

During search, AlphaGo has finite computational resources:
- **CPUs** for tree traversal and rollouts
- **GPUs** for neural network evaluation
- **Time** until move must be selected

The match version used 48 CPUs and 8 GPUs. With 5 seconds per move, approximately:
- 5,000 CPU-seconds available for computation
- 40 GPU-seconds available for neural networks

How should this budget be allocated across different evaluation types?

### The Naive Approach: Uniform Allocation

A naive system might evaluate every leaf with all available methods:
- Value network evaluation (3ms on GPU)
- Multiple rollouts using SL policy (3ms each)
- Multiple rollouts using fast policy (1ms each)

But this is wasteful. If value network and fast rollouts largely agree, why spend expensive GPU time on SL policy rollouts? The system should **dynamically allocate evaluation based on uncertainty and importance**.

### AlphaGo's Approach: Staged Evaluation

AlphaGo uses a sophisticated allocation strategy:

**1. Tree traversal (CPU, microseconds)**: Select actions using Q(s,a) + u(s,a) computed from existing statistics. This is essentially free—no evaluation needed, just table lookups.

**2. Leaf evaluation (CPU+GPU, milliseconds)**: At leaf nodes, always evaluate using:
- **One fast rollout** (CPU, ~1ms): Provides unbiased estimate
- **One value network evaluation** (GPU, ~3ms): Provides low-variance estimate

The mixing V(sL) = 0.5·vθ(sL) + 0.5·zL combines both. This allocation (50% weight to each) is **fixed**—AlphaGo doesn't dynamically adjust λ based on position or uncertainty.

**3. Node expansion (GPU, milliseconds)**: When visit count exceeds threshold, evaluate position with policy network to get improved priors P(s,a). This happens once per node, not once per simulation.

The key insight: **different evaluation types are invoked at different frequencies**:
- Tree traversal: Every simulation (tens of thousands of times)
- Leaf rollouts: Every leaf node (thousands of times)
- Leaf value network: Every leaf node (thousands of times)
- Node expansion policy network: Once per expanded node (hundreds of times)

This naturally allocates more budget to cheap evaluations (tree traversal) and less to expensive evaluations (policy network).

## The Threshold Decision: When to Expand Nodes

AlphaGo expands a node (invoking policy network evaluation) when Nr(s,a) > nthr. This threshold determines the budget allocated to policy network vs. other evaluations.

**High threshold** (nthr = 100):
- Fewer nodes expanded → fewer policy network evaluations
- More simulations using placeholder priors → more rollouts
- Saves GPU budget for value network evaluations

**Low threshold** (nthr = 10):
- More nodes expanded → more policy network evaluations
- Fewer simulations per node → less rollout data before expansion
- Uses more GPU budget for priors, less for value evaluation

AlphaGo uses nthr = 40 in match version. The paper states this is "adjusted dynamically to ensure that the rate at which positions are added to the policy queue matches the rate at which the GPUs evaluate the policy network."

This is **adaptive allocation**: if GPU evaluation falls behind (queue grows), increase threshold to generate less work. If GPUs are idle (queue empty), decrease threshold to generate more work.

The insight: **evaluation budget allocation should adapt to available resources**. When GPUs are saturated, rely more on cheap CPU evaluations. When GPUs are idle, use them more aggressively.

## Value Network vs. Rollouts: The Mixing Parameter

AlphaGo combines value network and rollout evaluation with λ = 0.5:

V(sL) = (1-λ) vθ(sL) + λ zL

Why not λ = 0 (value network only) or λ = 1 (rollouts only)?

Figure 4b shows tournament results:

**αrvp** (mixed, λ=0.5): 2,890 Elo  
**αvp** (value network only, λ=0): 2,177 Elo  
**αrp** (rollouts only, λ=1): 2,416 Elo

The mixed version beats either pure version by huge margins (win rate ≥95%).

### Why Mixing Wins

**Value network strengths**:
- Low variance (smooth predictions)
- Captures strategic patterns
- Fast (3ms per evaluation)

**Value network weaknesses**:
- Biased (approximates v^pρ, not true value)
- May misunderstand tactical positions

**Rollout strengths**:
- Unbiased (actual game outcomes)
- Captures tactics (through concrete calculation)
- Independent samples reduce variance through averaging

**Rollout weaknesses**:
- High variance (single rollout is noisy)
- Weak policy (only 24.2% accuracy)
- Slow (many rollouts needed for precision)

The mixture **exploits complementary strengths**: value network provides low-variance baseline; rollouts provide unbiased correction. When they disagree, this signals either:
- Position is tactically complex (rollouts more reliable)
- Position is strategically subtle (value network more reliable)

Averaging them provides robustness against both types of error.

### Budget Allocation Implications

With λ = 0.5, the system allocates roughly equal budget to:
- GPU time for value network (3ms per leaf)
- CPU time for rollouts (~1ms per leaf per rollout, average 1-3 rollouts per leaf)

This allocation is **empirically optimal** for AlphaGo's architecture. Different λ values would shift budget between GPU value network and CPU rollouts.

For systems with different hardware (more GPUs relative to CPUs, or vice versa), optimal λ might differ. The principle: **allocate evaluation budget to maximize total accuracy per unit time, not to equalize usage of different resources**.

## Application to Agent System Design

### For Multi-Stage Code Review

Code review agents face similar evaluation tradeoffs:

**Fast checks** (milliseconds):
- Syntax validation
- Style linting
- Pattern matching for known bugs

**Medium checks** (seconds):
- Type checking
- Static analysis
- Complexity metrics

**Slow checks** (minutes):
- Semantic bug detection (neural models)
- Security vulnerability scanning
- Cross-module dependency analysis

How to allocate review budget?

**AlphaGo's pattern**:
1. **Always run fast checks** on all code (analogous to tree traversal—cheap enough to apply everywhere)
2. **Run medium checks on promising candidates** that passed fast checks (analogous to leaf evaluation—apply selectively)
3. **Run slow checks on high-risk code** flagged by medium checks (analogous to node expansion—apply rarely when high value)

The threshold for invoking slow checks should **adapt to available computational budget**: if slow checks are backlogged, increase threshold; if reviewers are idle, decrease threshold.

### For Task Decomposition with Validation

Task decomposition agents generate candidate decompositions and validate them:

**Fast decomposition** (pattern matching): Milliseconds per candidate  
**Feasibility checking** (heuristics): Seconds per candidate  
**Detailed planning** (search): Minutes per candidate  
**Execution validation** (sandbox): Minutes to hours per candidate

Allocate budget using AlphaGo's pattern:
1. **Generate many decompositions** using fast pattern matching
2. **Filter with feasibility checks** (analogous to λ weighting—combine fast and medium checks)
3. **Detailed planning for top candidates** (analogous to node expansion—only for most promising)
4. **Execute validation for final choices** (analogous to using strongest policy—too slow for search, only for final decision)

The mixing parameter λ_feas determines weight given to fast heuristics vs. medium feasibility models. Tune based on available computational budget and required accuracy.

### For Multi-Agent Coordination Budget

Multiple agents coordinating on a task share limited computational budget:

**Local decisions** (each agent decides independently): Fast but may be suboptimal  
**Pairwise coordination** (agents share information): Medium cost, better decisions  
**Global coordination** (all agents synchronize): Slow but optimal

Allocate budget using AlphaGo's principles:
1. **Most decisions use local reasoning** (cheap, analogous to tree traversal)
2. **Critical decisions trigger pairwise coordination** (medium cost, analogous to leaf evaluation)
3. **Only highest-stakes decisions use global coordination** (expensive, analogous to node expansion)

Threshold for coordination should adapt: if agents are waiting for coordination, increase threshold (make more local decisions); if coordination capacity is underutilized, decrease threshold (coordinate more).

## Critical Design Choices

### 1. Fixed vs. Adaptive Mixing

AlphaGo uses **fixed λ = 0.5** for all positions. An alternative would be **adaptive mixing**:
- If value network and rollouts agree, trust them (low uncertainty)
- If they disagree substantially, gather more rollout samples (high uncertainty)

The paper doesn't explore this. For agent systems, adaptive mixing might help:

**Code review example**: If fast and slow checks agree (both find no bugs or both find same bugs), trust them. If they disagree (fast check passes but slow check finds issues), run additional verification.

**Task decomposition example**: If fast feasibility heuristic and learned model agree, proceed. If they disagree, run more expensive validation.

The tradeoff: **adaptive mixing is more sophisticated but adds complexity**. AlphaGo's fixed mixing is simpler and works well—don't add adaptivity unless it provides substantial benefit.

### 2. Threshold Selection

AlphaGo uses nthr = 40 for node expansion, "adjusted dynamically" to match GPU throughput. The specific value 40 is tuned empirically.

For agent systems, threshold selection depends on:
- **Ratio of cheap to expensive evaluations**: If expensive evaluation is 1000× slower, use high threshold (expand rarely)
- **Value of improved evaluation**: If expensive evaluation substantially improves accuracy, use low threshold (expand frequently)
- **Available computational budget**: Adjust threshold based on queue depths and resource utilization

The principle: **monitor system performance and adjust thresholds to maximize throughput without saturating queues**.

### 3. Mini-Batch Size

AlphaGo uses "mini-batch size of 1 to minimize end-to-end evaluation time." This prioritizes latency over throughput—each evaluation completes quickly even though GPU is underutilized.

For agent systems with less time pressure:

**Larger mini-batches** (16, 32, 64):
- Higher GPU utilization → more evaluations per second
- Higher latency per evaluation → slower individual results
- Good for batch processing of many items

**Smaller mini-batches** (1, 2, 4):
- Lower GPU utilization → fewer evaluations per second
- Lower latency per evaluation → faster individual results
- Good for interactive systems needing quick responses

The choice depends on workload: batch processing benefits from large mini-batches; interactive systems need small mini-batches.

### 4. Placeholder Values

When node is first expanded, AlphaGo uses tree policy pτ to provide placeholder priors before policy network evaluation completes. This allows search to continue without waiting.

For agent systems: **use fast approximations as placeholders for slow evaluations**:

**Code review**: Use simple heuristics (cyclomatic complexity > 20 → likely problematic) as placeholder scores until neural bug detector completes

**Task decomposition**: Use pattern matching (standard architectural patterns → feasible) as placeholder estimates until learned model evaluates

**Architecture review**: Use basic metrics (coupling, cohesion) as placeholder quality scores until detailed simulation completes

The key: **placeholders must be fast enough to avoid blocking, accurate enough to provide reasonable initial guidance**.

## Boundary Conditions and Failure Modes

### When Fixed Allocation Fails

**1. Varying position complexity**: Some positions are tactical (rollouts better); others are strategic (value network better). Fixed λ = 0.5 can't adapt.

**2. Varying computational budget**: In time pressure, you want more fast evaluations and fewer slow ones. Fixed allocation can't shift budget dynamically.

**3. Heterogeneous resources**: If GPU suddenly becomes unavailable, fixed allocation that depends on value network will fail. Need fallback to pure rollouts.

### When Thresholds Are Wrong

**Too high threshold** (nthr = 1000):
- Nodes expand too rarely
- Search uses poor placeholder priors
- Wastes potential GPU budget

**Too low threshold** (nthr = 1):
- Nodes expand too frequently
- GPU saturated with policy network evaluations
- Not enough budget for value network evaluations

The solution: **dynamic threshold adjustment based on queue monitoring**. AlphaGo implements this but doesn't detail the specific algorithm.

### When Mixing Hurts

**Correlated errors**: If value network and rollouts make identical mistakes, mixing provides no benefit. Need diverse evaluation methods with complementary failure modes.

**Miscalibrated weights**: If one evaluator is much better (say MSE 0.10) and the other much worse (MSE 0.40), equal weighting dilutes the good evaluator. Need weight proportional to relative accuracy.

AlphaGo avoids this because value network (MSE 0.23) and rollouts (MSE 0.30) have similar accuracy—neither dominates. Equal weighting is reasonable.

## What Makes This Approach Irreplaceable

Many papers discuss speed-accuracy tradeoffs. What makes AlphaGo distinctive?

**1. Quantitative characterization**: Figure 2b shows MSE for each evaluation method across game stage. This provides precise measurement of accuracy tradeoffs.

**2. Empirical validation**: Figure 4b shows that mixed evaluation outperforms either component by huge margins (≥95% win rate). This proves mixing is essential, not optional.

**3. Scale demonstration**: The system works at 40 threads, 8 GPUs, evaluating thousands of positions per second. This proves the allocation strategy scales to production use.

**4. Multiple evaluation types**: AlphaGo combines four different evaluation methods (tree policy, fast rollouts, value network, policy network) with different speed-accuracy tradeoffs. Most systems use only two.

For agent systems, the lesson is clear: **design a portfolio of evaluation methods with different speed-accuracy tradeoffs; allocate computational budget to maximize total accuracy per unit time; adapt allocation based on available resources and position characteristics**.

The profound insight: **optimal evaluation doesn't mean using the most accurate method always—it means allocating limited computational budget across multiple imperfect evaluators to maximize total system performance**.
```

### FILE: coordinating-without-central-understanding.md

```markdown
# Coordinating Without Central Understanding: Decentralized Intelligence in Search Systems

## The Coordination Challenge

AlphaGo's distributed version runs 40 search threads on 1,202 CPUs and 176 GPUs. These components must coordinate to build a shared search tree, but they operate asynchronously without global synchronization.

This creates a fundamental challenge: **how do independent computational units coordinate toward a shared goal without a central controller that understands everything?**

Traditional approaches to parallel computation rely on:
- **Locks** to prevent concurrent modifications
- **Barriers** to synchronize threads at specific points
- **Master-worker** with central scheduler knowing all work

AlphaGo uses none of these. Instead, it employs **decentralized coordination mechanisms** where each component makes local decisions using partial information, and intelligent global behavior emerges from their interaction.

## The Lock-Free Architecture

### The Traditional Parallel Search Problem

In parallel MCTS, multiple threads share a search tree. Each thread must:
1. Read node statistics (N, W, Q values)
2. Compute which child to select
3. Traverse to child
4. Eventually update statistics based on simulation results

With traditional locking:
```
lock(node)
  read statistics
  compute best child
  traverse
unlock(node)
... simulation ...
lock(node)
  update statistics
unlock(node)
```

This serializes access to each node—only one thread can touch it at a time. With 40 threads, contention becomes severe. Threads spend time waiting for locks rather than doing useful work.

### AlphaGo's Lock-Free Solution

AlphaGo updates statistics using **lock-free atomic operations**:

```
// Read (no lock needed - eventual consistency OK)
N = atomic_read(node.N)
W = atomic_read(node.W)
Q = W / N

// Update (atomic increment - no lock needed)
atomic_increment(node.N, 1)
atomic_increment(node.W, value)
```

Atomic operations guarantee that increments don't corrupt data even if multiple threads update simultaneously. The CPU hardware ensures atomicity—no software locks needed.

**Key insight**: We don't need strict consistency. It's acceptable if a thread reads slightly stale values (another thread's update hasn't finished). Statistical noise in Monte Carlo evaluation dwarfs the error from stale reads.

This is **eventual consistency**: all updates eventually become visible to all threads, but there's no guarantee of immediate visibility.

### The Benefit: Linear Scaling

Lock-free updates enable near-linear scaling. Extended Data Table 8 shows:

**Threads on 48 CPUs, 8 GPUs:**
- 1 thread: 2,203 Elo
- 2 threads: 2,393 Elo (+190)
- 4 threads: 2,564 Elo (+171)
- 8 threads: 2,665 Elo (+101)
- 16 threads: 2,778 Elo (+113)
- 32 threads: 2,867 Elo (+89)
- 40 threads: 2,890 Elo (+23)

Going from 1 to 40 threads gains 687 Elo—massive improvement. The scaling isn't perfectly linear (diminishing returns at high thread counts), but it's much better than would be achieved with locks.

With locks, threads would contend for shared nodes, spending time waiting. Without locks, all 40 threads do useful work simultaneously.

## Virtual Loss: Coordination Without Communication

### The Redundant Exploration Problem

Without coordination, parallel threads might redundantly explore the same path:
- Thread A sees that action a1 has high Q + u value
- Thread B, running simultaneously, also sees that a1 has high value
- Both threads select a1 and traverse identical paths
- Computation is wasted—they should explore different paths

The traditional solution: locks or explicit communication. Thread A locks the node, preventing Thread B from selecting the same action.

### AlphaGo's Virtual Loss Solution

AlphaGo uses **virtual loss** instead:

When thread selects action a and traverses to child node, it immediately updates statistics as if the simulation has lost:
```
N(s,a) += nvl  // Add virtual visit count
W(s,a) -= nvl  // Subtract virtual wins (assume loss)
```

This makes the path temporarily look worse, discouraging other threads from selecting it. When the simulation completes and backup occurs, remove virtual loss and add real result:
```
N(s,a) = N(s,a) - nvl + 1    // Remove virtual, add real
W(s,a) = W(s,a) + nvl + z    // Remove virtual loss, add real outcome
```

**Key properties**:

1. **No communication**: Thread doesn't need to tell other threads what it's doing. The updated statistics in the tree implicitly signal "this path is being explored."

2. **Self-correcting**: If the thread takes longer than expected, the virtual loss remains, continuing to discourage others. When it completes, the correct values are restored.

3. **Temporary**: Virtual loss is local to one simulation. It doesn't permanently bias the tree—once simulation completes, true values are restored.

4. **Tunable**: The magnitude nvl = 3 balances between:
   - Too small (< 2): Insufficient discouragement, threads still collide
   - Too large (> 10): Over-discouragement, threads avoid promising paths even when parallelization would help

The paper uses nvl = 3, "losing 3 games" temporarily. This provides moderate discouragement without completely blocking paths.

## Asynchronous Evaluation: Coordination Through Queues

### The GPU Evaluation Problem

Neural network evaluation (policy and value networks) requires GPUs and takes ~3ms. Search threads run on CPUs and make decisions every microseconds. 

Synchronous approach would be disastrous:
```
// Thread decides to evaluate position
queue_position(s)
result = wait_for_gpu_evaluation(s)  // Blocks for 3ms
use_result(result)
continue_search()
```

With 40 search threads all waiting for GPU results, throughput would collapse. The GPU would be utilized, but CPUs would be idle most of the time.

### AlphaGo's Asynchronous Queue Solution

```
// Thread evaluates position
queue_position(s)
// IMMEDIATELY CONTINUE - don't wait
continue_search()

// Later, asynchronously:
// GPU thread pulls from queue
result = evaluate_on_gpu(s)
// GPU thread updates tree
backup_result(s, result)
```

Search threads never wait for GPU evaluation. They queue positions and immediately continue searching. GPU threads pull from queues, evaluate, and update the tree asynchronously.

**Coordination mechanism**: The queue itself provides coordination:
- **Producer-consumer pattern**: Search threads produce work (positions to evaluate); GPU threads consume work (evaluate positions)
- **Load balancing**: If multiple GPUs available, all pull from same queue—work naturally distributes to idle GPUs
- **Backpressure**: If queue grows too large, the system "dynamically adjusts the expansion threshold nthr" to generate less work

### The Placeholder Prior Strategy

When node is first expanded, it needs prior probabilities P(s,a) for action selection. But policy network evaluation hasn't completed yet—position is queued but result not available.

Solution: **use fast placeholder priors immediately, replace with accurate priors when available**:

```
// Node expansion (CPU thread)
initialize_priors_with_tree_policy()  // Fast, uses pτ
queue_for_policy_network()            // Slow, uses pσ

// Later (GPU thread)
accurate_priors = evaluate_policy_network()
atomic_update(priors, accurate_priors)
```

This allows search to continue without waiting. Initial simulations use placeholder priors (tree policy pτ). When policy network evaluation compl