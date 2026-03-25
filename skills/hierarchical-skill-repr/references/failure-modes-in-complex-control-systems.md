# Failure Modes in Complex Control Systems: Recognizing and Recovering from Breakdown

## The Brittleness of Complex Systems

Complex systems composed of many interacting components face a paradox: **the same compositional structure that enables sophisticated behavior also creates novel failure modes**. As Sen et al.'s hierarchical skills demonstrate, a level-3 skill (REACHGRASP) depends on level-2 skills (REACH, SEARCHTRACK_force), which depend on level-1 skills (SEARCHTRACK_visual), which depend on primitives (motor controllers, sensors). Failure can occur at any level, propagate upward or downward, and manifest in non-obvious ways.

The paper doesn't explicitly enumerate failure modes, but the structure of the system implies several critical vulnerabilities that any multi-agent orchestration system must address.

## Failure Mode 1: Sensor Degradation / Signal Loss

**Description**: A feedback signal σ required by a TRACK controller becomes unavailable or unreliable.

**In the paper's framework**: Controller state transitions from 0 or 1 (tracking) to − (signal unavailable) or X (unknown).

**Manifestation**:
- Visual SEARCHTRACK fails because lighting changed (object no longer visible)  
- Force SEARCHTRACK fails because contact was lost (hand slipped)
- Proprioceptive tracking fails because sensor malfunction (encoder failure)

**Propagation**:
- **Upward**: If SEARCHTRACK_visual fails (p = −), then REACH (which depends on it) cannot proceed. REACHGRASP (which sequences REACH) fails at an early stage.
- **Sideways**: If REACHGRASP was part of a larger manipulation sequence (pick, place, inspect), the entire sequence stalls.

**Detection**: Monitor controller states. Transition to '−' is a clear signal of signal loss.

**Recovery strategies**:

1. **Re-search**: If SEARCH action is available, attempt to re-acquire signal by sampling from learned distribution Pr(u_τ | convergence_history). This is built into the SEARCHTRACK schema (Figure 1)—if tracking fails, loop back to search.

2. **Alternative modality**: If visual tracking fails, try tactile or proprioceptive tracking. Requires having redundant sensory modalities for the same affordance.

3. **Graceful degradation**: If signal loss is persistent, report failure upward. Don't retry indefinitely. The paper's Algorithm 1 implicitly handles this—if exploratory actions repeatedly fail to converge, eventually either succeed with partial information or timeout.

4. **Model update**: If signal loss is consistent across multiple attempts, update the Bayesian model to reflect lower reliability: Pr(p_ij = 1 | O_i) decreases for that affordance.

**Prevention**: Proactive monitoring of signal quality before committing to actions that depend on it. If signal-to-noise ratio is degrading, switch modalities or abort early rather than waiting for complete failure.

## Failure Mode 2: Controller Non-Convergence / Oscillation

**Description**: A controller remains in state 0 (transient) without reaching 1 (converged), or oscillates between states.

**In the paper's framework**: The 0→1 transition never occurs, or occurs then reverts to 0 repeatedly.

**Causes**:
- **Control gains mistuned**: Oscillation from overly aggressive feedback  
- **Conflicting objectives**: Nullspace projection fails if objectives are not truly in each other's nullspace (see Failure Mode 4)
- **Environmental disturbance**: External forces preventing convergence (object being moved by another agent, wind on a mobile robot)
- **Model mismatch**: The potential function φ doesn't match actual system dynamics (wrong kinematics, unmodeled friction)

**Manifestation**:
- Visual tracker oscillates around target, never settling  
- Force controller hunts for target force, alternately overshooting and undershooting
- Arm reaches for object but path planning causes oscillation around obstacles

**Propagation**:
- **Timeouts**: Higher-level skills waiting for convergence eventually timeout, triggering failure cascades  
- **Resource exhaustion**: Oscillation wastes actuator energy, risks hardware damage from repeated high-frequency movements
- **Downstream degradation**: Even if the oscillating controller eventually converges, the delay disrupts timing for sequential skills

**Detection**: 
- Monitor time in state 0. If duration exceeds expected (learned from historical data), flag oscillation.  
- Monitor control output variance. High variance suggests oscillation/hunting.
- Check error signal frequency spectrum. High-frequency components indicate oscillation rather than smooth convergence.

**Recovery strategies**:

1. **Gain adjustment**: Reduce feedback gains to dampen oscillation. This sacrifices speed for stability.

2. **Replanning**: If obstacle-induced oscillation, trigger replanner to find alternative path.

3. **Switch controllers**: If current potential function φ is problematic, switch to alternative (e.g., from visual servoing to position-based control).

4. **Force timeout**: After N oscillation cycles or T seconds, declare failure and propagate upward rather than continuing indefinitely.

**Prevention**: 
- Extensive testing of control gains across operating conditions  
- Adaptive control that adjusts gains based on observed error dynamics
- Conservative gain scheduling: start with underdamped gains, increase only if convergence is too slow

## Failure Mode 3: Hierarchical Fragility / Cascading Failures

**Description**: Failure at a lower level causes failures to cascade upward through dependent skills.

**In the paper's framework**: If primitive controllers fail, SEARCHTRACK schemas fail; if SEARCHTRACK fails, REACH fails; if REACH fails, REACHGRASP fails; if REACHGRASP fails, entire manipulation task fails.

**Example cascade** (from paper's hierarchy):
1. Pan motor controller develops friction (primitive failure)  
2. SEARCHTRACK_visual cannot maintain track (schema failure)  
3. REACH cannot position arm at target (level-2 failure)