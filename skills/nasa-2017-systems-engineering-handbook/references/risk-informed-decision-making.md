# Risk-Informed Decision Making: NASA's Framework for Choosing Under Uncertainty

## The Core Problem: Decisions Under Irreducible Uncertainty

Complex systems engineering involves thousands of decisions:
- Which architecture should we choose?
- Which technology is mature enough to use?
- Should we add redundancy or accept single-point failure?
- Do we have enough margin (mass, power, schedule, cost)?
- Should we waive this requirement or enforce it?

These decisions share common characteristics:
- **Multiple competing objectives** (performance vs. cost vs. schedule vs. risk)
- **Incomplete information** (future states are unknown)
- **Irreversible commitments** (some decisions are expensive to undo)
- **High stakes** (wrong choices lead to mission failure, loss of life, or program cancellation)

NASA's answer: **Risk-informed decision making (RIDM)**—a formal framework that makes risk an explicit input to decisions, not an afterthought.

## The NASA RIDM Framework (NASA/SP-2010-576)

### Core Principle
**Verbatim from handbook references**:
> "Risk-informed decision making integrates risk insights with other considerations (engineering judgment, stakeholder values, resource constraints) to support decisions."

**Critical nuance**: This is not "risk-based decision making" (where risk is the **only** factor). It's **risk-informed** (where risk is **one of several** factors, but explicitly modeled).

### The Five-Step RIDM Process

#### Step 1: Define the Decision Context
**Purpose**: Clarify what's being decided, why it matters, and what constraints apply.

**Questions to answer**:
- What's the decision to be made? (e.g., "Select propulsion system for Mars lander")
- Who are the stakeholders? (mission scientists, NASA HQ, taxpayers, international partners)
- What are the decision criteria? (performance, cost, schedule, risk, political feasibility)
- What constraints apply? (budget cap, launch date, technology readiness)

**Example: Mars Sample Return (MSR)**

Decision: "How many redundant sample caches should we deploy on Mars?"
- **Stakeholder values**: Scientists want maximum return (all samples); program managers want cost control; NASA HQ wants mission success (at least some samples)
- **Constraints**: Launch mass budget (only 3 cache canisters fit), mission lifetime (15 years on Mars), budget ($7B cap)

#### Step 2: Identify Alternatives
**Purpose**: Generate multiple candidate solutions before committing to analysis.

**NASA principle (from Section 4.4.1.2.1)**:
> "Before those decisions that are hard to undo are made, the alternatives should be carefully and iteratively assessed, particularly with respect both to the maturity of the required technology and to stakeholder expectations."

**Example: MSR Cache Strategy**

Alternative 1: Single cache (all samples in one location)
- **Pros**: Simple, low cost, high sample diversity
- **Cons**: Single point of failure (if cache fails, mission fails)

Alternative 2: Dual caches (split samples between two locations)
- **Pros**: Redundancy (if one cache fails, 50% samples still recovered)
- **Cons**: Higher cost, requires two landing sites

Alternative 3: Distributed caches (samples stored in 5 locations)
- **Pros**: Maximum redundancy, flexible retrieval
- **Cons**: Highest cost, highest operational complexity

#### Step 3: Assess Risks for Each Alternative
**Purpose**: Quantify the probability and consequence of failure for each option.

**Tools NASA uses**:
- **Probabilistic Risk Assessment (PRA)**: Formal fault tree / event tree analysis
- **Monte Carlo simulation**: Model uncertainty in parameters (e.g., landing accuracy, hardware reliability)
- **Expert elicitation**: When data is sparse, use structured expert judgment

**Example: PRA for MSR Cache Strategy**

For Alternative 1 (Single Cache):
```
P(mission success) = P(cache deployed successfully) 
                    × P(cache survives 15 years on Mars)
                    × P(retrieval mission finds cache)
                    × P(retrieval mission successfully lifts off)

Estimated values:
  P(deploy success) = 0.95
  P(15-year survival) = 0.85 (Martian dust storms, thermal cycles)
  P(retrieval finds) = 0.90 (landing accuracy ±100m)
  P(liftoff success) = 0.90

Total: 0.95 × 0.85 × 0.90 × 0.90 = 0.654 (65.4% mission success)
```

For Alternative 2 (Dual Caches):
```
P(mission success) = P(at least one cache retrievable)
                    = 1 - P(both caches fail)

P(both fail) = [1 - P(single cache success)]²
             = [1 - 0.654]² = 0.120

P(mission success) = 1 - 0.120 = 0.880 (88% success)
```

**Key insight**: Dual caches reduce risk significantly (65% → 88%) but at what cost?

#### Step 4: Evaluate Alternatives Against Decision Criteria
**Purpose**: Compare options across **multiple dimensions**, not just risk.

**Multi-Attribute Decision Analysis (MADA)**

NASA references **Saaty's Analytic Hierarchy Process (AHP)** and **Keeney & Raiffa's Multi-Objective Decision Theory**.

**Method**:
1. Define value dimensions (cost, schedule, performance, risk)
2. Assign weights to each dimension (based on stakeholder priorities)
3. Score each alternative on each dimension (0–100 scale)
4. Compute weighted total score

**Example: MSR Cache Strategy Scorecard**

| Alternative | Cost (30%) | Schedule (20%) | Science Return (25%) | Risk (25%) | **Weighted Score** |
|-------------|------------|----------------|----------------------|------------|-------------------|
| Single Cache | 90 (low) | 95 (fast) | 100 (all samples) | 40 (65% success) | **76.5** |
| Dual Caches | 60 (medium) | 70 (moderate) | 85 (some samples lost) | 85 (88% success) | **74.8** |
| 5 Caches | 20 (high) | 40 (slow) | 90 (high diversity) | 95 (99% success) | **59.3** |

**Interpretation**:
- Single cache has highest weighted score (76.5) because cost/schedule dominate
- **But** risk is very low (40/100), meaning 35% chance of total failure
- Dual caches score slightly lower (74.8) but risk is much better (85/100)

**Decision**: If stakeholders can accept 2% lower overall score for 23% higher success probability, choose Dual Caches.

#### Step 5: Make and Document the Decision
**Purpose**: Select an alternative and record the rationale for future review.

**Documentation requirements**:
- What was decided?
- What alternatives were considered?
- What criteria were used?
- How were alternatives scored?
- What assumptions were made?
- Who approved the decision?
- Under what conditions should the decision be revisited?

**Example: MSR Decision Record**

```
Decision: Deploy Dual Cache Strategy for Mars Sample Return
Date: 2024-03-15
Authority: MSR Program Manager, concurred by NASA HQ
Alternatives considered: Single Cache, Dual Caches, 5 Caches
Selection rationale:
  - Dual caches provide 88% mission success vs. 65% for single cache
  - Cost increase ($150M) justified by risk reduction (23% improvement)
  - Schedule impact (6 months) acceptable given mission lifetime (15 years)
  - Science return reduction (15% fewer samples) acceptable to stakeholders
Assumptions:
  - Cache survival probability 85% over 15 years (based on Viking, Pathfinder data)
  - Landing accuracy ±100m (based on Mars 2020 precision landing)
Conditions for re-evaluation:
  - If landing accuracy improves to ±10m (single cache becomes viable)
  - If cache survival testing shows <70% 15-year reliability (need more redundancy)
Approved by: [Signature]
```

## Advanced Decision Techniques: Trade Studies

**Trade studies** are formal, quantitative comparisons of design alternatives.

**From Section 6.8 (Decision Analysis)**:
> "The right quantitative methods and selection criteria should be used. Trade study assumptions, models, and results should be documented as part of the project archives."

### Trade Study Inputs
- **Design alternatives** (typically 3–7 options)
- **Figures of Merit (FOMs)** (metrics that quantify goodness: mass, power, cost, reliability, performance)
- **Sensitivity analysis** (how do results change if assumptions vary?)
- **Uncertainty quantification** (confidence intervals on FOMs)

### Example: Space Shuttle Main Engine (SSME) Turbopump Trade Study

**Decision**: Select turbopump design for SSME high-pressure fuel turbopump (HPFTP).

**Alternatives**:
- Design A: Single-stage turbine, high rotational speed (35,000 RPM)
- Design B: Two-stage turbine, moderate speed (25,000 RPM)
- Design C: Three-stage turbine, low speed (18,000 RPM)

**Figures of Merit**:
1. **Efficiency** (higher is better): A=88%, B=85%, C=82%
2. **Mass** (lower is better): A=120 kg, B=150 kg, C=180 kg
3. **Reliability** (higher is better): A=0.990, B=0.995, C=0.998
4. **Development cost** (lower is better): A=$50M, B=$75M, C=$100M

**Trade-off**: Design A has best performance and lowest mass/cost, but worst reliability. Design C has best reliability but worst performance/mass/cost.

**Sensitivity Analysis**:
- If mission requires 0.999 reliability (human-rated), only Design C is acceptable
- If cost budget is $60M cap, only Design A is viable
- If launch mass is constrained (need every kg for payload), Design A is preferred

**Decision**: NASA selected **Design B** (two-stage turbine) because:
- Reliability 0.995 met human-rating threshold (0.99 minimum)
- Mass penalty (30 kg) acceptable given overall vehicle margin
- Cost ($75M) within budget
- Performance (85% efficiency) sufficient to meet engine thrust requirements

**Key insight**: The "best" design on any single metric (efficiency, mass, cost, reliability) was **not** selected. The optimal choice balanced **all** criteria according to stakeholder priorities.

## Probabilistic Risk Assessment (PRA): Formal Risk Quantification

**From NASA/SP-2011-3421, Probabilistic Risk Assessment Procedures Guide**

### What PRA Does
PRA models all possible failure scenarios and computes:
- **Probability of mission failure** (quantitative risk)
- **Dominant failure modes** (which risks contribute most?)
- **Risk drivers** (which subsystems/decisions have greatest impact?)

### PRA Process
1. **Define success criteria** (what does "mission success" mean?)
2. **Identify failure scenarios** (fault tree analysis: what can go wrong?)
3. **Estimate failure probabilities** (component reliability data, expert judgment)
4. **Propagate uncertainty** (Monte Carlo simulation)
5. **Compute risk metrics** (P(failure), expected loss, risk ranking)

### Example: Cassini Mission PRA

Cassini mission to Saturn (launched 1997) carried **radioactive plutonium** (for power). Public concern: What if launch fails and plutonium is released?

**PRA Analysis**:
- **Failure scenarios**: Launch vehicle explosion, spacecraft breakup during Earth flyby, accidental reentry
- **Consequence analysis**: Plutonium dispersion modeling, health impact assessment
- **Probability quantification**: 
  - P(launch failure) = 1/100 (Titan IV historical data)
  - P(plutonium release | launch failure) = 1/10 (containment vessel rated for impact)
  - P(health impact | release) = modeled per population density

**Result**: P(significant public harm) < 1 in 1,000,000

**Decision**: Risk acceptable; mission approved. But mitigation added:
- Reinforced plutonium containment
- Launch trajectory optimized to avoid populated areas during ascent
- Emergency response plans pre-staged

**Lesson**: PRA didn't eliminate risk—it **quantified** risk, enabling informed decision (is 1 in 1M acceptable?). Stakeholders (NASA, DoE, public) could debate the number, not speculate.

## Transfer to Agent Systems: Orchestration Under Uncertainty

### Principle 1: Task Success Probability as Design Input

Every task decomposition should estimate:
- **P(success | decomposition D)** (what's the likelihood this plan works?)
- **Cost(D)** (what resources does this plan consume?)
- **Value(D)** (what's the payoff if successful?)

**Implementation**:
```python
class TaskDecomposition:
    skills: List[Skill]
    success_probability: float  # e.g., 0.85
    expected_cost: float  # e.g., 5000 ms latency, 2 GB memory
    expected_value: float  # e.g., $100 revenue if successful
    
    def expected_utility(self):
        return self.success_probability * self.expected_value - self.expected_cost
```

**Decision rule**: Select decomposition with highest expected utility.

### Principle 2: Multi-Objective Orchestration

Tasks have multiple success criteria:
- **Latency** (must complete within deadline)
- **Cost** (must stay within resource budget)
- **Quality** (must meet accuracy threshold)
- **Risk** (must have acceptable failure probability)

**Implementation: Weighted Scoring**
```python
def score_decomposition(decomp, weights):
    scores = {
        "latency": 100 - (decomp.latency / deadline) * 100,
        "cost": 100 - (decomp.cost / budget) * 100,
        "quality": decomp.accuracy,
        "risk": decomp.success_probability * 100
    }
    
    weighted_score = sum(scores[k] * weights[k] for k in scores)
    return weighted_score

# Example: User values latency and quality over cost
weights = {"latency": 0.4, "quality": 0.4, "cost": 0.1, "risk": 0.1}
best_decomp = max(candidates, key=lambda d: score_decomposition(d, weights))
```

### Principle 3: Sensitivity Analysis for Robustness

Don't just pick the highest-scoring option—test if the decision is **robust** to assumption changes.

**Implementation**:
```python
def sensitivity_analysis(decomposition, parameter, range_values):
    scores = []
    for value in range_values:
        # Vary parameter (e.g., skill success probability)
        modified = decomposition.copy()
        setattr(modified, parameter, value)
        scores.append(score_decomposition(modified, weights))
    
    # Is the decision stable?
    variance = np.var(scores)
    return variance

# If variance is high, decision is fragile (small changes flip the choice)
```

**Example**: If Task A scores 75 and Task B scores 74, but Task A's score drops to 65 if one skill's success probability decreases by 5%, then Task A is fragile. Choose Task B (more robust).

### Principle 4: Decision Rationale as Traceable Artifact

When orchestrator selects a decomposition, log:
- What alternatives were considered?
- What criteria were used?
- What assumptions were made?
- What sensitivities exist?

**Implementation**:
```python
class DecisionRecord:
    task_id: str
    alternatives: List[TaskDecomposition]
    selected: TaskDecomposition
    criteria: Dict[str, float]  # weights
    assumptions: Dict[str, Any]  # e.g., {"skill_reliability": 0.95}
    sensitivities: Dict[str, float]  # e.g., {"latency_sensitivity": 0.12}
    timestamp: datetime
    approver: str  # if human-in-loop required
```

### Principle 5: Adaptive Re-Planning Based on Observed Risk

If execution reveals that assumptions were wrong (e.g., skill takes 2× expected time), **re-plan**:

```python
def execute_with_adaptation(task, initial_plan):
    result = execute(task, plan=initial_plan)
    
    if result.observed_risk > acceptable_threshold:
        # Actual performance worse than expected
        alternatives = generate_alternatives(task, constraints=updated_constraints)
        new_plan = select_best(alternatives, criteria=risk_adjusted_weights)
        retry(task, plan=new_plan)
```

### Principle 6: Quantifying Skill Reliability from Execution History

Skills should have **empirical success probabilities** based on logs:

```python
def estimate_skill_reliability(skill_id, lookback_days=30):
    executions = query_logs(skill_id, days=lookback_days)
    successes = [e for e in executions if e.success]
    
    reliability = len(successes) / len(executions)
    confidence_interval = binomial_confidence(len(successes), len(executions))
    
    return reliability, confidence_interval

# Example: "PathPlanning" succeeded 850 / 1000 times in last 30 days
# Reliability = 0.85 ± 0.02 (95% CI)
```

Use this empirical data to update PRA models.

## Open Questions and Design Challenges

### Q1: How Do You Weight Decision Criteria?

NASA uses stakeholder input (mission scientists, program managers, NASA HQ). For agent systems:
- Should weights be **user-specified** (user declares priorities)?
- Should weights be **learned** (infer from past decisions)?
- Should weights be **adaptive** (change based on context)?

### Q2: How Do You Handle Unknown Unknowns?

PRA models **known failure modes**. But what about failure modes you haven't imagined?

NASA's answer (implicit in RIDM): 
- Build **margin** (design capacity exceeds requirements)
- Use **redundancy** (multiple ways to achieve objective)
- Conduct **independent reviews** (fresh eyes catch overlooked risks)

For agent systems: Should orchestrators have:
- **Margin pools** (reserve computational resources for unexpected needs)?
- **Fallback strategies** (alternative decompositions pre-computed)?
- **Anomaly detection** (flag unexpected execution patterns)?

### Q3: When Do You Revisit Decisions?

NASA says: "Conditions for re-evaluation" should be documented. But what triggers review?

Options:
- **Scheduled** (quarterly risk review)
- **Event-driven** (after failure or near-miss)
- **Threshold-based** (if observed risk exceeds X, re-evaluate)

### Q4: How Do You Avoid Analysis Paralysis?

RIDM is formal and thorough—but time-consuming. NASA addresses this via **tailoring** (high-risk decisions get full RIDM; routine decisions use heuristics).

For agent systems: Should there be a **fast path** for low-stakes decisions and a **formal path** for high-stakes decisions?

## Summary: Why RIDM Works

NASA's risk-informed decision making succeeds because:

1. **Risk is quantified, not speculated** (PRA provides numbers, not vibes)
2. **Multiple objectives are balanced** (not just "minimize risk" or "minimize cost")
3. **Alternatives are generated before analysis** (prevents premature commitment)
4. **Assumptions are documented** (enables sensitivity analysis)
5. **Decisions are traceable** (future engineers understand why choices were made)
6. **Re-evaluation is planned** (decisions aren't permanent; context changes trigger review)

For agent orchestrators, this means:
- **Task decompositions should estimate success probability** and expected value
- **Skill reliability should be empirically measured** and updated from execution logs
- **Orchestration decisions should balance multiple criteria** (latency, cost, quality, risk)
- **Decision rationale should be captured** for post-incident analysis
- **Adaptive re-planning should trigger** when observed risk exceeds expectations

This isn't just "good practice"—it's the infrastructure that makes intelligent systems **trustworthy** at scale. NASA proved it works for spaceflight. Agent systems need it for autonomous decision-making.