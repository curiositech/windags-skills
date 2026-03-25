# Control Theory for Software Adaptation: Automatic Controller Synthesis

## The Revolutionary Idea

Most software engineers think of adaptation as writing conditional logic: "if CPU > 80%, then scale up." This is reactive programming—you write rules for every situation you anticipate.

Control theory offers a radically different approach: **model the system's dynamics, then automatically synthesize a controller that provably achieves your goals**. You don't write adaptation rules—you specify goals, and the controller is mathematically derived to achieve them.

The book presents this as "Wave VI" of self-adaptive systems engineering, building on earlier waves (architecture-based, model-based, requirements-driven). The key claim:

> "The principal idea of control-based software adaptation is to apply control theory to engineer the feedback loops of self-adaptive software systems with guarantees for properties such as stability, accuracy, and settling time."

This isn't just theory—the book demonstrates automatic controller construction for real systems with formal guarantees.

## The Push-Button Methodology

The book describes a process that removes human expertise from the loop:

### Phase 1: Model Building
> "The approach automatically constructs a linear model of the target system... by running on-the-fly experiments on the software."

**Process**:
1. Identify the **control variable** (what you can adjust, e.g., service selection probability)
2. Identify the **output variable** (what you want to control, e.g., reliability)
3. Run experiments: systematically vary the control variable and measure output response
4. Fit a linear model: `y(k) = α·u(k-1) + β` (slope α, intercept β)

**Example (Geo-Localization Service)**:
- Control variable: `u(k)` = probability of selecting low-reliability service S1 (range [0,1])
- Output variable: `y(k)` = measured reliability
- Experiment: Try u = 1.0, 0.8, 0.6, 0.4, 0.2, 0.0 and measure resulting reliability
- Model discovered: `reliability = -0.5 × u + 1.0`
  - When u=1 (always use S1): reliability = 0.5
  - When u=0 (always use S2): reliability = 1.0
  - When u=0.5 (50/50 mix): reliability = 0.75

This model is **discovered empirically**, not hand-coded. The system doesn't need to know how services work internally—it just observes input-output behavior.

### Phase 2: Controller Creation
Once the model exists, the controller is synthesized automatically using control theory.

**For SISO (Single-Input Single-Output) systems**, the book uses a PI (Proportional-Integral) controller:

```
Control law: u(k) = u(k-1) + K_P · e(k) + K_I · Σe(i)
```

Where:
- `e(k) = r(k) - y(k)` (error: desired value minus actual value)
- `K_P` = proportional gain (react to current error)
- `K_I` = integral gain (correct accumulated error over time)

**Key insight**: The gains K_P and K_I are **automatically computed** from the model parameters and a single designer choice: the **pole** p.

**Transfer function** for the closed loop:
```
G(z) = (1-p) / (z-p)
```

The pole p determines:
- **Stability**: If p ∈ [0, 1), the system is guaranteed stable
- **Settling time**: k_ε = log(0.05) / log|p| (time to reach 95% of target)
- **Overshoot vs. convergence tradeoff**:
  - Smaller p → faster convergence, more overshoot
  - Larger p (close to 1) → slower convergence, less overshoot

**Example**: For geo-localization service, choose p = 0.7
```
Settling time: k_ε = log(0.05) / log(0.7) ≈ 8.4 time steps
Stability: Guaranteed (0.7 < 1)
Overshoot: Moderate
```

The controller parameters K_P and K_I are then computed from p and the model parameter α:
```
K_P = (1-p) / α
K_I = K_P
```

**The designer's job**: Choose one parameter (p). Everything else is automatic.

### Phase 3: Operation
The controller runs continuously:
```
Every time step k:
  1. Measure output: y(k) = current reliability
  2. Compute error: e(k) = target - y(k)
  3. Compute control signal: u(k) = u(k-1) + K_P·e(k) + K_I·Σe
  4. Apply control signal: set service selection probability to u(k)
  5. Repeat
```

**Critically, during operation**:
- The model can be updated incrementally (Kalman filtering) if system behavior drifts
- If abrupt changes occur (change-point detection), the model is rebuilt
- The controller continues running—no downtime for retraining

## Formal Guarantees: What Control Theory Proves

### Guarantee 1: Stability
**Theorem**: If pole p ∈ [0, 1), the closed-loop system is stable (output converges to target, doesn't diverge).

**Proof sketch**: 
The system's response to a step input (target changes from 0 to r) is:
```
y(k) = r · (1 - p^k)
```

As k → ∞, p^k → 0 (since |p| < 1), so y(k) → r. The system converges to the target. ∎

**Practical implication**: You can mathematically prove the system won't oscillate wildly or diverge—before deploying it.

### Guarantee 2: Settling Time
**Theorem**: The system reaches (100-ε)% of the target in exactly:
```
k_ε = log(0.01ε) / log|p| time steps
```

**Proof**:
```
y(k) = r · (1 - p^k)
(1 - 0.01ε) · r = r · (1 - p^k)
0.01ε = p^k
k = log(0.01ε) / log(p)
```

For ε=5% (reaching 95% of target):
```
k_ε = log(0.05) / log|p|
```

**Example values**:
- p = 0.9: k_ε ≈ 28 steps (slow but smooth)
- p = 0.7: k_ε ≈ 8 steps (balanced)
- p = 0.5: k_ε ≈ 4 steps (fast but more overshoot)

**Practical implication**: You can specify a required convergence time ("must stabilize within 5 seconds") and compute the pole that achieves it.

### Guarantee 3: Disturbance Rejection
Control theory provides bounds on how much external disturbances affect the output.

**Disturbance model**:
```
y(k) = α·u(k-1) + d(k)
```
Where d(k) is an unknown external input (e.g., network delays, workload spikes).

**Theorem**: The PI controller rejects **constant** disturbances with zero steady-state error.

**Proof sketch**: The integral term K_I·Σe accumulates error over time. If a disturbance causes persistent error, the integral term grows until it compensates. At steady state:
```
If error persists: Σe → ∞ → u → ∞ (or boundary)
Thus: Error must go to 0 for bounded u.
```

**Practical implication**: The system automatically compensates for unknown but stable disturbances—without knowing what they are.

## Case Study: Geo-Localization Service (Complete Timeline)

**Setup**:
- Goal: Maintain reliability r = 0.75
- Two services: S1 (reliability 0.5, cheap), S2 (reliability 1.0, expensive)
- Control variable: Probability u of selecting S1 (S2 selected with probability 1-u)
- Disturbances: Network timeouts, workload variations (unknown)

**Phase 1: Model Building (k = 0 to 400)**
```
u=1.0 → measured reliability = 0.51
u=0.8 → 0.60
u=0.6 → 0.71
u=0.4 → 0.80
u=0.2 → 0.91
u=0.0 → 1.00
```

Linear regression: `y = -0.48 × u + 1.01`  
Model: α = -0.48, β = 1.01

**Phase 2: Controller Creation (k = 400)**
```
Desired settling time: 10 steps (to 95% of target)
Compute pole: p = exp(log(0.05) / 10) ≈ 0.70

Compute gains:
K_P = (1 - 0.70) / (-0.48) = -0.625
K_I = K_P = -0.625
```

**Phase 3: Operation**

**k = 400-1000**: Steady state
```
k=400: u = 0.5 (initial guess)
k=401: y = 0.73, e = 0.75 - 0.73 = 0.02, u = 0.5 + (-0.625)×0.02 = 0.4875
k=402: y = 0.74, e = 0.01, u = 0.4875 + (-0.625)×0.01 = 0.48125
...
k=410: y = 0.75, e ≈ 0, u ≈ 0.48 (converged)
```

Observed: System reaches u ≈ 0.48, maintaining reliability ≈ 0.75 with minimal overshoot.

**k = 1000**: Goal changes to r = 0.65
```
k=1000: e = 0.65 - 0.75 = -0.10 (negative error)
k=1001: u = 0.48 + (-0.625)×(-0.10) = 0.5425
...
k=1010: u ≈ 0.55, y ≈ 0.65 (converged to new target)
```

**k = 1400-1700**: System drift (S1's reliability gradually increases from 0.50 → 0.60)
```
Kalman filter detects: α drifts from -0.48 → -0.38 (slope changes)
Kalman filter updates model incrementally (no system restart)
Controller automatically adjusts: u shifts from 0.55 → 0.50
Final state: u = 0.50, y = 0.65 (goal maintained despite drift)
```

**Key observations**:
1. Controller achieved target (0.75) within predicted time (~10 steps)
2. Adapted smoothly to goal change (0.75 → 0.65)
3. Tracked system drift automatically (Kalman filter)
4. No human intervention during any of these adaptations

## Scaling to Multiple Goals: MIMO and Simplex

SISO (single control, single goal) doesn't scale to complex systems with multiple conflicting objectives. The book extends to MIMO (multiple inputs, multiple outputs).

### The Problem
**Example: Underwater Vehicle**
- Goal 1: Scan 100 km in 10 hours (distance/time)
- Goal 2: Consume ≤ 5.4 MJ energy
- Goal 3 (optimization): Maximize measurement accuracy

Single SISO controller can't handle this—adjusting speed to meet Goal 1 affects energy (Goal 2), and both affect which sensors are active (Goal 3).

### The MIMO Solution
Build **separate SISO controllers for each goal**, then use **Simplex optimization** to combine their control signals.

**Architecture**:
```
Controller C1: Maintains energy goal
  Input: Measured energy consumption
  Output: Control signal u1 (energy allocation across sensors)

Controller C2: Maintains speed goal
  Input: Measured scanning speed
  Output: Control signal u2 (vehicle velocity)

Simplex Optimizer:
  Input: Control signals u1, u2 + optimization goal (maximize accuracy)
  Output: Actuator settings (which sensors active, vehicle speed)
  Method: Linear programming
```

**Simplex's job**: Find actuator settings that:
1. Satisfy C1's energy constraint (energy ≤ 150 J/s)
2. Satisfy C2's speed constraint (speed ≥ 3 m/s)
3. Maximize accuracy (given constraints 1 and 2)

**Formulation** (simplified):
```
Maximize: Accuracy = Σ accuracy_i × time_i (sensor i active for time_i)
Subject to:
  Σ energy_i × time_i ≤ 150  (energy constraint)
  Σ (1 / speed_i) × distance_i ≤ 1  (time constraint)
  Σ time_i = 1  (total time = 100%)
  time_i ≥ 0
```

Simplex solves this LP every control cycle (e.g., every 10 seconds), finding the optimal sensor allocation.

### Case Study: UUV Adaptation Timeline

**k = 0-25**: Model building for C1 (energy) and C2 (speed)  
Experiments: Vary energy allocation and measure consumption; vary speed and measure distance covered.  
Models discovered:
```
Energy: y1 = α1 × u1 + disturbance1
Speed: y2 = α2 × u2 + disturbance2
```

**k = 25-100**: Steady state
```
C1 maintains: energy = 150 J/s
C2 maintains: speed = 3 m/s
Simplex allocates: Sensor1 (60%), Sensor2 (15%), Sensor4 (25%)
Achieved accuracy: 90%
```

**k = 100**: Energy budget reduced by 10% (150 → 140 J/s)
```
C1 detects error: e1 = 140 - 150 = -10 (consuming too much)
C1 adjusts: u1 decreases (reduce energy allocation)
Simplex recomputes: Shift to energy-efficient sensors
New allocation: Sensor1 (25%), Sensor2 (15%), Sensor4 (60%)
Accuracy drops: 90% → 87% (tradeoff: energy vs. accuracy)
```

**k = 175**: Sensor 4 fails (hardware fault)
```
Simplex detects: Sensor 4 no longer available (time_4 = 0 forced)
Simplex recomputes: Allocate among remaining sensors
New allocation: Sensor1 (50%), Sensor2 (20%), Sensor3 (30%)
Accuracy drops: 87% → 85% (fewer sensors available)
Controllers C1 and C2 continue operating (no manual intervention)
```

**k = 225**: Goal becomes infeasible (speed increased to 4 m/s)
```
C2 attempts: Increase vehicle velocity
C2 observes: Actual speed saturates at 3.4 m/s (hardware limit)
C2 signals: "Infeasible goal; maximum achievable = 3.4 m/s"
System notifies operator: "Speed goal 4 m/s cannot be met. Current max: 3.4 m/s."
System continues: Operates at 3.4 m/s (graceful degradation)
```

**Key observations**:
1. Multiple controllers operated in parallel without interference
2. Simplex coordinated their demands, resolving conflicts via optimization
3. System adapted to goal changes, component failures, and infeasible goals
4. No human intervention except when goals became provably impossible

## Incremental Model Updating: Kalman Filtering

Models aren't static—systems drift due to workload changes, software updates, hardware aging. The book shows how to update models online without stopping the system.

### The Problem
```
Initial model: y = α × u + β
After 1000 time steps: System behavior changes
  Old α = -0.48 no longer accurate
  New α ≈ -0.40 (system became less sensitive to control input)
```

If you don't update the model, the controller will misbehave (compute wrong control signals).

**Naive solution**: Stop the system, re-run Phase 1 (model building), restart.  
**Problem**: Disruptive, time-consuming (hundreds of time steps).

**Control-theoretic solution**: Use a Kalman filter to update model parameters incrementally.

### Kalman Filter for Parameter Estimation

The Kalman filter maintains:
- **State estimate**: Current value of α
- **Uncertainty estimate**: Confidence in α (variance)

**Update rule** (simplified):
```
At each time step k:
  1. Predict: α_pred(k) = α(k-1) (assume no change)
  2. Measure: y_actual(k)
  3. Predict output: y_pred(k) = α(k-1) × u(k-1)
  4. Compute error: innovation = y_actual - y_pred
  5. Update α: α(k) = α(k-1) + K × innovation
  6. Update uncertainty: decrease variance (more data → more confident)
```

K is the **Kalman gain** (tunable; higher K = trust new data more).

### Example: Geo-Localization Service (Drift Scenario)

**k = 1400**: S1's reliability starts increasing (0.50 → 0.60 over 300 steps)
```
Model: y = α × u + β
Initially: α = -0.48

k=1400: y_actual = 0.66, y_pred = 0.65 (using old α)
  innovation = 0.01
  α_new = -0.48 + 0.1 × 0.01 = -0.479 (small update)

k=1450: y_actual = 0.68, y_pred = 0.66
  innovation = 0.02
  α_new = -0.479 + 0.1 × 0.02 = -0.477

k=1600: After 200 steps of drift
  α_new ≈ -0.40 (model has adapted)
  Controller now uses α = -0.40 for computing control signals
  System remains stable throughout drift
```

**Key insight**: The system never stopped. Model updated incrementally while controller was running.

### When Kalman Filtering Isn't Enough: Change-Point Detection

Kalman filtering assumes **gradual drift**. But abrupt changes (e.g., service fails completely) break this assumption.

**Change-point detection**:
```
Maintain two sliding windows:
  Window 1: Average error over last n/2 steps
  Window 2: Average error over last n/2 steps (earlier)

If |error1 - error2| > threshold:
  → Abrupt change detected
  → Trigger full model rebuild (Phase 1)
  → Replace controller (Phase 2)
```

**Example**: 
```
k=1000-1500: Kalman filter tracking gradual drift (α = -0.48 → -0.45)
k=1600: Service S1 suddenly fails (reliability drops 0.60 → 0.10)
k=1601: error1 = 0.05 (recent), error2 = 0.01 (historical)
  |error1 - error2| = 0.04 > 0.02 (threshold)
  → Change-point detected
  → System enters model rebuild mode
k=1601-1700: Re-run experiments, build new model
k=1700: New model deployed, controller updated
k=1701+: System resumes normal operation
```

**Tradeoff**: Model rebuilding is invasive (100-200 time steps), but necessary for abrupt changes.

## Model Predictive Control: Planning Over Time Horizons

SISO and MIMO controllers are **reactive**—they respond to current error without looking ahead. **Model Predictive Control (MPC)** is **proactive**—it plans over a future time horizon and executes only the first action.

### The Core Idea

> "MPC is centered on the optimization of a utility function (or cost function) that accounts for the current operating point and all possible trajectories of the outcome of control decisions over a time horizon."

**Process**:
```
At time k:
  1. Look ahead L time steps (k, k+1, ..., k+L)
  2. For each possible sequence of actions:
     Predict: What will outputs y(k+1), y(k+2), ..., y(k+L) be?
  3. Compute cost for each sequence:
     Cost = Σ [ (y(k+i) - target)² + penalty_for_changing_actions ]
  4. Select sequence with minimum cost
  5. Execute only the first action u(k)
  6. At time k+1: Repeat (replan with new information)
```

**Why this is better than reactive control**:
- Can **anticipate** future events (e.g., "if I increase power now, I'll violate energy budget in 5 steps")
- Can **optimize over sequences** (e.g., "better to undershoot now and overshoot later than oscillate")
- Can **balance conflicting goals** (e.g., "temporarily violate latency to save energy, then recover")

### Case Study: Video Encoder

**Setup**:
- Input: Video frames (30 fps)
- Goals: SSIM (quality) ≥ 0.8, Frame size ≤ 8 KB
- Actuators: Compression density, sharpening filter, noise reduction
- Horizon: L = 4 frames (≈ 130ms)

**Cost function**:
```
Minimize: Σ(i=1 to L) [
  w1 × (SSIM(k+i) - 0.8)²
  + w2 × (size(k+i) - 8KB)²
  + d1 × (ΔCompression(k+i))²  ← penalty for changing compression
  + d2 × (ΔSharpening(k+i))²   ← penalty for changing sharpening
  + d3 × (ΔNoiseReduction(k+i))²
]
```

**Key term**: `d × (ΔActuator)²` penalizes **changes** in actuator settings, not just their values.

**Why it matters**: Without this term, MPC might oscillate (compression=10 → 90 → 10 → 90), causing visual "flicker." The penalty term encourages **smooth, stable** adaptations.

**Example scenario**:

**k=0**: Frame 0 arrives
```
MPC looks ahead to frames 0, 1, 2, 3
Predicts: Frame 1 will have high motion (needs more compression)
Computes: Best sequence is (comp=40, comp=45, comp=40, comp=40)
Executes: comp=40 for frame 0
```

**k=1**: Frame 1 arrives (actual motion confirmed high)
```
MPC looks ahead to frames 1, 2, 3, 4
Predicts: Frame 2 will return to low motion
Computes: Best sequence is (comp=45, comp=40, comp=40, comp=40)
Executes: comp=45 for frame 1
```

**Comparison to reactive control**:
```
Reactive would: 
  k=0: Low motion → comp=30
  k=1: High motion detected → comp=60 (big jump → flicker)
  k=2: Low motion → comp=30 (big jump → flicker)

MPC does:
  k=0: comp=40 (anticipating k=1 will need more)
  k=1: comp=45 (small adjustment)
  k=2: comp=40 (smooth return)
  
Result: No flicker, smoother video quality
```

**Computational cost**: MPC solves optimization every frame (33ms).  
Book reports: 3ms overhead (feasible for real-time).  
**Reason**: Linear model + convex cost function = fast solver (interior-point method).

### Infeasible Goals in MPC

**Scenario**: Goals raised to SSIM ≥ 0.9, size ≤ 8 KB  
**Problem**: No actuator settings satisfy both (hardware limitations)

**MPC behavior**:
```
MPC solves: Minimize cost (knowing some goals will be violated)
Result:
  - Size goal still satisfied: size = 8 KB ✓
  - SSIM goal violated: SSIM = 0.87 (as close as possible)
  - System notifies user: "SSIM goal 0.9 infeasible; achieved 0.87"
```

**Key observation**: MPC doesn't fail—it finds the **least-bad** solution and reports the gap.

## Formal Guarantees vs. Real-World Validation

A critical limitation acknowledged by the book:

> "Since these models are an abstraction of the control system, formal assessment needs to be complemented with validation of the real control system. Hence, approval for the acceptance of a control-based self-adaptive software system can only given when formal guarantees based on the model of the control system are combined with validation that provides evidence for the compliance of the real system with its requirements."

### The Gap Between Model and Reality

**What control theory proves**:
- Stability of the **model** (if p < 1, model converges)
- Settling time of the **model** (k_ε steps to 95% of target)
- Disturbance rejection of the **model** (constant disturbances → zero steady-state error)

**What control theory does NOT prove**:
- The model is accurate (maybe the real system is nonlinear, not linear)
- Disturbances match assumptions (maybe they're not constant)
- Actuators work as expected (maybe there are delays or failures)

### Mitigation Strategies

**1. Model Validation**  
After building model in Phase 1, test it:
```
Predicted: y = -0.48 × u + 1.01
Validation: Try u = 0.7 (not used in training)
  Predicted: y = 0.674
  Measured: y = 0.681
  Error: 1% (acceptable)
```

**2. Monitoring Model Accuracy During Operation**  
Track prediction error continuously:
```
Every time step:
  error = |y_predicted - y_measured|
  If error > threshold for N consecutive steps:
    → Model no longer accurate
    → Trigger model rebuild
```

**3. Safety Monitors**  
Add independent safety checks (outside the controller):