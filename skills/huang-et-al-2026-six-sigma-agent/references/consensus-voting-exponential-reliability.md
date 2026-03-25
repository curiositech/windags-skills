# Consensus Voting: Achieving Exponential Reliability Through Redundancy

## The Core Mathematical Insight

The Six Sigma Agent's breakthrough result is deceptively simple: **when you sample n independent outputs with error rate p and take the majority, system error drops to O(p^⌈n/2⌉)**. This exponential improvement in the error exponent—not just the base—enables cheap models to achieve dramatically better reliability than expensive models through principled redundancy.

**Theorem 1 (Sampling Error Bound)**: Consider n independent samples from a micro-agent with individual error rate p < 0.5. When the Voting Judge selects based on majority pattern, the system error rate is bounded by:

**P_sys(n,p) = Σ(k=⌈n/2⌉ to n) C(n,k) · p^k · (1-p)^(n-k)**

This is the binomial probability that at least ⌈n/2⌉ of n samples are incorrect.

## Why This Works: The Independence Assumption

The proof relies critically on **Assumption 1 (Independence)**: Errors across independent model invocations with distinct random seeds are statistically independent:

**P[Mᵢ errs ∧ Mⱼ errs] = P[Mᵢ errs] · P[Mⱼ errs] = p²**

The paper justifies this: "This assumption is justified by using different random seeds and sampling temperatures across invocations. Wang et al. (2023) provide empirical evidence that diverse sampling produces effectively independent outputs for reasoning tasks."

The key mechanism: **temperature T = 0.7** balances output diversity with quality:
- Too low (T < 0.3): Outputs converge, reducing the benefit of sampling
- Too high (T > 1.0): Outputs become erratic, increasing error rates  
- Optimal (T ≈ 0.7): Sufficient diversity for independent "votes" while maintaining coherence

## The Counterintuitive Result

The paper demonstrates a striking numerical example:

**Single agent (GPT-4o)**: p = 0.01 (1% error)
**Five cheap agents (GPT-4o-mini)**: p = 0.05 each (5% error)

For n=5 agents with p=0.05, system error is:

P_sys = C(5,3)·(0.05)³·(0.95)² + C(5,4)·(0.05)⁴·(0.95) + C(5,5)·(0.05)⁵
     = 10·(0.000125)·(0.9025) + 5·(0.00000625)·(0.95) + 0.0000003
     ≈ **0.00116 = 0.116%**

**Key insight**: Five agents with 5% individual error achieve **0.116% system error**—better than the single agent with 1% error.

The paper emphasizes: "This counterintuitive result (worse components, better system) is the core principle enabling cost-effective reliability."

## Scaling to Six Sigma

To achieve Six Sigma reliability (P_sys ≤ 3.4 × 10⁻⁶), the paper provides the minimum required agent counts:

**Theorem 3 (Six Sigma Requirement)**: 
- p = 0.01 (1% error) → n* = 9 agents
- p = 0.02 (2% error) → n* = 11 agents
- p = 0.05 (5% error) → n* = 13 agents
- p = 0.10 (10% error) → n* = 21 agents

Even with 10% individual error (mediocre performance), 21 agents achieve Six Sigma reliability.

## Dynamic Scaling: Adaptive Reliability

The architecture doesn't always use maximum agent count. Instead, it employs **dynamic scaling**:

1. **Start with n=5** (default): 4:1 majority is usually decisive
2. **Detect uncertainty**: If confidence < θ (default 0.6), e.g., 3:2 split
3. **Scale up**: Add Δn=4 more agents, re-evaluate with all samples
4. **Repeat until confident** or reach n_max (typically 13)

Algorithm 2 (Voting Judge with Dynamic Scaling) formalizes this:

```
while |Y| ≤ n_max:
    V ← EMBED(Y)                    # Embed all outputs
    C ← CLUSTER(V, τ)               # Cluster by similarity
    C_winner ← argmax |C|           # Find majority cluster
    conf ← |C_winner| / |Y|         # Compute confidence
    
    if conf ≥ θ:
        return SELECT_BEST(C_winner) # Best from majority
    else:
        Y ← Y ∪ SAMPLE(Δn)          # Add more samples
```

The paper reports: "At confidence threshold θ = 0.6, approximately 11% of actions triggered dynamic scaling across our three use cases."

**Cost-effectiveness**: Starting with n=5 and scaling only when needed is more efficient than always using n=13. The paper found: "Dynamic scaling contributed modest additional cost (approximately 18% over baseline n=5) while reducing DPMO from 1,100 to 3.4, a **324× improvement**."

## Embedding-Based Clustering: Handling Surface Variation

A critical practical challenge: equivalent answers may have different surface forms. The paper solves this through **embedding-based semantic clustering**:

**Step 1 - Embed**: Each output yᵢ → vector vᵢ = Embed(yᵢ)

**Step 2 - Cluster**: Group by cosine similarity
```
sim(yᵢ, yⱼ) = (vᵢ · vⱼ) / (‖vᵢ‖ · ‖vⱼ‖)
```

Outputs with sim(yᵢ, yⱼ) ≥ τ (default 0.85) are merged into the same cluster.

**Step 3 - Vote**: Count votes per cluster, not per output

**Step 4 - Select**: LLM evaluates candidates in the majority cluster and selects the most correct and complete answer

This approach "is fast and deterministic: embedding and clustering require no LLM calls, only the final selection step uses an LLM. **Correctness is determined by voting on clusters**, preserving theoretical guarantees."

Example from Figure 4:
- Output 1: "$5M"
- Output 2: "$5,000,000"  
- Output 3: "5 million dollars"
- Output 4: "$5M"
- Output 5: "$3M" (error)

After clustering: {$5M variants} = 4 votes, {$3M} = 1 vote
The system correctly identifies the $5M cluster as the majority, even though exact strings differ.

## Multi-Model Heterogeneous Execution

The paper distinguishes two execution modes:

**Homogeneous**: All n samples from the same model (e.g., GPT-4o-mini) with temperature variation

**Heterogeneous**: Each sample executed by a different model:
- Sample 1: GPT-4o-mini
- Sample 2: Claude Haiku
- Sample 3: Gemini Flash
- Sample 4: Llama 3
- Sample 5: Mixtral

"Heterogeneous execution reduces error correlation ρ from ~0.4 (same model) to ~0.08 (different model families), substantially improving the effectiveness of consensus voting."

The rationale: "Different model families have different failure modes, making correlated errors unlikely."

## Handling Error Correlation

The independence assumption (errors are i.i.d.) may be violated when agents share systematic biases. The paper analyzes this rigorously:

**Definition 7 (Error Correlation)**:
```
ρᵢⱼ = (P[Xᵢ=1, Xⱼ=1] - p²) / (p(1-p))
```

**Theorem 4 (Correlated Error Bound)**: For n agents with pairwise error correlation ρ ∈ [0,1]:

**P^corr_sys(n,p,ρ) ≤ (1-ρ)·P^ind_sys(n,p) + ρ·p**

The proof decomposes into correlated (probability ρ) and independent (probability 1-ρ) regimes.

**Corollary 5 (Correlation Tolerance)**: For Six Sigma reliability, maximum tolerable correlation is:

**ρ_max = (p - 3.4×10⁻⁶) / (p - P^ind_sys)**

For n=11, p=0.05: **ρ_max ≈ 0.99**, demonstrating robustness to moderate correlation.

The paper emphasizes: "The system tolerates error correlation ρ ≤ 0.99 for Six Sigma reliability with n=11 agents."

Mitigation strategies:
1. **Model diversity**: Use agents from different model families
2. **Temperature variation**: Use different temperatures across agents
3. **Prompt diversity**: Vary system prompts while preserving task semantics

## Latency Overhead: Parallel Execution

A critical practical concern: doesn't n-way redundancy increase latency n-fold?

**No.** The paper proves parallel execution minimizes overhead:

**Latency = max_j∈[n] latency(yⱼ) + ε_overhead**

where ε_overhead < 100ms for embedding/clustering.

"With n=5 parallel samples, latency increases by approximately **47%** compared to single execution (due to tail latency of slowest sample), while reliability improves by orders of magnitude."

This is because:
1. All n samples execute **simultaneously** (not sequentially)
2. Latency is determined by the **slowest** sample (tail latency)
3. Embedding/clustering is fast (vector operations, no LLM calls)
4. Only the final selection step requires an LLM call

## Cost Analysis: The Economic Advantage

The paper demonstrates that consensus voting with cheap models is more cost-effective than single expensive models:

**Single GPT-4o**: 1× expensive model, 10,000 DPMO
**Five GPT-4o-mini**: 5× cheap model = same total cost, 1,100 DPMO (9× better)
**Dynamic scaling (5→13)**: 1.18× baseline cost, 3.4 DPMO (3,000× better)

"Evaluation across three enterprise use cases demonstrates a **14,700× reliability improvement** over single-agent execution while **reducing costs by 80%**."

The economic logic: GPT-4o-mini is ~20× cheaper than GPT-4o. Even with 13× redundancy, total cost is less than a single GPT-4o call, while reliability is 3,000× better.

## Application to WinDAGs Orchestration

For a DAG-based orchestration system with 180+ skills, consensus voting should be applied at **atomic action boundaries**:

**Skill Orchestration Layer**: Route high-level intents to appropriate skills (single execution, no voting needed here)

**Within-Skill Execution Layer**: Each skill decomposes into atomic actions, each with consensus voting

**Example - "debug_production_issue" skill**:
1. Parse error logs → 5 agents, consensus on structured error data
2. Identify root cause category → 5 agents, consensus on classification
3. Search knowledge base → 5 agents, consensus on relevant docs
4. Generate fix proposal → 5 agents, consensus on solution approach
5. Validate fix safety → 5 agents, consensus on risk assessment

Each step benefits from exponential reliability improvement, and steps compose multiplicatively.

## The Selection Prompt: Quality Within Consensus

The final step—selecting the best answer from the majority cluster—uses an LLM with a structured prompt:

```
Task: {task_description}

The following outputs are semantically similar candidates:
[Output 1]: {y_i}
[Output 2]: {y_j}

Evaluate each output and select the BEST one based on:
- Correctness: Is the answer accurate and factually correct?
- Completeness: Does it fully address the task requirements?
- Reasoning: Is the logic sound and well-justified?
- Task Alignment: Does it directly answer what was asked?
```

This ensures that consensus identifies the **correct answer category**, while selection identifies the **best formulation** within that category.

## Boundary Conditions

The paper is explicit about when consensus voting doesn't work:

**Assumption 2 (Bounded Error)**: For well-formed atomic actions within the model's capability, **p < 0.5** (better than random guessing).

"If violated for a specific action, that action should be further decomposed or assigned to a more capable model."

**Assumption 3 (Error Diversity)**: When multiple agents err, they don't systematically converge on the same incorrect answer.

"This ensures errors 'cancel out' through voting rather than reinforcing each other."

**Failure modes**:
- **Systematic biases**: All agents share training data artifacts
- **Ambiguous tasks**: No objectively correct answer
- **Out-of-distribution**: Task outside all models' capabilities

Mitigation: "Hybrid neural-symbolic verification" for systematic errors, "preference-based consensus" for subjective tasks.

## The Deep Lesson: Reliability from Redundancy

The consensus voting mechanism embodies a profound principle from distributed systems theory: **reliability emerges from assuming failure and architecting redundancy, not from perfecting individual components**.

As the paper states: "The hallmark of a high-reliability organization is not that it is error-free, but that **errors don't disable it**." (Weick & Sutcliffe, 2007)

For agent system builders, the lesson is clear: **Stop trying to make individual agents perfect. Start architecting systems where imperfect agents vote, and perfection emerges from the collective.**