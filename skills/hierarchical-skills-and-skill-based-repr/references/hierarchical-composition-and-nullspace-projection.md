# Hierarchical Composition and Nullspace Projection: Coordinating Multiple Objectives Without Conflict

## The Redundancy Problem in Complex Control

Real-world agents face a fundamental challenge: **they have more degrees of freedom than strictly necessary for most individual tasks**. A robot arm with 7 joints can reach a point with infinitely many configurations. A multi-agent system with 180 skills has vast option spaces for accomplishing most goals. This redundancy is valuable—it provides flexibility, robustness, fault tolerance—but creates a coordination problem: *how do you pursue multiple objectives simultaneously without them interfering?*

The naive approach (weighted sum of objectives) fails because it compromises all objectives—nothing is achieved well. The sequential approach (achieve goal 1, then goal 2, then goal 3) is inefficient and brittle—if achieving goal 2 invalidates goal 1, you're stuck in a loop.

Sen et al. present a principled solution from robotics that transfers directly to agent orchestration: **nullspace projection** combined with explicit priority hierarchies.

## The Mathematics of Nullspace Projection

Consider two control objectives represented as potential functions φ₁ and φ₂, each generating control gradients g₁ = ∂φ₁/∂u and g₂ = ∂φ₂/∂u where u represents control variables (joint angles, task parameters, skill selections).

**Weighted sum approach**: u = α₁g₁ + α₂g₂
- Problem: Both objectives are compromised. If they conflict, you satisfy neither fully.

**Nullspace projection approach**: Define a priority c₂ ⊳ c₁ ("c₂ subject to c₁")
1. Compute the Jacobian J₁ mapping control space to error space for objective 1
2. Find the nullspace N₁ = {u : J₁u = 0} (directions that don't affect objective 1)
3. Project g₂ into N₁: g₂_projected = (I - J₁†J₁)g₂ where J₁† is the pseudoinverse
4. Execute: u = g₁ + g₂_projected

This guarantees: **The superior objective (c₁) is fully satisfied; the subordinate objective (c₂) is achieved as much as possible without compromising c₁.**

The notation c₂ ⊳ c₁ is elegant shorthand for this mathematical operation. Nakamura et al.'s original work (cited in the paper) proved this approach optimal under the constraint that higher-priority tasks must not be degraded.

## SEARCHTRACK Hierarchies: Practical Examples

**Example 1: Concurrent head and arm control** (implicit in developmental stage progression)

Priority: "Visually track object" (head) ⊳ "Reach toward object" (arm)

The arm's reaching controller is projected into the nullspace of the head's visual tracking. This means:
- The head always maintains visual fixation (superior objective)  
- The arm reaches as directly as possible *subject to* not requiring head movements that break visual lock
- If the object moves, the head follows; the arm adapts its trajectory accordingly

Without nullspace projection, the arm and head would "fight"—arm reaching might pull the object out of view, head tracking might reposition in ways that make reaching harder.

**Example 2: REACHGRASP schema** (Figure 2)

The force tracking controller Φ|F_hand is implicitly subordinate to the visual tracking Φ|(u,v)_arm. The hand closure forces are regulated *while maintaining* the arm's positioning of the hand at the visually-tracked grasp location.

This is why the schema sequence notation matters:
1. First achieve Φ|(u,v)_arm (position hand at target)
2. Then activate Φ|F_hand ⊳ Φ|(u,v)_arm (close hand while maintaining position)

The sequential-then-concurrent structure ensures the grasp doesn't "pull away" from the target during closure.

**Example 3: Multi-feature tracking** (the '+' notation)

The radio example mentions the robot might need to track multiple visual features simultaneously to grasp effectively (object centroid, orientation marker, bounding box edge). These are concurrent controllers with priority structure:

Φ|orientation ⊳ Φ|centroid

The arm must track the object's center (can't grasp if positioned wrong), but *subject to that constraint*, also align with the principal axis orientation. If perfect alignment would require moving away from center, alignment is compromised to maintain center tracking.

## Translating to Agent Orchestration: Multi-Objective Skill Execution

Consider a WinDAGs scenario: "Debug the authentication service while maintaining system uptime and preserving user data."

**Three objectives**:
1. Fix the bug (primary task goal)
2. Keep system running (availability constraint)  
3. Don't corrupt data (safety constraint)

**Naive orchestration**: Route to three specialist agents separately, hope their outputs don't conflict. Risk: The debugger's fix might require downtime or database schema changes.

**Nullspace projection orchestration**:
1. Establish priority: safety ⊳ availability ⊳ bug_fix  
2. The "fix bug" skill operates in the nullspace of "preserve data"—only bug fixes that provably maintain data integrity are considered
3. Within that constrained space, operate in the nullspace of "maintain uptime"—only zero-downtime fixes
4. Whatever remains is the feasible solution space for the debugging agent

This is **constraint-propagating orchestration**: higher-priority objectives aren't soft preferences but hard constraints that shrink the action space for lower-priority objectives.

## Implementing Priority Hierarchies in DAG-Based Systems

**Node annotations**: Each DAG node (skill invocation) has:
- `priority_level`: Integer, lower = higher priority  
- `constraints_imposed`: What aspects of state must be preserved
- `constraint_satisfaction`: How this node proves it respects upstream constraints

**Dependency types**:
- **Sequential dependency** (standard): B waits for A to complete
- **Nullspace dependency**: B executes concurrently but projects into A's nullspace  
- **Monitor dependency**: A continuously checks B's constraint satisfaction

**Example DAG**:
```
[monitor_data_integrity] (priority 0, always active)
          ↓ (nullspace dependency)
[maintain_service_uptime] (priority 1, concurrent)
          ↓ (nullspace dependency)  
[diagnose_auth_bug] (priority 2, concurrent)
          ↓ (sequential dependency)
[generate_fix] (priority 3, waits for diagnosis)
          ↓ (nullspace dependency to uptime & integrity)
[deploy_fix] (priority 4, constrained by all above)
```

The nullspace dependencies ensure lower-priority nodes can't violate higher-priority constraints. If [generate_fix] proposes a solution that would violate [maintain_service_uptime], it's automatically projected out—the generator must search within the "feasible fixes that don't require downtime" subspace.

## The Power of "Subject To" Thinking

The ⊳ notation encourages a critical mindset for complex problem-solving: **What are my non-negotiable constraints vs. optimizable objectives?**

Traditional planning treats most goals as soft constraints—maximize utility weighted sum, accept tradeoffs. But real-world engineering has hard constraints:
- Code review *subject to* backward compatibility  
- Performance optimization *subject to* correctness
- Feature addition *subject to* security properties

The nullspace projection framework makes this explicit. When you declare c₂ ⊳ c₁, you're stating: "c₁ is axiomatic; c₂ is best-effort within the space where c₁ holds."

## Failure Modes and Limitations

**Empty nullspace**: If high-priority constraints are contradictory or too restrictive, the nullspace for lower-priority objectives becomes empty. The projection operation yields zero—no action satisfies the constraints.

*Detection*: Monitor the norm ||g₂_projected||. If it's dramatically smaller than ||g₂||, the nullspace is nearly empty.

*Response*: Signal infeasibility to the orchestrator. Either relax constraints (reduce priority of some objectives) or declare the task impossible under current constraints.

**Priority inversion**: If priorities are incorrectly specified (e.g., "optimize performance" given higher priority than "maintain correctness"), nullspace projection will dutifully optimize performance while allowing correctness violations.

*Prevention*: Careful priority assignment based on task semantics. Safety and correctness should almost always be highest priority.

**Computational cost**: Computing pseudoinverses and nullspace projections for high-dimensional systems is expensive. For WinDAGs with 180 skills and complex state spaces, real-time nullspace projection may be prohibitive.

*Mitigation*: Pre-compute nullspaces for common constraint combinations. Cache projection matrices. Use approximate projections for near-real-time response.

**Local optimality**: Nullspace projection finds the best solution *locally* within the current feasible space. It doesn't guarantee global optimality or discover creative solutions that might require temporarily violating low-priority constraints to eventually satisfy high-priority ones better.

*Mitigation*: Combine with hierarchical planning. Use nullspace projection for execution-level control but allow higher-level planners to explore sequences that might temporarily deprioritize objectives if overall trajectory is better.

## Connection to Control Theory: Task Priority Redundancy Resolution

Nakamura et al.'s original work addressed redundant manipulators (more joints than necessary for positioning). The key insight: redundancy is valuable *if* you have a systematic way to exploit it for secondary objectives.

Sen et al. extend this from motor control to cognitive control: a robot with multiple learned schemas has "cognitive redundancy"—many ways to achieve most goals. Nullspace projection exploits this redundancy to simultaneously:
- Achieve primary goals (track target object)
- Maintain secondary constraints (keep object in camera view)  
- Optimize tertiary objectives (minimize joint velocity)

For multi-agent systems, the redundancy is in the skill space: 180+ skills provide multiple paths to most goals. Nullspace projection allows pursuing the goal *subject to* constraints on resource usage, risk, latency, etc.

## Design Pattern: Hierarchical Constraint Propagation

**For WinDAGs orchestrators**:

1. **Identify constraint hierarchy**: Before decomposing a task, list all constraints and priority-order them. Example:
   - P0: Don't corrupt production data (safety)
   - P1: Complete within 5min timeout (availability)  
   - P2: Minimize API calls (cost)
   - P3: Provide detailed logging (observability)

2. **Propagate constraints downward**: Each subgraph/skill invocation inherits constraints from above. The "detailed logging" node (P3) must operate within the constraint space defined by P0-P2.

3. **Project action spaces**: When multiple skills could satisfy a subgoal, project their action spaces through higher-priority constraints. The skill that has the largest remaining feasible space (most freedom to optimize) is preferred.

4. **Monitor constraint violations**: If a subordinate node's projection yields empty space, propagate infeasibility signal upward. Don't silently fail or violate constraints.

5. **Dynamic reprioritization**: Allow runtime priority adjustment based on context. A normally P2 objective might become P0 if system state changes (e.g., "minimize API calls" becomes "don't exceed rate limit" when approaching throttling threshold).

## Relationship to Schema Composition

Nullspace projection explains *how* schemas compose without interference:

- **Sequential composition** (→): First schema completes, second inherits state, no conflict possible
- **Concurrent composition** (⊳): Second schema projects into first's nullspace, explicit conflict resolution  
- **Parallel composition** (||): Only valid when nullspaces don't intersect (truly independent objectives)

The paper's REACHGRASP example (Figure 2) uses sequential (visual track → force track) followed by concurrent (force ⊳ visual). This is optimal: establish the visual reference first (can't grasp what you can't see), then regulate force while maintaining visual lock.

For agent systems: identify which skills can safely parallelize (independent nullspaces) vs. need nullspace projection (overlapping resources) vs. must sequence (output of one is input to other).

## Critical Insight: Nullspace Projection Enables Satisficing Under Multiple Objectives

Herbert Simon's concept of "satisficing" (satisfying + sufficing) describes decision-making under bounded rationality: find solutions that are "good enough" across multiple criteria rather than optimal on any single criterion.

Nullspace projection operationalizes satisficing: **High-priority objectives are fully satisfied; lower-priority objectives are satisficed within the remaining feasible space.**

This is profoundly different from optimization-based approaches that find Pareto-optimal tradeoffs. Nullspace projection has a clear lexicographic priority: no amount of improvement on objective 2 justifies degrading objective 1.

For agent systems operating in uncertain, high-stakes environments (production systems, safety-critical applications), this hard-constraint satisfaction is often more appropriate than soft-constraint optimization. "Don't corrupt data" isn't negotiable; "minimize latency" is optimized subject to that hard constraint.