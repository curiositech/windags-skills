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