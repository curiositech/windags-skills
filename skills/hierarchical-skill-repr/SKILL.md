---
license: Apache-2.0
name: hierarchical-skill-repr
description: Representations for hierarchical skill structures including knowledge graphs and ontological decomposition
category: Research & Academic
tags:
  - skill-representation
  - hierarchical
  - knowledge-graphs
  - decomposition
  - ontology
---

# Hierarchical Skills and Affordance-Based Representation

## When to Use This Skill

Load this skill when facing problems involving autonomous skill acquisition, sensorimotor grounding, hierarchical control composition, or bridging symbolic reasoning with continuous control. Particularly effective when agents must learn domain-general capabilities without task supervision.

## Decision Points

### Schema Selection for Ambiguous Objects

```
IF object_uncertainty > convergence_threshold:
    IF low-cost_visual_exploration available:
        → Execute visual inspection from multiple angles
        → Update Bayesian belief over object affordances
    ELSE IF tactile_exploration safe:
        → Execute gentle contact with surface normals
        → Track force convergence patterns
    ELSE:
        → Default to most probable schema based on priors

IF object_uncertainty ≤ convergence_threshold:
    IF goal_affordance_confidence > action_threshold:
        → Execute goal schema (grasp, manipulate)
    ELSE:
        → Select schema maximizing I(action; goal_affordance)
```

### Curriculum Progression Logic

```
IF schema_convergence_rate < stability_threshold:
    → Check prerequisite schemas are stable
    → Reduce DOF constraints further
    → Increase practice iterations before advancement

IF schema_convergence_rate ≥ stability_threshold:
    IF subordinate_schemas available AND superior_schema stable:
        → Attempt nullspace composition: subordinate ⊳ superior
    ELSE IF next_complexity_level unlocked:
        → Add sensorimotor resource (additional DOF, sensor modality)
        → Initialize new schema learning
```

### Hierarchical Control Composition

```
IF multiple_control_objectives active:
    Rank by criticality:
    IF safety_constraint violated:
        → All controllers ⊳ collision_avoidance
    ELSE IF visual_track required for task:
        → force_control ⊳ visual_track
        → orientation_adjust ⊳ (force_control ⊳ visual_track)
    ELSE:
        → Apply standard priority hierarchy from training

Calculate: a_combined = a_superior + (I - J_superior†J_superior) * a_subordinate
```

## Failure Modes

### **Schema Interference Cascade**
**Detection Rule**: If subordinate controller performance degrades when superior controller activates, or if combined error increases monotonically
- **Symptom**: Tracking error increases when force control added to visual servoing
- **Diagnosis**: Nullspace projection incorrectly computed or superior Jacobian ill-conditioned
- **Fix**: Recalculate J_superior†, add damping term, or reduce subordinate controller gains

### **Premature Convergence Lock**
**Detection Rule**: If schema reports "converged" but goal affordance uncertainty remains high (H(g) > threshold)
- **Symptom**: Robot attempts grasp after single visual glimpse, fails due to pose uncertainty
- **Diagnosis**: Convergence threshold too loose or information gain computation disabled
- **Fix**: Tighten convergence criteria, enable exploratory action selection, validate affordance confidence before commitment

### **Resource Scaffolding Collapse**
**Detection Rule**: If complex schema learning fails repeatedly and prerequisite schemas show instability
- **Symptom**: Force-based manipulation never converges despite extended training
- **Diagnosis**: Visual tracking (prerequisite) insufficiently stable to support force control learning
- **Fix**: Return to simpler resource restrictions, retrain prerequisite schemas, validate tracking error bounds

### **Affordance Model Drift**
**Detection Rule**: If object recognition confidence decreases over time despite consistent sensory input
- **Symptom**: System increasingly uncertain about object identity during repeated interactions
- **Diagnosis**: Generative affordance model not updating correctly or accumulating prediction errors
- **Fix**: Recalibrate Bayesian priors, validate sensor calibration, reset affordance statistics

### **Exploration-Exploitation Deadlock**
**Detection Rule**: If mutual information I(a; g) never decreases below action threshold despite multiple exploratory actions
- **Symptom**: Robot endlessly circles object without attempting goal action
- **Diagnosis**: Information gain computation stuck or action threshold unreachable
- **Fix**: Implement exploration timeout, reduce information threshold, validate sensor noise models

## Worked Examples

### Example 1: Learning Cup Grasping with Resource Progression

**Initial State**: Robot with 7-DOF arm, RGB camera, force sensors. No prior cup knowledge.

**Phase 1 - Visual Tracking (L1)**
- Resource restriction: Vision only, 3 DOF (pan/tilt/zoom)
- Schema: SEARCHTRACK_visual on cup rim
- Curriculum: Random cup poses, reward convergence (tracking error < 5px for 2 seconds)
- **Novice miss**: Would try to learn full 7-DOF grasping immediately
- **Expert insight**: Visual stability is prerequisite for force-based schemas

**Phase 2 - Reach Coordination (L2)**  
- Resource addition: Arm motion (3 DOF translation)
- Schema: REACH ⊳ SEARCHTRACK_visual (reaching in nullspace of visual tracking)
- **Decision point**: If visual tracking error > threshold → pause reach, stabilize vision first
- **Failure recovery**: Visual tracking lost during reach → return to search phase, reacquire target

**Phase 3 - Force Integration (L3)**
- Full resources: 7-DOF + vision + force
- Schema: SEARCHTRACK_force ⊳ (REACH ⊳ SEARCHTRACK_visual)
- **Complex decision**: Force contact detected → switch superior objective from visual to force while maintaining visual in nullspace
- **Expert insight**: Hierarchical composition prevents control conflicts

**Final affordance model**: Cup = {rim_visual_tracking: [x,y,θ] distribution, surface_force_tracking: normal directions, grasp_points: force + visual intersection}

### Example 2: Object Recognition Under Uncertainty

**Scenario**: Ambiguous cylindrical object (cup vs. can vs. bottle) partially occluded.

**Decision trace**:
1. Initial observation → P(cup)=0.4, P(can)=0.3, P(bottle)=0.3, H(object)=1.58 bits
2. Goal: grasp handle (only cups have handles)
3. Handle uncertainty: H(handle_affordance)=1.2 bits > threshold=0.5 bits
4. Information gain calculation:
   - I(rotate_view; handle) = 0.8 bits (high - could reveal handle)
   - I(gentle_contact; handle) = 0.2 bits (low - tactile doesn't detect handles well)
5. Execute: rotate view 45°
6. Updated belief: P(cup)=0.8, handle visible with confidence 0.9
7. H(handle_affordance)=0.3 bits < threshold → execute grasp schema
8. **Expert insight**: Information-theoretic action selection prevented failed grasp attempt

## Quality Gates

- [ ] Schema convergence rate >80% for target complexity level before advancing
- [ ] Tracking error remains <10% of signal range during stable convergence
- [ ] Nullspace projection reduces subordinate/superior control conflict to <5% performance degradation
- [ ] Object affordance models achieve >90% recognition accuracy across pose variations
- [ ] Information gain computations reduce goal uncertainty below action threshold within 5 exploratory actions
- [ ] Prerequisite schema stability maintained when learning dependent schemas
- [ ] Bayesian belief updates converge within 3 sigma bounds of predicted distributions
- [ ] Control hierarchy maintains real-time performance (update rate >10Hz for dynamic tasks)
- [ ] Schema composition produces emergent behaviors not present in individual components
- [ ] Failure recovery mechanisms restore stable operation within 2 seconds of detected breakdown

## NOT-FOR Boundaries

**Do NOT use for**:
- Pure symbolic reasoning without sensorimotor grounding → Use [logical-reasoning] instead
- Tasks requiring millisecond response times → Use [reactive-control] instead
- Environments with no convergent feedback signals → Use [open-loop-planning] instead
- Single-shot recognition without action consequences → Use [pattern-classification] instead

**Delegate when**:
- High-level task planning needed → Use [hierarchical-planning] for goal decomposition
- Natural language understanding required → Use [semantic-parsing] for command interpretation
- Social interaction dynamics → Use [multi-agent-coordination] for collaborative behaviors
- Abstract mathematical reasoning → Use [symbolic-computation] for formula manipulation

**Resource requirements**:
- Minimum: Closed-loop control capability, multiple DOF, reliable sensor feedback
- Scales poorly: With discrete-only state spaces, purely reactive tasks, human-speed interactions