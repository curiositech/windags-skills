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