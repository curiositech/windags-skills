---
license: Apache-2.0
name: physics-rendering-expert
description: Real-time rope/cable physics using Position-Based Dynamics (PBD), Verlet integration, and constraint solvers. Expert in quaternion math, Gauss-Seidel/Jacobi solvers, and tangling detection. Activate on 'rope simulation', 'PBD', 'Position-Based Dynamics', 'Verlet', 'constraint solver', 'quaternion', 'cable dynamics', 'cloth simulation', 'leash physics'. NOT for fluid dynamics (SPH/MPM), fracture simulation (FEM), offline cinematic physics, molecular dynamics, or general game physics engines (use Unity/Unreal built-ins).
allowed-tools: Read,Write,Edit,Bash,mcp__firecrawl__firecrawl_search,WebFetch
category: Frontend & UI
tags:
  - physics
  - rendering
  - 3d
  - graphics
  - simulation
pairs-with:
  - skill: metal-shader-expert
    reason: GPU-accelerated physics rendering
  - skill: native-app-designer
    reason: Physics in app animations
---

# Physics & Rendering Expert: Rope Dynamics & Constraint Solving

Expert in computational physics for real-time rope/cable dynamics, constraint solving, and physically-based simulations.

## Decision Points

**Choosing constraint solver approach:**
```
Input: System type & performance requirements
├─ Sequential structure (rope/chain)?
│  ├─ If single rope/chain → Gauss-Seidel (5-10 iterations)
│  └─ If multiple independent ropes → Parallel Gauss-Seidel per rope
└─ Large parallel system (cloth/1000+ particles)?
   ├─ If GPU available → Jacobi solver (compute shader)
   └─ If CPU only → Chunked Gauss-Seidel with spatial partitioning
```

**Tangle detection decision tree:**
```
For each rope segment pair:
├─ If rope-rope proximity < 0.1 * rope_radius AND relative velocity > 2.0
│  ├─ Calculate segment-segment distance
│  ├─ If distance < threshold → Create TangleConstraint
│  └─ Else → Continue monitoring
└─ If no proximity violation → Skip expensive distance calculation
```

**Performance optimization decision:**
```
Frame budget exceeded?
├─ If solver taking >50% budget
│  ├─ Reduce iterations (5 → 3)
│  ├─ Use spatial hashing for collision detection
│  └─ Consider LOD (fewer particles at distance)
└─ If rendering taking >50% budget → Delegate to metal-shader-expert
```

## Failure Modes

### Spring Force Instability
**Symptoms:** Rope oscillates wildly, simulation explodes at high spring constants
**Detection:** If particle velocity magnitude > 10x expected, you've hit this
**Fix:** Replace spring forces with PBD distance constraints: `p.predicted = lerp(p1.predicted, p2.predicted, weight)`

### Gimbal Lock Rotation
**Symptoms:** Sudden orientation flips, rotation "jumps" at 90° angles
**Detection:** If rotation contains Euler angles (pitch/yaw/roll) representation
**Fix:** Convert to quaternions: `q = normalize(vec4(sin(θ/2)*axis, cos(θ/2)))`

### Solver Over-Iteration
**Symptoms:** Performance bottleneck with minimal visual improvement after iteration 10
**Detection:** If solver iterations > 15 or frame time > 16ms on target hardware
**Fix:** Cap iterations at 5-10; if more constraint satisfaction needed, use XPBD with compliance parameters

### Memory Allocation Per Frame
**Symptoms:** Frame rate hitches, garbage collection spikes during simulation
**Detection:** If `new`/`malloc` calls inside update loop or growing collections
**Fix:** Pre-allocate particle buffers, use object pools for constraints, fixed-size spatial grids

### Ghost Collisions
**Symptoms:** Ropes stick together without actual contact, false tangle detection
**Detection:** If TangleConstraints created when visual gap exists between ropes
**Fix:** Implement proper segment-segment distance with parametric line equations, not bounding box overlap

## Worked Examples

### Example 1: Dog Leash Implementation

**Scenario:** Three-dog leash system with tangle detection (60 particles total)

**Setup decisions:**
- 20 particles per leash (adequate resolution for 6ft leash)
- Gauss-Seidel solver (sequential chains)
- 5 iterations per frame (balance quality/performance)

**Solver iteration walkthrough:**
```
Frame start: Dogs pulling in different directions
Iteration 1: Distance constraints partially satisfied, 15% error remaining
Iteration 3: Error down to 3%, visual quality acceptable
Iteration 5: Error < 1%, diminishing returns beyond this point
```

**Tangle detection triggers:**
- Leash A and B proximity < 0.05m at t=0.8s
- Segment-segment distance = 0.03m < threshold
- Create TangleConstraint between closest particles
- Friction coefficient = 0.3 (prevents sliding through)

**Performance result:** 0.7ms total (0.4ms solver + 0.3ms tangle detection)

### Example 2: Climbing Rope Under Load

**Scenario:** 30m dynamic climbing rope with 150 particles, climber fall simulation

**Critical decisions:**
- XPBD with compliance for rope stretch (α = 0.1)
- Velocity damping = 0.98 to prevent oscillation
- Additional bending constraints for realistic coiling

**Load case walkthrough:**
```
t=0: Rope hanging freely, minimal constraints active
t=0.5s: Climber begins fall, tension propagates upward
t=1.2s: Peak load reached, rope stretches 8% (realistic for dynamic rope)
t=2.0s: Oscillations damped, stable configuration
```

**Expert vs novice differences:**
- **Novice:** Uses uniform particle spacing, ignores stretch characteristics
- **Expert:** Variable rest lengths based on rope elasticity, implements proper dynamic response

## Quality Gates

- [ ] Solver converges within 5-10 iterations (error < 2% of constraint length)
- [ ] Frame time maintains 60fps target (< 16.67ms total, physics < 2ms)
- [ ] No particle positions become NaN or exceed world bounds (±1000 units)
- [ ] Distance constraints maintain rope length within ±5% tolerance
- [ ] Tangle detection triggers only when ropes actually intersect (no ghost collisions)
- [ ] Memory allocation remains constant during simulation (no frame-by-frame growth)
- [ ] Quaternion rotations remain normalized (w² + x² + y² + z² = 1.0 ± 0.001)
- [ ] Visual jitter amplitude < 1% of rope segment length
- [ ] Energy conservation: total system energy decreases only due to intentional damping
- [ ] Collision response prevents rope interpenetration (contact distance > 0)

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- Fluid dynamics (water, smoke) → Use dedicated SPH/MPM solvers
- Fracture simulation → Requires FEM or specialized fracture engines  
- Offline cinematic physics → Use Houdini/Maya built-in solvers
- Molecular dynamics → Different force models, use specialized MD packages
- Game engine integration → Use Unity Physics/Unreal Chaos built-ins instead
- Large-scale cloth (>10K particles) → Delegate to GPU compute specialists
- Soft body deformation → Use FEM-based approaches, not PBD

**Delegate these scenarios:**
- GPU compute shader optimization → **metal-shader-expert**
- Visual debugging and profiling UI → **native-app-designer**  
- Advanced collision detection → **3d-graphics-expert**
- Performance profiling → **optimization-expert**