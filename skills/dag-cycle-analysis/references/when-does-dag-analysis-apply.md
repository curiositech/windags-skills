# Boundary Conditions: When DAG Cycle Analysis Applies (and When It Doesn't)

## Core Assumptions Required

The paper's framework rests on specific structural assumptions. Understanding when these hold (and when they don't) is critical for applying the techniques to agent systems.

### Assumption 1: Valid Partial Ordering Exists

**Required**: A relation ≺on nodes that is:
- **Reflexive**: u ≺u for all u
- **Antisymmetric**: If u ≺v and v ≺u, then u = v
- **Transitive**: If u ≺v and v ≺w, then u ≺w

**Sources of Valid Ordering**:
1. **Time**: Timestamps on events (u ≺v if u.timestamp < v.timestamp)
2. **Causality**: Physical causation (u ≺v if u causes v)
3. **Prerequisites**: Logical dependencies (u ≺v if v requires u's output)
4. **Hierarchy**: Organizational levels (u ≺v if u is superior to v)

**When It Holds**:
- Citation networks (older → newer papers)
- Build systems (source → compiled → linked → executable)
- Task orchestration (prerequisites → task)
- Event streams (earlier → later events)
- Organizational charts (manager → reports)

**When It Breaks**:
- **Cyclic dependencies**: Mutual recursion, circular imports
- **Concurrent events**: No temporal order if simultaneous
- **Violated hierarchy**: Actual communication patterns cross hierarchical boundaries
- **Noisy data**: Errors in timestamps, retroactive changes

**Example Failure**: Version control with cherry-picks or rebases can violate simple timestamp ordering:
```
Commit A (t=10) cherry-picked from Commit B (t=20)
A ≺B by content dependency
B ≺A by timestamp
Antisymmetry violated → Not a valid poset