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