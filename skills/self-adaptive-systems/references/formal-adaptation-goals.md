# Formal Adaptation Goals: Making Requirements Executable

## The Problem with Informal Goals

Most systems have adaptation logic guided by informal requirements: "keep the system fast," "maintain high reliability," "minimize costs." These aren't goals—they're aspirations. They provide no basis for:

- **Verification**: Can you prove the adaptation will achieve the goal?
- **Conflict resolution**: When goals conflict, which takes priority?
- **Satisfaction testing**: How do you know when you've achieved the goal?
- **Automated decision-making**: What control law implements the goal?

The book makes this requirement explicit:

> "Adaptation goals can be specified as quality requirements of the managed system, such as reliability, performance, security, cost, or interoperability. Such goals need to be specified in a format that can be used by the managing system at runtime to derive appropriate adaptation decisions."

This isn't a nice-to-have—it's a requirement for self-adaptation. The managing system must be able to **read, reason about, and execute against** adaptation goals without human interpretation.

## Four Formalization Strategies

### 1. Probabilistic Temporal Logic

For goals involving uncertainty and time, use probabilistic temporal logic (PCTL, CSL):

**Example from DeltaIoT**:
```
P≥0.95 [ F≤10cycles (packet_loss ≤ 0.10) ]
```

Translation: "With probability at least 95%, within 10 communication cycles, the packet loss rate will be at most 10%."

This formalization enables:
- **Model checking**: Use PRISM or UPPAAL to verify if adaptation options satisfy the goal
- **Quantitative analysis**: Compute exact probability of satisfaction for each adaptation
- **Time-bounded reasoning**: Know not just if goals are met, but how quickly

**Another example (health system)**:
```
P≤0.14 [ F (service_fails) ]
```

"The probability of service failure must be at most 14%." This is a hard constraint—any adaptation violating it is rejected.

The power: These formulas are **executable**. The model checker takes a system model (Markov chain), the formula, and returns true/false + diagnostic information (which paths violate it).

### 2. Utility Functions

For optimization goals with tradeoffs, use weighted utility functions:

**General form**:
```
U_c = Σ w_i · p_i(x_i)
```

Where:
- `c` is a system configuration
- `w_i` is the weight for quality property `i` (weights sum to 1)
- `p_i(x_i)` is a preference function mapping property value `x_i` to [0,1]

**Example from health system**:

Quality properties:
- Failure rate (`x_1`)
- Cost (`x_2`)

Preference functions:
```
p_1(x_1) = { 1.0  if x_1 ≤ 1%
           { 0.3  if 1% < x_1 ≤ 2%
           { 0.0  if x_1 > 2%

p_2(x_2) = { 1.0  if x_2 ≤ $5
           { 0.7  if $5 < x_2 ≤ $10
           { 0.5  if $10 < x_2 ≤ $15
           { 0.0  if x_2 > $15
```

Weights: `w_1 = 0.7` (reliability), `w_2 = 0.3` (cost)

**Evaluation of two configurations**:

Configuration C1: failure rate = 1.2%, cost = $11
```
U_C1 = 0.7 · 0.3 + 0.3 · 0.5 = 0.21 + 0.15 = 0.36
```

Configuration C2: failure rate = 0.9%, cost = $16
```
U_C2 = 0.7 · 1.0 + 0.3 · 0.0 = 0.70 + 0.0 = 0.70
```

**Decision**: Select C2—despite higher cost, the weighted utility is higher because reliability is weighted 0.7 (vs. cost at 0.3).

This formalization enables:
- **Explicit tradeoffs**: Stakeholder preferences are encoded in weights and preference functions
- **Objective ranking**: All configurations get a scalar utility score
- **Automated selection**: The managing system picks argmax(U)
- **Explainability**: "We chose C2 because reliability was prioritized 70/30 over cost"

### 3. Fuzzy Constraints

For goals with inherent vagueness or tolerance, use fuzzy logic:

**Example from temperature control**:
```
Temperature should be CLOSE_TO 70°F
```

Formalized as a fuzzy membership function:
```
μ(t) = { 1.0           if |t - 70| ≤ 2
       { 1 - |t-70|/5  if 2 < |t - 70| ≤ 5
       { 0.0           if |t - 70| > 5
```

So:
- 68-72°F: fully satisfies goal (μ = 1.0)
- 65-68°F or 72-75°F: partially satisfies (μ = 0.6-1.0)
- <65°F or >75°F: violates goal (μ = 0.0)

This formalization enables:
- **Graceful degradation**: System doesn't fail hard at 73°F; it's "slightly unsatisfied"
- **Prioritization**: If multiple goals are partially satisfied, maximize total membership
- **Tolerance specification**: Explicitly encode acceptable deviations

**Example from video encoding**:
```
Frame size should be AS_CLOSE_AS_POSSIBLE_TO 8KB
```

Fuzzy goal: minimize |size - 8KB| rather than hard threshold. The managing system can accept frames of 8.1KB if it means significantly better quality.

### 4. Control-Theoretic Objectives

For goals involving dynamic behavior (settling time, overshoot, steady-state error), use control theory:

**Example from SISO controller**:
```
Goal: Maintain output y(k) at reference r(k) = 0.75
Control objective: 
  - Stability: pole p ∈ [0, 1)
  - Settling time: k_ε = 5 time steps (for ε = 5% error)
  - Overshoot: < 10%
```

From control theory, we know:
```
y(k) = r · (1 - p^k)
```

To achieve settling time k_ε = 5:
```
5 = log(0.05) / log(p)
p = exp(log(0.05) / 5) ≈ 0.55
```

So the managing system automatically computes: "Use pole p = 0.55 to achieve 5-step settling time."

This formalization enables:
- **Automatic controller synthesis**: Given the goal, compute controller parameters
- **Formal guarantees**: Prove (mathematically) that the controller will achieve the goal
- **Performance tuning**: Adjust a single parameter (pole) to trade off convergence speed vs. overshoot

## The Four-Class Hierarchy of Goals

The book distinguishes goal types with different formalization requirements:

### 1. Invariant Goals (Hard Constraints)
Never relax. System must always satisfy, or fail safely.

**Example**: 
```
System SHALL always maintain fail-safe operation
System SHALL never exceed maximum energy budget
```

Formalization: Boolean predicates evaluated continuously. If violated, trigger emergency shutdown or escalation.

**Implementation**:
```
Monitor: energy_consumed ≤ energy_budget
If violated: 
  - Stop all non-critical tasks immediately
  - Notify operator
  - Enter degraded mode
```

### 2. Relaxable Goals (Soft Constraints)
Can be temporarily violated, but must be satisfied over time windows or in aggregate.

**Example**:
```
Packet loss SHALL be ≤ 10% IN 12-hour periods
Response time SHALL be AS_CLOSE_AS_POSSIBLE_TO 100ms
```

Formalization: Temporal relaxation (aggregate over time) or ordinal relaxation (minimize distance to target).

**Implementation**:
```
Monitor: avg_packet_loss_over_12h
If > 10%:
  - Increase transmission power (adaptation)
  - Continue monitoring
If still violated after 24h:
  - Escalate to operator
```

### 3. Optimization Goals
Maximize or minimize a metric, subject to constraints.

**Example**:
```
Minimize energy consumption
  subject to: packet_loss ≤ 10% AND latency ≤ 5s
```

Formalization: Objective function + constraint set.

**Implementation**:
```
Objective: min Σ energy(mote_i)
Constraints:
  packet_loss ≤ 0.10
  latency ≤ 5.0

Solver: Linear programming (Simplex) or constraint satisfaction
```

### 4. Meta-Goals (Goals About Goals)
Goals about how adaptation should behave.

**Examples**:
- **Awareness requirements**: "System should detect packet loss within 2 seconds"
- **Evolution requirements**: "System should support adding new sensors without downtime"
- **Adaptation requirements**: "Adaptations should complete within 1 communication cycle"

Formalization: Second-order predicates (goals about the managing system, not the managed system).

**Implementation**:
```
Monitor: time_to_detect_failure
If > 2s:
  - Increase monitoring frequency (meta-adaptation)
  - Update detection algorithm
```

## Case Study: QoSMOS Health System Goals

The health assistance system demonstrates the full hierarchy:

**Invariant goal (R1)**:
```
P[ service_failure ] ≤ 0.14
```
Hard constraint. Any service composition violating this is rejected.

**Optimization goal (R2)**:
```
Minimize cost
  subject to: R1 satisfied
```
Among all compositions satisfying R1, pick the cheapest.

**Meta-goal (implicit)**:
```
Adaptation decision time ≤ 5 seconds
```
If no valid composition found in 5s, escalate to operator.

**Formalization in QoSMOS**:

1. **Build DTMC model** of service composition:
   - States: {start, analysis, alarm, drugService, success, failed*}
   - Transitions: Probabilistic based on service failure rates
   - Failed states: {failedAlarm, failedAnalysis, failedChangeDrug, failedChangeDose}

2. **Express R1 as PCTL formula**:
   ```
   P=? [ F failed* ]
   ```
   Model checker computes: "Probability of reaching any failed state."

3. **Check R1 for each candidate composition**:
   - Medical Service instances: MS1, MS2, MS3
   - Alarm Service instances: AS1, AS2
   - Drug Service instances: DS1, DS2, DS3
   - Total: 3 × 2 × 3 = 18 possible compositions

4. **Filter compositions satisfying R1**:
   - Run model checker on each composition
   - Keep only those with P[failure] ≤ 0.14
   - Result: Suppose 6 compositions satisfy R1

5. **Rank by cost (R2)**:
   - Compute total cost for each of the 6 valid compositions
   - Select composition with minimum cost

**Example results** (from book):

| Composition | P[failure] | Cost | Utility | Valid? |
|-------------|-----------|------|---------|--------|
| MS1+AS1+DS1 | 0.174 | $18 | 0 | No (R1 violated) |
| MS1+AS1+DS2 | 0.089 | $23 | 64.8 | Yes |
| MS2+AS2+DS1 | 0.119 | $21 | 61.2 | Yes |
| MS2+AS2+DS3 | 0.067 | $28 | **73.8** | Yes ← **Selected** |

**Key observations**:

1. Composition 1 is cheapest but violates R1 → rejected
2. Composition 4 has highest cost but also highest utility (best reliability) → selected
3. Utility function encodes the tradeoff: `U = w_reliability · p_reliability + w_cost · p_cost` with weights `w_reliability = 0.7, w_cost = 0.3`
4. The managing system found this automatically—no human decided which composition to use

## Goal Conflicts and Resolution

What happens when goals conflict irreducibly?

### Example: Video Encoder

**Goals**:
- G1: SSIM ≥ 0.8 (quality)
- G2: Frame size ≤ 8KB (bandwidth)

**Scenario 1 (Feasible)**:
Both goals achievable. MPC finds actuator settings (compression density, sharpening, noise reduction) that satisfy both.

**Scenario 2 (Infeasible)**:
G1 raised to SSIM ≥ 0.9. Now no actuator settings can satisfy both G1 and G2.

**System behavior**:

> "In the event of an infeasible goal, the controller will find the actuator settings that bring the output as close as possible to the goal."

The MPC cost function:
```
Minimize: Σ [ w_1(SSIM - 0.9)² + w_2(size - 8KB)² + ... ]
```

If G1 is infeasible, the system:
1. Still satisfies G2 (frame size ≤ 8KB) — feasible goals are not violated
2. Minimizes gap for G1: achieves SSIM = 0.87 (as close as possible to 0.9)
3. Notifies user: "Goal G1 (SSIM ≥ 0.9) is infeasible; achieved 0.87"

This is **graceful degradation**: the system doesn't fail; it does the best it can and reports the gap.

### Resolution Strategies

The book presents three strategies for goal conflicts:

**1. Weights in Utility Function**:
Encode priority explicitly. If G1 is more important than G2, set `w_1 > w_2`.

**2. Goal Hierarchy**:
Some goals are invariants (never relax); others are preferences (relax if needed).

Example:
```
Invariants:
  - Fail-safe operation
  - Security properties

Relaxable:
  - Response time ≤ 100ms (relax to ≤ 150ms if needed)
  - Cost ≤ $10 (relax to ≤ $15 if needed)

Optimizations:
  - Maximize throughput
```

The system always satisfies invariants; relaxes preferences if necessary; optimizes what remains.

**3. Escalation to Human**:
If the system exhausts its adaptation space and still can't satisfy goals, escalate with diagnostics:

```
"Unable to satisfy G1 (SSIM ≥ 0.9) and G2 (size ≤ 8KB) simultaneously.
Current best: SSIM = 0.87, size = 8KB.
Options:
  1. Relax G1 to SSIM ≥ 0.85 (will satisfy both)
  2. Relax G2 to size ≤ 10KB (will satisfy both)
  3. Add hardware (faster encoder will enable both)
What would you like to do?"
```

The human decides; the system executes.

## Meta-Requirements: Goals About the Managing System

The book introduces a subtle concept: **requirements on the adaptation mechanism itself**.

### Awareness Requirements

The managing system must be able to detect when goals are violated, drifting, or at risk.

**Example**:
```
The system SHALL detect packet loss exceeding 10% within 2 seconds
```

This is a requirement on the **Monitor** component. If monitoring is too slow, the system can't adapt in time.

**Formalization**:
```
Monitor polling frequency: f ≥ 0.5 Hz
Detection latency: t_detect ≤ 2s
```

If these aren't met, the **managing system itself is failing**.

### Evolution Requirements

The system must support changing goals and adapting the managing system.

**Example**:
```
The system SHALL support adding new adaptation goals without downtime
```

This requires:
- Versioned goal specifications
- Hot-swappable analysis/planning modules
- Backward compatibility for runtime models

**Formalization**:
```
Goal schema versioning: support v_n and v_{n+1} concurrently
Deployment: blue-green for managing system components
```

### Adaptation Performance Requirements

Adaptations themselves have quality requirements.

**Example**:
```
Adaptations SHALL complete within 1 communication cycle (800ms)
```

This is a constraint on the **Executor** component.

**Formalization**:
```
Quiescence time: t_quiesce ≤ 200ms
Adaptation execution: t_execute ≤ 500ms
Validation: t_validate ≤ 100ms
Total: ≤ 800ms
```

If exceeded, the adaptation disrupts domain operations.

## Practical Implications for Agent Systems

### For WinDAGs (180+ Agents)

**Current state (likely)**:
Goals are informal: "tasks should complete quickly and reliably."

**Self-adaptive approach**:

1. **Formalize goals**:
```
G1 (Invariant): P[task_failure] ≤ 0.05
G2 (Relaxable): P99_latency ≤ 500ms over 1-hour windows
G3 (Optimization): Minimize Σ cost(agent_i)
```

2. **Build runtime models**:
- Agent reliability: `p_success(agent_i | context)` (learned from execution history)
- Agent latency: `latency_distribution(agent_i)` (empirical CDF)
- Agent cost: `cost(agent_i)` (from resource monitoring)

3. **Formalize as verification problem**:
```
Given: Task T, agent set A = {a_1, ..., a_180}
Find: Agent composition c = {a_i1, a_i2, ..., a_ik}
Such that:
  P[failure | c] ≤ 0.05  (G1)
  P[latency > 500ms | c] ≤ 0.01  (G2)
  Minimize Σ cost(a_ij)  (G3)
```

4. **Solve at runtime**:
- Use model checking (PRISM) for small task graphs (< 20 agents)
- Use statistical verification (simulation) for large graphs (> 20 agents)
- Use MPC for continuous adaptation (replan every N seconds)

5. **Report gaps**:
```
If no composition satisfies G1 and G2:
  Report: "Task T requires at least 3 additional high-reliability agents.
           Current best: P[failure] = 0.07 (exceeds 0.05 threshold)."
```

### Design Principles

**1. Make goals machine-readable from day one**  
Don't start with informal goals and "formalize later." Write goals as code.

**2. Separate invariants, preferences, optimizations**  
Use three-tier goal hierarchy. Never trade safety for performance.

**3. Encode tradeoffs explicitly**  
Use utility functions with stakeholder-approved weights. Make the tradeoff visible.

**4. Plan for goal evolution**  
Goals will change. Version them, support hot-swapping, test before deploying.

**5. Monitor goal satisfaction continuously**  
Don't wait for failures. Track how close you are to goal boundaries (awareness requirements).

## The Irreplaceable Contribution

Informal goals are wishful thinking. Formal goals are **contracts between stakeholders and the managing system**. They enable:

1. **Automatic verification**: Prove adaptations work before applying them
2. **Conflict detection**: Know when goals can't be satisfied simultaneously  
3. **Graceful degradation**: Do the best you can when goals conflict
4. **Explainability**: Show why a particular adaptation was chosen
5. **Evolution**: Change goals without changing code (if goals are data, not hardcoded logic)

This is the bridge between "the system adapts sometimes" and "the system provably maintains goals despite uncertainty."