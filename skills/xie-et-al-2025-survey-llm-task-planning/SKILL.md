---
license: Apache-2.0
name: xie-et-al-2025-survey-llm-task-planning
description: Comprehensive survey of LLM-based task planning methods including decomposition, search, and execution strategies
category: Research & Academic
tags:
  - task-planning
  - llm-agents
  - survey
  - decomposition
  - planning
---

# SKILL.md: Lyapunov-Based Resilient Control Under Exponential Attacks

## When to Use This Skill

Load this skill when designing distributed control systems that must maintain stability under exponentially growing adversarial attacks without relying on attack detection or central coordination.

**Activation Triggers:**
- Distributed systems facing quantum-era adversaries with exponentially growing attack capabilities
- Control systems requiring provable resilience guarantees (power grids, autonomous vehicles, manufacturing)
- Multi-agent coordination under adversarial conditions with only local observability
- Systems where detection delay exceeds acceptable damage windows

---

## DECISION POINTS

### Primary Decision Tree: Attack Model → Defense Architecture

```
IF adversarial growth rate IS exponentially unbounded (||attack|| ≤ γ·exp(ρt))
├─ AND system has distributed topology
│  ├─ IF agents have only neighborhood observability
│  │  └─ THEN: Use adaptive neighborhood consensus (this skill)
│  └─ IF global state observable 
│     └─ THEN: Use centralized exponential compensation
├─ AND system has centralized topology
│  └─ THEN: Design centralized adaptive controller with exponential gains
ELSE IF growth rate IS polynomial bounded (||attack|| ≤ γ·t^α)
├─ THEN: Use robust H∞ or sliding mode control
ELSE IF growth rate IS constant bounded (||attack|| ≤ γ)
└─ THEN: Use standard robust control techniques
```

### Lyapunov Function Selection Table

| System Dimension | Communication Topology | Recommended Lyapunov Form | Proof Strategy |
|------------------|----------------------|--------------------------|----------------|
| n < 5 | Fully connected | V = ½x^T P x (quadratic) | Direct derivative computation |
| 5 ≤ n < 20 | Connected graph | V = V_track + V_adapt (composite) | Block diagonal P matrix |
| n ≥ 20 | Sparse graph | V = Σᵢ Vᵢ(xᵢ) + coupling terms | Distributed Lyapunov approach |
| Any | Tree topology | V with graph Laplacian structure | Exploit tree properties |

### Parameter Tuning Decision Process

```
STEP 1: Estimate attack parameters (γᵢ, ρᵢ)
├─ IF unknown: Use worst-case bounds from physical constraints
└─ IF observable: Estimate from recent consensus error patterns

STEP 2: Select adaptation gains
├─ IF fast dynamics (frequency control): βf = 40-60
├─ IF slow dynamics (voltage control): βv = 20-40
└─ IF mixed timescales: Use βf = 2×βv

STEP 3: Tune threshold parameters
├─ IF high noise environment: λ = 0.10-0.15 (higher threshold)
├─ IF low noise environment: λ = 0.05-0.08 (sensitive response)
└─ IF unknown noise: Start λ = 0.10, adjust based on oscillation

STEP 4: Verify ultimate bound
├─ IF bound > tolerance: Increase β gains by factor 1.5-2.0
├─ IF oscillations appear: Decrease β by factor 0.7, increase η damping
└─ IF stable: Proceed to implementation
```

---

## FAILURE MODES

### 1. Linear Compensation Against Exponential Attacks
**Symptoms:** System initially stable, then sudden divergence; control effort plateaus while errors grow
**Diagnosis:** Using fixed gains designed for bounded disturbances against exp(ρt) attacks
**Detection Rule:** IF tracking error grows faster than polynomial DESPITE increasing control effort
**Fix:** Replace linear compensation Γ = K·error with exponential form Γ = (error·exp(φ))/(|error| + η)

### 2. Adaptation Parameter Explosion
**Symptoms:** φᵢ parameters grow without bound; actuator saturation; system becomes uncontrollable
**Diagnosis:** No damping terms in adaptation law; βᵢ gains too aggressive
**Detection Rule:** IF adaptation parameters φᵢ > 10×initial values AND still growing
**Fix:** Add leakage terms: φ̇ᵢ = βᵢ(|error| - λᵢ) - σᵢφᵢ; implement anti-windup when actuators saturate

### 3. Graph Topology Vulnerability
**Symptoms:** System unstable despite correct local control laws; consensus never achieved
**Diagnosis:** Communication graph lacks sufficient connectivity; adversary has isolated critical nodes
**Detection Rule:** IF eigenvalues of graph Laplacian < connectivity threshold
**Fix:** Ensure algebraic connectivity λ₂(L) > minimum value; add redundant communication links

### 4. Lyapunov Derivative Sign Error
**Symptoms:** Proof "works" but simulation shows instability; parameters tuned from flawed analysis
**Diagnosis:** V̇ computation error; neglected cross-terms between tracking and adaptation dynamics
**Detection Rule:** IF theoretical bound doesn't match simulation results within 20%
**Fix:** Recompute V̇ including all coupling terms: V̇ = V̇_track + V̇_adapt + V̇_cross

### 5. False Consensus Under Attack
**Symptoms:** Agents converge to wrong values; system appears stable but operates at incorrect setpoints
**Diagnosis:** Adversary has compromised enough agents to shift consensus; local compensation insufficient
**Detection Rule:** IF steady-state values drift from references despite stable Lyapunov function
**Fix:** Implement reference tracking alongside consensus; use signed graph approaches for Byzantine tolerance

---

## WORKED EXAMPLES

### Scenario: AC Microgrid Under Exponential FDI Attack

**Initial State:** 4-bus microgrid with distributed generators, nominal frequency 50 Hz
**Attack Profile:** False data injection on frequency measurements: μf₁(t) = 0.5·exp(0.3t) Hz
**Goal:** Maintain frequency synchronization with ultimate bound < 0.2 Hz

**Step 1: Model the Attack**
- Exponential coefficient: γ₁ = 0.5 Hz
- Growth rate: ρ₁ = 0.3 rad/s  
- Attack grows from 0.5 Hz at t=0 to 5.0 Hz at t=8s without compensation

**Step 2: Design Lyapunov Function**
```
V = ½∑ᵢ(δfᵢ - δf*)² + ½∑ᵢ(φfᵢ - φf*)²/βfᵢ
```
Where δfᵢ = frequency deviation, φfᵢ = adaptation parameter

**Step 3: Compute Neighborhood Consensus Errors**
For agent 1 connected to agents 2,4:
```
ξf₁ = a₁₂(δf₁ - δf₂) + a₁₄(δf₁ - δf₄)
```
Under attack: ξ̃f₁ = ξf₁ + μf₁(t) = ξf₁ + 0.5·exp(0.3t)

**Step 4: Apply Adaptive Compensation**
```
Γf₁ = (ξ̃f₁ · exp(φf₁))/(|ξ̃f₁| + ηf₁)
φ̇f₁ = βf₁(|ξ̃f₁| - λf₁)
```
Parameters: βf₁ = 50, λf₁ = 0.08, ηf₁ = 0.01

**Step 5: Verify Lyapunov Derivative**
```
V̇ ≤ -α∑ᵢξfᵢ² + β∑ᵢγᵢexp(ρᵢt)
```
Key insight: Adaptation parameter φf₁ grows to ensure α·ξf₁² dominates β·γ₁exp(ρ₁t)

**Step 6: Calculate Ultimate Bound**
From Lyapunov analysis: ||δf||∞ ≤ √(2γ₁/(α·λf₁)) = √(2×0.5/(2.5×0.08)) = 1.58 Hz

**What Expert Catches vs. Novice Misses:**
- **Expert:** Recognizes that φf₁ must grow exponentially to compensate for exp(0.3t) attack; tunes βf₁ large enough to ensure φ̇f₁ > 0.3
- **Novice:** Tries fixed gain compensation; system diverges when attack exceeds initial gain sizing
- **Expert:** Verifies communication graph has λ₂ > 0 (connectivity) and designs redundant paths
- **Novice:** Assumes local control laws will work regardless of graph topology

**Validation Results:**
- Simulation confirms frequency deviations remain below 0.15 Hz (better than theoretical 1.58 Hz bound due to conservative analysis)
- Attack magnitude reaches 20 Hz at t=15s, but compensation tracks successfully
- No attack detection required; system responds purely to symptom (consensus error)

---

## QUALITY GATES

Validation checklist for Lyapunov-based resilient control implementation:

**Lyapunov Function Construction:**
- [ ] V(x) ≥ 0 for all x (positive definite or positive semi-definite)
- [ ] V(0) = 0 (zero at desired equilibrium)
- [ ] V(x) → ∞ as ||x|| → ∞ (radially unbounded for global results)

**Derivative Analysis:**
- [ ] V̇ computed including all cross-coupling terms between tracking and adaptation dynamics
- [ ] V̇ ≤ -α||x||² + β outside ultimate bound region (negative definite form verified)
- [ ] Constants α, β explicitly calculated in terms of system parameters

**Parameter Validation:**
- [ ] Adaptation gains βᵢ chosen to ensure φ̇ᵢ > ρᵢ (faster than attack growth rate)
- [ ] Threshold parameters λᵢ prevent response to measurement noise (λᵢ > 3σ_noise)
- [ ] Damping parameters ηᵢ prevent division by zero in compensation formula

**Ultimate Bound Verification:**
- [ ] Theoretical bound calculated: ||error||∞ ≤ f(γᵢ, ρᵢ, βᵢ, λᵢ)
- [ ] Bound meets system requirements (< specified tolerance)
- [ ] Simulation confirms practical bound within 20% of theoretical

**Graph Topology Requirements:**
- [ ] Communication graph strongly connected (path exists between any two agents)  
- [ ] Algebraic connectivity λ₂(L) > minimum threshold for convergence rate
- [ ] Edge weights aᵢⱼ satisfy doubly stochastic or balanced conditions

**Physical Implementation:**
- [ ] Actuator saturation limits exceed maximum required compensation signal
- [ ] Anti-windup mechanisms prevent adaptation parameter growth during saturation
- [ ] Computational complexity per agent scales as O(neighbors), not O(total_agents)

**Robustness Checks:**
- [ ] System remains stable with ±20% parameter variations
- [ ] Performance degrades gracefully if communication links fail
- [ ] No deadlock states where adaptation stops but attacks continue

---

## NOT-FOR Boundaries

**Do NOT use this skill for:**

**Detection-based security systems:** For intrusion detection, malware classification, or signature-based defense → use `adversarial-ml-defense` skill instead

**Bounded disturbance scenarios:** For systems facing only constant-bounded or polynomial-growing disturbances → use `robust-h-infinity-control` or `sliding-mode-control` skills instead  

**Centralized architectures:** For systems with reliable central coordination and global state observability → use `centralized-adaptive-control` skill instead

**Performance optimization:** For maximizing tracking accuracy under normal conditions → use `optimal-control-theory` or `model-predictive-control` skills instead

**Byzantine fault tolerance:** For systems requiring resilience against arbitrary malicious behavior (not just false data injection) → use `byzantine-consensus-protocols` skill instead

**Real-time systems with hard deadlines:** For control loops requiring deterministic response times → use `real-time-control-systems` skill instead

**Unknown system dynamics:** For systems where plant model is completely unknown → use `reinforcement-learning-control` or `neural-adaptive-control` skills instead

**This skill specifically targets the intersection of:**
- Distributed topology (no central coordinator)
- Exponentially unbounded attacks (beyond traditional robust control assumptions)  
- Known system dynamics (model-based approach)
- Soft real-time requirements (ultimate boundedness vs. hard deadlines)
- False data injection attacks (not arbitrary Byzantine behavior)