---
license: Apache-2.0
name: bordini-hubner-2007-jason
description: Jason multi-agent platform implementing AgentSpeak(L) for practical BDI agent programming and deployment
category: Research & Academic
tags:
  - jason
  - bdi
  - agents
  - multi-agent-systems
  - agentspeak
---

# SKILL: Programming Multi-Agent Systems with BDI Architecture

## When to Use This Skill

Load this skill when facing challenges involving:
- Goal-directed autonomy where systems determine HOW to achieve objectives
- Dynamic replanning when paths are blocked requiring alternative approaches
- Reactive-proactive integration balancing deliberation with responsiveness
- Distributed coordination between autonomous entities
- Context-sensitive behavior where goals require different implementations
- Cascading failure handling where low-level failures trigger high-level recovery

## Decision Points

### Plan Selection Strategy Tree

```
Triggering Event Occurs:
├── Single applicable plan?
│   └── Execute immediately
├── Multiple applicable plans?
│   ├── Context conditions differ? → Select first applicable (specificity order)
│   ├── All contexts true? → Apply selection heuristics:
│   │   ├── Success rate (prior execution history) → Choose highest
│   │   ├── Cost estimate (resource requirements) → Choose lowest
│   │   └── Recency (when last used) → Choose most recent
│   └── Priority conflicts? → Use plan annotation weights
└── No applicable plans?
    ├── Generate failure event (-!goal)
    └── Check for failure handlers

Communication Coordination Decision:
├── Information sharing needed?
│   ├── One-way update → .send(agent, tell, belief)
│   ├── Query response → .send(agent, askOne, query)
│   └── Complete knowledge → .send(agent, askAll, query)
├── Work delegation needed?
│   ├── Agent capable? → .send(agent, achieve, goal)
│   ├── Agent unknown? → Broadcast achieve request
│   └── Critical task? → Send with timeout handling
└── Coordination protocol?
    ├── Sequential handoff → Chain achieve messages
    ├── Parallel execution → Multiple concurrent achieves
    └── Consensus needed → Negotiation protocol
```

### Failure Recovery Decision Matrix

| Failure Type | Detection Rule | Recovery Strategy |
|-------------|----------------|-------------------|
| Action failure | Action returns error/timeout | Try remaining plan body, then backtrack |
| Context invalidated | Context query becomes false | Switch to alternative plan for same goal |
| Goal impossible | All plans exhausted | Propagate failure to parent goal |
| Communication failure | Send timeout/agent unavailable | Retry with alternative agents or methods |
| Belief inconsistency | Contradictory percepts | Trigger belief revision or conflict resolution |

## Failure Modes

### 1. Monolithic Plan Bodies (Procedural Thinking)
**Symptom**: Plans contain complex conditionals handling multiple cases
**Detection Rule**: If plan body has >3 if-then branches based on beliefs
**Diagnosis**: Programmer thinking procedurally instead of declaratively
**Fix**: Split into separate plans with different context conditions

### 2. Belief Staleness Loops (World-Model Drift)
**Symptom**: Agent repeatedly selects inapplicable plans or wrong behaviors
**Detection Rule**: If same plan fails >3 times consecutively with same context
**Diagnosis**: Beliefs not synchronized with world state changes
**Fix**: Add perception updating plans and belief revision guards

### 3. Goal Cascade Explosions (Uncontrolled Decomposition)
**Symptom**: System generates exponentially growing subgoals or infinite recursion
**Detection Rule**: If intention stack depth >10 or same goal readopted cyclically
**Diagnosis**: Missing termination conditions or circular goal dependencies
**Fix**: Add cycle detection guards and base case plans

### 4. Communication Deadlocks (Synchronous Assumption)
**Symptom**: Agents waiting indefinitely for responses that never come
**Detection Rule**: If .send() followed by blocking wait without timeout
**Diagnosis**: Treating asynchronous communication as synchronous RPC
**Fix**: Add timeout handling and alternative response plans

### 5. Context Pollution (Over-Specific Guards)
**Symptom**: No plans applicable despite reasonable belief state
**Detection Rule**: If events generated but no plans selected repeatedly
**Diagnosis**: Context conditions too restrictive or beliefs incomplete
**Fix**: Add default catch-all plans with "true" context

## Worked Examples

### Example: Autonomous Package Delivery Robot

**Scenario**: Robot must deliver package to Building B, Room 205.

**Initial State**: 
- Beliefs: `at(lobby_A)`, `battery(90)`, `hasPackage(pkg123)`
- Goal adoption: `+!deliver(pkg123, building_B, room_205)`

**Decision Process**:

1. **Plan Selection**: Event `+!deliver(pkg123, building_B, room_205)` triggers plan search
   - Plan A context: `battery(X) & X > 80` ✓
   - Plan B context: `battery(X) & X < 30` ✗ 
   - Plan C context: `true` ✓
   - **Select Plan A** (most specific applicable)

2. **Plan A Execution**: 
   ```
   +!deliver(Pkg, Building, Room) : battery(X) & X > 80 <-
       !navigate(Building);
       !findRoom(Room);
       !handover(Pkg).
   ```

3. **Subgoal Decomposition**: `!navigate(building_B)` triggers navigation plans
   - Context check: `hasMap(building_B)` → False
   - Select fallback: `!requestDirections(building_B)`

4. **Dynamic Replanning**: During navigation, belief update `+obstacle(hallway_3)`
   - Current plan: `followRoute(route_1)` 
   - Context invalidated: route blocked
   - **Automatic replan**: Select alternative route plan

5. **Failure Handling**: `!handover(pkg123)` fails (recipient absent)
   - Generates failure event: `-!handover(pkg123)`
   - Failure handler triggered: 
   ```
   -!handover(Pkg) <- !findAlternateRecipient(Pkg); !handover(Pkg).
   ```

**Novice vs Expert Differences**:
- **Novice**: Would write single monolithic navigation function with all cases
- **Expert**: Encodes multiple context-sensitive plans allowing dynamic adaptation
- **Novice**: Would treat failures as exceptions requiring global error handling  
- **Expert**: Designs cascading failure handlers at appropriate abstraction levels

## Quality Gates

- [ ] Each goal has at least 2 plans with different contexts
- [ ] Every plan has explicit failure handler or alternative
- [ ] All belief updates trigger relevant reactive plans
- [ ] Communication includes timeout and failure handling
- [ ] No plan body contains complex conditional logic (>3 branches)
- [ ] Context conditions are testable and mutually exclusive where intended
- [ ] Goal decomposition has clear termination conditions
- [ ] Intention stack depth bounded (detect cycles)
- [ ] All external actions have error handling plans
- [ ] Plan library coverage verified for common scenarios

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- Simple event-driven systems → Use basic event handlers instead
- Stateless request-response APIs → Use REST/microservices instead  
- Deterministic workflows → Use process orchestration tools instead
- Real-time control loops → Use control theory/embedded systems instead
- Large language model agents → Use prompt engineering patterns instead

**When to delegate**:
- For distributed consensus → Use consensus algorithms like Raft
- For load balancing → Use container orchestration tools  
- For data processing → Use stream processing frameworks
- For user interfaces → Use reactive UI frameworks
- For machine learning → Use ML pipeline tools

This skill is specifically for programming autonomous agents that must pursue goals while adapting to changing conditions through plan selection and failure recovery.