# Information-Theoretic Action Selection Under Uncertainty: When to Explore vs. Exploit

## The Core Dilemma: Acting Without Complete Information

Intelligent systems perpetually face a fundamental tension: **you never have complete information, but you must act anyway**. Waiting to gather all relevant data is often impossible (infinite search space), expensive (time/resource constraints), or dangerous (environment changes while you deliberate).

The challenge is deciding: *Which actions should I take to gather information (exploration), and when should I commit to the task-critical action based on current beliefs (exploitation)?*

Sen et al.'s Algorithm 1 (TASKGOAL procedure) provides a principled answer grounded in information theory. The key insight: **use mutual information to quantify the expected value of exploratory actions, execute exploration until task-relevant uncertainty falls below a threshold, then commit to exploitation.**

## Algorithm 1 Walkthrough: Structure and Logic

```
Input: 
  a_g = goal action (e.g., REACHGRASP)
  ε = uncertainty threshold
  E = initial evidence (priors, any observations)

Repeat until goal succeeds:
  1. Compute posterior over goal region: Pr(f_g | evidence, p_g)
  2. Compute entropy: H_g = H(f_g | evidence, p_g)
  
  3. If H_g < ε:
       Execute goal action with parameters sampled from posterior
       Update evidence with result
       
  4. Else (too uncertain to commit):
       For all exploratory actions not yet tried:
         Compute mutual information I_a = I((f_g|evidence); (f_i|evidence))
       Select a_next = argmax I_a
       Execute a_next
       Observe result f_next
       Update evidence with observed feature and controller state
```

The algorithm has three critical components:

**Uncertainty quantification**: Entropy H(f_g | evidence) measures how uncertain the posterior distribution is. High entropy = many plausible configurations, low confidence in any specific value. Low entropy = posterior is peaked around a specific configuration, high confidence.

**Exploration criterion**: Mutual information I(f_g ; f_i) measures how much observing affordance i is expected to reduce uncertainty about the goal affordance g. This is not about general knowledge—it's specifically task-directed.

**Exploitation threshold**: ε is the acceptable uncertainty level for executing the goal action. Too small = over-cautious, explores when already sufficient information. Too large = reckless, executes with insufficient information.

## Why Entropy as the Uncertainty Measure?

Entropy H(X) = -Σ p(x) log p(x) for discrete distributions, or -∫ p(x) log p(x) dx for continuous, captures "spread" of a distribution:

**Low entropy examples**:
- Unimodal Gaussian with small variance: nearly certain about value
- Uniform distribution over tiny region: uncertain within region, but region is small
- Dirac delta: H = 0, perfect certainty

**High entropy examples**:
- Uniform distribution over large region: every value equally plausible, no information
- Multimodal distribution: multiple incompatible hypotheses, unresolved ambiguity  
- Heavy-tailed distribution: outliers are plausible, high uncertainty about tail behavior

For the grasp posterior in Figure 5d (rotational symmetry around knob), entropy is high because:
- Multiple orientations equally plausible (symmetric feature)
- Wide spatial spread (uncertain which of several symmetric grasp points)
- Multimodal (different objects in model predict different configurations)

After observing green base (Figure 6), entropy drops because:
- Eliminates some objects (those without green base)
- Breaks some symmetries (green base is asymmetric, provides orientation cue)  
- Tightens spatial distribution (relative positions of green base and grasp points constrain each other)

**Alternative uncertainty measures**:
- Variance: Only captures spread, not multimodality. A bimodal distribution with tight peaks has low variance per mode but high uncertainty overall.
- Maximum probability: Ignores tail uncertainty. You might be 60% confident in one hypothesis but 40% spread across many alternatives—max probability = 0.6 suggests moderate confidence, but true uncertainty is higher.
- Ensemble disagreement: For model ensembles, variance across predictions. Doesn't apply to single Bayesian model.

Entropy correctly captures both spread and multimodality, making it the right choice for quantifying "how uncertain is this distribution?"

## Mutual Information: Quantifying Information Gain

Definition: I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X,Y)

Interpretation: Reduction in uncertainty about X from observing Y (symmetric: also reduction in uncertainty about Y from observing X).

**For action selection**: I(f_goal ; f_exploratory | evidence)

This is saying: "If I execute the exploratory action and observe where the feature is (or that it's not present), how much does that reduce my uncertainty about where the goal affordance is?"

**Computing in practice**:

```
I(f_g ; f_i | evidence) = H(f_g | evidence) - E_{f_i ~ Pr(f_i|evidence)}[H(f_g | evidence, f_i)]
```

The expectation is over possible observations: we don't yet know what f_i we'll observe, so we must average over all possibilities weighted by their probability.

**Example calculation** (simplified):

Suppose:
- Current entropy of grasp location: H(f_grasp | evidence) = 3.2 bits
- If we observe green base at location A (prob 0.4): H(f_grasp | evidence, green@A) = 1.8 bits
- If we observe green base at location B (prob 0.3): H(f_grasp | evidence, green@B) = 2.1 bits  
- If we observe green base at location C (prob 0.2): H(f_grasp | evidence, green@C) = 2.5 bits
- If green base not found (prob 0.1): H(f_grasp | evidence, no_green) = 3.0 bits

Expected entropy after exploring green base:
E[H | green] = 0.4×1.8 + 0.3×2.1 + 0.2×2.5 + 0.1×3.0 = 2.05 bits

Mutual information:
I(f_grasp ; f_green | evidence) = 3.2 - 2.05 = 1.15 bits

Similarly compute for yellow knob, black antenna, bounding box. Whichever has highest mutual information (largest expected reduction) is chosen.

## Why Mutual Information > Other Heuristics

**Alternative 1: Maximize observation likelihood**  
Choose action most likely to succeed (highest Pr(p_i=1 | evidence)).  
*Problem*: Observing a highly likely but uninformative feature doesn't help. If you're already certain an affordance exists, confirming it adds no information.

**Alternative 2: Minimize execution cost**  
Choose cheapest action (fastest, least resource-intensive).  
*Problem*: Cheap but uninformative actions waste time. Better to execute one expensive informative action than ten cheap useless ones.

**Alternative 3: Maximize model uncertainty**  
Choose action with highest H(f_i | evidence) (most uncertain feature).  
*Problem*: That feature might be irrelevant to the goal. Disambiguating an uncertain but task-irrelevant feature doesn't help accomplish the task.

**Alternative 4: Greedy goal uncertainty**  
Choose action that maximally reduces H(f_goal) if observation matches model expectation.  
*Problem*: Doesn't account for probability of different observations. Might choose an action that dramatically reduces uncertainty *if* you observe X, but X is very unlikely, and likely observations provide little information.

**Mutual information**:  
- Accounts for both informativeness (how much does observation reduce goal uncertainty) AND likelihood (weight by probability of each possible observation)
- Specifically targets task-relevant uncertainty (f_goal), not general knowledge
- Robust to irrelevant features (if f_i is independent of f_goal, I(f_goal ; f_i) ≈ 0)

## The Threshold ε: Balancing Caution and Decisiveness

The uncertainty threshold ε determines when to stop exploring and commit to the goal action.

**Setting ε too low** (overly cautious):
- Continues exploring even when sufficient information available  
- Wastes time/resources on marginal information gain
- Risks environment changing while deliberating (object moved, state invalidated)
- Example: ε = 0.01 bits might require observing every affordance to near-certainty before grasping

**Setting ε too high** (reckless):
- Attempts goal action with insufficient information  
- High failure rate, requires retries (which might not be possible if action is destructive)
- Example: ε = 5 bits might attempt grasping when posterior is still multimodal and broad

**Adaptive threshold** (task-dependent):
- Low stakes task (picking up a toy): higher ε acceptable, failures are cheap
- High stakes task (grasping a fragile antique): lower ε required, failure is costly  
- Time-critical task: start with higher ε, reduce over time if failures occur
- Irreversible actions: very low ε (gather extensive information before committing)

**Empirical tuning**: The paper doesn't specify ε value, but the radio example shows:
- After 1 exploration action: H still high, continue exploring  
- After 2 exploration actions: H < ε, proceed to grasp
This suggests ε is set such that 1-3 exploratory actions are typically sufficient, balancing efficiency and reliability.

## Handling Action Failure: The Retry Loop

Algorithm 1's outer loop continues "until p(a_g) = 1" (goal action succeeds). This handles:

**Failure mode 1: Model mismatch**  
Goal action executed with sampled parameters, but those parameters were incorrect (model wrong or observations noisy).  
*Response*: Goal action fails (p(a_g) remains 0 or transitions to −). Algorithm continues, updates evidence with failure observation, explores further to resolve model mismatch.

**Failure mode 2: Environmental change**  
Object moved/changed between exploration and exploitation.  
*Response*: Goal action fails. Re-exploration with updated evidence should detect the change (previously-tracked features no longer where expected).

**Failure mode 3: Execution noise**  
Goal action was correctly parameterized but failed due to control noise, sensor error, external disturbance.  
*Response*: Retry with same or slightly perturbed parameters. If repeated failures, increase evidence uncertainty (reduce confidence in previous observations) and re-explore.

The algorithm doesn't explicitly distinguish these failure modes—it simply continues the explore-exploit loop until success. This is robust but potentially inefficient (might re-explore when a simple retry would suffice).

**Extension**: Add failure mode diagnosis. If goal action fails but observations still match model (p(exploratory) = 1 for previously-tracked affordances), likely execution noise → retry. If observations no longer match model (p(exploratory) ≠ 1), likely environmental change or model mismatch → re-explore.

## Computational Complexity and Practical Approximations

**Full Bayesian inference**:
- Compute posteriors: Pr(f_g | evidence) requires marginalizing over all objects and affordance configurations
- Compute mutual information: requires integrating over all possible observations
- For continuous state spaces and complex models, this is intractable in closed form

**Approximations used in practice**:

1. **Particle filtering**: Represent posteriors as weighted particle sets {(f^(i), w^(i))}. Entropy estimated from particle distribution. Mutual information approximated by reweighting particles for each hypothetical observation.

2. **Gaussian approximations**: Assume posteriors are Gaussian, track mean and covariance. Entropy of multivariate Gaussian: H = 0.5 log((2πe)^k |Σ|). Mutual information computed analytically for Gaussian conditionals.

3. **Sampling-based approximation**: 
   - Sample N possible observations from Pr(f_i | evidence)  
   - For each sample, compute H(f_g | evidence, f_i = sample)
   - Average: E[H | f_i] ≈ (1/N) Σ_n H(f_g | evidence, f_i = sample_n)
   - Mutual information: H(f_g | evidence) - E[H | f_i]

4. **Greedy action selection without full expectation**: Assume observation will match model expectation (highest probability outcome), compute information gain for that case only. Faster but less robust to surprises.

The paper doesn't specify which approximation they use, but given the complexity of the radio model (multivariate Gaussians over spatial features, multinomial over controller states), likely Gaussian approximations or particle filtering.

## Implications for Multi-Agent Coordination

**Distributed exploration**: Multiple agents can explore different affordances in parallel:
- Agent A executes action i, observes f_i  
- Agent B executes action j, observes f_j
- Both update shared Bayesian model with their observations  
- Information gain is additive: I(f_g ; f_i, f_j) = I(f_g ; f_i) + I(f_g ; f_j | f_i) (chain rule)

**Challenge**: Coordinating which agent explores what to avoid redundancy.

**Solution**: Shared information state. Before acting:
1. Each agent computes I(f_g ; f_i | current_shared_evidence)  
2. Agents communicate their intended actions
3. Orchestrator assigns actions to maximize total information gain without duplication

**Asynchronous operation**: If communication is expensive/delayed:
- Each agent optimistically assumes others are gathering information on other affordances
- Execute local I-maximizing action
- Periodically sync evidence with other agents, recompute mutual information, adjust plans

**Specialization**: Some agents might be better suited for certain exploratory actions:
- Vision specialist: fast at visual SEARCHTRACK, prioritize visual affordances  
- Manipulation specialist: better at tactile/force exploration, handle those affordances
- Allocate actions based on both information gain AND agent capability

## Connection to Active Learning and Optimal Experimental Design

Algorithm 1 is a form of **optimal experimental design**: each exploratory action is an "experiment" that produces data (observations), and we choose experiments to maximize information gain about parameters of interest (goal affordance location).

**Classical experimental design** (Fisher, Box): choose experimental conditions to maximize Fisher information, minimize parameter variance, or maximize mutual information between parameters and observations.

**Active learning** in machine learning: choose which data points to label to maximally improve model accuracy, often using uncertainty sampling or query-by-committee.

**Sen et al.'s contribution**: Apply these ideas to embodied action selection. The "experiments" are sensorimotor interactions (execute SEARCHTRACK schemas), "observations" are controller convergence and feature locations, "parameters" are affordance distributions in the world model.

The framework naturally handles:
- **Multi-modal posteriors**: Entropy accounts for multiple hypotheses, mutual information helps disambiguate  
- **Structured dependencies**: Bayesian network captures spatial relationships between affordances
- **Action costs**: Could extend to penalize expensive exploratory actions (trade-off information gain vs. execution cost)

## Boundary Conditions: When Does Information-Theoretic Selection Fail?

**Assumption 1: Model completeness**  
Algorithm assumes the Bayesian model contains the true object. If encountering a novel object not in the model, all actions will have near-zero mutual information (nothing in the model explains observations).  
*Mitigation*: Monitor total likelihood Pr(Z | all objects). If very low, signal novelty, initiate model learning rather than continuing Algorithm 1.

**Assumption 2: Independent observations**  
Mutual information computation assumes observing f_i provides information about f_g through the Bayesian network structure. If observations are corrupted by common-cause noise (e.g., camera calibration error affects all visual features), information gain is overestimated.  
*Mitigation*: Model common noise sources in the Bayesian network (shared latent variables for systematic errors).

**Assumption 3: Consistent environment**  
Algorithm assumes environment is static during exploration. If the object moves or changes, early observations become stale, mutual information calculations based on outdated evidence are incorrect.  
*Mitigation*: Time-decay evidence weights (older observations contribute less to posterior). Monitor for inconsistencies (new observations contradict old ones), trigger re-exploration if detected.

**Assumption 4: Accurate entropy estimation**  
For high-dimensional continuous spaces, estimating entropy is hard. Particle filters need many particles to capture multimodal distributions; Gaussian approximations fail for non-Gaussian posteriors.  
*Impact*: Might stop exploring too early (underestimate entropy) or too late (overestimate). Not catastrophic—Algorithm 1 includes retry loop—but inefficient.

**Assumption 5: Goal action is non-exploratory**  
Algorithm treats goal action as terminal (succeeds or fails, then reassess). If the goal action itself provides informative observations (e.g., attempting grasp reveals previously-unknown force profiles), should be incorporated into exploration loop.  
*Extension*: Allow goal action to be exploratory if expected information gain exceeds risk of failure.

## Design Pattern: Information-Gain-Driven Task Decomposition

For WinDAGs orchestrators:

**1. Identify task-critical parameters**: What must be known to execute the goal skill successfully?  
- Example: "deploy security patch" requires knowing current system version, patch compatibility, deployment window availability

**2. Model parameter uncertainty**: Represent knowledge as probability distributions, compute entropy.  
- Use historical data, Bayesian priors, or expert estimates

**3. Enumerate information-gathering skills**: What actions can reduce parameter uncertainty?  
- Query version API (fast, certain, but might be incorrect)
- Parse config files (slower, more reliable)  
- Test in staging environment (expensive, definitive)

**4. Compute mutual information**: For each information-gathering skill, estimate I(critical_params ; skill_observation).

**5. Build adaptive exploration subgraph**:
```
while H(critical_params) > threshold:
    skill_next = argmax_{skills not yet tried} I(critical_params ; skill_output)
    execute skill_next
    update beliefs with skill output
```

**6. Execute goal skill**: Once uncertainty acceptable, proceed with task-critical action using parameters sampled from posterior.

**7. Handle failure**: If goal skill fails, increase uncertainty (evidence was misleading), re-enter exploration loop.

This pattern makes information-gathering explicit in the orchestration graph, with formal criteria for sufficiency.

## Critical Insight: Uncertainty Quantification Enables Safe Autonomy

The profound contribution of Algorithm 1 is making uncertainty *first-class*:

Traditional systems:
- Execute actions based on "best estimate" of parameters  
- No representation of confidence or uncertainty
- Failures are surprising, no mechanism to anticipate them

Information-theoretic approach:
- Explicitly quantify "how certain am I?"  
- Recognize when uncertainty is too high for safe action
- Gather information specifically to reduce task-relevant uncertainty
- Proceed only when confidence exceeds threshold

For autonomous agent systems operating in high-stakes environments (production systems, safety-critical applications, real-world robotics), this is essential. **You can't make reliable decisions without knowing how reliable your information is.**

The framework provides:
- **Predictable behavior**: Agents don't randomly "try things and see"—they systematically reduce uncertainty  
- **Failure prevention**: By refusing to act when uncertain, prevent many failures
- **Introspection**: Agents can report "I need more information about X before I can proceed"
- **Justified decisions**: Information-theoretic criteria are auditable—why did the agent explore A before B? Because I(goal ; A) > I(goal ; B).

This bridges the gap between "knowing" (having a model) and "doing" (acting in the world): the bridge is quantified uncertainty and information-driven exploration.