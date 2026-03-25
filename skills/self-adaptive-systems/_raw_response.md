# Self-Adaptive Systems: Engineering Intelligent Problem-Solving

## BOOK IDENTITY

**Title**: Engineering Self-Adaptive Systems (13603685.pdf)

**Author**: Danny Weyns and colleagues (comprehensive work spanning multiple research groups)

**Core Question**: How do we build software systems that can autonomously manage themselves—adapting their structure and behavior in response to uncertainties in their environment, their own components, and their goals—while providing formal guarantees about their behavior?

**Irreplaceable Contribution**: This book uniquely bridges three traditionally separate fields—software architecture, control theory, and formal methods—into a unified engineering methodology for building systems that adapt themselves. Unlike books that treat adaptation as reactive rule-based logic, this provides mathematical foundations (stability proofs, convergence guarantees, probabilistic verification) while maintaining practical applicability. The progression through "seven waves" of engineering approaches shows the field's evolution from simple feedback loops to sophisticated model-predictive control with machine learning, making it both a historical document and a technical manual. Most importantly, it demonstrates that self-adaptation is not about systems that merely change—it's about **explicit separation between domain concerns (what the system does) and adaptation concerns (how the system manages itself)**, making adaptation reasoning tractable and verifiable.

---

## KEY IDEAS

1. **Self-Adaptation Requires Architectural Separation**: The defining characteristic is not that systems change behavior (many do), but that they maintain explicit separation between the managed system (domain logic) and the managing system (adaptation logic). The managing system implements a feedback loop that monitors the managed system and adjusts it to maintain goals. This separation enables reasoning about adaptation independently from domain functionality, preventing the tangled complexity that emerges when systems try to adapt themselves without this structure.

2. **Adaptation Goals Must Be Machine-Readable and Formal**: Informal goals like "make it fast and cheap" are insufficient. The book demonstrates that adaptation goals must be specified in executable formats—probabilistic temporal logics, fuzzy constraint specifications, utility functions with explicit weights. This formalization enables automatic verification of whether adaptations will achieve goals before enacting them, and provides the foundation for proving stability, settling time, and robustness properties using control theory.

3. **Hierarchical Feedback Loops Scale to Complex Problems**: Single-layer adaptation (react to errors) doesn't scale to systems with hundreds of components. The book shows that sophisticated systems require 2-3 layers: reactive (millisecond timescale, handle individual failures), tactical (minute timescale, learn patterns across executions), and strategic (hour/day timescale, evolve the adaptation strategy itself). Each layer manages the layer below, operating at different time horizons and abstraction levels.

4. **Uncertainty Must Be Tamed, Not Ignored**: The book identifies four sources of uncertainty (system, environment, goals, humans) and shows that self-adaptive systems must explicitly model and manage it—not assume it away. Through probabilistic model checking, statistical verification, and runtime model updating, systems can provide guarantees despite uncertainty. The key insight: systems should track confidence bounds on their models and trigger different adaptation strategies (incremental update vs. full rebuild) based on whether changes are gradual drift or abrupt failures.

5. **Control Theory Provides Automatic Controller Synthesis**: Rather than hand-coding adaptation logic, the book demonstrates "push-button methodology"—automatically constructing controllers from models of system dynamics. By running controlled experiments on the target system and identifying linear models, controllers can be synthesized that provably achieve stability, specified settling time, and disturbance rejection. This removes the expertise bottleneck and provides formal guarantees (via transfer function analysis and pole placement) that are impossible with ad-hoc heuristics.

---

## REFERENCE DOCUMENTS

### FILE: managed-vs-managing-separation.md

```markdown
# The Fundamental Architecture: Managed vs. Managing Systems

## The Core Principle That Changes Everything

Most software systems that "adapt" do so in an ad-hoc way—code scattered throughout the system detects problems and triggers changes. This approach fails at scale because adaptation logic becomes tangled with domain logic, making it impossible to reason about what the system will do under unexpected conditions.

The foundational insight of self-adaptive systems is architectural:

> "A self-adaptive system comprises two distinct parts: the first part interacts with the environment and is responsible for the domain concerns – i.e. the concerns of users for which the system is built; the second part consists of a feedback loop that interacts with the first part (and monitors its environment) and is responsible for the adaptation concerns – i.e. concerns about the domain concerns."

This isn't merely a design pattern—it's a requirement for tractable adaptation. Without this separation, you cannot verify adaptation behavior, cannot evolve adaptation strategies independently of domain logic, and cannot provide formal guarantees.

## Why Most "Adaptive" Systems Aren't Self-Adaptive

The book explicitly contrasts self-adaptive systems with related concepts:

**Autonomous systems** (self-driving cars, drones): Change behavior in response to environment, but lack explicit feedback loops managing their own adaptation. When a self-driving car adjusts speed for road conditions, that's domain logic responding to inputs—not a managing system reasoning about whether the car's adaptation strategy is working.

**Multi-agent systems**: Agents coordinate and make local decisions, but typically don't maintain the managed/managing distinction. Each agent handles both its domain task and its adaptation, making it impossible to reason about adaptation properties independently.

**Self-organizing systems**: Exhibit emergent behavior without explicit goals. The book notes the problem: "unwanted oscillations" because there's no feedback loop verifying that self-organization is achieving intended outcomes.

**Context-aware systems**: React to context changes but don't reason about their own adaptation. A mobile app that adjusts UI for network conditions is context-aware, but it's not self-adaptive unless it has a managing system that monitors whether those adjustments are achieving quality goals.

The distinction that matters: **Does the system have an explicit component that treats adaptation itself as its responsibility, separate from domain functionality?**

## The Four Essential Elements

Every self-adaptive system requires:

### 1. Environment
The external world the system cannot control but must sense and affect. The managed system interacts with the environment through sensors (read state) and effectors (take actions). Critically, the managing system does **not** interact with the environment directly—it observes and manipulates the managed system.

This constraint enforces disciplined reasoning: adaptation logic cannot bypass domain logic to directly manipulate the world. It must work through the managed system's interfaces.

### 2. Managed System
The application software implementing domain functions. But crucially, it must be instrumented for safe adaptation:

> "Safely executing adaptations requires that actions applied to the managed systems do not interfere with the regular system activity."

This leads to the concept of **quiescence**: states where no activity is ongoing, so changes can be applied safely. The managed system needs:

- **Probes**: Expose internal state for monitoring (without affecting normal operation)
- **Effectors**: Accept adaptation commands (but only when safe to apply)
- **Quiescence mechanisms**: Ensure consistency before/after changes
- **State checkpoint/restore**: For adaptations that require pausing execution

Example from the book: The OSGi framework for Java components provides quiescence—components can be stopped, updated, and restarted without corrupting the application state. Messages queued during adaptation are preserved and processed after the swap completes.

This infrastructure requirement is often overlooked. You can't just add a control loop to existing software—the software must be built to support safe runtime modification.

### 3. Adaptation Goals
Machine-readable specifications of quality properties. The book is emphatic that informal goals are insufficient:

> "Adaptation goals can be specified as quality requirements of the managed system, such as reliability, performance, security, cost, or interoperability. Such goals need to be specified in a format that can be used by the managing system at runtime to derive appropriate adaptation decisions."

Examples of proper formalization:

- **Probabilistic temporal logic**: `P(packet_loss ≤ 10%) ≥ 0.95 over 12-hour windows`
- **Utility functions**: `U = 0.7·reliability + 0.3·(1 - normalized_cost)`
- **Fuzzy constraints**: `Temperature should be CLOSE_TO 70°F with tolerance ±3°F`
- **Control objectives**: `Maintain queue_depth between 10-50 with settling time < 5 seconds`

The format determines what analysis techniques apply. Probabilistic specifications enable model checking; utility functions enable optimization; control objectives enable stability analysis.

### 4. Feedback Loop (Managing System)
The component that monitors the managed system and enacts adaptations to maintain goals. The book shows this typically follows the MAPE-K pattern:

**Monitor**: Collects data via probes, maintains runtime models of system state
**Analyze**: Compares current state against goals, identifies need for adaptation  
**Plan**: Determines which adaptation actions to take (may involve verification)
**Execute**: Applies adaptations via effectors, ensuring quiescence
**Knowledge**: Shared runtime models used by all MAPE components

But the feedback loop can have richer structure:

> "The managing system may have a layered structure, where each layer conceptually consists of a feedback loop with its own goals. In this case, each layer manages the layer beneath."

## The Power of Layered Feedback Loops

The most sophisticated self-adaptive systems use hierarchical managing systems, not flat feedback loops. The health assistance system example demonstrates this:

**Bottom Layer (Reactive)**:
- **Goal**: Keep service failure rate below threshold
- **Timescale**: Seconds to minutes
- **Mechanism**: Swap to alternative service instance when failure detected
- **Knowledge**: Current failure rates, available service instances

**Top Layer (Proactive)**:
- **Goal**: Minimize long-term cost while maintaining reliability
- **Timescale**: Hours to days  
- **Mechanism**: Analyze patterns (e.g., "Service X fails more often 3pm-5pm"), instruct bottom layer to avoid those services during those times
- **Knowledge**: Historical failure patterns, cost trends, seasonal effects

The bottom layer handles immediate failures; the top layer learns patterns and optimizes strategy. Crucially, the top layer doesn't directly adapt the managed system—it adapts the bottom layer's policy.

This is a profound design pattern: **adaptation of adaptation**. The top layer treats the bottom layer's adaptation strategy as the "managed system" and adjusts its goals/parameters.

## The DeltaIoT Case Study: Architecture in Action

The IoT building security system (DeltaIoT) illustrates these principles with concrete numbers:

**Managed System**:
- 20 wireless sensor motes + 1 gateway
- Motes time-synchronized, 8 communication slots per cycle
- Each mote has: transmission power (3 settings), distribution factor (how packets route)
- Domain function: Collect sensor data, forward to gateway, raise alarms

**Environment**:
- Wireless interference (varies unpredictably)
- Sensor event rates (fire alarms, motion detection—stochastic)
- Physical conditions (temperature, humidity affecting signal)

**Adaptation Goals**:
1. Packet loss ≤ 10% (reliability constraint)
2. Latency ≤ 5 seconds for emergency packets (safety constraint)
3. Minimize energy consumption (optimization goal)

**Managing System Structure**:

**Layer 1: Component Control**
- Monitors: Packet loss rate per mote, buffer occupancy, energy consumption
- Adaptations: Adjust transmission power (affects both reliability and energy), adjust distribution factors (how packets route through network)
- Strategy: When packet loss > 10%, increase transmission power for affected motes

**Layer 2: Change Management**
- Monitors: Aggregate packet loss, total energy, latency distribution
- Adaptations: Apply parameterized plans (e.g., "Increase power for motes [3,7,9] and adjust distribution to route through mote [5]")
- Strategy: If Component Control can't meet goals with local changes, Change Management selects from pre-computed configurations

**Layer 3: Goal Management** 
- Monitors: Whether Change Management is repeatedly failing to meet goals, whether new patterns emerge (e.g., mote [9] always fails at certain times)
- Adaptations: Generate new plans (compute new routing topologies, adjust goal priorities if conflicting)
- Strategy: If no plan satisfies goals, decide whether to relax goals or escalate to operator

**Critical observations**:

1. **Separation enables verification**: Layer 2 uses formal models (Markov chains for packet transmission probabilities, queuing models for latency) to verify each configuration **before** applying it. This is only possible because the managed system is cleanly separated.

2. **Layers operate at different time scales**: Component Control reacts in seconds; Change Management plans in minutes; Goal Management evolves strategy over hours. This prevents oscillation (rapid changes canceling each other) and enables both reactive speed and strategic learning.

3. **Quiescence is enforced**: Motes have explicit synchronization—adaptations are applied only at cycle boundaries when buffers are empty. This prevents packet loss during reconfiguration.

4. **Knowledge models are explicit**: The managing system maintains formal models (not just logs):
   - **System model**: Mote topology, current power/distribution settings
   - **Environment model**: Probability distributions for interference, traffic patterns  
   - **Quality model**: Mathematical relationships (e.g., packet loss as function of SNR)
   - **Adaptation model**: Available actions and their predicted effects

## Handling Human Stakeholders

The architecture doesn't eliminate humans—it defines their role precisely:

> "If no configuration can be found that complies with the adaptation goals within a given time (fail-safe operating mode), the managing system may involve a stakeholder to decide on the adaptation action to take."

This is **conditional autonomy**: the system operates autonomously within its capability envelope, but escalates when it reaches the boundary of known-good adaptations.

The health system example shows this: if the managing system cannot find a service composition meeting the failure rate goal within the decision time window (e.g., 5 seconds), it:

1. Notifies the operator via support interface
2. Provides diagnostic information: "All available Drug Services have failure rates > threshold"
3. Offers options: "Add new service provider" or "Relax failure rate goal to 2%"
4. Waits for human decision (fail-safe mode: continues with best-available configuration)

This prevents the system from making unsafe adaptations while avoiding the brittleness of systems that require human intervention for every decision.

## Evolution of the Managing System Itself

A subtle but critical point:

> "The managing system can be subject to change itself... to update a feedback loop to resolve a problem or a bug... and to support changing adaptation goals."

The managing system is software—it has bugs, needs updates, must evolve as requirements change. The architecture must support this:

**Adding a new adaptation goal** (e.g., "Maintain average response time < 500ms"):
- Requires: New monitor probes, extended quality model, updated analysis logic, potentially new adaptation actions
- Impact: More invasive than updating the managed system—may require taking the managing system offline briefly
- Mitigation: Version the managing system, use blue-green deployment for updates

**Updating an adaptation strategy** (e.g., "Use a different model checker"):
- Requires: Swap the Analyzer component, ensure interface compatibility
- Impact: If MAPE components are modular (share knowledge models), this can be done without touching Monitor/Planner/Executor
- Mitigation: Use plugin architectures, abstract interfaces for analysis engines

**Fixing bugs in adaptation logic**:
- Requires: Same update mechanisms as managed system
- Impact: Potentially catastrophic—a bug in the managing system could cause cascading adaptations
- Mitigation: The managing system itself needs testing, ideally via simulation with historical data

The book notes that evolution of the managing system is a harder problem than evolution of the managed system, because the managing system is the "immune system"—if it malfunctions, the entire system's self-protection is compromised.

## Distribution and Decentralization Are Orthogonal

A critical but often confused distinction:

> "The conceptual model for self-adaptive systems abstracts away from distribution... and abstracts away from how adaptation decisions in a self-adaptive system are made and potentially coordinated among different components."

**Distribution**: Physical deployment across multiple nodes  
**Decentralization**: Locus of decision-making authority

These are independent:

| Configuration | Example |
|--------------|---------|
| Centralized, Non-Distributed | Single managing system on one node, managed system on same node |
| Centralized, Distributed | Single managing system on one node, managed system spread across multiple nodes (e.g., microservices) |
| Decentralized, Non-Distributed | Multiple managing systems on same node, each managing different aspects of local system |
| Decentralized, Distributed | Multiple managing systems on different nodes, coordinating to manage distributed system |

The book emphasizes:

> "In a concrete setting... the degree of decentralization of the decision making of adaptation will have a deep impact on how such self-adaptive systems are engineered."

**Centralized adaptation**:
- Pros: Easier to reason about consistency, avoid conflicting adaptations, verify global properties
- Cons: Single point of failure, scalability bottleneck, requires global knowledge

**Decentralized adaptation**:
- Pros: Scales better, no single point of failure, can leverage local knowledge
- Cons: Risk of oscillations (agents' adaptations interfere), harder to provide global guarantees, requires coordination protocols

The DeltaIoT example with two gateways shows hybrid approach: each gateway has its own managing system for its local motes, but gateways coordinate to avoid conflicting adaptations (e.g., both trying to route through the same intermediate mote).

## Design Principles for Complex Agent Systems

Translating these architectural insights to multi-agent systems with 180+ components:

### 1. Enforce Explicit Separation
**Don't**: Have agents that execute tasks and also monitor themselves and decide when to adapt
**Do**: Create a two-tier architecture:
- **Agent tier** (managed system): Executes domain logic, exposes probes (success/failure, latency, cost), accepts effectors (restart, adjust parameters)
- **Orchestration tier** (managing system): Monitors agent execution, maintains models of agent reliability/cost/latency, selects which agents to invoke for each task

### 2. Design for Quiescence
**Don't**: Allow orchestration to swap agents mid-execution without coordination
**Do**: Define quiescence for agent contexts:
- Stateless agents: Can be swapped immediately (no in-flight state)
- Stateful agents: Must checkpoint state before swap, restore after
- Transactional agents: Must complete or rollback current transaction before swap
- Document quiescence requirements explicitly per agent

### 3. Use Layered Managing Systems
**Don't**: Have a single orchestration loop trying to handle immediate failures, learn patterns, and evolve strategies
**Do**: Three-layer managing system:
- **Layer 1 (Reactive)**: Individual agent failures → retry or swap to alternative (millisecond decisions)
- **Layer 2 (Tactical)**: Patterns across 100s of executions → update agent selection heuristics (minute decisions)
- **Layer 3 (Strategic)**: System-wide trends → deprecate poor agents, acquire new capabilities (hour/day decisions)

### 4. Maintain Runtime Models as First-Class Artifacts
**Don't**: Log events and run analytics offline to decide adaptations
**Do**: Maintain executable models in the Knowledge component:
- **Agent catalog**: Capabilities, preconditions, effects (formal specifications)
- **Execution history**: Success rates, latency distributions, cost per agent (statistical models)
- **Composition patterns**: Which agent combinations work well (association rules, probabilistic graphical models)
- Make these models queryable and updatable by the managing system in real-time

### 5. Plan for Managing System Evolution
**Don't**: Assume the orchestration strategy is static
**Do**: Treat the managing system as evolvable software:
- Version adaptation goals (support multiple versions concurrently for testing)
- Support hot-swapping of analysis/planning algorithms (plugin architecture)
- Maintain history of which adaptations worked (for debugging managing system bugs)
- Have escalation paths when managing system reaches limits ("I've tried all known strategies; need human input")

## The Irreplaceable Insight

Many systems adapt—load balancers shift traffic, caches evict entries, schedulers reorder tasks. What makes self-adaptive systems different is the **architectural commitment to separation** that enables:

1. **Reasoning about adaptation independently from domain logic**: You can verify adaptation properties (stability, convergence) without understanding business logic details
2. **Evolution of adaptation strategies without touching domain code**: Add new analysis techniques, update models, change decision algorithms—all without redeploying agents
3. **Formal guarantees**: Prove that adaptation will converge to goals within bounded time, with bounded overshoot, despite bounded disturbances
4. **Explicit handling of uncertainty**: Model what you don't know, track confidence, trigger different strategies based on confidence levels
5. **Graceful human re-engagement**: Escalate precisely when automation reaches its limits, with diagnostic context

This is what makes the architectural separation non-negotiable. Without it, you have adaptive software. With it, you have an engineered self-adaptive system with provable properties.
```

### FILE: formal-adaptation-goals.md

```markdown
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
```

### FILE: hierarchical-feedback-loops.md

```markdown
# Hierarchical Feedback Loops: Scaling Self-Adaptation to Complex Systems

## The Fundamental Limitation of Single-Layer Adaptation

A simple feedback loop works well for single-goal systems with predictable disturbances:

```
Monitor → Detect error → Apply corrective action → Monitor again
```

Example: A thermostat maintaining room temperature at 70°F. When temperature drops to 68°F, turn on heater; when it rises to 72°F, turn off heater. This is a single-variable, single-goal, reactive control loop.

But complex systems have properties that break this simple pattern:

1. **Multiple conflicting goals**: Minimize latency AND minimize cost AND maximize reliability
2. **Multiple time scales**: React to immediate failures (seconds) vs. learn long-term patterns (hours)
3. **Multiple abstraction levels**: Low-level component failures vs. high-level architectural reconfigurations
4. **Uncertainty at different scales**: Noise in sensors (high frequency) vs. drift in models (low frequency)

The book demonstrates that these problems require **hierarchical feedback loops**, not flat single-layer adaptation. The key insight:

> "The managing system may have a layered structure, where each layer conceptually consists of a feedback loop with its own goals. In this case, each layer manages the layer beneath."

## The Three-Layer Reference Architecture

The book presents a canonical three-layer model (generalizable to more layers if needed):

### Layer 1: Component Control
**Responsibility**: Manage individual components of the managed system  
**Time scale**: Milliseconds to seconds  
**Knowledge**: Local state (component health, resource usage)  
**Decisions**: Reactive (restart failed component, adjust parameters)  
**Example**: When a service instance fails, restart it or route to backup instance

### Layer 2: Change Management
**Responsibility**: Coordinate adaptations across components using predefined plans  
**Time scale**: Seconds to minutes  
**Knowledge**: System-wide state, available adaptation plans  
**Decisions**: Proactive (select and execute plans based on current conditions)  
**Example**: When multiple services are failing, apply a pre-computed configuration that routes around them

### Layer 3: Goal Management
**Responsibility**: Synthesize new plans when existing ones don't work; evolve adaptation strategy  
**Time scale**: Minutes to hours  
**Knowledge**: Historical patterns, goal specifications, constraint models  
**Decisions**: Strategic (generate new plans, adjust goals, escalate to humans if needed)  
**Example**: If packet loss remains high despite trying all known configurations, generate a new routing topology or relax the packet loss goal

### The Critical Relationship

Each layer **adapts the layer beneath it**:
- Layer 1 adapts the **managed system** (changes component configurations)
- Layer 2 adapts the **adaptation strategy of Layer 1** (changes which plans Layer 1 should apply)
- Layer 3 adapts the **adaptation strategy of Layer 2** (generates new plans, adjusts goal priorities)

This is not just modularity—it's **adaptation of adaptation**. Layer 2 doesn't directly manipulate the managed system; it tells Layer 1 what to do. Layer 3 doesn't directly manipulate the managed system or Layer 1; it tells Layer 2 what strategies to use.

## Case Study 1: Health Assistance System (Two Layers)

### Context
- Patients wear devices with sensors (vital signs, panic button)
- Medical service analyzes data → routes to Drug Service or Alarm Service
- Multiple service instances available (varying reliability, cost, failure rates)
- Goals: Failure rate < 14%, minimize cost

### Layer 1: Reactive Service Selection
**MAPE loop at Layer 1**:

**Monitor**: Track each service instance's failure rate, response time, cost
- Medical Service instances: MS1 (failure rate 8%), MS2 (12%), MS3 (5%)
- Alarm Service instances: AS1 (6%), AS2 (3%)
- Drug Service instances: DS1 (4%), DS2 (9%), DS3 (2%)

**Analyze**: When a service invocation fails, check: "Is current configuration still meeting goals?"
- Current: MS2 + AS1 + DS1
- Recent failure rate: 11% (below 14% threshold) ✓
- Cost: $21/hour ✓
- Decision: No action needed (failure was transient)

**Plan**: If failure rate exceeds 14%, select alternative service instance
- Rule: "If MS2 failure rate > 10%, switch to MS1 or MS3"

**Execute**: Update routing table to direct requests to new service instance

**Time scale**: Decisions made every 10 seconds based on sliding window of last 100 invocations

### Layer 2: Proactive Pattern Learning
**MAPE loop at Layer 2**:

**Monitor**: Track patterns across hours/days
- MS2 failure rate: 8am-12pm: 9%, 3pm-5pm: 18%, 6pm-midnight: 7%
- AS1 failure rate: mostly stable around 6%
- DS3 failure rate: increases on weekends (hardware maintenance?)

**Analyze**: "MS2 is unreliable during 3pm-5pm window. Layer 1's reactive strategy will keep swapping between MS2 and alternatives during this window, causing oscillation."

**Plan**: "Instruct Layer 1 to avoid MS2 during 3pm-5pm, even if its current failure rate looks acceptable."

**Execute**: Update Layer 1's rules:
```
Default: Use MS2 (lowest cost)
Exception: 3pm-5pm daily → Use MS3 (more expensive but reliable during this window)
```

**Time scale**: Decisions made every 4 hours based on analysis of last week's data

### Why Two Layers Matter

**Without Layer 2** (only reactive Layer 1):
```
3:00pm: MS2 fails → Layer 1 switches to MS3
3:15pm: MS3 fails (random) → Layer 1 switches to MS1
3:30pm: MS1 slower → Layer 1 switches back to MS2
3:45pm: MS2 fails again → Layer 1 switches to MS3
... (oscillation continues)
```

**With Layer 2** (proactive pattern recognition):
```
2:55pm: Layer 2 instructs Layer 1: "For next 2 hours, prefer MS3"
3:00pm-5:00pm: Layer 1 consistently uses MS3 (no oscillation)
5:05pm: Layer 2 instructs Layer 1: "Resume default strategy (MS2)"
```

The system achieves **both** reactive speed (Layer 1 handles transient failures immediately) **and** strategic learning (Layer 2 prevents known problem patterns).

## Case Study 2: DeltaIoT (Three Layers)

### Context
- 20 wireless sensor motes + 1 gateway in a building security system
- Motes forward sensor data through multi-hop network
- Goals: Packet loss ≤ 10%, latency ≤ 5s for emergency packets, minimize energy
- Uncertainties: Wireless interference varies unpredictably, sensor event rates stochastic

### Layer 1: Component Control (Per-Mote Adaptation)
**Responsibility**: Each mote monitors its local conditions and adapts transmission power/routing

**MAPE loop**:
- **Monitor**: Buffer occupancy, successful/failed transmissions, signal strength (SNR)
- **Analyze**: "My buffer is >80% full → risk of packet loss"
- **Plan**: "Increase transmission power to improve delivery rate"
- **Execute**: Adjust power setting from Low (0.7mW) to Medium (3.5mW)

**Key properties**:
- Local knowledge only (mote doesn't know global topology)
- Fast reaction (milliseconds)
- Simple rules (threshold-based)
- Limited scope (can't optimize network-wide energy)

### Layer 2: Change Management (Network-Level Coordination)
**Responsibility**: Coordinate adaptations across motes using pre-computed configurations

**MAPE loop**:
- **Monitor**: Aggregate packet loss across all motes, total energy consumption, latency distribution
  - Current: Packet loss = 12% (exceeds 10% goal)
  - Energy: 15J/cycle (within budget of 20J/cycle)
  - Latency: P99 = 3.2s (within 5s goal)

- **Analyze**: "Packet loss goal violated. Layer 1's local adaptations (individual motes increasing power) are not sufficient. Need network-wide reconfiguration."

- **Plan**: Retrieve pre-computed configuration #5 from a library of 12 verified configurations
  - Configuration #5: "Increase power for motes [3, 7, 9], adjust distribution factors to route more traffic through mote [5] (which has better link quality)"
  - This configuration was pre-verified using Markov models: Expected packet loss = 8%, energy = 18J/cycle ✓

- **Execute**: Send adaptation commands to Layer 1 controllers of motes [3, 7, 9, 5]
  - Mote [3]: Set power = High, distribution = [0.4, 0.3, 0.3]
  - Mote [7]: Set power = High, distribution = [0.5, 0.2, 0.3]
  - Mote [9]: Set power = Medium, distribution = [0.3, 0.5, 0.2]
  - Mote [5]: Increase buffer size to handle additional traffic

**Key properties**:
- Global knowledge (sees entire network state)
- Moderate reaction time (seconds to minutes)
- Uses formal models (configurations pre-verified for safety)
- Constrained to library of known plans (can't generate novel ones)

**Time scale**: Decisions made every 30 seconds based on sliding window of last 5 minutes

### Layer 3: Goal Management (Strategic Synthesis)
**Responsibility**: When Layer 2 exhausts its library of plans, generate new plans or adjust goals

**Scenario triggering Layer 3**:
```
Time: 10:45am
Layer 2 observes: Mote [9] has failed (hardware fault)
Layer 2 attempts: Try all 12 pre-computed configurations
Result: None satisfy packet loss ≤ 10% goal (all configurations routed traffic through mote [9])
Layer 2 escalates to Layer 3: "Cannot meet goals with available configurations. Mote [9] unavailable."
```

**MAPE loop at Layer 3**:

**Monitor**: 
- Topology changes (mote [9] failed)
- Historical patterns (mote [9] has failed 3 times in past month)
- Constraint violations (no valid configuration exists)

**Analyze**: 
"Topology has fundamentally changed. Pre-computed configurations assumed mote [9] available. Need to synthesize new routing topology avoiding mote [9]."

"Additionally, mote [9] is unreliable (frequent failures). Should we permanently remove it from consideration?"

**Plan** (two strategies):

**Strategy A** (short-term): Generate new configuration for current topology (without mote [9])
- Use constraint solver or search algorithm to find routing topology
- Constraints: Packet loss ≤ 10%, energy ≤ 20J/cycle, latency ≤ 5s, mote [9] not used
- Search space: Different power settings × distribution factors × routes
- Solution found: Configuration #13
  - Route traffic from mote [9]'s neighbors through motes [6] and [11] instead
  - Increase power on motes [6, 11] to handle extra load
  - Expected packet loss: 9.5%, energy: 19J/cycle ✓

**Strategy B** (long-term): Update Layer 2's configuration library to deprecate mote [9]
- Mark mote [9] as "unreliable"
- Recompute all 12 configurations with mote [9] excluded
- Replace Layer 2's library with updated configurations
- Monitor: If mote [9] comes back online and remains stable for 1 week, re-include it

**Execute**:
- Send Configuration #13 to Layer 2 (immediate relief)
- Trigger recomputation of configuration library (background task, takes 10 minutes)
- After recomputation, update Layer 2's knowledge base
- Log: "Mote [9] deprecated due to repeated failures. System reconfigured."

**Key properties**:
- Strategic reasoning (considers long-term patterns, not just immediate state)
- Slow reaction time (minutes to hours)
- Generates novel plans (not constrained to pre-computed library)
- Evolves the system (changes Layer 2's adaptation strategy)

**Time scale**: Invoked reactively when Layer 2 fails + proactively every 24 hours to analyze trends

### Why Three Layers Matter

**If only Layer 1 existed**:
- Motes would independently increase power → energy exceeds budget
- No coordination → oscillations (motes interfere with each other's adaptations)
- No network-wide optimization → suboptimal packet loss

**If only Layer 1 and Layer 2 existed**:
- System works well for known failure modes (pre-computed configurations handle them)
- **But fails catastrophically** when novel failure (mote [9] dies) exceeds library coverage
- Operator must manually compute new configuration and update the system (slow, error-prone)

**With all three layers**:
- Layer 1: Fast local reactions (buffer management, power adjustments)
- Layer 2: Coordinated adaptations (network-wide configurations)
- Layer 3: Strategic evolution (generate new plans, deprecate unreliable components)

The system handles **both** routine adaptations (Layer 1, 2) **and** novel situations (Layer 3) without human intervention—until Layer 3 itself exhausts its strategies and escalates.

## The Time-Scale Separation Principle

A critical design principle emerges from both case studies:

> Each layer operates at a different time scale, and faster layers must stabilize before slower layers intervene.

### Why Time-Scale Separation Matters

**Without separation** (all layers react at the same speed):
```
t=0s: Transient spike in packet loss (13%)
t=0s: Layer 1 increases power (local reaction)
t=0s: Layer 2 applies new configuration (network-wide change)
t=0s: Layer 3 starts recomputing topology (strategic synthesis)

t=5s: Layer 1's power increase worked → packet loss now 9% ✓
      But Layer 2's configuration change is mid-execution
      And Layer 3's new topology arrives, overriding Layer 2
      
Result: Oscillation, wasted computation, instability
```

**With time-scale separation**:
```
t=0s: Transient spike in packet loss (13%)
t=0s: Layer 1 increases power (local reaction)
[Layer 2 waits: "Let Layer 1 try first; check again in 30s"]
[Layer 3 waits: "Let Layer 2 try first; check again in 5 minutes"]

t=5s: Layer 1's power increase worked → packet loss now 9% ✓
t=30s: Layer 2 checks: "Packet loss stable at 9%. No action needed."
t=5min: Layer 3 checks: "No escalations from Layer 2. No action needed."

Result: Efficient, stable, minimal disruption
```

### Formal Time-Scale Constraints

The book implies (though doesn't state explicitly) these design rules:

**Rule 1**: Each layer's reaction time must be at least 10× slower than the layer below
- Layer 1: 0-10 seconds
- Layer 2: 10 seconds - 10 minutes  
- Layer 3: 10 minutes - hours

**Rule 2**: Each layer must observe the layer below for a full cycle before intervening
- Layer 2 waits for Layer 1 to complete at least one full MAPE cycle (Monitor → Analyze → Plan → Execute → Monitor again) before concluding "Layer 1 can't handle this."

**Rule 3**: Faster layers have priority for action
- If Layer 1 and Layer 2 both want to adapt, Layer 1 goes first
- Layer 2 only acts if Layer 1 has tried and failed

These rules prevent oscillations and ensure the system tries the least disruptive adaptation first.

## Coordination Mechanisms Between Layers

How do layers communicate? The book presents three patterns:

### 1. Escalation (Bottom-Up)
Lower layer signals to upper layer: "I can't handle this situation."

**Example from DeltaIoT**:
```
Layer 2 → Layer 3: 
  "No configuration in my library satisfies goals. 
   Topology changed: Mote [9] unavailable.
   Request: Generate new configuration."
```

**Information passed**:
- Current state (topology, resource usage, goal violations)
- What was tried (list of configurations that failed)
- Why it failed (mote [9] missing)

Layer 3 uses this context to synthesize a solution.

### 2. Delegation (Top-Down)
Upper layer instructs lower layer: "Use this strategy."

**Example from Health System**:
```
Layer 2 → Layer 1:
  "For next 2 hours (3pm-5pm):
   - Do not use Medical Service MS2 (unreliable during this window)
   - Prefer MS3 despite higher cost
   - If MS3 fails, use MS1 (not MS2)"
```

**Information passed**:
- Policy updates (which services to prefer/avoid)
- Validity period (when the policy expires)
- Fallback rules (what to do if preferred option fails)

Layer 1 follows these instructions without knowing why they were chosen.

### 3. Shared Knowledge (Peer-to-Peer)
Layers read/write to a shared knowledge base (the "K" in MAPE-K).

**Example**:
```
Knowledge Base:
  - Current topology (Layer 1 writes, Layer 2 reads)
  - Historical failure patterns (Layer 1 writes, Layer 3 reads)
  - Configuration library (Layer 3 writes, Layer 2 reads)
  - Goal specifications (Layer 3 writes, Layer 2 reads)
```

This enables **decoupling**: layers don't need direct communication; they coordinate through shared models.

## Extending Beyond Three Layers

The three-layer model is a reference architecture, not a hard limit. Complex systems may need more:

### Four-Layer Example: Autonomous Vehicle Fleet

**Layer 1: Vehicle Control**
- Time scale: Milliseconds
- Responsibility: Steering, braking, acceleration
- Example: "Obstacle detected → apply brakes"

**Layer 2: Route Management**
- Time scale: Seconds
- Responsibility: Navigate to destination, avoid traffic
- Example: "Road blocked → reroute via alternate path"

**Layer 3: Fleet Optimization**
- Time scale: Minutes
- Responsibility: Coordinate multiple vehicles, minimize total travel time
- Example: "Traffic surge detected → adjust pickup assignments across fleet"

**Layer 4: Business Strategy**
- Time scale: Hours/Days
- Responsibility: Evolve fleet composition, pricing, service areas
- Example: "High demand in neighborhood X → deploy 2 more vehicles there"

Each layer adapts the layer beneath, operates at a different time scale, and reasons at a different abstraction level.

### Five-Layer Example: Data Center Management

**Layer 1: Process Control** (milliseconds)
- Restart crashed processes, adjust thread pools

**Layer 2: Node Management** (seconds)
- Migrate VMs, adjust resource allocations

**Layer 3: Cluster Management** (minutes)
- Rebalance load across nodes, scale services

**Layer 4: Infrastructure Management** (hours)
- Provision/deprovision nodes, optimize hardware placement

**Layer 5: Business Optimization** (days)
- Negotiate contracts, optimize multi-datacenter placement

## Design Principles for Multi-Layer Systems

### Principle 1: Each Layer Has Its Own MAPE-K Loop
Don't share Monitor/Analyze/Plan/Execute components across layers. Each layer needs:
- Independent monitoring (different metrics, different time scales)
- Independent analysis (different models, different thresholds)
- Independent planning (different action spaces, different verification)
- Independent execution (different actuators, different quiescence requirements)

Shared component = tight coupling = inability to evolve layers independently.

### Principle 2: Minimize Cross-Layer Communication
Layers should coordinate through **shared knowledge models**, not direct messages.

**Anti-pattern**:
```
Layer 1 sends message to Layer 2: "Mote [3] failed"
Layer 2 sends message to Layer 1: "Try configuration #7"
Layer 1 sends message to Layer 2: "Configuration #7 applied"
```

This creates tight coupling and introduces latency.

**Better pattern**:
```
Knowledge Base: { mote_status: { 3: "failed" } }
Layer 1 writes: mote_status[3] = "failed"
Layer 2 reads: if mote_status[3] == "failed" → update configuration
Layer 2 writes: active_configuration = 7
Layer 1 reads: if active_configuration changed → apply it
```

This enables asynchronous coordination and loose coupling.

### Principle 3: Higher Layers Evolve Lower Layers' Adaptation Logic
Layer N+1 should not just invoke Layer N—it should **configure** Layer N.

**Example**:
```
Layer 2 doesn't just say: "Apply configuration #7"
Layer 2 says: "Update your rule base:
  - Add rule: If packet_loss > 10% → prefer high-power motes
  - Remove rule: If energy > 18J → reduce power (obsolete)
  - Adjust threshold: increase buffer warning from 70% to 80%"
```

This makes Layer N+1's knowledge durable—it persists even after Layer N+1 stops monitoring.

### Principle 4: Explicit Escalation Conditions
Each layer must have formal criteria for when to escalate to the layer above.

**Example from DeltaIoT**:
```
Layer 2 escalates to Layer 3 if:
  - All configurations tried and none satisfy goals
  - Topology change detected (new mote added, mote failed)
  - Goal violation persists for > 10 minutes
```

This prevents premature escalation (wasting Layer 3's computational resources) and delayed escalation (prolonging goal violations).

### Principle 5: Lower Layers Are Transparent to Upper Layers
Layer N+1 should not need to understand Layer N's internal implementation.

**Interface between Layer 2 and Layer 1** (DeltaIoT):
```
Layer 2 sees:
  - Abstract state: { packet_loss: 0.12, energy: 15, latency: 3.2 }
  - Abstract actions: { apply_configuration(id) }
  
Layer 2 does NOT see:
  - How Layer 1 implements configurations (which motes, which parameters)
  - Layer 1's internal reasoning (why a particular action was chosen)
```

This enables **evolution**: Layer 1's implementation can change (e.g., switch from rule-based to RL-based) without affecting Layer 2.

## Application to Agent Systems with 180+ Components

For a system like WinDAGs with 180+ heterogeneous agents:

### Proposed Four-Layer Architecture

**Layer 1: Agent Execution Control** (milliseconds)
- **Responsibility**: Monitor individual agent health, restart failed agents
- **Knowledge**: Agent process state, resource usage (CPU, memory)
- **Adaptations**: Restart agent, adjust agent parameters (timeout, retry count)
- **Example**: "Agent A7 crashed → restart with increased memory allocation"

**Layer 2: Task-Level Orchestration** (seconds)
- **Responsibility**: Select which agents to invoke for a given task, handle agent failures during task execution
- **Knowledge**: Agent capabilities, current task requirements, agent success rates
- **Adaptations**: Swap agent for alternative, retry with different parameters, decompose task differently
- **Example**: "Task T requires 'text extraction'; agent A7 failed → try agent A23 (alternative text extractor)"

**Layer 3: Strategy Optimization** (minutes)
- **Responsibility**: Learn which agent compositions work well for which task types, update selection heuristics
- **Knowledge**: Historical task execution data, agent performance trends, correlation between task features and success rates
- **Adaptations**: Update Layer 2's agent ranking, deprecate unreliable agents, acquire new agents
- **Example**: "Over 100 executions, tasks with feature X succeed 20% more when using agents [A7, A12] vs. [A7, A23] → update Layer 2's ranking"

**Layer 4: Portfolio Management** (hours/days)
- **Responsibility**: Evolve the agent portfolio (add/remove agents), negotiate SLAs, optimize cost/performance tradeoffs
- **Knowledge**: Business metrics (cost per task, SLA compliance), market conditions (new agent providers)
- **Adaptations**: Provision new agent types, retire obsolete agents, renegotiate contracts
- **Example**: "Agent A7 has been deprecated by 5 other systems → evaluate replacement candidates, transition traffic to A39"

### Concrete Example Scenario

**Scenario**: A complex document processing task arrives that requires 12 agent invocations.

**Time t=0s: Task Arrives**
```
Task: Extract text from PDF → Classify document → Extract entities → Generate summary
Required agent types: PDF parser, classifier, NER, summarizer
```

**Layer 2 (Task-Level Orchestration) takes action**:
```
Plan: 
  1. A7 (PDF parser) → 2. A23 (classifier) → 3. A45 (NER) → 4. A67 (summarizer)
Expected latency: 2.3s, Expected cost: $0.15, Expected success: 94%
```

**Time t=0.5s: Agent A7 Fails**
```
Layer 1 (Agent Execution Control) detects crash, restarts A7
Layer 1 reports to Layer 2: "A7 restarted, retry same task? Or use alternative?"
```

**Layer 2 decision**:
```
Layer 2 checks: "A7 has failed 3 times today on this task type. Don't retry—use alternative."
Layer 2 replans:
  1. A39 (alternative PDF parser) → 2. A23 (classifier) → 3. A45 (NER) → 4. A67 (summarizer)
Expected latency: 2.8s (+0.5s), Expected cost: $0.18 (+$0.03), Expected success: 92% (-2%)
```

**Time t=3.0s: Task Completes Successfully**
```
Layer 2 logs: "Task succeeded using A39 (alternative) after A7 failure."
```

**Time t=1 hour: Layer 3 (Strategy Optimization) Analyzes**
```
Layer 3 observes: Over last 100 tasks, A7 has failed on 18% of PDF-to-text tasks (up from 5% last week)
Layer 3 hypothesizes: "A7's model has degraded (possibly due to version update by provider)"
Layer 3 decision: "Demote A7 in ranking for PDF-to-text tasks. Promote A39 (alternative) to primary."
Layer 3 updates Layer 2's knowledge base:
  - PDF_parser_primary = A39 (was A7)
  - PDF_parser_fallback = A7 (was A39)
```

**Time t=24 hours: Layer 4 (Portfolio Management) Analyzes**
```
Layer 4 observes: A7 has been demoted; cost increased by $0.03/task (A39 more expensive)
Layer 4 decision: "Total cost increase = $0.03 × 10,000 tasks/day = $300/day. Acceptable? Check SLA budget."
If budget exceeded:
  Layer 4 investigates: "Is A7's provider aware of degradation? Can we negotiate reduced price for A39?"
  Layer 4 may: "Terminate contract with A7 provider, fully migrate to A39"
```

### Key Observations

1. **Each layer operated at its appropriate time scale**: Layer 1 (0.5s), Layer 2 (immediately after failure), Layer 3 (1 hour), Layer 4 (24 hours)

2. **Each layer adapted a different aspect**: Layer 1 (agent process), Layer 2 (task plan), Layer 3 (selection heuristics), Layer 4 (portfolio composition)

3. **Lower layers enabled upper layers**: Layer 1's quick restart prevented immediate task failure; Layer 2's alternative selection bought time for Layer 3 to analyze trends; Layer 3's demotion provided data for Layer 4's business decision

4. **No oscillation**: Because each layer has different time scales, they didn't interfere with each other

## Conclusion: The Irreplaceable Value of Hierarchical Feedback

Single-layer adaptation systems are brittle—they either react too slowly (missing fast failures) or react too quickly (oscillating on noise). They either optimize locally (missing global opportunities) or optimize globally (too expensive to compute frequently).

Hierarchical feedback loops solve this by **separation of concerns across time scales**:
- Fast layers handle known problems with low latency
- Medium layers coordinate complex adaptations using pre-computed strategies
- Slow layers synthesize novel solutions and evolve the system strategically

This is not just an engineering convenience—it's a fundamental requirement for scaling self-adaptation to systems with hundreds of components, multiple conflicting goals, and uncertainties at multiple time scales. The examples from health systems, IoT networks, and agent orchestration show that this pattern applies across domains.

The key insight: **Adaptation is itself a multi-scale problem that requires multi-scale solutions.**
```

### FILE: control-theory-for-software.md

```markdown
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
```
Monitor: energy_consumed
If energy > hard_limit:
  → Override controller
  → Force system into safe mode (reduce all